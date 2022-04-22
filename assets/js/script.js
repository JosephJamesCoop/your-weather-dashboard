var apiKey = "6eee33918b42ca96a6dbde84a0ecef24";

var todaySection = document.getElementById("today");
var weekSection = document.getElementById("week");
var searchedCities = document.getElementById("city-button")

form.submit(function(event) {
  event.preventDefault();
  var city = document.getElementById("citySelection").val();
  if (city) {
      document.location.replace("./index.html?q=" + city);
  } else {
      alert("No input recieved.");
  }
});

var getCity = function() {
  cityArray = localStorage.getItem("cities");
  cityArray = JSON.parse(cityArray);
  if (cityArray === null) {
      cityArray = [];
      return;
  }
  for (var i = 0; i < cityArray.length; i++) {
      var listItem = document.createElement("<a>").text(cityArray[i]);
      listItem.attr("href", "./index.html?q=" + cityArray[i]);
      searchedCities.append(listItem);
  }
}