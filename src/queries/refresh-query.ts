import { SPOTIFY_CLIENT_ID } from '#/lib/constants'
import {
  getRefreshToken,
  removeAccessToken,
  removeRefreshToken,
  setAccessToken,
  setRefreshToken,
} from '#/lib/tokens'
import {
  errorMsgEvenlopeSchema,
  refreshAccessTokenErrorSchema,
  type ErrorMsg,
  type RefreshAccessTokenError,
} from '#/lib/types/error'
import {
  resfreshResponseSchema,
  type RefreshResponse,
} from '#/lib/types/refreshResponse'

export async function refreshAccessToken() {
  console.log('starting refreshAccessToken() query')
  // console.log('with accessToken: ', accessToken)

  const refreshToken = getRefreshToken()
  if (refreshToken == null) {
    throw new Error('could not find refresh token')
  }
  const baseURL = 'https://accounts.spotify.com/api/token'

  const payload = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: SPOTIFY_CLIENT_ID,
    }),
  }
  const res = await fetch(baseURL, payload)
  console.log('made refresh request')

  // read response and parse into json
  const data = await res.json().catch((err) => {
    const errMsg =
      'Parsing json out of fetch response from API in refreshAccessToken(): ' +
      err
    console.error(errMsg)
    throw new Error(errMsg)
  })

  // localStorage.setItem('access_token', response.access_token)
  // if (response.refresh_token) {
  //   localStorage.setItem('refresh_token', response.refresh_token)
  // }

  // handle non-200 status
  if (!res.ok) {
    console.log('refreshAccessToken res was not ok')
    console.log('refreshAccessToken.status: ', res.status)

    const envelope = refreshAccessTokenErrorSchema.safeParse(data)

    if (envelope.success) {
      const errorMsg: RefreshAccessTokenError = envelope.data
      console.log(`...returning from refreshAccessToken()`)
      if (errorMsg.error_description.includes('Invalid refresh token')) {
        // if we have invalid refresh token, the only way to recover is to sign in again
        removeAccessToken()
        removeRefreshToken()
      }
      throw new Error(
        `refreshAccessToken(): status: ${res.status} error: ${errorMsg.error} error_description: ${errorMsg.error_description}`,
      )
    }

    console.log(`zod error: ${JSON.stringify(envelope.error.issues)}`)
    throw new Error(
      `Parsing of json for spotify-query.getCurrentTrack() failed. ZOD ERROR: ${JSON.stringify(envelope.error.issues)}`,
    )
  }

  console.log('spotify-query.refreshAccessToken() response data: ', data)

  // parse json into an object
  const envelope = resfreshResponseSchema.safeParse(data)
  if (envelope.success) {
    const refreshRes: RefreshResponse = envelope.data
    setAccessToken(refreshRes.accessToken)
    setRefreshToken(refreshRes.refreshToken)
    console.log(
      `saved new accessToken: ${refreshRes.accessToken} and refreshToken: ${refreshRes.refreshToken}`,
    )
    console.log(`...returning from refreshAccessToken()`)
  }

  console.log(`zod error: ${JSON.stringify(envelope.error.issues)}`)
  throw new Error(
    `Parsing of json for spotify-query.getCurrentTrack() failed. ZOD ERROR: ${JSON.stringify(envelope.error.issues)}`,
  )
}
