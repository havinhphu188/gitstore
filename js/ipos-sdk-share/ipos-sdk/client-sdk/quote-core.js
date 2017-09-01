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
var quoteModule = angular.module('quoteModule',['coreModule'])
.service('quoteCoreService', ['$q', 'ajax', '$location', 'appService', 'cacheService', 'detailCoreService', 'commonService',
	function($q, ajax, $location, appService, cacheService, detailCoreService, commonService){
	
	function QuoteCoreService($q, ajax, $location, appService, cacheService, detailCoreService, commonService){
		var self = this;
		this.detailCoreService = detailCoreService;
		detailCoreService.ListDetailCoreService.call(self, $q, ajax, $location, appService, cacheService, commonService);
	//	this.name = commonService.CONSTANTS.MODULE_NAME.HOME;
	//	self.init();
	};
	inherit(detailCoreService.ListDetailCoreService, QuoteCoreService);
	 	
	
	
	QuoteCoreService.prototype.computeIllustrationDefault = function(tags){
		var self = this;
		var deferred = self.$q.defer();
		//Note: 'productInputs' is an element of self.detail
		var dataSet = self.extractUiDataSet(self.detail);
		var url = self.commonService.getUrl(self.commonService.urlMap.ILLUSTRATION_COMPUTE_DEFAULT_TAGS, tags);
		self.ajax.post(url, dataSet).success(function(dtoResult){//data = illustration
			self.mergeElement(dtoResult, self.detail);
			deferred.resolve(dtoResult);
		});
		return  deferred.promise;
	};
	
	QuoteCoreService.prototype.computeIllustration = function(tags){
		var self = this;
		var deferred = self.$q.defer();
		//Note: 'productInputs' is an element of self.detail
		var dataSet = self.extractUiDataSet(self.detail);
		var url = self.commonService.getUrl(self.commonService.urlMap.ILLUSTRATION_COMPUTE_TAGS, tags);
		self.ajax.post(url, dataSet).success(function(dtoResult){//data = illustration
			self.mergeElement(dtoResult, self.detail);
			deferred.resolve(dtoResult);
		});
		return  deferred.promise;
	};
	
	QuoteCoreService.prototype.computeIllustrationFromUIDataSet = function(tags){
		var self = this;
		var deferred = self.$q.defer();
		//Note: 'productInputs' is an element of self.detail
		var dataSet = self.extractUiDataSet(self.uiDataSet);
		var url = self.commonService.getUrl(self.commonService.urlMap.ILLUSTRATION_COMPUTE_TAGS, tags);
		self.ajax.post(url, dataSet).success(function(dtoResult){//data = illustration
			self.mergeElement(dtoResult, self.detail);
			deferred.resolve(dtoResult);
		});
		return  deferred.promise;
	};

	QuoteCoreService.prototype.initNewQuotationDetail_V3 = function(resourceURL, uId, fnSuccess) {
		 var self = this;
		 var dataUrl = undefined;
		 self.bolFinishLoading = false;
		 dataUrl = commonService.getUrl(commonService.urlMap.MODULE_CREATE, [self.name,uId]);
		 
		 self.ajax.getRuntime(resourceURL, dataUrl, function(data){
			 self.updateDetailData(data);
			 self.applyPreDefineData();
			 self.useCurrentDetailDataAsOriginal();
			 self.bolFinishLoading = true;
			 if(commonService.hasValue(fnSuccess)) fnSuccess.call(self, data);
			 						
		 });
	
		
		/* self.ajax.get_V3(dataUrl).success(function(data) {
			 self.updateDetailData(data);
			 self.applyPreDefineData();//TODO This logic only involved on UI 
			 self.useCurrentDetailDataAsOriginal();
			 self.bolFinishLoading = true;
			 if(commonService.hasValue(fnSuccess)) fnSuccess.call(self, data);
		 });*/
	 };
	return new QuoteCoreService($q, ajax, $location, appService, cacheService, detailCoreService, commonService);
}]);