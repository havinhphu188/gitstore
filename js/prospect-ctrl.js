'use strict';
angular.module('iposApp').controller('ProspectListCtrl', function(
    $scope, $log, prospectUIService
) {

    $scope.name = 'ProspectListCtrl';
    $scope.moduleService = prospectUIService;

    //get theme color
    $scope.defaultThemeColor = localStorage.getItem('themeColor');

    // sort list prospect   
    $scope.sorting = function(card) {
        return $scope.moduleService.orderBy(card, 'UpdatedDate');
    };

    //the selected index to change selected card class
    $scope.getDetail = function(docId, index) {
        $scope.openDocument(prospectUIService.name, docId, index);
    };


    //receive broadcast event (after list document is change)
    $scope.$on($scope.CONSTANTS.EVENT.UPDATED_LIST, function(event, args) {
        event.currentScope.loadMetaList();
    });

    //load prospect list when ctrl is called
    $scope.loadMetaList(true);
});


'use strict';
angular.module('iposApp').controller('ProspectOverviewCtrl', function(
    $scope, $log, prospectUIService, resourceUIService, $mdSidenav, $mdUtil
) {

    $scope.init = function init (argument) {
        
        this.name = 'ProspectOverviewCtrl';
        this.moduleService = prospectUIService;
        //set variables for prospect
        this.variables = prospectUIService.variables;

        //fill photo img if user chose new avatar, not save yet
        if(this.moduleService.newAvatarInfo && this.moduleService.newAvatarInfo.length > 0){
            var avatarEle = angular.element("#prospectPhoto");
            avatarEle.attr(
                'src', 
                'data:image/jpg;base64,' + this.moduleService.newAvatarInfo[0].ImageData);
        }
        
    }


    // $scope.openChooseAvatarModal = function chooseAvatar(argument) {
    //     if ($scope.moduleService.isEditMode)
    //         $scope.showAttachment('image');
    // }

    $scope.isFieldEmpty = function(value){
        if($scope.moduleService.isEditMode && value)
            // this.vars.bIsContentChanged  = true;
            return false;
        return true;
    }


    //show/hide toolbar, when change $scope.fullScreen the class will changed also
    // $scope.fullScreen = false;
    // $scope.showFullScreen = function() {
    //     if (!$scope.toolBarStyle)
    //         $scope.toolBarStyle = document.getElementById("arrow");

    //     if ($scope.fullScreen == false)
    //         $scope.toolBarStyle.className = "rotate";
    //     else
    //         $scope.toolBarStyle.className = "rotateCounterwise";
    //     $scope.fullScreen = !$scope.fullScreen;
    // }

    // $scope.testFunction = function() {
    //     var fullname1 = $scope.testFunctionV2(['ipos-prospect:FullName']).$;
    //     var title1 = $scope.testFunctionV2(['ipos-prospect:Gender']).Value;
    //     var age1 = $scope.testFunctionV2(['ipos-prospect:Age']).$;
    //     var smokeStat1 = $scope.testFunctionV2(['ipos-prospect:SmokerStat']).Value;

    //     var fullname2 = $scope.testFunctionV2_noRecursive(['ipos-prospect:FullName']).$;
    //     var title2 = $scope.testFunctionV2_noRecursive(['ipos-prospect:Gender']).Value;
    //     var age2 = $scope.testFunctionV2_noRecursive(['ipos-prospect:Age']).$;
    //     var smokeStat2 = $scope.testFunctionV2_noRecursive(['ipos-prospect:SmokerStat']).Value;

    //     var fullname3 = $scope.testFunctionV3('$..ipos-prospect:FullName').$;
    //     var title3 = $scope.testFunctionV3('$..ipos-prospect:Gender').Value;
    //     var age3 = $scope.testFunctionV3('$..ipos-prospect:Age').$;
    //     var smokeStat3 = $scope.testFunctionV3('$..ipos-prospect:SmokerStat').Value;
    //     $log.debug("V2: " + title1 + ", " + fullname1 + ", " + age1 + ", " + smokeStat1);
    //     $log.debug("V2-wRecursive: " + title2 + ", " + fullname2 + ", " + age2 + ", " + smokeStat2);
    //     $log.debug("V3: " + title3 + ", " + fullname3 + ", " + age3 + ", " + smokeStat3);

    // }

    // $scope.testFunctionV2 = function(path) {
    //     var start = new Date().getTime();
    //     for (var i = 0; i < 50000; i++) {
    //         $scope.v2 = $scope.moduleService.findElementInDetail_V3(path);
    //     }
    //     var end = new Date().getTime();
    //     var time = end - start;
    //     $log.debug("Running: " + path + " took " + time + " ms");
    //     return $scope.v2;
    // }

    // $scope.testFunctionV2_noRecursive = function(path) {
    //     var start = new Date().getTime();
    //     for (var i = 0; i < 50000; i++) {
    //         $scope.v2 = $scope.moduleService.findElementInElement_V3_noRecursive($scope.moduleService.detail, path);
    //     }
    //     var end = new Date().getTime();
    //     var time = end - start;
    //     $log.debug("Running: " + path + " took " + time + " ms");
    //     return $scope.v2;
    // }

    // $scope.testFunctionV3 = function(jspath) {
    //         var start = new Date().getTime();
    //         for (var i = 0; i < 50000; i++) {
    //             $scope.v3 = $scope.moduleService.findElementInDetailByJsonPath(jspath);
    //         }
    //         var end = new Date().getTime();
    //         var time = end - start;
    //         $log.debug("Running: " + jspath + " took " + time + " ms");
    //         return $scope.v3;
    //     }

    //add new id 
    $scope.addNewID = function() {
        //add 1 more ID template to current IDs
        if ($scope.moduleService.isEditMode) {
            $scope.moduleService.addElementToArrayInDetail(['ipos-prospect:IDs', 'ipos-prospect:ID'], $scope.moduleService.emptyIdsTemplate);            
        }
    }

    $scope.addNewContact = function() {
        if ($scope.moduleService.isEditMode) {
            $scope.moduleService.addElementToArrayInDetail(['ipos-prospect:Contacts', 'ipos-prospect:Contact'], $scope.moduleService.emptyContactTemplate);
        }
    }

    $scope.addNewAddress = function() {
        if ($scope.moduleService.isEditMode) {
            $scope.moduleService.addElementToArrayInDetail(['ipos-prospect:Addresses', 'ipos-prospect:Address'], $scope.moduleService.emptyAddressTemplate);
        }
    }

    // $scope.clearAddress = function(index) {
    //     $scope.moduleService.clearData($scope.moduleService.addresses[index]);
    // }

    // $scope.clearContact = function(index) {
    //     $scope.moduleService.clearData($scope.moduleService.contacts[index]);
    // }

    // $scope.clearId = function(index) {
    //     $scope.moduleService.clearData($scope.moduleService.iDs[index]);
    // }

    $scope.removeID = function(index) {
        if ($scope.moduleService.isEditMode) {
            $scope.moduleService.removeElementFromArrayInDetail(['ipos-prospect:IDs', 'ipos-prospect:ID'], index);            
        }
    }

    $scope.removeContact = function(index) {
        if ($scope.moduleService.isEditMode) {
            $scope.moduleService.removeElementFromArrayInDetail(['ipos-prospect:Contacts', 'ipos-prospect:Contact'], index);
        }
    }

    $scope.removeAddress = function(index) {
        if ($scope.moduleService.isEditMode) {
            $scope.moduleService.removeElementFromArrayInDetail(['ipos-prospect:Addresses', 'ipos-prospect:Address'], index);
        }
    }

    // find the position of channel type 'ALL'
    $scope.findChannelTypeAllPosition = function(){
        var communicationChanels = $scope.moduleService.findElementInDetail_V3(['ipos-prospect:CommunicationChannel']);
        for(var i = 0; i < communicationChanels.length; i++){
            if($scope.moduleService.findElementInElement_V3(communicationChanels[i], ['ipos-prospect:CommunicationChannelValue'])['@channelType'] == 'ALL')
                return i;
        }
        return undefined;
    }

    $scope.updateCommunicationChannelCheckboxs = function(channelIndex) {
        var channelTypeAllIndex = $scope.findChannelTypeAllPosition();
        var communicationChanels = $scope.moduleService.findElementInDetail_V3(['ipos-prospect:CommunicationChannel']);
        var allChannel = $scope.moduleService.findElementInElement_V3(communicationChanels[channelTypeAllIndex], ['ipos-prospect:CommunicationChannelValue']).Value;
        
        if (channelIndex == (channelTypeAllIndex)) {
            for (var i = 0; i < communicationChanels.length; i++) {
                if(i != channelTypeAllIndex)
                    $scope.moduleService.findElementInElement_V3(communicationChanels[i], ['ipos-prospect:CommunicationChannelValue']).Value = allChannel;
            }
        } else {
            var isAllSelected = true;
            for (var i = 0; i < communicationChanels.length; i++) {
                if(i != channelTypeAllIndex){
                    var channel = $scope.moduleService.findElementInElement_V3(communicationChanels[i], ['ipos-prospect:CommunicationChannelValue']).Value;
                    if (channel == 'N' || channel == '') {
                        isAllSelected = false;
                        break;
                    }
                }
            }
            if (isAllSelected) {
                $scope.moduleService.findElementInElement_V3(communicationChanels[channelTypeAllIndex], ['ipos-prospect:CommunicationChannelValue']).Value = 'Y';
            } else {
                $scope.moduleService.findElementInElement_V3(communicationChanels[channelTypeAllIndex], ['ipos-prospect:CommunicationChannelValue']).Value = 'N';
            }
        }
    };

    

    $scope._showImgPickerAvatar = function() {
        var self = this;
        if(!self.moduleService.isEditMode)
            return;

        resourceUIService.showImagePicker(false).then(function hadImgInfor (imgsInfo) {
            
            if(!imgsInfo.length)
                return;

            //clear old value/init
            self.moduleService.newAvatarInfo = [];

            self.moduleService.newAvatarInfo.push(imgsInfo[0]);

            angular.element("#prospectPhoto").attr('src', 'data:image/jpg;base64,' + imgsInfo[0].ImageData);
        });
    };

    //clear data when unselected value

    $scope.clearAllIdData = function(itemId, index) {
        if(!itemId){
            prospectUIService.clearIdValue(index);
        }
    };

    $scope.clearAllAddressData = function(itemId, index) {
        if(!itemId){
            prospectUIService.clearAddressValue(index);
        }
    };

    $scope.clearAllContactData = function(itemId, index) {
        if(!itemId){
            prospectUIService.clearContactValue(index);
        }
    };



    $scope.init();

});


'use strict';
angular.module('iposApp').controller('ProspectHeaderCtrl', function(
        //form 3rd plugins
        $scope, $mdDialog, translateService, illustrationUIService, $state,

        //from our project
        prospectUIService, commonService
    )

    {

        $scope.name = 'ProspectHeaderCtrl';

        $scope.moduleService = prospectUIService;
        $scope.illustrationUIService = illustrationUIService;

        $scope.reset = function() {
            if($scope.moduleService.isEdited()){
                $scope.resetDataConfirm().then(function(result) { //OK
                    // result = true if choose ok
                    if(result){
                        $scope.moduleService.resetContent(commonService.CONSTANTS.MODULE_NAME.PROSPECT);
                        $scope.moduleService.iDs = $scope.moduleService.findElementInDetail_V3(['ipos-prospect:IDs', 'ipos-prospect:ID']); // list of addresses
                        $scope.moduleService.contacts = $scope.moduleService.findElementInDetail_V3(['ipos-prospect:Contacts', 'ipos-prospect:Contact']); // list of contacts
                        $scope.moduleService.addresses = $scope.moduleService.findElementInDetail_V3(['ipos-prospect:Addresses', 'ipos-prospect:Address']); // list of addresses
                        $scope.moduleService.tagList = angular.copy($scope.moduleService.tagListOriginal);
                    }
                });
            }
            
        }
        

        /**
         * Do save & update
         * @return {[type]} [description]
         */
        $scope.saveProspect = function saveProspect () {
            var self = this;
            var deferred = self.moduleService.$q.defer();
            var saveFunc = undefined;
            var eventSave = undefined;
            var message = undefined;

            //create new one
            if (!prospectUIService.docId) {
                saveFunc = prospectUIService.__saveProspect;
                eventSave = commonService.CONSTANTS.EVENT.SAVED_DOCUMENT;
                message = "Saved Successfully";
            }
            //update existing one
            else{                
                saveFunc = prospectUIService.updateProspect;
                eventSave = commonService.CONSTANTS.EVENT.UPDATED_DOCUMENT;
                message = "Updated Successfully";
            }

            saveFunc.call(prospectUIService).then(function savedProspect (data) {
                if (prospectUIService.errorList != undefined) {
                    self.errorSave = prospectUIService.findElementInElement_V3(prospectUIService.errorList, ['ipos-error-document:ErrorMessage']);
                    self.openMessageBar(translateService.instant(self.errorSave));
                    //refresh content after save got error
                    $scope.refreshContent();

                    deferred.reject("");
                } else {
                    
                    self.openMessageBar(message);
                    //get new prospect id to bind to refUId in BI
                    if(self.vars.preModuleService){
                        
                        var propsectDocId = self.vars.currModuleService.docId;
                        //set new value to BI
                        $scope.illustrationUIService.setValueForIllustrationDetail(propsectDocId, illustrationUIService.partyIndex);

                        //clear doc id to go back to product page in BI
                        self.vars.currModuleService.docId = "";
                        prospectUIService.docId = "";

                        $scope.loadMetaList();


                        // // self.vars.preModuleService.listPartyIndex.splice(0, 1);


                        
                        // //if create propect from BI module
                        // if(self.vars.preModuleService.listPartyIndex.length){
                        //     $scope.createNewProspect(self.vars.preModuleService.listPartyIndex[0]);
                        // }else{
                            //go back to product page in BI
                            $scope.goToPrevState();
                            self.vars.preModuleService = undefined;
                            self.unhideRightView();
                            //broadcast to others that metadata list has been updated
                            // self.broadcastEvent(commonService.CONSTANTS.EVENT.UPDATED_LIST);

                            //broadcast to others that document has been saved
                            // self.broadcastEvent(eventSave, self.moduleService);
                        // }
                    }else{
                         self.unhideRightView();
                        //broadcast to others that metadata list has been updated
                        self.broadcastEvent(commonService.CONSTANTS.EVENT.UPDATED_LIST);

                        //broadcast to others that document has been saved
                        self.broadcastEvent(eventSave, self.moduleService);
                    }
                    
                    // if(self.vars.preModuleService.name == "illustration"){
                    //     //get new prospect id to bind to refUId in BI
                    //     var propsectDocId = self.vars.currModuleService.docId;
                    //     //set new value to BI
                    //     $scope.illustrationUIService.setValueForIllustrationDetail(propsectDocId, prospectUIService.partyIndex);

                    //     //clear doc id to go back to product page in BI
                    //     self.vars.currModuleService.docId = "";

                    //     //go back to product page in BI
                    //     $scope.goToPrevState();

                    //     self.unhideRightView();
                    // }else{
                    //     //broadcast to others that metadata list has been updated
                    //     self.broadcastEvent(commonService.CONSTANTS.EVENT.UPDATED_LIST);

                    //     //broadcast to others that document has been saved
                    //     self.broadcastEvent(eventSave, self.moduleService);
                    // }

                    deferred.resolve;
                }
            });

            return deferred.promise;
        }

        $scope.cancelCreateProspect = function(){
            this.vars.preModuleService.listPartyIndex.splice(0, 1);
            //if create propect from BI module
            if(this.vars.preModuleService.listPartyIndex.length){
                $scope.createNewProspect(this.vars.preModuleService.listPartyIndex[0]);
            }else{
                //go back to product page in BI
                $scope.goToPrevState();
                this.vars.preModuleService = undefined;
                this.unhideRightView();
            }
        }

        $scope._saveDoc = function _saveDoc() {
            var self = this;

            self.hideRightView();

            self._saveResource().then(function savedResource() {
                //add avatar before updateResource because we need to update an avatar information 
                //to resource needed to update
                return self.moduleService.attachAvatariOS();

            }).then(function processNewAvatar() {
                return self._updateResource();

            }).then(function updatedResource () {
                return self._deleteResource();

            }).then(function removedResource () {
                return self.saveProspect();        

            }).catch(function(error) {
                // self.moduleService.$log.error("An error occured: " + error);

            }).finally (function() {
                self.unhideRightView();
            });
        }

        $scope.getComputedDetail = function() {
            var self = this;
            self.hideRightView();
            prospectUIService.loadComputedDetail().then(function afterLoadComputedDoc() {
                self.refreshContent();
                self.unhideRightView();
            });
        };

        $scope.goToPrevState =function goToPrevState () {
             $state.go('home.side_bar.left_right.list.detail.sub',  {
                subId: "term_life_protect_product",
                subName: "",
                doctype: 'illustration',
                productName: "term_life_protect"
            });
        }

    }
);
