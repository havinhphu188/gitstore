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

var userUIModule = angular.module('userUIModule',['userModule', 'commonUIModule'])
.service('userUIService',  ['$q', 'ajax', '$http', '$location', 'appService', 'cacheService', 'commonUIService', 'userCoreService', 'commonService', 'pingService',
    function($q, ajax, $http, $location, appService, cacheService, commonUIService, userCoreService, commonService, pingService){

	function UserUIService($q, ajax,  $http,   $location, appService, cacheService, userCoreService, commonService){
		userCoreService.constructor.call(this, $q, ajax, $http, $location, appService, cacheService, userCoreService.detailCoreService, commonService);
		this.name = 'user';
		this.lazyChoiceList = [];
	};
	inherit(userCoreService.constructor, UserUIService);
	extend(commonUIService.constructor, UserUIService);
	
	UserUIService.prototype.updateUser = function(resourceURL, userName, userDoc) {
		var self = this;
		var deferred = self.$q.defer();
		this.updateUserDetail.call(self, resourceURL, userName, userDoc).then(function(data) {
			deferred.resolve(data);
		})
		
		return deferred.promise;
	};
	
	return new UserUIService($q, ajax, $http, $location, appService, cacheService, userCoreService, commonService);
}]);