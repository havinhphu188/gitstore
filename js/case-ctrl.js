'use strict';
angular.module('iposApp').controller('CaseManagementListCtrl', function(
    $scope, $log, $translate, salecaseUIService
) {

    $scope.name = 'CaseManagementListCtrl';
    $scope.moduleService = salecaseUIService;

    //get theme color
    $scope.defaultThemeColor = localStorage.getItem('themeColor');

    // sort list prospect   
    $scope.sorting = function(card) {
        return this.moduleService.orderBy(card, 'UpdatedDate');
    };

    $scope.getDetail = function(docId, index) {
        // $scope.selectListOption(productName);
        this.openDocument(this.moduleService.name, docId, index);
    };

    //receive broadcast event (after list document is change)
    $scope.$on($scope.CONSTANTS.EVENT.UPDATED_LIST, function(event, args) {
        event.currentScope.loadMetaList();
    });

    //load prospect list when ctrl is called
    $scope.loadMetaList(true);

});


'use strict';
angular.module('iposApp').controller('CaseManagementOverviewCtrl', function(
    $scope, $log, salecaseUIService, prospectUIService, illustrationUIService
) {
    $scope.name = 'CaseManagementOverviewCtrl';
    $scope.moduleService = salecaseUIService;
    $scope.prospectUIService = prospectUIService;
    $scope.illustrationUIService = illustrationUIService;
    //get list propsect full
    if (prospectUIService.docListFull != undefined) {
        $scope.listProspect = prospectUIService.docListFull; // list of prospects
    } else {
        prospectUIService.loadMetaList().then(function afterLoadMetas() {
            $scope.listProspect = prospectUIService.docListFull; // list of prospects
        });
    }
    //get list Termlife full
    if (illustrationUIService.docListFull != undefined) {
        $scope.listTermlife = illustrationUIService.docListFull; // list of prospects
    } else {
        illustrationUIService.loadMetaList().then(function afterLoadMetas() {
            $scope.listTermlife = illustrationUIService.docListFull; // list of prospects
        });
    }

    //toggle BI & prospect
    $scope.prospectCase = true;
    $scope.prospectCaseNew = false;
    $scope.termlifeCase = false;
    $scope.cnew = false;
    $scope.create = function() {
        $scope.cnew = !$scope.cnew;
    }
    $scope.toggleCollapseCase = function() {
        $scope.prospectCase = !$scope.prospectCase;
    }
     $scope.toggleCollapseCaseNew = function() {
        $scope.prospectCaseNew = !$scope.prospectCaseNew;
    }
    $scope.toggleCollapseCaseBI = function() {
        $scope.termlifeCase = !$scope.termlifeCase;
    }

    $scope.addNewProspect = function(prospectId) {
        var propsectsLenght = $scope.moduleService.prospects.length;
        var firstProspectId = $scope.moduleService.prospects[0]['@refUid'];
         if (firstProspectId == "") {
             $scope.moduleService.prospects[0]['@refUid'] = prospectId;
         } else {
            $scope.moduleService.addElementToArrayInDetail(['ipos-case-management-term-life:Prospects', 'ipos-case-management-term-life:Prospect'], $scope.moduleService.emptyPropsectTemplate);
            $scope.moduleService.prospects[propsectsLenght]['@refUid'] = prospectId;
         }
    }
});


'use strict';
angular.module('iposApp').controller('CaseManagementHeaderCtrl', function(
        //form 3rd plugins
        $scope, $mdDialog, $translate,

        //from our project
        salecaseUIService, resourceUIService, commonService
    )

    {

        $scope.name = 'CaseManagementHeaderCtrl';

        $scope.moduleService = salecaseUIService;

        $scope.reset = function() {
            alert("Not yet implemented");
        }
        

        /**
         * Do save & update
         * @return {[type]} [description]
         */
        $scope.saveCase = function saveCase () {
            var self = this;
            var saveFunc = undefined;
            var eventSave = undefined;
            var message = undefined;

            //create new one
            if (!self.moduleService.docId) {
                saveFunc = self.moduleService.saveCase;
                eventSave = commonService.CONSTANTS.EVENT.SAVED_DOCUMENT;
                message = "Saved Successfully";
            }
            //update existing one
            else{                
                saveFunc = self.moduleService.updateCase;
                eventSave = commonService.CONSTANTS.EVENT.UPDATED_DOCUMENT;
                message = "Updated Successfully";
            }

            saveFunc.call(self.moduleService).then(function editedCase(data) {
                if (self.moduleService.errorList != undefined) {
                    self.errorSave = self.moduleService.findElementInElement_V3(prospectUIService.errorList, ['ipos-error-document:ErrorMessage']);
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
        }

        $scope.saveDoc = function saveDoc() {
            var self = this;

            //will unhide in saveCase()
            self.hideRightView();
            self._saveResource().then(function savedResource () {
                self.moduleService.tempNewResource = [];

                self._updateResource().then(function updatedResource () {
                    self.moduleService.indexOfEditedResource = [];
                    self.moduleService.editedResourceMeta = [];
                    self.moduleService.editedResourceDocId = [];

                    self._deleteResource().then(function removedResource () {
                        self.moduleService.indexOfDeletedResource = [];

                        self.saveCase();
                    });
                });
            });
        }

        $scope.getComputedDetail = function getComputedDetail() {
            var self = this;
            self.hideRightView();
            self.moduleService.loadComputedDetail().then(function afterLoadComputedDoc() {
                self.refreshContent();
                self.unhideRightView();
            });
        };
    }
);
