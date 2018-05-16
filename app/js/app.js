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
        apiKey: "AIzaSyB4BDuA3r6cYq_Xcanjz6qtJg1bXDE6LSY",
        authDomain: "messaging-app-a18cc.firebaseapp.com",
        databaseURL: "https://messaging-app-a18cc.firebaseio.com",
        projectId: "messaging-app-a18cc",
        storageBucket: "messaging-app-a18cc.appspot.com",
        messagingSenderId: "371850220591"
    };
	firebase.initializeApp(config);
})();