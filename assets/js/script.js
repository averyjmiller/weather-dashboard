document.addEventListener("DOMContentLoaded", () => {

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
    var key = "afbfa8ef52bbf8f96d3252975a945fb3";
    var geoUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=" + key;

    fetch(geoUrl)
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
        alert('Unable to connect to GitHub');
      });
  }
  
  searchBtn.addEventListener("click", formSubmitHandler);

});