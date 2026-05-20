import { useState, useEffect, useCallback } from "react";
import "./App.css";
import HumanForm from "./components/HumanForm";
import CheckServe from "./components/CheckServe";
import TempStrings from "./components/TempStrings";
import App3 from "./ts/exp.tsx";
import axios from "axios";

const EXPLANATIONS_API = "http://192.168.0.54:8080/api/explain";
const ALL_EXPLANATIONS_API = "http://192.168.0.54:8080/api/explanations";

function App() {
  const [serverResponse, setServerResponse] = useState(null);
  const [currentContent, setCurrentContent] = useState(null);
  const [explanationsCache, setExplanationsCache] = useState({});

  // Загружаем все пояснения при загрузке
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await axios.get(ALL_EXPLANATIONS_API);
        const explanations = response.data.explanations;
        // Преобразуем в объект для быстрого доступа
        const cache = {};
        Object.keys(explanations).forEach((key) => {
          cache[key] = explanations[key];
        });
        setExplanationsCache(cache);
      } catch (error) {
        console.error("Ошибка загрузки пояснений:", error);
      }
    };
    loadData();
  }, []);

  // Кастомный хук для получения пояснения по ключу
  const fetchExplanation = useCallback(
    async (key) => {
      if (!key) return null;
      if (explanationsCache[key]) {
        // Кэш должен содержать строку
        const cached = explanationsCache[key];
        if (typeof cached === "string") {
          return cached;
        }
        // Если в кэше объект, извлекаем строку
        return convertToExplanationString(cached);
      }

      try {
        const response = await axios.post(EXPLANATIONS_API, { key });
        const data = response.data;

        // Преобразуем данные в строку для отображения
        let explanationText = typeof data === "string" ? data : "";

        if (typeof data === "object" && data !== null) {
          // Если это объект, извлекаем текст из полей
          if (data.content) {
            explanationText = data.content;
          } else if (data.title) {
            explanationText = data.title;
          } else if (data.explanation) {
            explanationText = data.explanation;
          } else if (data.text) {
            explanationText = data.text;
          } else if (data.body) {
            explanationText = data.body;
          } else if (data.description) {
            explanationText = data.description;
          } else {
            // Если нет известных полей, используем JSON.stringify
            explanationText = JSON.stringify(data, null, 2);
          }
        }

        // Убеждаемся, что это строка
        if (typeof explanationText !== "string") {
          explanationText = String(explanationText);
        }

        setExplanationsCache((prev) => ({
          ...prev,
          [key]: explanationText,
        }));
        return explanationText;
      } catch (error) {
        console.error(`Ошибка получения пояснения для "${key}":`, error);
        return null;
      }
    },
    [explanationsCache],
  );

  // Вспомогательная функция для преобразования объекта в строку
  const convertToExplanationString = (obj) => {
    // Пытаемся извлечь текст из известных полей
    const fields = [
      "content",
      "title",
      "explanation",
      "text",
      "body",
      "description",
    ];
    for (const field of fields) {
      if (obj[field] !== undefined && typeof obj[field] === "string") {
        return obj[field];
      }
    }
    // Если ничего не нашли, возвращаем JSON.stringify
    return JSON.stringify(obj, null, 2);
  };

  // Обработчик клика на пояснение
  const handleExplanationClick = useCallback(
    async (key) => {
      const explanation = await fetchExplanation(key);
      if (explanation) {
        setCurrentContent(explanation);
      } else {
        console.warn(`Пояснение не найдено для ключа: ${key}`);
      }
    },
    [fetchExplanation],
  );
  return (
    <div className="App">
      <div className="area area1">
        <HumanForm onResponse={setServerResponse} />
      </div>
      <div className="area area2">
        <h3>Ответ от сервера:</h3>
        {serverResponse ? (
          <pre
            onClick={(e) => {
              e.stopPropagation();
              const text = e.currentTarget.innerText;
              const trimmedKey = text.trim();
              handleExplanationClick(trimmedKey);
            }}
            style={{ cursor: "pointer" }}
          >
            {JSON.stringify(serverResponse, null, 2)
              .split("\n")
              .map((line, i) => {
                const renderClickableLink = (textToHighlight, key) => (
                  <span
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExplanationClick(key);
                    }}
                    style={{ color: "#e83e8c", cursor: "pointer" }}
                  >
                    {textToHighlight}
                  </span>
                );

                if (line.includes("Проверить право на СПН")) {
                  return renderClickableLink(line, "Проверить право на СПН");
                }
                if (
                  line.includes("Проверить право на ТСР") &&
                  line.includes("I гр.")
                ) {
                  return renderClickableLink(line, "Проверить право на ТСР");
                }
                if (line.includes("FZ400")) {
                  return renderClickableLink(line, "FZ400");
                }
                if (
                  line.includes("Социальная пенсия") ||
                  line.includes("через")
                ) {
                  return renderClickableLink(line, "Социальная пенсия");
                }
                if (line.includes("ИПК")) {
                  return renderClickableLink(line, "ИПК");
                }
                if (line.includes("Документы") && line.includes("document")) {
                  return renderClickableLink(line, "Документы");
                }
                if (line.includes("Законодательство") || line.includes("ФЗ")) {
                  return renderClickableLink(line, "Законодательство");
                }
                return (
                  <span key={i} style={{ color: "#212529" }}>
                    {line}
                  </span>
                );
              })}
          </pre>
        ) : (
          <p>Пока нет ответа. Измените поля формы.</p>
        )}
      </div>
      <div className="area area3">
        <CheckServe />
      </div>
      <div className="area area4">
        <TempStrings />
        <App3 />
      </div>
      <div className="area area5">
        <h3 style={{ marginBottom: "8px" }}>Дополнительная информация:</h3>
        {currentContent !== null && currentContent !== undefined ? (
          <div
            style={{
              padding: "16px",
              background: "#f8f9fa",
              borderRadius: "8px",
              border: "1px solid #dee2e6",
            }}
          >
            <div
              style={{
                marginBottom: "8px",
                fontWeight: "bold",
                fontSize: "14px",
                color: "#495057",
              }}
            >
              {typeof currentContent === "string"
                ? currentContent.split("\n")[0]
                : currentContent.title ||
                  currentContent.content ||
                  currentContent.explanation ||
                  currentContent.body ||
                  currentContent.text ||
                  currentContent}
            </div>
            <div style={{ whiteSpace: "pre-wrap", lineHeight: "1.6" }}>
              {typeof currentContent === "string"
                ? currentContent.split("\n").slice(1).join("\n")
                : currentContent.content ||
                  currentContent.explanation ||
                  currentContent.body ||
                  currentContent.text ||
                  currentContent.description ||
                  ""}
            </div>
          </div>
        ) : (
          <p style={{ color: "#6c757d" }}>
            Нажмите на выделенный текст в разделе ответа сервера.
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
