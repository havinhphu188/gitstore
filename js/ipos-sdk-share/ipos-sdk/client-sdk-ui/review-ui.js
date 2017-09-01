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

var managerReviewUIModule = angular.module('managerReviewUIModule',['reviewModule','commonUIModule'])
.service('managerReviewUIService', ['$q', 'ajax', '$location', 'appService', 'cacheService', 'reviewCoreService', 'commonService', 'commonUIService', '$log',
    function($q, ajax, $location, appService, cacheService, reviewCoreService, commonService, commonUIService, $log){
    	
	function ManagerReviewUIService($q, ajax, $location, appService, cacheService, reviewCoreService, commonService){
		reviewCoreService.constructor.call(this, $q, ajax, $location, appService, cacheService, reviewCoreService.detailCoreService, commonService);
		this.name = 'manager-review';

	}
	inherit(reviewCoreService.constructor, ManagerReviewUIService );
	extend(commonUIService.constructor, ManagerReviewUIService);
	
	
	ManagerReviewUIService.prototype.getManagerReviewLazyList=  function (resourceURL, productName){
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
	
	//get manager review list for dash board portlety
    ManagerReviewUIService.prototype.getManagerPickableReviewListByBusinessStatus =  function (resourceURL, businessStatus){
    	var deferred = $q.defer();
		var self = this;
		var searchQuery = {"ipos-container:map-list":{"@xmlns:ipos-generic":"com.csc.gdn.ipos.model.jaxb.generic","@xmlns:ipos-system":"com.csc.gdn.ipos.model.jaxb.system","@xmlns:ipos-container":"com.csc.gdn.ipos.model.jaxb.container","@xmlns:ipos-dms":"com.csc.gdn.ipos.model.jaxb.dms","ipos-container:map-container":[{"@name":"0","ipos-container:pair":[{"@key":"DocType","@value":""},{"@key":"BusinessStatus","@value":""}]}]}};
				 var query = self.findElementInElement_V3(searchQuery, ['ipos-container:pair']);
				 for(var i = 0; i < query.length; i++){
					 if(query[i]['@key'] == "BusinessStatus"){
						 query[i]['@value'] = businessStatus;
					 }
					 if(query[i]['@key'] == "DocType"){
						 query[i]['@value'] = 'manager-review';
					 }
				 }
		var dataSet = searchQuery;

		var actionUrl = commonService.getUrl(commonService.urlMap.METADATA_SEARCH, ["manager-review"]); 
		self.ajax.postRuntime(resourceURL, actionUrl, dataSet, function(data){
			 deferred.resolve(data);	
		});
		return  deferred.promise;
    };
    
    ManagerReviewUIService.prototype.getManagerPickableReviewList =  function (resourceURL){
    	var self = this;
    	var deferred = $q.defer();
    	var promises = [self.getManagerPickableReviewListByBusinessStatus(resourceURL, "PENDING REVIEW"),
    	                self.getManagerPickableReviewListByBusinessStatus(resourceURL, "PENDING APPROVAL")];
    	$q.all(promises).then(function(values) {
    	    $log.debug(values[0]); // value alpha
    	    $log.debug(values[1]); // value gamma
    	    var a = [];
    	    var valueA = self.findElementInElement_V3(values[0], ['MetadataDocument']);
    	    var valueB = self.findElementInElement_V3(values[1], ['MetadataDocument']);
    	    
    	    if(valueA){
    	    	a = a.concat(valueA);
    	    }
    	    if(valueB){
    	    	a = a.concat(valueB);
    	    }
    	    deferred.resolve(a);
    	});
    	return  deferred.promise;
    };
    
	//get manager pickup review list for dash board portlety
    ManagerReviewUIService.prototype.getManagerReviewList =  function (resourceURL, managerId){
    	var deferred = $q.defer();
		var self = this;
		var searchQuery = {"ipos-container:map-list":{"@xmlns:ipos-generic":"com.csc.gdn.ipos.model.jaxb.generic","@xmlns:ipos-system":"com.csc.gdn.ipos.model.jaxb.system","@xmlns:ipos-container":"com.csc.gdn.ipos.model.jaxb.container","@xmlns:ipos-dms":"com.csc.gdn.ipos.model.jaxb.dms","ipos-container:map-container":[{"@name":"0","ipos-container:pair":[{"@key":"ManagerId","@value":""},{"@key":"DocType","@value":""},{"@key":"BusinessStatus","@value":""}]}]}};
		 var query = self.findElementInElement_V3(searchQuery, ['ipos-container:pair']);
		 for(var i = 0; i < query.length; i++){
			 if(query[i]['@key'] == "ManagerId"){
				 query[i]['@value'] = managerId;
			 }
			 if(query[i]['@key'] == "DocType"){
				 query[i]['@value'] = 'manager-review';
			 }
			 if(query[i]['@key'] == "BusinessStatus"){
				 query[i]['@value'] = 'PICKED UP';
			 }
		 }
		 var dataSet = searchQuery;
		var actionUrl = commonService.getUrl(commonService.urlMap.METADATA_SEARCH, ["manager-review"]); 
		self.ajax.postRuntime(resourceURL, actionUrl, dataSet, function(data){
			 deferred.resolve(data);	
		});
		return  deferred.promise;
    };
    
	//pickup manager review
    ManagerReviewUIService.prototype.pickupManager =  function (resourceURL,dataSet, action, docId, product){
    	var deferred = $q.defer();
		var self = this;
		
		if(action == "pickup"){
			if (product){
				var actionUrl = commonService.getUrl(commonService.urlMap.PICKUP_MANAGER_REVIEW_WITH_PRODUCT, ["manager-review", docId, product]);
			}
			else var actionUrl = commonService.getUrl(commonService.urlMap.PICKUP_MANAGER_REVIEW, ["manager-review", docId]);
			 
		}else if(action == "return"){
			if (product){
				var actionUrl = commonService.getUrl(commonService.urlMap.RETURN_PICKEDUP_MANAGER_REVIEW_WITH_PRODUCT, ["manager-review", docId, product]);
			}
			else var actionUrl = commonService.getUrl(commonService.urlMap.RETURN_PICKEDUP_MANAGER_REVIEW, ["manager-review", docId]);
			 
		}
		
		self.ajax.postRuntime(resourceURL, actionUrl, dataSet, function(data){
			 deferred.resolve(data);	
		});
		return  deferred.promise;
    };
    
    
	//
    ManagerReviewUIService.prototype.setManagerDecision=  function (resourceURL, managerDecision, productName){
    	var deferred = $q.defer();
		var self = this;
		
		self.setManagerDecisions(resourceURL, managerDecision, productName).then(function(data) {			
			deferred.resolve(data);
		});  

		return  deferred.promise;
    };

    
	
	    
	 return new ManagerReviewUIService($q, ajax, $location, appService, cacheService, reviewCoreService, commonService);
}]);
