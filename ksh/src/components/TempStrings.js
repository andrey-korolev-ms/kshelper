import { useState, useRef } from "react";

function TodoItem({ text }) {
  const [hidden, setHidden] = useState(false);
  const timerRef = useRef(null);

  const handleCheckboxChange = (e) => {
    const isChecked = e.target.checked;

    if (isChecked) {
      // Запускаем таймер на 1 секунду
      timerRef.current = setTimeout(() => {
        setHidden(true);
      }, 1000);
    } else {
      // Если чекбокс сняли — отменяем таймер
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  return (
    <div
      style={{
        opacity: hidden ? 0 : 1,
        transition: "opacity 0.3s ease", // плавное исчезновение
        marginBottom: "8px",
      }}
    >
      <label>
        <input type="checkbox" onChange={handleCheckboxChange} />
        Какой-то текст{text}
      </label>
    </div>
  );
}
export default TodoItem;
