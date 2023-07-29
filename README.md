## WebOS ##

### Good page for docs ###
https://webostv.developer.lge.com/develop/tools/cli-dev-guide#ares-generate

### Generate Hosted WebApp ###

`ares-generate --list`
Tells you all the options

`ares-generate -t hosted_webapp ./SpotifyViz`
Points to an external site, webapp is effectively a container for a url pointing to your app.

The above creates an `index.html` file that you'll update with the webapp's url

#### Package ####
For development (and debugging) run `ares-package --no-minify ./SpotifyViz`

For production, use `ares-package ./SpotifyViz`


### Deploy to local LG WEBOS ###

#### Get list of tv devices ####
Find out the name of your device
`ares-setup-device --list`

#### Install onto device ####
`ares-install --device avt-lg ./com.domain.app_0.0.1_all.ipk`


#### Remove from device ####
`ares-install --device avt-lg --remove com.domain.app`


#### Launch #####
`ares-launch --device avt-lg com.domain.app`


#### Debug (aka inspect) ####
Launch the app, then run `ares-inspect --device avt-lg --app com.domain.app --open`


#### Close ####
`ares-launch --device avt-lg --close com.domain.app`

### All In One ###
`ares-package --no-minify ./spotifyviz && ares-install --device avt-lg ./com.domain.app_0.0.3_all.ipk && ares-inspect --device avt-lg --app com.domain.app --open`

### Simulator Commands ###
No need to build, you can install the folder directly
`ares-launch -s 23 ./spotifyviz`


## Heroku Settings ##

Add these env variables.

`NPM_CONFIG_PRODUCTION=false`
`YARN_PRODUCTION=false`

# Running Webpack #
`index.html` imports a `bundle.js` that lives in the `dist` folder that Webpack creates. Run the below to update `bundle.js` with anything from **npm**.

`npm run build`


# Encoding background video #


source: https://pixelpoint.io/blog/web-optimized-video-ffmpeg/

First Try
`ffmpeg -i input.mov -c:v libx265 -crf 32 -vf scale=3840:-2 -preset veryslow -tag:v hvc1 -movflags faststart -an output.mp4`

Using rain.mp4 setting for universality
`ffmpeg -i star_loop.webm -c:v libx264 -pix_fmt yuv420p -movflags +faststart star_loop.mp4`

Add loop during encoding
`stream_loop 10` --> 10x loops
NOTE: `stream_loop` must come before `-i`