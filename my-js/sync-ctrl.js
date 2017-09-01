/*
 * //*******************************************************************************
 * // * Copyright (c) 2011-2014 CSC.
 * // * Copyright (C) 2010-2016 CSC - All rights reserved.
 * // *
 * // * The information contained in this document is the exclusive property of
 * // * CSC.  This work is protected under USA copyright law
 * // * and the copyright laws of given countries of origin and international
 * // * laws, treaties and/or conventions. No part of this document may be
 * // * reproduced or transmitted in any form or by any means, electronic or
 * // * mechanical including photocopying or by any informational storage or
 * // * retrieval system, unless as expressly permitted by CSC.
 * //
 * // * Design, Develop and Manage by Team Integral Point-of-Sales & Services
 * // ******************************************************************************
 */

'use strict';
var SyncCtrl = ['$scope', '$state', '$mdDialog', '$translate', '$controller', '$compile',
    'commonService', 'connectService', 'translateService', 'mobileAppCoreModule', '$q', 'commonUIService',

    function($scope, $state, $mdDialog, $translate, $controller, $compile,
        commonService, connectService, translateService, mobileAppCoreModule, $q, commonUIService) {

		$scope.isLoadList = true;
		$scope.datalistSync = [];
		$scope.datalistCaseFailSync = [];

        $scope.init = function initScope() {
            $scope.name = "SyncCtrl";
            $scope.mobileAppCoreModule = mobileAppCoreModule;
            $scope.syncResult = $scope.mobileAppCoreModule.syncResult;
            $scope.showSyncBar = true;
            $scope.syncBarProgress = "1%";
            $scope.lastSyncTime = undefined;
        }

        $scope.init();

        //Perform the login action
        $scope.getLastSyncTime = function() {
            $scope.mobileAppCoreModule.sync_mobileApp(true).then(function(){
                $scope.lastSyncTime = data.lastSyncTime;
            })
        };

        // Perform the login action
        $scope.syncDocument = function() {
            toggleSyncBar();
            $scope.mobileAppCoreModule.sync_mobileApp(true).then(function(data){
                toggleSyncBar();
                if(data.data){
                	$scope.lastSyncTime = data.lastSyncTime;
                	commonUIService.showNotifyMessage("v3.mobile.check.sync.success", "success");
                }else{
                	commonUIService.showNotifyMessage("v3.mobile.check.sync.fail", "fail");
                }
            })
        };

        function toggleSyncBar (){
            $scope.showSyncBar = !$scope.showSyncBar;
            $scope.syncBarProgress == "1%" ? $scope.syncBarProgress = "100%" : $scope.syncBarProgress = "1%";
        }

        // Perform the login action
        $scope.syncDocumentByCaseID = function() {
            if($scope.datalistSync.length == 0)
                return;
            toggleSyncBar();
        	var dataArray = [];
        	var metaArray = [];
        	var objTemp;
    		angular.forEach($scope.datalistSync, function(item){
    			dataArray.push(item.DocId);
    			//json2
    			objTemp = {};
    			objTemp.caseId = item.DocId;
    			objTemp.metaData = item;
    			metaArray.push(objTemp);
    		});
            $scope.mobileAppCoreModule.sync_doc_by_caseID(dataArray, metaArray).then(function(data){
                toggleSyncBar();
                if(data.code == "NO_CONNECTION"){
                    commonUIService.showNotifyMessage("v3.mobile.check.sync.NO_CONNECTION", "fail");
                }else if(data.code == "MANUAL_SYNC_ALL_CASE_SUCCESS"){
                	$scope.syncListCase().then(function(){
                        $scope.datalistSync = [];
                        commonUIService.showNotifyMessage("v3.mobile.check.sync.success", "success");
                	});
                }else if(data.code == "MANUAL_SYNC_FAIL"){
                    var promises = [];
                    promises.push($scope.syncListCase());
                    promises.push($scope.syncListCaseFail());
                    $q.all(promises).then(function(){
                        $scope.datalistSync = [];
                	    commonUIService.showNotifyMessage("v3.mobile.check.sync.success", "success");
                    });

                    //function to remove synced list (syncSuccessList) in un-sync list (targetList)
//                    function updateSyncList(syncSuccessList, targetList) {
//                        var newDataList = [];
//                        var countFound = 0;
//                        var found = false;
//                        var cancelSearch = false;
//                        for (var i = 0, len = targetList.length; i < len; i++) {
//                            found = false;
//                            for (var j = 0, len2 = syncSuccessList.length; j < len2 && !found && !cancelSearch; j++) {
//                                if (targetList[i].DocId == syncSuccessList[j]) {
//                                    found = true;
//                                    countFound++;
//                                }
//                            }
//                            if (found) {
//                                if(countFound == syncSuccessList.length)
//                                   cancelSearch = true;
//                            } else {
//                                newDataList.push(targetList[i]);
//                            }
//                        }
//                        targetList = newDataList;
//                    }
//
//                    var syncSuccessListIds = data.data;
//                    updateSyncList(syncSuccessListIds, $scope.syncDeviceCases);
//                    updateSyncList(syncSuccessListIds, $scope.syncServerCases);

                }else{
                	commonUIService.showNotifyMessage("v3.mobile.check.sync.fail", "fail");
                }
            });
        };

        $scope.syncListCase = function() {
            var deferred = $q.defer();
            $scope.syncDeviceCases = [];
            $scope.syncServerCases = [];
            $scope.datalistSync = [];
            $scope.mobileAppCoreModule.sync_list_metadata_case().then(function(data){
                if(data.errCode == 0){
//                	$scope.syncResultListCase = $scope.mobileAppCoreModule.findElementInElement_V3(data, ['MetadataDocument']);
                    $scope.syncDeviceCases = $scope.mobileAppCoreModule.findElementInElement_V3(data, ['MetadataDocumentDevice']);
                    $scope.syncServerCases = $scope.mobileAppCoreModule.findElementInElement_V3(data, ['MetadataDocumentServer']);
//                	commonUIService.showNotifyMessage("v3.mobile.check.sync.success", "success");
                }else{
//                	commonUIService.showNotifyMessage("v3.mobile.check.sync.fail", "fail");
                }
                deferred.resolve();
            });
            return deferred.promise;

        };
        $scope.syncListCase();


        // case fail : hle56
         $scope.syncDocumentFailByCaseID = function() {
                	var dataArray = [];
            		angular.forEach($scope.datalistCaseFailSync, function(item){
            			dataArray.push(item.DocId);
            		});
                    $scope.mobileAppCoreModule.sync_doc_fail_by_caseID(dataArray).then(function(data){
                        if(data.code == "NO_CONNECTION"){
                            commonUIService.showNotifyMessage("v3.mobile.check.sync.NO_CONNECTION", "fail");
                        }else if(data.code == "DONE" ){
                            $scope.datalistCaseFailSync = [];
                            var caseIDs = data.data;
                            var check = false;
                            var newDataList = [];
                            for(var i = 0, len = $scope.liseCaseFail.length; i< len; i++){
                                check = false;
                                for(var j = 0, len2 = caseIDs.length; j < len2; j++){
                                    if(caseIDs[j].caseId == $scope.liseCaseFail[i].DocId){
                                        if(caseIDs[j].state == "DONE"){//remove
                                            check = true;
                                        }else{
                                            $scope.liseCaseFail[i].state = caseIDs[j].state;
                                        }
                                        break;
                                    }
                                }
                                if(!check){
                                    newDataList.push($scope.liseCaseFail[i]);
                                }
                            }
                        	$scope.liseCaseFail = newDataList;
                        	commonUIService.showNotifyMessage("v3.mobile.check.sync.DONE", "success");
                        }else{
                        	commonUIService.showNotifyMessage("v3.mobile.check.sync.fail", "fail");
                        }
                    })
                };
        $scope.syncListCaseFail = function() {
            $scope.liseCaseFail = [];
            $scope.datalistCaseFailSync = [];

            var deferred = $q.defer();

            $scope.mobileAppCoreModule.sync_list_metadata_case_fail().then(function(data){
                if(data.errCode == 0){
                    $scope.liseCaseFail = $scope.mobileAppCoreModule.findElementInElement_V3(data, ['MetadataDocument']);
//                    commonUIService.showNotifyMessage("v3.mobile.check.sync.success", "success");
                }else{
//                    commonUIService.showNotifyMessage("v3.mobile.check.sync.fail", "fail");
                }
                    deferred.resolve();
            });
             return  deferred.promise;
        };
         $scope.syncListCaseFail();
    }
];
