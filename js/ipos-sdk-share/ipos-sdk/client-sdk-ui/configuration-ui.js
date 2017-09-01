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


var configurationUIModule = angular.module('configurationUIModule',['configurationModule', 'commonUIModule'])
.service('configurationUIService', ['$q', 'ajax', '$location', 'appService', 'cacheService', 'commonUIService', 'configurationCoreService', 'commonService', 'loadingBarService',
	function($q, ajax, $location, appService, cacheService, commonUIService, configurationCoreService, commonService, loadingBarService){

	function ConfigurationUIService($q, ajax, $location, appService, cacheService, configurationCoreService){
		configurationCoreService.constructor.call(this, $q, ajax, $location, appService, cacheService, configurationCoreService.detailCoreService, commonService);
	};
	inherit(configurationCoreService.constructor, ConfigurationUIService);
	extend(commonUIService.constructor, ConfigurationUIService);
	


	//************************* v3.0 version ****************************
	// /*
	// ConfigurationUIService.prototype.loadConfiguration = function(portlet, portletId, userId, userType){
	// 	var self = this;	 
	// 	var deferred = self.$q.defer();
	// 	configurationCoreService.loadDetail.call(self, portlet, portletId, userId, userType).then(function(detail){
	// 		deferred.resolve(detail);
	// 	});
	// 	return  deferred.promise;
	// };
	// */
	// //V3
	// //@dnguyen98
	// ConfigurationUIService.prototype.loadConfiguration = function(){
	// 	var self = this;	 
	// 	var deferred = self.$q.defer();
	// 	configurationCoreService.loadDetail.call().then(function(detail){
	// 		deferred.resolve(detail);
	// 	});
	// 	return  deferred.promise;
	// };
	
	// //V3_2
	// ConfigurationUIService.prototype.searchMyclientsConfiguration_V3 = function(query){
	// 	var self = this;	 
	// 	var deferred = self.$q.defer();
	// 	configurationCoreService.searchConfiguration_V3.call(self,query).then(function(detail){
	// 		deferred.resolve(detail);
	// 	});
	// 	return  deferred.promise;
	// };
	
	// ConfigurationUIService.prototype.findDocumentMyclientsConfiguration_V3 = function(docId){
	// 	var self = this;	 
	// 	var deferred = self.$q.defer();
	// 	configurationCoreService.loadConfiguration_V3.call(self,docId).then(function(detail){
	// 		deferred.resolve(detail);
	// 	});
	// 	return  deferred.promise;
	// };
	
	// ConfigurationUIService.prototype.getDocumentConfigurationList = function(resourceURL,docId){
	// 	var self = this;
	// 	var deferred = self.$q.defer();
	// 	configurationCoreService.getDocumentConfigurationList.call(self, resourceURL , docId).then(function(list){
	// 		self.items = list;
	// 		deferred.resolve(list);
	// 	});
	// 	return  deferred.promise;
	// };
	
	ConfigurationUIService.prototype.loadUserList = function(resourceURL, company){
	    var self = this;
	    var deferred = self.$q.defer();
	    var url = "";
	
	    url = commonService.getUrl(commonService.urlMap.MODULE_USERLIST_V3, [company]);
	
	    self.ajax.getRuntime(resourceURL, url, function(data){
	        deferred.resolve(data);						
	    });
	    return  deferred.promise;
	};
	 
	 
	//  ConfigurationUIService.prototype.updateUser = function(resourceURL, detail){
	// 	 var self = this;
	// 	 var deferred = self.$q.defer();
	// 	 var url = "";
	// 	 var userDocId = self.findElementInElement_V3(detail, ['DocId']);
	// 	 var dataSet = self.extractUiDataSet_V3(detail);
	// 	url = commonService.getUrl(commonService.urlMap.DOCUMENT_VALIDATE_AND_UPDATE, ['user', userDocId]);

	// 	 self.ajax.postRuntime(resourceURL, url, dataSet, function(data){
	// 		 if(self.isSuccess(data)){
	// 			 commonUIService.showNotifyMessage("Update Successfully", "success");
	// 		 }
	// 		 else{
	// 			 commonUIService.showNotifyMessage("Update Failed");
	// 		 }
			 	
			 
	//  });
	//  return  deferred.promise;
	// };
	
	/**
	 * Loading global common config. Then set to common-core.js
	 * @param  {[type]} configInDB [description]
	 * @return {[type]}            [description]
	 */
	/*ConfigurationUIService.prototype.loadGlobalCommonConfigFromServer = function(){
		var self = this;
		var deferred = self.$q.defer();
		loadingBarService.showLoadingBar();


		self.getConfigFromDB(commonService.CONSTANTS.CONFIG_KEY.GLOBAL).then(function(configInDB) {			
			self.updateConfigToCommonService(configInDB);
			loadingBarService.hideLoadingBar();
			deferred.resolve();
		});

		return deferred.promise;
	};*/
	
	/**
	 * Load common config from database based on config key. Then set to common-core.js
	 * @param  {[type]} configInDB [description]
	 * @return {[type]}            [description]
	 */
	ConfigurationUIService.prototype.loadCommonConfigFromServer = function(configKey){
		var self = this;
		var deferred = self.$q.defer();
		//loadingBarService.showLoadingBar();

		self.getConfigFromDB(configKey).then(function(configInDB) {
			self.updateConfigToCommonService(configInDB);
			//loadingBarService.hideLoadingBar();
			deferred.resolve();
		});

		return deferred.promise;
	};
	
	/**
	 * Save common config to database
	 * @param  {[type]} configValue	[description]
	 * @param  {[type]} configKey	[description]
	 * @param  {[type]} moreParams	[description]
	 * @return
	 */
	ConfigurationUIService.prototype.saveCommonConfigToDB = function(configValue, configKey, moreParams) {
		var self = this;
		var deferred = self.$q.defer();
		loadingBarService.showLoadingBar();

		self.saveConfigToDB(configValue, configKey, moreParams).then(function() {
			self.updateConfigToCommonService(configValue);
			loadingBarService.hideLoadingBar();
			deferred.resolve();
		});

		return deferred.promise;
	}
	
	ConfigurationUIService.prototype.updateConfigToCommonService = function(configInDB){
		commonService.options =  $.extend(true, commonService.options, configInDB);
	};
	
	ConfigurationUIService.prototype.getAvailableLanguages = function() {
		var self = this;
		var deferred = self.$q.defer();
		self.getAvailableLanguagesFromDB().then(function(result) {
			deferred.resolve(result);
		});
		
		return deferred.promise;
		
	};
	 
	//End V3_2
	//************************* v3.0 version ****************************
	
	return new ConfigurationUIService($q, ajax, $location, appService, cacheService, configurationCoreService, commonService);
}]);
