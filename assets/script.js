const cityInput = document.querySelector(".city-input");
const searchBtn = document.querySelector(".search-btn");
const locationBtn = document.querySelector(".location-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".weather-cards");

const APIkey = "93df8836a72426fc58eb9d014789297b"; //openweathermap API key


const createWeatherCard = (cityName, weatherItem, index) => {
    //HTML for the main weather card
    if(index === 0) {
        return `<div class="details">
        <h2 class="city">${cityName}</h2>
        <h4 class="date">(${weatherItem.dt_txt.split(" ")[0]})</h4>
        <h4 class="temp">Temp: ${(weatherItem.main.temp).toFixed(2)}°F</h4>
        <h4 class="humidity">Humidity: ${weatherItem.main.humidity}%</h4>
        <h4 class="wind">Wind: ${weatherItem.wind.speed}M/S</h4>
    </div>
    <div calss="icon">
    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
    <h4>${weatherItem.weather[0].description}</h4>
    </div>`;
    
    // HTML for the 5-Day forecast
    } else {
          return `<li class="card">
                <h3 class="date">(${weatherItem.dt_txt.split(" ")[0]})</h3>
                <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather-icon">
                <h4 class="temp">Temp: ${(weatherItem.main.temp).toFixed(2)}°F</h4>
                <h4 class="humidity">Humidity: ${weatherItem.main.humidity}%</h4>
                <h4 class="wind">Wind: ${weatherItem.wind.speed}M/S</h4>
            </li>`;  
    }
}

const getWeatherDetails = (cityName, lat, lon) => {
    const weatherAPIurl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIkey}&units=imperial`;
    
    fetch(weatherAPIurl).then(res => res.json()).then(data => {
        //filters the forecast to get only one forecast per day.
        const uniqueForecastDays = [];
        const fiveDaysForecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if(!uniqueForecastDays.includes(forecastDate)) {
                return uniqueForecastDays.push(forecastDate);
            }
      });  

    // this will clear previous weather data
    cityInput.value = "";
    currentWeatherDiv.innerHTML = "";
    weatherCardsDiv.innerHTML = "";

      // creating weather cards and adding them to the DOM
      fiveDaysForecast.forEach((weatherItem, index) => {
        if (index === 0) {
            currentWeatherDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
        } else {
            weatherCardsDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
        }
      });
    }).catch(() => {
        alert("An error ocurred while fetching the weather forecast!");
    });
}


//method getCityCoordinates is declared and trim removes extra spaces.
//returns if cityName is empty.
const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();
    if (!cityName) return;

        // Save to local storage
        let cities = JSON.parse(localStorage.getItem('searchedCities')) || [];
        if (!cities.includes(cityName)) {
            if (cities.length >= 10) { // Limit to 10 cities
                cities.shift(); // Remove the oldest city
            }
            cities.push(cityName);
            localStorage.setItem('searchedCities', JSON.stringify(cities));
            displaySearchedCities();
        }

    const GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${APIkey}&units=imperial`
   
    // get city coordinates (latitude, longitude, and name) from API response
    fetch(GEOCODING_API_URL).then(res => res.json()).then(data => {
        if(!data.length) return alert(`No coordinates found for ${cityName}`);
        const { name, lat, lon } = data[0];
        getWeatherDetails(name, lat, lon);
    }).catch(() => {
        alert("An error ocurred while fetching the coordinates!");
    });
}

const getUserCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude } = position.coords;
            const REVERSE_GEOLOCATION_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${APIkey}&units=imperial`;
            
            // city name from coordinates using reverse geocoding API
            fetch(REVERSE_GEOLOCATION_URL).then(res => res.json()).then(data => {
                const { name } = data[0];
                getWeatherDetails(name, latitude, longitude);
            }).catch(() => {
                alert("An error ocurred while fetching the city!");
            });
        },
        // shows alert if denied location permission
        error => {
            if(error.code === error.PERMISSION_DENIED) {
                alert("Geolocation request denied. Please reset location permission to grant access again.");
            }
        }
    );
}

const displaySearchedCities = () => {
    const container = document.querySelector('.search-history-container');
    container.innerHTML = ''; // Clear existing buttons
    const cities = JSON.parse(localStorage.getItem('searchedCities')) || [];

    cities.forEach(city => {
        const button = document.createElement('button');
        button.textContent = city;
        button.classList.add('city-button'); // Add any required CSS classes
        button.addEventListener('click', () => {
            cityInput.value = city; // Set the input value to the city name
            getCityCoordinates(); // Fetch weather details for this city
        });
        container.appendChild(button);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    displaySearchedCities();
});

locationBtn.addEventListener("click", getUserCoordinates);
searchBtn.addEventListener("click", getCityCoordinates);
cityInput.addEventListener("keyup", e => e.key === "Enter" && getCityCoordinates());
