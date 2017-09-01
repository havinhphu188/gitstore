'use strict';
angular.module('iposApp').controller('TestListCtrl', function(
    $scope, $log, $translate, prospectUIService
) {

    $scope.name = 'TestListCtrl';
    $scope.moduleService = prospectUIService;

    //get theme color
    $scope.defaultThemeColor = localStorage.getItem('themeColor');

    // $scope.testxml = function() {
    //     $http.get("ssss.xml").success(function(data) {
    //         var text2 = data.replace(/xmlns=\".*\"(.*)/g, ">");
    //         text2 = $scope.replaceAll(text2, "ipos-illustration:", "");
    //         text2 = $scope.replaceAll(text2, "ipos-exchangerate-information:", "");
    //         text2 = $scope.replaceAll(text2, "ipos-illustration-common:", "");
    //         text2 = $scope.replaceAll(text2, "ipos-product-information:", "");
    //         console.log(text2);
    //     });
    // }

    // $scope.replaceAll = function(data, search, replace) {
    //         //if replace is null, return original string otherwise it will
    //         //replace search string with 'undefined'.

    //         return data.replace(new RegExp(search, 'g'), replace);
    //     }


    // $scope.toggleStarred = function(starred, docId) {
    //        var self = prospectUIService;
    //        self.docId = docId;
    //        var productName = prospectUIService.getProductLogicName();
    //        prospectUIService.toggleStarredDocument(starred, productName);
    //    };
    // sort list prospect   
    $scope.sorting = function(card) {
        return $scope.moduleService.orderBy(card, 'UpdatedDate');
    };

    //the selected index to change selected card class
    $scope.getDetail = function(docId, index) {
        var promise = $scope.openDocument(prospectUIService.name, docId, index);

        //if there will be new data
        if (promise) {
            promise.then(function openedDoc(argument) {
                if ($scope.moduleService.variables.Gender.Value) {
                    $translate('v3.application.motor.gender.' + $scope.moduleService.variables.Gender.Value).then(
                        function(translatedValue) {
                            $scope.prospectGender = translatedValue;
                        }
                    );
                }
            });
        }
    };


    //receive broadcast event (after list document is change)
    $scope.$on($scope.CONSTANTS.EVENT.UPDATED_LIST, function(event, args) {
        event.currentScope.loadMetaList();
    });

    //load prospect list when ctrl is called
    $scope.loadMetaList(true);
});


'use strict';
angular.module('iposApp').controller('TestOverviewCtrl', function(
    $scope, $log, prospectUIService, resourceUIService, $mdSidenav, $mdUtil
) {
    $scope.name = 'TestOverviewCtrl';
    $scope.filesList = [];
    $scope.moduleService = prospectUIService;

    //set variables for prospect
    $scope.variables = prospectUIService.variables;

    


    $scope.openChooseAvatarModal = function chooseAvatar(argument) {
        if ($scope.moduleService.isEditMode)
            $scope.showAttachment('image');
    }

    $scope.isFieldEmpty = function(value){
        if($scope.moduleService.isEditMode && value)
            // this.vars.bIsContentChanged  = true;
            return false;
        return true;
    }

    // //choose avatar
    //  $scope.clearFieldData = function(field) {
    //    field = "";
    // };

    // //choose avatar
    //  $scope.avatarSelect = function(window) {
    //     var fileList = window.files;
    //     $scope.filesList.push(fileList[0]);
    //     // $scope.bIsListChanged = true;
    // };

    // //upload avatar
    // $scope.uploadAvatar = function() {
    //     var reader = new FileReader();
    //     reader.onload = function() {
    //         var binaryString = reader.result; //base64 encoded string
    //         var based64Data = binaryString.split(',')[1];  //base64 encoded string      
    //         $scope.moduleService.attachFile(file, based64Data);
    //     };
    //     //start to read data stream
    //     reader.readAsDataURL($scope.filesList.pop());
    // };

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

    $scope.testFunction = function() {
        var fullname1 = $scope.testFunctionV2(['ipos-prospect:FullName']).$;
        var title1 = $scope.testFunctionV2(['ipos-prospect:Gender']).Value;
        var age1 = $scope.testFunctionV2(['ipos-prospect:Age']).$;
        var smokeStat1 = $scope.testFunctionV2(['ipos-prospect:SmokerStat']).Value;

        var fullname2 = $scope.testFunctionV2_noRecursive(['ipos-prospect:FullName']).$;
        var title2 = $scope.testFunctionV2_noRecursive(['ipos-prospect:Gender']).Value;
        var age2 = $scope.testFunctionV2_noRecursive(['ipos-prospect:Age']).$;
        var smokeStat2 = $scope.testFunctionV2_noRecursive(['ipos-prospect:SmokerStat']).Value;

        var fullname3 = $scope.testFunctionV3('$..ipos-prospect:FullName').$;
        var title3 = $scope.testFunctionV3('$..ipos-prospect:Gender').Value;
        var age3 = $scope.testFunctionV3('$..ipos-prospect:Age').$;
        var smokeStat3 = $scope.testFunctionV3('$..ipos-prospect:SmokerStat').Value;
        $log.debug("V2: " + title1 + ", " + fullname1 + ", " + age1 + ", " + smokeStat1);
        $log.debug("V2-wRecursive: " + title2 + ", " + fullname2 + ", " + age2 + ", " + smokeStat2);
        $log.debug("V3: " + title3 + ", " + fullname3 + ", " + age3 + ", " + smokeStat3);

    }

    $scope.testFunctionV2 = function(path) {
        var start = new Date().getTime();
        for (var i = 0; i < 50000; i++) {
            $scope.v2 = $scope.moduleService.findElementInDetail_V3(path);
        }
        var end = new Date().getTime();
        var time = end - start;
        $log.debug("Running: " + path + " took " + time + " ms");
        return $scope.v2;
    }

    $scope.testFunctionV2_noRecursive = function(path) {
        var start = new Date().getTime();
        for (var i = 0; i < 50000; i++) {
            $scope.v2 = $scope.moduleService.findElementInElement_V3_noRecursive($scope.moduleService.detail, path);
        }
        var end = new Date().getTime();
        var time = end - start;
        $log.debug("Running: " + path + " took " + time + " ms");
        return $scope.v2;
    }

    $scope.testFunctionV3 = function(jspath) {
            var start = new Date().getTime();
            for (var i = 0; i < 50000; i++) {
                $scope.v3 = $scope.moduleService.findElementInDetailByJsonPath(jspath);
            }
            var end = new Date().getTime();
            var time = end - start;
            $log.debug("Running: " + jspath + " took " + time + " ms");
            return $scope.v3;
        }
        //add new id 
    $scope.addNewID = function() {
        //add 1 more ID template to current IDs
        if ($scope.moduleService.isEditMode) {
            $scope.moduleService.addElementToArrayInDetail(['ipos-prospect:IDs', 'ipos-prospect:ID'], $scope.moduleService.emptyIdsTemplate);
            //get IDs length to set counter for IDs after add 1 ID
            var idLength = $scope.moduleService.iDs.length;
            $scope.moduleService.findElementInElement_V3($scope.moduleService.detail, ['ipos-prospect:IDs'])['@counter'] = idLength;
        }
    }

    $scope.addNewContact = function() {
        if ($scope.moduleService.isEditMode) {
            $scope.moduleService.addElementToArrayInDetail(['ipos-prospect:Contacts', 'ipos-prospect:Contact'], $scope.moduleService.emptyContactTemplate);
            var contactLength = $scope.moduleService.contacts.length;
            $scope.moduleService.findElementInElement_V3($scope.moduleService.detail, ['ipos-prospect:Contacts'])['@counter'] = contactLength;
        }
    }

    $scope.addNewAddress = function() {
        if ($scope.moduleService.isEditMode) {
            $scope.moduleService.addElementToArrayInDetail(['ipos-prospect:Addresses', 'ipos-prospect:Address'], $scope.moduleService.emptyAddressTemplate);
            var addressLength = $scope.moduleService.addresses.length;
            $scope.moduleService.findElementInElement_V3($scope.moduleService.detail, ['ipos-prospect:Addresses'])['@counter'] = addressLength;
        }
    }

    $scope.removeID = function(index) {
        if ($scope.moduleService.isEditMode) {
            $scope.moduleService.removeElementFromArrayInDetail(['ipos-prospect:IDs', 'ipos-prospect:ID'], index);
            var idLength = $scope.moduleService.iDs.length;
            $scope.moduleService.findElementInElement_V3($scope.moduleService.detail, ['ipos-prospect:IDs'])['@counter'] = idLength;
        }
    }

    $scope.removeContact = function(index) {
        if ($scope.moduleService.isEditMode) {
            $scope.moduleService.removeElementFromArrayInDetail(['ipos-prospect:Contacts', 'ipos-prospect:Contact'], index);
            var contactLength = $scope.moduleService.contacts.length;
            $scope.moduleService.findElementInElement_V3($scope.moduleService.detail, ['ipos-prospect:Contacts'])['@counter'] = contactLength;
        }
    }

    $scope.removeAddress = function(index) {
        if ($scope.moduleService.isEditMode) {
            $scope.moduleService.removeElementFromArrayInDetail(['ipos-prospect:Addresses', 'ipos-prospect:Address'], index);
            var addressLength = $scope.moduleService.addresses.length;
            $scope.moduleService.findElementInElement_V3($scope.moduleService.detail, ['ipos-prospect:Addresses'])['@counter'] = addressLength;
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

    // $scope.updateCommunicationChannelCheckboxs = function(channelIndex) {
    //     var communicationChanels = $scope.moduleService.findElementInDetail_V3(['ipos-prospect:CommunicationChannel']);
    //     var allChannel = $scope.moduleService.findElementInElement_V3(communicationChanels[communicationChanels.length - 1], ['ipos-prospect:CommunicationChannelValue']).Value;
    //     if (channelIndex == (communicationChanels.length - 1)) {
    //         for (var i = 0; i < (communicationChanels.length - 1); i++) {
    //             $scope.moduleService.findElementInElement_V3(communicationChanels[i], ['ipos-prospect:CommunicationChannelValue']).Value = allChannel;
    //         }
    //     } else {
    //         var isAllSelected = true;
    //         for (var i = 0; i < (communicationChanels.length - 1); i++) {
    //             var channel = $scope.moduleService.findElementInElement_V3(communicationChanels[i], ['ipos-prospect:CommunicationChannelValue']).Value;
    //             if (channel == 'N' || channel == '') {
    //                 isAllSelected = false;
    //                 break;
    //             }
    //         }
    //         if (isAllSelected) {
    //             $scope.moduleService.findElementInElement_V3(communicationChanels[communicationChanels.length - 1], ['ipos-prospect:CommunicationChannelValue']).Value = 'Y';
    //         } else {
    //             $scope.moduleService.findElementInElement_V3(communicationChanels[communicationChanels.length - 1], ['ipos-prospect:CommunicationChannelValue']).Value = 'N';
    //         }
    //     }
    // };
    $scope.delFile = function(index) {
        $scope.moduleService.attachments.splice(index, 1);
    };

    $scope.filesMeta = []; //store files meta  
    $scope.showImgPickerEdit = function(index) {
        if(index != undefined)
            $scope.moduleService.resourceEditIndex = index;
        $scope.moduleService.callAction('SHOW_IMAGE_PICKER').then(function hadImgsInfor (response) {
            $scope.fileEdit = response;
            $scope.filesMeta.concat(response.map(
                function(file) {//convert to array of object: {value: code, text: translated, group: group}
                    file.name = file.FileName;
                    file.size = file.FileSize;
                    file.createdDate = file.DateTime;
                    return file;
                })
            );

            //init 
            $scope.imgNeedToSave = [];
            for (var i = response.length - 1; i >= 0; i--) {
                $scope.imgNeedToSave.push(response[i].FileName);
            };  
            $scope.editResource();
        });
    };

    
    resourceUIService.resourceEditArr = [];
    $scope.addEditResource = function(resourceId, resourceDoc){
        var obj = {resourceId: resourceId, resourceDoc: resourceDoc};
        var resourceIdArr = $scope.getAllValueByKey(resourceUIService.resourceEditArr, 'resourceId');
        var idIndex = undefined;
        if(resourceIdArr){
            idIndex = resourceIdArr.indexOf(resourceId);
            if(idIndex != -1)
                resourceUIService.resourceEditArr[idIndex]['resourceDoc'] = resourceDoc;
            else 
                resourceUIService.resourceEditArr.push(obj);
        }else{
            resourceUIService.resourceEditArr.push(obj);
        }
        
    }

    $scope.getAllValueByKey = function(array, key){
        var valueArr = [];
        if(array.length > 0){
            for(var i = 0; i < array.length; i++){
                valueArr.push(array[i][key]);
            }
            return valueArr;
        }
        else
            return undefined;
        
    }
    $scope.editResource = function() {

        if ($scope.imgNeedToSave.length > 0) {
            var deferred = this.$q.defer();
            var self = this;
            //save resource files
            self.moduleService.callAction('RESOURCE_CREATE', [$scope.imgNeedToSave]).then(function hadImgsID(arrIds) {
              
                var attachments = self.moduleService.findElementInElement_V3(self.moduleService.detail, ['Attachments', 'Attachment']);
                var resourceEditId = attachments[self.moduleService.resourceEditIndex]['@refResourceUid'];

                resourceUIService.loadDetail(resourceEditId).then(function hasResourceEditDoc(doc){
                    self.moduleService.findElementInElement_V3(doc, ['ipos-resource-file:FileUid']).$ = arrIds[0];
                    self.moduleService.findElementInElement_V3(doc, ['ipos-resource-file:Name']).$ = $scope.fileEdit[0].FileName;
                    self.moduleService.findElementInElement_V3(doc, ['ipos-resource-file:FileName']).$ = $scope.fileEdit[0].FileName;
                    self.moduleService.findElementInElement_V3(doc, ['ipos-resource-file:DateTime']).$ = $scope.fileEdit[0].DateTime;
                    self.moduleService.findElementInElement_V3(doc, ['ipos-resource-file:FileSize']).$ = $scope.fileEdit[0].FileSize;
                    //clone the updated doc because cannot set docId for resource detail
                    resourceUIService.detail = angular.copy(doc);
                    
                    self.moduleService.findElementInElement_V3(doc, ['DocInfo'])['DocId'] = resourceEditId;
                    $scope.addEditResource(resourceEditId, resourceUIService.detail);
                    self.moduleService.copInforFromResourceDocToAttachEle.call(self.moduleService, doc, attachments[self.moduleService.resourceEditIndex]);
                })

            });
            return deferred.promise;
        }

    }

    

});


'use strict';
angular.module('iposApp').controller('TestHeaderCtrl', function(
        //form 3rd plugins
        $scope, $mdDialog, $translate,

        //from our project
        prospectUIService, resourceUIService, commonService
    )

    {

        $scope.name = 'TestHeaderCtrl';

        $scope.moduleService = prospectUIService;

        $scope.reset = function() {
            $scope.moduleService.resetContent(commonService.CONSTANTS.MODULE_NAME.PROSPECT);
            $scope.moduleService.iDs = $scope.moduleService.findElementInDetail_V3(['ipos-prospect:IDs', 'ipos-prospect:ID']); // list of addresses
            $scope.moduleService.contacts = $scope.moduleService.findElementInDetail_V3(['ipos-prospect:Contacts', 'ipos-prospect:Contact']); // list of contacts
            $scope.moduleService.addresses = $scope.moduleService.findElementInDetail_V3(['ipos-prospect:Addresses', 'ipos-prospect:Address']); // list of addresses
            $scope.moduleService.tagList = angular.copy($scope.moduleService.tagListOriginal);
        }
        $scope.saveResource = function() {

            if ($scope.moduleService.imgNeedToSave.length > 0) {
                var deferred = this.$q.defer();
                var self = this;
                //save resource files
                self.moduleService.callAction('RESOURCE_CREATE', [$scope.moduleService.imgNeedToSave]).then(function hadImgsID(arrIds) {
                    //create resources doc
                    resourceUIService.createNewDocument().then(
                        function hasResourceDoc(doc) {
                            //remove unused objects ipos-resource-file:ResourceFile
                            // var resourceEle = self.moduleService.findElementInElement_V3(doc, ['ipos-resource-file:ResourceFile']);
                            // resourceEle = resourceEle.pop();
                            // doc.IposDocument.Data['ipos-resource-file:ResourceFile'] = resourceEle;

                            var promiseArr = [];
                            var resourceDocArr = [];
                            //create new resource docs and append information to document detail
                            for (var i = arrIds.length - 1; i >= 0; i--) {
                                var resourceDoc = angular.copy(doc);

                                self.moduleService.findElementInElement_V3(resourceDoc, ['ipos-resource-file:FileUid']).$ = arrIds[i];
                                self.moduleService.findElementInElement_V3(resourceDoc, ['ipos-resource-file:Name']).$ = $scope.moduleService.filesDisp[i].FileName;
                                self.moduleService.findElementInElement_V3(resourceDoc, ['ipos-resource-file:FileName']).$ = $scope.moduleService.filesDisp[i].FileName;
                                self.moduleService.findElementInElement_V3(resourceDoc, ['ipos-resource-file:DateTime']).$ = $scope.moduleService.filesDisp[i].DateTime;
                                self.moduleService.findElementInElement_V3(resourceDoc, ['ipos-resource-file:FileSize']).$ = $scope.moduleService.filesDisp[i].FileSize;

                                // self.moduleService.saveDocument(resourceDoc, ['resource-file']).then(
                                //     function hadResourceDoc (newResourceDoc) {
                                //         self.moduleService.appendAttachInforToDoc.call(self.moduleService, self.moduleService.detail, newResourceDoc);
                                //         //save current doc
                                //         self.moduleService.saveProspect();
                                //     }
                                // );

                                // //right now support for saving only 1 attachments;
                                // break;
                                resourceDocArr.push(resourceDoc);
                            };

                            angular.forEach(resourceDocArr, function(resourceDoc) {

                                var promise = resourceUIService.saveResourceDoc(resourceDoc);

                                promiseArr.push(promise);

                            });

                            // for (var i = resourceDocArr.length - 1; i >= 0; i--) {
                            //     promiseArr.push();
                            // };

                            self.moduleService.$q.all(promiseArr).then(function hadResourceDocs(savedResourceDocs) {
                                for (var i = savedResourceDocs.length - 1; i >= 0; i--) {
                                    self.moduleService.appendAttachInforToDoc.call(self.moduleService, self.moduleService.detail, savedResourceDocs[i]);
                                };
                                //save current doc
                                // self.moduleService.updateProspect();
                                $scope.moduleService.filesDisp = [];
                                $scope.moduleService.imgNeedToSave = [];
                                deferred.resolve(savedResourceDocs);
                            });

                        }
                    );


                });
                return deferred.promise;
            }

        }

        $scope.updateAllResource = function(resourceEditedArr){
            var deferred = this.$q.defer();
            var promiseArr = [];
            angular.forEach(resourceEditedArr, function(resource) {

                var promise = resourceUIService.updateResourceDoc(resource.resourceId, resource.resourceDoc);
                promiseArr.push(promise);

            });



            this.moduleService.$q.all(promiseArr).then(function hadUpdatedResourceDocs(updatedDoc) {
                resourceUIService.resourceEditArr = [];
                deferred.resolve(updatedDoc);
            });
            return deferred.promise;
        }

        // get list value of array containt object by key (this function is duplicate with function in ProspectOverviewCtrl)
        $scope.getAllValueByKey = function(array, key){
            var valueArr = [];
            if(array.length > 0){
                for(var i = 0; i < array.length; i++){
                    valueArr.push(array[i][key]);
                }
                return valueArr;
            }
            else
                return undefined;
            
        }

        resourceUIService.resourceToDeleteId = [];
        $scope.deleteResource = function(resourceToDeleteId){
            var docId = $scope.moduleService.docId;
            $scope.prepareDataToDeleteAndUpdateResource(resourceToDeleteId, resourceUIService.resourceEditArr);
            if (resourceToDeleteId.length > 0) {
                var deferred = this.$q.defer();
                var promiseArr = [];
                angular.forEach(resourceToDeleteId, function(resourceToDelete) {
                    var promise = resourceUIService.deleteAttachment(docId, resourceToDelete.resourceContentId, resourceToDelete.resourceId);
                    promiseArr.push(promise);

                });
                this.moduleService.$q.all(promiseArr).then(function hadDeletedResource(deletedDoc) {
                    deferred.resolve(deletedDoc);
                });
                return deferred.promise;
            }
        }

        // prepare resource to delete by compare them with resource to update 
        // to remove resource to update out of list if they are going to be deleted 
        $scope.prepareDataToDeleteAndUpdateResource = function(resourceIdToDelete, resourceToUpdate){
            if(resourceIdToDelete && resourceToUpdate){
                for(var i = 0; i < resourceToUpdate.length; i++) {
                    var obj = resourceToUpdate[i];

                    if(resourceIdToDelete['resourceId'].indexOf(obj.resourceId) !== -1) {
                        resourceToUpdate.splice(i, 1);
                        i--;
                    }
                }
            }
            
        }

        $scope.getResourceToDelete = function(){
            var originalAttachments = $scope.moduleService.originalAttachments;
            var attachments = $scope.moduleService.attachments;
            var originalAttachmentsList = $scope.getListAttachmentDocId(originalAttachments);
            var attachmentsList = $scope.getListAttachmentDocId(attachments);
            var attachmentsIdList = $scope.getAllValueByKey(attachmentsList, 'resourceId');
            var resourceToDeteleId = [];
            for(var i = 0; i < originalAttachmentsList.length; i++){
                if(attachmentsIdList.indexOf(originalAttachmentsList[i]['resourceId']) === -1)
                    resourceToDeteleId.push(originalAttachmentsList[i]);
            }
            return resourceToDeteleId;
        }

        $scope.getListAttachmentDocId = function(attachmentDoc){
            var idList = [];
            if(attachmentDoc){
                for(var i = 0; i < attachmentDoc.length; i++){
                    var obj = {resourceId: attachmentDoc[i]['@refResourceUid'], resourceContentId: attachmentDoc[i]['FileUid'].$}
                    idList.push(obj);
                }
            }
            return idList;
        }

        $scope.getListAttachmentDocId = function(attachmentDoc){
            var idList = [];
            if(attachmentDoc){
                for(var i = 0; i < attachmentDoc.length; i++){
                    var obj = {resourceId: attachmentDoc[i]['@refResourceUid'], resourceContentId: attachmentDoc[i]['FileUid'].$}
                    idList.push(obj);
                }
            }
            return idList;
        }

        /**
         * Do save & update
         * @return {[type]} [description]
         */
        $scope.saveProspect = function saveProspect () {
            var self = this;
            var saveFunc = undefined;
            var eventSave = undefined;
            var message = undefined;

            //create new one
            if (!prospectUIService.docId) {
                saveFunc = prospectUIService.saveProspect;
                eventSave = commonService.CONSTANTS.EVENT.SAVED_DOCUMENT;
                message = "Saved Successfully";
            }
            //update existing one
            else{                
                saveFunc = prospectUIService.updateProspect;
                eventSave = commonService.CONSTANTS.EVENT.UPDATED_DOCUMENT;
                message = "Updated Successfully";
            }

            saveFunc.call(prospectUIService).then(function savedProspect(data) {
                if (prospectUIService.errorList != undefined) {
                    self.errorSave = prospectUIService.findElementInElement_V3(prospectUIService.errorList, ['ipos-error-document:ErrorMessage']);
                    self.openMessageBar($translate.instant(self.errorSave));
                    $scope.refreshContent();//refresh content after save got error
                } else {
                    self.openMessageBar(message);
                     
                    //broadcast to others that metadata list has been updated
                    self.broadcastEvent(commonService.CONSTANTS.EVENT.UPDATED_LIST);

                    //broadcast to others that document has been saved
                    self.broadcastEvent(eventSave, self.moduleService);
                }
                self.toggleLoadingRightView();
            });
        }

        $scope.saveDoc = function() {
            var self = this;

            if (prospectUIService.detail !== undefined) {
                var resourceToDeleteId = $scope.getResourceToDelete();
                self.toggleLoadingRightView();

                //create new document
                if (!prospectUIService.docId) {
                    if ($scope.moduleService.imgNeedToSave && $scope.moduleService.imgNeedToSave.length > 0) {
                        $scope.saveResource().then(function afterSaveResource() {
                            self.saveProspect();
                        });
                    } else {
                        self.saveProspect();
                    }

                }
                //edit existing doc
                else {
                    if ($scope.moduleService.imgNeedToSave && $scope.moduleService.imgNeedToSave.length > 0) {

                        $scope.saveResource().then(function afterSaveResource() {

                            if(resourceToDeleteId.length > 0){
                                $scope.deleteResource(resourceToDeleteId).then(function afterDeleteResource(){
                                    if(resourceUIService.resourceEditArr.length > 0){
                                        $scope.updateAllResource(resourceUIService.resourceEditArr).then(function afterUpdateResource(){
                                            //call service to update
                                            self.saveProspect();
                                        })
                                    } else {
                                        //call service to update
                                        self.saveProspect();
                                    }
                                });
                            }else{
                                if(resourceUIService.resourceEditArr.length > 0){
                                    $scope.updateAllResource(resourceUIService.resourceEditArr).then(function afterUpdateResource(){
                                        //call service to update
                                        self.saveProspect();
                                    })
                                } else {
                                    //call service to update
                                    self.saveProspect();
                                }
                            }           
                        });
                    } else {
                        if(resourceToDeleteId.length > 0){
                            $scope.deleteResource(resourceToDeleteId).then(function afterDeleteResource(){
                                if(resourceUIService.resourceEditArr.length > 0){
                                    $scope.updateAllResource(resourceUIService.resourceEditArr).then(function afterUpdateResource(){
                                        //call service to update
                                        self.saveProspect();
                                    })
                                } else {
                                    //call service to update
                                    self.saveProspect();
                                }
                            });
                        }else{
                            if(resourceUIService.resourceEditArr.length > 0){
                                $scope.updateAllResource(resourceUIService.resourceEditArr).then(function afterUpdateResource(){
                                    //call service to update
                                    self.saveProspect();
                                })
                            } else {
                                //call service to update
                                self.saveProspect();
                            }
                        }
                        
                    }
                }

            }
        };

        $scope.getComputedDetail = function() {
            var self = this;
            self.toggleLoadingRightView();
            prospectUIService.loadComputedDetail().then(function afterLoadComputedDoc() {
                self.refreshContent();
                self.toggleLoadingRightView();
            });
        };


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

        $scope.goToPortrait = function() {
            if (Math.abs(window.orientation) === 180 || Math.abs(window.orientation) === 0) {
                $scope.goToState('home.side_bar.left_right.portrait.list', {
                    moduleName: commonService.CONSTANTS.MODULE_NAME.PROSPECT
                });
            } else {
                $scope.goToState('home.side_bar.left_right.list', {
                    moduleName: commonService.CONSTANTS.MODULE_NAME.PROSPECT
                });
            }
        }

    }
);
