var environment=require('../logic/environment/environment');
var request=require('request');


/*
    authorizationToken_uri:'https://platform-dev.fiesta-iot.eu/openam/json/authenticate',
    openamIdFromSession_uri: 'https://platform-dev.fiesta-iot.eu/openam/json/users?_action=idFromSession',
    openamSessionValidate_uri: 'http://platform-dev.fiesta-iot.eu/openam/json/sessions/',  //  + {{sessionKey}}?_action=validate
    openamSessionLogout_uri: 'https://platform-dev.fiesta-iot.eu/openam/json/sessions/?_action=logout',
 */

function getIdFromSession(accessToken, callback) {


  var options = {
    method: 'POST',
    url: environment.openamSessionLogout_uri,
    headers:
      {
        'cache-control': 'no-cache',
        'iPlanetDirectoryPro': accessToken,
        'content-type': 'application/json'
      }
  };

  request(options, function (error, response, body) {
    if (error) {
      response.status(500).send('Failed to login');

    }else{
      var result = JSON.parse(body);

      if( response.statusCode == 200 ) {
        callback(null, result.id);
      }
      else {
        callback(response.statusCode, 'fail to get user ID');
      }
    }
  });


}




function logout(accessToken, callback) {


  var options = {
    method: 'POST',
    url: environment.openamIdFromSession_uri,
    headers:
      {
        'cache-control': 'no-cache',
        'iPlanetDirectoryPro': accessToken,
        'content-type': 'application/json'
      }
  };

  request(options, function (error, response, body) {
    if (error) {
      response.status(500).send('Failed to logout');

    }else{
      var result = JSON.parse(body);

      if( response.statusCode == 200 ) {

        response.cookie.clear('userId');
        response.cookie.clear('iplanetDirectoryPro');

        callback(null, result.id);
      }
      else {
        callback(response.statusCode, 'fail to logout');
      }
    }
  });


}



const getCookie=function(req, res, callback){

  if( req.cookies.iPlanetDirectoryPro ) {
    getIdFromSession( req.cookies.iPlanetDirectoryPro, function(error, userId) {
      if( error != null )
        callback(req.cookies.iPlanetDirectoryPro, null);
      else {
        res.cookie('userId', userId);
        callback(req.cookies.iPlanetDirectoryPro, userId);
      }
    });

  }
  else {
    callback(null, null);
  }
};

module.exports= {
  getCookie: getCookie,
  getIdFromSession: getIdFromSession,
  logout: logout
};
