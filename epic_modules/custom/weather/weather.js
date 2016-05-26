var request = require('sync-request');

var weather = function(string, lexic) {
    var result = "";

    console.log("GET WEATHER RESULT");
    var lat = 48.8144386;
    var lng = 2.3900461;
    var weatherJson = request('GET', "http://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lng+"&appid=030e308c94e69d6f88c954f692c083bb&lang=fr&units=metric");
    var data = JSON.parse(weatherJson.body);
//    console.log(data);
    result += "Il y aura de la " + data["weather"][0].description;
    result += ", il fait actuellement "+data["main"]["temp"] + " degré Celsius.";
    result += " L'air est ";
    if (data["main"]["humidity"] >60)
	result += "humide"
    else
	result += "sec";
    if (data["wind"]["speed"] > 50)
	result += " et le vent soufflera fort.";
    else
	result += " et il y aura peu de vent.";


    return result;
}

exports.getWeather = weather;
