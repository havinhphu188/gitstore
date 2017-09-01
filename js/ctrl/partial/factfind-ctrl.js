/*
 * //*******************************************************************************
 * // * Copyright (c) 2011-2014 CSC.
 * // * Copyright (C) 2010-2016 CSC - All rights reserved.
 * // *
 * // * The information contained in this document is the exclusive property of
 * // * CSC.  This work is protected under USA copyright law
 * // * and the copyright laws of given countries of origin and international
 * // * laws, treaties and/or conventions. No part of this document may be
 * // * reproduced or transmitted in any form or by any means, electronic or
 * // * mechanical including photocopying or by any informational storage or
 * // * retrieval system, unless as expressly permitted by CSC.
 * //
 * // * Design, Develop and Manage by Team Integral Point-of-Sales & Services
 * // ******************************************************************************
 */

'use strict';
var FactfindDetailCtrl = ['$scope', '$compile', '$state', '$filter', '$mdDialog', '$document', '$http', '$log', '$timeout', '$interval', 'ajax', 'urlService', 'uiRenderPrototypeService', 'commonService', '$translate', '$translatePartialLoader', 'multiUploadService','fileReader','$upload','commonUIService', 'factfindUIService', 'prospectPersonalUIService', 'printPdfService', 'salecaseUIService', 'illustrationUIService',
	function($scope, $compile, $state, $filter, $mdDialog, $document, $http, $log, $timeout, $interval, ajax, urlService, uiRenderPrototypeService, commonService, $translate, $translatePartialLoader, multiUploadService,fileReader,$upload,commonUIService, factfindUIService, prospectPersonalUIService, printPdfService, salecaseUIService, illustrationUIService) {
    
	var portletId = myArrayPortletId["my-new-workspace"];
    $scope.initContextPath = contextPathRoot;
    $scope.moduleProspectPersonalService = prospectPersonalUIService;
    $scope.moduleService = factfindUIService;
    $scope.commonService = commonService;
    $scope.commonUIService = commonUIService;
    $scope.resourceURL = factfindUIService.initialPortletURL(myArrayPortletId["my-new-workspace"]);
    $scope.fileReaderService=fileReader; //View file
    $scope.fileReaderService.portletId = portletId;
    $scope.multiUploadService = multiUploadService;
    $scope.portletId = myArrayPortletId["my-new-workspace"];
    $scope.contextPathTheme = angular.contextPathTheme;
    $scope.fileReaderService = fileReader;
    $scope.listPreViewFGS = [];
    $scope.isSection = undefined;
    $('#ipos-full-loading').hide(); // hide full loading

    $scope.init = function init () {
        var self = this;
        self.generalConfigCtrl('FactfindDetailCtrl', factfindUIService).then(function(){  
        	if(commonService.hasValueNotEmpty(factfindUIService.insideDoc)){
        		//Set Product Name to Inside FNA from BI
        		var quotations = salecaseUIService.findElementInDetail_V3(['Quotation']);
        		if(salecaseUIService.findElementInDetail_V3(['Quotations'])['@counter'] != 0){
		    	   	 for (var i = (quotations.length - 1); i >= 0; i--){
		    	   		 var quotationID = quotations[i]['@refUid'];
		    	   		 if(quotationID){
		    	   			 illustrationUIService.findDocument_V3($scope.resourceURL, quotationID).then(function(data){
		    	   				 if(illustrationUIService.findElementInDetail_V3(['BusinessStatus']) == 'ACCEPTED'){
		    	   					 factfindUIService.findElementInInsideDoc_V3(['Recommendations', 'ProductName']).$ = illustrationUIService.findElementInDetail_V3(["DocInfo","Product"]);
		    	   				 }
		    	   			 });
		    	   		 }
		    	   	 }
        		};
        		$scope.checkReLoadClientJoinApplicant();
            }else{
            	$scope.checkReLoadClientJoinApplicant();
            	$scope.checkFinancialGoalsAnalysis('Client');
            }
        	$scope.getComputeLazy();
        });
    };
    
    /**
	 * Get lazy choice list for FNA
	 */
    $scope.getComputeLazy = function() {
        var deferred = factfindUIService.$q.defer();
        if(!commonService.hasValueNotEmpty(factfindUIService.lazyChoicelist)){
            factfindUIService.getModuleLazyChoicelist_V3($scope.resourceURL).then(function(data) {
                factfindUIService.lazyChoiceList = factfindUIService.lazyChoicelist;
                deferred.resolve(data);
            });
        } else deferred.resolve();
        return deferred.promise;
    }
    
    /**
	 * Refresh slider for reset position on UI  
	 */
    $scope.setSlider = function() {
        $timeout(function () {
            $scope.$broadcast('reCalcViewDimensions');
        }, 1000);
    }
    
    /**
	 * Get Prospect list to select Client, join Applicant  
	 */
    $scope.getProspectList = function() {
    	if($scope.prospectList == undefined){
    		$scope.isLoaded = false;
	        prospectPersonalUIService.getDocumentList_V3($scope.resourceURL).then(function(data){
	        	$scope.isLoaded = true;
	            $scope.prospectList = prospectPersonalUIService.findElementInElement_V3(data, ['MetadataDocument']);
	            if(commonService.hasValueNotEmpty($scope.prospectList)){
	                if (!$.isArray($scope.prospectList)){
	                    var temp = $scope.prospectList;
	                    $scope.prospectList = [];
	                    $scope.prospectList.push(temp);
	                }
	                $scope.childrenList = $scope.prospectList;
	                $scope.listProspectLimit = 12;
	                $scope.increase = function(){
	                    $scope.listProspectLimit = $scope.listProspectLimit + 4;
	                };
	            }else{
	                $scope.msg = 'There is no data.';
	            }
	        });
    	}
    }
    
    /**
	 * Import data from prospect into Child on FNA  
	 */
    $scope.childs = { child0:undefined, child1:undefined, child2:undefined};    
    $scope.addChild = function(childRefUid, index) {
        var listNode = $scope.moduleService.convertToArray($scope.moduleService.findElementInDetail_V3(['Dependants', 'Children', 'Child']));
        var child = $scope.childrenList.filter(function getChild(obj){return obj.DocId == childRefUid;})[0];
        if(child){
        	if(getByValue(listNode, child.DocId)==undefined){
        		var childrenNode =  listNode[index];
        		childrenNode['@refUid'] = child.DocId;
        		$scope.moduleService.findElementInElement_V3(childrenNode, ['ChildFullName']).$ = child.FullName;
        		$scope.moduleService.findElementInElement_V3(childrenNode, ['ChildBirthOfDate']).$ = child.BirthDate;
        		$scope.moduleService.findElementInElement_V3(childrenNode, ['ChildGender']).Value = child.Gender;
        		$scope.computeTag([['Assumptions','DependencePeriodForChildren'],['Client','Children']]);
        		commonUIService.showNotifyMessage("v3.mynewworkspace.message.importedChildSuccessfully", "success");
        	}else
        		commonUIService.showNotifyMessage("v3.mynewworkspace.message.systemDoNotAllowToImportDuplicatedChild");
        }
        
        function getByValue(arr, value) {
          var o;
          for (var i=0, iLen=arr.length; i<iLen; i++) {
            o = arr[i];
            for (var p in o) {
              if (o.hasOwnProperty(p) && o[p] == value) {
                return o;
              }
            }
          }
        }
    }
    
    /**
	 * Remove Children in Client card
	 */
    $scope.removeChild = function(index) {
    	$scope.moduleService.convertObjectEleToArray($scope.moduleService.findElementInDetail_V3(['Children']),['Child']);
        $scope.moduleService.removeChildEleParentEle($scope.moduleService.findElementInDetail_V3(['Dependants', 'Children']),'factfind:Child', index);
        $scope.childs['child'+index] = undefined;
    }
    
    /**
	 * Add ElderlyDependant in Client card
	 */
    $scope.addElderlyDependant = function() {
        $scope.moduleService.convertObjectEleToArray($scope.moduleService.findElementInDetail_V3(['ElderDependants']),['ElderDependant']);
        $scope.moduleService.addElementInElement_V3($scope.moduleService.detail, ['ElderDependants'],['ElderDependant']);
    }
    
    /**
	 * Add Children in Client card
	 */
    $scope.addChildren = function() {
        $scope.moduleService.convertObjectEleToArray($scope.moduleService.findElementInDetail_V3(['Children']),['Child']);
        $scope.moduleService.addElementInElement_V3($scope.moduleService.detail, ['Children'],['Child']);
    }
    
    /**
	 * Remove ElderlyDependant in Client card
	 */
    $scope.removeElderlyDependant = function(child, index) {
        $scope.moduleService.removeChildEleParentEle($scope.moduleService.findElementInDetail_V3(['Dependants', 'ElderDependants']),'factfind:ElderDependant', index)
    }
    
    /**
	 * Import data a prospect to node Client, Join Applicant in FNA document  
	 */
    $scope.importClient = function(card, metadata, $event) {
        var self = this;
        var section = undefined;
        self.card = card;
        
        //check card Client or Join Applicant
        if(card.name === "needs-analysis:ImportFromExistingJointApplicant"){
            section = 'JointApplicant';
            if(!commonService.hasValueNotEmpty(self.moduleService.findElementInDetail_V3(['Client'])['@refUid'])){
        		commonUIService.showNotifyMessage("v3.mynewworkspace.message.doNotAllowToAddJointApplicantIfClientHasNotBeenAdded");
        		return;
        	}
        }
        else{
            section = 'Client';
        }
        //get a Prospect detail by DocId      
        prospectPersonalUIService.findDocument_V3($scope.resourceURL, metadata.DocId).then(function(data){
        	if(prospectPersonalUIService.isSuccess(data)){
	    		importDataProspectIntoClient(section, metadata.DocId);
        	}else
        		commonUIService.showNotifyMessage("v3.mynewworkspace.message.import" + section + "v3.mynewworkspace.message.unsuccessfully");
        	$scope.reSetupConcreteUiStructure($scope.moduleService.detail); // refresh the values in multiple cards    		
        })
        
        self.closeChildCards(0, $event);
    }
    
    /**
	 * Reload data a prospect for node Client, Join Applicant in FNA document  
	 */
    $scope.checkReLoadClientJoinApplicant = function(){
    	if(commonService.hasValueNotEmpty($scope.moduleService.findElementInDetail_V3(['Client'])['@refUid'])){
			prospectPersonalUIService.findDocument_V3($scope.resourceURL, $scope.moduleService.findElementInDetail_V3(['Client'])['@refUid']).then(function(data){
	        	if(prospectPersonalUIService.isSuccess(data)){
	        		importDataInDetail('Client');
	        	}else
	        		commonUIService.showNotifyMessage("v3.mynewworkspace.message.reloadClientUnsuccessfully");
	    		$scope.reSetupConcreteUiStructure($scope.moduleService.detail); // refresh the values in multiple cards
	        })
    	}
    	if(commonService.hasValueNotEmpty($scope.moduleService.findElementInDetail_V3(['JointApplicant'])['@refUid'])){
    		prospectPersonalUIService.findDocument_V3($scope.resourceURL, $scope.moduleService.findElementInDetail_V3(['JointApplicant'])['@refUid']).then(function(data){
	        	if(prospectPersonalUIService.isSuccess(data)){
	        		importDataInDetail('JointApplicant');
	        	}else
	        		commonUIService.showNotifyMessage("v3.mynewworkspace.message.reloadJointApplicantUnsuccessfully");
	    		$scope.reSetupConcreteUiStructure($scope.moduleService.detail); // refresh the values in multiple cards
	        })
    	}
    }
    
    /**
	 * Check data of prospect detail for Summary card  
	 */    
    $scope.checkDataFNA = function(){
    	if(!commonService.hasValueNotEmpty($scope.moduleService.findElementInDetail_V3(['Client', 'ContactInformation', 'Person', 'FullName']).$) || 
    		!commonService.hasValueNotEmpty($scope.moduleService.findElementInDetail_V3(['Client', 'ContactInformation', 'Person', 'BirthDate']).$) || 
    		!commonService.hasValueNotEmpty($scope.moduleService.findElementInDetail_V3(['Client', 'ContactInformation', 'Person', 'Gender']).Value)) return true;
    	return false;
    }
    
    /**
	 * Check card Client or Join Applicant to import data from prospect to FNA 
	 */ 
    function importDataProspectIntoClient(section, prospectId){
		if($scope.moduleProspectPersonalService.detail){
			$scope.moduleService.findElementInDetail_V3([section])['@refUid'] = prospectId;
			importDataInDetail(section);			
			if(commonService.hasValueNotEmpty($scope.moduleService.findElementInDetail_V3(['JointApplicant'])['@refUid'])){
				$scope.moduleService.findElementInDetail_V3(['IsJointApplicant']).Value = "Y";
				$scope.refreshFNADoc();
			}
			commonUIService.showNotifyMessage("v3.mynewworkspace.message.ImportProspectSuccessfully", "success");
		}
	}
    
    /**
	 * Import data detail from prospect to FNA
	 */ 
    function importDataInDetail(section){
    	$scope.moduleService.findElementInDetail_V3([section, 'ContactInformation', 'Person', 'FullName']).$ = $scope.moduleProspectPersonalService.findElementInDetail_V3(['Personal', 'FullName']).$;
		$scope.moduleService.findElementInDetail_V3([section, 'ContactInformation', 'Person', 'Age']).$ =$scope.moduleProspectPersonalService.findElementInDetail_V3(['Personal', 'Age']).$;
		$scope.moduleService.findElementInDetail_V3([section, 'ContactInformation', 'Person', 'BirthDate']).$ = $scope.moduleProspectPersonalService.findElementInDetail_V3(['Personal', 'BirthDate']).$;
		$scope.moduleService.findElementInDetail_V3([section, 'ContactInformation', 'Person', 'Occupation']).Value = $scope.moduleProspectPersonalService.findElementInDetail_V3(['Personal', 'Occupation']).Value;
		$scope.moduleService.findElementInDetail_V3([section, 'ContactInformation', 'Person', 'Gender']).Value = $scope.moduleProspectPersonalService.findElementInDetail_V3(['Personal', 'Gender']).Value;
    	$scope.moduleService.findElementInDetail_V3([section, 'ContactInformation', 'FinancialsPosition', 'TotalAsset']).$ = $scope.moduleProspectPersonalService.findElementInDetail_V3(['CurrentFinancialPosition', 'CurrentAssetsAndLiabilities','TotalAssets']).$;
    	$scope.moduleService.findElementInDetail_V3([section, 'ContactInformation', 'FinancialsPosition', 'TotalLiabilities']).$ = $scope.moduleProspectPersonalService.findElementInDetail_V3(['CurrentFinancialPosition', 'CurrentAssetsAndLiabilities','TotalLiabilities']).$;
    	$scope.moduleService.findElementInDetail_V3([section, 'ContactInformation', 'FinancialsPosition', 'Networth']).$ = $scope.moduleProspectPersonalService.findElementInDetail_V3(['CurrentFinancialPosition', 'CurrentAssetsAndLiabilities', 'NetWorth']).$;				
		$scope.moduleService.findElementInDetail_V3([section, 'ContactInformation', 'AnnualCashFlow', 'AnnualIncome']).$ = $scope.moduleProspectPersonalService.findElementInDetail_V3(['OtherInfomation', 'AnnualIncome']).$;
    	$scope.moduleService.findElementInDetail_V3([section, 'ContactInformation', 'AnnualCashFlow', 'AnnualExpenses']).$ = $scope.moduleProspectPersonalService.findElementInDetail_V3(['CurrentFinancialPosition', 'AnnualCashFlowAndBudgetedFunds', 'TotalAnnualExpenses']).$;
    	$scope.moduleService.findElementInDetail_V3([section, 'ContactInformation', 'AnnualCashFlow', 'ShortageSurplus']).$ = $scope.moduleProspectPersonalService.findElementInDetail_V3(['CurrentFinancialPosition', 'AnnualCashFlowAndBudgetedFunds', 'NetCashFlowOrSurplus']).$;
    	$scope.moduleService.findElementInDetail_V3([section, 'RetirementFundInfo', 'CurrentAnnualIncome']).$ = $scope.moduleProspectPersonalService.findElementInDetail_V3(['OtherInfomation', 'AnnualIncome']).$;	    	
    	$scope.moduleService.findElementInDetail_V3([section, 'ContactInformation', 'InvestmentRiskProfile']).$ = $scope.moduleProspectPersonalService.findElementInDetail_V3(['InvestmentRiskProfile', 'RiskProfile']).$;
    	importExistingFinancialPlans(section);
    	$scope.computeTag([[section]]);
    	
    }
    
    /**
	 * Import data ExistingFinancialPlans from prospect
	 */ 
    function importExistingFinancialPlans(section){
    	var existingFinancialPlanFNA = $scope.moduleService.convertToArray($scope.moduleService.findElementInDetail_V3([section, 'ContactInformation', 'ExistingFinancialPlans', 'ExistingFinancialPlan']));
    	var existingFinancialPlanProspect = $scope.moduleService.convertToArray($scope.moduleProspectPersonalService.findElementInDetail_V3(['ExistingFinancialPlans','ExistingFinancialPlan']));
    	for (var i = 0; i < existingFinancialPlanProspect.length; i++){
    		
    		if(!existingFinancialPlanFNA[i]){
    			//Add more existingFinancialPlan element for FNA
    			$scope.moduleService.addElementInElement_V3($scope.moduleService.detail, [section, 'ExistingFinancialPlans'],[section,'ExistingFinancialPlan']);    		 
    		}
    		
			$scope.moduleService.findElementInElement_V3(existingFinancialPlanFNA[i], ['PolicyType']).Value = $scope.moduleProspectPersonalService.findElementInElement_V3(existingFinancialPlanProspect[i], ['PolicyType']).Value
			$scope.moduleService.findElementInElement_V3(existingFinancialPlanFNA[i], ['YearOfIssue']).$ = $scope.moduleProspectPersonalService.findElementInElement_V3(existingFinancialPlanProspect[i], ['YearOfIssue']).$
			$scope.moduleService.findElementInElement_V3(existingFinancialPlanFNA[i], ['PremiumValue']).$ = $scope.moduleProspectPersonalService.findElementInElement_V3(existingFinancialPlanProspect[i], ['PremiumValue']).$
			$scope.moduleService.findElementInElement_V3(existingFinancialPlanFNA[i], ['PremiumType']).$ = $scope.moduleProspectPersonalService.findElementInElement_V3(existingFinancialPlanProspect[i], ['PremiumType']).Value
			$scope.moduleService.findElementInElement_V3(existingFinancialPlanFNA[i], ['DeathOfBenefit']).$ = $scope.moduleProspectPersonalService.findElementInElement_V3(existingFinancialPlanProspect[i], ['DeathOfBenefit']).$
			$scope.moduleService.findElementInElement_V3(existingFinancialPlanFNA[i], ['TBD']).$ = $scope.moduleProspectPersonalService.findElementInElement_V3(existingFinancialPlanProspect[i], ['TBD']).$
			$scope.moduleService.findElementInElement_V3(existingFinancialPlanFNA[i], ['CriticalIllness']).$ = $scope.moduleProspectPersonalService.findElementInElement_V3(existingFinancialPlanProspect[i], ['CriticalIllness']).$
			$scope.moduleService.findElementInElement_V3(existingFinancialPlanFNA[i], ['HSBenefit']).$ = $scope.moduleProspectPersonalService.findElementInElement_V3(existingFinancialPlanProspect[i], ['HSBenefit']).$
			
			$scope.moduleService.findElementInDetail_V3([section, 'ContactInformation', 'ExistingFinancialPlans'])['@counter'] = i+1;
    	}
    	
    }
    
    /**
	 * Import a children into Education fund
	 */
    $scope.importChildrenEducationFund = function(card, metaData, $event) {
		var self = this;
		self.card = card;		
		self.addCard(card, function addedChildEle (addedEle) {
			self.moduleService.findElementInElement_V3(addedEle, ['ChildName']).$ = metaData['factfind:ChildFullName'].$;		
            card.root.isDetailChanged = false;
            card.isDetailChanged = false;
			commonUIService.showNotifyMessage("v3.mynewworkspace.message.ImportProspectSuccessfully", "success");
			self.closeChildCards(3, $event);
		});
	}
    

    /**
	 * Save FNA Detail 
	 */
    $scope.saveDetail = function(){
    	
    	if(commonService.hasValueNotEmpty($scope.moduleService.findElementInDetail_V3(['DocInfo','DocId'])))
    		$scope.moduleService.findElementInDetail_V3(['DocStatus'])['BusinessStatus'] = commonService.CONSTANTS.STATUS.COMPLETED;
    	
        $scope.moduleService.saveDetail_V3($scope.resourceURL, true).then(function(data){
            if ($scope.moduleService.isSuccess(data)) {
            	$scope.moduleService.getDetail_V3($scope.resourceURL).then(function(data){
            		$scope.reSetupConcreteUiStructure($scope.moduleService.detail);
            		commonUIService.showNotifyMessage("v3.mynewworkspace.message.SaveFNASuccessfully", "success");
            	});
            } else {
                // set INVALID status
                $scope.moduleService.findElementInDetail_V3(['DocStatus'])['DocumentStatus'] = "INVALID";
                $scope.moduleService.findElementInDetail_V3(['DocStatus'])['BusinessStatus'] = "DRAFT";
                // Appending dialog to document.body to cover sidenav in docs app
                var confirm = $mdDialog.confirm()
                      .title($filter('translate')("MSG-FQ06"))
	   			      .ok($filter('translate')("v3.yesno.enum.Y"))
	   			      .cancel($filter('translate')("v3.yesno.enum.N"));
                $mdDialog.show(confirm).then(function() {
                    $scope.moduleService.saveDetail_V3($scope.resourceURL, false).then(function(data){
                        commonUIService.showNotifyMessage("v3.mynewworkspace.message.SaveDraftFNASuccessfully", "success");
                    });
                }, function() {
                    var a = 'No';
                });
            }
            
            $scope.reSetupConcreteUiStructure($scope.moduleService.detail);
        });
    };
    
    /**
     * NOTE: This function use to review Accepted BI Details pdf.
     */
    $scope.printBIPreviewPdf = function() {
		 if(salecaseUIService.findElementInDetail_V3(['Quotations'])['@counter'] == 0){
			 return;
		 }
		 var quotations = salecaseUIService.findElementInDetail_V3(['Quotation']);
		 var accepted = false;
		 for (var i = (quotations.length - 1); i >= 0; i--){
			 illustrationUIService.findDocument_V3($scope.resourceURL, quotations[i]['@refUid']).then(function(data){
				 if(illustrationUIService.findElementInElement_V3(data, ['BusinessStatus']) == 'ACCEPTED'){
					 illustrationUIService.detail = data;
					 illustrationUIService.productName = illustrationUIService.findElementInDetail_V3(["DocInfo","Product"]);
					 illustrationUIService.generateDocument_V3($scope.portletId).then(function(data) {
						 if (illustrationUIService.isSuccess(data)) {
							 illustrationUIService.group = illustrationUIService.getProductGroup_V3(illustrationUIService.productName);
							 if (illustrationUIService.group == commonService.CONSTANTS.PRODUCT_GROUP.MOTOR) {
								 convertElementToArray();
							 }
							 
							 $scope.printPdfService.generatePdf($scope.portletId, illustrationUIService, illustrationUIService.productName, "abridge");
						 } else {
							 commonUIService.showNotifyMessage("v3.myworkspace.message.GeneratePDFUnsuccessfully");
						 }
					 });
				 }
			 });				 
		 } 
	};

    /**
     * NOTE: This function use to print pdf of FNA only.
     */
	$scope.printPdf = function(actionType) {
		factfindUIService.generateDocument_V3($scope.portletId).then(function(data) {
			if (factfindUIService.isSuccess(data)){
				factfindUIService.saveDetail_V3($scope.resourceURL, true).then(function(result){
					if (factfindUIService.isSuccess(result)) {
				    	printPdfService.generatePdf($scope.portletId, factfindUIService, "", actionType);
				    	
				    	if(commonService.hasValueNotEmpty(factfindUIService.insideDoc)){
				    		factfindUIService.updateInsideDoc(factfindUIService.detail);
				    	}
				    	
					} else {
						commonUIService.showNotifyMessage("v3.myworkspace.message.GeneratePDFUnsuccessfully");
					}
				});
			} else {
				commonUIService.showNotifyMessage("v3.myworkspace.message.GeneratePDFUnsuccessfully");
			}
		});
	};
	
	/**
	 * Compute tags by tag name
	 */
    $scope.computeTag = function (element){
        $scope.moduleService.computeElementAndUpdateLazyList($scope.resourceURL, element).then(function(data){
            if ($scope.moduleService.isSuccess(data)) {
				commonUIService.showNotifyMessage("v3.myworkspace.message.ComputeSuccessfully", "success");
			} else {
				commonUIService.showNotifyMessage("v3.myworkspace.message.ComputeUnuccessfully");
			}
            $scope.reSetupConcreteUiStructure($scope.moduleService.detail);
            
            if($scope.isSection != undefined){
            	$scope.checklistPreViewFGS($scope.isSection);
            }
            
        });
    }
    
    /**
	 * Check Exiting Children to do not duplicate when import prospect
	 */
    $scope.checkExitsChildren = function (metaData, card){
    	var flag = true;
    	var counter = parseInt(card.parent.refDetail['@counter']);
    	for(var i = 0; i < counter; i++){
    		if(card.parent.refDetail['factfind:EducationFundInfo'][i]['factfind:ChildName'].$ == metaData['factfind:ChildFullName'].$)
    			flag = false;
    	}
    	if(!commonService.hasValueNotEmpty(metaData['@refUid']))
    		flag = false;    		
    	return flag;
	}
    
    /**
	 * Compute All document detail
	 */
    $scope.compute = function(){
	    $scope.moduleService.computeFactFindDetail($scope.resourceURL).then(function(data){
	    	if ($scope.moduleService.isSuccess(data)) {
	    		if(commonService.hasValueNotEmpty(factfindUIService.insideDoc)){
		    		factfindUIService.updateInsideDoc(factfindUIService.detail);
		    	}
	    		$scope.moduleService.findElementInDetail_V3(['DocStatus'])['DocumentStatus'] = "VALID";
				commonUIService.showNotifyMessage("v3.myworkspace.message.ComputeSuccessfully", "success");
			} else {
				$scope.moduleService.findElementInDetail_V3(['DocStatus'])['DocumentStatus'] = "INVALID";
				commonUIService.showNotifyMessage("v3.myworkspace.message.ComputeUnuccessfully");
			}
	    	$scope.reSetupConcreteUiStructure($scope.moduleService.detail);
	    	if($scope.isSection != undefined){
            	$scope.checklistPreViewFGS($scope.isSection);
            }
	    });
    }
    
    /**
	 * Remove Client card
	 */
    $scope.removeCardClient = function(message){
    	var self = this;
    	if(commonService.hasValueNotEmpty($scope.moduleService.findElementInDetail_V3(['JointApplicant'])['@refUid'])){
    		commonUIService.showNotifyMessage("v3.mynewworkspace.message.doNotAllowToRemoveClientBeforeRemoveJointApplicant");
    	}else{
    		self.removeCard_New(message);
    	}    	
    }
    
    /**
	 * Remove Joint Applicant card
	 */
    $scope.removeCardJointApplicant = function(message){
    	var self = this;
    	self.removeCard_New(message);
    }
    
    /**
	 * Refresh FNA Document to initial
	 */
    $scope.refreshFNADoc = function(){
    	$scope.moduleService.refresh_V3($scope.resourceURL).then(function(data){
			$scope.reSetupConcreteUiStructure($scope.moduleService.detail); // refresh the values in multiple cards
		});
    }
    
    /**
	 * Set ranking to empty when priority is 'NR' on Financial Goals Selection Card
	 */
    $scope.setRankingWhenPriorityIsNR = function(priorityArray, rankingArray){
    	if($scope.moduleService.findElementInDetail_V3(priorityArray).Value == "NR"){
    		$scope.moduleService.findElementInDetail_V3(rankingArray).$ = "";
    	}
    }
    
    /**
	 * Set OtherRelationship to empty when Relationship is not 'O' on ElderlyDependant Card
	 */
    $scope.setRelationshipOthers = function(index){
    	var listNode = $scope.moduleService.convertToArray($scope.moduleService.findElementInDetail_V3(['Client', 'Dependants', 'ElderDependants', 'ElderDependant']));
    	var childrenNode =  listNode[index];
    	if($scope.moduleService.findElementInElement_V3(childrenNode, ['Relationship']).Value != "O"){
    		$scope.moduleService.findElementInElement_V3(childrenNode, ['OtherRelationship']).$ = "";
    	}
    }
    
    /**
	 * Check some information to show value of label key on card
	 */
    $scope.checklistPreViewFGS = function(section){
    	$scope.isSection = section;
    	var listFinancialProtection = getListFinancialGoalsSelection($scope.moduleService.findElementInDetail_V3([section, 'FinancialProtection']));
    	var listWealthAccumulation = getListFinancialGoalsSelection($scope.moduleService.findElementInDetail_V3([section, 'WealthAccumulation']));
    	$scope.listPreViewFGS = $filter('orderBy')(listFinancialProtection.concat(listWealthAccumulation), ['Level','Ranking']);
    	if(angular.isArray($scope.listPreViewFGS)){
    		$scope.moduleService.findElementInDetail_V3([section, 'FinancialGoalsSelection', 'NumberOfGoals']).$ = $scope.listPreViewFGS.length;
    	}
    	$scope.checkFinancialGoalsAnalysis(section);
    	
    };
    
    /**
	 * Check Priority information to show value of label key on Financial Goals Selection Card
	 */
    function getListFinancialGoalsSelection(listObject){
    	var listItem = [];
    	var lazyListObject = [{"value":"H","group":"0"},{"value":"M","group":"1"},{"value":"L","group":"2"},{"value":"NR","group":"3"}];
    	for (var p in listObject) {
        	var tmpObject = {"Name":"", "Priority":"", "Ranking":"", "Level":""};
    		if(angular.isObject(listObject[p])){
    			tmpObject.Name = p.split(':')[1];
    			tmpObject.Priority = getValueByPropertyName(listObject[p],'Value');
    			tmpObject.Ranking = getValueByPropertyName(listObject[p],'$');
    			tmpObject.Level = getValue(lazyListObject, getValueByPropertyName(listObject[p],'Value'));
    			if(tmpObject.Priority != 'NR')
    				listItem.push(tmpObject);
    		}
          }
    	
    	function getValue(items, value) {
    		for (var i in items) {
                if (items[i]['value'] == value) {
                    return items[i]['group'];
                }
            }
        };
    	
    	return listItem;
    }
    
    /**
	 * Check Amount Required, Amount Saved to show value of label key on Financial Goals Selection Card
	 */
    $scope.checkFinancialGoalsAnalysis = function(section){
    	 $scope.totalRequired = 0;
    	 $scope.totalSavings = 0;
    	 $scope.totalRequiredEducationFund = 0;
    	 $scope.totalSavingsEducationFund = 0;
    	 
    	//ProtectionUponDeathInfo
    	if($scope.moduleService.findElementInDetail_V3([section, 'FinancialGoalsSelection', 'ProtectionUponDeath', 'Priority']).Value != "NR"){
    		$scope.totalRequired += checkValueIsFloat($scope.moduleService.findElementInDetail_V3([section, 'ProtectionUponDeathInfo', 'TotalRequiredForIncomeProtection']).$);
    		$scope.totalSavings += checkValueIsFloat($scope.moduleService.findElementInDetail_V3([section, 'ProtectionUponDeathInfo', 'ProtectionExistingFundsSetAside']).$);
    	}
    	
    	//RetirementFundInfo
    	if($scope.moduleService.findElementInDetail_V3([section, 'FinancialGoalsSelection', 'RetirementFund', 'Priority']).Value != "NR"){
	    	$scope.totalRequired += checkValueIsFloat($scope.moduleService.findElementInDetail_V3([section, 'RetirementFundInfo','TotalAmountRequiredAtRetirement']).$);
	    	$scope.totalSavings += checkValueIsFloat($scope.moduleService.findElementInDetail_V3([section, 'RetirementFundInfo','ExistingFundsSetAside']).$);
	    }
    	
    	//MediumLongTermSavingsInfo
    	if($scope.moduleService.findElementInDetail_V3([section, 'FinancialGoalsSelection', 'MediumLongTermSavings', 'Priority']).Value != "NR"){
    		$scope.totalRequired += checkValueIsFloat($scope.moduleService.findElementInDetail_V3([section, 'MediumLongTermSavingsInfo', 'AmountRequired']).$);
    		$scope.totalSavings += checkValueIsFloat($scope.moduleService.findElementInDetail_V3([section, 'MediumLongTermSavingsInfo', 'ExistingFundsSetAside']).$);
    	}
    	
    	//CriticalIllnessInfo
    	if($scope.moduleService.findElementInDetail_V3([section, 'FinancialGoalsSelection', 'CriticalIllness', 'Priority']).Value != "NR"){
    		$scope.totalRequired += checkValueIsFloat($scope.moduleService.findElementInDetail_V3([section, 'CriticalIllnessInfo', 'TotalRequiredForCriticalIllness']).$);
    	}
    	
    	//MortgageProtection
    	if($scope.moduleService.findElementInDetail_V3([section, 'FinancialGoalsSelection', 'Mortgage', 'Priority']).Value != "NR"){
    		$scope.totalRequired += checkValueIsFloat($scope.moduleService.findElementInDetail_V3([section, 'MortgageProtection', 'TotalPaid']).$);
    	}
    	
    	//EducationFundInfos
    	if($scope.moduleService.findElementInDetail_V3([section, 'FinancialGoalsSelection', 'EducationFund', 'Priority']).Value != "NR"){
    		var listItem = [];
    		if($scope.moduleService.findElementInDetail_V3([section, 'EducationFundInfos'])['@counter'] > 0){
    			listItem = $scope.moduleService.convertToArray($scope.moduleService.findElementInDetail_V3([section, 'EducationFundInfos', 'EducationFundInfo']))    			
    			angular.forEach(listItem, function(item) {
    				$scope.totalRequiredEducationFund += checkValueIsFloat($scope.moduleService.findElementInElement_V3(item, ['TotalEducationFundRequiredTodayStartOfEducation']).$);
    				$scope.totalSavingsEducationFund += checkValueIsFloat($scope.moduleService.findElementInElement_V3(item, ['ExistingFundsSetAside']).$);
    			});
    		}
    		
    		$scope.totalRequired += $scope.totalRequiredEducationFund;
    		$scope.totalSavings += $scope.totalSavingsEducationFund;
    	}
    	
    	if(section === 'Client'){
    		$scope.totalSurplus = $scope.totalSavings - $scope.totalRequired;
    	}
    }
    
    /**
	 * Check and convert string to float
	 */
    function checkValueIsFloat(data){
    	if(data != '' & data != undefined && angular.isString(data))
    		return parseFloat(data.replace(/,/gi,''));
    	else
    		return 0;
    }
    
    /**
	 * Call init() function  
	 */
    $scope.init();

}];

