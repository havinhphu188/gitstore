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
var ClientPaymentDetailCtrl = ['$scope', '$log', '$mdDialog', 'ajax', '$state', 'commonService', 'urlService', 'commonUIService', 'paymentUIService', 'salecaseUIService', 'illustrationUIService', 'uiRenderPrototypeService', 'translateService',
	function($scope, $log, $mdDialog, ajax, $state, commonService, urlService, commonUIService, paymentUIService, salecaseUIService, illustrationUIService, uiRenderPrototypeService, translateService) {
	
	$scope.moduleService = paymentUIService;
	$scope.commonUIService = commonUIService;
	
	$scope.moduleService.product = salecaseUIService.product;
	$scope.illustrationService = illustrationUIService;
	$scope.paymentMethod = [{"value": "CASH",},{"value": "CHEQUE",},{"value": "BT",}];
	//paymentUIService.findElementInDetail_V3(['PaymentDate']).$ = moment().format('YYYY-MM-DD');
	$scope.setupStuffs = function setupStuffs () {
		var self = this;
		self.generalConfigCtrl('PaymentDetailCtrl', paymentUIService);
		if (paymentUIService.findElementInDetail_V3(['PaymentDate']).$ == undefined	)	
			paymentUIService.findElementInDetail_V3(['PaymentDate']).$ = moment().format("YYYY-MM-DD");
		//$scope.getComputeLazy();
		$log.debug("this ctrl is processsing for: " + JSON.stringify($scope.getCurrProductInfor()));
	};
	
	$scope.setupStuffs();
	
	$scope.getComputeLazy = function(){
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
	//$scope.getComputeLazy();
	
	$scope.changePaymentMethod = function(){
		paymentUIService.refresh_V3($scope.resourceURL).then(function (data){
			$scope.reSetupConcreteUiStructure(data); // refresh the values in multiple cards
		});
	};
	
	$scope.saveDetail = function(){
		var deferred = paymentUIService.$q.defer();
		paymentUIService.saveDetail_V3($scope.resourceURL, true).then(function(data){
			if (paymentUIService.isSuccess(data)) {
				commonUIService.showNotifyMessage("v3.mynewworkspace.message.SavePaymentSuccessfully", "success");
				paymentUIService.getDetail_V3($scope.resourceURL).then(function(data){
					$scope.reSetupConcreteUiStructure(data); // refresh the values in multiple
				});
			}
			else{
				commonUIService.showNotifyMessage("v3.mynewworkspace.message.SavePaymentUnsuccessfully");
			}
			deferred.resolve(data);
    	});
		return deferred.promise;
	};

	/*generate payment slip*/
	$scope.generatePDF = function() {
	    var self = this;
		$scope.saveDetail().then(function(result) {
			if (paymentUIService.isSuccess(result)){
				// Print pdf
				paymentUIService.generateDocument_V3($scope.portletId).then(function(data) {
					if (paymentUIService.isSuccess(data)) {
//						paymentUIService.jsonToArray(paymentUIService.detail, 'IDs', 'person:ID');
//						paymentUIService.jsonToArray(paymentUIService.detail, 'Contacts', 'person:Contact');
//						paymentUIService.jsonToArray(paymentUIService.detail, 'Addresses', 'person:Address');
						var product = salecaseUIService.findElementInDetail_V3(['@product']);
						var action = salecaseUIService.findElementInDetail_V3(['@case-name']);
						paymentUIService.generatePdf($scope.portletId, "", action.toLowerCase())
						.then(function refreshUIStructure(data) {
						    var deferred = paymentUIService.$q.defer();
						    if(data != undefined){
						        var saleCaseID = salecaseUIService.findElementInDetail_V3(['DocId']);
						        salecaseUIService.getDocumentDetail_V3($scope.resourceURL, saleCaseID).then(function (data) {
						            var parentCtrl = self.getParentCtrlInCharge();
						            uiRenderPrototypeService.reSetupConcreteUiStructure(parentCtrl.uiStructureRoot, salecaseUIService.detail, $scope.resourceURL);
						            deferred.resolve(true);
                                });  
						    } else {
						        commonUIService.showNotifyMessage("v3.myworkspace.message.GeneratePDFUnsuccessfully");
						    }
						    return deferred.promise;
						})
						.then(function clientPay(isGeneratePDFSuccessfull) {
						    if (isGeneratePDFSuccessfull) {
						        paymentUIService.clientPayToAgent($scope.resourceURL).then(function(data){
						            if (paymentUIService.isSuccess(data)) {
						                paymentUIService.getDetail_V3($scope.resourceURL).then(function(data){
						                    $scope.reSetupConcreteUiStructure(data); // refresh the values in multiple cards
						                })
						            } else {
						                commonUIService.showNotifyMessage("v3.mynewworkspace.message.PaymentHasBeenFail");
						            }
						        });
						    }
						})
					} else {
						commonUIService.showNotifyMessage("v3.mynewworkspace.message.SavePaymentUnsuccessfully");
					}
				});
			}
		});
	}
	
	// navigate to payment portlet (termlife secure)
        $scope.goToShoppingCart = function goToShoppingCart() {
    	var newURL = urlService.urlMap.SHOPPINGCART + "?paymentCart=true";
		window.open(newURL, '_self');
    };
}];

