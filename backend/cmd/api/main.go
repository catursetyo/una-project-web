package main

import (
	"context"
	"errors"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/catursetyo/una-project/backend/internal/api"
	"github.com/catursetyo/una-project/backend/internal/auth"
	"github.com/catursetyo/una-project/backend/internal/config"
	"github.com/catursetyo/una-project/backend/internal/store"
)

func main() {
	logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))
	cfg, err := config.Load()
	if err != nil {
		logger.Error("invalid configuration", "error", err)
		os.Exit(1)
	}

	ctx := context.Background()
	database, err := store.Open(ctx, cfg.DatabaseURL)
	if err != nil {
		logger.Error("database connection failed", "error", err)
		os.Exit(1)
	}
	defer database.Close()

	tokens, err := auth.NewTokens(cfg.JWTSecret, cfg.JWTIssuer, cfg.JWTAudience, cfg.JWTTTL)
	if err != nil {
		logger.Error("token configuration failed", "error", err)
		os.Exit(1)
	}

	var media *api.MediaStorage
	if cfg.SupabaseURL != "" || cfg.SupabaseServiceRoleKey != "" {
		media = &api.MediaStorage{
			SupabaseURL: cfg.SupabaseURL,
			ServiceKey:  cfg.SupabaseServiceRoleKey,
			Bucket:      cfg.MediaBucket,
		}
	}

	app, err := api.NewServer(database, tokens, logger, media)
	if err != nil {
		logger.Error("server setup failed", "error", err)
		os.Exit(1)
	}

	server := &http.Server{
		Addr:              ":" + cfg.Port,
		Handler:           app.Handler(),
		ReadHeaderTimeout: 5 * time.Second,
		ReadTimeout:       10 * time.Second,
		WriteTimeout:      15 * time.Second,
		IdleTimeout:       60 * time.Second,
	}

	go func() {
		logger.Info("API listening", "port", cfg.Port)
		if err := server.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			logger.Error("API stopped unexpectedly", "error", err)
			os.Exit(1)
		}
	}()

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, syscall.SIGINT, syscall.SIGTERM)
	<-stop

	shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := server.Shutdown(shutdownCtx); err != nil {
		logger.Error("graceful shutdown failed", "error", err)
	}
}
