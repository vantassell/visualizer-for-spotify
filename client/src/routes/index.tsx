import { getAccessToken } from '#/lib/tokens'
import { accountQueryOptions } from '#/queries/login-query'
import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  beforeLoad: ({ context }) => {
    context.queryClient.prefetchQuery(accountQueryOptions.getAccount)
  },
  component: App,
})

function App() {
  // const { accessToken } = Route.useLoaderData()
  const { data: account } = useQuery(accountQueryOptions.getAccount)

  if (account) {
    return (
      <div
        id="new-sign-in"
        className="flex flex-col justify-center items-center h-full gap-16"
      >
        <Link to="/visualizer" className="hover:drop-shadow-[0_0_20px_#ccc]">
          Go to {account.displayName}'s{' '}
          <span className="spotify-text">Visualizer</span>
        </Link>
        <Link to="/sign-out" className="hover:drop-shadow-[0_0_20px_#ccc]">
          Sign Out {account.displayName} from this device
        </Link>
      </div>
    )
  }

  return (
    <>
      <div
        id="new-sign-in"
        className="flex flex-col justify-center items-center h-full"
      >
        <Link to="/login" className="hover:drop-shadow-[0_0_20px_#ccc]">
          Sign a new user into <span className="spotify-text">Spotify</span>
        </Link>
      </div>
    </>
  )
}
