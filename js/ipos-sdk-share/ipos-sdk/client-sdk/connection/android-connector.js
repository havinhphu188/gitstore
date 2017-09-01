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
.service('androidConnectorService',[ '$q', '$log',
    function($q, $log) {

    function AndroidConnectorService($q) {
        this.name = "android-ConnectorService";
        // this.fnSuccess; //success callback function
        this.exData = {};  //other data return from backend system
    };

    AndroidConnectorService.prototype.executeAction = function(params, fnSuccess) {
        var postData = undefined;
        //does the actionName has been implemented?
        if(this.requestMessageMapAndroid[params.actionName] == undefined){
            $log.error("The action: " + params.actionName + " hasn't been implemented in " + this.name);
            return;
        }

        var context = {};
        context.fnSuccess = fnSuccess;
        context.exData = this.exData;

        //create requestMessage
        var request = new iPosAppPlugin.RequestMessage();
        request.success = this.successProcess;
        request.fail = this.failProcess;
        request.action = this.requestMessageMapAndroid[params.actionName].action;
        // request.category = this.requestMessageMap[params.actionName].category;
        request.messages = angular.copy(this.requestMessageMapAndroid[params.actionName].messages);
        //append current context        
        request.context = context;

        // add postData to "params" object        
        // if(postData != undefined)
        //     params.push(postData);
        
        /*if(params.data != undefined)
        	params.actionParams.push(params.data);*/

        //add "params" object to "messages" object        
        this.addParamsToMessage(request.messages, params.actionParams, params.data);

        //call cordova wrapper
        iPosAppPlugin.executeProcess(request);
        
        loadingCounter++;
        if(loadingCounter > 0){
        	angular.element('#waitingBar').css("display", "table");
        }
    };

    

    /**
     * add values from "params" object to "messages" object
     * For ex: params: ['prospect', '6fb9e90a-78a2-4784-911d-6c95061a5cb1']
     * {1} in action will take value of params[1]
     * {0} will take params[0]
     * {9} will take params[9], don't need to declare {8} to have {9}
     */
    AndroidConnectorService.prototype.addParamsToMessage = function(messages, params, data){

        for (var propName in messages){
            var propValue = messages[propName];

            //If it's string, we set value from params to messages
            if(typeof(propValue) === 'string'){
                if (propValue.charAt(0) == '{'){
                    
                    //below code must be reach only when assign data
                    if(propValue.indexOf('data}') == 1) {
                        messages[propName] = data;
                    }else if(propValue.charAt(2) == '}') {
                        messages[propName] = params[propValue.charAt(1)];                    
                    }
                    
                }
            }
            //otherwise, call recursive
            else{          
                this.addParamsToMessage(propValue, params);                
            }            
        };
    }

    /**
     * Will be call when the cordova return the success repsonse
     * @param  {Object} response responde from cordova underlying
     */
    AndroidConnectorService.prototype.successProcess = function(response) {  
        var data = undefined;      
        data = response;
        response.context.fnSuccess.call(null, data);
        
        loadingCounter--;
        setTimeout(function(){ 
        	if(loadingCounter == 0){
            	angular.element('#waitingBar').css("display", "none");
            }
        });
    };

    /**
     * If request fail, will return the failed response to front-end
     * @param  {[type]} response [description]
     * @return {[type]}          [description]
     */
    AndroidConnectorService.prototype.failProcess = function(response) {                
    	if(angular.isString(response)==true){
        	alert("UI: Requested fail!");
        }else{
        	response.context.fnSuccess.call(null, response, true);
        }       
    	loadingCounter--;
        setTimeout(function(){ 
        	if(loadingCounter == 0){
            	angular.element('#waitingBar').css("display", "none");
            }
        });
    };

    //replace record appear many times in string 
    AndroidConnectorService.prototype.replaceAll = function(data, search, replace) {
        return data.replace(new RegExp(search, 'g'), replace);
    };



    AndroidConnectorService.prototype.requestMessageMapAndroid = {
	    "CHOOSE_PROFILE" : {
            "action": "loginAction.choose-profile",
            "messages" : {
                "username":"{0}",
                "profileId":"{1}",
            }
        },
        "COMPUTE_BY_TAG_NAME" : {
            "action": "doctype.computeTags",
            "messages" : {
                "docType":"{0}",
                "tagNames":"{1}",
                "productName":"{2}",
                "transactionType":"{3}",
                "dataJson":"{data}"
            }
        },
        "CHECK_BLACKLIST" : {
            "action": "doctype.check.blacklist",
            "messages" : {
                "vehicleNum":"{0}"
            }
        },
        "CHECK_ISM" : {
        	"action": "doctype.check.ism",
            "messages" : {
                "vehicleNum":"{0}"
            }
        },
        "CHECK_USER_LOGIN" : {
        	"action": "user.check.isLogin",
            "messages" : {}
        },
        "DOCUMENT_FIND_METADATA_V3" : {
            "action": "doctype.find",
            "messages" : {
                "docId":"{0}"
            }
        },
        "DOCUMENT_EDIT" : {
            "action": "doctype.edit",
            "messages" : {
                "docType":"{0}",
                "docId":"{1}",
                "productName":"{2}",
                "transaction_type":"{3}"
            }
        },
        "DOCUMENT_ADD" : {
            "action": "doctype.add",
            "messages" : {
                "docType":"{0}",
                "productName":"{1}",
                "transaction_type":"{2}"
            }
        },
        "MODULE_LAZY_CHOICELIST_V3" : {
            "action": "doctype.compute-lazy",
            "messages" : {
                "docType":"{0}",
                "productName":"{1}",
                "transactionType":"{2}"
            }
        },
        "DOCUMENT_SAVE" : {
        	"action": "doctype.save",
            "messages" : {
                "docType":"{0}",
                "productName":"{1}",
                "transactionType":"{2}",
                "dataJson":"{data}"
            }
        },
        "DOCUMENT_VALIDATE_AND_SAVE" : {
        	"action": "doctype.validate.save",
            "messages" : {
                "docType":"{0}",
                "productName":"{1}",
                "businessStatus":"{2}",
                "transactionType":"{3}",
                "dataJson":"{data}"
            }
        },
        "DOCUMENT_UPDATE" : {
            "action": "doctype.update",
            "messages" : {
                "docType":"{0}",
                "docId":"{1}",
                "productName":"{2}",
                "transactionType":"{3}",
                "dataJson":"{data}"
            }
        },
        "DOCUMENT_VALIDATE_AND_UPDATE" : {
            "action": "doctype.validate.update",
            "messages" : {
                "docType":"{0}",
                "docId":"{1}",
                "productName":"{2}",
                "transactionType":"{3}",
                "actionType":"{4}",
                "dataJson":"{data}"
            }
        },
        "DOCUMENT_COMPUTE_V3" : {
            "action": "doctype.computeAll",
            "messages" : {
                "docType":"{0}",
                "productName":"{1}",
                "transactionType":"{2}",
                "dataJson":"{data}"
            }
        },
        "DOCUMENT_DOCMAP_DEFINITIONS" : {
            "action": "document.docmapDefinitions",
            "messages" : {}
        },
        "MODULE_DOCUMENTLIST_V3" : {
            "action": "doctype.search",
            "messages" : {
                "docType":"{0}"
            }
        },
        "MODULE_FIND_DOCUMENT" : {
            "action": "doctype.document.find",
            "messages" : {
                "docId":"{0}"
            }
        },
        "MODULE_LISTPRODUCT" : {
            "action": "doctype.product.find",
            "messages" : {
                "docType":"{0}"
            }
        },
        "GENERATE_DOCUMENT_FROM_EXIST_DOCUMENT_V3" : {
            "action": "doctype.document.generate",
            "messages" : {
            	"docId":"{0}",
                "docType":"{1}",
                "productName":"{2}"
            }
        },
        "REFRESH" : {
            "action": "doctype.document.refreshAll",
            "messages" : {
            	"docType":"{0}",
                "productName":"{1}",
                "transactionType":"{2}",
                "dataJson":"{data}"
            }
        },
        "REFRESH_TAG" : {
            "action": "doctype.document.refreshTags",
            "messages" : {
            	"docType":"{0}",
                "productName":"{1}",
                "tagNames":"{2}",
                "transactionType":"{3}",
                "dataJson":"{data}"
            }
        },
        "SYSTEM_CHECK_LOGIN" : {
            "action": "loginAction",
            "messages" : {
                "deviceInfo": "{0}",
                "encryptedPassword":"{1}",
                "encryptedUsername":"{2}"
            }
        },
        "SYNC_DOCS" : {
            "action": "doctype.syncDocuments",
            "messages" : {
                 "checkSyncTime": "{0}"
            }
        },
        "GET_LIST_PDF_TEMPLATE" : {
            "action": "doctype.document.pdf.template",
            "messages" : {
                 "docType": "{0}",
                 "productName": "{1}",
                 "actionType": "{2}"
            }
        },
        "MODULE_PRINTPDF_V3_1" : {
            "action": "doctype.document.pdf.print",
            "messages" : {
            	"docType": "{0}",
                "docId": "{1}",
                "templateId": "{2}",
                "productName": "{3}",
                "dataHTML": "{data}"
            }
        },
        "VIEW_PDF" : {
            "action": "view.pdf",
            "messages" : {
            	"docId": "{0}",
                "fileName": "{1}"
            }
        },
        "SIGN_PDF" : {
            "action": "sign.pdf",
            "messages" : {
            	"docId": "{0}",
            	"caseId": "{1}",
            	"fileName": "{2}",
            	"fileDesc": "{3}"
            }
        },
        "RESOURCE_DOWNLOAD" : {
            "action": "resource.file.download",
            "messages" : {
                "docId": "{0}",
                "caseId": "{1}",
                "fileName": "{2}"
            }
        },
        "PRESUBMISSION_CASEMANAMENT" : {
            "action": "doctype.document.preSubmission",
            "messages" : {
                "docId": "{0}",
                "transactionType": "{1}",
                "productName": "{2}"
            }
        },
        "SYSTEM_UPDATE_VALID_TIME" : {
            "action": "updateValidTime",
            "messages" : {
                "userName": "{0}",
                "validTime":"{1}"
            }
        },
        "RESOURCE_UPLOAD" : {
            "action": "resource.file.upload",
            "messages" : {
                "fileName": "{0}",
                "fileDesc": "{1}",
                "dataSource":"{data}"
            }
        },
        "DO_UNDERWRITING" : {
            "action": "doctype.document.doUnderwriting",
            "messages" : {
                "docId": "{0}",
                "actionType": "{1}",
                "productName":"{2}",
                "dataJson":"{data}"
            }
        },
        "METADATA_ADVANCESEARCH" : {
            "action": "doctype.document.metadatas.advanceSearch",
            "messages" : {
            	"docType": "{0}",
                "dataJson":"{data}"
            }
        },
        "PAID_TRANSACTION" : {
            "action": "doctype.payment.transaction.paid",
            "messages" : {
                "docId": "{0}",
                "dataJson":"{data}"
            }
        },
        "SYSTEM_CHECK_NETWORK" : {
            "action": "system.check.network",
            "messages" : {}
        },
        "PAID_TRANSACTION_DOKU" : {
            "action": "doctype.payment.transaction.doku",
            "messages" : {
                "dataJson":"{data}"
            }
        },
        "SYSTEM_GET_CONFIG" : {
            "action": "system.get.config",
            "messages" : {}
        },
        "SYSTEM_SAVE_CONFIG_LANGUAGE":{
            "action":"system.save.config.language",
            "messages" : {
                "languageCode":"{0}"
                }

        },
        "SYNC_LIST_METADATA_CASE" : {
            "action": "doctype.sync.case.metadata",
            "messages" : {}
        },
        "SYNC_DOCS_BY_CASE_ID" : {
            "action": "doctype.sync.case.document",
            "messages" : {
            	"dataJson":"{0}",
            	"dataJson2":"{1}"
            }
        },
         "SYNC_LIST_METADATA_CASE_FAIL" : {
             "action": "doctype.case.sync.fail.metadata",
             "messages" : {}
         },
         "SYNC_DOCS_FAIL_BY_CASE_ID" : {
              "action": "doctype.sync.case.fail.document",
              "messages" : {
                  "dataJson": "{data}"
              }
          },
          "CHECK_SYNC_FAIL" : {
              "action": "is.pressed",
              "messages" : {
                  "caseId": "{0}",
                  "step": "{1}"
              }
          },
        "COMPUTE_BY_FUNCTION_NAME" : {
            "action": "compute.function",
            "messages" : {
                "docType": "{0}",
                "product": "{1}",
                "functionName": "{2}",
                "dataJson":"{data}"
            }
        }


    }
  
    return new AndroidConnectorService($q);
}]);