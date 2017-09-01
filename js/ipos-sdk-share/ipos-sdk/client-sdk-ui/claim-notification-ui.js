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

var claimNotificationUIModule = angular.module('claimNotificationUIModule',['claimNotificationModule', 'commonUIModule'])
.service('claimNotificationUIService', ['$q', 'ajax', '$location', 'appService', 'cacheService', 'commonUIService', 'claimNotificationCoreService', 'commonService',
	function($q, ajax, $location, appService, cacheService, commonUIService, claimNotificationCoreService, commonService){

	function ClaimNotificationUIService($q, ajax, $location, appService, cacheService, claimNotificationCoreService, commonService){
		var self = this;
		claimNotificationCoreService.constructor.call(self, $q, ajax, $location, appService, cacheService, claimNotificationCoreService.detailCoreService, commonService);
		self.lazyChoiceList = [];
	};
	inherit(claimNotificationCoreService.constructor, ClaimNotificationUIService);
	extend(commonUIService.constructor, ClaimNotificationUIService);
	
	ClaimNotificationUIService.prototype.getClaimNotificationLazyList = function (resourceURL, productName) {
		var self = this;
		var deferred = $q.defer();
		if (self.lazyChoicelist == undefined) {
			self.lazyChoicelist = [];
		};
		if (self.lazyChoiceList[productName] == undefined) {						
				self.getLazyChoiceListByModuleAndProduct_V3(resourceURL, productName).then(function(data) {			
				self.lazyChoiceList[productName] = data;				
				deferred.resolve(data);
			});   		
			return deferred.promise;
		}
    };
    
//    ClaimNotificationUIService.prototype.edit = function(resourceURL) {
//		var self = this;
//		var deferred = self.$q.defer();
//		claimNotificationCoreService.detailCoreService.ListDetailCoreService.prototype.getDetail_V3.call(self, resourceURL, true, function(data) {
//			commonService.showGlobalMessage(appService.getI18NText('workspace.save.success'));
//			deferred.resolve(data);
//		}, function(message) {
//			commonService.showGlobalMessage(message, "danger");
//		});
//		return deferred.promise;
//	};
	
	return new ClaimNotificationUIService($q, ajax, $location, appService, cacheService, claimNotificationCoreService, commonService);
}]);