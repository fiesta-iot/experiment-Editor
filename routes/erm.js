var express = require('express');
var router = express.Router();
var service=require('../logic/services');
var cloneFEMO=require('../logic/cloneFEMO');
var convertUtil=require('../logic/convertUtil');
var debug=require('debug')('keti');
var multiparty = require('multiparty');


/*Delete ALL FEMO*/
router.delete('/femo',function (req,res,next) {
  service(req, res, 'deleteUserExperiments',null,null,function (error,result) {
    if(error){
      debug( error );
      if( error == 'accessToken fault')
        res.status(401).send( error );
      else if( error.statusCode )
        res.status(error.statusCode).send( error );
      else
        res.status(500).send( error );
    }else{
      res.send(result);
    }
  });
});


/*Delete specific FEMO with FEMO-ID*/
router.delete('/femo/:femoID',function (req,res,next) {
  if(req.params.femoID){
    service(req, res, 'deleteUserExperiment',req.params.femoID,null,function (error,result) {
      if(error){
        debug( error );
        if( error == 'accessToken fault')
          res.status(401).send( error );
        else if( error.statusCode )
          res.status(error.statusCode).send( error );
        else
          res.status(500).send( error );
      }else{
        res.send(result);
      }
    });
  }
});


/*Delete specific FISMO with FISMO-ID*/
router.delete('/fismo/:fismoID',function (req,res,next) {
  if(req.params.fismoID){
    service(req, res, 'deleteExperimentServiceModelObject',req.params.fismoID,null,function (error,result) {
      if(error){
        debug( error );
        if( error == 'accessToken fault')
          res.status(401).send( error );
        else if( error.statusCode )
          res.status(error.statusCode).send( error );
        else
          res.status(500).send( error );
      }else{
        res.send(result);
      }
    });
  }
});


/*clone existing FEMO*/
router.post('/femo/clone/:femoID',function (req,res,next) {
  if(req.params.femoID){
    cloneFEMO(req, res, req.params.femoID,function (error,result) {
      if(error){
        debug( error );
        if( error == 'accessToken fault')
          res.status(401).send( error );
        else if( error.statusCode )
          res.status(error.statusCode).send( error );
        else
          res.status(500).send( error );
      }else{

        var jsonResult = convertUtil.descId.toJson(result);
        res.send(jsonResult);
      }
    });
  }
});


/*save new FEMO or update existing FEMO*/
router.post('/femo',function (req,res,next) {
  //todo fix update bug
  if(req.body.femo){
    var femoXml = convertUtil.femo.toXml(req.body.femo);
    service(req, res, 'saveUserExperiment',null,femoXml,function (error,result) {
      if(error){
        debug( error );
        if( error == 'accessToken fault')
          res.status(401).send( error );
        else if( error.statusCode )
          res.status(error.statusCode).send( error );
        else
          res.status(500).send( error );
      }else{
        res.send(result);
      }
    });
  }else{
    //todo need body.femo
  }
});

/*save new FEMO or update existing FEMO*/
router.post('/femo/fromxml',function (req,res,next) {

  var form = new multiparty.Form();

  // get field name & value
  form.on('field',function(name,value){
    debug('Create FEMO from XML file : field name = '+name+' , value = '+value);
  });

  var femoXml = '';

  // file upload handling
  form.on('part',function(part){

    var filename;
    var size;
    if (part.filename) {
      filename = part.filename;
      size = part.byteCount;
    }else{
      part.resume();
    }

    part.on('data',function(chunk){
      femoXml += chunk;
      debug( '   >> ', filename +' read '+chunk.length + 'bytes');
    });

    part.on('end',function(){

      debug( '   >> ', filename+' Part read complete');
      debug( femoXml );



    });
  });

  // all uploads are completed
  form.on('close',function(){

    var serviceCommand = null;

    var xmlIsFemo = convertUtil.femo.isFemoXml(femoXml);
    var xmlIsFedspec = convertUtil.fedspec.isFedspecXml(femoXml);

    if(convertUtil.fedspec.isFedspecXml(femoXml))
      serviceCommand = 'saveUserExperiments';
    else if(convertUtil.femo.isFemoXml(femoXml))
      serviceCommand = 'saveUserExperiment';

    if(serviceCommand == null) {
      debug('uploaded XML file is not FEMO or FEDSpec complient file');
      res.status(400).send('XML file is not formed in FEMO or FEDSpec spec.');
    }
    else {

      service(req, res, serviceCommand,null,femoXml,function (error,result) {
        if(error){
          debug( error );
          if( error == 'accessToken fault')
            res.status(401).send( error );
          else if( error.statusCode )
            res.status(error.statusCode).send( error );
          else
            res.status(500).send( error );
        }else{
          res.send(result);
        }
      });
    }





  });

  // track progress
  form.on('progress',function(byteRead,byteExpected){
    debug('   >> ', ' Reading total  '+byteRead+'/'+byteExpected);
  });

  form.parse(req);
});


/*save new FEMO or update existing FEMO*/
router.put('/femo/preview',function (req,res,next) {
  //todo fix update bug
  if(req.body.femo){
    var femoXml = convertUtil.femo.toXml(req.body.femo);

    res.send(femoXml);
  }else{
    //todo need body.femo
  }
});


/*save FISMO*/
router.post('/fismo/:femoID',function (req,res,next) {
  if(req.body.fismo && req.params.femoID){
    service(req, res, 'saveExperimentServiceModelObject',req.params.femoID,req.body.fismo,function (error,result) {
      if(error){
        debug( error );
        if( error == 'accessToken fault')
          res.status(401).send( error );
        else if( error.statusCode )
          res.status(error.statusCode).send( error );
        else
          res.status(500).send( error );
      }else{
        res.send(result);
      }
    });
  }else{
    //todo need body.fismo
  }
});




/* GET ALL FEMOs */
router.get('/femo', function(req, res, next) {
  service(req, res, 'getALLUserExperiments', null,null, function (error,result) {
    if( error ) {
      debug( error );
      if( error == 'accessToken fault')
        res.status(401).send( error );
      else if( error.statusCode )
        res.status(error.statusCode).send( error );
      else
        res.status(500).send( error );
    }
    else {
      res.send(result);
    }
  });

});

/* get SPECIFIC FEMO */
router.get('/femo/:femoID/xml', function(req, res, next) {
  if( req.params.femoID ) {
    service(req, res, 'getExperimentModelObject', req.params.femoID,null, function (error,result) {
      if( error ) {
        debug( error );
        if( error == 'accessToken fault')
          res.status(401).send( error );
        else if( error.statusCode )
          res.status(error.statusCode).send( error );
        else
          res.status(500).send( error );
      }
      else {
        res.send(result);
      }
    });
  }
});


/* get SPECIFIC FEMO */
router.get('/femo/:femoID', function(req, res, next) {
  if( req.params.femoID ) {
    service(req, res, 'getExperimentModelObject', req.params.femoID,null, function (error,result) {
      if( error ) {
        debug( error );
        if( error == 'accessToken fault')
          res.status(401).send( error );
        else if( error.statusCode )
          res.status(error.statusCode).send( error );
        else
          res.status(500).send( error );
      }
      else {
        var jsonResult = convertUtil.femo.toJson(result);

        res.send(jsonResult);
      }
    });
  }
});

/*get ALL FISMOs*/
router.get('/fismo', function(req, res, next) {
  service(req, res, 'getDiscoverableExperimentServiceModelObjects', null,null, function (error,result) {
    if( error ) {
      debug( error );
      if( error == 'accessToken fault')
        res.status(401).send( error );
      else if( error.statusCode )
        res.status(error.statusCode).send( error );
      else
        res.status(500).send( error );
    }
    else {
      res.send(result);
    }
  });

});


/* get SPECIFIC FISMO */
router.get('/fismo/:fismoID', function(req, res, next) {
  if( req.params.fismoID ) {
    service(req, res, 'getExperimentServiceModelObject', req.params.fismoID,null, function (error,result) {
      if( error ) {
        debug( error );
        if( error == 'accessToken fault')
          res.status(401).send( error );
        else if( error.statusCode )
          res.status(error.statusCode).send( error );
        else
          res.status(500).send( error );
      }
      else {
        res.send(result);
      }
    });
  }
});


/*get all experiment description*/
router.get('/femo-description', function(req, res, next) {

  service(req, res, 'getAllUserExperimentsDescriptions', null,null, function (error,result) {
    if( error ) {
      debug( error );
      if( error == 'accessToken fault')
        res.status(401).send( error );
      else if( error.statusCode )
        res.status(error.statusCode).send( error );
      else
        res.status(500).send( error );
    }
    else {
      var jsonResult = convertUtil.descIds.toJson(result);
      res.send(jsonResult);
    }
  });
});

/* get SPECIFIC experiment description */
router.get('/femo-description/:femoID', function(req, res, next) {
  if( req.params.femoID ) {
    service(req, res, 'getExperimentDescription', req.params.femoID,null, function (error,result) {
      if( error ) {
        debug( error );
        if( error == 'accessToken fault')
          res.status(401).send( error );
        else if( error.statusCode )
          res.status(error.statusCode).send( error );
        else
          res.status(500).send( error );
      }
      else {
        var jsonResult = convertUtil.descId.toJson(result);
        res.send(jsonResult);
      }
    });
  }
});

module.exports = router;
