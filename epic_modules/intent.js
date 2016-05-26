var child_process = require("child_process");
var filename = "../output.mp3";
var fs = require('fs');
var natural = require('natural');
var classifier = new natural.BayesClassifier();


var getIntent = function(string) {
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
            classifier.addDocument(text, label);
	}


    })
    
    classifier.train();
    var clas = classifier.classify(string).split('-')[0];
    console.log("CLASSIFICATION : "+clas);
    var res = files[clas].start(string);
    console.log(res)
    return res;
}

exports.getIntent = getIntent;
getIntent("écouter the song of silence")
