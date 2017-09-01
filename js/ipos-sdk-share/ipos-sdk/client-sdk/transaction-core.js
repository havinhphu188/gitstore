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
var transactionModule = angular.module('transactionModule',['coreModule'])
.service('transactionCoreService', ['$q', 'ajax', '$http', '$location', 'appService', 'cacheService', 'detailCoreService', 'salecaseCoreService', 'commonService', 'connectService', 
	function($q, ajax, $http, $location, appService, cacheService, detailCoreService, salecaseCoreService, commonService, connectService){
	
	function TransactionCoreService($q, ajax,  $http, $location,  appService, cacheService, detailCoreService, salecaseCoreService, commonService){
		var self = this;
		this.detailCoreService = detailCoreService;
		this.salecaseCoreService = salecaseCoreService;
		detailCoreService.ListDetailCoreService.call(self, $q,   ajax, $location, appService, cacheService, salecaseCoreService, commonService);
	//	this.name = commonService.CONSTANTS.MODULE_NAME.HOME;
	//	self.init();
	};
	inherit(detailCoreService.ListDetailCoreService, TransactionCoreService);
	TransactionCoreService.prototype.initTransaction = function(resourceURL) {
		 var self = this;
		 var deferred = self.$q.defer();
		 if(self.detail==undefined) { 
			 //var runtimeURL = commonService.getUrl(commonService.urlMap.PRODUCT_LIST_V3);
			/* var runtimeURL = commonService.getUrl(commonService.urlMap.DOCUMENT_ADD, [ "transaction" ]);
			 self.ajax.getRuntime(resourceURL, runtimeURL,function(data){
				 self.detail = data;			
				 deferred.resolve(data);	
			 });*/
			 connectService.exeAction({
 		    	actionName: "DOCUMENT_ADD",
 		    	actionParams: ["transaction"],
 		    	resourceURL: resourceURL
 		    }).then(function(data){
 		    	self.detail = data;
 		    	deferred.resolve(data);
 		    });
		 }
		 else{
			 var data =  self.extractUiDataSet_V3 (self.detail);;
			 deferred.resolve(data);
		 }
		 return deferred.promise;
	};
	//hcao7
	TransactionCoreService.prototype.initAgentPaymentTransaction = function(resourceURL) {
		 var self = this;
		 var deferred = self.$q.defer();
		 if(self.detail==undefined) { 
			 connectService.exeAction({
		    	actionName: "DOCUMENT_ADD",
		    	actionParams: ["agent-payment"],
		    	resourceURL: resourceURL
		    }).then(function(data){
		    	self.detail = data;
		    	deferred.resolve(data);
		    });
		 }
		 else{
			 var data =  self.extractUiDataSet_V3 (self.detail);;
			 deferred.resolve(data);
		 }
		 return deferred.promise;
	};	
	//hcao7
	
	
	
	TransactionCoreService.prototype.createTransaction_V3 = function(resourceURL,transactionData) {
		 var self = this;
		 var deferred = self.$q.defer();
//		 var runtimeURL = "transaction/save";
		 var runtimeURL = "transaction/incomplete";
		 self.ajax.postRuntime(resourceURL, runtimeURL, transactionData,function(data){
			/* self.detail = data;*/			
			 deferred.resolve(data);	
		 });
		 return deferred.promise;
	};
	TransactionCoreService.prototype.createTransactionAndRequestSignature_V3 = function(resourceURL, transactionData) {
		 var self = this;
		 var deferred = self.$q.defer();
		 resourceURL.setResourceId("createTransactionAndRequestSignature");
		 resourceURL.setParameter("transactionData", transactionData);
		 $http.get(resourceURL).success(function(result){
			 deferred.resolve(result);
		 });
		 return deferred.promise;
	};
	
	TransactionCoreService.prototype.getTransaction_V3 = function(resourceURL) {
		 var self = this;
		 var deferred = self.$q.defer();
//		 var runtimeURL = "transaction/list";
		 var runtimeURL = commonService.getUrl(commonService.urlMap.MODULE_DOCUMENTLIST_V3, ["transaction"]);//apply new API Url;
		 self.ajax.getRuntime(resourceURL, runtimeURL,function(data){
			 /*self.detail = data;	*/		
			 deferred.resolve(data);	
		 });
		 return deferred.promise;
	};
	
	TransactionCoreService.prototype.getTransactionList_V3 = function(resourceURL) {
		 var self = this;
		 var deferred = self.$q.defer();
		 /*var runtimeURL = commonService.getUrl(commonService.urlMap.MODULE_DOCUMENTLIST_V3, ["business-transaction"]);//apply new API Url;
		 self.ajax.getRuntime(resourceURL, runtimeURL,function(data){
			 deferred.resolve(data);	
		 });*/
		 
		 connectService.exeAction({
		    	actionName: "MODULE_DOCUMENTLIST_V3",
		    	actionParams: ["business-transaction"],
		    	resourceURL: resourceURL
		    }).then(function(data){
					 deferred.resolve(data);	
		    });
		 
		 return deferred.promise;
	};
	
	TransactionCoreService.prototype.searchBusinessTransactionMetadata = function(resourceURL, dataSet) {
		 var deferred = $q.defer();
		 var self = this;
//		 var actionUrl = commonService.getUrl(commonService.urlMap.METADATA_ADVANCESEARCH, ["business-transaction"]);
//		 self.ajax.postRuntime(resourceURL, actionUrl, dataSet, function(data){
//			 deferred.resolve(data);
//		 });
         connectService.exeAction({
	    	actionName: "METADATA_ADVANCESEARCH",
	    	actionParams: ["business-transaction"],
	    	data: dataSet,
	    	resourceURL: resourceURL
	    }).then(function(data){
				 deferred.resolve(data);
	    });

		 return  deferred.promise;
	 };
	
	TransactionCoreService.prototype.getTransactionDetail_V3 = function(resourceURL,DocId) {
		 var self = this;
		 var deferred = self.$q.defer();
//		 var runtimeURL = "findDocument/"+DocId;
/*		 var runtimeURL = "documents/"+DocId; //apply new API Url
		 self.ajax.getRuntime(resourceURL, runtimeURL,function(data){
			 self.detail = data;			
			 deferred.resolve(data);	
		 });
		 */
		 connectService.exeAction({
	    	actionName: "DOCUMENT_FIND_DOCUMENT_API_V3_NO_VERSION",
	    	actionParams: [DocId],
	    	resourceURL: resourceURL
	    }).then(function(data){
	    	self.detail = data;			
			deferred.resolve(data);	
	    });
		 
		 return deferred.promise;
	};
	TransactionCoreService.prototype.getLazyList_V3 = function(resourceURL) {
		 var self = this;
		 var deferred = self.$q.defer();
		 //var runtimeURL = commonService.getUrl(commonService.urlMap.PRODUCT_LIST_V3);
//		 var runtimeURL = "transaction/computeLazy";
		 var runtimeURL = "transaction/restrictions";
		 self.ajax.getRuntime(resourceURL, runtimeURL,function(data){
			/* self.detail = data;*/			
			 deferred.resolve(data);	
		 });
		 return deferred.promise;
	};
	TransactionCoreService.prototype.updateTransaction = function(resourceURL,transactionData,DocId) {
		 var self = this;
		 var deferred = self.$q.defer();
		 //var runtimeURL = commonService.getUrl(commonService.urlMap.PRODUCT_LIST_V3);
		 var runtimeURL = "transaction/update/"+DocId;
		 self.ajax.postRuntime(resourceURL, runtimeURL,transactionData,function(data){
			 /*self.detail = data;*/			
			 deferred.resolve(data);	
		 });
		 return deferred.promise;
	};
	TransactionCoreService.prototype.proscessPayment = function(resourceURL,DocId) {
		 var self = this;
		 var deferred = self.$q.defer();
		 var detail = this.detail;
//		 var runtimeURL = commonService.getUrl(commonService.urlMap.PAID_TRANSACTION, [ DocId ]);
//		 self.ajax.postRuntime(resourceURL, runtimeURL, detail, function(data){
//			 deferred.resolve(data);
//		 });

        connectService.exeAction({
	    	actionName: "PAID_TRANSACTION",
	    	actionParams: [DocId],
	    	data: detail,
	    	resourceURL: resourceURL
	    }).then(function(data){
				 deferred.resolve(data);
	    });

		 return deferred.promise;
	};
	
	TransactionCoreService.prototype.processPayment_MNC = function(portletId, docId, totalPayableAmount, product) {
		 var self = this;
		 var deferred = self.$q.defer();
		 var detail = this.detail;
		  var resourceURL = this.initialMethodPortletURL(portletId, "completeAgentPayment");
          ////////////////////////////////////////////////////////////////////
          //For only one payment by credit card 
          resourceURL.setParameter("docId", docId);
          resourceURL.setParameter("product", product);
          resourceURL.setParameter("totalPayableAmount", totalPayableAmount);
          
          resourceURL = resourceURL.toString();

          ajax.postRes(resourceURL, detail, function(data) {
        	  deferred.resolve(data);
        	  
          });
		 return deferred.promise;
	};
	
	TransactionCoreService.prototype.checkCreditAccountValid = function(portletId,  totalPayableAmount, product) {
		 var self = this;
		 var deferred = self.$q.defer();
		 var detail = this.detail;
		  var resourceURL = this.initialMethodPortletURL(portletId, "checkCreditAccountValid");

         resourceURL.setParameter("product", product);
         resourceURL.setParameter("totalPayableAmount", totalPayableAmount);
         
         resourceURL = resourceURL.toString();

         ajax.postRes(resourceURL, detail, function(data) {
        	 if(!data){
        		 data.result = false;
        	 }
       	  	deferred.resolve(data);
       	  
         });
		 return deferred.promise;
	};
	
	TransactionCoreService.prototype.getCreditLimit = function(resourceURL, product) {
		 var self = this;
		 var deferred = self.$q.defer();

		connectService.exeAction({
	    	actionName: "GET_USER_CREDIT_LIMIT",
	    	actionParams: [product],
	    	resourceURL: resourceURL
	    }).then(function(data){
				 deferred.resolve(data);	
	    });
			
			/*1300020579*/
		 return deferred.promise;
	};
	
	TransactionCoreService.prototype.checkIsOnline = function() {
		 var self = this;
		 var deferred = self.$q.defer();
		connectService.exeAction({
	    	actionName: "SYSTEM_CHECK_NETWORK",
	    	actionParams: [],
	    	resourceURL: undefined
	    }).then(function(data){
				 deferred.resolve(data);	
	    });
		 return deferred.promise;
	};
	
	TransactionCoreService.prototype.doPaymentWithDoku = function(dataSet) {
		 var self = this;
		 var deferred = self.$q.defer();
		connectService.exeAction({
	    	actionName: "PAID_TRANSACTION_DOKU",
	    	actionParams: [],
	    	data: dataSet,
	    	resourceURL: undefined
	    }).then(function(data){
				 deferred.resolve(data);	
	    });
		 return deferred.promise;
	};
	
	
	return new TransactionCoreService($q, ajax,  $http, $location,  appService, cacheService, detailCoreService, salecaseCoreService, commonService);
}]);