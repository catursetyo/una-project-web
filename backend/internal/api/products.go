package api

import (
	"errors"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/catursetyo/una-project/backend/internal/store"
)

// --- JSON response types ---

type productJSON struct {
	ID               string        `json:"id"`
	Slug             string        `json:"slug"`
	Name             string        `json:"name"`
	Category         string        `json:"category"`
	ShortDescription string        `json:"short_description"`
	Description      string        `json:"description"`
	Dimensions       *string       `json:"dimensions"`
	Features         []string      `json:"features"`
	PriceStartFrom   float64       `json:"price_start_from"`
	ImageURL         *string       `json:"image_url"`
	VideoURL         *string       `json:"video_url"`
	IsFeatured       bool          `json:"is_featured"`
	IsActive         bool          `json:"is_active"`
	OrderIndex       int           `json:"order_index"`
	Variants         []variantJSON `json:"variants"`
	CreatedAt        time.Time     `json:"created_at"`
	UpdatedAt        time.Time     `json:"updated_at"`
}

type variantJSON struct {
	ID          string  `json:"id"`
	Name        string  `json:"name"`
	Price       float64 `json:"price"`
	Description *string `json:"description,omitempty"`
	OrderIndex  int     `json:"order_index"`
}

// --- JSON input types ---

type productInput struct {
	Slug             string         `json:"slug"`
	Name             string         `json:"name"`
	Category         string         `json:"category"`
	ShortDescription string         `json:"short_description"`
	Description      string         `json:"description"`
	Dimensions       *string        `json:"dimensions"`
	Features         []string       `json:"features"`
	PriceStartFrom   float64        `json:"price_start_from"`
	ImageURL         *string        `json:"image_url"`
	VideoURL         *string        `json:"video_url"`
	IsFeatured       bool           `json:"is_featured"`
	IsActive         bool           `json:"is_active"`
	OrderIndex       int            `json:"order_index"`
	Variants         []variantInput `json:"variants"`
}

type variantInput struct {
	Name        string  `json:"name"`
	Price       float64 `json:"price"`
	Description *string `json:"description"`
	OrderIndex  int     `json:"order_index"`
}

// --- Public handlers ---

func (s *Server) listPublicProducts(w http.ResponseWriter, r *http.Request) {
	category := r.URL.Query().Get("category")
	var featured *bool
	switch r.URL.Query().Get("featured") {
	case "true", "1":
		v := true
		featured = &v
	case "false", "0":
		v := false
		featured = &v
	}

	products, err := s.store.ActiveProducts(r.Context(), category, featured)
	if err != nil {
		s.logger.Error("list public products failed", "error", err)
		writeError(w, http.StatusInternalServerError, "ERR_INTERNAL", "Internal server error")
		return
	}

	result := make([]productJSON, 0, len(products))
	for _, p := range products {
		variants, err := s.store.VariantsByProductID(r.Context(), p.ID)
		if err != nil {
			s.logger.Error("get public product variants failed", "product_id", p.ID, "error", err)
			writeError(w, http.StatusInternalServerError, "ERR_INTERNAL", "Internal server error")
			return
		}
		result = append(result, toProductJSON(p, variants))
	}
	writeJSON(w, http.StatusOK, response{Success: true, Data: result})
}

func (s *Server) getPublicProduct(w http.ResponseWriter, r *http.Request) {
	product, err := s.store.ActiveProductBySlug(r.Context(), r.PathValue("slug"))
	if err != nil {
		if errors.Is(err, store.ErrProductNotFound) {
			writeError(w, http.StatusNotFound, "ERR_NOT_FOUND", "Product not found")
			return
		}
		s.logger.Error("get public product failed", "error", err)
		writeError(w, http.StatusInternalServerError, "ERR_INTERNAL", "Internal server error")
		return
	}

	variants, err := s.store.VariantsByProductID(r.Context(), product.ID)
	if err != nil {
		s.logger.Error("get product variants failed", "error", err)
		writeError(w, http.StatusInternalServerError, "ERR_INTERNAL", "Internal server error")
		return
	}

	writeJSON(w, http.StatusOK, response{Success: true, Data: toProductJSON(product, variants)})
}

// --- Admin handlers (wrapped with requireAdmin) ---

func (s *Server) listAdminProducts(w http.ResponseWriter, r *http.Request) {
	page, _ := strconv.Atoi(r.URL.Query().Get("page"))
	if page < 1 {
		page = 1
	}
	limit, _ := strconv.Atoi(r.URL.Query().Get("limit"))
	if limit < 1 || limit > 100 {
		limit = 20
	}

	var activeOnly *bool
	switch r.URL.Query().Get("status") {
	case "active":
		v := true
		activeOnly = &v
	case "draft":
		v := false
		activeOnly = &v
	}

	products, total, err := s.store.AllProducts(r.Context(), activeOnly, limit, (page-1)*limit)
	if err != nil {
		s.logger.Error("list admin products failed", "error", err)
		writeError(w, http.StatusInternalServerError, "ERR_INTERNAL", "Internal server error")
		return
	}

	items := make([]productJSON, 0, len(products))
	for _, p := range products {
		variants, err := s.store.VariantsByProductID(r.Context(), p.ID)
		if err != nil {
			s.logger.Error("get admin product variants failed", "product_id", p.ID, "error", err)
			writeError(w, http.StatusInternalServerError, "ERR_INTERNAL", "Internal server error")
			return
		}
		items = append(items, toProductJSON(p, variants))
	}
	writeJSON(w, http.StatusOK, response{
		Success: true,
		Data: map[string]any{
			"items": items,
			"total": total,
			"page":  page,
			"limit": limit,
		},
	})
}

func (s *Server) getAdminProduct(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	product, err := s.store.ProductByID(r.Context(), id)
	if err != nil {
		if errors.Is(err, store.ErrProductNotFound) {
			writeError(w, http.StatusNotFound, "ERR_NOT_FOUND", "Product not found")
			return
		}
		s.logger.Error("get admin product failed", "id", id, "error", err)
		writeError(w, http.StatusInternalServerError, "ERR_INTERNAL", "Internal server error")
		return
	}

	variants, err := s.store.VariantsByProductID(r.Context(), id)
	if err != nil {
		s.logger.Error("get product variants failed", "error", err)
		writeError(w, http.StatusInternalServerError, "ERR_INTERNAL", "Internal server error")
		return
	}

	writeJSON(w, http.StatusOK, response{Success: true, Data: toProductJSON(product, variants)})
}

func (s *Server) createProduct(w http.ResponseWriter, r *http.Request) {
	r.Body = http.MaxBytesReader(w, r.Body, 64<<10)
	var input productInput
	if err := decodeJSON(r, &input); err != nil {
		writeError(w, http.StatusBadRequest, "ERR_BAD_REQUEST", "Invalid request body")
		return
	}

	if errs := validateProductInput(input); len(errs) > 0 {
		writeJSON(w, http.StatusUnprocessableEntity, response{
			Success: false, ErrorCode: "ERR_VALIDATION", Message: "Validation failed", Errors: errs,
		})
		return
	}

	id, err := s.store.CreateProduct(r.Context(), inputToProduct(input), inputToVariants(input.Variants))
	if err != nil {
		if errors.Is(err, store.ErrSlugConflict) {
			writeError(w, http.StatusConflict, "ERR_CONFLICT", "Slug already exists")
			return
		}
		s.logger.Error("create product failed", "error", err)
		writeError(w, http.StatusInternalServerError, "ERR_INTERNAL", "Internal server error")
		return
	}

	// Re-fetch untuk mengembalikan data lengkap dengan field yang di-generate DB
	product, err := s.store.ProductByID(r.Context(), id)
	if err != nil {
		s.logger.Error("get created product failed", "id", id, "error", err)
		writeError(w, http.StatusInternalServerError, "ERR_INTERNAL", "Internal server error")
		return
	}
	variants, err := s.store.VariantsByProductID(r.Context(), id)
	if err != nil {
		s.logger.Error("get created product variants failed", "id", id, "error", err)
		writeError(w, http.StatusInternalServerError, "ERR_INTERNAL", "Internal server error")
		return
	}
	writeJSON(w, http.StatusCreated, response{
		Success: true, Message: "Product created", Data: toProductJSON(product, variants),
	})
}

func (s *Server) updateProduct(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	r.Body = http.MaxBytesReader(w, r.Body, 64<<10)
	var input productInput
	if err := decodeJSON(r, &input); err != nil {
		writeError(w, http.StatusBadRequest, "ERR_BAD_REQUEST", "Invalid request body")
		return
	}

	if errs := validateProductInput(input); len(errs) > 0 {
		writeJSON(w, http.StatusUnprocessableEntity, response{
			Success: false, ErrorCode: "ERR_VALIDATION", Message: "Validation failed", Errors: errs,
		})
		return
	}

	if err := s.store.UpdateProduct(r.Context(), id, inputToProduct(input), inputToVariants(input.Variants)); err != nil {
		if errors.Is(err, store.ErrProductNotFound) {
			writeError(w, http.StatusNotFound, "ERR_NOT_FOUND", "Product not found")
			return
		}
		if errors.Is(err, store.ErrSlugConflict) {
			writeError(w, http.StatusConflict, "ERR_CONFLICT", "Slug already exists")
			return
		}
		s.logger.Error("update product failed", "id", id, "error", err)
		writeError(w, http.StatusInternalServerError, "ERR_INTERNAL", "Internal server error")
		return
	}

	product, err := s.store.ProductByID(r.Context(), id)
	if err != nil {
		s.logger.Error("get updated product failed", "id", id, "error", err)
		writeError(w, http.StatusInternalServerError, "ERR_INTERNAL", "Internal server error")
		return
	}
	variants, err := s.store.VariantsByProductID(r.Context(), id)
	if err != nil {
		s.logger.Error("get updated product variants failed", "id", id, "error", err)
		writeError(w, http.StatusInternalServerError, "ERR_INTERNAL", "Internal server error")
		return
	}
	writeJSON(w, http.StatusOK, response{
		Success: true, Message: "Product updated", Data: toProductJSON(product, variants),
	})
}

func (s *Server) deleteProduct(w http.ResponseWriter, r *http.Request) {
	if err := s.store.DeleteProduct(r.Context(), r.PathValue("id")); err != nil {
		if errors.Is(err, store.ErrProductNotFound) {
			writeError(w, http.StatusNotFound, "ERR_NOT_FOUND", "Product not found")
			return
		}
		s.logger.Error("delete product failed", "error", err)
		writeError(w, http.StatusInternalServerError, "ERR_INTERNAL", "Internal server error")
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

// --- conversion helpers ---

func toProductJSON(p store.Product, variants []store.ProductVariant) productJSON {
	features := p.Features
	if features == nil {
		features = []string{}
	}
	vjs := make([]variantJSON, 0, len(variants))
	for _, v := range variants {
		vjs = append(vjs, variantJSON{
			ID: v.ID, Name: v.Name, Price: v.Price,
			Description: v.Description, OrderIndex: v.OrderIndex,
		})
	}
	return productJSON{
		ID: p.ID, Slug: p.Slug, Name: p.Name, Category: p.Category,
		ShortDescription: p.ShortDescription, Description: p.Description,
		Dimensions: p.Dimensions, Features: features,
		PriceStartFrom: p.PriceStartFrom, ImageURL: p.ImageURL,
		VideoURL: p.VideoURL, IsFeatured: p.IsFeatured,
		IsActive: p.IsActive, OrderIndex: p.OrderIndex,
		Variants: vjs, CreatedAt: p.CreatedAt, UpdatedAt: p.UpdatedAt,
	}
}

func validateProductInput(input productInput) map[string]any {
	errs := map[string]any{}
	slug := strings.TrimSpace(input.Slug)
	if slug == "" {
		errs["slug"] = "required"
	} else if !isValidSlug(slug) {
		errs["slug"] = "lowercase alphanumeric and hyphens only"
	}
	if strings.TrimSpace(input.Name) == "" {
		errs["name"] = "required"
	}
	if strings.TrimSpace(input.Category) == "" {
		errs["category"] = "required"
	}
	if strings.TrimSpace(input.ShortDescription) == "" {
		errs["short_description"] = "required"
	}
	if strings.TrimSpace(input.Description) == "" {
		errs["description"] = "required"
	}
	if input.PriceStartFrom < 0 {
		errs["price_start_from"] = "must be zero or positive"
	}
	if len(input.Variants) == 0 {
		errs["variants"] = "at least one variant required"
	}
	for i, v := range input.Variants {
		prefix := "variants[" + strconv.Itoa(i) + "]."
		if strings.TrimSpace(v.Name) == "" {
			errs[prefix+"name"] = "required"
		}
		if v.Price < 0 {
			errs[prefix+"price"] = "must be zero or positive"
		}
	}
	return errs
}

func isValidSlug(s string) bool {
	for _, c := range s {
		if !((c >= 'a' && c <= 'z') || (c >= '0' && c <= '9') || c == '-') {
			return false
		}
	}
	return s != "" && s[0] != '-' && s[len(s)-1] != '-'
}

func inputToProduct(input productInput) store.Product {
	features := input.Features
	if features == nil {
		features = []string{}
	}
	return store.Product{
		Slug:             strings.TrimSpace(input.Slug),
		Name:             strings.TrimSpace(input.Name),
		Category:         strings.TrimSpace(input.Category),
		ShortDescription: strings.TrimSpace(input.ShortDescription),
		Description:      strings.TrimSpace(input.Description),
		Dimensions:       input.Dimensions,
		Features:         features,
		PriceStartFrom:   input.PriceStartFrom,
		ImageURL:         input.ImageURL,
		VideoURL:         input.VideoURL,
		IsFeatured:       input.IsFeatured,
		IsActive:         input.IsActive,
		OrderIndex:       input.OrderIndex,
	}
}

func inputToVariants(inputs []variantInput) []store.ProductVariant {
	variants := make([]store.ProductVariant, len(inputs))
	for i, v := range inputs {
		variants[i] = store.ProductVariant{
			Name:        strings.TrimSpace(v.Name),
			Price:       v.Price,
			Description: v.Description,
			OrderIndex:  v.OrderIndex,
		}
	}
	return variants
}
