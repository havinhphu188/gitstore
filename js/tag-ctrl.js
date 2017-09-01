angular.module('iposApp').controller('TagsCtrl',
    function($scope, illustrationUIService, prospectUIService, commonService, $mdDialog, moduleService) {

        $scope.moduleService = moduleService;
        $scope.tags = $scope.moduleService.findElementInDetail_V3(["DocInfo"]);
        if($scope.tags.Tags != "")
            $scope.tagList = $scope.tags.Tags.split(",");
        else
            $scope.tagList = [];

        $scope.addTag = function(tag) {
            if(tag)
                $scope.tagList.push(tag);
            $scope.tag = "";
        };

        $scope.removeTag = function(index) {
            $scope.tagList.splice(index, 1);
        };

        $scope.cancelDialog = function() {
            $mdDialog.cancel();
        };

        $scope.saveTag = function() {
            var stringTags = $scope.tagList.join();
            $scope.tags.Tags = stringTags;
            $mdDialog.cancel();
            $scope.moduleService.openMessageBar("Tags saved");
        };
    });