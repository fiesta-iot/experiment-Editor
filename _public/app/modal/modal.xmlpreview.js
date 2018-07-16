(function(){
  'use strict';

  angular
    .module('fiestaExpModeler')
    .controller('xmlpreviewModalController', XmlpreviewModalController);

  XmlpreviewModalController.$inject = ['$scope', 'xmlPreview', 'close'];


    function XmlpreviewModalController($scope, xmlPreview, close) {


      //  set scope variables
      $scope.xmlPreview = xmlPreview;
      //$scope.player = player;

      //  set scope functions
      $scope.close = closeModal;
      $scope.save = saveFemo;


      //  implements of scope functions
      function closeModal(result) {
        close(null, 500);
      }

      function saveFemo() {
        close(true, 500);
      }

    }


})();
