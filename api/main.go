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

// ExplanationRequest для получения пояснения
type ExplanationRequest struct {
	Key string `json:"key"`
}

// ExplanationResponse для ответа с пояснением
type ExplanationResponse struct {
	Title   string `json:"title"`
	Content string `json:"content"`
}

// GetAllExplanations для получения всех пояснений
type GetAllExplanationsResponse struct {
	Explanations map[string]ExplanationResponse `json:"explanations"`
}

type FZ400 struct{}

func (f *FZ400) Check(h *Human, d *Doc) string {
	switch h.Sex {
	case "male":
		if h.Age > 65 && h.IPK > 30 && !h.IsInvalid {
			return fmt.Sprintf("Проверить право на СПН: Гражданину уже %d лет. Величина ИПК: %f \\n Требуются документы %s \n", h.Age, h.IPK, d.Document)
		} else if h.IsInvalid && h.InvalidGroup == "I" {
			return fmt.Sprintf("FZ400: Проверить право на ТСР и СПН. I гр. инвалидности: Гражданин %s, возраст %d лет \n", h.Sex, h.Age)
		} else if h.IsInvalid && h.InvalidGroup == "II" {
			return fmt.Sprintf("FZ400: Выбрана группа инвалидности II %s, %d", h.Sex, h.Age)
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

// ExplanationDB для хранения пояснений в памяти
type ExplanationDB struct {
	SPN_Check_400 ExplanationResponse
	TRP_Check_400 ExplanationResponse
	FZ400_Info    ExplanationResponse
	SPN_Info      ExplanationResponse
	IPK_Info      ExplanationResponse
	Docs_Info     ExplanationResponse
	FZ166_Info    ExplanationResponse
	Age_Info      ExplanationResponse
}

// Инициализация ExplanationDB
var explanationDB = ExplanationDB{
	SPN_Check_400: ExplanationResponse{
		Title:   "Проверка права на СПН",
		Content: "Для получения социальной пенсии (ФЗ-400):\n  - Возраст: > 60 лет (жен) или > 65 лет (муж)\n  - ИПК > 30\n  - Не является инвалидом",
	},
	TRP_Check_400: ExplanationResponse{
		Title:   "Проверка права на ТСР",
		Content: "Для получения трудовой пенсии по старости (ФЗ-400):\n  - Является инвалидом\n  - Проверяется группа инвалидности\n  - Гражданам I группы инвалидности",
	},
	FZ400_Info: ExplanationResponse{
		Title:   "Законодательство ФЗ-400",
		Content: "Федеральный закон № 400-ФЗ\nО страховых пенсиях\nПрименяется для: соцпенсии, трудовой пенсии, досрочных выплат",
	},
	SPN_Info: ExplanationResponse{
		Title:   "Социальная пенсия",
		Content: "СПН (Социальная пенсия)\nФиксированная выплата\nДля граждан без достаточного страхового стажа",
	},
	IPK_Info: ExplanationResponse{
		Title:   "Индивидуальный пенсионный коэффициент",
		Content: "ИПК (Индивидуальный пенсионный коэффициент)\nСумма пенсионных баллов\nНеобходимый минимум для назначения пенсии",
	},
	Docs_Info: ExplanationResponse{
		Title:   "Документы для пенсии",
		Content: "Для оформления пенсии потребуются:\n  - Паспорт гражданина РФ\n  - СНИЛС\n  - Выписка из НПФ\n  - Документы об инвалидности",
	},
	FZ166_Info: ExplanationResponse{
		Title:   "Законодательство ФЗ-166",
		Content: "Федеральный закон № 166-ФЗ\nО государственном пенсионном обеспечении\nПрименяется для: соцпенсии, госпенсии",
	},
	Age_Info: ExplanationResponse{
		Title:   "Возраст",
		Content: "Возраст гражданина\nПенсионный возраст\nДосрочное назначение пенсии",
	},
}

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

// GetExplanation возвращает пояснение по ключу
var explanationMap = map[string]*ExplanationResponse{
	"Проверить право на СПН": &explanationDB.SPN_Check_400,
	"Проверить право на ТСР": &explanationDB.TRP_Check_400,
	"I гр.":             &explanationDB.TRP_Check_400,
	"FZ400":             &explanationDB.FZ400_Info,
	"Социальная пенсия": &explanationDB.SPN_Info,
	"через":             &explanationDB.SPN_Info,
	"ИПК":               &explanationDB.IPK_Info,
	"Документы":         &explanationDB.Docs_Info,
	"document":          &explanationDB.Docs_Info,
	"Законодательство":  &explanationDB.FZ166_Info,
	"ФЗ":                &explanationDB.FZ166_Info,
	"лет":               &explanationDB.Age_Info,
}

func (edb *ExplanationDB) GetExplanation(key string) *ExplanationResponse {
	return explanationMap[key]
}

// GetAllExplanations возвращает все пояснения
func (edb *ExplanationDB) GetAllExplanations() map[string]ExplanationResponse {
	result := make(map[string]ExplanationResponse)
	for key, exp := range explanationMap {
		result[key] = *exp
	}
	return result
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

// Explain handler для получения пояснений
func explainHandler(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)

	if r.Method != http.MethodPost && r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req ExplanationRequest
	if r.Method == http.MethodPost {
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}
	} else {
		// Для GET запроса получаем ключ из URL query параметра
		key := r.URL.Query().Get("key")
		if key == "" {
			http.Error(w, "Missing key parameter", http.StatusBadRequest)
			return
		}
		req = ExplanationRequest{Key: key}
	}

	explanation := explanationDB.GetExplanation(req.Key)
	if explanation != nil {
		json.NewEncoder(w).Encode(explanation)
	} else {
		http.Error(w, "Explanation not found", http.StatusNotFound)
	}
}

// GetAllExplanations handler для получения всех пояснений
func getAllExplanationsHandler(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)

	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	explanations := explanationDB.GetAllExplanations()
	json.NewEncoder(w).Encode(GetAllExplanationsResponse{Explanations: explanations})
}

func main() {
	// f400 := &FZ400{}
	// f166 := &FZ166{}
	// h := &Human{Sex: "male", Age: 56, IPK: 31}
	// d := &Doc{Document: "document"}
	// fmt.Println(f400.Check(h, d))
	// fmt.Println(f166.Check(h, d))
	http.HandleFunc("/api", apiHandler)
	// Эндпоинт для получения пояснения
	http.HandleFunc("/api/explain", explainHandler)
	// Эндпоинт для получения всех пояснений
	http.HandleFunc("/api/explanations", getAllExplanationsHandler)
	fmt.Println("Сервер запущен")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		fmt.Println("Ошибка запуска сервера:", err)
	}
}
