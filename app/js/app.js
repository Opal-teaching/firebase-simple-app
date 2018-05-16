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
        apiKey: "AIzaSyBvOHi6rquYpr1sp1_NR9GGOZN_OZ3gldQ",
        authDomain: "fir-test-project-d4a04.firebaseapp.com",
        databaseURL: "https://fir-test-project-d4a04.firebaseio.com",
        projectId: "fir-test-project-d4a04",
        storageBucket: "fir-test-project-d4a04.appspot.com",
        messagingSenderId: "106367047301"
    };
    firebase.initializeApp(config);
})();