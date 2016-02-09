var knob = document.getElementsByClassName("knob")[0];
var background =  document.getElementsByClassName("switch")[0];
var menuImg = document.getElementById("menuImg");
var navigationDrawer = document.getElementById("navigationDrawer");
var closeDrawer = document.getElementById("closeDrawer");

background.onclick = function() {
	if (knob.getAttribute("state") == "off") {
		knob.style.marginLeft = "31px";
		knob.setAttribute("state", "on");
		background.style.background = "#75BEB8";
		knob.style.background = "#009688";
	} else if(knob.getAttribute("state") == "on") {
		knob.style.marginLeft = "0px";
		knob.setAttribute("state", "off");
		background.style.background = "#B0AFAF";
		knob.style.background = "#F1F1F1";
	}
}

knob.onclick = function(e) {
	e.stopPropagation();
	if (knob.getAttribute("state") == "off") {
		knob.style.marginLeft = "31px";
		knob.setAttribute("state", "on");
		background.style.background = "#75BEB8";
		knob.style.background = "#009688";
	} else if(knob.getAttribute("state") == "on") {
		knob.style.marginLeft = "0px";
		knob.setAttribute("state", "off");
		background.style.background = "#B0AFAF";
		knob.style.background = "#F1F1F1";
	}
}

closeDrawer.onclick = function() {
	navigationDrawer.style.marginLeft = "-300px";
	closeDrawer.style.display = "none";
}

menuImg.onclick = function() {
	if (navigationDrawer.getAttribute("open") == "false") {
		navigationDrawer.style.marginLeft = "0";
		navigationDrawer.setAttribute("open", "true");
		closeDrawer.style.display = "block";
	} else if (navigationDrawer.getAttribute("open") == "true") {
		navigationDrawer.style.marginLeft = "-300px";
		navigationDrawer.setAttribute("open", "false");
		closeDrawer.style.display = "none";
	}
}