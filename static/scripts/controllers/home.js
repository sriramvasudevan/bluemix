'use strict';

app.controller('HomeCtrl', function ($scope, Auth, $state) {
    $scope.user = {};
    
    $scope.login = function () {
        Auth.login($scope.user).then(function () {
            $scope.user.email = null;
            $scope.user.password = null;
        }).catch(function (error) {
            alert(error);
        });
    };
    
    $scope.signup = function () {
        Auth.register($scope.user).then(function () {
            alert('success!');
            Auth.login($scope.user);
            $state.go("auth.welcome");
            $scope.user.email = null;
            $scope.user.password = null;
        }).catch(function (error) {
            alert(error);
        });
    };
});