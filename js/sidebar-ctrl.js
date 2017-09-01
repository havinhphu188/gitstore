'use strict';
angular.module('iposApp').controller('SideBarCtrl', function(
    $scope, $state, $timeout

) {
   

    // $scope.init = function() {
    //     var self = this;
    //     self.name = "SideBarCtrl";

    //     //auto hover prospect module when first login
    //     $timeout(function() {
    //         self.selectedDiv = angular.element("#" + self.CONSTANTS.MODULE_NAME.PROSPECT);
    //         $scope.vars.moduleListView = self.CONSTANTS.MODULE_NAME.PROSPECT;

    //         self.toggleSelected();
    //         this.selectedDiv = angular.element("#");
    //     }, 1000);
    // }
    $scope.vars.moduleListView = "prospect";

      $scope.autoSelect = function() {
        this.selectedDiv = angular.element("#" + $scope.vars.moduleListView);
        this.selectedDiv.addClass('selected-item radius-corner');
      }

               





    //list module

    /**
     * Open module with list-detail view
     */
    $scope.openView = function(moduleName) {
        $scope.vars.moduleListView = moduleName;

        //hover the selected module
        this.toggleSelected();
        this.selectedDiv = angular.element("#" + moduleName);
        this.toggleSelected();
        // this.selectedDiv = angular.element("#" + $scope.vars.moduleListView);
        
        //reset all needed value before moving to other modules
        this.resetVarsWhenChangeModule();
        this.openModule(moduleName);
    }
    

    

    // $scope.init();

});
