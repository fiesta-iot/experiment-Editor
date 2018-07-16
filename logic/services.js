/**
 * Created by ramnathteja on 07/07/2017.
 */

var environment=require('../logic/environment/environment');
var request=require('request');
var getCookie=require('./getCookie');

const service=function(req, res, serviceTYpe,identification, payload,callback){
  getCookie(req, res, function (sessionKey, userId) {
    var accessToken=sessionKey;
    var userId = userId;
    if(accessToken!=null||accessToken!=undefined){
      console.log(accessToken);
      var options=null;
      switch (serviceTYpe){

        case 'saveExperimentServiceModelObject':
          options={ method:'POST',
            url:environment.saveExperimentServiceModelObject,
            qs: { femoID: identification },
            headers:
              {
                'cache-control': 'no-cache',
                'content-type': 'application/xml',
                iplanetdirectorypro: accessToken
              },
            body:payload
          };
          break;

        case 'saveUserExperiments'://fedspec
          options = { method: 'POST',
            url: environment.saveUserExperiments_uri,
            headers:
              {   'cache-control': 'no-cache',
                'content-type': 'application/xml',
                iplanetdirectorypro: accessToken
              },
            body: payload
          };
          break;

        case 'saveUserExperiment'://femo

          options = { method: 'POST',
            url: environment.saveUserExperiment_uri,
            qs: { userID: userId },
            headers:
              {
                'cache-control': 'no-cache',
                'content-type': 'application/xml',
                iplanetdirectorypro: accessToken
              },
            body:payload
          };
          break;

        case 'deleteUserExperiments':
          options = { method: 'POST',
            url: environment.deleteUserExperiments_uri,
            qs: { userID: userId },
            headers:
              {   'cache-control': 'no-cache',
                iplanetdirectorypro: accessToken
              }
          };
          break;

        case 'deleteUserExperiment':
          options={ method: 'POST',
            url: environment.deleteUserExperiment_uri,
            qs: { userID:userId,femoID: identification },
            headers:
              {  'cache-control': 'no-cache',
                iplanetdirectorypro: accessToken } };
          break;

        case 'deleteExperimentServiceModelObject':
          options={ method: 'POST',
            url:environment.deleteExperimentServiceModelObject,
            qs: { fismoID: identification },
            headers:
              {'cache-control': 'no-cache',
                iplanetdirectorypro: accessToken } };
          break;


        case 'getExperimentDescription':
          options = { method: 'GET',
            url: environment.getExperimentDescription_uri,
            qs: { femoID: identification },
            headers:
              { 'postman-token': '1f47be47-9664-3eb3-2a82-325de1e85166',
                'cache-control': 'no-cache',
                iplanetdirectorypro: accessToken },
            body: '<rdf:RDF\r\n    xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"\r\n    xmlns:dul="http://www.loa.istc.cnr.it/ontologies/DUL.owl#"\r\n    xmlns:qu="http://purl.org/NET/ssnx/qu/qu#"\r\n    xmlns:geo="http://www.w3.org/2003/01/geo/wgs84_pos#"\r\n    xmlns:ssn="http://purl.oclc.org/NET/ssnx/ssn#"\r\n    xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#"\r\n    xmlns:iot-lite="http://purl.oclc.org/NET/UNIS/fiware/iot-lite#"\r\n    xmlns:time="http://www.w3.org/2006/time#"\r\n    xmlns:owl="http://www.w3.org/2002/07/owl#"\r\n    xmlns:m3-lite="http://purl.org/iot/vocab/m3-lite#"\r\n    xmlns:fiesta="http://purl.org/iot/ontology/fiesta-iot#"\r\n    xmlns:xsd="http://www.w3.org/2001/XMLSchema#"\r\n    xmlns:keti="http://203.253.128.151:8080/ontologies/fiesta/ketitestbed.owl#">\r\n  <owl:Class rdf:about="http://purl.oclc.org/NET/ssnx/ssn#ObservationValue"/>\r\n  <owl:Class rdf:about="http://purl.oclc.org/NET/ssnx/ssn#SensorOutput"/>\r\n  <owl:Class rdf:about="http://purl.oclc.org/NET/ssnx/ssn#Observation"/>\r\n  <owl:Class rdf:about="http://www.w3.org/2006/time#Instant"/>\r\n  <owl:Class rdf:about="http://www.w3.org/2003/01/geo/wgs84_pos#Point"/>\r\n  <ssn:Observation>\r\n    <ssn:observationSamplingTime>\r\n      <time:Instant>\r\n        <time:inXSDDateTime rdf:datatype="http://www.w3.org/2001/XMLSchema#dateTime"\r\n        >2017-02-24T11:07:25.497Z</time:inXSDDateTime>\r\n      </time:Instant>\r\n    </ssn:observationSamplingTime>\r\n    <geo:location>\r\n      <geo:Point>\r\n        <geo:long rdf:datatype="http://www.w3.org/2001/XMLSchema#double"\r\n        >127.16069</geo:long>\r\n        <geo:lat rdf:datatype="http://www.w3.org/2001/XMLSchema#double"\r\n        >37.403801</geo:lat>\r\n      </geo:Point>\r\n    </geo:location>\r\n    <ssn:observationResult>\r\n      <ssn:SensorOutput>\r\n        <ssn:hasValue>\r\n          <ssn:ObservationValue>\r\n            <iot-lite:hasUnit>\r\n              <m3-lite:PPM rdf:about="http://203.253.128.151:8080/ontologies/fiesta/ketitestbed.owl#PPM"/>\r\n            </iot-lite:hasUnit>\r\n            <dul:hasDataValue rdf:datatype="http://www.w3.org/2001/XMLSchema#double"\r\n            >1633.0</dul:hasDataValue>\r\n          </ssn:ObservationValue>\r\n        </ssn:hasValue>\r\n      </ssn:SensorOutput>\r\n    </ssn:observationResult>\r\n    <ssn:observedBy>\r\n      <m3-lite:CO2Sensor rdf:about="http://203.253.128.151:8080/ontologies/fiesta/ketitestbed.owl#co2"/>\r\n    </ssn:observedBy>\r\n    <ssn:observedProperty>\r\n      <m3-lite:CO2 rdf:about="http://203.253.128.151:8080/ontologies/fiesta/ketitestbed.owl#CO2"/>\r\n    </ssn:observedProperty>\r\n  </ssn:Observation>\r\n</rdf:RDF>' };
          break;


        case 'getALLUserExperiments':
          options = { method: 'GET',
            url: environment.getALLUserExperiments_uri,
            qs: { userID: userId },
            headers:
              {
                iplanetdirectorypro: accessToken },
            body: '<rdf:RDF\r\n    xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"\r\n    xmlns:dul="http://www.loa.istc.cnr.it/ontologies/DUL.owl#"\r\n    xmlns:qu="http://purl.org/NET/ssnx/qu/qu#"\r\n    xmlns:geo="http://www.w3.org/2003/01/geo/wgs84_pos#"\r\n    xmlns:ssn="http://purl.oclc.org/NET/ssnx/ssn#"\r\n    xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#"\r\n    xmlns:iot-lite="http://purl.oclc.org/NET/UNIS/fiware/iot-lite#"\r\n    xmlns:time="http://www.w3.org/2006/time#"\r\n    xmlns:owl="http://www.w3.org/2002/07/owl#"\r\n    xmlns:m3-lite="http://purl.org/iot/vocab/m3-lite#"\r\n    xmlns:fiesta="http://purl.org/iot/ontology/fiesta-iot#"\r\n    xmlns:xsd="http://www.w3.org/2001/XMLSchema#"\r\n    xmlns:keti="http://203.253.128.151:8080/ontologies/fiesta/ketitestbed.owl#">\r\n  <owl:Class rdf:about="http://purl.oclc.org/NET/ssnx/ssn#ObservationValue"/>\r\n  <owl:Class rdf:about="http://purl.oclc.org/NET/ssnx/ssn#SensorOutput"/>\r\n  <owl:Class rdf:about="http://purl.oclc.org/NET/ssnx/ssn#Observation"/>\r\n  <owl:Class rdf:about="http://www.w3.org/2006/time#Instant"/>\r\n  <owl:Class rdf:about="http://www.w3.org/2003/01/geo/wgs84_pos#Point"/>\r\n  <ssn:Observation>\r\n    <ssn:observationSamplingTime>\r\n      <time:Instant>\r\n        <time:inXSDDateTime rdf:datatype="http://www.w3.org/2001/XMLSchema#dateTime"\r\n        >2017-02-24T11:07:25.497Z</time:inXSDDateTime>\r\n      </time:Instant>\r\n    </ssn:observationSamplingTime>\r\n    <geo:location>\r\n      <geo:Point>\r\n        <geo:long rdf:datatype="http://www.w3.org/2001/XMLSchema#double"\r\n        >127.16069</geo:long>\r\n        <geo:lat rdf:datatype="http://www.w3.org/2001/XMLSchema#double"\r\n        >37.403801</geo:lat>\r\n      </geo:Point>\r\n    </geo:location>\r\n    <ssn:observationResult>\r\n      <ssn:SensorOutput>\r\n        <ssn:hasValue>\r\n          <ssn:ObservationValue>\r\n            <iot-lite:hasUnit>\r\n              <m3-lite:PPM rdf:about="http://203.253.128.151:8080/ontologies/fiesta/ketitestbed.owl#PPM"/>\r\n            </iot-lite:hasUnit>\r\n            <dul:hasDataValue rdf:datatype="http://www.w3.org/2001/XMLSchema#double"\r\n            >1633.0</dul:hasDataValue>\r\n          </ssn:ObservationValue>\r\n        </ssn:hasValue>\r\n      </ssn:SensorOutput>\r\n    </ssn:observationResult>\r\n    <ssn:observedBy>\r\n      <m3-lite:CO2Sensor rdf:about="http://203.253.128.151:8080/ontologies/fiesta/ketitestbed.owl#co2"/>\r\n    </ssn:observedBy>\r\n    <ssn:observedProperty>\r\n      <m3-lite:CO2 rdf:about="http://203.253.128.151:8080/ontologies/fiesta/ketitestbed.owl#CO2"/>\r\n    </ssn:observedProperty>\r\n  </ssn:Observation>\r\n</rdf:RDF>' };
          break;


        case 'getAllUserExperimentsDescriptions':
          options = { method: 'GET',
            url: environment.getAllUserExperimentsDescriptions_uri,
            qs: { userID: userId },
            headers:
              {
                iplanetdirectorypro: accessToken },
            body: '<rdf:RDF\r\n    xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"\r\n    xmlns:dul="http://www.loa.istc.cnr.it/ontologies/DUL.owl#"\r\n    xmlns:qu="http://purl.org/NET/ssnx/qu/qu#"\r\n    xmlns:geo="http://www.w3.org/2003/01/geo/wgs84_pos#"\r\n    xmlns:ssn="http://purl.oclc.org/NET/ssnx/ssn#"\r\n    xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#"\r\n    xmlns:iot-lite="http://purl.oclc.org/NET/UNIS/fiware/iot-lite#"\r\n    xmlns:time="http://www.w3.org/2006/time#"\r\n    xmlns:owl="http://www.w3.org/2002/07/owl#"\r\n    xmlns:m3-lite="http://purl.org/iot/vocab/m3-lite#"\r\n    xmlns:fiesta="http://purl.org/iot/ontology/fiesta-iot#"\r\n    xmlns:xsd="http://www.w3.org/2001/XMLSchema#"\r\n    xmlns:keti="http://203.253.128.151:8080/ontologies/fiesta/ketitestbed.owl#">\r\n  <owl:Class rdf:about="http://purl.oclc.org/NET/ssnx/ssn#ObservationValue"/>\r\n  <owl:Class rdf:about="http://purl.oclc.org/NET/ssnx/ssn#SensorOutput"/>\r\n  <owl:Class rdf:about="http://purl.oclc.org/NET/ssnx/ssn#Observation"/>\r\n  <owl:Class rdf:about="http://www.w3.org/2006/time#Instant"/>\r\n  <owl:Class rdf:about="http://www.w3.org/2003/01/geo/wgs84_pos#Point"/>\r\n  <ssn:Observation>\r\n    <ssn:observationSamplingTime>\r\n      <time:Instant>\r\n        <time:inXSDDateTime rdf:datatype="http://www.w3.org/2001/XMLSchema#dateTime"\r\n        >2017-02-24T11:07:25.497Z</time:inXSDDateTime>\r\n      </time:Instant>\r\n    </ssn:observationSamplingTime>\r\n    <geo:location>\r\n      <geo:Point>\r\n        <geo:long rdf:datatype="http://www.w3.org/2001/XMLSchema#double"\r\n        >127.16069</geo:long>\r\n        <geo:lat rdf:datatype="http://www.w3.org/2001/XMLSchema#double"\r\n        >37.403801</geo:lat>\r\n      </geo:Point>\r\n    </geo:location>\r\n    <ssn:observationResult>\r\n      <ssn:SensorOutput>\r\n        <ssn:hasValue>\r\n          <ssn:ObservationValue>\r\n            <iot-lite:hasUnit>\r\n              <m3-lite:PPM rdf:about="http://203.253.128.151:8080/ontologies/fiesta/ketitestbed.owl#PPM"/>\r\n            </iot-lite:hasUnit>\r\n            <dul:hasDataValue rdf:datatype="http://www.w3.org/2001/XMLSchema#double"\r\n            >1633.0</dul:hasDataValue>\r\n          </ssn:ObservationValue>\r\n        </ssn:hasValue>\r\n      </ssn:SensorOutput>\r\n    </ssn:observationResult>\r\n    <ssn:observedBy>\r\n      <m3-lite:CO2Sensor rdf:about="http://203.253.128.151:8080/ontologies/fiesta/ketitestbed.owl#co2"/>\r\n    </ssn:observedBy>\r\n    <ssn:observedProperty>\r\n      <m3-lite:CO2 rdf:about="http://203.253.128.151:8080/ontologies/fiesta/ketitestbed.owl#CO2"/>\r\n    </ssn:observedProperty>\r\n  </ssn:Observation>\r\n</rdf:RDF>' };
          break;

        case 'getExperimentModelObject':
          options = { method: 'GET',
            url: environment.getExperimentModelObject,
            qs: { femoID: identification },
            headers:
              { iplanetdirectorypro: accessToken },
            body: '<rdf:RDF\r\n    xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"\r\n    xmlns:dul="http://www.loa.istc.cnr.it/ontologies/DUL.owl#"\r\n    xmlns:qu="http://purl.org/NET/ssnx/qu/qu#"\r\n    xmlns:geo="http://www.w3.org/2003/01/geo/wgs84_pos#"\r\n    xmlns:ssn="http://purl.oclc.org/NET/ssnx/ssn#"\r\n    xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#"\r\n    xmlns:iot-lite="http://purl.oclc.org/NET/UNIS/fiware/iot-lite#"\r\n    xmlns:time="http://www.w3.org/2006/time#"\r\n    xmlns:owl="http://www.w3.org/2002/07/owl#"\r\n    xmlns:m3-lite="http://purl.org/iot/vocab/m3-lite#"\r\n    xmlns:fiesta="http://purl.org/iot/ontology/fiesta-iot#"\r\n    xmlns:xsd="http://www.w3.org/2001/XMLSchema#"\r\n    xmlns:keti="http://203.253.128.151:8080/ontologies/fiesta/ketitestbed.owl#">\r\n  <owl:Class rdf:about="http://purl.oclc.org/NET/ssnx/ssn#ObservationValue"/>\r\n  <owl:Class rdf:about="http://purl.oclc.org/NET/ssnx/ssn#SensorOutput"/>\r\n  <owl:Class rdf:about="http://purl.oclc.org/NET/ssnx/ssn#Observation"/>\r\n  <owl:Class rdf:about="http://www.w3.org/2006/time#Instant"/>\r\n  <owl:Class rdf:about="http://www.w3.org/2003/01/geo/wgs84_pos#Point"/>\r\n  <ssn:Observation>\r\n    <ssn:observationSamplingTime>\r\n      <time:Instant>\r\n        <time:inXSDDateTime rdf:datatype="http://www.w3.org/2001/XMLSchema#dateTime"\r\n        >2017-02-24T11:07:25.497Z</time:inXSDDateTime>\r\n      </time:Instant>\r\n    </ssn:observationSamplingTime>\r\n    <geo:location>\r\n      <geo:Point>\r\n        <geo:long rdf:datatype="http://www.w3.org/2001/XMLSchema#double"\r\n        >127.16069</geo:long>\r\n        <geo:lat rdf:datatype="http://www.w3.org/2001/XMLSchema#double"\r\n        >37.403801</geo:lat>\r\n      </geo:Point>\r\n    </geo:location>\r\n    <ssn:observationResult>\r\n      <ssn:SensorOutput>\r\n        <ssn:hasValue>\r\n          <ssn:ObservationValue>\r\n            <iot-lite:hasUnit>\r\n              <m3-lite:PPM rdf:about="http://203.253.128.151:8080/ontologies/fiesta/ketitestbed.owl#PPM"/>\r\n            </iot-lite:hasUnit>\r\n            <dul:hasDataValue rdf:datatype="http://www.w3.org/2001/XMLSchema#double"\r\n            >1633.0</dul:hasDataValue>\r\n          </ssn:ObservationValue>\r\n        </ssn:hasValue>\r\n      </ssn:SensorOutput>\r\n    </ssn:observationResult>\r\n    <ssn:observedBy>\r\n      <m3-lite:CO2Sensor rdf:about="http://203.253.128.151:8080/ontologies/fiesta/ketitestbed.owl#co2"/>\r\n    </ssn:observedBy>\r\n    <ssn:observedProperty>\r\n      <m3-lite:CO2 rdf:about="http://203.253.128.151:8080/ontologies/fiesta/ketitestbed.owl#CO2"/>\r\n    </ssn:observedProperty>\r\n  </ssn:Observation>\r\n</rdf:RDF>' };
          break;

        case'getExperimentServiceModelObject':
          options = { method: 'GET',
            url: environment.getExperimentServiceModelObject,
            qs: { fismoID: identification },
            headers:
              { 'cache-control': 'no-cache',
                iplanetdirectorypro: accessToken },
            body: '<rdf:RDF\r\n    xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"\r\n    xmlns:dul="http://www.loa.istc.cnr.it/ontologies/DUL.owl#"\r\n    xmlns:qu="http://purl.org/NET/ssnx/qu/qu#"\r\n    xmlns:geo="http://www.w3.org/2003/01/geo/wgs84_pos#"\r\n    xmlns:ssn="http://purl.oclc.org/NET/ssnx/ssn#"\r\n    xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#"\r\n    xmlns:iot-lite="http://purl.oclc.org/NET/UNIS/fiware/iot-lite#"\r\n    xmlns:time="http://www.w3.org/2006/time#"\r\n    xmlns:owl="http://www.w3.org/2002/07/owl#"\r\n    xmlns:m3-lite="http://purl.org/iot/vocab/m3-lite#"\r\n    xmlns:fiesta="http://purl.org/iot/ontology/fiesta-iot#"\r\n    xmlns:xsd="http://www.w3.org/2001/XMLSchema#"\r\n    xmlns:keti="http://203.253.128.151:8080/ontologies/fiesta/ketitestbed.owl#">\r\n  <owl:Class rdf:about="http://purl.oclc.org/NET/ssnx/ssn#ObservationValue"/>\r\n  <owl:Class rdf:about="http://purl.oclc.org/NET/ssnx/ssn#SensorOutput"/>\r\n  <owl:Class rdf:about="http://purl.oclc.org/NET/ssnx/ssn#Observation"/>\r\n  <owl:Class rdf:about="http://www.w3.org/2006/time#Instant"/>\r\n  <owl:Class rdf:about="http://www.w3.org/2003/01/geo/wgs84_pos#Point"/>\r\n  <ssn:Observation>\r\n    <ssn:observationSamplingTime>\r\n      <time:Instant>\r\n        <time:inXSDDateTime rdf:datatype="http://www.w3.org/2001/XMLSchema#dateTime"\r\n        >2017-02-24T11:07:25.497Z</time:inXSDDateTime>\r\n      </time:Instant>\r\n    </ssn:observationSamplingTime>\r\n    <geo:location>\r\n      <geo:Point>\r\n        <geo:long rdf:datatype="http://www.w3.org/2001/XMLSchema#double"\r\n        >127.16069</geo:long>\r\n        <geo:lat rdf:datatype="http://www.w3.org/2001/XMLSchema#double"\r\n        >37.403801</geo:lat>\r\n      </geo:Point>\r\n    </geo:location>\r\n    <ssn:observationResult>\r\n      <ssn:SensorOutput>\r\n        <ssn:hasValue>\r\n          <ssn:ObservationValue>\r\n            <iot-lite:hasUnit>\r\n              <m3-lite:PPM rdf:about="http://203.253.128.151:8080/ontologies/fiesta/ketitestbed.owl#PPM"/>\r\n            </iot-lite:hasUnit>\r\n            <dul:hasDataValue rdf:datatype="http://www.w3.org/2001/XMLSchema#double"\r\n            >1633.0</dul:hasDataValue>\r\n          </ssn:ObservationValue>\r\n        </ssn:hasValue>\r\n      </ssn:SensorOutput>\r\n    </ssn:observationResult>\r\n    <ssn:observedBy>\r\n      <m3-lite:CO2Sensor rdf:about="http://203.253.128.151:8080/ontologies/fiesta/ketitestbed.owl#co2"/>\r\n    </ssn:observedBy>\r\n    <ssn:observedProperty>\r\n      <m3-lite:CO2 rdf:about="http://203.253.128.151:8080/ontologies/fiesta/ketitestbed.owl#CO2"/>\r\n    </ssn:observedProperty>\r\n  </ssn:Observation>\r\n</rdf:RDF>' };
          break;

        case 'getDiscoverableExperimentServiceModelObjects':
          options = { method: 'GET',
            url: environment.getDiscoverableExperimentServiceModelObjects_uri,
            headers:
              {
                iplanetdirectorypro: accessToken },
            body: '<rdf:RDF\r\n    xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"\r\n    xmlns:dul="http://www.loa.istc.cnr.it/ontologies/DUL.owl#"\r\n    xmlns:qu="http://purl.org/NET/ssnx/qu/qu#"\r\n    xmlns:geo="http://www.w3.org/2003/01/geo/wgs84_pos#"\r\n    xmlns:ssn="http://purl.oclc.org/NET/ssnx/ssn#"\r\n    xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#"\r\n    xmlns:iot-lite="http://purl.oclc.org/NET/UNIS/fiware/iot-lite#"\r\n    xmlns:time="http://www.w3.org/2006/time#"\r\n    xmlns:owl="http://www.w3.org/2002/07/owl#"\r\n    xmlns:m3-lite="http://purl.org/iot/vocab/m3-lite#"\r\n    xmlns:fiesta="http://purl.org/iot/ontology/fiesta-iot#"\r\n    xmlns:xsd="http://www.w3.org/2001/XMLSchema#"\r\n    xmlns:keti="http://203.253.128.151:8080/ontologies/fiesta/ketitestbed.owl#">\r\n  <owl:Class rdf:about="http://purl.oclc.org/NET/ssnx/ssn#ObservationValue"/>\r\n  <owl:Class rdf:about="http://purl.oclc.org/NET/ssnx/ssn#SensorOutput"/>\r\n  <owl:Class rdf:about="http://purl.oclc.org/NET/ssnx/ssn#Observation"/>\r\n  <owl:Class rdf:about="http://www.w3.org/2006/time#Instant"/>\r\n  <owl:Class rdf:about="http://www.w3.org/2003/01/geo/wgs84_pos#Point"/>\r\n  <ssn:Observation>\r\n    <ssn:observationSamplingTime>\r\n      <time:Instant>\r\n        <time:inXSDDateTime rdf:datatype="http://www.w3.org/2001/XMLSchema#dateTime"\r\n        >2017-02-24T11:07:25.497Z</time:inXSDDateTime>\r\n      </time:Instant>\r\n    </ssn:observationSamplingTime>\r\n    <geo:location>\r\n      <geo:Point>\r\n        <geo:long rdf:datatype="http://www.w3.org/2001/XMLSchema#double"\r\n        >127.16069</geo:long>\r\n        <geo:lat rdf:datatype="http://www.w3.org/2001/XMLSchema#double"\r\n        >37.403801</geo:lat>\r\n      </geo:Point>\r\n    </geo:location>\r\n    <ssn:observationResult>\r\n      <ssn:SensorOutput>\r\n        <ssn:hasValue>\r\n          <ssn:ObservationValue>\r\n            <iot-lite:hasUnit>\r\n              <m3-lite:PPM rdf:about="http://203.253.128.151:8080/ontologies/fiesta/ketitestbed.owl#PPM"/>\r\n            </iot-lite:hasUnit>\r\n            <dul:hasDataValue rdf:datatype="http://www.w3.org/2001/XMLSchema#double"\r\n            >1633.0</dul:hasDataValue>\r\n          </ssn:ObservationValue>\r\n        </ssn:hasValue>\r\n      </ssn:SensorOutput>\r\n    </ssn:observationResult>\r\n    <ssn:observedBy>\r\n      <m3-lite:CO2Sensor rdf:about="http://203.253.128.151:8080/ontologies/fiesta/ketitestbed.owl#co2"/>\r\n    </ssn:observedBy>\r\n    <ssn:observedProperty>\r\n      <m3-lite:CO2 rdf:about="http://203.253.128.151:8080/ontologies/fiesta/ketitestbed.owl#CO2"/>\r\n    </ssn:observedProperty>\r\n  </ssn:Observation>\r\n</rdf:RDF>' };
          break;

      }
      request(options, function (error, response, body) {
        if (error || response.statusCode >= 400) {
          if(!error){
            error={
              "statusCode":response.statusCode,
              "statusMsg":response.statusMsg
            }
          }
          callback(error,body);
        }else{
          callback(error,body);
        }
      });

    }else{
      callback('accessToken fault','access Token: '+accessToken);
    }
  });
};

module.exports=service;
