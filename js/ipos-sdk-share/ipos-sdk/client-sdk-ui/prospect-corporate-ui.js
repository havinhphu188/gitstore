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

var prospectCorporateUIModule = angular.module('prospectCorporateUIModule',['prospectCorporateModule', 'commonUIModule'])
.service('prospectCorporateUIService', ['$q', 'ajax', '$location', 'appService', 'cacheService', 'commonUIService', 'prospectCorporateCoreService', 'commonService', 'workspaceService',
    function($q, ajax, $location, appService, cacheService, commonUIService, prospectCorporateCoreService, commonService, workspaceService){

	function ProspectCorporateUIService($q, ajax, $location, appService, cacheService, prospectCorporateCoreService, commonService){
		prospectCorporateCoreService.constructor.call(this, $q, ajax, $location, appService, cacheService, prospectCorporateCoreService.detailCoreService, commonService);
		this.name = commonService.CONSTANTS.MODULE_NAME.CORPORATE;
	
		this.prospectsFilterQuery;				//the query to filter items
		this.prospectsFilterSize = 10;			//the number of items will be shown in the detail (default is 5)
		this.prospectsFilterExpendSize = 10;	//when click to showMoreItem(), the itemsSize will increase this number.
		this.staredItemsOfGroup4 = undefined;
		this.itemsOfGroup4 = undefined;
		this.clientNum = undefined;
		this.prospectSummaryData = undefined;
	};
	inherit(prospectCorporateCoreService.constructor, ProspectCorporateUIService);
	extend(commonUIService.constructor, ProspectCorporateUIService);
	
	return new ProspectCorporateUIService($q, ajax, $location, appService, cacheService, prospectCorporateCoreService, commonService);
}]);