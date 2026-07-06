package auth

import (
	"sync"
	"time"
)

type LoginLimiter struct {
	mu          sync.Mutex
	limit       int
	window      time.Duration
	windowStart time.Time
	attempts    int
	now         func() time.Time
}

func NewLoginLimiter(limit int, window time.Duration) *LoginLimiter {
	return &LoginLimiter{
		limit:  limit,
		window: window,
		now:    time.Now,
	}
}

func (l *LoginLimiter) Allow() bool {
	l.mu.Lock()
	defer l.mu.Unlock()

	now := l.now()
	if l.windowStart.IsZero() || now.Sub(l.windowStart) >= l.window {
		l.windowStart = now
		l.attempts = 0
	}
	if l.attempts >= l.limit {
		return false
	}

	l.attempts++
	return true
}
