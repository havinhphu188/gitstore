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
var ApplicationDetailCtrl = ['$rootScope', '$filter', '$scope', '$log', 'ajax', '$mdDialog', '$controller', 'commonService', 'applicationUIService', 'userCoreService', 'policyUIService', 'illustrationUIService', 'salecaseUIService', 'prospectPersonalUIService', 'commonUIService', 'printPdfService', '$http', 'pdpaUIService', 'uiRenderCoreService', 'loadingBarService','prospectCorporateUIService', 'uiRenderPrototypeService',
	function($rootScope, $filter, $scope, $log, ajax, $mdDialog, $controller, commonService, applicationUIService, userCoreService, policyUIService, illustrationUIService, salecaseUIService, prospectPersonalUIService, commonUIService, printPdfService, $http, pdpaUIService, uiRenderCoreService,loadingBarService, prospectCorporateUIService, uiRenderPrototypeService) {
	
	$scope.commonUIService = commonUIService;
	$scope.moduleService = applicationUIService;
	applicationUIService.productName = salecaseUIService.product;
	$scope.moduleIllustrationService = illustrationUIService;
	$scope.moduleProspectPersonalService = prospectPersonalUIService;
	$scope.modulePolicyService = policyUIService;
	$scope.salecaseService = salecaseUIService;
	$scope.printPdfService = printPdfService;
	applicationUIService.selectedClause = {};
	applicationUIService.selectedClient = {};
	$scope.allAddressList = [];
	$scope.corporateAddressList = [];
//	applicationUIService.NPAddressList = [];
	
	// MNC City lazy choice for each province
	$scope.POPCityCdList = [];
	$scope.PONPCityCdList = [];
	$scope.POCCityCdList = [];
	$scope.CCityCdList = [];
	$scope.BCityCdList = [];
	$scope.RCityCdList = [];
	$scope.MCityCdList = [];
	
//	These function Below is for GTL1 Product	
	$scope.organisationDistArray = [
	                                {"key":"",
	                                	  "ageListVal":[{"age":"","val":""},{"age":"","val":""},{"age":"","val":""},{"age":"","val":""},{"age":"","val":""}]
	                                }];
	$scope.organisationDistObjTemplate = {"key":"",
      	  "ageListVal":[{"age":"","val":""},{"age":"","val":""},{"age":"","val":""},{"age":"","val":""},{"age":"","val":""}]};
	
	// using in RUL product
	$scope.familyMembers = [
	    "application:InsuredFamilyInformationFather",
	    "application:InsuredFamilyInformationMother",
	    "application:InsuredFamilyInformationHusbandOrWife",
	    "application:InsuredFamilyInformationBrothers",
	    "application:InsuredFamilyInformationSisters",
	    "application:InsuredFamilyInformationChild"
	];
	
	$scope.addOccupationClass = function(){
		var a = angular.copy($scope.organisationDistObjTemplate);
		$scope.organisationDistArray.push(a);
	};
	
	$scope.removeOccupationClass = function(index){
		$scope.organisationDistArray.splice(index,1);
	};
	function prepareOrganisationDistToCompute(){
		var count=0;
		applicationUIService.convertObjectEleToArray(applicationUIService.findElementInDetail_V3(['OccupClasses']),['OccupClass']);
		for (var i=0;i<$scope.organisationDistArray.length;i++){
			if ($scope.organisationDistArray[i].key!==null){
				for(var j=0;j<$scope.organisationDistArray[i].ageListVal.length;j++){
					var temp = applicationUIService.findElementInDetail_V3(['OccupClasses','OccupClass'])[count];
					if (temp==undefined){
						applicationUIService.addElementInElement_V3(applicationUIService.detail,['OccupClasses'],['OccupClass']);
						temp = applicationUIService.findElementInDetail_V3(['OccupClasses','OccupClass'])[count];
					}
					applicationUIService.findElementInElement_V3(temp,['OccupClassCd']).$ = $scope.organisationDistArray[i].key;
					applicationUIService.findElementInElement_V3(temp,['UpToAgeOfOccupClassVal']).$ = $scope.organisationDistArray[i].ageListVal[j].val;
					count++;
				}
			}
		}
	}
	
	function initOrganisationDist(){
		var count=0;
		var empDistTemp = applicationUIService.findElementInDetail_V3(['OccupClass']);
		if (empDistTemp.length != undefined && empDistTemp.length>=5){
			for (var i=0;i<empDistTemp.length;i++){
				$scope.organisationDistArray[count].key = applicationUIService.findElementInElement_V3(empDistTemp[i],['OccupClassCd']).$
				for (var j=0;j<5;j++){
					$scope.organisationDistArray[count].ageListVal[j].val = applicationUIService.findElementInElement_V3(empDistTemp[count*5+j],['UpToAgeOfOccupClassVal']).$
				}
				count++;
				i+=4;
			}
		} 
		else $scope.organisationDistArray[0].key = applicationUIService.findElementInElement_V3(empDistTemp,['OccupClassCd']).$;
	}
//	End--->	

	// MNC Link - migrate old beneficiary - add refUid
    function updateBeneficiaryItems(){
    	var counter = applicationUIService.findElementInDetail_V3(['BeneficiaryDetails'])['@counter'];
    	var beneficiaryItems = applicationUIService.findElementInDetail_V3(['BeneficiaryItem']);
    	for (var i = 0; i < counter; i++) {
    		if (beneficiaryItems[i]['@refUid'] == undefined) {
    			beneficiaryItems[i]['@refUid'] = '';
    		}
    	}
    }
    
    $scope.init = function init () {
        var self = this;   
        applicationUIService.group = applicationUIService.getProductGroup_V3(applicationUIService.productName);
        if (applicationUIService.group == commonService.CONSTANTS.PRODUCT.GROUP_TERM_LIFE
				&& applicationUIService.detail){
			 initOrganisationDist();
		 }
        self.generalConfigCtrl('ApplicationDetailCtrl', applicationUIService).then(function finishedSetup () {
            $log.debug("this ctrl is processsing for: " + JSON.stringify($scope.getCurrProductInfor()));

            //get lazy list
            return self.getComputeLazy();
        }).then(function () {

    		var quotationDocID = undefined;
    		if (commonService.hasValue(illustrationUIService.acceptedQuotationID)) {
    			quotationDocID = illustrationUIService.acceptedQuotationID;
    		} else {
    			quotationDocID = salecaseUIService.findElementInDetail_V3(['Quotation'])['@refUid'];
    		}
    		var applicationDocID = salecaseUIService.findElementInDetail_V3(['Application'])['@refUid'];
    		if (commonService.hasValueNotEmpty(applicationDocID)) {
				applicationUIService.isFirstInitialize = false;
			}
    		var caseStatus = salecaseUIService.findElementInDetail_V3(['BusinessStatus']);
    		var applicationStatus = applicationUIService.findElementInDetail_V3(['BusinessStatus']);
    		
    		if (applicationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.UNIT_LINK
    				|| applicationUIService.productName == commonService.CONSTANTS.PRODUCT.REGULAR_UNIT_LINK
    				|| applicationUIService.productName == commonService.CONSTANTS.PRODUCT.ENDOWMENT){
    			$scope.moduleService.freeze = (applicationStatus == commonService.CONSTANTS.STATUS.DRAFT || applicationStatus == commonService.CONSTANTS.STATUS.NEW) ? false : true;
    			//MNC Link - migrate old beneficiary - add refUid
    			updateBeneficiaryItems();
    		}else{
    			$scope.moduleService.freeze = (caseStatus == "READY FOR SUBMISSION" ||  caseStatus == "SUBMITTED") ? true : false;
    		}
			if (commonService.hasValueNotEmpty(quotationDocID)){
				illustrationUIService.findDocument_V3($scope.resourceURL, quotationDocID).then(function() {
					loadingBarService.showLoadingBar();
					
	    			applicationUIService.generateApplicationFromQuotation_V3($scope.resourceURL, quotationDocID).then(function(data){
	    				loadingBarService.hideLoadingBar();
	    				
	    				//START: For Unit Link product
	    				var promise = undefined;
	    				
    					//copy proposer and LA information to application
    					promise = $scope.populatePOLAToApplication();
    					//END: For Unit Link product
    					
    					promise.then(function(){
    						
    				    	if ((applicationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.FIRE)||
    				    			(applicationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.MOTOR 
    				    					&& applicationUIService.productName != commonService.CONSTANTS.PRODUCT.DIRECT_SALE_MOTOR)){
    				    		applicationUIService.findElementInDetail_V3(['Quotation'])['@refUid'] = quotationDocID;
    				    	}
    				    	// for Direct Sale, push User Info into Policy Owner in Application
    				    	if (salecaseUIService.findElementInDetail_V3(['@channel'])=='DS'
    				    		&& salecaseUIService.findElementInDetail_V3(['@case-name']) =="NewBusiness"){
    				    	    // if user doc is undefined, then get it and pass data to policy owner. 
    				    	    if (salecaseUIService.userDoc == undefined) {
    				    	        getUserDoc().then(function() {
    				    	        	$scope.pushUserInfoIntoPO();
    				    	        	$scope.getUserNonPrimaryAddressList();
    				    	        });
    				    	    } else {
    				    	        $scope.pushUserInfoIntoPO();
    				    	        $scope.getUserNonPrimaryAddressList();
    				    	    }
    				    	}
    				    	//applicationUIService.findElementInDetail_V3(['DocStatus']).BusinessStatus = salecaseUIService.findElementInDetail_V3(['BusinessStatus']);
    	    				$scope.reSetupConcreteUiStructure(applicationUIService.detail);
    	    				$scope.initScopeRul();//binding data for application after resetup
    	
    	    				if (applicationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.FOREIGN_WORKER) {
    	    					applicationUIService.findElementInDetail_V3(['IllustrationResult'])['@refUid'] = quotationDocID;
        						var POId = illustrationUIService.findElementInDetail_V3(['MainInsured'])['@refUid'];
        						prospectPersonalUIService.findDocument_V3($scope.resourceURL, POId).then(function(data) {
        							if (prospectPersonalUIService.isSuccess(data)) {
        								applicationUIService.findElementInDetail_V3(['PolicyOwnerInformation'])['@refUid'] = POId;
        								$scope.populateProspectInfo();
        								$scope.getNonPrimaryAddressList();
        							}
        						});
    	    				}
    	    				if (applicationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.TERM_LIFE
    	    						&& applicationUIService.productName != commonService.CONSTANTS.PRODUCT.REGULAR_UNIT_LINK) {   					
    	    					$scope.populateAddresses();
    							
    	                	};
    	                	if (applicationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.TRAVEL) {
    	                		if (applicationUIService.productName == commonService.CONSTANTS.PRODUCT.TRAVEL_EXPRESS) {
    	                			var POId = applicationUIService.findElementInDetail_V3(['PolicyOwnerInformation'])['@refUid'];
	    	                		if (POId != undefined && POId != '') {
	    	                			prospectPersonalUIService.findDocument_V3($scope.resourceURL, POId).then(function(data) {
	            							if (prospectPersonalUIService.isSuccess(data)) {
	            								$scope.getNonPrimaryAddressList();
	            							}
	            						});
	    	                		}
    	                		}
    	                		if (applicationUIService.productName == commonService.CONSTANTS.PRODUCT.GROUP_TRAVEL_EXPRESS) {
    	                			var POId = applicationUIService.findElementInDetail_V3(['PolicyOwnerInformation'])['@refUid'];
	    	                		if (POId != undefined && POId != '') {
	    	                			prospectCorporateUIService.findDocument_V3($scope.resourceURL, POId).then(function(data) {
	            							if (prospectCorporateUIService.isSuccess(data)) {
	            								$scope.getCorrespondenceAddressOfCorporate();
	            							}
	            						});
	    	                		}
    	                		}
    	                	}
    	    				if ( salecaseUIService.findElementInDetail_V3(['@case-name']) == 'Renewal' && 
    	    					(applicationUIService.findElementInDetail_V3(['FullName']).$ == undefined || (applicationUIService.findElementInDetail_V3(['FullName']).$ == '' ))){
    	    					if (policyUIService.detail==undefined){
    	    						var policyId = salecaseUIService.findElementInDetail_V3(['PolicyId']).$;
    	    						if (commonService.hasValueNotEmpty(policyId)){
    	    							policyUIService.findDocument_V3($scope.resourceURL, policyId).then(function(data){
    	    								applicationUIService.getPolicyOwnerDetail();
    	    								applicationUIService.findElementInDetail_V3(['ActionType']).$ = "RENEWAL";
    	    								applicationUIService.refresh_V3($scope.resourceURL, salecaseUIService.product).then(function(data){
    	    									applicationUIService.findElementInElement_V3(data,['DocStatus']).BusinessStatus = salecaseUIService.findElementInDetail_V3(['BusinessStatus']);
    	    									$scope.reSetupConcreteUiStructure(data); // refresh the values in multiple cards
    	    								});
    	    							});
    	    						}
    	    					}else{
    	    						applicationUIService.getPolicyOwnerDetail();
    	    						applicationUIService.findElementInDetail_V3(['ActionType']).$ = "RENEWAL";
    	    						applicationUIService.refresh_V3($scope.resourceURL, salecaseUIService.product).then(function(data){
    	    							applicationUIService.findElementInElement_V3(data,['DocStatus']).BusinessStatus = salecaseUIService.findElementInDetail_V3(['BusinessStatus']);
    	    							$scope.reSetupConcreteUiStructure(data); // refresh the values in multiple cards
    	    						});
    	    					}
    	    				}
    					});
	    			});
				});
			}
			
			if(applicationUIService.productName == commonService.CONSTANTS.PRODUCT.DIRECT_TRAVEL||applicationUIService.productName == commonService.CONSTANTS.PRODUCT.DIRECT_SALE_HOME
					|| applicationUIService.productName == commonService.CONSTANTS.PRODUCT.DIRECT_SALE_PA || applicationUIService.productName == commonService.CONSTANTS.PRODUCT.DIRECT_SALE_MOTOR) {
				var salecaseId = salecaseUIService.findElementInDetail_V3(['DocId']);
				loadingBarService.showLoadingBar();
		    	salecaseUIService.findDocument_V3($scope.resourceURL, salecaseId).then(function() {
		    		loadingBarService.hideLoadingBar();
		    	});
			}			
        });
    };
    $scope.init();

    
    
    //if non primary addresses is available then add same number of non primary address to application PO and LA
    $scope.copyNonPrimaryAddressStructure = function copyNonPrimaryAddressStructure (prospectType){
    	var counterA = prospectPersonalUIService.findElementInDetail_V3(['NonPrimaryAddresses'])['@counter'];
    	var counterAInProspect = applicationUIService.findElementInDetail_V3([prospectType, 'NonPrimaryAddresses'])['@counter'];

    	applicationUIService.convertObjectToArray(applicationUIService.detail, [prospectType, 'NonPrimaryAddresses', 'NonPrimaryAddress']);
    	prospectPersonalUIService.convertObjectToArray(prospectPersonalUIService.detail, ['NonPrimaryAddresses', 'NonPrimaryAddress']);

    	// if Address in Prospect is available
        if (counterA > 0) {
            for (var i = 0; Number(applicationUIService.findElementInDetail_V3([prospectType, 'NonPrimaryAddresses'])['@counter']) < counterA; i++) {
                applicationUIService.addElementInElement_V3(applicationUIService.detail, [prospectType, 'NonPrimaryAddresses'], [prospectType, 'NonPrimaryAddresses', 'NonPrimaryAddress']);
            }
         }
    }

    //RUL add new nonPrimary address
    $scope.removeCardAddress = function removeCardAddress (card) {
        uiRenderPrototypeService.removeChildElement(card.parent, card.scope.$index);
        if ($scope.isPOandLADiff == false){
        	var addressesLA = applicationUIService.findElementInDetail_V3(['LifeAssuredInformation', 'NonPrimaryAddresses']);
        	uiRenderPrototypeService.removeChildEleParentEle(addressesLA, ['NonPrimaryAddress'], card.scope.$index - 1);
        }
    };
    //RUL remove nonPrimary address
    $scope.addCardAddress = function addCardAddress (card) {
         //if card is action card, get the parent
            //Otherwise, use card to get the list of children need to add
            var parentCard = card.cardType === uiRenderPrototypeService.CONSTANTS.cardType.ACTION ? card.parent : card;
            uiRenderPrototypeService.addChildElement({
                "parentCard" : parentCard
            });    

        if ($scope.isPOandLADiff == false){
        	var addressesLA = applicationUIService.findElementInDetail_V3(['LifeAssuredInformation', 'NonPrimaryAddresses']);
        	$scope.moduleService.addChildEleToParentEle(addressesLA, ['NonPrimaryAddress']);
        }
    };
    
    // Endowment - Update the Beneficiary number in list when add / remove an Beneficiary item
    $scope.removeBeneficiaryItemCard = function removeBeneficiaryItemCard (card) {
    	var self = this;
    	self.removeCard(card, card.scope.$index);
    	updateBeneficiaryNumber(self);
    };
    
    $scope.addBeneficiaryItemCard = function addBeneficiaryItemCard (card) {    	
    	var self = this;
    	self.addCard(card, function updateBeneficiaryList () {
    		updateBeneficiaryNumber(self);
		});
    };
    
    function updateBeneficiaryNumber(self){
    	var counter = self.moduleService.findElementInDetail_V3(['BeneficiaryDetails'])['@counter'];
    	var beneficiaryItems = self.moduleService.findElementInDetail_V3(['BeneficiaryItem']);
    	for (var i = 0; i < counter; i++) {
    		self.moduleService.findElementInElement_V3(beneficiaryItems[i], ['BeneficiaryDetailsNumber']).$ = i + 1;
    	}
    }
    
    
    //RUL copy information when init
    $scope.populatePOLAToApplication = function populatePOLAToApplication () {
    	var deferred = $scope.moduleService.$q.defer();
    	
        if (applicationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.UNIT_LINK
        		|| applicationUIService.productName == commonService.CONSTANTS.PRODUCT.REGULAR_UNIT_LINK
        		|| applicationUIService.productName == commonService.CONSTANTS.PRODUCT.ENDOWMENT){
        	
        	//if rider in illustration, the IsHasRider is true and some questions
            //if PO same with LA and rider is existed then hide some question in PO informations 
        	$scope.computeTag([['Riders'], ['IsHasRider']]).then(function(){

            //set up some table and variable for application to optimize speed
            $scope.initScopeRul();

            //For Unit Link product
            if (applicationUIService.findElementInDetail_V3(['BusinessStatus']) == "NEW" || applicationUIService.findElementInDetail_V3(['BusinessStatus']) == "DRAFT") {

                var POId = applicationUIService.findElementInDetail_V3(['ProporserInformation'])['@refUid'];
                var LAId = applicationUIService.findElementInDetail_V3(['LifeAssuredInformation'])['@refUid'];
                
                if (POId && LAId){
                	$scope.populatePDPAInformation(POId);
                    //get all addresses for mailing address
                    $scope.getUserNonPrimaryAddressListRUL();
                    //RUL reload occupation list
                    $scope.filterOcupationPO();
                    //RUL reload occupation list
                    $scope.filterOcupationLA();
                    
                    deferred.resolve();//copy data for the first time
                } else {
                    var proposerId = illustrationUIService.findElementInDetail_V3(['PolicyOwnerInformation'])['@refUid'];
                    var lifeInsuredId = illustrationUIService.findElementInDetail_V3(['LifeInsuredInformation'])['@refUid'];
                
                    $scope.populatePDPAInformation(proposerId);
                    
                    if (!proposerId && !lifeInsuredId){
                        commonUIService.showNotifyMessage("v3.transactioncenter.message.Errorhasoccured");
                        deferred.resolve();
                    }else{
                        applicationUIService.findElementInDetail_V3(['ProporserInformation'])['@refUid'] = proposerId;
                        applicationUIService.findElementInDetail_V3(['LifeAssuredInformation'])['@refUid'] = lifeInsuredId;
                        //find prospect to populate to prsposer in application
                        prospectPersonalUIService.findDocument_V3($scope.resourceURL, proposerId).then(function(prospectDetail) {
                            if (prospectPersonalUIService.isSuccess(prospectDetail)) {
                                $scope.copyNonPrimaryAddressStructure('ProporserInformation');
                                delete prospectPersonalUIService.findElementInElement_V3(prospectDetail, ["Data", "PersonContactData"])["personal-contact:Attachments"];
                                delete prospectPersonalUIService.findElementInElement_V3(prospectDetail, ["Data", "PersonContactData"])["personal-contact:PersonContactRole"];
                                applicationUIService.copyInforFromSameStructureObj(prospectDetail, applicationUIService.detail, ["Data", "PersonContactData"], ["PolicyOwnerDetails", "ProporserInformation"]);
                                $scope.appendPOfromIllustration();
                                //get all addresses for mailing address
                                $scope.getUserNonPrimaryAddressListRUL();
                              //RUL reload occupation list
                                $scope.filterOcupationPO();
                                 
                                if ($scope.isPOandLADiff == true){
                                    //find life insured if PO and LA is difference
                                    prospectPersonalUIService.findDocument_V3($scope.resourceURL, lifeInsuredId).then(function(lifeInsuredDetail) {
                                        if (prospectPersonalUIService.isSuccess(lifeInsuredDetail)) {
                                            $scope.copyNonPrimaryAddressStructure('LifeAssuredInformation');
                                            delete prospectPersonalUIService.findElementInElement_V3(lifeInsuredDetail,["Data", "PersonContactData"])["personal-contact:Attachments"];
                                            delete prospectPersonalUIService.findElementInElement_V3(lifeInsuredDetail,["Data", "PersonContactData"])["personal-contact:PersonContactRole"];
                                            applicationUIService.copyInforFromSameStructureObj(lifeInsuredDetail, applicationUIService.detail, ["Data", "PersonContactData"], ["LifeAssuredDetails", "LifeAssuredInformation"]);
                                            $scope.appendLAfromIllustration();
                                            //RUL reload occupation list
                                            $scope.filterOcupationLA();
                                            deferred.resolve();
                                        }else{
                                            commonUIService.showNotifyMessage("v3.transactioncenter.message.Errorhasoccured");
                                            deferred.resolve();
                                        }
                                    });
                                }else{
                                    $scope.copyNonPrimaryAddressStructure('LifeAssuredInformation');
                                    deferred.resolve();
                                }
                            }else{
                                commonUIService.showNotifyMessage("v3.transactioncenter.message.Errorhasoccured");
                                deferred.resolve();
                            }
                        });
                    }
                }
            }
            else{
                deferred.resolve();
            }
        	}); // end $scope.computeTag([['Riders'], ['IsHasRider']])
        } else{
			deferred.resolve();
		}
		return deferred.promise;
    };
    
    
    
    
    
   
 	//get prospect address
	$scope.getProspectAddress = function() {
		var self = this;
		var wait = false;
		var propsectId;
        var deferred = self.moduleService.$q.defer();
		if ( applicationUIService.group === commonService.CONSTANTS.PRODUCT_GROUP.TERM_LIFE
				&& applicationUIService.productName !== commonService.CONSTANTS.PRODUCT.REGULAR_UNIT_LINK){
	 		propsectId = salecaseUIService.findElementInDetail_V3(['ProspectId']).$;
	 		if (commonService.hasValueNotEmpty(propsectId)){
	 			wait = true;
	 			prospectPersonalUIService.findDocument_V3($scope.resourceURL, propsectId).then(function(data){
	 				$scope.AddressList = prospectPersonalUIService.convertToArray($scope.moduleProspectPersonalService.findElementInElement_V3(data,['NonPrimaryAddress']));
	 				var i = 0;
	 				for(i; $scope.AddressList.length(); i++){
	 					$scope.AddressList[i].address = $scope.AddressList[i].BlkHouseNo + " - " + $scope.AddressList[i].Street;
	 				}
	 				deferred.resolve();
	 			});
	 		}
		}

		//if don't need to wait, resolve now
		if (!wait)
			deferred.resolve();

		return deferred.promise;
	};
    
    var getUserDoc = function(){
        var deferred = applicationUIService.$q.defer();
        var resourceURL = applicationUIService.initialMethodPortletURL($scope.portletId,"loadPersonalProfileDoc");
        resourceURL = resourceURL.toString();
        $http.get(resourceURL).success(function(result){
            salecaseUIService.userDoc = result;
            deferred.resolve();
        });
        return deferred.promise;
    };
    
    // reset prospect to init new detail when create PO
    prospectPersonalUIService.detail = undefined;
    
    $scope.getComputeLazy = function(){
		var deferred = applicationUIService.$q.defer();
		if (!commonService.hasValueNotEmpty(applicationUIService.lazyChoiceList)){
			applicationUIService.getLazyChoiceListByModuleAndProduct_V3($scope.resourceURL, salecaseUIService.product).then(function(data) {
				deferred.resolve(data);
				
				
				applicationUIService.lazyChoiceList = {};
				if (applicationUIService.productName == 'guaranteed-cashback-saver'){
					applicationUIService.lazyChoiceList['guaranteed-cashback-saver'] = data;
					
				} else if (applicationUIService.productName == 'term-life-secure'){
					applicationUIService.lazyChoiceList['term-life-secure'] = data;
					
				}else{
					applicationUIService.lazyChoiceList = data;
				}
				
				// MNC Travel City lazy choice for each province
				if (applicationUIService.productName == commonService.CONSTANTS.PRODUCT.TRAVEL_EXPRESS
						|| applicationUIService.productName == commonService.CONSTANTS.PRODUCT.DIRECT_TRAVEL||applicationUIService.productName == commonService.CONSTANTS.PRODUCT.DIRECT_SALE_PA) {
					$scope.POCCityCdList = applicationUIService.findElementInElement_V3(applicationUIService.lazyChoiceList, ['POPCityCd']).Option;
					$scope.POPCityCdList = applicationUIService.findElementInElement_V3(applicationUIService.lazyChoiceList, ['POPCityCd']).Option;
					$scope.PONPCityCdList = applicationUIService.findElementInElement_V3(applicationUIService.lazyChoiceList, ['PONPCityCd']).Option;
				}
				if (applicationUIService.productName == commonService.CONSTANTS.PRODUCT.GROUP_TRAVEL_EXPRESS) {
					$scope.CCityCdList = applicationUIService.findElementInElement_V3(applicationUIService.lazyChoiceList, ['CCityCd']).Option;
					$scope.BCityCdList = applicationUIService.findElementInElement_V3(applicationUIService.lazyChoiceList, ['BCityCd']).Option;
					$scope.RCityCdList = applicationUIService.findElementInElement_V3(applicationUIService.lazyChoiceList, ['RCityCd']).Option;
					$scope.MCityCdList = applicationUIService.findElementInElement_V3(applicationUIService.lazyChoiceList, ['MCityCd']).Option;
				}
			});
		} else deferred.resolve();
		return deferred.promise;
	};
	
    // get Address List in Application
	$scope.getAddressList = function(policyOwnerId){
		//applicationUIService.findElementInDetail_V3(['AddressType']).Value = "CORRESPONDENCE"; 
		if (!commonService.hasValue(policyOwnerId) || policyOwnerId == '') {
			policyOwnerId = applicationUIService.findElementInDetail_V3(['PolicyOwnerInformation'])['@refUid'];
		}
		prospectPersonalUIService.getDocumentDetail_V3($scope.resourceURL, policyOwnerId).then(function (data){
			applicationUIService.PDPAId = prospectPersonalUIService.findElementInDetail_V3(['PdpaInformation'])['@refUid'];
			var addressInProspect = prospectPersonalUIService.findElementInDetail_V3(['Address']);
			if (!$.isArray(addressInProspect)){
				addressInProspect = prospectPersonalUIService.convertToArray(addressInProspect);
			}
			applicationUIService.addressList= addressInProspect;
			
			
			//for GCS
			if ((applicationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.TERM_LIFE
					&& applicationUIService.productName != commonService.CONSTANTS.PRODUCT.REGULAR_UNIT_LINK)
			    && applicationUIService.isFirstMailingAddressInitialize == true){
			    applicationUIService.isFirstMailingAddressInitialize = false;
				for(var i=0; i < applicationUIService.addressList.length; i++){
					if (prospectPersonalUIService.findElementInElement_V3(applicationUIService.addressList[i], ['PreferredAddress']).Value=='Y' && prospectPersonalUIService.findElementInElement_V3(applicationUIService.addressList[i], ['AddressType']).Value == 'RESIDENTIAL'){
						applicationUIService.findElementInDetail_V3(['MailingAddress','AddressType']).Value = prospectPersonalUIService.findElementInElement_V3(applicationUIService.addressList[i], ['AddressType']).Value;
						applicationUIService.findElementInDetail_V3(['MailingAddress','BlkHouseNo']).$ = prospectPersonalUIService.findElementInElement_V3(applicationUIService.addressList[i], ['BlkHouseNo']).$;
						applicationUIService.findElementInDetail_V3(['MailingAddress','Street']).$ = prospectPersonalUIService.findElementInElement_V3(applicationUIService.addressList[i], ['Street']).$;
						applicationUIService.findElementInDetail_V3(['MailingAddress','UnitNo']).$ = prospectPersonalUIService.findElementInElement_V3(applicationUIService.addressList[i], ['UnitNo']).$;
						applicationUIService.findElementInDetail_V3(['MailingAddress','Building']).$ = prospectPersonalUIService.findElementInElement_V3(applicationUIService.addressList[i], ['Building']).$;
						applicationUIService.findElementInDetail_V3(['MailingAddress','City']).$ = prospectPersonalUIService.findElementInElement_V3(applicationUIService.addressList[i], ['City']).$;
						applicationUIService.findElementInDetail_V3(['MailingAddress','Country']).Value = prospectPersonalUIService.findElementInElement_V3(applicationUIService.addressList[i], ['Country']).Value;
						applicationUIService.findElementInDetail_V3(['MailingAddress','Postal']).$ = prospectPersonalUIService.findElementInElement_V3(applicationUIService.addressList[i], ['Postal']).$;
						applicationUIService.findElementInDetail_V3(['MailingAddress','PreferredAddress']).Value = prospectPersonalUIService.findElementInElement_V3(applicationUIService.addressList[i], ['PreferredAddress']).Value;			
					}
				}
			}
		});
	}
	
	 // get Address List in Application
	$scope.populatePDPAInformation = function(policyOwnerId){
		//applicationUIService.findElementInDetail_V3(['AddressType']).Value = "CORRESPONDENCE"; 
		if (!commonService.hasValue(policyOwnerId) || policyOwnerId == '') {
			policyOwnerId = applicationUIService.findElementInDetail_V3(['PolicyOwnerInformation'])['@refUid'];
		}
		
		prospectPersonalUIService.findDocument_V3($scope.resourceURL, policyOwnerId).then(function (data){
			applicationUIService.PDPAId = prospectPersonalUIService.findElementInDetail_V3(['PdpaInformation'])['@refUid'];
			
			 if (applicationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.UNIT_LINK
					 ||applicationUIService.productName == commonService.CONSTANTS.PRODUCT.REGULAR_UNIT_LINK
					 || applicationUIService.productName == commonService.CONSTANTS.PRODUCT.ENDOWMENT){
				 $scope.getPDPAInfo_MNC();
			 }else{
				 $scope.getPDPAInfo();
			 }
			
		});
		
	}
	
	/**
	 * @author nnguyen75
	 * 2016.03.21
	 * Auto populate primary and non primary addresses of personal contact to policy owner and/or life insured
	 */
	$scope.populateAddresses = function() {
		var POId = applicationUIService.findElementInDetail_V3(['PolicyOwnerInformation'])['@refUid'];
		var LIId = applicationUIService.findElementInDetail_V3(['LifeAssuredInformation'])['@refUid'];
		prospectPersonalUIService.findDocument_V3($scope.resourceURL, POId).then(function(data) {
			if (prospectPersonalUIService.isSuccess(data)) {
				applicationUIService.PDPAId = prospectPersonalUIService.findElementInDetail_V3(['PdpaInformation'])['@refUid'];
				var prospectPrimaryAddress = prospectPersonalUIService.findElementInDetail_V3(['PrimaryAddress']);
				var POPrimaryAddress = applicationUIService.findElementInDetail_V3(['PolicyOwnerInformation', 'PrimaryAddress']);
				for (var prop in POPrimaryAddress) {
					var value =  applicationUIService.findElementInElement_V3(prospectPrimaryAddress, [prop]).Value;
					var string =  applicationUIService.findElementInElement_V3(prospectPrimaryAddress, [prop]).$;
					if (commonService.hasValueNotEmpty(value) || commonService.hasValueNotEmpty(string)) {
						if (commonService.hasValueNotEmpty(value)) {
							applicationUIService.findElementInElement_V3(POPrimaryAddress, [prop]).Value = value;
						} else {
							applicationUIService.findElementInElement_V3(POPrimaryAddress, [prop]).$ = string;
						}
					};
				}
				$scope.getNonPrimaryAddressList();
				if (commonService.hasValueNotEmpty(LIId) && LIId !== POId) {
					prospectPersonalUIService.findDocument_V3($scope.resourceURL, LIId).then(function(data) {
						if (prospectPersonalUIService.isSuccess(data)) {
							var prospectPrimaryAddress = prospectPersonalUIService.findElementInDetail_V3(['PrimaryAddress']);
							var LIPrimaryAddress = applicationUIService.findElementInDetail_V3(['LifeAssuredInformation', 'PrimaryAddress']);
							for (var prop in LIPrimaryAddress) {
								var value =  applicationUIService.findElementInElement_V3(prospectPrimaryAddress, [prop]).Value;
								var string =  applicationUIService.findElementInElement_V3(prospectPrimaryAddress, [prop]).$;
								if (commonService.hasValueNotEmpty(value) || commonService.hasValueNotEmpty(string)) {
									if (commonService.hasValueNotEmpty(value)) {
										applicationUIService.findElementInElement_V3(LIPrimaryAddress, [prop]).Value = value;
									} else {
										applicationUIService.findElementInElement_V3(LIPrimaryAddress, [prop]).$ = string;
									}
								};
							}
						} else {
							// handle error getting personal contact detail
						}
					});
				}
			} else {
				// handle error getting personal contact detail
			}
		});
		
	}
	
	/**
	 * @author nnguyen75
	 * 2016.03.21
	 * Get non primary address list from personal contact
	 */
	$scope.getNonPrimaryAddressList = function() {
		if (prospectPersonalUIService.findElementInDetail_V3(['NonPrimaryAddresses'])['@counter'] != 0) {
			var NPAddresses = prospectPersonalUIService.findElementInDetail_V3(['NonPrimaryAddress']);
			if (!$.isArray(NPAddresses)) {
				NPAddresses = prospectPersonalUIService.convertToArray(NPAddresses);
			}
			
			//add new combine element for select address
			for(var i = 0; i < NPAddresses.length; i++){
				NPAddresses[i].blkAndStreet = {};
				NPAddresses[i].blkAndStreet.$ = prospectPersonalUIService.findElementInElement_V3(NPAddresses[i], ['BlkHouseNo']).$  + " - " + prospectPersonalUIService.findElementInElement_V3(NPAddresses[i], ['Street']).$ ;
			}
			
			applicationUIService.NPAddressList = NPAddresses;
		}
		$scope.getProspectAllAddressList();
	}
	
	/**
	 * @author nnguyen75
	 * 2016.03.30
	 * Get non primary address list from user
	 */
	$scope.getUserNonPrimaryAddressList = function() {
		if (userCoreService.findElementInElement_V3(salecaseUIService.userDoc, ['NonPrimaryAddresses'])['@counter'] != 0) {
			var userNPAddresses = userCoreService.findElementInElement_V3(salecaseUIService.userDoc, ['NonPrimaryAddress']);
			if (!$.isArray(userNPAddresses)) {
				userNPAddresses = userCoreService.convertToArray(userNPAddresses);
			}
			
			//add new combine element for select address
			for(var i = 0; i < userNPAddresses.length; i++){
				userNPAddresses[i].blkAndStreet = {};
				userNPAddresses[i].blkAndStreet.$ = userCoreService.findElementInElement_V3(userNPAddresses[i], ['BlkHouseNo']).$  + " - " + userCoreService.findElementInElement_V3(userNPAddresses[i], ['Street']).$ ;
			}
			
			applicationUIService.NPAddressList = userNPAddresses;
		}
	}
	
	/**
	 * @author ttan40
	 * 2016.06.29
	 * Get all address list from user
	 */
	$scope.getProspectAllAddressList = function() {
		var prospectPrimaryAddress = prospectPersonalUIService.findElementInDetail_V3(['PrimaryAddress']);
		prospectPrimaryAddress.blkAndStreet = { $: prospectPrimaryAddress.BlkHouseNo.$ + ' - ' + prospectPrimaryAddress.Street.$ };
		prospectPrimaryAddress = userCoreService.convertToArray(prospectPrimaryAddress);
		$scope.allAddressList = prospectPrimaryAddress.concat(applicationUIService.NPAddressList);
	}
	
	/**
	 * @author nle32
	 * 2016.06.29
	 * Get all address list from user mailing address RUL
	 */
	
	$scope.getUserNonPrimaryAddressListRUL = function() {
		if (applicationUIService.findElementInDetail_V3(['ProporserInformation', 'NonPrimaryAddresses'])['@counter'] != 0) {
			var userNPAddresses = applicationUIService.findElementInDetail_V3(['ProporserInformation', 'NonPrimaryAddress']);
			if (!$.isArray(userNPAddresses)) {
				userNPAddresses = applicationUIService.convertToArray(userNPAddresses);
			}

			applicationUIService.NPAddressList = userNPAddresses;
		}
		
		$scope.getProspectAllAddressListRUL();
	}
	
	$scope.getProspectAllAddressListRUL = function() {
		var prospectPrimaryAddress = applicationUIService.findElementInDetail_V3(['ProporserInformation', 'PrimaryAddress']);
		prospectPrimaryAddress = userCoreService.convertToArray(prospectPrimaryAddress);
		$scope.allAddressListRul = prospectPrimaryAddress.concat(applicationUIService.NPAddressList);
	}
		
	/**
	 * @author nnguyen75
	 * 2016.03.24
	 * Check address has data
	 */
	$scope.checkAddressHasData = function(address) {
		for (var prop in address) {
			var value =  applicationUIService.findElementInElement_V3(address, [prop]).Value;
			var string =  applicationUIService.findElementInElement_V3(address, [prop]).$;
			if (commonService.hasValueNotEmpty(value) || commonService.hasValueNotEmpty(string)) {
				return true;
			};
		}
		return false;
	}
	
	/**
	 * @author nnguyen75
	 * 2016.03.24
	 * Remove address
	 */
	$scope.removeAddress = function(address) {
		for (var prop in address) {
			var value =  applicationUIService.findElementInElement_V3(address, [prop]).Value;
			var string =  applicationUIService.findElementInElement_V3(address, [prop]).$;
			if (commonService.hasValueNotEmpty(value) || commonService.hasValueNotEmpty(string)) {
				if (commonService.hasValueNotEmpty(value)) {
					applicationUIService.findElementInElement_V3(address, [prop]).Value = '';
				} else {
					applicationUIService.findElementInElement_V3(address, [prop]).$ = '';
				}
			};
		}
	}
	
	//for privacy policy GCS
	$scope.getPDPAInfo = function(){
		pdpaUIService.findDocumentToEdit_V3($scope.resourceURL,undefined, applicationUIService.PDPAId).then(function (data){
			var PAPAObj = data;
			var PrivacyPolicy = applicationUIService.findElementInDetail_V3(['PrivacyPolicy']);
			
			
			applicationUIService.findElementInDetail_V3(['PrivacyPolicy', 'ReceiveInformation']).Value = applicationUIService.findElementInElement_V3(PAPAObj, ['Consent']).Value;
			
			var CommunicationChannel= applicationUIService.convertToArray(angular.copy(applicationUIService.findElementInElement_V3(PAPAObj, ['CommunicationChannel'])));
			
			for(var i=0; i<CommunicationChannel.length; i++){
				if (applicationUIService.findElementInElement_V3(CommunicationChannel[i], ['CommunicationChannelValue'])['@channelType'] == 'PHONE'){
					applicationUIService.findElementInDetail_V3(['PrivacyPolicy', 'VoiceCall']).Value = applicationUIService.findElementInElement_V3(CommunicationChannel[i], ['CommunicationChannelValue']).Value;
				}
				var channel = applicationUIService.findElementInElement_V3(CommunicationChannel[i], ['CommunicationChannelValue'])['@channelType'];
				switch(channel) {
			    case 'PHONE':
			    	applicationUIService.findElementInDetail_V3(['PrivacyPolicy', 'VoiceCall']).Value = applicationUIService.findElementInElement_V3(CommunicationChannel[i], ['CommunicationChannelValue']).Value;
			        break;
			    case 'SMS':
			    	applicationUIService.findElementInDetail_V3(['PrivacyPolicy', 'TextMessage']).Value = applicationUIService.findElementInElement_V3(CommunicationChannel[i], ['CommunicationChannelValue']).Value;
			        break;
			    case 'FAX':
			    	applicationUIService.findElementInDetail_V3(['PrivacyPolicy', 'FaxMessage']).Value = applicationUIService.findElementInElement_V3(CommunicationChannel[i], ['CommunicationChannelValue']).Value;
			        break;
			    case 'MAIL':
			    	applicationUIService.findElementInDetail_V3(['PrivacyPolicy', 'EMail']).Value = applicationUIService.findElementInElement_V3(CommunicationChannel[i], ['CommunicationChannelValue']).Value;
			        break;
			    case 'EMAIL':
			    	applicationUIService.findElementInDetail_V3(['PrivacyPolicy', 'DirectMail']).Value = applicationUIService.findElementInElement_V3(CommunicationChannel[i], ['CommunicationChannelValue']).Value;
			        break;

				}
				
			}
		});
	}
	
	//set PDPA consent to appliaction
	$scope.getPDPAInfo_MNC = function(){
		if (applicationUIService.PDPAId){
			pdpaUIService.findDocumentToEdit_V3($scope.resourceURL,undefined, applicationUIService.PDPAId).then(function (data){
				applicationUIService.findElementInDetail_V3(['PrivacyPolicyAndDeclaration', 'Consent']).Value = applicationUIService.findElementInElement_V3(data, ['Consent']).Value;
			});
		}
	}
	//$scope.getAddressList();
	
	// import CORRESPONDENCE Address
	$scope.importAddress= function(address) {
		applicationUIService.clearDataInJson(applicationUIService.findElementInDetail_V3(['CorrespondenceAddress']));
		var addressObj = address;
		var addressInApplication = applicationUIService.findElementInDetail_V3(['CorrespondenceAddress']);
		for (var prop in addressInApplication) {
			var addressProp = applicationUIService.findElementInElement_V3(addressObj, [prop]);
			if (commonService.hasValueNotEmpty(addressProp)) {
				var value =  addressProp.Value;
				var string =  addressProp.$;
				if (commonService.hasValueNotEmpty(value) || commonService.hasValueNotEmpty(string)) {
					if (commonService.hasValueNotEmpty(value)) {
						applicationUIService.findElementInDetail_V3(['CorrespondenceAddress', prop]).Value = value;
					} else {
						applicationUIService.findElementInDetail_V3(['CorrespondenceAddress', prop]).$ = string;
					}
				}
			}
		}
	};
	
	// import Address for PO (cashback saver) and RUL
	$scope.importAddressGCS= function(address){
		var addressObj = address;
		var addressInApplication = applicationUIService.findElementInDetail_V3(['MailingAddress']);
		for (var prop in addressInApplication) {
			var addressProp = applicationUIService.findElementInElement_V3(addressObj, [prop]);
			if (commonService.hasValueNotEmpty(addressProp)) {
				var value =  addressProp.Value;
				var string =  addressProp.$;
				if (commonService.hasValueNotEmpty(value) || commonService.hasValueNotEmpty(string)) {
					if (commonService.hasValueNotEmpty(value)) {
						applicationUIService.findElementInDetail_V3(['MailingAddress', prop]).Value = value;
					} else {
						applicationUIService.findElementInDetail_V3(['MailingAddress', prop]).$ = string;
					}
				}
			}
		}
	};
	
	//  import CORRESPONDENCE Address for renewal case
	$scope.getAddressListToImport = function(){
		if (!commonService.hasValueNotEmpty($scope.addressList)){
			$scope.addressList = [];
			var index =[];
			var correspondenceAddress = angular.copy(applicationUIService.findElementInDetail_V3(['CorrespondenceAddress']));
			$scope.addressList.push(correspondenceAddress);
			var addresses= applicationUIService.convertToArray(angular.copy(applicationUIService.findElementInDetail_V3(['NonPrimaryAddress'])));
			var counter = applicationUIService.findElementInDetail_V3(['NonPrimaryAddress'])['@counter'];
			for (var i=0; i< Number(counter); i++){
				for (var prop in addresses[i]){
					if (prop != 'AddressType'){
						var value =  applicationUIService.findElementInElement_V3(addresses[i], [prop]).Value;
						var string =  applicationUIService.findElementInElement_V3(addresses[i], [prop]).$;
						if (value != undefined || string != undefined){
							if (applicationUIService.findElementInElement_V3(correspondenceAddress, [prop]).Value == value &&
								applicationUIService.findElementInElement_V3(correspondenceAddress, [prop]).Value != undefined && value != undefined)	{
								index[i] = i;
								continue;
							}
							else if (applicationUIService.findElementInElement_V3(correspondenceAddress, [prop]).$ == string &&
									applicationUIService.findElementInElement_V3(correspondenceAddress, [prop]).$!= undefined && string != undefined){
								index[i] = i;
								continue;
							}
							else{
								index.splice(i,1);
								break;
							}
						}
					}
				}
			}
			
			for (var j=0; j<Number(counter); j++){  
				if (index[j]==undefined){
					$scope.addressList.push(addresses[j]);
				}
				delete addresses[j].$$hashKey;
			}
			delete applicationUIService.findElementInDetail_V3(['CorrespondenceAddress']).$$hashKey;
		}
	}
	// get Prospect List in Case
	$scope.getProspectList = function(){
		var prospectInSC = salecaseUIService.findElementInDetail_V3(['Prospect']);
		if (prospectInSC != undefined && prospectInSC.length != undefined){
			salecaseUIService.chosenProspectList=[];
			prospectPersonalUIService.getDocumentList_V3($scope.resourceURL).then(function(prospectList) {
				salecaseUIService.prospectList = prospectPersonalUIService.findElementInElement_V3(prospectList, ['MetadataDocument']);
				if (!$.isArray(salecaseUIService.prospectList)){
					var temp = salecaseUIService.prospectList;
					salecaseUIService.prospectList = [];
					salecaseUIService.prospectList.push(temp);
				}
				for(var i =0; i<prospectInSC.length;i++ ){
					for( var j=0;j<salecaseUIService.prospectList.length; j++){
						if (prospectInSC[i]['@refUid'] == salecaseUIService.prospectList[j].DocId ){
							salecaseUIService.chosenProspectList.push(salecaseUIService.prospectList[j]);
						}
					}
				}
				applicationUIService.chosenProspectList = salecaseUIService.chosenProspectList;
			});
		}
	}
	// get Corporate List in Case - for Group travel
	$scope.getCorporateList = function(){
		var corporateInSC = salecaseUIService.findElementInDetail_V3(['Prospect']);
		if (corporateInSC != undefined && corporateInSC.length != undefined){
			salecaseUIService.chosenCorporateList=[];
			prospectCorporateUIService.getDocumentList_V3($scope.resourceURL).then(function(corporateList) {
				salecaseUIService.corporateList = prospectCorporateUIService.findElementInElement_V3(corporateList, ['MetadataDocument']);
				if (!$.isArray(salecaseUIService.corporateList)){
					var temp = salecaseUIService.corporateList;
					salecaseUIService.corporateList = [];
					salecaseUIService.corporateList.push(temp);
				}
				for(var i =0; i<corporateInSC.length;i++ ){
					for( var j=0;j<salecaseUIService.corporateList.length; j++){
						if (corporateInSC[i]['@refUid'] == salecaseUIService.corporateList[j].DocId ){
							salecaseUIService.chosenCorporateList.push(salecaseUIService.corporateList[j]);
						}
					}
				}
				applicationUIService.chosenCorporateList = salecaseUIService.chosenCorporateList;
			});
		}
	}
	if (salecaseUIService.findElementInDetail_V3(['@channel']) != 'DS') {		
		if (applicationUIService.productName == commonService.CONSTANTS.PRODUCT.GROUP_TRAVEL_EXPRESS) {
			$scope.getCorporateList();
		} else {
			$scope.getProspectList();
		}
	}
	
	
	//copy information for GCS and TLS
	$scope.copyPOInformation = function(){

			//copy replacement question to Life Assured
    		applicationUIService.findElementInDetail_V3(['LifeAssuredDetails', 'ReplacementAndExistingInsurancePolicyDetails', 'ReplacementQ1', 'ReplacementQKey']).$ = applicationUIService.findElementInDetail_V3(['PolicyOwnerDetails', 'ReplacementAndExistingInsurancePolicyDetails', 'ReplacementQ1', 'ReplacementQKey']).$;
    		applicationUIService.findElementInDetail_V3(['LifeAssuredDetails', 'ReplacementAndExistingInsurancePolicyDetails', 'ReplacementQ1', 'ReplacementQValue']).Value = applicationUIService.findElementInDetail_V3(['PolicyOwnerDetails', 'ReplacementAndExistingInsurancePolicyDetails', 'ReplacementQ1', 'ReplacementQValue']).Value;
    		applicationUIService.findElementInDetail_V3(['LifeAssuredDetails', 'ReplacementAndExistingInsurancePolicyDetails', 'ReplacementQ2', 'ReplacementQKey']).$ = applicationUIService.findElementInDetail_V3(['PolicyOwnerDetails', 'ReplacementAndExistingInsurancePolicyDetails', 'ReplacementQ2', 'ReplacementQKey']).$;
    		applicationUIService.findElementInDetail_V3(['LifeAssuredDetails', 'ReplacementAndExistingInsurancePolicyDetails', 'ReplacementQ2', 'ReplacementQValue']).Value= applicationUIService.findElementInDetail_V3(['PolicyOwnerDetails', 'ReplacementAndExistingInsurancePolicyDetails', 'ReplacementQ2', 'ReplacementQValue']).Value;
    		applicationUIService.findElementInDetail_V3(['LifeAssuredDetails', 'ReplacementAndExistingInsurancePolicyDetails', 'ReplacementQ3', 'ReplacementQKey']).$ = applicationUIService.findElementInDetail_V3(['PolicyOwnerDetails', 'ReplacementAndExistingInsurancePolicyDetails', 'ReplacementQ3', 'ReplacementQKey']).$;
    		applicationUIService.findElementInDetail_V3(['LifeAssuredDetails', 'ReplacementAndExistingInsurancePolicyDetails', 'ReplacementQ3', 'ReplacementQValue']).Value= applicationUIService.findElementInDetail_V3(['PolicyOwnerDetails', 'ReplacementAndExistingInsurancePolicyDetails', 'ReplacementQ3', 'ReplacementQValue']).Value;
    		applicationUIService.findElementInDetail_V3(['LifeAssuredDetails', 'ReplacementAndExistingInsurancePolicyDetails', 'ReplacementQ4', 'ReplacementQKey']).$= applicationUIService.findElementInDetail_V3(['PolicyOwnerDetails', 'ReplacementAndExistingInsurancePolicyDetails', 'ReplacementQ4', 'ReplacementQKey']).$;
    		applicationUIService.findElementInDetail_V3(['LifeAssuredDetails', 'ReplacementAndExistingInsurancePolicyDetails', 'ReplacementQ4', 'ReplacementQValue']).Value= applicationUIService.findElementInDetail_V3(['PolicyOwnerDetails', 'ReplacementAndExistingInsurancePolicyDetails', 'ReplacementQ4', 'ReplacementQValue']).Value;
    		applicationUIService.findElementInDetail_V3(['LifeAssuredDetails', 'ReplacementAndExistingInsurancePolicyDetails', 'ReplacementQ5', 'ReplacementQKey']).$= applicationUIService.findElementInDetail_V3(['PolicyOwnerDetails', 'ReplacementAndExistingInsurancePolicyDetails', 'ReplacementQ5', 'ReplacementQKey']).$;
    		applicationUIService.findElementInDetail_V3(['LifeAssuredDetails', 'ReplacementAndExistingInsurancePolicyDetails', 'ReplacementQ5', 'ReplacementQValue']).Value= applicationUIService.findElementInDetail_V3(['PolicyOwnerDetails', 'ReplacementAndExistingInsurancePolicyDetails', 'ReplacementQ5', 'ReplacementQValue']).Value;
    		
    		//copy residency question to Life Assured
    		var POResidencyOjb = $scope.moduleService.findElementInDetail_V3(['PolicyOwnerDetails', 'ResidencyQuestion']);
    		var LIResidencyOjb = $scope.moduleService.findElementInDetail_V3(['LifeAssuredDetails', 'ResidencyQuestion']);
			var i = 0;
			for(i; i < POResidencyOjb.length; i++){
				$scope.moduleService.findElementInElement_V3(LIResidencyOjb[i], ['ResidencyQValue']).Value = $scope.moduleService.findElementInElement_V3(POResidencyOjb[i], ['ResidencyQValue']).Value;
				$scope.moduleService.findElementInElement_V3(LIResidencyOjb[i], ['ResidencyQIndex']).Value = $scope.moduleService.findElementInElement_V3(POResidencyOjb[i], ['ResidencyQIndex']).Value;
			}

 
	};
	
	
	/**
	 * @author nnguyen75
	 * 2016.03.25
	 * Populate information of prospect to PO
	 */
	$scope.populateProspectInfo = function() {
		
		var poInfor = 'PolicyOwnerInformation';
		
		var P = prospectPersonalUIService.findElementInDetail_V3(['Personal']);
		var PO = applicationUIService.findElementInDetail_V3([poInfor]);
		for (var prop in P) {
			var value =  prospectPersonalUIService.findElementInDetail_V3([prop]).Value;
			var string =  prospectPersonalUIService.findElementInDetail_V3([prop]).$;
			if (commonService.hasValueNotEmpty(value) || commonService.hasValueNotEmpty(string)) {
				if (commonService.hasValueNotEmpty(value)) {
					applicationUIService.findElementInElement_V3(PO, [prop]).Value = value;
				} else {
					applicationUIService.findElementInElement_V3(PO, [prop]).$ = string;
				}
			};
		};
		applicationUIService.findElementInDetail_V3([poInfor, 'IDType']).Value = prospectPersonalUIService.findElementInDetail_V3(['IDType']).Value;
		applicationUIService.findElementInDetail_V3([poInfor, 'IDNumber']).$ = prospectPersonalUIService.findElementInDetail_V3(['IDNumber']).$;
		applicationUIService.findElementInDetail_V3([poInfor, 'FullName']).$ = prospectPersonalUIService.findElementInDetail_V3(['FullName']).$;
		/* Import contacts */
		var prospectContacts = prospectPersonalUIService.findElementInDetail_V3(['Contacts']);
		var POContacts = applicationUIService.findElementInDetail_V3([poInfor, 'Contacts']);
		for (var prop in prospectContacts) {
			var string =  prospectPersonalUIService.findElementInDetail_V3([prop]).$;
			if (commonService.hasValueNotEmpty(string)) {
				applicationUIService.findElementInElement_V3(POContacts, [prop]).$ = string;
			}
		};
		/* Import primary address */
		var prospectPAddress = prospectPersonalUIService.findElementInDetail_V3(['PrimaryAddress']);
		var POPAdresss = applicationUIService.findElementInDetail_V3([poInfor, 'PrimaryAddress']);
		for (var prop in prospectPAddress) {
			var value =  prospectPersonalUIService.findElementInDetail_V3([prop]).Value;
			var string =  prospectPersonalUIService.findElementInDetail_V3([prop]).$;
			if (commonService.hasValueNotEmpty(value) || commonService.hasValueNotEmpty(string)) {
				if (commonService.hasValueNotEmpty(value)) {
					applicationUIService.findElementInElement_V3(POPAdresss, [prop]).Value = value;
				} else {
					applicationUIService.findElementInElement_V3(POPAdresss, [prop]).$ = string;
				}
			};
		};
		/* Import non primary addresses */
		var counterA = prospectPersonalUIService.findElementInDetail_V3(['NonPrimaryAddresses'])['@counter'];
		var counterAInPO = applicationUIService.findElementInDetail_V3([poInfor, 'NonPrimaryAddresses'])['@counter'];
		if (commonService.hasValueNotEmpty(counterAInPO)) {
	        counterA = Number(counterA);
	        counterAInPO = Number(counterAInPO);
	        applicationUIService.convertObjectToArray(applicationUIService.detail, [poInfor, 'NonPrimaryAddresses', 'NonPrimaryAddress']);
	        prospectPersonalUIService.convertObjectToArray(prospectPersonalUIService.detail, ['NonPrimaryAddresses', 'NonPrimaryAddress']);
	        var prospectNonPrimaryAddresses = prospectPersonalUIService.findElementInDetail_V3(['NonPrimaryAddress']);
	        var pONonPrimaryAddresses = applicationUIService.findElementInDetail_V3([poInfor, 'NonPrimaryAddresses', 'NonPrimaryAddress']);
	        // remove Address element when trying to import many times with many size of Address
	        if (counterAInPO > counterA ){
	        	var range = (counterAInPO - counterA);
	        	for( var r = 0; r < range; r++){
	        		applicationUIService.removeElementInElement_V3(r, applicationUIService.detail, [poInfor, 'NonPrimaryAddresses'], [poInfor, 'NonPrimaryAddresses', 'NonPrimaryAddress']);
	        	}
	        }
	        // if Address in Prospect is available
	        if (counterA > 0) {
	            for (var i = 0; Number(applicationUIService.findElementInDetail_V3([poInfor, 'NonPrimaryAddresses'])['@counter']) < counterA; i++) {
	                applicationUIService.addElementInElement_V3(applicationUIService.detail, [poInfor, 'NonPrimaryAddresses'], [poInfor, 'NonPrimaryAddresses', 'NonPrimaryAddress']);
	            }
	            for (var i = 0; i < counterA; i++) {
	            	for (var prop in pONonPrimaryAddresses[i]) {
	        			var npProp = prospectPersonalUIService.findElementInElement_V3(prospectNonPrimaryAddresses[i], [prop]);
	        			if (npProp != undefined) {
	        				if (commonService.hasValueNotEmpty(npProp.Value)) {
	        					applicationUIService.findElementInElement_V3(pONonPrimaryAddresses[i], [prop]).Value = npProp.Value;
	        				} else if (commonService.hasValueNotEmpty(npProp.$)) {
	        					applicationUIService.findElementInElement_V3(pONonPrimaryAddresses[i], [prop]).$ = npProp.$;
	        				}
	        			}
	            	}
//	                applicationUIService.findElementInElement_V3(pONonPrimaryAddresses[i], ['AddressType']).Value = prospectPersonalUIService.findElementInElement_V3(prospectNonPrimaryAddresses[i], ['AddressType']).Value;
//	                applicationUIService.findElementInElement_V3(pONonPrimaryAddresses[i], ['BlkHouseNo']).$ = prospectPersonalUIService.findElementInElement_V3(prospectNonPrimaryAddresses[i], ['BlkHouseNo']).$;
//	                applicationUIService.findElementInElement_V3(pONonPrimaryAddresses[i], ['Street']).$ = prospectPersonalUIService.findElementInElement_V3(prospectNonPrimaryAddresses[i], ['Street']).$;
//	                applicationUIService.findElementInElement_V3(pONonPrimaryAddresses[i], ['UnitNo']).$ = prospectPersonalUIService.findElementInElement_V3(prospectNonPrimaryAddresses[i], ['UnitNo']).$;
//	                applicationUIService.findElementInElement_V3(pONonPrimaryAddresses[i], ['Building']).$ = prospectPersonalUIService.findElementInElement_V3(prospectNonPrimaryAddresses[i], ['Building']).$;
//	                applicationUIService.findElementInElement_V3(pONonPrimaryAddresses[i], ['City']).$ = prospectPersonalUIService.findElementInElement_V3(prospectNonPrimaryAddresses[i], ['City']).$;
//	                applicationUIService.findElementInElement_V3(pONonPrimaryAddresses[i], ['Country']).Value = prospectPersonalUIService.findElementInElement_V3(prospectNonPrimaryAddresses[i], ['Country']).Value;
//	                applicationUIService.findElementInElement_V3(pONonPrimaryAddresses[i], ['Postal']).$ = prospectPersonalUIService.findElementInElement_V3(prospectNonPrimaryAddresses[i], ['Postal']).$;
	            }
	        }
	        applicationUIService.findElementInDetail_V3([poInfor, 'NonPrimaryAddresses'])['@counter'] = (applicationUIService.findElementInDetail_V3(['PolicyOwnerInformation', 'NonPrimaryAddresses'])['@counter']).toString();
		}
	}
	
	$scope.importProspect = function(prospectDocId){
		prospectPersonalUIService.findDocument_V3($scope.resourceURL, prospectDocId).then(function(data){
    		// get address list from prospect that was imported into PO
			applicationUIService.findElementInDetail_V3(['PolicyOwnerInformation'])['@refUid'] = prospectDocId;
			$scope.populateProspectInfo();
			$scope.getNonPrimaryAddressList();
//    		$scope.getAddressList(prospectDocId);
            
            $scope.reSetupConcreteUiStructure(applicationUIService.detail, true); // refresh the values in multiple cards
		});
	};
	
	//for Group-travel
	$scope.importCorporate = function(CorporateDocId){
		prospectCorporateUIService.findDocument_V3($scope.resourceURL, CorporateDocId).then(function(data){
    		// get address list from prospect that was imported into PO
			applicationUIService.findElementInDetail_V3(['PolicyOwnerInformation'])['@refUid'] = CorporateDocId;
			$scope.populateCorporateInfo();
			$scope.getCorporateAddressList();
//    		$scope.getAddressList(prospectDocId);
            
            $scope.reSetupConcreteUiStructure(applicationUIService.detail, true); // refresh the values in multiple cards
		});
	};
	
	//get Corporate Address List
	$scope.getCorporateAddressList = function() {
		var prospectBusinessAddress = prospectCorporateUIService.findElementInDetail_V3(['BusinessAddress']);
		var businessAddress = applicationUIService.findElementInDetail_V3(['PolicyOwnerInformation', 'Addresses', 'BusinessAddress']);
		for (var prop in prospectBusinessAddress) {
			var value =  prospectCorporateUIService.findElementInDetail_V3(['BusinessAddress', prop]).Value;
			var string =  prospectCorporateUIService.findElementInDetail_V3(['BusinessAddress', prop]).$;
			if (commonService.hasValueNotEmpty(value) || commonService.hasValueNotEmpty(string)) {
				if (commonService.hasValueNotEmpty(value)) {
					applicationUIService.findElementInElement_V3(businessAddress, [prop]).Value = value;
				} else {
					applicationUIService.findElementInElement_V3(businessAddress, [prop]).$ = string;
				}
			};
		};
		var prospectRegisteredAddress = prospectCorporateUIService.findElementInDetail_V3(['RegisteredAddress']);
		var registeredAddress = applicationUIService.findElementInDetail_V3(['PolicyOwnerInformation', 'Addresses', 'RegisteredAddress']);
		for (var prop in prospectRegisteredAddress) {
			var value =  prospectCorporateUIService.findElementInDetail_V3(['RegisteredAddress', prop]).Value;
			var string =  prospectCorporateUIService.findElementInDetail_V3(['RegisteredAddress', prop]).$;
			if (commonService.hasValueNotEmpty(value) || commonService.hasValueNotEmpty(string)) {
				if (commonService.hasValueNotEmpty(value)) {
					applicationUIService.findElementInElement_V3(registeredAddress, [prop]).Value = value;
				} else {
					applicationUIService.findElementInElement_V3(registeredAddress, [prop]).$ = string;
				}
			};
		};
		var prospectMailingAddress = prospectCorporateUIService.findElementInDetail_V3(['MailingAddress']);
		var mailingAddress = applicationUIService.findElementInDetail_V3(['PolicyOwnerInformation', 'Addresses', 'MailingAddress']);
		for (var prop in prospectMailingAddress) {
			var value =  prospectCorporateUIService.findElementInDetail_V3(['MailingAddress', prop]).Value;
			var string =  prospectCorporateUIService.findElementInDetail_V3(['MailingAddress', prop]).$;
			if (commonService.hasValueNotEmpty(value) || commonService.hasValueNotEmpty(string)) {
				if (commonService.hasValueNotEmpty(value)) {
					applicationUIService.findElementInElement_V3(mailingAddress, [prop]).Value = value;
				} else {
					applicationUIService.findElementInElement_V3(mailingAddress, [prop]).$ = string;
				}
			};
		};
	
//		$scope.corporateAddressList.push(prospectBusinessAddress, prospectRegisteredAddress, prospectMailingAddress); //address list
//		for(var i = 0; i < $scope.corporateAddressList.length; i++){
//			$scope.corporateAddressList[i].blkAndStreet = {};
//			$scope.corporateAddressList[i].blkAndStreet.$ = prospectCorporateUIService.findElementInElement_V3($scope.corporateAddressList[i], ['BlkHouseNo']).$  + " - " + prospectCorporateUIService.findElementInElement_V3($scope.corporateAddressList[i], ['Street']).$ ;
//		}

		$scope.getCorrespondenceAddressOfCorporate();
	}
	
	//get Corporate Address List
	$scope.getCorrespondenceAddressOfCorporate = function() {
		var prospectBusinessAddress = prospectCorporateUIService.findElementInDetail_V3(['BusinessAddress']);
		var prospectRegisteredAddress = prospectCorporateUIService.findElementInDetail_V3(['RegisteredAddress']);
		var prospectMailingAddress = prospectCorporateUIService.findElementInDetail_V3(['MailingAddress']);
		$scope.corporateAddressList = [];
		if (prospectCorporateUIService.findElementInElement_V3(prospectBusinessAddress, ['BlkHouseNo']).$ != undefined
			&& prospectCorporateUIService.findElementInElement_V3(prospectBusinessAddress, ['BlkHouseNo']).$ != ''
			&& prospectCorporateUIService.findElementInElement_V3(prospectBusinessAddress, ['Street']).$ != undefined
			&& prospectCorporateUIService.findElementInElement_V3(prospectBusinessAddress, ['Street']).$ != '') {
			$scope.corporateAddressList.push(prospectBusinessAddress);
		}
		if (prospectCorporateUIService.findElementInElement_V3(prospectRegisteredAddress, ['BlkHouseNo']).$ != undefined
			&& prospectCorporateUIService.findElementInElement_V3(prospectRegisteredAddress, ['BlkHouseNo']).$ != ''
			&& prospectCorporateUIService.findElementInElement_V3(prospectRegisteredAddress, ['Street']).$ != undefined
			&& prospectCorporateUIService.findElementInElement_V3(prospectRegisteredAddress, ['Street']).$ != '') {
			$scope.corporateAddressList.push(prospectRegisteredAddress);
		}
		if (prospectCorporateUIService.findElementInElement_V3(prospectMailingAddress, ['BlkHouseNo']).$ != undefined
			&& prospectCorporateUIService.findElementInElement_V3(prospectMailingAddress, ['BlkHouseNo']).$ != ''
			&& prospectCorporateUIService.findElementInElement_V3(prospectMailingAddress, ['Street']).$ != undefined
			&& prospectCorporateUIService.findElementInElement_V3(prospectMailingAddress, ['Street']).$ != '') {
			$scope.corporateAddressList.push(prospectMailingAddress);
		}
		for(var i = 0; i < $scope.corporateAddressList.length; i++){
			$scope.corporateAddressList[i].blkAndStreet = {};
			$scope.corporateAddressList[i].blkAndStreet.$ = prospectCorporateUIService.findElementInElement_V3($scope.corporateAddressList[i], ['BlkHouseNo']).$  + " - " + prospectCorporateUIService.findElementInElement_V3($scope.corporateAddressList[i], ['Street']).$ ;
		}
	}

	/**
	 * @author vduong5
	 * 2016.07.14
	 * Populate information of corporate to PO of application and get list Address (Group-travel) 
	 */
	$scope.populateCorporateInfo = function() {
		var P = prospectCorporateUIService.findElementInDetail_V3(['Organization', 'BasicInfomation']);
		var PO = applicationUIService.findElementInDetail_V3(['PolicyOwnerInformation', 'BasicInfomation']);
		for (var prop in P) {
			var value =  prospectCorporateUIService.findElementInDetail_V3([prop]).Value;
			var string =  prospectCorporateUIService.findElementInDetail_V3([prop]).$;
			if (commonService.hasValueNotEmpty(value) || commonService.hasValueNotEmpty(string)) {
				if (commonService.hasValueNotEmpty(value)) {
					applicationUIService.findElementInElement_V3(PO, [prop]).Value = value;
				} else {
					applicationUIService.findElementInElement_V3(PO, [prop]).$ = string;
				}
			};
		};
		/* Import contacts */
		var prospectContacts = prospectCorporateUIService.findElementInDetail_V3(['Contact']);
		var POContacts = applicationUIService.findElementInDetail_V3(['PolicyOwnerInformation', 'Contact']);
		for (var prop in prospectContacts) {
			var string =  prospectCorporateUIService.findElementInDetail_V3([prop]).$;
			if (commonService.hasValueNotEmpty(string)) {
				applicationUIService.findElementInElement_V3(POContacts, [prop]).$ = string;
			}
		};
		/* Import addresses */
		
		
//		$scope.corporateAddressList.push.apply($scope.corporateAddressList, [businessAddress, registeredAddress, mailingAddress]); //address list
//		for(var i = 0; i < $scope.corporateAddressList.length; i++){
//			$scope.corporateAddressList[i].blkAndStreet = {};
//			$scope.corporateAddressList[i].blkAndStreet.$ = prospectCorporateUIService.findElementInElement_V3($scope.corporateAddressList[i], ['BlkHouseNo']).$  + " - " + prospectCorporateUIService.findElementInElement_V3($scope.corporateAddressList[i], ['Street']).$ ;
//		}
	}
		
	/**
	 * @author nnguyen75
	 * 2016.03.30
	 * Populate information of user to PO
	 */
	$scope.pushUserInfoIntoPO = function() {
		var P = userCoreService.findElementInElement_V3(salecaseUIService.userDoc, ['Person']);
		var PO = applicationUIService.findElementInDetail_V3(['PolicyOwnerInformation']);
		for (var prop in P) {
			var value = userCoreService.findElementInElement_V3(salecaseUIService.userDoc, [prop]).Value;
			var string = userCoreService.findElementInElement_V3(salecaseUIService.userDoc, [prop]).$;
			if (commonService.hasValueNotEmpty(value) || commonService.hasValueNotEmpty(string)) {
				var propValue = (prop.split(":"))[1];
				if (commonService.hasValueNotEmpty(applicationUIService.findElementInElement_V3(PO, [propValue]))) {
					if (commonService.hasValueNotEmpty(value)) {
						applicationUIService.findElementInElement_V3(PO, [propValue]).Value = value;
					} else {
						applicationUIService.findElementInElement_V3(PO, [propValue]).$ = string;
					}
				}
			};
		};
		applicationUIService.findElementInDetail_V3(['IDType']).Value = userCoreService.findElementInElement_V3(salecaseUIService.userDoc, ['IDType']).Value;
		applicationUIService.findElementInDetail_V3(['IDNumber']).$ = userCoreService.findElementInElement_V3(salecaseUIService.userDoc, ['IDNumber']).$;
		applicationUIService.findElementInDetail_V3(['Title']).Value = userCoreService.findElementInElement_V3(salecaseUIService.userDoc, ['Title']).Value;
		applicationUIService.findElementInDetail_V3(['SmokerStatus']).Value = userCoreService.findElementInElement_V3(salecaseUIService.userDoc, ['SmokerStatus']).Value;
		applicationUIService.findElementInDetail_V3(['FullName']).$ = userCoreService.findElementInElement_V3(salecaseUIService.userDoc, ['FullName']).$;
		/* Import contacts */
		var userContacts = userCoreService.findElementInElement_V3(salecaseUIService.userDoc, ['Contacts']);
		var POContacts = applicationUIService.findElementInDetail_V3(['PolicyOwnerInformation', 'Contacts']);
		for (var prop in userContacts) {
			var string = userCoreService.findElementInElement_V3(userContacts, [prop]).$
			if (commonService.hasValueNotEmpty(string)) {
				var propValue = (prop.split(":"))[1];
				applicationUIService.findElementInElement_V3(POContacts, [propValue]).$ = string;
			}
		};
		/* Import primary address */
		var userPAddress = userCoreService.findElementInElement_V3(salecaseUIService.userDoc, ['PrimaryAddress']);
		var POPAdresss = applicationUIService.findElementInDetail_V3(['PolicyOwnerInformation', 'PrimaryAddress']);
		for (var prop in userPAddress) {
			var value = userCoreService.findElementInElement_V3(userPAddress, [prop]).Value;
			var string = userCoreService.findElementInElement_V3(userPAddress, [prop]).$;
			if (commonService.hasValueNotEmpty(value) || commonService.hasValueNotEmpty(string)) {
				if (commonService.hasValueNotEmpty(value)) {
					applicationUIService.findElementInElement_V3(POPAdresss, [prop]).Value = value;
				} else {
					applicationUIService.findElementInElement_V3(POPAdresss, [prop]).$ = string;
				}
			};
		};
		/* Import non-primary addresses */
		var counterA = userCoreService.findElementInElement_V3(salecaseUIService.userDoc, ['NonPrimaryAddresses'])['@counter'];
		var counterAInPO = applicationUIService.findElementInDetail_V3(['PolicyOwnerInformation', 'NonPrimaryAddresses'])['@counter'];
		if (commonService.hasValueNotEmpty(counterAInPO)) {
	        counterA = Number(counterA);
	        counterAInPO = Number(counterAInPO);
	        applicationUIService.convertObjectToArray(applicationUIService.detail, ['PolicyOwnerInformation', 'NonPrimaryAddresses', 'NonPrimaryAddress']);
	        userCoreService.convertObjectToArray(salecaseUIService.userDoc, ['NonPrimaryAddresses', 'NonPrimaryAddress']);
	        var userNonPrimaryAddresses = userCoreService.findElementInElement_V3(salecaseUIService.userDoc, ['NonPrimaryAddress']);
	        var pONonPrimaryAddresses = applicationUIService.findElementInDetail_V3(['PolicyOwnerInformation', 'NonPrimaryAddresses', 'NonPrimaryAddress']);
	        // remove Address element when trying to import many times with many size of Address
	        if (counterAInPO > counterA ){
	        	var range = (counterAInPO - counterA);
	        	for( var r = 0; r < range; r++){
	        		applicationUIService.removeElementInElement_V3(r, applicationUIService.detail, ['PolicyOwnerInformation', 'NonPrimaryAddresses'], ['PolicyOwnerInformation', 'NonPrimaryAddresses', 'NonPrimaryAddress']);
	        	}
	        }
	        // if Address in Prospect is available
	        if (counterA > 0) {
	            for (var i = 0; Number(applicationUIService.findElementInDetail_V3(['PolicyOwnerInformation', 'NonPrimaryAddresses'])['@counter']) < counterA; i++) {
	                applicationUIService.addElementInElement_V3(applicationUIService.detail, ['PolicyOwnerInformation', 'NonPrimaryAddresses'], ['PolicyOwnerInformation', 'NonPrimaryAddresses', 'NonPrimaryAddress']);
	            }
	            for (var i = 0; i < counterA; i++) {
	            	for (var prop in pONonPrimaryAddresses[i]) {
	        			var npProp = userCoreService.findElementInElement_V3(userNonPrimaryAddresses[i], [prop]);
	        			if (npProp != undefined) {
	        				if (commonService.hasValueNotEmpty(npProp.Value)) {
	        					applicationUIService.findElementInElement_V3(pONonPrimaryAddresses[i], [prop]).Value = npProp.Value;
	        				} else if (commonService.hasValueNotEmpty(npProp.$)) {
	        					applicationUIService.findElementInElement_V3(pONonPrimaryAddresses[i], [prop]).$ = npProp.$;
	        				}
	        			}
	            	}
//	                applicationUIService.findElementInElement_V3(pONonPrimaryAddresses[i], ['AddressType']).Value = userCoreService.findElementInElement_V3(userNonPrimaryAddresses[i], ['AddressType']).Value;
//	                applicationUIService.findElementInElement_V3(pONonPrimaryAddresses[i], ['BlkHouseNo']).$ = userCoreService.findElementInElement_V3(userNonPrimaryAddresses[i], ['BlkHouseNo']).$;
//	                applicationUIService.findElementInElement_V3(pONonPrimaryAddresses[i], ['Street']).$ = userCoreService.findElementInElement_V3(userNonPrimaryAddresses[i], ['Street']).$;
//	                applicationUIService.findElementInElement_V3(pONonPrimaryAddresses[i], ['UnitNo']).$ = userCoreService.findElementInElement_V3(userNonPrimaryAddresses[i], ['UnitNo']).$;
//	                applicationUIService.findElementInElement_V3(pONonPrimaryAddresses[i], ['Building']).$ = userCoreService.findElementInElement_V3(userNonPrimaryAddresses[i], ['Building']).$;
//	                applicationUIService.findElementInElement_V3(pONonPrimaryAddresses[i], ['City']).$ = userCoreService.findElementInElement_V3(userNonPrimaryAddresses[i], ['City']).$;
//	                applicationUIService.findElementInElement_V3(pONonPrimaryAddresses[i], ['Country']).Value = userCoreService.findElementInElement_V3(userNonPrimaryAddresses[i], ['Country']).Value;
//	                applicationUIService.findElementInElement_V3(pONonPrimaryAddresses[i], ['Postal']).$ = userCoreService.findElementInElement_V3(userNonPrimaryAddresses[i], ['Postal']).$;
	            }
	        }
	        applicationUIService.findElementInDetail_V3(['PolicyOwnerInformation', 'NonPrimaryAddresses'])['@counter'] = (applicationUIService.findElementInDetail_V3(['PolicyOwnerInformation', 'NonPrimaryAddresses'])['@counter']).toString();
		}
		
//		$scope.reSetupConcreteUiStructure(applicationUIService.detail); // refresh the values in multiple cards
	}
	// end for Direct Sale
	
	// save detail application
    $scope.saveDetail = function( actionType ){
        actionType = actionType || 'newbussiness';
    	var deferred = applicationUIService.$q.defer();
    	//Make sure case ID and policyNo have values
    	if (applicationUIService.findElementInDetail_V3(['CaseID']).$ == undefined)
    		applicationUIService.findElementInDetail_V3(['CaseID']).$ = salecaseUIService.findElementInDetail_V3(['DocId']);
		if (applicationUIService.findElementInDetail_V3(['PolicyNo']).$ == undefined)
			applicationUIService.findElementInDetail_V3(['PolicyNo']).$ = salecaseUIService.findElementInDetail_V3(['PolicyNumber']).$;
    	

		
		if (applicationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.TERM_LIFE
				&& applicationUIService.productName != commonService.CONSTANTS.PRODUCT.REGULAR_UNIT_LINK){
			var POId = $scope.moduleService.findElementInDetail_V3(['PolicyOwnerInformation'])['@refUid'];
			var LIId = $scope.moduleService.findElementInDetail_V3(['LifeAssuredInformation'])['@refUid'];
			
			if (POId == LIId){
				/*$scope.moduleService.findElementInDetail_V3(['LifeAssuredInformation', 'ReplacementAndExistingInsurancePolicyDetails'])['@refUid']*/
				$scope.copyPOInformation();
			}
		}
		
		//For Unit Link product
		if (applicationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.UNIT_LINK
				|| applicationUIService.productName == commonService.CONSTANTS.PRODUCT.REGULAR_UNIT_LINK
				|| applicationUIService.productName == commonService.CONSTANTS.PRODUCT.ENDOWMENT){
			var POId = $scope.moduleService.findElementInDetail_V3(['ProporserInformation'])['@refUid'];
			var LIId = $scope.moduleService.findElementInDetail_V3(['LifeAssuredInformation'])['@refUid'];
			
			
			if (POId == LIId){
				//copy information from PO to LA
				 applicationUIService.copyInforFromSameStructureObj(undefined, applicationUIService.detail, ['UnderwritingDetailsOfProposer'], ['UnderwritingDetailsOfLifeAssured']);
				 applicationUIService.copyInforFromSameStructureObj(undefined, applicationUIService.detail, ['ProporserInformation'], ['LifeAssuredInformation']);
			}
		}

		
    	
		applicationUIService.saveDetail_V3($scope.resourceURL, true, undefined, undefined, undefined, actionType).then(function(data){
			if (applicationUIService.isSuccess(data)) {
				var docId = applicationUIService.findElementInDetail_V3(['DocId']);
				commonUIService.showNotifyMessage("v3.myworkspace.message.SaveApplicationSuccessfully", "success");
				// get data(to show premium) after save complete
				var doNothing = false;
				if(window.cordova){
				    doNothing = true;
				}
				applicationUIService.getDetail_V3($scope.resourceURL, undefined, doNothing).then(function(data){
					if (applicationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.UNIT_LINK
							|| applicationUIService.productName == commonService.CONSTANTS.PRODUCT.REGULAR_UNIT_LINK
							|| applicationUIService.productName == commonService.CONSTANTS.PRODUCT.ENDOWMENT){
						salecaseUIService.findElementInDetail_V3(['FirstPaymentMethod']).$ = $scope.moduleService.findElementInDetail_V3(['FirstPaymentMethod']).Value;
						salecaseUIService.findElementInDetail_V3(['RenewalPaymentMethod']).$ = $scope.moduleService.findElementInDetail_V3(['RenewalPaymentMethod']).Value;
						salecaseUIService.findElementInDetail_V3(['InsuredAge']).$ = $scope.moduleService.findElementInDetail_V3(['LifeAssuredInformation','Personal','Age']).$;
					}
					
					//push application to salecase only first time saev successfully
					if (!salecaseUIService.findElementInDetail_V3(['ApplicationId']).$){
						// push docID into Case
						salecaseUIService.findElementInDetail_V3(['Application'])['@refUid'] = docId;
		
						salecaseUIService.findElementInDetail_V3(['ApplicationId']).$ = docId;
						// push Prospect(Policy Owner) into Case
						var policyOwner = applicationUIService.findElementInDetail_V3(['PolicyOwnerInformation']);
						if (policyOwner){
							var prospectsInSC = salecaseUIService.findElementInDetail_V3(['Prospect']);
							for( var i=0; i<prospectsInSC.length; i++){
								if (prospectsInSC[i]['@refUid'] == policyOwner['@refUid']){
									salecaseUIService.findElementInElement_V3(prospectsInSC[i], ['ProspectRole']).$ = 'PO';
								}
							}
						}

						salecaseUIService.isShowUnAcceptButton = false;				
						salecaseUIService.saveDetail_V3($scope.resourceURL, false).then(function(){ 
							// force set salecase validstatus if save application successful
							$scope.reSetupConcreteUiStructure(applicationUIService.detail);
							$scope.initScopeRul();//binding data for application after resetup
							$scope.markValidCard($scope.getAssociateUiStructureRoot())
							$scope.card.validStatus = $scope.getAssociateUiStructureRoot().validStatus;
							var salecaseCtrl = $scope.getParentCtrlInCharge();
							salecaseCtrl.uiStructureRoot.validStatus = 'VALID';
							
							deferred.resolve(data);
						});	
					} else{
						salecaseUIService.isShowUnAcceptButton = false;
						$scope.reSetupConcreteUiStructure(applicationUIService.detail);
						$scope.initScopeRul();//binding data for application after resetup
						$scope.markValidCard($scope.getAssociateUiStructureRoot())
						$scope.card.validStatus = $scope.getAssociateUiStructureRoot().validStatus;
						var salecaseCtrl = $scope.getParentCtrlInCharge();
						salecaseCtrl.uiStructureRoot.validStatus = 'VALID';
						
						deferred.resolve(data);
					}		
				});
			} else {				
				 // Appending dialog to document.body to cover sidenav in docs app
				applicationUIService.findElementInDetail_V3(['DocStatus'])['DocumentStatus'] = "INVALID";
				var confirm = $mdDialog.confirm()
					  .title($filter('translate')("MSG-FQ06"))
					  .ok($filter('translate')("v3.yesno.enum.Y"))
	   			      .cancel($filter('translate')("v3.yesno.enum.N"));
				$mdDialog.show(confirm).then(function() {
					applicationUIService.saveDetail_V3($scope.resourceURL, false).then(function(data){
						commonUIService.showNotifyMessage("v3.mynewworkspace.message.SaveDraftApplicationSuccessfully", "success");
						// set Application docId into Case 
						var docId = applicationUIService.findElementInDetail_V3(['DocId']);
						salecaseUIService.findElementInDetail_V3(['Application'])['@refUid'] = docId;
						salecaseUIService.findElementInDetail_V3(['ApplicationId']).$ = docId;
						salecaseUIService.saveDetail_V3($scope.resourceURL, false).then(function(data){
							$log.debug("Pushed application docId into Case ");
						});
						$scope.reSetupConcreteUiStructure(applicationUIService.detail); // refresh the values in multiple cards
						$scope.initScopeRul();//binding data for application after resetup
					});
				}, function() {
					$scope.reSetupConcreteUiStructure(applicationUIService.detail); // refresh the values in multiple cards
					$scope.initScopeRul();//binding data for application after resetup
				});
				deferred.resolve(data);
			}
		});
    	return deferred.promise;
    };
    
    // set counter = 1 to visible contact in PO
    $scope.addContactForPO = function(){
		applicationUIService.findElementInDetail_V3(['PolicyOwnerInformation', 'Contacts'])['@counter'] = 1;
		applicationUIService.jsonToArray(applicationUIService.detail, ['PolicyOwnerInformation', 'Contacts'], 'person:Contact');
    	// filter contact type = 4 types
    	applicationUIService.contactLazyList(applicationUIService.detail);
    };
    
    // add clause in fire application
    $scope.addClause = function(){
    	applicationUIService.findElementInDetail_V3(['Clauses'])['@counter'] = 1;
    	applicationUIService.jsonToArray(applicationUIService.detail, 'Clauses', 'application-fire:Clause');
    };

    $scope.importClient = function(client, detail){
    	applicationUIService.findElementInElement_V3(detail, ['ClientNumber']).$ = client.Value;
    	var group = applicationUIService.findGroupInMapListByValue(applicationUIService.lazyChoiceList, 'ClientName', client.Value);
    	applicationUIService.findElementInElement_V3(detail, ['ClientName']).Value = group;
    };
    
    $scope.importClause = function(clause){
    	/*applicationUIService.jsonToArray(applicationUIService.detail, 'Clauses', 'application-fire:Clause');*/
    	applicationUIService.convertObjectToArray(applicationUIService.detail, ['Clauses', 'Clause']);
    	applicationUIService.addElementInElement_V3(applicationUIService.detail, ['Clauses'], ['Clause']);
    	var length = applicationUIService.findElementInDetail_V3(['Clause']).length;
    	var lastestClause =  applicationUIService.findElementInDetail_V3(['Clause'])[length-1];
    	applicationUIService.findElementInElement_V3(lastestClause,['ClauseCode']).Value = clause.Value;
    };
    
    $scope.removeClause = function(index,data,elements,element){			
		var eles = applicationUIService.findElementInElement_V3(data, element);
		if (applicationUIService.findElementInElement_V3(data, elements)['@counter']!=""){
    		var counter = parseInt(applicationUIService.findElementInElement_V3(data, elements)['@counter']);
    	}else{
    		var counter = 0;
    	};	
		if (eles.length > 1){
			eles.splice(index, 1);
			applicationUIService.findElementInElement_V3(data,elements)['@counter']
			=counter - 1;
		}else{
			applicationUIService.findElementInElement_V3(data,elements)['@counter'] = 0;
		}	
	};
    
    // push data from prospect into PO 
    /*$rootScope.$on("saveProspect", function(event, data){
    	if (data[0] == "application"){
    		$log.debug("push data from prospect into PO in application...");
    		var P = prospectPersonalUIService.findElementInDetail_V3(['Personal']);
    		var PO = applicationUIService.findElementInDetail_V3(['PolicyOwnerInformation']);
    		for(var prop in P) {
    			var value =  prospectPersonalUIService.findElementInDetail_V3([prop]).Value;
    			var string =  prospectPersonalUIService.findElementInDetail_V3([prop]).$;
    			if (value != undefined || string != undefined){
    				if (value != undefined){
    					PO[prop].Value = value;
    				}else{
    					PO[prop].$ = string;
    				}
    			};
    		};
    		applicationUIService.findElementInDetail_V3(['FullName']).$ = prospectPersonalUIService.findElementInDetail_V3(['FullName']).$;
    		applicationUIService.findElementInDetail_V3(['IDNumber']).$ = 'S0000222D';
    		applicationUIService.findElementInDetail_V3(['YearDrivingLicenseObtained']).$ = '2005';
    		//$scope.saveDetail();
    	};
	});*/
    
	$scope.prepareAddressList = function(){
		applicationUIService.addressList = angular.copy(applicationUIService.findElementInDetail_V3(['Addresses','Address']));
	};
	
    $scope.refreshDetail = function(){
		var applicationID = applicationUIService.findElementInDetail_V3(['DocId']);
		var applicationProduct = applicationUIService.findElementInDetail_V3(["Product"]);
		applicationUIService.findDocumentToEdit_V3($scope.resourceURL, applicationProduct, applicationID).then(function(data){
			$scope.reSetupConcreteUiStructure(applicationUIService.detail); // refresh the values in multiple cards
			$scope.initScopeRul();//binding data for application after resetup
		});
	};
    
    // Convert contacts to array when open card Contacts (cover case when open existing item)
    $scope.convertContactsToArray = function(){
    	applicationUIService.jsonToArray(applicationUIService.detail, 'Contacts', 'person:Contact');
    	// slice 4 types of Personal Prospect
    	applicationUIService.contactLazyList(applicationUIService.detail);
    }
    
    function convertElementToArray(){
    	applicationUIService.jsonToArray(applicationUIService.detail, 'OptionalCoverages', 'application-motor:OptionalCoverage');
	  	applicationUIService.jsonToArray(applicationUIService.detail, 'IDs', 'person:ID');
	  	applicationUIService.jsonToArray(applicationUIService.detail, 'Addresses', 'person:Address');
	  	applicationUIService.jsonToArray(applicationUIService.detail, 'Contacts', 'person:Contact');
	  	applicationUIService.jsonToArray(applicationUIService.detail, 'Attachments', 'Attachment');
    }
    $scope.$on('printPreviewPDFByHtmlApplication', function(event, actionType, action){
        $scope.printPdfByHtml(actionType, action);
    });
    /* Select PDF template popup */
    /**
    *action: download or preview (default: preview)
    */
	$scope.printPdf = function(actionType, action) {

        if(applicationUIService.productName == commonService.CONSTANTS.PRODUCT.ENDOWMENT ||
            applicationUIService.productName == commonService.CONSTANTS.PRODUCT.REGULAR_UNIT_LINK){
            $scope.printPdfByHtml(actionType, action);
            return;
        }
		//if policy owner is the same as life insured, copy policy owner to life insured before generate document
		if (applicationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.UNIT_LINK
				||applicationUIService.productName == commonService.CONSTANTS.PRODUCT.REGULAR_UNIT_LINK
				|| applicationUIService.productName == commonService.CONSTANTS.PRODUCT.ENDOWMENT) {
			var POId = $scope.moduleService.findElementInDetail_V3(['ProporserInformation'])['@refUid'];
			var LIId = $scope.moduleService.findElementInDetail_V3(['LifeAssuredInformation'])['@refUid'];
			if (POId == LIId){
				//copy information from PO to LA
				 applicationUIService.copyInforFromSameStructureObj(undefined, applicationUIService.detail, ['UnderwritingDetailsOfProposer'], ['UnderwritingDetailsOfLifeAssured']);
				 applicationUIService.copyInforFromSameStructureObj(undefined, applicationUIService.detail, ['ProporserInformation'], ['LifeAssuredInformation']);
			}
		}
		
		//dnguyen98: Manually loading bar to make loading bar always show for print action
		sessionStorage.setItem("longOverLay", true);
		loadingBarService.showLoadingBar();
		
		applicationUIService.generateDocument_V3($scope.portletId).then(function(data) {
			if (applicationUIService.isSuccess(data)){
				$scope.saveDetail( actionType ).then(function(result){
					if (applicationUIService.isSuccess(result)) {
						applicationUIService.group = applicationUIService.getProductGroup_V3(applicationUIService.productName);
				    	var businessType = salecaseUIService.findElementInDetail_V3(['@case-name']);
				    	$scope.printPdfService.isShowSubmitApplication = true;
				    	if (!commonService.hasValueNotEmpty(actionType)) {
				    	    actionType = businessType.toLowerCase();
				    	}
				    	if (!commonService.hasValueNotEmpty(action)) {
                            action = "preview";
                        }
                        if (applicationUIService.productName == commonService.CONSTANTS.PRODUCT.REGULAR_UNIT_LINK) {
                            $scope.printPdfService.generatePdf($scope.portletId, applicationUIService, applicationUIService.productName, actionType);
                        } else {
                            if(action == "preview"){
                                $scope.openPreviewPDF(applicationUIService.name, actionType);
                            }else{
                                $scope.printPdfService.generatePdf($scope.portletId, applicationUIService, applicationUIService.productName, actionType);
                            }
                        }

				    	//dnguyen98: Manually loading bar to make loading bar hide when generate document success
						sessionStorage.removeItem("longOverLay");
						loadingBarService.hideLoadingBar();
					} else {
						commonUIService.showNotifyMessage("v3.myworkspace.message.GeneratePDFUnsuccessfully");
					}
				});
			} else {
				commonUIService.showNotifyMessage("v3.myworkspace.message.GeneratePDFUnsuccessfully");
				//dnguyen98: Manually loading bar to make loading bar hide when generate document fail
				sessionStorage.removeItem("longOverLay");
				loadingBarService.hideLoadingBar();
			}
		});
	};

	$scope.printPdfByHtml = function(actionType, action) {
    		//if policy owner is the same as life insured, copy policy owner to life insured before generate document
    		if (applicationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.UNIT_LINK
    				||applicationUIService.productName == commonService.CONSTANTS.PRODUCT.REGULAR_UNIT_LINK
    				|| applicationUIService.productName == commonService.CONSTANTS.PRODUCT.ENDOWMENT) {
    			var POId = $scope.moduleService.findElementInDetail_V3(['ProporserInformation'])['@refUid'];
    			var LIId = $scope.moduleService.findElementInDetail_V3(['LifeAssuredInformation'])['@refUid'];
    			if (POId == LIId){
    				//copy information from PO to LA
    				 applicationUIService.copyInforFromSameStructureObj(undefined, applicationUIService.detail, ['UnderwritingDetailsOfProposer'], ['UnderwritingDetailsOfLifeAssured']);
    				 applicationUIService.copyInforFromSameStructureObj(undefined, applicationUIService.detail, ['ProporserInformation'], ['LifeAssuredInformation']);
    			}
    		}

    		//dnguyen98: Manually loading bar to make loading bar always show for print action
    		sessionStorage.setItem("longOverLay", true);
    		loadingBarService.showLoadingBar();

            var businessType = salecaseUIService.findElementInDetail_V3(['@case-name']);
            if (!commonService.hasValueNotEmpty(actionType)) {
                actionType = businessType.toLowerCase();
            }
            if (!commonService.hasValueNotEmpty(action)) {
                action = "preview";
            }

            if(action == "preview"){
                applicationUIService.generateDocument_V3($scope.portletId).then(function(data) {
                     if (applicationUIService.isSuccess(data)){
                        $scope.saveDetail( actionType ).then(function(result){
                            if (applicationUIService.isSuccess(result)) {
                               applicationUIService.group = applicationUIService.getProductGroup_V3(applicationUIService.productName);
                               var businessType = salecaseUIService.findElementInDetail_V3(['@case-name']);
                               $scope.printPdfService.isShowSubmitApplication = true;
                               $scope.openPreviewPDF(applicationUIService.name, actionType);
                               sessionStorage.removeItem("longOverLay");
                               loadingBarService.hideLoadingBar();
                            } else {
                               commonUIService.showNotifyMessage("v3.myworkspace.message.GeneratePDFUnsuccessfully");
                            }
                        });
                    } else {
                        commonUIService.showNotifyMessage("v3.myworkspace.message.GeneratePDFUnsuccessfully");
                        //dnguyen98: Manually loading bar to make loading bar hide when generate document fail
                        sessionStorage.removeItem("longOverLay");
                        loadingBarService.hideLoadingBar();
                    }
                });

    		}else{
    		    var dataHTML = '';
                try {
                    dataHTML = commonService.itextElement[0].nextSibling.innerHTML;
                } catch (e) {}
                var printData = {
                    html: dataHTML,
                    model: applicationUIService.detail
                };
    		    $scope.printPdfService.generatePdf($scope.portletId, applicationUIService, applicationUIService.productName, actionType, undefined, JSON.stringify(printData));
    		
    		}

    	};
	
	$scope.getUnansweredQuestion = function() {
		var questions = applicationUIService.findElementInDetail_V3(['Questionnaires', 'Question']);
		var counter = 0;
		for(var i = 0; i < questions.length; i++ ) {
			var value = applicationUIService.findElementInElement_V3(questions[i], ['QValue']).Value;
			if (value == '' || !commonService.hasValue(value)) {
				counter++;
			}
		}
		return counter;
	}

	$rootScope.$on("saveIllustration", function(event, data){
    	var refValArray=[];
    	var parentArray=[];
    	var element =[];
    	var parent=[];
    	refValArray = $scope.findArrayWithProperty(applicationUIService.detail, '@refVal', undefined, refValArray, parentArray)[0];
    	parentArray = $scope.findArrayWithProperty(applicationUIService.detail, '@refVal', undefined, refValArray, parentArray)[1];
    	for (var i=0; i<refValArray.length; i++){
    		refValArray[i] = covertToElementChain (refValArray[i]);
    		var ele = $scope.moduleIllustrationService.findElementInDetail_V3(refValArray[i]);
    		var ee = parentArray[i];
    		var data = $scope.findArrayWithProperty(ele, '@vpms-suffix', refValArray[i][refValArray[i].length-1], element, parent)[1][i];
    		if (data != undefined){
	    		if (data.$ != undefined) 
	    			ee.$ = data.$;
	    		if (data.Value != undefined)  
	    			ee.Value = data.Value;
    		}
    	}
    	
    });
    
    $scope.findArrayWithProperty = function(detail, property, value, result, parent){
		 var self = this;
		 var obj = detail;
		 var k;
		 for (var key in obj) {
			 if (typeof(obj[key])=="object"){
				 $scope.findArrayWithProperty(obj[key], property, value, result, parent);
			 }else if ( key == property && (value==undefined || obj[key] == value)  ){
				 result.push(obj[key]);
				 parent.push(obj);
			 }
		 }
		 return [result,parent];
	 };
	 
//	 $scope.printPreviewPdf = function() {
//		 var docId = applicationUIService.findElementInDetail_V3(["DocId"]);
//		 if (!docId){
//			 return;
//		 }
//		 applicationUIService.findDocument_V3($scope.resourceURL, docId).then(function(data){
//			 applicationUIService.productName = applicationUIService.findElementInDetail_V3(["Product"]);
//			 applicationUIService.generateDocument_V3($scope.portletId).then(function(data) {
//				 if (applicationUIService.isSuccess(data)) {
//					 applicationUIService.group = applicationUIService.getProductGroup_V3(applicationUIService.productName);
//					 if (applicationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.MOTOR) {
//						 convertElementToArray();
//					 }
//					 
//					 var templateName = "Application Fire Houseowner AS Preview";
//					 
//					/* if (applicationUIService.productName == "guaranteed-cashback-saver"){
//						 templateName = "Application Guaranteed Cashback Saver Abridged";
//					 }*/
//					 switch(applicationUIService.productName) {
//					    case commonService.CONSTANTS.PRODUCT.GUARANTEED_CASHBACK:
//					    	 templateName = "Application Guaranteed Cashback Saver Abridged";
//					        break;
////					    case commonService.CONSTANTS.PRODUCT.TERM_LIFE_SECURE:
//					    case 'term-life-secure':
//					    	 templateName = "Application TermLife Secure Abridged";
//					        break;
//					}
//					 
////			    	else if (applicationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.TERM_LIFE) { }
//					 var businessType = salecaseUIService.findElementInDetail_V3(['@case-name']);
//					 $scope.printPdfService.generatePdf($scope.portletId, applicationUIService, applicationUIService.productName, "", "", templateName);
//				 } else {
//					 commonUIService.showNotifyMessage("v3.myworkspace.message.GeneratePDFUnsuccessfully");
//				 }
//			 });
// 		});
// 	};
 	 
	 $scope.setSelectedAddress = function(address) {
		 $scope.moduleService.findElementInDetail_V3(['BlkHouseNo']).Value = $scope.moduleService.findElementInElement_V3(address,['BlkHouseNo']).Value ;
		 $scope.moduleService.findElementInDetail_V3(['Street']).$ = $scope.moduleService.findElementInElement_V3(address,['Street']).$;
		 $scope.moduleService.findElementInDetail_V3(['UnitNo']).$ = $scope.moduleService.findElementInElement_V3(address,['UnitNo']).$;
		 $scope.moduleService.findElementInDetail_V3(['Building']).$ = $scope.moduleService.findElementInElement_V3(address,['Building']).$;
		 $scope.moduleService.findElementInDetail_V3(['City']).$ = $scope.moduleService.findElementInElement_V3(address,['City']).$;
		 $scope.moduleService.findElementInDetail_V3(['Postal']).$ = $scope.moduleService.findElementInElement_V3(address,['Postal']).$;
		 $scope.moduleService.findElementInDetail_V3(['Country']).Value = $scope.moduleService.findElementInElement_V3(address,['Country']).Value ;
		 
	 	
	 };
 	
	 
	 function covertToElementChain (text){
		 var elementChain = text.split('/');
		 elementChain.splice(0,1);
		 return elementChain;
	 }
	 
		$scope.resetResidencyQuestion = function(type, index) {
			var ResidencyOjb = $scope.moduleService.findElementInDetail_V3([type, 'ResidencyQuestion']);
			var i = 0;
			for(i; i < ResidencyOjb.length; i++){
				$scope.moduleService.findElementInElement_V3(ResidencyOjb[i], ['ResidencyQValue']).Value = "";
				if (i != index){
					$scope.moduleService.findElementInElement_V3(ResidencyOjb[i], ['ResidencyQIndex']).$ = "";
				}
				
			}
		}
		
	    $scope.addNewCompanyInforReplacement = function() {
	    	$scope.replacementQ1 = $scope.moduleService.findElementInDetail_V3(['ReplacementQ1','ReplacementSubQs']);
	    	$scope.moduleService.addChildEleToParentEle($scope.replacementQ1, "ReplacementSubQ");
	    };
	    $scope.removeCompanyInforReplacement = function(index) {
	    	$scope.replacementQ1 = $scope.moduleService.findElementInDetail_V3(['ReplacementQ1','ReplacementSubQs']);
	    	$scope.moduleService.removeChildEleParentEle($scope.replacementQ1, "ReplacementSubQ", index);
	    };
	    
	    
	 
	    $scope.addNewCompanyInforReplacementLI = function() {
	    	$scope.replacementQ1 = $scope.moduleService.findElementInDetail_V3(['LifeAssuredDetails','ReplacementQ1','ReplacementSubQs']);
	    	$scope.moduleService.addChildEleToParentEle($scope.replacementQ1, "ReplacementSubQ");
	    };
	    $scope.removeCompanyInforReplacementLI = function(index) {
	    	$scope.replacementQ1 = $scope.moduleService.findElementInDetail_V3(['LifeAssuredDetails','ReplacementQ1','ReplacementSubQs']);
	    	$scope.moduleService.removeChildEleParentEle($scope.replacementQ1, "ReplacementSubQ", index);
	    };
	    
	    
	    $scope.addNewQ3ALifestyle = function() {
	    	$scope.subHQ3A = $scope.moduleService.findElementInDetail_V3(['HealthQ3A','HealthSubQs']);
	    	$scope.moduleService.addChildEleToParentEle($scope.subHQ3A, "HealthSubQ");
	    };
	    $scope.removeQ3ALifestyle = function(index) {
	    	$scope.subHQ3A = $scope.moduleService.findElementInDetail_V3(['HealthQ3A','HealthSubQs']);
	    	$scope.moduleService.removeChildEleParentEle($scope.subHQ3A, "HealthSubQ", index);
	    };
	    
	    $scope.addNewQ3BLifestyle = function() {
	    	$scope.subHQ3B = $scope.moduleService.findElementInDetail_V3(['HealthQ3B','HealthSubQs']);
	    	$scope.moduleService.addChildEleToParentEle($scope.subHQ3B, "HealthSubQ");
	    };
	    $scope.removeQ3BLifestyle = function(index) {
	    	$scope.subHQ3B = $scope.moduleService.findElementInDetail_V3(['HealthQ3B','HealthSubQs']);
	    	$scope.moduleService.removeChildEleParentEle($scope.subHQ3B, "HealthSubQ", index);
	    };
	    
	    

//		This Function is for against duplicate HazardousEvent Option	    
	    $scope.checkHazardousEvent = function checkHazardousEvent(index){
			var listNode = $scope.moduleService.findElementInDetail_V3(['HazardousEvent']);
			var originalListNode = angular.copy($scope.moduleService.findElementInElement_V3($scope.moduleService.originalDetail, ['HazardousEvent']));
			var childrenNode =  listNode[index];
			for(var i =0; i < listNode.length; i++){
				if (i != index && $scope.moduleService.findElementInElement_V3(listNode[index],['HazardousEventCd']).Value !="" 
				   && $scope.moduleService.findElementInElement_V3(listNode[i],['HazardousEventCd']).Value == $scope.moduleService.findElementInElement_V3(childrenNode,['HazardousEventCd']).Value){
					$scope.moduleService.findElementInElement_V3(listNode[index],['HazardousEventCd']).Value = $scope.moduleService.findElementInElement_V3(originalListNode[index],['HazardousEventCd']).Value;
					commonUIService.showNotifyMessage("v3.mynewworkspace.message.eachHazardShouldBeSelectOnlyOneTime", "fail");
				}
			}
		}
	    
	    $scope.saveSupplementaryDetail = function(){
	    	if (applicationUIService.productName == "GTL1"){
				prepareOrganisationDistToCompute();
			}
	    } 

	// Convert non primary address to array when open card Address (cover case when open existing item)
    $scope.convertNPAddressesToArray = function(){
    	applicationUIService.convertObjectToArray(applicationUIService.detail, ['PolicyOwnerInformation', 'NonPrimaryAddresses', 'NonPrimaryAddress']);
    }
    
    $scope.computeTag = function (element){
    	var deferred = applicationUIService.$q.defer();
    	if($scope.moduleService.findElementInDetail_V3(['BusinessStatus']) == commonService.CONSTANTS.STATUS.ACCEPTED 
    			&& (applicationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.UNIT_LINK
    					|| applicationUIService.productName == commonService.CONSTANTS.PRODUCT.REGULAR_UNIT_LINK
    					|| applicationUIService.productName == commonService.CONSTANTS.PRODUCT.ENDOWMENT)){
			deferred.resolve();
			return deferred.promise;
		}
    	applicationUIService.computeElementAndUpdateLazyList($scope.resourceURL, element).then(function(data){
			$scope.reSetupConcreteUiStructure(applicationUIService.detail); // refresh the values in multiple cards
			$scope.initScopeRul();//binding data for application after resetup
			deferred.resolve();
		});
    	return deferred.promise;
	}
    

    //RUL compute UW question only when detail changed
    $scope.checkDetailChange_computeTag_RUL_PO = function checkDetailChange_RUL (element){
    	if($scope.moduleService.findElementInDetail_V3(['BusinessStatus']) != commonService.CONSTANTS.STATUS.ACCEPTED 
    			&& (applicationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.UNIT_LINK
    					|| applicationUIService.productName == commonService.CONSTANTS.PRODUCT.REGULAR_UNIT_LINK
    					|| applicationUIService.productName == commonService.CONSTANTS.PRODUCT.ENDOWMENT)){
    		if($scope.POGenderDetail != $scope.moduleService.findElementInDetail_V3(['PolicyOwnerDetails','Gender']).Value
    			|| $scope.LAGenderDetail != $scope.moduleService.findElementInDetail_V3(['LifeAssuredDetails','Gender']).Value
    		){
    			$scope.computeTag(element);
    			$scope.POGenderDetail = $scope.moduleService.findElementInDetail_V3(['PolicyOwnerDetails','Gender']).Value;
    			$scope.LAGenderDetail = $scope.moduleService.findElementInDetail_V3(['LifeAssuredDetails','Gender']).Value;
    		}
    	}
    }
    
    //RUL compute UW question only when detail changed
    $scope.checkDetailChange_computeTag_RUL_LA = function checkDetailChange_RUL (element){
    	if($scope.moduleService.findElementInDetail_V3(['BusinessStatus']) != commonService.CONSTANTS.STATUS.ACCEPTED 
    			&& (applicationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.UNIT_LINK
    					|| applicationUIService.productName == commonService.CONSTANTS.PRODUCT.REGULAR_UNIT_LINK
    					|| applicationUIService.productName == commonService.CONSTANTS.PRODUCT.ENDOWMENT)){
    		if($scope.POGenderDetail != $scope.moduleService.findElementInDetail_V3(['PolicyOwnerDetails','Gender']).Value
    			|| $scope.LAGenderDetail != $scope.moduleService.findElementInDetail_V3(['LifeAssuredDetails','Gender']).Value
    			|| $scope.LABirthdateDetail != $scope.moduleService.findElementInDetail_V3(['LifeAssuredDetails','BirthDate']).$
    		){
    			$scope.computeTag(element);
    			$scope.POGenderDetail = $scope.moduleService.findElementInDetail_V3(['PolicyOwnerDetails','Gender']).Value;
    			$scope.LAGenderDetail = $scope.moduleService.findElementInDetail_V3(['LifeAssuredDetails','Gender']).Value;
    			$scope.LABirthdateDetail = $scope.moduleService.findElementInDetail_V3(['LifeAssuredDetails','BirthDate']).$;
    		}
    	}
    }

    
    $scope.refreshTag = function (element){
    	var deferred = illustrationUIService.$q.defer();
    	applicationUIService.refreshTags($scope.resourceURL, element).then(function(data){
          	if (applicationUIService.isSuccess(data)) {
          	  $scope.reSetupConcreteUiStructure(applicationUIService.detail, $scope.getAssociateUiStructureRoot().isDetailChanged); // refresh the values in multiple cards 
          	} 
    		deferred.resolve(data);
        });
    	return deferred.promise;
	}
    
    $scope.refreshCityCode = function(card, provinceCd, cityCdChoiceKey,Province){
    	applicationUIService.findElementInElement_V3(card.refDetail, ['CityCd']).Value = '';
    	if (cityCdChoiceKey !== 'POCCityCd') {
    		$scope[cityCdChoiceKey + 'List'] =  $filter('filterByGroup')(applicationUIService.findElementInElement_V3(applicationUIService.lazyChoiceList, [cityCdChoiceKey, 'Option']), provinceCd);
    		if($scope.valueSelectAddress=='Y'){
    			 $scope.changeDataAllfield(Province);
    		}
    	} else {
    		$scope.POCCityCdList = $filter('filterByGroup')(applicationUIService.findElementInElement_V3(applicationUIService.lazyChoiceList, ['POPCityCd', 'Option']), provinceCd);
    		if($scope.valueSelectAddress=='Y'){
   			 $scope.changeDataAllfield(Province);
   			 }
    	}
    	
    		
    }

    
    //RUL clear all data in element and remove all array
    $scope.clearElementData = function clearElementData (condition, ele, detail, tag){
    	if (condition == "N"){
    		var objEle = undefined;
    		if (detail){
    			objEle = detail;
    		}else{
    			objEle = applicationUIService.detail;
    		}
    		applicationUIService.clearElementData_v3(objEle, ele);

			if ( $scope.isPOandLADiff == false){
				if (ele.length > 1){
					ele[0] = "LifeAssuredDetails";
				}
				applicationUIService.clearElementData_v3(objEle, ele);
			}
   
    	}
    	if (!condition && !ele){
    		$scope.refreshTag(tag);
    	}
    }
    
	  //For Regular Unit Link product: also add new row if proposer is life insured
    $scope.addNewItem = function(path, elemntName) {
    	$scope.addNewRow(path, elemntName);
		if ($scope.isPOandLADiff == false){
			if (path.length > 1){
				path[0] = "UnderwritingDetailsOfLifeAssured";
			}
			$scope.addNewRow(path, elemntName);
		}
    };
    $scope.removeItem = function(path, elemntName, index) {
    	$scope.removeRow(path, elemntName, index);
		if ($scope.isPOandLADiff == false){
			if (path.length > 1){
				path[0] = "UnderwritingDetailsOfLifeAssured";
			}
			$scope.removeRow(path, elemntName, index);
		}
    };
    
    $scope.addNewRow = function(path, elemntName) {
    	$scope.subQ = $scope.moduleService.findElementInDetail_V3(path);
    	$scope.moduleService.addChildEleToParentEle($scope.subQ, elemntName);
    };
    $scope.removeRow = function(path, elemntName, index) {
    	$scope.subQ = $scope.moduleService.findElementInDetail_V3(path);
    	$scope.moduleService.removeChildEleParentEle($scope.subQ, elemntName, index);
    };
    
    $scope.importEmail = function(tag, PolicyDelivery) {
    	$scope.refreshTag(tag).then(function(){
    		if (PolicyDelivery.Value == "EMAIL"){
        		$scope.moduleService.findElementInDetail_V3(['ChannelAndPolicyDelivery', 'Email']).$ = $scope.moduleService.findElementInDetail_V3(['PolicyOwnerDetails', 'EmailAddress']).$;
        	}else{
        		$scope.moduleService.findElementInDetail_V3(['ChannelAndPolicyDelivery', 'Email']).$ = "";
        	}
    		$scope.markValidCard($scope.getAssociateUiStructureRoot())
			$scope.card.validStatus = $scope.getAssociateUiStructureRoot().validStatus;
    	});
    };
    
    //check if PO is difference with LA
    $scope.isPOandLADiffFunc = function isPOandLADiffFunc(){
		//var LAIsTheSameWithPO = $scope.moduleService.findElementInDetail_V3(['LAIsTheSameWithPO']).Value;
		var result = true;
		if ($scope.LAIsTheSameWithPO.Value == "Y"){
			result = false;
		}
		return result;
    }

    //init value to optimize speed for RUL
    $scope.initScopeRul = function initScopeRul(){
    	if (applicationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.UNIT_LINK
    		|| applicationUIService.productName == commonService.CONSTANTS.PRODUCT.REGULAR_UNIT_LINK
    		|| applicationUIService.productName == commonService.CONSTANTS.PRODUCT.ENDOWMENT){

    		$scope.LAIsTheSameWithPO = $scope.moduleService.findElementInDetail_V3(['LAIsTheSameWithPO']);
            $scope.IsHasRider = $scope.moduleService.findElementInDetail_V3(['IsHasRider']);
            $scope.isPOandLADiff = $scope.isPOandLADiffFunc();

            $scope.initScopeAgentDisClaimerRul();
            $scope.initScopePORul();

            if ($scope.isPOandLADiff == true){
                $scope.initScopeLARul();
            }
    	}  
    }

    //init some value and table value to optimize speed
    //init only one time while loading
    $scope.initScopeAgentDisClaimerRul = function initScopeAgentDisClaimerRul(){
    	
        $scope.AgentDisclaimer3ModelCoverProtection = $scope.moduleService.findElementInDetail_V3(['AgentDisclaimerQ3', 'CoverProtection']);
        $scope.AgentDisclaimer3ModelCostOfEducation = $scope.moduleService.findElementInDetail_V3(['AgentDisclaimerQ3', 'CostOfEducation']);
        $scope.AgentDisclaimer3ModelSavingOfCidRetirement = $scope.moduleService.findElementInDetail_V3(['AgentDisclaimerQ3', 'SavingOfCidRetirement']);
        $scope.AgentDisclaimer3ModelOther = $scope.moduleService.findElementInDetail_V3(['AgentDisclaimerQ3', 'Other']);
        $scope.AgentDisclaimer7Table = $scope.moduleService.findElementInDetail_V3(['AgentDisclaimer7Item']);

        //use for visible in json
        $scope.AgentDisclaimer5Value = $scope.moduleService.findElementInDetail_V3(['AgentDisclaimerQ5','QValue']);
        $scope.AgentDisclaimer8Value = $scope.moduleService.findElementInDetail_V3(['AgentDisclaimerQ8','QValue']);
    }

    //init some value and table value to optimize speed
    //init only one time while loading
    $scope.initScopePORul = function initScopePORul(){
        //use for visible in json
        $scope.poGQ1bVal = $scope.moduleService.findElementInDetail_V3(['PolicyOwnerDetails', 'GeneralQ1b','QValue']);
        $scope.poGQ1cVal = $scope.moduleService.findElementInDetail_V3(['PolicyOwnerDetails', 'GeneralQ1c','QValue']);
        $scope.poGQ2Val =  $scope.moduleService.findElementInDetail_V3(['PolicyOwnerDetails', 'GeneralQ2','QValue']);
        $scope.poGQ3Val =  $scope.moduleService.findElementInDetail_V3(['PolicyOwnerDetails', 'GeneralQ3','QValue']);
        $scope.poGQ4Val =  $scope.moduleService.findElementInDetail_V3(['PolicyOwnerDetails', 'GeneralQ4','QValue']);
        $scope.poGQ5Val =  $scope.moduleService.findElementInDetail_V3(['PolicyOwnerDetails', 'GeneralQ5','QValue']);
        $scope.poGQ6Val =  $scope.moduleService.findElementInDetail_V3(['PolicyOwnerDetails', 'GeneralQ6','QValue']);
        $scope.poGQ7Val =  $scope.moduleService.findElementInDetail_V3(['PolicyOwnerDetails', 'GeneralQ7','QValue']);
        $scope.poGQ8Val =  $scope.moduleService.findElementInDetail_V3(['PolicyOwnerDetails', 'GeneralQ8','QValue']);
        $scope.poGQ9Val =  $scope.moduleService.findElementInDetail_V3(['PolicyOwnerDetails', 'GeneralQ9','QValue']);
        $scope.poGQ10Val = $scope.moduleService.findElementInDetail_V3(['PolicyOwnerDetails', 'GeneralQ10','QValue']);
        $scope.poGQ11Val = $scope.moduleService.findElementInDetail_V3(['PolicyOwnerDetails', 'GeneralQ11','QValue']);
        $scope.poGQ12Val = $scope.moduleService.findElementInDetail_V3(['PolicyOwnerDetails', 'GeneralQ12','QValue']);

        // PO General question table
        $scope.poGQ1bTable = $scope.moduleService.findElementInDetail_V3(['PolicyOwnerDetails', 'GeneralQ1b', 'GeneralQ1bItem']);
        $scope.poGQ1cTable = $scope.moduleService.findElementInDetail_V3(['PolicyOwnerDetails', 'GeneralQ1c', 'GeneralQ1cItem']);
        $scope.poGQ4Table = $scope.moduleService.findElementInDetail_V3(['PolicyOwnerDetails', 'GeneralQ4', 'GeneralQ4Item']);
        $scope.poGQ6Table = $scope.moduleService.findElementInDetail_V3(['PolicyOwnerDetails', 'GeneralQ6Items', 'GeneralQ6Item']);
        $scope.poGQ7Table = $scope.moduleService.findElementInDetail_V3(['PolicyOwnerDetails', 'GeneralQ7Items', 'GeneralQ7Item']);
        $scope.poGQ8Table = $scope.moduleService.findElementInDetail_V3(['PolicyOwnerDetails', 'GeneralQ8ListItem', 'GeneralQ8Items']);
        $scope.poGQ9Table = $scope.moduleService.findElementInDetail_V3(['PolicyOwnerDetails', 'GeneralQ9ListItems', 'GeneralQ9Items']);
        $scope.poGQ10Table = $scope.moduleService.findElementInDetail_V3(['PolicyOwnerDetails', 'GeneralQ10ListItems', 'GeneralQ10Items']);
        $scope.poGQ12Table = $scope.moduleService.findElementInDetail_V3(['PolicyOwnerDetails', 'GeneralQ12ListItems', 'GeneralQ12Item']);
        
        //PO health question
        //use for visible in json
        $scope.poHQ3Val = $scope.moduleService.findElementInDetail_V3(['PolicyOwnerDetails', 'HealthQ3','QValue']);
        $scope.poHQ4aVal = $scope.moduleService.findElementInDetail_V3(['PolicyOwnerDetails', 'HealthQ4a','QValue']);
        $scope.poHQ4bVal =  $scope.moduleService.findElementInDetail_V3(['PolicyOwnerDetails', 'HealthQ4b','QValue']);
        $scope.poHQ5cVal =  $scope.moduleService.findElementInDetail_V3(['PolicyOwnerDetails', 'HealthQ5c','QValue']);
        $scope.poHQ5dVal =  $scope.moduleService.findElementInDetail_V3(['PolicyOwnerDetails', 'HealthQ5d','QValue']);
        $scope.poHQ5eVal =  $scope.moduleService.findElementInDetail_V3(['PolicyOwnerDetails', 'HealthQ5e','QValue']);

        // PO health question 6c
        $scope.poHQ6cModelQKey =  $scope.moduleService.findElementInDetail_V3(['PolicyOwnerDetails', 'HealthQ6c', 'QKey']);
        $scope.poHQ6cModelHealthQNormalOrSpontan =  $scope.moduleService.findElementInDetail_V3(['PolicyOwnerDetails', 'HealthQ6c', 'HealthQNormalOrSpontan']);
        $scope.poHQ6cModelHealthQOperasiOrCaesar =  $scope.moduleService.findElementInDetail_V3(['PolicyOwnerDetails', 'HealthQ6c', 'HealthQOperasiOrCaesar']);
        $scope.poHQ6cModelHealthQVacum =  $scope.moduleService.findElementInDetail_V3(['PolicyOwnerDetails', 'HealthQ6c', 'HealthQVacum']);
        $scope.poHQ6cModelHealthQForceps =  $scope.moduleService.findElementInDetail_V3(['PolicyOwnerDetails', 'HealthQ6c', 'HealthQForceps']);
        $scope.poHQ6cModelHealthQOthers =  $scope.moduleService.findElementInDetail_V3(['PolicyOwnerDetails', 'HealthQ6c', 'HealthQOthers']);

        // PO health question 6i
        $scope.poHQ6iModelQKey =  $scope.moduleService.findElementInDetail_V3(['PolicyOwnerDetails', 'HealthQ6i', 'QKey']);
        $scope.poHQ6iModelHealthQMaternityHospital =  $scope.moduleService.findElementInDetail_V3(['PolicyOwnerDetails', 'HealthQ6i', 'HealthQMaternityHospital']);
        $scope.poHQ6iModelHealthQHospital =  $scope.moduleService.findElementInDetail_V3(['PolicyOwnerDetails', 'HealthQ6i', 'HealthQHospital']);
        $scope.poHQ6iModelHealthQOthers =  $scope.moduleService.findElementInDetail_V3(['PolicyOwnerDetails', 'HealthQ6i', 'HealthQOthers']);
        // PO health question 6j
        $scope.poHQ6jModelQKey =  $scope.moduleService.findElementInDetail_V3(['PolicyOwnerDetails', 'HealthQ6j', 'QKey']);

        // PO health questions table
        $scope.poHQ1Table = $scope.moduleService.findElementInDetail_V3(['PolicyOwnerDetails', 'HealthQ1Items']);
        $scope.poHQ3Table = $scope.moduleService.findElementInDetail_V3(['PolicyOwnerDetails', 'HealthQ3', 'HealthQ3Item']);
        $scope.poHQ4aTable = $scope.moduleService.findElementInDetail_V3(['PolicyOwnerDetails', 'HealthQ4a', 'HealthQ4Details']);
        $scope.poHQ4bTable = $scope.moduleService.findElementInDetail_V3(['PolicyOwnerDetails','HealthQ4b', 'HealthQ4Details']);
        $scope.poHQ5cTable = $scope.moduleService.findElementInDetail_V3(['PolicyOwnerDetails', 'HealthQ5c', 'HealthQ5cItem']);
        $scope.poHQ5dTable = $scope.moduleService.findElementInDetail_V3(['PolicyOwnerDetails', 'HealthQ5d', 'HealthQ5dItem']);
        $scope.poHQ6jTable = $scope.moduleService.findElementInDetail_V3(['PolicyOwnerDetails', 'HealthQ6j', 'HealthQ6jItem']);
    }
    
  //init some value and table value to optimize speed
    //init only one time while loading
    $scope.initScopeLARul = function initScopeLARul(){
        //use for visible in json
        $scope.laGQ1bVal = $scope.moduleService.findElementInDetail_V3(['LifeAssuredDetails', 'GeneralQ1b','QValue']);
        $scope.laGQ1cVal = $scope.moduleService.findElementInDetail_V3(['LifeAssuredDetails', 'GeneralQ1c','QValue']);
        $scope.laGQ2Val =  $scope.moduleService.findElementInDetail_V3(['LifeAssuredDetails', 'GeneralQ2','QValue']);
        $scope.laGQ3Val =  $scope.moduleService.findElementInDetail_V3(['LifeAssuredDetails', 'GeneralQ3','QValue']);
        $scope.laGQ4Val =  $scope.moduleService.findElementInDetail_V3(['LifeAssuredDetails', 'GeneralQ4','QValue']);
        $scope.laGQ5Val =  $scope.moduleService.findElementInDetail_V3(['LifeAssuredDetails', 'GeneralQ5','QValue']);
        $scope.laGQ6Val =  $scope.moduleService.findElementInDetail_V3(['LifeAssuredDetails', 'GeneralQ6','QValue']);
        $scope.laGQ7Val =  $scope.moduleService.findElementInDetail_V3(['LifeAssuredDetails', 'GeneralQ7','QValue']);
        $scope.laGQ8Val =  $scope.moduleService.findElementInDetail_V3(['LifeAssuredDetails', 'GeneralQ8','QValue']);
        $scope.laGQ9Val =  $scope.moduleService.findElementInDetail_V3(['LifeAssuredDetails', 'GeneralQ9','QValue']);
        $scope.laGQ10Val = $scope.moduleService.findElementInDetail_V3(['LifeAssuredDetails', 'GeneralQ10','QValue']);
        $scope.laGQ11Val = $scope.moduleService.findElementInDetail_V3(['LifeAssuredDetails', 'GeneralQ11','QValue']);
        $scope.laGQ12Val = $scope.moduleService.findElementInDetail_V3(['LifeAssuredDetails', 'GeneralQ12','QValue']);

        // PO General question table
        $scope.laGQ1bTable = $scope.moduleService.findElementInDetail_V3(['LifeAssuredDetails', 'GeneralQ1b', 'GeneralQ1bItem']);
        $scope.laGQ1cTable = $scope.moduleService.findElementInDetail_V3(['LifeAssuredDetails', 'GeneralQ1c', 'GeneralQ1cItem']);
        $scope.laGQ4Table = $scope.moduleService.findElementInDetail_V3(['LifeAssuredDetails', 'GeneralQ4', 'GeneralQ4Item']);
        $scope.laGQ6Table = $scope.moduleService.findElementInDetail_V3(['LifeAssuredDetails', 'GeneralQ6Items', 'GeneralQ6Item']);
        $scope.laGQ7Table = $scope.moduleService.findElementInDetail_V3(['LifeAssuredDetails', 'GeneralQ7Items', 'GeneralQ7Item']);
        $scope.laGQ8Table = $scope.moduleService.findElementInDetail_V3(['LifeAssuredDetails', 'GeneralQ8ListItem', 'GeneralQ8Items']);
        $scope.laGQ9Table = $scope.moduleService.findElementInDetail_V3(['LifeAssuredDetails', 'GeneralQ9ListItems', 'GeneralQ9Items']);
        $scope.laGQ10Table = $scope.moduleService.findElementInDetail_V3(['LifeAssuredDetails', 'GeneralQ10ListItems', 'GeneralQ10Items']);
        $scope.laGQ12Table = $scope.moduleService.findElementInDetail_V3(['LifeAssuredDetails', 'GeneralQ12ListItems', 'GeneralQ12Item']);
        
        //PO health question
        //use for visible in json
        $scope.laHQ3Val = $scope.moduleService.findElementInDetail_V3(['LifeAssuredDetails', 'HealthQ3','QValue']);
        $scope.laHQ4aVal = $scope.moduleService.findElementInDetail_V3(['LifeAssuredDetails', 'HealthQ4a','QValue']);
        $scope.laHQ4bVal =  $scope.moduleService.findElementInDetail_V3(['LifeAssuredDetails', 'HealthQ4b','QValue']);
        $scope.laHQ5cVal =  $scope.moduleService.findElementInDetail_V3(['LifeAssuredDetails', 'HealthQ5c','QValue']);
        $scope.laHQ5dVal =  $scope.moduleService.findElementInDetail_V3(['LifeAssuredDetails', 'HealthQ5d','QValue']);
        $scope.laHQ5eVal =  $scope.moduleService.findElementInDetail_V3(['LifeAssuredDetails', 'HealthQ5e','QValue']);

        // PO health question 6c
        $scope.laHQ6cModelQKey =  $scope.moduleService.findElementInDetail_V3(['LifeAssuredDetails', 'HealthQ6c', 'QKey']);
        $scope.laHQ6cModelHealthQNormalOrSpontan =  $scope.moduleService.findElementInDetail_V3(['LifeAssuredDetails', 'HealthQ6c', 'HealthQNormalOrSpontan']);
        $scope.laHQ6cModelHealthQOperasiOrCaesar =  $scope.moduleService.findElementInDetail_V3(['LifeAssuredDetails', 'HealthQ6c', 'HealthQOperasiOrCaesar']);
        $scope.laHQ6cModelHealthQVacum =  $scope.moduleService.findElementInDetail_V3(['LifeAssuredDetails', 'HealthQ6c', 'HealthQVacum']);
        $scope.laHQ6cModelHealthQForceps =  $scope.moduleService.findElementInDetail_V3(['LifeAssuredDetails', 'HealthQ6c', 'HealthQForceps']);
        $scope.laHQ6cModelHealthQOthers =  $scope.moduleService.findElementInDetail_V3(['LifeAssuredDetails', 'HealthQ6c', 'HealthQOthers']);

        // PO health question 6i
        $scope.laHQ6iModelQKey =  $scope.moduleService.findElementInDetail_V3(['LifeAssuredDetails', 'HealthQ6i', 'QKey']);
        $scope.laHQ6iModelHealthQMaternityHospital =  $scope.moduleService.findElementInDetail_V3(['LifeAssuredDetails', 'HealthQ6i', 'HealthQMaternityHospital']);
        $scope.laHQ6iModelHealthQHospital =  $scope.moduleService.findElementInDetail_V3(['LifeAssuredDetails', 'HealthQ6i', 'HealthQHospital']);
        $scope.laHQ6iModelHealthQOthers =  $scope.moduleService.findElementInDetail_V3(['LifeAssuredDetails', 'HealthQ6i', 'HealthQOthers']);
        // PO health question 6j
        $scope.laHQ6jModelQKey =  $scope.moduleService.findElementInDetail_V3(['LifeAssuredDetails', 'HealthQ6j', 'QKey']);

        // PO health questions table
        $scope.laHQ1Table = $scope.moduleService.findElementInDetail_V3(['LifeAssuredDetails', 'HealthQ1Items']);
        $scope.laHQ3Table = $scope.moduleService.findElementInDetail_V3(['LifeAssuredDetails', 'HealthQ3', 'HealthQ3Item']);
        $scope.laHQ4aTable = $scope.moduleService.findElementInDetail_V3(['LifeAssuredDetails', 'HealthQ4a', 'HealthQ4Details']);
        $scope.laHQ4bTable = $scope.moduleService.findElementInDetail_V3(['LifeAssuredDetails','HealthQ4b', 'HealthQ4Details']);
        $scope.laHQ5cTable = $scope.moduleService.findElementInDetail_V3(['LifeAssuredDetails', 'HealthQ5c', 'HealthQ5cItem']);
        $scope.laHQ5dTable = $scope.moduleService.findElementInDetail_V3(['LifeAssuredDetails', 'HealthQ5d', 'HealthQ5dItem']);
        $scope.laHQ6jTable = $scope.moduleService.findElementInDetail_V3(['LifeAssuredDetails', 'HealthQ6j', 'HealthQ6jItem']);
    }
    
    //RUL filter occupation by industry
    $scope.filterOcupationPO = function (){
		applicationUIService.occupationListPO = $filter('filterByGroup')(applicationUIService.findElementInElement_V3(applicationUIService.lazyChoiceList, ['PO_Occupation']).Option, applicationUIService.findElementInDetail_V3(['ProporserInformation', 'BusinessIndustry']).Value);

	}
    //RUL filter occupation by industry
    $scope.filterOcupationLA = function (){
		applicationUIService.occupationListLA = $filter('filterByGroup')(applicationUIService.findElementInElement_V3(applicationUIService.lazyChoiceList, ['PO_Occupation']).Option, applicationUIService.findElementInDetail_V3(['LifeAssuredInformation', 'BusinessIndustry']).Value);
	}
    
    //RUL append data of policy owner from illustration
    $scope.appendPOfromIllustration = function() {
        $scope.moduleService.findElementInDetail_V3(['ProporserInformation', 'Title']).Value = illustrationUIService.findElementInDetail_V3(['PolicyOwnerInformation', 'Title']).Value;
        $scope.moduleService.findElementInDetail_V3(['ProporserInformation', 'FullName']).$ = illustrationUIService.findElementInDetail_V3(['PolicyOwnerInformation', 'FullName']).$;
        $scope.moduleService.findElementInDetail_V3(['ProporserInformation', 'BirthDate']).$ = illustrationUIService.findElementInDetail_V3(['PolicyOwnerInformation', 'BirthDate']).$;
        $scope.moduleService.findElementInDetail_V3(['ProporserInformation', 'Age']).$ = illustrationUIService.findElementInDetail_V3(['PolicyOwnerInformation', 'Age']).$;
        $scope.moduleService.findElementInDetail_V3(['ProporserInformation', 'Gender']).Value = illustrationUIService.findElementInDetail_V3(['PolicyOwnerInformation','Gender']).Value;
        $scope.moduleService.findElementInDetail_V3(['ProporserInformation', 'SmokerStatus']).Value = illustrationUIService.findElementInDetail_V3(['PolicyOwnerInformation', 'SmokerStatus']).Value;
        $scope.moduleService.findElementInDetail_V3(['ProporserInformation', 'BusinessIndustry']).Value = illustrationUIService.findElementInDetail_V3(['PolicyOwnerInformation', 'BusinessIndustry']).Value;
        $scope.moduleService.findElementInDetail_V3(['ProporserInformation', 'Occupation']).Value = illustrationUIService.findElementInDetail_V3(['PolicyOwnerInformation', 'Occupation']).Value;
        $scope.moduleService.findElementInDetail_V3(['ProporserInformation', 'MaritalStatus']).Value = illustrationUIService.findElementInDetail_V3(['PolicyOwnerInformation', 'MaritalStatus']).Value;
        $scope.moduleService.findElementInDetail_V3(['ProporserInformation', 'Nationality']).Value = illustrationUIService.findElementInDetail_V3(['PolicyOwnerInformation', 'Nationality']).Value;
        $scope.moduleService.findElementInDetail_V3(['ProporserInformation', 'Salutation']).$ = illustrationUIService.findElementInDetail_V3(['PolicyOwnerInformation', 'Salutation']).$;
        $scope.moduleService.findElementInDetail_V3(['ProporserInformation', 'SuffixName']).$ = illustrationUIService.findElementInDetail_V3(['PolicyOwnerInformation', 'SuffixName']).$;
    }
    
	//RUL append data of life insured from illustration
    $scope.appendLAfromIllustration = function(dataKeys) {	
        $scope.moduleService.findElementInDetail_V3(['LifeAssuredInformation', 'Title']).Value = illustrationUIService.findElementInDetail_V3(['LifeInsuredInformation', 'Title']).Value;
		$scope.moduleService.findElementInDetail_V3(['LifeAssuredInformation', 'FullName']).$ = illustrationUIService.findElementInDetail_V3(['LifeInsuredInformation', 'FullName']).$;
		$scope.moduleService.findElementInDetail_V3(['LifeAssuredInformation', 'BirthDate']).$ = illustrationUIService.findElementInDetail_V3(['LifeInsuredInformation', 'BirthDate']).$;
		$scope.moduleService.findElementInDetail_V3(['LifeAssuredInformation', 'Age']).$ = illustrationUIService.findElementInDetail_V3(['LifeInsuredInformation', 'Age']).$;
		$scope.moduleService.findElementInDetail_V3(['LifeAssuredInformation', 'Gender']).Value = illustrationUIService.findElementInDetail_V3(['LifeInsuredInformation', 'Gender']).Value;
		$scope.moduleService.findElementInDetail_V3(['LifeAssuredInformation', 'SmokerStatus']).Value = illustrationUIService.findElementInDetail_V3(['LifeInsuredInformation', 'SmokerStatus']).Value;
		$scope.moduleService.findElementInDetail_V3(['LifeAssuredInformation', 'BusinessIndustry']).Value = illustrationUIService.findElementInDetail_V3(['LifeInsuredInformation', 'BusinessIndustry']).Value;
		$scope.moduleService.findElementInDetail_V3(['LifeAssuredInformation', 'Occupation']).Value = illustrationUIService.findElementInDetail_V3(['LifeInsuredInformation', 'Occupation']).Value;
		$scope.moduleService.findElementInDetail_V3(['LifeAssuredInformation', 'MaritalStatus']).Value = illustrationUIService.findElementInDetail_V3(['LifeInsuredInformation', 'MaritalStatus']).Value;
		$scope.moduleService.findElementInDetail_V3(['LifeAssuredInformation', 'Nationality']).Value = illustrationUIService.findElementInDetail_V3(['LifeInsuredInformation', 'Nationality']).Value;
		$scope.moduleService.findElementInDetail_V3(['LifeAssuredInformation', 'Salutation']).$ = illustrationUIService.findElementInDetail_V3(['LifeInsuredInformation', 'Salutation']).$;
		$scope.moduleService.findElementInDetail_V3(['LifeAssuredInformation', 'SuffixName']).$ = illustrationUIService.findElementInDetail_V3(['LifeInsuredInformation', 'SuffixName']).$;
    }
    
   /*
    * lpham24 2016/08/07
    * Copy data from  PolicyOwnerInformation to CorrespondenceAddress 
    * */
    $scope.checkEnableAllfield = function ()
    {
    	$scope.valueSelectAddress= this.valueSelectAddress;
    	if($scope.valueSelectAddress=='Y'){
    		
    		
    		$scope.moduleService.findElementInDetail_V3(['CorrespondenceAddress', 'Postal']).$ = $scope.moduleService.findElementInDetail_V3(['PolicyOwnerInformation', 'Postal']).$;
    		$scope.moduleService.findElementInDetail_V3(['CorrespondenceAddress', 'BlkHouseNo']).$ = $scope.moduleService.findElementInDetail_V3(['PolicyOwnerInformation', 'BlkHouseNo']).$;    	
    		$scope.moduleService.findElementInDetail_V3(['CorrespondenceAddress', 'Street']).$ = $scope.moduleService.findElementInDetail_V3(['PolicyOwnerInformation', 'Street']).$;
    		$scope.moduleService.findElementInDetail_V3(['CorrespondenceAddress', 'UnitNo']).$ = $scope.moduleService.findElementInDetail_V3(['PolicyOwnerInformation', 'UnitNo']).$;  
    		$scope.moduleService.findElementInDetail_V3(['CorrespondenceAddress', 'Building']).$ = $scope.moduleService.findElementInDetail_V3(['PolicyOwnerInformation', 'Building']).$;
    		$scope.moduleService.findElementInDetail_V3(['CorrespondenceAddress', 'Province']).Value = $scope.moduleService.findElementInDetail_V3(['PolicyOwnerInformation', 'Province']).Value;  
    		$scope.moduleService.findElementInDetail_V3(['CorrespondenceAddress', 'CityCd']).Value= $scope.moduleService.findElementInDetail_V3(['PolicyOwnerInformation', 'CityCd']).Value;
    		$scope.moduleService.findElementInDetail_V3(['CorrespondenceAddress', 'Country']).Value = $scope.moduleService.findElementInDetail_V3(['PolicyOwnerInformation', 'Country']).Value;  
    	
    	} else {
    		
    		$scope.moduleService.findElementInDetail_V3(['CorrespondenceAddress', 'Postal']).$ = '';
    		$scope.moduleService.findElementInDetail_V3(['CorrespondenceAddress', 'BlkHouseNo']).$ = '';    	
    		$scope.moduleService.findElementInDetail_V3(['CorrespondenceAddress', 'Street']).$ = '';
    		$scope.moduleService.findElementInDetail_V3(['CorrespondenceAddress', 'UnitNo']).$ = '';  
    		$scope.moduleService.findElementInDetail_V3(['CorrespondenceAddress', 'Building']).$ = '';
    		$scope.moduleService.findElementInDetail_V3(['CorrespondenceAddress', 'Province']).Value = '';  
    		$scope.moduleService.findElementInDetail_V3(['CorrespondenceAddress', 'CityCd']).Value = '';
    		$scope.moduleService.findElementInDetail_V3(['CorrespondenceAddress', 'Country']).Value = '';
    		
    	}
    
    	
    }
    $scope.changeDataAllfield=function(elementName){
    	if($scope.valueSelectAddress=='Y'){
    		if($scope.moduleService.findElementInDetail_V3(['PolicyOwnerInformation', elementName]).$ != undefined){
        		$scope.moduleService.findElementInDetail_V3(['CorrespondenceAddress', elementName]).$ = $scope.moduleService.findElementInDetail_V3(['PolicyOwnerInformation', elementName]).$;
        	}
        	else{
        		$scope.moduleService.findElementInDetail_V3(['CorrespondenceAddress', elementName]).Value = $scope.moduleService.findElementInDetail_V3(['PolicyOwnerInformation', elementName]).Value;
        	}
    	}
    }
    /**
     *  for MNC Direct Total Care, print pdf for specified plan
     *  podan3 & hle56
     */    
    $scope.printQuotationPdfForMNCMotor = function(){
    	var plan = illustrationUIService.findElementInDetail_V3(['PlanType']).Value;
    	if (plan === 'MVP01') {
    		$scope.printPdf('standard');
		} else if (plan === 'MVP02') {
			$scope.printPdf('complete');
		} else if (plan === 'MVP03') {
			$scope.printPdf('tlo');
		}
    }
    
    //update LI name for GTravel
    $scope.updateLIName_GroupTravel = function updateLIName_GroupTravel(){
        if (applicationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.TRAVEL
                && applicationUIService.productName == commonService.CONSTANTS.PRODUCT.GROUP_TRAVEL_EXPRESS){                    
            var liName = $scope.salecaseService.findElementInDetail_V3(['LIName']);
            var LInsured = applicationUIService.findElementInDetail_V3(['PolicyOwnerInformation', 'CorporateName']);
            if (liName && LInsured){
                liName.$ = LInsured.$;
            } 
        }
    }
    
    //update and save LI name for GTravel
    $scope.saveLIName_GroupTravel = function saveLIName_GroupTravel (){
        var deferred = illustrationUIService.$q.defer();
        if (applicationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.TRAVEL
                && applicationUIService.productName == commonService.CONSTANTS.PRODUCT.GROUP_TRAVEL_EXPRESS){
            $scope.updateLIName_GroupTravel();
               salecaseUIService.saveDetail_V3($scope.resourceURL, false).then(function(){
                   deferred.resolve();
               });
        }else{
            deferred.resolve();
        }
        return deferred.promise;
    }
    
}];

