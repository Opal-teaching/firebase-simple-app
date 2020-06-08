(function() {
	'use strict';

	/**
	 * @ngdoc controller
	 * @name firebase-example-app.controllers:ListController
	 * @description Controls the message list and communicates with Firebase.
	 * @requires $scope
	 * @requires $timeout
	 * @description Manages ./views/list.html
	 */
	angular
		.module("firebase-example-app")
		.controller("ListController", ListController);

	ListController.$inject = ["$scope","$timeout"];

	/* @ngInject */
	function ListController($scope, $timeout) {

		let vm = this;

		// Scope variables
		vm.messages = [];
		vm.messageContent = "";
		vm.disableButtons = false;
		vm.loading = true;

		// Scope functions
		vm.clearMessages = clearMessages;
		vm.pushPost= pushPost;

		// Local variables
		let messageCounter = 0;
		let ref = firebase.database().ref();
		let refMessages = ref.child("messages");

		activate();

		/////////////////////////////////

		/**
		 * @ngdoc method
		 * @name firebase-example-app.controllers:ListController#activate
		 * @methodOf firebase-example-app.controllers:ListController
		 * @description Instantiates vm.messages through a firebase event, then sets a child_added event
		 *              to listen for changes.
		 */
		function activate()
		{
			/* 1. TODO: Instantiate a 'once' event listener of type 'value' on the messages reference (refMessages).
			 *          This event will instantiate the messages for the application,
			 *          set the local array vm.messages, and set the messageCounter to vm.messages.length.
			 *          See Object.values() to get an array with the values of an object.
			 *          Use vm.loading in the callback to stop showing the spinning loading icon.
			 *          Remember to use $timeout(function(){}) in the callback, otherwise AngularJS
			 *          won't be notified of your changes.
			 */

			/* 2. TODO: Add a firebase 'on' event listener of type 'child_added' to listen to changes in messages.
			 *          Upon arrival of a message, add it to the vm.messages array.
			 *          Pay attention to the behaviour of the 'on' listener. Does it cover the same behaviour as the
			 *          first listener (making it redundant), or do they each fulfill a different purpose? Based on
			 *          your answer, decide whether to keep one or both listeners in your code.
			 */
		}

		/**
		 * @ngdoc method
		 * @name firebase-example-app.controllers:ListController#pushPost
		 * @methodOf firebase-example-app.controllers:ListController
		 * @description Pushes a new message to Firebase.
		 */
		function pushPost(){
			/* 3. TODO: Push the message typed in the input box to Firebase using .push.
			 *          If the call fails, catch the promise and display an ons.notification.alert.
			 *          Reference: https://onsen.io/v1/reference/ons.notification.html
			 *          Increment messageCounter if the message is successfully sent (using the .then clause
			 *          after .push).
			 *          Message format: {
			 *              content: "...",
			 *              time: firebase.database.ServerValue.TIMESTAMP,
			 *              id: messageCounter
			 *          }
			 */

			if(vm.messageContent !== "")
			{
				vm.disableButtons = true;
				// TODO Add your code here
			}

			// Clear the input field
			vm.messageContent = "";
		}

		 /**
		 * @ngdoc method
		 * @name firebase-example-app.controllers:ListController#clearMessages
		 * @methodOf firebase-example-app.controllers:ListController
		 * @description Clears all messages from Firebase.
		 */
		function clearMessages(){
			/* 4. TODO: Clear all messages from Firebase using .set. If the call fails, catch the promise and display
			 *          an ons.notification.alert.
			 */
		}

		/**
		 * @ngdoc event
		 * @name firebase-example-app.controllers:ListController#$destroy
		 * @eventOf firebase-example-app.controllers:ListController
		 * @description Listens for the controller's destruction and removes event listeners (cleanup).
		 */
		$scope.$on("$destroy",function () {
			refMessages.off();
			ref.off();
		});
	}
})();
