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
var illustrationModule = angular.module('illustrationModule',['coreModule'])
.service('illustrationCoreService', ['$q', 'ajax', '$location', 'appService', 'cacheService', 'detailCoreService', 'commonService', 'workspaceService', 'connectService',
	function($q, ajax, $location, appService, cacheService, detailCoreService, commonService, workspaceService, connectService){
	
	/**
	 * @constructor
	 * @extends ListDetailCoreService
	 * @param $q
	 * @param ajax
	 * @param $location
	 * @param appService
	 * @param cacheService
	 */
	function IllustrationCoreService($q, ajax, $location, appService, cacheService, detailCoreService, commonService){
		var self = this;
		self.detailCoreService = detailCoreService;
//		self.prospectCoreService = prospectCoreService;
		detailCoreService.ListDetailCoreService.call(self, $q, ajax, $location, appService, cacheService, commonService);
		this.name = "illustration";
		this.illustrationTypes = undefined;
		this.computed = false;
		this.docProductList = undefined;
	}
	inherit(detailCoreService.ListDetailCoreService, IllustrationCoreService);
	
	/**
	 * 
	 */
	
	IllustrationCoreService.prototype.getDocumentForCreate_V3 = function(resourceURL) {
		 var self = this;
		 var deferred = self.$q.defer();
		 //var runtimeURL = commonService.getUrl(commonService.urlMap.PRODUCT_LIST_V3);
		 var runtimeURL = "illustration;product=term-life-protect/create";
		 self.ajax.getRuntime(resourceURL, runtimeURL, function(data){
			 self.detail = data;			
			 deferred.resolve(data);	
		 });
		 return deferred.promise;
	};
	
	/**
	 * 
	 */
	
	IllustrationCoreService.prototype.getIllustrationProductList_V3 = function(resourceURL) {
		 var self = this;
		 var deferred = self.$q.defer();
		 var runtimeURL = commonService.getUrl(commonService.urlMap.MODULE_LISTPRODUCT, [self.name]);
		 self.ajax.getRuntime(resourceURL, runtimeURL, function(data){			
			 deferred.resolve(data);	
		 });
		 return deferred.promise;
	};
	
	/**
	 * 
	 */
	IllustrationCoreService.prototype.computeIllustrationDetail = function(resourceURL, productName){
		var self = this;
		var deferred = self.$q.defer();
		self.clearErrorInElement(self.detail);
		//var dataSet = self.detail;
		var dataSet = self.extractUiDataSet_V3(self.detail);
		var actionUrl = commonService.getUrl(commonService.urlMap.DOCUMENT_COMPUTE_V3,[self.name, productName]);
		var actionName = "DOCUMENT_COMPUTE_V3";
		var actionParams = [self.name, productName];
		connectService.exeAction({
			    	actionName: actionName,
			    	actionParams: actionParams,
			    	data: dataSet,
			    	resourceURL: resourceURL
			    }).then(function(data){
					 if(self.isSuccess(data)){	//validate success
						 //self.updateDetailData_V3(data);
						 self.convertElementsToArrayInElement_V3(data);
						 self.detail = data;
					 } else{	//validate fail
						 self.mergeErrorToDetail(self.findElementInElement_V3(data, ['ipos-response:response-message']));
					 }

					deferred.resolve(data);	
			    });
		/*self.ajax.postRuntime(resourceURL, actionUrl, dataSet, function(data){					
			if(self.isSuccess(data)){	//validate success
				 //self.updateDetailData_V3(data);
				 self.detail = data;
			 } else{	//validate fail
				 self.mergeErrorToDetail(self.findElementInElement_V3(data, ['ipos-response:response-message']));
			 }

			deferred.resolve(data);			
		});*/
		return deferred.promise;
	};
	
	IllustrationCoreService.prototype.refreshIllustration = function(resourceURL) {
		var self = this;
		var deferred = self.$q.defer();
		self.detail = self.extractUiDataSet_V3(self.detail);
		self.refresh_V3(resourceURL, self.productName).then(function(data){
			if(self.isSuccess(data)){	//validate success
				 //self.updateDetailData_V3(data);
				 self.detail = data;
			 } else{	//validate fail
				 self.mergeErrorToDetail(self.findElementInElement_V3(data, ['ipos-response:response-message']));
			 }

			deferred.resolve(data);		
		});
		return deferred.promise;
    }
	
	/**
	 * override to update an existing illustration with new input data
	 * @param boValidate
	 * @returns {promise}
	 * <dl>
	 * <dt>Resolved with:</dt>
	 * <dd>illustration updated detail</dd>
	 * <dt>Rejected with:</dt>
	 * <dd>not defined</dd>	
	 * </dl>
	 */
	IllustrationCoreService.prototype.update = function(boValidate){
		var self = this;	 
		var deferred = self.$q.defer();
		detailCoreService.ListDetailCoreService.prototype.saveDetail.call(self, boValidate, function(data){
			var person = self.findElementRefTypeInDetail([], 'policyOwner');
			var refUid = undefined;
			if(person.refUid != undefined) {
				refUid = person.refUid;
			}
			// In case create from salecase or factfind
			var preDefine = workspaceService.getPreDefine(commonService.CONSTANTS.MODULE_NAME.ILLUSTRATION);
			if (self.commonService.hasValue(preDefine.fnAfterCreateIllustration)){
				preDefine.fnAfterCreateIllustration.call(self, preDefine.saleCaseUid, self.detail.uid,refUid);
			}else if (self.commonService.hasValue(preDefine.fnAfterEditIllustration)){
				preDefine.fnAfterEditIllustration.call(self, preDefine.saleCaseUid, self.detail.uid,refUid);
			}else{
				//do somthing else
				deferred.resolve(data);
			}
		});
		return  deferred.promise;
	};
	
	IllustrationCoreService.prototype.update_V3 = function(){
		var self = this;
		var deferred = self.$q.defer();
		detailCoreService.ListDetailCoreService.prototype.saveDetail_V3.call(self, true, function(data){
//			self.items = list;
			//self.loadProspectList(self.items);
			commonService.showGlobalMessage(appService.getI18NText('workspace.save.success'));
			deferred.resolve(data);
		}, function(message){
			commonService.showGlobalMessage(message, "danger");
		});
		return  deferred.promise;
	};
	
	/**
	 * Load product type list for add a new illustration
	 * @returns {promise}
	 * <dl>
	 * <dt>Resolved with:</dt>
	 * <dd>list of product type</dd>
	 * <dt>Rejected with:</dt>
	 * <dd>not defined</dd>	
	 * </dl>
	 */
	IllustrationCoreService.prototype.loadProductTypeList = function(){
		var self = this;
		var deferred = self.$q.defer();
		self.cacheService.getItems(self.name, commonService.CONSTANTS.DOCTYPE.PACKAGEBUNDLE, function(data){
			self.illustrationTypes = data;
			deferred.resolve(data);
		});
		return  deferred.promise;
	};
	
	/**
	 * Compute an illustration
	 * If validate successfully, return resolved promise. Otherwise return rejected promise.
	 * @returns {promise} 
	 * <dl>
	 * <dt>Resolved with:</dt>
	 * <dd>computed document detail</dd>
	 * <dt>Rejected with:</dt>
	 * <dd>validation error message</dd>	
	 * </dl>
	 */
	IllustrationCoreService.prototype.computeIllustration = function(){
		var self = this;
		var deferred = self.$q.defer();
		//Note: 'productInputs' is an element of self.detail
		var dataSet = self.extractUiDataSet(self.detail);
		var url = self.commonService.getUrl(self.commonService.urlMap.ILLUSTRATION_COMPUTE);
		self.ajax.post(url, dataSet).success(function(dtoResult){//data = illustration
			self.detail = dtoResult;
			
			//check if valid
			var valid = self.checkValid(dtoResult);
			if (valid.validResult){
				//do something
				deferred.resolve(dtoResult);
			}else{
				deferred.reject(valid.validMessage);
			}
		});
		return  deferred.promise;
	};
	
	/**
	 * Validate and issue an illustration.
	 * Refresh the item list if success. Otherwise, throw an error message.
	 * @returns {promise}
	 * <dl>
	 * <dt>Resolved with:</dt>
	 * <dd>computed document detail</dd>
	 * <dt>Rejected with:</dt>
	 * <dd>validation error message</dd>	
	 * </dl>
	 */
	IllustrationCoreService.prototype.issueIllustration = function(){
		var self = this;
		var deferred = self.$q.defer();
		
		var dataSet = self.extractUiDataSet(self.detail);
		var url = self.commonService.getUrl(self.commonService.urlMap.ILLUSTRATION_ISSUE);
		self.ajax.post(url, dataSet).success(function(result){//data = illustration
			//check if valid
			var valid = self.checkValid(result);
			if (valid.validResult){
				self.originalDetail = result;
				self.detail = angular.copy(result);
				
				var detailUid = result.uid;
				self.refreshItemInList(detailUid, function(){
					deferred.resolve(result);
					//show somethings
				});
			}else{
				self.detail = result;
				deferred.reject(valid.validMessage);
				//show somethings
			}
		});
		return  deferred.promise;
	};
	
	/**
	 * Compute an illustration and prepare data on user session for generating pdf afterward
	 * Refresh the item list if success. Otherwise, throw an error message.
	 * @returns {promise}
	 * <dl>
	 * <dt>Resolved with:</dt>
	 * <dd>computed document detail</dd>
	 * <dt>Rejected with:</dt>
	 * <dd>validation error message</dd>	
	 * </dl>
	 */
	IllustrationCoreService.prototype.generateIllustration = function(){
		var self = this;
		var deferred = self.$q.defer();
		
		var dataSet = self.extractUiDataSet(self.detail);
		var url = self.commonService.getUrl(self.commonService.urlMap.ILLUSTRATION_GENERATE, [self.name]);
		self.ajax.post(url, dataSet).success(function(resultDto){//data = illustration
			if(resultDto.status !== 'ISSUED'){
				//check if valid
				var valid = self.checkValid(resultDto);
				if (valid.validResult){
					self.clearErrorsInElement(self.detail);
					self.computed = true;
					deferred.resolve(resultDto);
				}else{
					self.detail = resultDto;
					self.computed = true;
					deferred.reject(valid.validMessage);
				}
			}
			else deferred.resolve(resultDto);
		});
		return  deferred.promise;
	};
	
	/**
	 * Compute an illustration
	 * If validate successfully, return resolved promise. Otherwise return rejected promise.
	 * @returns {promise} 
	 * <dl>
	 * <dt>Resolved with:</dt>
	 * <dd>computed document detail</dd>
	 * <dt>Rejected with:</dt>
	 * <dd>validation error message</dd>	
	 * </dl>
	 */
	IllustrationCoreService.prototype.computeTagsIllustration = function(tags, srcElement){
		var self = this;
		var deferred = self.$q.defer();
		//Note: 'productInputs' is an element of self.detail
		var dataSet = self.extractUiDataSet(self.detail);
		var url = self.commonService.getUrl(self.commonService.urlMap.DOCUMENT_COMPUTE_TAGS, [self.name, tags]);
		self.ajax.post(url, dataSet).success(function(dtoResult){//data = illustration
			self._findProperty(self.detail, "validate").value = self._findProperty(dtoResult, "validate").value;
			if(commonService.hasValue(srcElement))
				self.mergeElement(dtoResult, srcElement);
			else{
				self.mergeElement(dtoResult, self.detail);
			}
			//check if valid
			var valid = self.checkValid(dtoResult);
			if (valid.validResult){
				//do something
				deferred.resolve(dtoResult);
			}else{
				deferred.reject(valid.validMessage);
			}
		});
		return  deferred.promise;
	};
	
	/**
	 * Compute Default an illustration
	 * If validate successfully, return resolved promise. Otherwise return rejected promise.
	 * @returns {promise} 
	 * <dl>
	 * <dt>Resolved with:</dt>
	 * <dd>computed document detail</dd>
	 * <dt>Rejected with:</dt>
	 * <dd>validation error message</dd>	
	 * </dl>
	 */
	IllustrationCoreService.prototype.computeIllustrationDefault = function(tags){
		var self = this;
		var deferred = self.$q.defer();
		//Note: 'productInputs' is an element of self.detail
		var dataSet = self.extractUiDataSet(self.detail);
		var url = self.commonService.getUrl(self.commonService.urlMap.ILLUSTRATION_COMPUTE_DEFAULT_TAGS, tags);
		self.ajax.post(url, dataSet).success(function(dtoResult){//data = illustration
			self.mergeElement(dtoResult, self.detail);
			deferred.resolve(dtoResult);
		});
		return  deferred.promise;
	};
	
	IllustrationCoreService.prototype.isIssuedDisabled = function(){
		var self = this;
		if (self.detail === undefined) return true;//disabled
		
		var rs = self.isDisabled() || self.isIssued();
		return rs;
	};
	
	IllustrationCoreService.prototype.isIssued = function(){
		var self = this;
		//check the status of Issue
		if (!commonService.hasValue(self.detail)) return false;
		var status = self.detail.status;
		var rs = (status == "ISSUED");
		return rs;
	};
	
	/**
	 * create a new illustration with the same content as the current but different identity
	 * @return {promise}
	 * <dl>
	 * <dt>Resolved with:</dt>
	 * <dd>document detail</dd>
	 * <dt>Rejected with:</dt>
	 * <dd>error message</dd>	
	 * </dl>
	 */
	IllustrationCoreService.prototype.cloneIllustration = function(){
		var self = this;
		var deferred = self.$q.defer();
		var dataSet = self.extractUiDataSet(self.detail);
		var url = self.commonService.getUrl(self.commonService.urlMap.ILLUSTRATION_CLONE);
		self.ajax.post(url, dataSet).success(function(result){
			//update detailUid for new item
			self.originalDetail = result;
			self.detail = angular.copy(result);
			
			var detailUid = result.uid;
			self.refreshItemInList(detailUid, function(){
				deferred.resolve(result);
			});
		});	
		return  deferred.promise;
	};
	
	IllustrationCoreService.prototype.initializeIllustrationFromSalecase = function(productTypeId, refType, refUid, boValidate){
		var self = this;	 
		var deferred = self.$q.defer();
		detailCoreService.ListDetailCoreService.prototype.addModelWithProspectIds.call(self, productTypeId, refType, refUid, function(data){
			//do somthing else
			deferred.resolve(data);
		});
		return  deferred.promise;
	};
	
	IllustrationCoreService.prototype.isSubmittedStatus = function(data) {		
		var self = this;
		var data2 = data != undefined ? data:self.detail;
		return (commonService.hasValueNotEmpty(data2) && 
				(data2.status == commonService.CONSTANTS.STATUS.SUBMITTED ||
				 data2.status == commonService.CONSTANTS.STATUS.SUBMITTING || 
				 data2.status == commonService.CONSTANTS.STATUS.ACCEPTED || 
				 data2.status == commonService.CONSTANTS.STATUS.NON_SUBMITTED));
	};
	
	/**
	 * Remove a rider in BI
	 */
	IllustrationCoreService.prototype.removeItemFromListInDetailWithCompute = function(elementsChain,item, tags){
		var self = this;
		self.removeItemFromListInDetail(elementsChain, item);
		var deferred = self.$q.defer();
		self.computeTagsIllustration(tags).then(function(result){
			deferred.resolve();
		});
		return  deferred.promise;
	};
	/**
	 * Add a new rider for BI
	 */
	IllustrationCoreService.prototype.addItemToListInDetailHierarchyWithCompute = function(elementsChain, tags, obj){
		var self = this;
		var deferred = self.$q.defer();
		var item = self.addItemToListInDetailHierarchy(elementsChain); 
		if(obj !== undefined){
			var riderType =  self.findPropertyInElement(item, obj.name, 'value');
			riderType.value = obj.value;
		}
		self.computeIllustrationDefault(tags).then(function(result){
			deferred.resolve(item);
		});
		return  deferred.promise;
	};
	IllustrationCoreService.prototype.getSumInsuredLabel = function(productType) {
		var n = productType.search("presto");
		if (n<0){
			return appService.getI18NText('workspace.label.sumAssured');
		}else{
			return appService.getI18NText('workspace.label.faceValue');
		}
	};	
	IllustrationCoreService.prototype.cleanValueRiderNotChecked = function() {
		var self = this;
		var riders = self.findElementInDetail(['Riders']).elements;
		angular.forEach(riders, function(rider){
			var riderCode = self.findPropertyInElement(rider,['Rider_Type'], 'value').value;
//			if(riderCode == riderType){
				var components = self.findElementInElement(rider,['Components']).elements;
				angular.forEach(components, function(component){
					if(self.findPropertyInElement(component,['Component_Checked'],'value').value == 'N'){
						var compSumAssured = self.findPropertyInElement(component,['Component_Sum_Assured'],'value');
						compSumAssured.value = '';
					}else{
						var compSumAssured = self.findPropertyInElement(component,['Component_Sum_Assured'],'value');
						compSumAssured.value = compSumAssured.value.replace(/\,/g, '');
					}
				});
//			}
		});
	};
	
	IllustrationCoreService.prototype.getProductList_V3 = function() {
		 var self = this;
		 var deferred = self.$q.defer();
		 var url = commonService.getUrl(commonService.urlMap.PRODUCT_LIST_V3);
		 self.ajax.get_V3(url).success(function(data){
			 self.docProductList = data;
			 deferred.resolve();	
		 });
		 return deferred.promise;
	};
	
	// IllustrationCoreService.prototype.computeIllustration_V3 = function(){
	// 	var self = this;
	// 	var deferred = self.$q.defer();
	// 	//Note: 'productInputs' is an element of self.detail
	// 	var dataSet = self.extractUiDataSet_V3(self.detail);
	// 	//var dataSet = self.detail;
	// 	var url = self.commonService.getUrl(self.commonService.urlMap.DOCUMENT_COMPUTE_V3, [self.name]);
	// 	self.ajax.post_V3(url, dataSet).success(function(result){//data = illustration
	// 		/*self.mergeElement(dtoResult, self.detail);*/
	// 		self.detail = result;
	// 		deferred.resolve(result);
	// 	});
	// 	return  deferred.promise;
	// };
	
	//Check and change refStatus of Prospect before save Quotation
	IllustrationCoreService.prototype.checkRefStatusProspect = function(resourceURL){
		var self = this;
		var deferred = $q.defer();
		if(this.productName=='motor-private-car'){
			if(commonService.hasValueNotEmpty(self.findJsonPathInItem(self.detail, '$..illustration-motor-private-car:DrivingInformation')['@refUid'])){
				prospectCoreService.findDocument_V3(resourceURL, self.findJsonPathInItem(self.detail, '$..illustration-motor-private-car:DrivingInformation')['@refUid']).then(function(data){
					if(self.findJsonPathInItem(self.detail, '$..illustration-motor-private-car:Salutation').Value
		    				!= self.findJsonPathInItem(prospectCoreService.detail, '$..ipos-prospect:Title').Value){
						self.findJsonPathInItem(self.detail, '$..illustration-motor-private-car:Salutation')['@refStatus']='dirty';
					}
					
					if(self.findJsonPathInItem(self.detail, '$..illustration-motor-private-car:FullName').$
		    				!= self.findJsonPathInItem(prospectCoreService.detail, '$..ipos-prospect:FullName').$){
						self.findJsonPathInItem(self.detail, '$..illustration-motor-private-car:FullName')['@refStatus']='dirty';
					}
		    					
					
					if(self.findJsonPathInItem(self.detail, '$..illustration-motor-private-car:DateOfBirth').$
							!= self.findJsonPathInItem(prospectCoreService.detail, '$..ipos-prospect:BirthDate').$){
						self.findJsonPathInItem(self.detail, '$..illustration-motor-private-car:DateOfBirth')['@refStatus']='dirty';
					}
					
					/*if(self.findJsonPathInItem(self.detail, '$..illustration-motor-private-car:NewICNo').$
							!= self.findJsonPathInItem(prospectCoreService.detail, '$..ipos-prospect:NewICNo').$){
						self.findJsonPathInItem(self.detail, '$..illustration-motor-private-car:NewICNo')['@refStatus']='dirty';
					}*/
					
					if(self.findJsonPathInItem(self.detail, '$..illustration-motor-private-car:MaritalStatus').Value
							!= self.findJsonPathInItem(prospectCoreService.detail, '$..ipos-prospect:MarStat').Value){
						self.findJsonPathInItem(self.detail, '$..illustration-motor-private-car:MaritalStatus')['@refStatus']='dirty';
					}
					
					if(	self.findJsonPathInItem(self.detail, '$..illustration-motor-private-car:Occupation').Value
							!= self.findJsonPathInItem(prospectCoreService.detail, '$..ipos-prospect:Occupation').Value){
						self.findJsonPathInItem(self.detail, '$..illustration-motor-private-car:Occupation')['@refStatus']='dirty';
					}
					
					if(self.findJsonPathInItem(self.detail, '$..illustration-motor-private-car:Gender').Value
							!= self.findJsonPathInItem(prospectCoreService.detail, '$..ipos-prospect:Gender').Value){
						self.findJsonPathInItem(self.detail, '$..illustration-motor-private-car:Gender')['@refStatus']='dirty';
					}
					
					if(self.findJsonPathInItem(self.detail, '$..illustration-motor-private-car:SmokerStat').Value
							!= self.findJsonPathInItem(prospectCoreService.detail, '$..ipos-prospect:SmokerStat').Value){
						self.findJsonPathInItem(self.detail, '$..illustration-motor-private-car:SmokerStat')['@refStatus']='dirty';
					}
					
					if(self.findJsonPathInItem(self.detail, '$..illustration-motor-private-car:YearDrivingLicenseObtained').$
							!= self.findJsonPathInItem(prospectCoreService.detail, '$..ipos-prospect:YearDrivingLicenseObtained').$){
						self.findJsonPathInItem(self.detail, '$..illustration-motor-private-car:YearDrivingLicenseObtained')['@refStatus']='dirty';				
					}
					
					/*if(self.findJsonPathInItem(self.detail, '$..illustration-motor-private-car:OldICNo').$
							!= self.findJsonPathInItem(prospectCoreService.detail, '$..ipos-prospect:OldICNo').Value){
						self.findJsonPathInItem(self.detail, '$..illustration-motor-private-car:OldICNo')['@refStatus']='dirty';
					}*/
					deferred.resolve(data);
				});
				return  deferred.promise;
			}else{
				deferred.resolve();
				return  deferred.promise;
			}
		}
		else if(this.productName=='motor-private-car-m-as'){
			if(commonService.hasValueNotEmpty(self.findJsonPathInItem(self.detail, '$..illustration-motor-private-car-m-as:DrivingInformation')['@refUid'])){
				prospectCoreService.findDocument_V3(resourceURL, self.findJsonPathInItem(self.detail, '$..illustration-motor-private-car-m-as:DrivingInformation')['@refUid']).then(function(data){
					if(self.findJsonPathInItem(self.detail, '$..illustration-motor-private-car-m-as:DrivingInformation.illustration-motor-private-car-m-as:Salutation').Value
		    				!= self.findJsonPathInItem(prospectCoreService.detail, '$..ipos-prospect:Title').Value){
						self.findJsonPathInItem(self.detail, '$..illustration-motor-private-car-m-as:DrivingInformation.illustration-motor-private-car-m-as:Salutation')['@refStatus']='dirty';
					}
					
					if(self.findJsonPathInItem(self.detail, '$..illustration-motor-private-car-m-as:DrivingInformation.illustration-motor-private-car-m-as:FullName').$
		    				!= self.findJsonPathInItem(prospectCoreService.detail, '$..ipos-prospect:FullName').$){
						self.findJsonPathInItem(self.detail, '$..illustration-motor-private-car-m-as:DrivingInformation.illustration-motor-private-car-m-as:FullName')['@refStatus']='dirty';
					}
		    					
					
					if(self.findJsonPathInItem(self.detail, '$..illustration-motor-private-car-m-as:DrivingInformation.illustration-motor-private-car-m-as:BirthDate').$
							!= self.findJsonPathInItem(prospectCoreService.detail, '$..ipos-prospect:BirthDate').$){
						self.findJsonPathInItem(self.detail, '$..illustration-motor-private-car-m-as:DrivingInformation.illustration-motor-private-car-m-as:BirthDate')['@refStatus']='dirty';
					}
					
					if(self.findJsonPathInItem(self.detail, '$..illustration-motor-private-car-m-as:DrivingInformation.illustration-motor-private-car-m-as:MaritalStatus').Value
							!= self.findJsonPathInItem(prospectCoreService.detail, '$..ipos-prospect:MarStat').Value){
						self.findJsonPathInItem(self.detail, '$..illustration-motor-private-car-m-as:DrivingInformation.illustration-motor-private-car-m-as:MaritalStatus')['@refStatus']='dirty';
					}
					
					if(	self.findJsonPathInItem(self.detail, '$..illustration-motor-private-car-m-as:DrivingInformation.illustration-motor-private-car-m-as:Occupation').Value
							!= self.findJsonPathInItem(prospectCoreService.detail, '$..ipos-prospect:Occupation').Value){
						self.findJsonPathInItem(self.detail, '$..illustration-motor-private-car-m-as:DrivingInformation.illustration-motor-private-car-m-as:Occupation')['@refStatus']='dirty';
					}
					
					if(self.findJsonPathInItem(self.detail, '$..illustration-motor-private-car-m-as:DrivingInformation.illustration-motor-private-car-m-as:Gender').Value
							!= self.findJsonPathInItem(prospectCoreService.detail, '$..ipos-prospect:Gender').Value){
						self.findJsonPathInItem(self.detail, '$..illustration-motor-private-car-m-as:DrivingInformation.illustration-motor-private-car-m-as:Gender')['@refStatus']='dirty';
					}
					
					if(self.findJsonPathInItem(self.detail, '$..illustration-motor-private-car-m-as:DrivingInformation.illustration-motor-private-car-m-as:YearDrivingLicenseObtained').$
							!= self.findJsonPathInItem(prospectCoreService.detail, '$..ipos-prospect:YearDrivingLicenseObtained').$){
						self.findJsonPathInItem(self.detail, '$..illustration-motor-private-car-m-as:DrivingInformation.illustration-motor-private-car-m-as:YearDrivingLicenseObtained')['@refStatus']='dirty';				
					}
					
					/*var Ids = self.findJsonPathInItem(self.detail, '$..illustration-motor-private-car-m-as:DrivingInformation.illustration-motor-private-car-m-as:IDs.illustration-motor-private-car-m-as:ID');
					for( var i = 0; i< Ids.length; i++ ){
						if(Ids[i]['illustration-motor-private-car-m-as:IDType']['Value']
								!= self.findJsonPathInItem(prospectCoreService.detail, '$..ipos-prospect:YearDrivingLicenseObtained').$){
							self.findJsonPathInItem(self.detail, '$..illustration-motor-private-car-m-as:DrivingInformation.illustration-motor-private-car-m-as:YearDrivingLicenseObtained')['@refStatus']='dirty';				
						}
						if(self.findJsonPathInItem(self.detail, '$..illustration-motor-private-car-m-as:DrivingInformation.illustration-motor-private-car-m-as:YearDrivingLicenseObtained').$
								!= self.findJsonPathInItem(prospectCoreService.detail, '$..ipos-prospect:YearDrivingLicenseObtained').$){
							self.findJsonPathInItem(self.detail, '$..illustration-motor-private-car-m-as:DrivingInformation.illustration-motor-private-car-m-as:YearDrivingLicenseObtained')['@refStatus']='dirty';				
						}
					}*/
					
					deferred.resolve(data);
				});
				return  deferred.promise;
			}else{
				deferred.resolve();
				return  deferred.promise;
			}
		}
		
		
	};
	
	/**
	  * Check if Vehicle number in Blacklisted
	  * @param {String} Vehicle Number
	  */
	IllustrationCoreService.prototype.checkVehicleInBlacklisted = function(resourceURL,vehicleNo) {
		 var deferred = $q.defer();
		 var self = this;
		 var actionUrl =  commonService.getUrl(commonService.urlMap.CHECK_BLACKLIST,[vehicleNo]);
		 
		 if ('' == vehicleNo.trim()) {
		     deferred.resolve(false);
		 } else {
		 		connectService.exeAction({
				    	actionName: "CHECK_BLACKLIST",
				    	actionParams: [vehicleNo],
				    	resourceURL: resourceURL
				    }).then(function(data){
						 	var result = self.findElementInElement_V3(data,['isBlackList']) == "false" ? false: true;
    						deferred.resolve(result);		
				    });
    		 // self.ajax.getRuntime(resourceURL, actionUrl, function(data){
    			//  var result = self.findElementInElement_V3(data,['isBlackList']) == "false" ? false: true;
    			//  deferred.resolve(result);	
    		 // });
		 }
		 return  deferred.promise;
	 };	
	 
	 /**
	  * Check if Vehicle number in Blacklisted
	  * @param {String} Vehicle Number
	  *
	  */
	 IllustrationCoreService.prototype.getMarketValueAndNCD = function(resourceURL,vehicleNo) {
		 var deferred = $q.defer();
		 var self = this;
		 var actionUrl =  commonService.getUrl(commonService.urlMap.CHECK_ISM,[vehicleNo]);
		 
		 self.ajax.getRuntime(resourceURL, actionUrl, function(data){
			 deferred.resolve(data);	
		 });
		 return  deferred.promise;
	 };	
	 
	 /**
	  * Check user login
	  * @author dnguyen98
	  * @param resourceURL
	  */
	 IllustrationCoreService.prototype.checkUserLogin = function(resourceURL) {
		 var deferred = $q.defer();
		 var self = this;
		 var directSaleUser = undefined;
		 try {
			 directSaleUser = directSaleUserName;
		 } catch(e) {}
		 if (directSaleUser || window.cordova) {
			 deferred.resolve(true);	
		 } else {
			 connectService.exeAction({
			    	actionName: "CHECK_USER_LOGIN",
			    	actionParams: "",
			    	resourceURL: resourceURL
			    }).then(function(data){
		    		if(data == "null" || data.errCode == 101) // data is string "null" for web-portal or errorcode is code(101) for android App
		    			deferred.resolve(false);
		    		else
		    			deferred.resolve(data);						
			    });
		 }
		 return deferred.promise;
	 }
 		 
	 
	 /**
	  * import data from excel file to doc illustration (insured on Group-travel)
	  * @author vduong5
	  * @param resourceURL
	  */
	 IllustrationCoreService.prototype.updateDocFromFile = function(resourceURL, resourceUid) {
		 var deferred = $q.defer();
		 var self = this;
		 //var dataSet = self.extractUiDataSet_V3(self.detail);
		 var dataSet = self.detail;
		 var product = self.findElementInDetail_V3(['Product']);
 		 connectService.exeAction({
		    	actionName: "UPDATE_DOC_FROM_FILE",
		    	actionParams: [self.name, resourceUid, product],
		    	data: dataSet,
		    	resourceURL: resourceURL
		    }).then(function(data){
		    	self.convertElementsToArrayInElement_V3(data);
	    		deferred.resolve(data);						
		    });
 		 return  deferred.promise;
	 };	
	
	return new IllustrationCoreService($q, ajax, $location, appService, cacheService, detailCoreService, commonService);
}]);

