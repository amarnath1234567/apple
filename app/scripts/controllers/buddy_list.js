'use strict';

/**
 * # BuddyListCtrl
 * Controller of the AppleApp
 */
angular.module('AppleApp')
	.controller('BuddyListCtrl', function($scope, $http, $modal) {
		$scope.list = [];
		$scope.status = ['Available', 'Busy', 'Idle', 'Offline'];
		$scope.toggleInformation = function(key) {
			if ($scope.active !== key) {
				if ($scope.active !== undefined) {
					$scope.list[$scope.active].active = false;
				}
				$scope.active = key;
				$scope.list[key].active = true;
			} else {
				$scope.list[$scope.active].active = false;
				delete $scope.active;
			}
		};
		$scope.delete = function(key) {
			var modalInstance = $modal.open({
				templateUrl: 'views/modal.html',
				controller: function($scope, $modalInstance, data) {
					$scope.data = data;
					$scope.ok = function() {
						$modalInstance.close(true);
					};

					$scope.cancel = function() {
						$modalInstance.dismiss('cancel');
					};
				},
				size: 'md',
				resolve: {
					data: function() {
						return {
							'title': 'Confirm delete',
							'text': 'Are you sure you want to delete this buddy?'
						};
					}
				}
			});

			modalInstance.result.then(function(response) {
				if (response) {
					$scope.list.splice(key, 1);
				}
			});
		};
		$scope.add = function() {
			var modalInstance = $modal.open({
				templateUrl: 'views/modal.html',
				controller: function($scope, $modalInstance, data) {
					$scope.data = data;
					$scope.dt = new Date();
					$scope.dateOptions = {
						formatYear: 'yy',
						startingDay: 1
					};
					$scope.open = function($event) {
						$event.preventDefault();
						$event.stopPropagation();

						$scope.opened = true;
					};
					var initAdd = function() {
						$scope.add = {
							'username': '',
							'firstName': '',
							'lastName': '',
							'status': 0,
							'emailAddress': '',
							'bio': ''
						};
						$scope.dt = new Date();
						$scope.adding = false;
					};
					initAdd();
					$scope.ok = function() {
						$modalInstance.close({
							'dt': $scope.dt,
							'add': $scope.add
						});
					};

					$scope.cancel = function() {
						$modalInstance.dismiss('cancel');
					};
				},
				size: 'lg',
				resolve: {
					data: function() {
						return {
							'title': 'Add buddy',
							'add': true,
							'status': $scope.status
						};
					}
				}
			});

			modalInstance.result.then(function(response) {
				if (response) {
					var add = {
						'birthday': moment(response.dt).format('MM/DD/YYYY')
					};
					angular.forEach(response.add, function(element, index) {
						add[index] = element;
					});
					$scope.list.push(add);
				}
			});
		};
		$scope.prioritize = function(param) {
			if ($scope.sortData !== param) {
				$scope.sortData = param;
				$scope.sortAsc = true;
			} else {
				$scope.sortAsc = !$scope.sortAsc;
			}
			console.log($scope.sortData);
			console.log($scope.sortAsc);
		};
		$http.get('data.json').success(function(response) {
			$scope.list = response;
		});
	});
