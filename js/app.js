'use strict';

angular.module('iposApp', [
    //form 3rd-parties
    'ui.router', 'ngMaterial', 'pascalprecht.translate', 'fsCordova', 'angularFileUpload',

    //from our project
    'commonModule', 'coreModule', 'commonUIModule', 'directiveUIModule', 'filterUIModule', 'prospectModule', 'prospectUIModule',
    'connectionModule', 'illustrationUIModule', 'illustrationModule', 'tabModule', 'applicationUIModule', 'applicationModule', 'quotationUIModule', 'syncUIModule', 'syncModule',
    'fieldModule', 'pdpaUIModule', 'resourceModule', 'resourceUIModule', 'salecaseUIModule', 'salecaseModule'
])

.run(function($rootScope, $state, $log, cordovaService, connectService) {
        cordovaService.ready.then(function initConnector(platformId) {
            $log.info("Current Platform: " + platformId);
            connectService.setPlatform(platformId);
        });

        // //register event for ui-router
        // $rootScope.$on('$stateChangeError',
        //     function(event, toState, toParams, fromState, fromParams, error) {
        //         $log.warn("There's error \'" + error.message + "\' when transition from: \"" + fromState.name + "\" to state: \"" + toState.name + "\"");
        //         // transitionTo() promise will be rejected with
        //         // a 'transition prevented' error
        //     }
        // );

        //trick: create an oldState in $state
        $state.oldState = {};
        $rootScope.$on('$stateChangeSuccess',
            function(event, toState, toParams, fromState, fromParams) {
                if (!fromState.abstract) {
                    //console.log("State changed from: \"" + fromState + "\" to state: \"" + toState + "\"");
                    $state.oldState.name = fromState.name;
                    $state.oldState.params = fromParams;
                }
            }
        );


    })
    .config(function($stateProvider, $urlRouterProvider) {

        /**
         * Return AngularJS Controller's name for binding
         * @param  {String} moduleName prospect, illustration,...
         * @param  {String} type       list, overview, detail
         * @return {String}            ProspectOverviewCtrl,...
         */
        var genCtrlName = function(docType, type, productName) {
            var ctrlName = "";
            docType = docType.split('-').map(
                function (text) {
                    return text.capitalizeFirstLetter();
                }
            ).join('');
            ctrlName = docType + type.capitalizeFirstLetter() + "Ctrl";
            console.log("gen ctrl: " + ctrlName);
            return ctrlName;
        }

        /**
         * Return HTML url for binding
         * @param  {String} moduleName prospect, illustration,...
         * @param  {String} type       list, overview, detail, header
         * @return {String}            'templates/module/prospect_list.html',...
         */
        var genHtmlUrl = function(moduleName, type, productName) {
            
            moduleName = moduleName.replace(/-/g, "_") + '_';
            if(productName) {
                productName = productName.replace(/-/g, "_") + '_';
            }else
                productName = "";

            var templateUrl = 'templates/module/' + moduleName + productName + type + '.html';
            console.log("gen html-url: " + templateUrl);
            return templateUrl;
        }

        // if none of the below states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/login');

        $stateProvider
            .state('login', {
                url: "/login",
                templateUrl: "templates/login.html",
                controller: 'LoginCtrl'
            })
            .state('resumeSync', {
                url: "/resumeSync",
                templateUrl: "templates/resume_sync.html",
                controller: ''
            })
            //root layout
            .state('home', {
                url: "/home",
                abstract: true,
                templateUrl: "templates/layout/root_layout.html",
                controller: 'WorkspaceCtrl'
            })
            //side-bar sate
            .state('home.side_bar', {
                url: "/view",
                abstract: true,
                views: {
                    'left-bar-view': {
                        templateUrl: "templates/sidebar.html",
                        controller: 'SideBarCtrl'
                    }
                }
            })
            //left-right layout
            .state('home.side_bar.left_right', {
                url: "/view",
                abstract: true,
                views: {
                    'main-view-layout@home': {
                        templateUrl: "templates/layout/left_right_layout.html",
                        controller: ''
                    }
                }
            })
            //update left view (list)
            .state('home.side_bar.left_right.list', {
                url: "/{moduleName}-list",
                params: {
                    moduleName: ''
                },
                // sticky: true,
                views: {
                    'left-view': {
                        /**
                         * Ex: 
                         * templateUrl: "templates/document_list.html",
                         * controller: 'DocumentListCtrl'
                         */
                        templateUrl: function($stateParams) {
                            return genHtmlUrl($stateParams.moduleName, 'list');
                        },
                        controllerProvider: function($stateParams) {
                            return genCtrlName($stateParams.moduleName, 'list');
                        }
                    },
                    'tab-list': {
                        //Always this
                        templateUrl: "templates/tab.html",
                        controller: 'TabCtrl'
                    },
                    //dum header & content
                    'right-header': {
                        templateUrl: function($stateParams) {
                            return 'templates/document_header.html';
                        }
                    },                    
                    'right-content': {
                        templateUrl: function($stateParams) {
                            return 'templates/document_overview.html';
                        }
                    }
                }
            })
            
            //update right view
            .state('home.side_bar.left_right.list.detail', {
                url: "/{doctype}-view/{productName}/{docId}",
                //{{productName}} can be empty, we ignore the url because it only appear in browser
                params: {
                    doctype: '',
                    docId: 'new',
                    productName: ''
                },
                // sticky: true,
                views: {
                    'tab-list': {
                        //Always this
                        templateUrl: "templates/tab.html",
                        controller: 'TabCtrl'
                    },
                    'right-header@home.side_bar.left_right': {
                        /**
                         * Ex:
                         * templateUrl: "templates/module/prospect_header.html",
                         * controller: 'ProspectHeaderCtrl'
                         */
                        templateUrl: function($stateParams) {
                            return genHtmlUrl($stateParams.doctype, 'header', $stateParams.productName);
                        },
                        controllerProvider: function($stateParams) {
                            return genCtrlName($stateParams.doctype, 'header', $stateParams.productName);
                        }
                    },
                    'right-content@home.side_bar.left_right': {
                        /**
                         * Ex:
                         * templateUrl: "templates/document_abc_overview.html",
                         * controller: 'DocumentAbcOverviewCtrl'
                         */
                        templateUrl: function($stateParams) {
                            return genHtmlUrl($stateParams.doctype, 'overview', $stateParams.productName);
                        },
                        controllerProvider: function($stateParams) {
                            return genCtrlName($stateParams.doctype, 'overview', $stateParams.productName);
                        }
                    }
                }
            })
            //right view sub-detail
            .state('home.side_bar.left_right.list.detail.sub', {
                url: "/{subId}",
                params: {
                    subId: ''
                },
                views: {
                    'tab-list': {
                        //Always this
                        templateUrl: "templates/tab.html",
                        controller: 'TabCtrl'
                    },
                    'right-content@home.side_bar.left_right': {
                        /**
                         * Ex:
                         * templateUrl: "templates/document_overview.html",
                         * controller: 'DocumentOverviewCtrl'
                         */
                        templateUrl: function($stateParams) {
                            // return 'templates/module/' + $stateParams.doctype + '_' + $stateParams.subId + '.html';
                            return genHtmlUrl($stateParams.doctype, $stateParams.subId);
                        },
                        //use parent controller
                        controllerProvider: function($stateParams) {
                            return genCtrlName($stateParams.doctype, 'overview', $stateParams.productName);
                        }
                    }
                }
            })
            //right view sub-detail
            .state('home.side_bar.left_right.list.detail.subModule', {
                url: "/{subId}",
                params: {
                    subId: '',
                    subModule: ''
                },
                views: {
                    'tab-list': {
                        //Always this
                        templateUrl: "templates/tab.html",
                        controller: 'TabCtrl'
                    },
                    'right-content@home.side_bar.left_right': {
                        /**
                         * Ex:
                         * templateUrl: "templates/document_overview.html",
                         * controller: 'DocumentOverviewCtrl'
                         */
                        templateUrl: function($stateParams) {
                            // return 'templates/module/' + $stateParams.subModule + '_' + $stateParams.subId + '.html';
                            return genHtmlUrl($stateParams.subModule, $stateParams.subId);
                        },
                        //use parent controller
                        controllerProvider: function($stateParams) {
                            return genCtrlName($stateParams.subModule, 'overview', $stateParams.productName);
                        }
                    }
                }
            })
           
            //full-screen layout
            .state('home.side_bar.full_screen', {
                abstract: true,
                views: {
                    'main-view-layout@home': {
                        templateUrl: "templates/layout/full_screen_layout.html",
                        // controller: ''
                    }
                }
            })
            //sync screen
            .state('home.side_bar.full_screen.detail', {
                url: "/{moduleName}",
                params: {
                    moduleName: ''
                },
                views: {
                    'header-view': {
                        templateUrl: function($stateParams) {
                            return genHtmlUrl($stateParams.moduleName, 'header');
                        },
                        controllerProvider: function($stateParams) {
                            return genCtrlName($stateParams.moduleName, 'header');
                        }
                    },
                    'content-view': {
                        templateUrl: function($stateParams) {
                            return genHtmlUrl($stateParams.moduleName, 'overview');
                        },
                        controllerProvider: function($stateParams) {
                            return genCtrlName($stateParams.moduleName, 'overview');
                        }
                    }
                }
            })
        ;
    })
    .config(function($mdThemingProvider) {
        var colors = ["red", "pink",
            "purple",
            "deep-purple",
            "indigo",
            "blue",
            "light-blue",
            "cyan",
            "teal",
            "green",
            "light-green",
            "lime",
            "yellow",
            "amber",
            "orange",
            "deep-orange",
            "brown",
            "grey",
            "blue-grey",
        ];
        var index;

        //register all material theme when page loaded
        for (index = 0; index < colors.length; ++index) {
            $mdThemingProvider.theme(colors[index]).primaryPalette(colors[index]).accentPalette(colors[index]);
        }

        //load stored data
        var color = localStorage.getItem("color");

        //set default theme
        if (!color || color == "undefined")
            color = 'green';

        //set theme configurations
        $mdThemingProvider.setDefaultTheme(color);
        var defaultColor = $mdThemingProvider._PALETTES[color]['500'];
        var background = $mdThemingProvider._PALETTES[color]['50'];
        var mainColor = $mdThemingProvider._PALETTES[color]['A700'];
        var chevron = $mdThemingProvider._PALETTES[color]['100'];

        //change some css element when change theme
        changeCSS('.sel', 'border-color', mainColor + '!important');
        changeCSS('.subSel', 'background-color', background + '!important');
        // changeCSS('.docList:hover', 'border-color', border + '!important');
        changeCSS('.background-chevron', 'background-color', chevron + '!important');
        changeCSS('.default-color', 'color', mainColor + '!important');
        //change css for v3switch
        changeCSS('.v3-switch-selected', 'background', mainColor + '!important');
        changeCSS('.v3-switch-indicator-bar', 'background', mainColor + '!important');

        changeCSS('.v3-switch-selected10', 'background', mainColor + '!important');
        changeCSS('.v3-switch-indicator-bar10', 'background', mainColor + '!important');

        changeCSS('.toggle-side-nav', 'background', defaultColor + '!important');


        


        


    })
    .config(['$translateProvider', function($translateProvider) {
            $translateProvider.useStaticFilesLoader({
                prefix: 'i18n/',
                suffix: '.json'
            });
            $translateProvider.preferredLanguage('en.translation');
        }

    ]);

angular.module( 'fsCordova' , [])
    .service('cordovaService', ['$document', '$q',
    function($document, $q) {

        var d = $q.defer();
        var resolved = false;
        var platformId = 'web'; //default is web browser

        this.ready = d.promise;

        //mobile platform
        if(window.cordova){                
            document.addEventListener('deviceready', function() {
                resolved = true;
                d.resolve(window.cordova.platformId);
            });
            // Check to make sure we didn't miss the
            // event (just in case)
            setTimeout(function() {
                if (!resolved) {
                    if (window.cordova)
                        d.resolve(window.cordova.platformId);
                }
            }, 3000);
        }else{
            var browserInfo = getBrowserInfor();
            d.resolve(platformId);
        }
    }
]);

/**
 * return browser name & version
 * @return {Array} Array[0]: browser name. Array[1]: browser version
 */
function getBrowserInfor(){
    var ua = navigator.userAgent, tem,
    M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];

    //M[0]: "Chrome/43"
    //M[1]: "Chrome"
    //M[2]: "43"
    //index: 75
    //input: "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.124 Safari/537.36"
    //length: 3    
    if(/trident/i.test(M[1])){
        tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE '+(tem[1] || '');
    }
    if(M[1]=== 'Chrome'){
        tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
        if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
    }
    M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
    if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
    // return M.join(' ');
    return M;
};

//change css rule http://snipplr.com/view.php?codeview&id=58856
var changeCSS = function changeCSS(theClass, element, value) {
    //var styleSheetsLenght = document.styleSheets[0]cssRules.length;
    document.styleSheets[0].addRule(theClass, element + ': ' + value + ';');
    // var cssRules;
    // for (var S = 0; S < document.styleSheets.length; S++) {
    //     try {
    //         document.styleSheets[S].insertRule(theClass + ' { ' + element + ': ' + value + '; }', document.styleSheets[S][cssRules].length);

    //     } catch (err) {
    //         try {
    //             document.styleSheets[S].addRule(theClass, element + ': ' + value + ';');
    //         } catch (err) {
    //             try {
    //                 if (document.styleSheets[S]['rules']) {
    //                     //use for IE
    //                     cssRules = 'rules';
    //                 } else if (document.styleSheets[S]['cssRules']) {
    //                     cssRules = 'cssRules';
    //                 } else {
    //                     //no rules found... browser unknown
    //                 }
    //                 for (var R = 0; R < document.styleSheets[S][cssRules].length; R++) {
    //                     if (document.styleSheets[S][cssRules][R].selectorText == theClass) {
    //                         if (document.styleSheets[S][cssRules][R].style[element]) {
    //                             document.styleSheets[S][cssRules][R].style[element] = value;
    //                             break;
    //                         }
    //                     }
    //                 }
    //             } catch (err) {}
    //         }
    //     }
    // }
    // }
}
