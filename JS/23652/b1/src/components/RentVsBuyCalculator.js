import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const RentVsBuyCalculator = () => {
  // State variables for inputs
  const [homePrice, setHomePrice] = useState(300000);
  const [downPayment, setDownPayment] = useState(60000);
  const [mortgageRate, setMortgageRate] = useState(3.5);
  const [mortgageTerm, setMortgageTerm] = useState(30);
  const [monthlyRent, setMonthlyRent] = useState(1500);
  const [propertyTaxRate, setPropertyTaxRate] = useState(1.2);
  const [maintenanceCost, setMaintenanceCost] = useState(1);
  const [homeAppreciation, setHomeAppreciation] = useState(3);
  const [rentIncrease, setRentIncrease] = useState(2);
  const [yearsToAnalyze, setYearsToAnalyze] = useState(10);

  // Calculator logic
  const calculateMortgagePayment = () => {
    const principal = homePrice - downPayment;
    const monthlyRate = mortgageRate / 100 / 12;
    const numberOfPayments = mortgageTerm * 12;
    return (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  };

  const calculateCosts = () => {
    const monthlyMortgage = calculateMortgagePayment();
    const monthlyPropertyTax = (homePrice * propertyTaxRate / 100) / 12;
    const monthlyMaintenance = (homePrice * maintenanceCost / 100) / 12;

    let buyingCosts = [];
    let rentingCosts = [];
    let homeValue = homePrice;
    let currentRent = monthlyRent;

    for (let year = 1; year <= yearsToAnalyze; year++) {
      const yearlyMortgage = monthlyMortgage * 12;
      const yearlyPropertyTax = monthlyPropertyTax * 12;
      const yearlyMaintenance = monthlyMaintenance * 12;
      const yearlyBuyingCost = yearlyMortgage + yearlyPropertyTax + yearlyMaintenance;
      
      buyingCosts.push(yearlyBuyingCost);
      rentingCosts.push(currentRent * 12);

      homeValue *= (1 + homeAppreciation / 100);
      currentRent *= (1 + rentIncrease / 100);
    }

    return { buyingCosts, rentingCosts, finalHomeValue: homeValue };
  };

  const { buyingCosts, rentingCosts, finalHomeValue } = calculateCosts();

  // Chart data
  const chartData = {
    labels: Array.from({ length: yearsToAnalyze }, (_, i) => `Year ${i + 1}`),
    datasets: [
      {
        label: 'Buying Costs',
        data: buyingCosts,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
      {
        label: 'Renting Costs',
        data: rentingCosts,
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="rent-vs-buy-calculator">
      <h2>Rent vs. Buy Calculator</h2>
      {/* Input fields */}
      <div className="input-fields">
        <label>
          Home Price: $
          <input type="number" value={homePrice} onChange={(e) => setHomePrice(Number(e.target.value))} />
        </label>
        {/* Add more input fields for other variables */}
      </div>
      
      {/* Results */}
      <div className="results">
        <h3>Results</h3>
        <p>Total Buying Cost (over {yearsToAnalyze} years): ${buyingCosts.reduce((a, b) => a + b, 0).toFixed(2)}</p>
        <p>Total Renting Cost (over {yearsToAnalyze} years): ${rentingCosts.reduce((a, b) => a + b, 0).toFixed(2)}</p>
        <p>Final Home Value: ${finalHomeValue.toFixed(2)}</p>
      </div>

      {/* Chart */}
      <div className="chart">
        <h3>Cost Comparison Over Time</h3>
        <Line data={chartData} />
      </div>
    </div>
  );
};

export default RentVsBuyCalculator;