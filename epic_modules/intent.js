var child_process = require("child_process");
var filename = "../output.mp3";

var getActionLight = require("./light.js").getActionLight;
var getInfoResult = require("./info.js").getInfoResult;
var getWeather = require("./weather.js").getWeather;
var cnrtl = require("./cnrtl.js").cnrtl;
var news = require("./news.js").news;
var itineraire = require("./itineraire.js").itineraire;
var recettes = require("./recettes.js").recettes;
var images = require("./images.js").images;
var playSong = require("./musique.js").playSong;

getIntent = function(string, lexic) {
    var type = "";
    var result = "";

    var split = string.split(" ");
    if (string == "répète" || string == "peux-tu répéter") {
	child_process.exec("mplayer "+filename, function() {
	    console.log("DONE");
	});
    }

    // PLAY MUSIC ?
    for (var i=0; i<lexic["musique"].length; i++) {
	if (string.indexOf(lexic["musique"][i]) != -1) {
	    result = playSong(string);
	    type = "music";
	}
    }
    
    // GET CNRTL
    for (var i=0; i<lexic["cnrtl"].length; i++) {
	if (string.indexOf(lexic["cnrtl"][i]) != -1) {
	    result = cnrtl(string, lexic);
	    type = "cnrtl";
	}
    }

    // GET ACTION LIGHT
    for (var i=0; i<split.length; i++) {
	if (lexic["rooms"].indexOf(split[i]) != -1) {
	    for (var i=0; i<split.length; i++) {
		if (lexic["turn_on"].indexOf(split[i]) != -1 || lexic["turn_off"].indexOf(split[i]) != -1) {
		    result = getActionLight(string, lexic);
		    type = "light";
		}
	    }
	}
    }

    // GET INFO ABOUT THINGS, PEOPLE...
    for (var i=0; i<lexic["info"].length; i++) {
	if (string.indexOf(lexic["info"][i]) != -1) {
	    result = getInfoResult(string, lexic);
	    type = "people";
	    if (result == undefined)
		result = "";
	    else
		result = result.split('.')[0];  // GET FIRST LINE
	}
    }

    // GET NEWS
    for (var i=0; i<lexic["news"].length; i++) {
	if (string.indexOf(lexic["news"][i]) != -1) {
	    result = news(string, lexic);
	    type = "news";
	}
    }

    // GET INFORMATIONS ABOUT WEATHER
    for (var i=0; i<lexic["question"]["weather"].length; i++) {
	if (string.indexOf(lexic["question"]["weather"][i]) != -1) {
	    result = getWeather(string);
	    type = "weather";
	}
    }

    // ITINERAIRE
    for (var i=0; i<lexic["itineraire"].length; i++) {
	if (string.indexOf(lexic["itineraire"][i]) != -1) {
	    result = itineraire(string, lexic);
	    type = "itineraire";
	}
    }

    // recettes
    for (var i=0; i<lexic["recettes"].length; i++) {
	if (string.indexOf(lexic["recettes"][i]) != -1) {
	    result = recettes(string, lexic);
	    type = "recettes";
	    return [type, result[0], result[1]];
	}
    }

    // images
    for (var i=0; i<lexic["images"].length; i++) {
	if (string.indexOf(lexic["images"][i]) != -1) {
	    result = images(string, lexic);
	    type = "images";
	    return [type, result[0], result[1]];
	}
    }

    return [type, result];
}

exports.getIntent = getIntent;
