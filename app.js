var app = angular.module('sma', [])

app.controller('smaCtrl', function($scope, $interval, $rootScope, env, agent){

	$scope.board = new env.Board();
	$scope.agentTypes = ['Reflex Agent', 'Model-Based Reflex Agent']
	$scope.selectedAgent = $scope.agentTypes[1]
	$scope.boardTypes = ['Static', 'Dynamic']
	$scope.selectedBoard = $scope.boardTypes[0] 
	$rootScope.initialized = false
	$rootScope.victory = false

	$scope.initialize = function(){
		if ($rootScope.victory) {
			$rootScope.victory = false
			$scope.board = new env.Board();
		}
		$scope.agent = new agent[$scope.selectedAgent]();
		$scope.board.initializeBoard($scope.agent, $scope.selectedBoard);
		$rootScope.initialized=true
	}

});





