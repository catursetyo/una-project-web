package auth

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type AdminIdentity struct {
	ID    string
	Email string
	Name  string
}

type Claims struct {
	Email string `json:"email"`
	Name  string `json:"name"`
	Role  string `json:"role"`
	jwt.RegisteredClaims
}

type Tokens struct {
	secret   []byte
	issuer   string
	audience string
	ttl      time.Duration
	now      func() time.Time
}

func NewTokens(secret, issuer, audience string, ttl time.Duration) (*Tokens, error) {
	if len(secret) < 32 {
		return nil, errors.New("JWT secret must contain at least 32 characters")
	}
	if issuer == "" || audience == "" || ttl <= 0 {
		return nil, errors.New("JWT issuer, audience, and positive TTL are required")
	}

	return &Tokens{
		secret:   []byte(secret),
		issuer:   issuer,
		audience: audience,
		ttl:      ttl,
		now:      time.Now,
	}, nil
}

func (t *Tokens) Issue(admin AdminIdentity) (string, error) {
	now := t.now().UTC()
	claims := Claims{
		Email: admin.Email,
		Name:  admin.Name,
		Role:  "admin",
		RegisteredClaims: jwt.RegisteredClaims{
			Issuer:    t.issuer,
			Subject:   admin.ID,
			Audience:  jwt.ClaimStrings{t.audience},
			IssuedAt:  jwt.NewNumericDate(now),
			ExpiresAt: jwt.NewNumericDate(now.Add(t.ttl)),
		},
	}

	return jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString(t.secret)
}

func (t *Tokens) Verify(raw string) (Claims, error) {
	token, err := jwt.ParseWithClaims(
		raw,
		&Claims{},
		func(token *jwt.Token) (any, error) {
			if token.Method != jwt.SigningMethodHS256 {
				return nil, errors.New("unexpected signing method")
			}
			return t.secret, nil
		},
		jwt.WithAudience(t.audience),
		jwt.WithIssuer(t.issuer),
		jwt.WithValidMethods([]string{jwt.SigningMethodHS256.Alg()}),
		jwt.WithTimeFunc(t.now),
	)
	if err != nil || !token.Valid {
		return Claims{}, errors.New("invalid token")
	}

	claims, ok := token.Claims.(*Claims)
	if !ok || claims.Subject == "" || claims.Role != "admin" {
		return Claims{}, errors.New("invalid claims")
	}

	return *claims, nil
}

func (t *Tokens) TTLSeconds() int64 {
	return int64(t.ttl.Seconds())
}
