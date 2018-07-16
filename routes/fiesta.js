var express = require('express');
var router = express.Router();
var getQuantityKinds=require('../logic/getResources');
var getDomainOfInterests=require('../logic/getDOI');

/* Get All domain of interests */
router.get('/quantitykind',function (req,res,next) {


  getQuantityKinds(req, res, function(error, result){
    if( error )
      res.status(error.statusCode).send( error );
    else
      res.status(200).json(result);

  });

});

/* Get All domain of interests */
router.get('/doi',function (req,res,next) {

  getDomainOfInterests(req, res, function(error, result){
    if( error )
      res.status(500).send( error );
    else
      res.send(result);

  });
});

module.exports = router;

