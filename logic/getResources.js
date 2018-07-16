/**
 * Created by ramnathteja on 12/07/2017.
 */

var request=require('request');
var getCookie=require('./getCookie');
var JSONPath = require('jsonpath');
var environment=require('../logic/environment/environment');

const getQuantityKinds= function (req, res, callback) {
  getCookie(req, res, function (sessionKey, userId) {
        var accessToken=sessionKey;
        var userId = userId;
        if(accessToken!=null||accessToken!=undefined){
            var request = require("request");
            var options = { method: 'POST',
                url: environment.iotRegistryResources,
                headers:
                    {   iplanetdirectorypro: accessToken,
                        accept: 'application/json',
                        'content-type': 'text/plain' },
                body: 'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\r\nPREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\r\nPREFIX ssn: <http://purl.oclc.org/NET/ssnx/ssn#>\r\nPREFIX iot-lite: <http://purl.oclc.org/NET/UNIS/fiware/iot-lite#>\r\nPREFIX dul: <http://www.loa.istc.cnr.it/ontologies/DUL.owl#>\r\nPREFIX time: <http://www.w3.org/2006/time#>\r\nPREFIX qu-quantity: <http://purl.oclc.org/NET/ssnx/qu/quantity#>\r\nPREFIX qu-unit: <http://purl.oclc.org/NET/ssnx/qu/unit#>\r\nPREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#>\r\nPREFIX m3-lite: <http://purl.org/iot/vocab/m3-lite#>\r\nPREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\r\n\r\n# url: https://platform-dev.fiesta-iot.eu/iot-registry/api/queries/execute/resources\r\n#resource type\r\nSELECT DISTINCT ?qkType (count (?entity) as ?No_Resource)\r\nWHERE {\r\n  \r\n  #remove the the hash sign to enable filter\t\r\n  #FILTER (IRI(?deployment)=<https://platform-dev.fiesta-iot.eu/iot-registry/api/testbeds/a1yp9GcKEPw37Bx5rslgRI4QLSNCwEwBatCIOe_W0dHZCmzj2WmkExz3qoNuvWg1pueAXn1Li0JrNjvBiQwV3Q==> || IRI(?deployment)=<https://platform-dev.fiesta-iot.eu/iot-registry/api/testbeds/mWtk9COcdXz4QJdrJzRPL_Dp827aCngjszMZ2NHwCuyb6uEa6RhUlzJ2KsrlRtrXg4DUb0ac1Q60aVy8C7yykg==>)\r\n  \r\n  # ssn:Devices\r\n  {\r\n    ?entity ssn:hasDeployment ?deployment .\r\n    \r\n  }\r\n  UNION\r\n  # ssn:SensingDevices\r\n  {\r\n    ?device ssn:hasDeployment ?deployment .\r\n    ?device ssn:hasSubSystem ?entity .\r\n   }\r\n  #?entity rdf:type ?type .\r\n\r\n  ?entity iot-lite:hasQuantityKind ?qk .\r\n\r\n  ?qk rdf:type ?qkType .\r\n\r\n  \r\n}GROUP BY ?qkType' };

            request(options, function (error, response, body) {
                // callback(response.statusCode);
                if (error) throw new Error(error);
                if (response.statusCode == 200) {
                    var qkType = JSONPath.query(JSON.parse(body), '$..qkType');
                    var NoR = JSONPath.query(JSON.parse(body), '$..No_Resource');
                    var resp = [];
                    for (var i = 0; i < qkType.length; i++) {
                        resp[i] = {kind:qkType[i],noR:NoR[i].substring(0, NoR[i].indexOf('^^'))};
                    }
                    callback(null, resp);
                }
                else
                  callback(response, []);
            });

        }else{
            //todo fault safe condition session expiration
        }
    });
};

module.exports=getQuantityKinds;
