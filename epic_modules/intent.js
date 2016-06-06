var child_process = require("child_process");
var filename = "../output.mp3";
var fs = require('fs');
var natural = require('natural');
var classifier = new natural.BayesClassifier();
var __path = JSON.parse(fs.readFileSync(('./config/config.json'))).system;

var getIntent = function(string) {
    var files = { };
   
    var array = ['info','musique','time', 'cnrtl', 'news', 'volume', 'light'];
    array.forEach(function (module) {
	var modulePath = __path.modulePath+module+'/'+module+'.js';
	var phrase = __path.modulePath+module+'/phrase.json';	
	files[module] = require(modulePath);

	var _json = JSON.parse(fs.readFileSync(phrase));
	for (j=0; j<_json.length; j++) {
            var text = _json[j].text;
            var label = _json[j].label;
            classifier.addDocument(text, label);
	}


    })
    
    classifier.train();
   
    var clas = classifier.classify(string).split('-')[0];
    console.log("CLASSIFICATION : "+clas);
    var res = files[clas].start(string);
    return res;
}

exports.getIntent = getIntent;
//getIntent("qui est Roger Waters");
