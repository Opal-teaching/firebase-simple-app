(function(){
	var module = angular.module("firebase-example-app");

    module.filter("handleLongText", HandleLongText);
    HandleLongText.$inject = [];

    /**
     * @ngdoc filter
     * @name firebase-example-app.filter:handleLongText
     * @param {string} text Text to be processed
     * @param {string|number} maxLength Maximum length accepted for a text
     * @description if the text is longer than maxLength then it is cut off
     * @returns {Function}
     * @constructor
     */
    function HandleLongText()
    {
        HandleLongText.$stateful = true;

        return function(text, maxLength)
        {
            maxLength = Number(maxLength);
            if(typeof text !== 'string' || isNaN(maxLength) || text.length < maxLength)
            {
                return text;
            }
            if (text.length > maxLength)
            {
                return text.substring(0, maxLength);
            }
        }
    }

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
		vm.pushPost = pushPost;

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

			// refMessages.once("value",function(snap){
			// 	$timeout(function(){
			// 		vm.messages = Object.values(snap);
			// 		messageCounter = vm.messages.length;
			// 		vm.loading = false;
			// 	});
			// });

			// 2. TODO: Add a firebase 'on' event of type "child_added", and listen to changes in messages.
			// Upon arrival of a message, add it to the vm.messages array.

			refMessages.on("child_added", function(snap){
				$timeout(function(){
					vm.messages.push(snap.val());
                    messageCounter = vm.messages.length;
					vm.loading = false;
				});
			});
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
				var new_message = {
					content:vm.messageContent,
					time:firebase.database.ServerValue.TIMESTAMP,
					id:messageCounter,
				};

				refMessages.push(new_message)
					.then(function(){
						messageCounter++;
						vm.disableButtons = false;      // why clear is disabled after sending a message?
					}).catch(function(err){
						alert("Error sending message: " + err);
				});
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
			refMessages.set(null)
				.then(()=>{})
				.catch(function(err){
					alert("Error clearing messages: " + err);
				});
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
