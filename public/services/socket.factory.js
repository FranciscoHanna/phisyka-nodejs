(function() {
	'use strict';

	angular
		.module('myApp')
		.factory('socketService', socketService);

	socketService.$inject = ['socketFactory'];

	function socketService(socketFactory) {
		
		var socket = socketFactory();

		socket.forward('sensorA');
		socket.forward('sensorB');
		
		return socket;
	}
})();