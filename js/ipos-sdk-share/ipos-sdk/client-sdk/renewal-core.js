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
var renewalModule = angular.module('renewalModule',['coreModule'])
.service('renewalCoreService', ['$q', 'ajax', '$location', 'appService', 'cacheService', 'detailCoreService', 'commonService',  
	function($q, ajax, $location, appService, cacheService, detailCoreService, commonService){
	
	function RenewalCoreService($q, ajax, $location, appService, cacheService, detailCoreService, commonService){
		var self = this;
		this.detailCoreService = detailCoreService;
		detailCoreService.ListDetailCoreService.call(self, $q, ajax, $location, appService, cacheService, commonService);
	//	this.name = commonService.CONSTANTS.MODULE_NAME.HOME;
	//	self.init();
	};
	inherit(detailCoreService.ListDetailCoreService, RenewalCoreService);
	 	
	RenewalCoreService.prototype.loadPolicyDetail = function(resourceURL, policyNum, productName){
		 var self = this;
		 var deferred = self.$q.defer();
		 var url = commonService.getUrl(commonService.urlMap.GET_POLICY_DETAIL, [policyNum,productName]);
		 self.ajax.getRuntime(resourceURL, url, function(data){
			 self.detail = data;
			 deferred.resolve(data);						
		 });
		 return  deferred.promise;
	 };	
	 
	 RenewalCoreService.prototype.covertJsonPathToArray = function (data,jsonPathParent,jsonPathChild){
		var self = this;
		var cloneData = angular.copy(self.findJsonPathInItem(data,jsonPathChild));
		if (cloneData!=undefined){
		var cloneDatas = [];
			cloneDatas.push(angular.copy(cloneData));
			self.findJsonPathInItem(self.detail,jsonPathParent)[jsonPathChild.substring(3,jsonPathChild.length)]=cloneDatas;
		}
	};
	 
	return new RenewalCoreService($q, ajax, $location, appService, cacheService, detailCoreService, commonService);
}]);