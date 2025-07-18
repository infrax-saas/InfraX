import { prisma } from "../prisma/db";
import { CODES, type OutputSchema } from "../types/generalTypes";
import { initializeSaasConfigSchema, type initializeSaasConfigOutputSchema } from "../types/saasConfigType"

// before calling this fxn call an authentication fxn and pass userid as prop here
export const initalizeSaaS = async (props: any): Promise<OutputSchema<initializeSaasConfigOutputSchema>> => {

  const { data, error } = initializeSaasConfigSchema.safeParse(props);

  if (error) {
    // handle error
    return {
      code: CODES.BADREQUEST,
      error: error,
      success: false,
      response: {
        message: "InvalidType"
      }
    }
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
      // saas with same name present
      return {
        code: CODES.BADREQUEST,
        success: false,
        response: {
          message: "SaaSNameNotAvailable"
        }
      }
    }

    const createSaaS = await prisma.saaSConfig.create({
      data: {
        name,
        userId,
        BillingPlans: ``
      }
    })

    // add providers in providers table
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

    return {
      code: CODES.OK,
      success: true,
      response: {
        message: "success"
      }
    }

  } catch (error) {
    console.log(error);
    return {
      code: CODES.INTERNALSERVERERROR,
      error: Error("INTERNALSERVERERROR"),
      success: false,
      response: {
        message: "INTERNALSERVERERROR"
      }
    }
  }


}
