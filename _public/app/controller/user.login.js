/**
 * Created by kimtaehyun on 2017. 8. 2..
 */
(function(){
  'use strict';


  angular
    .module('fiestaExpModeler')
    .controller('userLoginController', UserLoginController);

  // Default environment variables
  var __env = {};

  // Import variables if present
  if(window){
    Object.assign(__env, window.__env);
  }


  UserLoginController.$inject = ['$scope', '$rootScope', '$state', '$http', '$cookies'];


  function UserLoginController($scope, $rootScope, $state, $http, $cookies) {


    //  scope variables
    $scope.credentials = {
      username: 'keti',
      password: 'onfA6EpiNd9yveK7RsvV'
    };


    //  scope functions
    $scope.init = _init;
    $scope.doLogin = _doLogin;



    //  implementation of scope function


    function _init() {

      loadProfile();

    } //  $scope.init




    function _doLogin() {

      var params = {
        userid: $scope.credentials.username,
        userpwd: $scope.credentials.password
      };

      $http({
        url: __env.apiUrl + '/user/accesstoken',
        method: "GET",
        params: params
      }).then(function (response) {

        $state.go( 'list' );

      }, function (err) {
        console.log( err );

      } );

    }




    function getLocalProfile(callback){
      var profileImgSrc      = localStorage.getItem("PROFILE_IMG_SRC");
      var profileName        = localStorage.getItem("PROFILE_NAME");
      var profileReAuthEmail = localStorage.getItem("PROFILE_REAUTH_EMAIL");

      if(profileName !== null
        && profileReAuthEmail !== null
        && profileImgSrc !== null) {
        callback(profileImgSrc, profileName, profileReAuthEmail);
      }
    }

    /**
     * Main function that load the profile if exists
     * in localstorage
     */
    function loadProfile() {
      if(!supportsHTML5Storage()) { return false; }
      // we have to provide to the callback the basic
      // information to set the profile
      getLocalProfile(function(profileImgSrc, profileName, profileReAuthEmail) {
        //changes in the UI
        $("#profile-img").attr("src",profileImgSrc);
        $("#profile-name").html(profileName);
        $("#reauth-email").html(profileReAuthEmail);
        $("#inputEmail").hide();
        $("#remember").hide();
      });
    }

    /**
     * function that checks if the browser supports HTML5
     * local storage
     *
     * @returns {boolean}
     */
    function supportsHTML5Storage() {
      try {
        return 'localStorage' in window && window['localStorage'] !== null;
      } catch (e) {
        return false;
      }
    }


  }


})();
