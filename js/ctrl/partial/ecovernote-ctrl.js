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
var EcovernoteDetailCtrl = ['$scope', '$log', '$mdDialog', 'ajax', '$state', 'commonService', 'commonUIService', 'ecovernoteUIService', 'salecaseUIService', 'prospectPersonalUIService',
	function($scope, $log, $mdDialog, ajax, $state, commonService, commonUIService, ecovernoteUIService, salecaseUIService, prospectPersonalUIService) {
	
	$scope.moduleService = ecovernoteUIService;
	$scope.commonUIService = commonUIService;
	
    $scope.setupStuffs = function setupStuffs () {
    	var self=this;
       	this.generalConfigCtrl('EcovernoteDetailCtrl', ecovernoteUIService).then(function finishedSetup () {
       		//self.uiStructureRoot.isDetailChanged = true;
			//TODO: Can call an event fire-up that everything in ctrl has been setup
       	});

    	$scope.getComputeLazy();
    };
    
	$scope.getComputeLazy = function(){
		var deferred = ecovernoteUIService.$q.defer();
		if(!commonService.hasValueNotEmpty(ecovernoteUIService.lazyChoiceList)){
			ecovernoteUIService.getModuleLazyChoicelist_V3($scope.resourceURL, salecaseUIService.product).then(function(data){
				ecovernoteUIService.lazyChoiceList = data
				deferred.resolve(data);
			});
		} else deferred.resolve();
		return deferred.promise;
	};

	$scope.prepareDataForAddendum = function(){
		var eCoverNotes = salecaseUIService.findElementInDetail_V3(['eCoverNote']);
		var latestECoverNoteDocId = eCoverNotes[(eCoverNotes.length-2)]['@refUid'];
		ecovernoteUIService.getDTODocument_V3($scope.resourceURL, salecaseUIService.product, latestECoverNoteDocId).then(function(data){
			// set Data of latest ECoverNote into Addendum
			var oldData  = ecovernoteUIService.findElementInDetail_V3(['IposDocument']);
			var dataKeyName = $scope.returnObjectKey (oldData, "Data");
			ecovernoteUIService.findElementInDetail_V3(['IposDocument'])[dataKeyName] = ecovernoteUIService.findElementInElement_V3(data, ['Data']);

			// name Addendum
			var previousName = ecovernoteUIService.findElementInElement_V3(data, ['DocName']);
			var addendumDocName = '';
			if(previousName.indexOf("-") > -1){
				addendumDocName = previousName.slice(0,-1) + (eCoverNotes.length-1).toString();
			}
			else{
				addendumDocName = previousName + '-' + (eCoverNotes.length-1).toString();
			}
			ecovernoteUIService.findElementInDetail_V3(['DocInfo'])['DocName'] = addendumDocName;
			// enable 3 field
			ecovernoteUIService.findElementInDetail_V3(['IDNumber'])['@editable'] = '1';
			ecovernoteUIService.findElementInDetail_V3(['EngineMotorNo'])['@editable'] = '1';
			ecovernoteUIService.findElementInDetail_V3(['ChassisNo'])['@editable'] = '1';
			// change Business Status
			ecovernoteUIService.findElementInDetail_V3(['DocStatus'])['BusinessStatus'] = 'DRAFT';
			$scope.reSetupConcreteUiStructure(ecovernoteUIService.detail);
		});
	};
	
	//nle32: return key of object. ex: "ecovernote:Data"
	 $scope.returnObjectKey = function(element, elementsChain){
		 var obj = Object.keys(element);
			for(var el in obj) {
				var originalEle = obj[el];
				var res = obj[el].split(":");
				if(res.length>1){
					if(res[res.length - 1] == elementsChain){
						return originalEle;
					}
				}
			}
	    };
	
	// For the first time when initializing detail of eCoverNote
	if(ecovernoteUIService.findElementInDetail_V3(['BusinessStatus'])=='NEW'){
		$scope.prepareDataForAddendum();
	}
	
    $scope.saveDetail = function(){
    	ecovernoteUIService.findElementInDetail_V3(['CaseID']).$ = salecaseUIService.findElementInDetail_V3(['DocId']);
    	ecovernoteUIService.saveDetail_V3($scope.resourceURL, false).then(function(data){
			if (ecovernoteUIService.isSuccess(data)) {
				// set refUid of Addendum(eCover Note) into Case
				if (commonService.hasValue(salecaseUIService.detail)) {
					var eCoverNoteDocId = ecovernoteUIService.findElementInDetail_V3(['DocId']);
					var eCoverNoteInCase = salecaseUIService.findElementInDetail_V3(['eCoverNote']);
					for (var i = 0; i < eCoverNoteInCase.length; i++) {
						if (!commonService.hasValueNotEmpty(eCoverNoteInCase[i]['@refUid'])) {
							eCoverNoteInCase[i]['@refUid'] = eCoverNoteDocId;
							salecaseUIService.findElementInElement_V3(eCoverNoteInCase[i], ['eCoverNoteId']).$ = eCoverNoteDocId;
							break;
						}
					}
					salecaseUIService.saveDetail_V3($scope.resourceURL, false).then(function(data) {
						$log.debug('Case has been saved');
						commonUIService.showNotifyMessage("v3.mynewworkspace.message.SaveECoverNoteAddendumSuccessfully", "success");
					});
				} else {
					commonUIService.showNotifyMessage("v3.mynewworkspace.message.SaveECoverNoteAddendumSuccessfully", "success");
				} 
			}
			else{
				commonUIService.showNotifyMessage("v3.mynewworkspace.message.SaveECoverNoteAddendumUnsuccessfully");
			}
			$scope.reSetupConcreteUiStructure(ecovernoteUIService.detail);
		});
    };
	
    $scope.submitJPJ = function(){
    	var eCoverNoteDocId = ecovernoteUIService.findElementInDetail_V3(['DocId']);
    	if(eCoverNoteDocId==''){
    		commonUIService.showNotifyMessage("v3.mynewworkspace.message.PleaseSaveAddendum");
    	}else{
    		ecovernoteUIService.submitJPJ($scope.resourceURL, eCoverNoteDocId, salecaseUIService.product).then(function(data){
    			if (ecovernoteUIService.isSuccess(data)){
    				var eCoverNoteDocId = ecovernoteUIService.findElementInElement_V3(data, ['DocId']);
    				ecovernoteUIService.findDocumentToEdit_V3($scope.resourceURL, salecaseUIService.product, eCoverNoteDocId).then(function(data){
    					commonUIService.showNotifyMessage("v3.mynewworkspace.message.SubmitAddendumSuccessfully", "success");
    					// enable Add Addendum card if result is REJECTED WITH CHANGES
    					if(ecovernoteUIService.findElementInDetail_V3(['BusinessStatus'])=='REJECTED WITH CHANGES'){
    						$scope.showOrHideAddAddendumAction(true);
    					}
    				});
    			}
    			else{
    				commonUIService.showNotifyMessage("v3.mynewworkspace.message.SubmitAddendumUnsuccessfully");
    			}
    			$scope.reSetupConcreteUiStructure(ecovernoteUIService.detail);
    		});
    	}
    }
    
	$scope.refreshDetail = function(){
		var eCoverNoteDocId = ecovernoteUIService.findElementInDetail_V3(['DocId']);
		ecovernoteUIService.findDocumentToEdit_V3($scope.resourceURL, salecaseUIService.product, eCoverNoteDocId).then(function(data){
			// enable Add Addendum card if result is REJECTED WITH CHANGES
			if(ecovernoteUIService.findElementInDetail_V3(['BusinessStatus'])=='REJECTED WITH CHANGES'){
				$scope.showOrHideAddAddendumAction(true);
			}
			$scope.reSetupConcreteUiStructure(ecovernoteUIService.detail);
		});
	};
    
    $scope.setupStuffs();
    
    /* Select PDF template popup */
	$scope.printPdf = function(docType, docId) {
		ecovernoteUIService.generateDocument_V3($scope.portletId).then(function(data) {
			if (ecovernoteUIService.isSuccess(data)) {
				ecovernoteUIService.group = ecovernoteUIService.getProductGroup_V3(salecaseUIService.product);
		    	if (ecovernoteUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.MOTOR) {
		    		
		    	}
//			    else if (ecovernoteUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.TERM_LIFE) { }
		    	var businessType = salecaseUIService.findElementInDetail_V3(['@case-name']);
		    	$scope.printPdfService.generatePdf($scope.portletId, ecovernoteUIService, salecaseUIService.product, businessType.toLowerCase());
			} else {
				commonUIService.showNotifyMessage("v3.myworkspace.message.GeneratePDFUnsuccessfully");
			}
		});
	};
}];
