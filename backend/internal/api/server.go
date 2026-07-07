package api

import (
	"context"
	"encoding/json"
	"errors"
	"io"
	"log/slog"
	"net/http"
	"net/mail"
	"strings"
	"time"

	"github.com/catursetyo/una-project/backend/internal/auth"
	"github.com/catursetyo/una-project/backend/internal/store"
	"golang.org/x/crypto/bcrypt"
)

type Store interface {
	Ping(context.Context) error
	AdminByEmail(context.Context, string) (store.Admin, error)
	AdminByID(context.Context, string) (store.Admin, error)
	ActiveProducts(context.Context, string, *bool) ([]store.Product, error)
	ActiveProductBySlug(context.Context, string) (store.Product, error)
	AllProducts(context.Context, *bool, int, int) ([]store.Product, int, error)
	ProductByID(context.Context, string) (store.Product, error)
	VariantsByProductID(context.Context, string) ([]store.ProductVariant, error)
	CreateProduct(context.Context, store.Product, []store.ProductVariant) (string, error)
	UpdateProduct(context.Context, string, store.Product, []store.ProductVariant) error
	DeleteProduct(context.Context, string) error
	ListPublicTestimonials(context.Context) ([]store.Testimonial, error)
	ListAdminTestimonials(context.Context) ([]store.Testimonial, error)
	GetTestimonialByID(context.Context, string) (store.Testimonial, error)
	CreateTestimonial(context.Context, *store.Testimonial) error
	UpdateTestimonial(context.Context, *store.Testimonial) error
	DeleteTestimonial(context.Context, string) error
	ListPublicTutorials(context.Context) ([]store.Tutorial, error)
	GetPublicTutorialBySlug(context.Context, string) (store.Tutorial, error)
	ListAdminTutorials(context.Context) ([]store.Tutorial, error)
	GetTutorialByID(context.Context, string) (store.Tutorial, error)
	StepsByTutorialID(context.Context, string) ([]store.TutorialStep, error)
	CreateTutorial(context.Context, store.Tutorial, []store.TutorialStep) (string, error)
	UpdateTutorial(context.Context, string, store.Tutorial, []store.TutorialStep) error
	DeleteTutorial(context.Context, string) error
	ListPublicOrderSteps(context.Context) ([]store.OrderStep, error)
	ListAdminOrderSteps(context.Context) ([]store.OrderStep, error)
	ReplaceAllOrderSteps(context.Context, []store.OrderStep) error
	ListPublicWhatsAppTemplates(context.Context) ([]store.WhatsAppTemplate, error)
	GetPublicWhatsAppTemplateByName(context.Context, string) (store.WhatsAppTemplate, error)
	ListAdminWhatsAppTemplates(context.Context) ([]store.WhatsAppTemplate, error)
	GetWhatsAppTemplateByID(context.Context, string) (store.WhatsAppTemplate, error)
	CreateWhatsAppTemplate(context.Context, *store.WhatsAppTemplate) error
	UpdateWhatsAppTemplate(context.Context, *store.WhatsAppTemplate) error
	DeleteWhatsAppTemplate(context.Context, string) error
	TrackAnalyticsEvent(context.Context, store.AnalyticsEvent) error
	AnalyticsSummary(context.Context, int) (store.AnalyticsSummary, error)
}

type Server struct {
	store     Store
	tokens    *auth.Tokens
	limiter   *auth.LoginLimiter
	dummyHash []byte
	logger    *slog.Logger
	media     *MediaStorage
}

func NewServer(st Store, tokens *auth.Tokens, logger *slog.Logger, media ...*MediaStorage) (*Server, error) {
	dummyHash, err := bcrypt.GenerateFromPassword([]byte("invalid-admin-password"), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}
	var mediaStorage *MediaStorage
	if len(media) > 0 {
		mediaStorage = media[0]
	}

	return &Server{
		store:     st,
		tokens:    tokens,
		limiter:   auth.NewLoginLimiter(10, time.Minute),
		dummyHash: dummyHash,
		logger:    logger,
		media:     mediaStorage,
	}, nil
}

func (s *Server) Handler() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /v1/healthz", s.health)
	mux.HandleFunc("POST /v1/analytics/events", s.trackAnalyticsEvent)
	mux.HandleFunc("POST /v1/auth/login", s.login)
	mux.HandleFunc("GET /v1/auth/me", s.requireAdmin(s.me))

	// Public products
	mux.HandleFunc("GET /v1/products", s.listPublicProducts)
	mux.HandleFunc("GET /v1/products/{slug}", s.getPublicProduct)

	// Admin products (JWT required)
	mux.HandleFunc("GET /v1/admin/products", s.requireAdmin(s.listAdminProducts))
	mux.HandleFunc("GET /v1/admin/products/{id}", s.requireAdmin(s.getAdminProduct))
	mux.HandleFunc("POST /v1/admin/products", s.requireAdmin(s.createProduct))
	mux.HandleFunc("PUT /v1/admin/products/{id}", s.requireAdmin(s.updateProduct))
	mux.HandleFunc("DELETE /v1/admin/products/{id}", s.requireAdmin(s.deleteProduct))
	mux.HandleFunc("POST /v1/admin/uploads", s.requireAdmin(s.uploadMedia))
	mux.HandleFunc("GET /v1/admin/analytics/summary", s.requireAdmin(s.getAnalyticsSummary))

	// Public testimonials
	mux.HandleFunc("GET /v1/testimonials", s.listPublicTestimonials)

	// Admin testimonials (JWT required)
	mux.HandleFunc("GET /v1/admin/testimonials", s.requireAdmin(s.listAdminTestimonials))
	mux.HandleFunc("GET /v1/admin/testimonials/{id}", s.requireAdmin(s.getAdminTestimonial))
	mux.HandleFunc("POST /v1/admin/testimonials", s.requireAdmin(s.createTestimonial))
	mux.HandleFunc("PUT /v1/admin/testimonials/{id}", s.requireAdmin(s.updateTestimonial))
	mux.HandleFunc("DELETE /v1/admin/testimonials/{id}", s.requireAdmin(s.deleteTestimonial))

	// Public tutorials
	mux.HandleFunc("GET /v1/tutorials", s.listPublicTutorials)
	mux.HandleFunc("GET /v1/tutorials/{slug}", s.getPublicTutorial)

	// Admin tutorials (JWT required)
	mux.HandleFunc("GET /v1/admin/tutorials", s.requireAdmin(s.listAdminTutorials))
	mux.HandleFunc("GET /v1/admin/tutorials/{id}", s.requireAdmin(s.getAdminTutorial))
	mux.HandleFunc("POST /v1/admin/tutorials", s.requireAdmin(s.createTutorial))
	mux.HandleFunc("PUT /v1/admin/tutorials/{id}", s.requireAdmin(s.updateTutorial))
	mux.HandleFunc("DELETE /v1/admin/tutorials/{id}", s.requireAdmin(s.deleteTutorial))

	// Public order steps
	mux.HandleFunc("GET /v1/order-steps", s.listPublicOrderSteps)

	// Admin order steps (JWT required)
	mux.HandleFunc("GET /v1/admin/order-steps", s.requireAdmin(s.listAdminOrderSteps))
	mux.HandleFunc("PUT /v1/admin/order-steps", s.requireAdmin(s.replaceAllOrderSteps))

	// Public whatsapp templates
	mux.HandleFunc("GET /v1/whatsapp-templates", s.listPublicWhatsAppTemplates)
	mux.HandleFunc("GET /v1/whatsapp-templates/{name}", s.getPublicWhatsAppTemplate)

	// Admin whatsapp templates (JWT required)
	mux.HandleFunc("GET /v1/admin/whatsapp-templates", s.requireAdmin(s.listAdminWhatsAppTemplates))
	mux.HandleFunc("GET /v1/admin/whatsapp-templates/{id}", s.requireAdmin(s.getAdminWhatsAppTemplate))
	mux.HandleFunc("POST /v1/admin/whatsapp-templates", s.requireAdmin(s.createWhatsAppTemplate))
	mux.HandleFunc("PUT /v1/admin/whatsapp-templates/{id}", s.requireAdmin(s.updateWhatsAppTemplate))
	mux.HandleFunc("DELETE /v1/admin/whatsapp-templates/{id}", s.requireAdmin(s.deleteWhatsAppTemplate))

	// ponytail: CORS tidak diperlukan — arsitektur BFF berarti browser
	// tidak pernah memanggil Go API secara langsung, hanya Next.js server.
	return s.recover(s.securityHeaders(mux))
}

func (s *Server) health(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(r.Context(), 2*time.Second)
	defer cancel()
	if err := s.store.Ping(ctx); err != nil {
		writeError(w, http.StatusServiceUnavailable, "ERR_UNAVAILABLE", "Service is unavailable")
		return
	}
	writeJSON(w, http.StatusOK, response{Success: true, Data: map[string]string{"status": "ok"}})
}

func (s *Server) login(w http.ResponseWriter, r *http.Request) {
	if !s.limiter.Allow() {
		writeError(w, http.StatusTooManyRequests, "ERR_RATE_LIMITED", "Too many login attempts")
		return
	}

	r.Body = http.MaxBytesReader(w, r.Body, 16<<10)
	var input struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if err := decodeJSON(r, &input); err != nil {
		writeError(w, http.StatusBadRequest, "ERR_BAD_REQUEST", "Invalid request")
		return
	}

	email, ok := normalizeEmail(input.Email)
	if !ok || len(input.Password) == 0 || len([]byte(input.Password)) > 72 {
		writeError(w, http.StatusUnauthorized, "ERR_INVALID_CREDENTIALS", "Email or password is invalid")
		return
	}

	admin, err := s.store.AdminByEmail(r.Context(), email)
	hash := s.dummyHash
	if err == nil {
		hash = []byte(admin.PasswordHash)
	} else if !errors.Is(err, store.ErrAdminNotFound) {
		s.logger.Error("admin login query failed", "error", err)
		writeError(w, http.StatusInternalServerError, "ERR_INTERNAL", "Internal server error")
		return
	}

	passwordValid := bcrypt.CompareHashAndPassword(hash, []byte(input.Password)) == nil
	if !passwordValid || errors.Is(err, store.ErrAdminNotFound) {
		writeError(w, http.StatusUnauthorized, "ERR_INVALID_CREDENTIALS", "Email or password is invalid")
		return
	}

	rawToken, err := s.tokens.Issue(auth.AdminIdentity{ID: admin.ID, Email: admin.Email, Name: admin.Name})
	if err != nil {
		s.logger.Error("admin token issue failed", "admin_id", admin.ID, "error", err)
		writeError(w, http.StatusInternalServerError, "ERR_INTERNAL", "Internal server error")
		return
	}

	writeJSON(w, http.StatusOK, response{
		Success: true,
		Data: map[string]any{
			"token":      rawToken,
			"expires_in": s.tokens.TTLSeconds(),
		},
	})
}

// requireAdmin verifies JWT from Authorization header and injects admin ID
// into request context. All /admin/* handlers use this middleware.
func (s *Server) requireAdmin(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		rawToken, ok := bearerToken(r.Header.Get("Authorization"))
		if !ok {
			writeError(w, http.StatusUnauthorized, "ERR_UNAUTHORIZED", "Authentication required")
			return
		}
		claims, err := s.tokens.Verify(rawToken)
		if err != nil {
			writeError(w, http.StatusUnauthorized, "ERR_UNAUTHORIZED", "Authentication required")
			return
		}
		ctx := context.WithValue(r.Context(), adminIDKey, claims.Subject)
		next(w, r.WithContext(ctx))
	}
}

type contextKey string

const adminIDKey contextKey = "admin_id"

// adminID reads the authenticated admin ID from request context.
// Only valid inside handlers wrapped with requireAdmin.
func adminID(r *http.Request) string {
	id, _ := r.Context().Value(adminIDKey).(string)
	return id
}

func (s *Server) me(w http.ResponseWriter, r *http.Request) {
	admin, err := s.store.AdminByID(r.Context(), adminID(r))
	if err != nil {
		if !errors.Is(err, store.ErrAdminNotFound) {
			s.logger.Error("admin session query failed", "admin_id", adminID(r), "error", err)
		}
		writeError(w, http.StatusUnauthorized, "ERR_UNAUTHORIZED", "Authentication required")
		return
	}

	writeJSON(w, http.StatusOK, response{
		Success: true,
		Data: map[string]string{
			"id":    admin.ID,
			"email": admin.Email,
			"name":  admin.Name,
		},
	})
}

func (s *Server) securityHeaders(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Cache-Control", "no-store")
		w.Header().Set("X-Content-Type-Options", "nosniff")
		next.ServeHTTP(w, r)
	})
}

func (s *Server) recover(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if value := recover(); value != nil {
				s.logger.Error("panic recovered", "value", value)
				writeError(w, http.StatusInternalServerError, "ERR_INTERNAL", "Internal server error")
			}
		}()
		next.ServeHTTP(w, r)
	})
}

type response struct {
	Success   bool           `json:"success"`
	Message   string         `json:"message,omitempty"`
	ErrorCode string         `json:"error_code,omitempty"`
	Data      any            `json:"data,omitempty"`
	Errors    map[string]any `json:"errors,omitempty"`
}

func writeError(w http.ResponseWriter, status int, code, message string) {
	writeJSON(w, status, response{Success: false, ErrorCode: code, Message: message})
}

func writeJSON(w http.ResponseWriter, status int, value response) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(value)
}

func decodeJSON(r *http.Request, destination any) error {
	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()
	if err := decoder.Decode(destination); err != nil {
		return err
	}
	if err := decoder.Decode(&struct{}{}); !errors.Is(err, io.EOF) {
		return errors.New("request body must contain one JSON object")
	}
	return nil
}

func normalizeEmail(value string) (string, bool) {
	email := strings.ToLower(strings.TrimSpace(value))
	address, err := mail.ParseAddress(email)
	return email, err == nil && address.Address == email && len(email) <= 254
}

func bearerToken(value string) (string, bool) {
	parts := strings.Fields(value)
	returnValue := ""
	if len(parts) == 2 && strings.EqualFold(parts[0], "Bearer") && len(parts[1]) <= 4096 {
		returnValue = parts[1]
	}
	return returnValue, returnValue != ""
}
