/**
 * Created by kimtaehyun on 2017. 8. 2..
 */
(function(){
  'use strict';

  angular
    .module('fiestaExpModeler', [
      'ui.router',
      'ui.bootstrap',
      'ngCookies',
      'angularModalService',
      'ngTagsInput',
      'ngScrollbars',
      'ui.bootstrap.datetimepicker',
      'prettyXml',
      'ngclipboard',
      'angularFileUpload',
      'ngToast',
      'ngAnimate',
      'ngMap'
    ])
    .config(config)
    .service('alertService', AlertService)
    .run(run);



  function config($stateProvider, $urlRouterProvider, ScrollBarsProvider ) {

    $urlRouterProvider.otherwise('/list');

    $stateProvider

    // HOME STATES AND NESTED VIEWS ========================================
      .state('login', {
        url: '/login',
        templateUrl: './view/login.html',
        controller: 'userLoginController'
      })

      .state('list', {
        url: '/list',
        templateUrl: './view/list.html',
        controller: 'listFemoController'
      })

      .state('edit', {
        url: '/edit/:femoId',
        templateUrl: './view/edit.html',
        controller: 'editFemoController'
      })
      ;


    ScrollBarsProvider.defaults = {
      scrollButtons: {
        scrollAmount: 'auto', // scroll amount when button pressed
        enable: true // enable scrolling buttons by default
      },
      theme: 'dark-3',
      axis: 'y' // enable 2 axis scrollbars by default
    };


    window.showWaitforDialog = function() {

      if( window.showdialog )
        return;
      window.showdialog = true;

      $('#common-waitfor-modal').modal({backdrop: "static"});
    }


    window.hideWaitforDialog = function() {
      if( !window.showdialog )
        return;

      window.showdialog = false;

      $('#common-waitfor-modal').modal('hide');
    }



  }

  AlertService.$inject = ['ngToast'];

  function AlertService(ngToast) {
    var services = {
      "showErrorMessage": _showErrorMessage,
      "showInfoMessage": _showInfoMessage
    };
    return services;


    function _showErrorMessage(err) {
      _showToastMessage(err, 'danger');
    }

    function _showInfoMessage(info) {
      _showToastMessage(info, 'info');
    }



    function _showToastMessage(err, className) {
      var errorMesg = '';

      if(typeof err === 'string') {
        errorMesg = err;
      }
      else {
        if(err.status) {
          errorMesg = ['[', err.status, ']', ' ', err.statusText, '\r\n'].join('');
        }

        if(err.data) {
          errorMesg += err.data + '\r\n';
        }

        if(errorMesg === '')
          errorMesg = err.toString();
      }

      ngToast.create(
        {
          content: errorMesg,
          className: className,
          dismissOnTimeout: true,
          timeout: 4000,
          dismissButton: true,
          dismissOnClick: true,
          animation: 'slide'
        }
      );
    }
  }


  function run($rootScope, $location) {

    // for debuging ui state change

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams, options){
      //console.log("STATE CHANG START : " + fromState + " -> " + toState)
    });

    $rootScope.$on('$locationChangeStart', function(event, newUrl, oldUrl, newState, oldState){
      //console.log("LOCATION CHANGE START : " + oldUrl + " -> " + newUrl)
    });

  }

})();

