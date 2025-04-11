function formatShortDate(isoString) {
  return new Date(isoString).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "2-digit",
  });
}

const OPEN_WEATHER_API_KEY = "e79078fbe942363b4b6bbbb537366bfa";
const API_URL = `https://api.openweathermap.org/data/2.5/weather`;

const app = document.getElementById("app");
const date = document.getElementById("date");
const newDate = formatShortDate(new Date());
const search = document.getElementById("searchIcon");
const city = document.getElementById("city");
const temp = document.getElementById("temp");
const tempImg = document.getElementById("tempImage");
const description = document.getElementById("description");
const tempMax = document.getElementById("tempMax");
const tempMin = document.getElementById("tempMin");

date.innerHTML = newDate;

const getWeather = async () => {
  const cityName = document.getElementById("searchBarinput").value;
  try {
    const response = await fetch(
      `${API_URL}?q=${cityName}&units=metric&APPID=${OPEN_WEATHER_API_KEY}`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );
    const weatherData = await response.json();
    console.log(weatherData);
    city.innerHTML = `${weatherData.name}`;
    description.innerHTML = `${weatherData.weather[0].main}`;
    tempImg.innerHTML = `<img src="http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png" />`;
    temp.innerHTML = `<h2>${Math.round(weatherData.main.temp)}ºC</h2>`;
    tempMax.innerHTML = `${weatherData.main.temp_max}ºC`;
    tempMin.innerHTML = `${weatherData.main.temp_min}ºC`;
  } catch (error) {
    console.log(error);
  }
};

search.addEventListener("click", getWeather);
