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
var UnderwritingDetailCtrl = ['$scope','$rootScope', '$log', '$state', '$mdDialog', 'commonService', 'underwritingUIService', 'commonUIService', '$translate', 'illustrationUIService', 'salecaseUIService', 'ecovernoteUIService', 'applicationUIService', 'urlService','uiFrameworkService','printPdfService','uiRenderPrototypeService','mobileAppCoreModule',
	function($scope,$rootScope, $log, $state, $mdDialog, commonService, underwritingUIService, commonUIService, $translate, illustrationUIService, salecaseUIService, ecovernoteUIService, applicationUIService, urlService, uiFrameworkService, printPdfService, uiRenderPrototypeService,mobileAppCoreModule) {
	
	$scope.commonUIService = commonUIService;
	$scope.commonService = commonService;
	$scope.moduleService = underwritingUIService;
	$scope.illustrationService = illustrationUIService;
	$scope.salecaseService = salecaseUIService;
	$scope.printPdfService = printPdfService;
	$scope.isEndProcess = false;
	$scope.isCompute = {click:false};
	$scope.name = 'UnderwritingDetailCtrl';
	$scope.formLetterList = [];
	
	$scope.expiredStatus = localStorage.getItem("expiredStatus");
	localStorage.removeItem("expiredStatus");
	
	underwritingUIService.productName = salecaseUIService.product;
    //already choose ACcept or REject Couter Offer?
	 $scope.alreadyAcOrReCO = false;

	if (!commonService.hasValue(underwritingUIService.productName)){
		underwritingUIService.productName = underwritingUIService.findElementInDetail_V3(['Product']);
	}
	//set isOpenedDetail to support action bar for Travel Product
	if (underwritingUIService.productName == commonService.CONSTANTS.PRODUCT.TRAVEL_EXPRESS
			|| underwritingUIService.productName == commonService.CONSTANTS.PRODUCT.GROUP_TRAVEL_EXPRESS
			|| underwritingUIService.productName == commonService.CONSTANTS.PRODUCT.MOTOR_PRIVATE_CAR_M_AS) {
		$scope.uiFrameworkService = uiFrameworkService;
		$scope.uiFrameworkService.isOpenedDetail =true;
	}
	$scope.getUnderwritingLazyList = function(){
		var deferred = underwritingUIService.$q.defer();
		if(!commonService.hasValueNotEmpty(underwritingUIService.lazyChoiceListByProduct[underwritingUIService.productName])){
			underwritingUIService.getUnderwritingLazyList($scope.resourceURL, underwritingUIService.productName).then(function(data){
				underwritingUIService.lazyChoiceList = data;
				deferred.resolve(data);
			});
		}
		else deferred.resolve();
		return deferred.promise;
	};

	$scope.loadingOfUQ = '';
	$scope.totalPremiumOfUQ = '';
	$scope.stampDutyOfUQ = '';
	$scope.revisedPremiumOfUQ = '';
	$scope.monthlyPremiumOfUQ = '';
	$scope.yearlyPremiumOfUQ = '';
	$scope.loadingForFrequencyOfUQ = '';
	$scope.premiumFrequencyPayableOfUQ = '';

	$scope.populateValue = function(){
		if($scope.salecaseService.product == 'FIR' || $scope.salecaseService.product == commonService.CONSTANTS.PRODUCT.GUARANTEED_CASHBACK ||
				$scope.salecaseService.product == 'term-life-secure'){
			var result = underwritingUIService.findElementInDetail_V3(['DocStatus'])['BusinessStatus'];
//			if(result == 'NEW' || result == 'WIP' || result == 'COUNTER-OFFERED' || result == 'ACCEPT-COUNTER-OFFERED' || result == 'REJECT-COUNTER-OFFERED'){
				var quotationList = salecaseUIService.findElementInDetail_V3(['Quotations']);
				if(commonService.hasValue(quotationList) && quotationList['@counter'] >= 1) {

					var quotations = salecaseUIService.findElementInElement_V3(quotationList, ['Quotation']);
					var quotationId = illustrationUIService.findElementInElement_V3(quotations[quotations.length - 1], ['QuotationId']);
					if(commonService.hasValue(quotationId) && commonService.hasValue(quotationId.$)) {
						illustrationUIService.findDocument_V3($scope.resourceURL, quotationId.$).then(function(data){
							$scope.loadingOfUQ = $scope.illustrationService.findElementInDetail_V3(['Loading']).$;
							if ($scope.salecaseService.product == 'FIR') {
								$scope.totalPremiumOfUQ = $scope.illustrationService.findElementInDetail_V3(['TotalPremium']).$;
								$scope.stampDutyOfUQ = $scope.illustrationService.findElementInDetail_V3(['StampDuty']).$;
								$scope.revisedPremiumOfUQ = $scope.illustrationService.findElementInDetail_V3(['TotalPayable']).$;
							}
							if ($scope.salecaseService.product == commonService.CONSTANTS.PRODUCT.GUARANTEED_CASHBACK) {
								$scope.yearlyPremiumOfUQ = $scope.illustrationService.findElementInDetail_V3(['YearlyPremium']).$;
								$scope.loadingForFrequencyOfUQ = $scope.illustrationService.findElementInDetail_V3(['LoadingForFrequency']).$;
								$scope.premiumFrequencyPayableOfUQ = $scope.illustrationService.findElementInDetail_V3(['PremiumFrequencyPayable']).$;
							}
							if ($scope.salecaseService.product == 'term-life-secure') {
								$scope.monthlyPremiumOfUQ = $scope.illustrationService.findElementInDetail_V3(['MonthlyPremium']).$;
								$scope.yearlyPremiumOfUQ = $scope.illustrationService.findElementInDetail_V3(['YearlyPremium']).$;
								$scope.loadingForFrequencyOfUQ = $scope.illustrationService.findElementInDetail_V3(['LoadingForFrequency']).$;
								$scope.premiumFrequencyPayableOfUQ = $scope.illustrationService.findElementInDetail_V3(['PremiumFrequencyPayable']).$;
							}
						});

					}
				}
//			}
		}
	};
	$scope.populateValue();

    $scope.init = function init () {
        var self = this;
        self.moduleIcon='fa fa-pencil-square-o';
        //underwritingUIService.detail = {"IposDocument":{"@xmlns":"http:\/\/www.csc.com\/integral\/common","@xmlns:underwriting":"http:\/\/www.csc.com\/integral\/underwriting","@xmlns:xsi":"http:\/\/www.w3.org\/2001\/XMLSchema-instance","@xsi:schemaLocation":"http:\/\/www.csc.com\/integral\/underwriting underwriting-document.xsd ","Header":{"DocInfo":{"DocType":"underwriting","Product":"motor-private-car-m-as","DefUid":"bd00b266-d084-4cbd-859c-2b21a8f5f313","DocId":"e304cfef-fb7e-43a8-ad2f-1531419f3bb1","DocName":"underwriting-DefaultName","DocVersion":"","OwnerUid":"agent1@ipos.com","CreatedDate":"2015-11-06 17-23-29","UpdatedDate":"2015-11-06 17-23-29","UpdatedUserUid":"","Tags":"","Star":"","Archived":"","Comments":""},"DocAccessControllList":{"User":{"@userid":"","Permisions":{"Permision":""}}},"DocStatus":{"DocumentStatus":"","BusinessStatus":"DRAFT"}},"Data":{"underwriting:UnderwritingInfo":{"@vpms-suffix":"UnderwritingInfo","underwriting:DocumentRelation":{"@vpms-suffix":"DocumentRelation","underwriting:CaseID":{"@editable":"1","@mandatory":"0","@visible":"0","@vpms-suffix":"CaseID","$":"e1b39932-0265-4218-9e66-3b6e81aa1307"},"underwriting:CaseName":{"@editable":"1","@mandatory":"0","@visible":"1","@vpms-suffix":"CaseName","$":"SC98544121"}},"underwriting:Quotation":{"@vpms-suffix":"Quotation","underwriting:BasicInformation":{"@vpms-suffix":"BasicInformation","underwriting:InceptionDate":{"@editable":"0","@mandatory":"0","@refVal":"\/IposDocument[Header\/DocInfo\/DocType\/text()='illustration']\/\/Data\/\/BasicInformation\/InceptionDate","@visible":"1","@vpms-suffix":"InceptionDate","$":"2015-11-06"},"underwriting:ExpiryDate":{"@editable":"0","@mandatory":"0","@refVal":"\/IposDocument[Header\/DocInfo\/DocType\/text()='illustration']\/\/Data\/\/BasicInformation\/ExpiryDate","@visible":"1","@vpms-suffix":"ExpiryDate","$":"2016-11-05"},"underwriting:EffectiveDate":{"@editable":"0","@mandatory":"0","@refVal":"\/IposDocument[Header\/DocInfo\/DocType\/text()='illustration']\/\/Data\/\/BasicInformation\/EffectiveDate","@visible":"1","@vpms-suffix":"EffectiveDate","$":"2015-11-06"},"underwriting:BillingCurrency":{"@editable":"0","@mandatory":"0","@refVal":"\/IposDocument[Header\/DocInfo\/DocType\/text()='illustration']\/\/Data\/\/BasicInformation\/BillingCurrency","@visible":"1","@vpms-suffix":"BillingCurrency","Options":{"Option":""},"Value":"SGD"}},"underwriting:VehicleInformation":{"@vpms-suffix":"VehicleInformation","underwriting:VehicleNumber":{"@editable":"0","@mandatory":"0","@refVal":"\/IposDocument[Header\/DocInfo\/DocType\/text()='illustration']\/\/Data\/\/VehicleInformation\/VehicleNo","@visible":"1","@vpms-suffix":"VehicleNumber","$":"342523"},"underwriting:MakeOrModel":{"@editable":"0","@mandatory":"0","@refVal":"\/IposDocument[Header\/DocInfo\/DocType\/text()='illustration']\/\/Data\/\/VehicleInformation\/MakeOrModel","@visible":"1","@vpms-suffix":"MakeOrModel","$":"BLJ01"},"underwriting:YearOfManufacture":{"@editable":"0","@mandatory":"0","@refVal":"\/IposDocument[Header\/DocInfo\/DocType\/text()='illustration']\/\/Data\/\/VehicleInformation\/YearOfManufacture","@visible":"1","@vpms-suffix":"YearOfManufacture","$":"2014"}},"underwriting:QuotationResult":{"@vpms-suffix":"QuotationResult","underwriting:SumInsured":{"@editable":"0","@mandatory":"0","@refVal":"\/IposDocument[Header\/DocInfo\/DocType\/text()='illustration']\/\/Data\/\/Coverage\/SumInsured","@visible":"1","@vpms-suffix":"SumInsured","$":"120000"},"underwriting:TotalPayablePremium":{"@editable":"0","@mandatory":"0","@refVal":"\/IposDocument[Header\/DocInfo\/DocType\/text()='illustration']\/\/Data\/\/Outputs\/IllustrationPemium\/TotalPayablePremium","@visible":"1","@vpms-suffix":"TotalPayablePremium","$":"1,712.81"},"underwriting:StampDuty":{"@editable":"0","@mandatory":"0","@refVal":"\/IposDocument[Header\/DocInfo\/DocType\/text()='illustration']\/\/Data\/\/Outputs\/IllustrationPemium\/StampDuty","@visible":"1","@vpms-suffix":"StampDuty","$":"10.00"},"underwriting:TotalPremium":{"@editable":"0","@mandatory":"0","@refVal":"\/IposDocument[Header\/DocInfo\/DocType\/text()='illustration']\/\/Data\/\/Outputs\/IllustrationPemium\/TotalPremium","@visible":"0","@vpms-suffix":"TotalPremium","$":"1,702.81"}}},"underwriting:UnderwritingDecisionInfo":{"@vpms-suffix":"UnderwritingDecisionInfo","underwriting:UnderwriterId":{"@editable":"1","@mandatory":"0","@visible":"1","@vpms-suffix":"UnderwriterId"},"underwriting:UnderwriterName":{"@editable":"1","@mandatory":"0","@visible":"1","@vpms-suffix":"UnderwriterName"},"underwriting:UnderwritingDecisionCd":{"@editable":"1","@mandatory":"0","@visible":"1","@vpms-suffix":"UnderwritingDecisionCd","Options":{"Option":""},"Value":""},"underwriting:UnderwriterRemark":{"@editable":"1","@mandatory":"0","@visible":"1","@vpms-suffix":"UnderwriterRemark"}},"underwriting:OwnerInfo":{"@vpms-suffix":"OwnerInfo","underwriting:OwnerId":{"@editable":"1","@mandatory":"0","@visible":"1","@vpms-suffix":"OwnerId"},"underwriting:OwnerName":{"@editable":"1","@mandatory":"0","@refVal":"\/IposDocument[Header\/DocInfo\/DocType\/text()='application']\/\/Data\/\/PolicyOwnerInformation\/PersonName\/FullName","@visible":"1","@vpms-suffix":"OwnerName","$":"Chaos Knight"}},"underwriting:CustomerDecision":{"@editable":"1","@mandatory":"0","@visible":"1","@vpms-suffix":"CustomerDecision","Options":{"Option":""},"Value":""},"underwriting:CounterOffers":{"@counter":"1","@maxOccurs":"1","@minOccurs":"1","@vpms-suffix":"CounterOffers","underwriting:CounterOffer":{"@vpms-suffix":"CounterOffer","underwriting:Loading":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"Loading"}}},"underwriting:PremiumDetails":{"@vpms-suffix":"PremiumDetails","underwriting:GrossPremium":{"@validate":"Number expected instead of '1,702.81'","@vpms-suffix":"GrossPremium"},"underwriting:RevisedTotalPayablePremium":{"@validate":"Number expected instead of '1,712.81'","@vpms-suffix":"RevisedTotalPayablePremium"}},"underwriting:AgentRemark":{"@editable":"0","@mandatory":"0","@visible":"0","@vpms-suffix":"AgentRemark"},"underwriting:IsPickup":{"@default":"N","@editable":"1","@mandatory":"0","@visible":"0","@vpms-suffix":"IsPickup","Options":{"Option":""},"Value":"N"},"underwriting:Result":{"@vpms-suffix":"Result","underwriting:Details":{"@counter":"3","@maxOccurs":"","@minOccurs":"3","@vpms-suffix":"Details","underwriting:Detail":[{"@vpms-suffix":"Detail","underwriting:Error":{"@default":"","@editable":"0","@mandatory":"0","@refVal":"\/IposDocument[Header\/DocInfo\/DocType\/text()='uwrule']\/\/Data\/\/UWRule\/Result\/Details\/Detail[1]\/Error","@visible":"0","@vpms-suffix":"Error","$":"SILM"}},{"@vpms-suffix":"Detail","underwriting:Error":{"@default":"","@editable":"0","@mandatory":"0","@refVal":"\/IposDocument[Header\/DocInfo\/DocType\/text()='uwrule']\/\/Data\/\/UWRule\/Result\/Details\/Detail[2]\/Error","@visible":"0","@vpms-suffix":"Error"}},{"@vpms-suffix":"Detail","underwriting:Error":{"@default":"","@editable":"0","@mandatory":"0","@refVal":"\/IposDocument[Header\/DocInfo\/DocType\/text()='uwrule']\/\/Data\/\/UWRule\/Result\/Details\/Detail[3]\/Error","@visible":"0","@vpms-suffix":"Error"}}]},"underwriting:STP":{"@default":"","@editable":"0","@mandatory":"0","@refVal":"\/IposDocument[Header\/DocInfo\/DocType\/text()='uwrule']\/\/Data\/\/UWRule\/Result\/STP","@visible":"0","@vpms-suffix":"STP","$":"N"}}}}}};
        self.generalConfigCtrl('UnderwritingDetailCtrl', underwritingUIService).then(function doneSetup(){

        });
        if(underwritingUIService.productName == "motor-private-car-m-as"||underwritingUIService.productName == "GTL1" || underwritingUIService.productName == commonService.CONSTANTS.PRODUCT.TRAVEL_EXPRESS || underwritingUIService.productName == commonService.CONSTANTS.PRODUCT.GROUP_TRAVEL_EXPRESS
        	|| underwritingUIService.productName == commonService.CONSTANTS.PRODUCT.REGULAR_UNIT_LINK
        	|| underwritingUIService.productName == commonService.CONSTANTS.PRODUCT.REGULAR_SAVE_LINK
        	|| underwritingUIService.productName == commonService.CONSTANTS.PRODUCT.ENDOWMENT) {
	        $scope.getUnderwritingLazyList().then(function(data){
	        	self.generalConfigCtrl('UnderwritingDetailCtrl', underwritingUIService).then(function doneSetup(){
	        		/*var parentCard = self.uiStructureRoot.parent;
	        		if(parentCard.name == 'case-management-fire:UnderwritingComment'){
	        			//turn on card comments, turn off card information
	        			self.setVisibleCard("underwriting-fire:Summary", false);
	        			self.setVisibleCard("underwriting-fire:Findings", false);
	        			self.setVisibleCard("underwriting-fire:Comments", true);
	        		}*/
	        		 $scope.moduleService = underwritingUIService;
	        		  //hle56
                      if(window.cordova){
                         mobileAppCoreModule.check_sync_fail([salecaseUIService.findElementInDetail_V3(["DocId"]),"PRESSED_CO"]).then(function (data){
                             if(data.code == "YES"){
                                 $scope.alreadyAcOrReCO = true;
                             }else{
                                 $scope.alreadyAcOrReCO = false;
                             }
                         });
                      }
	        	});
	            $scope.isOpenedDetail = true;

	        });
        } else {
        	self.generalConfigCtrl('UnderwritingDetailCtrl', underwritingUIService).then(function doneSetup(){
        	});
        }

        //$scope.getComputeLazy();
    };

    $scope.underwritingDecisionList = {"UnderwriterDecision":{"Option":[{"value":"Accept","group":""},{"value":"Reject","group":""},{"value":"CounterOffer","group":""}]},"CustomerDecision":{"Option":[{"value":"Accept","group":""},{"value":"Reject","group":""},{"value":"CounterOffer","group":""}]}};
	$scope.underwritingDecision = {};
	$scope.underwritingDecision.Value = "Accept";

	$scope.acceptUnderwritingForUnderwriter = function() {
		if (!commonService.hasValueNotEmpty(underwritingUIService.findElementInDetail_V3(['Comments', 'Comment']).RemarkText) && underwritingUIService.productName != "GTL1") {
			commonUIService.showNotifyMessage("v3.mynewworkspace.message.underwriting.PleaseEnterComments");
		} else {
			underwritingUIService.saveDetail_V3($scope.resourceURL, false).then(function(data){
				if (underwritingUIService.isSuccess(data)){
					commonUIService.showNotifyMessage("v3.mynewworkspace.message.SaveUnderwritingSuccessfully", "success");
					var action = "accept";
					var docId = underwritingUIService.findElementInDetail_V3(['DocId']);
					var dataSet = underwritingUIService.detail;
					var product = underwritingUIService.productName;
					underwritingUIService.doUnderwriting($scope.resourceURL, dataSet, docId,action,product).then(function(data){
						if (underwritingUIService.isSuccess(data)){
							var status = underwritingUIService.findElementInDetail_V3(['DocStatus'])['BusinessStatus'];
							if(status == 'ACCEPTED' || status == 'Accepted') {
								$scope.refreshDetail();
								commonUIService.showNotifyMessage("v3.mynewworkspace.message.AcceptUnderwritingSuccessfully", "success");
							}
						}
						else
							commonUIService.showNotifyMessage("v3.mynewworkspace.message.AcceptUnderwritingUnsuccessfully");
					});
				}
				else commonUIService.showNotifyMessage("v3.mynewworkspace.message.SaveUnderwritingUnsuccessfully");

			});

		}
	};

	$scope.rejectUnderwritingForUnderwriter = function() {
		if (!commonService.hasValueNotEmpty(underwritingUIService.findElementInDetail_V3(['Comments', 'Comment']).RemarkText) && underwritingUIService.productName != "GTL1") {
			commonUIService.showNotifyMessage("v3.mynewworkspace.message.underwriting.PleaseEnterComments");
			underwritingUIService.findElementInDetail_V3(['Comments', 'Comment']).errorMessage ="MSG-C01";
		} else {
			underwritingUIService.saveDetail_V3($scope.resourceURL, false).then(function(data){
				if (underwritingUIService.isSuccess(data)){
					commonUIService.showNotifyMessage("v3.mynewworkspace.message.SaveUnderwritingSuccessfully", "success");
					var action = "reject";
					var docId = underwritingUIService.findElementInDetail_V3(['DocId']);
					var dataSet = underwritingUIService.detail;
					var product = underwritingUIService.productName;
					if (product != 'GTL1') {
						product = "";
					}
					underwritingUIService.doUnderwriting($scope.resourceURL, dataSet, docId, action, product).then(function(data){
						if (underwritingUIService.isSuccess(data)){
							commonUIService.showNotifyMessage("v3.mynewworkspace.message.RejectUnderwritingSuccessfully", "success");
						}
						else
							commonUIService.showNotifyMessage("v3.mynewworkspace.message.RejectUnderwritingUnsuccessfully");
					});
				}
				else commonUIService.showNotifyMessage("v3.mynewworkspace.message.SaveUnderwritingUnsuccessfully");

			});
		}
	};

	$scope.counterOfferUnderwritingForUnderwriter = function() {
		if (!commonService.hasValueNotEmpty(underwritingUIService.findElementInDetail_V3(['Comments', 'Comment']).RemarkText) && underwritingUIService.productName != "GTL1") {
			commonUIService.showNotifyMessage("v3.mynewworkspace.message.underwriting.PleaseEnterComments");
		} else {
			underwritingUIService.saveDetail_V3($scope.resourceURL, false).then(function(data){
				if (underwritingUIService.isSuccess(data)){
					commonUIService.showNotifyMessage("v3.mynewworkspace.message.SaveUnderwritingSuccessfully", "success");
					var action = "counter-offer";
					var docId = underwritingUIService.findElementInDetail_V3(['DocId']);
					var dataSet = underwritingUIService.detail;
					underwritingUIService.doUnderwriting($scope.resourceURL, dataSet, docId,action,"").then(function(data){
						if (underwritingUIService.isSuccess(data)){
							$scope.refreshDetail();
//							var confirm = $mdDialog.confirm()
//					            .title($translate.instant("v3.mynewworkspace.message.CounterOfferUnderwritingSuccessfully"))
//					            .ok('OK');
//					        $mdDialog.show(confirm).then(function() {
//					        	$scope.$parent.refreshDetail();
//					        }, function() {});
							commonUIService.showNotifyMessage("v3.mynewworkspace.message.CounterOfferUnderwritingSuccessfully", "success");
						}
						else
							commonUIService.showNotifyMessage("v3.mynewworkspace.message.CounterOfferUnderwritingUnsuccessfully");
					});
				}
				else commonUIService.showNotifyMessage("v3.mynewworkspace.message.SaveUnderwritingUnsuccessfully");

			});
		}
	};

	$scope.counterOfferUnderwritingForAgent = function(action) {
		if ($scope.checkIsSignedUQDocument() == false){//for MNC Link
			return commonUIService.showNotifyMessage("v3.mynewworkspace.message.PleaseSignUWBeforeAccept");
		}
		underwritingUIService.saveDetail_V3($scope.resourceURL, false).then(function(result){
			var docId = underwritingUIService.findElementInDetail_V3(['DocId']);
			var dataSet = underwritingUIService.detail;
			var product = underwritingUIService.productName;
			if (action == 'reject-offer') {
				product = "";
			}
			underwritingUIService.doUnderwriting($scope.resourceURL, dataSet, docId, action, product).then(function(data){
			     $scope.alreadyAcOrReCO = true; // after choose CO, disable all button.
				if (underwritingUIService.isSuccess(data) && (data == undefined || data.code == undefined || data.code == '')){
					if(action == 'accept-offer'){
						var status = underwritingUIService.findElementInDetail_V3(['DocStatus'])['BusinessStatus'];
						if(status == 'ACCEPT-COUNTER-OFFERED') {
							$scope.refreshDetail();
							commonUIService.showNotifyMessage("v3.mynewworkspace.message.AcceptCounterOfferUnderwritingSuccessfully", "success");
						}
					}
					if(action == 'reject-offer'){
						var status = underwritingUIService.findElementInDetail_V3(['DocStatus'])['BusinessStatus'];
						if(status == 'REJECT-COUNTER-OFFERED') {
							commonUIService.showNotifyMessage("v3.mynewworkspace.message.RejectCounterOfferUnderwritingSuccessfully", "success");
						}
					}
				}else{
				    if( data.code == "SYNC_CO_FAIL"){
				        $scope.alreadyAcOrReCO = true;
				        commonUIService.showNotifyMessage("v3.mobile.check.sync.underwriting.fail","fail");
				    }else if( data.code == "FAIL"){
                        $scope.alreadyAcOrReCO = true;
                        commonUIService.showNotifyMessage("v3.mobile.check.sync.underwriting.fail","fail");
                    } else if( data.code == "CALL_CO_FAIL"){
				        $scope.alreadyAcOrReCO = true;
                        commonUIService.showNotifyMessage("v3.mobile.check.sync.underwriting.fail","fail");
				    }else if( data.code == "DOC_NOT_FOUND"){
				         $scope.alreadyAcOrReCO = true;
                         commonUIService.showNotifyMessage("v3.mobile.check.sync.underwriting.fail","fail");
                    }else if(data.code == "NO_CONNECTION") {
                        $scope.alreadyAcOrReCO = true;
                        commonUIService.showNotifyMessage("v3.mobile.check.sync.NO_CONNECTION","fail");
				    }else if(action == 'accept-offer'){
						commonUIService.showNotifyMessage("v3.mynewworkspace.message.AcceptCounterOfferUnderwritingUnsuccessfully");
					}else if(action == 'reject-offer'){
						commonUIService.showNotifyMessage("v3.mynewworkspace.message.RejectCounterOfferUnderwritingUnsuccessfully");
					}
				}
					
			}); 
		});
	};
	
	//MNC Link - check whether agent is do e-signed for BT05 Underwriting Quotation
	$scope.checkIsSignedUQDocument = function() {
		var isValid = true;
		if (underwritingUIService.productName == commonService.CONSTANTS.PRODUCT.REGULAR_UNIT_LINK ||
			underwritingUIService.productName == commonService.CONSTANTS.PRODUCT.REGULAR_SAVE_LINK ||
			underwritingUIService.productName == commonService.CONSTANTS.PRODUCT.ENDOWMENT) {
			isValid = false;
			var listAllTransactionDoucument = $scope.moduleService.convertToArray($scope.salecaseService.findElementInDetail_V3(["Print"]));
			for(var i=0; i<listAllTransactionDoucument.length; i++){
				var resourceType = $scope.moduleService.findElementInElement_V3(listAllTransactionDoucument[i], ["ResourceType"]).$;
				//PT05 is Underwriting Quotation, do not check sign Underwriting Quotation to show UW Tile
				if($scope.moduleService.findElementInElement_V3(listAllTransactionDoucument[i], ["IsSign"]).$ == "Y" && resourceType == "PT05"){
					if($scope.moduleService.findElementInElement_V3(listAllTransactionDoucument[i], ["Signed"]).$ == "Y"){
						isValid = true;
					}
					break;
				}
			}
		}
		return isValid;
	}
	
	$scope.submitUnderwriting = function() {
		var underwritingOriginalDetail = underwritingUIService.originalDetail;
		function recomputeLoading() {
			var deferred = underwritingUIService.$q.defer();
			if (underwritingUIService.findElementInDetail_V3(['UnderwritingDecisionCd']).Value == 'COUNTER-OFFER') {
				$scope.compute().then(function(data) {
					deferred.resolve(data);
				});
			} else 
				deferred.resolve(underwritingUIService.detail);
			return deferred.promise;
		}
		recomputeLoading().then(function(data){
			if (underwritingUIService.isSuccess(data)) {
				underwritingUIService.saveDetail_V3($scope.resourceURL, false).then(function(data){
					if (underwritingUIService.isSuccess(data)){
						commonUIService.showNotifyMessage("v3.mynewworkspace.message.SaveUnderwritingSuccessfully", "success");
						var action = commonService.CONSTANTS.ACTIONTYPE.UNDERWRITING_ACTION[underwritingUIService.findElementInDetail_V3(['UnderwritingDecisionCd']).Value];
						var docId = underwritingUIService.findElementInDetail_V3(['DocId']);
						var dataSet = underwritingUIService.detail;
						var product = underwritingUIService.productName;
						underwritingUIService.doUnderwriting($scope.resourceURL, dataSet, docId,action,product).then(function(data){
							if (underwritingUIService.isSuccess(data)){
								commonUIService.showNotifyMessage("v3.mynewworkspace.message.SubmitUnderwritingSuccessfully", "success");
								underwritingUIService.freeze = true;
							} else {
								commonUIService.showNotifyMessage("v3.mynewworkspace.message.SubmitUnderwritingUnsuccessfully");
								underwritingUIService.detail = underwritingOriginalDetail;
								underwritingUIService.saveDetail_V3($scope.resourceURL, false).then(function(data){ });
							}
						}); 
					}
					else commonUIService.showNotifyMessage("v3.mynewworkspace.message.SaveUnderwritingUnsuccessfully");
					
				});
			}
		});
	};
	
	$scope.submitUnderwritingForAgent = function() {
		underwritingUIService.saveDetail_V3($scope.resourceURL, false).then(function(result){
			var action = commonService.CONSTANTS.ACTIONTYPE.UNDERWRITING_ACTION[underwritingUIService.findElementInDetail_V3(['CustomerDecision']).Value];
			var docId = underwritingUIService.findElementInDetail_V3(['DocId']);
			var dataSet = underwritingUIService.detail;
			if(action == "accept") action = 'accept-offer';
			if(action == "reject") action = 'reject-offer';
			var product = underwritingUIService.findElementInDetail_V3(['Product']);
			underwritingUIService.doUnderwriting($scope.resourceURL, dataSet, docId, action, product).then(function(data){
				if (underwritingUIService.isSuccess(data)){
					commonUIService.showNotifyMessage("v3.mynewworkspace.message.SubmitUnderwritingSuccessfully", "success");
					var status = underwritingUIService.findElementInDetail_V3(['DocStatus'])['BusinessStatus']; 
					if(status == 'ACCEPTED') {
						$scope.generateEcovernoteAndPayment();
					} else {
						// $scope.reSetupConcreteUiStructure(salecaseUIService.detail);
						var parentCtrl = $scope.getParentCtrlInCharge();
			            uiRenderPrototypeService.reSetupConcreteUiStructure(parentCtrl.uiStructureRoot, salecaseUIService.detail, $scope.resourceURL);
					}
				} else
					commonUIService.showNotifyMessage("v3.mynewworkspace.message.SubmitUnderwritingUnsuccessfully");
			}); 
		});
	};
	
	$scope.refreshDetail = function(){
		var docId = underwritingUIService.findElementInDetail_V3(['DocInfo']).DocId;
		underwritingUIService.findDocument_V3($scope.resourceURL, docId).then(function(data){
			var status = underwritingUIService.findElementInDetail_V3(['DocStatus'])['BusinessStatus']; 
			if(status == 'ACCEPTED' || status == 'ACCEPT-COUNTER-OFFERED') {
				if(underwritingUIService.productName == 'FIR'){
					$scope.generatePayment();
				} else {
					$scope.generateEcovernoteAndPayment();
				}
			} 
			
			if(status == 'COUNTER-OFFERED' || status == 'ACCEPT-COUNTER-OFFERED' || status == 'REJECT-COUNTER-OFFERED') {
				$scope.populateValue();
			}
			$scope.reSetupConcreteUiStructure(underwritingUIService.detail); // refresh the values in multiple cards
			$scope.$parent.refreshDetail();
		});
	};
	
	$scope.generateEcovernoteAndPayment = function() {
		var saleCaseID = salecaseUIService.findElementInDetail_V3(['DocId']);
		salecaseUIService.findDocument_V3($scope.resourceURL, saleCaseID).then(function(data){
			var eCoverNoteDocId = salecaseUIService.findElementInDetail_V3(['eCoverNote'])['@refUid'];
			if(eCoverNoteDocId != ''){
				// Show ecover and payment card
				$scope.setVisibleAfterUW();
				// Generate DocName for eCoverNote
				ecovernoteUIService.findDocumentToEdit_V3($scope.resourceURL, salecaseUIService.product, eCoverNoteDocId).then(function(data){
					ecovernoteUIService.findElementInDetail_V3(['DocInfo'])['DocName'] = applicationUIService.findElementInDetail_V3(['DocInfo'])['DocName'];
					ecovernoteUIService.saveDetail_V3($scope.resourceURL, false).then(function(data){
					});
				});
			} else {
				// For refresh document center of business case
				// $scope.reSetupConcreteUiStructure(salecaseUIService.detail);
				var parentCtrl = $scope.getParentCtrlInCharge();
	            uiRenderPrototypeService.reSetupConcreteUiStructure(parentCtrl.uiStructureRoot, salecaseUIService.detail, $scope.resourceURL);
			}
		});
	};
	
	$scope.generatePayment = function() {
		var saleCaseID = salecaseUIService.findElementInDetail_V3(['DocId']);
		salecaseUIService.findDocument_V3($scope.resourceURL, saleCaseID).then(function(data){
			if (salecaseUIService.product == 'FIR') {
				$scope.setVisibleAfterUWFire();
			}
			if (salecaseUIService.product == commonService.CONSTANTS.PRODUCT.GUARANTEED_CASHBACK) {
				$scope.setVisibleAfterUWGCS();
			}
		});
	};
	
    $scope.attachUWDocument = function attachUWDocument () {
        if(!$scope.formLetterList.length){
            commonUIService.showNotifyMessage("v3.mynewworkspace.message.chooseFileToAttach");
            return;
        }
        $scope.continuetoUpLoad ();
     
    };
    //attach file to BC RUL
    $scope.continuetoUpLoad = function continuetoUpLoad () {
    	if($scope.formLetterList.length){
    		var caseId = salecaseUIService.findElementInDetail_V3(["DocId"]);
    		var documentName = $translate.instant('v3.underwriting.rul.UWForm.' + $scope.formLetterList[0].documentName);
          	$scope.uploadDocument($scope.resourceURL, caseId, documentName).then(function(data){
          		 if (!underwritingUIService.isSuccess(data)) {
          			commonUIService.showNotifyMessage("v3.mynewworkspace.message.attachNotSuccessfull");
                 }else{
                	$scope.formLetterList.splice(0, 1);
                	
					//send notification
                	if($scope.formLetterList.length == 0){
	                	var sendNotificationResourceUrl = underwritingUIService.initialMethodPortletURL(myArrayPortletId["my-new-workspace"], "sendNotificationWithEventCode");
	        			underwritingUIService.sendNotificationWithEventCode(sendNotificationResourceUrl, {
	        				caseId: caseId,
	        				eventCode: "ECMNCLIFE007"
	        			}).then(function(data){
	        				$log.debug("Send notification successfully");
	        			});
                	}
        			
                 	$scope.salecaseService.detail = data;
                 	commonUIService.showNotifyMessage("v3.mynewworkspace.message.attachSuccessfull", "success");
                 	$scope.continuetoUpLoad();
                 }
          	});
    	}        		
    }
    
    // compute Premium after select Counter Offer and input Loading
	$scope.uploadDocument = function uploadDocument(resourceUrl, caseId, documentName){
		var deferred = underwritingUIService.$q.defer();
		underwritingUIService.attachUWDocument($scope.resourceURL, caseId, documentName).then(function(data){
			deferred.resolve(data);
		});
		return deferred.promise;
	};
    
    $scope.addNewUWFormAndLetter = function addNewUWFormAndLetter (docName, docType) {
    	for (var i = 0; i < $scope.formLetterList.length; i++){
    		if($scope.formLetterList[i].documentName == docName){
    			commonUIService.showNotifyMessage("v3.mynewworkspace.message.cannotAddDubplicate");
    			return;
    		}
    	}
    	$scope.formLetterList.push({"documentName": docName, "documentType": docType});
    	if(docType == 'form'){
    		underwritingUIService.findElementInDetail_V3(['UWForm']).Value = "";
    	}else if(docType == 'letter'){
    		underwritingUIService.findElementInDetail_V3(['UWLetter']).Value = "";
    	}
    }
    $scope.removeUWFormAndLetter = function removeUWFormAndLetter (index) {
    	$scope.formLetterList.splice(index, 1);
    }

	
	// compute Premium after select Counter Offer and input Loading
	$scope.compute = function(){
		var deferred = underwritingUIService.$q.defer();
		var loading = underwritingUIService.findElementInDetail_V3(['Loading']).$;
		$scope.isCompute.click = true;
		if(Number(loading)<0){
			commonUIService.showNotifyMessage("v3.mynewworkspace.message.LoadingIsNegativeValue");
			deferred.resolve();
		}else{
			underwritingUIService.computeUnderWritingDetail($scope.resourceURL, underwritingUIService.productName).then(function(data){
				if (underwritingUIService.isSuccess(data)) {
					commonUIService.showNotifyMessage("v3.mynewworkspace.message.ComputeUnderwritingSuccessfully", "success");
				} else {
					commonUIService.showNotifyMessage("v3.mynewworkspace.message.ComputeUnderwritingUnsuccessfully");
				}
				deferred.resolve(data);
			});
		}
		return deferred.promise;
	};
	
    $scope.pend = function(){
    	underwritingUIService.findElementInDetail_V3(['DocStatus'])['BusinessStatus'] = 'PENDING';
    	underwritingUIService.saveDetail_V3($scope.resourceURL, false).then(function(data){
			if (underwritingUIService.isSuccess(data)) {
				commonUIService.showNotifyMessage("v3.mynewworkspace.message.SaveUnderwritingSuccessfully", "success");
			}
			else{
				commonUIService.showNotifyMessage("v3.mynewworkspace.message.SaveUnderwritingUnsuccessfully");
			}
		});
    };
    
    $scope.cancelUnderwriting = function(){
    	var newURL = urlService.urlMap.MY_UNDERWRITING_SPACE;
    	window.open(newURL, '_self');
    };
    
    $scope.gotoCase = function gotoMyNewWorkSpace (metaCard) {
        var params = {
        		DocType: "case-management" ,
            	DocId: underwritingUIService.findElementInDetail_V3(['underwriting:CaseID']).$ ,
            	Product: underwritingUIService.findElementInDetail_V3(['DocInfo'])['Product']

    

            };
    	commonUIService.goToPortlet("NEW_MY_WORKSPACE", params, true);
    };
    
    
	$scope.init();

	// print application pdf for travel express in underwrting screen
	$scope.printApplicationPdf = function() {
		salecaseUIService.getDocumentDetail_V3($scope.resourceURL, underwritingUIService.findElementInDetail_V3(['CaseID']).$).then(function(data) {
			if (salecaseUIService.isSuccess(data)) {
				applicationUIService.getDocumentDetail_V3($scope.resourceURL, salecaseUIService.findElementInDetail_V3(['Application'])['@refUid']).then(function(data) {
					if (applicationUIService.isSuccess(data)) {
						applicationUIService.generateDocument_V3($scope.portletId).then(function(data) {
							if (applicationUIService.isSuccess(data)) {
								applicationUIService.productName = salecaseUIService.findElementInDetail_V3(['Product']);
								applicationUIService.group = applicationUIService.getProductGroup_V3(applicationUIService.productName);
								applicationUIService.findElementInDetail_V3(['CaseID']).$ = underwritingUIService.findElementInDetail_V3(['CaseID']).$;
								var businessType = salecaseUIService.findElementInDetail_V3(['@case-name']);
								$scope.printPdfService.generatePdf($scope.portletId, applicationUIService, applicationUIService.productName, businessType.toLowerCase());
							} else {
								commonUIService.showNotifyMessage("v3.myworkspace.message.GeneratePDFUnsuccessfully");
							}
						});
					} else {
						commonUIService.showNotifyMessage("v3.myworkspace.message.GeneratePDFUnsuccessfully");
					} 
				});
			} else {
				commonUIService.showNotifyMessage("v3.myworkspace.message.GeneratePDFUnsuccessfully");
			} 
		});
	};
	
	$scope.expiryAndWithdrawn = function(){
		underwritingUIService.findElementInDetail_V3(['DocStatus'])['BusinessStatus'] = "EXPIRED";
		salecaseUIService.findElementInDetail_V3(['DocStatus'])['BusinessStatus'] = "EXPIRED";
		salecaseUIService.saveDetail_V3($scope.resourceURL, false).then(function(data){
			if (salecaseUIService.isSuccess(data)){
				$log.debug("Saved Case Successfully!")
				underwritingUIService.saveDetail_V3($scope.resourceURL,false).then(function(data){
					if (underwritingUIService.isSuccess(data)){
						commonUIService.showNotifyMessage("v3.mynewworkspace.message.loggedDecisionSuccessfully", "success");
					}
					else
						commonUIService.showNotifyMessage("v3.mynewworkspace.message.loggedDecisionUnsuccessfully");
				}); 
			}
			else commonUIService.showNotifyMessage("v3.mynewworkspace.message.loggedDecisionUnsuccessfully");
			
		});
		
	};
}];
