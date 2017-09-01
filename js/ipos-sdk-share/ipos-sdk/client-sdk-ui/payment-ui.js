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

var paymentUIModule = angular.module('paymentUIModule',['paymentModule', 'commonUIModule', 'policyUIModule'])
.service('paymentUIService', ['$q', 'ajax', '$location', 'appService', 'cacheService', 'commonUIService', 'paymentCoreService', 'commonService', 'pingService', 'policyCoreService', 'printPdfService', 'fileReader',
	function($q, ajax, $location, appService, cacheService, commonUIService, paymentCoreService, commonService, pingService, policyCoreService, printPdfService, fileReader){

	function PaymentUIService($q, ajax, $location, appService, cacheService, paymentCoreService, commonService, policyCoreService, printPdfService, fileReader){
		paymentCoreService.constructor.call(this, $q, ajax, $location, appService, cacheService, paymentCoreService.detailCoreService, commonService, policyCoreService);
		this.name = 'client-payment';
	};
	inherit(paymentCoreService.constructor, PaymentUIService);
	extend(commonUIService.constructor, PaymentUIService);
	
	PaymentUIService.prototype.clientPayToAgent=function(resourceURL){
		var self = this;
		var docId = self.findElementInDetail_V3(['DocId']);
		var deferred = $q.defer();
		var actionUrl = commonService.getUrl(commonService.urlMap.CREATE_CLIENT_PAYMENT, [docId]);
		self.ajax.postRuntime(resourceURL, actionUrl, self.detail, function(data){
			deferred.resolve(data);	
		});
		return  deferred.promise;
	}
	
	PaymentUIService.prototype.generatePdf = function(portletId, product, actionType) {
		var self = this;
		var deferred = $q.defer();
		var resourceURL = self.initialMethodPortletURL(portletId, "showPdf");
		printPdfService.portletId = portletId;
		printPdfService.moduleService = this;
		printPdfService.product = product;
		printPdfService.actionType = actionType;
		printPdfService.getTemplateList().then(function() {
			var template = printPdfService.listTemplate[0];
			var url = commonService.getUrl(self.commonService.urlMap.MODULE_PRINTPDF_V3_1, [self.name, self.findElementInDetail_V3(['DocId']), template, product]);
			resourceURL.setParameter("url", url);
			fileReader.showPDF(resourceURL.toString()).then(function (data) {
				if (data != undefined) {
				    deferred.resolve(true);
				}
			});
		});
		
		return deferred.promise;
	};
	
	PaymentUIService.prototype.cancelQueuingPayment=function(resourceURL, clientPaymentId, dataSet){
		var self = this;
		var docId = clientPaymentId;
		var updateFields = dataSet;
		var deferred = $q.defer();
		paymentCoreService.cancelQueuingPayment.call(self, resourceURL, docId, updateFields).then(function(result) {
			deferred.resolve(result);
		});
		return  deferred.promise;
	}
	
	return new PaymentUIService($q, ajax, $location, appService, cacheService, paymentCoreService, commonService, policyCoreService, printPdfService, fileReader);
}]);