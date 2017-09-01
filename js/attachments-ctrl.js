angular.module('iposApp').controller('AttachmentDetailCtrl',
    function($scope, $interval, $mdDialog, $log, $mdBottomSheet, $filter, fileType, moduleService, resourceUIService) {

        $scope.moduleService = moduleService;
        // static data for attachment
        $scope.data1 = false;
        $scope.data2 = false;


        
        $scope.tempFiles = [];
        $scope.files = []; //store File js object
        $scope.filesMeta = []; //store files meta        


        // $scope.init = function init (moduleService) {
        //     this.tempNewResource = moduleService.tempNewResource;
        // }


        // $scope.moduleService.filesDisp = [];
        // close button 
        $scope.cancelToClose = function() {
            var files = $scope.moduleService.files;
            if (files && !files[files.length - 1].completed) {
                var r = confirm("Are you sure to close all uploading files?");
                if (r == true) {
                    $mdDialog.cancel();
                }
            } else
                $mdDialog.cancel();
        };

        // // close button 
        // $scope.cancelToClose = function() {
        //     var files = $scope.moduleService.files;
        //     if (files && !files[files.length - 1].completed) {
        //         var r = confirm("Are you sure to close all uploading files?");
        //         if (r == true) {
        //             $mdDialog.cancel();
        //         }
        //     } else
        //         $mdDialog.cancel();
        // };

        // iOS
        $scope.cancelAttachment = function(){
            $scope.moduleService.tempNewResource = [];
            $mdDialog.cancel();
        }
        // Runtime
        $scope.cancelAttach = function(){
            $mdDialog.cancel();
        }
        // iOS
        $scope.doneAttach = function(){
            $mdDialog.hide();
        }

        $scope.openFileDialog = function() {
            $("#fileAttach").trigger('click');
        };

        $scope._showImgPicker = function() {
            var self = this;
            resourceUIService.showImagePicker(true).then(function hadImgInfor (imgsInfo) {

                if(!imgsInfo.length)
                    return;

                //if moduleService.tempNewResource is undefined, init it
                if(moduleService.tempNewResource === undefined)
                    //stores all resources need to save
                    moduleService.tempNewResource = [];

                moduleService.tempNewResource = moduleService.tempNewResource.concat(imgsInfo.map(
                    function(file) {
                        file.name = file.FileName;
                        file.size = file.FileSize;
                        file.createdDate = file.DateTime;
                        return file;
                    })
                );
            });
        };


        $scope.showImgPicker = function() {
            var self = this;
            self.moduleService.callAction('SHOW_IMAGE_PICKER').then(function hadImgsInfor (response) {
                self.moduleService.filesDisp = response;
                self.filesMeta.concat(response.map(
                    function(file) {//convert to array of object: {value: code, text: translated, group: group}
                        file.name = file.FileName;
                        file.size = file.FileSize;
                        file.createdDate = file.DateTime;
                        return file;
                    })
                );

                //init 
                self.moduleService.imgNeedToSave = [];
                for (var i = response.length - 1; i >= 0; i--) {
                    self.moduleService.imgNeedToSave.push(response[i].FileName);
                };
                
            });
        };

        // iOS
        $scope.removeTempFile = function(index){
            $scope.moduleService.tempNewResource.splice(index, 1);
        }

        // Runtime
        $scope.removeTempFileRuntime = function(index){
            $scope.files.splice(index, 1);
            $scope.filesMeta.splice(index, 1);
        }

        
        $scope.fileDesc = "";
        $scope.doUpload = function() {
            //if not avatar, upload all
            if(fileType !== 'image'){
                for (var i = $scope.files.length - 1; i >= 0; i--) {
                    handleFileSelection($scope.files[i]);
                };
            }else{
                handleFileSelection($scope.files[$scope.files.length - 1]);
            }
        };

        function handleFileSelection(file) {
            var reader = new FileReader();

            reader.onload = function() {
                var binaryString = reader.result; //base64 encoded string
                // var based64Data = binaryString.split(',')[1];  //base64 encoded string
                
                if(fileType === 'image'){
                    $scope.moduleService.attachAvatar(file, binaryString).then(function hadAttach (result) {
                        //after upload img success, update prospect to reflect changing
                        $scope.moduleService.updateProspect();
                    });
                }else{
                    $scope.moduleService.attachFile(file, binaryString);
                }
            };

            //start to read data stream (array buffered)
            reader.readAsArrayBuffer(file);
        };

        /**
         * Read the file information and display if it is image
         */
        $scope.onFileSelect = function(event) {      
            for (var i = event.target.files.length - 1; i >= 0; i--) {
                $scope.files.push(event.target.files[i]);

                var fileMeta = {};
                fileMeta.size = $filter('number')(event.target.files[i].size/1023/1023, 2) + ' Mb';
                fileMeta.name = event.target.files[i].name;

                $scope.filesMeta.push(fileMeta);
            };      

            //if not select avatar, don't need run the code blow
            if(fileType !== 'image'){
                $scope.$digest();
                return;
            }

            var reader = new FileReader();
            reader.onload = function() {
                // Render thumbnail.
                var span = document.getElementById('pic');
                var content = ['<img class="edit-avatar" src="', reader.result,
                    '" title="', escape($scope.files[$scope.files.length - 1].name), '"/>'
                ].join('');
                span.innerHTML = content;
            };

            // Read in the image file as a data URL (base64 encoded)
            reader.readAsDataURL($scope.files[0]);
        };


        $scope.removeFile = function(index) {
            $scope.filesList.splice(index, 1);
        };

        // function sortFilesList() {
        //     var a = [];
        //     for (var i = 0; i < $scope.filesList.length; i++) {
        //         var file = $scope.filesList[i];
        //         if (a.map(function(el) {
        //                 return el.name;
        //             }).indexOf($scope.filesList[i].name) < 0)
        //             a.push(file);
        //     }
        //     return a;
        // };

        //////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////

        /*$scope.executeProgress = function(){
            $scope.determinateValue = 0;     
            $scope.completed = false;
            //interval 
            $interval(function() {
                $scope.showQueue();
                $scope.determinateValue += 5;
                if ($scope.determinateValue > 100) {
                    $scope.completed = true;
                }
            }, 500);
        };*/


        $scope.executeProgress = function($event) {
            $scope.files = document.getElementById("file").files;
            $scope.moduleService.files = $scope.files;
            if ($scope.files.length > 0) {
                $mdBottomSheet.show({
                    templateUrl: 'templates/bottom-sheet-grid-template.html',
                    controller: 'BottomSheetCtrl',
                    targetEvent: $event,
                    parent: 'md-dialog ion-content'
                });
            }
        };

        $scope.deleteFileUploaded = function(pos) {
            var newList = [];
            var fileLength = $scope.moduleService.files.length;
            for (var i = 0; i < fileLength; i++) {
                if (i !== parseInt(pos)) {
                    newList.push($scope.moduleService.files[i]);
                    if (i > parseInt(pos))
                        newList[i - 1].pos = i - 1;
                }
            }
            $scope.moduleService.files = newList;
        };

    });

// angular.module('iposApp').controller('BottomSheetCtrl',
//     function($scope, $interval, $scope.moduleService, $mdDialog, $mdBottomSheet) {
//         $scope.moduleService = $scope.moduleService;
//         $scope.files = $scope.moduleService.files;

//         $scope.doUploadFile = function() {
//             $scope.uploadProgress = [];
//             var i = 0;
//             while (i < $scope.files.length) {
//                 $scope.files[i].completed = false;
//                 $scope.files[i].determinateValue = 0;
//                 $scope.files[i].pos = i;
//                 $scope.updateFileProgress(i);
//                 i++;
//             }
//             if ($scope.files.length > 0) {
//                 $scope.check = $interval(function() {
//                     if ($scope.files[$scope.files.length - 1].determinateValue >= 100) {
//                         $scope.closeBottomSheet();
//                         $interval.cancel($scope.check);
//                     }
//                 }, 100);
//             }
//         };

//         $scope.updateFileProgress = function(index) {
//             if (angular.isDefined($scope.uploadProgress[index])) return;

//             $scope.uploadProgress[index] = $interval(function() {
//                 $scope.files[index].determinateValue += 1;
//                 if ($scope.files[index].determinateValue > 100) {
//                     $scope.files[index].completed = true;
//                     $interval.cancel($scope.uploadProgress[index]);
//                 }
//             }, 100);
//         };

//         $scope.cancelUpload = function(pos) {
//             var newList = [];
//             var fileLength = $scope.files.length;
//             for (var i = 0; i < fileLength; i++) {
//                 if (i !== parseInt(pos)) {
//                     newList.push($scope.files[i]);
//                     if (i > parseInt(pos))
//                         newList[i - 1].pos = i - 1;
//                 }
//             }
//             $scope.files = newList;
//             if (pos == 0 && fileLength == 1)
//                 $mdBottomSheet.cancel();
//         };

//         $scope.closeBottomSheet = function() {
//             $mdBottomSheet.cancel();
//         };

//         //start to upload file after creating controller
//         $scope.doUploadFile();

//     });
