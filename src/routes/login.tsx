import { codeVerifierKey } from '@/lib/constants'
import { base64encode, generateRandomString, sha256 } from '@/lib/crypto'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/login')({
  loader: async () => {
    const codeVerifier = generateRandomString(64)
    const hashed = await sha256(codeVerifier)
    const codeChallenge = base64encode(hashed)
    return { codeVerifier, codeChallenge }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { codeVerifier, codeChallenge } = Route.useLoaderData()

  window.localStorage.setItem(codeVerifierKey, codeVerifier)

  const scope = `
    user-read-playback-state
    user-read-currently-playing
    user-read-playback-position
    user-read-private
    user-read-email
`

  const authUrl = new URL('https://accounts.spotify.com/authorize')
  const spotifyClientID = import.meta.env.VITE_SPOTIFY_CLIENT_ID
  const spotifyRedirectURI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI

  const params = {
    response_type: 'code',
    client_id: spotifyClientID,
    scope,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
    redirect_uri: spotifyRedirectURI,
  }

  authUrl.search = new URLSearchParams(params).toString()
  window.location.href = authUrl.toString()
}
