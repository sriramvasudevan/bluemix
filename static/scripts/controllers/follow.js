'use strict';

app.controller("FollowCtrl", function ($scope) {
    $scope.issues = {
        "1": {
            "name": "Food Waste",
            "image_url": "images/thumbnail-large-01.jpg",
            "description": "Updates of Government Policies in solving Food Waste",
            "stats": {
                "followers": "0",
                "articles": "0"
            }
        },
        "2": {
            "name": "Water Conservation",
            "image_url": "images/thumbnail-large-02.jpg",
            "description": "The situation of water in the world and how people are trying to convere it.",
            "stats": {
                "followers": "0",
                "articles": "0"
            }
        },
        "3": {
            "name": "Criminal Justice System",
            "image_url": "images/thumbnail-large-03.jpg",
            "description": "Reforms in criminal justice.",
            "stats": {
                "followers": "0",
                "articles": "0"
            }
        }
    }
});