import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap.css';

const RentVsBuyCalculator = () => {
  const [homePrice, setHomePrice] = useState(300000);
  const [mortgageRate, setMortgageRate] = useState(3.5);
  const [rent, setRent] = useState(1500);
  const [years, setYears] = useState(30);
  const [taxRate, setTaxRate] = useState(1.25);
  const [maintenanceRate, setMaintenanceRate] = useState(1);
  const [homeAppreciationRate, setHomeAppreciationRate] = useState(3);
  const [rentIncreaseRate, setRentIncreaseRate] = useState(2);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20); // Percentage of home price
  const downPayment = homePrice * (downPaymentPercent / 100);
  const loanAmount = homePrice - downPayment;
  
  // In your mortgage calculation:
  const monthlyMortgageRate = mortgageRate / 100 / 12;
  const numPayments = years * 12;
  const monthlyPayment = loanAmount * monthlyMortgageRate / (1 - (1 + monthlyMortgageRate) ** -numPayments);
const [inflationRate, setInflationRate] = useState(2); // Assume 2% inflation rate

// Function to adjust for inflation
const adjustForInflation = (value, years) => {
  return value * Math.pow((1 + (inflationRate / 100)), years);
};

// Adjust monthly payments, rent, maintenance, etc., over time:
for (let year = 1; year <= years; year++) {
  const inflatedMonthlyPayment = adjustForInflation(monthlyPayment, year);
  const inflatedAnnualTax = adjustForInflation(currentHomePrice * (taxRate / 100), year);
  const inflatedAnnualMaintenance = adjustForInflation(currentHomePrice * (maintenanceRate / 100), year);
  const inflatedRent = adjustForInflation(rent, year);

  // Sum these inflated values for total costs
  totalBuyCost += (inflatedMonthlyPayment * 12) + inflatedAnnualTax + inflatedAnnualMaintenance;
  totalRentCost += inflatedRent * 12;
}

  // Calculate the total cost of buying with appreciation
  const calculateBuyCost = () => {
    let totalCost = 0;
    let currentHomePrice = homePrice;

    const monthlyMortgageRate = mortgageRate / 100 / 12;
    const numPayments = years * 12;
    const monthlyPayment = currentHomePrice * monthlyMortgageRate / (1 - (1 + monthlyMortgageRate) ** -numPayments);

    for (let year = 1; year <= years; year++) {
      const annualTax = currentHomePrice * (taxRate / 100);
      const annualMaintenance = currentHomePrice * (maintenanceRate / 100);
      totalCost += (monthlyPayment * 12) + annualTax + annualMaintenance;

      // Increase home price due to appreciation
      currentHomePrice *= 1 + (homeAppreciationRate / 100);
    }

    return totalCost;
  };

  // Calculate the total cost of renting with rent increases
  const calculateRentCost = () => {
    let totalCost = 0;
    let currentRent = rent;

    for (let year = 1; year <= years; year++) {
      totalCost += currentRent * 12;

      // Increase rent due to rent increase rate
      currentRent *= 1 + (rentIncreaseRate / 100);
    }

    return totalCost;
  };

  const buyCost = calculateBuyCost();
  const rentCost = calculateRentCost();
  const difference = buyCost - rentCost;

  // Data for chart
  const chartData = {
    labels: Array.from({ length: years }, (_, i) => `Year ${i + 1}`),
    datasets: [
      {
        label: 'Cumulative Buying Cost',
        data: Array.from({ length: years }, (_, i) => {
          let yearlyBuyCost = 0;
          let currentHomePrice = homePrice;
          const monthlyMortgageRate = mortgageRate / 100 / 12;
          const numPayments = (i + 1) * 12;
          const monthlyPayment = currentHomePrice * monthlyMortgageRate / (1 - (1 + monthlyMortgageRate) ** -numPayments);

          for (let year = 1; year <= i + 1; year++) {
            const annualTax = currentHomePrice * (taxRate / 100);
            const annualMaintenance = currentHomePrice * (maintenanceRate / 100);
            yearlyBuyCost += (monthlyPayment * 12) + annualTax + annualMaintenance;

            currentHomePrice *= 1 + (homeAppreciationRate / 100);
          }

          return yearlyBuyCost.toFixed(2);
        }),
        borderColor: 'rgba(75,192,192,1)',
        fill: false,
      },
      {
        label: 'Cumulative Renting Cost',
        data: Array.from({ length: years }, (_, i) => {
          let yearlyRentCost = 0;
          let currentRent = rent;

          for (let year = 1; year <= i + 1; year++) {
            yearlyRentCost += currentRent * 12;

            currentRent *= 1 + (rentIncreaseRate / 100);
          }

          return yearlyRentCost.toFixed(2);
        }),
        borderColor: 'rgba(255,99,132,1)',
        fill: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `${context.dataset.label}: $${context.raw}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `$${value}`,
        },
      },
    },
  };

  return (
    <div>
      <h2>Rent vs Buy Calculator</h2>
      <div>
        <label>
          Home Price: 
          <Tooltip placement="top" overlay={`$${homePrice}`}>
            <input
              type="range"
              min="50000"
              max="1000000"
              value={homePrice}
              onChange={(e) => setHomePrice(Number(e.target.value))}
            />
          </Tooltip>
        </label>
      </div>
      <div>
        <label>
          Mortgage Rate (%): 
          <Tooltip placement="top" overlay={`${mortgageRate}%`}>
            <input
              type="range"
              min="1"
              max="10"
              step="0.1"
              value={mortgageRate}
              onChange={(e) => setMortgageRate(Number(e.target.value))}
            />
          </Tooltip>
        </label>
      </div>
      <div>
        <label>
          Rent per Month: 
          <Tooltip placement="top" overlay={`$${rent}`}>
            <input
              type="range"
              min="500"
              max="5000"
              value={rent}
              onChange={(e) => setRent(Number(e.target.value))}
            />
          </Tooltip>
        </label>
      </div>
      <div>
        <label>
          Number of Years: 
          <Tooltip placement="top" overlay={`${years} years`}>
            <input
              type="range"
              min="1"
              max="40"
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
            />
          </Tooltip>
        </label>
      </div>
      <div>
        <label>
          Property Tax Rate (%): 
          <Tooltip placement="top" overlay={`${taxRate}%`}>
            <input
              type="range"
              min="0.5"
              max="5"
              step="0.1"
              value={taxRate}
              onChange={(e) => setTaxRate(Number(e.target.value))}
            />
          </Tooltip>
        </label>
      </div>
      <div>
        <label>
          Maintenance Cost Rate (%): 
          <Tooltip placement="top" overlay={`${maintenanceRate}%`}>
            <input
              type="range"
              min="0.5"
              max="5"
              step="0.1"
              value={maintenanceRate}
              onChange={(e) => setMaintenanceRate(Number(e.target.value))}
            />
          </Tooltip>
        </label>
      </div>
      <div>
        <label>
          Home Appreciation Rate (%): 
          <Tooltip placement="top" overlay={`${homeAppreciationRate}%`}>
            <input
              type="range"
              min="0"
              max="10"
              step="0.1"
              value={homeAppreciationRate}
              onChange={(e) => setHomeAppreciationRate(Number(e.target.value))}
            />
          </Tooltip>
        </label>
      </div>
      <div>
        <label>
          Rent Increase Rate (%): 
          <Tooltip placement="top" overlay={`${rentIncreaseRate}%`}>
            <input
              type="range"
              min="0"
              max="10"
              step="0.1"
              value={rentIncreaseRate}
              onChange={(e) => setRentIncreaseRate(Number(e.target.value))}
            />
          </Tooltip>
        </label>
      </div>

      <h3>Results:</h3>
      <p>Total Buying Cost: ${buyCost.toFixed(2)}</p>
      <p>Total Renting Cost: ${rentCost.toFixed(2)}</p>
      <p>Difference (Buy - Rent): ${difference.toFixed(2)}</p>

      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default RentVsBuyCalculator;
