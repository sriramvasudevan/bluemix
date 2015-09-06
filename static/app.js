'use strict';

var app = angular
    .module('issue', [
  'ui.router',
  'ui.bootstrap',
  'firebase',
  'smoothScroll'
])
    .config(function ($stateProvider, $urlRouterProvider) {
        //
        // For any unmatched url, redirect to /state1
        $urlRouterProvider.otherwise("/");
        
        $urlRouterProvider.when('/feed', '/feed/0');
        //
        // Now set up the states
        $stateProvider
            .state('unauth', {
                url: "/",
                templateUrl: "partials/home.html",
                resolve: {
                    authentication: function ($state, Auth2) {
                        return Auth2.$onAuth(function (authData) {
                            if (authData) {
                                $state.go('auth.preferences');
                            }
                        });
                    }
                }
            })
            .state('auth', {
                url: "/",
                templateUrl: "partials/auth.html",
                resolve: {
                    authentication: function ($state, Auth2) {
                        return Auth2.$onAuth(function (authData) {
                            if (!authData) {
                                $state.go('unauth');
                            }
                        });
                    }
                }

            })
            .state('auth.feed', {
                url: "feed/:issue",
                templateUrl: "partials/auth.feed.html"
            })
            .state('auth.article', {
                url: "article/:articleId",
                templateUrl: "partials/auth.article.html"
            })
            .state('auth.preferences', {
                url: "preferences",
                templateUrl: "partials/auth.preferences.html"
            })
            .state('auth.welcome', {
                url: "welcome",
                templateUrl: "partials/auth.welcome.html"
            })
            .state('auth.follow', {
                url: "follow",
                templateUrl: "partials/auth.follow.html"
            })
            .state('auth.change_pass', {
                url: "change_pass",
                templateUrl: "partials/auth.change_pass.html"
            })
            .state('auth.article.discuss', {
                url: "article/discuss/:discussId",
                templateUrl: "partials/auth.article.discuss.html"
            });
    });