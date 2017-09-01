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
var userModule = angular.module('userModule',['coreModule'])
.service('userCoreService', ['$q', 'ajax', '$location', 'appService', 'cacheService', 'detailCoreService', 'commonService', 'connectService', '$log',
    function($q, ajax, $location, appService, cacheService, detailCoreService, commonService, connectService, $log){
	
	function UserCoreService($q, ajax, $location, appService, cacheService, detailCoreService, commonService, connectService){
		var self = this;
		this.detailCoreService = detailCoreService;
		detailCoreService.ListDetailCoreService.call(self, $q, ajax, $location, appService, cacheService, commonService, connectService);
		this.name = "user";
		this.user=undefined;
		this.originalDetail = undefined;
		this.userValidate=undefined;
		this.packageBundle = "78127880-dc19-4d28-80cb-80be90e1a0cc";
	};
	inherit(detailCoreService.ListDetailCoreService, UserCoreService);
	
	UserCoreService.prototype.initIPOSUserDetail = function(registerType){
		var self = this;
		var deferred = $q.defer();
		var dataUrl = undefined;
		dataUrl = self.commonService.getUrl(self.commonService.urlMap.DOCUMENT_ADD_WITH_UID, [ self.name, self.packageBundle ]);
		
		$log.debug("url :"+dataUrl);
		
		self.ajax.get(dataUrl).success(function(data) {
			
			if(registerType == 'prospect'){
				var newMobileElement = self.addItemToList(data, ['contacts']);
				var typeMobileProp = self.findPropertyInElement(newMobileElement, ['type'], 'value');
				typeMobileProp.value = 'MOBILE';
				
				var newEmailElement = self.addItemToList(data, ['contacts']);
				var typeEmailProp = self.findPropertyInElement(newEmailElement, ['type'], 'value');
				typeEmailProp.value = 'EMAIL';
			}
			self.updateDetailData(data);
			deferred.resolve(data);
		});
		return deferred.promise;
	};
	
	UserCoreService.prototype.createIPOSUserDoc = function(){
		var self = this;
		var deferred = $q.defer();
		var dataUrl = undefined;
		var dataSet = self.extractUiDataSet(self.detail);
		dataUrl = self.commonService.getUrl(self.commonService.urlMap.DOCUMENT_UPDATE_USER, [ self.name]);
		
		$log.debug("url:"+dataUrl);
		
		self.ajax.post(dataUrl, dataSet).success(function(dtoResult) {
			self.updateDetailData(dtoResult);
			deferred.resolve(dtoResult);
		});
		return deferred.promise;
	};
	
	UserCoreService.prototype.validateUser = function(){
		var self = this;
		var deferred = $q.defer();
		var dataUrl = undefined;
		var dataSet = self.extractUiDataSet(self.user);
		dataUrl = self.commonService.getUrl(self.commonService.urlMap.DOCUMENT_COMPUTE, [ self.name]);
		
		$log.debug("url:"+dataUrl);
		
		self.ajax.post(dataUrl, dataSet).success(function(dtoResult) {
			self.updateDetailData(dtoResult);
			var valid = self.checkValid(dtoResult);
			if (valid.validResult){
				deferred.resolve(dtoResult);
			}else{
				 deferred.reject(valid.validMessage);
			}
		});
		return deferred.promise;
	};
	//Run Time V 3	
	UserCoreService.prototype.initObjectUser_V3 = function(){
		var self = this;
		var deferred = $q.defer();
		var url = self.commonService.getUrl(self.commonService.urlMap.DOCUMENT_ADD,[self.name]);
		
		self.ajax.get_V3(url).success(function(data){
			self.updateDetailData(data);
			deferred.resolve(data);
		});
		return  deferred.promise;
	};
	
	UserCoreService.prototype.updateUserV3 = function(docId,dataSet) {
		var self = this;
		var deferred = $q.defer();					
		var url = self.commonService.getUrl(self.commonService.urlMap.DOCUMENT_UPDATE,[self.name , docId]);
		
		self.ajax.postRuntime(resourceURL, url, dataSet, function(result){
			 self.detail = result;
			 self.originalDetail = angular.copy(self.detail);
			 deferred.resolve(result);
			
		 });
		return  deferred.promise;				
	};
	
	UserCoreService.prototype.registerUserRole = function(resourceURL, userName) {
		var self = this;
		var deferred = $q.defer();
		var dataSet = self.extractUiDataSet_V3(self.detail);
		var url = self.commonService.getUrl(self.commonService.urlMap.REGISTER_USER_ROLE,[userName]);
		$log.debug("url:"+url);
/*		self.ajax.post_V3(url, dataSet).success(function(data){
			deferred.resolve(data);
		});*/
		self.ajax.postRuntime(resourceURL, url, dataSet, function(result){
			 deferred.resolve(result);
		});
		return  deferred.promise;				
	};
	
	UserCoreService.prototype.updateProfileInfo = function updateProfileInfo(resourceURL, userName, profileId, userDoc) {
		var self = this;
		var deferred = $q.defer();
		var dataSet = self.extractUiDataSet_V3(userDoc);
		/*var url = self.commonService.getUrl(self.commonService.urlMap.UPDATE_USERROLE_INFORMATION,[userName]);
		$log.debug("url:"+url);*/
/*		self.ajax.post_V3(url, dataSet).success(function(data){
			deferred.resolve(data);
		});*/
	/*	self.ajax.postRuntime(resourceURL, url, dataSet, function(result){
			 deferred.resolve(result);
		});*/
		
		connectService.exeAction({
	    	actionName: "UPDATE_USERROLE_INFORMATION",
	    	actionParams: [userName, profileId],
	    	resourceURL: resourceURL,
	    	method: "PUT",
	    	data: dataSet
	    }).then(function(data){
				deferred.resolve(data);	
	    });
		
		
		return  deferred.promise;				
	};
	
	UserCoreService.prototype.searchUserV3 = function(query){
		var self = this;
		var deferred = $q.defer();
		var url = self.commonService.getUrl(self.commonService.urlMap.DOCUMENT_SEARCH_V3,[self.name ]);
		
		self.ajax.post_V3(url, query).success(function(data){
			
			deferred.resolve(data);
		});
		return  deferred.promise;
	};
	UserCoreService.prototype.findDocumentUserV3 = function(docId){
		var self = this;
		var deferred = $q.defer();
		var url = self.commonService.getUrl(self.commonService.urlMap.DOCUMENT_FIND_DOCUMENT_V3,[self.name ,docId]);
		
		self.ajax.get_V3(url).success(function(data){
			self.user = data;
			deferred.resolve(data);
		});
		return  deferred.promise;
	};	
 
	UserCoreService.prototype.findValueInMapListByKeyJSON = function(data, key, json){
		var self = this;
		if(data == undefined){
			return undefined;
		}
		var items = this.findJsonPathInItem(data, json).Option;
		var i;
		for(i in items){			
			return items;			
		}
		return undefined;
	};
	
	UserCoreService.prototype.computeUserPortal = function(resourceURL, dataSet){
		 var self = this;
		 var deferred = self.$q.defer();
		 var url = self.commonService.getUrl(self.commonService.urlMap.DOCUMENT_COMPUTE_V3, [self.name])	 		 
		 self.ajax.postRuntime(resourceURL, url, dataSet, function(result){
			 self.detail = result;
			 self.originalDetail = angular.copy(self.detail);
			 deferred.resolve(result);
			});
		 return  deferred.promise;
	 };
	 
	 UserCoreService.prototype.reset_V3 = function() {
	     var self = this;
	     self.detail = angular.copy(self.originalDetail);
	 };
	 
	 UserCoreService.prototype.updateUserDetail = function(resourceURL, userName, userDoc) {
		var self = this;
		var deferred = self.$q.defer();
		var dataSet = self.extractUiDataSet_V3(userDoc);
		connectService.exeAction({
	    	actionName: 'USER_ACTION',
	    	actionParams: [userName],
	    	resourceURL: resourceURL,
	    	data: dataSet,
	    	method: 'PUT'
	    }).then(function(data) {
			 deferred.resolve(data);	
	    });
		
		return deferred.promise;
	};
	
	return new UserCoreService($q, ajax, $location, appService, cacheService, detailCoreService, commonService);
}]);
