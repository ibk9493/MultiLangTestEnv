import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const RentVsBuyCalculator = () => {
  const [homePrice, setHomePrice] = useState(300000);
  const [mortgageRate, setMortgageRate] = useState(3.5);
  const [rent, setRent] = useState(1500);
  const [years, setYears] = useState(30);
  const [taxRate, setTaxRate] = useState(1.25);
  const [maintenanceRate, setMaintenanceRate] = useState(1);

  // Calculate the total cost of buying
  const calculateBuyCost = () => {
    const monthlyMortgageRate = mortgageRate / 100 / 12;
    const numPayments = years * 12;
    const monthlyPayment = homePrice * monthlyMortgageRate / (1 - (1 + monthlyMortgageRate) ** -numPayments);
    const annualTax = (homePrice * (taxRate / 100));
    const annualMaintenance = (homePrice * (maintenanceRate / 100));
    const totalCost = (monthlyPayment * 12 * years) + (annualTax * years) + (annualMaintenance * years);
    return totalCost;
  };

  // Calculate the total cost of renting
  const calculateRentCost = () => {
    return rent * 12 * years;
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
    labels: Array.from({ length: years }, (_, i) => i + 1),
    datasets: [
      {
        label: 'Buying Cost',
        data: Array.from({ length: years }, (_, i) => ((buyCost / years) * (i + 1)).toFixed(2)),
        borderColor: 'rgba(75,192,192,1)',
        fill: false,
      },
      {
        label: 'Renting Cost',
        data: Array.from({ length: years }, (_, i) => ((rentCost / years) * (i + 1)).toFixed(2)),
        borderColor: 'rgba(255,99,132,1)',
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
          <input type="number" value={homePrice} onChange={(e) => setHomePrice(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Mortgage Rate (%): 
          <input type="number" value={mortgageRate} step="0.01" onChange={(e) => setMortgageRate(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Rent per Month: 
          <input type="number" value={rent} onChange={(e) => setRent(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Number of Years: 
          <input type="number" value={years} onChange={(e) => setYears(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Property Tax Rate (%): 
          <input type="number" value={taxRate} step="0.01" onChange={(e) => setTaxRate(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Maintenance Cost Rate (%): 
          <input type="number" value={maintenanceRate} step="0.01" onChange={(e) => setMaintenanceRate(e.target.value)} />
        </label>
      </div>

      <h3>Results:</h3>
      <p>Total Buying Cost: ${buyCost.toFixed(2)}</p>
      <p>Total Renting Cost: ${rentCost.toFixed(2)}</p>
      <p>Difference (Buy - Rent): ${difference.toFixed(2)}</p>

      <Line data={chartData} />
    </div>
  );
};

export default RentVsBuyCalculator;
