var apiKey = atob("ZWY5ZjNmOTY2Y2UyZjJjZTY1ZGUyMDA0YTU5MTkwMzI=");

//initialize function
function init() {
  $("#submit").on("click", getCity);
}

function getCity() {
  var city = $(".city").val().trim();
  city = city.replace(/ /g, "_");
  if (city) {
    var requestLatLon =
      "http://api.openweathermap.org/geo/1.0/direct?q=" +
      city +
      "&limit=1&appid=" +
      apiKey;
    fetch(requestLatLon)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        getWeather(data[0].lat, data[0].lon, city);
      });
  } else {
    alert("Please enter a city.");
  }
}

function getWeather(lat, lon, city) {
  var requestUrl =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat +
    "&lon=" +
    lon +
    "&appid=" +
    apiKey +
    "&units=imperial";

  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
    //   console.log(data);
    //   console.log(data.daily);
      $("#topCity").html(
        city +
          " (" +
          moment.unix(data.current.dt).format("M/DD/YYYY") +
          ") <img src='https://openweathermap.org/img/wn/" +
          data.current.weather[0].icon +
          ".png' alt='weather icon'>"
      );
      $("#topTemp").text(Math.round(data.current.temp) + "°F");
      $("#topWind").text(Math.round(data.current.wind_speed) + " MPH");
      $("#topHumidity").text(data.current.humidity + "%");
      $("#topUvi").text(data.current.uvi);
      if (data.current.uvi <= 2) {
        $("#topUvi").css("background-color", "green");
      } else if (data.current.uvi <= 5) {
        $("#topUvi").css("background-color", "yellow");
      } else if (data.current.uvi <= 7) {
        $("#topUvi").css("background-color", "orange");
      } else if (data.current.uvi <= 10) {
        $("#topUvi").css("background-color", "red");
      } else {
        $("#topUvi").css("background-color", "purple");
      }
      //   for (var i = 0; i < data.length; i++) {
      //     var userName = document.createElement("h3");
      //     var issueTitle = document.createElement("p");
      //     userName.textContent = data[i].user.login;
      //     issueTitle.textContent = data[i].title;
      //     issueContainer.append(userName);
      //     issueContainer.append(issueTitle);
      //   }
    });
}
init();
