import React, { useState, useEffect } from "react";
import axios from "axios";

const HumanForm = ({ onResponse }) => {
  const [human, setHuman] = useState({
    sex: "male",
    age: 56,
    ipk: 35,
    is_invalid: false,
    invalid_group: "",
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
        const response = await axios.post(
          "http://192.168.0.54:8080/api",
          human,
        );
        onResponse(response.data);
      } catch (err) {
        console.error(err);
        onResponse({ error: "Ошибка отправки" });
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(sendData, 500);
    return () => clearTimeout(timeoutId);
  }, [human, onResponse]);

  return (
    <form className="container">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr 1fr 1fr",
          gap: "8px",
        }}
      >
        <div className="form-check form-check-inline">
          <label className="form-check-label">
            <input
              className="form-check-input"
              type="radio"
              name="sex"
              value="male"
              checked={human.sex === "male"}
              onChange={handleChange}
            />
            Мужской
          </label>
        </div>

        <div className="form-check form-check-inline">
          <label className="form-check-label">
            <input
              className="form-check-input"
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
          <label className="form-label">Возраст:</label>
          <input
            type="number"
            name="age"
            className="form-control"
            value={human.age}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="form-label">ИПК:</label>
          <input
            type="number"
            step="0.01"
            name="ipk"
            className="form-control"
            value={human.ipk}
            onChange={handleChange}
          />
        </div>

        <div>
          <input
            className="form-check-input"
            type="checkbox"
            name="is_invalid"
            checked={human.is_invalid}
            onChange={handleChange}
          />
          <label className="form-check-label">Инвалидность</label>
        </div>

        {human.is_invalid && (
          <div
            className="mb-3"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "4px",
            }}
          >
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="invalid_group"
                value="I"
                checked={human.invalid_group === "I"}
                onChange={handleChange}
              />
              <label className="form-check-label">I гр.</label>
            </div>

            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="invalid_group"
                value="II"
                checked={human.invalid_group === "II"}
                onChange={handleChange}
              />
              <label className="form-check-label">II гр.</label>
            </div>

            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="invalid_group"
                value="III"
                checked={human.invalid_group === "III"}
                onChange={handleChange}
              />
              <label className="form-check-label">III гр.</label>
            </div>
          </div>
        )}

        {loading && <p style={{ gridColumn: "span 5" }}>Отправка...</p>}
      </div>
    </form>
  );
};

export default HumanForm;
