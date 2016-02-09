var request = require('sync-request');

function getFirstProp(obj) {
    for (var i in obj) return obj[i].extract;
}

var info = function(string, lexic) {
    console.log("GET INFO RESULT");
    var toRemove = ["?", "!", ".", " qu'un ", " qu'une ", " des ", " une "," que ", " de ", " la ", " un ", " le ", "l'"];
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
    console.log(string);
    var res = request('GET', 'https://fr.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles='+string);
    var result = JSON.parse(res.body.toString('utf-8'))["query"]["pages"];
    string = getFirstProp(result);

    return string;
}

exports.getInfoResult = info;
