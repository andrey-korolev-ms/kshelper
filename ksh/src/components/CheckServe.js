import React from "react";

const CheckServe = () => {
  return (
    <div className="checkserve">
      <h3>Самопроверка</h3>
      <div className="block">
        <label>
          <input type="checkbox" name="greeting" />
          Приветствие
        </label>
        <br />
        <label>
          <input type="checkbox" name="contactIO" />
          Обращение ИО
        </label>
        <br />
        <label>
          <input type="checkbox" name="docCheck" />
          Проверка документов
        </label>
        <br />
        <label>
          <input type="checkbox" name="consultation" />
          Консультация
        </label>
        <br />
        <label>
          <input type="checkbox" name="socialNet" />
          Социальные сети
        </label>
        <br />
        <label>
          <input type="checkbox" name="offerEval" />
          Предложение оценки
        </label>
        <br />
      </div>
      <div className="block">
        <label>
          <input type="checkbox" name="digitalZone" />
          Цифровая зона
        </label>
        <br />
        <label>
          <input type="checkbox" name="thankYou" />
          Поблагодарить за посещение
        </label>
        <br />
      </div>
    </div>
  );
};

export default CheckServe;
