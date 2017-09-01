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

var endorsementUIModule = angular.module('endorsementUIModule',['endorsementModule', 'commonUIModule'])
.service('endorsementUIService', ['$q', 'ajax', '$location', 'appService', 'cacheService', 'commonUIService', 'endorsementCoreService', 'commonService', 'pingService',
	function($q, ajax, $location, appService, cacheService, commonUIService, endorsementCoreService, commonService, pingService){

	function EndorsementUIService($q, ajax, $location, appService, cacheService, endorsementCoreService, commonService){
		endorsementCoreService.constructor.call(this, $q, ajax, $location, appService, cacheService, endorsementCoreService.detailCoreService, commonService);
		this.name = 'endorsement';
		
	};
	inherit(endorsementCoreService.constructor, EndorsementUIService);
	extend(commonUIService.constructor, EndorsementUIService);
	
	
	return new EndorsementUIService($q, ajax, $location, appService, cacheService, endorsementCoreService, commonService);
}]);