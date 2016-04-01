var YoutubeMp3Downloader = require('youtube-mp3-downloader');
var fs = require('fs');
var child_process = require("child_process");
var Regex = require("regex");
var mp3name = "";
var cheerio = require('cheerio');
var request = require("sync-request");
var songPath = "/var/www/html/InnovNode/songs";

function getYoutubeLink(string) {
    var toRemove = ["écouter", "ecouter", "YouTube", "youtube"];
    for (var i=0; i<toRemove.length; i++) {
        string = string.replace(toRemove[i], "");
    }
    string = string.replace(/\s+/g, ' ').trim();
    var finalName = string;
    var name = string.split(' ').join('_')+".mp3";
    string = string.split(' ').join('+');
    var url = "https://www.youtube.com/results?search_query="+string;
    var html = request('GET', url);
    var $ = cheerio.load(html.body.toString());
    return ["https://www.youtube.com"+$(".yt-lockup-title a")[0].attribs.href, name, finalName];
}

var killSong = function() {
    child_process.exec("killall mplayer", function() {
	console.log("La musique a ete arretee")
    });
}

var playSong = function(string) {
    var data = getYoutubeLink(string); 
    var url = data[0];
    var name = data[1];
    var trimName = data[2];

    fs.readdir(songPath, function(err, files) {
	if (err) return;
	if (files.indexOf(name) != -1) {
	    child_process.exec("mplayer "+songPath+"/"+name, function() {

	    });
	} else {
	    downloadFromYoutube(getFinalYoutube(url), name);
	}
    });
    return "Lecture de : "+trimName;
}

function downloadFromYoutube(url, name) {
    console.log("URL: "+url);
    console.log("NAME : "+name);
    var YD = new YoutubeMp3Downloader({
        "ffmpegPath": "/usr/bin/ffmpeg",
        "outputPath": songPath,
        "youtubeVideoQuality": "lowest",
        "queueParallelism": 2,
        "progressTimeout": 100
    });
    mp3name = name;
    YD.download(url, name);

    YD.on("finished", function(data) {
	console.log("FINISHED !");
	console.log("NAME FINISHED : "+name);

	child_process.exec("mplayer "+songPath+"/"+name, function() {
	    console.log("song played succefully!");
	});
    });

    YD.on("error", function(error) {
        console.log("ERROR (dbg): "+error);
    });

    YD.on("progress", function(progress) {
	process.stdout.write('\033c');
        var str = mp3name+"[";
        for (i=0; i<100;i++) {
            if ( i<Math.round(progress.progress.percentage))
                str += "=";
            else if (i==Math.round(progress.progress.percentage))
                str += ">";
            else
                str += " ";
        }
        str += "]";
        console.log(str);
    });

}

function getFinalYoutube(string) {
    console.log("REGEXP");

    var myRegexp = /http.*\/\/www.youtube.*\/watch\?v=(.*)$/g;
    var match = myRegexp.exec(string);
    if (match[1])
        return match[1];
    else
        return string;
}

exports.playSong = playSong;
exports.killSong = killSong;
