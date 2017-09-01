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

var groupDepartmentUIModule = angular.module('groupDepartmentUIModule',['groupDepartmentModule', 'commonUIModule', 'policyUIModule'])
.service('groupDepartmentUIService', ['$q', 'ajax', '$http', '$location', 'appService', 'cacheService', 'commonUIService', 'groupDepartmentCoreService', 'commonService', 'pingService', 'policyCoreService',
	function($q, ajax, $http, $location, appService, cacheService, commonUIService, groupDepartmentCoreService, commonService, pingService, policyCoreService){

	function groupDepartmentUIService($q, ajax,  $http,   $location, appService, cacheService, groupDepartmentCoreService, commonService, policyCoreService){
		groupDepartmentCoreService.constructor.call(this, $q, ajax,  $http,  $location, appService, cacheService, groupDepartmentCoreService.detailCoreService, commonService, policyCoreService);
		this.name = 'group-department';
		this.lazyChoiceList = [];
	};
	inherit(groupDepartmentCoreService.constructor, groupDepartmentUIService);
	extend(commonUIService.constructor, groupDepartmentUIService);
	
	groupDepartmentUIService.prototype.getGroupDepartmentManagerReviewLazyList=  function (resourceURL, productName){
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
    
  //get group manager department  list for dash board portlety
    groupDepartmentUIService.prototype.getGroupDepartmentManagerPickableReviewList =  function (resourceURL){
    	var deferred = $q.defer();
		var self = this;
		var searchQuery = {"ipos-container:map-list":{"@xmlns:ipos-generic":"com.csc.gdn.ipos.model.jaxb.generic","@xmlns:ipos-system":"com.csc.gdn.ipos.model.jaxb.system","@xmlns:ipos-container":"com.csc.gdn.ipos.model.jaxb.container","@xmlns:ipos-dms":"com.csc.gdn.ipos.model.jaxb.dms","ipos-container:map-container":[{"@name":"0","ipos-container:pair":[{"@key":"DocType","@value":""},{"@key":"BusinessStatus","@value":""}]}]}};
				 var query = self.findElementInElement_V3(searchQuery, ['ipos-container:pair']);
				 for(var i = 0; i < query.length; i++){
					 if(query[i]['@key'] == "BusinessStatus"){
						 query[i]['@value'] = 'PENDING APPROVAL';
					 }
					 if(query[i]['@key'] == "DocType"){
						 query[i]['@value'] = 'group-department';
					 }
				 }
		var dataSet = searchQuery;

		var actionUrl = commonService.getUrl(commonService.urlMap.METADATA_SEARCH, ["group-department"]); 
		self.ajax.postRuntime(resourceURL, actionUrl, dataSet, function(data){
			 deferred.resolve(data);	
		});
		return  deferred.promise;
    };
  //get manager pickup review list for dash board portlety
    groupDepartmentUIService.prototype.getGroupDepartmentManagerReviewList =  function (resourceURL, groupDepartmentmanagerId){
    	var deferred = $q.defer();
		var self = this;
		var searchQuery = {"ipos-container:map-list":{"@xmlns:ipos-generic":"com.csc.gdn.ipos.model.jaxb.generic","@xmlns:ipos-system":"com.csc.gdn.ipos.model.jaxb.system","@xmlns:ipos-container":"com.csc.gdn.ipos.model.jaxb.container","@xmlns:ipos-dms":"com.csc.gdn.ipos.model.jaxb.dms","ipos-container:map-container":[{"@name":"0","ipos-container:pair":[{"@key":"ManagerId","@value":""},{"@key":"DocType","@value":""},{"@key":"BusinessStatus","@value":""}]}]}};
		 var query = self.findElementInElement_V3(searchQuery, ['ipos-container:pair']);
		 for(var i = 0; i < query.length; i++){
			 if(query[i]['@key'] == "GroupDepartmentManagerId"){				 					
				 query[i]['@value'] = groupDepartmentmanagerId;
			 }
			 if(query[i]['@key'] == "DocType"){
				 query[i]['@value'] = 'group-department';
			 }
			 if(query[i]['@key'] == "BusinessStatus"){
				 query[i]['@value'] = 'PICKED UP';
			 }
			 
		 }
		 var dataSet = searchQuery;
		var actionUrl = commonService.getUrl(commonService.urlMap.METADATA_SEARCH, ["group-department"]); 
		self.ajax.postRuntime(resourceURL, actionUrl, dataSet, function(data){
			 deferred.resolve(data);	
		});
		return  deferred.promise;
    };
    
  //pickup manager review
    groupDepartmentUIService.prototype.pickupGroupManagerDepartment =  function (resourceURL,dataSet, action, docId, product){
    	var deferred = $q.defer();
		var self = this;
		
		if(action == "pickup"){
			var actionUrl = commonService.getUrl(commonService.urlMap.PICKUP_GROUP_MANAGER_DEPARTMENT, ["group-department", docId , product]); 
		}else if(action == "return"){
			var actionUrl = commonService.getUrl(commonService.urlMap.RETURN_PICKUP_GROUP_MANAGER_DEPARTMENT, ["group-department", docId , product]); 
		}
		
		self.ajax.postRuntime(resourceURL, actionUrl, dataSet, function(data){
			 deferred.resolve(data);	
		});
		return  deferred.promise;
    };
    
    
	//
    groupDepartmentUIService.prototype.groupDepartmentManagerAction=  function (resourceURL, groupManagerDecision, productName){
    	var deferred = $q.defer();
		var self = this;
		
		self.groupDepartmentManagerActions(resourceURL, groupManagerDecision, productName).then(function(data) {			
			deferred.resolve(data);
		});  

		return  deferred.promise;
    };
    
    
	
	return new groupDepartmentUIService($q, ajax,  $http,   $location, appService, cacheService, groupDepartmentCoreService, commonService);
}]);