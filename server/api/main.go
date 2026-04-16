package main

import (
	"flag"
	"fmt"
	"log/slog"
	"os"
	"sync"

	"github.com/prometheus/client_golang/prometheus"
	"visualizer-for-spotify.com/internal"
)

// app config
type config struct {
	port                string
	env                 string
	spotifyClientID     string
	spotifyClientSecret string
	// streamingSecretKey string
}

type application struct {
	config          config
	logger          *slog.Logger
	wg              sync.WaitGroup
	metricsRegistry *prometheus.Registry
}

func main() {
	var (
		cfg config
	)

	// server settings
	cfg.port = os.Getenv("VISUALIZER_API_PORT")
	cfg.env = os.Getenv("VISUALIZER_API_ENV")
	cfg.spotifyClientID = os.Getenv("VISUALIZER_SPOTIFY_ID")
	cfg.spotifyClientSecret = os.Getenv("VISUALIZER_SPOTIFY_SECRET")

	// secret key for ledger updaets
	// cfg.ledgerSecretKey = os.Getenv("DIGINET_LEDGER_KEY")

	displayVersion := flag.Bool("version", false, "Display version and exit")
	flag.Parse()

	// If the version flag value is true, then print out the version number and
	// immediately exit.
	if *displayVersion {
		fmt.Printf("Version:\t%s\n", vcs.Version())
		os.Exit(0)
	}

	// setup logger
	logger := slog.New(slog.NewTextHandler(os.Stdout, nil))

	// create a new registry for prometheus metrics
	metricsRegistry := prometheus.NewRegistry()

	// setup app
	app := &application{
		config:          cfg,
		logger:          logger,
		metricsRegistry: metricsRegistry,
	}

	// finally, start listening for connections
	err := app.serve()
	if err != nil {
		logger.Error(err.Error())
		os.Exit(1)
	}
}
