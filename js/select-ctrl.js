angular.module('iposApp').controller('SelectCtrl', function(
    //form 3rd plugins
    $scope, $mdDialog, $translate, $filter,
    //from our project
    moduleService, listData, i18nPrefix, selectTitle, displayText, displayValue, selectedValue, selectItemTemplate
) {

    $scope.moduleService = moduleService;
    $scope.selectTitle = selectTitle;
    $scope.enableSearch = true;
    $scope.preValue = undefined;
    $scope.srcData = listData;
    $scope.dispData = []; //list options will be display
    $scope.i18nPrefix = i18nPrefix;
    $scope.srcData = [];
    $scope.selectItemTemplate = selectItemTemplate;
    // var i = 0;
    var values = [""];//for selected value

    //search data in select list width vars.strSearch (search value)
    $scope.searchDocSelect = function searchDoc() {
        $scope.dispData = $filter('filter')(listData, this.vars.strSearch);
        $scope.refreshList();//refresh data after search with new data
    };
    $scope.refreshList = function refreshList() {
        $scope.bIsListChanged = true;
    }

    //bind the selected value to iposdoc
    $scope.selectedValue = function(value, index) {
        //set prevOptionEle for the first time loaded with selected value
        if (!$scope.prevOptionEle && $scope.selectedOption != undefined)
            $scope.prevOptionEle = document.getElementById("select-" + $scope.selectedOption);

        //remove check icon
        if ($scope.prevOptionEle)
            $scope.prevOptionEle.innerHTML = '<i></i>';


        //select new selected item
        $scope.prevOptionEle = document.getElementById("select-" + index);
        
        //remove check icon to selected value
        if(values[0] == value){
            $scope.prevOptionEle.innerHTML = '<i></i>';
            values = [""];
        }
        else{
            //add check icon to selected value
            $scope.prevOptionEle.innerHTML = '<i class="fa fa-check default-color"></i>';
            values = [value];
        }
    };

    $scope.doneSelect = function() {
        if (values){
            $mdDialog.hide(values);//pass value back to directive
        }   
    };

    $scope.cancelDialog = function() {
        $mdDialog.cancel();
    };
    $scope.convertObj = function() {
        if (!listData[0])
            return;

        var tmpObj = {};
        var trans = "";
        var i = 0;
        var j = 0;
        var k= 0;
        //if the list isn't translated this function will translate text base on i18nPrefix
        if (!listData[0][displayText] && !listData[0][displayValue]) {
            // for(j; j < listData.length; j++){
            $scope.dispData = $scope.srcData.map(
                function(code) { //convert to array of object: {value: code, text: translated, group: group}
                    var tmpObj = {};
                    tmpObj.value = code;

                    //start to translate
                    if ($scope.i18nPrefix != "")
                        $translate($scope.i18nPrefix + '.' + code).then(function(translatedStr) {
                            tmpObj.text = translatedStr;
                        });
                    else
                        tmpObj.text = code;
                    return tmpObj;
                }
            );
        } else {
            //when no text (translated text) in listData, select will use value to display on select
            if (listData[0][displayText] == undefined && listData[0][displayValue]) {
                displayText = "value";
            }
            if (!listData[i].text) {
                for (i; i < listData.length; i++) {
                    $scope.dispData.push({
                        'value': listData[i][displayValue],
                        'text': listData[i][displayText]
                    });
                }
            }
            else{
                $scope.dispData = listData;
            }
            //find selected value
            for (k; k < listData.length; k++) {
                if (listData[k][displayValue] == selectedValue) {
                    $scope.selectedOption = k;
                    values = [selectedValue];
                    break;
                }
            }
        }

        //check list lenght
        if($scope.dispData.length > 10)
            $scope.enableSearch = false;
        listData = $scope.dispData;
    }

    //scroll to selected item
    jQuery.fn.scrollTo = function(elem, speed) { 
        $(this).animate({
            scrollTop:  $(this).scrollTop() - $(this).offset().top + $(elem).offset().top 
        }, speed == undefined ? 1000 : speed); 
        return this; 
    };

    $scope.scrollToSelectListIndex = function scrollToSelectListIndex(index){
        var id = "#select-" + index;
        $("#select-list").scrollTo(id, 100);
    }

    $scope.convertObj();
    //highlight card being call from directive whenDone
    $scope.highLightSelected = function() {
        $scope.prevOptionEle = document.getElementById("select-" + $scope.selectedOption);
        if($scope.prevOptionEle){
            $scope.prevOptionEle.innerHTML = '<i class="fa fa-check default-color"></i>';
            $scope.scrollToSelectListIndex($scope.selectedOption);
        }
    };
});
