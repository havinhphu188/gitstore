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
var paymentModule = angular.module('paymentModule',['coreModule'])
.service('paymentCoreService', ['$q', 'ajax', '$location', 'appService', 'cacheService', 'detailCoreService', 'commonService', 'connectService',
	function($q, ajax, $location, appService, cacheService, detailCoreService, commonService, connectService){
	
	function PaymentCoreService($q, ajax, $location, appService, cacheService, detailCoreService, commonService){
		var self = this;
		this.detailCoreService = detailCoreService;
		detailCoreService.ListDetailCoreService.call(self, $q, ajax, $location, appService, cacheService, commonService);
	//	this.name = commonService.CONSTANTS.MODULE_NAME.HOME;
	//	self.init();
	};
	inherit(detailCoreService.ListDetailCoreService, PaymentCoreService);
	PaymentCoreService.prototype.getPayment_V3 = function(resourceURL) {
		 var self = this;
		 var deferred = self.$q.defer();
		 var runtimeURL = "payments";
		 self.ajax.getRuntime(resourceURL, runtimeURL,function(data){
			 if (data!==null || data!==undefined || data!=="null") {
				 deferred.resolve(data);	
			}
			 /*self.detail = data;	*/	
//			 console.log("payment core");
		 });
		 return deferred.promise;
	}; 
	
	PaymentCoreService.prototype.getLazyList_V3 = function(resourceURL) {
		 var self = this;
		 var deferred = self.$q.defer();
		 //var runtimeURL = commonService.getUrl(commonService.urlMap.PRODUCT_LIST_V3);
//		 var runtimeURL = "transaction/computeLazy";
		 var runtimeURL = "payment/restrictions";
		 self.ajax.getRuntime(resourceURL, runtimeURL,function(data){
			/* self.detail = data;*/			
			 deferred.resolve(data);	
		 });
		 return deferred.promise;
	};
	
	PaymentCoreService.prototype.cancelQueuingPayment = function(resourceURL, docId, dataSet) {
		var self = this;
		var deferred = self.$q.defer();
		/*var url = self.commonService.getUrl(self.commonService.urlMap.GET_UNDERWRITING_EXPIREDLIST);
		self.ajax.getRuntime(resourceURL, url, function(data) {
			deferred.resolve(data);						
		});*/
		connectService.exeAction({
	    	actionName: "UPDATE_DOCUMENT_BY_PARTIAL_DATA_FIELD",
	    	actionParams: [docId],
	    	resourceURL: resourceURL,
	    	data: dataSet
	    }).then(function(data){
	    	self.items = data;
			deferred.resolve(data);
	    });
		return deferred.promise;
	};
/*	PaymentUIService.prototype.initializeObject_V3=function(resourceURL,docType){
		var self = this;
		var deferred = $q.defer();
		var url ="";
		docType != undefined ? self.name = docType : self.name;	
			 url = commonService.getUrl(commonService.urlMap.DOCUMENT_ADD, [self.name]);
		 self.ajax.getRuntime(resourceURL, url, function(data){
			 self.detail = data;
			 self.originalDetail = angular.copy(self.detail);
			 deferred.resolve(data);						
		 });
		return  deferred.promise;
		
	}*/
	 
	return new PaymentCoreService($q, ajax, $location, appService, cacheService, detailCoreService, commonService);
}]);