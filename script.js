const apiKey = "e599ca088590a5f97cfc53ab39f9b"; // ← তোমার Default key এখানে (অথবা Weather 1 key: 455a921715b366d648a4f1364a2dc15)
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const weatherInfo = document.getElementById("weatherInfo");
const errorMessage = document.getElementById("errorMessage");

async function checkWeather(city) {
  try {
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
    
    if (response.status == 404) {
      errorMessage.style.display = "block";
      errorMessage.innerHTML = "City not found 😕";
      weatherInfo.style.display = "none";
      return;
    }

    const data = await response.json();

    errorMessage.style.display = "none";
    weatherInfo.style.display = "block";

    document.querySelector(".weather-info h2").innerHTML = Math.round(data.main.temp) + "°C";
    document.querySelector(".weather-info h3").innerHTML = data.name;
    
    const iconCode = data.weather[0].icon;
    document.querySelector(".weather-info img").src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    
    document.querySelector(".weather-info p").innerHTML = data.weather[0].description;

    document.querySelector(".humidity span").innerHTML = data.main.humidity + "%";
    document.querySelector(".wind span").innerHTML = data.wind.speed + " km/h";

  } catch (error) {
    errorMessage.style.display = "block";
    errorMessage.innerHTML = "Something went wrong! Check internet or API key.";
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

// Default: Sylhet (তোমার লোকেশন!)
checkWeather("Sylhet");
