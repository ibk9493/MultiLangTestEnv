// src/components/RentVsBuyCalculator.js
import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const RentVsBuyCalculator = () => {
  const [inputs, setInputs] = useState({
    homePrice: 200000,
    downPayment: 20, // Percentage
    loanTerm: 30, // Years
    interestRate: 3.5, // Annual rate
    propertyTaxRate: 1, // Percentage
    homeInsurance: 1000, // Annual
    hoa: 0, // Monthly
    maintenance: 1, // Percentage of home price annually
    rent: 1200, // Monthly
    rentIncrease: 2, // Annual increase in percentage
    appreciationRate: 2, // Home value appreciation annually
    investmentReturn: 5, // Annual return if money was invested instead
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  // Calculate buying costs
  const calculateBuyCosts = () => {
    const principal = inputs.homePrice * (1 - inputs.downPayment / 100);
    const monthlyRate = (inputs.interestRate / 100) / 12;
    const months = inputs.loanTerm * 12;
    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    
    let buyCosts = [inputs.downPayment / 100 * inputs.homePrice];
    let homeValue = inputs.homePrice;
    let equity = buyCosts[0];
    let totalPaid = buyCosts[0];

    for (let year = 1; year <= inputs.loanTerm; year++) {
      const interest = principal * monthlyRate * 12;
      const maintenance = (inputs.maintenance / 100) * inputs.homePrice;
      const taxes = (inputs.propertyTaxRate / 100) * homeValue;
      const insurance = inputs.homeInsurance;
      const hoa = inputs.hoa * 12;
      const appreciation = homeValue * (inputs.appreciationRate / 100);

      homeValue += appreciation;
      equity += monthlyPayment * 12 - interest + appreciation;
      totalPaid += monthlyPayment * 12 + maintenance + taxes + insurance + hoa;

      buyCosts.push(totalPaid - equity);
    }

    return buyCosts;
  };

  // Calculate renting costs
  const calculateRentCosts = () => {
    let rentCosts = [0];
    let currentRent = inputs.rent * 12;
    
    for (let year = 1; year <= inputs.loanTerm; year++) {
      currentRent *= (1 + inputs.rentIncrease / 100);
      rentCosts.push(rentCosts[year-1] + currentRent);
    }

    return rentCosts;
  };

  const buyData = calculateBuyCosts();
  const rentData = calculateRentCosts();

  const data = {
    labels: Array.from({length: inputs.loanTerm}, (_, i) => i + 1),
    datasets: [
      {
        label: 'Buying',
        data: buyData,
        borderColor: 'rgb(75, 192, 192)',
        fill: false,
      },
      {
        label: 'Renting',
        data: rentData,
        borderColor: 'rgb(255, 99, 132)',
        fill: false,
      }
    ]
  };

  return (
    <div>
      <form>
        {/* Here you'll add form fields for all inputs like homePrice, downPayment, etc. */}
        {/* Example: */}
        <input type="number" name="homePrice" value={inputs.homePrice} onChange={handleChange} placeholder="Home Price"/>
      </form>
      <Line data={data} />
    </div>
  );
};

export default RentVsBuyCalculator;