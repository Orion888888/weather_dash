const cityInput = document.querySelector(".city-input");
const searchBtn = document.querySelector(".search-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".weather-cards");

const APIkey = "93df8836a72426fc58eb9d014789297b"; //openweathermap API key

const createWeatherCard = (weatherItem) => {
    return `<li class="card">
                <h3 class="date">(${weatherItem.dt_txt.split(" ")[0]})</h3>
                <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0]}@2x.png" alt="weather-icon">
                <h4 class="temp">Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}C</h4>
                <h4 class="humidity">Humidity: ${weatherItem.main.humidity}%</h4>
                <h4 class="wind">Wind: ${weatherItem.wind.speed}M/S</h4>
            </li>`;
}

const getWeatherDetails = (cityName, lat, lon) => {
    const weatherAPIurl = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIkey}`;
    
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
    weatherCardsDiv.innerHTML = "";

      console.log(fiveDaysForecast);
      fiveDaysForecast.forEach((weatherItem, index) => {
        if (index === 0) {
            weatherCardsDiv.insertAdjacentHTML("beforeend", createWeatherCard(weatherItem));
        } else {
            weatherCardsDiv.insertAdjacentHTML("beforeend", createWeatherCard(weatherItem));
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
    const GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${APIkey}`
   
    // get city coordinates (latitude, longitude, and name) from API response
    fetch(GEOCODING_API_URL).then(res => res.json()).then(data => {
        if(!data.length) return alert(`No coordinates found for ${cityName}`);
        const { name, lat, lon } = data[0];
        getWeatherDetails(name, lat, lon);
    }).catch(() => {
        alert("An error ocurred while fetching the coordinates!");
    });
}
    
searchBtn.addEventListener("click", getCityCoordinates);