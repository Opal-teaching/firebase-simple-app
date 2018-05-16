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

	module.filter('handleLongText', function() {
		return function (string) {
			if (string) {
                return string.slice(0, 20);
			}
        }
	});

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
			// This event will instantiate the messaages for the application, set
			// the local array vm.messages, and set the messageCounter to vm.messages.length
			// See Object.values() to get an array with the values of an object
            // Use vm.loading in the callback to stop showing the loading
            // Remember to use $timeout(function(){}) in
            // the callback otherwise AngularJS won't be notified of your changes.
            refMessages.once('value', function (snapshot) {
                $timeout(function () {
                    if (snapshot.exists()) {
                        vm.messages = Object.values(snapshot.val());
                        messageCounter = vm.messages.length;
                    }
                    vm.loading = false;
                })
            });


            // Upon arrival of a message, add it to the vm.messages array.
            refMessages.on('child_added', function (snapshot) {
                if (snapshot.exists()) {
                    $timeout(function () {
                        vm.messages.push(snapshot.val());
                        console.log(vm.messages);
                    });
                }
            });
        }


		/**
		 * @ngdoc method
		 * @name firebase-example-app.controller:ListController#pushPost
		 * @methodOf firebase-example-app.controller:ListController
		 * @description Pushes new message to Firebase
		 */
        function pushPost() {
            // Use counter to create message and increment  messageCounter if the message is successfully sent.
            // (i.e. then clause of ref.push)
            // Format for messages {content:"..",time: firebase.database.ServerValue.TIMESTAMP,id:messageCounter}
            if (vm.messageContent !== "") {
                vm.disableButtons = true;
                var new_message = {
                    "messageContent": vm.messageContent,
                    "messageDate": firebase.database.ServerValue.TIMESTAMP,
                    "messageId": messageCounter.toString(),
                    "from": "Anton Gladyr"
                };

                refMessages.push(new_message, function (error) {
                    if (error) {
                        ons.notification.alert({
                            message: error.message,
                            title: 'Push error:',
                            buttonLabel: 'OK',
                            animation: 'default',
                            callback: function() {
                                // Alert button is closed!
                            }
                        });
                    } else {
                        $timeout(function () {
                            messageCounter++;
                            vm.disableButtons = false;
                            vm.messageContent = "";
						});
                    }
                });
            }
        }

		 /**
		 * @ngdoc method
		 * @name firebase-example-app.controller:ListController#clearMessages
		 * @methodOf firebase-example-app.controller:ListController
		 * @description Clears messages
		 */
         function clearMessages() {
             vm.messages = [];
             refMessages.set(null)
				 .catch(error => {
                     ons.notification.alert({
                         message: error.message,
                         title: 'Push error:',
                         buttonLabel: 'OK',
                         animation: 'default',
                         callback: function() {
                             // Alert button is closed!
                         }
                     });
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
