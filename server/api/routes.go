package main

import (
	"net/http"

	"github.com/julienschmidt/httprouter"
	"github.com/prometheus/client_golang/prometheus/promhttp"
)

func (app *application) routes() http.Handler {
	// Initialize a new httprouter router instance.
	router := httprouter.New()

	// router.NotFound = http.HandlerFunc(app.notFoundResponse)
	// router.MethodNotAllowed = http.HandlerFunc(app.methodNotAllowedResponse)

	// sysadmin routes
	router.HandlerFunc(http.MethodGet, "/v1/healthcheck", app.healthcheckHandler)

	// testing routes
	router.HandlerFunc(http.MethodGet, "/v1/ping", ping)
	// router.HandlerFunc(http.MethodGet, "/v1/secure-ping", app.requireConfirmedAccount(ping))
	// router.HandlerFunc(http.MethodPost, "/v1/secure-ping", app.requireConfirmedAccount(ping))

	// spotify routes
	router.HandlerFunc(http.MethodPost, "/v1/login", app.login)
	router.HandlerFunc(http.MethodPost, "/v1/login-callback", app.loginCallback)
	// router.HandlerFunc(http.MethodPost, "/v1/api/refresh-token", app.refresh)

	// account login/authentication
	// router.HandlerFunc(http.MethodPost, "/v1/token/authentication", app.postCreateAuthenticationTokenHandler)
	// router.HandlerFunc(http.MethodDelete, "/v1/token", app.postDeleteAuthenticationTokenHandler)

	// -------------------------------
	//           return
	// -------------------------------

	// triggered in order from left -> right
	// return app.metrics(app.recoverPanic((app.preventCSRF(router))))))
	return app.metrics(app.recoverPanic(router))
}

func (app *application) metricsRoute() http.Handler {
	router := httprouter.New()
	router.Handler(http.MethodGet, "/metrics", promhttp.HandlerFor(app.metricsRegistry, promhttp.HandlerOpts{}))
	// NOTE: prometheus has a built in handler, but we can use the custom one above or default below
	// router.Handler(http.MethodGet, "/metrics", promhttp.Handler())

	return router
}
