import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap.css';

const RentVsBuyCalculator = () => {
  const [homePrice, setHomePrice] = useState(300000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [mortgageRate, setMortgageRate] = useState(3.5);
  const [rent, setRent] = useState(1500);
  const [years, setYears] = useState(30);
  const [taxRate, setTaxRate] = useState(1.25);
  const [maintenanceRate, setMaintenanceRate] = useState(1);
  const [homeAppreciationRate, setHomeAppreciationRate] = useState(3);
  const [rentIncreaseRate, setRentIncreaseRate] = useState(2);
  const [inflationRate, setInflationRate] = useState(2);
  const [investmentReturnRate, setInvestmentReturnRate] = useState(7);

  const calculateBuyCost = () => {
    let totalCost = 0;
    let currentHomePrice = homePrice;
    const downPayment = homePrice * (downPaymentPercent / 100);
    let mortgageBalance = homePrice - downPayment;

    const monthlyMortgageRate = mortgageRate / 100 / 12;
    const numPayments = years * 12;
    const monthlyPayment = mortgageBalance * monthlyMortgageRate / (1 - (1 + monthlyMortgageRate) ** -numPayments);

    for (let year = 1; year <= years; year++) {
      const annualTax = currentHomePrice * (taxRate / 100);
      const annualMaintenance = currentHomePrice * (maintenanceRate / 100);
      const annualMortgagePayment = monthlyPayment * 12;

      let yearCost = annualTax + annualMaintenance + annualMortgagePayment;
      
      // Apply inflation to the year's cost
      yearCost /= (1 + inflationRate / 100) ** (year - 1);

      totalCost += yearCost;

      // Update home price and mortgage balance for next year
      currentHomePrice *= 1 + (homeAppreciationRate / 100);
      const interestPaid = mortgageBalance * (mortgageRate / 100);
      mortgageBalance -= (annualMortgagePayment - interestPaid);
    }

    // Subtract the final home value (adjusted for inflation) from total cost
    totalCost -= currentHomePrice / (1 + inflationRate / 100) ** years;

    // Add the initial down payment
    totalCost += downPayment;

    return totalCost;
  };

  const calculateRentCost = () => {
    let totalCost = 0;
    let currentRent = rent;
    let investmentBalance = homePrice * (downPaymentPercent / 100);  // Initial investment equals down payment

    for (let year = 1; year <= years; year++) {
      let yearCost = currentRent * 12;
      
      // Apply inflation to the year's cost
      yearCost /= (1 + inflationRate / 100) ** (year - 1);

      totalCost += yearCost;

      // Increase rent for next year
      currentRent *= 1 + (rentIncreaseRate / 100);

      // Calculate investment returns
      investmentBalance *= 1 + (investmentReturnRate / 100);
    }

    // Subtract final investment balance (adjusted for inflation)
    totalCost -= investmentBalance / (1 + inflationRate / 100) ** years;

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
          const downPayment = homePrice * (downPaymentPercent / 100);
          let mortgageBalance = homePrice - downPayment;
          const monthlyMortgageRate = mortgageRate / 100 / 12;
          const numPayments = years * 12;
          const monthlyPayment = mortgageBalance * monthlyMortgageRate / (1 - (1 + monthlyMortgageRate) ** -numPayments);

          for (let year = 1; year <= i + 1; year++) {
            const annualTax = currentHomePrice * (taxRate / 100);
            const annualMaintenance = currentHomePrice * (maintenanceRate / 100);
            const annualMortgagePayment = monthlyPayment * 12;

            let yearCost = annualTax + annualMaintenance + annualMortgagePayment;
            yearCost /= (1 + inflationRate / 100) ** (year - 1);
            yearlyBuyCost += yearCost;

            currentHomePrice *= 1 + (homeAppreciationRate / 100);
            const interestPaid = mortgageBalance * (mortgageRate / 100);
            mortgageBalance -= (annualMortgagePayment - interestPaid);
          }

          yearlyBuyCost += downPayment;
          yearlyBuyCost -= currentHomePrice / (1 + inflationRate / 100) ** (i + 1);

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
          let investmentBalance = homePrice * (downPaymentPercent / 100);

          for (let year = 1; year <= i + 1; year++) {
            let yearCost = currentRent * 12;
            yearCost /= (1 + inflationRate / 100) ** (year - 1);
            yearlyRentCost += yearCost;

            currentRent *= 1 + (rentIncreaseRate / 100);
            investmentBalance *= 1 + (investmentReturnRate / 100);
          }

          yearlyRentCost -= investmentBalance / (1 + inflationRate / 100) ** (i + 1);

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
          Down Payment (%): 
          <Tooltip placement="top" overlay={`${downPaymentPercent}%`}>
            <input
              type="range"
              min="0"
              max="100"
              value={downPaymentPercent}
              onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
            />
          </Tooltip>
        </label>
      </div>
      {/* Add other input fields similar to the previous version */}
      <div>
        <label>
          Inflation Rate (%): 
          <Tooltip placement="top" overlay={`${inflationRate}%`}>
            <input
              type="range"
              min="0"
              max="10"
              step="0.1"
              value={inflationRate}
              onChange={(e) => setInflationRate(Number(e.target.value))}
            />
          </Tooltip>
        </label>
      </div>
      <div>
        <label>
          Investment Return Rate (%): 
          <Tooltip placement="top" overlay={`${investmentReturnRate}%`}>
            <input
              type="range"
              min="0"
              max="15"
              step="0.1"
              value={investmentReturnRate}
              onChange={(e) => setInvestmentReturnRate(Number(e.target.value))}
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
      <p>Total Buying Cost (Present Value): ${buyCost.toFixed(2)}</p>
      <p>Total Renting Cost (Present Value): ${rentCost.toFixed(2)}</p>
      <p>Difference (Buy - Rent): ${difference.toFixed(2)}</p>

      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default RentVsBuyCalculator;