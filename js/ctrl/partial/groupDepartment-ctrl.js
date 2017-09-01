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
var GroupDepartmentDetailCtrl = ['$scope', '$filter', '$log', '$state', '$mdDialog', 'commonService', 'groupDepartmentUIService','commonUIService',
	function($scope, $filter, $log, $state, $mdDialog, commonService, groupDepartmentUIService,commonUIService) {
	
	$scope.commonUIService = commonUIService;
	$scope.moduleService = groupDepartmentUIService;
	$scope.name = 'GroupDepartmentDetailCtrl';
	$scope.moduleService.freeze = false;

    $scope.init = function init () {
        var self = this;
        self.moduleIcon='fa fa-bell';
        self.generalConfigCtrl('GroupDepartmentDetailCtrl', groupDepartmentUIService);
        $scope.getComputeLazy();
    };
    
    
    $scope.getComputeLazy = function(){
    	var productName  = groupDepartmentUIService.findElementInDetail_V3(['Product']);
		if(!commonService.hasValueNotEmpty(groupDepartmentUIService.lazyChoiceList)){
			groupDepartmentUIService.getGroupDepartmentManagerReviewLazyList($scope.resourceURL, productName).then(function(data){
				groupDepartmentUIService.lazyChoiceList = data;
			});
		} 

	};
	
	$scope.groupDepartmentAction = function(action){
		$scope.saveGroupDepartment(true).then(function(data){
			if (groupDepartmentUIService.isSuccess(data)){
				var productName  = groupDepartmentUIService.findElementInDetail_V3(['Product']);
				groupDepartmentUIService.groupDepartmentManagerAction($scope.resourceURL, action, productName).then(function(data){
					if(groupDepartmentUIService.isSuccess(data)){
						$scope.refreshDetail(action);
					} else {
						commonUIService.showNotifyMessage("v3.myworkspace.message." + action + ".GroupDepartmentUnsuccessfully");
					}
				});
			}
			else {
						commonUIService.showNotifyMessage("v3.myworkspace.message." + action + ".GroupDepartmentUnsuccessfully");
					}
		});
		
	};

	$scope.saveGroupDepartment = function(validate) {	
		var productName  = groupDepartmentUIService.findElementInDetail_V3(['Product']);
		var deferred = groupDepartmentUIService.$q.defer();
    	groupDepartmentUIService.saveDetail_V3($scope.resourceURL, validate, productName).then(function(data){
    		if(groupDepartmentUIService.isSuccess(data)){
    			$scope.reSetupConcreteUiStructure(groupDepartmentUIService.detail);
				commonUIService.showNotifyMessage("v3.myworkspace.message.SaveGroupDepartmentSuccessfully",'success');
			}else{
				// Appending dialog to document.body to cover sidenav in docs app
			    var confirm = $mdDialog.confirm()
			          .title($filter('translate')("MSG-FQ06"))
			          .ok($filter('translate')("v3.yesno.enum.Y"))
			          .cancel($filter('translate')("v3.yesno.enum.N"));
			    $mdDialog.show(confirm).then(function() {
			    	groupDepartmentUIService.saveDetail_V3($scope.resourceURL, false, productName).then(function(data){
			    		if(groupDepartmentUIService.isSuccess(data)){
			    			commonUIService.showNotifyMessage("v3.mynewworkspace.message.SaveDraftGroupDepartmentSuccessfully", "success");
			    		}else{
			    			commonUIService.showNotifyMessage("v3.mynewworkspace.message.SaveDraftGroupDepartmentUnsuccessfully");
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
    
	$scope.init();
	
	$scope.refreshDetail = function(action){
		var docId = $scope.moduleService.findElementInDetail_V3(['DocInfo']).DocId;
		$scope.moduleService.findDocument_V3($scope.resourceURL, docId).then(function(data){
			var status = $scope.moduleService.findElementInDetail_V3(['DocStatus'])['BusinessStatus']; 
			if (status == "ACCEPTED"){
				groupDepartmentUIService.freeze = true;
			}
			else groupDepartmentUIService.freeze = false;
			commonUIService.showNotifyMessage("v3.myworkspace.message." + action + ".GroupDepartmentSuccessfully", "success");
			$scope.reSetupConcreteUiStructure($scope.moduleService.detail); // refresh the values in multiple cards
			$scope.$parent.refreshDetail();
		});
	};
	
}];
