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
var applicationModule = angular.module('applicationModule',['coreModule'])
.service('applicationCoreService', ['$q', 'ajax', '$location', 'appService', 'cacheService', 'detailCoreService', 'commonService', 'connectService',
    function($q, ajax, $location, appService, cacheService, detailCoreService, commonService, connectService){
	
	function ApplicationCoreService($q, ajax, $location, appService, cacheService, detailCoreService, commonService){
		var self = this;
		this.detailCoreService = detailCoreService;
		detailCoreService.ListDetailCoreService.call(self, $q, ajax, $location, appService, cacheService, commonService);
		this.name = commonService.CONSTANTS.MODULE_NAME.APPLICATION;
	};
	inherit(detailCoreService.ListDetailCoreService, ApplicationCoreService);
	
	ApplicationCoreService.prototype.loadApplicationDetail = function(resourceURL,productName){
		var self = this;
		var deferred = self.$q.defer();
		var url = commonService.getUrl(commonService.urlMap.MODULE_CREATE,[self.name,productName]);
		self.invokeRuntimeService("GET",resourceURL,url).then(function(data){
			self.updateDetailData(data);
			deferred.resolve(data);
		});
		return deferred.promise;
	};
	
	ApplicationCoreService.prototype.loadApplicationDetailLazyList = function(productName){
		var self = this;
		var deferred = self.$q.defer();
		var url = commonService.getUrl(commonService.urlMap.MODULE_LAZY_CHOICELIST_V3,[self.name, productName]);
		self.ajax.get_V3(url).success(function(data){
			deferred.resolve(data);
		});
		return deferred.promise;
	};
	
	ApplicationCoreService.prototype.saveApplicationDetail = function(resourceURL,productName){
		var self = this;
		var deferred = self.$q.defer();
		var dataSet = self.detail;
		var url = commonService.getUrl(commonService.urlMap.DOCUMENT_SAVE,[self.name, productName]);
		self.invokeRuntimeService("POST",resourceURL,url,dataSet).then(function(data){
			self.updateDetailData_V3(data);
			deferred.resolve(data);
		});
		return deferred.promise;
	};
	
	// ApplicationCoreService.prototype.computeApplicationDetail = function(productName){
	// 	var self = this;
	// 	var deferred = self.$q.defer();
	// 	var dataSet = self.detail;
	// 	console.log(dataSet);
	// 	var url = commonService.getUrl(commonService.urlMap.MODULE_COMPUTE, [self.name,productName]);
	// 	console.log(url);
	// 	self.ajax.postRuntime(url,dataSet).success(function(data){
	// 		console.log(data);
	// 		self.updateDetailData(data);
	// 		deferred.resolve(data);
	// 	});
	// 	return deferred.promise;
	// };
	
	ApplicationCoreService.prototype.getApplicationList_V3 = function(resourceURL){
		var self = this;
		var deferred = $q.defer();
	
		var url = commonService.getUrl(commonService.urlMap.MODULE_DOCUMENTLIST_V3, [self.name]);
		 	
		 self.ajax.getRuntime(resourceURL, url, function(data){
			 deferred.resolve(data);						
		 });
		return  deferred.promise;
	};
	
	/**
	 * 
	 */
	
	ApplicationCoreService.prototype.getApplicationProductList_V3 = function(resourceURL) {
		 var self = this;
		 var deferred = self.$q.defer();
		 var runtimeURL = commonService.getUrl(commonService.urlMap.MODULE_LISTPRODUCT, [self.name]);
		 self.ajax.getRuntime(resourceURL, runtimeURL, function(data){			
			 deferred.resolve(data);	
		 });
		 return deferred.promise;
	};
	
	ApplicationCoreService.prototype.generateApplicationFromQuotation_V3 = function(resourceURL, quotationDocID, productName){
		var self = this;
		var deferred = self.$q.defer();
		
		/*var url = commonService.getUrl(commonService.urlMap.GENERATE_DOCUMENT_FROM_EXIST_DOCUMENT_V3,[quotationDocID,this.name,productName]);
		self.ajax.getRuntime(resourceURL, url, function(data){
			deferred.resolve(data);
		});*/
		
		connectService.exeAction({
	    	actionName: "GENERATE_DOCUMENT_FROM_EXIST_DOCUMENT_V3",
	    	actionParams: [quotationDocID, this.name, productName],
	    	resourceURL: resourceURL
	    }).then(function(data){
    			deferred.resolve(data);						
	    });
		
		return deferred.promise;
	};
	
	return new ApplicationCoreService($q, ajax, $location, appService, cacheService, detailCoreService, commonService);
}]);