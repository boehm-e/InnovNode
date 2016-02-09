var request = require("sync-request");
var cheerio = require('cheerio');

var syno = ["synonyme"];
var anto = ["contraire", "antonyme"];
var toRemove = ["donne-moi", "trouve-moi", " du mot ", " un ", " des ", " et ", " du ", " mot "];

function synonyme(string)  {
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

var cnrtl = function(string, lexic){

    
    // SYNO ?
    for (var i=0; i<syno.length; i++) {
	if (string.indexOf(syno[i]) != -1) {
	    var word = clearString(string);
	    var result = synonyme(word)
	    if (result != undefined && result.toString() != "")
		return "Un synonyme du mot "+word+" est "+ result.toString()+".";
	    else
		return "Désolé, je ne trouves aucun synonyme pour ce mot.";
	}
    }

    // ANTO ?
    for (var i=0; i<anto.length; i++) {
	if (string.indexOf(anto[i]) != -1) {
	    var word = clearString(string);
	    var result = antonyme(word)	    
	    if (result != undefined && result.toString() != "")
		return "Un antonyme du mot "+word+" est "+ result.toString()+".";
	    else
		return "Désolé, je ne trouves aucun antonyme pour ce mot.";
	}
    }
}

exports.cnrtl = cnrtl;
