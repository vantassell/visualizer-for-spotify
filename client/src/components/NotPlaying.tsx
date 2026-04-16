import spotifyLogoGreen from '../assets/spotify/Spotify_Logo_RGB_Green.png'

export function NotPlaying() {
  return (
    <>
      <div
        id="inner-content"
        className="flex flex-col justify-end h-full px-12 pb-6"
      >
        <div id="artwork-container" className="">
          <img
            id="track-artwork"
            src="https://static1.srcdn.com/wordpress/wp-content/uploads/2020/03/michael-scott-the-office-memes.jpg"
            className=""
          />
        </div>

        <div id="metadata" className="flex flex-row justify-between ">
          <div className="track-info-container flex flex-col justify-end">
            <div className="track-info font-normal text-2xl flex flex-col gap-5 mb-3 text-white">
              <p>
                It looks like you aren't currently listening to anything. Please
                chose something to play and this message will go away :)
              </p>
            </div>
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
