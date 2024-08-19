document.addEventListener('DOMContentLoaded', (event) => {
    // Historical data
    const countries = ['UK', 'US', 'Italy', 'Germany', 'China', 'Brazil', 'Russia', 'India', 'Spain'];
    const preCovidMeans = [0.0059, 0.0468, 0.0192, 0.0268, 0.0314, 0.0141, 0.0315, -0.0108, 0.0057];
    const duringCovidMeans = [-0.0277, 0.0787, 0.0381, 0.0704, 0.1197, -0.0385, -0.0121, 0.0663, -0.0079];

    // Function to create historical chart
    function createHistoricalChart() {
        const ctx = document.getElementById('historicalChart').getContext('2d');
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
                    }
                }
            }
        });
    }

    // Function to perform simple linear regression
    function linearRegression(x, y) {
        const n = x.length;
        let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
        for (let i = 0; i < n; i++) {
            sumX += x[i];
            sumY += y[i];
            sumXY += x[i] * y[i];
            sumXX += x[i] * x[i];
        }
        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;
        return { slope, intercept };
    }

    // Function to calculate prediction and confidence interval
    function calculatePrediction(x, y, newX, confidenceLevel) {
        const { slope, intercept } = linearRegression(x, y);
        const prediction = slope * newX + intercept;
        
        const n = x.length;
        let sumSquaredError = 0;
        for (let i = 0; i < n; i++) {
            const yPred = slope * x[i] + intercept;
            sumSquaredError += Math.pow(y[i] - yPred, 2);
        }
        const standardError = Math.sqrt(sumSquaredError / (n - 2));
        const tValue = jStat.studentt.inv((1 + confidenceLevel) / 2, n - 2);
        const marginOfError = tValue * standardError * Math.sqrt(1 / n + Math.pow(newX - jStat.mean(x), 2) / jStat.sum(x.map(xi => Math.pow(xi - jStat.mean(x), 2))));
        
        return {
            prediction,
            lowerBound: prediction - marginOfError,
            upperBound: prediction + marginOfError
        };
    }

    // Function to create prediction chart
    function createPredictionChart(confidenceLevel) {
        const ctx = document.getElementById('predictionChart').getContext('2d');
        const x = [1, 2]; // 1 for pre-COVID, 2 for during COVID
        const predictions = countries.map((country, index) => {
            const y = [preCovidMeans[index], duringCovidMeans[index]];
            return calculatePrediction(x, y, 3, confidenceLevel); // 3 for 2021 prediction
        });

        new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: '2021 Predictions',
                    data: predictions.map((pred, index) => ({ x: index, y: pred.prediction })),
                    backgroundColor: 'rgba(255, 206, 86, 1)',
                }]
            },
            options: {
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        title: {
                            display: true,
                            text: 'Country Index'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Predicted Return'
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: '2021 Stock Return Predictions'
                    },
                    annotation: {
                        annotations: predictions.map((pred, index) => ({
                            type: 'box',
                            xMin: index - 0.5,
                            xMax: index + 0.5,
                            yMin: pred.lowerBound,
                            yMax: pred.upperBound,
                            backgroundColor: 'rgba(255, 206, 86, 0.2)'
                        }))
                    }
                }
            }
        });
    }

    // Initial chart creation
    createHistoricalChart();
    createPredictionChart(0.95);

    // Event listener for confidence level slider
    document.getElementById('confidenceLevel').addEventListener('input', function(e) {
        const confidenceLevel = parseFloat(e.target.value);
        document.getElementById('confidenceLevelValue').textContent = confidenceLevel.toFixed(2);
        createPredictionChart(confidenceLevel);
    });
});