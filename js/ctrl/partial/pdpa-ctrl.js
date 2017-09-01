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
var PdpaDetailCtrl = ['$rootScope', '$scope', '$log', 'commonService', 'pdpaUIService', 'prospectPersonalUIService', 'commonUIService', 'printPdfService',
	function($rootScope, $scope, $log, commonService, pdpaUIService, prospectPersonalUIService, commonUIService, printPdfService) {
	
	$scope.commonUIService = commonUIService;
	$scope.moduleService = pdpaUIService;

	/**
	 * Will setup stuffs for this ctrl like set moduleUIservice, setup action bar, uiStructure
	 */
    $scope.setupStuffs = function setupStuffs () {
       	this.generalConfigCtrl('PdpaDetailCtrl', pdpaUIService).then(function finishedSetup () {       		
			//TODO: Can call an event fire-up that everything in ctrl has been setup
       	});

		this.initializeObject();
    };

	$scope.getComputeLazy = function() {
		var deferred = pdpaUIService.$q.defer();
		if (!commonService.hasValueNotEmpty(pdpaUIService.lazyChoicelist)) {
			pdpaUIService.getModuleLazyChoicelist_V3($scope.resourceURL).then(function(data) {
				deferred.resolve(data);
			});
		} else deferred.resolve();
		return deferred.promise;
	};
	
	$scope.initializeObject = function() {
		$scope.getComputeLazy().then(function() {
			if (!commonService.hasValueNotEmpty(pdpaUIService.findElementInDetail_V3(['DocName']))
					|| pdpaUIService.findElementInDetail_V3(['DocName']).indexOf('Default') != -1) {
				pdpaUIService.findElementInDetail_V3(['Header'])['DocInfo']['DocName'] = pdpaUIService.genDefaultName();
			}
		});
	};
	
	$scope.savePdpa = function() {
		$scope.savePdpaSuccess = false;
		var deferred = pdpaUIService.$q.defer();
		var canSavePdpa = true;
		if (pdpaUIService.findElementInDetail_V3(['Consent']).Value == 'Y') {
			var noCommunicationChannelSelected = true;
			var communicationChannels = pdpaUIService.findElementInDetail_V3(['CommunicationChannel']);
			for (var i = 0; i < communicationChannels.length; i++) {
				if (communicationChannels[i]['pdpa:CommunicationChannelValue'].Value == 'Y') {
					noCommunicationChannelSelected = false;
					break;
				}
			};
			if (noCommunicationChannelSelected) {
				if (companyName != "MNC-Life") {
					canSavePdpa = false;
					commonUIService.showNotifyMessage("new.v3.mynewworkspace.pdpa.message.AtLeastOneCommunicationChannel");
				}
			}
		}
		if (canSavePdpa) {
//			pdpaUIService.saveDetail_V3($scope.resourceURL, true).then(function(data) {
//				if (pdpaUIService.isSuccess(data)) {
//					if (commonService.hasValue(prospectPersonalUIService.detail)) {
//						var pdpaId = pdpaUIService.findElementInElement_V3(data, ['DocId']);
//						var pdpa = prospectPersonalUIService.findElementInDetail_V3(['PdpaInformation']);
//						if (!commonService.hasValueNotEmpty(pdpa['@refUid'])) {
//							pdpa['@refUid'] = pdpaId;
//						}
//						var prospectCC = prospectPersonalUIService.findElementInDetail_V3(['CommunicationChannel']);
//						var pdpaCC = pdpaUIService.findElementInDetail_V3(['CommunicationChannel']);
//						for (var i = 0; i < prospectCC.length; i++) {
//							prospectCC[i]['pdpa:CommunicationChannelValue'].Value = pdpaCC[i]['pdpa:CommunicationChannelValue'].Value;
//						}
//						$scope.savePdpaSuccess = true;
//						prospectPersonalUIService.saveDetail_V3($scope.resourceURL, true).then(function(data) {
//							commonUIService.showNotifyMessage("v3.myworkspace.message.SavePDPASuccessfully", "success");
//						})
//					}
//				} else {
//					commonUIService.showNotifyMessage("v3.myworkspace.message.SavePDPAUnsuccessfully");
//				}
//				deferred.resolve(data);
//			});
			prospectPersonalUIService.saveDetail_V3($scope.resourceURL, true).then(function(data) {
				if (prospectPersonalUIService.isSuccess(data)) {
					pdpaUIService.saveDetail_V3($scope.resourceURL, true).then(function(data) {
						if (pdpaUIService.isSuccess(data)) {
							var pdpaId = pdpaUIService.findElementInElement_V3(data, ['DocId']);
							var pdpa = prospectPersonalUIService.findElementInDetail_V3(['PdpaInformation']);
							if (!commonService.hasValueNotEmpty(pdpa['@refUid'])) {
								pdpa['@refUid'] = pdpaId;
							}
							prospectPersonalUIService.saveDetail_V3($scope.resourceURL, false).then(function(data) {
								commonUIService.showNotifyMessage("v3.myworkspace.message.SavePDPASuccessfully", "success");
								$scope.savePdpaSuccess = true;
								deferred.resolve(data);
							})
						} else {
							commonUIService.showNotifyMessage("v3.myworkspace.message.SavePDPAUnsuccessfully");
							deferred.resolve(data);
						}
					});
				} else {
					commonUIService.showNotifyMessage("v3.myworkspace.message.SavePDPAUnsuccessfully");
					deferred.resolve(data);
				}
			});
		}
		return deferred.promise;
	};
	
	$scope.refreshDetail = function() {
		var docId = pdpaUIService.findElementInDetail_V3(['DocId']);
		pdpaUIService.findDocumentToEdit_V3($scope.resourceURL, "", docId).then(function(data) {
			$scope.reSetupConcreteUiStructure(pdpaUIService.detail); // refresh the values in multiple cards
		});
	};
	
	$scope.selectCommunicationChannels = function() {
		if (pdpaUIService.findElementInDetail_V3(['Consent']).Value == 'N') {
			var communicationChannels = pdpaUIService.findElementInDetail_V3(['CommunicationChannel']);
			for (var i = 0; i < communicationChannels.length; i++) {
				communicationChannels[i]['pdpa:CommunicationChannelValue'].Value = 'N';
			}
		}
	};
	
	$scope.click = function(index) {
    	if (pdpaUIService.findElementInDetail_V3(['CommunicationChannel'])[index]['pdpa:CommunicationChannelValue'] != undefined) {
    		if (pdpaUIService.findElementInDetail_V3(['CommunicationChannel'])[index]['pdpa:CommunicationChannelValue'].Value == 'N') {
    			pdpaUIService.findElementInDetail_V3(['CommunicationChannel'])[5]['pdpa:CommunicationChannelValue'].Value = 'N';
    		}
    		if (pdpaUIService.findElementInDetail_V3(['CommunicationChannel'])[0]['pdpa:CommunicationChannelValue'].Value == 'Y' &&
    			pdpaUIService.findElementInDetail_V3(['CommunicationChannel'])[1]['pdpa:CommunicationChannelValue'].Value == 'Y' &&
    			pdpaUIService.findElementInDetail_V3(['CommunicationChannel'])[2]['pdpa:CommunicationChannelValue'].Value == 'Y' &&
    			pdpaUIService.findElementInDetail_V3(['CommunicationChannel'])[3]['pdpa:CommunicationChannelValue'].Value == 'Y' &&
    			pdpaUIService.findElementInDetail_V3(['CommunicationChannel'])[4]['pdpa:CommunicationChannelValue'].Value == 'Y') {
    			pdpaUIService.findElementInDetail_V3(['CommunicationChannel'])[5]['pdpa:CommunicationChannelValue'].Value = 'Y';
    		}
    	}
    };
    
    $scope.allClick = function() {
    	if (pdpaUIService.findElementInDetail_V3(['CommunicationChannel'])[5]['pdpa:CommunicationChannelValue'] != undefined) {
    		if (pdpaUIService.findElementInDetail_V3(['CommunicationChannel'])[5]['pdpa:CommunicationChannelValue'].Value == 'Y') {
    	    	pdpaUIService.findElementInDetail_V3(['CommunicationChannel'])[0]['pdpa:CommunicationChannelValue'].Value = 'Y';
    	    	pdpaUIService.findElementInDetail_V3(['CommunicationChannel'])[1]['pdpa:CommunicationChannelValue'].Value = 'Y';
    	    	pdpaUIService.findElementInDetail_V3(['CommunicationChannel'])[2]['pdpa:CommunicationChannelValue'].Value = 'Y';
    	    	pdpaUIService.findElementInDetail_V3(['CommunicationChannel'])[3]['pdpa:CommunicationChannelValue'].Value = 'Y';
    	    	pdpaUIService.findElementInDetail_V3(['CommunicationChannel'])[4]['pdpa:CommunicationChannelValue'].Value = 'Y';	
        	} else if (pdpaUIService.findElementInDetail_V3(['CommunicationChannel'])[5]['pdpa:CommunicationChannelValue'].Value == 'N') {
    	    	pdpaUIService.findElementInDetail_V3(['CommunicationChannel'])[0]['pdpa:CommunicationChannelValue'].Value = 'N';
    	    	pdpaUIService.findElementInDetail_V3(['CommunicationChannel'])[1]['pdpa:CommunicationChannelValue'].Value = 'N';
    	    	pdpaUIService.findElementInDetail_V3(['CommunicationChannel'])[2]['pdpa:CommunicationChannelValue'].Value = 'N';
    	    	pdpaUIService.findElementInDetail_V3(['CommunicationChannel'])[3]['pdpa:CommunicationChannelValue'].Value = 'N';
    	    	pdpaUIService.findElementInDetail_V3(['CommunicationChannel'])[4]['pdpa:CommunicationChannelValue'].Value = 'N';
        	}
    	}  
    };
    
    $scope.printPdf = function(actionType) {
    	prospectPersonalUIService.generateDocument_V3($scope.portletId).then(function(data) {
    		if (prospectPersonalUIService.isSuccess(data)) {
				$scope.savePdpa().then(function() {
					if ($scope.savePdpaSuccess) {
						printPdfService.generatePdf($scope.portletId, prospectPersonalUIService, "", actionType);
					} else {
						commonUIService.showNotifyMessage("v3.myworkspace.message.GeneratePDFUnsuccessfully");
					}
				});
    		} else {
    			commonUIService.showNotifyMessage("v3.myworkspace.message.GeneratePDFUnsuccessfully");
    		}
    	});
    };
    
	//always in the end of ctrl
    $scope.setupStuffs();
}];
