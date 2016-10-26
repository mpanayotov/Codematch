// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
//var mediaShare = angular.module('starter', ['ionic', 'ngCordova'])


var changeViewer = angular.module('ionicApp', ['ionic', 'ngCordova'])

changeViewer.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
  	takePicture();
  	makeBodyHeightSameAsPicture();
  	//loadStickers(null, null);
  		
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

changeViewer.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('tabs', {
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs.html"
    })
    .state('tabs.picture', {
      url: "/picture",
      views: {
        'picture-tab': {
          templateUrl: "templates/pictureScreen.html",
        }
      }
    })
    .state('tabs.share', {
      url: "/share",
      views: {
        'picture-tab': {
          templateUrl: "templates/shareScreen.html"
        }
      }
    });


   $urlRouterProvider.otherwise("/tab/picture");
});

changeViewer.controller("shareController", function($scope, $cordovaSocialSharing, $cordovaImagePicker, $cordovaInstagram) {
 
    $scope.shareAnywhere = function() {
        $cordovaSocialSharing.share(null, null, imageToShare, null);
    }
 
    $scope.shareViaTwitter = function(message, image, link) {
    		//imageToShare comes from tack.js, it is a global variable over the getImage function
	        $cordovaSocialSharing.shareViaTwitter(message, imageToShare, link).then(function(result) {
	            //$cordovaSocialSharing.shareViaTwitter(message, image, link);
	        }, function(error) {
	            alert("Cannot share on Twitter");
	        });
    }
    
    $scope.shareViaFacebook = function(message, image, link) {
        $cordovaSocialSharing.shareViaFacebook(message, imageToShare, link).then(function(result) {
            //
        }, function(error) {
            alert("Cannot share on Facebook");
        });
    }
    
    $scope.shareViaInstagram = function(message, image, link) {
		   $cordovaSocialSharing.canShareVia('snapchat',message, imageToShare, link).then(function() {
    		// Worked
		  }, function(err) {
		    alert("Cannot share on Instagram");
		  });
    }


 
    $scope.getImageFromGallery = function() {       
            // Image picker will load images according to these settings
            var options = {
                maximumImagesCount: 1, // Max number of selected images, I'm using only one for this example           // Higher is better
            };
 
            $cordovaImagePicker.getPictures(options).then(function (results) {
                // Loop through acquired images
                for (var i = 0; i < results.length; i++) {
                    //$scope.collection.selectedImage = results[i];   // We loading only one image so we can use it like this
 					checkImageRotationAndDisplay(results[i]);
                }
            }, function(error) {
                console.log('Error: ' + JSON.stringify(error));    // In case of error
            });
        };  


});

/*
changeViewer.directive('hideTabs', function($rootScope) {
  return {
      restrict: 'A',
      link: function($scope, $el) {
          $rootScope.hideTabs = 'tabs-item-hide';
          $scope.$on('$destroy', function() {
              $rootScope.hideTabs = '';
          });
      }
  };
});*/