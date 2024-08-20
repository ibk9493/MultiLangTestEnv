import React from "react";
import "./App.css";
import RentVsBuyCalculator from "./components/RentVsBuyCalculator";
import 'bootstrap/dist/css/bootstrap.min.css';
function App() {
  return (
    <div className="App">
      <h1>Rent vs Buy Calculator</h1>
      <RentVsBuyCalculator />
    </div>
  );
}

export default App;
