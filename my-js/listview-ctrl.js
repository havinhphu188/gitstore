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
var ListViewCtrl = ['$scope', '$log', '$state', 'commonService', 'commonUIService','paginationService', 'prospectPersonalUIService', 'prospectCorporateUIService','salecaseUIService', 'factfindUIService',
    function($scope, $log, $state, commonService, commonUIService, paginationService, prospectPersonalUIService, prospectCorporateUIService, salecaseUIService, factfindUIService) {
	
	$scope.commonUIService = commonUIService;
	$scope.paginationService = paginationService;
	$scope.name = 'ListViewCtrl';
	var portletName = myArrayPortletId["dashboard-portlet"];
	$scope.isLoadList = true;
	
	$scope.getDocumentList = function (docType){				
		if($scope.paginationService.getLastInstanceId() != undefined)
			$scope.paginationService.setCurrentPage($scope.paginationService.getLastInstanceId(), 1)	
	};
	
	
	$scope.getBusinessTransactionList = function (){
		$scope.myCompletedBusinessTransactionList = [];
		$scope.mySubmittedBusinessTransactionList = [];
		$scope.myPendingBusinessTransactionList = [];
		var bt = [];
		$scope.isLoadList = false;
		salecaseUIService.getDocumentList_V3().then(function(data) {
			if (commonService.hasValueNotEmpty(salecaseUIService.findElementInElement_V3(data, ['MetadataDocument']))) {
				bt = salecaseUIService.convertToArray(salecaseUIService.findElementInElement_V3(data, ['MetadataDocument']));
			}				
			for (var i = 0; i < bt.length; i++) {
				if (bt[i].BusinessStatus == 'FAILED' || bt[i].BusinessStatus == 'SUBMITTED') {//completed
					$scope.myCompletedBusinessTransactionList.push(bt[i]);
				}
				if (bt[i].BusinessStatus == 'SUBMITTING' || bt[i].BusinessStatus == 'READY FOR SUBMISSION') {//submitted
					$scope.mySubmittedBusinessTransactionList.push(bt[i]);
				}
				if (bt[i].BusinessStatus == 'PENDING' || bt[i].BusinessStatus == 'DRAFT' || bt[i].BusinessStatus == 'NEW' //pending
					|| bt[i].BusinessStatus == 'DRAFT QUOTATION' || bt[i].BusinessStatus == 'ACCEPTED QUOTATION'//add Case Status Condition for GTL1
					|| bt[i].BusinessStatus== 'PENDING APPROVAL (Compliance Assessment)'	//add Case Status Condition for GTL1
					|| bt[i].BusinessStatus== 'PENDING APPROVAL (Group Level UW)'	//add Case Status Condition for GTL1
					|| bt[i].BusinessStatus== 'PENDING APPROVAL (Business Case)'	//add Case Status Condition for GTL1
					|| bt[i].BusinessStatus== 'DISAGREED (Compliance Assessment)'	//add Case Status Condition for GTL1
					|| bt[i].BusinessStatus== 'REJECTED (Group Level UW)'	//add Case Status Condition for GTL1
					|| bt[i].BusinessStatus == 'REJECTED (Business Case)') {				//add Case Status Condition for GTL1
					$scope.myPendingBusinessTransactionList.push(bt[i]);
				}
			}
			$scope.isLoadList = true;
		});
	}
	
	$scope.loadContactList = function() {
		var prospectList = [];
		var corporateList = [];
		$scope.isLoadList = false;
		if($scope.paginationService.getLastInstanceId() != undefined)
			$scope.paginationService.setCurrentPage($scope.paginationService.getLastInstanceId(), 1);
		prospectPersonalUIService.getDocumentList_V3().then(function(data) {
			if (commonService.hasValueNotEmpty(prospectPersonalUIService.findElementInElement_V3(data, ['MetadataDocument']))) {
				prospectList = prospectPersonalUIService.findElementInElement_V3(data, ['MetadataDocument']);
				prospectList = prospectPersonalUIService.convertToArray(prospectList);
			}
			prospectCorporateUIService.getDocumentList_V3().then(function(data) {
    			if (commonService.hasValueNotEmpty(prospectCorporateUIService.findElementInElement_V3(data, ['MetadataDocument']))) {
    				corporateList = prospectCorporateUIService.findElementInElement_V3(data, ['MetadataDocument']);
    				corporateList = prospectCorporateUIService.convertToArray(corporateList);
    			}
				$scope.contactList = $.merge(prospectList, corporateList);
				$scope.isLoadList = true;
			});		
			
		});
	};
	
	/* Load FNA list */
    $scope.loadFNAList = function() {
        $scope.fnaListCompleted = [];
        $scope.fnaListPending = [];
        $scope.isLoadList = false;
        factfindUIService.getDocumentList_V3().then(function(data) {        	
            if (commonService.hasValueNotEmpty(factfindUIService.findElementInElement_V3(data, ['MetadataDocument']))) {
            	var listItem = factfindUIService.convertToArray(factfindUIService.findElementInElement_V3(data, ['MetadataDocument']));            	 
                for (var i = 0; i < listItem.length; i++) {
					if (listItem[i].BusinessStatus == 'DRAFT') {//incompleted
						$scope.fnaListPending.push(listItem[i]);
					} else if (listItem[i].BusinessStatus == 'COMPLETED') {//completed
						$scope.fnaListCompleted.push(listItem[i]);
					}
				}
            }
            $scope.isLoadList = true;
        });
    };
    
    $(".carousel").carousel({
    	  interval: false
    });

    /**
     * @author nle34
     * Load and update list data when change slide
     * @param event
     */
    $(".carousel").on('slid.bs.carousel',function(e){
       eval("$scope." + e.relatedTarget.firstElementChild.getAttribute('reloadlist'));
    });
	
}];