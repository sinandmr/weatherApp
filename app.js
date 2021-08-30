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

async function fetchData(city) {
  let lat, lon;
  const currentDay = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
  )
    .then(res => res.json())
    .then(info => {
      lat = info.coord.lat;
      lon = info.coord.lon;
      cityName.textContent = info.name;
      tempText.textContent = kelvintoCelsius(info.main.temp) + '°C';
      weatherInfo.textContent = info.weather[0].description;
      cloudImage.src = `src/png/${info.weather[0].main}.png`;
    });

  const getInfo = await fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${apiKey}`
  )
    .then(res => res.json())
    .then(info => {
      days.forEach((day, index) => {
        day.querySelector(
          '.day-photo'
        ).src = `src/png/${info.daily[index].weather[0].main}.png`;
        day.querySelector('.day-temp').textContent = `${kelvintoCelsius(
          info.daily[index].temp.min
        )}/${kelvintoCelsius(info.daily[index].temp.max)}`;
      });
    });
}
searchBtn.addEventListener('click', e => {
  e.preventDefault();
  fetchData(searchInput.value);
});
window.addEventListener('keypress', e => {
  if (e.key === 'Enter') {
    fetchData(searchInput.value);
  }
});
