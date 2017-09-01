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

 * //**************************************************************************************/

'use strict';
var TransactionMNCDetailCtrl = ['$q', '$filter', '$http', '$scope', '$mdToast', '$compile', 'fileReader', 'commonService', 'prospectUIService', 'salecaseUIService', 'paymentUIService', 'illustrationUIService', 'transactionUIService', 'ajax', '$document', 'urlService', '$log', '$state', '$rootScope', '$timeout', '$mdSidenav', '$mdDialog', '$translate', '$translatePartialLoader', 'commonUIService', 'printPdfService', 'uiRenderPrototypeService', 'ecovernoteUIService', 'loadingBarService', 'translateService', 'applicationUIService', 'mobileAppCoreModule',
    function($q, $filter, $http, $scope, $mdToast, $compile, fileReader, commonService, prospectUIService, salecaseUIService, paymentUIService, illustrationUIService, transactionUIService, ajax, $document, urlService, $log, $state, $rootScope, $timeout, $mdSidenav, $mdDialog, $translate, $translatePartialLoader, commonUIService, printPdfService, uiRenderPrototypeService, ecovernoteUIService, loadingBarService, translateService, applicationUIService, mobileAppCoreModule) {

		var portletId = myArrayPortletId["payment-cart-mnc"];
	
        $scope.moduleServiceTransaction = transactionUIService;
        $scope.paymentMethod = "";
        $scope.currentPage = 1;
        $scope.pageSizes = [5, 10, 20];
        $scope.pageSize = 5;
        $scope.abc = {};
        $scope.payButton = false;
        $scope.productName = {};
        $scope.productName.Value = "All";
        // search field for transaction center
        $scope.abc.referenceNo = "";
        $scope.abc.transactionType = "All";
        $scope.transactionTypeLazyList = [{ "value": "All", "group": "" }, { "value": "NewBusiness", "group": "" }, { "value": "Renewal", "group": "" }, { "value": "ENDORSEMENT", "group": "" }];
        $scope.abc.effectiveDateFrom = "";
        $scope.abc.effectiveDateTo = "";
        $scope.abc.policyOwner = "";
        $scope.abc.currency = {};
        $scope.abc.currency.Value = "";
        $scope.abc.dueDateFrom = "";
        $scope.abc.dueDateTo = "";
        $scope.idChecked = [];
        $scope.paymentChecked = [];
        $scope.paymentCheckedMock = [];
        $scope.totalPayableAmount = "0.00";
        $scope.totalPremium = "0.00";
        $scope.listUpdateCaseId = [];
        $scope.radio = {};// for select payment by radio button        
        $scope.paymentBasis = false;
        
        $scope.resourceURL = transactionUIService.initialPortletURL(portletId);
        $scope.printPdfService = printPdfService;
        $scope.initContextPath = contextPathRoot;
        $scope.fileReaderService = fileReader;
        $scope.fileReaderService.portletId = portletId;
        $scope.contextPathTheme = angular.contextPathTheme;
        $scope.paymentCart = true;
        $scope.isDisabled = false;

        $scope.init = function init() {
            var self = this;
           if ($scope.paymentCart){
                self.generalConfigCtrl('TransactionDetailCtrl', transactionUIService).then(function() {
                	
                });
            } else{
                self.setupCtrlWithoutDetail('TransactionDetailCtrl', 'payment_center');
                $scope.hideLeftSidebar();
            }
        };
        
        //init detail when card open
        $scope.initWithDetail = function initWithDetail() {
        	var self = this;
            var deferred = $q.defer();
            $scope.canGotoPaymentInfo = false;
    		 transactionUIService.initializeObject_V3($scope.resourceURL).then(function(result) {
    			transactionUIService.findElementInDetail_V3(['PaymentType']).Value = "G";//set default payment basis to gross
                transactionUIService.findElementInDetail_V3(['DocInfo']).DocName = transactionUIService.genDefaultName();
                $scope.paymentSubNo = angular.copy(transactionUIService.findElementInDetail_V3(['DocInfo']).DocName);
                $log.debug(transactionUIService.detail);
                $scope.isSaving = false;
                $scope.payment = transactionUIService.findElementInDetail_V3(['ClientPayment']);
                $scope.template = angular.copy($scope.payment);
                $scope.paymentCart = true;
                if (!$.isArray($scope.payment)) {
                    var a = $scope.payment;
                    $scope.payment = [];
                    $scope.payment.push(a);
                }
                if ($scope.paymentCart) {
                    $scope.loadPendingPaymentList().then(function(data){
                    	loadMethod().then(function(data){
       	                 	deferred.resolve(data);
       	                 });
                    });
                } else {
                    $scope.loadTransactionList();
                }
            });
            return deferred.promise;
        }

        $scope.init();

        $scope.gotoMy = function gotoMy(Contract_Number) {
            commonUIService.goToPortlet("NEW_MY_WORKSPACE");
        };

        //load payment list when loading
        $scope.loadPendingPaymentList = function loadPendingPaymentList() {
             var deferred = $q.defer();
             
            var EQKeyAndValue = [];
            var NEKeyAndValue = [];
            EQKeyAndValue.push({ "key": "DocType", "value": "client-payment" });
            EQKeyAndValue.push({ "key": "AgentPaymentId", "value": "" });
            NEKeyAndValue.push({ "key": "PayableAmount", "value": "0.00" });
            NEKeyAndValue.push({ "key": "BusinessStatus", "value": "PAID" });
            var dataSet = paymentUIService.createSearchDatasetWithEQAndNE(EQKeyAndValue, NEKeyAndValue);
            paymentUIService.searchAdvanceMetadata($scope.resourceURL, dataSet).then(function(data) {
                if (data == "") {
                    	$scope.pendingPaymentList = [];
                }else {
	                    $scope.pendingPaymentList = $scope.convertObjectToArray(data);
	                    $scope.pendingPaymentList = commonUIService.sortList($scope.pendingPaymentList, "CreatedDate", true);
	                    
	                    for (var i = 0; i < $scope.pendingPaymentList.length; i++) {
	                        $scope.pendingPaymentList[i].isShow = true;
	                    }
                }              
                deferred.resolve(data);               
            });
            
            return deferred.promise;
        }

        //load lazy list
        function loadMethod() {
            var deferred = $q.defer();
            transactionUIService.getModuleLazyChoicelist_V3($scope.resourceURL).then(function(data) {
                // translate to use switch_V3 directive
                $scope.paymentModeNoneLife = transactionUIService.findElementInElement_V3(data, ['PaymentMethod']).Option;
                $scope.paymentMethodNoneLife = transactionUIService.findElementInElement_V3(data, ['PaymentType']).Option;
                
                $scope.payorName = transactionUIService.findElementInElement_V3(data, ['PayorName']).Option;
                $scope.bankName = transactionUIService.findElementInElement_V3(data, ['BankName']).Option;
                for (var i = $scope.paymentModeNoneLife.length - 1; i >= 0; i--) {
                    if ($scope.paymentModeNoneLife[i].value === "E-PAY") {
                        $scope.paymentModeNoneLife.splice(i, 1);
                        break;
                    }
                }
                $scope.getComputeLazy().then(function(data){
                	deferred.resolve(data);
                });
            });
            return deferred.promise;
        };

        $scope.getComputeLazy = function() {
            var deferred = $q.defer();
            var product = $scope.productName.Value;
            if (product == 'All') {
            	 product = "regular-unit-link";
            }
            illustrationUIService.getIllustrationLazyList($scope.resourceURL, product).then(function(data) {
                transactionUIService.lazyChoiceList["regular-unit-link"] = data;
                $scope.getProductList();
                deferred.resolve(data);

            });                     
            return deferred.promise;
        };

        //select only one payment
        $scope.setPayment = function(payment) {
            $scope.paymentChecked[0] = payment;
            $scope.listUpdateCaseId[0] = ({ "CaseId": payment.CaseId, "DocId": payment.DocId });
            $scope.totalPayableAmount = parseFloat(payment.PayableAmount.replace(/,/g, ""));
            $scope.TotalPayableAmountCurrency = payment.LocalCurrency;
        };
        
        $scope.preProcessToPayment = function preProcessToPayment() {
        	if (!$scope.paymentChecked.length) {
        		showNotifyMessage("v3.transactioncenter.message.NoPaymentSelected");
        		return false;
        	} else if ($scope.moduleServiceTransaction.findElementInDetail_V3(['PaymentMethod']).Value == undefined
        			|| $scope.moduleServiceTransaction.findElementInDetail_V3(['PaymentMethod']).Value == '') {
        		showNotifyMessage("v3.transactioncenter.message.NoPaymentMethodSelected");
        		return false;
        	} else if ($scope.canGotoPaymentInfo != true) {
        		showNotifyMessage("v3.transactioncenter.message.ClickProceedToPayment");
        		return false;
        	}
        	return true;
        }

        $scope.processToPayment = function processToPayment() {
            localStorage.setItem('listUpdateCaseId', JSON.stringify($scope.listUpdateCaseId));
            localStorage.setItem('listUpdateRealPayment', JSON.stringify($scope.paymentChecked));
            localStorage.setItem('paymentSubNo', $scope.paymentSubNo);
            
            if ($scope.paymentChecked.length || $scope.listUpdateCaseId.length != 0) {
                if ($scope.moduleServiceTransaction.findElementInDetail_V3(['PaymentType']).Value) {
                	if($scope.moduleServiceTransaction.findElementInDetail_V3(['PaymentMethod']).Value != "CASH"){
                		$scope.moduleServiceTransaction.checkIsOnline().then(function(data) {
                			 if (data.errCode == 0) {
                				 if ($scope.moduleServiceTransaction.findElementInDetail_V3(['PaymentMethod']).Value == "CC" || $scope.moduleServiceTransaction.findElementInDetail_V3(['PaymentMethod']).Value == "BT") {
                                     localStorage.setItem('firstTime', true);
                                     $scope.doEPayment();
                                 } else if($scope.listUpdateCaseId.length != 0 && !$scope.paymentChecked.length){
                                 	$scope.canGotoPaymentInfo = true;
                                     $scope.isDisabled = false;
                                     $scope.setVisibleCard("transaction:Step2_PaymentInformation", true);
                                     $scope.moveToCard("transaction:Step2_PaymentInformation");
                                 }else{
                                 	$scope.canGotoPaymentInfo = true;
                                     $scope.isDisabled = false;
                                     $scope.refreshData();
                                 }
                			 }else{
                				 showNotifyMessage(translateService.instant('v3.mobile.check.network.' + data.errCode), "fail");
                			 }
                        });
                	}else if($scope.listUpdateCaseId.length != 0 && !$scope.paymentChecked.length){
                    	$scope.canGotoPaymentInfo = true;
                        $scope.isDisabled = false;
                        $scope.setVisibleCard("transaction:Step2_PaymentInformation", true);
                        $scope.moveToCard("transaction:Step2_PaymentInformation");
                    }else{
                    	$scope.canGotoPaymentInfo = true;
                        $scope.isDisabled = false;
                        $scope.refreshData();
                    }
                } else {
                    $scope.paymentBasis = true;
                }
            } else {
                showNotifyMessage("v3.transactioncenter.message.NoPaymentSelected");
            }
        }

      //payment with credit card

        $scope.doEPayment = function doEPayment() {
        	 for (var i = 0; i < $scope.paymentChecked.length; i++) {
                 // set payments to detail
                 var template = angular.copy($scope.template);
                 template[0]["@refUid"] = $scope.paymentChecked[i].DocId;
                 transactionUIService.findElementInElement_V3(template[0], ["Premium"]).$ = $scope.paymentChecked[i].PayableAmount;
                 if (i == 0) {
                     $scope.payment[0] = template[0];
                 } else {
                     $scope.payment.push(template[0]);
                 }
             }
        	 transactionUIService.findElementInElement_V3(transactionUIService.detail, ['ClientPayments'])['@counter'] = $scope.payment.length;
             transactionUIService.findElementInDetail_V3(['CreditCardLast4Digits']).$ = "data test";
             transactionUIService.findElementInDetail_V3(['CreditCardType']).$ = "data test";
             transactionUIService.findElementInDetail_V3(['ApprovalCode']).$ = "data test";
             transactionUIService.findElementInDetail_V3(['PayorName']).Value = "AG";
             transactionUIService.saveDetail_V3($scope.resourceURL, true).then(function(data) {
            	if(salecaseUIService.isSuccess(data)) {
            		 $scope.transactionId = transactionUIService.findElementInDetail_V3(['DocInfo']).DocName;
					  if ($scope.paymentChecked.length != 0) {
						  $scope.setValueMNC(transactionUIService.findElementInElement_V3(mobileAppCoreModule.itemProfile, ["CoreSystemInformation", "PASID"]).$).then(function(){
							  localStorage.setItem($scope.noPolis, $scope.transactionId);
					    	  localStorage.setItem($scope.transactionId, Number($scope.totalPayableAmount).toFixed(2));
					    	  $scope.moduleServiceTransaction.doPaymentWithDoku($scope.postFormData).then(function(data) {
					    		  if (data.errCode == 0) {
					    			  $scope.doEPaymentSuccess();
					    		  }else{
					    			  $scope.doEPaymentFail();
					    		  }
					    	  });
						  });
					  }
				} else {
					  showNotifyMessage("v3.transactioncenter.message.Errorhasoccured");
				}
             });
        };

        //for one payment at a time only
        $scope.setValueMNC = function(userPASId) {
        var deferred = $q.defer();
                	var salecaseId = $scope.paymentChecked[0].CaseId;
                	salecaseUIService.findDocument_V3($scope.resourceURL, salecaseId).then(function(data){
                		if (salecaseUIService.isSuccess(data)) {
        	        		var applicationId = salecaseUIService.findElementInDetail_V3(['ApplicationId']).$;
        	        		applicationUIService.findDocument_V3($scope.resourceURL, applicationId).then(function(data){
        	        			if (applicationUIService.isSuccess(data)) {
        			        		if (userPASId == undefined || userPASId == '' ||
        			            		!applicationUIService.findElementInDetail_V3(['PolicyOwnerDetails', 'FullName']).$ ||
        			            		!applicationUIService.findElementInDetail_V3(['PolicyOwnerDetails', 'EmailAddress']).$
        			            	) {
        			            		showNotifyMessage("v3.transactioncenter.message.Errorhasoccured");
        			            		deferred.reject();
        			            	} else {
        			            		//get quotation for first year single top up
        			            		$scope.postFormData = {"NO_POLIS":"",
                                                               "MEMBER_ID":"",
                                                               "MEMBER_NAME":"",
                                                               "HARGA":"",
                                                               "HARGA_TOPUP":"",
                                                               "EMAIL":"",
                                                               "ADDRESS":"",
                                                               "HOMEPHONE":"",
                                                               "PAKET":"",
                                                               "STATE":"",
                                                               "PARTNERID":"",
                                                               "urlForm":""
                                              				                };
        			            		var quotationId = salecaseUIService.findElementInDetail_V3(['QuotationId']).$;
        				                illustrationUIService.findDocument_V3($scope.resourceURL, quotationId).then(function(data){
        				                	if (illustrationUIService.isSuccess(data)) {
        				                	    $scope.noPolis=applicationUIService.findElementInDetail_V3(['SPAJNo']).$;
        				                		//Fill form data
        						                $scope.postFormData.NO_POLIS = applicationUIService.findElementInDetail_V3(['SPAJNo']).$;
        						                $scope.postFormData.MEMBER_ID = userPASId;
        						                $scope.postFormData.MEMBER_NAME = applicationUIService.findElementInDetail_V3(['PolicyOwnerDetails', 'FullName']).$;
        						                $scope.postFormData.EMAIL = applicationUIService.findElementInDetail_V3(['PolicyOwnerDetails', 'EmailAddress']).$;
        						                $scope.postFormData.ADDRESS = applicationUIService.findElementInDetail_V3(['PolicyOwnerDetails', 'PrimaryAddress', 'AddressComplete']).$;
        						                
        						                var homePhone = applicationUIService.findElementInDetail_V3(['PolicyOwnerDetails', 'HomePhone']).$;
        						                if (commonService.hasValueNotEmpty(homePhone)) {
        							            	homePhone = homePhone.replace(/[+ ]/g, '');
        							    		}
        						                
        						                var city = applicationUIService.findElementInDetail_V3(['PolicyOwnerDetails', 'PrimaryAddress', 'City']).$;
        						                var province = applicationUIService.findElementInDetail_V3(['PolicyOwnerDetails', 'PrimaryAddress', 'Province']).$;
        						                var state = city;
        						                if(!state){
        						                	state = province;
        						                }

        						                $scope.postFormData.HOMEPHONE = homePhone;
        						                $scope.postFormData.STATE = state;
                                                $scope.postFormData.PARTNERID = commonService.CONSTANTS.PARTNERID.MNC_LIFE;
        						                $scope.postFormData.urlForm = commonService.CONSTANTS.PAYMENT_GATEWAY.MNC_LIFE;
        						                
        						                // specific for each products
        						                if ($scope.paymentChecked[0].Product == commonService.CONSTANTS.PRODUCT.REGULAR_UNIT_LINK) {
        						                	var basicPremium = applicationUIService.findElementInDetail_V3(['BasicPremium']).$;
            						                basicPremium = basicPremium != undefined ? basicPremium : '';
            						                basicPremium = basicPremium.replace(/,/g, "");

            						                //get first year single top up
            						                var singleTopUpFirstYearPremium = 0;
            						                var singleTopUpsCounter = illustrationUIService.findElementInDetail_V3(['SingleTopUps'])['@counter'];
            						        		var singleTopUps = illustrationUIService.convertToArray(illustrationUIService.findElementInDetail_V3(['SingleTopUp']));
            						        		for (var i = 0; i < singleTopUpsCounter && i < 1; i++) {
            						        			if ('1' == illustrationUIService.findElementInElement_V3(singleTopUps[i], ['STUYear']).$) {
            						        				singleTopUpFirstYearPremium = illustrationUIService.findElementInElement_V3(singleTopUps[i], ['STUAmount']).$;
            						        			}
            						                }

            						                var regularTopUpPremium = applicationUIService.findElementInDetail_V3(['RegularTopUpPremium']).$;
            						                regularTopUpPremium = regularTopUpPremium != undefined ? regularTopUpPremium : '';
            						                regularTopUpPremium = regularTopUpPremium.replace(/,/g, "");
            						                regularTopUpPremium = Number(regularTopUpPremium) + Number(singleTopUpFirstYearPremium);
            						                
            						                $scope.postFormData.PAKET = commonService.CONSTANTS.PAKET.REGULAR_UNIT_LINK;
            						                $scope.postFormData.HARGA = Number(basicPremium);
            						                $scope.postFormData.HARGA_TOPUP = regularTopUpPremium;
            						                
        						                } else if ($scope.paymentChecked[0].Product == commonService.CONSTANTS.PRODUCT.ENDOWMENT) {
        						                	var payablePremium = $scope.paymentChecked[0].PayableAmount;
        						                	payablePremium = payablePremium != undefined ? payablePremium : '';
        						                	payablePremium = payablePremium.replace(/,/g, "");
        						                	payablePremium = Number(payablePremium);
        						                	
        						                	$scope.postFormData.PAKET = commonService.CONSTANTS.PAKET.ENDOWMENT;
        						                	$scope.postFormData.HARGA = payablePremium;
        							                $scope.postFormData.HARGA_TOPUP = 0;
        						                }

        						                deferred.resolve();
        				                	} else {
        				                		showNotifyMessage("v3.transactioncenter.message.Errorhasoccured");
        					            		deferred.reject();
        				                	}
        				                });
        			            	}
        	        			} else {
        	        				showNotifyMessage("v3.transactioncenter.message.Errorhasoccured");
        	        				deferred.reject();
        	        			}
        	        		});
                		} else {
                			showNotifyMessage("v3.transactioncenter.message.Errorhasoccured");
                			deferred.reject();
                		}
                	});
                	return deferred.promise;

        };
        $scope.doEPaymentSuccess = function() {
        	//var noPolis=urlService.getParameterByName("noPolis");
			var noPolis=""//get data from android backend
			var transId = $scope.transactionId;
			$scope.epaymentSuccessful = true;
			$scope.epaymentSubNo = transId;
			$scope.etotalPremium = localStorage.getItem(transId);
			$scope.paymentChecked = [];
			localStorage.removeItem(transId);
			localStorage.removeItem("paymentSubNo");
			localStorage.removeItem("listUpdateRealPayment");
			localStorage.removeItem("firstTime");
			$scope.setVisibleCard("transaction:Step2_PaymentInformation", false);
			$scope.setVisibleCard("transaction:Step3_Finish", true);
			$scope.moveToCard("transaction:Step3_Finish");
			showNotifyMessage("v3.transactioncenter.message.Paidsuccessfully", "success");
        }

        $scope.doEPaymentFail = function() {
        	//var noPolis=urlService.getParameterByName("noPolis");
			var noPolis=""//get data from android backend
        	$scope.clientPaymentDocId = $scope.transactionId;//get
         //   $scope.updateClientPaymentFail($scope.clientPaymentDocId); //update client payment status to pending when paid fail
            localStorage.removeItem("paymentSubNo");
            localStorage.removeItem("listUpdateRealPayment");
            localStorage.removeItem("firstTime");
            $scope.epaymentSuccessful = false;
            $scope.moveToCard("transaction:Step3_Finish");
            showNotifyMessage("v3.transactioncenter.message.Errorhasoccured");
       }
        
        //when user hit back button from DOKU payment gateway, this function will update client payment back to pending
        $scope.updateClientPaymentFail = function updateClientPaymentFail (clientPaymentId) {
        	paymentUIService.findDocument_V3($scope.resourceURL, clientPaymentId).then(function(data){
        		if (paymentUIService.isSuccess(data)) {
        			var BusinessStatus = paymentUIService.findElementInElement_V3(data, ["DocStatus"]).BusinessStatus;
            			paymentUIService.findElementInElement_V3(data, ["DocStatus"]).BusinessStatus = commonService.CONSTANTS.STATUS.PENDING;
            			paymentUIService.findElementInElement_V3(data, ["AgentPaymentId"]).$ = "";
            			paymentUIService.saveDetail_V3($scope.resourceURL, false).then(function(data){
            				if (paymentUIService.isSuccess(data)) {
	            				$log.debug("update client payment status to pending");
	            				localStorage.removeItem($scope.noPolis);
	                            localStorage.removeItem($scope.noPolis + "docId");
            				}else{
            					$log.error("cannot update client payment status to pending");
            				}
            			});
        		}else{
        			showNotifyMessage("v3.transactioncenter.message.Errorhasoccured");
        		}
        	});
        }

        $scope.loadPaymentList = function() {
        	
            paymentUIService.getDocumentList_V3($scope.resourceURL).then(function(data) {
            	
            	$scope.paymentList = paymentUIService.convertToArray(paymentUIService.findElementInElement_V3(data, ['MetadataDocument']));            	
                if ($scope.paymentList !== undefined && $scope.paymentList !== '') {
                    $scope.pendingPaymentList = [];
                    // get pending payment only
                    $scope.paymentList = commonUIService.sortList($scope.paymentList, "CreatedDate", true);
                    $scope.paymentListDis = angular.copy($scope.paymentList);
                    for (var i = 0; i < $scope.paymentList.length; i++) {
                        $scope.paymentList[i].isShow = true;
                        $scope.paymentList[i].isCheck = false;
                        $scope.paymentList[i].id = i;

                        // Plus 30 days for due date
                        if ($scope.paymentList[i].CreatedDate.indexOf(" ") != -1) {
                            var dateTime = $scope.paymentList[i].CreatedDate.split(" ");
                            var date = dateTime[0];
                            var hours = dateTime[1];
                            var momentDate = new moment(date);
                            date = momentDate.add(30, 'd').format('YYYY-MM-DD');
                            $scope.paymentList[i].CreatedDate = date + " " + hours;
                        }
                    }
                    $scope.isPaymentReadyLoaded = true;
                } else {
                	 $scope.isPaymentReadyLoaded = true;
                     showNotifyMessage("v3.transactioncenter.message.NoData");
                }
            });
        };

        $scope.loadAgentPaymentList = function() {
            transactionUIService.getDocumentList_V3($scope.resourceURL).then(function(dataTrans) {
                $scope.agentPaymentList = transactionUIService.convertToArray(transactionUIService.findElementInElement_V3(dataTrans, ['MetadataDocument'])); 
            });
        };

        $scope.showPaymentDetail = function(index, payment) {
            var caret = angular.element("#endorse-submenu-caret-" + index);
            caret.toggleClass("rotate-caret");
            if (payment.isShow == true) {
                paymentUIService.findDocument_V3($scope.resourceURL, payment.DocId).then(function(data) {
                    payment.isShow = !payment.isShow;
                });
            } else {
                payment.isShow = !payment.isShow;
            }
        };

        $scope.refreshData = function() {
            transactionUIService.refresh_V3($scope.resourceURL).then(function(data) {
                if (transactionUIService.isSuccess(data)) {
                    for (var i = 0; i < $scope.paymentChecked.length; i++) {
                        // set payments to detail
                        var template = angular.copy($scope.template);
                        template[0]['@refUid'] = $scope.paymentChecked[i].DocId;
                        transactionUIService.findElementInElement_V3(template, ["Premium"]).$ = $scope.paymentChecked[i].PayableAmount;
                        if (i == 0) {
                            $scope.payment[0] = template[0];
                        } else {
                            $scope.payment.push(template[0]);
                        }

                    }
                    transactionUIService.findElementInElement_V3(transactionUIService.detail, ['ClientPayments'])['@counter'] = $scope.payment.length;
                    transactionUIService.findElementInElement_V3(transactionUIService.detail, ['ClientPayments'])['payment:ClientPayment'] = $scope.payment;
                    if ($scope.moduleServiceTransaction.findElementInDetail_V3(['PaymentMethod']).Value == "CC") {
                        $scope.doEPayment();
                    } 
                    else {
                        $scope.setVisibleCard("transaction:Step2_PaymentInformation", true);
                        $scope.setVisibleCard("transaction:Step3_Finish", false);
                        $scope.moveToCard("transaction:Step2_PaymentInformation");
                        $scope.paymentBasis = false;
                    }
                } else {
                    showNotifyMessage("v3.transactioncenter.message.Errorhasoccured");
                }

            });
        };

        function loadTransactionType() {
            paymentUIService.getModuleLazyChoicelist_V3($scope.resourceURL).then(function(data) {

            });
        }

        $scope.cancel = function() {
            $scope.idChecked = [];
            $scope.paymentChecked = [];
            $scope.totalPayableAmount = "0.00";
            for (var i = 0; i < $scope.pendingPaymentList.length; i++) {
                $scope.pendingPaymentList[i].isCheck = false;
            }
        }

        $scope.cancelSecondTile = function() {
            transactionUIService.findElementInDetail_V3(['AdviceDate']).$ = "";
            transactionUIService.findElementInDetail_V3(['AdviceNo']).$ = "";
            transactionUIService.findElementInDetail_V3(['BankName']).Value = "";
            transactionUIService.findElementInDetail_V3(['ChequeDate']).$ = "";
            transactionUIService.findElementInDetail_V3(['ChequeNumber']).$ = "";
            transactionUIService.findElementInDetail_V3(['PayorName']).Value = "";
            transactionUIService.findElementInDetail_V3(['DocInfo']).Comments = "";
            $scope.moveToCard("transaction:Step1_SelectYourTransaction");
        }

        $scope.convertObjectToArray = function(data) {
            if (!$.isArray(data)) {
                var result = [];
                result.push(data);
                return result;
            } else {
                return data;
            }
        };

        function showNotifyMessage(message, status) {
            $scope.showLoadingAnimation = false;
            commonUIService.showNotifyMessage(message, status);
        }
        
        $scope.doPayment = function doPayment() {
            if ($scope.paymentChecked.length != 0) {
            	
            	//Only for MNC general with payment method is Credit Account
            	if(companyName ==  commonService.CONSTANTS.COMPANY_ID.MNC_GENERAL  && transactionUIService.findElementInDetail_V3(['PaymentMethod']).Value == "CA"){
	            	transactionUIService.checkCreditAccountValid(portletId, $scope.totalPayableAmount, $scope.paymentChecked[0].Product).then(function(data){
	            		if(data.result == true){
	            			$scope.doRealPayment();
	            		}else{
	            			showNotifyMessage("MSG-BG04");
	            		}
	            	});
            	}else{
            		 $scope.doRealPayment();
            	}
            }
        }

        $scope.doRealPayment = function doRealPayment() {
            transactionUIService.saveDetail_V3($scope.resourceURL, true).then(function(data) {
                //These code below is to Update status of Payment to QUEUING Using for Update simple Payment.
                if (transactionUIService.isSuccess(data)) {
                    localStorage.setItem('firstTime', false);
                    var transactionId = transactionUIService.findElementInDetail_V3(['DocInfo', 'DocId']);
                    var promise = undefined;
                     if(transactionUIService.findElementInDetail_V3(['PaymentMethod']).Value == "CA"){
                         promise = transactionUIService.processPayment_MNC(portletId, transactionId, $scope.totalPayableAmount, $scope.paymentChecked[0].Product);
                    }else{
                         promise = transactionUIService.proscessPayment($scope.resourceURL,transactionId);
                    }
                    promise.then(function(data) {
                        if ($scope.moduleService.isSuccess(data)) {
                            if ($scope.listUpdateCaseId.length != 0) {
                                $scope.epaymentSuccessful = true;
                                $scope.updateCase($scope.listUpdateCaseId);
                            }
                            $log.debug(data);
                            showNotifyMessage("v3.transactioncenter.message.Paidsuccessfully", "success");
                            $scope.loadPendingPaymentList();
                            $scope.paymentChecked = [];
                            $scope.radio.selectedPayment = undefined;//MNC select single payment
                            transactionUIService.findElementInDetail_V3(['PaymentMethod']).Value = undefined;
                            
                            $scope.totalPremium = angular.copy($scope.totalPayableAmount);
                            $scope.paidCurrency = angular.copy($scope.TotalPayableAmountCurrency);
                            $scope.payButton = true;
                            $scope.isDisabled = true;
                            transactionUIService.initializeObject_V3($scope.resourceURL).then(function(result) {
                                transactionUIService.findElementInDetail_V3(['DocInfo']).DocName = transactionUIService.genDefaultName();
                                if (!$.isArray($scope.payment)) {
                                    var a = $scope.payment;
                                    $scope.payment = [];
                                    $scope.payment.push(a);
                                }
                            });
                        } else {
                        	if(data.result == "invalidCreditAmmount"){
                        		 showNotifyMessage("MSG-BG04");
                        	}else{
                        		showNotifyMessage("v3.transactioncenter.message.Errorhasoccured");
                        	}
                            
                        }
                    });
                }
            });
        }

        // mock update case status

        $scope.updateCase = function updateCase(listCaseId) {
            // get all case document from caseId list
            var promiseArr = [];
            var promiseTranArr = [];
            var self = this;
            for (var i = 0; i < listCaseId.length; i++) {
                var promise = salecaseUIService.findDocument_V3($scope.resourceURL, listCaseId[i].CaseId);
                var promiseTransaction = prospectUIService.findDocument_V3($scope.resourceURL, listCaseId[i].DocId);
                promiseTranArr.push(promiseTransaction);
                promiseArr.push(promise);

            }
            salecaseUIService.$q.all(promiseArr).then(function getAllCaseDocs(caseDocs) {
                var promiseArr = [];
                for (var i = 0; i < caseDocs.length; i++) {
                    // update businessStatus
                    salecaseUIService.findElementInElement_V3(caseDocs[i], ["DocStatus"]).BusinessStatus = "SUBMITTED";
                    var product = salecaseUIService.findElementInElement_V3(caseDocs[i], ["Product"]);

                    //cheat
                    if (commonService.hasValueNotEmpty(salecaseUIService.findElementInElement_V3(caseDocs[i], ["IposDocument"])["AdditionalInfo"])) {
                        delete salecaseUIService.findElementInElement_V3(caseDocs[i], ["IposDocument"])["AdditionalInfo"];
                    }

                    // gen policy number and update
                    var text = "";
                    var possible = "0123456789";
                    for (var j = 0; j < 3; j++)
                        text += possible.charAt(Math.floor(Math.random() * possible.length));
                    if (product == "personal-accident" || product == "term-life-secure")
                        text = "M0000" + text;

                    salecaseUIService.findElementInElement_V3(caseDocs[i], ["PolicyNumber"]).$ = text;
                    salecaseUIService.detail = caseDocs[i];
                    var promise = salecaseUIService.saveDetail_V3($scope.resourceURL, false);
                    promiseArr.push(promise);

                }
                salecaseUIService.$q.all(promiseArr).then(function updatedAllCaseDocs(updatedCaseDocs) {
                    paymentUIService.$q.all(promiseTranArr).then(function getAllTranDocs(tranDocs) {
                        var promiseTranArr = [];
                        for (var i = 0; i < tranDocs.length; i++) {
                            paymentUIService.detail = tranDocs[i];
                            $scope.moduleService.findElementInElement_V3(paymentUIService.detail, ['DocStatus'])['BusinessStatus'] = "PAID";
                            var promiseTran = paymentUIService.saveDetail_V3($scope.resourceURL, false);
                            promiseTranArr.push(promiseTran);
                        }
                        paymentUIService.$q.all(promiseTranArr).then(function() {
                            showNotifyMessage("Updated case successfull", "success");
                            $scope.loadPendingPaymentList();
                            $scope.paymentChecked = [];
                            $scope.payButton = true;
                            $scope.isDisabled = true;
                            $scope.setVisibleCard("transaction:Step3_Finish",true);
                            $scope.moveToCard("transaction:Step3_Finish");

                        });
                    });
                });
            });
        }

        $scope.updateCaseFail = function updateCaseFail(listClientpayment) {
            // get all case document from caseId list
            var promiseArr = [];
            var promiseTranArr = [];
            var self = this;
            for (var i = 0; i < listClientpayment.length; i++) {
                var promise = paymentUIService.findDocument_V3($scope.resourceURL, listClientpayment[i].DocId);
                var promiseTransaction = paymentUIService.findDocument_V3($scope.resourceURL, listClientpayment[i].DocId);
                promiseTranArr.push(promiseTransaction);
                promiseArr.push(promise);
            }
            paymentUIService.$q.all(promiseArr).then(function getAllCaseDocs(clientPaymentList) {
                var promiseArr = [];
                for (var i = 0; i < clientPaymentList.length; i++) {
                    paymentUIService.findElementInElement_V3(clientPaymentList[i], ["AgentPaymentId"]).$ = "";
                    paymentUIService.detail = clientPaymentList[i];
                    var promise = paymentUIService.saveDetail_V3($scope.resourceURL, false);
                }
            });
        }

        $scope.searchPayment = function() {
            $scope.paymentListDis = $filter('filter')($scope.paymentList, $scope.searchText);
        }

        $scope.searchTransactionCenter = function searchTransactionCenter() {
            var EQKeyAndValue = [];
            var NEKeyAndValue = [];
            EQKeyAndValue.push({ "key": "DocType", "value": "business-transaction" });
            if ($scope.abc.referenceNo)
                EQKeyAndValue.push({ "key": "ReferenceNo", "value": $scope.abc.referenceNo });
            if ($scope.abc.transactionType && $scope.abc.transactionType != "All")
                EQKeyAndValue.push({ "key": "CaseType", "value": $scope.abc.transactionType });
            if ($scope.abc.policyOwner)
                EQKeyAndValue.push({ "key": "POFullName", "value": $scope.abc.policyOwner });

            var dataSet = paymentUIService.createSearchDatasetWithEQAndNE(EQKeyAndValue, NEKeyAndValue);
            transactionUIService.searchBusinessTransactionMetadata($scope.resourceURL, dataSet).then(function(data) {
                if (data == "") {
                    $scope.transactionList = [];
                } else {
                    $scope.transactionList = $scope.convertObjectToArray(data);
                    $scope.transactionList = commonUIService.sortList($scope.transactionList, "CreatedDate", true);
                    for (var i = 0; i < $scope.transactionList.length; i++) {
                        $scope.transactionList[i].isShow = true;
                    }
                    if ($scope.abc.effectiveDateFrom || $scope.abc.effectiveDateTo)
                        $scope.transactionList = paymentUIService.searchInDateRange($scope.transactionList, "EffectiveDate", $scope.abc.effectiveDateFrom, $scope.abc.effectiveDateTo);

                }

            });
        }

        $scope.searchPaymentCenter = function searchPaymentCenter() {
            var EQKeyAndValue = [];
            var NEKeyAndValue = [];
            EQKeyAndValue.push({ "key": "DocType", "value": "client-payment" });
            if ($scope.productName.Value && $scope.productName.Value != "All")
                EQKeyAndValue.push({ "key": "Product", "value": $scope.productName.Value });
            if ($scope.abc.currency.Value)
                EQKeyAndValue.push({ "key": "SICurrency", "value": $scope.abc.currency.Value });
            EQKeyAndValue.push({ "key": "AgentPaymentId", "value": "" });
            NEKeyAndValue.push({ "key": "PayableAmount", "value": "0.00" });
            NEKeyAndValue.push({ "key": "BusinessStatus", "value": "PAID" });
            var dataSet = paymentUIService.createSearchDatasetWithEQAndNE(EQKeyAndValue, NEKeyAndValue);

            paymentUIService.searchAdvanceMetadata($scope.resourceURL, dataSet).then(function(data) {
                if (data == "") {
                    $scope.pendingPaymentList = [];
                } else {
                    $scope.pendingPaymentList = $scope.convertObjectToArray(data);
                    $scope.pendingPaymentList = commonUIService.sortList($scope.pendingPaymentList, "CreatedDate", true);
                    for (var i = 0; i < $scope.pendingPaymentList.length; i++) {
                        $scope.pendingPaymentList[i].isShow = true;
                    }
                    if ($scope.abc.dueDateFrom || $scope.abc.dueDateTo)
                        $scope.pendingPaymentList = paymentUIService.searchInDateRange($scope.pendingPaymentList, "DueDate", $scope.abc.dueDateFrom, $scope.abc.dueDateTo);
                }

            });
        }

        $scope.getCaseDetail = function getCaseDetail(transaction) {
            var metaCard = {};
            if (transaction.CaseType.toLowerCase() == "endorsement" || transaction.CaseType.toLowerCase() == "renewal") {
                if (transaction.CaseId == undefined) {
                    transactionUIService.findDocument_V3($scope.resourceURL, transaction.DocId).then(function(data) {
                        transaction.CaseId = transactionUIService.findElementInElement_V3(data, ['business-transaction:CaseId']).$;
                        salecaseUIService.findDocument_V3($scope.resourceURL, transaction.CaseId).then(function(data) {
                            // get policy Num
                            metaCard.Contract_Number = salecaseUIService.findElementInElement_V3(salecaseUIService.detail, ['case-management-motor:PolicyId']).$;
                            metaCard.DocType = commonService.CONSTANTS.MODULE_NAME.POLICY;
                            switch (transaction.Product) {
                                case ('motor-private-car-m-as'):
                                    metaCard.Contract_Type = "VPM";
                                    metaCard.Effective_Date = "";
                                    break;
                                default:
                                    metaCard.Product = transaction.Product;
                            }
                            commonUIService.goToPortlet("NEW_MY_WORKSPACE", metaCard);
                        });

                    });
                } else {
                    salecaseUIService.findDocument_V3($scope.resourceURL, transaction.CaseId).then(function(data) {
                        // get policy Num
                        metaCard.Contract_Number = salecaseUIService.findElementInElement_V3(salecaseUIService.detail, ['case-management-motor:PolicyId']).$;
                        metaCard.DocType = commonService.CONSTANTS.MODULE_NAME.POLICY;
                        switch (transaction.Product) {
                            case ('motor-private-car-m-as'):
                                metaCard.Contract_Type = "VPM";
                                metaCard.Effective_Date = "";
                                break;
                            default:
                                metaCard.Product = transaction.Product;
                        }
                        commonUIService.goToPortlet("NEW_MY_WORKSPACE", metaCard);
                    });
                }

            } else {
                if (transaction.CaseId == undefined) {
                    transactionUIService.findDocument_V3($scope.resourceURL, transaction.DocId).then(function(data) {
                        transaction.CaseId = transactionUIService.findElementInElement_V3(data, ['business-transaction:CaseId']).$;
                        transaction.EffectiveDate = transactionUIService.findElementInElement_V3(data, ['business-transaction:EffectiveDate']).$;
                        transaction.ClientPaymentDate = transactionUIService.findElementInElement_V3(data, ['business-transaction:ClientPaymentDate']).$;
                        transaction.AgentPaymentDate = transactionUIService.findElementInElement_V3(data, ['business-transaction:AgentPaymentDate']).$;
                        transaction.StatusChangeDate = transactionUIService.findElementInElement_V3(data, ['business-transaction:StatusChangeDate']).$;
                        transaction.POFullName = transactionUIService.findElementInElement_V3(data, ['business-transaction:POFullName']).$;
                        transaction.Status = transactionUIService.findElementInElement_V3(data, ['business-transaction:Status']).$;

                        metaCard.DocType = commonService.CONSTANTS.MODULE_NAME.SALECASE;
                        metaCard.DocId = transaction.CaseId;
                        metaCard.Product = transaction.Product;
                        metaCard.CaseName = transaction.CaseType;
                        commonUIService.goToPortlet("NEW_MY_WORKSPACE", metaCard);
                    });
                } else {
                    metaCard.DocType = commonService.CONSTANTS.MODULE_NAME.SALECASE;
                    metaCard.DocId = transaction.CaseId;
                    metaCard.Product = transaction.Product;
                    metaCard.CaseName = transaction.CaseType;
                    commonUIService.goToPortlet("NEW_MY_WORKSPACE", metaCard);
                }
            }
        }

        $scope.openPdfReferenceNo = function(payment) {
            if (payment.CaseType.toLowerCase() == "newbusiness" || payment.CaseType.toLowerCase() == "renewal") {
                if (payment.DocType == "business-transaction") {
                    salecaseUIService.findDocument_V3($scope.resourceURL, payment.DocId).then(function(data) {
                        var caseId = salecaseUIService.findElementInDetail_V3(["business-transaction:CaseId"]).$;
                        $scope.printApplicationPDF(caseId);
                    })
                } else {
                    $scope.printApplicationPDF(payment.CaseId);
                }
                salecaseUIService.findDocument_V3($scope.resourceURL, payment.CaseId).then(function(data) {
                    var printList = salecaseUIService.findElementInDetail_V3(['Print']);
                    var appPrintId = $scope.getPrintID(printList, "application");
                    salecaseUIService.findMetadata_V3($scope.resourceURL, salecaseUIService.getListUidPrintFromCase()).then(function(data){
                        var doc = $scope.getDocFromDocumentList(data.MetadataDocuments.MetadataDocument, appPrintId);
                        $scope.fileReaderService.openFileReader("download",doc,[],'');
                    })
                });
            } else {
                if (payment.DocType == "business-transaction") {
                    salecaseUIService.findDocument_V3($scope.resourceURL, payment.DocId).then(function(data) {
                        var caseId = salecaseUIService.findElementInDetail_V3(["business-transaction:CaseId"]).$;
                        $scope.printEcoverNotePDF(caseId);
                    })
                } else {
                    $scope.printEcoverNotePDF(payment.CaseId);
                }
            }
        }

        $scope.printApplicationPDF = function printApplicationPDF(caseId) {
            salecaseUIService.findDocument_V3($scope.resourceURL, caseId).then(function(data) {
                var printList = salecaseUIService.findElementInDetail_V3(['Print']);
                printList = $scope.convertObjectToArray(printList);
                var product = salecaseUIService.findElementInDetail_V3(['Product']);
                var appPrintId = $scope.getPrintID(printList, "application", product);                
                salecaseUIService.findMetadata_V3($scope.resourceURL, salecaseUIService.getListUidPrintFromCase()).then(function(data){
                    var doc = $scope.getDocFromDocumentList(data.MetadataDocuments.MetadataDocument, appPrintId);
                    $scope.fileReaderService.openFileReader("download",doc,[],'');
                })
            });
        }

        $scope.printEcoverNotePDF = function printEcoverNotePDF(caseId) {
            salecaseUIService.findDocument_V3($scope.resourceURL, caseId).then(function(data) {
                var eCover = salecaseUIService.findElementInDetail_V3(["case-management-motor:eCoverNote"]);
                var eCoverId = eCover["@refUid"];
                var product = eCover["@refDocType"].split("=")[1];

                ecovernoteUIService.findDocument_V3($scope.resourceURL, eCoverId).then(function(data) {
                    ecovernoteUIService.productName = product;
                    ecovernoteUIService.generateDocument_V3(portletId).then(function(data) {
                        if (ecovernoteUIService.isSuccess(data)) {
                            ecovernoteUIService.jsonToArray(ecovernoteUIService.detail, 'person:IDs', 'person:ID');
                            ecovernoteUIService.jsonToArray(ecovernoteUIService.detail, 'person:Addresses', 'person:Address');
                            ecovernoteUIService.jsonToArray(ecovernoteUIService.detail, 'person:Contacts', 'person:Contact');
                            ecovernoteUIService.jsonToArray(ecovernoteUIService.detail, 'ecovernote:OptionalCoverages', 'ecovernote:OptionalCoverage');

                            $scope.printPdfService.generatePdf(portletId, ecovernoteUIService, product, "endorsement");
                        } else {
                            commonUIService.showNotifyMessage("v3.myworkspace.message.GeneratePDFUnsuccessfully");
                        }
                    });
                });
            })
        };

        $scope.getPrintID = function(printList, docType, product) {
            var prefix = "";
            if (product == "motor-private-car-m-as")
                prefix = "case-management-motor:PrintDoctype";
            else if (product == "FIR")
                prefix = "case-management-fire:PrintDoctype";
            else if (product == "term-life-secure")
                prefix = "case-management:PrintDoctype";
            for (var i = 0; i < printList.length; i++) {
                if (printList[i][prefix] != undefined && printList[i][prefix].$ == docType)
                    return printList[i]["@refResourceUid"];
                else if (this.moduleServiceTransaction.findElementInElement_V3(printList[i], ['PrintDoctype']).$ == docType)
                    return printList[i]["@refResourceUid"];
            }
            return undefined;
        }

        $scope.loadTransactionList = function() {
            transactionUIService.getTransactionList_V3($scope.resourceURL).then(function(dataTrans) {
                $scope.transactionList = $scope.convertObjectToArray(dataTrans.MetadataDocuments.MetadataDocument);;
                for (var i = 0; i < $scope.transactionList.length; i++) {
                    $scope.transactionList[i].isShow = true;
                }
                $scope.transactionList = commonUIService.sortList($scope.transactionList, "CreatedDate", true);
                $scope.isPaymentReadyLoaded = true;
            });
        };

        $scope.showTransactionDetail = function(index, transaction) {
            var caret = angular.element("#endorse-submenu-caret-" + index);
            caret.toggleClass("rotate-caret");

            if (transaction.isShow == true) {

                if (transaction.CaseId == undefined) {
                    transactionUIService.findDocument_V3($scope.resourceURL, transaction.DocId).then(function(data) {
                        transaction.CaseId = transactionUIService.findElementInElement_V3(data, ['business-transaction:CaseId']).$;
                        transaction.EffectiveDate = transactionUIService.findElementInElement_V3(data, ['business-transaction:EffectiveDate']).$;
                        transaction.ClientPaymentDate = transactionUIService.findElementInElement_V3(data, ['business-transaction:ClientPaymentDate']).$;
                        transaction.AgentPaymentDate = transactionUIService.findElementInElement_V3(data, ['business-transaction:AgentPaymentDate']).$;
                        transaction.StatusChangeDate = transactionUIService.findElementInElement_V3(data, ['business-transaction:StatusChangeDate']).$;
                        transaction.POFullName = transactionUIService.findElementInElement_V3(data, ['business-transaction:POFullName']).$;
                        transaction.Status = transactionUIService.findElementInElement_V3(data, ['business-transaction:Status']).$;
                        transaction.isShow = !transaction.isShow;
                    });
                } else {
                    transaction.isShow = !transaction.isShow;
                }

            } else {
                transaction.isShow = !transaction.isShow;
            }
        };

        $scope.getProductList = function getProductList() {
            illustrationUIService.getModuleProductList_V3($scope.resourceURL, "illustration").then(function(data) {
                $scope.productList = data.productDescription.products.product;
                for (var i = 0; i < $scope.productList.length; i++) {
                    $scope.productList[i].value = $scope.productList[i].productId;
                }
                $scope.productList.push({ "value": "All" });
            });
        }

        $scope.getDocFromDocumentList = function(docList, printId) {
            for (var i = 0; i < docList.length; i++) {
                if (docList[i]["DocId"] == printId)
                    return docList[i];
            }
            return undefined;
        }

        /* Select PDF template popup */
        $scope.printPdf = function(docType, docId) {
            if (docType == 'client-payment') {
                $scope.moduleService = paymentUIService;
            };
            if (docType == 'agent-payment') {
                $scope.moduleService = transactionUIService;
            };
            $scope.moduleService.findDocument_V3($scope.resourceURL, docId).then(function(data) {
                $scope.moduleService.detail = data;
                $scope.moduleService.generateDocument_V3(portletId).then(function(data) {
                    if ($scope.moduleService.isSuccess(data)) {
                        if (docType == 'agent-payment') {
                            $scope.moduleService.jsonToArray($scope.moduleService.detail, 'ClientPayments', 'ClientPayment');
                        }
                        $scope.printPdfService.generatePdf(portletId, $scope.moduleService, "", "newbusiness");
                    } else {
                        commonUIService.showNotifyMessage("v3.myworkspace.message.GeneratePDFUnsuccessfully");
                    }
                });
            });
        };

        $scope.printPaymentSlip = function printPaymentSlip(transaction) {
            if (transaction.clientPaymentId) {
                $scope.printPdf(transaction.clientPaymentDocType, transaction.clientPaymentId);
            } else {
                //get case document
                transactionUIService.findDocument_V3($scope.resourceURL, transaction.CaseId).then(function(data) {
                    transaction.clientPaymentDocType = transactionUIService.findElementInElement_V3(data, ['ClientPayment'])['@refDocType'];
                    transaction.clientPaymentId = transactionUIService.findElementInElement_V3(data, ['ClientPayment'])['@refUid'];

                    $scope.printPdf(transaction.clientPaymentDocType, transaction.clientPaymentId);
                });
            }
        };

        $scope.printPaymentDetail = function printPaymentDetail(transaction) {
            if (transaction.agentPaymentId) {
                $scope.printPdf("agent-payment", transaction.agentPaymentId);
            } else if (transaction.clientPaymentId) {
                transactionUIService.findDocument_V3($scope.resourceURL, transaction.clientPaymentId).then(function(data) {
                    transaction.agentPaymentId = transactionUIService.findElementInElement_V3(data, ['client-payment:AgentPaymentId']).$;
                    $scope.printPdf("agent-payment", transaction.agentPaymentId);
                });
            } else {

                //get case document
                transactionUIService.findDocument_V3($scope.resourceURL, transaction.CaseId).then(function(data) {
                    transaction.clientPaymentDocType = transactionUIService.findElementInElement_V3(data, ['ClientPayment'])['@refDocType'];
                    transaction.clientPaymentId = transactionUIService.findElementInElement_V3(data, ['ClientPayment'])['@refUid'];
                    //get client payment document
                    transactionUIService.findDocument_V3($scope.resourceURL, transaction.clientPaymentId).then(function(data) {
                        transaction.agentPaymentId = transactionUIService.findElementInElement_V3(data, ['client-payment:AgentPaymentId']).$;
                        $scope.printPdf("agent-payment", transaction.agentPaymentId);
                    });
                });
            }
        };
        
    }
];
