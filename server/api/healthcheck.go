package main

import (
	"net/http"

	vcs "visualizer-for-spotify.com/internal"
)

// Declare a handler which writes a plain-text response with information about the
// application status, operating environment and version.
func (app *application) healthcheckHandler(w http.ResponseWriter, r *http.Request) {
	env := envelope{
		"status": "available",
		"system_info": map[string]string{
			"environment": app.config.env,
			"version":     vcs.Version(),
		},
	}

	err := app.writeJSON(w, http.StatusOK, env, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func ping(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodPost:
		w.WriteHeader(http.StatusCreated)
		w.Write([]byte("OK"))
		return
	default:
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
		return
	}

}
