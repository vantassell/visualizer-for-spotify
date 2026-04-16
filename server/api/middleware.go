package main

import (
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
)

// Recover any panic during this request and close the connection with the client.
func (app *application) recoverPanic(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			pv := recover()
			if pv != nil {
				//	This acts as a trigger to make Go's HTTP server automatically close
				// the current connection after the response has been sent.
				w.Header().Set("Connection", "close")
				app.serverErrorResponse(w, r, fmt.Errorf("%v", pv))
			}
		}()

		next.ServeHTTP(w, r)
	})
}

// func (app *application) preventCSRF(next http.Handler) http.Handler {
// 	cop := http.NewCrossOriginProtection()

// 	for i := range app.config.cors.trustedOrigins {
// 		cop.AddTrustedOrigin(app.config.cors.trustedOrigins[i])
// 	}

// 	cop.SetDenyHandler(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
// 		app.logger.Log(context.Background(), slog.LevelDebug, "CSRF check failed")
// 		app.forbiddenResponse(w, r)
// 	}))

// 	return cop.Handler(next)
// }

// Captures prometheus metrics for a request.
func (app *application) metrics(next http.Handler) http.Handler {
	requestsReceivedTotal := promauto.With(app.metricsRegistry).NewCounter(prometheus.CounterOpts{
		Name: "visualizer_api_requests_received_total",
		Help: "The total number of requests received",
	})

	responsesWithStatusTotal := promauto.With(app.metricsRegistry).NewCounterVec(prometheus.CounterOpts{
		Name: "visualizer_api_responses_sent_total_with_status",
		Help: "The total number of responses sent",
	}, []string{"method", "status", "path"})

	requestDurations := promauto.With(app.metricsRegistry).NewHistogram(prometheus.HistogramOpts{
		Name:    "visualizer_api_request_duration_seconds",
		Help:    "A histogram of the HTTP request durations in seconds.",
		Buckets: []float64{.05, 0.1, 0.2, 0.5, 1.0, 2.0, 5.0},
	})

	// reutrn a handler that will update our custom metrics
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()

		requestsReceivedTotal.Add(1)

		// metricsResponseWriter wraps the responseWriter with a status code so we can get it back out after the response is crafted
		mw := newMetricsResponseWriter(w)

		// Inject the metricsResponseWriter into the handler chain
		next.ServeHTTP(mw, r)

		// The response status code should now be stored in the mw.statusCode field.
		// NOTE: this will panic rather than error. Convert to GetMetricWithLabelValues to return error and not panic
		responsesWithStatusTotal.WithLabelValues(r.Method, strconv.Itoa(mw.statusCode), r.URL.Path).Inc()

		duration := time.Since(start).Seconds()
		requestDurations.Observe(float64(duration))
	})
}
