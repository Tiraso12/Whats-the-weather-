document.addEventListener('DOMContentLoaded', () => {
    const apiKey = "60c731acdd16090e93a89f08aee6e2e4"; // <-- IMPORTANT: REPLACE WITH YOUR KEY
    const cityInput = document.getElementById('city-input');
    const searchButton = document.getElementById('search-button');

    const locationEl = document.getElementById('location');
    const temperatureEl = document.getElementById('temperature');
    const conditionEl = document.getElementById('condition');
    const highLowEl = document.getElementById('high-low');
    const currentWeatherIconEl = document.getElementById('current-weather-icon');

    const hourlyForecastItemsEl = document.getElementById('hourly-forecast-items');
    const dailyForecastItemsEl = document.getElementById('daily-forecast-items');

    const mainWeatherInfoEl = document.querySelector('.main-weather-info');
    const forecastContainerEl = document.querySelector('.forecast-container');
    const errorMessageEl = document.getElementById('error-message');

    // --- Event Listeners ---
    searchButton.addEventListener('click', handleSearch);
    cityInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    });

    function handleSearch() {
        const city = cityInput.value.trim();
        if (city) {
            fetchWeatherData(city);
        } else {
            displayError("Please enter a city name.");
        }
    }

    // --- API Fetching ---
    async function fetchWeatherData(city) {
        hideError();
        showLoadingPlaceholders(); // Optional: show some loading state

        const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`; // or imperial for Fahrenheit
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

        try {
            const [currentWeatherResponse, forecastResponse] = await Promise.all([
                fetch(currentWeatherUrl),
                fetch(forecastUrl)
            ]);

            if (!currentWeatherResponse.ok) {
                const errorData = await currentWeatherResponse.json();
                throw new Error(errorData.message || `City not found or API error (${currentWeatherResponse.status})`);
            }
            if (!forecastResponse.ok) {
                const errorData = await forecastResponse.json();
                throw new Error(errorData.message || `Forecast data not found or API error (${forecastResponse.status})`);
            }

            const currentWeatherData = await currentWeatherResponse.json();
            const forecastData = await forecastResponse.json();

            displayCurrentWeather(currentWeatherData);
            displayHourlyForecast(forecastData);
            displayDailyForecast(forecastData);

            mainWeatherInfoEl.classList.remove('hidden');
            forecastContainerEl.classList.remove('hidden');

        } catch (error) {
            console.error("Error fetching weather data:", error);
            displayError(error.message);
            mainWeatherInfoEl.classList.add('hidden');
            forecastContainerEl.classList.add('hidden');
        }
    }

    // --- UI Display Functions ---
    function displayCurrentWeather(data) {
        locationEl.textContent = `${data.name}, ${data.sys.country}`;
        temperatureEl.textContent = `${Math.round(data.main.temp)}°`;
        conditionEl.textContent = data.weather[0].description;
        currentWeatherIconEl.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        currentWeatherIconEl.alt = data.weather[0].description;

        // For High/Low, we'll use today's forecast data later, but for now, current data
        highLowEl.textContent = `H:${Math.round(data.main.temp_max)}° L:${Math.round(data.main.temp_min)}°`;
    }

    function displayHourlyForecast(data) {
        hourlyForecastItemsEl.innerHTML = ''; // Clear previous items
        const first8Forecasts = data.list.slice(0, 8); // Get next 24 hours (8 * 3-hour intervals)

        first8Forecasts.forEach(item => {
            const date = new Date(item.dt * 1000);
            const hour = date.toLocaleTimeString([], { hour: 'numeric', hour12: true }).replace(' ', '').toUpperCase();

            const hourlyItem = `
                <div class="hourly-item">
                    <div class="time">${hour}</div>
                    <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="${item.weather[0].description}">
                    <div class="temp">${Math.round(item.main.temp)}°</div>
                </div>
            `;
            hourlyForecastItemsEl.innerHTML += hourlyItem;
        });
    }

    function displayDailyForecast(data) {
        dailyForecastItemsEl.innerHTML = ''; // Clear previous items

        // Group forecasts by day
        const dailyData = {};
        data.list.forEach(item => {
            const date = new Date(item.dt * 1000);
            const dayKey = date.toISOString().split('T')[0]; // YYYY-MM-DD

            if (!dailyData[dayKey]) {
                dailyData[dayKey] = {
                    temps: [],
                    icons: [],
                    descriptions: [],
                    dateObj: date
                };
            }
            dailyData[dayKey].temps.push(item.main.temp);
            dailyData[dayKey].icons.push(item.weather[0].icon);
            dailyData[dayKey].descriptions.push(item.weather[0].description);
        });

        // Get min/max for each day and a representative icon (e.g., midday or most frequent)
        let dayCount = 0;
        for (const dayKey in dailyData) {
            if (dayCount >= 7) break; // Limit to 7 days

            const dayInfo = dailyData[dayKey];
            const minTemp = Math.round(Math.min(...dayInfo.temps));
            const maxTemp = Math.round(Math.max(...dayInfo.temps));
            // Simplistic icon choice: use the icon from around midday if available, or first one
            const representativeIcon = dayInfo.icons[Math.floor(dayInfo.icons.length / 2)] || dayInfo.icons[0];
            const representativeDescription = dayInfo.descriptions[Math.floor(dayInfo.descriptions.length / 2)] || dayInfo.descriptions[0];

            const dayName = dayCount === 0 ? "Today" : dayInfo.dateObj.toLocaleDateString([], { weekday: 'short' });

            const dailyItem = `
                <div class="daily-item">
                    <span class="day">${dayName}</span>
                    <img src="https://openweathermap.org/img/wn/${representativeIcon}.png" alt="${representativeDescription}">
                    <span class="temp-range">H:${maxTemp}° L:${minTemp}°</span>
                </div>
            `;
            dailyForecastItemsEl.innerHTML += dailyItem;
            dayCount++;
        }
        // Update current day's H/L in main display if possible
        if (dailyData[Object.keys(dailyData)[0]]) {
             const todayInfo = dailyData[Object.keys(dailyData)[0]];
             const todayMin = Math.round(Math.min(...todayInfo.temps));
             const todayMax = Math.round(Math.max(...todayInfo.temps));
             highLowEl.textContent = `H:${todayMax}° L:${todayMin}°`;
        }
    }

    function displayError(message) {
        errorMessageEl.textContent = message;
        errorMessageEl.classList.remove('hidden');
    }

    function hideError() {
        errorMessageEl.classList.add('hidden');
    }

    function showLoadingPlaceholders() {
        // You can make this more sophisticated with actual shimmer effects
        locationEl.textContent = "Loading...";
        temperatureEl.textContent = "--°";
        conditionEl.textContent = "--";
        highLowEl.textContent = "H:--° L:--°";
        currentWeatherIconEl.src = "";
        hourlyForecastItemsEl.innerHTML = '<div class="hourly-item">...</div>'.repeat(5);
        dailyForecastItemsEl.innerHTML = '<div class="daily-item">Loading...</div>'.repeat(5);
    }

    // Optional: Load a default city on startup
    // fetchWeatherData("London"); 
});