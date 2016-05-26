var request = require("sync-request");
var cheerio = require("cheerio");

var res = request('GET', "http://maps.googleapis.com/maps/api/geocode/json?address=la%20ferte%20sous%20jouarre&sensor=false");

function parseCity(string, lexic) {
    var toRemove = ["", "", "", "", "", "", "", ""];

    for (var i=0; i<toRemove.length; i++) {
	string = string.replace(toRemove[i], "");
    }
    for (var i=0; i<lexic["itineraire"].length; i++) {
	string = string.replace(lexic["itineraire"][i], "");
    }
    string = string.replace(/\s+/g, ' ').trim();
    return string + ".";
}




var itineraire = function(string, lexic) {

    if (string.indexOf(" de ") != -1 && string.indexOf(" à ") != -1) {
	string = parseCity(string, lexic);
	var re = /de (.*) à (.*)\./g;
	var result = [];
	while (m = re.exec(string)) {
	    result.push(m);
	}
	console.log("-----------");
	console.log("depart : " + result[0][1]);
	console.log("arrivee : " + result[0][2]);
	var itineraire = request("GET", "https://maps.googleapis.com/maps/api/directions/json?origin="+result[0][1]+"&destination="+result[0][2]);
	var data = JSON.parse(itineraire.body.toString());
	var km = data["routes"][0]["legs"][0]["distance"]["value"];
	return "Il y a "+Math.round(km / 1000) + " kilomètres entre "+result[0][1]+ " et  "+result[0][2]+".";
	
	// Multiple city
    } else {
	// single city (from curent location)
    }
    
    return "itineraire";
}

exports.itineraire = itineraire;
