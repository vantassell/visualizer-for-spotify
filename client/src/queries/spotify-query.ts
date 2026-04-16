import { getAccessToken } from '#/lib/tokens'
import { errorMsgEvenlopeSchema, type ErrorMsg } from '#/lib/types/error'
import {
  playbackStateSchema,
  type PlaybackState,
} from '@/lib/types/playbackState'
import { queryOptions } from '@tanstack/react-query'

// export these options
export const spotifyQueryOptions = {
  getTrackInfo: () => {
    return queryOptions({
      queryKey: ['trackInfo'],
      queryFn: getCurrentTrack,
      staleTime: 60 * 1000, // 1 minute
      gcTime: 60 * 1000, // 1 minute
      refetchInterval: 2000,
      retry: false,
    })
  },
}

// internal function that's used in the above options
export async function getCurrentTrack(): Promise<PlaybackState> {
  // console.log('starting spotify-query.getCurrentTrack() query')
  const accessToken = getAccessToken()
  if (accessToken === null) {
    throw new Error('no Access Token found')
  }

  const baseURL = 'https://api.spotify.com/v1/me/player/currently-playing'

  const res = await fetch(baseURL, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  })

  // 204 --> No track playing on spotify
  if (res.status == 204) {
    const result: PlaybackState = {
      notPlaying: true,
    }
    return result
  }

  // read response and parse into json
  const data = await res.json().catch((err) => {
    const errMsg =
      'Parsing json out of fetch response from API in spotify-query.getCurrenTrack(): ' +
      err
    console.error(errMsg)
    throw new Error(errMsg)
  })

  // handle non-200 status
  if (!res.ok) {
    const envelope = errorMsgEvenlopeSchema.safeParse(data)

    if (envelope.success) {
      const errorMsg: ErrorMsg = envelope.data.error
      throw new Error(
        `spotify-query: status: ${errorMsg.status} msg: ${errorMsg.message}`,
      )
    }

    // else, zod could not parse api response
    console.log(`zod error: ${JSON.stringify(envelope.error.issues)}`)
    throw new Error(
      `Parsing of json for spotify-query.getCurrentTrack() failed. ZOD ERROR: ${JSON.stringify(envelope.error.issues)}`,
    )
  }

  // parse json into an object
  const envelope = playbackStateSchema.safeParse(data)
  if (envelope.success) {
    const playbackState: PlaybackState = envelope.data
    // console.log(`...returning from spotify-query.getCurrentTrack()`)
    return playbackState
  }

  console.log(`zod error: ${JSON.stringify(envelope.error.issues)}`)
  throw new Error(
    `Parsing of json for spotify-query.getCurrentTrack() failed. ZOD ERROR: ${JSON.stringify(envelope.error.issues)}`,
  )
}
