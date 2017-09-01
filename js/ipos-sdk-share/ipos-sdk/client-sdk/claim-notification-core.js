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

var claimNotificationModule = angular.module('claimNotificationModule',['coreModule'])
.service('claimNotificationCoreService', ['$q', 'ajax', '$location', 'appService', 'cacheService', 'detailCoreService', 'commonService', '$log',
	function($q, ajax, $location, appService, cacheService, detailCoreService, commonService, $log){
	
	function ClaimNotificationCoreService($q, ajax, $location, appService, cacheService, detailCoreService, commonService){
		var self = this;
		self.detailCoreService = detailCoreService;
		detailCoreService.ListDetailCoreService.call(self, $q, ajax, $location, appService, cacheService, commonService);
		self.name = "claim-notification";
	};
	inherit(detailCoreService.ListDetailCoreService, ClaimNotificationCoreService);
	
	/**
	 * Get Claim Notification Product List
	 * 
	 */
	
	ClaimNotificationCoreService.prototype.getClaimNotificationProductList_V3 = function(resourceURL) {
		 var self = this;
		 var deferred = self.$q.defer();
//		 var runtimeURL = "claim-notification/listProduct";
		 var runtimeURL = commonService.getUrl(commonService.urlMap.MODULE_LISTPRODUCT, [self.name]);
		 self.ajax.getRuntime(resourceURL, runtimeURL, function(data) {			
			 deferred.resolve(data);	
		 });
		 return deferred.promise;
	};
	
	ClaimNotificationCoreService.prototype.submitClaimNotification = function(resourceURL, bolValidate) {
		 var deferred = $q.defer();
		 var self = this;
		 var dataSet = self.extractUiDataSet_V3(self.detail);
//		 var dataSet = self.detail;
		 var actionUrl;
		 var docId = self.findElementInDetail_V3(['DocId']);
		 var productType = self.findElementInDetail_V3(['PolicyType']).$;
		 if(!commonService.hasValueNotEmpty(docId)){
			 actionUrl = commonService.getUrl(commonService.urlMap.SUBMIT_CLAIM_NOTIFICATION, [productType]);
		 } else{
			 //actionUrl = "integral/claimNotification/"+docId+"/operations/submit";
			 actionUrl = commonService.getUrl(commonService.urlMap.SUBMIT_CLAIM_NOTIFICATION_BY_DOCID, [productType,docId]);
		 }
//		 var actionUrl = commonService.getUrl(commonService.urlMap.SUBMIT_CLAIM_NOTIFICATION, [productType]);
		 self.ajax.postRuntime(resourceURL, actionUrl, dataSet, function(data){
			 deferred.resolve(data);	
			 if (bolValidate) {
				self.clearErrorInElement(self.detail);
				if(data['ipos-response:response'] == undefined){
					//validate success
					$log.debug('save success');
				} else{
					//validate fail
					self.mergeErrorToDetail(self.findElementInElement_V3(data, ['ipos-response:response-message']));
				 }
			 }
			 self.bolFinishLoading = true;
		 });
		 return deferred.promise;
	 };
/*	
	ClaimNotificationCoreService.prototype.convertJsonPathToArray = function (data, jsonPathChild) {
		var self = this;
		var cloneData = angular.copy(self.findJsonPathInItem(data, jsonPathChild));
		if (cloneData != undefined){
			var cloneDatas = [];
			cloneDatas.push(angular.copy(cloneData));
			self.findJsonPathInItem(self.detail, jsonPathParent)[jsonPathChild.substring(3, jsonPathChild.length)] = cloneDatas;
		}
	 };
*/
	return new ClaimNotificationCoreService($q, ajax, $location, appService, cacheService, detailCoreService, commonService);
}]);
