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

var transactionUIModule = angular.module('transactionUIModule',['transactionModule', 'commonUIModule', 'policyUIModule'])
.service('transactionUIService', ['$q', 'ajax', '$http', '$location', 'appService', 'cacheService', 'commonUIService', 'transactionCoreService', 'commonService', 'pingService', 'policyCoreService',
    function($q, ajax, $http, $location, appService, cacheService, commonUIService, transactionCoreService, commonService, pingService, policyCoreService){

	function TransactionUIService($q, ajax,  $http,   $location, appService, cacheService, transactionCoreService, commonService, policyCoreService){
		transactionCoreService.constructor.call(this, $q, ajax,  $http,  $location, appService, cacheService, transactionCoreService.detailCoreService, commonService, policyCoreService);
		this.name = 'agent-payment';
		this.lazyChoiceList = [];
	};
	inherit(transactionCoreService.constructor, TransactionUIService);
	extend(commonUIService.constructor, TransactionUIService);
	
	return new TransactionUIService($q, ajax,  $http,   $location, appService, cacheService, transactionCoreService, commonService);
}]);