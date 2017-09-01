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
/*ldang4*/

var deathclaimModule = angular.module('deathClaimModule',['coreModule'])
.service('deathClaimCoreService',  ['$q', 'ajax', '$location', 'appService', 'cacheService', 'detailCoreService', 'commonService', '$log',
	function($q, ajax, $location, appService, cacheService, detailCoreService, commonService, $log){

	function DeathClaimCoreService($q, ajax, $location, appService, cacheService, detailCoreService, commonService){
		var self = this;
		self.detailCoreService = detailCoreService;
		detailCoreService.ListDetailCoreService.call(self, $q, ajax, $location, appService, cacheService, commonService);
		self.name = "death-claim-registration";
	};
	inherit(detailCoreService.ListDetailCoreService, DeathClaimCoreService);	
	DeathClaimCoreService.prototype.submitDeathClaimRegistration = function(resourceURL, bolValidate) {
		 var deferred = $q.defer();
		 var self = this;
		 var dataSet = self.extractUiDataSet_V3(self.detail);
//		 var dataSet = self.detail;
//		 var actionUrl = self.name;
		 var docId = self.findElementInDetail_V3(['DocId']);
		// var productType = self.findElementInDetail_V3(['PolicyType']).$;
		 var productType=undefined;
//		 if(!commonService.hasValueNotEmpty(docId)){
//			 actionUrl = commonService.getUrl(commonService.urlMap.SUBMIT_CLAIM_NOTIFICATION, [productType]);
//		 } else{
//			 actionUrl = "integral/claimNotification/"+docId+"/operations/submit";
//			 actionUrl = commonService.getUrl(commonService.urlMap.SUBMIT_CLAIM_NOTIFICATION_BY_DOCID, [productType,docId]);
//		 }
		 var actionUrl = commonService.getUrl(commonService.urlMap.SUBMIT_DEATH_CLAIM_REGISTRATION_BY_DOCID, [docId]);
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
	return new DeathClaimCoreService($q, ajax, $location, appService, cacheService, detailCoreService, commonService);
}]);
