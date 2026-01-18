// Improved script.js — replace YOUR_API_KEY_HERE with a valid OpenWeatherMap API key
const apiKey = "YOUR_API_KEY_HERE"; // 
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const weatherInfo = document.getElementById("weatherInfo");
const errorMessage = document.getElementById("errorMessage");

// Hide weather box initially
weatherInfo.style.display = "none";

async function checkWeather(city) {
  try {
    const url = apiUrl + encodeURIComponent(city) + `&appid=${apiKey}`;
    const response = await fetch(url);

    if (!response.ok) {
      // handle common HTTP errors
      if (response.status === 401) {
        errorMessage.style.display = "block";
        errorMessage.innerText = "Invalid API key (401). Check your API key.";
      } else if (response.status === 404) {
        errorMessage.style.display = "block";
        errorMessage.innerText = "City not found 😕";
      } else {
        errorMessage.style.display = "block";
        errorMessage.innerText = `Request failed: ${response.status} ${response.statusText}`;
      }
      weatherInfo.style.display = "none";
      return;
    }

    const data = await response.json();

    // extra guard: make sure data has expected fields
    if (!data || !data.main) {
      throw new Error("Unexpected API response");
    }

    errorMessage.style.display = "none";
    weatherInfo.style.display = "block";

    document.querySelector(".weather-info h2").innerHTML = Math.round(data.main.temp) + "°C";
    document.querySelector(".weather-info h3").innerHTML = data.name;

    const iconCode = data.weather && data.weather[0] ? data.weather[0].icon : null;
    if (iconCode) {
      document.querySelector(".weather-info img").src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
      document.querySelector(".weather-info img").alt = data.weather[0].description || "weather icon";
    } else {
      document.querySelector(".weather-info img").src = "";
      document.querySelector(".weather-info img").alt = "";
    }

    document.querySelector(".weather-info p").innerHTML = data.weather && data.weather[0] ? data.weather[0].description : "";

    document.querySelector(".humidity span").innerHTML = (data.main.humidity !== undefined) ? data.main.humidity + "%" : "-";
    document.querySelector(".wind span").innerHTML = (data.wind && data.wind.speed !== undefined) ? data.wind.speed + " km/h" : "-";

  } catch (error) {
    console.error("checkWeather error:", error);
    errorMessage.style.display = "block";
    errorMessage.innerText = "Something went wrong! Check internet or API key. (" + (error.message || "") + ")";
    weatherInfo.style.display = "none";
  }
}

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city === "") {
    errorMessage.style.display = "block";
    errorMessage.innerHTML = "Please enter a city name!";
    return;
  }
  checkWeather(city);
});

cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchBtn.click();
  }
});

// Default: Sylhet
checkWeather("Sylhet");
