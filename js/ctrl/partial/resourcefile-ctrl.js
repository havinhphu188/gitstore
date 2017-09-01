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
var ResourceFileDetailCtrl = ['$rootScope', '$scope', '$log', 'commonService', 'commonUIService', 'fileReader', 'salecaseUIService', 'resourceUIService',
	function($rootScope, $scope, $log, commonService, commonUIService, fileReader, salecaseUIService, resourceUIService) {
	
	$scope.commonUIService = commonUIService;
	$scope.moduleService = resourceUIService;
	$scope.salecaseUIService = salecaseUIService;
	$scope.fileReaderService = fileReader;
	
	$scope.setupStuffs = function setupStuffs() {
		this.generalConfigCtrl('ResourceFileDetailCtrl', resourceUIService).then(function finishedSetup() {
	
		});
	};
	
	$scope.setupStuffs();
}];