var thisModule = 'musique';


var fs = require('fs');
var natural = require('natural');
var classifier = new natural.BayesClassifier();

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
    string = string.split(' ').join('%20');

    var deezerUrl = encodeURI("https://api.spotify.com/v1/search?query=" + string + "&offset=0&limit=20&type=track").split("%25").join("%");
    // fetch deezer api !    
    var deezerApi = request('GET', deezerUrl.replace("%25", "%"));
    console.log(deezerUrl.replace("%25", "%"));
    try {
	console.log(deezerApi.body.toString());
	var jsonFromDeezer = JSON.parse(deezerApi.body.toString());
	console.log(jsonFromDeezer);
	var author = jsonFromDeezer.tracks.items[0].artists[0].name;
	var track = jsonFromDeezer.tracks.items[0].name;
    }catch (e) {
	console.log("ERROR : "+e);
	return -1;
    }

    var url = encodeURI("https://www.youtube.com/results?search_query="+track+"+"+author);
    console.log("URL: "+url);
    var html = request('GET', url);
    var $ = cheerio.load(html.body.toString());
    console.log($(".yt-lockup-title a")[0].attribs.href);
    var fileName = track.split(' ').join('_')+".mp3";
    return ["https://www.youtube.com"+$(".yt-lockup-title a")[0].attribs.href, track, author];
}

var killSong = function() {
    child_process.exec("killall mplayer", function() {
    	console.log("La musique a ete arretee")
    });
}

function playSongFromPath(path) {
    child_process.exec("mplayer "+path, function() {
	console.log(path+" played succefully!");
    });
}

var playSong = function(string) {
    var data = getYoutubeLink(string);
    if (data == -1) {
	return "song not found";
    }

    var url = data[0];
    var track = data[1].toLowerCase();
    var author = data[2].toLowerCase().replace(/ /g, "_");
    var mp3 = track.split(' ').join('_')+'.mp3';

    var songExists = fs.existsSync(songPath+'/'+author+'/'+mp3);

    if (songExists == true){
	killSong();
	console.log("SONG EXISTS, PLAYING");
	playSongFromPath(songPath+"/"+author+"/"+mp3);
    } else {
	try {
	    fs.mkdirSync(songPath+'/'+author);
	} catch(e) {
	    if ( e.code != 'EEXIST' ) throw e;
	}
	downloadFromYoutube(getFinalYoutube(url), mp3, songPath+'/'+author);
    }

    return "Lecture de : "+track;
}


var songsForWeb = function() {
    var arraySongs = {};
    var directories = fs.readdirSync(songPath);
    directories.forEach( function (dir) {
	arraySongs[dir] = [];
	var songs = fs.readdirSync(songPath+'/'+dir);
	songs.forEach( function (song) {
	    arraySongs[dir].push(song.replace('.mp3','').split('_').join(' '));
	});
    });
    return JSON.stringify(arraySongs);
}

function downloadFromYoutube(url, name, path) {
    console.log("URL: "+url);
    console.log("NAME : "+name);
    console.log("PATH : "+path);

    var YD = new YoutubeMp3Downloader({
        "ffmpegPath": "/usr/bin/ffmpeg",
        "outputPath": path,
        "youtubeVideoQuality": "lowest",
        "queueParallelism": 2,
        "progressTimeout": 100
    });
    mp3name = name;
    // REMOVE
    YD.download(url, name);

    YD.on("finished", function(data) {
	killSong();
	playSongFromPath(path+"/"+name);
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

function init() {
    var _json = JSON.parse(fs.readFileSync("./custom/"+thisModule+"/phrase.json"));
    for (i=0; i<_json.length; i++) {
        var text = _json[i].text;
        var label = _json[i].label;
        classifier.addDocument(text, label);
    }
    classifier.train();
}


var start = function(string) {
    var func = classifier.classify(string).split('-')[1];
    console.log(func);

    switch(func) {
    case "playSong":
	playSong(string);
	break;
    case "killSong":
	killSong();
	break;
    }
}


init();
exports.start = start;
