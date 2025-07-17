import { billingPlansSchema, initializeSaasConfigSchema } from "../types/saasConfigType"

// before calling this fxn call an authentication fxn and pass userid as prop here
export const initalizeSaaS = (props: any) => {

  const { data, error } = initializeSaasConfigSchema.safeParse(props);

  if (error) {
    // handle error
    return;
  }


}
