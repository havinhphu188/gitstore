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
var UwGroupTermLifeDetailCtrl = ['$scope', '$compile', '$state', '$filter', '$mdDialog', '$document', '$http', '$log', '$timeout', '$interval', 'ajax', 'urlService', 'uiRenderPrototypeService', 'commonService', '$translate', '$translatePartialLoader', 'multiUploadService','fileReader','$upload','commonUIService', 'factfindUIService', 'prospectPersonalUIService', 'printPdfService','gtlLevelUWUIService','policyUIService',
	function($scope, $compile, $state, $filter, $mdDialog, $document, $http, $log, $timeout, $interval, ajax, urlService, uiRenderPrototypeService, commonService, $translate, $translatePartialLoader, multiUploadService,fileReader,$upload,commonUIService, factfindUIService, prospectPersonalUIService, printPdfService,gtlLevelUWUIService,policyUIService) {
	
	$scope.portletId = myArrayPortletId["my-new-workspace"];
	$scope.commonUIService = commonUIService;
	$scope.moduleService = gtlLevelUWUIService;		
	 $scope.initContextPath = contextPathRoot; 	    
	    $scope.commonService = commonService;
	    $scope.resourceURL = gtlLevelUWUIService.initialPortletURL(myArrayPortletId["my-new-workspace"]); 
	   
	    $scope.contextPathTheme = angular.contextPathTheme;
	    $scope.fileReaderService = fileReader;

	  $scope.setupStuffs = function setupStuffs () {
	       	this.generalConfigCtrl('UwGroupTermLifeDetailCtrl', gtlLevelUWUIService).then(function finishedSetup () {       		
				//TODO: Can call an event fire-up that everything in ctrl has been setup
	       	});
	       	$scope.getComputeLazy();
//			this.initializeObject();
	    };
	   
	    $scope.getComputeLazy = function() {
	        var deferred = gtlLevelUWUIService.$q.defer();
	        if(!commonService.hasValueNotEmpty(gtlLevelUWUIService.lazyChoicelist)){
	        	gtlLevelUWUIService.getModuleLazyChoicelist_V3($scope.resourceURL).then(function(data) {
	        		gtlLevelUWUIService.lazyChoiceList = gtlLevelUWUIService.lazyChoicelist;
	                deferred.resolve(data);
	            });
	        } else deferred.resolve();
	        return deferred.promise;
	    };
	    
	    $scope.setupStuffs();
	    
	    
	    
	   
		

}];
