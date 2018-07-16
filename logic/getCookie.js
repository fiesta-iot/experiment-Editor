var environment=require('../logic/environment/environment');
var request=require('request');


function getIdFromSession(accessToken, callback) {


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
      res.status(500).send('Failed to login');

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



const getCookie=function(req, res, callback){

  if( req.cookies.iPlanetDirectoryPro ) {
    getIdFromSession( req.cookies.iPlanetDirectoryPro, function(error, userId) {
      if( error != null )
        callback(null, null);
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

module.exports=getCookie;
