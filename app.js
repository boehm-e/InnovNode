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

// EVENT LISTENER

var events = require('./epic_modules/eventHandler.js');
require.reload = function reload(path){
    delete require.cache[require.resolve(path)];
  return require(path);
};


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
	events.keyword(data);
	result = getIntent(data, lexic); // get response from the question
	tts(result[1]); // TEXT TO SPEECH TTS
/*	console.log(result);

	
	if (result[1] != undefined && result[1] != "") {
	    if (result[0] == "recettes" || result[0] == "images")
		sendAll(JSON.stringify(["url", result[1], result[2]]));
	    else
		sendAll(JSON.stringify(["notif", "", result[1]]));
	}
*/
    });
    
    wss.on('close', function () { // remove client from the array
	console.log("CLOSED");
	var index = clients.indexOf(wss);
	if (index > -1) {
	    clients.splice(index, 1);
	}
    });
});


// EXPRESS API
var music = require('./epic_modules/custom/musique/musique.js');
var express = require('express')
var bodyParser = require("body-parser");
var jsonfile = require('jsonfile')
var app = express();
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/songsForWeb', function (req, res) {
  res.send(music.songsForWeb());
})

app.get('/getEventList', function (req, res) {
  res.send(events.getEventList());
})

app.post('/removeScenario', function(req, res){
    var id = req.body.id;
    var file = JSON.parse(fs.readFileSync("./config/events.json"));
    console.log(file[id]);
    file.splice(id,1);
    fs.writeFileSync("./config/events.json", JSON.stringify(file));
    events = require.reload('./epic_modules/eventHandler.js');
    res.send("ok");
})

app.post('/newScenario', function(req, res) {
    var json = req.body.data;

    var file = JSON.parse(fs.readFileSync("./config/events.json"));
    console.log(file);
    file.push(JSON.parse(json));
    file = JSON.stringify(file);
    fs.writeFileSync('./config/events.json', file  , 'utf-8'); 
    events = require.reload('./epic_modules/eventHandler.js');
    res.end();
});
 

app.listen(3000)


// EVENT LISTENER
/*events.eventEmitter.on('keyword', function(word, and, then) {
    console.log("KW : "+data);
    tts("mot cle : "+data);
})*/
