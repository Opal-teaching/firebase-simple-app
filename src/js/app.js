import angular from "angular";
import firebase from "firebase";
import "onsenui/js/onsenui";
import "onsenui/css/onsen-css-components-blue-basic-theme.css";
import "onsenui/css/onsenui.css";
import "../css/app.css";

/**
 * @ngdoc overview
 * @name firebase-example-app
 * @description Module for the firebase-app example
 * @requires onsen
 * @type {module|angular.Module}
 */
angular
	.module("firebase-example-app", ['onsen']);

let firebaseConfig  = {
	// TODO: Get your own firebase realtime database, and paste its config information below.
	// apiKey: "...",
	// authDomain: "...",
	// databaseURL: "...",
	// projectId: "...",
	// storageBucket: "...",
	// messagingSenderId: "..."
};

firebase.initializeApp(firebaseConfig);
