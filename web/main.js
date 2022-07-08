// FOLDER_NAME is the folder where the files specific to this page can be found.
// This needs to be setup in the page's HTML, otherwise the page will fail to load
var FOLDER_NAME = "";
function setFolderName(folderName) {
	FOLDER_NAME = folderName;
}

function getFolderName() {
	return FOLDER_NAME;
}


// TEXT_ID is the current image in display
var TEXT_ID = 0;
function setTextId(textId) {
	TEXT_ID = textId;
}

function getTextId() {
	return TEXT_ID;
}


// LAST_IMG is the last image of the sequence. Is used to know when the "end" image will be displayed.
// This needs to be setup in the page's HTML.
var LAST_IMG = 0;
function setLastImg(lastImg) {
	LAST_IMG = lastImg;
}

function getLastImg() {
	return LAST_IMG;
}


// POIs stores the Points of Interest.
// This needs to be setup in the page's HTML.
var POIS = [];
function setPOIs(pois) {
	POIS = pois;
}

function getPOIs() {
	return POIS;
}

// Shake these images when they are displayed
var SHAKE_IMGS = [];
function setImagesToShake(shakeImgs) {
	SHAKE_IMGS = shakeImgs;
}

function getImagesToShake() {
	return SHAKE_IMGS;
}

// This needs to be setup in the page's HTML.
const X_REF = new Map();

function getCrossRefMap() {
	return X_REF;
}

function addCrossRef(imgId, txtIds) {
	for (let i = 0; i < txtIds.length; i++) {
		getCrossRefMap().set("" + txtIds[i], imgId);
	}

}


const REGULAR_TITLE = document.title;
const PANIC_TITLE = "Excel";
var IS_PANIC_ON = false;
var BOOKMARK = -100;


// #######################################################
// general functions
// #######################################################
function crossRef(i) {
	var ret = "";
	if (getCrossRefMap().has("" + i)) {
		ret = getCrossRefMap().get("" + i);
	} else {
		alert("Img \"" + i + "\" not found!");
	}
	return ret;
}

function getFileName(pref, idx) {
	return "./" + getFolderName() + "/" + pref + "/" + pref + " (" + idx + ").png";
}

function getImgName(img) {
	return getFileName("top", crossRef(img));
}

function getTxtName(txt) {
	return getFileName("txt", txt);
}

function imgExists(imgId) {
	return imgId >= 0 && imgId <= getLastImg();
}

function showPOI(id) {
	document.getElementById("poi_" + id).style.display = "block";
}

function showAllPOIs() {
	for (let i = 0; i < getPOIs().length; i++) {
		showPOI(getPOIs()[i]);
	}
}

function updImg(id, inc) {
	var temp_id = id + inc;
	if (imgExists(temp_id)) {
		if (temp_id == 0 || temp_id == LAST_IMG) {
			if (temp_id == 0) {
				document.getElementById("img_top").src = "./" + getFolderName() + "/home.png";
			} else {
				document.getElementById("img_top").src = "./" + getFolderName() + "/end.png";
			}
			document.getElementById("img_text").src = "";
		} else {
			var tmp_img_name = getImgName(temp_id);
			if (document.getElementById("img_top").src != tmp_img_name) {
				document.getElementById("img_top").src = tmp_img_name;
			}
			document.getElementById("img_text").src = getTxtName(temp_id);
		}
		setTextId(temp_id);

		if (getImagesToShake().includes(getTextId())) {
			document.getElementById("img_table").style = "animation: shake 0.5s; animation-iteration-count: 1;";
		} else {
			document.getElementById("img_table").style = "";
		}
		if (getPOIs().includes(getTextId())) {
			showPOI(getTextId());
		}
	}
}

function next() {
	updImg(getTextId(), 1);
}

function home() {
	updImg(0, 0);
}

function end() {
	updImg(getLastImg(), 0);
}

function previous() {
	updImg(getTextId(), -1);
}

function scroller() {
	document.getElementById("body_id").addEventListener('wheel', (event) => {
		if (IS_PANIC_ON) {
			return;
		}

		if (event.deltaY < 0) {
			previous();
		} else {
			next();
		}
	});
}

function checkKey(event) {
	if (IS_PANIC_ON) {
		return;
	}

	var x = event.key;

	switch (x) {
		case "Home": home(); break;
		case "End": end(); break;
		case "ArrowLeft": case "ArrowUp": previous(); break;
		case "ArrowRight": case "ArrowDown": next(); break;
	}
}

function fixAllImages() {
	var allImages = document.getElementsByTagName('img');

	for (var i = 0; i < allImages.length ; i++) {
		if (allImages[i].style.display == "none") {
			allImages[i].style.display = "block";
		} else {
			allImages[i].style.display = "none";
		}
	}

	if (document.getElementById("poi_td").style.display == "none") {
		document.getElementById("poi_td").style.display = "block";
	} else {
		document.getElementById("poi_td").style.display = "none";
	}
}

function panicOn() {
	IS_PANIC_ON = true;
	fixAllImages();
	document.title = PANIC_TITLE;
	document.getElementById("panic").style = "";
	document.getElementById("panic").style.display = "none";
}

function panicOff() {
	IS_PANIC_ON = false;
	fixAllImages();
	document.title = REGULAR_TITLE;
}

function shake() {
	document.getElementById("panic").style = "animation: shake 0.5s; animation-iteration-count: infinite;";
}

function noShake() {
	document.getElementById("panic").style = "";
	if (IS_PANIC_ON) {
		document.getElementById("panic").style.display = "none";
	} else {
		document.getElementById("panic").style.display = "block";
	}
}

function setBookmark() {
	BOOKMARK = getTextId();
	document.getElementById("bookmarkGo").classList.add("clickable");
	document.getElementById("bookmarkGo").classList.remove("disabled");
}

function goToBookmark() {
	if (getTextId() != BOOKMARK) {
		updImg(BOOKMARK, 0);
	}
}

function onLoad() {
	home();
	scroller();
}
