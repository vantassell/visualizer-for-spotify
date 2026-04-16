import ReactDOM from 'react-dom/client'
import { Navigate, RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { StrictMode } from 'react'
import { refreshAccessToken } from './queries/refresh-query'

// our singleton query client
const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: async (error) => {
      console.log(`hit queryClient global error handler -- ${error.message}`)
      if (error.message.includes('401')) {
        console.log('---- need to refresh')
        await refreshAccessToken()
        queryClient.removeQueries()
      }
    },
  }),
})

// -------------------------------------
//       TanStack Query Dev Tools START
// -------------------------------------
// This code is only for TypeScript
declare global {
  interface Window {
    __TANSTACK_QUERY_CLIENT__: import('@tanstack/query-core').QueryClient
  }
}
// This code is for all users
window.__TANSTACK_QUERY_CLIENT__ = queryClient
// -------------------------------------
//       TanStack Query Dev Tools END
// -------------------------------------

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
  context: {
    queryClient: queryClient,
  },
  defaultNotFoundComponent: () => {
    return <Navigate to="/" />
  },
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('root')!

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </StrictMode>,
  )
}
