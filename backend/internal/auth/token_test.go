package auth

import (
	"testing"
	"time"
)

func TestTokensIssueAndVerify(t *testing.T) {
	tokens, err := NewTokens(
		"01234567890123456789012345678901",
		"una-project-api",
		"una-project-admin",
		time.Hour,
	)
	if err != nil {
		t.Fatal(err)
	}

	now := time.Date(2026, time.July, 6, 10, 0, 0, 0, time.UTC)
	tokens.now = func() time.Time { return now }

	raw, err := tokens.Issue(AdminIdentity{
		ID:    "admin-1",
		Email: "admin@unaproject.my.id",
		Name:  "UNA Admin",
	})
	if err != nil {
		t.Fatal(err)
	}

	claims, err := tokens.Verify(raw)
	if err != nil {
		t.Fatal(err)
	}
	if claims.Subject != "admin-1" || claims.Email != "admin@unaproject.my.id" || claims.Role != "admin" {
		t.Fatalf("unexpected claims: %#v", claims)
	}

	tokens.now = func() time.Time { return now.Add(2 * time.Hour) }
	if _, err := tokens.Verify(raw); err == nil {
		t.Fatal("expected expired token to be rejected")
	}
}

func TestTokensRejectWeakSecret(t *testing.T) {
	if _, err := NewTokens("short", "issuer", "audience", time.Hour); err == nil {
		t.Fatal("expected weak secret to be rejected")
	}
}
