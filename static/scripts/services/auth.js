'use strict';

app.factory('Auth', function ($firebase, $firebaseAuth) {
    var ref = new Firebase('https://issuemail.firebaseio.com/');
    var auth = $firebaseAuth(ref);

    var Auth = {
        register: function (user) {
            return auth.$createUser({
                email: user.email,
                password: user.password
            });
        },
        login: function (user) {
            return auth.$authWithPassword({
                email: user.email,
                password: user.password
            });
        }
    };

    return Auth;
});