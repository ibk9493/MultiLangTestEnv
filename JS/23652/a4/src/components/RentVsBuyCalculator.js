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
    <div className="container mt-5">
      <h2 className="text-center mb-4">Rent vs Buy Calculator</h2>
      <div className="row">
        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-header">Property Details</div>
            <div className="card-body">
              <InputSlider
                label="Home Price"
                value={homePrice}
                min={50000}
                max={1000000}
                onChange={setHomePrice}
                format={value => `$${value}`}
              />
              <InputSlider
                label="Down Payment (%)"
                value={downPaymentPercent}
                min={0}
                max={100}
                onChange={setDownPaymentPercent}
                format={value => `${value}%`}
              />
              <InputSlider
                label="Mortgage Rate (%)"
                value={mortgageRate}
                min={1}
                max={10}
                step={0.1}
                onChange={setMortgageRate}
                format={value => `${value}%`}
              />
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-header">Rental Details</div>
            <div className="card-body">
              <InputSlider
                label="Monthly Rent"
                value={rent}
                min={500}
                max={5000}
                onChange={setRent}
                format={value => `$${value}`}
              />
              <InputSlider
                label="Rent Increase Rate (%)"
                value={rentIncreaseRate}
                min={0}
                max={10}
                step={0.1}
                onChange={setRentIncreaseRate}
                format={value => `${value}%`}
              />
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-header">Economic Factors</div>
            <div className="card-body">
              <InputSlider
                label="Inflation Rate (%)"
                value={inflationRate}
                min={0}
                max={10}
                step={0.1}
                onChange={setInflationRate}
                format={value => `${value}%`}
              />
              <InputSlider
                label="Investment Return Rate (%)"
                value={investmentReturnRate}
                min={0}
                max={15}
                step={0.1}
                onChange={setInvestmentReturnRate}
                format={value => `${value}%`}
              />
              <InputSlider
                label="Home Appreciation Rate (%)"
                value={homeAppreciationRate}
                min={0}
                max={10}
                step={0.1}
                onChange={setHomeAppreciationRate}
                format={value => `${value}%`}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-header">Other Factors</div>
            <div className="card-body">
              <InputSlider
                label="Property Tax Rate (%)"
                value={taxRate}
                min={0.5}
                max={5}
                step={0.1}
                onChange={setTaxRate}
                format={value => `${value}%`}
              />
              <InputSlider
                label="Maintenance Cost Rate (%)"
                value={maintenanceRate}
                min={0.5}
                max={5}
                step={0.1}
                onChange={setMaintenanceRate}
                format={value => `${value}%`}
              />
              <InputSlider
                label="Years to Consider"
                value={years}
                min={1}
                max={40}
                onChange={setYears}
                format={value => `${value} years`}
              />
            </div>
          </div>
        </div>
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-header">Results</div>
            <div className="card-body">
              <p>Total Buying Cost (Present Value): <strong>${buyCost.toFixed(2)}</strong></p>
              <p>Total Renting Cost (Present Value): <strong>${rentCost.toFixed(2)}</strong></p>
              <p>Difference (Buy - Rent): <strong>${difference.toFixed(2)}</strong></p>
            </div>
          </div>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">Cost Comparison Over Time</div>
            <div className="card-body">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component for input sliders
const InputSlider = ({ label, value, min, max, step = 1, onChange, format }) => (
  <div className="mb-3">
    <label className="form-label">{label}: {format(value)}</label>
    <Tooltip placement="top" overlay={format(value)}>
      <input
        type="range"
        className="form-range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </Tooltip>
  </div>
);


export default RentVsBuyCalculator;