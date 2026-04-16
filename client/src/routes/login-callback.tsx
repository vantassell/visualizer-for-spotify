import { setAccessToken, setRefreshToken } from '#/lib/tokens'
import {
  codeVerifierKey,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_REDIRECT_URI,
} from '@/lib/constants'
import { createFileRoute, Navigate, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/login-callback')({
  loader: async () => {
    const urlParams = new URLSearchParams(window.location.search)
    let authCode = urlParams.get('code') // save tokens out of query params
    if (authCode == null) {
      console.error("could not find code in login-callback's urlParams")
      console.log('redirecting to root')
      throw redirect({
        to: '/',
      })
    }
    await getToken(authCode)

    return
  },
  component: RouteComponent,
})

const getToken = async (authCode: string) => {
  const codeVerifier = localStorage.getItem(codeVerifierKey)
  if (codeVerifier == null) {
    console.error('could not find codeVerifier in local storage')
    console.log('redirecting to root')
    return
  }

  const url = 'https://accounts.spotify.com/api/token'
  const payload = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: SPOTIFY_CLIENT_ID,
      grant_type: 'authorization_code',
      code: authCode,
      redirect_uri: SPOTIFY_REDIRECT_URI,
      code_verifier: codeVerifier,
    }),
  }

  const body = await fetch(url, payload)
  const response = await body.json()
  console.log('response: ', response)

  if (body.status == 200) {
    setAccessToken(response.access_token)
    setRefreshToken(response.refresh_token)
  }

  if (body.status != 200) {
    console.log('getToken response: ', body.status)
    return
  }
}

function RouteComponent() {
  return <Navigate to="/" />
}
