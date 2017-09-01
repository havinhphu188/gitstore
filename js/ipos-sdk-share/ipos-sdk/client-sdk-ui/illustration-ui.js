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

var illustrationUIModule = angular.module('illustrationUIModule',['illustrationModule', 'commonUIModule'])
.service('illustrationUIService', ['$q', 'ajax', '$location', 'appService', 'cacheService', 'commonUIService', 'illustrationCoreService', 'commonService', 'workspaceService', 'policyUIService',
	function($q, ajax, $location, appService, cacheService, commonUIService, illustrationCoreService, commonService, workspaceService, policyUIService){

	function IllustrationUIService($q, ajax, $location, appService, cacheService, illustrationCoreService, commonService){
		illustrationCoreService.constructor.call(this, $q, ajax, $location, appService, cacheService, illustrationCoreService.detailCoreService, commonService);
		this.extraDetail = new IllustrationUIExtraDetail();
		this.itemsOfGroup4 = undefined;
		this.staredItemsOfGroup4 = undefined;
		this.listOfRecentItemsGroupOf4 = undefined;
		this.attentionRequiredItemsList = undefined;
		this.attentionRequiredItemsGroupOf4 = undefined;
		this.salecaseProspectUids = [];
		this.wsteps = [];
		this.lazyChoiceList = [];
		this.lazyChoiceListLife = undefined;
	};
	inherit(illustrationCoreService.constructor, IllustrationUIService);
	extend(commonUIService.constructor, IllustrationUIService);
	
	function IllustrationUIExtraDetail(){
		illustrationCoreService.detailCoreService.ExtraDetail.call(this);//super constructor
		
		this.selectedProductUid = undefined;
		
		this.selection = {
			selectedProspect:{
				type: null,//policyowner, lifeassuredmain, beneficiary...
				newUid : null,
				oldUid: null,
				prospectMeta: null, //meta data of new chosen prospect
				newlyCreated: false,
				newlyUpdated: false
			},
			prospects: []
		};
	}
	inherit(illustrationCoreService.detailCoreService.ExtraDetail, IllustrationUIExtraDetail);
	
	IllustrationUIService.prototype.edit = function(resourceURL){
		var self = this;
		var deferred = self.$q.defer();
		illustrationCoreService.detailCoreService.ListDetailCoreService.prototype.getDetail_V3.call(self,resourceURL,true, function(data){
			commonService.showGlobalMessage(appService.getI18NText('workspace.save.success'));
			deferred.resolve(data);
		}, function(message){
			commonService.showGlobalMessage(message, "danger");
		});
		return  deferred.promise;
	};
	
	/**
	 * Override parent method to load prospect list after loading an illustration
	 * @param illustrationId
	 * @returns
	 */
	IllustrationUIService.prototype.loadDetail = function(illustrationId){
		var self = this;	 
		var deferred = self.$q.defer();
		var moduleName = commonService.CONSTANTS.MODULE_NAME.PROSPECT;
		illustrationCoreService.loadDetail.call(self, illustrationId).then(function(detail){
			var productType = self.getProductLogicName(detail);
//			self.extraDetail.form = self.getForm(productType);
			self.prepareList(moduleName);//call detail core function
			deferred.resolve(detail);
		});
		return  deferred.promise;
	};
	
	IllustrationUIService.prototype.fillIllustrationList = function (list) {
		var self = this;
		/*var tempList = list.slice(0);
		tempList.unshift("");*/
//		self.itemsOfGroup4 = self.buildDocumentGroupOf4(list);
		self.staredItemsOfGroup4 = self.buildDocumentGroupOf4(self.filterStarredDocument(list));
//		self.listOfRecentItemsGroupOf4 = self.buildDocumentGroupOf4(tempList);
		self.listOfRecentItemsGroupOf4 = self.buildDocumentGroupOf4(list);
		self.attentionRequiredItemsList= self.filterAttentionRequiredItemsList(list);
		self.attentionRequiredItemsGroupOf4 = self.buildDocumentGroupOf4(self.attentionRequiredItemsList);
		
		// only show first 20 documents for each list
		self.staredItemsOfGroup4 = self.staredItemsOfGroup4.slice(0,5); 
		self.listOfRecentItemsGroupOf4 = self.listOfRecentItemsGroupOf4.slice(0,5);
		self.attentionRequiredItemsGroupOf4 = self.attentionRequiredItemsGroupOf4.slice(0,5);
	};
	
	/**
	 * Override parent method to grouping returned list 
	 * @param illustrationId
	 * @returns
	 */
	IllustrationUIService.prototype.loadList = function(lastUpdatedFlag, subordinateUid){
		var self = this;
		var deferred = self.$q.defer();
		illustrationCoreService.loadList.call(self, lastUpdatedFlag, subordinateUid).then(function(list){
			self.fillIllustrationList(list);			
			deferred.resolve(list);
		});
		return  deferred.promise;
	};
		
	IllustrationUIService.prototype.updateExtraDetail = function(){
		var self = this;
		self.extraDetail.selectedProductUid = self.detail.packageBundle;	 
	};
	
	IllustrationUIService.prototype.getIllustrationLazyList=  function (resourceURL,productName){
		var self = this;
		var deferred = $q.defer();
		if (self.lazyChoicelist == undefined){
			self.lazyChoicelist = [];
		};
		if(self.lazyChoiceList[productName] == undefined) {						
				self.getLazyChoiceListByModuleAndProduct_V3(resourceURL, productName).then(function(data) {
				self.translateNodes(productName,data);
				self.lazyChoiceList[productName] = data;				
				deferred.resolve(data);
			});   		
		}else{
			deferred.resolve(self.lazyChoiceList[productName]);
		}
		return deferred.promise;
		
    };
    
   IllustrationUIService.prototype.translateNodes=function(productName, data){
	   	var self = this;
    	if (productName == 'motor-private-car-m-as'|| productName == 'motor-private-car-m-ds'){
    		self.translateLazyListField(data,'SICurrency','v3.motor.privateCarM.sICurrency.');
    		self.translateLazyListField(data,'BillingCurrency','v3.motor.privateCarM.billingCurrency.');
    		self.translateLazyListField(data,'VehicleClass','v3.motor.privateCarM.vehicleClass.');
    		self.translateLazyListField(data,'CoverageType','v3.motor.privateCarM.CoverageType.');
    		self.translateLazyListField(data,'CIType','v3.motor.privateCarM.cIType.');
    		self.translateLazyListField(data,'Body','v3.motor.privateCarM.body.');
    		self.translateLazyListField(data,'SafetyCode','v3.motor.privateCarM.safetyCode.');
    		self.translateLazyListField(data,'VarianSeriesTransmission','v3.illustration.motor.sompo.varianseriestransmission.');
    		self.translateLazyListField(data,'Garage','v3.motor.privateCarM.garage.');
    		self.translateLazyListField(data,'TrailerMakeModel','v3.motor.privateCarM.trailerMakeModel.');
    		self.translateLazyListField(data,'ExcessType','v3.motor.privateCarM.excessType.');
    		self.translateLazyListField(data,'MakeOrModel','v3.illustration.motor.sompo.makeormodel.');
    		self.translateLazyListField(data,'I_MDOccupation','v3.pnc.occupation.enum.');
    		self.translateLazyListField(data,'I_ODOccupation','v3.pnc.occupation.enum.');
    		self.translateLazyListField(data,'I_MDGender','v3.gender.enum.');
    		self.translateLazyListField(data,'I_ODGender','v3.gender.enum.');
    		self.translateLazyListField(data,'I_MDIDType','v3.application.motor.iDType.');
    		self.translateLazyListField(data,'I_ODIDType','v3.application.motor.iDType.');
    		self.translateLazyListField(data,'I_MDMaritalStatus','v3.pnc.maritalStatus.enum.');
    		self.translateLazyListField(data,'I_ODMaritalStatus','v3.pnc.maritalStatus.enum.');
    	}
    	else if(productName == 'term-life-protect-as'){
    		self.translateLazyListField(data,'I_SmokerStat','v3.smoker.enum.');
    		self.translateLazyListField(data,'I_Gender','v3.gender.enum.');
    		self.translateLazyListField(data,'I_PaymentMode','v3.payment.frequency.enum.');
    		self.translateLazyListField(data,'I_Relationship','v3.illustration.life.relationship.');
    	}
    	else if(productName == 'personal-accident'){
    		self.translateLazyListField(data,'Plan','v3.personal-accident.plan.enum.');
    		self.translateLazyListField(data, 'PACountry','v3.personal-accident.country.enum.');
    		self.translateLazyListField(data,'GeographicCoverage','v3.personal-accident.geographic-coverage.enum.');
    		self.translateLazyListField(data,'MIOccupation','v3.personal-accident.occupation.enum.');
    	}
    };
		
	/**
	 * Note This method should apply to the current detail data (not pass 
	 * argument data to this method) because we want to reuse some methods 
	 * which are run on current detail data (e.g. self.selectPolicyOwner()) 
	 */
	IllustrationUIService.prototype.applyPreDefineData = function(){
		var self = this;
		var preDefine = workspaceService.getPreDefine(commonService.CONSTANTS.MODULE_NAME.ILLUSTRATION);
	
		//Prospect (PreDefine for adding new
		var preDefineProspectUid = preDefine.prospectUid;
		preDefine.prospectUid = undefined;//after using, clear it.
		if (commonService.hasValueNotEmpty(preDefineProspectUid)){
			self.extraDetail.selection.selectedProspect = {
				type:'policyOwner',
				newUid: preDefineProspectUid,
				oldUid: null
			};
			self.selectProspect();
		}
	};	
	
	/**
	 * After navigate to prospect screen to edit and now move back, 
	 * we need to refresh content of prospect in detail
	 */
	IllustrationUIService.prototype.updateProspect = function(){
		var self = this;
		var deferred = self.$q.defer();
		
		var selectedProspect = self.extraDetail.selection.selectedProspect;
		var refType = selectedProspect.type;
		if(!commonService.hasValueNotEmpty(refType)) return;
		var oldPersonUid = selectedProspect.oldUid;
		var newPersonUid = selectedProspect.newUid;
		selectedProspect.oldUid = newPersonUid;
		if (commonService.hasValueNotEmpty(newPersonUid)){
			if (!commonService.hasValueNotEmpty(oldPersonUid)) oldPersonUid = "null";
			var url = "illustration/refUid/update/" + newPersonUid;
			var dataSet = self.extractUiDataSet(self.detail);
			self.ajax.post(url, dataSet).success(function(detailDto){
				self.mergeElement(detailDto, self.detail);
				self.updateExtraDetail();
				deferred.resolve(detailDto);
			});
		};
		return  deferred.promise;
	};
	
	
	/**
	 * Check to see if user select a product type on add new illustration screen 
	 * @returns
	 */
	IllustrationUIService.prototype.isSelectedProduct = function(){
		var self = this;
		var rs = commonService.hasValueNotEmpty(self.extraDetail.selectedProductUid);
		return rs;
	};
	
	//ADD, EDIT & REMOVE PROSPECT ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	 * @param prospectField This method will open the screen to create new prospect.
	 * After saving that prospect, it will return back to this screen;l and then automatically set data from new prospect to an element of this illustration.
	 * That element is defined by @prospectField param. E.g: "policyOwner", or "lifeAssured"
	 */
	IllustrationUIService.prototype.addProspectForIllustration = function(){
		var self = this;
		
		var prospectPreDefine = workspaceService.getPreDefine(commonService.CONSTANTS.MODULE_NAME.PROSPECT);
		//The function will run after saving new prospect
		prospectPreDefine.fnAfterCreateProspect = function(prospectUid){
			//Promise for this callback function not outer function
			var deferred = self.$q.defer();
			
			if (commonService.hasValueNotEmpty(prospectUid)){
				var selectedProspect = self.extraDetail.selection.selectedProspect;
				var prospectType = selectedProspect.type;//policyOwner, AssuredMain,...
				var eleProspect = self.findElementRefTypeInDetail([], prospectType);
				selectedProspect.oldUid = eleProspect.refUid;
				selectedProspect.newUid = prospectUid;
				selectedProspect.newlyCreated = true;
				// no need to compute
				/*self.selectProspect(selectedProspect.type)
				.then(function(detailDto) {
					deferred.resolve(detailDto);
				});*/
				self.loadIndividualMetadata(commonService.CONSTANTS.MODULE_NAME.PROSPECT, selectedProspect.newUid).then(function(data){
					selectedProspect.prospectMeta = data;
					deferred.resolve();
				});
			}
			return  deferred.promise;
		};
	};
	
	/**
	 * @param prospectField This method will open the screen to create new prospect.
	 * After saving that prospect, it will return back to this screen;l and then automatically set data from new prospect to an element of this illustration.
	 * That element is defined by @prospectField param. E.g: "policyOwner", or "lifeAssured"
	 */
	IllustrationUIService.prototype.editProspectForIllustration = function(){
		var self = this;
		var prospectPreDefine = workspaceService.getPreDefine(commonService.CONSTANTS.MODULE_NAME.PROSPECT);
		
		//The function will run after saving new prospect
		prospectPreDefine.fnAfterEditProspect = function(prospectUid){
			//Promise for this callback function not outer function
			var deferred = self.$q.defer();
			
			if (commonService.hasValueNotEmpty(prospectUid)){
				var selectedProspect = self.extraDetail.selection.selectedProspect;
				var prospectType = selectedProspect.type;//policyOwner, AssuredMain,...
				var eleProspect = self.findElementRefTypeInDetail([], prospectType);
				selectedProspect.oldUid = eleProspect.refUid;
				selectedProspect.newUid = prospectUid;
				selectedProspect.newlyUpdated = true;
				self.updateProspect().then(function(detailDto){
					self.loadIndividualMetadata(commonService.CONSTANTS.MODULE_NAME.PROSPECT, selectedProspect.newUid).then(function(data){
						selectedProspect.prospectMeta = data;
						deferred.resolve();
					});
				});
			}
			return  deferred.promise;
		};
	};
	
	IllustrationUIService.prototype.backSaleCase = function(){
		var self = this;
		var preDefine = workspaceService.getPreDefine(commonService.CONSTANTS.MODULE_NAME.ILLUSTRATION);
		if (commonService.hasValue(preDefine.fnAfterCreateIllustration)){
			preDefine.fnAfterCreateIllustration.call(self, preDefine.saleCaseUid, undefined,undefined);
		}else if (commonService.hasValue(preDefine.fnAfterEditIllustration)){
			preDefine.fnAfterEditIllustration.call(self, preDefine.saleCaseUid, undefined,undefined);
		}
	};
	
	IllustrationUIService.prototype.backFactfind = function(){
		var self = this;
		var preDefine = workspaceService.getPreDefine(commonService.CONSTANTS.MODULE_NAME.ILLUSTRATION);
		if (commonService.hasValue(preDefine.fnAfterCreateIllustration)){
			preDefine.fnAfterCreateIllustration.call(self, preDefine.factfindUid, undefined,undefined);
		}else if (commonService.hasValue(preDefine.fnAfterEditIllustration)){
			preDefine.fnAfterEditIllustration.call(self, preDefine.factfindUid, undefined,undefined);
		}
	};
	
	IllustrationUIService.prototype.getSalecaseProspectUids = function(){
		return this.prospectUidsOfSalecase;
	};

	IllustrationUIService.prototype.getSalecaseDetail = function(illustrationUIService, salecaseUIService){
		// move the uids (myself, joint applicant and children) to a list so that it can be used for filtering the prospect list				
		var self = this;	 
		var deferred = self.$q.defer();

		var salecaseUid = illustrationUIService.detail.parentUid;	
		if(commonService.hasValueNotEmpty(salecaseUid)){
			salecaseUIService.loadDetail(salecaseUid).then(function(detail){
				deferred.resolve(detail);
			});
		}else{
//			throw new Error("Can't find salecaseUid");
			deferred.reject();
		}

		return deferred.promise;
	};
	
	// IllustrationUIService.prototype.loadSalecaseProspectsToSalecaseProspectUids = function(prospects){
	// 	this.salecaseProspectUids = [];
	// 	if (commonService.hasValue(prospects)) {
	// 		for (var i = 0; i < prospects.length; i++) {
	// 			if (commonService.hasValueNotEmpty(prospects[i].uid)) {
	// 				this.salecaseProspectUids.push(prospects[i].uid);
	// 			}
	// 		}
	// 	}
	// };
	IllustrationUIService.prototype.checkValidAndComputeByTags = function(tags){
		var self = this;
		var deferred = self.$q.defer();
		var tagsIn = tags.input;		//tagsIn is array
		var tagsOut = tags.output;	//tagsOut is arry
		var tagsClearTable = tags.clearTableIfError;	// tagsClearTable is array
		if (self.checkValidTags(tagsIn).validResult){
			if(self.isModelChanged()){
				self.cleanValueRiderNotChecked();
				self.computeTags([$.merge(tagsIn, tagsOut).toString()]).then(function(result){
					//success
					deferred.resolve(result);
				},function(result){	//error
					deferred.reject(result);
					self.clearValueByTags(tagsOut);
				});
			}
		}else{
			//if valid tag is error is set error message into properties
			deferred.reject(appService.getI18NText('product.validation.message.field.MANDATORY_EMPTY'));
			self.clearValueByTags(tagsOut);
			if(commonService.hasValue(tagsClearTable)){
				self.clearElementByTags(tagsClearTable);
			}
		}
		return deferred.promise;
	};
		
	
	/**
	 * @param element
	 * @param tags is object {input:[],output:[]}
	 * @returns {String}
	 */
	IllustrationUIService.prototype.validTagInElement = function(element, tags){
		var self = this;
		var tagsIn = tags.input;
		var tagsOut = tags.output;
		var	validElement = self.isValidElement(element).validResult;
		var validPropValue = true;
		var tagsValid = tags.valid;
		var isNoError = true;
		if (commonService.hasValue(tagsOut)) {
			validPropValue = self.checkValueElementsInDetailByTags(tagsOut).validResult;
		}
		if(commonService.hasValue(tagsValid)){
			isNoError = self.getArrayErrorCode(self.findPropertyInElement(element, tagsValid,'value').value).length > 0 ? false : true; 
		}
		if(validElement && validPropValue && isNoError)		//success
			return "success-card";
		else								//error
			return "failure-card";
	};
	
	IllustrationUIService.prototype.updateErrorStatus = function() {
		var self = this;
		var	validElement = self.checkValidElementsInDetail(['productInputs']).validResult;
		var validTag = self.checkValidTags(['Inputs']).validResult;
		
		var validPolicyOwner = self.getArrayErrorCode(self.findPropertyInDetail(['policyOwner','Validate_Life'], 'value').value).length > 0 ? false : true; 
		var validLifeAssured = self.getArrayErrorCode(self.findPropertyInDetail(['lifeAssured','Validate_Life'], 'value').value).length > 0 ? false : true;
		var validBasicPlan = self.getArrayErrorCode(self.findPropertyInDetail(['Validate_Basic_Plan'], 'value').value).length > 0 ? false : true;
		var riders = self.getElementsInElementInDetail(['Riders']);
		var isValidAllRiders = true;
		//if(riders !== undefined){
			for (var i = 0; i < riders.length; i++) {
				var isValidRider = self.getArrayErrorCode(self.findPropertyInElement(riders[i],['Validate_Rider'],'value').value).length > 0 ? false: true;
				if(!isValidRider){
					isValidAllRiders = false;
					break;
				}
			}
		//}
		if (validTag && validElement && validPolicyOwner && validLifeAssured && validBasicPlan && isValidAllRiders){
			self.detail.errorMessages = null;
		} else {
			self.detail.errorMessages = "true";
		}
	};
	
	IllustrationUIService.prototype.isBIValid = function() {
		var self = this;
		var isValid = true;
		
		//validElement
		var	isValid = self.checkValidElementsInDetail(['productInputs']).validResult;
		if(isValid){
			//validTag
			isValid = self.checkValidTags(['Inputs']).validResult;
			if(isValid){
				//validPolicyOwner
				var prop = self.findPropertyInDetail(['policyOwner','Validate_Life'], 'value');
				if(prop){
					isValid = self.getArrayErrorCode(prop.value).length > 0 ? false : true;
				} else{
					isValid = false;
				}
				if(isValid){
					//validLifeAssured
					prop = self.findPropertyInDetail(['lifeAssured','Validate_Life'], 'value');
					if(prop){
						isValid = self.getArrayErrorCode(prop.value).length > 0 ? false : true;
					} else{
						isValid = false;
					}
					if(isValid){
						//validBasicPlan
						prop = self.findPropertyInDetail(['Validate_Basic_Plan'], 'value');
						if(prop){
							isValid = self.getArrayErrorCode(prop.value).length > 0 ? false : true;
						} else{
							isValid = false;
						}
						if(isValid){
							//isValidAllRiders
							var riders = self.getElementsInElementInDetail(['Riders']);
							for (var i = 0; i < riders.length; i++) {
								prop = self.findPropertyInElement(riders[i],['Validate_Rider'],'value');
								if(prop){
									var isValidRider = self.getArrayErrorCode(prop.value).length > 0 ? false: true;
									if(!isValidRider){
										isValid = false;
										break;
									}
								} else{
									isValid = false;
								}
								
							}
						}
					}
				}
			}
		}
		return isValid;
	};
	/**
	 * 
	 * @param elements is array
	 */
	IllustrationUIService.prototype.setErrorMessage = function(elements) {
		var self = this;
		angular.forEach(elements, function(element, key){
			var propValidate = self._findProperty(element, "validate");
			if(commonService.hasValue(propValidate)){
				propValidate.value = appService.getI18NText('product.validation.message.field.MANDATORY_EMPTY');
			}else{
				var propValue = self._findProperty(element, "value");
				propValidate =  angular.copy(propValue);
				propValidate.name = "validate";
				propValidate.text = null;
				propValidate.value = appService.getI18NText('product.validation.message.field.MANDATORY_EMPTY');
				element.properties.push(propValidate);
			}
			
		});
	};
	IllustrationUIService.prototype.changeComponent = function(item) {
		var self = this;
		var propMandatory = self.findPropertyInElement(item,['Component_Sum_Assured'],'mandatory');
		propMandatory.value = (self.findPropertyInElement(item,['Component_Checked'],'value').value == 'Y') ?1 :0;  
	};
	IllustrationUIService.prototype.findAllComponents = function(elementChainsRider, elementChainsComp) {
		var self = this;
		var list = [];
		var riders =  self.findElementInDetail(elementChainsRider).elements;
		angular.forEach(riders, function(rider){
			var components = self.findElementInElement(rider, elementChainsComp).elements;
			var hasComp = false;
			angular.forEach(components, function(comp){
				if(self.findPropertyInElement(comp,[],'Eligible_Component').value > 0){
					hasComp = true;
					//list.push({data:comp, comp:true});
					//list.push({data:comp});
					list.push(comp);
				}
			});
			if(!hasComp) list.push(rider);
		});
		return list;
	};

	//************************************ Archive Illustration ************************************
	IllustrationUIService.prototype.confirmAndArchiveIllustration = function(illustrationMeta, fnSuccess){
		var self = this;	
		var deferred = $q.defer();
		
		var title = appService.getI18NText('workspace.archive.confirm.title');
		var message = appService.getI18NText('workspace.archive.confirm.text');		
		//Show dialog
		workspaceService.showConfirmDialog(title, message, function() {
			illustrationCoreService.archiveDocumentByMetadata.call(self, illustrationMeta).then(function(success) {
				deferred.resolve();
			});
		});
		return deferred.promise;		
	};
	
	IllustrationUIService.prototype.clearSettingForModule = function(){
		var self = this;
		if(self.isEditingForOtherModule(commonService.CONSTANTS.MODULE_NAME.ILLUSTRATION) == true) {
			var preDefine = workspaceService.getPreDefine(commonService.CONSTANTS.MODULE_NAME.ILLUSTRATION);
			preDefine.fnAfterCreateIllustration = undefined;
			preDefine.fnAfterEditIllustration = undefined;
			preDefine.prospects = undefined;
			preDefine.fromState = undefined;
			preDefine.saleCaseUid = undefined;
			preDefine.myself =undefined;
		}
	};
	//Hai Vu Add
	IllustrationUIService.prototype.updateStepsStatus=function(){
		var self=this;
		var steps=self.wsteps;
    	_.each(steps, function(step) {
    		switch(step.title){
	  			 case "Policy Owner":
	  				 if(self.validTagAndElement({input:['policyOwner'],valid:['policyOwner','Validate_Life']}, ['policyOwner'])=="success-card"){
	  	                step.completed=true;
	  	                step.selected=false;
	  	             } else {
	  	            	step.completed=false;
	  	            	step.selected=false;
	  	             }
	  				 break;
	  			 case "Life Insure":
	  				 if(self.validTagAndElement({input:['AssuredMain'],valid:['lifeAssured','Validate_Life']}, ['lifeAssured'])=="success-card"){
	                	step.completed=true;
	                	step.selected=false;
	  				 }else{
	  					step.completed=false;
	  					step.selected=false;
	  				 }
	  				 break;
	  			 case "Basic Benefit":
	  				 if(self.validTagAndElement({input:['basic'],valid:['Validate_Basic_Plan']}, ['policyOwner','lifeAssured','basic'])=="success-card"){
	                	step.completed=true;
	                	step.selected=false;
	  				 }else{
	  					step.completed=false;
	  					step.selected=false;
	  				 }
	  				 break;
	  			 case "Rider":
				 	step.completed=false;
	            	step.selected=false;
	            	if(self.hasElementInDetail(['Riders'])){
	            		var riders=self.getElementsInElementInDetail(['Riders']);
	            		for(var i=0;i<riders.length;i++){
	            			if(self.findPropertyInElement(riders[i],['Rider_Type'],'value').value != ''){
	      						if(self.validTagInElement(riders[i], {input:['Riders'],output:['Rider_Summary'],valid:['Validate_Rider']})=="success-card"){
	      							step.completed=true;
	      			            	step.selected=false;
	      			            	break;
	      						}
	      					}
	            		}
	            	};
					break;
			 }
        });
	};
	IllustrationUIService.prototype.isShowRiderIndicator=function(){
		var self=this;
		var flag=false;
		if(self.hasElementInDetail(['Riders'])){
			var riders=self.getElementsInElementInDetail(['Riders']);
			if(riders.length>=1){
				flag=true;
			};
		};
		return flag;
	};
	
	IllustrationUIService.prototype.getProductList = function(){
		var self = this;	 
		var deferred = self.$q.defer();
		illustrationCoreService.getProductList_V3.call(self).then(function(detail){
			deferred.resolve(detail);
		});
		return  deferred.promise;
	};
	
	IllustrationUIService.prototype.checkVehicleInBlacklisted = function(resourceURL){
		var self = this;	 
		var deferred = self.$q.defer();
		var vehicleNo = self.findElementInDetail_V3(['VehicleInformation','VehicleNo']).$;
		illustrationCoreService.checkVehicleInBlacklisted(resourceURL,vehicleNo).then(function(result){
			deferred.resolve(result);
		});
		return  deferred.promise;
	};
	

	/* Get Vehicle Market Value and NCD 
	*  {
	*	  "ISMReponse": {
	*	    "NCDForm": "NF001",
	*	    "NCDVehicleNo": "115",
	*	    "PrevPolicyNo": "P001",
	*	    "PrevPolicyEffDate": "2015-01-01",
	*	    "PrevPolicyExpDate": "2015-12-01",
	*	    "NCDAllow": "0",
	*	    "NCDEffDate": "2015-06-05",
	*	    "NoOfClaim3Year": "C005",
	*	    "MarKetValue": "19000"
	*	  }
	*	}
	*/
	IllustrationUIService.prototype.getMarketValueAndNCD = function(resourceURL){
		var self = this;	 
		var deferred = self.$q.defer();
		var vehicleNo = self.findElementInDetail_V3(['VehicleInformation','VehicleNo']).$;
		illustrationCoreService.getMarketValueAndNCD(resourceURL,vehicleNo).then(function(result){
			self.findElementInDetail_V3(['PreviousPolicyNo']).$ = self.findElementInElement_V3(result,['PrevPolicyNo']);
			self.findElementInDetail_V3(['PreviousPolicyEffectiveDate']).$ = self.findElementInElement_V3(result,['PrevPolicyEffDate']);
			self.findElementInDetail_V3(['PreviousPolicyExpiryDate']).$ = self.findElementInElement_V3(result,['PrevPolicyExpDate']);
			self.findElementInDetail_V3(['NCDAllowed']).Value = self.findElementInElement_V3(result,['NCDAllow']);
			self.findElementInDetail_V3(['NCDEffectivedate']).$ = self.findElementInElement_V3(result,['NCDEffDate']);
			self.findElementInDetail_V3(['NoOfClaim']).$ = self.findElementInElement_V3(result,['NoOfClaim3Year']);
			self.findElementInDetail_V3(['MarketValue']).$ = self.findElementInElement_V3(result,['MarKetValue']);
			deferred.resolve();
		});
		return  deferred.promise;
	};
	
//	IllustrationUIService.prototype.computeIllustrationDetail = function(resourceURL, productName){
//		var self = this;
//		var deferred = self.$q.defer();
//		illustrationCoreService.computeIllustrationDetail(resourceURL, productName).then(function(data){
//			deferred.resolve(data);
//		})
//		return deferred.promise;
//	};
	
	/**
	 * @author ynguyen7
	 * 2016.04.28
	 * Get Interes Parties from Policy To Application
	 */
	IllustrationUIService.prototype.importPerilFromPolicy = function(key){
    	var self = this;
    	var perilPolicy = policyUIService.findElementInDetail_V3(['PerilFEAOthers']);
		var perilApp= self.findElementInDetail_V3(['PerilFEAOthers']);
		var counterPerilPolicy = parseInt(policyUIService.findElementInDetail_V3(['PerilFEAOthers'])["@counter"]);
    	var counterPerilApp = parseInt(self.findElementInDetail_V3(['PerilFEAOthers'])["@counter"]);
    	
    	if (!commonService.hasValueNotEmpty(counterPerilPolicy)){
    		return;
    	}
    	else self.findElementInDetail_V3(['PerilFEAOthers'])["@counter"] = counterPerilPolicy;
    	
    	if (!(perilPolicy instanceof Array)) {
    		perilPolicy = self.convertToArray(perilPolicy);
    	}
    	if (!(perilApp instanceof Array)) {
    		perilApp = convertToArray(perilApp);
    	}
    	for (var i = 0; i < counterPerilPolicy; i++){
    		if (perilApp[i] === undefined){
    			perilApp[i] = angular.copy(perilApp[0]);
    			self.clearDataInJson(perilApp[i]);
    		}
    		
    		// Bind data by Array
    		for (var prop in perilPolicy[i]){
				if(perilPolicy[i][prop]){						
					var value =  self.findElementInElement_V3(perilPolicy[i], [prop]).Value;
					var string =  self.findElementInElement_V3(perilPolicy[i], [prop]).$;
					if(value != undefined || string != undefined){
						var propValue = (prop.split(":"))[1];
						if(value != undefined){
							self.findElementInElement_V3(perilApp[i], [propValue]).Value = value;
						}else{
							self.findElementInElement_V3(perilApp[i], [propValue]).$ = string;
						}
					}								
				}
			}
    	}
    };
	return new IllustrationUIService($q, ajax, $location, appService, cacheService, illustrationCoreService, commonService);

}]);
