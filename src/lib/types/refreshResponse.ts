import z from 'zod'

export const resfreshResponseSchema = z
  .object({
    access_token: z.string(),
    refresh_token: z.string(),
  }) // transform property names
  .transform((o) => ({
    accessToken: o.access_token,
    refreshToken: o.refresh_token,
  }))

export type RefreshResponse = z.infer<typeof resfreshResponseSchema>
