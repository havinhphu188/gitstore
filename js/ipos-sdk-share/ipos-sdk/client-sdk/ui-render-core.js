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
var uiRenderModule = angular.module('uiRenderModule',['coreModule'])
.service('uiRenderCoreService', ['$q', '$http', '$log', '$location', 'ajax', 'appService', 'cacheService', 'detailCoreService', 'commonService',
	function($q, $http, $log, $location, ajax, appService, cacheService, detailCoreService, commonService){
	
	function UiRenderCoreService($q, ajax, $location, appService, cacheService, detailCoreService, commonService){
		var self = this;
		this.detailCoreService = detailCoreService;
		detailCoreService.ListDetailCoreService.call(self, $q, ajax, $location, appService, cacheService, commonService);
	};
	inherit(detailCoreService.ListDetailCoreService, UiRenderCoreService);


	var CONSTANTS = {
		"cardType": {
			"ACTION": "action",
			"DEFAULT": "default",
			"TEMPLATE": "template"			
		},
		"EVENT": {
			"DETAIL_CHANGED": "detail_changed",
			"VALUE_CHANGED": "value_changed"
		},
		"type": {
			"LABEL": "label",
			"INPUT": "input",
			"SELECT": "select",
			"LONG_DROP_DOWN": "long-drop-down",
			"SWITCH_NEW_SLIDE": "v3-switch-new-slide",
			"SWITCH_NEW": "v3-switch-new",
			"NEW_DROPDOWN": "ng-newDropDown",
			"DATE_PICKER": "date-picker",
			"BUTTON": "button",
			"SWITCH": "switch",
			"TABLE": "table",
			"PREVIEW": "preview"
		},
		"format": {
			"TEXT": "text",
			"MONEY": "money",
			"DATETIME": "datetime"
		},
		"objType":{
			"uiStructure": "ui-structure",
			"uiEle": "ui-element"
		},
	};

        	UiRenderCoreService.prototype.name = "uiRenderCoreService";

        	UiRenderCoreService.prototype.frameworkPrefix = "ui-framework";//current theme data
        	UiRenderCoreService.prototype.currThemeData = undefined;//current theme data
        	UiRenderCoreService.prototype.defaultThemeName = "theme_1";//default theme

    		UiRenderCoreService.prototype.defaultHost = contextPathRoot;

    		UiRenderCoreService.prototype.CONSTANTS = CONSTANTS;
			

			//from https://gist.github.com/paulirish/5438650
	        //implement performance.now() for safari < 8.0 
			(function() {
			    if ("performance" in window === false) {
			        window.performance = {};
			    }

			    Date.now = (Date.now || function() { // thanks IE8
			        return new Date().getTime();
			    });

			    if ("now" in window.performance === false) {
			        var nowOffset = Date.now();

			        if (performance.timing && performance.timing.navigationStart) {
			            nowOffset = performance.timing.navigationStart;
			        }

			        window.performance.now = function now() {
			            return Date.now() - nowOffset;
			        };
			    }
			})();


        /**
         * Remove comment in any json before going to process the data
         * This function will support comment in json files in server
         */
        //UiRenderCoreService.prototype.getJsonHttp = function getJsonHttp (jsonUrl) {

			// return $http({
			// 	url: jsonUrl,
			// 	transformResponse: function(data, headers) {
			// 		var result;
			// 		try{
			// 			result = JSON.parse(removeJsonComment(data));	
			// 		}catch(e){
			// 			$log.error(e);
			// 			$log.error("The response isn't json content: " + data);
			// 			result = data;
			// 		}
					
			// 	    return result;
			// 	}			
			// });
        //};


		/**
		 * Remove objs in localStorage which belongs to UI_Framework only
		 */
        UiRenderCoreService.prototype.removeLocalStorageVariables = function removeLocalStorageVariables () {
        	var keysNeedToRemove = [];
        	var key;
        	var frameworkPrefix = this.frameworkPrefix + ":";

        	for (var i = 0, len = localStorage.length; i < len; i++ ) {
        		key = localStorage.key( i ) ;
        		if(key.indexOf(frameworkPrefix) !== -1)
        			keysNeedToRemove.push(key);
			}

			// Iterate over arr and remove the items by key
			for (i = 0; i < keysNeedToRemove.length; i++) {
			    localStorage.removeItem(keysNeedToRemove[i]);
			}
        };

		/**
		 * measure execute time for a function
		 * @param  {function} 	func     function need to measure
		 * @param  {String} 	funcName function name, for logging purpose
		 */
		UiRenderCoreService.prototype.measureExecuteTime = function measureExecuteTime (func, funcName) {
			var start = performance.now();

			func();

	    	var end = performance.now();
	    	var time = end - start;
            $log.debug("Running: " + funcName + " took " + time + " ms");
		};

		/**
		 * Generate key name for jsonMock & HTML of UI Framework		 
         * @param  {String} 	docParams 		parameters relative to a doctype, include:
		 *                           {String} 	refDocType 		doctype with product
		 * 	                         {String} 	businessType 	business type (renewal, new_business)
		 * 	                         {String} 	userRole 		agent role (underwriter, agent,...)
		 * 	                         {String} 	saleChannel 	channel of sale (direct, agent, bance,..)
		 * @param  {String} 	prupose 		parameter determine whether adding active role to key
		 * @return {String}             key name
		 */
	    UiRenderCoreService.prototype.genKey = function genKey (docParams, purpose) {
	    	var result = [];
	    	var docName;

	    	if(docParams.refDocType){	    		
		    	docName = docParams.refDocType.split(';');
	    		result.push(docName[0].replace(/-/g, '_'));
	    		if(docName[1]){
	    			if(docName[1]=="product=group-travel-express" && docName[0]=="underwriting") { //group-travel use underwriting_travel_express.json and html
	    				result.push("travel_express");
	    			} else {
	    				result.push(docName[1].replace("product=", "").replace(/-/g, "_"));
	    				// for underwriter role of motor product
	    				if (docParams.userRole == commonService.CONSTANTS.USER_ROLES.UW && docName[1].replace("product=", "") == 'motor-private-car-m-as') {
	    					return result[0]+'_motor_uw';
	    				}	    				
	    			}
	    		}	
	    	}
	    	

    		if(docParams.businessType && 
    			docParams.businessType !== commonService.CONSTANTS.ACTIONTYPE.NEWBUSINESS){
    			result.push(docParams.businessType.replace(/-/g, "_").toLowerCase());
    		}

	    	if(docParams.saleChannel && 
	    		docParams.saleChannel !== commonService.CONSTANTS.SALE_CHANNEL.AGENT_SALE){
	    		var saleChannelPart = '';
	    		switch(docParams.saleChannel){
	    			case commonService.CONSTANTS.SALE_CHANNEL.AGENT_SALE:
	    				saleChannelPart = 'agent_sale';
	    				break;
	    			case commonService.CONSTANTS.SALE_CHANNEL.DIRECT_SALE:
	    				saleChannelPart = 'direct_sale';
	    				break;

	    		}

	    		//if doctype has product, saleChannel must be appeared
	    		//Otherwise, this doctype doesn't need seperate views between agent_sale & direct_sale
	    		if(docName && docName[1])
	    			result.push(saleChannelPart);
	    		// result.push(docParams.saleChannel.replace(/-/g, "_").toLowerCase());
	    	}

	    	switch (purpose){
	    		case 'json-with-role':
	    			if(docParams.userRole){
		    			result.push(docParams.userRole.replace(/\s+/g, "_").toLowerCase());
    				}
    				break;
	    		default:
	    			break;
	    	}
	    	//Test new design payment
	    	/*if(docParams.refDocType == "client-payment")
	    		result.push("new");*/
	    	
	    	var layoutSuffix = commonService.CONSTANTS.LAYOUT_STYLE.DEFAULT;
	    	if (typeof layoutStyle !== 'undefined' && docParams.refDocType !== "business_catalog") {
	    		layoutSuffix = commonService.CONSTANTS.LAYOUT_STYLE[layoutStyle];
	    	}
	    	if (layoutSuffix) {
	    		result.push(layoutSuffix);
	    	}
	    	
	    	if (commonService.CONSTANTS.STANDALONE_DOCTYPE.indexOf(docParams.refDocType) != -1) {
		    	var companyNameSuffix = commonService.CONSTANTS.COMPANY_NAME.DEFAULT;
		    	if(companyName) {
		    		if (commonService.CONSTANTS.COMPANY_NAME.hasOwnProperty(companyName)) {
		    			companyNameSuffix = commonService.CONSTANTS.COMPANY_NAME[companyName];
		    		} else {
		    			companyNameSuffix = companyName;
		    		}
		    	}
		    	if (companyNameSuffix) {
		    		result.push(companyNameSuffix);
		    	}
	    	}
	    	
    		return result.join('_');
	    };

	    UiRenderCoreService.prototype.processThemeData = function processThemeData (originalTheme) {

	    	//init full values for defined icons
	    	var icons = originalTheme.data.icons;
	    	var defaultIcon = icons['default'];
	    	for(var definedIcon in icons){
	    		if(icons[definedIcon] !== defaultIcon){
	    			icons[definedIcon] = $.extend({}, defaultIcon, icons[definedIcon]);
	    		}
	    	}

	    	return originalTheme;
	    };

	    /**
	     * Get theme data from theme name.
	     * If {themeName} is empty, using default value
	     * @return {Object} Angular promise, theme data if success
	     */
	    UiRenderCoreService.prototype.getThemeData = function getThemeData (themeName) {	    	
	    	var self = this;
	    	var defer = $q.defer();

	    	//using default theme name if no theme name is provided
	    	if(!themeName)	
	    		themeName = self.defaultThemeName;

	    	//if cached, return cache	    	
	    	var themeData = self.getItemFromLocalStorage(themeName);
	    	if(themeData){		
	    		self.currThemeData = themeData.data;
	    		defer.resolve(self.currThemeData);
	    	}
	    	else{	    		
	    		var themeUrl = self.defaultHost + "/view/myNewWorkspace/themes/" + themeName + ".json";
	    		$http.get(themeUrl).then(function hadThemeData (json) {
	    			var processTheme = self.processThemeData(json.data);
	    			self.setItemToLocalStorage(themeName, json.data);
	    			self.currThemeData = processTheme.data;
	    			defer.resolve(self.currThemeData);
	    		});
	    	}
	    	return defer.promise;	
	    };


	    /**
	     * Return a theme configuration for this doctype
	     * @param  {String} refDocType doctype need to get theme
	     * @return {Object}            stores theme configuration for this doctype
	     * @see "theme_1.json" for more detail
	     */
	    UiRenderCoreService.prototype.getThemeForDoctype = function getThemeForDoctype (refDocType) {
	    	var docType = refDocType.split(';')[0];
	    	var cardsTheme = this.currThemeData.card;

    		//we clone the default values template in theme for card
    		var result = angular.copy(cardsTheme.default);

    		//find the correct themes for this doctype
	    	if(cardsTheme[docType]){
	    		var specificValues = cardsTheme[docType];//specific values for this doctype

	    		//if this doctype has many line of products
	    		if(angular.isArray(specificValues)){
	    			for (var i = 0; i < specificValues.length; i++) {
	    				if(refDocType.indexOf(specificValues[i].productLine) !== -1){
	    					specificValues = specificValues[i];
	    					break;
	    				}
	    			}
	    		}

	    		copyValueFromOther(specificValues, result);

	    	}
	    	
	    	return result;
	    };

	    /**
	     * return the value of the constant or the constant's self name
	     * @param  {String} constant 	the constant name wants to get value
	     * @return {String}            	value of constants if success, otherwise constant's name
	     */
	    UiRenderCoreService.prototype.getThemeConstants = function getThemeConstants (constant) {
	    	return this.currThemeData.constants[constant] ? this.currThemeData.constants[constant] : constant;
	    };


	    /**
	     * Return the 'userRole' attribute value of an uiStructure.
	     * If not exist, return root's value for now
	     * @param  {Object} uiStructure uiStructure need to get value
	     * @return {String}             the role need get the view for
	     */
	    UiRenderCoreService.prototype.getUiElementRefDocType = function getUiElementRefDocType(uiElement) {
	    	return uiElement.parent.getRefDocTypeOfRoot();
	    };


	    /**
	     * return the name with prefix of UI_Framework
	     * Ex: "admin" --> "ui-framework:admin"
	     * @param {[type]} name [description]
	     */
	    UiRenderCoreService.prototype.addFrameworkPrefix = function addFrameworkPrefix (name) {
	    	return this.frameworkPrefix + ":" + name;
	    };

	    /**
	     * This fn will add prefix of UI_Framework to key, after that adding it to localStorage
	     * @param {String} key key of object need to add
	     */
	    UiRenderCoreService.prototype.setItemToLocalStorage = function addItemToLocalStorage (key, obj) {
	    	try{
	    		localStorage.setItem(this.addFrameworkPrefix(key),  JSON.stringify(obj));	
	    	}catch(e){
	    		$log.error(e);
	    	}
	    };

	    /**
	     * This fn will get prefix of UI_Framework to key, after that getting it to localStorage
	     * @param {String} key key of object need to add
	     */
	    UiRenderCoreService.prototype.getItemFromLocalStorage = function getItemFromLocalStorage (key) {	    	
	    	return JSON.parse(localStorage.getItem(this.addFrameworkPrefix(key)));
	    };

	    //*************************** THEME FUNCTIONS ***************************//
	    

	     /**
	     * combine uiStructure class with the current theme
	     * @param  {Object} uiStructureRoot the root of an uiStructure
	     * @return {Object}             [description]
	     */
	    UiRenderCoreService.prototype.decorateTemplateUiStructure = function decorateTemplateUiStructure (uiStructureRoot) {
	    	var self = this;
	    	var defer = $q.defer();
	    	var refDocType = uiStructureRoot.getRefDocTypeOfRoot();
	    	self.getThemeData().then(
	    		function gotTheme (themeData) {
	    			self.measureExecuteTime(function (){	    				
		    			var docTypeTheme = self.getThemeForDoctype(refDocType);

					 	self.decorateUiStructureWithoutDetail(uiStructureRoot, docTypeTheme);
		    			self.traverseAndProcess(uiStructureRoot, [function (childUiStructure) {
		    				self.decorateUiStructureWithoutDetail(childUiStructure, docTypeTheme);
		    			}], undefined, 
		    			{
		    				bProcessAll: true,
		    			});
	    			}, "bind icons & css to uiStructure");

	    			defer.resolve(uiStructureRoot);
	    		}
	    	);
	    	return defer.promise;	
	    };
	    
	    //change constants in an obj to real values
	    UiRenderCoreService.prototype.removeObjConstants = function (obj) {
	    	for(var attr in obj){
	    		obj[attr] = this.getThemeConstants(obj[attr]);
	    	}
	    	return obj;
	    }


	    UiRenderCoreService.prototype.decorateUiStructureWithoutDetail = function decorateUiStructureWithoutDetail (uiStructure, docTypeTheme) {
	    	
	    	//process icons
	    	this.processIcons(uiStructure, docTypeTheme);
	    	
	    	//add css class for a doctype
	    	this.addCssClass(uiStructure, docTypeTheme);
	    };

	    /**
	     * converting data from jsonMock to data for viewing on screens
	     * @param  {[type]} uiStructure [description]
	     */
	    UiRenderCoreService.prototype.processIcons = function processIcons (uiStructure, docTypeTheme) {
	    	var icons;
	    	function setMainIcon(mainIconData){
	    		uiStructure.view.mainIcon = mainIconData;
	    	}
	    	
			//remove the old icons to re-generated
			uiStructure.view.icons = [];

    		var viewIcons = uiStructure.view.icons;//data to display on screen

	    	if(uiStructure.icons){
	    		icons = uiStructure.icons;
				var jsonIcons = uiStructure.icons;//data declared in json

		    	//we loop through all the icon items of uiStructure   		
	    		for (var icon in jsonIcons){
	    			if(jsonIcons[icon] === undefined)
	    				continue;
	    			var viewIcon = this.removeObjConstants($.extend({}, this.currThemeData.icons[icon], jsonIcons[icon]));
	    			viewIcons.push((viewIcon));

	    			if(icon === 'cardIcon')
	    				setMainIcon(viewIcon);
	    		}
		    	
	    	}
	    	//support for '@icon' declartion, will be deprecated soon
	    	else if(uiStructure.icon){
	    		icons = uiStructure.icon;
	    		if(angular.isObject(icons)){	    		
		    		for (var key in icons){
		    			icons[key] = this.getThemeConstants(icons[key]);			    		
		    		}

		    		//add default "main" icon
		    		if(!icons.main)
		    			icons.main = this.getThemeConstants(docTypeTheme.icons.main);

		    	}else if(angular.isString(icons)){
		    		uiStructure.icon = {"main" : this.getThemeConstants(icons) }; 
		    	}else{
		    		$log.debug("Don't know type of icons: " + icons.toString());
		    	}
	    	}
			//if not have any icons, use the icon default for this theme
	    	else{
	    		var cardIcon = angular.copy(this.currThemeData.icons['cardIcon']);
	    		cardIcon.content = this.getThemeConstants(docTypeTheme.icons.main);
	    		viewIcons.push(cardIcon);
	    		setMainIcon(cardIcon);

	    		//code for '@icon'
	    		//uiStructure.icon = {"main" :  this.getThemeConstants(docTypeTheme.icons.main) };
	    	}

	    	
	    };

	    /**
	     * Process css class for card
	     */
	    UiRenderCoreService.prototype.addCssClass = function addCssClass (uiStructure, docTypeTheme) {
	    	// var cssClass = uiStructure.cssClass;
    		if(commonService.hasValueNotEmpty(docTypeTheme.color)){
    			uiStructure.cssClass = this.getThemeConstants(docTypeTheme.color) ; //change later
    			// overwrite css in jsonMock (apply later)
    			//uiStructure.cssClass = commonService.hasValueNotEmpty(uiStructure.cssClass) ? uiStructure.cssClass : self.getThemeConstants(docTypeTheme.color) ; 
    		}
    		else{
    			$log.debug("color isn't defined for this doctype in theme");
    			
    		}
	    };

	    //*************************** THEME FUNCTIONS ***************************//


	    /**
	     * @author tphan37
	     * 20-Nov-2015
	     * extracting the portlet's id from resourceUrl string
	     * @param  {String} strResourceUrl ex: /c/portal/layout?p_l_id=23401&p_p_cacheability=cacheLevelPage&p_p_id=mynewworkspace_WAR_iposportalcommonportlet&p_p_lifecycle=2&p_p_resource_id=invokeRuntime
	     * @return {String}                ex: mynewworkspace_WAR_iposportalcommonportlet
	     */
	    UiRenderCoreService.prototype.getPortletIdFromResourceURLString = function getPortletIdFromResourceURLString (strResourceUrl) {
	    	var idPrefix = 'p_p_id=';
	    	var idBegPos = strResourceUrl.indexOf(idPrefix)  + idPrefix.length;//the begin position of id value in string
	    	var idEndPos = strResourceUrl.indexOf('&', idBegPos);//the end position of id value in string
	    	return strResourceUrl.substring(idBegPos, idEndPos);
	    };


	    /**
	     * @author tphan37
         * get a shell uiStructure for one doctype
         * Will clone an available template, if not, create new one and clone
         * @param  {String} 	resourceUrl 	
         * @param  {String} 	docParams 		parameters relative to a doctype, include:
		 *                           {String} 	refDocType 		doctype with product
		 * 	                         {String} 	businessType 	business type (renewal, new_business)
		 * 	                         {String} 	userRole 		agent role (underwriter, agent,...)
		 * 	                         {String} 	saleChannel 	channel of sale (direct, agent, bance,..)
         * @return {Object}            		uiStructure
         */
	    UiRenderCoreService.prototype.getShellUiStructure = function getShellUiStructure (resourceUrl, docParams) {
	    	var self = this;
	    	var defer = $q.defer();	    	
	    	var promise, tmpUiStructure;

	    	var fileName = self.genKey(docParams) + ".json";
	    	
	    	//if cached, return cache
	    	//var key = fileName.insertString(fileName.indexOf('.'), '_' + docParams.userRole.replace(/\s+/g, "_").toLowerCase());
	    	var key = self.genKey(docParams, 'json-with-role') + ".json";
	    	var uiStructureJsonObj = self.getItemFromLocalStorage(key);
	    	if(uiStructureJsonObj){
	    		// shellUiStructure.docParams = docParams;

	    		//restore pure Objects to uiElement instances
	    		// restoreClassInstances.call(self, shellUiStructure);
	    		var shellUiStructure = this.createUiStructure('cloneRecursive', [uiStructureJsonObj]);
	    		shellUiStructure.docParams = docParams;

	    		defer.resolve(shellUiStructure);
	    	}
	    	//if not, need to get data from server
	    	else{
	    		
	    		if(commonService.options.useUIModelFromDB){
	    			var resourceURL = iPOSLiferayPortletURL.createResourceURL();
		    		resourceURL.setPortletId(self.getPortletIdFromResourceURLString(resourceUrl));
		    		resourceURL.setResourceId("findUiDataModelFile");//path
		    		resourceURL.setParameter("jsonMockId", fileName);
		    		resourceURL = resourceURL.toString();
		    		promise = $http.get(resourceURL);
	    		}
	    		else{
	    			var jsonMockUrl = self.defaultHost + "/view/myNewWorkspace/jsonMock/" + fileName;
	    			$log.debug("Request " + jsonMockUrl);
	    			promise = $http.get(jsonMockUrl);
	    		}

	    		promise.then(function hadJsonData (json) {
	    			var plainUiStructure;

	    			self.measureExecuteTime(function () {
	    				//construct a shell uiStructure
	    				plainUiStructure = self.createUiStructureTree(json.data);	
	    			}, 'create original UiStructure Tree');

    				plainUiStructure.docParams = docParams;
    				return self.decorateTemplateUiStructure(plainUiStructure);
	    		}, function failed(){
	    			defer.reject();
	    		})
	    		//after finish decorated
	    		.then(function finishDecorated(decoratedTemplateUiStructure) {
	    			tmpUiStructure = decoratedTemplateUiStructure;
    				
	    			//get UI elements
	    			return self.getUiElementTemplate(docParams);

				})
				//request the template uiEle from server
				.then(function gotHTMLtemplate(uiEleTemplates){
					//binding html content to the uiStructure
					self.addHtmlContentToUiElement(tmpUiStructure, uiEleTemplates);


    				//the view collections for this jsonMock
	    			var trees = {
	    				"original": tmpUiStructure
	    			};
    				var shellUiStructure;
    				try{   
    					self.measureExecuteTime(function () {
		    				//construct a shell uiStructure
		    				for(var role in tmpUiStructure.permission){
		    					if (commonService.CONSTANTS.USER_ROLES[role] == docParams.userRole){
									shellUiStructure = self.createUiStructureTreeForRole(trees.original, role);
									break;
								}
		    				}
	    				}, 'Create all shellUiStructure for the current role');
						

	    				$log.debug("Finished construct the uiStructure trees for '" + fileName + "' (see object below)" );
						$log.debug(shellUiStructure);

	    				//self.setItemToLocalStorage(fileName, trees);
	    				
	    				var key = self.genKey(docParams, 'json-with-role') + ".json";
	    				self.setItemToLocalStorage(key, shellUiStructure);

	    				if(!shellUiStructure){
	    					$log.error('Please add "permission" attribute for role: "' + docParams.userRole + '" to ' + fileName);
	    				}
						
						shellUiStructure.docParams = docParams;	


	    				defer.resolve(shellUiStructure);

    				}catch(e){
    					$log.debug(e);
	    				defer.reject();
    				}
    			}, function failed(){
	    			defer.reject();
	    		});
	    	}

	    	return defer.promise;	 	
	    };
	    
	    UiRenderCoreService.prototype.updateShellUiStructureToStorage = function saveShellUiStructureToStorage (uiStructure) {
	    	var self = this;
	    	var key = self.genKey(uiStructure.docParams, 'json-with-role') + ".json";
	    	var uiStructureJsonObj = self.getItemFromLocalStorage(key);
	    	if (uiStructure != undefined && uiStructureJsonObj != undefined) {
		    	uiStructureJsonObj.isDetailChanged = uiStructure.isDetailChanged;
		    	self.setItemToLocalStorage(key, uiStructureJsonObj);
	    	}
	    };

	    UiRenderCoreService.prototype.addHtmlContentToUiElement = function addHtmlContentToUiElement (shellUiStructure, uiEleTemplates) {
			this.traverseAndProcess(shellUiStructure, undefined, 
				[
					function (childUiEle) {
						childUiEle.originalHtmlContent = uiEleTemplates[childUiEle.name];
					}
				],
				{
    				bProcessAll: true,
    			}
			);
	    };
	    
	    UiRenderCoreService.prototype.getActionBarHtml = function getActionBarHtml (refDocType, businessType, scope) {
	    	var self = this;	        
	        var defer = $q.defer();	        
	        var docName = refDocType.split(';');
	        var fileName = docName[0].replace(/-/g, "_") + '/action_bar.html';	        
	       	var url = contextPathRoot + '/view/myNewWorkspace/partial/' + fileName;
	       	$log.debug("Request: " + url + " to render action-bar");

	        var actionBarTemplate = self.getItemFromLocalStorage(fileName);
	        if(actionBarTemplate){
	        	defer.resolve(actionBarTemplate);
	        }
	        else{
	        	$http.get(url).then(function gotHtml (html) {   
	        		// self.actionBarHtmlTemplate[fileName] = html;
	        		// localStorage.setItem(fileName, JSON.stringify(html));
	        		self.setItemToLocalStorage(fileName, html);
	        		defer.resolve(html);
	        	});
	        }
	        return defer.promise;
	    };
	    
	    UiRenderCoreService.prototype.getPanelHtmlDS = function getPanelHtmlDS (refDocType, businessType, htmlPanelFileType, scope) {
	    	var self = this;
	        var viewProp = scope.viewProp;
	        var defer = $q.defer();	        
	        var docName = refDocType.split(';');
	        if (scope.uiFrameworkService.isSectionLayout(viewProp)){
	        	if(htmlPanelFileType == 'side')
	        		if(docName[0]=="illustration" || docName[0]=="application") {
	        			var productName = docName[1].split('=');
	        			var fileName = docName[0].replace(/-/g, "_") + '/side-panel' + '_' + productName[1] + '.html';
	        		} else {
	        			var fileName = docName[0].replace(/-/g, "_") + '/side-panel.html';
	        		}
	        	if(htmlPanelFileType == 'bottom'){
	        		if(docName[0]=="illustration" || docName[0]=="application") {
	        			var productName = docName[1].split('=');
	        			var fileName = docName[0].replace(/-/g, "_") + '/bottom-panel' + '_' + productName[1] + '.html';
	        		} else {
	        			var fileName = docName[0].replace(/-/g, "_") + '/bottom-panel.html';
	        		}
	        	}	        			
		    } else {
		        var fileName = docName[0].replace(/-/g, "_") + '/action_bar.html';
		    }
	        var url = null;
	        if(docName[0]=="illustration" || docName[0]=="application"){
	        	url = contextPathRoot + '/view/myNewWorkspace/partial/' + fileName;
	        } else {
	        	url = contextPathRoot + '/themes/' + companyName + '/view/workspace/partial/' + fileName;
	        }
	       	$log.debug("Request: " + url + " to render pannel");

//	        var actionBarTemplate = self.getItemFromLocalStorage(fileName);
//	        if(actionBarTemplate){
//	        	defer.resolve(actionBarTemplate);
//        }
//        else{
    	$http.get(url).then(function gotHtml (html) {   
    		// self.actionBarHtmlTemplate[fileName] = html;
    		// localStorage.setItem(fileName, JSON.stringify(html));
    		self.setItemToLocalStorage(fileName, html);
    		defer.resolve(html);
    	});
//        }
	        return defer.promise;        
	    };
	    
	    /**
	     * Get Ui elements for this doctype
	     * @param  {String} refDocType [description]
	     * @param  {String} businessType [description]
	     * @return {Object}            		Angular promise
	     */
	    UiRenderCoreService.prototype.getUiElementTemplate = function getUiElementTemplate (docParams) {
	    	var self = this;
	    	var defer = $q.defer();

	    	var fileName = self.genKey(docParams) + ".html";

	    	//if cached, return cache
	    	var uiTemplate = self.getItemFromLocalStorage(fileName);
	    	if(uiTemplate){		
	    		defer.resolve(uiTemplate);
	    	}
	    	else{
				var url = self.defaultHost + "/view/myNewWorkspace/partial/uiElements/" + fileName;
	    		$log.debug("Request " + url);
				$http.get(url).then(function(html) {
					var uiTemplate = self.getHTMLEleObject(self.convertToJsonNew(html.data, false));
					self.setItemToLocalStorage(fileName, uiTemplate);
					
					defer.resolve(uiTemplate);
		    	}, function failed(){
		    		defer.reject();
		    	});
				
	    	}
	    	return defer.promise;	 	
	    };

	    /**
	     * TODO: move this function to UiElement
	     * Return true if this js Obj a kind of uiStructure
	     * @param  {Object}  obj obj need to check
	     * @return {Boolean}     true if is an object of uiElement type
	     */
	    UiRenderCoreService.prototype.isUiStructureObj = function isUiStructureObj (obj) {
	    	if(obj && obj.objType == this.CONSTANTS.objType.uiStructure)
	    		return true;

	    	return false;
	    };

	    /**
	     * Return true if this js Obj a kind of uiElement
	     * @param  {Object}  obj obj need to check
	     * @return {Boolean}     true if is an object of uiElement type
	     */
	    UiRenderCoreService.prototype.isUiElementObj = function isUiElementObj (obj) {
	    	if(obj && obj.objType == this.CONSTANTS.objType.uiEle)
	    		return true;

	    	return false;
	    };

	    /**
	     * @author tphan37
	     * This function will create new uiStruture base on the input, won't copy links attribute (children, uiEle,...)
	     * @param  {[type]} srcUiStructure [description]
	     * @return {[type]}                [description]
	     */
	    UiRenderCoreService.prototype.copyUiStructure = function copyUiStructure (srcUiStructure) {
			return this.createUiStructure('cloneObj', [srcUiStructure]);
	    };

	    UiRenderCoreService.prototype.copyUiElement = function copyUiElement(uiElement) {
	    	//var newUiEle = new UiElement();
	    	//newUiEle.fromInstance(uiElement);
	    	//return newUiEle;
			return this.createUiElement('clone', [uiElement]);
	    }

	    /**
		 * create a shell uiStructure for a role from an original uiStructure
		 * It will read the original tree and create specific tree for a role
		 * If a node's permission attribute is not 'false' or 'true' (ex: visible: 'isNeedToShow()'), this node will be keep
		 * @param  {Object} uiStructure input uiStructure
		 * @return {Object}  a uiStructure tree for a role
		 */
	    UiRenderCoreService.prototype.createUiStructureTreeForRole = function createUiStructureTreeForRole(uiStructure, role) {
	    	var result;

	    	try{
	    		if(this.isUiStructureVisibleWithRole(uiStructure, role)){
	    		
		    		result = this.copyUiStructure(uiStructure);
		    		result.permission = result.permission[role];

		    		for (var i = 0; i < uiStructure.children.length; i++) {
		    			var child = this.createUiStructureTreeForRole(uiStructure.children[i], role);
		    			if(child){
		    				result.children.push(child);
		    			}
		    		}

		    		//processing otherType cards
		    		if(uiStructure.otherType){
		    			// result.otherType = angular.copy(this.otherTypeTmpl);

		    			for (i = uiStructure.otherType.action.length - 1; i >= 0; i--) {
		    				child = this.createUiStructureTreeForRole(uiStructure.otherType.action[i], role);
		    				if(child){
				    			child.isRender = true;
				    			child.validStatus = undefined;
			    				result.otherType.action.push(child);
			    			}
		    			}

		    			for (i = uiStructure.otherType.template.length - 1; i >= 0; i--) {
		    				child = this.createUiStructureTreeForRole(uiStructure.otherType.template[i], role);
		    				if(child){
				    			child.isRender = true;
				    			child.validStatus = undefined;
			    				result.otherType.template.push(child);
			    			}
		    			}
		    		}

		    		for (i = 0; i < uiStructure.uiEle.length; i++) {
		    			if(this.isUiEleVisibleWithRole(uiStructure.uiEle[i], role)){
		    				var newUiEle = this.copyUiElement(uiStructure.uiEle[i]);
		    				newUiEle.permission = newUiEle.permission[role];
		    				//we using the same uiEle with uiStructure
		    				result.uiEle.push(newUiEle);
		    			}
		    		}	
		    	}

	    	}catch(e){
	    		$log.error(e);
	    		result = undefined;
	    	}
	    	
	    	return result;
	    };

	    UiRenderCoreService.prototype.isUiStructureVisibleWithRole = function isUiStructureVisibleWithRole(uiStructure, role){
	    	var result = true;

	    	try{
		    	var permission = uiStructure.permission[role];
		    	if(permission){
		    		result = permission.viewable;
		    	}else{
		    		//if role isn't been defined, mean it can't be seen by this 'role'
		    		result = false;
		    	}
	    	}catch(e){
	    		$log.error(e);
	    	}

	    	return result;
	    };

	    //TODO: merge uiStructure with uiElement
	    UiRenderCoreService.prototype.isUiEleVisibleWithRole = function isUiEleVisibleWithRole(uiEle, role){
	    	return this.isUiStructureVisibleWithRole(uiEle, role);
	    };


		/**
		 * Convert jsonMock object to shell uiStructures (a tree of uiStructure)
		 * @param  {Object} docJson jsonMock (can contain many view)
		 * @return {Object}         uiStructure
		 */
		UiRenderCoreService.prototype.createUiStructureTree = function createUiStructureTree (docJson) {
	    	var self = this;
	    	if(!docJson){
	    		$log.error("Weird docJson (see docJson below): ");
	    		$log.error(docJson);
	    		return undefined;
	    	}
	    	self.dataObject = undefined;
	    	self.refMap = {};
	    	self.stackSections = {};//store Section ele not handled yet
	    	self.stackPreviews = {};//store Preview ele not handled yet

	    	self.measureExecuteTime(function (){
	    		docJson = self.cleanJson(docJson);	
	    		$log.debug(docJson);
	    	}, 'cleaning jsonMock...');

	    	//find the element which starts the section
	    	var sectionRoot = self.findSectionRegion(docJson);

	    	if(!sectionRoot){
	    		$log.error("Can't find section root (object with '@section' is object name) of this docJson (see docJson below):");
	    		$log.error(docJson);
	    		return;
	    	}	    		

    		//init root node
			var rootNode;
			self.dataObject = self.createUiStructureObj(sectionRoot, sectionRoot['section']);
			rootNode = self.dataObject;
	    	self.refMap[sectionRoot['section']] = rootNode;

			//get a copy of default permissions
			var permissions = angular.copy(commonService.options.defaultPermissions);

			//append "permissions" obj with permission values in jsonMock
			copyValueFromOther(rootNode.permission, permissions);
			rootNode.permission = permissions;

	    	//create children nodes for rootNode
	    	for(var prop in sectionRoot){
	    		if(self.isNode(sectionRoot[prop], prop))
	    			self.createChildNodes(sectionRoot[prop], prop,  rootNode.name);
            }
	    	
	    	//handle un-process elements have 'section' attribute
	    	for(var prop in self.stackSections){
	    		if(!self.refMap[prop]){
	    			$log.error("Can't find the parent of 'section' attribute of node with name:'" + prop + "'");
	    			$log.error(self.stackSections[prop]);
	    			continue;
	    		}
	    		if(!self.refMap[prop].children)
    				self.refMap[prop].children = [];
	    		self.refMap[prop].children.push(self.stackSections[prop]);
	    	}

			
			//sort uiEle according to index
			// self.sortElements(self.dataObject);

			//add level attribute to node element
			self.dataObject.level = -1;
			// self.addLevelAttr(self.dataObject);
			
	    	return self.dataObject;

	    };
 

	    
	    /**
	     * find the section root in document (depth first traverse)
	     * Section root: have "@section" match with obj name
	     * @param  {[type]} element [description]
	     * @return {[type]}         [description]
	     */
		UiRenderCoreService.prototype.findSectionRegion = function findSectionRegion (element, eleName) {

	    	if (!angular.isObject(element))
            	return undefined;

            if(commonService.hasValueNotEmpty(element['section'])){
            	if(element['section'] === eleName)
            		return element;
            }

			for(var prop in element) {
	    		var ele = this.findSectionRegion(element[prop], prop);
	    		if(ele){
	    			return ele;
	    		}
	    	}
	    };
		
		// /**
		//  * @author tphan37
		//  * Check whether input object is an attribute of node or not
		//  * @param  {String}  key a name need to check
		//  * @return {Boolean}      true if this obj is an attribute for a node
		//  */
		// UiRenderCoreService.prototype.isNodeAttribute = function isNodeAttribute(obj){
		// 	if(!obj)
		// 		return true;

	 //    	if(obj.hasOwnProperty("key") || //uiEle or uiStructure
	 //    		obj.hasOwnProperty("icon") ||
	 //    		obj.hasOwnProperty("section") ||
	 //    		Object.keys(obj).length === 0  //case uiElement empty
	 //    	){
	 //    		return false;
	 //    	}

	 //    	return true;
	 //    };

	    /**
	     * @author tphan37
	     * 25-Jan-2016
		 * Remove '@' from keys
		 */
		UiRenderCoreService.prototype.cleanJson = function cleanJson(jsonEle){

			var result;
			var cleanKey;
	    	if(angular.isObject(jsonEle)){
	    		if(angular.isArray(jsonEle)){	    			
	    			result = [];
	    			for (var i = 0; i < jsonEle.length; i++) {
	    				result.push(this.cleanJson(jsonEle[i]));
	    			}
	    		}else{
	    			result = {};
	    			for(var key in jsonEle){
	    				if(jsonEle.hasOwnProperty(key)){
							cleanKey = key[0] === '@' ? key.substr(1) : key;
	    					result[cleanKey] = this.cleanJson(jsonEle[key]);	    					
	    				}
	    			}

	    		}
	    	}else{
	    		result = jsonEle;
	    	}
	    	
	    	return result;
	    };

	    /**
		 * Check whether object is a node need to process
		 * @param  {object}  	prop 	obj need to check
		 * @param  {string} 	objName	name of object
		 * @return {boolean}      [description]
		 */
		UiRenderCoreService.prototype.isNode = function isNode(obj, objName){
			if(!obj || typeof obj === 'string' || typeof obj === 'boolean')
				return false;

	    	if( obj.hasOwnProperty("section") || //uiStructure
	    		obj.hasOwnProperty("key") || //uiEle or uiStructure
	    		obj.hasOwnProperty("type") || //uiEle for now
	    		Object.keys(obj).length === 0  //case uiElement empty
	    	){
	    		return true;
	    	}

	    	if(objName === 'icons')//TODO: can't specify it like this
	    		return false;

	    	//if can't decide, recursive to check the children	    	
	    	for(var key in obj){
	    		if(angular.isObject(obj[key])){
	    			var isNode = this.isNode(obj[key]);
	    			if(isNode)
	    				return true;
	    		}
	    	}
	    	
	    	return false;
	    };

	    /**
	     * Check whether an obj is leaf node or not
	     * @param  {Object}  obj obj need to check
	     * @return {Boolean}     true if leaf-node, otherwise false
	     */
	    UiRenderCoreService.prototype.isLeafNode =  function isLeafNode(obj) {
						
			if(obj['section'])
	    		return false;

	    	
			if('type' in obj){//for now, only 'type' exist in obj
				return true;
			}

	    	if(
	    		obj['preview'] ||
	    		obj.Options ||
	    		Object.keys(obj).length === 0
	    		)
	    		return true;	    		    	

	    	for(var prop in obj){
	    		//section or leaf node might have '@key' attribute
	    		if(prop === 'key' || prop === 'permission')
	    			continue;
	    		
		    	if(angular.isObject(obj[prop])){	    		
		    		return false;
		    	}
		    }
		    return true;
		};

		/**
		 * Get parent uiStructure
		 * If don't exist yet, will create an temporary object
		 * @param  {[type]} parentName [description]
		 * @return {[type]}            [description]
		 */
		UiRenderCoreService.prototype.getUiStructureParent = function getUiStructureParent (parentName) {
			var result = this.refMap[parentName];

			//if not exist in the refMap yet, find it in stack
			if(!result){
				result = this.stackSections[parentName];
				if(!result){
					this.stackSections[parentName] = [];
					result = this.stackSections[parentName];
				}
			}

			return result;
		};

		UiRenderCoreService.prototype.createUiElementObj = function createUiElementObj (jsonMockEle, jsonMockEleName, uiStructureParent) {
			// var uiElement = angular.copy(this.uiEleTmpl);
			//var uiElement = new UiElement();
			//uiElement.fromJsonMock(jsonMockEle, jsonMockEleName);
			var uiElement = this.createUiElement('fromJsonMock', [jsonMockEle, jsonMockEleName]);
			
			//for permission obj, add/append values from parent
			if(uiStructureParent){
				// var parentPermission = angular.copy(uiStructureParent.permission);
				// copyValueFromOther(uiElement.permission, parentPermission);
				// uiElement.permission = parentPermission;
				uiElement.addAttr('permission', $.extend({}, uiStructureParent['permission'], uiElement['permission']));
			}
			/*else{
				$log.debug("'type' of uiEle: " + uiEle.name + " isn't defined in JsonMock");
			}*/

			return uiElement;
		};

		/**
		 * setup values for uiStructure from a json element (from jsonMock file)
		 * @param  {Object} jsonMockEle the object contains information for uiStructure (from jsonMock)
		 * @param  {String} eleName     name of this uiStructure
		 * @param  {UiStructure} uiStructure the parent uiStructure
		 */
		UiRenderCoreService.prototype.createUiStructureObj = function createUiStructureObj (jsonMockEle, eleName, uiStructureParent) {
			var uiStructure = this.createUiStructure('fromJsonMock', [jsonMockEle, eleName]);

			//for permission obj, add/append values from parent
			if(uiStructureParent){
				// var parentPermission = angular.copy(uiStructureParent.permission);
				// copyValueFromOther(uiStructure.permission, parentPermission);
				// uiStructure.permission = parentPermission;
				uiStructure.permission = $.extend(true, {}, uiStructureParent['permission'], uiStructure['permission']);
			}

			return uiStructure;
		};
		

	    /**
	     * create child node(s) for a uiStructure from a json objects has 'section', 'preview',... attributes
	     * @param  {[type]} element 		a json object (from jsonMock file)
	     * @param  {[type]} eleName 		name of 'element'
	     * @param  {[type]} parentEleName 	name of parent uiStructure
	     */
	    UiRenderCoreService.prototype.createChildNodes = function createChildNodes (element, eleName, parentEleName) {
            if (!angular.isObject(element))
            	return;
            
			if(this.isLeafNode(element)){
	    		
	    		//uiEle always has parent
	    		if(!this.refMap[parentEleName]){
	    			//case can't add this element to uiEle
	    			$log.debug("parent section[name:'" + parentEleName + "'] of uiEle[name:'" + eleName + "'] isn't existed in uiStructure." + 
	    				" This uiEle won't appear in uiStructure template");
	    			return;
	    		}

	    		var uiEle = this.createUiElementObj(element, eleName, this.refMap[parentEleName]);

    			//this.refMap[parentEleName].uiEle.push(uiEle);
    			
    			// categorize the type of uiEle
    			switch(uiEle.type){
    				case this.CONSTANTS.type.PREVIEW:
    					this.refMap[parentEleName].templates.PREVIEW.push(uiEle);
    					break;
    				default:
    					this.refMap[parentEleName].uiEle.push(uiEle);
    					break;
    			}
	    		//done processing
	    		return;
            }
            else{
				//get current parent of this object
				var parentName = element['section'];
				if(!parentName){
					$log.debug("object with name:'" + eleName + "' doesn't have 'section' attribute." + " This object will not appear in uiStructure" );
				}
				else{
					var parentObj = this.getUiStructureParent(parentName);
					if(!this.isUiStructureObj(parentObj)){
						$log.error("Can't find parent(name:" + parentName + ") of card (name:" + eleName + ")");
					}

					//-----------init uiStructure general value-------

			    	this.refMap[eleName] = this.createUiStructureObj(element, eleName, parentObj);
		    		//keep track reference for fast binding
			    	var newObj = this.refMap[eleName];

		    		//-----------init uiStructure general value-------

		    		switch(newObj.cardType){
		    			case this.CONSTANTS.cardType.TEMPLATE:
		    				// if(!parentObj.otherType)
		    				// 	parentObj.otherType = angular.copy(this.otherTypeTmpl);
		    				// newObj.parent = undefined;
		    				parentObj.otherType.template.push(newObj);
		    				parentObj.templates.TEMPLATE_CARD.push(newObj);
		    				break;

		    			//action card: create action cards in parent section
		    			case this.CONSTANTS.cardType.ACTION:
		    				if(element['onClick'] || element['staticHtml']){
		    					newObj.onClick = element['onClick'];

		    					if(commonService.hasValueNotEmpty(newObj.onOpen) || commonService.hasValueNotEmpty(newObj.onClose)){
		    						$log.debug(eleName + " is action type but have '@onOpen' or '@onClose' attribute.");
		    					}
		    						
			    				// if(!parentObj.otherType)
			    				// 	parentObj.otherType = angular.copy(this.otherTypeTmpl);
								
								//newObj.parent = undefined;
		    					parentObj.otherType.action.push(newObj);
		    					parentObj.templates.ACTION_CARD.push(newObj);
		    				}
	    					else
	    						$log.debug(eleName + " is an action card but doesn't have '@onClick' attribute. Stop processing this card information");

		    				break;

		    			//for normal card 	
		    			default:		
		    				//TODO: does we need this attribute?
		    				// newObj.onClick = element['@onClick'];

							parentObj.children.push(newObj);
		    			
		    		}	  
				}		    	  		
	    	}	    	
            
	    	//further traversing to create children nodes
	    	for(var prop in element){
	    		// if(!this.isNodeAttribute(element[prop]))
	    		if(this.isNode(element[prop], prop))
	    			this.createChildNodes(element[prop], prop, eleName);
	    			//continue;
            }
	    };
	    


      //   // sort function 
      //   UiRenderCoreService.prototype.sortElements = function sortElements (element) {
	    	// if (!angular.isObject(element))
      //       	return undefined;
        	
	    	// for(var prop in element){
	    	// 	if(prop == 'uiEle'){
	    	// 		if(element[prop]){
	    	// 			element[prop].sort(function(a, b) {
	    	// 				return parseFloat(a.index) - parseFloat(b.index);
	    	// 			});
	    	// 		}
	    	// 	}
	    	// 	if(prop == 'children'){
	    	// 		if(element[prop]){
	    	// 			for(var i = 0; i < element[prop].length; i++){
	    	// 				this.sortElements(element[prop][i]);
	    	// 			}
	    	// 		}
	    	// 	}
      //       }
      //   };

      //   // add level attribute to node element
      //   UiRenderCoreService.prototype.addLevelAttr = function addLevelAttr (element) {
      //   	//leaf node will be ignore
	    	// if (element.children){
	    	// 	var childCount = element.children.length;
	     //    	for (var i = childCount - 1; i >= 0; i--) {
	     //    		element.children[i].level = element.level + 1;
	     //    		this.addLevelAttr(element.children[i]);
	     //    	};
	    	// }
      //   };
        
	    /**
	     * Check action card name in array
	     * @param  {array}		children		the objects array
	     * @param  {String}		actionCardName	name of action card array need to check
	     * @return {boolean}             [description]
	     */
        UiRenderCoreService.prototype.hasActionCardWithName = function hasActionCardWithName(children, actionCardName){
        	for(var i = 0; i < children.length; i++){
				if(children[i].cardType == this.CONSTANTS.cardType.ACTION && children[i].name == actionCardName){
					return true;		    						
				}
			}
        	return false;
        };

	    UiRenderCoreService.prototype.getHTMLEleObject = function getHTMLEleObject (listNode) {
	    	var result = {};
	    	var fieldIdName = "fieldId";
	    	for (var i = listNode.length - 1; i >= 0; i--) {

	    		//get field id content attribute 
	    		
	    		//index of fieldIdName attribute
    			var start = listNode[i].indexOf(fieldIdName);

    			if(start == -1)
    				continue;

    			//find the start of attribute content
    			var iStart =  listNode[i].indexOf("\"", start + 1);
    			//find the end of attribute content
    			var iEnd =  listNode[i].indexOf("\"", iStart + 1);
    			result[listNode[i].substring(iStart + 1, iEnd)] = listNode[i];
    		}

    		return result;
	    };

	    // UiRenderCoreService.prototype.mapDOM = function mapDOM (element, json) {
		   //  var treeObject = {};

		   //  //trim the content
		   //  element = element.replace(/(\r\n|\n|\r)/gm,"");
		   //  element = element.replace(/(>\s*<)/gm,"><");

		   //  // If string convert to document Node
		   //  if (typeof element === "string") {
		   //      if (window.DOMParser) {
		   //            var parser = new DOMParser();
		   //            docNode = parser.parseFromString(element,"text/xml");
		   //      } else { // Microsoft strikes again
		   //            var docNode = new ActiveXObject("Microsoft.XMLDOM");
		   //            docNode.async = false;
		   //            docNode.loadXML(element); 
		   //      } 
		   //      element = docNode.firstChild;
		   //      $log.debug(element);
		   //  }

		   //  //Recursively loop through DOM elements and assign properties to object
		   //  function treeHTML(element, object) {
		   //      object["type"] = element.nodeName;
		   //      var nodeList = element.childNodes;
		   //      if (nodeList != null) {
		   //          if (nodeList.length) {
		   //              object["content"] = [];
		   //              for (var i = 0; i < nodeList.length; i++) {
		   //                  if (nodeList[i].nodeType == 3) {
		   //                  	object["content"].push(nodeList[i].nodeValue);	
		   //                  } else {
		   //                      object["content"].push({});
		   //                      treeHTML(nodeList[i], object["content"][object["content"].length -1]);
		   //                  }
		   //              }
		   //          }
		   //      }
		   //      if (element.attributes != null) {
		   //          if (element.attributes.length) {
		   //              object["attributes"] = {};
		   //              for (var i = 0; i < element.attributes.length; i++) {
		   //                  object["attributes"][element.attributes[i].nodeName] = element.attributes[i].nodeValue;
		   //              }
		   //          }
		   //      }
		   //  }
		   //  treeHTML(element, treeObject);

		   //  return (json) ? JSON.stringify(treeObject) : treeObject;
	    // };


	    /**
	     * convert html strings to an array of string stores html elements (a div which have "fieldId" attribute)
	     * @param  {String} 	input 	html string need to divide
	     * @param  {boolean} 	json  	if true, the result will be convert to json
	     * @return {[type]}       		String if "json" is true, array of String if "json" is false
	     */
	    UiRenderCoreService.prototype.convertToJsonNew = function convertToJsonNew (input, json) {
	    	var treeObject = [];
	    	var fieldIdVal = "fieldId";
	    	var startEle = 0;
	    	var endEle = 0;
	    	var newIndex = 0;

		    //clear comment
		  	var trimJson = input.replace(/<!--[\s\S]*?-->/g, "");
		  	//clear newline
		    trimJson = trimJson.replace(/(\r\n|\n|\r)/gm,"");
		    trimJson = trimJson.replace(/(>\s*<)/gm,"><");

		    var currFieldIdIndex = trimJson.indexOf(fieldIdVal);
		    while(currFieldIdIndex !== -1){
		    	newIndex = trimJson.indexOf(fieldIdVal, currFieldIdIndex + 1);

		    	if(newIndex !== -1){
		    		//now we have the next element stores "fieldId", need to find the end of prev "fieldId" element
		    		endEle = findLastOpenTag(newIndex) - 1;
		    		treeObject.push(trimJson.substr(startEle, endEle - startEle + 1));
		    		startEle = endEle + 1;
		    	}
		    	//end of file, can't find another fieldIds
		    	else{
		    		treeObject.push(trimJson.substr(startEle, trimJson.length - startEle + 1));
		    	}

		    	currFieldIdIndex = newIndex;
		    }

		    //will find the last open tag '<'
		    function findLastOpenTag (index) {
		    	while(trimJson[index] !== '<' ){
		    		index--;
		    	}

		    	return index;
		    }

		    return (json) ? JSON.stringify(treeObject) : treeObject;
	    };

	    /**
	     * get the list of empty field in uiStructure
	     * @param  {uiStructure} 	input 	
	     * @return {[type]}       	output	array of empty field
	     */
	    UiRenderCoreService.prototype.getEmptyFieldList = function getEmptyFieldList(uiStructure){
	    	var emptyFields = [];
	    	if(!uiStructure.isUiStructureLeaf()){
	    		//var emptyFields = [];
	    		var cards = this.getVisibleChildren(uiStructure);
	    		for (var i = 0; i < cards.length; i++){
	    			emptyFields = emptyFields.concat(this.getEmptyFieldList(cards[i]));
	    			//emptyFields = emptyFields.concat(emptyFields);
	    		}
	    		// uiStructure.data.emptyFields = emptyFields;
	    	}
	    	else{
	    		var uiElementList = this.getVisibleUiElements(uiStructure);
	            for (var i = 0; i < uiElementList.length; i++){
	            	var uiEle = uiElementList[i];
	                
	                if(commonService.hasValueNotEmpty(uiEle.refDetail) && typeof(uiEle.refDetail) !== 'string' &&
		                !this.isMandatoryFieldSatisfy(uiEle.refDetail) ){
	                	//if(uiStructure.data.emptyFields.indexOf(uiEle) < 0)
	                		//uiStructure.data.emptyFields.push(uiEle);
	                	emptyFields.push(uiEle);
		            }
	            }
	            //this.updateUIStructureEmptyFieldList(uiStructure);
	    	}
	    	return emptyFields;
	    };

	    /**
	     * get the number of empty mandatory fields 
	     * @param {uiStructure}   input 
	     */
	    UiRenderCoreService.prototype.markNumberOfEmptyFields = function markNumberOfEmptyFields(uiStructure){
	    	uiStructure.view.FieldsInformation.NumEmptyRequiredFields = 0;
	    	if(uiStructure.isUiStructureLeaf()){
	    		var numEmptyRequiredFields = this.getEmptyFieldList(uiStructure).length;
	    		uiStructure.view.FieldsInformation.NumEmptyRequiredFields = numEmptyRequiredFields;
	    	}
	    	else{
	    		for(var i = 0; i < uiStructure.children.length; i++){
	    			var card = uiStructure.children[i];
	    			this.markNumberOfEmptyFields(card);
	    			uiStructure.view.FieldsInformation.NumEmptyRequiredFields = uiStructure.view.FieldsInformation.NumEmptyRequiredFields + card.view.FieldsInformation.NumEmptyRequiredFields;
	    			if(i == uiStructure.children.length-1){
	    				this.updateNumberOfEmptyFieldsParent(uiStructure);
	    			}
	    		}
	    	}
	    	
	    };

	    /*
	     * Update number of empty mandatory fields
	     */
	    UiRenderCoreService.prototype.updateNumberOfEmptyFields = function updateNumberOfEmptyFields(uiStructure){
	    	var oldNumberOfEmptyFields = uiStructure.view.FieldsInformation.NumEmptyRequiredFields;
	    	this.markNumberOfEmptyFields(uiStructure);
	    	if (oldNumberOfEmptyFields !== uiStructure.view.FieldsInformation.NumEmptyRequiredFields){
	    		this.updateNumberOfEmptyFieldsParent(uiStructure);
	    	}
	    };

		/*
	     * Update number of empty mandatory fields for parent cards
	     */
	    UiRenderCoreService.prototype.updateNumberOfEmptyFieldsParent = function updateNumberOfEmptyFieldsParent(uiStructure){
	    	var pUiStructure = uiStructure.parent;
	    	while(pUiStructure){
	    		//stop if NumEmptyRequiredFields of child and father is the same, no more processing
	    		if(pUiStructure.view.FieldsInformation.NumEmptyRequiredFields === uiStructure.view.FieldsInformation.NumEmptyRequiredFields)
	    			break;
	    		else{
	    			if(pUiStructure.children.length > 0){	 
	    				var numEmptyRequiredFields = 0;
		    			for(var i = 0; i < pUiStructure.children.length; i++){
			    			var card = pUiStructure.children[i];
			    			numEmptyRequiredFields = numEmptyRequiredFields + card.view.FieldsInformation.NumEmptyRequiredFields;
			    		}
			    		
			    		//keep update parent cards
			    		if(numEmptyRequiredFields !== pUiStructure.view.FieldsInformation.NumEmptyRequiredFields){
			    			pUiStructure.view.FieldsInformation.NumEmptyRequiredFields = numEmptyRequiredFields;

			    		}
			    		//stop processing
			    		else
			    			break;
		    		}
		    		//In case card doesn't have child
	    			//--> child is from other doctype,
	    			else {
	    				pUiStructure.view.FieldsInformation.NumEmptyRequiredFields = uiStructure.view.FieldsInformation.NumEmptyRequiredFields;
	    			}
	    		}

	    		uiStructure = pUiStructure;	
			    pUiStructure = pUiStructure.parent;
	    	}
	    };

	    /**
	     * CHeck whether element detail's mandatory is statisfied (not empty)
         * @param  {Object} elementDetail     	the dataset of an element
         * @return {Boolean}          			return true if valid, false if invalid
         */
	    UiRenderCoreService.prototype.isMandatoryFieldSatisfy = function isMandatoryFieldSatisfy(elementDetail){
	    	// if(uiEle && uiEle.refDetail){	   
				/*if(elementDetail["@mandatory"] === '1'){
					if(elementDetail["Options"]){
						if(!elementDetail.Value)
							return false;
					}
					else {
						if(!elementDetail.$)
							return false;
					}
				}*/
				var rs = true;
				if (elementDetail!=null && elementDetail['@mandatory'] && elementDetail['@mandatory']==='1'){
					var data = elementDetail.Options ? elementDetail.Value : elementDetail.$;
	  			  	if (!commonService.hasValueNotEmpty(data)){
	  					rs = false;
	  			  	}
				}
				else{
					for (var prop in elementDetail){
		  		  		if(typeof(elementDetail[prop])==='object')
		  		  			rs = isMandatoryFieldSatisfy (elementDetail[prop]);
		  		  		if(!rs){
		  		  			break;
		  		  		}
		  		  	}
				}
				
	    		return rs;
	    	// }
	    };


	function removeJsonComment(data) {
		data = data.replace(/\/\/.*/g, "");
	  	return data;
	}

	return new UiRenderCoreService($q, ajax, $location, appService, cacheService, detailCoreService, commonService);
}]);


/**
 * @author tphan37
 * 2016-Apr-06
 * Simple Observer: register event, dispatch event
 */
var Observer = (function() {
	var propName = '_registerEvents';

	//get the mapping list between event names & registered functions
	function getEventLst() {
		if(!this[propName])
		 	this[propName] = {};

		 return this[propName];
	};

	/**
	 * add function to a given event name
	 * @param {string} 		eventName  event name want to register
	 * @param {function} 	callbackFn function want to register
	 */
	function onEvent(eventName, callbackFn) {
		var eventLst = getEventLst.call(this);
		eventLst[eventName] = eventLst[eventName] || [];
		eventLst[eventName].push(callbackFn);
		return this;
	};


	/**
	 * remove a function which registered to an event name
	 * @param {string} 		eventName  event name which functions has been register
	 * @param {function} 	callbackFn function want to unregister
	 */
	function removeEvent(eventName, callbackFn) {
		var eventLst = getEventLst.call(this);
		if(!eventLst[eventName])
			return;

		for (var i = eventLst[eventName].length - 1; i >= 0; i--) {
			if (eventLst[eventName][i] === callbackFn){
				eventLst[eventName].splice(i, 1);
				break;
			}
		}

		return this;
	};

	/**
	 * fire an event to observers
	 * @param {string} 		eventName  event name which notify to observers
	 * @param {Object} 		data 	   data want to pass to the observers
	 */
	function fireEvent(eventName, data) {
		var eventLst = getEventLst.call(this);
		if(!eventLst[eventName])
			return;

		for (var i = eventLst[eventName].length - 1; i >= 0; i--) {
			eventLst[eventName][i].call(null, { name: eventName, data: data});
		}

		return this;
	};

	/**
	 * add Observer functions to an input clazz
	 * @param  {Object} clazz input Object want to have Observer functions
	 */
	var extendMethods = function(clazz) {			

		clazz.prototype.onEvent = onEvent;

		clazz.prototype.removeEvent = removeEvent;

		clazz.prototype.fireEvent = fireEvent;
	};


	return {
		extendMethods: extendMethods
	};
})();

