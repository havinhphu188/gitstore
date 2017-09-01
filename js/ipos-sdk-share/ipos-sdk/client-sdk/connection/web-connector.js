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
var connectionModule = angular.module('connectionModule')
.service('webConnectorService', ['$q', '$http', '$log', 'commonService', 'ajax',
    function($q, $http, $log, commonService, ajax) {

    function WebConnectorService() {
    	
    	//directSaleUserName && directSaleProfile is available in directsale web app, get from java
    	if(typeof directSaleUserName != 'undefined' && typeof directSaleProfile != 'undefined'){
    		this.username = directSaleUserName;
            this.profileId = directSaleProfile;
            this.serverUrl = serverUrl;
            this.authorization = authorization;
    	}else{
    		this.username = 'tttravelexpress02@ipos.com';
            this.profileId = 'PRdxhbP3';
//			try{
//				this.serverUrl = serverUrl;
//				this.authorization = authorization;
//			} catch (e){
//				
//			}
    	} 

        //for running on android device
        if (window.cordova){
            //this.serverUrl = "http://localhost:8111/runtime/";
            //this.serverUrl = "http://20.203.6.98:8280/ipos/apis/1.0.0/";
        	this.serverUrl = serverUrl;
        }
        //for testing on local
		else{
            // for running chrome in local desktop using ionic
            //  * NOTE: to config server URL, change it in {project_folder}/ionic.project             
            //this.serverUrl = "/gateway/drive/";
             
            //this.serverUrl = "http://20.203.6.117:2407/gateway/runtime/";
            //this.serverUrl = "http://20.203.6.117:2407/gateway/runtime/";
			//for running webapp using temporarily proxy
//           this.serverUrl = "http://localhost:8111/runtime/";
//         if (Liferay.Fake) { // will change to this after web direct use web api project
//           if (contextPath.indexOf('ipos-group-portal') != -1) {
//        	   this.serverUrl = location.origin + contextPath + "/";
//           }
           if (typeof standAloneWebappType != 'undefined' && standAloneWebappType === 'GROUP_PORTAL') {
        	   this.serverUrl = location.origin + contextPath + "/";
           }
           //this.serverUrl = "http://20.203.133.141:2408/gateway/drive/";
        }
         
        this.name = "web-ConnectorService";
        this.normalConfig = {
            headers :{  
            	Authorization: this.authorization,  
                username : this.username,
                profileId: this.profileId  
            }
        };//for normal request

        this.getDataConfig = {
            responseType: "arraybuffer",
            headers :{    
            	Authorization: this.authorization,
                username : this.username,
                profileId: this.profileId  
            }
        };//for data binary request

        this.formConfig = {
            transformRequest: angular.identity,
            headers: {  
            	Authorization: this.authorization,
                username : this.username,
                profileId: this.profileId ,
                "Content-Type": "multipart/form-data"
            }
        };//for making the multipart/form-data request
    };

    WebConnectorService.prototype.executeAction = function(params, fnSuccess) {
      
        if (params.actionName === undefined) {
            $log.error("The action: " + params.actionName + " hasn't been implemented in " + this.name);
        } 
        else {
            //TODO: right now we need to support 3 way of request
            //After done, will only request runtime directly
        	
            if (this.platform === commonService.CONSTANTS.PLATFORM.WEB_LIFERAY){
                this.request2Portal(params, fnSuccess);
            }            
            else{
            	if (window.Liferay.Fake) {
            		if (typeof standAloneWebappType != 'undefined' && standAloneWebappType === 'GROUP_PORTAL') {
	            		this.request2RuntimeV2(params, fnSuccess);
	            	} else {
	            		this.request2Runtime(params, fnSuccess);
	            	}
            	}
            }

        }
    };

    /**
     * return the right config for Angular request header
     * @param  {string} actionName the action are request
     * @return {Object}            result
     */
    WebConnectorService.prototype.getConfig = function getConfig(actionName) {
        var result;
        switch(actionName){
            case 'RESOURCE_CREATE':
                result = angular.copy(this.formConfig);
                break;
            case 'SYSTEM_CHECK_LOGIN':
                result = angular.copy(this.formConfig);
                break;
            case 'RESOURCE_GET':
                result = angular.copy(this.getDataConfig);
                break;
            default:
                result = angular.copy(this.normalConfig);
        }

        return result;
    };   

    //Currently, we don't connect runtime-web directly
    //We still need to call request through portal
    WebConnectorService.prototype.request2Portal = function getConfig(params, fnSuccess) {
    	var runtimeUrl = undefined;
    	if(this.urlMap[params.actionName] != undefined) 
    		runtimeUrl = commonService.getUrl(this.urlMap[params.actionName], params.actionParams);
        $log.debug("Request URL: " + runtimeUrl);

        var callbackFn = function callbackFn(data) {
            fnSuccess(data);
        }

        if (params.method === 'PUT') {
        	ajax.putRuntime(params.resourceURL, runtimeUrl, params.data, callbackFn);
        } else {
	        //post request
	        if(params.data){
	            ajax.postRuntime(params.resourceURL, runtimeUrl, params.data, callbackFn);
	        }
	        //get request
	        else{
	        	if(params.isResourceFile == true){
	        		ajax.getFile(params.resourceURL, runtimeUrl, callbackFn);
	        	}else{
	        		ajax.getRuntime(params.resourceURL, runtimeUrl, callbackFn);
	        	}
	        }
        }
    };

    /**
     * Send request to runtime directly, will need support from runtime for origin domain
     * If testing on web-platform, need using ionic for a configured server
     */
    WebConnectorService.prototype.request2Runtime = function getConfig(params, fnSuccess) {
        var promise;
        var result;
        var dataUrl = commonService.getUrl(this.urlMap[params.actionName], params.actionParams);
        var patternCallJava = [/metadatas/gi, /client-payments/gi, /agent-payments/gi, /tags(.+?)compute/gi];
        
        //check some endpoint to request from backend-java
		for (var i = 0; i < patternCallJava.length; i ++) {
			result = dataUrl.match(patternCallJava[i]);
			if (result){
				break;
			}
		}

        if (result) {
        	//Call to java
        	var serverUrl = 'ajax';
        	if (dataUrl.indexOf("sendEmail") != -1) {
	        	serverUrl = 'sendEmail';
	        }
        	var callbackFn = function callbackFn(data) {
                fnSuccess(data);
            }   
        	if (params.data) { //post request
	            ajax.postRuntime(serverUrl, dataUrl, params.data, callbackFn);
	        } else { //get request
	        	ajax.getRuntime(serverUrl, dataUrl, callbackFn);
	        }
	        	
	    } else {
	        var config = this.getConfig(params.actionName);
	        config.mobileAppRequest = true;	       
	        $log.debug("Request URL: " + dataUrl);	
	        //TODO: it's simple using of $http, need to enhance ajax service for more support feature    
		    if(params.data){
		       promise = $http.post(this.serverUrl + dataUrl, params.data, config);
		    }
		    else{
		       if (window.Liferay.Fake && params.actionName == "MODULE_PRINTPDF_V3_1") {
		    	   	config.responseType = 'arraybuffer';
		        	promise = $http.post(this.serverUrl + dataUrl, null, config);
		       } else {		    	   
		    	   if(window.Liferay.Fake && params.actionName == "RESOURCE_DOWNLOAD"){
		    		 //For DS download
		    		   config.headers["Content-Type"] = params.contentType;
		               config.responseType = "arraybuffer";
		    		   promise = $http.get(this.serverUrl + dataUrl+params.actionParams[0], config);
		    	   } else if(window.Liferay.Fake && params.actionName == "RESOURCE_UPLOAD"){
		    		   var callbackFn = function callbackFn(data) {
		                   fnSuccess(data);
		               }          
		               ajax.postRuntimeDS(params, dataUrl, this.serverUrl, config, callbackFn, null); 
		    	   } else {
		    		   promise = $http.get(this.serverUrl + dataUrl, config);
		    	   }
		        }
		    }
		    if(window.Liferay.Fake && params.actionName != "RESOURCE_UPLOAD"){
		        promise.success(function(data) {	
		            if (fnSuccess && typeof fnSuccess === 'function')
		                fnSuccess(data);
		        });
		    }
        }
    };

    WebConnectorService.prototype.request2RuntimeV2 = function getConfig(params, fnSuccess) {
        var runtimeUrl = undefined;
    	if (this.urlMap[params.actionName] != undefined) {
    		runtimeUrl = commonService.getUrl(this.urlMap[params.actionName], params.actionParams);
    	}
    	if (!commonService.hasValueNotEmpty(params.resourceURL)) {
    		params.resourceURL = "invokeRuntime";
    	}
        $log.debug("Request URL: " + runtimeUrl);
        
        var callbackFn = function callbackFn(data) {
            fnSuccess(data);
        }
        if (params.method === 'PUT') {
        	ajax.putRuntime(this.serverUrl + params.resourceURL, runtimeUrl, params.data, callbackFn);
        } else {
	        if (params.data) { //post request
	            ajax.postRuntime(this.serverUrl + params.resourceURL, runtimeUrl, params.data, callbackFn);
	        } else { //get request
	        	if (params.isResourceFile == true) { // for resource file
	        		ajax.getFile(this.serverUrl + params.resourceURL, runtimeUrl, callbackFn);
	        	} else {
	        		ajax.getRuntime(this.serverUrl + params.resourceURL, runtimeUrl, callbackFn);
	        	}
	        }
        }
    };
    
    //Old code from iOS HTML5 version
    // WebConnectorService.prototype.getUrl = function(urlElement, arrayOfParams) {
    //     var baseUrl = urlElement.baseUrl;
    //     var i = 0;
    //     var variable = undefined;
    //     if (commonService.hasValue(baseUrl) && commonService.hasValue(arrayOfParams)) {
    //         var count = arrayOfParams.length;
    //         for(var j = 0 ; j< count ;j++){
    //             variable = "{" + j + "}";
    //             var baseUrl = baseUrl.replace(variable, arrayOfParams[i]);
    //             i++;
    //         }
    //         // return baseUrl.replace(/\{\d+\}/g, function(substr) {
    //         //     var param = arrayOfParams[i];
    //         //     if (param) {
    //         //         i += 1;
    //         //         return param;
    //         //     } else {
    //         //         return substr;
    //         //     }
    //         // });
    //     }
    //     return baseUrl;
    // };

    //link to common-core, can treat common-core like
    WebConnectorService.prototype.urlMap = commonService.urlMap;

    //Old code from iOS HTML5 version
    // WebConnectorService.prototype.urlMap = {
    //     //sort by alphabe
    //     // "APPLICATION_CREATE": {
    //     //     "baseUrl": "{0};product={1}/create",
    //     //     "params": ["moduleName", "product"]
    //     // },
    //     // "APPLICATION_EDIT": {
    //     //     "baseUrl": "{0};product={1}/edit/{2}",
    //     //     "params": ["moduleName", "product", "docId"]
    //     // },
    //     "APPLICATION_LAZY_CHOICELIST": {
    //         "baseUrl": "{0};product={1}/computeLazy",
    //         "params": ["moduleName", "product"]
    //     },
    //     // "APPLICATION_SAVE": {
    //     //     "baseUrl": "{0};product={1}/save",
    //     //     "params": ["moduleName", "product"]
    //     // },
    //     "APPLICATION_UPDATE": {
    //         "baseUrl": "{0};product={1}/update/{2}",
    //         "params": ["moduleName", "product", "docId"]
    //     },
    //     "DOCUMENT_COMPUTE": {
    //         "baseUrl": "{0}/compute",
    //         "params": ["moduleName", "product"]
    //     },
    //     "DOCUMENT_CREATE": {
    //         "baseUrl": "{0}/create",
    //         "params": ["moduleName"]
    //     },
    //     "DOCUMENT_EDIT": {
    //         "baseUrl": "{0}/edit/{1}",
    //         "params": ["moduleName", "docid"]
    //     },
    //     "DOCUMENT_GET": {
    //         "baseUrl": "findDocument/{1}",
    //         "params": ["moduleName", "docid"]
    //     },
    //     "DOCUMENT_LIST": {
    //         "baseUrl": "{0}s",
    //         "params": ["moduleName"]
    //     },
    //     "DOCUMENT_SAVE": {
    //         "baseUrl": "{0}/validate/save",
    //         "params": ["moduleName"]
    //     },
    //     "DOCUMENT_STARRED": {
    //         "baseUrl": "{0}/starDocument/{2}",
    //         "params": ["moduleName", "docId"]
    //     },
    //     "DOCUMENT_UNSTARRED": {
    //         "baseUrl": "{0}/unStarDocument/{2}",
    //         "params": ["moduleName", "docId"]
    //     },
    //     "DOCUMENT_UPDATE": {
    //         "baseUrl": "{0}/validate/update/{1}",
    //         "params": ["moduleName", "product", "docid"]
    //     },
    //     // "ILLUSTRATION_CREATE": {
    //     //     "baseUrl": "{0};product={1}/create",
    //     //     "params": ["moduleName", "product"]
    //     // },
    //     // "ILLUSTRATION_COMPUTE": {
    //     //     "baseUrl": "{0};product={1}/compute",
    //     //     "params": ["moduleName", "product"]
    //     // },
    //     // // "ILLUSTRATION_EDIT": {
    //     // //     "baseUrl": "{0};product={1}/edit/{2}",
    //     // //     "params": ["moduleName", "product", "docId"]
    //     // // },
    //     // // "ILLUSTRATION_SAVE": {
    //     // //     "baseUrl": "{0};product={1}/save",
    //     // //     "params": ["moduleName", "product"]
    //     // // },
    //     // "ILLUSTRATION_UPDATE": {
    //     //     "baseUrl": "{0};product={1}/validate/update/{2}",
    //     //     "params": ["moduleName", "product", "docId"]
    //     // },
    //     "ILLUSTRATION_LAZY_CHOICELIST": {
    //         "baseUrl": "{0};product={1}/computeLazy",
    //         "params": ["moduleName", "product"]
    //     },
    //     "PROSPECT_LAZY_CHOICELIST": {
    //         "baseUrl": "{0}/restrictions",
    //         "params": ["moduleName"]
    //     },
    //     "PRINT_PDF": {
    //         "baseUrl": "{0};product={1}/printPdf/{2} ",
    //         "params": ["doctype", "product", "templateUid"]
    //     },
    //     "PRODUCT_COMPUTE": {
    //         "baseUrl": "{0};product={1}/compute",
    //         "params": ["moduleName", "product"]
    //     },
    //     "PRODUCT_CREATE": {
    //         "baseUrl": "{0};product={1}/create",
    //         "params": ["moduleName", "product"]
    //     },
    //     "PRODUCT_EDIT": {
    //         "baseUrl": "{0};product={1}/edit/{2}",
    //         "params": ["moduleName", "product", "docId"]
    //     },            
    //     "PRODUCT_SAVE": {
    //         "baseUrl": "{0};product={1}/validate/save",
    //         "params": ["moduleName", "product"]
    //     },
    //     "PRODUCT_UPDATE": {
    //         "baseUrl": "{0};product={2}/validate/update/{1}",
    //         "params": ["moduleName", "docId", "product", ]
    //     },
    //     "PRODUCT_STARRED": {
    //         "baseUrl": "{0};product={1}/starDocument/{2}",
    //         "params": ["moduleName", "product", "docId"]
    //     },
    //     "PRODUCT_UNSTARRED": {
    //         "baseUrl": "{0};product={1}/unStarDocument/{2}",
    //         "params": ["moduleName", "product", "docId"]
    //     },
    //     "RESOURCE_CREATE": {
    //         "baseUrl": "resources/create",
    //         "params": []
    //     },
    //     "RESOURCE_GET": { //docId of document store resource's information
    //         "baseUrl": "findFileByResourceUid/{0}",
    //         "params": ["docId"]
    //     },
    //     "RESOURCE_GET_DOC": { //get doc store resource's information
    //         "baseUrl": "findResourceByListUid/{0}",
    //         "params": ["docId"]
    //     },
    //     "SYSTEM_CHECK_TICKET": {
    //     }
    // };

    return new WebConnectorService();
}]);
