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
var salecaseModule = angular.module('salecaseModule',['coreModule'])
.service('salecaseCoreService', ['$q', 'ajax', '$location', 'appService', 'cacheService', 'detailCoreService', 'commonService', 'connectService', '$log', 
	function($q, ajax, $location, appService, cacheService, detailCoreService, commonService, connectService, $log){
	function SaleCaseCoreService($q, ajax, $location, appService, cacheService, detailCoreService, commonService, connectService){
		var self = this;
		this.detailCoreService = detailCoreService;
		detailCoreService.ListDetailCoreService.call(self, $q, ajax, $location, appService, cacheService, commonService, connectService);
		this.name = commonService.CONSTANTS.MODULE_NAME.SALECASE;
	};
	inherit(detailCoreService.ListDetailCoreService, SaleCaseCoreService);
	
	SaleCaseCoreService.prototype.reSubmitBusinessCase = function(resourceURL, docId, product, transactionType) {
		var self = this;
		var deferred = self.$q.defer();
		connectService.exeAction({
	    	actionName: "RESUBMIT_BUSINESS_CASE",
	    	actionParams: [docId, product, transactionType],
	    	data: {},
	    	resourceURL: resourceURL
	    }).then(function(data) {
	    	deferred.resolve(data);
	    });
		
		return deferred.promise;
	};
	
	SaleCaseCoreService.prototype.loadSaleCaseDetail = function(resourceURL,productName){
		var self = this;
		var deferred = self.$q.defer();
		var url = commonService.getUrl(commonService.urlMap.MODULE_CREATE,[self.name,productName]);
		self.invokeRuntimeService("GET",resourceURL,url).then(function(data){
			self.updateDetailData(data);
			deferred.resolve(data);
		});
		return deferred.promise;
	};
	
	SaleCaseCoreService.prototype.loadSaleCaseDetailLazyList = function(productName){
		var self = this;
		var deferred = self.$q.defer();
		var url = commonService.getUrl(commonService.urlMap.MODULE_LAZY_CHOICELIST_V3,[self.name,productName]);
		self.ajax.get_V3(url).success(function(data){
			deferred.resolve(data);
		});
		return deferred.promise;
	};
	
	SaleCaseCoreService.prototype.saveSaleCaseDetail = function(productName){
		var self = this;
		var deferred = self.$q.defer();
		var dataSet = self.detail;
		var transactionType = self.getCaseTransactionType();
		var url = commonService.getUrl(commonService.urlMap.DOCUMENT_VALIDATE_AND_SAVE,[self.name, productName, undefined, transactionType]);
		self.ajax.post_V3(url, dataSet).success(function(data){
			self.updateDetailData(data);
			deferred.resolve(data);
		});
		return deferred.promise;
	};
	
	SaleCaseCoreService.prototype.computeSaleCaseDetail = function(productName){
		var self = this;
		var deferred = self.$q.defer();
		var dataSet = self.detail;
		$log.debug(dataSet);
		
		var transactionType = self.getCaseTransactionType();

		var url = commonService.getUrl(commonService.urlMap.DOCUMENT_COMPUTE_V3, [self.name, productName, transactionType]);
		$log.debug(url);
		self.ajax.post_V3(url,dataSet).success(function(data){
			$log.debug(data);
			self.updateDetailData(data);
			deferred.resolve(data);
		});
		return deferred.promise;
	};
	SaleCaseCoreService.prototype.getSaleCaseType_V3 = function(resourceURL) {
		 var self = this;
		 var deferred = self.$q.defer();
		 var runtimeURL = commonService.getUrl(commonService.urlMap.MODULE_LISTPRODUCT, [self.name]);
//		 var runtimeURL = "case-management/listProduct";
		 self.ajax.getRuntime(resourceURL, runtimeURL, function(data){			
			 deferred.resolve(data);	
		 });
		 return deferred.promise;
	};
	// for agent sale	
	SaleCaseCoreService.prototype.submitSaleCase = function(resourceURL,saleCaseUid){
		var self = this;
		var deferred = self.$q.defer();
		var dataSet = self.detail;
		/*var actionUrl = 'submit/AgentSale/NB/'+saleCaseUid;*/
		var actionUrl = commonService.getUrl(commonService.urlMap.CREATE_PAYMENT_FOR_AGENT_SALE_CASE_NEW_BUSINESS, [ saleCaseUid ]);
		$log.debug(actionUrl);
		self.ajax.getRuntime(resourceURL, actionUrl, function(data){
			self.getPendingPaymentNo(resourceURL).then(function(result){
				deferred.resolve(data);	
			});
		});

		return deferred.promise;
	};
	
	SaleCaseCoreService.prototype.getPendingPaymentNo = function(resourceURL){
		var self = this;
		var deferred = self.$q.defer();
		var runtimeURL = "payments";
		 self.ajax.getRuntime(resourceURL, runtimeURL,function(data){
			 if (data!==null || data!==undefined || data!=="null" || data!="") {
				 $log.debug("load PaymentList Successfully!!!");
				 var count = 0;
				 if(data.MetadataDocuments!=undefined){
					var data1 = data.MetadataDocuments.MetadataDocument;
					if (data1 != undefined){
						 for (var int = 0; int < data1.length; int++) {
								if (data1[int].PaymentStatus=='PENDING') {
									count++;
								}
							};	 
					 }
				 }
				 $('#iposItemInCart').html(count) ;
					localStorage.setItem("pendingPaymentNo",count);
				 deferred.resolve(count);	
			}
			 $log.debug("Get Pending PaymentList");
		 });
		 return deferred.promise;
	};
	
	// Pre-Submission for Agent Sale and Direct Sale
	SaleCaseCoreService.prototype.preSubmitSaleCase = function(resourceURL,caseType,saleCaseUid, product){
		var self = this;
		var deferred = self.$q.defer();
		var actionUrl = commonService.getUrl(commonService.urlMap.PRESUBMISSION_CASEMANAMENT,[saleCaseUid, caseType, product]);
		$log.debug(actionUrl);
		console.log('[' + new Date().toUTCString() + '] presubmission case' + saleCaseUid);
		connectService.exeAction({
			    	actionName: "PRESUBMISSION_CASEMANAMENT",
			    	actionParams: [saleCaseUid, caseType, product],
			    	data: "{}",
			    	resourceURL: resourceURL
			    }).then(function(data){
					 if (self.isSuccess(data)){
						self.detail = data; // set detail after pre-submit successfully
						if (window.Liferay.Fake != true) {
							self.getPendingPaymentNo(resourceURL).then(function(result){
								deferred.resolve(data);
							});
						} else {
							deferred.resolve(data);
						}
					} else {
						deferred.resolve(data);
						$log.error("Presubmit Error!!!");
					}	
			    });
		/*self.ajax.postRuntime(resourceURL, actionUrl, {}, function(data){
			if (self.isSuccess(data)){
				self.detail = data; // set detail after pre-submit successfully
				self.getPendingPaymentNo(resourceURL).then(function(result){
					deferred.resolve(data);
				});
			} else {
				deferred.resolve(data);
				$log.debug("Presubmit Error!!!");
			}
			
		});*/

		return deferred.promise;
	};
	// pre Submission for Endorsement
	SaleCaseCoreService.prototype.preSubmissionForEndorsement = function(resourceURL,saleCaseUid){
		var self = this;
		var deferred = self.$q.defer();
		/*var actionUrl = 'presubmission/Direct/ED/'+saleCaseUid;*/
		var actionUrl = commonService.getUrl(commonService.urlMap.CREATE_PAYMENT_FOR_DIRECT_SALE_CASE_ENDORSEMENT, [ saleCaseUid, self.product ]);

		$log.debug(actionUrl);
		self.ajax.postRuntime(resourceURL, actionUrl, {}, function(data){
			if (!self.isSuccess(data)) $log.debug(data);
			deferred.resolve(data);
		});
		return deferred.promise;
	};
	
	// pre Submission for renewal
	SaleCaseCoreService.prototype.preSubmissionForRenewal = function(resourceURL, saleCaseUid){ //old version
		var self = this;
		var deferred = self.$q.defer();
		/*var actionUrl = 'presubmission/Direct/RN/'+saleCaseUid;*/
		var actionUrl = commonService.getUrl(commonService.urlMap.CREATE_PAYMENT_FOR_DIRECT_SALE_CASE_RENEWAL, [ saleCaseUid ]);
		$log.debug(actionUrl);
		self.ajax.postRuntime(resourceURL, actionUrl, {}, function(data){
			if (self.isSuccess(data)){
				self.getPendingPaymentNo(resourceURL).then(function(result){
					deferred.resolve(data);
				});
			} else {
				deferred.resolve(data);
				$log.error("Presubmit Error!!!");
			}
			
		});
		return deferred.promise;
	};
	
	SaleCaseCoreService.prototype.preSubmissionForRenewalAgent = function(resourceURL, saleCaseUid){//old version
		var self = this;
		var deferred = self.$q.defer();
		/*var actionUrl = 'presubmission/Direct/RN/'+saleCaseUid;*/
		var actionUrl = commonService.getUrl(commonService.urlMap.CREATE_PAYMENT_FOR_AGENT_SALE_CASE_RENEWAL, [ saleCaseUid ]);
		$log.debug(actionUrl);
		self.ajax.postRuntime(resourceURL, actionUrl, {}, function(data){
			if (self.isSuccess(data)){
				self.getPendingPaymentNo(resourceURL).then(function(result){
					deferred.resolve(data);
					self.detail = data;
				});
			} else {
				deferred.resolve(data);
				$log.error("Presubmit Error!!!");
			}
			
		});
		return deferred.promise;
	};
	
	//Currently used
	SaleCaseCoreService.prototype.preSubmissionForCaseRenewal= function(resourceURL, saleCaseUid, product){
		var self = this;
		var deferred = self.$q.defer();
		var actionUrl = commonService.getUrl(commonService.urlMap.CREATE_PAYMENT_FOR_CASE_RENEWAL, [ saleCaseUid, product ]);
		$log.debug(actionUrl);
		self.ajax.postRuntime(resourceURL, actionUrl, {}, function(data){
			if (self.isSuccess(data)){
				self.getPendingPaymentNo(resourceURL).then(function(result){
					deferred.resolve(data);
					self.detail = data;
				});
			} else {
				deferred.resolve(data);
				$log.error("Presubmit Error!!!");
			}
			
		});
		return deferred.promise;
	};
	
	SaleCaseCoreService.prototype.getPolicyDocWithAction = function(resourceURL,action,policyNum, policyType, effectiveDate){
		/*var self = this;
		var deferred = self.$q.defer();
		var transactionType = action;
		if (action === "renewal") {
			transactionType = "Renewal";
		}
		else if (action === "ENDORSEMENT"){
			transactionType = "Endorsement";
		}
		var url = commonService.getUrl(commonService.urlMap.GET_POLICY_DOC_WITH_ACTION,[policyNum,action, policyType, effectiveDate,transactionType]);
		if(policyType=='FIR'){
			url = url + '&product=FIR';
		}
		$log.debug(url);
		self.ajax.postRuntime(resourceURL, url, {}, function(data){

			deferred.resolve(data);
			self.detail = data;
		});
		return deferred.promise;*/
		
		var self = this;
		var deferred = self.$q.defer();
		var transactionType = action;
		var product;
		if (action === "renewal") {
			transactionType = "Renewal";
		}
		else if (action === "ENDORSEMENT"){
			transactionType = "Endorsement";
		}
		
		if(policyType=='FIR'){
			product = policyType;
		}
		
		connectService.exeAction({
	    	actionName: "GET_POLICY_DOC_WITH_ACTION",
	    	actionParams: [policyNum, action, policyType, effectiveDate, transactionType, product],
	    	data:{},
	    	resourceURL: resourceURL
	    }).then(function(data){
	    	self.detail = data;
			self.originalDetail = angular.copy(self.detail);
			deferred.resolve(data);		
	    });
		return deferred.promise;
	};
	
	SaleCaseCoreService.prototype.sendEmailAfterSaveDirectSaleCase = function (resourceURL,typeSendValue, product, createDate, expiredDate, zone) {
		var self = this;
		var deferred = self.$q.defer();
		connectService.exeAction({
	    	actionName: "BUILD_URL_SEND_EMAIL_DS",
	    	actionParams: [typeSendValue, product, createDate, expiredDate, zone],
	    	resourceURL: resourceURL
	    }).then(function(){
			deferred.resolve();		
	    });
		return deferred.promise;
	};
	
	SaleCaseCoreService.prototype.submissionPolicyServicing = function(resourceURL, saleCaseID, productName, actionType){
		 var self = this;
		 var deferred = self.$q.defer();
		 var dataSet = self.detail;
		 var transactionType = self.getCaseTransactionType();
		 
		 /*var url = commonService.getUrl(commonService.urlMap.SUBMISSION_POLICY_SERVCING, [saleCaseID, productName, transactionType]);	
		 self.ajax.postRuntime(resourceURL, url, dataSet, function(data){
			 self.detail = data;
			 deferred.resolve(data);						
		 });*/
		 
		 connectService.exeAction({
	    	actionName: "SUBMISSION_POLICY_SERVCING",
	    	actionParams: [saleCaseID, productName, transactionType, actionType],
	    	data: dataSet,
	    	resourceURL: resourceURL
	     }).then(function(data){
	    	self.detail = data;
			self.originalDetail = angular.copy(self.detail);
			deferred.resolve(data);		
	     });
		 return  deferred.promise;
	 };
	
	SaleCaseCoreService.prototype.createCaseWithAction = function(resourceURL,action,policyNum, effectiveDate){
		var self = this;
		var deferred = self.$q.defer();
		var policyType = self.product;
		var eReason = localStorage.getItem("policyServicingReason");
		var transactionType = action;
		if (transactionType === "ENDORSEMENT") transactionType = "Endorsement";
		else if (transactionType === "PolicyServicing") action = eReason;
//		if (action == commonService.urlMap.)
		if(self.product == "guaranteed-cashback-saver"){
			policyType = "guaranteed-cashback-saver";
		}
		else if (!self.product.indexOf("motor")){
			policyType = "motor-private-car-m-as";
		};
		
		
		var url = commonService.getUrl(commonService.urlMap.CREATE_CASE_BASE_ACTION_TYPE_AND_POLICY_NUM,[policyNum,action,self.product,policyType, effectiveDate, transactionType]);
//		if (self.product.indexOf("motor")!== -1) url+="&policyType=motor-private-car-m-as&effectiveDate="+effectiveDate;
//		else if (self.product.indexOf("motor") === -1) url+="&policyType=" + policyType + "&effectiveDate="+effectiveDate;
		$log.debug(url);
		self.ajax.getRuntime(resourceURL, url, function(data){
			
						
			self.detail = data;
			//gen doc name
			self.findElementInDetail_V3(['DocInfo'])['DocName'] = self.genDefaultName();
			deferred.resolve(data);
		});
		return deferred.promise;
	};
	return new SaleCaseCoreService($q, ajax, $location, appService, cacheService, detailCoreService, commonService, connectService);
}]);
