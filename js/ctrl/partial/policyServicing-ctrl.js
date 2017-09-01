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
var PolicyServicingDetailCtrl = ['$filter', '$scope', '$log','policyUIService', 'commonService', 'printPdfService', 'salecaseUIService','commonUIService',
	function($filter, $scope, $log,policyUIService, commonService, printPdfService, salecaseUIService,commonUIService) {
	
	$scope.commonUIService = commonUIService;
	$scope.moduleService = salecaseUIService;
	$scope.policyModuleService = policyUIService;
	$scope.printPdfService = printPdfService;
	

	
	/**
	 * Will setup stuffs for this ctrl like set moduleUIservice, setup action bar, uiStructure
	 */
    $scope.setupStuffs = function setupStuffs () {
    	if (!commonService.hasValueNotEmpty($scope.moduleService.findElementInDetail_V3(['EReason']).Value)){
    		var policyServicingReason = localStorage.getItem("policyServicingReason");
    		//localStorage.removeItem("policyServicingReason");
    		if (policyServicingReason === commonService.CONSTANTS.POLICYSERVICING_REASON.CHANGE_PREMIUM_FREQUENCY){
    			$scope.moduleService.findElementInDetail_V3(['EReason']).Value = "CPF";
    		}
    		else $scope.moduleService.findElementInDetail_V3(['EReason']).Value = "AB";
    			
    	}
    		
    	$scope.moduleService.product = salecaseUIService.findElementInDetail_V3(['DocInfo'])['Product'];
		salecaseUIService.group = salecaseUIService.getProductGroup_V3(salecaseUIService.product);
       	this.generalConfigCtrl('PolicyServicingDetailCtrl', salecaseUIService).then(function finishedSetup () {       		
			//TODO: Can call an event fire-up that everything in ctrl has been setup
       	});


		this.initializeObject();
    };
    
	$scope.getComputeLazy = function() {
		var deferred = salecaseUIService.$q.defer();
		if(!commonService.hasValueNotEmpty(salecaseUIService.lazyChoicelist)){
			salecaseUIService.getModuleLazyChoicelist_V3($scope.resourceURL, $scope.moduleService.productName).then(function(data) {
				deferred.resolve(data);
			});
		} else deferred.resolve();
		return deferred.promise;
	}
	
	$scope.initializeObject = function() {
		var caseStatus = salecaseUIService.findElementInDetail_V3(['BusinessStatus']);
		$scope.moduleService.freeze = (caseStatus == commonService.CONSTANTS.STATUS.ACCEPTED ||  caseStatus == commonService.CONSTANTS.STATUS.SUBMITTED ||  caseStatus == commonService.CONSTANTS.STATUS.SUBMITTING) ? true : false;
		$scope.moduleService.getModuleLazyChoicelist_V3($scope.resourceURL, $scope.moduleService.product).then(function(){
			if ($scope.moduleService.findElementInDetail_V3(['EReason']).Value === "AB") {
				policyUIService.getModuleLazyChoicelist_V3($scope.resourceURL, $scope.moduleService.product).then(function(data){
					var policyDocID = salecaseUIService.findElementInDetail_V3(['PolicyId']).$;
					$scope.policyModuleService.getDocumentDetail_V3($scope.resourceURL, policyDocID).then(function(data){
						policyUIService.detail = angular.copy(data);
					});	
				});
			}
			else if ($scope.moduleService.findElementInDetail_V3(['EReason']).Value === "CPF") {
				//reTransform Current Frequency for ComputeTag
				var currentFrequency = $scope.moduleService.findElementInDetail_V3(['CurrentFrequency']).$
				if (currentFrequency === "Annual" ) $scope.moduleService.findElementInDetail_V3(['CurrentFrequency']).$ = "01"
				else if (currentFrequency === "Half-yearly" ) $scope.moduleService.findElementInDetail_V3(['CurrentFrequency']).$ = "02"
				else if (currentFrequency === "Quarterly" ) $scope.moduleService.findElementInDetail_V3(['CurrentFrequency']).$ = "04"
				else if (currentFrequency === "Monthly" ) $scope.moduleService.findElementInDetail_V3(['CurrentFrequency']).$ = "12";
				
				$scope.moduleService.computeElementAndUpdateLazyList($scope.resourceURL, [["EReason"],["InceptionDate"],["PaidToDate"],["BilledToDate"],["CurrentFrequency"],["NewFrequency"]]).then(function(data){
					$scope.reSetupConcreteUiStructure($scope.moduleService.detail,$scope.getAssociateUiStructureRoot().isDetailChanged); // refresh the values in multiple cards
				});
			}
		});
	}

	//Print add beneficiary request change form
	$scope.printPdf = function(actionType) {
		var self = this;
    	var saleCaseID = salecaseUIService.findElementInDetail_V3(['DocId']);
    	salecaseUIService.saveDetail_V3($scope.resourceURL, true).then(function(data){
    		if (salecaseUIService.isSuccess(data)) {
    			salecaseUIService.businessType = salecaseUIService.findElementInDetail_V3(['@case-name']);
	    		var actionType = "policy-servicing";
	    		$scope.printPdfService.generatePdf($scope.portletId, salecaseUIService, salecaseUIService.product, actionType);
    		}
    	});
	};
	
	//Print add beneficiary request change form
	$scope.saveDetail = function() {
		var self = this;
    	salecaseUIService.saveDetail_V3($scope.resourceURL, true).then(function(data){
    		if (salecaseUIService.isSuccess(data)) {
				$scope.reSetupConcreteUiStructure(salecaseUIService.detail);
				commonUIService.showNotifyMessage("v3.mynewworkspace.message.SaveCaseSuccessfully", "success");
			}
			else{
				commonUIService.showNotifyMessage("v3.mynewworkspace.message.SaveCaseUnsuccessfully");
			}
    	});
	};

	
    $scope.preSubmit = function(){
    	var self = this;
    	var saleCaseID = salecaseUIService.findElementInDetail_V3(['DocId']);
    	var policyServicingReason = localStorage.getItem("policyServicingReason");
    	salecaseUIService.saveDetail_V3($scope.resourceURL, true).then(function(data){
    		var message = salecaseUIService.findElementInElement_V3(data, ['ErrorMessage']);
			if((message==undefined || message.length==0 || message=='' || message==null) && salecaseUIService.isSuccess(data)){
    			salecaseUIService.preSubmitSaleCase($scope.resourceURL, 'policyServicing', saleCaseID, salecaseUIService.product,policyServicingReason).then(function(data) {
    				if (salecaseUIService.isSuccess(data)) {
    			
	    					commonUIService.showNotifyMessage("v3.myworkspace.message.PresubmitSaleCaseSuccessfully", 'success');
	    					$scope.reSetupConcreteUiStructure(salecaseUIService.detail); // refresh the values in multiple cards
	    					var caseStatus = salecaseUIService.findElementInElement_V3(data, ['BusinessStatus']);
	    					$scope.moduleService.freeze = (caseStatus == commonService.CONSTANTS.STATUS.ACCEPTED ||  caseStatus == commonService.CONSTANTS.STATUS.SUBMITTED ||  caseStatus == commonService.CONSTANTS.STATUS.SUBMITTING) ? true : false;
    				
    				} else {
    					commonUIService.showNotifyMessage("v3.myworkspace.message.PresubmitSaleCaseUnsuccessfully");
    					localStorage.removeItem("policyServicingReason");
    				}
        		});
			} else {
				$log.debug(message);
				commonUIService.showNotifyMessage("v3.myworkspace.message.PresubmitSaleCaseUnsuccessfully");
				localStorage.removeItem("policyServicingReason");
			}
    	});
    }
    
    $scope.submitCase = function(){
    	var self = this;
    	var saleCaseID = salecaseUIService.findElementInDetail_V3(['DocId']);
    	var policyServicingReason = localStorage.getItem("policyServicingReason");
    	var productName = salecaseUIService.findElementInDetail_V3(['Product']);
    	salecaseUIService.submissionPolicyServicing($scope.resourceURL, saleCaseID,productName, policyServicingReason).then(function(data){
    		if (salecaseUIService.isSuccess(data)) {
	    			$scope.reSetupConcreteUiStructure(salecaseUIService.detail);
	    			commonUIService.showNotifyMessage("v3.myworkspace.message.SubmitSaleCaseSuccessfully", 'success');
	    			localStorage.removeItem("policyServicingReason");
    		} else{
    			commonUIService.showNotifyMessage("v3.myworkspace.message.SubmitSaleCaseUnsuccessfully");
    			localStorage.removeItem("policyServicingReason");
    		}
    	});
    }
    /**
	  * @author lhoang4
	  * 2016.05.26
	  * Check if FrequencyRow in available Frequency List
	  */
    $scope.checkFrequency = function(frequencyRow){
    	var availableFrequency = $scope.moduleService.findElementInDetail_V3(['NewFrequency']).Options.Option
    	if (!angular.isArray(availableFrequency)) availableFrequency = [availableFrequency];
    	for (var i=0; i<availableFrequency.length;i++){
    		if (availableFrequency[i].value === $scope.moduleService.findElementInElement_V3(frequencyRow,["Frequency"]).$)
    			return true;
    	}
    	return false;
    }
    
    /**
	  * @author lhoang4
	  * 2016.05.26
	  * Select FrequencyRow to Selected Table
	  */
   $scope.selectFrequency = function(frequencyRow){
   		$scope.moduleService.findElementInDetail_V3(['NewFrequency']).Value = angular.copy($scope.moduleService.findElementInElement_V3(frequencyRow,["Frequency"]).$);
   }
	//always in the end of ctrl
    $scope.setupStuffs();
}];
