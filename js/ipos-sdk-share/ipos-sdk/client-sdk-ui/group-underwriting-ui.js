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
/*ldang4*/
var gtlLevelUWUIModule = angular.module('gtlLevelUWUIModule',['gtlLevelUWModule', 'commonUIModule'])
.service('gtlLevelUWUIService', ['$q', 'ajax', '$location', 'appService', 'cacheService', 'commonUIService', 'gtlLevelUWCoreService', 'commonService',
	function($q, ajax, $location, appService, cacheService, commonUIService, gtlLevelUWCoreService, commonService){

	function gtlLevelUWUIService($q, ajax, $location, appService, cacheService, gtlLevelUWCoreService, commonService){
		var self = this;
		gtlLevelUWCoreService.constructor.call(self, $q, ajax, $location, appService, cacheService, gtlLevelUWCoreService.detailCoreService, commonService);
		this.claimList = [];
	};
	inherit(gtlLevelUWCoreService.constructor, gtlLevelUWUIService);
	extend(commonUIService.constructor, gtlLevelUWUIService);	
	GtlUnderwritingUIService.prototype.getGtlUnderwritingLazyList=  function (resourceURL, productName){
		var self = this;
		var deferred = $q.defer();
		if (self.lazyChoicelist == undefined){
			self.lazyChoicelist = [];
		};
		if(self.lazyChoiceList[productName] == undefined) {				
				self.translateNodes(productName,data);
				self.lazyChoiceList[productName] = data;				
				deferred.resolve(data);		
			
		}
		return deferred.promise;
    };
    
    GtlUnderwritingUIService.prototype.isUWView = function(){
    	if (productName == 'motor-private-car-m-as'|| productName == 'motor-private-car-m-ds'){
		return false;
    	}
    	else{
    		return true;
    	}
	};
    
	GtlUnderwritingUIService.prototype.translateNodes=function(productName, data){
	   	var self = this;
    	if (productName == 'motor-private-car-m-as'|| productName == 'motor-private-car-m-ds'){
    		self.translateLazyListField(data,'IsPickup', 'v3.pnc.underwriting.isPickup.enum.');
    		self.translateLazyListField(data,'UnderwritingDecisionCd', 'v3.pnc.underwriter.decision.enum.');
    		self.translateLazyListField(data,'CustomerDecision', 'v3.pnc.customer.decision.enum.');
    	}
    };	
   
	GtlUnderwritingUIService.prototype.doGtlUnderwriting = function(resourceURL, dataSet, docId, action, productName) {
		var self = this;
		var deferred = self.$q.defer();
		gtlLevelUWCoreService.doGtlUnderwriting.call(self, resourceURL, dataSet, docId, action, productName).then(function(result) {
			deferred.resolve(result);
		});
		return deferred.promise;
	};
	
	return new gtlLevelUWUIService($q, ajax, $location, appService, cacheService, gtlLevelUWCoreService, commonService);
}]);