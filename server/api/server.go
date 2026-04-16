package main

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"
)

func (app *application) serve() error {
	apiServer := &http.Server{
		Addr:         fmt.Sprintf(":%s", app.config.port),
		Handler:      app.routes(),
		IdleTimeout:  time.Minute,
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
		ErrorLog:     slog.NewLogLogger(app.logger.Handler(), slog.LevelError),
	}

	metricsServer := &http.Server{
		Addr:    fmt.Sprintf(":%d", 2112),
		Handler: app.metricsRoute(),
	}

	// receive errors returned by graceful Shutdown() on this channel
	shutdownError := make(chan error)

	// start metrics server in background
	app.background(func() {
		app.logger.Info("starting metrics server", "addr", metricsServer.Addr)
		err := metricsServer.ListenAndServe()

		// Since Shutdown(ctx) will cause ListenAndServe() to immediately return a http.ErrServerClosed
		// error, we can ignore that error and only return other unexpected errors.
		if !errors.Is(err, http.ErrServerClosed) {
			app.logger.Error("error running metrics server", "err", err)
		}

		app.logger.Info("stopped metrics server", "addr", metricsServer.Addr)
	})

	// Start a background goroutine for catching signals
	go func() {
		quit := make(chan os.Signal, 1)
		signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
		s := <-quit

		app.logger.Info("caught signal", "signal", s.String())

		// Create a context with a 30-second timeout to finish background tasks
		ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
		defer cancel()

		err := apiServer.Shutdown(ctx)
		if err != nil {
			shutdownError <- err
		}

		err = metricsServer.Shutdown(ctx)
		if err != nil {
			shutdownError <- err
		}

		app.logger.Info("waiting for background tasks to complete...", "addr", apiServer.Addr)
		app.wg.Wait()
		shutdownError <- nil
	}()

	// Start the server as normal.
	app.logger.Info("starting api server", "addr", apiServer.Addr, "env", app.config.env)

	err := apiServer.ListenAndServe()
	// Since Shutdown(ctx) will cause ListenAndServe() to immediately return a http.ErrServerClosed
	// error, we can ignore that error and only return other unexpected errors.
	if !errors.Is(err, http.ErrServerClosed) {
		return err
	}

	// check for errors from our call to Shutdown()
	err = <-shutdownError
	if err != nil {
		return err
	}

	app.logger.Info("stopped api server", "addr", apiServer.Addr)

	return nil
}
