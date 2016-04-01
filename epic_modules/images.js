var request = require("sync-request");

function getImages(string, lexic) {
    var toRemove = ["", "", "", "", "", "", "", ""];

    for (var i=0; i<toRemove.length; i++) {
	string = string.replace(toRemove[i], "");
    }
    for (var i=0; i<lexic["images"].length; i++) {
	string = string.replace(lexic["images"][i], "");
    }
    string = string.replace(/\s+/g, ' ').trim();
    return string;
}




var images = function(string, lexic) {
    pics = getImages(string, lexic);
    return ["voila des images de " + pics, "https://www.google.fr/search?q="+pics+"&source=lnms&tbm=isch"];
}

exports.images = images;
