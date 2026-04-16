package main

import (
	"fmt"
	"net/http"
)

// The logError() method is a helper for logging an error message, along
// with the current request method and URL as attributes in the log entry.
func (app *application) logError(r *http.Request, err error) {
	var (
		method = r.Method
		uri    = r.URL.RequestURI()
	)

	app.logger.Error(err.Error(), "method", method, "uri", uri)
}

// A helper for sending JSON-formatted error messages to the client with a given status code.
func (app *application) errorResponse(w http.ResponseWriter, r *http.Request, status int, errMsg any) {
	env := envelope{"error": errMsg}

	// Attempt to write the response. If this happens to return an
	// error then log it, and fall back to sending the client an empty response with a
	// 500 Internal Server Error status code.
	err := app.writeJSON(w, status, env, nil)
	if err != nil {
		app.logError(r, err)
		w.WriteHeader(500)
	}
}

// Sends a 500 status code to client and internally logs error.
// Includes message "the server encountered a problem and could not process your request".
func (app *application) serverErrorResponse(w http.ResponseWriter, r *http.Request, err error) {
	app.logError(r, err)
	msg := "the server encountered a problem and could not process your request"
	app.errorResponse(w, r, http.StatusInternalServerError, envelope{"message": msg})
}

// Sends a 404 status code to client.
// Includes message "the requested resource could not be found".
func (app *application) notFoundResponse(w http.ResponseWriter, r *http.Request) {
	msg := "the requested resource could not be found"
	app.errorResponse(w, r, http.StatusNotFound, envelope{"message": msg})
}

// Sends a 405 status code to client.
// Includes message "the %s method is not supported for this resource"
func (app *application) methodNotAllowedResponse(w http.ResponseWriter, r *http.Request) {
	msg := fmt.Sprintf("the %s method is not supported for this resource", r.Method)
	app.errorResponse(w, r, http.StatusMethodNotAllowed, envelope{"message": msg})
}

// Sends a 400 status code to client.
func (app *application) badRequestResponse(w http.ResponseWriter, r *http.Request, err error) {
	// fmt.Println("in badRequestResponse")
	app.errorResponse(w, r, http.StatusBadRequest, envelope{"message": err.Error()})
}

// Sends a either a 409 or 422 status code to client.
func (app *application) failedValidationResponse(w http.ResponseWriter, r *http.Request, statusCode int, errors map[string]string) {
	app.errorResponse(w, r, statusCode, errors)
}

// Sends a 409 status code to client.
// Includes message "unable to update the record due to an edit conflict, please try again".
func (app *application) editConflictResponse(w http.ResponseWriter, r *http.Request) {
	msg := "unable to update the record due to an edit conflict, please try again"
	app.errorResponse(w, r, http.StatusConflict, envelope{"message": msg})
}

// Sends a 429 status code to client.
// Includes message "rate limit exceeded".
func (app *application) rateLimitExceededResponse(w http.ResponseWriter, r *http.Request) {
	msg := "rate limit exceeded"
	app.errorResponse(w, r, http.StatusTooManyRequests, envelope{"message": msg})
}

// Sends a 401 status code to client.
// Includes message "invalid authentication credentials".
func (app *application) invalidCredentialsResponse(w http.ResponseWriter, r *http.Request) {
	msg := "invalid authentication credentials"
	app.errorResponse(w, r, http.StatusUnauthorized, envelope{"message": msg})
}

// Sends a 401 status code to client with header to advertise authentication method.
// Includes message "invalid or missing authentication token".
func (app *application) invalidAuthenticationTokenResponse(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("WWW-Authenticate", "Bearer")

	msg := "invalid or missing authentication_token"
	app.errorResponse(w, r, http.StatusUnauthorized, envelope{"message": msg})
}

// Sends a 401 status code to client.
// Includes a message "you must be authenticated to access this resources".
func (app *application) authenticationRequiredResponse(w http.ResponseWriter, r *http.Request) {
	msg := "you must be authenticated to access this resource"
	app.errorResponse(w, r, http.StatusUnauthorized, envelope{"message": msg})
}

// Sends a 403 status code to client.
// Incldues a message "your account must be confirmed to access this resource".
func (app *application) nonConfirmedAccountResponse(w http.ResponseWriter, r *http.Request) {
	msg := "your account must be confirmed to access this resource"
	app.errorResponse(w, r, http.StatusForbidden, envelope{"message": msg})
}

// Sends a 403 status code to client.
// includes a message "your account does not have the necessary permissions to access this resource".
func (app *application) notPermittedResponse(w http.ResponseWriter, r *http.Request) {
	msg := "your account does not have the necessary permissions to access this resource"
	app.errorResponse(w, r, http.StatusForbidden, envelope{"message": msg})
}

// Sends a 403 status code to client.
// includes a message "your account does not have the necessary permissions to access this resource".
func (app *application) forbiddenResponse(w http.ResponseWriter, r *http.Request) {
	msg := "invalid origin"
	app.errorResponse(w, r, http.StatusForbidden, envelope{"message": msg})
}

// Sends a 303 status code eto client.
// does not include message.
func (app *application) redirectResponse(w http.ResponseWriter, r *http.Request, url string) {
	fmt.Println("redirecting to url: ", url)
	http.Redirect(w, r, url, http.StatusSeeOther)
}
