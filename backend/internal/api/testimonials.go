package api

import (
	"errors"
	"net/http"
	"strings"
	"time"

	"github.com/catursetyo/una-project/backend/internal/store"
)

type testimonialJSON struct {
	ID           string  `json:"id"`
	Title        string  `json:"title"`
	Description  string  `json:"description"`
	ImageURL     *string `json:"image_url"`
	ImageAlt     string  `json:"image_alt"`
	RoleLocation *string `json:"role_location"`
	Rating       int     `json:"rating"`
	IsActive     bool    `json:"is_active"`
	OrderIndex   int     `json:"order_index"`
	CreatedAt    string  `json:"created_at"`
}

type testimonialInput struct {
	Title        string  `json:"title"`
	Description  string  `json:"description"`
	ImageURL     *string `json:"image_url"`
	ImageAlt     string  `json:"image_alt"`
	RoleLocation *string `json:"role_location"`
	Rating       int     `json:"rating"`
	IsActive     bool    `json:"is_active"`
	OrderIndex   int     `json:"order_index"`
}

func toTestimonialJSON(t store.Testimonial) testimonialJSON {
	return testimonialJSON{
		ID:           t.ID,
		Title:        t.Title,
		Description:  t.Description,
		ImageURL:     t.ImageURL,
		ImageAlt:     t.ImageAlt,
		RoleLocation: t.RoleLocation,
		Rating:       t.Rating,
		IsActive:     t.IsActive,
		OrderIndex:   t.OrderIndex,
		CreatedAt:    t.CreatedAt.Format(time.RFC3339),
	}
}

func validateTestimonialInput(in *testimonialInput) map[string]any {
	errs := make(map[string]any)
	in.Title = strings.TrimSpace(in.Title)
	if in.Title == "" {
		errs["title"] = "required"
	} else if len(in.Title) > 150 {
		errs["title"] = "maximum 150 characters"
	}

	in.Description = strings.TrimSpace(in.Description)
	if in.Description == "" {
		errs["description"] = "required"
	}

	in.ImageAlt = strings.TrimSpace(in.ImageAlt)
	if in.ImageAlt == "" {
		in.ImageAlt = "Foto testimoni pelanggan UNA Project"
	} else if len(in.ImageAlt) > 255 {
		errs["image_alt"] = "maximum 255 characters"
	}

	if in.Rating == 0 {
		in.Rating = 5
	} else if in.Rating < 1 || in.Rating > 5 {
		errs["rating"] = "must be between 1 and 5"
	}

	return errs
}

func (s *Server) listPublicTestimonials(w http.ResponseWriter, r *http.Request) {
	items, err := s.store.ListPublicTestimonials(r.Context())
	if err != nil {
		s.logger.Error("list public testimonials failed", "error", err)
		writeError(w, http.StatusInternalServerError, "ERR_INTERNAL", "Internal server error")
		return
	}

	result := make([]testimonialJSON, 0, len(items))
	for _, t := range items {
		result = append(result, toTestimonialJSON(t))
	}
	writeJSON(w, http.StatusOK, response{Success: true, Data: result})
}

func (s *Server) listAdminTestimonials(w http.ResponseWriter, r *http.Request) {
	items, err := s.store.ListAdminTestimonials(r.Context())
	if err != nil {
		s.logger.Error("list admin testimonials failed", "error", err)
		writeError(w, http.StatusInternalServerError, "ERR_INTERNAL", "Internal server error")
		return
	}

	result := make([]testimonialJSON, 0, len(items))
	for _, t := range items {
		result = append(result, toTestimonialJSON(t))
	}
	writeJSON(w, http.StatusOK, response{Success: true, Data: result})
}

func (s *Server) getAdminTestimonial(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if id == "" {
		writeError(w, http.StatusBadRequest, "ERR_BAD_REQUEST", "ID is required")
		return
	}

	t, err := s.store.GetTestimonialByID(r.Context(), id)
	if err != nil {
		if errors.Is(err, store.ErrTestimonialNotFound) {
			writeError(w, http.StatusNotFound, "ERR_NOT_FOUND", "Testimonial not found")
			return
		}
		s.logger.Error("get admin testimonial failed", "id", id, "error", err)
		writeError(w, http.StatusInternalServerError, "ERR_INTERNAL", "Internal server error")
		return
	}

	writeJSON(w, http.StatusOK, response{Success: true, Data: toTestimonialJSON(t)})
}

func (s *Server) createTestimonial(w http.ResponseWriter, r *http.Request) {
	r.Body = http.MaxBytesReader(w, r.Body, 64<<10)
	var input testimonialInput
	if err := decodeJSON(r, &input); err != nil {
		writeError(w, http.StatusBadRequest, "ERR_BAD_REQUEST", "Invalid request body")
		return
	}

	if errs := validateTestimonialInput(&input); len(errs) > 0 {
		writeJSON(w, http.StatusUnprocessableEntity, response{
			Success:   false,
			ErrorCode: "ERR_VALIDATION",
			Message:   "Validation failed",
			Errors:    errs,
		})
		return
	}

	t := store.Testimonial{
		Title:        input.Title,
		Description:  input.Description,
		ImageURL:     input.ImageURL,
		ImageAlt:     input.ImageAlt,
		RoleLocation: input.RoleLocation,
		Rating:       input.Rating,
		IsActive:     input.IsActive,
		OrderIndex:   input.OrderIndex,
	}

	if err := s.store.CreateTestimonial(r.Context(), &t); err != nil {
		s.logger.Error("create testimonial failed", "error", err)
		writeError(w, http.StatusInternalServerError, "ERR_INTERNAL", "Internal server error")
		return
	}

	writeJSON(w, http.StatusCreated, response{Success: true, Data: toTestimonialJSON(t), Message: "Testimonial created"})
}

func (s *Server) updateTestimonial(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if id == "" {
		writeError(w, http.StatusBadRequest, "ERR_BAD_REQUEST", "ID is required")
		return
	}

	r.Body = http.MaxBytesReader(w, r.Body, 64<<10)
	var input testimonialInput
	if err := decodeJSON(r, &input); err != nil {
		writeError(w, http.StatusBadRequest, "ERR_BAD_REQUEST", "Invalid request body")
		return
	}

	if errs := validateTestimonialInput(&input); len(errs) > 0 {
		writeJSON(w, http.StatusUnprocessableEntity, response{
			Success:   false,
			ErrorCode: "ERR_VALIDATION",
			Message:   "Validation failed",
			Errors:    errs,
		})
		return
	}

	t := store.Testimonial{
		ID:           id,
		Title:        input.Title,
		Description:  input.Description,
		ImageURL:     input.ImageURL,
		ImageAlt:     input.ImageAlt,
		RoleLocation: input.RoleLocation,
		Rating:       input.Rating,
		IsActive:     input.IsActive,
		OrderIndex:   input.OrderIndex,
	}

	if err := s.store.UpdateTestimonial(r.Context(), &t); err != nil {
		if errors.Is(err, store.ErrTestimonialNotFound) {
			writeError(w, http.StatusNotFound, "ERR_NOT_FOUND", "Testimonial not found")
			return
		}
		s.logger.Error("update testimonial failed", "id", id, "error", err)
		writeError(w, http.StatusInternalServerError, "ERR_INTERNAL", "Internal server error")
		return
	}

	writeJSON(w, http.StatusOK, response{Success: true, Data: toTestimonialJSON(t), Message: "Testimonial updated"})
}

func (s *Server) deleteTestimonial(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if id == "" {
		writeError(w, http.StatusBadRequest, "ERR_BAD_REQUEST", "ID is required")
		return
	}

	if err := s.store.DeleteTestimonial(r.Context(), id); err != nil {
		if errors.Is(err, store.ErrTestimonialNotFound) {
			writeError(w, http.StatusNotFound, "ERR_NOT_FOUND", "Testimonial not found")
			return
		}
		s.logger.Error("delete testimonial failed", "id", id, "error", err)
		writeError(w, http.StatusInternalServerError, "ERR_INTERNAL", "Internal server error")
		return
	}

	writeJSON(w, http.StatusOK, response{Success: true, Message: "Testimonial deleted"})
}
