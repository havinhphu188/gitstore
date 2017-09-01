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
var ProspectDetailCtrl = ['$rootScope', '$filter', '$scope', '$log', '$timeout', 'commonService', 'prospectPersonalUIService', 'salecaseUIService', 'commonUIService', '$mdDialog', 'printPdfService',
	function($rootScope, $filter, $scope, $log, $timeout, commonService, prospectPersonalUIService, salecaseUIService, commonUIService, $mdDialog, printPdfService) {
	
	$scope.commonUIService = commonUIService;
	$scope.printPdfService = printPdfService;
	$scope.PCityCdList = [];
	$scope.NPCityCdList = [];
	
	/**
	 * Will setup stuffs for this ctrl like set moduleUIservice, setup action bar, uiStructure
	 */
    $scope.setupStuffs = function setupStuffs () {
       	this.generalConfigCtrl('ProspectDetailCtrl', prospectPersonalUIService).then(function finishedSetup () {       		
			//TODO: Can call an event fire-up that everything in ctrl has been setup
       	});


		this.initializeObject();
    };

	
	$scope.getComputeLazy = function() {
		var deferred = prospectPersonalUIService.$q.defer();
		if (!commonService.hasValueNotEmpty(prospectPersonalUIService.lazyChoicelist)) {
			prospectPersonalUIService.getModuleLazyChoicelist_V3($scope.resourceURL).then(function(data) {
				deferred.resolve(data);
				
				// MNC city list
				$scope.PCityCdList = prospectPersonalUIService.findElementInElement_V3(prospectPersonalUIService.lazyChoicelist, ['PCityCd']).Option;
				$scope.NPCityCdList = prospectPersonalUIService.findElementInElement_V3(prospectPersonalUIService.lazyChoicelist, ['PCityCd']).Option;
			});
		} else deferred.resolve();
		return deferred.promise;
	}
	
	$scope.initializeObject = function() {
		$scope.getComputeLazy().then(function(){
			if (!commonService.hasValueNotEmpty(prospectPersonalUIService.findElementInDetail_V3(['DocName']))
					|| prospectPersonalUIService.findElementInDetail_V3(['DocName']).indexOf('Default') != -1) {
				prospectPersonalUIService.findElementInDetail_V3(['Header'])['DocInfo']['DocName'] = prospectPersonalUIService.genDefaultName();
			}
		})
	}
	
	
	$scope.saveProspect = function() {
		var self = this;
		var deferred = prospectPersonalUIService.$q.defer();
		prospectPersonalUIService.saveDetail_V3($scope.resourceURL, true).then(function(data) {
			deferred.resolve(data);
			if (prospectPersonalUIService.isSuccess(data)) {
				if (commonService.hasValue(salecaseUIService.detail)) {
					var prospectId = prospectPersonalUIService.findElementInElement_V3(data, ['DocId']);
					var prospect = salecaseUIService.findElementInDetail_V3(['Prospect']);
					for (var i = 0; i < prospect.length; i++) {
						if (!commonService.hasValueNotEmpty(prospect[i]['@refUid'])) {
							prospect[i]['@refUid'] = prospectId;
							salecaseUIService.findElementInElement_V3(prospect[i], ['ProspectId']).$ = prospectId;
							break;
						}
					}
					
					//for policy servicing endowmnent
					if(self.moduleService.findElementInDetail_V3(['PersonContactRole']).Value == 'BENEFICIARY'){
						var prospectObject = self.getRightDetailInMultipleEleFromParentDoc ();
						self.moduleService.findElementInElement_V3(prospectObject, ['ProspectName']).$ = self.moduleService.findElementInDetail_V3( ['PersonName', 'FullName']).$;
					}
					
					
					salecaseUIService.saveDetail_V3($scope.resourceURL, false).then(function(data) {
						commonUIService.showNotifyMessage("v3.myworkspace.message.SaveProspectsuccessfully", "success");
						$scope.refreshDetail();
						$log.debug(salecaseUIService.detail);
						$rootScope.$broadcast("saveProspect", ['application']);
					});
				} else {
					commonUIService.showNotifyMessage("v3.myworkspace.message.SaveProspectsuccessfully", "success");
					$scope.refreshDetail();
				}
				$scope.reSetupConcreteUiStructure (prospectPersonalUIService.detail);
			} else {
				/*var confirm = $mdDialog.confirm()
		          .title('Would you like to save as draft ?')
		          .ok('Yes')
		          .cancel('No');
			    $mdDialog.show(confirm).then(function() {
			    	prospectPersonalUIService.saveDetail_V3($scope.resourceURL, false).then(function(data){
			    		if(data["IposDocument"]){
			    			commonUIService.showNotifyMessage("v3.myworkspace.message.SaveDraftProspectsuccessfully", "success");
			    		}else{
			    			commonUIService.showNotifyMessage("v3.myworkspace.message.SaveDraftProspectUnsuccessfully");
			    		}
			    	});
			    }, function() {
			        var a = 'No';
			    });*/
			    $scope.reSetupConcreteUiStructure (prospectPersonalUIService.detail);
			    commonUIService.showNotifyMessage("v3.myworkspace.message.SaveProspectUnsuccessfully");
			}
		});
		// self.saveDetailNotCompute(undefined, {bCompute: true, bShowSavedMessage: true});
		return deferred.promise;
	};
	
	$scope.archiveProspect = function() {
		var docId = prospectPersonalUIService.findElementInDetail_V3(["DocId"]);
		prospectPersonalUIService.archiveDocument_V3($scope.resourceURL, docId).then(function(data){
			if(data['ipos-container:map-list']){
				commonUIService.showNotifyMessage("new.v3.mynewworkspace.message.ArchiveSuccessfully","success");
				location.reload(true);
			}
			else{
				commonUIService.showNotifyMessage("new.v3.mynewworkspace.message.ArchiveUnsuccessfully");
			}
		});
	};
	
	$scope.toggleStarProspect = function() {
		var docId = prospectPersonalUIService.findElementInDetail_V3(["DocId"]);
		if (prospectPersonalUIService.findElementInDetail_V3(['Star']) == '') {
			prospectPersonalUIService.starDocument_V3($scope.resourceURL, docId).then(function(data){
				if(prospectPersonalUIService.isSuccess(data)){
					commonUIService.showNotifyMessage("new.v3.mynewworkspace.message.StarSuccessfully", "success");
					prospectPersonalUIService.findElementInDetail_V3(['Header'])['DocInfo']['Star'] = prospectPersonalUIService.findElementInElement_V3(data, ['Star']);
				} else {
					commonUIService.showNotifyMessage("new.v3.mynewworkspace.message.StarUnsuccessfully");
				}
			});
		} else {
			prospectPersonalUIService.unStarDocument_V3($scope.resourceURL, docId).then(function(data){
				if(prospectPersonalUIService.isSuccess(data)){
					commonUIService.showNotifyMessage("new.v3.mynewworkspace.message.UnStarSuccessfully", "success");
					prospectPersonalUIService.findElementInDetail_V3(['Header'])['DocInfo']['Star'] = prospectPersonalUIService.findElementInElement_V3(data, ['Star']);
				} else {
					commonUIService.showNotifyMessage("new.v3.mynewworkspace.message.UnStarUnsuccessfully");
				}
			});
		}
	}
	
	$scope.setSlider = function() {
    	$timeout(function () {
    		$scope.$broadcast('reCalcViewDimensions');
    	}, 1000);
    }
	
	$scope.refreshDetail = function(){
		var prospectID = prospectPersonalUIService.findElementInDetail_V3(['DocId']);
		prospectPersonalUIService.findDocumentToEdit_V3($scope.resourceURL, "", prospectID).then(function(data){
			$scope.reSetupConcreteUiStructure(prospectPersonalUIService.detail); // refresh the values in multiple cards
		});
	};
	
	$scope.addContact = function(){
		prospectPersonalUIService.findElementInDetail_V3(['Contacts'])['@counter'] = 1;
		prospectPersonalUIService.jsonToArray(prospectPersonalUIService.detail, 'Contacts', 'person:Contact');
    };
    
    $scope.clearContactTypeValue = function clearContactTypeValue(index, contact){
    	prospectPersonalUIService.findElementInElement_V3(contact, ['ContactInformation']).$ = "";
	}
    
    // Convert contacts to array when open card Contacts (cover case when open existing item)
    $scope.convertContactsToArray = function(){
    	prospectPersonalUIService.jsonToArray(prospectPersonalUIService.detail, 'Contacts', 'person:Contact');
    }
    
    // Convert non primary address to array when open card Address (cover case when open existing item)
    $scope.convertNPAddressesToArray = function(){
    	prospectPersonalUIService.jsonToArray(prospectPersonalUIService.detail, 'NonPrimaryAddresses', 'person:NonPrimaryAddress');
    }
    
    $scope.planAdded = false;
    $scope.setupExistingPlan = function(card){
    	var self = this;
    	var existingPlanEle = prospectPersonalUIService.findElementInDetail_V3(['HaveExistingPlan']);
    	if (existingPlanEle.Value == 'Y' && $scope.planAdded == false) {
    		var actionCard = self.getCardDataWithName('prospect:NewExistingPlan');
    		self.addCard(actionCard);
	    	self.closeChildCards(2);
	    	$log.debug(self.moduleService.detail);
    	}
    	if (existingPlanEle.Value !== 'Y' && prospectPersonalUIService.findElementInDetail_V3(['ExistingFinancialPlans'])['@counter'] != '0') {
//    	if (existingPlanEle.Value === 'N' && prospectPersonalUIService.findElementInDetail_V3(['ExistingFinancialPlans'])['@counter'] != '') {
    		var confirm = $mdDialog.confirm()
    		.title($filter('translate')("v3.mynewworkspace.message.AreYouSureToRemoveTheCurrentExistingPlan"))
    		.ok($filter('translate')("v3.yesno.enum.Y"))
    		.cancel($filter('translate')("v3.yesno.enum.N"));
		    $mdDialog.show(confirm).then(function() {
		    	self.remChildrenInCard('prospect:ExistingFinancialPlans');
		    	$scope.planAdded = false;
		    	self.closeChildCards(2);
    		}, function() {
    			prospectPersonalUIService.findElementInDetail_V3(['HaveExistingPlan']).Value = "Y";
    			$scope.planAdded = true;
    		}
		    )
    	}
    }
    
    $scope.printPdf = function(actionType){
    	prospectPersonalUIService.generateDocument_V3($scope.portletId).then(function(data){
    		if(prospectPersonalUIService.isSuccess(data)){
    			$scope.saveProspect().then(function(data){
    				if(prospectPersonalUIService.isSuccess(data)){
    					$scope.printPdfService.generatePdf($scope.portletId, prospectPersonalUIService, "", "");
    				}else{
    					commonUIService.showNotifyMessage("v3.myworkspace.message.GeneratePDFUnsuccessfully");
    				}
    			});    			
    		}else {
    			commonUIService.showNotifyMessage("v3.myworkspace.message.GeneratePDFUnsuccessfully");
    		}
    	});
    };
    
    /**
     * @author dnguyen98
	 * Refresh details to update new value of attribute
	 */    
    $scope.refreshAll = function(){
    	prospectPersonalUIService.refresh_V3($scope.resourceURL).then(function(data){
			$scope.reSetupConcreteUiStructure(prospectPersonalUIService.detail);
		});
    }
    
    /**
     * @author dnguyen98
	 * Refresh one or many node in details to update new value of attribute
	 * @param array element 
	 */
    $scope.refreshTags = function(element){
    	prospectPersonalUIService.refreshTags($scope.resourceURL, element).then(function(data){
			$scope.reSetupConcreteUiStructure(prospectPersonalUIService.detail);
		});
    }
    
    /**
	 * @author dnguyen98
	 * Call refreshAll() to update new value of attribute and clear data
	 * @param element
	 * @param model
	 * @param clearCriteria
	 * @param listElement
	 */
    $scope.clearDataFromListEle = function(element, model, clearCriteria, listElement, elementTag){
    	prospectPersonalUIService.clearDataFromListEle(element, model, clearCriteria, listElement);
    	$scope.refreshTags(elementTag);
    }
    
    /**
	 * @author ttan40
	 * Call refreshCityCode() to update new lazy choice list for city by province code
	 * @param card
	 * @param provinceCd
	 * @param cityCdChoiceKey
	 */
    $scope.refreshCityCode = function(card, provinceCd, cityCdChoiceKey){
    	prospectPersonalUIService.findElementInElement_V3(card.refDetail, ['CityCd']).Value = '';
    	$scope[cityCdChoiceKey + 'List'] =  $filter('filterByGroup')(prospectPersonalUIService.findElementInElement_V3(prospectPersonalUIService.lazyChoicelist, [cityCdChoiceKey, 'Option']), provinceCd);
    }
    
    $scope.filterOcupation = function (){
    	prospectPersonalUIService.occupationList = $filter('filterByGroup')(prospectPersonalUIService.findElementInElement_V3(prospectPersonalUIService.lazyChoicelist, ['Occupation', 'Option']), prospectPersonalUIService.findElementInDetail_V3(['BusinessIndustry']).Value);
	}
    
    $scope.setupStuffs();
}];