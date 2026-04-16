import z from 'zod'

export const accountSchema = z
  .object({
    display_name: z.string(),
    email: z.string(),
  })
  .transform((o) => ({
    displayName: o.display_name,
    email: o.email,
  }))

export type Account = z.infer<typeof accountSchema>
