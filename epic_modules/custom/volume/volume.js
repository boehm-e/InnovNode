var thisModule = 'volume';


var fs = require('fs');
var natural = require('natural');
var classifier = new natural.BayesClassifier();
var child_process = require("child_process");
var __path = JSON.parse(fs.readFileSync(('./config/config.json'))).system;

var volumeDown = function() {
	child_process.exec("amixer -D pulse set Master 20%-", function() {
		console.log("Le volume a ete diminue");
    });
    return "volume diminué";
}

var volumeUp = function() {
	child_process.exec("amixer -D pulse set Master 20%+", function() {
		console.log("Le volume a ete augmente");
    });
    return "volume augmenté";
}

var volumeStop = function() {
	child_process.exec("amixer -D pulse sset Master mute", function() {
		console.log("La musique a ete arretee")
    });
    return "je coupe le son!";
}

var volumeSet = function(string) {
    var volume = string.match(/\d+/)[0];

    child_process.exec("amixer -D pulse sset Master "+volume+"%", function() {
	console.log("Le volume a bien ete regle a "+volume+"%");
    });
    return "Volume a "+volume+"%";


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

    switch(func) {
    case "down":
	return volumeDown();
        break;
    case "up":
	return volumeUp();
        break;
    case "stop":
	return volumeStop();
        break;
    case "set":
	return volumeSet(string);
        break;
    }
}


init();
exports.start = start;
