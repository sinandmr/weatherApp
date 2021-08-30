'use strict';
const searchInput = document.querySelector('#search');
const searchBtn = document.querySelector('.choose-city');
const tempText = document.querySelector('.temp-info');
const cloudImage = document.querySelector('.weather-image');
const weatherInfo = document.querySelector('.weather-info');
const cityName = document.querySelector('.city-info');
const apiKey = '41359b20d208e746135272a023315b3b';
const days = document.querySelectorAll('.day');

function kelvintoCelsius(kelvin) {
  return Math.floor(kelvin - 273);
}

// Find user location
navigator.geolocation.getCurrentPosition(function (position) {
  let lat = position.coords.latitude.toFixed(4);
  let lon = position.coords.longitude.toFixed(4);
  getUserWeatherData(lat, lon);
  fetchLocationName(lat, lon);
});

async function getUserWeatherData(lat, lon) {
  const data = await fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${apiKey}`
  )
    .then(res => res.json())
    .then(data => {
      // Current day data
      tempText.textContent = kelvintoCelsius(data.current.temp) + '°C';
      weatherInfo.textContent = data.current.weather[0].description;
      cloudImage.src = `src/png/${data.current.weather[0].main}.png`;

      // Week data
      days.forEach((day, index) => {
        day.querySelector(
          '.day-photo'
        ).src = `src/png/${data.daily[index].weather[0].main}.png`;
        day.querySelector('.day-temp').textContent = `${kelvintoCelsius(
          data.daily[index].temp.min
        )}/${kelvintoCelsius(data.daily[index].temp.max)}`;
      });
    });
}

const fetchLocationName = async (lat, lon) => {
  await fetch(
    `https://www.mapquestapi.com/geocoding/v1/reverse?key=${mapQuestApi}&location=${lat}%2C${lon}&outFormat=json&thumbMaps=false`
  )
    .then(res => res.json())
    .then(data => {
      cityName.textContent = data.results[0].locations[0].adminArea5;
    });
};

// if a query is made with the entered data, these parts will work.
const getCityLocation = city => {
  return fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
  )
    .then(res => res.json())
    .then(data => {
      cityName.textContent = data.name;
      getUserWeatherData(data.coord.lat, data.coord.lon);
    });
};

searchBtn.addEventListener('click', e => {
  e.preventDefault();
  getCityLocation(searchInput.value);
  searchInput.value = '';
});

window.addEventListener('keypress', e => {
  if (e.key === 'Enter') {
    getCityLocation(searchInput.value);
    searchInput.value = '';
  }
});
