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
	admin         store.Admin
	products      []store.Product
	variants      map[string][]store.ProductVariant
	tutorials     []store.Tutorial
	tutorialSteps map[string][]store.TutorialStep
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

// ponytail: stubs — auth tests don't touch products
func (f fakeStore) ActiveProducts(context.Context, string, *bool) ([]store.Product, error) {
	return f.products, nil
}
func (f fakeStore) ActiveProductBySlug(context.Context, string) (store.Product, error) {
	return store.Product{}, store.ErrProductNotFound
}
func (f fakeStore) AllProducts(context.Context, *bool, int, int) ([]store.Product, int, error) {
	return f.products, len(f.products), nil
}
func (f fakeStore) ProductByID(context.Context, string) (store.Product, error) {
	return store.Product{}, store.ErrProductNotFound
}
func (f fakeStore) VariantsByProductID(_ context.Context, productID string) ([]store.ProductVariant, error) {
	if f.variants == nil {
		return nil, nil
	}
	return f.variants[productID], nil
}
func (f fakeStore) CreateProduct(context.Context, store.Product, []store.ProductVariant) (string, error) {
	return "", nil
}
func (f fakeStore) UpdateProduct(context.Context, string, store.Product, []store.ProductVariant) error {
	return nil
}
func (f fakeStore) DeleteProduct(context.Context, string) error { return nil }

// ponytail: stubs — auth tests don't touch testimonials
func (f fakeStore) ListPublicTestimonials(context.Context) ([]store.Testimonial, error) {
	return nil, nil
}
func (f fakeStore) ListAdminTestimonials(context.Context) ([]store.Testimonial, error) {
	return nil, nil
}
func (f fakeStore) GetTestimonialByID(context.Context, string) (store.Testimonial, error) {
	return store.Testimonial{}, store.ErrTestimonialNotFound
}
func (f fakeStore) CreateTestimonial(context.Context, *store.Testimonial) error { return nil }
func (f fakeStore) UpdateTestimonial(context.Context, *store.Testimonial) error { return nil }
func (f fakeStore) DeleteTestimonial(context.Context, string) error             { return nil }

// ponytail: stubs — auth tests don't touch tutorials
func (f fakeStore) ListPublicTutorials(context.Context) ([]store.Tutorial, error) {
	return f.tutorials, nil
}
func (f fakeStore) GetPublicTutorialBySlug(context.Context, string) (store.Tutorial, error) {
	return store.Tutorial{}, store.ErrTutorialNotFound
}
func (f fakeStore) ListAdminTutorials(context.Context) ([]store.Tutorial, error) {
	return f.tutorials, nil
}
func (f fakeStore) GetTutorialByID(context.Context, string) (store.Tutorial, error) {
	return store.Tutorial{}, store.ErrTutorialNotFound
}
func (f fakeStore) StepsByTutorialID(_ context.Context, tutorialID string) ([]store.TutorialStep, error) {
	if f.tutorialSteps == nil {
		return nil, nil
	}
	return f.tutorialSteps[tutorialID], nil
}
func (f fakeStore) CreateTutorial(context.Context, store.Tutorial, []store.TutorialStep) (string, error) {
	return "", nil
}
func (f fakeStore) UpdateTutorial(context.Context, string, store.Tutorial, []store.TutorialStep) error {
	return nil
}
func (f fakeStore) DeleteTutorial(context.Context, string) error { return nil }

// ponytail: stubs — auth tests don't touch order steps
func (f fakeStore) ListPublicOrderSteps(context.Context) ([]store.OrderStep, error) { return nil, nil }
func (f fakeStore) ListAdminOrderSteps(context.Context) ([]store.OrderStep, error)  { return nil, nil }
func (f fakeStore) ReplaceAllOrderSteps(context.Context, []store.OrderStep) error   { return nil }

// ponytail: stubs — auth tests don't touch whatsapp templates
func (f fakeStore) ListPublicWhatsAppTemplates(context.Context) ([]store.WhatsAppTemplate, error) {
	return nil, nil
}
func (f fakeStore) GetPublicWhatsAppTemplateByName(context.Context, string) (store.WhatsAppTemplate, error) {
	return store.WhatsAppTemplate{}, store.ErrWhatsAppTemplateNotFound
}
func (f fakeStore) ListAdminWhatsAppTemplates(context.Context) ([]store.WhatsAppTemplate, error) {
	return nil, nil
}
func (f fakeStore) GetWhatsAppTemplateByID(context.Context, string) (store.WhatsAppTemplate, error) {
	return store.WhatsAppTemplate{}, store.ErrWhatsAppTemplateNotFound
}
func (f fakeStore) CreateWhatsAppTemplate(context.Context, *store.WhatsAppTemplate) error {
	return nil
}
func (f fakeStore) UpdateWhatsAppTemplate(context.Context, *store.WhatsAppTemplate) error {
	return nil
}
func (f fakeStore) DeleteWhatsAppTemplate(context.Context, string) error { return nil }

func (f fakeStore) TrackAnalyticsEvent(context.Context, store.AnalyticsEvent) error { return nil }
func (f fakeStore) AnalyticsSummary(context.Context, int) (store.AnalyticsSummary, error) {
	return store.AnalyticsSummary{}, nil
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

func TestPublicProductsIncludeVariants(t *testing.T) {
	tokens, err := auth.NewTokens(
		"01234567890123456789012345678901",
		"una-project-api",
		"una-project-admin",
		time.Hour,
	)
	if err != nil {
		t.Fatal(err)
	}

	server, err := NewServer(fakeStore{
		products: []store.Product{{
			ID:               "product-1",
			Slug:             "jws-test",
			Name:             "JWS Test",
			Category:         "Jam Waktu Sholat",
			ShortDescription: "Short",
			Description:      "Long",
			PriceStartFrom:   1000,
			IsActive:         true,
			OrderIndex:       1,
		}},
		variants: map[string][]store.ProductVariant{
			"product-1": {{Name: "Versi biasa", Price: 1000, OrderIndex: 1}},
		},
	}, tokens, slog.New(slog.NewTextHandler(io.Discard, nil)))
	if err != nil {
		t.Fatal(err)
	}

	request := httptest.NewRequest(http.MethodGet, "/v1/products", nil)
	response := httptest.NewRecorder()
	server.Handler().ServeHTTP(response, request)
	if response.Code != http.StatusOK {
		t.Fatalf("products status = %d, body = %s", response.Code, response.Body.String())
	}

	var payload struct {
		Data []struct {
			Variants []struct {
				Name string `json:"name"`
			} `json:"variants"`
		} `json:"data"`
	}
	if err := json.Unmarshal(response.Body.Bytes(), &payload); err != nil {
		t.Fatal(err)
	}
	if len(payload.Data) != 1 || len(payload.Data[0].Variants) != 1 {
		t.Fatalf("expected product variants in list response, got %+v", payload.Data)
	}
}

func TestPublicTutorialsIncludeSteps(t *testing.T) {
	tokens, err := auth.NewTokens(
		"01234567890123456789012345678901",
		"una-project-api",
		"una-project-admin",
		time.Hour,
	)
	if err != nil {
		t.Fatal(err)
	}

	server, err := NewServer(fakeStore{
		tutorials: []store.Tutorial{{
			ID:               "tutorial-1",
			Slug:             "setting-jws",
			Title:            "Setting JWS",
			Category:         "Pengaturan JWS",
			ShortDescription: "Panduan singkat",
			IsActive:         true,
			OrderIndex:       1,
			CreatedAt:        time.Now(),
		}},
		tutorialSteps: map[string][]store.TutorialStep{
			"tutorial-1": {{StepNumber: 1, Title: "Nyalakan perangkat", Description: "Hubungkan adaptor."}},
		},
	}, tokens, slog.New(slog.NewTextHandler(io.Discard, nil)))
	if err != nil {
		t.Fatal(err)
	}

	request := httptest.NewRequest(http.MethodGet, "/v1/tutorials", nil)
	response := httptest.NewRecorder()
	server.Handler().ServeHTTP(response, request)
	if response.Code != http.StatusOK {
		t.Fatalf("tutorials status = %d, body = %s", response.Code, response.Body.String())
	}

	var payload struct {
		Data []struct {
			Steps []struct {
				Title string `json:"title"`
			} `json:"steps"`
		} `json:"data"`
	}
	if err := json.Unmarshal(response.Body.Bytes(), &payload); err != nil {
		t.Fatal(err)
	}
	if len(payload.Data) != 1 || len(payload.Data[0].Steps) != 1 {
		t.Fatalf("expected tutorial steps in list response, got %+v", payload.Data)
	}
}
