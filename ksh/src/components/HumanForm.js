import React, { useState, useEffect } from "react";
import axios from "axios";

const HumanForm = ({ onResponse }) => {
  // получаем колбэк
  const [human, setHuman] = useState({
    sex: "male",
    age: 20,
    ipk: 3.5,
    is_invalid: false,
  });
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    const sendData = async () => {
      setLoading(true);
      try {
        const response = await axios.post("http://localhost:8080/api", human);
        onResponse(response.data); // отправляем ответ наверх
      } catch (err) {
        console.error(err);
        onResponse({ error: "Ошибка отправки" });
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(sendData, 500);
    return () => clearTimeout(timeoutId);
  }, [human, onResponse]); // добавляем onResponse в зависимости

  return (
    <form>
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
      {loading && <p>Отправка...</p>}
    </form>
  );
};

export default HumanForm;
