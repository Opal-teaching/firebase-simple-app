(function(){
	var module = angular.module("firebase-example-app");
	/**
	 * @ngdoc controller
	 * @name firebase-example-app.controller:ListController
	 * @description Controls the message list and communicates with Firebase
	 * @requires $scope
	 * @requires $timeout
	 * @description Manages ./views/list.html
	 */
	module.controller("ListController",ListController);
	ListController.$inject = ["$scope","$timeout"];

	function ListController($scope,$timeout) {

		// Scope variables
		var vm = this;
		vm.messages = [];
		vm.messageContent = "";
		vm.disableButtons = false;
		vm.loading = true;
		// Scope Functions
		vm.clearMessages = clearMessages;
		vm.pushPost= pushPost;

		// local variables
		var messageCounter = 0;
		var ref = firebase.database().ref();
		var refMessages = ref.child("messages");

		initController();

		/////////////////////////////////
		/**
		 * @ngdoc method
		 * @name firebase-example-app.controller:ListController#initController
		 * @methodOf firebase-example-app.controller:ListController
		 * @description Instantiates vm.messages through a firebase events, then sets
		 *              a child_added event to listen to changes.
		 */
		function initController()
		{
			// 1. TODO: Instantiate a 'once' event of type "value" on the messages reference,
			// This event will instantiate the messages for the application, set
			// the local array vm.messages, and set the messageCounter to vm.messages.length
			// See Object.values() to get an array with the values of an object
			// Use vm.loading in the callback to stop showing the loading
			// Remember to use $timeout(function(){}) in
		    // the callback otherwise AngularJS won't be notified of your changes.





			// 2. TODO: Add a firebase 'on' event of type "child_added", and listen to changes in messages.
			// Upon arrival of a message, add it to the vm.messages array.
		}


		/**
		 * @ngdoc method
		 * @name firebase-example-app.controller:ListController#pushPost
		 * @methodOf firebase-example-app.controller:ListController
		 * @description Pushes new message to Firebase
		 */
		function pushPost(){
			// 3. TODO: Push posts, use ref.push, if the call fails, catch the promise and display an alert
			// Use counter to create message and increment  messageCounter if the message is successfully sent.
			// (i.e. then clause of ref.push)
			// Format for messages {content:"..",time: firebase.database.ServerValue.TIMESTAMP,id:messageCounter}
			if(vm.messageContent !== "")
			{
				vm.disableButtons = true;
				/** Enter code here */
			}
			vm.messageContent = "";
		}
		 /**
		 * @ngdoc method
		 * @name firebase-example-app.controller:ListController#clearMessages
		 * @methodOf firebase-example-app.controller:ListController
		 * @description Clears messages
		 */
		function clearMessages(){
			// 4. TODO: Clear posts, use ref.set, if the call fails, catch the promise if failed and display an onsen alert
			vm.messages = [];
		}

		/**
		 * @ngdoc event
		 * @name firebase-example-app.controller:ListController#$destroy
		 * @eventOf firebase-example-app.controller:ListController
		 * @description Listens to the controller destruction and kills event listeners.
		 */
		$scope.$on("$destroy",function () {
			refMessages.off();
			ref.off();
		});

	}
})();
