// Language
var LANGUAGE = "en";

// FOLDER_NAME is the folder where the files specific to this page can be found.
// This needs to be setup in the page's HTML, otherwise the page will fail to load
var FOLDER_NAME = "";
function setFolderName(folderName) {
	FOLDER_NAME = folderName;
}

function getFolderName() {
	return FOLDER_NAME;
}

// SCENE_ID is the current image in display
var SCENE_ID = 0;
function setSceneId(textId) {
	SCENE_ID = textId;
}

function getSceneId() {
	return SCENE_ID;
}

const SPEAKS = "SPEAKS";
const THINKS = "THINKS";
const NARRATES = "NARRATES";

// Text
function Text(_actor, _action, _img) {
	this.actor = _actor;
	this.action = _action;
	this.img = _img;
}

// Scene
function Scene(_seq, _texts) {
	this.seq = _seq;
	this.texts = _texts;
	this.textIdx = 0;
	this.setTextIdx = function(_idx) {
		this.textIdx = _idx;
	}
	this.getTextIdx = function() {
		return this.textIdx;
	}
}

// #############################################################################
// #############################################################################
// Scenes setup - begin
// #############################################################################
// #############################################################################
const SCENES = new Map();
// #############################################################################
// #############################################################################
// Scenes setup - end
// #############################################################################
// #############################################################################


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


function Bookmark(_scene, _txtIdx) {
	this.scene = _scene;
	this.txtIdx = _txtIdx;
}

const REGULAR_TITLE = document.title;
const PANIC_TITLE = "Excel";
var IS_PANIC_ON = false;
const BOOKMARK = new Bookmark(-100, -100);


// #######################################################
// general functions
// #######################################################
function showPOI(id) {
	document.getElementById("poi_" + id).style.display = "block";
}

function showAllPOIs() {
	for (let i = 0; i < getPOIs().length; i++) {
		showPOI(getPOIs()[i]);
	}
}

function getImgText(_type) {
	if (NARRATES == _type) {
		return "text_narrate";
	} else if (SPEAKS == _type) {
		return "text_speak";
	} else if (THINKS == _type) {
		return "text_think";
	} else {
		return "text_bg";
	}
}

function showMiniHead(actorName) {
	if ("" == actorName) {
		document.getElementById("img_mini").src = "";
	} else {
		document.getElementById("img_mini").src = "./actors/" + actorName + "-mini.webp";
	}
}

function showText(_scene) {
	var _txt = _scene.texts[_scene.getTextIdx()];
	document.getElementById("divActor").innerHTML = "<b><u>" + _txt.actor + "</u></b>";

	let __scene = SPEECHES.scenes.find(s => s.scene === getSceneId());
	let __take = __scene.takes.find(t => t.take === (_scene.getTextIdx() + 1));
	document.getElementById("img_text").src = "./" + getImgText(__take.type) + ".png";
	document.getElementById("divSpeech").innerHTML = eval("__take." + LANGUAGE);

	showMiniHead(_txt.actor);
}

function showScene(_scene) {
	var _sceneId = ("" + _scene.seq).padStart(3, '0') + "000";
	var _imgIdx = "0";
	if (_scene.texts.length > 0) {
		_imgIdx = _scene.texts[_scene.getTextIdx()].img;
	}
	var _imgId = ("" + _imgIdx).padStart(2, '0');
	document.getElementById("img_top").src = "./" + getFolderName() + "/" + _sceneId + "-" + _imgId + ".webp";

	showText(_scene);

	if (getImagesToShake().includes(_sceneId + "-" + _imgId)) {
		document.getElementById("img_table").style = "animation: shake 0.5s; animation-iteration-count: 1;";
	} else {
		document.getElementById("img_table").style = "";
	}
// TODO: fix images to shake and POIs
/*
	if (getPOIs().includes(getSceneId())) {
		showPOI(getSceneId());
	}
*/
}

function next() {
	if (getSceneId() < (SCENES.size - 1)) {
		var tmpScene = SCENES.get("" + getSceneId());
		if (null != tmpScene) {
			if (tmpScene.getTextIdx() >= (tmpScene.texts.length - 1)) {
				tmpScene.setTextIdx(tmpScene.texts.length - 1);
				setSceneId(getSceneId() + 1);
				tmpScene = SCENES.get("" + getSceneId());
				tmpScene.setTextIdx(0);
			} else {
				tmpScene.setTextIdx(tmpScene.getTextIdx() + 1);
			}
			showScene(tmpScene);
		}
	}
}

function home() {
	setSceneId(0);
	showScene(SCENES.get("0"));
}

function end() {
	setSceneId(SCENES.size - 1);
	showScene(SCENES.get("" + (SCENES.size - 1)));
}

function previous() {
	if (getSceneId() > 0) {
		var tmpScene = SCENES.get("" + getSceneId());
		if (null != tmpScene) {
			if (tmpScene.getTextIdx() < 1) {
				tmpScene.setTextIdx(0);
				setSceneId(getSceneId() - 1);
				tmpScene = SCENES.get("" + getSceneId());
				tmpScene.setTextIdx(tmpScene.texts.length - 1);
			} else {
				tmpScene.setTextIdx(tmpScene.getTextIdx() - 1);
			}
			showScene(tmpScene);
		}
	}
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

function showOrHide(_id) {
	if (document.getElementById(_id).style.display == "none") {
		document.getElementById(_id).style.display = "block";
	} else {
		document.getElementById(_id).style.display = "none";
	}
}

function panicOn() {
	IS_PANIC_ON = true;
	document.getElementById("mainTR").style.display = "none";
	document.getElementById("excel").style.display = "block";
	document.title = PANIC_TITLE;
	showOrHide("divVersion");
}

function panicOff() {
	IS_PANIC_ON = false;
	document.getElementById("mainTR").style.display = "block";
	document.getElementById("excel").style.display = "none";
	document.title = REGULAR_TITLE;
	showOrHide("divVersion");
}

function shake() {
	document.getElementById("panic").style = "animation: shake 0.5s; animation-iteration-count: infinite;";
}

function noShake() {
	document.getElementById("panic").style = "";
}

function setBookmark() {
	BOOKMARK.scene = getSceneId();
	BOOKMARK.txtIdx = SCENES.get("" + getSceneId()).getTextIdx();
	document.getElementById("bookmarkGo").classList.add("clickable");
	document.getElementById("bookmarkGo").classList.remove("disabled");
}

function goToBookmark() {
	setSceneId(BOOKMARK.scene);
	SCENES.get("" + getSceneId()).setTextIdx(BOOKMARK.txtIdx);
	showScene(SCENES.get("" + getSceneId()));
}

function udpateLanguage() {
	LANGUAGE = document.getElementById("selLanguage").value;
	showScene(SCENES.get("" + getSceneId()));
}

function loadData() {
	var txts = [];

	for (var scn of SPEECHES.scenes) {
		txts = [];
		for (var take of scn.takes) {
			txts.push(new Text(take.speaker, take.type, take.image));
		}
		SCENES.set("" + scn.scene, new Scene("" + scn.scene, txts));
	}
}

function openPage(url) {
	window.open(url);
}

function onLoad() {
	// first we need to load the json data into JS objects
	loadData();

	// then we can display the home page
	home();

	// and we config the scroller
	scroller();
}

