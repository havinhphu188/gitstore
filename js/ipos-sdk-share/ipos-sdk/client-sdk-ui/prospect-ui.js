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

var prospectUIModule = angular.module('prospectUIModule',['prospectModule', 'commonUIModule'])
.service('prospectUIService', ['$q', 'ajax', '$location','appService', 'cacheService', 'commonUIService', 'prospectCoreService', 'commonService', 'workspaceService',
	function($q, ajax, $location, appService, cacheService, commonUIService, prospectCoreService, commonService, workspaceService){

	function ProspectUIService($q, ajax, $location, appService, cacheService, prospectCoreService, commonService){
		prospectCoreService.constructor.call(this, $q, ajax, $location, appService, cacheService, prospectCoreService.detailCoreService, commonService);
		this.name = commonService.CONSTANTS.MODULE_NAME.PROSPECT;
	
		this.prospectsFilterQuery;				//the query to filter items
		this.prospectsFilterSize = 10;			//the number of items will be shown in the detail (default is 5)
		this.prospectsFilterExpendSize = 10;	//when click to showMoreItem(), the itemsSize will increase this number.
		this.staredItemsOfGroup4 = undefined;
		this.itemsOfGroup4 = undefined;
		this.clientNum = undefined;
		this.prospectSummaryData = undefined;
	};
	inherit(prospectCoreService.constructor, ProspectUIService);
	extend(commonUIService.constructor, ProspectUIService);
	
	//----------------------v3.0 ----------------------
// 	ProspectUIService.prototype.loadDetail = function(prospectId){
// 		var self = this;	 
// 		var deferred = self.$q.defer();
// 		prospectCoreService.loadDetail_V3.call(self, prospectId).then(function(detail){
// 			deferred.resolve(detail);
// 		});
// 		return  deferred.promise;
// 	};
	
// 	ProspectUIService.prototype.getProspectList = function(resourceURL){
// 		var self = this;	 
// 		var deferred = self.$q.defer();
// 		prospectCoreService.getProspectList_V3.call(self).then(function(detail){
// 			deferred.resolve(detail);
// 		});
// 		return  deferred.promise;
// 	};
	


// 	ProspectUIService.prototype.loadProspectList = function(list){
// 		var self = this;
// //		self.items = list;
// 		/*var tempList = list.slice(0);
// 		tempList.unshift("");
// 		self.itemsOfGroup4 = self.buildDocumentGroupOf4(tempList);*/
// 		self.itemsOfGroup4 = self.buildDocumentGroupOf4(list);
// 		self.staredItemsOfGroup4 = self.buildDocumentGroupOf4(self.filterStarredDocument(list));
		
// 		// only show first 20 documents for each list
// 		self.itemsOfGroup4 = self.itemsOfGroup4.slice(0,5);
// 		self.staredItemsOfGroup4 = self.staredItemsOfGroup4.slice(0,5);
// 	};
	
// 	ProspectUIService.prototype.loadList = function(lastUpdatedFlag, subordinateUid){
// 		var self = this;
// 		var deferred = self.$q.defer();
// 		prospectCoreService.loadList.call(self, lastUpdatedFlag, subordinateUid).then(function(list){
// 			self.loadProspectList(list);
// 			deferred.resolve(list);
// 		});
// 		return  deferred.promise;
// 	};
	 
// 	ProspectUIService.prototype.update = function(resourceURL){
// 		var self = this;
// 		var deferred = self.$q.defer();
// 		prospectCoreService.detailCoreService.ListDetailCoreService.prototype.saveDetail_V3.call(self,resourceURL, true, function(data){
// 			/*commonService.showGlobalMessage(appService.getI18NText('workspace.save.success'));*/
// 			deferred.resolve(data);
// 		}, function(message){
// 			/*commonService.showGlobalMessage(message, "danger");*/
// 		});
// 		return  deferred.promise;
// 	};
	
// 	ProspectUIService.prototype.edit = function(resourceURL){
// 		var self = this;
// 		var deferred = self.$q.defer();
// 		prospectCoreService.detailCoreService.ListDetailCoreService.prototype.getDetail_V3.call(self,resourceURL,true, function(data){
// 			/*commonService.showGlobalMessage(appService.getI18NText('workspace.save.success'));*/
// 			deferred.resolve(data);
// 		}, function(message){
// 			/*commonService.showGlobalMessage(message, "danger");*/
// 		});
// 		return  deferred.promise;
// 	};
	
	
	
// 	ProspectUIService.prototype.updateProspectToDB = function(){
// 		var self = this;
// 		var deferred = self.$q.defer();
// 		prospectCoreService.update.call(self, true).then(function(data){
// //			self.items = list;
// 			commonService.showGlobalMessage(appService.getI18NText('workspace.save.success'));
// 			deferred.resolve(data);
// 		}, function(message){
// 			commonService.showGlobalMessage(message, "danger");
// 		});
// 		return  deferred.promise;
// 	};
	
// 	ProspectUIService.prototype.computeProspect = function(){
// 		var self = this;
// 		var deferred = self.$q.defer();
// 		prospectCoreService.computeDocument.call(self).then(function(data){
// 			deferred.resolve(data);
// 		}, function(message){
// 			deferred.reject(message);
// 		});
// 		return  deferred.promise;
// 	};
	
// 	/**
// 	 * Show more Illustration History
// 	 */
// 	ProspectUIService.prototype.showMoreIllustrations = function(){
// 		var self = this;
// 		if (self.extraDetail.illustrationHistory.length > self.prospectsFilterSize){
// 			self.prospectsFilterSize += self.prospectsFilterExpendSize;
// 		}
// 	};
		
// 	//NAVIGATION TO OTHER PAGES ////////////////////////////////////////////////////////////////////////////////////////////////////////
// 	/**
// 	 * Detail must be saved before calling this method, in order that the uid has value
// 	 */
// 	ProspectUIService.prototype.addIllustration = function(itemUid){
// 		var self = this;
// 		var personUid = self.detail.uid;	
// 		var preDefine = workspaceService.getPreDefine(commonService.CONSTANTS.MODULE_NAME.ILLUSTRATION);
// 		preDefine.prospectUid = personUid;
// 	};
// 	/**
// 	 * Detail must be saved before calling this method, in order that the uid has value
// 	 * @param itemUid
// 	 */
// 	ProspectUIService.prototype.addFactFind = function(itemUid){
// 		var self = this;
// 		var personUid = self.detail.uid;	
// 		var preDefine = workspaceService.getPreDefine("factfind");
// 		preDefine.prospectUid = personUid;
// 	};
	
// //	ProspectUIService.prototype.toggleStar = function (prospectMeta){
// //		var self = this;
// //		prospectCoreService.toggleStar.call(self, prospectMeta).then(function(metaData){
// //			var found = false;
// //			var i, j = 0;
// //			for (i = 0; i < self.itemsOfGroup4.length; i++){
// //				var groupsOf4 = self.itemsOfGroup4[i];
// //				for (j = 0; j < groupsOf4.length; j++){
// //					if (groupsOf4[j].uid === prospectMeta.uid){
// //						found = true;
// //						break;
// //					};
// //				}
// //				if (found) break;
// //			}
// //			if (found){
// //				self.itemsOfGroup4[i][j].tags = metaData.tags;
// //			};
// //			
// //			self.staredItemsOfGroup4 = self.buildDocumentGroupOf4(self.filterStarredDocument(self.items));
// //			self.itemsOfGroup4 = self.buildDocumentGroupOf4(self.items);
// //			
// //			if (self.detail != undefined && self.detail.uid != null) {
// //				self.detail.tags = metaData.tags;
// //			}
// //		});
// //	};
	
// 	ProspectUIService.prototype.setStarForNewProspect = function(){
// 		var self = this;
// 		if (self.detail.uid == null){
// 			if (!commonService.hasValueNotEmpty(self.detail.tags)){
// 				self.detail.tags = commonService.CONSTANTS.TAG.STARRED;
// 			} else {
// 				self.detail.tags = "";
// 			}
				
// 		}
// 	};
	
// 	ProspectUIService.prototype.addAddress = function (addressEnums, addressType, addressTypeTxt){
// 		var self = this;
// 		var itemsGroup = self.findElementInElement(self.detail, ['addresses']);
// 		var counter =  self._findProperty(itemsGroup,"counter").value;
// 		if (self.findElementInElement(self.detail, ['addresses']).elements.length < 2
// 				&& counter < 1){
// 			self.addItemToListInDetailWithType(['addresses'], addressType, addressTypeTxt);
			
// 			// remove address type in the list
// 			for(var i = 0; i < addressEnums.length; i++) {
// 			    if(addressEnums[i].value === addressType) {
// 			    	addressEnums.splice(i, 1);
// 			    	break;
// 			    }
// 			}
// 		}
// 	};
	
// 	ProspectUIService.prototype.addContact = function (contactEnums, contactType, contactTypeTxt){
// 		var self = this;
// 		if (self.findElementInElement(self.detail, ['contacts']).elements.length < 4){
// 			self.addItemToListInDetailWithType(['contacts'], contactType, contactTypeTxt);
// 			for(var i = 0; i < contactEnums.length; i++) {
// 			    if(contactEnums[i].value === contactType) {
// 			    	contactEnums.splice(i, 1);
// 			    	break;
// 			    }
// 			}
// 		}
// 	};
	
// 	ProspectUIService.prototype.removeAddress = function(addressEnums, item){
// 		var self = this;
// 		self.removeItemFromListInDetail(['addresses'], item);
// 		var typeToAdd = self.findPropertyInElement(item, ['type'],'value').value;
// 		var typeToAddTxt = self.findPropertyInElement(item, ['type'],'value').text;
// 		addressEnums.push({text:typeToAddTxt, value:typeToAdd});
// 	};
	
// 	ProspectUIService.prototype.removeContact = function(contactEnums, item){
// 		var self = this;
// 		self.removeItemFromListInDetail(['contacts'], item);
// 		var typeToAdd = self.findPropertyInElement(item, ['type'],'value').value;
// 		var typeToAddTxt = self.findPropertyInElement(item, ['type'],'value').text;
// 		contactEnums.push({text:typeToAddTxt, value:typeToAdd});
// 	};
	
// 	ProspectUIService.prototype.adjustAddressEnums = function(addressEnums){
// 		// This requires prospect detail is loaded in advance
// 		var self = this;
// 		var initAddress = self.findElementInElement(self.detail, ['addresses']).elements;
// 		var newAddress = commonService.clone(initAddress[0]);	
// 		addressEnums = self.findEnumsInElement(newAddress,['type']);
				
// 		return self.adjustUIContactAndAddressEnums(addressEnums, initAddress);
// 	};
	
// 	ProspectUIService.prototype.adjustContactEnums = function(contactEnums){
// 		// This requires prospect detail is loaded in advance
// 		var self = this;
		
// 		var initContact = self.findElementInElement(self.detail, ['contacts']).elements;
// 		var newContact = commonService.clone(initContact[0]);	
// 		contactEnums = self.findEnumsInElement(newContact,['type']);
		
// 		return self.adjustUIContactAndAddressEnums(contactEnums, initContact);
// 	};
	
// 	ProspectUIService.prototype.adjustUIContactAndAddressEnums = function(arrayOfEnum, arrayOfElement){
// 		var self = this;
// 		for(var i = 0; i < arrayOfElement.length; i++) {
// 			var typeToRemove = self.findPropertyInElement(arrayOfElement[i], ['type'],'value').value;
// 			for(var j = 0; j < arrayOfEnum.length; j++) {
// 			    if(arrayOfEnum[j].value === typeToRemove) {
// 			    	arrayOfEnum.splice(j, 1);
// 			    	break;
// 			    }
// 			}
// 		}
// 		return arrayOfEnum;
// 	};
	
// 	//************************************ Archive Prospect ************************************
// 	ProspectUIService.prototype.confirmAndArchiveProspect = function(prospectMeta){
// 		var self = this;
// 		var deferred = $q.defer();
		
// 		var title = appService.getI18NText('workspace.archive.confirm.title');
// 		var message = appService.getI18NText('workspace.archive.confirm.text');		
// 		//Show dialog
// 		workspaceService.showConfirmDialog(title, message, function() {
// 			prospectCoreService.archiveDocumentByMetadata.call(self, prospectMeta).then(function(success) {
// 				deferred.resolve();
// 			});
// 		});
// 		return deferred.promise;		
// 	};

// 	ProspectUIService.prototype.getClientNum = function(){
// 		var self = this;
// 		if (self.detail == undefined) return true;
// 		var clientNum = self.findPropertyInDetail(['clientNum'],'value');
// 		self.clientNum = undefined;
// 		if(commonService.hasValueNotEmpty(clientNum.value))
// 			self.clientNum = clientNum.value;
// 	};
	
// 	/**
// 	 * This method is used to remove client link of prospect.
// 	 */
// 	ProspectUIService.prototype.unlinkProspect = function(){
// 		var self = this;
// 		var deferred = self.$q.defer();
		
// 		prospectCoreService.unlinkProspect.call(self,self.detail.uid)
// 		.then(function(result) {
// 			self.detail = result;
// 			self.useCurrentDetailDataAsOriginal();
// 			self.getClientNum();
// 			var detailUid = result.uid;
// 			self.refreshItemInList(detailUid, function(){
// 				deferred.resolve(result);
// 			});

// 		});
		
// 		return deferred.promise;
// 	};

// 	/**
// 	 * This method is used to update client data to prospect if prospect was linked by client.
// 	 */
// 	ProspectUIService.prototype.updatelinkProspect = function(){
// 		var self = this;
// 		var deferred = self.$q.defer();
		
// 		prospectCoreService.updatelinkProspect.call(self,self.clientNum)
// 		.then(function(result) {
// 			self.detail = result;
// 			self.useCurrentDetailDataAsOriginal();
// 			self.getClientNum();
// 			var detailUid = result.uid;
// 			self.refreshItemInList(detailUid, function(){
// 				deferred.resolve(result);
// 			});
// 		});
		
// 		return deferred.promise;
// 	};
	
// 	ProspectUIService.prototype.isDisabled = function(param1, param2){
// 		var self = this;
// 		var rs = prospectCoreService.detailCoreService.ListDetailCoreService.prototype.isDisabled.call(self,param1, param2);
// 		if(self.isLinkToClient()) {
// 			if(param1 != undefined && param1.length > 0){
// 				if (jQuery.inArray(param1[0], self.commonService.CONSTANTS.PROSPECT_DISABLED_ARRAY) < 0) {
// 					return rs;
// 				}else{
// 					return true;
// 				}	
// 			}
// 		}
// 		return rs;
// 	};
	
// 	/**
// 	 * @param item 'attachment 'element
// 	 */
// 	ProspectUIService.prototype.openAttachment = function(item){
// 		var self = this;
// 		var resourceUidProp = self.findPropertyInElement(item, ['uid'], 'value');
// 		var resourceUid = resourceUidProp.value;
// 		self.openResourceFile(resourceUid);
// 	};
// 	//OPEN FILE /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 	ProspectUIService.prototype.openResourceFile = function(resourceUid){
// 		var self = this;
// 		var url = self.name+"/resource/file/read/"+resourceUid;
// 		self.openFile(url);
// 	};
	
// 	ProspectUIService.prototype.loadUiModel = function(){
// 		var self = this;
// 		var deferred = self.$q.defer();
// 		var dataUrl = self.name + '/add/uimodel/099a123e-aaf5-4e41-93d1-e444d47b6e1a';
// 		console.log("________________ dataUrl " + dataUrl);
// 		self.ajax.get(dataUrl).success(function(data){
// 			console.log("uimodel data loaded...................");
// 			self.uiModelData = data;
// 			deferred.resolve(data); 
// 		});
// 		return deferred.promise; 
// 	};
	//----------------------v3.0 ----------------------
	
	return new ProspectUIService($q, ajax, $location, appService, cacheService, prospectCoreService, commonService);
}]);