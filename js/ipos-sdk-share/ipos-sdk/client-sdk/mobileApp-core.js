'use strict';
var mobileAppModule = angular.module('mobileAppModule',['coreModule'])
.service('mobileAppCoreModule', ['$q', 'ajax', '$location', 'appService', 'cacheService', 'detailCoreService', 'commonService', 'connectService',
	function($q, ajax, $location, appService, cacheService, detailCoreService, commonService, connectService){
	function MobileAppCoreModule($q, ajax, $location, appService, cacheService, detailCoreService, commonService, connectService){
		var self = this;
		this.detailCoreService = detailCoreService;
		detailCoreService.ListDetailCoreService.call(self, $q, ajax, $location, appService, cacheService, commonService);
		this.name = commonService.CONSTANTS.MODULE_NAME.MOBILE;
		this.deviceInformation = {
                    "device_id":"12345", 
                    "device_name":"android", 
                    "platform": "android", 
                    "os_version": "test", 
                    "model":"", 
                    "manufacturer":"",
                    "ios_app_bundle_id":"1", 
                    "google_package_name":"", 
                    "app_version":"1.0"};
	};
	inherit(detailCoreService.ListDetailCoreService, MobileAppCoreModule);
	
	 /**
     * Update valid time for user account when logout
     * @param userName
     * @param validTime
     * @returns {promise}
     */
	MobileAppCoreModule.prototype.get_config_MobileApp = function() {
       var self = this;
       var deferred = $q.defer();       
       connectService.exeAction({
            actionName: "SYSTEM_GET_CONFIG",
            actionParams: [],
            resourceURL: undefined
       })
       .then(function (data) {
           deferred.resolve(data);
       });
       return deferred.promise;
	};
	MobileAppCoreModule.prototype.save_Language_MobileApp = function(id) {
           var self = this;
           var deferred = $q.defer();
           connectService.exeAction({
                actionName: "SYSTEM_SAVE_CONFIG_LANGUAGE",
                actionParams: [id],
                resourceURL: undefined
           })
           .then(function (data) {
               deferred.resolve(data);
           });
           return deferred.promise;
    	};
   
	/**
    * Get user login
    * @param params
    * @param data
    * @returns {promise}
    */
   	MobileAppCoreModule.prototype.login_mobileApp = function(params, data) {
	    var self = this;
	    var deferred = $q.defer();
	    connectService.exeAction({
	    	actionName: "SYSTEM_CHECK_LOGIN",
	    	actionParams: params,
	    	resourceURL: undefined,
	    	data: data
	    })
	    .then(function (data) {			     	
	     	deferred.resolve(data);
	    });
	    return deferred.promise;
	 };

	/**
    * Update valid time for user account when logout
    * @param userName
    * @param validTime
    * @returns {promise}
    */
	 MobileAppCoreModule.prototype.update_valid_time_mobileApp = function(userName, validTime) {
		 var self = this;
		 var deferred = $q.defer();		 
		 connectService.exeAction({
			 actionName: "SYSTEM_UPDATE_VALID_TIME",
			 actionParams: [userName, validTime],
			 resourceURL: undefined
		 })
		 .then(function (data) {
			 deferred.resolve(data);
		 });
		 return deferred.promise;
	 };

	 /**
	 * Set profileId and username after login successfully
	 * @param userName
	 * @param profileId  
	 * @returns {promise}
	 */
	 MobileAppCoreModule.prototype.setProfile_mobileApp = function(userName, profileId) {
	    var self = this;
	    var deferred = $q.defer();
	    connectService.exeAction({
	    	actionName: "CHOOSE_PROFILE",
	    	actionParams: [userName, profileId],
          resourceURL: undefined
	    })
	    .then(function (data) {		  	
	     	deferred.resolve(data);
	    });
	    return deferred.promise;
	 };
	 
	 /**
	 * Sync all document
	 * @param syncDocument  
	 * @returns {promise}
	 */
	 MobileAppCoreModule.prototype.sync_mobileApp = function(syncDocument) {
	    var self = this;
	    var deferred = $q.defer();
	    connectService.exeAction({
	    	actionName: "SYNC_DOCS",
	    	actionParams: [syncDocument],
          resourceURL: undefined
	    })
	    .then(function (data) {		  	
	     	deferred.resolve(data);
	    });
	    return deferred.promise;
	 };
	 
	 /**
	 * Sync special document by caseID  
	 * @returns {promise}
	 */
	 MobileAppCoreModule.prototype.sync_doc_by_caseID = function(dataArray, metadataArray) {
	    var self = this;
	    var deferred = $q.defer();
	    connectService.exeAction({
	    	actionName: "SYNC_DOCS_BY_CASE_ID",
	    	data:{},
	    	actionParams: [dataArray, metadataArray]
	    })
	    .then(function (data) {		  	
	     	deferred.resolve(data);
	    });
	    return deferred.promise;
	 };
	 
	 /**
	 * Sync list metadata of case management 
	 * @returns {promise}
	 */
	 MobileAppCoreModule.prototype.sync_list_metadata_case = function() {
	    var self = this;
	    var deferred = $q.defer();
	    connectService.exeAction({
	    	actionName: "SYNC_LIST_METADATA_CASE",
	    	actionParams: []
	    })
	    .then(function (data) {		  	
	     	deferred.resolve(data);
	    });
	    return deferred.promise;
	 };
    /** hle56
            * Sync list metadata of case management fail
            * @returns {promise}
            */
    MobileAppCoreModule.prototype.sync_list_metadata_case_fail = function() {
       var self = this;
       var deferred = $q.defer();
       connectService.exeAction({
           actionName: "SYNC_LIST_METADATA_CASE_FAIL",
           actionParams: []
       })
       .then(function (data) {
           deferred.resolve(data);
       });
       return deferred.promise;
    };
    /** hle56
    * Sync special document by caseID
    * @returns {promise}
    */
    MobileAppCoreModule.prototype.sync_doc_fail_by_caseID = function(dataArray) {
       var self = this;
       var deferred = $q.defer();
       connectService.exeAction({
           actionName: "SYNC_DOCS_FAIL_BY_CASE_ID",
           data:dataArray,
           actionParams: []
       })
       .then(function (data) {
           deferred.resolve(data);
       });
       return deferred.promise;
    };
    /** hle56
        * Check case for show button SUbmit, Reject and Accept counter offer
        * @returns {promise}
        */
        MobileAppCoreModule.prototype.check_sync_fail = function(dataArray) {
           var self = this;
           var deferred = $q.defer();
           connectService.exeAction({
               actionName: "CHECK_SYNC_FAIL",
               data:{},
               actionParams: dataArray
           })
           .then(function (data) {
               deferred.resolve(data);
           });
           return deferred.promise;
        };

	return new MobileAppCoreModule($q, ajax, $location, appService, cacheService, detailCoreService, commonService);
}]);