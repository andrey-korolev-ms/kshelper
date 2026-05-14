import { useState } from "react";
import "./App.css";
import HumanForm from "./components/HumanForm";
import CheckServe from "./components/CheckServe";
import TempStrings from "./components/TempStrings";

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
        <CheckServe />
      </div>
      <div className="area area4">
        <TempStrings />
      </div>
    </div>
  );
}

export default App;
