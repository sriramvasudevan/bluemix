app.controller("FeedCtrl", function ($http, $stateParams, $scope) {
    $scope.number = 0;

    $scope.issue = $stateParams.issue;

    $http.get('/getStories/' + $scope.issue).then(function (data) {
        $scope.clusters = data.data.stories;
        $scope.articles = $scope.clusters[$scope.number];
        console.log($scope.articles);
    });
    
    
    $scope.load_more = function () {
        if ($scope.number + 1 < $scope.clusters.length) {
            $scope.number += 1;
            $scope.articles = $scope.clusters[$scope.number];
        } else {
            alert("That's all in this topic!");
        }
    }
    $scope.load_back = function () {
        if ($scope.number > 0) {
            $scope.number -= 1;
            $scope.articles = $scope.clusters[$scope.number];
        } else {
            alert("You can't go back anymore!");
        }
    }
});