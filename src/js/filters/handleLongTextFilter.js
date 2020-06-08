(function() {
    'use strict';

    angular
        .module("firebase-example-app")
        .filter('handleLongText', handleLongText);

    function handleLongText() {
        return function (str, cutoffLength) {

            // TODO: Define the filter's behavior.

            return '';  // TODO: Return the formatted string.
        };
    }
})();
