/* index */

let lastScrollTop = 0;
        const navbar = document.getElementById("navbar");

        window.addEventListener("scroll", function () {
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            if (scrollTop > lastScrollTop) {
                // Scroll Down
                navbar.classList.add("hidden");
            } else {
                // Scroll Up
                navbar.classList.remove("hidden");
            }
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
        });

/* dashboard */

// Fetch Data Function
function fetchData() {
    // Example data fetching from a backend API
    fetch('get_data.php')
        .then(response => response.json())
        .then(data => {
            document.getElementById('soil-moisture').innerText = data.soilMoisture + '%';
            document.getElementById('temperature').innerText = data.temperature + '°C';
            document.getElementById('humidity').innerText = data.humidity + '%';

            // Change color based on conditions
            if (data.soilMoisture < 30) {
                document.getElementById('soil-moisture').className = 'text-2xl low-moisture';
            } else {
                document.getElementById('soil-moisture').className = 'text-2xl healthy';
            }
        });
}

// Fetch data every minute
setInterval(fetchData, 60000);
fetchData();

// Chart.js for Historical Data
var ctx = document.getElementById('historicalDataChart').getContext('2d');
var historicalDataChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [], // Time labels
        datasets: [
            {
                label: 'Soil Moisture',
                data: [],
                borderColor: 'rgba(75, 192, 192, 1)',
                fill: false
            },
            {
                label: 'Temperature',
                data: [],
                borderColor: 'rgba(255, 99, 132, 1)',
                fill: false
            },
            {
                label: 'Humidity',
                data: [],
                borderColor: 'rgba(54, 162, 235, 1)',
                fill: false
            }
        ]
    },
    options: {
        responsive: true,
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Time'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Values'
                }
            }
        }
    }
});

// Function to update chart data
function updateChartData() {
    fetch('get_historical_data.php')
        .then(response => response.json())
        .then(data => {
            historicalDataChart.data.labels = data.time;
            historicalDataChart.data.datasets[0].data = data.soilMoisture;
            historicalDataChart.data.datasets[1].data = data.temperature;
            historicalDataChart.data.datasets[2].data = data.humidity;
            historicalDataChart.update();
        });
}

// Update chart data every minute
setInterval(updateChartData, 60000);
updateChartData();

// Function to generate report
function generateReport() {
    const soilMoisture = document.getElementById('soil-moisture').innerText;
    const temperature = document.getElementById('temperature').innerText;
    const humidity = document.getElementById('humidity').innerText;

    const reportContent = `
Intelligent Plant Watering Report:
Soil Moisture: ${soilMoisture}
Temperature: ${temperature}
Humidity: ${humidity}
`;

    alert('Report generated!\n\n' + reportContent);
}

// Function to download report as a text file
function downloadReport() {
    const soilMoisture = document.getElementById('soil-moisture').innerText;
    const temperature = document.getElementById('temperature').innerText;
    const humidity = document.getElementById('humidity').innerText;

    const reportContent = `
Intelligent Plant Watering Report:
Soil Moisture: ${soilMoisture}
Temperature: ${temperature}
Humidity: ${humidity}
`;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'plant_watering_report.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Attach event listeners to the buttons
document.getElementById('btn-generate-report').addEventListener('click', generateReport);
document.getElementById('btn-download-report').addEventListener('click', downloadReport);