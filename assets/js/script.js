var urlSuffix = atob("ZWY5ZjNmOTY2Y2UyZjJjZTY1ZGUyMDA0YTU5MTkwMzI=");
//initialize function
function init() {
  $("#submit").on("click", getCity);
  printStoredCities();
  var cities = JSON.parse(localStorage.getItem("cities"));
  if (cities) {
    getWeather(cities[0].latitude, cities[0].longitude, cities[0].location);
  } else {
    getWeather(33.749, -84.388, "atlanta");
  }
}

function printStoredCities() {
  var cities = JSON.parse(localStorage.getItem("cities"));
  if (cities) {
    for (var i = 0; i < cities.length; i++) {
      $("<li>", { class: "list-group-item" })
        .append(
          $(
            "<span class='searchcity' data-lat='" +
              cities[i].latitude +
              "' data-lon='" +
              cities[i].longitude +
              "'>" +
              cities[i].location +
              "</span>"
          )
        )
        .appendTo($("#citylist"));
    }
    $(".searchcity").on("click", makeLink);
  }
}

function makeLink() {
  var citylink = this.textContent;
  var latlink = $(this).attr("data-lat");
  var lonlink = $(this).attr("data-lon");
  getWeather(latlink, lonlink, citylink);
}

function getCity() {
  var city = $(".city").val().trim();
  city = city.toLowerCase();
  city = city.replace(/ /g, "_");
  if (city) {
    var requestLatLon =
      "http://api.openweathermap.org/geo/1.0/direct?q=" +
      city +
      "&limit=1&appid=" +
      urlSuffix;
    fetch(requestLatLon)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        getWeather(data[0].lat, data[0].lon, city);
        storeCity(data[0].lat, data[0].lon, city);
      });
  } else {
    alert("Please enter a city.");
  }
}

function storeCity(lat, lon, city) {
  var storedCities = JSON.parse(localStorage.getItem("cities"));
  if (storedCities == null) {
    storedCities = [];
  }
  var entry = {
    latitude: lat,
    longitude: lon,
    location: city,
  };
  if (!storedCities.some((u) => u.location === entry.location)) {
    storedCities.unshift(entry);
  } else {
    console.log(storedCities);
    console.log(entry);
    // const i = storedCities.indexOf(entry);
    // console.log(i);
    // storedCities.splice(i, 1);

  }
  localStorage.setItem("cities", JSON.stringify(storedCities));
  location.reload;
}

function getWeather(lat, lon, city) {
  var clearTopcard = (document.getElementById("topCard").innerHTML = "");
  var clearDaily = (document.getElementById("daily").innerHTML = "<h2></h2>");
  var clearCitylist = (document.getElementById("citylist").innerHTML = "");
  var requestUrl =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat +
    "&lon=" +
    lon +
    "&appid=" +
    urlSuffix +
    "&exclude=hourly&units=imperial";

  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      //   console.log(data);
      //   console.log(data.daily);
      $("<div>", { class: "row w-100 topBorder" })
        .append(
          $(
            "<div class='col'><h2>" +
              city +
              " (" +
              moment.unix(data.current.dt).format("M/DD/YYYY") +
              ")</h2><p>Temp: " +
              Math.round(data.current.temp) +
              "°F</p><p>Wind: " +
              Math.round(data.current.wind_speed) +
              " MPH</p><p>Humidity: " +
              data.current.humidity +
              "%</p><p>UV Index: <span id='topUvi' class='p-1 rounded text-dark'>" +
              data.current.uvi +
              "</span></p></div><div class='col'><img src='https://openweathermap.org/img/wn/" +
              data.current.weather[0].icon +
              "@4x.png' alt='weather icon'></div></div>"
          )
        )
        .appendTo($("#topCard"));
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
      $("#daily").children("h2").text("5-Day Forecast");
      for (var i = 0; i < 5; i++) {
        $("<div>", { class: "col w-20 d-inline-flex" })
          .append(
            $(
              "<div class='card w-20'><img class='card-img-top mw-20' src='https://openweathermap.org/img/wn/" +
                data.daily[i].weather[0].icon +
                "@4x.png' alt='weather icon'><div class='card-body'><h5 class='card-title'>" +
                moment.unix(data.daily[i].dt).format("M/DD/YYYY") +
                "</h5><p class='card-text'>Temp: " +
                Math.round(data.daily[i].temp.max) +
                "°F</p><p class='card-text'>Wind: " +
                Math.round(data.daily[i].wind_speed) +
                " MPH</p><p class='card-text'>Humidity: " +
                data.daily[i].humidity +
                "%</p></div></div></div>"
            )
          )
          .appendTo($("#daily"));
      }
      printStoredCities();
    });
}
init();
