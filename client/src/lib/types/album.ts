import { z } from 'zod'
import { albumImageSchema } from './albumImage'

export const albumSchema = z.object({
  name: z.string(),
  images: z.array(albumImageSchema),
})

export type Album = z.infer<typeof albumImageSchema>
