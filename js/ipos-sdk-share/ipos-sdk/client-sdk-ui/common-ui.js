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

var commonUIModule = angular.module('commonUIModule',['ngMaterial', 'uiRenderPrototypeModule'])

.controller('MessageCtrl', ['$scope', 'urlService', '$mdToast', 'commonUIService', 'commonService', '$translate', '$translatePartialLoader',
	function($scope, urlService, $mdToast, commonUIService, commonService, $translate, $translatePartialLoader) {
	/*$translatePartialLoader.addPart('translation'); 
	$translate.refresh();
	$translate.use('en');*/
	
	$scope.message = commonUIService.message;
	$scope.status = commonUIService.status;
	$scope.closeToast = function() {
	    $mdToast.hide();
	  };
}])

.service('workspaceService',  ['commonService', '$mdDialog', function(commonService, $mdDialog){
	function WorkspaceService(){
		this.name = "workspace";
		this.preDefine = {};
		this.dialog = {};
	};
	
	/**
	 * @param moduleName
	 * @returns preDefine information of a service. If not found, return an empty object (not null/undefined)
	 */
	WorkspaceService.prototype.getPreDefine = function(moduleName){
		var rs = this.preDefine[moduleName];
		if (!commonService.hasValue(rs)){
			rs = {};
			this.preDefine[moduleName] = rs;
		}
		return rs;
	};

	WorkspaceService.prototype.showConfirmDialog = function(title, message, okHandler, cancelHandler) {
		var self = this;
		var dialog = new WSDialog("views/partials/common/dialog/ok-cancel.html", title, message);
		dialog.ok = function(){
			dialog.close();
			if (commonService.hasValue(okHandler)){
				okHandler.call();
			}
		};
		dialog.cancel = function(){
			dialog.close();
			if (commonService.hasValue(cancelHandler)) {
				cancelHandler.call();
			}
		};

		self.dialog = dialog;
	};
	
	WorkspaceService.prototype.showConfirmDialog_YesNo = function(title, message, okHandler, cancelHandler) {
		var self = this;
		var dialog = new WSDialog("views/partials/common/dialog/yes-no.html", title, message);
		dialog.ok = function(){
			dialog.close();
			if (commonService.hasValue(okHandler)){
				okHandler.call();
			}
		};
		dialog.cancel = function(){
			dialog.close();
			if (commonService.hasValue(cancelHandler)) {
				cancelHandler.call();
			}
		};

		self.dialog = dialog;
	};

	WorkspaceService.prototype.showYesNoDialog = function(title, message, okHandler, cancelHandler) {
	    var confirm = $mdDialog.confirm()
	          .title(message)
	          .ok($translate.instant('v3.yesno.enum.Y'))
	          .cancel($translate.instant('v3.yesno.enum.N'));
	    $mdDialog.show(confirm).then(okHandler, cancelHandler);
	};

	return new WorkspaceService();
}])
.service('commonUIService', ['commonService', 'appService', 'workspaceService', 'detailCoreService', '$log', '$filter', '$mdToast', '$animate', '$translatePartialLoader', '$translate', '$mdDialog', 'urlService',
	function(commonService, appService, workspaceService, detailCoreService, $log, $filter, $mdToast, $animate, $translatePartialLoader, $translate, $mdDialog, urlService){
	
	function CommonUIService(){
		this.name = "common";
		var friendlyURL = window.location.pathname;
		var currentPageURL = friendlyURL.substr(friendlyURL.lastIndexOf('/') + 1, friendlyURL.length);
		if (currentPageURL === urlService.urlMap.HOME || currentPageURL === urlService.urlMap.LOGIN) {
			$translatePartialLoader.addPart('common.translation');
			$log.debug('Using common translation file instead of full file!');
		} else {
			$translatePartialLoader.addPart('translation'); 
		}
		$translate.refresh();
		var language = localStorage.getItem('language')
		if (language != undefined && language != 'undefined') {
			$translate.use(language);
		} else {
			$translate.use('en');
		}
	};
	
	CommonUIService.prototype.buildDocumentGroupOf4 = function (documentList){
		var documentGroupOf4 = [];		
		var x = 0;
		var groups = Math.ceil(documentList.length/4);
		var groupOfX = 4;
		for ( var i = 0; i < groups; i++){
			documentGroupOf4[x] = [];
			for ( var count = 0; count < groupOfX; count++){
				if (documentList.length > 0){
					documentGroupOf4[x].push(documentList[0]);
					documentList = documentList.slice(1,documentList.length);
				};
			}
			x++;
		}
		return documentGroupOf4;
	};
	
	CommonUIService.prototype.buildDocumentGroupOfX = function (documentList, number){
		var documentGroupOfX = [];		
		var x = 0;
		var groups = Math.ceil(documentList.length/number);
		var groupOfX = number;
		for ( var i = 0; i < groups; i++){
			documentGroupOfX[x] = [];
			for ( var count = 0; count < groupOfX; count++){
				if (documentList.length > 0){
					documentGroupOfX[x].push(documentList[0]);
					documentList = documentList.slice(1, documentList.length);
				};
			}
			x++;
		}
		return documentGroupOfX;
	};
	
	CommonUIService.prototype.gotoParentState = function($state, params, options) {
		if ($state == undefined || $state.$current == undefined || $state.$current.parent == undefined) {
			throw new Error("invalid state !");
		}
		if ($state.$current.parent.abstract) {
			$state.go($state.$current.parent.parent.name, params, options);
		} else {
			$state.go('^', params, options);
		}
	};

	//DIALOG ////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	CommonUIService.prototype.confirmAndArchiveDocument = function(detailCoreService, fnSuccess) {
		var self = this;
		var title = appService.getI18NText('workspace.archive.confirm.title');
		var message = appService.getI18NText('workspace.archive.confirm.text');
		
		//Show dialog
		workspaceService.showConfirmDialog(title, message, function() {
			detailCoreService.archiveDocument().then(function(success) {
				if (success == 'true'){
					commonService.showGlobalMessage(appService.getI18NText('workspace.archive.success'));
					if(commonService.hasValue(fnSuccess)) {
						fnSuccess.call();
					}
				} else {
					commonService.showGlobalMessage(appService.getI18NText('workspace.archive.fail'), "danger");
				}
			});
		});
	};
	
	
	CommonUIService.prototype.notifyMessage = function(message, data, timeout, color){
    	(!timeout) ? timeout = 2000 : timeout;
    	if(color!= undefined){
    		this.color = color;
    	}else{
    		this.color = "success";
    	}
    	if(data != undefined){
    		if(self.isSuccess(data)){
    			this.message = message ;
    		}else{
    			this.message = "Some Errors Occurred";
    			this.color = "error";
    		}   	
    	}else{
    		this.message = message;
    	}
    	
    	$mdToast.show({
             controller: WorkspaceCtrl,
             templateUrl: contextPathRoot + '/view/myWorkspace/partial/messageToast.html',
             hideDelay: timeout
         });
    };
    
    CommonUIService.prototype.showNotifyMessage = function(message, status, timeout){
    	if(!timeout)
    		timeout = 6000;

		this.message = message;
		this.status = status;
    	$mdToast.show({
    		controller: 'MessageCtrl',
		    templateUrl: contextPathRoot + '/view/common/toast-template.html',
		    hideDelay: timeout,
		    position: 'bottom'
	    });
    };

    /**
     * Show yes/no dialog
     * @param  {String} 	message    will be translated
     * @param  {function} 	yesHandler function will be called when click YES
     * @param  {function} 	noHandler  function will be called when click NO
     */
    CommonUIService.prototype.showYesNoDialog = function(message, yesHandler, noHandler){
    	// var confirm = $mdDialog.confirm();

    	// $translate(message).then(function (titleText) {
    	// 	confirm.title(titleText);
    	// 	return $translate('v3.yesno.enum.Y');
    	// }).then(function (yesText) {    		
	    //     confirm.ok(yesText);
	    //     return $translate('v3.yesno.enum.N')
    	// }).then(function (noText) {    		
	    //     confirm.cancel(noText);
	    // 	$mdDialog.show(confirm).then(yesHandler, noHandler);
    	// });

    	var confirm = $mdDialog.confirm()
	          .title($translate.instant(message))
	          .ok($translate.instant('v3.yesno.enum.Y'))
	          .cancel($translate.instant('v3.yesno.enum.N'));
	    $mdDialog.show(confirm).then(yesHandler, noHandler);
    };
    
    CommonUIService.prototype.closeToast = function() {
        $mdToast.hide();
    };
    
    CommonUIService.prototype.getTimeAgo=function(data,format){
		var existingDateList = ["YYYY-MM-DD hh-mm-ss","YYYY-MM-DD-hh-mm-ss", "YYYY-MM-DD", "DD-MM-YYYY hh-mm-ss", "DD-MM-YYYY-hh-mm-ss", "DD-MM-YYYY"];
		if(data=='' || data==undefined || format==undefined)
			return;
		return moment(data,existingDateList).fromNow();
	};
	
	CommonUIService.prototype.convertToDateTime=function(data,format){
		var existingDateList = ["YYYY-MM-DD hh-mm-ss","YYYY-MM-DD-hh-mm-ss", "YYYY-MM-DD", "DD-MM-YYYY hh-mm-ss", "DD-MM-YYYY-hh-mm-ss", "DD-MM-YYYY"];
		if(data==undefined || format==undefined || data=="")
			return;
		return moment(data, existingDateList).format(format);
	};
	
	 CommonUIService.prototype.formatDateList=function(list,itemType){
    	var self = this;
    	angular.forEach(list, function(item){
			item[itemType.replace("-","")] = self.convertToDateTime(item[itemType.replace("-","")], "YYYY-MM-DD HH-mm-ss");
			if(item.UpdatedDate == "Invalid date"){
				item.UpdatedDate = "2015-01-01 12-00-00";
			}
		});
		return list;
	};
	
	CommonUIService.prototype.sortList = function(list, sortBy, sortReverse) {
        return $filter('orderBy')(list, sortBy, sortReverse);
    };       
	
	/**
	 * Select Prospect basing on its type ['policyOwner', 'AssuredMain', 'AssuredSecond', 'Beneficiaries', 
	 * 'ClientBasicInfo', 'JointApplicationBasicInfo']
	 * Reset prospect for an illustration/application/factfind corresponding to prospect refType
	 */
	CommonUIService.prototype.selectProspect = function(){
		var self = this;
		var deferred = self.$q.defer();
		
		var selectedProspect = self.extraDetail.selection.selectedProspect;
		var refType = selectedProspect.type;
		if(!commonService.hasValueNotEmpty(refType)) return;
		var oldPersonUid = selectedProspect.oldUid;
		var newPersonUid = selectedProspect.newUid;
		selectedProspect.oldUid = newPersonUid;
		if (commonService.hasValueNotEmpty(newPersonUid)){
			self.changeProspect(refType, oldPersonUid, newPersonUid)
			.then(function(detailDto){
				//self.detail = detailDto;//core service should do it
				deferred.resolve(detailDto);
			});
		}
		return  deferred.promise;
	};
	
	CommonUIService.prototype.chooseProspectFromMetaList = function(){
		var self = this;
		var selectedProspect = self.extraDetail.selection.selectedProspect;
		var refType = selectedProspect.type;
		if(!commonService.hasValueNotEmpty(refType)) return;
		var oldPersonUid = selectedProspect.oldUid;
		var newPersonUid = selectedProspect.newUid;
		selectedProspect.oldUid = newPersonUid;
	};
	
	/**
	 * Check to see if a prospect is selected for this tab. (if person element in illustration detail has uid or not)
	 * At the same time, push content of this prospect to prospects array 
	 * to display it on template
	 * @returns true if a prospect is selected for this tab.
	 */
	CommonUIService.prototype.isSelectedProspect = function(){
		var self = this;
		self.extraDetail.selection.prospects = [];
		var refType = self.extraDetail.selection.selectedProspect.type;
		if(!commonService.hasValueNotEmpty(refType)) return;
		var person = self.findElementRefTypeInDetail([], refType);
		self.extraDetail.selection.prospects.push(person);
		var newPersonUid = person.refUid;
		return commonService.hasValueNotEmpty(newPersonUid);
	};
	
	
	CommonUIService.prototype.buildDocumentGroupOf2 = function (documentList){
		var documentGroupOf2 = [];		
		var x = 0;
		var groups = Math.ceil(documentList.length/2);
		var groupOfX = 2;
		for ( var i = 0; i < groups; i++){
			documentGroupOf2[x] = [];
			for ( var count = 0; count < groupOfX; count++){
				if (documentList.length > 0){
					documentGroupOf2[x].push(documentList[0]);
					documentList = documentList.slice(1,documentList.length);
				};
			}
			x++;
		}
		return documentGroupOf2;
	};
	
	CommonUIService.prototype.toggleStar = function (resourceURL, objectMetadata){
		var self = this;
		var deferred = self.$q.defer();
		self.detailCoreService.ListDetailCoreService.prototype.toggleStar.call(self, resourceURL, objectMetadata).then(function(metaData){
/*			if(metaData){
				for (var i = 0; i < self.items.length; i++){
					if (self.items[i].DocId === objectMetadata.DocId){
						//self.items[i].Star = metaData.Star;
						self.items[i].Star = self.findJsonPathInItem(metaData, '$..Star');
						break;
					};
				}
				deferred.resolve(self.items);
			}*/
			deferred.resolve();
		});
		return deferred.promise;		
	};
	
	CommonUIService.prototype.initializeObject = function(objectId, boValidate, noNeedProspectList){
		var self = this;	 
		var deferred = self.$q.defer();
		var moduleName = commonService.CONSTANTS.MODULE_NAME.PROSPECT;
		self.detailCoreService.ListDetailCoreService.prototype.initializeObject.call(self, objectId, boValidate)
		.then(function(data){
			if (!commonService.hasValueNotEmpty(noNeedProspectList))
				self.prepareList(moduleName);//call detail core function
			deferred.resolve(data);
		});
		return  deferred.promise;
	};
	
	CommonUIService.prototype.isInViewMode = function(){
		if (appService.subordinateUid != undefined) {
			return true;
		}
		return false;
	};

	CommonUIService.prototype.isDisable = function() {
		return true;
	};
	
	CommonUIService.prototype.isValidEmailString = function(isSendEmails, strEmails){
		if (isSendEmails != "true"
			&& !self.hasValueNotEmpty(strEmails))
			return true;
		var regex = /([\w\+\-\._]+@[\w\-\._]+\.\w{2,}){1,}([\;]($|[\w\+\-\._]+@[\w\-\._]+\.\w{2,}))*$/;
		return regex.test(strEmails);
	};
	
	CommonUIService.prototype.isEditingForOtherModule = function(module){		
		var preDefine = workspaceService.getPreDefine(module);;
		var preDefineCreateVariable = commonService.CONSTANTS.PREDEFINE[module][0];
		var preDefineEditVariable = commonService.CONSTANTS.PREDEFINE[module][1];
		
		var rs = commonService.hasValue(preDefine[preDefineCreateVariable]);
		if (rs == false){
			rs = commonService.hasValue(preDefine[preDefineEditVariable]);
		}
		return rs;
	};
	
	//************************************ Attention Required ************************************ 
	CommonUIService.prototype.filterAttentionRequiredItemsList = function(list) {
		var resultList = [];
		for (var i = 0; i < list.length; i++) {
			if (this.isInvalidObject(list[i])) {
				resultList.push(list[i]);				
			} 
		}		
		return resultList;
	};
	
	CommonUIService.prototype.isComponent = function(ele) {
		var self = this;
		var prop = self._findProperty(ele, "Rider_Code");
		return prop === undefined;
	};
	CommonUIService.prototype.showHideItems = function() {
		$('#showMore').fadeToggle('fast');
	};
	
	CommonUIService.prototype.isAbleToDo = function(action, requireNotSubmitted) {
		var self = this;
		if (requireNotSubmitted == undefined || requireNotSubmitted == false) {
			return self.checkActionPermission(self.detail, action);
		}
		return self.checkActionPermission(self.detail, action) && !self.isSubmittedStatus();
	};
	
    //go to specific element
	CommonUIService.prototype.moveToSpecificElement = function(areaName) {
        var classTarget = "." + areaName;
      /*  var targetElementbyClass = '.' + module +'_' + selectedIndex + " " + classTarget;
        $(classTarget).show('slow');*/
        var currentElement = $(classTarget);
        $('html, body').animate({
                scrollTop: currentElement.position().top
            },1000
        );
    };
    
    CommonUIService.prototype.isValidDate = function(date, formatDate, minDate, maxDate) {
		// date, minDate, maxDate same format
		if(!commonService.hasValueNotEmpty(formatDate)) {
			formatDate = "YYYY-MM-DD";
		}
		
		var m = new moment(date, formatDate, true);
        if (!m.isValid()) {
            return false;
        }
		
		if(commonService.hasValueNotEmpty(minDate) && m.isBefore(new Date(minDate)) && date !== minDate) {
			return false;
		} else if(commonService.hasValueNotEmpty(maxDate) && m.isAfter(new Date(maxDate)) && date !== maxDate) {
			return false;
		} else {
			return true;
		}
	}
	
    CommonUIService.prototype.addDate = function(date, value, key, formatDate) {
		if(!commonService.hasValueNotEmpty(key)) {
			key = 'd';
		}
		if(!commonService.hasValueNotEmpty(formatDate)) {
			formatDate = "YYYY-MM-DD";
		}
		var m = new moment(date, formatDate, true);
		if(value.indexOf('-') != -1) {
			return m.subtract(parseInt(value.substr(1)), key).format(formatDate);
		} else {
			return m.add(parseInt(value), key).format(formatDate);
		}
	}
	
	CommonUIService.prototype.addDateFromNow = function(value, key, formatDate) {
		return this.addDate(moment().format("YYYY-MM-DD"), value, key, formatDate);
	}
	
	/**
	 * see {@code gotoModuleFromAntherModule()} in main-ctrl.js
	 * @param  {String}  portletId    		Portlet Id
	 * @param  {Object}  portletParams     	parameters for destination porlet
	 * @param  {Object}  options 			other options
	 * @param  {Object}  isOpenNewtab 		
	 */
    //CommonUIService.prototype.goToPortlet = function (portletId, portletParams, options){
	CommonUIService.prototype.goToPortlet = function (portletId, portletParams, isOpenNewtab){
        var pageParams = portletParams;
    	// Put the object into storage
        if(pageParams.actionName){
        	localStorage.setItem('gotoPortletAction', JSON.stringify(pageParams));
        }
        else{
        	localStorage.setItem('pageParams', JSON.stringify(pageParams));
        }
    	
    	
		var newURL = urlService.urlMap[portletId];
		
		
		//if(options && options.isOpenNewtab){
		if(isOpenNewtab){
			var win = window.open(newURL, '_blank');
			win.focus();
		}
		else{
			window.open(newURL, '_self');
		}
		
	}
    
    CommonUIService.prototype.activeSpiner = function (){
    	var spinIcon = "fa fa-spinner fa-spin fa-2x";
    	var icon = $(".activate-spiner").find( "i.fa" );
		if(icon.length > 0) {			
			icon.attr('class', spinIcon);
		}
    }
    
    CommonUIService.prototype.inactiveSpiner = function (){
    	var saveIcon = "fa fa-floppy-o fa-2x";
    	var icon = $(".activate-spiner").find( "i.fa" );
		if(icon.length > 0) {
			icon.attr('class', saveIcon);
		}
    }
    
    /**
     * Return the current sale channel
     * @return {String} type of sale channel
     */
    CommonUIService.prototype.getActiveSaleChannel = function getActiveSaleChannel() {
    	//see {@code ipos-portlet-common\src\main\webapp\view\myNewWorkspace\main.jsp} for more detail
		
    	//return commonService.CONSTANTS.SALE_CHANNEL.AGENT_SALE;
		var defaulChannel = commonService.CONSTANTS.SALE_CHANNEL.AGENT_SALE;//default channel is agent sale?
    	var result;
    	try{
    		result = activeChannel;
    	}catch(e){
    		$log.error(e);
    	}finally{
    		if(
    			result === 'null' //'null' when navigating pages not support yet by java backend
    			|| !result //undefined when navigating pages not support yet by java backend
    		){
    			result = defaulChannel;
    			$log.debug("Set channel to " + defaulChannel);
    		}
    	}
    	
    	return result;
    };

    /**
     * Return the current user role
     * @return {String} type of sale channel
     */
    CommonUIService.prototype.getActiveUserRole = function getActiveUserRole() {
    	//see {@code ipos-portlet-common\src\main\webapp\view\myNewWorkspace\main.jsp} for more detail

    	//return commonService.CONSTANTS.USER_ROLES.AGENT;
		var defaultRole = commonService.CONSTANTS.USER_ROLES.GUEST; //default role is guest
    	var result;
    	try{
    		result = activeRole;
    	}catch(e){
    		$log.error(e);
    	}finally{
    		if(
    			result === 'null' //'null' when navigating pages not support yet by java backend
    			|| !result //undefined when navigating pages not support yet by java backend
    		){
    			result = defaultRole;
    			$log.debug("Set role to " + defaultRole);
    		}
    	}
    	
    	return result;
    };
    
    CommonUIService.prototype.checkValidEmail = function checkValidEmail(data) {
    	var errorMessage= "";
    	if(data == undefined || data ==""){			
    		errorMessage = "MSG-001";
		}else{
			var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			if(re.test(data))
				errorMessage = ""
			else
				errorMessage = "MSG-D023"
		}
    	
    	return errorMessage;
    };
    
	return new CommonUIService();
}])
.service('multiUploadService', ['ajax', 'commonService', 'appService', 'commonUIService', '$http', '$sce', '$mdDialog', 'detailCoreService', '$q', 'uiRenderPrototypeService', '$translate', '$translatePartialLoader', 'connectService',
	function(ajax, commonService, appService, commonUIService, $http, $sce, $mdDialog, detailCoreService, $q, uiRenderPrototypeService, $translate, $translatePartialLoader, connectService){
	
	//Upload File 
	//dnguyen98	
	function MultiUploadService(ajax){
		var self = this;
		self.ajax = ajax;
		self.detailCoreService=detailCoreService;
		self.uiRenderPrototypeService = uiRenderPrototypeService;
		self.init();
	};
	
	MultiUploadService.prototype.init = function(){
		var self = this;
		self.initFile = {name: "", desc: "", data:"", size:"", type:"", validate:""};		
		self.files =[];
		self.filesDS = [];
		self.filesUploadDS = [];
	};
	
	MultiUploadService.prototype.onFileSelect = function ($files, isMultiple){
		var self = this;
		var maxFileLength = 10;
		var fileReadyToUpload = null;
		if(window.Liferay.Fake == true) {			
			fileReadyToUpload = self.filesDS;
		} else {			
			fileReadyToUpload = self.files;
		}
		if(fileReadyToUpload.length < maxFileLength && $files.length<maxFileLength){
			var file = $files;
			for (var i = 0; i< file.length; i++){
				if (fileReadyToUpload.map(function(el){return el.name;}).indexOf(file[i].name) <0){ //find the object's index with a specific property (name) - check file name to do not duplicate 												
					if(file[i].size < 6000000){
						getFileReader(file[i],self.initFile).then(function(data) {
							if(window.Liferay.Fake == true){
								if(data.type.split('/')[0]!="text" && data.type.split('/')[0]!="application" && data.type.split('/')[0]!="image"){
									data.validate = "v3.style.message.sorrySysCurrentlyDoesNotSupportThisFileType";
								} else {
									data.validate ="";
								}
								if(isMultiple == false){
									self.filesDS[0] = data;
								}else{
									self.filesDS.push(data);								
								}
							} else {
								if(data.type.split('/')[0]!="text" && data.type.split('/')[0]!="application" && data.type.split('/')[0]!="image"){
									data.validate = "v3.style.message.sorrySysCurrentlyDoesNotSupportThisFileType";
								}
								if(isMultiple == false){
									self.files[0] = data;
								}else{
									self.files.push(data);								
								}
							}							
				    	});
					} else {
						commonUIService.showNotifyMessage("v3.style.message.file.isTooLarge;" + file[i].name, "fail");
					}
				};			
			};
		} else{
			commonUIService.showNotifyMessage("v3.style.message.youCannotAttachManyFileInTheSameTime", "fail");
		}
	};
	
	MultiUploadService.prototype.onFileSelectDataMigration = function ($files){
		var self = this;
		if(self.files.length < 10 && $files.length<10){
			var file = $files;
			for (var i = 0; i< file.length; i++){
				if (self.files.map(function(el){return el.name;}).indexOf(file[i].name) <0){ //find the object's index with a specific property (name) - check file name to do not duplicate 												
					getFileReader(file[i],self.initFile).then(function(data) {
						if(data.type.split('/')[0]!="text" && data.type.split('/')[0]!="application" && data.type.split('/')[0]!="image"){
							data.validate = "v3.style.message.sorrySysCurrentlyDoesNotSupportThisFileType";
						}
						self.files.push(data);
			    	});
				};			
			};
		} else{
			commonUIService.showNotifyMessage("v3.style.message.youCannotAttachManyFileInTheSameTime", "fail");
		}
	};
	
	/**
	 * @author nnguyen75
	 * 2016.05.18
	 * Select file for uploading portlet configuration file 
	 */
	MultiUploadService.prototype.onFileSelectPortletConfig = function ($files){
		var self = this;
		if(self.files.length < 10 && $files.length<10){
			var file = $files;
			for (var i = 0; i< file.length; i++){
				if (self.files.map(function(el){return el.name;}).indexOf(file[i].name) <0){ //find the object's index with a specific property (name) - check file name to do not duplicate 												
					getFileTextData(file[i],self.initFile).then(function(data) {
						if(data.type.split('/')[0]!="text" && data.type.split('/')[0]!="application" && data.type.split('/')[0]!="image"){
							data.validate = "v3.style.message.sorrySysCurrentlyDoesNotSupportThisFileType";
						}
						self.files.push(data);
			    	});
				};			
			};
		} else{
			commonUIService.showNotifyMessage("v3.style.message.youCannotAttachManyFileInTheSameTime", "fail");
		}
	};
	
	MultiUploadService.prototype.onFileSelectAdminConfig = function ($files){
		var self = this;
		self.init();
		if(self.files.length < 10 && $files.length<10){
			var file = $files;
			for (var i = 0; i< file.length; i++){
				if (self.files.map(function(el){return el.name;}).indexOf(file[i].name) <0){ //find the object's index with a specific property (name) - check file name to do not duplicate 												
					if(file[i].size < 6000000){
						getFileReader(file[i],self.initFile).then(function(data) {
							self.files.push(data);
				    	});
					} else {
						commonUIService.showNotifyMessage("v3.style.message.file.isTooLarge;" + file[i].name, "fail");
					}
				};			
			};
		} else{
			commonUIService.showNotifyMessage("v3.style.message.youCannotAttachManyFileInTheSameTime", "fail");
		}
	};
	
	function getFileReader(file, initFile) {
		var self = this;
		 var deferred = $q.defer();			 																		
		 var reader = new FileReader();				
		 reader.onload = (function (file) {
			 return function (e) {		           
				 var f = angular.copy(initFile);
				 if(window.Liferay.Fake == true){
					 f = file;
				 } else {
					 f.name = file.name;
					 f.desc = file.name;
					 f.size = file.size;
					 f.type = file.type;
				 }
				 f.data = e.target.result;
				 deferred.resolve(f);
           };
		 })(file);		
		 reader.readAsDataURL(file);								
		 return deferred.promise;		        
	 };
	 
	 /**
	  * @author nnguyen75
	  * 2016.05.18
	  * Get portlet configuration file json data
	  */
	 function getFileTextData(file, initFile) {
	   	 var self = this;
		 var deferred = $q.defer();			 																		
		 var reader = new FileReader();				
		 reader.onload = (function (file) {
			 return function (e) {		           
				 var f = angular.copy(initFile);
				 f.data = e.target.result;
				 f.name = file.name;
				 f.desc = file.name;
				 f.size = file.size;
				 f.type = file.type;
				 deferred.resolve(f);
           };
		 })(file);		
		 reader.readAsText(file);								
		 return deferred.promise;		        
	 };
	 
	 MultiUploadService.prototype.validateFileList = function (fileList){
		 for(var i = 0; i<fileList.length; i++){			 
			 if(fileList[i].validate != "")
				 return true;			 
		 }
		 return false;
	 }
	
	 MultiUploadService.prototype.handleFileSelectionAdmin = function (moduleService,portletId, docId){		
		var self = this;
		self.isAttachmentFinished = true;
    	self.count = self.files.length;
    	/*for(var i = 0; i< self.files.length; i++){*/
    		var resourceURL = self.detailCoreService.ListDetailCoreService.prototype.initialMethodPortletURL(portletId,"uploadVpmFileAdminConfig");	
	        resourceURL.setParameter("fileName", self.files[0].name);
	        resourceURL.setParameter("fileSize", self.files[0].size);
	        resourceURL.setParameter("fileDesc", self.files[0].desc);
	        resourceURL.setParameter("docID", docId);
	        resourceURL = resourceURL.toString();
	        var fileData =  self.files[0].data.split(',')[1];
	        ajax.postRuntime(resourceURL, "", fileData, function(result){
	        	self.init();
            	/*$rootScope.uploading = false;*/
            	if (result == null || result == undefined || result == "" || result == "null") {
            		commonUIService.showNotifyMessage("v3.style.message.ErrorUpdatingFile");
            	} else {
            		commonUIService.showNotifyMessage("v3.style.message.UpdateFileSuccessfully", "success");
            		/*initUploadFile();*/
            	}
			});			      
    	/*};	*/					
	 };
	 
	 MultiUploadService.prototype.uploadUiDataModelFileSelectionAdmin = function (moduleService,portletId, fileName){		
		var self = this;
		self.isAttachmentFinished = true;
    	self.count = self.files.length;
    	//var fileName = self.files[0].name.substr(0, self.files[0].name.lastIndexOf('.')) + ".json";
    	var jsonFileName = fileName + ".json";
    	/*for(var i = 0; i< self.files.length; i++){*/
    		var resourceURL = self.detailCoreService.ListDetailCoreService.prototype.initialMethodPortletURL(portletId,"uploadUiDataModelAdminConfig");	
	        resourceURL.setParameter("fileName", jsonFileName);
	        //resourceURL.setParameter("refDocType", self.files[0].refDocType);
	        //resourceURL.setParameter("fileSize", self.files[0].size);
	        //resourceURL.setParameter("fileDesc", self.files[0].desc);
	        //resourceURL.setParameter("docID", docId);
	        resourceURL = resourceURL.toString();
	        var fileData =  self.files[0].data.split(',')[1];
	        ajax.postRuntime(resourceURL, "", fileData, function(result){
	        	self.init();
            	/*$rootScope.uploading = false;*/
            	if (result == null || result == undefined || result == "" || result == "null" || result[0] == 0) {
            		commonUIService.showNotifyMessage("v3.style.message.ErrorUpdatingFile");
            	} else {
            		commonUIService.showNotifyMessage("v3.style.message.UpdateFileSuccessfully", "success");
            		/*initUploadFile();*/
            	}
			});			      
    	/*};	*/					
	 };
	 MultiUploadService.prototype.uploadAllFileUiDataModelFileSelectionAdmin = function (files,portletId){		
		var self = this;
		self.isAttachmentFinished = true;
    	self.count = self.files.length;
    	for(var i = 0; i < files.length; i++){
    		var fileName = files[i].name;
    		var resourceURL = self.detailCoreService.ListDetailCoreService.prototype.initialMethodPortletURL(portletId,"createUiDataModelAdminConfig");	
	        resourceURL.setParameter("fileName", fileName);
	        resourceURL = resourceURL.toString();
	        var fileData =  self.files[i].data.split(',')[1];
	        ajax.postRuntime(resourceURL, "", fileData, function(result){
	        	self.init();
            	/*$rootScope.uploading = false;*/
            	if (result == null || result == undefined || result == "" || result == "null" || result[0] == 0) {
            		commonUIService.showNotifyMessage("v3.style.message.ErrorUpdatingFile");
            	} else {
            		commonUIService.showNotifyMessage("v3.style.message.UpdateFileSuccessfully", "success");
            		/*initUploadFile();*/
            	}
			});			      
    	};				
	 };
			
	/**
     * Upload a file and save it in system
     *
     * @param  {String} portletId       Portlet ID is in use
     * @param  {Object} file			Data information
     * @return {Object}                 Angular Promise, include data information if upload success
     */
	MultiUploadService.prototype.uploadFile = function (portletId, file){
		var defer = $q.defer();		
		var resourceURL = detailCoreService.ListDetailCoreService.prototype.initialMethodPortletURL(portletId,"uploadFileCommon");
		if(!window.cordova && !window.Liferay.Fake) {
			resourceURL.setParameter("fileName", file.name);
		    resourceURL.setParameter("fileSize", file.size);
		    resourceURL.setParameter("fileDesc", file.desc);
        }
        resourceURL = resourceURL.toString();
        if(!window.Liferay.Fake){
        	var fileData =  file.data.split(',')[1];
        }	        
        connectService.exeAction({
	    	actionName: "RESOURCE_UPLOAD",
	    	actionParams: [file.name, file.desc],
	    	resourceURL: resourceURL,
	    	data: fileData,
	    	file: file
	     }).then(function(data){
	    	 if(data !=""){
					defer.resolve(data);
	        	}
	        	else{
	        		defer.resolve();
	        	}
	     });		
        return defer.promise;
	}
	
	MultiUploadService.prototype.removeFile = function (moduleService,$index){		
		if(moduleService.findElementInElement_V3(moduleService.detail, ['Attachments'])['@counter'] > moduleService.findElementInElement_V3(moduleService.detail, ['Attachments'])['@minOccurs']){
			moduleService.findElementInElement_V3(moduleService.detail, ['Attachment']).splice($index,1);
			moduleService.findElementInElement_V3(moduleService.detail, ['Attachments'])['@counter']=moduleService.findElementInElement_V3(moduleService.detail, ['Attachment']).length;
		}else{
			moduleService.findElementInElement_V3(moduleService.detail, ['Attachments'])['@counter'] = moduleService.findElementInElement_V3(moduleService.detail, ['Attachments'])['@minOccurs'];			
		}
		commonUIService.showNotifyMessage("v3.style.message.DeleteFileSuccessfully", "success");
	};
	// End Upload File
	
	
	return new MultiUploadService(ajax);
}])
.service('fileReader', ['ajax', 'commonService', 'appService', 'commonUIService', '$q', '$http', '$sce', '$injector', '$mdDialog', 'detailCoreService', 'urlService', 'connectService', '$log', 'loadingBarService',
	function(ajax, commonService, appService, commonUIService, $q, $http, $sce, $injector, $mdDialog, detailCoreService, urlService, connectService, $log, loadingBarService){
	
	function FileReaderService(ajax){
		var self = this;
		self.ajax = ajax;
		self.detailCoreService = detailCoreService;
		self.isShowed = false;
		self.isShowSubmitApplication = false;
	};		
	
	//for testing
	FileReaderService.prototype.showMore=function($event){
		if (!FileReaderService.isShowed){
			var position = angular.element(document.getElementsByClassName('fa-ellipsis-v')[0]).offset();
			var arrowPositionX = $event.currentTarget.offsetLeft + $(event.currentTarget).width()/2-13;
			var appenedContent = document.getElementsByClassName('file-reader-menu-container')[0];
			//angular.element(arrow).css('top', position.top);
			$('#showMenu').fadeToggle('fast');
			$(appenedContent).before("<span class='menu-arrow menu-arrow-action' style='left:"+arrowPositionX+"px;position: fixed;'></span>");
			FileReaderService.isShowed=true;
		}else{
			document.getElementById('showMenu').removeChild(document.getElementsByClassName('menu-arrow')[0]);
			$('#showMenu').hide();
			FileReaderService.isShowed=false;
		}
	};
	
	
	FileReaderService.prototype.toggleList = function() {
		var self = this;
        $("#endorse-menu-item").toggleClass("active-actionmenu");
        $("#endorse-submenu-caret").toggleClass("rotate-caret");
        var list = document.getElementById("submenu-endorse");
        
        if (list.style.display == "none" || list.style.display == "") {
        	if(self.moduleService.endorsementReason.LazyRestriction.EReason.Option.length > 6){
        		$('.submenu-action')[0].style.overflow = "auto";
        	}else{
        		$('.submenu-action')[0].style.overflow = "hidden";
        	}
            $("#submenu-endorse").slideDown();
        } else {
            $("#submenu-endorse").slideUp();
        }
    };
	
	//end for testing
   
       
	FileReaderService.prototype.openFileReader=function(type,item,listFile,mode,isRunOnTablet){
		var deferred = $q.defer();
		this.fileLoaded=false;
		this.isDetail=false;
		this.isPrintPDF=true;
		this.isFileUploadPreview=false;
		this.fileDetail=item;
		this.content="";
		this.source="";
		this.caseId="";
		if (type!='download' && !isRunOnTablet) {
			this.isReader=true;
			this.isReaderDocumentCenterDS=false;
		}
		if (type=='viewDocumentCenterDS') {
			this.isReaderDocumentCenterDS=true;
			this.isReader=false;
		}
		if (listFile!=null) {
			this.list=listFile;
		}
		if (mode=='uploadMode') {
			this.isFileUploadPreview=true;
		}
		var readerService=this;
		if (angular.isString(item))
			var fileType=item.substr((item.lastIndexOf('.') + 1)).toLowerCase();
		else if (this.isFileUploadPreview) {
			var fileName = this.detailCoreService.ListDetailCoreService.prototype.findElementInElement_V3(item,['FileName']).$;
			var fileType = fileName.substr((fileName.lastIndexOf('.') + 1)).toLowerCase();
		}
		else{
			// var fileType=item.FileName.substr((item.FileName.lastIndexOf('.') + 1)).toLowerCase();
			var fileName = item.FileName;
			var fileType = fileName.substr((fileName.lastIndexOf('.') + 1)).toLowerCase();
		}
		
		if (fileType=="jpg" || fileType=="pdf" || fileType=="png" || fileType=="jpeg" ||type=='download' || window.cordova) {
			this.fileNotFoundMessage="";
			if (angular.isString(item)){
				if (type=="view") {
			    	 if (fileType=='pdf') {
			    		 readerService.content = $sce.trustAsResourceUrl(window.location.origin+item);
			    	 }else{
			    		 readerService.source = $sce.trustAsResourceUrl(window.location.origin+item);
			    	 }
			    	 readerService.fileLoaded=true;
			    	 this.fileUrl = item;
			     }
			}
			else {
				var resourceURL = this.detailCoreService.ListDetailCoreService.prototype.initialMethodPortletURL(this.portletId,"fileDownload");
				if (item.DocId==undefined) {
					if (!window.cordova) {
						if(!window.Liferay.Fake)
							resourceURL.setParameter("docId",item['@refResourceUid']);
					}
					readerService.docId=item['@refResourceUid'];
					readerService.fileName = fileName;
					this.isFileUploadPreview=true;
				}
				else{
					if (!window.cordova && !window.Liferay.Fake) {
						resourceURL.setParameter("docId", item.DocId);
					}
					readerService.docType=item.DocType;
					readerService.product='';
					readerService.docId=item.DocId;
					readerService.fileName=fileName;
					readerService.fileDesc=item.Name;
				}
				
				resourceURL = resourceURL.toString();
				var contentType=setContentType(fileType);
				
				connectService.exeAction({
			    	actionName: "RESOURCE_DOWNLOAD",
			    	actionParams: [readerService.docId, readerService.caseId, readerService.fileName],
			    	resourceURL: resourceURL,
			    	isResourceFile: true,
			    	contentType: contentType
			     }).then(function(data){
			    	 if (window.cordova) {
		                if(data.errCode == "110"){
                            commonUIService.showNotifyMessage("v3.mobile.check.network.110","fail");
		                }
			    		 
			    	 } else {
						 deferred.resolve();
						 readerService.file = new Blob([data], {type: contentType});
					     readerService.fileUrl=URL.createObjectURL(readerService.file);
					     if (type=="view" || type=="viewDocumentCenterDS") {
					    	 if (fileType=='pdf') {
					    		 readerService.content = $sce.trustAsResourceUrl(readerService.fileUrl);
					    	 }else{
					    		 readerService.source = $sce.trustAsResourceUrl(readerService.fileUrl);
					    	 }			    	
					     }
					     else{
					    	 var anchor = document.createElement("a");
					    	 anchor.href =  readerService.fileUrl;
					    	 if(readerService.isFileUploadPreview){
					    		 var fileName = readerService.detailCoreService.ListDetailCoreService.prototype.findElementInElement_V3(readerService.fileDetail,['FileName']).$;
					    		 anchor.download = fileName;
					    	 }else{
					    		 var fileName = readerService.fileDetail.FileName;
					    		 anchor.download = fileName;
					    	 }			    	 
					    	 anchor.click();
					     }
					     readerService.fileLoaded=true;
			    	 }
				});
				
			}
				
		}
		else{
			this.fileLoaded=true;
			this.fileNotFoundMessage="v3.style.message.sorrySysCurrentlyDoesNotSupportThisFileType"
		}
		
		return deferred.promise;
	};
	
	function setContentType(fileType){
		var contentType;
		if (fileType=='pdf') {
			contentType="application/pdf";
		}
		else if(fileType=='jpg' || fileType=='jpeg' || fileType=='png'){
			contentType="image/jpeg";
		}
		else if(fileType=='doc'){
			contentType="application/msword";
		}
		return contentType;
	}
	FileReaderService.prototype.closeFileReader=function(){
		URL.revokeObjectURL(this.file);
		this.isReader=false;
		this.isReaderDocumentCenterDS=false;
		FileReaderService.isShowed=false;
		if(this.isPrintPDF==true){
			this.isPrintPDF=false;
		}
		if(this.sendEmail==true){
			this.sendEmail=false;
		}
//		if (window.location.href.indexOf('WorkstepId') != -1) {
//			loadingBarService.showLoadingBar();
//			window.open(urlService.urlMap.NEW_MY_WORKSPACE, '_self');
//		}
	}
	FileReaderService.prototype.download=function($event){
		var anchor = document.createElement("a");
   	 	anchor.href = this.fileUrl;
   	 	if (this.isPrintPDF==true) {
   	 		anchor.download="Document";
		}
   	 	else{
   	 		if(this.isFileUploadPreview){
   	 			anchor.download = this.fileDetail.FileName.$;
   	 		}else{
   	 			anchor.download = this.fileDetail.FileName;
   	 		}
   	 	} 	
   	 	anchor.click();
	};
	
	FileReaderService.prototype.send = function(){
		if (!this.isDetail) {
			this.sendEmail? this.sendEmail=false:this.sendEmail=true;
			if (this.sendEmail) {						
//				$('#ipos_file_right').attr('flex','0');
				$('#ipos_file_content').attr('flex','70');
				$('#ipos_send_email_detail').attr('flex','25');
			}
			else{
//				$('#ipos_file_right').attr('flex','5');
				$('#ipos_file_content').attr('flex','90');
				$('#ipos_send_email_detail').attr('flex','5');
			}
		}
	};
	
	FileReaderService.prototype.showFileDetail=function(){
		if (!this.sendEmail) {
			this.isDetail? this.isDetail=false:this.isDetail=true;
			if (this.isDetail) {						
//				$('#ipos_file_right').attr('flex','0');
				$('#ipos_file_content').attr('flex','70');
				$('#ipos_file_detail').attr('flex','25');
			}
			else{
//				$('#ipos_file_right').attr('flex','5');
				$('#ipos_file_content').attr('flex','90');
				$('#ipos_file_detail').attr('flex','5');
			}
		}
	}
	FileReaderService.prototype.changeFile=function(option){
		if (this.isFileUploadPreview==true) {
			
			if (this.list[0]['@refResourceDocType']=="") {
				this.list.splice(0,1);
			}
		}
		if (this.list.length>1) {		
			for (var int = 0; int <this.list.length; int++) {
				if (this.list[int]==this.fileDetail) {
//					$('#ipos_file_right').attr('flex','5');
					$('#ipos_file_detail').attr('flex','5');
					if (option=='next') {
						if (int==this.list.length-1) {
							this.openFileReader('view',this.list[0],null,null);
						}
						else{
							this.openFileReader('view',this.list[int+1],null,null);
						}
					}
					if (option=='previous') {
						if (int==0) {
							this.openFileReader('view',this.list[this.list.length-1],null,null);
						}
						else{
							this.openFileReader('view',this.list[int-1],null,null);
						}
					}					
					break;
				}
			}
		}
	}	
	FileReaderService.prototype.showPDF = function(resourceURL){
		var readerService=this;
		var deferred = $q.defer();
		this.isPrintPDF=true;
		this.fileLoaded=false;
		this.isDetail=false;
		this.isValid=true;
		this.isReader=true;
		if (window.cordova) {
			this.isReader = false;
		}
		this.sendEmail=false;
		this.content="";
		this.source="";
		this.fileNotFoundMessage="";
		var currentDate = new Date();
		var day = currentDate.getDate();
		var month = currentDate.getMonth() + 1
		var year = currentDate.getFullYear();
		this.currentDate=day+'/'+month+'/'+year;
		
		/*$http.get(resourceURL,{responseType:'arraybuffer'}).success(function(data){
			 $log.debug(data);
			 readerService.file = new Blob([data], {type: "application/pdf"});
		     readerService.fileUrl = URL.createObjectURL(readerService.file);	
		     readerService.content = $sce.trustAsResourceUrl(readerService.fileUrl);
		     readerService.fileSize=(readerService.file.size/1000)+'KB';
		     readerService.fileLoaded=true;
		     deferred.resolve(data);
		});*/	        
	        
		connectService.exeAction({
	    	actionName: "MODULE_PRINTPDF_V3_1",
	    	actionParams: [readerService.docType, readerService.docId, readerService.template, readerService.product],
	    	resourceURL: resourceURL,
            data: readerService.dataHTML,
	    	isResourceFile: true
	     }).then(function(data){

             if(data.errCode == "110"){
                 commonUIService.showNotifyMessage("v3.mobile.check.network.110","fail");
                 deferred.resolve(data);
             }
             else{

                 readerService.file = new Blob([data], {type: "application/pdf"});
                 readerService.fileUrl = URL.createObjectURL(readerService.file);
                 readerService.content = $sce.trustAsResourceUrl(readerService.fileUrl);
                 readerService.fileSize=(readerService.file.size/1000)+'KB';
                 readerService.fileLoaded=true;
                 deferred.resolve(data);

             }

	     });
		
		return deferred.promise;
	}
	FileReaderService.prototype.PDFEmail = function(emailList){
		var self = this;
		this.successEmail = [];
		/*this.failEmail= [];*/
		/*this.sentEmail=false;*/
        if (commonService.hasValueNotEmpty(emailList)) {
            var emails = emailList.split(',');
            var isValidEmail = true;
            for (var i = 0; i < emails.length; i++) {
                if (commonUIService.checkValidEmail(emails[i]) != '') {
                	isValidEmail = false;
                    this.errorEmail=emails[i];
                    this.errorMessage="MSG-D023";
                    break;
                }
            }
            if (isValidEmail) {
                this.isValid=true;
                for (var i = 0; i < emails.length; i++) {
                	var email = emails[i];
                	this.sharePDFEmail(emails[i]).then(function(data)
                		{
                			if (self.successEmail.length == emails.length){
                				commonUIService.showNotifyMessage("v3.style.message.EmailSent","success");
                			}
                		}
                		);
                }
            } else {
                this.isValid=false;
            }
        } else {
        	this.isValid=true;
        }
    };
    
	FileReaderService.prototype.sharePDFEmail = function(email) {
		var self = this;
		var deferred = $q.defer();
		var resourceURL = self.detailCoreService.ListDetailCoreService.prototype.initialMethodPortletURL(self.portletId, "sendPDFEmail");
        var fileName = "PDF";
        resourceURL.setParameter("userEmail", email);
        /*resourceURL.setParameter("docType", docType);*/
        resourceURL.setParameter("fileName", fileName);
        resourceURL = resourceURL.toString();
      	$http.get(resourceURL).success(function(data){
                self.successEmail.push(email);
            deferred.resolve(data);
		});
		return deferred.promise;
    }
	
	return new FileReaderService(ajax);
	
}])
.service('pingService', ['ajax', '$log', function(ajax, $log){
	/**
	 * This service is intended to ping server every 10mins
	 * to keep session alive all the time if still opening from browser
	 * @param $http
	 * @param $log
	 */
	function PingService(ajax, $log){
		var self = this;
		self.DURATION = 300000; //1000*60*5 (5mins)
		self.ajax = ajax;
		self.$log = $log;
		self.interval = undefined;
		self.ping = function(){
			if(sessionTimeout == -1){ // keep session active
				ajax.get('ping').success(function(data) {
					$log.debug("****** ping ******");
				});
			}else{
				clearInterval(self.interval);
			}
		};
		self.init = function(){
			self.interval = setInterval(function(){
				self.ping();
			}, self.DURATION);
		};
		//Disable ping service in V3
		// self.init();
	};
	
	return new PingService(ajax, $log);
	
}])

.service('notificationFromServer', ['$log', '$translate', function($log, $translate){
	var notification= this;
	notification.events = {
			"GO_TO_HOME_PAGE":function(data){
				var defaultLandingPage = localStorage.getItem("defaultLandingPage");
				if(defaultLandingPage){
					defaultLandingPage = '/web/integral/home';
				}
				window.location.href= themeDisplay.getPathContext() + defaultLandingPage;
			},
			"SESSION_DESTROY":function(data){
	    		if(notification.isOpen()){
	    			var msg=$translate.instant('v3.errorinformation.message.alert.sessionexpired');
	    			window.localStorage.setItem('logoutCause',msg);
	    		}    		
	    		notification.doSignOut();
	    	},
	    	"FORCE_LOGIN":function(data){
	    		if(notification.isOpen()){
	    			var msg=$translate.instant('v3.errorinformation.message.alert.signinanother');
	    			window.localStorage.setItem('logoutCause',msg);
	    		}    		
	    		notification.doSignOut();
	    	},
	    	"INVALID_USER":function(data){
				notification.doSignOut();
	    	}			
	}
		
	notification.addEvent = function(eventName,action){
		notification.events[eventName] = action;
	}
	
	notification.init=function(channel){
		var resolve = null;
		var reject = null;
		return new Promise(function (resolve, reject) {	
        	if(!window.notificationSocket){		
    			try{
    				var protocol = window.location.protocol === 'http:' ? 'ws://' : 'wss://';
    				var wsUrl = protocol + location.host + '/ipos-portal-hook/notification-endpoint/'+channel;
    				window.notificationSocket = new WebSocket(wsUrl);			
    			}catch (e) {
    				reject();
    			}			
    			notificationSocket.onopen = function() {
    				$log.debug("Sessions EndPoint Opened");
    				resolve();
    			}
    			window.notificationSocket.onclose = function() {
    				$log.debug("Sessions EndPoint Closed");
    				notification.close();
    			}
    			window.notificationSocket.onerror = function(evt) {
    				$log.error("Sessions EndPoint error occurred: " + evt.data);
    				reject();
    			}			
    			window.onbeforeunload = function(event) {
    				$log.debug("Sessions EndPoint window onbeforeunload");
    				window.notificationSocket = undefined;
    				notification.close();
    			};
    			window.notificationSocket.onmessage = function(evt) {
    				$log.debug("Sessions EndPoint was received:" + evt.data);
    				if(notification.isOpen()){
    					var jsonData = JSON.parse(evt.data);
    					var eventName = jsonData.event;
    					var actionData = jsonData.data;
    					var action = notification.events[eventName];
    					if (action && typeof(action) === "function") {
    						action.call(actionData);
    					}
    				}else{
    					$log.debug("notificationSocket have been closed." );
    				}
    			};
    		}else{
    			resolve();
    		}
        });
	}
	
	notification.send=function(event,data){
		var message = {
				event:event,
				data:data
		}		
		window.notificationSocket.send(JSON.stringify(message));
	}
	
	notification.isOpen = function(){
		return window.notificationSocket && window.notificationSocket.readyState===WebSocket.OPEN;
	};
	
	notification.close = function(){
		if(notification.isOpen()){
			window.notificationSocket.close();
		}
		window.notificationSocket = undefined;
	}
	
	
	
}])
.service('printPdfService', ['ajax', '$q', 'detailCoreService', 'commonService', 'fileReader', 'connectService', function(ajax, $q, detailCoreService, commonService, fileReader, connectService) {
	/**
	 * @author nnguyen75
	 * Service to generate PDF and show to UI
	 */
	function PrintPdfService(ajax) {
		var self = this;
		self.ajax = ajax;
		self.detailCoreService = detailCoreService;
		self.fileReaderService = fileReader;
		self.isShowSubmitApplication = false;
	};
	
	PrintPdfService.prototype.getTemplateList = function() {
		var self = this;
		var deferred = $q.defer();
		var resourceURL = self.detailCoreService.ListDetailCoreService.prototype.initialMethodPortletURL(self.portletId, "invokeRuntime");
		
		/*var runtimeURL = self.moduleService.commonService.getUrl(self.moduleService.commonService.urlMap.GET_LIST_PDF_TEMPLATE, [self.moduleService.name, self.product, self.actionType]);		
		ajax.getRuntime(resourceURL.toString(), runtimeURL, function(data) {
	        var list = self.moduleService.findElementInElement_V3(data, ['templates']);
	        if (!$.isArray(list)) {
	            var temp = list;
	            list = [];
	            list.push(temp);
	        };
	        self.listTemplate = [];
	        for (var i = 0; i < list.length; i++) {
	        	self.listTemplate.push(self.moduleService.findElementInElement_V3(list[i], ['@id']));
	        	if (self.moduleService.name == commonService.CONSTANTS.MODULE_NAME.PROSPECT ||
	        			self.moduleService.name == commonService.CONSTANTS.MODULE_NAME.CORPORATE ||
	        	        self.moduleService.name == commonService.CONSTANTS.MODULE_NAME.AGENT_PAYMENT ||
	        	        self.moduleService.name == commonService.CONSTANTS.MODULE_NAME.CLIENT_PAYMENT ||
	        			(self.moduleService.name == commonService.CONSTANTS.MODULE_NAME.FACTFIND && self.actionType == 'inside') ||
	        			(self.moduleService.name == commonService.CONSTANTS.MODULE_NAME.FACTFIND && self.actionType == 'abridge') ||
	        			(self.product=='term-life-secure') ||
	        			(self.product=='guaranteed-cashback-saver') || 
		        		(self.product == 'FIR' && (self.actionType == 'ip-endorsement' || self.actionType == 'cr-endorsement' || self.actionType == 'n-endorsement' || self.actionType == 'ip-endorsement-abridge' || self.actionType == 'cr-endorsement-abridge' || self.actionType == 'n-endorsement-abridge'))
		        		||(self.product == 'GTL1')
		        		||(self.product == 'motor-private-car-m-as')
		        		||(self.product == 'personal-accident')) {
	        		self.listTemplate.push(self.moduleService.findElementInElement_V3(list[i], ['@id']));
	        	} else {
	        		self.listTemplate.push(self.moduleService.findElementInElement_V3(list[i], ['template-name']));
	        	}
	        }
	        deferred.resolve(data);
		});*/
		
		connectService.exeAction({
	    	actionName: "GET_LIST_PDF_TEMPLATE",
	    	actionParams: [self.moduleService.name, self.product, self.actionType],
	    	resourceURL: resourceURL.toString()
		 }).then(function(data){
			 var list = self.moduleService.findElementInElement_V3(data, ['templates']);
			 if (!$.isArray(list)) {
	            var temp = list;
	            list = [];
	            list.push(temp);
			 };
			 self.listTemplate = [];
			 for (var i = 0; i < list.length; i++) {
	        	self.listTemplate.push(self.moduleService.findElementInElement_V3(list[i], ['@id']));
			 }
			 deferred.resolve(data);
		 });
		
		return deferred.promise;
	};
	

	PrintPdfService.prototype.generatePdf = function(portletId, moduleService, product, actionType, isOpenedFileReader, dataHTML) {
		var self = this;
		var deferred = $q.defer();
		self.portletId = portletId;
		self.moduleService = moduleService;
		self.product = product;
		self.actionType = actionType;
		
		var resourceURL = self.detailCoreService.ListDetailCoreService.prototype.initialMethodPortletURL(self.portletId, "showPdf");
		if (!isOpenedFileReader)
		 {
			self.template = undefined;
			self.getTemplateList().then(function() {
		        self.template = self.listTemplate[0];
		        var url = "";
		        self.fileReaderService.docType = self.moduleService.name;
		        self.fileReaderService.product = product;
		        self.fileReaderService.template = self.template;
		        self.fileReaderService.docId = self.moduleService.findElementInDetail_V3(['DocId']);
                self.fileReaderService.dataHTML = dataHTML;
		        
		        //add button to show submit application
		        self.fileReaderService.isShowSubmitApplication = self.isShowSubmitApplication;
		        
		        if (self.moduleService.name == commonService.CONSTANTS.MODULE_NAME.SALECASE) {
		        	//nle32: for policy servicing GCS
		    		url = self.moduleService.commonService.getUrl(self.moduleService.commonService.urlMap.MODULE_PRINTPDF_V3_1, [self.moduleService.name, self.moduleService.findElementInDetail_V3(['DocId']), self.template, self.product, self.moduleService.businessType]);
		        } else if (
		        	self.moduleService.group === commonService.CONSTANTS.PRODUCT_GROUP.GROUP_TERM_LIFE ||
		        	self.moduleService.group === commonService.CONSTANTS.PRODUCT_GROUP.TRAVEL ||
		        	self.moduleService.group === commonService.CONSTANTS.PRODUCT_GROUP.UNIT_LINK ||
		        	self.moduleService.group === commonService.CONSTANTS.PRODUCT_GROUP.DIRECT_PA || 
		        	self.moduleService.group === commonService.CONSTANTS.PRODUCT_GROUP.DIRECT_SALE_HOME||
		        	self.moduleService.productName == commonService.CONSTANTS.PRODUCT.DIRECT_SALE_MOTOR ||
		        	self.moduleService.group === commonService.CONSTANTS.PRODUCT_GROUP.ENDOWMENT) {
		        	url = self.moduleService.commonService.getUrl(self.moduleService.commonService.urlMap.MODULE_PRINTPDF_V3_1, [self.moduleService.name, self.moduleService.findElementInDetail_V3(['CaseID']).$, self.template, self.product]);
		        	self.fileReaderService.docId = self.moduleService.findElementInDetail_V3(['CaseID']).$;
		        } else if (self.moduleService.name == commonService.CONSTANTS.MODULE_NAME.POLICY && !commonService.hasValueNotEmpty(self.moduleService.findElementInDetail_V3(['DocId']))) {
		        	url = self.moduleService.commonService.getUrl(self.moduleService.commonService.urlMap.MODULE_PRINTPDF_V3_1_PO, [self.moduleService.name, self.template, self.product, self.moduleService.businessType]);
		        } else if (self.moduleService.name == commonService.CONSTANTS.MODULE_NAME.FACTFIND && self.moduleService.findElementInDetail_V3(['InsideFNAs','@refUid']) != ""){
		        	url = self.moduleService.commonService.getUrl(self.moduleService.commonService.urlMap.MODULE_PRINTPDF_V3_1, [self.moduleService.name, self.moduleService.findElementInDetail_V3(['InsideFNAs','@refUid']), self.template, self.product]);
		        }
		        else {
		        	url = self.moduleService.commonService.getUrl(self.moduleService.commonService.urlMap.MODULE_PRINTPDF_V3_1, [self.moduleService.name, self.moduleService.findElementInDetail_V3(['DocId']), self.template, self.product]);
		        }
		        
		       /* else if (self.moduleService.name == commonService.CONSTANTS.MODULE_NAME.PROSPECT ||
		        		self.moduleService.name == commonService.CONSTANTS.MODULE_NAME.CORPORATE ||
		                self.moduleService.name == commonService.CONSTANTS.MODULE_NAME.AGENT_PAYMENT ||
		                self.moduleService.name == commonService.CONSTANTS.MODULE_NAME.CLIENT_PAYMENT ||
		        		(self.moduleService.name == commonService.CONSTANTS.MODULE_NAME.FACTFIND && self.actionType == 'inside') ||
		        		(self.moduleService.name == commonService.CONSTANTS.MODULE_NAME.FACTFIND && self.actionType == 'abridge') ||
		        		(self.product == 'term-life-secure') ||
		        		(self.product == 'guaranteed-cashback-saver') || 
		        		(self.product == 'FIR' (self.actionType == 'ip-endorsement' || self.actionType == 'cr-endorsement' || self.actionType == 'n-endorsement' || self.actionType == 'ip-endorsement-abridge' || self.actionType == 'cr-endorsement-abridge' || self.actionType == 'n-endorsement-abridge'))
		        		||(self.product == 'GTL1')
		        		||(self.product == 'motor-private-car-m-as')
		        		||(self.product == 'personal-accident')){*/
		    	
		       /* } else {
		        	url = self.moduleService.commonService.getUrl(self.moduleService.commonService.urlMap.MODULE_PRINTPDF, [self.moduleService.name, self.template, self.product]);
		        }*/
		        if (!(window.cordova || window.Liferay.Fake)) {
		        	resourceURL.setParameter("url", url);
		        }
		        self.fileReaderService.showPDF(resourceURL.toString());
			});
		// } else if (previewTemplateName) {
		// 	self.template = previewTemplateName;
		// 	var url = self.moduleService.commonService.getUrl(self.moduleService.commonService.urlMap.MODULE_PRINTPDF, [self.moduleService.name, self.template, self.product]);
	 //        resourceURL.setParameter("url", url);
	 //        self.fileReaderService.showPDF(resourceURL.toString());
		} else {
			var url = self.moduleService.commonService.getUrl(self.moduleService.commonService.urlMap.MODULE_PRINTPDF, [self.moduleService.name, self.template, self.product]);
			resourceURL.setParameter("url", url);
			self.fileReaderService.showPDF(resourceURL.toString());
			self.fileReaderService.showFileDetail();
		}
	};
	
	return new PrintPdfService(ajax);
}])
.service('translateService', ['$translate', '$q', function($translate, $q){
	/**
	 * This service is using for translate message with params
	 * Based on angular.translate service
	 * @param $http
	 * @param $log
	 */
	function TranslateService($translate, $q){
		var self = this;
		self.currentLanguageCode = 'en.translation';

		/**
		 * add parameters to result
		 */
		self.addParasToResult = function (result, params) {
			if(params){
	        	for (var i = params.length - 1; i >= 0; i--) {
	        		result = result.replace("{" + i + "}", params[i]);
	        	};
	        	return result;
	        }
	        else return result;
		}

		self.prepareData = function (key, params) {
			var obj = undefined;
			params = key.split(";");
	   		//with params
	   		if(params.length > 1){
	   			key = params.shift();
	   		}
	   		//without params
	   		else{
	   			params = undefined;
	   		}
	   		obj = {key: key, params: params};
	   		return obj;
		}

		/**
		 * Translate synchronous, don't return promise
		 * @param  {String} key    message to translate
		 * @param  {String} prefix i18n prefix
		 * @return {String}        Translated string
		 */
		self.instant = function instant (key, prefix) {
			var params = undefined;
			var data = this.prepareData(key, params);
	   		if(prefix)
	            data.key = prefix + '.' + data.key;

	        var result = $translate.instant(data.key);
	        
	       	result = this.addParasToResult(result, data.params);

	        return result;
		}

		/**
		 * Translate aynchronous, return promise
		 * @param  {String} key    message to translate
		 * @param  {String} prefix i18n prefix
		 * @return {Object}        Angular promise
		 */
		self.translate = function translate(key, prefix){
			var self = this;
			var deferred = $q.defer();
			var params = undefined;

			var data = self.prepareData(key, params);
	   		if(prefix)
	            data.key = prefix + '.' + data.key;
			
	        var result = $translate(data.key).then(
	        	function hadResult (translatedText) {
	        		translatedText = self.addParasToResult(translatedText, data.params);
	        		deferred.resolve(translatedText);
	        	}
	        );

	        return deferred.promise;
		}
		
	};
	
	return new TranslateService($translate, $q);
	
}])
.service('processQueueService', ['$window', function($window) {
	/**
	 * @author nnguyen75
	 */
	function ProcessQueueService() {
		var self = this;
		$window.iPosQueueMap = {};
	};
	
	ProcessQueueService.prototype.addToQueue = function(key, metadata) {
		if (!$window.iPosQueueMap[key]) {
			$window.iPosQueueMap[key] = [];
			$window.iPosQueueMap[key].push(metadata);
		} else {
			$window.iPosQueueMap[key].push(metadata);
		}
	};
	
	ProcessQueueService.prototype.getFromQueue = function(key) {
		var metadata = $window.iPosQueueMap[key][0];
		$window.iPosQueueMap[key].splice(0, 1);
		return metadata;
	}
	
	return new ProcessQueueService();
}])
////////////////////////////////////////////////////
//Provides information about the current platform //
////////////////////////////////////////////////////
.service('platformService', ['$document', '$q', '$log', 'commonService',
function($document, $q, $log, commonService) {

    var defaultPlatform = commonService.CONSTANTS.PLATFORM.WEB; //default is web browser

    function PlatformService(){
        this.name = "platformService";
        this.browserVersion;
        this.platformId;
    }

    /**
     * return browser name & version
     * TODO: tested on Chrome only
     * @return {Object} 
     *         name     {string}    browser name (Chrome, Firefox,...)
     *         version  {string}    browser version
     */
    PlatformService.prototype.getBrowserVersion = function getBrowserVersion() {

        if(this.browserVersion)
            return this.browserVersion;

        var ua = navigator.userAgent, tem,
        M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];

        //M[0]: "Chrome/43"
        //M[1]: "Chrome"
        //M[2]: "43"
        //index: 75
        //input: "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.124 Safari/537.36"
        //length: 3    
        if (/trident/i.test(M[1])){
            tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
            return 'IE '+ (tem[1] || '');
        }
        else if (M[1] === 'Chrome'){
            tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
            if (tem!= null) 
                return tem.slice(1).join(' ').replace('OPR', 'Opera');
        }

        M = M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
        if ((tem= ua.match(/version\/(\d+)/i)) != null) 
            M.splice(1, 1, tem[1]);
        // return M.join(' ');
        
        this.browserVersion = {
            name: M[0],
            version: M[1]
        };
        return this.browserVersion;
    };

    /**
     * Return the current platform Id
     * @return {Object} Angular promise
     */
    PlatformService.prototype.getPlatformId = function getPlatformId() {
    	var self = this;
        var defer = $q.defer();
        var resolved = false;
        var result = defaultPlatform;

        if (self.platformId){
        	defer.resolve(self.platformId);
        } 
        //mobile platform
        else if(window.cordova){                
            document.addEventListener('deviceready', function() {
                resolved = true;
                defer.resolve(window.cordova.platformId);
            });

            // Check to make sure we didn't miss the
            // event (just in case)
            setTimeout(function() {
                if (!resolved) {
                    if (window.cordova)
                        defer.resolve(window.cordova.platformId);
                }
            }, 3000);

        }else{
            var browserInfo = self.getBrowserVersion();
            $log.debug("Browser information:" + JSON.stringify(browserInfo));
            result = Liferay.Fake ? commonService.CONSTANTS.PLATFORM.WEB : commonService.CONSTANTS.PLATFORM.WEB_LIFERAY;
            defer.resolve(result);
        }

        return defer.promise;
    }
    return new PlatformService();
}])


/*##################################################################
 * UiFramework Service: 
###################################################################*/
/**
	 * @author nle32
	 */
.service('uiFrameworkService', ['loadingBarService', 'commonService', 'uiRenderPrototypeService', 'commonUIService', '$compile', '$timeout', '$state', '$log',
                                function(loadingBarService, commonService, uiRenderPrototypeService, commonUIService, $compile, $timeout, $state, $log){
	function UiFrameworkService(){
		this.isInSaleCase;
		this.listCardHistory;
		//init variables for render cards on screen

      /*  scope.viewProp = {
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
        };*/
        this.isOpenedDetail = false;
        this.isFirstTimeOpen = false;
	};
	
	// This function help us move to next step in section layout
	UiFrameworkService.prototype.moveToNextStep = function moveToNextStep(uiStructure, initStep){
		
		// This function use to identify suitable step to redirect user base on the detail of case-management
		// Note: 
		// - We MUST add more logic base on the requirement to make work correctly
		// - Because of application performance, this function should do all decision base on case-management,
		//   if we need information from other doctype, system must perform some additional request to server
//		var getStepToRedirect = function(moduleService, root) {
//			var businessStatus = moduleService.findElementInDetail_V3(['BusinessStatus']);
//			if (businessStatus == "DRAFT" ) {
//				return 1;
//			}
//			if (businessStatus == "READY FOR SUBMISSION" ) {
//				return 3;
//			}
//			return 0;
//		}
		
		// When case is open from business catalog or a link
     	if(uiStructure && !this.isFirstTimeOpen){
 			var moduleService = uiRenderPrototypeService.getUiService(uiStructure.parent.getRefDocTypeOfRoot());
 			commonService.listStep = uiStructure.parent.children;
 			
// 			var currentStep = getStepToRedirect(moduleService, uiStructure.parent);
 			var currentStep = initStep;
 			var nextStep = this.findNextVisibleStep(currentStep + 1, true);
 			var previousStep = null;
 			if (currentStep > 0) {
 				previousStep = commonService.listStep[currentStep - 1];
 			}
 			
 			commonService.previousButton = this.getStepButtonKey(previousStep);
     		commonService.currentStep = currentStep;
     		commonService.nextButton = this.getStepButtonKey(nextStep);
     		
     		this.isFirstTimeOpen = true;
     		this.clickToOpenCard(commonService.listStep[currentStep]);
     	}
     	
     	// When case is already open and user navigate between step
     	if(!uiStructure && commonService.listStep){
     		var previousStep = commonService.currentStep;
     		var currentStep = this.findNextVisibleStep(previousStep + 1, true);
     		var nextStep = this.findNextVisibleStep(currentStep + 1, true);
     		commonService.previousButton = this.getStepButtonKey(previousStep);
     		commonService.currentStep = currentStep;
      		commonService.nextButton = this.getStepButtonKey(nextStep);
      		
      		
      		var nextStepUIStructure = commonService.listStep[currentStep];
     		this.clickToOpenCard(nextStepUIStructure);
     	}
 	}
	
	// This function help us move to previous step in section layout
	UiFrameworkService.prototype.moveToPreviousStep = function moveToPreviousStep (uiStructure){
     	if(!uiStructure && commonService.listStep){//open other step when click
     		var nextStep = commonService.currentStep;
     		var currentStep = this.findNextVisibleStep(nextStep - 1, false);
     		var previousStep = this.findNextVisibleStep(currentStep - 1, false);
     		var previousStepUIStructure = commonService.listStep[currentStep];
     		
     		commonService.nextButton = this.getStepButtonKey(nextStep);
     		commonService.currentStep = currentStep;
     		commonService.previousButton = this.getStepButtonKey(previousStep);
     		this.clickToOpenCard(previousStepUIStructure);
     	}
 	}
	
	// This function use to get key on button of a step
	UiFrameworkService.prototype.getStepButtonKey = function getButtonKey(index) {
		if (index!=null && index < commonService.listStep.length && index > -1) {
			var stepAction = commonService.listStep[index].stepAction;
			if (stepAction) {
				return stepAction;
			} else {
				return commonService.listStep[index].name;
			}
		} else {
			return "";
		}
	}
	
	// Simulate the click action on a card
	// This is use in section layout when normal click is disable on stepCard
	UiFrameworkService.prototype.clickToOpenCard = function clickToOpenCard(uiStructure){
		if(uiStructure){
			setTimeout(function(){ 
        		if(uiStructure.html){
                    uiStructure.html.triggerHandler('click'); 
           	 }
        	}, 0); 
		}
	}
	
	// This function is use to find next visible step (because we can help some step, but it is set to invisible at current time) 
	UiFrameworkService.prototype.findNextVisibleStep = function findNextVisibleStep(index, moveForward) {
		if (moveForward) {
     		for(var i = index; i < commonService.listStep.length; i++){
     			if(commonService.listStep[i].isVisible == true){
     				return i;
         		}
     		}
		} else {
			for(var i = index; i > -1; i--){
     			if(commonService.listStep[i].isVisible == true){
     				return i;
         		}
			}
		}
		return null;
	}
	
	 
	UiFrameworkService.prototype.chooseCard = function chooseCard(card, selectLevel, selectIndex, event, scope, resourceURL) {
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
            this.isInSaleCase = true;
        
        var viewProp = scope.viewProp;
        var viewObj = scope.viewProp.viewObject;
        var historySelect = scope.viewProp.historySelect;   
        this.listCardHistory = [];
        var lastHistorySelect = historySelect.lastObj();
        
        this.checkClosingCard(card, selectLevel, scope).then(function checkedCloseCard (result) {
            if(result !== 'stop'){                
                uiRenderPrototypeService.getChildContentOfUiStructure(viewObj[selectLevel][selectIndex], resourceURL)
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
                        	self.isOpenedDetail = false;         
                             viewObj[selectLevel + 1] = result;                    
                        }
                        //static HTML or HTML form
                        else{                    
                        	self.isOpenedDetail = true;
                            uiEles = result;
                        }
                        self.updateHistorySelectObj(selectLevel, selectIndex, scope);
                        
                        if (self.isSectionLayout(viewProp)) {
                        	// need time out here to wait for the animation of scrollTop on close completed
                        	$timeout(function() {
                        		var scrollAmount = self.calculateScrollAmountOnOpen(selectLevel, event.currentTarget, historySelect,viewProp);
    				        	self.scrollTop(scrollAmount);
    				        }, 700);
                        	
                        	self.renderNewSectionRow(event, selectLevel + 1, selectIndex, refDocType, uiEles, scope);
                        } else {
                        	var scrollAmount = self.calculateScrollAmountOnOpen(selectLevel, event.currentTarget, historySelect,viewProp);
                        	self.scrollTop(scrollAmount);
                        	self.renderNewCardsRow(event, selectLevel + 1, refDocType, uiEles, scope);
                        }
                       
                    }else{                    
                        //remove last historySelect ele when cardType is 'action' 
                        //cause when click on this card again nothing will happen
                        // historySelect.pop();   
                    }
                    loadingBarService.hideLoadingBar();                    
                }, function failed(failDetail) {
                    if (failDetail.errCode === "109"){
                        commonUIService.showNotifyMessage("v3.mobile.check.network.109", "unsuccessful", 3000);
                    }
                });
            }
            else
                loadingBarService.hideLoadingBar();
        });
    };
    
    UiFrameworkService.prototype.chooseSection = function chooseSection(card, selectLevel, selectIndex, event, scope, resourceURL) {
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
        	|| card.name == "case-management-gtl:groupLevelUW" || card.name == "case-management-travel-express:Step5_Underwriting") 
            this.isInSaleCase = true;
        
        var viewObj = scope.viewProp.viewObject;
        var historySelect = scope.viewProp.historySelect;   
        
        this.checkClosingSection(card, selectLevel, scope).then(function checkedCloseCard (result) {
            if(result !== 'stop'){                
                uiRenderPrototypeService.getChildContentOfUiStructure(viewObj[selectLevel][selectIndex], resourceURL)
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
                        	self.isOpenedDetail = false;         
                             viewObj[selectLevel + 1] = result;                    
                        }
                        //static HTML or HTML form
                        else{                    
                        	self.isOpenedDetail = true;
                            uiEles = result;
                        }
                        self.updateHistorySelectObjSection(selectLevel, selectIndex, scope);
                        
                        	// need time out here to wait for the animation of scrollTop on close completed
//                    	$timeout(function() {
//                    		var scrollAmount = self.calculateScrollAmountOnOpen(selectLevel, event.currentTarget, historySelect);
//				        	self.scrollTop(scrollAmount);
//				        }, 700);
                    	
                    	self.renderNewSectionRow(event, selectLevel + 1, selectIndex, refDocType, uiEles, scope);
                    }
                    loadingBarService.hideLoadingBar();
                });

            }
            else
                loadingBarService.hideLoadingBar();
        });
    };
    
    UiFrameworkService.prototype.checkClosingSection = function checkClosingSection(willOpenCard, willOpenLevel, scope) {        
        var self = this;        
        var historySelect = scope.viewProp.historySelect;    
        // var message = 'Choose YES if you want to save the current content before opening document. If NO, the new content will be reset.'
        var defer = scope.moduleService.$q.defer();


        function checkNeedToSaveDetail(openingCard) {
            //openingCard: card is opening on screen, which we're going to close it
            //willOpenCard: card which will be opened
            var defer = scope.moduleService.$q.defer();
            
            if( self.isAllowNavAutoSave() &&                 
                ( 
                    //if root is different --> it's a different documents
                    //or willOpenCard will open other doctype, need to check for saving detail
                    openingCard.root !== willOpenCard.root ||
                    
                    //if user wants to open new doctype, need to save the old one
                    willOpenCard.getRefDocTypeInDetail()
                )
                && openingCard.root.isDetailChanged){

                var oldDocType = openingCard.getRefDocTypeOfRoot();
                var currUiService = uiRenderPrototypeService.getUiService(oldDocType);
                var oldDocTypeId = currUiService.findElementInDetail_V3(['DocId']);

                if(currUiService){                      
                    //we need oldScope, so in saveDetailNotCompute() can get the parents uiStructure for autosave
                    var oldScope = openingCard.getCurrentAngularScope();

                    UiFrameworkService.prototype.saveDetailNotCompute.call(oldScope, currUiService).then(function () {   

                        commonUIService.showNotifyMessage('v3.mynewworkspace.message.' 
                            + scope.getCorrectDoctype(currUiService) + '.autosave.success', "success", 3000);
                        defer.resolve();    
                        openingCard.root.isDetailChanged = false;
                    }, function () {         
                        commonUIService.showNotifyMessage("v3.mynewworkspace.message.SaveAutomatically" + " " 
                            + scope.getCorrectDoctype(currUiService) + "v3.mynewworkspace.message.unsuccessful" , "unsuccessful", 3000);
                        defer.reject();    
                    });
                }else{
                    $log.error("Can't get uiService of doctype: " + oldDocType);
                    defer.resolve();
                } 
            }else{
                defer.resolve();
            }

            return defer.promise;
        };

//        var lastSelectedInfo = historySelect.lastObj();
//        if(lastSelectedInfo){
//        	var lastSelectedCard = lastSelectedInfo.refUiStructure;
            //if lastSelectedInfo has linkChildUiStructure, it need to be it
            var linkCUiStructure = uiRenderPrototypeService.getLinkChildUiStructure(willOpenCard);
            var lastSelectedCard = linkCUiStructure ? linkCUiStructure : willOpenCard;
            checkNeedToSaveDetail(willOpenCard).then(function() {
                //if close an opening card
//                if(historySelect[willOpenLevel]){
//
//                    var selectedCard = historySelect[willOpenLevel].refUiStructure;

                    //if click on an opened card, simple close its children and do no more
                    //if(selectedCard === willOpenCard){
                	if(willOpenCard.isSelected != true){
                        //close child of opening card
                        	self.closeChildSections(willOpenCard, willOpenLevel, scope);
                        if(commonService.options.cardTouchMode){
                            willOpenCard.cardStatus = "start";
                        }
                        defer.resolve('stop');
                    }else{
                        defer.resolve();
                    }
//                }else
//                    defer.resolve();
            });
//       }else
//             defer.resolve();

        return defer.promise;
    }
    
    UiFrameworkService.prototype.checkClosingCard = function checkClosingCard(willOpenCard, willOpenLevel, scope) {        
        var self = this;        
        var historySelect = scope.viewProp.historySelect;    
        // var message = 'Choose YES if you want to save the current content before opening document. If NO, the new content will be reset.'
        var defer = scope.moduleService.$q.defer();


        function checkNeedToSaveDetail(openingCard) {
            //openingCard: card is opening on screen, which we're going to close it
            //willOpenCard: card which will be opened
            var defer = scope.moduleService.$q.defer();
            
            //store new isDetailChanged to local storage
            uiRenderPrototypeService.updateShellUiStructureToStorage(openingCard.root);
            
            if( self.isAllowNavAutoSave() &&                 
                ( 
                    //if root is different --> it's a different documents
                    //or willOpenCard will open other doctype, need to check for saving detail
                    openingCard.root !== willOpenCard.root ||
                    
                    //if user wants to open new doctype, need to save the old one
                    willOpenCard.getRefDocTypeInDetail()
                )
                && openingCard.root.isDetailChanged){

                var oldDocType = openingCard.getRefDocTypeOfRoot();
                var currUiService = uiRenderPrototypeService.getUiService(oldDocType);
                var oldDocTypeId = currUiService.findElementInDetail_V3(['DocId']);

                if(currUiService){                      
                    //we need oldScope, so in saveDetailNotCompute() can get the parents uiStructure for autosave
                    var oldScope = openingCard.getCurrentAngularScope();

                    UiFrameworkService.prototype.saveDetailNotCompute.call(oldScope, currUiService).then(function () {   

                        commonUIService.showNotifyMessage('v3.mynewworkspace.message.' 
                            + scope.getCorrectDoctype(currUiService) + '.autosave.success', "success", 3000);
                        defer.resolve();
                        //openingCard.root.isDetailChanged = true;
                    }, function () {         
                        commonUIService.showNotifyMessage("v3.mynewworkspace.message.SaveAutomatically" + " " 
                            + scope.getCorrectDoctype(currUiService) + "v3.mynewworkspace.message.unsuccessful" , "unsuccessful", 3000);
                        defer.reject();    
                    });
                }else{
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
                    self.closeChildCards(willOpenLevel, scope);
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
     * Setup HTML for action bar and its controller
     */
    UiFrameworkService.prototype.setupActionBar = function setupActionBar (refDocType, businessType, scope) {
    	//var self = this;
        //var fileName = self.moduleService.name.replace(/-/g, "_");    	
        uiRenderPrototypeService.getActionBarHtml(refDocType, businessType).then(function gotHtml(html){
            $log.debug("Render action bar with ctrl: " + scope.name);
            var a = $.parseHTML(html.data);
            var saveButtonEle = $(a).find(".fa-floppy-o").parent();
            saveButtonEle.addClass("activate-spiner");
            
            var ngClick = saveButtonEle.attr("loading-action");
            ngClick =  'uiStructureRoot.isDetailChanged = false;' + ngClick;
            saveButtonEle.attr('loading-action', ngClick);
            
    		var ngClass = "{'common-action-disabled': !uiStructureRoot.isDetailChanged}"
		 	// For MNC Link, always enable save button after first save
    		if (scope.moduleService) {
		    	var currentUIService = scope.moduleService;
		    	if (currentUIService.product === commonService.CONSTANTS.PRODUCT.REGULAR_UNIT_LINK
		    		|| currentUIService.productName === commonService.CONSTANTS.PRODUCT.REGULAR_UNIT_LINK 
		    		|| currentUIService.productName === commonService.CONSTANTS.PRODUCT.ENDOWMENT
		    		|| scope.moduleService.name == "user" || scope.moduleService.name == "admin") {
		    		ngClass = "";
		    	}
    		}
            saveButtonEle.attr('ng-class', ngClass);
                      
            var refreshButtonEle = $(a).find(".fa-repeat").parent();
            refreshButtonEle.addClass("common-action-disabled");
            
        	var compiledActionBar = $compile(a)(scope);
        	scope.html.actionBarEle = angular.element('action-bar');
        	
            //for issue can not compile action bar when switch between modules
            if(scope.html.actionBarEle.length > 1){
            	scope.html.actionBarEle.splice(1, 1);
            }
            //remove all children
            //nle32: clear content of action bar
            $("action-bar").empty();           
            /*var children = self.html.actionBarEle.children();
            for(var i = 0; i < children.length; ++i){                
              children.remove();  
            }*/
            
            scope.html.actionBarEle.append(compiledActionBar);
            $('#showMore').fadeOut();
        });
    };
    
    /**
     * Setup HTML for action bar and its controller for Direct Sale
     */
    
    UiFrameworkService.prototype.setupSidePanelDS = function setupActionBarDS (refDocType, businessType, scope) {
    	var viewProp = scope.viewProp;
    	var htmlPanelFileType = 'side';    	
        uiRenderPrototypeService.getPanelHtmlDS(refDocType, businessType, htmlPanelFileType, scope).then(function gotHtml(html){
        	scope.uiFrameworkService.gotHtmlDS(html, htmlPanelFileType, scope);
        });
       
    };
    
    UiFrameworkService.prototype.setupBottomPanelDS = function setupActionBarDS (refDocType, businessType, scope) { 
    	var viewProp = scope.viewProp;
    	var htmlPanelFileType = 'bottom';
        uiRenderPrototypeService.getPanelHtmlDS(refDocType, businessType, htmlPanelFileType, scope).then(function gotHtml(html){
        	scope.uiFrameworkService.gotHtmlDS(html, htmlPanelFileType, scope);
        });
       
    };    
    
    /**
     * Process action bar html for Direct Sale
     */
    
    UiFrameworkService.prototype.gotHtmlDS = function gotHtmlDS (html, htmlPanelFileType, scope) {
    	$log.debug("Render action bar with ctrl: " + scope.name);
        var a = $.parseHTML(html.data);
        var viewProp = scope.viewProp;
        var saveButtonEle = $(a).find(".apply-button");
        var ngClick = saveButtonEle.attr("ng-click");            
        ngClick =  'uiStructureRoot.isDetailChanged = false;' + ngClick;
        var ngClass = "{'common-action-disabled': !uiStructureRoot.isDetailChanged}"
        
        saveButtonEle.attr('ng-click', ngClick);
        saveButtonEle.attr('ng-class', ngClass);
        
        var refreshButtonEle = $(a).find(".fa-repeat").parent();
        refreshButtonEle.addClass("common-action-disabled");
        
    	var compiledActionBar = $compile(a)(scope);
    	
    	//select action bar for DS or AS
    	if(scope.uiFrameworkService.isSectionLayout(viewProp)){
    		if(htmlPanelFileType == 'side') {
        		scope.html.panelEle = angular.element('side-pannel');
        	}
        	if(htmlPanelFileType == 'bottom') {
        		scope.html.panelEle = angular.element('bottom-pannel');
        	}    		
        } else {
        	scope.html.panelEle = angular.element('action-bar');
        }        	
        //for issue can not compile action bar when switch between modules
        if(scope.html.panelEle.length > 1){
        	scope.html.panelEle.splice(1, 1);
        }
        //remove all children        
        if(scope.uiFrameworkService.isSectionLayout(viewProp)){
        	if(htmlPanelFileType == 'side') {
        		$("side-pannel").empty();
        	}
        	if(htmlPanelFileType == 'bottom') {
        		$("bottom-pannel").empty();
        	}        	
        } else {
        	$("action-bar").empty();
        }
        
        scope.html.panelEle.append(compiledActionBar);
        $('#showMore').fadeOut();
    }
    
    /**
     * add this ctrl to history
     * @return {[type]} [description]
     */

	UiFrameworkService.prototype.registerToHistoryCtrl = function registerToHistoryCtrl (scope) {
        var uiStructureRoot = undefined;
        var viewProp = scope.viewProp;
        var lastSelect = undefined;

        //get the link children uiStructure from the last selected obj (which has been loaded successfully)
        if(viewProp.historySelect.length > 0){
        	if (this.isSectionLayout(viewProp)) {
        		if ((viewProp.historySelect.length != 1) && (viewProp.lastSelectStep)) {
        			lastSelect = viewProp.lastSelectStep;
        		} else {
        			lastSelect = this.getLastStepInHistory(viewProp.historySelect,viewProp.historySelect.length - 1)
        		}
        	} else {
        		lastSelect = viewProp.historySelect.lastObj();
        	}
        	uiStructureRoot = lastSelect.refUiStructure.linkCUiStructure;
        }
        //if historySelect is empty --> get the main current uiStructure
        else{
            uiStructureRoot = scope.uiStructureRoot;
        }

        scope.isMainCtrl = {};//indicate this ctrl is main-ctrl of the view, using for getAssociateUiStructureRoot()
        scope.uiStructureRoot = uiStructureRoot;//setup uiStructureRoot for this uiStructure
        
        //keep track ctrl
        scope.viewProp.historyCtrl.push({
            "ctrl": scope, 
            "uiStructureRoot" : uiStructureRoot
        });
    }
    
	
    /**
     * The caller ctrl can be anywhere, use this function to find the main ctrl in charge (eg: Case, illustration, application,...)
     * @return {Object} Main ctrl in charge
     */
    UiFrameworkService.prototype.getCtrlInCharge = function getCtrlInCharge (scope) {
        var mainCtrl = scope;
        while(mainCtrl.hasOwnProperty('isMainCtrl') !== true){
            mainCtrl = mainCtrl.$parent;
            if(!mainCtrl)
                break;
        }

        return mainCtrl;
    };
    
    UiFrameworkService.prototype.closeChildCards = function closeChildCards(closeLevel, scope){
    	var self = this;
		var viewProp = scope.viewProp;
	    var viewObj = scope.viewProp.viewObject;
	    var historySelect = scope.viewProp.historySelect;
	    var closeLevelRefDocType = undefined;
	    var closeLevelBusinessType = undefined;
	    var currCardRefDocType = undefined;//current refDocType of newest child
	    
	  if(historySelect[closeLevel]){
	        var indexOfOpenedCardOfselectLevel = historySelect[closeLevel].index;
	        
	        closeLevelRefDocType = historySelect[closeLevel].refDocType;
	        closeLevelBusinessType = historySelect[closeLevel].refUiStructure.root.businessType;
	        
	        currCardRefDocType = historySelect.lastObj().refDocType;
            var isOpenOtherDocType = historySelect.lastObj().refUiStructure.getRefDocTypeInDetail() ? true : false;
	        
	        
	        //if close card with difference refdoctype then render new action bar
            //or opening another docType (eg: illustration card in case when opening "illustrations" (case) card)
            if(closeLevelRefDocType != currCardRefDocType || isOpenOtherDocType){
                var ctrlInCharge = self.getCtrlInCharge(scope);
                if(self.isSectionLayout(this.viewProp) == false)
                	self.setupActionBar(closeLevelRefDocType, closeLevelBusinessType, ctrlInCharge);      
	        } 
	        
	        //Update scrollTop for close Child Element
            var scrollAmount = self.calculateScrollAmountOnClose(closeLevel,historySelect,viewProp);
            self.scrollTop(scrollAmount);
            
	
		    //handle 'onClose' code if existed
		    if(historySelect[closeLevel].refUiStructure.onClose){
//		    	self.$eval(historySelect[closeLevel].refUiStructure.onClose);
		    	scope.$eval(historySelect[closeLevel].refUiStructure.onClose);
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
		    if (this.isSectionLayout(viewProp)) {
		    	 this.removeSection(historySelect[closeLevel].refChildHtml);
		    } else {
		    	this.removeRow(historySelect[closeLevel].refChildHtml);
		    }
            
          
            historySelect[closeLevel].childScope.$destroy();
          
            
            viewObj.splice(closeLevel + 1, viewObj.length);
            historySelect.splice(closeLevel, historySelect.length);

	   }
    }
    
    UiFrameworkService.prototype.closeChildSections = function closeChildSections(card ,closeLevel, scope){
    	var self = this;
		var viewProp = scope.viewProp;
	    var viewObj = scope.viewProp.viewObject;
	    var historySelect = scope.viewProp.historySelect;
	    var closeLevelRefDocType = undefined;
	    var closeLevelBusinessType = undefined;
	    var currCardRefDocType = undefined;//current refDocType of newest child
	
	    //handle 'onClose' code if existed
	    if(card.onClose){
	    	self.$eval(card.onClose);
	    }
		    
	    if (this.isSectionLayout(viewProp)) {
	    	var pPrevious = undefined;
		    var pCurrent = historySelect[closeLevel];
		    var isFound = false;
		    while (pCurrent != undefined) {
		    	if (card._id == pCurrent.refUiStructure._id) {
		    		isFound = true;
		    		break;
		    	} else {
		    		pPrevious = pCurrent;
		    		pCurrent = pCurrent.stepLink;
		    	}
		    }
	    	if (isFound) {
	    		if (historySelect[closeLevel].stepLink == undefined) {
	    			viewObj.splice(closeLevel + 1, viewObj.length);
	    			historySelect.splice(closeLevel, historySelect.length);
	    		} else {
	    			if (pPrevious) {
	    				pPrevious.stepLink = pCurrent.stepLink;
	    			} else {
	    				historySelect[closeLevel] = pCurrent.stepLink;
	    			}
	    			
	    			var removeArray = [card._id];
	    			if (card.linkCUiStructure) {
	    				removeArray.push[card.linkCUiStructure._id]
	    			}
	    			if (closeLevel == historySelect.length) {
	    				for (var i = closeLevel + 1; i < historySelect.length; i++) {
		    				var pChildHead = historySelect[i];
		    				var pChildCurrent = pChildHead;
		    				var pChildPrevious = undefined;
		    				while (pChildCurrent) {
		    					var parentUIStructure = pChildCurrent.refUiStructure.parent;
		    					if (removeArray.indexOf(parentUIStructure._id) != -1) {
		    						removeArray.push(pChildCurrent.refUiStructure._id);
		    						if (pChildCurrent.refUiStructure.linkCUiStructure) {
		    							removeArray.push(pChildCurrent.refUiStructure.linkCUiStructure._id);
		    						}
		    						if (pChildPrevious == undefined) {
		    							pChildHead = pChildCurrent.stepLink;
		    						}
		    					} else {
		    						if (pChildPrevious == undefined) {
		    							pChildPrevious = pChildHead;
		    						} else {
		    							pChildPrevious.stepLink = pChildCurrent;
		    						}
		    					}
		    					pChildCurrent = pChildCurrent.stepLink
		    				}
		    			}
	    			}
	    		}
	    		this.removeSection(pCurrent.refChildHtml)
	    		pCurrent.childScope.$destroy();
	    	}
	    } else {
	    	this.removeRow(historySelect[closeLevel].refChildHtml);
	    	historySelect[closeLevel].childScope.$destroy();
	    	viewObj.splice(closeLevel + 1, viewObj.length);
	    	historySelect.splice(closeLevel, historySelect.length);
	    }
    }
    
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
    UiFrameworkService.prototype.saveDetailNotCompute = function saveDetailNotCompute (currUiService, flags) {
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
        	self.reSetupConcreteUiStructure(currUiService.detail, scope);
        });

        return defer.promise;
    };
    
    UiFrameworkService.prototype.calculateScrollAmountOnClose = function calculateScrollAmountOnClose(level, historySelect, viewProp) {
        var amount = 0;
        if (this.isSectionLayout(viewProp)) {
        	if (level > 0){
            	var parentCard = historySelect[level-1];
            	amount = parentCard.refChildHtml.offset().top - 100;
            }
        } else {
        	if(level > 1){
            	var parentCard = historySelect[level-2];
            	amount = parentCard.refChildHtml.offset().top - 60;
            }
        }
        return amount;
    }
    
    UiFrameworkService.prototype.calculateScrollAmountOnOpen = function calculateScrollAmountOnOpen(level, currentTarget, historySelect, viewProp) {
    	var amount = currentTarget.children[0].offsetTop ;
    	if (this.isSectionLayout(viewProp)) {
    		if (level > 1) {
    			var parentCard = historySelect[level-1];
    			amount = parentCard.refChildHtml.offset().top + amount - 80;
    		} else {
    			amount = 0;
    		}
    	} else {
	        if(historySelect.length > 0 && level <= historySelect.lastObj().refUiStructure.level){
	        	var rowIndexOfSelectCard = Math.floor(historySelect.lastObj().index / 4);
	        	var valueOfPosittionIndex = rowIndexOfSelectCard * 200;
	            amount = currentTarget.parentElement.offsetTop + valueOfPosittionIndex;
	        }
    	}
        return amount;
    }
    
    UiFrameworkService.prototype.scrollTop = function scrollTop(offsetPosittion) {  
    	$('html, body').stop().animate({
        	scrollTop:offsetPosittion  	    	
	    	},1500, 'swing'
	    );
    }
    
    UiFrameworkService.prototype.isSectionLayout = function isSectionLayout(viewProp) {
    	var style = viewProp ? viewProp.layoutStyle : this.getLayoutStyle();
    	if (style == 'sec') {
    		return true;
    	} else {
    		return false;
    	}
    }
    
    UiFrameworkService.prototype.getLayoutStyle = function getLayoutStyle(refDocType) {
    	if (typeof layoutStyle !== 'undefined') {
    		if (refDocType !== "business_catalog") {
    			return layoutStyle;
    		}
    	}
    	return 'card';
    }
    
    
    
    UiFrameworkService.prototype.removeRow = function removeRows (htmlEle) {
        if(!htmlEle)
            return;
        
    	this.isOpenedDetail = false;
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
    
    UiFrameworkService.prototype.removeSection = function removeSection (htmlEle) {
        if(!htmlEle)
            return;
        
    	this.isOpenedDetail = false;
    	var eleList=$(htmlEle).siblings();
    	eleList.each(function(){
    		$(this).children().children().css('opacity','1');
    	});
    	htmlEle.slideToggle(500);
        
        $timeout(function() {
        	htmlEle.remove();
        }, 500);
    }
    /**
     * @author: tphan37
     * date: 07-Jan-2016
     * @return {Boolean} true if allow auto save when navigating
     */
    UiFrameworkService.prototype.isAllowNavAutoSave = function isAllowNavAutoSave () {
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

    UiFrameworkService.prototype.updateHistorySelectObj = function updateHistorySelectObj (selectLevel, selectIndex, scope) {
        var self = this;        
        var viewProp = scope.viewProp;
        var viewObj = scope.viewProp.viewObject;
        var historySelect = scope.viewProp.historySelect;

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
            historySelect[selectLevel].refDocType = scope.uiStructureRoot.docParams.refDocType;
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
    
    UiFrameworkService.prototype.updateHistorySelectObjSection = function updateHistorySelectObjSection (selectLevel, selectIndex, scope) {
        var self = this;        
        var viewProp = scope.viewProp;
        var viewObj = scope.viewProp.viewObject;
        var historySelect = scope.viewProp.historySelect;
        var historySelectObj = angular.copy(viewProp.historyObjTmpl);
        
        historySelectObj.refUiStructure = viewObj[selectLevel][selectIndex];
        historySelectObj.index = selectIndex;
        if(selectLevel == 0){
        	historySelectObj.refDocType = scope.uiStructureRoot.docParams.refDocType;
        } else {
            var prevRefDocType = historySelect[selectLevel - 1].refUiStructure.getRefDocTypeInDetail();
            if(prevRefDocType) {
            	historySelectObj.refDocType = prevRefDocType;
            } else {
            	historySelectObj.refDocType = historySelect[selectLevel - 1].refDocType;
            }
        }
        
         //update the historySelect object 
        if(historySelect.length == selectLevel){
        	historySelect.push(historySelectObj);
        	viewProp.lastSelectStep = historySelectObj;
        } else {
        	var lastItem = this.getLastStepInHistory(historySelect,selectLevel);
        	lastItem.stepLink = historySelectObj;
        	viewProp.lastSelectStep = historySelectObj;
        }
    }
    
    UiFrameworkService.prototype.getLastStepInHistory = function getLastStepInHistory(historySelect, level) {
    	var item = historySelect[level];
		while (item.stepLink) {
			item = item.stepLink;
		}
		return item;
    }
    
    
    //TODO: It heavily depends on jquery, find a way to get out of this
    UiFrameworkService.prototype.renderNewSectionRow = function renderNewSectionRow (event, selectLevel, selectIndex, refDocType, objs, scope ) {
    	var self = this;
    	var ctrl = '';
        if(refDocType)
            ctrl = ' ng-controller="' + genCtrlName('detail', refDocType.split(';')[0]) + '"';

        var layoutTemplate = undefined;
        //if objs is undefined, means new row of cards
        if(!objs){
            layoutTemplate = 
            	 '<div card-reorder current-level = "' + selectLevel+ '" view-object-lenght="viewProp.viewObject[' + (selectLevel -1 ) + '].length" view-object="viewProp.viewObject[' + (selectLevel -1 ) + ']" id="level-' + selectLevel+ '-content">' +
            '<div' + ctrl + '>' +
                '<div class="box-detail wrapper-detail">' +
                    '<div class="container-fluid v3-padding-0">' + 
                        '<section-card id="level-' + selectLevel + '-card-{{$index}}" ng-repeat="card in viewProp.viewObject[' + selectLevel + '] track by $index" level="' + selectLevel + '" when-click="chooseSection(card, ' + selectLevel + ' , $index, clickEvent)"/>' +
                    '</div>' +
                '</div>' +
            '</div>' +
          '</div>';
        }
        //render form HTML
        else if(uiRenderPrototypeService.isUiElementObj(objs[0])){
            //scope.viewProp.uiElements = objs;
        	if (scope.viewProp.viewObject[selectLevel-1][selectIndex].linkCUiStructure) {
        		layoutTemplate =
            		'<div card-reorder current-level = "' + selectLevel+ '" view-object-lenght="viewProp.viewObject[' + (selectLevel -1 ) + '].length"  view-object="viewProp.viewObject[' + (selectLevel -1 ) + ']" class="row" id="level-' + selectLevel+ '-content">' +
            		 	'<div' + ctrl + '>' +
            		 		"<div class='col-xs-12 box-detail wrapper-detail'>" +
    	                        "<div class='container-fluid v3-padding-0 box-detail-form'>" + 
    	                            '<ui-element ng-repeat="uiElement in viewProp.viewObject[' + (selectLevel-1) + '][' + selectIndex + '].linkCUiStructure.uiEle ' + 'track by $index" />' + 
    	                        "</div>" +
    	                    "</div>" +   
                        "</div>" + 
                    "</div>";
        	} else {
            	layoutTemplate =
            		'<div card-reorder current-level = "' + selectLevel+ '" view-object-lenght="viewProp.viewObject[' + (selectLevel -1 ) + '].length"  view-object="viewProp.viewObject[' + (selectLevel -1 ) + ']" class="row" id="level-' + selectLevel+ '-content">' +
            		 	'<div' + ctrl + '>' +
            		 		"<div class='col-xs-12 box-detail wrapper-detail'>" +
    	                        "<div class='container-fluid v3-padding-0 box-detail-form'>" + 
    	                            '<ui-element ng-repeat="uiElement in viewProp.viewObject[' + (selectLevel-1) + '][' + selectIndex + '].uiEle ' + 'track by $index" />' + 
    	                        "</div>" +
    	                    "</div>" +   
                        "</div>" + 
                    "</div>";
        	}
        }
        //render static HTML
        else {
            layoutTemplate =
            '<div card-reorder current-level = "' + selectLevel+ '" view-object-lenght="viewProp.viewObject[' + (selectLevel -1 ) + '].length" view-object="viewProp.viewObject[' + (selectLevel -1 ) + ']" id="level-' + selectLevel+ '-content">' +
                "<div class='col-xs-12 box-detail wrapper-detail'>" +
                    "<div class='container-fluid v3-padding-0 box-detail-form'>" + objs + "</div>" +
                "</div>" +
            "</div>";
        }

        var appendEle = undefined;//where the new layout will be append
        var parentElement = event.currentTarget.parentElement;
        var currOffsetTop = event.currentTarget.children[0].offsetTop;
        var siblingEles = parentElement.children;
        var childScope = scope.$new();
        var compiledTemplate = $compile(layoutTemplate)(childScope);
        
        if (selectLevel == 1) {
        	appendEle = parentElement.parentElement;
        	angular.element(appendEle).find('.section-column').append(compiledTemplate);
        }
        else {
            appendEle = siblingEles[selectIndex];
            angular.element(appendEle).find('.card-element').after(compiledTemplate);
            compiledTemplate.click(function(e) {
            	e.stopPropagation();
            });
        }
        
        //keep track of appendEle
        if(scope.viewProp.historySelect[selectLevel - 1]){
        	var recentItem = self.getLastStepInHistory(scope.viewProp.historySelect, selectLevel - 1);
        	recentItem.refChildHtml = compiledTemplate;
        	recentItem.childScope = childScope;
        }

        compiledTemplate.css('display', 'none');
        compiledTemplate.css('width', '100%');
        compiledTemplate.css('clear', 'both');
        $timeout(function() {
        	compiledTemplate.slideToggle(500);
        }, 700);

		if(objs){
		  $timeout(function() {
			  scope.moduleProspectPersonalService.tourGuideFirstLoginForUser("documentDetails", scope.portletId);
		  }, 1000);        	
        }else{
        	$timeout(function() {
        		if(refDocType){
        			scope.moduleProspectPersonalService.tourGuideFirstLoginForUser(refDocType.split(';')[0].capitalizeFirstLetter(), scope.portletId);
        			//Open the first section when moving to new step
        			if(scope.viewProp.viewObject[1] != undefined)
        				scope.uiFrameworkService.clickToOpenCard(scope.viewProp.viewObject[1][0]);
        		}
   		  	}, 500);  
        }                
    }
    
    //TODO: It heavily depends on jquery, find a way to get out of this
    UiFrameworkService.prototype.renderNewCardsRow = function renderNewCardsRow (event, selectLevel, refDocType, objs, scope ) {
    	var self = this;
    	var ctrl = '';
        if(refDocType)
            ctrl = ' ng-controller="' + genCtrlName('detail', refDocType.split(';')[0]) + '"';

        var layoutTemplate = undefined;
        		
        //if objs is undefined, means new row of cards
        if(!objs){
            layoutTemplate = 
            	 '<div card-reorder current-level = "' + selectLevel+ '" view-object-lenght="viewProp.viewObject[' + (selectLevel -1 ) + '].length" view-object="viewProp.viewObject[' + (selectLevel -1 ) + ']" id="level-' + selectLevel+ '-content">' +
		            '<div' + ctrl + ' class="row" style="width: 100%;">' +
		                '<div class="box-detail wrapper-detail">' +
		                    '<div class="container-fluid v3-padding-0">' + 
		                        '<card id="level-' + selectLevel+ '-card-{{$index}}" ng-repeat="card in viewProp.viewObject[' + selectLevel + '] track by $index" level="' + selectLevel + '" when-click="chooseCard(card, ' + selectLevel + ' , $index, clickEvent)"/>' +
		                    '</div>' +
		                '</div>' +
		            '</div>' +
		         '</div>';
        }
        //render form HTML
        else if(uiRenderPrototypeService.isUiElementObj(objs[0])){
            scope.viewProp.uiElements = objs;
        	layoutTemplate =
        		'<div card-reorder current-level = "' + selectLevel+ '" view-object-lenght="viewProp.viewObject[' + (selectLevel -1 ) + '].length"  view-object="viewProp.viewObject[' + (selectLevel -1 ) + ']" class="row" id="level-' + selectLevel+ '-content">' +
        		 	'<div' + ctrl + ' class="row" style="width: 100%;" >' +
        		 		"<div class='box-detail wrapper-detail'>" +
	                        "<div class='container-fluid v3-padding-0 box-detail-form'>" + 
	                            '<ui-element ng-repeat="uiElement in viewProp.uiElements track by $index" />' + 
	                        "</div>" +
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
        var parentElement = event.currentTarget.parentElement;
        var currOffsetTop = event.currentTarget.children[0].offsetTop;
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
        var childScope = scope.$new();
        var compiledTemplate = $compile(layoutTemplate)(childScope);
        angular.element(appendEle).after(compiledTemplate);

        //keep track of appendEle
        if(scope.viewProp.historySelect[selectLevel - 1]){
            scope.viewProp.historySelect[selectLevel - 1].refChildHtml = compiledTemplate;
            scope.viewProp.historySelect[selectLevel - 1].childScope = childScope;
        }

        //add class for new layout        
        var currTargetEle = angular.element(event.currentTarget).find('.card-element');
        var arrowPositionX = event.currentTarget.children[0].offsetLeft + event.currentTarget.children[0].offsetWidth/2 - 30;
        var currBackgroundColor = currTargetEle.css("background-color");
        if(currBackgroundColor == "rgba(0, 0, 0, 0)"){
          var currBackgroundColor = currTargetEle.css("border-color");
        }

        compiledTemplate.css('width', '100%');
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
			  scope.moduleProspectPersonalService.tourGuideFirstLoginForUser("documentDetails", scope.portletId);
		  }, 1000);        	
        }else{
        	$timeout(function() {
        		if(refDocType){
        			scope.moduleProspectPersonalService.tourGuideFirstLoginForUser(refDocType.split(';')[0].capitalizeFirstLetter(), scope.portletId);
        		}
   		  	}, 1000);  
        }                
    }
    
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
    UiFrameworkService.prototype.generalConfigCtrl = function generalConfigCtrl(ctrlName, moduleService, scope) {

        /**
         * We came to this function through 3 ways:
         * - New document (on document screen)
         * - Open existing document (on document screen)
         * - Open existing document (on other screen, like from case)
         */
        
        var self = this;
        scope.name = ctrlName;
        scope.moduleService = moduleService;
        // self.moduleService.businessType = businessType;
        var defer = scope.moduleService.$q.defer();
        //var refDocType = self.getRefDocTypeFromParams();
        var refDocType, businessType, userRole, saleChannel;

        if(!scope.moduleService){
            $log.error('moduleService of ctrl: ' + ctrlName + " isn't declared");
            return;
        }

        self.printDebugInfo(scope);

        // var refDocType = self.moduleService.name;
        // if (self.moduleService.product !='' && self.moduleService.product != undefined){
        //     refDocType = self.moduleService.name + ';product=' + self.moduleService.product;
        // }
        // var productInfor = self.getCurrProductInfor();

        //case open this module screen directly, the detail has been loaded before coming here
        if(scope.$state.params.docType === scope.moduleService.name){
        // if(self.getParentRefDoctype(refDocType) === undefined){
        // if(productInfor.refDocType === undefined){
            refDocType = UiFrameworkService.prototype.getRefDocTypeFromParams();
            businessType = $state.params.businessType;
            userRole = commonUIService.getActiveUserRole();
            saleChannel = commonUIService.getActiveSaleChannel();

            if(!scope.moduleService.detail)
                $log.error('moduleService.detail (ctrl: ' + self.name + ") isn't declared");

            //setup uiStructure of this docType
            UiFrameworkService.prototype.setupUiStructure.call(self,
                {   'refDocType': refDocType, 
                    'businessType': businessType, 
                    'userRole': userRole, 
                    'saleChannel': saleChannel,
                    'docId': $state.params.docId
                }, 
                scope.moduleService.detail,
                scope)
            .then(function hadSetupUiStructure () {
        
                //keep track ctrl                
            	self.registerToHistoryCtrl(scope);
                scope.triggerAutoSaveLoop();

                defer.resolve();
            });
        }
        //open from other module, uiRenderPrototypeService has taken care of creating uiStructures
        else{
        
            //keep track ctrl
        	self.registerToHistoryCtrl(scope);
            scope.triggerAutoSaveLoop();
            var productInfor = scope.getCurrProductInfor();
            refDocType = productInfor.refDocType;
            businessType = productInfor.businessType;
            defer.resolve();
        }


        //TODO: merge promise of action bar into the return promise
        scope.setupActionBar(refDocType, businessType, scope);

        return defer.promise;

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
    UiFrameworkService.prototype.setupUiStructure = function setupUiStructure (docParams, detail, scope) {
        var self = this;

        //TODO: need to match those 2 value
        if(docParams.businessType === 'NewBusiness')
            docParams.businessType = commonService.CONSTANTS.ACTIONTYPE.NEWBUSINESS;

        var defer = uiRenderPrototypeService.$q.defer();

        //init only one time (called from $state of ui-router)
        if(scope.viewProp){
            defer.resolve();
        }else{
            //init variables for render cards on screen
            scope.viewProp = {
                //viewObject: store data to display cards on the screen
                viewObject: [], //a table structure, array 2D, reflect the tree structure of uiStructure 
                viewUiEles: undefined, //list of uiElements. Use for screen show HTML form directly

                //stores history of selecting card (with other associate information)
                //historySelect's selectLevel will lower than viewObject 1 unit
                historySelect: [],
                lastSelectStep : undefined,
                historyObjTmpl: {
                    'index': undefined,//the order of card has been clicked (in a row)
                    'refUiStructure': undefined,//reference to correspondent uiStructure
                    'refDocType': undefined,//keep current doctype of select 
                    'refChildHtml': undefined,//keep the ref to the current drawing of HTML form 
                    'childScope': undefined, //keep the ref to the current angular controller of HTML form
                    'stepLink': undefined//keep the ref to the current drawing of HTML form 
                },//template object for historySelect
                layoutStyle : self.getLayoutStyle(docParams.refDocType),
                historyCtrl: []//keep track the ctrl when generating action-bar
            };

            //refDocType is empty, use inaormation from moduleService
            uiRenderPrototypeService.createConcreteUiStructure(
            		scope.resourceURL, detail, docParams)
            .then(function hadUiStructure (uiStructureRoot) {            
            	scope.uiStructureRoot = uiStructureRoot;

                //uiStructureRoot won't appears on screen, need to find the children to display
                uiRenderPrototypeService.getChildContentOfUiStructure(uiStructureRoot)
                .then( function gotResult (result) {
                    if(uiRenderPrototypeService.isUiStructureObj(result[0])){
                        scope.viewProp.viewObject.push(result);
                    }
                    //currently NOT support HTML static
                    else{
                        scope.viewProp.viewUiEles = result;
                        $log.debug("Render HTML form");
                    }
                    
                    //User Guide: if this card is the first time access, it will show User Guide popover for Card
                    $timeout(function() {
                    	if(scope.uiStructureRoot != undefined)
                    		scope.moduleProspectPersonalService.tourGuideFirstLoginForUser(scope.uiStructureRoot.name.split(':')[1], scope.portletId);
                    }, 1000);
                    
                    //continue last working space (direct sale)
                    if(localStorage.getItem("isContinueLastWorking")){
                        setTimeout(function(){ self.moveToCards(); }, 2000);
                    }
                    //for esignature to loading signing card in transaction document after sign back
                    if(sessionStorage.getItem("isContinueLastSigningWorking")){
                    	sessionStorage.removeItem("isContinueLastSigningWorking");
                    	setTimeout(function(){
                    		if(scope.uiStructureRoot != undefined)
                    			scope.moveToSigningCards(); 
                    	}, 100);
                    }
            
                    defer.resolve();
                });
                
                //scope.checkLoadBreadCrum();

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
     */
    UiFrameworkService.prototype.reSetupConcreteUiStructure = function reSetupConcreteUiStructure (detail, scope, expectedDetailChanged, removeTemplateChildren) {
        //find the current uiStructure of this ctrl.
        var uiStructureRoot = scope.getAssociateUiStructureRoot();

        if(uiStructureRoot){
            // uiRenderPrototypeService.removePreviewFields(uiStructureRoot);
            return uiRenderPrototypeService.reSetupConcreteUiStructure(uiStructureRoot, detail, scope.resourceURL, expectedDetailChanged, removeTemplateChildren);
        }
        
    };
    
    UiFrameworkService.prototype.getRefDocTypeFromParams = function getRefDocTypeFromParams () {
        var result = $state.params.docType;
        var product = $state.params.productName ? ";product=" + $state.params.productName : "";
        return result + product;
    };
    
    /**
     * setup some common variable and behavior for screen doesn't have datamodel (payment, configuration screen,...)
     * 
     * @param  {String} ctrlName        name of the ctrl
     * @param  {Object} refDocType      current refDocType of this ctrl
     * @param  {String} businessType    [description]
     * @return {Object}                 Angular Promise, success when got uiStructure
     */
    UiFrameworkService.prototype.setupCtrlWithoutDetail = function setupCtrlWithoutDetail (ctrlName, refDocType, userType, businessType, userRole, detail, scope) {

        /**
         * We came to this ctrl through 3 ways:
         * - New document (on document screen)
         * - Open existing document (on document screen)
         * - Open existing document (on other screen, like from case)
         */
        
        var self = this;
        scope.name = ctrlName;
        var defer = uiRenderPrototypeService.$q.defer();
        

        self.printDebugInfo(scope);

        //TODO: merge promise of action bar into the return promise
        self.setupActionBar(refDocType, businessType, scope);

        //case open this module screen directly, the detail has been loaded before coming here
        if(scope.getParentRefDoctype(refDocType) === undefined){
            //setup uiStructure of this docType
        	scope.setupUiStructure(
                {   'refDocType': refDocType, 
                    'businessType': businessType, 
                    'userRole': commonUIService.getActiveUserRole()
                }, detail).then(function hadSetupUiStructure () {
                //keep track ctrl                
                self.registerToHistoryCtrl(scope);

                defer.resolve();
            });
        }
        //open from other module, uiRenderPrototypeService has taken care of creating uiStructure
        else{
            //keep track ctrl
            self.registerToHistoryCtrl(scope);
            defer.resolve();
        }
            

        return defer.promise;

    };
    
    UiFrameworkService.prototype.printDebugInfo = function printDebugInfo(scope) {
        $log.debug(scope.name + " is initialized...");
    };
    
    
	return new UiFrameworkService();
}])	

/*##################################################################
 * Loading Bar Service: show or hide loading 
###################################################################*/
.service('loadingBarService', ['$log', 'commonService', function($log, commonService){
	function LoadingBarService($log){
		this.counter = 0; //# of total request to show and hide loading bar (expect #req to show == #req to hide)
		this.showOptions = {}; //default showOptions
		this.hideOptions = {}; //default hideOptions
	};

	LoadingBarService.prototype.showLoadingBar = function (showOptions){
		self = this;
		if(commonService.hasValueNotEmpty(sessionStorage.getItem("longOverLay")) && self.longOverLay){
			return;
		}
		showOptions = showOptions || this.showOptions;
		this.counter++;

		//only show when counter is equal 1, otherwise it's been showed, don't need to set again
		if(showOptions.forceShow || this.counter === 1){
			$('#ipos-full-loading').show(); 
		}
		if(commonService.hasValueNotEmpty(sessionStorage.getItem("longOverLay")) && !self.longOverLay){
			self.longOverLay = true;
			self.fullFoadingOpacity = $('#ipos-full-loading').css("opacity");
			$('#ipos-full-loading').css("opacity", 0.9);
			return;
		}
	};

	LoadingBarService.prototype.hideLoadingBar = function (hideOptions){
		self = this;
		if(commonService.hasValueNotEmpty(sessionStorage.getItem("longOverLay")) && self.longOverLay){
			return;
		}
		else if(!commonService.hasValueNotEmpty(sessionStorage.getItem("longOverLay")) && self.longOverLay){
			self.longOverLay = undefined;
			$('#ipos-full-loading').css("opacity", self.fullFoadingOpacity);
		}
		hideOptions = hideOptions || this.hideOptions;
		this.counter--;
		if(this.counter < 0){
			this.counter = 0;
			$log.warn("There is a logical error: # of hide > # of show")
		}
		if(hideOptions.forceHide || this.counter === 0 ){
			$('#ipos-full-loading').hide(); 
		}
	};

	return new LoadingBarService($log);
}])


var activeRequests = {}; // keeping all active requests operations
var iconStore = {};
var spinIcon = "fa fa-spinner fa-spin fa-2x";
var fontSpinIcon = "<i class='fa fa-spinner fa-spin loading-button-icon'></i>";
var isPartialLoading=false;
//parttern for partial loading
var patterns=[
				/underwritings\?/gi,
				/integral\/policies\?/gi,
				/integral\/claims\?/gi,
				/integral\/clients\?/gi,
				/integral\/paymentdues\?/gi,
				/integral\/renewals\?/gi,
				/(user\/(.*)\/operations\/validate\/update)/gi,
				/organization-contacts/,
				/(illustration\/complete)/gi,
				/(illustration\/incomplete)/gi,
				/(illustration\/operations\/compute\?)/gi,
				/(prospect\/(.*)\/operations\/update)/gi,
				/resourcefiles/,
				/(illustration\/pdf)/gi,
				/illustration\/incomplete\?/gi,
				/(documents\/(.*)\/operations)/gi,
				/restrictions/gi,
				/docmapDefinitions/gi
			];
var activeLinks=[];//active link for partial loading
/*##################################################################
 * Interceptor Module
###################################################################*/
var HttpInterceptorModule = angular.module('HttpInterceptorModule', ['commonModule'])
.config(['$httpProvider', function ($httpProvider) {
	$httpProvider.interceptors.push('myHttpInterceptor');
	$httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';	
	$httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
	$httpProvider.defaults.transformResponse.push(function (data, headerGetter) {
		//$log.debug(" http response:  ==========================================");
		//$log.debug(" data response: "+ JSON.stringify(data));
		if(data.forceLogOut){
	    	//$log.debug("forceLogOut ==========================================");
	    	var msg='v3.errorinformation.message.alert.signinanother';
			window.localStorage.setItem('logoutCause',msg);
	    	window.doSignOut();
	        //return data;
	    }else{
	    	return data;
	    }
		
	});
	
}])
//register the interceptor as a service, intercepts ALL angular ajax http calls
.factory('myHttpInterceptor', ['$q', '$window', '$log', 'commonService', 'loadingBarService',
	function ($q, $window, $log, commonService, loadingBarService) {	
	var mainScope;

	function getMainScope () {
		if(!mainScope)
			mainScope = angular.element('#newWorkspace').scope();
		return mainScope;
	}

	function checkBackendGotError (response) {
		var message;
		try{			
			//for runtime error
			var iposResponse = getValueByPropertyName(response, 'ipos-response:response');
			if(iposResponse && iposResponse['@code'] === "500"){
				var cause = getValueByPropertyName(iposResponse, 'ipos-response:cause');				
				message = "There're errors with backend. Please contact admin!";
				var mainScope = getMainScope();
				if(mainScope)
					mainScope.showAlert(message, 'alert', 10000);
				$log.error("Error from backend. See response object below for more detail: ");
				$log.error(response);
			}
		}
		catch(e){
			$log.error(e);
		}
	}

	return {
	    // optional method
	    'request': function(config) {
	    	//in device, request start with '/' can't be executed
	    	if(window.cordova){
	    		config.url = config.url[0] !== '/' ? config.url : config.url.substr(1);
	    	}
	    	else if (window.Liferay.Fake){
	    		config.url = config.url[0] !== '/' ? config.url : '.' + config.url;	
	    	}

	    	var contextPathTheme = angular.contextPathTheme;
	    	var runtime=undefined;
	    	if (typeof(config.url)=='string'){
	    		runtime = config.url.indexOf('p_resource_id');
	    	}
	    	
	    	//if request endpoint of Runtime 
	    	if(runtime!=-1 && config.runtimeURL!=undefined ){
	    		//findout if request is in partial loading list
	    		var patternLength=patterns.length;
	    		for (var i = 0; i < patternLength;i ++) {
					var result=config.runtimeURL.match(patterns[i]);
					if (result!==null) {
						activeLinks.push(config.runtimeURL);
						break;
					}
				}

				//if request's in partial loading list
	    		if (activeLinks.length>0) {
	    			//add new loading for list
	    			if (config.url.indexOf("dashboardportlet") == -1 && config.url.indexOf("underwritingrequestslist") == -1 && 
	    					(config.runtimeURL=="case-managements" || config.runtimeURL=="prospects" ||
	    						config.runtimeURL.indexOf("policies")!=-1 || config.runtimeURL.indexOf("claims")!=-1 ||
	    						config.runtimeURL.indexOf("clients")!=-1 || config.runtimeURL.indexOf("underwritings")!=-1 ||
	    						config.runtimeURL.indexOf("resourcefiles/metadatas/casemanagement")==0) ) {
	    				var append="<span class='list_module_loading' style='position:fixed; top:20px; left:45%;z-index:999'><img src='"+contextPathTheme+"/images/loading_list.gif'></span>";
						$('body').append(append);
					}
	    			else{
	    				var totalClass=$("[class *='ipos-partial-loading-selected-']");
		    			var currentClass='.ipos-partial-loading-selected-'+(totalClass.length);
		    			if($(currentClass).is('input')||$(currentClass).is('button') && activeRequests[config.runtimeURL] == undefined){
		    				$(currentClass).prepend(fontSpinIcon);
		    				$(currentClass).prop('disabled', true);
		    			}
		    			else { // For element has loading is section or div
		    				var icon = $(currentClass).find( "i.fa" );
			    			if(icon.length > 0) {
			    				iconStore[config.runtimeURL] = icon.attr("class");
			    				icon.attr('class', spinIcon);
			    			}
		    			}
						
						 activeRequests[config.runtimeURL]=currentClass;
						 // Replace icon by spinner
						 $('.loading_image_overlay').click(function(e){
							e.stopPropagation();
				     	  })
	    			}	
	    				
				}
				//if not, waiting for all screen
	    		else{
	    			//$('#ipos-full-loading').show();
	    			try {
	    		    if (config.url.indexOf("contactcenter") == -1 && config.url.indexOf("dashboardportlet") == -1 && config.url.indexOf("underwritingrequestslist") == -1) {
	    		        loadingBarService.showLoadingBar();
	    		    }
	    			} catch(e) {
	    				loadingBarService.showLoadingBar();
	    			}
	    		}
	    	}
	    	
	    	/////////////////////////////////////////////////////////////////////////
	    	//For Standalone webapp
	    	//Interceptor not working on standalone web app, because standalone webapp missing RuntimeURL
	    	if(config.mobileAppRequest){
	    		/*var activeLinks=[];//active link for partial loading
*/	    		//findout if request is in partial loading list
	    		var patternLength=patterns.length;
	    		for (var i = 0; i < patternLength;i ++) {
					var result=config.url.match(patterns[i]);
					if (result!==null) {
						activeLinks.push(config.url);
						break;
					}
				}

				//if request's in partial loading list
	    		if (activeLinks.length>0) {
	    			//add new loading for list
	    			if (config.url.indexOf("dashboardportlet") == -1 && config.url.indexOf("underwritingrequestslist") == -1 && 
	    					(config.url=="case-managements" || config.url=="prospects" ||
	    						config.url.indexOf("policies")!=-1 || config.url.indexOf("claims")!=-1 ||
	    						config.url.indexOf("clients")!=-1 || config.url.indexOf("underwritings")!=-1 ||
	    						config.url.indexOf("resourcefiles/metadatas/casemanagement")==0) ) {
	    				var append="<span class='list_module_loading' style='position:fixed; top:20px; left:45%;z-index:999'><img src='"+contextPathTheme+"/images/loading_list.gif'></span>";
						$('body').append(append);
					}
	    			else{
	    				var totalClass=$("[class *='ipos-partial-loading-selected-']");
		    			var currentClass='.ipos-partial-loading-selected-'+(totalClass.length);
		    			if($(currentClass).is('input')||$(currentClass).is('button') && activeRequests[config.url] == undefined){
		    				$(currentClass).prepend(fontSpinIcon);
		    				$(currentClass).prop('disabled', true);
		    			}
		    			else { // For element has loading is section or div
		    				var icon = $(currentClass).find( "i.fa" );
			    			if(icon.length > 0) {
			    				iconStore[config.url] = icon.attr("class");
			    				icon.attr('class', spinIcon);
			    			}
		    			}
						
						 activeRequests[config.url]=currentClass;
						 // Replace icon by spinner
						 $('.loading_image_overlay').click(function(e){
							e.stopPropagation();
				     	  })
	    			}	
	    				
				}
				//if not, waiting for all screen
	    		else{
	    			//$('#ipos-full-loading').show();
	    			try {
	    		    if (config.url.indexOf("dashboardportlet") == -1 && config.url.indexOf("underwritingrequestslist") == -1) {
	    		        loadingBarService.showLoadingBar();
	    		    }
	    			} catch(e) {
	    				loadingBarService.showLoadingBar();
	    			}
	    		}
	    		
	    	}
	    	//////////////////////////////////////////////////////////////////////
	    	return config || $q.when(config);
	    },
	    'requestError': function(rejection) {
	    	// remove url from activeRequests;
			var url = rejection.config.url;
			for (var index = 0; index < activeRequests.length; index++) {
				if (activeRequests[index] === url) {
					activeRequests.splice(index, 1);
					break;
				}
			}
			// do something on error
			var module = rejection.config.url.substring(0, rejection.config.url.indexOf('/'));
			if(rejection.status == 403){
				 window.location = "sestimeout";
				 return $q.reject(rejection);
			}else if(rejection.status == 401){
				 window.location = "login";
				 return $q.reject(rejection);
			}
			if (module && module !== 'notification'){
				var loadingMessageBox = $('#loadingMessageBox');
				loadingMessageBox.text('An error has occured...');
				var loadingDialog = $("#loadingDialog");
				loadingDialog.modal('hide');
				loadingMessageBox.show();
			}
		return $q.reject(rejection);
		},
		'response': function(response) {
			checkBackendGotError(response);

			//for new response from runtime (Dec-2015)
			//remove temporarily unused attributes ("_links" & "data") from runtime
			if(!response.config.mobileAppRequest){//this is interceptor for portal request
				if(response.data && response.data.result){
					var data = response.data;
					
					if(data.result._links && data.result._content){
						data.result = data.result._content;
	
						//if metadatas, each metadata will associate with its specific relative links
						//so for now, we temporarily remove the '_links' parts
						if(data.result.MetadataDocuments){
							var metadatas = data.result.MetadataDocuments.MetadataDocument;
							if(metadatas){
								for(var i = 0; i < metadatas.length; ++i){
									metadatas[i] = metadatas[i]._content;
								}	
							}
						}
					}
				}
	
				//if partial loading
				if (activeLinks.length > 0 
					&& response.config.runtimeURL != undefined 
					&& activeLinks.indexOf(response.config.runtimeURL) !== -1) {
					//Notification
					$('#notificationCounter').html(response.data.countNotification);
					delete response.data['countNotification'];
					if (response.data['result']!=undefined) {
						var result = response.data['result'];
						delete response.data['result'];
						response.data = result;
					}
				
					var date = new Date();
					var milliseconds = date.getTime();
					localStorage.setItem("timeNotificationCounterStorage", milliseconds);
					//End Notification
		    		if (response.config.runtimeURL=="case-managements" || response.config.runtimeURL=="prospects" ||
		    				response.config.runtimeURL.indexOf("policies")!=-1 || response.config.runtimeURL.indexOf("claims")!=-1 ||
		    				response.config.runtimeURL.indexOf("clients")!=-1 || response.config.runtimeURL.indexOf("underwritings")!=-1 ||
		    				response.config.runtimeURL.indexOf("resourcefiles/metadatas/casemanagement")==0) {
		    			$('.list_module_loading').remove();
		    	
					}
		    		else{
		    			for (var key in activeRequests)
			    		{		    		    
			    		    if (response.config.runtimeURL==key) {
			    		    	if ($(activeRequests[key]).is('input') ||$(activeRequests[key]).is('button')) {
			    		    		$(activeRequests[key]).find("i.fa-spinner").remove();
			    		    		$(activeRequests[key]).next().remove();
			    		    		$(activeRequests[key]).prop('disabled', false);
								} else {
				    		    	var icon = $(activeRequests[key]).find("i.fa");
									if(icon.length > 0) {
										icon.attr('class', iconStore[key]);
									}
								}
			    		    	$(activeRequests[key]).removeClass(activeRequests[key].split('.')[1]);
			    		    	delete activeRequests[key];
			    		    	delete iconStore[key];
			    		    	isPartialLoading=false;
			    		    	//$('#ipos-full-loading').hide(); 
					    		loadingBarService.hideLoadingBar();
			    		    	break;
							}
			    		}
		    		}
		    		//remove active link from array
	    			var index=activeLinks.indexOf(response.config.runtimeURL);
	    			if (index!=-1) {
	    				activeLinks.splice(index, 1);
					}
	    			
				}
		    	else {
		    		if(response.config.runtimeURL != undefined){
			    		$('#notificationCounter').html(response.data.countNotification);
						delete response.data['countNotification'];
						if (response.data['result']!=undefined) {
							var result = response.data['result'];
							delete response.data['result'];
							response.data = result;
						}
	
			    		//$('#ipos-full-loading').hide(); 
			    		loadingBarService.hideLoadingBar();
			    	}
		    		
				}
			}
			//////////////////////////////////////////////////////////////////////
	    	//For Standalone webapp
			else{//this is interceptor for runtime request from stand alone webapp
	    		//for new response from runtime (Dec-2015)
				//remove temporarily unused attributes ("_links" & "data") from runtime
				if(response.data && response.data.result){
					var data = response.data;
					
					if(data.result._links && data.result._content){
						data.result = data.result._content;

						//if metadatas, each metadata will associate with its specific relative links
						//so for now, we temporarily remove the '_links' parts
						if(data.result.MetadataDocuments){
							var metadatas = data.result.MetadataDocuments.MetadataDocument;
							if(metadatas){
								for(var i = 0; i < metadatas.length; ++i){
									metadatas[i] = metadatas[i]._content;
								}	
							}
						}
					}
				}

				//if partial loading
				if (activeLinks.length > 0 
					&& response.config.url != undefined 
					&& activeLinks.indexOf(response.config.url) !== -1) {
					//Notification
					$('#notificationCounter').html(response.data.countNotification);
					delete response.data['countNotification'];
					if (response.data['result']!=undefined) {
						var result = response.data['result'];
						delete response.data['result'];
						response.data = result;
					}
				
					var date = new Date();
					var milliseconds = date.getTime();
					localStorage.setItem("timeNotificationCounterStorage", milliseconds);
					//End Notification
		    		if (response.config.url=="case-managements" || response.config.url=="prospects" ||
		    				response.config.url.indexOf("policies")!=-1 || response.config.url.indexOf("claims")!=-1 ||
		    				response.config.url.indexOf("clients")!=-1 || response.config.url.indexOf("underwritings")!=-1 ||
		    				response.config.url.indexOf("resourcefiles/metadatas/casemanagement")==0) {
		    			$('.list_module_loading').remove();
		    	
					}
		    		else{
		    			for (var key in activeRequests)
			    		{		    		    
			    		    if (response.config.url==key) {
			    		    	if ($(activeRequests[key]).is('input') ||$(activeRequests[key]).is('button')) {
			    		    		$(activeRequests[key]).find("i.fa-spinner").remove();
			    		    		$(activeRequests[key]).next().remove();
			    		    		$(activeRequests[key]).prop('disabled', false);
								} else {
				    		    	var icon = $(activeRequests[key]).find("i.fa");
									if(icon.length > 0) {
										icon.attr('class', iconStore[key]);
									}
								}
			    		    	$(activeRequests[key]).removeClass(activeRequests[key].split('.')[1]);
			    		    	delete activeRequests[key];
			    		    	delete iconStore[key];
			    		    	isPartialLoading=false;
			    		    	//$('#ipos-full-loading').hide(); 
					    		loadingBarService.hideLoadingBar();
			    		    	break;
							}
			    		}
		    		}
		    		//remove active link from array
	    			var index=activeLinks.indexOf(response.config.url);
	    			if (index!=-1) {
	    				activeLinks.splice(index, 1);
					}
	    			
				}
		    	else {
		    		if(response.config.url != undefined){
			    		$('#notificationCounter').html(response.data.countNotification);
						delete response.data['countNotification'];
						if (response.data['result']!=undefined) {
							var result = response.data['result'];
							delete response.data['result'];
							response.data = result;
						}

			    		//$('#ipos-full-loading').hide(); 
			    		loadingBarService.hideLoadingBar();
			    	}
		    		
				}
	    	}
	    	///////////////////////////////////////////////////////
	    	 return response || $q.when(response);
	     },
	     'responseError': function(rejection) {
	    	 if (window.Liferay.Fake) {
	    		 if (typeof standAloneWebappType !== 'undefined' && standAloneWebappType == 'WEB_DIRECT') {
	    			 if (rejection.status != 200 && rejection.config.url.indexOf(serverUrl) != -1) {
		    			 rejection.status = 200;
		    			 loadingBarService.hideLoadingBar();
			    		 return rejection;
		    		 }
    			}
	    	 }
	    	 /*lastActivity = new Date();
	    	 // remove url from activeRequests;
	    	 var url = rejection.config.url;
	    	 for (var index = 0; index < activeRequests.length; index++) {
	    		 if (activeRequests[index] === url) {
					 activeRequests.splice(index, 1);
		             break;
	    		 }
	    	 }
			 // do something on error
			 var module = rejection.config.url.substring(0, rejection.config.url.indexOf('/'));
			 if(rejection.status == 403){
				 window.location = "sestimeout";
				 return $q.reject(rejection);
			 }else if(rejection.status == 401){
				 window.location = "login";
				 return $q.reject(rejection);
			 }
			 
			 if (module && module !== 'notification' && module !== 'views'){
				 var loadingMessageBox = $('#loadingMessageBox');
				 //loadingMessageBox.text(appService.getI18NText('workspace.message.error'));
				 loadingMessageBox.text('An error has occured...');
				 var loadingDialog = $("#loadingDialog");
				 loadingDialog.modal('hide');
				 loadingMessageBox.show();
			 }*/
			 return $q.reject(rejection);
	     }
	};
}]);

var httpInterceptor = angular.module('httpInterceptorModule1', [])
.config(['$httpProvider', function ($httpProvider) {
	$httpProvider.interceptors.push('myHttpInterceptor1');
	$httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';	
}])
//register the interceptor as a service, intercepts ALL angular ajax http calls
.factory('myHttpInterceptor1', ['$q', '$window', function ($q, $window) {
	return {
		// optional method
		'request': function(config) {
			return config || $q.when(config);
		},
		'requestError': function(rejection) {
			return $q.reject(rejection);
		},
		'response': function(response) {
			return response || $q.when(response);
		},
		'responseError': function(rejection) {
			// do something on error
			if(rejection.status == 403){
				window.location = "login";
				return $q.reject(rejection);
			};
			return $q.reject(rejection);
		}
	};
}]);



function WSDialog(path, title, content){
	if (typeof(path) === 'undefined' || path === null || path.length == 0){
		var err = new IposError("Cannot create dialog. The path of dialog file is undefined, or null, or empty");
		err.param("path", path);
		err.param("title", title);
		err.param("content", content);
		err.throwError();
	}
	this.path = path;
	this.title = title;
	this.content = content;
	this.close = function(){
		this.path = undefined;
	};
}
