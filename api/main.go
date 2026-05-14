package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

type Human struct {
	Sex          string  `json:"sex"`
	Age          int     `json:"age"`
	IPK          float64 `json:"ipk"`
	IsInvalid    bool    `json:"is_invalid"`
	InvalidGroup string  `json:"invalid_group"`
}

type Doc struct {
	Document string `json:"document"`
}

type Pens interface {
	Check(h *Human, d *Doc) string
}

type FZ400 struct{}

func (f *FZ400) Check(h *Human, d *Doc) string {
	switch h.Sex {
	case "male":
		if h.Age > 65 && h.IPK > 30 && !h.IsInvalid {
			return fmt.Sprintf("Проверить право на СПН: Гражданину уже %d лет. Величина ИПК: %f \\n Требуются документы %s \n", h.Age, h.IPK, d.Document)
		} else if h.IsInvalid {
			return fmt.Sprintf("FZ400: Проверить право на ТСР: Гражданин %s, возраст %d лет \n", h.Sex, h.Age)
		} else if h.InvalidGroup == "I" {
			return fmt.Sprintf("FZ400: Выбрана группа инвалидности I %s, %d", h.Sex, h.Age)
		} else {
			return fmt.Sprintf("FZ400: %s, %d", h.Sex, h.Age)
		}
	case "female":
		if h.Age > 60 && h.IPK > 30 && !h.IsInvalid {
			return fmt.Sprintf("Проверить право на СПН: Гражданин уже %d лет. Величина ИПК: %f \\n Требуются документы %s \n", h.Age, h.IPK, d.Document)
		} else if h.IsInvalid {
			return fmt.Sprintf("FZ400: Проверить право на ТСР: Гражданин %s, возраст %d лет \n", h.Sex, h.Age)
		} else if h.InvalidGroup == "II" {
			return fmt.Sprintf("FZ400: Выбрана группа инвалидности II %s, %d", h.Sex, h.Age)
		} else {
			return fmt.Sprintf("FZ400: %s, %d", h.Sex, h.Age)
		}
	}
	return fmt.Sprintf("FZ400: %s, %d", h.Sex, h.Age)
}

type FZ166 struct{}

func (f *FZ166) Check(h *Human, d *Doc) string {
	switch h.Sex {
	case "male":
		if h.Age > 55 {
			return fmt.Sprintf("Гражданину уже %d лет. Через %d лет можно получить социальную пенсию", h.Age, 70-h.Age)
		} else {
			return fmt.Sprintf("FZ166: %s, %d", h.Sex, h.Age)
		}
	case "female":
		if h.Age > 55 {
			return fmt.Sprintf("FZ166: %s, %d", h.Sex, h.Age)
		} else {
			return fmt.Sprintf("FZ166: %s, %d", h.Sex, h.Age)
		}
	}
	return fmt.Sprintf("FZ166: %s, %d", h.Sex, h.Age)
}
func enableCORS(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
}
func apiHandler(w http.ResponseWriter, r *http.Request) {
	enableCORS(w) // устанавливаем заголовки

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK) // просто OK для preflight
		return
	}

	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	var h Human
	if err := json.NewDecoder(r.Body).Decode(&h); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	d := &Doc{Document: "document"}
	f400 := &FZ400{}
	f166 := &FZ166{}

	//result := fmt.Sprintf("FZ400:\nFZ166:\n%s, %s\n%s, %s", f400.Check(&h, d), h.Sex, f166.Check(&h, d), h.Sex)
	//
	result := struct {
		FZ400 string `json:"fz400"`
		FZ166 string `json:"fz166"`
	}{
		FZ400: f400.Check(&h, d),
		FZ166: f166.Check(&h, d),
	}
	if err := json.NewEncoder(w).Encode(result); err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
	}
}

func main() {
	// f400 := &FZ400{}
	// f166 := &FZ166{}
	// h := &Human{Sex: "male", Age: 56, IPK: 31}
	// d := &Doc{Document: "document"}
	// fmt.Println(f400.Check(h, d))
	// fmt.Println(f166.Check(h, d))
	http.HandleFunc("/api", apiHandler)
	fmt.Println("Сервер запущен")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		fmt.Println("Ошибка запуска сервера:", err)
	}
}
