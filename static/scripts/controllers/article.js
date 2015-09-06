'use strict';

app.controller('ArticleCtrl', function ($http, $scope, $stateParams) {
    $http.get('https://api.myjson.com/bins/4y9xy').then(function (data) {
        $scope.article = data.data[$stateParams.articleId];
    });
});