// 'use strict';
// angular.module('iposApp').controller('QuotationListCtrl', function(
//     //form 3rd plugins
//     $scope, $mdDialog, $filter, $http,
//     //from our project
//     prospectUIService, quotationUIService, connectService, commonService, workerService) {
//     $scope.searchBox = {};
//     //show searchbox
//     //show searchbox css


//     $scope.connectService = connectService;
//     $scope.moduleService = quotationUIService;
//     $scope.prospectUIService = prospectUIService;


//     $scope.showProduct = function(ev) {
//         $mdDialog.show({
//             controller: 'ProductTemplateListCtrl',
//             templateUrl: 'templates/product_template_list.html',
//             targetEvent: ev,
//         });
//     }
//     $scope.getDetail = function(docId, index) {
//             $scope.loadDetail(docId, index);
//         }
//         //load illustration list
//     if (quotationUIService.quotationDocListFull == undefined) {
//         $scope.progressBar = false;
//         quotationUIService.loadQuotationList(commonService.CONSTANTS.MODULE_NAME.QUOTATION).then(function() {
//             $scope.progressBar = true;
//             if (quotationUIService.quotationDocListFull != undefined) {
//                 //list of ten first illustration
//                 $scope.listQuotation = quotationUIService.listDisplayQuotation;
//             } else {
//                 $scope.listQuotation = [{
//                     name: 'Testing case',
//                     age: 25,
//                     gender: 'boy'
//                 }];
//             }
//         });
//     } else {
//         $scope.progressBar = true;
//         if (quotationUIService.quotationDocListFull != undefined) {
//             $scope.listQuotation = quotationUIService.listDisplayQuotation;
//         } else {
//             $scope.listQuotation = [{
//                 name: 'Testing case',
//                 age: 25,
//                 gender: 'boy'
//             }];
//         }
//     };
//     // pull to refresh
//     $scope.PullToRefreshBar = true;
//     $scope.doRefresh = function() {
//         $scope.PullToRefreshBar = false;
//         quotationUIService.loadQuotationList(commonService.CONSTANTS.MODULE_NAME.QUOTATION).then(function() {
//                 $scope.listQuotation = quotationUIService.listDisplayQuotation;
//                 $scope.PullToRefreshBar = true;
//             })
//             .finally(function() {
//                 // Stop the ion-refresher from spinning
//                 $scope.$broadcast('scroll.refreshComplete');
//             });
//     };

//     // infinit scroll
//     $scope.loadMore = function() {
//         if ($scope.listQuotation.length < quotationUIService.quotationDocListFull.length) {
//             $scope.listQuotation = quotationUIService.loadMoreDocList($scope.listQuotation, commonService.CONSTANTS.MODULE_NAME.QUOTATION);
//             $scope.$apply();

//         }
//         $scope.$broadcast('scroll.infiniteScrollComplete');

//     };
//     //search quotation
//     $scope.searchQuotation = function(searchValue) {
//         $scope.listLowerCase = $filter('lowercase')(quotationUIService.quotationDocListFull);
//         $scope.listQuotation = $filter('filter')($scope.listLowerCase, searchValue);
//     };

//     $scope.customSort = function(card) {
//         $scope.moduleService.findValueInMapListByKey(card, 'EffectiveDate');
//     };



//     //
//     quotationUIService.goToDetailDocView = $scope.goToDetailDocView;
//     $scope.createIllustrationMotor = function() {
//         prospectUIService.progressBarOverview = true;
//         quotationUIService.createNewDocument(commonService.CONSTANTS.MODULE_NAME.QUOTATION, "motor-insurance").then(function(data) {
//             quotationUIService.goToDetailDocView(commonService.CONSTANTS.MODULE_NAME.QUOTATION);
//         });
//     };
//     quotationUIService.createIllustration = $scope.createIllustration;

//     // get lazy choice list
//     quotationUIService.getLazyChoice();
//     // toggle star
//     $scope.showStar = true;
//     $scope.toggleStar = function(index) {
//         $scope.selectedStarCard = index;
//         $scope.showStar = false;
//     }
//     $scope.visible = true;
//     // $scope.goToQuotationDetail = function() {
//     //     $scope.uId = $scope.moduleService.docId;
//     //     $scope.goToState('home.edit.document', {
//     //         module: 'quotation',
//     //         id: $scope.uId
//     //     });
//     // }
// });

//illustration overview
angular.module('iposApp').controller('QuotationOverviewCtrl', function(
        //form 3rd plugins
        $scope, $http, $translate,

        //from our project
        prospectUIService, quotationUIService, prospectUIService
    )

    {
        // $scope.prospectUIService = prospectUIService;
        $scope.moduleService = quotationUIService;
        $scope.prospectUIService = prospectUIService;
        if (prospectUIService.docListFull != undefined) {
            $scope.listProspect = prospectUIService.docListFull; // list of prospects
        } else {
            prospectUIService.loadMetaList().then(function afterLoadMetas() {
                $scope.listProspect = prospectUIService.docListFull; // list of prospects
            });
        }

        $scope.doIt = function(hello) {
            alert(hello);
        };

        //get detail when pass doc iD
        $scope.importDetail = function(prospectId) {
            prospectUIService.loadDetail(prospectId).then(function finishLoadDetail(data) {
                quotationUIService.findElementInDetail_V3(['ipos-illustration-motor-sompo:Inputs', 'ipos-illustration-motor-sompo:Salutation']).Value = quotationUIService.findElementInElement_V3(data, ['ipos-prospect:Person', 'ipos-prospect:Title']).Value;
                quotationUIService.findElementInDetail_V3(['ipos-illustration-motor-sompo:Inputs', 'ipos-illustration-motor-sompo:Gender']).Value = quotationUIService.findElementInElement_V3(data, ['ipos-prospect:Person', 'ipos-prospect:Gender']).Value;
                quotationUIService.findElementInDetail_V3(['ipos-illustration-motor-sompo:Inputs', 'ipos-illustration-motor-sompo:DateOfBirth']).$ = quotationUIService.findElementInElement_V3(data, ['ipos-prospect:Person', 'ipos-prospect:BirthDate']).$;
                quotationUIService.findElementInDetail_V3(['ipos-illustration-motor-sompo:Inputs', 'ipos-illustration-motor-sompo:MaritalStatus']).Value = quotationUIService.findElementInElement_V3(data, ['ipos-prospect:Person', 'ipos-prospect:MarStat']).Value;
                quotationUIService.findElementInDetail_V3(['ipos-illustration-motor-sompo:Inputs', 'ipos-illustration-motor-sompo:Occupation']).Value = quotationUIService.findElementInElement_V3(data, ['ipos-prospect:Person', 'ipos-prospect:Occupation']).Value;
                quotationUIService.findElementInDetail_V3(['ipos-illustration-motor-sompo:Inputs', 'ipos-illustration-motor-sompo:SmokerStat']).Value = quotationUIService.findElementInElement_V3(data, ['ipos-prospect:Person', 'ipos-prospect:SmokerStat']).Value;

            });
            //get index of prospect with Prospect Id
            // prospectId = prospectUIService.docListFull.map(function(e) {
            //     return e.DocId;
            // }).indexOf(prospectId);
            // quotationUIService.findElementInDetail_V3(['ipos-illustration-motor-sompo:Inputs', 'ipos-illustration-motor-sompo:Salutation']).Value = $scope.listProspect[prospectId]['Title'];
            // quotationUIService.findElementInDetail_V3(['ipos-illustration-motor-sompo:Inputs', 'ipos-illustration-motor-sompo:Gender']).Value = $scope.listProspect[prospectId]['Gender'];
            // quotationUIService.findElementInDetail_V3(['ipos-illustration-motor-sompo:Inputs', 'ipos-illustration-motor-sompo:DateOfBirth']).$ = $scope.listProspect[prospectId]['DateOfBirth'];
            // quotationUIService.findElementInDetail_V3(['ipos-illustration-motor-sompo:Inputs', 'ipos-illustration-motor-sompo:MaritalStatus']).Value = $scope.listProspect[prospectId]['MaritalStatus'];
            // quotationUIService.findElementInDetail_V3(['ipos-illustration-motor-sompo:Inputs', 'ipos-illustration-motor-sompo:Occupation']).Value = $scope.listProspect[prospectId]['Occupation'];
            // quotationUIService.findElementInDetail_V3(['ipos-illustration-motor-sompo:Inputs', 'ipos-illustration-motor-sompo:SmokerStat']).Value = $scope.listProspect[prospectId]['SmokerStat'];

        }

        //show/hide toolbar, when change $scope.fullScreen the class will changed also
        // $scope.fullScreen = false;
        // $scope.showFullScreen = function() {
        //     $scope.fullScreen = !$scope.fullScreen;
        //     //change class without jquery, ng-class
        //     // document.getElementById("hide").className = "animate-hided";
        // }

        //list all BI screens name
        // $scope.Pages = [{
        //     name: 'Vihicle Information',
        //     id: 0
        // }, {
        //     name: 'Driving Experience Information',
        //     id: 1
        // }];
        // $scope.prospectUIService = prospectUIService;
        // //SHOW PRODUCT TEMPATE pdf
        // $scope.showProduct = function(ev) {
        //     $mdDialog.show({
        //         controller: 'ProductTemplateListCtrl',
        //         templateUrl: 'templates/product_template_list.html',
        //         targetEvent: ev,
        //     });
        // }

        // //save and update quotation
        // $scope.save = function() {
        //     prospectUIService.progressBarOverview = false;
        //     if (quotationUIService.detail !== undefined) {
        //         //create new document
        //         if ($scope.state.is('home.edit.document')) {

        //             quotationUIService.saveQuotation("motor-insurance", $scope.moduleService.detail).then(function(data) {
        //                 prospectUIService.progressBarOverview = true;
        //                 $scope.openMessageBar("Save Successful");
        //             });
        //         }
        //         //edit existing doc
        //         else {
        //             $scope.docId = quotationUIService.docId;
        //             quotationUIService.updateQuotation("motor-insurance", $scope.docId, $scope.moduleService.detail).then(function() {
        //                 prospectUIService.progressBarOverview = true;
        //                 $scope.openMessageBar("Updated Successful");
        //             });
        //         }

        //     }
        // }

        // $scope.result = function(test) {
        //     $scope.moduleService.detail.IposDocument.Header.DocInfo.DocName = test;

        // };

        // //compute quotation
        // $scope.computeQuotation = function() {
        //     quotationUIService.computeIllustration(commonService.CONSTANTS.MODULE_NAME.QUOTATION, "motor-insurance", quotationUIService.detail);
        // }

        // $scope.copyQuotation = function() {
        //     quotationUIService.computeIllustration(commonService.CONSTANTS.MODULE_NAME.QUOTATION, "motor-insurance", quotationUIService.detail);
        // }
    });




// //illustration edit
// angular.module('iposApp').controller('QuotationDetailCtrl', function(
//     //form 3rd plugins
//     $scope, $http, $mdDialog,

//     //from our project
//     prospectUIService, quotationUIService, commonService
// ) {
//     // $scope.prospectUIService = prospectUIService;
//     // $scope.moduleService = quotationUIService;
//     // $scope.prospectUIService = prospectUIService;
//     // //SHOW PRODUCT TEMPATE pdf
//     // $scope.showProduct = function(ev) {
//     //     $mdDialog.show({
//     //         controller: 'ProductTemplateListCtrl',
//     //         templateUrl: 'templates/product_template_list.html',
//     //         targetEvent: ev,
//     //     });
//     // }

//     // //save and update quotation
//     // $scope.save = function() {
//     //     prospectUIService.progressBarOverview = false;
//     //     if (quotationUIService.detail !== undefined) {
//     //         //create new document
//     //         if ($scope.state.is('home.edit.document')) {

//     //             quotationUIService.saveQuotation("motor-insurance", $scope.moduleService.detail).then(function(data) {
//     //                 prospectUIService.progressBarOverview = true;
//     //                 $scope.openMessageBar("Save Successful");
//     //             });
//     //         }
//     //         //edit existing doc
//     //         else {
//     //             $scope.docId = quotationUIService.docId;
//     //             quotationUIService.updateQuotation("motor-insurance", $scope.docId, $scope.moduleService.detail).then(function() {
//     //                 prospectUIService.progressBarOverview = true;
//     //                 $scope.openMessageBar("Updated Successful");
//     //             });
//     //         }

//     //     }
//     // }

//     // $scope.result = function(test) {
//     //     $scope.moduleService.detail.IposDocument.Header.DocInfo.DocName = test;

//     // };

//     // //compute quotation
//     // $scope.computeQuotation = function() {
//     //     quotationUIService.computeIllustration(commonService.CONSTANTS.MODULE_NAME.QUOTATION, "motor-insurance", quotationUIService.detail);
//     // }

//     // $scope.copyQuotation = function() {
//     //     quotationUIService.computeIllustration(commonService.CONSTANTS.MODULE_NAME.QUOTATION, "motor-insurance", quotationUIService.detail);
//     // }
// });



// angular.module('iposApp').controller('ProductTemplateListCtrl',
//     function($scope, quotationUIService, prospectUIService, commonService, $mdDialog) {

//         //quotation template
//         $scope.templates = [{
//             name: 'Produc 1'
//         }, {
//             name: 'Produc 2'
//         }];
//         $scope.cancelDialog = function() {
//             $mdDialog.cancel();
//         };

//         $scope.okDialog = function() {

//             $mdDialog.cancel();
//             quotationUIService.viewPDF("quotation", "t004", quotationUIService.detail);
//         };
//     });



'use strict';
angular.module('iposApp').controller('QuotationHeaderCtrl', function(
        //form 3rd plugins
        $scope, $http,

        //from our project
        prospectUIService, quotationUIService, commonService, illustrationUIService
    )

    {


        $scope.moduleService = quotationUIService;
        $scope.prospectUIService = prospectUIService;
        $scope.illustrationUIService = illustrationUIService;
        //reset content 
        $scope.reset = function() {
                quotationUIService.resetContent(commonService.CONSTANTS.MODULE_NAME.ILLUSTRATION);
                // $scope.moduleService.parties = $scope.moduleService.findElementInDetail_V3(['ipos-illustration:Parties', 'ipos-illustration:Party']); // list of party
            }
            /**
             * Save illustration
             * @param
             * @return
             */
        $scope.save = function() {
            if (quotationUIService.detail !== undefined) {
                //create new document
                if (quotationUIService.docId == "") {
                    quotationUIService.saveQuotation(commonService.CONSTANTS.MODULE_NAME.ILLUSTRATION, "motor-sompo").then(function(data) {
                        if (quotationUIService.errorList != undefined) {
                            $scope.errorSave = quotationUIService.findElementInElement_V3(quotationUIService.errorList, ['ipos-error-document:ErrorMessage']);
                            $scope.openMessageBar($scope.errorSave);
                        } else {
                            $scope.openMessageBar("Saved Successfully");
                            //load BI list again
                            $scope.loadMetaList();
                        }
                    });
                }
                //edit existing doc
                else {
                    quotationUIService.updateQuotation("motor-sompo").then(function() {
                        if (quotationUIService.errorList != undefined) {
                            $scope.errorSave = quotationUIService.findElementInElement_V3(quotationUIService.errorList, ['ipos-error-document:ErrorMessage']);
                            $scope.openMessageBar($scope.errorSave);
                        } else {
                            $scope.openMessageBar("Updated Successfully");
                            $scope.loadMetaList();
                        }
                    });
                }

            }
        };


        /**
         * compute quotation
         * @param
         * @return
         */
        $scope.computeQuotation = function() {
                // illustrationUIService.progressBarOverview = false;
                quotationUIService.computeQuotation(commonService.CONSTANTS.MODULE_NAME.ILLUSTRATION, "motor-sompo").then(function(data) {
                    // illustrationUIService.progressBarOverview = true;
                    if (quotationUIService.errorList != undefined) {
                        $scope.errorSave = quotationUIService.findElementInElement_V3(quotationUIService.errorList, ['ipos-error-document:ErrorMessage']);
                        $scope.openMessageBar($scope.errorSave);
                    } else {
                        $scope.openMessageBar("Computed Successful");
                        $scope.refreshContent();
                    }
                });
            }
            /**
             * get compute quotation
             * @param
             * @return
             */
        $scope.getComputedDetail = function() {
            var self = this;
            self.hideRightView();
            quotationUIService.loadComputedDetail().then(function afterLoadComputedDoc() {
                self.refreshContent();
                self.unhideRightView();
            });
        };


        $scope.showPDF = function() {
            quotationUIService.viewPDF();
        }

        //init popover
        // $ionicPopover.fromTemplateUrl('templates/popover.html', {
        //     scope: $scope,
        // }).then(function(popover) {
        //     $scope.popover = popover;
        // });

        // $scope.hidePopover = function() {
        //     $scope.popover.hide();
        // };
        //Cleanup the popover when we're done with it!
        // $scope.$on('$destroy', function() {
        //     $scope.popover.remove();
        // });

        // $scope.viewPDF = function() {
        //     $scope.moduleService.viewPDF("quotation", "t004", quotationUIService.detail);
        // }

        /**
         * Save illustration
         * @param
         * @return
         */
        // s

        /**
         * compute illustration
         * @param
         * @return
         */
        // $scope.computeQuotaion = function() {
        //     quotationUIService.progressBarOverview = false;
        //     quotationUIService.computeQuotation("motor-insurance", quotationUIService.detail).then(function(data) {
        //         quotationUIService.progressBarOverview = true;
        //         $scope.moduleService.getErrorMessage(quotationUIService.errorList,'$..ipos-motor-insurance:MotorInsurance.ipos-motor-insurance:Inputs.ipos-motor-insurance:BasePlan.ipos-motor-insurance:SumInsured');
        //         if (quotationUIService.errorList != undefined) {
        //             $scope.errorSave = quotationUIService.findElementInElement_V3(quotationUIService.errorList, ['ipos-error-document:ErrorMessage']);
        //             $scope.openMessageBar($scope.errorSave);
        //         } else {
        //             $scope.openMessageBar("Computed Successful");
        //         }
        //     });
        // }

        // $scope.goToIllustrationDetail = function() {
        //     $scope.uId = quotationUIService.docId;
        //     quotationUIService.loadDetail($scope.uId).then(function() {
        //         $scope.refId = quotationUIService.findElementInDetail_V3(['ipos-illustration:Parties', 'ipos-illustration:Party.@refUid']);

        //         $scope.goToState('home.edit.document', {
        //             module: 'illustration',
        //             id: $scope.uId
        //         });
        //         console.log($scope.uId);

        //     });
        //     quotationUIService.progressBarOverview = true;
        // }

        // $scope.goToProspectDetail = function() {
        //         $scope.goToState('home.edit.document', {
        //             module: 'prospect',
        //             id: prospectUIService.docId
        //         });
        //     }
        //     //toggle edit button
        // if ($scope.state.is('home.edit.document')) {
        //     $scope.moduleService.visible = false;
        // } else
        //     $scope.moduleService.visible = true;
        // $scope.toggleEdit = function() {
        //     $scope.moduleService.visible = !$scope.moduleService.visible;
        // };

    });
