angular.module('iposApp').controller('WorkspaceCtrl',
    function(
        //from angular services
        $scope, $log, $injector, $filter, $q, $timeout, $stateParams,

        //from 3rd-parties
        $state, $mdDialog, $mdToast, $translate, $mdSidenav, $mdUtil, 

        //from our project
        prospectUIService, illustrationUIService, quotationUIService, commonService, 
        workspaceService, tabService, applicationUIService, connectService, resourceUIService
    )

    {

        //initialize variables for scope
        $scope.init = function initScope () {   
            this.state = $state;
            this.$q = $q;

            this.name = 'WorkspaceCtrl';
            this.commonService = commonService;
            this.CONSTANTS = commonService.CONSTANTS;
            this.workspaceService = workspaceService;
       
            
            this.currModuleName = commonService.CONSTANTS.MODULE_NAME.PROSPECT;
            // this.currUiService = undefined; //current UIservice
            
            this.vars = {};
            this.vars.bLoadingLeftView = false; //is loading data for left view
            this.vars.bLoadingRightView = false; //is loading data for right view
            this.vars.bLoadingFullView = false; //is loading data for fullscreen view

            this.vars.bIsListChanged = false; //indicate for refresh list 
            this.vars.bIsListSyncChanged = false;
            this.vars.bIsHeaderContentChanged = false; //brief document content on right view
            this.vars.bIsContentChanged = false; //indicate for refresh the document content's view
            this.vars.showSearchbar = false; //show search bar or not
            this.vars.errorSearch = ""; //error when search         
            this.vars.portraitView = false;
            this.vars.enablePrintPDF = false;//
            this.vars.moduleListView = undefined;
            this.vars.prevCardEle = undefined;//selecting card
            this.vars.showEmptyListMessage = false; //show the empty list messages
            this.vars.subPageTitle = undefined;//title change when click sub page
            this.vars.isOnSubStateL1 = false;//if true, we're on state .sub (subpage level 1, level 2 is coming)
            this.vars.isOnSubinSubState = false;
            this.vars.back = undefined; //TODO: don't know yet
            this.vars.iCardSelected = undefined;//current selected card in list
            this.vars.contactError = undefined;//error when validate contac

            //for navigate to another module then go back
            this.vars.preModuleService = undefined;
            this.vars.currModuleService = undefined;

            // $scope.tagList = []; //array contain all taglist
            //template for side bar
            $scope.templates =
            [ { name: 'template1.html', url: 'templates/sidebar_full.html'},
              { name: 'template2.html', url: 'templates/sidebar_minimize.html'} ];
            //default sidebar template
            $scope.temp = $scope.templates[1].url;
            $scope.mini = false;
            $scope.fullSideBar = false;
        }

        // each time device oriented the reset toggle side bar
        $scope.detectOrientation = function(){
            window.addEventListener("orientationchange", function() {
                document.getElementById("slide-sidebar").checked = false;
            }, false);
        }
        $scope.detectOrientation();

        /**
         * Change title on header bar when going to subpage
         * @param  {String} title new title
         */
        $scope.changeSubTitleL1 = function(title){
            $scope.vars.subPageTitle = title;
        }

        
        $scope.init();
        //toggle sidebar
        $scope.toggle = function() {
            var remember = document.getElementById('slide-sidebar');
            if (remember.checked) {
                remember.checked = false;
            } else {
                remember.checked = true;
            }
            if ($scope.mini == true)
                $scope.temp = $scope.templates[1].url;
            else
                $scope.temp = $scope.templates[0].url;
            $scope.mini = !$scope.mini;
            this.selectedDiv = angular.element("#" + $scope.vars.moduleListView);
        }

        //toggle sidebar
        $scope.closeSideBar = function(){
            var remember = document.getElementById('slide-sidebar');
            if (remember.checked){
            remember.checked = false;
            $scope.temp = $scope.templates[1].url;
            $scope.mini = false;
            this.selectedDiv = angular.element("#" + $scope.vars.moduleListView);}
            // document.getElementById('slide-sidebar').checked = false;
            // $scope.temp = $scope.templates[1].url;
            // $scope.mini = !$scope.mini;
            // this.selectedDiv = angular.element("#" + $scope.vars.moduleListView);
        }

        $scope.toggleSelected = function toggleSelected() {
            if (this.selectedDiv)
                this.selectedDiv.toggleClass('selected-item radius-corner');
        }

        $scope.moduleListName = undefined;

        $scope.showPDF = function (productName) {
            if(!illustrationUIService.eSignPath){
                $scope.vars.bLoadingFullView = true;//show loading full screen 
                illustrationUIService.viewPDF(productName).then(function(esignPath) {
                    //if eSign is summited
                    if(esignPath){
                        illustrationUIService.deactSign = true;
                        $scope.openMessageBar("Submitted Successful");
                        $scope.refreshContent(); 
                    }
                    $scope.vars.bLoadingFullView = false;//after view success, hide loading   
                });
            }
        }


        // $scope.toggleLeftSide = function(){
        //     // document.getElementById("slide-sidebar").checked = true;
        //       var remember = document.getElementById('slide-sidebar').checked = false;

        // }

        // $scope.toggleSide = function(){
        //     $scope.fullSideBar = !$scope.fullSideBar;
        // }

    
  

        $scope.resetVarsWhenChangeModule = function resetVars () {
            $scope.bLoadingLeftView = false; //is loading data for left view
            $scope.bLoadingRightView = false; //is loading data for right view
            $scope.bLoadingFullView = false; //is loading data for fullscreen view
            $scope.vars.showSearchbar = false; //show search bar or not
            $scope.vars.strSearch = ""; //delete old search value
            $scope.vars.errorSearch = ""; //error when search         
        }

        $scope.readDeviceOrientation = function readDeviceOrientation() {
            var viewElement = angular.element("#main-view");
            var floatElement = angular.element("md-sidenav.md-sidenav-left");  
            if(connectService.platform == 'ios'){
                if(!$state.is('login')){   
                    if (Math.abs(window.orientation) === 180 || Math.abs(window.orientation) === 0) {
                        // portrait
                        $scope.vars.portraitView = true;
                        $scope.mini = false;
                        // $scope.close();
                        viewElement.removeClass("main-view-position-relative");
                        viewElement.addClass("main-view-position-staic");
                        floatElement.removeClass("margin-list-to-normal");
                        // floatElement.addClass("margin-list-to-left");
                        // $scope.goToState('home.side_bar.left_right.portrait.list', {
                        //     moduleName: commonService.CONSTANTS.MODULE_NAME.PROSPECT
                        // });
                    } else {
                        // landscape
                        $scope.vars.portraitView = false;
                        $scope.mini = false;
                        
                        viewElement.removeClass("main-view-position-static");
                        viewElement.addClass("main-view-position-relative");
                        floatElement.removeClass("margin-list-to-left");
                        floatElement.addClass("margin-list-to-normal");
                        $scope.close();
                        // $scope.goToState('home.side_bar.left_right.list', {
                        //     moduleName: commonService.CONSTANTS.MODULE_NAME.PROSPECT
                        // });
                    }
                }
            }else{
                $scope.vars.portraitView = false;
                $scope.close();
                viewElement.removeClass("main-view-position-static");
                viewElement.addClass("main-view-position-relative");
                floatElement.removeClass("margin-list-to-left");
                floatElement.addClass("margin-list-to-normal");
            }
            
        }

        window.onorientationchange = $scope.readDeviceOrientation;

        

        // left sidenav
        $scope.toggleLeftNav = buildToggler('left');

        function buildToggler(navID) {
            var debounceFn =  $mdUtil.debounce(function(){
                var remember = document.getElementById('slide-sidebar');
                if (remember.checked){
                    $scope.toggle();
                }else{
                    $mdSidenav(navID).toggle().then(function () {
                        $scope.keepOpen = !$scope.keepOpen;
                        if ($scope.keepOpen)
                            angular.element('md-backdrop.md-sidenav-backdrop-custom').removeClass('disabled');
                        else
                            angular.element('md-backdrop.md-sidenav-backdrop-custom').addClass('disabled');
                    });    
                }
            },0);
            return debounceFn;
        }

        $scope.close = function () {
            $scope.keepOpen = false;
            $mdSidenav('left').close();
        };

        $scope.checkClosingForm = function(){
            if(true){
                $scope.toggleLeftNav();
            }
        };

        //highlight the current selecting card
        $scope.markSelectingCard = function markSelectingCard () {
            this.scrollToIndex(this.vars.iCardSelected);
            this.highlightCard(this.vars.iCardSelected);
            
        }

        $scope.initScrollEvent = function(){
            var ele = angular.element(".md-virtual-repeat-scroller");
            ele.bind("scroll", 
                function() {
                    var id = "#" + $scope.vars.iCardSelected;
                    var div = angular.element("div");
                    $scope.vars.prevCardEle = angular.element(id);
                    if($scope.vars.prevCardEle.length){
                        $scope.vars.prevCardEle.addClass('sel');
                    }else{
                        div.removeClass('sel');
                    }
                });
        }

        //highlight the card with input index
        $scope.highlightCard = function highlightCard(index) {
            // if has previous card
            if ($scope.vars.prevCardEle)
                $scope.vars.prevCardEle.toggleClass('sel');

            //change to new card
            $scope.vars.prevCardEle = angular.element("#" + index);
            $scope.vars.prevCardEle.toggleClass('sel');

            $scope.vars.iCardSelected = index;
            // init scroll for list
            // this.initScrollEvent();

        }

        //the selected index to change selected card class
        $scope.toggleStarred = function(starred, docId, index) {
            var self = this.moduleService;
            self.docId = docId;
            
            var item = this.vars.lsDocDisp[index];
            //toogle star on UI
            var starElement = angular.element("#star-" + index);
            if(item.Star){
                // self.findElementInElement_V3(self.detail, ['Header', 'DocInfo']).Star = "";
                
                starElement.removeClass('fa-star');
                starElement.addClass('fa-star-o');
                //bind null value for star
                item.Star = "";
            }
            else{
                // self.findElementInElement_V3(self.detail, ['Header', 'DocInfo']).Star = "Starred";
                starElement.removeClass('fa-star-o');
                starElement.addClass('fa-star');
                //bind null value for star
                item.Star = "Starred";
            }

           
            var productName = self.getProductLogicName();
            self.toggleStarredDocument(starred, productName);
         
        };



        /**
         * broadcast event need to add new tab for tab-ctrl
         * @param {String} docId        document's docId
         */
        $scope.addNewTab = function addNewTab(docId) {
            //hide right view
            //the right view will be enable after the add new tab is complete (in tab-ctrl.js)
            this.hideRightView();
            this.broadcastEvent(
                commonService.CONSTANTS.EVENT.TAB_ADD_NEW, 
                {docId: docId, moduleService: this.moduleService}
            );
        };

        
        $scope.isModule =  function isModule(state) {
            return $state.includes(state);
        };

        $scope.isState = function isState(state) {
            return $state.is(state);
        };

        /**
         * Go to state with parameters
         * @param  {[String]} stateName the destination state
         * @param  {[Array]} params  array of params, for ex: {agentId: agentId, key: keyId} (can be empty)
         */
        $scope.goToState = function goToState(stateName, params) {
            //go to sub state level 1
            if (stateName === '.sub' || stateName === '.') {
                this.vars.isOnSubStateL1 = true;
                this.vars.back = false; 
            }
            else {
                this.vars.back = true; 
            }

            //go to parent state from sub L1
            if (stateName === '.^') {
                this.vars.isOnSubStateL1 = false;
            }

            $log.info("You went to urL: " + $state.href(stateName, params));
            return $state.go(stateName, params);
        };

       
        //turn on loading screen for left view (list view)
        $scope.hideLeftView = function hideLeftView() {
            this.vars.bLoadingLeftView = true;
        }
        $scope.unhideLeftView = function unhideLefView() {
            this.vars.bLoadingLeftView = false;
        }

        //turn on loading screen for left view (list view)
        $scope.hideRightView = function hideRightView() {
            this.vars.bLoadingRightView = true;
        }
        $scope.unhideRightView = function unhideRightView() {
            this.vars.bLoadingRightView = false;
        }

        //turn on loading screen for left view (list view)
        $scope.hideFullView = function hideRightView() {
            this.vars.bLoadingFullView = true;
        }
        $scope.unhideFullView = function unhideRightView() {
            this.vars.bLoadingFullView = false;
        }


        //list on left view
        $scope.refreshList = function refreshList() {
            this.vars.bIsListChanged = true;
            // this.openFirstDocInNewTab();//always open fisrt doc when
            this.vars.bIsContentChanged = true;
        }

        //document content on right view
        $scope.refreshContent = function refreshContent() {
            this.vars.bIsContentChanged = true;
        }

        //brief information of document content on right view
        $scope.refreshBriefContent = function refreshContent() {
            this.vars.bIsHeaderContentChanged = true;
        }

        $scope.refreshSyncList = function refreshSyncList() {
            this.vars.bIsListSyncChanged = true;
        }

        /**
         * compare the stateName with the current $state
         * @param  {String}  stateName the name of state want to check
         * @return {Boolean}           true if in the same module
         */
        $scope.isOnState = function isOnState(stateName) {
            if ($state.current.name == stateName)
                return true;
            return false;
        };

        $scope.setCurrModuleName = function setCurrModule (moduleName) {
            $scope.currModuleName = moduleName;
        }

        $scope.getCurrModuleName = function getCurrModule () {
            return $scope.currModuleName;
        }
        /**
         * Open module view in our application
         * @param  {[type]} moduleName module name (list in common-core.js)
         * @param  {Object} moreParams additional objects for navigate
         * @return {Object}            Angular promise
         */
        $scope.openModule = function openModule(moduleName, moreParams) {
            var self = this;
            // $scope.vars.carouSelIndex = 0;
            //if on the same module, doesn't need to navigate
            if(moduleName === self.getCurrModuleName())
                 return;

            //if go to other module from sync screen
            if(self.getCurrModuleName() === self.CONSTANTS.MODULE_NAME.SYNC){
                self.hideLeftView();
                self.setCurrModuleName(moduleName);
                tabService.refreshAllTabContent().then(
                    function refreshAllTab () {
                        self.unhideLeftView();
                        return self.goToState('home.side_bar.left_right.list', {
                            moduleName: moduleName,
                            productName: moreParams,
                        });
                    }
                );
            }
            else{

                self.setCurrModuleName(moduleName);

                if (moduleName === self.CONSTANTS.MODULE_NAME.SYNC) {
                    return self.goToState('home.side_bar.full_screen.detail', {
                        moduleName: moduleName
                    });
                };


                return self.goToState('home.side_bar.left_right.list', {
                    moduleName: moduleName,
                    productName: moreParams,
                });
            }
        }

        //change right view (detail view)  when in left-right panel        
        $scope.openContentView = function openContentView(doctype, docId, productName) {
            
            //set current UIservice for new view
            // $scope.currUiService = $injector.get(doctype + "UIService");
            this.vars.isOnSubStateL1 = false;
            $scope.tagCharError = "";
            
            //for case, its view is general, so we don't need to pass the productName
            if(doctype === this.CONSTANTS.MODULE_NAME.CASE)
                productName = undefined;

            return $scope.goToState('home.side_bar.left_right.list.detail', {
                doctype: doctype,
                docId: docId,
                productName: productName,
            });

        }

        $scope.openPreContentView = function openPreContentView(preModuleService) {
            
            //set current UIservice for new view
            // $scope.currUiService = $injector.get(doctype + "UIService");
            this.vars.isOnSubStateL1 = false;
            $scope.tagCharError = "";
            if($scope.vars.currModuleService.docId)
                $scope.vars.currModuleService.loadDetail($scope.vars.currModuleService.docId);
            
            return $scope.goToState('home.side_bar.left_right.list.detail', {
                doctype: preModuleService.name,
                docId: preModuleService.docId,
                productName: preModuleService.getProductLogicName(),
            });

        }

        /**
         * [openDocument description]
         * @param  {string} doctype     doctype of the document will be opened (in common-core.js)
         * @param  {string} docId       docId need to open
         * @param  {int} index          index of this doc in list meta doc
         * @param  {string} productName (in common-core.js) like 'motor-private-car'
         * @param  {boolean} bOpenFirstDocInNewTab check if this is openning first doc
         * @return  {Object} Anuglar promise Which return document detail if success
         */
        $scope.openDocument = function openDocument(doctype, docId, cardIndex, productName, bOpenFirstDocInNewTab) { 
            // $scope.vars.prevCardEle = index          
            var self = this;            
            var deferred = self.moduleService.$q.defer();

            //change the subpages will be display
            // this.changeSubPages(doctype, productName);

            // $scope.selectListOption(productName);
            if(doctype == commonService.CONSTANTS.MODULE_NAME.ILLUSTRATION) {
                switch(productName){
                    case "motor-private-car":
                        self.moduleService = quotationUIService;
                        // doctype = "quotation";
                        break;

                    case "term-life-protect":
                        self.moduleService = illustrationUIService;
                        // doctype = "illustration";
                        break;
                }
            }
            else if(doctype == commonService.CONSTANTS.MODULE_NAME.APPLICATION) {
                switch(productName){
                    case "motor-private-car":
                    self.moduleService = applicationUIService;
                    break;
                }
            }   

            //if this docId is existing, change to this tab
            // remove tab
            // var tabIndex = tabService.isTabExist(docId);
            // if( tabIndex >= 0){
            //     self.broadcastEvent($scope.CONSTANTS.EVENT.TAB_CHANGED, tabIndex);
            //     return;
            // }

           

            // //cheat: BI bug so won't compare its original version
            // if (doctype !== commonService.CONSTANTS.MODULE_NAME.ILLUSTRATION && self.moduleService.isEdited()) {
            //     var headerText = "Confirm";
            //     var contentText = "Your edited data will be lost. Are you sure?";
            //     $mdDialog.show({
            //         controller: 'ConfirmCtrl',
            //         templateUrl: 'templates/confirm_dialog.html',
            //         locals: {
            //             header: headerText,
            //             content: contentText
            //         }
            //         // targetEvent: ev,
            //     }).then(function() { //OK
            //         self.loadDetail(doctype, docId, index);
            //     }, function(reason) { //Cancel
            //         //nothing happen;
            //     });
            // } else {
            if(self.moduleService.isEdited() && !bOpenFirstDocInNewTab){
                $scope.discardChangeConfirm().then(function(result) { //OK
                    // result = true if choose ok
                    if(result){
                        self.loadDetail(docId, cardIndex, productName).then(function afterHasDetail () {
                            // broadcast event for update tab content (tab title)
                            self.broadcastEvent(self.CONSTANTS.EVENT.OPENED_DOCUMENT, self.moduleService);
                        });
                    }
                });
            }
            else{
                self.loadDetail(docId, cardIndex, productName).then(function afterHasDetail (data) {
                    // self.refreshOverview();
                    // self.moduleService.getAttachFile("8103c8d5-50ba-49d5-a43b-95787da4edf3");
                    // var attachFile = data;
                    // broadcast event for update tab content (tab title)
                    self.broadcastEvent(self.CONSTANTS.EVENT.OPENED_DOCUMENT, self.moduleService);
                    deferred.resolve(data);
                });

            
            }
            return deferred.promise;
            // }
        }

        // load document detail: not computed
        $scope.loadDetail = function loadDetail(docId, index, productName) {
            var self = this;
            // $scope.vars.iCardSelected = index;
            
            // self.currUiService = self.moduleService;
            self.moduleService.docId = docId;

            //start the waiting screen
            self.hideRightView();            
            var deferred = self.$q.defer();


            //load document before render view, so bind once will have new value
            self.moduleService.loadDetail(docId).then(function finishLoadDetail(data) {
                var productName = self.moduleService.getProductLogicName();
                self.openContentView(self.moduleService.name, docId, productName).then(function afterRenderView() {
                    self.scrollToIndex(index);
                    self.highlightCard(index);
                    //stop the waiting screen
                    self.unhideRightView();
                })


                deferred.resolve(data);
            });

            return deferred.promise;
        };

        // load document detail: not computed
        $scope.loadDetailPropsect = function loadDetail(docId) {
            var self = this;

            self.moduleService.docId = docId;
            //start the waiting screen
            self.hideRightView();            
            var deferred = self.$q.defer();

            //load document before render view, so bind once will have new value
            prospectUIService.loadDetail(docId).then(function finishLoadDetail(data) {
                var productName = prospectUIService.getProductLogicName();
                self.openContentView(prospectUIService.name, docId, productName).then(function afterRenderView() {

              
                    //stop the waiting screen
                    self.unhideRightView();
                })


                deferred.resolve(data);
            });

            return deferred.promise;
        };


        /**
         * Refresh meta document list
         * @param  {boolean} bOpenFirstDocInNewTab if true, will try to open first document in the displaying doc lists
         */
        $scope.loadMetaList = function loadMetaList(bOpenFirstDocInNewTab) {
            var self = this;


            self.vars.showEmptyListMessage = false;

            //start the waiting screen
            self.hideLeftView();

            //due to iOS underlying system bug, get lazy choice list after loading doclist   
            //get lazy list base on module name       
            switch (self.moduleService.name) {
                case commonService.CONSTANTS.MODULE_NAME.PROSPECT:
                    prospectUIService.getLazyChoice();
                    break;
                case commonService.CONSTANTS.MODULE_NAME.ILLUSTRATION:
                    quotationUIService.getLazyChoice("motor-private-car");
                    illustrationUIService.getLazyChoice("term-life-protect");
                    prospectUIService.getLazyChoice();
                    break;
                case commonService.CONSTANTS.MODULE_NAME.APPLICATION:
                    applicationUIService.getLazyChoice("motor-private-car");
                    break;
            }
            
            //load doclist
            self.moduleService.loadMetaList().then(function afterLoadMetas() {
                self.vars.lsDocDisp = self.moduleService.sortList(self.moduleService.docListFull, 'UpdatedDate');
                // self.vars.vars.lsDocDisp = self.vars.lsDocDisp;
                $scope.readDeviceOrientation();
                if(!self.vars.lsDocDisp)
                    self.vars.showEmptyListMessage = true;

                //if there is no tab, need to add new one
                // if (bOpenFirstDocInNewTab || tabService.getTabsLength() == 0){ 
                //     self.openFirstDocInNewTab();
                // }
                if (bOpenFirstDocInNewTab){ 
                    self.openFirstDocInNewTab(self.moduleService.name);
                }

                //refresh list on UI
                self.refreshList();
                self.refreshSyncList();

                // self.hideDummyCard();

                //stop the waiting screen
                self.unhideLeftView();
            });
        };

        //broadcast event for children
        //Use this way to prevent $emit from child to parent and all the scopes
        $scope.broadcastEvent = function broadcastEvent(eventName, args) {
            //if no eventName or args, maybe it's force log-out event
            if(eventName == 'SessionTimeOut'){
                connectService.executeAction('NETWORK_INDICATOR', ["0"]).then(function hadTicketInfo (data) {
                    //close the current dialog
                    $mdDialog.hide();

                    tabService.resetTabService();
                    
                    //force log out
                    $scope.goToState('login');
                });
                
            }
            if(eventName == 'Reachability'){
                var currUIService = tabService.getCurrModule();
                if(args.isOnline)
                    $scope.openMessageBar("You are online", 5000);
                else
                    $scope.openMessageBar("You are offline", 5000);
            }

            return $scope.$broadcast(eventName, args);
        }   

        //open first document display in list in a new tab
        $scope.openFirstDocInNewTab = function openFirstDocInNewTab(moduleName) {

            //if the list have any documents
            if (this.vars.lsDocDisp && this.vars.lsDocDisp[0]){
                var docId = this.vars.lsDocDisp[0].DocId;
                // this.currUiService = this.moduleService;

                //if docId exist
                if(docId){                    
                    // add first doc in doc list to new tab
                    //open first doc
                    this.openDocument(moduleName, docId, 0);
                    //this.addNewTab(docId);

                }
            }
            //if the current module doesn't have any document, need to refresh the current page
            else{
                var self = this;
                //get the tab's current moduleService
                currUIService = tabService.getCurrModule();

                //if it's undefined, mean the companion app doesn't have any documents yet
                if(currUIService){
                    self.openContentView(
                        currUIService.name, 
                        currUIService.docId, 
                        currUIService.getProductLogicName());
                }
            }
        }     

        //create new doctype, only call this method when click on the createNewButton
        $scope.createNewDoc = function createNewDoc(moreParams) {
            
            var self = this;
            
            // self.changeSubPages(self.moduleService.name, moreParams);

            self.hideRightView();

            self.moduleService.getNewDocument(moreParams).then(function() {
                
                //change to document detail-view
                self.openContentView(self.moduleService.name, self.moduleService.docId, moreParams).then(function afterRenderView() {                    


                    //broadcast for child controller
                    //usually prospect module won't do anything
                    //just illustration for prepare fields
                    self.broadcastEvent(commonService.CONSTANTS.EVENT.CREATED_DOC, self.moduleService);

                    self.unhideRightView();
                    // $("#left-list").scroll(function() { alert("Scrolled"); });
                    
                    //display dummy card                    
                    // self.showDummyCard();
                });
            });
        };

        $scope._createNewDoc = function createNewDoc(moduleService, moreParams) {
            
            var self = this;
            self.hideRightView();
            $scope.preModuleService = this.moduleService;
            $scope.currModuleService = moduleService;
            moduleService.getNewDocument(moreParams).then(function() {
                
                //change to document detail-view
                self.openContentView(moduleService.name, moduleService.docId, moreParams).then(function afterRenderView() {                    


                    //broadcast for child controller
                    //usually prospect module won't do anything
                    //just illustration for prepare fields
                    self.broadcastEvent(commonService.CONSTANTS.EVENT.CREATED_DOC, moduleService);

                    self.unhideRightView();
                });
            });
        };

        //create new prospect in BI
        $scope.createNewProspect = function createNewProspect(partyIndex) {
            // $scope._createNewDoc(prospectUIService);
            var self = this;

            //show confirm for create new prospect
            $mdDialog.show({
                controller: 'NewPropspectConfirmCtrl',
                templateUrl: 'templates/create_new_prosect_confirm.html',
                clickOutsideToClose: false,
     
            }).then(function(clearAllData) { //OK
                // $scope._saveDoc();
                // $scope.createNewProspect(self.vars.preModuleService.listPartyIndex[0]);
                if(clearAllData){
                    self.moduleService.parties[partyIndex]['@refUid'] = "";
                    self.moduleService.clearValueForIllustrationDetail(partyIndex);
                }
                else{
                    var moduleService = prospectUIService;
                    // self.hideRightView();
                    self.vars.preModuleService = self.moduleService;
                    self.vars.currModuleService = moduleService;
                    moduleService.getNewDocument().then(function() {
                        self.vars.preModuleService.partyIndex = partyIndex;
                        // moduleService.partyIndex = partyIndex;

                        //copy all prospect value in Bi to new prospect
                        // illustrationUIService.setValueForProspectDetail(partyIndex);

                        //change to document detail-view
                        self.openContentView(moduleService.name, moduleService.docId).then(function afterRenderView() {                    
                            //broadcast for child controller
                            //usually prospect module won't do anything
                            //just illustration for prepare fields
                            self.broadcastEvent(commonService.CONSTANTS.EVENT.CREATED_DOC, moduleService);

                            // self.unhideRightView();
                        });
                    });
                }
                
            }, function() { //Cancel
                //nothing happen;
                
            });
            
            
        };

         //create new doctype, only call this method when click on the createNewButton
        $scope.createNewDocTermLife = function createNewDoc(moreParams) {
            var self = this;
            self.hideRightView();

            illustrationUIService.getNewDocument(moreParams).then(function() {
                //change to document detail-view
                self.openContentView(illustrationUIService.name, illustrationUIService.docId, moreParams).then(function afterRenderView() {                    
                    //broadcast for child controller
                    //usually prospect module won't do anything
                    //just illustration for prepare fields
                    self.broadcastEvent(commonService.CONSTANTS.EVENT.CREATED_DOC, self.moduleService);
                    self.unhideRightView();
                });
            });
        };

         $scope.createNewDocPropsect = function createNewDoc() {
            var self = this;
            self.hideRightView();

            prospectUIService.getNewDocument().then(function() {
                //change to document detail-view
                self.openContentView(prospectUIService.name, prospectUIService.docId).then(function afterRenderView() {                    
                    //broadcast for child controller
                    //usually prospect module won't do anything
                    //just illustration for prepare fields
                    self.broadcastEvent(commonService.CONSTANTS.EVENT.CREATED_DOC, self.moduleService);
                    self.unhideRightView();
                });
            });
        };

        $scope._deleteResource = function _deleteResource(){
            var self = this;
            var deferred = self.$q.defer();
            if(self.moduleService.removedRefResourceUids && self.moduleService.removedRefResourceUids.length > 0){
                var promiseArr = [];
                angular.forEach(self.moduleService.removedRefResourceUids, function(refResourceUid) {

                    //TODO: need to optimize
                    //Find the relative information
                    for (var i = self.moduleService.originalAttachments.length - 1; i >= 0; i--) {
                        if(self.moduleService.originalAttachments[i]['@refResourceUid'] == refResourceUid){

                            //call endpoint to delete resource binary and document resource
                            var promise = resourceUIService.deleteResource(
                                self.moduleService.docId, 
                                refResourceUid, 
                                self.moduleService.originalAttachments[i].FileUid.$);
                            promiseArr.push(promise);

                            break;
                        }
                    };
                    

                });
                self.moduleService.$q.all(promiseArr).then(function hadDeletedResource(deletedDoc) {
                    self.moduleService.indexOfDeletedResource = [];
                    deferred.resolve(deletedDoc);
                });
            }else{       
                deferred.resolve("");         
            }
            return deferred.promise;
        }

        $scope._updateResource = function _updateResource(){
            var self = this;
            var deferred = self.$q.defer();
            if(self.moduleService.editedResourceDocIds && self.moduleService.editedResourceDocIds.length > 0){
                
                resourceUIService.editResourceDocs(self.moduleService.editedResourceDocIds, self.moduleService.editedResourceMeta).then(
                    function updatedResourceDocs (updatedResourceDocs) {

                        self.moduleService.indexOfEditedResource = [];
                        self.moduleService.editedResourceMeta = [];
                        self.moduleService.editedResourceDocId = [];

                        deferred.resolve(self.editedResourceMeta);
                });
            }else{       
                deferred.resolve("");         
            }
            return deferred.promise;
        }

        $scope._saveResource = function _saveResource () {
            var self = this;
            var deferred = this.$q.defer();
            if(self.moduleService.tempNewResource && self.moduleService.tempNewResource.length > 0){
                resourceUIService.saveResources(self.moduleService.tempNewResource).then(function hadResourceDocs (savedResourceDocs) {
                    for (var i = savedResourceDocs.length - 1; i >= 0; i--) {
                        self.moduleService.appendAttachInforToDoc.call(self.moduleService, self.moduleService.detail, savedResourceDocs[i]);
                    };

                    self.moduleService.tempNewResource = [];
                    deferred.resolve(savedResourceDocs);
                });
            }else{       
                deferred.resolve("");         
            }
            return deferred.promise;
        }

        $scope._showImgPickerEdit = function _showImgPickerEdit(refResourceUid) {
            var self = this;
            resourceUIService.showImagePicker(false).then(function hadImgsInfor (response) {
                if(!response.length)
                    return;
                
                //init if undefined
                if(!self.moduleService.editedResourceDocIds){
                    //store index of resource doc is edited
                    self.moduleService.editedResourceMeta = [];
                    self.moduleService.editedResourceDocIds = [];
                }

                var iInEditedList = self.moduleService.editedResourceDocIds.indexOf(refResourceUid);

                //if have in list, update it
                if(iInEditedList != -1){
                    self.moduleService.editedResourceMeta[iInEditedList] = response[0];
                }else{                    
                    self.moduleService.editedResourceDocIds.push(refResourceUid);
                    self.moduleService.editedResourceMeta.push(response[0]);
                }
                //TODO: need to optimize
                //Find the relative information
                self.moduleService.updateResourceInAttachmentEle(refResourceUid, response[0]);
                
            });
        };

        $scope._showImgPicker = function _showImgPicker() {
            var self = this;
            resourceUIService.showImagePicker(true).then(function hadImgInfor (imgsInfo) {

                if(!imgsInfo.length)
                    return;

                //if moduleService.tempNewResource is undefined, init it
                if(self.moduleService.tempNewResource === undefined)
                    //stores all resources need to save
                    self.moduleService.tempNewResource = [];

                self.moduleService.tempNewResource = self.moduleService.tempNewResource.concat(imgsInfo.map(
                    function(file) {
                        file.name = file.FileName;
                        file.size = file.FileSize;
                        file.createdDate = file.DateTime;
                        return file;
                    })
                );
            });
        };

        $scope._markRemoveFile = function _markRemoveFile(refResourceUid) {
            //init if undefined
            if(!this.moduleService.removedRefResourceUids)
                //store index of resource doc is delete
                this.moduleService.removedRefResourceUids = [];
            
            this.moduleService.removedRefResourceUids.push(refResourceUid);

            //remove from list of updated
            if(this.moduleService.editedResourceDocIds){
                var iInMarkEditList = this.moduleService.editedResourceDocIds.indexOf(refResourceUid);
                if(iInMarkEditList != -1){
                    this.moduleService.editedResourceDocIds.splice(iInMarkEditList, 1);
                    this.moduleService.editedResourceMeta.splice(iInMarkEditList, 1);
                }
            }
            this.moduleService.removeResourceInAttachmentEle(refResourceUid);
        };

        $scope.removeTempFile = function removeTempFile(index){
            this.moduleService.tempNewResource.splice(index, 1);
        }

        $scope.searchDoc = function searchDoc() {
            this.vars.lsDocDisp = $filter('v3Search')(this.moduleService.docListFull, this.vars.strSearch);
            this.refreshList();
            if(this.vars.lsDocDisp.length == 0){
                $scope.vars.errorSearch = 'No result found with "' + this.vars.strSearch + '"';
            }else{
                $scope.vars.errorSearch = "";
            }
        };

        $scope.searchSyncDoc = function searchSyncDoc() {
            this.vars.lsDocDisp = $filter('filter')(this.moduleService.docListFull, this.vars.strSyncSearch);
            this.refreshSyncList();
            if(this.vars.lsDocDisp.length == 0){
                $scope.vars.errorSearch = 'No result found with "' + this.vars.strSyncSearch + '"';
            }else{
                $scope.vars.errorSearch = "";
            }
        };

        $scope.sortAZ = function(a, b) {
            if (a['metaDataServer'][sortBy] > b['metaDataServer'][sortBy]) {
                return 1;
            }
            if (a['metaDataServer'][sortBy] < b['metaDataServer'][sortBy]) {
                return -1;
            }
            // a must be equal to b
            return 0;
        }

        // sort server data
        // return 1 when a > b and -1 when a < b
        // sort by FullName : ascending
        // sort by CreatedDate/UpdatedDate : descending 
        $scope.sortServerSyncList = function sortServerSyncList(sortBy) {
            this.vars.lsDocDisp.sort(function(a, b) {
                if(sortBy == 'FullName'){

                    if(a.serverSyncType == "none" && b.serverSyncType != "none")
                        return 1;
                    if(a.serverSyncType != "none" && b.serverSyncType == "none")
                        return -1;
                    if(a['metaDataServer'] && b['metaDataServer']){
                        // if(a.metaDataServer['DocType'] == 'pdpa'){
                            
                        // }
                        if (a['metaDataServer'][sortBy].toLowerCase() > b['metaDataServer'][sortBy].toLowerCase()) {
                            return 1;
                        }
                        
                        if (a['metaDataServer'][sortBy].toLowerCase() < b['metaDataServer'][sortBy].toLowerCase()) {
                            return -1;
                        }
                    }
                    else{
                        return -1;
                    }
                    
                    // a must be equal to b
                    return 0;
                }else{
                    if(a.serverSyncType == "none" && b.serverSyncType != "none")
                        return 1;
                    if(a.serverSyncType != "none" && b.serverSyncType == "none")
                        return -1;
                    if (a['metaDataServer'][sortBy] < b['metaDataServer'][sortBy]) {
                        return 1;
                    }
                    if (a['metaDataServer'][sortBy] > b['metaDataServer'][sortBy]) {
                        return -1;
                    }
                    if(a.serverSyncType == "none")
                        return -2;
                    // a must be equal to b
                    return 0;
                }
                
            });
            this.refreshSyncList();
        }

        // sort local data
        // return 1 when a > b and -1 when a < b
        // sort by FullName : ascending
        // sort by CreatedDate/UpdatedDate : descending 
        $scope.sortLocalSyncList = function sortLocalSyncList(sortBy) {
            this.vars.lsDocDisp.sort(function(a, b) {
                if(sortBy == 'FullName'){
                    if(a.localSyncType == "none" && b.localSyncType != "none")
                        return 1;
                    if(a.localSyncType != "none" && b.localSyncType == "none")
                        return -1;
                    if(a['metaDataLocal'] && b['metaDataLocal']){
                        if (a['metaDataLocal'][sortBy].toLowerCase() > b['metaDataLocal'][sortBy].toLowerCase()) {
                            return 1;
                        }
                        if (a['metaDataLocal'][sortBy].toLowerCase() < b['metaDataLocal'][sortBy].toLowerCase()) {
                            return -1;
                        }
                    }else{
                        return -1;
                    }
                    
                    // a must be equal to b
                    return 0;
                }else{
                    if(a.localSyncType == "none" && b.localSyncType != "none")
                        return 1;
                    if(a.localSyncType != "none" && b.localSyncType == "none")
                        return -1;
                    if (a['metaDataLocal'][sortBy] < b['metaDataLocal'][sortBy]) {
                        return 1;
                    }
                    if (a['metaDataLocal'][sortBy] > b['metaDataLocal'][sortBy]) {
                        return -1;
                    }
                    // a must be equal to b
                    return 0;
                }
                
            });
            this.refreshSyncList();
        }

        jQuery.fn.scrollTo = function(elem, speed) { 

            if($(elem).offset()){
                $(this).animate({
                    scrollTop:  $(this).scrollTop() - $(this).offset().top + $(elem).offset().top 
                }, speed == undefined ? 1000 : speed);
            }
            return this; 
        };

        $scope.scrollToIndex = function scrollToIndex(index){

            // var currIndex = $scope.vars.iCardSelected;
            // if(currIndex > index){
            //     var id = "";
            //     while(currIndex > index){
            //         currIndex -= 9;
            //         id = "#" + currIndex;
            //         setTimeout(function(){
            //             $(".md-virtual-repeat-scroller").scrollTo(id, 100);
            //         }, 3000);
                    
            //     }
            // }
            var id = "#" + index;
            $("#left-list").scrollTo(id, 1000);
        }

        $scope.scrollToSelectListIndex = function scrollToSelectListIndex(index){
            var id = "#select-" + index;
            $("#select-list").scrollTo(id, 1000);
        }

       $scope.validateTag = function(chip){
            $scope.tagCharError = "";
            if(chip.length > 50){
                $scope.tagCharError = "Tag cannot over 50 characters.";
            }
            if(this.moduleService.tagList.length > 20){
                $scope.tagCharError += "Cannot add more than 20 tags";
            }

            if(!$scope.tagCharError)
                return chip;

            return undefined;
        } 

        

        //  //clear search text
        $scope.clearText = function(){
        
            document.getElementById('searchTextField').focus();
            this.vars.strSearch = "";
            $scope.vars.errorSearch = "";
            this.vars.lsDocDisp = this.moduleService.sortList(this.moduleService.docListFull, 'UpdatedDate');
            this.refreshList();
            // $scope.openFirstDocInNewTab();
        };

        //  //clear search text
        $scope.clearSyncSearch = function(){
            document.getElementById('searchTextField').focus();
            this.vars.strSyncSearch = "";
            $scope.vars.errorSearch = "";
            this.vars.lsDocDisp = this.moduleService.sortList(this.moduleService.docListFull, 'UpdatedDate');
            this.refreshList();
        };

        $scope.toggleSearch = function toggleSearch() {
            this.vars.showSearchbar = !this.vars.showSearchbar;

            //if not in search mode anymore, restore old list
            if (!this.vars.showSearchbar) {
                $scope.vars.errorSearch = ""; //reset error search list
                this.vars.lsDocDisp = this.moduleService.sortList(this.moduleService.docListFull, 'UpdatedDate');

                this.vars.strSearch = ""; //delete old search value
                this.refreshList();
                this.openFirstDocInNewTab();
            }
        }

        $scope.showAboutUs = function showAboutUs() {
            var headerText = "About Us";
            var contentText = "";

            $mdDialog.show({
                controller: 'ConfirmCtrl',
                templateUrl: 'templates/about_us_new.html',
                clickOutsideToClose: false,
                locals: {
                    header: headerText,
                    content: contentText
                }
            })
        };

        $scope.showAttachment = function showAttachment(fileType) {

            if(fileType === 'image'){
                $mdDialog.show({
                    controller: 'AttachmentDetailCtrl',
                    templateUrl: 'templates/attachment_avatar_template.html',
                    // targetEvent: ev,
                    clickOutsideToClose: true,
                    escapeToClose: false,
                    fileType: fileType,
                    moduleService: this.moduleService
                });
            }else{                
                $mdDialog.show({
                    controller: 'AttachmentDetailCtrl',
                    templateUrl: 'templates/attachment_template.html',
                    // targetEvent: ev,
                    clickOutsideToClose: true,
                    // scope: $scope,
                    escapeToClose: false,
                    fileType: fileType,
                    moduleService: this.moduleService
                });
            }
            // $scope.popover.hide();
           
        };

        $scope.showUserProfile = function showUserProfile(ev) {
            $mdDialog.show({
                controller: 'UserInfoCtrl',
                templateUrl: 'templates/user_profile.html',
                targetEvent: ev,
                clickOutsideToClose: false,
            });

        };

        $scope.discardChangeConfirm = function discardChangeConfirm(docId, cardIndex, productName, self) {
            var headerText = "Confirm";
            var contentText = "Your edited data will be lost. Are you sure?";
            var deferred = this.$q.defer();
            $mdDialog.show({
                controller: 'ConfirmCtrl',
                templateUrl: 'templates/confirm_dialog.html',
                clickOutsideToClose: true,
                locals: {
                    header: headerText,
                    content: contentText
                }
            })
            .then(function(result) { //OK
                result = true;
                deferred.resolve(result);
            }, function(result) { //Cancel
                //nothing happen;
                
            });
            return deferred.promise;
        }

        $scope.resetDataConfirm = function resetDataConfirm() {
            var headerText = "Confirm";
            var contentText = "Your edited data will be reseted. Are you sure?";
            var deferred = this.$q.defer();
            $mdDialog.show({
                controller: 'ConfirmCtrl',
                templateUrl: 'templates/confirm_dialog.html',
                clickOutsideToClose: true,
                locals: {
                    header: headerText,
                    content: contentText
                }
            })
            .then(function(result) { //OK
                result = true;
                deferred.resolve(result);
            }, function(result) { //Cancel
                //nothing happen;
                
            });
            return deferred.promise;
        }

        $scope.confirmLogOut = function confirmLogOut() {
            var self = this;
            var headerText = "Confirm";
            var contentText = "Do you want to log out?";
            $mdDialog.show({
                controller: 'ConfirmCtrl',
                templateUrl: 'templates/confirm_dialog.html',
                clickOutsideToClose: true,
                locals: {
                    header: headerText,
                    content: contentText
                }
            }).then(function() { //OK
                connectService.executeAction('NETWORK_INDICATOR', ["0"]).then(function hadTicketInfo (data) {
                    self.goToState('login');
                    tabService.resetTabService();
                });
                
            }, function(reason) { //Cancel
                //nothing happen;
            });
        }

        //setting
        $scope.showSetting = function showSetting() {

            $mdDialog.show({
                controller: 'SettingCtrl',
                templateUrl: 'templates/setting.html',
                clickOutsideToClose: false,
            });
        };

        /**
         * Open notification bar in the middle-bottom of screen
         * @param  {String} message to display
         * @param  {Integer} timeout the timeout
         */
        $scope.openMessageBar = function openMessageBar(message, timeout) {
            workspaceService.notifyMessage = message;

            if (!timeout)
                timeout = 1500; //set default timeout

            $mdToast.show({
                controller: 'ToastCtrl',
                templateUrl: 'templates/message_bar.html',
                hideDelay: timeout,
                position: 'bottom left right',
                parent: '[notification-area]'
            });
        };


        //receive broadcast event (after new document has been created)
        $scope.$on($scope.CONSTANTS.EVENT.CREATED_DOC, function(event, args) {    
            $scope.broadcastEvent($scope.CONSTANTS.EVENT.TAB_NEED_UPDATE, args);
            event.currentScope.refreshContent();
        });

        //receive broadcast event (after new document has been opened)
        $scope.$on($scope.CONSTANTS.EVENT.OPENED_DOCUMENT, function(event, args) {    
            $scope.broadcastEvent($scope.CONSTANTS.EVENT.TAB_NEED_UPDATE, args);
        });

        //receive broadcast event (after document has been saved)
        $scope.$on($scope.CONSTANTS.EVENT.SAVED_DOCUMENT, function(event, args) { 
            event.currentScope.refreshBriefContent();
            $scope.broadcastEvent($scope.CONSTANTS.EVENT.TAB_NEED_UPDATE, args);
            if($scope.vars.isOnSubStateL1)
                event.currentScope.goToState('.^');
        });

        //receive broadcast event (after document has been updated)
        $scope.$on($scope.CONSTANTS.EVENT.UPDATED_DOCUMENT, function(event, args) {  
            event.currentScope.refreshBriefContent();  
            $scope.broadcastEvent($scope.CONSTANTS.EVENT.TAB_NEED_UPDATE, args);
            if($scope.vars.isOnSubStateL1)
                event.currentScope.goToState('.^');
        });

        //receive broadcast event (after list document has been refresh)
        $scope.$on('finish_render', function(event, args) {    
            $log.info('finish re-render doc list');
        });

        //receive broadcast event (after list document is change)
        $scope.$on('syncProgress', function(event, args) {    
            $log.info(event);
            $log.info(args);
            var string = "Receive event: " + event.name + " with params [" + args + "]";
            alert(string);
        });

        //toggle error message, when iput is focus and leave
        $scope.openErrorMsg = function (id) {
           var errorElement = document.getElementById(id);
            if(errorElement){
                errorElement.style.display = 'block';
        }
        }
        $scope.closeErrorMsg = function (id) {
            var errorElement = document.getElementById(id);
            if(errorElement){
                errorElement.style.display = 'none';
        }
        }
        $scope.toggleErrorMsg = function (id) {
           var element = document.getElementById(id);
           if(element.style.display == 'none'){
                element.style.display = 'block';
           }
           else{
            element.style.display = 'none';
           }
        }
        $scope.validateEmail = function validateEmail(contactType, email) 
        {
            if(contactType == "EMAIL_ADDRESS"){
            var emailRegex = /\S+@\S+\.\S+/;
            if(emailRegex.test(email) == false){
                this.vars.contactError = "Invalid contact information";
            }
            else{
                this.vars.contactError = undefined;
            }}
        }

        

    });

angular.module('iposApp').controller('ConfirmCtrl',
    function($scope, $mdDialog, header, content) {
        $scope.headerText = header;
        $scope.contentText = content;
        $scope.okDialog = function() {
            $mdDialog.hide();
        };

        $scope.cancelDialog = function() {
            $mdDialog.cancel();
        };
    });

angular.module('iposApp').controller('NewPropspectConfirmCtrl',
    function($scope, $mdDialog, prospectUIService, illustrationUIService) {
        // $scope.listProspect = listProspect;
        $scope.saveDialog = function(clearAllData) {
            $mdDialog.hide(clearAllData);
        };

        $scope.cancelDialog = function() {
            $mdDialog.cancel();
        };

        //create new prospect
        // $scope.createNewProspect = function(partyIndex) {
        //     // $scope._createNewDoc(prospectUIService);
        //     var self = this;
            
        //     var moduleService = prospectUIService;
        //     // self.hideRightView();
        //     this.vars.preModuleService = this.moduleService;
        //     this.vars.currModuleService = moduleService;
        //     moduleService.getNewDocument().then(function() {
        //         moduleService.partyIndex = partyIndex;
        //         illustrationUIService.setValueForProspectDetail(partyIndex);
        //         //change to document detail-view
        //         self.openContentView(moduleService.name, moduleService.docId).then(function afterRenderView() {                    
        //             //broadcast for child controller
        //             //usually prospect module won't do anything
        //             //just illustration for prepare fields
        //             self.broadcastEvent(commonService.CONSTANTS.EVENT.CREATED_DOC, moduleService);

        //             // self.unhideRightView();
        //         });
        //     });
        // };
    });

angular.module('iposApp').controller('AboutUsCtrl',
    function($scope, $mdDialog) {

        $scope.closeDialog = function() {
            $mdDialog.cancel();
        };

    });


angular.module('iposApp').controller('UserInfoCtrl',
    function($scope, $mdDialog) {

        $scope.cancelDialog = function() {
            $mdDialog.cancel();
        };

        $scope.slides = ['A', 'B'];
        //get slides --> this is an array use for creating indicator of carousel

        /*$scope.slides11 = document.getElementsByTagName('li');    
        // $scope.slides = document.querySelector('ul#carousel li');
        console.log($scope.slides11);*/
    });

angular.module('iposApp').controller('SettingCtrl',
    function($scope, $mdDialog, connectService) {

        $scope.closeDialog = function() {
            $mdDialog.cancel();
        };

        $scope.colors = [
            {
                name: 'red',
                primaryColor: "#d50000",
                accentColor: "#046FB2"
            }, {
                name: 'pink',
                primaryColor: "#c51162",
                accentColor: "#0498B2"
            }, {
                name: 'purple',
                primaryColor: "#aa00ff",
                accentColor: "#04B25C"
            }, {
                name: 'deep-purple',
                primaryColor: "#6200ea",
                accentColor: "#4CB265"
            }, {
                name: 'indigo',
                primaryColor: "#304ffe",
                accentColor: "#4FB204"
            }, {
                name: 'blue',
                primaryColor: "#2962ff",
                accentColor: "#6AB204"
            }, {
                name: 'light-blue',
                primaryColor: "#0091ea",
                accentColor: "#B2B004"
            }, {
                name: 'cyan',
                primaryColor: "#00b8d4",
                accentColor: "#B29F04"
            }, {
                name: 'teal',
                primaryColor: "#00bfa5",
                accentColor: "#FF19F9"
            }, {
                name: 'green',
                primaryColor: "#00c853",
                accentColor: "#9F19FF"
            }, {
                name: 'light-green',
                primaryColor: "#64dd17",
                accentColor: "#1935FF"
            }, {
                name: 'lime',
                primaryColor: "#aeea00",
                accentColor: "#1972FF"
            }, {
                name: 'yellow',
                primaryColor: "#ffd600",
                accentColor: "#19FFFF"
            }, {
                name: 'amber',
                primaryColor: "#ffab00",
                accentColor: "#19FF93"
            }, {
                name: 'orange',
                primaryColor: "#ff6d00",
                accentColor: "#1FFF19"
            }, {
                name: 'deep-orange',
                primaryColor: "#dd2c00",
                accentColor: "#9CFF19"
            }, {
                name: 'brown',
                primaryColor: "#5d4037",
                accentColor: "#1437CC"
            }, {
                name: 'grey',
                primaryColor: "#616161",
                accentColor: "#4C8BB2"
            }, {
                name: 'blue-grey',
                primaryColor: "#455a64",
                accentColor: "#B2AF4C"
            }

        ];

        $scope.defaultValue = localStorage.getItem("color");
        //change theme
        $scope.changeTheme = function changeTheme(themeName) {
            localStorage.setItem("color", themeName);
            //change css according to current theme
            location.reload();
        };

        $scope.showTicketInfo = function showTicketInfo () {
            connectService.executeAction('SYSTEM_GET_TICKET_INFO').then(function hadTicketInfo (data) {
                // alert(data.userTicketProfile);
                $scope.ticketInfo = angular.copy(data.userTicketProfile);
                var startedDate = $scope.ticketInfo['startedDate'];
                var expireDuration = $scope.ticketInfo['ticketExpireDuration']*1000;
                var offlineDuration = $scope.ticketInfo['offlineDuration'];
                var validTime = $scope.ticketInfo['remainingValidTime']*1000;
                var expireDate = startedDate + expireDuration;
                $scope.ticketInfo['startedDate'] = moment(startedDate).format('MMM, DD YYYY hh : mm : ss');
                $scope.ticketInfo['expireDate'] = moment(expireDate).format('MMM, DD YYYY hh : mm : ss');
                $scope.ticketInfo['ticketExpireDuration'] = moment.duration(expireDuration).days() + " day(s) " + moment.duration(expireDuration).hours() + "h " + moment.duration(expireDuration).minutes() + "m " + moment.duration(expireDuration).seconds() + "s";
                // $scope.ticketInfo['offlineDuration'] = moment().seconds(offlineDuration).format('hh : mm : ss');
                $scope.ticketInfo['remainingValidTime'] = moment.duration(validTime).days() + " day(s) " + moment.duration(validTime).hours() + "h " + moment.duration(validTime).minutes() + "m " + moment.duration(validTime).seconds() + "s";
                
            });
        }

    });

angular.module('iposApp').controller('ToastCtrl',
    function($scope, $mdToast, workspaceService) {
        $scope.message = workspaceService.notifyMessage;
        $scope.closeToast = function() {
            $mdToast.hide();
        };
    }
);