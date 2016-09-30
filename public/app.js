(function(){
    'use strict';

    angular
        .module('myApp', ['btford.socket-io'])
        .controller('ArduController', ArduController);

    ArduController.$inject = ['$scope', 'socketService'];

    function ArduController($scope, socketService) {

        // Evento de datos del sensor A
        $scope.$on('socket:sensorA', function(ev, data){
            console.log(data);
            $scope.timeA = data.timeA.toFixed(2);
        });

        // Evento de datos del sensor B
        $scope.$on('socket:sensorB', function(ev, data){
            console.log(data);
            $scope.timeB = data.timeB.toFixed(2);
        });
    }
})();

