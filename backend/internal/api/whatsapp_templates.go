package api

import (
	"errors"
	"net/http"
	"strings"
	"time"

	"github.com/catursetyo/una-project/backend/internal/store"
)

type whatsappTemplateJSON struct {
	ID             string `json:"id"`
	TemplateName   string `json:"template_name"`
	Category       string `json:"category"`
	MessagePattern string `json:"message_pattern"`
	IsDefault      bool   `json:"is_default"`
	IsActive       bool   `json:"is_active"`
	CreatedAt      string `json:"created_at"`
}

type whatsappTemplateInput struct {
	TemplateName   string `json:"template_name"`
	Category       string `json:"category"`
	MessagePattern string `json:"message_pattern"`
	IsDefault      bool   `json:"is_default"`
	IsActive       bool   `json:"is_active"`
}

func toWhatsAppTemplateJSON(t store.WhatsAppTemplate) whatsappTemplateJSON {
	return whatsappTemplateJSON{
		ID:             t.ID,
		TemplateName:   t.TemplateName,
		Category:       t.Category,
		MessagePattern: t.MessagePattern,
		IsDefault:      t.IsDefault,
		IsActive:       t.IsActive,
		CreatedAt:      t.CreatedAt.Format(time.RFC3339),
	}
}

func validateWhatsAppTemplateInput(in *whatsappTemplateInput) map[string]any {
	errs := make(map[string]any)
	in.TemplateName = strings.TrimSpace(in.TemplateName)
	if in.TemplateName == "" {
		errs["template_name"] = "required"
	} else if len(in.TemplateName) > 100 {
		errs["template_name"] = "maximum 100 characters"
	}

	in.Category = strings.TrimSpace(in.Category)
	if in.Category == "" {
		errs["category"] = "required"
	} else if len(in.Category) > 50 {
		errs["category"] = "maximum 50 characters"
	}

	in.MessagePattern = strings.TrimSpace(in.MessagePattern)
	if in.MessagePattern == "" {
		errs["message_pattern"] = "required"
	}

	return errs
}

func (s *Server) listPublicWhatsAppTemplates(w http.ResponseWriter, r *http.Request) {
	items, err := s.store.ListPublicWhatsAppTemplates(r.Context())
	if err != nil {
		s.logger.Error("list public whatsapp templates failed", "error", err)
		writeError(w, http.StatusInternalServerError, "ERR_INTERNAL", "Internal server error")
		return
	}

	result := make([]whatsappTemplateJSON, 0, len(items))
	for _, t := range items {
		result = append(result, toWhatsAppTemplateJSON(t))
	}
	writeJSON(w, http.StatusOK, response{Success: true, Data: result})
}

func (s *Server) getPublicWhatsAppTemplate(w http.ResponseWriter, r *http.Request) {
	name := r.PathValue("name")
	if name == "" {
		writeError(w, http.StatusBadRequest, "ERR_BAD_REQUEST", "Template name is required")
		return
	}

	t, err := s.store.GetPublicWhatsAppTemplateByName(r.Context(), name)
	if err != nil {
		if errors.Is(err, store.ErrWhatsAppTemplateNotFound) {
			writeError(w, http.StatusNotFound, "ERR_NOT_FOUND", "WhatsApp template not found")
			return
		}
		s.logger.Error("get public whatsapp template failed", "name", name, "error", err)
		writeError(w, http.StatusInternalServerError, "ERR_INTERNAL", "Internal server error")
		return
	}

	writeJSON(w, http.StatusOK, response{Success: true, Data: toWhatsAppTemplateJSON(t)})
}

func (s *Server) listAdminWhatsAppTemplates(w http.ResponseWriter, r *http.Request) {
	items, err := s.store.ListAdminWhatsAppTemplates(r.Context())
	if err != nil {
		s.logger.Error("list admin whatsapp templates failed", "error", err)
		writeError(w, http.StatusInternalServerError, "ERR_INTERNAL", "Internal server error")
		return
	}

	result := make([]whatsappTemplateJSON, 0, len(items))
	for _, t := range items {
		result = append(result, toWhatsAppTemplateJSON(t))
	}
	writeJSON(w, http.StatusOK, response{Success: true, Data: result})
}

func (s *Server) getAdminWhatsAppTemplate(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if id == "" {
		writeError(w, http.StatusBadRequest, "ERR_BAD_REQUEST", "ID is required")
		return
	}

	t, err := s.store.GetWhatsAppTemplateByID(r.Context(), id)
	if err != nil {
		if errors.Is(err, store.ErrWhatsAppTemplateNotFound) {
			writeError(w, http.StatusNotFound, "ERR_NOT_FOUND", "WhatsApp template not found")
			return
		}
		s.logger.Error("get admin whatsapp template failed", "id", id, "error", err)
		writeError(w, http.StatusInternalServerError, "ERR_INTERNAL", "Internal server error")
		return
	}

	writeJSON(w, http.StatusOK, response{Success: true, Data: toWhatsAppTemplateJSON(t)})
}

func (s *Server) createWhatsAppTemplate(w http.ResponseWriter, r *http.Request) {
	r.Body = http.MaxBytesReader(w, r.Body, 64<<10)
	var input whatsappTemplateInput
	if err := decodeJSON(r, &input); err != nil {
		writeError(w, http.StatusBadRequest, "ERR_BAD_REQUEST", "Invalid request body")
		return
	}

	if errs := validateWhatsAppTemplateInput(&input); len(errs) > 0 {
		writeJSON(w, http.StatusUnprocessableEntity, response{
			Success:   false,
			ErrorCode: "ERR_VALIDATION",
			Message:   "Validation failed",
			Errors:    errs,
		})
		return
	}

	t := store.WhatsAppTemplate{
		TemplateName:   input.TemplateName,
		Category:       input.Category,
		MessagePattern: input.MessagePattern,
		IsDefault:      input.IsDefault,
		IsActive:       input.IsActive,
	}

	if err := s.store.CreateWhatsAppTemplate(r.Context(), &t); err != nil {
		if errors.Is(err, store.ErrTemplateNameConflict) {
			writeJSON(w, http.StatusConflict, response{
				Success:   false,
				ErrorCode: "ERR_CONFLICT",
				Message:   "Template name already exists",
			})
			return
		}
		s.logger.Error("create whatsapp template failed", "error", err)
		writeError(w, http.StatusInternalServerError, "ERR_INTERNAL", "Internal server error")
		return
	}

	t.CreatedAt = time.Now()
	writeJSON(w, http.StatusCreated, response{Success: true, Data: toWhatsAppTemplateJSON(t), Message: "WhatsApp template created"})
}

func (s *Server) updateWhatsAppTemplate(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if id == "" {
		writeError(w, http.StatusBadRequest, "ERR_BAD_REQUEST", "ID is required")
		return
	}

	r.Body = http.MaxBytesReader(w, r.Body, 64<<10)
	var input whatsappTemplateInput
	if err := decodeJSON(r, &input); err != nil {
		writeError(w, http.StatusBadRequest, "ERR_BAD_REQUEST", "Invalid request body")
		return
	}

	if errs := validateWhatsAppTemplateInput(&input); len(errs) > 0 {
		writeJSON(w, http.StatusUnprocessableEntity, response{
			Success:   false,
			ErrorCode: "ERR_VALIDATION",
			Message:   "Validation failed",
			Errors:    errs,
		})
		return
	}

	t := store.WhatsAppTemplate{
		ID:             id,
		TemplateName:   input.TemplateName,
		Category:       input.Category,
		MessagePattern: input.MessagePattern,
		IsDefault:      input.IsDefault,
		IsActive:       input.IsActive,
	}

	if err := s.store.UpdateWhatsAppTemplate(r.Context(), &t); err != nil {
		if errors.Is(err, store.ErrTemplateNameConflict) {
			writeJSON(w, http.StatusConflict, response{
				Success:   false,
				ErrorCode: "ERR_CONFLICT",
				Message:   "Template name already exists",
			})
			return
		}
		if errors.Is(err, store.ErrWhatsAppTemplateNotFound) {
			writeError(w, http.StatusNotFound, "ERR_NOT_FOUND", "WhatsApp template not found")
			return
		}
		s.logger.Error("update whatsapp template failed", "id", id, "error", err)
		writeError(w, http.StatusInternalServerError, "ERR_INTERNAL", "Internal server error")
		return
	}

	writeJSON(w, http.StatusOK, response{Success: true, Data: toWhatsAppTemplateJSON(t), Message: "WhatsApp template updated"})
}

func (s *Server) deleteWhatsAppTemplate(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if id == "" {
		writeError(w, http.StatusBadRequest, "ERR_BAD_REQUEST", "ID is required")
		return
	}

	if err := s.store.DeleteWhatsAppTemplate(r.Context(), id); err != nil {
		if errors.Is(err, store.ErrWhatsAppTemplateNotFound) {
			writeError(w, http.StatusNotFound, "ERR_NOT_FOUND", "WhatsApp template not found")
			return
		}
		s.logger.Error("delete whatsapp template failed", "id", id, "error", err)
		writeError(w, http.StatusInternalServerError, "ERR_INTERNAL", "Internal server error")
		return
	}

	writeJSON(w, http.StatusOK, response{Success: true, Message: "WhatsApp template deleted"})
}
