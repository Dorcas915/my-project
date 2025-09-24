// Elements from the DOM
const temperatureEl = document.getElementById('temperature');
const humidityEl = document.getElementById('humidity');
const conditionEl = document.getElementById('condition');
const soilMoistureEl = document.getElementById('soil-moisture');
const irrigatebtnEl = document.getElementById('irrigate-btn');
        

// Fetch sensor data from the mock API
async function fetchSensorData() {
    try {
        const response = await fetch('http://localhost:3000');
        const data = await response.json();

        // fetch weather data
        temperatureEl.textContent = data.weather.temperature;
        humidityEl.textContent = data.weather.humidity;
        conditionEl.textContent = data.weather.condition;

        // fetch soil data
        soilMoistureEl.textContent = data.soil.moisture;

        // fetch irrigation
        if (data.irrigation.status === 'on') {
            irrigatebtnEl.textContent = 'Stop Irrigation';
            irrigatebtnEl.classList.add('active');
        } else {
            irrigatebtnEl.textContent = 'Start Irrigation';
            irrigatebtnEl.classList.remove('active');
        }
    } catch (error) {
        console.error('Error fetching sensor data:', error);
    }
}

// Toggle irrigation system
async function toggleIrrigation() {
    try {
        const response = await fetch('http://localhost:3000/irrigation', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                status: irrigatebtnEl.classList.contains('active') ? 'off' : 'on',
                last_irrigated: new Date().toISOString().slice(0, 19).replace('T', ' ')
            })
        });

        if (response.ok) {
            fetchSensorData(); // Refresh data after toggling
        } else {
            console.error('Failed to toggle irrigation');
        }
    } catch (error) {
        console.error('Error toggling irrigation:', error);
    }
}

// Event listener for the irrigation button
irrigatebtnEl.addEventListener('click', toggleIrrigation);

// Initial fetch 
fetchSensorData();
setInterval(fetchSensorData, 60000);

// load data from page load
window.onload = fetchSensorData;    


