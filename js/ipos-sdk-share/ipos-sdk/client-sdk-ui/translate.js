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

/**
 * @author nnguyen75
 * 2016.04.19
 * Configure translation for portal
 * If there's configuration defined not to use translation data from database, then use translation files in portal code instead.
 */
var translateUIModule = angular.module('translateUIModule', ['pascalprecht.translate']);

translateUIModule.config(['$translateProvider', '$translatePartialLoaderProvider', '$logProvider', function($translateProvider, $translatePartialLoaderProvider, $logProvider){
	var contextPathTheme = angular.contextPathTheme;
	if (contextPathTheme === undefined) {
		contextPathTheme = Liferay.ThemeDisplay.getPathThemeRoot();
	}
	var uiConfigs = JSON.parse(localStorage.getItem("ui_config"));
	
	if (uiConfigs !== null && !uiConfigs.DEV_MODE) {
		$logProvider.debugEnabled(false);
	}
	
	if ( (uiConfigs !== null && !uiConfigs.useTranslationDataFromDB) || window.cordova || Liferay.Fake === true) {
		if (typeof standAloneWebappType !== 'undefined') {
			$translateProvider.useLoader('$translatePartialLoader', {
				urlTemplate: contextPathTheme+'/my-view/translation/{lang}.{part}.json'
			});
		} else {
			$translateProvider.useLoader('$translatePartialLoader', {
				urlTemplate: contextPathTheme+'/views/template/json/{lang}.{part}.json'
			});
		}
	} else {
		$translateProvider.useLoader('translationFileFromDBLoader');  
	}
}]); 


/**
 * @author nnguyen75
 * 2016.04.15
 * Load translation file from database via hook
 */
translateUIModule.factory('translationFileFromDBLoader', ['$http', '$q', 'urlService', function ($http, $q, urlService) {
	return function (options) {
		var deferred = $q.defer();
		var requestUrl = "";
		var friendlyURL = window.location.pathname;
		var currentPageURL = friendlyURL.substr(friendlyURL.lastIndexOf('/') + 1, friendlyURL.length);
		if (currentPageURL === urlService.urlMap.HOME || currentPageURL === urlService.urlMap.LOGIN) {
			requestUrl = window.location.protocol + '//' + window.location.host +
						themeDisplay.getPathContext() + '/ipos-portal-hook/' + 'get-translation-data?langId=' + options.key + ".common";
		} else {
			requestUrl = window.location.protocol + '//' + window.location.host +
						themeDisplay.getPathContext() + '/ipos-portal-hook/' + 'get-translation-data?langId=' + options.key;
		}
		
		$http.get(requestUrl).success(function(result) {
			deferred.resolve(result);
		});
		return deferred.promise;
    };
}]);
