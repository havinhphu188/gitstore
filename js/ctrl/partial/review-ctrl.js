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

var ManagerReviewDetailCtrl = ['$scope', '$filter', '$compile', 'commonService', 'managerReviewUIService','printPdfService', 'ajax', '$document', 'urlService', '$log', '$state', '$rootScope', '$timeout', '$mdSidenav', '$upload', '$mdDialog', '$translate', '$translatePartialLoader', 'commonUIService', 'salecaseUIService',
	function($scope, $filter, $compile, commonService, managerReviewUIService,printPdfService, ajax, $document, urlService, $log, $state, $rootScope, $timeout, $mdSidenav, $upload, $mdDialog, $translate, $translatePartialLoader, commonUIService, salecaseUIService) {
	
	//quicknavigation and show hide element in page
	$scope.moduleService = managerReviewUIService;
	$scope.salecaseService = salecaseUIService;
	$scope.commonService = commonService;
	$scope.printPdfService = printPdfService;
	$scope.name = 'ManagerReviewDetailCtrl';
	$scope.freeze = false;

    $scope.init = function init() {
        var self = this;
        self.html.actionBarEle = undefined;
        self.generalConfigCtrl('ManagerReviewDetailCtrl', managerReviewUIService);
        $scope.getComputeLazy();
    };
    
    $scope.saveManagerReview = function(validate) {	
    	var deferred = managerReviewUIService.$q.defer();
    	managerReviewUIService.saveDetail_V3($scope.resourceURL,validate).then(function(data){
    		if(managerReviewUIService.isSuccess(data)){
    			$scope.reSetupConcreteUiStructure(managerReviewUIService.detail);
				commonUIService.showNotifyMessage("v3.myworkspace.message.SaveManagerReviewsuccessfully",'success');
			}else{
				// Appending dialog to document.body to cover sidenav in docs app
			    var confirm = $mdDialog.confirm()
			          .title($filter('translate')("MSG-FQ06"))
			          .ok($filter('translate')("v3.yesno.enum.Y"))
			          .cancel($filter('translate')("v3.yesno.enum.N"));
			    $mdDialog.show(confirm).then(function() {
			    	managerReviewUIService.saveDetail_V3($scope.resourceURL, false).then(function(data){
			    		if(managerReviewUIService.isSuccess(data)){
			    			commonUIService.showNotifyMessage("v3.mynewworkspace.message.SaveDraftManagerReviewSuccessfully", "success");
			    		}else{
			    			commonUIService.showNotifyMessage("v3.mynewworkspace.message.SaveDraftManagerReviewUnsuccessfully");
			    		}
			    		
			    	});
			    }, function() {
			        var a = 'No';
			    });
				
			}
    		deferred.resolve(data);
    	});
    	return deferred.promise;
    };
    
    $scope.getComputeLazy = function(){
		if(!commonService.hasValueNotEmpty(managerReviewUIService.lazyChoiceList)){
			var productName = managerReviewUIService.findElementInDetail_V3(['DocInfo']).Product;
			managerReviewUIService.getManagerReviewLazyList($scope.resourceURL, productName).then(function(data){
				managerReviewUIService.lazyChoiceList = data;
			});
		} 

	};
    
    
    //manager decidsion
    $scope.managerDecide = function managerDecide(decision) {
    	var self = this;
    	self.decision = decision;
    	var productName = managerReviewUIService.findElementInDetail_V3(['Product']);
    	$scope.moduleService.setManagerDecision($scope.resourceURL, decision, productName).then(function(data){
    		if($scope.moduleService.isSuccess(data)){	//validate success
    			var docId = $scope.moduleService.findElementInDetail_V3(['DocId']);
            	var docType = $scope.moduleService.findElementInDetail_V3(['DocType']);
            	//disableall field after set manager decision
            	$scope.freeze = true;
            	
            	$scope.moduleService.findElementInDetail_V3(['DocStatus'])["BusinessStatus"] = $scope.moduleService.findElementInElement_V3(data, ['DocStatus'])["BusinessStatus"];
            	
            	if($scope.moduleService.findElementInDetail_V3(['ManagerDecisionCd'])){
            		$scope.moduleService.findElementInDetail_V3(['ManagerDecisionCd']).Value = self.decision;
            	}
            	
            	$scope.reSetupConcreteUiStructure(managerReviewUIService.detail);
            	$scope.$parent.refreshDetail();//Refresh Detail of Case Management
            	commonUIService.showNotifyMessage("v3.myworkspace.message.ManagerReview"+self.decision+"Successfully","success");
            	if (productName === commonService.CONSTANTS.PRODUCT.GROUP_TERM_LIFE) {
            		return;
            	} else {
            		$scope.printPdf();
            	}
			
			 } else{	//validate fail
				 commonUIService.showNotifyMessage("v3.myworkspace.message.ManagerReview"+self.decision+"Unsuccessfully");
			 }
    	});
    };
    
    $scope.printPdf = function() {
		var self = this;
		managerReviewUIService.generateDocument_V3($scope.portletId).then(function(data) {
			if(managerReviewUIService.isSuccess(data)){	//validate success
			var productName  = managerReviewUIService.findElementInDetail_V3(['Product']);
					$scope.saveManagerReview(true).then(function(data){
					if (managerReviewUIService.isSuccess(data)) {
				    	var actionType = "manager-review";
			    		$scope.printPdfService.generatePdf($scope.portletId, managerReviewUIService, managerReviewUIService.findElementInDetail_V3(['DocInfo'])['Product'], actionType);
					
					} else {
						commonUIService.showNotifyMessage("v3.myworkspace.message.GeneratePDFUnsuccessfully");
					}
				});
			} else {
				//commonUIService.showNotifyMessage("v3.myworkspace.message.GeneratePDFUnsuccessfully");
				var productName  = managerReviewUIService.findElementInDetail_V3(['Product']);
				$scope.saveManagerReview(false).then(function(data){
				if (managerReviewUIService.isSuccess(data)) {
			    	var actionType = "manager-review";
		    		$scope.printPdfService.generatePdf($scope.portletId, managerReviewUIService, managerReviewUIService.findElementInDetail_V3(['DocInfo'])['Product'], actionType);
				
				} else {
					commonUIService.showNotifyMessage("v3.myworkspace.message.GeneratePDFUnsuccessfully");
				}
			});
			}
		});
	};
	
    
    

	//remark manager review
	$scope.remarkManagerGCSComplettion = false;
	$scope.remarkManagerGCSObjective = false;
	$scope.remarkManagerGCSComplettionInvestment = false;
	$scope.remarkManagerGCS = function(Remark) {
		if(Remark == "Complettion"){
			$scope.remarkManagerGCSComplettion = !$scope.remarkManagerGCSComplettion;
			//$scope.moduleService.findElementInDetail_V3(['CompletionOfClientPersonalDetailRemark']).$ = "";
		}else if(Remark == "Objective"){
			$scope.remarkManagerGCSObjective = !$scope.remarkManagerGCSObjective;
			//$scope.moduleService.findElementInDetail_V3(['ObjectiveAndPreferenceRemark']).$ = "";
		}
		else if(Remark == "ComplettionInvestment"){
			$scope.remarkManagerGCSComplettionInvestment = !$scope.remarkManagerGCSComplettionInvestment;
			//$scope.moduleService.findElementInDetail_V3(['CompletionOfClientInvestmentProfileRemark']).$ = "";
		}
	}
	
	//check when user first load 
	$scope.checkRemark = function() {
		if(managerReviewUIService.findElementInDetail_V3(['Product']) != commonService.CONSTANTS.PRODUCT.GUARANTEED_CASHBACK){
			return;
		}
		if($scope.moduleService.findElementInDetail_V3(['CompletionOfClientPersonalDetailRemark']).$){
			$scope.remarkManagerGCSComplettion = true;
		}
		if($scope.moduleService.findElementInDetail_V3(['ObjectiveAndPreferenceRemark']).$){
			$scope.remarkManagerGCSObjective = true;
		}
		if($scope.moduleService.findElementInDetail_V3(['CompletionOfClientInvestmentProfileRemark']).$){
			$scope.remarkManagerGCSComplettionInvestment = true;
		}
	}
	
	$scope.checkRemark();
    

    $scope.init();
}];