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
var ClientDetailCtrl = ['$scope', '$log', '$state', 'commonService', 'clientUIService', 'commonUIService', 'policyUIService', 'urlService', 'uiRenderPrototypeService', '$translate',
	function($scope, $log, $state, commonService, clientUIService, commonUIService, policyUIService, urlService, uiRenderPrototypeService, $translate) {
	
	$scope.commonUIService = commonUIService;
	$scope.moduleService = clientUIService;
	$scope.name = 'ClientDetailCtrl';
	$scope.resourceURL = clientUIService.initialPortletURL(myArrayPortletId["my-new-workspace"]);
	
    $scope.init = function init () {
        var self = this;
        self.moduleIcon='fa fa-user';
        self.generalConfigCtrl('ClientDetailCtrl', clientUIService);
    };

	$scope.init();
	
	$scope.getComputeLazy = function() {
		var deferred = clientUIService.$q.defer();
		if(!commonService.hasValueNotEmpty(clientUIService.lazyChoicelist)){
			clientUIService.getModuleLazyChoicelist_V3($scope.resourceURL).then(function(data) {
				deferred.resolve(data);
			});
		} else deferred.resolve();
		return deferred.promise;
	};
	
	$scope.initializeObject = function() {
		/*$scope.getComputeLazy().then(function(){
			
		});*/
	};
    
	
	$scope.initializeObject();
	
	$scope.getPolicyListByClient = function getPolicyListByClient(){
		$log.debug("get policy list of client: " + $state.params.docId);
		
		policyUIService.loadListOfClient($scope.resourceURL, $state.params.docId).then(function(data){
			$scope.policyList = policyUIService.convertToArray(data.MetadataDocuments.MetadataDocuments.MetadataDocument);
		});
	};
	
	$scope.disabled = true;
	
	$scope.openDocumentFromMetaList = function openDocumentFromMetaList(metaCard) { 
        var docType = metaCard.DocType;
        var docId = metaCard.DocId;
        var product = metaCard.Product;
        var clientId = metaCard.Client_Number;
        var effectiveDate = undefined;
        
        //TODO: don't know where it's from
        if(metaCard.Contract_Number){
            docType = commonService.CONSTANTS.MODULE_NAME.POLICY;
            docId = metaCard.Contract_Number;
            product = metaCard.Contract_Type;
            effectiveDate = metaCard.Effective_Date;
        }
        if(metaCard.claimId){
            docType = commonService.CONSTANTS.MODULE_NAME.CLAIM;
            docId = metaCard.claimId;
            product = metaCard.cnttype;
        }
        if(metaCard.Client_ID){
            docType = commonService.CONSTANTS.MODULE_NAME.CLIENT;
            docId = metaCard.Client_ID;
            product = metaCard.Client_Type;
        }
        if(metaCard.ClaimNo){
            docType = commonService.CONSTANTS.MODULE_NAME.CLAIM_NOTIFICATION;
            product = metaCard.productName;
        }
        if(metaCard.CaseName){
        	docType = commonService.CONSTANTS.MODULE_NAME.SALECASE;
        	product = metaCard.Product;
        	switch(metaCard.CaseName){
        	case ('NewBusiness'):
        		var businessType = "NewBusiness";
        		break;
        	case ('ENDORSEMENT'):
	        	var businessType = "endorsement";
        		break;
        	case ('Renewal'):
        		var businessType = "renewal";
        		break;
        	}
        }
        
        var params = {
        	docType: docType,
        	docId: docId,
        	productName: product,
        	clientId: clientId,
        	effectiveDate: effectiveDate,
        	businessType: businessType,
        	isNeedEdit: undefined
        };
        // Show current doctype for navigation bar
        $("#navCurrentDocType").html($translate.instant('v3.navigation.label.docType.' + docType));

        return this.openDocument(params);
    }

    /**
     * open document for this doctype and navigate to this screen
     * @param  {String} docType     [description]
     * @param  {String} docId [description]
     * @param  {String} productName    [description]
     * @param  {String} clientId    [description]
     * @param  {String} isNeedEdit    if true, will get document edit
     * @return {Object}              Angular Promise, iposV3Doc if success
     */
    $scope.openDocument = function openDocument(params) { 
        var self = this;           
        var uiService = uiRenderPrototypeService.getUiService(params.docType); 
        var deferred = uiService.$q.defer();
        var promise = undefined;
        var mockDetail = false;
        $scope.multiUploadService.init();//reset file selected list to 0;
        scrollTop(0);//Scroll to top when get Document details; 

        switch(params.docType){
        	case commonService.CONSTANTS.MODULE_NAME.CLAIM:
        		if(params.productName == "VPM") {
        			params.productName = "motor_private_car_m_as";
        		}
        		break;
            case commonService.CONSTANTS.MODULE_NAME.POLICY:
            	uiService.policyType = params.productName;
            	uiService.effectiveDate = params.effectiveDate;
                if(params.productName == "VPM"){ // || productName == "Personal Accident - Individual"
                	params.productName = "motor_private_car_m_as";
                	uiService.product = "motor-private-car-m-as";
					uiService.policyType = "VPM";
                }
                else{
                   uiService.product = params.productName;
                }
				// uiService.POContacts = uiService.findElementInDetail_V3(['policy-motor-private-car-m-as:PolicyOwner','person:Contact']);
    //             uiService.AdditionalCoverages = uiServicee.findElementInDetail_V3(['policy-motor-private-car-m-as:OptionalCoverages','policy-motor-private-car-m-as:OptionalCoverage']);*/
                break;
        }

        if(mockDetail){
            deferred.resolve();
            self.goToState('root.list.detail', {docType: params.docType, docId: params.docId, "productName": params.productName, "businessType" : params.businessType, "ctrlName": undefined});
        }else{

            if (params.docId != undefined){

                if(params.isNeedEdit)
                    //TODO: change the function will return the computed doc
                    promise = uiService.getDocumentEdit_V3($scope.resourceURL, params.productName, params.docId);
                else{
					/* if(docType === commonService.CONSTANTS.MODULE_NAME.POLICY)
					 	promise = uiService.getDocumentDetail_V3($scope.resourceURL, docId);
					 else*/
	                    promise = uiService.getDocumentDetail_V3($scope.resourceURL, params.docId, params.clientId);
				}

                promise.then(function gotDetail (detail) {
                    if(commonService.hasValueNotEmpty(detail)){

                         //when in here, don't want to reuse this variable
                        // if(self.$state.params.ctrlName)
                        //     self.$state.params.ctrlName = undefined;

                        $scope.isOpenedDetail = false;
                        
                        $log.debug("Got detail of docType:'" + params.docType + "', id:" + params.docId); 
                        self.goToState(
                            'root.list.detail', 
                            {"docType": params.docType, "docId": params.docId, "productName": params.productName, "businessType" : params.businessType, "ctrlName": undefined}
                        );
                        self.toggleAllBar();
                    }
                    else{
                        commonUIService.showNotifyMessage("v3.transactioncenter.message.Errorhasoccured");
                        $log.error('Cant get detail');
                    }
                });
            }else{
                deferred.resolve();
            }
        }
        return deferred.promise;
    };
    
    $scope.refreshDetail = function() {
		clientUIService.getDocumentDetail_V3($scope.resourceURL, clientUIService.clientId, function(data){
			$scope.reSetupConcreteUiStructure(clientUIService.detail); // refresh the values in multiple cards
		});
	}

   	$scope.gotoModuleFromAntherModule = function(){
   	  // Retrieve the object from storage
   	   	var retrievedPageParams = JSON.parse(localStorage.getItem('pageParams'));
   	
	   	if(retrievedPageParams){
	   		var metaCard = retrievedPageParams;
	   		//remove local storage when finish navigate to another module
	   		localStorage.removeItem('pageParams');
	   		$scope.openDocumentFromMetaList(metaCard);
	   	}
   	};
   	
//    function scrollTop(offsetPosittion){
//    	$('html, body').stop().animate({
//        	scrollTop:offsetPosittion  	    	
//	    	},1500, 'swing'
//	    );
//    }
    
    
	
}];
