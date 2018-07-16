(function(){
  'use strict';

  angular
    .module('fiestaExpModeler')
    .controller('widgetEditorModalController', WidgetEditorModalController);

  WidgetEditorModalController.$inject = ['$scope', 'widgetInfo', 'close'];


    function WidgetEditorModalController($scope, widgetInfo, close) {


      //  set scope variables
      $scope.widgetInfo = widgetInfo;

      if( $scope.widgetInfo.mode == 'create' ) {
        $scope.widgetInfo.widget = {
          "widgetID": "eu.fiesta_iot.analytics.toolkit",
          "ns2_presentationAttr": {name:'requestBody', value:''}
        }
      }
      else {
        $scope.widgetInfo.widget = JSON.parse(JSON.stringify(widgetInfo.widget));
      }

      $scope.newPaName = '';
      $scope.newPaValue = '';


      //  set scope functions
      $scope.close = closeModal;
      $scope.save = saveWidget;
      $scope.create = createWidget;


      //  implements of scope functions
      function closeModal(result) {
        close(null, 500);
      }

      function saveWidget() {
        close($scope.widgetInfo, 500);
      }

      function createWidget() {
        close($scope.widgetInfo, 500);
      }

    }


})();
