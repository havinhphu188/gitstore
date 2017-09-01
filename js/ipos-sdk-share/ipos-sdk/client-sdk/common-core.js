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


var commonModule = angular.module('commonModule', [])
.provider('commonService', function (){
	
	this.urlMap = {
			// "DOCUMENT_VALIDATE_AND_SAVE" : {	//for save new with validate
			// 	"baseUrl" : "{0}/validate/save",
			// 	"params" : [ "doctype" ]
			// },
			"DOCUMENT_VALIDATE_AND_SAVE" : {	//for save new with validate
				"baseUrl" : "{0}/complete?product={1}&businessStatus={2}&transaction_type={3}",
				"params" : [ "doctype", "productName", "businessStatus", "transactionType" ]
			},
			// "DOCUMENT_VALIDATE_AND_SAVE_WITH_STATUS" : {	//for save new with validate and change status
			// 	"baseUrl" : "{0}/complete?businessStatus={1}",
			// 	"params" : [ "doctype", "businessStatus" ]
			// },
			// "DOCUMENT_SAVE" : {					//for save new without validate
			// 	"baseUrl" : "{0}/save",
			// 	"params" : [ "doctype" ]
			// },
			"DOCUMENT_SAVE" : {					//for save new without validate
				"baseUrl" : "{0}/incomplete?product={1}&transaction_type={2}",
				"params" : [ "doctype", "productName", "transactionType" ]
			},
			/*"DOCUMENT_VALIDATE_AND_UPDATE" : {	//for update existing with validate
				"baseUrl" : "{0}/validate/update/{1}",
				"params" : [ "doctype", "docId" ]
			},
			*/
			"DOCUMENT_VALIDATE_AND_UPDATE" : {	//for update existing with validate
				"baseUrl" : "{0}/{1}/operations/validate/update?product={2}&transaction_type={3}",
				"params" : ["moduleName", "uid", "productName", "transactionType"]
			},
			"DOCUMENT_UPDATE" : {				//for update existing without validate
				"baseUrl" : "{0}/{1}/operations/update?product={2}&transaction_type={3}",
				"params" : [ "doctype", "docId", "productName" ]
			},
			/*"DOCUMENT_VALIDATE_AND_UPDATE_V2" : {	//for update existing with validate
				"baseUrl" : "{0}/validate/update",
				"params" : [ "moduleName" ]
			},
			"DOCUMENT_UPDATE_V2" : {				//for update existing without validate
				"baseUrl" : "{0}/save",
				"params" : [ "moduleName" ]
			},
			"DOCUMENT_EDIT" : {
				"baseUrl" : "{0}/edit/{1}",
				"params" : [ "moduleName", "documentUid" ]
			},
			"DOCUMENT_GENERATE" : {
				"baseUrl" : "{0}/generate",
				"params" : [ "moduleName" ]
			},
			"DOCUMENT_GENERATE_ISRR" : {
				"baseUrl" : "{0}/generateISRR/{1}/{2}/{3}",
				"params" : [ "moduleName","fromDate","toDate","format"]
			},
			"DOCUMENT_UPDATE_REFERENCE_BY_REFTYPE" : {
				"baseUrl" : "{0}/refType/{1}/update/{2}/{3}",
				"params" : [ "moduleName", "refType", "oldDocumentUid", "newDocumentUid" ]
			},
			"DOCUMENT_TAG" : {
				"baseUrl" : "{0}/tag/{1}/{2}",
				"params" : [ "moduleName", "documentUid", "tagName" ]
			},
			"DOCUMENT_STAR" : {
				"baseUrl" : "{0}/starDocument/{1}",
				"params" : [ "moduleName", "documentUid"]
			},
			"MODULE_DOCUMENT_STAR" : { // for illustration 
				"baseUrl" : "{0};product={1}/starDocument/{2}",
				"params" : [ "moduleName", "product", "documentUid"]
			},*/
			"DOCUMENT_STAR" : {
				"baseUrl" : "{0}/{1}/operations/star/execute",
				"params" : [ "moduleName", "documentUid"]
			},
			
			"DOCUMENT_STAR_V3" : {
				"baseUrl" : "documents/{0}/operations/star/execute",
				"params" : [ "documentUid" ]
			},
			
			/*"DOCUMENT_UNTAG" : {
				"baseUrl" : "{0}/unTag/{1}/{2}",
				"params" : [ "moduleName", "documentUid", "tagName" ]
			},
			"DOCUMENT_UNSTAR" : {
				"baseUrl" : "{0}/unStarDocument/{1}",
				"params" : [ "moduleName", "documentUid"]
			},
			"MODULE_DOCUMENT_UNSTAR" : { // for illustration 
				"baseUrl" : "{0};product={1}/unStarDocument/{2}",
				"params" : [ "moduleName", "product", "documentUid"]
			},*/
			"DOCUMENT_UNSTAR" : {
				"baseUrl" : "{0}/{1}/operations/unstar/execute",
				"params" : [ "moduleName", "documentUid"]
			},
			
			"DOCUMENT_UNSTAR_V3" : {
				"baseUrl" : "documents/{0}/operations/unstar/execute",
				"params" : [ "documentUid" ]
			},
			/*"DOCUMENT_CHANGETAGLIST" : {
				"baseUrl" : "{0}/changeTagList/{1}/{2}/{3}",
				"params" : [ "moduleName", "documentUids", "fromTagName", "toTagName" ]
			},
			"DOCUMENT_CLONE" : {
				"baseUrl" : "{0}/clone",
				"params" : [ "moduleName"]
			},
			"DOCUMENT_CLONE_SALECASE" : {
				"baseUrl" : "{0}/cloneSalecase",
				"params" : [ "moduleName"]
			},
			"DOCUMENT_ADD" : {
				"baseUrl" : "{0}/create",		//for running with runtime
				"params" : [ "moduleName" ]
			},*/
			// "DOCUMENT_ADD" : {
			// 	"baseUrl" : "{0}/form",		//apply new API Url
			// 	"params" : [ "moduleName" ]
			// },
			"DOCUMENT_ADD" : {	//new API (24/Mar/2016)
				"baseUrl" : "{0}/form?product={1}&transaction_type={2}",
				"params" : [ "moduleName","productName", "transactionType"]
			},
			//this url using for UC11 BI/Quotation create new doc
			/*"QUOTATION_ADD" : {
				"baseUrl" : "{0}/create/{0}",		//for running with runtime
				"params" : [ "moduleName","type" ]
			},
			"DOCUMENT_ADD_ILLUSTRATION" : {
				"baseUrl" : "{0}/create/{1}",		//for running with runtime
				"params" : [ "moduleName","docType"]
			},
			"MODULE_DOCUMENTLIST_V3" : {
				"baseUrl" : "{0}/list",		//for running with runtime
				"params" : [ "moduleName" ]
			},*/
			"MODULE_DOCUMENTLIST_V3" : {
				"baseUrl" : "{0}s",		//apply new API Url
				"params" : [ "moduleName" ]
			},
			"MODULE_PRODUCT_DOCUMENTLIST_V3" : {
				"baseUrl" : "{0}s?product={1}",
				"params" : [ "moduleName", "product"]
			},
			/*"DOCUMENT_SEARCH_V3" : {
				"baseUrl" : "/search",  			//for running with runtime v3
				"params" : []
			},*/
			"DOCUMENT_SEARCH_V3" : {
				"baseUrl" : "/documents/metadatas/operations/search",  			//for running with runtime v3
				"params" : []
			},
			"DOCUMENT_FIND_METADATA_V3" : {
				"baseUrl" : "documents/metadatas/{0}",  			//for running with runtime v3
				"params" : ["docUid"]
			},
			"DOCUMENT_FIND_METADATA_QUERY_V3" : {
				"baseUrl" : "/documents/metadatas?doctype={0}&query={1}",  			//for running with runtime v3
				"params" : ["doctype", "query"]
			},
			"DOCUMENT_SEARCH_ALL_V3" : 'search',
			/*"DOCUMENT_FIND_DOCUMENT_V3" : {
				"baseUrl" : "{0}/findDocument/{1}",  			//for running with runtime v3
				"params" : [ "moduleName" , "docUid"]
			},*/
			"DOCUMENT_FIND_DOCUMENT_API_V3" : {
				"baseUrl" : "documents/{0}?docver=1.0",  			//for running with API
				"params" : [ "docUid"]
			},
			"DOCUMENT_FIND_DOCUMENT_API_V3_NO_VERSION" : {
				"baseUrl" : "documents/{0}",  			//for running with API
				"params" : [ "docUid"]
			},
			// "SENT_EMAIL_V3" : {
			// 	"baseUrl" : "/sendEmail/{0}",  			//for running with runtime v3
			// 	"params" : [ "moduleName" ]
			// },
			"SENT_EMAIL_V3" : {
				"baseUrl" : "{0}/operations/sendEmail",  			//apply new API Url
				"params" : [ "moduleName" ]
			},
			// "DOCUMENT_COMPUTE_V3" : {
			// 	"baseUrl" : "{0}/compute",		//for running with runtime
			// 	"params" : [ "moduleName" ]
			// },
			"DOCUMENT_COMPUTE_V3" : {
				"baseUrl" : "{0}/operations/compute?product={1}&transaction_type={2}",
				"params" : [ "moduleName", "productName", "transactionType" ]
			},
			/*"REFRESH" : {
				"baseUrl" : "{0}/refresh",		//for running with runtime
				"params" : [ "moduleName" ]
			},*/
			"REFRESH" : {
				"baseUrl" : "{0}/operations/refresh?product={1}&transaction_type={2}",
				"params" : [ "moduleName", "product", "transactionType" ]
			},
			
			// "REFRESH_PRODUCT" : {
			// 	"baseUrl" : "{0}/operations/refresh?product={1}",		//for running with runtime
			// 	"params" : [ "moduleName", "product" ]
			// },
			
			/*"DOCUMENT_ADD_WITH_UID" : {
				"baseUrl" : "{0}/add/{1}",
				"params" : [ "moduleName", "documentUid" ]
			},		
			"SERVICE_FIND_DOCUMENTLIST_V3":{ 
				"baseUrl" : "service/{0}/{1}",
				"params" : ["serviceName","uid"]
			},
			"SERVICE_FIND_DOCUMENTLIST_V3_DOCTYPE":{ 
				"baseUrl" : "service/{0}/{1}/{2}",
				"params" : ["serviceName","doctype","uid"]
			},
			"SERVICE_FIND_DOCUMENTLIST_CURRENT_USER_V3":{ 
				"baseUrl" : "service/{0}",
				"params" : ["serviceName"]
			},
			"LIFE_PAYMENTDUE_CURRENT_CLIENT_V3":{
				"baseUrl" : "life/paymentdue/client",
				"params" : []
			},
			"LIFE_RENEWAL_CURRENT_AGENT_V3":{
				"baseUrl" : "life/renewal/agent?reviewDate={0}&range={1}&agentId=",
				"params" : ["reviewDate","range"]
			},
			"LIFE_RENEWAL_CURRENT_CLIENT_V3":{
				"baseUrl" : "life/renewal/client?reviewDate={0}&range={1}&clientId=",
				"params" : ["reviewDate","range"]
			},*/
			"PNC_PAYMENTDUE_CURRENT_AGENT_V3":{
				"baseUrl" : "integral/paymentdues?checkDate={0}&checkRange={1}&agentId=",	
				"params" : ["checkDate", "range"]
			},
			"PNC_PAYMENTDUE_CURRENT_CLIENT_V3":{
				"baseUrl" : "integral/paymentdues?checkDate={0}&checkRange={1}&clientId=",	
				"params" : ["checkDate", "range"]
			},
			"PNC_RENEWAL_CURRENT_AGENT_V3":{
				"baseUrl" : "integral/renewals?date={0}&range={1}&product={2}&agentId=",
				"params" : ["reviewDate","range"]
			},
			"PNC_RENEWAL_CURRENT_CLIENT_V3":{
				"baseUrl" : "integral/renewals?date={0}&range={1}&product={2}&clientId=",
				"params" : ["reviewDate","range"]
			},
			/*"DOCUMENT_COMPUTE" : {
				"baseUrl" : "{0}/compute/Inputs",
				"params" : [ "moduleName"]
			},
			"DOCUMENT_COMPUTE_TAGS" : {
				"baseUrl" : "{0}/compute/{1}",
				"params" : [ "moduleName", "tagArray"]
			},
			"DOCUMENT_ARCHIVE" : {
				"baseUrl" : "{0}/archive/{1}",
				"params" : [ "moduleName", "documentUid" ]
			},*/
			"DOCUMENT_ARCHIVE_V3" : {
				"baseUrl" : "documents/{0}/operations/listarchive/execute",
				"params" : [ "uid" ]
			},
			
			//In this case we generate Application from Exist quotation's DocID
			"GENERATE_DOCUMENT_FROM_EXIST_DOCUMENT_V3" : {
				"baseUrl" : "documents/{0}/operations/generate?doctype={1}&product={2}",
				"params" : [ "docid", "moduleName", "product"]
			},
			
			/*"SIGN_PDF_DOCUMENT" : {
				"baseUrl" : "{0}/esignature/{1}/{2}/{3}/{4}",
				"params" : ["moduleName", "docUid", "pdfID", "runOnTablet", "isSafari"]
			},
			"PREVIEW_PDF_DOCUMENT" : {
				"baseUrl" : "{0}/esignature/preview/{1}/{2}",
				"params" : ["moduleName", "salecaseUid", "pdfID"]
			},
			"DOCUMENT_GENERATE_AFTER_SUBMITTING" : {
				"baseUrl" : "{0}/viewPdf/{1}/{2}/default",
				"params" : ["moduleName","salecaseUid", "docUid"]
			},
			"DOCUMENT_BY_PROSPECT_UID" : {
				"baseUrl" : "{0}/findByProspectUid/{1}",
				"params" : [ "moduleName", "documentUid" ]
			},
			"DOCUMENT_BY_PROSPECT_SALECASE" : {
				"baseUrl" : "{0}/findByProspectAndSalecase/{1}/{2}",
				"params" : [ "moduleName", "prospectUid", "salecaseUid" ]
			},
			"DOCUMENT_UPDATE_PARENT_UID" : {
				"baseUrl" : "{0}/parent/update/{1}/parentUid/{2}",
				"params" : [ "moduleName", "uid", "parentUid" ]
			},
			"MODULE_LAZY_CHOICELIST" : {
				"baseUrl" : "{0}/computeLazyrestriction",
				"params" : [ "moduleName" ]
			},
			"MODULE_LAZY_CHOICELIST_V3" : {
				"baseUrl" : "{0}/computeLazy",
				"params" : [ "moduleName" ]
			},*/
			"MODULE_LAZY_CHOICELIST_V3" : { //apply new API Url
				"baseUrl" : "{0}/restrictions?product={1}&transaction_type={2}",
				"params" : [ "moduleName", "productName", "transactionType" ]
			},
			// "MODULE_PRODUCT_LAZY_CHOICELIST_V3" : { //apply new API Url
			// 	"baseUrl" : "{0}/restrictions?product={1}",
			// 	"params" : [ "moduleName", "productName"]
			// },
			/*"CLIENT_PROSPECT_LINK" : {
				"baseUrl" : "client/link/{0}",
				"params" : [ "prospectUid" ]
			},
			"CLIENT_PROSPECT_UNLINK" : {
				"baseUrl" : "prospect/unlink/{0}",
				"params" : [ "prospectUid" ]
			},
			"CLIENT_EDIT_SUBORDINATE" : {
				"baseUrl" : "{0}/edit/{1}/subordinate/{2}",
				"params" : [ "moduleName", "documentUid","subordinateUid" ]
			},
			"CLIENT_POLICY_HISTORY" : {
				"baseUrl" : "client/policy/list/{0}",
				"params" : [ "clientUid" ]
			},
			"CLIENT_POLICY_HISTORY_SUBORDINATE" : {
				"baseUrl" : "client/policy/list/{0}/subordinate/{1}",
				"params" : [ "clientUid","subordinateUid" ]
			},
			"CLIENT_POLICY_DETAIL" : {
				"baseUrl" : "client/policy/detail/{0}",
				"params" : [ "policyNum" ]
			},
			"CLIENT_POLICY_DETAIL_SUBORDINATE" : {
				"baseUrl" : "client/policy/detail/{0}/subordinate/{1}",
				"params" : [ "policyNum","subordinateUid" ]
			},
			"CLIENT_PROSPECT_UPDATELINK" : {
				"baseUrl" : "client/updatelink/{0}/{1}",
				"params" : [ "prospectUid","clientUid" ]
			},
			"ILLUSTRATION_LIST_PERSON" : {
				"baseUrl" : "illustration/list/person/{0}",
				"params" : [ "prospectId" ]
			},
			"FACTFIND_LIST_PERSON" : {
				"baseUrl" : "factfind/list/person/{0}",
				"params" : [ "prospectId" ]
			},
			"PAYMENT_LIST_PERSON" : {
				"baseUrl" : "payment/list/person/{0}",
				"params" : [ "prospectId" ]
			},
			"APPLICATION_LIST_PERSON" : {
				"baseUrl" : "application/list/person/{0}",
				"params" : [ "prospectId" ]
			},
			"ILLUSTRATION_COMPUTE" : "illustration/compute/Inputs",
			"ILLUSTRATION_ISSUE" : "illustration/compute/Inputs",
			"ILLUSTRATION_CLONE" : "illustration/clone",
			"ILLUSTRATION_COMPUTE_TAGS" : {
				"baseUrl" : "illustration/compute/{0}",
				"params" : [ "tags" ]
			},
			"ILLUSTRATION_COMPUTE_DEFAULT_TAGS" : {
				"baseUrl" : "illustration/computeDefault/{0}",
				"params" : [ "tags" ]
			},	
			"ILLUSTRATION_GENERATE" : {
				"baseUrl" : "{0}/generate",
				"params" : [ "moduleName" ]
			},	
			"QUESTIONNAIRE_COMPUTE_DEFAULT_TAGS" : {
				"baseUrl" : "questionnaires/computeDefault/{0}",
				"params" : [ "tags" ]
			},	
			"ADD_MODEL_WITH_PROSPECTIDS" : {
				"baseUrl" : "{0}/addModelWithProspectIds/{1}/{2}/{3}",
				"params" : [ "moduleName", "uid", "prospectType",
						"personUid" ]
			},
			"PRODUCT_DETAIL" : {
				"baseUrl" : "product/packageBundle/{0}",
				"params" : [ "productUid" ]
			},
			"PRODUCT_LIST" : "illustration/listPackageBundle",
			"PRODUCT_LIST_V3" : "illustration/listProduct",
			
			"METADATA_LIST" : {
				"baseUrl" : "{0}/list",
				"params" : [ "moduleName" ]
			},
			"METADATA_LIST_HOME_ATTENTION" : {
				"baseUrl" : "home/list/attention",
				"params" : []
			},
			"METADATA_LIST_HOME_RECENT" : {
				"baseUrl" : "home/list/recent",
				"params" : []
			},
			"METADATA_LIST_HOME_STARRED" : {
				"baseUrl" : "home/list/starred",
				"params" : []
			},
			"METADATA_LIST_HOME_PAYMENT" : {
				"baseUrl" : "home/list/payment",
				"params" : []
			},
			"METADATA_LIST_SUBORDINATE" : {
				"baseUrl" : "{0}/list/subordinate/{1}",
				"params" : [ "moduleName", "subordinateUid" ]
			},
			"METADATA_LIST_HOME_ATTENTION_SUBORDINATE" : {
				"baseUrl" : "home/list/attention/subordinate/{0}",
				"params" : [ "subordinateUid" ]
			},
			"METADATA_LIST_HOME_RECENT_SUBORDINATE" : {
				"baseUrl" : "home/list/recent/subordinate/{0}",
				"params" : [ "subordinateUid" ]
			},
			"METADATA_LIST_HOME_STARRED_SUBORDINATE" : {
				"baseUrl" : "home/list/starred/subordinate/{0}",
				"params" : [ "subordinateUid" ]
			},
			"METADATA_LIST_HOME_PAYMENT_SUBORDINATE" : {
				"baseUrl" : "home/list/payment/subordinate/{0}",
				"params" : [ "subordinateUid" ]
			},
			"SUBORDINATE_LIST" : {
				"baseUrl" : "subordinate/list",
				"params" : []
			},
			"PACKAGEBUNDLE_LIST" : {
				"baseUrl" : "{0}/listPackageBundle",
				"params" : [ "moduleName" ]
			},
			"LAST_UPDATED_ITEMS" : {
				"baseUrl": "{0}/list/lastupdated",
				"params" : ["moduleName"]
			},
			"SUBORDINATES_LIST" : {
				"baseUrl" : "{0}/subordinates/list",
				"params" : [ "moduleName" ]
			},
			"PROSPECT_CHANGE" : {
				"baseUrl" : "{0}/refType/{1}/update/{2}/{3}",
				"params" : [ "moduleName", "prospectType", "oldPersonUid",
						"newPersonUid" ]
			},
			"INDIVIDUAL_METADATA" : {
				"baseUrl" : "{0}/metadata/{1}",
				"params" : [ "module", "uid" ]
			},
			"SALECASE_CLONE" : {
				"baseUrl" : "{0}/clonebyId/{0}",
				"params" : [ "module","uid" ]
			},
			"SALECASE_SUBMIT" : {
				"baseUrl" : "salecase/submit/{0}",
				"params" : ["uid"]
			},
			"SALECASE_RESUBMIT" : {
				"baseUrl" : "salecase/reSubmit/{0}",
				"params" : ["uid"]
			},
			"SALECASE_GET_DOCUMENTCENTER_STATUS" : {
				"baseUrl" : "salecase/{0}/documentcenter/status",
				"params" : ["salecaseUid"]
			},			
			"SALECASE_GET_DOCUMENTCENTER_PDF_GENERATE_STATUS" : {
				"baseUrl" : "salecase/{0}/documentcenter/pdfGenerate/status",
				"params" : ["salecaseUid"]
			},
			"SALECASE_GET_DOCUMENTS_TO_SIGN" : {
				"baseUrl" : "salecase/{0}/document/{1}/esign/{2}",
				"params" : ["salecaseUid", "documentUid", "eSignUid"]
			},		
			"SALECASE_GET_FNA_TO_SIGN" : {
				"baseUrl" : "salecase/{0}/esign",
				"params" : ["salecaseUid"]
			},
			"OWNER_EMAIL" : {
				"baseUrl" : "{0}/owner/{1}/email",
				"params" : [ "moduleName", "policyOwnerUid" ]
			},
			"PAYMENT_SEND_EMAIL" : {
				"baseUrl" : "payment/email/{0}",
				"params" : [ "uid" ]
			},
			"PAYMENT_CLEAN_TOKENS" : {
				"baseUrl" : "payment/detail/{0}/edit",
				"params" : [ "uid" ]
			},
			"USER_EDIT_CURRENT" : {
				"baseUrl" : "user/edit/current",
				"params" : []
			},
			"USER_FIND_BY_AGENT_CODE" : {
				"baseUrl" : "user/findUserByAgentCode/{0}",
				"params" : [ "agentCode" ]
			},
			"MRR_SUBMIT" : {
				"baseUrl" : "managerreview/submitreview/{0}",
				"params" : ["status"]
			},
			"SALES_GENERATE_FAILED_PDFS" : {
				"baseUrl" : "salecase/regenpdf/{0}",
				"params" : ["salecaseUid"]
			},
			"REVIEWER_METADATA_LIST" : {
				"baseUrl" : "{0}/manager/list/{1}",
				"params" : [ "moduleName", "userid"]
			},
			"REVIEWER_LIST_UPDATE" : {
				"baseUrl" : "{0}/reviewer/update/{1}",
				"params" : [ "moduleName", "salecaseUid"]
			},
			"USER_METADATA" : {
				"baseUrl" : "{0}/user/metadata/{1}",
				"params" : [ "moduleName", "userid"]
			},
			"USER_PASSWORD" : {
				"baseUrl" : "user/{0}/password",
				"params" : [ "action"]
			},
			"USER_ROLE" : {
				"baseUrl":"user/hasRole/{0}",
				"params" : ["role"]
			},
			"SALECASE_VALIDATE_APPLICATIONS" : {
				"baseUrl" : "salecase/validate/applications/{0}",
				"params" : [ "salecaseUid" ]
			},
			"SUBMIT_ACTION" : {
				"baseUrl" : "action/{0}",
				"params" : [ "action" ]
			},
			"SUBMISSION_LIST" : {
				"baseUrl" : "submission/list/{0}",
				"params" : [ "status" ]
			},
			"NOTIFICATION_COUNT_UNREAD" : {
				"baseUrl" : "notification/countUnread",
				"params" : []
			},
			"NOTIFICATION_DELETE_ITEM" : {
				"baseUrl" : "delNotification",
				"params" : []
			},
			"NOTIFICATION_DELETE_ALL" : {
				"baseUrl" : "delAllNotification",
				"params" : []
			},
			"NOTIFICATION_BY_INDEX" : {
				"baseUrl" : "notification/list/{0}/{1}",
				"params" : ["startIndex","numofRecord"]
			},
			"NOTIFICATION_UPDATE_STATUS" : {
				"baseUrl" : "updateNotificationStatus/{0}",
				"params" : ["notificationUid]"]
			},
			"PROSPECT_SIGN_PDPA" : {
				"baseUrl" : "prospect/esign/pdpa/{0}/{1}/{2}",
				"params" : ["prospectUid", "runOnTablet", "isSafari"]
			},
			"DOCUMENT_UPLOAD_INTO_DATABASE" : {
				"baseUrl" : "{0}/resource/files/upload",
				"params" : [ "moduleName" ]
			},	
			"DOCUMENT_DOWNLOAD_INTO_DATABASE" : {
				"baseUrl" : "{0}/resource/file/read/{1}",
				"params" : [ "moduleName", "documentUid" ]
			},	
			"DOCUMENT_UPLOAD_WITH_SPECIFIC_FOLDER" : {
				"baseUrl" : "{0}/resource/files/upload/{1}",
				"params" : [ "moduleName", "salecaseUid" ]
			},	
			"DOCUMENT_DOWNLOAD_FROM_SPECIFIC_FOLDER" : {
				"baseUrl" : "{0}/resource/file/read/{1}/{2}",
				"params" : [ "moduleName", "documentUid", "salecaseUid" ]
			},
			"CLIENT_STAR" : {
				"baseUrl" : "client/star/{0}",
				"params" : [ "uid" ]
			},
			"CLIENT_UNSTAR" : {
				"baseUrl" : "client/unstar/{0}",
				"params" : [ "uid" ]
			},
			"CLIENT_LISTSTARRED" : {
				"baseUrl" : "client/starredlist",
				"params" : []
			},
			"PORTLET_CONFIGURATION_FIND" : {
				"baseUrl" : "{0}/{1}/find/{2}/{3}/{4}",
				"params" : [ "module", "portlet", "portletId", "userId", "userType" ]
			},
			"PORTLET_CONFIGURATION_UPDATE" : {
				"baseUrl" : "{0}/update/portlet",
				"params" : [ "module" ]
			},
			"CLIENT_LIST" : {//portal/client/list/myclients/10201
				"baseUrl" : "{0}/client/list/{1}/{2}",	//{module}/client/list/{portletUid}/{userId}
				"params" : [ "module", "portletUid", "userId" ]
			},"CLIENT_LIST_V3" : {//portal/client/list/myclients/10201
				"baseUrl" : "service/getclientlist",
				"params" : [ ]
			},
			"CLIENT_LIST_BY_CURRENT_AGENT_V3" : {//portal/client/list/myclients/10201
				"baseUrl" : "service/getclientbyagentid",
				"params" : [ ]
			},
			"CLIENT_DETAIL_V3" : {
				"baseUrl" : "service/getclientdetail/{0}",
				"params" : [ "clientNum" ]
			},
			"DOCUMENT_LIST" : {
				"baseUrl" : "search/test",	
				"params" : [ ]
			},
			"VALID_DOCUMENTS" : { //{doctype}/findValidDocuments/{status}/{duration}/{notifyDay}
				"baseUrl" : "{0}/findValidDocuments/{1}/{2}/{3}",	
				"params" : [ "moduleName", "status", "duration",  "notifyDay" ]
			},*/
			"VALID_DOCUMENTS" : { //{doctype}/status/valid/{businessStatus}/{duration}/{notifyDay}
				"baseUrl" : "{0}/status/valid/{1}/{2}/{3}",		//apply new API Url
				"params" : [ "moduleName", "status", "duration","notifyDay"]
			},

			"REFRESH_TAG" :{ //{doctype}/operations/refresh/partial?product={product}&tagName={tagName}&transaction_type={transactionType} 
                "baseUrl" : "{0}/operations/refresh/partial?product={1}&tagName={2}&transaction_type={3}",
                "params" : ["doctype", "product", "tagNames", "transactionType"]
            },
            
			"COMPUTE_BY_TAG_NAME" :{ //{doctype}/tags/{tagName}/operations/compute?product
				"baseUrl" : "{0}/tags/{1}/operations/compute?product={2}&transaction_type={3}",
				"params" : ["doctype", "tagNames", "product", "transactionType"]
			},
			
			"COMPUTE_BY_FUNCTION_NAME" :{
				"baseUrl" : "{0}/operations/computefunction?product={1}&functionName={2}",
				"params" : ["doctype", "product", "functionName"]
			},
			
			// "COMPUTE_BY_TAG_NAME_WITH_PRODUCT" :{ //{doctype}/tags/{tagName}/operations/compute?product
			// 	"baseUrl" : "/{0}/tags/{1}/operations/compute?product={2}",
			// 	"params" : ["doctype", "tagNames", "product"]
			// },

			// "COMPUTE_BY_TAG_NAME_WITHOUT_PRODUCT" :{ //{doctype}/tags/{tagName}/operations/compute?product
			// 	"baseUrl" : "/{0}/tags/{1}/operations/compute",
			// 	"params" : ["doctype", "tagNames"]
			// },
			
			/***********************V3 - Runtime***************************/
			/*******************ILLUSTRATION _ QUOTATION*******************/
			// "MODULE_CREATE" : {	//for create illustration/quotation
			// 	"baseUrl" : "{0};product={1}/create",
			// 	"params" : [ "moduleName","productName" ]
			// },
			// "MODULE_CREATE" : {	//for create illustration/quotation, apply new API Url
			// 	"baseUrl" : "{0}/form?product={1}",
			// 	"params" : [ "moduleName","productName" ]
			// },
			// "MODULE_CREATE_CASE" : {	//for create case-management
			// 	"baseUrl" : "{0}/form/{1}?product={2}",
			// 	"params" : [ "moduleName","caseName","productName" ]
			// },
			/*"MODULE_IMPORT" : {	//for import illustration/quotation
				"baseUrl" : "{0};product={1}/refType/Owner/update/{3}",
				"params" : [ "moduleName","productName","uid" ]
			},
			"MODULE_UPDATE_REFUID_PROSPECT" : {	//for update ref uid of prospect in illustration/quotation
				"baseUrl" : "{0};product={1}/refUid/{2}/update/{3}",
				"params" : [ "moduleName","productName","uidOld","uidNew" ]
			},
			"MODULE_FIND_DOCUMENT" : {	//for find Document of illustration/quotation
				"baseUrl" : "findDocument/{0}",
				"params" : [ "uid" ]
			},*/
			"MODULE_FIND_DOCUMENT" : {	//for find Document of illustration/quotation
				"baseUrl" : "documents/{0}",
				"params" : [ "docId" ]
			},
			"MODULE_USERLIST_V3" : {	
				"baseUrl" : "users?customerName={0}",
				"params" : [ "customerName" ]
			},
			"USER_ACTION": {	// can use with GET/PUT/POST method
				"baseUrl": "users/{0}",
				"params": ["userName"]
			},
			
			/*"MODULE_LIST" : {	//for list illustration/quotation
				"baseUrl" : "{0}/list",
				"params" : [ "moduleName"]
			},
			"MODULE_COMPUTELAZY" : {	//for ComputeLazy in illustration/quotation
				"baseUrl" : "{0};product={1}/computeLazy",
				"params" : [ "moduleName","productName" ]
			},*/
			// "MODULE_COMPUTELAZYMODULE_COMPUTELAZY" : {	//for ComputeLazy in illustration/quotation,  apply new API Url
			// 	"baseUrl" : "{0}/restrictions?product={1}",
			// 	"params" : [ "moduleName","productName" ]
			// },
			/*SEARCG*/
			/*"MODULE_CREATE" : {	//for create illustration/quotation
				"baseUrl" : "{0};product={1}/refUid/b029a5bd-4e14-489a-8292-b9c1cd33a3fd/update/{3}",
				"params" : [ "moduleName","productName" ]
			},*/
			// "MODULE_COMPUTE" : {//for compute in illustration/quotation
			// 	"baseUrl" : "{0};product={1}/compute",
			// 	"params" : [ "moduleName","productName" ]
			// },
			// "MODULE_COMPUTE" : {//for compute in illustration/quotation, apply new API Url
			// 	"baseUrl" : "{0}/operations/compute?product={1}",
			// 	"params" : [ "moduleName","productName" ]
			// },
			// "MODULE_COMPUTE_V3" : {//for compute document with no product, apply new API Url
			// 	"baseUrl" : "{0}/operations/compute",
			// 	"params" : [ "moduleName"]
			// },
			"POLICY_COMPUTE_V3" :{
				"baseUrl" : "integral/policies/operations/compute",
				"params" : []
			},
			// "MODULE_SAVE" : {//for save in illustration/quotation
			// 	"baseUrl" : "{0};product={1}/save",
			// 	"params" : [ "moduleName","productName" ]
			// },
			// "MODULE_SAVE" : {//for save in illustration/quotation
			// 	"baseUrl" : "{0}/incomplete?product={1}",
			// 	"params" : [ "moduleName","productName" ]
			// },
			// "MODULE_VALIDATE_AND_SAVE" : {//for validate and save in illustration/quotation
			// 	"baseUrl" : "{0};product={1}/validate/save",
			// 	"params" : [ "moduleName","productName" ]
			// },
			// "MODULE_VALIDATE_AND_SAVE" : {//for validate and save in illustration/quotation
			// 	"baseUrl" : "{0}/complete?product={1}",
			// 	"params" : [ "moduleName","productName" ]
			// },
			/*"MODULE_EDIT" : {	//for edit in illustration/quotation
				"baseUrl" : "{0};product={1}/edit/{2}",
				"params" : [ "moduleName","productName","uid" ]
			},*/
			/*"MODULE_UPDATE" : {	//for update in illustration/quotation
				"baseUrl" : "{0};product={1}/update/{2}",
				"params" : [ "moduleName","productName","uid" ]
			},*/
			// "MODULE_UPDATE" : {	//for update in illustration/quotation
			// 	"baseUrl" : "{0}/{1}/operations/update?product={2}",
			// 	"params" : [ "moduleName","uid","productName" ]
			// },
			/*"MODULE_VALIDATE_AND_UPDATE" : {//for validate and update in illustration/quotation
				"baseUrl" : "{0};product={1}/validate/update/{2}",
				"params" : [ "moduleName","productName","uid" ]
			},*/
			// "MODULE_VALIDATE_AND_UPDATE" : {//for validate and update in illustration/quotation
			// 	"baseUrl" : "{0}/{1}/operations/validate/update?product={2}",
			// 	"params" : [ "moduleName","uid","productName"]
			// },
			/*"MODULE_LISTPRODUCT" : {//for listProduct in illustration/quotation
				"baseUrl" : "{0}/listProduct",
				"params" : [ "moduleName"]
			},*/
			"MODULE_LISTPRODUCT" : {//for listProduct in illustration/quotation
				"baseUrl" : "{0}/products",
				"params" : [ "moduleName"]
			},
			
			/*"MODULE_PRINTPDF" : {	//for print PDF function
				"baseUrl": "{0};product={1}/printPdf/{2}",
				"params" : ["moduleName","productName","templateId"]
			},*/
			"MODULE_PRINTPDF" : {	//for print PDF function
				"baseUrl": "{0}/pdf/{1}/operations/print?product={2}",
				"params" : ["moduleName","templateId","productName"]
			},
			"MODULE_PRINTPDF_V3_1" : {	//for new print PDF function
				"baseUrl": "{0}/{1}/pdf/{2}/operations/print?product={3}&transaction_type={4}",
				"params" : ["moduleName","docId","templateId","productName","transactionType"]
			},
			"MODULE_PRINTPDF_V3_1_PO" : {	//for new print PDF function for Policy
				"baseUrl": "{0}/{1}/operations/printPdf?product={2}&transaction_type={3}",
				"params" : ["moduleName","templateId","productName","transactionType"]
			},
			/*"MODULE_PRINTPDF_WITH_BT_V3_1" : {	//for new print PDF function
				"baseUrl": "{0}/{1}/pdf/{2}/operations/print?product={3}&transaction_type={4}",
				"params" : ["moduleName","docId","templateId","productName", "transactiontype"]
			},*/
			"MODULE_ADMIN_CONFIGURATION" : {	//for admin Configuration (Prospect)
				"baseUrl": "/admin/doctypedefinition/{0}",
				"params" : ["moduleName"]
			},
			//old admin config
			// "MODULE_PRODUCT_ADMIN_CONFIGURATION" : {	//for admin Configuration (illustration/quotation and application)
			// 	"baseUrl": "{0};product={1}/definition",
			// 	"params" : ["moduleName","productName"]
			// },
			//new admin config to get doc definition
			"MODULE_PRODUCT_ADMIN_CONFIGURATION" : {	//for admin Configuration (illustration/quotation and application)
				"baseUrl": "admin/doctypedefinition/{0}?product={1}",
				"params" : ["moduleName","productName"]
			},
			/*"CLAIM_DETAIL_V3" : {
				"baseUrl" : "service/claimDetail/{0}",
				"params" : [ "claimNum" ]
			},*/
			/*"CLAIM_LIST_AGENT_V3" : {
				"baseUrl" : "service/claimListOfAnAgent/{0}",
				"params" : [ "agentID" ]
			},
			"CLAIM_LIST_CURRENT_AGENT_V3" : {
				"baseUrl" : "service/claimListOfAnAgent",
				"params" : []
			},*/
			/*"CLAIM_LIST_CLIENT_V3" : {
				"baseUrl" : "service/claimListofClient/{0}",
				"params" : [ "clientID" ]
			},
			"CLAIM_LIST_CURRENT_CLIENT_V3" : {
				"baseUrl" : "service/claimListofClient",
				"params" : []
			},*/
			
			/*"FIND_RESOURCE_BY_LIST_UID":{
				"baseUrl":"findResourceByListUid/{0}",
				"params":["listResourceUid"]
			},*/
			"FIND_RESOURCE_BY_LIST_UID":{		//apply new API Url
				"baseUrl":"resourcefiles/{0}",
				"params":["listResourceUid"]
			},
			/*"SUBMIT_CLAIM_NOTIFICATION":{	//for submit claim notification
				"baseUrl":"service/submitClaimNotification/{0}",
				"params":[ "product" ]
			},*/
			/*"SUBMIT_CLAIM_NOTIFICATION_BY_DOCID":{	//for submit claim notification with docId
				"baseUrl":"service/submitClaimNotification/{0}/{1}",
				"params":[ "product", "docId" ]
			},*/
			/*"GET_POLICY_DOC_WITH_ACTION":{	//for get case-management doc with action Endorsement or Renewal
				"baseUrl":"service/policy/{0}/{1}",
				"params":[ "action", "policyNum" ]
			},*/
			/*"GET_LIST_PDF_TEMPLATE":{	//for list pdf template 
				"baseUrl":"{0};product={1}/getListTemplate",
				"params":[ "moduleName", "productName" ]
			},*/
			"GET_LIST_PDF_TEMPLATE":{	//for list pdf template 
				"baseUrl":"{0}/templates?product={1}&action={2}",	//apply new API Url
				"params":[ "moduleName", "productName", "action" ]
			},
			"GET_LIST_PDF_TEMPLATE_NO_PRODUCT":{	//for list pdf template without product
				"baseUrl":"{0}/templates?action={2}",	//apply new API Url
				"params":[ "moduleName", "action" ]
			},
			// "GET_RESOURCE_BY_CASEID":{	//for list pdf template 
			// 	"baseUrl":"getListMetadataResourceFileByCaseID/{0}",
			// 	"params":[ "caseId" ]
			// },
			"GET_RESOURCE_BY_CASEID":{	//for list pdf template 
				"baseUrl":"resourcefiles/metadatas/casemanagement/{0}",	//apply new API Url
				"params":[ "caseId" ]
			},
			"PRESUBMISSION_CASEMANAMENT":{
				"baseUrl":"presubmission/{0}/operations/{1}?product={2}",
				"params":["caseId,caseName,product"]
			},
			"SUBMISSION_JPJ":{
				"baseUrl":"submission/{0}/operations/JPJ?product={1}",
				"params":["eCoverNoteUid", "product"]
			},
			/*"GET_RECEIPT_LIST":{
				"baseUrl": "service/getReceiptList/{0}",
				"params":["policyNum"]
			},*/
			/*"GET_RECEIPT_DETAIL":{
				"baseUrl": "service/getReceiptDetail/{0}/{1}",
				"params":["bankCode", "receiptNum"]
			},*/
			
			/***********************Buil url direct sale*******************/
			"BUILD_URL_SEND_EMAIL_DS":{ 
				"baseUrl" : "sendEmail?email={0}&product={1}&createDate={2}&expiredDate={3}&zone={4}",
				"params" : ["emailAddress", "product","createDate","expiredDate","zone"]
			},
			
			/***********************V3 - Gateway***************************/
			
			"SERVICE_FIND_DOCUMENTLIST_AGENT_V3":{ 
				"baseUrl" : "integral/{0}?agentId={1}",
				"params" : ["serviceName", "uid"]
			},
			"SERVICE_FIND_DOCUMENTLIST_CLIENT_V3":{ 
				"baseUrl" : "integral/{0}?clientId={1}",
				"params" : ["serviceName", "uid"]
			},
			"SERVICE_FIND_DOCUMENTLIST_CURRENT_AGENT_V3":{ 
				"baseUrl" : "integral/{0}?agentId=",
				"params" : ["serviceName"]
			},
			
			"SERVICE_FIND_POLICY_BY_AGENT_CLIENT_V3":{ 
				"baseUrl" : "integral/policiesByAgentClientID?agentId=&clientId={0}",
				"params" : ["clientId"]
			},
			
			"SERVICE_FIND_DOCUMENTLIST_CURRENT_CLIENT_V3":{ 
				"baseUrl" : "integral/{0}?clientId=",
				"params" : ["serviceName"]
			},
			"SERVICE_FIND_DOCUMENTLIST_MNCLIFE_CLIENT_V3":{ 
				"baseUrl" : "integral/{0}/information?birthDate={1}&clientName={2}&gender={3}&riskGroup={4}",
				"params" : ["serviceName","birthDate","clientName","gender","riskGroup"]
			},
			
			"SERVICE_FIND_CLAIM_HISTORY_LIST_V3":{ 
				"baseUrl" : "integral/claims?agentId=&clientId=&policyNum={0}",
				"params" : ["policyNumber"]
			},
			/*---------Description:
			 * This endpoint is to save a file to drive 
			 * then return a json of that file's resource document
			 *----------------------- */
			/*"RESOURCE_CREATE":{
				"baseUrl" : "resoucefiles",
				"params" : []
			},*/
			/*---------Description:
			 * This endpoint is to return a collection of metadata 
			 * of resource-files contained in the input case-id
			 *----------------------- */
			/*"RESOUCES_IN_SALECASE":{
				"baseUrl" : "resourcefiles/metadatas/casemanagement/{0}",
				"params" : ["caseId"]
			},*/
			"DOCUMENT_EDIT" : {
				"baseUrl" : "{0}s/{1}/operations/edit?product={2}&transaction_type={3}",
				"params" : [ "docType", "docUid", "productName", "transaction_type" ]
			},
			// "MODULE_EDIT" : {	//for edit in illustration/quotation
			// 	"baseUrl" : "{0}s/{1}/operations/edit?product={2}",
			// 	"params" : [ "moduleName","uid","productName" ]
			// },
			"GET_RECEIPT_DETAIL":{
				"baseUrl": "integral/receipts/{0}?bankCode={1}",
				"params":["receiptNum","bankCode"]
			},
			"CLIENT_DETAIL_V3" : {
				"baseUrl" : "integral/clients/{0}",
				"params" : [ "clientNum" ]
			},
			"CLIENT_LIST_V3" : {
				"baseUrl" : "integral/clients",
				"params" : []
			},
			"CLAIM_DETAIL_V3" : {
				"baseUrl" : "integral/claims/{0}",
				"params" : [ "claimNum" ]
			},
			"DEATH_CLAIM_DETAIL_V3" : {
				"baseUrl" : "integral/deathclaims/{0}",
				"params" : [ "deathClaimNum" ]
			},
			"AGENT_DETAIL_V3" : {
				"baseUrl" : "integral/agents/{0}?lob={1}",
				"params" : [ "agentNum", "lineOfBusiness" ]
			},
			"SUBMIT_CLAIM_NOTIFICATION":{	//for submit claim notification
				"baseUrl":"integral/claimNotification/{0}/operations/submit",
				"params":[ "product" ]
			},
			"SUBMIT_CLAIM_NOTIFICATION_BY_DOCID":{	//for submit claim notification with docId
				"baseUrl":"integral/claimNotification/{0}/{1}/operations/submit",
				"params":[ "product","docId" ]
			},
			"SUBMIT_DEATH_CLAIM_REGISTRATION":{	//for submit death claim registration no param
				"baseUrl":"integral/death-claim-registration/operations/submit"					
			},
			"SUBMIT_DEATH_CLAIM_REGISTRATION_BY_DOCID":{	//for submit death claim registration with docId
				"baseUrl":"integral/death-claim-registration/{0}/operations/submit",
				"params":["docId" ]
			},
			/*"CLAIM_LIST_AGENT_V3" : {
				"baseUrl" : "integral/claims?agentId={0}",
				"params" : [ "agentID" ]
			},
			"CLAIM_LIST_CURRENT_AGENT_V3" : {
				"baseUrl" : "integral/claims?agentId=",
				"params" : []
			},*/
			"GET_RECEIPT_LIST":{
				"baseUrl": "integral/receipts?policyNum={0}",
				"params":["policyNum"]
			},
			/*"CLAIM_LIST_CLIENT_V3" : {
				"baseUrl" : "integral/claims?clientId={0}",
				"params" : [ "clientID" ]
			},
			"CLAIM_LIST_CURRENT_CLIENT_V3" : {
				"baseUrl" : "integral/claims?clientId=",
				"params" : []
			},
			"CLIENT_LIST_BY_CURRENT_AGENT_V3" : {//portal/client/list/myclients/10201
				"baseUrl" : "integral/clients?agentId=}",
				"params" : [ ]
			},*/
			"CREATE_PAYMENT_FOR_AGENT_SALE_CASE_NEW_BUSINESS" :{
				"baseUrl" : "/presubmission/{0}/operations/agentNB",
				"params" : ["docId"]
			},
			"CREATE_PAYMENT_FOR_DIRECT_SALE_CASE_NEW_BUSINESS" :{
				"baseUrl" : "/presubmission/{0}/operations/directNB",
				"params" : ["docId"]
			},
			"CREATE_PAYMENT_FOR_DIRECT_SALE_CASE_ENDORSEMENT" :{
				"baseUrl" : "/presubmission/{0}/operations/endorsement?product={1}",
				// "baseUrl" : "/presubmission/{0}/operations/policyEndorsement",
				"params" : ["docId","product"]
			},
			"CREATE_PAYMENT_FOR_DIRECT_SALE_CASE_RENEWAL" :{
				"baseUrl" : "/presubmission/{0}/operations/directRN",
				"params" : ["docId"]
			},
			"CREATE_PAYMENT_FOR_AGENT_SALE_CASE_ENDORSEMENT" :{
				"baseUrl" : "/presubmission/{0}/operations/endorsement",
				"params" : ["docId"]
			},
			"CREATE_PAYMENT_FOR_AGENT_SALE_CASE_RENEWAL" :{
				"baseUrl" : "/presubmission/{0}/operations/agentRN",
				"params" : ["docId"]
			},
			"CREATE_PAYMENT_FOR_CASE_RENEWAL" :{
				"baseUrl" : "/presubmission/{0}/operations/renewal?product={1}",
				"params" : ["docId", "product"]
			},
			"SUBMISSION_POLICY_SERVCING" :{
				"baseUrl" : "/submission/{0}/operations/policyServicing?product={1}&transaction_type={2}&actionType={3}",
				"params" : ["caseId", "productName", "transactionType","actionType"]
			},
			"CREATE_CLIENT_PAYMENT" :{
				"baseUrl" : "/payments/{0}/operations/client-pay",
				"params" : ["docId"]
			},
			"GET_POLICY_DOC_WITH_ACTION":{	//for get case-management doc with action Endorsement or Renewal
				"baseUrl":"integral/policies/{0}/operations/{1}?policyType={2}&effectiveDate={3}&transaction_type={4}&product={5}",
				"params":[ "policyNum", "actionType", "policyType", "effectiveDate", "transaction_type", "product"]
			},
			/*"GET_POLICY_DETAIL":{	//for get case-management doc with action Endorsement or Renewal
				"baseUrl":"integral/policies/{0}",
				"params":[ "policyNum" ]
			},*/
			"GET_POLICY_DETAIL":{	//for get case-management doc with action Endorsement or Renewal
				"baseUrl":"integral/policies/{0}?policyType={1}&effectiveDate={2}",
				"params":[ "policyNum", "policyType" ]
			},
			"GET_POLICY_DETAIL_BASE_ON_PRODUCT":{	//for get case-management doc with action Endorsement or Renewal
				"baseUrl":"integral/policies/{0}/operations/edit?product={1}",
				"params":[ "policyNum", "productName" ]
			},
			"PAID_TRANSACTION":{	//for get case-management doc with action Endorsement or Renewal
				"baseUrl":"agentpayment/{0}/operations/paid",
				"params":[ "docId" ]
			},
			"CREATE_CASE_BASE_ACTION_TYPE_AND_POLICY_NUM":{
				"baseUrl":"casemanagement/{0}/{1}/operation/create?product={2}&policyType={3}&effectiveDate={4}&transaction_type={5}",
				"param":["policyNo","actionType","product","policyType","effectiveDate","transaction_type"]
			},
			"METADATA_SEARCH" :{
				"baseUrl" : "documents/metadatas/operations/search?doctype={0}",
				"params" : ["docType"]
			},
			"METADATA_ADVANCESEARCH" :{
				"baseUrl" : "documents/metadatas/operations/advanceSearch?doctype={0}",
				"params" : ["docType"]
			},
			"CHECK_BLACKLIST": {
				"baseUrl" : "integral/blackList/{0}",
				"params" : ["vehicleNum"]
			},
			"CHECK_ISM": {
				"baseUrl" : "ISM/{0}",
				"params" : ["vehicleNum"]
			},
			
			/******** UNDERWRITING FEATURE ********/
			"GET_UNDERWRITING_PICKUPABLELIST": {
				"baseUrl" : "underwritings/pickupAbleList?product={0}",
				"params" : ["product"]
			},
			"GET_UNDERWRITING_EXPIREDLIST": {
				"baseUrl" : "underwritings/operations/expiredList",
				"params" : []
			},
			"DO_UNDERWRITING": {
				"baseUrl" : "underwritings/{0}/operations/{1}?product={2}",
				"params" : ["docId", "actionType", "product"]
			},
			// "UPDATE_USER": {
			// 	"baseUrl" : "{0}/{1}/operations/validate/update",
			// 	"params" : ["doctype", "docId"]
			// },
			"REGISTER_USER_ROLE": {
				"baseUrl" : "/users/{0}/profiles",
				"params" : ["userName"]
			},
			"UPDATE_USERROLE_INFORMATION": {
				"baseUrl" : "/users/{0}/profiles/{1}",
				"params" : ["userName", "profileId"]
			},
			"SET_MANAGER_DECISION": {
				"baseUrl" : "manager-reviews/{0}/operations/{1}?product={2}",
				"params" : ["docId", "ManagerDecision", "productName"]
			},
			"SET_GROUP_DEPARTMENT_DECISION": {
				"baseUrl" : "group-departments/{0}/operations/{1}?product={2}",
				"params" : ["docId", "GroupDepartmentDecision", "productName"]
			},
			"PICKUP_MANAGER_REVIEW": {
				"baseUrl" : "{0}s/{1}/operations/pickup",
				"params" : ["docType", "docId"]
			},
			"PICKUP_MANAGER_REVIEW_WITH_PRODUCT": {
				"baseUrl" : "{0}s/{1}/operations/pickup?product={2}",
				"params" : ["docType", "docId", "product"]
			},
			"RETURN_PICKEDUP_MANAGER_REVIEW": {
				"baseUrl" : "{0}s/{1}/operations/return",
				"params" : ["docType", "docId"]
			},
			"RETURN_PICKEDUP_MANAGER_REVIEW_WITH_PRODUCT": {
				"baseUrl" : "{0}s/{1}/operations/return?product={2}",
				"params" : ["docType", "docId", "product"]
			},
			"PICKUP_GROUP_MANAGER_DEPARTMENT": {
				"baseUrl" : "{0}s/{1}/operations/pickup?product={2}",
				"params" : ["docType", "docId","ProductCd"]
			},
			"RETURN_PICKUP_GROUP_MANAGER_DEPARTMENT": {
				"baseUrl" : "{0}s/{1}/operations/return?product={2}",
				"params" : ["docType", "docId","ProductCd"]
			},
			"PICKUP_DEATH_CLAIM_REGISTRATION": {
				"baseUrl" : "{0}s/{1}/operations/pickup",
				"params" : ["docType", "docId"]
			},
			"RETURN_PICKUP_DEATH_CLAIM_REGISTRATION": {
				"baseUrl" : "{0}s/{1}/operations/return",
				"params" : ["docType", "docId"]
			},
			"GET_USER_CREDIT_LIMIT": {
				"baseUrl" : "integral/agents/=?/creditLimit?product={0}",
				"params" : ["product"]
			},
			"RESOURCE_UPLOAD": {
				"baseUrl" : "resourcefiles?fileDesc={0}",
				"params" : ["fileName"]
			},
			"RESOURCE_DOWNLOAD": {
				"baseUrl" : "resourcefiles/file/",
				"params" : [""]
			},
			
			

			
			/********** DOCMAP DEFINITIONS **********/
			"DOCUMENT_DOCMAP_DEFINITIONS": {
				"baseUrl": "documents/docmapDefinitions",
				"params": []
			},

			/*Comapanion app*/
			"SYSTEM_CHECK_LOGIN": {
				"baseUrl": "drive/ticket/available",
				"params": []
			},
			
			/********** RESUBMIT BUSINESS CASE **********/
			"RESUBMIT_BUSINESS_CASE": {
				"baseUrl": "casemanagement/{0}/operation/resubmit?product={1}&transaction_type={2}",
				"params": ["docId", "product", "transaction_type"]
			},
			
			/********** UPDATE INSURED IN GROUP TRAVEL **********/
			"UPDATE_DOC_FROM_FILE": {
				"baseUrl": "{0}/{1}/operation/import?product={2}",
				"params": ["docType", "resourceUid","product"]
			},
			"ATTACH_UW_LETTER_FORM": {
				"baseUrl": "casemanagement/{0}/letter/{1}/attach",
				"params": ["caseId", "letterId"]
			},
			"SEND_NOTIFICATION_WITH_EVENT_CODE": {
				"baseUrl": "operations/sendNotificationWithEventCode?caseId={0}&eventCode={1}",
				"params": ["caseId", "eventCode"]
			},
			"UPDATE_DOCUMENT_BY_PARTIAL_DATA_FIELD": {
				"baseUrl": "documents/{0}/operations/partialUpdate",
				"params": ["docId"]
			},
			"UPDATE_SIGNED_STATUS": {
				"baseUrl": "/casemanagement/{0}/resourceFiles/{1}/postSigning?resourceType={2}&product={3}&transaction_type={4}",
				"params": ["caseManagementId", "resourceFiledId", "resourceType", "product", "businessType"]
			},
	};
	
	this.CONSTANTS = {
					  "SALE_CHANNEL":{
						 "AGENT_SALE" : "AS",
					     "DIRECT_SALE": "DS"
					  },
					  "COMPANY_NAME": {
						  "CSC-Insurance" : "",
						  "MNC-General" : "mnc-general",
						  "MNC-Life" : "mnc-life",
						  "CSC-Insurance-company" : "csc-insurance",
						  "DEFAULT" : ""
					  },
					  "COMPANY_ID": {
						  "MNC_GENERAL" : "MNC-General",
						  "MNC-Life" : "MNC-Life"
					  },
					  "DOCTYPE": {
						  "METADATA": "metaData",
						  "PACKAGEBUNDLE": "packageBundle"
					  },
					  "ACTIONTYPE": {
					    "NEWBUSINESS": "new-business",
					    "RENEWAL": "renewal",
					    "ENDORSMENT": "endorsment",
					    "UNDERWRITING_ACTION": {
					      "ACCEPT": "accept",
					      "REJECT": "reject",
					      "COUNTER-OFFER": "counter-offer"
					    }
					  },
					  "CARDTYPE": {
					    "ACTION": "action",
					    "DEFAULT": "default",
					    "TEMPLATE": "template"
					  },
					  "CONFIG_KEY":{
					  	"ROLE": "role_config",
					  	"GLOBAL": "global_config",
					  	"UI": "ui_config"
					  },
					  "PLATFORM":{				
					  	"ANDROID": "android",
					  	"IOS": "iOS",	  	
					  	"WEB": "web",
					  	"WEB_LIFERAY": "web-liferay"
					  },
					  "USER_ROLES":{					  	
						"UW": "Underwriter Role",
						"AGENT": "Agent Role",
						"POLICY_OWNER": "Policy Owner Role",
						"PROSPECT": "Prospect Role",
						"CSO": "Customer Service Officer Role",
						"GUEST": "Guest",
						"MANAGER_REVIEW": "Manager Role",
						"GROUP_DPMT_MNGR":"Group Department Manager Role"
					  },
					  "USER_STATUS":{					  	
						"ACTIVE": "USER_ACTIVE",
						"IN_ACTIVE": "USER_INACTIVE"
					  },
					  "STATUS": {
					    "DRAFT": "DRAFT",
					    "DRAFT_QUOTATION": "DRAFT QUOTATION",
					    "NEW": "NEW",
					    "ISSUE": "ISSUED",
					    "SUBMITTED": "SUBMITTED",
					    "NON_SUBMITTED": "NON_SUBMITTED",
					    "SUBMITTING": "SUBMITTING",
					    "READY_FOR_SUBMISSION": "READY_FOR_SUBMISSION",
					    "PENDING": "PENDING",
					    "PAID": "PAID",
					    "AGREED": "AGREED",
					    "DISAGREED": "DISAGREED",
					    "FAILED": "FAILED",
					    "STP": "STP",
					    "PROPOSAL": "PROPOSAL",
					    "MANUAL": "MANUAL",
					    "INFORCE": "INFORCE",
					    "ACCEPTED": "ACCEPTED",
					    "REJECTED": "REJECTED",
					    "COMPLETED": "COMPLETED"
					  },
					  "DOCUMENT_STATUS": {
						"VALID": "VALID",
						"INVALID": "INVALID"
					  },
					  "PROSPECT_TYPE": {
						"BENEFICIARY": "BENEFICIARY"
					  },
					  "STANDALONE_DOCTYPE": [ 
                         'agent-payment',
                         'client', 
                         'userProfile',
                         'agent',
                         'prospect',
                         'manager-review',
                         'pdpa',
                         'organization-contact',
                         'factfind'
                      ],
                      "LAYOUT_STYLE": {
						  "DEFAULT": "",
						  "card" : "",
						  "sec" : "sec"
					  },
					  "MODULE_NAME": {
					    "PRODUCT": "product",
					    "SUBORDINATE": "subordinate",
					    "PROSPECT": "prospect",
					    "CORPORATE": "organization-contact",
					    "SALECASE": "case-management",
					    "HOME": "home",
					    "ILLUSTRATION": "illustration",
					    "APPLICATION": "application",
					    "QUESTIONNAIRES": "questionnaires",
					    "FACTFIND": "factfind",
					    "PAYMENTNOTICE": "payment",
					    "ESIGNATURE": "esignature",
					    "MANAGERREVIEW": "manager-review",
					    "GROUPDEPARTMENT": "group-department",				   	    
					    "USER": "user",
					    "PDPA": "pdpa",
					    "CLAIM": "claim",
					    "CLAIM_NOTIFICATION": "claim-notification",
					    "DEATH_CLAIM_REGISTRATION": "death-claim-registration",
					    "POLICY": "policy",
					    "CLIENT": "client",
					    "UNDERWRITING": "underwriting",
					    "AGENT_PAYMENT": "agent-payment",
					    "CLIENT_PAYMENT": "client-payment",
					    "MOBILE": "mobile",
						"RESOURCE_FILE": "resource-file",
						"AGENT_DISCLAIMER": "agent-disclaimer",
						"CUSTOMER_DECLARATION": "customer-declaration",
						"UQ_ILLUSTRATION": "uq-illustration"
					  },
					  "TAG": {
					    "STARRED": "STARRED"
					  },
					  "PREDEFINE": {
					    "prospect": [
					      "fnAfterCreateProspect",
					      "fnAfterEditProspect"
					    ],
					    "illustration": [
					      "fnAfterCreateIllustration",
					      "fnAfterEditIllustration"
					    ],
					    "application": [
					      "fnAfterCreateApplication",
					      "fnAfterEditApplication"
					    ],
					    "factfind": [
					      "fnAfterCreateFactfind",
					      "fnAfterEditFactfind"
					    ]
					  },
					  "ACTION": {
					    "SUBMIT": "/action/submit"
					  },
					  "UNDERWRITING_ACTION": {
					    "UNDERWRITER_ACCEPT": "accept",
					    "UNDERWRITER_REJECT": "reject",
					    "UNDERWRITER_COUNTER_OFFER": "counter-offer",
					    "CUSTOMER_ACCEPT": "accept-offer",
					    "CUSTOMER_REJECT": "reject-offer",
					    "CUSTOMER_REQUEST_REVIEW": "request-review",
					    "PICKUP": "pickup",
					    "RETURN": "return"
					  },
					  "BI_STATUS": {
					    "RECOMMEND": "RECOMMEND",
					    "ACCEPTED": "ACCEPTED",
					    "DECLINED": "DECLINED",
					    "PROPOSED": "PROPOSED"
					  },
					  "BI_STATUS_TEXT": {
					    "RECOMMEND": "Draft",
					    "ACCEPTED": "Accepted",
					    "DECLINED": "DECLINED",
					    "PROPOSED": "PROPOSED"
					  },
					  "BI_CHOSENBY": {
					    "CLIENT": "CLIENT",
					    "FA": "FA"
					  },
					  "DATEFORMAT": "dd/MM/yyyy",
					  "SALECASE": {
					    "PROSPECTS_KEY": "Prospects",
					    "PROSPECT_KEY": "Prospect",
					    "FROZEN_PROSPECT_KEY": "ProspectData",
					    "UID_KEY": "Uid",
					    "BIS_KEY": "BusinessIllustrations",
					    "BI_KEY": "BusinessIllustration",
					    "RELATIONSHIP_KEY": "Relationship",
					    "COUNTER_KEY": "counter",
					    "VALUE_KEY": "value",
					    "PROSPECTRELATIONSHIPS_KEY": "ProspectRelationships",
					    "APPS_KEY": "Applications",
					    "APP_KEY": "Application",
					    "PAYMENT_KEY": "Payment",
					    "MANAGER_REVIEW_KEY": "ManagerReview",
					    "REVIEWERS_KEY": "Reviewers",
					    "REVIEWER_KEY": "Reviewer",
					    "ISREVIEWED_KEY": "IsReviewed",
					    "ISDIRECTMANAGER_KEY": "IsDirectManager",
					    "ASSIGNEDDATE_KEY": "AssignedDate",
					    "SC_PDF_GENERATE_STATUS_FAIL": "SC_PDF_GENERATE_STATUS_FAIL",
					    "SC_PDF_GENERATE_STATUS_SUCCESS": "SC_PDF_GENERATE_STATUS_SUCCESS",
					    "SC_PDF_GENERATE_STATUS_GENERATING": "SC_PDF_GENERATE_STATUS_GENERATING"
					  },
					  "PROSPECT": {
					    "RESIDENTIAL_VALUE_KEY": "RESIDENTIAL",
					    "RESIDENTIAL_VALUE_TEXT": "Residential",
					    "PDPA_PACKAGEBUNDLE": "011a123e-aaf5-4e41-93d1-e444d47b6e1a",
					    "POLICY_OWNER": "policyOwner"
					  },
					  "LEFT_SIDE_BAR_INITIAL_LIMIT": 36,
					  "LEFT_SIDE_BAR_INCREMENT": 12,
					  "FACTFIND": {
					    "UID_KEY": "uid",
					    "CHOSENBY_KEY": "chosenBy",
					    "STATUS_KEY": "status",
					    "COMMENT_KEY": "comment",
					    "CATEGORY_KEY": "category",
					    "CODE_KEY": "code",
					    "COUNTER_KEY": "counter",
					    "BIS_KEY": "benefitIllustrations",
					    "BI_KEY": "benefitIllustration",
					    "VALUE_KEY": "value",
					    "PROSPECTS_KEY": "clientBasicInfo,jointApplicantBasicInfo",
					    "PROSPECT_KEY": "prospect",
					    "DEPENDANT_KEY": "dependant",
					    "DEPENDANTS_KEY": "dependants",
					    "APPS_KEY": "applications",
					    "APP_KEY": "application",
					    "SALECASE_KEY": "salecaseId",
					    "CLIENT_KEY": "client",
					    "JA_KEY": "ja",
					    "ADVICE_PRODUCT_ONLY_VALUE": "PRODUCT_ONLY"
					  },
					  "SDWEB": {
					    "STATUS": {
					      "SIGNED": "SIGNED",
					      "NOT_SIGNED": "NOT_SIGNED"
					    }
					  },
					  "PAYMENT_METHOD": {
					    "CHEQUE": "CH",
					    "CASH": "CA",
					    "BANK_TRANSFER": "BA",
					    "CREDIT_CARD": "CR",
					    "CREDIT_CARD_POS": "CP",
					    "OTHER": "OT"
					  },
					  "PROSPECT_DISABLED_ARRAY": [
					    "fullname",
					    "birthDate",
					    "gender",
					    "idType",
					    "idNumber"
					  ],
					  "USER": {
					    "ROLE_UNDERWRITER": "ROLE_UNDERWRITER",
					    "ROLE_AGENT": "ROLE_AGENT"
					  },
					  "AGE_MALE": 24,
					  "AGE_FEMALE": 22,
					  "STARRED": "Starred",
					  "PRODUCT_GROUP": {
					    /*"TERM_LIFE": "term-life",
					    "MOTOR": "motor",
					    "FIRE": "fire",
					    "PERSONAL_ACCIDENT": "personal-accident",
						"GUARANTEED_CASHBACK": "guaranteed-cashback-saver",
						"TERM_LIFE_SECURE": "term-life-secure",
						"GROUP_TERM_LIFE": "term-life"*/
						"FIRE": "Fire",
						"MOTOR": "Motor",
						"FOREIGN_WORKER": "ForeignWorker",
						"TERM_LIFE": "TermLife",
						"GROUP_TERM_LIFE": "GTL1",
						"UNIT_LINK": "UnitLink",
						"TRAVEL": "Travel",
						"DIRECT_TRAVEL": "TravelDirectSale",
						"DIRECT_PA": "Personal-accident",
						"DIRECT_SALE_HOME": "Home",
						"ENDOWMENT": "Endowment"
					  },
					  "PRODUCT_LOB": {
						"PNC": "PnC",
						"LIFE": "Life",
						"GROUP": "Group"
					  },
					  "PRODUCT_CODE": {
						  "travel-express": "TR-AG-01",
						  "group-travel-express": "TR-AG-02",
						  "direct-sale-pa": "PA-DI-01",
						  "direct-sale-travel-express": "TR-DI-01",
						  "direct-sale-home": "FR-DI-01",
						  "direct-sale-motor": "MV-DI-01"
					  },
					  "PAKET": {
						  "REGULAR_UNIT_LINK": "MNC Link",
						  "ENDOWMENT": "UDS"
					  },
					  "PARTNERID": {
						  "MNC_LIFE": "78be87e602dc631c94d1efcdf3bdc66b"
					  },
					  "PAYMENT_GATEWAY": {
						  "MNC_LIFE": "http://uat-www.mnclife.com/evoucher/index.php?p=ipos-pembelianva"
					  },
					  "PRODUCT": {
					    "TERM_LIFE_PROTECT_AS": "term-life-protect-as",
					    "TERM_LIFE_PROTECT_DS": "term-life-protect-ds",
					    "MOTOR_PRIVATE_CAR_M_AS": "motor-private-car-m-as",
					    "MOTOR_PRIVATE_CAR_M_DS": "motor-private-car-m-ds",
					    "MOTOR_PRIVATE_CAR_M": "motor-private-car-m",
					    "MOTOR_PRIVATE_CAR_DS": "motor-private-car-ds",
					    "MOTOR": "motor-private-car-m-as",
					    "FIRE_HOUSEOWNER_AS": "fire-houseowner-as",
					    "FIRE": "FIR",
					    "PERSONAL_ACCIDENT": "personal-accident",
						"GUARANTEED_CASHBACK": "guaranteed-cashback-saver",
						"TERM_LIFE_SECURE": "term-life-secure",
						"GROUP_TERM_LIFE": "GTL1",
						"REGULAR_UNIT_LINK": "regular-unit-link",
						"TRAVEL_EXPRESS": "travel-express",
						"GROUP_TRAVEL_EXPRESS": "group-travel-express",
						"DIRECT_SALE_PA": "direct-sale-pa",
						"DIRECT_TRAVEL": "direct-sale-travel-express",
						"DIRECT_SALE_HOME": "direct-sale-home",
						"DIRECT_SALE_MOTOR": "direct-sale-motor",
						"DS_GUARANTEED_CASHBACK": "ds-guaranteed-cashback-saver",
						"ENDOWMENT": "endowment"
					  },
					  "POLICYSERVICING_REASON":{
						  "ADD_BENEFICIARY":"addBeneficiary",
						  "CHANGE_PREMIUM_FREQUENCY":"changePremiumFrequency"
					  }
						};	
	this.INVOKERUNTIME = "invokeRuntime";

	//START - Initialized this.options 
	//tphan37: need to initalize an object to stores options
	//otherwise with each time angular is bootstrap, new 'options' will be initialized again
	if(!window.portalOptions)
		window.portalOptions = {};

	this.options = window.portalOptions;
	//END - Initialized this.options 

	function createRolePermission (roles){
	  var rs = {};
	  for (var key in roles){
	    rs[key] = {};
	    rs[key]['openable'] = true;
	    rs[key]['editable'] = true;
	    rs[key]['viewable'] = true;
	  }
	  return rs;
	}
	this.options.defaultPermissions = this.options.defaultPermissions ? this.options.defaultPermissions : createRolePermission(this.CONSTANTS.USER_ROLES);

	this.$get = function() {
		return new CommonService(this.urlMap, this.options, this.CONSTANTS);
	};
	
	this.config = function(urlMapOpts, options, constants) {
		this.urlMap = angular.extend(this.urlMap, urlMapOpts);
        this.options = angular.extend(this.options, options);
        this.CONSTANTS = angular.extend(this.CONSTANTS, constants);
	};
	    
	function CommonService(urlMap, options, constants) {
		this.CONSTANTS = constants;
		this.urlMap = urlMap;
		this.options = options;
		this.openingAlert = false;
		this.globalMessage;
	};


	CommonService.prototype.getUrl = (function(){

		/**
		 * Replace parameter such as {0}, {1}, {2},.. in request url
		 * @param  {string} 	input 		input url
		 * @param  {array} 		params 		array of string which will replace curly params
		 * @param  {boolean} 	keepParams 	if true, will return the input, otherwise ''
		 * @return {string}		the modified input
		 */
		function replaceUrlParams(input, params, keepParams) {
			var result;
			var index = input.match(/\d+(?=\})/g);

			// there is no {\d} in input, we'll keep it
			if (index === null){
				result = input;	
			}else{
				if (CommonService.prototype.hasValueNotEmpty(params[index])) {
					result = input.replace(/\{\d+\}/g, params[index]);
				} else 
					result = keepParams ? input : '';	
			}
			
			return result;
		}

		/**
		 * append arrayOfParams to urlElement
		 * @param  {string} 	urlElement 		the name of url need to be create
		 * @param  {array} 		arrayOfParams 	of string which will replace curly params
		 * @return {string}		the url with parameters
		 */
		return function(urlElement, arrayOfParams) {
			var baseUrl = urlElement.baseUrl;
			var idx = baseUrl.indexOf('?'); 
			var url;//baseUrl before '?'
			var params = [];//list of params in baseUrl after '?'
			var i = 0;
			//map params to url
			if (this.hasValue(baseUrl) && this.hasValue(arrayOfParams)) {

				if (idx < 0){
					url = baseUrl;
					params = [];
				}
				else{
					url =  baseUrl.substr(0, idx);
					params = baseUrl.substr(idx + 1, baseUrl.length-1).split('&');
				}

				//process url
				url = url.replace(/\{\d+\}/g, function(substr){
					return replaceUrlParams(substr, arrayOfParams, true);
				})

				//process parameters in url
				if (params){
					params = params.map(function(param){
						return replaceUrlParams(param, arrayOfParams, false);
					});
				}
				params = params.filter(function(n){return n!="";});

				return params.length > 0 ? url + '?' + params.join('&') : url;
			}
			else
				return urlElement;
		}
	})();
	
	// Utilities function
	/**
	 * @param variable
	 * @returns {Boolean} Note: if variable is an empty string (""), it still return true; 
	 */
	CommonService.prototype.hasValue = function (variable){
		return (typeof variable !== 'undefined') && (variable !== null);
	};
	CommonService.prototype.hasValueNotEmpty = function (variable){
		return (typeof variable !== 'undefined') && (variable !== null) && (variable.length !== 0);
	};
	
	CommonService.prototype.parseInt = function (str){
		var result = parseInt(str);
		if(result.toString() == "NaN")
			result = 0;
		return result;
	};
	
	CommonService.prototype.pv = function (rate, nper, per, pmt, fv){	//Excel: PV(rate, nper, pmt, [fv], [type])
		var result = pv(rate, per, nper, pmt, fv);
		return result;
	};
	
	CommonService.prototype.clone = function (o){
		if (o === undefined) return undefined;
		var newObj = jQuery.extend(true, {}, o);
		return newObj;
	};
	
	CommonService.prototype.cloneExcept = function (o, except){
		var self = this;
		if (o === undefined) return undefined;
		var newObj = angular.copy(o);
		for ( var i = 0; i < newObj.elements.length; i++) {
			if(self.hasValue(newObj.elements[i].name) && newObj.elements[i].name == except)
				newObj.elements.splice(i,1);
		}

		return newObj;
	};
	/**
	* Just for testing
	* @param msecs
	*/
	CommonService.prototype.wait = function(msecs){
		var start = new Date().getTime();
		var cur = start;
		while(cur - start < msecs){
			cur = new Date().getTime();
		}	
	};
	/**
	 * @param title Mr., Mrs., Miss.
	 * @param firstname
	 * @param middlename
	 * @param lastname
	 * @returns {String}
	 */
	CommonService.prototype.buildFullName = function(title, firstname, middlename, lastname){
		if(firstname === null) return "";
		
		var rs = "";
		if(this.hasValueNotEmpty(title)) rs += title;
		if(this.hasValueNotEmpty(firstname)) rs += " " + firstname;
		if(this.hasValueNotEmpty(middlename)) rs += " " + middlename;
		if(this.hasValueNotEmpty(lastname)) rs += " " + lastname;
		$.trim(rs);
		return rs;
	};

	CommonService.prototype.numericOnly = function (field) {
	    var num = field.value;
	    var len = num.length;
	    var string = num.substring(len - 1, len);

	    if (string == " ")
	        field.value = num.replace(string,"");

	    if (isNaN(num))
	        field.value = num.replace(string,"");
	};
	
	CommonService.prototype.addCommas = function(nStr) {
		nStr += '';
		var x = nStr.split('.');
		var x1 = x[0];
		var x2 = x.length > 1 ? '.' + x[1] : '';
		var rgx = /(\d+)(\d{3})/;
		while (rgx.test(x1)) {
			x1 = x1.replace(rgx, '$1' + ',' + '$2');
		}
		return x1 + x2;
	};

	/* This method is neccessary to close the gap between Java's SimpleDateFormat and jQuery UI datepicker formatDate methods.
	Takes the SimpleDateFormat string from the server and turns it into the expected jQueryUI formatDate.
	Note: the jQueryUI formatDate only supports some of SimpleDateFormat settings.  Basically only Years, months, days, day of week */
	CommonService.prototype.convertToJquiDateFormat = function(localFormatString){
		 //Year
		 if(localFormatString.search(/y{3,}/g) >=0){                 /* YYYY */
		 localFormatString = localFormatString.replace(/y{3,}/g,     "yy");
		 }else if(localFormatString.search(/y{2}/g) >=0){            /* YY   */
		 //localFormatString = localFormatString.replace(/y{2}/g,      "y");
		 localFormatString = localFormatString.replace(/y{2}/g,      "yy"); // force to 'yy'
		 }
		
		 //Month
		 if(localFormatString.search(/M{4,}/g) >=0){                 /* MMMM */
		 localFormatString = localFormatString.replace(/M{4,}/g,     "MM");
		 }else if(localFormatString.search(/M{3}/g) >=0){            /* MMM  */
		 localFormatString = localFormatString.replace(/M{3}/g,      "M");
		 }else if(localFormatString.search(/M{2}/g) >=0){            /* MM   */
		 localFormatString = localFormatString.replace(/M{2}/g,      "mm");
		 }else if(localFormatString.search(/M{1}/g) >=0){            /* M    */
		 localFormatString = localFormatString.replace(/M{1}/g,      "m");
		 }
		 
		 //Day
		 if(localFormatString.search(/D{2,}/g) >=0){                 /* DD   */
		 localFormatString = localFormatString.replace(/D{2,}/g,     "oo");
		 }else if(localFormatString.search(/D{1}/g) >=0){            /* D    */
		 localFormatString = localFormatString.replace(/D{1}/g,      "o");
		 }
		
		 //Day of month
		 if(localFormatString.search(/E{4,}/g) >=0){                 /* EEEE */
		 localFormatString = localFormatString.replace(/E{4,}/g,     "DD");
		 }else if(localFormatString.search(/E{2,3}/g) >=0){          /* EEE  */
		 localFormatString = localFormatString.replace(/E{2,3}/g,    "D");
		 }
		 return localFormatString;
	};

	/**
	* DatePicker settings
	*/
	CommonService.prototype.applyDatePicker = function(locale, datePattern) {
		var region = locale.replace('_','-');
		var uiRegion = $.datepicker.regional[region];
		if(uiRegion === undefined){
			if(region.length > 2) region = region.substring(0,2);
			else region = "en-GB";
			uiRegion = $.datepicker.regional[region];
			if(uiRegion === undefined){
				uiRegion = $.datepicker.regional["en-GB"];
			}
		}
		$.datepicker.setDefaults(uiRegion);
		$.datepicker.setDefaults({
			changeMonth : true,
			changeYear : true,
			dateFormat : datePattern
		});
	};

	CommonService.prototype.showWindow = function(url, isStatus, isResizeable, isScrollbars, isToolbar, isMenubar,  isLocation, isFullscreen, isTitlebar, isCentered, width, height, top, left){
		if (isCentered){
			top = ($(window).height() - height) / 2;
			left = ($(window).width() - width) / 2;
		}
		var params = 'status=' + (isStatus ? 'yes' : 'no') + ',';
		params += 'resizable=' + (isResizeable ? 'yes' : 'no') + ',';
		params += 'scrollbars=' + (isScrollbars ? 'yes' : 'no') + ',';
		params += 'toolbar=' + (isToolbar ? 'yes' : 'no') + ',';
		params += 'menubar=' + (isMenubar ? 'yes' : 'no') + ',';
		params += 'location=' + (isLocation ? 'yes' : 'no') + ',';
		params += 'fullscreen=' + (isFullscreen ? 'yes' : 'no') + ',';
		params += 'titlebar=' + (isTitlebar ? 'yes' : 'no') + ',';
		params += 'directories=no,';
		params += 'width=' + width + ','; 
		params += 'height=' + height + ',';
		params += 'top=' + top + ','; 
		params += 'left=' + left;
		var newwin = window.open(url, '_blank', params);
		if (window.focus) {newwin.focus();};
	};
	
	CommonService.prototype.showGlobalMessage = function(msg,type){
		var self = this;  
		if(!self.hasValue(type)) {
			type = 'success';
		}		
		var message = msg.split("\n");
		self.globalMessage = {type: type, message: message};
		if(self.hasValueNotEmpty(msg)) {
			this.openingAlert = true; //turn on alert
		} else {
			this.openingAlert = false; 	//turn off alert		
		}
	};
	
	CommonService.prototype.calculateAgeNextBirthday = function(dateString){
		var birthday = +new Date(dateString);
		return ~~((Date.now() - birthday) / (31557600000));
	};
	
	CommonService.prototype.calculateAge = function (dateString) {
	    var now = new Date();
	    var d1 = new Date(dateString);
	    var d2 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
	    var diff = d2.getTime() - d1.getTime();
	    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
	};
	
	function leadingZero (value){
		   if(value < 10){
		      return "0" + value.toString();
		   }
		   return value.toString();    
		}
	
	CommonService.prototype.generateIdByDate = function (doctype){
		var now = new Date();
//		console.log(now);
		if(doctype != null){
			return doctype.concat(now.getFullYear(),leadingZero(now.getMonth()),leadingZero(now.getDate()),leadingZero(now.getHours()),leadingZero(now.getMinutes()),leadingZero(now.getSeconds()));
		}
		return doctype;
		
	}
	
	/**
	 * tphan37
	 * Copy attributes values from des to src
	 * @param  {Object} src the object have attribute values need to copy to {@code des}
	 * @param  {Object} des the object have attribute values will be updated by {@code src}
	 */
	CommonService.prototype.copyValueFromOther = function copyValueFromOther (src, des) {
		for (var k in src) {
			if(angular.isObject(src[k])){
				this.copyValueFromOther(src[k], des[k]);
			}else
				des[k] = src[k];
		};
	}
	
	//hcao7 - Implement Encrypt password transported - ADD - START
	CommonService.prototype.utf8Encode = function(e) {
		e = e.replace(/rn/g, "n");
		var t = "";
		for (var n = 0; n < e.length; n++) {
			var r = e.charCodeAt(n);
			if (r < 128) {
				t += String.fromCharCode(r);
			} else if (r > 127 && r < 2048) {
				t += String.fromCharCode(r >> 6 | 192);
				t += String.fromCharCode(r & 63 | 128);
			} else {
				t += String.fromCharCode(r >> 12 | 224);
				t += String.fromCharCode(r >> 6 & 63 | 128);
				t += String.fromCharCode(r & 63 | 128);
			}
		}
		return t;
	}
	
	CommonService.prototype.encodePassword =function(e) {		
		var keyStr = this.options.alphabet;//window.alphabetKey;
		var t = "";
		var n, r, i, s, o, u, a;
		var f = 0;
		e = this.utf8Encode(e);
		while (f < e.length) {
			n = e.charCodeAt(f++);
			r = e.charCodeAt(f++);
			i = e.charCodeAt(f++);
			s = n >> 2;
			o = (n & 3) << 4 | r >> 4;
			u = (r & 15) << 2 | i >> 6;
			a = i & 63;
			if (isNaN(r)) {
				u = a = 64;
			} else if (isNaN(i)) {
				a = 64;
			}
			t = t + keyStr.charAt(s) 
				+ keyStr.charAt(o)
				+ keyStr.charAt(u)
				+ keyStr.charAt(a);
		}
		return t;
	}
	
	CommonService.prototype.decodePassword = function(e) {		
		var uf8Decode = function(e) {
			var t = "";
			var n = 0;
			var r = c1 = c2 = 0;
			while (n < e.length) {
				r = e.charCodeAt(n);
				if (r < 128) {
					t += String.fromCharCode(r);
					n++;
				} else if (r > 191 && r < 224) {
					c2 = e.charCodeAt(n + 1);
					t += String.fromCharCode((r & 31) << 6 | c2 & 63);
					n += 2;
				} else {
					c2 = e.charCodeAt(n + 1);
					c3 = e.charCodeAt(n + 2);
					t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
					n += 3;
				}
			}
			return t;			
		}
		
		var keyStr = this.options.alphabet;// window.alphabetKey;
		var t = "";
		var n, r, i;
		var s, o, u, a;
		var f = 0;
		e = e.replace(/[^A-Za-z0-9+/=]/g,"");
		while (f < e.length) {
			s = keyStr.indexOf(e.charAt(f++));
			o = keyStr.indexOf(e.charAt(f++));
			u = keyStr.indexOf(e.charAt(f++));
			a = keyStr.indexOf(e.charAt(f++));
			n = s << 2 | o >> 4;
			r = (o & 15) << 4 | u >> 2;
			i = (u & 3) << 6 | a;
			t = t + String.fromCharCode(n);
			if (u != 64) {
				t = t + String.fromCharCode(r);
			}
			if (a != 64) {
				t = t
						+ String
								.fromCharCode(i)
			}
		}
		t = utf8Decode(t);
		return t
	}

						
	CommonService.prototype.md5Encode = function(str) {
		// http://phpjs.org/functions/md5/
		var xl;
		var rotateLeft = function(lValue, iShiftBits) {
			return (lValue << iShiftBits)
					| (lValue >>> (32 - iShiftBits));
		}
		var addUnsigned = function(lX, lY) {
			var lX4, lY4, lX8, lY8, lResult;
			lX8 = (lX & 0x80000000);
			lY8 = (lY & 0x80000000);
			lX4 = (lX & 0x40000000);
			lY4 = (lY & 0x40000000);
			lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
			if (lX4 & lY4) {
				return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
			}
			if (lX4 | lY4) {
				if (lResult & 0x40000000) {
					return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
				} else {
					return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
				}
			} else {
				return (lResult ^ lX8 ^ lY8);
			}
		}

		var _F = function(x, y, z) {
			return (x & y) | ((~x) & z);
		}
		var _G = function(x, y, z) {
			return (x & z) | (y & (~z));
		}
		var _H = function(x, y, z) {
			return (x ^ y ^ z);
		}
		var _I = function(x, y, z) {
			return (y ^ (x | (~z)));
		}

		var _FF = function(a, b, c, d, x, s, ac) {
			a = addUnsigned(a, addUnsigned(addUnsigned(_F(b, c,
					d), x), ac));
			return addUnsigned(rotateLeft(a, s), b);
		}

		var _GG = function(a, b, c, d, x, s, ac) {
			a = addUnsigned(a, addUnsigned(addUnsigned(_G(b, c,
					d), x), ac));
			return addUnsigned(rotateLeft(a, s), b);
		}

		var _HH = function(a, b, c, d, x, s, ac) {
			a = addUnsigned(a, addUnsigned(addUnsigned(_H(b, c,
					d), x), ac));
			return addUnsigned(rotateLeft(a, s), b);
		}

		var _II = function(a, b, c, d, x, s, ac) {
			a = addUnsigned(a, addUnsigned(addUnsigned(_I(b, c,
					d), x), ac));
			return addUnsigned(rotateLeft(a, s), b);
		}

		var convertToWordArray = function(str) {
			var lWordCount;
			var lMessageLength = str.length;
			var lNumberOfWords_temp1 = lMessageLength + 8;
			var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
			var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
			var lWordArray = new Array(lNumberOfWords - 1);
			var lBytePosition = 0;
			var lByteCount = 0;
			while (lByteCount < lMessageLength) {
				lWordCount = (lByteCount - (lByteCount % 4)) / 4;
				lBytePosition = (lByteCount % 4) * 8;
				lWordArray[lWordCount] = (lWordArray[lWordCount] | (str
						.charCodeAt(lByteCount) << lBytePosition));
				lByteCount++;
			}
			lWordCount = (lByteCount - (lByteCount % 4)) / 4;
			lBytePosition = (lByteCount % 4) * 8;
			lWordArray[lWordCount] = lWordArray[lWordCount]
					| (0x80 << lBytePosition);
			lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
			lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
			return lWordArray;
		}

		var wordToHex = function(lValue) {
			var wordToHexValue = '', wordToHexValue_temp = '', lByte, lCount;
			for (lCount = 0; lCount <= 3; lCount++) {
				lByte = (lValue >>> (lCount * 8)) & 255;
				wordToHexValue_temp = '0' + lByte.toString(16);
				wordToHexValue = wordToHexValue
						+ wordToHexValue_temp.substr(
								wordToHexValue_temp.length - 2,
								2);
			}
			return wordToHexValue;
		}

		var x = [], k, AA, BB, CC, DD, a, b, c, d, S11 = 7, S12 = 12, S13 = 17, S14 = 22, S21 = 5, S22 = 9, S23 = 14, S24 = 20, S31 = 4, S32 = 11, S33 = 16, S34 = 23, S41 = 6, S42 = 10, S43 = 15, S44 = 21;

		str = this.utf8Encode(str);
		x = convertToWordArray(str);
		a = 0x67452301;
		b = 0xEFCDAB89;
		c = 0x98BADCFE;
		d = 0x10325476;

		xl = x.length
		for (k = 0; k < xl; k += 16) {
			AA = a;
			BB = b;
			CC = c;
			DD = d;
			a = _FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
			d = _FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
			c = _FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
			b = _FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
			a = _FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
			d = _FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
			c = _FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
			b = _FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
			a = _FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
			d = _FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
			c = _FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
			b = _FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
			a = _FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
			d = _FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
			c = _FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
			b = _FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
			a = _GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
			d = _GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
			c = _GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
			b = _GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
			a = _GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
			d = _GG(d, a, b, c, x[k + 10], S22, 0x2441453);
			c = _GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
			b = _GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
			a = _GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
			d = _GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
			c = _GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
			b = _GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
			a = _GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
			d = _GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
			c = _GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
			b = _GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
			a = _HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
			d = _HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
			c = _HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
			b = _HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
			a = _HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
			d = _HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
			c = _HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
			b = _HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
			a = _HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
			d = _HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
			c = _HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
			b = _HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
			a = _HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
			d = _HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
			c = _HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
			b = _HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
			a = _II(a, b, c, d, x[k + 0], S41, 0xF4292244);
			d = _II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
			c = _II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
			b = _II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
			a = _II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
			d = _II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
			c = _II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
			b = _II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
			a = _II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
			d = _II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
			c = _II(c, d, a, b, x[k + 6], S43, 0xA3014314);
			b = _II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
			a = _II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
			d = _II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
			c = _II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
			b = _II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
			a = addUnsigned(a, AA);
			b = addUnsigned(b, BB);
			c = addUnsigned(c, CC);
			d = addUnsigned(d, DD);
		}
		var temp = wordToHex(a) + wordToHex(b) + wordToHex(c)
				+ wordToHex(d);
		return temp.toLowerCase();

	}
	
	//hcao7 - Implement Encrypt password transported - ADD - END
	
})
/*##################################################################
 * AJAX Service
###################################################################*/
.service('ajax', ['$http', 'commonService', function($http, commonService){
	function AjaxPromise(){
		this.isSuccess = undefined;//the calling ajax method is success or not. If success, this value will be Boolean.true
		this.successData = undefined;
	}
	/**
	 * @param fn this function will be called after the ajax process is finished successfully.
	 * The fn should have an argument to receive the result data.
	 */
	AjaxPromise.prototype.success = function(fn){
		var self = this;
		if (self.isSuccess){
			var data = self.successData;
			self.successData = undefined;//clear this data after using it.
			fn.call(self, data);
		}
	};
	
	AjaxPromise.prototype.error = function(fn){
		var self = this;
		if (self.isSuccess) return;//don't run if result is success
		fn.call(self);
	};
	
	function AjaxService($http){
		this.$http = $http;
		this.apiUrl = commonService.options.serverUrl;
		this.apiUrl_V3 = commonService.options.serverUrl_V3;
	}
	/**
	 * This method doesn't use cache
	 * @param url
	 * @param data
	 * @returns HttpPromise
	 */
	AjaxService.prototype.post = function(url, data, uiNonBlock){
		var self = this;
		return self.$http.post(self.apiUrl + url + "?userId=" + angular.userId + "&_=" + (new Date()).getTime(),data,{cache: false, uiNonBlock : uiNonBlock});
	};
	/**
	 * This method doesn't use cache
	 * @param url
	 * @param data
	 * @returns HttpPromise
	 */
	AjaxService.prototype.get = function(url, uiNonBlock){
		var self = this;
		return self.$http.get(self.apiUrl + url + "?userId=" + angular.userId +"&_=" + (new Date()).getTime(),{cache: false, uiNonBlock : uiNonBlock});
	};
	/*
	 * This function is use temporary for Ipos V2, it will be removed after Ipos v3 complete all.
	 */
	AjaxService.prototype.post_V3 = function(url, data, uiNonBlock){
		var self = this;
		return self.$http.post(self.apiUrl_V3 + url + "?userId=" + angular.userId + "&_=" + (new Date()).getTime(),data,{cache: false, uiNonBlock : uiNonBlock});
	};
	/*
	 * This function is use temporary for Ipos V2, it will be removed after Ipos v3 complete all.
	 */
	AjaxService.prototype.get_V3 = function(url, uiNonBlock){
		var self = this;
		return self.$http.get(self.apiUrl_V3 + url + "?userId=" + angular.userId + "&_=" + (new Date()).getTime(),{cache: false, uiNonBlock : uiNonBlock});
	};
	/**
	 * This method will call Ajax synchronously
	 * @param url
	 * @returns an AjaxPromise. we use this approach to simulate the promise of Angular.$http
	 */
	AjaxService.prototype.getSync = function(url){
		var promise = new AjaxPromise();
		$.getSync(this.apiUrl + url,function(data){
			promise.isSuccess = true;
			promise.successData = data;
		});
		return promise;
	};
	/**
	 * This method will call Ajax synchronously
	 * @param url
	 * @param data a JavaScript request object (will be converted to JSON)
	 * @returns an AjaxPromise. we use this approach to simulate the promise of Angular.$http
	 */
	AjaxService.prototype.postSync = function(url, requestData){
		var promise = new AjaxPromise();
		$.postSync(this.apiUrl + url, requestData, function(data){
			promise.isSuccess = true;
			promise.successData = data;//If there is some error, this code won't run
		});
		return promise;
	};
	AjaxService.prototype.postRes = function(resourceURL, requestData, fnSuccess, fnError){
		var self = this;
		self.$http({
	    	method: "POST",
	    	url: resourceURL,
	    	cache: false,
	    	headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
			transformRequest: function(data){if (data != undefined){return $.param({COMMAND:JSON.stringify(data)});}},
	    	data: requestData
	    }).success(fnSuccess).error(fnError);
	};
	AjaxService.prototype.getRes = function(resourceURL, fnSuccess, fnError){
		var self = this;
		self.$http({
	    	method: "GET",
	    	url: resourceURL,
	    	cache: false
	    }).success(fnSuccess).error(fnError);
	};	
	
	AjaxService.prototype.postRuntimeDS = function(params, dataUrl, serveUrl, config, fnSuccess, fnError){
		 var self = this;
	     var form = new FormData();
	     var url = serveUrl + dataUrl;
	 	 form.append("file", params.file);	 	 
	 	 var settings = {	 	    
	 	    "url": url,
	 	    "method": "POST",
	 	    "headers": config.headers,
	 	    "processData": false,
	 		"contentType": false,
	 	    "mimeType": "multipart/form-data",
	 	    "data": form
	 	}	 	 
	 	$.ajax(settings).success(fnSuccess).error(fnError);	 	
	};	
	
	/**
	 * Thid method will call Runtime restful service via POST method
	 * @param resourceURL
	 * @param requestData
	 * @param fnSuccess
	 * @param fnError
	 */
	AjaxService.prototype.postRuntime = function(resourceURL, runtimeURL, requestData, fnSuccess, fnError){
		var self = this;
		self.$http({
	    	method: "POST",
	    	url: resourceURL,
	    	runtimeURL:runtimeURL,
	    	cache: false,
	    	headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
			transformRequest: function(data){
				if (data != undefined){
					return $.param({
						URL:runtimeURL,
						METHOD:'POST',
						COMMAND:JSON.stringify(data)
						});
					}
				},
	    	data: requestData
	    }).success(fnSuccess).error(fnError);
	};
	
	/**
	 * Thid method will call Runtime restful service via PUT method
	 * @param resourceURL
	 * @param requestData
	 * @param fnSuccess
	 * @param fnError
	 */
	AjaxService.prototype.putRuntime = function(resourceURL, runtimeURL, requestData, fnSuccess, fnError){
		var self = this;
		self.$http({
			method: "POST",
			url: resourceURL,
			runtimeURL:runtimeURL,
			cache: false,
			headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
			transformRequest: function(data){
				if (data != undefined){
					return $.param({
						URL:runtimeURL,
						METHOD:'PUT',
						COMMAND:JSON.stringify(data)
					});
				}
			},
			data: requestData
		}).success(fnSuccess).error(fnError);
	};
	
	AjaxService.prototype.postFile = function(resourceURL, runtimeURL, requestData, fnSuccess, fnError){
		var self = this;
		self.$http({
	    	method: "POST",
	    	url: resourceURL,
	    	runtimeURL:runtimeURL,
	    	cache: false,
	    	headers: { 'Content-Type': 'application/form-data'},
	
	    	data: requestData
	    }).success(fnSuccess).error(fnError);
	};	
	/**
	 * Thid method will call Runtime restful service via GET method
	 * @param resourceURL
	 * @param requestData
	 * @param fnSuccess
	 * @param fnError
	 */
	AjaxService.prototype.getRuntime = function(resourceURL, runtimeURL, fnSuccess, fnError){
		var self = this;
		self.$http({
	    	method: "POST",
	    	url: resourceURL,
	    	runtimeURL:runtimeURL,
	    	cache: false,
	    	headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
	    	transformRequest: function(data){
	    		if (commonService.hasValueNotEmpty(data)){
	    			return $.param({
	    				URL:runtimeURL,
	    				METHOD:'GET',
	    				COMMAND:JSON.stringify(data)
	    				});
	    			}
	    		},
	    	data: {}
	    }).success(fnSuccess).error(fnError);
	};
	
	/**
	 * Thid method will call Backend restful service via GET method for File
	 * @param resourceURL
	 * @param requestData
	 * @param fnSuccess
	 * @param fnError
	 */
	AjaxService.prototype.getFile = function(resourceURL, runtimeURL, fnSuccess, fnError){
		var self = this;
		self.$http({
	    	method: "POST",
	    	url: resourceURL,
	    	runtimeURL:runtimeURL,
	    	cache: false,
	    	headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
	    	transformRequest: function(data){
	    		if (commonService.hasValueNotEmpty(data)){
	    			return $.param({
	    				URL:runtimeURL,
	    				METHOD:'GET',
	    				COMMAND:JSON.stringify(data)
	    				});
	    			}
	    		},
	    	data: {},
	    	responseType: 'arraybuffer'
	    }).success(fnSuccess).error(fnError);
	};
	
	return new AjaxService($http);
}])
/*##################################################################
 * Cache Service
###################################################################*/
.service('cacheService',['$cacheFactory', 'ajax', 'commonService', function($cacheFactory, ajax, commonService){
	
	/**
	 * 2012-08-25
	 * At this moment, each service (ProspectService, IllustrationService, FactFindService) has their own the list of meta-data items.
	 * In the future, we may move that items in to this class so other services can reuse those meta data items.
	 */
	function CacheService(ajax){
		var self = this;
		self.ajax = ajax;
		
		var metadataCache = $cacheFactory("metadataCache");
		var packageBundleCache = $cacheFactory("packageBundleCache");
		
		self.items = {
			metaData : metadataCache,
			packageBundle : packageBundleCache
		};
		//self.items['prospect'] contains prospect items.
		//self.items['illustration'] contains illustration items.
	}

	/**
	 * This method is used to check there are any loaded items or not.
	 * @param docType 'metaData'(default) / 'packageBudnle' 
	 */
	CacheService.prototype.hasItems = function(module, docType){
		var self = this;
		if (!commonService.hasValue(docType)) docType = commonService.CONSTANTS.DOCTYPE.METADATA;
		var rs =  (commonService.hasValue(self.items[docType].get(module)));
		return rs;
	};
	
	/**
	 * Load list of meta-data items from server
	 * If you want to get, use self.getItems("prospect")
	 * @param module This function doesn't support "product" module, metadata of a product is 
	 * 				 actually saved in ajax.items["packageBundle"]["illustration"];
	 * @param docType 'metaData'(default) / 'packageBundle'
	 */
	CacheService.prototype.loadItems = function(module, docType, fnSuccess, contextUserUid){
		var self = this;
		
		if (!commonService.hasValue(docType)) docType = commonService.CONSTANTS.DOCTYPE.METADATA;
		var url = undefined;
		if (docType == commonService.CONSTANTS.DOCTYPE.METADATA){
//			url = module + "/list";
			if (contextUserUid != undefined) {
				url = commonService.getUrl(commonService.urlMap.METADATA_LIST_SUBORDINATE, [module, contextUserUid]);
			} else {
				url = commonService.getUrl(commonService.urlMap.METADATA_LIST, [module]);
			}
			//console.log("METADATA url:"+url);
		}else if (docType == commonService.CONSTANTS.DOCTYPE.PACKAGEBUNDLE){
//			url = module + "/listPackageBundle";
			if (module === commonService.CONSTANTS.MODULE_NAME.PRODUCT) {
				url = commonService.getUrl(commonService.urlMap.PRODUCT_LIST);
			} else {
				url = commonService.getUrl(commonService.urlMap.PACKAGEBUNDLE_LIST, [ module ]);
			}
			//console.log("url:"+url);
		}else{
			var err = new IposError("docType is not correct, it should be either 'metaData' or 'packageBundle'");
			err.param("moduleName", module);
			err.param("docType", docType);
			err.throwError();
		}
		self.ajax.get(url).success(function(data){
//			self.items[docType][module] = data;
			self.items[docType].put(module, data);	
			if (fnSuccess !== undefined) {
				fnSuccess.call(this,data);
			}
		});
		return null;
	};
	
	// clear cache in case of switching workbenches between log-in user and subordinate	
	CacheService.prototype.removeItems = function(){
		var self = this;
		
		self.items[commonService.CONSTANTS.DOCTYPE.METADATA].remove("prospect");
		self.items[commonService.CONSTANTS.DOCTYPE.METADATA].remove("factfind");
		self.items[commonService.CONSTANTS.DOCTYPE.METADATA].remove("application");
		self.items[commonService.CONSTANTS.DOCTYPE.METADATA].remove("managerreview");
		self.items[commonService.CONSTANTS.DOCTYPE.METADATA].remove("salecase");
		self.items[commonService.CONSTANTS.DOCTYPE.METADATA].remove("client");
		self.items[commonService.CONSTANTS.DOCTYPE.METADATA].remove("illustration");
		self.items[commonService.CONSTANTS.DOCTYPE.METADATA].remove("payment");
		
		return null;
	};
	
	/**
	 * update list of last updated from server
	 * If you want to get, use self.getItems("prospect")
	 * @param module
	 * @param docType 'metaData'(default) / 'packageBundle'
	 */
	CacheService.prototype.syncLastUpdatedItems = function(module, docType, fnSuccess){
		var self = this;
		
		if (!commonService.hasValue(docType)) docType = commonService.CONSTANTS.DOCTYPE.METADATA;
		var url = undefined;
		if (docType == commonService.CONSTANTS.DOCTYPE.METADATA){
			url = commonService.getUrl(commonService.urlMap.LAST_UPDATED_ITEMS, [module] );
		}else if (docType == commonService.CONSTANTS.DOCTYPE.PACKAGEBUNDLE){
			// do nothing
			if (fnSuccess !== undefined) {
				fnSuccess.call(this, self.items[docType].get(module));
			}
			return true;
		}else{
			var err = new IposError("docType is not correct, it should be either 'metaData' or 'packageBundle'");
			err.param("moduleName", module);
			err.param("docType", docType);
			err.throwError();
		}
		self.ajax.get(url).success(function(data){
			var cacheItems = self.items[docType].get(module);
			var updateItems = data;
			for(var i = updateItems.length-1; i >= 0; i--){
				var updateItem = updateItems[i];
				var ifound = -1;
				for(var j = 0; j < cacheItems.length; j++){
					if(updateItem.uid == cacheItems[j].uid){
						ifound = j;
						break;
					}
				}
				if (ifound == -1) {//add new
					cacheItems.splice(0, 0, updateItem);
				}else{//update
					cacheItems.splice(ifound, 1, updateItem);
				}
			}
			if (fnSuccess !== undefined) {
				fnSuccess.call(this, cacheItems);
			}
		});
		return true;
	};
	/**
	 * It will find items in service, if not found, it will load from server (call loadItems()).
	 * @param module
	 * @param docType 'metaData'(default) / 'packageBundle'
	 */
	CacheService.prototype.getItems = function(module, docType, fnSuccess, contextUserUid){
		var self = this;
		
		if (!commonService.hasValue(docType)) {
			docType = commonService.CONSTANTS.DOCTYPE.METADATA;
		}
		
		var rs = self.items[docType].get(module);
		
		if (!commonService.hasValue(rs) || commonService.hasValue(contextUserUid) ) {
			self.loadItems(module, docType, fnSuccess, contextUserUid);
		} else {
			if (commonService.hasValue(fnSuccess)) {
				fnSuccess.call(this,rs);
			}
		};	
	};
	
	return new CacheService(ajax); 
}])
/*##################################################################
 * App Service
###################################################################*/
.service('appService', [ '$rootScope', 'ajax', 'commonService', function($rootScope, ajax, commonService){
	function AppService(ajax, scope){
		var self = this;
		self.ajax = ajax;
		self.localeContext = null;
		this.subordinateUid = undefined;
		this.subordinateFullname = undefined;
		/*self.init = function(){
			//Load locale context
			ajax.post("resource/i18n/prefix",['workspace', 'notification','payment','application','person','policy','fa','factfind','document.status']).success(function(data){
				self.localeContext = data;
				sessionTimeout = self.localeContext.sessionTimeout;
				commonService.applyDatePicker(self.localeContext.localeId, commonService.convertToJquiDateFormat(self.localeContext.shortDateFormat));
//				scope.$apply();
	        });
		};
		self.init();*/
		self.formatString = function(text, params){
			var newText = text;
			// replace {0},{1},..,{n} with params
			if(params !== undefined && params.length > 0){
				for (var i = 0; i < params.length; i++) {
			        var regexp = new RegExp('\\{'+i+'\\}', 'gi');
			        newText = newText.replace(regexp, params[i]);
			    }
			}
			return newText;
		};
		//Chi Nguyen add
		self.formatStringWithJson = function formatStringWithJson(text, jsonObj){
			var newText = text;

			for (var key in jsonObj) {
		        var regexp = new RegExp('\\$\\{' + key + '\\}', 'gi');
		        if(key.toUpperCase() === 'ACTIONAT') {
		        	var d = new Date(jsonObj[key]);
		        	newText = newText.replace(regexp, d.toLocaleString());
		        }
		        else {
		        	newText = newText.replace(regexp, jsonObj[key]);
		        }
		    }
			
			return newText;
		};
		self.getI18NText = function(code, params){
			if(self.localeContext == null) return code;
			var text = self.localeContext.messageSource[code];
			if(text != undefined) return self.formatString(text, params);
			//TODO : should be synchronous
			text = code;
			ajax.postSync("resource/i18n",[code]).success(function(data){
				text = data[code];
	        	self.localeContext.messageSource[code] = text;
	        });
			return text;
		};
		self.getLocalI18NText = function(code, params){
			if(self.localeContext == null) return code;
			var text = self.localeContext.messageSource[code];
			if(text != undefined) return self.formatString(text, params);
			return code;
		};
		
		self.getUserName = function(){
			if(self.localeContext !== null) return  self.localeContext.userName;
		};
		self.getUserUid = function(){
			if(self.localeContext !== null) return  self.localeContext.userUid;
		};
		self.getAgentId = function(){
			if(self.localeContext !== null) return  self.localeContext.agentId;
		};
		self.getAgentName = function(){
			if(self.localeContext !== null) return  self.localeContext.agentName;
		};
		self.getAppVersion = function(){
			if(self.localeContext !== null) return  self.localeContext.appVersion;
		};
		self.getUserDoc = function(){
			if(self.localeContext !== null) return  self.localeContext.userDoc;
		};
		self.getPermissionDoc = function(){
			if(self.localeContext !== null) return  self.localeContext.permissionDoc;
		};
		self.getSdwebLoadServiceUrl = function(){
			if(self.localeContext !== null) return  self.localeContext.sdwebLoadServiceUrl;
		};
		self.getSdwebLoadServletUrl = function(){
			if(self.localeContext !== null) return  self.localeContext.sdwebLoadServletUrl;
		};
		self.getSdwebDocumentLoadMode = function(){
			if(self.localeContext !== null) return  self.localeContext.sdwebDocumentLoadMode;
		};
		self.getSdwebUrlInternalProtocol = function(){
			if(self.localeContext !== null) return  self.localeContext.sdwebUrlInternalProtocol;
		};		
		self.getIPosHost = function(){
			if(self.localeContext !== null) return  self.localeContext.iposHost;
		};
		self.getSdwebLoadFormServlet = function(){
			if(self.localeContext !== null) return  self.localeContext.sdwebLoadFormServlet;
		};		
	};
	return new AppService(ajax, $rootScope);
}])
//////////////////////////////////////////////////////////////////////////////////////////////////
//
// This common file has nothing to do with other JavaScript framework, just pure JavaScript function.
//
///////////////////////////////////////////////////////////////////////////////////////////////////
jQuery.support.cors = true;

(function($) {
	$.postSync = function(url, data, callback) {
		if(typeof data === "string"){
			return $.ajax({
		        type: 'POST',
		        url: url,
		        cache: false,
		        contentType: 'application/json',
		        data: data,
		        dataType: 'json',
		        async: false,
		        success: callback
		    });
		}else if(window.JSON && window.JSON.stringify){
		    return $.ajax({
		        type: 'POST',
		        url: url,
		        cache: false,
		        contentType: 'application/json',
		        data: window.JSON.stringify(data),
		        dataType: 'json',
		        async: false,
		        success: callback
		    });
		}
		return null;
	};
	
	$.getSync = function(url, callback) {
		return $.ajax({
	        type: 'GET',
	        url: url,
	        cache: false,
	        dataType: 'json',
	        async: false,
	        success: callback
	    });
	};
})(jQuery);

/**
 * mle27
 * This method return an array with unique elements
 */
Array.prototype.unique = function() {
    var unique = [];
    for (var i = 0; i < this.length; i++) {
        var current = this[i];
        if (unique.indexOf(current) < 0 && current!==undefined) unique.push(current);
    }
    return unique;
};

Array.prototype.remove = function(item) {
	var j = 0;
	while (j < this.length) {
		// alert(originalArray[j]);
		if (this[j] == item) {
		this.splice(j, 1);
		} else { j++; }
	}
};
String.prototype.beginWithRegExp = function(regExp){
	var rs = false;
	if(pathname.match(regExp)) {
		rs = true;
	}
	return rs;
    //return(this.indexOf(needle) == 0);
};
/**
 * @param s This method check whether the string start with @param s or not.
 * @returns {Boolean}
 */
String.prototype.beginWith = function(s){
	var rs = (this.substr(0, s.length) == s);
	return rs;
};

/**
 * tphan37
 * @param s This method capitalize the first letter
 * @returns {String}
 */
String.prototype.capitalizeFirstLetter = function(){
    return this.charAt(0).toUpperCase() + this.slice(1);
};



/**
 * tphan37
 * @returns {Object} the last object in the array, 'undefined' if length = 0
 */
Array.prototype.lastObj = function(){
	if(this.length < 1)
		return undefined;

	return this[this.length - 1];
};

/**
 * qle7
 * @param places
 * @param symbol
 * @param thousand
 * @param decimal
 * @returns
 */
Number.prototype.formatMoney = function(places, symbol, thousand, decimal) {
	places = !isNaN(places = Math.abs(places)) ? places : 2;
	symbol = symbol !== undefined ? symbol : "$";
	thousand = thousand || ",";
	decimal = decimal || ".";
	var number = this, 
	    negative = number < 0 ? "-" : "",
	    i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
	    j = (j = i.length) > 3 ? j % 3 : 0;
	return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
};

/**
 * tphan37
 * 27-Jan-2016
 * @param  {Object} obj      obj need to find
 * @param  {String} propName key name want to find
 * @return {Object}          primitive value or object
 */
function getValueByPropertyName(obj, propName) {
	for(var key in obj) {
		if(propName === key) {
			return obj[key];
		} else if (typeof obj[key] === 'object') {
			var value = getValueByPropertyName(obj[key], propName);
			if (value) {
				return value;
			}
		}
	}
	return undefined;
};


/**
 * @author tphan37
 * Copy attributes values from des to src
 * Will recursive to children obj for further processing
 * @param  {Object} src the object have attribute values need to copy to {@code des}
 * @param  {Object} des the object have attribute values will be updated by {@code src}
 */
function copyValueFromOther(src, des) {
	for (var k in src) {
		if(typeof src[k] === 'object'){
			copyValueFromOther(src[k], des[k]);
		}else
			des[k] = src[k];
	};
}

/**
 * @author tphan37
 * copy and extend attributes values from des to src
 * Will recursive to children obj for further processing
 * @param  {Object} des the object have attribute values will be updated by {@code src}
 * @param  {Object} src the object have attribute values need to copy to {@code des}
 * @return {Object}     the {@code des} object has been extended
 */
function extendValueFromOther(des, src) {
	for (var k in src) {
		if (!src.hasOwnProperty(k))
			continue;

		if (typeof src[k] === 'object' && src[k] !== null){    			
			//is array, check whether if it's been created
			if(Array.isArray(src[k])){
				des[k] = Array.isArray(des[k]) ? des[k] : [];
			}
			//is object, check whether if it's been created
			else{
				des[k] = typeof des[k] === 'object' ? des[k] : {};
			}
			extendValueFromOther(des[k], src[k]);
		}else
			des[k] = src[k];
	};
	return des;
}

function inheritPrototype(prototype) {
	function F() {}; // Dummy constructor
	F.prototype = prototype; 
	return new F(); 
}

/**
 * Inherit proptotype chain of parentClazz to childClazz
 * @param parentClazz parent class 
 * @param childClazz child class 
 */
function inherit(parentClazz, childClazz){
	childClazz.prototype = inheritPrototype(parentClazz.prototype);
	childClazz.prototype.constructor = childClazz;
}

/**
 * Extend only proptotype properties that srcClazz owns to prototype of destClazz
 * @param srcClazz source class 
 * @param destClazz destination class to be extended
 */
function extend(srcClazz, destClazz) {
	for (var k in srcClazz.prototype) {
		if (srcClazz.prototype.hasOwnProperty(k)) {
			destClazz.prototype[k] = srcClazz.prototype[k];
		}
	}
	destClazz.prototype = inheritPrototype(destClazz.prototype);
}

