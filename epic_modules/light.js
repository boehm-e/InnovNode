var fs = require("fs");
var filename = "../output.mp3";
var http = require('http');
var child_process = require("child_process");
var tts = require("./tts.js").tts;


function killPlayer() {
    child_process.exec("killall mplayer", function() {
	console.log("audio Player killed");
    });
}

var prev = "";
var light = function(string, lexic) {
    console.log("GET ACTION LIGHT");
    var result = {};
    var split = string.split(" ");
    var j = 0;
    for (var i=0; i<split.length; i++) {
	if (lexic["turn_on"].indexOf(split[i]) != -1) {
	    prev = "turn_on";
	} else if (lexic["turn_off"].indexOf(split[i]) != -1) {
	    prev = "turn_off";
	} else if (lexic["rooms"].indexOf(split[i]) != -1) {
	    if (prev == "turn_on")
		result[j] = [split[i], "turn_on"];
	    else if (prev == "turn_off")
		result[j] = [split[i], "turn_off"];
	    j++;
	}
    }

    var phraseObj = {};
    phraseObj["on"] = [];
    phraseObj["off"] = [];
    for (i in result) {
	if (result[i][1] == "turn_on")
	    phraseObj["on"].push(result[i][0]);
	if (result[i][1] == "turn_off")
	    phraseObj["off"].push(result[i][0]);
    }
    console.log(phraseObj);
    var begin = ["très bien", "Ok", "Super", "Ah vos ordres", "Bien entendu"];

    var phrase = begin[Math.floor(Math.random() * begin.length)]+" , ";
    if (phraseObj["on"].length > 0) {
	for (i in phraseObj["on"]){
	    phrase += phraseObj["on"][i] + ", ";
	}
	if (phraseObj["on"].length == 1)
	    phrase += "est allumé. ";
	else
	    phrase += "seront allumés. ";
    }

    if (phraseObj["off"].length > 0) {
	if (phraseObj["on"].length > 0)
	    phrase += "Et ";
	for (i in phraseObj["off"]){
	    phrase += phraseObj["off"][i] + ", ";
	}
	if (phraseObj["off"].length == 1)
	    phrase += "est éteint";
	else
	    phrase += "seront éteints";
    }
    console.log(phrase);
    tts(phrase);
    return result;
}

exports.getActionLight = light;
