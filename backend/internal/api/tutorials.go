package api

import (
	"errors"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/catursetyo/una-project/backend/internal/store"
)

type tutorialStepJSON struct {
	ID          string  `json:"id,omitempty"`
	StepNumber  int     `json:"step_number"`
	Title       string  `json:"title"`
	Description string  `json:"description"`
	Highlight   *string `json:"highlight,omitempty"`
}

type tutorialJSON struct {
	ID               string             `json:"id"`
	Slug             string             `json:"slug"`
	Title            string             `json:"title"`
	Category         string             `json:"category"`
	ShortDescription string             `json:"short_description"`
	VideoURL         *string            `json:"video_url,omitempty"`
	IsActive         bool               `json:"is_active"`
	OrderIndex       int                `json:"order_index"`
	CreatedAt        string             `json:"created_at"`
	Steps            []tutorialStepJSON `json:"steps,omitempty"`
}

type tutorialStepInput struct {
	StepNumber  int     `json:"step_number"`
	Title       string  `json:"title"`
	Description string  `json:"description"`
	Highlight   *string `json:"highlight,omitempty"`
}

type tutorialInput struct {
	Slug             string              `json:"slug"`
	Title            string              `json:"title"`
	Category         string              `json:"category"`
	ShortDescription string              `json:"short_description"`
	VideoURL         *string             `json:"video_url,omitempty"`
	IsActive         bool                `json:"is_active"`
	OrderIndex       int                 `json:"order_index"`
	Steps            []tutorialStepInput `json:"steps"`
}

func toTutorialJSON(t store.Tutorial, steps []store.TutorialStep) tutorialJSON {
	var stepJSONs []tutorialStepJSON
	if steps != nil {
		stepJSONs = make([]tutorialStepJSON, 0, len(steps))
		for _, s := range steps {
			stepJSONs = append(stepJSONs, tutorialStepJSON{
				ID:          s.ID,
				StepNumber:  s.StepNumber,
				Title:       s.Title,
				Description: s.Description,
				Highlight:   s.Highlight,
			})
		}
	}
	return tutorialJSON{
		ID:               t.ID,
		Slug:             t.Slug,
		Title:            t.Title,
		Category:         t.Category,
		ShortDescription: t.ShortDescription,
		VideoURL:         t.VideoURL,
		IsActive:         t.IsActive,
		OrderIndex:       t.OrderIndex,
		CreatedAt:        t.CreatedAt.Format(time.RFC3339),
		Steps:            stepJSONs,
	}
}

func validateTutorialInput(in *tutorialInput) map[string]any {
	errs := make(map[string]any)
	in.Slug = strings.TrimSpace(in.Slug)
	if in.Slug == "" {
		errs["slug"] = "required"
	} else if len(in.Slug) > 150 {
		errs["slug"] = "maximum 150 characters"
	}

	in.Title = strings.TrimSpace(in.Title)
	if in.Title == "" {
		errs["title"] = "required"
	} else if len(in.Title) > 200 {
		errs["title"] = "maximum 200 characters"
	}

	in.Category = strings.TrimSpace(in.Category)
	if in.Category == "" {
		errs["category"] = "required"
	} else if len(in.Category) > 50 {
		errs["category"] = "maximum 50 characters"
	}

	in.ShortDescription = strings.TrimSpace(in.ShortDescription)
	if in.ShortDescription == "" {
		errs["short_description"] = "required"
	} else if len(in.ShortDescription) > 255 {
		errs["short_description"] = "maximum 255 characters"
	}

	if len(in.Steps) == 0 {
		errs["steps"] = "at least one step required"
	}
	for i, s := range in.Steps {
		s.Title = strings.TrimSpace(s.Title)
		s.Description = strings.TrimSpace(s.Description)
		if s.Title == "" || s.Description == "" {
			errs[fmt.Sprintf("steps.%d", i)] = "title and description are required"
		}
	}

	return errs
}

func (s *Server) listPublicTutorials(w http.ResponseWriter, r *http.Request) {
	items, err := s.store.ListPublicTutorials(r.Context())
	if err != nil {
		s.logger.Error("list public tutorials failed", "error", err)
		writeError(w, http.StatusInternalServerError, "ERR_INTERNAL", "Internal server error")
		return
	}

	result := make([]tutorialJSON, 0, len(items))
	for _, t := range items {
		steps, err := s.store.StepsByTutorialID(r.Context(), t.ID)
		if err != nil {
			s.logger.Error("get public tutorial steps failed", "tutorial_id", t.ID, "error", err)
			writeError(w, http.StatusInternalServerError, "ERR_INTERNAL", "Internal server error")
			return
		}
		result = append(result, toTutorialJSON(t, steps))
	}
	writeJSON(w, http.StatusOK, response{Success: true, Data: result})
}

func (s *Server) getPublicTutorial(w http.ResponseWriter, r *http.Request) {
	slug := r.PathValue("slug")
	if slug == "" {
		writeError(w, http.StatusBadRequest, "ERR_BAD_REQUEST", "Slug is required")
		return
	}

	t, err := s.store.GetPublicTutorialBySlug(r.Context(), slug)
	if err != nil {
		if errors.Is(err, store.ErrTutorialNotFound) {
			writeError(w, http.StatusNotFound, "ERR_NOT_FOUND", "Tutorial not found")
			return
		}
		s.logger.Error("get public tutorial failed", "slug", slug, "error", err)
		writeError(w, http.StatusInternalServerError, "ERR_INTERNAL", "Internal server error")
		return
	}

	steps, err := s.store.StepsByTutorialID(r.Context(), t.ID)
	if err != nil {
		s.logger.Error("get tutorial steps failed", "tutorial_id", t.ID, "error", err)
		writeError(w, http.StatusInternalServerError, "ERR_INTERNAL", "Internal server error")
		return
	}

	writeJSON(w, http.StatusOK, response{Success: true, Data: toTutorialJSON(t, steps)})
}

func (s *Server) listAdminTutorials(w http.ResponseWriter, r *http.Request) {
	items, err := s.store.ListAdminTutorials(r.Context())
	if err != nil {
		s.logger.Error("list admin tutorials failed", "error", err)
		writeError(w, http.StatusInternalServerError, "ERR_INTERNAL", "Internal server error")
		return
	}

	result := make([]tutorialJSON, 0, len(items))
	for _, t := range items {
		steps, err := s.store.StepsByTutorialID(r.Context(), t.ID)
		if err != nil {
			s.logger.Error("get admin tutorial steps failed", "tutorial_id", t.ID, "error", err)
			writeError(w, http.StatusInternalServerError, "ERR_INTERNAL", "Internal server error")
			return
		}
		result = append(result, toTutorialJSON(t, steps))
	}
	writeJSON(w, http.StatusOK, response{Success: true, Data: result})
}

func (s *Server) getAdminTutorial(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if id == "" {
		writeError(w, http.StatusBadRequest, "ERR_BAD_REQUEST", "ID is required")
		return
	}

	t, err := s.store.GetTutorialByID(r.Context(), id)
	if err != nil {
		if errors.Is(err, store.ErrTutorialNotFound) {
			writeError(w, http.StatusNotFound, "ERR_NOT_FOUND", "Tutorial not found")
			return
		}
		s.logger.Error("get admin tutorial failed", "id", id, "error", err)
		writeError(w, http.StatusInternalServerError, "ERR_INTERNAL", "Internal server error")
		return
	}

	steps, err := s.store.StepsByTutorialID(r.Context(), t.ID)
	if err != nil {
		s.logger.Error("get tutorial steps failed", "tutorial_id", t.ID, "error", err)
		writeError(w, http.StatusInternalServerError, "ERR_INTERNAL", "Internal server error")
		return
	}

	writeJSON(w, http.StatusOK, response{Success: true, Data: toTutorialJSON(t, steps)})
}

func (s *Server) createTutorial(w http.ResponseWriter, r *http.Request) {
	r.Body = http.MaxBytesReader(w, r.Body, 128<<10)
	var input tutorialInput
	if err := decodeJSON(r, &input); err != nil {
		writeError(w, http.StatusBadRequest, "ERR_BAD_REQUEST", "Invalid request body")
		return
	}

	if errs := validateTutorialInput(&input); len(errs) > 0 {
		writeJSON(w, http.StatusUnprocessableEntity, response{
			Success:   false,
			ErrorCode: "ERR_VALIDATION",
			Message:   "Validation failed",
			Errors:    errs,
		})
		return
	}

	t := store.Tutorial{
		Slug:             input.Slug,
		Title:            input.Title,
		Category:         input.Category,
		ShortDescription: input.ShortDescription,
		VideoURL:         input.VideoURL,
		IsActive:         input.IsActive,
		OrderIndex:       input.OrderIndex,
	}

	var steps []store.TutorialStep
	for i, st := range input.Steps {
		stepNum := st.StepNumber
		if stepNum <= 0 {
			stepNum = i + 1
		}
		steps = append(steps, store.TutorialStep{
			StepNumber:  stepNum,
			Title:       st.Title,
			Description: st.Description,
			Highlight:   st.Highlight,
		})
	}

	id, err := s.store.CreateTutorial(r.Context(), t, steps)
	if err != nil {
		if errors.Is(err, store.ErrSlugConflict) {
			writeJSON(w, http.StatusConflict, response{
				Success:   false,
				ErrorCode: "ERR_CONFLICT",
				Message:   "Slug already exists",
			})
			return
		}
		s.logger.Error("create tutorial failed", "error", err)
		writeError(w, http.StatusInternalServerError, "ERR_INTERNAL", "Internal server error")
		return
	}

	t.ID = id
	t.CreatedAt = time.Now()
	writeJSON(w, http.StatusCreated, response{Success: true, Data: toTutorialJSON(t, steps), Message: "Tutorial created"})
}

func (s *Server) updateTutorial(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if id == "" {
		writeError(w, http.StatusBadRequest, "ERR_BAD_REQUEST", "ID is required")
		return
	}

	r.Body = http.MaxBytesReader(w, r.Body, 128<<10)
	var input tutorialInput
	if err := decodeJSON(r, &input); err != nil {
		writeError(w, http.StatusBadRequest, "ERR_BAD_REQUEST", "Invalid request body")
		return
	}

	if errs := validateTutorialInput(&input); len(errs) > 0 {
		writeJSON(w, http.StatusUnprocessableEntity, response{
			Success:   false,
			ErrorCode: "ERR_VALIDATION",
			Message:   "Validation failed",
			Errors:    errs,
		})
		return
	}

	t := store.Tutorial{
		Slug:             input.Slug,
		Title:            input.Title,
		Category:         input.Category,
		ShortDescription: input.ShortDescription,
		VideoURL:         input.VideoURL,
		IsActive:         input.IsActive,
		OrderIndex:       input.OrderIndex,
	}

	var steps []store.TutorialStep
	for i, st := range input.Steps {
		stepNum := st.StepNumber
		if stepNum <= 0 {
			stepNum = i + 1
		}
		steps = append(steps, store.TutorialStep{
			StepNumber:  stepNum,
			Title:       st.Title,
			Description: st.Description,
			Highlight:   st.Highlight,
		})
	}

	if err := s.store.UpdateTutorial(r.Context(), id, t, steps); err != nil {
		if errors.Is(err, store.ErrSlugConflict) {
			writeJSON(w, http.StatusConflict, response{
				Success:   false,
				ErrorCode: "ERR_CONFLICT",
				Message:   "Slug already exists",
			})
			return
		}
		if errors.Is(err, store.ErrTutorialNotFound) {
			writeError(w, http.StatusNotFound, "ERR_NOT_FOUND", "Tutorial not found")
			return
		}
		s.logger.Error("update tutorial failed", "id", id, "error", err)
		writeError(w, http.StatusInternalServerError, "ERR_INTERNAL", "Internal server error")
		return
	}

	t.ID = id
	writeJSON(w, http.StatusOK, response{Success: true, Data: toTutorialJSON(t, steps), Message: "Tutorial updated"})
}

func (s *Server) deleteTutorial(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if id == "" {
		writeError(w, http.StatusBadRequest, "ERR_BAD_REQUEST", "ID is required")
		return
	}

	if err := s.store.DeleteTutorial(r.Context(), id); err != nil {
		if errors.Is(err, store.ErrTutorialNotFound) {
			writeError(w, http.StatusNotFound, "ERR_NOT_FOUND", "Tutorial not found")
			return
		}
		s.logger.Error("delete tutorial failed", "id", id, "error", err)
		writeError(w, http.StatusInternalServerError, "ERR_INTERNAL", "Internal server error")
		return
	}

	writeJSON(w, http.StatusOK, response{Success: true, Message: "Tutorial deleted"})
}
