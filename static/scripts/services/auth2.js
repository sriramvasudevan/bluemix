'use strict';

app.factory('Auth2', function ($firebase, $firebaseAuth) {
    var ref = new Firebase('https://issuemail.firebaseio.com/');
    return $firebaseAuth(ref);
});