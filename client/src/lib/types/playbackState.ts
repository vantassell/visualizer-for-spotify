import { z } from 'zod'
import { albumSchema } from './album'
import { artistSchema } from './artist'

export const playbackItemSchema = z.object({
  album: albumSchema,
  artists: z.array(artistSchema),
  name: z.string(),
  external_urls: z.object({ spotify: z.string() }),
})

// track link from playbackItem.uri
// spotifyTrackLink =
// `http://open.spotify.com/track/${spotifyURI.split(':').pop()}`

export type PlaybackItem = z.infer<typeof playbackItemSchema>

export const playbackStateSchema = z.object({
  item: playbackItemSchema.optional(),
  notPlaying: z.boolean().default(false),
})

export type PlaybackState = z.infer<typeof playbackStateSchema>
