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

var salecaseUIModule = angular.module('salecaseUIModule',['salecaseModule','commonUIModule'])
.service('salecaseUIService', ['$q', 'ajax', '$location', 'appService', 'cacheService', 'commonUIService', 'salecaseCoreService','commonService', 'pingService',
    function($q, ajax, $location, appService, cacheService, commonUIService, salecaseCoreService, commonService, pingService){
    	
	function SaleCaseUIService($q, ajax, $location, appService, cacheService, salecaseCoreService, commonService){
		salecaseCoreService.constructor.call(this, $q, ajax, $location, appService, cacheService, salecaseCoreService.detailCoreService, commonService);
		this.name = commonService.CONSTANTS.MODULE_NAME.SALECASE;
		
	}
	inherit(salecaseCoreService.constructor, SaleCaseUIService);
	extend(commonUIService.constructor, SaleCaseUIService);
	
	SaleCaseUIService.prototype.reSubmitBC = function(resourceURL, docId, product, transactionType) {
		 var self = this;
		 var deferred = self.$q.defer();
		 this.reSubmitBusinessCase.call(self, resourceURL, docId, product, transactionType).then(function(data) {
			 deferred.resolve(data);
		 });
		 return deferred.promise;
	 };
	
	SaleCaseUIService.prototype.loadSaleCaseDetailUI = function(resourceURL,productName){
		 var self = this;
		 var deferred = self.$q.defer();
		 this.loadSaleCaseDetail.call(self,resourceURL,productName).then(function(data){
			 //do somthing else when override
			 deferred.resolve(data);
		 });
		 return  deferred.promise;
	 };
	 
	 SaleCaseUIService.prototype.loadSaleCaseDetailLazyListUI = function(productName){
		 var self = this;
		 var deferred = self.$q.defer();
		 this.loadSaleCaseDetailLazyList.call(self,productName).then(function(data){
			 //do somthing else when override
			 deferred.resolve(data);
		 });
		 return  deferred.promise;
	 };
	 
	 SaleCaseUIService.prototype.saveSaleCaseDetailUI = function(productName){
		var self = this;
		 var deferred = self.$q.defer();
		 this.saveSaleCaseDetail.call(self,productName).then(function(data){
			 //do somthing else when override
			 deferred.resolve(data);
		 });
		 return  deferred.promise;
	 };
	 
	 SaleCaseUIService.prototype.computeSaleCaseDetailUI = function(productName){
		 var self = this;
		 var deferred = self.$q.defer();
		 this.computeSaleCaseDetail.call(self,productName).then(function(data){
			 deferred.resolve(data); 
		 });
		 return deferred.promise;
	 };
	 SaleCaseUIService.prototype.setUpTransactionDocuments = function(resourceURL){
		 var self = this;
		 var deferred = self.$q.defer();
		 var cloneDetail = commonService.clone(self.detail);
		 var prints = self.convertToArray(self.findElementInDetail_V3(['Print']));
		 var clonePrints = self.convertToArray(self.findElementInElement_V3(cloneDetail, ['Print']));
		 var uIdList = [];
		 for (var i=0; i<prints.length; i++){
			 uIdList.push(self.findElementInElement_V3(prints, ['PrintID']).$); 
		 }
		 var template = {"@vpms-suffix":"Print","case-management-motor:Name":{"@vpms-suffix":"Name"},"case-management-motor:FileName":{"@vpms-suffix":"FileName"},"case-management-motor:CreateDate":{"@vpms-suffix":"CreateDate"},"case-management-motor:FileSize":{"@vpms-suffix":"FileSize"}};
		 var test = {"$":''};
		 var metaData;
		 var actionUrl = self.commonService.getUrl(self.commonService.urlMap.DOCUMENT_FIND_METADATA_V3, [ uIdList ]);
		 self.ajax.getRuntime(resourceURL, actionUrl, function(data){
			 if(data != ""){
				 metaData = data.MetadataDocuments.MetadataDocument;
				 if(!$.isArray(metaData)){
					 if (metaData != undefined) {
							var temp = metaData;
							metaData = [];
							metaData.push(temp);
						}
						else{
							metaData = [];
						}
				 }
				 for (var i=0; i<prints.length; i++){
					 var cloneTemplate = commonService.clone(template);
					 //commonService.copyValueFromOther(cloneTemplate, clonePrints[i] );
					 
					 clonePrints[i]['@refResourceUid'] = metaData[i].DocId;
					 /*clonePrints[i].Name = new Object;
					 clonePrints[i].FileName = new Object;
					 clonePrints[i].CreatedDate = new Object;
					 clonePrints[i].FileSize = new Object;
					 self.findElementInElement_V3(clonePrints[i], ['Name']).$ = metaData[i].Name;
					 self.findElementInElement_V3(clonePrints[i], ['FileName']).$ = metaData[i].FileName;
					 self.findElementInElement_V3(clonePrints[i], ['CreatedDate']).$ = metaData[i].CreatedDate;
					 self.findElementInElement_V3(clonePrints[i], ['FileSize']).$ = metaData[i].FileSize;*/
					 
					 clonePrints[i].Name = metaData[i].Name;
					 clonePrints[i].FileName = metaData[i].FileName;
					 clonePrints[i].CreatedDate = metaData[i].CreatedDate;
					 clonePrints[i].FileSize = metaData[i].FileSize;
					 clonePrints[i].DocId = metaData[i].DocId;
				 }
//							 commonService.copyValueFromOther(metaData[i], clonePrints[i] );
			 }
			 deferred.resolve(cloneDetail); 
		});
		return deferred.promise;
	 };
	 
	 SaleCaseUIService.prototype.getCaseManagementLazyList=  function (resourceURL,productName){
			var self = this;
			var deferred = $q.defer();
			if(self.lazyChoiceList[productName] == undefined) {						
				self.getLazyChoiceListByModuleAndProduct_V3(resourceURL, productName).then(function(data) {
					self.lazyChoiceList[productName] = data;				
					deferred.resolve(data);
				});   		
			}
			return deferred.promise;
			
	    };

	   SaleCaseUIService.prototype.getListUidPrintFromCase =  function (){
            var self = this;
            var printList = self.findElementInDetail_V3(['Prints', 'Print']);
            var listUid = '';
            if(printList.length > 0){
                angular.forEach(printList, function(item){
                    listUid = listUid + ',' + item["@refResourceUid"];
                });
                listUid = listUid.substr(1, listUid.length);
            }
            return listUid;
        };

	 return new SaleCaseUIService($q, ajax, $location, appService, cacheService, salecaseCoreService, commonService);
	 
}]);
