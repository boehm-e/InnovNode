var child_process = require("child_process");
var volumeDown = function() {
	child_process.exec("amixer -D pulse set Master 20%-", function() {
		console.log("Le volume a ete diminue");
    });
}

var volumeUp = function() {
	child_process.exec("amixer -D pulse set Master 20%+", function() {
		console.log("Le volume a ete augmente");
    });
}

var volumeStop = function() {
	child_process.exec("amixer -D pulse sset Master mute", function() {
		console.log("La musique a ete arretee")
    });
}

var volumeSet = function(string) {
	var volume = string.match(/\d+/)[0];

	child_process.exec("amixer -D pulse sset Master "+volume+"%", function() {
		console.log("Le volume a bien ete regle a "+volume+"%");
    });

}

exports.volumeDown = volumeDown;
exports.volumeUp= volumeUp;
exports.volumeStop = volumeStop;
exports.volumeSet = volumeSet;