'use strict';
angular.module('iposApp').controller('ApplicationListCtrl', function(
    //form 3rd plugins
    $scope, $mdDialog,

    //from our project
    prospectUIService, applicationUIService) {

    $scope.name = 'ApplicationListCtrl';
    $scope.moduleService = applicationUIService;
    $scope.showProductList = function(ev) {
        $mdDialog.show({
            controller: 'ProductListCtrl',
            templateUrl: 'templates/product_list.html',
            targetEvent: ev,
            locals: {
                parentScope: $scope
            },
        }).then(function(productName) {
            // change module service to use for each product
            switch (productName) {
                case "term-life-protect":
                    $scope.moduleService = illustrationUIService;
                    break;
                case "motor-sompo":
                    $scope.moduleService = applicationUIService;
                    break;
            }
            // 'term-life-protect'
            // $scope.moduleService = applicationUIService;
            $scope.createNewDoc(productName);
        });
    }

    $scope.getDetail = function(docId, index, productName) {
        $scope.openDocument(applicationUIService.name, docId, index, productName);
    };

    //receive broadcast event (after list document is change)
    $scope.$on($scope.CONSTANTS.EVENT.UPDATED_LIST, function(event, args) {
        event.currentScope.loadMetaList();
    });

    $scope.loadMetaList(true);

});


'use strict';
//illustration edit
angular.module('iposApp').controller('ApplicationOverviewCtrl', function(
    //form 3rd plugins
    $scope, $translate,

    //from our project
    applicationUIService, prospectUIService, illustrationUIService, commonService
) {

    $scope.moduleService = applicationUIService;
    $scope.prospectUIService = prospectUIService;
    $scope.illustrationUIService = illustrationUIService;
    //generate variables for application
    $scope.variables = applicationUIService.variables;
    $scope.PORefUid = $scope.moduleService.findElementInDetail_V3(['ipos-application-motor-sompo:ApplicationMotor', 'ipos-application-motor-sompo:PolicyOwnerInfo'])['@refUid'];
    $scope.illuRefUid = $scope.moduleService.findElementInDetail_V3(['ipos-application-motor-sompo:ApplicationMotor', 'ipos-application-motor-sompo:Illustration'])['@refUid'];

    if (prospectUIService.docListFull != undefined) {
        $scope.listProspect = prospectUIService.docListFull; // list of prospects
    } else {
        prospectUIService.loadMetaList().then(function afterLoadMetas() {
            $scope.listProspect = prospectUIService.docListFull; // list of prospects
        });
    }

    if (illustrationUIService.docListFull != undefined) {
        $scope.listIllustration = illustrationUIService.docListFull; // list of prospects
    } else {
        illustrationUIService.loadMetaList().then(function afterLoadMetas() {
            $scope.listIllustration = illustrationUIService.docListFull; // list of prospects
        });
    }
    $scope.addNewContact = function() {
        $scope.moduleService.addElementToArrayInDetail(['ipos-application-motor-sompo:Contacts', 'ipos-application-motor-sompo:Contact'], $scope.moduleService.emptyContactTemplate);
    }

    $scope.addNewAddress = function() {
        $scope.moduleService.addElementToArrayInDetail(['ipos-application-motor-sompo:Addresses', 'ipos-application-motor-sompo:Address'], $scope.moduleService.emptyAddressTemplate);
    }

    $scope.addNewDriver = function() {
        $scope.moduleService.addElementToArrayInDetail(['ipos-application-motor-sompo:OtherDrivers', 'ipos-application-motor-sompo:OtherDriver'], $scope.moduleService.emptyDriverTemplate);        
    }

    $scope.removeContact = function(index) {
        $scope.moduleService.removeElementFromArrayInDetail(['ipos-application-motor-sompo:Contacts', 'ipos-application-motor-sompo:Contact'], index);
    }

    $scope.removeAddress= function(index) {
        $scope.moduleService.removeElementFromArrayInDetail(['ipos-application-motor-sompo:Addresses', 'ipos-application-motor-sompo:Address'], index);
    }

    $scope.removeDriver = function(index) {
        $scope.moduleService.removeElementFromArrayInDetail(['ipos-application-motor-sompo:OtherDrivers', 'ipos-application-motor-sompo:OtherDriver'], index);
    }

    $scope.getDetail = function(policyOwnerRefUid) {
        prospectUIService.loadDetail(policyOwnerRefUid).then(function() {
            $scope.setValueForPolicyOwnerInfo(policyOwnerRefUid);
        });
    }

    $scope.getDriverDetail = function(driverRefUid, index) {
        prospectUIService.loadDetail(driverRefUid).then(function() {
            $scope.setValueForDriver(index, driverRefUid);
        });
    }

    $scope.getIlluDetail = function(illuRefUid) {
        illustrationUIService.loadDetail(illuRefUid).then(function() {
            $scope.setValueForIllustrationInfo(illuRefUid);
        });
    }

    $scope.setValueForIllustrationInfo = function(illuRefUid) {
        $scope.moduleService.findElementInDetail_V3(['ipos-application-motor-sompo:ApplicationMotor', 'ipos-application-motor-sompo:Illustration'])['@refUid'] = illuRefUid;
        $scope.variables.CoverageType.Value = $scope.illustrationUIService.findElementInDetail_V3(['ipos-illustration-motor-sompo:CoverageType']).Value;
        $scope.variables.SumInsured.$ = $scope.illustrationUIService.findElementInDetail_V3(['ipos-illustration-motor-sompo:PaymentPremium', 'ipos-illustration-motor-sompo:SumInsured']).$;
        $scope.variables.AnnualPremium.$ = $scope.illustrationUIService.findElementInDetail_V3(['ipos-illustration-motor-sompo:PaymentPremium', 'ipos-illustration-motor-sompo:AnunualPremium']).$;
        $scope.variables.Premium.$ = $scope.illustrationUIService.findElementInDetail_V3(['ipos-illustration-motor-sompo:PaymentPremium', 'ipos-illustration-motor-sompo:TotalPayable']).$;
        $scope.variables.OptionalExtraCoverage.Value = $scope.illustrationUIService.findElementInDetail_V3(['ipos-illustration-motor-sompo:OptionalCoverage', 'ipos-illustration-motor-sompo:OptionalExtraCoverage']).Value;
        $scope.variables.OptionalSumInsured.$ = $scope.illustrationUIService.findElementInDetail_V3(['ipos-illustration-motor-sompo:OptionalCoverage', 'ipos-illustration-motor-sompo:OptionalSumInsured']).$;
        $scope.variables.OptionalPremium.$ = $scope.illustrationUIService.findElementInDetail_V3(['ipos-illustration-motor-sompo:OptionalCoverage', 'ipos-illustration-motor-sompo:OptionalPremium']).$;

    }

    $scope.setValueForPolicyOwnerInfo = function(PORefUid) {
        $scope.moduleService.findElementInDetail_V3(['ipos-application-motor-sompo:ApplicationMotor', 'ipos-application-motor-sompo:PolicyOwnerInfo'])['@refUid'] = PORefUid;
        $scope.variables.Title.Value = $scope.prospectUIService.findElementInDetail_V3(['ipos-prospect:Person', 'ipos-prospect:Title']).Value;
        $scope.variables.FullName.$ = $scope.prospectUIService.findElementInDetail_V3(['ipos-prospect:Person', 'ipos-prospect:FullName']).$;
        $scope.variables.BirthDate.$ = $scope.prospectUIService.findElementInDetail_V3(['ipos-prospect:Person', 'ipos-prospect:BirthDate']).$;
        $scope.variables.Gender.Value = $scope.prospectUIService.findElementInDetail_V3(['ipos-prospect:Person', 'ipos-prospect:Gender']).Value;
        $scope.variables.MarStat.Value = $scope.prospectUIService.findElementInDetail_V3(['ipos-prospect:Person', 'ipos-prospect:MarStat']).Value;
        $scope.variables.SmokerStat.Value = $scope.prospectUIService.findElementInDetail_V3(['ipos-prospect:Person', 'ipos-prospect:SmokerStat']).Value;
        $scope.variables.Industry.Value = $scope.prospectUIService.findElementInDetail_V3(['ipos-prospect:Person', 'ipos-prospect:BusinessIndustry']).Value;
        $scope.variables.Occupation.Value = $scope.prospectUIService.findElementInDetail_V3(['ipos-prospect:Person', 'ipos-prospect:Occupation']).Value;
        $scope.variables.ReferralType.Value = $scope.prospectUIService.findElementInDetail_V3(['ipos-prospect:Person', 'ipos-prospect:ReferralType']).Value;
        $scope.variables.Referrer.$ = $scope.prospectUIService.findElementInDetail_V3(['ipos-prospect:Person', 'ipos-prospect:Referrer']).$;
        $scope.variables.Race.Value = $scope.prospectUIService.findElementInDetail_V3(['ipos-prospect:Person', 'ipos-prospect:Race']).Value;
        $scope.variables.Nationality.Value = $scope.prospectUIService.findElementInDetail_V3(['ipos-prospect:Person', 'ipos-prospect:Nationality']).Value;
        $scope.variables.NewICNo.$ = $scope.prospectUIService.findElementInDetail_V3(['ipos-prospect:Person', 'ipos-prospect:NewICNo']).$;
        $scope.variables.OldICNo.$ = $scope.prospectUIService.findElementInDetail_V3(['ipos-prospect:Person', 'ipos-prospect:OldICNo']).$;
        $scope.variables.Staff.Value = $scope.prospectUIService.findElementInDetail_V3(['ipos-prospect:Person', 'ipos-prospect:Staff']).Value;
        $scope.variables.Vip.Value = $scope.prospectUIService.findElementInDetail_V3(['ipos-prospect:Person', 'ipos-prospect:Vip']).Value;
        $scope.variables.YearDrivingLicenceObtained.$ = $scope.prospectUIService.findElementInDetail_V3(['ipos-prospect:Person', 'ipos-prospect:YearDrivingLicenceObtained']).$;
    }

    $scope.setValueForDriver = function(index, driverRefUid) {
        $scope.moduleService.drivers[index]['@refUid'] = driverRefUid;
        $scope.moduleService.findElementInElement_V3($scope.moduleService.drivers[index], ['ipos-application-motor-sompo:Salutation']).Value = $scope.prospectUIService.findElementInDetail_V3(['ipos-prospect:Person', 'ipos-prospect:Title']).Value;
        $scope.moduleService.findElementInElement_V3($scope.moduleService.drivers[index], ['ipos-application-motor-sompo:FullName']).$ = $scope.prospectUIService.findElementInDetail_V3(['ipos-prospect:Person', 'ipos-prospect:FullName']).$;
        $scope.moduleService.findElementInElement_V3($scope.moduleService.drivers[index], ['ipos-application-motor-sompo:BirthDate']).$ = $scope.prospectUIService.findElementInDetail_V3(['ipos-prospect:Person', 'ipos-prospect:BirthDate']).$;
        $scope.moduleService.findElementInElement_V3($scope.moduleService.drivers[index], ['ipos-application-motor-sompo:Gender']).Value = $scope.prospectUIService.findElementInDetail_V3(['ipos-prospect:Person', 'ipos-prospect:Gender']).Value;
        $scope.moduleService.findElementInElement_V3($scope.moduleService.drivers[index], ['ipos-application-motor-sompo:NewICNo']).$ = $scope.prospectUIService.findElementInDetail_V3(['ipos-prospect:Person', 'ipos-prospect:NewICNo']).$;
        $scope.moduleService.findElementInElement_V3($scope.moduleService.drivers[index], ['ipos-application-motor-sompo:OldICNo']).$ = $scope.prospectUIService.findElementInDetail_V3(['ipos-prospect:Person', 'ipos-prospect:OldICNo']).$;
        $scope.moduleService.findElementInElement_V3($scope.moduleService.drivers[index], ['ipos-application-motor-sompo:YearDrivingLicenceObtained']).$ = $scope.prospectUIService.findElementInDetail_V3(['ipos-prospect:Person', 'ipos-prospect:YearDrivingLicenceObtained']).$;
        $scope.moduleService.findElementInElement_V3($scope.moduleService.drivers[index], ['ipos-application-motor-sompo:Occupation']).Value = $scope.prospectUIService.findElementInDetail_V3(['ipos-prospect:Person', 'ipos-prospect:Occupation']).Value;
    }

});


'use strict';
angular.module('iposApp').controller('ApplicationHeaderCtrl', function(
    //form 3rd plugins
    $scope, $mdDialog,

    //from our project
    applicationUIService, commonService
) {
    $scope.moduleService = applicationUIService;

    $scope.save = function() {
        if (applicationUIService.detail !== undefined) {
            //create new document
            if (applicationUIService.docId == "") {
                applicationUIService.saveApplication(commonService.CONSTANTS.MODULE_NAME.APPLICATION, "motor-sompo").then(function(data) {
                    if (applicationUIService.errorList != undefined) {
                        self.errorSave = applicationUIService.findElementInElement_V3(applicationUIService.errorList, ['ipos-error-document:ErrorMessage']);
                        self.openMessageBar($scope.errorSave);
                    } else {
                        self.openMessageBar("Saved Successfully");

                        //broadcast to others that metadata list has been updated
                        self.broadcastEvent(commonService.CONSTANTS.EVENT.UPDATED_LIST);

                        //broadcast to others that document has been saved
                        self.broadcastEvent(commonService.CONSTANTS.EVENT.SAVED_DOCUMENT, self.moduleService);
                    }
                });
            }
            //edit existing doc
            else {
                applicationUIService.updateApplication(commonService.CONSTANTS.MODULE_NAME.APPLICATION, "motor-sompo").then(function() {
                    if (applicationUIService.errorList != undefined) {
                        self.errorSave = applicationUIService.findElementInElement_V3(applicationUIService.errorList, ['ipos-error-document:ErrorMessage']);
                        self.openMessageBar($scope.errorSave);
                    } else {
                        self.openMessageBar("Updated Successfully");

                        //broadcast to others that metadata list has been updated
                        self.broadcastEvent(commonService.CONSTANTS.EVENT.UPDATED_LIST);

                        //broadcast to others that document has been updated
                        self.broadcastEvent(commonService.CONSTANTS.EVENT.UPDATED_DOCUMENT, self.moduleService);
                    
                    }
                });
            }

        }
    }

    $scope.getComputedDetail = function() {
        var self = this;
        self.hideRightView();
        applicationUIService.loadComputedDetail("motor-sompo").then(function afterLoadComputedDoc() {
            self.refreshContent();
            self.unhideRightView();
        });
    };
});
