var thisModule = 'time';

var fs = require('fs');
var natural = require('natural');
var classifier = new natural.BayesClassifier();
var __path = JSON.parse(fs.readFileSync(('./config/config.json'))).system;

var mounths = ["janvier","février","mars","avril","mai","juin","juillet","aout","septembre","octobre","novembre","décembre"];
var days = ["dimanche","lundi","mardi","mercredi","jeudi","vendredi","samedi"];

var getTime = function() {
	var d = new Date();
	var time = d.toLocaleTimeString();
	var arr = time.split(":");

	return "il est "+arr[0]+":"+arr[1];
}

var getDay = function() {
	var d = new Date();

	var m = mounths[d.getMonth()];
	var wj = days[d.getDay()];
	var j = d.getDate();
	var a = d.getFullYear();

	return "Nous sommes le "+wj+" "+j+" "+m+" "+a;
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
    console.log(func);
    var result = "";

    switch(func) {
    case "getTime":
        result = getTime();
	break;
    case "getDay":
	result = getDay();
        break;
    }
    return result;
}

init();
exports.start = start;
