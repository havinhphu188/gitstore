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
var CorporateDetailCtrl = ['$scope', '$filter', '$log', '$mdDialog', 'commonService', 'prospectCorporateUIService', 'salecaseUIService', 'commonUIService', 'printPdfService',
	function($scope, $filter, $log, $mdDialog, commonService, prospectCorporateUIService, salecaseUIService, commonUIService, printPdfService) {
	
	$scope.commonUIService = commonUIService;
	$scope.moduleService = prospectCorporateUIService;
	$scope.printPdfService = printPdfService;
	
	// MNC city list
	$scope.BCityCdList = [];
	$scope.RCityCdList = [];
	$scope.MCityCdList = [];

	/**
	 * Will setup stuffs for this ctrl like set moduleUIservice, setup action bar, uiStructure
	 */
    $scope.setupStuffs = function setupStuffs () {
       	this.generalConfigCtrl('CorporateDetailCtrl', prospectCorporateUIService).then(function finishedSetup () {       		
			//TODO: Can call an event fire-up that everything in ctrl has been setup
       	});

		this.initializeObject();
    };

	$scope.getComputeLazy = function() {
		var deferred = prospectCorporateUIService.$q.defer();
		if (!commonService.hasValueNotEmpty(prospectCorporateUIService.lazyChoicelist)) {
			prospectCorporateUIService.getModuleLazyChoicelist_V3($scope.resourceURL).then(function(data) {
				
				// MNC city list
				if (salecaseUIService.product == commonService.CONSTANTS.PRODUCT.GROUP_TRAVEL_EXPRESS) {
					$scope.BCityCdList = prospectCorporateUIService.findElementInElement_V3(prospectCorporateUIService.lazyChoicelist, ['BCityCd']).Option;
					$scope.RCityCdList = prospectCorporateUIService.findElementInElement_V3(prospectCorporateUIService.lazyChoicelist, ['RCityCd']).Option;
					$scope.MCityCdList = prospectCorporateUIService.findElementInElement_V3(prospectCorporateUIService.lazyChoicelist, ['MCityCd']).Option;
				}
				
				deferred.resolve(data);
			});
		} else deferred.resolve();
		return deferred.promise;
	}
	
	$scope.initializeObject = function() {
		$scope.getComputeLazy().then(function() {
			if (!commonService.hasValueNotEmpty(prospectCorporateUIService.findElementInDetail_V3(['DocName']))
					|| prospectCorporateUIService.findElementInDetail_V3(['DocName']).indexOf('Default')!=-1) {
				prospectCorporateUIService.findElementInDetail_V3(['Header'])['DocInfo']['DocName'] = prospectCorporateUIService.genDefaultName();
			}
		})
	}

	$scope.saveCorporate = function() {
		var self = this;
		var deferred = prospectCorporateUIService.$q.defer();
		prospectCorporateUIService.saveDetail_V3($scope.resourceURL, true).then(function(data) {
			deferred.resolve(data);
			if (prospectCorporateUIService.isSuccess(data)) {
				if (commonService.hasValue(salecaseUIService.detail)) {
					var corporateId = prospectCorporateUIService.findElementInDetail_V3(['DocId']);
					var corporate = [];
					if (salecaseUIService.product == commonService.CONSTANTS.PRODUCT.GROUP_TRAVEL_EXPRESS) {
						corporate = salecaseUIService.findElementInDetail_V3(['Prospect']);
					} else {
						corporate = salecaseUIService.findElementInDetail_V3(['PolicyOwner']);
					}
					var corporateName = prospectCorporateUIService.findElementInDetail_V3(['CorporateName']).$;
					for (var i = 0; i < corporate.length; i++) {
						if (!commonService.hasValueNotEmpty(corporate[i]['@refUid'])) {
							corporate[i]['@refUid'] = corporateId;
							var corporateNameObj = salecaseUIService.findElementInElement_V3(corporate[i], ['CorporateName']);
							if (corporateNameObj != undefined) {
								corporateNameObj.$ = corporateName;
							}
							break;
						}
					}
					
					salecaseUIService.saveDetail_V3($scope.resourceURL, false).then(function(data) {
						commonUIService.showNotifyMessage("new.v3.mynewworkspace.corporate.message.SaveCorporateSuccessfully", "success");
						$scope.refreshDetail();
						//$log.debug(salecaseUIService.detail);
						//$rootScope.$broadcast("saveProspect", ['application']);
					});
					
					
				} else {
					commonUIService.showNotifyMessage("new.v3.mynewworkspace.corporate.message.SaveCorporateSuccessfully", "success");
					$scope.refreshDetail();
				};
//				$scope.reSetupConcreteUiStructure(prospectCorporateUIService.detail);
			} else {				
//				if(!commonService.hasValueNotEmpty(prospectCorporateUIService.findElementInDetail_V3(['CorporateName']).$)){
//					commonUIService.showNotifyMessage("v3.myworkspace.message.SaveDraftCorporateUnsuccessfully");
//				} else {
//					var confirm = $mdDialog.confirm()
//			          .title($filter('translate')("MSG-FQ06"))
//	   			      .ok($filter('translate')("v3.yesno.enum.Y"))
//	   			      .cancel($filter('translate')("v3.yesno.enum.N"));
//			    $mdDialog.show(confirm).then(function() {
//			    	prospectCorporateUIService.saveDetail_V3($scope.resourceURL, false).then(function(data){
//			    		if(prospectCorporateUIService.isSuccess(data)){
//			    			commonUIService.showNotifyMessage("v3.myworkspace.message.SaveDraftCorporatesuccessfully", "success");
//			    		}else{
//			    			commonUIService.showNotifyMessage("v3.myworkspace.message.SaveDraftCorporateUnsuccessfully");
//			    		}
//			    	});
//			    }, function() {
//			        var a = 'No';
//			    });
//			    $scope.reSetupConcreteUiStructure (prospectCorporateUIService.detail);
//				}
				commonUIService.showNotifyMessage("new.v3.mynewworkspace.corporate.message.SaveCorporateUnsuccessfully");
			}
		});
		return deferred.promise;
	};
	
	$scope.archiveCorporate = function() {
		var docId = prospectCorporateUIService.findElementInDetail_V3(["DocId"]);
		prospectCorporateUIService.archiveDocument_V3($scope.resourceURL, docId).then(function(data) {
			if (data['ipos-container:map-list']) {
				commonUIService.showNotifyMessage("new.v3.mynewworkspace.message.ArchiveSuccessfully", "success");
				location.reload(true);
			} else {
				commonUIService.showNotifyMessage("new.v3.mynewworkspace.message.ArchiveUnsuccessfully");
			}
		});
	};
	
	$scope.toggleStarCorporate = function() {
		var docId = prospectCorporateUIService.findElementInDetail_V3(["DocId"]);
		if (prospectCorporateUIService.findElementInDetail_V3(['Star']) == '') {
			prospectCorporateUIService.starDocument_V3($scope.resourceURL, docId).then(function(data) {
				if (prospectCorporateUIService.isSuccess(data)) {
					commonUIService.showNotifyMessage("new.v3.mynewworkspace.message.StarSuccessfully", "success");
					prospectCorporateUIService.findElementInDetail_V3(['Header'])['DocInfo']['Star'] = prospectCorporateUIService.findElementInElement_V3(data, ['Star']);
				} else {
					commonUIService.showNotifyMessage("new.v3.mynewworkspace.message.StarUnsuccessfully");
				}
			});
		} else {
			prospectCorporateUIService.unStarDocument_V3($scope.resourceURL, docId).then(function(data) {
				if (prospectCorporateUIService.isSuccess(data)){
					commonUIService.showNotifyMessage("new.v3.mynewworkspace.message.UnStarSuccessfully", "success");
					prospectCorporateUIService.findElementInDetail_V3(['Header'])['DocInfo']['Star'] = prospectCorporateUIService.findElementInElement_V3(data, ['Star']);
				} else {
					commonUIService.showNotifyMessage("new.v3.mynewworkspace.message.UnStarUnsuccessfully");
				}
			});
		}
	}
	
	$scope.refreshDetail = function() {
		var docId = prospectCorporateUIService.findElementInDetail_V3(['DocId']);
		prospectCorporateUIService.findDocumentToEdit_V3($scope.resourceURL, "", docId).then(function(data) {
			$scope.reSetupConcreteUiStructure(prospectCorporateUIService.detail);
		});
	};
	
//	$scope.viewDetails = function() {
//		$scope.moveToCard("BasicInformation");
//	}
	
	$scope.printPdf = function(actionType){
		prospectCorporateUIService.generateDocument_V3($scope.portletId).then(function(data){
			if (prospectCorporateUIService.isSuccess(data)) {
				$scope.saveCorporate().then(function(data){
					if(prospectCorporateUIService.isSuccess(data)){
						$scope.printPdfService.generatePdf($scope.portletId, prospectCorporateUIService, "", "");
					}else{
						commonUIService.showNotifyMessage("v3.myworkspace.message.GeneratePDFUnsuccessfully");
					}
				});
			} else {
				commonUIService.showNotifyMessage("v3.myworkspace.message.GeneratePDFUnsuccessfully");
			}
		});
	};
	
	/**
	 * @author ttan40
	 * Call refreshCityCode() to update new lazy choice list for city by province code
	 * @param card
	 * @param provinceCd
	 * @param cityCdChoiceKey
	 */
    $scope.refreshCityCode = function(card, provinceCd, cityCdChoiceKey){
    	prospectCorporateUIService.findElementInElement_V3(card.refDetail, ['CityCd']).Value = '';
    	$scope[cityCdChoiceKey + 'List'] =  $filter('filterByGroup')(prospectCorporateUIService.findElementInElement_V3(prospectCorporateUIService.lazyChoicelist, [cityCdChoiceKey, 'Option']), provinceCd);
    }
	
	//always in the end of ctrl
    $scope.setupStuffs();
}];