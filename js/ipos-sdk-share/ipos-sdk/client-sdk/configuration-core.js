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
var configurationModule = angular.module('configurationModule',['coreModule'])
.service('configurationCoreService', ['$q', 'ajax', '$http','$location', 'appService', 'cacheService', 'detailCoreService', 'commonService',
	function($q, ajax, $http, $location, appService, cacheService, detailCoreService, commonService){
	
	/**
	 * @constructor
	 * @extends ListDetailCoreService
	 * @param $q
	 * @param ajax
	 * @param $location
	 * @param appService
	 * @param cacheService
	 */
	function ConfigurationCoreService($q, ajax, $location, appService, cacheService, detailCoreService, commonService){
		var self = this;
		self.detailCoreService = detailCoreService;
		detailCoreService.ListDetailCoreService.call(self, $q, ajax, $location, appService, cacheService, commonService);
		this.name = "admin";
	}
	inherit(detailCoreService.ListDetailCoreService, ConfigurationCoreService);

	//************************* v3.0 version ****************************
	/*
	ConfigurationCoreService.prototype.loadDetail = function(portlet, portletId, userId, userType){
		var self = this;
		self.bolFinishLoading = false;
		var deferred = self.$q.defer();
		var url = self.commonService.getUrl(self.commonService.urlMap.PORTLET_CONFIGURATION_FIND, ["portal", portlet, portletId, userId, userType]);
		var data = [{"properties":[{"value":"portletConfiguration","name":"formName","source":null,"prefix":null,"text":null,"default":null},{"value":null,"name":"validate","source":null,"prefix":null,"text":null,"default":null}],"elements":[{"properties":[],"elements":[{"properties":[],"elements":[{"properties":[{"value":"myclients","name":"value","source":null,"prefix":null,"text":null,"default":null},{"value":"0","name":"mandatory","source":null,"prefix":null,"text":null,"default":null},{"value":"1","name":"visible","source":null,"prefix":null,"text":null,"default":null},{"value":"1","name":"editable","source":null,"prefix":null,"text":null,"default":null}],"elements":[],"restriction":null,"name":"Portlet_Id","type":null,"tags":null,"refUid":null,"refType":null,"multiple":null},{"properties":[{"value":"10198","name":"value","source":null,"prefix":null,"text":null,"default":null},{"value":"0","name":"mandatory","source":null,"prefix":null,"text":null,"default":null},{"value":"1","name":"visible","source":null,"prefix":null,"text":null,"default":null},{"value":"0","name":"editable","source":null,"prefix":null,"text":null,"default":null}],"elements":[],"restriction":null,"name":"User_Id","type":null,"tags":null,"refUid":null,"refType":null,"multiple":null},{"properties":[{"value":"admin","name":"value","source":null,"prefix":null,"text":null,"default":null},{"value":"0","name":"mandatory","source":null,"prefix":null,"text":null,"default":null},{"value":"1","name":"visible","source":null,"prefix":null,"text":null,"default":null},{"value":"1","name":"editable","source":null,"prefix":null,"text":null,"default":null}],"elements":[],"restriction":null,"name":"User_Type","type":null,"tags":null,"refUid":null,"refType":null,"multiple":null},{"properties":[{"value":"dob,client_number,idtype,idnumber,name","name":"value","source":null,"prefix":null,"text":null,"default":null},{"value":"0","name":"mandatory","source":null,"prefix":null,"text":null,"default":null},{"value":"1","name":"visible","source":null,"prefix":null,"text":null,"default":null},{"value":"1","name":"editable","source":null,"prefix":null,"text":null,"default":null}],"elements":[],"restriction":{"enumerations":[{"value":"client_number","text":"Client Number","group":null},{"value":"salutation","text":"Salutation","group":null},{"value":"name","text":"Name","group":null},{"value":"dob","text":"Date of Birth","group":null},{"value":"idtype","text":"ID Type","group":null},{"value":"idnumber","text":"ID Number","group":null},{"value":"marital_status","text":"Marital Status","group":null},{"value":"race","text":"Race","group":null},{"value":"gender","text":"Gender","group":null},{"value":"nationality","text":"Nationality","group":null},{"value":"occupation","text":"Occupation","group":null},{"value":"mobile_tel","text":"Mobile Tel","group":null},{"value":"office_tel","text":"Office Tel","group":null},{"value":"home_tel","text":"Home Tel","group":null},{"value":"email","text":"Email","group":null},{"value":"r_address","text":"Residential Address","group":null},{"value":"r_houseNo","text":"Residential Blk/House No","group":null},{"value":"r_street","text":"Residential Street","group":null},{"value":"r_unitNo","text":"Residential Unit No","group":null},{"value":"r_building","text":"Residential Building","group":null},{"value":"r_city","text":"Residential City/State","group":null},{"value":"r_country","text":"Residential Country","group":null},{"value":"r_postal","text":"Residential Postal Code","group":null},{"value":"c_address","text":"Corresponding Address","group":null},{"value":"c_houseNo","text":"Corresponding Blk/House No","group":null},{"value":"c_street","text":"Corresponding Street","group":null},{"value":"c_unitNo","text":"Corresponding Unit No","group":null},{"value":"c_building","text":"Corresponding Building","group":null},{"value":"c_city","text":"Corresponding City/State","group":null},{"value":"c_country","text":"Corresponding Country","group":null},{"value":"c_postal","text":"Corresponding Postal Code","group":null}],"source":null,"lazy":null,"prefix":null},"name":"Column_Selected","type":null,"tags":null,"refUid":null,"refType":null,"multiple":null},{"properties":[],"elements":[{"properties":[{"value":"myclients","name":"value","source":null,"prefix":null,"text":null,"default":null}],"elements":[],"restriction":null,"name":"Server_Type","type":null,"tags":null,"refUid":null,"refType":null,"multiple":null},{"properties":[{"value":"1","name":"value","source":null,"prefix":null,"text":null,"default":null},{"value":"0","name":"mandatory","source":null,"prefix":null,"text":null,"default":null},{"value":"1","name":"visible","source":null,"prefix":null,"text":null,"default":null},{"value":"1","name":"editable","source":null,"prefix":null,"text":null,"default":null}],"elements":[],"restriction":{"enumerations":[{"value":"1","text":"My_Client_MSP1_Service_Endpoint","group":null},{"value":"2","text":"My_Client_MSP2_Service_Endpoint","group":null}],"source":null,"lazy":null,"prefix":null},"name":"Server_Id","type":null,"tags":null,"refUid":null,"refType":null,"multiple":null}],"restriction":null,"name":"server","type":null,"tags":"serverInput","refUid":null,"refType":null,"multiple":null}],"restriction":null,"name":"basic","type":null,"tags":"basic","refUid":null,"refType":null,"multiple":null}],"restriction":null,"name":"portletInputs","type":null,"tags":"Inputs","refUid":null,"refType":null,"multiple":null},{"properties":[],"elements":[{"properties":[],"elements":[{"properties":[],"elements":[{"properties":[{"value":"","name":"value","source":null,"prefix":null,"text":null,"default":null}],"elements":[],"restriction":null,"name":"Server_Name","type":null,"tags":null,"refUid":null,"refType":null,"multiple":null},{"properties":[{"value":"","name":"value","source":null,"prefix":null,"text":null,"default":null}],"elements":[],"restriction":null,"name":"Server_Url","type":null,"tags":null,"refUid":null,"refType":null,"multiple":null}],"restriction":null,"name":"server","type":null,"tags":"serverOutput","refUid":null,"refType":null,"multiple":null}],"restriction":null,"name":"summary","type":null,"tags":"summary","refUid":null,"refType":null,"multiple":null}],"restriction":null,"name":"portletOutputs","type":null,"tags":"Outputs","refUid":null,"refType":null,"multiple":null}],"restriction":null,"name":"21314224848222","type":null,"tags":null,"refUid":null,"refType":null,"multiple":null,"uid":"64605778-1fbb-45f9-9675-947eda6b4039","docType":"portletConfig","docNum":null,"parentUid":null,"parentDocType":null,"packageBundle":"bfa4bce4-1e20-40ca-add2-a1e7f026f9e2","packageName":"Poetlet - Configuration","dateFormat":"yyyy-MM-dd","status":"DRAFT","name1":null,"name2":null,"name3":null,"ownerUid":"system","updatedUserUid":"system","createdDate":"1425895347000","updatedDate":"1427175039000","docVersion":"2.1","errorMessages":null}]
		
		self.updateDetailData(data[0]);		//temporary, it should be self.updateDetailData(data)
		self.useCurrentDetailDataAsOriginal();
		self.bolFinishLoading = true;
		deferred.resolve(data[0]);
		
		/*self.ajax.get(url).success(function(data){
			self.updateDetailData(data[0]);		//temporary, it should be self.updateDetailData(data)
			self.useCurrentDetailDataAsOriginal();
			self.bolFinishLoading = true;
			deferred.resolve(data[0]);				//temporary, it should be deferred.resolve(data)
		});
		return  deferred.promise;
	};
	*/
	// // V3
	// //@dnguyen98
	// ConfigurationCoreService.prototype.loadDetail = function(){
	// 	var self = this;
	// 	self.bolFinishLoading = false;
	// 	var deferred = self.$q.defer();
	// 	var url = self.commonService.getUrl(self.commonService.urlMap.PORTLET_CONFIGURATION_FIND_V3, []);
	// 	self.ajax.get_V3(url).success(function(data){
	// 		self.updateDetailData(data[0]);		//temporary, it should be self.updateDetailData(data)
	// 		self.useCurrentDetailDataAsOriginal();
	// 		self.bolFinishLoading = true;
	// 		deferred.resolve(data[0]);				//temporary, it should be deferred.resolve(data)
	// 	});
	// 	return  deferred.promise;
	// };
	
	// ConfigurationCoreService.prototype.updateDetail = function(){
	// 	var self = this;
	// 	var dataSet = self.extractUiDataSet(self.detail);
	// 	var deferred = self.$q.defer();
	// 	var url = self.commonService.getUrl(self.commonService.urlMap.PORTLET_CONFIGURATION_UPDATE, ["portal"]);
	// 	self.ajax.post(url, dataSet).success(function(result){
	// 		deferred.resolve(result);
	// 	});
	// 	return  deferred.promise;
	// };
	
	// //V3_2
	// ConfigurationCoreService.prototype.searchConfiguration_V3 = function(query){
	// 	var self = this;
	// 	var deferred = self.$q.defer();
	// 	var url = self.commonService.getUrl(self.commonService.urlMap.DOCUMENT_SEARCH_ALL_V3);
	// 	self.ajax.post_V3(url,query).success(function(data){
	// 		deferred.resolve(data);
	// 	});
	// 	return  deferred.promise;
	// };
	
	// ConfigurationCoreService.prototype.loadConfiguration_V3 = function(docId){
	// 	var self = this;
	// 	var deferred = self.$q.defer();
	// 	var url = self.commonService.getUrl(self.commonService.urlMap.DOCUMENT_FIND_DOCUMENT_V3,[self.name ,docId]);
	// 	self.ajax.get_V3(url).success(function(data){
	// 		self.user = data;
	// 		deferred.resolve(data);
	// 	});
	// 	return  deferred.promise;
	// };
	
	// ConfigurationCoreService.prototype.updateDetail_V3 = function(docId){
	// 	var self = this;
	// 	var dataSet = self.extractUiDataSet_V3(self.detail);
	// 	var deferred = self.$q.defer();
	// 	var url = self.commonService.getUrl(self.commonService.urlMap.DOCUMENT_VALIDATE_AND_UPDATE, [self.name ,docId]);
	// 	self.ajax.post_V3(url, dataSet).success(function(result){
	// 		self.updateDetailData_V3(result);
	// 		self.useCurrentDetailDataAsOriginal();
	// 		self.bolFinishLoading = true;
	// 		deferred.resolve(result);
	// 	});
	// 	return  deferred.promise;
	// };
	
	// ConfigurationCoreService.prototype.getDocumentConfigurationList = function(resourceURL,docId){
	// 	 var self = this;
	// 	 var deferred = self.$q.defer();
	// 	 var url = self.commonService.getUrl(self.commonService.urlMap.DOCUMENT_EDIT, ["portletconfig", docId]);
	// 	 self.ajax.getRuntime(resourceURL, url, function(data){
	// 		 deferred.resolve(data);						
	// 	 });
	// 	 return  deferred.promise;
	//  };
	//  ConfigurationCoreService.prototype.update_V3 = function(resourceURL,docId){
	// 		var self = this;
	// 		var deferred = self.$q.defer();
	// 		var url = self.commonService.getUrl(self.commonService.urlMap.DOCUMENT_VALIDATE_AND_UPDATE, ["portletconfig", docId]);
	// 		self.ajax.postRuntime(resourceURL, url, function(data){
	// 			 deferred.resolve(data);						
	// 		 });
	// 		return  deferred.promise;
	// 	};
	
	// ConfigurationCoreService.prototype.update_V3 = function(){
	// 	var self = this;
	// 	var deferred = self.$q.defer();
	// 	detailCoreService.ListDetailCoreService.prototype.savePortletConfiguration_V3.call(self, true, function(data){
	// 		commonService.showGlobalMessage(appService.getI18NText('workspace.save.success'));
	// 		deferred.resolve(data);
	// 	}, function(message){
	// 		commonService.showGlobalMessage(message, "danger");
	// 	});
	// 	return  deferred.promise;
	// };
	
	function canUseCache(configFromLocal) {
		var result = true;
		
		
		if (configFromLocal){
			//if configurations live time is over, get it again
			if((new Date()).getTime() - configFromLocal.retrieveTime > configFromLocal.config_live_time)
				result = false;
		}
		//if not found configurations in cache
		else{
			result = false;
		}


		return result;
	}
	/**
     * Get config from DB
     * {param} moreParams : 
     * 		{boolean}	useCache	get configurations from cache or from DB
     */
	ConfigurationCoreService.prototype.getConfigFromDB = function(key, moreParams) {
		var self = this;
		var promise;
		var requestUrl;
		var deferred = $q.defer();
		if(!key){
			key = commonService.CONSTANTS.CONFIG_KEY.UI;
		}
		moreParams = moreParams || {
			useCache: true,//default we'll use cache
		};

		//get configurations from localStorage
		var configFromLocal = JSON.parse(localStorage.getItem(key));


		//will we use cache?
		if (moreParams.useCache && canUseCache(configFromLocal)){			
			deferred.resolve(configFromLocal);
		}
		else{
			//if resourceURL existed, request through AbstractBasicController#findPortalCommonConfig()
			if (moreParams.portletId ){
				var resourceURL = self.initialMethodPortletURL(moreParams.portletId, "findPortalCommonConfig");
				resourceURL.setParameter("configKey", key);
				requestUrl = resourceURL.toString();
			}
			//if not existed, we'll go through ipos-portal-hook way
			else{
				requestUrl = location.protocol + '//' + location.host + themeDisplay.getPathContext() +
//				'/ipos-portal-hook/' + 'get-config-data';
				'/ipos-portal-hook/' + 'get-config-data?configKey=' + key;
			}
			
			//TODO: change to use ajax service here
			// self.ajax.get_V3(requestUrl).success(function(result) {
			$http.get(requestUrl).success(function(result) {
				result['retrieveTime'] = (new Date()).getTime();
				if(key!=commonService.CONSTANTS.CONFIG_KEY.GLOBAL){
				localStorage.setItem(key, JSON.stringify(result));
				}
				deferred.resolve(result);
			});
		}
		
		return deferred.promise;
	};

	ConfigurationCoreService.prototype.saveConfigToDB = function(configValue, configKey, moreParams) {
		var self = this;
		var deferred = $q.defer();
		moreParams = moreParams || {
			portletId: myArrayPortletId["admin-config"],//default we'll use admin-config portlet
		};
		var resourceURL = self.initialMethodPortletURL(moreParams.portletId, "updatePortalCommonConfig");
    	resourceURL.setParameter("configKey", configKey);
    	var configValueStr = JSON.stringify(configValue);
    	ajax.postRes(resourceURL.toString(), configValueStr, function() {
    		configValue = JSON.parse(configValueStr);
			configValue['retrieveTime'] = (new Date()).getTime();
			if(configKey!=commonService.CONSTANTS.CONFIG_KEY.GLOBAL){
    		localStorage.setItem(configKey, JSON.stringify(configValue));
			}
            deferred.resolve();
		}, function() {
			deferred.reject();
		});

		return deferred.promise;
	};
	
	ConfigurationCoreService.prototype.getAvailableLanguagesFromDB = function() {
		var self = this;
		var deferred = $q.defer();
		var requestUrl = location.protocol + '//' + location.host + themeDisplay.getPathContext() + '/ipos-portal-hook/' + 'get-available-languages';
		$http.get(requestUrl).success(function(result) {
			deferred.resolve(result);
		});

		return deferred.promise;
	};
	 
	//End V3_2
	// ConfigurationCoreService.prototype.getDocumentConfigurationFile_V3 = function(resourceURL, moduleName, productName){
	// 	var self = this;
	// 	var deferred = $q.defer();
	// 	var url = "";
	// 	if(productName == "" || productName == undefined){			
	// 		url = commonService.getUrl(commonService.urlMap.MODULE_ADMIN_CONFIGURATION, [moduleName]);
	// 	}
	// 	else{
	// 		url = commonService.getUrl(commonService.urlMap.MODULE_PRODUCT_ADMIN_CONFIGURATION, [moduleName, productName]);
	// 	}
	// 	self.ajax.getRuntime(resourceURL, url, function(data){
	// 		 deferred.resolve(data);						
	// 	 });
	// 	return  deferred.promise;
	// };	 	 
	// //End V3_2
	//************************* v3.0 version ****************************
	
	return new ConfigurationCoreService($q, ajax, $location,  appService, cacheService, detailCoreService, commonService);
}]);
