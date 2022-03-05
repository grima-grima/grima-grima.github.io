const REGULAR_TITLE = document.title;
const PANIC_TITLE = "Excel";
var IS_PANIC_ON = false;

function Layer(_index, _last, _folder, _extension, _type) {
	this.index = _index;
	this.last = _last;
	this.folder = _folder;
	this.extension = _extension;
	this.type = _type;
}

// #######################################################
// general functions
// #######################################################
function updLayer(layer) {
	document.getElementById(layer.folder).src = "./" + layer.type + "/" + layer.folder + "/" + layer.index + "." + layer.extension;
}

function next(layer) {
	if ((layer.index + 1) > layer.last) {
		layer.index = 1;
	} else {
		layer.index = layer.index + 1;
	}
	updLayer(layer);
}

function previous(layer) {
	if ((layer.index - 1) < 1) {
		layer.index = layer.last;
	} else {
		layer.index = layer.index - 1;
	}
	updLayer(layer);
}

function panicOn() {
	IS_PANIC_ON = true;
	document.getElementById("mainTR").style.display = "none";
	document.getElementById("excel").style.display = "block";
	document.title = PANIC_TITLE;
}

function panicOff() {
	IS_PANIC_ON = false;
	document.getElementById("mainTR").style.display = "block";
	document.getElementById("excel").style.display = "none";
	document.title = REGULAR_TITLE;
}

function shake() {
	document.getElementById("panic").style = "animation: shake 0.5s; animation-iteration-count: infinite;";
}

function noShake() {
	document.getElementById("panic").style = "";
}

function updOrnament(chkId, imgId) {
	if (document.getElementById(chkId).checked) {
		document.getElementById(imgId).style.display = "block";
	} else {
		document.getElementById(imgId).style.display = "none";
	}
}
