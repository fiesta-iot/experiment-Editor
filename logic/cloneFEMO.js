var services=require('./services');
var covertUtil=require('./convertUtil');
var jsonPath=require('jsonpath');

const cloneFemo=function(req, res, identification,callback){
  try {

  services(req, res, 'getExperimentModelObject',identification,null,function (error, result) {
    var femo=covertUtil.femo.toJson(result);
    delete femo.id;
    var fismoIdPath=jsonPath.paths(femo,'$..id');
    for(i=0;i<fismoIdPath.length;i++){
      delete femo[fismoIdPath[i][1]][fismoIdPath[i][2]][fismoIdPath[i][3]];
    }
    femo=covertUtil.femo.toXml(femo);
    services(req, res, 'saveUserExperiment',null,femo,function (error,result) {

      if( error )
        callback( error, result );
      else
        services(req, res, 'getExperimentDescription', result,null, function (error,result) {
          callback(error,result)
        });
    })
  });

  }
  catch( ex ) {
    console.log( ex );
  }
};

module.exports=cloneFemo;
