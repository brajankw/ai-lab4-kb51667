const API_KEY = "7ded80d91f2b280ec979100cc8bbba94";
const WEATHER_URL = `https://api.openweathermap.org/data/2.5/weather?q={query}&appid={apiKey}&units=metric&lang=pl`;
const FORECAST_URL = `https://api.openweathermap.org/data/2.5/forecast?q={query}&appid={apiKey}&units=metric&lang=pl`;

const WeatherApp = class {
    constructor() {
        this.weather = [];
    }
    
    fetchCurrentWeather() {
        var location = document.getElementById("search-input").value;
        if (location == "") {
            alert("you must provide city and country eg. Warszawa, Poland");
            return;
        }
        var currentWeatherUrl = this.createUrlWithApiKeyAndLocation(WEATHER_URL, location);
        var weatherData;
        (async () => {
            let response = await new Promise(resolve => {
               var req = new XMLHttpRequest();
               req.open("GET", currentWeatherUrl, true);
               req.onload = function(e) {
                    weatherData = JSON.parse(req.response);
                    console.log(weatherData);
                    resolve(req.response);
               };
               req.onerror = function () {
                    resolve(undefined);
                console.error("** An error occurred during the XMLHttpRequest");
               };
               req.send();
            })
            this.weather.push(weatherData);
            this.fetchForecastWeather();
         })()
    }

    fetchForecastWeather() {
        var location = document.getElementById("search-input").value;
        console.log(location);
        var url = this.createUrlWithApiKeyAndLocation(FORECAST_URL, location);
        fetch(url)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                console.log(data);
                data.list.forEach(element => {
                    this.weather.push(element);
                });
                this.displayWeather();
            })
        ;
    }

    createUrlWithApiKeyAndLocation(url, location) {
        return url.replace("{apiKey}", API_KEY).replace("{query}", location);
    }

    displayWeather() {
        var weatherContainer = document.getElementById("results");
        weatherContainer.innerHTML = '';
        console.log(weatherContainer);
        console.log(this.weather.length);
        this.weather.forEach(element => {
            const date = new Date(element.dt * 1000);
            const weatherBlock = this.createWeatherDiv(
                `${date.toLocaleDateString("pl-PL")} ${date.toLocaleTimeString("pl-PL")}`,
                element.main.temp,
                element.main.feels_like,
                element.weather[0].description
            );
            weatherContainer.appendChild(weatherBlock);
        });
    }

    createWeatherDiv(dateString, temperature, feelsLikeTemperature, description) {
        const weatherBlock = document.createElement("div");
        weatherBlock.className = "weather-block";
        const dateBlock = document.createElement("div");
        dateBlock.className = "weather-date";
        dateBlock.innerHTML = `<h2> ${dateString} </h2>`;
        weatherBlock.appendChild(dateBlock);
        const temperatureBlock = document.createElement("div");
        temperatureBlock.className = "weather-temperature";
        temperatureBlock.innerHTML = `Temperatura: ${temperature} &deg;C`
        weatherBlock.appendChild(temperatureBlock);
        const temperatureFeelBlock = document.createElement("div");
        temperatureFeelBlock.className = "weather-temperature-feels-like";
        temperatureFeelBlock.innerHTML = `Temperatura odczuwalna: ${feelsLikeTemperature} &deg;C`
        weatherBlock.appendChild(temperatureFeelBlock);
        const descriptionBlock = document.createElement("div");
        descriptionBlock.className = "weather-description";
        descriptionBlock.innerHTML = description;
        weatherBlock.appendChild(descriptionBlock);
    
        return weatherBlock;
    }

}

document.weatherApp = new WeatherApp();

document.querySelector("#search").addEventListener("click", function() {
    const query = document.querySelector("#search-input").value;
    document.weatherApp.fetchCurrentWeather();
    document.weatherApp.weather.length = 0;
})