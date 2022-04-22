var apiKey = "6c824467b18388bbc515d17b0f0e72db";

var todaySection = document.getElementById("today");
var weekSection = document.getElementById("week");
var searchedCities = document.getElementById("city-button");
var form = document.getElementById("submitForm");
var listOfCities = [];

var saveCity = function () {
  localStorage.setItem("cities", JSON.stringify(listOfCities));
};

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
    var listItem = document.createElement("a");
    listItem.innerHTML = (listOfCities[i])
    listItem.setAttribute("href", "./index.html?q=" + listOfCities[i]);
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
          findWeather(data[0].lat, data[0].lon, data[0].name);
        } else {
          alert("No Cities with that spelling.");
          document.location.replace("./index.html?q=");
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

var convert = function (epochTime) {
  return new Date(epochTime * 1000);
};

var displayTodaysWeather = function (day, city) {
  var today = convert(day.dt);
  var cityLocation = document.createElement("h1")
  cityLocation.innerHTML = (city);
  var iconUrl =
    "https://openweathermap.org/img/wn/" + day.weather[0].icon + ".png";
  var weatherIcon = document
    .createElement("img")
    .setAttribute("src", iconUrl)
  var date = document
    .createElement("h3")
    .innerHTML = (
      today.getMonth() + 1 + "/" + today.getDate() + "/" + today.getFullYear()
    );
  var dateCon = document
    .createElement("div");

    dateCon.append(date)
    dateCon.append(weatherIcon )
  todaySection.append(city)
  todaySection.append(dateCon);
  var temp = document
    .createElement("p")
    .innerHTML = (
      "Temp: " +
        ((day.temp.morn + day.temp.eve + day.temp.night) / 3).toFixed(2) +
        "F"
    );
  var humidity = document
    .createElement("p")
    .innerHTML = ("Humidity: " + day.humidity + "%");
  var wind = document
    .createElement("p")
    .innerHTML = ("Wind: " + day.wind_speed + "MPH");
  var uvSpan = document.createElement("span").innerHTMl = ("day.uvi Index: " + day.uvi);
  if (day.uvi <= 2) {
    uvSpan.className = "bg-success";
} else if (day.uvi <= 5) {
    uvSpan.className = "bg-warning";
} else {
    uvSpan.className = "bg-danger";
}
  var info = document
    .createElement("div")
    info.append(temp)
    info.append(humidity)
    info.append(wind)
    info.append(uvSpan);



  todaySection.append(info);
};

var displayWeeklyWeather = function(week) {
  for (var i = 1; i < 6; i++) {
      var day = convert(week[i].dt);
      var weekCard = document.createElement("div");
      var iconUrl = "https://openweathermap.org/img/w/" + week[i].weather[0].icon + ".png";
      var weatherIcon = document.createElement("img").setAttribute("src", iconUrl)
      var day = document.createElement("h4").innerHTML = ((day.getMonth() + 1)
                          + "/" + day.getDate()
                          + "/" + day.getFullYear());
      var dateCon = document.createElement("div")
      dateCon.append(day)
      dateCon.append(weatherIcon);
      var temp = document.createElement("p").innerHTML = ("Temp: " + ((week[i].temp.morn + week[i].temp.eve + week[i].temp.night)/3).toFixed(2) + "F");
      var humidity = document.createElement("p").innerHTML = ("Humidity: " + week[i].humidity + "%");
      var wind = document.createElement("p").innerHTML = ("Wind: " + week[i].wind_speed + "MPH");

      weekCard.append(dateCon)
      weekCard.append(temp)
      weekCard.append(humidity)
      weekCard.append(wind);

      weekSection.append(weekCard);
  }
}