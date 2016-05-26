var child_process = require("child_process");
var filename = "../output.mp3";
var fs = require('fs');
var natural = require('natural');
var classifier = new natural.BayesClassifier();


function init2(string) {
    var files = { };
   
    var array = ['info','musique','time'];
    array.forEach(function (module) {
	var modulePath = './custom/'+module+'/'+module+'.js';
	var phrase = './custom/'+module+'/phrase.json';	
	files[module] = require(modulePath);

	var _json = JSON.parse(fs.readFileSync(phrase));
	for (j=0; j<_json.length; j++) {
            var text = _json[j].text;
            var label = _json[j].label;
//	    console.log(text);
            classifier.addDocument(text, label);
	}


    })
    
    classifier.train();
    var clas = classifier.classify(string).split('-')[0];
    console.log("CLASSIFICATION : "+clas);
    var res = files[clas].start(string);
    console.log(res)
}


getIntent = function(string, lexic) {
    classifier.classify(string);
}

init2('quelle heure est-il');
//getIntent("")
exports.getIntent = getIntent;
