import React, { useState } from "react";
import axios from "axios";

const HumanForm = () => {
  const [human, setHuman] = useState({
    sex: "male",
    age: 56,
    ipk: 35,
    is_invalid: false,
  });
  const [responseData, setResponseData] = useState(null);
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

    setHuman({
      ...human,
      [name]: newValue,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8080/api", human);
      setResponseData(response.data);
    } catch (error) {
      console.error(error);
      setResponseData({ error: "Ошибка отправки" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {/* радиокнопки пола */}
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

        <button type="submit" disabled={loading}>
          {loading ? "Отправка..." : "Отправить"}
        </button>
      </form>

      <div
        style={{ marginTop: "20px", border: "1px solid #ccc", padding: "10px" }}
      >
        <h3>Ответ от сервера:</h3>
        {responseData ? (
          <pre>{JSON.stringify(responseData, null, 2)}</pre>
        ) : (
          <p>Пока нет ответа. Отправьте форму.</p>
        )}
      </div>
    </div>
  );
};

export default HumanForm;
