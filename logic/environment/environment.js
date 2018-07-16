/**
 * Created by ramnathteja on 07/07/2017.
 */

const environment_development={
    authorizationToken_uri:'https://platform-dev.fiesta-iot.eu/openam/json/authenticate',
    openamIdFromSession_uri: 'https://platform-dev.fiesta-iot.eu/openam/json/users?_action=idFromSession',
    openamSessionValidate_uri: 'http://platform-dev.fiesta-iot.eu/openam/json/sessions/',  //  + {{sessionKey}}?_action=validate
    openamSessionLogout_uri: 'https://platform-dev.fiesta-iot.eu/openam/json/sessions/?_action=logout',
    saveUserExperiments_uri:'https://platform-dev.fiesta-iot.eu/experiment.erm/rest/experimentservices/saveUserExperiments',
    deleteUserExperiments_uri:'https://platform-dev.fiesta-iot.eu/experiment.erm/rest/experimentservices/deleteUserExperiments',
    deleteUserExperiment_uri:'https://platform-dev.fiesta-iot.eu/experiment.erm/rest/experimentservices/deleteUserExperiment',
    deleteExperimentServiceModelObject:'https://platform-dev.fiesta-iot.eu/experiment.erm/rest/experimentservices/deleteExperimentServiceModelObject',
    saveUserExperiment_uri:'https://platform-dev.fiesta-iot.eu/experiment.erm/rest/experimentservices/saveUserExperiment',
    getALLUserExperiments_uri:'https://platform-dev.fiesta-iot.eu/experiment.erm/rest/experimentservices/getALLUserExperiments',
    getAllUserExperimentsDescriptions_uri:'https://platform-dev.fiesta-iot.eu/experiment.erm/rest/experimentservices/getAllUserExperimentsDescriptions',
    getExperimentDescription_uri:'https://platform-dev.fiesta-iot.eu/experiment.erm/rest/experimentservices/getExperimentDescription',
    getDiscoverableExperimentServiceModelObjects_uri:'https://platform-dev.fiesta-iot.eu/experiment.erm/rest/experimentservices/getDiscoverableExperimentServiceModelObject',
    getExperimentModelObject:'https://platform-dev.fiesta-iot.eu/experiment.erm/rest/experimentservices/getExperimentModelObject',
    getExperimentServiceModelObject:'https://platform-dev.fiesta-iot.eu/experiment.erm/rest/experimentservices/getExperimentServiceModelObject',
    iotRegistryGlobal:'https://platform-dev.fiesta-iot.eu/iot-registry/api/queries/execute/global',
    iotRegistryResources:'https://platform-dev.fiesta-iot.eu/iot-registry/api/queries/execute/resources',
    saveExperimentServiceModelObject:'https://platform-dev.fiesta-iot.eu/experiment.erm/rest/experimentservices/saveExperimentServiceModelObject'
};

const environment_production={
  authorizationToken_uri:'https://platform.fiesta-iot.eu/openam/json/authenticate',
  openamIdFromSession_uri: 'https://platform.fiesta-iot.eu/openam/json/users?_action=idFromSession',
  openamSessionValidate_uri: 'http://platform.fiesta-iot.eu/openam/json/sessions/',  //  + {{sessionKey}}?_action=validate
  openamSessionLogout_uri: 'https://platform.fiesta-iot.eu/openam/json/sessions/?_action=logout',
  saveUserExperiments_uri:'https://platform.fiesta-iot.eu/experiment.erm/rest/experimentservices/saveUserExperiments',
  deleteUserExperiments_uri:'https://platform.fiesta-iot.eu/experiment.erm/rest/experimentservices/deleteUserExperiments',
  deleteUserExperiment_uri:'https://platform.fiesta-iot.eu/experiment.erm/rest/experimentservices/deleteUserExperiment',
  deleteExperimentServiceModelObject:'https://platform.fiesta-iot.eu/experiment.erm/rest/experimentservices/deleteExperimentServiceModelObject',
  saveUserExperiment_uri:'https://platform.fiesta-iot.eu/experiment.erm/rest/experimentservices/saveUserExperiment',
  getALLUserExperiments_uri:'https://platform.fiesta-iot.eu/experiment.erm/rest/experimentservices/getALLUserExperiments',
  getAllUserExperimentsDescriptions_uri:'https://platform.fiesta-iot.eu/experiment.erm/rest/experimentservices/getAllUserExperimentsDescriptions',
  getExperimentDescription_uri:'https://platform.fiesta-iot.eu/experiment.erm/rest/experimentservices/getExperimentDescription',
  getDiscoverableExperimentServiceModelObjects_uri:'https://platform.fiesta-iot.eu/experiment.erm/rest/experimentservices/getDiscoverableExperimentServiceModelObject',
  getExperimentModelObject:'https://platform.fiesta-iot.eu/experiment.erm/rest/experimentservices/getExperimentModelObject',
  getExperimentServiceModelObject:'https://platform.fiesta-iot.eu/experiment.erm/rest/experimentservices/getExperimentServiceModelObject',
  iotRegistryGlobal:'https://platform.fiesta-iot.eu/iot-registry/api/queries/execute/global',
  iotRegistryResources:'https://platform.fiesta-iot.eu/iot-registry/api/queries/execute/resources',
  saveExperimentServiceModelObject:'https://platform.fiesta-iot.eu/experiment.erm/rest/experimentservices/saveExperimentServiceModelObject'
};


if( process.env.NODE_ENV && process.env.NODE_ENV === 'production' )
  module.exports=environment_production;
else
  module.exports=environment_development;
