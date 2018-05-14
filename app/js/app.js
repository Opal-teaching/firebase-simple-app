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
        apiKey: "AIzaSyAe0N7VjZGx0UoWbEutIU8M4aUeYR_57OA",
        authDomain: "opal-tutorial-f6959.firebaseapp.com",
        databaseURL: "https://opal-tutorial-f6959.firebaseio.com",
        projectId: "opal-tutorial-f6959",
        storageBucket: "opal-tutorial-f6959.appspot.com",
        messagingSenderId: "513861825891"
    };
    firebase.initializeApp(config);
})();