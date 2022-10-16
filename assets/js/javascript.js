var btnEl = document.getElementById('btn');
var apiKey = "60c731acdd16090e93a89f08aee6e2e4";
var cityName;
var cityEl = document.querySelector('#city');
var futureForecast = [];



function getCity() {
    var apiUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + cityEl.value + "&limit=1&appid=" + apiKey;

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
                        getApi(latitude, longitude);
                        futureApi(latitude, longitude);
                    });
            } else {
                alert("Location Not Found");
            }
        })
};

function getApi(latitude, longitude) {
    var requestUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&exclude={part}&appid=" + apiKey;

    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var imgCode = "http://openweathermap.org/img/wn/" + data.current.weather[0].icon + ".png";
            document.querySelector('#cityName').innerHTML = "City: " + " " + cityName;
            document.querySelector("#img").setAttribute("src", imgCode);
            document.querySelector('#tem').innerHTML = "Temperature: " + " " + data.current.temp + "°F";
            document.querySelector('#hum').innerHTML = "Humidity: " + " " + data.current.humidity + "%";
            document.querySelector('#wind').innerHTML = "Wind: " + " " + data.current.wind_speed + " MPH";
            document.querySelector('#uv').innerHTML = "UV index: " + " " + data.current.uvi;

        })
};

function futureApi(latitude, longitude) {
    var requestUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + latitude + "&lon=" + longitude + "&units=imperial&appid=" + apiKey;
    fetch(requestUrl).then(function (response) {
        response.json().then(function (data) {
            futureForecast = data.list;

            createFuture(futureForecast);
        })
    });
}

function createFuture(futureForecast) {
    console.log(futureForecast);
    for (let i = 0; i< 5; i++) {
       
        
        var col = $("<div></div>");
    
        var cityTitle = $('<h4></h4>');
        cityTitle.attr("id", "cityName");
        cityTitle.text("City:");
    
        var image = $('<img></img>');
        var imgCode = "http://openweathermap.org/img/wn/" + futureForecast[i].weather[0].icon + ".png";
        image.attr({ src: imgCode, id: "img" });
    
        var temp = $('<p></p>');
        temp.attr('id', "temp").text('Temperature: '+futureForecast[i].main.temp+'');
        
    
        var hum = $('<p></p>');
        hum.attr('id', '').text('Humidity:');
    
        var wind = $('<p></p>');
        wind.attr('id', '').text('Wind:',);
    
        var uvi = $('<p></p>');
        uvi.attr('id', '').text('Uv index:');
    
    
    
    
    
        col.append(cityTitle)
        col.append(image);
        col.append(temp);
        col.append(hum);
        col.append(wind);
        col.append(uvi);
        $("#future").append(col)
        
    }
}

btnEl.addEventListener("click", getCity);