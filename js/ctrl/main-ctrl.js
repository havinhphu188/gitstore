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

var MyNewWorkspaceCtrl = ['$scope', '$compile', '$state', '$filter', '$document', '$http', '$log', '$timeout', '$interval', 'ajax', 'urlService', 'uiRenderPrototypeService', 'prospectUIService', 'prospectPersonalUIService', 'commonService', '$translate', '$translatePartialLoader', 'multiUploadService','fileReader','$upload','commonUIService', 'policyUIService', 'claimUIService', 'clientUIService', 'claimNotificationUIService', 'illustrationUIService', 'salecaseUIService', 'loadingBarService', 'uiFrameworkService', '$mdDialog',
    function($scope, $compile, $state, $filter, $document, $http, $log, $timeout, $interval, ajax, urlService, uiRenderPrototypeService, prospectUIService, prospectPersonalUIService, commonService, $translate, $translatePartialLoader, multiUploadService,fileReader,$upload,commonUIService, policyUIService, claimUIService, clientUIService, claimNotificationUIService, illustrationUIService, salecaseUIService, loadingBarService, uiFrameworkService, $mdDialog) {
    
    var portletId = myArrayPortletId["my-new-workspace"];
    $scope.initContextPath = contextPathRoot;
    $scope.moduleProspectPersonalService = prospectPersonalUIService;
    $scope.illustrationUIService = illustrationUIService;    
    $scope.commonService = commonService;
    $scope.commonUIService = commonUIService;
    $scope.resourceURL = prospectUIService.initialPortletURL(myArrayPortletId["my-new-workspace"]);
    $scope.fileReaderService=fileReader; //View file
    $scope.fileReaderService.portletId=portletId;
    $scope.multiUploadService = multiUploadService; 
    $scope.portletId = myArrayPortletId["my-new-workspace"];
    $scope.contextPathTheme = angular.contextPathTheme;
    $scope.fileReaderService = fileReader;
    $scope.parseInt = parseInt;
    $scope.contextPath = '';
    
    try{
    	$scope.contextPath = contextPath;
    }catch(e){}
    
	//lpham24 check unable two button in show pdf
    $scope.checkEnableButtonPdf = undefined;
    if (typeof standAloneWebappType != 'undefined') {
        $scope.checkEnableButtonPdf = standAloneWebappType;
    }
    
    $scope.uiFrameworkService = uiFrameworkService;
     

    document.addEventListener("touchstart", function(){}, true);

    
    if($(window).width() > 500){
        $scope.maxTrimTextTitle = "50"; 
    } else {
        $scope.maxTrimTextTitle = "20";
    }
    
    scrollTop(0);//Scroll to top when first access portlet 
    
    $(document).on('change', '#language', function() {
        $translatePartialLoader.addPart('translation');
        $translate.refresh();
        $translate.use($('#languageCode').val());
    });
    
    // go to state and ctrl
    $scope.goToState = function goToState(stateName, params, option) {        
        var sParams = params ? JSON.stringify(params) : '[no params]';
        $log.debug("You went to state: " + stateName + ' with params: ' + sParams);
        return $state.go(stateName, params, option);
    };
    
    if($(window).width() > 1680){
        $scope.v3LiveCard = "col-xs-6 col-sm-4 col-md-4 col-lg-2";
    } else{
        $scope.v3LiveCard = "col-xs-6 col-sm-4 col-md-4 col-lg-3";
    }
    
    //force reload state
    $scope.forcedGoToState = function forcedGoToState(stateName, params) {
        return this.goToState(stateName, params, {reload: true});
    }; 
    
    
    $scope.testName = "ALG";
    $scope.imgSrc = $scope.initContextPath + "/images/useravatar.png";
    


    $scope.closeExpandedMenu = function() {
        $('#controlbar').hide();
        $('#left-sidebar').hide();
        $('#relatedDoc').hide();
        $('#showMore').hide();
//        $scope.closeRelatedDoc();
    }
  /* $scope.showRelatedDoc = function($event) {
        var currentTarget = $event.target.parentElement;
        var appendObject = "<div id='relatedDoc' class='animated slideInUp margin-left-0 relatedDoc'>" +
            "<div ng-include='initContextPathRelatedDoc_mock'></div>" +
            "</div>";
        var compile = $compile(appendObject)($scope);
        angular.element(currentTarget).after(compile);
        angular.element(document.getElementsByClassName('float-action')[0]).hide();
    }*/
//    $scope.closeRelatedDoc = function($event) {
//
//        $('#relatedDoc').removeClass('animated slideInUp').addClass('animated slideOutDown');
//        var delay = function() {
//            angular.element(document.getElementById('relatedDoc')).remove();
//            angular.element(document.getElementsByClassName('float-action')[0]).show();
//        }
//        setTimeout(delay, 700);
//    };

    $scope.toggleText = function($event) {
        var txtClasses = document.getElementsByClassName('txt');
        var mobileMode = document.getElementsByClassName('mobile-mode');
        var controlbar = document.getElementById('controlbar');
        var leftSidebar = document.getElementById('left-sidebar');
        
        if(angular.element(mobileMode[0]).css('display') == 'none'){
            angular.element(mobileMode).css('display','block');
            setStateSiderbar($event, true);
        }
        if (angular.element(txtClasses[0]).css('display') == 'none') {
            angular.element(txtClasses).css('display', 'inline-block');            
            $scope.sideIcon = true;
            setStateSiderbar($event, false);
            $('[data-toggle="popover"]').popover('disable');
            $('[data-toggle="popover"]').tooltip('disable');
        } else {
            angular.element(txtClasses).css('display', 'none');
            angular.element(controlbar).css('display', 'none');
            angular.element(leftSidebar).css('display', 'none');
            $scope.sideIcon = false;
            if($(window).width() < 768){
                angular.element(mobileMode).css('display','none');
            }            
            setStateSiderbar($event, false);
            $('[data-toggle="popover"]').popover('enable');
            $('[data-toggle="popover"]').tooltip('enable');
        }  
    };
    
    function setStateSiderbar($event, flag){
        if(flag==false)
            $($event.currentTarget).closest('.menu-module').children('li').each(function(){$(this).removeClass('ipos_sidemenu_background');});
        else
            $($event.currentTarget).addClass('ipos_sidemenu_background');
    };
    
    /**
     * noted by dnguyen98: toggle left-side-bar
     */
    $scope.toggleAllBar = function() {
        var txtClasses = document.getElementsByClassName('txt');
        var controlbar = document.getElementById('controlbar');
        var leftSidebar = document.getElementById('left-sidebar');
        angular.element(txtClasses).css('display', 'none');
        angular.element(controlbar).css('display', 'none');
        angular.element(leftSidebar).css('display', 'none');
        $('[data-toggle="popover"]').popover('enable');
        $('[data-toggle="popover"]').tooltip('enable');
        $scope.sideIcon = false;
//        $scope.closeRelatedDoc();
        if (angular.element($('#showMore')[0]).css('display') != 'none') {
            commonUIService.showHideItems();
        }
        $('.menu-module').children('li').each(function(){$(this).removeClass('ipos_sidemenu_background');});
       
    };
    
    $scope.toogleElement = function(id, quickNavigationToggle) {
        $('.' + id).slideToggle("slow");
    };

    if (localStorage.getItem("language") == undefined || localStorage.getItem("language") == 'undefined' || localStorage.getItem("language") == '[object Object]') {
        $scope.languageCode = 'en';
    } else {
        $scope.languageCode = localStorage.getItem("language");
    }
    $scope.$on('pls.onLanguageChanged', function(evt, lang) {
        $log.debug(evt, lang);
        if ($('#languageCode').val() != lang.lang.id) {
            localStorage.setItem("language", lang.lang.id);
            $('#languageCode').val(lang.lang.id);
            $('#languageCode').val(lang.lang.id).trigger('change');
        }
    });
    var allLanguages = [{
        id: 'en',
        title: 'English',
        name: ' English',
        flagImg: 'flag UKD',
        flagTitle: 'English'
    }, {
        id: 'id',
        title: 'Bahasa',
        name: ' Bahasa',
        flagImg: 'flag IND',
        flagTitle: 'Bahasa'
    }, ];
    $scope.plsModel = {
        languages40: allLanguages,
        languages30: [],
        languages20: [],
        languages10: []
    };
    for (var i = 0; i < allLanguages.length; i++) {
        var lang = allLanguages[i];
        if (i < 10) {
            $scope.plsModel.languages10.push(lang);
        }
        if (i < 20) {
            $scope.plsModel.languages20.push(lang);
        }
        if (i < 30) {
            $scope.plsModel.languages30.push(lang);
        }
    }
    
/*    $scope.showMore = function($event) {
        $log.debug("Clicked on action bar of : " + this.name);

        var currentTarget = $event.currentTarget.parentElement.parentElement;
        var showMore = document.getElementById('showMore');
        if (showMore == null) {
            var appendObject = "<div id='showMore'>" +
                "<div ng-include='initContextPathShowMore_mock'></div>"+
            "</div>";
            var compile = $compile(appendObject)($scope);
            angular.element(currentTarget).after(compile);
            $('#showMore').addClass('animated fadeIn');
        } else {
            $('.show-more').removeClass('animated fadeIn').addClass('animated fadeOut');
            var delay = function() {
                angular.element(showMore).remove();
            }
            setTimeout(delay, 1000);
        }
    }*/

   /*$scope.showNationalityDemo = function($event) {
        //get current level of clicked DOM
        var levels = ['level-1', 'level-2', 'level-3', 'level-4', 'level-5'];
        var classesOfCurrentDOM = $event.currentTarget.getAttribute('class').split(' ');
        var currentLevel = $scope.currentLevel;
        var currentBackgroundColor = getComputedStyle($event.currentTarget).getPropertyValue("background-color");
        var curentLevelIndex = levels.indexOf(currentLevel);
        var childLevel = levels[curentLevelIndex + 1];
        var isChildOpened = false;
        isChildOpened = document.getElementsByClassName(childLevel).length > 0 ? true : false;
        var arrowPositionX = $event.currentTarget.offsetLeft + ($event.currentTarget.offsetWidth / 2.4);
        var arrowPositionY = $event.currentTarget.offsetTop + $event.currentTarget.offsetHeight + 11;

        if (!isChildOpened) {
            var currentOffsetTop = $event.currentTarget.parentElement.parentElement.offsetTop;
            var temp = [];
            var check = true;
            var objectOfSameLevel = document.getElementsByClassName("v3-height");
            var objectLength = objectOfSameLevel.length;
            for (var i = 0; i < objectLength; i++) {
                if (objectOfSameLevel[i].offsetTop == currentOffsetTop) {
                    temp.push(objectOfSameLevel[i])
                }
            }
            $scope.child = childLevel;
            $scope.child2 = childLevel;
            var appendObject = "<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12 level-2-wrapper'>" +
                "<div class='box-detail wrapper-detail md-whiteframe-z3 " + $scope.child +
                "'> <div class='container-fluid' ng-include='nationality_mock' ></div></div>" +
                "</div>";
            var compile = $compile(appendObject)($scope);
            angular.element(temp[temp.length - 1]).after(compile);
            $('#arrow').css('left', arrowPositionX + 'px');
            $('#arrow').css('top', arrowPositionY + 'px');
            $('#arrow').css('box-shadow', currentBackgroundColor + ' 1px -1px 3px -1px');
        } else {
            var parentOfChild = document.getElementsByClassName(childLevel)[0].parentElement;
            angular.element(parentOfChild).remove();
        }
        //append child div to the next row of clicked DOM    

    }*/

    //***** FOR GENERAL SETUP CONFIGURATION****

    $scope.printDebugInfo = function printDebugInfo() {
        uiFrameworkService.printDebugInfo(this);
    };
    //moved touiframework service
    $scope._printDebugInfo = function printDebugInfo() {
        $log.debug(this.name + " is initialized...");
    };

    $scope.init = function init() {
        var self = this;

        self.name = "MyNewWorkspaceCtrl";

        self.printDebugInfo();
        
        //keep track the actionBarEle
        self.html = {};//stores html reference
        self.$state = $state;//reference to ui-router $state
        self.vars = {
            "currPortletId" : undefined,
            "isShowLeftSidebar" : true,//is showing left side bar, default is "true"
        };//stores data use for child ctrl
    };
    $scope.init();

    $scope.doSigningFinishAction = function doSigningFinishAction(){
    	var deferred = uiRenderPrototypeService.$q.defer();
    	if (sessionStorage.getItem("workstepId") !== "null" && commonService.hasValueNotEmpty(sessionStorage.getItem("workstepId"))) {
        	var resourceURL = salecaseUIService.initialMethodPortletURL(myArrayPortletId["my-new-workspace"], "getResponseAfterSign");
        	resourceURL.setParameter("workstepid", sessionStorage.getItem("workstepId"));
        	ajax.getRuntime(resourceURL.toString(), "", function(result) {
        		if (result.workstepInfo.workstepFinished === "1") {
        			if (commonService.hasValueNotEmpty(result.fileName)) {
        				self.unsignedFields = result.workstepInfo.unsignedFields;
	        			resourceURL = salecaseUIService.initialMethodPortletURL(myArrayPortletId["my-new-workspace"], "updateResourceAfterSign");
	        			resourceURL.setParameter("workstepid", sessionStorage.getItem("workstepId"));
	        			ajax.getRuntime(resourceURL.toString(), "", function(result) {
	        				if (salecaseUIService.isSuccess(result)) {
	        					$log.debug("Update resource successfully.");
	        					if(self.unsignedFields == 0){
		        					var resourceFiledId = salecaseUIService.findElementInElement_V3(result, ["DocId"]);
		        					var caseDataObject = sessionStorage.getItem(sessionStorage.getItem("workstepId"));
		        					if (commonService.hasValueNotEmpty(caseDataObject)){
			        					var caseData = JSON.parse(caseDataObject);
			        					var caseManagementId = caseData.DocId;
			        					var resourceType = caseData.ResourceType;
			        					var product = caseData.Product;
			        					var businessType = caseData.CaseName;
			        					var actionParams = [caseManagementId, resourceFiledId, resourceType, product, businessType];
			        					salecaseUIService.updateSignedStatus($scope.resourceURL, actionParams).then(function(data){
			        						deferred.resolve(true);
			        					});
		        					} else {
		        						deferred.resolve(true);
		        					}
	        					} else {
	        						deferred.resolve(true);
	        					}
	        				} else {
	        					$log.error("Update resource unsuccessfully!!!");
	        					deferred.resolve(true);
	        				}
	        			});
        			} else {
        				deferred.resolve(true);
        			}
        		} else {
        			deferred.resolve(true);
        		}
        	});
        }
    	return deferred.promise;
    };

    $scope.signDocument = function(readerService, card, controllerInCharge) {
        var self = this;
        if (window.cordova) {
            var caseID = salecaseUIService.findElementInDetail_V3(['DocInfo', 'DocId']);
        	salecaseUIService.signDocumentOnMobileApp(card.metadata, caseID).then(function(data){
                if(data.code === "signed"){
                    commonUIService.showNotifyMessage("v3.mynewworkspace.message.document.print.AlreadySigned","success");
                } else if(data.code === "permission"){
                    commonUIService.showNotifyMessage("v3.mynewworkspace.message.document.print.permission","fail");
                } else if(data.code === "finish_done" || data.code === "SIGNED_ALL"){
                    salecaseUIService.getDetail_V3(self.resourceURL).then(function(){
                        if(controllerInCharge != undefined) {
                            var uiStructureRoot = controllerInCharge.uiStructureRoot;
                            uiRenderPrototypeService.reSetupConcreteUiStructure(uiStructureRoot, salecaseUIService.detail, self.resourceURL);
                        }
                    });
                }
            });
        } else {
            salecaseUIService.signDocument(readerService, card, commonUIService);
        }
    };
    
    /*
    document.addEventListener('visibilitychange', function(){
    	if(document.visibilityState == 'hidden') {
            // page is hidden
        } else {
            // page is visible
        	if($scope.isRunOnTablet() && !window.cordova){
        		$scope.reloadPageAfterSigned();
        	}
        }
	});
    
    $scope.reloadPageAfterSigned = function reloadPageAfterSigned(){
    	var URLOfSigningFinishActionOnTablet = localStorage.getItem("URLOfSigningFinishActionOnTablet");
    	if(!URLOfSigningFinishActionOnTablet) {
    		setTimeout(function(){ reloadPageAfterSigned(); }, 5000);
    		return false;
    	}
    	localStorage.removeItem("URLOfSigningFinishActionOnTablet");
    	var params={};URLOfSigningFinishActionOnTablet.replace(/[?&]+([^=&]+)=([^&]*)/gi,function(str,key,value){params[key.toLowerCase()] = value;});
		var workstepID = params["workstepid"];
		var caseData = JSON.parse(localStorage.getItem(workstepID));
    	if(caseData && caseData.CaseLoading){
//    		location.reload();
    		loadingBarService.showLoadingBar();
    		window.location = URLOfSigningFinishActionOnTablet;
    	}
    };
    */
    /**
     * setup some common variable and behavior for controller have datamodel (ipos v3 document)
     * NOTE: need to have detail in 'moduleService' when calling this function
     *
     * For screen doesn't have datamodel (payment, configuration screen,...)
     * Please call setupCtrlWithoutDetail()
     * 
     * @param  {String} ctrlName        name of the ctrl
     * @param  {Object} moduleService   UIService
     * @return {Object}                 Angular Promise, success when got uiStructure
     */
    $scope.generalConfigCtrl = function generalConfigCtrl (ctrlName, moduleService) {
        return uiFrameworkService.generalConfigCtrl(ctrlName, moduleService, this);
    }
    //moved to uiFramework service
    $scope._generalConfigCtrl = function generalConfigCtrl (ctrlName, moduleService) {

        /**
         * We came to this function through 3 ways:
         * - New document (on document screen)
         * - Open existing document (on document screen)
         * - Open existing document (on other screen, like from case)
         */
        
        var self = this;
        self.name = ctrlName;
        self.moduleService = moduleService;
        // self.moduleService.businessType = businessType;
        var defer = self.moduleService.$q.defer();
        //var refDocType = self.getRefDocTypeFromParams();
        var refDocType, businessType, userRole, saleChannel;

        if(!self.moduleService){
            $log.error('moduleService of ctrl: ' + ctrlName + " isn't declared");
            return;
        }

        self.printDebugInfo();

        // var refDocType = self.moduleService.name;
        // if (self.moduleService.product !='' && self.moduleService.product != undefined){
        //     refDocType = self.moduleService.name + ';product=' + self.moduleService.product;
        // }
        // var productInfor = self.getCurrProductInfor();

        //case open this module screen directly, the detail has been loaded before coming here
        if(self.$state.params.docType === self.moduleService.name){
        // if(self.getParentRefDoctype(refDocType) === undefined){
        // if(productInfor.refDocType === undefined){
            refDocType = self.getRefDocTypeFromParams();
            businessType = $state.params.businessType;
            userRole = commonUIService.getActiveUserRole();
            saleChannel = commonUIService.getActiveSaleChannel();

            if(!self.moduleService.detail)
                $log.error('moduleService.detail (ctrl: ' + self.name + ") isn't declared");

            //setup uiStructure of this docType
            self.setupUiStructure(
                {   'refDocType': refDocType, 
                    'businessType': businessType, 
                    'userRole': userRole, 
                    'saleChannel': saleChannel,
                    'docId': $state.params.docId
                }, 
                self.moduleService.detail)
            .then(function hadSetupUiStructure () {
        
                //keep track ctrl                
                self.registerToHistoryCtrl();
                self.triggerAutoSaveLoop();

                defer.resolve();
            });
        }
        //open from other module, uiRenderPrototypeService has taken care of creating uiStructures
        else{
        
            //keep track ctrl
            self.registerToHistoryCtrl();
            self.triggerAutoSaveLoop();
            var productInfor = self.getCurrProductInfor();
            refDocType = productInfor.refDocType;
            businessType = productInfor.businessType;
            defer.resolve();
        }


        //TODO: merge promise of action bar into the return promise
        self.setupActionBar(refDocType, businessType);

        return defer.promise;

    };

    /**
     * setup some common variable and behavior for screen doesn't have datamodel (payment, configuration screen,...)
     * 
     * @param  {String} ctrlName        name of the ctrl
     * @param  {Object} refDocType      current refDocType of this ctrl
     * @param  {String} businessType    [description]
     * @return {Object}                 Angular Promise, success when got uiStructure
     */
    $scope.setupCtrlWithoutDetail = function setupCtrlWithoutDetail (ctrlName, refDocType, userType, businessType, userRole, detail) {
        return uiFrameworkService.setupCtrlWithoutDetail(ctrlName, refDocType, userType, businessType, userRole, detail, this);
    }
    //moved to uiframwork service
    $scope._setupCtrlWithoutDetail = function setupCtrlWithoutDetail (ctrlName, refDocType, userType, businessType, userRole, detail) {

        /**
         * We came to this ctrl through 3 ways:
         * - New document (on document screen)
         * - Open existing document (on document screen)
         * - Open existing document (on other screen, like from case)
         */
        
        var self = this;
        self.name = ctrlName;
        var defer = uiRenderPrototypeService.$q.defer();
        

        self.printDebugInfo();

        //TODO: merge promise of action bar into the return promise
        self.setupActionBar(refDocType, businessType);

        //case open this module screen directly, the detail has been loaded before coming here
        if(self.getParentRefDoctype(refDocType) === undefined){
            //setup uiStructure of this docType
            self.setupUiStructure(
                {   'refDocType': refDocType, 
                    'businessType': businessType, 
                    'userRole': commonUIService.getActiveUserRole()
                }, detail).then(function hadSetupUiStructure () {
                //keep track ctrl                
                self.registerToHistoryCtrl();

                defer.resolve();
            });
        }
        //open from other module, uiRenderPrototypeService has taken care of creating uiStructure
        else{
            //keep track ctrl
            self.registerToHistoryCtrl();
            defer.resolve();
        }
            

        return defer.promise;

    };

    /**
     * add this ctrl to history
     * @return {[type]} [description]
     */
    $scope.registerToHistoryCtrl = function registerToHistoryCtrl () {
        uiFrameworkService.registerToHistoryCtrl(this);
    }
    //moved to uiframework service
    $scope._registerToHistoryCtrl = function registerToHistoryCtrl () {
        var uiStructureRoot = undefined;

        //get the link children uiStructure from the last selected obj (which has been loaded successfully)
        if(this.viewProp.historySelect.length > 0){
            uiStructureRoot = this.viewProp.historySelect.lastObj().refUiStructure.linkCUiStructure;
        }
        //if historySelect is empty --> get the main current uiStructure
        else{
            uiStructureRoot = this.uiStructureRoot;
        }

        this.isMainCtrl = {};//indicate this ctrl is main-ctrl of the view, using for getAssociateUiStructureRoot()
        this.uiStructureRoot = uiStructureRoot;//setup uiStructureRoot for this uiStructure
        
        //keep track ctrl
        this.viewProp.historyCtrl.push({
            "ctrl": this, 
            "uiStructureRoot" : uiStructureRoot
        });
    }

    /**
     * Setup HTML for action bar and its controller
     */
    $scope.setupActionBar = function setupActionBar (refDocType, businessType) {
    	if(this.uiFrameworkService.isSectionLayout(this.viewProp)){
    		uiFrameworkService.setupSidePanelDS(refDocType, businessType, this);
    		uiFrameworkService.setupBottomPanelDS(refDocType, businessType, this);
    	} else {
    		uiFrameworkService.setupActionBar(refDocType, businessType, this);
    	}
    }
    //moved to uiFramework service
    $scope._setupActionBar = function setupActionBar (refDocType, businessType) {
        var self = this;
        //var fileName = self.moduleService.name.replace(/-/g, "_");
        uiRenderPrototypeService.getActionBarHtml(refDocType, businessType).then(function gotHtml(html){
            $log.debug("Render action bar with ctrl: " + self.name);
            var a = $.parseHTML(html.data);
            var saveButtonEle = $(a).find(".fa-floppy-o").parent();
            saveButtonEle.addClass("activate-spiner");
            var ngClick = saveButtonEle.attr("ng-click");            
            ngClick = 'uiStructureRoot.isDetailChanged && ' + ngClick;
            var ngClass = "{'common-action-disabled': !uiStructureRoot.isDetailChanged}"
            
            saveButtonEle.attr('ng-click', ngClick);
            saveButtonEle.attr('ng-class', ngClass);
            
            var compiledActionBar = $compile(a)(self);
            self.html.actionBarEle = angular.element('action-bar');
           
            //for issue can not compile action bar when switch between modules
            if(self.html.actionBarEle.length > 1){
                self.html.actionBarEle.splice(1, 1);
            }
            //remove all children
            //nle32: clear content of action bar
            $("action-bar").empty();
            /*var children = self.html.actionBarEle.children();
            for(var i = 0; i < children.length; ++i){                
              children.remove();  
            }*/
            
            self.html.actionBarEle.append(compiledActionBar);
            $('#showMore').fadeOut();
        });
    };

    /**
     * For debug purpose, this function will be called when developing
     */
    $scope.showAlert = function showAlert (message, type, timeout) {
        if(!message)
            message = "v3.mynewworkspace.message.showAlertWasCalled";

        commonUIService.showNotifyMessage(message, type, timeout);
    };

    $scope.alwaysTrue = function alwaysTrue () {
        return true;
    };

    $scope.alwaysFalse = function alwaysFalse () {
        return false;
    };

    //----------------General functions which can be called from jsonMock----------------
    /**
     * call findElementInDetail_V3 underlying
     * @param elementsChain is an array of of elements' names
     * Example: ['prospect','fullname','firstname']
     * @return an element which is equals to the last element's name in @elementsChain
     */
    $scope.findElementInDetail = function findElementInDetail(elementChains) {
        return this.moduleService.findElementInDetail_V3(elementChains);
    };

    $scope.hasValueNotEmpty = function hasValueNotEmpty(value) {
        return commonService.hasValueNotEmpty(value);
    };
    //----------------********----------------
    
    /**
     * return the card's data given card name
     * @param  {String} cardName    name of card (which is associated with the current ctrl-in-charge)
     * If 'cardName' is undefined, will return the current card of this scope
     * @param  {bool}   bDeepSearch search in linking document (salecase link to illustration)
     * @return {Object}          [description]
     */
    $scope.getCardDataWithName = function getCardDataWithName (cardName, bDeepSearch) {
        var result = this.card;//default result is the current card of this scope
        if(cardName){
            var uiStructureRoot = this.getAssociateUiStructureRoot();
            result = uiRenderPrototypeService.findUiStructureWithName(uiStructureRoot, cardName, bDeepSearch);
        }
        return result;
    };
    
    $scope.getCardMetadata = function getCardMetadata(cardName){
        var uiStructure = this.getCardDataWithName(cardName);
        return uiStructure ? uiStructure.metadata : undefined;
    };

    
    /**
     * show or hide action cards of a card with name
     * @param {String}  cardName  [description]
     * @param {Boolean} isVisible [description]
     */
    $scope.setVisibleActionCards = function setVisibleActionCards (cardName, isVisible) {
        var uiStructure = this.getCardDataWithName(cardName);
        if(uiStructure)
            uiRenderPrototypeService.setVisibleActionCards(uiStructure, isVisible);
    };
    
    /**
     * Set visible for a card
     * @param {String}  cardName        name of card need to set visible
     * @param {Boolean} isVisible       true will show the action cards, false will remove it
     */
    $scope.setVisibleCard = function setVisibleCard (cardName, isVisible) {        
        var uiStructure = cardName ? this.getCardDataWithName(cardName) : this.card;

        if(uiStructure){
            uiRenderPrototypeService.setVisibleCard(uiStructure, isVisible);

            //setup its theme when it's already appear in screen
            if(isVisible && uiStructure.scope ){ 
                var result = uiStructure.scope.setCssLeafCard();

                //if false, wait again to setup css again
                if(!result){
                    var intervalId = $interval(function() {
                        result = uiStructure.scope.setCssLeafCard();
                        
                        if(result)
                            $interval.cancel(intervalId);
                    }, 10);//set 10ms loop
                }
            }
        }
    };
    
    $scope.forceUpdateCardDetailChanged = function forceUpdateCardDetailChange (card) {
    	card.isDetailChanged = true;
    	uiRenderPrototypeService.updateParentDetailChanged(card);
    };

    $scope.addActionCardToUiStructure = function addActionCardToUiStructure (cardName) {
        var uiStructure = this.getCardDataWithName(cardName);
        if(uiStructure)
           uiStructure.addActionCards();
    };

    $scope.isCardStatusValid = function isCardStatusValid (cardName) {
        var uiStructure = this.getCardDataWithName(cardName);
        if(uiStructure)
           return uiRenderPrototypeService.getValidStatus(uiStructure) === commonService.CONSTANTS.DOCUMENT_STATUS.VALID ? true : false;
    };
    

    /**
     * Return the parent refDocType of this controller
     * Ex: If opening propsect in case screen, prospectDetailCtrl using this function will get 'case-management'
     * @param  {String} currRefDoctype        current refDocType
     * @return {String}                       refDocType of parent ctrl, or undefined if doesn't have any yet
     */
    $scope.getParentRefDoctype = function getParentRefDoctype (currRefDoctype) {
        if(!$scope.viewProp)
            return undefined;

        for (var i = 0; i < $scope.viewProp.historySelect.length; i++) {
            if($scope.viewProp.historySelect[i].refDocType.indexOf(currRefDoctype) !== -1){
                if(i === 0)
                    return undefined;
                else
                    return $scope.viewProp.historySelect[i - 1].refDocType;
            }
        };

        return undefined;
    };
    //moved to ui framework
    $scope._getRefDocTypeFromParams = function getRefDocTypeFromParams () {
        var result = $state.params.docType;
        var product = $state.params.productName ? ";product=" + $state.params.productName : "";
        return result + product;
    };

    /**
     * The caller ctrl can be anywhere, use this function to find the main ctrl in charge (eg: Case, illustration, application,...)
     * @return {Object} Main ctrl in charge
     */
    $scope.getCtrlInCharge = function getCtrlInCharge () {
        return uiFrameworkService.getCtrlInCharge(this);
    };
    $scope._getCtrlInCharge = function getCtrlInCharge () {
        var mainCtrl = this;
        while(mainCtrl.hasOwnProperty('isMainCtrl') !== true){
            mainCtrl = mainCtrl.$parent;
            if(!mainCtrl)
                break;
        }

        return mainCtrl;
    };

    /**
     * The caller ctrl can be anywhere, use this function to find the main ctrl's parent in charge 
     * (eg: Application will result case,...)
     * @return {Object} Main ctrl's parent in charge
     */
    $scope.getParentCtrlInCharge = function getParentCtrlInCharge () {
        var mainCtrl = this.getCtrlInCharge();

        if(!mainCtrl)
            return undefined;

        var pCtrl = mainCtrl.$parent;
        while(pCtrl){
            if(pCtrl.hasOwnProperty('isMainCtrl') === true){                
                break;
            }
            pCtrl = pCtrl.$parent;
        }

        //mainCtrl is parent, return undefined
        if(!pCtrl){
            return undefined;
        }

        return pCtrl;
    };

    /**
     * return the uiStructure root associate with the current ctrl in charge
     * @return {Object} uiStructure
     */
    $scope.getAssociateUiStructureRoot = function getAssociateUiStructureRoot () {
        if(this.viewProp){
            //we find the main ctrl
            //Cause children ctrl can call this function
            //--> Can identify the result
            //We only find the first isMainCtrl
            var mainCtrl = this.getCtrlInCharge();
            
            var historyCtrl = this.viewProp.historyCtrl;
            //find the current ctrl in historyCtrl
            for (var i = 0; i < historyCtrl.length; i++) {
                
                //mainCtrl.$parent can be null when the scope is destroyed
                if(mainCtrl === null){
                    //in this case, temporary using ctrl name
                    if(historyCtrl[i].ctrl.name === this.name)
                        return historyCtrl[i].uiStructureRoot;
                }
                else{
                    if ( historyCtrl[i].ctrl === mainCtrl){
                        return historyCtrl[i].uiStructureRoot;
                    }
                }
            };
        }

        return undefined;
    }

    /**
     * @see {code sidebar.html}
     */
    $scope.showLeftSidebar = function showLeftSidebar () {
        this.vars.isShowLeftSidebar = true;
    }

    /**
     * @see {code sidebar.html}
     */
    $scope.hideLeftSidebar = function hideLeftSidebar () {
        this.vars.isShowLeftSidebar = false;
    }

    /**
     * Return the current product information which the controller is processing
     * @return {Object} [description]
     */
    $scope.getCurrProductInfor = function getCurrProductInfor() {
        var result = {
            parentRefDocType: undefined,//refDocType of the parent document
            rootRefDocType: undefined,//refDocType of the root document (the main opening doctype)
            refDocType: undefined,//refDocType of the detail
            businessType: undefined//which type of business it's processing
        };

        var uiStructureRoot = this.getAssociateUiStructureRoot();

        if(uiStructureRoot){              
            result.refDocType = uiStructureRoot.docParams.refDocType;

            //refDocType can different, but businessType has to be the same with the current main ctrl
//            result.businessType = this.viewProp.historyCtrl[0].uiStructureRoot.businessType;
            result.businessType = uiStructureRoot.docParams.businessType;
        }

        return result;
    };


    /**
     * initalize uiStructure for this controller (need to have the associate detail from runtime)
     * 
     * @param  {String}     docParams       parameters relative to a doctype, include:
     *                           {String}   refDocType      doctype with product
     *                           {String}   businessType    business type (renewal, new_business)
     *                           {String}   userRole        agent role (underwriter, agent,...)
     *                           {String}   saleChannel     channel of sale (direct, agent, bance,..)
     * @param  {Object}     detail     v3 iPOS document
     */
    
    $scope.setupUiStructure = function setupUiStructure (docParams, detail) {
        return uiFrameworkService.setupUiStructure(docParams, detail, this);
    }
    $scope._setupUiStructure = function setupUiStructure (docParams, detail) {
        var self = this;

        //TODO: need to match those 2 value
        if(docParams.businessType === 'NewBusiness')
            docParams.businessType = commonService.CONSTANTS.ACTIONTYPE.NEWBUSINESS;

        var defer = uiRenderPrototypeService.$q.defer();

        //init only one time (called from $state of ui-router)
        if(self.viewProp){
            defer.resolve();
        }else{
            //init variables for render cards on screen
            self.viewProp = {
                //viewObject: store data to display cards on the screen
                viewObject: [], //a table structure, array 2D, reflect the tree structure of uiStructure 
                viewUiEles: undefined, //list of uiElements. Use for screen show HTML form directly

                //stores history of selecting card (with other associate information)
                //historySelect's selectLevel will lower than viewObject 1 unit
                historySelect: [],

                historyObjTmpl: {
                    'index': undefined,//the order of card has been clicked (in a row)
                    'refUiStructure': undefined,//reference to correspondent uiStructure
                    'refDocType': undefined,//keep current doctype of select 
                    'refChildHtml': undefined,//keep the ref to the current drawing of HTML form 
                    'childScope': undefined//keep the ref to the current angular controller of HTML form 
                },//template object for historySelect

                historyCtrl: []//keep track the ctrl when generating action-bar
            };

            //refDocType is empty, use inaormation from moduleService
            uiRenderPrototypeService.createConcreteUiStructure(
                self.resourceURL, detail, docParams)
            .then(function hadUiStructure (uiStructureRoot) {            
                self.uiStructureRoot = uiStructureRoot;

                //uiStructureRoot won't appears on screen, need to find the children to display
                uiRenderPrototypeService.getChildContentOfUiStructure(uiStructureRoot)
                .then( function gotResult (result) {
                    if(uiRenderPrototypeService.isUiStructureObj(result[0])){
                        self.viewProp.viewObject.push(result);
                    }
                    //currently NOT support HTML static
                    else{
                        self.viewProp.viewUiEles = result;
                        $log.debug("Render HTML form");
                    }
                    
                    //User Guide: if this card is the first time access, it will show User Guide popover for Card
                    $timeout(function() {
                        $scope.moduleProspectPersonalService.tourGuideFirstLoginForUser(self.uiStructureRoot.name.split(':')[1], $scope.portletId);
                    }, 1000);
                    
                    //continue last working space (direct sale)
                    if(localStorage.getItem("isContinueLastWorking")){
                        setTimeout(function(){ self.moveToCards(); }, 2000);
                    }
            
                    defer.resolve();
                });
                
                $scope.checkLoadBreadCrum();

            });
        }
        
        return defer.promise;
    };


     /**
     * Using this functions everytime need to re-associate the detail with uiStructure
     * Ex: After computing, the output in detail will be changed 
     * --> need to call this fn so the display of element with "counter" can be refresh
     * When success, the new "detail" will be binded with current uiStructure of this doctype
     * @param  {Object} detail ipos v3 json dataset
     * @param  {boolean} expectedDetailChanged expected state of isDetailChanged after reSetup, default is false
     */
    $scope.reSetupConcreteUiStructure = function reSetupConcreteUiStructure (detail, expectedDetailChanged, removeTemplateChildren) {
        return uiFrameworkService.reSetupConcreteUiStructure(detail, this, expectedDetailChanged, removeTemplateChildren);
    }
    
    $scope._reSetupConcreteUiStructure = function reSetupConcreteUiStructure (detail) {
        //find the current uiStructure of this ctrl.
        var uiStructureRoot = this.getAssociateUiStructureRoot();

        if(uiStructureRoot){
            // uiRenderPrototypeService.removePreviewFields(uiStructureRoot);
            uiRenderPrototypeService.reSetupConcreteUiStructure(uiStructureRoot, detail, this.resourceURL, expectedDetailChanged);
        }
        
    };

    /**
     * Create new document for this docType and navigate to its screen
     * @param  {String} docType     [description]
     * @param  {String} productName [description]
     * @param  {String} caseName    [description]
     * @return {Object}              Angular Promise, iposV3Doc if success
     */
    
    $scope.createNewDocument = function createNewDocument(docType, productName, businessType, caseName, moreParams) {
        var self = this;
        var uiService = uiRenderPrototypeService.getUiService(docType);
        if(!uiService.product){
            uiService.product = productName;
        }
        var deferred = uiService.$q.defer();
        var promise = undefined;

        //init empty moreParams obj
        moreParams = moreParams ? moreParams : {};
       
        if(docType == commonService.CONSTANTS.MODULE_NAME.SALECASE 
            // && businessType !== commonService.CONSTANTS.ACTIONTYPE.NEWBUSINESS){
            && businessType !== 'NewBusiness'){
            
            if (businessType!== "endorsement" && businessType !== 'renewal')
                promise = uiService.createCaseWithAction(self.resourceURL, businessType, moreParams.policyNum, moreParams.effectiveDate);
            else if(businessType == 'renewal'){ // temporarily fix to do renewal 
                var productForRenew = productName.indexOf("motor")!== -1 ? "VPM":productName;
                promise = uiService.getPolicyDocWithAction(self.resourceURL, 'renewal' , moreParams.policyNum, productForRenew, moreParams.effectiveDate);
            }
            else{
                uiService.product = productName;
                var businessTypeForCreateCase = "ENDORSEMENT";
                if(productName == "guaranteed-cashback-saver"){
                    businessTypeForCreateCase = "PolicyServicing";
                }
                promise = uiService.createCaseWithAction(self.resourceURL, businessTypeForCreateCase, moreParams.policyNum, moreParams.effectiveDate);
            } 

        }else if(docType == commonService.CONSTANTS.MODULE_NAME.CLAIM_NOTIFICATION){
            uiService.policyParams = moreParams;
            uiService.docType = undefined;
            promise = uiService.initializeObject_V3(self.resourceURL, docType, caseName);
        }else
            promise = uiService.initializeObject_V3(self.resourceURL, docType, productName, caseName);
        
        promise.then(function gotDetail(detail){
            
            uiFrameworkService.isOpenedDetail = false;
            //If got detail, move to another state
            if(commonService.hasValueNotEmpty(detail)){

                var saleChannel = commonUIService.getActiveSaleChannel();
                if(docType === commonService.CONSTANTS.MODULE_NAME.SALECASE ){
                    var caseEle = uiRenderPrototypeService.findElementInElement_V3(detail, ['CaseManagement']);
                    if(caseEle)
                        caseEle['@channel'] = saleChannel;
                }

                if(uiService.name === commonService.CONSTANTS.MODULE_NAME.FACTFIND)
                    uiRenderPrototypeService.findElementInElement_V3(detail, ['DocInfo'])['DocName'] = uiService.genDefaultName();

                self.goToState(
                    'root.list.detail', {
                        "docType": docType, 
                        "productName": productName,  
                        "businessType" : businessType, 
                        "userRole" : moreParams.userRole ? moreParams.userRole : commonUIService.getActiveUserRole(),
                        "saleChannel" : saleChannel, 
                        "ctrlName": undefined,
                        "gotDetail": true
                    }
                ).then(function () {                    
                    deferred.resolve(detail);
                });
            }
            else{
                commonUIService.showNotifyMessage("v3.transactioncenter.message.Errorhasoccured");
                $log.error('Cant get detail');
            }                        

        });
        return deferred.promise;
    };


    //mock function to get policy detail
   // $scope.openPolicyDocument = function (doctype, docId, productName) { 
      //  if(productName == "Private Vehicle M"){
         //   policyUIService.product = "motor_private_car_m_as";
      //  }
      //  else{
         //   policyUIService.product = productName;
      //  }
       
      //  policyUIService.getDocumentDetail_V3($scope.resourceURL, docId).then(function() {
         //   this.goToState('root.list.detail', {docType: doctype, docId: docId});
      //  });
   // }
    
    
    $scope.openDocumentFromMetaList = function openDocumentFromMetaList(metaCard) {       
        
        //load full loading while waiting render uiStructure    
        $('#ipos-full-loading').show();
        
        if (JSON.stringify(metaCard) == '{}') {
            return this.createNewDocument('prospect', undefined, undefined, undefined);
        }
        var docType = metaCard.DocType;
        if (docType == commonService.CONSTANTS.MODULE_NAME.UNDERWRITING && commonService.hasValue(metaCard.Product) && metaCard.Product == "motor-private-car-m-as") {
            //keep old uw for motor product (don't have time to change for new uw doc)
            metaCard.Product = "motor-uw";
            metaCard.CaseName = "";
        } else if (docType == commonService.CONSTANTS.MODULE_NAME.UNDERWRITING && commonService.hasValue(metaCard.Product) 
        		&& (metaCard.Product == commonService.CONSTANTS.PRODUCT.TRAVEL_EXPRESS || metaCard.Product == commonService.CONSTANTS.PRODUCT.GROUP_TRAVEL_EXPRESS)) {
        	metaCard.CaseName = "";
        }
        var docId = metaCard.DocId;
        if (docType != "group-department") {
            var product = metaCard.Product;
        } else {
            var product = metaCard.ProductCd;
        }
        var clientId = metaCard.Client_Number;
        var effectiveDate = undefined;
        var isNeedEdit = true; 
        
        //TODO: don't know where it's from
        if(metaCard.Contract_Number){
            docType = commonService.CONSTANTS.MODULE_NAME.POLICY;
            docId = metaCard.Contract_Number;
            product = metaCard.Contract_Type;
            effectiveDate = metaCard.Effective_Date;
            isNeedEdit = false;
        }
        if(metaCard.claimId){
            docType = commonService.CONSTANTS.MODULE_NAME.CLAIM;
            docId = metaCard.claimId;
            product = metaCard.cnttype;
            isNeedEdit = false;
        }
        if(metaCard.Client_ID){
            docType = commonService.CONSTANTS.MODULE_NAME.CLIENT;
            docId = metaCard.Client_ID;
            product = metaCard.Client_Type;
            isNeedEdit = false;
        }
        if(metaCard.ClaimNo){
            docType = commonService.CONSTANTS.MODULE_NAME.CLAIM_NOTIFICATION;
            product = metaCard.productName;
            isNeedEdit = false;
        }        
        if(docType == commonService.CONSTANTS.MODULE_NAME.FACTFIND && !commonService.hasValueNotEmpty(docId)) {
            return this.createNewDocument('factfind', undefined, undefined, undefined);
        }
        
        if(metaCard.CaseName && docType != 'underwriting'){
        	if(docType != 'client-payment'){
        		docType = commonService.CONSTANTS.MODULE_NAME.SALECASE;
        	}
        		
            product = metaCard.Product;
            switch(metaCard.CaseName){
            case ('NewBusiness'):
                var businessType = "NewBusiness";
                break;
            case ('Endorsement'):
                var businessType = "endorsement";
                break;
            case ('Renewal'):
                var businessType = "renewal";
                break;
            case ('PolicyServicing'):
                var businessType = "PolicyServicing";
                break;
            }
        }
        if(docType == 'client-payment'){
	    	var params = {
	            docType: docType,
	            docId: docId,
	            clientId: clientId,
	            effectiveDate: effectiveDate,
	            businessType: businessType,
	            userRole: commonUIService.getActiveUserRole(),
	            isNeedEdit: isNeedEdit
	        };
        }
        else{
            var params = {
                docType: docType,
                docId: docId,
                productName: product,
                clientId: clientId,
                effectiveDate: effectiveDate,
                businessType: businessType,
                userRole: commonUIService.getActiveUserRole(),
                transactionType: metaCard.CaseName,
                isNeedEdit: isNeedEdit
            };        	
        }

        // Show current doctype for navigation bar
        $("#navCurrentDocType").html($translate.instant('v3.navigation.label.docType.' + docType));

        //checkSigningFinishAction
        function checkSigningFinishAction(self, params){
        	if (sessionStorage.getItem("workstepId") !== "null" && commonService.hasValueNotEmpty(sessionStorage.getItem("workstepId"))) {
        		self.doSigningFinishAction().then(function(result) {
        			return self.openDocument(params);
        		});
        	}else{
        		return self.openDocument(params);
        	}
        }
//        return this.openDocument(params);
        return checkSigningFinishAction(this, params);
    }
    /**
     * open document for this doctype and navigate to this screen
     * @param  {String}     docType         [description]
     * @param  {String}     docId           [description]
     * @param  {String}     productName     [description]
     * @param  {String}     clientId        [description]
     * @param  {boolean}    isNeedEdit      if true, will get document edit
     * @return {Object}              Angular Promise, iposV3Doc if success
     */
    $scope.openDocument = function openDocument(params) { 
        var self = this;           
        var uiService = uiRenderPrototypeService.getUiService(params.docType); 
        var deferred = uiService.$q.defer();
        var promise = undefined;
        var mockDetail = false;
        
        params.userRole = params.userRole ? params.userRole : commonUIService.getActiveUserRole();

        var saleChannel = commonUIService.getActiveSaleChannel();
        $scope.multiUploadService.init();//reset file selected list to 0;
        scrollTop(0);//Scroll to top when get Document details; 

        switch(params.docType){
            case commonService.CONSTANTS.MODULE_NAME.CLAIM:
                if(params.productName == "VPM") {
                    params.productName = "motor_private_car_m_as";
                }
                break;
            case commonService.CONSTANTS.MODULE_NAME.POLICY:
                uiService.policyType = params.productName;
                uiService.effectiveDate = params.effectiveDate;
                if(params.productName == "VPM"){ // || productName == "Personal Accident - Individual"
                    params.productName = "motor_private_car_m_as";
                    uiService.product = "motor-private-car-m-as";
                    uiService.policyType = "VPM";
                }
                else{
                   uiService.product = params.productName;
                }
                // uiService.POContacts = uiService.findElementInDetail_V3(['policy-motor-private-car-m-as:PolicyOwner','person:Contact']);
    //             uiService.AdditionalCoverages = uiServicee.findElementInDetail_V3(['policy-motor-private-car-m-as:OptionalCoverages','policy-motor-private-car-m-as:OptionalCoverage']);*/
                break;
            case commonService.CONSTANTS.MODULE_NAME.CLIENT:
                uiService.clientId = params.docId;
                break;
        }

        if(mockDetail){
            deferred.resolve();
            self.goToState(
                'root.list.detail', 
                {
                    "docType": params.docType, 
                    "docId": params.docId, 
                    "productName": params.productName, 
                    "businessType" : params.businessType, 
                    "userRole" : params.userRole, 
                    "saleChannel" : saleChannel, 
                    "ctrlName": undefined
                });
        }else{

            if (params.docId != undefined){

                if(params.isNeedEdit)
                    promise = uiService.findDocumentToEdit_V3(
                        self.resourceURL, params.productName, params.docId, 
                        {
                            'transactionType' : params.transactionType
                        }
                    );
                else{
                    /* if(docType === commonService.CONSTANTS.MODULE_NAME.POLICY)
                        promise = uiService.getDocumentDetail_V3(self.resourceURL, docId);
                     else*/
                        promise = uiService.getDocumentDetail_V3(self.resourceURL, params.docId, params.clientId);
                }

                promise.then(function gotDetail (detail) {
                	if (detail == "errorSubmitting"){
                		return commonUIService.showNotifyMessage("v3.myworkspace.message.errorSubmitting", "success");//this happened when error has occured with BC submitting or network problem
                	}
                    if(commonService.hasValueNotEmpty(detail)){
                        //if is a Salecase doctype, get its channel
                        if(params.docType === commonService.CONSTANTS.MODULE_NAME.SALECASE ){
                            var caseEle = uiRenderPrototypeService.findElementInElement_V3(detail, ['CaseManagement']);
                            if(caseEle)
                                saleChannel = caseEle['@channel'];
                            else{
                                //set default to agent-sale for old salecase doesn't have '@channel'
                                saleChannel = commonService.CONSTANTS.SALE_CHANNEL.AGENT_SALE;
                            }
                        }

                        uiFrameworkService.isOpenedDetail = false;
                        var header = uiRenderPrototypeService.findElementInElement_V3(detail, ['Header']);
                        
                        $log.debug("Got detail of docType:'" + params.docType + "', id:" + params.docId); 
                        self.goToState(
                            'root.list.detail', 
                            {
                                "docType": params.docType, 
                                "docId": params.docId, 
                                "productName": uiRenderPrototypeService.findElementInElement_V3(header, ['Product']), 
                                "businessType" : params.businessType, 
                                "userRole" : params.userRole, 
                                "saleChannel" : saleChannel, 
                                "ctrlName": undefined,
                                "gotDetail": true
                            }
                        );
                        self.toggleAllBar();
                    }
                    else{
                        commonUIService.showNotifyMessage("v3.transactioncenter.message.Errorhasoccured");
                        $log.error('Cant get detail of ' + JSON.stringify(params));
                    }
                });
            }else{
                deferred.resolve();
            }
        }
        return deferred.promise;
    }
    
    /**
     * see {@code goToPortlet()} in common-ui.js
     * @param  {String}  portletId          Portlet Id
     * @param  {Object}  portletParams      parameters for destination porlet
     * @param  {Object}  options            other options
     */
   	$scope.gotoModuleFromAntherModule = function(){
   	    // Retrieve the object from storage
   	   	var retrievedPageParams = JSON.parse(localStorage.getItem('pageParams'));
   	   	//remove local storage when finish navigate to another module
   	   	localStorage.removeItem('pageParams');
   	
	   	if(retrievedPageParams && retrievedPageParams.action != 'createContact'){
	   		var metaCard = retrievedPageParams;
	   		if(retrievedPageParams.action == 'deathClaimRegistration'){
	   			$scope.createNewDocument("death-claim-registration");
	   		}else{
		   		if (metaCard.isCreateNewDocument)
		   			$scope.createNewDocument(metaCard.DocType, metaCard.Product, metaCard.BusinessType, metaCard.caseName, {policyNum:metaCard.PolicyNum, effectiveDate:metaCard.EffectiveDate, policyType:metaCard.policyType, policyOwner:metaCard.policyOwner});
		   		else
		   			$scope.openDocumentFromMetaList(metaCard);
			   	//	$scope.createNewDocument("death-claim-registration");
			   	}
	   	}
   	}   ;	
   	//wait for UI to render the call Function if navigated from other module
    $timeout(function() {
        $scope.gotoModuleFromAntherModule();
    }, 1000);

    
    
    //***** FOR GENERAL SETUP CONFIGURATION****

    $scope.setValue = function(value) {
        $scope.nationalityTest = value;
    }
    
    $scope.onHover = function onHover($event) {
        if($($event.currentTarget).attr('class').indexOf("v3-box-select-") == -1){
            var color = getComputedStyle($event.currentTarget).getPropertyValue("border-color");
            $event.currentTarget.style.backgroundColor = color;
            $event.currentTarget.style.color = "white";
        }
    }

    $scope.onLeave = function onLeave($event) {
        if($($event.currentTarget).attr('class').indexOf("v3-box-select-") == -1){
            $event.currentTarget.removeAttribute('style');
        }
    } 

    
    /**
     * close all children cards of "X" level
     * @param  {string} closeLevel        card level need tobe close
     * @param  {Object} $event          js event for clicking
     */
    $scope.closeChildCards = function closeChildCards(closeLevel){
        var self = this;
        var viewProp = self.viewProp;
        var viewObj = self.viewProp.viewObject;
        var historySelect = self.viewProp.historySelect;
        var closeLevelRefDocType = undefined;
        var currCardRefDocType = undefined;//current refDocType of newest child
        
        
      if(historySelect[closeLevel]){
            var indexOfOpenedCardOfselectLevel = historySelect[closeLevel].index;
            
            closeLevelRefDocType = historySelect[closeLevel].refDocType;
            closeLevelBusinessType = historySelect[closeLevel].refUiStructure.root.businessType;
            
            //reset unselected style
            historySelect.lastObj().refUiStructure.isSelected = false;
            historySelect.lastObj().refUiStructure.scope.setSelectCss();
            
            currCardRefDocType = historySelect.lastObj().refDocType;
            var isOpenOtherDocType = historySelect.lastObj().refUiStructure.getRefDocTypeInDetail() ? true : false;
            
            
            //if close card with difference refdoctype then render new action bar
            //or opening another docType (eg: illustration card in case when opening "illustrations" (case) card)
            if(closeLevelRefDocType != currCardRefDocType || isOpenOtherDocType){
                var ctrlInCharge = self.getCtrlInCharge();
                self.setupActionBar.call(ctrlInCharge, closeLevelRefDocType, closeLevelBusinessType);      
            } 
            
            //Update scrollTop for close Child Element 
            if(closeLevel > 1){
                var parentCard = historySelect[closeLevel-2]                
                scrollTop( parentCard.refChildHtml.offset().top - 60);
            }else{
                 scrollTop(0);
            }
            
    
            //handle 'onClose' code if existed
            if(historySelect[closeLevel].refUiStructure.onClose){
                self.$eval(historySelect[closeLevel].refUiStructure.onClose);
            }
            
            //update historySelect
            // uiRenderPrototypeService.getValidStatus(historySelect[closeLevel].refUiStructure);
            // uiRenderPrototypeService.updateParentStatusWithoutSectios(closeLevel, indexOfOpenedCardOfselectLevel, viewObj);
            
            // If we're closing a card which loaded another doctype 
            // --> need to release the another uiStructure
           /* if(historySelect[closeLevel].refUiStructure.linkCUiStructure){
                uiRenderPrototypeService.updatePreviewCardOnClose(historySelect[closeLevel].refUiStructure);
                self.removeRefLinkOfChildren(uiStructure.linkCUiStructure);
            }*/
            
            uiFrameworkService.removeRow(historySelect[closeLevel].refChildHtml);
          
            historySelect[closeLevel].childScope.$destroy();
          
            
            viewObj.splice(closeLevel + 1, viewObj.length);
            historySelect.splice(closeLevel, historySelect.length);

       }
    }


    /**
     * @author: tphan37
     * date: 17-Nov-2015
     * http://stackoverflow.com/questions/22447374/how-to-trigger-ng-click-angularjs-programmatically
     *
     * Trigger the event 'click' on a card with given name (Card must be rendered in screen)
     * @param  {String} cardName card's name
     */
    $scope.moveToCard = function moveToCard(cardName) {

        var uiStructure = this.getCardDataWithName(cardName);
        if(uiStructure){
            var intervalPromise = $interval(function() {
                // uiStructure.html.click();
                if(uiStructure.html){
                    uiStructure.html.triggerHandler('click');   
                }else{
                    $log.debug("Card(" + cardName + ") doesn't appear on screen yet");
                    if(uiStructure.parent.html){
                        uiStructure.parent.html.triggerHandler('click');
                         var intervalPromise1 = $interval(function() {
                             if(uiStructure.html){
                                 uiStructure.html.triggerHandler('click');   
                             }
                             $interval.cancel(intervalPromise1); 
                         },10);
                        
                    }
                }
                
                $interval.cancel(intervalPromise);
            }, 10);
        }
    };
    
    //restore current working space with list name of cards
    //$scope.cardName = ["case-management-motor:Quotation","illustration-motor:VehicleDetails", "illustration-motor:VehicleInformation"];
    $scope.moveToCards = function moveToCards(lisCardName) {
        if(lisCardName){
            $scope.cardName = lisCardName; 
        }
        if(!$scope.cardName){
            $scope.cardName =  JSON.parse(localStorage.getItem("listCardHistory"));
            localStorage.removeItem("listCardHistory");
        }
        if(!$scope.cardName.length){
            return;
        }
 
        var self = this;
            var uiStructure = undefined;
             uiStructure = self.getCardDataWithName($scope.cardName[0], true);
             if(uiStructure){
                  if(uiStructure.html){
                         uiStructure.html.triggerHandler('click'); 
                         $scope.cardName.splice(0, 1);
                         setTimeout(function(){ self.moveToCards(); }, 1000);
                  }
            }
        };
        
	$scope.moveToSigningCards = function moveToSigningCards() {
	    if(!$scope.signingCardsName){
	        $scope.signingCardsName =  JSON.parse(sessionStorage.getItem("listSigningCardHistory"));
	        sessionStorage.removeItem("listSigningCardHistory");
	    }
	    if(!$scope.signingCardsName.length){
	        return;
	    }
	    var self = this;
	        var uiStructure = undefined;
	       	uiStructure = self.getCardDataWithName($scope.signingCardsName[0], true);
	        if(uiStructure){
	            if(uiStructure.html){
	               uiStructure.html.triggerHandler('click'); 
	               $scope.signingCardsName.splice(0, 1);
	               if($scope.signingCardsName.length != 0){
	            	   setTimeout(function(){ self.moveToSigningCards(); }, 1000);
	               } else{
	            	   sessionStorage.removeItem("longOverLay");
		        	   loadingBarService.hideLoadingBar();
	               }
	            }
	        } else {
	        	setTimeout(function(){ self.moveToSigningCards(); }, 1000);
	        	return;
	        }
	    };
        
    /**
     * @author: nle32
     * Move to next step and execute input function
     * @param  {boolean} move to next step if isMoveForward is true, move to previoust step if isMoveForward is false
     * @param  {Object} uiStructure object
     * @param  {String} stepExeFns function needed before move to next step
     */
    $scope.moveToSection = function moveToSection(isMoveForward, uiStructure, stepExeFns, initStep) {
    	var self = this;
    	uiFrameworkService.clickOnNav = true;
    	commonService.forwardDirection = isMoveForward;
    	var underwriting = self.moduleService.findElementInDetail_V3(['Underwriting']);
    	var constProductTermLife = self.moduleService.commonService.CONSTANTS.PRODUCT_GROUP['TERM_LIFE'];
    	if((underwriting['@refUid'] == '' && self.moduleService.group == constProductTermLife) || (underwriting['@refUid'] != '' && initStep == 2 && self.moduleService.group == constProductTermLife)){
    		self.viewProp.viewObject[0][3].isVisible = undefined;
    	}    	
    	if(isMoveForward){
    		uiFrameworkService.moveToNextStep(uiStructure, initStep);
    	}else{
    		uiFrameworkService.moveToPreviousStep(uiStructure);
    	}
    }
    
    $scope.selectStep = function selectStep(viewProp) {    	
    	var self = this
    	var underwriting = self.moduleService.findElementInDetail_V3(['Underwriting']);
    	if(underwriting != undefined && underwriting['@refUid'] != '' && self.moduleService.group == self.moduleService.commonService.CONSTANTS.PRODUCT_GROUP['TERM_LIFE']){			
			self.moduleService.findMetadata_V3("", underwriting['@refUid']).then(function(data){
				var temp = self.moduleService.findElementInElement_V3(data, ['MetadataDocument']);
				if(temp["BusinessStatus"] == "NEW" || temp["BusinessStatus"] == "WIP") {
					self.viewProp.initStep = 2;
				}
				if(temp["BusinessStatus"] == "COUNTER-OFFERED" && temp["Result"] == "NOT DECIDED"){
					self.viewProp.initStep = 3;
				}
				if(temp["BusinessStatus"] == "ACCEPT-COUNTER-OFFERED" && temp["Result"] == "ACCEPT-COUNTER-OFFERED"){
					self.viewProp.initStep = 4;
				}
				if(temp["BusinessStatus"] == "ACCEPTED" && temp["Result"] == "ACCEPTED"){
					self.viewProp.initStep = 4;
				}
				if(temp["BusinessStatus"] == "DECLINED"){
					self.viewProp.initStep = 2;
				}
			});
		} else {
			var businessStatus = self.moduleService.findElementInDetail_V3(['BusinessStatus']);
			if (businessStatus == "DRAFT" ) {
				self.viewProp.initStep = 1;
			}
			else if (businessStatus == "READY FOR SUBMISSION" ) {
				if(self.moduleService.group == self.moduleService.commonService.CONSTANTS.PRODUCT_GROUP['TERM_LIFE']){
					self.viewProp.initStep = 4;
				} else {
					self.viewProp.initStep = 3;
				}
			}else{
				self.viewProp.initStep = 0;
			}
		}
    }


    /**
     * @author: tphan37
     * date: 10-Dec-2015
     *
     * Trigger autosave loop for a doctype
     * Auto remove parent autosave loop (it's autosaved when navigating to child doctype)
     */
    $scope.triggerAutoSaveLoop = function triggerAutoSaveLoop () {
        var self = this;
        var configTime = commonService.options.autoSaveInterval;

        //find the parent and remove its intervalSaveId
        var parentCtrl = self.getParentCtrlInCharge();
        if(parentCtrl)
            $interval.cancel(parentCtrl.intervalSaveId);

        function setInterval(loopTime) {
            return $interval(function() {
                //check whether it's time to autosave
                var lastSavedTime = localStorage.getItem('savedTime');
                lastSavedTime = lastSavedTime !== null ? lastSavedTime : 0;
                var currTime = new Date().getTime();
                var diffTime = currTime - lastSavedTime;//the time has passed since the last saved (by autosave or by user)
                var newWaitTime;

                if( diffTime >= configTime){
                    self.autoSaveDetail();
                    newWaitTime = configTime;//set interval time the same with config
                }
                //user clicked button, need to wait again!
                else{
                    newWaitTime = configTime - diffTime;//need to wait more
                }

                //destroy old interval
                $interval.cancel(self.intervalSaveId);

                //setup new interval
                self.intervalSaveId = setInterval(newWaitTime);
            }, loopTime);
        }

        if(configTime){//if '0', disable this feature            
            self.intervalSaveId = setInterval(configTime);
        }

    };

    /**
     * Get correct doctype. Ex: illustration in motor product will be quotation.
     * Use for translating purpose only
     * @param  {[type]} moduleService [description]
     * @return {[type]}               [description]
     */
    $scope.getCorrectDoctype = function getCorrectDoctype (moduleService) {
        if(!moduleService)
            moduleService = this.moduleService;

        var docType = moduleService.findElementInDetail_V3(['DocType']);

        switch(docType){
            case commonService.CONSTANTS.MODULE_NAME.ILLUSTRATION:
                if(moduleService.findElementInDetail_V3(['Product']).indexOf('life') === -1){
                    docType = 'quotation';
                }
                break;
        }

        return docType;
    }

    /**
     * @author: tphan37
     * date: 10-Dec-2015
     *
     * Automatic save the document detail, add spinning in save button, remove the full-screen loading banner
     */
    $scope.autoSaveDetail = function autoSaveDetail() {
        var self = this;
        if(this.uiStructureRoot.isDetailChanged){
            //temporary remove full loading screen when auto save
            $('#ipos-full-loading').attr('id','ipos-full-loading-temp');
            commonUIService.activeSpiner();
            this.saveDetailNotCompute(this.moduleService)
            .then(function saveSuccess() {
                commonUIService.showNotifyMessage('v3.mynewworkspace.message.' + self.getCorrectDoctype() + '.autosave.success'
                    , "success", 3000);
                this.uiStructureRoot.isDetailChanged = false;
            }, function saveFailed () {                
                commonUIService.showNotifyMessage("v3.mynewworkspace.message.SaveAutomatically"+ " " + self.getCorrectDoctype() + 'v3.mynewworkspace.message.unsuccessful'
                    , "unsuccessful", 3000);
            })
            .finally(function () {
                // re-add full loading screen after auto save
                $('#ipos-full-loading-temp').attr('id','ipos-full-loading');
                commonUIService.inactiveSpiner();
            });
        }
    };

    /**
     * @author: tphan37
     * date: 18-Dec-2015
     * Save detail and show messages success or not
     * Automatic calling the parent document for saving
     * @param  {Object}         currUiService       moduleSerice will using to save this document
     * @param  {Object}         flags               which
     *         (bool)               bCompute            will compute this document when saving
     *         {bool}               bShowSavedMessage   will show message after saving successful?
     * @return {[type]}                 Angular promise
     */
    $scope.saveDetailNotCompute = function saveDetailNotCompute (currUiService, flags) {
        return uiFrameworkService.saveDetailNotCompute.call(this, currUiService, flags);
    }
    
    $scope._saveDetailNotCompute = function saveDetailNotCompute (currUiService, flags) {
        var self = this;
        if(!currUiService)
            currUiService = this.moduleService;

        //if flags empty, create empty obj
        flags = flags || {};

        var defer = currUiService.$q.defer();
        // $('#ipos-full-loading').show();
        var oldDocTypeId = currUiService.findElementInDetail_V3(['DocId']);
        
        currUiService.saveDetailV3New(this.resourceURL, flags.bCompute).then(function success(result) {

            //if oldDocTypeId is undefined --> This document is new
            //--> need to find its parent document on the screen and update it
            if(!oldDocTypeId){                
                var pCtrl = self.getParentCtrlInCharge();
                if(pCtrl){
                    var pElement = self.getRightDetailInMultipleEleFromParentDoc();
                    if(pElement){
                        pElement['@refUid'] = currUiService.findElementInDetail_V3(['DocId']);
                        for (var key in pElement) {
                            //set Id
                            if(angular.isObject(pElement[key]) && key.indexOf('Id') !== -1)
                                pElement[key].$ = pElement['@refUid'];

                            //TODO: set role, if any
                        };
                        pCtrl.saveDetailNotCompute(pCtrl.moduleService, {bShowSavedMessage: flags.bShowSavedMessage});
                        // .then(function() {defer.resolve()});
                        // .then(function() {defer.resolve()});
                    }
                }
            }
            // else
            //     defer.resolve();
                
            if(flags.bShowSavedMessage)
                commonUIService.showNotifyMessage('v3.mynewworkspace.message.' 
                    + self.getCorrectDoctype(currUiService) + '.save.success', 'success');


            //  Save of parent will silent notify
            defer.resolve();     
        }, function failed (result) {
            if(flags.bShowSavedMessage)
                commonUIService.showNotifyMessage('v3.mynewworkspace.message.' + self.getCorrectDoctype(currUiService) + '.save.unsuccess');
            defer.reject();

        }).finally(function() {
            // $('#ipos-full-loading').hide();
            self.reSetupConcreteUiStructure(currUiService.detail);
        });

        return defer.promise;
    };

     /**
     * @author: tphan37
     * date: 07-Jan-2016
     * @return {Boolean} true if allow auto save when navigating
     */
    $scope._isAllowNavAutoSave = function _isAllowNavAutoSave () {
        var result = false;
        if( commonService.options.autoSaveNavigating 
            && commonUIService.getActiveUserRole() !== commonService.CONSTANTS.USER_ROLES.GUEST //doesn't allow auto save if role is guest 
            //&& commonUIService.getActiveUserRole() !== commonService.CONSTANTS.USER_ROLES.PROSPECT //doesn't allow auto save if role is prospect
            && commonUIService.getActiveUserRole() !== commonService.CONSTANTS.USER_ROLES.POLICY_OWNER //doesn't allow auto save if role is policy owner           
            
            // //temporary: only allow if quotation is ACCEPTED and businessType is New-business
            // &&  ( this.checkQuotation() 
            //         && this.getCurrProductInfor().businessType !== commonService.CONSTANTS.ACTIONTYPE.NEWBUSINESS) 
            ){
            result = true;
        }

        return result;
    } 
    
    /**
     * @author: tphan37
     * date: 17-Dec-2015
     * Internal fn called by {@code chooseCard()}
     * Check whether need to close card, show message for saving detail or not
     * 
     * NOTE:
     *     Selecting card: Card is selecting by user
     *     Opening card: cards are openning on screen, include old selected cards
     * @param  {Object}     willOpenCard       card's just selected by user, is going to open
     * @param  {Integer}    willOpenLevel     level of select
     * @return {Object}                     angular promise
     */
    $scope.__checkClosingCard = function _checkClosingCard(willOpenCard, willOpenLevel) {        
        var self = this;        
        var historySelect = self.viewProp.historySelect;    
        // var message = 'Choose YES if you want to save the current content before opening document. If NO, the new content will be reset.'
        var defer = this.moduleService.$q.defer();


        function checkNeedToSaveDetail(openingCard) {
            //openingCard: card is opening on screen, which we're going to close it
            //willOpenCard: card which will be opened
            var defer = self.moduleService.$q.defer();
            
            if( self._isAllowNavAutoSave() &&                 
                ( 
                    //if root is different --> it's a different documents
                    //or willOpenCard will open other doctype, need to check for saving detail
                    openingCard.root !== willOpenCard.root ||
                    
                    //if user wants to open new doctype, need to save the old one
                    willOpenCard.getRefDocTypeInDetail()
                )) {
            	var oldDocType = openingCard.getRefDocTypeOfRoot();
                var currUiService = uiRenderPrototypeService.getUiService(oldDocType);
                var oldDocTypeId = currUiService.findElementInDetail_V3(['DocId']);
                
                if(currUiService){
                	// remove error when another doctype be open
                	currUiService.removeErrorMessageNodeInElement(currUiService.detail);
                	
                	// save if isDetailChanged
                	if (openingCard.root.isDetailChanged) {
                        //we need oldScope, so in saveDetailNotCompute() can get the parents uiStructure for autosave
                        var oldScope = openingCard.getCurrentAngularScope();

                        self.saveDetailNotCompute.call(oldScope, currUiService).then(function () {   
                            commonUIService.showNotifyMessage('v3.mynewworkspace.message.' 
                                + self.getCorrectDoctype(currUiService) + '.autosave.success', "success", 3000);
                            defer.resolve();    
                            openingCard.root.isDetailChanged = false;
                        }, function () {         
                            commonUIService.showNotifyMessage("v3.mynewworkspace.message.SaveAutomatically" + " " 
                                + self.getCorrectDoctype(currUiService) + "v3.mynewworkspace.message.unsuccessful" , "unsuccessful", 3000);
                            defer.reject();    
                        });
                    }else{
                    	defer.resolve();
                    } 
            	} else {
            		$log.error("Can't get uiService of doctype: " + oldDocType);
                    defer.resolve();
            	}   
            }else{
                defer.resolve();
            }

            return defer.promise;
        };

        var lastSelectedInfo = historySelect.lastObj();
        if(lastSelectedInfo){
            var lastSelectedCard = lastSelectedInfo.refUiStructure;
            //if lastSelectedInfo has linkChildUiStructure, it need to be it
            var linkCUiStructure = uiRenderPrototypeService.getLinkChildUiStructure(lastSelectedCard);
            lastSelectedCard = linkCUiStructure ? linkCUiStructure : lastSelectedCard;
            checkNeedToSaveDetail(lastSelectedCard).then(function() {
                //if close an opening card
                if(historySelect[willOpenLevel]){

                    var selectedCard = historySelect[willOpenLevel].refUiStructure;
                    
                    //close child of opening card
                    self.closeChildCards(willOpenLevel);
                    if(commonService.options.cardTouchMode){
                        willOpenCard.cardStatus = "start";
                    }

                    //if click on an opened card, simple close its children and do no more
                    if(selectedCard === willOpenCard){              
                        defer.resolve('stop');
                    }else{
                        defer.resolve();
                    }
                }else
                    defer.resolve();
            });
        }else
             defer.resolve();

        return defer.promise;
    }
    
    /**
     * @author: tphan37
     * date: 16-Dec-2015
     * This fn support get parent element which link to this document
     * Eg: Case has list quotation. When open a quotation, in illustration-ctrl call this fn, will return the element in case doc,
     * which is the place to put docId of this quotation 
     * @returns  {Object}          an element in multiple element of parent doc, which store the uid of child doc (doc request this fn)
     */
    $scope.getRightDetailInMultipleEleFromParentDoc = function getRightDetailInMultipleEleFromParentDoc() {
        var self = this;
        var uiStructure = self.getAssociateUiStructureRoot();
        return uiStructure.parent.refDetail;
    }
    
    /**
     * @author: tphan37
     * date: 16-Dec-2015
     * get metadata list of children from a parent card
     * @param  {String} pCardName           the name of card want to get its children metadata
     * @returns  {Array}          list metadata of children
     */
    $scope.getMetadataListFromCard = function getMetadataListFromCard(pCardName){
        var metadataLs = []
        var parentCard = this.getCardDataWithName(pCardName);
        for(var i = 0; i < parentCard.children.length; ++i){
            if(parentCard.children[i].metadata)
                metadataLs.push(parentCard.children[i].metadata);
        }
        return metadataLs;
    };
    //moved to uiFrameworkService
    $scope.updateHistorySelectObj = function updateHistorySelectObj (selectLevel, selectIndex) {
        var self = this;        
        var viewProp = self.viewProp;
        var viewObj = self.viewProp.viewObject;
        var historySelect = self.viewProp.historySelect;

         //update the historySelect object 
        if(historySelect.length == selectLevel){
             historySelect.push(angular.copy(viewProp.historyObjTmpl));
        }
        historySelect[selectLevel].refUiStructure = viewObj[selectLevel][selectIndex];
        historySelect[selectLevel].index = selectIndex;

        //update the history of doctype
        if(selectLevel == 0){//if in first step, need to init the refDocType value
            // historySelect[selectLevel].refDocType = self.moduleService.name;
            // if (self.moduleService.product !='' && self.moduleService.product != undefined){
            //     historySelect[selectLevel].refDocType = self.moduleService.name + ';product=' + self.moduleService.product;
            // }           
            historySelect[selectLevel].refDocType = self.uiStructureRoot.docParams.refDocType;
        }
        else{           
            // historySelect[selectLevel].refDocType = undefined;
            var prevRefDocType = historySelect[selectLevel - 1].refUiStructure.getRefDocTypeInDetail();
            if(prevRefDocType)
                historySelect[selectLevel].refDocType = prevRefDocType;
            else{
                historySelect[selectLevel].refDocType = historySelect[selectLevel - 1].refDocType;   
            }
        }
    }
    
    /**
     * capture the clicking event on card
     * @param  {Object} card            current card
     * @param  {Object} selectLevel           the selectLevel of chosing card
     * @param  {Object} selectIndex     the index of chosing card
     * @param  {Object} $event          js event for clicking
     */   
    $scope.chooseCard = function chooseCard(card, selectLevel, selectIndex, $event) {
    	uiFrameworkService.chooseCard(card, selectLevel, selectIndex, $event, this, $scope.resourceURL);
    }
    
    $scope.chooseSection = function chooseCard(card, selectLevel, selectIndex, $event) {
        uiFrameworkService.chooseSection(card, selectLevel, selectIndex, $event, this, $scope.resourceURL);
    }
    
    $scope._chooseCard = function chooseCard(card, selectLevel, selectIndex, $event) {
        var self = this;
        loadingBarService.showLoadingBar();    
        //toggle class for summary
        if(commonService.options.cardTouchMode){
            if(card.cardStatus != "detail"){
                return;
            }
        }        
        
        // Hard code to hide action in underwriting
        if(card.name == "case-management-motor:Step6_Underwriting" || card.name == "case-management-motor:Step5_Underwriting"
            || card.name == "case-management-fire:Step6_Underwriting" || card.name == "case-management-guaranteed-cashback-saver:Underwriting"
            || card.name == "case-management-gtl:groupLevelUW" || card.name == "case-management-travel-express:Step5_Underwriting" 
            	|| card.name == "case-management-gtravel:Underwriting") 
            $scope.isInSaleCase = true;
        
        var viewProp = self.viewProp;
        var viewObj = self.viewProp.viewObject;
        var historySelect = self.viewProp.historySelect;   
        $scope.listCardHistory = [];
        
        //Check possition selected card for scrollTop
        var isScrollTop = false;
        if(historySelect.length > 0){           
            if(selectLevel <= historySelect.lastObj().refUiStructure.level)
                isScrollTop = true;
        }

        var lastHistorySelect = historySelect.lastObj();
        
        self._checkClosingCard(card, selectLevel).then(function checkedCloseCard (result) {
            if(result !== 'stop'){                
                uiRenderPrototypeService.getChildContentOfUiStructure(viewObj[selectLevel][selectIndex], self.resourceURL)
                .then(function gotNextUiObj (result) {

                    //"result" will be "undefined" if clicking on an action which will executing a function
                    if(result){                
                        var refDocType = viewObj[selectLevel][selectIndex].getRefDocTypeInDetail();
                        
                        
                        if(
                            viewObj[selectLevel][selectIndex].children.length !== 0 //if there are any children or uiEle, won't load other doctypes 
                            || viewObj[selectLevel][selectIndex].uiEle.length !== 0//because we priority jsonMock declaration 
                            //(Eg: in FNA, Client & Joint Applicant will open views of FNA document, not open prospect doctype
                            ){
                            refDocType = undefined;
                        }
                        
                        var uiEles = undefined;

                        //there will be new cards
                        if(uiRenderPrototypeService.isUiStructureObj(result[0])){                           
                            $scope.isOpenedDetail = false;         
                             viewObj[selectLevel + 1] = result;                    
                        }
                        //static HTML or HTML form
                        else{                    
                            $scope.isOpenedDetail = true;
                            uiEles = result;
                        }
                        self.updateHistorySelectObj(selectLevel, selectIndex);
                        
                        //Update scrollTop for close Child Element and open other Element
                        if(isScrollTop){
                            var valueOfPosittionIndex = 0;
                            if(historySelect.lastObj().index > 3 && historySelect.lastObj().index <= 7)
                                valueOfPosittionIndex = 200;
                            else if(historySelect.lastObj().index > 7)
                                valueOfPosittionIndex = 400;
                            
                            scrollTop($event.currentTarget.parentElement.offsetTop + valueOfPosittionIndex);
                        }else{
                            scrollTop($event.currentTarget.children[0].offsetTop );
                        }

                        self.renderNewCardsRow($event, selectLevel + 1, refDocType, uiEles);

                    }else{                    
                        //remove last historySelect ele when cardType is 'action' 
                        //cause when click on this card again nothing will happen
                        // historySelect.pop();   
                    }
                    loadingBarService.hideLoadingBar();
                });

            }
            else
                loadingBarService.hideLoadingBar();
        });
    };
    
    //support direct sale
    //keep quotation data
    //restore current working space after login
    $scope.getViewHistory = function(){
        //update history select card name to local storage (support direct sale)
        if(this.viewProp.historySelect.length){
            for(var i = 0 ; i < this.viewProp.historySelect.length ; i++){
                uiFrameworkService.listCardHistory[i] = this.viewProp.historySelect[i].refUiStructure.name;
            }
            localStorage.setItem( 'listCardHistory' , JSON.stringify(uiFrameworkService.listCardHistory));
            localStorage.setItem( 'caseDSDetail' , JSON.stringify(illustrationUIService.detail));
        }
        
    }

    $scope.getEmptyField = function getEmptyField(card){
        var list = uiRenderPrototypeService.getEmptyFieldList(card);
    }
    
    // function getIndexOfModuleInArray(array, module){
    //  for(var i = 0; i < array.length; i++){
    //      if(array[i].module == module)
    //          return i;
    //  }
    //  return undefined;
    // }
    
    function scrollTop(offsetPosittion){
        $('html, body').stop().animate({
            scrollTop:offsetPosittion           
            },1500, 'swing'
        );
    }
    
    $scope.closeChildCardsBreadCrum = function closeChildCardsBreadCrum(closeLevel, breadCrum){     
        var self = this;
        var isLastBreadCrum = true;
        var card = breadCrum;
        
        if(breadCrum.refUiStructure != undefined){          
            card = breadCrum.refUiStructure;            
            if(self.viewProp.historySelect.length > 0){
                if(self.viewProp.historySelect.length < 1 || self.viewProp.historySelect[self.viewProp.historySelect.length-1].refUiStructure.level != closeLevel){
                    closeLevel = closeLevel + 1;
                } else{
                    card.isSelected = false;
                    card.scope.setSelectCss();
                    card.scope.setCssLeafCard();
                    isLastBreadCrum = false;
                }                   
            }           
        }
        if(isLastBreadCrum){ // currency breadCrum is last Bread Crum 
            if(card.children != undefined  && card.children.length > 0){
                for(var i = 0; i < card.children.length; i++){
                    card.children[i].isSelected = false;
                    card.children[i].scope.setSelectCss();
                    card.children[i].scope.setSelectCss();
                }
            }else if(card.linkUiStructure != undefined && card.linkUiStructure.children != undefined && card.linkUiStructure.children.length > 0){
                for(var i = 0; i < card.linkUiStructure.children.length; i++){
                    card.linkUiStructure.children[i].isSelected = false;
                    card.linkUiStructure.children[i].scope.setSelectCss();
                    card.linkUiStructure.children[i].scope.setSelectCss();
                }
            }else{          
                card.isSelected = false;
                card.scope.setSelectCss();
                card.scope.setCssLeafCard();
            }                       
        }       
//        self.closeChildCards(closeLevel);
        $scope.uiFrameworkService.closeChildCards(closeLevel, self);
        
    }

    /**
     * Upload all files are selected and save it in system
     *
     * @param  {String} card    The card contain function uploadFile
     * @param  {Object} files   Information of all Files need to upload
     * 
     */
    $scope.uploadFiles = function uploadFiles(card, files, $event){
        var self = this;
        var moduleService = $scope.moduleProspectPersonalService;
        
        $scope.processUploadingFiles = function processUploadingFiles() {
        	var j = 0;
            if(window.Liferay.Fake == true){
            	//For DS Upload File(s)
            	for(var i = 0; i< files.length; i++){        		
            		if(files[i].validate == '') {
            			loadingBarService.showLoadingBar();
            			var porletId = undefined;
    	        		self.multiUploadService.uploadFile(porletId, files[i]).then(function updateDocumentCase(data){
    	        			loadingBarService.hideLoadingBar();
    	        			if(data != undefined) { 
    	        				var obj = JSON.parse(data);
    		        			$log.debug(obj);
    		        			
    	        				//check for duplicated file
    	        				//	remove if exist
    	        				if(existDuplicatedFile) {
    	        					var duplicatedFileIndex = $scope.getDuplicatedNameFileIndex(moduleService.findElementInElement_V3(obj, ['Name']).$);
    	        					if(duplicatedFileIndex != -1) {
    	        						$scope.removeAttachment(['Attachments'], 'Attachment', duplicatedFileIndex);
    	        					}
    	        				}
    	        				
    	        				//add attachment    		        			 			
    		        			$scope.addNewAttachment(['Attachments'], 'Attachment');	        			
    		                 	var docFile = moduleService.findElementInElement_V3(salecaseUIService.detail, ['Attachments']);	                 	
    		                 	docFile = moduleService.findElementInElement_V3(salecaseUIService.detail, ['Attachments','Attachment'])[docFile['@counter']*1 - 1];
    		                 	if(docFile != undefined){
	    		                 	docFile['@refResourceDocType'] = "resource-file";
	    		                 	docFile['@refResourceUid'] = moduleService.findElementInElement_V3(obj, ['DocId']);
	    		                 	docFile['@vpms-suffix'] = "Attachment";
	    		                 	docFile['FileUid']['$'] = moduleService.findElementInElement_V3(obj, ['FileUid']).$;
	    		                 	docFile['Name']['$'] = moduleService.findElementInElement_V3(obj, ['Name']).$;
	    		                 	docFile['FileName']['$'] = moduleService.findElementInElement_V3(obj, ['FileName']).$;
	    		                 	docFile['CreateDate']['$'] = moduleService.findElementInElement_V3(obj, ['DateTime']).$;
	    		                 	docFile['FileSize']['$'] = moduleService.findElementInElement_V3(obj, ['FileSize']).$;
    		                 	}
    		                 	i--;
    		                    files.splice(i,1);
    		                 	if(files.length == 0){
    		                        commonUIService.showNotifyMessage("v3.common.message.Attachsuccessfully", "success");
    		                    }
    	        			} else {
    	        				commonUIService.showNotifyMessage("v3.common.message.Attachfail", "fail");
    	        			}
    	        		});
            		}
            	}        	
            	self.multiUploadService.filesDS = [];
            } else {
    	        for(var i = 0; i< files.length; i++){
    	        	loadingBarService.showLoadingBar();
    	            self.multiUploadService.uploadFile(portletId, files[i]).then(function uploaded(data){
    	            	loadingBarService.hideLoadingBar(); 
    	                if(data != undefined){
    	                	//check for duplicated file
	        				//	remove if exist
	        				if(existDuplicatedFile) {
	        					var duplicatedFileIndex = $scope.getDuplicatedNameFileIndex(moduleService.findElementInElement_V3(data, ['Name']).$);
	        					if(duplicatedFileIndex != -1) {
	        						uiRenderPrototypeService.removeChildElement(card.parent, duplicatedFileIndex, undefined);
	        					}
	        				}
	        				
	        				//add attachment card
    	                    $scope.addCard(card, function addedCard(addedEle){    	                        
    	                        addedEle.FileUid.$ = moduleService.findElementInElement_V3(data, ['FileUid']).$;
    	                        addedEle.Name.$ = moduleService.findElementInElement_V3(data, ['Name']).$;
    	                        addedEle.FileName.$ = moduleService.findElementInElement_V3(data, ['FileName']).$;
    	                        addedEle.CreateDate.$ = moduleService.findElementInElement_V3(data, ['DateTime']).$;
    	                        addedEle.FileSize.$ = moduleService.findElementInElement_V3(data, ['FileSize']).$;
    	                        addedEle['@refResourceUid'] = moduleService.findElementInElement_V3(data, ['DocId']);
    	                        addedEle['@refResourceDocType'] = moduleService.findElementInElement_V3(data, ['DocType']);
    	                        if(files[i-1].documentType){//for RUL product
    	                        	addedEle.AttachmentType.Value = files[i-1].documentType;
    	                        }
    	                        
    	                    });
    	                    //Move file out array when upload success
    	                    i--;
    	                    files.splice(i,1);
    	                    
    	                    if(files.length == 0){
    	                        commonUIService.showNotifyMessage("v3.common.message.Attachsuccessfully", "success");
    	                        //save datail for case-management
    	                        self.saveDetail();
    	                    }
    	                }
    	                else{
    	             
    	                    files[j].validate=$translate.instant("v3.common.message.Attachfail.Validate");
    	                    commonUIService.showNotifyMessage("v3.common.message.Attachfail", "fail");
    	                    j++;
    	                }
    	                self.closeChildCards(card.level, $event);
    	            });
    	        }
            }
        }
        
        $scope.addNewAttachment = function addNewAttachment (path, elemntName) {
        	$scope.subQ = salecaseUIService.findElementInDetail_V3(path);
        	salecaseUIService.addChildEleToParentEle($scope.subQ, elemntName);
        };
        
        $scope.removeAttachment = function removeAttachment (path, elemntName, index) {
        	$scope.subQ = salecaseUIService.findElementInDetail_V3(path);
        	salecaseUIService.removeChildEleParentEle($scope.subQ, elemntName, index);
        };
        
        $scope.getDuplicatedNameFileIndex = function getDuplicatedNameFileIndex (fileName) {        	
            var attachedFiles = moduleService.findElementInElement_V3(salecaseUIService.detail, ['Attachments','Attachment']);
            
            for(var i=0; i<attachedFiles.length; i++) {
            	if((attachedFiles[i])['Name']['$'] === fileName) {
            		return i;
            	}
            }
            return -1;
        };
             
        //check for duplicated files
        var existDuplicatedFile = false;    
        for(var i = 0; i < files.length; i++) {
        	var file = files[i];
        	if($scope.getDuplicatedNameFileIndex(file.name) != -1) {
        		existDuplicatedFile = true;
        		break;
        	}
        }
        
        //if exist duplicated file(s)
        //	show confirmation modal for user
        //		Overwrite: overwrite duplicated file(s)
        //		Cancel: cancel / do nothing
        if(existDuplicatedFile) {        	
        	commonUIService.showYesNoDialog("MSG-C35", function() {
        		//user choose override
        		$scope.processUploadingFiles();
			}, function() {
			    //user choose cancel, do nothing
			});
        } else {
        	$scope.processUploadingFiles();
        }   
    }
    
    $scope.removeFile = function removeFile(index){    	
        $scope.subQ = salecaseUIService.findElementInDetail_V3(['Attachments']);
        salecaseUIService.removeChildEleParentEle($scope.subQ,'Attachment', index);      
     }
    
    /**
     * add element to ipos document & new card on the screen
     * @param {Object}      card       the card which received the clicking event (uiStructure)
     * @param {function}    fnCallBack the function will be execute after the method executed
     * @param {Object}      moreParams more params
     *                             
     */
    $scope.addCard = function addCard (card, fnCallBack, moreParams) {
        //if card is action card, get the parent
        //Otherwise, use card to get the list of children need to add
        var parentCard = card.cardType === uiRenderPrototypeService.CONSTANTS.cardType.ACTION ? card.parent : card;
        uiRenderPrototypeService.addChildElement({
            "parentCard" : parentCard,
            "templateId": card.templateId, 
            "resourceUrl": $scope.resourceURL, 
            "callBackFn": fnCallBack
        });
		//close uiElement form when detail card have counter = maxOccurs
        if(commonService.hasValueNotEmpty(card.parent.refDetail['@maxOccurs']) && card.parent.refDetail['@counter'] == card.parent.refDetail['@maxOccurs']){
             this.closeChildCards(parseInt(card.level),$scope); 
        };
    };
    
    $scope.updateCardMetadata = function updateCardMetadata (card, newCardIndex, fnCallBack) {
        //if card is action card, get the parent
        //Otherwise, use card to get the list of children need to add
        var self = this;
        var defer = $q.defer();
        var parentCard = card.cardType === uiRenderPrototypeService.CONSTANTS.cardType.ACTION ? card.parent : card;
    

        self.findMetadata_V3(resourceUrl, listUid).then(function(data){
            var metadata = data.MetadataDocuments.MetadataDocument;
            parentCard.children[newCardIndex].metadata = metadata;
        });
       
    };

    /*
     * Check 'counter' and 'minOccurs' values to decide whether card can be removed
	 * And check 'freeze' condition
     */
    $scope.isCardRemovable = function isCardRemovable (card) {
        return (card.parent.refDetail['@counter'] > card.parent.refDetail['@minOccurs'])
			&& !card.scope.moduleService.freeze;
    }
    
    /**
     * Internal functions called by UI Framework. Which remove an element in multiple element list
     */
    $scope.removeCardInList = function removeCardInList (i18nMessage, fnCallBack, card) {
        //if card or index is undefined, try to use the value from 'this'
        var card = card || this.card;
        var index = card.scope.$index;

        function removeCard() {            
            if((card !== undefined) && (index !== undefined)){
                
                //hotfix for term-life-secure, need to remove the caseId from imported illustrations
                if (card.name === 'case-management-guaranteed-cashback-saver:Quotation' ||
                	card.name === 'case-management-rul:Quotation' ||
                	card.name === 'case-management-endowment:Quotation'){
                    var refDocType = card.getRefDocTypeInDetail();
                    var docId = card.refDetail['@refUid'];

                    var illustrationUIService = uiRenderPrototypeService.getUiService(refDocType.split(';')[0]);
                    if (commonService.hasValueNotEmpty(docId)) {
                        //need to remove caseId from the illustration
                        var product = refDocType.split(';')[1].replace("product=", "");
                        illustrationUIService.findDocumentToEdit_V3($scope.resourceURL, product, docId).then(function(detail) {
                            illustrationUIService.findElementInDetail_V3(['CaseID']).$ = "";
                            illustrationUIService.saveDetail_V3($scope.resourceURL, false).then(function(){
                                delete illustrationUIService.detail;
                            });
                        });
                    } else {
                        delete illustrationUIService.detail;
                    }
                }

                uiRenderPrototypeService.removeChildElement(card.parent, index, fnCallBack);

                //need to re-render page cause mdDialog is showing dialog outside of angular scope!!
                // if(i18nMessage)
                //     this.card.parent.scope.$digest();                
            }
        }

        if(i18nMessage){
            commonUIService.showYesNoDialog(i18nMessage, removeCard);   
        }else{
            //if no message, remove card directly
            removeCard();
        }

    };


    /**
     * Internal functions called by UI Framework. Will clear a data 
     */
    $scope.removeCard_New = function removeCard_New (i18nMessage, fnCallBack) {
        var self = this;
        function removeCard() {                        
            //clear detail of the removed card
            uiRenderPrototypeService.clearDataInJson(self.card.refDetail);
            
            self.setVisibleCard(undefined, false);

            if(fnCallBack)
                fnCallBack();

            //need to re-render page cause mdDialog is showing dialog outside of angular scope!!
            // if(i18nMessage)
                // self.card.parent.scope.$digest();
                
            //FNA tmp
            if(self.moduleService.name === "factfind"){
                if(!commonService.hasValueNotEmpty(self.moduleService.findElementInDetail_V3(['JointApplicant'])['@refUid'])){
                    self.moduleService.findElementInDetail_V3(['IsJointApplicant']).Value = "N";
                    self.refreshFNADoc();
                }
            }
            
        }

        if(i18nMessage){
            commonUIService.showYesNoDialog(i18nMessage, removeCard);   
        }else{
            //if no message, remove card directly
            removeCard();
        }
    };

    /**
     * Old function support '@icon' in jsonMock
     */
    $scope.removeCard = function removeCard (card, index, fnCallBack) {
        uiRenderPrototypeService.removeChildElement(card.parent, index, fnCallBack);
    };

    $scope.markValidCard = function markValidCard (card) {
        uiRenderPrototypeService.markValidStatus(card);
    };


    /**
     * Internal functions called by UI Framework. Will remove all children template card of card with name
     * @param {string}      parentCardName       card name which wants to remove its template children card
     * @param {string}      i18nMessage       if not null, will show a popup to confirm the removing
     * @param {function}    fnCallBack       execute after the removing is complete
     */
    $scope.remChildrenInCard = function remChildrenInCard(parentCardName, i18nMessage, fnCallBack) {
         //if card or index is undefined, try to use the value from 'this'
        var card = this.getCardDataWithName(parentCardName);

        function removeCard() {            
            if((card !== undefined)){
                uiRenderPrototypeService.removeAllChildrenElement(card, fnCallBack);

                //need to re-render page cause mdDialog is showing dialog outside of angular scope!!
                // if(i18nMessage)
                //     this.card.parent.scope.$digest();
            }
        }

        if(i18nMessage){
            commonUIService.showYesNoDialog(i18nMessage, removeCard);   
        }else{
            //if no message, remove card directly
            removeCard();
        }
    };
    
    //moved to ui framework
    $scope._removeRow = function removeRows (htmlEle) {
        if(!htmlEle)
            return;
        
        $scope.isOpenedDetail = false;
        var eleList=$(htmlEle).siblings();
        eleList.each(function(){
            $(this).children().children().css('opacity','1');
        });
        var delay = function() {
            htmlEle.remove();
        };
        htmlEle.addClass('animated zoomOut');
        $timeout(delay, 700);
    }
    
    //moved to uiFrameworkService
    //TODO: It heavily depends on jquery, find a way to get out of this
    $scope._renderNewCardsRow = function renderNewCardsRow ($event, selectLevel, refDocType, objs ) {
        var self = this;
        var ctrl = '';
        if(refDocType)
            ctrl = ' ng-controller="' + genCtrlName('detail', refDocType.split(';')[0]) + '"';

        var layoutTemplate = undefined;
                
        //if objs is undefined, means new row of cards
        if(!objs){
            //sort uiStructure by priority
            uiRenderPrototypeService.sortUIElementPriority(self.viewProp.viewObject[selectLevel], "priority", false);
            layoutTemplate = 
                '<div class="row" card-reorder current-level = "' + selectLevel+ '" view-object-lenght="viewProp.viewObject[' + (selectLevel -1 ) + '].length" view-object="viewProp.viewObject[' + (selectLevel -1 ) + ']" id="level-' + selectLevel+ '-content">' +
                    '<div'+ ctrl + ' class="box-detail wrapper-detail">' +
                        '<div class="container-fluid v3-padding-0">' + 
                            '<card id="level-' + selectLevel+ '-card-{{$index}}" ng-repeat="card in viewProp.viewObject[' + selectLevel + '] track by $index" level="' + selectLevel + '" when-click="chooseCard(card, ' + selectLevel + ' , $index, clickEvent)"/>' +
                        '</div>' +
                    '</div>' +
                '</div>';
        }
        //render form HTML
        else if(uiRenderPrototypeService.isUiElementObj(objs[0])){
            //sort uiElement by priority
            uiRenderPrototypeService.sortUIElementPriority(objs, "priority", false);
            self.viewProp.uiElements = objs;
            layoutTemplate =
                '<div class="row" card-reorder current-level = "' + selectLevel+ '" view-object-lenght="viewProp.viewObject[' + (selectLevel -1 ) + '].length"  view-object="viewProp.viewObject[' + (selectLevel -1 ) + ']" class="row" id="level-' + selectLevel+ '-content">' +
                    '<div' + ctrl + ' class="box-detail wrapper-detail">' +
                        "<div class='container-fluid v3-padding-0 box-detail-form'>" + 
                            '<ui-element ng-repeat="uiElement in viewProp.uiElements track by $index" />' + 
                        "</div>" +
                    "</div>" +   
                "</div>";
        }
        //render static HTML
        else{
            layoutTemplate =
                '<div class="row" card-reorder current-level = "' + selectLevel+ '" view-object-lenght="viewProp.viewObject[' + (selectLevel -1 ) + '].length" view-object="viewProp.viewObject[' + (selectLevel -1 ) + ']" id="level-' + selectLevel+ '-content">' +
                    "<div class='box-detail wrapper-detail'>" +
                        "<div class='container-fluid v3-padding-0 box-detail-form'>" + objs + "</div>" +
                    "</div>" +
                "</div>";
        }

        var appendEle = undefined;//where the new layout will be append
        var parentElement = $event.currentTarget.parentElement;
        var currOffsetTop = $event.currentTarget.children[0].offsetTop;
        var siblingEles = parentElement.children;
        var siblingLen = siblingEles.length;

        var i = 0;
        for (; i < siblingLen; i++) {
            if(!commonService.hasValueNotEmpty(siblingEles[i].children)) continue;
            if (siblingEles[i].children[0].offsetTop > currOffsetTop) {
                break;
            }
            appendEle = siblingEles[i];
        };

        //all cards are on the same height
        //append in the end of parent element
        if(i >= siblingLen){
            appendEle = siblingEles[i - 1];
        }


        //append new layout here
        //http://www.mattzeunert.com/2014/11/03/manually-removing-angular-directives.html
        var childScope = self.$new();
        var compiledTemplate = $compile(layoutTemplate)(childScope);
        angular.element(appendEle).after(compiledTemplate);

        //keep track of appendEle
        if(self.viewProp.historySelect[selectLevel - 1]){
            self.viewProp.historySelect[selectLevel - 1].refChildHtml = compiledTemplate;
            self.viewProp.historySelect[selectLevel - 1].childScope = childScope;
        }

        //add class for new layout        
        var currTargetEle = angular.element($event.currentTarget).find('.box-item');
        var arrowPositionX = $event.currentTarget.children[0].offsetLeft + $event.currentTarget.children[0].offsetWidth/2 - 30;
        var currBackgroundColor = currTargetEle.css("background-color");
        if(currBackgroundColor == "rgba(0, 0, 0, 0)"){
          var currBackgroundColor = currTargetEle.css("border-color");
        }

//        compiledTemplate.css('width', '100%');
        compiledTemplate.css('margin-right', 'auto');
        compiledTemplate.css('clear', 'both');
        var borderProp="2px solid "+currBackgroundColor;
        compiledTemplate.addClass('animated zoomIn');
        var boxDetailEle = compiledTemplate.find('.box-detail');
        boxDetailEle.css('border-top',borderProp);
        boxDetailEle.css('border-bottom',borderProp);
        boxDetailEle.css('margin-bottom','-2px');
//        boxDetailEle.css('padding-bottom','-5px');
        //boxDetailEle.css('padding-bottom', '15px');
        /*boxDetailEle.css('box-shadow', currBackgroundColor + '0px 1px 20px -3px');*/        
       /* boxDetailEle.before("<span class='arrow' style='left:"+arrowPositionX+"px; box-shadow:"+currBackgroundColor+"2px -2px 6px -3px' ></span>");*/
        boxDetailEle.before("<span class='arrow-container-card' style='left:"+arrowPositionX+"px; border-right:"+currBackgroundColor+"2px solid;border-top:"+currBackgroundColor+"2px solid;'></span>");
        //User Guide: if this card is the first time access, it will show User Guide popover for Card
        if(objs){
          $timeout(function() {
              $scope.moduleProspectPersonalService.tourGuideFirstLoginForUser("documentDetails", $scope.portletId);
          }, 1000);         
        }else{
            $timeout(function() {
                if(refDocType){
                    $scope.moduleProspectPersonalService.tourGuideFirstLoginForUser(refDocType.split(';')[0].capitalizeFirstLetter(), $scope.portletId);
                }
            }, 1000);  
        }                
    }

    // slipt title ( remove prefix like ipos-prospect,...)
    $scope.splitTitle = function(rawTitle) {
        if(rawTitle){   
            return rawTitle.split(":")[1];
        }
    }
    
    $scope.isLoadBreadCrum = false;
    $scope.setScrollBreadCrum = function() {
        var scroll = $(window).scrollTop();
        var height = $('#containerRight').height() - scroll + 50 + 'px';
        if (scroll > 150) {

            $('.v3-bread-crum-list').css({
                'height': height
            });

        } else{
            $('.v3-bread-crum-list').css({
                'height': '100%'
            });
        }
   }
    $scope.checkLoadBreadCrum = function() {
        
        if($scope.vars.isShowLeftSidebar){
            if($scope.isLoadBreadCrum){   
                $scope.isLoadBreadCrum = false;
                $('#containerRight')[0].style.float="none";
            }else{          
                if($(window).width() > 800){
                    $scope.isLoadBreadCrum = true;
                    $('#containerRight')[0].style.float="left";
                }           
            }        
            $scope.setScrollBreadCrum();
        }
                              
    }
    
    $scope.collapsePanel = function(panelId) {
        if ($(panelId).hasClass('fa-arrow-circle-down')) {
            $(panelId).removeClass('fa-arrow-circle-down').addClass('fa-arrow-circle-up');                      
        }
        else if($(panelId).hasClass('fa-arrow-circle-up')){
            $(panelId).removeClass('fa-arrow-circle-up').addClass('fa-arrow-circle-down');                      
        }
    }

    $(window).scroll(function () {
        $scope.setScrollBreadCrum();  
    });
    
    $scope.isRunOnTablet = function() {
    	return uiRenderPrototypeService.isRunOnTablet();
    };
    
    $scope.openResource = function(card, reviewPDF) {
    	var self = this;
    	if (!window.cordova) {
	    	if(self.isRunOnTablet()||(!angular.isUndefined(reviewPDF)&&reviewPDF)){
	    		if (card.refDetail['@vpms-suffix'] === 'Print') {
	    			if(self.isRunOnTablet()&&!angular.isUndefined(reviewPDF)&&reviewPDF){
	    				$scope.fileReaderService.download();
	    	    	}else{
	    	    		$scope.fileReaderService.openFileReader('view', card.metadata, [], '', $scope.isRunOnTablet());
   	    				sessionStorage.setItem("signed", self.moduleService.findElementInElement_V3(card.refDetail, ["case-management:Signed"]).$);
	    	    	}
	    		} else if (card.refDetail['@vpms-suffix'] === 'Attachment') {
	    			if(self.isRunOnTablet()&&!angular.isUndefined(reviewPDF)&&reviewPDF){
	    				$scope.fileReaderService.download();
	    	    	}else{
	    	    		$scope.fileReaderService.openFileReader('view', card.refDetail, self.moduleService.convertToArray(self.moduleService.findElementInElement_V3(self.moduleService.detail, ['Attachment'])), 'uploadMode', $scope.isRunOnTablet());
	    	    	}
	    		}
	    	}
    	}else{
    		if (card.refDetail['@vpms-suffix'] === 'Print' && reviewPDF) {
    			$scope.fileReaderService.caseId = salecaseUIService.findElementInDetail_V3(['DocInfo','DocId']);
    			$scope.fileReaderService.openFileReader('view', card.metadata, [], '', $scope.isRunOnTablet());
    		} else if (card.refDetail['@vpms-suffix'] === 'Attachment' && reviewPDF) {
    			$scope.fileReaderService.openFileReader('view', card.refDetail, self.moduleService.convertToArray(self.moduleService.findElementInElement_V3(self.moduleService.detail, ['Attachment'])), 'uploadMode', $scope.isRunOnTablet());
    		}
    	}
    };
    
  ($scope.openFnaDirectly = function openFnaDirectly(){
      //$scope.openDocumentFromMetaList({"DocType":"case-management","Tags":"","DocVersion":"","DocumentStatus":"","OwnerUid":"agentrul@ipos.com","Product":"regular-unit-link","DocId":"309d8330-dcfd-40e1-b0f9-9b99fb1615c4","UpdatedDate":"2016-07-01 13-14-15","BusinessStatus":"DRAFT","Star":"","CreatedDate":"2016-07-01 11-12-43","Archived":"","UpdatedUserUid":"agentrul@ipos.com","DocName":"BC69069132","CaseName":"NewBusiness","$$hashKey":"object:108"});
//      $scope.createNewDocument("case-management", "GTL1", "NewBusiness", "NewBusiness", undefined);
//      $scope.createNewDocument("case-management", "guaranteed-cashback-saver", "NewBusiness", "NewBusiness", undefined);
//      $scope.createNewDocument('case-management', 'FIR', 'renewal', '', {policyNum: 'F0002591', effectiveDate: '2015-02-18'}) ;
      //test egit; author: Nghia Le
    })();
}];

var SidebarController = ['$scope', '$log', '$state', '$filter', 'ajax', 'commonService', 'commonUIService', 'prospectUIService', 'salecaseUIService', 'policyUIService', 'claimUIService', 'clientUIService', 'claimNotificationUIService',
    function($scope, $log, $state, $filter, ajax, commonService, commonUIService, prospectUIService, salecaseUIService, policyUIService, claimUIService, clientUIService, claimNotificationUIService) {

    $scope.init = function init() {
        var self = this;
        self.name = 'SidebarController';
       // self.moduleService = salecaseUIService;
        self.printDebugInfo();
    };
    
    $scope.init();
   /* var portletId = myArrayPortletId["my-newworkspace"];
    // initial PortletURL
    $scope.resourceURL = prospectUIService.initialPortletURL(portletId);*/
    
    $scope.getModuleService = function (docType){
        switch(docType){
            case commonService.CONSTANTS.MODULE_NAME.PROSPECT:
                $scope.moduleService = prospectUIService;
                $scope.content = 'prospect';
                $scope.cardType = 'prospect';
                $scope.sortBy = 'FullName';
                break;
    
            case commonService.CONSTANTS.MODULE_NAME.POLICY:
                $scope.moduleService = policyUIService;
                $scope.content = 'policy';
                $scope.cardType = 'policy';
                 $scope.sortBy = 'Policy_Owner';
                break;
        
            case commonService.CONSTANTS.MODULE_NAME.SALECASE:
                $scope.moduleService = salecaseUIService;
                $scope.content = commonService.CONSTANTS.MODULE_NAME.SALECASE;
                $scope.cardType = commonService.CONSTANTS.MODULE_NAME.SALECASE;
                $scope.sortBy = '-UpdatedDate';
                break;
            case commonService.CONSTANTS.MODULE_NAME.CLAIM:
                $scope.moduleService = claimUIService;
                $scope.content = commonService.CONSTANTS.MODULE_NAME.CLAIM;
                $scope.cardType = commonService.CONSTANTS.MODULE_NAME.CLAIM;
                $scope.sortBy = '-reportDate';
                break;
            case commonService.CONSTANTS.MODULE_NAME.CLIENT:
                $scope.moduleService = clientUIService;
                $scope.content = commonService.CONSTANTS.MODULE_NAME.CLIENT;
                $scope.cardType = commonService.CONSTANTS.MODULE_NAME.CLIENT;
                $scope.sortBy = ['First_Name', 'Surname'];
                break;
            case commonService.CONSTANTS.MODULE_NAME.CLAIM_NOTIFICATION:
                $scope.moduleService = claimNotificationUIService;
                $scope.content = commonService.CONSTANTS.MODULE_NAME.CLAIM_NOTIFICATION;
                $scope.cardType = commonService.CONSTANTS.MODULE_NAME.CLAIM_NOTIFICATION;
                $scope.sortBy = '-UpdatedDate';
                break;
        }
    
    };
    
    $scope.showDocumentList = function($event, docType) {
        $scope.searchText = "";
        var controlbar = document.getElementById('controlbar');
        var leftSidebar = document.getElementById('left-sidebar');
        $scope.leftSideBarLimit= 12; //reset list document to 12 element
        leftSidebar.scrollTop = 0; //reset scrollTop to 0
        if (angular.element(controlbar).css('display') == 'none') {
            angular.element(leftSidebar).css('display', 'inline-block');
            angular.element(controlbar).show();
            $scope.getModuleService(docType);
            setStateSiderbar($event, true);
            if(!commonService.hasValueNotEmpty($scope.moduleService.moduleList)){               
                $scope.getDocumentList();
            };
                
            $('[data-toggle="popover"]').popover('disable');
            $('[data-toggle="popover"]').tooltip('disable');
        } else {
            angular.element(controlbar).css('display', 'none');
            angular.element(leftSidebar).css('display', 'none');
            setStateSiderbar($event, false);
            $('[data-toggle="popover"]').popover('enable');
            $('[data-toggle="popover"]').tooltip('enable');
        }                 
    };
    
    $scope.getDocumentList = function() {
        $scope.moduleService.getDocumentList_V3($scope.resourceURL).then(function(data){
            switch($scope.moduleService.name) {
                case commonService.CONSTANTS.MODULE_NAME.POLICY:
                    $scope.moduleService.moduleList = $scope.moduleService.items.Policy.Policy;
                    break;
                case commonService.CONSTANTS.MODULE_NAME.CLAIM:
                    $scope.moduleService.moduleList = $scope.moduleService.items.getClaimListResponse["return"];
                    break;
                case commonService.CONSTANTS.MODULE_NAME.CLIENT:
                    $scope.moduleService.moduleList = $scope.moduleService.items.getClientListReponse["return"].Clients.Client;
                    break;
                default:
                    $scope.moduleService.moduleList = $scope.moduleService.items.MetadataDocuments.MetadataDocument;
            }

            if ($scope.moduleService.moduleList != undefined){
                if (!$.isArray($scope.moduleService.moduleList)){
                    $scope.moduleService.moduleList = $scope.moduleService.convertToArray($scope.moduleService.moduleList);
                }
                //format datalist to "YYYY-MM-DD hh-mm-ss"
                if ($scope.moduleService.name == commonService.CONSTANTS.MODULE_NAME.SALECASE ||
                    $scope.moduleService.name == commonService.CONSTANTS.MODULE_NAME.CLAIM ||
                    $scope.moduleService.name == commonService.CONSTANTS.MODULE_NAME.CLAIM_NOTIFICATION){
                    $scope.moduleService.moduleList = commonUIService.formatDateList($scope.moduleService.moduleList, $scope.sortBy);
                }
            }else{
                //commonUIService.showNotifyMessage("Error getting " + $scope.moduleService.name + " list!", "fail");
                $log.error('No item');
            }
        });
    };   
    
    function setStateSiderbar($event, flag){
        if(flag==false)
            $($event.currentTarget).closest('.menu-module').children('li').each(function(){$(this).removeClass('ipos_sidemenu_background');});
        else
            $($event.currentTarget).addClass('ipos_sidemenu_background');
    }
    
    //$scope.moudleList = [{"Age":"","DocId":"9c19a95b-2885-429a-bb04-90db41a615d6","IDNum":"","Archived":"Archived","LicenseID":"","ICNumber":"","BirthDate":"","Photo":"","DocType":"prospect","Tags":"","ProspectType":"PERSONAL","DocumentStatus":"","DocVersion":"","OwnerUid":"test@liferay.com","UpdatedDate":"2015-07-10-14-09-47","Occupation":"","FullName":"ABC","BusinessStatus":"DRAFT","Star":"","Gender":"","CreatedDate":"2015-07-10-14-09-47","UpdatedUserUid":"","NameOfCoporation":"","DocName":"prospect-DefaultName"},{"Age":"14","DocId":"049700ba-2029-4cae-896c-caecec52e883","Archived":"","Photo":"","BirthDate":"2002-07-10","DocType":"prospect","Tags":"","ProspectType":"PERSONAL","DocVersion":"","DocumentStatus":"","OwnerUid":"test@liferay.com","UpdatedDate":"2015-07-13 11:27:38","BusinessStatus":"","FullName":"Minh 7/10 - 4","Occupation":"","Gender":"M","Star":"","CreatedDate":"2015-07-10 15:07:06","UpdatedUserUid":"","DocName":"PP52779220"},{"Age":"25","DocId":"36958a33-4dbf-4a11-a716-31dce201923b","IDNum":"","Archived":"","LicenseID":"","BirthDate":"1990-09-04","Photo":"","DocType":"prospect","Tags":"","ProspectType":"PERSONAL","DocumentStatus":"","DocVersion":"","OwnerUid":"test@liferay.com","UpdatedDate":"2015-07-14 13:34:20","Occupation":"RL06","FullName":"Long Hoang 07/14 (Updated)","BusinessStatus":"DRAFT","Star":"","Gender":"M","CreatedDate":"2015-07-13-11-42-26","UpdatedUserUid":"","NameOfCoporation":"","DocName":"prospect-DefaultName"},{"Age":"15","DocId":"5101eed1-b494-454b-8aed-23b116c94af7","Archived":"","Photo":"","BirthDate":"2000-07-13","DocType":"prospect","Tags":"","ProspectType":"PERSONAL","DocVersion":"","DocumentStatus":"","OwnerUid":"test@liferay.com","UpdatedDate":"2015-07-13 11:35:12","BusinessStatus":"","FullName":"Minh 7/13 - 1","Occupation":"","Gender":"M","Star":"","CreatedDate":"2015-07-13 11:35:12","UpdatedUserUid":"","DocName":"PP26616395"},{"Age":"25","DocId":"9a2a62ec-12cc-4809-9332-444930d0f0ed","IDNum":"","Archived":"","LicenseID":"","BirthDate":"1990-09-04","Photo":"","DocType":"prospect","Tags":"","ProspectType":"PERSONAL","DocumentStatus":"","DocVersion":"","OwnerUid":"test@liferay.com","UpdatedDate":"2015-07-13 13:58:53","Occupation":"","FullName":"lhoang test Option (Updated from iOS)","BusinessStatus":"DRAFT","Star":"","Gender":"M","CreatedDate":"2015-07-13-12-28-05","UpdatedUserUid":"","NameOfCoporation":"","DocName":"prospect-DefaultName"},{"Age":"27","DocId":"530775df-862b-4e19-a89c-dfd9e514e799","Archived":"","Photo":"","BirthDate":"1988-07-13","DocType":"prospect","Tags":"","ProspectType":"PERSONAL","DocVersion":"","DocumentStatus":"","OwnerUid":"test@liferay.com","UpdatedDate":"2015-07-13 15:45:44","BusinessStatus":"","FullName":"le Huu nghia","Occupation":"AC01","Gender":"M","Star":"","CreatedDate":"2015-07-13 15:45:44","UpdatedUserUid":"","DocName":"PP76943820"},{"Age":"","DocId":"35c5d848-32ef-4a89-9420-a976448b1dd4","IDNum":"","Archived":"","LicenseID":"","BirthDate":"","Photo":"","DocType":"prospect","Tags":"","ProspectType":"PERSONAL","DocumentStatus":"","DocVersion":"","OwnerUid":"test@liferay.com","UpdatedDate":"2015-07-13-17-11-12","Occupation":"","FullName":"Chedda Corporation Pvt. Ltd.","BusinessStatus":"DRAFT","Star":"","Gender":"","CreatedDate":"2015-07-13-17-11-11","UpdatedUserUid":"test@liferay.com","NameOfCoporation":"","DocName":"prospect-DefaultName"},{"Age":"","DocId":"37a3cf21-174d-423c-bc2d-31a23b02db40","IDNum":"","Archived":"","LicenseID":"","BirthDate":"","Photo":"","DocType":"prospect","Tags":"","ProspectType":"PERSONAL","DocumentStatus":"","DocVersion":"","OwnerUid":"test@liferay.com","UpdatedDate":"2015-07-13-17-12-57","Occupation":"","FullName":"Chedda Corporation Pvt. Ltd.","BusinessStatus":"DRAFT","Star":"","Gender":"","CreatedDate":"2015-07-13-17-12-57","UpdatedUserUid":"test@liferay.com","NameOfCoporation":"","DocName":"prospect-DefaultName"},{"Age":"","DocId":"655f8f8c-a39a-4520-8b4c-967a5286aa12","IDNum":"","Archived":"","LicenseID":"","BirthDate":"","Photo":"","DocType":"prospect","Tags":"","ProspectType":"PERSONAL","DocumentStatus":"","DocVersion":"","OwnerUid":"test@liferay.com","UpdatedDate":"2015-07-13-17-17-18","Occupation":"","FullName":"Chedda Corporation Pvt. Ltd.","BusinessStatus":"DRAFT","Star":"","Gender":"","CreatedDate":"2015-07-13-17-17-17","UpdatedUserUid":"test@liferay.com","NameOfCoporation":"","DocName":"prospect-DefaultName"},{"Age":"23","DocId":"b62ac4e8-ef14-4e75-90de-d7cf304a59f4","Archived":"","Photo":"","BirthDate":"1992-07-13","DocType":"prospect","Tags":"","ProspectType":"PERSONAL","DocVersion":"","DocumentStatus":"","OwnerUid":"test@liferay.com","UpdatedDate":"2015-07-13 17:20:14","BusinessStatus":"","FullName":"Minh test","Occupation":"FAS1","Gender":"M","Star":"","CreatedDate":"2015-07-13 17:20:14","UpdatedUserUid":"","DocName":"PP57491722"},{"Age":"24","DocId":"9bbe2562-ddb2-4224-a558-ce26344b3a07","Archived":"","Photo":"","BirthDate":"1991-07-13","DocType":"prospect","Tags":"","ProspectType":"PERSONAL","DocVersion":"","DocumentStatus":"","OwnerUid":"test@liferay.com","UpdatedDate":"2015-07-13 17:43:36","BusinessStatus":"","FullName":"Test device edited","Occupation":"AGE2","Gender":"M","Star":"","CreatedDate":"2015-07-13 17:40:23","UpdatedUserUid":"","DocName":"PP43535527"},{"Age":"24","DocId":"88f80f0d-ef30-4f27-8577-ef382ce441b2","Archived":"","Photo":"","BirthDate":"1991-07-13","DocType":"prospect","Tags":"","ProspectType":"PERSONAL","DocVersion":"","DocumentStatus":"","OwnerUid":"test@liferay.com","UpdatedDate":"2015-07-13 18:03:52","BusinessStatus":"","FullName":"test 2","Occupation":"BA06","Gender":"M","Star":"","CreatedDate":"2015-07-13 18:03:52","UpdatedUserUid":"","DocName":"PP24766889"},{"Age":"16","DocId":"1e6a629a-2a35-421e-9873-a726de9ff081","Archived":"","Photo":"","BirthDate":"1999-07-14","DocType":"prospect","Tags":"","ProspectType":"PERSONAL","DocVersion":"","DocumentStatus":"","OwnerUid":"test@liferay.com","UpdatedDate":"2015-07-14 09:45:06","BusinessStatus":"","FullName":"Minh 7/14 - 1","Occupation":"","Gender":"M","Star":"","CreatedDate":"2015-07-14 09:45:06","UpdatedUserUid":"","DocName":"PP51617790"},{"Age":"30","DocId":"d02605a8-9dc0-4ed7-9842-9df5a7d84237","IDNum":"","Archived":"","LicenseID":"","Photo":"","BirthDate":"1985-07-14","DocType":"prospect","Tags":"","ProspectType":"PERSONAL","DocVersion":"","DocumentStatus":"","OwnerUid":"test@liferay.com","UpdatedDate":"2015-07-14-14-02-46","BusinessStatus":"","FullName":"le huu Updated Portal 12","Occupation":"ABA1","Gender":"M","Star":"","CreatedDate":"2015-07-14 13:18:16","UpdatedUserUid":"test@liferay.com","NameOfCoporation":"","DocName":"PP94987963"},{"Age":"21","DocId":"7754e304-2c12-4646-8ff4-6c2f9e99e5f2","IDNum":"","Archived":"","LicenseID":"","Photo":"","BirthDate":"1994-07-14","DocType":"prospect","Tags":"","ProspectType":"PERSONAL","DocVersion":"","DocumentStatus":"","OwnerUid":"test@liferay.com","UpdatedDate":"2015-07-14-13-54-12","BusinessStatus":"","FullName":"Minh 7/14 - 2 portal update","Occupation":"ABA1","Gender":"M","Star":"","CreatedDate":"2015-07-14 13:29:50","UpdatedUserUid":"test@liferay.com","NameOfCoporation":"","DocName":"PP93427588"},{"Age":"23","DocId":"575bc830-103a-46b2-a381-0356c5fa1fbe","IDNum":"","Archived":"Archived","LicenseID":"","Photo":"","BirthDate":"1992-11-13","DocType":"prospect","ProspectType":"PERSONAL","Tags":"","DocVersion":"","DocumentStatus":"","OwnerUid":"test@liferay.com","UpdatedDate":"2015-07-14-15-22-44","BusinessStatus":"DRAFT","FullName":"Phuoc Pham","Occupation":"RL06","Gender":"M","Star":"","CreatedDate":"2015-07-14-15-22-44","UpdatedUserUid":"","DocName":"prospect-DefaultName","NameOfCoporation":""},{"Age":"","DocId":"0f55f2c7-7913-4240-a870-595c4391a5c4","Archived":"","LicenseID":"","ICNumber":"","Photo":"","BirthDate":"","DocType":"prospect","ProspectType":"PERSONAL","Tags":"","DocVersion":"","DocumentStatus":"","OwnerUid":"test@liferay.com","UpdatedDate":"2015-08-24 11-07-49","BusinessStatus":"ACCEPTED","FullName":"","Occupation":"","Gender":"","Star":"","CreatedDate":"2015-08-24 11-07-49","UpdatedUserUid":"","DocName":"prospect-DefaultName","NameOfCoporation":""}];
   
    $scope.isNewss = function(){
        return false;
    };
    
    
    /**** ------------------- LEFT SIDEBAR ------------------- ****/
    $scope.increaseLeftSidebarLimit = function() {
        $scope.leftSideBarLimit = $scope.leftSideBarLimit + 5;
    };
    /* expand the side bar view when clicking >> button */
 
    
    $('#left-sidebar-expanded-button').click(function() {
        //$expanedButton = $(this).find('[class*="icon-"]:eq(0)');
        if ($("#left-sidebar").hasClass("left-sidebar-expanded-view")) {
            if($(window).width() > 660){
                $("#left-sidebar").removeClass("left-sidebar-expanded-view").addClass("left-sidebar-expanded-triple-view");
                $("#nav-search-input").removeClass("nav-search-query-expanded-view");
                $("#nav-search-input").addClass("nav-search-query-expanded-triple-view");
            }
        } else if ($("#left-sidebar").hasClass("left-sidebar-expanded-triple-view")) {
            if($(window).width() > 855){                
                $("#left-sidebar").removeClass("left-sidebar-expanded-triple-view").addClass("left-sidebar-expanded-full-view");
                $("#nav-search-input").removeClass("nav-search-query-expanded-triple-view");
                $("#nav-search-input").addClass("nav-search-query-expanded-full-view");
                $("#left-sidebar-contractile-button").addClass("hide");
                $("#left-sidebar-expanded-button").removeClass("fa-angle-double-right");
                $("#left-sidebar-expanded-button").addClass("fa-angle-double-left");
            }
        } else if ($("#left-sidebar").hasClass("left-sidebar-expanded-full-view")) {
            $("#left-sidebar").removeClass("left-sidebar-expanded-full-view").addClass("left-sidebar-expanded-triple-view");
            $("#nav-search-input").removeClass("nav-search-query-expanded-full-view");
            $("#nav-search-input").addClass("nav-search-query-expanded-triple-view");
            $("#left-sidebar-contractile-button").removeClass("hide");
            $("#left-sidebar-expanded-button").removeClass("fa-angle-double-left");
            $("#left-sidebar-expanded-button").addClass("fa-angle-double-right");
        } else {
            $("#left-sidebar").addClass("left-sidebar-expanded-view");
            $("#left-sidebar-contractile-button").removeClass("hide");
            $("#left-sidebar").removeClass("item-list");
            $("#nav-search-input").removeClass("nav-search-query");
            $("#nav-search-input").addClass("nav-search-query-expanded-view");
        }
    });

    /* contract the side bar view when clicking << button */
    $('#left-sidebar-contractile-button').click(function() {
        if ($("#left-sidebar").hasClass("left-sidebar-expanded-view")) {
            $("#left-sidebar").removeClass("left-sidebar-expanded-view");
            $("#nav-search-input").removeClass("nav-search-query-expanded-view");
            $("#nav-search-input").addClass("nav-search-query");
            $("#left-sidebar-contractile-button").addClass("hide");
            $("#left-sidebar").addClass("item-list");
        } else if ($("#left-sidebar").hasClass("left-sidebar-expanded-triple-view")) {
            $("#left-sidebar").removeClass("left-sidebar-expanded-triple-view").addClass("left-sidebar-expanded-view");
            $("#nav-search-input").removeClass("nav-search-query-expanded-triple-view");
            $("#nav-search-input").addClass("nav-search-query-expanded-view");
        }
    });
    
    $('[data-toggle=popover]').popover({
          placement: 'rigth',
          template: '<div class="popover sidebar-popover"><div class="popover-content"></div></div>'
    });

    /**** ----------------- END LEFT SIDEBAR ----------------- ****/
}];

var RelatedDocController = ['$scope', '$log', '$state', '$compile', 'ajax', '$document', 'urlService', 'commonService', 'prospectUIService', 'salecaseUIService', 'policyUIService',
    function($scope, $log, $state, $compile, ajax, $document, urlService, commonService, prospectUIService, salecaseUIService, policyUIService){
    
    $scope.prospects = [1];
    $scope.prospect = ['Document Detail', 'Document Detail', 'Document Detail', 'Document Detail', 'Document Detail', 'Document Detail', 'Document Detail',
                       'Document Detail', 'Document Detail', 'Document Detail', 'Document Detail', 'Document Detail', 'Document Detail', 'Document Detail',
                       'Document Detail', 'Document Detail', 'Document Detail', 'Document Detail', 'Document Detail', 'Document Detail', 'Document Detail',
                       'Document Detail', 'Document Detail', 'Document Detail', 'Document Detail', 'Document Detail', 'Document Detail', 'Document Detail',
                       'Document Detail', 'Document Detail', 'Document Detail', 'Document Detail', 'Document Detail', 'Document Detail', 'Document Detail'];
     $scope.rightSideBarLimit = 10;
    //$('#right-sidebar').scroll(function(){
    $scope.increase=function(){
        $scope.rightSideBarLimit = $scope.rightSideBarLimit + 5;
    };
    function scrollHorizontally(e) {
        e = window.event || e;
        var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
        document.getElementById('right-sidebar').scrollLeft -= (delta*40); // Multiplied by 40
        e.preventDefault();
    }
    if (document.getElementById('right-sidebar').addEventListener) {
        // IE9, Chrome, Safari, Opera
        document.getElementById('right-sidebar').addEventListener("mousewheel", scrollHorizontally, false);
        //document.getElementById('right-sidebar').addEventListener("mousewheel", increaseLeftSideBarLimit, false);
        // Firefox
        document.getElementById('right-sidebar').addEventListener("DOMMouseScroll", scrollHorizontally, false);
    } else {
        // IE 6/7/8
        document.getElementById('right-sidebar').attachEvent("onmousewheel", scrollHorizontally);
    };
}];

var CreateContactCtrl = ['$scope', '$log', 'commonService', 'commonUIService', 'uiRenderPrototypeService',
    function($scope, $log, commonService, commonUIService, uiRenderPrototypeService) {
    
    $scope.showContact = true;
    $scope.contacts =  [
      {
         "name": "prospect",
         "isVisible": true,
         "level": 0,
         "icon": {"main" : "fa fa-user"},
         "view": {
            "icons": []
         },
         "cssClass":"v3-box-1"
      },
      {
         "name": "organization-contact",
         "isVisible": true,
         "level": 0,
         "icon": {"main" : "fa fa-building"},
         "view": {
            "icons": []
         },
         "cssClass":"v3-box-1"
      }
    ]
    //need to convert those obj to uiStructure instances
    .map(function(jsonObj) {
        return uiRenderPrototypeService.createUiStructure('fromJsonMock', [jsonObj]);
    });

    
    $scope.createContact = function(contactType){
        var self = this;
        $scope.showContact = false;
        self.createNewDocument(contactType, undefined, undefined, undefined);
    };
}];
