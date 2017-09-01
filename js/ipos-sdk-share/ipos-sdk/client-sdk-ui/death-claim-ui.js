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
var deathClaimUIModule = angular.module('deathClaimUIModule',['deathClaimModule', 'commonUIModule'])
.service('deathClaimUIService', ['$q', 'ajax', '$location', 'appService', 'cacheService', 'commonUIService', 'deathClaimCoreService', 'commonService',
	function($q, ajax, $location, appService, cacheService, commonUIService, deathClaimCoreService, commonService){

	function deathClaimUIService($q, ajax, $location, appService, cacheService, deathClaimCoreService, commonService){
		var self = this;
		deathClaimCoreService.constructor.call(self, $q, ajax, $location, appService, cacheService, deathClaimCoreService.detailCoreService, commonService);
		this.claimList = [];
	};
	inherit(deathClaimCoreService.constructor, deathClaimUIService);
	extend(commonUIService.constructor, deathClaimUIService);	
	
	deathClaimUIService.prototype.getDeathClaimRegistrationReviewLazyList=  function (resourceURL, productName){
		var self = this;
		var deferred = $q.defer();
		if (self.lazyChoicelist == undefined){
			self.getModuleLazyChoicelist_V3(resourceURL, productName).then(function(data) {
				self.lazyChoiceList = data;				
				deferred.resolve(data);
			});  

		};
		
		return deferred.promise;
    };
    
  //get death claim registration  list for dash board portlety
    deathClaimUIService.prototype.getDeathClaimRegistrationPickableRequestList =  function (resourceURL){
    	var deferred = $q.defer();
		var self = this;
		var searchQuery = {"ipos-container:map-list":{"@xmlns:ipos-generic":"com.csc.gdn.ipos.model.jaxb.generic","@xmlns:ipos-system":"com.csc.gdn.ipos.model.jaxb.system","@xmlns:ipos-container":"com.csc.gdn.ipos.model.jaxb.container","@xmlns:ipos-dms":"com.csc.gdn.ipos.model.jaxb.dms","ipos-container:map-container":[{"@name":"0","ipos-container:pair":[{"@key":"DocType","@value":""},{"@key":"BusinessStatus","@value":""}]}]}};
				 var query = self.findElementInElement_V3(searchQuery, ['ipos-container:pair']);
				 for(var i = 0; i < query.length; i++){
					 if(query[i]['@key'] == "BusinessStatus"){
						 query[i]['@value'] = 'SUBMITTED';
					 }
					 if(query[i]['@key'] == "DocType"){
						 query[i]['@value'] = 'death-claim-registration';
					 }
				 }
		var dataSet = searchQuery;

		var actionUrl = commonService.getUrl(commonService.urlMap.METADATA_SEARCH, ["death-claim-registration"]); 
		self.ajax.postRuntime(resourceURL, actionUrl, dataSet, function(data){
			 deferred.resolve(data);	
		});
		return  deferred.promise;
    };
  //get manager pickup review list for dash board portlety
    deathClaimUIService.prototype.getDeathClaimRegistrationPickableReviewList =  function (resourceURL, claimId){
    	var deferred = $q.defer();
		var self = this;
		var searchQuery = {"ipos-container:map-list":{"@xmlns:ipos-generic":"com.csc.gdn.ipos.model.jaxb.generic","@xmlns:ipos-system":"com.csc.gdn.ipos.model.jaxb.system","@xmlns:ipos-container":"com.csc.gdn.ipos.model.jaxb.container","@xmlns:ipos-dms":"com.csc.gdn.ipos.model.jaxb.dms","ipos-container:map-container":[{"@name":"0","ipos-container:pair":[{"@key":"claimId","@value":""},{"@key":"DocType","@value":""},{"@key":"BusinessStatus","@value":""}]}]}};
		 var query = self.findElementInElement_V3(searchQuery, ['ipos-container:pair']);
		 for(var i = 0; i < query.length; i++){
			 if(query[i]['@key'] == "claimId"){				 					
				 query[i]['@value'] = claimId;
			 }
			 if(query[i]['@key'] == "DocType"){
				 query[i]['@value'] = 'death-claim-registration';
			 }
			 if(query[i]['@key'] == "BusinessStatus"){
				 query[i]['@value'] = 'PICKED UP';
			 }
			 
		 }
		 var dataSet = searchQuery;
		var actionUrl = commonService.getUrl(commonService.urlMap.METADATA_SEARCH, ["death-claim-registration"]); 
		self.ajax.postRuntime(resourceURL, actionUrl, dataSet, function(data){
			 deferred.resolve(data);	
		});
		return  deferred.promise;
    };
    
  //pickup death claim registration 
    deathClaimUIService.prototype.pickupDeathClaimRegistration =  function (resourceURL,dataSet, action, docId, product){
    	var deferred = $q.defer();
		var self = this;
		
		if(action == "pickup"){
			var actionUrl = commonService.getUrl(commonService.urlMap.PICKUP_DEATH_CLAIM_REGISTRATION, ["death-claim-registration", docId , product]); 
		}else if(action == "return"){
			var actionUrl = commonService.getUrl(commonService.urlMap.RETURN_PICKUP_DEATH_CLAIM_REGISTRATION, ["death-claim-registration", docId , product]); 
		}
		
		self.ajax.postRuntime(resourceURL, actionUrl, dataSet, function(data){
			 deferred.resolve(data);	
		});
		return  deferred.promise;
    };
    
    
	//
    deathClaimUIService.prototype.deathClaimRegistrationAction=  function (resourceURL, deathClaimRegistrationDecision, productName){
    	var deferred = $q.defer();
		var self = this;
		
		self.deathClaimRegistrationActions(resourceURL, deathClaimRegistrationDecision, productName).then(function(data) {			
			deferred.resolve(data);
		});  

		return  deferred.promise;
    };
    
	
	return new deathClaimUIService($q, ajax, $location, appService, cacheService, deathClaimCoreService, commonService);
}]);