'use strict';

var app = angular
    .module('issue', [
  'ui.router',
  'ui.bootstrap'

])
    .config(function ($stateProvider, $urlRouterProvider) {
        //
        // For any unmatched url, redirect to /state1
        $urlRouterProvider.otherwise("/");
        //
        // Now set up the states
        $stateProvider
            .state('unauth', {
                url: "/",
                templateUrl: "partials/home.html"
            })
            .state('auth', {
                url: "/",
                templateUrl: "partials/auth.html"
            })
            .state('auth.feed', {
                url: "feed",
                templateUrl: "partials/auth.feed.html"
            })
            .state('auth.article', {
                url: "article",
                templateUrl: "partials/auth.article.html"
            })
            .state('auth.follow', {
                url: "follow",
                templateUrl: "partials/auth.follow.html"
            })
            .state('auth.discuss', {
                url: "discuss",
                templateUrl: "partials/auth.discuss.html"
            });
    });