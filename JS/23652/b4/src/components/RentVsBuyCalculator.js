import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap.css';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';

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

  const renderInputField = (label, value, setValue, min, max, step, tooltip) => (
    <Form.Group as={Row}>
      <Form.Label column sm="6">{label}</Form.Label>
      <Col sm="6">
        <Tooltip placement="top" overlay={tooltip}>
          <Form.Range 
            value={value} 
            onChange={(e) => setValue(Number(e.target.value))} 
            min={min} 
            max={max} 
            step={step}
          />
        </Tooltip>
        <Form.Text>{tooltip}</Form.Text>
      </Col>
    </Form.Group>
  );

    return (
    <Container fluid className="mt-4">
      <h2 className="text-center">Rent vs Buy Calculator</h2>
      <Row>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Inputs</Card.Title>
              {renderInputField('Home Price', homePrice, setHomePrice, 50000, 1000000, 1000, `$${homePrice}`)}
              {renderInputField('Down Payment (%)', downPaymentPercent, setDownPaymentPercent, 0, 100, 1, `${downPaymentPercent}%`)}
              {renderInputField('Mortgage Rate (%)', mortgageRate, setMortgageRate, 1, 10, 0.1, `${mortgageRate}%`)}
              {renderInputField('Rent per Month', rent, setRent, 500, 5000, 10, `$${rent}`)}
              {/* Add other fields similarly */}
              {renderInputField('Inflation Rate (%)', inflationRate, setInflationRate, 0, 10, 0.1, `${inflationRate}%`)}
              {renderInputField('Investment Return Rate (%)', investmentReturnRate, setInvestmentReturnRate, 0, 15, 0.1, `${investmentReturnRate}%`)}
            </Card.Body>
          </Card>
        </Col>
        <Col md={8}>
          <Card>
            <Card.Body>
              <Line data={chartData} options={chartOptions} style={{maxHeight: '400px'}} />
              <Card.Text className="mt-3">
                <strong>Total Buying Cost:</strong> ${buyCost.toFixed(2)}<br/>
                <strong>Total Renting Cost:</strong> ${rentCost.toFixed(2)}<br/>
                <strong>Difference (Buy - Rent):</strong> ${difference.toFixed(2)}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
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