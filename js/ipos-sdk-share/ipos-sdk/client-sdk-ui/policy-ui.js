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

var policyUIModule = angular.module('policyUIModule',['policyModule', 'commonUIModule'])
.service('policyUIService', ['$q', 'ajax', '$location', '$injector', 'appService', 'cacheService', 'translateService', 'commonUIService', 'policyCoreService', 'commonService', 'pingService', 'clientCoreService', 'salecaseUIService', 
	function($q, ajax, $location, $injector, appService, cacheService, translateService, commonUIService, policyCoreService, commonService, pingService, clientCoreService, salecaseUIService){

	function policyUIService($q, ajax, $injector, $location, appService, cacheService, policyCoreService, commonService, clientUIService, translateService, salecaseUIService){
		policyCoreService.constructor.call(this, $q, ajax, $location, appService, cacheService, policyCoreService.detailCoreService, commonService);
		this.name = 'policy';
		this.maxDaysAllowedToRenewal = commonService.options.maxDayToRenew;
		this.lazyChoicelist = undefined;
		this.detail = undefined;
	};
	inherit(policyCoreService.constructor, policyUIService);
	extend(commonUIService.constructor, policyUIService);
	
	policyUIService.prototype.getDate = function(date) {
			return moment(date,"YYYYMMDD").format("DD/MM/YYYY");
	};
	
	
	 
	 policyUIService.prototype.getDocumentDetail_V3 = function(resourceURL, policyId, clientId){
		 var self = this;
		 var deferred = self.$q.defer();
		 if(self.effectiveDate){
			 policyCoreService.getDocumentDetailByPolicyNo_V3(resourceURL, policyId, self.policyType, self.effectiveDate).then(function(detail){
				 //if got respeonse data
				 if(self.isSuccess(detail)){
					 self.detail = detail;
					 self.jsonToArray( self.findElementInDetail_V3(['PolicyOwner']), 'person:IDs' , 'person:ID');
					 self.jsonToArray( self.findElementInDetail_V3(['MainDriver']),  'person:IDs' , 'person:ID');
					 self.jsonToArray( self.findElementInDetail_V3(['PolicyOwner']),  'person:Contacts' , 'person:Contact');
					 self.jsonToArray( self.detail,  'OptionalCoverages' , 'OptionalCoverage');
					 
					 //get
					 self.POIDs = self.findElementInDetail_V3(['PolicyOwner', 'person:ID']);
					 self.MDIDs = self.findElementInDetail_V3(['MainDriver', 'person:ID']);
					 self.POContacts = self.findElementInDetail_V3(['PolicyOwner','person:Contact']);
					 self.AdditionalCoverages = self.findElementInDetail_V3(['OptionalCoverages','OptionalCoverage']);
					 
					 deferred.resolve(detail);
				 }
				 else{
					 commonUIService.showNotifyMessage("v3.style.message.ErrorGettingPolicyDetail", "fail");
				 }
			 }); 
		 }else{
			 policyCoreService.getDocumentDetail_V3(resourceURL, policyId).then(function(detail){
				 if(self.isSuccess(detail)){
					 self.detail = detail;
					 self.jsonToArray( self.findElementInDetail_V3(['PolicyOwner']), 'person:IDs' , 'person:ID');
					 self.jsonToArray( self.findElementInDetail_V3(['MainDriver']),  'person:IDs' , 'person:ID');
					 self.jsonToArray( self.detail,  'OptionalCoverages' , 'OptionalCoverage');
					 
					 //get
					 self.POIDs = self.findElementInDetail_V3(['PolicyOwner', 'person:ID']);
					 self.MDIDs = self.findElementInDetail_V3(['MainDriver', 'person:ID']);
					 self.POContacts = self.findElementInDetail_V3(['PolicyOwner','person:Contact']);
					 self.AdditionalCoverages = self.findElementInDetail_V3(['OptionalCoverages','OptionalCoverage']);
					 
					 deferred.resolve(detail);
				 }
				 else{
					 commonUIService.showNotifyMessage("v3.style.message.ErrorGettingPolicyDetail", "fail");
				 }
			 });
		 }
	 return  deferred.promise;
	 };
	 
	 //set value for policy owner in policy detail by client  detail
	 policyUIService.prototype.getPolicyOwnerDetail_V3 = function(){
		 var self = this;
		 //set value for policyOwner
		 self.findElementInDetail_V3(['PolicyOwner', 'person:Title']).Value = self.findElementInElement_V3(self.PODetail, ['person:Title']).Value;
		 //self.findElementInDetail_V3(['PolicyOwner', 'person:FullName']).$ = self.findElementInElement_V3(self.PODetail, ['person:FullName']).$;
		 self.findElementInDetail_V3(['PolicyOwner', 'person:BirthDate']).$ = self.findElementInElement_V3(self.PODetail, ['person:BirthDate']).$;
		 self.findElementInDetail_V3(['PolicyOwner', 'person:Gender']).Value = self.findElementInElement_V3(self.PODetail, ['person:Gender']).Value;
		 self.findElementInDetail_V3(['PolicyOwner', 'person:MaritalStatus']).Value = self.findElementInElement_V3(self.PODetail, ['person:MaritalStatus']).Value;
		 self.findElementInDetail_V3(['PolicyOwner', 'person:Nationality']).Value = self.findElementInElement_V3(self.PODetail, ['person:Nationality']).Value;
		 self.findElementInDetail_V3(['PolicyOwner'])['person:IDs'] =self.findElementInElement_V3(self.PODetail, ['person:IDs']);
		 self.findElementInDetail_V3(['PolicyOwner'])['person:Contacts'] =self.findElementInElement_V3(self.PODetail, ['person:Contacts']);
		 //self.findElementInDetail_V3(['PolicyOwner'])['person:Addresses'] =self.findElementInElement_V3(self.PODetail, ['person:Addresses']);
	 };
	
	policyUIService.prototype.translateNodes=function(productName, data){
	   	var self = this;
    	if (productName == 'motor-private-car-m'){
    		self.translateLazyListField(data,'MDGender','v3.gender.enum.');
    		self.translateLazyListField(data,'SmokeStatus','v3.smoker.enum.');
    		self.translateLazyListField(data,'Staff','v3.yesno.enum.');
	   		self.translateLazyListField(data,'Vip','v3.yesno.enum.');
	   		self.translateLazyListField(data,'MDMarialStatus','v3.application.motor.maritalStatus.');
    	}
    };
    
    policyUIService.prototype.renewPolicy= function(resourceURL, effectiveDate){
		var self = this;
		self.maxDaysAllowedToRenewal = commonService.options.maxDayToRenew;
		var policyStatus = self.findElementInDetail_V3(['DocStatus']).BusinessStatus;
		var expiryDate = self.findElementInDetail_V3(['ExpiryDate']).$;
   		if (!commonService.hasValueNotEmpty(effectiveDate))
   				effectiveDate = commonService.hasValueNotEmpty(self.findElementInDetail_V3(['EffectiveDate']).$) ? self.findElementInDetail_V3(['EffectiveDate']).$ : undefined ;
//        if (effectiveDate == undefined){// delete later
//        	effectiveDate = "2015-01-30";
//        }
        var numberOfDaysLeft = dateDiffFromToday(expiryDate, "today");
        //TODO
//        numberOfDaysLeft = 0; //delete after testing time
        var policyNo = self.findElementInDetail_V3(["PolicyNo"]).$;
        var product = self.findElementInDetail_V3(['Product']);
        
        if (policyStatus == "IF" || policyStatus == "In Force") {
        	if (numberOfDaysLeft < self.maxDaysAllowedToRenewal) {
/*        		salecaseUIService.getPolicyDocWithAction(resourceURL, commonService.CONSTANTS.ACTIONTYPE.RENEWAL, self.metaData.Contract_Number, self.metaData.Contract_Type, self.metaData.Effective_Date).then(function() {
        			salecaseUIService.detail = {"IposDocument":{"@xmlns":"http:\/\/www.csc.com\/integral\/common","@xmlns:case-management-motor":"http:\/\/www.csc.com\/integral\/case-management-motor","@xmlns:xsi":"http:\/\/www.w3.org\/2001\/XMLSchema-instance","@xsi:schemaLocation":"http:\/\/www.csc.com\/integral\/case-management-motor case-management-motor-private-car-m-as-document.xsd ","Header":{"DocInfo":{"DocType":"case-management","Product":"motor-private-car-m-as","DefUid":"2c1511e7-9436-45ce-9759-23a78468a6ea","DocId":"30478324-2bb1-4e97-95ee-151c0db6c331","DocName":"case-management-DefaultName","DocVersion":"","OwnerUid":"agent3@ipos.com","CreatedDate":"2015-11-27 18-20-35","UpdatedDate":"2015-11-27 18-20-35","UpdatedUserUid":"","Tags":"","Star":"","Archived":"","Comments":""},"DocAccessControllList":{"User":{"@userid":"","Permisions":{"Permision":""}}},"DocStatus":{"DocumentStatus":"","BusinessStatus":"DRAFT"}},"Data":{"case-management-motor:CaseManagement":{"@case-name":"Renewal","@product":"motor-private-car-m-as","@vpms-suffix":"CaseManagement","case-management-motor:Renewal":{"@vpms-suffix":"Renewal","case-management-motor:MsgStatus":{"@vpms-suffix":"MsgStatus","case-management-motor:MsgStatusCd":{"@vpms-suffix":"MsgStatusCd","Options":{"Option":""},"Value":""},"case-management-motor:MsgErrorCd":{"@vpms-suffix":"MsgErrorCd","Options":{"Option":""},"Value":""},"case-management-motor:MsgStatusDesc":{"@vpms-suffix":"MsgStatusDesc"},"case-management-motor:PendingResponseAvailDt":{"@vpms-suffix":"PendingResponseAvailDt"},"case-management-motor:PendingResponseExpDt":{"@vpms-suffix":"PendingResponseExpDt"},"case-management-motor:ExtendedStatuses":{"@counter":"0","@maxOccurs":"","@minOccurs":"0","@vpms-suffix":"ExtendedStatuses","case-management-motor:ExtendedStatus":{"@vpms-suffix":"ExtendedStatus","case-management-motor:ExtendedStatusCd":{"@vpms-suffix":"ExtendedStatusCd","Options":{"Option":""},"Value":""},"case-management-motor:ExtendedStatusDesc":{"@vpms-suffix":"ExtendedStatusDesc"},"case-management-motor:MissingElementPath":{"@vpms-suffix":"MissingElementPath"}}}},"case-management-motor:SubmitChannel":{"@vpms-suffix":"RSubmitChannel"},"case-management-motor:Doctypes":{"@vpms-suffix":"RDoctypes","case-management-motor:Prospects":{"@counter":"0","@maxOccurs":"","@minOccurs":"0","@vpms-suffix":"RProspects","case-management-motor:Prospect":{"@refDocType":"prospect","@refUid":"","@vpms-suffix":"RProspect","case-management-motor:ProspectId":{"@vpms-suffix":"RProspectId"},"case-management-motor:ProspectRole":{"@vpms-suffix":"RProspectRole"}}},"case-management-motor:Quotation":{"@refDocType":"illustration;product=motor-private-car-m-as","@refUid":"9ecb3429-f17c-43cf-97a7-9bab5949bb9b","@vpms-suffix":"RQuotation","case-management-motor:QuotationId":{"@vpms-suffix":"RQuotationId"}},"case-management-motor:Application":{"@refDocType":"application;product=motor-private-car-m-as","@refUid":"","@vpms-suffix":"RApplication","case-management-motor:ApplicationId":{"@vpms-suffix":"RApplicationId"}},"case-management-motor:Policy":{"@refDocType":"policy;product=motor-private-car-m-as","@refUid":"","@vpms-suffix":"RPolicy","case-management-motor:PolicyId":{"@vpms-suffix":"RPolicyId","$":"d44c52f8-7a96-45a8-8a04-ef44d5719f63"},"case-management-motor:PolicyNumber":{"@vpms-suffix":"RPolicyNumber","$":"V0001514"},"case-management-motor:ClientNumber":{"@vpms-suffix":"RClientNumber","$":"0002147"}},"case-management-motor:Payment":{"@refDocType":"payment","@refUid":"","@vpms-suffix":"RPayment","case-management-motor:PaymentNo":{"@vpms-suffix":"RPaymentNo"},"case-management-motor:SumInsured":{"@vpms-suffix":"RSumInsured"},"case-management-motor:POName":{"@vpms-suffix":"RPOName"},"case-management-motor:Premium":{"@vpms-suffix":"RPremium"},"case-management-motor:PaymentMethod":{"@vpms-suffix":"RPaymentMethod"},"case-management-motor:ReceiptNumber":{"@vpms-suffix":"RReceiptNumber"}},"case-management-motor:Review":{"@refDocType":"review","@refUid":"","@vpms-suffix":"RReview","case-management-motor:ReviewId":{"@vpms-suffix":"RReviewId"}},"case-management-motor:eCoverNotes":{"@counter":"0","@maxOccurs":"10","@minOccurs":"0","@vpms-suffix":"ReCoverNotes","case-management-motor:eCoverNote":{"@refDocType":"ecovernote;product=motor-private-car-m-as","@refUid":"","@vpms-suffix":"ReCoverNote","case-management-motor:eCoverNoteId":{"@vpms-suffix":"ReCoverNoteId"},"case-management-motor:eCoverNoteStatus":{"@vpms-suffix":"ReCoverNoteStatus"}}},"case-management-motor:Underwriting":{"@refDocType":"underwriting;product=motor-private-car-m-as","@refUid":"","@vpms-suffix":"RUnderwriting","case-management-motor:UnderwritingId":{"@vpms-suffix":"RUnderwritingId"}}},"case-management-motor:Prints":{"@counter":"0","@maxOccurs":"","@minOccurs":"0","@vpms-suffix":"Prints","case-management-motor:Print":{"@refResourceDocType":"","@refResourceUid":"","@vpms-suffix":"Print","case-management-motor:PrintID":{"@vpms-suffix":"PrintID"},"case-management-motor:PrintDoctype":{"@vpms-suffix":"PrintDoctype"}}},"Attachments":{"@counter":"0","@maxOccurs":"","@minOccurs":"0","@vpms-suffix":"Attachments","Attachment":{"@refResourceDocType":"","@refResourceUid":"","@vpms-suffix":"Attachment","FileUid":{"@default":"","@editable":"0","@mandatory":"0","@refResourceStatus":"","@refResourceVal":"","@validate":"","@visible":"1","@vpms-suffix":"FileUid"},"Name":{"@default":"","@editable":"0","@mandatory":"0","@refResourceStatus":"","@refResourceVal":"","@validate":"","@visible":"1","@vpms-suffix":"Name"},"FileName":{"@default":"","@editable":"0","@mandatory":"0","@refResourceStatus":"","@refResourceVal":"","@validate":"","@visible":"1","@vpms-suffix":"FileName"},"CreateDate":{"@default":"","@editable":"0","@mandatory":"0","@refResourceStatus":"","@refResourceVal":"","@validate":"","@visible":"1","@vpms-suffix":"CreateDate"},"FileSize":{"@default":"","@editable":"0","@mandatory":"0","@refResourceStatus":"","@refResourceVal":"","@validate":"","@visible":"1","@vpms-suffix":"FileSize"}}}}}}}};
        			if (salecaseUIService.detail.IposDocument) {
                    	salecaseUIService.detail['IposDocument']['Header']['DocInfo']['DocName'] = salecaseUIService.genDefaultName();
                        var metaCard = {DocType:'case-management', Product:product, DocId: salecaseUIService.detail.IposDocument.Header.DocInfo.DocId, CaseName:'Renewal'};
                        salecaseUIService.saveDetail_V3(resourceURL, true).then(function(data) {
                            console.log("Save renewal Responsed");
                            metaCard.Product  = "motor-private-car-m-as";//delete later
                            commonUIService.goToPortlet("NEW_MY_WORKSPACE", metaCard);
                        });
                    } else {
                        commonUIService.showNotifyMessage("v3.transactioncenter.message.Errorhasoccured");
                        $scope.isLoaded = true;
                        $scope.isSaveFinished = true;
                    }
        		});*/
        		var metaCard = {DocType:'case-management', Product:product, PolicyNum: policyNo, BusinessType:'renewal', EffectiveDate: effectiveDate, CaseName:'renewal', isCreateNewDocument: true};
//        		metaCard.Product  = "motor-private-car-m-as";//delete later
//        		metaCard.EffectiveDate  = "2013-01-13";//delete later
                commonUIService.goToPortlet("NEW_MY_WORKSPACE", metaCard);
        	}
        	else {
                //add variable to error message
                var data = "MSG-519;" + self.maxDaysAllowedToRenewal;
                commonUIService.showNotifyMessage(data);
            }
        }
        else { //policy is not inforced
        	commonUIService.showNotifyMessage(data);
        }
        function dateDiffFromToday(dateStart, dateEnd) {
            var today = moment(moment().format("YYYY-MM-DD"));
            var expiryDate = moment(dateStart);
            var diffInDays = expiryDate.diff(today, 'days');
            return diffInDays;
        }
	 };
	 
	 policyUIService.prototype.doEndorse = function(eReason) { //click button OK in Endorsement Option Select
		 var self = this;
		 var policyStatus = self.findElementInDetail_V3(['DocStatus']).BusinessStatus;
		 var product = self.findElementInDetail_V3(['Product']);
		 var effectiveDate = self.findElementInDetail_V3(['EffectiveDate']).$;
		 if(!effectiveDate){
			 effectiveDate = self.effectiveDate;
		 }
		 
		 //only enale this function if policy is in force
		 if (policyStatus == "IF" || policyStatus == "In Force") {
			 //          salecaseUIService.product = "motor-private-car-m-as";
			 var eNote = salecaseUIService.findGroupInMapListByValue(self.endorsementReason, 'EReason', eReason);
			 var policyNo = self.findElementInDetail_V3(["PolicyNo"]).$;
			 localStorage.setItem("endorsementReason", eReason);
			 localStorage.setItem("endorsementNote", eNote);
			 var businessType = "endorsement";

			 
			 var metaCard = {DocType:'case-management', Product:product, PolicyNum: policyNo, BusinessType: businessType, EffectiveDate: effectiveDate, CaseName:'endorsement', isCreateNewDocument: true};
//			 metaCard.Product  = "motor-private-car-m-as";//delete later
//     		 metaCard.EffectiveDate  = "2013-01-13";//delete later
     		commonUIService.goToPortlet("NEW_MY_WORKSPACE", metaCard);
		 } else { //policy is not inforced
			 commonUIService.showNotifyMessage('MSG-516');
		 }
		 
	 };
	 
	 policyUIService.prototype.policyServicing = function(eReason) { //click button OK in PolicyServicing Option Select
		 var self = this;
		 var policyStatus = self.findElementInDetail_V3(['DocStatus']).BusinessStatus;
		 var product = self.findElementInDetail_V3(['Product']);
		 var effectiveDate = self.findElementInDetail_V3(['EffectiveDate']).$;
		 localStorage.setItem("policyServicingReason", eReason);
		 
		 if(!effectiveDate){
			 effectiveDate = self.effectiveDate;
		 }
		 
		 //only enale this function if policy is in force
		 if (policyStatus == "IF" || policyStatus == "In Force") {
			 //          salecaseUIService.product = "motor-private-car-m-as";
		
			 var policyNo = self.findElementInDetail_V3(["PolicyNo"]).$;
			 var businessType = "PolicyServicing";
			 var policyOwnerId = self.findElementInDetail_V3(["PolicyOwner"])["@refUid"];
			 var lifeInsuredId = self.findElementInDetail_V3(["LifeInsured"])["@refUid"];
			 var billedToDate = self.findElementInDetail_V3(['BillToDate']).$;
			 var paidToDate = self.findElementInDetail_V3(['PaidToDate']).$;
			 
			 //cant add beneficiary when PO <> LI
			 if(policyOwnerId != lifeInsuredId && eReason === "addBeneficiary"){
				 commonUIService.showNotifyMessage("v3.transactioncenter.label.Error" , "fail");
				 return;
			 }
			 
			 if((billedToDate !== paidToDate) && (eReason === "changePremiumFrequency")){
				 commonUIService.showNotifyMessage("v3.transactioncenter.label.Error" , "fail");
				 return;
			 }
	
			 
			 var metaCard = {DocType:'case-management', Product:product, PolicyNum: policyNo, BusinessType: businessType, EffectiveDate: effectiveDate, CaseName:'endorsement', isCreateNewDocument: true};
     		commonUIService.goToPortlet("NEW_MY_WORKSPACE", metaCard);
		 } else { //policy is not inforced
			 commonUIService.showNotifyMessage('MSG-516');
		 }
		 
	 };
	 
	 
	 //set value for policy owner in policy detail by client  detail
	 policyUIService.prototype.getClientsList_V3 = function(resourceURL){
		 var self = this;
		 var deferred = self.$q.defer();
			 policyCoreService.getClientList(resourceURL).then(function(detail){
				 //if got respeonse data
				 if(self.isSuccess(detail)){
				
					 deferred.resolve(detail);
				 }
				 else{
					 commonUIService.showNotifyMessage("v3.style.message.ErrorGettingClientList", "fail");
				 }
			 }); 
	
	 return  deferred.promise;
	 };

	 policyUIService.prototype.doClaimNotification = function() {
        var self = this;
        var policyNo = self.findElementInDetail_V3(["PolicyNo"]).$;
        var policyOwner = self.findElementInDetail_V3(["PolicyOwner","FullName"]).$;
        var policyType = self.findElementInDetail_V3(['Product']);
        var metaCard = {DocType:"claim-notification", Product:undefined, BusinessType: undefined, PolicyNum: policyNo, policyType:policyType, policyOwner:policyOwner, EffectiveDate: self.effectiveDate, isCreateNewDocument: true};
//        metaCard.Product  = undefined;//delete later
        commonUIService.goToPortlet("NEW_MY_WORKSPACE", metaCard);
    };
    
    policyUIService.prototype.getLazyChoiceList = function(resourceURL, productName) {
    	var self = this;
    	self.lazyChoiceList = {};
    	self.getLazyChoiceListByModuleAndProduct_V3(resourceURL, productName).then(function(result) {
        	if (commonService.hasValueNotEmpty(productName)){
        		self.lazyChoiceList[productName] = result;
        	}
        	else
        		self.lazyChoiceList = result;
        });
    };
	    
	return new policyUIService($q, ajax, $injector, $location, appService, cacheService, policyCoreService, commonService, salecaseUIService);
}]);
