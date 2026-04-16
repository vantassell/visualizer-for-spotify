import { removeAccessToken, removeRefreshToken } from '#/lib/tokens'
import { useQueryClient } from '@tanstack/react-query'
import { createFileRoute, Navigate } from '@tanstack/react-router'

export const Route = createFileRoute('/sign-out')({
  component: RouteComponent,
})

function RouteComponent() {
  removeRefreshToken()
  removeAccessToken()
  const client = useQueryClient()
  client.removeQueries()

  return <Navigate to="/" />
}
