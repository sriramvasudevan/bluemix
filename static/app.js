'use strict';

var app = angular
    .module('issue', [
  'ui.router',
  'ui.bootstrap',
  'firebase'
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
                templateUrl: "static/partials/home.html",
                resolve: {
                    authentication: function ($state, Auth2) {
                        return Auth2.$onAuth(function (authData) {
                            if (authData) {
                                $state.go('auth.feed');
                            }
                        });
                    }
                }
            })
            .state('auth', {
                url: "/",
                templateUrl: "static/partials/auth.html",
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
                url: "feed",
                templateUrl: "static/partials/auth.feed.html"
            })
            .state('auth.article', {
                url: "article/:articleId",
                templateUrl: "static/partials/auth.article.html"
            })
            .state('auth.preferences', {
                url: "preferences",
                templateUrl: "static/partials/auth.preferences.html"
            })
            .state('auth.follow', {
                url: "follow",
                templateUrl: "static/partials/auth.follow.html"
            })
            .state('auth.change_pass', {
                url: "change_pass",
                templateUrl: "static/partials/auth.change_pass.html"
            })
            .state('auth.article.discuss', {
                url: "article/discuss/:discussId",
                templateUrl: "static/partials/auth.article.discuss.html"
            });
    });