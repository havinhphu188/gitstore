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

var factfindUIModule = angular.module('factfindUIModule',['factfindModule', 'commonUIModule'])
.service('factfindUIService', ['$q', 'ajax', '$location', 'appService', 'cacheService', 'commonUIService', 'factfindCoreService', 'commonService', 'workspaceService',
	function($q, ajax, $location, appService, cacheService, commonUIService, factfindCoreService, commonService, workspaceService){

	function FactFindUIService($q, ajax, $location, appService, cacheService, factfindCoreService, commonService){
		var self = this;
		self.outsideDoc;//full document of FNA, or outside FNA
		self.insideDoc;//CURRENT inside FNA
		factfindCoreService.constructor.call(self, $q, ajax, $location, appService, cacheService, factfindCoreService.detailCoreService, commonService);
	};
	inherit(factfindCoreService.constructor, FactFindUIService);
	extend(commonUIService.constructor, FactFindUIService);

	FactFindUIService.prototype.isInsideView = function(){
		return this.insideDoc;
	}
	
	FactFindUIService.prototype.findElementInInsideDoc_V3 = function(element){
		return this.findElementInElement_V3(this.insideDoc, element);
	}
	
	return new FactFindUIService($q, ajax, $location, appService, cacheService, factfindCoreService, commonService);
}]);
