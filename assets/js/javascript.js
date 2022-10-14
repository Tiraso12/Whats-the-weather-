var btnEl = document.getElementById('btn');
var apiKey = "60c731acdd16090e93a89f08aee6e2e4";
var cityName;
var cityEl = document.querySelector('#city');



function getCity() {
    var apiUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + cityEl.value + "&limit=1&appid=" + apiKey;

    fetch(apiUrl)
        .then((response) => {
            if (response.ok) {
                response.json()
                    .then(function (data) {
                        console.log(data);
                        var latitude = data[0].lat;
                        var longitude = data[0].lon;
                        cityName = data[0].name;
                        var latitude = latitude.toString();
                        var longitude = longitude.toString();
                        console.log(latitude, longitude);
                        getApi(latitude, longitude);
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
            console.log(data);
            console.log(cityName);
            document.querySelector('#cityName').innerHTML ="City: " +" "+ cityName;

        })
};

btnEl.addEventListener("click", getCity);