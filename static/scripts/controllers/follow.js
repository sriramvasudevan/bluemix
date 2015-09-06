'use strict';

app.controller("FollowCtrl", function ($scope) {
    $scope.issues = {
        "1": {
            "name": "Food Waste",
            "image_url": "images/thumbnail-large-01.jpg",
            "description": "Updates of Government Policies in solving Food Waste",
            "url_short_hand": "foodwastage"
        },
        "2": {
            "name": "Water Conservation",
            "image_url": "images/thumbnail-large-02.jpg",
            "description": "The situation of water in the world and how people are trying to convere it.",
            "url_short_hand": "drought"
        },
        "3": {
            "name": "Net Neutrality",
            "image_url": "images/thumbnail-large-03.jpg",
            "description": "The protection and privacy of our information online.",
            "url_short_hand": "netneutrality"
        },
        "4": {
            "name": "Air Pollution",
            "image_url": "images/thumbnail-large-02.jpg",
            "description": "This situation of air polution around the world.",
            "url_short_hand": "airpolution"
        },
        "5": {
            "name": "LGBT",
            "image_url": "images/thumbnail-large-01.jpg",
            "description": "We're all human beings.",
            "url_short_hand": "lgbt"
        }
    }
});