/**
 * Created by ramnathteja on 12/07/2017.
 */

var request=require('request');
var getCookie=require('./getCookie');
var JSONPath = require('jsonpath');
var environment=require('../logic/environment/environment');


const getDomainOfInterests= function (req, res, callback) {
  getCookie(req, res, function (sessionKey, userId) {
        var accessToken=sessionKey;
        var userId = userId;
        if(accessToken!=null||accessToken!=undefined){
            var request = require("request");
            var options = { method: 'POST',
                url: environment.iotRegistryGlobal,
                headers:
                    {   iplanetdirectorypro: accessToken,
                        accept: 'application/json',
                        'content-type': 'text/plain' },
                body: 'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> \r\nPREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> \r\nPREFIX ssn: <http://purl.oclc.org/NET/ssnx/ssn#> \r\nPREFIX iot-lite: <http://purl.oclc.org/NET/UNIS/fiware/iot-lite#> \r\nPREFIX dul: <http://www.loa.istc.cnr.it/ontologies/DUL.owl#> \r\nPREFIX time: <http://www.w3.org/2006/time#> \r\nPREFIX qu-quantity: <http://purl.oclc.org/NET/ssnx/qu/quantity#> \r\nPREFIX qu-unit: <http://purl.oclc.org/NET/ssnx/qu/unit#> \r\nPREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#> \r\nPREFIX m3-lite: <http://purl.org/iot/vocab/m3-lite#> \r\nPREFIX xsd: <http://www.w3.org/2001/XMLSchema#> \r\n \r\n# url: https://platform-dev.fiesta-iot.eu/iot-registry/api/queries/execute/resources \r\n#resource type \r\nSELECT ?subClass WHERE { ?subClass rdfs:subClassOf m3-lite:DomainOfInterest . }' };

            request(options, function (error, response, body) {
                // callback(response.statusCode);
                if (error) throw new Error(error);
                if (response.statusCode != 404) {

                  var items = JSON.parse(body).items;
                  var resp = [];
                  items.map(function(item){
                    resp.push( item.subClass );
                  });

                  //todo delete this line after resolving DOI
                  resp=[];
                  resp=['http://purl.org/iot/vocab/m3-lite#Health','http://purl.org/iot/vocab/m3-lite#Emotion','http://purl.org/iot/vocab/m3-lite#BuildingAutomation',
                  'http://purl.org/iot/vocab/m3-lite#EnergyDOI','http://purl.org/iot/vocab/m3-lite#Tourism','http://purl.org/iot/vocab/m3-lite#Place','http://purl.org/iot/vocab/m3-lite#City',
                  'http://purl.org/iot/vocab/m3-lite#Environment','http://purl.org/iot/vocab/m3-lite#Agriculture','http://purl.org/iot/vocab/m3-lite#Weather','http://purl.org/iot/vocab/m3-lite#Transportation'];
                  callback(error, resp);
                }
            });

        }else{
            //todo fault safe condition
        }
    });
};

module.exports=getDomainOfInterests;
