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
var DeathClaimRegistrationCtrl = ['$scope', '$compile','$q', '$state', '$filter', '$mdDialog', '$document', '$http', '$log', '$timeout', '$interval', 'ajax', 'urlService', 'uiRenderPrototypeService', 'commonService', '$translate', '$translatePartialLoader', 'multiUploadService','fileReader','$upload','commonUIService', 'factfindUIService', 'prospectPersonalUIService', 'printPdfService','deathClaimUIService','policyUIService','clientUIService',
	function($scope, $compile,$q, $state, $filter, $mdDialog, $document, $http, $log, $timeout, $interval, ajax, urlService, uiRenderPrototypeService, commonService, $translate, $translatePartialLoader, multiUploadService,fileReader,$upload,commonUIService, factfindUIService, prospectPersonalUIService, printPdfService,deathClaimUIService,policyUIService,clientUIService) {
	
	$scope.portletId = myArrayPortletId["my-new-workspace"];
	$scope.commonUIService = commonUIService;
	$scope.moduleService = deathClaimUIService;	
	$scope.name = 'DeathClaimRegistrationCtrl';	
	$scope.printPdfService = printPdfService;
	 $scope.initContextPath = contextPathRoot; 	    
	    $scope.commonService = commonService;
	    $scope.resourceURL = deathClaimUIService.initialPortletURL(myArrayPortletId["my-new-workspace"]);
	    $scope.fileReaderService=fileReader; //View file
	    $scope.fileReaderService.portletId =  $scope.portletId;
	    $scope.multiUploadService = multiUploadService;
	    $scope.agentPolicyList=[];
	    $scope.agentPolicyListTmp=[];
	    $scope.contextPathTheme = angular.contextPathTheme;
	    $scope.fileReaderService = fileReader;
	    $scope.deceasedName='';
	    
		  
	  $scope.setupStuffs = function setupStuffs () {
	       	this.generalConfigCtrl('DeathClaimRegistrationCtrl', deathClaimUIService).then(function finishedSetup () {       		
				//TODO: Can call an event fire-up that everything in ctrl has been setup
	       	});
	      //This is for get Lazy list before document update while waiting for Document update death claim registration
//			deathClaimUIService.product = deathClaimUIService.findElementInDetail_V3(['DocInfo']).Product;
//			if (!commonService.hasValueNotEmpty(deathClaimUIService.product)){
//				deathClaimUIService.product = commonService.CONSTANTS.PRODUCT_LOB.LIFE;
//			}
			
	       	$scope.getComputeLazy();
//			this.initializeObject();
	       	$scope.viewMode = undefined;
	    };
	  
	    $scope.getComputeLazy = function() {
	        var deferred = deathClaimUIService.$q.defer();
	        if(!commonService.hasValueNotEmpty(deathClaimUIService.lazyChoicelist)){
//	        	deathClaimUIService.getModuleLazyChoicelist_V3($scope.resourceURL,deathClaimUIService.product).then(function(data) {
	        	deathClaimUIService.getModuleLazyChoicelist_V3($scope.resourceURL).then(function(data) {
	        		deathClaimUIService.lazyChoiceList = deathClaimUIService.lazyChoicelist;
	                deferred.resolve(data);
	            });
	        } else deferred.resolve();
	        return deferred.promise;
	    };
	    
	  /*  $scope.getComputeLazy = function(){
	    	//var productName  = deathClaimUIService.findElementInDetail_V3(['Product']);
	    	  var deferred = deathClaimUIService.$q.defer();
			if(!commonService.hasValueNotEmpty(deathClaimUIService.lazyChoiceList)){
				deathClaimUIService.getDeathClaimRegistrationReviewLazyList($scope.resourceURL).then(function(data){
					deathClaimUIService.lazyChoiceList = data;
				});
			} 

		};*/
	    
	    $scope.setupStuffs();
	   // $scope.clientId=50001184;
	   
	    $scope.saveDeathClaim = function() {
			var dateOfLoss = new Date(deathClaimUIService.findElementInDetail_V3(['DeathDate']).$);
			dateOfLoss.setHours(0);
			var reportDate = new Date(deathClaimUIService.findElementInDetail_V3(['ReportedDate']).$);
			if(dateOfLoss > reportDate){
				commonUIService.showNotifyMessage("v3.myworkspace.message.DateOfDeathBiggerReportDate", 'failed');
			} else {
				var statusDeathClaim = deathClaimUIService.findElementInDetail_V3(['BusinessStatus']);
				if(commonService.CONSTANTS.STATUS.SUBMITTED != statusDeathClaim){
				//	deathClaimUIService.detail['IposDocument']['Header']['DocInfo']['Product'] = "";
					deathClaimUIService.saveDetail_V3($scope.resourceURL, true).then(function(data) {
						if(!deathClaimUIService.isSuccess(data)){
							deathClaimUIService.getErrorList(data);
							commonUIService.showNotifyMessage("v3.myworkspace.message.SaveDeathClaimRegistrationUnsuccessfully");
						}else {
							commonUIService.showNotifyMessage("v3.myworkspace.message.SaveDeathClaimRegistrationSuccessfully", 'success');
							$log.debug('save success');
							var docId = deathClaimUIService.findElementInDetail_V3(['DocId']);
							$log.debug('Doc Id :'+docId);
						}
					});
				}else{
					$scope.viewMode = true;
					commonUIService.showNotifyMessage("v3.myworkspace.message.SaveDeathClaimRegistrationSubmitted");
				}
		   }
			
		};	
	  
		
		$scope.getDeathClaimPolicyList = function() {    		
    		policyUIService.loadList($scope.resourceURL).then(function(data) {
    			
    			if (commonService.hasValueNotEmpty(policyUIService.findElementInElement_V3(data, ['MetadataDocument']))) {
    				$scope.agentPolicyListTmp = policyUIService.findElementInElement_V3(data, ['MetadataDocument']);
    				
    			} else {
    				$scope.isLoaded = true;
    				$scope.message = "new.v3.common.message.ThereIsNoData";
    				$scope.listLength = 0;
    				localStorage.removeItem("cacheAgentPolicyList");
                }
    		});
    	};
    	//get all policy
		//$scope.getDeathClaimPolicyList();
		//filer list policy by client ID
		$scope.searchFilter=function(){
			var k=0;
			for (var step = 0; step < $scope.agentPolicyListTmp.length; step++) {
				if(($scope.agentPolicyListTmp[step].Client_Number==$scope.moduleService.findElementInDetail_V3(['ClientNumber']).$)
						&&$scope.agentPolicyListTmp[step].Contract_Type=='guaranteed-cashback-saver'){
					
					$scope.agentPolicyList[k++]=$scope.agentPolicyListTmp[step];
				}
			}
			
			$scope.agentPolicyList = policyUIService.convertToArray($scope.agentPolicyList);    			
		}
		
		$scope.loadListPolicyByAgentAndClient=function(clientId){
			
			 var self = this;
		     var deferred = $q.defer();	
			
			policyUIService.loadListPolicyByAgentClient($scope.resourceURL,clientId).then(function(data) {				
    		/*	data={
    					  "MetadataDocuments": {
    						    "MetadataDocument": [
    						     
    						      {
    						        "Agent_ID": "60001050",
    						        "clientID": "50001188",
    						        "clientRole": "OW",
    						        "contractCurrency": "SGD",
    						        "inceptionDate": "20200101",
    						        "policyNumber": "00005059",
    						        "policyOwner": "00005059",
    						        "policyType": "FLX",
    						        "statusCode": "LA",
    						        "sumAssured": "1500000.00",
    						        "LGivName": "Roger",
    						        "LSurName": "Renan"
    						      },
    						      {
      						        "Agent_ID": "60001050",
      						        "clientID": "50001188",
      						        "clientRole": "OW",
      						        "contractCurrency": "SGD",
      						        "inceptionDate": "20200101",
      						        "policyNumber": "00005080",
      						        "policyOwner": "00005080",
      						        "policyType": "FLX",
      						        "statusCode": "LA",
      						        "sumAssured": "1500000.00",
      						        "LGivName": "Roger",
      						        "LSurName": "Renan"
      						      }
    						    ]
    						  }
    						};
				 */
				
    			if (commonService.hasValueNotEmpty(policyUIService.findElementInElement_V3(data, ['MetadataDocument']))) {
    				$scope.agentPolicyList = policyUIService.findElementInElement_V3(data, ['MetadataDocument']);
    				 deferred.resolve(data);
    			} else {
    				$scope.isLoaded = true;
    				$scope.message = "new.v3.common.message.ThereIsNoData";
    				$scope.listLength = 0;
    				localStorage.removeItem("cacheAgentPolicyList");
                }
    		});
			   return deferred.promise;
			
		};
		
		//$scope.loadListPolicyByAgentAndClient();
		
		
		//load  client detail to get deseased name
		$scope.getClientDetail=function(clientId){
			 var self = this;
		     var deferred = $q.defer();	
			clientUIService.loadClientDetail($scope.resourceURL,clientId).then(function(data){
				if (clientUIService.isSuccess(data)) {
				 $scope.deceasedName=clientUIService.findElementInElement_V3(data,["person:FullName"]).$;
				  deferred.resolve(data);
				}
			});
		    return deferred.promise;
		}
		
		/**
	     * search list policy by client number create list policy card  
	     */
		$scope.getPolicyList=function(){	
			var self = this;
		     var deferred = $q.defer();	
			$scope.loadListPolicyByAgentAndClient($scope.moduleService.findElementInDetail_V3(['ClientNumber']).$).then(function(data){
			$scope.getClientDetail($scope.moduleService.findElementInDetail_V3(['ClientNumber']).$);
			$scope.importDeathClaimPolicy();			
			$scope.agentPolicyList=[];
			  deferred.resolve(data);
			});
			
			return deferred.promise;
		
		};
		/**
	     * import new policy card from list policy 
	     */
		$scope.importDeathClaimPolicy = function() {
			var self = this;						
				self.card = $scope.getCardDataWithName('death-claim-registration:Registration');
				var len=$scope.agentPolicyList.length;
				for (var i = 0; i < len; i++) {					
					self.addCard(self.card, function addedChildEle (addedEle) {
						addedEle['@refUid']=$scope.agentPolicyList[i].clientID;						
						var policyNum=$scope.agentPolicyList[i].policyNumber;						
						var policyType=$scope.agentPolicyList[i].policyType;						
						var policyOwner=$scope.agentPolicyList[i].policyOwner;			
						var LIName=$scope.agentPolicyList[i].LGivName + '  '+ $scope.agentPolicyList[i].LSurName;			
						var SumInsured=$scope.agentPolicyList[i].sumAssured;			
					
						self.moduleService.findElementInElement_V3(addedEle, ['death-claim-registration:PolicyNo']).$ = policyNum;
						self.moduleService.findElementInElement_V3(addedEle, ['death-claim-registration:Product']).$ = policyType;
						self.moduleService.findElementInElement_V3(addedEle, ['death-claim-registration:POName']).$ = policyOwner;
						self.moduleService.findElementInElement_V3(addedEle, ['death-claim-registration:DeathClaimNo']).$ = undefined;
						self.moduleService.findElementInElement_V3(addedEle, ['death-claim-registration:LIName']).$=LIName;
						self.moduleService.findElementInElement_V3(addedEle, ['death-claim-registration:SumInsured']).$=SumInsured;
				
						
					});
				}
				$scope.agentPolicyList=[];
			
		};
		
		
		/**
	     * Save death claim registration
	     */
		$scope.saveDeathClaimRegistration = function() {
			var dateOfdeath = new Date(deathClaimUIService.findElementInDetail_V3(['DeathDate']).$);
			dateOfdeath.setHours(0);
			var reportDate = new Date(deathClaimUIService.findElementInDetail_V3(['ReportedDate']).$);
			
			if(dateOfdeath > reportDate){
				commonUIService.showNotifyMessage("v3.myworkspace.message.DateOfDeathBiggerReportDate", 'failed');
			} else {
				var statusdeathClaimRegistration = deathClaimUIService.findElementInDetail_V3(['BusinessStatus']);
				if(commonService.CONSTANTS.STATUS.SUBMITTED != statusdeathClaimRegistration){					
					deathClaimUIService.saveDetail_V3($scope.resourceURL, true).then(function(data) {
						if(!deathClaimUIService.isSuccess(data)){
							deathClaimUIService.getErrorList(data);
							commonUIService.showNotifyMessage("v3.myworkspace.message.SaveDeathClaimRegistrationUnsuccessfully");
						}else {
							commonUIService.showNotifyMessage("v3.myworkspace.message.SaveDeathClaimRegistrationSuccessfully", 'success');
							$log.debug('save success');
							var docId = deathClaimUIService.findElementInDetail_V3(['DocId']);
							$log.debug('Doc Id :'+docId);
						}
					});
				}else{
					$scope.viewMode = true;
					commonUIService.showNotifyMessage("v3.myworkspace.message.SaveDeathClaimRegistrationSubmitted");
				}
		   }
			
		};	
		  /**
	     * submit death claim registration
	     */
		$scope.submitDeathClaimRegistration = function(){
			$scope.viewMode = true;
			var statusDeathClaimRegistration = deathClaimUIService.findElementInDetail_V3(['BusinessStatus']);
			if(commonService.CONSTANTS.STATUS.SUBMITTED != statusDeathClaimRegistration){			
				deathClaimUIService.submitDeathClaimRegistration($scope.resourceURL, true).then(function(data) {
					if(data['ipos-response:response'] != undefined){
						$scope.viewMode = undefined;
						deathClaimUIService.getErrorList(data);
						commonUIService.showNotifyMessage("v3.myworkspace.message.SubmitDeathClaimRegistrationUnsuccessfully");
					}else {
						commonUIService.showNotifyMessage("v3.myworkspace.message.SubmitDeathClaimRegistrationSuccessfully", 'success');
						$log.debug('save success');
						var docId = deathClaimUIService.findElementInDetail_V3(['DocId']);
						$log.debug('Doc Id :'+docId);
					}
				});
			}else{
				$scope.viewMode = true;
				commonUIService.showNotifyMessage("v3.myworkspace.message.SubmitDeathClaimRegistrationSubmitted");
			}		
		};
		
		$scope.refreshDetail = function(){
			var deathClaimRegistrationID = deathClaimUIService.findElementInDetail_V3(['DocId']);
		
			deathClaimUIService.findDocumentToEdit_V3($scope.resourceURL, "", deathClaimRegistrationID).then(function(data){
				$scope.reSetupConcreteUiStructure(deathClaimUIService.detail); // refresh the values in multiple cards
			});
		};
		
		
		
		 //get policy detail
	    $scope.getPolicyDetail = function(card) {	        
	      //  self.card = card;
	        var self = this;
	        var deferred = $q.defer();	
	      
	        var policyNum=card.refDetail['death-claim-registration:PolicyNo'].$;
	        var policyType=card.refDetail['death-claim-registration:Product'].$;
	   
	        policyUIService.getDocumentDetailByPolicyNo_V3($scope.resourceURL, policyNum, policyType, "").then(function(data) {
	        	if (clientUIService.isSuccess(data)) {
	        	card.refDetail['death-claim-registration:LIName'].$=policyUIService.findElementInElement_V3(data,["person:FullName"]).$;
	        	card.refDetail['death-claim-registration:SumInsured'].$=policyUIService.findElementInElement_V3(data,["policy-gcs:SumAssured"]).$;
	      
	        	  deferred.resolve(data);
	        	}
	        	else{
	        		 return false;
	        	}
    			});
	        return deferred.promise;

	    };
		
		
		  /**
	     * print report for death claim registration
	     */

		$scope.printPdf = function(actionType) {
			 var docId = deathClaimUIService.findElementInDetail_V3(["DocId"]);
			 if(!docId){
				 return;
			 }
			 deathClaimUIService.findDocument_V3($scope.resourceURL, docId).then(function(data){				
				 deathClaimUIService.generateDocument_V3($scope.portletId).then(function(data) {
					 if (deathClaimUIService.isSuccess(data)) {															    	
//						 var templateName = "Death Claim Registration AS Abridged";										 
						 $scope.printPdfService.generatePdf($scope.portletId, deathClaimUIService, "", actionType);
					 } else {
						 commonUIService.showNotifyMessage("v3.myworkspace.message.GeneratePDFUnsuccessfully");
					 }
				 });
			});
		};
		

}];
