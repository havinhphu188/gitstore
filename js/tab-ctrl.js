angular.module('iposApp').controller('TabCtrl',
    function($scope, $log, $timeout, tabService) {

        $scope.init = function initTabCtrl() {

            this.moduleService = tabService;

            //don't use tabService.currIndex directly
            //We keep the ui-service clean and don't be affected by outside directly
            this.currIndex = tabService.getCurrIndex();
        };

        $scope.fixWrapperNotNormal = function fixedWrapper () {
            if(!this.wrapperTabEle)
                this.wrapperTabEle = angular.element("md-pagination-wrapper");

            //if has 'md-center-tabs' class: in normal mode, not pagination
            if(this.wrapperTabEle.hasClass('md-center-tabs')){
                this.wrapperTabEle.css('-webkit-transform', "");
            }
        }

        $scope.removeTab = function(index) {
            var self = this;

            //if current tab is editing
            if(tabService.getCurrIndex() == index && tabService.getCurrModule().isEdited()){
                self.discardChangeConfirm().then(function(result) { //OK
                    // result = true if choose ok
                    if(result){
                        tabService.removeTab(index).then(
                            function removedTab (currentUIService) {                                
                                self.fixWrapperNotNormal();
                            }
                        );  
                    }
                });
            }
            else{
                tabService.removeTab(index).then(
                    function removedTab (currentUIService) {                        
                        self.fixWrapperNotNormal(); 
                    }
                );   

            }
            
        };

        /**
         * Add new tab, and change to this tab content view
         * If this is existing tab, will change to display this tab
         * @param {String} docId        document's docId
         */
        $scope.addTab = function addTab(docId, moduleService) {
            // var self = this;
            // this.hideRightView();

            //if this docId is existing, change to this tab
            //it maybe fast, so don't need to refresh screen
            var tabIndex = tabService.isTabExist(docId);

            //if this's new tab, add it to tab list
            if(tabIndex < 0){
                tabService.addNewTab(moduleService, docId);
                tabIndex = tabService.getTabsLength();
            }

            this.updateCurrTabIndex(tabIndex);
        };


        /**
         * Set current index of tab.html to new position
         * @param  {[type]} newFocusIndex [description]
         * @return {[type]}               [description]
         */
        $scope.updateCurrTabIndex = function updateCurrTabIndex(newFocusIndex) {
            if(newFocusIndex == $scope.currIndex){
                // call the function to change tab on UI directly, 
                // because when the index isn't changed, material won't call the tab event md-on-select
                $scope.changeToTab(newFocusIndex);
            }
            else{
                $scope.currIndex = newFocusIndex;
            }
        };

        /**
         * NOTE: This function only called when the currIndex (in tab-ctrl) was changed
         * Or when tab.html is re-render
         * Change the current document content
         * @param  {Integer} tabIndex   index of new tab
         */
        $scope.changeToTab = function changeToTab(tabIndex) {
            var self = this;
            tabService.loadTab(tabIndex).then(
                function restoredTab (moduleService) {

                    //in case has something error happen
                    //or in the first login, loadTab will return empty while initing
                    if(moduleService){
                        //re-render this content view
                        self.openContentView(
                            moduleService.name, 
                            moduleService.docId, 
                            moduleService.getProductLogicName()).then(function afterOpenContentView() {   
                                if(self.vars.lsDocDisp){                                
                                    //highlight the selecting card
                                    for (var i = self.vars.lsDocDisp.length - 1; i >= 0; i--) {
                                        if(self.vars.lsDocDisp[i].DocId == moduleService.docId){                                        
                                            self.highlightCard(i);

                                            // //TODO: temporary unhide the left view, scroll to view sometime got error
                                            self.unhideRightView();
                                            self.scrollToIndex(i);
                                            break;
                                        }
                                    };
                                }
                            }
                        );
                    }

                    self.unhideRightView();
                }
            );            
        };

        /**
         * receive event when add new tab
         * @param  {[type]} event 
         * @param  {[type]} args    {docId for new tab, moduleService for new tab}
         */
        $scope.$on($scope.CONSTANTS.EVENT.TAB_ADD_NEW, function(event, args) {
            event.currentScope.addTab(args.docId, args.moduleService);
        });


        /**
         * receive event when need to update current tab
         * @param  {[type]} event 
         * @param  {[type]} args    moduleService has been updated
         */
        $scope.$on($scope.CONSTANTS.EVENT.TAB_NEED_UPDATE, function(event, moduleService) {            
            //update tab name
            tabService.updateCurrTab(moduleService);

            //TODO: force material to reload the tab name
            //it won't refresh if the tab name length is the same with prev name
            event.currentScope.changeToTab(tabService.getCurrIndex());
        });

        /**
         * receive event when change tab
         * @param  {[type]} event 
         * @param  {[type]} newFocusIndex    index of new tab
         */
        $scope.$on($scope.CONSTANTS.EVENT.TAB_CHANGED, function(event, newFocusIndex) {
            event.currentScope.updateCurrTabIndex(newFocusIndex);
        });


        $scope.init();
    }
);
