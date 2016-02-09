var WebSocketServer = require('ws').Server,
    server =  new WebSocketServer({port: 8080});
var fs = require("fs");
var clients = [];
var lexic = JSON.parse(fs.readFileSync("./lexic.json").toString());
var XMLHttpRequest = require("xmlhttprequest");
var request = require('sync-request');
var http = require('http');
var filename = "output.mp3";
var child_process = require("child_process");

var cheerio = require('cheerio');

// PERSONAL EPIC MODULES
var getIntent =  require("./epic_modules/intent.js").getIntent;
var tts = require("./epic_modules/tts.js").tts;

function sendAll(json) {
    for (var i = 0; i < clients.length; i++) {
	clients[i].send(json);
	var res = request('GET', 'http://www.cnrtl.fr/synonymie/manger');
    }    
}

server.on('connection', function (wss) {
    clients.push(wss);  // add client to the array

    wss.on('message', function (data) {
	console.log(data);
	result = getIntent(data, lexic); // get response from the question
	tts(result[1]); // TEXT TO SPEECH TTS
//	console.log(result);


	if (result[1] != undefined && result[1] != "") {
	    if (result[0] == "recettes" || result[0] == "images")
		sendAll(JSON.stringify(["url", result[1], result[2]]));
	    else
		sendAll(JSON.stringify(["notif", "", result[1]]));
	}
    });
    
    wss.on('close', function () { // remove client from the array
	console.log("CLOSED");
	var index = clients.indexOf(wss);
	if (index > -1) {
	    clients.splice(index, 1);
	}
    });
});
