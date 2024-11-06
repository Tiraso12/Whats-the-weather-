var btnEl = document.getElementById('btn');
var apiKey = "60c731acdd16090e93a89f08aee6e2e4";
var cityName;
var cityEl = document.querySelector('#city');
var futureForecast = [];



async function getCity() {
    let apiUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + cityEl.value + "&limit=1&appid=" + apiKey;

    try {
        const response = await fetch(apiUrl);
        if(!response.ok){
            throw new Error('Location Not Found');
        }
        const data = await response.json();
        let cityLat = data[0].lat;
        let cityLon = data[0].lon;
         cityLat = cityLat.toString();
         cityLon = cityLon.toString();

        
        getWeather(cityLat, cityLon);
        
    } catch (error) {
        console.error(error);
    }

    async function getWeather(lat, lon) { 
        const requestUrl = "https://api.openweathermap.org/data/2.5/weather?lat="+lat+ "&lon="+lon+"&appid=" + apiKey;

        console.log(requestUrl);
        


        try {
            const response = await fetch(requestUrl);
            if(!response.ok){
                const errorMessage = await response.text();
                throw new Error(`Weather Not Found: ${errorMessage}`);
            }
            const data = await response.json();
            console.log(data);
            return data;
            
        } catch (error) {
            console.error(error);
        }
    }


    fetch(apiUrl)
        .then((response) => {
            if (response.ok) {
                response.json()
                    .then(function (data) {
                        var latitude = data[0].lat;
                        var longitude = data[0].lon;
                        cityName = data[0].name;
                        var latitude = latitude.toString();
                        var longitude = longitude.toString();
                        futureApi(latitude, longitude);
                    });
            } else {
                alert("Location Not Found");
            }
        })
}

function futureApi(latitude, longitude) {
    var requestUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + latitude + "&lon=" + longitude + "&units=imperial&appid=" + apiKey;
    fetch(requestUrl).then(function (response) {
        response.json().then(function (data) {
            futureForecast = data.list;

            createFuture(futureForecast);
        })
    });
}

btnEl.addEventListener("click", getCity);
// getCity();