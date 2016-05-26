var fs = require('fs');
var request = require("sync-request");
var cheerio = require("cheerio");

var tvShowList = fs.readFileSync();
var tvShowList = ["arrow", "flash", "Marvel: Les Agents du S.H.I.E.L.D.", "gotham", "banshee"];
var alreadyDone = {};

function match(show) {
    for (i=0; i<tvShowList.length; i++) {
	if (tvShowList[i].toLowerCase().indexOf(show) != -1)
	    return true;
    }
    return false;
}


function getTvShow() {
    var html = "http://www.zone-telechargement.com/homep.html";
    var res = request('GET', html);
    var array = [];
    var $ = cheerio.load(res.body.toString());
    var tvShowTab= $(".cat_wall_4").parent().parent().find(".cover_infos_title");

    for (var i=0; i<tvShowTab.length; i++) {
	var _this = $(tvShowTab[i]).text().toLowerCase().split(" - ")[0];
	if (match(_this) == true) {
	    if (alreadyDone[_this] != true) {
		alreadyDone[_this] = true;
		console.log("OK : "+_this);
	    }
	} else {
	    alreadyDone[_this] = false;
	}
    }
    return "coucou";
}

var tvShow = function(string, lexic) {
    
}

setInterval(function(){
    getTvShow();
}, 1000);


//exports.news = news;
