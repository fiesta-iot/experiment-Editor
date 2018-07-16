var express = require('express');
var router = express.Router();
var environment=require('../logic/environment/environment');
var request = require("request");
var jp=require('jsonpath');

/* GET users listing. */
router.get('/accesstoken', function(req, res) {

  var options = {
    method: 'POST',
    url: environment.authorizationToken_uri,
    headers:
      {
        'cache-control': 'no-cache',
        'x-openam-password': req.query.userpwd,
        'x-openam-username': req.query.userid,
        'content-type': 'application/json'
      }
  };

  request(options, function (error, response, body) {
    if (error) {
      debug(error)
      res.status(500).send('Failed to login');

    }else{
      var result = JSON.parse(body);

      if( response.statusCode == 200 ) {
        res.cookie('iPlanetDirectoryPro', jp.value(result, '$.tokenId'));
        res.send(jp.value(result, '$.tokenId'));

      }
      else {
        res.clearCookie('iPlanetDirectoryPro');
        res.status( parseInt(result.code) ).send(result.reason + ":" + result.message );
      }
    }
  });

});

router.delete('/accesstoken', function(req, res) {

  var options = {
    method: 'POST',
    url: environment.openamSessionLogout_uri,
    headers:
      {
        'cache-control': 'no-cache',
        'iPlanetDirectoryPro': req.cookies.iPlanetDirectoryPro,
        'content-type': 'application/json'
      }
  };

  request(options, function (error, response, body) {
    if (error) {
      res.clearCookie('userId');
      res.clearCookie('iPlanetDirectoryPro');

      res.status(500).send('Failed to logout');

    }else{

      if( response.statusCode == 200 ) {

        res.clearCookie('userId');
        res.clearCookie('iPlanetDirectoryPro');

        res.status(200).send("OK");
      }
      else {
        res.clearCookie('userId');
        res.clearCookie('iPlanetDirectoryPro');

        res.status(response.statusCode).send(response);
      }
    }
  });

});




module.exports = router;
