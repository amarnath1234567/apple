'use strict';

/**
 * @name AppleApp
 * Main module of the application.
 */
angular
	.module('AppleApp', [
		'ngRoute',
		'ui.bootstrap'
	])
	.config(function($routeProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'views/sign_up.html',
				controller: 'SignUpCtrl'
			})
			.when('/sign_up_success', {
				templateUrl: 'views/sign_up_success.html'
			})
			.when('/buddy_list', {
				templateUrl: 'views/buddy_list.html',
				controller: 'BuddyListCtrl'
			})
			.otherwise({
				redirectTo: '/'
			});
	});
