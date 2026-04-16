import { z } from 'zod'

export const albumImageSchema = z.object({
  url: z.string(),
  height: z.number(),
  width: z.number(),
})

export type AlbumImage = z.infer<typeof albumImageSchema>

export const albumArraySchema = z.object({
  images: z.array(albumImageSchema),
})
