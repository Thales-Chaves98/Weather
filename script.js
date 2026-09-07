//INPUT
const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");

//DOM
const cityName = document.getElementById("city-name");
const countryName = document.getElementById("country");

const temperaturValue = document.getElementById("temperature-value");

const maxTemperatura = document.getElementById("max-temperature");
const minTemperatura = document.getElementById("min-temperature");
const windSpeed = document.getElementById("wind-speed");


searchBtn.addEventListener("click", (e) =>{
    e.preventDefault();
    searchCity();
});

async function searchCity() {
    const city = cityInput.value;

    const location = await getCityLocation(city);

    cityInput.value = "";

    const weather = await getWeather(location.latitude, location.longitude);
    
    displayWeather(weather, location);
}

async function getCityLocation(city) {
    
    try {
        const params = new URLSearchParams({
            name: city,
            count: 1,
            language: "pt",
            format: "json"
        });

        const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${params}`);

        if(!response.ok){
            throw new Error("Erro ao buscar cidade");
        }

        const cityData = await response.json();
        return cityData.results[0];
        
    } catch (error){
        console.log(error);
    }

}

async function getWeather(latitude, longitude) {
    try{
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min`);

        if(!response.ok){
            throw new Error("Erro ao buscar os dados do clima.");
        }
    
        const weatherData = await response.json();
        return weatherData; 
        
    } catch (error) {
        console.log(error);
    }
}

function displayWeather(weather, location){

    cityName.textContent = location.name;
    countryName.textContent = location.country;

    temperaturValue.innerText = weather.current.temperature_2m;
    windSpeed.innerText = weather.current.wind_speed_10m;
    maxTemperatura.innerText = weather.daily.temperature_2m_max[0];
    minTemperatura.innerText = weather.daily.temperature_2m_min[0];
    
}
