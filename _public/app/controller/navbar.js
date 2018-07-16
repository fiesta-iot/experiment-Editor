/**
 * Created by kimtaehyun on 2017. 8. 2..
 */
(function(){
  'use strict';


  angular
    .module('fiestaExpModeler')
    .controller('navbarController', NavbarController);


  NavbarController.$inject = ['$scope', '$state', '$cookies', '$window', 'fiestaCloudService'];


  function NavbarController($scope,  $state, $cookies, $window, fiestaCloudService) {


    //  scope functions
    $scope.init = _init;
    $scope.userId = _getUserId();

    $scope.logout = _logout;
    $scope.profile = _profile;


    //  implementation of scope function


    function _init() {


    } //  $scope.init




    function _getUserId() {
      return $cookies.get('userId');
    }

    function _logout() {
      fiestaCloudService.logout()
        .then(function(result){
          fiestaCloudService.forwardToLoginPage();
        })
        .catch(function(err) {
          fiestaCloudService.forwardToLoginPage();
        });
    }

    function _profile() {
      fiestaCloudService.forwardToProfilePage();
    }

  }


})();
