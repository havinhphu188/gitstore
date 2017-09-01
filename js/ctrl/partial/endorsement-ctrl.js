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
var EndorsementDetailCtrl = ['$filter', '$scope', '$log', 'commonService', 'endorsementUIService', 'salecaseUIService', 'policyUIService','commonUIService','clientUIService', 'paymentUIService', 'ecovernoteUIService', 'applicationUIService', 'printPdfService',
	function($filter, $scope, $log, commonService, endorsementUIService, salecaseUIService, policyUIService,commonUIService,clientUIService, paymentUIService, ecovernoteUIService, applicationUIService, printPdfService) {
	
	$scope.commonUIService=commonUIService;
	$scope.printPdfService = printPdfService;

/*    $scope.init = function init () {
        var self = this;
//        policyUIService.product = "term_life_protect";
        endorsementUIService.product = "motor_private_car_as";
//        $scope.test("motor_private_car_as");
        self.generalConfigCtrl('EndorsementDetailCtrl', endorsementUIService);
    };
    $scope.resourceURL = endorsementUIService.initialPortletURL(myArrayPortletId["my-new-workspace"]);

    $scope.init();

    uiStructure.isDetailChanged = true
    */
	$scope.resourceURL = policyUIService.initialPortletURL(myArrayPortletId["my-new-workspace"]);
	$scope.isCompute = {click:false};
	$scope.isEndorsementState = true;

	$scope.moduleService = salecaseUIService;
	$scope.modulePolicyService = policyUIService;
	$scope.modulePolicyService2 = angular.copy(policyUIService);
	$scope.modulePaymentService = paymentUIService;
	var productName = "motor-private-car-m-as";
	$scope.originOPCounter = 0;
	
	$scope.endorsementReason = localStorage.getItem("endorsementReason");
	localStorage.removeItem("endorsementReason");
	$scope.endorsementNote = localStorage.getItem("endorsementNote");
	localStorage.removeItem("endorsementNote");
	var policyNo = localStorage.getItem("policyNo");
	localStorage.removeItem("policyNo");

    //TODO: Delete later
    //$scope.endorsementReason = 'N';
    //policyNo = 'F0002625';
	
	$scope.initialize = function(){
    	var self = this;
    	if (salecaseUIService.findElementInDetail_V3(['DocName']) == "case-management-DefaultName"){
    		salecaseUIService.findElementInDetail_V3(['Header'])['DocInfo']['DocName'] = salecaseUIService.genDefaultName();
    	}
    	
    	salecaseUIService.saveDetail_V3($scope.resourceURL,false).then(function(data){
    		self.generalConfigCtrl('EndorsementDetailCtrl', salecaseUIService, 'endorsement').then(function finishedSetup(){
    			$scope.effectiveMaxDate = policyUIService.findElementInDetail_V3(['ExpiryDate']).$;
				$scope.effectiveMinDate = policyUIService.findElementInDetail_V3(['InceptionDate']).$;
    			self.uiStructureRoot.isDetailChanged = true;
    			/*var underwriting = salecaseUIService.findElementInDetail_V3(['Underwriting'])['@refUid'];
             	if(!commonService.hasValueNotEmpty(underwriting)) {
             		self.setVisibleCard("endorsement-motor:Step4", false);
             	};
             	if (commonService.hasValueNotEmpty(salecaseUIService.findElementInDetail_V3(['eCoverNote']))
             		 &&	salecaseUIService.findElementInDetail_V3(['eCoverNote'])[0]){
             		var eCoverNoteDocId = salecaseUIService.findElementInDetail_V3(['eCoverNote'])[0]['@refUid'];
        			if(!commonService.hasValueNotEmpty(eCoverNoteDocId)){
        				self.setVisibleCard("endorsement-motor:Step5", false); 
        			};
             	}
             	
    			var paymentDocId = salecaseUIService.findElementInDetail_V3(['ClientPayment'])['@refUid'];
    			if (!commonService.hasValueNotEmpty(paymentDocId)){
    				self.setVisibleCard("endorsement-motor:Payment", false);
    			};*/
    		});
    		
    		$scope.isSaveFinished = false;
    	})
    	
	};
	
	
	var prepareData = function(prepareOnly){
		var productName = salecaseUIService.findElementInDetail_V3(['Product']);
		
		//only for motor product
		if(productName != "motor-private-car-m-as"){
			return;
		}
		$scope.originOPCounter = parseInt(policyUIService.findElementInElement_V3(policyUIService.originDetail,['OptionalCoverages'])["@counter"]);
    	policyUIService.convertObjectToArray(policyUIService.detail,["OptionalCoverages","OptionalCoverage"]);
    	if (prepareOnly != true){
    		if ("AI" == $scope.endorsementReason){
        		policyUIService.addElementInElement_V3(policyUIService.detail,['OptionalCoverages'],['OptionalCoverage']);
        		$scope.newOptionalCoverageCounter = policyUIService.findElementInDetail_V3(['OptionalCoverages'])["@counter"];
            	$scope.newOptionalCoverage = policyUIService.findElementInDetail_V3(['OptionalCoverage'])[$scope.newOptionalCoverageCounter-1];
            	policyUIService.findElementInElement_V3($scope.newOptionalCoverage,['AdditionalBenefitPremium']).$ = undefined;
        	}
        	else if ("CV" == $scope.endorsementReason) 
        		policyUIService.findElementInDetail_V3(["EngineMotorNo"]).$ = "";
    	};
    };
    
    var prepareMissingfield = function(){
    	updateEReasonNote();
    	if (policyUIService.product.indexOf("motor") !== -1){
    		if (!commonService.hasValue(policyUIService.findElementInDetail_V3(["EffectiveDate"]).$)){
        		var date = new Date;
        		policyUIService.findElementInDetail_V3(["EffectiveDate"]).$ = $filter('date')(date,'yyyy-MM-dd');
        	}
    	if (commonService.hasValueNotEmpty(policyUIService.findElementInDetail_V3(["AdditionalBenefitCode"])) && !commonService.hasValueNotEmpty(policyUIService.findElementInDetail_V3(["AdditionalBenefitCode","Options"]).Option)){
        		policyUIService.findElementInDetail_V3(["AdditionalBenefitCode","Options"]).Option = policyUIService.findElementInDetail_V3(["AdditionalBenefitCode"]).Value;
        	}
        	if (!commonService.hasValueNotEmpty(policyUIService.findElementInDetail_V3(["AdditionalPremiumClass"]).Value)){
        		policyUIService.findElementInDetail_V3(["AdditionalPremiumClass"]).Value = "VMA";
        		policyUIService.findElementInDetail_V3(["AdditionalPremiumClass","Options"]).Option= "VMA";
        	}
    	}
    };
    
    /*Get lazy list for payment before loading detail*/
	$scope.getPaymentLazyList = function(){
		var deferred = paymentUIService.$q.defer();
		if(!commonService.hasValueNotEmpty(paymentUIService.lazyChoiceList)){
			paymentUIService.getModuleLazyChoicelist_V3($scope.resourceURL).then(function(data) {
				deferred.resolve(data);
				paymentUIService.lazyChoiceList = data;
			});
		} 
		else deferred.resolve();
		return deferred.promise;
	};

	$scope.checkPaymentAmount = function(){
		if (policyUIService.findElementInDetail_V3(['TotalPayablePremium']).$ == "0.00") {
			return false;
		} else {
			$scope.getPaymentLazyList();
		}
	};
		
    function updateEReasonNote(){
    	salecaseUIService.findElementInDetail_V3(['EReasonNote']).$ = policyUIService.findElementInDetail_V3(['EndorsementReasonNote']).$;
    };
    
    function initCase(businessType){
        if (commonService.hasValueNotEmpty($scope.endorsementReason)) {
        	salecaseUIService.findElementInDetail_V3(['EReason']).Value = $scope.endorsementReason;
        	if(commonService.hasValueNotEmpty($scope.endorsementReason)){
        		$scope.endorsementAction = $scope.endorsementReason.toLowerCase(); 
        	}
        	       	
        }
    	
    	var productName = salecaseUIService.findElementInDetail_V3(['Product']);
			policyUIService.getModuleLazyChoicelist_V3($scope.resourceURL, productName).then(function(data){

				$log.debug("Loaded Case for Endorsement");
				salecaseUIService.product = salecaseUIService.findElementInDetail_V3(["Product"]);
				var policyDocID = salecaseUIService.findElementInDetail_V3(['PolicyId']).$;
				endorsementUIService.getDocumentDetail_V3($scope.resourceURL, policyDocID).then(function(data){
					// set number of optional coverage to 1 as the case is initialized
					if ("AI" == $scope.endorsementReason){
						if(parseInt(policyUIService.findElementInElement_V3(data, ['OptionalCoverages'])["@counter"]) <= 0){
							policyUIService.findElementInElement_V3(data, ['OptionalCoverages'])["@counter"] = 1;
						} 
						else{
							policyUIService.addElementInElement_V3(data,['OptionalCoverages'],['OptionalCoverage']);
						}
					}
					$scope.reSetupConcreteUiStructure(data);
					policyUIService.detail = angular.copy(data);

					//These code below is Cheating for save Original Policy to Case Management
					
				/*		if (!salecaseUIService.findElementInDetail_V3(['OriginalPolicy','EOriginalPolicyId']).$){
							policyUIService.originDetail = angular.copy(policyUIService.detail);
							policyUIService.findElementInElement_V3(policyUIService.originDetail,['DocInfo']).DefUid = "fc556a7d-ee21-43ac-bcba-8a039f780b71";
							policyUIService.findElementInElement_V3(policyUIService.originDetail,['DocInfo']).DocId = "";
							endorsementUIService.detail = policyUIService.originDetail;
							endorsementUIService.saveDetail_V3($scope.resourceURL,false).then(function(data){
								salecaseUIService.findElementInDetail_V3(['OriginalPolicy','EOriginalPolicyId']).$ = salecaseUIService.findElementInElement_V3(data,['DocInfo']).DocId;
								salecaseUIService.findElementInDetail_V3(['OriginalPolicy','EOriginalPolicyNumber']).$ = salecaseUIService.findElementInDetail_V3(['PolicyNumber']).$;
							});
						}
						
				*/
					
					
					//End of cheating code
					
						if(!$scope.endorsementReason){
							$scope.endorsementReason = salecaseUIService.findElementInDetail_V3(['EReason']).Value;
						}
						
						var policyId = salecaseUIService.findElementInDetail_V3(['PolicyNumber']).$;
						if (salecaseUIService.findElementInDetail_V3(['Product']) == "motor-private-car-m-as") 
							var policyType = "VPM";
						
//						var effectiveDate = "";
//						var policyListFromCache = angular.fromJson(window.localStorage.cacheAgentPolicyList);
//						angular.forEach(policyListFromCache, function(item){
//							if(item.Contract_Number == policyId){
//								effectiveDate = item.Effective_Date;
//							}								
//						});
						
						policyUIService.findElementInDetail_V3(['EndorsementReason']).$ = $scope.endorsementReason
						policyUIService.findElementInDetail_V3(['EndorsementReasonNote']).$ = salecaseUIService.findElementInDetail_V3(['EReasonNote']).$;
						var originPolicyDocId = salecaseUIService.findElementInDetail_V3(['EOriginalPolicyId']).$;
						endorsementUIService.getDocumentDetail_V3($scope.resourceURL, originPolicyDocId).then(function(data){
							policyUIService.originDetail = angular.copy(data);
							policyUIService.findElementInDetail_V3(['EndorsementReason']).$=$scope.endorsementReason; //Delete later
							policyUIService.refresh_V3($scope.resourceURL,productName).then(function(data){
								policyUIService.product = policyUIService.findElementInDetail_V3(['Product']);
								
							/*	var productName = policyUIService.findElementInDetail_V3(['Product']);
								
								//for porduct FIR
								if(productName == "FIR"){
									policyUIService.findElementInDetail_V3(["EffectiveDate"]).$ = policyUIService.effectiveDate;
									
									if(!$scope.interestedParty){
										$scope.interestedParty = policyUIService.convertToArray(policyUIService.findElementInDetail_V3(['InterestedParty']));
									}
									if(!$scope.perils){
										$scope.perils = policyUIService.convertToArray(policyUIService.findElementInDetail_V3(['PerilFEAOther']));
									}
									if(!$scope.insuredInterest){
										$scope.insuredInterest = policyUIService.convertToArray(policyUIService.findElementInDetail_V3(['InsuredInterest']));
									}
								}*/
							
								
								
								
								$log.debug("refresh policy completed");
//								policyUIService.originDetail = angular.copy($scope.modulePolicyService2.detail);
								prepareData(true);
								$scope.initialize ();
							});
						});
					
					
				})
				
			});
    };
    
    function validateEffectiveDate (){
		var incepDate = Date.parse(policyUIService.findElementInDetail_V3(['InceptionDate']).$);
		var expiryDate = Date.parse(policyUIService.findElementInDetail_V3(['ExpiryDate']).$);
		var effectDate = Date.parse(policyUIService.findElementInDetail_V3(['EffectiveDate']).$);
		if (incepDate <= effectDate && effectDate <= expiryDate) {
			policyUIService.findElementInDetail_V3(['EffectiveDate']).errorMessage = "";
			return true;
		}
		commonUIService.showNotifyMessage("v3.myworkspace.message.SaveIllustrationUnsuccessfully");
		policyUIService.findElementInDetail_V3(['EffectiveDate']).errorMessage = "MSG-effectiveDate";
		return false;
	};
	
	function validateEngineNumber (){
		if (policyUIService.findElementInDetail_V3(['EngineMotorNo']).$ ==  policyUIService.findElementInElement_V3(policyUIService.originDetail,['EngineMotorNo']).$) 
			{
			commonUIService.showNotifyMessage("v3.mynewworkspace.message.SameEngineNumber");
			return false;
			}
		return true;
	};
	
	function validateAdditionalCoverage (){
		
	};
	
	function validationEndorsementPolicy (){
		if(salecaseUIService.product === 'motor-private-car-m-as'){
            if ($scope.endorsementReason == "CV" && !validateEngineNumber())
                return false;
        }
        
		return true;
	};
    
    $scope.computePolicy = function(){
    	prepareMissingfield();
    	if (validationEndorsementPolicy()){
    		policyUIService.computeModule($scope.resourceURL).then(function(data){
        		if (policyUIService.isSuccess(data)){
        			$scope.isCompute.click = true;
        			policyUIService.detail = data;
        			prepareData(true);
        			commonUIService.showNotifyMessage("v3.mynewworkspace.message.ComputeEndorsementSuccessfully", "success");
        		}
        		else  {
        			var errorMessage = salecaseUIService.findElementInElement_V3(data,['message']);
//        			var dataMessage = salecaseUIService.findElementInElement_V3(data,['message'])
//        			if (commonUIService.hasValue(dataMessage)) errorMessage = errorMessage+" "+dataMessage;
//        			commonUIService.showNotifyMessage(errorMessage);
        			if(!errorMessage){
        				errorMessage = "";
        			}
        			commonUIService.showNotifyMessage("v3.mynewworkspace.message.computeEndorsementUnsuccessfully");
        		}
        		
        	});
    	}
    	
    };
    
    $scope.saveDetail = function(){
    	prepareMissingfield();
    	if (validationEndorsementPolicy()){
    		policyUIService.saveDetail_V3($scope.resourceURL,false).then(function(data){
        		if (policyUIService.isSuccess(data)){
        			salecaseUIService.saveDetail_V3($scope.resourceURL,false).then(function(data){
        				if (salecaseUIService.isSuccess(data))
        					commonUIService.showNotifyMessage("v3.mynewworkspace.message.SaveEndorsementSuccessfully", "success");
        				else commonUIService.showNotifyMessage("v3.mynewworkspace.message.SaveEndorsementUnsuccessfully");
        			});
        		}
        		else commonUIService.showNotifyMessage("v3.mynewworkspace.message.SaveEndorsementUnsuccessfully");
        	});
    	};
    	
    }
    
    $scope.preSubmit = function(){
    	// compute again before presubmit. 24-Dec-2015 hnguyen257 fix for ticket IVPORTAL-4498
    	var self = this;
    	
		prepareData(true);
    	if (validationEndorsementPolicy()){
    		policyUIService.saveDetail_V3($scope.resourceURL,true).then(function(data){
        		if (policyUIService.isSuccess(data)){
        			salecaseUIService.saveDetail_V3($scope.resourceURL,true).then(function(data){
        				if (salecaseUIService.isSuccess(data)){
        					var salecaseDocID = salecaseUIService.findElementInDetail_V3(['DocInfo']).DocId;
                        	salecaseUIService.preSubmissionForEndorsement($scope.resourceURL,salecaseDocID).then(function(data){
                        		if (salecaseUIService.isSuccess(data)){
                        			var caseID = salecaseUIService.findElementInElement_V3(data, ['DocInfo']).DocId;
                        			salecaseUIService.getDocumentDetail_V3($scope.resourceURL,caseID).then(function(data){
                        				var policyDocID = salecaseUIService.findElementInDetail_V3(['PolicyId']).$;
                        				var productName = policyUIService.findElementInDetail_V3(["DocInfo"]).Product;
                        				
                        				endorsementUIService.getDocumentDetail_V3($scope.resourceURL, policyDocID).then(function(data){
                        					policyUIService.refresh_V3($scope.resourceURL,productName).then(function(data){
                        						prepareData(true);
                        						$log.debug("reload policy from Case after submission to get Payment Detail");
                        						
                        						/*var underwritingDocID = salecaseUIService.findElementInDetail_V3(['Underwriting'])['@refUid'];
                                    			if(underwritingDocID != ''){
                                    				self.setVisibleCard("endorsement-motor:Step4", true);
                                    				underwritingUIService.findDocumentToEdit_V3($scope.resourceURL, salecaseUIService.product, underwritingDocID).then(function(data){
                                    					underwritingUIService.findElementInDetail_V3(['DocInfo'])['DocName'] = underwritingUIService.genDefaultName();
                                    					underwritingUIService.saveDetail_V3($scope.resourceURL, false).then(function(data){
                                    					});
                                    				});
                                    			}
                                    			
//                                    			salecaseUIService.findElementInDetail_V3(['eCoverNote'])['@refUid'] = "f41c245d-7d32-4978-bff9-718143e527c3";
                                    			var eCoverNoteDocId = salecaseUIService.findElementInDetail_V3(['eCoverNote'])['@refUid'];
                                    			if(eCoverNoteDocId != ''){
                                    				self.setVisibleCard("endorsement-motor:Step5", true);
                                    				self.setVisibleCard("endorsement-motor:Payment", true); 
                                    				ecovernoteUIService.findDocumentToEdit_V3($scope.resourceURL, salecaseUIService.product, eCoverNoteDocId).then(function(data){
                                						ecovernoteUIService.findElementInDetail_V3(['DocInfo'])['DocName'] = applicationUIService.genDefaultName();
                                						ecovernoteUIService.saveDetail_V3($scope.resourceURL, false).then(function(data){
                                						});
                                					});
                                    			}*/
                        					});
                        				});
                        				
                        				commonUIService.showNotifyMessage("v3.mynewworkspace.message.SubmitEndorsementSuccessfully", "success");
                        				$scope.reSetupConcreteUiStructure(salecaseUIService.detail); // refresh the values in multiple cards
                        			});
                        			
                        		}
                        		else {
                        			var errorMsg = salecaseUIService.findElementInElement_V3(data,['integration','message']);
                        			
//                        			commonUIService.showNotifyMessage("Submit unsuccessfully."+"\n"+errorMsg);
                        			commonUIService.showNotifyMessage("v3.mynewworkspace.message.SubmitEndorsementUnsuccessfully");
                        		}
                        	});
        				}
        				else {
//        					var errorMsg = salecaseUIService.findElementInElement_V3(data,['integration','message']);
        					commonUIService.showNotifyMessage("v3.mynewworkspace.message.SubmitEndorsementUnsuccessfully");
        				}
        			});
        		}
        		else
        			commonUIService.showNotifyMessage("v3.mynewworkspace.message.SubmitEndorsementUnsuccessfully");
        	});
    	};
	
	
    };
    
    $scope.getDocumentCenterList = function getDocumentCenterList(){
    	if($scope.moduleService.findElementInDetail_V3(['DocId']) != "" && $scope.moduleService.findElementInDetail_V3(['DocId']) != undefined){
			salecaseUIService.getReourceFileByCaseId($scope.resourceURL,$scope.moduleService.findElementInDetail_V3(['DocId'])).then(function(data){
				if(data != ""){
					$scope.moduleService.DocumentCenterList = data.MetadataDocuments.MetadataDocument;
					if(!$.isArray($scope.moduleService.DocumentCenterList)){
						if ($scope.moduleService.DocumentCenterList!=undefined) {
							var temp = $scope.moduleService.DocumentCenterList;
							$scope.moduleService.DocumentCenterList = [];
							$scope.moduleService.DocumentCenterList.push(temp);
						}
						else{
							$scope.moduleService.DocumentCenterList = [];
						}
					}
				}			
			});
    	}
	};
	//$scope.getDocumentCenterList();
	
	/*Get lazy list for ecover before loading detail*/
	$scope.getECoverLazyList = function(){
		var deferred = ecovernoteUIService.$q.defer();
		if(!commonService.hasValueNotEmpty(ecovernoteUIService.lazyChoiceList)){
			ecovernoteUIService.getModuleLazyChoicelist_V3($scope.resourceURL, salecaseUIService.product).then(function(data){
				ecovernoteUIService.lazyChoiceList = data
				deferred.resolve(data);
			});
		} else deferred.resolve();
		return deferred.promise;
	};
	
//    $scope.getDocumentCenterList = function(){
//		salecaseUIService.getReourceFileByCaseId($scope.resourceURL,$scope.moduleService.detail.IposDocument.Header.DocInfo.DocId).then(function(data){			
//			$scope.moduleService.DocumentCenterList = data.MetadataDocuments.MetadataDocument;
//			if(!$.isArray($scope.moduleService.DocumentCenterList)){
//				if ($scope.moduleService.DocumentCenterList!=undefined) {
//					var temp = $scope.moduleService.DocumentCenterList;
//					$scope.moduleService.DocumentCenterList = [];
//					$scope.moduleService.DocumentCenterList.push(temp);
//				}
//				else{
//					$scope.moduleService.DocumentCenterList = [];
//				}
//			}
//		});
//	};
	initCase();
    $scope.cancelEndorsement = function(){
		var self = this;
		var policyNo = policyUIService.findElementInDetail_V3(['PolicyNo']).$;
		var productName = policyUIService.findElementInDetail_V3(['Product']);
		
		//return to my content (policy list) 
		if(productName == "FIR"){
			 // Appending dialog to document.body to cover sidenav in docs app
		    var confirm = $mdDialog.confirm()
	    		.title($filter('translate')("v3.mynewworkspace.message.MSG-733"))
		        .ok($filter('translate')("v3.yesno.enum.Y"))
		        .cancel($filter('translate')("v3.yesno.enum.N"));
		    $mdDialog.show(confirm).then(function(decision) {
		    	if(decision == "Yes"){
		    		commonUIService.goToPortlet("MY_CONTENT");
		    	}
		    	else{
		    		$mdDialog.cancel();
		    	}
		    	
		    }, function() {
		        var a = 'No';
		    });
			
		}else{
			self.goToState('root.list.detail', {docType: "policy", docId: policyNo, "productName": productName, "businessType" : "", "ctrlName": undefined});
		}
		 
	}
	
	$scope.checkAddendumAdding = function(card){
		if(card!=undefined){
			this.addCard(card, function addedChildEle (addedEle) {
			});
		}
		var eCoverNoteInCase = salecaseUIService.findElementInDetail_V3(['eCoverNote']);
		if(eCoverNoteInCase.length==undefined && !commonService.hasValueNotEmpty(eCoverNoteInCase["@refUid"])){
			commonUIService.showNotifyMessage("v3.mynewworkspace.message.ECoverNoteIsNotReady");
			return false;
		}
		else if (commonService.hasValueNotEmpty(eCoverNoteInCase["@refUid"])) eCoverNoteInCase = [eCoverNoteInCase];
		var latestECoverNoteDocId = eCoverNoteInCase[eCoverNoteInCase.length-1]['@refUid'];
		// if has Draft Addendum
//		var underwritingDocID = salecaseUIService.findElementInDetail_V3(['Underwriting'])['@refUid'];
		$scope.uWCard = undefined;
		$scope.uWCard = 'endorsement-motor:Step5';
//		if(underwritingDocID !=''){
//			$scope.uWCard = 'case-management-motor:Step7_MaintainEcover';
//		}else{
//			$scope.uWCard = 'case-management-motor:Step6_MaintainEcover';
//		}
		if(latestECoverNoteDocId==''){
			$scope.setVisibleActionCards($scope.uWCard, false);
			commonUIService.showNotifyMessage("v3.mynewworkspace.message.AnAddendumIsAlreadyAddedIntoCaseButNotSaved", "success");
		}
		else{
			var product = salecaseUIService.findElementInDetail_V3(["Product"]);
			ecovernoteUIService.getDTODocument_V3($scope.resourceURL, product, latestECoverNoteDocId).then(function(data){
				if(ecovernoteUIService.findElementInElement_V3(data, ['BusinessStatus'])=='REJECTED WITH CHANGES'){
					$scope.setVisibleActionCards($scope.uWCard, true);
					commonUIService.showNotifyMessage("v3.mynewworkspace.message.YouCouldCreateAnAddendum", "success");
				} else{
					commonUIService.showNotifyMessage('v3.mynewworkspace.message.lastestEcoverNoteAddendumIn'+ ecovernoteUIService.findElementInElement_V3(data, ['BusinessStatus']), "success");
					$scope.setVisibleActionCards($scope.uWCard, false);
//					if (ecovernoteUIService.findElementInElement_V3(data, ['BusinessStatus'])!= "DRAFT") $scope.setVisibleActionCards()
				}
			});
		}
	};
	
	/*Get lazy list for ecover before loading detail*/
	$scope.getECoverLazyList = function(){
		var deferred = ecovernoteUIService.$q.defer();
		if(!commonService.hasValueNotEmpty(ecovernoteUIService.lazyChoiceList)){
			ecovernoteUIService.getModuleLazyChoicelist_V3($scope.resourceURL, salecaseUIService.product).then(function(data){
				ecovernoteUIService.lazyChoiceList = data
				deferred.resolve(data);
			});
		} else deferred.resolve();
		return deferred.promise;
	};
	/*Refresh Case detail*/
	$scope.refreshDetail = function(){
		var saleCaseID = salecaseUIService.findElementInDetail_V3(['DocId']);
		salecaseUIService.findDocument_V3($scope.resourceURL, saleCaseID).then(function(data){
			$scope.reSetupConcreteUiStructure(salecaseUIService.detail); // refresh the values in multiple cards
		});
	};
	
	$scope.addAddendumAndHideAction = function(card){
		this.addCard(card, function addedChildEle (addedEle) {
			$scope.setVisibleActionCards($scope.uWCard, false);
		});
	}
	
	
	//endorsement for policy fire
	//Nghia Le
	//get client list for endorsement fire, update interest parties
	$scope.getListClient = function getListClient(){
		 clientUIService.loadList($scope.resourceURL).then(function(data) {
         	if (commonService.hasValueNotEmpty(clientUIService.findElementInElement_V3(data, ['MetadataDocument']))) {
     			$scope.clientList = clientUIService.findElementInElement_V3(data, ['MetadataDocument']);
     			$scope.clientList = clientUIService.convertToArray($scope.clientList);
     			for(var i = 0; i < $scope.clientList.length; i++){
     				$scope.clientList[i].fullName = {};
     				$scope.clientList[i].fullName.$ = $scope.clientList[i].First_Name + " " + $scope.clientList[i].Surname;
     			}
     		} 
         });
	};
	
	//toggle visible card
	$scope.getReason = function getReason(reason){
		if(salecaseUIService.findElementInDetail_V3(['EReason']).Value == reason){
			return true;
		}
		return false;

	};
	$scope.selectedClient = undefined;
	
	/*//product FIR get client list for endorsement fire, update interest parties
	$scope.importClientInfor = function importClientInfor(clientInfor, card){
		if(!$scope.interestedParty){
			$scope.interestedParty = policyUIService.convertToArray(policyUIService.findElementInDetail_V3(['InterestedParty']));
		}
		policyUIService.findElementInElement_V3($scope.interestedParty[card.scope.$index], ['ClientNumber']).$  = clientInfor.Client_ID;
		policyUIService.findElementInElement_V3($scope.interestedParty[card.scope.$index], ['FullName']).$ =  clientInfor.Surname + " " + clientInfor.Surname;
	
	};*/

/*    $scope.printPreviewPdf = function() {
         var docId = policyUIService.findElementInDetail_V3(["DocId"]);
         if(!docId){
             return;
         }
         policyUIService.findDocument_V3($scope.resourceURL, docId).then(function(data){
             policyUIService.productName = policyUIService.findElementInDetail_V3(["Product"]);
             policyUIService.generateDocument_V3($scope.portletId).then(function(data) {
                 if (policyUIService.isSuccess(data)) {
                    var templateName = "";
                    var actionType = "";
                    switch(policyUIService.productName) {
                        case commonService.CONSTANTS.PRODUCT.GUARANTEED_CASHBACK:
                            templateName = "";
                            break;
                        case 'term-life-secure':
                            templateName = "";
                            break;
                        case commonService.CONSTANTS.PRODUCT.GROUP_TERM_LIFE:
                            templateName = "";
                            break;
                        case 'FIR':
                            switch($scope.endorsementReason) {
                                case 'IP':
                                    templateName = "Policy Fire Endorsement Update Interest Party Abridged";
                                    actionType = "ip-endorsement-abridge";
                                    break;
                                case 'CR':
                                    templateName = "Policy Fire Endorsement Update Perils Abridged";
                                    actionType = "cr-endorsement-abridge";
                                    break;
                                case 'N':
                                    templateName = "Policy Fire Endorsement Update Insured Interested Abridged";
                                    actionType = "n-endorsement-abridge";
                                    break;
                                default:
                                    break;
                            }
                            break;
                    }
                     
                     $scope.printPdfService.generatePdf($scope.portletId, policyUIService, policyUIService.productName, actionType);
                 } else {
                     commonUIService.showNotifyMessage("v3.myworkspace.message.GeneratePDFUnsuccessfully");
                 }
             });
        });
    };*/
    
    $scope.printPdf = function(actionType) {
    	var docId = policyUIService.findElementInDetail_V3(["DocId"]);
        if (!docId) {
            return;
        }
        policyUIService.findDocument_V3($scope.resourceURL, docId).then(function(data){
            policyUIService.productName = policyUIService.findElementInDetail_V3(["Product"]);
            policyUIService.generateDocument_V3($scope.portletId).then(function(data) {
                if (policyUIService.isSuccess(data)) {                    
                    $scope.printPdfService.generatePdf($scope.portletId, policyUIService, policyUIService.productName, actionType);
                } else {
                    commonUIService.showNotifyMessage("v3.myworkspace.message.GeneratePDFUnsuccessfully");
                }
            });
       });
	};

}];
