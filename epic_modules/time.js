var mounths = ["janvier","février","mars","avril","mai","juin","juillet","aout","septembre","octobre","novembre","décembre"];
var days = ["dimanche","lundi","mardi","mercredi","jeudi","vendredi","samedi"];

var getTime = function() {
	var d = new Date();
	var time = d.toLocaleTimeString();
	var arr = time.split(":");

	return "il est "+arr[0]+":"+arr[1];
}

var getDay = function() {
	var d = new Date();

	var m = mounths[d.getMonth()];
	var wj = days[d.getDay()];
	var j = d.getDate();
	var a = d.getFullYear();

	return "Nous sommes le "+wj+" "+j+" "+m+" "+a;
}

exports.getTime = getTime;
exports.getDay = getDay;