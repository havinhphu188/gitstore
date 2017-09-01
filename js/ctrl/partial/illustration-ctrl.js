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
var IllustrationDetailCtrl = ['$rootScope', 'underwritingUIService', '$filter', '$scope', '$log', '$mdDialog', 'ajax', '$state', 'commonService', 'commonUIService', 'prospectUIService', 'illustrationUIService', 'salecaseUIService', 'prospectPersonalUIService', 'policyUIService', 'printPdfService', '$http', 'urlService', '$translate', 'loadingBarService',
	function($rootScope, underwritingUIService, $filter, $scope, $log, $mdDialog, ajax, $state, commonService, commonUIService, prospectUIService, illustrationUIService, salecaseUIService, prospectPersonalUIService, policyUIService, printPdfService, $http, urlService, $translate, loadingBarService) {
	
	$scope.moduleService = illustrationUIService;
	$scope.salecaseService = salecaseUIService;
	$scope.commonUIService = commonUIService;
	illustrationUIService.productName = salecaseUIService.product;
	illustrationUIService.group = illustrationUIService.getProductGroup_V3(illustrationUIService.productName);
	$scope.docId = $state.params.docId;
	$scope.printPdfService = printPdfService;
	$scope.contextPathTheme = angular.contextPathTheme;
	$scope.modulePolicyService = policyUIService;
	var currentDate = new Date();
    $scope.illustrationCurrentDate = currentDate;
	$scope.illustrationMaxDate = (currentDate.getFullYear()+100) + "-01-01";
    $scope.illustrationMaxDateForAnnual = (currentDate.getFullYear()+101) + "-01-01";
	$scope.illustrationMinDate = (currentDate.getFullYear()-100) + "-01-01";
	$scope.testMax = 100;
	$scope.moduleService.acceptedQuotationID = undefined;
	//get active role to show/hide accept button by role
	$scope.activeRole = commonUIService.getActiveUserRole();
	//for DS UW
	$scope.underwritingService = underwritingUIService;
	
	//for MNC Travel
	var travelPlans = { //MNC Travel plan config
		"TRP01": { //Travel - Platinum Individual
			isFamilyPlan: false
		},
		"TRP02": { //Travel - Platinum Family
			isFamilyPlan: true
		},
		"TRP03": { //Travel - Gold Individual
			isFamilyPlan: false
		},
		"TRP04": { //Travel - Gold Family
			isFamilyPlan: true
		},
		"TRP05": { //Travel - Silver Individual
			isFamilyPlan: false
		},
		"TRP06": { //Travel - Silver Family
			isFamilyPlan: true
		}
	}
	
	//for MNC Travel
	$scope.travelRegionList = [];
	$scope.travelPlanList = [];
	
	//$scope.isNewFile = false;
	//for GTL1
	$scope.organisationDistArray = [
	                                {"key":"",
	                                	  "ageListVal":[{"age":"","val":""},{"age":"","val":""},{"age":"","val":""},{"age":"","val":""},{"age":"","val":""}]
	                                }];
	$scope.organisationDistObjTemplate = {"key":"",
      	  "ageListVal":[{"age":"","val":""},{"age":"","val":""},{"age":"","val":""},{"age":"","val":""},{"age":"","val":""}]};
	$scope.addOccupationClass = function(){
		$log.debug("GTL1 - Add Occupation Class");
		var a = angular.copy($scope.organisationDistObjTemplate);
		$scope.organisationDistArray.push(a);
	};
	
	$scope.removeOccupationClass = function(index){
		$log.debug("GTL1 - Remove Occupation Class");
		$scope.organisationDistArray.splice(index,1);
	};
	
	$scope.prepareOrganisationDistToCompute = function(){
		$log.debug("GTL1 - Prepare Organisation Dist To Compute");
		var count=0;
		illustrationUIService.convertObjectEleToArray(illustrationUIService.findElementInDetail_V3(['OccupClasses']),['OccupClass']);
		for (var i=0;i<$scope.organisationDistArray.length;i++){
			if ($scope.organisationDistArray[i].key!==null){
				for(var j=0;j<$scope.organisationDistArray[i].ageListVal.length;j++){
					var temp = illustrationUIService.findElementInDetail_V3(['OccupClasses','OccupClass'])[count];
					if (temp==undefined){
						illustrationUIService.addElementInElement_V3(illustrationUIService.detail,['OccupClasses'],['OccupClass']);
						temp = illustrationUIService.findElementInDetail_V3(['OccupClasses','OccupClass'])[count];
					}
					illustrationUIService.findElementInElement_V3(temp,['OccupClassCd']).$ = $scope.organisationDistArray[i].key;
					illustrationUIService.findElementInElement_V3(temp,['UpToAgeOfOccupClassVal']).$ = $scope.organisationDistArray[i].ageListVal[j].val;
					count++;
				}
			}
		}
	}
	
	function initOrganisationDist(){
		$log.debug("GTL1 - Init Organisation Dist");
		var count=0;
		var empDistTemp = illustrationUIService.findElementInDetail_V3(['illustration:OccupClass']);
		if (empDistTemp.length != undefined && empDistTemp.length>=5){
			for (var i=0;i<empDistTemp.length;i++){
				$scope.organisationDistArray[count].key = illustrationUIService.findElementInElement_V3(empDistTemp[i],['OccupClassCd']).$;
				for (var j=0;j<5;j++){
					$scope.organisationDistArray[count].ageListVal[j].val = illustrationUIService.findElementInElement_V3(empDistTemp[count*5+j],['UpToAgeOfOccupClassVal']).$
				}
				count++;
				i+=4;
			}
		} 
		else $scope.organisationDistArray[0].key = illustrationUIService.findElementInElement_V3(empDistTemp,['OccupClassCd']).$;
	}
	//End--for GTL1
	
	
	$scope.refreshTags = function (element, card, removeTemplateChildren){
		var deferred = illustrationUIService.$q.defer();
        illustrationUIService.refreshTags($scope.resourceURL, element).then(function(data){
        	if (illustrationUIService.isSuccess(data)) {
	            if (card) $scope.markValidCard(card); //Check VALID on Card
	            $scope.reSetupConcreteUiStructure(illustrationUIService.detail, $scope.getAssociateUiStructureRoot().isDetailChanged, removeTemplateChildren); // refresh the values in multiple cards
	            deferred.resolve(true);
        	} else deferred.resolve();
        });
        return deferred.promise;
    }
	
	
	//for term life secure
	//cash back saver
	//Hide life insured card
	if (illustrationUIService.gcsAddNewLifeInsured == undefined){
		if (illustrationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.UNIT_LINK
				|| illustrationUIService.productName == commonService.CONSTANTS.PRODUCT.REGULAR_UNIT_LINK
				|| illustrationUIService.productName == commonService.CONSTANTS.PRODUCT.ENDOWMENT){
			$scope.refreshTags([["LAIsTheSameWithPO"], ["LifeInsured"]]).then(function(){
				illustrationUIService.gcsAddNewLifeInsured = false;
			});
		} else {
			illustrationUIService.gcsAddNewLifeInsured = false;
		}
	}
	
	//RUL copy information of Proposer to Life Insured if they are the same when init
    $scope.populatePOToLI = function populatePOToLI () {
		if(illustrationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.UNIT_LINK
				|| illustrationUIService.productName == commonService.CONSTANTS.PRODUCT.REGULAR_UNIT_LINK
				|| illustrationUIService.productName == commonService.CONSTANTS.PRODUCT.ENDOWMENT){

			if(commonService.hasValueNotEmpty(illustrationUIService.findElementInDetail_V3(['LifeInsuredInformation'])['@refUid'])){

        		if(illustrationUIService.findElementInDetail_V3(['LifeInsuredInformation'])['@refUid'] 
        		!= illustrationUIService.findElementInDetail_V3(['PolicyOwnerInformation'])['@refUid']){
        			illustrationUIService.gcsAddNewLifeInsured = true;
        		}
    		}
    		if(illustrationUIService.gcsAddNewLifeInsured == false
	    		|| (illustrationUIService.findElementInDetail_V3(['LAIsTheSameWithPO']) && illustrationUIService.findElementInDetail_V3(['LAIsTheSameWithPO']).Value == 'Y')) {
	    		illustrationUIService.findElementInDetail_V3(['LifeInsuredInformation'])['@refUid'] = illustrationUIService.findElementInDetail_V3(['PolicyOwnerInformation'])['@refUid'];
	    		illustrationUIService.findElementInDetail_V3(['LifeInsured','Title']).Value = illustrationUIService.findElementInDetail_V3(['PolicyOwner','Title']).Value;
	    		illustrationUIService.findElementInDetail_V3(['LifeInsured','FullName']).$ = illustrationUIService.findElementInDetail_V3(['PolicyOwner','FullName']).$;
	    		illustrationUIService.findElementInDetail_V3(['LifeInsured','BirthDate']).$ = illustrationUIService.findElementInDetail_V3(['PolicyOwner','BirthDate']).$;
	    		illustrationUIService.findElementInDetail_V3(['LifeInsured','Gender']).Value = illustrationUIService.findElementInDetail_V3(['PolicyOwner','Gender']).Value;
	    		illustrationUIService.findElementInDetail_V3(['LifeInsured','SmokerStatus']).Value = illustrationUIService.findElementInDetail_V3(['PolicyOwner','SmokerStatus']).Value;
	    		illustrationUIService.findElementInDetail_V3(['LifeInsured','BusinessIndustry']).Value = illustrationUIService.findElementInDetail_V3(['PolicyOwner','BusinessIndustry']).Value;
	    		//illustrationUIService.findElementInDetail_V3(['LifeInsured','AddressType']).Value = illustrationUIService.findElementInDetail_V3(['PolicyOwner','AddressType']).Value;
	    		illustrationUIService.findElementInDetail_V3(['LifeInsured','MaritalStatus']).Value = illustrationUIService.findElementInDetail_V3(['PolicyOwner','MaritalStatus']).Value;
				illustrationUIService.findElementInDetail_V3(['LifeInsured','Nationality']).Value = illustrationUIService.findElementInDetail_V3(['PolicyOwner','Nationality']).Value;
				illustrationUIService.findElementInDetail_V3(['LifeInsured','Occupation']).Value = illustrationUIService.findElementInDetail_V3(['PolicyOwner','Occupation']).Value;
				
				// For mnc link only, change title to salutation
				if(illustrationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.UNIT_LINK
						|| illustrationUIService.productName == commonService.CONSTANTS.PRODUCT.ENDOWMENT) {
					illustrationUIService.findElementInDetail_V3(['LARelationship']).Value = "13";
					illustrationUIService.findElementInDetail_V3(['LifeInsured','Salutation']).$ = illustrationUIService.findElementInDetail_V3(['PolicyOwner','Salutation']).$;
					illustrationUIService.findElementInDetail_V3(['LifeInsured','SuffixName']).$ = illustrationUIService.findElementInDetail_V3(['PolicyOwner','SuffixName']).$;
				}
    		}
		}
    };
    
	//for regular unit link
	if(illustrationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.UNIT_LINK
			|| illustrationUIService.productName == commonService.CONSTANTS.PRODUCT.REGULAR_UNIT_LINK
			|| illustrationUIService.productName == commonService.CONSTANTS.PRODUCT.ENDOWMENT){
		if(illustrationUIService.findElementInDetail_V3(['LAIsTheSameWithPO'])
			&& (illustrationUIService.findElementInDetail_V3(['LAIsTheSameWithPO']).Value == undefined || illustrationUIService.findElementInDetail_V3(['LAIsTheSameWithPO']).Value == '')) {
			illustrationUIService.findElementInDetail_V3(['LAIsTheSameWithPO']).Value = 'Y';
		}
	}
	//for DS GCS
	if(illustrationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.TERM_LIFE
			&& illustrationUIService.productName != commonService.CONSTANTS.PRODUCT.REGULAR_UNIT_LINK){
		if(illustrationUIService.findElementInDetail_V3(['LARelationship'])
			&& (illustrationUIService.findElementInDetail_V3(['LARelationship']).Value == undefined || illustrationUIService.findElementInDetail_V3(['LARelationship']).Value == '')) {
			illustrationUIService.findElementInDetail_V3(['LARelationship']).Value = 'Y';
		}
	}
	$scope.isLastQuotation = false;
	if(($scope.salecaseService.product == 'FIR' || $scope.salecaseService.product == commonService.CONSTANTS.PRODUCT.GUARANTEED_CASHBACK || $scope.salecaseService.product == commonService.CONSTANTS.PRODUCT.DS_GUARANTEED_CASHBACK
			|| $scope.salecaseService.product == 'term-life-secure' || $scope.salecaseService.product == commonService.CONSTANTS.PRODUCT.REGULAR_UNIT_LINK || $scope.salecaseService.product == commonService.CONSTANTS.PRODUCT.ENDOWMENT)
		&& commonUIService.getActiveUserRole() == commonService.CONSTANTS.USER_ROLES.UW){
		if($scope.salecaseService.findElementInDetail_V3(['Underwriting'])['@refUid'] != undefined
				&& $scope.salecaseService.findElementInDetail_V3(['Underwriting'])['@refUid'] != ''){
					var uidUW = $scope.salecaseService.findElementInDetail_V3(['Underwriting'])['@refUid'];
					underwritingUIService.findDocument_V3($scope.resourceURL, uidUW).then(function(data){
						if (underwritingUIService.isSuccess(data)) {
							var result = underwritingUIService.findElementInDetail_V3(['DocStatus'])['BusinessStatus']; 
							if(result == 'COUNTER-OFFERED'){
								var quotationList = salecaseUIService.findElementInDetail_V3(['Quotations']);
								if(commonService.hasValue(quotationList) && quotationList['@counter'] > 1) {
									
									var quotations = salecaseUIService.findElementInElement_V3(quotationList, ['Quotation']);
									var quotationCurrentId = illustrationUIService.findElementInDetail_V3(['DocId']);
									var quotationId = illustrationUIService.findElementInElement_V3(quotations[quotations.length - 1], ['QuotationId']);
									if(commonService.hasValue(quotationId) && commonService.hasValue(quotationId.$)) {
										if(quotationCurrentId == quotationId.$){
											if($scope.salecaseService.product != commonService.CONSTANTS.PRODUCT.REGULAR_UNIT_LINK){
												if($scope.moduleService.findElementInDetail_V3(['DocStatus'])['BusinessStatus'] == "DRAFT"){
													$scope.moduleService.findElementInDetail_V3(['Loading']).$ = '';
												}
												if($scope.salecaseService.product == commonService.CONSTANTS.PRODUCT.GUARANTEED_CASHBACK ||
														$scope.salecaseService.product == 'term-life-secure' || $scope.salecaseService.product == commonService.CONSTANTS.PRODUCT.DS_GUARANTEED_CASHBACK) {
													$scope.moduleService.findElementInDetail_V3(['Reason']).Value = '';
												}
											}
											$scope.isLastQuotation = true;
										}
									}
								}
							}
						}
				});
					
		}
		
	}
	
	$scope.nCDFrom = [{"value": "Company 1","group": "" },{"value": "Company 2","group": ""},{"value": "Company 2","group": ""}];
   
	
	$scope.checkUnderwriterQuotation = function() {
    	var thisQuotationId = illustrationUIService.findElementInDetail_V3(['DocId']);
    	var listQuotation = salecaseUIService.findElementInDetail_V3(['Quotations','Quotation']);
    	var flag = false;
    	angular.forEach(listQuotation, function(item){
			if((thisQuotationId == item['@refUid']) && (item['@uq'] == 'Y'))
				flag = true;
		});
    	return flag;
	};
	
	
	// freeze Quotation
	if(illustrationUIService.findElementInDetail_V3(['BusinessStatus']) == "ACCEPTED"){
		illustrationUIService.freeze = true;
	}else{
		if ($scope.activeRole != commonService.CONSTANTS.USER_ROLES.UW && $scope.checkUnderwriterQuotation() == true){
			illustrationUIService.freeze = true;
		}else{
			illustrationUIService.freeze = false;
		}
	};
	
	$scope.getComputeLazy = function(){
		var deferred = illustrationUIService.$q.defer();
		if(!commonService.hasValueNotEmpty(illustrationUIService.lazyChoiceList[illustrationUIService.productName])){
			illustrationUIService.getIllustrationLazyList($scope.resourceURL, illustrationUIService.productName).then(function(data){
				if(illustrationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.FIRE){
					illustrationUIService.PerilFEAOtherType = illustrationUIService.findElementInElement_V3(illustrationUIService.lazyChoiceList[illustrationUIService.productName], ['PerilFEAOtherType']).Option;
				}
				if (illustrationUIService.productName == commonService.CONSTANTS.PRODUCT.TRAVEL_EXPRESS ||
					illustrationUIService.productName == commonService.CONSTANTS.PRODUCT.DIRECT_TRAVEL) {
					var typeOfTravel = illustrationUIService.findElementInDetail_V3(['TypeOfTravel']).Value;
					if (commonService.hasValueNotEmpty(typeOfTravel)) {
						$scope.refreshTravelRegionList(typeOfTravel, 'Region');
					}
				}
				deferred.resolve(data);
			});
		} else deferred.resolve();
		return deferred.promise;
	};
	
	//Scope for prospect list
/*	$scope.selected = undefined;*/
	$scope.setProspectName = function(element,object){
		illustrationUIService.findElementInDetail_V3([element]).$ = object.FullName;
	};
	
	//for illustration of cashback saver
	$scope.addNewLifeInsured = function($event){
		
		illustrationUIService.clearDataInJson(illustrationUIService.findElementInDetail_V3(['LifeInsuredInformation']));
		this.closeChildCards(2, $event);
		
		if(illustrationUIService.findElementInDetail_V3(['LAIsTheSameWithPO'])) {
			illustrationUIService.findElementInDetail_V3(['LAIsTheSameWithPO']).Value = 'N'
		}
		
		
		if (illustrationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.UNIT_LINK
				|| illustrationUIService.productName == commonService.CONSTANTS.PRODUCT.REGULAR_UNIT_LINK
				|| illustrationUIService.productName == commonService.CONSTANTS.PRODUCT.ENDOWMENT){
			$scope.refreshTags([["LAIsTheSameWithPO"], ["LifeInsured"]]).then(function(){
				
				illustrationUIService.gcsAddNewLifeInsured = true;
			});
		} else {
			illustrationUIService.gcsAddNewLifeInsured = true;
		}
		// $scope.refreshCardsOnScreen();
	};
	
	//for MNC endowment
	$scope.showLifeInsuredCard = function($event) {
		this.closeChildCards(2, $event);
		illustrationUIService.clearDataInJson(illustrationUIService.findElementInDetail_V3(['LifeInsuredInformation']));
	}
	
	$scope.addLifeInsuredCard = function($event){		
		illustrationUIService.clearDataInJson(illustrationUIService.findElementInDetail_V3(['LifeInsuredInformation']));
		
		illustrationUIService.findElementInDetail_V3(['LAIsTheSameWithPO']).Value = 'N';
		
		this.closeChildCards(3, $event);
		
		$scope.refreshTags([["LifeInsuredInformation"]]).then(function(){
			illustrationUIService.gcsAddNewLifeInsured = true;
		});
	};
	
	$scope.removeLifeInsured = function($event){
		illustrationUIService.gcsAddNewLifeInsured = false;
		illustrationUIService.clearDataInJson(illustrationUIService.findElementInDetail_V3(['LifeInsuredInformation']));
		if(illustrationUIService.findElementInDetail_V3(['LAIsTheSameWithPO'])) {
			illustrationUIService.findElementInDetail_V3(['LAIsTheSameWithPO']).Value = 'Y'
		}
		this.closeChildCards(2, $event);
		// $scope.refreshCardsOnScreen();
		if (illustrationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.UNIT_LINK
				|| illustrationUIService.productName == commonService.CONSTANTS.PRODUCT.REGULAR_UNIT_LINK
				|| illustrationUIService.productName == commonService.CONSTANTS.PRODUCT.ENDOWMENT){
			$scope.refreshTags([["LAIsTheSameWithPO"], ["LifeInsured"]]);
		} 
	};
	
	//for illustration of cashback saver - base plan
	$scope.setcashbackPayoutYear = function(){
		var payoutOption = $scope.moduleService.findElementInDetail_V3(['CashbackPayoutOption']).Value
		if(payoutOption =="P"){
			$scope.moduleService.findElementInDetail_V3(['CashbackPayoutYear']).Value = "2";
		}else if(payoutOption =="A"){
			$scope.moduleService.findElementInDetail_V3(['CashbackPayoutYear']).Value = "0";
		}
	};
	
	// get Prospect List in Case
	$scope.getProspectList = function(){
		var prospectInSC = salecaseUIService.findElementInDetail_V3(['Prospect']);
		if(prospectInSC != undefined && prospectInSC.length != undefined){
			salecaseUIService.chosenProspectList=[];
			prospectPersonalUIService.getDocumentList_V3($scope.resourceURL).then(function(prospectList) {
				var prospectList = prospectPersonalUIService.findElementInElement_V3(prospectList, ['MetadataDocument']);
				if(prospectList == undefined)
					return;				
				if (!$.isArray(prospectList)){
					var temp = prospectList;
					prospectList = [];
					prospectList.push(temp);
				}
				
				//remove existed prospect in policyonwer from propsect list
				if(illustrationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.TERM_LIFE
					|| illustrationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.UNIT_LINK
					|| illustrationUIService.productName == commonService.CONSTANTS.PRODUCT.ENDOWMENT){
					for(var i =0; i<prospectInSC.length;i++ ){
						for( var j=0;j<prospectList.length; j++){
							if(prospectInSC[i]['@refUid'] != prospectList[j].DocId)
								salecaseUIService.chosenProspectList.push(prospectList[j]);
						}
					}
				}
				else{
					for(var i =0; i<prospectInSC.length;i++ ){
						for( var j=0;j<prospectList.length; j++){
							if(prospectInSC[i]['@refUid'] == prospectList[j].DocId ){
								salecaseUIService.chosenProspectList.push(prospectList[j]);
							}
						}
					}
				}
				illustrationUIService.chosenProspectList = salecaseUIService.chosenProspectList;
				
				//load info's life insured on MainInsured card in the first time
				if (illustrationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.FOREIGN_WORKER){
					$scope.getMainInsured();
				}
			});
		}
	};
	$scope.getProspectList();
	
	$scope.importProspect = function(prospectDocId, otherDriverDetail){
		prospectPersonalUIService.findDocument_V3($scope.resourceURL, prospectDocId).then(function(data){
				var driver = undefined;
			// import into Other Driver
				if(otherDriverDetail){
					driver = otherDriverDetail;
				}
			// import into Main Driver
				else{
					driver = illustrationUIService.findElementInDetail_V3(['MainDriver']);
				}
				var P = prospectPersonalUIService.findElementInDetail_V3(['Personal']);
				for(var prop in P) {
					var value =  prospectPersonalUIService.findElementInDetail_V3([prop]).Value;
					var string =  prospectPersonalUIService.findElementInDetail_V3([prop]).$;
					if(value != undefined || string != undefined){
						var propValue = (prop.split(":"))[1];
						if(value != undefined){
							illustrationUIService.findElementInElement_V3(driver, [propValue]).Value = value;
    					//MD[prop].Value = value;
						}else{
							illustrationUIService.findElementInElement_V3(driver, [propValue]).$ = string;
    					//MD[prop].$ = string;
						}
					};
				};
    		//illustrationUIService.findElementInElement_V3(driver, ['Occupation']).Value = ''; // Occupation lazy list of Quotation uses other code to compute, so that we can't use Occupation code from Prospect
				illustrationUIService.findElementInElement_V3(driver, ['IDs','ID','IDType']).Value = prospectPersonalUIService.findElementInDetail_V3(['IDType']).Value;
				illustrationUIService.findElementInElement_V3(driver, ['IDs','ID','IDNumber']).$ = prospectPersonalUIService.findElementInDetail_V3(['IDNumber']).$;
				illustrationUIService.findElementInElement_V3(driver, ['PersonName','FullName']).$ = prospectPersonalUIService.findElementInDetail_V3(['FullName']).$;

    		$scope.reSetupConcreteUiStructure(illustrationUIService.detail); // refresh the values in multiple cards
		});
	};
	
	$scope.importStaff = function(prospectDocId, ServicingStaff){
			prospectPersonalUIService.findDocument_V3($scope.resourceURL, prospectDocId).then(function(data){
			var staffDoc = data;
			if (ServicingStaff) {
				illustrationUIService.findElementInDetail_V3(['ServicingStaffCd']).$ = prospectPersonalUIService.findElementInElement_V3(staffDoc,['FullName']).$;
			} else {
				illustrationUIService.findElementInDetail_V3(['MarketingStaffCd']).$ = prospectPersonalUIService.findElementInElement_V3(staffDoc,['FullName']).$;
			}
			var counter = parseInt(prospectPersonalUIService.findElementInElement_V3(staffDoc,['Contacts'])['@counter']);
    		var hasMobile = false;
    		if (counter == '0') {}
    		else {
    			if (counter == '1') {
    				var contactObjInformation = prospectPersonalUIService.findElementInElement_V3(staffDoc,['ContactInformation'])
    				var contactObjType = prospectPersonalUIService.findElementInElement_V3(staffDoc,['ContactType'])
    				if (commonService.hasValueNotEmpty(contactObjInformation.$) && contactObjType.Value == 'MOBILE_TEL'){
    					hasMobile = true;
    					if (ServicingStaff) {
    	    				illustrationUIService.findElementInDetail_V3(['PhoneNumberOfServicingStaff']).$ = prospectPersonalUIService.findElementInElement_V3(staffDoc,['ContactInformation']).$;
    	    			} else {
    	    				illustrationUIService.findElementInDetail_V3(['PhoneNumberOfMarketingStaff']).$ = prospectPersonalUIService.findElementInElement_V3(staffDoc,['ContactInformation']).$;
    	    			}
    	    			return;
    	    		}
    				} else {
    					for(var i = 0; i < counter; i++){
    						var contactObj = prospectPersonalUIService.findElementInElement_V3(staffDoc,['Contact'])[i];
    						if(commonService.hasValueNotEmpty(prospectPersonalUIService.findElementInElement_V3(contactObj,['ContactInformation']).$) && prospectPersonalUIService.findElementInElement_V3(staffDoc,['ContactType']).Value == 'MOBILE_TEL'){
    							hasMobile = true;
    							if (ServicingStaff) {
    								illustrationUIService.findElementInDetail_V3(['PhoneNumberOfServicingStaff']).$ = prospectPersonalUIService.findElementInElement_V3(staffDoc,['ContactInformation']).$;
    						} else {
    							illustrationUIService.findElementInDetail_V3(['PhoneNumberOfMarketingStaff']).$ = prospectPersonalUIService.findElementInElement_V3(staffDoc,['ContactInformation']).$;
    						}
	    			return;
    						}
    					}
    				}
	    		}
			if (!hasMobile) {
				if (ServicingStaff) {
					illustrationUIService.findElementInDetail_V3(['PhoneNumberOfServicingStaff']).$ = '';
				} else {
					illustrationUIService.findElementInDetail_V3(['PhoneNumberOfMarketingStaff']).$ = '';
				}
    		$scope.reSetupConcreteUiStructure(illustrationUIService.detail); // refresh the values in multiple cards
		}
    			});
	};
	
	$scope.selectedPropsect = undefined;
	$scope.importProspectGCS = function(prospect){
		prospectPersonalUIService.findDocument_V3($scope.resourceURL, prospect.DocId).then(function(data){
			illustrationUIService.findElementInDetail_V3(['LifeInsuredInformation'])['@refUid'] = illustrationUIService.findElementInElement_V3(data,['DocId']);
			illustrationUIService.findElementInDetail_V3(['LifeInsured','Title']).Value = illustrationUIService.findElementInElement_V3(data,['Title']).Value;
			illustrationUIService.findElementInDetail_V3(['LifeInsured','FullName']).$ = illustrationUIService.findElementInElement_V3(data,['FullName']).$;
			illustrationUIService.findElementInDetail_V3(['LifeInsured','BirthDate']).$ = illustrationUIService.findElementInElement_V3(data,['BirthDate']).$;
			illustrationUIService.findElementInDetail_V3(['LifeInsured','Gender']).Value = illustrationUIService.findElementInElement_V3(data,['Gender']).Value;
			illustrationUIService.findElementInDetail_V3(['LifeInsured','SmokerStatus']).Value = illustrationUIService.findElementInElement_V3(data,['SmokerStatus']).Value;
			illustrationUIService.findElementInDetail_V3(['LifeInsured','BusinessIndustry']).Value = illustrationUIService.findElementInElement_V3(data,['BusinessIndustry']).Value;
			illustrationUIService.findElementInDetail_V3(['LifeInsured','Occupation']).Value = illustrationUIService.findElementInElement_V3(data,['Occupation']).Value;
			illustrationUIService.findElementInDetail_V3(['LifeInsured','MaritalStatus']).Value = illustrationUIService.findElementInElement_V3(data,['MaritalStatus']).Value;
			illustrationUIService.findElementInDetail_V3(['LifeInsured','Nationality']).Value = illustrationUIService.findElementInElement_V3(data,['Nationality']).Value;
			
			// Extra field for MNC Link
			if(illustrationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.UNIT_LINK
					|| illustrationUIService.productName == commonService.CONSTANTS.PRODUCT.ENDOWMENT) {
				illustrationUIService.findElementInDetail_V3(['LifeInsured','Salutation']).$ = illustrationUIService.findElementInDetail_V3(['Salutation']).$;
				illustrationUIService.findElementInDetail_V3(['LifeInsured','SuffixName']).$ = illustrationUIService.findElementInDetail_V3(['SuffixName']).$;
			}
			$scope.reSetupConcreteUiStructure(illustrationUIService.detail)
		});
	};
	
	
	
	$scope.initDetail = function(){
		var self = this;
		if(illustrationUIService.productName == commonService.CONSTANTS.PRODUCT.GROUP_TERM_LIFE
				&& illustrationUIService.detail){
			$scope.policyOwner = {"name":""};
			$scope.policyOwner.name = salecaseUIService.findElementInDetail_V3(['PolicyOwner','CorporateName']).$;
			initOrganisationDist();
		 }
		//$scope.continueLastWorking();
		$scope.getComputeLazy().then(function(){
			if (illustrationUIService.isFirstInitialize == true) {
				if(illustrationUIService.detail == undefined || illustrationUIService.detail == null){
					illustrationUIService.initializeObject_V3(resourceUrl, docType, product).then(function gotDetail(detail){
						//$scope.init();
						
						illustrationUIService.findElementInDetail_V3(['DocInfo'])['DocName'] = illustrationUIService.genDefaultName();
						illustrationUIService.findElementInDetail_V3(['CaseID']).$ = salecaseUIService.findElementInDetail_V3(['DocId']);
						if(illustrationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.FIRE){	}					
						else if(illustrationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.FOREIGN_WORKER) {
							$scope.updateCurrencyByCountry();
						}
						else if (illustrationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.TERM_LIFE 
								&& illustrationUIService.productName == commonService.CONSTANTS.PRODUCT.REGULAR_UNIT_LINK
								&& illustrationUIService.findElementInDetail_V3(['BusinessStatus'])!="ACCEPTED"){
								$scope.filterOcupationPO();
								$scope.filterOcupationLA();
						}
						if ((illustrationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.UNIT_LINK || illustrationUIService.productName == commonService.CONSTANTS.PRODUCT.ENDOWMENT) 
								&& illustrationUIService.findElementInDetail_V3(['BusinessStatus'])!="ACCEPTED"){//RUL reload occupation list
							 $scope.filterOcupationPO();
							 $scope.filterOcupationLA();
						}		

						$log.debug("Init BI Responsed");
						illustrationUIService.isFirstInitialize = false;
						$scope.reSetupConcreteUiStructure(illustrationUIService.detail);
					});
				}
				else{
					//$scope.init();
					//import curent policy owner to illustration	
				 if(illustrationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.TERM_LIFE
				 	|| illustrationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.UNIT_LINK
				 	|| illustrationUIService.productName == commonService.CONSTANTS.PRODUCT.ENDOWMENT){
						var prospectDocId = salecaseUIService.findElementInDetail_V3(['Prospect'])[0]['case-management:ProspectId'].$;
						if(!illustrationUIService.findElementInDetail_V3(['PolicyOwnerInformation'])['@refUid'] && prospectDocId){
							prospectPersonalUIService.findDocument_V3($scope.resourceURL, prospectDocId).then(function(data){
								illustrationUIService.findElementInDetail_V3(['PolicyOwnerInformation'])['@refUid'] = prospectPersonalUIService.findElementInDetail_V3(['DocId']);
								illustrationUIService.findElementInDetail_V3(['PolicyOwner','Title']).Value = prospectPersonalUIService.findElementInDetail_V3(['Title']).Value;
								illustrationUIService.findElementInDetail_V3(['PolicyOwner','FullName']).$ = prospectPersonalUIService.findElementInDetail_V3(['FullName']).$;
								illustrationUIService.findElementInDetail_V3(['PolicyOwner','BirthDate']).$ = prospectPersonalUIService.findElementInDetail_V3(['BirthDate']).$;
								illustrationUIService.findElementInDetail_V3(['PolicyOwner','Gender']).Value = prospectPersonalUIService.findElementInDetail_V3(['Gender']).Value;
								illustrationUIService.findElementInDetail_V3(['PolicyOwner','SmokerStatus']).Value = prospectPersonalUIService.findElementInDetail_V3(['SmokerStatus']).Value;
								illustrationUIService.findElementInDetail_V3(['PolicyOwner','BusinessIndustry']).Value = prospectPersonalUIService.findElementInDetail_V3(['BusinessIndustry']).Value;
								illustrationUIService.findElementInDetail_V3(['PolicyOwner','Occupation']).Value = prospectPersonalUIService.findElementInDetail_V3(['Occupation']).Value;
//								illustrationUIService.findElementInDetail_V3(['PolicyOwner','AddressType']).Value = prospectPersonalUIService.findElementInDetail_V3(['AddressType']).Value;
								illustrationUIService.findElementInDetail_V3(['PolicyOwner','MaritalStatus']).Value = prospectPersonalUIService.findElementInDetail_V3(['MaritalStatus']).Value;
								illustrationUIService.findElementInDetail_V3(['PolicyOwner','Nationality']).Value = prospectPersonalUIService.findElementInDetail_V3(['Nationality']).Value;
								
								if (illustrationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.TERM_LIFE && 
										illustrationUIService.productName == commonService.CONSTANTS.PRODUCT.REGULAR_UNIT_LINK){
									$scope.filterOcupationPO();
									$scope.filterOcupationLA();
									$scope.computeTag([["PolicyOwner"], ["LifeInsured"], ["PolicyTerm"]]).then(function(data){
										if (illustrationUIService.findElementInDetail_V3(['BusinessStatus'])!="ACCEPTED"){
											$scope.reSetupConcreteUiStructure(illustrationUIService.detail);
										}
									});
								}
								// For mnc link only, change title to salutation
								if(illustrationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.UNIT_LINK
										|| illustrationUIService.productName == commonService.CONSTANTS.PRODUCT.ENDOWMENT) {
									illustrationUIService.findElementInDetail_V3(['PolicyOwner','Salutation']).$ = prospectPersonalUIService.findElementInDetail_V3(['Salutation']).$;
									illustrationUIService.findElementInDetail_V3(['PolicyOwner','SuffixName']).$ = prospectPersonalUIService.findElementInDetail_V3(['SuffixName']).$;
									
									//get filtered occupaption list
									$scope.filterOcupationPO();
									$scope.filterOcupationLA();
										
									$scope.computeTag([["PolicyOwner"], ["LifeInsured"], ["PolicyTerm"]]).then(function(data){
										if (illustrationUIService.findElementInDetail_V3(['BusinessStatus'])!="ACCEPTED"){
											$scope.reSetupConcreteUiStructure(illustrationUIService.detail);
										}
									});
								}
							});
						}
						
						if((illustrationUIService.findElementInDetail_V3(['LifeInsuredInformation'])['@refUid'] 
						!= illustrationUIService.findElementInDetail_V3(['PolicyOwnerInformation'])['@refUid']) && commonService.hasValueNotEmpty(illustrationUIService.findElementInDetail_V3(['LifeInsuredInformation'])['@refUid'])){
							illustrationUIService.gcsAddNewLifeInsured = true;
						}
					}
				
					illustrationUIService.findElementInDetail_V3(['DocInfo'])['DocName'] = illustrationUIService.genDefaultName();
					illustrationUIService.findElementInDetail_V3(['CaseID']).$ = salecaseUIService.findElementInDetail_V3(['DocId']);
					if(illustrationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.FIRE){
						//illustrationUIService.findElementInDetail_V3(['Register']).Value = 'S00001';
					} else if(illustrationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.FOREIGN_WORKER) {
						$scope.updateCurrencyByCountry();
					}

					
					$log.debug("Init BI Responsed");
					illustrationUIService.isFirstInitialize = false;
					$scope.reSetupConcreteUiStructure(illustrationUIService.detail);
				}
			}
			 else{
				 if(illustrationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.TERM_LIFE
					|| illustrationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.UNIT_LINK
					|| illustrationUIService.productName == commonService.CONSTANTS.PRODUCT.ENDOWMENT){
					 
					 if((illustrationUIService.findElementInDetail_V3(['LifeInsuredInformation'])['@refUid'] 
						!= illustrationUIService.findElementInDetail_V3(['PolicyOwnerInformation'])['@refUid']) && commonService.hasValueNotEmpty(illustrationUIService.findElementInDetail_V3(['LifeInsuredInformation'])['@refUid'])){
						illustrationUIService.gcsAddNewLifeInsured = true;
					 }
					 if ((illustrationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.UNIT_LINK || illustrationUIService.productName == commonService.CONSTANTS.PRODUCT.ENDOWMENT)  
						&& illustrationUIService.findElementInDetail_V3(['BusinessStatus'])!="ACCEPTED"){//RUL reload occupation list
						$scope.filterOcupationPO();
						$scope.filterOcupationLA();
					}	
				 }
			 }

			//for MNC endowment
		 	if(illustrationUIService.productName == commonService.CONSTANTS.PRODUCT.ENDOWMENT) 
	 		{
		 		if(commonService.hasValueNotEmpty(illustrationUIService.findElementInDetail_V3(['LifeInsuredInformation'])['@refUid'])
		 				&& illustrationUIService.findElementInDetail_V3(['LAIsTheSameWithPO']).Value == 'N')
		 			illustrationUIService.ShowLATile = 'Y';
		 		else
		 			illustrationUIService.ShowLATile = 'N';
	 		}
		})
    };
    
    $scope.saveInsuranceRoleAsProspect = function(insuranceRole) {
    	var deferred = illustrationUIService.$q.defer();
    	if (illustrationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.UNIT_LINK
    		|| illustrationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.TERM_LIFE
    		|| illustrationUIService.productName == commonService.CONSTANTS.PRODUCT.ENDOWMENT) {
    		if (insuranceRole == 'LifeInsuredInformation') {
	    		if (illustrationUIService.findElementInDetail_V3(['LAIsTheSameWithPO']) &&
	    			illustrationUIService.findElementInDetail_V3(['LAIsTheSameWithPO']).Value == 'Y') {
	    			illustrationUIService.findElementInDetail_V3([insuranceRole])['@refUid'] = illustrationUIService.findElementInDetail_V3(['PolicyOwnerInformation'])['@refUid'];
	    			deferred.resolve(true);
	    			return deferred.promise;
	    		}
    		}
    		var insuranceRoleId = illustrationUIService.findElementInDetail_V3([insuranceRole])['@refUid'];
    		var updateInsuranceRole = function(data) {
    			if (prospectPersonalUIService.isSuccess(data)) {
    				loadingBarService.showLoadingBar();
    				
	    			prospectPersonalUIService.findElementInDetail_V3(['Title']).Value = illustrationUIService.findElementInDetail_V3([insuranceRole,'Title']).Value;
					prospectPersonalUIService.findElementInDetail_V3(['FullName']).$ = illustrationUIService.findElementInDetail_V3([insuranceRole,'FullName']).$;
					prospectPersonalUIService.findElementInDetail_V3(['BirthDate']).$ = illustrationUIService.findElementInDetail_V3([insuranceRole,'BirthDate']).$;
					prospectPersonalUIService.findElementInDetail_V3(['Age']).$ = illustrationUIService.findElementInDetail_V3([insuranceRole,'Age']).$;
					prospectPersonalUIService.findElementInDetail_V3(['Gender']).Value = illustrationUIService.findElementInDetail_V3([insuranceRole,'Gender']).Value;
					prospectPersonalUIService.findElementInDetail_V3(['SmokerStatus']).Value = illustrationUIService.findElementInDetail_V3([insuranceRole,'SmokerStatus']).Value;
					prospectPersonalUIService.findElementInDetail_V3(['BusinessIndustry']).Value = illustrationUIService.findElementInDetail_V3([insuranceRole,'BusinessIndustry']).Value;
					prospectPersonalUIService.findElementInDetail_V3(['Occupation']).Value = illustrationUIService.findElementInDetail_V3([insuranceRole,'Occupation']).Value;
					prospectPersonalUIService.findElementInDetail_V3(['MaritalStatus']).Value = illustrationUIService.findElementInDetail_V3([insuranceRole,'MaritalStatus']).Value;
					prospectPersonalUIService.findElementInDetail_V3(['Nationality']).Value = illustrationUIService.findElementInDetail_V3([insuranceRole,'Nationality']).Value;
					
					// For mnc link only, change title to salutation
					if(illustrationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.UNIT_LINK
							|| illustrationUIService.productName == commonService.CONSTANTS.PRODUCT.ENDOWMENT) {
						prospectPersonalUIService.findElementInDetail_V3(['Salutation']).$ = illustrationUIService.findElementInDetail_V3([insuranceRole,'Salutation']).$;
						prospectPersonalUIService.findElementInDetail_V3(['SuffixName']).$ = illustrationUIService.findElementInDetail_V3([insuranceRole,'SuffixName']).$;
					}
					
					prospectPersonalUIService.saveDetail_V3($scope.resourceURL, false).then(function(data) {
						loadingBarService.hideLoadingBar();
						if (prospectPersonalUIService.isSuccess(data)) {
							illustrationUIService.findElementInDetail_V3([insuranceRole])['@refUid'] = prospectPersonalUIService.findElementInDetail_V3(['DocId']);
							deferred.resolve(true);
						} else {
							// need sync isDetailChanged for whole uiStructure
							$scope.reSetupConcreteUiStructure(illustrationUIService.detail);
							deferred.resolve();
						}
					});
    			} else {
    				// need sync isDetailChanged for whole uiStructure
					$scope.reSetupConcreteUiStructure(illustrationUIService.detail);
    				deferred.resolve();
    			}
    		};
    		if (commonService.hasValueNotEmpty(insuranceRoleId)) {
    			deferred.resolve(true);
//    			prospectPersonalUIService.findDocument_V3($scope.resourceURL, insuranceRoleId).then(function(data) {
//    				updateInsuranceRole(data);
//    			});
    		} else {
    			prospectPersonalUIService.initializeObject_V3($scope.resourceURL, commonService.CONSTANTS.MODULE_NAME.PROSPECT).then(function(data) {
    				updateInsuranceRole(data);
    			});
    		}
    	} else
    		deferred.resolve(true);
    	return deferred.promise;
    };
    
    // Use in 'step' layout of Direct Sale for get Quote
    $scope.getQuote = function() {
    	
    	// Check if a quotation after compute is success
    	// A Get Quote Success Quotation must has premium and no error
    	var isGetQuoteSuccess = function(data) {
    		if (illustrationUIService.isSuccess(data)) {
    			if (illustrationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.TRAVEL) {
                    if (illustrationUIService.productName == commonService.CONSTANTS.PRODUCT.DIRECT_TRAVEL){
                        illustrationUIService.quoteState = "SUCCESS";
                        $scope.convertDefaultInsuredToPolicyOwner();
                    }
    				if (illustrationUIService.findElementInDetail_V3(['TotalPayablePremiumIDR'])) {
    					return true;
    				}
    			}
    			if (illustrationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.DIRECT_PA) {
    				if (illustrationUIService.findElementInDetail_V3(['TotalPayablePremiumIDR'])) {
    					return true;
    				}
    			}
    			if (illustrationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.TERM_LIFE
    					&& illustrationUIService.productName != commonService.CONSTANTS.PRODUCT.REGULAR_UNIT_LINK) {
    				if (commonService.hasValueNotEmpty(illustrationUIService.findElementInDetail_V3(['PremiumFrequencyPayable']).$)) {
    					return true;
    				}
    			}
    			if (illustrationUIService.productName == commonService.CONSTANTS.PRODUCT.DIRECT_SALE_HOME) {
    				if (illustrationUIService.findElementInDetail_V3(['TotalPayablePremiumIDR'])) {
    					illustrationUIService.quoteState = "SUCCESS";
    					return true;
    				}
    			}
    			if (illustrationUIService.productName == commonService.CONSTANTS.PRODUCT.DIRECT_SALE_MOTOR) {
    				if (illustrationUIService.findElementInDetail_V3(['TotalPayablePremiumIDR'])) {
    					illustrationUIService.quoteState = "SUCCESS";
    					return true;
    				}
    			}
    			// Add more logic here for other product
    		} else { 
    			if (illustrationUIService.productName == commonService.CONSTANTS.PRODUCT.DIRECT_SALE_PA 
    					|| illustrationUIService.productName == commonService.CONSTANTS.PRODUCT.DIRECT_TRAVEL) {// for PA direct - hle56
    					$scope.checkInsuredHasError();
    			} 
    		} // Add more logic here for other product
        	return false;
    	}
    	// Do some action when get quote success
    	var onGetQuoteSuccess = function() {
    		illustrationUIService.findElementInDetail_V3(['DocStatus'])['DocumentStatus'] = "VALID";
			commonUIService.showNotifyMessage("v3.myworkspace.message.ComputeQuotationSuccessfully", "success");
    	};
    	
    	// Do some action when get quote faield
    	var onGetQuoteFailed = function() {
			var errorMessage = 'v3.myworkspace.message.ComputeQuotationUnuccessfully';
			if (illustrationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.TRAVEL) {
				if (illustrationUIService.findElementInDetail_V3(['Validity']) != undefined) {
					var validityErr = illustrationUIService.findElementInDetail_V3(['Validity']).errorMessage;
					if (commonService.hasValueNotEmpty(validityErr)) {
						errorMessage = validityErr;
					}
				}
			} // Add more logic here for other product
			
			illustrationUIService.findElementInDetail_V3(['DocStatus'])['DocumentStatus'] = "INVALID";
			commonUIService.showNotifyMessage(errorMessage);
    	};
    	
    	// Main logic of get quote
    	loadingBarService.showLoadingBar();
        // Clear errorMessage node before compute to avoid wrong detect error after compute -- pdoan3 
        illustrationUIService.removeErrorMessageNodeInElement(illustrationUIService.detail);
        //end
    	if (illustrationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.TERM_LIFE
    			&& illustrationUIService.productName != commonService.CONSTANTS.PRODUCT.REGULAR_UNIT_LINK) {
    		createDefaultlifeInsured();
    	}
    	illustrationUIService.computeIllustrationDetail($scope.resourceURL,illustrationUIService.productName).then(function(data) {
    		if (isGetQuoteSuccess(data)) {
    			onGetQuoteSuccess();
    		} else {
    			onGetQuoteFailed();
    		}
    		loadingBarService.hideLoadingBar();
    		$scope.reSetupConcreteUiStructure(illustrationUIService.detail,$scope.getAssociateUiStructureRoot().isDetailChanged);
    	});
    }
    
    $scope.compute = function(){
    		checkIsInBlacklisted().then(function(result){
        		if (result == false){
        			$scope.updateIllusGroupTravel(true).then(function(result){
        				if (result) {
        			//for guaranteed-cashback-saver product
        			//auto copy infor from policy onwer to life insured
        	    /*	if((illustrationUIService.productName == commonService.CONSTANTS.PRODUCT_GROUP.GUARANTEED_CASHBACK 
        	    			|| illustrationUIService.productName == commonService.CONSTANTS.PRODUCT_GROUP.TERM_LIFE_SECURE) 
        	    			&& !commonService.hasValueNotEmpty(illustrationUIService.findElementInDetail_V3(['LifeInsuredInformation'])['@refUid'])){
        	    		illustrationUIService.findElementInDetail_V3(['LifeInsuredInformation'])['@refUid'] = illustrationUIService.findElementInDetail_V3(['PolicyOwnerInformation'])['@refUid'];
        	    		illustrationUIService.findElementInDetail_V3(['LifeInsured','Title']).Value = illustrationUIService.findElementInDetail_V3(['PolicyOwner','Title']).Value;
        	    		illustrationUIService.findElementInDetail_V3(['LifeInsured','FullName']).$ = illustrationUIService.findElementInDetail_V3(['PolicyOwner','FullName']).$;
        	    		illustrationUIService.findElementInDetail_V3(['LifeInsured','BirthDate']).$ = illustrationUIService.findElementInDetail_V3(['PolicyOwner','BirthDate']).$;
        	    		illustrationUIService.findElementInDetail_V3(['LifeInsured','Gender']).Value = illustrationUIService.findElementInDetail_V3(['PolicyOwner','Gender']).Value;
        	    		illustrationUIService.findElementInDetail_V3(['LifeInsured','SmokerStatus']).Value = illustrationUIService.findElementInDetail_V3(['PolicyOwner','SmokerStatus']).Value;
        	    		illustrationUIService.findElementInDetail_V3(['LifeInsured','BusinessIndustry']).Value = illustrationUIService.findElementInDetail_V3(['PolicyOwner','BusinessIndustry']).Value;
        	    		illustrationUIService.findElementInDetail_V3(['LifeInsured','Occupation']).Value = illustrationUIService.findElementInDetail_V3(['PolicyOwner','Occupation']).Value;
        	    	}*/
        			
	    			if(illustrationUIService.productName == commonService.CONSTANTS.PRODUCT.ENDOWMENT){
	    				//if user has not added or imported Life Insured
	    				//	close Life insured tile when user click Save while in Import Life Insured card
	    				if(illustrationUIService.ShowLATile == 'Y'
	    					&& (illustrationUIService.findElementInDetail_V3(['LAIsTheSameWithPO']) && illustrationUIService.findElementInDetail_V3(['LAIsTheSameWithPO']).Value == 'Y')) {
	    					illustrationUIService.ShowLATile = 'N';
	    				}
	    			}
        	    		
        	    	//auto copy infor from policy onwer to life insured
        	    	if(illustrationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.TERM_LIFE
        	    		|| illustrationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.UNIT_LINK
        	    		|| illustrationUIService.productName == commonService.CONSTANTS.PRODUCT.ENDOWMENT){
        	    		
        	    		//check for save sync illustration from iOS
        	    		if(commonService.hasValueNotEmpty(illustrationUIService.findElementInDetail_V3(['LifeInsuredInformation'])['@refUid'])){

        	        		if(illustrationUIService.findElementInDetail_V3(['LifeInsuredInformation'])['@refUid'] 
        	        		!= illustrationUIService.findElementInDetail_V3(['PolicyOwnerInformation'])['@refUid']){
        	        			illustrationUIService.gcsAddNewLifeInsured = true;
        	        		}
        	    		}
        	    		if(illustrationUIService.gcsAddNewLifeInsured == false
        	    			|| (illustrationUIService.findElementInDetail_V3(['LAIsTheSameWithPO']) && illustrationUIService.findElementInDetail_V3(['LAIsTheSameWithPO']).Value == 'Y')) {
        		    		illustrationUIService.findElementInDetail_V3(['LifeInsuredInformation'])['@refUid'] = illustrationUIService.findElementInDetail_V3(['PolicyOwnerInformation'])['@refUid'];
        		    		illustrationUIService.findElementInDetail_V3(['LifeInsured','Title']).Value = illustrationUIService.findElementInDetail_V3(['PolicyOwner','Title']).Value;
        		    		illustrationUIService.findElementInDetail_V3(['LifeInsured','FullName']).$ = illustrationUIService.findElementInDetail_V3(['PolicyOwner','FullName']).$;
        		    		illustrationUIService.findElementInDetail_V3(['LifeInsured','BirthDate']).$ = illustrationUIService.findElementInDetail_V3(['PolicyOwner','BirthDate']).$;
        		    		illustrationUIService.findElementInDetail_V3(['LifeInsured','Gender']).Value = illustrationUIService.findElementInDetail_V3(['PolicyOwner','Gender']).Value;
        		    		illustrationUIService.findElementInDetail_V3(['LifeInsured','SmokerStatus']).Value = illustrationUIService.findElementInDetail_V3(['PolicyOwner','SmokerStatus']).Value;
        		    		illustrationUIService.findElementInDetail_V3(['LifeInsured','BusinessIndustry']).Value = illustrationUIService.findElementInDetail_V3(['PolicyOwner','BusinessIndustry']).Value;
        		    		illustrationUIService.findElementInDetail_V3(['LifeInsured','Occupation']).Value = illustrationUIService.findElementInDetail_V3(['PolicyOwner','Occupation']).Value;
//        		    		illustrationUIService.findElementInDetail_V3(['LifeInsured','AddressType']).Value = illustrationUIService.findElementInDetail_V3(['PolicyOwner','AddressType']).Value;
        		    		illustrationUIService.findElementInDetail_V3(['LifeInsured','MaritalStatus']).Value = illustrationUIService.findElementInDetail_V3(['PolicyOwner','MaritalStatus']).Value;
    						illustrationUIService.findElementInDetail_V3(['LifeInsured','Nationality']).Value = illustrationUIService.findElementInDetail_V3(['PolicyOwner','Nationality']).Value;
    						
    						// For mnc link only, change title to salutation
    						if(illustrationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.UNIT_LINK
    								|| illustrationUIService.productName == commonService.CONSTANTS.PRODUCT.ENDOWMENT) {
    							illustrationUIService.findElementInDetail_V3(['LifeInsured','Salutation']).$ = illustrationUIService.findElementInDetail_V3(['PolicyOwner','Salutation']).$;
    							illustrationUIService.findElementInDetail_V3(['LifeInsured','SuffixName']).$ = illustrationUIService.findElementInDetail_V3(['PolicyOwner','SuffixName']).$;
    							illustrationUIService.findElementInDetail_V3(['LARelationship']).Value = "13";
    						}
        	    		}
        	    	}
        			
        	    	if (illustrationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.FIRE) {
        				if (!commonService.hasValueNotEmpty(illustrationUIService.findElementInDetail_V3(['BasicRate']).$)){
        					commonUIService.showNotifyMessage("v3.myworkspace.message.ComputeQuotationUnuccessfully");
        					illustrationUIService.findElementInDetail_V3(['BasicRate']).errorMessage ="MSG-FQ04";
        				}else{
        					var confirm = $mdDialog.confirm()
    	   			          .title($filter('translate')("MSG-FQ05"))
    	   			          .ok($filter('translate')("v3.yesno.enum.Y"))
    	   			          .cancel($filter('translate')("v3.yesno.enum.N"));
    	       				 $mdDialog.show(confirm).then(function() {
    	       					illustrationUIService.computeIllustrationDetail($scope.resourceURL,illustrationUIService.productName).then(function(data){
    		       					if (illustrationUIService.isSuccess(data) && illustrationUIService.findElementInDetail_V3(['TotalPremium']).$ != undefined) {
    		       						$scope.savePOandLAName_RUL();
    		       						$scope.reSetupConcreteUiStructure(illustrationUIService.detail, undefined, true);
    		    	    				commonUIService.showNotifyMessage("v3.myworkspace.message.ComputeQuotationSuccessfully", "success");
    		    	    			} else {
    		    	    				commonUIService.showNotifyMessage("v3.myworkspace.message.ComputeQuotationUnuccessfully");
    		    	    			}
    	       					})
    		       			});
        				}
    	    		}
        	    	else if (illustrationUIService.productName == commonService.CONSTANTS.PRODUCT.GROUP_TERM_LIFE){
        	    		illustrationUIService.removeValidateNodeInElement(illustrationUIService.detail);
        	    		$scope.computeTag([["Members"],["BasicInformation"],["ProductCatalogue"],["Pricing"],["Output"]]).then(function(data){
        	    			
        	    			if (illustrationUIService.isSuccess(data) && !commonService.hasValueNotEmpty(illustrationUIService.findElementInDetail_V3(['TotalGrossPremium'])['@validate'])){
        	    				commonUIService.showNotifyMessage("v3.myworkspace.message.ComputeQuotationSuccessfully", "success");
        	    				illustrationUIService.saveDetail_V3($scope.resourceURL, false);
        	    			}
        	    			else commonUIService.showNotifyMessage("v3.myworkspace.message.ComputeQuotationUnuccessfully"); 
        	    		});
        	    	}
        	    	else{
        	    		illustrationUIService.computeIllustrationDetail($scope.resourceURL,illustrationUIService.productName).then(function(data){
            	    		if (illustrationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.MOTOR
            	    				&& illustrationUIService.productName != commonService.CONSTANTS.PRODUCT.DIRECT_SALE_MOTOR) {            	    			
            					if (illustrationUIService.isSuccess(data) && illustrationUIService.findElementInDetail_V3(['BasePremium']).$ != undefined) {
            						// set VALID status if Quotation is computed successfully
            						illustrationUIService.findElementInDetail_V3(['DocStatus'])['DocumentStatus'] = "VALID";
            						commonUIService.showNotifyMessage("v3.myworkspace.message.ComputeQuotationSuccessfully", "success");
            					} else {
            						// set INVALID status if Quotation isn't computed
            						illustrationUIService.findElementInDetail_V3(['DocStatus'])['DocumentStatus'] = "INVALID";
            						if(illustrationUIService.findElementInElement_V3(data, ['ipos-response:cause']) == "VehicleNo is in blacklist"){
            							commonUIService.showNotifyMessage("v3.mynewworkspace.message.VehicleNumberIsInBlacklist");
            						}else{
            							commonUIService.showNotifyMessage("v3.myworkspace.message.ComputeQuotationUnuccessfully");
            						}
            					}
            	    		}
            	    		if (illustrationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.TERM_LIFE
            	    				&& illustrationUIService.productName != commonService.CONSTANTS.PRODUCT.REGULAR_UNIT_LINK) {
            	    			if (illustrationUIService.isSuccess(data)) {
            	    				commonUIService.showNotifyMessage("v3.myworkspace.message.ComputeQuotationSuccessfully", "success");
            	    			} else {
            	    				commonUIService.showNotifyMessage("v3.myworkspace.message.ComputeQuotationUnuccessfully");
            	    			}
            	    		}
            	    		if (illustrationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.UNIT_LINK
            	    			|| illustrationUIService.productName == commonService.CONSTANTS.PRODUCT.REGULAR_UNIT_LINK
            	    			|| illustrationUIService.productName == commonService.CONSTANTS.PRODUCT.ENDOWMENT) {
                	    		if (illustrationUIService.isSuccess(data)) { 	    			
                	    			$scope.savePOandLAName_RUL();
                	    			//computeTag to retrieve Options in dropdown list
        							//$scope.computeTag([['BasicPlan'], ['PolicyOwnerInformation'], ['LifeInsuredInformation'],  ['Riders']], undefined, true);
        							$scope.computeRiderTypeOption($scope.computeRiderIgnoreList);
    								$scope.computeRiderPlanOption($scope.computeRiderIgnoreList);
                	    			commonUIService.showNotifyMessage("v3.myworkspace.message.ComputeQuotationSuccessfully", "success");
                	    		} else {
                	    			illustrationUIService.findElementInDetail_V3(['DocStatus'])['DocumentStatus'] = "INVALID";
                	    			commonUIService.showNotifyMessage("v3.myworkspace.message.ComputeQuotationUnuccessfully");
                	    		}
                	    	}
            	    		if (illustrationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.FOREIGN_WORKER) {
            	    			if (illustrationUIService.isSuccess(data) && illustrationUIService.findElementInDetail_V3(['TotalPremium']).$ != undefined) {
            	    				// set VALID status if Quotation is computed successfully
            						illustrationUIService.findElementInDetail_V3(['DocStatus'])['DocumentStatus'] = "VALID";
            						commonUIService.showNotifyMessage("v3.myworkspace.message.ComputeQuotationSuccessfully", "success");
            						$scope.moveToCard("illustration-personal-accident:SummaryQuotation"); 
            	    			} else {
            	    				illustrationUIService.findElementInDetail_V3(['DocStatus'])['DocumentStatus'] = "INVALID";
            	    				commonUIService.showNotifyMessage("v3.myworkspace.message.ComputeQuotationUnuccessfully");
            	    			}
            	    		}
            	    		if (illustrationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.GROUP_TERM_LIFE) {
            	    			if (illustrationUIService.isSuccess(data) && illustrationUIService.findElementInDetail_V3(['TotalGrossPremium']).$ != undefined) {
            	    				// set VALID status if Quotation is computed successfully
            						illustrationUIService.findElementInDetail_V3(['DocStatus'])['DocumentStatus'] = "VALID";
            						commonUIService.showNotifyMessage("v3.myworkspace.message.ComputeQuotationSuccessfully", "success");
            						$scope.moveToCard("illustration-gtl:quoteSummary"); 
            	    			} else {
            	    				illustrationUIService.findElementInDetail_V3(['DocStatus'])['DocumentStatus'] = "INVALID";
            	    				commonUIService.showNotifyMessage("v3.myworkspace.message.ComputeQuotationUnuccessfully");
            	    			}
            	    		}
            	    		if (illustrationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.TRAVEL) {
            	    			if (illustrationUIService.isSuccess(data) && illustrationUIService.findElementInDetail_V3(['TotalPayablePremiumIDR']).$ != undefined) {
            	    				// set VALID status if Quotation is computed successfully
            	    				illustrationUIService.findElementInDetail_V3(['DocStatus'])['DocumentStatus'] = "VALID";
            	    				commonUIService.showNotifyMessage("v3.myworkspace.message.ComputeQuotationSuccessfully", "success");
            	    				//$scope.moveToCard("illustration-gtl:quoteSummary"); 
            	    			} else {
            	    				illustrationUIService.findElementInDetail_V3(['DocStatus'])['DocumentStatus'] = "INVALID";
            	    				if (illustrationUIService.findElementInDetail_V3(['Validity']) != undefined) {
            							var errorMessage = illustrationUIService.findElementInDetail_V3(['Validity']).errorMessage;
            							if(commonService.hasValueNotEmpty(errorMessage)) {
            								commonUIService.showNotifyMessage(errorMessage);
            							} else 
            								commonUIService.showNotifyMessage("v3.myworkspace.message.ComputeQuotationUnuccessfully");
            						} else
            							commonUIService.showNotifyMessage("v3.myworkspace.message.ComputeQuotationUnuccessfully");
            	    			}
            	    		}
            	    		
            	    		
            	    		// Call this func with previous isDetailChanged, the state of isDetailChanged variable with remain the same
            	    		$scope.getAssociateUiStructureRoot().isDetailChanged = false;
            	    		$scope.reSetupConcreteUiStructure(illustrationUIService.detail, $scope.getAssociateUiStructureRoot().isDetailChanged, true);
            	    	})
        	    	}
        		}
        			});
        		}
        		else commonUIService.showNotifyMessage("v3.mynewworkspace.message.VehicleNumberIsInBlacklist"); 
        	});
    }
    
	$scope.continueLastWorking = function(){
		var self = this;
		//continue to save quotation detail (direct sale)
		if(localStorage.getItem("caseDSDetail") && localStorage.getItem("isContinueLastWorking")){
			illustrationUIService.detail = JSON.parse(localStorage.getItem("caseDSDetail"));
			localStorage.removeItem("caseDSDetail");
			localStorage.removeItem("isContinueLastWorking");
			self.saveDetail();
		}
	}
	
	$scope.getUserDoc = function(){
		var resourceURLCheckLogin = illustrationUIService.initialMethodPortletURL($scope.portletId, "checkUserLoginIllustrationdetail");
		$http.get(resourceURLCheckLogin).success(function(data){
			if(data == "null"){//stop if user is not yet login
			}else{
				var resourceURL = illustrationUIService.initialMethodPortletURL($scope.portletId,"loadPersonalProfileDoc");
				resourceURL = resourceURL.toString();
				$http.get(resourceURL).success(function(result){
					salecaseUIService.userDoc = result;
					if(salecaseUIService.findElementInDetail_V3(['@channel'])=="DS" && illustrationUIService.findElementInDetail_V3(['BusinessStatus'])=="NEW"){
						if(salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.MOTOR
								&& illustrationUIService.productName != commonService.CONSTANTS.PRODUCT.DIRECT_SALE_MOTOR
								&& illustrationUIService.findElementInDetail_V3(['FullName']).$==undefined){
							var P = prospectPersonalUIService.findElementInElement_V3(salecaseUIService.userDoc, ['Person']);
							var MD = illustrationUIService.findElementInDetail_V3(['MainDriver']);
							for(var prop in P) {
								var value =  prospectPersonalUIService.findElementInElement_V3(salecaseUIService.userDoc, [prop]).Value;
								var string =  prospectPersonalUIService.findElementInElement_V3(salecaseUIService.userDoc, [prop]).$;
								if(value != undefined || string != undefined){
									var propValue = (prop.split(":"))[1];
									if(value != undefined){
										if(illustrationUIService.findElementInElement_V3(MD, [propValue])!=undefined){
											illustrationUIService.findElementInElement_V3(MD, [propValue]).Value = value;
										}
									}else{
										if(illustrationUIService.findElementInElement_V3(MD, [propValue])!=undefined){
											illustrationUIService.findElementInElement_V3(MD, [propValue]).$ = string;
										}
									}
								};
							};
							illustrationUIService.findElementInDetail_V3(['IDType']).Value = prospectPersonalUIService.findElementInElement_V3(salecaseUIService.userDoc, ['IDType']).Value;
							illustrationUIService.findElementInDetail_V3(['IDNumber']).$ = prospectPersonalUIService.findElementInElement_V3(salecaseUIService.userDoc, ['IDNumber']).$;
							illustrationUIService.findElementInDetail_V3(['Title']).Value = prospectPersonalUIService.findElementInElement_V3(salecaseUIService.userDoc, ['Title']).Value;
							illustrationUIService.findElementInDetail_V3(['SmokerStatus']).Value = prospectPersonalUIService.findElementInElement_V3(salecaseUIService.userDoc, ['SmokerStatus']).Value;
							illustrationUIService.findElementInDetail_V3(['FullName']).$ = prospectPersonalUIService.findElementInElement_V3(salecaseUIService.userDoc, ['FullName']).$;
						/*illustrationUIService.findElementInDetail_V3(['AgentName']).$ = prospectPersonalUIService.findElementInElement_V3(salecaseUIService.userDoc, ['FullName']).$;
							illustrationUIService.findElementInDetail_V3(['PhoneNumberOfAgent']).$ = prospectPersonalUIService.findElementInElement_V3(salecaseUIService.userDoc, ['FullName']).$;
						illustrationUIService.findElementInDetail_V3(['EmailAddressOfAgent']).$ = prospectPersonalUIService.findElementInElement_V3(salecaseUIService.userDoc, ['FullName']).$;*/
						}  
						if(salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.TERM_LIFE
								&& illustrationUIService.productName != commonService.CONSTANTS.PRODUCT.REGULAR_UNIT_LINK){
							illustrationUIService.findElementInDetail_V3(['AgentName']).$ = prospectPersonalUIService.findElementInElement_V3(salecaseUIService.userDoc, ['FullName']).$;
							illustrationUIService.findElementInDetail_V3(['PhoneNumberOfAgent']).$ = prospectPersonalUIService.findElementInElement_V3(salecaseUIService.userDoc, ['FullName']).$;
							illustrationUIService.findElementInDetail_V3(['EmailAddressOfAgent']).$ = prospectPersonalUIService.findElementInElement_V3(salecaseUIService.userDoc, ['FullName']).$;
						}
						$scope.reSetupConcreteUiStructure(illustrationUIService.detail);
					}
				});
			}
		});
	};
	$scope.getUserDoc();
	
	$scope.getAgentDoc = function(){
		var resourceURLCheckLogin = illustrationUIService.initialMethodPortletURL($scope.portletId, "checkUserLoginIllustrationdetail");
		$http.get(resourceURLCheckLogin).success(function(data){
			if(data == "null"){//stop if user is not yet login
			}else{
				var resourceURL = illustrationUIService.initialMethodPortletURL($scope.portletId,"loadPersonalProfileDoc");
				resourceURL = resourceURL.toString();
				$http.get(resourceURL).success(function(result){
					salecaseUIService.userDoc = result;
					
					var counter = parseInt(prospectPersonalUIService.findElementInElement_V3(salecaseUIService.userDoc,['Contacts'])['@counter']);
			    	for(var i = 0; i < counter; i++){
			    		var contactObj = prospectPersonalUIService.findElementInElement_V3(salecaseUIService.userDoc,['Contact'])[i]			    		
			    		if(commonService.hasValueNotEmpty(prospectPersonalUIService.findElementInElement_V3(contactObj,['ContactValue']).$)){
			    			illustrationUIService.findElementInDetail_V3(['PhoneNumberOfAgent']).$ = prospectPersonalUIService.findElementInElement_V3(contactObj,['ContactValue']).$;
			    		}
			    	}
					illustrationUIService.findElementInDetail_V3(['EmailAddressOfAgent']).$ = prospectPersonalUIService.findElementInElement_V3(salecaseUIService.userDoc, ['UserName']).$;
						$scope.reSetupConcreteUiStructure(illustrationUIService.detail);
						});
			}
		});
	};
//	$scope.getAgentDoc();
	$scope.getListClient = function(){
		 prospectUIService.getDocumentList_V3 ($scope.resourceURL).then(function(data) {
        	if (commonService.hasValueNotEmpty(prospectUIService.findElementInElement_V3(data, ['MetadataDocument']))) {
    			$scope.clientList = prospectUIService.findElementInElement_V3(data, ['MetadataDocument']);
    			$scope.clientList = prospectUIService.convertToArray($scope.clientList);
    		} 
        });
	};

	
    $scope.saveDetail = function( actionType ){

        actionType = actionType || 'newbussiness';
    	var deferred = illustrationUIService.$q.defer();
		var resourceURLCheckLogin = illustrationUIService.initialMethodPortletURL($scope.portletId, "checkUserLoginIllustrationdetail");
		//$scope.getViewHistory();
		//check user login status
		illustrationUIService.checkUserLogin(resourceURLCheckLogin.toString()).then(function(data){
			if(data == false){//stop if user is not yet login
				var newURL = urlService.urlMap.LOGIN;
				window.open(newURL, '_self');
				return;		
			}else{
				localStorage.removeItem("caseDSDetail");
				localStorage.removeItem("isContinueLastWorking");
				localStorage.removeItem("listCardHistory");
			}
			checkIsInBlacklisted().then(function(result){
    		if (!result){
    			
    			if(illustrationUIService.productName == commonService.CONSTANTS.PRODUCT.ENDOWMENT){
    				//if user has not added or imported Life Insured
    				//	close Life insured tile when user click Save while in Import Life Insured card
    				if(illustrationUIService.ShowLATile == 'Y'
    					&& (illustrationUIService.findElementInDetail_V3(['LAIsTheSameWithPO']) && illustrationUIService.findElementInDetail_V3(['LAIsTheSameWithPO']).Value == 'Y')) {
    					illustrationUIService.ShowLATile = 'N';
    				}
    			}
    			
	    	//auto copy infor from policy onwer to life insured
	    	if(illustrationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.TERM_LIFE
	    		|| illustrationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.UNIT_LINK
	    		|| illustrationUIService.productName == commonService.CONSTANTS.PRODUCT.ENDOWMENT){
	    		
	    		//check for save sync illustration from iOS
	    		if(commonService.hasValueNotEmpty(illustrationUIService.findElementInDetail_V3(['LifeInsuredInformation'])['@refUid'])){

	        		if(illustrationUIService.findElementInDetail_V3(['LifeInsuredInformation'])['@refUid'] 
	        		!= illustrationUIService.findElementInDetail_V3(['PolicyOwnerInformation'])['@refUid']){
	        			illustrationUIService.gcsAddNewLifeInsured = true;
	        		}
	    		}
	    		if(illustrationUIService.gcsAddNewLifeInsured == false
    	    		|| (illustrationUIService.findElementInDetail_V3(['LAIsTheSameWithPO']) && illustrationUIService.findElementInDetail_V3(['LAIsTheSameWithPO']).Value == 'Y')) {
		    		illustrationUIService.findElementInDetail_V3(['LifeInsuredInformation'])['@refUid'] = illustrationUIService.findElementInDetail_V3(['PolicyOwnerInformation'])['@refUid'];
		    		illustrationUIService.findElementInDetail_V3(['LifeInsured','Title']).Value = illustrationUIService.findElementInDetail_V3(['PolicyOwner','Title']).Value;
		    		illustrationUIService.findElementInDetail_V3(['LifeInsured','FullName']).$ = illustrationUIService.findElementInDetail_V3(['PolicyOwner','FullName']).$;
		    		illustrationUIService.findElementInDetail_V3(['LifeInsured','BirthDate']).$ = illustrationUIService.findElementInDetail_V3(['PolicyOwner','BirthDate']).$;
		    		illustrationUIService.findElementInDetail_V3(['LifeInsured','Gender']).Value = illustrationUIService.findElementInDetail_V3(['PolicyOwner','Gender']).Value;
		    		illustrationUIService.findElementInDetail_V3(['LifeInsured','SmokerStatus']).Value = illustrationUIService.findElementInDetail_V3(['PolicyOwner','SmokerStatus']).Value;
		    		illustrationUIService.findElementInDetail_V3(['LifeInsured','BusinessIndustry']).Value = illustrationUIService.findElementInDetail_V3(['PolicyOwner','BusinessIndustry']).Value;
//		    		illustrationUIService.findElementInDetail_V3(['LifeInsured','AddressType']).Value = illustrationUIService.findElementInDetail_V3(['PolicyOwner','AddressType']).Value;
		    		illustrationUIService.findElementInDetail_V3(['LifeInsured','MaritalStatus']).Value = illustrationUIService.findElementInDetail_V3(['PolicyOwner','MaritalStatus']).Value;
					illustrationUIService.findElementInDetail_V3(['LifeInsured','Nationality']).Value = illustrationUIService.findElementInDetail_V3(['PolicyOwner','Nationality']).Value;
					illustrationUIService.findElementInDetail_V3(['LifeInsured','Occupation']).Value = illustrationUIService.findElementInDetail_V3(['PolicyOwner','Occupation']).Value;
					
					// For mnc link only, change title to salutation
					if(illustrationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.UNIT_LINK
							|| illustrationUIService.productName == commonService.CONSTANTS.PRODUCT.ENDOWMENT) {
						illustrationUIService.findElementInDetail_V3(['LifeInsured','Salutation']).$ = illustrationUIService.findElementInDetail_V3(['PolicyOwner','Salutation']).$;
						illustrationUIService.findElementInDetail_V3(['LifeInsured','SuffixName']).$ = illustrationUIService.findElementInDetail_V3(['PolicyOwner','SuffixName']).$;
						illustrationUIService.findElementInDetail_V3(['LARelationship']).Value = "13";
					}
	    		}
	    	}
	    	
			
	        
	        
	    	// Update caseID of illus doc.
	    	illustrationUIService.findElementInDetail_V3(['CaseID']).$ = salecaseUIService.findElementInDetail_V3(['DocId']);
	    	// in GCS, TLS, RUL, if Life insured <> Policy owner and don't have refid -> save Life insured
	    	$scope.saveInsuranceRoleAsProspect('PolicyOwnerInformation').then(function(savedPolicyOwner) {
	    	$scope.saveInsuranceRoleAsProspect('LifeInsuredInformation').then(function(savedLifeInsured) {
	    		loadingBarService.showLoadingBar();
				illustrationUIService.saveDetail_V3($scope.resourceURL, true , undefined, undefined, undefined , actionType).then(function(data){
					loadingBarService.hideLoadingBar();
					if (savedPolicyOwner && savedLifeInsured && illustrationUIService.isSuccess(data)) {
						commonUIService.showNotifyMessage("v3.myworkspace.message.SaveQuotationSuccessfully", "success");
						var docId = illustrationUIService.findElementInDetail_V3(['DocId']);
						// get data(to show premium) after save complete
						var doNothing = false;
						if(window.cordova){
						    doNothing = true ;
						}
						illustrationUIService.getDetail_V3($scope.resourceURL, undefined, doNothing).then(function(data){
						/*illustrationUIService.findDocument_V3($scope.resourceURL, docId).then(function(data){*/
							$scope.reSetupConcreteUiStructure(data, undefined, isNotRemoveTemplateChildren()); // refresh the values in multiple cards
							$scope.card.validStatus = $scope.getAssociateUiStructureRoot().validStatus;
							// set Quotation docId into Case
							$scope.getRightDetailInMultipleEleFromParentDoc()['@refUid'] = docId;
							salecaseUIService.findElementInElement_V3($scope.getRightDetailInMultipleEleFromParentDoc(), ['QuotationId']).$ = docId;
							if (illustrationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.MOTOR
									&& illustrationUIService.productName != commonService.CONSTANTS.PRODUCT.DIRECT_SALE_MOTOR) {
								if(illustrationUIService.findElementInDetail_V3(['BasePremium']).$ != undefined ){
									// set VALID status if Quotation is computed successfully
									illustrationUIService.findElementInDetail_V3(['DocStatus'])['BusinessStatus'] = "DRAFT";
							    	illustrationUIService.saveDetail_V3($scope.resourceURL, false).then(function(data){
							    	});
									commonUIService.showNotifyMessage("v3.myworkspace.message.ComputeQuotationSuccessfully", "success");
								}
								else{
									commonUIService.showNotifyMessage("v3.myworkspace.message.ComputeQuotationUnuccessfully");
								}
							}
							if (illustrationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.FIRE) {
								if (illustrationUIService.findElementInDetail_V3(['TotalPremium']).$ != undefined) {
									commonUIService.showNotifyMessage("v3.myworkspace.message.ComputeQuotationSuccessfully", "success");
								}
							}
							if (illustrationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.FOREIGN_WORKER) {
								if (illustrationUIService.findElementInDetail_V3(['TotalPremium']).$ != undefined) {
									illustrationUIService.findElementInDetail_V3(['DocStatus'])['BusinessStatus'] = "DRAFT";
								   	illustrationUIService.saveDetail_V3($scope.resourceURL, false).then(function(data){
								   	});
									commonUIService.showNotifyMessage("v3.myworkspace.message.ComputeQuotationSuccessfully", "success");
									$scope.moveToCard("illustration-personal-accident:SummaryQuotation");
								}
							}
							
							//update back information for propsect after changed in Quotation RUL
							//remove duplicate code - update back to prospect for policy owner and life insured 
							//if (illustrationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.UNIT_LINK) {
							//	 $scope.updateInforBackToProspect();
							//}
							
							//computeTag to retrieve Options in dropdown list
							if (illustrationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.UNIT_LINK
									|| illustrationUIService.productName == commonService.CONSTANTS.PRODUCT.ENDOWMENT) {
								//$scope.computeTag([['BasicPlan'], ['PolicyOwnerInformation'], ['LifeInsuredInformation'],  ['Riders']], undefined, true);
								$scope.computeRiderTypeOption($scope.computeRiderIgnoreList);
								$scope.computeRiderPlanOption($scope.computeRiderIgnoreList);
							}
							 
							 
							// set Prospect into Case
							/*var mainDriver = angular.copy(salecaseUIService.cloneProspect);
							mainDriver['@refUid'] = illustrationUIService.findElementInDetail_V3(['DocId']);
							illustrationUIService.findElementInElement_V3(mainDriver, ['ProspectId']).$ = illustrationUIService.findElementInDetail_V3(['DocId']);
							illustrationUIService.findElementInElement_V3(mainDriver, ['ProspectRole']).$ = 'MD';
							salecaseUIService.findElementInDetail_V3(['Prospect']).push(mainDriver);*/
							$scope.updatePOandLAName_RUL();//update PO and LI name for BC RUL
						   	salecaseUIService.saveDetail_V3($scope.resourceURL, false).then(function(caseData){
						    	// for direct sale case ( save Quotation first then save Case )
						    	if(illustrationUIService.findElementInDetail_V3(['CaseID'])!=undefined && illustrationUIService.findElementInDetail_V3(['CaseID']).$==undefined){
						    		illustrationUIService.findElementInDetail_V3(['CaseID']).$ = salecaseUIService.findElementInDetail_V3(['DocId']);
						    		illustrationUIService.saveDetail_V3($scope.resourceURL, false).then(function(data){
						    		});
						   		}
						    	// end
								$log.debug("Pushed Quotation docId into Case ");
								deferred.resolve(data);
							});
						});
					} else {
						// set INVALID status if Quotation isn't computed
						illustrationUIService.findElementInDetail_V3(['DocStatus'])['DocumentStatus'] = "INVALID";
						commonUIService.showNotifyMessage("v3.myworkspace.message.SaveQuotationUnsuccessfully");
						if(illustrationUIService.findElementInElement_V3(data, ['ipos-response:cause']) == "VehicleNo is in blacklist"){
							commonUIService.showNotifyMessage("v3.mynewworkspace.message.VehicleNumberIsInBlacklist");
						}
					    // Appending dialog to document.body to cover sidenav in docs app
					    var confirm = $mdDialog.confirm()
					      .title($filter('translate')("MSG-FQ06"))
		   		          .ok($filter('translate')("v3.yesno.enum.Y"))
		   		          .cancel($filter('translate')("v3.yesno.enum.N"));
					    $mdDialog.show(confirm).then(function() {
						    illustrationUIService.saveDetail_V3($scope.resourceURL, false).then(function(data){
						   		commonUIService.showNotifyMessage("v3.mynewworkspace.message.SaveDraftQuotationSuccessfully", "success");
								// set Quotation docId into Case 
						    	var docId = illustrationUIService.findElementInDetail_V3(['DocId']);
								$scope.getRightDetailInMultipleEleFromParentDoc()['@refUid'] = docId;
			                    salecaseUIService.findElementInElement_V3($scope.getRightDetailInMultipleEleFromParentDoc(), ['QuotationId']).$ = docId;
			                    $scope.updatePOandLAName_RUL();//update PO and LI name for BC RUL
							    salecaseUIService.saveDetail_V3($scope.resourceURL, false).then(function(data){
									$log.debug("Pushed Quotation docId into Case ");
								});
						    });
						}, function() {
						    var a = 'No';
						});
						$scope.reSetupConcreteUiStructure(illustrationUIService.detail, undefined, isNotRemoveTemplateChildren()); // refresh the values in multiple cards
						deferred.resolve(data);
					}
			    });
		    });
	    	});
    	}
    	});
		});
		return deferred.promise;
    };
    
    $scope.updateInforBackToProspect = function updateInforBackToProspect(){
    	var deferred = illustrationUIService.$q.defer();
    	var self = this;
    	self.POID = illustrationUIService.findElementInDetail_V3(["PolicyOwnerInformation"])['@refUid'];
    	self.LAID = illustrationUIService.findElementInDetail_V3(['LifeInsuredInformation'])['@refUid'];
		
		 $scope.updateInfor(self.POID, ['PolicyOwnerInformation', 'PolicyOwner'], ['PersonContactData', 'Personal']).then(function(){
			 if(self.POID != self.LAID){
				 $scope.updateInfor(self.LAID, ['LifeInsuredInformation', 'PolicyOwner'], ['PersonContactData', 'Personal']).then(function(){
					 deferred.resolve();
				 });
			 }else{
				 deferred.resolve();
			 }
		 });
		 return deferred.promise;
	};
	
	  $scope.updateInfor = function updateInfor(propsectId, fromXpath, toXpath){
		  var deferred = illustrationUIService.$q.defer();
			prospectPersonalUIService.findDocument_V3($scope.resourceURL, propsectId).then(function(prospectDetail) {
				illustrationUIService.copyInforFromSameStructureObj(illustrationUIService.detail, prospectDetail, fromXpath, toXpath);
				prospectPersonalUIService.saveDetail_V3($scope.resourceURL, false).then(function(data){ 
					if (!prospectPersonalUIService.isSuccess(data)) {
						commonUIService.showNotifyMessage("v3.myworkspace.message.SaveProspectsuccessfully", "success");
					}
					deferred.resolve();
				});
			});
		return deferred.promise;
	};
		
    
    $scope.refreshDetail = function(){
		var illustrationID = illustrationUIService.findElementInDetail_V3(['DocId']);
		var illustrationProduct = illustrationUIService.findElementInDetail_V3(["Product"]);
		illustrationUIService.findDocumentToEdit_V3($scope.resourceURL, illustrationProduct, illustrationID).then(function(data){
			$scope.reSetupConcreteUiStructure(illustrationUIService.detail); // refresh the values in multiple cards
		});
	};
    
    $scope.selectGeographic = function(){
		if(illustrationUIService.productName == commonService.CONSTANTS.PRODUCT.MOTOR_PRIVATE_CAR_M_AS){
			var selectedValue = $scope.moduleService.findElementInElement_V3($scope.moduleService.detail,['GeographicLocation']).Value;
			var group = illustrationUIService.findGroupInMapListByValue(illustrationUIService.lazyChoiceList[illustrationUIService.productName],'$..GeographicLocation',selectedValue);
			illustrationUIService.findElementInElement_V3(illustrationUIService.detail, ['Region']).Value = group;
		}
	};
	$scope.chooseUseOfVehicle=function(){
		 $mdDialog.show({
			 scope: $scope.$new(),
		     templateUrl: $scope.contextPathTheme+'/views/template/longDropdown/useOfVehicleList.html',
		   });
		  
	};
	$scope.setValueOfUseOfVehicle=function(data){
    	$scope.moduleService.findElementInDetail_V3(['UseOfVehicle']).Value=data;
    	$mdDialog.hide();
    	$log.debug(data);
    };
	$scope.init = function init () {
        var self = this;
        self.generalConfigCtrl('IllustrationDetailCtrl', illustrationUIService).then(function finishedSetup () {
            $log.debug("this ctrl is processsing for: " + JSON.stringify($scope.getCurrProductInfor()));
            $scope.isRenewal = salecaseUIService.findElementInDetail_V3(['@case-name'])=='Renewal' ? true : false;
            if ($scope.isRenewal){
            	illustrationUIService.findElementInDetail_V3(['DocInfo'])['DocName'] = illustrationUIService.genDefaultName();
            	if (illustrationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.MOTOR
            			&& illustrationUIService.productName != commonService.CONSTANTS.PRODUCT.DIRECT_SALE_MOTOR) {
            		$scope.selectMakeOrModel();
            	}
            	if (illustrationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.FIRE) {
            		illustrationUIService.importPerilFromPolicy();
            	}
            }
            if (illustrationUIService.productName == commonService.CONSTANTS.PRODUCT.DS_GUARANTEED_CASHBACK) {//for direct sale guaranteed to show createdDate and ExpiryDate
            	$scope.createDate = moment().format("YYYY-MM-DD");
            	salecaseUIService.findElementInDetail_V3(['EffectiveDate']).$ = $scope.createDate;
            	var days = salecaseUIService.findElementInDetail_V3(['NumOfExpiredDays']).$;            	
            	$scope.expiryDate = moment().add(days,'days').format("YYYY-MM-DD");
            	salecaseUIService.findElementInDetail_V3(['ExpiredDate']).$ = $scope.expiryDate;
            }
            $scope.initDetail();
        });

    };
    
    $scope.init();
    
    function convertElementToArray() {
	     illustrationUIService.jsonToArray(illustrationUIService.detail, 'OptionalCoverages', 'illustration:OptionalCoverage');
	     illustrationUIService.jsonToArray(illustrationUIService.findElementInElement_V3(illustrationUIService.detail, ['MainDriver']), 'IDs', 'personal:ID');
	     illustrationUIService.jsonToArray(illustrationUIService.detail, 'OtherDrivers', 'illustration:OtherDriver');
	     var otherDrivers = illustrationUIService.findElementInDetail_V3(['OtherDriver']);
	     for (var i = 0; i < otherDrivers.length; i++) {
	         illustrationUIService.jsonToArray(illustrationUIService.findElementInElement_V3(illustrationUIService.detail, ['OtherDriver'])[i], 'IDs', 'personal:ID');
	     }
	     illustrationUIService.jsonToArray(illustrationUIService.detail, 'Attachments', 'Attachment');
	 }

    $scope.selectMakeOrModel = function(){
		var selectedValue = illustrationUIService.findElementInDetail_V3(['MakeOrModel']).Value;
		var group = illustrationUIService.findGroupInMapListByValue(illustrationUIService.lazyChoiceList[illustrationUIService.productName],'MakeOrModel',selectedValue);
    	group = group.split(";");
    	illustrationUIService.findElementInDetail_V3(['ModelDescription']).$ = group[0];
    	illustrationUIService.findElementInDetail_V3(['Body']).Value = group[3];
    	illustrationUIService.findElementInDetail_V3(['EngineCapacity']).$ = group[2];
    	illustrationUIService.findElementInDetail_V3(['NoOfSeat']).$ = group[4];			
	};
	
	$scope.selectGeographic = function(){
		var selectedValue = illustrationUIService.findElementInDetail_V3(['GeographicLocation']).Value;
		var group = illustrationUIService.findGroupInMapListByValue(illustrationUIService.lazyChoiceList[illustrationUIService.productName],'GeographicLocation',selectedValue);
		illustrationUIService.findElementInDetail_V3(['Region']).Value = group;
	};
	
	$scope.backupProspect = undefined;
	$scope.getMainInsured = function() {
    	if(commonService.hasValueNotEmpty(illustrationUIService.chosenProspectList)) {
    		var prospectSelected = illustrationUIService.chosenProspectList[0];
    		if($scope.backupProspect == undefined) {
    			$scope.backupProspect = prospectSelected;
    		}
    		if($scope.backupProspect.DocId != prospectSelected.DocId) {
    			$scope.backupProspect = prospectSelected;
    			illustrationUIService.findElementInDetail_V3(['MainInsured','Occupation']).Value = "";
    			illustrationUIService.findElementInDetail_V3(['MainInsured','BusinessIndustry']).Value = "";
    		}
    		prospectPersonalUIService.findDocument_V3($scope.resourceURL, prospectSelected.DocId).then(function(data){
    			var mainInsured = illustrationUIService.findElementInDetail_V3(['MainInsured']);
    			
    			//prospectPersonalUIService.copyElements_V3(mainInsured, prospectPersonalUIService.findElementInDetail_V3(['Personal']));
    			
    			illustrationUIService.findElementInDetail_V3(['MainInsured'])["@refUid"] = prospectSelected.DocId;
    			illustrationUIService.findElementInElement_V3(mainInsured, ['PersonName','FullName']).$ = prospectPersonalUIService.findElementInDetail_V3(['FullName']).$;
    			illustrationUIService.findElementInElement_V3(mainInsured, ['BirthDate']).$ = prospectPersonalUIService.findElementInDetail_V3(['BirthDate']).$;
    			illustrationUIService.findElementInElement_V3(mainInsured, ['IDs','ID','IDNumber']).$ = prospectPersonalUIService.findElementInDetail_V3(['IDNumber']).$;
    			illustrationUIService.findElementInElement_V3(mainInsured, ['IDs','ID','IDType']).Value = prospectPersonalUIService.findElementInDetail_V3(['IDType']).Value;
    			illustrationUIService.findElementInElement_V3(mainInsured, ['Race']).Value = prospectPersonalUIService.findElementInDetail_V3(['Race']).Value;
    			illustrationUIService.findElementInElement_V3(mainInsured, ['Gender']).Value = prospectPersonalUIService.findElementInDetail_V3(['Gender']).Value;
    			illustrationUIService.findElementInElement_V3(mainInsured, ['Title']).Value = prospectPersonalUIService.findElementInDetail_V3(['Title']).Value;
    		});
    	} else {
    		illustrationUIService.findElementInDetail_V3(['MainInsured'])["@refUid"] = "";
    		illustrationUIService.findElementInDetail_V3(['PersonName','FullName']).$ = "";
			illustrationUIService.findElementInDetail_V3(['BirthDate']).$ = "";
			illustrationUIService.findElementInDetail_V3(['IDs','ID','IDNumber']).$ = "";
			illustrationUIService.findElementInDetail_V3(['IDs','ID','IDType']).Value = "";
			illustrationUIService.findElementInDetail_V3(['MainInsured','Occupation']).Value = "";
			illustrationUIService.findElementInDetail_V3(['Gender']).Value = "";
			illustrationUIService.findElementInDetail_V3(['MainInsured','BusinessIndustry']).Value = "";
			illustrationUIService.findElementInDetail_V3(['MainInsured', 'Race']).Value = "";
			illustrationUIService.findElementInDetail_V3(['MainInsured', 'Title']).Value = "";
    	}
    };
    
    $scope.updateCurrencyByCountry = function() {
    	var selectedValue = illustrationUIService.findElementInDetail_V3(['Coverage','Country']).Value;
		var group = illustrationUIService.findGroupInMapListByValue(illustrationUIService.lazyChoiceList[illustrationUIService.productName],'PACountry',selectedValue);
    	group = group.split(";");
    	illustrationUIService.findElementInDetail_V3(['BillingCurrency']).Value = group[0];
    	illustrationUIService.findElementInDetail_V3(['SICurrency']).Value = group[0];
    }
    
    $scope.updateExpiryDate = function() {
    	var inceptionDate = illustrationUIService.findElementInDetail_V3(['InceptionDate']).$;
    	var expiryDate = commonUIService.addDate(inceptionDate, '1', 'y');
    	illustrationUIService.findElementInDetail_V3(['ExpiryDate']).$ = commonUIService.addDate(expiryDate, '-1', 'd');
    }
    
    $scope.countNumberOfPersons = function() {
    	var mainInsured = illustrationUIService.findElementInDetail_V3(['MainInsured']);
    	var numberOfPersons = 0;
    	if(commonService.hasValueNotEmpty(illustrationUIService.chosenProspectList)) {
    		numberOfPersons = numberOfPersons + 1;
    	}
    	var numberOI = illustrationUIService.findElementInDetail_V3(['OtherInsuredPersons'])['@counter'];
    	var total = numberOfPersons + parseInt(numberOI);
    	illustrationUIService.findElementInDetail_V3(['NoOfPeople']).$ = total;
    	return total;
    };
    
    $scope.populatOccupationClass = function() {
    	var selectedValue = illustrationUIService.findElementInDetail_V3(['MainInsured','Occupation']).Value;
		var group = illustrationUIService.findGroupInMapListByValue(illustrationUIService.lazyChoiceList[illustrationUIService.productName],'MIOccupation',selectedValue);
    	group = group.split(";");
    	illustrationUIService.findElementInDetail_V3(['MainInsured','BusinessIndustry']).Value = group[0];
    };
    
	$scope.populateNCDVehicleNo = function(){
		illustrationUIService.findElementInDetail_V3(['NCDVehicleNo']).$ = illustrationUIService.findElementInDetail_V3(['VehicleNo']).$;
	};
	
	$scope.checkISM = function(){
		checkIsInBlacklisted().then(function(result){
			if (!result){
				illustrationUIService.getMarketValueAndNCD($scope.resourceURL).then(function(data){
					 $scope.reSetupConcreteUiStructure(illustrationUIService.detail);
				})
			};
//			else {
//				commonUIService.showNotifyMessage("v3.mynewworkspace.message.VehicleNumberIsInBlacklist");
//			}
		});
	};
	
    $scope.checkMarketValue = function() {
    	if (commonService.hasValueNotEmpty(illustrationUIService.findElementInDetail_V3(['VehicleNo']).$)) {
    		var url = commonService.getUrl(commonService.urlMap.CHECK_BLACKLIST, [illustrationUIService.findElementInDetail_V3(['VehicleNo']).$]);
    		ajax.getRuntime($scope.resourceURL, url, function(data){
    			if (illustrationUIService.findElementInElement_V3(data, ['ipos-response:cause']) == "VehicleNo is in blacklist") {
    				illustrationUIService.findElementInDetail_V3(['DocStatus'])['DocumentStatus'] = "INVALID";
    				
    				var confirm = $mdDialog.confirm()
    				 .title($filter('translate')("MSG-FQ06"))
   			         .ok($filter('translate')("v3.yesno.enum.Y"))
   			         .cancel($filter('translate')("v3.yesno.enum.N"));
    				$mdDialog.show(confirm).then(function(){
    					illustrationUIService.saveDetail_V3($scope.resourceURL, false).then(function(data){
    						commonUIService.showNotifyMessage("v3.mynewworkspace.message.SaveDraftQuotationSuccessfully", "success");
    					});
    				});
    			} else {
    				var url = commonService.getUrl(commonService.urlMap.CHECK_ISM, [illustrationUIService.findElementInDetail_V3(['VehicleNo']).$]);
    				ajax.getRuntime($scope.resourceURL, url, function(data){
    					commonUIService.showNotifyMessage("v3.mynewworkspace.message.RetrieveInformationFromISMSuccessfully", "success");
    					illustrationUIService.findElementInDetail_V3(['MarketValue']).$ = illustrationUIService.findElementInElement_V3(data, ['MarKetValue']);
    				});
    			}
    		});
    	} else {
    		commonUIService.showNotifyMessage("v3.mynewworkspace.message.VehicleNumberCannotBeEmpty");
    	}
    }
	
	$scope.checkNCDValue = function(){
		if (commonService.hasValueNotEmpty(illustrationUIService.findElementInDetail_V3(['VehicleNo']).$)) {
			var url = commonService.getUrl(commonService.urlMap.CHECK_BLACKLIST, [illustrationUIService.findElementInDetail_V3(['VehicleNo']).$]);
			ajax.getRuntime($scope.resourceURL, url, function(data){
				if (illustrationUIService.findElementInElement_V3(data, ['ipos-response:cause']) == "VehicleNo is in blacklist") {
					illustrationUIService.findElementInDetail_V3(['DocStatus'])['DocumentStatus'] = "INVALID";
					commonUIService.showNotifyMessage("v3.mynewworkspace.message.VehicleNumberIsInBlacklist");
					var confirm = $mdDialog.confirm()
						.title($filter('translate')("MSG-FQ06"))
						.ok($filter('translate')("v3.yesno.enum.Y"))
						.cancel($filter('translate')("v3.yesno.enum.N"));
					$mdDialog.show(confirm).then(function(){
						illustrationUIService.saveDetail_V3($scope.resourceURL, false).then(function(data){
							commonUIService.showNotifyMessage("v3.mynewworkspace.message.SaveDraftQuotationSuccessfully", "success");
						});
					});
				} else {
					var url = commonService.getUrl(commonService.urlMap.CHECK_ISM, [illustrationUIService.findElementInDetail_V3(['VehicleNo']).$]);
					ajax.getRuntime($scope.resourceURL, url, function(data){
						commonUIService.showNotifyMessage("v3.mynewworkspace.message.RetrieveInformationFromISMSuccessfully", "success");
						illustrationUIService.findElementInDetail_V3(['NCDFrom']).Value = illustrationUIService.findElementInElement_V3(data, ['NCDForm']);
						illustrationUIService.findElementInDetail_V3(['NCDVehicleNo']).$ = illustrationUIService.findElementInElement_V3(data, ['NCDVehicleNo']);
						illustrationUIService.findElementInDetail_V3(['PreviousPolicyNo']).$ = illustrationUIService.findElementInElement_V3(data, ['PrevPolicyNo']);
						illustrationUIService.findElementInDetail_V3(['PreviousPolicyEffectiveDate']).$ = illustrationUIService.findElementInElement_V3(data, ['PrevPolicyEffDate']);
						illustrationUIService.findElementInDetail_V3(['PreviousPolicyExpiryDate']).$ = illustrationUIService.findElementInElement_V3(data, ['PrevPolicyExpDate']);
						illustrationUIService.findElementInDetail_V3(['NCDAllowed']).Value = illustrationUIService.findElementInElement_V3(data, ['NCDAllow']);
						illustrationUIService.findElementInDetail_V3(['NCDEffectivedate']).$ = illustrationUIService.findElementInElement_V3(data, ['NCDEffDate']);
						illustrationUIService.findElementInDetail_V3(['NoOfClaim']).$ = illustrationUIService.findElementInElement_V3(data, ['NoOfClaim3Year']);
					});
				}
			});
		} else {
			commonUIService.showNotifyMessage("v3.mynewworkspace.message.VehicleNumberIsInBlacklist");
		}
	};
	
	// START get PO full name for Summary Section ( Fire Quotation )
	$scope.getPolicyOwner = function(){
		var prospectInSC = salecaseUIService.findElementInDetail_V3(['Prospect'])[0];
		var firstProspectId = prospectInSC['@refUid'];
		if(firstProspectId!=''){
			prospectPersonalUIService.findDocument_V3($scope.resourceURL, firstProspectId).then(function(data){
				illustrationUIService.policyOwnerInFire = prospectPersonalUIService.findElementInDetail_V3(['FullName']).$;
			});
		}else{
		}
		
	}
	if (illustrationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.FIRE && salecaseUIService.findElementInDetail_V3(['@case-name'])=='NewBusiness' ) {
		$scope.getPolicyOwner();
	}
	// END get PO full name for Summary Section ( Fire Quotation )
	
	$scope.refreshAndReSetup = function(){
		illustrationUIService.refreshIllustration($scope.resourceURL).then(function(data){
			//illustrationUIService.jsonToArray(illustrationUIService.detail, 'InsuredInterests', 'illustration-fire:InsuredInterest');
			//illustrationUIService.jsonToArray(illustrationUIService.detail, 'PerilFEAOthers', 'illustration-fire:PerilFEAOther');
			$scope.reSetupConcreteUiStructure(data); // refresh the values in multiple cards
		});
	}
	$scope.refreshIllustration = function(resourceURL){
		illustrationUIService.refreshIllustration(resourceURL).then(function(data){
			$scope.reSetupConcreteUiStructure(data); // refresh the values in multiple cards
		});
	}

	/**
     * @author ynguyen7
	 * Refresh details to update new value of attribute
	 */    
    $scope.refreshAll = function(){
    	illustrationUIService.refresh_V3($scope.resourceURL).then(function(data){
			$scope.reSetupConcreteUiStructure(illustrationUIService.detail);
		});
    }
	
	$scope.computeTag = function (element, card, removeTemplateChildren){
		var deferred = illustrationUIService.$q.defer();
		
		//stop compute when accepted
		if($scope.moduleService.findElementInDetail_V3(['BusinessStatus']) == commonService.CONSTANTS.STATUS.ACCEPTED 
				&& (illustrationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.UNIT_LINK
						|| illustrationUIService.productName == commonService.CONSTANTS.PRODUCT.REGULAR_UNIT_LINK
						|| illustrationUIService.productName == commonService.CONSTANTS.PRODUCT.ENDOWMENT)){
			deferred.resolve();
			return deferred.promise;
		}
		illustrationUIService.computeElementAndUpdateLazyList($scope.resourceURL, element).then(function(data){
			if (card) $scope.markValidCard(card); //Check VALID on Card
			$scope.reSetupConcreteUiStructure(illustrationUIService.detail,$scope.getAssociateUiStructureRoot().isDetailChanged, removeTemplateChildren); // refresh the values in multiple cards			
			deferred.resolve(data);
		});
		return deferred.promise;
	}
	
	$scope.filterLazyListItemsByGroup = function(nodeName, group){
		var list = illustrationUIService.PerilFEAOtherType;
		var newList = [];
		for(var i=0; i <list.length;i++){
			if(list[i].group==group){
				newList.push(list[i]);
			}
		}
		illustrationUIService.findElementInElement_V3(illustrationUIService.lazyChoiceList[illustrationUIService.productName], [nodeName]).Option = newList;
	}

	$scope.setBillingCurrency = function(){
		illustrationUIService.findElementInDetail_V3(['BillingCurrency']).Value = illustrationUIService.findElementInDetail_V3(['SICurrency']).Value;
	}
	
	if(!commonService.hasValue(illustrationUIService.acceptedQuotationID)) {
		var quotationList = salecaseUIService.findElementInDetail_V3(['Quotations']);
		if(commonService.hasValue(quotationList) && quotationList['@counter'] > 0) {
			
			var quotations = salecaseUIService.findElementInElement_V3(quotationList, ['Quotation']);
			var quotationId = [];
			for(var i = 0; i < quotations.length; i++) {
				var quotation = illustrationUIService.findElementInElement_V3(quotations[i], ['QuotationId']);
				if(commonService.hasValue(quotation) && commonService.hasValueNotEmpty(quotation.$)) {
					quotationId.push(quotation.$);
				}
			}
			
			if(commonService.hasValueNotEmpty(quotationId)) {
				illustrationUIService.findMetadata_V3($scope.resourceURL, quotationId).then(function(metadata) {
					var quotationMetadata = prospectPersonalUIService.findElementInElement_V3(metadata, ['MetadataDocument']);
					if (!$.isArray(quotationMetadata)){
						var temp = quotationMetadata;
						quotationMetadata = [];
						quotationMetadata.push(temp);
					}
					for(var i = 0; i < quotationMetadata.length; i++) {
						if(quotationMetadata[i]['BusinessStatus'] == 'ACCEPTED' ){
							illustrationUIService.acceptedQuotationID = quotationMetadata[i]['DocId'];
							break;
						}
					}
				});
			}
		}
	}
	$scope.$on('printPreviewPDFByHtmlIllustration', function(event, actionType, action){
	    $scope.printPdfByHtml(actionType, action);
	});
	/**
	*action: download or preview (default: preview)
	*/
	$scope.printPdf = function(actionType, action) {
		if(illustrationUIService.productName == commonService.CONSTANTS.PRODUCT.ENDOWMENT ||
		   illustrationUIService.productName == commonService.CONSTANTS.PRODUCT.REGULAR_UNIT_LINK){
		    $scope.printPdfByHtml(actionType, action);
		    return;
		}
		//for MNC Link - new action type for underwriting quotation
		if (illustrationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.UNIT_LINK
				|| illustrationUIService.productName == commonService.CONSTANTS.PRODUCT.REGULAR_UNIT_LINK
				|| illustrationUIService.productName == commonService.CONSTANTS.PRODUCT.ENDOWMENT) {
			//Populate Policy Owner to Life Assure
			$scope.populatePOToLI();
			if ($scope.checkUnderwriterQuotation()) {
				if (!commonService.hasValueNotEmpty(actionType)) {// actionType = new business
					actionType = 'uq';
				} else if (actionType == 'abridge') {
					actionType = 'uq-abridge';
				}
			}
		}
		//dnguyen98: Manually loading bar to make loading bar always show for print action
		sessionStorage.setItem("longOverLay", true);
		loadingBarService.showLoadingBar();
		
		illustrationUIService.generateDocument_V3($scope.portletId).then(function(data) {
			if (illustrationUIService.isSuccess(data)){
				$scope.getAssociateUiStructureRoot().isDetailChanged = false;
				$scope.saveDetail( actionType ).then(function(data) {
					if (illustrationUIService.isSuccess(data)) {
						illustrationUIService.group = illustrationUIService.getProductGroup_V3(illustrationUIService.productName);
						var businessType = salecaseUIService.findElementInDetail_V3(['@case-name']);
						if (!commonService.hasValueNotEmpty(actionType)) {
						    actionType = businessType.toLowerCase();
						}
						if (!commonService.hasValueNotEmpty(action)) {
                            action = "preview";
                        }
                        // we separate into 2 product Endowment and RUL
						if (illustrationUIService.productName == commonService.CONSTANTS.PRODUCT.REGULAR_UNIT_LINK) {
						    $scope.printPdfService.generatePdf($scope.portletId, illustrationUIService, illustrationUIService.productName, actionType);
						} else {
						    if(action == "preview"){
							    $scope.openPreviewPDF(illustrationUIService.name, actionType);
						    }else{
						        $scope.printPdfService.generatePdf($scope.portletId, illustrationUIService, illustrationUIService.productName, actionType);
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

    /** hle56
    * show or download pdf template by HTML
    * actionType : action of PDF template
    * action: preview or download
    */
	$scope.printPdfByHtml = function printPdfByHtml(actionType, action){
        //for MNC Link - new action type for underwriting quotation
        if (illustrationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.UNIT_LINK
                || illustrationUIService.productName == commonService.CONSTANTS.PRODUCT.REGULAR_UNIT_LINK
                || illustrationUIService.productName == commonService.CONSTANTS.PRODUCT.ENDOWMENT) {
            //Populate Policy Owner to Life Assure
            $scope.populatePOToLI();
            if ($scope.checkUnderwriterQuotation()) {
                if (!commonService.hasValueNotEmpty(actionType)) {// actionType = new business
                    actionType = 'uq';
                } else if (actionType == 'abridge') {
                    actionType = 'uq-abridge';
                }
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
            illustrationUIService.generateDocument_V3($scope.portletId).then(function(data) {
                if (illustrationUIService.isSuccess(data)){
                    $scope.getAssociateUiStructureRoot().isDetailChanged = false;
                    $scope.saveDetail( actionType ).then(function(data) {
                        if (illustrationUIService.isSuccess(data)) {
                            illustrationUIService.group = illustrationUIService.getProductGroup_V3(illustrationUIService.productName);
                            $scope.openPreviewPDF(illustrationUIService.name, actionType);
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
        }else {
            
            var dataHTML = '';
            try {
                dataHTML = commonService.itextElement[0].nextSibling.innerHTML;
            } catch (e) {}
            var printData = {
                html: dataHTML,
                model: illustrationUIService.detail
            };
            $scope.printPdfService.generatePdf($scope.portletId, illustrationUIService, illustrationUIService.productName, actionType, undefined, JSON.stringify(printData));
     
        }
	}


	/**
	  * @author lhoang4 (Long Hoang)
	  * Check DocId in Illustration GTL, support fot print PDF
	  * @param  {} 
	  */
			
	var checkGTLDocId = function(){
		var self = this;
		var deferred = illustrationUIService.$q.defer();
		illustrationUIService.saveDetail_V3($scope.resourceURL, false).then (function (data){
			if (illustrationUIService.isSuccess(data)){				
			salecaseUIService.findElementInDetail_V3(['Quotation'])["@refUid"] = illustrationUIService.findElementInElement_V3(data,['DocInfo'])["DocId"];
			$scope.updatePOandLAName_RUL();//update PO and LI name for BC RUL
			salecaseUIService.saveDetail_V3($scope.resourceURL, false).then (function (data){
				if (illustrationUIService.isSuccess(data)){
					deferred.resolve(data);
				}
				else deferred.resolve(false);
			})
	 }
		else deferred.resolve(false);
	})
		return  deferred.promise;
	}
	/**
	  * @author lhoang4 (Long Hoang)
	  * Print PDF before User click Save or Compute
	  * @param  {actionType} actionType belong to GTL PDF Template 
	  */
	$scope.printGTLPDF = function(actionType){
		checkGTLDocId().then(function(data){
			if (data !== false){
					 illustrationUIService.group = illustrationUIService.getProductGroup_V3(illustrationUIService.productName);
					 var businessType = salecaseUIService.findElementInDetail_V3(['@case-name']);
					if (!commonService.hasValueNotEmpty(actionType)) {
						$scope.printPdfService.generatePdf($scope.portletId, illustrationUIService, illustrationUIService.productName, businessType.toLowerCase());
				 } else {
						$scope.printPdfService.generatePdf($scope.portletId, illustrationUIService, illustrationUIService.productName, actionType);
				 }
				}
			else commonUIService.showNotifyMessage("v3.myworkspace.message.GeneratePDFUnsuccessfully");
		})
	};
//	$scope.printPreviewPdf = function(actionType) {
//		var docId = illustrationUIService.findElementInDetail_V3(["DocId"]);
//			
//		 
//		 if(!docId){
//			 return;
//		 }
//		 illustrationUIService.findDocument_V3($scope.resourceURL, docId).then(function(data){
//			 illustrationUIService.productName = illustrationUIService.findElementInDetail_V3(["Product"]);
//			 illustrationUIService.generateDocument_V3($scope.portletId).then(function(data) {
//				 if (illustrationUIService.isSuccess(data)) {
//					 illustrationUIService.group = illustrationUIService.getProductGroup_V3(illustrationUIService.productName);
//					 if (illustrationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.MOTOR) {
//						 convertElementToArray();
//					 }
////			    	else if (applicationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.TERM_LIFE) { }
//					 var businessType = salecaseUIService.findElementInDetail_V3(['@case-name']);
//					 var templateName = "Quotation Fire Houseowner AS Abridged";
//					 
//				/*	 if(illustrationUIService.productName == commonService.CONSTANTS.PRODUCT.GUARANTEED_CASHBACK){
//						 templateName = "Quotation Guaranteed Cashback Saver Abridged";
//					 }*/
//					 
//					 switch(illustrationUIService.productName) {
//					    case commonService.CONSTANTS.PRODUCT.GUARANTEED_CASHBACK:
//					    	templateName = "Quotation Guaranteed Cashback Saver Abridged";
//					        break;
////						case commonService.CONSTANTS.PRODUCT.TERM_LIFE_SECURE:
//					    case 'term-life-secure':
//					    	templateName = "Quotation TermLifeSecure Abridged";
//					        break;
//					    case commonService.CONSTANTS.PRODUCT.GROUP_TERM_LIFE:
//					    	templateName = "";
//					        break;
//					}
//					 
//					 $scope.printPdfService.generatePdf($scope.portletId, illustrationUIService, illustrationUIService.productName, actionType, "", templateName);
//				 } else {
//					 commonUIService.showNotifyMessage("v3.myworkspace.message.GeneratePDFUnsuccessfully");
//				 }
//			 });
//		});
//	};
	
	var checkIsInBlacklisted = function(){
		var deferred = illustrationUIService.$q.defer();
		if (illustrationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.MOTOR) {
			if (illustrationUIService.productName == commonService.CONSTANTS.PRODUCT.DIRECT_SALE_MOTOR) {
				deferred.resolve(false);
			} else if (commonService.hasValueNotEmpty(illustrationUIService.findElementInDetail_V3(['VehicleNo']))) {
				illustrationUIService.checkVehicleInBlacklisted($scope.resourceURL).then(function(result){
					if (result) {
						illustrationUIService.findElementInDetail_V3(['DocStatus'])['DocumentStatus'] = "INVALID";
						commonUIService.showNotifyMessage("v3.mynewworkspace.message.VehicleNumberIsInBlacklist");
						illustrationUIService.findElementInDetail_V3(['VehicleNo']).errorMessage = "v3.mynewworkspace.message.VehicleNumberIsInBlacklist";
						var confirm = $mdDialog.confirm()
							.title($filter('translate')("MSG-FQ06"))
							.ok($filter('translate')("v3.yesno.enum.Y"))
							.cancel($filter('translate')("v3.yesno.enum.N"));
						$mdDialog.show(confirm).then(function(){
							illustrationUIService.saveDetail_V3($scope.resourceURL, false).then(function(data){
								commonUIService.showNotifyMessage("v3.mynewworkspace.message.SaveDraftQuotationSuccessfully", "success");
							});
						});
						deferred.resolve(result);
					}
					else deferred.resolve(result);
				})
				
			} else {
				commonUIService.showNotifyMessage("v3.mynewworkspace.message.VehicleNumberCannotBeEmpty");
				illustrationUIService.findElementInDetail_V3(['VehicleNo']).errorMessage =  "v3.mynewworkspace.message.VehicleNumberCannotBeEmpty";
				deferred.resolve(true);
			}
		}
//		Disable for new GTL1 UI
		else if (illustrationUIService.productName == "GTL1"){
			$scope.prepareOrganisationDistToCompute();
			deferred.resolve(false);
		}
		else{
			 deferred.resolve(false);
		}
		return deferred.promise;
	};
	$scope.updateInterestTypeList = function(){
		var interestList = illustrationUIService.findElementInDetail_V3(['InsuredInterest']);
		$scope.interestOptions = angular.copy(illustrationUIService.findElementInElement_V3(illustrationUIService.lazyChoiceList[illustrationUIService.productName], ['InterestCode']).Option);
		for (var i=0;i<interestList.length;i++){
			var interestValue = illustrationUIService.findElementInElement_V3(interestList[i],['InterestCode']).Value;
			for (var j=0;j<$scope.interestOptions.length;j++){
				if (interestValue == $scope.interestOptions[j].value){
					$scope.interestOptions.splice(j, 1)
				}			
			}
		}
	};
	
	$scope.attachmentFiles = function attachmentFiles(files){
    	var self = this;
    	var j = 0;
    	for(var i = 0; i< files.length; i++){
    		self.multiUploadService.uploadFile($scope.portletId, files[i]).then(function uploaded(data){
    			if(data != undefined){
					if(!$.isArray(illustrationUIService.findElementInElement_V3(illustrationUIService.detail, ['Attachment']))){
						illustrationUIService.convertJsonPathToArray(illustrationUIService.detail,'Attachments','Attachment');
					}
					var sampleData = angular.copy(illustrationUIService.findElementInElement_V3(illustrationUIService.detail, ['Attachment'])[0]);
					sampleData.FileUid.$ = illustrationUIService.findElementInElement_V3(data[0], ['FileUid']).$;
					sampleData.Name.$ = illustrationUIService.findElementInElement_V3(data[0], ['Name']).$;
					sampleData.FileName.$ = illustrationUIService.findElementInElement_V3(data[0], ['FileName']).$;
					sampleData.CreateDate.$ = illustrationUIService.findElementInElement_V3(data[0], ['DateTime']).$;
					sampleData.FileSize.$ = illustrationUIService.findElementInElement_V3(data[0], ['FileSize']).$;
					sampleData['@refResourceUid'] = illustrationUIService.findElementInElement_V3(data[0], ['DocId']);
					sampleData['@refResourceDocType'] = illustrationUIService.findElementInElement_V3(data[0], ['DocType']);
					
					illustrationUIService.findElementInDetail_V3(['Members'])['@refResourceUid'] = illustrationUIService.findElementInElement_V3(data[0], ['DocId']);
					
					if(illustrationUIService.findElementInElement_V3(illustrationUIService.detail, ['Attachments'])['@counter'] > 0){
						illustrationUIService.findElementInElement_V3(illustrationUIService.detail, ['Attachment']).push(sampleData);
					}else{
						illustrationUIService.findElementInElement_V3(illustrationUIService.detail, ['Attachment'])[0] = sampleData;
					}
					illustrationUIService.findElementInElement_V3(illustrationUIService.detail, ['Attachments'])['@counter']=illustrationUIService.findElementInElement_V3(illustrationUIService.detail, ['Attachment']).length;
    				i--;
    				files.splice(i,1);
    				
    				if(files.length == 0){
    					commonUIService.showNotifyMessage("v3.common.message.Attachsuccessfully", "success");
    				}
    			}
    			else{
    				files[j].validate=$translate.instant("v3.common.message.Attachfail.Validate");
    				commonUIService.showNotifyMessage("v3.common.message.Attachfail", "fail");
    				j++;
    			}
    		});
    	}
    };
    
    $scope.checkHazardousEvent = function checkHazardousEvent(index){
		var listNode = $scope.moduleService.findElementInDetail_V3(['HazardousEvent']);
		var originalListNode = angular.copy($scope.moduleService.findElementInElement_V3($scope.moduleService.originalDetail, ['HazardousEvent']));
		var childrenNode =  listNode[index];
		for(var i =0; i < listNode.length; i++){
			if(i != index && $scope.moduleService.findElementInElement_V3(listNode[index],['HazardousEventCd']).Value !="" 
			   && $scope.moduleService.findElementInElement_V3(listNode[i],['HazardousEventCd']).Value == $scope.moduleService.findElementInElement_V3(childrenNode,['HazardousEventCd']).Value){
				$scope.moduleService.findElementInElement_V3(listNode[index],['HazardousEventCd']).Value = $scope.moduleService.findElementInElement_V3(originalListNode[index],['HazardousEventCd']).Value;
				commonUIService.showNotifyMessage("v3.mynewworkspace.message.eachHazardShouldBeSelectOnlyOneTime", "fail");
			}
		}
	}
    
//    $scope.isShowUnAcceptQuotation = function isShowUnAcceptQuotation(){
//    	if(
//    		($scope.moduleService.productName == commonService.CONSTANTS.PRODUCT.PERSONAL_ACCIDENT 
//    		 && $scope.moduleService.findElementInDetail_V3(['BusinessStatus']) == 'ACCEPTED' 
//    		 && salecaseUIService.findElementInDetail_V3(['Application'])['@refUid'] == ''
//    		) ||
//    		($scope.moduleService.productName == 'GTL1' //check UnAcceptQuotation button for Group Term Life Product
//    		 && $scope.moduleService.findElementInDetail_V3(['BusinessStatus']) == 'ACCEPTED' 
//    	     && !commonService.hasValueNotEmpty(salecaseUIService.findElementInDetail_V3(['ManagerReview', '@refUid']))
//    	    )
//    	    ||
//    		($scope.moduleService.productName == 'FIR' //check UnAcceptQuotation button for FIR Direct Sale Product
//    		 && $scope.moduleService.findElementInDetail_V3(['BusinessStatus']) == 'ACCEPTED'
//    		 && !(commonService.hasValueNotEmpty(salecaseUIService.findElementInDetail_V3(['ClientPayment'])['@refUid']) || commonService.hasValueNotEmpty(salecaseUIService.findElementInDetail_V3(['Underwriting'])['@refUid']))
//    	    )    	    
//    	){
//    		return true;
//    	}    		
//    	return false;
//    }
    
    $scope.isShowAcceptQuotation = function isShowAcceptQuotation(){
    	if(
    		($scope.moduleService.productName == 'FIR' //check UnAcceptQuotation button for FIR Direct Sale Product
    		 && $scope.moduleService.findElementInDetail_V3(['BusinessStatus']) != 'ACCEPTED'
    			 && $scope.moduleService.findElementInDetail_V3(['BusinessStatus']) != 'NEW'
    		 && !(commonService.hasValueNotEmpty(salecaseUIService.findElementInDetail_V3(['ClientPayment'])['@refUid']) || commonService.hasValueNotEmpty(salecaseUIService.findElementInDetail_V3(['Underwriting'])['@refUid']))
    		 && ($scope.isLastQuotation ? true : !commonService.hasValue($scope.moduleService.acceptedQuotationID))
    	    )    	    
    	){
    		return true;
    	} else if((($scope.moduleService.productName == commonService.CONSTANTS.PRODUCT.REGULAR_UNIT_LINK || $scope.moduleService.productName == commonService.CONSTANTS.PRODUCT.ENDOWMENT)
	    		 && $scope.moduleService.findElementInDetail_V3(['BusinessStatus']) != 'ACCEPTED'
	    			 && $scope.moduleService.findElementInDetail_V3(['DocumentStatus']) == 'VALID'
	    		 && !(commonService.hasValueNotEmpty(salecaseUIService.findElementInDetail_V3(['ClientPayment'])['@refUid']) || commonService.hasValueNotEmpty(salecaseUIService.findElementInDetail_V3(['Underwriting'])['@refUid']))
	    		 && ($scope.isLastQuotation ? true : !commonService.hasValue($scope.moduleService.acceptedQuotationID)))
	        && $scope.getAssociateUiStructureRoot().isDetailChanged == false
    	   	){
    		return true;
    	} else if(($scope.moduleService.productName == commonService.CONSTANTS.PRODUCT.DS_GUARANTEED_CASHBACK //check UnAcceptQuotation button for Guaranteed Cashback Direct Sale Product
	    		 && $scope.moduleService.findElementInDetail_V3(['BusinessStatus']) != 'ACCEPTED'
	    			 && $scope.moduleService.findElementInDetail_V3(['DocumentStatus']) == 'VALID'
	    		 && (commonService.hasValueNotEmpty(salecaseUIService.findElementInDetail_V3(['Underwriting'])['@refUid']))
	    		 && ($scope.isLastQuotation ? true : !commonService.hasValue($scope.moduleService.acceptedQuotationID)))    
    	   	){
    		return true;
    	}
    	return false;
    };
//	this function is for Update Main Product from GTL Product to Main Product in Plan Detail
    $scope.updateMainProduct = function(){
    	var planList = illustrationUIService.findElementInDetail_V3(['PlanDetails']);
    	if (planList.length === undefined)
    		planList = [planList];
    	for (var i=0;i<planList.length;i++){
    		illustrationUIService.findElementInElement_V3(planList[i],['MainProduct']).Value = illustrationUIService.findElementInDetail_V3(['GTL1','ProductCd']).Value
    	};
    };
    // Get user role
    $scope.getUserRole = function(){
		var userRoleInfo = JSON.parse(localStorage.getItem("userRoleInfo"));
		$scope.pasID="";
		if (userRoleInfo) {
    		/*for (var p in userRoleInfo) {
    			for(i = 0; i < userRoleInfo[p].length; i ++){
    				if (userRoleInfo[p][i].isActive == "Y" && commonService.hasValueNotEmpty(userRoleInfo[p][i].pasID)) {
    					$scope.pasID = userRoleInfo[p][i].pasID;
    					break;
    		        }
    			}
    		}*/
			for(i = 0; i < userRoleInfo.length; i ++){
				if (userRoleInfo[i].isActive == "Y" && commonService.hasValueNotEmpty(userRoleInfo[i].pasID)) {
					$scope.pasID = userRoleInfo[i].pasID;
					break;
				}
			}
		}
		return $scope.pasID;
	};
//    Function: GTL1 add new element in Supplementary Plan List
    $scope.addPlanDetail = function(card, fnCallBack, moreParams){
    	$scope.addCard(card);
    	illustrationUIService.addElementInElement_V3(illustrationUIService.detail,['SupplementaryPlanList'],['SupplementaryPlanDetails']);
    	$scope.reSetupConcreteUiStructure(illustrationUIService.detail);
    	
    };

//  Function: GTL1 Remove $index element in Supplementary Plan List
    $scope.removePlanDetail = function(card, index){
    	$scope.removeCard(card, index);
    	illustrationUIService.removeElementInElement_V3(index,illustrationUIService.detail,['SupplementaryPlanList'],['SupplementaryPlanDetails']);
    	$scope.reSetupConcreteUiStructure(illustrationUIService.detail);
    	
    };
    
//  Function: GTL1 Update Plan Number from Plan Detail to Supplementary Plan Detail
    $scope.updatePlanNo = function(){
    	var planDetail = illustrationUIService.findElementInDetail_V3(['PlanDetails']);
    	var supPlanDetail = illustrationUIService.findElementInDetail_V3(['SupplementaryPlanDetails']);
    	for (var i=0;i<planDetail.length;i++){
    		illustrationUIService.findElementInElement_V3(supPlanDetail[i],['SupplementaryPlanNumber']).$ = illustrationUIService.findElementInElement_V3(planDetail[i],['PlanNumber']).$;
    	}
    	
//    	$scope.markValidCard(card);
    };
    
    $scope.populateProductName = function(card){
    	illustrationUIService.findElementInElement_V3(card.refDetail,['MainProduct']).Value = "GTL1";
    	$scope.markValidCard(card);
    };
    
    $scope.calculateAnnualExpiryDate = function(){
    	if(illustrationUIService.productName == commonService.CONSTANTS.PRODUCT.DIRECT_SALE_MOTOR 
    		|| $scope.moduleService.findElementInDetail_V3(['TypeOfTravel']).Value == 'TTYPE-02') {
    		var dateTime = illustrationUIService.findElementInDetail_V3(['InceptionDate']).$;
        	var momentDate = new moment(dateTime);
        	illustrationUIService.findElementInDetail_V3(['ExpiryDate']).$ = momentDate.add(1,'y').subtract(1,'d').format('YYYY-MM-DD');
    	}
    }
    
    /** hle56
     * Add new expiry date to expiryDateEle from inceptionDateEle with yearAdd
     *  @param inceptionDateEle: ref name of inceptionDate in doctype (array)
     *  @param expiryDateEle: ref of name of expiryDate in doctype (array)
     *  @param formatDate (ex: 'YYYY-MM-DD')
     *  @param yearAdd: how many year we will add
	 *  TODO: haven't implement add month and day.
	 *  use for Illustration in PA product
	 */
    $scope.calculateExpiryDate = function(inceptionDateEle, expiryDateEle, formatDate, yearAdd, monthAdd, dayAdd){
		var dateTime = illustrationUIService.findElementInDetail_V3(inceptionDateEle).$;
    	var momentDate = new moment(dateTime);
    	illustrationUIService.findElementInDetail_V3(expiryDateEle).$ = momentDate.add(yearAdd,'y').subtract(1,'d').format(formatDate);
    }
    
    $scope.convertTravelInfosToArray = function(){
    	if (illustrationUIService.findElementInDetail_V3(['Region']).Value == '') {
    		commonUIService.showNotifyMessage("v3.mynewworkspace.travel-express.illustration.label.NeedRegion");
    		return false;
    	} else {
    		var expiryDate = new Date(illustrationUIService.findElementInDetail_V3(['ExpiryDate']).$);
    		var inceptionDate = new Date(illustrationUIService.findElementInDetail_V3(['InceptionDate']).$);
    		if (expiryDate < inceptionDate){
    			commonUIService.showNotifyMessage("v3.myworkspace.message.ExpiryDateInvalid");
        		return false;
    		}
    	};
    	var travelInfos = illustrationUIService.findElementInDetail_V3(['TravelInformations']);
    	if (travelInfos['@counter'] == '' || travelInfos['@counter'] == '0') {
    		travelInfos['@counter'] = '0';
    		illustrationUIService.convertElementsToArrayInElement_V3(travelInfos);
    	}
    	if (illustrationUIService.findElementInDetail_V3(['Region']).Value != "WLREG-04"){
        	illustrationUIService.destinationTravel = $filter('filterByGroup')(illustrationUIService.findElementInElement_V3(illustrationUIService.lazyChoiceList, ['Destination', 'Option']), illustrationUIService.findElementInDetail_V3(['Region']).Value);
    	} else {
    		illustrationUIService.destinationTravel = $filter('filterByGroup')(illustrationUIService.findElementInElement_V3(illustrationUIService.lazyChoiceList, ['Destination', 'Option']), "WLREG-03");
    		var arrayUSA = $filter('filterByGroup')(illustrationUIService.findElementInElement_V3(illustrationUIService.lazyChoiceList, ['Destination', 'Option']), illustrationUIService.findElementInDetail_V3(['Region']).Value);
    		for (var i = 0; i < arrayUSA.length; i++){
    			illustrationUIService.destinationTravel.push(arrayUSA[i]);
    	    }
   			
    	}
    	if (illustrationUIService.findElementInDetail_V3(['ExpiryDate']).$ != undefined && illustrationUIService.findElementInDetail_V3(['ExpiryDate']).$ != '') {
    		$scope.expiryDateMax = illustrationUIService.findElementInDetail_V3(['ExpiryDate']).$;
    	} else {
    		$scope.expiryDateMax = "2100-01-01";
    	};
    	var dateTime = illustrationUIService.findElementInDetail_V3(['InceptionDate']).$;
		var momentDate = new moment(dateTime);
		$scope.expiryDateMin = momentDate.format('YYYY-MM-DD');
    };
    
    
        
    $scope.computeInfo = function(){
    	illustrationUIService.findElementInDetail_V3(['ContractCurrency']).Value="";
    	illustrationUIService.findElementInDetail_V3(['Loading']).$="";
    	illustrationUIService.findElementInDetail_V3(['MonthlyPremium']).$="";
    	illustrationUIService.findElementInDetail_V3(['YearlyPremium']).$="";
    	illustrationUIService.findElementInDetail_V3(['PolicyOwner','FullName']).$="";
    	illustrationUIService.findElementInDetail_V3(['BasePlan','SumAssured']).$="";
    	illustrationUIService.findElementInDetail_V3(['BasePlan','PremiumFrequencyPayable']).Value="";
    };
    
    /**
     * For travel products, check plan is family or not
     * @param planCd: plan code from illustration document
     */
    $scope.isTravelFamilyPlan = function(planCd){
    	var result = false;
    	if (commonService.hasValueNotEmpty(planCd)) {
    		if (travelPlans[planCd]) {
    			result = travelPlans[planCd].isFamilyPlan;
    		}
    	}
    	return result;
    }
    
    /** for MNC Travel, refresh insureds list by travel plan */
    $scope.refreshInsuredsByPlan = function(){
    	if (illustrationUIService.productName == commonService.CONSTANTS.PRODUCT.DIRECT_TRAVEL) {
        	illustrationUIService.InsuredSelectedIndex = -1;
        }
    	var counter = illustrationUIService.findElementInDetail_V3(['Insureds'])['@counter'];
    	$scope.refreshTags([['Plan'], ['Insureds']]).then(function() {
	        var planCd = illustrationUIService.findElementInDetail_V3(['Plan']).Value;
	        var insuredList = illustrationUIService.findElementInDetail_V3(['Insureds']);
	        var minOccurs = insuredList['@minOccurs'];
	        var maxOccurs = insuredList['@maxOccurs'];
	        if (counter < minOccurs) {
	        	while (counter < minOccurs) {
	        		illustrationUIService.addElementInElement_V3(illustrationUIService.detail, ['Insureds'], ['Insured']);
	        		counter++;
                }
	        } else if (counter > maxOccurs) {
	        	while (counter > maxOccurs) {
                    illustrationUIService.removeElementInElement_V3(--counter, illustrationUIService.detail, ['Insureds'], ['Insured']);
                }
	        }
    	});
    }
    
    /** for MNC Travel, check insureds list before click on insureds card */
    $scope.checkTravelInsureds = function(){
    	var planCd = illustrationUIService.findElementInDetail_V3(['Plan']).Value;
    	if (!commonService.hasValueNotEmpty(planCd)) {
    		commonUIService.showNotifyMessage("v3.mynewworkspace.travel-express.illustration.label.NeedPlan");
    		return false;
    	} else {
    		if (illustrationUIService.productName == commonService.CONSTANTS.PRODUCT.TRAVEL_EXPRESS) {
		    	if (illustrationUIService.findElementInDetail_V3(['Insured'])[0]['@refUid'] == '') {
		    		var prospectInSC = salecaseUIService.findElementInDetail_V3(['Prospect'])[0];
		    		var firstProspectId = prospectInSC['@refUid'];
		    		if(firstProspectId!=''){
		    			prospectPersonalUIService.findDocument_V3($scope.resourceURL, firstProspectId).then(function(data){
		    				var MIName = prospectPersonalUIService.findElementInDetail_V3(['FullName']).$;
		    				var index = MIName.indexOf(" ");
		    				var firstNameTemp = MIName.substr(0, index);
		    				if (firstNameTemp == ''){
		    					illustrationUIService.findElementInDetail_V3(['Insured','FirstName']).$ = MIName.substr(index + 1);
		    				} else {
		    					illustrationUIService.findElementInDetail_V3(['Insured','FirstName']).$ = MIName.substr(0, index); 
		    					illustrationUIService.findElementInDetail_V3(['Insured','LastName']).$ = MIName.substr(index + 1);
		    				}
		    				illustrationUIService.findElementInDetail_V3(['Insured','BirthDate']).$ = prospectPersonalUIService.findElementInDetail_V3(['BirthDate']).$;
		    				var gender = prospectPersonalUIService.findElementInDetail_V3(['Gender']).Value;
		    				illustrationUIService.findElementInDetail_V3(['Insured','Gender']).Value = (gender == null || gender == "") ? null : gender == 'F' ? 'P' : 'L';
		    				illustrationUIService.findElementInDetail_V3(['Insured','IDNumber']).$ = prospectPersonalUIService.findElementInDetail_V3(['IDNumber']).$;
		    				illustrationUIService.findElementInDetail_V3(['Insured'])[0]['@refUid'] = prospectPersonalUIService.findElementInDetail_V3(['DocId']);
		    				$scope.reSetupConcreteUiStructure(illustrationUIService.detail, $scope.getAssociateUiStructureRoot().isDetailChanged);
		    			});
		    		}
		    	}
	    	}
		}
    };

    $scope.isSameBenificiary = function(){
    	if (illustrationUIService.findElementInDetail_V3(['EmergencySameBeneficiary']).Value == "Y") {
    		illustrationUIService.findElementInDetail_V3(['EmergencyName']).$ = illustrationUIService.findElementInDetail_V3(['BEFullname']).$;
    		illustrationUIService.findElementInDetail_V3(['EmergencyNumber']).$ = illustrationUIService.findElementInDetail_V3(['BEContactNumber']).$;
    	}
    };
    
    $scope.removeTravelInformations = function(){
    	illustrationUIService.clearDataInJson(illustrationUIService.findElementInDetail_V3(['TravelInformations']));
    	illustrationUIService.findElementInDetail_V3(['TravelInformations'])['@counter'] = 0;
    };
    	
//For GROUP TRAVEL EXPRESS
    $scope.convertGroupTravelInfosToArray = function(){
    	if (illustrationUIService.findElementInDetail_V3(['Region']).Value == '') { //check region
    		commonUIService.showNotifyMessage("v3.mynewworkspace.travel-express.illustration.label.NeedRegion");
    		return false;
    	} else {
    		var expiryDate = new Date(illustrationUIService.findElementInDetail_V3(['ExpiryDate']).$);
    		var inceptionDate = new Date(illustrationUIService.findElementInDetail_V3(['InceptionDate']).$);
    		if (expiryDate < inceptionDate){
    			commonUIService.showNotifyMessage("v3.myworkspace.message.ExpiryDateInvalid");
        		return false;
    		}
    	};
//    	var travelInfos = illustrationUIService.findElementInDetail_V3(['Travels']);
//    	if (travelInfos['@counter'] == '' || travelInfos['@counter'] == '0') {
//    		travelInfos['@counter'] = '0';
//    		illustrationUIService.convertElementsToArrayInElement_V3(travelInfos);
//    	}
    	if (illustrationUIService.findElementInDetail_V3(['Region']).Value != "WLREG-04"){
        	illustrationUIService.destinationTravel = $filter('filterByGroup')(illustrationUIService.findElementInElement_V3(illustrationUIService.lazyChoiceList, ['Destination', 'Option']), illustrationUIService.findElementInDetail_V3(['Region']).Value);
    	} else {
    		illustrationUIService.destinationTravel = $filter('filterByGroup')(illustrationUIService.findElementInElement_V3(illustrationUIService.lazyChoiceList, ['Destination', 'Option']), "WLREG-03");
    		var arrayUSA = $filter('filterByGroup')(illustrationUIService.findElementInElement_V3(illustrationUIService.lazyChoiceList, ['Destination', 'Option']), illustrationUIService.findElementInDetail_V3(['Region']).Value);
    		for (var i = 0; i < arrayUSA.length; i++){
    			illustrationUIService.destinationTravel.push(arrayUSA[i]);
    	    }
   			
    	}
    	if (illustrationUIService.findElementInDetail_V3(['ExpiryDate']).$ != undefined && illustrationUIService.findElementInDetail_V3(['ExpiryDate']).$ != '') {
    		$scope.expiryDateMax = illustrationUIService.findElementInDetail_V3(['ExpiryDate']).$;
    	} else {
    		$scope.expiryDateMax = "2100-01-01";
    	};
    	var dateTime = illustrationUIService.findElementInDetail_V3(['InceptionDate']).$;
		var momentDate = new moment(dateTime);
		$scope.expiryDateMin = momentDate.format('YYYY-MM-DD');
    };
    //for Group travel - button remove in Travel Infos card when counter = 1
    $scope.removeTravelInformationsGroup = function() {
        illustrationUIService.clearDataInJson(illustrationUIService.findElementInDetail_V3(['Travels']));
        illustrationUIService.findElementInDetail_V3(['Travels'])['@counter'] = 0;
    };
    //for Group travel - button remove in Insured card
    $scope.removeInsuredInformationsGroup = function(planInfo, index) {
    	var insureds = illustrationUIService.findElementInElement_V3(planInfo,['Insureds']);
    	if (insureds['@counter'] == 1) {
    		illustrationUIService.clearDataInJson(illustrationUIService.findElementInElement_V3(insureds, ['Insured']));
    		insureds['@counter'] = 0;
    	} else {
    		var planCd = illustrationUIService.findElementInElement_V3(planInfo, ['PlanCd']).Value;
    		if (index == 0 && $scope.isTravelFamilyPlan(planCd)) {
    			var firstInsured = illustrationUIService.findElementInElement_V3(insureds,['Insured'])[0];
    			var secondInsured = illustrationUIService.findElementInElement_V3(insureds,['Insured'])[1];
    			illustrationUIService.findElementInElement_V3(secondInsured,['NameOfBeneficiary']).$ = illustrationUIService.findElementInElement_V3(firstInsured,['NameOfBeneficiary']).$;
    			illustrationUIService.findElementInElement_V3(secondInsured,['RelationshipWithMainInsured']).Value = illustrationUIService.findElementInElement_V3(firstInsured,['RelationshipWithMainInsured']).Value;
    			illustrationUIService.findElementInElement_V3(secondInsured,['ContactNumberOfBeneficiary']).$ = illustrationUIService.findElementInElement_V3(firstInsured,['ContactNumberOfBeneficiary']).$;
    			illustrationUIService.findElementInElement_V3(secondInsured,['EmergencySameBeneficiary']).Value = illustrationUIService.findElementInElement_V3(firstInsured,['EmergencySameBeneficiary']).Value;
    			illustrationUIService.findElementInElement_V3(secondInsured,['EmergencyContactName']).$ = illustrationUIService.findElementInElement_V3(firstInsured,['EmergencyContactName']).$;
    			illustrationUIService.findElementInElement_V3(secondInsured,['EmergencyContactNumber']).$ = illustrationUIService.findElementInElement_V3(firstInsured,['EmergencyContactNumber']).$;
    		}
    		illustrationUIService.removeElementInElement_V3(index, planInfo, ['Insureds'], ['Insured']);
    	}
    };
    //for Group travel - slide beneficiary
    $scope.toggleBeneficiaryByIndex = function (index, planInfo) {
    	var insureds = illustrationUIService.findElementInElement_V3(planInfo,['Insureds']);
    	var length = illustrationUIService.findElementInElement_V3(planInfo,['Insureds'])['@counter'];
    	var planCd = illustrationUIService.findElementInElement_V3(planInfo, ['PlanCd']).Value;
    	if (!$scope.isTravelFamilyPlan(planCd)) {
    		$('.beneficiary' + index).slideToggle("slow");
    		for (var i = 0;i<=length;i++) {
    			if (i!=index) {
    				if ($('.beneficiary' + i).css('display')=='block') {
    					$('.beneficiary' + i).slideToggle("slow");
    					break;
    				}
    			}
    		}
    	} else { //plan == family
    		if (index==length) { //when click add button
    			if ($('.beneficiary0').css('display')=='block') { //beneficiary is showing 
    				$('.beneficiary0').slideToggle("slow");
    			}
    		}
    		else { //when click show beneficiary
    			$('.beneficiary0').slideToggle("slow");
    		}
    	}
    }
    //for Group travel - add dummy data for Beneficiary - bypass valid status
    $scope.addDummyDataForBeneficiary = function (planInfo, index) {
    	var planCd = illustrationUIService.findElementInElement_V3(planInfo, ['PlanCd']).Value;
    	if ($scope.isTravelFamilyPlan(planCd)) {
	    	if (index != 0) {
		    	var insured = illustrationUIService.findElementInElement_V3(planInfo,['Insured'])[index];
		    	illustrationUIService.findElementInElement_V3(insured,['NameOfBeneficiary']).$ = 'a';
				illustrationUIService.findElementInElement_V3(insured,['RelationshipWithMainInsured']).Value = 'RELAT-02';
				illustrationUIService.findElementInElement_V3(insured,['ContactNumberOfBeneficiary']).$ = '123456789';
				illustrationUIService.findElementInElement_V3(insured,['EmergencySameBeneficiary']).Value = 'N';
				illustrationUIService.findElementInElement_V3(insured,['EmergencyContactName']).$ = 'a';
				illustrationUIService.findElementInElement_V3(insured,['EmergencyContactNumber']).$ = '123456789';
	    	}
    	}
    }
    //for Group travel - is Same beneficiary
    $scope.isSameBenificiaryGroup = function(insured){
    	if (illustrationUIService.findElementInElement_V3(insured,['EmergencySameBeneficiary']).Value == "Y") {
    		illustrationUIService.findElementInElement_V3(insured,['EmergencyContactName']).$ = illustrationUIService.findElementInElement_V3(insured,['NameOfBeneficiary']).$;
    		illustrationUIService.findElementInElement_V3(insured,['EmergencyContactNumber']).$ = illustrationUIService.findElementInElement_V3(insured,['ContactNumberOfBeneficiary']).$;
    	}
    }

    //for Group travel - sum NoOfInsured
    $scope.sumNoOfInsured = function () {
    	var plans = illustrationUIService.findElementInDetail_V3(['PlansInformation']);
    	if (!$.isArray(plans['illustration:PlanInformation'])) {
    		plans['illustration:PlanInformation'] = illustrationUIService.convertToArray(plans['illustration:PlanInformation']);
    	}
    	var sum = 0;
    	for (var i = 0; i < plans['@counter']; i++) {
    		sum = sum + parseInt(illustrationUIService.findElementInElement_V3(plans['illustration:PlanInformation'][i], ['Insureds'])['@counter']);
    	}
    	$scope.sumInsured = sum;
    }
    
    //for Group travel - upload excel file
    $scope.attachInsuredGroupTravel = function attachmentFiles(files){
    	var self = this;
    	var j = 0;
    	
    	for(var i = 0; i< files.length; i++){
    		loadingBarService.showLoadingBar();
    		self.multiUploadService.uploadFile($scope.portletId, files[i]).then(function uploaded(data){
    			loadingBarService.hideLoadingBar();
    			if(illustrationUIService.isSuccess(data)){
    				$scope.getParentCtrlInCharge().resourceFile = data;
    				illustrationUIService.findElementInElement_V3($scope.getParentCtrlInCharge().resourceFile,['ResourceFile'])['@refResourceUid'] = illustrationUIService.findElementInElement_V3($scope.getParentCtrlInCharge().resourceFile,['DocId']);
    				$scope.getParentCtrlInCharge().isNewFile = true;
    				
    				// Enable save button after attached file
    				var uiStructureRoot = $scope.getAssociateUiStructureRoot();
    				uiStructureRoot.isDetailChanged = true;
    				
//					if(!$.isArray(illustrationUIService.findElementInElement_V3(illustrationUIService.detail, ['Attachment']))){
//						illustrationUIService.convertObjectToArray(illustrationUIService.detail,['Attachments','Attachment']);
//					}
//					var sampleData = angular.copy(illustrationUIService.findElementInElement_V3(illustrationUIService.detail, ['Attachment'])[0]);
//					sampleData.FileUid.$ = illustrationUIService.findElementInElement_V3(data[0], ['FileUid']).$;
//					sampleData.Name.$ = illustrationUIService.findElementInElement_V3(data[0], ['Name']).$;
//					sampleData.FileName.$ = illustrationUIService.findElementInElement_V3(data[0], ['FileName']).$;
//					sampleData.CreateDate.$ = illustrationUIService.findElementInElement_V3(data[0], ['DateTime']).$;
//					sampleData.FileSize.$ = illustrationUIService.findElementInElement_V3(data[0], ['FileSize']).$;
//					sampleData['@refResourceUid'] = illustrationUIService.findElementInElement_V3(data[0], ['DocId']);
//					sampleData['@refResourceDocType'] = illustrationUIService.findElementInElement_V3(data[0], ['DocType']);
//					if(illustrationUIService.findElementInElement_V3(illustrationUIService.detail, ['Attachments'])['@counter'] > 0){
//						illustrationUIService.findElementInElement_V3(illustrationUIService.detail, ['Attachment']).push(sampleData);
//					}else{
//						illustrationUIService.findElementInElement_V3(illustrationUIService.detail, ['Attachment'])[0] = sampleData;
//					}
//					illustrationUIService.findElementInElement_V3(illustrationUIService.detail, ['Attachments'])['@counter']=illustrationUIService.findElementInElement_V3(illustrationUIService.detail, ['Attachment']).length;
    				i--;
    				files.splice(i,1);
    				
    				if(files.length == 0){
    					commonUIService.showNotifyMessage("v3.common.message.Attachsuccessfully", "success");
    				}
    			}
    			else {
    				files[j].validate=$translate.instant("v3.common.message.Attachfail.Validate");
    				commonUIService.showNotifyMessage("v3.common.message.Attachfail", "fail");
    				j++;
    			}
    		});
    	}
    };
    
    //for Group travel - import Insured 
    $scope.updateAttachmentInIllus = function (resourceFile) {
		if(!$.isArray(illustrationUIService.findElementInElement_V3(illustrationUIService.detail, ['Attachment']))){
		illustrationUIService.convertObjectToArray(illustrationUIService.detail,['Attachments','Attachment']);
		}
		var sampleData = angular.copy(illustrationUIService.findElementInElement_V3(illustrationUIService.detail, ['Attachment'])[0]);
		sampleData.FileUid.$ = illustrationUIService.findElementInElement_V3(resourceFile[0], ['FileUid']).$;
		sampleData.Name.$ = illustrationUIService.findElementInElement_V3(resourceFile[0], ['Name']).$;
		sampleData.FileName.$ = illustrationUIService.findElementInElement_V3(resourceFile[0], ['FileName']).$;
		sampleData.CreateDate.$ = illustrationUIService.findElementInElement_V3(resourceFile[0], ['DateTime']).$;
		sampleData.FileSize.$ = illustrationUIService.findElementInElement_V3(resourceFile[0], ['FileSize']).$;
		sampleData['@refResourceUid'] = illustrationUIService.findElementInElement_V3(resourceFile[0], ['DocId']);
		sampleData['@refResourceDocType'] = illustrationUIService.findElementInElement_V3(resourceFile[0], ['DocType']);
//		if(illustrationUIService.findElementInElement_V3(illustrationUIService.detail, ['Attachments'])['@counter'] > 0){
//			illustrationUIService.findElementInElement_V3(illustrationUIService.detail, ['Attachment']).push(sampleData);
//		}else{
			illustrationUIService.findElementInElement_V3(illustrationUIService.detail, ['Attachment'])[0] = sampleData;
//		}
		illustrationUIService.findElementInElement_V3(illustrationUIService.detail, ['Attachments'])['@counter']=illustrationUIService.findElementInElement_V3(illustrationUIService.detail, ['Attachment']).length;
    }
    
    //for Group travel - update Insured from excel file
    $scope.updateIllusGroupTravel = function (isComputeAction) {
    	var deferred = illustrationUIService.$q.defer();
    	//update Beneficiary when Plan = Family
    	function updateBeneficiaryForPlanFamily() {
    		var plan = illustrationUIService.findElementInDetail_V3(['PlanInformation']);
        	if (!$.isArray(plan)) {
        		plan = illustrationUIService.convertToArray(plan);
        	}
        	for (var i = 0; i < plan.length; i++) {
        		var planCd = illustrationUIService.findElementInElement_V3(plan[i],['PlanCd']).Value;
        		if ($scope.isTravelFamilyPlan(planCd) &&  //PlanName = Family AND add more then one insured
        			illustrationUIService.findElementInElement_V3(plan[i],['Insureds'])['@counter'] > '1') {
        			var length = illustrationUIService.findElementInElement_V3(plan[i],['Insureds'])['@counter'];
        			var insureds = illustrationUIService.findElementInElement_V3(plan[i],['Insureds']);
        			var mainInsured = illustrationUIService.findElementInElement_V3(insureds,['Insured'])[0];
    				for (var j = 1; j < length; j++) {
    					var insuredj = illustrationUIService.findElementInElement_V3(insureds,['Insured'])[j];
    					illustrationUIService.findElementInElement_V3(insuredj,['NameOfBeneficiary']).$ = illustrationUIService.findElementInElement_V3(mainInsured,['NameOfBeneficiary']).$;
    					illustrationUIService.findElementInElement_V3(insuredj,['RelationshipWithMainInsured']).Value = illustrationUIService.findElementInElement_V3(mainInsured,['RelationshipWithMainInsured']).Value;
    					illustrationUIService.findElementInElement_V3(insuredj,['ContactNumberOfBeneficiary']).$ = illustrationUIService.findElementInElement_V3(mainInsured,['ContactNumberOfBeneficiary']).$;
    					illustrationUIService.findElementInElement_V3(insuredj,['EmergencySameBeneficiary']).Value = illustrationUIService.findElementInElement_V3(mainInsured,['EmergencySameBeneficiary']).Value;
    					illustrationUIService.findElementInElement_V3(insuredj,['EmergencyContactName']).$ = illustrationUIService.findElementInElement_V3(mainInsured,['EmergencyContactName']).$;
    					illustrationUIService.findElementInElement_V3(insuredj,['EmergencyContactNumber']).$ = illustrationUIService.findElementInElement_V3(mainInsured,['EmergencyContactNumber']).$;
    				}
        		}
        	}
    	}
    	if (illustrationUIService.productName == commonService.CONSTANTS.PRODUCT.GROUP_TRAVEL_EXPRESS) {
    		if (!isComputeAction) {
    			if ($scope.getParentCtrlInCharge().isNewFile == true) { //upload file
    				if (illustrationUIService.findElementInElement_V3(illustrationUIService.detail,['PlanCd']).Value != '') { 
	    				var confirm = $mdDialog.confirm()
	    				.title($filter('translate')("v3.mynewworkspace.message.ClearInsured"))
	    				.ok($filter('translate')("v3.yesno.enum.Y"))
	    				.cancel($filter('translate')("v3.yesno.enum.N"));
	    				$mdDialog.show(confirm).then(function(){
	    					// call end-point import insured to json	
	    					var attachments = illustrationUIService.convertToArray(illustrationUIService.findElementInElement_V3(illustrationUIService.detail,['Attachment']));
	    					var counter = illustrationUIService.findElementInElement_V3(illustrationUIService.detail,['Attachments'])['@counter'];
	    					if (counter == 0 || counter == undefined) {//1st upload file 
	    						$scope.updateAttachmentInIllus($scope.getParentCtrlInCharge().resourceFile);
	    						attachments = illustrationUIService.convertToArray(illustrationUIService.findElementInElement_V3(illustrationUIService.detail,['Attachment']));
	    						counter = illustrationUIService.findElementInElement_V3(illustrationUIService.detail,['Attachments'])['@counter'];
	    					}
	    					var resourceUid = attachments[counter-1]['@refResourceUid'];
	    					var resourceId = illustrationUIService.findElementInElement_V3($scope.getParentCtrlInCharge().resourceFile[0], ['DocId']); //docId of resource-file
	    					if(resourceUid != resourceId) { 
	    						$scope.updateAttachmentInIllus($scope.getParentCtrlInCharge().resourceFile); 
	    						attachments = illustrationUIService.convertToArray(illustrationUIService.findElementInElement_V3(illustrationUIService.detail,['Attachment']));
		    					counter = illustrationUIService.findElementInElement_V3(illustrationUIService.detail,['Attachments'])['@counter'];
		    					resourceUid = attachments[counter-1]['@refResourceUid'];
	    					}
	    					illustrationUIService.removeErrorMessageNodeInElement(illustrationUIService.detail);
	    					illustrationUIService.updateDocFromFile($scope.resourceURL,resourceUid).then(function(data){					
	    						if (illustrationUIService.isSuccess(data)) {
	    							illustrationUIService.detail = data;
	    							$scope.reSetupConcreteUiStructure(illustrationUIService.detail);
	    							$scope.getParentCtrlInCharge().isNewFile = false;
	    							$scope.getParentCtrlInCharge().resourceFile = undefined;
	    							deferred.resolve(data);
	    						} else {	
	    							commonUIService.showNotifyMessage("v3.mynewworkspace.group-travel-express.illustration.label.UpdateInsuredUnsuccessfully");
	    							$scope.getParentCtrlInCharge().isNewFile = false;
	    							// need sync isDetailChanged for whole uiStructure
	    							$scope.reSetupConcreteUiStructure(illustrationUIService.detail);
	    							deferred.resolve(false);
	    						}
	    					});	
	    				}, function() {
	    					updateBeneficiaryForPlanFamily();
	    					$scope.getParentCtrlInCharge().isNewFile = true;
	    					deferred.resolve(true);
	    				});
    				} else {//haven't input insured yet
		    			$scope.updateAttachmentInIllus($scope.getParentCtrlInCharge().resourceFile);//update note attachment in illustration
		    			var counter = illustrationUIService.findElementInElement_V3(illustrationUIService.detail,['Attachments'])['@counter'];
		    			if (counter != undefined && counter != 0) { 
			    			var attachments = illustrationUIService.convertToArray(illustrationUIService.findElementInElement_V3(illustrationUIService.detail,['Attachment']));
							var resourceUid = attachments[counter-1]['@refResourceUid'];
							illustrationUIService.removeErrorMessageNodeInElement(illustrationUIService.detail);
							illustrationUIService.updateDocFromFile($scope.resourceURL,resourceUid).then(function(data){
								if (illustrationUIService.isSuccess(data)) {
									illustrationUIService.detail = data;
									$scope.reSetupConcreteUiStructure(illustrationUIService.detail);
									$scope.getParentCtrlInCharge().isNewFile = false;
									$scope.getParentCtrlInCharge().resourceFile = undefined;
									deferred.resolve(data);
								} else {
									commonUIService.showNotifyMessage("v3.mynewworkspace.group-travel-express.illustration.label.UpdateInsuredUnsuccessfully");
									$scope.getParentCtrlInCharge().isNewFile = false;
									// need sync isDetailChanged for whole uiStructure
	    							$scope.reSetupConcreteUiStructure(illustrationUIService.detail);
									deferred.resolve(false);
								}
							});
		    			}
    				}
    			} else {
    				updateBeneficiaryForPlanFamily();
    				$scope.getParentCtrlInCharge().isNewFile = false;
    				deferred.resolve(true);
    			}
    		} else {
				updateBeneficiaryForPlanFamily();
				$scope.getParentCtrlInCharge().isNewFile = false;
				deferred.resolve(true);
			}
		} else {
			deferred.resolve(true);
		}
    	return deferred.promise;
    };
//End-Group travel
    
	//For MNC Link, Endowment
//    $scope.addRiderCard = function(element, card){
//        $scope.addCard(card, function addedChildEle(addedEle) {
//        	$scope.clearAllRiderOptions('RiderType');
//        	$scope.clearAllRiderOptions('RiderPlan');
//        	$scope.computeTag(element, undefined, true);
//        });
//    };
    
	//For MNC Link, Endowment
//    $scope.removeRiderCard = function(element, card){
//    	$scope.removeCardInList(undefined, function() {
//    		$scope.clearAllRiderOptions('RiderType');
//        	$scope.clearAllRiderOptions('RiderPlan');
//    		$scope.computeTag(element, card, true);
//    	}, card);
//    };
    
    //For MNC Link, Endowment
//    $scope.clearAllRiderOptions = function(riderNodeName){
//    	var riders = illustrationUIService.findElementInDetail_V3(['Rider']);
//    	if (riders != undefined) {
//    		riders = illustrationUIService.convertToArray(riders);
//    		angular.forEach(riders, function(rider){
//    			illustrationUIService.findElementInElement_V3(rider, [riderNodeName, 'Options']).Option = "";
//    		});
//    	}
//    };    
    
    $scope.addInsuredCard = function(card){
        $scope.addCard(card, function addedChildEle(addedEle) {
        	var insureds = illustrationUIService.findElementInElement_V3(addedEle, ['Insureds']);
        	insureds['@counter'] = 0;
        	insureds['illustration:Insured'] = illustrationUIService.convertToArray(insureds['illustration:Insured']);
        	insureds['illustration:Insured'] = insureds['illustration:Insured'].slice(0, 1);
        	illustrationUIService.clearErrorInElement(addedEle);
            $scope.reSetupConcreteUiStructure(illustrationUIService.detail); // refresh the values in multiple cards
        });
    };
    
	//UI MNC Link 
	//Update Fund List to avoid duplicate Fund Name
	$scope.checkDuplicate = function(list,key,index){
		for (var i=0; i<list.length;i++){
			if (commonService.hasValueNotEmpty(illustrationUIService.findElementInElement_V3(list[index],[key]).Value)){
				if ((illustrationUIService.findElementInElement_V3(list[i],[key]).Value== illustrationUIService.findElementInElement_V3(list[index],[key]).Value)
						&& (i !== index)){
					commonUIService.showNotifyMessage("Duplicate Value", "fail");
					illustrationUIService.findElementInElement_V3(list[index],[key]).Value = "";
				}
			}
			else if ((illustrationUIService.findElementInElement_V3(list[i],[key]).$== illustrationUIService.findElementInElement_V3(list[index],[key]).$)
					&& (i !== index)){
				commonUIService.showNotifyMessage("Duplicate Value", "fail");
				illustrationUIService.findElementInElement_V3(list[index],[key]).$ = "";
			}
		}
	}
	
	$scope.filterOcupationPO = function (){
    	illustrationUIService.occupationListPO = $filter('filterByGroup')(illustrationUIService.findElementInElement_V3(illustrationUIService.lazyChoiceList[illustrationUIService.productName],['POOccupation','Option']), illustrationUIService.findElementInDetail_V3(['PolicyOwnerInformation', 'BusinessIndustry']).Value);
	}
	 
	 $scope.filterOcupationLA = function (){
    	illustrationUIService.occupationListLA = $filter('filterByGroup')(illustrationUIService.findElementInElement_V3(illustrationUIService.lazyChoiceList[illustrationUIService.productName],['LIOccupation','Option']), illustrationUIService.findElementInDetail_V3(['LifeInsuredInformation',  'BusinessIndustry']).Value);
	}
	
	//UI Upload Tile - Group Travel Express
	$scope.removeAttachFileGroupTravel = function(index){
		$scope.getParentCtrlInCharge().resourceFile = [];
	}
	
	$scope.applyUploadedFileGroupTravel = function(){
		$scope.updateIllusGroupTravel().then(function(data){
			if (illustrationUIService.isSuccess(data)){
				//Enable Save Button after Apply New Uploaded File
				var uiStructureRoot = $scope.getAssociateUiStructureRoot();
				uiStructureRoot.isDetailChanged = true;
				commonUIService.showNotifyMessage("v3.myworkspace.message.ApplyUploadedFileIntoQuotationSuccessfully", "success");
			} else {
				commonUIService.showNotifyMessage("v3.myworkspace.message.ApplyUploadedFileIntoQuotationUnsuccessfully");
			}
		})
	}
	
	//date PO and LA name for business case RUL
	$scope.updatePOandLAName_RUL = function updatePOandLAName_RUL (){
		
		if (illustrationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.UNIT_LINK
				|| illustrationUIService.productName == commonService.CONSTANTS.PRODUCT.REGULAR_UNIT_LINK
				|| illustrationUIService.productName == commonService.CONSTANTS.PRODUCT.ENDOWMENT){
			var quotation = $scope.getRightDetailInMultipleEleFromParentDoc();
			var poName = $scope.salecaseService.findElementInElement_V3(quotation, ['POName']);
			var liName = $scope.salecaseService.findElementInElement_V3(quotation, ['LIName']);
			if (poName && liName){
				poName.$ = illustrationUIService.findElementInDetail_V3(['PolicyOwner', 'FullName']).$;
				liName.$ = illustrationUIService.findElementInDetail_V3(['LifeInsured', 'FullName']).$;
			}	
		}
	}
	
	$scope.savePOandLAName_RUL = function savePOandLAName_RUL (){
		var deferred = illustrationUIService.$q.defer();
		if(illustrationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.UNIT_LINK
				|| illustrationUIService.productName == commonService.CONSTANTS.PRODUCT.REGULAR_UNIT_LINK
				|| illustrationUIService.productName == commonService.CONSTANTS.PRODUCT.ENDOWMENT){
			$scope.updatePOandLAName_RUL();
		   	salecaseUIService.saveDetail_V3($scope.resourceURL, false).then(function(){
		   		deferred.resolve();
		   	});
		}else{
			deferred.resolve();
		}
		return deferred.promise;
	}

	/**
	 * hle56
	 * convert information Policy Holder to Default Insured
	 * use for Illustration PA product
	 */
	$scope.convertPolicyOwnerToDefaultInsured = function(){
		var policyHolder = illustrationUIService.findElementInDetail_V3(['PolicyOwnerInformation']);
		var defaultInsured = illustrationUIService.findElementInDetail_V3(['Insured'])[0];
		if($scope.moduleService.choseDefaultInsured){
			illustrationUIService.findElementInElement_V3(defaultInsured,['FullName']).$ = illustrationUIService.findElementInElement_V3(policyHolder,['FullName']).$;
			illustrationUIService.findElementInElement_V3(defaultInsured,['Gender']).Value = illustrationUIService.findElementInElement_V3(policyHolder,['Gender']).Value;
			illustrationUIService.findElementInElement_V3(defaultInsured,['BirthDate']).$ = illustrationUIService.findElementInElement_V3(policyHolder,['BirthDate']).$;
			if (illustrationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.DIRECT_PA) {
				illustrationUIService.findElementInElement_V3(defaultInsured,['Relationship']).Value = "RELAT-07";
			}
			illustrationUIService.removeErrorMessageNodeInElement(illustrationUIService.findElementInElement_V3(defaultInsured,['FullName']));
			illustrationUIService.removeErrorMessageNodeInElement(illustrationUIService.findElementInElement_V3(defaultInsured,['Gender']));
			illustrationUIService.removeErrorMessageNodeInElement(illustrationUIService.findElementInElement_V3(defaultInsured,['BirthDate']));
			if (illustrationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.DIRECT_PA) {
				illustrationUIService.removeErrorMessageNodeInElement(illustrationUIService.findElementInElement_V3(defaultInsured,['Relationship']));
			}			
			illustrationUIService.findElementInElement_V3(policyHolder,['IDNumber']).$ = illustrationUIService.findElementInElement_V3(defaultInsured,['IDNumber']).$;
            illustrationUIService.findElementInDetail_V3(['SameAsPO']).Value = "Y";
			$scope.checkInsuredHasError();
		}else{
			illustrationUIService.findElementInElement_V3(policyHolder,['IDNumber']).$ = '';
            illustrationUIService.findElementInDetail_V3(['SameAsPO']).Value = "N";
		}
	}
	/**
	 * hle56
	 * convert information Default Insured to Policy Owner
	 * use for Illustration PA product
	 */
	$scope.convertDefaultInsuredToPolicyOwner = function(){
		var policyOwner = illustrationUIService.findElementInDetail_V3(['PolicyOwnerInformation']);
		var defaultInsured = illustrationUIService.findElementInDetail_V3(['Insured'])[0];
		if($scope.moduleService.choseDefaultInsured){
			illustrationUIService.findElementInElement_V3(policyOwner,['IDNumber']).$ = illustrationUIService.findElementInElement_V3(defaultInsured,['IDNumber']).$;
            illustrationUIService.findElementInDetail_V3(['SameAsPO']).Value = "Y";
		}else{
			illustrationUIService.findElementInElement_V3(policyOwner,['IDNumber']).$ = '';
            illustrationUIService.findElementInDetail_V3(['SameAsPO']).Value = "N";
		}
	}		
	/*
     * Get a child element of current insured (in Insureds array)  
     * author: pdoan3 - for MNC direct travel
     */
	$scope.getElementOfSelectedInsured = function(elementName){
		var selectedInsured = illustrationUIService.findElementInDetail_V3(['Insureds','Insured'])[illustrationUIService.InsuredSelectedIndex];
		//return selectedInsured['person:PersonName']['person:' + elementName];
		return illustrationUIService.findElementInElement_V3(selectedInsured, elementName);		
	}
	/*
     * Get a child element of specified element in an array  
     * author: pdoan3 - for MNC direct travel
     */
	$scope.getElementOfSelectedElement = function(elementChainOps, selectedIndex, elementOps){
		var selectedInsured = illustrationUIService.findElementInDetail_V3(elementChainOps)[selectedIndex];
		//return selectedInsured['person:PersonName']['person:' + elementName];
		return illustrationUIService.findElementInElement_V3(selectedInsured, elementOps);		
	}
	
    
    /*
     * Change refered's value component if origin's value change 
     * author: pdoan3
     */
    $scope.isSameBenificiaryTravelDS = function(beneficiary){
    	var beneficiary = illustrationUIService.findElementInDetail_V3(['Beneficiary']);
		if (illustrationUIService.findElementInElement_V3(beneficiary, ['SameAsBeneficiary']).Value == 'Y') {
			illustrationUIService.isSameAsBeneficiary = true;
		} else {
			illustrationUIService.isSameAsBeneficiary = false;
		}
    	if (illustrationUIService.isSameAsBeneficiary == true) {
    		
    		illustrationUIService.findElementInElement_V3(beneficiary,['EmergencyContact','Name']).$ = beneficiary['illustration:NameOfBeneficiary'].$;
    		
    		illustrationUIService.findElementInElement_V3(beneficiary,['EmergencyContact','EmergencyContactNo']).$ = beneficiary['illustration:ContactNo'].$;
    	}
    }
    /*
     * Change refered's value component if origin's value change 
     * author: pdoan3 - for MNC direct travel
     */
    $scope.checkReferenceValueChange = function(origin, refered, needChange){
		illustrationUIService.quoteState = "CHANGED";
    	if (needChange == undefined) {
			return;
		}
    	if (needChange == true) {
			if (origin.Value != undefined) {
				refered.Value = origin.Value;
			} else if (origin.refDetail != undefined){
				refered.refDetail = origin.refDetail;
			} else {
				refered.$ = origin.$;
			}
			//hle56
			illustrationUIService.removeErrorMessageNodeInElement(refered);
			$scope.checkInsuredHasError();
			$scope.markValidCard($scope.getAssociateUiStructureRoot());
		}    	
    }
    /**
     * hle56
     * check Insured has errorMessase or no.
     * if yes, that insured will have new errorMessage property
     */
    $scope.checkInsuredHasError = function(){
    	var insureds = illustrationUIService.findElementInDetail_V3(['Insureds','Insured']);
    	insureds.forEach(function(insured, index){
    		delete insured.errorMessage;
    	});
    	
    	insureds.forEach(function(insured, index){
    		var errorMessage = illustrationUIService.findElementInElement_V3(insured,['errorMessage']);
    		if(errorMessage != undefined && errorMessage != ''){
    			insured.errorMessage = "error";
	    	}
    	});
	    	
    }
    /**
     * hle56
     * use for Direct PA
     * Add 1 insured and remove all error message if necessary.
     */
	$scope.addInsuredDS = function(){
		illustrationUIService.addElementInElement_V3(illustrationUIService.detail, ['Insureds'], ['Insured'])
		var insureds =  illustrationUIService.findElementInDetail_V3(['Insureds','Insured']);
		illustrationUIService.removeErrorMessageNodeInElement(insureds[insureds.length-1]);
	}
	/**
     * hle56
     * use for Direct PA
     * select Insured.
     */
	$scope.selectInsured = function(index){
		if(illustrationUIService.InsuredSelectedIndex != index ){
			illustrationUIService.InsuredSelectedIndex = -1;
			var timeout = angular.injector(['ng']).get('$timeout');
			timeout(function(){
				$scope.$apply(function(){
					illustrationUIService.InsuredSelectedIndex = index;
				});
			},10);
		}else{
			illustrationUIService.InsuredSelectedIndex = -1;
		}
	}
    //for Direct Sale - GCS
    //LifeInsured is the same Policy Holder
    var createDefaultlifeInsured = function() {   	
    		illustrationUIService.findElementInDetail_V3(['LifeInsuredInformation','FullName']).$ = illustrationUIService.findElementInDetail_V3(['PolicyOwnerInformation','FullName']).$;
    		illustrationUIService.findElementInDetail_V3(['LifeInsuredInformation','Gender']).Value = illustrationUIService.findElementInDetail_V3(['PolicyOwnerInformation','Gender']).Value;
    		illustrationUIService.findElementInDetail_V3(['LifeInsuredInformation','BirthDate']).$ = illustrationUIService.findElementInDetail_V3(['PolicyOwnerInformation','BirthDate']).$;
    		illustrationUIService.findElementInDetail_V3(['LifeInsuredInformation','SmokerStatus']).Value = illustrationUIService.findElementInDetail_V3(['PolicyOwnerInformation','SmokerStatus']).Value;
    		illustrationUIService.findElementInDetail_V3(['LifeInsuredInformation','EmailAddress']).$ = illustrationUIService.findElementInDetail_V3(['PolicyOwnerInformation','EmailAddress']).$;
    		illustrationUIService.findElementInDetail_V3(['LifeInsuredInformation','MobilePhone']).$ = illustrationUIService.findElementInDetail_V3(['PolicyOwnerInformation','MobilePhone']).$;
    }
    //get POAgeNextBirthdate to show UI
    $scope.getPOAgeNextBirthdate = function() {
    	var age = illustrationUIService.findElementInDetail_V3(['PolicyOwnerInformation','POAgeNextBirthday']).$;
    	return age;
    }
    
    $scope.refreshCityCode = function(provinceCd, cityCdChoiceKey,Province){
    	illustrationUIService.findElementInDetail_V3(['BuildingInformations','City']).Value='';
    	illustrationUIService.findElementInDetail_V3(['BuildingInformations','EarthquakeZone']).$='';
    	$scope.CityCdList = $filter('filterByGroup')(illustrationUIService.findElementInElement_V3(illustrationUIService.lazyChoiceList, ['City', 'Option']), provinceCd);
    }
    
    $scope.computeTotalSI = function(){
    	var totalSumInsured = 0;
    	var sumInsuredBuilding = illustrationUIService.findElementInDetail_V3(['SumInsuredBuilding']).$;
    	var sumInsuredContent = illustrationUIService.findElementInDetail_V3(['SumInsuredContent']).$;
    	if(commonService.hasValueNotEmpty(sumInsuredBuilding)) {
    		totalSumInsured += parseInt(sumInsuredBuilding);
    	}
    	if(commonService.hasValueNotEmpty(sumInsuredContent)) {
    		totalSumInsured += parseInt(sumInsuredContent);
    	}
    	
    	illustrationUIService.findElementInDetail_V3(['SumInsuredTotal']).$ = totalSumInsured;
    }
    
    /**
     *  for MNC Travel, refresh region lazy list by type of travel
     *  @TODO need enhance to compute tag
     *  @param typeOfTravel: type of travel code: annual / single trip
     *  @param regionCdTitle: name of region node from document
     */
    $scope.refreshTravelRegionList = function(typeOfTravel, regionCdTitle){
    	if (typeOfTravel == "TTYPE-01") { //for single trip, accept all region
    		$scope.travelRegionList = illustrationUIService.findElementInElement_V3(illustrationUIService.lazyChoiceList, [regionCdTitle, 'Option']);
    	} else {
    		$scope.travelRegionList = $filter('filterByGroup')(illustrationUIService.findElementInElement_V3(illustrationUIService.lazyChoiceList, [regionCdTitle, 'Option']), typeOfTravel);
    	}
    }
    
    /**
     *  for MNC Travel, refresh plan lazy list by region
     *  @TODO need enhance to compute tag
     *  @param region: region code
     *  @param planCdTitle: name of plan node from document
     */
    $scope.refreshTravelPlanList = function(region, planCdTitle){
    	if (region == "WLREG-04") { //for worldwide region, accept all plans
    		$scope.travelPlanList = illustrationUIService.findElementInElement_V3(illustrationUIService.lazyChoiceList, [planCdTitle, 'Option']);
    	} else {
    		$scope.travelPlanList = $filter('filterByGroup')(illustrationUIService.findElementInElement_V3(illustrationUIService.lazyChoiceList, [planCdTitle, 'Option']), region);
    	}
    }
    
	/** option not remove other type card when resetup detail */
    function isNotRemoveTemplateChildren() {
    	var result = undefined;
		if (illustrationUIService.productName == commonService.CONSTANTS.PRODUCT.GROUP_TRAVEL_EXPRESS ||
			illustrationUIService.productName == commonService.CONSTANTS.PRODUCT.REGULAR_UNIT_LINK ||
			illustrationUIService.productName == commonService.CONSTANTS.PRODUCT.ENDOWMENT) {
			result = true;
		}
		return result;
    }
    /**
     *  for MNC Direct Total Care, refresh Area Code when Area changed
     */
    $scope.refreshAreaCode = function(area){
    	illustrationUIService.findElementInDetail_V3(['AreaCode']).$ = ($filter('filterByValue')(illustrationUIService.findElementInElement_V3(illustrationUIService.lazyChoiceList, ['Area', 'Option']), area))[0].group;
    }
    /**
     *  for MNC Direct Total Care, refresh Model List when Make changed
     */
    $scope.refreshModel = function(make){
    	$scope.modelList = $filter('filterByGroup')(illustrationUIService.findElementInElement_V3(illustrationUIService.lazyChoiceList, ['Model', 'Option']), make);
    	illustrationUIService.findElementInDetail_V3(['Model'])['Value'] = undefined;
    	illustrationUIService.findElementInDetail_V3(['VehicleCategory'])['Value'] = undefined;
    }
    /**
     *  for MNC Direct Total Care, refresh Category when Model changed
     */
    $scope.refreshCategory = function(card){    	
    	loadingBarService.showLoadingBar(); 
    	illustrationUIService.findElementInDetail_V3(['VehicleCategory'])['Value'] = "";
    	$scope.computeTag([['Make'],['Model'],['VehicleCategory']], card, true).then(function(){
    		var category = illustrationUIService.findElementInElement_V3(card.refDetail, ['VehicleCategory']);
    		category['Value'] = category['@default'];
    		loadingBarService.hideLoadingBar();	
        	$scope.markValidCard(card);
    	});
    }
    /**
     *  for MNC Direct Total Care, print pdf for specified plan
     */    
    $scope.printQuotationPdfForMNCMotor = function(){
    	var plan = illustrationUIService.findElementInDetail_V3(['PlanType']).Value;
    	if (plan === 'MVP01') {
    		$scope.printPdf('complete');
		} else if (plan === 'MVP02') {
			$scope.printPdf('standard');
		} else if (plan === 'MVP03') {
			$scope.printPdf('tlo');
		} 
    }
    
    /**
     *  for MNC Endowment
     */ 
    $scope.computeBeneficiaryAge = function(){
    	illustrationUIService.findElementInDetail_V3(['BasicPlan', 'PremiumTerm']).$ = "";
    	illustrationUIService.computeElementAndUpdateLazyList($scope.resourceURL, [['PolicyOwnerInformation', 'BeneficiaryAge'], ['PolicyOwnerInformation', 'BeneficiaryBirthdate'], ['BasicPlan']]).then(function(data){
			$scope.reSetupConcreteUiStructure(illustrationUIService.detail,$scope.getAssociateUiStructureRoot().isDetailChanged);
		});
    };
    
    $scope.refreshEndowmentPremium = function(){
    	var premiumFrequency = illustrationUIService.findElementInDetail_V3(['BasicPlan', 'PremiumFrequency']).Value;
    	var premiumTerm = illustrationUIService.findElementInDetail_V3(['BasicPlan', 'PremiumTerm']).$;
    	var basicSumInsured = illustrationUIService.findElementInDetail_V3(['BasicPlan', 'BasicSumInsured']).$;
    	
    	if(commonService.hasValueNotEmpty(premiumFrequency)
    			&& commonService.hasValueNotEmpty(premiumTerm)
    			&& commonService.hasValueNotEmpty(basicSumInsured)) {
    		illustrationUIService.computeElementAndUpdateLazyList($scope.resourceURL, [['BasicPlan'], ['PolicyOwner', 'BirthDate'], 
    		                                                                           ['BeneficiaryBirthdate'], ['LAIsTheSameWithPO']]);
    	}
    }
    
    /**
     *  For MNC Link, clear rider data when change rider type
     *  @param {UiStructure} card
     */ 
    $scope.clearRiderDataOnChangingType_RUL = function(card) {
    	illustrationUIService.findElementInElement_V3(card.refDetail, ['RiderPlan']).Value = "";
    	illustrationUIService.findElementInElement_V3(card.refDetail, ['RiderTerm']).$ = "";
		illustrationUIService.findElementInElement_V3(card.refDetail, ['RiderPremiumTerm']).$ = "";
		illustrationUIService.findElementInElement_V3(card.refDetail, ['RiderSumInsured']).$  = "";
		illustrationUIService.findElementInElement_V3(card.refDetail, ['RiderPremium']).$ = "";
//		$scope.clearAllRiderOptions('RiderType');
//		$scope.clearAllRiderOptions('RiderPlan');
    }
    
    /**
     *  For MNC Link, clear rider data when change rider plan
     *  @param {UiStructure} card
     */ 
    $scope.clearRiderDataOnChangingPlan_RUL = function(card) {
    	illustrationUIService.findElementInElement_V3(card.refDetail, ['RiderTerm']).$ = "";
		illustrationUIService.findElementInElement_V3(card.refDetail, ['RiderPremiumTerm']).$ = "";
		illustrationUIService.findElementInElement_V3(card.refDetail, ['RiderSumInsured']).$  = "";
		illustrationUIService.findElementInElement_V3(card.refDetail, ['RiderPremium']).$ = "";
//		$scope.clearAllRiderOptions('RiderType');
//    	$scope.clearAllRiderOptions('RiderPlan');
    }
    
    /**
     *  For MNC Endowment, clear rider data when change rider type
     *  @param {UiStructure} card
     */ 
    $scope.clearRiderDataOnChangingType_Endowment = function(card) {
    	illustrationUIService.findElementInElement_V3(card.refDetail, ['RiderPlan']).Value = "";
		illustrationUIService.findElementInElement_V3(card.refDetail, ['RiderSumInsured']).$  = "";
		illustrationUIService.findElementInElement_V3(card.refDetail, ['RiderPremium']).$ = "";
//		$scope.clearAllRiderOptions('RiderType');
//		$scope.clearAllRiderOptions('RiderPlan');
    }
    
    /**
     *  For MNC Endowment, clear rider data when change rider plan
     *  @param {UiStructure} card
     */ 
    $scope.clearRiderDataOnChangingPlan_Endowment = function(card) {
		illustrationUIService.findElementInElement_V3(card.refDetail, ['RiderSumInsured']).$  = "";
		illustrationUIService.findElementInElement_V3(card.refDetail, ['RiderPremium']).$ = "";
//		$scope.clearAllRiderOptions('RiderType');
//    	$scope.clearAllRiderOptions('RiderPlan');
    }
    
    /**
     *  For MNC Link, Endowment, compute to get rider type option list
     *  @param {Array} ignoreList List of node need to remove when extract data set
     */ 
    $scope.computeRiderTypeOption = function(ignoreList) {
    	var functionName = 'P_FilterRiderType';
    	illustrationUIService.computeByFunction($scope.resourceURL, functionName, ignoreList).then(function(data) {
    		var options = [];
    		if (data != undefined && data['0'] != undefined) {
    			angular.forEach(data['0'], function(option) {
    				this.push({value: option});
    			}, options);
    		}
    		illustrationUIService.lazyChoiceList[illustrationUIService.productName]['LazyRestriction']['RiderType'] = {Option: options};
    	})
    };
    
    /**
     *  For MNC Link, Endowment, compute to get rider plan option list
     *  @param {Array} ignoreList List of node need to remove when extract data set
     */ 
    $scope.computeRiderPlanOption = function(ignoreList) {
    	var functionName = 'P_FilterRiderPlan';
    	illustrationUIService.computeByFunction($scope.resourceURL, 'P_FilterRiderPlan', ignoreList).then(function(data) {
    		var riders = illustrationUIService.convertToArray(illustrationUIService.findElementInDetail_V3(['Rider']));
    		angular.forEach(riders, function(rider, key) {
    			var options = [];
        		if (this.data != undefined && this.data[key] != undefined) {
        			angular.forEach(this.data[key], function(option) {
        				this.push({value: option});
        			}, options);
        		}
        		this.uiService.findElementInElement_V3(rider, ['RiderPlan', 'Options']).Option = options;
    		}, {data: data, uiService: illustrationUIService});
    	})
    };
    
    /**
     *  For MNC Link, Endowment, compute rider when change plan
     *  @param {Array} element List of tags need compute
     *  @param {UiStructure} card
     *  @param {Array} ignoreList List of node need to remove when extract data set
     */ 
    $scope.computeRiderOnChangePlan = function(element, card, ignoreList) {
    	$scope.computeTag(element, card, true).then(function() {
    		$scope.computeRiderTypeOption(ignoreList);
    		$scope.computeRiderPlanOption(ignoreList);
    	});
    };
    
    /**
     *  For MNC Link, Endowment, compute rider when open riders card (parent)
     *  @param {Array} element List of tags need compute
     *  @param {UiStructure} card
     *  @param {Array} ignoreList List of node need to remove when extract data set
     */ 
    $scope.computeRiderOnOpenCard = function(element, card, ignoreList) {
    	//stop compute when accepted
		if ($scope.moduleService.findElementInDetail_V3(['BusinessStatus']) != commonService.CONSTANTS.STATUS.ACCEPTED){
			var ridersCount = card.refDetail != undefined ? card.refDetail['@counter'] : 0;
			if (ridersCount > 0) {
				$scope.computeRiderTypeOption(ignoreList);
				$scope.computeRiderPlanOption(ignoreList);
			} else {
				$scope.computeTag(element, card, true);
			}
		}
    };
    
    /**
     *  For MNC Link, Endowment, compute rider when remove rider card (child)
     *  @param {Array} element List of tags need compute
     *  @param {UiStructure} card
     *  @param {Array} ignoreList List of node need to remove when extract data set
     */ 
    $scope.computeRiderOnRemoveCard = function(element, card, ignoreList) {
    	$scope.removeCardInList(undefined, function() {
    	    var ridersCount = 0;
    	    if (card != undefined && card.parent != undefined && card.parent.refDetail != undefined) {
    	        ridersCount = card.parent.refDetail['@counter'];
    	    }
    	    if (ridersCount > 0) {
            	$scope.computeRiderTypeOption(ignoreList);
            	$scope.computeRiderPlanOption(ignoreList);
            } else {
            	$scope.computeTag(element, undefined, true);
            }
    	}, card);
    };
    
    /**
     *  For MNC Link, Endowment, list of node need to remove when extract data set
     */ 
    $scope.computeRiderIgnoreList = [
    	"illustration:Header",
    	"illustration:Product",
    	"illustration:DocumentRelation",
    	"illustration:BenefitIllustration",
    	"illustration:Attachments",
    	"unit-link:SingleTopUps",
    	"unit-link:Funds",
    	"unit-link:Withdrawals"
    ];
    
    /**
     *  For MNC Endowment, hide number of unit when add new rider
     *  @param {Object} added element
     */ 
    $scope.hideNumberOfUnit = function(addedEle) {
    	illustrationUIService.findElementInElement_V3(addedEle, ['NumberOfUnits'])['@visible']  = '0';
    };
}]
