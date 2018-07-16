/**
 * Created by kimtaehyun on 2017. 8. 2..
 */
(function(){
  'use strict';


  angular
    .module('fiestaExpModeler')
    .controller('listFemoController', ListFemoController);

  ListFemoController.$inject = ['$scope', '$rootScope', '$state', 'fiestaCloudService', 'ModalService', 'FileUploader', 'alertService'];



  /**
   * [ListCompositedVoController description]
   * @param {[type]} $scope        [description]
   * @param {[type]} resmonService [description]
   *
   *
   * View 생성 및 UI control event 처리
   *   onem2m server와의 통신은 onem2mService에 deligate
   *   resource monitor server와의 통신은 resmonService에 deligate
   */
  function ListFemoController($scope, $rootScope, $state, fiestaCloudService, ModalService, FileUploader, alertService) {


    //  scope variables
    $scope.femos = [];


    //  scope functions
    $scope.init = _init;
    $scope.editFemo = _editFemo;
    $scope.deleteFemo = _deleteFemo;
    $scope.cloneFemo = _cloneFemo;
    $scope.downloadFemo = _downloadFemo;
    $scope.newFemo = _newFemo;

    $scope.getDOIList = _getDOIList;
    $scope.doiItemStyle = _doiItemStyle;


    $scope.femoSearchFilter = _femoSearchFilter;
    $scope.showUploadUi = _showUploadUi;

    //  implementation of scope function

    $scope.inputFemoSearchKeyword = '';


    function _showUploadUi() {

      $scope.uploader.clearQueue();
      $scope.uploadMode = true;

    }

    function _initFileUploader() {
      var uploader = $scope.uploader = new FileUploader({url: __env.apiUrl + '/erm/femo/fromxml'});

      // a sync filter
      uploader.filters.push({
        name: 'syncFilter',
        fn: function(item /*{File|FileLikeObject}*/, options) {
          var nameArray = item.name.split('.');
          if( nameArray[nameArray.length-1] != 'xml' ) {

            alertService.showErrorMessage('Only XML file are accepted' );
            return false;
          }

          while(this.queue.length >= 1) {
            this.queue[0].remove();
          }
          return true;
        }
      });

      // an async filter
      uploader.filters.push({
        name: 'asyncFilter',
        fn: function(item /*{File|FileLikeObject}*/, options, deferred) {
          setTimeout(deferred.resolve, 1e3);
        }
      });

      // CALLBACKS

      uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
        //console.info('onWhenAddingFileFailed', item, filter, options);
      };
      uploader.onAfterAddingFile = function(fileItem) {
        //console.info('onAfterAddingFile', fileItem);
      };
      uploader.onAfterAddingAll = function(addedFileItems) {
        //console.info('onAfterAddingAll', addedFileItems);
      };
      uploader.onBeforeUploadItem = function(item) {
        //console.info('onBeforeUploadItem', item);
      };
      uploader.onProgressItem = function(fileItem, progress) {
        //console.info('onProgressItem', fileItem, progress);
      };
      uploader.onProgressAll = function(progress) {
        //console.info('onProgressAll', progress);
      };
      uploader.onSuccessItem = function(fileItem, response, status, headers) {
        //console.info('onSuccessItem', fileItem, response, status, headers);
      };
      uploader.onErrorItem = function(fileItem, response, status, headers) {
        //console.info('onErrorItem', fileItem, response, status, headers);
      };
      uploader.onCancelItem = function(fileItem, response, status, headers) {
        //console.info('onCancelItem', fileItem, response, status, headers);
      };
      uploader.onCompleteItem = function(fileItem, response, status, headers) {
        if(status < 400) {
          console.info('onCompleteItem', fileItem, response, status, headers);

          //  $state.go( 'edit', {femoId: response} );
          _init(true);
        }
        else {
          alertService.showErrorMessage('Fail to import XML file with error code "' + status + '"');
        }

      };
      uploader.onCompleteAll = function() {
        //console.info('onCompleteAll');
      };
    }



    function _init(skipInitFileUpload) {
      if(skipInitFileUpload == undefined || skipInitFileUpload == false)
        _initFileUploader();

      window.showWaitforDialog();
      fiestaCloudService.listFemos()
        .then(function(femos){
          $scope.$apply(function () {

            window.hideWaitforDialog();

            $scope.femos = femos;
          });
        }, function(err){
          window.hideWaitforDialog();

          if(err.status == 401)
            fiestaCloudService.forwardToLoginPage();
        });
    } //  $scope.init


    function _editFemo(femo) {
      $state.go( 'edit', {femoId: femo.id} );
    }

    function _downloadFemo(femo) {

      fiestaCloudService.downloadFemo(femo.id)
        .then(function(result){
          var link = angular.element('<a/>');
          link.attr({
            href : result.objectUrl,
            download : result.fileName
          })[0].click();
        }, function(err){
          alertService.showErrorMessage(err);
        });
    }

    function _cloneFemo(femo) {
      window.showWaitforDialog();

      fiestaCloudService.cloneFemo(femo.id)
        .then(function(result){
          $scope.$apply(function () {
            $scope.femos.push(result);
            window.hideWaitforDialog();

          });
        }, function(err){
          alertService.showErrorMessage(err);
          window.hideWaitforDialog();

        });
    }


    function _newFemo() {
      window.showWaitforDialog();

      fiestaCloudService.createNewFemo()
        .then(function(result){

          $scope.$apply(function () {
//            window.hideWaitforDialog();
            $state.go( 'edit', {femoId: result} );
          });
        }, function(err){
          alertService.showErrorMessage(err);
          window.hideWaitforDialog();
        });
    }

    function _deleteFemo(femo) {
      window.showWaitforDialog();

      var femoId = femo.id;
      fiestaCloudService.deleteFemo(femo.id)
        .then(function(result){
          $scope.$apply(function () {
            // $scope.femos = femos;

            var deleteItemIndex = $scope.femos.findIndex(function(item){
              if(item.id == femoId)
                return true;
              else
                return false;
            });

            $scope.femos.splice(deleteItemIndex, 1);

            window.hideWaitforDialog();
          });
        }, function(err){
          window.hideWaitforDialog();
        });
    }


    const number_of_doi_display = 5;
    function _getDOIList(femo) {
      var doiList = ST_SafeGet(femo, ['domainOfInterest', '$t']);
      if( doiList ) {
        var aryDoi = doiList.split(' ');
        aryDoi.splice(number_of_doi_display, aryDoi.length - number_of_doi_display);
        aryDoi.map(function(el, idx, ary) {
          var indexOf = el.lastIndexOf('#');
          aryDoi[idx] = el.substr(indexOf+1);
        });

        return aryDoi.filter(function(item){
          if(item) return true;
          else return false;
        });
      }
      else {
        return [];
      }
    }


    const DOI_ITEM_COLOR_TABLE = [
      '#fb8eba',
      '#d35a5c',
      '#F6E034',
      '#F7941D',
      '#9FD55B',
      '#00C381',
      '#7B589A',
      '#A87C4F',
      '#51c4e2'
    ];

    function _doiItemStyle(doiName) {
      if( doiName ) {
        var charCode = doiName.toLowerCase().charCodeAt(0);
        var colorCode = Math.abs(charCode-97) % DOI_ITEM_COLOR_TABLE.length;

        return {'background-color': DOI_ITEM_COLOR_TABLE[colorCode], 'border': '1px solid ' + DOI_ITEM_COLOR_TABLE[colorCode]};
      }
    }


    function _femoSearchFilter(femo) {
      var searchKey = $scope.inputFemoSearchKeyword.toLowerCase();
      if( searchKey.trim() == "" )
        return true;

      var femoName = ST_SafeGet(femo, ['name']);
      var femoDescription = ST_SafeGet(femo, ['description', '$t']);
      var doiList = ST_SafeGet(femo, ['domainOfInterest', '$t']);

      var aryComp = [];
      if( femoName ) aryComp.push(femoName.toLowerCase());
      if( femoDescription ) aryComp.push(femoDescription.toLowerCase());
      if( doiList ) aryComp.push(doiList.toLowerCase());

      for(var i=0; i<aryComp.length; i++) {
        if( aryComp[i].indexOf( searchKey ) > -1 )
          return true;
      }

      return false;
    }

  }


})();
