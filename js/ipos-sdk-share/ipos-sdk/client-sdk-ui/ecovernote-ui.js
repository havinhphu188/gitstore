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

var ecovernoteUIModule = angular.module('ecovernoteUIModule',['ecovernoteModule', 'commonUIModule', 'policyUIModule'])
.service('ecovernoteUIService', ['$q', 'ajax', '$location', 'appService', 'cacheService', 'commonUIService', 'ecovernoteCoreService', 'commonService', 'pingService', 'policyCoreService', 
	function($q, ajax, $location, appService, cacheService, commonUIService, ecovernoteCoreService, commonService, pingService, policyCoreService){

	function EcovernoteUIService($q, ajax, $location, appService, cacheService, ecovernoteCoreService, commonService, policyCoreService){
		ecovernoteCoreService.constructor.call(this, $q, ajax, $location, appService, cacheService, ecovernoteCoreService.detailCoreService, commonService, policyCoreService);
		this.name = 'ecovernote';
	};
	inherit(ecovernoteCoreService.constructor, EcovernoteUIService);
	extend(commonUIService.constructor, EcovernoteUIService);
	
	
	return new EcovernoteUIService($q, ajax, $location, appService, cacheService, ecovernoteCoreService, commonService);
}]);