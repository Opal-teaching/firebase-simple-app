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
        apiKey: "AIzaSyBBAzjREAhJiLL0_4r_x_OthmVF5sgmFxo",
        authDomain: "messaging-9fbff.firebaseapp.com",
        databaseURL: "https://messaging-9fbff.firebaseio.com",
        projectId: "messaging-9fbff",
        storageBucket: "messaging-9fbff.appspot.com",
        messagingSenderId: "45265218773"
    };
	firebase.initializeApp(config);
})();