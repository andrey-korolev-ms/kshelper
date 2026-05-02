import { useState } from "react";
import "./App.css";
import HumanForm from "./components/HumanForm";

function App() {
  const [serverResponse, setServerResponse] = useState(null);

  return (
    <div className="App">
      <div className="area area1">
        <HumanForm onResponse={setServerResponse} />
      </div>
      <div className="area area2">
        <h3>Ответ от сервера:</h3>
        {serverResponse ? (
          <pre>{JSON.stringify(serverResponse, null, 2)}</pre>
        ) : (
          <p>Пока нет ответа. Измените поля формы.</p>
        )}
      </div>
      <div className="area area3">
        <h3>Область 3</h3>
        <p>Дополнительная информация.</p>
      </div>
      <div className="area area4">
        <h3>Область 4</h3>
        <p>Логи, уведомления и т.д.</p>
      </div>
    </div>
  );
}

export default App;
