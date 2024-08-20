import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const RentVsBuyCalculator = () => {
  const [homePrice, setHomePrice] = useState(300000);
  const [mortgageRate, setMortgageRate] = useState(3.5);
  const [rent, setRent] = useState(1500);
  const [years, setYears] = useState(30);
  const [taxRate, setTaxRate] = useState(1.25);
  const [maintenanceRate, setMaintenanceRate] = useState(1);
  const [homeAppreciationRate, setHomeAppreciationRate] = useState(2); // Annual home value increase
  const [rentIncreaseRate, setRentIncreaseRate] = useState(2); // Annual rent increaseas
  const [tooltipVisible, setTooltipVisible] = useState(false);
const calculateBuyCost = () => {
  let homeValue = homePrice;
  let totalCost = 0;
  const monthlyMortgageRate = mortgageRate / 100 / 12;
  const numPayments = years * 12;
  const monthlyPayment = homePrice * monthlyMortgageRate / (1 - (1 + monthlyMortgageRate) ** -numPayments);
  
  for (let i = 0; i < years; i++) {
    totalCost += (monthlyPayment * 12); // Mortgage payments for the year
    totalCost += (homeValue * (taxRate / 100)); // Property taxes
    totalCost += (homeValue * (maintenanceRate / 100)); // Maintenance costs
    homeValue *= (1 + homeAppreciationRate / 100); // Home value appreciates each year
  }
  return totalCost;
};

const calculateRentCost = () => {
  let currentRent = rent;
  let totalRentCost = 0;
  for (let i = 0; i < years; i++) {
    totalRentCost += currentRent * 12;
    currentRent *= (1 + rentIncreaseRate / 100); // Rent increases each year
  }
  return totalRentCost;
};

  // Calculate the difference between renting and buying
  const calculateDifference = () => {
    return calculateBuyCost() - calculateRentCost();
  };

  const buyCost = calculateBuyCost();
  const rentCost = calculateRentCost();
  const difference = calculateDifference();

  // Data for chart
  const chartData = {
    labels: Array.from({ length: years }, (_, i) => `Year ${i + 1}`),
    datasets: [
      {
        label: "Cumulative Buying Cost",
        data: (function () {
          let data = [];
          let homeValue = homePrice;
          let cumulativeCost = 0;
          for (let i = 0; i < years; i++) {
            cumulativeCost +=
              monthlyPayment * 12 +
              homeValue * (taxRate / 100) +
              homeValue * (maintenanceRate / 100);
            data.push(cumulativeCost);
            homeValue *= 1 + homeAppreciationRate / 100;
          }
          return data;
        })(),
        borderColor: "rgba(75,192,192,1)",
        fill: false,
      },
      {
        label: "Cumulative Renting Cost",
        data: (function () {
          let data = [];
          let currentRent = rent;
          let cumulativeRent = 0;
          for (let i = 0; i < years; i++) {
            cumulativeRent += currentRent * 12;
            data.push(cumulativeRent);
            currentRent *= 1 + rentIncreaseRate / 100;
          }
          return data;
        })(),
        borderColor: "rgba(255,99,132,1)",
        fill: false,
      },
    ],
  };

  return (
    <div>
      <h2>Rent vs Buy Calculator</h2>
      <div>
        <label>
          Home Price:
          <input
            type="number"
            value={homePrice}
            onChange={(e) => setHomePrice(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Mortgage Rate (%):
          <input
            type="number"
            value={mortgageRate}
            step="0.01"
            onChange={(e) => setMortgageRate(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Rent per Month:
          <input
            type="number"
            value={rent}
            onChange={(e) => setRent(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Number of Years:
          <input
            type="number"
            value={years}
            onChange={(e) => setYears(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Property Tax Rate (%):
          <input
            type="number"
            value={taxRate}
            step="0.01"
            onChange={(e) => setTaxRate(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Maintenance Cost Rate (%):
          <input
            type="number"
            value={maintenanceRate}
            step="0.01"
            onChange={(e) => setMaintenanceRate(e.target.value)}
          />
        </label>
      </div>

      <h3>Results:</h3>
      <p>Total Buying Cost: ${buyCost.toFixed(2)}</p>
      <p>Total Renting Cost: ${rentCost.toFixed(2)}</p>
      <p>Difference (Buy - Rent): ${difference.toFixed(2)}</p>

      <div
        onMouseEnter={() => setTooltipVisible(true)}
        onMouseLeave={() => setTooltipVisible(false)}
      >
        <label>Home Appreciation Rate</label>
        {tooltipVisible && (
          <span className="tooltip">
            This is the expected annual increase in home value.
          </span>
        )}
        <Slider
          value={homeAppreciationRate}
          onChange={setHomeAppreciationRate}
          min={0}
          max={10}
          step={0.1}
          tipFormatter={(value) => `${value}%`}
          tipProps={{ visible: true, placement: "top" }}
        />
        <Line data={chartData} />
      </div>
    </div>
  );
};

export default RentVsBuyCalculator;
