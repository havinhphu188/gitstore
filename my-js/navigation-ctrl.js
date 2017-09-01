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
var NavigationCtrl = ['$scope', '$log', '$state','$interval', 'commonService', 'commonUIService','mobileAppCoreModule', "$translate", "$translatePartialLoader", "translateService", '$locale', '$injector',
              function($scope, $log, $state,$interval, commonService, commonUIService, mobileAppCoreModule, $translate, $translatePartialLoader, translateService, $locale, $injector) {
	$scope.commonUIService = commonUIService;
	$scope.name = 'NavigationCtrl';
	$scope.mobileAppCoreModule = mobileAppCoreModule;
	
	$scope.myWorkAgentSpaces = [{"text":"Sales Hub","link":"sales-hub","classname":"box-role-space","iconName":"fa-archive","onCLick":"goToSalesHub()"},{"text":"Sales Catalog","link":"sales-transaction-catalog-agent","state":"root.list.detail","classname":"box-catalog","iconName":"fa-file-text","onCLick":"BusinessCatalog()"},{"text":"Business Case","link":"business-case-agent","classname":"box-business-transaction","iconName":"fa-suitcase","onCLick":"goToBusinessCase()"},{"text":"Payment History","link":"payment-history-agent","classname":"box-payment-history","state":"root.list.paymentHistory","iconName":"fa-credit-card","onCLick":""},{"text":"Synchonize","state":"root.list.sync","classname":"box-other","iconName":"fa-refresh","onCLick":""}];
	$scope.hideAllNavigationSide = function(){
		$scope.isNavigationLeft = false;
		$scope.isNavigationRight = false;
		$scope.isToggleCollapseMenu = false;
		$("#toggleCollapseMenu").collapse('hide');
	}
	
	$scope.goToListView = function(item){
		if(sessionStorage.getItem("isLoggedIn") == "false" || sessionStorage.getItem("isLoggedIn") == null)
			return null;
		if(item.state === "root.list.sync" || item.state === "root.list.paymentHistory"){
			$state.go(item.state);
		}else if(item.state === "root.list.detail"){ 
			$state.go('root.list.detail', {docType: 'case-management', ctrlName: "BusinessCatalogDetailCtrl"});
		}else{
			$state.go('root.list.listView', {link:item.link});
		}
		
		$scope.hideAllNavigationSide();
	}
	
	$scope.doLogout = function(){
		$scope.hideAllNavigationSide ();

        //This code for expired time
        //Start
        var userName = mobileAppCoreModule.findElementInElement_V3(mobileAppCoreModule.userData, ["UserName"]).$
        var validTime = moment.duration($scope.mobileAppCoreModule.expiredTimeIn, 'minutes');
        if(userName != undefined && validTime != undefined){
            mobileAppCoreModule.updateValidTime_mobileApp(userName, validTime.as('seconds')).then(function(data) {
                if (data.errCode == 0) {//update successfully
                    console.log('Valid_time has updated');
                } else { //got error
                    console.log('Can not update valid_time, errCode: ' + data.errCode);
                }
            });
        }else{
            console.log('Can not update valid_time');
        }
        $scope.mobileAppCoreModule.expiredTimeIn = undefined;
        //End

        $scope.mobileAppCoreModule.userData = undefined;
        $scope.mobileAppCoreModule.userName = undefined;
        $scope.mobileAppCoreModule.showChooseProfile = false;
		sessionStorage.removeItem("isLoggedIn");
		$state.go('root.list.login');
	}


    $scope.goToPayment = function(){
    	if(sessionStorage.getItem("isLoggedIn") == "false" || sessionStorage.getItem("isLoggedIn") == null)
			return null;
    	var stateParam = {
    			  "docType": "agent-payment",
    			  "ctrlName": "TransactionMNCDetailCtrl",
    			  "htmlUrl": "",
    			  "docId": "",
    			  "productName": "",
    			  "businessType": "",
    			  "userRole": "",
    			  "saleChannel": ""
    			};
        $state.go('root.list.detail', stateParam);
    }
//lpham24
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

    	$scope.allLanguages = [ {id: 'en',title: 'English (US)',name: ' English (US)',flagImg: $scope.contextPathTheme+'/images/flags/us.png',flagTitle: 'United States', circleImg: $scope.contextPathTheme+'/images/flags/United-States.png', text:"en"},
                                       {id: 'ch.traditional',title: 'Traditional Chinese (Taiwan)',name: ' 中文(台灣)',flagImg: $scope.contextPathTheme+'/images/flags/tw.png',flagTitle: 'Taiwan', circleImg : $scope.contextPathTheme+'/images/flags/Taiwan.png', text:"中文"},
                                       {id: 'ch.simplify',title: 'Simplified Chinese (China)',name: ' 中文(简体)',flagImg: $scope.contextPathTheme+'/images/flags/cn.png',flagTitle: 'China', circleImg : $scope.contextPathTheme+'/images/flags/China.png',text:"中文"},
                                       {id: 'id',title: 'Indonesian ',name: 'Bahasa (ID)',flagImg: $scope.contextPathTheme+'/images/flags/cn.png',flagTitle: 'Indonesia', circleImg : $scope.contextPathTheme+'/images/flags/China.png',text:"ID"},
                                       {id: 'jp',title: 'Japanese ',name: '日本語 (JP)',flagImg: $scope.contextPathTheme+'/images/flags/cn.png',flagTitle: 'Japanese', circleImg : $scope.contextPathTheme+'/images/flags/China.png',text:"JP"}

                                       ];
    //This function to countdown valid time
    $interval( function() {
        if($scope.mobileAppCoreModule.expiredTimeIn != undefined){
             $scope.mobileAppCoreModule.expiredTimeIn--;
             if($scope.mobileAppCoreModule.expiredTimeIn < 0) {
                 $scope.mobileAppCoreModule.expiredTime =  '0d 00:00';
                 $scope.mobileAppCoreModule.expiredTimeIn = undefined;
                 $scope.doLogout();
             } else {
	             var durationExpiredTime = moment.duration($scope.mobileAppCoreModule.expiredTimeIn, 'minutes');
	             $scope.mobileAppCoreModule.expiredTime =  durationExpiredTime.get('days') + 'd ' + durationExpiredTime.get('hours') + ':' + durationExpiredTime.get('minutes');
             }
        }else{
             $scope.mobileAppCoreModule.expiredTime =  '0d 00:00';
        }
    }, 60000);

    $scope.getCurrentLanguage = function(id){
        for(var i = 0; i< $scope.allLanguages.length; i++){
            var lang = $scope.allLanguages[i];
            if(lang.id == id) {
               return lang;
            }
        }
    }


    //lpham24 save aand load language to device
    $scope.saveLanguage = function(id){
      mobileAppCoreModule.save_Language_MobileApp(id).then(function(data){
                if(data.errCode === "0"){
                    $scope.changeLanguage(id);
                }
      });
    }
    $scope.changeLanguage = function(id) {
     	$translatePartialLoader.addPart('translation'); 
		$translate.refresh();
 		$translate.use(id);
 		$scope.currentSelectedLanguage = $scope.getCurrentLanguage(id);
 		$scope.hideLanguage();
    };

    
    $scope.getConfigMobileApp = function() {
        var language = "id";
    	mobileAppCoreModule.get_config_MobileApp().then(function(data) {
    		switch (data.data) {
	        	case 'id':
	        		language = "id";
	        		break;
	        	case 'en':
	        	//case 'vi':
	        		language = "en";
	        		break;
	        	case 'jp':
	        		language = "jp";
	        		break;
	        	case 'ch.simplify':
	        		language = "ch.simplify";
	        		break;
	        	case 'ch.traditional':
	        		language = "ch.traditional";
	        		break;
	        	default:
	        		language = "en";
    		}
    		$scope.changeLanguage(language);
        });		
    };

   setTimeout(function() {
       $scope.getConfigMobileApp();
   }, 1000);

}];