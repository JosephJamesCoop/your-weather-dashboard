var apiKey = "6eee33918b42ca96a6dbde84a0ecef24";

var todaySection = document.getElementById("today");
var weekSection = document.getElementById("week");
var searchedCities = document.getElementById("city-button");
var form = document.getElementById("submitForm");
var listOfCities = [];

var saveCity = function() {
  localStorage.setItem("cities", JSON.stringify(listOfCities));
}

var searchBtn = function (event) {
  var city = document.getElementById("citySelection");
  if (city) {
    console.log(city);
    document.location.replace("./index.html?q=" + city);
  } else {
    alert("No input recieved.");
  }
};

var getCityInfo = function () {
  listOfCities = localStorage.getItem("cities");
  listOfCities = JSON.parse(listOfCities);
  if (!listOfCities === null) {
    listOfCities = [];
    return;
  }
  for (var i = 0; i < listOfCities.length; i++) {
    var listItem = document.createElement("a").text(listOfCities[i]);;
    listItem.attr("href", "./index.html?q=" + listOfCities[i]);
    searchedCities.append(listItem);
  }
};

var findCity = function (city) {
  var apiURL =
    "https://api.openweathermap.org/geo/1.0/direct?q=" +
    city +
    "&appid=" +
    apiKey;
  fetch(apiURL).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        if (data[0]) {
          getWeather(data[0].lat, data[0].lon, data[0].name);
        } else {
          alert("No Cities with that spelling.");
          document.location.replace("./index.html?q=Los Angeles");
        }
      });
    }
  });
};

var findWeather = function (lat, lon, city) {
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat +
    "&lon=" +
    lon +
    "&units=imperial&appid=" +
    apiKey;
  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        displayTodaysWeather(data.daily[0], city);
        displayWeeklyWeather(data.daily);
        if (listOfCities.includes(city)) {
        } else {
          listOfCities.unshift(city);
          saveCity();
        }
      });
    } else {
      alert("ooops Something went wrong!");
    }
  });
};

var findQuery = function () {
  var queryString = document.location.search.split("=")[1];
  if (queryString) {
    findCity(queryString);
  } else {
    findCity("");
  }
};

getCityInfo();
findQuery();

