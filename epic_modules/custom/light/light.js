
var thisModule = 'musique';

var fs = require("fs");
var http = require('http');
var child_process = require("child_process");
var natural = require('natural');
var classifier = new natural.BayesClassifier();
var __path = JSON.parse(fs.readFileSync(('./config/config.json'))).system;


var prev = "";
var light = function(string, lexic) {

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
//    phrase = "lumosse maxima!";
    return phrase;
    return result;
}

function init() {
    var _json = JSON.parse(fs.readFileSync(__path.modulePath+thisModule+"/phrase.json"));
    for (i=0; i<_json.length; i++) {
        var text = _json[i].text;
        var label = _json[i].label;
	classifier.addDocument(text, label);
    }
    classifier.train();
}


var start = function(string) {
    var func = classifier.classify(string).split('-')[1];
    var lexic = JSON.parse(fs.readFileSync(__path.lexic));
    return light(string, lexic);
}


init();
exports.start = start;
