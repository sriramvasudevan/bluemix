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
        },
        createProfile: function (user, authData) {
            var profile = {
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                name: user.first_name + " " + user.last_name,
                profile_image: authData.password.profileImageURL,
                issues: ['drought', 'airpollution', 'lgbt', 'netneutrality', 'foodwastage']
            };
            var profileRef = ref.child('profile').child(authData.uid);
            return profileRef.set(profile, function (error) {
                if (error) {
                    alert("Data could not be saved." + error);
                } else {
                    alert("Data saved successfully.");
                }
            });
        }
    };

    return Auth;
});