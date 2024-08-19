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
});
