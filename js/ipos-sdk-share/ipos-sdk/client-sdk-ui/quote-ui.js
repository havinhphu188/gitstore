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

var quoteUIModule = angular.module('quoteUIModule',['quoteModule', 'commonUIModule'])
.service('quoteUIService', ['$q', 'ajax', '$location', 'appService', 'cacheService', 'commonUIService', 'quoteCoreService', 'commonService', 'pingService',
    function($q, ajax, $location, appService, cacheService, commonUIService, quoteCoreService, commonService, pingService){

	function QuoteUIService($q, ajax, $location, appService, cacheService, quoteCoreService, commonService){
		quoteCoreService.constructor.call(this, $q, ajax, $location, appService, cacheService, quoteCoreService.detailCoreService, commonService);
		this.name = 'illustration';
		
	};
	inherit(quoteCoreService.constructor, QuoteUIService);
	extend(commonUIService.constructor, QuoteUIService);
	
	
	QuoteUIService.prototype.printPdf = function() {
		var self= this;
		var url = self.commonService.getUrl(self.commonService.urlMap.ILLUSTRATION_GENERATE, [self.name]);
		var dataSet = self.extractUiDataSet(self.detail);
		self.ajax.post(url, dataSet).success(function(resultDto){
			//deferred.resolve(resultDto);
			
			//var fileName = self.detail.name;

			var pdfUrl = self.name + "/generatepdf/default";

			var height = $(window).height();
			var width = $(window).width();
			commonService.showWindow(pdfUrl, false, true, false, false, false, false, false, true, true, width, height, 0, 0);	
			
		});
	};
	
	QuoteUIService.prototype.initializeLifeObject_V3 = function(resourceURL,uId, boValidate){
		 var self = this; 

		 var deferred = self.$q.defer();
		 this.initNewQuotationDetail_V3.call(self,resourceURL, "term-life-protect", function(data){
			 //do somthing else when override
			 deferred.resolve(data);
		 });
		 return  deferred.promise;
	 };
	 
	QuoteUIService.prototype.initializeMotorObject_V3 = function(resourceURL,uId, boValidate){
		 var self = this;
		 var deferred = self.$q.defer();
		 this.initNewQuotationDetail_V3.call(self,resourceURL, "motor-insurance", function(data){
			 //do somthing else when override
			 deferred.resolve(data);
		 });
		 return  deferred.promise;
	 };
	
	QuoteUIService.prototype.bindValueFromLifeAssureToPolicyOwner = function() {
		var self= this;
		self.copyElementsValues(self.detail,[['lifeAssured','title']],self.detail,[['policyOwner','title']]);
		self.copyElementsValues(self.detail,[['lifeAssured','fullname']],self.detail,[['policyOwner','fullname']]);
		self.copyElementsValues(self.detail,[['lifeAssured','birthDate']],self.detail,[['policyOwner','birthDate']]);
		self.copyElementsValues(self.detail,[['lifeAssured','gender']],self.detail,[['policyOwner','gender']]);
		self.copyElementsValues(self.detail,[['lifeAssured','smoker']],self.detail,[['policyOwner','smoker']]);
		self.copyElementsValues(self.detail,[['lifeAssured','maritalStatus']],self.detail,[['policyOwner','maritalStatus']]);
		/*self.copyElementsValues(self.detail,[['lifeAssured','weight']],self.detail,[['policyOwner','weight']]);
		self.copyElementsValues(self.detail,[['lifeAssured','height']],self.detail,[['policyOwner','height']]);
		self.copyElementsValues(self.detail,[['lifeAssured','nationality']],self.detail,[['policyOwner','nationality']]);
		self.copyElementsValues(self.detail,[['lifeAssured','industry']],self.detail,[['policyOwner','industry']]);
		self.copyElementsValues(self.detail,[['lifeAssured','occupation']],self.detail,[['policyOwner','occupation']]);
		
		var contactListLifeAssured = self.findElementInDetail(['lifeAssured','contacts']).elements;
		var contactListPolicyOwner = self.findElementInDetail(['policyOwner','contacts']).elements;	
		if(contactListLifeAssured.length === contactListPolicyOwner.length) {
			for(var i = 0; i < contactListLifeAssured.length; i++) {
				self.copyElementsValues(contactListLifeAssured[i],[['type']],contactListPolicyOwner[i],[['type']]);
				self.copyElementsValues(contactListLifeAssured[i],[['value']],contactListPolicyOwner[i],[['value']]);
				self.copyElementsValues(contactListLifeAssured[i],[['prefer']],contactListPolicyOwner[i],[['prefer']]);
			}
		}

		var addressListLifeAssured = self.findElementInDetail(['lifeAssured','addresses']).elements;
		var addressListPolicyOwner = self.findElementInDetail(['policyOwner','addresses']).elements;
		if(addressListLifeAssured.length === addressListPolicyOwner.length) {
			for(var i = 0; i < addressListLifeAssured.length; i++) {
				self.copyElementsValues(addressListLifeAssured[i],[['type']],addressListPolicyOwner[i],[['type']]);
				self.copyElementsValues(addressListLifeAssured[i],[['street']],addressListPolicyOwner[i],[['street']]);
				self.copyElementsValues(addressListLifeAssured[i],[['city']],addressListPolicyOwner[i],[['city']]);
				self.copyElementsValues(addressListLifeAssured[i],[['country']],addressListPolicyOwner[i],[['country']]);
				self.copyElementsValues(addressListLifeAssured[i],[['postal']],addressListPolicyOwner[i],[['postal']]);
				self.copyElementsValues(addressListLifeAssured[i],[['prefer']],addressListPolicyOwner[i],[['prefer']]);
			}
		}*/
		
	};
	
	return new QuoteUIService($q, ajax, $location, appService, cacheService, quoteCoreService, commonService);
}]);