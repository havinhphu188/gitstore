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

var underwritingUIModule = angular.module('underwritingUIModule',['underwritingModule', 'commonUIModule'])
.service('underwritingUIService', ['$q', 'ajax', '$location', 'appService', 'cacheService', 'commonUIService', 'underwritingCoreService', 'commonService', 'connectService',
    function($q, ajax, $location, appService, cacheService, commonUIService, underwritingCoreService, commonService, connectService){

	function UnderwritingUIService($q, ajax, $location, appService, cacheService, underwritingCoreService, commonService){
		var self = this;
		underwritingCoreService.constructor.call(self, $q, ajax, $location, appService, cacheService, underwritingCoreService.detailCoreService, commonService);
		this.lazyChoiceListByProduct = [];
	};
	inherit(underwritingCoreService.constructor, UnderwritingUIService);
	extend(commonUIService.constructor, UnderwritingUIService);
	
	UnderwritingUIService.prototype.getUnderwritingLazyList = function (resourceURL, productName){
		var self = this;
		var deferred = $q.defer();
//		if (self.lazyChoicelist == undefined){
//			self.lazyChoicelist = [];
//		};
//		if(self.lazyChoiceList[productName] == undefined) {	
//			if(productName == 'motor-private-car-m-as'){
//				self.getLazyChoiceListByModuleAndProduct_V3(resourceURL, productName).then(function(data) {
//					self.translateNodes(productName,data);
//					self.lazyChoiceList[productName] = data;				
//					deferred.resolve(data);
//				});
//			} else if (productName == 'GTL1'){
//				self.name = 'underwriting2';
//				self.getLazyChoiceListByModuleAndProduct_V3(resourceURL, productName).then(function(data) {
//					self.name = 'underwriting';
//					self.translateNodes(productName,data);
//					self.lazyChoiceList[productName] = data;				
//					deferred.resolve(data);
//				});
//			} else if(productName == 'FIR' || productName == commonService.CONSTANTS.PRODUCT.GUARANTEED_CASHBACK || productName == 'term-life-secure'){
//				var data = {
//						  "LazyRestriction": ""
//				};
//				self.translateNodes(productName,data);
//				self.lazyChoiceList[productName] = data;				
//				deferred.resolve(data);
//			} else if(productName == commonService.CONSTANTS.PRODUCT.TRAVEL_EXPRESS) {
//				self.getLazyChoiceListByModuleAndProduct_V3(resourceURL, productName).then(function(data) {
//					self.translateNodes(productName,data);
//					self.lazyChoiceList[productName] = data;				
//					deferred.resolve(data);
//				});
//			}
//		}
		var productGroup = self.getProductGroup_V3(productName);
		switch (productGroup) {
		case commonService.CONSTANTS.PRODUCT_GROUP.MOTOR:
		case commonService.CONSTANTS.PRODUCT_GROUP.TRAVEL:
			self.getLazyChoiceListByModuleAndProduct_V3(resourceURL, productName).then(function(data) {
				self.lazyChoiceListByProduct[productName] = data;
				deferred.resolve(data);
			});
			break;
		case commonService.CONSTANTS.PRODUCT_GROUP.GROUP_TERM_LIFE:
			self.name = 'underwriting2';
			self.getLazyChoiceListByModuleAndProduct_V3(resourceURL, productName).then(function(data) {
				self.name = 'underwriting';
				self.lazyChoiceListByProduct[productName] = data;
				deferred.resolve(data);
			});
			break;
		case commonService.CONSTANTS.PRODUCT_GROUP.UNIT_LINK:
		case commonService.CONSTANTS.PRODUCT_GROUP.ENDOWMENT:
			self.name = 'underwriting2';
			self.getLazyChoiceListByModuleAndProduct_V3(resourceURL).then(function(data) {
				self.name = 'underwriting';
				self.lazyChoiceListByProduct[productName] = data;
				deferred.resolve(data);
			});
			break;
		default:
			var data = {"LazyRestriction":""};
			self.lazyChoiceListByProduct[productName] = data;
			deferred.resolve(data);
			break;
		}
		
		return deferred.promise;
    };
    
//    UnderwritingUIService.prototype.translateNodes=function(productName, data){
//	   	var self = this;
//    	if (productName == 'motor-private-car-m-as'|| productName == 'motor-private-car-m-ds'){
//    		self.translateLazyListField(data,'IsPickup', 'v3.pnc.underwriting.isPickup.enum.');
//    		self.translateLazyListField(data,'UnderwritingDecisionCd', 'v3.pnc.underwriter.decision.enum.');
//    		self.translateLazyListField(data,'CustomerDecision', 'v3.pnc.customer.decision.enum.');
//    	}
//    };
	
	UnderwritingUIService.prototype.getUnderwritingPickupableList = function(resourceURL, productName) {
		var self = this;
		var deferred = self.$q.defer();
		underwritingCoreService.getUnderwritingPickupableList.call(self, resourceURL, productName).then(function(result) {
			deferred.resolve(result);
		});
		return deferred.promise;
	};
	
	UnderwritingUIService.prototype.getExpiredUnderwritingList = function(resourceURL) {
		var self = this;
		var deferred = self.$q.defer();
//		var data = {"MetadataDocuments":{"MetadataDocument":[{"TotalPayablePremium":"2,000,000.00","StampDuty":"","EffectiveDate":"2016-07-11","POName":"","Archived":"","TotalPremium":"","DocType":"underwriting2","DocVersion":"","DocumentStatus":"","OwnerUid":"agentrul@ipos.com","BusinessStatus":"WIP","UnderwritingDecisionCd":"","Currency":"IDR","DocName":"underwriting2-DefaultName","Result":"NOT DECIDED","Product":"regular-unit-link","DocId":"97155dfd-bf1e-4d32-842c-65ce40326214","UnderwritingRuleCd":"APAI;HQS1:Q5d:Q5f:Q5g:Q5h:Q6a:Q6b:Q6d:Q6e:;","UnderwriterId":"underwriterrul@ipos.com","CaseName":"BC66603872","Tags":"","UpdatedDate":"2016-07-11 11-40-33","Star":"","CreatedDate":"2016-07-11 11-40-33","SumInsured":"20,000,000.00","UpdatedUserUid":""},{"TotalPayablePremium":"2,000,000.00","StampDuty":"","EffectiveDate":"2016-07-13","POName":"","Archived":"","TotalPremium":"","DocType":"underwriting2","DocVersion":"","DocumentStatus":"","OwnerUid":"agentrul@ipos.com","BusinessStatus":"WIP","UnderwritingDecisionCd":"","Currency":"IDR","DocName":"underwriting2-DefaultName","Result":"NOT DECIDED","Product":"regular-unit-link","DocId":"763b0c40-fabc-4e49-921c-6db72d7e43e2","UnderwritingRuleCd":"APAI;GQS2:Q5:;GQS3;","UnderwriterId":"underwriterrul@ipos.com","CaseName":"BC08924570","Tags":"","UpdatedDate":"2016-07-13 16-21-07","Star":"","CreatedDate":"2016-07-13 16-21-07","SumInsured":"20,000,000.00","UpdatedUserUid":""},{"TotalPayablePremium":"2,000,000.00","StampDuty":"","EffectiveDate":"2016-07-14","POName":"","Archived":"","TotalPremium":"","DocType":"underwriting2","DocVersion":"","DocumentStatus":"","OwnerUid":"agentrul@ipos.com","BusinessStatus":"WIP","UnderwritingDecisionCd":"","Currency":"IDR","DocName":"underwriting2-DefaultName","Result":"NOT DECIDED","Product":"regular-unit-link","DocId":"c29bd601-43d2-482c-9b38-e395c065d3d2","UnderwritingRuleCd":"MSG-UR09;MSG-UR10;","UnderwriterId":"underwriterrul@ipos.com","CaseName":"BC93668363","Tags":"","UpdatedDate":"2016-07-14 16-12-31","Star":"","CreatedDate":"2016-07-14 16-12-31","SumInsured":"20,000,000.00","UpdatedUserUid":""},{"TotalPayablePremium":"2,000,000.00","StampDuty":"","EffectiveDate":"2016-07-14","POName":"","Archived":"","TotalPremium":"","DocType":"underwriting2","DocVersion":"","DocumentStatus":"","OwnerUid":"agentrul@ipos.com","BusinessStatus":"WIP","UnderwritingDecisionCd":"","Currency":"IDR","DocName":"underwriting2-DefaultName","Result":"NOT DECIDED","Product":"regular-unit-link","DocId":"35026834-5eac-45b9-9a7c-185cb5d8937b","UnderwritingRuleCd":"MSG-UR32;","UnderwriterId":"underwriterrul@ipos.com","CaseName":"BC10081802","Tags":"","UpdatedDate":"2016-07-14 16-19-20","Star":"","CreatedDate":"2016-07-14 16-19-20","SumInsured":"20,000,000.00","UpdatedUserUid":""},{"TotalPayablePremium":"2,000,000.00","StampDuty":"","EffectiveDate":"2016-07-14","POName":"","Archived":"","TotalPremium":"","DocType":"underwriting2","DocVersion":"","DocumentStatus":"","OwnerUid":"agentrul@ipos.com","BusinessStatus":"WIP","UnderwritingDecisionCd":"","Currency":"IDR","DocName":"underwriting2-DefaultName","Result":"NOT DECIDED","Product":"regular-unit-link","DocId":"7e642a8a-91cd-49f7-a890-f076bea89901","UnderwritingRuleCd":"MSG-UR09;MSG-UR32;","UnderwriterId":"underwriterrul@ipos.com","CaseName":"BC24926816","Tags":"","UpdatedDate":"2016-07-14 18-14-20","Star":"","CreatedDate":"2016-07-14 18-14-20","SumInsured":"20,000,000.00","UpdatedUserUid":""},{"TotalPayablePremium":"2,000,000.00","StampDuty":"","EffectiveDate":"2016-07-14","POName":"","Archived":"","TotalPremium":"","DocType":"underwriting2","DocVersion":"","DocumentStatus":"","OwnerUid":"agentrul@ipos.com","BusinessStatus":"WIP","UnderwritingDecisionCd":"","Currency":"IDR","DocName":"underwriting2-DefaultName","Result":"NOT DECIDED","Product":"regular-unit-link","DocId":"15c71d49-7dbf-43c9-a5ad-3eb8ab7825ce","UnderwritingRuleCd":"MSG-UR09;MSG-UR32;","UnderwriterId":"underwriterrul@ipos.com","CaseName":"BC24926816","Tags":"","UpdatedDate":"2016-07-14 18-18-24","Star":"","CreatedDate":"2016-07-14 18-18-24","SumInsured":"20,000,000.00","UpdatedUserUid":""}]}};
//		deferred.resolve(data);
		underwritingCoreService.getExpiredUnderwritingList.call(self, resourceURL).then(function(result) {
			deferred.resolve(result);
		});
		return deferred.promise;
	};
	
	
	UnderwritingUIService.prototype.attachUWDocument = function attachUWDocument (resourceURL, caseId, letterId) {
		var self = this;
		var deferred = self.$q.defer();
		connectService.exeAction({
	    	actionName: "ATTACH_UW_LETTER_FORM",
	    	actionParams: [caseId, letterId],
	    	data: " ",
	    	resourceURL: resourceURL
	    }).then(function(data){
			deferred.resolve(data);
	    });
		return deferred.promise;
	};

	UnderwritingUIService.prototype.doUnderwriting = function(resourceURL, dataSet, docId, action, productName) {
		var self = this;
		var deferred = self.$q.defer();
		underwritingCoreService.doUnderwriting.call(self, resourceURL, dataSet, docId, action, productName).then(function(result) {
			deferred.resolve(result);
		});
		return deferred.promise;
	};
	
	return new UnderwritingUIService($q, ajax, $location, appService, cacheService, underwritingCoreService, commonService);
}]);