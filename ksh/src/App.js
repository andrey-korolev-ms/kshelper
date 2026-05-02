import "./App.css";
import HumanForm from "./components/HumanForm"; // если компонент называется HumanForm, иначе Button

function App() {
  return (
    <div className="App">
      <div className="area area1">
        <HumanForm />
      </div>
      <div className="area area2">
        <h3>Область 2</h3>
        <p>Здесь может быть что-то ещё (например, график или список).</p>
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
