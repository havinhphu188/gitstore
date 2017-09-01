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

var claimUIModule = angular.module('claimUIModule',['claimModule', 'commonUIModule'])
.service('claimUIService', ['$q', 'ajax', '$location', 'appService', 'cacheService', 'commonUIService', 'claimCoreService', 'commonService',  
	function($q, ajax, $location, appService, cacheService, commonUIService, claimCoreService, commonService){

	function claimUIService($q, ajax, $location, appService, cacheService, claimCoreService, commonService){
		var self = this;
		claimCoreService.constructor.call(self, $q, ajax, $location, appService, cacheService, claimCoreService.detailCoreService, commonService);
		this.claimList = [];
	};
	inherit(claimCoreService.constructor, claimUIService);
	extend(commonUIService.constructor, claimUIService);

	
	claimUIService.prototype.loadClaimDetail = function(resourceURL,claimNum){
		var self = this;
		var deferred = self.$q.defer();
		claimCoreService.loadClaimDetail.call(self,resourceURL, claimNum).then(function(result){
			deferred.resolve(result);
		});
		return  deferred.promise;
	};
	claimUIService.prototype.loadClaimListAgent = function(resourceURL){
		var self = this;
		var deferred = self.$q.defer();
		claimCoreService.loadClaimListAgent.call(self,resourceURL).then(function(result){
			deferred.resolve(result);
		});
		return  deferred.promise;
	};
	
	claimUIService.prototype.loadClaimListClient = function(resourceURL){
		var self = this;
		var deferred = self.$q.defer();
		claimCoreService.loadClaimListClient.call(self,resourceURL).then(function(result){
			deferred.resolve(result);
		});
		return  deferred.promise;
	};
	
	claimUIService.prototype.loadClaimListClientMNCLife = function(resourceURL,BirthDay,FullName,Gender,RiskGroup){
		var self = this;
		var deferred = self.$q.defer();
		claimCoreService.loadClaimListClientMNCLife.call(self,resourceURL,BirthDay,FullName,Gender,RiskGroup).then(function(result){
			deferred.resolve(result);
		});
		return  deferred.promise;
	};
	
	claimUIService.prototype.getDocumentDetail_V3 = function(resourceURL, claimId){
		 var self = this;
		 var deferred = self.$q.defer();
		 //mock for test
		 //var mockData = {"IposDocument":{"@xmlns":"http:\/\/www.csc.com\/integral\/common","@xmlns:claim-status-motor":"http:\/\/www.csc.com\/integral\/claim-status-motor","Header":{"DocInfo":{"DocType":"Claim","Product":"motor","DefUid":"","DocId":"","DocName":"","DocVersion":"","OwnerUid":"","CreatedDate":"","UpdatedDate":"","UpdatedUserUid":"","Tags":"","Star":"","Archived":"","Comments":""},"DocAccessControllList":{"User":{"@userid":"","Permisions":{"Permision":""}}},"DocStatus":{"DocumentStatus":"","BusinessStatus":"ACTIVE"}},"Data":{"claim-status-motor:Claim":{"@xmlns:claim-status-motor":"http:\/\/www.csc.com\/integral\/claim-status-motor","@vpms-suffix":"Claim","claim-status-motor:PolicyInfo":{"@vpms-suffix":"PolicyInfo","claim-status-motor:ProductName":{"@vpms-suffix":"ProductName","$":"VPM"},"claim-status-motor:PolicyNo":{"@vpms-suffix":"PolicyNo","$":"V0000559"},"claim-status-motor:InceptionDate":{"@vpms-suffix":"InceptionDate","$":"2015-02-15"},"claim-status-motor:ExpiryDate":{"@vpms-suffix":"ExpiryDate","$":"2016-02-15"},"claim-status-motor:EffectiveDate":{"@vpms-suffix":"EffectiveDate","$":"2015-02-15"},"claim-status-motor:ServicingStaff":{"@vpms-suffix":"ServicingStaff","$":"700001"},"claim-status-motor:PolicyOwner":{"@vpms-suffix":"PolicyOwner","$":"A Fac Outforward"},"claim-status-motor:ClientID":{"@vpms-suffix":"ClientID","$":"50000898"},"claim-status-motor:Agent":{"@vpms-suffix":"Agent","$":"A Fac Outforward"},"claim-status-motor:AgentID":{"@vpms-suffix":"AgentID","$":"10000416"}},"claim-status-motor:ClaimInfo":{"@vpms-suffix":"ClaimInfo","claim-status-motor:Claimant":{"@vpms-suffix":"Claimant","$":"50000898"},"claim-status-motor:DateOfLoss":{"@vpms-suffix":"DateOfLoss","$":"2015-02-15"},"claim-status-motor:ReportDate":{"@vpms-suffix":"ReportDate","$":"2015-02-15"},"claim-status-motor:ClaimNo":{"@vpms-suffix":"ClaimNo","$":"V3000173"},"claim-status-motor:LossDesc":{"@vpms-suffix":"LossDesc","$":"headlight is damaged"},"claim-status-motor:Insured":{"@vpms-suffix":"Insured","$":"9000.00"},"claim-status-motor:Currency":{"@vpms-suffix":"Currency","$":"SGD"}},"claim-status-motor:VehicleInfo":{"@vpms-suffix":"VehicleInfo","claim-status-motor:VehicleRegNo":{"@vpms-suffix":"VehicleRegNo","$":"ghvhj"},"claim-status-motor:VehicleClass":{"@vpms-suffix":"VehicleClass","Options":{"Option":""},"Value":"CO"},"claim-status-motor:CoverType":{"@vpms-suffix":"CoverType","Options":{"Option":""},"Value":"CO"},"claim-status-motor:EngineCapacity":{"@vpms-suffix":"EngineCapacity","$":"235"},"claim-status-motor:ChasisNo":{"@vpms-suffix":"ChasisNo","$":"gf"},"claim-status-motor:NCDPercent":{"@vpms-suffix":"NCDPercent","$":"0.000"}},"claim-status-motor:DriverInfo":{"@vpms-suffix":"DriverInfo","claim-status-motor:DriverName":{"@vpms-suffix":"DriverName","$":"Januzaj Adnan"},"claim-status-motor:DriverID":{"@vpms-suffix":"DriverID","$":"432434"},"claim-status-motor:DriverDOB":{"@vpms-suffix":"DriverDOB","$":"1990-01-01"},"claim-status-motor:DriverGender":{"@vpms-suffix":"DriverGender","Options":{"Option":""},"Value":"D\/List"},"claim-status-motor:ExcessType":{"@vpms-suffix":"ExcessType","Options":{"Option":""},"Value":""},"claim-status-motor:ExcessAmount":{"@vpms-suffix":"ExcessAmount","$":"0.0"}},"claim-status-motor:AccidentInfo":{"@vpms-suffix":"AccidentInfo","claim-status-motor:Location":{"@vpms-suffix":"Location","Options":{"Option":""},"Value":"SGP"},"claim-status-motor:Place":{"@vpms-suffix":"Place","$":"qqqq"},"claim-status-motor:Province":{"@vpms-suffix":"Province"},"claim-status-motor:District":{"@vpms-suffix":"District"},"claim-status-motor:PostalCode":{"@vpms-suffix":"PostalCode"},"claim-status-motor:Repairer":{"@vpms-suffix":"Repairer"},"claim-status-motor:TypeOfLoss":{"@vpms-suffix":"TypeOfLoss","$":"Fire"},"claim-status-motor:CauseType":{"@vpms-suffix":"CauseType","$":"Fire"},"claim-status-motor:Agreement":{"@vpms-suffix":"Agreement"},"claim-status-motor:PolicyReport":{"@vpms-suffix":"PolicyReport"}},"Attachments":{"@vpms-suffix":"Attachments","Attachment":{"@refResourceDocType":"","@refResourceUid":"","@vpms-suffix":"Attachment","FileUid":{"@refResourceStatus":"","@refResourceVal":"","@vpms-suffix":"FileUid"},"Name":{"@refResourceStatus":"","@refResourceVal":"","@vpms-suffix":"Name"},"FileName":{"@refResourceStatus":"","@refResourceVal":"","@vpms-suffix":"FileName"},"CreateDate":{"@refResourceStatus":"","@refResourceVal":"","@vpms-suffix":"CreateDate"},"FileSize":{"@refResourceStatus":"","@refResourceVal":"","@vpms-suffix":"FileSize"}}}}}}};
		 claimCoreService.loadClaimDetail(resourceURL, claimId).then(function(detail){
			 /*if(!self.findElementInDetail_V3(['ClaimNo'])) {
				 detail = mockData;
			 }*/
			 self.detail = detail;
             deferred.resolve(detail);
		 });
		 return  deferred.promise;
	 };
	
	return new claimUIService($q, ajax, $location, appService, cacheService, claimCoreService, commonService);
}]);