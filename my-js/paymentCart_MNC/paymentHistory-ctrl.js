'use strict';
var PaymentHistoryMNCCtrl = ['$scope', '$rootScope', '$injector', '$log', '$mdDialog', '$filter', '$http', 'commonService', 'commonUIService', 'clientUIService', 'policyUIService', 'claimUIService', 'prospectUIService', 'illustrationUIService', 'applicationUIService', 'salecaseUIService', 
                     		'claimNotificationUIService', 'paymentUIService', 'transactionUIService', 'ecovernoteUIService', 'fileReader', 'printPdfService', '$state', '$q', 'urlService', 'configurationUIService', '$translate', '$translatePartialLoader', 'loadingBarService', '$timeout',
function($scope, $rootScope, $injector, $log, $mdDialog, $filter, $http, commonService, commonUIService, clientUIService, policyUIService, claimUIService, prospectUIService, illustrationUIService, applicationUIService, salecaseUIService, 
		claimNotificationUIService, paymentUIService, transactionUIService, ecovernoteUIService, fileReader, printPdfService, $state, $q, urlService, configurationUIService, $translate, $translatePartialLoader, loadingBarService, $timeout) {
		var portletName = myArrayPortletId["payment-history"];
		$scope.moduleServiceTransaction = transactionUIService;
		$scope.resourceURL = paymentUIService.initialPortletURL(portletName);
		$scope.printPdfService = printPdfService;
		$scope.initContextPath = contextPathRoot;
		$scope.fileReaderService = fileReader;
		$scope.fileReaderService.portletId=portletName;
		$scope.contextPathTheme = angular.contextPathTheme;
		// pagination
		$scope.currentPage = 1;
		$scope.pageSizes = [5, 10, 20];
		$scope.pageSize = 5;
		
		// search field
		$scope.referenceNo = "";
		$scope.submissionNo = "";
		$scope.paymentDateFrom = "";
		$scope.paymentDateTo = "";
		
		//check platform environment
		var platformService = $injector.get('platformService');
	    var connectService = $injector.get('connectService');                
	    platformService.getPlatformId().then(function gotPlatformId(platformId) {
	        $log.debug("Current Platform: " + platformId);
	        connectService.setPlatform(platformId);
	        $scope.loadPaidPaymentList();
	    });
		
		// load PAID payment list
		$scope.loadPaymentList = function (){
			paymentUIService.getDocumentList_V3($scope.resourceURL).then(function(data){
				if(paymentUIService.findElementInElement_V3(data, ['MetadataDocuments'])!==undefined
						&& paymentUIService.findElementInElement_V3(data, ['MetadataDocuments'])!==''){
					$scope.paymentList  = $scope.convertObjectToArray(data.MetadataDocuments.MetadataDocument);
					$scope.paidPaymentList = [];
					// get paid payment only
					$scope.paymentList = commonUIService.sortList($scope.paymentList, "CreatedDate", true);
					for (var i=0; i< $scope.paymentList.length; i++){
						$scope.paymentList[i].isShow = true;
						$scope.paymentList[i].id = i;						
						if($scope.paymentList[i].BusinessStatus == "PAID"){
							$scope.paidPaymentList.push($scope.paymentList[i]);
						}
					}
					$scope.isPaymentReadyLoaded=true;
				}
				else if(paymentUIService.findElementInElement_V3(data, ['MetadataDocuments'])==''){
					$scope.isPaymentReadyLoaded=true;
					$log.debug('No payment');
					$scope.message = "There is no data.";
				}
				else{
					$scope.isPaymentReadyLoaded=true;
				}
		     });
		};
		
		$scope.loadPaidPaymentList = function (){
			var EQKeyAndValue = [];
			var NEKeyAndValue = [];
			EQKeyAndValue.push({"key": "DocType", "value": "client-payment"});
			NEKeyAndValue.push({"key": "AgentPaymentId", "value": ""});
			var dataSet = paymentUIService.createSearchDatasetWithEQAndNE(EQKeyAndValue, NEKeyAndValue);
			paymentUIService.searchAdvanceMetadata($scope.resourceURL, dataSet).then(function(clientPaymentList){				
				if(clientPaymentList){
					$scope.clientPaymentList = $scope.convertObjectToArray(clientPaymentList);
					transactionUIService.getDocumentList_V3($scope.resourceURL).then(function(agentPaymentList){
	    				if(transactionUIService.findElementInElement_V3(agentPaymentList, ['MetadataDocuments'])!==undefined
	        					&& transactionUIService.findElementInElement_V3(agentPaymentList, ['MetadataDocuments'])!==''){
	    					$scope.agentPaymentList = $scope.convertObjectToArray(agentPaymentList.MetadataDocuments.MetadataDocument);
	    					$scope.agentPaymentList = $scope.getPaidAgentPayment($scope.agentPaymentList);
	    					// list field of agent payment need to merge to client payment
	    					var listAgentFieldMerge = ["PaymentMethod", "TotalPremium", "DocName", "PaymentDate"];
	    					// list field of agent payment after merge to client payment
	    					var listClientFieldMerge = ["AgentPaymentMethod", "TotalPremium", "DocName", "AgentPaymentDate"];
	    					$scope.mergeMetadataPayment($scope.agentPaymentList, listAgentFieldMerge, $scope.clientPaymentList, listClientFieldMerge);
	    					$scope.clientPaymentList = commonUIService.sortList($scope.clientPaymentList, "UpdatedDate", true);
	    				}
	    			});
				}else{
					$scope.isPaymentReadyLoaded=true;
					showNotifyMessage("v3.transactioncenter.message.Errorhasoccured");
				}
				
			});			
		};
		
		$scope.getPaidAgentPayment = function getPaidAgentPayment(agentPaymentList){
			var paidAgent = [];
			for(var i=0; i<agentPaymentList.length; i++){
				if(agentPaymentList[i].BusinessStatus == "PAID")
					paidAgent.push(agentPaymentList[i]);
			}
			return paidAgent;
		}
		
		$scope.getListClientPaymentIdFromAgentPaymentList = function getListClientPaymentIdFromAgentPaymentList(agentPaymentList){
			var clientPaymentList = "";
			for(var i = 0; i<agentPaymentList.length; i++){
				if(agentPaymentList[i].ClientPayments)
					clientPaymentList += agentPaymentList[i].ClientPayments;
			}
			return clientPaymentList.replace(/;/g, ',');
		}
		
		$scope.showTransactionDetail = function(index, payment){
			var caret = angular.element("#endorse-submenu-caret-" + index);
			caret.toggleClass("rotate-caret");
			if(payment.isShow == true){
				transactionUIService.findDocument_V3($scope.resourceURL, payment.AgentPaymentId).then(function(data){
					payment.ChequeNo = transactionUIService.findElementInDetail_V3(['ChequeNumber']).$;
					payment.ChequeDate = transactionUIService.findElementInDetail_V3(['ChequeDate']).$;
					payment.BankName = transactionUIService.findElementInDetail_V3(['BankName']).Value;
					payment.AdviceNo = transactionUIService.findElementInDetail_V3(['AdviceNo']).$;
					payment.AdviceDate = transactionUIService.findElementInDetail_V3(['AdviceDate']).$;
					payment.Remark = transactionUIService.findElementInDetail_V3(['Comments']);
					payment.isShow = !payment.isShow;	
				});
			}else{
				payment.isShow = !payment.isShow;	
			}
			
		};
		
		$scope.convertObjectToArray = function(data){
			if(!$.isArray(data)){
				var result = [];
				result.push(data);
				return result;
			}
			else{
				 return data;
			}
		};
		
		// show/hide payment detail
		$scope.showPaymentDetail = function(index, payment){
			var caret = angular.element("#endorse-submenu-caret-" + index);
			caret.toggleClass("rotate-caret");
			payment.isShow = !payment.isShow;	
		};
		
		$scope.searchPayment = function searchPayment(){
			var EQKeyAndValue = [];
			var NEKeyAndValue = [];
			EQKeyAndValue.push({"key": "DocType", "value": "client-payment"});
			if($scope.referenceNo)
				EQKeyAndValue.push({"key": "ReferenceNo", "value": $scope.referenceNo});    
			var dataSet = paymentUIService.createSearchDatasetWithEQAndNE(EQKeyAndValue, NEKeyAndValue);
			paymentUIService.searchAdvanceMetadata($scope.resourceURL, dataSet).then(function(data){
				if(data == ""){
					$scope.clientPaymentList = [];
				}else{
					$scope.clientPaymentList = $scope.convertObjectToArray(data);
					$scope.clientPaymentList = commonUIService.sortList($scope.clientPaymentList, "CreatedDate", true);
					// list field of agent payment need to merge to client payment
					var listAgentFieldMerge = ["PaymentMethod", "TotalPremium", "DocName", "PaymentDate"];
					// list field of agent payment after merge to client payment
					var listClientFieldMerge = ["AgentPaymentMethod", "TotalPremium", "DocName", "AgentPaymentDate"];
					if(($scope.clientPaymentList!=undefined&&$scope.clientPaymentList.length>0)&&($scope.agentPaymentList!=undefined&&$scope.agentPaymentList.length>0)){
					$scope.mergeMetadataPayment($scope.agentPaymentList, listAgentFieldMerge, $scope.clientPaymentList, listClientFieldMerge);
					}
					if($scope.submissionNo){
						var tempList = [];
						for (var i=0; i< $scope.clientPaymentList.length; i++){
							if($scope.clientPaymentList[i].DocName == $scope.submissionNo)
								tempList.push($scope.clientPaymentList[i]);
						}
						$scope.clientPaymentList = tempList;
					}
					if($scope.paymentDateFrom || $scope.paymentDateTo){
						
						$scope.clientPaymentList = paymentUIService.searchInDateRange($scope.clientPaymentList, "PaymentDate", $scope.paymentDateFrom, $scope.paymentDateTo);
					}
					
				}
				
			});
		}
		
		$scope.printPdf = function(docType, docId) {
			if (docType == 'client-payment') {
				$scope.moduleService = paymentUIService;
			};
			if (docType == 'agent-payment') {
				$scope.moduleService = transactionUIService;
			};
			$scope.moduleService.findDocument_V3($scope.resourceURL, docId).then(function(data){
				$scope.moduleService.detail = data;  
				$scope.moduleService.generateDocument_V3(portletName).then(function(data) {
					if ($scope.moduleService.isSuccess(data)) {
						
						if(docType == 'agent-payment'){
							$scope.moduleService.jsonToArray($scope.moduleService.detail, 'ClientPayments', 'ClientPayment');
						}
						$scope.printPdfService.generatePdf(portletName, $scope.moduleService, "", "newbusiness");
					} else {
						commonUIService.showNotifyMessage("v3.myworkspace.message.GeneratePDFUnsuccessfully");
					}
				});
			});
		};
		
		$scope.openPdfReferenceNo = function(payment){
			if(payment.CaseType.toLowerCase() == "newbusiness" || payment.CaseType.toLowerCase() == "renewal"){
				if(payment.DocType == "business-transaction"){
					salecaseUIService.findDocument_V3($scope.resourceURL, payment.DocId).then(function(data){
						var caseId = salecaseUIService.findElementInDetail_V3(["business-transaction:CaseId"]).$;
						$scope.printApplicationPDF(caseId);
					})
				}else{
					$scope.printApplicationPDF(payment.CaseId);
				}
				salecaseUIService.findDocument_V3($scope.resourceURL, payment.CaseId).then(function(data){
					var printList = salecaseUIService.findElementInDetail_V3(['Print']);
					var appPrintId = $scope.getPrintID(printList, "application");
					/*salecaseUIService.getReourceFileByCaseId($scope.resourceURL, payment.CaseId).then(function(data){
						var doc = $scope.getDocFromDocumentList(data.MetadataDocuments.MetadataDocument, appPrintId);
						$scope.fileReaderService.openFileReader("view",doc,[],'');
					})*/
					salecaseUIService.findMetadata_V3($scope.resourceURL, salecaseUIService.getListUidPrintFromCase()).then(function(data){
						var doc = $scope.getDocFromDocumentList(data.MetadataDocuments.MetadataDocument, appPrintId);
						$scope.fileReaderService.openFileReader("download",doc,[],'');
					})
					
				});
			}else{
				if(payment.DocType == "business-transaction"){
					salecaseUIService.findDocument_V3($scope.resourceURL, payment.DocId).then(function(data){
						var caseId = salecaseUIService.findElementInDetail_V3(["business-transaction:CaseId"]).$;
						$scope.printEcoverNotePDF(caseId);
					})
				}else{
					$scope.printEcoverNotePDF(payment.CaseId);
				}
			}
		}
		
		$scope.printApplicationPDF = function printApplicationPDF(caseId){
			salecaseUIService.findDocument_V3($scope.resourceURL, caseId).then(function(data){
				var printList = salecaseUIService.findElementInDetail_V3(['Print']);
				var appPrintId = $scope.getPrintID(printList, "application");
				/*salecaseUIService.getReourceFileByCaseId($scope.resourceURL, caseId).then(function(data){
					var doc = $scope.getDocFromDocumentList(data.MetadataDocuments.MetadataDocument, appPrintId);
					$scope.fileReaderService.openFileReader("download",doc,[],'');
				})*/				
				salecaseUIService.findMetadata_V3($scope.resourceURL, salecaseUIService.getListUidPrintFromCase()).then(function(data){
					var doc = $scope.getDocFromDocumentList(data.MetadataDocuments.MetadataDocument, appPrintId);
					$scope.fileReaderService.openFileReader("download",doc,[],'');
				})
			});
		}
		
		$scope.printEcoverNotePDF = function printEcoverNotePDF(caseId){
			salecaseUIService.findDocument_V3($scope.resourceURL, caseId).then(function(data){
				var eCover = salecaseUIService.findElementInDetail_V3(["case-management-motor:eCoverNote"]);
				var eCoverId = eCover["@refUid"];
				var product = eCover["@refDocType"].split("=")[1];
				
				ecovernoteUIService.findDocument_V3($scope.resourceURL, eCoverId).then(function(data){
					ecovernoteUIService.productName = product;
					ecovernoteUIService.generateDocument_V3(portletName).then(function(data) {
						if (ecovernoteUIService.isSuccess(data)) {
							ecovernoteUIService.jsonToArray(ecovernoteUIService.detail, 'person:IDs', 'person:ID');
							ecovernoteUIService.jsonToArray(ecovernoteUIService.detail, 'person:Addresses', 'person:Address');
							ecovernoteUIService.jsonToArray(ecovernoteUIService.detail, 'person:Contacts', 'person:Contact');
							ecovernoteUIService.jsonToArray(ecovernoteUIService.detail, 'ecovernote:OptionalCoverages', 'ecovernote:OptionalCoverage');
							
							$scope.printPdfService.generatePdf(portletName, ecovernoteUIService, product, "endorsement");
						} else {
							commonUIService.showNotifyMessage("v3.myworkspace.message.GeneratePDFUnsuccessfully");
						}
					});
				});
			})
		}
		
		$scope.getPrintID = function(printList, docType){
			for(var i = 0; i<printList.length; i++){
				if(this.moduleServiceTransaction.findElementInElement_V3(printList[i], ['PrintDoctype']).$ == docType)
					return printList[i]["@refResourceUid"];
			}
			return undefined;
		}
		
		$scope.getDocFromDocumentList = function(docList, printId){
			for(var i = 0; i<docList.length; i++){
				if(docList[i]["DocId"] == printId)
					return docList[i];
			}
			return undefined;
		}
		
		
		$scope.mergeMetadataPayment = function mergeMetadata(listMetadataSrc, listAgentFields, listMetadataDes, listClientFields){
			for(var i = 0; i < listMetadataDes.length; i++){
				listMetadataDes[i].isShow = true;
				for(var j = 0; j < listMetadataSrc.length; j++){
					if(listMetadataSrc[j].ClientPayments){
						var clientPaymentIds = listMetadataSrc[j].ClientPayments.split(";");
						if(clientPaymentIds.indexOf(listMetadataDes[i].DocId) != -1){
							for(var k = 0; k < listAgentFields.length; k++){
								if(listMetadataSrc[j][listAgentFields[k]])
									listMetadataDes[i][listClientFields[k]] = angular.copy(listMetadataSrc[j][listAgentFields[k]]);
							}
							break;
						}            					
					}
				}
			}
		}
}];
