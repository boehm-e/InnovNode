var thisModule = 'news';


var fs = require('fs');
var natural = require('natural');
var classifier = new natural.BayesClassifier()
var request = require("sync-request");
var cheerio = require("cheerio");
var __path = JSON.parse(fs.readFileSync(('./config/config.json'))).system;


function futurasciences() {
    var html = "http://www.futura-sciences.com/";
    var res = request('GET', html);
    var array = [];
    var $ = cheerio.load(res.body.toString());
    $(".title a").each(function() {
	array.push($(this).text());
    });
    var result = array.splice(0, 2);
    var phrase = "";
    for (var i=0; i<result.length; i++) {
	phrase += result[i]+". ";
    }
    return phrase;
}

function vingtsmin() {
    var html = "http://www.20minutes.fr/";
    var res = request('GET', html);
    var array = [];
    var $ = cheerio.load(res.body.toString());
    $(".teaser-title a").each(function() {
	array.push($(this).text());
    });
    var result = array.splice(0, 2);
    var phrase = "";
    for (var i=0; i<result.length; i++) {
	phrase += result[i]+". ";
    }
    return phrase;
}


function bfm() {
    var html = "http://www.bfmtv.com/";
    var res = request('GET', html);
    var array = [];
    var $ = cheerio.load(res.body.toString());
    $(".title-xl a").each(function() {
	array.push($(this).text());
    });
    var result = array.splice(0, 2);
    var phrase = "";
    for (var i=0; i<result.length; i++) {
	phrase += result[i]+". ";
    }
    return phrase;
}

var news = function(string, lexic) {
    string = string.toLowerCase();
    if (string.indexOf("futura science") != -1 || string.indexOf("futura-sciences") != -1)
	var phrase = futurasciences();
    else if (string.indexOf("20 minutes") != -1)
	var phrase = vingtsmin();
    else if (string.indexOf("bfm") != -1)
	var phrase = bfm();

    try {
	phrase = phrase.replace(/\s+/g, ' ').trim();
    } catch(e) {
	console.log("ERROR NEWS : "+e);
    }
    return phrase;
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
    case "futurasciences":
	result = futurasciences();
        break;
    case "bfm":
	result = bfm();
        break;
    case "20minutes":
	result = vingtsmin();
        break;
    default :
	result = vingtsmin();
	break;
    }
    return result.replace(/\s+/g, ' ').trim();
}


init();
exports.start = start;
