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
var music = require("./musique.js");
var time = require("./time.js");
var volume = require("./volume.js");

var deep = require("../deepLearning/app.js");










getIntent = function(string, lexic) {
    var category = deep.classify(string);
    var result = "";
    console.log(category);
    switch(category) {
        case "people-info":
        	result = getInfoResult(string, lexic);
    	    break;
        case "things-info":
            result = getInfoResult(string, lexic);
            break;
        case "musique":
            result = music.playSong(string);
            break;
        case "heure":
            result = time.getTime();
            break;
        case "date":
            result = time.getDay();
            break;
        case "volume-down":
            result = volume.volumeDown();
            break;
        case "volume-up":
            result = volume.volumeUp();
            break;
        case "volume-set":
            result = volume.volumeSet(string);
            break;
        case "volume-stop":
            result = music.killSong();
            break;
        case "date":
            result = time.getDay();
            break;

    }
    console.log("RESULT : "+result);
    return ["what", result,"the", "fuck"];

}

exports.getIntent = getIntent;
