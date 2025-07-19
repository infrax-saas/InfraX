import { Router, type Request, type Response } from "express";
import { prisma } from "../prisma/db";
import { addProviderSchema, initializeSaasConfigSchema } from "../types/saasConfigType"

export const saasRouter = Router();

saasRouter.post('/createSaas', async (req: Request, res: Response) => {
  const { data, error } = initializeSaasConfigSchema.safeParse(req.body);

  if (error) {
    return res.status(400).json({
      code: 400,
      message: 'Invalid body',
      response: null
    })
  }

  const { name, userId, providers } = data;

  try {
    const saas = await prisma.saaSConfig.findFirst({
      where: {
        userId,
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
        userId,
        BillingPlans: ``
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


