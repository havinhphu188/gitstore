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

var applicationUIModule = angular.module('applicationUIModule',['applicationModule','commonUIModule'])
.service('applicationUIService', ['$q', 'ajax', '$location', 'appService', 'cacheService', 'commonUIService', 'applicationCoreService', 'commonService', 'pingService', 'illustrationUIService', 'salecaseUIService', 'policyUIService',
	function($q, ajax, $location, appService, cacheService, commonUIService, applicationCoreService, commonService, pingService, illustrationUIService, salecaseUIService, policyUIService){
	function ApplicationUIService($q, ajax, $location, appService, cacheService, applicationCoreService, commonService){
		applicationCoreService.constructor.call(this, $q, ajax, $location, appService, cacheService, applicationCoreService.detailCoreService, commonService);
		this.name = commonService.CONSTANTS.MODULE_NAME.APPLICATION;
		this.lazyChoiceListMotor = undefined;
		this.lazyChoiceListLife = undefined;		
		this.detail = undefined;
		this.applicationList = undefined;
		this.isFirstMailingAddressInitialize = false; //for GCS
		this.NPAddressList = [];
	}
	inherit(applicationCoreService.constructor, ApplicationUIService);
	extend(commonUIService.constructor, ApplicationUIService);
	
		ApplicationUIService.prototype.loadApplicationDetailUI = function(resourceURL,productName){
			 var self = this;
			 var deferred = self.$q.defer();
			 this.loadApplicationDetail.call(self,resourceURL,productName).then(function(data){
				 //do somthing else when override
				 deferred.resolve(data);
			 });
			 return  deferred.promise;
		 };
		 
		 ApplicationUIService.prototype.loadApplicationDetailLazyListUI = function(productName){
			 var self = this;
			 var deferred = self.$q.defer();
			 this.loadApplicationDetailLazyList.call(self,productName).then(function(data){
				 //do somthing else when override
				 deferred.resolve(data);
			 });
			 return  deferred.promise;
		 };
		 
		 ApplicationUIService.prototype.saveApplicationDetailUI = function(resourceURL,productName){
			var self = this;
			 var deferred = self.$q.defer();
			 this.saveApplicationDetail.call(self,resourceURL,productName).then(function(data){
				 //do somthing else when override
				 deferred.resolve(data);
			 });
			 return  deferred.promise;
		 };
	 
		ApplicationUIService.prototype.getApplicationList = function(resourceURL){
				var self = this;	 
				var deferred = self.$q.defer();
				applicationCoreService.getApplicationList_V3.call(self).then(function(detail){
					deferred.resolve(detail);
				});
				return  deferred.promise;
		};
		
		ApplicationUIService.prototype.update = function(resourceURL){
			var self = this;
			var deferred = self.$q.defer();
			applicationCoreService.detailCoreService.ListDetailCoreService.prototype.saveDetail_V3.call(self,resourceURL, true, function(data){
				commonService.showGlobalMessage(appService.getI18NText('workspace.save.success'));
				deferred.resolve(data);
			}, function(message){
				commonService.showGlobalMessage(message, "danger");
			});
			return  deferred.promise;
		};
		
		ApplicationUIService.prototype.translateNodes=function(data, productName){
		   	var self = this;
		   	if(productName == 'motor-private-car-m-as' || productName == 'motor-private-car' || productName == 'motor-insunrance' || productName == 'motor-private-car-m-ds'){
		   		self.translateLazyListField(data,'POGender','v3.gender.enum.');
		   		self.translateLazyListField(data,'POMarStat','v3.application.motor.maritalStatus.');
		   		self.translateLazyListField(data,'POSmokerStat','v3.smoker.enum.');
		   		self.translateLazyListField(data,'POStaff','v3.yesno.enum.');
		   		self.translateLazyListField(data,'POVip','v3.yesno.enum.');
		   		self.translateLazyListField(data,'POIDType','v3.application.motor.iDType.');
		   		self.translateLazyListField(data,'IsMAAA','v3.yesno.enum.');
		   		self.translateLazyListField(data,'JailedOrFined','v3.yesno.enum.');
		   		self.translateLazyListField(data,'ConfinesOfAirport','v3.yesno.enum.');
		   		self.translateLazyListField(data,'RoadUse','v3.yesno.enum.');
		   		self.translateLazyListField(data,'HasAccident','v3.yesno.enum.');
			}else if(productName == 'term-life-protect'){
				self.translateLazyListField(data,'I_Gender','v3.gender.enum.');
				self.translateLazyListField(data,'I_SmokerStat','v3.smoker.enum.');
				self.translateLazyListField(data,'I_Staff','v3.yesno.enum.');
				self.translateLazyListField(data,'I_VIP','v3.yesno.enum.');
				self.translateLazyListField(data,'ResidencyAnswer','v3.yesno.enum.');
			}
	    };
	    
	    ApplicationUIService.prototype.getQuotation=function(){
	    	var self = this; 
	    	if (self.isFirstInitialize == true) {
				self.findElementInDetail_V3(['Header'])['DocInfo']['DocName'] = self.genDefaultName();
				self.findElementInDetail_V3(['CaseID']).$ = salecaseUIService.findElementInDetail_V3(['DocId']);
				self.findElementInDetail_V3(['PolicyNo']).$ = salecaseUIService.findElementInDetail_V3(['PolicyNumber']).$;
				if (salecaseUIService.group =='' || salecaseUIService.group == undefined){
					salecaseUIService.group = salecaseUIService.getProductGroup_V3(salecaseUIService.product);
				}
				if(salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.MOTOR){
					// check whether Quotation is valid
					if(illustrationUIService.findElementInDetail_V3(['BasePremium']).$ != undefined){
						// then push data from Quotation into Application
						// Main cover
						self.findElementInDetail_V3(['MainCoverageType']).$ = illustrationUIService.findElementInDetail_V3(['MainCoverage']).$;
						self.findElementInDetail_V3(['MainSumInsured']).$ = illustrationUIService.findElementInDetail_V3(['MainSumInsured']).$;
						self.findElementInDetail_V3(['MainPremium']).$ = illustrationUIService.findElementInDetail_V3(['MainPremium']).$;
						// Optional cover
						var counter = illustrationUIService.findElementInDetail_V3(['OptionalCoverages'])['@counter'];
						counter = Number(counter);
						if (counter > 0) { // set counter for OC in Application
							self.findElementInDetail_V3(['OptionalCoverages'])['@counter'] = 1;
						}
						self.jsonToArray(self.detail, 'OptionalCoverages', 'application-motor:OptionalCoverage');
						illustrationUIService.jsonToArray(illustrationUIService.detail, 'OptionalCoverages', 'illustration:OptionalCoverage');
						var illustrationOptions = illustrationUIService.findElementInDetail_V3(['OptionalCoverage']);
						var applicationOptions = self.findElementInDetail_V3(['OptionalCoverage']);
						if (counter > 0) {
							for (var i = 0; applicationOptions.length < counter; i++) {
								self.addElementInElement_V3(self.detail, ['OptionalCoverages'], ['OptionalCoverage']);
							}
							for (var i = 0; i < counter; i++) {
								self.findElementInElement_V3(applicationOptions[i], ['AdditionalBenefitCode']).$ = illustrationUIService.findElementInElement_V3(illustrationOptions[i], ['AdditionalBenefitCode']).Value;
								
								self.findElementInElement_V3(applicationOptions[i], ['AdditionalBenefitLimit']).$ = illustrationUIService.findElementInElement_V3(illustrationOptions[i], ['AdditionalBenefitLimit']).$;
								
								self.findElementInElement_V3(applicationOptions[i], ['AdditionalPremium']).$ = illustrationUIService.findElementInElement_V3(illustrationOptions[i], ['Premium']).$;
								
							}
						}
						// Other data
						self.findElementInDetail_V3(['TotalPremium']).$ = illustrationUIService.findElementInDetail_V3(['TotalPremium']).$;
						self.findElementInDetail_V3(['ProposalBegin']).$ = illustrationUIService.findElementInDetail_V3(['InceptionDate']).$;
						self.findElementInDetail_V3(['ProposalEnd']).$ = illustrationUIService.findElementInDetail_V3(['ExpiryDate']).$;
						//$scope.init();
					}
					// Other data
					self.findElementInDetail_V3(['TotalPremium']).$ = illustrationUIService.findElementInDetail_V3(['TotalPremium']).$;
					self.findElementInDetail_V3(['StampDuty']).$ = illustrationUIService.findElementInDetail_V3(['StampDuty']).$;
					self.findElementInDetail_V3(['TotalPayablePremium']).$ = illustrationUIService.findElementInDetail_V3(['TotalPayablePremium']).$;
					self.findElementInDetail_V3(['ProposalBegin']).$ = illustrationUIService.findElementInDetail_V3(['InceptionDate']).$;
					self.findElementInDetail_V3(['ProposalEnd']).$ = illustrationUIService.findElementInDetail_V3(['ExpiryDate']).$;
					//$scope.init();
				}
				else if(salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.TERM_LIFE){
				}
				else if(salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.FOREIGN_WORKER){
					
					//self.copyElements_V3(illustrationUIService.findElementInDetail_V3(['MainInsured']), self.findElementInDetail_V3(['MainInsured']));
					
					self.findElementInDetail_V3(['InceptionDate']).$ = illustrationUIService.findElementInDetail_V3(['InceptionDate']).$;
					self.findElementInDetail_V3(['ExpiryDate']).$ = illustrationUIService.findElementInDetail_V3(['ExpiryDate']).$;
					self.findElementInDetail_V3(['TotalPremium']).$ = illustrationUIService.findElementInDetail_V3(['TotalPremium']).$;
					self.findElementInDetail_V3(['StampDuty']).$ = illustrationUIService.findElementInDetail_V3(['StampDuty']).$;
					self.findElementInDetail_V3(['TotalPayable']).$ = illustrationUIService.findElementInDetail_V3(['TotalPayable']).$;
					self.findElementInDetail_V3(['GST']).$ = illustrationUIService.findElementInDetail_V3(['GST']).$;
					self.findElementInDetail_V3(['BillingCurrency']).Value = illustrationUIService.findElementInDetail_V3(['BillingCurrency']).Value;
					self.findElementInDetail_V3(['SICurrency']).Value = illustrationUIService.findElementInDetail_V3(['SICurrency']).Value;
					
					self.findElementInDetail_V3(['Coverage', 'Plan']).Value = illustrationUIService.findElementInDetail_V3(['Coverage', 'Plan']).Value;
					self.findElementInDetail_V3(['Coverage', 'Country']).Value = illustrationUIService.findElementInDetail_V3(['Coverage', 'Country']).Value;
					self.findElementInDetail_V3(['Coverage', 'NoOfPeople']).$ = illustrationUIService.findElementInDetail_V3(['Coverage', 'NoOfPeople']).$;
					self.findElementInDetail_V3(['Coverage', 'GeographicCoverage']).Value = illustrationUIService.findElementInDetail_V3(['Coverage', 'GeographicCoverage']).Value;
					self.findElementInDetail_V3(['Coverage', 'PolicyDeductible']).$ = illustrationUIService.findElementInDetail_V3(['Coverage', 'PolicyDeductible']).$;
					
					self.findElementInDetail_V3(['MainInsured', 'Title']).Value = illustrationUIService.findElementInDetail_V3(['MainInsured', 'Title']).Value;
					self.findElementInDetail_V3(['MainInsured', 'Gender']).Value = illustrationUIService.findElementInDetail_V3(['MainInsured', 'Gender']).Value;
					self.findElementInDetail_V3(['MainInsured', 'FullName']).$ = illustrationUIService.findElementInDetail_V3(['MainInsured', 'FullName']).$;
					self.findElementInDetail_V3(['MainInsured', 'BirthDate']).$ = illustrationUIService.findElementInDetail_V3(['MainInsured', 'BirthDate']).$;
					self.findElementInDetail_V3(['MainInsured', 'BusinessIndustry']).Value = illustrationUIService.findElementInDetail_V3(['MainInsured', 'BusinessIndustry']).Value;
					self.findElementInDetail_V3(['MainInsured', 'Occupation']).Value = illustrationUIService.findElementInDetail_V3(['MainInsured', 'Occupation']).Value;
					self.findElementInDetail_V3(['MainInsured', 'Nationality']).Value = illustrationUIService.findElementInDetail_V3(['MainInsured', 'Nationality']).Value;
					self.findElementInDetail_V3(['MainInsured', 'IDNumber']).$ = illustrationUIService.findElementInDetail_V3(['MainInsured', 'IDNumber']).$;
					self.findElementInDetail_V3(['MainInsured', 'IDType']).Value = illustrationUIService.findElementInDetail_V3(['MainInsured', 'IDType']).Value;
					self.findElementInDetail_V3(['MainInsured', 'Race']).Value = illustrationUIService.findElementInDetail_V3(['MainInsured', 'Race']).Value;
					
					var policyOwnerId = illustrationUIService.findElementInDetail_V3(['MainInsured'])["@refUid"];
					self.findElementInDetail_V3(['PolicyOwnerInformation'])['@refUid'] = policyOwnerId;
					self.findElementInDetail_V3(['PolicyOwnerInformation', 'Title']).Value = illustrationUIService.findElementInDetail_V3(['MainInsured', 'Title']).Value;
					self.findElementInDetail_V3(['PolicyOwnerInformation', 'Gender']).Value = illustrationUIService.findElementInDetail_V3(['MainInsured', 'Gender']).Value;
					self.findElementInDetail_V3(['PolicyOwnerInformation', 'FullName']).$ = illustrationUIService.findElementInDetail_V3(['MainInsured', 'FullName']).$;
					self.findElementInDetail_V3(['PolicyOwnerInformation', 'BirthDate']).$ = illustrationUIService.findElementInDetail_V3(['MainInsured', 'BirthDate']).$;
					self.findElementInDetail_V3(['PolicyOwnerInformation', 'BusinessIndustry']).Value = illustrationUIService.findElementInDetail_V3(['MainInsured', 'BusinessIndustry']).Value;
					//self.findElementInDetail_V3(['PolicyOwnerInformation', 'Occupation']).Value = illustrationUIService.findElementInDetail_V3(['MainInsured', 'Occupation']).Value;
					self.findElementInDetail_V3(['PolicyOwnerInformation', 'Nationality']).Value = illustrationUIService.findElementInDetail_V3(['MainInsured', 'Nationality']).Value;
					self.findElementInDetail_V3(['PolicyOwnerInformation', 'IDNumber']).$ = illustrationUIService.findElementInDetail_V3(['MainInsured', 'IDNumber']).$;
					self.findElementInDetail_V3(['PolicyOwnerInformation', 'IDType']).Value = illustrationUIService.findElementInDetail_V3(['MainInsured', 'IDType']).Value;
					self.findElementInDetail_V3(['PolicyOwnerInformation', 'Race']).Value = illustrationUIService.findElementInDetail_V3(['MainInsured', 'Race']).Value;
					
					// Other Insured
					var counter = illustrationUIService.findElementInDetail_V3(['OtherInsuredPersons'])["@counter"];
					counter = Number(counter);
					if (counter > 0) {
						self.findElementInDetail_V3(['OtherInsuredPersons'])['@counter'] = 1;
					}
					self.jsonToArray(self.detail, 'OtherInsuredPersons', 'illus-pa:OtherInsuredPerson');
					self.jsonToArray(illustrationUIService.detail, 'OtherInsuredPersons', 'illus-pa:OtherInsuredPerson');
					var otherInsuredPersons = self.findElementInDetail_V3(['OtherInsuredPerson']);
					var otherInsuredPersonsOfIllus = illustrationUIService.findElementInDetail_V3(['OtherInsuredPerson']);
					if (counter > 0) {
						for (var i = 0; otherInsuredPersons.length < counter; i++) {
							self.addElementInElement_V3(self.detail, ['OtherInsuredPersons'], ['OtherInsuredPerson']);
						}
						for (var i = 0; i < counter; i++) {
							self.findElementInElement_V3(otherInsuredPersons[i], ['FullName']).$ = illustrationUIService.findElementInElement_V3(otherInsuredPersonsOfIllus[i], ['FullName']).$;
							self.findElementInElement_V3(otherInsuredPersons[i], ['IDNumber']).$ = illustrationUIService.findElementInElement_V3(otherInsuredPersonsOfIllus[i], ['IDNumber']).$;
							self.findElementInElement_V3(otherInsuredPersons[i], ['BirthDate']).$ = illustrationUIService.findElementInElement_V3(otherInsuredPersonsOfIllus[i], ['BirthDate']).$;
							
						}
					}
				}
				else if (salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.FIRE) {
					if (illustrationUIService.findElementInDetail_V3(['TotalPremium']).$ != undefined) {
						self.findElementInDetail_V3(['InceptionDate']).$ = illustrationUIService.findElementInDetail_V3(['InceptionDate']).$;
						self.findElementInDetail_V3(['ExpiryDate']).$ = illustrationUIService.findElementInDetail_V3(['ExpiryDate']).$;
						self.findElementInDetail_V3(['HazardGrade']).$ = illustrationUIService.findElementInDetail_V3(['HazardGrade']).$;
						self.findElementInDetail_V3(['PremiumRate']).$ = illustrationUIService.findElementInDetail_V3(['PremiumRate']).$;
						self.findElementInDetail_V3(['AdditionalPremium']).$ = illustrationUIService.findElementInDetail_V3(['AdditionalPremium']).$;
						self.findElementInDetail_V3(['TotalSumInsured']).$ = illustrationUIService.findElementInDetail_V3(['TotalSumInsured']).$;
						self.findElementInDetail_V3(['TotalPremium']).$ = illustrationUIService.findElementInDetail_V3(['TotalPremium']).$;
						self.findElementInDetail_V3(['StampDuty']).$ = illustrationUIService.findElementInDetail_V3(['StampDuty']).$;
						self.findElementInDetail_V3(['TotalPayable']).$ = illustrationUIService.findElementInDetail_V3(['TotalPayable']).$;
						var counterPerilFEAOther = illustrationUIService.findElementInDetail_V3(['PerilFEAOthers'])['@counter'];
						counterPerilFEAOther = Number(counterPerilFEAOther);
						if (counterPerilFEAOther > 0) {
							self.findElementInDetail_V3(['OutputPerilFEAOthers'])['@counter'] = 1;
						}
						illustrationUIService.jsonToArray(illustrationUIService.detail, 'PerilFEAOthers', 'illustration-fire:PerilFEAOther');
						self.jsonToArray(self.detail, 'OutputPerilFEAOthers', 'illustration-fire:OutputPerilFEAOther');
						var illustrationPerilFEAOther = illustrationUIService.findElementInDetail_V3(['PerilFEAOther']);
						var applicationPerilFEAOther = self.findElementInDetail_V3(['OutputPerilFEAOther']);
						if (counter > 0) {
							for (var i = 0; applicationPerilFEAOther.length < counter; i++) {
								self.addElementInElement_V3(self.detail, ['OutputPerilFEAOthers'], ['OutputPerilFEAOther']);
							}
							for (var i = 0; i < counter; i++) {
								self.findElementInElement_V3(applicationPerilFEAOther[i], ['PerilFEAOtherDescription']).Value = illustrationUIService.findElementInElement_V3(illustrationPerilFEAOther[i], ['PerilFEAOtherDescription']).Value;
								self.findElementInElement_V3(applicationPerilFEAOther[i], ['PerilFEAOtherRate']).$ = illustrationUIService.findElementInElement_V3(illustrationPerilFEAOther[i], ['PerilFEAOtherRate']).$;
								self.findElementInElement_V3(applicationPerilFEAOther[i], ['PerilFEAOtherAmount']).$ = illustrationUIService.findElementInElement_V3(illustrationPerilFEAOther[i], ['PerilFEAOtherAmount']).$;
								
							}
						}
						var counterInsuredInterest = illustrationUIService.findElementInDetail_V3(['InsuredInterests'])['@counter'];
						counterInsuredInterest = Number(counterInsuredInterest);
						if (counterInsuredInterest > 0) {
							self.findElementInDetail_V3(['OutputInsuredInterests'])['@counter'] = 1;
						}
						illustrationUIService.jsonToArray(illustrationUIService.detail, 'InsuredInterests', 'illustration-fire:InsuredInterest');
						self.jsonToArray(self.detail, 'OutputInsuredInterests', 'illustration-fire:OutputInsuredInterest');
						var illustrationInsuredInterest = illustrationUIService.findElementInDetail_V3(['InsuredInterest']);
						var applicationInsuredInterest = self.findElementInDetail_V3(['OutputInsuredInterest']);
						if (counter > 0) {
							for (var i = 0; applicationInsuredInterest.length < counter; i++) {
								self.addElementInElement_V3(self.detail, ['OutputInsuredInterests'], ['OutputInsuredInterest']);
							}
							for (var i = 0; i < counter; i++) {
								self.findElementInElement_V3(applicationInsuredInterest[i], ['InterestCode']).Value = illustrationUIService.findElementInElement_V3(illustrationInsuredInterest[i], ['InterestCode']).Value;
								self.findElementInElement_V3(applicationInsuredInterest[i], ['SumInsured']).$ = illustrationUIService.findElementInElement_V3(illustrationInsuredInterest[i], ['SumInsured']).$;
//								self.findElementInElement_V3(applicationInsuredInterest[i], ['Rate']).$ = illustrationUIService.findElementInElement_V3(illustrationInsuredInterest[i], ['Rate']).$;
								self.findElementInElement_V3(applicationInsuredInterest[i], ['Premium']).$ = illustrationUIService.findElementInElement_V3(illustrationInsuredInterest[i], ['Premium']).$;
								
							}
						}
						
						//$scope.init();
					}
				}
				self.isFirstInitialize = false;
			}
	    };
	    
	    /**
		 * @author lhoang4
		 * 2016.04.08
		 * Import Policy Owner primary address From Policy to Application
		 */
	    
	    ApplicationUIService.prototype.importAddressFromPolicyToPO = function(key){
	    	var self = this;
	    	var addressPolicy = policyUIService.findElementInDetail_V3(['PolicyOwner',key]);
	    	var addressPO= self.findElementInDetail_V3(['PolicyOwnerInformation',key]);
	    	for (var prop in addressPolicy){
				if(self.findElementInElement_V3(addressPolicy, [prop])!=  undefined){
					var value =  self.findElementInElement_V3(addressPolicy, [prop]).Value;
					var string =  self.findElementInElement_V3(addressPolicy, [prop]).$;
					if(value != undefined || string != undefined){
						var propValue = prop;
						if(value != undefined){
							self.findElementInElement_V3(addressPO, [propValue]).Value = value;
						}else{
							self.findElementInElement_V3(addressPO, [propValue]).$ = string;
						}
					}
				}
			}
	    }
	    
	    /**
		 * @author lhoang4
		 * 2016.04.11
		 * Import Policy Owner Non-primary address From Policy to Application
		 */
	    
	    ApplicationUIService.prototype.importNonPrimaryAddressesFromPolicyToPO = function(key){
	    	var self = this;
	    	var addressPolicy = policyUIService.findElementInDetail_V3(['PolicyOwner',"NonPrimaryAddress"]);
	    	var addressPO= self.findElementInDetail_V3(['PolicyOwnerInformation',"NonPrimaryAddress"]);
	    	var counterAddressPolicy = policyUIService.findElementInDetail_V3(['PolicyOwner',"NonPrimaryAddresses"])["@counter"];
	    	var counterAddressPO = self.findElementInDetail_V3(['PolicyOwnerInformation',"NonPrimaryAddress"])["@counter"];
	    	
	    	if (!commonService.hasValueNotEmpty(counterAddressPolicy)){
	    		return false;
	    	}
	    	else counterAddressPO = counterAddressPolicy;
	    	
	    	if (!(addressPolicy instanceof Array)) {
	    		addressPolicy = self.convertToArray(addressPolicy);
	    	}
	    	if (!(addressPO instanceof Array)) {
	    		addressPO = convertToArray(addressPO);
	    	}
	    	for (var i=0;i>counterAddressPolicy;i++){
	    		if (addressPO[i] === undefined){
	    			addressPO[i] = angular.copy(addressPO[0]);
	    			self.clearDataInJson(addressPO[i]);
	    		}
	    		for (var prop in addressPolicy[i]){
					if(self.findElementInElement_V3(addressPolicy[i], [prop])!=  undefined){
						var value =  self.findElementInElement_V3(addressPolicy[i], [prop]).Value;
						var string =  self.findElementInElement_V3(addressPolicy[i], [prop]).$;
						if(value != undefined || string != undefined){
							var propValue = prop;
							if(value != undefined){
								self.findElementInElement_V3(addressPO[i], [propValue]).Value = value;
							}else{
								self.findElementInElement_V3(addressPO[i], [propValue]).$ = string;
							}
						}
					}
				}
	    	}
	    	
	    }
	    /**
		 * @author ynguyen7
		 * 2016.04.27
		 * Get Interes Parties from Policy To Application
		 */
	    ApplicationUIService.prototype.importInteresPartiesFromPolicy = function(key){
	    	var self = this;
	    	var partiesinPolicy = policyUIService.findElementInDetail_V3(['InterestedParty']);
			var partiesinApp= self.findElementInDetail_V3(['InterestedParty']);
	    	var counterPartiesPolicy = parseInt(policyUIService.findElementInDetail_V3(['InterestedParties'])["@counter"]);
	    	var partiesApp = self.findElementInDetail_V3(['InterestedParties']);
	    	if (!commonService.hasValueNotEmpty(partiesApp)) return;
	    	
	    	var counterPartiesApp = parseInt(partiesApp["@counter"]);
	    	
	    	if (!commonService.hasValueNotEmpty(counterPartiesPolicy)){
	    		return false;
	    	}
	    	else self.findElementInDetail_V3(['InterestedParties'])["@counter"] = counterPartiesPolicy;
	    	
	    	if (!(partiesinPolicy instanceof Array)) {
	    		partiesinPolicy = self.convertToArray(partiesinPolicy);
	    	}
	    	if (!(partiesinApp instanceof Array)) {
	    		partiesinApp = convertToArray(partiesinApp);
	    	}
	    	for (var i = 0; i < counterPartiesPolicy; i++){
	    		if (partiesinApp[i] === undefined){
	    			partiesinApp[i] = angular.copy(partiesinApp[0]);
	    			self.clearDataInJson(partiesinApp[i]);
	    		}
	    		//Bind data by properties
	    		self.findElementInElement_V3(partiesinApp[i], ['ClientName']).Value = self.findElementInElement_V3(partiesinPolicy[i], ['FullName']).$;
	    		self.findElementInElement_V3(partiesinApp[i], ['Relationship']).Value = self.findElementInElement_V3(partiesinPolicy[i], ['Relationship']).Value;
	    		self.findElementInElement_V3(partiesinApp[i], ['ClientNumber']).$ = self.findElementInElement_V3(partiesinPolicy[i], ['ClientNumber']).$;
	    		
	    		// Bind data by Array
	    		/*for (var prop in partiesinPolicy[i]){
					if(partiesinPolicy[i][prop]){						
						var value =  self.findElementInElement_V3(partiesinPolicy[i], [prop]).Value;
						var string =  self.findElementInElement_V3(partiesinPolicy[i], [prop]).$;
						if(value != undefined || string != undefined){
							var propValue = (prop.split(":"))[1];
							if(value != undefined){
								self.findElementInElement_V3(partiesinApp[i], [propValue]).Value = value;
							}else{
								self.findElementInElement_V3(partiesinApp[i], [propValue]).$ = string;
							}
						}								
					}
				}*/
	    	}
	    };
	    
	    ApplicationUIService.prototype.getPolicyOwnerDetail=function(){
	    	var self = this;
	    	//$.extend(true, self.findElementInDetail_V3(['PolicyOwnerInformation']), policyUIService.findElementInDetail_V3(['PolicyOwner']));
	    	var POinPolicy = policyUIService.findElementInDetail_V3(['PolicyOwner']);
			var POinApp= self.findElementInDetail_V3(['PolicyOwnerInformation']);
			for (var prop in POinApp){
				if(self.findElementInElement_V3(POinPolicy, [prop])!=  undefined){
					var value =  self.findElementInElement_V3(POinPolicy, [prop]).Value;
					var string =  self.findElementInElement_V3(POinPolicy, [prop]).$;
					if (prop.indexOf("PrimaryAddress") !== -1){
						self.importAddressFromPolicyToPO(prop);
					}
					else if(value != undefined || string != undefined){
						var propValue = (prop.split(":"))[1];
						if(value != undefined){
							self.findElementInElement_V3(POinApp, [propValue]).Value = value;
						}else{
							self.findElementInElement_V3(POinApp, [propValue]).$ = string;
						}
					}
				}
			}
			self.importNonPrimaryAddressesFromPolicyToPO();
			//self.importInteresPartiesFromPolicy();
    		self.findElementInDetail_V3(['FullName']).$ = policyUIService.findElementInDetail_V3(['FullName']).$;
    		self.findElementInDetail_V3(['IDType']).Value = policyUIService.findElementInDetail_V3(['IDType']).Value;
    		self.findElementInDetail_V3(['IDNumber']).$ = policyUIService.findElementInDetail_V3(['IDNumber']).$;
    		//self.findElementInDetail_V3(['FullName']).$ = policyUIService.findElementInDetail_V3(['FullName']).$;
    		
    		/*Import addresses*/
    		/*var counterA = policyUIService.findElementInDetail_V3(['Addresses'])['@counter'];
            var counterAInPO = self.findElementInDetail_V3(['Addresses'])['@counter'];
            counterA = Number(counterA);
            counterAInPO = Number(counterAInPO);
            self.jsonToArray(self.detail, 'Addresses', 'person:Address');
            policyUIService.jsonToArray(policyUIService.detail, 'Addresses', 'person:Address');
            var pOAddressesInPolicy = policyUIService.findElementInDetail_V3(['Address']);
            var pOAddresses = self.findElementInDetail_V3(['Addresses','Address']); //in application
            // remove Address element when trying to import many times with many size of Address
            if(counterAInPO > counterA ){
                var range = (counterAInPO - counterA);
                for( var r = 0; r < range; r++){
                    self.removeElementInElement_V3(r, self.detail, ['Addresses'], ['Addresses','Address']);
                }
            }
            // if Address in Prospect is available
            if (counterA > 0) {
                for (var i = 0; Number(self.findElementInDetail_V3(['Addresses'])['@counter']) < counterA; i++) {
                    self.addElementInElement_V3(self.detail, ['Addresses'], ['Addresses','Address']);
                }
                for (var i = 0; i < counterA; i++) {
                    self.findElementInElement_V3(pOAddresses[i], ['AddressType']).Value = policyUIService.findElementInElement_V3(pOAddressesInPolicy[i], ['AddressType']).Value;
                    self.findElementInElement_V3(pOAddresses[i], ['BlkHouseNo']).$ = policyUIService.findElementInElement_V3(pOAddressesInPolicy[i], ['BlkHouseNo']).$;
                    self.findElementInElement_V3(pOAddresses[i], ['Street']).$ = policyUIService.findElementInElement_V3(pOAddressesInPolicy[i], ['Street']).$;
                    self.findElementInElement_V3(pOAddresses[i], ['UnitNo']).$ = policyUIService.findElementInElement_V3(pOAddressesInPolicy[i], ['UnitNo']).$;
                    self.findElementInElement_V3(pOAddresses[i], ['Building']).$ = policyUIService.findElementInElement_V3(pOAddressesInPolicy[i], ['Building']).$;
                    self.findElementInElement_V3(pOAddresses[i], ['City']).$ = policyUIService.findElementInElement_V3(pOAddressesInPolicy[i], ['City']).$;
                    self.findElementInElement_V3(pOAddresses[i], ['Country']).Value = policyUIService.findElementInElement_V3(pOAddressesInPolicy[i], ['Country']).Value;
                    self.findElementInElement_V3(pOAddresses[i], ['Postal']).$ = policyUIService.findElementInElement_V3(pOAddressesInPolicy[i], ['Postal']).$;
                }
            }
            self.findElementInDetail_V3(['Addresses'])['@counter'] = (self.findElementInDetail_V3(['Addresses'])['@counter']).toString();
            self.addressList = self.convertToArray(self.findElementInDetail_V3(['Address']));
            Import contacts
            var counterC = policyUIService.findElementInDetail_V3(['Contacts'])['@counter'];
            var counterCInPO = self.findElementInDetail_V3(['Addresses'])['@counter'];
            counterC = Number(counterC);
            counterCInPO = Number(counterCInPO);
            self.jsonToArray(self.detail, 'Contacts', 'person:Contact');i
            if(policyUIService.findElementInDetail_V3(['Contact']) != undefined){
            	policyUIService.jsonToArray(policyUIService.detail, 'Contacts', 'person:Contact');
            }
            var pOContactsInPolicy = policyUIService.findElementInDetail_V3(['Contact']);
            var pOContacts = self.findElementInDetail_V3(['Contact']); // in application
            // remove Contacts element when trying to import many times with many size of Address
            if(counterCInPO > counterC ){
                var range = (counterCInPO - counterC);
                for( var r = 0; r < range; r++){
                    self.removeElementInElement_V3(r, self.detail, ['Contacts'], ['Contacts','Contact']);
                }
            }
            if (counterC > 0) {
                for (var i = 0; Number(self.findElementInDetail_V3(['Contacts'])['@counter']) < counterC; i++) {
                    self.addElementInElement_V3(self.detail, ['Contacts'], ['Contact']);
                }
                for (var i = 0; i < counterC; i++) {
                    self.findElementInElement_V3(pOContacts[i], ['ContactType']).Value = policyUIService.findElementInElement_V3(pOContactsInPolicy[i], ['ContactType']).Value;
                    self.findElementInElement_V3(pOContacts[i], ['ContactInformation']).$ = policyUIService.findElementInElement_V3(pOContactsInPolicy[i], ['ContactInformation']).$;
                    self.findElementInElement_V3(pOContacts[i], ['ContactType'])['@mandatory'] = (i == 0) ? '1' : '0';
                }
            }*/
            /*Import correspondence address*/
            //var correspondenceAddressInPolicy = policyUIService.findElementInDetail_V3(['CorrespondenceAddress']);
            //var correspondenceAddressInApp= self.findElementInDetail_V3(['CorrespondenceAddress']);
            self.findElementInDetail_V3(['CorrespondenceAddress', 'AddressType']).Value = policyUIService.findElementInDetail_V3(['CorrespondenceAddress', 'AddressType']).Value;
            self.findElementInDetail_V3(['CorrespondenceAddress', 'BlkHouseNo']).$ = policyUIService.findElementInDetail_V3(['CorrespondenceAddress', 'BlkHouseNo']).$;
            self.findElementInDetail_V3(['CorrespondenceAddress', 'Street']).$ = policyUIService.findElementInDetail_V3(['CorrespondenceAddress', 'Street']).$;
            self.findElementInDetail_V3(['CorrespondenceAddress', 'UnitNo']).$ = policyUIService.findElementInDetail_V3(['CorrespondenceAddress', 'UnitNo']).$;
            self.findElementInDetail_V3(['CorrespondenceAddress', 'Building']).$ = policyUIService.findElementInDetail_V3(['CorrespondenceAddress', 'Building']).$;
            self.findElementInDetail_V3(['CorrespondenceAddress', 'City']).$ = policyUIService.findElementInDetail_V3(['CorrespondenceAddress', 'City']).$;
            self.findElementInDetail_V3(['CorrespondenceAddress', 'Country']).Value = policyUIService.findElementInDetail_V3(['CorrespondenceAddress', 'Country']).Value;
            self.findElementInDetail_V3(['CorrespondenceAddress', 'Postal']).$ = policyUIService.findElementInDetail_V3(['CorrespondenceAddress', 'Postal']).$;
//            self.findElementInDetail_V3(['CorrespondenceAddress', 'PreferredAddress']).Value = policyUIService.findElementInDetail_V3(['CorrespondenceAddress', 'PreferredAddress']).Value;
	    };
	    
	    ApplicationUIService.prototype.generateApplicationFromQuotation_V3= function(resourceURL, quotationDocID){
			var self = this;
			var deferred = self.$q.defer();
			if (self.isFirstInitialize == true) {
			    self.isFirstMailingAddressInitialize = true; //for GCS
				applicationCoreService.generateApplicationFromQuotation_V3(resourceURL, quotationDocID, self.productName).then(function(data){
					self.convertElementsToArrayInElement_V3(data);
					self.detail= data;
					self.findElementInDetail_V3(['Header'])['DocInfo']['DocName'] = self.genDefaultName();
//					self.findElementInElement_V3(self.detail, ['ContactType'])['@mandatory'] = '1';

					if(salecaseUIService.group != undefined && salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.FOREIGN_WORKER) {
//						self.getQuotation();
					}
					
					//for GCS
					if(commonService.hasValueNotEmpty(salecaseUIService.product) 
							&& salecaseUIService.product != commonService.CONSTANTS.PRODUCT.REGULAR_UNIT_LINK 
							&& salecaseUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.TERM_LIFE) {
						self.findElementInDetail_V3(['PolicyOwnerInformation'])['@refUid'] = illustrationUIService.findElementInDetail_V3(['PolicyOwnerInformation'])['@refUid'];
						self.findElementInDetail_V3(['LifeAssuredInformation'])['@refUid'] = illustrationUIService.findElementInDetail_V3(['LifeInsuredInformation'])['@refUid'];
					}

					self.isFirstInitialize = false;
					deferred.resolve(data);
				});
			}
			else deferred.resolve();
			return  deferred.promise;
		};
		
		ApplicationUIService.prototype.addMandatoryToFirstContactType = function () {
            var self = this;
            self.findElementInElement_V3(self.detail, ['Contact'])[0]['person:ContactType']['@mandatory'] = '1';
        }
		
		ApplicationUIService.prototype.removeMandatoryFromLastContactType = function () {
		    var self = this;
		    var counter = self.findElementInElement_V3(self.detail, ['Contact']).length;
		    self.findElementInElement_V3(self.detail, ['Contact'])[counter - 1]['person:ContactType']['@mandatory'] = '0';
		}
	    
	 return new ApplicationUIService($q, ajax, $location, appService, cacheService, applicationCoreService, commonService);
}]);
