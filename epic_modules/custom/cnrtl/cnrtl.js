var thisModule = 'cnrtl';


var fs = require('fs');
var natural = require('natural');
var classifier = new natural.BayesClassifier();
var request = require("sync-request");
var cheerio = require('cheerio');
var __path = JSON.parse(fs.readFileSync(('./config/config.json'))).system;


var syno = ["synonyme"];
var anto = ["l'","contraire", "antonyme"];
var toRemove = ["donne-moi", "trouve-moi", " du mot ", " un ", " des ", " et ", " du ", " mot ", " le "];

function synonyme(string)  {
    string = clearString(string);
    var html = "http://www.cnrtl.fr/synonymie/"+string;
    var res = request('GET', html);
    var array = [];
    var $ = cheerio.load(res.body.toString());
    $(".syno_format a").each(function() {
	array.push($(this).text());
    });
    return array[0];
}

function antonyme(string) {
    string = clearString(string);
    var html = "http://www.cnrtl.fr/antonymie/"+string;
    var res = request('GET', html);
    var array = [];
    var $ = cheerio.load(res.body.toString());
    $(".anto_format a").each(function() {
	array.push($(this).text());
    });
    return array[0];
}

function clearString(string) {
    for (var i=0; i<toRemove.length; i++) {
	string = string.replace(toRemove[i], "");
    }
    for (var i=0; i<syno.length; i++) {
	string = string.replace(syno[i], "");
    }
    for (var i=0; i<anto.length; i++) {
	string = string.replace(anto[i], "");
    }
    string = string.replace(/\s+/g, ' ').trim();
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
    var func = classifier.classify(string).split('-')[1];
    console.log(func);
    var result = '';
    switch(func) {
    case "synonyme":
	result = synonyme(string)
        break;
    case "antonyme":
        result = antonyme(string);
        break;
    }
    return result;
}


init();
exports.start = start;
