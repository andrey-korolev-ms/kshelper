import React, { useState, useRef, useEffect } from "react";

const CheckServe = () => {
  const [completed, setCompleted] = useState({});
  const timersRef = useRef({});

  // Массив задач
  const tasks = [
    { name: "greeting", label: "Приветствие" },
    { name: "contactIO", label: "Обращение ИО" },
    { name: "docCheck", label: "Проверка документов" },
    { name: "consultation", label: "Консультация" },
    { name: "socialNet", label: "Социальные сети" },
    { name: "offerEval", label: "Предложение оценки" },
    { name: "digitalZone", label: "Цифровая зона" },
    { name: "checkScaner", label: "Проверка сканера" },
    { name: "thankYou", label: "Поблагодарить за посещение" },
  ];

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;

    if (checked) {
      // Запускаем таймер на 1 секунду
      timersRef.current[name] = setTimeout(() => {
        setCompleted((prev) => ({ ...prev, [name]: true }));
      }, 2000);
    } else {
      // Снимаем галочку — отменяем таймер
      if (timersRef.current[name]) {
        clearTimeout(timersRef.current[name]);
        setCompleted((prev) => ({ ...prev, [name]: false }));
      }
    }
  };

  // При загрузке очищаем таймеры
  useEffect(() => {
    return () => {
      const activeTimers = Object.values(timersRef.current);
      activeTimers.forEach((timer) => clearTimeout(timer));
      timersRef.current = {};
    };
  }, []);

  return (
    <div>
      <h3>Самопроверка</h3>
      <div
        className="mb-3"
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}
      >
        {tasks.map((task) => {
          const isCompleted = completed[task.name];

          return (
            <div
              style={{
                padding: "8px",
                background: isCompleted ? "#f5f5f5" : "#fff",
                borderRadius: "4px",
                marginBottom: "8px",
              }}
            >
              <label
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <input
                  className="form-check-input"
                  type="checkbox"
                  name={task.name}
                  onChange={handleCheckboxChange}
                  disabled={isCompleted}
                />
                <span style={{ color: isCompleted ? "#999" : "#000" }}>
                  {task.label}
                </span>
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CheckServe;
