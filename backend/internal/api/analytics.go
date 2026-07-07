package api

import (
	"net/http"
	"strconv"
	"strings"

	"github.com/catursetyo/una-project/backend/internal/store"
)

type analyticsEventInput struct {
	EventType   string  `json:"event_type"`
	ProductSlug *string `json:"product_slug"`
	SourcePath  *string `json:"source_path"`
}

func (s *Server) trackAnalyticsEvent(w http.ResponseWriter, r *http.Request) {
	r.Body = http.MaxBytesReader(w, r.Body, 8<<10)
	var input analyticsEventInput
	if err := decodeJSON(r, &input); err != nil {
		writeError(w, http.StatusBadRequest, "ERR_BAD_REQUEST", "Invalid request body")
		return
	}
	input.EventType = strings.TrimSpace(input.EventType)
	if input.EventType != "website_view" && input.EventType != "product_view" && input.EventType != "whatsapp_cta_click" {
		writeError(w, http.StatusUnprocessableEntity, "ERR_VALIDATION", "Invalid event type")
		return
	}

	event := store.AnalyticsEvent{
		EventType:   input.EventType,
		ProductSlug: cleanOptional(input.ProductSlug, 150),
		SourcePath:  cleanOptional(input.SourcePath, 255),
		Referrer:    cleanString(r.Header.Get("Referer"), 500),
		UserAgent:   cleanString(r.UserAgent(), 500),
	}
	if err := s.store.TrackAnalyticsEvent(r.Context(), event); err != nil {
		s.logger.Error("track analytics event failed", "error", err)
		writeError(w, http.StatusInternalServerError, "ERR_INTERNAL", "Internal server error")
		return
	}
	writeJSON(w, http.StatusCreated, response{Success: true})
}

func (s *Server) getAnalyticsSummary(w http.ResponseWriter, r *http.Request) {
	days, _ := strconv.Atoi(r.URL.Query().Get("days"))
	summary, err := s.store.AnalyticsSummary(r.Context(), days)
	if err != nil {
		s.logger.Error("analytics summary failed", "error", err)
		writeError(w, http.StatusInternalServerError, "ERR_INTERNAL", "Internal server error")
		return
	}
	writeJSON(w, http.StatusOK, response{Success: true, Data: summary})
}

func cleanOptional(value *string, max int) *string {
	if value == nil {
		return nil
	}
	return cleanString(*value, max)
}

func cleanString(value string, max int) *string {
	value = strings.TrimSpace(value)
	if value == "" {
		return nil
	}
	if len(value) > max {
		value = value[:max]
	}
	return &value
}
