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

var clientModule = angular.module('clientModule',['coreModule'])
.service('clientCoreService', ['$q', 'ajax', '$location', 'appService', 'cacheService', 'detailCoreService', 'commonService',
	function($q, ajax, $location, appService, cacheService, detailCoreService, commonService){

	function ClientCoreService($q, ajax, $location, appService, cacheService, detailCoreService, commonService){
		var self = this;
		this.detailCoreService = detailCoreService;
		detailCoreService.ListDetailCoreService.call(self, $q, ajax, $location, appService, cacheService, commonService);
		this.name = "client";
		this.client = undefined;
		this.originalDetail = undefined;
		this.extraDetail.policyHistory = [];
		this.extraDetail.policyHistoryDetail = null;
		this.CONTACT_TYPES = ['MOBILE', 'OFFICE', 'HOME', 'EMAIL'];
	};
	inherit(detailCoreService.ListDetailCoreService, ClientCoreService);
	
	ClientCoreService.prototype.loadPolicyHistory = function(clientId, subordinateUid){
		var self = this;
		var deferred = self.$q.defer();
		self.extraDetail.policyHistory = [];
		var url = self.commonService.getUrl(self.commonService.urlMap.CLIENT_POLICY_HISTORY, [clientId]);
		if(commonService.hasValueNotEmpty(subordinateUid)){
			url = self.commonService.getUrl(self.commonService.urlMap.CLIENT_POLICY_HISTORY_SUBORDINATE, [clientId, subordinateUid]);
		}
		self.ajax.get(url).success(function(data){
			self.extraDetail.policyHistory = data;
			deferred.resolve(data);
		});
		return  deferred.promise;
	};
	
	ClientCoreService.prototype.loadPolicyHistoryDetail = function(policyNum, subordinateUid){
		var self = this;
		var deferred = self.$q.defer();
		self.extraDetail.policyHistoryDetail = null;
		var url = self.commonService.getUrl(self.commonService.urlMap.CLIENT_POLICY_DETAIL, [policyNum]);
		if(commonService.hasValueNotEmpty(subordinateUid)){
			url = self.commonService.getUrl(self.commonService.urlMap.CLIENT_POLICY_DETAIL_SUBORDINATE, [policyNum, subordinateUid]);
		}
		self.ajax.get(url).success(function(data){
			self.extraDetail.policyHistoryDetail = data;
			deferred.resolve(data);
		});
		return  deferred.promise;
	};
	
	ClientCoreService.prototype.linkProspect = function(){
		var self = this;
		var deferred = self.$q.defer();
		var url = self.commonService.getUrl(self.commonService.urlMap.CLIENT_PROSPECT_LINK, [self.prospectUid]);
		var dataSet = self.extractUiDataSet(self.detail);
		self.ajax.post(url, dataSet).success(function(result){
			deferred.resolve(result);
		});
		return  deferred.promise;
	};
	
	ClientCoreService.prototype.unlinkProspect = function(){
		var self = this;
		var deferred = self.$q.defer();
		var url = self.commonService.getUrl(self.commonService.urlMap.CLIENT_PROSPECT_UNLINK, [self.prospectUid]);
		self.ajax.get(url).success(function(result){
			deferred.resolve(result);
		});
		return  deferred.promise;
	};
	
	ClientCoreService.prototype.getContactObjectByType = function(contactElements, type) {
		var self = this;
		for(var i = 0; i < contactElements.length; i++) {
			var item = contactElements[i];
			var properties = item.properties;
			var elements = item.elements;
			if(properties.length>0){
				var currType = self.findPropertyInElement(item,[],'type').value;
				if (currType == type) {
					var val = self.findPropertyInElement(item,[],'value').value;
					return { 'type' : type, 
							'value' : val};
				}
			}
			
			if(elements.length>0){
				var currType = self.findPropertyInElement(item,['type'],'value').value;
				if (currType == type) {
					var val = self.findPropertyInElement(item,['value'],'value').value;
					return { 'type' : type, 
							'value' : val};
				}
			}
		}
		return { 'type' : type, 
				'value' : ''};
	};
	
	ClientCoreService.prototype.toggleStarClient = function(uid, isCurrentStarred){
		var self = this;
		var deferred = self.$q.defer();
		var url = (isCurrentStarred == false ? self.commonService.getUrl(self.commonService.urlMap.CLIENT_STAR, [uid]) : self.commonService.getUrl(self.commonService.urlMap.CLIENT_UNSTAR, [uid]));
		self.ajax.get(url).success(function(result){
			deferred.resolve(result);
		});
		return  deferred.promise;
	};
	
	ClientCoreService.prototype.loadStarredList = function(){
		var self = this;
		var deferred = self.$q.defer();
		var url = self.commonService.getUrl(self.commonService.urlMap.CLIENT_LISTSTARRED, []);
		self.ajax.get(url).success(function(result){
			deferred.resolve(result);
		});
		return  deferred.promise;
	};
	
//	ClientCoreService.prototype.loadList = function(portletUid, userId){
//		 var self = this;
//		 var deferred = self.$q.defer();
////		 var docType = commonService.CONSTANTS.DOCTYPE.METADATA;
////		 var module = self.name;
//		 var url = self.commonService.getUrl(self.commonService.urlMap.CLIENT_LIST, ["portal", portletUid, userId]);
//		 self.ajax.get(url).success(function(data){
//			//self.items[docType].put(module, data);	
//			deferred.resolve(data);
//		 });
//		 return  deferred.promise;
//	 };
	 ClientCoreService.prototype.loadList = function(resourceURL){
		 var self = this;
		 var deferred = self.$q.defer();
		 var url = self.commonService.getUrl(self.commonService.urlMap.SERVICE_FIND_DOCUMENTLIST_CURRENT_AGENT_V3, ['clients']);				 
		 self.ajax.getRuntime(resourceURL, url, function(data){
			 deferred.resolve(data);						
		 });
		 return  deferred.promise;
	 };
	 
	 ClientCoreService.prototype.loadClientDetail = function(resourceURL,clientNum){
		 var self = this;
		 var deferred = self.$q.defer();
		 var url = self.commonService.getUrl(self.commonService.urlMap.CLIENT_DETAIL_V3, [clientNum]);		 
		 self.ajax.getRuntime(resourceURL, url, function(data){
			 self.client = data;
			 self.originalDetail = angular.copy(self.client);
			 self.detail = data;
			 deferred.resolve(data);						
		 });
		 return  deferred.promise;
	 };
	 
	 ClientCoreService.prototype.computeClientDetail = function(resourceURL, dataSet){
		 var self = this;
		 var deferred = self.$q.defer();
		 var url = self.commonService.getUrl(self.commonService.urlMap.DOCUMENT_COMPUTE_V3, [self.name]);	 		 
		 self.ajax.postRuntime(resourceURL, url, dataSet, function(result){
			 self.client = result;
			 self.originalDetail = angular.copy(self.client);
			 deferred.resolve(result);
			});
		 return  deferred.promise;
	 };
	 
	 ClientCoreService.prototype.reset_V3 = function() {
	     var self = this;
	     self.client = angular.copy(self.originalDetail);
	 };
	 
	 ClientCoreService.prototype.saveClientDetail_V3 = function(resourceURL,data){
		 var self = this;
		 var deferred = self.$q.defer();
		 var url = "/service/submitClientDetail";		 
		 self.ajax.postRuntime(resourceURL, url, data, function(result){
			 self.client = data;
			 self.detail = result;
			 self.originalDetail = data;
			 deferred.resolve(result);						
		 });
		 return  deferred.promise;
	 };
	 
	 ClientCoreService.prototype.loadDocumentList = function(resourceURL,query){
			var self = this;
			var deferred = $q.defer();
			var url = self.commonService.getUrl(self.commonService.urlMap.DOCUMENT_SEARCH_ALL_V3, []);
			 self.ajax.postRuntime(resourceURL, url, query, function(data){
				 deferred.resolve(data);						
			 });
			return  deferred.promise;
		};
	ClientCoreService.prototype.findValueInMapListByKeyJSON = function(data, key, json){
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
	
	/**
	 * For new my workspace
	 */
	ClientCoreService.prototype.getDocumentList_V3 = function(resourceURL,clientId){
		 var self = this;
		 var deferred = self.$q.defer();
		 var url = self.commonService.getUrl(self.commonService.urlMap.SERVICE_FIND_DOCUMENTLIST_CURRENT_AGENT_V3, ['clients']);
		 self.ajax.getRuntime(resourceURL, url, function(data){
			 // mock json test
			 //data = {"ClientList":{"Total":"","Client":[{"Client_ID":"50000006","First_Name":"modified","Address_Line_2":"Vijay Nagar Indore","Address_Line_1":"","Birth_Date":"99999999","Gender":"","Security_Number":"","Status":"Active","Surname":"Ayush Corp","Client_Type":"C","Email_Address":"","Mobile":"","Total_Premium":"5669.28"},{"Client_ID":"50000025","First_Name":"Rick","Address_Line_2":"","Address_Line_1":"","Birth_Date":"99999999","Gender":"M","Security_Number":"","Status":"Active","Surname":"Grainger","Client_Type":"P","Email_Address":"","Mobile":"","Total_Premium":""},{"Client_ID":"50000041","First_Name":"Liam","Address_Line_2":"","Address_Line_1":"","Birth_Date":"99999999","Gender":"M","Security_Number":"","Status":"Active","Surname":"Billington","Client_Type":"P","Email_Address":"","Mobile":"","Total_Premium":""},{"Client_ID":"50000193","First_Name":"Van A","Address_Line_2":"","Address_Line_1":"","Birth_Date":"19810210","Gender":"M","Security_Number":"2222","Status":"Active","Surname":"Nguyen","Client_Type":"P","Email_Address":"","Mobile":"","Total_Premium":"1889.46"},{"Client_ID":"50000192","First_Name":"Pham","Address_Line_2":"123 456 ABC","Address_Line_1":"","Birth_Date":"19920101","Gender":"M","Security_Number":"S6617508A","Status":"Active","Surname":"Thanh","Client_Type":"P","Email_Address":"","Mobile":"","Total_Premium":"23896.78"},{"Client_ID":"50000004","First_Name":"Rokey","Address_Line_2":"","Address_Line_1":"","Birth_Date":"19890101","Gender":"M","Security_Number":"","Status":"Active","Surname":"Stanley","Client_Type":"P","Email_Address":"","Mobile":"","Total_Premium":""},{"Client_ID":"50000151","First_Name":"Nguyen","Address_Line_2":"Street 1","Address_Line_1":"","Birth_Date":"19791127","Gender":"M","Security_Number":"","Status":"Active","Surname":"Natalie","Client_Type":"P","Email_Address":"","Mobile":"","Total_Premium":"136734.53"},{"Client_ID":"50000195","First_Name":"Dam","Address_Line_2":"22","Address_Line_1":"","Birth_Date":"19810202","Gender":"M","Security_Number":"","Status":"Active","Surname":"Tester","Client_Type":"P","Email_Address":"","Mobile":"","Total_Premium":"1489.46"},{"Client_ID":"50000001","First_Name":"HARRY","Address_Line_2":"","Address_Line_1":"","Birth_Date":"99999999","Gender":"M","Security_Number":"","Status":"Active","Surname":"JONES","Client_Type":"P","Email_Address":"","Mobile":"","Total_Premium":"14178.56"},{"Client_ID":"50000019","First_Name":"TEST RETAINED","Address_Line_2":"TEST","Address_Line_1":"","Birth_Date":"99999999","Gender":"","Security_Number":"","Status":"Active","Surname":"J.K. Industries","Client_Type":"C","Email_Address":"","Mobile":"","Total_Premium":"6475.88"},{"Client_ID":"50000290","First_Name":"Portal","Address_Line_2":"123","Address_Line_1":"","Birth_Date":"19800601","Gender":"M","Security_Number":"443524","Status":"Active","Surname":"Agent","Client_Type":"P","Email_Address":"","Mobile":"","Total_Premium":"1934.38"},{"Client_ID":"50000021","First_Name":"","Address_Line_2":"TEST","Address_Line_1":"","Birth_Date":"99999999","Gender":"","Security_Number":"","Status":"Active","Surname":"Chedda Corporation Pvt. Ltd.","Client_Type":"C","Email_Address":"","Mobile":"","Total_Premium":"202825.08"},{"Client_ID":"50000003","First_Name":"BANG","Address_Line_2":"","Address_Line_1":"","Birth_Date":"19850815","Gender":"M","Security_Number":"","Status":"Active","Surname":"BIG","Client_Type":"P","Email_Address":"","Mobile":"","Total_Premium":""},{"Client_ID":"50000196","First_Name":"Quang","Address_Line_2":"11","Address_Line_1":"","Birth_Date":"19800522","Gender":"M","Security_Number":"","Status":"Active","Surname":"Le","Client_Type":"P","Email_Address":"","Mobile":"","Total_Premium":"3479.76"}]}};
			 self.items = data;
			 deferred.resolve(data);						
		 });
		 return  deferred.promise;
	 };
	return new ClientCoreService($q, ajax, $location, appService, cacheService, detailCoreService, commonService);
}]);
