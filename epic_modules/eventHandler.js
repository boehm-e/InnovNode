var events = require('events');
var fs = require("fs");
var eventEmitter = new events.EventEmitter();

var eventList = JSON.parse(fs.readFileSync("./config/events.json"));


var getEventList = function() {
    return eventList;
}

var removeEvent = function(index) {
    
}


// NEEDED MODULES
var tts = require("./tts.js").tts;
var music = require("./custom/musique/musique.js");

console.log("EventHandler initialized!\n\n");
var keywordArray = [];
var nfc = [];

var reset = function() {
    keywordArray = [];
    nfc = [];
    for (var i = 0; i < eventList.length; i++) {
	switch(eventList[i].when.type) {
	case "keyword":
	    keywordArray.push(i);
	    break;
	case "nfc":
	    nfc.push(i);
	    break;
	default:
	    break;
	    
	}
    }
}



var keyword = function(phrase) {
    phrase = phrase.toLowerCase();
    for (i = 0; i<keywordArray.length; i++) {
	var _this = eventList[keywordArray[i]];
	if (phrase.indexOf(eventList[keywordArray[i]].when.more.toLowerCase()) != -1) {
	    eventEmitter.emit('keyword', _this.when.more, _this.and.type, _this.and.more, _this.then.type, _this.then.more);
	}
    }
}

eventEmitter.on('keyword', function(word, andType, andMore, thenType, thenMore) {
    console.log("KW : "+word);
    // AND
    switch(andType){
    case "date":
	var current = new Date();
	var date = new Date(andMore);
	if (!(date.getDate() == current.getDate() &&
	    date.getMonth()+1 == current.getMonth()+1 &&
	    date.getFullYear() == current.getFullYear())) {
	    console.log("WRONG DATE");
	    return;
	}
	break;
    default:
	// no and
	break;
    }
    
    // THEN
    switch(thenType) {
    case "say":
	tts(thenMore);
	break;
    case "song":
	music.playSong("ecouter "+thenMore);
	break;
    default:
	break;
    }
})



reset();
exports.reset = reset;
exports.keyword = keyword;
exports.getEventList = getEventList;
exports.eventEmitter = eventEmitter;

