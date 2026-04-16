import { createFileRoute, Navigate, redirect } from '@tanstack/react-router'
import spotifyLogoGreen from '../assets/spotify/Spotify_Logo_RGB_Green.png'
import { spotifyQueryOptions } from '@/queries/spotify-query'
import { accessTokenKey, refreshTokenKey } from '@/lib/constants'
import { useQuery } from '@tanstack/react-query'
import type { Artist } from '@/lib/types/artist'
import { refreshAccessToken } from '#/queries/refresh-query'
import { useState } from 'react'
import { getAccessToken, getRefreshToken } from '#/lib/tokens'
import { NotPlaying } from '#/components/NotPlaying'

export const Route = createFileRoute('/visualizer')({
  loader: () => {
    if (getAccessToken() === null) {
      throw redirect({
        to: '/',
      })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { data } = useQuery(spotifyQueryOptions.getTrackInfo())

  // if we succesfully received no data, then the user is not playing anything
  if (data && data.notPlaying == true) {
    return <NotPlaying />
  }

  // check if query had an error and we've lost our tokens
  if (getAccessToken() == null && getRefreshToken() == null) {
    return <Navigate to="/" />
  }

  // happy path
  return (
    <>
      <div
        id="inner-content"
        className="flex flex-col justify-end h-full px-12 pb-6"
      >
        <div id="artwork-container" className="">
          {data && data.item && (
            <img
              id="track-artwork"
              src={data.item.album.images[0].url}
              className=""
            />
          )}
        </div>

        <div id="metadata" className="flex flex-row justify-between ">
          <div className="track-info-container">
            {data && data.item && (
              <div className="track-info font-normal text-2xl flex flex-col gap-5 mb-3 text-white">
                <p>Track: {data.item.name}</p>
                <p>
                  Artist:{' '}
                  {data.item.artists.map((a: Artist) => a.name).join(', ')}
                </p>
                <p>Album: {data.item.album.name}</p>
              </div>
            )}
          </div>
          <div
            // id="spotify-logo-container"
            className="h-full max-w-3xs flex flex-col justify-end items-end"
          >
            <button
              className="cursor-pointer max-h-15 opacity-70"
              id="spotify-linkback-button"
            >
              <img
                className="h-full"
                // id="spotifyLogo"
                src={spotifyLogoGreen}
                alt="spotify logo"
              />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
