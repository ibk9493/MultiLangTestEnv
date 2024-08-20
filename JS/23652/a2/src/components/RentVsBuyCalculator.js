import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import Slider from '@material-ui/core/Slider';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';

const CustomSlider = withStyles({
  root: {
    color: '#3a8589',
    height: 3,
    padding: '13px 0',
  },
  thumb: {
    height: 27,
    width: 27,
    backgroundColor: '#fff',
    border: '1px solid currentColor',
    marginTop: -12,
    marginLeft: -13,
    boxShadow: '#ebebeb 0 2px 2px',
    '&:focus, &:hover, &$active': {
      boxShadow: '#ccc 0 2px 3px 1px',
    },
  },
  active: {},
  valueLabel: {
    left: 'calc(-50% + 4px)',
  },
  track: {
    height: 3,
  },
  rail: {
    color: '#d8d8d8',
    opacity: 1,
    height: 3,
  },
})(Slider);

function ValueLabelComponent(props) {
  const { children, open, value } = props;

  return (
    <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
      {children}
    </Tooltip>
  );
}

const RentVsBuyCalculator = () => {
  const [homePrice, setHomePrice] = useState(300000);
  const [mortgageRate, setMortgageRate] = useState(3.5);
  const [rent, setRent] = useState(1500);
  const [years, setYears] = useState(30);
  const [taxRate, setTaxRate] = useState(1.25);
  const [maintenanceRate, setMaintenanceRate] = useState(1);
  const [homeAppreciationRate, setHomeAppreciationRate] = useState(3);
  const [rentIncreaseRate, setRentIncreaseRate] = useState(2);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    calculateCosts();
  }, [homePrice, mortgageRate, rent, years, taxRate, maintenanceRate, homeAppreciationRate, rentIncreaseRate, downPaymentPercent]);

  const calculateCosts = () => {
    const downPayment = homePrice * (downPaymentPercent / 100);
    const loanAmount = homePrice - downPayment;
    const monthlyMortgageRate = mortgageRate / 100 / 12;
    const numPayments = years * 12;
    const monthlyMortgagePayment = loanAmount * monthlyMortgageRate / (1 - (1 + monthlyMortgageRate) ** -numPayments);

    let buyCosts = [downPayment];
    let rentCosts = [0];
    let homeValues = [homePrice];

    for (let year = 1; year <= years; year++) {
      const annualMortgagePayment = monthlyMortgagePayment * 12;
      const annualTax = homeValues[year - 1] * (taxRate / 100);
      const annualMaintenance = homeValues[year - 1] * (maintenanceRate / 100);
      const totalBuyCost = annualMortgagePayment + annualTax + annualMaintenance;
      
      buyCosts.push(buyCosts[year - 1] + totalBuyCost);
      
      const annualRent = rent * 12 * ((1 + rentIncreaseRate / 100) ** (year - 1));
      rentCosts.push(rentCosts[year - 1] + annualRent);
      
      homeValues.push(homeValues[year - 1] * (1 + homeAppreciationRate / 100));
    }

    setChartData({
      labels: Array.from({ length: years + 1 }, (_, i) => i),
      datasets: [
        {
          label: 'Cumulative Buying Cost',
          data: buyCosts,
          borderColor: 'rgba(75,192,192,1)',
          fill: false,
        },
        {
          label: 'Cumulative Renting Cost',
          data: rentCosts,
          borderColor: 'rgba(255,99,132,1)',
          fill: false,
        },
        {
          label: 'Home Value',
          data: homeValues,
          borderColor: 'rgba(153,102,255,1)',
          fill: false,
        },
      ],
    });
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h2>Enhanced Rent vs Buy Calculator</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <label>Home Price: ${homePrice}</label>
        <CustomSlider
          ValueLabelComponent={ValueLabelComponent}
          value={homePrice}
          onChange={(_, newValue) => setHomePrice(newValue)}
          min={100000}
          max={1000000}
          step={10000}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>Mortgage Rate: {mortgageRate}%</label>
        <CustomSlider
          ValueLabelComponent={ValueLabelComponent}
          value={mortgageRate}
          onChange={(_, newValue) => setMortgageRate(newValue)}
          min={1}
          max={10}
          step={0.1}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>Monthly Rent: ${rent}</label>
        <CustomSlider
          ValueLabelComponent={ValueLabelComponent}
          value={rent}
          onChange={(_, newValue) => setRent(newValue)}
          min={500}
          max={5000}
          step={100}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>Years: {years}</label>
        <CustomSlider
          ValueLabelComponent={ValueLabelComponent}
          value={years}
          onChange={(_, newValue) => setYears(newValue)}
          min={5}
          max={30}
          step={1}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>Property Tax Rate: {taxRate}%</label>
        <CustomSlider
          ValueLabelComponent={ValueLabelComponent}
          value={taxRate}
          onChange={(_, newValue) => setTaxRate(newValue)}
          min={0}
          max={5}
          step={0.1}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>Maintenance Cost Rate: {maintenanceRate}%</label>
        <CustomSlider
          ValueLabelComponent={ValueLabelComponent}
          value={maintenanceRate}
          onChange={(_, newValue) => setMaintenanceRate(newValue)}
          min={0}
          max={5}
          step={0.1}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>Home Appreciation Rate: {homeAppreciationRate}%</label>
        <CustomSlider
          ValueLabelComponent={ValueLabelComponent}
          value={homeAppreciationRate}
          onChange={(_, newValue) => setHomeAppreciationRate(newValue)}
          min={0}
          max={10}
          step={0.1}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>Annual Rent Increase Rate: {rentIncreaseRate}%</label>
        <CustomSlider
          ValueLabelComponent={ValueLabelComponent}
          value={rentIncreaseRate}
          onChange={(_, newValue) => setRentIncreaseRate(newValue)}
          min={0}
          max={10}
          step={0.1}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>Down Payment: {downPaymentPercent}%</label>
        <CustomSlider
          ValueLabelComponent={ValueLabelComponent}
          value={downPaymentPercent}
          onChange={(_, newValue) => setDownPaymentPercent(newValue)}
          min={0}
          max={100}
          step={1}
        />
      </div>

      {chartData && (
        <div style={{ marginTop: '40px' }}>
          <h3>Cumulative Costs Over Time</h3>
          <Line 
            data={chartData}
            options={{
              responsive: true,
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Cumulative Cost ($)'
                  }
                },
                x: {
                  title: {
                    display: true,
                    text: 'Years'
                  }
                }
              }
            }}
          />
        </div>
      )}
    </div>
  );
};

export default RentVsBuyCalculator;