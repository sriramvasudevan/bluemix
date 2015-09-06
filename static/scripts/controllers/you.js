'use strict';

app.controller('YouCtrl', function ($firebase, $stateParams, $state, $http, $scope, Auth2) {
    var ref = new Firebase("https://issuemail.firebaseio.com/");

    $scope.logout = function () {
        if (confirm("Are you sure you want to log out?")) {
            Auth2.$unauth();
        }
    };

    $scope.user = {};

    $scope.change_pass = function () {
        if ($scope.user.pass === $scope.user.pass2 && $scope.user.pass != '' && $scope.user.email != '') {
            console.log($scope.user.email, $scope.user.old_pass, $scope.user.pass2);
            Auth2.$changePassword({
                email: $scope.user.email,
                oldPassword: $scope.user.old_pass,
                newPassword: $scope.user.pass2
            }).then(function () {
                alert("Password changed successfully!");
                $scope.user.pass2 = '';
                $scope.user.pass = '';
                $scope.user.email = '';
                $scope.user.old_pass = '';
            }).catch(function (error) {
                console.error("Error: ", error);
            });
        } else {
            return;
        }
    };

    $scope.profile =

        {
            'name': 'Jerry Liang',
            'first_name': 'Jerry',
            'last_name': 'Liang',
            'service': true,
            'email': 'jeriscc@gmail.com',
            'frequency': {
                'count': "Weekly",
                "timestamp": 1441495046
            },
            'issues': ['drought', 'lgbt']
        };
});