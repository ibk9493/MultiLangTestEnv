document.addEventListener('DOMContentLoaded', (event) => {
    const ctx = document.getElementById('myChart').getContext('2d');

    // Data from your tables
    const countries = ['UK', 'US', 'Italy', 'Germany', 'China', 'Brazil', 'Russia', 'India', 'Spain'];
    const preCovidMeans = [0.0059, 0.0468, 0.0192, 0.0268, 0.0314, 0.0141, 0.0315, -0.0108, 0.0057];
    const duringCovidMeans = [-0.0277, 0.0787, 0.0381, 0.0704, 0.1197, -0.0385, -0.0121, 0.0663, -0.0079];

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: countries,
            datasets: [{
                label: 'Pre-COVID-19 Mean Returns',
                data: preCovidMeans,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }, {
                label: 'During COVID-19 Mean Returns',
                data: duringCovidMeans,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Mean Return'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Mean Stock Returns Before and During COVID-19'
                },
                legend: {
                    display: true,
                    position: 'top',
                }
            }
        }
    });

    // Assume historicalData is an array of daily returns
    let prediction = predictStockReturn(historicalData);
    visualizePrediction(historicalData, prediction);

    // Listen for changes
    document.getElementById('daysAhead').addEventListener('input', function() { 
        updatePrediction(this.value, document.getElementById('confidenceLevel').value); 
    });
    document.getElementById('confidenceLevel').addEventListener('input', function() {
        updatePrediction(document.getElementById('daysAhead').value, this.value); 
    });
});

function predictStockReturn(historicalData, daysAhead = 365) {
    const lastYearReturns = historicalData.slice(-365);
    const meanReturn = lastYearReturns.reduce((acc, val) => acc + val, 0) / lastYearReturns.length;
    const volatility = Math.sqrt(lastYearReturns.map(x => Math.pow(x - meanReturn, 2)).reduce((a, b) => a + b) / (lastYearReturns.length - 1));
    
    // Simple prediction with noise
    return Array(daysAhead).fill().map(() => meanReturn + (Math.random() - 0.5) * volatility * 2);
}

function visualizePrediction(data, predictions, confidenceInterval = 0.95) {
    const ctx = document.getElementById('predictionChart').getContext('2d');
    
    // Calculate confidence interval
    const stdDev = Math.sqrt(predictions.map(x => Math.pow(x - predictions.mean(), 2)).reduce((a, b) => a + b) / (predictions.length - 1));
    const marginOfError = stdDev * 1.96; // For 95% CI, use 1.96

    const chartData = {
        labels: Array.from({length: predictions.length}, (_, i) => i + 1),
        datasets: [{
            label: 'Predicted Returns',
            data: predictions,
            borderColor: 'blue',
            fill: false,
        }, {
            label: 'Confidence Interval',
            data: predictions.map(val => val + marginOfError),
            borderColor: 'rgba(0, 255, 0, 0.2)',
            borderWidth: 0,
            fill: '+1',
        }, {
            label: 'Confidence Interval',
            data: predictions.map(val => val - marginOfError),
            borderColor: 'rgba(0, 255, 0, 0.2)',
            borderWidth: 0,
            fill: '-1',
        }]
    };

    new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
            responsive: true,
            scales: {
                x: { title: { display: true, text: 'Days Ahead' }},
                y: { title: { display: true, text: 'Return' }}
            }
        }
    });
}

function updatePrediction(days, confidence) {
    // Recalculate predictions based on new parameters
    let newPrediction = predictStockReturn(historicalData, days);
    // Update confidence level if necessary
    visualizePrediction(historicalData, newPrediction, confidence);
}
