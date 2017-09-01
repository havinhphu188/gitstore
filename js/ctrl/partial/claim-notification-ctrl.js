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

var ClaimNotificationCtrl = ['$q','$filter','$scope', '$http', '$compile', 'commonService', 'uiRenderPrototypeService', 'claimNotificationUIService',
                     		'ajax', '$document', 'urlService', '$log', '$state', '$rootScope', '$timeout', '$mdSidenav', '$upload', '$mdDialog', '$translate', '$translatePartialLoader', 'commonUIService','policyUIService', 
	function($q,$filter,$scope, $http, $compile, commonService, uiRenderPrototypeService, claimNotificationUIService,
		ajax, $document, urlService, $log, $state, $rootScope, $timeout, $mdSidenav, $upload, $mdDialog, $translate, $translatePartialLoader, commonUIService, policyUIService) {
	
	var portletId = myArrayPortletId["my-new-workspace"];
	$log.debug(portletId);
	$scope.initContextPath = contextPathRoot;
    $scope.moduleService = claimNotificationUIService;
    $scope.policyUIService = policyUIService;
    $scope.commonService = commonService;
    $scope.commonUIService = commonUIService;
   /* $translatePartialLoader.addPart('translation');
    $translate.refresh();
    $translate.use('en');*/
    $log.debug('Claim notification ctrl');
    $scope.uiRenderPrototypeService = uiRenderPrototypeService;
    
    $scope.init = function init () {
		var self = this;
        self.moduleIcon = 'fa fa-user';
        self.generalConfigCtrl('ClaimNotificationCtrl', claimNotificationUIService);
        
        // Set current page for navigation
        $("#navCurrentDocType").html($translate.instant('v3.navigation.label.docType.case-notification'));
    };
    
    $scope.initializeObject = function() {
    	var statusClaimNotification = claimNotificationUIService.findElementInDetail_V3(['BusinessStatus']);
		var policyParams = $scope.uiRenderPrototypeService.getUiService("claim-notification").policyParams;
		if(!commonService.hasValueNotEmpty(claimNotificationUIService.findElementInDetail_V3(['DocId']))){
			//Case create new Claim-notification
			claimNotificationUIService.findElementInDetail_V3(['Header'])['DocInfo']['DocName'] = claimNotificationUIService.genDefaultName();    		
			claimNotificationUIService.findJsonPathInItem(claimNotificationUIService.detail, '$..claim-notification:PolicyType').$ = policyParams.policyType;
			claimNotificationUIService.findJsonPathInItem(claimNotificationUIService.detail, '$..claim-notification:PolicyNumber').$ = policyParams.policyNum;
			claimNotificationUIService.findJsonPathInItem(claimNotificationUIService.detail, '$..claim-notification:PolicyOwner').$ = policyParams.policyOwner;
			
			//Set default value for claim-notifi
			claimNotificationUIService.findJsonPathInItem(claimNotificationUIService.detail, '$..claim-notification:ServiceBranch').$ = 10;
			claimNotificationUIService.findElementInElement_V3(claimNotificationUIService.detail, ['Attachments'])['@counter'] = 0;
			var resourceURL = claimNotificationUIService.initialMethodPortletURL(portletId,"getDocUserLoginNewMyWorkSpace");
			resourceURL = resourceURL.toString();
			$http.get(resourceURL).success(function(result){
				if(result!="null"){
					claimNotificationUIService.findJsonPathInItem(claimNotificationUIService.detail, '$..claim-notification:NotifiedBy').$ = result.responseFindDoc;
				}
				
			});	
			
			
			$scope.viewMode = undefined;
		}else{
			if(!$.isArray(claimNotificationUIService.findElementInElement_V3(claimNotificationUIService.detail, ['Attachment']))){
				claimNotificationUIService.convertJsonPathToArray(claimNotificationUIService.detail,'Attachments','Attachment');
			}
		}
		if(commonService.hasValueNotEmpty(statusClaimNotification)){
			if(commonService.CONSTANTS.STATUS.SUBMITTED != statusClaimNotification){
				$scope.viewMode = undefined;
			}else{
				$scope.viewMode = true;
			}
		}
		$scope.init();
    };
    
    $scope.initializeObject();
		
	$scope.saveClaimNotification = function() {
		var dateOfLoss = new Date(claimNotificationUIService.findElementInDetail_V3(['DateOfLoss']).$);
		dateOfLoss.setHours(0);
		var reportDate = new Date(claimNotificationUIService.findElementInDetail_V3(['ReportDate']).$);
		if(dateOfLoss > reportDate){
			commonUIService.showNotifyMessage("v3.myworkspace.message.DateOfLossBiggerReportDate", 'failed');
		} else {
			var statusClaimNotification = claimNotificationUIService.findElementInDetail_V3(['BusinessStatus']);
			if(commonService.CONSTANTS.STATUS.SUBMITTED != statusClaimNotification){
				claimNotificationUIService.findElementInDetail_V3(['Header'])['DocInfo']['Product'] = "";
				claimNotificationUIService.saveDetail_V3($scope.resourceURL, true).then(function(data) {
					if(!claimNotificationUIService.isSuccess(data)){
						claimNotificationUIService.getErrorList(data);
						commonUIService.showNotifyMessage("v3.myworkspace.message.SaveClaimNotificationUnsuccessfully");
					}else {
						commonUIService.showNotifyMessage("v3.myworkspace.message.SaveClaimNotificationSuccessfully", 'success');
						$log.debug('save success');
						var docId = claimNotificationUIService.findElementInDetail_V3(['DocId']);
						$log.debug('Doc Id :'+docId);
					}
				});
			}else{
				$scope.viewMode = true;
				commonUIService.showNotifyMessage("v3.myworkspace.message.SaveClaimNotificationSubmitted");
			}
	   }
		
	};
	
	$scope.submitClaimNotification = function(){
		$scope.viewMode = true;
		var statusClaimNotification = claimNotificationUIService.findElementInDetail_V3(['BusinessStatus']);
		if(commonService.CONSTANTS.STATUS.SUBMITTED != statusClaimNotification){
			claimNotificationUIService.findElementInDetail_V3(['Header'])['DocInfo']['Product'] = "";
			claimNotificationUIService.submitClaimNotification($scope.resourceURL, true).then(function(data) {
				if(data['ipos-response:response'] != undefined){
					$scope.viewMode = undefined;
					claimNotificationUIService.getErrorList(data);
					commonUIService.showNotifyMessage("v3.myworkspace.message.SubmitClaimNotificationUnsuccessfully");
				}else {
					commonUIService.showNotifyMessage("v3.myworkspace.message.SubmitClaimNotificationSuccessfully", 'success');
					$log.debug('save success');
					var docId = claimNotificationUIService.findElementInDetail_V3(['DocId']);
					$log.debug('Doc Id :'+docId);
				}
			});
		}else{
			$scope.viewMode = true;
			commonUIService.showNotifyMessage("v3.myworkspace.message.SubmitClaimNotificationSubmitted");
		}		
	};
	
	$scope.archiveClaimNotification = function() {
		var docId = claimNotificationUIService.findElementInDetail_V3(["DocId"]);
		claimNotificationUIService.archiveDocument_V3($scope.resourceURL, docId).then(function(data){
			if(data['ipos-container:map-list']){
				commonUIService.showNotifyMessage("new.v3.mynewworkspace.message.ArchiveSuccessfully","success");
				location.reload(true);
			}
			else{
				commonUIService.showNotifyMessage("new.v3.mynewworkspace.message.ArchiveUnsuccessfully");
			}
		});
	};
	
	$scope.toggleStarClaimNotification = function() {
		var docId = claimNotificationUIService.findElementInDetail_V3(["DocId"]);
		if (claimNotificationUIService.findElementInDetail_V3(['Star']) == '') {
			claimNotificationUIService.starDocument_V3($scope.resourceURL, docId).then(function(data){
				if(claimNotificationUIService.isSuccess(data)){
					commonUIService.showNotifyMessage("new.v3.mynewworkspace.message.StarSuccessfully", "success");
					claimNotificationUIService.findElementInDetail_V3(['Header'])['DocInfo']['Star'] = claimNotificationUIService.findElementInElement_V3(data, ['Star']);
				} else {
					commonUIService.showNotifyMessage("new.v3.mynewworkspace.message.StarUnsuccessfully");
				}
			});
		} else {
			claimNotificationUIService.unStarDocument_V3($scope.resourceURL, docId).then(function(data){
				if(claimNotificationUIService.isSuccess(data)){
					commonUIService.showNotifyMessage("new.v3.mynewworkspace.message.UnStarSuccessfully", "success");
					claimNotificationUIService.findElementInDetail_V3(['Header'])['DocInfo']['Star'] = claimNotificationUIService.findElementInElement_V3(data, ['Star']);
				} else {
					commonUIService.showNotifyMessage("new.v3.mynewworkspace.message.UnStarUnsuccessfully");
				}
			});
		}
	}
	
	$scope.refreshDetail = function(){
		var claimNotificationID = claimNotificationUIService.findElementInDetail_V3(['DocId']);
		var claimNotificationProduct = claimNotificationUIService.findElementInDetail_V3(["Product"]);
		claimNotificationUIService.findDocumentToEdit_V3($scope.resourceURL, "", claimNotificationID).then(function(data){
			$scope.reSetupConcreteUiStructure(claimNotificationUIService.detail); // refresh the values in multiple cards
		});
	};
}];