/**
 * Created by ramnathteja on 07/07/2017.
 */
var xml2json=require('xml2json');
var pd = require('pretty-data').pd;


const xmlToJsonOptions = {
  object: true,
  reversible: true
};


//  usage
//  var value = getPropertySafe(obje, ['a', 'b', 'c'], 'DefaultValue');
//  @ 'DefaultValue' is optional
//
//  @see https://github.com/acstll/deep-get-set
function getPropertySafe(obj, path, defValue) {
  var hasOwnProp = Object.prototype.hasOwnProperty;

  var keys = Array.isArray(path) ? path : path.split('.');
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!obj || !hasOwnProp.call(obj, key)) {
      obj = undefined;
      break;
    }
    obj = obj[key];
  }

  if(arguments.length > 2 && obj === undefined)
    return defValue;

  return obj;
}

//  usage
//    var obj = {};
//    setPropertySafe(obj, ['a', 'b', 'c'], 'value');
//    >> obj === {'a': {'b': {'c': 'value'}}}
//
//  @limitation
//    var obj = {
//      'a': 'stringvalue'
//    }
//    setPropertySafe(obj.a, ['b', 'c'], 'new value')
//    >> result: exception
//
//  @see https://github.com/acstll/deep-get-set
function setPropertySafe(obj, path, value) {
  if(obj === null || obj === undefined || typeof obj != 'object' || Array.isArray(obj) )
    throw new Error( 'Illegal argument: obj parameter must be an object. Not allowed null, undefined, string and Array');

  var hasOwnProp = Object.prototype.hasOwnProperty;

  var keys = Array.isArray(path) ? path : path.split('.');
  for (var i = 0; i < keys.length - 1; i++) {
    var key = keys[i];
    if (!hasOwnProp.call(obj, key) || typeof obj[key] != 'object' || Array.isArray(obj[key]) || obj[key] === null) {
      obj[key] = {};
    }
    obj = obj[key];
  }
  obj[keys[i]] = value;
}


function replaceNamespaceQualifier(json) {
  if( Array.isArray(json) ) {
    for(var i=0; i<json.length; i++) {
      json[i] = replaceNamespaceQualifier(json[i]);
    }
  }
  else if( (typeof json === "object") && (json !== null) ) {
    var keys = Object.keys(json);
    keys.map(function(key){
      var indexOf = key.indexOf( ':' );
      if( indexOf != -1) {
        var newkey = key.replace(':', '_');
        json[newkey] = replaceNamespaceQualifier(json[key]);
        delete json[key];
      }
      else {
        json[key] = replaceNamespaceQualifier(json[key]);
      }
    });
  }

  return json;
}


function recoverNamespaceQualifier(json) {
  if( Array.isArray(json) ) {
    for(var i=0; i<json.length; i++) {
      json[i] = recoverNamespaceQualifier(json[i]);
    }
  }
  else if( (typeof json === "object") && (json !== null) ) {
    var keys = Object.keys(json);
    keys.map(function(key){
      var indexOf = key.indexOf( '_' );
      if( indexOf != -1) {
        var newkey = key.replace('_', ':');
        json[newkey] = recoverNamespaceQualifier(json[key]);
        delete json[key];
      }
      else {
        json[key] = recoverNamespaceQualifier(json[key]);
      }
    });
  }

  return json;
}


const _convertDescIdsXmlToJson = function(xml) {

  try {

    var jsonResult = xml2json.toJson(xml, xmlToJsonOptions);
    jsonResult = replaceNamespaceQualifier(jsonResult);



    //  return value is ExpDescriptiveIDs object. It contains FemoDescriptiveDI
    var descIds = jsonResult['ns2_ExpDescriptiveIDs'];

    //  returned value is result of XML2JSON library.  In case of there is only one FemoDescriptiveID, 'ns2:FemoDescriptiveID' is not array.
    //  to normalize 'ns2:FemoDescriptiveID' to array type. call _utilMakeArray()
    _utilMakeArray(descIds, 'ns2_FemoDescriptiveID');

    descIds['ns2_FemoDescriptiveID'].map(function (item) {

      //  to normalize 'ns2:FemoDescriptiveID' to array type. call _utilMakeArray()
      _utilMakeArray(item, 'ns2_FismoDescriptiveID')
    });

    return descIds['ns2_FemoDescriptiveID'];

  }
  catch( ex ) {

    throw ex;
  }

}


const _convertDescIdsJsonToXml = function(json) {
  json = recoverNamespaceQualifier(json)
  var xml = xml2json.toXml(json);

  //  do normalization

  return xml;
}


const _convertDescIdXmlToJson = function(xml) {

  try {

    var jsonResult = xml2json.toJson(xml, xmlToJsonOptions);
    jsonResult = replaceNamespaceQualifier(jsonResult);

    //  return value is ExpDescriptiveIDs object. It contains FemoDescriptiveDI
    var descId = jsonResult['ns2_FemoDescriptiveID'];

    //  to normalize 'ns2:FemoDescriptiveID' to array type. call _utilMakeArray()
    _utilMakeArray(descId, 'ns2_FismoDescriptiveID')

    return descId;

  }
  catch( ex ) {

    throw ex;
  }

}


const _convertDescIdJsonToXml = function(json) {
  json = recoverNamespaceQualifier(json)
  var xml = xml2json.toXml(json);

  //  do normalization

  return xml;
}



const _convertFemoXmlToJson = function(xml) {

  //  do normalization
  try {
    var jsonResult = xml2json.toJson(xml, xmlToJsonOptions);
    jsonResult = replaceNamespaceQualifier(jsonResult);

    var femo = jsonResult['ns2_FEMO'];

    _utilMakeArray(femo, 'ns2_FISMO');

    femo['ns2_FISMO'].map(function(item){
      var discoverable = getPropertySafe(item, ['ns2_discoverable', '$t'], 'false');
      setPropertySafe(item, ['ns2_discoverable'], discoverable === 'true');

/*
      var reportIfEmpty = getPropertySafe(item, ['ns2_experimentControl', 'ns2_reportIfEmpty', '$t'], 'true');
      setPropertySafe(item, ['ns2_experimentControl', 'ns2_reportIfEmpty'], reportIfEmpty === 'true');
*/

      var experimentOutput = getPropertySafe(item, ['ns2_experimentOutput']);
      if( experimentOutput != null ) {
        _utilMakeArray(experimentOutput, 'ns2_file');
        _utilMakeArray(experimentOutput, 'ns2_widget');

        var aryWidget = getPropertySafe(experimentOutput, ['ns2_widget']);
        aryWidget.map(function(widget){
          var presentationAttr = getPropertySafe(widget, ['ns2_presentationAttr']);
          if(presentationAttr)
            setPropertySafe(widget, ['ns2_presentationAttr', 'name'], 'requestBody');
        });
      }

      var query = getPropertySafe(item, ['ns2_queryControl', 'ns3_query-request', 'query', '$t']);
      if( query )
        setPropertySafe(item, ['ns2_queryControl', 'ns3_query-request', 'query', '$t'], _stripCDATA(query));

      var dynamicAttrs = getPropertySafe(item, ['ns2_queryControl', 'ns2_dynamicAttrs']);
      if( dynamicAttrs != null )
        _utilMakeArray(dynamicAttrs, 'ns2_dynamicAttr');

    });

    return femo;
  }
  catch( ex ) {
    throw ex;
  }

}

const _testFemoXml = function(xml) {
  try {
    var jsonResult = xml2json.toJson(xml, xmlToJsonOptions);

    var rootName = Object.keys(jsonResult)[0];
    var qName = rootName.split(':');

    var namespaceUrl = jsonResult[rootName]['xmlns:' + qName[0]];

    if(qName[1] === 'FEMO' && namespaceUrl === 'http://www.fiesta-iot.eu/fedspec')
      return true;
    else
      return false;
  }
  catch( ex ) {
    return false;
  }
}

const _testFedspecXml = function(xml) {
  try {
    var jsonResult = xml2json.toJson(xml, xmlToJsonOptions);

    var rootName = Object.keys(jsonResult)[0];
    var qName = rootName.split(':');

    var namespaceUrl = jsonResult[rootName]['xmlns:' + qName[0]];

    if(qName[1] === 'FEDSpec' && namespaceUrl === 'http://www.fiesta-iot.eu/fedspec')
      return true;
    else
      return false;
  }
  catch( ex ) {
    return false;
  }
}

const _convertFismoXmlToJson = function(xml) {

  //  do normalization
  try {
    var jsonResult = xml2json.toJson(xml, xmlToJsonOptions);
    jsonResult = replaceNamespaceQualifier(jsonResult);

    var fismo = jsonResult['ns2_FISMO'];

    var discoverable = getPropertySafe(fismo, ['ns2_discoverable', '$t'], 'false');
    setPropertySafe(fismo, ['ns2_discoverable'], discoverable === 'true');

    var experimentOutput = getPropertySafe(fismo, ['ns2_experimentOutput']);
    if( experimentOutput != null ) {
      _utilMakeArray(experimentOutput, 'ns2_file');
      _utilMakeArray(experimentOutput, 'ns2_widget');

      var aryWidget = getPropertySafe(experimentOutput, ['ns2_widget']);
      aryWidget.map(function(widget){
        var presentationAttr = getPropertySafe(widget, ['ns2_presentationAttr']);
        if(presentationAttr)
          setPropertySafe(widget, ['ns2_presentationAttr', 'name'], 'requestBody');
      });
    }

    var query = getPropertySafe(fismo, ['ns2_queryControl', 'ns3_query-request', 'query', '$t']);
    if( query )
      setPropertySafe(fismo, ['ns2_queryControl', 'ns3_query-request', 'query', '$t'], _stripCDATA(query));

    var dynamicAttrs = getPropertySafe(fismo, ['ns2_queryControl', 'ns2_dynamicAttrs']);
    if( dynamicAttrs != null )
      _utilMakeArray(dynamicAttrs, 'ns2_dynamicAttr');

    return fismo;
  }
  catch( ex ) {
    throw ex;
  }

}



function _stripCDATA(value) {
  var index = value.indexOf( '<![CDATA[');
  var result = value.substr(index + '<![CDATA['.length);

  index = result.lastIndexOf(']]>');
  result = result.substr(0, index).trim();

  return result;
}

function _wrapCDATA(value) {
  return '<![CDATA[' + value + ']]>';
}


const _convertFemoJsonToXml = function(femoJson) {

  //  do normalization
  try {

    femoJson = recoverNamespaceQualifier(femoJson);
    femoJson['ns2:FISMO'].map(function(item){

      var discoverable = getPropertySafe(item, ['ns2:discoverable'], false);
      setPropertySafe(item, ['ns2:discoverable', '$t'], discoverable ? 'true':'false');
/*
      var reportIfEmpty = getPropertySafe(item, ['ns2:experimentControl', 'ns2:reportIfEmpty'], true);
      setPropertySafe(item, ['ns2:experimentControl', 'ns2:reportIfEmpty', '$t'], reportIfEmpty ? 'true':'false');
*/
      var aryWidget = getPropertySafe(item, ['ns2:experimentOutput', 'ns2:widget']);
      if(aryWidget) {
        aryWidget.map(function(widget){
          var presentationAttrValue = getPropertySafe(widget, ['ns2:presentationAttr', 'value']);
          if(presentationAttrValue) {
            setPropertySafe(widget, ['ns2:presentationAttr', 'name'], 'requestBody');
          }
        });
      }



      var query = getPropertySafe(item, ['ns2:queryControl', 'ns3:query-request', 'query', '$t']);
      if( query )
        setPropertySafe(item, ['ns2:queryControl', 'ns3:query-request', 'query', '$t'], _wrapCDATA(query));
    });

    var jsonParam = {'ns2:FEMO': femoJson};

    //  convert normalized json to xml
    var xml = xml2json.toXml(jsonParam);


    return pd.xml(xml);
  }
  catch (ex) {
    throw ex;
  }
}

const _convertFismoJsonToXml = function(fismoJson) {

  //  do normalization
  try {

    fismoJson = recoverNamespaceQualifier(fismoJson);

    var discoverable = getPropertySafe(fismoJson, ['ns2:discoverable'], false);
    setPropertySafe(fismoJson, ['ns2:discoverable', '$t'], discoverable ? 'true':'false');

    var aryWidget = getPropertySafe(fismoJson, ['ns2:experimentOutput', 'ns2:widget']);
    if(aryWidget) {
      aryWidget.map(function(widget){
        var presentationAttrValue = getPropertySafe(widget, ['ns2:presentationAttr', 'value']);
        if(presentationAttrValue) {
          setPropertySafe(widget, ['ns2:presentationAttr', 'name'], 'requestBody');
        }
      });
    }

    var query = getPropertySafe(fismoJson, ['ns2:queryControl', 'ns3:query-request', 'query', '$t']);
    if( query )
      setPropertySafe(fismoJson, ['ns2:queryControl', 'ns3:query-request', 'query', '$t'], _wrapCDATA(query));

    var jsonParam = {'ns2:FISMO': fismoJson};

    //  convert normalized json to xml
    var xml = xml2json.toXml(jsonParam);


    return pd.xml(xml);
  }
  catch (ex) {
    throw ex;
  }
}


//  make some property of object to array.
//  - xml2json library which used in server side doesn't know some elements can be multiple times.
//    so.. this function makes some property to array in case of target property is  null or object.
//    if that property is array already, this function do nothing
//
//    if target object(@parent) is null, throw Error
function _utilMakeArray(parent, propName) {
  if( !parent )
    throw new Error('Illegal parameter: object is null');

  if( !propName )
    throw new Error('Illegal parameter: property name cannot be null or blanks');

  //  in case of property is undefined or has null value
  if( !parent[propName] ) {
    //  make property as blank array
    parent[propName] = [];
  }
  else {
    //  in case of property is not undefined and has object value
    if ( !Array.isArray(parent[propName]) ) {

      //  backup current property value
      var obj = parent[propName];

      //  make property to array that has backed up value as array item
      parent[propName] = [obj];
    }

    // in case of property has array value
    else {
      //  no op
    }
  }
}


const functions = {
  fedspec: {
    isFedspecXml: _testFedspecXml
  },
  femo: {
    toJson: _convertFemoXmlToJson,
    toXml: _convertFemoJsonToXml,
    isFemoXml: _testFemoXml
  },
  fismo: {  //  TODO: thyun
    toJson: _convertFismoXmlToJson,
    toXml: _convertFismoJsonToXml
  },
  descIds: {
    toJson: _convertDescIdsXmlToJson,
    toXml: _convertDescIdsJsonToXml
  },
  descId: {
    toJson: _convertDescIdXmlToJson,
    toXml: _convertDescIdJsonToXml
  }
};


module.exports=functions;
