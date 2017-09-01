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

var claimModule = angular.module('claimModule',['coreModule'])
.service('claimCoreService', ['$q', 'ajax', '$location', 'appService', 'cacheService', 'detailCoreService', 'commonService',
	function($q, ajax, $location, appService, cacheService, detailCoreService, commonService){
	
	function ClaimCoreService($q, ajax, $location, appService, cacheService, detailCoreService, commonService){
		var self = this;
		self.detailCoreService = detailCoreService;
		detailCoreService.ListDetailCoreService.call(self, $q, ajax, $location, appService, cacheService, commonService);
		self.name = "claim";
	};
	inherit(detailCoreService.ListDetailCoreService, ClaimCoreService);


	 ClaimCoreService.prototype.loadClaimDetail = function(resourceURL,claimNum){
		 var self = this;
		 var deferred = self.$q.defer();
		 var url = self.commonService.getUrl(self.commonService.urlMap.CLAIM_DETAIL_V3, [claimNum]);
		 self.ajax.getRuntime(resourceURL, url, function(data){
			 self.detail=data;
			 deferred.resolve(data);						
		 });
		 return  deferred.promise;
	 };
	 ClaimCoreService.prototype.loadClaimListAgent = function(resourceURL){
		 var self = this;
		 var deferred = self.$q.defer();
		 var url = self.commonService.getUrl(self.commonService.urlMap.SERVICE_FIND_DOCUMENTLIST_CURRENT_AGENT_V3, ['claims']);
		 self.ajax.getRuntime(resourceURL, url, function(data){
			 deferred.resolve(data);						
		 });
		 return  deferred.promise;
	 };
	 
	 ClaimCoreService.prototype.loadClaimListClient = function(resourceURL){
		 var self = this;
		 var deferred = self.$q.defer();
	
		 var url = self.commonService.getUrl(self.commonService.urlMap.SERVICE_FIND_DOCUMENTLIST_CURRENT_CLIENT_V3, ['claims']);
		 self.ajax.getRuntime(resourceURL, url, function(data){
			 deferred.resolve(data);						
		 });
		 return  deferred.promise;
	 };
	 ClaimCoreService.prototype.loadClaimListClientMNCLife = function(resourceURL,BirthDay,FullName,Gender,RiskGroup){
		 var self = this;
		 var deferred = self.$q.defer();
	
		 var url = self.commonService.getUrl(self.commonService.urlMap.SERVICE_FIND_DOCUMENTLIST_MNCLIFE_CLIENT_V3, ['claims',BirthDay,FullName,Gender,RiskGroup]);
		 self.ajax.getRuntime(resourceURL, url, function(data){
			 deferred.resolve(data);						
		 });
		 return  deferred.promise;
	 };
	 ClaimCoreService.prototype.getDocumentList_V3 = function(resourceURL,clientId){
		 var self = this;
		 var deferred = self.$q.defer();
		 var url = self.commonService.getUrl(self.commonService.urlMap.SERVICE_FIND_DOCUMENTLIST_CURRENT_AGENT_V3, ['claims']);
		 self.ajax.getRuntime(resourceURL, url, function(data){
			 // mock json test
			 //data = {"getClaimListResponse":{"return":[{"errors":"","claimId":"V3000173","clientId":"50000898","cover":"","fullName":"A Fac Outforward","incr":"9000.0","lossDate":"2015-02-15","policyId":"V0000559","regno":"","reportDate":"2015-02-15","status":"ACTIVE","cnttype":"VPM"},{"errors":"","claimId":"V3000173","clientId":"50000898","cover":"","fullName":"A Fac Outforward","incr":"9000.0","lossDate":"2015-02-15","policyId":"V0000559","regno":"","reportDate":"2015-02-15","status":"ACTIVE","cnttype":"VPM"}]}};
			 self.items = data;
			 deferred.resolve(data);						
		 });
		 return  deferred.promise;
	 };
	return new ClaimCoreService($q, ajax, $location, appService, cacheService, detailCoreService, commonService);
}]);
