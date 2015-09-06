'use strict';

app.controller('WelcomeCtrl', function ($firebase, $state, $scope, Auth2, Auth) {
    var ref = new Firebase("https://issuemail.firebaseio.com/");
    
    Auth2.$onAuth(function (authData) {
        if (authData) {
            $scope.authData = authData;
        }
    });

    $scope.user = {};

    $scope.create_profile = function() {
        Auth.createProfile($scope.user, $scope.authData);
    };
});