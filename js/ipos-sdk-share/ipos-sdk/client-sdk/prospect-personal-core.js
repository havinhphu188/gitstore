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
var prospectPersonalModule = angular.module('prospectPersonalModule',['coreModule'])
.service('prospectPersonalCoreService', ['$q', 'ajax', '$location', 'appService', 'cacheService', 'detailCoreService', 'commonService',
    function($q, ajax, $location, appService, cacheService, detailCoreService, commonService){
	
	function ProspectPersonalCoreService($q, ajax, $location, appService, cacheService, detailCoreService, commonService){
		var self = this;
		this.detailCoreService = detailCoreService;
		detailCoreService.ListDetailCoreService.call(self, $q, ajax, $location, appService, cacheService, commonService);
		this.name = commonService.CONSTANTS.MODULE_NAME.PROSPECT;
		this.pdpa = undefined;
	//	self.init();
	};
	inherit(detailCoreService.ListDetailCoreService, ProspectPersonalCoreService);

	ProspectPersonalCoreService.prototype.initializeObject_V3 = function(resourceURL, docType, productName, caseName, moreParams){
		var self = this;
		var deferred = $q.defer();
		
		var prospectType = moreParams ? moreParams.specType : undefined;

		detailCoreService.ListDetailCoreService.prototype.initializeObject_V3.call(self, resourceURL, docType, productName, caseName, moreParams).then(function(detail) {

			//if type is defined, need to call refresh function again for new prospect	
			if (prospectType){
				self.findElementInDetail_V3(['PersonContactRole']).Value = prospectType;	
				self.refresh_V3(resourceURL).then(function(detail) {
					deferred.resolve(detail);
				});
			}
			//if type is not defined, return the current detail
			else{
				deferred.resolve(detail);
			}
		});
		return  deferred.promise;
	};
	
	
	return new ProspectPersonalCoreService($q, ajax, $location, appService, cacheService, detailCoreService, commonService);
}]);
