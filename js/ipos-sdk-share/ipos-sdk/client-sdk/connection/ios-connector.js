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
.service('iosConnectorService',[ '$q', '$log',
    function($q, $log) {

    function iOSConnectorService($q) {
        this.name = "ios-ConnectorService";
        // this.fnSuccess; //success callback function
        this.exData = {};  //other data return from backend system
    };

    iOSConnectorService.prototype.executeAction = function(params, fnSuccess) {
        var postData = undefined;
        //does the actionName has been implemented?
        if(this.requestMessageMapAndroid[params.actionName] == undefined){
            $log.error("The action: " + params.actionName + " hasn't been implemented in " + this.name);
            return;
        }

        //append xml data for generating PDF
        // if(params.actionName === 'PRINT_PDF')
        //     postData = this.exData.strXml;

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

        //add "params" object to "messages" object        
        this.addParamsToMessage(request.messages, params.actionParams);

        //call cordova wrapper
        iPosAppPlugin.executeProcess(request);        
    };

    

    /**
     * add values from "params" object to "messages" object
     * For ex: params: ['prospect', '6fb9e90a-78a2-4784-911d-6c95061a5cb1']
     * {1} in action will take value of params[1]
     * {0} will take params[0]
     * {9} will take params[9], don't need to declare {8} to have {9}
     */
    iOSConnectorService.prototype.addParamsToMessage = function(messages, params){

        for (var propName in messages){
            var propValue = messages[propName];

            //If it's string, we set value from params to messages
            if(typeof(propValue) === 'string'){
                if (propValue.charAt(0) == '{'){
                    
                    //below code must be reach only when assign data
                    if(propValue.indexOf('data}') == 1) {
                        messages[propName] = params.pop();
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
    iOSConnectorService.prototype.successProcess = function(response) {  
        var data = undefined;      
       /* if(response.messages.documentJson){
            data = response.messages.documentJson;
        }
        else if(response.messages.isValidTicket){
            data = {};
            data.isValidTicket = response.messages.isValidTicket;
            data.errorCode = response.errorCode;
        }
        //check login
        else if(response.messages.isValid){
            data = {};
            data.isValid = response.messages.isValid;
            data.errorCode = response.errorCode;
        }
        else if(response.messages.driveSyncDocumentDatas){
            data = response.messages.driveSyncDocumentDatas;
        }
        else if(response.messages.syncDocumentResuls){
            data = response.messages.syncDocumentResuls;
        }
        else if(response.messages.isSyncCompleted){
            data = response.messages.isSyncCompleted;
        }
        //after compute BI, get PDF path
        else if(response.messages.documentPathDocType == "pdf"){
            data = response.messages.documentPath;
        }
        //get PDF path to show PDF
        else if(response.messages.esignPath){
            data = response.messages.esignPath;
        }
        //when cancel esign, backend return docPath
        else if(response.messages.docPath){
            data = undefined;
        }
        else if(response.messages.hasUpdated){
            data = response.messages.hasUpdated;
        }
        else if(response.messages.resourceBinary){
            data = response.messages.resourceBinary;
        } 
        //image's content resource
        else if(response.messages.resourceFile){
            data = response.messages.resourceFile;
        }
        else if(response.messages.resourceId){
            data = response.messages.resourceId;
        }
        else if(response.messages.userTicketProfile){
            data = response.messages;
        }*/
       /* else if(response.errorCode == 0){
            data = "";
        }
        else{            
            $log.error("Data response is weird (see below): ");
            $log.error(response.messages);
            return;
        }*/

        // if(response.messages.documentPathDocType == "pdf")
        //      response.messages.documentPath

        //special case: xml for creating PDF 
       /* if (response.messages.documentXml) {
            var pdfData = iOSConnectorService.prototype.removeNameSpaceforPDF(response.messages.documentXml);
            response.context.exData.strXml = pdfData;
        };*/
        data = response;
        response.context.fnSuccess.call(null, data);
    };

    /**
     * If request fail, will return the failed response to front-end
     * @param  {[type]} response [description]
     * @return {[type]}          [description]
     */
    iOSConnectorService.prototype.failProcess = function(response) {        
        // alert("UI: Requested fail!");
        response.context.fnSuccess.call(null, response, true);
    };

    //replace record appear many times in string 
    iOSConnectorService.prototype.replaceAll = function(data, search, replace) {
        return data.replace(new RegExp(search, 'g'), replace);
    };
    //remove all namespace for compute PDF termlife
    iOSConnectorService.prototype.removeNameSpaceforPDF = function(data) {
        data = data.replace('xmlns="http://www.csc.com/integral/ipos-common"', "");
        data = data.replace('xmlns:ipos-exchangerate-information="http://www.csc.com/integral/ipos-exchangerate-information"', "");
        data = data.replace('xmlns:ipos-illustration-common="http://www.csc.com/integral/ipos-illustration-common"', "");
        data = data.replace('xmlns:ipos-product-information="http://www.csc.com/integral/ipos-product-information"', "");
        data = data.replace('xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"', "");
        data = data.replace('xmlns:ipos-illustration="http://www.csc.com/integral/ipos-illustration-term-life"', "");

        data = iOSConnectorService.prototype.replaceAll(data, "ipos-illustration:", "");
        data = iOSConnectorService.prototype.replaceAll(data, "ipos-exchangerate-information:", "");
        data = iOSConnectorService.prototype.replaceAll(data, "ipos-illustration-common:", "");
        data = iOSConnectorService.prototype.replaceAll(data, "ipos-product-information:", "");
        return data;   
    };


    iOSConnectorService.prototype.requestMessageMapAndroid = {
         "SYSTEM_CHECK_LOGIN" : {
            "action": "loginAction",
            "category": "LoginPlugin",
            "messages" : {
                "deviceInfo": "{0}",
                "encryptedPassword":"{1}",
                "encryptedUsername":"{2}"
            }
        },
 		"MODULE_DOCUMENTLIST_V3" : {
            "action": "doctype.search",
            "messages" : {
                "docType":"{0}"
            }
        }
    }
    iOSConnectorService.prototype.requestMessageMapIos = {
        /**
         * With those action has documentJson type: "{data}" must be use to indicate data field
         * For more detail, see DOCUMENT_SAVE
         */
        
        //order by action name 
        "DOCUMENT_CREATE": {
            "action": "doctype.add",
            "category": "common",
            "messages" : {
                "docType": "{0}",
                "computeKind" : "initDocument" 
            }
        },        
        "DOCUMENT_DELETE" : {
            "action": "delete.document",
            "category": "ios.platform",
            "messages" : {
                "documentId" : "{0}"
            }
        },
        "DOCUMENT_EDIT" : {
            "action": "doctype.edit",
            "category": "common",
            "messages" : {
                "docType":"{0}",
                "computeKind": "editDocument",
                "documentId" : "{1}"
            }
        },   
         "DOCUMENT_GET" : {
            "action": "doctype.find",
            "category": "common",
            "messages" : {
                "docType":"{0}",
                "productCode":"{2}",
                "documentId" : "{1}"
            }
        },   
        "DOCUMENT_LIST" : {
            "action": "doctype.search",
            "category": "common",
            "messages" : {
                "docType":"{0}"
            }
        },
         "DOCUMENT_SAVE" : {
            "action": "doctype.validate.save",
            "category": "common",
            "messages" : {
                "docType":"{0}",
                "documentJson": "{data}",
                "computeKind": ["validateDocument","computeDocument"]
            }
        },  
        // test for new way of saving doc with couple ref
        "DOCUMENT_SAVE_COUPLE_REF": {
            "action": "doctype.coupleReference",
            "category": "common",
            "messages" : {
                "docType": "{0}",
                "refDocType": "{1}",
                "documentJson": "{data}",
                "computeKind" : "couplingRefer" 
            }
        },
        "DOCUMENT_SAVE_FINAL_COUPLE_REF": {
            "action": "doctype.finalizeCoupling",
            "category": "common",
            "messages" : {
                "docType": "{0}",//prospect
                "documentId": "{1}",//PdPa-DocId
                "documentJson": "{data}"//PdpaDocument which is filled Prospect's DocId
            }
        },
        "DOCUMENT_STARRED" : {
            "action": "doctype.star",
            "category": "common",
            "messages" : {
                "docType": "{0}",
                "documentId":"{2}"
            }
        }
        ,
        "DOCUMENT_UNSTARRED" : {
            "action": "doctype.unStar",
            "category": "common",
            "messages" : {
                "docType": "{0}",
                "documentId":"{2}"
            }
        },
        "DOCUMENT_UPDATE" : {
            "action": "doctype.validate.update",
            "category": "common",
            "messages" : {
                "docType":"{0}",
                "documentJson": "{data}",
                "documentId" : "{1}",
                "computeKind": ["validateDocument","computeDocument"]
            }
        },   
        "E_SIGN" : {
            "action": "doctype.eSign",
            "category": "ios.platform",
            "messages" : {
                "documentPdf": "{0}"
            }
        },

        "E_SIGN_VIEW" : {
            "action": "doctype.eSign",
            "category": "ios.platform",
            "messages" : {
                "eSignDeact":"{1}",
                "docPathToDisplay": "{0}"
            }
        },  
        "ILLUSTRATION_LAZY_CHOICELIST" : {
            "action": "doctype.compute-lazy",
            "category": "common",
            "messages" : {
                "docType": "{0}",
                "productCode": "{1}"
            }
        }, 
        "NETWORK_INDICATOR" : {
            "action": "network.indicator",
            "category": "ios.platform",
            "messages" : {
                "notification": "{0}",
            }
        }, 
        "PRODUCT_COMPUTE" : {
            "action": "doctype.compute",
            "category": "common",
            "messages" : {
                "docType":"{0}",
                "productCode":"{1}", 
                "documentJson": "{data}",
                "computeKind": "computeDocument"
            }
        },
        "PRODUCT_EDIT" : {
            "action": "doctype.edit",
            "category": "common",
            "messages" : {
                "docType":"{0}",
                "computeKind": "editDocument",
                "documentId" : "{2}"
            }
        },   
       
        "PRODUCT_SAVE" : {
            "action": "doctype.validate.save",
            "category": "common",
            "messages" : {
                "docType":"{0}",
                "productCode":"{1}", 
                "documentJson": "{data}",
                "computeKind": ["validateDocument","computeDocument"]
            }
        }, 

        "PRODUCT_UPDATE" : {
            "action": "doctype.validate.update",
            "category": "common",
            "messages" : {
                "docType":"{0}",
                "documentId" : "{1}",
                "productCode":"{2}", 
                "documentJson": "{data}",
                "computeKind": ["validateDocument","computeDocument"]
            }
        }, 
       
        "PRODUCT_CREATE": {
            "action": "doctype.add",
            "category": "common",
            "messages" : {
                "docType":"{0}",
                "productCode":"{1}",  
                "computeKind":"initDocument"
            }
        },
        "PRODUCT_STARRED" : {
            "action": "doctype.star",
            "category": "common",
            "messages" : {
                "docType": "{0}",
                "productCode":"{1}",  
                "documentId":"{2}"
            }
        },
        "PRODUCT_UNSTARRED" : {
            "action": "doctype.unStar",
            "category": "common",
            "messages" : {
                "docType": "{0}",
                "productCode":"{1}",  
                "documentId":"{2}"
            }
        },
        "PROSPECT_LAZY_CHOICELIST" : {
            "action": "doctype.compute-lazy",
            "category": "common",
            "messages" : {
                "docType":"{0}"
            }
        },  
        "RESOURCE_CREATE" : {
            "action": "docType.attachment.save",
            "category": "ios.platform",
            "messages" : {
                "docType":"resource-file",
                "resourcePath": "{0}"
            }
        },
        "RESOURCE_UPDATE" : {
            "action": "docType.attachment.update",
            "category": "ios.platform",
            "messages" : {
                "docType":"resource-file",
                "resourceBinary":"{0}",
                "documentId":"{1}"
            }
        },
        //resourcePath = ['img1.jpg', 'img2.jpg', 'img3.png']        
        // "RESOURCE_DELETE" : {
        //     "action": "delete.attachment",
        //     "category": "ios.platform",
        //     "messages" : {
        //         "documentId" : "{0}",
        //         "resourceContentId" : "{1}",//refResourceId --> resource document
        //         "resourceId" : "{2}"//file id
        //     }
        // },
        // wrong order of params
        "RESOURCE_DELETE" : {
            "action": "delete.attachment",
            "category": "ios.platform",
            "messages" : {
                "documentId" : "{0}",
                "resourceId" : "{1}",//resource document
                "resourceContentId" : "{2}"//file uid
            }
        },
        "RESOURCE_GET" : {
            "action": "docType.resource.getByUid",
            "category": "ios.platform",
            "messages" : {
                "documentId":"{0}",
                "docType":"resource-file"
            }
        },
        "RESOURCE_PREVIEW": {
            "action": "docType.attachment.preview",
            "category": "ios.platform",
            "messages" : {
                "docType":"resource-file",
                "documentId":"{0}"
            }
        }, 
        "PRINT_PDF" : {
            "action": "pdf.generate",
            "category": "ios.platform",
            "messages" : {
                "documentXmlSources": {
                    "benefit" : "{data}"
                },
                "reportTemplateName": "term_life_benefit_report"
            }
        },
        "SHOW_PDF" : {
            "action": "show.pdf",
            "category": "ios.platform",
            "messages" : {
                "documentPath": "{0}",
                "documents":["doc1","doc2","doc3"]
            }
        },
        "SHOW_IMAGE_PICKER" : {
            "action": "docType.attachment",
            "category": "ios.platform",
            "messages" : {
                "docType": "image",
                "multiSelection": "{0}"
            }
        },
        "SYNC_CHECK_IN_PROGRESS" : {
            "action": "doctype.checkSyncInprogress",
            "category": "ios.platform",
            "messages" : {
            }
        },
        "SYNC_DOCS" : {
            "action": "doctype.syncDocuments",
            "category": "ios.platform",
            "messages" : {
                "driveSyncDocumentDatas":"{data}"
            }
        },
        "SYNC_GET_LIST" : {
            "action": "doctype.getAllSyncDocs",
            "category": "ios.platform",
            "messages" : {}
  
        },
        "SYNC_RESUME" : {
            "action": "doctype.resumeSync",
            "category": "ios.platform",
            "messages" : {
            }
        },
        "SYSTEM_CHECK_LOGIN" : {
             "action": "auth.check.login",
             "category": "ios.platform",
             "messages" : {
                 "userName":"{0}",
                 "password":"{1}"
             }
         },  
        
        "SYSTEM_CHECK_TICKET" : {
            "action": "auth.check.ticket",
            "category": "ios.platform",
            "messages" : {
                "ticketNumber":"{0}"
            }
        },
        "SYSTEM_GET_TICKET_INFO" : {
            "action": "ticket.info",
            "category": "ios.platform",
            "messages" : {
            }
        },  
        "UPDATE_SERVER_RESOURCES" : {
            "action": "update.resources",
            "category": "ios.platform",
            "messages" : {}
        }
        
    };    

    return new iOSConnectorService($q);
}]);