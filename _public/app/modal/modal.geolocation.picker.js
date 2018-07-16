(function(){
  'use strict';

  angular
    .module('fiestaExpModeler')
    .controller('geolocationPickerController', GeolocationPickerController);

  GeolocationPickerController.$inject = ['$scope', 'NgMap', 'alertService', 'location', 'close'];


    function GeolocationPickerController($scope, NgMap, alertService, location, close) {

      $scope.location = location;
      $scope.markerOptions = {
      };

      NgMap.getMap()
        .then(function(map) {

          var pacInput = document.getElementById('pac-input');
          var autocomplete = new google.maps.places.Autocomplete(pacInput);
          autocomplete.bindTo('bounds', map);

          map.controls[google.maps.ControlPosition.TOP_LEFT].push(pacInput);

          autocomplete.addListener('place_changed', function() {
            var place = autocomplete.getPlace();
            if (!place.geometry) {
              // User entered the name of a Place that was not suggested and
              // pressed the Enter key, or the Place Details request failed.
              window.alert("No details available for input: '" + place.name + "'");
              return;
            }

            // If the place has a geometry, then present it on a map.
            if (place.geometry.viewport) {
              map.fitBounds(place.geometry.viewport);
            } else {
              map.setZoom(15);  // Why 17? Because it looks good.
              map.setCenter(place.geometry.location);
            }

            var marker = map.markers['location_picker'];
            marker.setPosition(place.geometry.location);
          });

          setTimeout(function() {

            google.maps.event.trigger($scope.map, 'resize');

            var center = new google.maps.LatLng($scope.location[0], $scope.location[1]);
            map.setCenter(center);

          }, 500);
        });



      $scope.mapLocationLabel = _mapLocationLabel;


      //  set scope functions
      $scope.close = closeModal;
      $scope.selectPosition = selectPosition;

      $scope.placeMarker = _placeMarker;




      function _placeMarker(){
        var place = this.getPlace();  //get selected place
        //...
        if(place.geometry && place.geometry.location) {
          NgMap.getMap()
            .then(function(map) {
              map.setCenter(place.geometry.location);
              var marker = map.markers['location_picker'];
              marker.setPosition(place.geometry.location);
            });
        }
      };

      function _mapLocationLabel() {
        return $scope.location[0] + ', ' + $scope.location[1];
      }

      //  implements of scope functions
      function closeModal(result) {
        close(null, 500);
      }

      function selectPosition() {

        NgMap.getMap().then(function(map) {
          var markers = map.markers;

          var markerPosition = markers['location_picker'].getPosition();

          close([(markerPosition.lat()).toFixed(6), (markerPosition.lng()).toFixed(6)], 500);

        });

      }

    }


})();
