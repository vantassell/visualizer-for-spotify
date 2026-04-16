import z from 'zod'

export const errorMsgSchema = z.object({
  status: z.number(),
  message: z.string(),
})

export type ErrorMsg = z.infer<typeof errorMsgSchema>

export const errorMsgEvenlopeSchema = z.object({
  error: errorMsgSchema,
})

export const refreshAccessTokenErrorSchema = z.object({
  error: z.string(),
  error_description: z.string(),
})

export type RefreshAccessTokenError = z.infer<
  typeof refreshAccessTokenErrorSchema
>
