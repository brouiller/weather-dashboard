var apiKey = atob("ZWY5ZjNmOTY2Y2UyZjJjZTY1ZGUyMDA0YTU5MTkwMzI=");

//initialize function
function init() {
  $("#submit").on("click", getCity);
}

function getCity() {
  var city = $(".city").val().trim();
  city = city.replace(/ /g, "_");
    console.log("city: " + city);
    if(city){
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
          console.log(data);
          console.log(data[0].lat + ", " + data[0].lon);
          getWeather(data[0].lat, data[0].lon);
        });
    } else {
        alert('Please enter a city.');
    };
}

function getWeather(lat, lon) {
  var requestUrl =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat +
    "&lon=" +
    lon +
    "&appid=" +
    apiKey;

  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
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
