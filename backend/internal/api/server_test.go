package api

import (
	"context"
	"encoding/json"
	"io"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/catursetyo/una-project/backend/internal/auth"
	"github.com/catursetyo/una-project/backend/internal/store"
	"golang.org/x/crypto/bcrypt"
)

type fakeStore struct {
	admin store.Admin
}

func (f fakeStore) Ping(context.Context) error { return nil }

func (f fakeStore) AdminByEmail(_ context.Context, email string) (store.Admin, error) {
	if email != f.admin.Email {
		return store.Admin{}, store.ErrAdminNotFound
	}
	return f.admin, nil
}

func (f fakeStore) AdminByID(_ context.Context, id string) (store.Admin, error) {
	if id != f.admin.ID {
		return store.Admin{}, store.ErrAdminNotFound
	}
	return f.admin, nil
}

func TestLoginAndMe(t *testing.T) {
	hash, err := bcrypt.GenerateFromPassword([]byte("valid-password-123"), bcrypt.MinCost)
	if err != nil {
		t.Fatal(err)
	}
	tokens, err := auth.NewTokens(
		"01234567890123456789012345678901",
		"una-project-api",
		"una-project-admin",
		time.Hour,
	)
	if err != nil {
		t.Fatal(err)
	}

	server, err := NewServer(fakeStore{admin: store.Admin{
		ID:           "admin-1",
		Email:        "admin@unaproject.my.id",
		Name:         "UNA Admin",
		PasswordHash: string(hash),
	}}, tokens, slog.New(slog.NewTextHandler(io.Discard, nil)))
	if err != nil {
		t.Fatal(err)
	}

	loginRequest := httptest.NewRequest(
		http.MethodPost,
		"/v1/auth/login",
		strings.NewReader(`{"email":"admin@unaproject.my.id","password":"valid-password-123"}`),
	)
	loginRequest.Header.Set("Content-Type", "application/json")
	loginResponse := httptest.NewRecorder()
	server.Handler().ServeHTTP(loginResponse, loginRequest)
	if loginResponse.Code != http.StatusOK {
		t.Fatalf("login status = %d, body = %s", loginResponse.Code, loginResponse.Body.String())
	}

	var loginPayload struct {
		Data struct {
			Token string `json:"token"`
		} `json:"data"`
	}
	if err := json.Unmarshal(loginResponse.Body.Bytes(), &loginPayload); err != nil {
		t.Fatal(err)
	}
	if loginPayload.Data.Token == "" {
		t.Fatal("login response did not contain a token")
	}

	meRequest := httptest.NewRequest(http.MethodGet, "/v1/auth/me", nil)
	meRequest.Header.Set("Authorization", "Bearer "+loginPayload.Data.Token)
	meResponse := httptest.NewRecorder()
	server.Handler().ServeHTTP(meResponse, meRequest)
	if meResponse.Code != http.StatusOK {
		t.Fatalf("me status = %d, body = %s", meResponse.Code, meResponse.Body.String())
	}
	if strings.Contains(meResponse.Body.String(), "password_hash") {
		t.Fatal("safe admin DTO leaked password_hash")
	}
}
