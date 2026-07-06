package auth

import (
	"testing"
	"time"
)

func TestLoginLimiterResetsAfterWindow(t *testing.T) {
	limiter := NewLoginLimiter(2, time.Minute)
	now := time.Date(2026, time.July, 6, 10, 0, 0, 0, time.UTC)
	limiter.now = func() time.Time { return now }

	if !limiter.Allow() || !limiter.Allow() {
		t.Fatal("expected initial attempts to pass")
	}
	if limiter.Allow() {
		t.Fatal("expected attempt above limit to fail")
	}

	now = now.Add(time.Minute)
	if !limiter.Allow() {
		t.Fatal("expected limiter to reset after window")
	}
}
