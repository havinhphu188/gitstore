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
var LoginCtrl = ['$scope', '$state', '$mdDialog', '$translate', '$controller', '$compile',
    'commonService', 'connectService', 'translateService', 'mobileAppCoreModule', '$q', 'commonUIService',
    function($scope, $state, $mdDialog, $translate, $controller, $compile,
        commonService, connectService, translateService, mobileAppCoreModule, $q, commonUIService) {

        $scope.init = function initScope() {
            $scope.debugMode = true;
            $scope.mobileAppCoreModule = mobileAppCoreModule;
            $scope.commonUIService = commonUIService;
            $scope.name = "LoginCtrl";
            $scope.selectedProfile = undefined;
            $scope.mobileAppCoreModule.showChooseProfile = false;
            this.loginData = {};
            this.error = "";
            translateService.translate('v3.companion.login.language.placeHolder').then(
                function(text) {
                    $scope.languageLabel = text;
                }
            );
            if ($scope.debugMode) {
                /*this.loginData.iUserName = "agent111@ipos.com";
                this.loginData.iPass = "P@ssword123";*/
                this.loginData.iUserName = "mnclifeagt01@ipos.com";
                this.loginData.iPass = "P@ssword123";
            }

            //go to home page when user is already loged in
            if(sessionStorage.getItem("isLoggedIn") == "true"){
                $scope.goToHomePage();
            }
        }

        // Perform the login action
        $scope.doLogin = function() {
            console.log('logined with ticket:' + $scope.loginData.iTicket);
            $scope.error = undefined;
            var loginParams = [mobileAppCoreModule.deviceInformation, $scope.loginData.iPass, $scope.loginData.iUserName];
            mobileAppCoreModule.login_mobileApp(loginParams).then(function(data) {
                if (data.errCode == 0) {//login successfully
                    if(data.data.valid_time != 0){
	                    //Registry expired time
	                    var momentTime =  moment.duration(data.data.valid_time, 'seconds');
	                    $scope.mobileAppCoreModule.expiredTimeIn = Math.floor(momentTime.as('minutes'));
	                    var durationExpiredTime = moment.duration($scope.mobileAppCoreModule.expiredTimeIn, 'minutes');
	                    $scope.mobileAppCoreModule.expiredTime =  durationExpiredTime.get('days') + 'd ' + durationExpiredTime.get('hours') + ':' + durationExpiredTime.get('minutes');
		
	                    mobileAppCoreModule.userData = data.data.userDoc;
	                    $scope.mobileAppCoreModule.showChooseProfile = true;
	                    mobileAppCoreModule.userName = mobileAppCoreModule.findElementInElement_V3(mobileAppCoreModule.userData, ["FullName"]);
	                    $scope.listProfile = mobileAppCoreModule.findElementInElement_V3(mobileAppCoreModule.userData, ["Profile"]);
	                    
                    }else{
                         $scope.error = "Cannot get Ticket";
                    }
                } else { //got error
                    $scope.error = translateService.instant('v3.companion.login.' + data.errCode);
                }
            });
        };

        //set profile for user when login successfully
        $scope.setProfile = function setProfile() {
            if(this.selectedProfile){
                var userName = mobileAppCoreModule.findElementInElement_V3(mobileAppCoreModule.userData, ["UserName"]).$;
                mobileAppCoreModule.itemProfile = JSON.parse(this.selectedProfile);               
                
                 mobileAppCoreModule.setProfile_mobileApp(userName, mobileAppCoreModule.itemProfile['@profile-id']).then(function(data) {
                    if (data.errCode == 0) {
                        mobileAppCoreModule.userData = data.data.data.userDoc;
                        sessionStorage.setItem("isLoggedIn", "true");
                        //then goto hoem page
                        $scope.goToHomePage(); 
                        
                        //Set role for app
                        if(mobileAppCoreModule.findElementInElement_V3(mobileAppCoreModule.itemProfile, ["Role"]).Value === "S"){
                        	activeRole = "Agent Role";
                         	activeChannel = "AS"; 
                        }
                        
                        //set some configuration like database portal 
	                    var configInDB = {"autoSaveInterval":0,"multiple_session_per_user":"Yes","useTranslationDataFromDB":false,"multiple_tabs_per_session":"Yes","DEV_MODE":false,"isShowLeftSideBar":false,"cardPreview":true,"cacheUiJsonMock":false,"useUIModelFromDB":false,"config_live_time":3600000,"maxDayToRenew":7,"cacheFlg":true,"alphabet":"KfkJs9VtWXIivjLBocCDz67FemQb3wnT/xpaZgUG=HlEuA021y+NOP5RSdr4MhYq8","importQuotation":false,"cardTouchMode":false,"autoSaveNavigating":true,"retrieveTime":1468488314114};	                    
	                    commonService.options =  $.extend(true, commonService.options, configInDB);
	                    window.localStorage.setItem('ui_config', JSON.stringify(configInDB))
	                    
	                    //Get doc map definition and set data in to local storage
	                    mobileAppCoreModule.getDocmapDefinitions(undefined);
	                    
                    } else { //got error
                        $scope.error = translateService.instant('v3.companion.login.' + data.errCode);
                    }
                });
            }
        }

        $scope.goToHomePage = function() {
            $state.go('root.list.listView');
        }
        
        $scope.init();

    }
];

