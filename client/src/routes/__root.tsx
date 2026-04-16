import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
// import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
// import { TanStackDevtools } from '@tanstack/react-devtools'
import starsPoster from '../assets/star_loop_frame0.png'
import starsVideoWEBM from '../assets/star_loop.webm'

import '../styles.css'
import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}
export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
})

function RootComponent() {
  return (
    <>
      <video
        muted
        autoPlay
        loop
        className="video-player"
        id="video-player"
        crossOrigin="anonymous"
        poster={starsPoster}
      >
        <source src={starsVideoWEBM} type="video/webm" />{' '}
      </video>
      <div id="outer-content" className="relative h-full w-full">
        <Outlet />
      </div>
      {/* <TanStackDevtools */}
      {/*   config={{ */}
      {/*     position: 'bottom-right', */}
      {/*   }} */}
      {/*   plugins={[ */}
      {/*     { */}
      {/*       name: 'TanStack Router', */}
      {/*       render: <TanStackRouterDevtoolsPanel />, */}
      {/*     }, */}
      {/*   ]} */}
      {/* /> */}
    </>
  )
}
