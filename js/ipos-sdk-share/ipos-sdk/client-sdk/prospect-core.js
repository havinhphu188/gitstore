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
var prospectModule = angular.module('prospectModule',['coreModule'])
.service('prospectCoreService',  ['$q', 'ajax', '$location', 'appService', 'cacheService', 'detailCoreService', 'commonService', 
                         function($q, ajax, $location, appService, cacheService, detailCoreService, commonService){
	
	function ProspectCoreService($q, ajax, $location, appService, cacheService, detailCoreService, commonService){
		var self = this;
		this.detailCoreService = detailCoreService;
		detailCoreService.ListDetailCoreService.call(self, $q, ajax, $location, appService, cacheService, commonService);
		this.name = commonService.CONSTANTS.MODULE_NAME.PROSPECT;
		this.pdpa = undefined;
	//	self.init();
	};
	inherit(detailCoreService.ListDetailCoreService, ProspectCoreService);

	//----------------------v3.0 ----------------------
	// ProspectCoreService.prototype.loadIllustrationHistory = function(prospectId, uiNonBlock){
	// 	var self = this;
	// 	var deferred = $q.defer();
	// 	var url = commonService.getUrl(commonService.urlMap.ILLUSTRATION_LIST_PERSON, [prospectId] );
	// 	self.ajax.get(url, uiNonBlock).success(function(data){
	// 		self.extraDetail.illustrationHistory = data;
	// 		deferred.resolve(data);
	// 	});
	// 	return  deferred.promise;
	// };
	
	// ProspectCoreService.prototype.loadFactFindHistory = function(prospectId, uiNonBlock){
	// 	var self = this;
	// 	var deferred = $q.defer();
	// 	var url = commonService.getUrl(commonService.urlMap.FACTFIND_LIST_PERSON, [prospectId] );
	// 	self.ajax.get(url, uiNonBlock).success(function(data){
	// 		self.extraDetail.factFindHistory = data;
	// 		deferred.resolve(data);
	// 	});
	// 	return  deferred.promise;
	// };
	
	// ProspectCoreService.prototype.loadPaymentHistory = function(prospectId, uiNonBlock){
	// 	var self = this;
	// 	var deferred = $q.defer();
	// 	var url = commonService.getUrl(commonService.urlMap.PAYMENT_LIST_PERSON, [prospectId] );
	// 	self.ajax.get(url, uiNonBlock).success(function(data){
	// 		self.extraDetail.factFindHistory = data;
	// 		deferred.resolve(data);
	// 	});
	// 	return  deferred.promise;
	// };
	
	// ProspectCoreService.prototype.loadApplicationHistory = function(prospectId, uiNonBlock){
	// 	var self = this;
	// 	var deferred = $q.defer();
	// 	var url = commonService.getUrl(commonService.urlMap.APPLICATION_LIST_PERSON, [prospectId] );
	// 	self.ajax.get(url, uiNonBlock).success(function(data){
	// 		self.extraDetail.factFindHistory = data;
	// 		deferred.resolve(data);
	// 	});
	// 	return  deferred.promise;
	// };
	
	// ProspectCoreService.prototype.updatePdpaRefType = function(newPdpaUid){
	// 	var self = this;
	// 	var deferred = self.$q.defer();
	// 	if (!commonService.hasValueNotEmpty(newPdpaUid)) deferred.reject();
	// 	var url = commonService.getUrl(commonService.urlMap.DOCUMENT_UPDATE_REFERENCE_BY_REFTYPE, [ self.name,
	// 					'pdpa', "null", newPdpaUid ]);
	// 	var dataSet = self.extractUiDataSet(self.detail);
	// 	self.ajax.post(url, dataSet).success(function(detailDto){
	// 		self.detail = detailDto;
	// 		deferred.resolve(detailDto);
	// 	});
	// 	return  deferred.promise;
	// };
	
	// ProspectCoreService.prototype.unlinkProspect = function(){
	// 	var self = this;
	// 	var deferred = self.$q.defer();
	// 	var url = self.commonService.getUrl(self.commonService.urlMap.CLIENT_PROSPECT_UNLINK, [self.detail.uid]);
	// 	self.ajax.get(url).success(function(result){
	// 		deferred.resolve(result);
	// 	});
	// 	return  deferred.promise;
	// };
	
	// ProspectCoreService.prototype.updatelinkProspect = function(clientId){
	// 	var self = this;
	// 	var deferred = self.$q.defer();
	// 	var url = self.commonService.getUrl(self.commonService.urlMap.CLIENT_PROSPECT_UPDATELINK, [self.detail.uid,clientId]);
	// 	self.ajax.get(url).success(function(result){
	// 		deferred.resolve(result);
	// 	});
	// 	return  deferred.promise;
	// };
	
	// //require lazy choise list loaded
	// ProspectCoreService.prototype.lookUpIndustryAfterLinkedToClient = function(){
	// 	var self = this;
	// 	var industry = self.findPropertyInDetail(['industry'], 'value');
	// 	var occupation = self.findPropertyInDetail(['occupation'], 'value');
	// 	if (self.isLinkToClient() && !self.commonService.hasValueNotEmpty(industry.value)){
	// 		for (var i = 0; i < self.lazyChoicelist.occupation.length; i++){
	// 			var occ = self.lazyChoicelist.occupation[i];
	// 			if (occupation.value === occ.value){
	// 				industry.value = occ.group;
	// 				self.useCurrentDetailDataAsOriginal();
	// 				return;
	// 			}
	// 		}
	// 	}
	// };
	
	// //************************************ Link to Client ************************************
	// ProspectCoreService.prototype.isLinkToClient = function(){
	// 	var self = this;
	// 	return commonService.hasValueNotEmpty(self.findPropertyInDetail(['clientNum'],'value').value);
	// };
	
	// ProspectCoreService.prototype.signPDPA = function(runOnTablet, isSafari, pdpaUid) {
	// 	var self = this;
	// 	var deferred = self.$q.defer();
	// 	var prospectUid = self.detail.uid;
	// 	var resultURL = "/" + self.name + "/esignature/pdpa/result/" + prospectUid + "/" + pdpaUid;
	// 	var url = self.commonService.getUrl(self.commonService.urlMap.PROSPECT_SIGN_PDPA, [prospectUid, runOnTablet.toString(), isSafari.toString()]);
	// 	self.ajax.post(url, resultURL).success(function(result) {
	// 		deferred.resolve(result);
	// 	});
	// 	return deferred.promise;
	// };
	
	// ProspectCoreService.prototype.getHistoricalPDPAUid = function() {
	// 	var self = this;
	// 	if (self.detail == undefined) return "";
	// 	var historicalPdpaUid = self.findPropertyInDetail(['historicalPdpa', 'uid'], 'value');
	// 	return historicalPdpaUid.value;
	// };
	
	// ProspectCoreService.prototype.setHistoricalPDPAUid = function(newUid) {
	// 	var self = this;
	// 	if (self.detail != undefined){
	// 		var historicalPdpaUid = self.findPropertyInDetail(['historicalPdpa', 'uid'], 'value');
	// 		historicalPdpaUid.value = newUid;
	// 	}
	// };
	
	// ProspectCoreService.prototype.hasPDPA = function(){
	// 	var self = this;
	// 	if (self.detail == undefined) return true;
	// 	var historicalPdpaUid = self.findPropertyInDetail(['historicalPdpa', 'uid'], 'value');
	// 	var pdfStatus = self.findPropertyInDetail(['PDFStatus'], 'value');
	// 	return commonService.hasValueNotEmpty(historicalPdpaUid.value) && commonService.hasValueNotEmpty(pdfStatus.value);
	// };
	
	// ProspectCoreService.prototype.hasSignedPDPA = function(){
	// 	var self = this;
	// 	if (self.detail == undefined) return true;
	// 	var historicalPdpaUid = self.findPropertyInDetail(['historicalPdpa', 'uid'], 'value');
	// 	var pdfStatus = self.findPropertyInDetail(['PDFStatus'], 'value');
	// 	return commonService.hasValueNotEmpty(historicalPdpaUid.value) && commonService.hasValueNotEmpty(pdfStatus.value) && pdfStatus.value == commonService.CONSTANTS.SDWEB.STATUS.SIGNED ;
	// };
	// ProspectCoreService.prototype.loadDocumentList = function(resourceURL,query){
	// 	var self = this;
	// 	var deferred = $q.defer();
	// 	var url = self.commonService.urlMap.DOCUMENT_SEARCH_ALL_V3;

	// 	 self.ajax.getRuntime(resourceURL, url, function(data){
	// 		 deferred.resolve(data);						
	// 	 });
	// 	return  deferred.promise;
	// };
	
	// ProspectCoreService.prototype.getProspectList_V3 = function(resourceURL){
	// 	var self = this;
	// 	var deferred = $q.defer();
	
	// 	var url = commonService.getUrl(commonService.urlMap.MODULE_DOCUMENTLIST_V3, [self.name]);
		 	
	// 	 self.ajax.getRuntime(resourceURL, url, function(data){
	// 		 deferred.resolve(data);						
	// 	 });
	// 	return  deferred.promise;
	// };
	
	// /*ProspectCoreService.prototype.initializeObject_V3 = function(resourceURL) {
	// 	var self = this;
	// 	var deferred = $q.defer();
		
	// 	var url = commonService.getUrl(commonService.urlMap.DOCUMENT_ADD, [self.name]);
		
	// 	 self.ajax.getRuntime(resourceURL, url, function(data){
	// 		 self.detail = data;
	// 		 self.originalDetail = angular.copy(data);
	// 		 deferred.resolve(data);						
	// 	 });
	// 	return  deferred.promise;
	//  };*/
	 
	//  /*ProspectCoreService.prototype.findDocument_V3 = function(resourceURL,uid) {
	// 		var self = this;
	// 		var deferred = $q.defer();
			
	// 		var url = commonService.getUrl(commonService.urlMap.DOCUMENT_FIND_DOCUMENT_V3, [self.name, uid ]);
			
	// 		 self.ajax.getRuntime(resourceURL, url, function(data){
	// 			 self.detail = data;
	// 			 deferred.resolve(data);						
	// 		 });
	// 		return  deferred.promise;
	// 	 };
	// */
	// ----------------------v3.0 ----------------------

	
	return new ProspectCoreService($q, ajax, $location, appService, cacheService, detailCoreService, commonService);
}]);