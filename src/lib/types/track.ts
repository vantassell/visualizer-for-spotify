import { z } from 'zod'

export const trackSchema = z.object({
  media_id: z.string(),
  title: z.string(),
  year: z.number(),
  thumbnail_url: z.string(),
  studio_id: z.string(),
  studio_name: z.string(),
  stripe_id: z.string(),
  cost: z.number().gt(0),
  blurb: z.string(),
  genre: z.string(),
  runtime: z.number().gt(0),
  director: z.string(),
  writer: z.string(),
})

