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
  var searchListEl = document.getElementById('search-history');

  function formSubmitHandler(event) {
    event.preventDefault();

    var city = cityInputEl.value.trim();

    if(city) {
      city = city.split(' ').join('');
      fetchCityCoords(city);
    }
    cityInputEl.value = "";
  }

  function fetchCityCoords(city) {
    var geoUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=" + apiKey;

    fetch(geoUrl)
      .then(function (response) {
        if (response.ok) {
          response.json()
            .then(function (data) {
              fetchForecast(data[0].lat, data[0].lon);
            })
            .catch(function (error) {
              alert('ERROR: Invalid city input');
            });
        } else {
          alert('ERROR: ' + response.statusText);
        }
      })
      .catch(function (error) {
        alert('ERROR: Unable to connect to API');
      });
  }

  function fetchForecast(lat, lon) {
    var forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + apiKey;

    fetch(forecastUrl)
      .then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {
            renderForecast(data);
            saveHistory(data.city);
          });
        } else {
          alert('ERROR: ' + response.statusText);
        }
      })
      .catch(function (error) {
        alert('ERROR: Unable to connect to API');
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
      dateEl[elementIndex].innerHTML = data.list[nextIndex].dt_txt.split(" ", 1);
      iconEl[elementIndex].src = "https://openweathermap.org/img/wn/" + data.list[nextIndex].weather[0].icon + "@2x.png";
      tempEl[elementIndex].innerHTML = data.list[nextIndex].main.temp + "&degF";
      windEl[elementIndex].innerHTML = data.list[nextIndex].wind.speed + " MPH";
      humidityEl[elementIndex].innerHTML = data.list[nextIndex].main.humidity + " %";

      elementIndex++;
      nextIndex += 8;
    }
  }

  function saveHistory(city) {
    var cityName = city.name;
    var cityCoord = city.coord;
    
    var alreadySaved = false;

    searchListEl.childNodes.forEach(function(child) {
      if(child.innerHTML == cityName) {
        alreadySaved = true;
      }
    });

    if(!alreadySaved) {
      var newList = document.createElement('li');
      newList.innerHTML = cityName;
      newList.setAttribute('id', 'saved-city');
      searchListEl.append(newList);

      var cities = JSON.parse(localStorage.getItem("cities"));

      if(!cities) {
        cities = [];
      }

      cities.push({
        name: cityName,
        coord: cityCoord
      });

      localStorage.setItem("cities", JSON.stringify(cities));
    }

  }

  function renderSavedCityForecast(event) {
    if(event.target.id == 'saved-city') {
      var clickedCity = event.target.innerHTML;
      var cities = JSON.parse(localStorage.getItem("cities"));
      for(var i = 0; i < cities.length; i++) {
        if(cities[i].name == clickedCity) {
          var clickedCityObj = cities[i];
          var lat = JSON.stringify(clickedCityObj.coord.lat);
          var lon = JSON.stringify(clickedCityObj.coord.lon);
          fetchForecast(lat, lon);
          break;
        }
      }
    }
  }

  function renderSearchHistory() {
    var cities = JSON.parse(localStorage.getItem("cities"));
    if(cities) {
      for(var i = 0; i < cities.length; i++) {
        var newList = document.createElement('li');
        newList.innerHTML = cities[i].name;
        newList.setAttribute('id', 'saved-city');
        searchListEl.append(newList);
      }
    }
  }

  renderSearchHistory();
  
  searchBtn.addEventListener("click", formSubmitHandler);

  searchListEl.addEventListener("click", renderSavedCityForecast)

});