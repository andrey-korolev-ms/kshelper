import React, { useState, useEffect } from "react";
import axios from "axios";

const HumanForm = () => {
  const [human, setHuman] = useState({
    sex: "male",
    age: 55,
    ipk: 35,
    is_invalid: false,
  });
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Обработчик изменения полей
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === "checkbox" ? checked : value;

    if (name === "age") {
      newValue = parseInt(value, 10);
      if (isNaN(newValue)) newValue = 0;
    }
    if (name === "ipk") {
      newValue = parseFloat(value);
      if (isNaN(newValue)) newValue = 0.0;
    }

    setHuman((prev) => ({ ...prev, [name]: newValue }));
  };

  // Отправка данных при любом изменении human
  useEffect(() => {
    const sendData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.post("http://localhost:8080/api", human);
        setResponseData(response.data);
      } catch (err) {
        console.error(err);
        setError("Ошибка отправки");
        setResponseData(null);
      } finally {
        setLoading(false);
      }
    };

    // Дебаунс: ждём 500 мс после последнего изменения перед отправкой
    const timeoutId = setTimeout(sendData, 1000);
    return () => clearTimeout(timeoutId);
  }, [human]); // срабатывает при каждом изменении human

  return (
    <div>
      <form>
        {/* Радиокнопки пола */}
        <div>
          <label>Пол:</label>
          <label>
            <input
              type="radio"
              name="sex"
              value="male"
              checked={human.sex === "male"}
              onChange={handleChange}
            />
            Мужской
          </label>
          <label>
            <input
              type="radio"
              name="sex"
              value="female"
              checked={human.sex === "female"}
              onChange={handleChange}
            />
            Женский
          </label>
        </div>

        <div>
          <label>Возраст:</label>
          <input
            type="number"
            name="age"
            value={human.age}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>ИПК:</label>
          <input
            type="number"
            step="0.01"
            name="ipk"
            value={human.ipk}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              name="is_invalid"
              checked={human.is_invalid}
              onChange={handleChange}
            />
            Инвалидность
          </label>
        </div>
      </form>

      <div
        style={{ marginTop: "20px", border: "1px solid #ccc", padding: "10px" }}
      >
        <h3>Ответ от сервера (обновляется автоматически):</h3>
        {loading && <p>Загрузка...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {!loading && !error && responseData && (
          <pre>{JSON.stringify(responseData, null, 2)}</pre>
        )}
        {!loading && !error && !responseData && (
          <p>Изменяйте поля – ответ появится автоматически.</p>
        )}
      </div>
    </div>
  );
};

export default HumanForm;
