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

//This is to config and build URL
var urlModule = angular.module('urlModule', [])
.provider('urlService',[function (){
	
	this.urlMap = {
			"CLIENT_LIST" : "client-list",
			"MY_CLIENTS" : "my-clients",
			"CREATE_QUOTE" : "create-quote",
			"RESOURCE_CENTRE" : "resource-centre",
			"INDIVIDUAL_PRODUCTS" : "individual-products",
			"BUSINESS_CATALOG" : "business-catalog",
			"ERROR_INFORMATION" : "error-information",
			"DEATH_CLAIM_REGISTRATION" : "death-claim-registration",
			"MOBILE_ACCESS_TICKET" : "mobile-access-ticket",
			"GROUP_DEPARTMENT_MANAGER" : "group-manager-space",
			"BUSINESS_PRODUCTS" : "business-products",
			"PRODUCT_PROMOTION":"product-promotion",
			"PRODUCT_LAUNCH":"product-launch",
			"POLICY_PORTFOLIO":"policy-portfolio",
			"RENEWAL" : "renewal",
			"PROSPECT_DETAIL": "prospect-detail",
			"PROSPECT_LIST": "prospect-list",
			"WELCOME_PAGE" : "welcome",
			"PAYMENT" : "payment",
			"PRODUCT_LAUNCH" : "product-launch",
			"LOGIN":"signin",
			"DOCUMENT_DETAIL":"document-detail",
			"SHOPPINGCART":"transaction-center",
			"SHOPPINGCARTMNC":"payment-cart-mnc",
			"SHOPPING_CART_MNC_LIFE":"payment-cart-mnc-life",
			"MYPROFILE":"user-profile",
			"CLAIMS":"claims",
			"FORM_CENTER":"form-center",
			"HOME":"home",
			"MYHOME":"my-home",
			"MYWORKSPACE":"my-workspace",
			"NEW_MY_WORKSPACE":"new-my-workspace",
			"ENDORSEMENT":"policy-endorsement",
			"PRODUCT_SPECIFICATIONS":"product-specifications",
			"CONTACT_US": "contact-us",
			"ABOUT_US":"about-us",
			"FUNDS":"funds-information",
			"ACTIVATE":"activate-user",
			"MY_CONTENT":"my-content",
			"MY_UNDERWRITING_SPACE":"my-underwriting-space"
				
	};
	
	this.$get = function() {
		return new UrlService(this.urlMap, this.options, this.CONSTANTS);
	};
		
	function UrlService(urlMap) {
		this.urlMap = urlMap;
	};
	
	//return /iposportal
	UrlService.prototype.getSiteURL = function (){
		return $("#siteURL").val();
	};
	
	//return localhost:8080
	UrlService.prototype.getHost = function(){
		return $(location).attr('host');
	};
	
	//return http
	UrlService.prototype.getProtocol = function(){
		return $(location).attr('protocol');
	};
	
	UrlService.prototype.getFullURL = function(pageURL){
		return this.getProtocol() + "//" + this.getHost() + "/web" + this.getSiteURL() + "/" + pageURL;
	};
	
	UrlService.prototype.getParameterByName = function(name){
		name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
		var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	    	results = regex.exec(location.search);
	    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	};
}]);
