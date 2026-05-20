import React, { useState } from "react";

const App3: React.FC = () => {
  const [count, setCount] = useState<number>(0);
  const handleClick = () => {
    setCount(count + 1);
  };

  return <button onClick={handleClick}>Нажми меня!{count}</button>;
};

export default App3;
