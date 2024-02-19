const cityInput = document.querySelector(".city-input");
const searchBtn = document.querySelector(".search-btn");
const APIkey = "93df8836a72426fc58eb9d014789297b"; //openweathermap API key

//method getCityCoordinates is declared and trim removes extra spaces.
//returns if cityName is empty.
const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();
    if (!cityName) return;
    const GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${APIkey}`
   
    
}
    
searchBtn.addEventListener("click", getCityCoordinates);