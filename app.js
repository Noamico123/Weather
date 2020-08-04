// api key : 82005d27a116c2880c8f0fcb866998a0

//SELECT elements
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");
const notificationElement = document.querySelector(".notification");
const currentBtn = document.querySelector(".current-btn");
const searchBox = document.querySelector('.search-box');
const container = document.querySelector(".container");
searchBox.addEventListener('keypress', setQuery);

//App data
const weather = {};

weather.temperature = {
    unit: "celsius",
}

const KELVIN = 273;
const api = {
    key: "69084799e3c8d5f60f7416fc1193da6f",
    base: "https://api.openweathermap.org/data/2.5/weather?"
}

//Check if browser support geolocation
if('geolocation' in navigator){
    navigator.geolocation.getCurrentPosition(setPosition, showError);
}
else{
    notificationElement.style.display = "block";
    notificationElement.innerHTML = "<p>Browser doesnt support GeoLocation</p>"
}

//set users position
function setPosition(position){
    let lat = position.coords.latitude;
    let long = position.coords.longitude;
    getWeather(lat,long);
}

//geolocation error
function showError(error){
    notificationElement.style.display = "block";
    notificationElement.innerHTML = `<p> ${error.message} </p>`;
}

function getWeather(lat,long){
    console.log(api.base + api.key);
    fetch(`${api.base}lat=${lat}&lon=${long}&appid=${api.key}`)
        .then(function(response){
            let data = response.json();
            return data;
        })
        .then(function(data){
            weather.temperature.value = Math.floor(data.main.temp - KELVIN);
            weather.description = data.weather[0].description;
            weather.iconId = data.weather[0].icon;
            weather.city = data.name;
            weather.country = data.sys.country;
            })
            .then(function(){
                displayWeather();
        });
}

function setQuery(evt) {
    if(evt.keyCode == 13) {
        getResults(searchBox.value);
        console.log(searchBox.value);
    }
}

function getResults(query) {
    fetch(`${api.base}q=${query}&units=metric&appid=${api.key}`)
        .then(weatherSearch => {return weatherSearch.json();
            }).then(displaySearch);
}

//display weather
function displayWeather(){
    setAll();
    backgroundChanger();
}

function displaySearch(weatherSearch) {
    weather.temperature.value = Math.floor(weatherSearch.main.temp);
    weather.description = weatherSearch.weather[0].description;
    weather.iconId = weatherSearch.weather[0].icon;
    weather.city = weatherSearch.name;
    weather.country = weatherSearch.sys.country;
    setAll();
    backgroundChanger();
}

function backgroundChanger(){
    let day = "url('background/day.png')";
    let night = "url('background/night.png')";
    let str = "";
    `${weather.iconId}`.charAt(2) == 'd' ? str += day : str += night;
    container.style['background-image'] = str;
    console.log(str);
}

function setAll(){
    iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
    tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    descElement.innerHTML = weather.description;
    locationElement.innerHTML = `${weather.city}, ${weather.country}`;
}

//c to f
function cToF(temperature){
    return (temperature * 9/5) + 32;
}
tempElement.addEventListener("click", function(){
    if(weather.temperature.value === undefined) return;
    if(weather.temperature.unit == 'celsius') {
        let fahrenheit = cToF(weather.temperature.value);
        fahrenheit = Math.floor(fahrenheit);
        tempElement.innerHTML = `${fahrenheit}°<span>F</span>`;
        weather.temperature.unit = "fahrenheit";
    }
    else{
        tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
        weather.temperature.unit = "celsius";
    }
})

currentBtn.addEventListener("click", function(){
    if('geolocation' in navigator){
        navigator.geolocation.getCurrentPosition(setPosition, showError);
    }
    else{
        notificationElement.style.display = "block";
        notificationElement.innerHTML = "<p>Browser doesnt support GeoLocation</p>"
    }
})