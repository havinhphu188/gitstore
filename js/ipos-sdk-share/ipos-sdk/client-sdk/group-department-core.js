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
var groupDepartmentModule = angular.module('groupDepartmentModule',['coreModule'])
.service('groupDepartmentCoreService', ['$q', 'ajax', '$http', '$location', 'appService', 'cacheService', 'detailCoreService', 'salecaseCoreService', 'commonService',
	function($q, ajax, $http, $location, appService, cacheService, detailCoreService, salecaseCoreService, commonService){
	
	function groupDepartmentCoreService($q, ajax,  $http, $location,  appService, cacheService, detailCoreService, salecaseCoreService, commonService){
		var self = this;
		this.detailCoreService = detailCoreService;
		this.salecaseCoreService = salecaseCoreService;
		detailCoreService.ListDetailCoreService.call(self, $q,   ajax, $location, appService, cacheService, salecaseCoreService, commonService);
	//	this.name = commonService.CONSTANTS.MODULE_NAME.HOME;
	//	self.init();
	};
	inherit(detailCoreService.ListDetailCoreService, groupDepartmentCoreService);
	
	groupDepartmentCoreService.prototype.groupDepartmentManagerActions = function(resourceURL, groupManagerDecision, productName){
		var self = this;
		var deferred = self.$q.defer();
		var dataset = self.extractUiDataSet_V3(self.detail);
		var docId = self.findElementInDetail_V3(['DocInfo']).DocId;
		var runtimeURL = commonService.getUrl(commonService.urlMap.SET_GROUP_DEPARTMENT_DECISION, [docId,groupManagerDecision,productName]);
		self.ajax.postRuntime(resourceURL, runtimeURL, dataset, function(data){			
			if(self.isSuccess(data)){
				self.updateDetailData_V3(data);
			 } else{	//validate fail
				 self.mergeErrorToDetail(self.findElementInElement_V3(data, ['ipos-response:response-message']));
			 }

			deferred.resolve(data);	
		 });
		 return deferred.promise;
		
		
	};
	
	
	return new groupDepartmentCoreService($q, ajax,  $http, $location,  appService, cacheService, detailCoreService, salecaseCoreService, commonService);
}]);