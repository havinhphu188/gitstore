'use strict';
angular.module('iposApp').controller('PdpaListCtrl', function(
    //form 3rd plugins
    $scope, $mdDialog, $filter, $log
,
    //from our project
    pdpaUIService, connectService, commonService
) {
    $scope.connectService = connectService;
    $scope.moduleService = pdpaUIService;

    //get theme color


    // $scope.defaultThemeColor = localStorage.getItem("themeColor");

    // //long press
    // $scope.longPress = function($event, docId) {
    //     $scope.docId = docId;
    //     $scope.popover.show($event);
    // };

    // $ionicPopover.fromTemplateUrl('templates/long_press_popover.html', {
    //     scope: $scope,
    // }).then(function(popover) {
    //     $scope.popover = popover;
    // });

    // $scope.closePopover = function() {
    //     $scope.popover.hide();
    // }

    
    //create new pdpa
    $scope.createNew = function(productName) {
        $scope.createNewDoc(productName);
    };
    //search pdpa
    $scope.searchPDPA = function(searchValue) {
        $scope.listLowerCase = $filter('lowercase')(pdpaUIService.docListFull);
        $scope.listDisplaypdpa = $filter('filter')($scope.listLowerCase, searchValue);
    };

    //load pdpa list
    $scope.loadMetaList(true);
    //get detail PDPA
    $scope.getDetail = function(docId, index) {
        // $scope.selectListOption(productName);
        $scope.openDocument(pdpaUIService.name, docId, index);  
    };

    //receive broadcast event (after list document is change)
    $scope.$on($scope.CONSTANTS.EVENT.UPDATED_LIST, function(event, args) {        
        event.currentScope.loadMetaList();
    });


    // // toggle star
    // $scope.toggleStar = function(index) {
    //     $scope.selectedStarCard = index;
    //     $scope.showStar = false;
    // }
    // $scope.visible = true;

});

'use strict';
angular.module('iposApp').controller('PdpaOverviewCtrl', function(
        //form 3rd plugins
        $scope, $http, translateService,

        //from our project
        pdpaUIService, prospectUIService
    )

    {

        $scope.moduleService = pdpaUIService;
        $scope.prospectUIService = prospectUIService;
        $scope.variables = pdpaUIService.variables;

        // //card select
        // $scope.fullScreen = false;
        // if (prospectUIService.docList != undefined)
        //     $scope.listProspect = $scope.moduleService.findElementInElement_V3(prospectUIService.docList, ['ipos-container:map-container']); // list of prospects
        // $scope.val = {};
        // $scope.showFullScreen = function() {
        //     $scope.fullScreen = !$scope.fullScreen;
        // }


        // $scope.getDetail = function(prospect) {
        //     $scope.docId = prospectUIService.findValueInMapListByKey(prospect, 'DocId');
        //     prospectUIService.loadComputedDetail($scope.docId);
        // }

        if (prospectUIService.docListFull != undefined) {
            $scope.listProspect = prospectUIService.docListFull; // list of prospects
        } else {
            prospectUIService.loadMetaList().then(function afterLoadMetas() {
                $scope.listProspect = prospectUIService.docListFull; // list of prospects
            });
        }

        

        // $scope.moduleService.progressBarOverview = true;


        // $scope.changeLanguage = function(langKey) {
        //     translateService.use(langKey);
        // };

        // // translate test
        // $scope.hello = function() {
        //     translateService('login.username')
        //         .then(function(translatedValue) {
        //             $scope.pageTitle = translatedValue;
        //         });

        // };

        $scope.moduleService = pdpaUIService;

      
        // $scope.changeLanguage = function(langKey) {
        //     translateService.use(langKey);
        // };

       

        // //change avatar: this fuction will get image file from select and render to HTML
        // $scope.readURL = function(evt) {
        //     var files = evt.files; // FileList object

        //     // Loop through the FileList and render image files as thumbnails.
        //     for (var i = 0, f; f = files[i]; i++) {

        //         // Only process image files.
        //         if (!f.type.match('image.*')) {
        //             continue;
        //         }

        //         var reader = new FileReader();

        //         // Closure to capture the file information.
        //         reader.onload = (function(theFile) {
        //             return function(e) {
        //                 // Render thumbnail.
        //                 var span = document.getElementById('pic');
        //                 span.innerHTML = ['<img class="thumb" style = "width: 100%" src="', e.target.result,
        //                     '" title="', escape(theFile.name), '"/>'
        //                 ].join('');

        //             };
        //         })(f);

        //         // Read in the image file as a data URL.
        //         reader.readAsDataURL(f);
        //     }
        // }

        $scope.getDetail = function(refId) {
            var refId = refId;
            prospectUIService.loadDetail(refId).then(function() {
                $scope.setValueForPdpaDetail();
            });
        }

        $scope.setValueForPdpaDetail = function(refId) {
            $scope.moduleService.findElementInDetail_V3(['ipos-pdpa:Pdpa', 'ipos-pdpa:FullName']).$ = $scope.prospectUIService.findElementInDetail_V3(['ipos-prospect:Person', 'ipos-prospect:FullName']).$;
            $scope.moduleService.findElementInDetail_V3(['ipos-pdpa:Pdpa', 'ipos-pdpa:BirthDate']).$ = $scope.prospectUIService.findElementInDetail_V3(['ipos-prospect:Person', 'ipos-prospect:BirthDate']).$;
            $scope.moduleService.findElementInDetail_V3(['ipos-pdpa:Pdpa', 'ipos-pdpa:Gender']).Value = $scope.prospectUIService.findElementInDetail_V3(['ipos-prospect:Person', 'ipos-prospect:Gender']).Value;
            //$scope.moduleService.findElementInDetail_V3(['ipos-pdpa:Pdpa', 'ipos-pdpa:MarStat']).Value= $scope.prospectUIService.findElementInDetail_V3(['ipos-prospect:Person', 'ipos-prospect:MarStat']).Value;
            $scope.moduleService.findElementInDetail_V3(['ipos-pdpa:Pdpa', 'ipos-pdpa:SmokerStat']).Value = $scope.prospectUIService.findElementInDetail_V3(['ipos-prospect:Person', 'ipos-prospect:SmokerStat']).Value;
            // $scope.moduleService.findElementInElement_V3($scope.moduleService.parties[partyIndex], ['ipos-illustration:Occupation']).Value = $scope.prospectUIService.findElementInDetail_V3(['ipos-prospect:Person', 'ipos-prospect:Occupation']).Value;
        }

        // find the position of channel type 'ALL'
        $scope.findChannelTypeAllPosition = function(){
            var communicationChanels = $scope.moduleService.findElementInDetail_V3(['ipos-pdpa:CommunicationChannel']);
            for(var i = 0; i < communicationChanels.length; i++){
                if($scope.moduleService.findElementInElement_V3(communicationChanels[i], ['ipos-pdpa:CommunicationChannelValue'])['@channelType'] == 'ALL')
                    return i;
            }
            return undefined;
        }

        $scope.updateCommunicationChannelCheckboxs = function(channelIndex) {
            var channelTypeAllIndex = $scope.findChannelTypeAllPosition();
            var communicationChanels = $scope.moduleService.findElementInDetail_V3(['ipos-pdpa:CommunicationChannel']);
            var allChannel = $scope.moduleService.findElementInElement_V3(communicationChanels[channelTypeAllIndex], ['ipos-pdpa:CommunicationChannelValue']).Value;
            
            if (channelIndex == (channelTypeAllIndex)) {
                for (var i = 0; i < communicationChanels.length; i++) {
                    if(i != channelTypeAllIndex)
                        $scope.moduleService.findElementInElement_V3(communicationChanels[i], ['ipos-pdpa:CommunicationChannelValue']).Value = allChannel;
                }
            } else {
                var isAllSelected = true;
                for (var i = 0; i < communicationChanels.length; i++) {
                    if(i != channelTypeAllIndex){
                        var channel = $scope.moduleService.findElementInElement_V3(communicationChanels[i], ['ipos-pdpa:CommunicationChannelValue']).Value;
                        if (channel == 'N' || channel == '') {
                            isAllSelected = false;
                            break;
                        }
                    }
                }
                if (isAllSelected) {
                    $scope.moduleService.findElementInElement_V3(communicationChanels[channelTypeAllIndex], ['ipos-pdpa:CommunicationChannelValue']).Value = 'Y';
                } else {
                    $scope.moduleService.findElementInElement_V3(communicationChanels[channelTypeAllIndex], ['ipos-pdpa:CommunicationChannelValue']).Value = 'N';
                }
            }
        };

        // $scope.updateCommunicationChannelCheckboxs = function(channelIndex) {
        //     var communicationChanels = $scope.moduleService.findElementInDetail_V3(['ipos-pdpa:CommunicationChannel']);
        //     var allChannel = $scope.moduleService.findElementInElement_V3(communicationChanels[communicationChanels.length - 1], ['ipos-pdpa:CommunicationChannelValue']).Value;
        //     if (channelIndex == (communicationChanels.length - 1)) {
        //         for (var i = 0; i < (communicationChanels.length - 1); i++) {
        //             $scope.moduleService.findElementInElement_V3(communicationChanels[i], ['ipos-pdpa:CommunicationChannelValue']).Value = allChannel;
        //         }
        //     } else {
        //         var isAllSelected = true;
        //         for (var i = 0; i < (communicationChanels.length - 1); i++) {
        //             var channel = $scope.moduleService.findElementInElement_V3(communicationChanels[i], ['ipos-pdpa:CommunicationChannelValue']).Value;
        //             if (channel == 'N' || channel == '') {
        //                 isAllSelected = false;
        //                 break;
        //             }
        //         }
        //         if (isAllSelected) {
        //             $scope.moduleService.findElementInElement_V3(communicationChanels[communicationChanels.length - 1], ['ipos-pdpa:CommunicationChannelValue']).Value = 'Y';
        //         } else {
        //             $scope.moduleService.findElementInElement_V3(communicationChanels[communicationChanels.length - 1], ['ipos-pdpa:CommunicationChannelValue']).Value = 'N';
        //         }
        //     }
        // };

    });

'use strict';
angular.module('iposApp').controller('PdpaHeaderCtrl', function(
        //form 3rd plugins
        $scope, $http, $mdDialog,

        //from our project
        pdpaUIService, prospectUIService, commonService, translateService
    )

    {
        $scope.moduleService = pdpaUIService;
        $scope.prospectUIService = prospectUIService;

         /**
             * get compute quotation
             * @param
             * @return
             */
        $scope.getComputedDetail = function() {
            var self = this;
            self.hideRightView();
            pdpaUIService.loadComputedDetail().then(function afterLoadComputedDoc() {
                self.refreshContent();
                self.unhideRightView();
            });
        };

        $scope.reset = function() {
            $scope.moduleService.resetContent(commonService.CONSTANTS.MODULE_NAME.PDPA);
        }

        //  /**
        //      * Save PDPA
        //      * @param
        //      * @return
        //      */
        // $scope.saves= function() {
        //     var self = this;
        //     if (pdpaUIService.detail !== undefined) {
        //         //create new document
        //         if (pdpaUIService.docId == "") {
        //             // self.toggleLoadingRightView();
        //             pdpaUIService.savePDPA(commonService.CONSTANTS.MODULE_NAME.PDPA).then(function(data) {
        //                 if (pdpaUIService.errorList != undefined) {
        //                     self.errorSave = pdpaUIService.findElementInElement_V3(pdpaUIService.errorList, ['ipos-error-document:ErrorMessage']);
        //                     self.openMessageBar($scope.errorSave);
        //                 } else {
        //                     self.openMessageBar("Saved Successfully");

        //                     //broadcast to others that metadata list has been updated
        //                     self.broadcastEvent(commonService.CONSTANTS.EVENT.UPDATED_LIST);

        //                     //broadcast to others that document has been saved
        //                     self.broadcastEvent(commonService.CONSTANTS.EVENT.SAVED_DOCUMENT, self.moduleService);
        //                 }
        //                 self.unhideRightView();
        //             });
        //         }
        //         //edit existing doc
        //         else {
        //             // self.toggleLoadingRightView();
        //             pdpaUIService.updatePDPA().then(function() {
        //                 if (pdpaUIService.errorList != undefined) {
        //                     self.errorSave = pdpaUIService.findElementInElement_V3(pdpaUIService.errorList, ['ipos-error-document:ErrorMessage']);
        //                     self.openMessageBar($scope.errorSave);
        //                 } else {
        //                     self.openMessageBar("Updated Successfully");
                            
        //                     //broadcast to others that metadata list has been updated
        //                     self.broadcastEvent(commonService.CONSTANTS.EVENT.UPDATED_LIST);

        //                     //broadcast to others that document has been updated
        //                     self.broadcastEvent(commonService.CONSTANTS.EVENT.UPDATED_DOCUMENT, self.moduleService);
        //                 }
        //                 self.unhideRightView();
        //             });
        //         }

        //     }
        // };

         /**
         * Do save & update
         * @return {[type]} [description]
         */
        $scope.savePdpa = function savePdpa () {
            var self = this;
            var saveFunc = undefined;
            var eventSave = undefined;
            var message = undefined;

            //create new one
            if (!pdpaUIService.docId) {
                saveFunc = pdpaUIService.savePDPA;
                eventSave = commonService.CONSTANTS.EVENT.SAVED_DOCUMENT;
                message = "Saved Successfully";
            }
            //update existing one
            else{                
                saveFunc = pdpaUIService.updatePDPA;
                eventSave = commonService.CONSTANTS.EVENT.UPDATED_DOCUMENT;
                message = "Updated Successfully";
            }

            // self._addAvatar().then(function processNewAvatar () {
            //     self.moduleService.newAvatarInfo = [];
                saveFunc.call(pdpaUIService).then(function savedPppa(data) {
                    if (pdpaUIService.errorList != undefined) {
                        self.errorSave = pdpaUIService.findElementInElement_V3(pdpaUIService.errorList, ['ipos-error-document:ErrorMessage']);
                        self.openMessageBar(translateService.instant(self.errorSave));
                        $scope.refreshContent();//refresh content after save got error
                    } else {
                        self.openMessageBar(message);
                         
                        //broadcast to others that metadata list has been updated
                        self.broadcastEvent(commonService.CONSTANTS.EVENT.UPDATED_LIST);

                        //broadcast to others that document has been saved
                        self.broadcastEvent(eventSave, self.moduleService);
                    }
                    self.unhideRightView();
                });
            // });
        }


        $scope._saveDoc = function _saveDoc() {
            var self = this;

            //will unhide in savePdpa()
            self.hideRightView();
            self._saveResource().then(function savedResource () {
                self.moduleService.tempNewResource = [];

                //add avatar before updateResource because we need to update an avatar information 
                //to resource needed to update
                // self._addAvatar().then(function processNewAvatar () {
                //     self.moduleService.newAvatarInfo = [];

                    self._updateResource().then(function updatedResource () {
                        self.moduleService.indexOfEditedResource = [];
                        self.moduleService.editedResourceMeta = [];
                        self.moduleService.editedResourceDocId = [];

                        self._deleteResource().then(function removedResource () {
                            self.moduleService.indexOfDeletedResource = [];
                            self.savePdpa();

                            // self.toggleLoadingRightView();
                        });
                    });
                // });
            });
        }

        // pdpaUIService.showOverview = true;



        // $scope.goToPDPADetail = function() {
        //     $scope.goToState('home.edit.document', {
        //         module: 'pdpa',
        //         id: pdpaUIService.docId
        //     });
        // }


        // $scope.saveDoc = function() {
        //     $scope.hidePopover();

        //     if (pdpaUIService.detail !== undefined && prospectUIService.detail !== undefined) {

        //         //create new document
        //         if (pdpaUIService.docId == "") {
        //             // save PDPA
        //             pdpaUIService.savePDPA(pdpaUIService.detail).then(function(data) {
        //                 if (pdpaUIService.errorList != undefined) {
        //                     $scope.errorSave = pdpaUIService.findElementInElement_V3(pdpaUIService.errorList, ['ipos-error-document:ErrorMessage']);
        //                     $scope.openMessageBar($scope.errorSave);
        //                 } else {
        //                     $scope.setValueToProspect();
        //                     prospectUIService.updateProspect(prospectUIService.docId, prospectUIService.detail).then(function() {
        //                         if (prospectUIService.errorList != undefined) {
        //                             $scope.errorSave = prospectUIService.findElementInElement_V3(prospectUIService.errorList, ['ipos-error-document:ErrorMessage']);
        //                             $scope.openMessageBar($scope.errorSave);
        //                         } else {
        //                             $scope.openMessageBar("Update Successful");
        //                         }

        //                     });
        //                 }
        //             });

        //         }
        //         //edit existing doc
        //         else {
        //             $scope.pdpaDocID = pdpaUIService.docId;
        //             $scope.prospectDocID = prospectUIService.docId;
        //             //call service to update
        //             pdpaUIService.updatePDPA($scope.pdpaDocID, pdpaUIService.detail).then(function() {
        //                 if (pdpaUIService.errorList != undefined) {
        //                     $scope.errorSave = pdpaUIService.findElementInElement_V3(pdpaUIService.errorList, ['ipos-error-document:ErrorMessage']);
        //                     $scope.openMessageBar($scope.errorSave);
        //                 } else {
        //                     $scope.setValueToProspect();
        //                     prospectUIService.updateProspect($scope.prospectDocID, prospectUIService.detail).then(function() {
        //                         if (prospectUIService.errorList != undefined) {
        //                             $scope.errorSave = prospectUIService.findElementInElement_V3(prospectUIService.errorList, ['ipos-error-document:ErrorMessage']);
        //                             $scope.openMessageBar($scope.errorSave);
        //                         } else {
        //                             $scope.openMessageBar("Update Successful");
        //                         }

        //                     });
        //                 }
        //             });
        //         }
        //     }
        // };

        // $scope.setValueToProspect = function() {
        //     $scope.prospectUIService.findElementInDetail_V3(['ipos-prospect:Pdpa'])['@refUid'] = pdpaUIService.docId;
        //     var pdpaChannel = $scope.moduleService.findElementInDetail_V3(['ipos-pdpa:CommunicationChannel']);
        //     var prospectPdpaChannel = $scope.prospectUIService.findElementInDetail_V3(['ipos-prospect:CommunicationChannel']);
        //     for (var i = 0; i < pdpaChannel.length; i++) {
        //         prospectPdpaChannel[i]['ipos-prospect:CommunicationChannelValue'].Value = pdpaChannel[i]['ipos-pdpa:CommunicationChannelValue'].Value;
        //     }
        //     $scope.prospectUIService.findElementInDetail_V3(['ipos-prospect:Pdpa', 'ipos-prospect:PromotionSubscription']).Value = $scope.moduleService.findElementInDetail_V3(['ipos-pdpa:Pdpa', 'ipos-pdpa:PromotionSubscription']).Value;
        //     $scope.prospectUIService.findElementInDetail_V3(['ipos-prospect:Pdpa', 'ipos-prospect:WitnessIdNumber']).Value = $scope.moduleService.findElementInDetail_V3(['ipos-pdpa:Pdpa', 'ipos-pdpa:WitnessIdNumber']).$;
        //     $scope.prospectUIService.findElementInDetail_V3(['ipos-prospect:Pdpa', 'ipos-prospect:WitnessName']).Value = $scope.moduleService.findElementInDetail_V3(['ipos-pdpa:Pdpa', 'ipos-pdpa:WitnessName']).$;
        // }

        // if ($scope.moduleService.docId == "") {
        //     $scope.moduleService.visible = false;
        // } else
        //     $scope.moduleService.visible = true;
        // $scope.toggleEdit = function() {
        //     $scope.moduleService.visible = !$scope.moduleService.visible;
        // };

        // $scope.moduleService.openMessageBar = $scope.openMessageBar;

        // $scope.showTags = function(ev) {
        //     $mdDialog.show({
        //         controller: 'TagsCtrl',
        //         templateUrl: 'templates/tags.html',
        //         targetEvent: ev,
        //         locals: {
        //             moduleService: $scope.moduleService
        //         },
        //     });
        // }

    });
