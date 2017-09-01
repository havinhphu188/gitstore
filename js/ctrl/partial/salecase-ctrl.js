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
var CaseManagementDetailCtrl = ['$rootScope', '$scope', '$filter', '$log', '$state', 'ajax', '$mdDialog', 'commonService', 'commonUIService', 'salecaseUIService','userCoreService', 'illustrationUIService', 'applicationUIService', 'uiRenderPrototypeService', 'paymentUIService', 'printPdfService', 'underwritingUIService', 'ecovernoteUIService', '$http', 'urlService', 'groupDepartmentUIService', 'managerReviewUIService', 'prospectUIService', '$translate', 'factfindUIService', 'prospectPersonalUIService', 'loadingBarService', '$translatePartialLoader', 'mobileAppCoreModule',
	function($rootScope, $scope, $filter, $log, $state, ajax, $mdDialog, commonService, commonUIService, salecaseUIService,userCoreService, illustrationUIService, applicationUIService, uiRenderPrototypeService, paymentUIService, printPdfService, underwritingUIService, ecovernoteUIService, $http, urlService, groupDepartmentUIService, managerReviewUIService, prospectUIService, $translate, factfindUIService, prospectPersonalUIService, loadingBarService, $translatePartialLoader, mobileAppCoreModule) {
	
	illustrationUIService.detail = undefined;
	illustrationUIService.originalDetail = undefined;
	applicationUIService.detail = undefined;
	applicationUIService.originalDetail = undefined;
	factfindUIService.detail = undefined;
	factfindUIService.originalDetail = undefined;
	underwritingUIService.detail = undefined;
	underwritingUIService.originalDetail = undefined;
	managerReviewUIService.detail = undefined;
	managerReviewUIService.originalDetail = undefined;
	prospectPersonalUIService.detail = undefined;
	prospectPersonalUIService.originalDetail = undefined;
	
	$scope.commonUIService = commonUIService;
	$scope.illustrationService = illustrationUIService;
	$scope.applicationService = applicationUIService;
	$scope.commonUIService = commonUIService;
	$scope.moduleService = salecaseUIService;
	$scope.moduleService.freeze = false;
	$scope.printPdfService = printPdfService;
	$scope.factfindUIService = factfindUIService;
	
	//get active role to show/hide accept button by role
	$scope.activeRole = commonUIService.getActiveUserRole();
	
	// For group travel, attach insureds file
	$scope.isNewFile = false;
	
	//show UW Tile
	$scope.isShowUnderwriting = true;

	//submit case or not?
	$scope.alreadyPreSubmit = false;

	$scope.paymentMethod = [{"value": "CASH",},{"value": "CHEQUE",},{"value": "BANKTRANSFER",}];
	$scope.managerReviewOptions = [{"value": "Y",},{"value": "N",},{"value": "NA",}];
	
//    setTimeout(function(){ $scope.moveToCards(); }, 5000);
//	salecaseUIService.payment = {"IposDocument":{"@xmlns":"http://www.csc.com/integral/common","@xmlns:payment":"http://www.csc.com/integral/payment","@xmlns:person":"http://www.csc.com/integral/personal","@xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance","@xsi:schemaLocation":"http://www.csc.com/integral/payment payment-document.xsd ","Header":{"DocInfo":{"DocType":"payment","DefUid":"58b28a1e-4f62-4af2-99bf-9f041058f520","DocId":"2b663a5a-2e82-4d54-9368-fcd44014e321","DocName":"payment-DefaultName","DocVersion":"","OwnerUid":"agent1@ipos.com","CreatedDate":"2015-10-15 11-10-17","UpdatedDate":"2015-10-15 11-10-17","UpdatedUserUid":"","Tags":"","Star":"","Archived":"","Comments":""},"DocAccessControllList":{"User":{"@userid":"","Permisions":{"Permision":""}}},"DocStatus":{"DocumentStatus":"","BusinessStatus":"DRAFT"}},"Data":{"payment:Payment":{"@vpms-suffix":"Payment","payment:PaymentNo":{"@vpms-suffix":"PaymentNo"},"payment:PaymentStatus":{"@vpms-suffix":"PaymentStatus","$":"PENDING"},"payment:PaymentMethod":{"@vpms-suffix":"PaymentMethod","Options":{"Option":""},"Value":""},"payment:AgentCode":{"@vpms-suffix":"AgentCode","$":"10000306"},"payment:CreatedDate":{"@vpms-suffix":"CreatedDate","$":"2015-10-15"},"payment:PaidDate":{"@vpms-suffix":"PaidDate"},"payment:ReceiptNumber":{"@vpms-suffix":"ReceiptNumber"},"payment:PolicyOwner":{"@vpms-suffix":"POPersonal","person:Photo":{"@vpms-suffix":"POPhoto"},"person:Title":{"@vpms-suffix":"POTitle","Options":{"Option":""},"Value":""},"person:PersonName":{"@vpms-suffix":"POPersonName","person:FirstName":{"@vpms-suffix":"POFirstName"},"person:MiddleName":{"@vpms-suffix":"POMiddleName"},"person:LastName":{"@vpms-suffix":"POLastName"},"person:AliasName":{"@vpms-suffix":"POAliasName"},"person:FullName":{"@vpms-suffix":"POFullName","$":"Iron Man"}},"person:BirthDate":{"@vpms-suffix":"POBirthDate"},"person:Gender":{"@vpms-suffix":"POGender","Options":{"Option":""},"Value":""},"person:MaritalStatus":{"@vpms-suffix":"POMaritalStatus","Options":{"Option":""},"Value":""},"person:SmokerStatus":{"@vpms-suffix":"POSmokerStatus","Options":{"Option":""},"Value":""},"person:BusinessIndustry":{"@vpms-suffix":"POBusinessIndustry","Options":{"Option":""},"Value":""},"person:Occupation":{"@vpms-suffix":"POOccupation","Options":{"Option":""},"Value":""},"person:ReferralType":{"@vpms-suffix":"POReferralType","Options":{"Option":""},"Value":""},"person:Referrer":{"@vpms-suffix":"POReferrer"},"person:Race":{"@vpms-suffix":"PORace","Options":{"Option":""},"Value":""},"person:Nationality":{"@vpms-suffix":"PONationality","Options":{"Option":""},"Value":""},"person:IDs":{"@vpms-suffix":"POIDs","person:ID":{"@vpms-suffix":"POID","person:IDType":{"@vpms-suffix":"POIDType","Options":{"Option":""},"Value":""},"person:IDNumber":{"@vpms-suffix":"POIDNumber"}}},"person:Staff":{"@vpms-suffix":"POStaff","Options":{"Option":""},"Value":""},"person:Vip":{"@vpms-suffix":"POVip","Options":{"Option":""},"Value":""},"person:Education":{"@vpms-suffix":"POEducation","Options":{"Option":""},"Value":""},"person:EmploymentStatus":{"@vpms-suffix":"POEmploymentStatus","Options":{"Option":""},"Value":""},"person:CountryOfBirth":{"@vpms-suffix":"POCountryOfBirth","Options":{"Option":""},"Value":""},"person:Age":{"@vpms-suffix":"POAge"},"person:Addresses":{"@vpms-suffix":"POAddresses","person:Address":{"@vpms-suffix":"POAddress","person:AddressType":{"@vpms-suffix":"POAddressType","Options":{"Option":""},"Value":""},"person:BlkHouseNo":{"@vpms-suffix":"POBlkHouseNo"},"person:Street":{"@vpms-suffix":"POStreet"},"person:UnitNo":{"@vpms-suffix":"POUnitNo"},"person:Building":{"@vpms-suffix":"POBuilding"},"person:City":{"@vpms-suffix":"POCity"},"person:Country":{"@vpms-suffix":"POCountry","Options":{"Option":""},"Value":""},"person:Postal":{"@vpms-suffix":"POPostal"},"person:PreferredAddress":{"@vpms-suffix":"POPreferredAddress","Options":{"Option":""},"Value":""}}},"person:Contacts":{"@vpms-suffix":"POContacts","person:Contact":[{"@vpms-suffix":"POContact","person:ContactType":{"@vpms-suffix":"POContactType","Options":{"Option":""},"Value":"MOBILE_TEL"},"person:ContactInformation":{"@vpms-suffix":"POContactInformation"},"person:PreferredContact":{"@vpms-suffix":"POPreferredContact","Options":{"Option":""},"Value":""}},{"@vpms-suffix":"POContact","person:ContactType":{"@vpms-suffix":"POContactType","Options":{"Option":""},"Value":"EMAIL_ADDRESS"},"person:ContactInformation":{"@vpms-suffix":"POContactInformation"},"person:PreferredContact":{"@vpms-suffix":"POPreferredContact","Options":{"Option":""},"Value":""}}]}},"payment:CaseManagement":{"@vpms-suffix":"CaseManagement","payment:CaseId":{"@vpms-suffix":"CaseId","$":"109f5bcf-b120-4b16-8693-e6be2d3b1cb8"},"payment:CaseName":{"@vpms-suffix":"CaseName","$":"SC09217133"},"payment:CaseType":{"@vpms-suffix":"CaseType","$":"NewBusiness"}},"payment:Quotation":{"@vpms-suffix":"Quotation","payment:Product":{"@vpms-suffix":"Product","$":"motor-private-car-m-as"},"payment:MasterPolicy":{"@vpms-suffix":"MasterPolicy"},"payment:Insured":{"@vpms-suffix":"Insured","$":"214154551"},"payment:SumInsured":{"@vpms-suffix":"SumInsured","$":"20000"},"payment:Premium":{"@vpms-suffix":"Premium","$":"1210.72"}}}}}};
	
	$scope.getComputeLazy = function(){
		var deferred = salecaseUIService.$q.defer();
		if (salecaseUIService.lazyChoiceList == undefined){
			salecaseUIService.lazyChoiceList = [];
		};
		if(!commonService.hasValueNotEmpty(salecaseUIService.lazyChoiceList[salecaseUIService.product])){
			salecaseUIService.getCaseManagementLazyList($scope.resourceURL, salecaseUIService.product).then(function(data){
				deferred.resolve(data);
			});
		} else deferred.resolve();
		return deferred.promise;
	};
	
	//get appplication detail for RUL to show proposer
	$scope.getIllustrationDetail = function getIllustrationDetail(){
    	var deferred = salecaseUIService.$q.defer();
    	if (false) {//TODO remove no need to get illustration detail, i will remove in future
    		var QuotationId = salecaseUIService.findElementInDetail_V3(["QuotationId"]);
    		if (QuotationId != undefined) {
    			QuotationId = QuotationId.$;
    		}
    		if (QuotationId != undefined && QuotationId != '') {
    			illustrationUIService.findDocument_V3($scope.resourceURL, QuotationId).then(function(data) {
	        		if (!illustrationUIService.isSuccess(data)) {
	        			$log.debug("Cannot get Illustration detail");
		        	}
	        		deferred.resolve();
	    		});
    		} else {
    			deferred.resolve();
    		}
    		
    	} else {
    		deferred.resolve();
    	}
    	return deferred.promise;
    }
	
    $scope.setupStuffs = function setupStuffs () {
        var self = this;
        if (!salecaseUIService.detail && window.Liferay.Fake == true && typeof standAloneWebappType != 'undefined' && standAloneWebappType === 'WEB_DIRECT') {
        	$state.go('root.list.homePage', {});
        } else {
        salecaseUIService.product = salecaseUIService.findElementInDetail_V3(["Product"]);
        salecaseUIService.group = salecaseUIService.getProductGroup_V3(salecaseUIService.product);

        //hle56
         if(window.cordova){
            mobileAppCoreModule.check_sync_fail([salecaseUIService.findElementInDetail_V3(["DocId"]),"PRESSED_SUBMIT"]).then(function (data){
                if(data.code == "YES"){
                    $scope.alreadyPreSubmit = true;
                }else{
                    $scope.alreadyPreSubmit = false;
                }
            });
         }

        var docStatus = salecaseUIService.findElementInDetail_V3(["DocStatus"]).BusinessStatus;
        if (salecaseUIService.group === commonService.CONSTANTS.PRODUCT_GROUP.GROUP_TERM_LIFE
        		&& ((docStatus.indexOf("SUBMIT") !== -1) || (docStatus.indexOf("PENDING") !== -1))) {
        	$scope.moduleService.freeze = true;
        }
        if (salecaseUIService.group === commonService.CONSTANTS.PRODUCT_GROUP.GROUP_TERM_LIFE) {
			$scope.getAgentDoc();
			$scope.getListClient();
		}
        var promise =  $scope.getIllustrationDetail();//get illustration detail to show proposer name RUL
        promise.then(function(){
    	    $scope.getComputeLazy().then(function(){    
    	        self.generalConfigCtrl('CaseManagementDetailCtrl', salecaseUIService).then(function finishedSetup () {
    	        	
    	        	var underwriting = salecaseUIService.findElementInDetail_V3(['Underwriting']);
    	        	
    	        	/** start cheat underwriting2 for motor **/
//    	        	if(salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.MOTOR){
//    	        		self.setVisibleCard("case-management-motor:Step6_Underwriting", true);
//    	        		underwriting['@refDocType'] = "underwriting2";
//             		}
    	        	/** end cheat underwriting2 for motor **/
    	        	
    	        	var underwritingDocID = '';
    	         	if(underwriting != undefined && underwriting['@refUid'] != '') {
    	         		underwritingDocID = underwriting['@refUid'];
    	         		if(salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.MOTOR){
    	         			self.setVisibleCard("case-management-motor:Step6_Underwriting", true);
    	         		}
    	         		if(salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.FIRE){
    	         			self.setVisibleCard("case-management-fire:Step6_Underwriting", true);
    	         		}
    	         		if(salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.TERM_LIFE
    	         				&& salecaseUIService.product == commonService.CONSTANTS.PRODUCT.GUARANTEED_CASHBACK){
    	//         			self.setVisibleCard("case-management-guaranteed-cashback-saver:ReviewAndApproval", true);
    	         			self.setVisibleCard("case-management-guaranteed-cashback-saver:Underwriting", true);
    	         		}
    	         		if(salecaseUIService.product == commonService.CONSTANTS.PRODUCT.TRAVEL_EXPRESS){
    	         			self.setVisibleCard("case-management-travel-express:Step5_Underwriting", true);
    	         		}
    	         		if(salecaseUIService.product == commonService.CONSTANTS.PRODUCT.GROUP_TRAVEL_EXPRESS){
    	         			self.setVisibleCard("case-management-gtravel:Underwriting", true);
    	         		}
    	         	}
    	         	if (salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.MOTOR){
    	         		var eCoverNoteDocs = salecaseUIService.findElementInDetail_V3(['eCoverNote']);
        	         	if(eCoverNoteDocs != undefined && eCoverNoteDocs.length > 0 && eCoverNoteDocs[0]['@refUid'] != '') {
        	         		if(commonService.hasValueNotEmpty(underwritingDocID) && underwritingDocID != '') {
        	             		self.setVisibleCard("case-management-motor:Step7_MaintainEcover", true);
        	             	} else {
        	             		self.setVisibleCard("case-management-motor:Step6_MaintainEcover", true);
        	             	}
        	         		self.setVisibleCard("case-management-motor:Payment", true);
        	         		self.setVisibleCard("case-management-motor:TransactionDocuments", true);
        	         	}
    	         	}
    	         	
    	        	var clientPayment = salecaseUIService.findElementInDetail_V3(['ClientPayment']);
    	         	if(clientPayment != undefined && clientPayment['@refUid'] != '') {
    	         		if(salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.MOTOR){
    	         			self.setVisibleCard("case-management-motor:Payment", true);
    	         		}
    	         		if(salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.FIRE){
    	         			self.setVisibleCard("case-management-fire:Payment", true);
    	         		}
    	         		if(salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.FOREIGN_WORKER){
    	         			self.setVisibleCard("case-management-personal-accident:Payment", true);
    	         		}
    	         	}
    	     /*    	if(salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.GUARANTEED_CASHBACK){
    	     		
    	     			var managerReview = salecaseUIService.findElementInDetail_V3(['ManagerReview']);
    		         	if(managerReview != undefined && managerReview['@refUid'] != '') {
    		         		self.setVisibleCard("case-management-guaranteed-cashback-saver:ReviewAndApproval", true);
    		         	}
    	     
    	     		}*/
    	         	var prints = salecaseUIService.findElementInDetail_V3(['Prints']);
    	         	if(prints != undefined && prints['@counter'] > 0) {
    	         		if(salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.MOTOR){
    	         			self.setVisibleCard("case-management-motor:TransactionDocuments", true);
    	         		}
    	         		if(salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.FIRE){
    	         			self.setVisibleCard("case-management-fire:TransactionDocuments", true);
    	         		}
    	         		if(salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.TERM_LIFE
    	         				&& salecaseUIService.product == commonService.CONSTANTS.PRODUCT.GUARANTEED_CASHBACK){
    	         			self.setVisibleCard("case-management-guaranteed-cashback-saver:TransactionDocuments", true);
    	         		}
    	         		if(salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.GROUP_TERM_LIFE){
    	         			self.setVisibleCard("case-management-gtl:TransactionDocuments", true);
    	         		}
    	         	}
    	         	// For demo Import Quotation
    	         	var demoImportQuotation = commonService.options.importQuotation;
    	         	if(demoImportQuotation) {
    	         		var quotation = salecaseUIService.findElementInDetail_V3(['Quotation']);
    	         		if(quotation != undefined) {
    		         		if(quotation['@refUid'] != '') {
    		         			self.setVisibleCard("case-management-motor:Quotations", false);
    		    	     		self.setVisibleCard("case-management-motor:Quotation", true);
    		         		} else {
    		         			self.setVisibleCard("case-management-motor:Quotations", true);
    		    	     		self.setVisibleCard("case-management-motor:Quotation", false);
    		         		}
    	         		}
    	         	} else {
    	         		self.setVisibleCard("case-management-motor:Quotations", false);
    		     		self.setVisibleCard("case-management-motor:Quotation", true);
    	         	}
    	         	// End demo Import Quotation
    	         	
    	        	$log.debug("this ctrl is processsing for: " + JSON.stringify($scope.getCurrProductInfor()));
    	        	self.setupNewCase();
    	        	if($scope.uiFrameworkService.isSectionLayout()){
    	        		self.getDetailUnderWritingDS();
    	        	}
    	        });
    	    });
        });
    	}
    };
    
    $scope.getAgentDoc = function(){
    	if (salecaseUIService.findElementInDetail_V3(['EmailAddressOfAgent']).$ === undefined){
    		var resourceURLCheckLogin = illustrationUIService.initialMethodPortletURL($scope.portletId, "checkUserLoginIllustrationdetail");
    		$http.get(resourceURLCheckLogin).success(function(data){
    			if(data == "null"){//stop if user is not yet login
    			}else{
    				var resourceURL = illustrationUIService.initialMethodPortletURL($scope.portletId,"loadPersonalProfileDoc");
    				resourceURL = resourceURL.toString();
    				$http.get(resourceURL).success(function(result){
    					salecaseUIService.userDoc = result;
    					
    					salecaseUIService.findElementInDetail_V3(['AgentName']).$ = salecaseUIService.findElementInElement_V3(salecaseUIService.userDoc, ['FullName']).$;
    					
    					var counter = parseInt(salecaseUIService.findElementInElement_V3(salecaseUIService.userDoc,['Contacts'])['@counter']);
    			    	for(var i = 0; i < counter; i++){
    			    		var contactObj = salecaseUIService.findElementInElement_V3(salecaseUIService.userDoc,['Contact'])[i]
    			    		if (salecaseUIService.findElementInElement_V3(contactObj,['ContactType']).Value === "MOBILE"){
    			    			salecaseUIService.findElementInDetail_V3(['PhoneNumberOfAgent']).$ = salecaseUIService.findElementInElement_V3(contactObj,['ContactValue']).$;
    			    			break;
    			    		}
    			    	}
    					salecaseUIService.findElementInDetail_V3(['EmailAddressOfAgent']).$ = salecaseUIService.findElementInElement_V3(salecaseUIService.userDoc, ['UserName']).$;
    			});
    			};
    		});	
    	}
	};
	
	$scope.getListClient = function(){
		 prospectUIService.getDocumentList_V3 ($scope.resourceURL).then(function(data) {
        	if (commonService.hasValueNotEmpty(prospectUIService.findElementInElement_V3(data, ['MetadataDocument']))) {
    			$scope.clientList = prospectUIService.findElementInElement_V3(data, ['MetadataDocument']);
    			$scope.clientList = prospectUIService.convertToArray($scope.clientList);
    		} 
        });
	};
	
	$scope.importStaff = function(prospectDocId, ServicingStaff){
		prospectUIService.findDocument_V3($scope.resourceURL, prospectDocId).then(function(data){
		var staffDoc = data;
		if (ServicingStaff) {
			salecaseUIService.findElementInDetail_V3(['ServicingStaffCd']).$ = salecaseUIService.findElementInElement_V3(staffDoc,['FullName']).$;
		} else {
			salecaseUIService.findElementInDetail_V3(['MarketingStaffCd']).$ = salecaseUIService.findElementInElement_V3(staffDoc,['FullName']).$;
		}
		var counter = parseInt(salecaseUIService.findElementInElement_V3(staffDoc,['Contacts'])['@counter']);
		var hasMobile = false;
		if (counter == '0') {}
		else {
			if (counter == '1') {
				var contactObjInformation = salecaseUIService.findElementInElement_V3(staffDoc,['ContactInformation'])
				var contactObjType = salecaseUIService.findElementInElement_V3(staffDoc,['ContactType'])
				if (commonService.hasValueNotEmpty(contactObjInformation.$) && contactObjType.Value == 'MOBILE_TEL'){
					hasMobile = true;
					if (ServicingStaff) {
						salecaseUIService.findElementInDetail_V3(['PhoneNumberOfServicingStaff']).$ = salecaseUIService.findElementInElement_V3(staffDoc,['ContactInformation']).$;
	    			} else {
	    				salecaseUIService.findElementInDetail_V3(['PhoneNumberOfMarketingStaff']).$ = salecaseUIService.findElementInElement_V3(staffDoc,['ContactInformation']).$;
	    			}
	    			return;
	    		}
				} else {
					for(var i = 0; i < counter; i++){
						var contactObj = salecaseUIService.findElementInElement_V3(staffDoc,['Contact'])[i];
						if(commonService.hasValueNotEmpty(salecaseUIService.findElementInElement_V3(contactObj,['ContactInformation']).$) && salecaseUIService.findElementInElement_V3(staffDoc,['ContactType']).Value == 'MOBILE_TEL'){
							hasMobile = true;
							if (ServicingStaff) {
								salecaseUIService.findElementInDetail_V3(['PhoneNumberOfServicingStaff']).$ = salecaseUIService.findElementInElement_V3(staffDoc,['ContactInformation']).$;
						} else {
							salecaseUIService.findElementInDetail_V3(['PhoneNumberOfMarketingStaff']).$ = salecaseUIService.findElementInElement_V3(staffDoc,['ContactInformation']).$;
						}
    			return;
						}
					}
				}
    		}
		if (!hasMobile) {
			if (ServicingStaff) {
				salecaseUIService.findElementInDetail_V3(['PhoneNumberOfServicingStaff']).$ = '';
			} else {
				salecaseUIService.findElementInDetail_V3(['PhoneNumberOfMarketingStaff']).$ = '';
			}
		$scope.reSetupConcreteUiStructure(salecaseUIService.detail); // refresh the values in multiple cards
	}
			});
	};

    $scope.setupNewCase = function setupNewCase () {
    	var self = this;
    	// hot fix to have right redirection 
    	if(salecaseUIService.findElementInDetail_V3(['BusinessStatus']) == ''){
    		salecaseUIService.findElementInDetail_V3(['DocStatus'])['BusinessStatus'] = 'NEW';
    	}
    	// end
    	if(uiRenderPrototypeService.isNewBusinessStatus(self.moduleService.detail)){
    		// $scope.init();
    		if (!commonService.hasValueNotEmpty(salecaseUIService.findElementInDetail_V3(['DocName']))
					|| salecaseUIService.findElementInDetail_V3(['DocName']).indexOf('Default') != -1) {
    			salecaseUIService.findElementInDetail_V3(['Header'])['DocInfo']['DocName'] = salecaseUIService.genDefaultName();
			}
//			salecaseUIService.findElementInDetail_V3(['Header'])['DocInfo']['DocName'] = salecaseUIService.genDefaultName();
			salecaseUIService.findElementInDetail_V3(['CaseManagement'])['@case-name']='NewBusiness';
			salecaseUIService.group = salecaseUIService.getProductGroup_V3(salecaseUIService.product);
			$scope.reSetupConcreteUiStructure(salecaseUIService.detail);
			if(salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.MOTOR){
				salecaseUIService.cloneProspect = angular.copy(salecaseUIService.findElementInDetail_V3(['Prospect']));
				//salecaseUIService.findElementInDetail_V3(['Prospects'])['Prospect'] = [];
				/*if(!$.isArray(salecaseUIService.findElementInDetail_V3(['Prints','Print']))){
					salecaseUIService.convertJsonPathToArray(salecaseUIService.detail,'case-management-motor:Prints', 'case-management-motor:Print');
				}*/
			}
			else if(salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.TERM_LIFE
					&& salecaseUIService.product == commonService.CONSTANTS.PRODUCT.GUARANTEED_CASHBACK){
				/*$rootScope.cloneProspect = angular.copy(salecaseUIService.findElementInDetail_V3(['NewBusiness','Doctypes','Prospects','Prospect']));
			salecaseUIService.findElementInDetail_V3(['NewBusiness','Doctypes','Prospects'])['case-management-term-life:Prospect'] = [];
			if(!$.isArray(salecaseUIService.findElementInDetail_V3(['NewBusiness','Prints','Print']))){
				salecaseUIService.convertJsonPathToArray(salecaseUIService.detail,'case-management-term-life:NewBusiness.case-management-term-life:Prints', 'case-management-term-life:Print');
			}*/
			}
			// hard Salecase detail to to EcoverNote( will be removed)
//			salecaseUIService.detail = {"IposDocument":{"@xmlns":"http://www.csc.com/integral/common","@xmlns:case-management-motor":"http://www.csc.com/integral/case-management-motor","@xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance","@xsi:schemaLocation":"http://www.csc.com/integral/case-management-motor case-management-motor-private-car-m-as-document.xsd ","Header":{"DocInfo":{"DocType":"case-management","Product":"motor-private-car-m-as","DefUid":"2c1511e7-9436-45ce-9759-23a78468a6ea","DocId":"1e6804fe-58fc-451f-9d0c-43564bdc10ac","DocName":"SC06084601","DocVersion":"","OwnerUid":"agent1@ipos.com","CreatedDate":"2015-11-17 09-08-25","UpdatedDate":"2015-11-17 09-17-17","UpdatedUserUid":"agent1@ipos.com","Tags":"","Star":"","Archived":"","Comments":""},"DocAccessControllList":{"User":{"@userid":"","Permisions":{"Permision":""}}},"DocStatus":{"DocumentStatus":"","BusinessStatus":"DRAFT"}},"Data":{"case-management-motor:CaseManagement":{"@case-name":"NewBusiness","@product":"motor-private-car-m-as","@vpms-suffix":"CaseManagement","case-management-motor:NewBusiness":{"@vpms-suffix":"NewBusiness","case-management-motor:MsgStatus":{"@vpms-suffix":"MsgStatus","case-management-motor:MsgStatusCd":{"@vpms-suffix":"MsgStatusCd","Options":{"Option":""},"Value":""},"case-management-motor:MsgErrorCd":{"@vpms-suffix":"MsgErrorCd","Options":{"Option":""},"Value":""},"case-management-motor:MsgStatusDesc":{"@vpms-suffix":"MsgStatusDesc"},"case-management-motor:PendingResponseAvailDt":{"@vpms-suffix":"PendingResponseAvailDt"},"case-management-motor:PendingResponseExpDt":{"@vpms-suffix":"PendingResponseExpDt"},"case-management-motor:ExtendedStatuses":{"@counter":"0","@maxOccurs":"","@minOccurs":"0","@vpms-suffix":"ExtendedStatuses","case-management-motor:ExtendedStatus":{"@vpms-suffix":"ExtendedStatus","case-management-motor:ExtendedStatusCd":{"@vpms-suffix":"ExtendedStatusCd","Options":{"Option":""},"Value":""},"case-management-motor:ExtendedStatusDesc":{"@vpms-suffix":"ExtendedStatusDesc"},"case-management-motor:MissingElementPath":{"@vpms-suffix":"MissingElementPath"}}}},"case-management-motor:SubmitChannel":{"@vpms-suffix":"NBSubmitChannel"},"case-management-motor:NeedFNA":{"@vpms-suffix":"NBNeedFNA"},"case-management-motor:Doctypes":{"@vpms-suffix":"NBDoctypes","case-management-motor:Prospects":{"@counter":"1","@maxOccurs":"","@minOccurs":"0","@vpms-suffix":"NBProspects","case-management-motor:Prospect":[{"@refDocType":"prospect","@refUid":"45106587-af97-40d8-b467-eb4bc56e9d39","@vpms-suffix":"NBProspect","case-management-motor:ProspectId":{"@vpms-suffix":"NBProspectId","$":"45106587-af97-40d8-b467-eb4bc56e9d39"},"case-management-motor:ProspectRole":{"@vpms-suffix":"NBProspectRole","$":"PO"}}]},"case-management-motor:Quotation":{"@refDocType":"illustration;product=motor-private-car-m-as","@refUid":"f30e3f3b-9329-4b2f-9dd4-91e1c291bb5b","@vpms-suffix":"NBQuotation","case-management-motor:QuotationId":{"@vpms-suffix":"NBQuotationId","$":"f30e3f3b-9329-4b2f-9dd4-91e1c291bb5b"}},"case-management-motor:Application":{"@refDocType":"application;product=motor-private-car-m-as","@refUid":"1232ddae-e894-4386-8584-b2acf93d8b70","@vpms-suffix":"NBApplication","case-management-motor:ApplicationId":{"@vpms-suffix":"NBApplicationId","$":"1232ddae-e894-4386-8584-b2acf93d8b70"}},"case-management-motor:Policy":{"@refDocType":"policy;product=motor-private-car-m-as","@refUid":"","@vpms-suffix":"NBPolicy","case-management-motor:PolicyId":{"@vpms-suffix":"NBPolicyId"},"case-management-motor:PolicyNumber":{"@vpms-suffix":"NBPolicyNumber"},"case-management-motor:ClientNumber":{"@vpms-suffix":"NBClientNumber"}},"case-management-motor:Payment":{"@refDocType":"payment","@refUid":"e5294b58-feee-432f-8af3-f726ea27cd38","@vpms-suffix":"NBPayment","case-management-motor:PaymentNo":{"@vpms-suffix":"NBPaymentNo"},"case-management-motor:SumInsured":{"@vpms-suffix":"NBSumInsured"},"case-management-motor:POName":{"@vpms-suffix":"NBPOName"},"case-management-motor:Premium":{"@vpms-suffix":"NBPremium"},"case-management-motor:PaymentMethod":{"@vpms-suffix":"NBPaymentMethod"},"case-management-motor:ReceiptNumber":{"@vpms-suffix":"NBReceiptNumber"}},"case-management-motor:Review":{"@refDocType":"review","@refUid":"","@vpms-suffix":"NBReview","case-management-motor:ReviewId":{"@vpms-suffix":"NBReviewId"}},"case-management-motor:eCoverNotes":{"@counter":"1","@maxOccurs":"10","@minOccurs":"0","@vpms-suffix":"NBeCoverNotes","case-management-motor:eCoverNote":[{"@refDocType":"ecovernote;product=motor-private-car-m-as","@refUid":"9d54a45a-1d7a-4df7-9aa9-58051c4e4e02","@vpms-suffix":"NBeCoverNote","case-management-motor:eCoverNoteId":{"@vpms-suffix":"NBeCoverNoteId"},"case-management-motor:eCoverNoteStatus":{"@vpms-suffix":"NBeCoverNoteStatus"}}]},"case-management-motor:Underwriting":{"@refDocType":"underwriting;product=motor-private-car-m-as","@refUid":"","@vpms-suffix":"NBUnderwriting","case-management-motor:UnderwritingId":{"@vpms-suffix":"NBUnderwritingId"}}},"case-management-motor:Prints":{"@counter":"2","@maxOccurs":"","@minOccurs":"0","@vpms-suffix":"Prints","case-management-motor:Print":[{"@vpms-suffix":"Print","@refResourceDocType":"resource-file","@refResourceUid":"fe3eff00-464d-4577-87b4-55feabaa0e8d","case-management-motor:PrintID":{"@vpms-suffix":"PrintID","$":"fe3eff00-464d-4577-87b4-55feabaa0e8d"},"case-management-motor:PrintDoctype":{"@vpms-suffix":"PrintDoctype","$":"application"}},{"@vpms-suffix":"Print","@refResourceDocType":"resource-file","@refResourceUid":"1869dac3-5b33-46da-ad5a-9f5391d5377c","case-management-motor:PrintID":{"@vpms-suffix":"PrintID","$":"1869dac3-5b33-46da-ad5a-9f5391d5377c"},"case-management-motor:PrintDoctype":{"@vpms-suffix":"PrintDoctype","$":"illustration"}}]},"Attachments":{"@vpms-suffix":"Attachments","Attachment":[{"@refResourceDocType":"resource-file","@refResourceUid":"e0b813ec-efba-4036-82e3-dd6b86530bbd","@vpms-suffix":"Attachment","FileUid":{"@refResourceStatus":"","@refResourceVal":"","@vpms-suffix":"FileUid","$":"b687ae47-d101-41ac-83ff-31dfeb201ad2"},"Name":{"@refResourceStatus":"","@refResourceVal":"","@vpms-suffix":"Name","$":"Penguins.jpg"},"FileName":{"@refResourceStatus":"","@refResourceVal":"","@vpms-suffix":"FileName","$":"Penguins.jpg"},"CreateDate":{"@refResourceStatus":"","@refResourceVal":"","@vpms-suffix":"CreateDate","$":"2015-11-17 11-36-54"},"FileSize":{"@refResourceStatus":"","@refResourceVal":"","@vpms-suffix":"FileSize","$":"759.60 KB"}},{"@refResourceDocType":"resource-file","@refResourceUid":"bb5085f6-70e3-4e04-ac35-d35246528e56","@vpms-suffix":"Attachment","FileUid":{"@refResourceStatus":"","@refResourceVal":"","@vpms-suffix":"FileUid","$":"ce7dfb5e-ce51-431b-b3d4-86759881f630"},"Name":{"@refResourceStatus":"","@refResourceVal":"","@vpms-suffix":"Name","$":"Lighthouse.jpg"},"FileName":{"@refResourceStatus":"","@refResourceVal":"","@vpms-suffix":"FileName","$":"Lighthouse.jpg"},"CreateDate":{"@refResourceStatus":"","@refResourceVal":"","@vpms-suffix":"CreateDate","$":"2015-11-17 11-36-54"},"FileSize":{"@refResourceStatus":"","@refResourceVal":"","@vpms-suffix":"FileSize","$":"548.12 KB"}}],"@counter":2}}}}}};  
//			$scope.reSetupConcreteUiStructure(salecaseUIService.detail); // refresh the values in multiple cards
//			$log.debug("NOTE: Hard Salecase detail to to EcoverNote")
			if(commonUIService.getActiveSaleChannel()!==commonService.CONSTANTS.SALE_CHANNEL.DIRECT_SALE){
			    var forceSaveDetail = true;
				$scope.saveDetail(forceSaveDetail);
			}
    	}else{
    		self.moduleService.product = self.moduleService.findElementInDetail_V3(['@product']);
    	}
    	$scope.continueLastWorking();
    }
    
    //For DS UW
    $scope.getDetailUnderWritingDS = function getDetailUnderWritingDS() {
		var underwriting = salecaseUIService.findElementInDetail_V3(['Underwriting']);
		if(underwriting != undefined && underwriting['@refUid'] != ''){
			underwritingUIService.findDocument_V3($scope.resourceURL, underwriting['@refUid']).then(function(data){
				underwritingUIService.productName = underwritingUIService.findElementInDetail_V3(['Product']);
				var checkDecisionUWDS = underwritingUIService.findElementInDetail_V3(['BusinessStatus']);
	        	if(checkDecisionUWDS == "NEW" || checkDecisionUWDS == "WIP" || checkDecisionUWDS == "DECLINED"){
	        		$scope.cleanHtmlApplication(salecaseUIService.findElementInDetail_V3(['DocName']));
	        	}
			});
		}
	}

    //$scope.init();
	// if($state.params.docId != ''){
	// 	salecaseUIService.product = salecaseUIService.findElementInDetail_V3(['@product']);
	// 	$scope.showProduct = false;
	// 	$scope.init();
	// }else{
	// 	$scope.showProduct = true;
	// 	salecaseUIService.product = "";
	// }
    //$scope.loadDetail();
    $scope.resourceURL = salecaseUIService.initialPortletURL(myArrayPortletId["my-new-workspace"]);
    // get product list of Case
    salecaseUIService.getModuleProductList_V3($scope.resourceURL,'case-management').then(function(data){
    	//$scope.products = salecaseUIService.findElementInElement_V3(data,['product']);
    });
    
    $scope.setVisibleAfterUW = function() {
    	$scope.setVisibleCard("case-management-motor:Step7_MaintainEcover", true);
    	$scope.setVisibleCard("case-management-motor:Payment", true); 
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
    
    
    $scope.saveDetail = function(forceSaveDetail){
    	var bolValidate = false;
    	if (commonService.hasValueNotEmpty(salecaseUIService.findElementInDetail_V3(['DocInfo']).DocId)
    		&& salecaseUIService.product == commonService.CONSTANTS.PRODUCT_GROUP.GROUP_TERM_LIFE){
    		bolValidate = true;
    	}
    	salecaseUIService.saveDetail_V3($scope.resourceURL, bolValidate, undefined, undefined, forceSaveDetail).then(function(data){
			if (salecaseUIService.isSuccess(data)) {
				$scope.reSetupConcreteUiStructure(salecaseUIService.detail);
				if(salecaseUIService.findElementInElement_V3(data,["Product"]) != commonService.CONSTANTS.PRODUCT.DIRECT_SALE_PA
						&& salecaseUIService.findElementInElement_V3(data,["Product"]) != commonService.CONSTANTS.PRODUCT.DIRECT_TRAVEL
						&& salecaseUIService.findElementInElement_V3(data,["Product"]) != commonService.CONSTANTS.PRODUCT.DIRECT_SALE_HOME
						&& salecaseUIService.findElementInElement_V3(data,["Product"]) != commonService.CONSTANTS.PRODUCT.DIRECT_SALE_MOTOR){
					commonUIService.showNotifyMessage("v3.mynewworkspace.message.SaveCaseSuccessfully", "success");
				}
			}
			else{
				commonUIService.showNotifyMessage("v3.mynewworkspace.message.SaveCaseUnsuccessfully");
				if (salecaseUIService.findElementInDetail_V3(["Product"]) == commonService.CONSTANTS.PRODUCT.REGULAR_UNIT_LINK
						|| salecaseUIService.findElementInDetail_V3(["Product"]) == commonService.CONSTANTS.PRODUCT.REGULAR_SAVE_LINK) {
					var error = salecaseUIService.findElementInElement_V3(data,['response-message']);
					if (angular.isArray(error)) error = error[0];
					commonUIService.showNotifyMessage(salecaseUIService.findElementInElement_V3(error,['error-code']));
				}
			}
			$log.debug("Case has been saved");
		});
    };
    
    $scope.cleanHtmlApplication = function(businessNumber){
    	var sectionColumn= angular.element( document.querySelector('#section-column'));
    	sectionColumn.hide();
    	var sectionColumn1= angular.element( document.querySelector('#section-column1'));
		sectionColumn1.append('<h3><b>Thank you for choosing CSC Insurance</b> <br/> We are sorry that we are unable to process your online application. Our Customer Service Officer will contact you within the next working day to discuss varius options available to purchase our product, Guaranteed CashBack Saver.<br/>Your Reference Number:<h3>' 
				+ businessNumber);
		$scope.isUnderwritingPending = true;
    }
    
    $scope.preSubmit = function(){
    	
    	//Check quotation validity for group travel
    	if (salecaseUIService.findElementInDetail_V3(["Product"]) == commonService.CONSTANTS.PRODUCT.GROUP_TRAVEL_EXPRESS) {
    		var validity = '';
    		for (var i = 0; i < $scope.uiStructureRoot.children.length; i++) {
				if ($scope.uiStructureRoot.children[i].metadata) {
					if ($scope.uiStructureRoot.children[i].metadata.DocType == 'illustration') {
						validity = $scope.uiStructureRoot.children[i].metadata.Validity;
						break;
					}
				}
			}
    		if (validity == undefined || validity == '') {
    			validity = illustrationUIService.findElementInDetail_V3(['Validity']).$;
    		}
    		if (validity != undefined && validity != '' && !isNaN(validity)) {
    			validity = Number(validity);
	    		var caseCreatedDate = salecaseUIService.findElementInDetail_V3(['CreatedDate']);
	    		caseCreatedDate = new moment(caseCreatedDate, 'YYYY-MM-DD HH-mm-ss').utc();
	    		var today = new moment().utc();
	    		if (today.subtract(validity, 'd').isAfter(caseCreatedDate)) {
	    			commonUIService.showNotifyMessage('MSG-BG05');
	    			return;
	    		}
    		}
    	}
    	
    	//salecaseUIService.saveDetail_V3($scope.resourceURL, false).then(function(){ 
		
	    	// Prevent call 2 reSetupConcreteUiStructure in the same time.
	    	// $scope.reSetupConcreteUiStructure(applicationUIService.detail); // refresh the values in multiple cards
		//});
    	
    	var promise = $scope.setApplicationStatus();
    	
    	promise.then(function(){
        		var self = this;
        	var saleCaseID = salecaseUIService.findElementInDetail_V3(['DocId']);
        	var bolValidate = false;
        	if (commonService.hasValueNotEmpty(saleCaseID) && (
        		salecaseUIService.product == commonService.CONSTANTS.PRODUCT.REGULAR_UNIT_LINK ||
        		salecaseUIService.product == commonService.CONSTANTS.PRODUCT.ENDOWMENT )){
        		bolValidate = true;
        	}
        	salecaseUIService.saveDetail_V3($scope.resourceURL,bolValidate).then(function(data){
        		if (salecaseUIService.isSuccess(data)) {
        			
        			salecaseUIService.preSubmitSaleCase($scope.resourceURL, 'newbusiness', saleCaseID, salecaseUIService.product).then(function(data) {
        			    $scope.alreadyPreSubmit = true; // after presubmit always disable button presubmit
        				var message = salecaseUIService.findElementInElement_V3(data, ['ErrorMessage']);
						if((message==undefined || message.length==0 || message=='' || message==null )
						    && data != "errorSubmitting" &&  ( data  == undefined || data.code == undefined || data.code.length == 0 ) // android cordova
						    && salecaseUIService.isSuccess(data)){
        					commonUIService.showNotifyMessage("v3.myworkspace.message.PresubmitSaleCaseSuccessfully", 'success');
        					var underwriting = salecaseUIService.findElementInDetail_V3(['Underwriting']);
        					if(underwriting != undefined && underwriting['@refUid'] != ''){
        						if(salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.MOTOR){
        							$scope.setVisibleCard("case-management-motor:Step6_Underwriting", true);
        							underwritingUIService.findDocumentToEdit_V3($scope.resourceURL, salecaseUIService.product, underwriting['@refUid']).then(function(data){
        								underwritingUIService.findElementInDetail_V3(['DocInfo'])['DocName'] = underwritingUIService.genDefaultName();
        								underwritingUIService.saveDetail_V3($scope.resourceURL, false).then(function(data){
        								});
        							});
        						}
        						if(salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.FIRE){
        							$scope.setVisibleCard("case-management-fire:Step6_Underwriting", true);
        							
        							underwritingUIService.getUnderwriting($scope.resourceURL, underwriting['@refUid']).then(function(data){
        								underwritingUIService.findElementInDetail_V3(['DocInfo'])['DocName'] = underwritingUIService.genDefaultName();
        								underwritingUIService.saveDetail_V3($scope.resourceURL, false).then(function(data){
        								});
        							});
        						}
        						if(salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.TERM_LIFE
        								&& salecaseUIService.product != commonService.CONSTANTS.PRODUCT.REGULAR_UNIT_LINK){
//                     			$scope.setVisibleCard("case-management-guaranteed-cashback-saver:ReviewAndApproval", true);
        							
        							underwritingUIService.getUnderwriting($scope.resourceURL, underwriting['@refUid']).then(function(data){
        								underwritingUIService.findElementInDetail_V3(['DocInfo'])['DocName'] = underwritingUIService.genDefaultName();
        								underwritingUIService.saveDetail_V3($scope.resourceURL, false).then(function(data){
        									if($scope.uiFrameworkService.isSectionLayout()){
        										$scope.cleanHtmlApplication(salecaseUIService.findElementInDetail_V3(['DocName']));
        									}
        								});
        							});
        						}
        						if(salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.TRAVEL){
        							if(salecaseUIService.product == commonService.CONSTANTS.PRODUCT.TRAVEL_EXPRESS) {
        								$scope.setVisibleCard("case-management-travel-express:Step5_Underwriting", true);
        							}
        							if(salecaseUIService.product == commonService.CONSTANTS.PRODUCT_GROUP.GROUP_TRAVEL_EXPRESS) {
        								$scope.setVisibleCard("case-management-gtravel:Underwriting", true);
        							}
        							/*underwritingUIService.getUnderwriting($scope.resourceURL, underwriting['@refUid']).then(function(data){*/
        							underwritingUIService.findDocumentToEdit_V3($scope.resourceURL, salecaseUIService.product, underwriting['@refUid']).then(function(data){
        								underwritingUIService.findElementInDetail_V3(['DocInfo'])['DocName'] = underwritingUIService.genDefaultName();
        								underwritingUIService.saveDetail_V3($scope.resourceURL, false).then(function(data){
        								});
        							});
        						}
        					}
        					
        					var eCoverNote = salecaseUIService.findElementInDetail_V3(['eCoverNote']);
        					if(eCoverNote != undefined && eCoverNote['@refUid'] != ''){
        						$scope.setVisibleCard("case-management-motor:Step6_MaintainEcover", true);
        						$scope.setVisibleCard("case-management-motor:Payment", true); 
        						// Generate DocName for eCoverNote
        						ecovernoteUIService.findDocumentToEdit_V3($scope.resourceURL, salecaseUIService.product, eCoverNote['@refUid']).then(function(data){
        							ecovernoteUIService.findElementInDetail_V3(['DocInfo'])['DocName'] = applicationUIService.findElementInDetail_V3(['DocInfo'])['DocName'];
        							ecovernoteUIService.saveDetail_V3($scope.resourceURL, false).then(function(data){
        								$scope.addActionCardToUiStructure("case-management-motor:Step6_MaintainEcover");
        							});
        						});
        					}
        					var clientPayment = salecaseUIService.findElementInDetail_V3(['ClientPayment']);
        					if(clientPayment != undefined && clientPayment['@refUid'] != '') {
        						if(salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.MOTOR){
        							$scope.setVisibleCard("case-management-motor:Payment", true);
        						}
        						if(salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.FIRE){
        							$scope.setVisibleCard("case-management-fire:Payment", true);
        						}
        						if(salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.FOREIGN_WORKER){
        							$scope.setVisibleCard("case-management-personal-accident:Payment", true);
        						}
        						if(salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.TERM_LIFE
        								&& salecaseUIService.product == commonService.CONSTANTS.PRODUCT.GUARANTEED_CASHBACK){
        							$scope.setVisibleCard("case-management-guaranteed-cashback-saver:Payment", true);
        						}
        					}
        					var prints = salecaseUIService.findElementInDetail_V3(['Prints']);
        					if(prints != undefined && prints['@counter'] > 0) {
        						if(salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.MOTOR){
        							$scope.setVisibleCard("case-management-motor:TransactionDocuments", true);
        						}
        						if(salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.FIRE){
        							$scope.setVisibleCard("case-management-fire:TransactionDocuments", true);
        						}
        						if(salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.TERM_LIFE
        								&& salecaseUIService.product == commonService.CONSTANTS.PRODUCT.GUARANTEED_CASHBACK){
        							$scope.setVisibleCard("case-management-guaranteed-cashback-saver:TransactionDocuments", true);
        						}
        						if(salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.GROUP_TERM_LIFE){
        							$scope.setVisibleCard("case-management-gtl:TransactionDocuments", true);
        						}
        					}
        					
        					/*	var managerReview = salecaseUIService.findElementInDetail_V3(['ManagerReview']);
        	         	if(managerReview != undefined && managerReview['@refUid'] != '') {
        	         		if(salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.GUARANTEED_CASHBACK){
        	         			$scope.setVisibleCard("case-management-guaranteed-cashback-saver:ReviewAndApproval", true);
        	         		}
        	         	}*/
        					// get Payment detail
        					/*var paymentUid = salecaseUIService.findElementInDetail_V3(['Payment'])['@refUid'];
    	    	        if(commonService != ''){
    	    	        	//$scope.setVisibleCard("case-management-motor:Payment", true); 
    	    	        	paymentUIService.findDocument_V3($scope.resourceURL, paymentUid).then(function(data) {
    	    	        		salecaseUIService.payment = data;
    	    	        	});
    	    	        } */
        					
        					//For RUL and Endowment, 
        					//	@maxOccurs of Prospect and Quotation is lost after Presubmit
        					//	solution: get detail of case-management
        					if (commonService.hasValueNotEmpty(saleCaseID) && (
    			        		salecaseUIService.product == commonService.CONSTANTS.PRODUCT.REGULAR_UNIT_LINK ||
    			        		salecaseUIService.product == commonService.CONSTANTS.PRODUCT.REGULAR_SAVE_LINK ||
    			        		salecaseUIService.product == commonService.CONSTANTS.PRODUCT.ENDOWMENT )){        						 
        						salecaseUIService.findDocumentToEdit_V3($scope.resourceURL, salecaseUIService.product, saleCaseID, {transactionType: "NewBusiness"}).then(function(){
        							$scope.reSetupConcreteUiStructure(salecaseUIService.detail);
        	                    });
    			        	}
        					
        					$scope.reSetupConcreteUiStructure(salecaseUIService.detail); // refresh the values in multiple cards
							if ($scope.uiFrameworkService.isSectionLayout() && underwriting['@refUid'] == '') {
								$scope.moveToSection(true)
							}
        				} else {
        					//$scope.rollbackApplicationStatus();
        					if (data == "errorSubmitting") {
        					    $scope.rollbackApplicationStatus();
	        					commonUIService.showNotifyMessage("v3.myworkspace.message.errorSubmitting", "success");//this happened when error has occured with BC submitting or network problem
	        				} else if(data.code=="NO_CONNECTION") {
	        				    $scope.alreadyPreSubmit = true;
	        				    commonUIService.showNotifyMessage("v3.mobile.check.sync.NO_CONNECTION", "fail");
	        				} else if (data.code=="SPAJNO_FAIL") {
	        				    $scope.alreadyPreSubmit = true;
	        				    //Could not get Application Number. Please check network status or Server Side
	        				    commonUIService.showNotifyMessage("v3.mobile.check.sync.presubmit.fail", "fail");
	        				} else if(data.code=="PRE_SUBMIT_SYNC_UP_FAIL") {
	        				    $scope.alreadyPreSubmit = true;
	                            commonUIService.showNotifyMessage("v3.mobile.check.sync.presubmit.fail", "fail");
	        				} else if(data.code=="PRE_SUBMIT_CALL_FAIL") {
	        				    $scope.alreadyPreSubmit = true;
	                            commonUIService.showNotifyMessage("v3.mobile.check.sync.presubmit.fail", "fail");
	                        } else if(data.code=="PRE_SUBMIT_SYNC_DOWN_FAIL") {
	                            $scope.alreadyPreSubmit = true;
	                            commonUIService.showNotifyMessage("v3.mobile.check.sync.presubmit.fail", "fail");
	                        } else {
	                            $scope.rollbackApplicationStatus();
	    						$log.debug(message);
	    						commonUIService.showNotifyMessage("v3.myworkspace.message.PresubmitSaleCaseUnsuccessfully");
	    						if(salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.TRAVEL
	    								|| salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.UNIT_LINK
	    								|| salecaseUIService.product == commonService.CONSTANTS.PRODUCT.REGULAR_UNIT_LINK
	    								|| salecaseUIService.product == commonService.CONSTANTS.PRODUCT.REGULAR_SAVE_LINK
	    								|| salecaseUIService.product === commonService.CONSTANTS.PRODUCT.ENDOWMENT) {
	    							var errorMessage = applicationUIService.findElementInElement_V3(data, ['error-code']);
	    							if(commonService.hasValueNotEmpty(errorMessage)) {
	    								commonUIService.showNotifyMessage(errorMessage);
	    							}
	    						}
	        				}
        				}
        			});
        		} else {
        			$scope.rollbackApplicationStatus();
    				if (salecaseUIService.findElementInDetail_V3(["Product"]) == commonService.CONSTANTS.PRODUCT.REGULAR_UNIT_LINK ||
    					salecaseUIService.findElementInDetail_V3(["Product"]) == commonService.CONSTANTS.PRODUCT.ENDOWMENT) {
    					salecaseUIService.findElementInDetail_V3(["Product"]) == commonService.CONSTANTS.PRODUCT.REGULAR_SAVE_LINK) {
    					var error = salecaseUIService.findElementInElement_V3(data,['response-message']);
    					if (angular.isArray(error)) error = error[0];
    					commonUIService.showNotifyMessage(salecaseUIService.findElementInElement_V3(error,['error-code']));
    				}
        		}
        	});
    	});
    	
    };
    
    $scope.setupStuffs();   
    
    //hard code application status for some specific product-  need dateway runtime to fix this
    $scope.setApplicationStatus = function setApplicationStatus(){
    	var deferred = applicationUIService.$q.defer();

    	// hard ACCEPTED status for FIRE APP ( will be removed)
    	if (salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.FIRE
    		||salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.MOTOR
    		|| salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.TERM_LIFE
    		|| salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.TRAVEL
    		|| salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.UNIT_LINK
    		|| salecaseUIService.product === commonService.CONSTANTS.PRODUCT.ENDOWMENT
    	) {
    		var applicationId = salecaseUIService.findElementInDetail_V3(["ApplicationId"]).$;
    		applicationUIService.findDocument_V3($scope.resourceURL, applicationId).then(function(data) {
        		if (applicationUIService.isSuccess(data)) {
        			$scope.previousApplicationStatus = applicationUIService.findElementInDetail_V3(['DocStatus'])['BusinessStatus'];
        			if(applicationUIService.findElementInDetail_V3(['DocStatus'])['BusinessStatus'] == commonService.CONSTANTS.STATUS.ACCEPTED){
        				deferred.resolve();
        			}else{
        				applicationUIService.findElementInDetail_V3(['DocStatus'])['BusinessStatus'] = commonService.CONSTANTS.STATUS.ACCEPTED;
                		applicationUIService.saveDetail_V3($scope.resourceURL, false).then(function(data){
                			if (!applicationUIService.isSuccess(data)) {
                				commonUIService.showNotifyMessage("v3.myworkspace.message.SaveApplicationUnsuccessfully");
                				deferred.reject();
                			}else{
                				deferred.resolve();
                			}
                		});
        			}
        		}else{
        			commonUIService.showNotifyMessage("v3.myworkspace.message.SaveApplicationUnsuccessfully");
	        		deferred.reject();
	        	}
    		});
    	}else{
    		deferred.resolve();
    	}
    	return deferred.promise;
    }
    
    //remove hard code application status if presubmit fail
    $scope.rollbackApplicationStatus = function rollbackApplicationStatus(){
    	if (salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.FIRE
        	|| salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.MOTOR
        	|| salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.TERM_LIFE
        	|| salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.TRAVEL
        	|| salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.UNIT_LINK
        	|| salecaseUIService.product === commonService.CONSTANTS.PRODUCT.ENDOWMENT
        ) {
    		if ($scope.previousApplicationStatus !== applicationUIService.findElementInDetail_V3(['DocStatus'])['BusinessStatus']) {
	    		applicationUIService.findElementInDetail_V3(['DocStatus'])['BusinessStatus'] = $scope.previousApplicationStatus;
	    		applicationUIService.saveDetail_V3($scope.resourceURL, false);
    		}
    	}
    };
    
    $scope.getDocumentCenterList = function getDocumentCenterList(){
    	if($scope.moduleService.findElementInDetail_V3(['DocId']) != "" && $scope.moduleService.findElementInDetail_V3(['DocId']) != undefined){
			/*salecaseUIService.getReourceFileByCaseId($scope.resourceURL,$scope.moduleService.detail.IposDocument.Header.DocInfo.DocId).then(function(data){
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
			});*/
    		
    		salecaseUIService.setUpTransactionDocuments($scope.resourceURL).then(function(data){
    			$scope.reSetupConcreteUiStructure(data);
    		});
    	}		
	};
	
	//$scope.getDocumentCenterList();
    
	$scope.refreshDetail = function(){
		var self = this;
		var saleCaseID = salecaseUIService.findElementInDetail_V3(['DocId']);
		var deferred = applicationUIService.$q.defer();
		salecaseUIService.findDocument_V3($scope.resourceURL, saleCaseID).then(function(data){
        	var underwriting = salecaseUIService.findElementInDetail_V3(['Underwriting']);
        	var underwritingDocID = '';
         	if(underwriting != undefined && underwriting['@refUid'] != '') {
         		underwritingDocID = underwriting['@refUid'];
         		if(salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.MOTOR){
         			self.setVisibleCard("case-management-motor:Step6_Underwriting", true);
         		}
         		if(salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.FIRE){
         			self.setVisibleCard("case-management-fire:Step6_Underwriting", true);
         		}
         		if(salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.TERM_LIFE
         				&& salecaseUIService.product == commonService.CONSTANTS.PRODUCT.GUARANTEED_CASHBACK){
//         			self.setVisibleCard("case-management-guaranteed-cashback-saver:ReviewAndApproval", true);
         			self.setVisibleCard("case-management-guaranteed-cashback-saver:Underwriting", true);
         		}
         		if(salecaseUIService.product == commonService.CONSTANTS.PRODUCT.TRAVEL_EXPRESS){
         			self.setVisibleCard("case-management-travel-express:Step5_Underwriting", true);
         		}
         		if(salecaseUIService.product == commonService.CONSTANTS.PRODUCT.GROUP_TRAVEL_EXPRESS){
         			self.setVisibleCard("case-management-gtravel:Underwriting", true);
         		}
         	}
         	if (salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.MOTOR){
	         	var eCoverNoteDocs = salecaseUIService.findElementInDetail_V3(['eCoverNote']);
	         	if(eCoverNoteDocs != undefined && eCoverNoteDocs['@refUid'] != '') {
	         		if(salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.MOTOR){
	         			if(commonService.hasValueNotEmpty(underwritingDocID) && underwritingDocID != '') {
	         				self.setVisibleCard("case-management-motor:Step7_MaintainEcover", true);
	         			} else {
	         				self.setVisibleCard("case-management-motor:Step6_MaintainEcover", true);
	         			}
	         		}
	         	}
         	}
        	var clientPayment = salecaseUIService.findElementInDetail_V3(['ClientPayment']);
         	if(clientPayment != undefined && clientPayment['@refUid'] != '') {
         		if(salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.MOTOR){
         			self.setVisibleCard("case-management-motor:Payment", true);
         		}
         		if(salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.FIRE){
         			self.setVisibleCard("case-management-fire:Payment", true);
         		}
         		if(salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.TERM_LIFE
         				&& salecaseUIService.product == commonService.CONSTANTS.PRODUCT.GUARANTEED_CASHBACK){
         			self.setVisibleCard("case-management-guaranteed-cashback-saver:Payment", true);
         		}
         	}
         	var prints = salecaseUIService.findElementInDetail_V3(['Prints']);
         	if(prints != undefined && prints['@counter'] > 0) {
         		if(salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.MOTOR){
         			self.setVisibleCard("case-management-motor:TransactionDocuments", true);
         		}
         		if(salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.FIRE){
         			self.setVisibleCard("case-management-fire:TransactionDocuments", true);
         		}
         		if(salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.TERM_LIFE
         				&& salecaseUIService.product == commonService.CONSTANTS.PRODUCT.GUARANTEED_CASHBACK){
         			self.setVisibleCard("case-management-guaranteed-cashback-saver:TransactionDocuments", true);
         		}
         		if(salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.GROUP_TERM_LIFE){
         			self.setVisibleCard("case-management-gtl:TransactionDocuments", true);
         		}
         	}
      /*   	var managerReview = salecaseUIService.findElementInDetail_V3(['ManagerReview']);
         	if(managerReview != undefined && managerReview['@refUid'] != '') {
         		if(salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.GUARANTEED_CASHBACK){
         			self.setVisibleCard("case-management-guaranteed-cashback-saver:ReviewAndApproval", true);
         		}
         	}*/
			$scope.reSetupConcreteUiStructure(salecaseUIService.detail).then(function(){
			    deferred.resolve();
			}); // refresh the values in multiple cards
		});
		return deferred.promise;
	};
	
	
	/*Review & Accept Quotation*/
	var checkAcceptButtonCondition = function(){
		var documentStatus = illustrationUIService.findElementInDetail_V3(['DocumentStatus']);
		var businessStatus = illustrationUIService.findElementInDetail_V3(['BusinessStatus']);
		var application = salecaseUIService.findElementInDetail_V3(['Application'])['@refUid']; 
		salecaseUIService.isShowAcceptButton = false;
		salecaseUIService.isShowUnAcceptButton = false;
		$scope.isShowCreateApplicationButton = false;
		if(businessStatus =="DRAFT"){
			salecaseUIService.isShowAcceptButton = true;
		}
		// enable Accept Quotation when Direct Sale without check Draft status
		if(activeChannel=="DS" && businessStatus != "ACCEPTED" && businessStatus != "NEW"){
			salecaseUIService.isShowAcceptButton = true;
		}
		if(businessStatus == "ACCEPTED" && application == ''){
			salecaseUIService.isShowUnAcceptButton = true;
			$scope.setVisibleActionCards("case-management-fire:Step2_Quotation", false);
		}
		/*if(documentStatus == "ACCEPTED" && application == ''){
			// TBD 
			//$scope.isShowCreateApplicationButton = true;
		}*/
	
	};
	$scope.showAcceptActions = function(){
		
		// case: open an existing case without open step2: Quotation
		if(!commonService.hasValueNotEmpty(illustrationUIService.detail)){
			var docId = salecaseUIService.findElementInDetail_V3(['Quotation'])['@refUid'];
			if(docId!=''){
				illustrationUIService.findDocumentToEdit_V3($scope.resourceURL, salecaseUIService.product, docId).then(function(data){
				});
			}
		}		if (!salecaseUIService.product.indexOf("motor")){
			illustrationUIService.checkVehicleInBlacklisted($scope.resourceURL).then(function(result){
				if (!result){
					checkAcceptButtonCondition();
				}
				else salecaseUIService.isShowUnAcceptButton = false;
				
			});
		}
		else checkAcceptButtonCondition();
		
	};
	$scope.hideAcceptActions = function(){
		salecaseUIService.isShowAcceptButton = false;
		salecaseUIService.isShowUnAcceptButton = false;
		$scope.isShowCreateApplicationButton = false;
	};
	$scope.continueLastWorking = function(){
		var self = this;
		//continue to save quotation detail (direct sale)
		if(localStorage.getItem("caseDSDetail") && localStorage.getItem("isContinueLastWorking")){
			if (localStorage.getItem("caseDocName") != undefined) {
				salecaseUIService.findElementInDetail_V3(['Header'])['DocInfo']['DocName'] = localStorage.getItem("caseDocName");
			}
			illustrationUIService.detail = JSON.parse(localStorage.getItem("caseDSDetail"));
			localStorage.removeItem("caseDSDetail");
			localStorage.removeItem("isContinueLastWorking");
			$scope.reSetupConcreteUiStructure(salecaseUIService.detail);
			self.acceptQuotation();
		}
	};
	
	$scope.saveAndExit = function() {	
		if (illustrationUIService.productName == commonService.CONSTANTS.PRODUCT.DS_GUARANTEED_CASHBACK) {
			if (illustrationUIService.findElementInDetail_V3(['MobilePhone']).$ == undefined ||
					illustrationUIService.findElementInDetail_V3(['EmailAddress']).$ == undefined) {
				$scope.requireContact();
			} else {
				var confirm = $mdDialog.confirm()
					.title($filter('translate')("v3.mynewworkspace.message.DS-GCS-SaveAndExit"))
					.ok($filter('translate')("v3.yesno.enum.OK"))
					.cancel($filter('translate')("v3.yesno.enum.Cancel"));
				$mdDialog.show(confirm).then(function(){
					saveCaseAndCorrespondingQuotation($scope.sendEmailAfterSaveDirectSaleCase);
					$scope.exitCase();
				});
			}
		} else {
			saveCaseAndCorrespondingQuotation($scope.exitCase);					
		}
		
	}
	
	$scope.sendEmailAfterSaveDirectSaleCase = function () {		
		var deferred = salecaseUIService.$q.defer();
		var typeSendValue = illustrationUIService.findElementInDetail_V3(['EmailAddress']).$;
		var product = illustrationUIService.productName;
		var zone = "GST";
    	var createDate = moment().format("YYYY-MM-DD-HH-mm");
    	var days = salecaseUIService.findElementInDetail_V3(['NumOfExpiredDays']).$;            	
        var expiredDate = moment().add(days,'days').format("YYYY-MM-DD-HH-mm");

		salecaseUIService.sendEmailAfterSaveDirectSaleCase($scope.resourceURL,typeSendValue, product, createDate, expiredDate, zone).then(function(){
			deferred.resolve();		
	    });
		return deferred.promise;;
	};
	
	$scope.applyQuotation = function() {
		loadingBarService.showLoadingBar();
		loadingBarService.showLoadingBar();
		loadingBarService.showLoadingBar();
		saveCaseAndCorrespondingQuotation($scope.computeAndAcceptQuotation);		
		loadingBarService.hideLoadingBar();
	}
	
	$scope.exitCase = function() {
		var buildCaseUrl = function() {
			var product = salecaseUIService.product;
			var docId = salecaseUIService.findElementInDetail_V3(['DocId']);
			var base = window.location.hostname + window.location.pathname;
			return base + '#/case/' + product + '/NewBusiness/' + docId;
		};
		var caseUrl = buildCaseUrl();
		$log.debug('Case Url : ' + caseUrl);
		$scope.uiFrameworkService.isFirstTimeOpen = false;
		localStorage.clear();
		$state.go('root.list.homePage', {});
	}
	
	var saveCaseAndCorrespondingQuotation = function(callback) {
		localStorage.removeItem("caseDSDetail");
		localStorage.removeItem("isContinueLastWorking");
		if(salecaseUIService.userDoc == undefined) {
			var resourceURL = illustrationUIService.initialMethodPortletURL($scope.portletId,"loadPersonalProfileDoc");
			resourceURL = resourceURL.toString();
			$http.get(resourceURL).success(function(result) {
				salecaseUIService.userDoc = result;
			});
		}
		var quotationRefDetail = undefined;
		if (salecaseUIService.product == "ds-guaranteed-cashback-saver") 
			quotationRefDetail = salecaseUIService.findElementInDetail_V3(['Quotation'])[0]
		else quotationRefDetail = salecaseUIService.findElementInDetail_V3(['Quotation']);
		if(illustrationUIService.findElementInDetail_V3(['DocId'])=="" || quotationRefDetail['@refUid']==""){
			illustrationUIService.saveDetail_V3($scope.resourceURL, false).then(function(data){
				var docId = illustrationUIService.findElementInDetail_V3(['DocId']);
				quotationRefDetail['@refUid'] = docId;
				salecaseUIService.findElementInElement_V3(quotationRefDetail,['QuotationId']).$ = docId;
				if(illustrationUIService.productName == commonService.CONSTANTS.PRODUCT.DS_GUARANTEED_CASHBACK) {					
					salecaseUIService.findElementInDetail_V3(['EffectiveDate']).$ = illustrationUIService.findElementInDetail_V3(['CreatedDate']); 
				}
							
		    	salecaseUIService.saveDetail_V3($scope.resourceURL, false).then(function(dataResult){
		    		// for direct sale case ( save Quotation first then save Case )
		    		if(illustrationUIService.findElementInDetail_V3(['CaseID'])!=undefined && illustrationUIService.findElementInDetail_V3(['CaseID']).$==undefined){
		    			illustrationUIService.findElementInDetail_V3(['CaseID']).$ = salecaseUIService.findElementInDetail_V3(['DocId']);
		    			illustrationUIService.saveDetail_V3($scope.resourceURL, false).then(function(data){
		    				callback();
		    			});
		    		} else {
		    			callback();
		    		}
				});
			});
		} else {
			callback();
		}
	}
	
	//for Direct sale - GCS
	$scope.requireContact = function() {
		$mdDialog.show(
			$mdDialog.alert()			
				.title($filter('translate')("v3.mynewworkspace.message.DS-GCS-RequireContact"))
				.ok($filter('translate')("v3.yesno.enum.OK"))
		);			
	}
		
	$scope.acceptQuotation = function(isUnderwriterAccept){
		
		//Check quotation validity for group travel
    	if (salecaseUIService.findElementInDetail_V3(["Product"]) == commonService.CONSTANTS.PRODUCT.GROUP_TRAVEL_EXPRESS) {
    		var validity = illustrationUIService.findElementInDetail_V3(['Validity']).$;
    		if (validity != undefined && validity != '' && !isNaN(validity)) {
    			validity = Number(validity);
	    		var caseCreatedDate = salecaseUIService.findElementInDetail_V3(['CreatedDate']);
	    		caseCreatedDate = new moment(caseCreatedDate, 'YYYY-MM-DD HH-mm-ss').utc();
	    		var today = new moment().utc();
	    		if (today.subtract(validity, 'd').isAfter(caseCreatedDate)) {
	    			commonUIService.showNotifyMessage('MSG-BG05');
	    			return;
	    		}
    		}
    	}
    	
    	//Manually loading bar to make loading bar always show
		sessionStorage.setItem("longOverLay", true);
		loadingBarService.showLoadingBar();
		
		var resourceURLCheckLogin = illustrationUIService.initialMethodPortletURL($scope.portletId, "checkUserLoginIllustrationdetail");
		$scope.getViewHistory();
		//check user login status
		illustrationUIService.checkUserLogin(resourceURLCheckLogin.toString()).then(function(data){
			if(data == false){
				
				//Manually loading bar to make loading bar hide
				sessionStorage.removeItem("longOverLay");
				loadingBarService.hideLoadingBar();
				
				//stop if user is not yet login
				localStorage.setItem("caseDocName", salecaseUIService.findElementInDetail_V3(['DocName']));
				var newURL = urlService.urlMap.LOGIN;
				window.open(newURL, '_self');
				return;		
			}else{
				localStorage.removeItem("caseDSDetail");
				localStorage.removeItem("isContinueLastWorking");
				//localStorage.removeItem("listCardHistory");
				if(salecaseUIService.userDoc==undefined){
					var resourceURL = illustrationUIService.initialMethodPortletURL($scope.portletId,"loadPersonalProfileDoc");
					resourceURL = resourceURL.toString();
					$http.get(resourceURL).success(function(result){
						salecaseUIService.userDoc = result;
					});
				}
				if(illustrationUIService.findElementInDetail_V3(['DocId'])=="" || salecaseUIService.findElementInDetail_V3(['Quotation'])['@refUid']==""){
					illustrationUIService.saveDetail_V3($scope.resourceURL, false).then(function(data){
						var docId = illustrationUIService.findElementInDetail_V3(['DocId']);
						//salecaseUIService.findElementInDetail_V3(['Quotation'])['@refUid'] = docId;
						var quotation = salecaseUIService.findElementInDetail_V3(['Quotation']);
						if (!angular.isArray(quotation)) {
							//For single quotation
							quotation['@refUid'] = docId;
						} else {
							//For multiple quotations
							quotation[0]['@refUid'] = docId;
						}
						salecaseUIService.findElementInDetail_V3(['QuotationId']).$ = docId;
				    	salecaseUIService.saveDetail_V3($scope.resourceURL, false).then(function(dataResult){
				    		// for direct sale case ( save Quotation first then save Case )
				    		if(illustrationUIService.findElementInDetail_V3(['CaseID'])!=undefined && illustrationUIService.findElementInDetail_V3(['CaseID']).$==undefined){
				    			illustrationUIService.findElementInDetail_V3(['CaseID']).$ = salecaseUIService.findElementInDetail_V3(['DocId']);
				    			illustrationUIService.saveDetail_V3($scope.resourceURL, false).then(function(data){
				    				$scope.computeAndAcceptQuotation(isUnderwriterAccept).then(function(){
				    					//Manually loading bar to make loading bar hide
				    					sessionStorage.removeItem("longOverLay");
				    					loadingBarService.hideLoadingBar();
				    				})
				    			});
				    		} else {
				    			// continue accept quotation
				    			// fix issue accept action do nothing when not click save button but click compute button
				    			$scope.computeAndAcceptQuotation(isUnderwriterAccept).then(function(){
				    				//Manually loading bar to make loading bar hide
				    				sessionStorage.removeItem("longOverLay");
				    				loadingBarService.hideLoadingBar();
				    			})
				    		}
				    		// end
				    		
							$log.debug("Pushed Quotation docId into Case ");
						});
					});
				}else{
					$scope.computeAndAcceptQuotation(isUnderwriterAccept).then(function(){
						//Manually loading bar to make loading bar hide
				    	sessionStorage.removeItem("longOverLay");
				    	loadingBarService.hideLoadingBar();
					})
				}
			}
		});
	};
	
	$scope.computeAndAcceptQuotation = function(isUnderwriterAccept){
		var deferred = salecaseUIService.$q.defer();
		//illustrationUIService.computeIllustrationDetail($scope.resourceURL, salecaseUIService.product).then(function(data){
			var premiumConditional = 'BasePremium';
			if(salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.FIRE || salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.FOREIGN_WORKER){
				premiumConditional = 'TotalPremium';
			}
			if(salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.TERM_LIFE){
				if(salecaseUIService.product === commonService.CONSTANTS.PRODUCT.REGULAR_UNIT_LINK){
					premiumConditional = 'RegularBasicPremium';
				}
				else premiumConditional = 'PremiumFrequencyPayable';
			}
			if(salecaseUIService.product === commonService.CONSTANTS.PRODUCT_GROUP.GROUP_TERM_LIFE){
				premiumConditional = 'TotalGrossPremium';
			}
			if(salecaseUIService.group === commonService.CONSTANTS.PRODUCT_GROUP.UNIT_LINK){
				premiumConditional = 'RegularBasicPremium';
			}
			if(salecaseUIService.product === commonService.CONSTANTS.PRODUCT.ENDOWMENT){
				premiumConditional = 'RegularBasicPremium';
			}
			if(salecaseUIService.group === commonService.CONSTANTS.PRODUCT_GROUP.TRAVEL){
				premiumConditional = 'TotalPayablePremiumIDR';
			}
			if(salecaseUIService.group === commonService.CONSTANTS.PRODUCT_GROUP.DIRECT_TRAVEL){
				premiumConditional = 'TotalPayablePremiumIDR';
			}
			if(salecaseUIService.group === commonService.CONSTANTS.PRODUCT_GROUP.DIRECT_PA){
				premiumConditional = 'TotalPayablePremiumIDR';
			}
			if(salecaseUIService.product === commonService.CONSTANTS.PRODUCT.DIRECT_SALE_HOME){
				premiumConditional = 'TotalPayablePremiumIDR';
			}
			if(salecaseUIService.product === commonService.CONSTANTS.PRODUCT.DIRECT_SALE_MOTOR){
				premiumConditional = 'TotalPayablePremiumIDR';
			}
			if (illustrationUIService.findElementInDetail_V3([premiumConditional]).$ != undefined) {
				// set ACCEPTED status to Quotation
				illustrationUIService.findElementInDetail_V3(['DocStatus'])['BusinessStatus'] = "ACCEPTED";
				$scope.saveInsuranceRoleAsProspect('PolicyOwnerInformation').then(function(savedPolicyOwner) {
			    $scope.saveInsuranceRoleAsProspect('LifeInsuredInformation').then(function(savedLifeInsured) {
				illustrationUIService.saveDetail_V3($scope.resourceURL, true).then(function(data){
					if (savedPolicyOwner && savedLifeInsured && illustrationUIService.isSuccess(data)) {
						illustrationUIService.acceptedQuotationID = illustrationUIService.findElementInDetail_V3(['DocId']);
						commonUIService.showNotifyMessage("v3.mynewworkspace.message.AcceptQuotationSuccessfully", "success");
						$scope.reSetupConcreteUiStructure(salecaseUIService.detail, undefined, true).then(function() {
							if ($scope.uiFrameworkService.isSectionLayout()) {
								$scope.moveToSection(true)
							}
						});
						
						// freeze Quotation
						illustrationUIService.freeze = true;
						//only show accept quotation for motor product
						if(salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.MOTOR){
							$scope.showAcceptActions();
						}
						/**
						 * @author ynguyen7
						 * 2016.04.22
						 * Update underwriting for Non-STP case
						 */
						if(commonService.hasValueNotEmpty(salecaseUIService.findElementInDetail_V3(['Underwriting'])['@refUid'])){
							underwritingUIService.getUnderwriting($scope.resourceURL, salecaseUIService.findElementInDetail_V3(['Underwriting'])['@refUid']).then(function(data){
								underwritingUIService.findElementInDetail_V3(['TotalPayablePremium']).$ = illustrationUIService.findElementInDetail_V3(['TotalPremium']).$;
								underwritingUIService.findElementInDetail_V3(['StampDuty']).$ = illustrationUIService.findElementInDetail_V3(['StampDuty']).$;
								underwritingUIService.findElementInDetail_V3(['TotalPremium']).$ = illustrationUIService.findElementInDetail_V3(['TotalPayable']).$;
								underwritingUIService.saveDetail_V3($scope.resourceURL, false).then(function(data){
								});
							});
						}
						
						//for RUL - Underwriter accept
						if(salecaseUIService.group === commonService.CONSTANTS.PRODUCT_GROUP.UNIT_LINK
							|| salecaseUIService.product == commonService.CONSTANTS.PRODUCT.REGULAR_UNIT_LINK
							|| salecaseUIService.product == commonService.CONSTANTS.PRODUCT.REGULAR_SAVE_LINK
							|| salecaseUIService.product === commonService.CONSTANTS.PRODUCT.ENDOWMENT) {
							if(isUnderwriterAccept) {
								
								//refresh detail - show new UQ PDF
								$scope.refreshDetail();
								
								//send notification
								var sendNotificationResourceUrl = salecaseUIService.initialMethodPortletURL(myArrayPortletId["my-new-workspace"], "sendNotificationWithEventCode");
								salecaseUIService.sendNotificationWithEventCode(sendNotificationResourceUrl, {
			        				caseId: salecaseUIService.findElementInDetail_V3(['DocId']),
			        				eventCode: "ECMNCLIFE003"
			        			}).then(function(data){
			        				$log.debug("Send notification successfully");
			        			});
							}
						}
						
					} 
					else {
						
						//for RUL
						var errorMessRul = illustrationUIService.findElementInElement_V3(data, ['error-code']);
						if((salecaseUIService.group === commonService.CONSTANTS.PRODUCT_GROUP.UNIT_LINK 
								||salecaseUIService.product == commonService.CONSTANTS.PRODUCT.REGULAR_UNIT_LINK
								||salecaseUIService.product == commonService.CONSTANTS.PRODUCT.REGULAR_SAVE_LINK
								|| salecaseUIService.product === commonService.CONSTANTS.PRODUCT.ENDOWMENT) 
							&& errorMessRul == "MSG-P101"){
							illustrationUIService.findElementInDetail_V3(['DocStatus'])['BusinessStatus'] = "DRAFT";
							commonUIService.showNotifyMessage(errorMessRul);
						}else{
							commonUIService.showNotifyMessage("v3.myworkspace.message.ComputeQuotationUnuccessfully");
							illustrationUIService.findElementInDetail_V3(['DocStatus'])['BusinessStatus'] = "DRAFT";
							illustrationUIService.findElementInDetail_V3(['DocStatus'])['DocumentStatus'] = "INVALID";
							if (illustrationUIService.findElementInDetail_V3(['Validity']) != undefined) {
								var errorMessage = illustrationUIService.findElementInDetail_V3(['Validity']).errorMessage;
								if(commonService.hasValueNotEmpty(errorMessage)) {
									commonUIService.showNotifyMessage(errorMessage);
								}
							}
						}
					}
					deferred.resolve();
				});
			    });
				});
			} else {
				commonUIService.showNotifyMessage("v3.myworkspace.message.ComputeQuotationUnuccessfully");
				if(illustrationUIService.findElementInElement_V3(data, ['ipos-response:cause']) == "VehicleNo is in blacklist"){
					illustrationUIService.findElementInDetail_V3(['BusinessStatus'])['DocumentStatus'] = "DECLINED";
					illustrationUIService.saveDetail_V3($scope.resourceURL, false).then(function(data){
						commonUIService.showNotifyMessage("v3.mynewworkspace.message.VehicleNumberIsInBlacklist");
						$scope.reSetupConcreteUiStructure(salecaseUIService.detail);
					});
				}
				deferred.resolve();
			}
		//});
		return deferred.promise;
	}

	$scope.saveInsuranceRoleAsProspect = function(insuranceRole) {
    	var deferred = illustrationUIService.$q.defer();
    	if (illustrationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.UNIT_LINK
    		|| illustrationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.TERM_LIFE
    		|| salecaseUIService.product === commonService.CONSTANTS.PRODUCT.ENDOWMENT) {
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
							|| salecaseUIService.product === commonService.CONSTANTS.PRODUCT.ENDOWMENT) {
						prospectPersonalUIService.findElementInDetail_V3(['Salutation']).$ = illustrationUIService.findElementInDetail_V3([insuranceRole,'Salutation']).$;
						prospectPersonalUIService.findElementInDetail_V3(['SuffixName']).$ = illustrationUIService.findElementInDetail_V3([insuranceRole,'SuffixName']).$;
					}
					
					prospectPersonalUIService.saveDetail_V3($scope.resourceURL, false).then(function(data) {
						if (prospectPersonalUIService.isSuccess(data)) {
							illustrationUIService.findElementInDetail_V3([insuranceRole])['@refUid'] = prospectPersonalUIService.findElementInDetail_V3(['DocId']);
							deferred.resolve(true);
						} else {
							deferred.resolve();
						}
					});
    			} else {
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
	
	$scope.unAcceptQuotation = function(){
		illustrationUIService.findElementInDetail_V3(['DocStatus'])['BusinessStatus'] = "DRAFT";
		illustrationUIService.saveDetail_V3($scope.resourceURL, false).then(function(data){
			$scope.showAcceptActions();
			// un-freeze Quotation
			illustrationUIService.acceptedQuotationID = undefined;
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
		/*
		 * PLEASE USE isQuotationValid() instead of this
		 * 
		 */
		var businessStatus = "";
		
		if(commonService.hasValueNotEmpty(illustrationUIService.detail)) {
			if(commonService.hasValue(illustrationUIService.acceptedQuotationID)) {
				businessStatus = "ACCEPTED";
			} else {
				businessStatus = illustrationUIService.findElementInDetail_V3(['DocStatus'])['BusinessStatus'];
			}
		} else {
			if (salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.MOTOR) {
				businessStatus = $scope.getCardMetadata('case-management-motor:Quotation').BusinessStatus;
			} else if (salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.FOREIGN_WORKER) {
				businessStatus = $scope.getCardMetadata('case-management-personal-accident:Step2_Quotation').BusinessStatus;
			} else if (salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.TERM_LIFE
					&& salecaseUIService.product == commonService.CONSTANTS.PRODUCT.GUARANTEED_CASHBACK){
				businessStatus = $scope.getCardMetadata('case-management-guaranteed-cashback-saver:Quotation').BusinessStatus;
			}else if(salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.FIRE) {
				var metaList = $scope.getMetadataListFromCard('case-management-fire:Step2_Quotation');
				for(var i = 0; i < metaList.length; i++) {
					if(metaList[i].BusinessStatus == 'ACCEPTED') {
						businessStatus = "ACCEPTED";
						illustrationUIService.acceptedQuotationID = metaList[i]["DocId"];
						break;
					}
				}
			}
		}
		
		if(businessStatus =="ACCEPTED") {
			if (!commonService.hasValue(salecaseUIService.findElementInDetail_V3(['DocInfo']).DocId)) {
				applicationUIService.isFirstInitialize = true;
			} else {
				applicationUIService.isFirstInitialize = false;
			}
			return true;
		} else{
			commonUIService.showNotifyMessage("v3.mynewworkspace.message.QuotationIsNotValid");
			return false;
		}
	};
	
	/**
     * @author: tphan37(concept) nle32 (implemented)
     * date: 18-Feb-2016
     * check quotation is accepted
     * @param  {String} cardName           the name of card want to get its children metadata
     * @param  {bool} isLst          true if multiple quotation
     * @returns 
     */
	$scope.isQuotationValid = function(cardName, isLst){

		var self = this;
		var valid = false;
		var validStatus = ['ACCEPTED'];//list of valid business status
		
		//if is multiple quotations
		if (isLst){
			//find metaList from cardName (this card is parent)
			var metaLst = self.getMetadataListFromCard(cardName);
			if(metaLst){
				for(var i = 0; i < metaLst.length; i++) {
					if(validStatus.indexOf(metaLst[i].BusinessStatus) !== -1) {
						illustrationUIService.acceptedQuotationID = metaLst[i]["DocId"];
						valid = true;
						break;
					}
				}
			}
			
		}else{
			var cardMetadata = $scope.getCardMetadata(cardName);
			if(cardMetadata){
				var businessStatus = cardMetadata.BusinessStatus;
				
				if(validStatus.indexOf(cardMetadata.BusinessStatus) !== -1) {
					valid = true;
				}
			}
		}		
		
		if(!valid){
			commonUIService.showNotifyMessage("MSG-C33");		
		}
		
		return valid;	
		
		
		
	};
	
	$scope.changeNameUnderwriterQuotation = function(pricingCardName) {
		var pricingCard = this.getCardDataWithName(pricingCardName);
		if (!angular.isArray(pricingCard.children) ) {
			return;
		}
		
		for (var i = 0; i < pricingCard.children.length; i++) {
			var childCard = pricingCard.children[i];
			if (childCard.cardType === commonService.CONSTANTS.CARDTYPE.TEMPLATE) {
				if ($scope.isUnderwriterQuotation(childCard)) {
					childCard.name = childCard.name.replace(':Quotation',':UnderwriterQuotation');
				}
			}
		}
	}

	$scope.isUnderwriterQuotation = function(card) {
		if (card && card.refDetail) {
			var uq = salecaseUIService.findElementInElement_V3(card.refDetail, ['@uq']);
			if (uq === 'Y') return true;
		}
		return false;
	}
	
	
	// To check Business Status of Quotation to freeze( disable all fields)
	$scope.checkQuotationStatus = function(){
		var businessStatus = "";
		
		if(commonService.hasValueNotEmpty(illustrationUIService.detail)) {
			if(commonService.hasValue(illustrationUIService.acceptedQuotationID)) {
				businessStatus = "ACCEPTED";
			} else {
				businessStatus = illustrationUIService.findElementInDetail_V3(['DocStatus'])['BusinessStatus'];
			}
		} else {
			if (salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.MOTOR) {
				businessStatus = $scope.getCardMetadata('case-management-motor:Quotation').BusinessStatus;
			} else if (salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.FOREIGN_WORKER) {
				businessStatus = $scope.getCardMetadata('case-management-personal-accident:Step2_Quotation').BusinessStatus;
			} else if(salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.FIRE) {
				var metaList = $scope.getMetadataListFromCard('case-management-fire:Step2_Quotation');
				for(var i = 0; i < metaList.length; i++) {
					if(metaList[i].BusinessStatus == 'ACCEPTED') {
						businessStatus = "ACCEPTED";
						illustrationUIService.acceptedQuotationID = metaList[i]["DocId"];
						break;
					}
				}
			}
		}
		
		if(businessStatus != "" && businessStatus!=='DRAFT' && businessStatus!== 'NEW'){
			illustrationUIService.freeze = true;
		}else{
			illustrationUIService.freeze = false;
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
			$scope.uWCard = 'case-management-motor:Step7_MaintainEcover';
		}else{
			$scope.uWCard = 'case-management-motor:Step6_MaintainEcover';
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
					commonUIService.showNotifyMessage("v3.mynewworkspace.message.lastestEcoverNoteAddendumIn" + " " + ecovernoteUIService.findElementInElement_V3(data, ['BusinessStatus']), "success");
					$scope.setVisibleActionCards($scope.uWCard, false);
//					if (ecovernoteUIService.findElementInElement_V3(data, ['BusinessStatus'])!= "DRAFT") $scope.setVisibleActionCards()
				}
			});
		}
	};
	
	$scope.checkUnderwritingIsReady = function(){
		var underwritingDocID = salecaseUIService.findElementInDetail_V3(['Underwriting'])['@refUid'];
		if(!commonService.hasValue(underwritingDocID)) {
			commonUIService.showNotifyMessage("v3.mynewworkspace.message.UnderwritingIsNotReady");
			return false;
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
	

	
	/* End Review & Accept Quotation*/
	$scope.checkManager = function(){
		if($scope.isManager != true) {
			return false;
		} 
	};
	
	$scope.loadUserProfileData = function() {
		var resourceURL = illustrationUIService.initialMethodPortletURL($scope.portletId,"loadPersonalProfileDoc");
		resourceURL = resourceURL.toString();
		$http.get(resourceURL).success(function(result){
			//salecaseUIService.userDoc = result;
			$scope.isManager  = true;
		});
		

    };
    $scope.loadUserProfileData();
    
    $scope.closeFileUploadDS = function() {
    	$scope.isUploadDS=false;
    }
    
    $scope.getTransactionFile = function(selectTab) {
    	$scope.isUploadDS=true;
    	$scope.selectTab = selectTab;
    	$scope.transactionList =  [];
    	var counter = salecaseUIService.findElementInDetail_V3(['Prints', '@counter']);
		if(counter != 0) {
	    	var transactionLists = [].concat(salecaseUIService.findElementInDetail_V3(['Prints', 'Print']));   	
	    	for(var i = 0; i< transactionLists.length; i++){
	        	prospectPersonalUIService.findMetadata_V3("", transactionLists[i]['@refResourceUid']).then(function(data){
	    			var temp = prospectPersonalUIService.findElementInElement_V3(data, ['MetadataDocument']);
	    			if(commonService.hasValueNotEmpty(temp)){
	    				if (!$.isArray(temp)){									
	    					$scope.transactionList.push(temp);				
	    				}			
	    			}
	    		});
	    	}
    	}
	};		
	
	// get Payment detail
	/*$scope.getPaymentDetail = function(){
		var paymentUid = salecaseUIService.findElementInDetail_V3(['Payment'])['@refUid'];
        if(paymentUid!='' && paymentUid!=undefined){
        	paymentUIService.findDocument_V3($scope.resourceURL, paymentUid).then(function(data) {
        		salecaseUIService.payment = data;
        		return true;
        	});
        }
        else{
			commonUIService.showNotifyMessage("Payment is not ready!!!");
			return false;
        }
	};*/
	
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
//		if(salecaseUIService.product == 'group-travel-express') {salecaseUIService.product = 'travel-express';} //because don't have doc lazylist for group-travel
		if(!commonService.hasValueNotEmpty(underwritingUIService.lazyChoiceListByProduct[salecaseUIService.product])){
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
	
	$scope.archiveSalecase = function() {
		var docId = salecaseUIService.findElementInDetail_V3(["DocId"]);
		salecaseUIService.archiveDocument_V3($scope.resourceURL, docId).then(function(data){
			if(data['ipos-container:map-list']){
				commonUIService.showNotifyMessage("new.v3.mynewworkspace.message.ArchiveSuccessfully","success");
				location.reload(true);
			}
			else{
				commonUIService.showNotifyMessage("new.v3.mynewworkspace.message.ArchiveUnsuccessfully");
			}
		});
	};
	
	$scope.toggleStarSalecase = function() {
		var docId = salecaseUIService.findElementInDetail_V3(["DocId"]);
		if (salecaseUIService.findElementInDetail_V3(['Star']) == '') {
			salecaseUIService.starDocument_V3($scope.resourceURL, docId).then(function(data){
				if(salecaseUIService.isSuccess(data)){
					commonUIService.showNotifyMessage("new.v3.mynewworkspace.message.StarSuccessfully", "success");
					salecaseUIService.findElementInDetail_V3(['Header'])['DocInfo']['Star'] = salecaseUIService.findElementInElement_V3(data, ['Star']);
				} else {
					commonUIService.showNotifyMessage("new.v3.mynewworkspace.message.StarUnsuccessfully");
				}
			});
		} else {
			salecaseUIService.unStarDocument_V3($scope.resourceURL, docId).then(function(data){
				if(salecaseUIService.isSuccess(data)){
					commonUIService.showNotifyMessage("new.v3.mynewworkspace.message.UnStarSuccessfully", "success");
					salecaseUIService.findElementInDetail_V3(['Header'])['DocInfo']['Star'] = salecaseUIService.findElementInElement_V3(data, ['Star']);
				} else {
					commonUIService.showNotifyMessage("new.v3.mynewworkspace.message.UnStarUnsuccessfully");
				}
			});
		}
	}

	// For demo Import Quotation
	$scope.addNewQuotation = function addNewQuotation(card){
		var self = this;
		self.addCard(card, function addedChildEle (addedEle) {
			self.closeChildCards(0);
     		self.setVisibleCard("case-management-motor:Quotations", false);
     		self.setVisibleCard("case-management-motor:Quotation", true);
     		self.moveToCard("case-management-motor:Quotation");
		});
	};
	
	$scope.updateCaseFromQuotation = function updateCaseFromQuotation(){
		var self = this;
		if(!commonService.hasValueNotEmpty(salecaseUIService.findElementInDetail_V3(['ManagerReview', '@refUid']))){
			if(illustrationUIService.findElementInDetail_V3(['DocStatus','BusinessStatus']) == "ACCEPTED"){
				salecaseUIService.findElementInDetail_V3(['DocStatus'])['BusinessStatus'] = "ACCEPTED QUOTATION";
			}else{
				salecaseUIService.findElementInDetail_V3(['DocStatus'])['BusinessStatus'] = "DRAFT QUOTATION";
			};
			$scope.saveDetail();
		}
	};
	
	$scope.showAcceptQuotionButton = false;
	$scope.showAcceptQuotion = function(toggle){
		$scope.showAcceptQuotionButton = toggle;
	};
	
	//refresh list attachment for MNC RUL
	$scope.refreshAttachDocument_RUL = function refreshAttachDocument_RUL(){
		if ((salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.UNIT_LINK
				||salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.UNIT_LINK
				|| salecaseUIService.product === commonService.CONSTANTS.PRODUCT.ENDOWMENT)
				&& salecaseUIService.detail) {
			$scope.reSetupConcreteUiStructure(salecaseUIService.detail, undefined, true);
		}
	}
	
	//Underwriting for Direct Sale (client)
	$scope.counterOfferUnderwritingForClientDS = function(action) {
		underwritingUIService.saveDetail_V3($scope.resourceURL, false).then(function(result){
			var docId = underwritingUIService.findElementInDetail_V3(['DocId']);
			var dataSet = underwritingUIService.detail;
			var product = underwritingUIService.productName;
			if (action == 'reject-offer') {
				product = "";
			}
			underwritingUIService.doUnderwritingDS($scope.resourceURL, docId, action, product).then(function(data){
				if (underwritingUIService.isSuccess(data)){
					if(action == 'accept-offer'){
						var status = underwritingUIService.findElementInDetail_V3(['DocStatus'])['BusinessStatus']; 
						if(status == 'ACCEPT-COUNTER-OFFERED') {
							$scope.refreshDetail();
							commonUIService.showNotifyMessage("v3.mynewworkspace.message.AcceptCounterOfferUnderwritingSuccessfully", "success");
							if ($scope.uiFrameworkService.isSectionLayout()) {
								$scope.moveToSection(true)
							}
						}
					}
					if(action == 'reject-offer'){
						var status = underwritingUIService.findElementInDetail_V3(['DocStatus'])['BusinessStatus']; 
						if(status == 'REJECT-COUNTER-OFFERED') {
							commonUIService.showNotifyMessage("v3.mynewworkspace.message.RejectCounterOfferUnderwritingSuccessfully", "success");
						}
					}
				}
				else{
					if(action == 'accept-offer'){
						commonUIService.showNotifyMessage("v3.mynewworkspace.message.AcceptCounterOfferUnderwritingUnsuccessfully");						
					}
					if(action == 'reject-offer'){
						commonUIService.showNotifyMessage("v3.mynewworkspace.message.RejectCounterOfferUnderwritingUnsuccessfully");
					}
				}
					
			}); 
		});
	};

	
	//start for MNC Link
	//check if the madatory document is signed - MNC Link
	$scope.checkSignedDocument = function(){
		var isValid = false;
		if (salecaseUIService.product == commonService.CONSTANTS.PRODUCT.REGULAR_UNIT_LINK ||
			salecaseUIService.product == commonService.CONSTANTS.PRODUCT.REGULAR_SAVE_LINK ||	
			salecaseUIService.product == commonService.CONSTANTS.PRODUCT.ENDOWMENT) {
			var listAllTransactionDoucument = $scope.moduleService.convertToArray($scope.moduleService.findElementInDetail_V3(["Print"]));
			for(var i=0; i<listAllTransactionDoucument.length; i++){
				var resourceType = $scope.moduleService.findElementInElement_V3(listAllTransactionDoucument[i], ["ResourceType"]).$;
				//PT05 is Underwriting Quotation, do not check sign Underwriting Quotation to show UW Tile
				if($scope.moduleService.findElementInElement_V3(listAllTransactionDoucument[i], ["IsSign"]).$ == "Y" && resourceType != "PT05"){
					if($scope.moduleService.findElementInElement_V3(listAllTransactionDoucument[i], ["Signed"]).$ == "N"){
						isValid = false;
						break;
					}
				}
				isValid = true;
			}
		}
		
		$scope.isShowUnderwriting = isValid;
	}
	
	//return document e-signed status
	$scope.showValidStatusOfSignedDoc = function(card){
		var cardDetail = card.refDetail;
		var isSignDoc = $scope.moduleService.findElementInElement_V3(cardDetail, ["IsSign"]).$;
		var isSignedDoc = $scope.moduleService.findElementInElement_V3(cardDetail, ["Signed"]).$;
		
		var cssClass = "";
		if (isSignDoc == "Y") {
			cssClass = "v3-card-icon-plus fa fa-pencil";
			if (isSignedDoc == "N"){
				cssClass += " v3-resource-file-not-signed";
			}
		}
		return cssClass;
	}
	$scope.openPreviewPDF = function (doctype, action){
	     $scope.previousLanguage = $translate.use();
	     $translatePartialLoader.addPart('translation');
         $translate.refresh();
         $translate.use('id');

         $scope.isShowPreviewPDF = true;
         $scope.openPreviewPDFDoctype = doctype;
         $scope.openPreviewPDFAction = action;
         $scope.contextPathRoot = "file:///data/data/com.csc.integralpos.app/files/exports/www/";
         $scope.tittle =  "v3.mynewworkspace.direct-sale.popup-documentcenter.label.DocumentCenter";
         $scope.previewFilePath = doctype+ "_"+ salecaseUIService.product + "/" + action +".html";
         $scope.pathImage= contextPathRoot + 'view/myNewWorkspace/template/pdfTemplates/' + doctype+ "_"+ salecaseUIService.product +"/images/";
         previewPdfZoom = 1;
         $("#previewPDFContent").css("zoom",previewPdfZoom);
     }

     $scope.closePreviewPDF = function (){
        $translatePartialLoader.addPart('translation');
        $translate.refresh();
        $translate.use($scope.previousLanguage);

        $scope.isShowPreviewPDF = false;
        previewPdfZoom = 1;
     }
     $scope.downloadPreviewPDF = function(){
        $scope.closePreviewPDF();
        if($scope.openPreviewPDFDoctype == "illustration"){
            $scope.$broadcast('printPreviewPDFByHtmlIllustration', $scope.openPreviewPDFAction, 'download');
        }
        if($scope.openPreviewPDFDoctype == "application"){
            $scope.$broadcast('printPreviewPDFByHtmlApplication', $scope.openPreviewPDFAction, 'download');
        }
     }
       // hle56: use for preview pdf by html
     var previewPdfWidth = 0;
     var previewPdfHeight = 0;
     var previewPdfZoom = 1;
     $scope.zoomIn = function (){
        if(previewPdfZoom == 1){
           previewPdfWidth = $("#previewPDFContent").css("width").replace("px","");
           previewPdfHeight = $("#previewPDFContent").css("height").replace("px","");
        }
        previewPdfZoom+=0.2;
        $("#previewPDFContent").css("width",previewPdfWidth*previewPdfZoom);
        $("#previewPDFContent").css("height",previewPdfHeight*previewPdfZoom);
        $("#previewPDFContent").css("zoom",previewPdfZoom);
     }

     $scope.zoomOut = function (){
        if(previewPdfZoom == 1){
           previewPdfWidth = $("#previewPDFContent").css("width").replace("px","");
           previewPdfHeight = $("#previewPDFContent").css("height").replace("px","");
        }
        previewPdfZoom-=0.2;
        $("#previewPDFContent").css("width",previewPdfWidth*previewPdfZoom);
        $("#previewPDFContent").css("height",previewPdfHeight*previewPdfZoom);
        $("#previewPDFContent").css("zoom",previewPdfZoom);
     }
	//end for MNC Link
}];

// var CreateCaseCtrl = ['$scope', '$log', '$state', '$timeout', 'commonService', 'commonUIService', 'salecaseUIService', 'illustrationUIService', '$translate', '$translatePartialLoader',
// 	function($scope, $log, $state, $timeout, commonService, commonUIService, salecaseUIService, illustrationUIService, $translate, $translatePartialLoader) {
	
// 	$scope.showProduct = true;
// 	$scope.products =  [
// 	  {
// 	     "name": "FIR",
// 	     "isVisible": true,
// 	     "level": 0,
// 	     "icon": {"main" : "fa fa-fire"} ,
//          "view":{
//             "icons": []
//          },
//          "permission":{
//             "openable": true
//          },
// 	     "cssClass":"v3-box-4"
// 	  },
// 	  {
// 	     "name": "motor-private-car-m-as",
// 	     "isVisible": true,
// 	     "level": 0,
// 	     "icon": {"main" : "fa fa-car"},
//          "view":{
//             "icons": []
//          },
//          "permission":{
//             "openable": true
//          },
// 	     "cssClass":"v3-box-4"
// 	  },
// //	  {
// //	     "name": "motor-private-car-m-ds",
// //	     "isVisible": true,
// //	     "level": 0,
// //	     "icon": {"main" : "fa fa-car"},
// //	     "cssClass":"v3-box-4"
// //	  },
// 	  {
// 		 "name": "term-life-protect-as",
// 	     "isVisible": true,
// 		 "level": 0,
// 		 "icon": {"main" : "fa fa-umbrella"},
//          "view":{
//             "icons": []
//          },
//          "permission":{
//             "openable": true
//          },
// 		 "cssClass":"v3-box-4"
// 	  },
// //	  {
// //		 "name": "term-life-protect-ds",
// //	     "isVisible": true,
// //		 "level": 0,
// //		 "icon": {"main" : "fa fa-heart"},
// //		 "cssClass":"v3-box-4"
// //	  },
// 	  {
// 		 "name": "personal-accident",
// 		 "isVisible": true,
// 		 "level": 0,
// 		 "icon": {"main" : "fa fa-ambulance"},
//          "view":{
//             "icons": []
//          },
//          "permission":{
//             "openable": true
//          },
// 		 "cssClass":"v3-box-4"
// 	  },
// 	  {
// 		 "name": "income-protection",
// 		 "isVisible": true,
// 		 "level": 0,
// 		 "icon": {"main" : "fa fa-shield"},
//          "view":{
//             "icons": []
//          },
//          "permission":{
//             "openable": true
//          },
// 		 "cssClass":"v3-box-4"
// 	  },
// 	  {
// 		"name": "guaranteed-cashback-saver",
// 		"isVisible": true,
// 		"level": 0,
// 		"icon": {"main" : "fa fa-money"},
// 		"view":{
// 		  "icons": []
// 		},
//         "permission":{
//             "openable": true
//         },
// 		"cssClass":"v3-box-4"
// 	  },
// 	  {
// 		 "name": "GTL1",
// 		 "isVisible": true,
// 		 "level": 0,
// 		 "icon": {"main" : "fa fa-users"},
// 		 "view":{
// 			 "icons": []
// 		  },
//          "permission":{
//             "openable": true
//          },
// 		 "cssClass":"v3-box-4"
// 	  }
// 	  ,
// 	  {
// 		 "name": "term-life-secure",
// 		 "isVisible": true,
// 		 "level": 0,
// 		 "icon": {"main" : "fa fa-umbrella"},
// 		 "view":{
// 			 "icons": []
// 		  },
//          "permission":{
//             "openable": true
//          },
// 		 "cssClass":"v3-box-4"
// 	  }
// 	];
	
// 	//Check tour user Guide list for first time access to this portlet     
//     $timeout(function() {
//     	 $scope.moduleProspectPersonalService.tourGuideFirstLoginForUser("productList", $scope.portletId);
//     }, 1000);
    
// 	$scope.createCase = function(product){
									 		 			
//     	var self = this;
//     	salecaseUIService.product = product;
//     	salecaseUIService.group = salecaseUIService.getProductGroup_V3(salecaseUIService.product);
//     	$scope.showProduct = false;
//     	$('#product-detail').fadeIn(500);
//     	// get json data 
//     	// salecaseUIService.initializeObject_V3($scope.resourceURL,'case-management',salecaseUIService.product,'NewBusiness').then(function(data){
//       //  		// $scope.init();
// 			// salecaseUIService.detail['IposDocument']['Header']['DocInfo']['DocName'] = salecaseUIService.genDefaultName();
// 			// salecaseUIService.findElementInDetail_V3(['CaseManagement'])['@case-name']='NewBusiness';
// 			// salecaseUIService.group = salecaseUIService.getProductGroup_V3(salecaseUIService.product);
// 			// if(salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.MOTOR){
// 			// 	salecaseUIService.cloneProspect = angular.copy(salecaseUIService.findElementInDetail_V3(['Prospect']));
// 			// 	//salecaseUIService.findElementInDetail_V3(['Prospects'])['Prospect'] = [];
// 			// 	/*if(!$.isArray(salecaseUIService.findElementInDetail_V3(['Prints','Print']))){
// 			// 		salecaseUIService.convertJsonPathToArray(salecaseUIService.detail,'case-management-motor:Prints', 'case-management-motor:Print');
// 			// 	}*/
// 			// }
// 			// else if(salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.TERM_LIFE){
// 			// 	/*$rootScope.cloneProspect = angular.copy(salecaseUIService.findElementInDetail_V3(['NewBusiness','Doctypes','Prospects','Prospect']));
// 			// salecaseUIService.findElementInDetail_V3(['NewBusiness','Doctypes','Prospects'])['case-management-term-life:Prospect'] = [];
// 			// if(!$.isArray(salecaseUIService.findElementInDetail_V3(['NewBusiness','Prints','Print']))){
// 			// 	salecaseUIService.convertJsonPathToArray(salecaseUIService.detail,'case-management-term-life:NewBusiness.case-management-term-life:Prints', 'case-management-term-life:Print');
// 			// }*/
// 			// }
// 			// $scope.saveDetail();
//    //  	});
    	
//     	// Show current doctype for navigation bar
//         $("#navCurrentDocType").html($translate.instant('v3.navigation.label.docType.case-management'));
//     	self.createNewDocument(salecaseUIService.name, salecaseUIService.product, 'NewBusiness', 'NewBusiness');
//     };
    
    
//     //auto create case when move from another portlet
//     var gotoPortletAction = JSON.parse(localStorage.getItem('gotoPortletAction'));
//     if(gotoPortletAction && gotoPortletAction.actionName == "createCase"){
//     	localStorage.removeItem('gotoPortletAction');
//     	$scope.createCase(gotoPortletAction.actionParam);
//     };
// }];

var ListImportProspect = ['$scope', '$log', 'prospectPersonalUIService', 'salecaseUIService', 'commonUIService', 'commonService', 'uiRenderPrototypeService',
	function($scope, $log, prospectPersonalUIService, salecaseUIService, commonUIService, commonService, uiRenderPrototypeService) {
	
	$scope.getProspectList = function() {
		prospectPersonalUIService.getDocumentList_V3($scope.resourceURL).then(function(data){
			$scope.prospectList = prospectPersonalUIService.findElementInElement_V3(data, ['MetadataDocument']);
			if(commonService.hasValueNotEmpty($scope.prospectList)){
				if (!$.isArray($scope.prospectList)){
					var temp = $scope.prospectList;
					$scope.prospectList = [];
					$scope.prospectList.push(temp);
				}
				
				$scope.listProspectLimit = 12;
				
				$scope.increase = function(){
					$scope.listProspectLimit = $scope.listProspectLimit + 4;
				};
			}else{
				$scope.msg = 'There is no data.';
			};
		});
	};
	
	$scope.getProspectList();
	
	$scope.importProspect = function(card, metadata, $event) {
		var self = this;
		
		var prospectId = metadata.DocId;
		var prospectName = metadata.FullName;
		
		var prospect = self.moduleService.findElementInDetail_V3(['Prospect']);
		var error = false;
		
		if (self.moduleService.findElementInDetail_V3(['Prospects'])['@counter'] === self.moduleService.findElementInDetail_V3(['Prospects'])['@maxOccurs']) {
			commonUIService.showNotifyMessage("v3.mynewworkspace.message.CannotImportMoreProspect");
			error = true;
		} else {
			for (var i = 0; i < prospect.length; i++) {
				if (self.moduleService.findElementInElement_V3(prospect[i], ['ProspectId']).$ == prospectId) {
					commonUIService.showNotifyMessage("v3.mynewworkspace.message.CannotImportDuplicateProspect");
					error = true;
					break;
				}
			}
		}

		if (!error) {
			self.card = card;
			self.addCard(card, function addedChildEle (addedEle) {
				//bind refId here
				addedEle['@refUid'] = prospectId;
				self.moduleService.findElementInElement_V3(addedEle, ['ProspectId']).$ = prospectId;
				
				if(salecaseUIService.group){
					if(salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.TERM_LIFE
							&& (commonService.hasValueNotEmpty(salecaseUIService.product) && salecaseUIService.product != commonService.CONSTANTS.PRODUCT.REGULAR_UNIT_LINK
									&& salecaseUIService.product != commonService.CONSTANTS.PRODUCT.REGULAR_SAVE_LINK)
							|| (commonService.hasValueNotEmpty(salecaseUIService.findElementInDetail_V3(['Prospect', 'Type'])) && salecaseUIService.findElementInDetail_V3(['Prospect', 'Type']).Value == 'BENEFICIARY')
					){
						self.moduleService.findElementInElement_V3(addedEle, ['ProspectName']).$ = prospectName;
					}
				}
				
				
				//add preview for card just added
				//TODO: remove this variable in future
                //For now it will prevent the case got automatic saved when moving to other document (after importing prospect)
				salecaseUIService.saveDetail_V3($scope.resourceURL, false).then(function(data){
                    card.root.isDetailChanged = false;
                    card.isDetailChanged = false;

					$log.debug("Case has been saved");
					commonUIService.showNotifyMessage("v3.mynewworkspace.message.ImportProspectSuccessfully", "success");
					self.closeChildCards(1, $event);
					$log.debug(self.moduleService.detail);
				});
			});
		};
	};
	
}];


var ListImportBeneficiary = ['$scope', '$log', 'prospectPersonalUIService', 'salecaseUIService', 'commonUIService', 'commonService', 'uiRenderPrototypeService',
   	function($scope, $log, prospectPersonalUIService, salecaseUIService, commonUIService, commonService, uiRenderPrototypeService) {
   	
   	$scope.getBeneficiaryList = function() {
   		prospectPersonalUIService.getDocumentList_V3($scope.resourceURL).then(function(data){
   			$scope.beneficiaryList = prospectPersonalUIService.findElementInElement_V3(data, ['MetadataDocument']);
   			if(commonService.hasValueNotEmpty($scope.beneficiaryList)){
   				if (!$.isArray($scope.beneficiaryList)){
   					var temp = $scope.beneficiaryList;
   					$scope.beneficiaryList = [];
   					$scope.beneficiaryList.push(temp);
   				}
   				
   				$scope.listbeneficiaryLimit = 12;
   				
   				$scope.increase = function(){
   					$scope.listbeneficiaryLimit = $scope.listbeneficiaryLimit + 4;
   				};
   			}else{
   				$scope.msg = $translate.instant('new.v3.common.message.ThereIsNoData'); 
   			};
   		});
   	};
   	
   	$scope.getBeneficiaryList();
   	
   	$scope.importBeneficiary = function(card, metadata, $event) {
   		var self = this;
   		self.metadata = metadata;
   		
   		var beneficiaryId = metadata.DocId;
   		var beneficiaryName = metadata.FullName;
   		
   		var beneficiary = self.moduleService.findElementInDetail_V3(['BeneficiaryItem']);
   		var error = false;
   		
   		if (self.moduleService.findElementInDetail_V3(['BeneficiaryDetails'])['@counter'] === self.moduleService.findElementInDetail_V3(['BeneficiaryDetails'])['@maxOccurs']) {
   			commonUIService.showNotifyMessage("v3.mynewworkspace.message.CannotImportMoreBeneficiary");
   			error = true;
   		} 
   		else {
   			for (var i = 0; i < beneficiary.length; i++) {
   				if (beneficiary[i]['@refUid'] == beneficiaryId) {
   					commonUIService.showNotifyMessage("v3.mynewworkspace.message.CannotImportDuplicateBeneficiary");
   					error = true;
   					break;
   				}
   			}
   		}

   		if (!error) {
   			self.card = card;
   			self.addCard(card, function addedChildEle (addedEle) {
   				// Endowment - update BeneficiaryDetailsNumber for each item in list when add an item
   				if (salecaseUIService.findElementInDetail_V3(["Product"]) == commonService.CONSTANTS.PRODUCT.ENDOWMENT) {
   					var counter = self.moduleService.findElementInDetail_V3(['BeneficiaryDetails'])['@counter'];
   			    	var beneficiaryItems = self.moduleService.findElementInDetail_V3(['BeneficiaryItem']);
   			    	for (var i = 0; i < counter; i++) {
   			    		self.moduleService.findElementInElement_V3(beneficiaryItems[i], ['BeneficiaryDetailsNumber']).$ = i + 1;
   			    	}
   				}
   				addedEle['@refUid'] = self.metadata.DocId;
   				self.moduleService.findElementInElement_V3(addedEle, ['BeneficiaryDetailsName']).$ = self.metadata.FullName;
   				self.moduleService.findElementInElement_V3(addedEle, ['BeneficiaryDetailsGender']).Value = self.metadata.Gender;
   				self.moduleService.findElementInElement_V3(addedEle, ['BeneficiaryDetailsDateOfBirth']).$ = self.metadata.BirthDate;
   				commonUIService.showNotifyMessage("v3.mynewworkspace.message.ImportBeneficiarySuccessfully", "success");
				self.closeChildCards(2, $event);
   			});
   		};
   	};
 }];


var ListImportQuotation = ['$scope', '$log', 'illustrationUIService', 'salecaseUIService', 'commonUIService', 'commonService', 'prospectPersonalUIService', '$mdDialog',
	function($scope, $log, illustrationUIService, salecaseUIService, commonUIService, commonService, prospectPersonalUIService, $mdDialog) {
	
	$scope.getQuotationListMotor = function() {
		illustrationUIService.getDocumentList_V3($scope.resourceURL).then(function(data){
			var quotations = illustrationUIService.findElementInElement_V3(data, ['MetadataDocument']);
			if(commonService.hasValueNotEmpty(quotations)){
				$scope.quotationList = [];

                //convert to array if 'quotations' has 1 element
				if (!Array.isArray(quotations)){
					var temp = quotations;
					var quotations = [];
					quotations.push(temp);
				}
				
				for (var i = 0; i < quotations.length; i++) {
                    if(quotations[i]["ProductName"] === salecaseUIService.product && quotations[i]["CaseID"] == '') {					   
						$scope.quotationList.push(quotations[i]);
					}
				}
				
				$scope.listQuotationLimit = 12;
				
				$scope.increase = function(){
					$scope.listQuotationLimit = $scope.listQuotationLimit + 4;
				};
			}else{
				$scope.msg = 'There is no data.';
			}
		});
	};

    $scope.getQuotationListTLS = function() {
        var self = this;
        var prospectsEle = salecaseUIService.findElementInDetail_V3(['Doctypes', 'Prospects', 'Prospect']);
        
        //we find the metadata of first prospect (the policy owner)
        salecaseUIService.findMetadata_V3($scope.resourceURL, prospectsEle[0]['@refUid']).then(function(proposerMetaLs){

            self.proposerMeta = salecaseUIService.findElementInElement_V3(proposerMetaLs, ['MetadataDocument']);
            
            //find the quotations satisfied:
            //- have the same product
            //- case Id is empty (haven't imported to case yet)
            //- policyOwner uid is CompanionId of proposer metadata 
            var EQKeyAndValue = [
                {
                    "key": "Product",
                    "value": salecaseUIService.product
                },
                {
                    "key": "CaseID",
                    "value": ""
                }
            ];        
            var NEKeyAndValue = [];

            var searchParams = illustrationUIService.createSearchDatasetWithEQAndNE(EQKeyAndValue, NEKeyAndValue);
            illustrationUIService.searchAdvanceMetadata($scope.resourceURL, searchParams).then(function(data){
                if(commonService.hasValueNotEmpty(data)){
                    $scope.quotationList = data.filter(function(illMeta) {
                        return self.proposerMeta['DocId'] === illMeta['PolicyOwnerId'] ||
                            self.proposerMeta['CompanionId'] === illMeta['PolicyOwnerId'];
                    });

                    $scope.listQuotationLimit = 12;
                    
                    $scope.increase = function(){
                        $scope.listQuotationLimit = $scope.listQuotationLimit + 4;
                    };
                }else{
                    $scope.msg = 'There is no data.';
                }
            });         
        });
    };



	($scope.getQuotationList = function(self) {
        var currProductInfor = self.getCurrProductInfor();

        if (currProductInfor.refDocType.indexOf('motor-private-car-m-as') !== -1) {
            self.getQuotationListMotor();
        }
        else if (currProductInfor.refDocType.indexOf('term-life-secure') !== -1){            
            self.getQuotationListTLS();
        }
    })($scope);
	
    //old function for import quotation from iOS (motor-as product)
	$scope.importQuotationMotor = function(card, metadata, $event) {
		var self = this;
		var quotationId = metadata.DocId;
		
		var confirm = $mdDialog.confirm()
	        .title($filter('translate')("v3.mynewworkspace.message.DoYouWantToCreateNewProspectFromThisQuotation"))
	        .ok($filter('translate')("v3.yesno.enum.Y"))
	        .cancel($filter('translate')("v3.yesno.enum.N"));
		
		$mdDialog.show(confirm).then(function() {
			$scope.createProspectFromQuotation(quotationId).then(function(){
				addQuotationcard();
			});
		}, function() {
			addQuotationcard();
		});
		
		function addQuotationcard() {
			self.addCard(card, function addedChildEle (addedEle) {
				salecaseUIService.findElementInDetail_V3(['Quotation'])['@refUid'] = quotationId;
				salecaseUIService.findElementInDetail_V3(['QuotationId']).$ = quotationId;
				salecaseUIService.saveDetail_V3($scope.resourceURL, false).then(function(data){
					commonUIService.showNotifyMessage("v3.mynewworkspace.message.ImportQuotationSuccessfully", "success");
					self.closeChildCards(0);
					self.setVisibleCard("case-management-motor:Quotations", false);
					self.setVisibleCard("case-management-motor:Quotation", true);
					self.moveToCard("case-management-motor:Quotation");
				});
			});
		}
	};


    $scope.createProspectFromQuotation = function(quotationId) {
        var deferred = illustrationUIService.$q.defer();
        var self = this;
        illustrationUIService.findDocument_V3($scope.resourceURL, quotationId).then(function(data){
            var product = illustrationUIService.findElementInDetail_V3(["Product"]);
            var prospect = undefined;
            if(product == 'motor-private-car-m-as') {
                prospect =  illustrationUIService.findElementInDetail_V3(["MainDriver"]);
            }
             
            if(prospect != undefined) {
                prospectPersonalUIService.initializeObject_V3($scope.resourceURL).then(function(newProspect) {
                    var prospectEle = prospectPersonalUIService.findElementInDetail_V3(['Personal']);
                    for(var prop in prospectEle) {
                        if(prop.indexOf("person:") != -1) {
                            prop = (prop.split(":"))[1];
                            var propValue = illustrationUIService.findElementInElement_V3(prospect, [prop]);
                            if(propValue != undefined) {
                                if(propValue.Value != undefined){
                                    prospectPersonalUIService.findElementInDetail_V3([prop]).Value = propValue.Value;
                                } else if(propValue.$ != undefined){
                                    prospectPersonalUIService.findElementInDetail_V3([prop]).$ = propValue.$;
                                }
                            }
                        }
                    };
                    
                    prospectPersonalUIService.findElementInDetail_V3(['IDType']).Value = illustrationUIService.findElementInElement_V3(prospect, ['IDType']).Value;
                    prospectPersonalUIService.findElementInDetail_V3(['IDNumber']).$ = illustrationUIService.findElementInElement_V3(prospect, ['IDNumber']).$;
                    prospectPersonalUIService.findElementInDetail_V3(['FullName']).$ = illustrationUIService.findElementInElement_V3(prospect, ['FullName']).$;
                    
                    prospectPersonalUIService.saveDetail_V3($scope.resourceURL, true).then(function(data) {
                        if (prospectPersonalUIService.isSuccess(data)) {
                            
                            // Add card prospect and set prospectId to salecase
                            var cardProspect = self.getCardDataWithName('case-management-motor:Step1_ProspectClient');
                            self.addCard(cardProspect, function addedChildEle (addedEle) {
                                var prospectId = prospectPersonalUIService.findElementInDetail_V3(['DocId']);
                                addedEle['@refUid'] = prospectId;
                                self.moduleService.findElementInElement_V3(addedEle, ['ProspectId']).$ = prospectId;
                                
                                salecaseUIService.saveDetail_V3($scope.resourceURL, false).then(function(data){
                                    commonUIService.showNotifyMessage("v3.mynewworkspace.message.ImportProspectSuccessfully", "success");
                                    illustrationUIService.detail = undefined;
                                    deferred.resolve();
                                });
                            });
                        }
                        else{
                            illustrationUIService.detail = undefined;
                            commonUIService.showNotifyMessage("v3.mynewworkspace.message.CreateProspectUnsuccessfully");
                            deferred.resolve();
                        }
                    });
                });
            } else deferred.resolve();
        });
        return deferred.promise;
    };

    /**
     * get uid of prospect with a given companionUid
     * @param  {string} companionUid id of prospect in iOS system
     * @return {Promise}              angular promise object
     */
    $scope.getCorrectProspectUid = function(companionUid) {
        var defer = salecaseUIService.$q.defer();
        var EQKeyAndValue = [
            {
                "key": "CompanionId",
                "value": companionUid
            }
        ];        
        var NEKeyAndValue = [];

        var searchParams = prospectPersonalUIService.createSearchDatasetWithEQAndNE(EQKeyAndValue, NEKeyAndValue);
        prospectPersonalUIService.searchAdvanceMetadata($scope.resourceURL, searchParams).then(function(data){
            var docId = prospectPersonalUIService.findElementInElement_V3(data, ['DocId']);

            //if can't find new docId, use the old one
            docId = docId ? docId : companionUid;
            defer.resolve(docId);
        });

        return defer.promise;
    };

    $scope.correctLifeInsuredUid = function(companionUid, newDocId) {
        var self = this;
        var defer = salecaseUIService.$q.defer();
        var lifeInsuredEle = illustrationUIService.findElementInDetail_V3(['LifeInsuredInformation']);

        //if life insured & proposer is the same, change life insured uid
        if (lifeInsuredEle['@refUid'] === companionUid){
            lifeInsuredEle['@refUid'] = newDocId;
            defer.resolve();
        }
        //if not, mean life insured and proposer isn't the same, we need to correct the lifeInsured Uid
        else{
            self.getCorrectProspectUid(lifeInsuredEle['@refUid']).then(function(correctId) {
                lifeInsuredEle['@refUid'] = correctId;
                defer.resolve();
            });
        }

        return defer.promise;
    };

    //import illustration 'Term-life-secure' from iOS
    $scope.importQuotationTLS = function importQuotationTLS(card, metadata, $event) {
        var self = this;
        var quotationId = metadata.DocId;
        var prospectCompanionId = self.proposerMeta['CompanionId'];
        var prospectUid = self.proposerMeta['DocId'];

        //we add a new illustration card on screen
        self.addCard(card, function addedChildEle (newQuotationEle) {
            //set values to new illustration element which has just been added to case document
            newQuotationEle['@refUid'] = quotationId;
            salecaseUIService.findElementInElement_V3(newQuotationEle, ['QuotationId']).$ = quotationId;

            //we load the illustration detail to correct its information
            illustrationUIService.findDocument_V3($scope.resourceURL, quotationId)
            .then(function(illDoc) {
                //correct the uid for 'policyOwner'
                illustrationUIService.findElementInDetail_V3(['PolicyOwnerInformation'])['@refUid'] = prospectUid;

                //corret the life insured doc uid
                return self.correctLifeInsuredUid(prospectCompanionId, prospectUid)
            })
            .then(function (){            	
                //set case-id to illustration doc
                illustrationUIService.findElementInDetail_V3(['CaseID']).$ = salecaseUIService.findElementInDetail_V3(['Header', 'DocId']);
                
                //save illustration
                return illustrationUIService.saveDetail_V3($scope.resourceURL, false);
            })
            .then(function() {
                 //save case
                return salecaseUIService.saveDetail_V3($scope.resourceURL, false);
            })
            .then(function(data){
                self.reSetupConcreteUiStructure(salecaseUIService.detail);
                self.closeChildCards(1);
                commonUIService.showNotifyMessage("v3.mynewworkspace.message.ImportQuotationSuccessfully", "success");
            });
        });
    }

    /**
     * @author tphan37
     * 22-Feb-2016
     * TODO: These behaviors must be implemented in jsonMock
     * Import quotation to case.
     * @param  {uiStructure}    card     the card which received the click $event (not card in choosing list)
     * @param  {Object}         metadata the metadata of illustration
     * @param  {Object}         $event   [description]
     */
    $scope.importQuotation = function importQuotation(card, metadata, $event) {
        var self = this;
        var currProductInfor = self.getCurrProductInfor();

        if (currProductInfor.refDocType.indexOf('motor-private-car-m-as') !== -1) {
            self.importQuotationMotor(card, metadata, $event);
        }
        else if (currProductInfor.refDocType.indexOf('term-life-secure') !== -1){            
            self.importQuotationTLS(card, metadata, $event);
        }
    };
	
}];

var ListImportFactfind = ['$scope', '$log', 'factfindUIService', 'salecaseUIService', 'commonUIService', 'commonService', 'uiRenderPrototypeService',
	function($scope, $log, factfindUIService, salecaseUIService, commonUIService, commonService, uiRenderPrototypeService) {
	
	$scope.getFactfindList = function() {
		factfindUIService.getDocumentList_V3($scope.resourceURL).then(function(data){
			$scope.factfindList = factfindUIService.convertToArray(factfindUIService.findElementInElement_V3(data, ['MetadataDocument']));
			if(commonService.hasValueNotEmpty($scope.factfindList)){
				if ($.isArray($scope.factfindList)){
					var tempFNA = $scope.factfindList;
					$scope.factfindList = [];
					
					//Get imported Prospects
					var importedProspects = salecaseUIService.findElementInDetail_V3(['Prospect']);
					if(importedProspects != undefined && importedProspects['@refUid'] != '') {
						for (var i = 0; i < importedProspects.length; i++) {
							for (var j = 0; j < tempFNA.length; j++) {
								if((tempFNA[j]["ClientUid"] != undefined && tempFNA[j]["refUid"] != '')  && (tempFNA[j]["ClientUid"] == importedProspects[i]['@refUid'])) {
									$scope.factfindList.push(tempFNA[j]);
								}
							}
						}
					}
				}
				
				$scope.listFactfindListLimit = 12;
				
				$scope.increase = function(){
					$scope.listfactFindListLimit = $scope.listfactFindListLimit + 4;
				};
			}else{
				$scope.msg = 'There is no data.';
			}
		});
	}
	$scope.getFactfindList();
	
	$scope.importFactfind = function(card, metadata, $event) {
		var self = this;
		var needFNA = self.moduleService.findElementInDetail_V3(['NeedFNA']);
        needFNA['@refUid'] = metadata.DocId;
		
        salecaseUIService.saveDetail_V3($scope.resourceURL, false).then(function(data){
            card.root.isDetailChanged = false;
            card.isDetailChanged = false;	
		    $log.debug("Case has been saved");
			commonUIService.showNotifyMessage("v3.mynewworkspace.message.ImportFNASuccessfully", "success");
			self.closeChildCards(1, $event);
			$log.debug(self.moduleService.detail);
			// self.refreshCardsOnScreen();
			$scope.reSetupConcreteUiStructure(salecaseUIService.detail);
		});
		}
}];
var ListImportCorporateProspect = ['$scope', '$log', 'prospectCorporateUIService', 'illustrationUIService', 'commonUIService', 'commonService', 'uiRenderPrototypeService', 'salecaseUIService',
	function($scope, $log, prospectCorporateUIService, illustrationUIService, commonUIService, commonService, uiRenderPrototypeService, salecaseUIService) {
	
	$scope.getCorporateProspectList = function() {
		prospectCorporateUIService.getDocumentList_V3($scope.resourceURL).then(function(data){
			$scope.corporateProspectList = prospectCorporateUIService.findElementInElement_V3(data, ['MetadataDocument']);
			if(commonService.hasValueNotEmpty($scope.corporateProspectList)){
				if (!$.isArray($scope.corporateProspectList)){
					var temp = $scope.corporateProspectList;
					$scope.corporateProspectList = [];
					$scope.corporateProspectList.push(temp);
					$scope.listProspectLimit = 12;
					
					$scope.increase = function(){
						$scope.listProspectLimit = $scope.listProspectLimit + 4;
					};
				}
				
				
			}else{
				$scope.msg = 'There is no data.';
			}
		});
	}
	$scope.getCorporateProspectList();
	
	//Using for Import Contact Center to Policy Owner, product Group Term Life
	$scope.importCorporateProspectToPO = function(card, metadata, $event) {
		var self = this;
		var node;
		var nodes;
		var corporateId = metadata.DocId;
		var corporateName = metadata.CorporateName;
//		if (self.moduleService.product == "GTL1"){
//			self.moduleService.findElementInDetail_V3(['PolicyOwner'])["@refUid"] = corporateId;
//			self.moduleService.findElementInDetail_V3(['PolicyOwner','CorporateName']).$ = corporateName;
//			self.moduleService.saveDetail_V3($scope.resourceURL, false).then(function(data){
//				if (self.moduleService.isSuccess(data)){
//					//TODO: remove this variable in future
//	                //For now it will prevent the case got automatic saved when moving to other document (after importing prospect)
//	                card.root.isDetailChanged = false;
//	                card.isDetailChanged = false;
//
//					$log.debug("Case has been saved");
//					commonUIService.showNotifyMessage("v3.mynewworkspace.message.ImportProspectSuccessfully", "success");
//					self.closeChildCards(1, $event);
//					$log.debug(self.moduleService.detail);
//					$scope.reSetupConcreteUiStructure(self.moduleService.detail);
//				}
//				else commonUIService.showNotifyMessage("v3.mynewworkspace.message.ImportProspectUnSuccessfully", "success");
//			});
//		}
		if (self.moduleService.product == commonService.CONSTANTS.PRODUCT.GTL1) {
			node = 'PolicyOwner';
			nodes = 'PolicyOwners';
		} else { // for Group travel
			node = 'Prospect';
			nodes = 'Prospects';
		}
		
		var corporate = self.moduleService.findElementInDetail_V3([node]);
		var error = false;
		
		if (self.moduleService.findElementInDetail_V3([nodes])['@counter'] === self.moduleService.findElementInDetail_V3([nodes])['@maxOccurs']) {
			commonUIService.showNotifyMessage("v3.mynewworkspace.message.CannotImportMoreProspect");
			error = true;
		} else {
			for (var i = 0; i < corporate.length; i++) {
				if (corporate[i]['@refUid'] === corporateId) {
					commonUIService.showNotifyMessage("v3.mynewworkspace.message.CannotImportDuplicateProspect");
					error = true;
					break;
				}
			}
		}

		if (!error) {
			self.card = card;
			self.addCard(card, function addedChildEle (addedEle) {
				//bind refId here
				addedEle['@refUid'] = corporateId;
				
				if (self.moduleService.product == commonService.CONSTANTS.PRODUCT.GTL1) {
					self.moduleService.findElementInElement_V3(addedEle,['CorporateName']).$ = corporateName;
				}
				
				//add preview for card just added
				//TODO: remove this variable in future
                //For now it will prevent the case got automatic saved when moving to other document (after importing prospect)
				self.moduleService.saveDetail_V3($scope.resourceURL, false).then(function(data){
                    card.root.isDetailChanged = false;
                    card.isDetailChanged = false;

					$log.debug("Case has been saved");
					commonUIService.showNotifyMessage("v3.mynewworkspace.message.ImportProspectSuccessfully", "success");
					self.closeChildCards(1, $event);
					$log.debug(self.moduleService.detail);
				});
			});
		};
	
	};
	
}];

var ListImportLifeInsured = ['$scope', '$log', 'prospectPersonalUIService', 'salecaseUIService', 'commonUIService', 'commonService', 'uiRenderPrototypeService', 'illustrationUIService', 'uiFrameworkService',
	function($scope, $log, prospectPersonalUIService, salecaseUIService, commonUIService, commonService, uiRenderPrototypeService, illustrationUIService, uiFrameworkService) {
	
	$scope.getProspectList = function() {
		uiFrameworkService.isOpenedDetail = false;
		
		prospectPersonalUIService.getDocumentList_V3($scope.resourceURL).then(function(data){
			$scope.prospectList = prospectPersonalUIService.findElementInElement_V3(data, ['MetadataDocument']);
			if(commonService.hasValueNotEmpty($scope.prospectList)){
				if (!$.isArray($scope.prospectList)){
					var temp = $scope.prospectList;
					$scope.prospectList = [];
					$scope.prospectList.push(temp);
				}
				
				var temp = $scope.prospectList;
				$scope.prospectList = [];
				for(var index=0; index<temp.length; index++) 
				{
					var prospect = temp[index];
					if(prospect.DocId != illustrationUIService.findElementInDetail_V3(['PolicyOwnerInformation'])['@refUid'])
					{
						$scope.prospectList.push(prospect);
					}
				}
				
				$scope.listProspectLimit = 12;
				
				$scope.increase = function(){
					$scope.listProspectLimit = $scope.listProspectLimit + 4;
				};
			}

			if($scope.prospectList.length == 0){
				$scope.msg = 'There is no data.';
			};
		});
	};
	
	$scope.getProspectList();
	
	$scope.importLifeInsured = function(card, metadata, $event) {
		var self = this;
		prospectPersonalUIService.findDocumentToEdit_V3($scope.resourceURL, salecaseUIService.product, metadata.DocId).then(function (data){
			var prospectId = prospectPersonalUIService.findElementInElement_V3(data, ['DocInfo']).DocId;
			
			if(commonService.hasValueNotEmpty(prospectId)) {
				illustrationUIService.clearDataInJson(illustrationUIService.findElementInDetail_V3(['LifeInsuredInformation']));
				
				illustrationUIService.findElementInDetail_V3(['LifeInsuredInformation'])['@refUid'] = prospectId;
				illustrationUIService.findElementInDetail_V3(['LifeInsured','Salutation']).$ = prospectPersonalUIService.findElementInElement_V3(data, ['PersonContactData', 'Salutation']).$;
				illustrationUIService.findElementInDetail_V3(['LifeInsured','FullName']).$ = prospectPersonalUIService.findElementInElement_V3(data, ['PersonContactData', 'FullName']).$;
				illustrationUIService.findElementInDetail_V3(['LifeInsured','BirthDate']).$ = prospectPersonalUIService.findElementInElement_V3(data, ['PersonContactData', 'BirthDate']).$;				
				illustrationUIService.findElementInDetail_V3(['LifeInsured','Gender']).Value = prospectPersonalUIService.findElementInElement_V3(data, ['PersonContactData', 'Gender']).Value;
				illustrationUIService.findElementInDetail_V3(['LifeInsured','SmokerStatus']).Value = prospectPersonalUIService.findElementInElement_V3(data, ['PersonContactData', 'SmokerStatus']).Value;
				illustrationUIService.findElementInDetail_V3(['LifeInsured','BusinessIndustry']).Value = prospectPersonalUIService.findElementInElement_V3(data, ['PersonContactData', 'BusinessIndustry']).Value;
				illustrationUIService.findElementInDetail_V3(['LifeInsured','Occupation']).Value = prospectPersonalUIService.findElementInElement_V3(data, ['PersonContactData', 'Occupation']).Value;
				illustrationUIService.findElementInDetail_V3(['LAIsTheSameWithPO']).Value = 'N';
				illustrationUIService.computeElementAndUpdateLazyList($scope.resourceURL, [['LifeInsuredInformation']]).then(function(data){				
					$scope.refreshTags([["LifeInsuredInformation"]]).then(function(){
						self.closeChildCards(parseInt(card.level), $event);
						illustrationUIService.gcsAddNewLifeInsured = true;
					});					
				});				
			} else {
				commonUIService.showNotifyMessage("v3.mynewworkspace.message.ImportLifeInsureUnSuccessfully");
			}							
		});		
	}
}];

var PreviewPDFByHtml = ['$scope', '$compile', 'commonService', 'salecaseUIService','illustrationUIService', 'applicationUIService','mobileAppCoreModule',
             function($scope, $compile, commonService, salecaseUIService,illustrationUIService, applicationUIService, mobileAppCoreModule) {
	$scope.salecaseUIService = salecaseUIService;
	$scope.illustrationUIService = illustrationUIService;
	$scope.applicationUIService = applicationUIService;


    function eventHander(e){
         e.preventDefault();
         $scope.closePreviewPDF();
         $scope.$apply();
         document.removeEventListener('backbutton', eventHander);
    }

    $scope.init = function(){
        document.addEventListener('backbutton', eventHander);
        var user =  mobileAppCoreModule.userData;
        var profileIDInCase = salecaseUIService.findElementInDetail_V3(['ProfileId']);
        var listProfiles = mobileAppCoreModule.findElementInElement_V3(user, ['Profile']);
        var profile = undefined;
        angular.forEach(listProfiles, function(item){
            if(item['@profile-id'] == profileIDInCase){
                profile = item;
            }
        });
        $scope.agentId = mobileAppCoreModule.findElementInElement_V3(profile, ['PASID']).$;
        $scope.agentType = mobileAppCoreModule.findElementInElement_V3(profile, ['PASType']).$;
        $scope.agentName = mobileAppCoreModule.findElementInElement_V3(user, ['FullName']).$;
        $scope.agentMobilePhone = mobileAppCoreModule.findElementInElement_V3(user, ['MobilePhone']).$;

        //init moduleService
        if(salecaseUIService.product == commonService.CONSTANTS.PRODUCT.ENDOWMENT){
             $scope.moduleService = new EndowmentPreviewPDF();
        }else if(salecaseUIService.product == commonService.CONSTANTS.PRODUCT.REGULAR_UNIT_LINK){
             $scope.moduleService = new UnitLinkPreviewPDF();
        }
        $scope.moduleService.product = salecaseUIService.product;

        $scope.patternNumber = {
            aDec : '.',
            decimal : 2,
            aSep: ','
        }

        // Compile download PDF
        $scope.itextFilePath = $scope.openPreviewPDFDoctype + "_" + salecaseUIService.product + "/" + $scope.openPreviewPDFAction +".itext.html";
        commonService.itextElement = angular.element("<div ng-include src=\"contextPathRoot + 'view/myNewWorkspace/template/pdfTemplates/' + itextFilePath\"></div>");
        $compile(commonService.itextElement)($scope);
    }


//	 $scope.downloadPreviewPDF = function printPDF() {
//   	  var printDoc = new jsPDF('p', 'pt', "letter");
//   	  var  specialElementHandlers = {
//			    '#bypassme': function(element, renderer){
//			        return true
//			    }
//			};
//	  
//	  	var margins = {
//	  			top: 10,
//	  		    bottom: 10,
//	  		    left: 10,
//	  		    width: 585
//			  };
//	  	var source = $('#previewPDF')[0];
//        printDoc.fromHTML(
//	       	source 
//	       	, margins.left // x coord
//           , margins.top // y coord 
//           ,{
//	       	 'width': margins.width, // max width of content on PDF
//	       	 'elementHandlers': specialElementHandlers
//	       	 },
//	       	 function(dispose){
//	       		 printDoc.save('Quotation-abridge.pdf');
//	       	 },
//	       	 margins);
		 
//		 var quotes = document.getElementById('previewPDF');
//
//	        html2canvas(quotes, {
//	            onrendered: function(canvas) {
//
//	            //! MAKE YOUR PDF
//	            var pdf = new jsPDF('p', 'pt', 'letter');
//
//	            for (var i = 0; i <= 5; i++) {
//	                //! This is all just html2canvas stuff
//	                var srcImg  = canvas;
//	                var sX      = 0;
//	                var sY      = 980*i; // start 980 pixels down for every new page
//	                var sWidth  = 900;
//	                var sHeight = 980;
//	                var dX      = 0;
//	                var dY      = 0;
//	                var dWidth  = 900;
//	                var dHeight = 980;
//
//	                window.onePageCanvas = document.createElement("canvas");
//	                onePageCanvas.setAttribute('width', 900);
//	                onePageCanvas.setAttribute('height', 980);
//	                var ctx = onePageCanvas.getContext('2d');
//	                // details on this usage of this function:
//	                // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Using_images#Slicing
//	                ctx.drawImage(srcImg,sX,sY,sWidth,sHeight,dX,dY,dWidth,dHeight);
//
//	                // document.body.appendChild(canvas);
//	                var canvasDataURL = onePageCanvas.toDataURL("image/png", 1.0);
//
//	                var width         = onePageCanvas.width;
//	                var height        = onePageCanvas.clientHeight;
//
//	                //! If we're on anything other than the first page,
//	                // add another page
//	                if (i > 0) {
//	                    pdf.addPage(612, 791); //8.5" x 11" in pts (in*72)
//	                }
//	                //! now we declare that we're working on that page
//	                pdf.setPage(i+1);
//	                //! now we add content to that page!
//	                pdf.addImage(canvasDataURL, 'PNG', 20, 40, (width*.62), (height*.62));
//
//	            }
//	            //! after the for loop is finished running, we save the pdf.
//	            pdf.save('Test.pdf');
//	        }
//	      });
//    }
	

	function EndowmentPreviewPDF() {
		
	}

	//get checkbox icon based on questions' value
	EndowmentPreviewPDF.prototype.getCheckboxIconWithIndex = function getCheckboxIconWithIndex(elementsChain, index, yaTidakFlag)
	{
		var elementValue = applicationUIService.findElementInDetail_V3(elementsChain)[index]['application:QValue'].Value;
		if(elementValue == yaTidakFlag)
		{
			return $scope.contextPathRoot + 'view/myNewWorkspace/template/pdfTemplates/application_' + this.product + '/images/checked.png';
		} else {
			return $scope.contextPathRoot + 'view/myNewWorkspace/template/pdfTemplates/application_' + this.product + '/images/unchecked.png';
		}
	}
	EndowmentPreviewPDF.prototype.getCheckboxIcon = function getCheckboxIcon(elementsChain, yaTidakFlag)
	{
		var elementValue = applicationUIService.findElementInDetail_V3(elementsChain).Value;
		if(elementValue == yaTidakFlag)
		{
			return $scope.contextPathRoot + 'view/myNewWorkspace/template/pdfTemplates/application_' + this.product + '/images/checked.png';
		} else {
			return $scope.contextPathRoot + 'view/myNewWorkspace/template/pdfTemplates/application_' + this.product + '/images/unchecked.png';
		}
	}
	EndowmentPreviewPDF.prototype.getCheckboxIconInElement = function getCheckboxIconInElement(element, elementsChain, yaTidakFlag)
	{
		var elementValue = applicationUIService.findElementInElement_V3(element, elementsChain).Value;
		if(elementValue == yaTidakFlag)
		{
			return $scope.contextPathRoot + 'view/myNewWorkspace/template/pdfTemplates/application_' + this.product + '/images/checked.png';
		} else {
			return $scope.contextPathRoot + 'view/myNewWorkspace/template/pdfTemplates/application_' + this.product + '/images/unchecked.png';
		}
	}
	 
	
	 //get LA_GQ1c_NameAddress
	 // use for MNC Life Endowment
	EndowmentPreviewPDF.prototype.getLAGQ1cNameAddress = function (){
		if( (applicationUIService.findElementInDetail_V3(['LifeAssuredDetails','LifeAssuredInformation'])['@refUid'] != '')
		&&	(applicationUIService.findElementInDetail_V3(['LifeAssuredDetails','LifeAssuredInformation'])['@refUid'] != applicationUIService.findElementInDetail_V3(['PolicyOwnerDetails','ProporserInformation'])['@refUid'])
		&&  (applicationUIService.findElementInDetail_V3(['LifeAssuredDetails','GeneralQ1c','QValue']).Value == 'Y')
		)
			return applicationUIService.findElementInDetail_V3(['LifeAssuredDetails','GeneralQ1c','GeneralQ1cNameAndAddress']).$;
		else
			return applicationUIService.findElementInDetail_V3(['PolicyOwnerDetails','GeneralQ1c','GeneralQ1cNameAndAddress']).$;
	}
	//get PO_GQ1c_NameAddress
	// use for MNC Life Endowment
	EndowmentPreviewPDF.prototype.getPOGQ1cNameAddress = function (){
			if( (applicationUIService.findElementInDetail_V3(['LifeAssuredDetails','LifeAssuredInformation'])['@refUid'] != '')
					&&	(applicationUIService.findElementInDetail_V3(['LifeAssuredDetails','LifeAssuredInformation'])['@refUid'] != applicationUIService.findElementInDetail_V3(['PolicyOwnerDetails','ProporserInformation'])['@refUid'])
					&&  (applicationUIService.findElementInDetail_V3(['LifeAssuredDetails','GeneralQ1c','QValue']).Value == 'Y')
			)
				return applicationUIService.findElementInDetail_V3(['LifeAssuredDetails','GeneralQ1c','GeneralQ1cDateOrReason']).$;
			else
				return applicationUIService.findElementInDetail_V3(['PolicyOwnerDetails','GeneralQ1c','GeneralQ1cDateOrReason']).$;
	}
	//get LA_GQ2_GeneralQDetails
	// use for MNC Life Endowment
	EndowmentPreviewPDF.prototype.getLAGQ2GeneralQDetails = function (){
			if( (applicationUIService.findElementInDetail_V3(['LifeAssuredDetails','LifeAssuredInformation'])['@refUid'] != '')
					&&	(applicationUIService.findElementInDetail_V3(['LifeAssuredDetails','LifeAssuredInformation'])['@refUid'] != applicationUIService.findElementInDetail_V3(['PolicyOwnerDetails','ProporserInformation'])['@refUid'])
					&&  (applicationUIService.findElementInDetail_V3(['LifeAssuredDetails','GeneralQ2','QValue']).Value == 'Y')
			)
				return applicationUIService.findElementInDetail_V3(['LifeAssuredDetails','GeneralQ2','GeneralQDetails']).$;
			else
				return applicationUIService.findElementInDetail_V3(['PolicyOwnerDetails','GeneralQ2','GeneralQDetails']).$;
	}
	//get LA_GQ3_GeneralQ3Amount
	// use for MNC Life Endowment
	EndowmentPreviewPDF.prototype.getLAGQ3GeneralQ3Amount = function (){
			if( applicationUIService.findElementInDetail_V3(['LifeAssuredDetails','GeneralQ3', 'QValue']).Value == 'Y')
				return applicationUIService.findElementInDetail_V3(['LifeAssuredDetails','GeneralQ3','GeneralQ3Amount']).$;
			if( applicationUIService.findElementInDetail_V3(['PolicyOwnerDetails','GeneralQ3', 'QValue']).Value == 'Y')
				return applicationUIService.findElementInDetail_V3(['PolicyOwnerDetails','GeneralQ3','GeneralQ3Amount']).$;
		return " ";
	}
	//get LA_GQ3_GeneralQ3BeverageType
	// use for MNC Life Endowment
	EndowmentPreviewPDF.prototype.getLAGQ3GeneralQ3BeverageType = function (){
			if( applicationUIService.findElementInDetail_V3(['LifeAssuredDetails','GeneralQ3', 'QValue']).Value == 'Y')
				return applicationUIService.findElementInDetail_V3(['LifeAssuredDetails','GeneralQ3','GeneralQ3BeverageType']).$;
			if( applicationUIService.findElementInDetail_V3(['PolicyOwnerDetails','GeneralQ3', 'QValue']).Value == 'Y')
				return applicationUIService.findElementInDetail_V3(['PolicyOwnerDetails','GeneralQ3','GeneralQ3BeverageType']).$;
		return " ";
	}
	//get LA_GQ3_GeneralQ3Howlong
	// use for MNC Life Endowment
	EndowmentPreviewPDF.prototype.getLAGQ3GeneralQ3Howlong = function (){
		if( applicationUIService.findElementInDetail_V3(['LifeAssuredDetails','GeneralQ3', 'QValue']).Value == 'Y')
			return applicationUIService.findElementInDetail_V3(['LifeAssuredDetails','GeneralQ3','GeneralQ3Howlong']).$;
		if( applicationUIService.findElementInDetail_V3(['PolicyOwnerDetails','GeneralQ3', 'QValue']).Value == 'Y')
			return applicationUIService.findElementInDetail_V3(['PolicyOwnerDetails','GeneralQ3','GeneralQ3Howlong']).$;
		return " ";
	}
	 //get LA_GeneralQ4KindOfDrugs
	 // use for MNC Life Endowment
	EndowmentPreviewPDF.prototype.getLAGeneralQ4KindOfDrugs = function (){
		if( (applicationUIService.findElementInDetail_V3(['LifeAssuredDetails','LifeAssuredInformation'])['@refUid'] != '')
		&&	(applicationUIService.findElementInDetail_V3(['LifeAssuredDetails','LifeAssuredInformation'])['@refUid'] != applicationUIService.findElementInDetail_V3(['PolicyOwnerDetails','ProporserInformation'])['@refUid'])
		&&  (applicationUIService.findElementInDetail_V3(['LifeAssuredDetails','GeneralQ4','QValue']).Value == 'Y')
		)
			return applicationUIService.findElementInDetail_V3(['LifeAssuredDetails','GeneralQ4','GeneralQ4KindOfDrugs']).$;
		else
			return applicationUIService.findElementInDetail_V3(['PolicyOwnerDetails','GeneralQ4','GeneralQ4KindOfDrugs']).$;
	}
	//get LA_GeneralQ4SinceDate
	// use for MNC Life Endowment
	EndowmentPreviewPDF.prototype.getLAGeneralQ4SinceDate = function (){
		if( (applicationUIService.findElementInDetail_V3(['LifeAssuredDetails','LifeAssuredInformation'])['@refUid'] != '')
				&&	(applicationUIService.findElementInDetail_V3(['LifeAssuredDetails','LifeAssuredInformation'])['@refUid'] != applicationUIService.findElementInDetail_V3(['PolicyOwnerDetails','ProporserInformation'])['@refUid'])
				&&  (applicationUIService.findElementInDetail_V3(['LifeAssuredDetails','GeneralQ4','QValue']).Value == 'Y')
		)
			return applicationUIService.findElementInDetail_V3(['LifeAssuredDetails','GeneralQ4','GeneralQ4SinceDate']).$;
		else
			return applicationUIService.findElementInDetail_V3(['PolicyOwnerDetails','GeneralQ4','GeneralQ4SinceDate']).$;
	}
	//get LA_GeneralQ4LastDate
	// use for MNC Life Endowment
	EndowmentPreviewPDF.prototype.getLAGeneralQ4LastDate = function (){
		if( (applicationUIService.findElementInDetail_V3(['LifeAssuredDetails','LifeAssuredInformation'])['@refUid'] != '')
				&&	(applicationUIService.findElementInDetail_V3(['LifeAssuredDetails','LifeAssuredInformation'])['@refUid'] != applicationUIService.findElementInDetail_V3(['PolicyOwnerDetails','ProporserInformation'])['@refUid'])
				&&  (applicationUIService.findElementInDetail_V3(['LifeAssuredDetails','GeneralQ4','QValue']).Value == 'Y')
		)
			return applicationUIService.findElementInDetail_V3(['LifeAssuredDetails','GeneralQ4','GeneralQ4LastDate']).$;
		else
			return applicationUIService.findElementInDetail_V3(['PolicyOwnerDetails','GeneralQ4','GeneralQ4LastDate']).$;
	}
	//get LA_GeneralQ5CigaretesDay
	// use for MNC Life Endowment
	EndowmentPreviewPDF.prototype.getLAGeneralQ5CigaretesDay = function (){
		if( (applicationUIService.findElementInDetail_V3(['LifeAssuredDetails','LifeAssuredInformation'])['@refUid'] != '')
				&&	(applicationUIService.findElementInDetail_V3(['LifeAssuredDetails','LifeAssuredInformation'])['@refUid'] != applicationUIService.findElementInDetail_V3(['PolicyOwnerDetails','ProporserInformation'])['@refUid'])
				&&  (applicationUIService.findElementInDetail_V3(['LifeAssuredDetails','GeneralQ5','QValue']).Value == 'Y')
		)
			return applicationUIService.findElementInDetail_V3(['LifeAssuredDetails','GeneralQ5','GeneralQ5CigaretesDay']).$;
		else
			return applicationUIService.findElementInDetail_V3(['PolicyOwnerDetails','GeneralQ5','GeneralQ5CigaretesDay']).$;
	}
	//get LA_GeneralQ5Since
	// use for MNC Life Endowment
	EndowmentPreviewPDF.prototype.getLAGeneralQ5Since = function (){
		if( (applicationUIService.findElementInDetail_V3(['LifeAssuredDetails','LifeAssuredInformation'])['@refUid'] != '')
				&&	(applicationUIService.findElementInDetail_V3(['LifeAssuredDetails','LifeAssuredInformation'])['@refUid'] != applicationUIService.findElementInDetail_V3(['PolicyOwnerDetails','ProporserInformation'])['@refUid'])
				&&  (applicationUIService.findElementInDetail_V3(['LifeAssuredDetails','GeneralQ5','QValue']).Value == 'Y')
		)
			return applicationUIService.findElementInDetail_V3(['LifeAssuredDetails','GeneralQ5','GeneralQ5Since']).$;
		else
			return applicationUIService.findElementInDetail_V3(['PolicyOwnerDetails','GeneralQ5','GeneralQ5Since']).$;
	}
	//get LA_GeneralQ5Since
	// use for MNC Life Endowment
	EndowmentPreviewPDF.prototype.getLAGeneralQ5Explain = function (){
		if( (applicationUIService.findElementInDetail_V3(['LifeAssuredDetails','LifeAssuredInformation'])['@refUid'] != '')
				&&	(applicationUIService.findElementInDetail_V3(['LifeAssuredDetails','LifeAssuredInformation'])['@refUid'] != applicationUIService.findElementInDetail_V3(['PolicyOwnerDetails','ProporserInformation'])['@refUid'])
				&&  (applicationUIService.findElementInDetail_V3(['LifeAssuredDetails','GeneralQ5','QValue']).Value == 'Y')
		)
			return applicationUIService.findElementInDetail_V3(['LifeAssuredDetails','GeneralQ5','GeneralQ5Explain']).$;
		else
			return applicationUIService.findElementInDetail_V3(['PolicyOwnerDetails','GeneralQ5','GeneralQ5Explain']).$;
	}
	
	//get LA_GeneralQ5Since
	// use for MNC Life Endowment
	EndowmentPreviewPDF.prototype.getLAGeneralQ5Explain = function (){
		if( (applicationUIService.findElementInDetail_V3(['LifeAssuredDetails','LifeAssuredInformation'])['@refUid'] != '')
				&&	(applicationUIService.findElementInDetail_V3(['LifeAssuredDetails','LifeAssuredInformation'])['@refUid'] != applicationUIService.findElementInDetail_V3(['PolicyOwnerDetails','ProporserInformation'])['@refUid'])
				&&  (applicationUIService.findElementInDetail_V3(['LifeAssuredDetails','GeneralQ5','QValue']).Value == 'Y')
		)
			return applicationUIService.findElementInDetail_V3(['LifeAssuredDetails','GeneralQ5','GeneralQ5Explain']).$;
		else
			return applicationUIService.findElementInDetail_V3(['PolicyOwnerDetails','GeneralQ5','GeneralQ5Explain']).$;
	}
	//get LA_GeneralQ6Location
	// use for MNC Life Endowment
	EndowmentPreviewPDF.prototype.getLAGeneralQ6Location = function (){
		if( (applicationUIService.findElementInDetail_V3(['LifeAssuredDetails','LifeAssuredInformation'])['@refUid'] != '')
				&&	(applicationUIService.findElementInDetail_V3(['LifeAssuredDetails','LifeAssuredInformation'])['@refUid'] != applicationUIService.findElementInDetail_V3(['PolicyOwnerDetails','ProporserInformation'])['@refUid'])
				&&  (applicationUIService.findElementInDetail_V3(['LifeAssuredDetails','GeneralQ6','QValue']).Value == 'Y')
		)
			return applicationUIService.findElementInDetail_V3(['LifeAssuredDetails','GeneralQ6','GeneralQ6Location']).$;
		else
			return applicationUIService.findElementInDetail_V3(['PolicyOwnerDetails','GeneralQ6','GeneralQ6Location']).$;
	}
	//get LA_GeneralQ7When
	// use for MNC Life Endowment
	EndowmentPreviewPDF.prototype.getLAGeneralQ7When = function (){
		if( (applicationUIService.findElementInDetail_V3(['LifeAssuredDetails','LifeAssuredInformation'])['@refUid'] != '')
				&&	(applicationUIService.findElementInDetail_V3(['LifeAssuredDetails','LifeAssuredInformation'])['@refUid'] != applicationUIService.findElementInDetail_V3(['PolicyOwnerDetails','ProporserInformation'])['@refUid'])
				&&  (applicationUIService.findElementInDetail_V3(['LifeAssuredDetails','GeneralQ7','QValue']).Value == 'Y')
		)
			return applicationUIService.findElementInDetail_V3(['LifeAssuredDetails','GeneralQ7','GeneralQ7When']).$;
		else
			return applicationUIService.findElementInDetail_V3(['PolicyOwnerDetails','GeneralQ7','GeneralQ7When']).$;
	}
    //get LA_GeneralQ7Where
	// use for MNC Life Endowment
	EndowmentPreviewPDF.prototype.getLAGeneralQ7Where = function (){
		if( (applicationUIService.findElementInDetail_V3(['LifeAssuredDetails','LifeAssuredInformation'])['@refUid'] != '')
				&&	(applicationUIService.findElementInDetail_V3(['LifeAssuredDetails','LifeAssuredInformation'])['@refUid'] != applicationUIService.findElementInDetail_V3(['PolicyOwnerDetails','ProporserInformation'])['@refUid'])
				&&  (applicationUIService.findElementInDetail_V3(['LifeAssuredDetails','GeneralQ7','QValue']).Value == 'Y')
		)
			return applicationUIService.findElementInDetail_V3(['LifeAssuredDetails','GeneralQ7','GeneralQ7Where']).$;
		else
			return applicationUIService.findElementInDetail_V3(['PolicyOwnerDetails','GeneralQ7','GeneralQ7Where']).$;
	}
	//get LA_GeneralQ7Duration
	// use for MNC Life Endowment
	EndowmentPreviewPDF.prototype.getLAGeneralQ7Duration = function (){
		if( (applicationUIService.findElementInDetail_V3(['LifeAssuredDetails','LifeAssuredInformation'])['@refUid'] != '')
				&&	(applicationUIService.findElementInDetail_V3(['LifeAssuredDetails','LifeAssuredInformation'])['@refUid'] != applicationUIService.findElementInDetail_V3(['PolicyOwnerDetails','ProporserInformation'])['@refUid'])
				&&  (applicationUIService.findElementInDetail_V3(['LifeAssuredDetails','GeneralQ7','QValue']).Value == 'Y')
		)
			return applicationUIService.findElementInDetail_V3(['LifeAssuredDetails','GeneralQ7','GeneralQ7Duration']).$;
		else
			return applicationUIService.findElementInDetail_V3(['PolicyOwnerDetails','GeneralQ7','GeneralQ7Duration']).$;
	}
	//get LA_GQ11_GeneralQDetails
	// use for MNC Life Endowment
	EndowmentPreviewPDF.prototype.getLAGQ11GeneralQDetails = function (){
		if( (applicationUIService.findElementInDetail_V3(['LifeAssuredDetails','LifeAssuredInformation'])['@refUid'] != '')
				&&	(applicationUIService.findElementInDetail_V3(['LifeAssuredDetails','LifeAssuredInformation'])['@refUid'] != applicationUIService.findElementInDetail_V3(['PolicyOwnerDetails','ProporserInformation'])['@refUid'])
				&&  (applicationUIService.findElementInDetail_V3(['LifeAssuredDetails','GeneralQ11','QValue']).Value == 'Y')
		)
			return applicationUIService.findElementInDetail_V3(['LifeAssuredDetails','GeneralQ11','GeneralQDetails']).$;
		else
			return applicationUIService.findElementInDetail_V3(['PolicyOwnerDetails','GeneralQ11','GeneralQDetails']).$;
	}
	//get isPoSameLi
	// use for MNC Life Endowment
	EndowmentPreviewPDF.prototype.isPOSameLI = function (){
		return applicationUIService.findElementInDetail_V3(['LAIsTheSameWithPO']).Value == 'Y';
	};
	EndowmentPreviewPDF.prototype.basicPremium = function (){
		var basicPremium =  illustrationUIService.findElementInDetail_V3(['Coverage','RegularBasicPremium']).$;
		basicPremium += "";
		basicPremium = basicPremium.replace( /[^0-9\.]/gi, '' );
		var i = basicPremium.indexOf('.');
		if(i > 0){
		    basicPremium = basicPremium.substring(0, i);
		}
		return basicPremium;
	};

	EndowmentPreviewPDF.prototype.isExistRider = function (riderType){
        var reiders =  illustrationUIService.findElementInDetail_V3(['Rider']);
        var result = false;
        angular.forEach(reiders, function(item){
            if(illustrationUIService.findElementInElement_V3(item, ['RiderType']).Value == riderType){
                result =  true;
            }
       });
       return result;
    };

    EndowmentPreviewPDF.prototype.getValueGQ1c = function (key){
        var value = applicationUIService.findElementInDetail_V3(key).$;
        if(value == undefined || value == "")
            return "";
        else
            return value + " kg";
    };

	function UnitLinkPreviewPDF() {

    }
    inherit((new EndowmentPreviewPDF()).constructor, UnitLinkPreviewPDF);

	/**
	 * Get number from currency string, ex: 100,000.00
	 * @param {String} number input string
	 * @param {bool} options.roundAndDiv div to 1000
	 */
	UnitLinkPreviewPDF.prototype.getNumber = function (number, options){
		options = options || {};
		if (commonService.hasValueNotEmpty(number)) {
			number = number.replace(/,/g, '');
			number = Number(number);
			if (options.roundAndDiv) {
				number = (number + 0.1) / 1000;
			}
		}
		return number;
	};
	
	/**
	 * Check has rider plan in list
	 * @param {Array} riderNodes list of rider need to check
	 * @param {Array} riderPlans list of rider plan need to verify
	 */
	UnitLinkPreviewPDF.prototype.hasRiderPlan = function (riderNodes, riderPlans){
		riderNodes = riderNodes || [];
		riderPlans = riderPlans || [];
		for (var i = 0; i < riderNodes.length; i++) {
			for (var j = 0; j < riderPlans.length; j++) {
				if (riderNodes[i]['unit-link:RiderPlan'] != undefined &&
					riderNodes[i]['unit-link:RiderPlan']['Value'] == riderPlans[j]) {
					return true;
				}
			}
		}
		return false
	};

    UnitLinkPreviewPDF.prototype.initChartDataForLimitedPaymentPoliciesBenefitRow = function(){
        //information for chart
       // modify to view--->
       $scope.moduleService.titleOfChartLPP = 'Sesuai Rencana Pembayaran Premi yang dikehendaki (' + illustrationUIService.findElementInDetail_V3(['BasicPlan','PremiumTerm']).$ + ' tahun)';
       var idTagChart = "#LimitedPaymentPoliciesBenefitRow";
       var nameLine1 = 'Rata-rata Nilai Dana Investasi';
       var nameLine2 = 'Rata-rata Manfaat Asuransi';
       var height = 200;
       var labelXAxis = 'Akhir Tahun Polis ke-';
       var labelYAxis = '(.000)';
       // <--- modify to view

       //model --->
       var x = ['x']; // x axist
       var data1 = ['data1']; // line 1
       var data2 = ['data2']; // line 2
       // <--- model

       //specific for MNC RUL --->
       // calculate data to show
       var rawData =  illustrationUIService.findElementInDetail_V3(['BenefitIllustration','LimitedPaymentPoliciesBenefitRow']);

       angular.forEach(rawData, function(item){
           if(illustrationUIService.findElementInElement_V3(item,['LPPYear']).$ > 0 && illustrationUIService.findElementInElement_V3(item,['LPPYear']).$ % 5 == 0){
                 x.push(illustrationUIService.findElementInElement_V3(item,['LPPYear']).$);
                 data1.push(parseFloat(illustrationUIService.findElementInElement_V3(item,['LPPCashValueAverage']).$.replace( /[^0-9\.]/gi, '' )) / 1000);
                 data2.push(parseFloat(illustrationUIService.findElementInElement_V3(item,['LPPDeathBenefitAverage']).$.replace( /[^0-9\.]/gi, '' )) / 1000);
           }
       });
       // <--- specific for MNC RUL


       //gen chart
       var chart = c3.generate({
           bindto: idTagChart,
           data: {
             x: 'x',
             columns: [
               x,
               data1,
               data2
             ],
              names: {
                data1: nameLine1,
                data2: nameLine2,
              }
           },
           size: {
             height: height
           },
           axis: {
                   y: {
                       min: 0,
                       padding: {
                            top:0,
                            bottom: 0
                       },
                       label: {
                            text: labelYAxis,
                            position: 'outer-middle'
                       },
                       tick: {
                           format: d3.format(",")
                       }
                   },
                   x: {
                        padding: {
                            left: 5
                        },
                        label: {
                            text: labelXAxis,
                           position: 'outer-center'
                        }
                   }
               }
         });

        //title
        /* d3.select(idTagChart + ' svg').append('text')
         			.attr('x', d3.select(idTagChart + ' svg').node().getBoundingClientRect().width / 2)
         			.attr('y', 16)
         			.attr('text-anchor', 'middle')
         			.style('font-size', '1.4em')
         			.text(titleOfChart);*/
    }

    UnitLinkPreviewPDF.prototype.initChartDataForContinuousPremiumPoliciesBenefitRow = function(){
            //information for chart
           // modify to view--->
           $scope.moduleService.titleOfChartCPP = 'Sesuai Masa Asuransi (' + illustrationUIService.findElementInDetail_V3(['BasicPlan','PolicyTerm']).$ + ' tahun)';
           var idTagChart = "#ContinuousPremiumPoliciesBenefitRow";
           var nameLine1 = 'Rata-rata Nilai Dana Investasi';
           var nameLine2 = 'Rata-rata Manfaat Asuransi';
           var height = 200;
           var labelXAxis = 'Akhir Tahun Polis ke-';
           var labelYAxis = '(.000)';
           // <--- modify to view

           //model --->
           var x = ['x']; // x axist
           var data1 = ['data1']; // line 1
           var data2 = ['data2']; // line 2
           // <--- model

           //specific for MNC RUL --->
           // calculate data to show
           var rawData =  illustrationUIService.findElementInDetail_V3(['BenefitIllustration','ContinuousPremiumPoliciesBenefitRow']);

           angular.forEach(rawData, function(item){
               if(illustrationUIService.findElementInElement_V3(item,['CPPYear']).$ > 0 && illustrationUIService.findElementInElement_V3(item,['CPPYear']).$ % 5 == 0){
                     x.push(illustrationUIService.findElementInElement_V3(item,['CPPYear']).$);
                     data1.push(parseFloat(illustrationUIService.findElementInElement_V3(item,['CPPCashValueAverage']).$.replace( /[^0-9\.]/gi, '' )) / 1000);
                     data2.push(parseFloat(illustrationUIService.findElementInElement_V3(item,['CPPDeathBenefitAverage']).$.replace( /[^0-9\.]/gi, '' )) / 1000);
               }
           });
           // <--- specific for MNC RUL


           //gen chart
           var chart = c3.generate({
               bindto: idTagChart,
               data: {
                 x: 'x',
                 columns: [
                   x,
                   data1,
                   data2
                 ],
                  names: {
                    data1: nameLine1,
                    data2: nameLine2,
                  }
               },
               size: {
                 height: height
               },
               axis: {
                       y: {
                           min: 0,
                           padding: {
                                top:0,
                                bottom: 0
                           },
                           label: {
                                text: labelYAxis,
                                position: 'outer-middle'
                           },
                           tick: {
                               format: d3.format(",")
                           }
                       },
                       x: {
                            padding: {
                                left: 5
                            },
                            label: {
                                text: labelXAxis,
                               position: 'outer-center'
                            }
                       }
                   }
             });
        }

        UnitLinkPreviewPDF.prototype.isExistFund = function(fundCd){
            var funds = illustrationUIService.findElementInDetail_V3(['Data','Coverage','Funds','Fund']);
            var result = false;
            angular.forEach(funds, function(fund){
                if(illustrationUIService.findElementInElement_V3(fund, ['FundCd']).Value ==  fundCd){
                    result = true;
                }
            });
            return result;
        }
        UnitLinkPreviewPDF.prototype.getFundAllocation = function(fundCd){
            var funds = illustrationUIService.findElementInDetail_V3(['Data','Coverage','Funds','Fund']);
            var result = "";
            angular.forEach(funds, function(fund){
                if(illustrationUIService.findElementInElement_V3(fund, ['FundCd']).Value ==  fundCd){
                    result = illustrationUIService.findElementInElement_V3(fund, ['FundAllocation']).$ +' %';
                }
            });
            return result;
        }
        UnitLinkPreviewPDF.prototype.getTotalPayablePremium = function(){
                var totalRegularPremium =  parseFloat(illustrationUIService.findElementInDetail_V3(['Data','BenefitIllustration','TotalRegularPremium']).$.replace( /[^0-9\.]/gi, '' ));
                var totalSingleTopUp = parseFloat(illustrationUIService.findElementInDetail_V3(['Data','BenefitIllustration','TotalSingleTopUp']).$.replace( /[^0-9\.]/gi, '' ));

          		totalRegularPremium += totalSingleTopUp;

          		return addCommas(totalRegularPremium, {
          		    aDec : '.',
          		    decimal : 2,
          		    aSep: ','
          		});
        }

         var addCommas = function addCommas(nStr, attrs){
            nStr += '';
            nStr = nStr.replace( /[^0-9\.]/gi, '' );
            var x = nStr.split( attrs['aDec']);
            var x1 = x[0];
            var x2 = x.length > 1 ?  attrs['aDec'] + x[1] : genNumberZero(attrs[ 'decimal' ],attrs['aDec']);
            var rgx = /(\d+)(\d{3})/;
            while (rgx.test(x1)) {
                x1 = x1.replace(rgx, '$1' + attrs['aSep'] + '$2');
            }
            return x1 + x2;
        };

          // generate number Zero to fix  decimal
        var genNumberZero = function(n, prefix){
                 var res =n > 0? prefix : "";
                 var i = 0;
                 while(i++ < n){
                     res += "0";
                 }
                 return res;
         };

     $scope.init();
}];
