angular.module('starter.controllers', ['ionic','firebase'])

.controller('MapCtrl', ['$scope','$firebase','$ionicPopup', function($scope,$firebase,$ionicPopup) {

	$scope.user = {};

	$scope.showAlert = function() {
	    $ionicPopup.alert({
	        title: 'Location',
	        template: 'Your location has been saved!!'
	    });
	};
	
	 
	
	

	$scope.saveDetails = function(){
		
	    var lat = $scope.user.latitude;
	    var lgt = $scope.user.longitude;
	    var des = $scope.user.desc;

	    var firebaseObj = new Firebase("https://maps-983f1.firebaseio.com/MapDetails");
	    var fb = $firebase(firebaseObj);

	    fb.$push({
		    latitude: lat,
		    longitude: lgt,
		    description: des
		}).then(function(ref) {
		    $scope.user = {};
		    $scope.showAlert();
		}, function(error) {
		    console.log("Error:", error);
		});

    // Code to write to Firebase will be here
  	}
}])

.directive('map', function() {
    return {
        restrict: 'A',
        link:function(scope, element, attrs){
			 var directionsService = new google.maps.DirectionsService;
        var directionsDisplay = new google.maps.DirectionsRenderer;
		
		

          var zValue = scope.$eval(attrs.zoom);
          var lat = scope.$eval(attrs.lat);
          var lng = scope.$eval(attrs.lng);


          var myLatlng = new google.maps.LatLng(lat,lng),
          mapOptions = {
              zoom: zValue,
              center: myLatlng
          },
          map = new google.maps.Map(element[0],mapOptions),

          marker = new google.maps.Marker({
			    position: myLatlng,
			    map: map,
			    draggable:true
		  });
		  	var drawingManager = new google.maps.drawing.DrawingManager({
          drawingMode: google.maps.drawing.OverlayType.MARKER,
          drawingControl: true,
          drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: ['marker']
          },
          markerOptions: {icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
		  draggable:true,
		  editable:true,
		  clickable:true
		  }
        });
		drawingManager.setMap(map);
		directionsDisplay.setMap(map);
		 var onChangeHandler = function() {
          calculateAndDisplayRoute(directionsService, directionsDisplay);
        };
        document.getElementById('start').addEventListener('change', onChangeHandler);
        document.getElementById('end').addEventListener('change', onChangeHandler);
		function calculateAndDisplayRoute(directionsService, directionsDisplay) {
        directionsService.route({
          origin: document.getElementById('start').value,
          destination: document.getElementById('end').value,
          travelMode: 'DRIVING'
        }, function(response, status) {
          if (status === 'OK') {
            directionsDisplay.setDirections(response);
			var start=document.getElementById('start').value;
		    var dest=document.getElementById('end').value;
		  console.log(start,'+',dest);
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });
      }

		  google.maps.event.addListener(marker, 'dragend', function(evt){
		    scope.$parent.user.latitude = evt.latLng.lat();
		    scope.$parent.user.longitude = evt.latLng.lng();
		    scope.$apply();
		  });


        }
    };
});