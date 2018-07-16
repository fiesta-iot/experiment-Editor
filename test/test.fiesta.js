/**
 * Created by kimtaehyun on 2017. 9. 4..
 */
var service=require('../logic/services');
var getResources=require('../logic/getResources');
var getDOI=require('../logic/getDOI');



var SERVICE_COMMANDS = [
  "saveUserExperiments",    // 0
  "deleteUserExperiments",  //  1
  "saveUserExperiment",     //  2
  "getALLUserExperiments",  //  3
  "getAllUserExperimentsDescriptions",  //  4
  "getDiscoverableExperimentServiceModelObjects"  //5
];

var command = 11;  //   10: QuantyKind, 11: DOI

var fismo = getFismoTemplate();



if(command == 10) {
  getResources(function (error,result) {

    if( error ) {
      console.log( error );
    }
    console.log( result );
  })
}
else if(command == 11) {
  getDOI(function (error,result) {

    if( error ) {
      console.log( error );
    }
    console.log( result );
  })
}
else {

  service(SERVICE_COMMANDS[command],null,function (error,result) {

    if( error ) {
      console.log( error );
    }
    console.log( result );
  });


}




function getFismoTemplate() {
  return "<ns2:FISMO id=\"12eca60f-8e87-11e7-b02b-fa163e11a752\" name=\"myUseCase3\">\n" +
    "    <ns2:description>Test3</ns2:description>\n" +
    "    <ns2:discoverable>true</ns2:discoverable>\n" +
    "    <ns2:experimentControl><ns2:scheduling>\n" +
    "      <ns2:startTime>2016-11-08T18:50:00Z</ns2:startTime>\n" +
    "      <ns2:Periodicity>600</ns2:Periodicity>\n" +
    "      <ns2:stopTime>2017-11-08T18:49:59Z</ns2:stopTime>\n" +
    "    </ns2:scheduling>\n" +
    "      \n" +
    "      <ns2:reportIfEmpty>false</ns2:reportIfEmpty>\n" +
    "    </ns2:experimentControl>\n" +
    "    \n" +
    "    <ns2:experimentOutput location=\"https://mimove-apps.paris.inria.fr/tomcat/ExperimentServer/store/\">\n" +
    "      <ns2:file>\n" +
    "        <ns2:type>application/json</ns2:type>\n" +
    "      </ns2:file>\n" +
    "      <ns2:widget widgetID=\"eu.fiestaiot.analytics.toolkit\">\n" +
    "        <ns2:presentationAttr name=\"requestBody\" value=\"{&quot;Method&quot;: [&quot;FFT&quot;],&quot;Parameters&quot;: [&quot;&quot;]}\"/>\n" +
    "      </ns2:widget>\n" +
    "    </ns2:experimentOutput>\n" +
    "    <ns2:queryControl>\n" +
    "      <ns3:query-request>\n" +
    "        <query>&lt;![CDATA[&lt;![CDATA[\n" +
    "  PREFIX iot-lite: &lt;http://purl.oclc.org/NET/UNIS/fiware/iot-lite#&gt;\n" +
    "  PREFIX m3-lite: &lt;http://purl.org/iot/vocab/m3-lite#&gt;\n" +
    "  PREFIX ssn: &lt;http://purl.oclc.org/NET/ssnx/ssn#&gt;\n" +
    "  PREFIX geo:  &lt;http://www.w3.org/2003/01/geo/wgs84_pos#&gt;\n" +
    "  PREFIX xsd:    &lt;http://www.w3.org/2001/XMLSchema#&gt;\n" +
    "  PREFIX rdfs: &lt;http://www.w3.org/2000/01/rdf-schema#&gt;\n" +
    "  PREFIX dul: &lt;http://www.loa.istc.cnr.it/ontologies/DUL.owl#&gt;\n" +
    "  PREFIX time: &lt;http://www.w3.org/2006/time#&gt;\n" +
    "  PREFIX sics: &lt;http://smart-ics.ee.surrey.ac.uk/fiesta-iot#&gt;\n" +
    "  SELECT  ?sensingDevice ?dataValue ?dateTime\n" +
    "  WHERE {\n" +
    "  ?sensingDevice a m3-lite:EnergyMeter .\n" +
    "  ?sensingDevice iot-lite:hasQuantityKind ?qk .\n" +
    "  ?qk a m3-lite:Power .\n" +
    "  ?sensingDevice iot-lite:hasUnit ?unit .\n" +
    "  ?unit a m3-lite:Watt .\n" +
    "  ?sensingDevice iot-lite:isSubSystemOf ?device .\n" +
    "  ?device a ssn:Device .\n" +
    "  ?device ssn:onPlatform ?platform .\n" +
    "  ?platform geo:location ?point .\n" +
    "  ?point geo:lat ?lat .\n" +
    "  ?point geo:long ?long .\n" +
    "  ?observation ssn:observedBy ?sensingDevice .\n" +
    "  ?observation ssn:observationResult ?sensorOutput .\n" +
    "  ?sensorOutput ssn:hasValue ?obsValue .\n" +
    "  ?obsValue dul:hasDataValue ?dataValue .\n" +
    "  ?observation ssn:observationSamplingTime ?instant .\n" +
    "  ?instant time:inXSDDateTime ?dateTime .\n" +
    "  FILTER (\n" +
    "  ( xsd:dateTime(?dateTime) &gt; xsd:dateTime(\\\"2017-05-01T12:10:00Z\\\"))\n" +
    "  &amp;&amp; ( xsd:dateTime(?dateTime) &lt; xsd:dateTime(\\\"2017-05-01T14:20:00Z\\\"))) .\n" +
    "  FILTER (\n" +
    "  (xsd:double(?lat) &gt;= \\\"0\\\"^^xsd:double) &amp;&amp; (xsd:double(?lat) &lt;= \\\"60\\\"^^xsd:double) &amp;&amp; ( xsd:double(?long) &lt; \\\"10\\\"^^xsd:double)  &amp;&amp; ( xsd:double(?long) &gt; \\\"-6\\\"^^xsd:double))  .\n" +
    "  }ORDER BY ?sensingDevice ASC(?dateTime)\"\n" +
    "  ]]&gt;]]&gt;</query>\n" +
    "      </ns3:query-request>\n" +
    "      <ns2:dynamicAttrs>\n" +
    "        <ns2:predefinedDynamicAttr>\n" +
    "          <ns2:dynamicQueryInterval>\n" +
    "            <ns2:intervalNowToPast>600000</ns2:intervalNowToPast>\n" +
    "          </ns2:dynamicQueryInterval></ns2:predefinedDynamicAttr></ns2:dynamicAttrs></ns2:queryControl></ns2:FISMO>";
}
