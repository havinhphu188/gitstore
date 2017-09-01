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

var underwritingModule = angular.module('underwritingModule',['coreModule','connectionModule'])
.service('underwritingCoreService', ['$q', 'ajax', '$location', 'appService', 'cacheService', 'detailCoreService', 'commonService', 'connectService',
	function($q, ajax, $location, appService, cacheService, detailCoreService, commonService, connectService){
	
	function UnderwritingCoreService($q, ajax, $location, appService, cacheService, detailCoreService, commonService){
		var self = this;
		self.detailCoreService = detailCoreService;
		detailCoreService.ListDetailCoreService.call(self, $q, ajax, $location, appService, cacheService, commonService);
		self.name = commonService.CONSTANTS.MODULE_NAME.UNDERWRITING;
	};
	inherit(detailCoreService.ListDetailCoreService, UnderwritingCoreService);
	
	UnderwritingCoreService.prototype.getUnderwritingPickupableList = function(resourceURL, productName) {
		var self = this;
		var deferred = self.$q.defer();
		var url = self.commonService.getUrl(self.commonService.urlMap.GET_UNDERWRITING_PICKUPABLELIST, [productName]);
		self.ajax.getRuntime(resourceURL, url, function(data) {
			deferred.resolve(data);						
		});
		return deferred.promise;
	};
	
	UnderwritingCoreService.prototype.getExpiredUnderwritingList = function(resourceURL) {
		var self = this;
		var deferred = self.$q.defer();
		/*var url = self.commonService.getUrl(self.commonService.urlMap.GET_UNDERWRITING_EXPIREDLIST);
		self.ajax.getRuntime(resourceURL, url, function(data) {
			deferred.resolve(data);						
		});*/
		connectService.exeAction({
	    	actionName: "GET_UNDERWRITING_EXPIREDLIST",
	    	actionParams: [],
	    	resourceURL: resourceURL
	    }).then(function(data){
	    	self.items = data;
			deferred.resolve(data);
	    });
		return deferred.promise;
	};
	
	UnderwritingCoreService.prototype.doUnderwriting = function(resourceURL, dataSet, docId, action, productName) {
		/*var self = this;
		var deferred = self.$q.defer();
		var actionUrl = commonService.getUrl(commonService.urlMap.DO_UNDERWRITING, [docId, action, productName]);
		self.ajax.postRuntime(resourceURL, actionUrl, dataSet, function(data) {
			if (self.isSuccess(data)) {
				 self.updateDetailData_V3(data);
			 } else {
				 self.mergeErrorToDetail(self.findElementInElement_V3(data, ['ipos-response:response-message']));
			 }
			deferred.resolve(data);
		});
		return deferred.promise;*/
		
		var self = this;
		var deferred = self.$q.defer();
		self.clearErrorInElement(self.detail);
	    var actionName = "DO_UNDERWRITING";
		connectService.exeAction({
	    	actionName: actionName ,
	    	actionParams: [docId, action, productName],
	    	data: self.extractUiDataSet_V3(self.detail),
	    	resourceURL: resourceURL
	    }).then(function(data){
			 if(self.isSuccess(data)){
				 self.convertElementsToArrayInElement_V3(data);
				 self.detail = data;
			 } else{
				 self.mergeErrorToDetail(self.findElementInElement_V3(data, ['ipos-response:response-message']));
			 }

			deferred.resolve(data);	
	    });		
		return deferred.promise;
	};
	
	UnderwritingCoreService.prototype.doUnderwritingDS = function(resourceURL, docId, action, product){
		var self = this;
		var deferred = self.$q.defer();
		self.clearErrorInElement(self.detail);		
		var dataSet = self.extractUiDataSet_V3(self.detail);
		var actionUrl = commonService.getUrl(commonService.urlMap.DO_UNDERWRITING,[docId, action, product]);
		var actionName = "DO_UNDERWRITING";
		var actionParams = [docId, action, product];
		connectService.exeAction({
			    	actionName: actionName,
			    	actionParams: actionParams,
			    	data: dataSet,
			    	resourceURL: resourceURL
			    }).then(function(data){
					 if(self.isSuccess(data)){
						 //self.updateDetailData_V3(data);
						 self.convertElementsToArrayInElement_V3(data);
						 self.detail = data;
					 } else{
						 self.mergeErrorToDetail(self.findElementInElement_V3(data, ['ipos-response:response-message']));
					 }

					deferred.resolve(data);	
			    });		
		return deferred.promise;
	};
	
	/**
	 * 
	 */
	UnderwritingCoreService.prototype.computeUnderWritingDetail = function(resourceURL, productName){
		var self = this;
		var deferred = self.$q.defer();
		self.clearErrorInElement(self.detail);
		var dataSet = self.extractUiDataSet_V3(self.detail);
		var actionUrl = commonService.getUrl(commonService.urlMap.DOCUMENT_COMPUTE_V3,[self.name, productName]);
		self.ajax.postRuntime(resourceURL, actionUrl, dataSet, function(data){					
			if(self.isSuccess(data)){	//validate success
				 self.detail = data;
			 } else{	//validate fail
				 self.mergeErrorToDetail(self.findElementInElement_V3(data, ['ipos-response:response-message']));
			 }
			deferred.resolve(data);			
		});
		return deferred.promise;
	};

	return new UnderwritingCoreService($q, ajax, $location, appService, cacheService, detailCoreService, commonService);
}]);
