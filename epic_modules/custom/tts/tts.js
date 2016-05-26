var request = require("sync-request");
var child_process = require("child_process");
var fs = require("fs");
var http = require('http');


var filename = "../output.mp3";

var tts = function(result){
    if (result != "" && typeof(result) != "object") {
	try {
	    var file = fs.createWriteStream(filename);
	    var request = http.get("http://voice2.reverso.net/RestPronunciation.svc/v1/output=json/GetVoiceStream/voiceName=Claire22k?inputText="+new Buffer(result.toString()).toString('base64')+"&voiceSpeed=95&mp3BitRate=128",function(response) {
		response.pipe(file);
		setTimeout(function(){
		    child_process.exec("mplayer "+filename, function() {
			console.log("DONE");
		    });
		},200)
	    });
	} catch(e) {
	    console.log(e);
	}
    }
    return true;
}
exports.tts = tts;
