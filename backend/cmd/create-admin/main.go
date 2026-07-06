package main

import (
	"context"
	"errors"
	"flag"
	"fmt"
	"net/mail"
	"os"
	"strings"
	"time"

	"github.com/catursetyo/una-project/backend/internal/store"
	"golang.org/x/crypto/bcrypt"
	"golang.org/x/term"
)

func main() {
	emailFlag := flag.String("email", "", "admin email")
	nameFlag := flag.String("name", "", "admin display name")
	flag.Parse()

	databaseURL := os.Getenv("DATABASE_URL")
	email := strings.ToLower(strings.TrimSpace(*emailFlag))
	name := strings.TrimSpace(*nameFlag)

	if databaseURL == "" {
		fatal("DATABASE_URL is required")
	}
	address, err := mail.ParseAddress(email)
	if err != nil || address.Address != email || len(email) > 254 {
		fatal("valid -email is required")
	}
	if name == "" || len(name) > 100 {
		fatal("-name must contain 1 to 100 characters")
	}
	if !term.IsTerminal(int(os.Stdin.Fd())) {
		fatal("create-admin requires an interactive terminal")
	}

	password := readPassword("Password: ")
	confirmation := readPassword("Confirm password: ")
	if password != confirmation {
		fatal("passwords do not match")
	}
	if len([]byte(password)) < 12 || len([]byte(password)) > 72 {
		fatal("password must contain 12 to 72 bytes")
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		fatal("failed to hash password")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()
	database, err := store.Open(ctx, databaseURL)
	if err != nil {
		fatal("database connection failed")
	}
	defer database.Close()

	if err := database.UpsertAdmin(ctx, email, name, string(hash)); err != nil {
		fatal("admin could not be saved")
	}

	fmt.Printf("Admin %s is ready.\n", email)
}

func readPassword(prompt string) string {
	fmt.Fprint(os.Stderr, prompt)
	value, err := term.ReadPassword(int(os.Stdin.Fd()))
	fmt.Fprintln(os.Stderr)
	if err != nil {
		fatal("password could not be read")
	}
	return string(value)
}

func fatal(message string) {
	fmt.Fprintln(os.Stderr, errors.New(message))
	os.Exit(1)
}
