import z from 'zod'

export const artistSchema = z.object({
  name: z.string(),
})

export type Artist = z.infer<typeof artistSchema>

export const artistArraySchema = z.object({
  artists: z.array(artistSchema),
})
