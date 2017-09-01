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

/* Filters */
var filterUIModule = angular.module('filterUIModule',['commonModule', 'translateUIModule'])
.filter('i18nText', ['appService', function(appService) {
  return function(code, params) {
    return appService.getI18NText(code, params);
  };
}])

.filter('booleanValue', ['appService', function(appService) {
	return function(boolVal) {
		if (boolVal === true || boolVal === "true" || boolVal === "Y") {
			return appService.getI18NText("workspace.value.yes");
		} 
		
		return appService.getI18NText("workspace.value.no");
	};
}])
.filter('dateFormat', ['appService', 'commonService', function(appService, commonService) {
	return function(dateStr, originalFormat, viewFormat) {
		if(!commonService.hasValueNotEmpty(dateStr) || !commonService.hasValueNotEmpty(originalFormat)) return dateStr;
		if (appService.localeContext == null) return "";
		var viewDateFormat = "";
		if(!commonService.hasValue(viewFormat)) viewFormat = "short";
		if(viewFormat == "short") viewDateFormat = appService.localeContext.shortDateFormat;
		else if(viewFormat == "medium") viewDateFormat = appService.localeContext.mediumDateFormat;
		else if(viewFormat == "full") viewDateFormat = appService.localeContext.fullDateFormat;
		else if(viewFormat == "mediumDateTime") viewDateFormat = appService.localeContext.mediumDateFormat;
		else viewDateFormat = appService.localeContext.shortDateFormat;
		var date = null;
		if (!isNaN(dateStr))
		      date = new Date(Number(dateStr));
		else
			date = $.datepicker.parseDate(originalFormat, dateStr);
		viewDateFormat = commonService.convertToJquiDateFormat(viewDateFormat);
		var formatStr = $.datepicker.formatDate(viewDateFormat, date);
		if(viewFormat == "mediumDateTime"){
			var date_obj_hours = date.getHours();
			var date_obj_mins = date.getMinutes();
			if (date_obj_mins < 10) { date_obj_mins = "0" + date_obj_mins; }
			formatStr += " "+date_obj_hours+":"+date_obj_mins;
		}
		return formatStr;	
	};
}])
.filter('numberformat', ['appService', function (appService) {
	return function(number, fractionSize) {
		var pattern = { // Decimal Pattern
	            minInt: 1,
	            minFrac: 0,
	            maxFrac: 3,
	            posPre: '',
	            posSuf: '',
	            negPre: '-',
	            negSuf: '',
	            gSize: 3,
	            lgSize: 3
	          };
	    return formatNumber(number, pattern, appService.localeContext.numberGroupSep, appService.localeContext.numberDecimalSep,
	      fractionSize);
	  };
	  
	  /** Copy formatNumber from angular because this api is not public */
//	  var DECIMAL_SEP = '.';
	  function formatNumber(number, pattern, groupSep, decimalSep, fractionSize) {
	    if (isNaN(number) || !isFinite(number)) return '';

	    var isNegative = number < 0;
	    number = Math.abs(number);
	    var numStr = number + '',
	        formatedText = '',
	        parts = [];

	    if (numStr.indexOf('e') !== -1) {
	      formatedText = numStr;
	    } else {
	      var fractionLen = (numStr.split('.')[1] || '').length;

	      // determine fractionSize if it is not specified
	      if (angular.isUndefined(fractionSize)) {
	        fractionSize = Math.min(Math.max(pattern.minFrac, fractionLen), pattern.maxFrac);
	      }

	      var pow = Math.pow(10, fractionSize);
	      number = Math.round(number * pow) / pow;
	      var fraction = ('' + number).split('.');
	      var whole = fraction[0];
	      fraction = fraction[1] || '';

	      var pos = 0,
	          lgroup = pattern.lgSize,
	          group = pattern.gSize;

	      if (whole.length >= (lgroup + group)) {
	        pos = whole.length - lgroup;
	        for (var i = 0; i < pos; i++) {
	          if ((pos - i)%group === 0 && i !== 0) {
	            formatedText += groupSep;
	          }
	          formatedText += whole.charAt(i);
	        }
	      }

	      for (i = pos; i < whole.length; i++) {
	        if ((whole.length - i)%lgroup === 0 && i !== 0) {
	          formatedText += groupSep;
	        }
	        formatedText += whole.charAt(i);
	      }

	      // format fraction part.
	      while(fraction.length < fractionSize) {
	        fraction += '0';
	      }

	      if (fractionSize) formatedText += decimalSep + fraction.substr(0, fractionSize);
	    }

	    parts.push(isNegative ? pattern.negPre : pattern.posPre);
	    parts.push(formatedText);
	    parts.push(isNegative ? pattern.negSuf : pattern.posSuf);
	    return parts.join('');
	  }
}])

.filter('userName', ['appService', 'commonService', function(appService, commonService) {
	return function() {
		var username = appService.getAgentName();
		return username;
	};
}])
.filter('appVersion', ['appService', 'commonService', function(appService, commonService) {
	return function() {
		var version = appService.getAppVersion();
		return version;
	};
}])

.filter('genderFormat', ['appService', function(appService){
	return function(gender) {
		if(gender.value == '')
			return '';
		return appService.getI18NText(gender.prefix + gender.value);
	};
}])

.filter('genderFormat2', ['appService', function(appService){
	return function(gender) {
		if(gender == 'M')
			return 'Male';
		else if(gender == 'F')
			return 'Female';
		else
			return gender;
	};
}])


.filter('filterProspectListByClient', ['appService', function(appService){
	return function(prospects,clientUid) {
		var filteredProspects = [];
		angular.forEach(prospects, function(item){
			if(item.clientNum == '' || item.clientNum == clientUid)
				filteredProspects.push(item);
		});
		return filteredProspects;
	};
}])
.filter('filterUnitObject', ['appService', function(appService){
	return function(objects,listSelected,ownValue) {
		var resultList = [];
		angular.forEach(objects, function(item){
			if(item.value == ownValue || $.inArray(item.value, toArray(listSelected, 'value')) == -1)
				resultList.push(item);
		});
		return resultList;
	};
	function toArray(objs, name){
		var ret = [];
		angular.forEach(objs, function(obj){
			ret.push(obj[name]);
		});
		return ret;
	};
}])
.filter('intoList', ['appService', function(appService){
	return function(objects, listSelected, ownObject) {
		var found = false;
		angular.forEach(listSelected, function(item){
			if(item.value == ownObject.value)
				found = true;
		});
		if(!found){
			ownObject.value = null;
		}
		return listSelected;
	};
	
}])
.filter('filterSalecaseProspectList', ['appService', function(appService){
	return function(objects, salecaseProspectUids) {
		var retObjects = [];
		if (salecaseProspectUids == undefined || salecaseProspectUids.length < 1){
			return objects;
		}
		angular.forEach(objects, function(item){
			if ($.inArray(item.uid, salecaseProspectUids) != -1){
				retObjects.push(item);
			}	
		});
		return retObjects;		
	}
}])

.filter('filterChildrenList', ['appService', function(appService){
	return function(objects, addedChildrenList) {
		if (addedChildrenList == undefined || addedChildrenList.length < 1){
			return objects;
		}
		//copy list objects
		var retObjects = objects.slice(0);
		
		var count = 0;
		angular.forEach(objects, function(item){
			if ($.inArray(item.uid, addedChildrenList) != -1){
				retObjects.splice(count,1);
			} else {
				count++;
			}	
		});
		
		return retObjects;
	}
}])

.filter('momentDate', ['commonService', function(commonService) {
      return function(dateStr) {
            if(!commonService.hasValueNotEmpty(dateStr)) return dateStr;
            var defaultFormat = "MMM DD, YYYY";
            var viewDate = null;
            if (!isNaN(dateStr))
                  viewDate = moment(new Date(Number(dateStr)));
            else
                  viewDate = moment(dateStr);
            var result = "";
            var now = moment();
            var diff = now.diff(viewDate, "months", true);
            if(diff > 2) result = viewDate.format(defaultFormat);
            else result = viewDate.fromNow();
            return result;
      };  
}])

.filter('prospectLeftSideBarFilter', ['prospectCoreService', function(prospectCoreService){
	return function(objects, searchTxt){
		if (!prospectCoreService.commonService.hasValueNotEmpty(searchTxt))
			return objects;
		
		var rs = [];
		var lowerCaseSearchTxt = angular.lowercase(searchTxt);
		angular.forEach(objects, function(item){
			if (angular.lowercase(prospectCoreService.getMetaFullName(item)).indexOf(lowerCaseSearchTxt) !=- 1 
					|| angular.lowercase(prospectCoreService.getMetaGender(item)).indexOf(lowerCaseSearchTxt) != -1
					|| angular.lowercase(prospectCoreService.getMetaBirthDate(item)).indexOf(lowerCaseSearchTxt) != -1
					|| angular.lowercase(prospectCoreService.getMetaIdNo(item)).indexOf(lowerCaseSearchTxt) != -1){
				rs.push(item);
			}
		});
		return rs;
	};
}])
.filter('subordinateLeftSideBarFilter', ['homeCoreService', function(homeCoreService){
	return function(objects, searchTxt){
		if (!homeCoreService.commonService.hasValueNotEmpty(searchTxt))
			return objects;
		
		var rs = [];
		var lowerCaseSearchTxt = angular.lowercase(searchTxt);
		angular.forEach(objects, function(item){
			if (angular.lowercase(homeCoreService.getAgentIdAndAgentNameOfUser(item)).indexOf(lowerCaseSearchTxt) !=- 1){
				rs.push(item);
			}
		});
		return rs;
	};
}])
.filter('applicationLeftSideBarFilter', ['applicationCoreService', function(applicationCoreService){
	return function(objects, searchTxt){
		if (searchTxt == undefined || searchTxt == null || searchTxt.length < 1)
			return objects;
		
		var rs = [];
		var lowerCaseSearchTxt = angular.lowercase(searchTxt);
		angular.forEach(objects, function(item){
			if ((angular.lowercase(applicationCoreService.getMetaName(item)).indexOf(lowerCaseSearchTxt)!=-1) ||
				(angular.lowercase(applicationCoreService.getMetaProductName(item)).indexOf(lowerCaseSearchTxt)!=-1) ||
				(angular.lowercase(applicationCoreService.getMetaPOName(item)).indexOf(lowerCaseSearchTxt)!=-1) ||
				(angular.lowercase(applicationCoreService.getMetaLIName(item)).indexOf(lowerCaseSearchTxt)!=-1) ||	
				(angular.lowercase(applicationCoreService.getMetaLIIdNumber(item)).indexOf(lowerCaseSearchTxt)!=-1) ||
				(angular.lowercase(applicationCoreService.getMetaPOIdNumber(item)).indexOf(lowerCaseSearchTxt)!=-1) 				
			) {
				rs.push(item);
			}
		});
		return rs;
	};
}])
.filter('clientLeftSideBarFilter', ['clientCoreService', function(clientCoreService){
	return function(objects, searchTxt){
		if (searchTxt == undefined || searchTxt == null || searchTxt.length < 1)
			return objects;
		
		var rs = [];
		var lowerCaseSearchTxt = angular.lowercase(searchTxt);
		angular.forEach(objects, function(item){
			// no filter at this moment.
			if (
					(angular.lowercase(clientCoreService.findPropertyInElement(item,['fullname'],'value').value).indexOf(lowerCaseSearchTxt)!=-1) ||
					(angular.lowercase(clientCoreService.findPropertyInElement(item,['gender'],'value').value).indexOf(lowerCaseSearchTxt)!=-1) ||
					(angular.lowercase(clientCoreService.findPropertyInElement(item,['birthDate'],'value').value).indexOf(lowerCaseSearchTxt)!=-1) ||
					(angular.lowercase(item.uid).indexOf(lowerCaseSearchTxt)!=-1)					
			) {
				rs.push(item);
			}
		});
		return rs;
	};
}])
.filter('paymentLeftSideBarFilter', ['paymentCoreService', 'appService', function(paymentCoreService, appService){
	return function(objects, searchTxt){
		if (searchTxt == undefined || searchTxt == null || searchTxt.length < 1)
			return objects;
		
		var rs = [];
		var lowerCaseSearchTxt = angular.lowercase(searchTxt);
		angular.forEach(objects, function(item){
			var paymentDateArr = paymentCoreService.getMetaPaymentDate(item).split("-");
			var paymentDate = paymentDateArr[2] + "/" + paymentDateArr[1] + "/" + paymentDateArr[0];
			if ((angular.lowercase(paymentCoreService.getMetaPaymentSatus(item)).indexOf(lowerCaseSearchTxt)!=-1) ||
				(angular.lowercase(paymentCoreService.getMetaiPOSRefNumber(item)).indexOf(lowerCaseSearchTxt)!=-1) ||
				(angular.lowercase(paymentDate).indexOf(lowerCaseSearchTxt)!=-1) ||
				(angular.lowercase(appService.getLocalI18NText('payment.payment_method.enum.' + paymentCoreService.getMetaPaymentMethod(item)))).indexOf(lowerCaseSearchTxt)!=-1 ||	
				(angular.lowercase(paymentCoreService.getMetaPOName(item)).indexOf(lowerCaseSearchTxt)!=-1)
			) {
				rs.push(item);
			} 
		});
		return rs;
	};
}])
.filter('managerReviewLeftSideBarFilter', ['managerReviewCoreService', 'appService', 'commonService', function(managerReviewCoreService, appService, commonService){
	return function(objects, searchTxt){
		if (searchTxt == undefined || searchTxt == null || searchTxt.length < 1)
			return objects;
		
		var rs = [];
		var lowerCaseSearchTxt = angular.lowercase(searchTxt);
		angular.forEach(objects, function(item){
			if ((angular.lowercase(managerReviewCoreService.getMetaProperty(item, 'FAName')).indexOf(lowerCaseSearchTxt)!=-1)
				|| (angular.lowercase(appService.getLocalI18NText('document.status.' + managerReviewCoreService.getMetaProperty(item, 'StatusOfReview'))).indexOf(lowerCaseSearchTxt)!=-1)
			) {
				rs.push(item);
			} else {
				var createdDateStr = $.datepicker.formatDate("dd/mm/yyyy", new Date(parseInt(item.createdDate)));
				if (createdDateStr.indexOf(lowerCaseSearchTxt) != -1) {
					rs.push(item);
				} else {
					var reviewDatePropVal = managerReviewCoreService.getMetaProperty(item, 'ReviewDate');
					if (commonService.hasValueNotEmpty(reviewDatePropVal)) {
						var reviewDateStr = $.datepicker.formatDate("dd/mm/yyyy", new Date(parseInt(reviewDatePropVal)));
						if (reviewDateStr.indexOf(lowerCaseSearchTxt) != -1) {
							rs.push(item);
						}
					}
				}
			}
		});
		return rs;
	};
}])
.filter('salesLeftSideBarFilter', ['salecaseCoreService', 'appService', 'commonService', function(salecaseCoreService, appService, commonService){
	return function(objects, searchTxt){
		if (searchTxt == undefined || searchTxt == null || searchTxt.length < 1)
			return objects;
		
		var rs = [];
		var lowerCaseSearchTxt = angular.lowercase(searchTxt);
		angular.forEach(objects, function(item){
			if ((angular.lowercase(salecaseCoreService.getMetaName(item)).indexOf(lowerCaseSearchTxt) != -1)
				|| (angular.lowercase(salecaseCoreService.getIPosRefNoByIndex(item, 0)).indexOf(lowerCaseSearchTxt) != -1)
				|| (angular.lowercase(salecaseCoreService.getIPosRefNoByIndex(item, 1)).indexOf(lowerCaseSearchTxt) != -1)
				|| (angular.lowercase(appService.getLocalI18NText('document.status.' + item.status)).indexOf(lowerCaseSearchTxt) != -1)
			) {
				rs.push(item);
			}
		});
		return rs;
	};
}])
.filter('filterRiderByVisible', ['illustrationUIService', function(illustrationUIService){
	return function(objects){
		var rs = [];
		angular.forEach(objects, function(item){
			if(illustrationUIService.findPropertyInElement(item,['Rider_Type'],'visible').value == 1)
				rs.push(item);
		});
		return rs;
	};
}])
.filter('filter4ItemInList', ['appService', function(appService){
	return function(objects) {
		var retObjects = [];
		if (objects == undefined || objects.length <= 4){
			return objects;
		}
		retObjects = objects.slice(0,4);
		return retObjects;		
	};
}])
.filter('ageOnNextBirthday', function(){
	// use this filter to get Age_Nearest_Birthdate from an ipos's dateString, eg: 2009-02-28
	return function(dateString) {
		var today = new Date();
		//workaround: yyyy-mm-dd (ISO 8601) date format is not supported in Safari and IE
		var birthDateArr = dateString.split("-");
		var birthDate = new Date(birthDateArr[0], birthDateArr[1]-1, birthDateArr[2]);
		
		if (today.getMonth() == birthDate.getMonth()){
			if (today.getDate() < birthDate.getDate()){
				return today.getFullYear() - birthDate.getFullYear();
			}
			return today.getFullYear() - birthDate.getFullYear() + 1;
		} else {
			if (today.getMonth() < birthDate.getMonth()){
				return today.getFullYear() - birthDate.getFullYear();
			}
			return today.getFullYear() - birthDate.getFullYear() + 1;
		}
	};
})
.filter('alphabeticalOrder', ['$filter', 'illustrationCoreService', function($filter, illustrationCoreService){
	// use to filter dropdown text in alphabetical order
	return function(arr, fieldName, reverse) {
		if (!illustrationCoreService.commonService.hasValue(reverse)) reverse = false;
		// products list
		if (illustrationCoreService.commonService.hasValue(arr) 
				&& !illustrationCoreService.commonService.hasValue(arr[0][fieldName]) 
				&& illustrationCoreService.commonService.hasValue(arr[0].uid)){
			var transformedArr = new Array();
			for (var i = 0; i < arr.length; i++){
				var textValue = illustrationCoreService.findPropertyInElement(arr[i], null, fieldName).value;
				transformedArr.push({uid: arr[i].uid, text: textValue});
			}
			return $filter('orderBy')(transformedArr, 'text', reverse);
		}
		// usual enums
		return $filter('orderBy')(arr, fieldName, reverse);
	};
}])
.filter('etiqaDateFormatTxt', ['$filter', function($filter){
	// use this filter to get Backdating date from an ipos's dateString, eg: 2009-02-28
	return function(dateString) {
		if(dateString == null || dateString == "") return;
		//workaround: yyyy-mm-dd (ISO 8601) date format is not supported in Safari and IE
		var backDateArr = dateString.split("-");
		var backDate = new Date(backDateArr[0], backDateArr[1]-1, backDateArr[2]);
		return $filter('date')(backDate, 'dd/MM/yyyy');
	};
}])
.filter('etiqaDateFormatTxtDDMMYYYY', ['$filter', function($filter){
	// use this filter to format Date string as mm/dd/yyyy
	return function(dateString) {
		if(dateString == null || dateString == "") return;
		//workaround: yyyy-mm-dd (ISO 8601) date format is not supported in Safari and IE
		var backDateArr = dateString.split("-");
		var backDate = new Date(backDateArr[0], backDateArr[1]-1, backDateArr[2]);
		return $filter('date')(backDate, 'dd-MM-yyyy');
	};
}])
.filter('filterByGroup', ['commonService', function(commonService){
	return function(array, groupKey) {
		var result = [];
		if (!commonService.hasValueNotEmpty(groupKey) || !commonService.hasValueNotEmpty(array)){
			return result;
		}
	    for (var i = 0; i < array.length; i++){
	    	if (array[i].group === groupKey){
	    		result.push(array[i]);
	    	}
	    }
		return result;
	};
}])
.filter('filterByValue', ['commonService', function(commonService){
	return function(array, valueKey) {
		var result = [];
		if (!commonService.hasValueNotEmpty(valueKey) || !commonService.hasValueNotEmpty(array)){
			return result;
		}
	    for (var i = 0; i < array.length; i++){
	    	if (array[i].value === valueKey){
	    		result.push(array[i]);
	    	}
	    }
		return result;
	};
}])
.filter('sortPriority', ['commonService', function(commonService){
	return function(array) {
		var result = [];
		if (!commonService.hasValueNotEmpty(array)){
			return result;
		}
	    for (var i = 0; i < array.length; i++){
	    	if (array[i].priority === 'HIGH'){
	    		result.push(array[i]);
	    	}
	    }
	    for (var j = 0; j < array.length; j++){
	    	if (array[j].priority === 'MEDIUM'){
	    		result.push(array[j]);
	    	}
	    }
	    for (var k = 0; k < array.length; k++){
	    	if (array[k].priority === 'LOW'){
	    		result.push(array[k]);
	    	}
	    }
		return result;
	};
}])

.filter('formatFNAOutput', ['commonService', function(commonService) {
      return function(number) {    	  
		var result = "0";
		if(number == '-' || number == '_'){
			result = number;
		} else if(commonService.hasValueNotEmpty(number)){
			var test= number.replace(/\s+/g, '');
			var temp = parseFloat(test.replace(/,/g, ''));
			if(temp < 0) {
				result = "(" + commonService.addCommas(temp*-1) + ")";
			} else {
				result = commonService.addCommas(temp);
			}
		}
		return result;	
      };  
}])
//filter list BI in FNA has status = ACCEPTED or PROPOSED, chosen by FA
.filter('filterAcceptedBIList', ['commonService', function(commonService){
	return function(illustrationFFObjectList) {
		var result = [];
		if (!commonService.hasValueNotEmpty(illustrationFFObjectList)){
			return result;
		}
	    for (var i = 0; i < illustrationFFObjectList.length; i++){
	    	
	    	//chosen by FA
	    	if (illustrationFFObjectList[i].chosenBy == 'FA') {

	    		//status is ACCEPTED or PROPOSED
	    		if(illustrationFFObjectList[i].status == commonService.CONSTANTS.BI_STATUS.PROPOSED
	    			|| illustrationFFObjectList[i].status == commonService.CONSTANTS.BI_STATUS.ACCEPTED){
	    			result.push(illustrationFFObjectList[i]);
	    		}
	    	};
	    }
		return result;
	};
}])
.filter('PDPDHistoryFilter', ['commonService', 'prospectCoreService', function(commonService, prospectCoreService){
	return function(PDFs) {
		var rs = [];
		angular.forEach(PDFs, function(pdf){
			if (prospectCoreService.findPropertyInElement(pdf, ['PDFStatus'], 'value').value === commonService.CONSTANTS.SDWEB.STATUS.SIGNED)
				rs.push(pdf);
		});
		return rs;		
	};
}])
.filter('starFilter', ['clientUIService', function(clientUIService){
	return function(objects){
		var rs = [];
		angular.forEach(objects, function(item){
			if (clientUIService.isStarredObject(item)) {
				rs.push(item);
			}
		});
		return rs;
	};
}])
.filter('totalAnnualPremiumClientFilter', ['clientUIService', 'commonService', function(clientUIService, commonService){
	return function(objects, from, to){
		var rs = [];
		if(!commonService.hasValueNotEmpty(from) && !commonService.hasValueNotEmpty(to)){
			rs = objects;
		} else{
			for(var i=0; i<objects.length; i++){
				var item = objects[i];
				var totalAnnualPremium = parseInt(item.Total_Premium);
				totalAnnualPremium = (totalAnnualPremium == 'NaN' ? 0 : totalAnnualPremium);
				if((!commonService.hasValueNotEmpty(to) && totalAnnualPremium >= from) ||
					(!commonService.hasValueNotEmpty(from) && totalAnnualPremium <= to) ||
					(totalAnnualPremium >= from && totalAnnualPremium <= to)){
					rs.push(item);
				}
			}
		}
		
		return rs;
	};
}])
.filter('starFilterClient', ['clientUIService', function(clientUIService){
	return function(objects, starredList){
		var rs = [];
		angular.forEach(objects, function(item){
			if (starredList.indexOf(clientUIService.findPropertyInElement(item.elements[0],[],"clientNum").value) != -1) {
				rs.push(item);
			}
		});
		return rs;
	};
}])
.filter('clientListFilter', ['clientUIService', function(clientUIService) {
    return function(objects, searchTxt) {
        if (searchTxt == undefined || searchTxt == null || searchTxt.length < 1 || searchTxt == 'Total Annualized Premium')
            return objects;
    	var rs = [];
        var lowerCaseSearchTxt = angular.lowercase(searchTxt);
        angular.forEach(objects, function(item) {
            if (
                (angular.lowercase(clientUIService.getFullName(item)).indexOf(lowerCaseSearchTxt) != -1) ||
                (angular.lowercase(item.Client_ID).indexOf(lowerCaseSearchTxt) != -1) ||
                (angular.lowercase(item.Status).indexOf(lowerCaseSearchTxt) != -1) ||
                (angular.lowercase(item.Mobile).indexOf(lowerCaseSearchTxt) != -1) ||      
                (angular.lowercase(item.Address_Line_1).indexOf(lowerCaseSearchTxt) != -1) ||
                (angular.lowercase(clientUIService.getBirthDate(item)).indexOf(lowerCaseSearchTxt) != -1) ||
               /* (angular.lowercase(item.contact.mail).indexOf(lowerCaseSearchTxt) != -1) ||*/
/*                (angular.lowercase(item.contact.phone1).indexOf(lowerCaseSearchTxt) != -1) ||
                (angular.lowercase(item.contact.phone2).indexOf(lowerCaseSearchTxt) != -1) ||*/
                (angular.lowercase(clientUIService.getGender(item)).indexOf(lowerCaseSearchTxt) != -1)
            ) {
                rs.push(item);
            }
        });
        return rs;
    };
}])
.filter('clientNameStartWithFilter', ['clientUIService', function(clientUIService) {
    return function(objects, searchTxt) {
        if (searchTxt == undefined || searchTxt == null || searchTxt.length < 1 || searchTxt == "All")
            return objects;

        var rs = [];
        var lowerCaseSearchTxt = angular.lowercase(searchTxt);
        var patt = new RegExp("[b-z]", "g");
        angular.forEach(objects, function(item) {
            var fullnameLowercase = angular.lowercase(clientUIService.getFullName(item));
            if (fullnameLowercase.indexOf(lowerCaseSearchTxt) == 0 ||
                (lowerCaseSearchTxt == 'a' && fullnameLowercase.substring(0, 1).replace(patt, "") != "")) {
                rs.push(item);
            }
        });
        return rs;
    };
}])
.filter('cutLongTextFilter', function() {
    return function(value, max) {
        if (!value) return '';

        max = parseInt(max, 10);
        if (!max) return value;
        if (value.length <= max) return value;

        value = value.substr(0, max);

        return value + (' ...');
    };
})
.filter('myClientsFilter', ['clientUIService', function(clientUIService) {
    return function(objects, searchTxt) {
        if (searchTxt == undefined || searchTxt == null || searchTxt.length < 1 || searchTxt == 'Total Annualized Premium')
            return objects;

        var rs = [];
        var lowerCaseSearchTxt = angular.lowercase(searchTxt);
        angular.forEach(objects, function(item) {
            if (

                (angular.lowercase(clientUIService.getFullName(item)).indexOf(lowerCaseSearchTxt) != -1) ||
                (angular.lowercase(item.contact.phone1).indexOf(lowerCaseSearchTxt) != -1) ||
                (angular.lowercase(item.clientnum).indexOf(lowerCaseSearchTxt) != -1) ||
                (angular.lowercase(item.addressResponse.city).indexOf(lowerCaseSearchTxt) != -1)
            ) {
                rs.push(item);
            }
        });
        return rs;
    };
}])
.filter('documentListFilter1', ['prospectUIService', function(prospectUIService) {
    return function(objects, searchTxt, searchType) {
        if (searchTxt == undefined || searchTxt == null || searchTxt.length < 1)
            return objects;
        var rs = [];
        var lowerCaseSearchTxt = angular.lowercase(searchTxt);
        angular.forEach(objects, function(item) {
            // for Policy
            if (searchType == undefined || searchType == "Meta data") {
                if (
                    (angular.lowercase(prospectUIService.findValueInMapListByKey(item, 'DocName')) == undefined)

                ) {
                    var date = "";
                    var dueDate = item.PremiumDueDate;
                    if (dueDate != undefined || dueDate != null) {
                        date = dueDate;
                    } else {
                        var expiryDate = item.ExpiryDate;
                        date = expiryDate;
                    }
                    var rdate = date.split('-');
                    var year = rdate[0];
                    var month = rdate[1];
                    var day = rdate[2];
                    rdate = day + "/" + month + "/" + year;

                    if (
                        (angular.lowercase(item.PolicyNum).indexOf(lowerCaseSearchTxt) != -1) ||
                        (angular.lowercase(item.Insured).indexOf(lowerCaseSearchTxt) != -1) ||
                        (angular.lowercase(rdate).indexOf(lowerCaseSearchTxt) != -1)
                    ) {
                        rs.push(item);
                    }
                }
                // for BI & Quotation
                else {
                    var fullName = prospectUIService.findValueInMapListByKey(item, 'POFirstName') + " " + prospectUIService.findValueInMapListByKey(item, 'POLastName');
                    var expiryDay = prospectUIService.findValueInMapListByKey(item, 'UpdatedDate');
                    if (expiryDay != undefined || expiryDay != null) {
                        var date = expiryDay.split('-');
                        var year = date[0];
                        var month = date[1] - 1;
                        var day = date[2];
                        var d = new Date(year, month, day);
                        d.setDate(d.getDate() + 30);
                        var rdateString = d.toISOString().slice(0, 10);
                        var rdate = rdateString.split('-');
                        var ryear = rdate[0];
                        var rmonth = rdate[1];
                        var rday = rdate[2];
                        expiryDay = rday + "/" + rmonth + "/" + ryear;
                    }
                    if (
                        (angular.lowercase(prospectUIService.findValueInMapListByKey(item, 'DocName')).indexOf(lowerCaseSearchTxt) != -1) ||
                        (angular.lowercase(fullName).indexOf(lowerCaseSearchTxt) != -1) ||
                        (angular.lowercase(expiryDay).indexOf(lowerCaseSearchTxt) != -1)
                    ) {
                        rs.push(item);
                    }
                }
            }


        });
        return rs;
    };
}])
/*This filter for My policy due portlet*/
.filter('documentListFilter2', ['prospectUIService', function(prospectUIService){
    return function(objects, searchTxt, searchType){
        if (searchTxt == undefined || searchTxt == null || searchTxt.length < 1)
            return objects;
        var rs = [];
        var lowerCaseSearchTxt = angular.lowercase(searchTxt);
        angular.forEach(objects, function(item){
            if (searchType == undefined || searchType == "Meta data"){
                
                    var date = item.ExpiryDate;                 
                    var rdate=date.split('-');
                    var year=rdate[0];
                    var month=rdate[1];
                    var day = rdate[2];                         
                    rdate = day+"/"+month+"/"+year;
                    
                    if (
                            (angular.lowercase(item.PolicyNum).indexOf(lowerCaseSearchTxt)!=-1) || 
                            (angular.lowercase(item.Insured).indexOf(lowerCaseSearchTxt)!=-1) ||
                            (angular.lowercase(item.PolicyType).indexOf(lowerCaseSearchTxt)!=-1) ||
                            (angular.lowercase(rdate).indexOf(lowerCaseSearchTxt)!=-1)
                        )   
                    {
                        rs.push(item);
                    }
                
            }
            else if (angular.lowercase(item.PolicyType).indexOf(lowerCaseSearchTxt)!=-1)    
            {
                rs.push(item);
            }
        });
        return rs;
    };
}])

.filter('daysFilter', function() {
    return function(dayString) {
        if (dayString != undefined) {
            var date = dayString.split('-');
            var year = date[0];
            var month = date[1];
            var day = date[2];
            return day + "/" + month + "/" + year;
        } else {

        }
    };
})
.filter('expiryDaysFilter', function() {
    return function(dayString) {
        if (dayString != undefined) {
            var date = dayString.split('-');
            var year = date[0];
            var month = date[1] - 1;
            var day = date[2];
            var d = new Date(year, month, day);
            d.setDate(d.getDate() + 30);
            var rdateString = d.toISOString().slice(0, 10);
            var rdate = rdateString.split('-');
            var ryear = rdate[0];
            var rmonth = rdate[1];
            var rday = rdate[2];
            return rday + "/" + rmonth + "/" + ryear;
        } else {

        }
    };
})
.filter('policyListFilter2', ['prospectUIService', function(prospectUIService) {
    return function(objects, searchTxt, searchType) {
        if (searchTxt == undefined || searchTxt == null || searchTxt.length < 1)
            return objects;

        var rs = [];
        var lowerCaseSearchTxt = angular.lowercase(searchTxt);
        angular.forEach(objects, function(item) {
            // no filter at this moment.
            if (searchType == undefined || searchType == "Meta data") {
                if (
                    (angular.lowercase(prospectUIService.findPropertyInElement(item, ['policy'], 'policyNum').value).indexOf(lowerCaseSearchTxt) != -1) ||
                    (angular.lowercase(prospectUIService.findPropertyInElement(item, ['policy'], 'fpremium').value).indexOf(lowerCaseSearchTxt) != -1) ||
                    (angular.lowercase(prospectUIService.findPropertyInElement(item, ['policy'], 'policyStatus').value).indexOf(lowerCaseSearchTxt) != -1)
                ) {
                    rs.push(item);
                }
            } else if (angular.lowercase(prospectUIService.findPropertyInElement(item, ['policy'], searchType).value).indexOf(lowerCaseSearchTxt) != -1) {
                rs.push(item);
            }

        });
        return rs;
    };
}])
.filter('datetimeFilter', function() {
	var existingDateList = ["YYYY-MM-DD hh-mm-ss","YYYY-MM-DD-hh-mm-ss", "YYYY-MM-DD", "DD-MM-YYYY hh-mm-ss", "DD-MM-YYYY-hh-mm-ss", "DD-MM-YYYY"];
    return function(data,format){
    	if(data==undefined || data=="" || format==undefined)
			return;
		return moment(data,existingDateList).format(format);
    };
})
.filter('addDaysFilter', function() {
    return function(dayString) {
    	if(dayString.slice(2,3)=='-'){
    		var day = dayString.substring(0, 2);
	        var month = dayString.substring(3, 5);
	        var year = dayString.substring(6, 10);
    	} else {
    		var year = dayString.substring(0, 4);
            var month = dayString.substring(5, 7);
            var day = dayString.substring(8, 10);
    	}
        var d = new Date();
        d.setFullYear(year, month, day);
        var result = new Date();
        result.setDate(d.getDate() + 30);
        var dateString = result.toISOString().slice(0, 10);
        return dateString;
    };
})

.filter('policyListFilter4', ['prospectUIService', function(prospectUIService) {
    return function(objects, searchTxt, searchType) {
        if (searchTxt == undefined || searchTxt == null || searchTxt.length < 1)
            return objects;

        var rs = [];
        var lowerCaseSearchTxt = angular.lowercase(searchTxt);
        angular.forEach(objects, function(item) {
            // no filter at this moment.
            if (searchType == undefined || searchType == "Meta data") {
                if (
                    (angular.lowercase(item.DocName).indexOf(lowerCaseSearchTxt) != -1) ||
                    (angular.lowercase(item.DocumentStatus).indexOf(lowerCaseSearchTxt) != -1) ||
                    (angular.lowercase(item.Insured == undefined ? "" : item.Insured).indexOf(lowerCaseSearchTxt) != -1)
                ) {
                    rs.push(item);
                }
            } else if (searchType == 'quoteNo') {
            	if (angular.lowercase(item.DocName).indexOf(lowerCaseSearchTxt) != -1)
            	{
                	rs.push(item);
            	}
            } else if (searchType == 'status') {
            	if (angular.lowercase(item.BusinessStatus).indexOf(lowerCaseSearchTxt) != -1 || angular.lowercase(item.DocumentStatus).indexOf(lowerCaseSearchTxt) != -1)
            	{
            		rs.push(item);
            	}
            }

        });
        return rs;
    };
}])
.filter('dateFilter', function() {
	return function(dayString) {
        if (dayString != undefined && dayString != "") {
        	dayString = dayString.toString();
        	var isDate = ((new Date(dayString)).toString() !== "Invalid Date") ? true : false;
        	if(isDate){
        		var date = dayString.split('-');
                var year = date[0];
                var month = date[1];
                var day = date[2];
                return day + "/" + month + "/" + year;
        	} else{
        		return dayString;
        	}   
        } else {

        }
    };
})
.filter('dateFilter2', function() {
    return function(dayString) {
        if (dayString != undefined && dayString != "") {
            var year = dayString.substr(0,4);
            var month = dayString.substr(4,2);
            var day = dayString.substr(6);
            return day + "/" + month + "/" + year;
        } else {

        }
    };
})

// return date with format dd/mm/yy - Example:13/09/2016
.filter('dateFilter3', function() {
    return function(dayString) {     
    	return $.datepicker.formatDate("dd/mm/yy",new Date(dayString));
    };
})
.filter('policyListFilter1', ['prospectUIService', function(prospectUIService){
	return function(objects, searchTxt, searchType){
		if (searchTxt == undefined || searchTxt == null || searchTxt.length < 1)
			return objects;
		
		var rs = [];
		var lowerCaseSearchTxt = angular.lowercase(searchTxt);
		angular.forEach(objects, function(item){
			// no filter at this moment.
			if (searchType == undefined || searchType == "Meta data"){
				if (
						/*(angular.lowercase(prospectUIService.findPropertyInElement(item,['policy'],'policyNum').value).indexOf(lowerCaseSearchTxt)!=-1) ||
						(angular.lowercase(prospectUIService.findPropertyInElement(item,['policy'],'contractType').value).indexOf(lowerCaseSearchTxt)!=-1) ||
						(angular.lowercase(prospectUIService.findPropertyInElement(item,['policy'],'status').value).indexOf(lowerCaseSearchTxt)!=-1) */
						(angular.lowercase(item.Contract_Number).indexOf(lowerCaseSearchTxt)!=-1) ||
						(angular.lowercase(item.Contract_Type).indexOf(lowerCaseSearchTxt)!=-1) ||
						(angular.lowercase(item.Status).indexOf(lowerCaseSearchTxt)!=-1) 
				) {
					rs.push(item);
				}	
			}
			else if (angular.lowercase(item.Status).indexOf(lowerCaseSearchTxt)!=-1)	
			{
				rs.push(item);
			}
			else if (angular.lowercase(item.Contract_Type).indexOf(lowerCaseSearchTxt)!=-1)	
			{
				rs.push(item);
			}
			
		});
		return rs;
	};
}])
.filter('policyListFilter3', ['prospectUIService', function(prospectUIService) {
    return function(objects, searchTxt, searchType) {
        if (searchTxt == undefined || searchTxt == null || searchTxt.length < 1)
            return objects;
        var rs = [];
        var lowerCaseSearchTxt = angular.lowercase(searchTxt);
        angular.forEach(objects, function(item) {
            // no filter at this moment.
            if (searchType == undefined || searchType == "Meta data") {
                if (
                    (angular.lowercase(prospectUIService.findJsonPathInItem(item, '$..policyNum')).indexOf(lowerCaseSearchTxt) != -1) ||
                    (angular.lowercase(prospectUIService.findJsonPathInItem(item, '$..policyType')).indexOf(lowerCaseSearchTxt) != -1) ||
                    (angular.lowercase(prospectUIService.findJsonPathInItem(item, '$..pStatus')).indexOf(lowerCaseSearchTxt) != -1)
                ) {
                    rs.push(item);
                }
            } else if (angular.lowercase(prospectUIService.findJsonPathInItem(item, '$..pStatus')).indexOf(lowerCaseSearchTxt) != -1) {
                rs.push(item);
            } else if (angular.lowercase(prospectUIService.findJsonPathInItem(item, '$..policyType')).indexOf(lowerCaseSearchTxt) != -1) {
                rs.push(item);
            }

        });
        return rs;
    };
}])
.filter('policyListFilter6', ['policyUIService', function(policyUIService) {
    return function(objects, searchTxt, searchType) {
        if (searchTxt == undefined || searchTxt == null || searchTxt.length < 1)
            return objects;

        var rs = [];
        var lowerCaseSearchTxt = angular.lowercase(searchTxt);
        angular.forEach(objects, function(item) {
            // no filter at this moment.
            if (searchType == undefined || searchType == "Metadata") {
                if (
                    (angular.lowercase(policyUIService.findJsonPathInItem(item, '$..Policy_Number')).indexOf(lowerCaseSearchTxt) != -1 ||
                        angular.lowercase(policyUIService.findJsonPathInItem(item, '$..Expiry_Date')).indexOf(lowerCaseSearchTxt) != -1 ||
                        angular.lowercase(policyUIService.findJsonPathInItem(item, '$..LIFE_INSURED')).indexOf(lowerCaseSearchTxt) != -1 ||
                        angular.lowercase(policyUIService.findJsonPathInItem(item, '$..Contract_Type')).indexOf(lowerCaseSearchTxt) != -1)
                ) {
                    rs.push(item);
                }
            } else if (searchType == "policyNumber") {
                if (
                    (angular.lowercase(policyUIService.findJsonPathInItem(item, '$..Policy_Number')).indexOf(lowerCaseSearchTxt) != -1)
                ) {
                    rs.push(item);
                }
            } else if (searchType == "contractType") {
            	if (
                       (angular.lowercase(policyUIService.findJsonPathInItem(item, '$..Contract_Type')).indexOf(lowerCaseSearchTxt) != -1)
                ) {
                        rs.push(item);
                }
            }
        });
        return rs;
    };
}])
.filter('policyListFilter8', ['policyUIService', function(policyUIService) {
    return function(objects, searchTxt, searchType) {
        if (searchTxt == undefined || searchTxt == null || searchTxt.length < 1)
            return objects;

        var rs = [];
        var lowerCaseSearchTxt = angular.lowercase(searchTxt);
        angular.forEach(objects, function(item) {
            // no filter at this moment.
            if (searchType == undefined || searchType == "Metadata") {
                if (
                    (angular.lowercase(policyUIService.findJsonPathInItem(item, '$..Policy_Number')).indexOf(lowerCaseSearchTxt) != -1 ||
                        angular.lowercase(policyUIService.findJsonPathInItem(item, '$..Renewal_Date')).indexOf(lowerCaseSearchTxt) != -1 ||
                        angular.lowercase(policyUIService.findJsonPathInItem(item, '$..Asset')).indexOf(lowerCaseSearchTxt) != -1 ||
                        angular.lowercase(policyUIService.findJsonPathInItem(item, '$..Contract_Type')).indexOf(lowerCaseSearchTxt) != -1)
                ) {
                    rs.push(item);
                }
            } else if (searchType == "policyNumber") {
                if (
                    (angular.lowercase(policyUIService.findJsonPathInItem(item, '$..Policy_Number')).indexOf(lowerCaseSearchTxt) != -1)
                ) {
                    rs.push(item);
                }
            } else if (searchType == "contractType") {
            	if (
                       (angular.lowercase(policyUIService.findJsonPathInItem(item, '$..Contract_Type')).indexOf(lowerCaseSearchTxt) != -1)
                ) {
                        rs.push(item);
                }
            }
        });
        return rs;
    };
}])
.filter('paymentListForAgentFilter', ['paymentUIService', function(paymentUIService) {
	return function(objects, searchTxt, searchType) {
		if (searchTxt == undefined || searchTxt == null || searchTxt.length < 1)
			return objects;
		
		var rs = [];
		var lowerCaseSearchTxt = angular.lowercase(searchTxt);
		angular.forEach(objects, function(item) {
			// no filter at this moment.
			if (searchType == undefined || searchType == "Metadata") {
				if (
						angular.lowercase(paymentUIService.findJsonPathInItem(item, '$..POName')).indexOf(lowerCaseSearchTxt) != -1 ||
						angular.lowercase(paymentUIService.findJsonPathInItem(item, '$..CaseType')).indexOf(lowerCaseSearchTxt) != -1 ||
						angular.lowercase(paymentUIService.findJsonPathInItem(item, '$..Premium')).indexOf(lowerCaseSearchTxt) != -1 ||
						angular.lowercase(paymentUIService.findJsonPathInItem(item, '$..SumInsured')).indexOf(lowerCaseSearchTxt) != -1
				) {
					rs.push(item);
				}
			} else if (searchType == "CaseType" && item.CaseType!=='' && item.CaseType!==undefined) {
				if (
						(angular.lowercase(paymentUIService.findJsonPathInItem(item, '$..CaseType')).indexOf(lowerCaseSearchTxt) != -1)
				) {
					rs.push(item);
				}
			} else if (searchType == "CaseName" && item.CaseName!=='' && item.CaseName!==undefined) {
				if (
						(angular.lowercase(paymentUIService.findJsonPathInItem(item, '$..CaseName')).indexOf(lowerCaseSearchTxt) != -1)
				) {
					rs.push(item);
				}
			} else if (searchType == "PaymentMethod" && item.PaymentMethod!=='' && item.PaymentMethod!==undefined) {
				if (
						(angular.lowercase(paymentUIService.findJsonPathInItem(item, '$..PaymentMethod')).indexOf(lowerCaseSearchTxt) != -1)
				) {
					rs.push(item);
				}
			}
		});
		return rs;
	};
}])
.filter('transactionListForAgentFilter', ['transactionUIService', function(transactionUIService) {
	return function(objects, searchTxt, searchType) {
		if (searchTxt == undefined || searchTxt == null || searchTxt.length < 1)
			return objects;
		
		var rs = [];
		var lowerCaseSearchTxt = angular.lowercase(searchTxt);
		angular.forEach(objects, function(item) {
			// no filter at this moment.
			if (searchType == undefined || searchType == "Metadata") {
				if (
						angular.lowercase(transactionUIService.findJsonPathInItem(item, '$..DocName')).indexOf(lowerCaseSearchTxt) != -1 ||
						angular.lowercase(transactionUIService.findJsonPathInItem(item, '$..PaymentMethod')).indexOf(lowerCaseSearchTxt) != -1
				) {
					rs.push(item);
				}
			} else if (searchType == "PaymentMethod" && item.PaymentMethod!=='' && item.PaymentMethod!==undefined) {
				if (
						(angular.lowercase(transactionUIService.findJsonPathInItem(item, '$..PaymentMethod')).indexOf(lowerCaseSearchTxt) != -1)
				) {
					rs.push(item);
				}
			} else if (searchType == "TransactionName" && item.DocName!=='' && item.DocName!==undefined) {
				if (
						(angular.lowercase(transactionUIService.findJsonPathInItem(item, '$..DocName')).indexOf(lowerCaseSearchTxt) != -1)
				) {
					rs.push(item);
				}
			}
		});
		return rs;
	};
}])
.filter('receiptListFilter', function(){
	return function(objects, searchTxt){
		if (searchTxt == undefined || searchTxt == null || searchTxt.length < 1)
			return objects;
		
		var rs = [];
		var lowerCaseSearchTxt = angular.lowercase(searchTxt);
		angular.forEach(objects, function(item){
			// no filter at this moment.
			if (
					(angular.lowercase(item.Payor_Name).indexOf(lowerCaseSearchTxt)!=-1) ||
					(angular.lowercase(item.Receipt_Number).indexOf(lowerCaseSearchTxt)!=-1)
			) {
				rs.push(item);
			}	
		});
		return rs;
	};
})

/*This filter for My Workspace portlet*/
.filter('myWorkspaceFilter', ['prospectUIService', 'illustrationUIService', 'applicationUIService', 'salecaseUIService', 'pdpaUIService', 'claimUIService', 'clientUIService', 'claimNotificationUIService', 
    function(prospectUIService, illustrationUIService, applicationUIService, salecaseUIService, pdpaUIService, claimUIService, clientUIService, claimNotificationUIService) {
    return function(objects, searchTxt, currentState) {
        if (searchTxt == undefined || searchTxt == null || searchTxt.length < 1)
            return objects;
        var rs = [];
        var lowerCaseSearchTxt = angular.lowercase(searchTxt);
        angular.forEach(objects, function(item) {
        	if (currentState == 'prospect') {
                if(
                	(angular.lowercase(prospectUIService.findValueInMapListByKey(item,'FullName')).indexOf(lowerCaseSearchTxt) != -1 ||
                	 angular.lowercase(prospectUIService.findValueInMapListByKey(item,'Gender')).indexOf(lowerCaseSearchTxt) != -1 ||
                	 angular.lowercase(salecaseUIService.findValueInMapListByKey(item,'CreatedDate')).indexOf(lowerCaseSearchTxt) != -1 ||
                	 angular.lowercase(prospectUIService.findValueInMapListByKey(item,'Age')).indexOf(lowerCaseSearchTxt) != -1 || 
                	 (angular.lowercase(prospectUIService.findValueInMapListByKey(item,'ICNumber')) != undefined &&
                			 angular.lowercase(prospectUIService.findValueInMapListByKey(item,'ICNumber')).indexOf(lowerCaseSearchTxt) != -1))
                ){
                    rs.push(item);
                }
            } else if (currentState == 'BIState') { 
            	if(
            		(angular.lowercase(illustrationUIService.findValueInMapListByKey(item,'ProductName')).indexOf(lowerCaseSearchTxt) != -1) ||
            		(angular.lowercase(illustrationUIService.findValueInMapListByKey(item,'DocName')).indexOf(lowerCaseSearchTxt) != -1)
            	){
            		rs.push(item);
            	}            	
            } else if (currentState == 'applicationState') { 
            	if(
	        		(angular.lowercase(applicationUIService.findValueInMapListByKey(item,'Product')).indexOf(lowerCaseSearchTxt) != -1 ||
	                 angular.lowercase(applicationUIService.findValueInMapListByKey(item,'DocName')).indexOf(lowerCaseSearchTxt) != -1 ||
	                 angular.lowercase(applicationUIService.findValueInMapListByKey(item,'POFullName')).indexOf(lowerCaseSearchTxt) != -1)
            	){
            		rs.push(item);
            	}            	
            }else if (currentState == 'pdpaState') { 
                if(
	        		(angular.lowercase(pdpaUIService.findValueInMapListByKey(item,'ProspectFullName')).indexOf(lowerCaseSearchTxt) != -1)
            	){
            		rs.push(item);
            	}            	
            }else if (currentState == 'case-management') { 
            	if(
	        		(angular.lowercase(salecaseUIService.findValueInMapListByKey(item,'CaseName')).indexOf(lowerCaseSearchTxt) != -1 ||
	        		 angular.lowercase(salecaseUIService.findValueInMapListByKey(item,'DocName')).indexOf(lowerCaseSearchTxt) != -1 ||
	        		 angular.lowercase(salecaseUIService.findValueInMapListByKey(item,'CreatedDate')).indexOf(lowerCaseSearchTxt) != -1 ||
	                 angular.lowercase(salecaseUIService.findValueInMapListByKey(item,'Product')).indexOf(lowerCaseSearchTxt) != -1 ||
	                 angular.lowercase(salecaseUIService.findValueInMapListByKey(item,'DocumentStatus')).indexOf(lowerCaseSearchTxt) != -1 ) 
            	){
            		rs.push(item);
            	}            	
            }else if (currentState == 'claim-notification') { 
            	if(
            			(angular.lowercase(claimNotificationUIService.findValueInMapListByKey(item,'ClaimNo')).indexOf(lowerCaseSearchTxt) != -1 ||
            			 angular.lowercase(claimNotificationUIService.findValueInMapListByKey(item,'DocName')).indexOf(lowerCaseSearchTxt) != -1 ||
            			 angular.lowercase(claimNotificationUIService.findValueInMapListByKey(item,'BusinessStatus')).indexOf(lowerCaseSearchTxt) != -1 ||
            			 angular.lowercase(claimNotificationUIService.findValueInMapListByKey(item,'DocId')).indexOf(lowerCaseSearchTxt) != -1 ||
       		             angular.lowercase(claimNotificationUIService.findValueInMapListByKey(item,'CreatedDate')).indexOf(lowerCaseSearchTxt) != -1 ||
       		             angular.lowercase(claimNotificationUIService.findValueInMapListByKey(item,'NotifiedBy')).indexOf(lowerCaseSearchTxt) != -1)
                	){
                		rs.push(item);
                	}            	
                }
            else if (currentState == 'claim') { 
            	if(
        			(angular.lowercase(claimUIService.findValueInMapListByKey(item,'claimId')).indexOf(lowerCaseSearchTxt) != -1 ||
        			 angular.lowercase(claimUIService.findValueInMapListByKey(item,'policyId')).indexOf(lowerCaseSearchTxt) != -1 ||
        			 angular.lowercase(salecaseUIService.findValueInMapListByKey(item,'status')).indexOf(lowerCaseSearchTxt) != -1 ||
   		             angular.lowercase(claimUIService.findValueInMapListByKey(item,'reportDate')).indexOf(lowerCaseSearchTxt) != -1)
            	){
            		rs.push(item);
            	}            	
            }else if (currentState == 'ClientState') {
            	/*var firstName = clientUIService.findValueInMapListByKey(item,'fullname').firstname;
            	var lastName = clientUIService.findValueInMapListByKey(item,'fullname').lastname;
            	if(
    	        		(angular.lowercase(clientUIService.findValueInMapListByKey(item,'clientnum')).indexOf(lowerCaseSearchTxt) != -1 ||                       
	        				(angular.lowercase(firstName)).indexOf(lowerCaseSearchTxt) != -1 ||                       
	        				(angular.lowercase(lastName)).indexOf(lowerCaseSearchTxt) != -1)
                	){
                		rs.push(item);
                	}            	
                }*/
            	if(
    	        		(angular.lowercase(clientUIService.findValueInMapListByKey(item,'First_Name')).indexOf(lowerCaseSearchTxt) != -1 ||                       
	        				angular.lowercase(clientUIService.findValueInMapListByKey(item,'Surname')).indexOf(lowerCaseSearchTxt) != -1 ||                       
	        				angular.lowercase(clientUIService.findValueInMapListByKey(item,'Client_ID')).indexOf(lowerCaseSearchTxt) != -1)
                	){
                		rs.push(item);
                	}            	
            }else if (currentState == 'policy') { 
	        	if(
		        		(angular.lowercase(claimUIService.findValueInMapListByKey(item,'Contract_Number')).indexOf(lowerCaseSearchTxt) != -1 ||
		        		 angular.lowercase(claimUIService.findValueInMapListByKey(item,'Policy_Owner')).indexOf(lowerCaseSearchTxt) != -1 ||
		        		 angular.lowercase(salecaseUIService.findValueInMapListByKey(item,'Expiry_Date')).indexOf(lowerCaseSearchTxt) != -1 ||
		                 angular.lowercase(claimUIService.findValueInMapListByKey(item,'Status')).indexOf(lowerCaseSearchTxt) != -1)
	            	){
	            		rs.push(item);
	            	}            	
            }else if (currentState == 'client') { 
	        	if(
		        		(angular.lowercase(claimUIService.findValueInMapListByKey(item,'First_Name')).indexOf(lowerCaseSearchTxt) != -1 ||
		        		 angular.lowercase(claimUIService.findValueInMapListByKey(item,'Surname')).indexOf(lowerCaseSearchTxt) != -1 ||
		        		 angular.lowercase(salecaseUIService.findValueInMapListByKey(item,'Client_ID')).indexOf(lowerCaseSearchTxt) != -1 ||
		                 angular.lowercase(claimUIService.findValueInMapListByKey(item,'Status')).indexOf(lowerCaseSearchTxt) != -1)
	            	){
	            		rs.push(item);
	            	}            	
            }
        });
        return rs;
    };
}])
.filter('policyListMWFilter', ['policyCoreService', function(policyCoreService) {
    return function(objects, searchTxt) {
        if (searchTxt == undefined || searchTxt == null || searchTxt.length < 1)
            return objects;
        var rs = [];
        var lowerCaseSearchTxt = angular.lowercase(searchTxt);
        angular.forEach(objects, function(item) {
            if (

                (angular.lowercase(item.policyNum).indexOf(lowerCaseSearchTxt) != -1) ||
                (angular.lowercase(item.policyType).indexOf(lowerCaseSearchTxt) != -1) ||
                (angular.lowercase(item.pStatus).indexOf(lowerCaseSearchTxt) != -1) ||
                (angular.lowercase(item.effectiveDate).indexOf(lowerCaseSearchTxt) != -1) ||
                (angular.lowercase(item.maturityDate).indexOf(lowerCaseSearchTxt) != -1) ||
                (angular.lowercase(item.policyOwner).indexOf(lowerCaseSearchTxt) != -1)
            ) {
                rs.push(item);
            }
        });
        return rs;
    };
}])
.filter('policyListToNotDuplicate', function() {
    return function(objects) {
    	for (var i = 0; i < objects.length; i++) { 
		    if(objects[i].Status.indexOf('Cancelled')!=-1||objects[i].Status.indexOf('Renewal')!=-1||objects[i].Status.indexOf('Endorsement')!=-1){
		    	objects.splice(i,1);
		    }
		}
        return objects;
    };
})
.filter('trimtext', function () {
    return function (value, wordwise, max,tail) {
        if (!value) return '';
        max = parseInt(max, 10);
        if (!max) return value;
        if (value.length <= max) return value;

        value = value.toString().substr(0, max);
        if (wordwise) {
            var lastspace = value.toString().lastIndexOf(' ');
            if (lastspace != -1) {
                value = value.toString().substr(0, lastspace);
            }
        }

        return value + (tail);
    };
})

.filter('groupBy', ['$timeout', function ($timeout) {
    return function (data, key) {
        if (!key) return data;
        var outputPropertyName = '__groupBy__' + key;
        if(!data[outputPropertyName]){
            var result = {};  
            for (var i=0;i<data.length;i++) {
                if (!result[data[i][key]])
                    result[data[i][key]]=[];
                result[data[i][key]].push(data[i]);
            }
            Object.defineProperty(data, outputPropertyName, {enumerable:false, configurable:true, writable: false, value:result});
            $timeout(function(){delete data[outputPropertyName];},0,false);
        }
        return data[outputPropertyName];
    };
}])

.filter('paymentSearchFilter', ['paymentUIService', function(paymentUIService){
	return function(objects, searchTxt){
		if (!paymentUIService.commonService.hasValueNotEmpty(searchTxt))
			return objects;
		var rs = [];
		var lowerCaseSearchTxt = angular.lowercase(searchTxt);
		angular.forEach(objects, function(item){
			if (angular.lowercase(item.PaymentMethod).indexOf(lowerCaseSearchTxt) !=- 1 
					|| angular.lowercase(item.PaymentDate).indexOf(lowerCaseSearchTxt) != -1){
				rs.push(item);
			}
		});
		return rs;
	};
}])

.filter('getFileType', function () {
    return function (fileName) {
    	var fileExtension;
       if (!fileName) return '';
       else{
    	   fileExtension = fileName.substr((fileName.lastIndexOf('.') + 1));
       }
       return fileExtension;
    };
})

.filter('paymentDueListFilter', function(){
	return function(objects, searchTxt, searchType){
		if (searchTxt == undefined || searchTxt == null || searchTxt.length < 1)
			return objects;	
		var rs = [];
		var lowerCaseSearchTxt = angular.lowercase(searchTxt);
		angular.forEach(objects, function(item){
			if (searchType == undefined || searchType == "Metadata"){
				if (
						(angular.lowercase(item.Expiry_Date).indexOf(lowerCaseSearchTxt)!=-1) ||
						(angular.lowercase(item.Policy_Number).indexOf(lowerCaseSearchTxt)!=-1) ||
						(angular.lowercase(item.Effective_Date).indexOf(lowerCaseSearchTxt)!=-1) ||
						(angular.lowercase(item.Policy_Owner).indexOf(lowerCaseSearchTxt)!=-1) ||
						(angular.lowercase(item.LIFE_INSURED).indexOf(lowerCaseSearchTxt)!=-1) ||
						(angular.lowercase(item.Contract_Type).indexOf(lowerCaseSearchTxt)!=-1) ||
						(angular.lowercase(item.Total_Premium).indexOf(lowerCaseSearchTxt)!=-1) ||
						(angular.lowercase(item.Payment_Method).indexOf(lowerCaseSearchTxt)!=-1) ||
						(angular.lowercase(item.Policy_Owner_Mobile_Tel).indexOf(lowerCaseSearchTxt)!=-1)
				) {
					rs.push(item);
				}
			} else if (searchType == "policyType") {
            	if (
                		(angular.lowercase(item.Contract_Type).indexOf(lowerCaseSearchTxt) != -1)
                    ) {
                            rs.push(item);
                    }
			}
		});
		return rs;
	};
})

.filter('renewalListFilter', function(){
	return function(objects, searchTxt, searchType){
		if (searchTxt == undefined || searchTxt == null || searchTxt.length < 1)
			return objects;
		var rs = [];
		var lowerCaseSearchTxt = angular.lowercase(searchTxt);
		angular.forEach(objects, function(item){
			if (searchType == undefined || searchType == "Metadata"){
				if (
					(angular.lowercase(item.Renewal_Date).indexOf(lowerCaseSearchTxt)!=-1) ||
					(angular.lowercase(item.Policy_Number).indexOf(lowerCaseSearchTxt)!=-1) ||
					(angular.lowercase(item.Policy_Owner).indexOf(lowerCaseSearchTxt)!=-1) ||
					(angular.lowercase(item.Asset).indexOf(lowerCaseSearchTxt)!=-1) ||
					(angular.lowercase(item.Contract_Type).indexOf(lowerCaseSearchTxt)!=-1) ||
					(angular.lowercase(item.Total_Sum_Insured).indexOf(lowerCaseSearchTxt)!=-1) ||
					(angular.lowercase(item.Total_Premium).indexOf(lowerCaseSearchTxt)!=-1) ||
					(angular.lowercase(item.Policy_Owner_Mobile_Tel).indexOf(lowerCaseSearchTxt)!=-1)
				) {
					rs.push(item);
				}
			} else if (angular.lowercase(item.Contract_Type).indexOf(lowerCaseSearchTxt)!=-1)	
				{
				rs.push(item);
				}
		});
		return rs;
	};
})

.filter('claimListFilter', ['claimUIService', function(claimUIService){
	return function(objects, searchTxt, searchType){
		if (searchTxt == undefined || searchTxt == null || searchTxt.length < 1)
			return objects;
		
		var rs = [];
		var lowerCaseSearchTxt = angular.lowercase(searchTxt);
		angular.forEach(objects, function(item){
			// no filter at this moment.
			if (searchType == undefined || searchType == "Meta data"){
				if (
						(angular.lowercase(item.ClaimNum).indexOf(lowerCaseSearchTxt)!=-1) ||
						(angular.lowercase(item.PolicyNum).indexOf(lowerCaseSearchTxt)!=-1) ||
						(angular.lowercase(item.ClientNum).indexOf(lowerCaseSearchTxt)!=-1) ||
						(angular.lowercase(item.PolicyOwner).indexOf(lowerCaseSearchTxt)!=-1) ||
						(angular.lowercase(item.Insured).indexOf(lowerCaseSearchTxt)!=-1)
				) {
					rs.push(item);
				}	
			}
			else if (angular.lowercase(item.Status).indexOf(lowerCaseSearchTxt)!=-1)	
			{
				rs.push(item);
			}
			else if (angular.lowercase(item.CoverType).indexOf(lowerCaseSearchTxt)!=-1)	
			{
				rs.push(item);
			}
			
		});
		return rs;
	};
}])

.filter('policyListAgentFilter', ['policyUIService', function(policyUIService){
	return function(objects, searchTxt, searchType){
		if (searchTxt == undefined || searchTxt == null || searchTxt.length < 1)
			return objects;
		
		var rs = [];
		var lowerCaseSearchTxt = angular.lowercase(searchTxt);
		angular.forEach(objects, function(item){
			// no filter at this moment.
			if (searchType == undefined || searchType == "Meta data"){
				if (
						(angular.lowercase(item.Contract_Number).indexOf(lowerCaseSearchTxt)!=-1) ||
						(angular.lowercase(item.Contract_Type).indexOf(lowerCaseSearchTxt)!=-1) ||
						(angular.lowercase(policyUIService.getDate(item.Expiry_Date)).indexOf(lowerCaseSearchTxt)!=-1) ||
						(angular.lowercase(policyUIService.getDate(item.Inception_Date)).indexOf(lowerCaseSearchTxt)!=-1) ||
						(angular.lowercase(item.Status).indexOf(lowerCaseSearchTxt)!=-1)
				) {
					rs.push(item);
				}	
			}
			else if (angular.lowercase(item.Status).indexOf(lowerCaseSearchTxt)!=-1)	
			{
				rs.push(item);
			}
			else if (angular.lowercase(item.Contract_Type).indexOf(lowerCaseSearchTxt)!=-1)	
			{
				rs.push(item);
			}
			
		});
		return rs;
	};
}])
.filter('premiumDueFilter', ['policyUIService', function(policyUIService) {
    return function(objects, searchTxt, searchType) {
        if (searchTxt == undefined || searchTxt == null || searchTxt.length < 1)
            return objects;

        var rs = [];
        var lowerCaseSearchTxt = angular.lowercase(searchTxt);
        angular.forEach(objects, function(item) {
            // no filter at this moment.
            if (searchType == undefined || searchType == "Metadata") {
                if (
                		(angular.lowercase(item.Policy_Number).indexOf(lowerCaseSearchTxt)!=-1) ||
                		(angular.lowercase(item.Expiry_Date).indexOf(lowerCaseSearchTxt)!=-1) ||
                		(angular.lowercase(item.LIFE_INSURED).indexOf(lowerCaseSearchTxt)!=-1) ||
                		(angular.lowercase(item.Total_Premium).indexOf(lowerCaseSearchTxt)!=-1) ||
                        (angular.lowercase(item.Contract_Type).indexOf(lowerCaseSearchTxt) != -1)
                ) {
                    rs.push(item);
                }
            } else if (searchType == "policyNumber") {
                if (
                	(angular.lowercase(item.Policy_Number).indexOf(lowerCaseSearchTxt)!=-1)
                ) {
                    rs.push(item);
                }
            } else if (searchType == "contractType") {
            	if (
            		(angular.lowercase(item.Contract_Type).indexOf(lowerCaseSearchTxt) != -1)
                ) {
                        rs.push(item);
                }
            }
        });
        return rs;
    };
}])
.filter('myAttentionFilter', function(){
	return function(objects, searchTxt, searchType){
		if (searchTxt == undefined || searchTxt == null || searchTxt.length < 1)
			return objects;
		var rs = [];
		var lowerCaseSearchTxt = angular.lowercase(searchTxt);
		angular.forEach(objects, function(item){
			if ((angular.lowercase(item.Policy_Number).indexOf(lowerCaseSearchTxt)!=-1) ||
				(item.Expiry_Date != undefined && angular.lowercase(item.Expiry_Date).indexOf(lowerCaseSearchTxt)!=-1) ||
				(item.Renewal_Date != undefined && angular.lowercase(item.Renewal_Date).indexOf(lowerCaseSearchTxt)!=-1) ||
				(item.LIFE_INSURED != undefined && angular.lowercase(item.LIFE_INSURED).indexOf(lowerCaseSearchTxt)!=-1) ||
				(item.Asset != undefined && angular.lowercase(item.Asset).indexOf(lowerCaseSearchTxt)!=-1))
			{
				rs.push(item);
			} else if (searchType == "policyType") {
            	if ((angular.lowercase(item.Contract_Type).indexOf(lowerCaseSearchTxt) != -1)) {
            		rs.push(item);
            	}
            }	
		});
		return rs;
	};
})

.filter('uniqueForSearch', function() {
    return function(input, key) {
        var unique = {};
        var uniqueList = [];
        for(var i = 0; i < input.length; i++){
            if(typeof unique[input[i][key]] == "undefined"){
                unique[input[i][key]] = "";
                uniqueList.push({'key': input[i][key]});
            }
        }
        return uniqueList;
    };
})

/*This filter for My Workspace portlet*/
.filter('myNewWorkspaceFilter', ['prospectPersonalUIService', 'illustrationUIService', function(prospectPersonalUIService, illustrationUIService) {
    return function(objects, searchTxt, currentState) {
        if (searchTxt == undefined || searchTxt == null || searchTxt.length < 1)
            return objects;
        var rs = [];
        var lowerCaseSearchTxt = angular.lowercase(searchTxt);
        angular.forEach(objects, function(item) {
        	if (currentState == 'prospect') {
                if(
                	(angular.lowercase(prospectPersonalUIService.findValueInMapListByKey(item,'FullName')) != undefined && angular.lowercase(prospectPersonalUIService.findValueInMapListByKey(item,'FullName')).indexOf(lowerCaseSearchTxt) != -1) ||                       
                	(angular.lowercase(prospectPersonalUIService.findValueInMapListByKey(item,'Age')) != undefined && angular.lowercase(prospectPersonalUIService.findValueInMapListByKey(item,'Age')).indexOf(lowerCaseSearchTxt) != -1)
                ){
                    rs.push(item);
                }
            } else if (currentState == 'quotation') {
                if(
                	(angular.lowercase(illustrationUIService.findValueInMapListByKey(item,'DocName')) != undefined && angular.lowercase(illustrationUIService.findValueInMapListByKey(item,'DocName')).indexOf(lowerCaseSearchTxt) != -1) ||  
                	(angular.lowercase(illustrationUIService.findValueInMapListByKey(item,'FullName')) != undefined && angular.lowercase(illustrationUIService.findValueInMapListByKey(item,'FullName')).indexOf(lowerCaseSearchTxt) != -1) || 
                	(angular.lowercase(illustrationUIService.findValueInMapListByKey(item,'OwnerUid')) != undefined && angular.lowercase(illustrationUIService.findValueInMapListByKey(item,'OwnerUid')).indexOf(lowerCaseSearchTxt) != -1)
                ){
                    rs.push(item);
                }
        	}else if (currentState == 'BIState') { 
            	if(
            		(angular.lowercase(illustrationUIService.findValueInMapListByKey(item,'ProductName')) != undefined && angular.lowercase(illustrationUIService.findValueInMapListByKey(item,'ProductName')).indexOf(lowerCaseSearchTxt) != -1) ||
            		(angular.lowercase(illustrationUIService.findValueInMapListByKey(item,'DocName')) != undefined && angular.lowercase(illustrationUIService.findValueInMapListByKey(item,'DocName')).indexOf(lowerCaseSearchTxt) != -1)
            	){
            		rs.push(item);
            	}            	
            } else if (currentState == 'applicationState') { 
            	if(
	        		(angular.lowercase(prospectPersonalUIService.findValueInMapListByKey(item,'Product')) != undefined && angular.lowercase(prospectPersonalUIService.findValueInMapListByKey(item,'Product')).indexOf(lowerCaseSearchTxt) != -1) ||
	                (angular.lowercase(prospectPersonalUIService.findValueInMapListByKey(item,'DocName')) != undefined && angular.lowercase(prospectPersonalUIService.findValueInMapListByKey(item,'DocName')).indexOf(lowerCaseSearchTxt) != -1) ||
	                (angular.lowercase(prospectPersonalUIService.findValueInMapListByKey(item,'POFullName')) != undefined && angular.lowercase(prospectPersonalUIService.findValueInMapListByKey(item,'POFullName')).indexOf(lowerCaseSearchTxt) != -1)
            	){
            		rs.push(item);
            	}            	
            }else if (currentState == 'pdpaState') { 
                if(
	        		(angular.lowercase(prospectPersonalUIService.findValueInMapListByKey(item,'ProspectFullName')) != undefined && angular.lowercase(prospectPersonalUIService.findValueInMapListByKey(item,'ProspectFullName')).indexOf(lowerCaseSearchTxt) != -1)
            	){
            		rs.push(item);
            	}            	
            }else if (currentState == 'salecaseState') { 
            	if(
	        		(angular.lowercase(prospectPersonalUIService.findValueInMapListByKey(item,'Product')) != undefined && angular.lowercase(prospectPersonalUIService.findValueInMapListByKey(item,'Product')).indexOf(lowerCaseSearchTxt) != -1) ||
	        		(angular.lowercase(prospectPersonalUIService.findValueInMapListByKey(item,'DocumentStatus')) != undefined && angular.lowercase(prospectPersonalUIService.findValueInMapListByKey(item,'DocumentStatus')).indexOf(lowerCaseSearchTxt) != -1) ||
	                (angular.lowercase(prospectPersonalUIService.findValueInMapListByKey(item,'DocName')) != undefined && angular.lowercase(prospectPersonalUIService.findValueInMapListByKey(item,'DocName')).indexOf(lowerCaseSearchTxt) != -1)
            	){
            		rs.push(item);
            	}            	
            }else if (currentState == 'ClaimState') { 
            	if(
	        		(angular.lowercase(prospectPersonalUIService.findValueInMapListByKey(item,'ClaimNum')) != undefined && angular.lowercase(prospectPersonalUIService.findValueInMapListByKey(item,'ClaimNum')).indexOf(lowerCaseSearchTxt) != -1) ||                       
	                (angular.lowercase(prospectPersonalUIService.findValueInMapListByKey(item,'PolicyOwner')) != undefined && angular.lowercase(prospectPersonalUIService.findValueInMapListByKey(item,'PolicyOwner')).indexOf(lowerCaseSearchTxt) != -1)
            	){
            		rs.push(item);
            	}            	
            }else if (currentState == 'ClientState') {
            	if(
    	        		(angular.lowercase(prospectPersonalUIService.findValueInMapListByKey(item,'First_Name')) != undefined && angular.lowercase(prospectPersonalUIService.findValueInMapListByKey(item,'First_Name')).indexOf(lowerCaseSearchTxt) != -1) ||                       
	        			(angular.lowercase(prospectPersonalUIService.findValueInMapListByKey(item,'Surname')) != undefined && angular.lowercase(prospectPersonalUIService.findValueInMapListByKey(item,'Surname')).indexOf(lowerCaseSearchTxt) != -1) ||                       
	        			(angular.lowercase(prospectPersonalUIService.findValueInMapListByKey(item,'Client_ID')) != undefined && angular.lowercase(prospectPersonalUIService.findValueInMapListByKey(item,'Client_ID')).indexOf(lowerCaseSearchTxt) != -1)
                	){
                		rs.push(item);
                	} 
            }else if (currentState == 'factfind') {
            	if(
    	        		(angular.lowercase(prospectPersonalUIService.findValueInMapListByKey(item,'DocName')) != undefined && angular.lowercase(prospectPersonalUIService.findValueInMapListByKey(item,'DocName')).indexOf(lowerCaseSearchTxt) != -1)
                	){
                		rs.push(item);
                	} 
            }
        });
        return rs;
    };
}])
//this filter apply for card summary, depends on the format the filter will use apporiate function
.filter('summaryFormat', function() {
	var existingDateList = ["YYYY-MM-DD hh-mm-ss","YYYY-MM-DD-hh-mm-ss", "YYYY-MM-DD", "DD-MM-YYYY hh-mm-ss", "DD-MM-YYYY-hh-mm-ss", "DD-MM-YYYY"];
    return function(input, format) {
    	if (format==undefined || format!='datetime') {
			return input;
		}
    	else{
    		return moment(input,existingDateList).format('DD/MM/YYYY');
    	}
    };
    
})
.filter('translateMessage', ['commonService', 'commonUIService', '$translate', function(commonService, commonUIService, $translate) {
    return function(message) {
    	if (!commonService.hasValueNotEmpty(message)) {
			return "";
		}
    	var messageArr = message.split(";");
    	if(messageArr.length == 1) { 
    		return $translate.instant(messageArr[0]);
    	} else {
    		var mssg =  $translate.instant(messageArr[0]);
    		for(var i = 1; i < messageArr.length; i++) {
    			//check if parameter is valid date
    			if(moment(messageArr[i], 'YYYY-MM-DD', true).isValid()){
    				messageArr[i] = commonUIService.convertToDateTime(messageArr[i],'DD/MMYYYY');
    			}
    			mssg = mssg.replace("{" + (i - 1) + "}", messageArr[i]);
    		}
    		return mssg;
    	}
    };
}])
.filter('cardSummary', ['commonService', '$translate', '$filter', function(commonService, $translate, $filter) {
	function formatValue(uiEle, value) {
		var existingDateList = ["YYYY-MM-DD hh-mm-ss","YYYY-MM-DD-hh-mm-ss", "YYYY-MM-DD", "DD-MM-YYYY hh-mm-ss", "DD-MM-YYYY-hh-mm-ss", "DD-MM-YYYY"];
		if(commonService.hasValueNotEmpty(uiEle.valuePrefix)) {
			return $translate.instant(uiEle.valuePrefix + value);
		}
		if (uiEle.format != undefined && uiEle.format.search('datetime') == 0) {
			var datetimeFormat = 'MMM DD, YYYY';
			if(uiEle.format.indexOf(':') != -1)
				datetimeFormat = uiEle.format.slice(9);
			return moment(value, existingDateList).format(datetimeFormat);
		} else if (uiEle.format != undefined && uiEle.format.search('currency') == 0) {
			var numDec = 2 
			if(uiEle.format.indexOf(':') != -1)
				numDec = uiEle.format.charAt((uiEle.format.length)-1)
			return $filter('v3Currency')(value, numDec);
		} else {
    		return value;
    	}
	}
    return function(uiEle) {
    	if(uiEle != undefined) {
    		if(!commonService.hasValueNotEmpty(uiEle.refDetail)) return "";
	    	
	    	if(commonService.hasValueNotEmpty(uiEle.refDetail.Value)) {
	    		return formatValue(uiEle, uiEle.refDetail.Value);
	    	} else if(commonService.hasValueNotEmpty(uiEle.refDetail.$)) {
	    		return formatValue(uiEle, uiEle.refDetail.$);
	    	} else if(typeof(uiEle.refDetail) != "object") {
	    		return formatValue(uiEle, uiEle.refDetail);
	    	} else {
	    		return "";
			}
    	}
    };
}])
.filter('searchFilter', function() {
	return function(objects, moduleService, searchText, selectedColumns) {
		if (searchText == undefined || searchText == null || searchText.length < 1)
			return objects;

		var rs = [];
		var lowerCaseSearchText = angular.lowercase(searchText);
		angular.forEach(objects, function(item) {
			var itemMetaKey = [];
			for (var x in item) {
				itemMetaKey.push(x);
			}
			for (var i = 0; i < itemMetaKey.length; i++) {
				if (angular.lowercase(moduleService.findElementInElement_V3(item, [itemMetaKey[i]])).indexOf(lowerCaseSearchText) != -1) {
					rs.push(item);
					break;
				}
			}
			
		});
		return rs;
	};
})
.filter('advancedSearch', function() {
	return function(objects, moduleService, searchText, searchType, selectedColumns) {
		if (searchText == undefined || searchText == null || searchText.length < 1)
			return objects;

		var rs = [];
		var lowerCaseSearchText = angular.lowercase(searchText);
		angular.forEach(objects, function(item) {
			if (angular.lowercase(moduleService.findElementInElement_V3(item, [searchType])).indexOf(lowerCaseSearchText) != -1) {
				rs.push(item);
			}
		});
		return rs;
	};
})

.filter('formatTitleImage', function() {
	return function(list) {
		var newValue="N/A";
		var value = "";
		
		if(angular.isArray(list)){
			value = list.join(" ");
		}else{
			value = list;
		}
							
    	if(value != "" && value != " " && value != undefined){
    		var oldValue = value.replace(/[^\w\s]/gi,'').trim().split(' ');
    		if(oldValue.length > 1)
    			newValue = oldValue[0][0] + oldValue[oldValue.length-1][0];
    		else
    			newValue = oldValue[0][0];
    	}    		
        return newValue;
	};
})

.filter('removePageNameWithRole', ['$translate', function($translate) {
    return function(pageName) {
    	var result = '';
    	if (pageName.indexOf('(') == -1) {
			result = $translate.instant('v3.pageName.label.'+pageName);
			
		} else {
			result = $translate.instant('v3.pageName.label.'+pageName.substr(0, pageName.indexOf('(')-1));
    	}
    	return result;
    };
}])

.filter('translateUWRule', ['$translate', '$filter', function($translate, $filter) {
    return function(rule, translateSuffix) {
    	var uwRule = '';
    	if (rule) {
	    	var errors = rule.split(':');
	    	var suffix = "new.v3.mynewworkspace.life.underwriting.rule.";
	    	if (translateSuffix){
	    		suffix = translateSuffix;
	    	}
	    	uwRule = $translate.instant(suffix + errors[0]);
	    	if (errors.length < 3) {
	    		if (errors[0] == 'SMOK') {
	    			uwRule = uwRule + errors[1] + $translate.instant('new.v3.mynewworkspace.life.underwriting.rule.SticksOfCigarrette');
	    		} else if (errors[0] == 'DOBC') {
	    			uwRule = uwRule + $filter('datetimeFilter')(errors[1], 'DD/MM/YYYY');
	    		} else if (errors[1]){
	    			uwRule = uwRule + errors[1];
	    		}
	    	} else {
	    		for (var i = 1; i < errors.length - 1; i++) {
	    			if (errors[i]){
	    				uwRule = uwRule + errors[i] + ', ';
	    			}
	    		}
	    		uwRule = uwRule.substr(0, uwRule.lastIndexOf(', '));
	    	}
    	}
    	return uwRule;
    };
    
   /* return function(rule, translateSurfix) {
    	var uwRule = '';
    	if (rule) {
	    	var errors = rule.split(':');
	    	uwRule = $translate.instant('new.v3.mynewworkspace.life.underwriting.rule.' + errors[0]);
	    	if (errors.length < 3) {
	    		if (errors[0] == 'SMOK') {
	    			uwRule = uwRule + errors[1] + $translate.instant('new.v3.mynewworkspace.life.underwriting.rule.SticksOfCigarrette');
	    		} else if (errors[0] == 'DOBC') {
	    			uwRule = uwRule + $filter('datetimeFilter')(errors[1], 'DD/MM/YYYY');
	    		} else {
	    			uwRule = uwRule + errors[1];
	    		}
	    	} else {
	    		for (var i = 1; i < errors.length - 1; i++) {
	    			uwRule = uwRule + errors[i] + ', ';
	    		}
	    		uwRule = uwRule.substr(0, uwRule.lastIndexOf(', '));
	    	}
    	}
    	return uwRule;
    };*/
}])

.filter('parseStringToNum', function() {
    return function(input) {
    	if(input == undefined || input == '')
    		return parseInt("0");
    	else
    		return parseInt(input);
    }
})
.filter('removeClientJoinFromChildren', function() {
	return function(childrenList,clientUid,jointUid) {
		if (childrenList == undefined || childrenList.length < 1){
			return childrenList;
		}
		var filteredchildrenList = [];
		angular.forEach(childrenList, function(item){
			if(item.DocId !== clientUid && item.DocId !== jointUid)
				filteredchildrenList.push(item);
		});
		return filteredchildrenList;
	};
})
.filter('removeProspectFromList', function() {
	return function(prospectList,clientUid,jointUid,childrenUids) {
		if (prospectList == undefined || prospectList.length < 1){
			return prospectList;
		}
		var filteredProspectList = [];
		if (childrenUids.length > 0){
			angular.forEach(prospectList, function(item){
				var differChildrenFlag = true;
				angular.forEach(childrenUids, function(childItem){
					if(item.DocId === childItem['@refUid']){
						differChildrenFlag = false;
					}
				});
				if((item.DocId !== clientUid && item.DocId !== jointUid && differChildrenFlag === true)){
					filteredProspectList.push(item);
				}
			});
		}
		else{
			angular.forEach(prospectList, function(item){
				if(item.DocId !== clientUid && item.DocId !== jointUid){
					filteredProspectList.push(item);
				}
			});
		}
		return filteredProspectList;
	};
})
.filter('contactFilter', ['commonService', function(commonService) {
	return function(contactList, searchType, searchText) {
		if (searchType == "All" && !commonService.hasValueNotEmpty(searchText)) {
			return contactList;
		}

		var rs = [];
		var lowerCaseSearchText = angular.lowercase(searchText);
		angular.forEach(contactList, function(item) {
			if ((commonService.hasValueNotEmpty(item.FullName) && angular.lowercase(item.FullName).indexOf(lowerCaseSearchText) != -1)
				|| (commonService.hasValueNotEmpty(item.CorporateName) && angular.lowercase(item.CorporateName).indexOf(lowerCaseSearchText) != -1)) {
				if (searchType == "All") {
					rs.push(item);
				} else {
					if (item.SourceName == searchType) {
						rs.push(item);
					}
				}
			}
		});
		return rs;
	}
}])
.filter('contactTelephone', ['commonService', function(commonService) {
	return function(contact) {
		if (contact.DocType == commonService.CONSTANTS.MODULE_NAME.PROSPECT) {
			if (commonService.hasValueNotEmpty(contact.MobilePhone)) {
				return contact.MobilePhone;
			}
			if (commonService.hasValueNotEmpty(contact.HomePhone)) {
				return contact.HomePhone;
			}
			if (commonService.hasValueNotEmpty(contact.OfficePhone)) {
				return contact.OfficePhone;
			}
		}
		if (contact.DocType == commonService.CONSTANTS.MODULE_NAME.CORPORATE) {
			if (commonService.hasValueNotEmpty(contact.MainLineTelephone)) {
				return contact.MainLineTelephone;
			}
			if (commonService.hasValueNotEmpty(contact.PersonInChargeTelephone)) {
				return contact.PersonInChargeTelephone;
			}
		}
		return "";
	}
}])

.filter('v3Currency', ['commonService', '$translate', '$filter', function(commonService, $translate, $filter) {	
	return function(data, decimal) {
		if(data == undefined || data == '')
			return 0;
		if(decimal == undefined || decimal == '')
			decimal = 0;
    	if(angular.isString(data)){
    		var value = data.replace(/,/gi,'')
    		return $filter('currency')(value, "", decimal);
    	}
    	else
    		return $filter('currency')(data, "", decimal);
    }
}])
.filter('formatNumberPreviewPdf', [function() {
	return function(data, attrs) {
         var addCommas = function addCommas(nStr, attrs){
                nStr += '';
                nStr = nStr.replace( /[^0-9\.]/gi, '' );
                var x = nStr.split( attrs['aDec']);
                var x1 = x[0];
                var x2 = x.length > 1 ?  attrs['aDec'] + x[1] : genNumberZero(attrs[ 'decimal' ],attrs['aDec']);
                var rgx = /(\d+)(\d{3})/;
                while (rgx.test(x1)) {
                    x1 = x1.replace(rgx, '$1' + attrs['aSep'] + '$2');
                }
                return x1 + x2;
            };

              // generate number Zero to fix  decimal
            var genNumberZero = function(n, prefix){
                     var res =n > 0? prefix : "";
                     var i = 0;
                     while(i++ < n){
                         res += "0";
                     }
                     return res;
            };
        if(data == undefined || data == "")
            return "";
        else
            return addCommas(data, attrs);
    }
}])
;//End



