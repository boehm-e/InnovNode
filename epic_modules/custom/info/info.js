var thisModule = 'info';

var fs = require('fs');
var natural = require('natural');
var classifier = new natural.BayesClassifier();
var __path = JSON.parse(fs.readFileSync(('./config/config.json'))).system;

var request = require('sync-request');

function getFirstProp(obj) {
    for (var i in obj) {
	try {
	    var all = obj[i].extract;
	    var ret = all.replace(/{.*?}/g, "")
		.replace(/\[.*?\]/g, "")
		.replace(/<.*?>/g, "")
		.replace(/\(.*?\)/g, "");
	    return ret.split('.')[0]
	} catch (ex) {
	    return "aucune idée";
	}
    }
}

function info(string) {
    var lexic = JSON.parse(fs.readFileSync('/var/www/html/CleanInnov/lexic.json'));
    string = ' '+string+' ';
    var toRemove = ["?", "!", ".", ,"qu'est ce", "qu'un ", " qu'une ", " des ", " une "," que ", " de ", " la ", " un ", " le ", "l'"];
    for (var i=0; i<lexic["info"].length; i++) {
	string = string.replace(lexic["info"][i], "");
    }
    for (var i=0; i<toRemove.length; i++) {
	string = string.replace(toRemove[i], "");
    }
    string = string.replace(/\s+/g, ' ').trim();
    while (string.indexOf(" ") != -1) {
	string = string.replace(" ", "%20");
    }
    var res = request('GET', 'https://fr.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles='+string);
    var result = JSON.parse(res.body.toString('utf-8'))["query"]["pages"];
    string = getFirstProp(result);

    return string;
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
    return info(string);
}

init();
exports.start = start;
