document.addEventListener("DOMContentLoaded", () => {
  var apiKey = "afbfa8ef52bbf8f96d3252975a945fb3";

  var cityInputEl = document.getElementById('city');
  var searchBtn = document.getElementById('search-btn');
  var cityHeaderEl = document.getElementById('city-date');
  var currentIconEl = document.getElementById('current-icon');
  var currentTempEl = document.getElementById('current-temp');
  var currentWindEl = document.getElementById('current-wind');
  var currentHumidityEl = document.getElementById('current-humidity');
  var dateEl = document.querySelectorAll('#date');
  var iconEl = document.querySelectorAll('#icon-image');
  var tempEl = document.querySelectorAll('#temp');
  var windEl = document.querySelectorAll('#wind');
  var humidityEl = document.querySelectorAll('#humidity');

  function formSubmitHandler(event) {
    event.preventDefault();

    var city = cityInputEl.value.trim();

    if(city) {
      city = city.split(' ').join('');
      console.log(city);
      fetchCityCoords(city);
    }
    cityInputEl.value = "";
  }

  function fetchCityCoords(city) {
    var geoUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=" + apiKey;

    fetch(geoUrl)
      .then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {
            fetchForecast(data[0].lat, data[0].lon);
          });
        } else {
          alert('Error: ' + response.statusText);
        }
      })
      .catch(function (error) {
        alert('Unable to connect to API');
      });
  }

  function fetchForecast(lat, lon) {
    var forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + apiKey;

    fetch(forecastUrl)
      .then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {
            console.log(data);
            renderForecast(data);
          });
        } else {
          alert('Error: ' + response.statusText);
        }
      })
      .catch(function (error) {
        alert('Unable to connect to API');
      });
  }

  function renderForecast(data) {
    var city = data.city.name
    var currentData = data.list[0];
    var currentDate = currentData.dt_txt.split(" ", 1);

    cityHeaderEl.innerHTML = city + " " + currentDate;
    currentIconEl.src = "https://openweathermap.org/img/wn/" + currentData.weather[0].icon + "@2x.png";
    currentTempEl.innerHTML = "Temp: " + currentData.main.temp + "&degF";
    currentWindEl.innerHTML = "Wind: " + currentData.wind.speed + " MPH";
    currentHumidityEl.innerHTML = "Humidity: " + currentData.main.humidity + " %";

    for(var i = 1; i < data.list.length; i++) {
      if(data.list[i].dt_txt.includes("00:00:00")) {
        var nextIndex = i;
        break;
      }
    }

    var elementIndex = 0;

    while(nextIndex < data.list.length) {
      console.log(data.list[nextIndex]);

      dateEl[elementIndex].innerHTML = data.list[nextIndex].dt_txt.split(" ", 1);
      iconEl[elementIndex].src = "https://openweathermap.org/img/wn/" + data.list[nextIndex].weather[0].icon + "@2x.png";
      tempEl[elementIndex].innerHTML = data.list[nextIndex].main.temp + "&degF";
      windEl[elementIndex].innerHTML = data.list[nextIndex].wind.speed + " MPH";
      humidityEl[elementIndex].innerHTML = data.list[nextIndex].main.humidity + " %";

      elementIndex++;
      nextIndex += 8;
    }

  }
  
  searchBtn.addEventListener("click", formSubmitHandler);

});