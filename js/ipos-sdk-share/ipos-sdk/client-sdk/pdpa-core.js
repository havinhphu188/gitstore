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
var pdpaModule = angular.module('pdpaModule',['coreModule'])
.service('pdpaCoreService', ['$q', 'ajax', '$location', 'appService', 'cacheService', 'detailCoreService', 'commonService', 
    function($q, ajax, $location, appService, cacheService, detailCoreService, commonService){
	
	function PdpaCoreService($q, ajax, $location, appService, cacheService, detailCoreService, commonService){
		var self = this;
		this.detailCoreService = detailCoreService;
		detailCoreService.ListDetailCoreService.call(self, $q, ajax, $location, appService, cacheService, commonService);
		this.name = commonService.CONSTANTS.MODULE_NAME.PDPA;
		this.pdpa = undefined;
	//	self.init();
	};
	inherit(detailCoreService.ListDetailCoreService, PdpaCoreService);

	PdpaCoreService.prototype.getPDPAList_V3 = function(resourceURL){
		var self = this;
		var deferred = $q.defer();
	
		var url = commonService.getUrl(commonService.urlMap.MODULE_DOCUMENTLIST_V3, [self.name]);
		 	
		 self.ajax.getRuntime(resourceURL, url, function(data){
			 deferred.resolve(data);						
		 });
		return  deferred.promise;
	};
	
	return new PdpaCoreService($q, ajax, $location, appService, cacheService, detailCoreService, commonService);
}]);