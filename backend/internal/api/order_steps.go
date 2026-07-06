package api

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/catursetyo/una-project/backend/internal/store"
)

type orderStepJSON struct {
	ID          string `json:"id,omitempty"`
	StepNumber  string `json:"step_number"`
	Title       string `json:"title"`
	Description string `json:"description"`
	IconName    string `json:"icon_name"`
	IsActive    bool   `json:"is_active"`
	OrderIndex  int    `json:"order_index"`
}

type orderStepInput struct {
	StepNumber  string `json:"step_number"`
	Title       string `json:"title"`
	Description string `json:"description"`
	IconName    string `json:"icon_name"`
	IsActive    bool   `json:"is_active"`
	OrderIndex  int    `json:"order_index"`
}

type orderStepsBulkInput struct {
	Steps []orderStepInput `json:"steps"`
}

func toOrderStepJSON(s store.OrderStep) orderStepJSON {
	return orderStepJSON{
		ID:          s.ID,
		StepNumber:  s.StepNumber,
		Title:       s.Title,
		Description: s.Description,
		IconName:    s.IconName,
		IsActive:    s.IsActive,
		OrderIndex:  s.OrderIndex,
	}
}

func validateOrderStepsInput(in *orderStepsBulkInput) map[string]any {
	errs := make(map[string]any)
	if len(in.Steps) == 0 {
		errs["steps"] = "at least one order step is required"
		return errs
	}

	for i, s := range in.Steps {
		s.Title = strings.TrimSpace(s.Title)
		s.Description = strings.TrimSpace(s.Description)
		if s.Title == "" {
			errs[fmt.Sprintf("steps.%d.title", i)] = "required"
		} else if len(s.Title) > 150 {
			errs[fmt.Sprintf("steps.%d.title", i)] = "maximum 150 characters"
		}
		if s.Description == "" {
			errs[fmt.Sprintf("steps.%d.description", i)] = "required"
		}
	}

	return errs
}

func (s *Server) listPublicOrderSteps(w http.ResponseWriter, r *http.Request) {
	items, err := s.store.ListPublicOrderSteps(r.Context())
	if err != nil {
		s.logger.Error("list public order steps failed", "error", err)
		writeError(w, http.StatusInternalServerError, "ERR_INTERNAL", "Internal server error")
		return
	}

	result := make([]orderStepJSON, 0, len(items))
	for _, st := range items {
		result = append(result, toOrderStepJSON(st))
	}
	writeJSON(w, http.StatusOK, response{Success: true, Data: result})
}

func (s *Server) listAdminOrderSteps(w http.ResponseWriter, r *http.Request) {
	items, err := s.store.ListAdminOrderSteps(r.Context())
	if err != nil {
		s.logger.Error("list admin order steps failed", "error", err)
		writeError(w, http.StatusInternalServerError, "ERR_INTERNAL", "Internal server error")
		return
	}

	result := make([]orderStepJSON, 0, len(items))
	for _, st := range items {
		result = append(result, toOrderStepJSON(st))
	}
	writeJSON(w, http.StatusOK, response{Success: true, Data: result})
}

func (s *Server) replaceAllOrderSteps(w http.ResponseWriter, r *http.Request) {
	r.Body = http.MaxBytesReader(w, r.Body, 64<<10)
	var input orderStepsBulkInput
	if err := decodeJSON(r, &input); err != nil {
		writeError(w, http.StatusBadRequest, "ERR_BAD_REQUEST", "Invalid request body")
		return
	}

	if errs := validateOrderStepsInput(&input); len(errs) > 0 {
		writeJSON(w, http.StatusUnprocessableEntity, response{
			Success:   false,
			ErrorCode: "ERR_VALIDATION",
			Message:   "Validation failed",
			Errors:    errs,
		})
		return
	}

	steps := make([]store.OrderStep, 0, len(input.Steps))
	for _, st := range input.Steps {
		steps = append(steps, store.OrderStep{
			StepNumber:  st.StepNumber,
			Title:       st.Title,
			Description: st.Description,
			IconName:    st.IconName,
			IsActive:    st.IsActive,
			OrderIndex:  st.OrderIndex,
		})
	}

	if err := s.store.ReplaceAllOrderSteps(r.Context(), steps); err != nil {
		s.logger.Error("replace all order steps failed", "error", err)
		writeError(w, http.StatusInternalServerError, "ERR_INTERNAL", "Internal server error")
		return
	}

	writeJSON(w, http.StatusOK, response{Success: true, Message: "Order steps updated successfully"})
}
