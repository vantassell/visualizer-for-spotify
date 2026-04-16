package main

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"strings"
)

func (app *application) login(w http.ResponseWriter, r *http.Request) {
	const scope = `
    user-read-playback-state
    user-read-currently-playing
    user-read-playback-position
    user-read-private
    user-read-email
`

	redirect := fmt.Sprintf("https://api.%s/v1/login-callback", API_HOST)

	url, err := url.Parse("https://accounts.spotify.com/authorize")

	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
	values := url.Query()
	values.Add("response_type", "code")
	values.Add("client_id", app.config.spotifyClientID)
	values.Add("scope", scope)
	// TODO: add optional state value to prevent CSRF attacks
	// values.Add("state", state)
	values.Add("show_dialog", "true")
	values.Add("redirect_uri", redirect)

	url.RawQuery = values.Encode()

	// fmt.Println("redirecting to spotify/authorize with redirect to /api/spotify-auth-redirect. redirect_url: ", url.String())

	app.redirectResponse(w, r, url.String())
}

type spotifyAccessTokenRequest struct {
	GrantType string `json:"grant_type"`
	Code      string `json:"code"`
	// State        string `json:"state"`
	RedirectURI string `json:"redirect_uri"`
}

type spotifyAccessTokenResponse struct {
	AccessToken  string `json:"access_token"`
	TokenType    string `json:"token_type"`
	Scope        string `json:"scope"`
	ExpiresIn    string `json:"expires_in"`
	RefreshToken string `json:"refresh_token"`
}

type spotifyAccessTokenErrorResponse struct {
	Error string `json:"error"`
}

// This route has two phases
// 1. Spotify API redirects the browser with account specific tokens as query params
// 2. Our API then makes a request to Spotify to get Access + Refresh tokens
func (app *application) loginCallback(w http.ResponseWriter, r *http.Request) {
	fmt.Println("hit authSpotifyRedirect: ", r.URL.Query())

	// get the params from spotify api out of the query.
	queries := r.URL.Query()
	code := queries.Get("code")
	// error := queries.Get("error")
	// state := queries.Get("state")
	// fmt.Println("query param code: ", code)
	// fmt.Println("query param error: ", error)
	// fmt.Println("query param state: ", state)

	// build ingredient for the request for an access token from the Spotify API
	redirect := fmt.Sprintf("https://api.%s/v1/login-callback", API_HOST)
	reqUrl := "https://accounts.spotify.com/api/token"

	// encode auth header value to base64
	authHeaderValue := fmt.Sprintf("%s:%s", app.config.spotifyClientID, app.config.spotifyClientSecret)
	authHeaderValueEncoded := base64.StdEncoding.EncodeToString([]byte(authHeaderValue))
	authHeader := fmt.Sprintf("Bearer %s", authHeaderValueEncoded)

	// encode request body
	reqData := url.Values{}
	reqData.Set("grant_type", "authorization_code")
	reqData.Set("code", code)
	// reqData.Set("state", state) // CSRF protection
	// NOTE: this redirect is only for validation, no redirect occurs
	reqData.Set("redirect_uri", redirect)

	reqBody := strings.NewReader(reqData.Encode())

	// build request
	spotifyReq, err := http.NewRequest("POST", reqUrl, reqBody)
	spotifyReq.Header.Add("Authorization", authHeader)
	spotifyReq.Header.Add("Content-Type", "application/x-www-form-urlencoded")
	spotifyReq.Header.Add("Accept", "application/json")

	// send request
	client := &http.Client{}
	spotifyRes, err := client.Do(spotifyReq)
	if err != nil {
		fmt.Println("error while sending token request to spotify. grant_type = authorization_code.")
		// TODO: what error should we return?
		app.serverErrorResponse(w, r, err)
		return
	}

	// check for error
	if spotifyRes.StatusCode != 200 {
		var result spotifyAccessTokenErrorResponse
		err = json.NewDecoder(spotifyRes.Body).Decode(&result)
		if err != nil {
			log.Fatal(err)
		}
		defer spotifyRes.Body.Close()
		err := fmt.Errorf("received non-200 from Spotify when requesting Access Token with error message: %s", result.Error)
		// TODO: what error code should we return?
		app.serverErrorResponse(w, r, err)
		return
	}

	// success!
	var tokenResponse spotifyAccessTokenResponse
	err = json.NewDecoder(spotifyRes.Body).Decode(&tokenResponse)
	if err != nil {
		log.Fatal(err)
	}
	defer spotifyRes.Body.Close()

	// respond to client with token details
	app.writeJSON(w, http.StatusOK, envelope{
		"accessToken":  tokenResponse.AccessToken,
		"tokenType":    tokenResponse.TokenType,
		"scope":        tokenResponse.Scope,
		"expiresIn":    tokenResponse.ExpiresIn,
		"refreshToken": tokenResponse.RefreshToken,
	}, nil)

	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}
