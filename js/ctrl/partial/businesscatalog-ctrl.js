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

var BusinessCatalogDetailCtrl = ['$scope', '$rootScope', '$compile', '$http', 'ajax', 'salecaseUIService', 'commonUIService', '$translate', "webConnectorService", "commonService", "fileReader", 'urlService', 'connectService', 'loadingBarService', '$log',
	function($scope, $rootScope, $compile, $http, ajax, salecaseUIService, commonUIService, $translate, webConnectorService, commonService, fileReader, urlService, connectService, loadingBarService, $log) {

	
	$scope.moduleService = salecaseUIService;
	$scope.commonService = commonService;
//	$scope.resourceURL = salecaseUIService.initialPortletURL(myArrayPortletId["business-catalog"]);
	$scope.resourceURL = salecaseUIService.initialPortletURL(myArrayPortletId["my-new-workspace"]);
//	if (myArrayPortletId["business-catalog"] == undefined )
//		$scope.resourceURL = salecaseUIService.initialPortletURL(myArrayPortletId["my-new-workspace"],"getBusinessCatalogs");
//		else {
//			$scope.resourceURL = salecaseUIService.initialPortletURL(myArrayPortletId["business-catalog"],"getBusinessCatalogs");
//		}
	$scope.allProducts = [];
	    
    $scope.init = function init () {
        var self = this;
          if(webConnectorService.platform !== commonService.CONSTANTS.PLATFORM.WEB_LIFERAY){
              salecaseUIService.getDocmapDefinitions($scope.resourceURL);
        }
        self.setupCtrlWithoutDetail('BusinessCatalogDetailCtrl', "business_catalog");
        
//        if (localStorage.getItem("workstepId") !== "null" && commonService.hasValueNotEmpty(localStorage.getItem("workstepId"))) {
//        	var resourceURL = salecaseUIService.initialMethodPortletURL(myArrayPortletId["my-new-workspace"], "getResponseAfterSign");
//        	ajax.getRuntime(resourceURL.toString(), "", function(result) {
//        		if (result.workstepInfo.workstepFinished === "1") {
//        			if (commonService.hasValueNotEmpty(result.fileName)) {
//        				self.unsignedFields = result.workstepInfo.unsignedFields;
//	        			resourceURL = salecaseUIService.initialMethodPortletURL(myArrayPortletId["my-new-workspace"], "updateResourceAfterSign");
//	        			ajax.getRuntime(resourceURL.toString(), "", function(result) {
//	        				if (salecaseUIService.isSuccess(result)) {
//	        					$log.debug("Update resource successfully.");
//	        					if(self.unsignedFields == 0){
//		        					var resourceFiledId = salecaseUIService.findElementInElement_V3(result, ["DocId"]);
//		        					var caseDataObject = sessionStorage.getItem(localStorage.getItem("workstepId"));
//		        					if (commonService.hasValueNotEmpty(caseDataObject)){
//			        					var caseData = JSON.parse(caseDataObject);
//			        					var caseManagementId = caseData.DocId;
//			        					var resourceType = caseData.ResourceType;
//			        					var product = caseData.Product;
//			        					var businessType = caseData.CaseName;
//			        					var actionParams = [caseManagementId, resourceFiledId, resourceType, product, businessType];
//			        					salecaseUIService.updateSignedStatus($scope.resourceURL, actionParams);
//		        					}
//	        					}
//	        				} else {
//	        					$log.error("Update resource unsuccessfully!!!");
//	        				}
//	        			});
//        			}
//        			resourceURL = salecaseUIService.initialMethodPortletURL(myArrayPortletId["my-new-workspace"], "showSignedPdf");
//        			fileReader.showPDF(resourceURL.toString());
//        		} else {
//        			window.open(urlService.urlMap.NEW_MY_WORKSPACE, '_self');
//        		}
//        	});
//        }
        
        loadingBarService.showLoadingBar();
        var resourceURL = salecaseUIService.initialMethodPortletURL(myArrayPortletId["my-new-workspace"], "getBusinessCatalogs");
        if (myArrayPortletId["business-catalog"] != undefined)
        	resourceURL = salecaseUIService.initialMethodPortletURL(myArrayPortletId["business-catalog"], "getBusinessCatalogs");
        salecaseUIService.getModuleProductList_V3(resourceURL.toString(),'case-management').then(function(data){
        	loadingBarService.hideLoadingBar();
	    	if (commonService.hasValueNotEmpty(data['BusinessCatalogs'])) {
	    		$scope.allProducts = salecaseUIService.convertToArray(salecaseUIService.findElementInElement_V3(data, ['Product']));
	    	} else {
	    		$scope.allProducts = salecaseUIService.convertToArray(salecaseUIService.findElementInElement_V3(data, ['product']));
			}
        });
        /*
        loadingBarService.showLoadingBar();
        var resourceURL = salecaseUIService.initialMethodPortletURL(myArrayPortletId["my-new-workspace"], "getBusinessCatalogs");
        connectService.exeAction({
        	actionName: "MODULE_LISTPRODUCT",
	    	actionParams: [salecaseUIService.name],	
	    	resourceURL: resourceURL.toString()
	    }).then(function(data) {
	    	loadingBarService.hideLoadingBar();
	    	if (commonService.hasValueNotEmpty(data['BusinessCatalogs'])) {
	    		$scope.allProducts = salecaseUIService.convertToArray(salecaseUIService.findElementInElement_V3(data, ['Product']));
	    	} else {
				console.error("Error when get business catalogs!!!");
			}
		});*/
    };
    
    $scope.hasChildrenCard = function(card) {
    	var hasChildren = false;
    	for (var i = 0; i < card.children.length; i++) {
    		var isVisible = card.children[i].isVisible;
    		hasChildren = hasChildren || (typeof isVisible === 'boolean' ? isVisible : $scope.$eval(isVisible));
    	}
    	return hasChildren;
    }
    
    $scope.hasProduct = function(productName) {
    	if ($scope.allProducts != undefined) {
	    	for (var i = 0; i < $scope.allProducts.length; i++) {
	    		if (productName == $scope.allProducts[i].ProductId || productName == $scope.allProducts[i].productId)
	    			return true;
	    	}
    	}
    	return false;
    }
    
    $scope.init();
    
    $scope.gotoCase = function gotoCase (product) {
    
			// var params = {
   //          		DocType: "case-management",
   //          		actionName: "createCase",
   //          		actionParam: product
   //              };
   //      	commonUIService.goToPortlet("NEW_MY_WORKSPACE", params, false);
        var self = this;
        salecaseUIService.product = product;
        salecaseUIService.group = salecaseUIService.getProductGroup_V3(salecaseUIService.product);
        $scope.showProduct = false;
        $('#product-detail').fadeIn(500);

        // Show current doctype for navigation bar
        $("#navCurrentDocType").html($translate.instant('v3.navigation.label.docType.case-management'));
        self.createNewDocument(salecaseUIService.name, salecaseUIService.product, 'NewBusiness', 'NewBusiness');
   
    };
        
}];