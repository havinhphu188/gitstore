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

(function(Liferay, angular) {
	angular.portlet.add("ipos-portal-common-portlet", "my-new-workspace",
		function() {
			var portalApp = angular.module('ngAppMyNewWorkspace', 
				[ 
					'ngRoute','ui.router', 'ui.bootstrap', 'filterUIModule', 'coreModule', 'rzModule',
					'prospectUIModule','prospectPersonalUIModule', 'prospectCorporateUIModule', 'commonUIModule', 'illustrationUIModule', 'applicationUIModule',
					'salecaseUIModule', 'pdpaUIModule', 'claimUIModule','deathClaimUIModule','gtlLevelUWUIModule','claimNotificationUIModule', 'factfindUIModule', 'policyUIModule',
					'directiveUIModule', 'ngMaterial', 'urlModule','angularFileUpload', 'angularUtils.directives.dirPagination',
					'translateUIModule', 'uiRenderPrototypeModule', 'transactionUIModule', 'endorsementUIModule','paymentUIModule',
					'clientUIModule', 'underwritingUIModule', 'userModule', 'clientModule', 'ecovernoteUIModule', 'managerReviewUIModule','reviewModule',
					'groupDepartmentUIModule', 'mobileAppModule', 'resourceUIModule', 'configurationUIModule'
				]
			);
			
			portalApp.controller("MyNewWorkspaceCtrl", MyNewWorkspaceCtrl);
			portalApp.controller("SidebarController", SidebarController);
			portalApp.controller("ProspectDetailCtrl", ProspectDetailCtrl);
			portalApp.controller("CorporateDetailCtrl", CorporateDetailCtrl);
			portalApp.controller("DeathClaimRegistrationDetailCtrl", DeathClaimRegistrationCtrl);
			portalApp.controller("PdpaDetailCtrl", PdpaDetailCtrl);
			portalApp.controller("IllustrationDetailCtrl", IllustrationDetailCtrl);
            portalApp.controller("ApplicationDetailCtrl", ApplicationDetailCtrl);
            portalApp.controller("CaseManagementDetailCtrl", CaseManagementDetailCtrl);
            portalApp.controller("FactfindDetailCtrl", FactfindDetailCtrl);
            portalApp.controller("PolicyDetailCtrl", PolicyDetailCtrl);
            portalApp.controller("RenewalDetailCtrl", RenewalDetailCtrl);
            portalApp.controller("EndorsementDetailCtrl", EndorsementDetailCtrl);
            portalApp.controller("ClaimDetailCtrl", ClaimDetailCtrl);
            portalApp.controller("ClaimNotificationDetailCtrl", ClaimNotificationCtrl);
            portalApp.controller("ListImportProspect", ListImportProspect);
            portalApp.controller("ListImportBeneficiary", ListImportBeneficiary);
           // portalApp.controller("ListImportDeathClaimPolicy", ListImportDeathClaimPolicy);
            portalApp.controller("ListImportCorporateProspect", ListImportCorporateProspect);
            portalApp.controller("ListImportQuotation", ListImportQuotation);
            portalApp.controller("ListImportFactfind", ListImportFactfind);
            // portalApp.controller("CreateCaseCtrl", CreateCaseCtrl);
            portalApp.controller("ClientDetailCtrl", ClientDetailCtrl);
            portalApp.controller("EcovernoteDetailCtrl", EcovernoteDetailCtrl);
            portalApp.controller("UnderwritingDetailCtrl", UnderwritingDetailCtrl);
            portalApp.controller("ClientPaymentDetailCtrl", ClientPaymentDetailCtrl);
            portalApp.controller("ManagerReviewDetailCtrl", ManagerReviewDetailCtrl);
            portalApp.controller("CreateContactCtrl", CreateContactCtrl);
            portalApp.controller("BusinessCatalogDetailCtrl", BusinessCatalogDetailCtrl);
            portalApp.controller("UwGroupTermLifeDetailCtrl", UwGroupTermLifeDetailCtrl);
            portalApp.controller("GroupDepartmentDetailCtrl", GroupDepartmentDetailCtrl);
            portalApp.controller("PolicyServicingDetailCtrl", PolicyServicingDetailCtrl);
            portalApp.controller("ResourceFileDetailCtrl", ResourceFileDetailCtrl);
            portalApp.controller("ListImportLifeInsured", ListImportLifeInsured);
            portalApp.controller("PreviewPDFByHtml", PreviewPDFByHtml);

            //For set dev platform

            var mobileAppConfig = {
                    "devPlatform": undefined, 
                    "saleChannel": "AS", 
             };
            if(window.cordova){//window.cordova only available in android or ios
            	mobileAppConfig.devPlatform = "mobile";//this to use some controllers only for mobile
            }

            ////////////////////////////////////////////////////////
            //bypass to use mobile config
            //mobileAppConfig.devPlatform = "mobile";
            /*mobileAppConfig.devPlatform = "mobile"
            mobileAppConfig.saleChannel = "DS";*/

            //inject mobileAppConfig to use in another service
            portalApp.constant('mobileAppConfig', mobileAppConfig);
           ///////////////////////////////////////////////////////

            if(mobileAppConfig.devPlatform == "mobile"){
    			portalApp.controller("RelatedDocController",RelatedDocController);
                portalApp.controller("NavigationCtrl", NavigationCtrl);
                portalApp.controller("ListViewCtrl", ListViewCtrl);
                portalApp.controller("LoginCtrl", LoginCtrl);
                portalApp.controller("SyncCtrl", SyncCtrl);
                portalApp.controller("TransactionMNCDetailCtrl", TransactionMNCDetailCtrl);
                portalApp.controller("PaymentHistoryMNCCtrl",PaymentHistoryMNCCtrl);
                
            	portalApp.config(configMobileApp);// use this config for mobile app

            	//redirect user to login page if not logged in
            	portalApp.run(function($rootScope, $location, $state, mobileAppConfig){
					$rootScope.$on('$stateChangeStart',function(event,next)
					{
					    if(!sessionStorage.getItem("isLoggedIn") 
					    	&& next.name != 'root.list.login' 
					    	&& next.name != 'root.catalog' 
					    	&& next.name != 'root.list.detail'
					    	&& next.name != 'root.list.sync'
					    	){
					      	event.preventDefault();
					        $state.go('root.list.login');
						}
					});
				})

            } else if (window.Liferay.Fake) { // This config for standalone web application
            	if (typeof standAloneWebappType != 'undefined' && standAloneWebappType === 'WEB_DIRECT') {
	            	portalApp.controller("ClientPaymentDetailCtrl", ClientPaymentDetailDSCtrl);
	                portalApp.controller("NavigationDSCtrl", NavigationDSCtrl);
	                portalApp.controller("OtpDSCtrl", OtpDSCtrl);
	                portalApp.controller("HomeDSCtrl", HomeDSCtrl);
	                
	            	portalApp.config(configStandaloneWebApp); // use this config for portal web site
	                
		           	var retrievedPageParams = JSON.parse(localStorage.getItem('pageParams'));
		           	var gotoPortletAction = JSON.parse(localStorage.getItem('gotoPortletAction'));
	
		           	if(!retrievedPageParams){
			            portalApp.run(['$rootScope', '$log', '$state', '$injector', '$location', '$mdDialog','$filter', '$interval', 'urlService', function($rootScope, $log, $state, $injector, $location, $mdDialog, $filter, $interval, urlService) {
				            //hcao7 start
				            var message = urlService.getParameterByName("message");
		            	    var transactionId = urlService.getParameterByName("transactionId");
		            	    
			            	if(message && transactionId){
			            		var paymentMessages = JSON.parse(localStorage.getItem(transactionId));
			            		var redirectUrl = window.location.protocol + "//" + window.location.host  + "/ipos-web-direct/workspace#/case?product=" + paymentMessages.product + "&type=NewBusiness&id=" + paymentMessages.caseId + "&transId=" + transactionId +"&message=" + message;
			            		window.open(redirectUrl, '_self');
			            		/*var title = '',content='';
			            		var paymentMessages = JSON.parse(localStorage.getItem(transactionId));
			            		if(message==='success'){
			            			title=paymentMessages.successTitle;
			            			content=paymentMessages.successContent;
			            		}else if(message==='fail'){
			            			title=paymentMessages.failTitle;
			            			content=paymentMessages.failContent;
			            		}
			            		var myDialog = $mdDialog.show(
			                		$mdDialog.alert()
			                		.parent(angular.element(document.body))
			                		.title(title)
			                		.content('')
			                		.ok(paymentMessages.ok)
			            		).then(function(){
			            			localStorage.removeItem(transactionId);
			            			location.href=location.pathname;
			            		});
			            		
			            		var isDialogOpened=$interval(function(){
			            			if(!myDialog.$$state.status) {
			            				angular.element('#dialog_0 > p').html(content);
			            				$interval.cancel(isDialogOpened);
			            			}
			            		},0)*/
			            		
			            		
			            		
			            	}
			            	//hcao7 end
			            	var path = $location.path();
			            	
			            	if (path.startsWith('/case')) {
			            		runOTPValidation($rootScope, $log, $state, $injector, {});
			            	} else if (path.startsWith('/home')) {
				            		gotoLandingPage($rootScope, $log, $state, $injector, {});
			            	} else {
			            		runPortalApp($rootScope, $log, $state, $injector, {
				                	docType : 'case-management',
				                	ctrlName: 'BusinessCatalogDetailCtrl'
				                });
			            	}
			            }]);
		           	}
		           	else{
		           		if (retrievedPageParams.action == 'createContact') {
		           			portalApp.run(['$rootScope', '$log', '$state', '$injector', function($rootScope, $log, $state, $injector) {
				                runPortalApp($rootScope, $log, $state, $injector, {
				                	docType : '',
				                	ctrlName: 'CreateContactCtrl'
				                });
				            }]);
		           		}           		
		           		else {
		           			portalApp.run(['$rootScope', '$log', '$state', '$injector', function($rootScope, $log, $state, $injector) {
				                runPortalApp($rootScope, $log, $state, $injector, {
						        	docType : '',
						        	ctrlName: 'MyNewWorkspaceCtrl'
						//          docType : 'policy'
							    });
							}]);
		           		}
		           		
		           	}
            	} else if (typeof standAloneWebappType != 'undefined' && standAloneWebappType === 'GROUP_PORTAL') {
                    portalApp.controller("NavigationCtrl", NavigationCtrl);
                    portalApp.controller("ListViewCtrl", ListViewCtrl);
                    portalApp.controller("HomeCtrl", HomeCtrl);
                    portalApp.controller("LoginCtrl", LoginCtrl);
                    portalApp.controller("NavigationGroupCtrl", NavigationGroupCtrl);
                    portalApp.controller("RightPanelCtrl", RightPanelCtrl);
                    
                	portalApp.config(configGroupPortalApp);

                	portalApp.run(['$rootScope', '$state', function($rootScope, $state) {
    					$rootScope.$on('$stateChangeStart',function(event, next) {
    					    if (!sessionStorage.getItem("isLoggedIn") 
    					    	&& next.name != 'root.list.home' && next.name != 'root.list.login' 
    					    	&& (next.name == 'root.list.detail' || next.name == 'root.list.policy')) {
    					      	event.preventDefault();
    					        $state.go('root.list.home');
    						}
    					});
    				}])
            	}
            } else {
            	portalApp.config(configPortalApp); // use this config for portal web site
            
                 
	           	var retrievedPageParams = JSON.parse(localStorage.getItem('pageParams'));
	           	var gotoPortletAction = JSON.parse(localStorage.getItem('gotoPortletAction'));

	           	if(!retrievedPageParams){
		            portalApp.run(['$rootScope', '$log', '$state', '$injector', '$location', function($rootScope, $log, $state, $injector, $location) {
	            		runPortalApp($rootScope, $log, $state, $injector, {
		                	docType : 'case-management',
		                	ctrlName: 'BusinessCatalogDetailCtrl'
		                });
		            }]);
	           	}
	           	else{
	           		if (retrievedPageParams.action == 'createContact') {
	           			portalApp.run(['$rootScope', '$log', '$state', '$injector', function($rootScope, $log, $state, $injector) {
			                runPortalApp($rootScope, $log, $state, $injector, {
			                	docType : '',
			                	ctrlName: 'CreateContactCtrl'
			                });
			            }]);
	           		}           		
	           		else {
	           			portalApp.run(['$rootScope', '$log', '$state', '$injector', function($rootScope, $log, $state, $injector) {
			                runPortalApp($rootScope, $log, $state, $injector, {
					        	docType : '',
					        	ctrlName: 'MyNewWorkspaceCtrl'
					//          docType : 'policy'
						    });
						}]);
	           		}
	           		
	           	}
	        }
	        return [ portalApp.name ];
	     /*   }*/
	    }
    );

})(Liferay, angular);