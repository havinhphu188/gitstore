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

var PolicyDetailCtrl = ['$scope', '$filter', '$log', 'commonService', 'translateService', '$state', 'policyUIService', 'claimNotificationUIService', '$translate', 'commonUIService', 'salecaseUIService', 'illustrationUIService', 'prospectPersonalUIService', 'endorsementUIService', '$mdDialog', 'appService',
	function($scope, $filter, $log, commonService, translateService, $state, policyUIService, claimNotificationUIService, $translate, commonUIService, salecaseUIService, illustrationUIService, prospectPersonalUIService, endorsementUIService, $mdDialog, appService) {
    
	$scope.commonUIService = commonUIService;
    $scope.moduleService = policyUIService;
    $scope.salecaseService = salecaseUIService;
    $scope.endorsement = {
        eReason: "CV",
        eNote: "THE VEHICLE NUMBER\/DESCRIPTION IS AMENDED TO READ"
    };
    $scope.moduleService.endorsementReason = [];
//    $scope.moduleService.endorsementReason = {"LazyRestriction":{"EReason":{"Option":[{"value":"CV","group":"The engine number is amended to"},{"value":"AI","group":"        Effective with the date specified, this policy is being     endorsed to include an additional benefit........                                                                                                                                                                                                                                                                                                                               N                                                               "}]},"MsgErrorCd":"","ExtendedStatusCd":"","MsgStatusCd":"","CaseName":{"Option":[{"value":"NEW","group":""},{"value":"ENDORSEMENT","group":""},{"value":"RENEWAL","group":""}]}}};


    $scope.init = function init() {
        var self = this;
        self.html.actionBarEle = undefined;

        var productName = policyUIService.product;
        policyUIService.productName = policyUIService.product;
        salecaseUIService.product = policyUIService.product;

        if(productName === 'motor-private-car-m-as'){
            //if lazy choice not available, get lazylist if product name is changed
            if (policyUIService.oldProduct != policyUIService.product) {
                salecaseUIService.getLazyChoiceListByModuleAndProduct_V3($scope.resourceURL, productName).then(function(result) {
                    salecaseUIService.lazyChoiceList = result;
                    $scope.moduleService.endorsementReason = salecaseUIService.lazyChoiceList;
                    policyUIService.oldProduct = policyUIService.product;
                });
            } else {
                $scope.moduleService.endorsementReason = salecaseUIService.lazyChoiceList;
            }

            if (!commonService.hasValueNotEmpty(illustrationUIService.lazyChoiceList[policyUIService.product])) {
                illustrationUIService.getIllustrationLazyList($scope.resourceURL, policyUIService.product).then(function(data) {
                    $scope.setMakeModel(data);
                    /*      var makeModel = illustrationUIService.findElementInElement_V3(data, ['MakeOrModel']).Option;
                            var madeModelCode = policyUIService.findElementInDetail_V3(['VehicleInformation', 'motor:MakeOrModel']).Value;
                            
                            var i = 0;
                            for (i = 0; i < makeModel.length; ++i) {
                                if(makeModel[i].value == madeModelCode){
                                    var modelDesc =  makeModel[i].group.split(";")[0];
                                    policyUIService.findElementInDetail_V3(['VehicleInformation', 'motor:MakeOrModel']).Value = makeModel[i].translate;
                                    policyUIService.findElementInDetail_V3(['VehicleInformation', 'motor:ModelDescription']).$ = modelDesc;
                                     break; 
                                }
                            }*/


                });
            } else {

                $scope.setMakeModel(illustrationUIService.lazyChoiceList[policyUIService.product]);

            }    
        }
        
        if(productName === 'FIR'){
            policyUIService.getLazyChoiceList($scope.resourceURL, productName);
        }

        self.generalConfigCtrl('PolicyDetailCtrl', policyUIService);



    };

    $scope.setMakeModel = function(data) {
        var makeModel = illustrationUIService.findElementInElement_V3(data, ['MakeOrModel']).Option;
        var madeModelCode = policyUIService.findElementInDetail_V3(['VehicleInformation', 'motor:MakeOrModel']).Value;

        var i = 0;
        for (i = 0; i < makeModel.length; ++i) {
            if (makeModel[i].value == madeModelCode) {
                var modelDesc = makeModel[i].group.split(";")[0];
                policyUIService.findElementInDetail_V3(['VehicleInformation', 'motor:MakeOrModel']).Value = makeModel[i].translate;
                policyUIService.findElementInDetail_V3(['VehicleInformation', 'motor:ModelDescription']).$ = modelDesc;
                break;
            }
        }
    }

    $scope.resourceURL = policyUIService.initialPortletURL(myArrayPortletId["my-new-workspace"]);

    $scope.init();

    $scope.selectReason = function(eReason) { //click button OK in Endorsement Option Select
        var self = this;
        var policyStatus = self.moduleService.findElementInDetail_V3(['DocStatus']).BusinessStatus;

        //only enale this function if policy is in force
        if (policyStatus == "IF") {
            //          salecaseUIService.product = "motor-private-car-m-as";
            var eNote = salecaseUIService.findGroupInMapListByValue(salecaseUIService.lazyChoiceList, 'EReason', eReason);
            var policyNo = policyUIService.findElementInDetail_V3(["PolicyNo"]).$;
            localStorage.setItem("endorsementReason", eReason);
            localStorage.setItem("endorsementNote", eNote);
            return self.createNewDocument("case-management", salecaseUIService.product, "endorsement", undefined, {
                policyNum: policyNo,
                effectiveDate: self.moduleService.effectiveDate
            });
        } else { //policy is not inforced
            commonUIService.showNotifyMessage('MSG-516');
        }

    };

    /*$scope.test = function(){
        commonService.showGlobalMessage(appService.getI18NText('workspace.archive.success'));
    }*/


    //substract days to get number of days 
    $scope.dateDiffFromToday = function(dateStart, dateEnd) {
        var today = moment(moment().format("YYYY-MM-DD"));
        var expiryDate = moment(dateStart);
        var diffInDays = expiryDate.diff(today, 'days');
        return diffInDays;
    }
    
//    $scope.doAction = function(actionName) {
//    	policyUIService.doRenew($scope.resourceURL);
//    }
    $scope.doAction = function(actionName) {
        var self = this;
        var policyStatus = self.moduleService.findElementInDetail_V3(['DocStatus']).BusinessStatus;
        var policyNo = policyUIService.findElementInDetail_V3(["PolicyNo"]).$;
        var effectiveDate = policyUIService.findElementInDetail_V3(['EffectiveDate']).$;
        var expiryDate = policyUIService.findElementInDetail_V3(['ExpiryDate']).$;
        var numberOfDaysLeft = $scope.dateDiffFromToday(expiryDate, "today");
//        numberOfDaysLeft = 0; // delete later
        //only enale this function if policy is in force
        if (policyStatus == "IF") {
            $scope.policyNum = $state.params.docId;
            salecaseUIService.group = salecaseUIService.getProductGroup_V3(salecaseUIService.product);
            //force reload state
            if (actionName == commonService.CONSTANTS.ACTIONTYPE.RENEWAL) {
                //if expiry date less than 7
               	if (numberOfDaysLeft < policyUIService.maxDaysAllowedToRenewal) {
                    salecaseUIService.getPolicyDocWithAction($scope.resourceURL, actionName, $scope.policyNum, self.moduleService.policyType, self.moduleService.effectiveDate).then(function() {
                        //              salecaseUIService.detail = {"IposDocument":{"@xmlns":"http://www.csc.com/integral/common","@xmlns:case-management-motor":"http://www.csc.com/integral/case-management-motor","@xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance","@xsi:schemaLocation":"http://www.csc.com/integral/case-management-motor case-management-motor-private-car-m-as-document.xsd ","Header":{"DocInfo":{"DocType":"case-management","Product":"motor-private-car-m-as","DefUid":"2c1511e7-9436-45ce-9759-23a78468a6ea","DocId":"49a9d117-02c2-4baa-81a2-c64806ce2761","DocName":"case-management-DefaultName","DocVersion":"","OwnerUid":"agent1@ipos.com","CreatedDate":"2015-10-08 13-21-40","UpdatedDate":"2015-10-08 13-21-40","UpdatedUserUid":"","Tags":"","Star":"","Archived":"","Comments":""},"DocAccessControllList":{"User":{"@userid":"","Permisions":{"Permision":""}}},"DocStatus":{"DocumentStatus":"","BusinessStatus":"DRAFT"}},"Data":{"case-management-motor:CaseManagement":{"@case-name":"Renewal","@product":"motor-private-car-m-as","@vpms-suffix":"CaseManagement","case-management-motor:Renewal":{"@vpms-suffix":"Renewal","case-management-motor:MsgStatus":{"@vpms-suffix":"MsgStatus","case-management-motor:MsgStatusCd":{"@vpms-suffix":"MsgStatusCd","Options":{"Option":""},"Value":""},"case-management-motor:MsgErrorCd":{"@vpms-suffix":"MsgErrorCd","Options":{"Option":""},"Value":""},"case-management-motor:MsgStatusDesc":{"@vpms-suffix":"MsgStatusDesc"},"case-management-motor:PendingResponseAvailDt":{"@vpms-suffix":"PendingResponseAvailDt"},"case-management-motor:PendingResponseExpDt":{"@vpms-suffix":"PendingResponseExpDt"},"case-management-motor:ExtendedStatus":{"@vpms-suffix":"ExtendedStatus","case-management-motor:ExtendedStatusCd":{"@vpms-suffix":"ExtendedStatusCd","Options":{"Option":""},"Value":""},"case-management-motor:ExtendedStatusDesc":{"@vpms-suffix":"ExtendedStatusDesc"},"case-management-motor:MissingElementPath":{"@vpms-suffix":"MissingElementPath"}}},"case-management-motor:SubmitChannel":{"@vpms-suffix":"RSubmitChannel"},"case-management-motor:Doctypes":{"@vpms-suffix":"RDoctypes","case-management-motor:Prospects":{"@counter":"0","@maxOccurs":"","@minOccurs":"0","@vpms-suffix":"RProspects","case-management-motor:Prospect":{"@refDocType":"prospect","@refUid":"","@vpms-suffix":"RProspect","case-management-motor:ProspectId":{"@vpms-suffix":"RProspectId"},"case-management-motor:ProspectRole":{"@vpms-suffix":"RProspectRole"}}},"case-management-motor:Quotation":{"@refDocType":"illustration;product=motor-private-car-m-as","@refUid":"060fca09-1213-4753-abe7-8f8ebdb8475a","@vpms-suffix":"RQuotation","case-management-motor:QuotationId":{"@vpms-suffix":"RQuotationId"}},"case-management-motor:Application":{"@refDocType":"application;product=motor-private-car-m-as","@refUid":"","@vpms-suffix":"RApplication","case-management-motor:ApplicationId":{"@vpms-suffix":"RApplicationId"}},"case-management-motor:Policy":{"@refDocType":"policy;product=motor-private-car-m-as","@refUid":"","@vpms-suffix":"RPolicy","case-management-motor:PolicyId":{"@vpms-suffix":"RPolicyId","$":"af6a41bb-459c-4cbb-bb67-fb9e1f122e76"},"case-management-motor:PolicyNumber":{"@vpms-suffix":"RPolicyNumber","$":"V0001463"},"case-management-motor:ClientNumber":{"@vpms-suffix":"RClientNumber","$":"50001370"},"case-management-motor:SubmissionMessage":{"@vpms-suffix":"RSubmissionMessage"}},"case-management-motor:Payment":{"@refDocType":"payment","@refUid":"","@vpms-suffix":"RPayment","case-management-motor:PaymentNo":{"@vpms-suffix":"RPaymentNo"},"case-management-motor:SumInsured":{"@vpms-suffix":"RSumInsured"},"case-management-motor:POName":{"@vpms-suffix":"RPOName"},"case-management-motor:Premium":{"@vpms-suffix":"RPremium"},"case-management-motor:PaymentMethod":{"@vpms-suffix":"RPaymentMethod"},"case-management-motor:ReceiptNumber":{"@vpms-suffix":"RReceiptNumber"}},"case-management-motor:Review":{"@refDocType":"review","@refUid":"","@vpms-suffix":"RReview","case-management-motor:ReviewId":{"@vpms-suffix":"RReviewId"}}},"case-management-motor:Prints":{"@counter":"0","@maxOccurs":"","@minOccurs":"0","@vpms-suffix":"Prints","case-management-motor:Print":{"@vpms-suffix":"Print","case-management-motor:PrintID":{"@vpms-suffix":"PrintID"},"case-management-motor:PrintDoctype":{"@vpms-suffix":"PrintDoctype"}}},"Attachments":{"@vpms-suffix":"Attachments","Attachment":{"@refResourceDocType":"","@refResourceUid":"","@vpms-suffix":"Attachment","FileUid":{"@refResourceStatus":"","@refResourceVal":"","@vpms-suffix":"FileUid"},"Name":{"@refResourceStatus":"","@refResourceVal":"","@vpms-suffix":"Name"},"FileName":{"@refResourceStatus":"","@refResourceVal":"","@vpms-suffix":"FileName"},"CreateDate":{"@refResourceStatus":"","@refResourceVal":"","@vpms-suffix":"CreateDate"},"FileSize":{"@refResourceStatus":"","@refResourceVal":"","@vpms-suffix":"FileSize"}}}}}}}};
                        //              salecaseUIService.detail = {"IposDocument":{"@xmlns":"http://www.csc.com/integral/common","@xmlns:case-management-motor":"http://www.csc.com/integral/case-management-motor","@xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance","@xsi:schemaLocation":"http://www.csc.com/integral/case-management-motor case-management-motor-private-car-m-as-document.xsd ","Header":{"DocInfo":{"DocType":"case-management","Product":"motor-private-car-m-as","DefUid":"2c1511e7-9436-45ce-9759-23a78468a6ea","DocId":"0f785fc3-60db-4631-9629-27b28833bb01","DocName":"SC09079494","DocVersion":"","OwnerUid":"agent1@ipos.com","CreatedDate":"2015-10-13 17-55-53","UpdatedDate":"2015-10-13 17-59-15","UpdatedUserUid":"agent1@ipos.com","Tags":"","Star":"","Archived":"","Comments":""},"DocAccessControllList":{"User":{"@userid":"","Permisions":{"Permision":""}}},"DocStatus":{"DocumentStatus":"","BusinessStatus":"FAILED"}},"Data":{"case-management-motor:CaseManagement":{"@case-name":"Renewal","@product":"motor-private-car-m-as","@vpms-suffix":"CaseManagement","case-management-motor:Renewal":{"@vpms-suffix":"Renewal","case-management-motor:MsgStatus":{"@vpms-suffix":"MsgStatus","case-management-motor:MsgStatusCd":{"@vpms-suffix":"MsgStatusCd","Options":{"Option":""},"Value":""},"case-management-motor:MsgErrorCd":{"@vpms-suffix":"MsgErrorCd","Options":{"Option":""},"Value":""},"case-management-motor:MsgStatusDesc":{"@vpms-suffix":"MsgStatusDesc"},"case-management-motor:PendingResponseAvailDt":{"@vpms-suffix":"PendingResponseAvailDt"},"case-management-motor:PendingResponseExpDt":{"@vpms-suffix":"PendingResponseExpDt"},"case-management-motor:ExtendedStatuses":{"@counter":"0","@maxOccurs":"","@minOccurs":"0","@vpms-suffix":"ExtendedStatuses","case-management-motor:ExtendedStatus":{"@vpms-suffix":"ExtendedStatus","case-management-motor:ExtendedStatusCd":{"@vpms-suffix":"ExtendedStatusCd","Options":{"Option":""},"Value":"F763"},"case-management-motor:ExtendedStatusDesc":{"@vpms-suffix":"ExtendedStatusDesc","$":"Can't renew, endrsm pndg"},"case-management-motor:MissingElementPath":{"@vpms-suffix":"MissingElementPath","$":"S4053.cownsel"}}}},"case-management-motor:SubmitChannel":{"@vpms-suffix":"RSubmitChannel"},"case-management-motor:Doctypes":{"@vpms-suffix":"RDoctypes","case-management-motor:Prospects":{"@counter":"0","@maxOccurs":"","@minOccurs":"0","@vpms-suffix":"RProspects","case-management-motor:Prospect":{"@refDocType":"prospect","@refUid":"","@vpms-suffix":"RProspect","case-management-motor:ProspectId":{"@vpms-suffix":"RProspectId"},"case-management-motor:ProspectRole":{"@vpms-suffix":"RProspectRole"}}},"case-management-motor:Quotation":{"@refDocType":"illustration;product=motor-private-car-m-as","@refUid":"daf3f2a2-362c-4172-9763-f51ed5881bef","@vpms-suffix":"RQuotation","case-management-motor:QuotationId":{"@vpms-suffix":"RQuotationId","$":"daf3f2a2-362c-4172-9763-f51ed5881bef"}},"case-management-motor:Application":{"@refDocType":"application;product=motor-private-car-m-as","@refUid":"","@vpms-suffix":"RApplication","case-management-motor:ApplicationId":{"@vpms-suffix":"RApplicationId","$":""}},"case-management-motor:Policy":{"@refDocType":"policy;product=motor-private-car-m-as","@refUid":"","@vpms-suffix":"RPolicy","case-management-motor:PolicyId":{"@vpms-suffix":"RPolicyId","$":"f4395be7-3d2d-4968-9858-d7e1e6bcb923"},"case-management-motor:PolicyNumber":{"@vpms-suffix":"RPolicyNumber","$":"V0001059"},"case-management-motor:ClientNumber":{"@vpms-suffix":"RClientNumber","$":"50001432"}},"case-management-motor:Payment":{"@refDocType":"payment","@refUid":"","@vpms-suffix":"RPayment","case-management-motor:PaymentNo":{"@vpms-suffix":"RPaymentNo"},"case-management-motor:SumInsured":{"@vpms-suffix":"RSumInsured"},"case-management-motor:POName":{"@vpms-suffix":"RPOName"},"case-management-motor:Premium":{"@vpms-suffix":"RPremium"},"case-management-motor:PaymentMethod":{"@vpms-suffix":"RPaymentMethod"},"case-management-motor:ReceiptNumber":{"@vpms-suffix":"RReceiptNumber"}},"case-management-motor:Review":{"@refDocType":"review","@refUid":"","@vpms-suffix":"RReview","case-management-motor:ReviewId":{"@vpms-suffix":"RReviewId"}}},"case-management-motor:Prints":{"@counter":"2","@maxOccurs":"","@minOccurs":"0","@vpms-suffix":"Prints","case-management-motor:Print":[{"@vpms-suffix":"Print","case-management-motor:PrintID":{"@vpms-suffix":"PrintID","$":"f9a42346-b692-4f7a-a662-bd093308ad3d"},"case-management-motor:PrintDoctype":{"@vpms-suffix":"PrintDoctype","$":"application"}},{"@vpms-suffix":"Print","case-management-motor:PrintID":{"@vpms-suffix":"PrintID","$":"3e14614c-0ca3-4327-8d5c-832d1ebf2cee"},"case-management-motor:PrintDoctype":{"@vpms-suffix":"PrintDoctype","$":"illustration"}}]},"Attachments":{"@vpms-suffix":"Attachments","Attachment":{"@refResourceDocType":"","@refResourceUid":"","@vpms-suffix":"Attachment","FileUid":{"@refResourceStatus":"","@refResourceVal":"","@vpms-suffix":"FileUid"},"Name":{"@refResourceStatus":"","@refResourceVal":"","@vpms-suffix":"Name"},"FileName":{"@refResourceStatus":"","@refResourceVal":"","@vpms-suffix":"FileName"},"CreateDate":{"@refResourceStatus":"","@refResourceVal":"","@vpms-suffix":"CreateDate"},"FileSize":{"@refResourceStatus":"","@refResourceVal":"","@vpms-suffix":"FileSize"}}}}}}}};
                        if (salecaseUIService.isSuccess(salecaseUIService.detail)) {
                        	/*salecaseUIService.detail['IposDocument']['Header']['DocInfo']['DocName'] = salecaseUIService.genDefaultName();
                        	salecaseUIService.cloneProspect = angular.copy(salecaseUIService.findElementInDetail_V3(['Prospect']));
                            $scope.salecaseUid = salecaseUIService.detail.IposDocument.Header.DocInfo.DocId;*/
                            //force reload state
                        	
                        	var caseEle = salecaseUIService.findElementInDetail_V3(['CaseManagement']);
                        	if(commonService.hasValue(caseEle) && commonService.hasValue(caseEle['@channel'])) {
                        		caseEle['@channel'] = commonUIService.getActiveSaleChannel();
                        	}
                        	
                            //salecaseUIService.saveDetail_V3($scope.resourceURL, true).then(function(data) {
                                $log.debug("Save renewal Responsed");
                                return self.goToState('root.list.detail', {
                                    docType: 'case-management',
                                    productName: 'motor-private-car-m-as',
                                    businessType: actionName
                                }, {
                                    reload: true
                                });
                            //});
                        } else {
                            commonUIService.showNotifyMessage("v3.transactioncenter.message.Errorhasoccured");
                            $scope.isLoaded = true;
                            $scope.isSaveFinished = true;
                        }
                    });
                } else {
                    //add variable to error message
                    var data = "MSG-519;" + policyUIService.maxDaysAllowedToRenewal;
                    commonUIService.showNotifyMessage(data);
                }
            }
            //          else showEndorsementTypeDialog();   
        } else { //policy is not inforced
            commonUIService.showNotifyMessage('MSG-516');
        }
    };

    $scope.doClaimNotification = function() {
        var self = this;
        var policyNo = policyUIService.findElementInDetail_V3(["PolicyNo"]).$;
        var policyOwner = policyUIService.findElementInDetail_V3(["person:FullName"]).$;
        var policyType = policyUIService.findElementInDetail_V3(['Product']);
        self.createNewDocument("claim-notification", undefined, undefined, undefined, {
            policyNum: policyNo,
            policyOwner: policyOwner,
            policyType: policyType
        });
    };

    //get element in json if element is object then convert to array
    $scope.findElementInArrayElement = function(detail, childArray) {
        //find result
        /* var result = $scope.test.widget.image;*/

        var result = $scope.moduleService.findElementInElement_V3(detail, [childArray]);
        var arr = [];

        //if result is not an array the convert object to array
        if (!result.length) {
            arr.push(result);
            result = arr;
        }
        return result;
    }

    /* $scope.doRenewal = function(){
        var self = this;
        salecaseUIService.product = "motor-private-car-m-as";
        $scope.isSaveFinished = false;
        //Load case management
        salecaseUIService.getPolicyDocWithAction($scope.resourceURL, 'renewal', $scope.policyNum).then(function(){
            salecaseUIService.detail = {"IposDocument":{"@xmlns":"http://www.csc.com/integral/ipos-common","@xmlns:case-management-motor":"http://www.csc.com/integral/case-management-motor","@xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance","@xsi:schemaLocation":"http://www.csc.com/integral/case-management-motor case-management-motor-private-car-m-as-model.xsd ","Header":{"DocInfo":{"DocType":"case-management","Product":"motor-private-car-m-as","DefUid":"2c1511e7-9436-45ce-9759-23a78468a6ea","DocId":"","DocName":"case-management-DefaultName","DocVersion":"","OwnerUid":"","CreatedDate":"","UpdatedDate":"","UpdatedUserUid":"","Tags":"","Star":"","Archived":"","Comments":""},"DocAccessControllList":{"User":{"@userid":"","Permisions":{"Permision":""}}},"DocStatus":{"DocumentStatus":"","BusinessStatus":""}},"Data":{"case-management-motor:CaseManagement":{"@case-name":"","@product":"motor-private-car-m-as","@vpms-suffix":"CaseManagement","case-management-motor:Renewal":{"@vpms-suffix":"Renewal","case-management-motor:SubmitChannel":{"@vpms-suffix":"RSubmitChannel"},"case-management-motor:Doctypes":{"@vpms-suffix":"RDoctypes","case-management-motor:Prospects":{"@counter":"0","@maxOccurs":"","@minOccurs":"0","@vpms-suffix":"RProspects","case-management-motor:Prospect":{"@refDocType":"prospect","@refUid":"","@vpms-suffix":"RProspect","case-management-motor:ProspectId":{"@refStatus":"","@refVal":"","@vpms-suffix":"RProspectId"},"case-management-motor:ProspectRole":{"@refStatus":"","@refVal":"","@vpms-suffix":"RProspectRole"}}},"case-management-motor:Quotation":{"@refDocType":"illustration;product=motor-private-car-m-as","@refUid":"d2d137da-91eb-440e-9383-413948ac43ee","@vpms-suffix":"RQuotation","case-management-motor:QuotationId":{"@refStatus":"","@refVal":"","@vpms-suffix":"RQuotationId"}},"case-management-motor:Application":{"@refDocType":"application;product=motor-private-car-m-as","@refUid":"","@vpms-suffix":"RApplication","case-management-motor:ApplicationId":{"@refStatus":"","@refVal":"","@vpms-suffix":"RApplicationId"}},"case-management-motor:Policy":{"@refDocType":"policy;product=motor-private-car-m-as","@refUid":"","@vpms-suffix":"RPolicy","case-management-motor:PolicyId":{"@refStatus":"","@refVal":"","@vpms-suffix":"RPolicyId"},"case-management-motor:PolicyNumber":{"@refStatus":"","@refVal":"","@vpms-suffix":"RPolicyNumber"},"case-management-motor:ClientNumber":{"@refStatus":"","@refVal":"","@vpms-suffix":"RClientNumber"},"case-management-motor:SubmissionMessage":{"@refStatus":"","@refVal":"","@vpms-suffix":"RSubmissionMessage"}},"case-management-motor:Payment":{"@refDocType":"payment","@refUid":"","@vpms-suffix":"RPayment","case-management-motor:PaymentNo":{"@refStatus":"","@refVal":"","@vpms-suffix":"RPaymentNo"},"case-management-motor:SumInsured":{"@refStatus":"","@refVal":"","@vpms-suffix":"RSumInsured"},"case-management-motor:POName":{"@refStatus":"","@refVal":"","@vpms-suffix":"RPOName"},"case-management-motor:Premium":{"@refStatus":"","@refVal":"","@vpms-suffix":"RPremium"},"case-management-motor:PaymentMethod":{"@refStatus":"","@refVal":"","@vpms-suffix":"RPaymentMethod"},"case-management-motor:ReceiptNumber":{"@refStatus":"","@refVal":"","@vpms-suffix":"RReceiptNumber"}},"case-management-motor:Review":{"@refDocType":"review","@refUid":"","@vpms-suffix":"RReview","case-management-motor:ReviewId":{"@refStatus":"","@refVal":"","@vpms-suffix":"RReviewId"}}},"case-management-motor:Prints":{"@counter":"0","@maxOccurs":"","@minOccurs":"0","@vpms-suffix":"Prints","case-management-motor:Print":{"@vpms-suffix":"Print","case-management-motor:PrintID":{"@vpms-suffix":"PrintID"},"case-management-motor:PrintDoctype":{"@vpms-suffix":"PrintDoctype"}}}}}}}};
            if(salecaseUIService.detail.IposDocument){
                $scope.salecaseUid = salecaseUIService.detail.IposDocument.Header.DocInfo.DocId;
                $scope.salecaseStatus = salecaseUIService.findElementInDetail_V3(['DocStatus']);
                $scope.salecaseStatus = 'Renewal-Approved';
                if($scope.salecaseStatus == 'Renewal-Approved'){
                    $scope.quotationUid = salecaseUIService.findElementInDetail_V3(['RDoctypes','Quotation'])['@refUid'];
                    $scope.applicationUid = salecaseUIService.findElementInDetail_V3(['RDoctypes','Application'])['@refUid'];
                    //force reload state
                    return self.goToState('root.list.detail', {docType:'case-management', productName:'motor-private-car-m-as', businessType:'Renewal'}, {reload: true});
                }else{
                    commonUIService.showNotifyMessage("Policy is not approved for renew");
                    $scope.isLoaded = true;
                    $scope.isSaveFinished = true;
                }
            }else{
                commonUIService.showNotifyMessage("Error has occured");
                $scope.isLoaded = true;
                $scope.isSaveFinished = true;
            }
        });
    }
    
    $scope.doEndore = function(){
        var self = this;
        salecaseUIService.product = "motor-private-car-m-as";
        return self.goToState('root.list.detail', {docType:'case-management', productName:'motor-private-car-m-as', businessType:'endorsement'}, {reload: true});
          
        self.generalConfigCtrl('RenewalDetailCtrl', policyUIService, 'Renewal');
        salecaseUIService.product = "motor-private-car-m-as";
        //force reload state
        //return self.goToState('root.list.detail', {docType:'case-management', productName:'motor-private-car-m-as', businessType:'Endorsement'}, {reload: true});
    }*/

    //get mock lazy list propsect to bind in policy detail motor

    //  salecaseUIService.getLazyChoiceList($scope.resourceURL);

    $scope.initializeObject_V3 = function() {
        /*salecaseUIService.productName = "motor-private-car-m-as";*/
        var productName = policyUIService.product;
        salecaseUIService.product = policyUIService.product;

        //if lazy choice not available, get lazylist if product name is changed
        if (policyUIService.oldProduct != policyUIService.product) {
            salecaseUIService.getLazyChoiceListByModuleAndProduct_V3($scope.resourceURL, productName).then(function(result) {
                salecaseUIService.lazyChoiceList = result;

                policyUIService.oldProduct = policyUIService.product;
            });
        }

    };

    /*$scope.initializeObject_V3();*/

    $scope.toggleList = function() {
        $("#endorse-menu-item").toggleClass("active-actionmenu");
        $("#endorse-submenu-caret").toggleClass("rotate-caret");
        var list = document.getElementById("submuneu-endorse");

        if (list.style.display == "none" || list.style.display == "") {
            $("#submuneu-endorse").slideDown();
        } else {
            $("#submuneu-endorse").slideUp();
        }
    }



    $scope.listSearchBy = [{
        "value": "RD",
        "translate":  "Report Date"
    }, {
        "value": "DL",
        "translate":  "Date of Loss"
    }, {
        "value": "TD",
        "translate": "Time Details"
    }];

    //reset search
    $scope.clearSearch = function() {
        $scope.query = {};
        $scope.SearchBy = {};
        $scope.SearchBy = {};
        $scope.SearchBy.Value = {};
        $scope.SearchType = {};
        $scope.SearchType.Value = {};
        $scope.claimsHistoryLists = $scope.claimsHistoryList;
    };
    
    $scope.clearSearch();


	// search claim history
	$scope.searchClaim = function() {
		// filter policy number
		var filterResult = $scope.claimsHistoryList;
/*		if ($scope.query.policyId)
			filterResult = $scope.filterData($scope.claimsHistoryList,
					"policyId", $scope.query.policyId);
		if ($scope.query.claimId)
			filterResult = $scope.filterData(filterResult, "claimId",
					$scope.query.claimId);
		if ($scope.query.fullName)
			filterResult = $scope.filterData(filterResult, "fullName",
					$scope.query.fullName);
		if ($scope.SearchType.Value.Value)
			filterResult = $scope.filterData(filterResult, "cnttype",
					$scope.SearchType.Value.Value);*/

		if ($scope.query.dateFrom && $scope.query.dateTo && $scope.SearchBy.Value.Value) {
			filterResult = $scope.filterDateRange(filterResult,
					$scope.query.dateFrom, $scope.query.dateTo);
		}
		$scope.claimsHistoryLists = filterResult;
	};

	// get claim history list
	$scope.getClaimHistoryList = function() {

		policyUIService.getClaimHistoryList($scope.resourceURL).then(
						function(data) {
							$scope.claimsHistoryList = policyUIService.findElementInElement_V3(data, [ 'return' ]);

							if (!$.isArray($scope.claimsHistoryList) && $scope.claimsHistoryList != undefined) {
								var temp = $scope.claimsHistoryList;
								$scope.claimsHistoryList = [];
								$scope.claimsHistoryList.push(temp);
							}

							$scope.listClaimsHistoryLimit = 12;

							$scope.increase = function() {
								$scope.listClaimsHistoryLimit = $scope.listClaimsHistoryLimit + 4;
							};
							$scope.claimsHistoryLists = $scope.claimsHistoryList;

							// get claim list
							/*
							 * $scope.claimType = []; for (var i = 0; i <
							 * $scope.claimsHistoryList.length; i++) {
							 * $scope.claimType.push({ value :
							 * $scope.claimsHistoryList[i].cnttype }); }
							 */

							// $scope.claimType = $scope.uniqObjects(
							// $scope.claimType );
							/*
							 * var result = [];
							 * 
							 * for (var i = 0; i < $scope.claimType.length; i++) {
							 * var found = false; for (var j = 0; j <
							 * result.length; j++) { if (result[j].value ==
							 * $scope.claimType[i].value) { found = true; break; } }
							 * if (!found) { result.push($scope.claimType[i]); } }
							 */

							// $scope.claimType = result;
						});
	}

	// search by condition
	$scope.filterData = function(items, type, text) {
		var out = [];
		for (var i = 0; i < items.length; i++) {
			if (items[i][type] == text)
				out.push(items[i]);
		}
		return out;
	};

	// find record by date range
	$scope.filterDateRange = function filterDateRange(items, from, to) {
		var searchBy = undefined;
		var result = [];

		switch ($scope.SearchBy.Value.Value) {
		case "RD":
			searchBy = "reportDate";
			break;
		case "DL":
			searchBy = "lossDate";
			break;
		case "TD":
			searchBy = "timeDetails";
			break;
		}

		// convert date
		var dateFrom = moment(from)
		var dateTo = moment(to);
		if (searchBy != "timeDetails") {//search by loss date or report date
			for (var i = 0; i < items.length; i++) {
				if (dateFrom <= moment(items[i][searchBy])
						&& dateTo >= moment(items[i][searchBy])) {
					result.push(items[i]);
				}
			}
			return result;
		} else {//search by loss date & report date
			for (var i = 0; i < items.length; i++) {
				if ((dateFrom <= moment(items[i]["reportDate"]) && dateTo >= moment(items[i]["reportDate"]))
						|| (dateFrom <= moment(items[i]["lossDate"]) && dateTo >= moment(items[i]["lossDate"]))) {
					result.push(items[i]);
				}
			}
			return result;
		}
	};
	
	$scope.refreshDetail = function() {
		var policyId = policyUIService.findElementInDetail_V3(['PolicyNo']).$; 
		var clientId = policyUIService.findElementInDetail_V3(['ClientId']).$; 
		policyUIService.getDocumentDetail_V3($scope.resourceURL, policyId, clientId, function(data){
			$scope.reSetupConcreteUiStructure(policyUIService.detail); // refresh the values in multiple cards
		});
	}
	
	///////////////////////////
	//endorsement policy fire
    $scope.getReason = function getReason(reason){
        if(salecaseUIService.findElementInDetail_V3(['EReason']).Value == reason){
            return true;
        }
        return false;

    };
    
    $scope.computePolicy = function(){
    	prepareMissingfield();
    		policyUIService.computeModule($scope.resourceURL).then(function(data){
        		if (policyUIService.isSuccess(data)){
        			policyUIService.detail = data;
        			commonUIService.showNotifyMessage("v3.mynewworkspace.message.ComputeEndorsementSuccessfully", "success");
                    $scope.reSetupConcreteUiStructure(policyUIService.detail); // refresh the values in multiple cards
        		}
        		else  {
        			var errorMessage = salecaseUIService.findElementInElement_V3(data,['message']);
        			if(!errorMessage){
        				errorMessage = "";
        			}
        			commonUIService.showNotifyMessage("v3.mynewworkspace.message.computeEndorsementUnsuccessfully" +" " + errorMessage);
        		}
        		
        	});
    };
    
    
    var prepareMissingfield = function(){
    	updateEReasonNote();
    	if (!commonService.hasValue(policyUIService.findElementInDetail_V3(["EffectiveDate"]).$)){
    		/*var date = new Date;
    		policyUIService.findElementInDetail_V3(["EffectiveDate"]).$ = $filter('date')(date,'yyyy-MM-dd');*/
    		policyUIService.findElementInDetail_V3(["EffectiveDate"]).$  = policyUIService.EffectiveDate;
    	}
    };
    
    function updateEReasonNote(){
    	salecaseUIService.findElementInDetail_V3(['EReasonNote']).$ = policyUIService.findElementInDetail_V3(['EndorsementReasonNote']).$;
    };
    
  //product FIR get client list for endorsement fire, update interest parties
	$scope.importClientInfor = function importClientInfor(clientInfor, card){
		/*if(!$scope.interestedParty){
			$scope.interestedParty = policyUIService.convertToArray(policyUIService.findElementInDetail_V3(['InterestedParty']));
		}*/
		policyUIService.findElementInElement_V3(card.refDetail, ['ClientNumber']).$  = clientInfor.Client_ID;
		policyUIService.findElementInElement_V3(card.refDetail, ['FullName']).$ =  clientInfor.Surname + " " + clientInfor.Surname;
	
	};

    $scope.computeTag = function (element){
        policyUIService.computeElementAndUpdateLazyList($scope.resourceURL, element).then(function(data){
            $scope.reSetupConcreteUiStructure(policyUIService.detail); // refresh the values in multiple cards
        });
    };

    $scope.getProspectList = function() {
        prospectPersonalUIService.getDocumentList_V3($scope.resourceURL).then(function(data){
            $scope.prospectList = prospectPersonalUIService.findElementInElement_V3(data, ['MetadataDocument']);
            if(commonService.hasValueNotEmpty($scope.prospectList)){
                if (!$.isArray($scope.prospectList)){
                    var temp = $scope.prospectList;
                    $scope.prospectList = [];
                    $scope.prospectList.push(temp);
                }
                
                $scope.listProspectLimit = 12;
                
                $scope.increase = function(){
                    $scope.listProspectLimit = $scope.listProspectLimit + 4;
                };
            }else{
                $scope.msg = 'There is no data.';
            }
        });
    }

   /* if ($scope.endorsementReason === 'IP')
        $scope.getProspectList();*/
    $scope.selectedClient = {};
    $scope.importProspect = function(card, metadata, $event) {
        var self = this;
        
        var prospectId = metadata.DocId;
        
        var prospect = self.moduleService.findElementInDetail_V3(['Prospect']);
        var error = false;
        
        if (self.moduleService.findElementInDetail_V3(['Prospects'])['@counter'] === self.moduleService.findElementInDetail_V3(['Prospects'])['@maxOccurs']) {
            commonUIService.showNotifyMessage("v3.mynewworkspace.message.CannotImportMoreProspect");
            error = true;
        } else {
            for (var i = 0; i < prospect.length; i++) {
                if (self.moduleService.findElementInElement_V3(prospect[i], ['ProspectId']).$ == prospectId) {
                    commonUIService.showNotifyMessage("v3.mynewworkspace.message.CannotImportDuplicateProspect");
                    error = true;
                    break;
                }
            }
        }

        if (!error) {
            self.card = card;
            self.addCard(card, function addedChildEle (addedEle) {
                //bind refId here
                addedEle['@refUid'] = prospectId;
                self.moduleService.findElementInElement_V3(addedEle, ['ProspectId']).$ = prospectId;
                //add preview for card just added
//              uiRenderPrototypeService.loadMetadataForOneCard (self.card , $scope.resourceURL, prospectId);
            
                salecaseUIService.saveDetail_V3($scope.resourceURL, false).then(function(data){
                    //TODO: remove this variable in future
                    //For now it will prevent the case got automatic saved when moving to other document (after importing prospect)
                    card.root.isDetailChanged = false;
                    card.isDetailChanged = false;

                    $log.debug("Case has been saved");
                    commonUIService.showNotifyMessage("v3.mynewworkspace.message.ImportProspectSuccessfully", "success");
                    self.closeChildCards(1, $event);
                    $log.debug(self.moduleService.detail);
                });
            });
        }
    };
    
   /* *//**
	 * @author ynguyen7
	 * 2016.04.20
	 * Get client list from back end
	 *//*
	$scope.getFullNameClientList = function() {
		//add new combine element for fullName: First_Name + Surname
		for(var i = 0; i < clientList.length; i++){
			clientList[i].fullName = {};
			clientList[i].fullName.$ = clientList[i].First_Name + " " + clientList[i].Surname;
		}
	};*/
}];
