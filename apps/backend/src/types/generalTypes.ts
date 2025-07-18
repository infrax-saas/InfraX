export type OutputSchema<T> = {
  code: number,
  error?: Error,
  response: T,
  success: boolean
}

export const CODES = {
  BADREQUEST: 400,
  OK: 200,
  INTERNALSERVERERROR: 500,
  NOTFOUND: 404
}

