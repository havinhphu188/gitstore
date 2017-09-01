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


//portal config
var configPortalApp = ['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('root', {
            controller: 'MyNewWorkspaceCtrl',
            template: '<ui-view name="sidebar"></ui-view><ui-view name="main-view"></ui-view>'
        })
        .state('root.list', {
            views: {
                'sidebar': {
                    templateUrl: contextPathRoot + "/view/myNewWorkspace/sidebar.html",
                    controller: 'SidebarController'
                }
            }
        })
        .state('root.list.detail', {
            // default value if params are unavailable
            params: {
                docType: '',
                ctrlName: '',//specific ctrl want to call
                htmlUrl: '',//specific html want to show
                docId: '', 
                productName: '',
                businessType: '',//business transaction (new-business, renewal,..)
                userRole: '',//user role (agent, UW,..)
                saleChannel: '',//sale channel (direct_sale, agent_sale,...)
                gotDetail: false
            },
            views: {
                'main-view@root': {
                    templateUrl: function($stateParams){
                        var htmlUrl = $stateParams.htmlUrl ? $stateParams.htmlUrl : "/view/myNewWorkspace/detail.html";
                        htmlUrl = contextPathRoot +  htmlUrl;
                        //$log.debug('Using ' + htmlUrl);
                        return htmlUrl;
                    },
                    controllerProvider: ['$stateParams', function($stateParams) {
                    	//E-Signature, to load business case back after sign
                    	var b = setSigningCaseInSession();
                    	try{
                    		if(b) return doOpenSigningCase($stateParams);
                    	}catch(e){
                    		// do nothing
                    	}
                    	//End E-Signature filter
						 if ($stateParams.ctrlName)
                            return $stateParams.ctrlName;
						 
                        return genCtrlName('detail', $stateParams.docType, $stateParams.productName, $stateParams.businessType);
                    }]
                }
            }
        });
}];

var configStandaloneWebApp = ['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('root', {
            controller: 'MyNewWorkspaceCtrl',
            template: function(){
	            var htmlUrl = null;              
	            var currUrl = window.location.href;              
         	    if(currUrl.includes("standAloneWeb=false")) {
         	    	htmlUrl = '<ui-view name="sidebar"></ui-view><ui-view name="main-view"></ui-view>';
         	    } else {
         		  htmlUrl = '<ui-view name="navbar-view"></ui-view><ui-view name="main-view"></ui-view><ui-view name="footer"></ui-view>';
         	    }
                return htmlUrl;               
             }         
        })
        .state('root.list', {
            views: {
                'sidebar': {
                    templateUrl: contextPathRoot + "/view/myNewWorkspace/sidebar.html",
                    controller: 'SidebarController'
                },
                'navbar-view':{
                	templateUrl: function($stateParams){           
                        var currUrl = window.location.href;
                        var	htmlUrl = $stateParams.htmlUrl ? $stateParams.htmlUrl : 'themes/'+companyName+'/view/navigation.html';
                        htmlUrl = contextPathRoot +  htmlUrl;
                        //$log.debug('Using ' + htmlUrl);                           
                        return htmlUrl;
                    },
                    controller: 'NavigationDSCtrl'
                },
                'footer': {
                    templateUrl: function($stateParams){           
                        var currUrl = window.location.href;
                        var	htmlUrl = $stateParams.htmlUrl ? $stateParams.htmlUrl : 'themes/'+companyName+'/view/footer.html';
                        htmlUrl = contextPathRoot +  htmlUrl;
                        //$log.debug('Using ' + htmlUrl);
                        return htmlUrl;
                    },
                    controller: 'NavigationDSCtrl'
                }
            }
        })
        .state('root.list.detail', {
            // default value if params are unavailable
            params: {
                docType: '',
                ctrlName: '',//specific ctrl want to call
                htmlUrl: '',//specific html want to show
                docId: '', 
                productName: '',
                businessType: '',//business transaction (new-business, renewal,..)
                userRole: '',//user role (agent, UW,..)
                saleChannel: ''//sale channel (direct_sale, agent_sale,...)
            },
            views: {
                'main-view@root': {
                    templateUrl: function($stateParams){
                        var htmlUrl = $stateParams.htmlUrl ? $stateParams.htmlUrl : "/view/myNewWorkspace/detail.html";
                        htmlUrl = contextPathRoot +  htmlUrl;
                        //$log.debug('Using ' + htmlUrl);
                        return htmlUrl;
                    },
                    controllerProvider: ['$stateParams', function($stateParams) {
                        if($stateParams.ctrlName)
                            return $stateParams.ctrlName;

                        return genCtrlName('detail', $stateParams.docType, $stateParams.productName, $stateParams.businessType);
                    }]
                }
            }
        })
        .state('root.list.otp', {
        	views: {
        		'main-view@root': {
//        			templateUrl : function($stateParams){ 
//    				return '/view/otp/otp.html';
//    			},
    			templateUrl: 'themes/'+companyName+'/view/otp/otp.html',
	        	controller: 'OtpDSCtrl'
        		}
        	}
        })
        .state('homePage', {
            controller: 'HomeDSCtrl',
        	templateUrl: 'themes/'+companyName+'/view/home/home.html'
        })
        .state('detailProductPage', {
        	controller: 'HomeDSCtrl',
        	templateUrl: 'themes/'+companyName+'/view/home/detail-product.html'
        });

}];

//android app config
var configMobileApp = ['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('/login');
    $stateProvider
        .state('root', {
            controller: 'MyNewWorkspaceCtrl',
            templateUrl: contextPathRoot + "my-view/root_layout.html"
        })
        .state('root.list', {
            views: {
                'sidebar': {
                    templateUrl: contextPathRoot + "/view/myNewWorkspace/sidebar.html",
                    controller: 'SidebarController'
                },
                'navbar-view':{
                	templateUrl: function($stateParams){
                        var htmlUrl = "my-view/navigation.html";
                        htmlUrl = contextPathRoot +  htmlUrl;
                        //$log.debug('Using ' + htmlUrl);
                        return htmlUrl;
                    },
                    controller: 'NavigationCtrl'
                }
            }
        })
        .state('root.list.listView', {
        	params: {link:''},
            views: {
                 'main-view@root': {
                        templateUrl: function($stateParams){
                            var htmlUrl = $stateParams.link ? '/my-view/list-view/'+$stateParams.link+'.html' : '/my-view/list-view/sales-hub.html';
                            htmlUrl = contextPathRoot +  htmlUrl;
                            //$log.debug('Using ' + htmlUrl);
                            return htmlUrl;
                        },
                        controller: 'ListViewCtrl'
                    }
            }
        })
        .state('root.list.paymentHistory', {
        	views: {
                'main-view@root': {
                       templateUrl: contextPathRoot + "/my-view/list-view/partial/paymentHistory.html",
                       controller: 'PaymentHistoryMNCCtrl'
                   }
           }
        })
        .state('root.catalog', {
            url: '/businessCatalog',
            views: {
                 'main-view@root': {
                        templateUrl: contextPathRoot + "/view/myNewWorkspace/detail.html",
                        controller: 'BusinessCatalogDetailCtrl'
                    }
            }
        })
        .state('root.list.detail', {
            // default value if params are unavailable
            params: {
                docType: '',
                ctrlName: '',//specific ctrl want to call
                htmlUrl: '',//specific html want to show
                docId: '', 
                productName: '',
                businessType: '',//business transaction (new-business, renewal,..)
                userRole: '',//user role (agent, UW,..)
                saleChannel: ''//sale channel (direct_sale, agent_sale,...)
            },
            views: {
                'main-view@root': {
                    templateUrl: function($stateParams){
                        var htmlUrl = $stateParams.htmlUrl ? $stateParams.htmlUrl : "/view/myNewWorkspace/detail.html";
                        //var htmlUrl = $stateParams.htmlUrl ? $stateParams.htmlUrl : "/view/myNewWorkspace/mobileApp/list_view.html";
                        htmlUrl = contextPathRoot +  htmlUrl;
                        //$log.debug('Using ' + htmlUrl);
                        return htmlUrl;
                    },
                    controllerProvider: ['$stateParams', function($stateParams) {
                        
                        if($stateParams.ctrlName)
                            return $stateParams.ctrlName;

                        return genCtrlName('detail', $stateParams.docType, $stateParams.productName, $stateParams.businessType);
                    }]
                }
            }
        })
        .state('root.list.login', {
        		url: '/login',
                views: {
                    'main-view@root': {
                        templateUrl: "templates/login.html",
                        controller: 'LoginCtrl'
                    }
                }
        })
        .state('root.list.sync', {
                url: '/sync',
                views: {
                    'main-view@root': {
                        templateUrl: "templates/mobileApp_sync.html",
                        controller: 'SyncCtrl'
                    }
                }
        });

}];

var configGroupPortalApp = ['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('/home');
    $stateProvider
        .state('root', {
            controller: 'MyNewWorkspaceCtrl',
            templateUrl: contextPathRoot + "my-view/root_layout.html"
        })
        .state('root.list', {
            views: {
                'navbar-view':{
                	templateUrl: 'themes/'+companyName+'/view/navigation.html',
                    controller: 'NavigationGroupCtrl'
                },
                'footer':{
                	templateUrl: 'themes/'+companyName+'/view/footer.html',
                	controller: 'NavigationGroupCtrl'
                }
            }
        })
        .state('root.list.listView', {
        	params: {link:''},
        	url: '/list',
            views: {
                'main-view@root': {
                    templateUrl: function($stateParams){
                    	var htmlUrl = $stateParams.link ? 'themes/'+companyName+'/view/list-view/'+$stateParams.link+'.html' : 'themes/'+companyName+'/view/list-view/sales-hub.html';
                        htmlUrl = contextPathRoot +  htmlUrl;
                        return htmlUrl;
                    },
                    controller: 'ListViewCtrl'
                }
            }
        })
        .state('root.list.policy', {
        	params: {link:''},
        	url: '/list/policy',
            views: {
                'main-view@root': {
                    templateUrl: function($stateParams){
                    	var htmlUrl = $stateParams.link ? 'themes/'+companyName+'/view/list-view/'+$stateParams.link+'.html' : 'themes/'+companyName+'/view/list-view/partial/policy-list-view.html';
                        htmlUrl = contextPathRoot +  htmlUrl;
                        return htmlUrl;
                    },
                    controller: 'ListViewCtrl'
                }
            }
        })
        .state('root.list.detail', {
            // default value if params are unavailable
            params: {
                docType: '',
                ctrlName: '',//specific ctrl want to call
                htmlUrl: '',//specific html want to show
                docId: '', 
                productName: '',
                businessType: '',//business transaction (new-business, renewal,..)
                userRole: '',//user role (agent, UW,..)
                saleChannel: '',//sale channel (direct_sale, agent_sale,...)
                gotDetail: false
            },
            url: '/detail/:docType?productName&businessType&docId',
            views: {
                'main-view@root': {
                    templateUrl: function($stateParams){
                        var htmlUrl = $stateParams.htmlUrl ? $stateParams.htmlUrl : "/view/myNewWorkspace/detail.html";
                        htmlUrl = contextPathRoot +  htmlUrl;
                        return htmlUrl;
                    },
                    controllerProvider: ['$stateParams', function($stateParams) {
                        if (window.cordova) {
							if($stateParams.ctrlName)
                            	return $stateParams.ctrlName;
						} else {
	                    	if ($stateParams.ctrlName) {
	                            return $stateParams.ctrlName;
	                        } else {
	                        	if (!$stateParams.docType) { 
	                        		return 'BusinessCatalogDetailCtrl';
	                        	}
	                        	if (!$stateParams.gotDetail) {
	                        		localStorage.setItem('pageParams', JSON.stringify({DocType: $stateParams.docType, DocId: $stateParams.docId, Product: $stateParams.productName, CaseName: $stateParams.businessType}));
	                        		return 'MyNewWorkspaceCtrl';
	                        	}
	                        }
						}

                        return genCtrlName('detail', $stateParams.docType, $stateParams.productName, $stateParams.businessType);
                    }]
                }
            }
        })
        .state('root.list.home', {
        	url: '/home',
        	views: {
        		'main-view@root': {
        			templateUrl: 'themes/'+companyName+'/view/home.html',
        			controller: 'HomeCtrl'
        		}
        	}
        })
        .state('root.list.login', {
    		url: '/login',
            views: {
                'main-view@root': {
                    templateUrl: 'themes/'+companyName+'/view/login.html',
                    controller: 'LoginCtrl'
                }
            }
        });

}];

/**
 * Return AngularJS Controller's name for binding
 * @param  {String} ctrlType       list, overview, detail
 * @param  {String} moduleName prospect, illustration,...
 * @param  {String} productName     motor-m-ds, motor-m-as
 * @param  {String} businessType    renewal
 * @return {String}                 ProspectOverviewCtrl,...
 */
function genCtrlName(ctrlType, docType, productName, businessType) {
    var ctrlName = "";
    // for organization-contact doctype
    if (docType == 'organization-contact') {
        docType = 'corporate';
    }
    // for underwriting2 doctype
    if (docType == 'underwriting2') {
     	docType = 'underwriting';
     }
    var prefix = docType;

    if(businessType && businessType !== "NewBusiness" )
        prefix = businessType;

    prefix = prefix.split('-').map(
        function(text) {
//          return text.toLowerCase().capitalizeFirstLetter();
            return text.capitalizeFirstLetter();
        }
    ).join('');

    ctrlName = prefix + ctrlType.capitalizeFirstLetter() + "Ctrl";
    //$log.debug("Using ctrl: " + ctrlName);
    return ctrlName;
};

function runPortalApp($rootScope, $log, $state, $injector, params) {
	setup($rootScope, $log, $state, $injector);
    $log.debug("Init myworkspace angular!!!!");
    // $state.go('root.list.detail', {
    //     docType: doc
    // });
    $state.go('root.list.detail', params);
    //
    //$state.go('root.list.login', params);
    //remove sessionStorage data of e-signature 
    removeSingingSessionStorage();
}

// Setup platform and log when state change success and error
function setup($rootScope, $log, $state, $injector) {
	  var platformService = $injector.get('platformService');
	    var connectService = $injector.get('connectService');
	    
	    platformService.getPlatformId().then(function gotPlatformId(platformId) {
	        $log.debug("Current Platform: " + platformId);
	        connectService.setPlatform(platformId);
	    });

	    //register event for ui-router
	    //Must be ui-router from v0.25 for working
	    $rootScope.$on('$stateChangeError',
	        function(event, toState, toParams, fromState, fromParams, error) {
	            $log.error("There's error \'" + error.message + "\' when transition from: \"" + fromState.name + "\" to state: \"" + toState.name + "\"");
	            // transitionTo() promise will be rejected with
	            // a 'transition prevented' error
	        }
	    );
	    //trick: create an oldState in $state
	    $state.oldState = {};
	    $rootScope.$on('$stateChangeSuccess',
	        function(event, toState, toParams, fromState, fromParams) {
	            if (!fromState.abstract) {
	                // $log.debug("State changed from: \"" + fromState.name + "\" to state: \"" + toState.name + "\"");
	                $state.oldState.name = fromState.name;
	                $state.oldState.params = fromParams;
	            }
	        }
	    );
}

function runOTPValidation($rootScope, $log, $state, $injector, params) {
	setup($rootScope, $log, $state, $injector);
    $log.debug("Init myworkspace angular!!!!");
    // $state.go('root.list.detail', {
    //     docType: doc
    // });
    $state.go('root.list.otp');
    //
    //$state.go('root.list.login', params);

}

function gotoLandingPage($rootScope, $log, $state, $injector, params) {
	setup($rootScope, $log, $state, $injector);    
    $state.go('homePage');   
}

// tvong3
// open case back after sign
function setSigningCaseInSession(){
	var userEmail = localStorage.getItem("userEmail");//to check user is logined
	var params={};window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi,function(str,key,value){params[key.toLowerCase()] = value;});
	var workstepIdParam = params["workstepid"];
	var caseData = localStorage.getItem(workstepIdParam);
	if(userEmail && caseData){
		/*var caseDataJson = JSON.parse(caseData);
		if(caseDataJson.RunOnTablet){
			if(!caseDataJson.CaseLoading){
				caseDataJson.CaseLoading = true;
				caseData = JSON.stringify(caseDataJson);
				localStorage.setItem(workstepIdParam, caseData);
				localStorage.setItem("URLOfSigningFinishActionOnTablet", window.location.href);
				var myWindow = window.open("about:blank", "_self");
				myWindow.close();
				return false;
			}
		}*/
		localStorage.removeItem(workstepIdParam);
		sessionStorage.setItem(workstepIdParam, caseData);
		return true;
	}
	return false;
}

function doOpenSigningCase($stateParams){
	var params = getParams();
	var workstepIdParam = params["workstepid"];
	var caseData = JSON.parse(sessionStorage.getItem(workstepIdParam));
	if(caseData){
			$stateParams.docType = caseData.DocType;
			$stateParams.docId = caseData.DocId;
			$stateParams.productName = caseData.Product;
			$stateParams.businessType = caseData.CaseName;
			$stateParams.ctrlName = "";
//			sessionStorage.removeItem(caseId);//this line is comment, if not, it's not work
			var listSigningCardHistory = '';
			if (caseData.Product == 'regular-unit-link') { 
				listSigningCardHistory = '["case-management-rul:Step5_DocumentCenter", "case-management-rul:TransactionDocuments"]';
			} else if (caseData.Product == 'endowment') {
				listSigningCardHistory = '["case-management-endowment:Step5_DocumentCenter", "case-management-endowment:TransactionDocuments"]';
			}
			sessionStorage.setItem("listSigningCardHistory", listSigningCardHistory);
			sessionStorage.setItem("isContinueLastSigningWorking", true);
			sessionStorage.setItem("longOverLay", true);
			localStorage.removeItem("URLOfSigningFinishActionOnTablet");
	}
	if ($stateParams.ctrlName) {
		return $stateParams.ctrlName;
	} else {
		if (!$stateParams.docType) {
			return 'BusinessCatalogDetailCtrl';
		} else if (!$stateParams.gotDetail) {
			localStorage.setItem('pageParams', JSON.stringify({
				DocType : $stateParams.docType,
				DocId : $stateParams.docId,
				Product : $stateParams.productName,
				CaseName : $stateParams.businessType
			}));
			return 'MyNewWorkspaceCtrl';
		}
	}
	return genCtrlName('detail', $stateParams.docType, $stateParams.productName, $stateParams.businessType);
}
function removeSingingSessionStorage(){
	sessionStorage.removeItem("listSigningCardHistory");
	sessionStorage.removeItem("isContinueLastSigningWorking");
	sessionStorage.removeItem("longOverLay");
}
function getParams(){
	var urlParam = window.location.search;
	var params={};urlParam.replace(/[?&]+([^=&]+)=([^&]*)/gi,function(str,key,value){params[key.toLowerCase()] = value;});
	if(params && JSON.stringify(params) == "{}"){
		var urlOfSigningFinishActionOnTablet = localStorage.getItem("URLOfSigningFinishActionOnTablet");
		if(urlOfSigningFinishActionOnTablet){
			urlParam = urlOfSigningFinishActionOnTablet;
			urlParam.replace(/[?&]+([^=&]+)=([^&]*)/gi,function(str,key,value){params[key.toLowerCase()] = value;});
		}
	}
	return params;
}