(function(){
	/**
	 * @ngdoc overview
	 * @name firebase-example-app
	 * @description Module for the firebase-app example
	 * @requires onsen
	 * @type {module|angular.Module}
	 */
	angular.module("firebase-example-app",["onsen"]);
	var config = {
		apiKey: "AIzaSyAecgPPBQA0XDjkV98hKGfY9EC6DUQrWYA",
		authDomain: "opal-tutorial.firebaseapp.com",
		databaseURL: "https://opal-tutorial.firebaseio.com",
		projectId: "opal-tutorial",
		storageBucket: "opal-tutorial.appspot.com",
		messagingSenderId: "330623088918"
	};
	firebase.initializeApp(config);
})();