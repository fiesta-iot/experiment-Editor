/**
 * Created by kimtaehyun on 2017. 9. 18..
 */
var convertUtil = require('../logic/convertUtil.js');
var fs = require('fs');

var femoXml = fs.readFileSync(__dirname + '/femo.xml', 'utf8');
var fedspecXml = fs.readFileSync(__dirname + '/fedspec.xml', 'utf8');
var fismoXml = fs.readFileSync(__dirname + '/fismo.xml', 'utf8');
var notXml = fs.readFileSync(__dirname + '/query-template.txt', 'utf8');

var testXml = '<ns2:FEMO xmlns:ns2="http://www.fiesta-iot.eu/fedspec" xmlns:ns3="http://www.w3.org/2007/SPARQL/protocol-types#" id="24b0e0d5-982a-11e7-b02b-fa163e11a752" name="MyNewExperiment3new"><ns2:description>LargeScale crowdsensing experiment</ns2:description><ns2:domainOfInterest>http://purl.org/iot/vocab/m3-lite#Transportation http://purl.org/iot/vocab/m3-lite#Environment http://purl.org/iot/vocab/m3-lite#City http://purl.org/iot/vocab/m3-lite#Health</ns2:domainOfInterest><ns2:FISMO id="24b0f10d-982a-11e7-b02b-fa163e11a752" name="2ndUseCase"><ns2:description>Over time all noise observations for a given location</ns2:description><ns2:experimentControl><ns2:scheduling><ns2:startTime>2016-11-08T18:50:00Z</ns2:startTime><ns2:Periodicity>600</ns2:Periodicity><ns2:stopTime>2017-11-08T18:49:59Z</ns2:stopTime></ns2:scheduling></ns2:experimentControl><ns2:experimentOutput location="https://mimove-apps.paris.inria.fr/tomcat/ExperimentServer/store/"></ns2:experimentOutput><ns2:queryControl><ns3:query-request><query><![CDATA[Prefix ssn: <http://purl.oclc.org/NET/ssnx/ssn#> Prefix iotlite: <http://purl.oclc.org/NET/UNIS/fiware/iot-lite#> Prefix dul: <http://www.loa.istc.cnr.it/ontologies/UDL.owl#> Prefix geo: <http://www.w3.org/2003/01/geo/wgs84_pos#> Prefix time: <http://www.w3.org/2006/time#> Prefix m3-lite: <http://purl.org/iot/vocab/m3-lite#> Prefix xsd: <http://www.w3.org/2001/XMLSchema#> select ?s ?tim ?val where {?o a ssn:Observation. ?o ssn:observedBy ?s. ?o ssn:observedProperty ?qk. Values ?qk {m3-lite:Sound m3-lite:SoundPressureLevelAmbient} ?o ssn:observationSamplingTime ?t. ?o geo:location ?point. ?point geo:lat "4.346104E1"^^xsd:double. ?point geo:long "-3.80649E0"^^xsd:double. ?t time:inXSDDateTime ?ti. ?o ssn:observationResult ?or. ?or  ssn:hasValue ?v. ?v dul:hasDataValue ?val. } group by (?s) ?tim ?val ]]></query></ns3:query-request></ns2:queryControl><ns2:discoverable>false</ns2:discoverable></ns2:FISMO><ns2:FISMO id="24b13aa5-982a-11e7-b02b-fa163e11a752" name="2ndUseCase-for-multi-fismo-on-one-femo"><ns2:description>Over time all noise observations for a given location</ns2:description><ns2:experimentControl><ns2:scheduling><ns2:startTime>2016-11-08T18:50:00Z</ns2:startTime><ns2:Periodicity>600</ns2:Periodicity><ns2:stopTime>2017-11-08T18:49:59Z</ns2:stopTime></ns2:scheduling></ns2:experimentControl><ns2:experimentOutput location="https://mimove-apps.paris.inria.fr/tomcat/ExperimentServer/store/"></ns2:experimentOutput><ns2:queryControl><ns3:query-request><query><![CDATA[Prefix ssn: <http://purl.oclc.org/NET/ssnx/ssn#> Prefix iotlite: <http://purl.oclc.org/NET/UNIS/fiware/iot-lite#> Prefix dul: <http://www.loa.istc.cnr.it/ontologies/UDL.owl#> Prefix geo: <http://www.w3.org/2003/01/geo/wgs84_pos#> Prefix time: <http://www.w3.org/2006/time#> Prefix m3-lite: <http://purl.org/iot/vocab/m3-lite#> Prefix xsd: <http://www.w3.org/2001/XMLSchema#> select ?s ?tim ?val where {?o a ssn:Observation. ?o ssn:observedBy ?s. ?o ssn:observedProperty ?qk. Values ?qk {m3-lite:Sound m3-lite:SoundPressureLevelAmbient} ?o ssn:observationSamplingTime ?t. ?o geo:location ?point. ?point geo:lat "4.346104E1"^^xsd:double. ?point geo:long "-3.80649E0"^^xsd:double. ?t time:inXSDDateTime ?ti. ?o ssn:observationResult ?or. ?or  ssn:hasValue ?v. ?v dul:hasDataValue ?val. } group by (?s) ?tim ?val ]]></query></ns3:query-request></ns2:queryControl><ns2:discoverable>false</ns2:discoverable></ns2:FISMO></ns2:FEMO>';


//var result = convertUtil.femo.toJson(testXml);
var isFemo = convertUtil.femo.isFemoXml(femoXml);
var isFedspec = convertUtil.fedspec.isFedspecXml(fedspecXml);

console.log( 'VALID     FEMO', isFemo, 'Fedspec', isFedspec);

var isFemo = convertUtil.femo.isFemoXml(fismoXml);
var isFedspec = convertUtil.fedspec.isFedspecXml(fismoXml);

console.log( 'NOT VALID FEMO', isFemo, 'Fedspec', isFedspec);

var isFemo = convertUtil.femo.isFemoXml(notXml);
var isFedspec = convertUtil.fedspec.isFedspecXml(notXml);

console.log( 'NOT XML   FEMO', isFemo, 'Fedspec', isFedspec);


//console.log( JSON.stringify(result, null, '  '));

