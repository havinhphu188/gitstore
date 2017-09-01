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
var ecovernoteModule = angular.module('ecovernoteModule',['coreModule'])
.service('ecovernoteCoreService', ['$q', 'ajax', '$location', 'appService', 'cacheService', 'detailCoreService', 'commonService', '$log',
	function($q, ajax, $location, appService, cacheService, detailCoreService, commonService, $log){
	
	function EcovernoteCoreService($q, ajax, $location, appService, cacheService, detailCoreService, commonService){
		var self = this;
		this.detailCoreService = detailCoreService;
		detailCoreService.ListDetailCoreService.call(self, $q, ajax, $location, appService, cacheService, commonService);
	//	this.name = commonService.CONSTANTS.MODULE_NAME.HOME;
	//	self.init();
	};
	inherit(detailCoreService.ListDetailCoreService, EcovernoteCoreService);
	 	
	EcovernoteCoreService.prototype.submitJPJ = function(resourceURL,eCoverNoteUid, product){
		var self = this;
		var deferred = self.$q.defer();
		var actionUrl = commonService.getUrl(commonService.urlMap.SUBMISSION_JPJ,[eCoverNoteUid, product]);
		$log.debug(actionUrl);
		self.ajax.postRuntime(resourceURL, actionUrl, {}, function(data){
			if (self.isSuccess(data)){
				//self.detail = data; // set detail after submit successfully
				deferred.resolve(data);
			} else {
				deferred.resolve(data);
				$log.error("submit JPJ Error!!!");
			}
		});
		return deferred.promise;
	};
	
	return new EcovernoteCoreService($q, ajax, $location, appService, cacheService, detailCoreService, commonService);
}]);