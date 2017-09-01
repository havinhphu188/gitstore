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

var pdpaUIModule = angular.module('pdpaUIModule',['pdpaModule', 'commonUIModule'])
.service('pdpaUIService', ['$q', 'ajax', '$location', 'appService', 'cacheService', 'commonUIService', 'pdpaCoreService', 'commonService', 'workspaceService',
	function($q, ajax, $location, appService, cacheService, commonUIService, pdpaCoreService, commonService, workspaceService){

	function PdpaUIService($q, ajax, $location, appService, cacheService, pdpaCoreService, commonService){
		pdpaCoreService.constructor.call(this, $q, ajax, $location, appService, cacheService, pdpaCoreService.detailCoreService, commonService);
		this.name = commonService.CONSTANTS.MODULE_NAME.PDPA;
	};
	inherit(pdpaCoreService.constructor, PdpaUIService);
	extend(commonUIService.constructor, PdpaUIService);
	
	
	PdpaUIService.prototype.update = function(resourceURL){
		var self = this;
		var deferred = self.$q.defer();
		pdpaCoreService.detailCoreService.ListDetailCoreService.prototype.saveDetail_V3.call(self,resourceURL, true, function(data){
	/*		commonService.showGlobalMessage(appService.getI18NText('workspace.save.success'));*/
			deferred.resolve(data);
		}, function(message){
			/*commonService.showGlobalMessage(message, "danger");*/
		});
		return  deferred.promise;
	};
	
	PdpaUIService.prototype.edit = function(resourceURL){
		var self = this;
		var deferred = self.$q.defer();
		pdpaCoreService.detailCoreService.ListDetailCoreService.prototype.getDetail_V3.call(self,resourceURL,true, function(data){
			/*commonService.showGlobalMessage(appService.getI18NText('workspace.save.success'));*/
			deferred.resolve(data);
		}, function(message){
			/*commonService.showGlobalMessage(message, "danger");*/
		});
		return  deferred.promise;
	};
	

	return new PdpaUIService($q, ajax, $location, appService, cacheService, pdpaCoreService, commonService);
}]);