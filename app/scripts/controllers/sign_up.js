'use strict';

/**
 * # SignupCtrl
 * Controller of the AppleApp
 */
angular.module('AppleApp')
	.controller('SignUpCtrl', function($scope, $rootScope, $location) {
		$scope.error = {};
		$scope.formDirty = false;
		var validateField = function(field, options) {
				delete $scope.error[field];
				if (options.required && ($scope[field] === undefined || $scope[field] === '')) {
					$scope.error[field] = options.title + ' is required';
					return false;
				}
				if ($scope[field] === undefined) {
					$scope[field] = '';
				}
				if (options.email && !/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i.test($scope[field])) {
					$scope.error[field] = options.title + ' must be a valid email';
					return false;
				}
				if (options.maxLength && $scope[field].length > options.maxLength) {
					$scope.error[field] = options.title + ' cannot be longer than ' + options.maxLength + ' characters';
					return false;
				}
				if (options.minLength && $scope[field].length < options.minLength) {
					$scope.error[field] = options.title + ' must have at least ' + options.minLength + ' characters';
					return false;
				}
				if (options.characterOnly && $scope[field] !== '' && !/^[A-z]+$/.test($scope[field])) {
					$scope.error[field] = 'Letter only';
					return false;
				}
				if (options.match && $scope[field] !== $scope[options.match]) {
					$scope.error[field] = options.title + ' and ' + options.matchTitle + ' are not mached';
					return false;
				}
				if (options.date) {
					var dateArr = $scope[field].split('/'),
						errorFormatStr = options.title + '\'s format is not correct, should be "MM/DD/YYYY"',
						m = parseInt(dateArr[0]),
						d = parseInt(dateArr[1]),
						y = parseInt(dateArr[2]);
					if (dateArr.length !== 3 || dateArr[0].length !== 2 || dateArr[1].length !== 2 || dateArr[2].length !== 4 || !d || !m || !y || d < 0) {
						$scope.error[field] = errorFormatStr;
						return false;
					}
					switch (m) {
						case 1:
						case 3:
						case 5:
						case 7:
						case 8:
						case 10:
						case 12:
							if (d > 31) {
								$scope.error[field] = errorFormatStr;
								return false;
							}
							break;
						case 2:
							if ((y % 4 && d > 28) || d > 29) {
								$scope.error[field] = errorFormatStr;
								return false;
							}
							break;
						case 4:
						case 6:
						case 9:
						case 11:
							if (d > 30) {
								$scope.error[field] = errorFormatStr;
								return false;
							}
							break;
						default:
							$scope.error[field] = errorFormatStr;
							return false;
					}
					if (options.age) {
						var date = new Date($scope[field]),
							age = moment().diff(date, 'months');
						if (options.age.max) {
							if (age > options.age.max * 12) {
								$scope.error[field] = 'User age can not be more than ' + options.age.max;
								return false;
							}
						}
						if (options.age.min) {
							if (age < options.age.min * 12) {
								$scope.error[field] = 'User age can not be less than ' + options.age.min;
								return false;
							}
						}
					}
				}
				return true;
			},
			validateList = [{
				'field': 'username',
				'options': {
					'title': 'Username',
					'maxLength': 56,
					'email': true,
					'required': true
				}
			}, {
				'field': 'password',
				'options': {
					'title': 'Password',
					'minLength': 6,
					'required': true
				}
			}, {
				'field': 'confirmPassword',
				'options': {
					'title': 'Confirm password',
					'match': 'password',
					'matchTitle': 'Password',
					'required': true
				}
			}, {
				'field': 'firstName',
				'options': {
					'title': 'First Name',
					'maxLength': 50,
					'characterOnly': true,
					'required': true
				}
			}, {
				'field': 'lastName',
				'options': {
					'title': 'Last Name',
					'characterOnly': true,
					'maxLength': 50
				}
			}, {
				'field': 'birthday',
				'options': {
					'title': 'Birthday',
					'date': true,
					'age': {
						'max': 150,
						'min': 14
					},
					'required': true
				}
			}],
			submitForm = function() {
				$rootScope.user = {
					'username': $scope.username,
					'password': $scope.password,
					'firstName': $scope.firstName,
					'lastName': $scope.lastName,
					'birthday': new Date($scope.birthday).toISOString()
				};
				$location.path('sign_up_success');
			};
		$scope.validate = function(dirty) {
			if (dirty || $scope.formDirty) {
				$scope.formDirty = true;
				delete $scope.error.form;
				for (var i in validateList) {
					var item = validateList[i];
					if (!validateField(item.field, item.options)) {
						$scope.error.form = 'Error summitting form';
					}
				}
				if (!$scope.error.form) {
					submitForm();
				}
			}
		};
	});
