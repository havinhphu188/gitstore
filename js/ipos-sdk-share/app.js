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
var sessionTimeout = -1;
var navigationApp = angular.module("navigationApp", ['urlModule', 'ngAnimate', 'coreModule','prospectUIModule', 'directiveUIModule', 'translateUIModule', 'filterUIModule', 'notificationUIModule',  "commonUIModule","ngMaterial",'configurationUIModule']);
// navigationApp.controller("NavigationCtrl", function($scope){
navigationApp.controller("NavigationCtrl", [ "$scope", "$compile", "$document", "urlService","prospectUIService", "$translate", "$translatePartialLoader", "$filter","$window", "$interval", "notificationUIService", "commonUIService", "commonService", "translateService", "$mdDialog","configurationUIService", "notificationFromServer", '$log',
                                             function($scope, $compile, $document,  urlService,prospectUIService,$translate, $translatePartialLoader, $filter, $window, $interval, notificationUIService, commonUIService, commonService, translateService, $mdDialog,configurationUIService, notificationFromServer, $log) {
	
	
	
/*	$scope.$watch(commonService.options.cardTouchMode, function() {
		if(!commonService.options.cardTouchMode){
			commonService.options.cardTouchMode = true;
		}
	   });*/
	



	$scope.contextPathTheme = angular.contextPathTheme;
	if($scope.contextPathTheme == undefined){
		$scope.contextPathTheme = Liferay.ThemeDisplay.getPathThemeRoot();
	}
	
	if (angular.element('#siteURL').length > 0) {
		var defaultLandingPage = '/web' + angular.element('#siteURL')[0].value + '/home';
		localStorage.setItem("defaultLandingPage", defaultLandingPage);
		if($window.location.pathname.split('/').length<4){
			$window.location.href = Liferay.ThemeDisplay.getPortalURL() + defaultLandingPage;
			return;
		}
	} else {
		localStorage.removeItem("defaultLandingPage");
	}
	
	$scope.mockNotification = {"MetadataDocuments":{"MetadataDocument":[{"CreatedDate":"2015-11-17 13-48-12","Description":"SC000001 has been SUBMITTED","isRead":"N","Type":"NewBusiness","RelatatedDocumentName":"SC00001","RelatatedDocumentDocId":"39815004-e2f5-42a8-94a3-cd521dd2b904"},{"CreatedDate":"2015-11-18 13-48-12","Description":"CL00001 has been CANCELED","isRead":"Y","Type":"ClaimNotification","RelatatedDocumentName":"CL00001","RelatatedDocumentDocId":"32815004-e2f5-42a8-94a3-cd521dd2b904"},{"CreatedDate":"2015-11-19 13-48-12","Description":"AP000001 has been REJECTED WITH CHANGES","isRead":"N","Type":"EcoverNote","RelatatedDocumentName":"AP00001","RelatatedDocumentDocId":"34815004-e2f5-42a8-94a3-cd521dd2b904"},{"CreatedDate":"2015-11-19 13-48-12","Description":"AP000002 has been REJECTED WITH CHANGES","isRead":"N","Type":"EcoverNote","RelatatedDocumentName":"AP00002","RelatatedDocumentDocId":"34815004-e454-42a8-94a3-cd521dd2b904"},{"CreatedDate":"2015-11-19 13-48-12","Description":"AP000002 has been REJECTED WITH CHANGES","isRead":"N","Type":"EcoverNote","RelatatedDocumentName":"AP00002","RelatatedDocumentDocId":"34815004-e454-42a8-94a3-cd521dd2b904"},{"CreatedDate":"2015-11-19 13-48-12","Description":"AP000002 has been REJECTED WITH CHANGES","isRead":"N","Type":"EcoverNote","RelatatedDocumentName":"AP00002","RelatatedDocumentDocId":"34815004-e454-42a8-94a3-cd521dd2b904"},{"CreatedDate":"2015-11-19 13-48-12","Description":"AP000002 has been REJECTED WITH CHANGES","isRead":"N","Type":"EcoverNote","RelatatedDocumentName":"AP00002","RelatatedDocumentDocId":"34815004-e454-42a8-94a3-cd521dd2b904"}]}};
	$scope.dataMockNotification = $scope.mockNotification.MetadataDocuments.MetadataDocument;
	$scope.notification = undefined;
	$scope.setTimeNofiticationCounting = 1;
	
	// go to link when click item 
	$scope.goToLink = function (url) {
		document.location = url;
	};
	
	$scope.contextVersionURL = $scope.contextPathTheme+"/views/version.jsp";

	if(typeof myArrayPortletId!='undefined'){
		$scope.portletId = myArrayPortletId[angular.portletName];
	}
	
	$scope.getNotificationCounting = function(){
		notificationUIService.getNotificationCounting_V3($scope.portletId).then(function(data) {
			if(data.length > 0 ){
				var counter = data.length;
				$('#notificationCounter').html(counter);
				$scope.listNotification = data;
				$scope.showNotificationCounter = true;
			}
		});
	};
	
	$scope.checkCounterNotification = function(){
		var lastTimeGetCounterNotifi = localStorage.getItem("timeNotificationCounterStorage");
		var date = new Date();
		date = date.setMinutes(date.getMinutes() - $scope.setTimeNofiticationCounting);
		if(date >= lastTimeGetCounterNotifi){
			return true;
		}
		return false;
	};
	
	$interval( function() {
		var flag = $scope.checkCounterNotification();
		if(flag == true && $scope.portletId != undefined){
			$scope.getNotificationCounting();
			var date = new Date();
			var milliseconds = date.getTime();
			localStorage.setItem("timeNotificationCounterStorage", milliseconds);
		}else{
			var countValue = $('#notificationCounter').html();
			if(Number(countValue)>0){
				$scope.showNotificationCounter = true;
			}
		}
	}, 5000);
	
	$scope.showNav = false;
	$scope.showIndicator = false;
	$scope.showWorkspace = false;
	$scope.showProducts = false;
	$scope.showResourceCenter = false;
	$scope.showAboutUs = false;
	$scope.showUser = false;
	$scope.currentBubblePosition = 0;
	$('#navigation').addClass("v3-nav-active");
	$('.v3-item-menu').addClass("v3-item-menu-active-scroll");
	
	//var bellNotification = $( ".user-notifications-count")[0].textContent;
	//hide notification count if there is no notification 
	/*if(bellNotification == "0"){
		$( ".user-notifications-count").hide()
	}*/
	
	//<i class="fa fa-bell fa-2x" style="line-height: 50px; margin-left: 12px;"></i>

	// go to link when click item 
	$scope.toggleNav = function () {
		
		/*dfdf*/
		if($scope.showNav == true){
			$('#navigation').removeClass("v3-nav-active");
			$('.v3-item-menu').removeClass("v3-item-menu-active");
			
			//hide all bubble
			$scope.showIndicator = false;
			$scope.showWorkspace = false;
			$scope.showProducts = false;
			$scope.showResourceCenter = false;
			$scope.showAboutUs = false;
			$scope.showUser = false;
		}
		else{
			/*$('.v3-nav-padding').addClass("v3-nav-padding-active");*/
			$('#navigation').addClass("v3-nav-active");
			//$( "#nav-toggle" ).addClass( "active" );
			$('.v3-item-menu').addClass("v3-item-menu-active");
		}
		$scope.showNav = !$scope.showNav;
    } 
	

//	  change css 
	  var changeCSS = function changeCSS(theClass, element, value) {
		    document.styleSheets[0].addRule(theClass, element + ': ' + value + ';');
		}
	  
	  //remove all hover effect when on touch device
//	  commonService.options.cardTouchMode = 'ontouchstart' in document.documentElement;
	  //commonService.options.cardTouchMode = true;
	  
	   if( commonService.options.cardTouchMode) {
	    	removeHover();
	   }


	
	//change css in menu admin
	$('#homeDockbar .container-fluid > ul').css({"float": "right"});
	$('#homeDockbar #_145_dockbar').css({"border": "0px"});
	$('#homeDockbar .container-fluid #_145_navAddControls').css({"float": "right"});
	$('#homeDockbar .container-fluid #_145_navAccountControls').css({"border": "0px"});
	$('#homeDockbar .container-fluid #_145_navAccountControls li').css({"border-bottom": "0px"});
	$('#homeDockbar .container-fluid #_145_navAccountControls').css({"padding-right": "0px"});
	
	//Format style for navigation of admin
	var counter = 0;
	$('#homeDockbar .container-fluid #_145_navAccountControls li a span').each(function(index) {
		// Remove Admin, Site text and update style icon
		if($(this).attr('class') == "nav-item-label" && $(this).text().trim() == "Admin") {
			$(this).parent().parent().find("i.icon-caret-down").removeClass("icon-caret-down").addClass("fa fa-cog fa-2x").css("line-height", "50px"); // icon for i element
			$(this).parent().attr("align", "center"); // align center for a element
			// Remove span text
			$($(this), this).remove();
			counter ++ ;
		} else if($(this).attr('class') == "nav-item-label" && $(this).text().trim() == "My Sites") {
			$(this).parent().parent().find("i.icon-caret-down").removeClass("icon-caret-down").addClass("fa fa-globe fa-2x").css("line-height", "50px");;
			$(this).parent().attr("align", "center");
			$($(this), this).remove();
			counter ++ ;
		}
		
		// Prevent loop for other element
		if(counter == 2) return false;
	});
	
	// For admin profile
    $(".user-avatar-image").remove();
    $(".user-full-name").attr('style', 'line-height: 50px;');
    $(".user-full-name").parent().parent().parent().attr('style', "width: 97px !important");
    if($("#adminNavNotification").length == 0) {
    	$(".user-notifications-count").before('<i id="adminNavNotification" class="fa fa-bell fa-2x" style="line-height: 50px; margin-left: 12px;"></i>');
    }
    $(".user-notifications-count").addClass("navAdminNotification");
    
    //hcao7  implement - single tab per session and single user per session - ADD - START
    //hcao7 - IMKI-173 - CAS + LDAP Authentication - Remove multiple session and multiple tabs - DELETE - START
    configurationUIService.loadCommonConfigFromServer();
    
    $scope.verifyLogoutCause= function (){
    	var logoutCause = window.localStorage.getItem('logoutCause');
		if(logoutCause){
			window.onbeforeunload = function(event) {
				window.localStorage.removeItem('logoutCause');
			};
			$mdDialog.show(
				      $mdDialog.alert()
				        .parent(angular.element(document.body))
						.title(logoutCause)
						.ok('Close')
				    ).then(function(){
				    	window.localStorage.removeItem('logoutCause');
					});
		}
    }
    
    $scope.listenerNotificationFromServer = function (userEmail){
    	/*
    	notificationFromServer.init(userEmail);
    	notificationFromServer.doSignOut = function(){
    		$scope.doSignOut();
    	};
	*/
    	/*
    	notificationFromServer.addEvent("SESSION_DESTROY",function(data){
    		if(notificationFromServer.isOpen()){
    			var msg=$translate.instant('v3.errorinformation.message.alert.sessionexpired');
    			window.localStorage.setItem('logoutCause',msg);
    		}    		
			$scope.doSignOut();
    	});
    	
    	notificationFromServer.addEvent("FORCE_LOGIN",function(data){
    		if(notificationFromServer.isOpen()){
    			var msg=$translate.instant('v3.errorinformation.message.alert.signinanother');
    			window.localStorage.setItem('logoutCause',msg);
    		}    		
			$scope.doSignOut();
    	});
    	
    	notificationFromServer.addEvent("INVALID_USER",function(data){
			$scope.doSignOut();
    	});
    	*/
    	
	}
   
    $scope.listenerCloseWindow = function(){
//    	if(!window.windowId){
//    		window.windowId = Math.random().toString(36).slice(2);
//    		var windowIds = localStorage.getItem('windowIds');
//    		if(windowIds){
//    			windowIds = JSON.parse(windowIds);
//    			windowIds.push(window.windowId);
//    		}else{
//    			windowIds=[window.windowId];
//    		}
//    		
//    		localStorage.setItem('windowIds',JSON.stringify(windowIds));
//    		 
//    		window.onbeforeunload = function(event) {
//    			var windowIds = localStorage.getItem('windowIds');
//    			windowIds = JSON.parse(windowIds);
//    			windowIds = windowIds.filter(function(id) {
//    				return id != window.windowId;
//    			});
//    			if(windowIds.length===0){
//    				clearUnusedCache();	
//    				$http.get(themeDisplay.getPathContext() +'/c/portal/logout');    				
//    				alert('Your Accout Will Be Loged out Before You Close Last Window?');
//    			}else{
//    				localStorage.setItem('windowIds',JSON.stringify(windowIds));
//    			}
//			};
//    		
//    	}
    }
	////hcao7 - IMKI-173 - CAS + LDAP Authentication - Remove multiple session and multiple tabs - DELETE - END
    //hcao7 implement - single tab per session and single user per session - ADD - END
    
	//replace default icon missing when upgrade to liferay 6
	$(document).ready(function(){
	    $('.icon-cog').addClass('fa fa-cog');
	    $('.icon-chevron-right').addClass('fa fa-chevron-right');
	    $('.icon-wrench').addClass('fa fa-wrench');
	    $('.icon-user').addClass('fa fa-user');
	    $('.icon-off').addClass('fa fa-power-off');
	    //$('.icon-caret-down').addClass('fa fa-caret-down');
	    $('.icon-globe').addClass('fa fa-globe');
	    $('.icon-plus').addClass('fa fa-plus');
	    $('.icon-desktop').addClass('fa fa-desktop');
	    $('.icon-edit').addClass('fa fa-edit'); 
	    $('.icon-pencil').addClass('fa fa-pencil'); 
	    $('.icon-reorder').addClass('fa fa-exchange');
	    
	    $('.icon-eye-open').addClass('fa fa-eye');	  
	    
	    
	    //remove padding left in navarbar
	    $('.navbar-inner').css('padding-left', '');
	    
	    //remove editeable navigation item name
	    $('#navigation').removeClass('modify-pages');
	    
	    if($(".portlet-layout")[1] != undefined  ){
	    	$(".portlet-layout")[1].remove();
	    }
	    //hcao7 implement - single tab per session and single user per session - ADD - START
	    //hcao7 - IMKI-173 - CAS + LDAP Authentication - Remove multiple session and multiple tabs - DELETE - START
	    var userEmail = localStorage.getItem("userEmail");
		if(userEmail){
    		$scope.listenerNotificationFromServer(userEmail);
    	}else{
    		 $scope.verifyLogoutCause();
    	}
	
		$scope.listenerCloseWindow();
	    //hcao7 - IMKI-173 - CAS + LDAP Authentication - Remove multiple session and multiple tabs - DELETE - END
	    //hcao7 implement - single tab per session and single user per session - ADD - END
	});

	
	//list box color 
	$scope.classes = ["box-prospect","box-bi","box-application","box-payment","box-document","box-document","box-prospect","box-bi","box-application","box-payment","box-document","box-document","box-payment","box-application","box-payment","box-document","box-document","box-payment","box-bi","box-application","box-payment","box-document","box-document","box-payment","box-application","box-payment","box-document","box-document","box-payment"]; 
	$scope.applicationIcon = ["fa-home","fa-archive","fa-line-chart","fa-file-text-o","fa-pencil-square","fa-archive","fa-line-chart","fa-file-text-o","fa-file-text-o","fa-file-text-o","fa-line-chart","fa-file-text-o","fa-pencil-square","fa-archive","fa-line-chart","fa-file-text-o","fa-file-text-o","fa-file-text-o","fa-file-text-o","fa-file-text-o","fa-file-text-o","fa-line-chart","fa-file-text-o","fa-pencil-square","fa-archive","fa-line-chart","fa-file-text-o","fa-file-text-o","fa-file-text-o"];
	
	$scope.boxClassWithIcon = {"fa-home":"box-role-space",
	                           "fa-archive":"box-role-space",
	                           "fa-pencil":"box-role-space",
	                           "fa-pencil-square-o":"box-role-space",
	                           "fa-male":"box-role-space",
	                           "fa-users":"box-role-space",
	                           "fa-user-secret":"box-role-space",
	                           "fa-file-text":"box-catalog",
	                           "fa-suitcase":"box-business-transaction",
	                           "fa-credit-card":"box-payment-history",
	                           "fa-shopping-cart":"box-transaction-center"}
	//toggle module
	

	
	$scope.toggleShowBubble= function(moduleName, event){
		//set new position for bubble container
		changeCSS('.bubble-container.slide-down', 'top',  event.clientY - event.offsetY + 97 + 'px !important');
		
		switch(moduleName) {
		    case "Home":
		    	$scope.showResourceCenter = false;
		    	$scope.showProducts = false;
		    	$scope.showAboutUs = false
		    	$scope.showUser = false;
		    	$scope.showWorkspace = !$scope.showWorkspace;
		    	$scope.showIndicator = $scope.showWorkspace;
		        break;
		    case "Products":
		    	$scope.showResourceCenter = false;

		    	$scope.showAboutUs = false
		    	$scope.showUser = false;
		    	$scope.showWorkspace = false;
		    	$scope.showProducts= !$scope.showProducts;
		    	$scope.showIndicator = $scope.showProducts;
		        break;
		    case "Resource":
		 
		    	$scope.showProducts = false;
		    	$scope.showAboutUs = false
		    	$scope.showUser = false;
		    	$scope.showWorkspace = false;
		    	$scope.showResourceCenter= !$scope.showResourceCenter;
		    	$scope.showIndicator = $scope.showResourceCenter;
		        break;
		    case "About":
		    	$scope.showResourceCenter = false;
		    	$scope.showProducts = false;
		    	$scope.showUser = false;
		    	$scope.showWorkspace = false;
		    	$scope.showAboutUs= !$scope.showAboutUs;
		    	$scope.showIndicator = $scope.showAboutUs;
		        break;
		    case "Login":
		    	$scope.showResourceCenter = false;
		    	$scope.showProducts = false;
		    	$scope.showAboutUs = false
		    	$scope.showWorkspace = false;
		    	$scope.showLoginBar = !$scope.showLoginBar;
		    	$scope.showIndicator = $scope.showLoginBar;
		        break;
		    case "User":
		    	$scope.showResourceCenter = false;
		    	$scope.showProducts = false;
		    	$scope.showAboutUs = false
		   
		    	$scope.showWorkspace = false;
		    	$scope.showUser= !$scope.showUser;
		    	$scope.showIndicator = $scope.showUser;
		    	
		    	var userRoleInfo = JSON.parse(localStorage.getItem("userRoleInfo"));
		    	if (userRoleInfo != null) {
		    		$scope.agentRoleList = [];
		    		$scope.customerRoleList = [];
		    		for (var i = 0; i < userRoleInfo.length; i++ ) {
		    			if (userRoleInfo[i].roleName == "Agent Group") {
		    				$scope.agentRoleList.push(userRoleInfo[i]);
		    				continue;
		    			}
		    			if (userRoleInfo[i].roleName == "Policy Owner Group") {
		    				$scope.customerRoleList.push(userRoleInfo[i]);
		    				continue;
		    			}
		    		}
		    	}
		        break;
		}
		
	}
	//click ouside bubble container to close
	$scope.hideBubbleContainer = function (){
			/*document.body.style.overflow = 'visible';*/
			$scope.showIndicator = false;
			$scope.showWorkspace = false;
			$scope.showProducts = false;
			$scope.showResourceCenter = false;
			$scope.showAboutUs = false;
			$scope.showUser = false;
			$scope.showLoginBar = false;
	}
	
	$scope.toogleLanguage = function(event){
		if(!$scope.showLanguage) {
			$('#language-v3-container').fadeIn(100);
			$scope.showLanguage = true;
			event.stopPropagation();
		} else {
			$scope.hideLanguage();
		}
	}
	$scope.hideLanguage = function(){
		$('#language-v3-container').fadeOut(100);
		$scope.showLanguage = false;
	} 
	
	/*$scope.toogleNotification=function(){
		$('#notification-v3-container').slideToggle();
	}
	$scope.hideNotification=function(){
		$('#notification-v3-container').slideToggle();
	}*/ 

	$scope.temp = "NavigationCtrl";
	$scope.prospectUIService = prospectUIService;
	$scope.gotoAboutUs = function(aboutUsURL, tabId) {
		var url = aboutUsURL + '?tabId=' + tabId;
		window.location.href = url;
	};
	$scope.gotoFundsInformation = function(FundsInformationURL, tabId) {
		var url = FundsInformationURL + '?tabId=' + tabId;
		window.location.href = url;
	};
	$scope.gotoContactUs = function(ContactsUsURL, tabId) {
		var url = ContactsUsURL + '?tabId=' + tabId;
		window.location.href = url;
	};
	$scope.gotoProduct = function(ProductSpecificationUsURL, productName) {
		var url = ProductSpecificationUsURL + '?productName=' + productName;
		window.location.href = url;
	};
	$scope.selectProduct = function(ProductURL, productTitle) {
		var url = ProductURL + '?productTitle=' + productTitle;
		window.location.href = url;
	};
	$scope.selectResource=function(resourceUrl, resourceID){
		var url = resourceUrl + '?resourceID=' + resourceID;
		window.location.href = url;
	};
	$scope.gotoPromotionProduct=function(productTitle){
		var newURL = urlService.urlMap.INDIVIDUAL_PRODUCTS + '?productTitle=' + productTitle;
		window.open(newURL, '_self');
	};
	$scope.gotoProductLaunch=function(productTitle){
		var newURL = urlService.urlMap.PRODUCT_LAUNCH + '?productTitle=' + productTitle;
		window.open(newURL, '_self');
	};
	
		$('#menuApplication-portalV3');
		$('#menuClaims-portalV3');
		$('#menuIndividualProducts-portalV3');
		$('#menuBusinessProducts-portalV3');
		$('#menuProducts-portalV3');
		$('#menuResourceCentre-portalV3');
		$('#menuAboutUs-portalV3');
		$('#menuContactUs-portalV3');
		$('#menuFunds-portalV3');
		$scope.textAndLink=[];
		$scope.textAndLink2=[];
		$scope.allSpaces=[];
		$scope.myPersonalProspectSpaces=[];
		$scope.myPersonalCustomerSpaces=[];
		$scope.myWorkAgentSpaces=[];
		$scope.myWorkCSOSpaces=[];
		$scope.myWorkUnderwriterSpaces=[];
		$scope.myWorkManagerSpaces=[];
		$scope.myWorkGroupManagerSpaces=[];
		$scope.myWorkDeathClaimSpaces=[];
		$scope.myWorkBASpaces=[];
		$scope.commonSpaces=[];
		$('#navigation .dropdown-menu').children('.divider').remove();
		$('#navigation ul .dropdown-menu').each(function(){
			$(this).css('border','none');
			var itemTotal=$(this).children('li').length;
			$(this).children('li').each(function(){
			
				if (itemTotal<=3) {
					$(this).css('display','inline-block');
					$(this).children('a').css('min-width','200px');
				}
			
			});
		});
	
		
		$('#ipos-site-page ul li a span').each(function(index){
			//get value
			var value =$(this).text().trim();
			if(value=="Application"){
				
				$(this).html("<div class='item-menu' ng-click='toggleShowBubble("+'"Home", $event'+")'  align='center'>  <i style='line-height: 50px;' class='fa fa-th fa-2x appication-icon'></i><br><div  ng-if='showWorkspace==true' class='indicator indicator-center indicator-application'></div></div> ");
				var compile=$compile($(this))($scope);	
				var par=$(this).parent();
				//get all text and link from sub menu
				i = 0;
				par.siblings('ul').children().children().each(function(){
					var object = {
							text: $(this).text(),
							link: $(this).attr('href'),
							/*icon:$(this).attr('imgIcon'),*/
							classname: $scope.boxClassWithIcon[$(this).attr('imgIcon')]!=undefined?$scope.boxClassWithIcon[$(this).attr('imgIcon')]:'box-other',
							/*iconName:$scope.applicationIcon[i]*/
							iconName: $(this).attr('imgIcon')
					};
//					$scope.textAndLink.push(object);
					$scope.allSpaces.push(object);
					if (object.text.toLowerCase().indexOf("prospect") != -1) {
						$scope.myPersonalProspectSpaces.push(object);
					}
					if (object.text.toLowerCase().indexOf("customer") != -1 &&
							object.text.toLowerCase().indexOf("customer service") == -1) {
						$scope.myPersonalCustomerSpaces.push(object);
					}
					if ((object.text.toLowerCase().indexOf("agent") != -1 
							|| object.text.toLowerCase().indexOf("sales") != -1) 
							&& object.text.toLowerCase().indexOf("prospect") == -1 
							&& object.text.toLowerCase().indexOf("customer") == -1 
							&& object.text.toLowerCase().indexOf("cso") == -1 
							&& object.text.toLowerCase().indexOf("manager") == -1
							&& object.text.toLowerCase().indexOf("group") == -1) {
						$scope.myWorkAgentSpaces.push(object);
					}
					if (object.text.toLowerCase().indexOf("cso") != -1 ||
							object.text.toLowerCase().indexOf("customer service") != -1) {
						$scope.myWorkCSOSpaces.push(object);
					}
					if (object.text.toLowerCase().indexOf("underwriter") != -1) {
						$scope.myWorkUnderwriterSpaces.push(object);
					}
					if (object.text.toLowerCase().indexOf("manager") != -1 && 
							object.text.toLowerCase().indexOf("group") == -1) {
						$scope.myWorkManagerSpaces.push(object);
					}
					if (object.text.toLowerCase().indexOf("group") != -1) {
						$scope.myWorkGroupManagerSpaces.push(object);
					}
					if (object.text.toLowerCase().indexOf("death") != -1) {
						$scope.myWorkDeathClaimSpaces.push(object);
					}
					if (object.text.toLowerCase().indexOf("business admin") != -1) {
						$scope.myWorkBASpaces.push(object);
					}
					if (object.text.toLowerCase().indexOf("mobile") != -1) {
						$scope.commonSpaces.push(object);
					}
					i++;
				});	
				$(this).parent().parent().addClass("nav-appplication");
				return;
			}
			
			if (value=="payment") {
				$(this).append("<b class='caret custom-caret'></b>");
				return;
			}
			if(value=="Claims"){
				
				$(this).html("<i class='fa fa-file-text-o fa-lg'></i> Claims <b class='caret'></b>");
				var par=$(this).parent();
				//get all text and link from sub menu
				par.siblings('ul').children().children().each(function(){
					var href = $(this).attr('href');
					if (href.indexOf("motor") != -1) {
						href = urlService.getProtocol() + "//" + urlService.getHost() + "/web"
							+ urlService.getSiteURL() + "/" + urlService.urlMap.CLAIMS + '?type=motor';
					}
					if (href.indexOf("life") != -1) {
						href = urlService.getProtocol() + "//" + urlService.getHost() + "/web"
							+ urlService.getSiteURL() + "/" + urlService.urlMap.CLAIMS + '?type=life';
					}
					var object={
							text:$(this).text(),
							link:href,
							icon:$(this).attr('imgIcon')
					};
					$scope.textAndLink2.push(object);
				});	
				//remove sub item when add all item to the array
				par.siblings('ul').remove();
				
				par.parent().addClass("claims-menu-portalV3");
				return;
			} 
			
			//user login information
			if(value=="payment"){
				var par=$(this).parent();
				par.parent().addClass("payment-portalV3");
				return;
			}
			if (value=="login detail") {
				
				$(this).html("<b>Mario Teddy</b> <img id='userLoggedinAvatar' class='face img-circle' src='{{contextPathTheme}}/images/avatar.jpg'>");
				$(this).parent().parent().addClass('userLogginControlPanel');
				$(this).parent().parent().append($('#userProfileLoggin-portalV3'));
				return;
				
			}
			if(value=="Products"){
				/*$("a").removeAttr("href");*/
				var par=$(this).parent();
			
				par.parent().addClass("products-menu-portalV3");
				
				$(this).html("<div id='products' class='item-menu' ng-click='toggleShowBubble("+'"Products" , $event'+")'  align='center'><i style='line-height: 50px;' class='fa fa-clone fa-2x menu-item-icon'></i><!--<br>Products--><div  ng-if='showProducts==true' class='indicator indicator-center'></div> </div>");
				var compile=$compile($(this))($scope);
				
				$(this).parent().parent().attr("id","products").css("display", "none");
				return;
			}			
			
			if(value=="Gen Tickets"){
				/*$("a").removeAttr("href");*/
				var par=$(this).parent();
			
				par.parent().addClass("products-menu-portalV3");
				
				$(this).html("<div class='item-menu'   align='center'><i style='line-height: 50px;' class='fa fa-ticket fa-2x menu-item-icon'></i><!--<br>Gen Tickets --></div>");
				var compile=$compile($(this))($scope);	
				return;
			} 
			
			if (value=="Resource Centre"){
				
				var par = $(this).parent();
			
				par.parent().addClass("resourceCentre-menu-portalV3 ")
				
				$(this).html("<div class='item-menu' ng-click='toggleShowBubble("+'"Resource" , $event'+")'  align='center'><i style='line-height: 50px;' class='fa fa-file fa-2x menu-item-icon'></i><!--<br>Resource--><div  ng-if='showResourceCenter==true' class='indicator indicator-center'></div> </div>");
				var compile=$compile($(this))($scope);	
				$(this).parent().parent().attr("id","resource-centre").css("display", "none");
				return;
			}
			
			if(value=="Individual Products"){
				var par=$(this).parent();
				par.parent().addClass("individualProducts-menu-portalV3");
				return;
			}
			
			if(value=="Business Products"){
				var par=$(this).parent();
				par.parent().addClass("businessProducts-menu-portalV3");
				return;
			}
			
			if(value=="About Us"){
			/*	$("a").removeAttr("href");*/
				var par=$(this).parent();
				par.parent().addClass("list-menuAboutUs-portalV3");
				
				$(this).html("<div class='item-menu' ng-click='toggleShowBubble("+'"About" , $event'+")'  align='center'><i style='line-height: 50px;' class='fa fa-info fa-2x menu-item-icon'></i><!--<br>Company--><div  ng-if='showAboutUs==true' class='indicator indicator-center'></div> </div>");
				
				// Current Page
				$(this).parent().parent().after('<li class="list-menuAboutUs-portalV3 v3-currentpage" style="border-right: none !important;line-height: 50px;"> <div class="v3-text-currenpage" id="navCurrentPage"></div></li>');
				
				var compile=$compile($(this))($scope);
				$(this).parent().parent().attr("id","about-us").css("display", "none");
				return;
			}
			
			if(value=="Home"){
				/*	$("a").removeAttr("href");*/
					var par=$(this).parent();
					var comName =  $("#comName").val();
					par.parent().addClass("list-menuAboutUs-portalV3");
					par.parent().removeAttr("href");
		/*			$(this).html("<div class='item-menu' align='center'><i style='line-height: 40px;' class='fa fa-home fa-2x menu-item-icon'></i><br><span class='menu-item-text'>Home<span> </div>");*/
					$(this).html("<div class='item-menu'  align='center'><i style='line-height: 50px;' class='fa fa-home fa-2x menu-item-icon'></i><br> <!-- <span class='menu-item-text'> Home <span> --> </div>");
					var contextPathTheme = angular.contextPathTheme;
					if(contextPathTheme == undefined){
						contextPathTheme = Liferay.ThemeDisplay.getPathThemeRoot();
					}
					// Logo
					if (comName == "CSC-Insurance"){
						$(this).parent().parent().before('<li class="list-menuAboutUs-portalV3 v3-logo" style="width: 90px !important;" role="presentation"> <div style="line-height: 46px;"><img style="height: 46px;" src='+contextPathTheme+'/images/csc-logo-no-text.png><!-- <span class="">Integral ONE</span> --></div></li>')
											 .before('<li id="menuBar" class="list-menuAboutUs-portalV3"> <a style="cursor: pointer;" > <span><div class="item-menu" align="center"><i style="line-height: 50px;" class="fa fa-home fa-2x menu-item-icon" id="icon-menu-bar"></i></span></div></span> </a> </li>');
						
					}else 
						if (comName == "MNC-General"){
							$(this).parent().parent().before('<li class="list-menuAboutUs-portalV3 v3-logo" style="width: auto !important;" role="presentation"> <div style="line-height: 46px;"><img style="height: 46px;" src='+contextPathTheme+'/my-images/LOGOMNCINSURANCE2.jpg><!-- <span class="">Integral ONE</span> --></div></li>')
									.before('<li id="menuBar" class="list-menuAboutUs-portalV3"> <a style="cursor: pointer;" > <span><div class="item-menu" align="center"><i style="line-height: 50px;" class="fa fa-home fa-2x menu-item-icon" id="icon-menu-bar"></i></span></div></span> </a> </li>');
							
						}
					else 
						if (comName == "MNC-Life"){
							$(this).parent().parent().before('<li class="list-menuAboutUs-portalV3 v3-logo" style="width: auto !important;" role="presentation"> <div style="line-height: 46px;"><img style="height: 46px;" src='+contextPathTheme+'/my-images/LOGOMNCLIFE.jpg><!-- <span class="">Integral ONE</span> --></div></li>')
									.before('<li id="menuBar" class="list-menuAboutUs-portalV3"> <a style="cursor: pointer;" > <span><div class="item-menu" align="center"><i style="line-height: 50px;" class="fa fa-home fa-2x menu-item-icon" id="icon-menu-bar"></i></span></div></span> </a> </li>');
							
						}
					var compile=$compile($(this))($scope);
					//$(this).parent().parent().attr("id","home").hide();
					$(this).parent().parent().attr("id","home").css("display", "none");
					return;
				}
			
			if(value=="Contact Us"){
				var par=$(this).parent();
				par.parent().addClass("list-menuContactUs-portalV3");
				return;
			}
			
			if(value=="Funds Information"){
				var par=$(this).parent();
				par.parent().addClass("list-menuFunds-portalV3");
				return;

			}
			if (value){
				var par = $(this).parent();
				var id = value.replace(/ /g,'');
				var itemIcon = $(this).parent().attr('imgIcon');
				if(!itemIcon || itemIcon == ""){
					itemIcon = "fa fa-file-o";
				}
				$(this).html("<div class='item-menu'   align='center'><i style='line-height: 50px;' class='" + itemIcon + " fa-2x menu-item-icon'></i><!--<br>Resource--> </div>");
				var compile=$compile($(this))($scope);	
	
				return;
			}
			

		});
		$(document).click(function(event) {
		    if (!$(event.target).closest("#menuBar").length) {
		    	if($("#icon-menu-bar").hasClass("fa-times")) {
	        		$("#icon-menu-bar").removeClass("fa-times").addClass("fa-home");
		        	$('#products').fadeOut();
		        	$('#about-us').fadeOut();
		        	$('#home').fadeOut();
		        	$('#resource-centre').fadeOut();
		        	$('#resource-centre').fadeOut();
		    	}
		    }
		    if(!$(event.target).closest("#headerLanguage").length) {
		    		$scope.hideLanguage();
		    }
		});
		
		$('#menuBar').on('click', function (e) {
			
        	$(this).children().blur();
        	if($("#icon-menu-bar").hasClass("fa-home")) {
        		$("#icon-menu-bar").removeClass("fa-home").addClass("fa-times");
	        	$('#products').fadeIn();
	        	$('#about-us').fadeIn();
	        	$('#home').fadeIn();
	        	$('#resource-centre').fadeIn();
	        	e.stoppropagation();
	        	return;
        	}
        	if($("#icon-menu-bar").hasClass("fa-times")) {
        		$("#icon-menu-bar").removeClass("fa-times").addClass("fa-home");
	        	$('#products').fadeOut();
	        	$('#about-us').fadeOut();
	        	$('#home').fadeOut();
	        	$('#resource-centre').fadeOut();
	        	e.stoppropagation();
	        	return;
        	}
        });

		// Add tooltips
		$("#navigation").hover(function() {
			$("#home").attr("data-toggle", "tooltip").attr("data-placement", "bottom").attr('data-original-title', $filter('translate')("new.v3.mynewworkspace.navigationbar.label.Home"));
			$("#products").attr("data-toggle", "tooltip").attr("data-placement", "bottom").attr('data-original-title', $filter('translate')("new.v3.mynewworkspace.navigationbar.label.Products"));
			$("#resource-centre").attr("data-toggle", "tooltip").attr("data-placement", "bottom").attr('data-original-title', $filter('translate')('new.v3.mynewworkspace.navigationbar.label.Resource'));
			$("#about-us").attr("data-toggle", "tooltip").attr("data-placement", "bottom").attr('data-original-title', $filter('translate')("new.v3.mynewworkspace.navigationbar.label.Company"));
			$("#_145_adminLinks").attr("data-toggle", "tooltip").attr("data-placement", "bottom").attr('data-original-title', $filter('translate')("new.v3.mynewworkspace.navigationbar.label.Admin"));
			$("#_145_mySites").attr("data-toggle", "tooltip").attr("data-placement", "bottom").attr('data-original-title', $filter('translate')("new.v3.mynewworkspace.navigationbar.label.MySites"));
			$("#_2_WAR_notificationsportlet_userNotifications").attr("data-toggle", "tooltip").attr("data-placement", "bottom").attr('data-original-title', $filter('translate')("new.v3.mynewworkspace.navigationbar.label.Notification"));
			$("#headerLanguage").attr("data-toggle", "tooltip").attr("data-placement", "bottom").attr('data-original-title',$filter('translate')("new.v3.mynewworkspace.navigationbar.label.Language"));
			$("#headerPayment").attr("data-toggle", "tooltip").attr("data-placement", "bottom").attr('data-original-title', $filter('translate')("new.v3.mynewworkspace.navigationbar.label.Cart"));
			$("#headerSignin").attr("data-toggle", "tooltip").attr("data-placement", "bottom").attr('data-original-title', $filter('translate')("new.v3.mynewworkspace.navigationbar.label.Signin"));
			$('[data-toggle="tooltip"]').tooltip();

		});
		

		
		
		var test1 = translateService.instant('new.v3.mynewworkspace.navigationbar.label.Resource');
		$("#resource-centre").attr("data-toggle", "tooltip").attr("data-placement", "bottom").attr("title", test1);
		
		//add event when click to Application
	/*	$(window).scroll(function(){
			$('#ipos-submenu').hide('fast');
			
			var scroll = $(window).scrollTop()			
			if(scroll > 50){
				$("#navigationContainer")[0].style.position = "fixed";
				 $("#navigationContainer")[0].style.zIndex  = "100";
			}else{
				 $("#navigationContainer")[0].style.position = "absolute";
				 $("#navigationContainer")[0].style.zIndex  = "";
			}
		})*/
		$('.payment-portalV3')
		.on('mouseenter',function(e){
				if ($(this).children('div').length==0) {
					$(this).append($('#ipos-submenu'));
				}
				
				if($('#ipos-submenu').is(":visible")==false){
					$('#ipos-submenu').show('fast');
				}
				
				 
			})
		.on('mouseleave',function(){
			$('#ipos-submenu').hide('fast');
		});
		$('.application-menu-portalV3')
			.on('mouseenter',function(e){
				if ($(this).children('div').length==0) {
					/*$(this).append($('#menuApplication-portalV3'));*/
					$(this).append($('#ipos-application'));
				}
				
				if($('#menuApplication-portalV3').is(":visible")==false){
					/*$('#menuApplication-portalV3').show('fast');*/
					$('#ipos-application').show('fast');
				}
				
				 
			})
			.on('mouseleave',function(){
				/*$('#menuApplication-portalV3').hide('fast');*/
				$('#ipos-application').hide('fast');
			});
		
		//add event when click to Claims
		
		$('.claims-menu-portalV3')
			.on('mouseenter',function(e){
				if ($(this).children('div').length==0) {
					$(this).append($('#menuClaims-portalV3'));
				}
				
				if($('#menuClaims-portalV3').is(":visible")==false){
					$('#menuClaims-portalV3').show('fast');
				}
				
				 
			})
			.on('mouseleave',function(){
				$('#menuClaims-portalV3').hide('fast');
			});
		
		$('.resourceCentre-menu-portalV3')
		.on('mouseenter',function(e){
			if($(this).children('div').length==0){
			/*	$(this).append($('#menuResourceCentre-portalV3'));*/
				$(this).append($('#ipos-resourceCenter'));
			}
			if($('#menuResourceCentre-portalV3').is(":visible")==false){
				/*$('#menuResourceCentre-portalV3').show('fast');*/
				$('#ipos-resourceCenter').show('fast');
			}
		})
		.on('mouseleave',function(){
			/*$('#menuResourceCentre-portalV3').hide('fast');*/
			$('#ipos-resourceCenter').hide('fast');
		});
		
		$('.individualProducts-menu-portalV3')
			.on('mouseenter',function(e){
				if($(this).children('div').length==0){
					$(this).append($('#menuIndividualProducts-portalV3'));
				}
				if($('#menuIndividualProducts-portalV3').is(":visible")==false){
					$('#menuIndividualProducts-portalV3').show('fast');
				}
			})
			.on('mouseleave',function(){
				$('#menuIndividualProducts-portalV3').hide('fast');
			});
		$('.businessProducts-menu-portalV3')
			.on('mouseenter',function(e){
				if($(this).children('div').length==0){
					$(this).append($('#menuBusinessProducts-portalV3'));
				}
				if($('#menuBusinessProducts-portalV3').is(":visible")==false){
					$('#menuBusinessProducts-portalV3').show('fast');
				}
			})
			.on('mouseleave',function(){
				$('#menuBusinessProducts-portalV3').hide('fast');
			});
		$('.products-menu-portalV3')
		.on('mouseenter',function(e){
			if($(this).children('div').length==0){
				/*$(this).append($('#menuProducts-portalV3'));*/
				$(this).append($('#ipos-products'));
			}
			if($('#menuProducts-portalV3').is(":visible")==false){
				/*$('#menuProducts-portalV3').show('fast');*/
				$('#ipos-products').show('fast');
			}
		})
		.on('mouseleave',function(){
			/*$('#menuProducts-portalV3').hide('fast');*/
			$('#ipos-products').hide('fast');
		});
		
		$('.list-menuAboutUs-portalV3')
		.on('mouseenter',function(e){
			if($(this).children('div').length==0){
				/*$(this).append($('#menuAboutUs-portalV3'));*/
				$(this).append($('#ipos-aboutUs'));
			}
			if($('#menuAboutUs-portalV3').is(":visible")==false){
				/*$('#menuAboutUs-portalV3').show('fast');*/
				$('#ipos-aboutUs').show('fast');
			}
		})
		.on('mouseleave',function(){
			/*$('#menuAboutUs-portalV3').hide('fast');*/
			$('#ipos-aboutUs').hide('fast');
		});
		
		$('.list-menuContactUs-portalV3')
		.on('mouseenter',function(e){
			if($(this).children('div').length==0){
				$(this).append($('#menuContactUs-portalV3'));
			}
			if($('#menuContactUs-portalV3').is(":visible")==false){
				$('#menuContactUs-portalV3').show('fast');
			}
		})
		.on('mouseleave',function(){
			$('#menuContactUs-portalV3').hide('fast');
		});
		
		$('.list-menuFunds-portalV3')
		.on('mouseenter',function(e){
			if($(this).children('div').length==0){
				$(this).append($('#menuFunds-portalV3'));
			}
			if($('#menuFunds-portalV3').is(":visible")==false){
				$('#menuFunds-portalV3').show('fast');
			}
		})
		.on('mouseleave',function(){
			$('#menuFunds-portalV3').hide('fast');
		});
	$('.userLogginControlPanel')
			/*.on('mouseenter',function(e){
			e.preventDefault();
			console.log('fire');
			$('#userProfileLoggin-portalV3').show('fast');
			})*/
		.on('mouseleave',function(){
			$('#userProfileLoggin-portalV3').hide('fast');
		});
		$('#normalUser').on('click',function(){
			if ($('#muserProfileLoggin-portalV3').is(":visible")==false) {
				$('#userProfileLoggin-portalV3').show('fast');
				
			}
		});
		$(document).click(function(event) { 
			
		});
		$scope.goToSignIn=function(){
			clearUnusedCache();
			var newURL = urlService.urlMap.LOGIN;
			window.open(newURL, '_self');
			/*var renderURL  = $scope.prospectUIService.initialResourceURL();
			renderURL.setPortletId("iposlogin_WAR_iposportletcommonportlet");
			renderURL.setPortletId("58");
			renderURL.setWindowState('pop_up');
	 		var liferayWindow = iposLiferayWindow;
			var popUpWindow = liferayWindow.getWindow(
			{
				dialog: {
				constrain2view: true,
				cssClass: 'custom.css',
				modal: true,
				resizable: false,
				width: 900,
				height: 1000,	
				centered: true,
	            draggable: false,
				}
				,id:'iposlogin_WAR_iposportletcommonportlet',
			}).plug(iposLiferayDialogIframe,{
				autoLoad: true,
				iframeCssClass: 'dialog-iframe',
				uri:renderURL.toString()
			})
			.render();
			popUpWindow.show();*/
/*			popUpWindow.titleNode.html("Login Dialog");
			var dialog = liferayWindow.getById("iposlogin_WAR_iposportletcommonportlet");
			dialog.destroy();
			*/
		};
		$scope.goToRegistration=function(){
			var newURL = "registration";
			window.open(newURL, '_self');
		};
		
		$scope.getPendingPayment = function(){
			var pendingPaymentNo = localStorage.getItem("pendingPaymentNo");
			if (pendingPaymentNo != undefined)
			return pendingPaymentNo;
			return 0;
		};
		$scope.goToShoppingCart=function(){
			var paymentURL = urlService.urlMap.SHOPPINGCART;
			var comName =  $("#comName").val();
			if(comName == "MNC-General"){
				paymentURL = urlService.urlMap.SHOPPINGCARTMNC; 
			}else if(comName==='MNC-Life'){
				paymentURL = urlService.urlMap.SHOPPING_CART_MNC_LIFE; 
			}
			
			var newURL = paymentURL + "?paymentCart=true";
			window.open(newURL, '_self');
		};
		//add Sub-menu for ResourceCentre
		$scope.gotoSubResourceCentre = function(itemMenu){
			var newURL = urlService.urlMap.RESOURCE_CENTRE + "?resourceID=" + itemMenu;
			window.open(newURL, '_self');
		}
		
		$scope.gotoFormCenter = function(){
			var newURL = urlService.urlMap.FORM_CENTER;
			window.open(newURL, '_self');
		}
		//end
		/**
		 * @author ynguyen7
		 * 2016.07.29
		 * Add more code to save the chosen role 
		 */
		$scope.goToMyProfile=function(currentRole){
			var newURL = urlService.urlMap.MYPROFILE;
			window.open(newURL, '_self');
			localStorage.setItem("currentRole",JSON.stringify(currentRole));
		};
		
		/**
		 * @author nnguyen75
		 * 2016.05.13
		 * Clear unused cache of local storage,
		 * e.g.: all list cache of dashboard portlet, user role info,
		 * user guide steps, docmap definitions...
		 */
		function clearUnusedCache() {
			Object.keys(localStorage).forEach(function(key) {
				if (/^cache/.test(key) || key === "userRoleInfo"
					|| key === "userguide" 
					|| key === "docmapDefinitions"
					|| key === "userEmail"
					|| key === "selectedProfile"
					|| key === 'loggedMessage') {
					localStorage.removeItem(key);
				}
			});
		};
		
		//hcao7 implement - single tab per session and single user per session - ADD - START
		$scope.doSignOut = function() {
			notificationFromServer.close();
			clearUnusedCache();			
			if (localStorage.getItem("defaultLandingPage") == null) {
				window.location.href = themeDisplay.getPathContext() +'/c/portal/logout';
			} else {
				window.location.href = themeDisplay.getPathContext() +'/c/portal/logout?referer=' + localStorage.getItem("defaultLandingPage");
			}
		};
		window.doSignOut = function(){
			$scope.doSignOut();
		};
		//hcao7 implement - single tab per session and single user per session - ADD - END
		$scope.loadProductDetail=function(productTitle){
			$log.debug("Load Detail Product");
			var newURL = urlService.urlMap.INDIVIDUAL_PRODUCTS + "?productTitle="+productTitle;
			window.open(newURL, '_self');
		};
		$scope.loadBusinessProductDetail = function(productTitle){
			var newURL = urlService.urlMap.BUSINESS_PRODUCTS + "?productTitle="+productTitle;
			window.open(newURL, '_self');
		};
		
		$scope.loadProductSpecifications = function(){
			var newURL = urlService.urlMap.PRODUCT_SPECIFICATIONS;
			window.open(newURL, '_self');
		};
		$scope.loadProductPromotion = function(){
			var newURL = urlService.urlMap.PRODUCT_PROMOTION;
			window.open(newURL, '_self');
		};
		$scope.loadProductLaunch = function(){
			var newURL = urlService.urlMap.PRODUCT_LAUNCH;
			window.open(newURL, '_self');
		};
		$scope.loadContactUs = function(){
			var newURL = urlService.urlMap.CONTACT_US;
			window.open(newURL, '_self');
		};
		$scope.loadAboutUs = function(){
			var newURL = urlService.urlMap.ABOUT_US;
			window.open(newURL, '_self');
		};
		$scope.loadFunds = function(){
			var newURL = urlService.urlMap.FUNDS;
			window.open(newURL, '_self');
		};	
		
		if(localStorage.getItem("language")==undefined || localStorage.getItem("language")=='undefined'
			|| localStorage.getItem("language")=='[object Object]'){
			$scope.languageCode='en';
		}else{
			$scope.languageCode=localStorage.getItem("language");
		}
		$scope.$on('pls.onLanguageChanged', function(evt, lang){
            $log.debug(evt, lang);
            if($('#languageCode').val() != lang.lang.id){
            	localStorage.setItem("language", lang.lang.id);
            	$('#languageCode').val(lang.lang.id);
            	$('#languageCode').val(lang.lang.id).trigger('change');
            }
        });
        var allLanguages = [
            {id: 'en',title: 'English',name: ' English', flagImg: 'flag UKD',flagTitle: 'English'},
            {id: 'id',title: 'Bahasa', name: ' Bahasa', flagImg: 'flag IND',flagTitle: 'Bahasa'},
        ];
        
        $scope.allLanguages = [
                               {id: 'en',title: 'English (US)',name: ' English (US)',flagImg: $scope.contextPathTheme+'/images/flags/us.png',flagTitle: 'United States', circleImg: $scope.contextPathTheme+'/images/flags/United-States.png', text:"en"},
                               {id: 'ch.traditional',title: 'Traditional Chinese (Taiwan)',name: ' 中文(台灣)',flagImg: $scope.contextPathTheme+'/images/flags/tw.png',flagTitle: 'Taiwan', circleImg : $scope.contextPathTheme+'/images/flags/Taiwan.png', text:"中文"},
                               {id: 'ch.simplify',title: 'Simplified Chinese (China)',name: ' 中文(简体)',flagImg: $scope.contextPathTheme+'/images/flags/cn.png',flagTitle: 'China', circleImg : $scope.contextPathTheme+'/images/flags/China.png',text:"中文"},
                               {id: 'id',title: 'Indonesian ',name: 'Bahasa (ID)',flagImg: $scope.contextPathTheme+'/images/flags/cn.png',flagTitle: 'Indonesia', circleImg : $scope.contextPathTheme+'/images/flags/China.png',text:"ID"},
                               {id: 'jp',title: 'Japanese ',name: '日本語 (JP)',flagImg: $scope.contextPathTheme+'/images/flags/cn.png',flagTitle: 'Japanese', circleImg : $scope.contextPathTheme+'/images/flags/China.png',text:"JP"}
                               
                               ];
        
        /**
         * @author nnguyen75
         * 2015.04.28
         * Get all available languages from ipos_portal database
         * and save it to local storage for later use.
         */
        $scope.getAvailableLanguages = function() {
        	var deferred = configurationUIService.$q.defer();

    		configurationUIService.getAvailableLanguages().then(function(allLanguages) {
    			if (commonService.hasValueNotEmpty(allLanguages)
    					&& commonService.hasValueNotEmpty(allLanguages.allLanguages)) {
    				$scope.allLanguages = allLanguages.allLanguages;
    				localStorage.setItem("allLanguages", JSON.stringify(allLanguages));
    			}
    			deferred.resolve(allLanguages);
    		});
    		
    		return deferred.promise;
        };
        $scope.getAvailableLanguages();
    
        $scope.getCurrentLanguage = function() {
        	var currentId = '';
        	if (localStorage.getItem("language") == undefined || localStorage.getItem("language") == 'undefined' || localStorage.getItem("language") == '[object Object]') {
        		var comName =  $("#comName").val();
    			if (comName == "MNC-General"){
    				currentId = 'id';
    			} else if(comName==='MNC-Life'){
    				currentId = 'id';
    			} else {
    				currentId = 'en';
    			}
    			localStorage.setItem("language", currentId);
            } else {
            	currentId = localStorage.getItem("language");
            }
        	for(var i = 0; i< $scope.allLanguages.length; i++){
                var lang = $scope.allLanguages[i];
                if(lang.id == currentId) {
                	return lang;
                }
            }
        };
        
        $scope.currentSelectedLanguage = $scope.getCurrentLanguage();
        
        $scope.changeLanguage = function(id) {
        	
         	localStorage.setItem("language", id);
         	$translatePartialLoader.addPart('translation'); 
    		$translate.refresh();
     		$translate.use(id);
     		
     		var languageId = "en_US";
     		if(id.indexOf('ch') > -1) {
     			languageId = 'zh_CN';
     		}
     		//var url = window.location.origin + "/" + languageId + "/" + (window.location.pathname).substring(7);
        	//window.open(url, '_self');
     		//var url = Liferay.ThemeDisplay.getPathMain() + "/portal/update_language?p_l_id="+ themeDisplay.getPlid() + "&redirect=" + window.location.pathname + "&languageId=" + languageId;
     		var url = Liferay.ThemeDisplay.getPathMain() + "/portal/update_language?p_l_id=" + Liferay.ThemeDisplay.getPlid() + 
     		"&redirect=" + window.location.pathname + "&languageId=" + languageId + "&showUserLocaleOptionsMessage=false";
     		
     		//var url =  window.location.origin +"/" + languageId + window.location.pathname
     		$window.open(url, '_self');
     	/*	var url =window.location.href;
     		var newUrl = url;
     		if(url.indexOf('zh_CN') < 0 && url.indexOf('en_US') < 0)
 			{
     			newUrl = window.location.origin + "/" + languageId + window.location.pathname;
 			} else {
 				newUrl = window.location.origin + "/" + languageId + "/" + (window.location.pathname).substring(7);
 			}
     		
        	window.open(newUrl, '_self'); */
        };
        
        // Get language for current page in navigation bar
        $scope.getLocalLanguage = function(key) {
        	var language = null;
	        if($scope.currentSelectedLanguage.id == 'ch.simplify') {
	        	language = {"Home":"首页","ResourceCentre":"資源中心","Products":"产品展示","MyHome":"我的家","MyWorkspace":"我的工作区","UserProfile":"用户资料","MyContent":"我的内容","BusinessCatalogs":"企业目录","MobileAccentTicket":"移动口音票","PaymentCenter":"支付中心","TransactionCenter":"交易中心"};
	        } else if($scope.currentSelectedLanguage.id == 'ch.traditional') {
        		language = {"Home":"首頁","ResourceCentre":"資源中心","Products":"產品展示","MyHome":"我的主頁","MyWorkspace":"我的工作欄","UserProfile":"請登錄","MyContent":"我的內容","BusinessCatalogs":"企業目錄","MobileAccentTicket":"移動口音票","PaymentCenter":"支付中心","TransactionCenter":"交易中心"};
	        } else if($scope.currentSelectedLanguage.id == 'jp') {
	        	language = {"Home":"ホーム","ResourceCentre":"リソース","Products":"商品","MyHome":"My Home","MyWorkspace":"My Workspace","UserProfile":"User Profile","MyContent":"My Content","BusinessCatalogs":"ビジネスカタログ","MobileAccentTicket":"Mobile Accent Ticket","PaymentCenter":"Payment Center","TransactionCenter":"取引センター"};
	        } else {
	        	// Default English
	        	language = {"Home":"Home","ResourceCentre":"Resource Centre","Products":"Products","MyHome":"My Home","MyWorkspace":"My Workspace","UserProfile":"User Profile","MyContent":"My Content","BusinessCatalogs":"Business Catalogs","MobileAccentTicket":"Mobile Accent Ticket","PaymentCenter":"Payment Center","TransactionCenter":"Transaction Center"};
	        }
        	return language[key];
        };
        
        $scope.plsModel = {
            languages40: allLanguages,
            languages30: [],
            languages20: [],
            languages10: []
        };
        for(var i=0;i<allLanguages.length;i++){
            var lang = allLanguages[i];
            if(i<10){
                $scope.plsModel.languages10.push(lang);
            }
            if(i<20){
                $scope.plsModel.languages20.push(lang);
            }
            if(i<30){
                $scope.plsModel.languages30.push(lang);
            }
        }
	//end
		//align Admin menu to right
		var test12=$('.nav')[2];
		$(test12).addClass('ipos_docbar_align');
		$('.icon-user').addClass('ipos_icon_user_margin');
		
		//hide menu when scroll
		$(window).scroll(function(){
			$('#ipos-aboutUs').hide('fast');
			$('#ipos-products').hide('fast');
			$('#ipos-resourceCenter').hide('fast');
			$('#ipos-application').hide('fast');
		});
		//set selected active class
		var link =$(location).attr('href');
		if (link.indexOf('contact-us')!=-1) {
			$('#navigation ul li a span').each(function(){
				var value =$(this).text().trim();
				if (value=="About Us") {
					$(this).parent().parent().addClass('selected active');
				}
			});
		}
		else if(link.indexOf('funds-information')!=-1){
			$('#navigation ul li a span').each(function(){
				var value =$(this).text().trim();
				if (value=="Resource Centre") {
					$(this).parent().parent().addClass('selected active');
				}
			});
		}
		else if(link.indexOf('individual-products')!=-1 ||link.indexOf('business-products')!=-1
				||link.indexOf('product-specifications')!=-1){
			$('#navigation ul li a span').each(function(){
				var value =$(this).text().trim();
				if (value=="Products") {
					$(this).parent().parent().addClass('selected active');
				}
			});
		}
		else if(link.indexOf('my-home')!=-1) {
			$("#navCurrentPage").text($scope.getLocalLanguage("MyHome"));
		}
		else if(link.indexOf('home')!=-1) {
			$("#navCurrentPage").text($scope.getLocalLanguage("Home"));
		}
		else if(link.indexOf('resource-centre')!=-1) {
			$("#navCurrentPage").text($scope.getLocalLanguage("ResourceCentre"));
		}
		else if(link.indexOf('products')!=-1) {
			$("#navCurrentPage").text($scope.getLocalLanguage("Products"));
		}
		else if(link.indexOf('new-my-workspace')!=-1) {
			$("#navCurrentPage").text($scope.getLocalLanguage("MyWorkspace"));
		}
		else if(link.indexOf('user-profile')!=-1) {
			$("#navCurrentPage").text($scope.getLocalLanguage("UserProfile"));
		}
		else if(link.indexOf('my-content')!=-1) {
			$("#navCurrentPage").text($scope.getLocalLanguage("MyContent"));
		}
		else if(link.indexOf('business-catalogs')!=-1) {
			$("#navCurrentPage").text($scope.getLocalLanguage("Business Catalogs"));
		}
		else if(link.indexOf('error-information')!=-1) {
			$("#navCurrentPage").text($scope.getLocalLanguage("Error Information"));
		}
		else if(link.indexOf('mobile-accent-ticket')!=-1) {
			$("#navCurrentPage").text($scope.getLocalLanguage("MobileAccentTicket"));
		}
		else if(link.indexOf('paymentCart')!=-1) {
			$("#navCurrentPage").text($scope.getLocalLanguage("PaymentCenter"));
		}
		else if(link.indexOf('transaction-center')!=-1) {
			$("#navCurrentPage").text($scope.getLocalLanguage("TransactionCenter"));
		}
		
		// Hide current doc info if width window < 992px
		var navDocInfo = $('#navDocInfo')[0];
		if($(window).width() < 992){
			if(navDocInfo != undefined) {
				$('#navDocInfo')[0].style.display = "none";
			}
			// Style for admin
			if($("#isGroupAdmin").html() == "true") {
				$("#_145_navTag").css("display", "none");
				$("#_145_navAddControls").css("display", "none");
				$(".icon-cog").remove();
				$(".icon-globe").remove();
				
				$("#_145_navAccountControls").addClass("nav-admin-config");
				$(".user-avatar-link").css("width", "100%");
				$(".user-full-name").css("display", "block");
			}
        } else {
        	if(navDocInfo != undefined) {
        		$('#navDocInfo')[0].style.display = "block";
        	}
        }
		
		// Navigation bar combine one line if width < 768
		if($(window).width() < 600) {
			var application = $('.nav-appplication');
			var logo = $('.v3-logo');
			logo.attr('style', 'width: 156px !important;');
			$('.nav-cart').before(logo).before(application);
			$('#main-menu-bar').remove();
			var compile=$compile($('.nav-username'))($scope);
		}
		$scope.toogleNotification=function(){
			// set counter notification to 0 and hide 
	    	notificationUIService.removeNotificationCounting_V3($scope.portletId).then(function(data) {
	    		var counter = data.replace(/[^0-9]/g, ''); // remove ""
				$scope.showNotificationCounter = false;
				$('#notificationCounter').html(counter);
	    	});
			$('#notification-v3-container').slideToggle();
		}
		$scope.hideNotification=function(){
			$('#notification-v3-container').slideToggle();
		}
} ]);

var tabPageApp = angular.module("tabPageApp", []);
tabPageApp.controller("TabPageCtrl", [ "$scope", function($scope) {

} ]);

