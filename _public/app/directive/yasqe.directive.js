/**
 * Created by kimtaehyun on 2017. 9. 25..
 */
(function(){
  'use strict';

  angular
    .module('fiestaExpModeler')
    .directive('yasqe', YasqeDirective)
  ;

  YasqeDirective.$inject = ['$timeout'];


  function YasqeDirective($timeout) {

    var _this = this;
  //  this.$timeout = $timeout;

    return {
      restrict: 'E',
      scope: {
        data: '='
      },
      link: function ($scope, element, attr) {
        var yasqe = YASQE(element[0], {
          createShareLink: false,
          sparql: {
            showQueryButton:false
          }
        });

        $scope.$timeout = $timeout;
        yasqe.on('change', function () {
          return $scope.$timeout(function () {
            return $scope.data = yasqe.getValue();
          });
        });

        $scope.$watch('data', function (data, odata) {
          if (data == undefined || data == null || data == '') {
            yasqe.setValue('');

            element.addClass('has-no-value');
          }
          else {
            element.removeClass('has-no-value');
          }

          if (data && data !== yasqe.getValue())
            yasqe.setValue(data);
        });

      }
    };
  }

})();
