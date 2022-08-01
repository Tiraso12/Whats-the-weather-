var btnEl = document.getElementById('btn');
var apiKey = "60c731acdd16090e93a89f08aee6e2e4";

function getApi(){
    var requestUrl = "https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={apiKey}";

    fetch(requestUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function(data){
        console.log(data);
    })
}

btnEl.addEventListener("click",getApi);