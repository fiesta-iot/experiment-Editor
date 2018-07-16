/**
 * Created by kimtaehyun on 2017. 8. 2..
 */
(function(){
  'use strict';

  angular
    .module('fiestaExpModeler')
    .service('fiestaCloudService', FiestaCloudService);

  // Default environment variables
  var __env = {};

  // Import variables if present
  if(window){
    Object.assign(__env, window.__env);
  }

  //  TODO: RELEASE_CHECK
  var release = true;

  FiestaCloudService.$inject = ['$http', '$state', '$window'];

  function FiestaCloudService($http, $state, $window) {




    var FISMO_TEMPLATE = {
      "id":"",
      "name":"New Service",
      "ns2_description":{
        "$t":"This Service is ..."
      },
      "ns2_discoverable": false,
      "ns2_experimentControl": {
//        "ns2_reportIfEmpty": true
      },
      "ns2_experimentOutput": {
        "ns2_file": [],
        "ns2_widget": []
      }
    };

    var FEMO_TEMPLATE = {
      "xmlns_ns2":"http://www.fiesta-iot.eu/fedspec",
      "xmlns_ns3":"http://www.w3.org/2007/SPARQL/protocol-types#",
      "id":"",
      "name":"New Experiment",
      "ns2_description":{
        "$t":"This Experiment is ..."
      },
      "ns2_domainOfInterest":{
        "$t":"http://purl.org/iot/vocab/m3-lite#DomainOfInterest"
      },
      "ns2_FISMO":[FISMO_TEMPLATE]
    };


    //  Exposed service function list

    var services = {
      "listFemos": _listFemos,
      "createNewFemo": _createNewFemo,
      "getFemo": _getFemo,
      "saveFemo": _saveFemo,
      "previewFemo": _previewFemo,
      "cloneFemo": _cloneFemo,
      "deleteFemo": _deleteFemo,
      "downloadFemo": _downloadFemo,
      "createFismo": _createFismo,
      "getQuantityKinds": _getQuantityKinds,
      "getDomainOfInterests": _getDomainOfInterests,

      "logout": _logout,

      "forwardToLoginPage": _forwardToLoginPage,
      "forwardToProfilePage": _forwardToProfilePage
    };
    return services;


    function _checkAuthenticationError(response) {
      if(response.status == 401) {
        _forwardToLoginPage();
      }
    }


    //  Implements exposed service function/

    function _listFemos(searchConditions) {

      return new Promise(function(resolve, reject) {
        var retval = null;


        var params = {searchConditions: searchConditions};

        $http({
          url: __env.apiUrl + '/erm/femo-description',
          method: "GET",
          params: params
        }).then(function (response) {
            //  resolve FemoDescriptiveID list
            resolve(response.data);

        }, function (err) {
          _checkAuthenticationError(err);

          console.log( err );

          reject(err);
        } );
      });
    }



    function _getFemo(femoId) {

      return new Promise(function(resolve, reject) {

        var params = {femoId: femoId};

        $http({
          url: __env.apiUrl + '/erm/femo/' + femoId,
          method: "GET",
          params: params
        }).then(function (response) {

          resolve( response.data );

        }, function (err) {
          _checkAuthenticationError(err);

          console.log( err );

          reject(err);
        } );
      });
    }


    function _downloadFemo(femoId) {

      return new Promise(function(resolve, reject) {

        var params = {femoId: femoId};

        $http({
          url: __env.apiUrl + '/erm/femo/' + femoId + '/xml',
          method: "GET",
          responseType: 'arraybuffer',
          headers : {'Accept' : 'application/xml' },
          params: params
        }).then(function (response) {
          var fileName = 'FEMO-' + femoId + '.xml';
          var blob = new Blob([response.data],
            {type : 'application/xml;charset=UTF-8'});
          var objectUrl = (window.URL || window.webkitURL).createObjectURL(blob);

          resolve( {objectUrl: objectUrl, fileName: fileName} );

        }, function (err) {
          _checkAuthenticationError(err);

          console.log( err );

          reject(err);
        } );
      });
    }



    function _saveFemo(femo) {

      return new Promise(function(resolve, reject) {

        var data = {
          'femo': femo
        };

        $http({
          url: __env.apiUrl + '/erm/femo',
          method: "POST",
          data: data
        }).then(function (response) {


          try {

            resolve(response.data);
          }
          catch( ex ) {
            reject( ex );
          }


        }, function (err) {
          _checkAuthenticationError(err);

          console.log( err );

          reject(err);
        } );
      });
    }

    function _previewFemo(femo) {

      return new Promise(function(resolve, reject) {

        var data = {
          'femo': femo
        };

        $http({
          url: __env.apiUrl + '/erm/femo/preview',
          method: "PUT",
          data: data
        }).then(function (response) {


          try {

            resolve(response.data);
          }
          catch( ex ) {
            reject( ex );
          }


        }, function (err) {
          _checkAuthenticationError(err);

          console.log( err );

          reject(err);
        } );
      });
    }


    function _createNewFemo() {
      return new Promise(function(resolve, reject) {


        var data = {
          'femo': FEMO_TEMPLATE
        };


        $http({
          url: __env.apiUrl + '/erm/femo',
          method: "POST",
          data: data
        }).then(function (response) {

          resolve(response.data);

        }, function (err) {
          _checkAuthenticationError(err);

          console.log( err );

          reject(err);
        } );
      });
    }

    function _cloneFemo(femoId) {
      return new Promise(function(resolve, reject) {

        $http({
          url: __env.apiUrl + '/erm/femo/clone/' + femoId,
          method: "POST"
        }).then(function (response) {

          resolve(response.data);

        }, function (err) {
          _checkAuthenticationError(err);

          console.log( err );

          reject(err);
        } );
      });
    }

    function _deleteFemo(femoId) {

      return new Promise(function(resolve, reject) {

        $http({
          url: __env.apiUrl + '/erm/femo/' + femoId,
          method: "DELETE"
        }).then(function (response) {

          resolve(response.data);

        }, function (err) {
          _checkAuthenticationError(err);

          console.log( err );

          reject(err);
        } );
      });
    }


    function _createFismo() {
      return new Promise(function(resolve, reject){
        var fismo = JSON.parse(JSON.stringify(FISMO_TEMPLATE));

        resolve(fismo);
      });
    }


    function _getQuantityKinds() {

      return new Promise( function(resolve, reject) {
        $http({
          url: __env.apiUrl + '/fiesta/quantitykind',
          method: "GET"
        }).then(function (response) {

          var aryQuantityKind = response.data;
          aryQuantityKind = aryQuantityKind.map(function(item){
            return {'text': item.kind};
          });

          resolve(aryQuantityKind);

        }, function (err) {
          _checkAuthenticationError(err);

          console.log( err );

          reject(err);
        } );

      } );

    }

    function _getDomainOfInterests() {

      return new Promise( function(resolve, reject) {
        $http({
          url: __env.apiUrl + '/fiesta/doi',
          method: "GET"
        }).then(function (response) {

          var aryDomainOfInterests = response.data;
          aryDomainOfInterests = aryDomainOfInterests.map(function(item){
            return {'text': item};
          });

          resolve(aryDomainOfInterests);

        }, function (err) {
          _checkAuthenticationError(err);

          console.log( err );

          reject(err);
        } );

      } );

    }


    function _logout() {

      return new Promise( function(resolve, reject) {
        $http({
          url: __env.apiUrl + '/user/accesstoken',
          method: "DELETE"
        }).then(function (response) {

          resolve( true );

        }, function (err) {
          console.log( err );

          reject(err);
        } );

      } );

    }

    function _forwardToLoginPage() {
      if( release ) {
        $window.location.href = '/openam/XUI/#login/';
      }
      else {
        $state.go( 'login' );
      }
    }


    function _forwardToProfilePage() {
      if( release ) {
        $window.location.href = '/openam/XUI/#profile/details';
      }
      else {
        $window.location.href = 'https://platform-dev.fiesta-iot.eu/openam/XUI/#profile/details';
      }
    }
  }
})();
