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
var RenewalDetailCtrl = ['$scope', '$log', '$state', 'ajax', 'commonService', 'commonUIService', 'policyUIService', 'prospectUIService', 'salecaseUIService', 'underwritingUIService', 'illustrationUIService', 'applicationUIService', 'paymentUIService', 'ecovernoteUIService', 'printPdfService',
	function($scope, $log, $state, ajax, commonService, commonUIService, policyUIService, prospectUIService, salecaseUIService, underwritingUIService, illustrationUIService, applicationUIService, paymentUIService, ecovernoteUIService, printPdfService) {

	$scope.policyNum = $state.params.docId;
	$scope.moduleApplicationUIService = applicationUIService;
	$scope.moduleService = salecaseUIService;
	$scope.illustrationService = illustrationUIService;
	$scope.commonUIService = commonUIService;
	if (salecaseUIService.product == undefined){
		salecaseUIService.product = salecaseUIService.findElementInDetail_V3(["@product"]); 
	}
	$scope.paymentMethod = [{"value": "CASH",},{"value": "CHEQUE",},{"value": "BANKTRANSFER",}];
	
	if (salecaseUIService.findElementInDetail_V3(['BusinessStatus']) == 'READY FOR SUBMISSION'){
		salecaseUIService.freeze = true;
	}else{
		salecaseUIService.freeze = false;
	}
    $scope.init = function init () {
        var self = this;
        salecaseUIService.product = salecaseUIService.findElementInDetail_V3(["Product"]); 
        salecaseUIService.group = salecaseUIService.getProductGroup_V3(salecaseUIService.product);
        if (salecaseUIService.isSuccess(salecaseUIService.detail)) {
        	if (salecaseUIService.findElementInDetail_V3(['DocName']) == "case-management-DefaultName"){
        		salecaseUIService.findElementInDetail_V3(['Header'])['DocInfo']['DocName'] = salecaseUIService.genDefaultName();
        	}
        	salecaseUIService.cloneProspect = angular.copy(salecaseUIService.findElementInDetail_V3(['Prospect']));
            $scope.salecaseUid = salecaseUIService.findElementInDetail_V3(['DocId']);
            
            salecaseUIService.saveDetail_V3($scope.resourceURL,false).then(function(data){
            	if (salecaseUIService.isSuccess(salecaseUIService.detail)) {
            		self.generalConfigCtrl('RenewalDetailCtrl', salecaseUIService).then(function(){
            			var underwriting = salecaseUIService.findElementInDetail_V3(['Underwriting']);
            			var underwritingDocID = '';
            			if(commonService.hasValueNotEmpty(underwriting) && underwriting['@refUid'] != '') {
            				underwritingDocID = underwriting['@refUid'];
                     		if(salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.MOTOR){
                     			self.setVisibleCard("case-management-motor:Step5_Underwriting", true);
                     		}
                     		if(salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.FIRE){
                     			self.setVisibleCard("case-management-fire:Step6_Underwriting", true);
                     		}
            			}
            			if(salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.MOTOR){
            				var eCoverNoteDocs = salecaseUIService.findElementInDetail_V3(['eCoverNote']);
            				if(eCoverNoteDocs.length > 0 && eCoverNoteDocs[0]['@refUid'] != '') {
            					if(commonService.hasValueNotEmpty(underwritingDocID) && underwritingDocID != '') {
            						self.setVisibleCard("case-management-motor:Step6_eCoverMaintain", true);
            					} else {
            						self.setVisibleCard("case-management-motor:Step5_eCoverMaintain", true);
            					}
            					self.setVisibleCard("case-management-motor:PaymentCard", true);
            				}
            			}
            			// hot fix counter in Quotations for FIRE Renewal
            			/*if(salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.FIRE){
            				salecaseUIService.findElementInDetail_V3(['Quotations'])['@counter'] = 1;
            			}*/
            		})
            	}
            	else{
            		commonUIService.showNotifyMessage("v3.transactioncenter.message.Errorhasoccured");
            	}
            });
        }
    };

    $scope.init();
	
	$scope.getQuotationLazyList = function(){
		var self = this;
		if (!commonService.hasValueNotEmpty(prospectUIService.lazyChoicelist)) {
			var product="";
     		if(salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.MOTOR){
     			product = 'motor-private-car-m-as';
     		}
     		if(salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.FIRE){
     			product = 'FIR';
     		}
			illustrationUIService.getIllustrationLazyList($scope.resourceURL, product).then(function(data) {
            	$scope.isLoaded = true;
            	//$scope.saveDetail();
            });
        };
	};
	
	$scope.getQuotationLazyList ();
		
	$scope.saveDetail = function(){
		salecaseUIService.saveDetail_V3($scope.resourceURL, false).then(function(data){
			if (salecaseUIService.isSuccess(data)) {
				$scope.reSetupConcreteUiStructure(salecaseUIService.detail);
				commonUIService.showNotifyMessage("v3.mynewworkspace.message.SaveCaseSuccessfully", "success");
			}
			else{
				commonUIService.showNotifyMessage("v3.mynewworkspace.message.SaveCaseUnsuccessfully");
			}
			$log.debug("Case has been saved");
		});
    };
    
    $scope.refreshDetail = function(){
		var saleCaseID = salecaseUIService.findElementInDetail_V3(['DocId']);
		salecaseUIService.findDocument_V3($scope.resourceURL, saleCaseID).then(function(data){
			$scope.reSetupConcreteUiStructure(salecaseUIService.detail); // refresh the values in multiple cards
		});
	};
	
    $scope.preSubmit = function(){
    	var self = this;
    	var saleCaseID = salecaseUIService.findElementInDetail_V3(['DocId']);

    	salecaseUIService.saveDetail_V3($scope.resourceURL).then(function(){
    		salecaseUIService.preSubmissionForCaseRenewal($scope.resourceURL, saleCaseID, salecaseUIService.product).then(function(data) {
    			var message = salecaseUIService.findElementInElement_V3(data, ['response']);
    			if(!commonService.hasValueNotEmpty(message)){
    				var underwritingDocID = salecaseUIService.findElementInDetail_V3(['Underwriting'])['@refUid'];
    				var underwriting = salecaseUIService.findElementInDetail_V3(['Underwriting']);
    				if(commonService.hasValueNotEmpty(underwritingDocID) && underwritingDocID != ''){
    					if(salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.MOTOR){
    						self.setVisibleCard("case-management-motor:Step5_Underwriting", true);
    						underwritingUIService.findDocumentToEdit_V3($scope.resourceURL, salecaseUIService.product, underwriting['@refUid']).then(function(data){
        						underwritingUIService.findElementInDetail_V3(['DocInfo'])['DocName'] = underwritingUIService.genDefaultName();
        						underwritingUIService.saveDetail_V3($scope.resourceURL, false).then(function(data){
        						});
        					});
    					}
    					if(salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.FIRE){
    						self.setVisibleCard("case-management-fire:Step6_Underwriting", true);
    						underwritingUIService.getUnderwriting($scope.resourceURL, underwriting['@refUid']).then(function(data){
        						underwritingUIService.findElementInDetail_V3(['DocInfo'])['DocName'] = underwritingUIService.genDefaultName();
        						underwritingUIService.saveDetail_V3($scope.resourceURL, false).then(function(data){
        						});
        					});
    					}
    				}
    				if(salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.MOTOR){
    					var eCoverNoteDocId = salecaseUIService.findElementInDetail_V3(['eCoverNote'])['@refUid'];
    					if(commonService.hasValueNotEmpty(eCoverNoteDocId) && eCoverNoteDocId != ''){
    						self.setVisibleCard("case-management-motor:Step5_eCoverMaintain", true);
    						self.setVisibleCard("case-management-motor:PaymentCard", true); 
    						// Generate DocName for eCoverNote
    						ecovernoteUIService.findDocumentToEdit_V3($scope.resourceURL, salecaseUIService.product, eCoverNoteDocId).then(function(data){
    							ecovernoteUIService.findElementInDetail_V3(['DocInfo'])['DocName'] = applicationUIService.findElementInDetail_V3(['DocInfo'])['DocName'];
    							ecovernoteUIService.saveDetail_V3($scope.resourceURL, false).then(function(data){
    								self.addActionCardToUiStructure("case-management-motor:Step5_ecoverMaintain");
    							});
    						});
    					}
    				}
    				var paymentDocId = salecaseUIService.findElementInDetail_V3(['ClientPayment'])['@refUid'];
    				if(commonService.hasValueNotEmpty(paymentDocId) && paymentDocId != ''){
    					if(salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.FIRE){
    						self.setVisibleCard("case-management-fire:Payment", true);
    					}
    				}
    				
    				var prints = salecaseUIService.findElementInDetail_V3(['Prints']);
    	         	if(prints != undefined && prints['@counter'] > 0) {
    	         		if(salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.FIRE){
    	         			self.setVisibleCard("case-management-fire:TransactionDocuments", true);
    	         		}
    	         	}
    				
    				//applicationUIService.freeze = true;
    				commonUIService.showNotifyMessage("v3.myworkspace.message.PresubmitSaleCaseSuccessfully", 'success');
    				$scope.reSetupConcreteUiStructure(salecaseUIService.detail); // refresh the values in multiple cards
    			}
				
    		});
    	});
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
	$scope.getDocumentCenterList();
	
	/*Review & Accept Quotation*/
	$scope.showAcceptActions = function(){
		// case: open an existing case without open step2: Quotation
		if(!commonService.hasValueNotEmpty(illustrationUIService.detail)){
			var docId = salecaseUIService.findElementInDetail_V3(['Quotation'])['@refUid'];
			if(docId!=''){
				illustrationUIService.findDocumentToEdit_V3($scope.resourceURL, salecaseUIService.product, docId).then(function(data){
				});
			}
		}
		var documentStatus = illustrationUIService.findElementInDetail_V3(['DocumentStatus']);
		var businessStatus = illustrationUIService.findElementInDetail_V3(['BusinessStatus']);
		var application = salecaseUIService.findElementInDetail_V3(['Application'])['@refUid']; 
		salecaseUIService.isShowAcceptButton = false;
		salecaseUIService.isShowUnAcceptButton = false;
		$scope.isShowCreateApplicationButton = false;
		if(businessStatus =="DRAFT"){
			salecaseUIService.isShowAcceptButton = true;
		}
		if(businessStatus == "ACCEPTED" && application == ''){
			salecaseUIService.isShowUnAcceptButton = true;
		}
		/*if(documentStatus == "ACCEPTED" && application == ''){
			// TBD 
			//$scope.isShowCreateApplicationButton = true;
		}*/
		
	};
	$scope.hideAcceptActions = function(){
		salecaseUIService.isShowAcceptButton = false;
		salecaseUIService.isShowUnAcceptButton = false;
		$scope.isShowCreateApplicationButton = false;
	};
	$scope.acceptQuotation = function(){
    	illustrationUIService.computeIllustrationDetail($scope.resourceURL,illustrationUIService.productName).then(function(data){
			var premiumConditional = 'BasePremium';
			if(salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.FIRE || salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.FOREIGN_WORKER){
				premiumConditional = 'TotalPremium';
			}
			if (illustrationUIService.isSuccess(data) && illustrationUIService.findElementInDetail_V3([premiumConditional]).$ != undefined) {
				// set ACCEPTED status to Quotation
				illustrationUIService.findElementInDetail_V3(['DocStatus'])['BusinessStatus'] = "ACCEPTED";
				illustrationUIService.saveDetail_V3($scope.resourceURL, false).then(function(data){
					commonUIService.showNotifyMessage("v3.mynewworkspace.message.AcceptQuotationSuccessfully", "success");
		    	});
				// freeze Quotation
				illustrationUIService.freeze = true;
				$scope.showAcceptActions();
				// set Accepted Quotation var
				illustrationUIService.acceptedQuotationID = illustrationUIService.findElementInDetail_V3(['DocId']);
			} else {
				if(illustrationUIService.findElementInElement_V3(data, ['ipos-response:cause']) == "VehicleNo is in blacklist"){
					illustrationUIService.findElementInDetail_V3(['BusinessStatus'])['DocumentStatus'] = "DECLINED";
					illustrationUIService.saveDetail_V3($scope.resourceURL, false).then(function(data){
						commonUIService.showNotifyMessage("v3.mynewworkspace.message.VehicleNumberIsInBlacklist");
			    	});
				}else{
					commonUIService.showNotifyMessage("v3.myworkspace.message.ComputeQuotationUnuccessfully");
				}
			}
    	});
	};
	$scope.unAcceptQuotation = function(){
		illustrationUIService.findElementInDetail_V3(['DocStatus'])['BusinessStatus'] = "DRAFT";
		illustrationUIService.saveDetail_V3($scope.resourceURL, false).then(function(data){
			$scope.showAcceptActions();
			illustrationUIService.acceptedQuotationID = undefined;
			// un-freeze Quotation
			illustrationUIService.freeze = false;
    	});
	};
	$scope.createApplication = function(){
		
	};
	// For submit button visibility
	$scope.checkApplicationValid = function(uiStructureRoot) {
		if (uiStructureRoot != undefined) {
			if (uiStructureRoot.validStatus == 'VALID') {
				if (applicationUIService.detail && applicationUIService.findElementInDetail_V3(['DocumentStatus']) == 'VALID') {
					return true;
				}
				for (var i = 0; i < uiStructureRoot.children.length; i++) {
					if (uiStructureRoot.children[i].metadata) {
						if (uiStructureRoot.children[i].metadata.DocType == 'application' && uiStructureRoot.children[i].metadata.DocumentStatus == 'VALID') {
							return true;
						}
					}
				}
			}
		}
		return false;
	}
	/* End Review & Accept Quotation*/
	$scope.checkQuotation = function(){
 		if(salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.MOTOR){
 			var illustrationMetaData = $scope.getCardMetadata('case-management-motor:Step1_GenerateQuotation');
 		}
 		if(salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.FIRE){
 			var illustrationMetaData = $scope.getCardMetadata('case-management-fire:Step2_Quotation');
 		}
		var businessStatus = commonService.hasValueNotEmpty(illustrationUIService.detail) ? illustrationUIService.findElementInDetail_V3(['DocStatus'])['BusinessStatus'] :  illustrationMetaData.BusinessStatus;
		if(businessStatus =="ACCEPTED"){
			return true;
		}
		else{
			commonUIService.showNotifyMessage("v3.mynewworkspace.message.QuotationIsNotValid");
			return false;
		}
	};
	
	$scope.checkAddendumAdding = function(card){
		if(card!=undefined){
			this.addCard(card, function addedChildEle (addedEle) {
			});
		}
		var eCoverNoteInCase = salecaseUIService.findElementInDetail_V3(['eCoverNote']);
		if(eCoverNoteInCase.length==undefined){
			commonUIService.showNotifyMessage("v3.mynewworkspace.message.ECoverNoteIsNotReady");
			return false;
		}
		var latestECoverNoteDocId = eCoverNoteInCase[eCoverNoteInCase.length-1]['@refUid'];
		// if has Draft Addendum
		var underwritingDocID = salecaseUIService.findElementInDetail_V3(['Underwriting'])['@refUid'];
		$scope.uWCard = undefined;
		if(underwritingDocID !=''){
			$scope.uWCard = 'case-management-motor:Step6_eCoverMaintain';
		}else{
			$scope.uWCard = 'case-management-motor:Step5_eCoverMaintain';
		}
		if(latestECoverNoteDocId==''){
			$scope.setVisibleActionCards($scope.uWCard, false);
			commonUIService.showNotifyMessage("v3.mynewworkspace.message.AnAddendumIsAlreadyAddedIntoCaseButNotSaved", "success");
		}
		else{
			ecovernoteUIService.getDTODocument_V3($scope.resourceURL, salecaseUIService.product, latestECoverNoteDocId).then(function(data){
				if(ecovernoteUIService.findElementInElement_V3(data, ['BusinessStatus'])=='REJECTED WITH CHANGES'){
					$scope.setVisibleActionCards($scope.uWCard, true);
					commonUIService.showNotifyMessage("v3.mynewworkspace.message.YouCouldCreateAnAddendum", "success");
				} else{
					commonUIService.showNotifyMessage('v3.mynewworkspace.message.lastEcoverNoteAddendumIn'+ ecovernoteUIService.findElementInElement_V3(data, ['BusinessStatus']), "success");
					$scope.setVisibleActionCards($scope.uWCard, false);
				}
			});
		}
	};
	
	$scope.addAddendumAndHideAction = function(card){
		this.addCard(card, function addedChildEle (addedEle) {
			$scope.setVisibleActionCards($scope.uWCard, false);
		});
	}
	$scope.showOrHideAddAddendumAction = function(value){
		$scope.setVisibleActionCards($scope.uWCard, false);
	}
	
	
	$scope.setVisibleAfterUW = function() {
		$scope.setVisibleCard("case-management-motor:Step6_eCoverMaintain", true);
		$scope.setVisibleCard("case-management-motor:PaymentCard", true); 
    	$scope.reSetupConcreteUiStructure(salecaseUIService.detail);
    };
    
    $scope.setVisibleAfterUWFire = function() {
    	$scope.setVisibleCard("case-management-fire:Payment", true); 
    	$scope.reSetupConcreteUiStructure(salecaseUIService.detail);
    };
    
    $scope.setVisibleAfterUWGCS = function() {
    	$scope.setVisibleCard("case-management-guaranteed-cashback-saver:Payment", true); 
    	$scope.reSetupConcreteUiStructure(salecaseUIService.detail);
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
	
	$scope.getUnderwritingLazyList = function(){
		var deferred = underwritingUIService.$q.defer();
		if(!commonService.hasValueNotEmpty(underwritingUIService.lazyChoiceList)){
			salecaseUIService.product = salecaseUIService.findElementInDetail_V3(["Product"]); 
			underwritingUIService.getUnderwritingLazyList($scope.resourceURL, salecaseUIService.product).then(function(data){
				underwritingUIService.lazyChoiceList = data;
				deferred.resolve(data);
			});
		} 
		else deferred.resolve();
		return deferred.promise;
	};
	
	/* Select PDF template popup */
	$scope.printPdf = function(docType, docId) {
		paymentUIService.detail = salecaseUIService.payment;
		paymentUIService.generateDocument_V3($scope.portletId).then(function(data) {
			if (paymentUIService.isSuccess(data)) {
				paymentUIService.jsonToArray(paymentUIService.detail, 'IDs', 'person:ID');
				paymentUIService.jsonToArray(paymentUIService.detail, 'Contacts', 'person:Contact');
				paymentUIService.jsonToArray(paymentUIService.detail, 'Addresses', 'person:Address');
				var businessType = salecaseUIService.findElementInDetail_V3(['@case-name']);
				$scope.printPdfService.generatePdf($scope.portletId, paymentUIService, "", businessType.toLowerCase());
			} else {
				commonUIService.showNotifyMessage("v3.myworkspace.message.GeneratePDFUnsuccessfully");
			}
		});
	};
}];
