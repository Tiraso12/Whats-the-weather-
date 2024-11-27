let buttonElement = document.getElementById('btn');
let apiKey = "60c731acdd16090e93a89f08aee6e2e4";
let cityEl = document.querySelector('#city');
let futureForecasts = [];

let cityName = document.getElementById('cityName');
let cityTemperature = document.getElementById('weather_temperature');
let cityIcon = document.getElementById('weather_icon');






async function getCity() {
    // let apiUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + cityEl.value + "&limit=1&appid=" + apiKey;
    let apiUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + 'orlando' + "&limit=1&appid=" + apiKey;

    try {
        const response = await fetch(apiUrl);
        if(!response.ok){
            throw new Error('Location Not Found');
        }
        const data = await response.json();
        let cityLat = data[0].lat;
        let cityLon = data[0].lon;

        
            getWeather(cityLat, cityLon);
            
        } catch (error) {
            console.error(error);
        }
    }


 async function getWeather(lat, lon) { 
        const requestUrl = "https://api.openweathermap.org/data/2.5/weather?lat="+lat+ "&lon="+lon+"&appid=" + apiKey + "&units=imperial";
    
        try {
            const response = await fetch(requestUrl);
            if(!response.ok){
                const errorMessage = await response.text();
                throw new Error(`Weather Not Found: ${errorMessage}`);
            }
            const data = await response.json();
            console.log(data);
            return displayWeather(data);
            
        } catch (error) {
            console.error(error);
        }
    }

function displayWeather(data) {
    cityName.textContent = data.name;    
    cityTemperature.textContent = data.main.temp + "°F";
    cityIcon.src = "http://openweathermap.org/img/wn/" + data.weather[0].icon +"@2x.png";



}



function fetchFutureForecast(latitude, longitude) {
    var requestUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + latitude + "&lon=" + longitude + "&units=imperial&appid=" + apiKey;
    fetch(requestUrl)
        .then(function (response) {
            if (!response.ok) {
                throw new Error('Forecast Not Found');
            }
            return response.json();
        })
        .then(function (data) {
            futureForecasts = data.list;
        })
        .catch(function (error) {
            console.error(error);
        });
}

buttonElement.addEventListener("click", getCity);
// getCity();