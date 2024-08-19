document.addEventListener('DOMContentLoaded', (event) => {
    // Historical data
    const countries = ['UK', 'US', 'Italy', 'Germany', 'China', 'Brazil', 'Russia', 'India', 'Spain'];
    const preCovidMeans = [0.0059, 0.0468, 0.0192, 0.0268, 0.0314, 0.0141, 0.0315, -0.0108, 0.0057];
    const duringCovidMeans = [-0.0277, 0.0787, 0.0381, 0.0704, 0.1197, -0.0385, -0.0121, 0.0663, -0.0079];

    let predictionChart;

    function createHistoricalChart() {
        const ctx = document.getElementById('historicalChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: countries,
                datasets: [{
                    label: 'Pre-COVID-19 Mean Returns',
                    data: preCovidMeans,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
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
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Mean Return',
                            font: {
                                size: 14
                            }
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Countries',
                            font: {
                                size: 14
                            }
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Mean Stock Returns Before and During COVID-19',
                        font: {
                            size: 18
                        }
                    },
                    legend: {
                        position: 'top',
                        labels: {
                            font: {
                                size: 12
                            }
                        }
                    }
                }
            }
        });
    }

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

    function createPredictionChart(confidenceLevel) {
        const ctx = document.getElementById('predictionChart').getContext('2d');
        const x = [1, 2]; // 1 for pre-COVID, 2 for during COVID
        const predictions = countries.map((country, index) => {
            const y = [preCovidMeans[index], duringCovidMeans[index]];
            return calculatePrediction(x, y, 3, confidenceLevel); // 3 for 2021 prediction
        });

        if (predictionChart) {
            predictionChart.destroy();
        }

        predictionChart = new Chart(ctx, {
            type: 'scatter',
            data: {
                labels: countries,
                datasets: [{
                    label: '2021 Predictions',
                    data: predictions.map((pred, index) => ({ x: index + 1, y: pred.prediction })),
                    backgroundColor: 'rgba(255, 206, 86, 1)',
                }]
            },
            options: {
                maintainAspectRatio: false,
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        title: {
                            display: true,
                            text: 'Countries',
                            font: {
                                size: 14
                            }
                        },
                        ticks: {
                            callback: function(value) {
                                return countries[value - 1];
                            }
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Predicted Return',
                            font: {
                                size: 14
                            }
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: '2021 Stock Return Predictions with Confidence Intervals',
                        font: {
                            size: 18
                        }
                    },
                    legend: {
                        position: 'top',
                        labels: {
                            font: {
                                size: 12
                            }
                        }
                    },
                    annotation: {
                        annotations: predictions.map((pred, index) => ({
                            type: 'box',
                            xMin: index + 0.5,
                            xMax: index + 1.5,
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

    document.getElementById('confidenceLevel').addEventListener('input', function(e) {
        const confidenceLevel = parseFloat(e.target.value);
        document.getElementById('confidenceLevelValue').textContent = confidenceLevel.toFixed(2);
        createPredictionChart(confidenceLevel);
    });
    // Assuming previous code for historical data and chart creation is in place

function adjustForScenario(meanReturn, scenario, growthRate) {
    let adjustment = meanReturn;
    
    switch(scenario) {
        case '1': // Bullish
            adjustment *= 1.10 + (growthRate / 100); // 10% increase plus growth rate effect
            break;
        case '-1': // Bearish
            adjustment *= 0.90 + (growthRate / 100); // 10% decrease plus growth rate effect
            break;
        case '2': // Volatile
            // Volatility could mean wider confidence intervals rather than mean adjustment
            return {mean: adjustment, volatility: 0.2}; // 20% volatility increase
        // Normal scenario does nothing, as it's the base case
    }
    
    return {mean: adjustment, volatility: 0}; // No volatility change for normal, bullish, bearish
}

function updatePredictions(confidenceLevel, scenario, growthRate) {
    const x = [1, 2]; // Pre-COVID, During COVID
    const predictions = countries.map((country, index) => {
        let y = [preCovidMeans[index], duringCovidMeans[index]];
        let adjustedMean = adjustForScenario(y[1], scenario, parseFloat(growthRate));
        y[1] = adjustedMean.mean; // Adjust the 'during' value for scenario
        
        let pred = calculatePrediction(x, y, 3, confidenceLevel); // Predict for 2021
        
        // Adjust for volatility in volatile markets
        if (adjustedMean.volatility) {
            const volatility = adjustedMean.volatility;
            pred.lowerBound -= pred.prediction * volatility;
            pred.upperBound += pred.prediction * volatility;
        }
        
        return pred;
    });

    // Update or recreate the chart with new predictions
    if (predictionChart) {
        predictionChart.data.datasets[0].data = predictions.map((pred, index) => ({ x: index + 1, y: pred.prediction }));
        predictionChart.options.plugins.annotation.annotations = predictions.map((pred, index) => ({
            type: 'box',
            xMin: index + 0.5,
            xMax: index + 1.5,
            yMin: pred.lowerBound,
            yMax: pred.upperBound,
            backgroundColor: 'rgba(255, 206, 86, 0.2)'
        }));
        predictionChart.update();
    } else {
        createPredictionChart(confidenceLevel); // This function should now use the new predictions
    }
}

// Event listeners for scenario changes
document.getElementById('marketScenario').addEventListener('change', function(e) {
    updatePredictions(
        parseFloat(document.getElementById('confidenceLevel').value), 
        e.target.value, 
        document.getElementById('growthRate').value
    );
});

document.getElementById('growthRate').addEventListener('input', function(e) {
    updatePredictions(
        parseFloat(document.getElementById('confidenceLevel').value), 
        document.getElementById('marketScenario').value, 
        e.target.value
    );
});

// Keep the existing confidence level event listener for dynamic updates
});
