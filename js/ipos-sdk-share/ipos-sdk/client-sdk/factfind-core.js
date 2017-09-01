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

var factFindModule = angular.module('factfindModule',['coreModule'])
.service('factfindCoreService', ['$q', 'ajax', '$location', 'appService', 'cacheService', 'detailCoreService', 'commonService', 'workspaceService', 'connectService',
    function($q, ajax, $location, appService, cacheService, detailCoreService, commonService, workspaceService, connectService){

	function FactFindCoreService($q, ajax, $location, appService, cacheService, detailCoreService, commonService) {
		var self = this;
		this.detailCoreService = detailCoreService;
		detailCoreService.ListDetailCoreService.call(self, $q, ajax, $location, appService, cacheService, commonService);
		this.name = commonService.CONSTANTS.MODULE_NAME.FACTFIND;
	};
		

	inherit(detailCoreService.ListDetailCoreService, FactFindCoreService);



	/**
	 * Private functions, help to find the inside doc
	 * @param  {[type]} resourceURL [description]
	 * @return {[type]}             [description]
	 */
	var findInsideDoc = function(fnaDoc, caseId){
		var result;
		var lsBcs = detailCoreService.ListDetailCoreService.prototype.findElementInElement_V3(fnaDoc, ['InsideFNA']);//list BCs

		if(lsBcs){			
			for (var i = lsBcs.length - 1; i >= 0; i--) {
				if(lsBcs[i]['@refUid'] === caseId){
					result = lsBcs[i];
					break;
				}
			};	
		}

		return  result;
	};

	
	/**
	 * Will remove any inside FNA element with empty '@refUid'
	 * @param  {Object}  fnaDoc input
	 * @return {Object}        cleaned FNA doc
	 */
	function cleanFnaDoc(fnaDoc) {
		var lsBcs = detailCoreService.ListDetailCoreService.prototype.findElementInElement_V3(fnaDoc, ['InsideFNA']);//list BCs
		var newInsideLs = [];
		if(lsBcs){			
			for (var i = lsBcs.length - 1; i >= 0; i--) {
				if(commonService.hasValueNotEmpty(lsBcs[i]['@refUid'])){
					newInsideLs.push(lsBcs[i]);
				}
			};

			//has changed, need to update new change back to fnaDoc
			if(newInsideLs.length !== lsBcs.length){
				detailCoreService.ListDetailCoreService.prototype.findElementInElement_V3(fnaDoc, ['InsideFNAs'])['InsideFNA'] = newInsideLs;
			}
		}

		return  fnaDoc;
	}

	FactFindCoreService.prototype.saveDetail_V3 = function(resourceURL, bolValidate, fnSaveSuccess, fnSaveFail){
		var self = this;
		var deferred = self.$q.defer();

		//only cleaning if self.outsideDoc not undefined: in inside View mode.
//		if(self.detail){
//			//clean all inside Fna element with empty '@refUid'
//			self.detail = cleanFnaDoc(self.detail);
//		}
			

		detailCoreService.ListDetailCoreService.prototype.saveDetail_V3.call(self, resourceURL, bolValidate, fnSaveSuccess, fnSaveFail).then(function(data){
//			self.detail = data;
			deferred.resolve(data);
		});
		return  deferred.promise;
	};



	/**
	 * Get the detail in FNA document for inside (BC case)
	 * @param  {String} resourceURL portlet URL
	 * @param  {String} productName not use in FNA doc
	 * @param  {String} docId       document's id need to get
	 * @param  {String} caseId      if defined, will get the inside FNA, or create new if caseId is empty string
	 * @return {Object}             Angular promise
	 */
	FactFindCoreService.prototype.findDocumentToEdit_V3 = function(resourceURL, productName, docId, caseId){
		var self = this;
		var deferred = self.$q.defer();
		detailCoreService.ListDetailCoreService.prototype.findDocumentToEdit_V3.call(self, resourceURL, productName, docId).then(function(data){
			self.outsideDoc = data;

			if(caseId !== undefined && angular.isString(caseId)){
				//Firstly, try to find  the correct insideFna with given caseId
				//Note: caseId can be empty string --> we're opening a NOT YET saved insideFNA within a NOT YET save CASE
				self.insideDoc = findInsideDoc(self.outsideDoc, caseId);

				//if can't find --> need to create a new inside with empty caseId
				if(!self.insideDoc){
					var childKey = 'InsideFNA';
					var parentEle = self.findElementInElement_V3(self.outsideDoc, ['InsideFNAs']);
					childKey = self._findFullKeyWithPrefix(parentEle, childKey);
					self.insideDoc = self.addChildEleToParentEle(parentEle, childKey);

					//set caseId to inside FNA doc
					self.insideDoc['@refUid'] = caseId;
				}

				if(self.insideDoc){
					//now detail will become insideDoc
					//self.detail = self.insideDoc;
					//self.originalDetail = angular.copy(self.insideDoc);
				}else{
					$log.error("Can't find/setup inside FNA in FNA document");
				}
			}
			deferred.resolve(self.detail);
		});
		return  deferred.promise;
	};
	
	FactFindCoreService.prototype.updateInsideDoc = function(fnaDoc){
		var self = this;
		var result;
		var lsBcs = self.convertToArray(detailCoreService.ListDetailCoreService.prototype.findElementInElement_V3(fnaDoc, ['InsideFNA']));//list BCs
		if(lsBcs){			
			for (var i = lsBcs.length - 1; i >= 0; i--) {
				if(lsBcs[i]['@refUid'] === self.insideDoc['@refUid']){
					result = lsBcs[i];
					break;
				}
			};	
		}
		self.insideDoc = result;
	};
	
	FactFindCoreService.prototype.computeFactFindDetail = function(resourceURL){
		var self = this;
		var deferred = self.$q.defer();
		self.clearErrorInElement(self.detail);
		var dataSet = self.extractUiDataSet_V3(self.detail);		
		
		connectService.exeAction({
	    	actionName: "DOCUMENT_COMPUTE_V3",
	    	actionParams: [self.name],
	    	data: dataSet,
	    	resourceURL: resourceURL
	    }).then(function(data){
	    	if(self.isSuccess(data)){	//validate success
				 //self.updateDetailData_V3(data);
	    		 self.convertElementsToArrayInElement_V3(data);
				 self.detail = data;
			 } else{	//validate fail
				 self.mergeErrorToDetail(self.findElementInElement_V3(data, ['ipos-response:response-message']));
			 }
			deferred.resolve(data);	
	    });
		
		/*var actionUrl = commonService.getUrl(commonService.urlMap.DOCUMENT_COMPUTE_V3, [self.name]);
		self.ajax.postRuntime(resourceURL, actionUrl, dataSet, function(data){					
			if(self.isSuccess(data)){	//validate success
				 //self.updateDetailData_V3(data);
				 self.detail = data;
			 } else{	//validate fail
				 self.mergeErrorToDetail(self.findElementInElement_V3(data, ['ipos-response:response-message']));
			 }

			deferred.resolve(data);			
		});*/
		
		return deferred.promise;
	};
	
	return new FactFindCoreService($q, ajax, $location, appService, cacheService, detailCoreService, commonService);
}]);

