package api

import (
	"bytes"
	"context"
	"crypto/rand"
	"encoding/hex"
	"errors"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"strings"
	"time"
)

var errStorageUnavailable = errors.New("media storage is not configured")

type MediaStorage struct {
	SupabaseURL string
	ServiceKey  string
	Bucket      string
}

func (s *Server) uploadMedia(w http.ResponseWriter, r *http.Request) {
	if s.media == nil || s.media.SupabaseURL == "" || s.media.ServiceKey == "" || s.media.Bucket == "" {
		writeError(w, http.StatusServiceUnavailable, "ERR_STORAGE_UNAVAILABLE", "Media storage is not configured")
		return
	}

	r.Body = http.MaxBytesReader(w, r.Body, 5<<20)
	if err := r.ParseMultipartForm(5 << 20); err != nil {
		writeError(w, http.StatusBadRequest, "ERR_BAD_REQUEST", "Invalid upload")
		return
	}

	kind := r.FormValue("kind")
	if kind != "products" && kind != "testimonials" {
		writeError(w, http.StatusUnprocessableEntity, "ERR_VALIDATION", "Invalid media kind")
		return
	}

	file, header, err := r.FormFile("file")
	if err != nil {
		writeError(w, http.StatusBadRequest, "ERR_BAD_REQUEST", "File is required")
		return
	}
	defer file.Close()

	publicURL, err := s.media.Upload(r.Context(), kind, file, header)
	if err != nil {
		if errors.Is(err, errStorageUnavailable) {
			writeError(w, http.StatusServiceUnavailable, "ERR_STORAGE_UNAVAILABLE", "Media storage is not configured")
			return
		}
		writeError(w, http.StatusUnprocessableEntity, "ERR_UPLOAD", "File upload failed")
		return
	}

	writeJSON(w, http.StatusCreated, response{Success: true, Data: map[string]string{"url": publicURL}})
}

func (m MediaStorage) Upload(ctx context.Context, kind string, file multipart.File, header *multipart.FileHeader) (string, error) {
	if header.Size <= 0 || header.Size > 4<<20 {
		return "", fmt.Errorf("file size must be 1 byte to 4MB")
	}

	data, err := io.ReadAll(io.LimitReader(file, 4<<20+1))
	if err != nil {
		return "", err
	}
	if len(data) > 4<<20 {
		return "", fmt.Errorf("file too large")
	}

	contentType := http.DetectContentType(data[:min(len(data), 512)])
	ext, ok := map[string]string{
		"image/jpeg": ".jpg",
		"image/png":  ".png",
		"image/webp": ".webp",
		"image/gif":  ".gif",
	}[contentType]
	if !ok {
		return "", fmt.Errorf("unsupported media type")
	}

	name := randomName() + ext
	objectName := kind + "/" + time.Now().UTC().Format("20060102") + "-" + name
	baseURL := strings.TrimRight(m.SupabaseURL, "/")
	putURL := baseURL + "/storage/v1/object/" + strings.Trim(m.Bucket, "/") + "/" + objectName

	req, err := http.NewRequestWithContext(ctx, http.MethodPut, putURL, bytes.NewReader(data))
	if err != nil {
		return "", err
	}
	req.Header.Set("Authorization", "Bearer "+m.ServiceKey)
	req.Header.Set("apikey", m.ServiceKey)
	req.Header.Set("Content-Type", contentType)
	req.Header.Set("x-upsert", "false")

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return "", err
	}
	defer res.Body.Close()
	if res.StatusCode < 200 || res.StatusCode >= 300 {
		return "", fmt.Errorf("storage returned %s", res.Status)
	}

	return baseURL + "/storage/v1/object/public/" + strings.Trim(m.Bucket, "/") + "/" + objectName, nil
}

func randomName() string {
	var b [8]byte
	if _, err := rand.Read(b[:]); err != nil {
		return fmt.Sprintf("%d", time.Now().UnixNano())
	}
	return hex.EncodeToString(b[:])
}
