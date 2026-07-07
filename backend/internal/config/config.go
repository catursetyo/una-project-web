package config

import (
	"errors"
	"fmt"
	"os"
	"time"
)

type Config struct {
	Port                   string
	DatabaseURL            string
	JWTSecret              string
	JWTIssuer              string
	JWTAudience            string
	JWTTTL                 time.Duration
	SupabaseURL            string
	SupabaseServiceRoleKey string
	MediaBucket            string
}

func Load() (Config, error) {
	ttl, err := time.ParseDuration(env("JWT_TTL", "8h"))
	if err != nil || ttl <= 0 {
		return Config{}, errors.New("JWT_TTL must be a positive duration")
	}

	cfg := Config{
		Port:                   env("PORT", "8080"),
		DatabaseURL:            os.Getenv("DATABASE_URL"),
		JWTSecret:              os.Getenv("JWT_SECRET"),
		JWTIssuer:              env("JWT_ISSUER", "una-project-api"),
		JWTAudience:            env("JWT_AUDIENCE", "una-project-admin"),
		JWTTTL:                 ttl,
		SupabaseURL:            os.Getenv("SUPABASE_URL"),
		SupabaseServiceRoleKey: os.Getenv("SUPABASE_SERVICE_ROLE_KEY"),
		MediaBucket:            env("MEDIA_BUCKET", "una-media"),
	}

	if cfg.DatabaseURL == "" {
		return Config{}, errors.New("DATABASE_URL is required")
	}
	if len(cfg.JWTSecret) < 32 {
		return Config{}, fmt.Errorf("JWT_SECRET must contain at least 32 characters")
	}

	return cfg, nil
}

func env(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}
