(function(){
  'use strict';

  var pizgaThreshold = 5;

  var ui = {
    $apiRequestScript: null,
    $head:             document.head,
    $body:             document.body
  };

  var serialize = function serialize(obj) {
    var str = [];
    for(var p in obj)
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    return str.join('&');
  };
  
  var geoOptions = {
    enableHighAccuracy: false,
    timeout           : 10000
  };

  var weatherOptions = {
    appid:     '84a2d44463dfa037b0a174d8f59c8a64',
    lang:      'pl',
    units:     'metric',
    callback:  'weatherApiCallback',
    lat:       0,
    lon:       0,
    timestamp: (new Date()).getTime()
  };

  var geoSuccess = function geoSuccess(position) {
    position = position || {};
    var coords = position.coords || {};

    weatherOptions.lat = coords.latitude;
    weatherOptions.lon = coords.longitude;

    callWeatherApi();
  }

  var geoError = function geoError(err) {
    alert('Nie udało mi się pobrać Twojej lokalizacji, spróbuj ponownie.');
    console.error(err);
  }

  var callWeatherApi = function callWeatherApi() {
    var query = serialize(weatherOptions);
    ui.$apiRequestScript = document.createElement('script');
    ui.$apiRequestScript.src = '//api.openweathermap.org/data/2.5/weather?' + query;
    ui.$head.appendChild(ui.$apiRequestScript);
  }

  var weatherApiCallback = function weatherApiCallback(data) {
    data = data || {};
    
    window.czyPizga.ui.$apiRequestScript.parentNode.removeChild(window.czyPizga.ui.$apiRequestScript);

    window.czyPizga.renderWeatherResult(data.main.temp);
  }

  var renderWeatherResult = function renderWeatherResult(temp) {
    if (temp > window.czyPizga.pizgaThreshold) {
      window.czyPizga.ui.$body.classList.add('nie-pizga');
    }
    else {
      window.czyPizga.ui.$body.classList.add('pizga');
    }

    window.czyPizga.ui.$body.classList.remove('is-loading');
  }

  var czyPizga = function czyPizga() {
    return {
      ui:                  ui,
      renderWeatherResult: renderWeatherResult,
      pizgaThreshold:      pizgaThreshold
    };
  };
return;
  if ('geolocation' in navigator) {
    window.weatherApiCallback = weatherApiCallback;
    window.czyPizga = czyPizga();
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions);
  }
  else {
    alert('Sorry, Twoja przeglądarka nie obsługuje geolokalizacji.');
  }
}());


