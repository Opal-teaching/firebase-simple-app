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
        var refMessagesContent = firebase.database().ref("messages/w8A8lYZ9wHh5ckxXK5VLY9xyt4t2w8A8lYZ9wHh5ckxXK5VLY9xyt4t2");

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

            vm.loading = false;
			// 2. TODO: Add a firebase 'on' event of type "child_added", and listen to changes in messages.
			// Upon arrival of a message, add it to the vm.messages array.

            refMessagesContent.on('child_added', (function(snapshot){
                console.log(snapshot.val());
                if(snapshot.exists()){
                    $timeout(()=>{
                        vm.messages.push(snapshot.val());
                    });
                    vm.messageCounter = vm.messages.length;

				}

            }))
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
				vm.disableButtons = false;
				/** Enter code here */

				try{
                    var msg = {messageContent:vm.messageContent,messageDate: firebase.database.ServerValue.TIMESTAMP,messageId:messageCounter}
                    refMessagesContent.push(msg);
                    vm.messageCounter++;
				}catch (e) {
					console.log(e);
                }
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
			 try{
                 refMessagesContent.set(null);
                 vm.messages = [];
                 vm.messageCounter = 0;
			 }catch (e) {
				 console.log(e);
             }

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

	module.filter("handleLongText", TextFilter);
	TextFilter.$inject = [];
	function TextFilter(){
		return function (text, textMaxLength) {
			if(text && typeof text === "string" && text.length > textMaxLength)
			{
                return text.substring(0,19);
			}
			return text;
        }
	}
})();
