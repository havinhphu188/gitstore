'use strict';
angular.module('iposApp').controller('IllustrationListCtrl', function(
    //form 3rd plugins
    $scope, $mdDialog,

    //from our project
    prospectUIService, illustrationUIService, quotationUIService) {

    $scope.name = 'IllustrationListCtrl';

    $scope.showSearch = function() {
        $scope.showToolbar = !$scope.showToolbar;
    }
    $scope.moduleService = illustrationUIService;
    $scope.prospectUIService = prospectUIService;


    // $scope.customSort = function(card) {
    //     // $scope.moduleService.findValueInMapListByKey(card, 'EffectiveDate');
    //     return card.EffectiveDate;
    // };

    $scope.sorting = function(card) {
        return $scope.moduleService.orderBy(card, 'UpdatedDate');
    };
    
    $scope.getDetail = function(docId, index, productName) {
        // $scope.selectListOption(productName);

        $scope.openDocument(illustrationUIService.name, docId, index, productName);  
    };

    // toggle star
    $scope.showStar = true;
    $scope.toggleStar = function(starred, docId) {
       $paprent.toggleStarred(starred, docId);
    }

    $scope.showProductList = function(ev) {
      $mdDialog.show({
          controller: 'ProductListCtrl',
          templateUrl: 'templates/product_list.html',
          targetEvent: ev,
          locals: {
              parentScope: $scope
          },
      }).then(function(productName) {
           //change module service to use for each product
            switch(productName) {
                case "term-life-protect":
                    $scope.moduleService = illustrationUIService;
                    break;
                case "motor-private-car":
                    $scope.moduleService = quotationUIService;
                    break;
            }
            // 'term-life-protect'
            $scope.createNewDoc(productName);
      });
  }



    //receive broadcast event (after list document is change)
    $scope.$on($scope.CONSTANTS.EVENT.UPDATED_LIST, function(event, args) {        
        event.currentScope.loadMetaList();
        // reload prospect metadata list after create new one in illustration module
        if($scope.currModuleService)
            $scope.currModuleService.loadMetaList();
    });

    //load BI list when ctrl is called
    $scope.loadMetaList(true);
});



angular.module('iposApp').controller('ProductListCtrl',
    function ($scope, 
         parentScope, $mdDialog) {

        //quotation template
        // $scope.defaulProduct = selected;
        $scope.productList = [{
            productname: 'Motor Insurance Plan',
            action: "motor-private-car"
        }, {
            productname: 'TermLife Protect',
            action: "term-life-protect"
        }];
        // $scope.selected = $scope.productList[0].productname;
        //set selected product
        $scope.productName = "";
        $scope.selectedProduct = function(productName, index) {

            $scope.productName = productName;
            //set prevOptionEle for the first time loaded with selected value
            if ($scope.prevOptionEle)
                $scope.prevOptionEle.innerHTML = '<i></i>';

            //change to new card
            $scope.prevOptionEle = document.getElementById("select-" + index);
            $scope.prevOptionEle.innerHTML = '<i class="fa fa-check default-color"></i>';

        }
        $scope.cancelDialog = function() {
            $mdDialog.cancel();
        };
        // $scope.createNewBi = function createNew() {
        //     // //change module service to use for each product
        //     // switch($scope.productName) {
        //     //     case "term-life-protect":
        //     //         parentScope.moduleService = illustrationUIService;
        //     //         break;
        //     //     case "motor-private-car":
        //     //         parentScope.moduleService = quotationUIService;
        //     //         break;
        //     // }
                
        //     // // 'term-life-protect'
        //     // parentScope.createNewDoc($scope.productName);
        //     $mdDialog.cancel($scope.productName);
        // }

        $scope.okDialog = function() {

            $mdDialog.hide($scope.productName);
            // $scope.createNewBi();
        };
    });


angular.module('iposApp').controller('pdfTemplateCtrl',
    function ($scope, 
         parentScope, $mdDialog) {

        //quotation template
        // $scope.defaulProduct = selected;
        $scope.productList = [{
            productname: 'Motor Insurance Plan',
            action: "motor-private-car"
        }, {
            productname: 'TermLife Protect',
            action: "term-life-protect"
        }];
        // $scope.selected = $scope.productList[0].productname;
        //set selected product
        $scope.productName = "";
        $scope.selectedProduct = function(productName, index) {

            $scope.productName = productName;
            //set prevOptionEle for the first time loaded with selected value
            if ($scope.prevOptionEle)
                $scope.prevOptionEle.innerHTML = '<i></i>';

            //change to new card
            $scope.prevOptionEle = document.getElementById("select-" + index);
            $scope.prevOptionEle.innerHTML = '<i class="fa fa-check default-color"></i>';

        }
        $scope.cancelDialog = function() {
            $mdDialog.cancel();
        };
        // $scope.createNewBi = function createNew() {
        //     // //change module service to use for each product
        //     // switch($scope.productName) {
        //     //     case "term-life-protect":
        //     //         parentScope.moduleService = illustrationUIService;
        //     //         break;
        //     //     case "motor-private-car":
        //     //         parentScope.moduleService = quotationUIService;
        //     //         break;
        //     // }
                
        //     // // 'term-life-protect'
        //     // parentScope.createNewDoc($scope.productName);
        //     $mdDialog.cancel($scope.productName);
        // }

        $scope.okDialog = function() {
            parentScope.showPDF($scope.productName);
            $mdDialog.hide();
            // $scope.createNewBi();
        };
    });



//illustration edit
angular.module('iposApp').controller('IllustrationOverviewCtrl', function(
    //form 3rd plugins
    $scope, 

    //from our project
    prospectUIService, illustrationUIService, commonService
) {
    $scope.name = 'IllustrationOverviewCtrl';
    $scope.moduleService = illustrationUIService;
    $scope.prospectUIService = prospectUIService;

    // if (prospectUIService.docListFull != undefined){
    //     $scope.listProspect = prospectUIService.docListFull; // list of prospects
    // }
    // else{
    //     prospectUIService.loadMetaList()
    //     .then(function afterLoadMetas () {
    //         $scope.listProspect = prospectUIService.docListFull; // list of prospects
    //     });
    // }
    if (prospectUIService.docListFull == undefined){
         prospectUIService.loadMetaList();
    }
   
    //show/hide toolbar, when change $scope.fullScreen the class will changed also
    $scope.fullScreen = false;
    $scope.showFullScreen = function() {
        if (!$scope.toolBarStyle)
            $scope.toolBarStyle = document.getElementById("arrow");

        if ($scope.fullScreen == false)
            $scope.toolBarStyle.className = "rotate";
        else
            $scope.toolBarStyle.className = "rotateCounterwise";
        $scope.fullScreen = !$scope.fullScreen;
    }

    $scope.hideParty = false;
    $scope.fullScreenParty = false;
    $scope.hideParties = function() {
        $scope.hideParty = !$scope.hideParty;
         if (!$scope.toolBarStyle)
            $scope.toolBarStyle = document.getElementById("arrow1");

        if ($scope.fullScreenParty == false)
            $scope.toolBarStyle.className = "rotate";
        else
            $scope.toolBarStyle.className = "rotateCounterwise";
        $scope.fullScreenParty = !$scope.fullScreenParty;
        //change class without jquery, ng-class
        // document.getElementById("hide").className = "animate-hided";
    }

    //receive broadcase event (after create new BI)
    $scope.$on(commonService.CONSTANTS.EVENT.CREATED_DOC, function(event, args) {        
        $scope.listCheckbox = [];
        if ($scope.moduleService.parties) {
            for (var i = $scope.moduleService.parties.length - 1; i >= 0; i--) {
                var checkbox = $scope.moduleService.findElementInElement_V3($scope.moduleService.parties[i], ['ipos-illustration:MainInsured']).$;
                if ( checkbox === 'Y')
                    $scope.listCheckbox.push(true);
                else $scope.listCheckbox.push(false);
            }
        }
    });


    //create new prospect
    // $scope.createNewProspect = function(partyIndex) {
    //     // $scope._createNewDoc(prospectUIService);
    //     var self = this;
        
    //     var moduleService = prospectUIService;
    //     self.hideRightView();
    //     this.vars.preModuleService = this.moduleService;
    //     this.vars.currModuleService = moduleService;
    //     moduleService.getNewDocument().then(function() {
    //         moduleService.partyIndex = partyIndex;
    //         $scope.moduleService.setValueForProspectDetail(partyIndex);
    //         //change to document detail-view
    //         self.openContentView(moduleService.name, moduleService.docId).then(function afterRenderView() {                    
    //             //broadcast for child controller
    //             //usually prospect module won't do anything
    //             //just illustration for prepare fields
    //             self.broadcastEvent(commonService.CONSTANTS.EVENT.CREATED_DOC, moduleService);

    //             self.unhideRightView();
    //         });
    //     });
    // };

    // $scope._createNewDoc = function createNewDoc(moduleService, moreParams) {
    //         var self = this;
    //         self.hideRightView();
    //         $scope.preModuleService = this.moduleService;
    //         $scope.currModuleService = moduleService;
    //         moduleService.getNewDocument(moreParams).then(function() {
                
    //             //change to document detail-view
    //             self.openContentView(moduleService.name, moduleService.docId, moreParams).then(function afterRenderView() {                    


    //                 //broadcast for child controller
    //                 //usually prospect module won't do anything
    //                 //just illustration for prepare fields
    //                 self.broadcastEvent(commonService.CONSTANTS.EVENT.CREATED_DOC, moduleService);

    //                 self.unhideRightView();
    //             });
    //         });
    //     };

    $scope.compareParty = function() {
        var originalParties = $scope.moduleService.findArrayInElementByElementsChain($scope.moduleService.originalDetail, ['ipos-illustration:Parties', 'ipos-illustration:Party']);
        $scope.compare = $scope.moduleService.compareData(originalParties, $scope.moduleService.parties);
    }

    /**
     * get position of slide in carousel
     * @param {integer} index the index get from carousel
     * @return {integer} return position of slide
     */
    $scope.getPos = function(index) {
        if (index > 2)
            return 0;
        else if (index < 0)
            return 2;
        else return index;
    }


    /**
     * import the selected prospect into the fields
     * @param {string, integer} selectedItem: selected prospect name, partyIndex: index of party
     * @return
     */

    // $scope.getDetail = function(DocId, partyIndex) {
    //     // var refId = selectedItem.DocId;
    //     prospectUIService.loadDetail(DocId).then(function() {
    //         $scope.setValueForIllustrationDetail(partyIndex, DocId);
    //     });
    // }
    $scope.getDetail = function(refId, partyIndex) {
        var refId = refId;
        if(refId){
            prospectUIService.loadDetail(refId).then(function() {
                $scope.moduleService.editModeProspect = true;
                $scope.moduleService.clearValueForIllustrationDetail(partyIndex);
                $scope.moduleService.setValueForIllustrationDetail(refId, partyIndex);
            });
        }
        else{
            //for deselect prospect
            $scope.moduleService.editModeProspect = false;
            $scope.moduleService.parties[partyIndex]['@refUid'] = "";
            $scope.moduleService.clearValueForIllustrationDetail(partyIndex);
        }
       
    }

    /**
     * Set value from prospect detail to illustration detail
     * @param {integer} partyIndex
     * @return
     */
    // $scope.setValueForIllustrationDetail = function(refId, partyIndex) {
    //     $scope.moduleService.parties[partyIndex]['@refUid'] = refId;
    //     $scope.moduleService.findElementInElement_V3($scope.moduleService.parties[partyIndex], ['FullName']).$ = $scope.prospectUIService.findElementInDetail_V3(['ipos-prospect:Person', 'ipos-prospect:FullName']).$;
    //     $scope.moduleService.findElementInElement_V3($scope.moduleService.parties[partyIndex], ['BirthDate']).$ = $scope.prospectUIService.findElementInDetail_V3(['ipos-prospect:Person', 'ipos-prospect:BirthDate']).$;
    //     $scope.moduleService.findElementInElement_V3($scope.moduleService.parties[partyIndex], ['Gender']).Value = $scope.prospectUIService.findElementInDetail_V3(['ipos-prospect:Person', 'ipos-prospect:Gender']).Value;
    //     $scope.moduleService.findElementInElement_V3($scope.moduleService.parties[partyIndex], ['SmokerStat']).Value = $scope.prospectUIService.findElementInDetail_V3(['ipos-prospect:Person', 'ipos-prospect:SmokerStat']).Value;
    //     $scope.moduleService.findElementInElement_V3($scope.moduleService.parties[partyIndex], ['ipos-illustration:Industry']).Value = $scope.prospectUIService.findElementInDetail_V3(['ipos-prospect:Person', 'ipos-prospect:BusinessIndustry']).Value;
    //     $scope.moduleService.findElementInElement_V3($scope.moduleService.parties[partyIndex], ['ipos-illustration:Occupation']).Value = $scope.prospectUIService.findElementInDetail_V3(['ipos-prospect:Person', 'ipos-prospect:Occupation']).Value;
    // }

    $scope.addNewParty = function() {
        if($scope.moduleService.isEditMode){
            $scope.moduleService.addElementToArrayInDetail(['ipos-illustration:Parties', 'ipos-illustration:Party'], $scope.moduleService.emptyTemplate);
        //$scope.moduleService.originalParties.push(angular.copy($scope.moduleService.emptyTemplate));
        // if($scope.moduleService.findElementInElement_V3($scope.moduleService.parties[0], '$..ipos-illustration:MainInsured').$ == 'N' && $scope.listCheckbox[0] == false)
        //     $scope.listCheckbox.push(false);
        // else $scope.listCheckbox.push(true);
        }
    }

    $scope.addNewRider= function() {
        if($scope.moduleService.isEditMode){
            $scope.moduleService.addElementToArrayInDetail(['ipos-illustration:Riders', 'ipos-illustration:Rider'], $scope.moduleService.emptyRiderTemplate);
        }
    }

    $scope.removeParty = function(index) {
        if($scope.moduleService.isEditMode)
            $scope.moduleService.removeElementFromArrayInDetail(['ipos-illustration:Parties', 'ipos-illustration:Party'], index);
        $scope.originalParties.splice(index, 1);
    }
    $scope.removeRider = function(index) {
        if($scope.moduleService.isEditMode)
            $scope.moduleService.removeElementFromArrayInDetail(['ipos-illustration:Riders', 'ipos-illustration:Rider'], index);
    }

    $scope.onCheck = function(index) {
        for (var i = $scope.moduleService.parties.length - 1; i >= 0; i--) {
            if (i != index)
                $scope.listCheckbox[i] = !$scope.listCheckbox[i];
        };
    }

    $scope.variables = illustrationUIService.variables;

    // $scope.computeIllustration = function() {
    //     if($scope.moduleService.isEditMode){
    //         illustrationUIService.progressBarOverview = false;
    //         illustrationUIService.computeIllustration(commonService.CONSTANTS.MODULE_NAME.ILLUSTRATION, "term-life-protect").then(function(data) {
    //             illustrationUIService.progressBarOverview = true;
    //             if (illustrationUIService.errorList != undefined) {
    //                 $scope.errorSave = illustrationUIService.findElementInElement_V3(illustrationUIService.errorList, ['ipos-error-document:ErrorMessage']);
    //                 $scope.openMessageBar($scope.errorSave);
    //             } else {
    //                 // $scope.openMessageBar("Computed Successful");
                    
    //                 $scope.refreshContent();
    //             }
    //         });
    //     }
    // };

        //compute illustration when navigate illust table page
        $scope.computeIllustration = function() {
            var self = this;
            if(illustrationUIService.isEditMode){
                //show toggle
                self.hideRightView();
                illustrationUIService.computeIllustration(commonService.CONSTANTS.MODULE_NAME.ILLUSTRATION, "term-life-protect").then(function(data) {
                    //if table is null
                    var illustrationTableLength = illustrationUIService.findElementInElement_V3(data, ['ipos-illustration:row']);
                    illustrationUIService.progressBarOverview = true;
                    if(!illustrationTableLength.length){
                        $scope.openMessageBar("Computed Fail");
                    }

                    else if (illustrationUIService.errorList != undefined) {
                        this.errorSave = illustrationUIService.findElementInElement_V3(illustrationUIService.errorList, ['ipos-error-document:ErrorMessage']);
                        this.openMessageBar($scope.errorSave);
                    } else {
                        $scope.openMessageBar("Computed Successful");
                        
                        $scope.refreshContent();
                    }
                    self.unhideRightView();
                });
            }
        }


        //go to sub page in sub page
        $scope.gotoSub = function openCont() {
            $scope.toggleSubHeader();
            this.goToState('.', {
                    subId: 'term_life_protect_rider_table',
                    subChild: true
            });
        }

        $scope.toggleSubHeader = function toggleSubHeader() {
            this.vars.isOnSubinSubState = !this.vars.isOnSubinSubState;
        }

});


'use strict';
angular.module('iposApp').controller('IllustrationHeaderCtrl', function(
        //form 3rd plugins
        $scope, $mdDialog, translateService, $q,

        //from our project
        prospectUIService, illustrationUIService, salecaseUIService, commonService
    )

    {
        $scope.moduleService = illustrationUIService;
        $scope.prospectUIService = prospectUIService;

        //HEADER/////////////////////////////////
        $scope.reset = function() {
            $scope.moduleService.resetContent(commonService.CONSTANTS.MODULE_NAME.ILLUSTRATION);
            $scope.moduleService.parties = $scope.moduleService.findElementInDetail_V3(['ipos-illustration:Parties', 'ipos-illustration:Party']); // list of party
        }

        $scope.showtemplateList = function(ev) {
          $mdDialog.show({
              controller: 'pdfTemplateCtrl',
              templateUrl: 'templates/product_template_list.html',
              targetEvent: ev,
              locals: {
                  parentScope: $scope
              },
          });
      }

        // /**
        //  * Save illustration
        //  * @param
        //  * @return
        //  */
        // $scope.save = function() {
        //     var self = this;
        //     if (illustrationUIService.detail !== undefined) {
        //         //create new document
        //         if (illustrationUIService.docId == "") {
        //             illustrationUIService.saveDocument("term-life-protect").then(function(data) {
        //                 if (illustrationUIService.errorList != undefined) {
        //                     self.errorSave = illustrationUIService.findElementInElement_V3(illustrationUIService.errorList, ['ipos-error-document:ErrorMessage']);
        //                     self.openMessageBar($translate.instant(self.errorSave))
        //                     $scope.refreshContent();//refresh content after save got error
        //                 } else {
        //                     self.openMessageBar("Saved Successfully");
        //                     self.toggleLoadingRightView();

        //                     //broadcast to others that metadata list has been updated
        //                     self.broadcastEvent(commonService.CONSTANTS.EVENT.UPDATED_LIST);

        //                     //broadcast to others that document has been saved
        //                     self.broadcastEvent(commonService.CONSTANTS.EVENT.SAVED_DOCUMENT, self.moduleService);
        //                 }
        //             });
        //         }
        //         //edit existing doc
        //         else {
        //             illustrationUIService.updateIllustration("term-life-protect").then(function() {
        //                 if (illustrationUIService.errorList != undefined) {
        //                     self.errorSave = illustrationUIService.findElementInElement_V3(illustrationUIService.errorList, ['ipos-error-document:ErrorMessage']);
        //                     self.openMessageBar($translate.instant(self.errorSave));
        //                 } else {
        //                     self.openMessageBar("Updated Successfully");
        //                     self.toggleLoadingRightView();

        //                     //broadcast to others that metadata list has been updated
        //                     self.broadcastEvent(commonService.CONSTANTS.EVENT.UPDATED_LIST);

        //                     //broadcast to others that document has been updated
        //                     self.broadcastEvent(commonService.CONSTANTS.EVENT.UPDATED_DOCUMENT, self.moduleService);
        //                 }
        //             });
        //         }

        //     }
        // }

        /**
         * Do save & update
         * @return {[type]} [description]
         */
        $scope.saveIllustration = function saveIllustration() {
            var self = this;
            var saveFunc = undefined;
            var eventSave = undefined;
            var message = undefined;

            //create new one
            if (!illustrationUIService.docId) {
                saveFunc = illustrationUIService.saveDocument;
                eventSave = commonService.CONSTANTS.EVENT.SAVED_DOCUMENT;
                message = "Saved Successfully";
            }
            //update existing one
            else{                
                saveFunc = illustrationUIService.updateIllustration;
                eventSave = commonService.CONSTANTS.EVENT.UPDATED_DOCUMENT;
                message = "Updated Successfully";
            }

            // self._addAvatar().then(function processNewAvatar () {
            //     self.moduleService.newAvatarInfo = [];
                saveFunc.call(illustrationUIService, "term-life-protect").then(function saveIllustration(data) {
                    if (illustrationUIService.errorList != undefined) {
                        self.errorSave = illustrationUIService.findElementInElement_V3(illustrationUIService.errorList, ['ipos-error-document:ErrorMessage']);
                        self.openMessageBar(translateService.instant(self.errorSave));
                        $scope.refreshContent();//refresh content after save got error
                    } else {
                        self.openMessageBar(message);  
                        self.broadcastEvent(commonService.CONSTANTS.EVENT.UPDATED_LIST); 
                        self.broadcastEvent(eventSave, self.moduleService);  
                        // var newDocForCase = true;   
                        // //broadcast to others that metadata list has been updated
                        // if(newDocForCase == false){
                        // self.broadcastEvent(commonService.CONSTANTS.EVENT.UPDATED_LIST);
                        // //broadcast to others that document has been saved
                        // self.broadcastEvent(eventSave, self.moduleService);}
                        // else{
                        //     //get new termlife doc id for sale
                        //     self.vars.newTermLifeDocId = illustrationUIService.getDocInfo(data).DocId;
                        //     salecaseUIService.findElementInDetail_V3(['ipos-case-management-motor-private-car-m:AgentSale', 'ipos-case-management-motor-private-car-m:Policy'])['@refUid'] = self.vars.newTermLifeDocId;
                        // }
                    }
                    self.unhideRightView();
                });
            // });
        }

        $scope._saveDoc = function _saveDoc() {
            var self = this;
            // var prospectId = this.findElementInElement_V3(this.detail, ['ipos-illustration:BaseIllustration'])['ipos-illustration:row']  = this.originalTableRow; 
            // if()
           //will unhide in saveIllustration()
            self.hideRightView();
            self._saveResource().then(function savedResource () {
                self.moduleService.tempNewResource = [];

                self._updateResource().then(function updatedResource () {
                    self.moduleService.indexOfEditedResource = [];
                    self.moduleService.editedResourceMeta = [];
                    self.moduleService.editedResourceDocId = [];

                    self._deleteResource().then(function removedResource () {
                        self.moduleService.indexOfDeletedResource = [];
                        self.saveIllustration();

                        // self.toggleLoadingRightView();
                    });
                });
            });
        }
        // $scope.createNewPropsectConfirm = function createNewPropsectConfirm () {
        //     var promises = [];
        //     var promise = undefined;
        //     var listNewProspect = [];
        //     var Uid = undefined;
        //     //push all un create propsect to list to created
        //     for (var i = $scope.moduleService.parties.length - 1; i >= 0; i--) {
        //         Uid = $scope.moduleService.findElementInElement_V3($scope.moduleService.parties[i], ['@refUid']);
        //         if(!Uid){
        //             promise = $scope.createNewProspect(i);

        //             // promise.success(function(data, status, headers) {
        //             //     $scope.sharedImagesByID.push(data.data);
        //             // });

        //             // promise.error(function(data, status, headers, config) {
        //             //     console.error('error in loading File');
        //             // });

        //             promises.push(promise);
        //         }
        //     };
        //     $q.all(promises);
        // }  


        

        // $scope.createNewPropsectConfirm = function createNewPropsectConfirm() {
        //     var listNewProspect = [];
        //     var Uid = undefined;
        //     //push all un create propsect to list to created
        //     for (var i = $scope.moduleService.parties.length - 1; i >= 0; i--) {
        //         Uid = $scope.moduleService.findElementInElement_V3($scope.moduleService.parties[i], ['@refUid']);
        //         if(!Uid){

        //         }
        //     };

        // };

        $scope.createNewPropsectConfirm = function createNewPropsectConfirm() {
            var listNewProspect = [];
            var Uid = undefined;
            var self = this;
            self.vars.preModuleService = self.moduleService;
            self.vars.preModuleService.listPartyIndex = [];
            //push all un create propsect to list to created
            for (var i = $scope.moduleService.parties.length - 1; i >= 0; i--) {
                Uid = $scope.moduleService.findElementInElement_V3($scope.moduleService.parties[i], ['@refUid']);
                if(!Uid){
                    self.vars.preModuleService.listPartyIndex.push(i);
                    listNewProspect.push($scope.moduleService.parties[i]); 
                }
            };
            
           
            $mdDialog.show({
                controller: 'NewPropspectConfirmCtrl',
                templateUrl: 'templates/create_new_prosect_confirm.html',
                clickOutsideToClose: false,
                listProspect: listNewProspect
            }).then(function() { //OK
                // $scope._saveDoc();
                $scope.createNewProspect(self.vars.preModuleService.listPartyIndex[0]);
            }, function() { //Cancel
                //nothing happen;
                
            });
         
        };

        /**
         * compute illustration
         * @param
         * @return
         */
        $scope.computeIllustration = function() {
            illustrationUIService.progressBarOverview = false;
            illustrationUIService.computeIllustration(commonService.CONSTANTS.MODULE_NAME.ILLUSTRATION, "term-life-protect").then(function(data) {
                illustrationUIService.progressBarOverview = true;
                if (illustrationUIService.errorList != undefined) {
                    $scope.errorSave = illustrationUIService.findElementInElement_V3(illustrationUIService.errorList, ['ipos-error-document:ErrorMessage']);
                    $scope.openMessageBar($scope.errorSave);
                } else {
                    $scope.openMessageBar("Computed Successful");
                    $scope.refreshContent();
                }
            });
        }


        // $scope.getComputedDetail = function() {
        //     var docId = illustrationUIService.docId;
        //     illustrationUIService.loadComputedDetail(commonService.CONSTANTS.MODULE_NAME.ILLUSTRATION, "term-life-protect", docId);
        // };
        $scope.getComputedDetail = function() {
            var self = this;
            self.hideRightView();
            illustrationUIService.loadComputedDetail().then( function afterLoadComputedDoc(){
                self.refreshContent();
                self.unhideRightView();
            });
        };


        $scope.moduleService.openMessageBar = $scope.openMessageBar;

        $scope.showTags = function(ev) {
            $mdDialog.show({
                controller: 'TagsCtrl',
                templateUrl: 'templates/tags.html',
                targetEvent: ev,
                locals: {
                    moduleService: $scope.moduleService
                },
            });
        }

        //create new prospect for parti
        // $scope.createNewProspect = function(partyIndex) {
        //     // $scope._createNewDoc(prospectUIService);
        //     var self = this;
        //     var moduleService = prospectUIService;
        //     self.hideRightView();
        //     this.vars.preModuleService = this.moduleService;
        //     this.vars.currModuleService = moduleService;
        //     moduleService.getNewDocument().then(function() {
        //         moduleService.partyIndex = partyIndex;
        //         $scope.moduleService.setValueForProspectDetail(partyIndex);
        //         //change to document detail-view
        //         self.openContentView(moduleService.name, moduleService.docId).then(function afterRenderView() {                    
        //             //broadcast for child controller
        //             //usually prospect module won't do anything
        //             //just illustration for prepare fields
        //             self.broadcastEvent(commonService.CONSTANTS.EVENT.CREATED_DOC, moduleService);
        //             self.unhideRightView();
        //         });
        //     });
        // };

        // $scope.showPDF = function() {
        //     $scope.bLoadingRightView = true;
        //     // illustrationUIService.viewPDF();
        // }

        //////////////////////////////////

    });
