import { Router, type Request, type Response } from "express";
import { prisma } from "../prisma/db";
import { addProviderSchema, getSaaSByIDConfigSchema, initializeSaasConfigSchema } from "../types/saasConfigType"
import { requireAuth } from "../auth/authmiddleware";
import { randomBytes } from "crypto";

const generateAPIKey = (): string => {
  return randomBytes(32).toString("hex");
}

export const saasRouter = Router();

saasRouter.post('/createSaas', requireAuth, async (req: Request, res: Response) => {
  const { email } = req.user!;
  const { data, error } = initializeSaasConfigSchema.safeParse(req.body);

  console.log(data, email, error);

  if (error) {
    return res.status(400).json({
      code: 400,
      message: 'Invalid body',
      response: null
    })
  }

  console.log('here');

  const { name, providers, description, category, status } = data;

  try {

    const appuser = await prisma.appUser.findFirst({ where: { email } });
    if (!appuser) {
      return res.status(400).json({
        code: 400,
        message: 'Invalid body',
        response: null
      })
    }

    const saas = await prisma.saaSConfig.findFirst({
      where: {
        appUserId: appuser.id,
        name
      }
    })

    if (saas) {
      return res.status(400).json({
        code: 400,
        message: "saas name not available",
        response: null
      })
    }

    const createSaaS = await prisma.saaSConfig.create({
      data: {
        name,
        description,
        category,
        status,
        appUserId: appuser.id,
        BillingPlans: ``
      }
    })

    const key = generateAPIKey();

    await prisma.apiKey.create({
      data: {
        key,
        saasId: createSaaS.id
      }
    })

    await Promise.all(
      providers.map(provider =>
        prisma.provider.create({
          data: {
            appId: provider.appId,
            type: provider.type,
            secretKey: provider.secretKey,
            saasConfigId: createSaaS.id
          }
        })
      )
    );

    return res.status(201).json({
      code: 201,
      message: "created",
      resonse: createSaaS.id
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 500,
      message: "internal server error",
      resonse: null
    })
  } finally {
    await prisma.$disconnect();
  }

})

saasRouter.post('/addProvider', async (req: Request, res: Response) => {
  const { data, error } = addProviderSchema.safeParse(req.body);

  if (error) {
    return res.status(400).json({
      code: 400,
      message: 'Invalid body',
      response: null
    })
  }

  const { id, provider } = data;
  const { appId, secretKey, type } = provider;

  try {

    const saas = await prisma.saaSConfig.findFirst({ where: { id } });
    if (!saas) {
      return res.status(400).json({
        code: 400,
        message: `No saas with id: ${id}`,
        resonse: null
      })
    }

    const provider = await prisma.provider.create({
      data: {
        type,
        appId,
        secretKey,
        saasConfigId: id
      }
    })
    return res.status(200).json({
      code: 200,
      message: "added provider",
      resonse: provider.id
    })


  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 500,
      message: "internal server error",
      resonse: null
    })
  } finally {
    await prisma.$disconnect();
  }

})

saasRouter.get("/getAllSaaS", requireAuth, async (req: Request, res: Response) => {
  try {

    const { email } = req.user!;

    console.log(email);

    const appuser = await prisma.appUser.findFirst({
      where: {
        email
      }
    })

    if (!appuser) {
      return res.status(400).json({
        code: 400,
        message: `No user with ${email} email`,
        resonse: null
      })
    }

    const saas = await prisma.saaSConfig.findMany({
      where: {
        appUserId: appuser.id
      },
      include: {
        _count: {
          select: {
            User: true,
          },
        },
      },
    });

    const response = saas.map(s => {
      return {
        id: s.id,
        name: s.name,
        createdAt: s.createdAt,
        description: s.description,
        category: s.category,
        status: s.category,
        integrations: 0,
        users: s._count.User,
      }
    })

    return res.status(200).json({
      code: 200,
      messae: 'saas',
      response
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 500,
      message: "internal server error",
      resonse: null
    })
  } finally {
    await prisma.$disconnect();
  }
})

saasRouter.post("/getSaaSByID", requireAuth, async (req: Request, res: Response) => {
  try {

    const { data, error } = getSaaSByIDConfigSchema.safeParse(req.body);

    if (error) {
      return res.status(400).json({
        code: 400,
        message: 'Invalid body',
        response: null
      })
    }

    const id = data.id;

    const saas = await prisma.saaSConfig.findFirst({
      where: {
        id
      },
      include: {
        _count: {
          select: {
            User: true
          }
        }
      }
    })

    if (!saas) {
      return res.status(404).json({
        code: 404,
        message: `No saas with id:  ${id}`,
        resonse: null
      })
    }

    const apikeys = await prisma.apiKey.findMany({
      where: {
        saasId: id
      }
    })

    return res.status(200).json({
      code: 200,
      message: "saas found",
      response: {
        saas: {
          id: saas.id,
          name: saas.name,
          description: saas.description,
          category: saas.category,
          status: saas.status,
          users: saas._count.User,
          createdAt: saas.createdAt
        },
        apikeys
      }
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 500,
      message: "internal server error",
      resonse: null
    })
  } finally {
    await prisma.$disconnect();
  }
})
