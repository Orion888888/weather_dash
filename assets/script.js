const cityInput = document.querySelector(".city-input");
const searchBtn = document.querySelector(".search-btn");
const APIkey = "93df8836a72426fc58eb9d014789297b"; //openweathermap API key

const getWeatherDetails = (cityName, lat, lon) => {
    const weatherAPIurl = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt={cnt}&appid=${APIkey}`;
    
    fetch(weatherAPIurl).then(res => res.json()).then(data => {
        //filters the forecast to get only one forecast per day.
        const uniqueForecastDays = [];
        const fiveDaysForecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if(!uniqueForecastDays.includes(forecastDate)) {
                return uniqueForecastDays.push(forecastDate);
            }
      });  

      console.log(fiveDaysForecast);

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
   
    fetch(GEOCODING_API_URL).then(res => res.json()).then(data => {
        if(!data.length) return alert(`No coordinates found for ${cityName}`);
        const { name, lat, lon } = data[0];
        getWeatherDetails(name, lat, lon);
    }).catch(() => {
        alert("An error ocurred while fetching the coordinates!");
    });
}
    
searchBtn.addEventListener("click", getCityCoordinates);