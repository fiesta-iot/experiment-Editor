/**
 * Created by kimtaehyun on 2017. 8. 2..
 */
(function(){
  'use strict';


  angular
    .module('fiestaExpModeler')
    .controller('editFemoController', EditFemoController);

  EditFemoController.$inject = ['$scope', '$rootScope', '$parse', '$state', '$stateParams', 'fiestaCloudService', 'ModalService', 'alertService'];



  function EditFemoController($scope, $rootScope, $parse, $state, $stateParams, fiestaCloudService, ModalService, alertService) {

    $scope.femoId = $stateParams.femoId;

    //  scope variables
    $scope.femo = {};


    $scope.selectedFismo = null;
    $scope.selectedQueryControl = null;

    $scope.domainOfInterestTags = [];
    $scope.expOutputFileTypeTags = [];
    $scope.quantityKindList = [];
    $scope.fileTypeList = [
      "text/plain",
      "text/tab-separated-values",
      "text/csv",
      "application/sparql-results+json",
      "application/sparql-results+xml",
      "application/sparql-results+thrift",
      "application/json",
      "text/xml",
      "application/xml"
    ];

    $scope.newFileType = '';

    //  scope functions
    $scope.init = _init;


    $scope.back = _back;
    $scope.saveFemo = _saveFemo;
    $scope.previewFemo = _previewFemo;



    $scope.selectFemo = _selectFemo;

    $scope.selectFismo = _selectFismo;
    $scope.deleteFismo = _deleteFismo;
    $scope.createFismo = _createFismo;
    $scope.cloneFismo = _cloneFismo;

    $scope.selectionClass = _selectionClass;

    $scope.selectQueryControl = _selectQueryControl;
    $scope.deleteQueryControl = _deleteQueryControl;
    $scope.createQueryControl = _createQueryControl;


    $scope.buildQueryScript = _buildQueryScript;


    $scope.editTargetClass = _editTargetClass;
    $scope.editFismoClass = _editFismoClass;
    $scope.editQueryControlClass = _editQueryControlClass;


    $scope.editExpOutputWidget = _editExpOutputWidget;
    $scope.deleteExpOutputWidget = _deleteExpOutputWidget;
    $scope.createExpOutputWidget = _createExpOutputWidget;




    $scope.loadDomainOfIntrests = _loadDomainOfIntrests;
    $scope.loadQuantityKinds = _loadQuantityKinds;
    $scope.loadExpOutputFileTypes = _loadExpOutputFileTypes;


    $scope.onDomainOfInterestsChanged = _onDomainOfInterestsChanged;
    $scope.onExpOutputFileTypeChanged = _onExpOutputFileTypeChanged;


    $scope.addNewDynamicAttribute = _addNewDynamicAttribute;
    $scope.deleteDynamicAttribute = _deleteDynamicAttribute;


    $scope.showGeolocationPicker = _showGeolocationPicker;


    $scope.formValidation = _formValidation;

    function _addNewDynamicAttribute() {
      var dynamicAttr = ST_SafeGet($scope.selectedQueryControl, ['ns2_dynamicAttrs', 'ns2_dynamicAttr']);
      if( dynamicAttr === null || dynamicAttr === undefined) {
        dynamicAttr = ST_SafeSet($scope.selectedQueryControl, ['ns2_dynamicAttrs', 'ns2_dynamicAttr'], []);
      }

      dynamicAttr.push({
        "name": $scope.newDaName,
        "value": $scope.newDaValue
      });

      $scope.newDaName = '';
      $scope.newDaValue = '';
    }

    function _deleteDynamicAttribute(index) {
      var dynamicAttr = ST_SafeGet($scope.selectedQueryControl, ['ns2_dynamicAttrs', 'ns2_dynamicAttr']);
      if( dynamicAttr === null || dynamicAttr === undefined) {
        return;
      }

      dynamicAttr.splice(index, 1);
    }

    function __getGeoLocation(location) {
      var latitude = '37.403902';
      var longitude = '127.159798';

      if(location && location.ns2_latitude)
        latitude = location.ns2_latitude.$t ? location.ns2_latitude.$t : location.ns2_latitude;
      if(location && location.ns2_longitude)
        longitude = location.ns2_longitude.$t ? location.ns2_longitude.$t : location.ns2_longitude;

      var geolocation = [parseFloat(latitude), parseFloat(longitude)];

      if(geolocation[0] == NaN)
        geolocation[0] = 37.403902;
      if(geolocation[1] == NaN)
        geolocation[1] = 127.159798;

      return geolocation;
    }

    function __getGeoLocationValue(location) {
      return {
        ns2_latitude : {
          $t: ''+location[0]
        },
        ns2_longitude: {
          $t: ''+location[1]
        }
      }
    }

    function _showGeolocationPicker(locationVariableName) {
      var location = $scope.$eval(locationVariableName);

      var geolocation = __getGeoLocation(location);

      ModalService.showModal({
        templateUrl: './app/modal/modal.geolocation.picker.html',
        controller: 'geolocationPickerController',
        scope: $scope,
        inputs: {
          location: geolocation
        }
      })
        .then(function (modal) {
          modal.element.modal();
          modal.close.then(function (result) {
            if(result) {
              var locationModel = $parse(locationVariableName);
              locationModel.assign($scope, __getGeoLocationValue(result));
            }
          });
        });
    }


    $scope.newDaName = '';
    $scope.newDaValue = '';

    //  implementation of scope function

    $scope.pickerFemoStartTime = {};
    $scope.pickerFemoStopTime = {};

    $scope.pickerDAFromDate = {};
    $scope.pickerDAToDate = {};

    $scope.datePickerModelOptions = {
      "timezone": moment().format("Z")
    };


    function _init() {

      window.showWaitforDialog();

      fiestaCloudService.getFemo($scope.femoId)

      .then(function(femo){
        $scope.$apply(function () {
          $scope.femo = femo;

          try {
            var domainOfInterest = femo.ns2_domainOfInterest.$t;
            if (domainOfInterest)
              domainOfInterest = domainOfInterest.split(' ');
            else
              domainOfInterest = [];

            $scope.domainOfInterestTags = domainOfInterest.map(function (item) {
              return {text: item};
            });
          }
          catch( ex ) {
            if(!$scope.domainOfInterestTags)
              $scope.domainOfInterestTags = [];
          }
          window.hideWaitforDialog();

        }); //  $apply()

        return fiestaCloudService.getQuantityKinds();
      })

      .then(function(quantityKinds){
        $scope.$apply(function () {
          $scope.quantityKindsList = quantityKinds;
          $scope.quantityKindsList.map(function(item){
            item.name = item.text.split('#')[1];
          })
        });


        return fiestaCloudService.getDomainOfInterests();
      })

      .then(function(domainOfInterests) {
        $scope.$apply(function () {
          $scope.domainOfInterestList = domainOfInterests;
        });
      })



      .catch(function(err){
        window.hideWaitforDialog();

      });
    } //  $scope.init



    function _saveFemo() {

      if( ! $scope.formValidation() ) {
        return;
      }

      window.showWaitforDialog();

      fiestaCloudService.saveFemo($scope.femo)

        .then(function(result){
//          alertService.showInfoMessage( 'Current Experiment is saved successfully!' );

          window.hideWaitforDialog();
          setTimeout(function(){
            $state.go( 'list' );
          }, 500);

        })
        .catch(function(err){
          alertService.showErrorMessage( err );
          window.hideWaitforDialog();
        });
    }

    function _editExpOutputWidget(widget) {
      var editingWidget = widget;
      ModalService.showModal({
        templateUrl: './app/modal/modal.widget.editor.html',
        controller: 'widgetEditorModalController',
        inputs: {
          widgetInfo: {
            'mode': 'edit',
            'widget': widget
          }
        }
      })
      .then(function (modal) {
        modal.element.modal();
        modal.close.then(function (widgetInfo) {
          if( widgetInfo ) {
            var indexOf = $scope.selectedFismo.ns2_experimentOutput.ns2_widget.indexOf(editingWidget);
            $scope.selectedFismo.ns2_experimentOutput.ns2_widget[indexOf] = widgetInfo.widget;
          }
        });
      });
    }

    function _deleteExpOutputWidget(widget) {
      var indexOf = $scope.selectedFismo.ns2_experimentOutput.ns2_widget.indexOf(widget);
      if( indexOf >= 0 ) {
        $scope.selectedFismo.ns2_experimentOutput.ns2_widget.splice(indexOf, 1);
      }
    }

    function _createExpOutputWidget() {
      ModalService.showModal({
        templateUrl: './app/modal/modal.widget.editor.html',
        controller: 'widgetEditorModalController',
        inputs: {
          widgetInfo: {
            'mode': 'create',
            'widget': null
          }
        }
      })
        .then(function (modal) {
          modal.element.modal();
          modal.close.then(function (widgetInfo) {
            if( widgetInfo ) {
              var aryWidget = ST_SafeGet($scope.selectedFismo, ['ns2_experimentOutput', 'ns2_widget']);
              if( !aryWidget ) {
                ST_SafeSet($scope.selectedFismo, ['ns2_experimentOutput', 'ns2_widget'], []);
              }

              $scope.selectedFismo.ns2_experimentOutput.ns2_widget.push( widgetInfo.widget );
            }

          });
        });
    }




    function _previewFemo() {
      if( ! $scope.formValidation() ) {
        return;
      }


      window.showWaitforDialog();

      fiestaCloudService.previewFemo($scope.femo)

        .then(function(result){


          $scope.$apply(function(){
            $scope.xmlPreview = result;

            window.hideWaitforDialog();

            ModalService.showModal({
              templateUrl: './app/modal/modal.xmlpreview.html',
              controller: 'xmlpreviewModalController',
              inputs: {
                xmlPreview: $scope.xmlPreview
              }
            })
              .then(function(modal){
                modal.element.modal();
                modal.close.then(function(safeFemo){

                  if( safeFemo ) {
                    window.showWaitforDialog();

                    fiestaCloudService.saveFemo($scope.femo)

                      .then(function(result){
//                        alertService.showInfoMessage( 'Current Experiment is saved successfully!' );
                        window.hideWaitforDialog();

                        setTimeout(function(){
                          $state.go( 'list' );
                        }, 500);

                      })
                      .catch(function(err){
                        alertService.showErrorMessage( err );
                        window.hideWaitforDialog();
                      });
                  }
                })
              });

          });

        })
        .catch(function(err){
          alertService.showErrorMessage( err );
          window.hideWaitforDialog();

        });
    }


    function _back() {
      window.history.back();
    }

    function _selectFemo() {
      if( ! $scope.formValidation() ) {
        return;
      }

      $scope.selectedFismo = null;

      $scope.selectedQueryControl = null;
    }



    function _getQuerySchedulingDatetime(type) {
      var dateStr = ST_SafeGet($scope.selectedFismo, ['ns2_experimentControl', 'ns2_scheduling', type, '$t'], null);
      if( dateStr === null )
        return null;
      else
        return new Date(dateStr);
    }

    function _setQuerySchedulingDatetime(type, date) {
      var dateValue = (date == null) ? null : date.toISOString();
      ST_SafeSet($scope.selectedFismo, ['ns2_experimentControl', 'ns2_scheduling', type, '$t'], dateValue);
    }


    function _selectFismo(fismo) {
      if( ! $scope.formValidation() ) {
        return;
      }

      $scope.selectedFismo = fismo;
      $scope.selectedQueryControl = null;

      $scope.pickerFemoStartTime = {
        date: _getQuerySchedulingDatetime('ns2_startTime'),
        timepickerOptions: {
          showMeridian: false
        },
        datepickerOptions: {
          maxDate: null
        },
        onSetTime: function () {
          _setQuerySchedulingDatetime('ns2_startTime', $scope.pickerFemoStartTime.date);
        }
      };
      $scope.pickerFemoStopTime = {
        date: _getQuerySchedulingDatetime('ns2_stopTime'),
        timepickerOptions: {
          showMeridian: false
        },
        datepickerOptions: {
          minDate: null
        },
        onSetTime: function () {
          _setQuerySchedulingDatetime('ns2_stopTime', $scope.pickerFemoStopTime.date);
        }
      };

      var aryFiles = ST_SafeGet($scope.selectedFismo, ['ns2_experimentOutput', 'ns2_file']);
      if( aryFiles ) {
        $scope.expOutputFileTypeTags = aryFiles.map(function (item) {
          return {text: ST_SafeGet(item, ['ns2_type', '$t'])};
        });
      }



    }

    function _deleteFismo(fismo) {

      if($scope.femo.ns2_FISMO.length <= 1) {
        alertService.showErrorMessage('A Experiment must have at least one Service. \r\nCannot delete this Service');
        return;
      }

      if( $scope.selectedFismo == fismo ) {
        if($scope.selectedQueryControl != null && $scope.selectedFismo.ns2_queryControl == $scope.selectedQueryControl)
          $scope.selectedQueryControl = null;

        $scope.selectedFismo = null;
      }

      var index = $scope.femo.ns2_FISMO.indexOf( fismo );
      $scope.femo.ns2_FISMO.splice(index, 1);
    }

    function _createFismo() {

      fiestaCloudService.createFismo()

      .then(function(newFismo){

        $scope.$apply(function(){
          if (!$scope.femo.ns2_FISMO) {
            $scope.femo.ns2_FISMO = [];
          }

          $scope.femo.ns2_FISMO.push( newFismo );

        });
      })

      .catch(function(err) {

      } );

    }


    function _selectionClass(type, obj) {
      switch(type) {
        case  'femo':
          if($scope.selectedFismo)
            return ['selected'];
          else
            return ['selected', 'editing'];

        case  'fismo':
          if($scope.selectedFismo && $scope.selectedFismo == obj)
            if($scope.selectedQueryControl)
              return ['selected'];
            else
              return ['selected', 'editing'];

          return [];

        case  'query':
          if($scope.selectedQueryControl)
            return ['selected', 'editing'];
          else
            return [];
      }
    }




    function _getQueryIntervalDatetime(type) {
      var dateStr = ST_SafeGet($scope.selectedQueryControl, ['ns2_queryInterval', type, '$t'], null);
      if( dateStr === null )
        return null;
      else
        return new Date(dateStr);
    }
    function _setQueryIntervalDatetime(type, date) {
      var dateValue = (date == null) ? null : date.toISOString();
      if(dateValue)
        ST_SafeSet($scope.selectedQueryControl, ['ns2_queryInterval', type, '$t'], dateValue);
    }


    function _getDynamicQueryIntervalDatetime(type) {
      var dateStr = ST_SafeGet($scope.selectedQueryControl, ['ns2_dynamicAttrs', 'ns2_predefinedDynamicAttr', 'ns2_dynamicQueryInterval', type, '$t'], null);
      if( dateStr === null )
        return null;
      else
        return new Date(dateStr);
    }
    function _setDynamicQueryIntervalDatetime(type, date) {
      var dateValue = (date == null) ? null : date.toISOString();
      if(dateValue)
        ST_SafeSet($scope.selectedQueryControl, ['ns2_dynamicAttrs', 'ns2_predefinedDynamicAttr', 'ns2_dynamicQueryInterval', type, '$t'], dateValue);
    }


    function _stripCDATA(value) {
      var index = value.indexOf( '<![CDATA[');
      var result = value.substr(index + '<![CDATA['.length);

      index = result.lastIndexOf(']]>');
      result = result.substr(0, index);

      return result;
    }

    function _wrapCDATA(value) {
      return '<![CDATA[' + value + ']]>';
    }


    function _selectQueryControl() {
      if( ! $scope.formValidation() ) {
        return;
      }


      $scope.selectedQueryControl = $scope.selectedFismo['ns2_queryControl'];


      $scope.pickerQCFromDate = {
        date: _getQueryIntervalDatetime('ns2_fromDateTime'),
        timepickerOptions: {
          showMeridian: false
        },
        datepickerOptions: {
          maxDate: null
        },
        onSetTime: function () {
          _setQueryIntervalDatetime('ns2_fromDateTime', $scope.pickerQCFromDate.date);
        }
      };
      $scope.pickerQCToDate = {
        date: _getQueryIntervalDatetime('ns2_toDateTime'),
        timepickerOptions: {
          showMeridian: false
        },
        datepickerOptions: {
          minDate: null
        },
        onSetTime: function (newDate, oldDate) {
          _setQueryIntervalDatetime('ns2_toDateTime', $scope.pickerQCToDate.date);
        }
      };

      $scope.pickerDAFromDate = {
        date: _getDynamicQueryIntervalDatetime('ns2_fromDateTime'),
        timepickerOptions: {
          showMeridian: false
        },
        datepickerOptions: {
          maxDate: null
        },
        onSetTime: function () {
          _setDynamicQueryIntervalDatetime('ns2_fromDateTime', $scope.pickerDAFromDate.date);
        }
      };
      $scope.pickerDAToDate = {
        date: _getDynamicQueryIntervalDatetime('ns2_toDateTime'),
        timepickerOptions: {
          showMeridian: false
        },
        datepickerOptions: {
          minDate: null
        },
        onSetTime: function (newDate, oldDate) {
          _setDynamicQueryIntervalDatetime('ns2_toDateTime', $scope.pickerDAToDate.date);
        }
      };


    }

    function _deleteQueryControl() {
      $scope.selectedQueryControl = null;
      delete $scope.selectedFismo['ns2_queryControl'];
    }

    function _createQueryControl() {

      if( !$scope.selectedFismo ) {
        alertService.showErrorMessage( 'Select a Service first' );
        return;
      }

      $scope.selectedFismo.ns2_queryControl = {
        'ns3_query-request': {}
      };
    }

    function _buildQueryScript() {

      //  check properties
      try {
        if( !$scope.selectedQueryControl.ns2_quantityKind || !$scope.selectedQueryControl.ns2_quantityKind.$t ) {
          alertService.showErrorMessage( 'Select Quantity kind' );
          return;
        }

/*
        if( !$scope.selectedQueryControl.ns2_queryInterval.ns2_fromDateTime.$t ){
          alertService.showErrorMessage( 'Select Query interval - Frome Date' );
          return;
        }

        if( !$scope.selectedQueryControl.ns2_queryInterval.ns2_toDateTime.$t ) {
          alertService.showErrorMessage( 'Select Query interval - To Date' );
          return;
        }
*/
      }
      catch( ex ) {
        alertService.showErrorMessage( 'Select Quantity kind' );
        return;
      }


      if (confirm('Previous query will be overwriten.')) {

        _setQueryIntervalDatetime('ns2_fromDateTime', $scope.pickerQCFromDate.date);
        _setQueryIntervalDatetime('ns2_toDateTime', $scope.pickerQCToDate.date);

        var queryStr =
          'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n' +
          'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n' +
          'PREFIX ssn: <http://purl.oclc.org/NET/ssnx/ssn#>\n' +
          'PREFIX iot-lite: <http://purl.oclc.org/NET/UNIS/fiware/iot-lite#>\n' +
          'PREFIX dul: <http://www.loa.istc.cnr.it/ontologies/DUL.owl#>\n' +
          'PREFIX time: <http://www.w3.org/2006/time#>\n' +
          'PREFIX qu-quantity: <http://purl.oclc.org/NET/ssnx/qu/quantity#>\n' +
          'PREFIX qu-unit: <http://purl.oclc.org/NET/ssnx/qu/unit#>\n' +
          'PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#>\n' +
          'PREFIX m3-lite: <http://purl.org/iot/vocab/m3-lite#>\n' +
          'PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\n' +
          '\n' +
          '# url: https://platform-dev.fiesta-iot.eu/iot-registry/api/queries/execute/global\n' +
          'SELECT DISTINCT ?sensor  ?val ?timeStamp\n' +
          'WHERE {\n' +
          '  #remove the hash sign from the filters  to enable them\n' +
          '  FILTER (IRI(?qkType)=<' + $scope.selectedQueryControl.ns2_quantityKind.$t + '>) .\n';

        if($scope.selectedQueryControl.ns2_queryInterval != null
          && $scope.selectedQueryControl.ns2_queryInterval.ns2_fromDateTime != null
          && $scope.selectedQueryControl.ns2_queryInterval.ns2_fromDateTime.$t != null
          && $scope.selectedQueryControl.ns2_queryInterval.ns2_toDateTime != null
          && $scope.selectedQueryControl.ns2_queryInterval.ns2_toDateTime.$t != null ) {

          queryStr += '  FILTER ((?timeStamp > "' + $scope.selectedQueryControl.ns2_queryInterval.ns2_fromDateTime.$t + '"^^xsd:dateTime && ?timeStamp < "' + $scope.selectedQueryControl.ns2_queryInterval.ns2_toDateTime.$t + '"^^xsd:dateTime )  ) .\n';
        }

        queryStr += '  ?obsr a ssn:Observation .\n' +
          '  ?obsr ssn:observedBy ?sensor .\n' +
          '  #testbed 1\n' +
          '  {\n' +
          '    ?sensor ssn:hasDeployment ?testbed .\n' +
          '  }\n' +
          '  #Other testbeds\n' +
          '  UNION\n' +
          '  {\n' +
          '    ?dev ssn:hasSubSystem ?sensor .\n' +
          '    ?dev ssn:hasDeployment ?testbed .\n' +
          '  }\n' +
          '  ?obsr ssn:observationResult ?sensout .\n' +
          '  ?obsr ssn:observedProperty ?qk .\n' +
          '  ?qk a ?qkType .\n' +
          '  ?sensout ssn:hasValue ?obsrVal .\n' +
          '  ?obsrVal dul:hasDataValue ?val .\n' +
          '  ?obsr ssn:observationSamplingTime ?instant.\n' +
          '  ?instant time:inXSDDateTime ?timeStamp.\n' +
          '} order by DESC(?timeStamp)';


        ST_SafeSet($scope.selectedQueryControl, ['ns3_query-request', 'query', '$t'], queryStr);
      } else {
        // Do nothing!
      }

    }




    function _editTargetClass() {
      if( $scope.selectedQueryControl )
        return "femo-edit-querycontrol";
      else if( $scope.selectedFismo )
        return "femo-edit-fismoinfo";
      else
        return "femo-edit-femoinfo";
    }

    function _editFismoClass() {
      if( $scope.selectedFismo )
        return "edit-show";
      else
        return "edit-hide";
    }

    function _editQueryControlClass() {
      if( $scope.selectedFismo &&  $scope.selectedQueryControl )
        return "edit-show";
      else
        return "edit-hide";
    }


    function _cloneFismo(fismo) {
      var newFismo = {};
      angular.copy(fismo, newFismo);

      delete fismo.id;

      $scope.femo['ns2_FISMO'].push( newFismo );
    }

    function _loadDomainOfIntrests() {

      //  TODO: To be implemented

      return $scope.domainOfInterestList;
    }

    function _loadQuantityKinds() {

      return fiestaCloudService.getQuantityKinds();
    }

    function _loadExpOutputFileTypes() {
      return $scope.fileTypeList;
    }

    function _onDomainOfInterestsChanged(){
      var aryDomainOfInterestTags = [];
      $scope.domainOfInterestTags.map(function(tag){
        aryDomainOfInterestTags.push( tag.text );
      });

      ST_SafeSet($scope.femo, ['ns2_domainOfInterest', '$t'], aryDomainOfInterestTags.join(' '));
    }

    function _onExpOutputFileTypeChanged(){
      var aryExpOutputFileTypeTags = [];
      $scope.expOutputFileTypeTags.map(function(fileType){

        var fileTypeItem = {
          'ns2_type': {
            '$t': fileType.text
          }
        }

        aryExpOutputFileTypeTags.push( fileTypeItem );
      });

      ST_SafeSet($scope.selectedFismo, ['ns2_experimentOutput', 'ns2_file'], aryExpOutputFileTypeTags );
    }


    function _formValidation() {
      var scope = this;
      var currentForm = scope.femoEditForm;

      if( $scope.selectedFismo &&  $scope.selectedQueryControl )
        currentForm = scope.queryEditForm;
      else if( $scope.selectedFismo )
        currentForm = scope.fismoEditForm;

      var invalid = currentForm.$invalid;

      if( invalid ) {
        alertService.showErrorMessage( 'There are some invalid input fields' );
        return false;
      }
      else {
        return true;
      }
    }


    // watch min and max dates to calculate difference
    var unwatchMinMaxValues = $scope.$watch(function() {

      if( $scope.selectedQueryControl )
        return [$scope.pickerQCFromDate, $scope.pickerQCToDate, $scope.pickerDAFromDate, $scope.pickerDAToDate];
      else if( $scope.selectedFismo )
        return [$scope.pickerFemoStopTime, $scope.pickerFemoStopTime];
      else
        return [];
    }, function() {
      // min max dates
      if( $scope.selectedQueryControl ) {
        $scope.pickerQCFromDate.datepickerOptions.maxDate = $scope.pickerQCToDate.date;
        $scope.pickerQCToDate.datepickerOptions.minDate = $scope.pickerQCFromDate.date;
        $scope.pickerDAFromDate.datepickerOptions.maxDate = $scope.pickerDAToDate.date;
        $scope.pickerDAToDate.datepickerOptions.minDate = $scope.pickerDAFromDate.date;
      }
      else if( $scope.selectedFismo ) {
        $scope.pickerFemoStartTime.datepickerOptions.maxDate = $scope.pickerFemoStopTime.date;
        $scope.pickerFemoStopTime.datepickerOptions.minDate = $scope.pickerFemoStartTime.date;
      }


    }, true);


    // destroy watcher
    $scope.$on('$destroy', function() {
      unwatchMinMaxValues();
    });



  }


})();
