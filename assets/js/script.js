document.addEventListener("DOMContentLoaded", () => {
  var apiKey = "afbfa8ef52bbf8f96d3252975a945fb3";

  var cityInputEl = document.getElementById('city');
  var searchBtn = document.getElementById('search-btn');

  function formSubmitHandler(event) {
    event.preventDefault();

    var city = cityInputEl.value.trim();

    if(city) {
      fetchCityCoords(city);
    }
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
          });
        } else {
          alert('Error: ' + response.statusText);
        }
      })
      .catch(function (error) {
        alert('Unable to connect to API');
      });
  }
  
  searchBtn.addEventListener("click", formSubmitHandler);

});