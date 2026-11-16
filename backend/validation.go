package main

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"unicode/utf8"
)

// normalizedText trims only the edges; internal spacing and line breaks survive.
func normalizedText(value string, minLength, maxLength int) (string, bool) {
	value = strings.TrimSpace(value)
	length := utf8.RuneCountInString(value)
	return value, length >= minLength && length <= maxLength
}

// validateJSONBody rejects trailing JSON and null before the generated decoder.
func validateJSONBody(c *gin.Context) {
	if c.Request.Method != http.MethodPost || !strings.HasPrefix(c.Request.URL.Path, "/api/") {
		return
	}
	body, err := io.ReadAll(c.Request.Body)
	trimmed := bytes.TrimSpace(body)
	if err != nil || len(trimmed) == 0 || trimmed[0] != '{' || !json.Valid(trimmed) {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"code": "invalid_request", "message": "Не удалось разобрать запрос"})
		return
	}
	c.Request.Body = io.NopCloser(bytes.NewReader(body))
}
