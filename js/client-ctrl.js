'use strict';
angular.module('iposApp').controller('ClientListCtrl', function(
    //form 3rd plugins
    $scope, $mdDialog, $http, $ionicScrollDelegate,
    //from our project
    prospectUIService, connectService) {
    $scope.searchBox = {};
    //show searchbox
    $scope.showSearch = function() {
        $(".green-bar-search").animate({
            top: '0px'
        }, 300);
    }
    $scope.hideSearch = function() {
        $(".green-bar-search").animate({
            top: '-50px'
        }, 300);
    }
    $scope.connectService = connectService;
    $scope.moduleService = prospectUIService;
    //get document list
    $scope.listDocument = [];
    $scope.Docitem = {};
    $scope.listDocs = [];
    $scope.listDocsSort = [];

    $scope.PullToRefreshBar = true;
    $scope.progressBar = true;

   //load prospect list
    if (prospectUIService.docListFull == undefined) {
        $scope.progressBar = false;
        prospectUIService.loadDocList().then(function() {
             $scope.progressBar = true;
             if (prospectUIService.docListFull != undefined) {
             
            //list of ten first prospect
            $scope.listDisplayProspect = prospectUIService.listDisplayProspect;
        } else {
            $scope.listDisplayProspect = [{
                name: 'Testing case',
                age: 25,
                gender: 'boy'
            }];
        }
        });
    } else {
        $scope.progressBar = true;
        if (prospectUIService.docListFull != undefined) {
            $scope.listDisplayProspect = prospectUIService.listDisplayProspect;
        } else {
            $scope.listDisplayProspect = [{
                name: 'Testing case',
                age: 25,
                gender: 'boy'
            }];
        }
    };

    // load document
    $scope.loadDetail = function(docId, index) {
        prospectUIService.progressBarOverview = false;
        prospectUIService.showOverview = true;
        //change color for selected card
        $scope.selected = index;
        $scope.docId = docId;
        //load document with docid
        prospectUIService.loadDetail(docId).then(function() {
            //hide progress bar
            prospectUIService.progressBarOverview = true;
            //show overview screen
            prospectUIService.showOverview = false;
            // $scope.showDisable();
        });
    };

    // toggle star
    $scope.showStar = true;
    $scope.toggleStar = function(index) {
        $scope.selectedStarCard = index;
        $scope.showStar = false;
    }
    $scope.visible = true;
});

angular.module('iposApp').controller('ClientOverviewCtrl', function(
        //form 3rd plugins
        $scope, $http, $ionicModal, $ionicPopover, $translatePartialLoader, $translate,

        //from our project
        prospectUIService
    )

    {
        $scope.goToClientView = function() {
            $scope.goToState('home.view.client');
        }
        $scope.goToProspectDetail = function() {
            $scope.goToState('home.edit.document', {
                module: 'prospect',
                id: prospectUIService.prospectId
            });
        }
         $scope.toggleView = function() {
            prospectUIService.showOverview = false;

        };


    });


angular.module('iposApp').controller('ClientDetailCtrl',
    function($scope, $log, $stateParams, prospectUIService) {
        $scope.moduleService = prospectUIService;
        $scope.stateParams = $stateParams;
        prospectUIService.attachmentEditable = true;



        $scope.selectedIndex = parseInt($scope.stateParams.tabId);

        var tabs = [{
            title: 'One',
            content: "Tabs will become paginated if there isn't enough room for them."
        }, {
            title: 'Two',
            content: "You can swipe left and right on a mobile device to change tabs."
        }, {
            title: 'Three',
            content: "You can bind the selected tab via the selected attribute on the md-tabs element."
        }, {
            title: 'Four',
            content: "If you set the selected tab binding to -1, it will leave no tab selected."
        }, {
            title: 'Five',
            content: "If you remove a tab, it will try to select a new one."
        }, {
            title: 'Six',
            content: "There's an ink bar that follows the selected tab, you can turn it off if you want."
        }, {
            title: 'Seven',
            content: "If you set ng-disabled on a tab, it becomes unselectable. If the currently selected tab becomes disabled, it will try to select the next tab."
        }, {
            title: 'Eight',
            content: "If you look at the source, you're using tabs to look at a demo for tabs. Recursion!"
        }, {
            title: 'Nine',
            content: "If you set md-theme=\"green\" on the md-tabs element, you'll get green tabs."
        }, {
            title: 'Ten',
            content: "If you're still reading this, you should just go check out the API docs for tabs!"
        }];
        $scope.tabs = tabs;
        $scope.selectedIndex = 2;
        $scope.$watch('selectedIndex', function(current, old) {
            if (old && (old != current)) $log.debug('Goodbye ' + tabs[old].title + '!');
            if (current) $log.debug('Hello ' + tabs[current].title + '!');
        });
        $scope.addTab = function(title, view) {
            view = view || title + " Content View";
            tabs.push({
                title: title,
                content: view,
                disabled: false
            });
        };
        $scope.removeTab = function(tab) {
            for (var j = 0; j < tabs.length; j++) {
                if (tab.title == tabs[j].title) {
                    $scope.tabs.splice(j, 1);
                    break;
                }
            }
        };

    });
