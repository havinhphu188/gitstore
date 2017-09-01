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
var coreModule = angular.module('coreModule',['commonModule','translateUIModule','HttpInterceptorModule', 'connectionModule'])
.service('detailCoreService', ['$q', 'ajax', '$location', 'appService', 'cacheService', 'commonService', '$window', '$translate', '$filter', '$log', 'connectService',
    function($q, ajax, $location, appService, cacheService, commonService, $window, $translate, $filter, $log, connectService){

	/*##################################################################
	 * Error Function
	###################################################################*/
	/**
	 * It's difficult to extends the native Error object of JavaScript because of cross-browser.
	 * So we use another approach to throw Error.
	 * Using example:
		try{
			var childError = new IposError("Child Error");
			childError.param("param01","Value of param01");
			childError.param("param02","Value of param02");
			childError.throwError();
		}catch(childError){
			var err = new IposError("Parent Error", childError);
			err.throwError();
		}
	 */
	function IposError(message, previousError){
		var self = this;
		self.message = message;
		self.previousError = previousError;
		self.params = {};
	};
	IposError.prototype.param = function(key, value){
		var self = this;
		self.params[key] = value;
	};
	IposError.prototype.buildError = function(){
		var self = this;
		var err = new Error(self.message);
		var iline01 = err.stack.indexOf('\n')+1;
		var iline02 = err.stack.indexOf('\n',iline01+1);
		var iline03 = err.stack.indexOf('\n',iline02+1);	
		//			var line01 = err.stack.substring(0, iline01);//message
		//			var line02 = err.stack.substring(iline01+1, iline02);//throwError()
		var line03 = err.stack.substring(iline02+1, iline03);//the method which actually throw error
		var paramMsgs = "";
		for (var pKey in self.params) {
			if (self.params.hasOwnProperty(pKey)) {
				var pValue = self.params[pKey];
				paramMsgs += "\n  " + pKey+": "+ pValue;
			}
		}
		var stackMsg = '';
		if (self.previousError){
			stackMsg += self.previousError.stack;
		}

		stackMsg += line03 + "\n" + self.message + paramMsgs;
		var remain;//remain messages in stack will be shown
		remain = err.stack.substring(iline02+1);
		//				var iline03 = err.stack.indexOf('\n',iline02+1);
		//				remain = err.stack.substring(iline01+1, iline03);//line02 -> line 03: the method which actually throw error
		//			}else{
		//				
		//			}
		stackMsg += "\n" + remain;
		err.stack = stackMsg;
		return err;
	};
	/**
	 * throws a native Error object
	 */
	IposError.prototype.throwError = function(){
		var self = this;
		var err = self.buildError();
		throw err;
	};
	IposError.prototype.warnError = function(){
		var self = this;
		var err = self.buildError();
		var msg = "WARN: " + err.stack;
		if (!console) console = {log:function(){}}; //No error in IE
		$log.warn(msg);
	};

	/*##################################################################
	 * IposDocService Function
	###################################################################*/

	/**
	 * This file is only a part of service-model.js
	 * Therefore, we have to import service-model.js before using this file.
	 */

	function IposDocService(){
	}
	//HANDLE DETAIL DATA IPOS-DOCUMENT //////////////////////////////////////////////////////////////////////
	/**
	 * @param elementsChain is an array of of elements' names
	 * Example: ['prospect','fullname','firstname']
	 * @returns
	 */
	IposDocService.prototype.findElementInDetail = function(elementsChain){
		var self = this;
		if (self.detail === undefined) return undefined;

		var ele = self.detail;
		for ( var i = 0; i < elementsChain.length; i++) {
			var eleName = elementsChain[i];
			var eleFound = self._findElement(ele,eleName);
			if (!commonService.hasValue(eleFound)){
				var errChainNames = "model";
				for ( var j = 0; j <= i; j++) {
					errChainNames += ("." + elementsChain[j]);
				}
				// information for debug only
				var err = new IposError("Cannot continue finding element because '"
						+ errChainNames + "' is null or undefined");
				err.param("elementsChain", elementsChain);
				err.param("model", self.detail);
				if (commonService.hasValue(self.detail)) {
					err.param("modelUid", self.detail.uid);
					err.param("modelDocType", self.detail.docType);
				}
				err.throwError();
			}//else: continue
			ele = eleFound;
		}	
		return ele;
	};

	/**
	 * 
	 * @param itemsChain is string as IposDocument.person.fullname
	 */
	IposDocService.prototype.lookup = function(data, itemsChain) {
		var parts = itemsChain.split('.');
	
		var prev;
		for(var i = 0; i < parts.length; i++){
		    var index;
		    if(parts[i].indexOf('[') != -1){
		    	key = parts[i].substr(0, parts[i].indexOf('['));
		        index = parseInt(parts[i].substr(parts[i].indexOf('[') + 1, 1), 10);
		        if(!prev){
		        	prev = data[key][index];
		        } else {
		        	prev = prev[key][index];
		        }
		    } else { 
			    if(!prev){
			        prev = data[parts[i]];
			    } else {
			        prev = prev[parts[i]];
			    }
			    
			    if(i === parts.length - 1){
			        return (prev);
			    }
		    }
		}
		return undefined;
	};
	
	IposDocService.prototype.findElement_V3 = function(eleName, element){
		var eleNameArray = eleName.split(":");
		for(var prop in element) {
			var originalProp = prop;
        	if(prop != undefined){ 
        		if(eleNameArray.length < 2){
        			var propArray = prop.split(":");
        			if(propArray.length > 1){
        				var keyProp = propArray[1];
        				prop = keyProp;
        			}
        		}
        	}
            if(prop === eleName) {
            	eleName = originalProp;
                return element[eleName];
            }
            prop = originalProp;
            if(angular.isObject(element[prop])) {
                var rs = this.findElement_V3(eleName, element[prop]);
                if (rs !== undefined)
                    return rs;
            }
        }
        return undefined;
    };       
	
    IposDocService.prototype.findElementInElement_V3 = function(element, elementsChain, options){
        if (element === undefined) return undefined;

        var errorOn = true;
        if (elementsChain[0] === 'MetadataDocument') errorOn = false;
        
        options = options || { 
        	'returnLastFound': true, //default want to return last found
        	'errorOn': errorOn //default error will show
        };

        var ele = element;
        for( var i = 0; i < elementsChain.length; i++) {
            var eleName = elementsChain[i];
            var newEle = this.findElement_V3(eleName, ele);
            if (newEle !== undefined){
                ele = newEle;
            }
            else{
            	if(!options.getlastFound)
            		ele = undefined;
            }
        }
        //if can't find any result for the first time
        if(ele === undefined && options.errorOn){	        	
//        	$log.debug("Error: Can't find element in object (see below) by elementsChain: ["+ elementsChain + "]");
        	$log.error("Error: Can't find element in object by elementsChain: ["+ elementsChain + "]");
        	$log.debug(element);           
        }
        
        return ele;
    };
	
    IposDocService.prototype.findElementInDetail_V3 = function(elementsChain, options){
   //  	var self = this;
   //      if (self.detail === undefined) return undefined;
   //      var ele = self.detail;
   //      for( var i = 0; i < elementsChain.length; i++) {
   //          var eleName = elementsChain[i];
   //          var newEle = this.findElement_V3(eleName, ele);
   //          if(newEle !== undefined){
   //              ele = newEle;
   //          }
   //      }
   //      //case can't find any result
   //      if(ele === self.detail){	
   //      	return undefined;
   //      	throw"Error: Can't find element in object (see below) by elementsChain: ["+ elementsChain + "]";
			// throw self.detail;
   //      }else
   //          return ele;
        if (this.detail === undefined) return undefined;
        return this.findElementInElement_V3(this.detail, elementsChain, options);
    };
    
    IposDocService.prototype.findElementInDetail_V3_UICard = function(elementsChain){
    	var self = this;
    	if (self.detail === undefined || elementsChain === undefined) return undefined;   
    	  	
    	var result = self.findElementInDetail_V3(elementsChain);
    	
    	if(result != undefined) {
    		if(typeof(result) == 'object') {
	    		if(result.$ != "" && result.$ != undefined)
	        		return result.$;
	        	else if(result.Value != "" && result.Value != undefined)
	        		return result.Value;
    		} 
    		else return result; // For value in Header
    	} 
    	else return undefined;
    };
    
    //copy all information from object A to object B (2 object must have same structure)
    IposDocService.prototype.copyInforFromSameStructureObj = function copyInforFromSameStructureObj (object, objectDetailTo, objFromPath, objToPath, objFrom, objTo) {
		if(!object){//if object is undefined, this function will copy 2 objects in objectDetailTo
			var object = objectDetailTo;
		}
    	
    	if(objFromPath && objToPath){
			var objectEleFrom = this.findElementInElement_V3(object, objFromPath);
			var objectEleTo = this.findElementInElement_V3(objectDetailTo, objToPath);
			
		}else{//continue to loop in to obejct to copy infor
			var objectEleFrom = objFrom;
			var objectEleTo = objTo;
		}
		

		for (var prop in objectEleFrom) {
			
			if(Array.isArray(objectEleFrom)){
				var objF =  objectEleFrom[parseInt(prop)];
			}
			else{
				//remove all prefix
				var lastItem = prop.split(":");
				if(lastItem.length > 1){
					prop = lastItem.pop();
				}
				var objF =  this.findElementInElement_V3(objectEleFrom, [prop]);
			}
			
			if(typeof objF == "object"){
				
				
				if(Array.isArray(objectEleFrom)){
					var objT =  objectEleTo[parseInt(prop)];
				}
				else{
					var objT  = this.findElementInElement_V3(objectEleTo, [prop]);
				}
				
				if(this.isLeafNode(objF))
				{
					if(objT){
						var value =  this.findElementInElement_V3(objectEleFrom, [prop]).Value;
						var string =  this.findElementInElement_V3(objectEleFrom, [prop]).$;
						if (commonService.hasValueNotEmpty(value) || commonService.hasValueNotEmpty(string)) {
							if (commonService.hasValueNotEmpty(value)) {
								objT.Value = value;
								
							} else {
								objT.$ = string;
							}
						};
					}
					
				}else{
					if(typeof objF == "object"){
						this.copyInforFromSameStructureObj(undefined, undefined, undefined, undefined, objF, objT);
					}
				}
			}
		};
	}
    
    //clear all data in element and remove all array
    IposDocService.prototype.clearElementData_v3 = function clearElementData_v3(obj, ele) {
        if(ele){
            var objEle = this.findElementInElement_V3(obj, ele);
            this.clearDataInJson(objEle);
        }else{
            var objEle = obj;
        }
        
        if(objEle){
        	 if(objEle.hasOwnProperty("@counter"))
    	     {
    	     	this.resetElementWithCounter(objEle);
    	     }
        	 
        	 for (var prop in objEle) {
                 var obj =  this.findElementInElement_V3(objEle, [prop]);
                 if(typeof obj == "object"){
                     if(obj.hasOwnProperty("@counter"))
                     {
                     	this.resetElementWithCounter(obj);
                     }

                     if(!this.isLeafNode(obj)){
                     	//continue to loop in to object 
                     	this.clearElementData_v3(obj)
                     }
                 }
             };
        }
    }

    //reset element with counter, remove all element in array
    IposDocService.prototype.resetElementWithCounter = function resetElementWithCounter(obj) {
        for (var prop in obj) {
            if(prop == "@counter"){
            	obj["@counter"] = "0";
            }
            var objEle = this.findElementInElement_V3(obj, [prop]);
            if(typeof obj == "object"){
            	if(Array.isArray(objEle)){
                	  //remove all element of the array
                       var emptyTemplate = angular.copy(objEle[0]);
                       objEle.length =0;
                       objEle.push(emptyTemplate);
                    }
            }
        };
    }
    
    /**
     * Check whether an obj is leaf node or not
     * @param  {Object}  obj obj need to check
     * @return {Boolean}     true if leaf-node, otherwise false
     */
    IposDocService.prototype.isLeafNode =  function isLeafNode(obj) {
					
		if(obj['section'])
    		return false;

    	
		if('type' in obj){//for now, only 'type' exist in obj
			return true;
		}

    	if(
    		obj['preview'] ||
    		obj.Options ||
    		Object.keys(obj).length === 0
    		)
    		return true;	    		    	

    	for(var prop in obj){
    		//section or leaf node might have '@key' attribute
    		if(prop === 'key' || prop === 'permission')
    			continue;
    		
	    	if(angular.isObject(obj[prop])){	    		
	    		return false;
	    	}
	    }
	    return true;
	};
    
	IposDocService.prototype.findJsonPathInItem = function(data, jsonxpath){
		var document = jsonPath(data, jsonxpath);
		if(document !== undefined)
			return document[0];
		return undefined;
	};
	
	/**
	 * This function is used for specific the map list json returned from runtime V3
	 */
	IposDocService.prototype.findValueInMapListByKey = function(data, key) {
        if (data != undefined) {

            //new structure
            if(data["ipos-container:map-list"] == undefined)
                return data[key];

           var items = this.findJsonPathInItem(data, '$..ipos-container:pair');    
            
            for (var i in items) {
                if (items[i]['@key'] == key) {
                    return items[i]['@value'];
                }
            }
        }
        
        return undefined;
    };

	IposDocService.prototype.findValueListInMapListByKey = function(data){
        var items = this.findJsonPathInItem(data, '$..ipos-container:pair');
        if(items == undefined)
        	items = this.findJsonPathInItem(data, '$..MetadataDocument');

        return items; 
	};
	

	/**
	 * This function is used for specific the map list json returned from runtime V3
	 */

	IposDocService.prototype.valueInMapListToArray = function(value) {
		if(commonService.hasValue(value)){
            var arrCodes = value.substr(1, value.length - 2)//remove '[' & ']' from value
                    .split(', ');//generate array of string

            if(value.charAt(1) === '['){//{ [[RAIL,RL06], [RAIL,RL07], [RAIL,RL08],...,[TEAL,TEA1]] }
                return arrCodes.map(
                    function(code) {
                        var code = code.substr(1, code.length - 2).split(',');
                        var tmpObj = {};
                        tmpObj.group = code[0];
                        tmpObj.value = code[1];     
                        return tmpObj.value;
                    }
                );
            }
            else{
                return arrCodes;
            }
        }
    };
    /*IposDocService.prototype.contactLazyList =function(data) {
    	var self = this;
    	var lazyChoiceList = self.name == commonService.CONSTANTS.MODULE_NAME.PROSPECT ? self.lazyChoicelist : self.lazyChoiceList;
    	var contactType = self.productName != undefined && (self.productName.indexOf(commonService.CONSTANTS.PRODUCT_GROUP.FIRE) != -1 || self.productName.indexOf(commonService.CONSTANTS.PRODUCT_GROUP.PERSONAL_ACCIDENT) != -1) ? 'POContactType' : 'ContactType';
		var lazyContact = this.findElementInElement_V3(lazyChoiceList,[contactType]).Option;	
		var maxOccurs = self.productName != undefined && self.productName.indexOf(commonService.CONSTANTS.PRODUCT_GROUP.PERSONAL_ACCIDENT) != -1 ? this.findElementInElement_V3(data,['PolicyOwnerInformation', 'Contacts'])['@maxOccurs'] : this.findElementInElement_V3(data,['Contacts'])['@maxOccurs'];	
		if (maxOccurs == "4") {
			var personalContactType = lazyContact.slice(0,4);
			this.findElementInElement_V3(lazyChoiceList,[contactType]).Option = personalContactType;
			//self.lazyContactList = angular.copy(lazyContact.slice(0,4));
		}else{
			//self.lazyContactList = angular.copy(lazyContact);
		};
	};*/
    

    /**	    	
	 * remove the prefixs (Eg: 'person:Gender' --> 'Gender')
     * @param  {String} originalStr original string
     * @return {String}      		the removed prefix
     */
    IposDocService.prototype.removePrefixOfName = function removePrefixOfName(originalStr) {
		var names = originalStr.split(':');
		return names.length > 1 ? names[1] : names[0];
    }


    /**
     * True if document (iPOS v3) can be edited
     * @param  {[type]}  uiStructureRoot the root of uiStructure
     * @return {Boolean}                 true if can, otherwise false
     */
    // IposDocService.prototype.isDocumentEditable = function isDocumentEditable () {    	
    // 	var isEditable = true;
    // 	if(this.refDetail){
    // 		var docStatus = this.findElementInElement_V3(uiStructureRoot.refDetail, ['DocStatus']);

    // 		switch(docStatus.BusinessStatus){
    // 			case commonService.CONSTANTS.STATUS.DRAFT:
    // 			case commonService.CONSTANTS.STATUS.NEW:
    // 				isEditable = true;
    // 				break;
    // 			default:
    // 				isEditable = false;
    // 		}
    // 	}

    // 	return isEditable;
    // }



    /**
     * @author tphan37
     * 30-Nov-2015
     * Internal function to find the full name of a key (with prefix)
     * @param  {Object} ele Object which have attribute with 'key' (short or full)
     * @param  {String} key with or without prefix
     * @return {String}     key of attribute in 'ele'
     */
    IposDocService.prototype._findFullKeyWithPrefix = function _findFullKeyWithPrefix (ele, key) {
    	var result = key;
		//if the ele[key] is undefined, means key has been removed the prefix
		if(!ele[key]){
	    	//find the full prefix
			for (var k in ele) {
				if(k.indexOf(key) !== -1){
					result = k;
				}
			};
		}
		return result;
    };

    /**
     * TODO: it's likely a duplicate of @addElementInElement_V3(). Try to merge 2 functions
     * NOTE: after adding successful, the child element will become array
     * 
     * add new child 'childEle' to its parent 'parentEle'
     * 
     * @param {Object} parentEle 		object parent
     * @param {String} childEleName  	name of the object need to add
     * @return {Object} Return the added element
     */
    IposDocService.prototype.addChildEleToParentEle = function(parentEle, childEleName){
    	var result;
    	var maxOccurs = parentEle['@maxOccurs'];
    	if (maxOccurs == undefined) maxOccurs = 999;

    	var counterVal = parentEle['@counter'];
    	// if(counterVal != ""){
    	if(commonService.hasValueNotEmpty(counterVal)){
    		var counter = parseInt(counterVal);
    	}else{
    		var counter = 0;
    	}
		var eles = parentEle[childEleName];

		//if 'eles' is empty, find again using full name with prefix
		if(!eles){
			//find the full prefix
			for (var key in parentEle) {
				if(key.indexOf(childEleName) !== -1){
					childEleName = key;
					eles = parentEle[childEleName];
					break;
				}
			};
		}


		//if counter is smaller than maxOccurs or maxOccurs is empty (can add infinitity element)
		if (eles && ((counter < maxOccurs) || maxOccurs == "")){
			if(counter > 0){
				var tmpl = angular.isArray(eles) ? eles[0] : eles;
				var cloneElement = angular.copy(tmpl);
				this.clearDataInJson(cloneElement);

				//convert to array for pushing new data
				if(!angular.isArray(eles)){
					parentEle[childEleName] = this.convertToArray(eles);
					eles = parentEle[childEleName];
				}

				eles.push(cloneElement);
			}else if(counter == 0){
				parentEle[childEleName] = this.convertToArray(eles);
			}
			parentEle['@counter'] = counter + 1;

			//set result equal with the newest element
			result = parentEle[childEleName][counter];
		}
		return result;
    };

    /**
     * Feb-16-2017
     * @author  tphan37
     * Remove all the children in parent element
     * @param {Object} parentEle 		object parent
     * @param {String} childEleName  	name of the element need to remove
     */
    IposDocService.prototype.removeAllChildrenInParentEle = function(parentEle, childEleName){    	
		var eles = parentEle[childEleName];             
    	eles.splice(1, eles.length - 1);
        this.clearDataInJson(eles[0]);          
    	parentEle['@counter'] = 0;
    };
    
    IposDocService.prototype.removeChildEleParentEle = function(parentEle, childEleName, index){
    	var minOccurs = parentEle['@minOccurs'];
    	if(!minOccurs){
    		parentEle['@minOccurs'] = 0;
    		minOccurs = parentEle['@minOccurs'];
    	}

    	var counterVal = parentEle['@counter'];
    	if(counterVal != ""){
    		var counter = parseInt(counterVal);
    	}else{
    		var counter = 0;
    	}
		var eles = parentEle[childEleName];
		var eles = parentEle[childEleName];
		if(!eles){
			//find the full prefix
			for (var key in parentEle) {
				if(key.indexOf(childEleName) !== -1){
					childEleName = key;
					eles = parentEle[childEleName];
					break;
				}
			};
		}
		//only remove if the instances is above 'minOccurs' properties
        if(minOccurs < counter){
            //if minOccur is 0, we have to keep an template element
            if(minOccurs == 0 && counter == 1){ 
                this.clearDataInJson(eles[0]);                      
                parentEle['@counter'] = 0;   
            }else{                        
            	eles.splice(index, 1);
            	parentEle['@counter'] = counter - 1;   
            }
        }
    };

    /**
     * add new child 'element' to its parent 'elements'
     * @param {Object} data     object in iPosDocument v3 store element need to add and its parent (elements)
     * @param {String} elements name of the object parent
     * @param {String} element  name of the object need to add
     */
    IposDocService.prototype.addElementInElement_V3 = function(data, elements, element){
    	var parentEle = this.findElementInElement_V3(data, elements);
    	// var maxOccurs = this.findElementInElement_V3(data,elements)['@maxOccurs'];
    	var maxOccurs = parentEle['@maxOccurs'];
    	if (maxOccurs == undefined) maxOccurs = 999;

    	// if(this.findElementInElement_V3(data, elements)['@counter']!=""){
    	// 	var counter = parseInt(this.findElementInElement_V3(data, elements)['@counter']);
    	var counterVal = parentEle['@counter'];
    	if(counterVal != ""){
    		var counter = parseInt(counterVal);
    	}else{
    		var counter = 0;
    	};				
		var eles = this.findElementInElement_V3(data, element);
		if ((eles.length < maxOccurs) || maxOccurs == ""){
			if(counter > 0){
				// var cloneElement = angular.copy(this.findElementInElement_V3(data,element)[0]);
				var cloneElement = angular.copy(eles[0]);
				this.clearDataInJson(cloneElement);
				// eles.push(angular.copy(cloneElement));
				// this.findElementInElement_V3(data,elements)['@counter']=counter + 1;
				eles.push(cloneElement);
				parentEle['@counter'] = counter + 1;
			}else if(counter == 0){
				// this.findElementInElement_V3(data,elements)['@counter']= 1;
				this.clearDataInJson(eles[0]);
				parentEle['@counter'] = 1;
			}
		}
    };
    
    IposDocService.prototype.removeElementInElement_V3 = function(index,data,elements,element){			
		var eles = this.findElementInElement_V3(data, element);
		if(this.findElementInElement_V3(data, elements)['@counter']!=""){
    		var counter = parseInt(this.findElementInElement_V3(data, elements)['@counter']);
    	}else{
    		var counter = 0;
    	};	
		if (eles.length > 1){
			eles.splice(index, 1);
			this.findElementInElement_V3(data,elements)['@counter']
			=counter - 1;
		}	
	};
    
    
	IposDocService.prototype.addElement_V3 = function(data,elements,element){
    	var maxOccurs = this.findJsonPathInItem(data, elements+'.@maxOccurs');
    	if (maxOccurs == undefined) maxOccurs = 999;
    	var counter = this.findJsonPathInItem(data, elements+'.@counter') 
    	if( counter !=""){
    		counter = parseInt(counter);
    	}else{
    		counter = 0;
    	};
							
		var eles = this.findJsonPathInItem(data, element);
		if ((eles.length < maxOccurs) || maxOccurs ==""){
			if(counter>0){
				var cloneElement = angular.copy(this.findJsonPathInItem(data, element+'[0]'));
				this.clearDataInJson(cloneElement);
				eles.push(angular.copy(cloneElement));
				this.findJsonPathInItem(data, elements)['@counter']
				=counter + 1;
			}else if(counter==0){
				this.findJsonPathInItem(data, elements)['@counter']
				=counter + 1;
			}
			
		}
    };
    IposDocService.prototype.removeElement_V3 = function(index,data,elements,element){			
		var eles = this.findJsonPathInItem(data, element);
		var counter = parseInt(this.findJsonPathInItem(data, elements+'.@counter'));
		if (eles.length > 0 && counter >0){
			if(counter>1){
				eles.splice(index, 1);
				this.findJsonPathInItem(data, elements)['@counter']
				=counter - 1;
			}else if(counter>0){
				this.findJsonPathInItem(data, elements)['@counter']
				=counter - 1;
				this.clearDataInJson(eles[0]);
			}
			
		}
		
	};
	
    IposDocService.prototype.cloneObject = function(data,parent,child){
    	var cloneItem = angular.copy(this.findJsonPathInItem(data, "$.."+ child));
		if (!$.isArray(this.findJsonPathInItem(data, "$.." + child))){
			if (cloneItem==undefined){
				cloneItem = angular.copy(this.findJsonPathInItem(data, "$.." + child[0]));
			}
			if (cloneItem!=undefined){
			var items = [];
				items.push(angular.copy(cloneItem));
				this.findJsonPathInItem(data, parent)[child]=items;
				/*this.findJsonPathInItem(data, parent)['@counter']
				= 1;*/
			}
		}
    };

     /**
     * compare 2 data with the same json format
     * @param {json} src: object to compare with des
     * @param {json} des: object to compare with src
     * return {boolean} true: if src and des are the same/ false: if src and des are not the same
     */
    IposDocService.prototype.compareData = function(src, des) {
        var prop;
        if(!src && des || src && !des){
            return false;
        }
        if(!src && !des){
            return true;
        }

        for(prop in src){
            if (typeof src[prop] != "object"){
                if(src[prop] != des[prop]){
                    return false;
                }
            }
            if (typeof src[prop] == "object"){
                if(!this.compareData(src[prop], des[prop]))
                    return false;

            }
        }
        return true;
    }; 
    
    
	/**
	 * This function is used for specific the map list json returned from runtime V3
	 */
	IposDocService.prototype.valueInMapListToGroupArray = function(data) {
		return data.substr(1, data.length - 2).split(',');
    };
    
	IposDocService.prototype.getElementsInElementInDetail = function(elementsChain){
		var self = this;
		if (self.detail === undefined) return undefined;

		var ele = self.detail;
		for ( var i = 0; i < elementsChain.length; i++) {
			var eleName = elementsChain[i];
			var eleFound = self._findElement(ele,eleName);
			if (!commonService.hasValue(eleFound)){
				return [];
			}//else: continue
			ele = eleFound;
		}	
		return ele.elements;
	};

	IposDocService.prototype.hasElementInDetail = function(elementsChain) {
		var self = this;
		if (self.detail === undefined) return false;

		var ele = self.detail;
		for (var i = 0; i < elementsChain.length; i++) {
			if(elementsChain[i]){
				var eleFound = self._findElement(ele, elementsChain[i]);
				return commonService.hasValue(eleFound);
			}
		}		
	};

	IposDocService.prototype.findDirectPropertyInDetail = function(propertyName){
		var self = this;
		if (self.detail === undefined) return undefined;

		var prop = self._findProperty(self.detail, propertyName);
		if (prop === undefined){
			var err = new IposError("Not found property");
			err.param("propertyName", propertyName);
			err.throwError();
		}
		return prop;
	};
	/**
	 * Note: 
	 * If not found property, return undefined.
	 * But if not found an element in elementsChain, throw Error
	 * @param elementsChain
	 * @param propertyName
	 * @returns
	 */
	IposDocService.prototype.findPropertyInDetail = function(elementsChain, propertyName){
		var self = this;
		if (self.detail === undefined) return undefined;

		var ele = undefined;
		var prop = undefined;
		try{
			ele = self.findElementInDetail(elementsChain);
		}catch(error){
			var err = new IposError("Some error are thrown from inside methods", error);
			err.param("elementsChain", elementsChain);
			err.param("propertyName", propertyName);
			err.throwError();
		};
		if (ele === undefined){
			var err = new IposError("Cannot find element");
			err.param("elementsChain", elementsChain);
			err.param("propertyName", propertyName);
			err.throwError();
		}

		try{	
			prop = self._findProperty(ele, propertyName);
		}catch(error){
			var err = new IposError("Some error are thrown from inside methods", error);
			err.param("elementsChain", elementsChain);
			err.param("propertyName", propertyName);
			err.throwError();
		};
		//	if (prop === undefined){
		//		var err = new IposError("Cannot find property");
		//		err.param("elementsChain", elementsChain);
		//		err.param("found element", ele);
		//		err.param("propertyName", propertyName);
		//		err.throwError();
		//	}

		return prop;
	};

	/**
	 * @return the list of enums
	 */
	IposDocService.prototype.findEnumsInDetail = function(elementsChain){
		var self = this;
		if (self.detail === undefined) return undefined;

		var ele = self.findElementInDetail(elementsChain);
		if (ele === undefined){
			throw "ERROR: findEnumsInDetail("+elementsChain+"): not found";
		}
		return ele.restriction.enumerations;
	};
	/**
	 * @return 
	 * 1. find the property value of element
	 * 2. return the label of enum which is corresponding to element's value.
	 * 
	 * Example:
	 * <code>
	 * 	<element name="type" value="O">
	 * 		<enum value="H" label="HOME"/>
	 * 		<enum value="O" label="OFFICE"/>
	 * 	</element>
	 * </code>
	 * findValueEnumInDetail('type') will return <enum value="O" label="OFFICE">, not only 'O'
	 */
	IposDocService.prototype.findValueEnumInDetail = function(elementsChain){
		var self = this;
		if (self.detail === undefined) return undefined;

		var rs = self.findValueEnumInElement(self.detail, elementsChain);
		if (rs === undefined){
			var err = new IposError("Result is undefined");
			err.param("elementsChain", elementsChain);
			err.throwError();
		}
		return rs;
	};
	IposDocService.prototype.getPropertyValueNonStrictInDetail = function(propertyName){
		var self = this;
		if (self.detail === undefined) return undefined;
		var prop = self._findProperty(self.detail,propertyName);
		if (prop === undefined) {
			return "";
		}
		return prop.value;
	};

	/**
	 * @return 
	 * 1. find element by RefType
	 * 2. Element
	 * 
	 * Example:
	 * <code>
	 * 	<element name="type" refType='policyOwner'>
	 * 		....
	 * 	</element>
	 * </code>
	 * findElementRefTypeInDetail('<elementsChain>','policyOwner') will return this element
	 */
	IposDocService.prototype.findElementRefTypeInDetail = function(elementsChain, refType){
		var self = this;
		if (self.detail === undefined) return undefined;

		var rs = self.findElementInDetail(elementsChain);
		if (rs === undefined){
			var err = new IposError("Result is undefined");
			err.param("elementsChain", elementsChain);
			err.throwError();
		}
		var ele = undefined;
		try{	
			ele = self.findElementByRefType(rs, refType);
		}catch(error){
			var err = new IposError("Some error are thrown from inside methods", error);
			err.param("elementsChain", elementsChain);
			err.param("refType", refType);
			err.throwError();
		};

		return ele;
	};
	IposDocService.prototype.findElementByRefType = function(parent, refType){
		var self = this;
		if (parent === undefined) throw "ERROR findElementByRefType('"+refType+"')";
		if(parent.refType == refType) return parent;
		var childrenElements = parent.elements;
		if (childrenElements === undefined) {
			throw "ERROR findElementByRefType('"+refType+"'): There is no childrenElements of parent:"+parent;
		}
		for ( var i = 0; i < childrenElements.length; i++) {
			var childElement = childrenElements[i];
			var rs = self.findElementByRefType(childElement, refType);
			if (rs !== undefined){
				return rs;
			}
		}
		return undefined;
	};

	//HANDLE A GENERAL IPOS-DOCUMENT //////////////////////////////////////////////////////////////////////////
	/**
	 * This method should be used as private.
	 * You can use findElementInElement(parent, elementsChain) 
	 * @param name The name of childElement
	 */
	IposDocService.prototype._findElement = function(parent, name){
		var self = this;
		if (parent === undefined) throw "ERROR _findElement('"+name+"')";
		var childrenElements = parent.elements;
		if (childrenElements === undefined) {
			throw "ERROR _findElement('"+name+"'): There is no childrenElements of parent:"+parent;
		}
		for ( var i = 0; i < childrenElements.length; i++) {
			var childElement = childrenElements[i];
			if (childElement.name == name) return childElement;

			var rs = self._findElement(childElement, name);
			if (rs !== undefined){
				return rs;
			}
		}
		return undefined;
	};

	/**
	 * This method should be used as private.
	 * You can use findPropertyInElement(...) 
	 * @param parent an Element
	 */
	IposDocService.prototype._findProperty = function(parent, name){
		if (parent === undefined) {
			var e = new IposError("Parent element is undefined");
			e.param("parent", parent);
			e.param("name", name);
			e.throwError();
		}
		var properties = parent.properties;
		if (properties === undefined) return undefined;//With test data from illustration/vmenu-lv2.html, item doesn't have properties. (Note: this is just for testing, we should delete this checking in real code)
		for ( var i = 0; i < properties.length; i++) {
			var property = properties[i];
			if (property.name == name){
				return property;
			}
		}
		return undefined;
	};

	/**
	 * We don't name this method as 'findElement' because it may become difficult to search (the result may show other methods)
	 * @param element to be found
	 * @param elementsChain is an array of of elements' names
	 * Example: ['prospect','fullname','firstname']
	 * If elementsChain is null or undefined, return parent element.
	 * @return an element which is equals to the last element's name in @elementsChain
	 */
	IposDocService.prototype.findElementInElement = function(parent, elementsChain){
		var self = this;
		var ele = parent;
		if (!commonService.hasValue(elementsChain)) return ele;
		for ( var i = 0; i < elementsChain.length; i++) {
			var eleName = elementsChain[i];
			if (commonService.hasValue(ele)){
				ele = self._findElement(ele,eleName);
			}else{
				var err = new IposError("Not found element");
				var errChainNames = "$parent";
				for ( var j = 0; j < i; j++) {
					errChainNames += ("."+elementsChain[j]);
				}
				err.param("parent", parent);
				err.param("elementsChain", elementsChain);
				err.param("elementsChain got stuck (not found element or element is null)", errChainNames);
				err.throwError();
			}
		}
		return ele;
	};

	/**
	 * Find element by tags, similar to _findElement but compare by tags instead of name
	 * @param element to be found
	 * @param elementsChain is an array of of elements' names
	 * Example: ['prospect','fullname','firstname']
	 * If elementsChain is null or undefined, return parent element.
	 * @return an element which is equals to the last element's name in @elementsChain
	 */
	IposDocService.prototype.findElementInElementByTags = function(parent, tagName){
		var self = this;
		if (parent === undefined) throw "ERROR findElementInElementByTags('"+tagName+"')";
		var childrenElements = parent.elements;
		if (childrenElements === undefined) {
			throw "ERROR findElementInElementByTags('"+tagName+"'): There is no childrenElements of parent:"+parent;
		}
		for ( var i = 0; i < childrenElements.length; i++) {
			var childElement = childrenElements[i];
			if (childElement.tags == tagName) return childElement;

			var rs = self.findElementInElementByTags(childElement, tagName);
			if (rs !== undefined){
				return rs;
			}
		}
		return undefined;
	};
	IposDocService.prototype.findEnumsInElement = function(parent, elementsChain){
		var self = this;
		//if (self.detail === undefined) return undefined;

		var ele = self.findElementInElement(parent, elementsChain);
		if (ele === undefined){
			var err = new IposError("Not found element");
			err.param("parent", parent);
			err.param("elementsChain", elementsChain);
			err.throwError();
		}
		return ele.restriction.enumerations;
	};
	/**
	 * @param parent
	 * @param elementsChain if this is null or undefined, this method will find property in parent element
	 * @param propertyName
	 * @returns the property
	 */
	IposDocService.prototype.findPropertyInElement = function(parent, elementsChain, propertyName){
		var self = this;
		var ele = undefined;
		try{
			ele = self.findElementInElement(parent, elementsChain);
		}catch(error){
			var err = new IposError("Some error inside", error);
			err.param("parent", parent);
			err.param("elementsChain", elementsChain);
			err.param("propertyName", propertyName);
			err.throwError();
		}
		if (!commonService.hasValue(ele)){
			var err = new IposError("Cannot found element");
			err.param("parent", parent);
			err.param("elementsChain", elementsChain);
			err.param("propertyName", propertyName);
			err.throwError();
		}
		var prop = self._findProperty(ele, propertyName);
		return prop;
	};
	/**
	 * @param parent
	 * @param elementsChain if this is null or undefined, this method will find property in parent element
	 * @param propertyName
	 * @returns the property
	 */
/*	IposDocService.prototype.findPropertiesInElementList = function(parent, elementName, propertyName){
		var self = this;
		var ele = undefined;
		try{
			ele = self.findElementInElement(parent, ['elementName']);
		}catch(error){
			var err = new IposError("Some error inside", error);
			err.param("parent", parent);
			err.param("elementName", elementName);
			err.param("propertyName", propertyName);
			err.throwError();
		}
		if (!commonService.hasValue(ele)){
			var err = new IposError("Cannot found element");
			err.param("parent", parent);
			err.param("elementName", elementName);
			err.param("propertyName", propertyName);
			err.throwError();
		}
		if (ele.length < 1) return new Array();
		var valueList = new Array();
		angular.forEach(ele.elements, function(subElement){
			var propertyValue = self._findProperty(subElement, propertyName).value;
			valueList.push(propertyValue);
		});		
		return valueList;
	};*/
	/**
	 * @return 
	 * 1. find the property value of element
	 * 2. return the enum which is corresponding to element's value.
	 * 
	 * Example:
	 * <code>
	 * 	<element name="contactType" value="O">
	 * 		<enum value="H" label="HOME"/>
	 * 		<enum value="O" label="OFFICE"/>
	 * 	</element>
	 * </code>
	 * findValueEnumInElement('contactType') will return <enum value="O" label="OFFICE">, not only 'O'
	 */
	IposDocService.prototype.findValueEnumInElement = function(parent, elementsChain){
		var self = this;
		var rs = self.findEnumByPropertyInElement(parent, elementsChain, "value");
		return rs;
	};
	/**
	 * @return Enumeration instance 
	 * From the value of an property, we will find its corresponding enum in restriction's enumerations
	 * If value of property is null, or undefined, or empty; return empty object
	 * If property has value, but not found in respection's enums; throw Error.
	 * 
	 * @param elementsChain
	 * For example:
	 * We need to get element policyOwner.person.fullname.firstname
	 * We can  use following elementsChain: ['policyOwner','gender'] 
	 */
	IposDocService.prototype.findEnumByPropertyInElement = function(parent, elementsChain, propertyName){
		var self = this;
		if (parent === undefined) return undefined;
		var prop = self.findPropertyInElement(parent, elementsChain, propertyName);
		if (prop === undefined){
			var err = new IposError("Not found property");
			err.param("parent", parent);
			err.param("elementsChain", elementsChain);
			err.param("propertyName", propertyName);
			err.throwError();
		}

		var enums = self.findEnumsInElement(parent, elementsChain);
		if (enums === undefined) {
			var err = new IposError("Not found enums");
			err.param("parent", parent);
			err.param("elementsChain", elementsChain);
			err.param("propertyName", propertyName);
			err.throwError();
		}

		var propValue = prop.value;
		if (!commonService.hasValueNotEmpty(propValue)) return {};

		var rs = undefined;
		for ( var i = 0; i < enums.length; i++) {
			var ienum = enums[i];
			if (ienum.value == propValue){
				rs = ienum;
				break;
			}
		}
		if (rs === undefined){
			var err = new IposError("Not found propValue in enums");
			err.param("parent", parent);
			err.param("elementsChain", elementsChain);
			err.param("propertyName", propertyName);
			err.param("found property's value", propValue);
			err.param("found enums of element (enums' size)", ( commonService.hasValue(enums)? enums.length : enums) );
			err.throwError();
		}
		return rs;
	};
	IposDocService.prototype.copyElementsValues = function(src, srcElementsChainsList, dest, destElementsChainsList){
		var self = this;
		if (srcElementsChainsList.length > destElementsChainsList.length){
			var err = new IposError("elementsChainsList of source is longer than dest");
			err.param("srcElementsChainsList", srcElementsChainsList);
			err.param("destElementsChainsList", destElementsChainsList);
			err.throwError();
		}
		for ( var i = 0; i < srcElementsChainsList.length; i++) {
			var srcEleChain =  srcElementsChainsList[i];
			var srcEle = self.findElementInElement(src, srcEleChain);
			var srcEleVal = self._findProperty(srcEle, "value").value;

			var destEleChain = destElementsChainsList[i];
			var destEle = self.findElementInElement(dest, destEleChain);
			var destEleValProp = self._findProperty(destEle, "value");
			destEleValProp.value = srcEleVal;
		}
	};
	IposDocService.prototype.findLastElementInElement = function(array){
		return $(array).last()[0];
	};


	//ELEMENT WITH MULTIPLE CHILDREN //////////////////////////////////////////////////////////////////////////////////////
	/**
	 * Clear values of all properties in all sub-elements of the input
	 */
	IposDocService.prototype.clearValuesHierachy = function(element){
		var self = this;
		var propValue = self._findProperty(element, "value");
		if (commonService.hasValue(propValue)){
			propValue.value = "";
			propValue.text = "";
		}
		var subElements = element.elements;
		for ( var i = 0; i < subElements.length; i++) {
			var subElement = subElements[i];
			self.clearValuesHierachy(subElement);
		}
	};

	//clear value of element by elementName contains
	IposDocService.prototype.clearValuesOfElementInHierachy = function(element, elementName){
		var self = this;

		//is element.name contains elementName?
		if(element.name.indexOf(elementName) != -1){
			var propValue = self._findProperty(element, "value");
			if (commonService.hasValue(propValue)){
				propValue.value = "";
				propValue.text = "";
			}
		}

		var subElements = element.elements;
		for ( var i = 0; i < subElements.length; i++) {
			var subElement = subElements[i];
			self.clearValuesOfElementInHierachy(subElement, elementName);
		}
	};

	IposDocService.prototype.hasAnyPropertyValue = function(element, elementName, propertyName, propertyValue, excludedElements){
		var self = this;

		if(commonService.hasValue(excludedElements)) {
			for(var i=0;i<excludedElements.length;i++) {
				if(element.name == excludedElements[i]) {
					return false;
				}
			}
		}

		//is element.name contains elementName?
		if(element.name.indexOf(elementName) != -1){
			var propValue = self._findProperty(element, propertyName);
			if(commonService.hasValue(propValue) && propertyValue == propValue.value) {
				return true;
			}
		}

		var subElements = element.elements;
		for ( var i = 0; i < subElements.length; i++) {
			var subElement = subElements[i];
			if(self.hasAnyPropertyValue(subElement, elementName, propertyName, propertyValue, excludedElements)) {
				return true;
			}			
		}

		return false;
	};

	IposDocService.prototype.clearValidatesHierachy = function(element){
		var self = this;
		var propValue = self._findProperty(element, "validate");
		if (commonService.hasValue(propValue)){
			propValue.value = "";
			propValue.text = "";
		}
		var subElements = element.elements;
		for ( var i = 0; i < subElements.length; i++) {
			var subElement = subElements[i];
			self.clearValidatesHierachy(subElement);
		}
	};
	/**
	 * Add an item to a group
	 * @param elementsChain the chain name refer to the group
	 * @return the new element which has just added
	 */
	IposDocService.prototype.addItemToListInDetail = function(elementsChain){
		var self = this;
		var rs;
		var initItemsGroup = self.findElementInElement(self.detail, elementsChain);//_findElement(self.initModel,groupName);
		var initItem = initItemsGroup.elements[0];
		var newItem = commonService.clone(initItem);	 
		self.clearValuesHierachy(newItem);
		self.clearValidatesHierachy(newItem);

		var itemsGroup = self.findElementInElement(self.detail, elementsChain);
		var itemsGroupCounterProp = self._findProperty(itemsGroup,"counter");
		if (itemsGroupCounterProp.value > 0){
			var items = itemsGroup.elements;
			items.push(newItem);
			rs = newItem;
		}//else, only increase the counter, because in the list of item, there was already an item existing.
		else{
			itemsGroup.elements[0] = newItem;
			rs = newItem;
			//rs = initItem;
		}
		itemsGroupCounterProp.value++;
		return rs;
	};

	IposDocService.prototype.addItemToList = function(data, elementsChain){
		var self = this;
		var rs;
		var initItemsGroup = self.findElementInElement(data, elementsChain);//_findElement(self.initModel,groupName);
		var initItem = initItemsGroup.elements[0];
		var newItem = commonService.clone(initItem);	 
		self.clearValuesHierachy(newItem);		
		var itemsGroup = self.findElementInElement(data, elementsChain);
		var itemsGroupCounterProp = self._findProperty(itemsGroup,"counter");
		if (itemsGroupCounterProp.value > 0){
			var items = itemsGroup.elements;
			items.push(newItem);
			rs = newItem;
			itemsGroupCounterProp.value++;
		}
		else{
			rs = initItem;			
			if(itemsGroupCounterProp.value == 0) {
				itemsGroupCounterProp.value = 1;
			}
		}

		return rs;
	};
	IposDocService.prototype.computeDefaultInElementByTags = function(obj, tags){
		var self = this;
		var deferred = self.$q.defer();
		//Note: 'productInputs' is an element of self.detail
		var applyTo = obj.name;
		var packageBundle = obj.packageBundle;
		var dataSet = self.extractUiDataSet(packageBundle);
		var targetObj = (applyTo == 'la')? self.applicationObject.laQuestions:self.applicationObject.poQuestions;
		var url = self.commonService.getUrl(self.commonService.urlMap.QUESTIONNAIRE_COMPUTE_DEFAULT_TAGS, tags);
		self.ajax.post(url, dataSet).success(function(dtoResult){//data = illustration
			self.mergeElement(dtoResult, targetObj);
			deferred.resolve(dtoResult);
		});
		return  deferred.promise;
	};
	IposDocService.prototype.addItemToListWithComputeInPackage = function(obj,data, elementsChain, tags){
		var self = this;
		var rs = self.addItemToList(data,elementsChain);
		self.computeDefaultInElementByTags(obj, tags).then(function(result){
			return result;
		});
		return rs;
	};
	IposDocService.prototype.addItemToListInDetailWithType = function(elementsChain, itemTypeVal, itemTypeText){
		var self = this;
		var rs;
		var initItemsGroup = self.findElementInElement(self.detail, elementsChain);//_findElement(self.initModel,groupName);
		var initItem = initItemsGroup.elements[0];

		var newItem = commonService.clone(initItem);	 
		self.clearValuesHierachy(newItem);
		self.clearValidatesHierachy(newItem);

		var type = self.findPropertyInElement(newItem,['type'],'value');
		type.value = itemTypeVal;
		type.text = itemTypeText;

		var itemsGroup = self.findElementInElement(self.detail, elementsChain);
		var itemsGroupCounterProp = self._findProperty(itemsGroup,"counter");
		if (itemsGroupCounterProp.value > 0){
			var items = itemsGroup.elements;
			items.push(newItem);
			rs = newItem;
		}//else, only increase the counter, because in the list of item, there was already an item existing.
		else{
			// clear previous value & validation
			self.clearValuesHierachy(initItem);
			self.clearValidatesHierachy(initItem);
			// set contact/address type accordingly
			var typeInit = self.findPropertyInElement(initItem,['type'],'value');
			typeInit.value = itemTypeVal;
			typeInit.text = itemTypeText;

			rs = initItem;
		}
		itemsGroupCounterProp.value++;
		return rs;
	};
	/**
	 * Remove an item from a group
	 * @param group "contacts" / "addresses"
	 */
	IposDocService.prototype.removeItemFromListInDetail = function(elementsChain,item){
		var self = this;
		var itemsGroup = self.findElementInElement(self.detail, elementsChain);
		var itemsGroupCounterProp = self._findProperty(itemsGroup,"counter");
		if (itemsGroupCounterProp.value > 1){
			var items = itemsGroup.elements;		
			items.remove(item);
		}
		itemsGroupCounterProp.value--;
	};

	/**
	 * Remove an item from a group by index
	 * @param group "contacts" / "addresses"
	 */
	IposDocService.prototype.removeItemByIndexFromList = function(data, elementsChain, indx){
		var self = this;
		var itemsGroup = self.findElementInElement(data, elementsChain);
		var itemsGroupCounterProp = self._findProperty(itemsGroup,"counter");
		if (itemsGroup.elements != undefined && itemsGroup.elements.length > 1 && indx >= 0) {
			var items = itemsGroup.elements;
			items.splice(indx, 1);
			itemsGroupCounterProp.value--;
		}		
		/*		if(itemsGroup.elements != undefined) {
			var items = itemsGroup.elements;

			if(itemsGroup.elements.length == 1) {
				self.clearValuesHierachy(items[0]);
				itemsGroupCounterProp.value = 0;
			} else if (itemsGroup.elements.length > 1 && indx >= 0) {				
				items.splice(indx, 1);
				itemsGroupCounterProp.value--;
			}
		}		
		 */	};

		 /**
		  * Set prefer value for contact:
		  * 1: prefer
		  * 0: not prefer
		  * @param group "contacts" / "addresses"
		  */
		 IposDocService.prototype.preferItemInListInDetail = function(elementsChain, item){
			 //get list of contacts
			 var self = this;
			 var elements = self.findElementInDetail(elementsChain).elements;
			 for ( var i = 0; i < elements.length; i++) {
				 var ielement = elements[i];
				 var ipreferValueProp = self.findPropertyInElement(ielement,['prefer'],'value');
				 ipreferValueProp.value = "0";
			 }
			 var preferValueProp = self.findPropertyInElement(item,['prefer'],'value');
			 preferValueProp.value = "1";
		 };
		 IposDocService.prototype.isPreferItemInListInDetail = function(item){
			 var itemPreferValueProp = this.findPropertyInElement(item,['prefer'],'value');
			 return (itemPreferValueProp.value == "1");
		 };
		 IposDocService.prototype.isVisibleListInDetail = function(elementsChain){
			 var self = this;

			 var rs = false;
			 if (!commonService.hasValue(self.detail)) return false;
			 var itemsGroup = self.findElementInElement(self.detail, elementsChain);
			 var itemsGroupCounterProp = self._findProperty(itemsGroup,"counter");
			 //	var groupCounterProp = self.findElementCounterOfSelectedItem(elementName);
			 if (commonService.hasValue(itemsGroupCounterProp)){
				 var groupCounter = itemsGroupCounterProp.value;
				 rs = (groupCounter > 0);
			 }
			 return rs;
		 };

		 IposDocService.prototype.isVisibleList = function(data, elementsChain){
			 var self = this;

			 var rs = false;
			 if (!commonService.hasValue(data)) return false;
			 var itemsGroup = self.findElementInElement(data, elementsChain);
			 var itemsGroupCounterProp = self._findProperty(itemsGroup,"counter");
			 //	var groupCounterProp = self.findElementCounterOfSelectedItem(elementName);
			 if (commonService.hasValue(itemsGroupCounterProp)){
				 var groupCounter = itemsGroupCounterProp.value;
				 rs = (groupCounter > 0);
			 }
			 return rs;
		 };

		 //VALIDATE
		 /**
		  * return {validResult: true/false, validMessage: 'The first error message'} 
		  */


		 IposDocService.prototype.checkValidValue = function(element){
			 var self = this;
			 //check direct properties
			 var properties = element.properties;
			 for ( var i = 0; i < properties.length; i++) {
				 var property = properties[i];
				 if (property.name == "value"){
					 if (!commonService.hasValueNotEmpty(property.value)){
						 return {validResult: false, validMessage: property.value};
					 }
				 }
			 }	
			 var children = element.elements;
			 for ( var i = 0; i < children.length; i++) {
				 var child = children[i];
				 var valid = self.checkValidValue(child);
				 if (!valid.validResult) {
					 return valid;
				 }
			 }	
			 return {validResult: true, validMessage: ""};
		 };
		 /**
		  * Check validity of the detail
		  * @returns if detail is valid, return true, otherwise false
		  */
		 IposDocService.prototype.isValidDetail = function(){
			 var self = this;
			 if (self.detail === undefined){
				 return false;
			 }
			 return self.checkValid(self.detail).validResult;
		 };


		 IposDocService.prototype.checkValueElementsInElementByTags = function(element, tagNames){
			 var self = this;
			 if(element === undefined || tagNames === undefined || tagNames.length == 0) return {validResult: true, validMessage: ""};

			 for ( var i = 0; i < tagNames.length; i++) {
				 var tagName = tagNames[i];
				 var eleFound =  self.findElementInElementByTags(element, tagName);
				 if (commonService.hasValue(eleFound)){
					 var rs = self.checkValidValue(eleFound);
					 if (!rs.validResult) return rs;
				 }
			 }	
			 return {validResult: true, validMessage: ""};
		 };


		 /**
		  * Check validity of the element
		  * @returns {validResult, validMessage}
		  */
		 IposDocService.prototype.isValidElement = function(ele){
			 var self = this;
			 var	validElement = self.checkValid(ele);
			 if(validElement.validResult){
				 var result = self.validateElement(ele);
				 if(result.length == 0){
					 return {validResult: true, validMessage: ""};
				 } else {
					 return {validResult: false, validMessage: result};
				 }
			 }

			 return validElement;
		 };

		 /**
		  * This method will clear all error message in all children elements
		  * @param element
		  */
		 IposDocService.prototype.clearErrorsInElement = function(element){
			 var self = this;
			 //check direct properties
			 var properties = element.properties;
			 for ( var i = 0; i < properties.length; i++) {
				 var property = properties[i];
				 if (property.name == "validate"){
					 if (commonService.hasValueNotEmpty(property.value)){
						 property.value = "";
					 }
				 }
			 }	
			 var children = element.elements;
			 for ( var i = 0; i < children.length; i++) {
				 var child = children[i];
				 self.clearErrorsInElement(child);		
			 }
		 };
		 IposDocService.prototype.removeErrorMessageInElement = function removeErrorMessageInElement (element){
			 var self = this;
			 //check direct properties
			 var properties = element.properties;
			 for ( var i = 0; i < properties.length; i++) {
				 var property = properties[i];
				 if (property.name == "validate"){
					 if (commonService.hasValueNotEmpty(property.value)){
						 property.value = "";
					 }
				 }
			 }	
			 var children = element.elements;
			 for ( var i = 0; i < children.length; i++) {
				 var child = children[i];
				 self.clearErrorsInElement(child);		
			 }
		 };
		 IposDocService.prototype.getListSelectedInElementByName = function(parent, name){
			 var self = this;
			 var resultList = [];
			 angular.forEach(parent.elements, function(item){
				 var obj = self.findElementInElement(item, [name]);
				 var obj_value = self._findProperty(obj, "value").value;
				 if(obj_value !== null && obj_value != ''){
					 var obj_caption = $.grep(self.findEnumsInElement(obj,[]), function(e){ return e.value == obj_value; })[0].text;
					 resultList.push({'value':obj_value,'text':obj_caption});
				 }
			 });
			 return resultList;
		 };

		 //HANDLE IPOS DOCUMENT FOR SELECTED MODEL //////////////////////////////////////////////////////////////////////
		 /**
		  * From uiDto, we will extract uiDataSet 
		  */
		 //TODO missing some other attributes
		 IposDocService.prototype.extractUiDataSet = function(uiDto){
			 var self = this;
			 var uiDataSet = { 
					 "createdDate" : uiDto.createdDate,
					 "updatedDate" :uiDto.updatedDate,
					 "dateFormat" : uiDto.dateFormat,
					 "docType" : uiDto.docType,
					 "docVersion" : uiDto.docVersion,
					 "packageBundle" : uiDto.packageBundle,
					 "ownerUid" : uiDto.ownerUid,
					 "updatedUserUid" : uiDto.updatedUserUid,
					 "uid" : uiDto.uid,
					 "status" : uiDto.status,
					 "name" : uiDto.name,
					 "name1" : uiDto.name1,
					 "name2" : uiDto.name2,
					 "name3" : uiDto.name3,
					 "packageName" : uiDto.packageName,
					 "tags" : uiDto.tags,
					 "errorMessages" : uiDto.errorMessages,
					 "parentUid" : uiDto.parentUid,
					 "parentDocType" : uiDto.parentDocType
			 };
			 if (uiDto === undefined ) throw "ERROR extractUiDataSet(uiDto): uiDto is null";
			 self.addElementAndProperty(uiDto, uiDataSet);
			 return uiDataSet;
		 };
		 
		 IposDocService.prototype.addElementAndProperty = function (eleSrc, eleDes) {
			 var self = this;
			 var childrenElements = eleSrc.elements;
			 eleDes.name = eleSrc.name;
			 eleDes.properties = self.retrieveProperties(eleSrc);
			 var itemsGroupCounterProp = self._findProperty(eleSrc,"counter");
			 if(!angular.isUndefined(itemsGroupCounterProp) && itemsGroupCounterProp.value == 0)
				 return;
			 //init list new element
			 var arrayElements = new Array();
			 for ( var i = 0; i < childrenElements.length; i++) {
				 arrayElements.push({name: childrenElements[i].name, refUid : childrenElements[i].refUid});
			 }
			 eleDes.elements = arrayElements;
			 for ( var i = 0; i < childrenElements.length; i++) {
				 var childElement = childrenElements[i];
				 self.addElementAndProperty(childElement, eleDes.elements[i]);
			 }
			 var childrentProperties = eleDes.properties;
			 for ( var i = 0; i < childrentProperties.length; i++) {
				 for ( var j = 0; j < arrayElements.length; j++) {
					 if(arrayElements[j].name == childrentProperties[i].name){
						 arrayElements.splice(j,1);
						 break;
					 }

				 }
			 }

		 };
		 IposDocService.prototype.mergeElement = function(eleSrc, eleDes){
			 var self = this;
			 angular.forEach(eleSrc.elements, function(element){
				 self.merge(element, eleDes);
			 });
		 };
		 IposDocService.prototype.merge = function (eleSrc, eleDes){
			 var self = this;
			 if (angular.isDefined(eleDes.elements)){
				 for ( var i = 0; i < eleDes.elements.length; i++) {
					 if (eleDes.elements[i].name == eleSrc.name) {
						 eleDes.elements.splice(i, 1, eleSrc);
						 break;
					 }else 
						 self.merge(eleSrc, eleDes.elements[i]);
				 }
			 }
		 };
		 /**
		  * Create array properties with only two attribute are "name" and "value" from array properties of uiDto
		  */
		 IposDocService.prototype.retrieveProperties = function (element) {
			 var self = this;

			 var childrenElements = element.elements;
			 var newProperties = new Array();
			 var childrenProperties = element.properties;
			 if(!angular.isUndefined(childrenProperties)){
				 for ( var j = 0; j < childrenProperties.length; j++) {
					 newProperties.push({name:childrenProperties[j].name,value:childrenProperties[j].value});
				 }
			 }
			 if(!angular.isUndefined(childrenElements) && childrenElements.length>0){
				 for ( var i = 0; i < childrenElements.length; i++) {
					 var childElement = childrenElements[i];
					 var childrenProperties = childElement.properties;
					 //find property and then add property be found to new element.
					 if(!angular.isUndefined(childrenProperties)){
						 for ( var j = 0; j < childrenProperties.length; j++) {
							 //only process property attribute has name equal "value"
							 if(childrenProperties[j].name == "value"){
								 //add property to new element
								 newProperties.push({name:childElement.name,value:childrenProperties[j].value});
								 break;
							 }

						 }
					 }
				 }
			 }
			 /*else{
			//browser properties of element
			var childrenProperties = element.properties;
			//find property and then add property be found to new element.
			if(!angular.isUndefined(childrenProperties)){
				for ( var j = 0; j < childrenProperties.length; j++) {
					//only process property attribute has name equal "value"
					//if(childrenProperties[j].name == "value"){
						//add property to new element
						newProperties.push({name:childrenProperties[j].name,value:childrenProperties[j].value});
						//break;
					//}

				}
			}
		}*/
			 return newProperties;
		 };


		 //REWRITE
		 IposDocService.prototype.isVisibleListInElement= function(element, elementsChain){
			 var self = this;

			 var rs = false;
			 if (!commonService.hasValue(element)) return false;
			 var itemsGroup = self.findElementInElement(element, elementsChain);
			 var itemsGroupCounterProp = self._findProperty(itemsGroup,"counter");
			 //	var groupCounterProp = self.findElementCounterOfSelectedItem(elementName);
			 if (commonService.hasValue(itemsGroupCounterProp)){
				 var groupCounter = itemsGroupCounterProp.value;
				 rs = (groupCounter > 0);
			 }
			 return rs;
		 };
		 /**
		  * Set prefer value for contact:
		  * 1: prefer
		  * 0: not prefer
		  * @param group "contacts" / "addresses"
		  */
		 IposDocService.prototype.preferItemInListInElement = function(element, elementsChain, item){
			 //get list of contacts
			 var self = this;
			 var elements = self.findElementInElement(element, elementsChain).elements;
			 for ( var i = 0; i < elements.length; i++) {
				 var ielement = elements[i];
				 var ipreferValueProp = self.findPropertyInElement(ielement,['prefer'],'value');
				 ipreferValueProp.value = "0";
			 }
			 var preferValueProp = self.findPropertyInElement(item,['prefer'],'value');
			 preferValueProp.value = "1";
		 };
		 IposDocService.prototype.isPreferItemInListInElement = function(item){
			 var itemPreferValueProp = this.findPropertyInElement(item,['prefer'],'value');
			 return (itemPreferValueProp.value == "1");
		 };

		 IposDocService.prototype.addItemToListInDetailHierarchy = function(elementsChain){
			 var self = this;
			 var rs = self.addItemToListInDetail.call(self, elementsChain);
//			 self.findElementInElement(rs,['Components']);
			 angular.forEach(rs.elements, function(e){
				 //find element has property counter
				 if(self.findPropertyInElement(e,[], 'counter') !== undefined){
					 e.elements.splice(0,e.elements.length - 1);
					 var propCounter = self.findPropertyInElement(e,[],'counter');
					 propCounter.value = 0;
					 angular.forEach(e.elements[0].elements, function(item){
						 var prop = self.findPropertyInElement(item,[],'value');
						 prop.value = '';
						 prop.text = '';
					 });
				 }
			 });
			 return rs;
		 };

		 /**
		  * Add an item to a group
		  * @param elementsChain the chain name refer to the group
		  * @return the new element which has just added
		  */
		 IposDocService.prototype.addItemToListInElement = function(element,elementsChain){
			 var self = this;
			 var rs;
			 var initItemsGroup = self.findElementInElement(element, elementsChain);//_findElement(self.initModel,groupName);
			 var initItem = initItemsGroup.elements[0];
			 var newItem = commonService.clone(initItem);	 
			 self.clearValuesHierachy(newItem);
			 self.clearValidatesHierachy(newItem);

			 var itemsGroup = self.findElementInElement(element, elementsChain);
			 var itemsGroupCounterProp = self._findProperty(itemsGroup,"counter");
			 if (itemsGroupCounterProp.value > 0){
				 var items = itemsGroup.elements;
				 items.push(newItem);
				 rs = newItem;
			 }//else, only increase the counter, because in the list of item, there was already an item existing.
			 else{
				 itemsGroup.elements[0] = newItem;
				 rs = newItem;
				 //rs = initItem;
			 }
			 itemsGroupCounterProp.value++;
			 return rs;
		 };

		 /**
		  * Remove an item from a group
		  * @param group "contacts" / "addresses"
		  */
		 IposDocService.prototype.removeItemFromListInElement = function(element,elementsChain,item){
			 var self = this;
			 var itemsGroup = self.findElementInElement(element, elementsChain);
			 var itemsGroupCounterProp = self._findProperty(itemsGroup,"counter");
			 if (itemsGroupCounterProp.value > 1){
				 var items = itemsGroup.elements;		
				 items.remove(item);
			 }
			 itemsGroupCounterProp.value--;
		 };

		 /*IposDocService.prototype.findDirectPropertyInDetail1 = function(propertyName){
	    var dynamicPath = '..properties{.name === $arg1}';
	    return JSPath.apply(dynamicPath,this.detail,{arg1:propertyName})[0];
	};*/

		 /*IposDocService.prototype.findPropertyInDetail1 = function(elementsChain, propertyName){
	    var dynamicPath = '.elements{.name === $arg1}';
	    return JSPath.apply(dynamicPath,this.detail,{arg1:propertyName})[0];
		//return JSPath.apply('..elements{.name==$arg1}.caption',this.detail,{arg1:'title'})[0];
		JSPath.apply('..elements{.name==$arg1}..elements{.name==$arg2}.properties{.name==$arg3}',this.detail,{arg1:'policyOwner',arg2:'title',arg3:'caption'})[0];
		return JSPath.apply('..elements{.name==$arg1}..elements{.name==$arg2}.properties{.name==$arg3}',this.detail,{arg1:'policyOwner',arg2:'title',arg3:'caption'});

	};*/

		 /**
		  * This method will filter all document with attribute tags="STARRED" 
		  * @param element
		  */
		 IposDocService.prototype.filterStarredDocument = function(docList){
			 var staredList = new Array();
			 if (commonService.hasValueNotEmpty(docList)){
				 for (var i = 0; i < docList.length; i++){
					 if (!commonService.hasValue(docList[i].tags)){
						 continue;
					 }
					 var tagArr = docList[i].tags.split(",");
					 var isPropectStarred = false;
					 for (var j = 0; j < tagArr.length; j++){
						 if (tagArr[j] === commonService.CONSTANTS.TAG.STARRED){
							 isPropectStarred = true;
							 break;
						 }
					 }
					 if (isPropectStarred)
						 staredList.push(docList[i]);
				 }
			 }
			 return staredList;
		 };

		 /**
		  * This method will filter all document with attribute tags included tagName 
		  * @param element
		  */
		 IposDocService.prototype.filterDocumentByTagName = function(docList, tagName){
			 var taggedList = new Array();
			 if (commonService.hasValueNotEmpty(docList)){
				 for (var i = 0; i < docList.length; i++){
					 if (!commonService.hasValue(docList[i].tags)){
						 continue;
					 }
					 var tagArr = docList[i].tags.split(",");
					 var isDocumentTagged = false;
					 for (var j = 0; j < tagArr.length; j++){
						 if (tagArr[j] === tagName){
							 isDocumentTagged = true;
							 break;
						 }
					 }
					 if (isDocumentTagged)
						 taggedList.push(docList[i]);
				 }
			 }
			 return taggedList;
		 };

		 IposDocService.prototype.valueIndetailNotEmpty = function(propertyName) {
			 var self = this;
			 var flag = false;
			 var obj = self.findPropertyInDetail([propertyName],'value');
			 if(commonService.hasValue(obj) && commonService.hasValueNotEmpty(obj.value))
				 flag = true;
			 return flag;
		 };
		 /**
		  * 
		  */
		 IposDocService.prototype.clearElementByTags = function(elementTags){
			 var self = this;
			 var parent = self.detail;
			 for ( var i = 0; i < elementTags.length; i++) {
				 var obj = self.findElementInElementByTags(parent, [elementTags[i]]);
				 obj.elements = [];
			 }

		 };
		 IposDocService.prototype.clearValueByTags = function(elementTags){
			 var self = this;
			 var parent = self.detail;
			 for ( var i = 0; i < elementTags.length; i++) {
				 var obj = self.findElementInElementByTags(parent, [elementTags[i]]);
				 self.clearValuesHierachy(obj);
			 }
		 };
		 IposDocService.prototype.findElementInDetailByPropertyName = function(elementsChain, propertyName, propertyValue){
			 var self = this;
			 var elements = self.findElementInDetail(elementsChain).elements;
			 var result = [];
			 if(commonService.hasValue(elements)){
				 for ( var i = 0; i < elements.length; i++) {
					 var prop = self.findPropertyInElement(elements[i], [], propertyName);
					 if(commonService.hasValue(prop) && prop.value == propertyValue){
						 result = elements[i];
						 break;
					 }
				 }
			 }

			 return result;
		 };
		 IposDocService.prototype.findElementInDetailByElementName = function(elementsChain, elementName, propertyValue){
			 var self = this;
			 var elements = self.findElementInDetail(elementsChain).elements;
			 var result = undefined;
			 if(commonService.hasValue(elements)){
				 for ( var i = 0; i < elements.length; i++) {
					 var ele = self.findElementInElement(elements[i], [elementName]);
					 var prop = self.findPropertyInElement(ele, [], 'value');
					 if(commonService.hasValue(prop) && prop.value == propertyValue){
						 result = elements[i];
						 break;
					 }
				 }
			 }

			 return result;
		 };
		 IposDocService.prototype.findElementInElementByElementName = function(element, elementsChain, elementName, propertyValue){
			 var self = this;
			 var elements = self.findElementInElement(element, elementsChain).elements;
			 var result = undefined;
			 if(commonService.hasValue(elements)){
				 for ( var i = 0; i < elements.length; i++) {
					 var ele = self.findElementInElement(elements[i], [elementName]);
					 var prop = self.findPropertyInElement(ele, [], 'value');
					 if(commonService.hasValue(prop) && prop.value == propertyValue){
						 result = elements[i];
						 break;
					 }
				 }
			 }

			 return result;
		 };
		 IposDocService.prototype.findPropertyInElementByElementName = function(element, elementsChain, propertyName, propertyValue){
			 var self = this;
			 var elements = self.findElementInElement(element, elementsChain).elements;
			 var result = undefined;
			 if(commonService.hasValue(elements)){
				 for ( var i = 0; i < elements.length; i++) {
					 var prop = self.findPropertyInElement(elements[i], [], propertyName);
					 if(commonService.hasValue(prop) && prop.value == propertyValue){
						 result = elements[i];
						 break;
					 }
				 }
			 }

			 return result;
		 };
		 IposDocService.prototype.findValuePropInElementByAnotherProp = function(elementsChain, propertyName, propertyValue){
			 var self = this;
			 var elements = self.findElementInDetail(elementsChain).elements;
			 var result = undefined;
			 if(commonService.hasValue(elements)){
				 for ( var i = 0; i < elements.length; i++) {
					 var propOrignal = self.findPropertyInElement(elements[i], [], propertyName);				
					 if(commonService.hasValue(propOrignal) && propOrignal.value == propertyValue){
						 var prop = self.findPropertyInElement(elements[i], [], 'value');
						 result = prop;
						 break;
					 }
				 }
			 }

			 return result;
		 };
		 
		 IposDocService.prototype.findPropInDetailByElementNamePropertyName = function(elementsChain, elementName, propertyName, propertyValue){
			 var self = this;
			 var elements = self.findElementInDetailByElementName(elementsChain, elementName, propertyValue).elements;
			 var result = undefined;
			 if(commonService.hasValue(elements)){
				 for ( var i = 0; i < elements.length; i++) {
					 if(elements[i].name == 'value'){
						 var prop = self.findPropertyInElement(elements[i], [], propertyName);	
						 if(commonService.hasValue(prop)){
							 result = prop;
							 break;
						 }
					 }
								
				 }
			 }

			 return result;
		 };
		 IposDocService.prototype.findPropInElementByElementNamePropertyName = function(element, elementsChain, elementName, propertyName, propertyValue){
			 var self = this;
			 var result = undefined;
			 if (elementName != null) {
				 var elements = self.findElementInElementByElementName(element, elementsChain, elementName, propertyValue).elements;
				 if(commonService.hasValue(elements)){
					 for ( var i = 0; i < elements.length; i++) {
						 if(elements[i].name == 'value'){
							 var prop = self.findPropertyInElement(elements[i], [], propertyName);	
							 if(commonService.hasValue(prop)){
								 result = prop;
								 break;
							 }
						 }
						 
					 }
				 }
			 }else{
				 var properties = self.findPropertyInElementByElementName(element, elementsChain, propertyName, propertyValue).properties;
				 if(commonService.hasValue(properties)){
					 for ( var i = 0; i < properties.length; i++) {
						 if(properties[i].name == 'value'){
							 result = properties[i];
							 break;
						 }
					 }
				 }
			 }

			 return result;
		 };
		 
		 IposDocService.prototype.extractUiDataSet_V3 = function(uiDto, revList){
			 var self = this;
			 var uiDataSet = {};
			 if (uiDto === undefined ) throw "ERROR extractUiDataSet(uiDto): uiDto is null";
			 self.addElementAndProperty_V3(uiDto, uiDataSet, revList);
			 return uiDataSet;
		 };
		 
		 IposDocService.prototype.addElementAndProperty_V3 = function(src, des, revList) {
		     var self = this;
		     // remove "@table", "@displaytext" field for supporting iOS document
		     if(!revList){
		    	 var removeList = [
			                       "errorMessage", "@default", "@editable", 
			                       "@mandatory", "@validate", "@visible", 
			                       "@table", "@displaytext", "@nullable", "@display","$$hashKey","Option"];
		     }else{
		    	 var removeList = revList;
		     }
		     
		     for (var prop in src) {
		         if (!(removeList.indexOf(prop) > -1)) {
		            des[prop] = angular.copy(src[prop]);
		             
		            //is NaN when value is formated on UI by 3rd-parties libraries
		            //http://stackoverflow.com/a/8965463
		            if(des[prop] !== des[prop]){
			         	des[prop] = "";
					}
		         } else {
		        	 if (prop !== "Option")
		        		 delete des[prop];
		        	 else des[prop] = "";
		         }
		         if (src[prop] !== null && typeof des[prop] === 'object' && des[prop] !== undefined) {
		             //des[prop] = {};
		             self.addElementAndProperty_V3(src[prop], des[prop], revList);
		         }
		     }
		     
//		     //convert array with length = 1 to object
//		     if(angular.isArray(src)){
//		    	 src = src[0];
//		     }
//		     
//		     for (var prop in src) {
//				//if doesn't have in remove list, copy it
//				if(removeList.indexOf(prop) === -1){
//
//					//if it's object, traverse to children for processing
//					if(angular.isObject(src[prop])){
//						des[prop] = {};
//			     		self.addElementAndProperty_V3(src[prop], des[prop]);
//					}
//					//if not object, copy its value
//					else{
//						des[prop] = src[prop];
//
//			        if(des[prop] === null)
//			         	des[prop] = "";
//					}
//				}
//			}
		 };

		 IposDocService.prototype.setBusinessStatus = function(status){
			 this.findElementInDetail_V3(['DocStatus'])['BusinessStatus'] = status;
		 };
		 
		 IposDocService.prototype.getBusinessStatus = function(status){
			 return this.findElementInDetail_V3(['DocStatus']).BusinessStatus;
		 };

		 IposDocService.prototype.getCaseTransactionType = function(){
			 if (this.name == "case-management"){
				 var caseEle = this.findElementInDetail_V3(['CaseManagement']);
				 return caseEle ? caseEle['@case-name'] : undefined;
			 }
		 };

		 /* Old version of addElementAndProperty_V3
		  * 
		  * 
		  * IposDocService.prototype.addElementAndProperty_V3 = function(src, des){
			 var self = this;
			for(var prop in src){ 
                if(prop == '$' || prop == "@vpms-suffix" || prop == "Value" ||prop == "@counter"
                    || prop == "@xmlns"  || prop == "@refUid" || prop == "@refVal" || prop == "@refStatus"
                    || prop == "@xmlns:ipos-prospect"
                    || prop == "@xmlns:xsi"
                    || prop == "Header" 
                    || prop == "@xmlns"
                    || prop == "@xmlns:ipos-quotation-common"
                    || prop == "@xmlns:ipos-quotation-product-information"
                    || prop == "ipos-motor-insurance:Parties"
                    || prop == "@xmlns:ipos-exchangerate-information"
                    || prop == "@xmlns:ipos-product-information"
                    || prop == "@xmlns:ipos-illustration-common" 
                    || prop == "@xmlns:ipos-illustration"
                    || prop == "@refDocType"
                    || prop == "@xmlns:quotation-motor-insurance"
                    || prop.indexOf("@xmlns") != -1
                    || prop == "@refResourceUid"
                    || prop == "@refResourceDocType"
                    || prop == "@refResourceStatus"
                    || prop == "@refResourceVal"
                    || prop == "Attachments"
                    || prop == "@case-name"
                    || prop == "@product"
                    || prop == "@coupleUid"
                    || prop == "ipos-case-management-motor-private-car-m:SubmissionMessage"
					|| prop == "ipos-illustration:row"
					|| prop == "ipos-illustration:riderRow"
                	){
					des[prop] = src[prop];
					continue;
				}
                // for illustration 
                if(prop == "ipos-illustration:Party" ||prop == "ipos-illustration:riderRow" ||prop == "ipos-illustration:row" ){
                        des[prop] = [];
                    for (var i = 0; i < src[prop].length; i++) {
                        des[prop][i] = {};
                        self.addElementAndProperty_V3(src[prop][i], des[prop][i]);
                    }
                    continue;
                }
                
                //For illustration motor-private car and Application Motor-private-car
                if( prop == "illustration-motor-private-car:OptionalCoverage"
                	|| prop == "application-motor-private-car:OptionalCoverage"
                	|| prop == "application-motor-private-car:POID"
                	|| prop == "application-motor-private-car:ODID"
                	|| prop == "application-motor-private-car:Address"
                	|| prop == "application-motor-private-car:Contact"
                	|| prop == "application-motor-private-car:OtherDriver"){
                    des[prop] = [];
                for (var i = 0; i < src[prop].length; i++) {
                    des[prop][i] = {};
                    self.addElementAndProperty_V3(src[prop][i], des[prop][i]);
                }
                continue;
                }
                
              //For illustration motor-private car and Application Motor-private-car-ds
                if(prop == "illustration-motor-private-car-ds:OtherDriver" || prop == "illustration-motor-private-car-ds:OptionalCoverage" 
                	|| prop == "application-motor-private-car-ds:OptionalCoverage"
                	|| prop == "application-motor-private-car-ds:ID"
                	|| prop == "application-motor-private-car-ds:POID"
                	|| prop == "application-motor-private-car-ds:ODID"
                	|| prop == "application-motor-private-car-ds:MDID"
                	|| prop == "application-motor-private-car-ds:Address"
                	|| prop == "application-motor-private-car-ds:Contact"
                	|| prop == "application-motor-private-car-ds:OtherDriver"){
                    des[prop] = [];
                for (var i = 0; i < src[prop].length; i++) {
                    des[prop][i] = {};
                    self.addElementAndProperty_V3(src[prop][i], des[prop][i]);
                }
                continue;
                }
                
              //For illustration motor-private car M 
                if(prop == "illustration-motor-private-car-m-ds:OtherDriver" || prop == "illustration-motor-private-car-m-ds:OptionalCoverage" 
                	|| prop == "illustration-motor-private-car-m-ds:OptionalCoverage"
                	|| prop == "illustration-motor-private-car-m-ds:ID"
                	|| prop == "illustration-motor-private-car-m-ds:Address"
                	|| prop == "illustration-motor-private-car-m-ds:Contact"
                	|| prop == "illustration-motor-private-car-m-ds:OtherDriver"){
                    des[prop] = [];
                for (var i = 0; i < src[prop].length; i++) {
                    des[prop][i] = {};
                    self.addElementAndProperty_V3(src[prop][i], des[prop][i]);
                }
                continue;
                }
                
               //For Application Motor-private-car-m-ds
                if(prop == "application-motor-private-car-m-ds:OptionalCoverage" 
                	|| prop == "application-motor-private-car-m-ds:ID" 
                	|| prop == "application-motor-private-car-m-ds:Address"
                	|| prop == "application-motor-private-car-m-ds:Contact"
                	|| prop == "Attachment"){
                    des[prop] = [];
                for (var i = 0; i < src[prop].length; i++) {
                    des[prop][i] = {};
                    self.addElementAndProperty_V3(src[prop][i], des[prop][i]);
                }
                continue;
                }
                
              //For Case Management Motor-private-car-m-ds
                if(prop == "ipos-case-management-motor-private-car-m:Prospect"|| prop == "ipos-case-management-motor-private-car-m:Print"){
                    des[prop] = [];
                    if (src[prop].length != undefined){
                    	for (var i = 0; i < src[prop].length; i++) {
                            des[prop][i] = {};
                            self.addElementAndProperty_V3(src[prop][i], des[prop][i]);
                        }
                    } else des[prop].push(src[prop]);
                
                continue;
                }
                
                // For Case Management/Application: Term-life-protect
                if(prop == "case-management-term-life:Prospect"|| prop == "case-management-term-life:Prints" || prop == "application-term-life-protect:Illustration"
                	|| prop == "application-term-life-protect:Illustration" || prop == "application-term-life-protect:Party" || prop == "application-term-life-protect:ID" || prop == "application-term-life-protect:Contact"
                	|| prop == "application-term-life-protect:Address" || prop == "application-term-life-protect:ResidencyQuestion" || prop == "Attachment"
                
                ){
                    des[prop] = [];
                    if (src[prop].length != undefined){
                    	for (var i = 0; i < src[prop].length; i++) {
                            des[prop][i] = {};
                            self.addElementAndProperty_V3(src[prop][i], des[prop][i]);
                        }
                    } else des[prop].push(src[prop]);
                
                continue;
                }
                
                //For illustration Motor private car M AS and Application Motor private car M AS
                if(prop == "illustration-motor-private-car-m-as:OtherDriver" || prop == "illustration-motor-private-car-m-as:OptionalCoverage" 
                	|| prop == "illustration-motor-private-car-m-as:ID" || prop == "application-motor-private-car-m-as:OptionalCoverage"
                	|| prop == "application-motor-private-car-m-as:ID"	|| prop == "application-motor-private-car-m-as:Address"
                	|| prop == "application-motor-private-car-m-as:Contact"){
                    des[prop] = [];
                for (var i = 0; i < src[prop].length; i++) {
                    des[prop][i] = {};
                    self.addElementAndProperty_V3(src[prop][i], des[prop][i]);
                }
                continue;
                }
                
              //For illustration Motor private car M DS and Application Motor private car M DS
                if(prop == "illustration-motor-private-car-m-ds:OtherDriver" || prop == "illustration-motor-private-car-m-ds:OptionalCoverage" 
                	|| prop == "illustration-motor-private-car-m-ds:ID" || prop == "application-motor-private-car-m-ds:OptionalCoverage"
                	|| prop == "application-motor-private-car-m-ds:ID"	|| prop == "application-motor-private-car-m-ds:Address"
                	|| prop == "application-motor-private-car-m-ds:Contact"){
                	des[prop] = [];
                    if (src[prop].length != undefined){
                    	for (var i = 0; i < src[prop].length; i++) {
                            des[prop][i] = {};
                            self.addElementAndProperty_V3(src[prop][i], des[prop][i]);
                        }
                    } else des[prop].push(src[prop]);
                
                continue;
                }
                
              //For Prospect
                if(prop == "ipos-prospect:ID" || prop == "ipos-prospect:Address" || prop == "ipos-prospect:CheckAsApplicable" || prop == "ipos-prospect:CommunicationChannel"
                	|| prop == "ipos-prospect:Contact" || prop == "Attachment"){
                	des[prop] = [];
                    if (src[prop].length != undefined){
                    	for (var i = 0; i < src[prop].length; i++) {
                            des[prop][i] = {};
                            self.addElementAndProperty_V3(src[prop][i], des[prop][i]);
                        }
                    } else des[prop].push(src[prop]);
                
                continue;
                }
                
                //For application motor-sompo
                if(prop == "ipos-application-motor-sompo:OptionalCoverage" || prop == "ipos-application-motor-sompo:IC" || prop == "ipos-application-motor-sompo:Address"
                	|| prop == "ipos-application-motor-sompo:Contact" || prop == "ipos-application-motor-sompo:OtherDriver" || prop == "ipos-application-motor-sompo:ODIC"
                	|| prop == "ipos-application-motor-sompo:ODIC" 
                ){
                    des[prop] = [];
	                for (var i = 0; i < src[prop].length; i++) {
	                    des[prop][i] = {};
	                    self.addElementAndProperty_V3(src[prop][i], des[prop][i]);
	                }
	                continue;
                }
                
                //For application motor-insurance
                if(prop == "ipos-application-motor-insurance:ID" || prop == "ipos-application-motor-insurance:Contact" || prop == "ipos-application-motor-insurance:MainDriver"
                	|| prop == "ipos-application-motor-insurance:MDID" || prop == "ipos-application-motor-insurance:OtherNamedDriver" || prop == "ipos-application-motor-insurance:ONDID"
                	|| prop == "ipos-application-motor-insurance:Questionnaire" 
                ){
                    des[prop] = [];
	                for (var i = 0; i < src[prop].length; i++) {
	                    des[prop][i] = {};
	                    self.addElementAndProperty_V3(src[prop][i], des[prop][i]);
	                }
	                continue;
                }
                
                //For Transaction & payment
                if(prop == "ipos-transaction:Payment" && src[prop].length>0){
                    des[prop] = [];
                for (var i = 0; i < src[prop].length; i++) {
                    des[prop][i] = {};
                    self.addElementAndProperty_V3(src[prop][i], des[prop][i]);
                }
                continue;
                }
                
                
                // for attachment
                if(prop == "Attachment"){
                        des[prop] = [];
                    for (var i = 0; i < src[prop].length; i++) {
                        des[prop][i] = {};
                        self.addElementAndProperty_V3(src[prop][i], des[prop][i]);
                    }
                    continue;
                }
                
				if(prop == "Options"){
					des[prop] = "";
					continue;
				}
				
                if(prop == "ipos-prospect:CommunicationChannel" || prop == "ipos-prospect:Contact" ||
                prop == "Attachment" || prop == "ipos-prospect:Address" || prop == "ipos-pdpa:CommunicationChannel" || prop == "ipos-prospect:ID" 
                	
                	|| prop == "ipos-prospect:Address" || prop == "ipos-prospect:Contact" || prop == "ipos-prospect:CommunicationChannel"){
                        des[prop] = [];
                    for (var i = 0; i < src[prop].length; i++) {
                        des[prop][i] = {};
                        self.addElementAndProperty_V3(src[prop][i], des[prop][i]);
                    }
                    continue;
                }
                
               

                if(prop == "Options"){
                    des[prop] = "";
                    continue;
                }
				
				if(src[prop] !== null && typeof src[prop] === 'object' && prop != "Options"){
					$log.debug(des[prop]);
					des[prop] = {};
					self.addElementAndProperty_V3(src[prop], des[prop]);
				}
				
                // for case-management 
                if(prop == "ipos-case-management:Prospect" ){
                        des[prop] = [];
                    for (var i = 0; i < src[prop].length; i++) {
                        des[prop][i] = {};
                        self.addElementAndProperty_V3(src[prop][i], des[prop][i]);
                    }
                    continue;
                }
                
              //For User
                if(prop == "ipos-user:ID" || prop == "ipos-user:Contact" 
                	|| prop == "ipos-user:Address"){
                    des[prop] = [];
                for (var i = 0; i < src[prop].length; i++) {
                    des[prop][i] = {};
                    self.addElementAndProperty_V3(src[prop][i], des[prop][i]);
                }
                continue;
                }
                
			}
		 };*/
		 
		 
		 IposDocService.prototype.clearErrorInElement = function(element){
			 var self = this;
			 for(var prop in element){
				if(prop == 'errorMessage'){
					element[prop] = "";
				} else if(element[prop] !== null && typeof element[prop] === 'object'){
					self.clearErrorInElement(element[prop]);
				}
			}
		 };
		 
		 IposDocService.prototype.removeErrorMessageNodeInElement = function(element){
			 var self = this;
			 for(var prop in element){
				if(prop == 'errorMessage'){
					delete element[prop];
				} else if(element[prop] !== null && typeof element[prop] === 'object'){
					self.removeErrorMessageNodeInElement(element[prop]);
				}
			}
		 };
		 
		 /**
		  * @author lhoang4 (Long Hoang)
		  * Remove all the '@validate' in Element
		  * @param  {Object} element the object need to clear element
		  */
		 IposDocService.prototype.removeValidateNodeInElement = function(element){
			 var self = this;
			 for(var prop in element){
				if(prop == '@validate'){
					element[prop] = "";
				} else if(element[prop] !== null && typeof element[prop] === 'object'){
					self.removeValidateNodeInElement(element[prop]);
				}
			}
		 };
		 

		 /**
		  * clear data in attribute '$', 'Value', '@refUid' of objects in {@code element}
		  * Will restore the default value if having it.
		  * Don't support white-list because these object will have '@default' values to restore it
		  * @param  {Object} 	element  	the object need to clear element
		  */
		 IposDocService.prototype.clearDataInJson = function(element){
		    for (var prop in element) {
		    	//if element has those 'prop', clear it
		    	if (  	prop === "@refUid" || 
		    			prop === "$" || 
		    			prop === "Value" ){
		    		//if has default value, set it again
		    		if(commonService.hasValueNotEmpty(element['@default']))
						element[prop] = element['@default'];		        	
					else
						element[prop] = "";
		    	}
		        
		        //if it's an object, continuous to processe it
		        if (typeof element[prop] === "object" && prop !== "Options") {
		            this.clearDataInJson(element[prop]);
		        }
		    }	
		 };

		 /**
		  * @author mle27 (Minh Le)
		  * Convert all the 'counter' children element of {@code element} to array
		  * @param  {Object} element the element want to convert all
		  */
		 IposDocService.prototype.convertElementsToArrayInElement_V3 = function(element){
		 	if(typeof(element) === "object"){
		 		//if has 'counter', process this element
		 		if (element['@counter']){
		 			for (var prop in element){
		 				if (typeof(element[prop]) === "object" && !Array.isArray(element[prop])){
							element[prop] = this.convertToArray(element[prop]);
							break;
						}
					}
		 		}

		 		//further traverse to children to convert element to array
		 		for(var key in element){
		 			this.convertElementsToArrayInElement_V3(element[key]);
		 		}
		 	}
		 };


	    /**
	     * @author dnguyen98 (Dang Nguyen)
	     * Checking if detail is in computing state or not
	     * @return {boolean} true if detail is computed
	     */	    
	    IposDocService.prototype.isDetailComputed = function(){
	    	if (this.findElementInDetail_V3(['@editable']) != undefined ||
	    	   this.findElementInDetail_V3(['@mandatory']) != undefined ||
	    	   this.findElementInDetail_V3(['@visible']) != undefined){
	    	   return true;
	    	}

	    	return false;
	    };
		 
		
		 /*##################################################################
		  * ListDetailCoreService Function
	###################################################################*/
		 /**
		  * @constructor
		  * @param $q
		  * @param ajax
		  * @param $location
		  * @param appService
		  * @param cacheService
		  */
		 var ListDetailCoreService = function ($q, ajax, $location, appService, cacheService, commonService, $window) {
			 IposDocService.call(this);

			 this.name = undefined;

			 // services
			 this.$q = $q;
			 this.ajax = ajax;
			 this.cacheService = cacheService;
			 this.$location = $location;
			 this.appService = appService;
			 this.commonService = commonService;
			 // data
			 this.items = undefined;
			 this.subordinatesItems = undefined;

			 this.detail = undefined;
			 this.originalDetail = undefined;
			 this.extraDetail = new ExtraDetail();
			 this.lazyChoicelist = undefined;
			 this.docList = undefined;
			 this.disabledMode = true; 
			 this.bolFinishLoading = true;
			 this.lazyContactList = undefined;
		 };
		 inherit(IposDocService, ListDetailCoreService);

		 var ExtraDetail = function() {
			 // add common extra properties for modules here
		 };

		 /**
		  * Load list of meta-data items from server execute callback function if success
		  * @param docType
		  * @param lastUpdatedFlag If true, also update list with last 5 mins updated items
		  * @param fnSuccess
		  * @returns {promise}
		  * <dl>
		  * <dt>Resolved with:</dt>
		  * <dd>list of items</dd>
		  * <dt>Rejected with:</dt>
		  * <dd>not defined</dd>	
		  * </dl>
		  */
		 ListDetailCoreService.prototype.loadItemList = function(docType, lastUpdatedFlag, fnSuccess, subordinateUid) {
			 var self = this;
			 var bLoaded = self.cacheService.hasItems(self.name)  && commonService.hasValue(self.items);
			if (subordinateUid != undefined) {
				self.showItems(fnSuccess, subordinateUid);
			} else if (bLoaded && lastUpdatedFlag) { 
				self.showLastUpdatedItems(fnSuccess);
			} else { // update the list with last 5 mins updated items 
				 self.showItems(fnSuccess, subordinateUid);
			}			 
		 };

		 /**
		  * Load document detail of a specific module from server via document uid and execute callback function if success
		  * @param uId
		  * @param fnSuccess
		  */
		 ListDetailCoreService.prototype.getDetail = function(uId, fnSuccess) {
			 var self = this;
			 var dataUrl = undefined;
			 self.bolFinishLoading = false;
			 if (self.name === "product") {
				 //dataUrl = self.name + "/packageBundle/" + uId;
				 dataUrl = self.commonService.getUrl(self.commonService.urlMap.PRODUCT_DETAIL, [ uId ]);
				 $log.debug("url:"+dataUrl);
			 } else {
				 //dataUrl = self.name + "/edit/" + uId;
				 dataUrl = self.commonService.getUrl(self.commonService.urlMap.DOCUMENT_EDIT, [ self.name, uId ]);
				 $log.debug("url:"+dataUrl);
			 }	
			 self.ajax.get(dataUrl).success(function(data) {
				 self.updateDetailData(data);
				 self.useCurrentDetailDataAsOriginal();
				 self.bolFinishLoading = true;
				 if(commonService.hasValue(fnSuccess)) fnSuccess.call(self, data);
			 });
		 };
		 
		 /**
		  * Load document detail of a specific module from server via document uid and execute callback function if success
		  * @param uId
		  * @param fnSuccess
		  * @param doNothing
		  */
		 ListDetailCoreService.prototype.getDetail_V3 = function(resourceURL, fnSuccess, doNothing) {
			 var deferred = $q.defer();
			 var self = this;

			 //skip this task when run in cordova
			 if(doNothing){
                deferred.resolve(self.detail);
                return deferred.promise;
             }

			 var dataUrl = undefined;
			 self.bolFinishLoading = false;
				 //dataUrl = self.name + "/edit/" + uId;
			 var docId = self.findElementInDetail_V3(['DocId']);
			 var docType = self.findElementInDetail_V3(['DocType']);
			 //var product = self.findElementInDetail_V3(['Product']);
			 var product = self.findElementInDetail_V3(['Header', 'Product'], {'errorOn': false, 'returnLastFound': false});
			 //dataUrl = self.commonService.getUrl(self.commonService.urlMap.DOCUMENT_EDIT, [ self.name, docId ]);
			 dataUrl = self.getDocumentEdit_V3(docType, product, docId);

			var actionName = "DOCUMENT_EDIT";
			var actionParams = [docType,docId, product];
			connectService.exeAction({
				    	actionName: actionName,
				    	actionParams: actionParams,
				    	resourceURL: resourceURL
				    }).then(function(data){
							 self.convertElementsToArrayInElement_V3(data);
						 	 self.detail = data;
							 self.originalDetail = angular.copy(self.detail);
							 deferred.resolve(data);	
				    });
			/* self.ajax.getRuntime(resourceURL, dataUrl, function(data){
				 //self.convertElementsToArrayInElement_V3(data);
				 self.detail = data;
				 self.originalDetail = angular.copy(self.detail);
				 deferred.resolve(data);	
			 });*/
			 return  deferred.promise;
		 };

		 ListDetailCoreService.prototype.getDocumentEdit_V3 = function(docType, product, docId, moreParams){
		 	 moreParams = moreParams || {};
			 var actionUrl = commonService.getUrl(commonService.urlMap.DOCUMENT_EDIT, [docType, docId, product, moreParams.transactionType]);
			 // if(docType == "illustration" || docType == "claim-notification" || docType =="application"){
				// 	 actionUrl = commonService.getUrl(commonService.urlMap.MODULE_EDIT, [docType, docId, product]);
			 // } else {
				// 	 actionUrl = commonService.getUrl(commonService.urlMap.DOCUMENT_EDIT, [docType, docId]);	
			 // }
			 return actionUrl;
		 };
		 
		 ListDetailCoreService.prototype.tagDocument = function(uId, tagName, fnSuccess) {
			 var self = this;
			 var dataUrl = undefined;
			 if (self.commonService.hasValue(uId)) 
				 dataUrl = self.commonService.getUrl(self.commonService.urlMap.DOCUMENT_TAG,[ self.name, uId, tagName ]);

			 self.ajax.post(dataUrl).success(function(data) {
				 self.refreshItemInList(data.uid, function(metaData){
					 if(self.commonService.hasValue(fnSuccess)) 
						 fnSuccess.call(self,metaData);
				 });
				 if (commonService.hasValue(self.detail) && self.detail.uid === data.uid)
					 self.detail.tags = data.tags;
				 self.applyPreDefineData();//TODO This logic only involved on UI 
				 self.useCurrentDetailDataAsOriginal();
			 });
		 };
		 
		 ListDetailCoreService.prototype.starDocument = function(resourceURL, product, uId, fnSuccess) {
			 var self = this;
			 var dataUrl = undefined;
			 var deferred = self.$q.defer();
			 if (self.commonService.hasValue(uId)){
					 dataUrl = self.commonService.getUrl(self.commonService.urlMap.DOCUMENT_STAR,[ self.name, uId ]);
			 }
			 self.ajax.getRuntime(resourceURL, dataUrl, function(data){
/*				 self.refreshItemInList(data.uid, function(metaData){
					 if(self.commonService.hasValue(fnSuccess)) 
						 fnSuccess.call(self,metaData);
				 });
				 if (commonService.hasValue(self.detail) && self.detail.uid === data.uid)
					 self.detail.tags = data.tags;
				 self.applyPreDefineData();//TODO This logic only involved on UI 
				 self.useCurrentDetailDataAsOriginal();*/
				 fnSuccess.call(self,data);
			 });
			 return deferred.promise;
		 };
		 
		 ListDetailCoreService.prototype.untagDocument = function(uId, tagName, fnSuccess) {
			 var self = this;
			 var dataUrl = undefined;
			 if (self.commonService.hasValue(uId))
				 dataUrl = self.commonService.getUrl(self.commonService.urlMap.DOCUMENT_UNTAG,[ self.name, uId, tagName ]);

			 self.ajax.post(dataUrl).success(function(data) {
				 self.refreshItemInList(data.uid, function(metaData){
					 if(self.commonService.hasValue(fnSuccess)) 
						 fnSuccess.call(self,metaData);
				 });
				 if (commonService.hasValue(self.detail) && self.detail.uid === data.uid)
					 self.detail.tags = data.tags;
				 self.applyPreDefineData();//TODO This logic only involved on UI 
				 self.useCurrentDetailDataAsOriginal();
			 });
		 };
		 //get resource file by case Id
		 ListDetailCoreService.prototype.getReourceFileByCaseId = function(resourceURL, caseId) {
			 var self = this;
			 var deferred = self.$q.defer();
			 var runtimeURL = commonService.getUrl(commonService.urlMap.GET_RESOURCE_BY_CASEID, [caseId]);
			 self.ajax.getRuntime(resourceURL, runtimeURL, function(data){
				 deferred.resolve(data);
			 	});
			 return deferred.promise;
		};
		 ListDetailCoreService.prototype.unStarDocument = function(resourceURL, product, uId, fnSuccess) {
			 var self = this;
			 var dataUrl = undefined;
			 var deferred = self.$q.defer();
			 if (self.commonService.hasValue(uId)){
					 dataUrl = self.commonService.getUrl(self.commonService.urlMap.DOCUMENT_UNSTAR,[ self.name, uId ]);
			 }
			 self.ajax.getRuntime(resourceURL, dataUrl, function(data){
/*				 self.refreshItemInList(data.uid, function(metaData){
					 if(self.commonService.hasValue(fnSuccess)) 
						 fnSuccess.call(self,metaData);
				 });
				 if (commonService.hasValue(self.detail) && self.detail.uid === data.uid)
					 self.detail.tags = data.tags;
				 self.applyPreDefineData();//TODO This logic only involved on UI 
				 self.useCurrentDetailDataAsOriginal();*/
				 fnSuccess.call(self,data);
			 });
			 return deferred.promise;
		 };
		 
		 ListDetailCoreService.prototype.changeTagDocuments = function(uIds, fromTagName, toTagName, fnSuccess) {
			 var self = this;
			 var dataUrl = undefined;
			 if (self.commonService.hasValue(uIds)) 
				 dataUrl = self.commonService.getUrl(self.commonService.urlMap.DOCUMENT_CHANGETAGLIST,[ self.name, uIds, fromTagName, toTagName ]);

			 self.ajax.post(dataUrl).success(function(list) {
				 if(self.commonService.hasValue(fnSuccess)){
					 fnSuccess.call(self,list);
				 }
			 });
		 };

		 ListDetailCoreService.prototype.changeDataOfItem = function (metaData, documentMeta){
			var self = this;
			var deferred = $q.defer();
			if(metaData){
				for (var i = 0; i < self.items.length; i++){
					if (self.items[i].DocId === documentMeta.DocId){
						self.items[i].Star = self.findJsonPathInItem(metaData, '$..Star');
						break;
					};
				}
				deferred.resolve(self.items);
			}
		 };
		 
		 ListDetailCoreService.prototype.toggleStar = function (resourceURL, documentMeta){
			 var self = this;
			 var isDocumentStarred = false;

			 if (commonService.hasValue(documentMeta.Star)){
				 if (documentMeta.Star === commonService.CONSTANTS.STARRED){
					 isDocumentStarred = true;
				 }
			 }
			 var deferred = $q.defer();
			 if(self.name=='illustration'||self.name=='quotation'){
				 var productName = documentMeta.ProductName;
			 }else{
				 var productName = documentMeta.Product;
			 }
			 if (isDocumentStarred){
				 self.unStarDocument(resourceURL, productName, documentMeta.DocId, function(metaData){
					 self.changeDataOfItem(metaData, documentMeta);
					 deferred.resolve(metaData);
				 });
			 }
			 else {
				 self.starDocument(resourceURL, productName, documentMeta.DocId, function(metaData){
					 self.changeDataOfItem(metaData, documentMeta);
					 deferred.resolve(metaData);
				 });
			 }
			 return  deferred.promise;
		 };

		 /**
		  * Load a document template of a specific module from server via document uid, execute callback function if success
		  * Use this to add a new document
		  * @param uId
		  * @param fnSuccess
		  */
		 ListDetailCoreService.prototype.initNewDetail = function(uId, fnSuccess) {
			 var self = this;
			 var dataUrl = undefined;
			 self.bolFinishLoading = false;
			 dataUrl = commonService.getUrl(commonService.urlMap.DOCUMENT_ADD, [ self.name ]);
			 if (commonService.hasValueNotEmpty(uId)) dataUrl = commonService.getUrl(commonService.urlMap.DOCUMENT_ADD_WITH_UID,[ self.name, uId ]);

			 self.ajax.get(dataUrl).success(function(data) {
				 self.updateDetailData(data);
				 self.applyPreDefineData();//TODO This logic only involved on UI 
				 self.useCurrentDetailDataAsOriginal();
				 self.bolFinishLoading = true;
				 if(commonService.hasValue(fnSuccess)) fnSuccess.call(self, data);
			 });
		 };
		 
		 /**
		  * Load a document template of a specific module from server via document uid, execute callback function if success
		  * Use this to add a new document
		  * @param uId
		  * @param fnSuccess
		  */
		 ListDetailCoreService.prototype.initNewDetail_V3 = function(uId, fnSuccess) {
			 var self = this;
			 var dataUrl = undefined;
			 self.bolFinishLoading = false;
			 dataUrl = commonService.getUrl(commonService.urlMap.DOCUMENT_ADD, [ self.name ]);
			 if (commonService.hasValueNotEmpty(uId)) dataUrl = commonService.getUrl(commonService.urlMap.DOCUMENT_ADD_WITH_UID,[ self.name, uId ]);

			 self.ajax.get_V3(dataUrl).success(function(data) {
				 self.updateDetailData(data);
				 self.applyPreDefineData();//TODO This logic only involved on UI 
				 self.useCurrentDetailDataAsOriginal();
				 self.bolFinishLoading = true;
				 if(commonService.hasValue(fnSuccess)) fnSuccess.call(self, data);
			 });
		 };
		
		 ListDetailCoreService.prototype.getDocumentList_V3 = function(
					resourceURL) {
				var self = this;
				var deferred = self.$q.defer();
				var runtimeURL = commonService.getUrl(
						commonService.urlMap.MODULE_DOCUMENTLIST_V3,
						[ self.name ]);

				connectService.exeAction({
			    	actionName: "MODULE_DOCUMENTLIST_V3",
			    	actionParams: [ self.name ],
			    	resourceURL: resourceURL
			    }).then(function(data){
			    	self.items = data;
					deferred.resolve(data);
			    });
				/*self.ajax.getRuntime(resourceURL, runtimeURL, function(
						data) {
					self.items = data;
					deferred.resolve(data);
				});*/
				return deferred.promise;
			};

			// get document detail
			ListDetailCoreService.prototype.getDocumentDetail_V3 = function(
					resourceURL, docId) {
				var self = this;
				var deferred = self.$q.defer();
				//var urlMapName = undefined;
				//urlMapName = commonService.urlMap.DOCUMENT_FIND_DOCUMENT_API_V3_NO_VERSION;

				if (docId != undefined) { // load existing detail
					//
					connectService.exeAction({
				    	actionName: "DOCUMENT_FIND_DOCUMENT_API_V3_NO_VERSION",
				    	actionParams: [ docId ],
				    	resourceURL: resourceURL
				    }).then(function(data){
				    		self.convertElementsToArrayInElement_V3(data);
							self.detail = data;
							deferred.resolve(data);
				    })

					// var url = commonService.getUrl(urlMapName,[ docId ]);
					// self.ajax.getRuntime(resourceURL, url, function(
					// 		data) {
					// 	self.convertElementsToArrayInElement_V3(data);
					// 	self.detail = data;
					// 	deferred.resolve(data);
					// });
				}
				return deferred.promise;
			};
		
		 ListDetailCoreService.prototype.getDocumentProductList_V3 = function(resourceURL, product) {
			 var self = this;
			 var deferred = self.$q.defer();
			 var runtimeURL = commonService.getUrl(commonService.urlMap.MODULE_PRODUCT_DOCUMENTLIST_V3, [self.name, product]);
			 self.ajax.getRuntime(resourceURL, runtimeURL, function(data){
				 self.items = data;
				 deferred.resolve(data);
			 	});
			 return deferred.promise;
		};	
			
		ListDetailCoreService.prototype.findDocument_V3 = function(resourceURL, docId) {
			 var self = this;
			 var deferred = self.$q.defer();

			 connectService.exeAction({
			    	actionName: "MODULE_FIND_DOCUMENT",
			    	actionParams: [docId],
			    	resourceURL: resourceURL
			   }).then(function(data){
				   self.detail = data;
				   self.originalDetail = angular.copy(self.detail);
				   deferred.resolve(data);
			   });
			 return deferred.promise;
		};
			
		ListDetailCoreService.prototype.findMetadata_V3 = function(resourceURL, docId) {
			 var self = this;
			 var deferred = self.$q.defer();
			 
			 connectService.exeAction({
			    	actionName: "DOCUMENT_FIND_METADATA_V3",
			    	actionParams: [docId],
			    	resourceURL: resourceURL
			   }).then(function(data){
				   deferred.resolve(data);
			   });
			 return deferred.promise;
		};
		
		ListDetailCoreService.prototype.findMetadataByQuery_V3 = function(resourceURL, query) {
			 var self = this;
			 var deferred = self.$q.defer();
			 var runtimeURL = commonService.getUrl(commonService.urlMap.DOCUMENT_FIND_METADATA_QUERY_V3, [self.name, query]);
			 self.ajax.getRuntime(resourceURL, runtimeURL, function(data){
				 deferred.resolve(data);
			 	});
			 return deferred.promise;
		};
			
		//Load Document by DocID to Edit (for DocType: Illustration, Quotation, Application,...)
		//Runtime will response Document which can be compute. 
		//Jun 6 2015
		ListDetailCoreService.prototype.findDocumentToEdit_V3 = function(resourceURL, product, docId, moreParams) {
			 var self = this;
			 var deferred = self.$q.defer();
			 moreParams = moreParams || {};
//			 var productName = self.findElementInDetail_V3(['Product']);
			 //Code at 27 june 2015 to edit document without ProductName
			 var runtimeURL = "";
			 // if (product) {
				//  if(product == "motor-uw") product = "motor-private-car-m-as";
				//  runtimeURL = commonService.getUrl(commonService.urlMap.MODULE_EDIT, [self.name,docId,product]);
			 // } else runtimeURL = commonService.getUrl(commonService.urlMap.DOCUMENT_EDIT, [self.name,docId]);
			 if(product == "motor-uw") 
			 	product = "motor-private-car-m-as";
			 //runtimeURL = commonService.getUrl(commonService.urlMap.DOCUMENT_EDIT, [self.name, docId, product, moreParams.transactionType]);
			 
			 
			 connectService.exeAction({
			    	actionName: "DOCUMENT_EDIT",
			    	actionParams: [self.name, docId, product, moreParams.transactionType],
			    	resourceURL: resourceURL
			   }).then(function(data){
				   	self.convertElementsToArrayInElement_V3(data);
					self.detail = data;
					self.originalDetail = angular.copy(self.detail);
					deferred.resolve(data);
			   })
			 return deferred.promise;
		};
		
		// Temp function. Need to remove after Runtime has endpoint finally for UW
		ListDetailCoreService.prototype.getUnderwriting = function(resourceURL, docId) {
			 var self = this;
			 var deferred = self.$q.defer();
			 //var runtimeURL = "underwriting2s/" + docId + "/operations/edit";
			  
			 /*self.ajax.getRuntime(resourceURL, runtimeURL, function(data){
				 self.detail = data;
				 self.originalDetail = angular.copy(self.detail);
				 deferred.resolve(data);
			 	});*/
			 
			 connectService.exeAction({
			    	actionName: "DOCUMENT_EDIT",
			    	actionParams: ["underwriting2", docId],
			    	resourceURL: resourceURL
			   }).then(function(data){
				   	self.detail = data;
					self.originalDetail = angular.copy(self.detail);
					deferred.resolve(data);
			   })
			 return deferred.promise;
		};
		
		// To get DTO document but not set it into detail
		ListDetailCoreService.prototype.getDTODocument_V3 = function(resourceURL,product,docId) {
			var self = this;
			var deferred = self.$q.defer();
			var runtimeURL = "";
			// if (product) {
			// 	runtimeURL = commonService.getUrl(commonService.urlMap.MODULE_EDIT, [self.name,docId,product]);
			// } else runtimeURL = commonService.getUrl(commonService.urlMap.DOCUMENT_EDIT, [self.name,docId]);
			runtimeURL = commonService.getUrl(commonService.urlMap.DOCUMENT_EDIT, [self.name, docId, product]);
			self.ajax.getRuntime(resourceURL, runtimeURL, function(data){
				deferred.resolve(data);
			});
			return deferred.promise;
		};
			
		ListDetailCoreService.prototype.findResourceByListUid = function(resourceURL,listResourceUid){
			 var self = this;
			 var deferred = self.$q.defer();
			 var runtimeURL = commonService.getUrl(commonService.urlMap.FIND_RESOURCE_BY_LIST_UID,[listResourceUid]);
			 self.ajax.getRuntime(resourceURL, runtimeURL, function(data){		 
				 deferred.resolve(data);
			 	});
			 return deferred.promise;
		};
		
		ListDetailCoreService.prototype.convertJsonPathToArray = function (data,jsonPathParent,jsonPathChild){
			var self = this;
			var cloneData = angular.copy(self.findJsonPathInItem(data,"$.."+jsonPathChild));
			if (cloneData!=undefined){
				var cloneDatas = [];
				cloneDatas.push(cloneData);
				self.findJsonPathInItem(self.detail,"$.."+jsonPathParent)[jsonPathChild]=cloneDatas;
			}
		 };
		
		ListDetailCoreService.prototype.jsonToArray = function (data,jsonPathParent,jsonPathChild){
			var self = this;
			if($.isArray(jsonPathParent)) {
				var arr = $.makeArray(self.findElementInElement_V3(data, jsonPathParent)[jsonPathChild]);
				arr != undefined  ? self.findElementInElement_V3(data, jsonPathParent)[jsonPathChild] = arr :"";
			} else {
				var arr = $.makeArray(self.findElementInElement_V3(data,[jsonPathParent,jsonPathChild]));
				arr != undefined  ? self.findElementInElement_V3(data,[jsonPathParent])[jsonPathChild] = arr :"";
			}
		};
		
		
		/**
         * convert all object base on 'arrayKey' in detail to array
         * @param  {Object}		detail 		iposDocument json data
         * @param  {Array}		arrayKey 	contain eleName array need to convert.
         */
		ListDetailCoreService.prototype.convertObjectToArray = function convertObjectToArray(detail, arrayKey){
			var self = this;
        	var childDetail = detail;
        	var eleName = arrayKey;
        	
        	if(arrayKey.length > 1){
        		eleName = arrayKey.pop();
        		childDetail = self.findElementInElement_V3(detail, arrayKey);
        	}
        	self.convertObjectEleToArray(childDetail, eleName);
        };


		
		//convert Object element to Array. Apply for new UiStructure
		ListDetailCoreService.prototype.convertObjectEleToArray = function (detail, elementName){
			var self = this;
			for(var key in detail){
				if(typeof(detail[key]) == "object"){
					if(key.indexOf(elementName) !== -1){ //detail is parent of detail[elementName]
						if(!angular.isArray(detail[key])){
							var array = self.convertToArray(detail[key]);
							detail[key] = array;
							break;
						}
					}
					else{
						self.convertObjectEleToArray(detail[key], elementName);
					}
				}
			}
		};

		 // This Using for convert Array in Array (using in illustrationDetail/app.js
		 // Author: lhoang4 
		 ListDetailCoreService.prototype.convertJsonPathToArray_v1 = function (data,jsonPathParent,jsonPathChild){
				var self = this;
				
				var cloneData = angular.copy(self.findJsonPathInItem(data,"$.."+jsonPathChild));
				
				if (cloneData!=undefined && !$.isArray(cloneData)){
					var cloneDatas = [];
					cloneDatas.push(cloneData);
					self.findJsonPathInItem(data,"$.."+jsonPathParent)[jsonPathChild]=cloneDatas;
				}
			 };
			
			 ListDetailCoreService.prototype.getPendingPayment_V3 = function(){
				 
			 }
			 
		 ListDetailCoreService.prototype.applyPreDefineData = function(){};

		 /**
		  * Save detail of an existing document or create a new document with input detail
		  * @param {Bolean} bolValidate If true, server need to do validation before save/create document
		  * @param {Object} fnSaveSuccess Callback function to call if success
		  *
		  * 25-Mar-2016
		  * TODO: case-management calls will need to pass transactionType to the url (tphan37)
		  */
		 ListDetailCoreService.prototype.saveDetail = function(bolValidate, fnSaveSuccess, fnSaveFail) {
			 var self = this;
			 var dataSet = self.extractUiDataSet(self.detail);
			 var actionUrl = self.name;
			 if (bolValidate == true) {
				 //actionUrl += "/validate/update";
				 actionUrl = commonService.getUrl(commonService.urlMap.DOCUMENT_VALIDATE_AND_UPDATE, [ self.name ]);
			 } else {
				 //actionUrl += "/update";
				 actionUrl = commonService.getUrl(commonService.urlMap.DOCUMENT_UPDATE, [ self.name ]);			
			 }
			 /**
			  * The result can be dataSet or uiDto
			  */
			 self.bolFinishLoading = false;
			 self.ajax.post(actionUrl, dataSet).success(function(result) {
				 //To check whether save a new model, or save a existing model 
//				 var bolAddNew = !commonService.hasValue(self.detail.uid);
				 if (bolValidate) {
					 self.updateDetailData(result);
					 var valid = self.checkValid(result);
					 if (valid.validResult == true) {// validate success
						 self.useCurrentDetailDataAsOriginal();
						 var detailUid = result.uid;
						 self.refreshItemInList(detailUid, fnSaveSuccess);
					 } else {
						 if (fnSaveFail !== undefined){
							 fnSaveFail.call(self, valid.validMessage);
						 }
					 }
				 } else {
					 //In this case:
					 // + if create new, return dataSet
					 // + if update, return uiDto
					 //In anycase, we only need the uid from result.
					 self.updateSavedDetailData(result);
					 self.useCurrentDetailDataAsOriginal();

					 var detailUid = result.uid;
					 self.refreshItemInList(detailUid, fnSaveSuccess);
				 }
				 self.bolFinishLoading = true;
			 });
		 };
		 /**THIS IS USE FOR V2 SaveDetail
		  * Save detail of an existing document or create a new document with input detail
		  * @param {Bolean} bolValidate If true, server need to do validation before save/create document
		  * @param {Object} fnSaveSuccess Callback function to call if success
		  */
		 ListDetailCoreService.prototype.saveDetailV2 = function(bolValidate, fnSaveSuccess, fnSaveFail) {
			 var self = this;
			 var dataSet = self.extractUiDataSet(self.detail);
			 var actionUrl = self.name;
			 if (bolValidate == true) {
				 //actionUrl += "/validate/update";
				 actionUrl = commonService.getUrl(commonService.urlMap.DOCUMENT_VALIDATE_AND_UPDATE_V2, [ self.name ]);
			 } else {
				 //actionUrl += "/update";
				 actionUrl = commonService.getUrl(commonService.urlMap.DOCUMENT_UPDATE_V2, [ self.name ]);			
			 }
			 /**
			  * The result can be dataSet or uiDto
			  */
			 self.bolFinishLoading = false;
			 self.ajax.post(actionUrl, dataSet).success(function(result) {
				 //To check whether save a new model, or save a existing model 
//				 var bolAddNew = !commonService.hasValue(self.detail.uid);
				 if (bolValidate) {
					 self.updateDetailData(result);
					 var valid = self.checkValid(result);
					 if (valid.validResult == true) {// validate success
						 self.useCurrentDetailDataAsOriginal();
						 var detailUid = result.uid;
						 self.refreshItemInList(detailUid, fnSaveSuccess);
					 } else {
						 if (fnSaveFail !== undefined){
							 fnSaveFail.call(self, valid.validMessage);
						 }
					 }
				 } else {
					 //In this case:
					 // + if create new, return dataSet
					 // + if update, return uiDto
					 //In anycase, we only need the uid from result.
					 self.updateSavedDetailData(result);
					 self.useCurrentDetailDataAsOriginal();

					 var detailUid = result.uid;
					 self.refreshItemInList(detailUid, fnSaveSuccess);
				 }
				 self.bolFinishLoading = true;
			 });
		 };
		 		 
		 ListDetailCoreService.prototype.parseXpathToJpath = function(xPath){
			 var jPath = "$.." + xPath.replace(new RegExp('/', 'g'), '.');
			 return jPath;
		 };
		 
		 ListDetailCoreService.prototype.mergeErrorToDetail = function(errorArr){
			var self = this;
			
			if(errorArr != undefined && errorArr.length > 0 ){
			/*if(errorArr.length > 0){*/
				for (var i = 0; i < errorArr.length; i++) {
					if(errorArr[i]['ipos-response:xpath'] != undefined){
						var jsonPath = self.parseXpathToJpath(errorArr[i]['ipos-response:xpath']);
						if (!commonService.hasValueNotEmpty(self.findJsonPathInItem(self.detail, jsonPath))){
							var jsonPathArray = self.parseXpathToJpathArray(errorArr[i]['ipos-response:xpath']);
							self.findElementInDetail_V3(jsonPathArray).errorMessage = errorArr[i]['ipos-response:error-code'];
						}else{
							self.findJsonPathInItem(self.detail, jsonPath).errorMessage = errorArr[i]['ipos-response:error-code'];
						}
					}
				}
			} else{
				if(errorArr != undefined && errorArr['ipos-response:xpath'] != undefined){
					var jsonPath = self.parseXpathToJpath(errorArr['ipos-response:xpath']);
					if (!commonService.hasValueNotEmpty(self.findJsonPathInItem(self.detail, jsonPath))){
						var jsonPathArray = self.parseXpathToJpathArray(errorArr['ipos-response:xpath']);
						self.findElementInDetail_V3(jsonPathArray).errorMessage = errorArr['ipos-response:error-code'];
					}else{
						self.findJsonPathInItem(self.detail, jsonPath).errorMessage = errorArr['ipos-response:error-code'];
					}
				}
			}
		 };

		 ListDetailCoreService.prototype.mergeErrorToElement = function(errorArr, element){
			var self = this;
			
			if(errorArr != undefined && errorArr.length > 0 ){
			/*if(errorArr.length > 0){*/
				for (var i = 0; i < errorArr.length; i++) {
					if(errorArr[i]['ipos-response:xpath'] != undefined){
						var jsonPath = self.parseXpathToJpath(errorArr[i]['ipos-response:xpath']);
						if (!commonService.hasValueNotEmpty(self.findJsonPathInItem(element, jsonPath))){
							var jsonPathArray = self.parseXpathToJpathArray(errorArr[i]['ipos-response:xpath']);
							self.findElementInElement_V3(element, jsonPathArray).errorMessage = errorArr[i]['ipos-response:error-code'];
						}else{
							self.findJsonPathInItem(element, jsonPath).errorMessage = errorArr[i]['ipos-response:error-code'];
						}
					}
				}
			} else{
				if(errorArr['ipos-response:xpath'] != undefined){
					var jsonPath = self.parseXpathToJpath(errorArr['ipos-response:xpath']);
					if (!commonService.hasValueNotEmpty(self.findJsonPathInItem(element, jsonPath))){
						var jsonPathArray = self.parseXpathToJpathArray(errorArr['ipos-response:xpath']);
						self.findElementInElement_V3(element, jsonPathArray).errorMessage = errorArr['ipos-response:error-code'];
					}else{
						self.findJsonPathInItem(element, jsonPath).errorMessage = errorArr['ipos-response:error-code'];
					}
				}
			}
		 };
		 
		 ListDetailCoreService.prototype.parseXpathToJpathArray = function(xPath){
			 var jPathArray = xPath.split("/");
			 if (jPathArray[0] == ""){
				 return jPathArray.splice(1,jPathArray.length);
			 }
			 return jPathArray;
		 };

		ListDetailCoreService.prototype.setSavedTime = function setSavedTime (docType, productType) {
			localStorage.setItem('savedTime', new Date().getTime());
		}


		/**
		 * Enhance {@ saveDetail_V3()} which will
		 * 		Return promise.fail when computing fail
		 * 		Return promise.done when computing succesful or save draft
		 * @param  {[type]} resourceURL   	[description]
		 * @param  {Bolean} bolValidate 	If true, server need to do validation before save/create document
		 * @param  {Object} fnSaveSuccess 	Callback function to call if success
		 * @param  {[type]} fnSaveFail    	[description]
		 * @return {[type]}               	[description]
		 */
		ListDetailCoreService.prototype.saveDetailV3New = function(resourceURL, bolValidate, fnSaveSuccess, fnSaveFail) {
			var deferred = $q.defer();
			var self = this;
			self.saveDetail_V3(resourceURL, bolValidate, fnSaveSuccess, fnSaveFail).then(function(result) {
				if (!self.isSuccess(result)){
					// if compute & error return, reject the promise
					if(bolValidate){
						self.mergeErrorToDetail(self.findElementInElement_V3(data, ['ipos-response:response-message']));
					}
					deferred.reject();
				}else{
					// self.clearErrorInElement(self.detail);
//					self.updateDetailData_V3(result);
					//if ( commonService.hasValueNotEmpty(self.getBusinessStatus()) ){
						if(bolValidate && self.getBusinessStatus() === commonService.CONSTANTS.STATUS.NEW)
							self.setBusinessStatus(commonService.CONSTANTS.STATUS.DRAFT);
//						else
//							self.setBusinessStatus(commonService.CONSTANTS.STATUS.NEW);
					//}
            		
					deferred.resolve(result);
				}
			});
			return  deferred.promise;
		};	
		 
		 
		 //tphan37: comment out when integrating UI_Framework to iOS HTML5
		 // /**
		 //  * Save detail of an existing document or create a new document with input detail
		 //  * @param {Bolean} bolValidate If true, server need to do validation before save/create document
		 //  * @param {Object} fnSaveSuccess Callback function to call if success
		 //  */
		 // ListDetailCoreService.prototype.saveDetail_V3 = function(resourceURL,bolValidate, fnSaveSuccess, fnSaveFail) {
			//  var deferred = $q.defer();
			//  var self = this;
			//  var dataSet = self.extractUiDataSet_V3(self.detail);
			//  // var dataSet = self.detail;
			//  var actionUrl = self.name;
			//  var docId = self.findElementInDetail_V3(['DocId']);
			//  var docType = self.findElementInDetail_V3(['DocType']);
			//  var productType = self.findElementInDetail_V3(['Header', 'Product'], {'errorOn': false, 'returnLastFound': false});
			//  if(!commonService.hasValueNotEmpty(docId)){	//create new
			// 	 actionUrl = self.getDocumentSave_V3(bolValidate, docType, productType);
			//  } else{	//update
			// 	 actionUrl = self.getDocumentUpdate_V3(bolValidate, docType, productType, docId);
			//  }	 
			//  self.ajax.postRuntime(resourceURL, actionUrl, dataSet, function(data){			 
			// 	 deferred.resolve(data);	
			// 	 if (bolValidate) {
			// 		self.clearErrorInElement(self.detail);
			// 		if(self.isSuccess(data)){	//validate success
			// 			self.setSavedTime();
			// 			self.updateDetailData_V3(data);
			// 		 } else{	//validate fail
			// 			 self.mergeErrorToDetail(self.findElementInElement_V3(data, ['ipos-response:response-message']));
			// 		 }
			// 	 } else {
			// 		self.setSavedTime();
			// 		self.updateDetailData_V3(data);
			// 	 }
			// 	 self.bolFinishLoading = true;
			//  });
			//  return  deferred.promise;
		 // };	
		 

		 /**
		  * Save detail of an existing document or create a new document with input detail
		  * @param {Bolean} bolValidate If true, server need to do validation before save/create document
		  * @param {Object} fnSaveSuccess Callback function to call if success
		  */
		ListDetailCoreService.prototype.saveDetail_V3 = function(resourceURL, bolValidate, fnSaveSuccess, fnSaveFail, forceSaveDetail, actionType) {
			var self = this;
			var actionName, arrParams;
			var deferred = $q.defer();

			//If detail not change, don't need to save detail
//            if (self.compareData(self.detail, self.originalDetail) && forceSaveDetail != true) {
//                deferred.resolve(self.detail);
//                return deferred.promise;
//            }

			var dataSet = self.extractUiDataSet_V3(self.detail);
			var docId = self.findElementInDetail_V3(['DocId']);
			var docType = self.findElementInDetail_V3(['DocType']);
			var productType = self.findElementInDetail_V3(['Header', 'Product'], {'errorOn': false, 'returnLastFound': false});
			 
			var businessStatus;
		 	
		 	if (docType == "underwriting2" && productType != "GTL1"){
				productType = undefined;
		 	}

			var transactionType = this.getCaseTransactionType();
			if (transactionType === "ENDORSEMENT") transactionType = "Endorsement";

			//create new
			if (!commonService.hasValueNotEmpty(docId)){	
				actionName = self.getActionSave(bolValidate);

				//if save validate
				if (bolValidate){					
				 	if (docType === commonService.CONSTANTS.MODULE_NAME.FACTFIND)
				 		businessStatus = commonService.CONSTANTS.STATUS.COMPLETED;
					
					arrParams = [docType, productType, businessStatus, transactionType];
				} 
				//save not validate
				else {
					arrParams = [docType, productType, transactionType];
				}
			} 
			//update
			else{	
				actionName = self.getActionUpdate(bolValidate);
				arrParams = [docType, docId, productType, transactionType, actionType];
			}

			connectService.exeAction({
		    	actionName: actionName,
		    	actionParams: arrParams,
		    	data: dataSet,
		    	resourceURL: resourceURL
		    }).then(
				function(data) {
				 	if (bolValidate) {
						self.clearErrorInElement(self.detail);
						if(self.isSuccess(data)){	//validate success
							self.setSavedTime();
							self.updateDetailData_V3(data);
							self.convertElementsToArrayInElement_V3(data);
							if(window.cordova){
							    self.detail = data;
							}
					 	} else{	//validate fail
							self.mergeErrorToDetail(self.findElementInElement_V3(data, ['ipos-response:response-message']));
					 	}
				 	} else {
						self.setSavedTime();
						self.updateDetailData_V3(data);
				 	}
				 	self.bolFinishLoading = true;

				 	deferred.resolve(data);	
				}
			);

			return  deferred.promise;
		};	
		 
		 /**
		  * 
		  * @param 
		  * @param 
		  */
		 ListDetailCoreService.prototype.setManagerDecisions = function(resourceURL, managerDecision, productName) {
			 var deferred = $q.defer();
			 var self = this;
			 var dataSet = self.extractUiDataSet_V3(self.detail);
			 var actionUrl = self.name;
			 var docId = self.findElementInDetail_V3(['DocId']);
			
			actionUrl = commonService.getUrl(commonService.urlMap.SET_MANAGER_DECISION, [ docId, managerDecision, productName ]);
			
			
			 self.ajax.postRuntime(resourceURL, actionUrl, dataSet, function(data){
				 	deferred.resolve(data);	
					if(self.isSuccess(data)){	//validate success
						self.updateDetailData_V3(data);
					 } else{	//validate fail
						 self.mergeErrorToDetail(self.findElementInElement_V3(data, ['ipos-response:response-message']));
					 }
			 });
			 return  deferred.promise;
		 };	
		 
		 
		 /**
		  * 
		  * @param 
		  * @param 
		  */
		 ListDetailCoreService.prototype.setGroupManagerDepartmentDecisions = function(resourceURL, groupManagerDepartmentDecision, productName) {
			 var deferred = $q.defer();
			 var self = this;
			 var dataSet = self.extractUiDataSet_V3(self.detail);
			 var actionUrl = self.name;
			 var docId = self.findElementInDetail_V3(['DocId']);
			
			actionUrl = commonService.getUrl(commonService.urlMap.SET_GROUP_DEPARTMENT_DECISION, [ docId, groupManagerDepartmentDecision, productName ]);
			
			
			 self.ajax.postRuntime(resourceURL, actionUrl, dataSet, function(data){
				 	deferred.resolve(data);	
					if(self.isSuccess(data)){	//validate success
						self.updateDetailData_V3(data);
					 } else{	//validate fail
						 self.mergeErrorToDetail(self.findElementInElement_V3(data, ['ipos-response:response-message']));
					 }
			 });
			 return  deferred.promise;
		 };	
		 
		 /**
		  * search metadata with many criteria
		  * @param {dataSet} data contain array of Key and Value to search in metadata 
		  * 
		  */
		 ListDetailCoreService.prototype.searchMetadata = function(resourceURL, dataSet) {
			 
			 var deferred = $q.defer();
			 var self = this;
			 var actionUrl = commonService.getUrl(commonService.urlMap.METADATA_SEARCH, [self.name]); 
			 self.ajax.postRuntime(resourceURL, actionUrl, dataSet, function(data){
				 deferred.resolve(data);	
			 });
			 return  deferred.promise;
		 };	
		 
		 /**
		  * advance search metadata with many criteria
		  * @param {dataSet} data contain array of Key and Value to search in metadata 
		  * 
		  */
		 ListDetailCoreService.prototype.searchAdvanceMetadata = function(resourceURL, dataSet) {
			 var deferred = $q.defer();
			 var self = this;
			
			 // var actionUrl = commonService.getUrl(commonService.urlMap.METADATA_ADVANCESEARCH, [self.name]); 
			/* self.ajax.postRuntime(resourceURL, actionUrl, dataSet, function(data){
				 deferred.resolve(data);	
			 });*/
			 
			 connectService.exeAction({
			    	actionName: "METADATA_ADVANCESEARCH",
			    	actionParams: [self.name],
			    	data: dataSet,
			    	resourceURL: resourceURL
			    }).then(function(data){				    		
			    	 deferred.resolve(data);
			    });
			 return  deferred.promise;
		 };	
		 
		 /**
		  * search metadata with many criteria
		  * @param {dataSet} data contain array of Key and Value to search in metadata. Ex: [{"@key": "DocType", "@value": "payment"}] 
		  * 
		  */
		 ListDetailCoreService.prototype.createSearchDataset = function(arrayKeyAndValue) {
			 var dataSet = {"ipos-container:map-list":{"@xmlns:ipos-generic":"com.csc.gdn.ipos.model.jaxb.generic","@xmlns:ipos-system":"com.csc.gdn.ipos.model.jaxb.system","@xmlns:ipos-container":"com.csc.gdn.ipos.model.jaxb.container","@xmlns:ipos-dms":"com.csc.gdn.ipos.model.jaxb.dms","ipos-container:map-container":[{"@name":"0","ipos-container:pair":[]}]}};
			 var array = this.findElementInElement_V3(dataSet, ["ipos-container:pair"]);
			 for(var i = 0; i < arrayKeyAndValue.length; i++){
				 array.push(arrayKeyAndValue[i]);
			 }
			 return dataSet;
		 };	
		 
		 ListDetailCoreService.prototype.createSearchDatasetWithEQAndNE = function(EQKeyAndValue, NEKeyAndValue) {
			 var dataSet = { "map-list": { "eq": [], "ne": [] } };
			 var EQArray = this.findElementInElement_V3(dataSet, ["eq"]);
			 var NEArray = this.findElementInElement_V3(dataSet, ["ne"]);
			 for(var i = 0; i < EQKeyAndValue.length; i++){
				 EQArray.push(EQKeyAndValue[i]);
			 }
			 for(var i = 0; i < NEKeyAndValue.length; i++){
				 NEArray.push(NEKeyAndValue[i]);
			 }
			 return dataSet;
		 };	
		 
		 /**
   		  * search date in date range
   		  * @param {list} list metadata to search
   		  * @param {searchKeyDate} key in metadata. This must be a date
   		  * @param {dateFrom} date from
   		  * @param {dateTo} date to
   		  * 
   		  */
		 ListDetailCoreService.prototype.searchInDateRange = function(list, searchKeyDate, dateFrom, dateTo){
    		var searchedList = [];
    		if(dateTo && !dateFrom)
				dateTo = Date.parse(dateTo);
    		if(dateFrom && !dateTo)
				dateFrom = Date.parse(dateFrom);
    		if(dateTo && dateFrom){
    			dateTo = Date.parse(dateTo);
    			dateFrom = Date.parse(dateFrom);
    		}
			for (var i=0; i< list.length; i++){
				list[i].isShow = true;
				if(list[i][searchKeyDate]){
					var dateTime = list[i][searchKeyDate].split(" ")[0];
					var paymentDate = Date.parse(dateTime);
					if(dateFrom && !dateTo){
						if(paymentDate >= dateFrom)
							searchedList.push(list[i]);
					}
					if(dateTo && !dateFrom){
						if(paymentDate <= dateTo)
							searchedList.push(list[i]);
					}
					if(dateTo && dateFrom){
						if(paymentDate >= dateFrom && paymentDate <= dateTo)
							searchedList.push(list[i]);
					}
				}else{
					var dateTime = list[i]["CreatedDate"].split(" ")[0];
					var paymentDate = Date.parse(dateTime);
					if(dateFrom && !dateTo){
						if(paymentDate >= dateFrom)
							searchedList.push(list[i]);
					}
					if(dateTo && !dateFrom){
						if(paymentDate <= dateTo)
							searchedList.push(list[i]);
					}
					if(dateTo && dateFrom){
						if(paymentDate >= dateFrom && paymentDate <= dateTo)
							searchedList.push(list[i]);
					}
				}
				
			}
			return searchedList;
    	}
		 
		 /**
		  * search number in number range
		  * @param {list} list metadata to search
		  * @param {searchKeyNumber} key in metadata.
		  * @param {numberFrom} number from
		  * @param {numberTo} number to
		  * 
		  */
		 ListDetailCoreService.prototype.searchInNumberRange = function(list, searchKeyNumber, numberFrom, numberTo){
			 var searchedList = [];
			 for (var i=0; i< list.length; i++){
				 list[i].isShow = true;
				 if(list[i][searchKeyNumber]){
					 var number = list[i][searchKeyNumber];
					 if(numberFrom && !numberTo){
						 if(number >= numberFrom)
							 searchedList.push(list[i]);
					 }
					 if(numberTo && !numberFrom){
						 if(number <= numberTo)
							 searchedList.push(list[i]);
					 }
					 if(numberTo && numberFrom){
						 if(number >= numberFrom && number <= numberTo)
							 searchedList.push(list[i]);
					 }
				 }
				 
			 }
			 return searchedList;
		 }
		 ListDetailCoreService.prototype.savePortletConfiguration_V3 = function(bolValidate, fnSaveSuccess, fnSaveFail) {
			 var self = this;
			 var dataSet = self.extractUiDataSet_V3(self.detail);
			 var actionUrl = self.name;
			 var docId = self.findElementInDetail_V3(['DocId']);
			 var docType = self.findElementInDetail_V3(['DocType']);
			 var docName = self.findElementInDetail_V3(['DocName']);
			 if(!commonService.hasValueNotEmpty(docId)){	//create new
				 if (bolValidate == true) {
					 actionUrl = commonService.getUrl(commonService.urlMap.DOCUMENT_VALIDATE_AND_SAVE, [docType]);
				 } else {
					 actionUrl = commonService.getUrl(commonService.urlMap.DOCUMENT_SAVE, [docType]);			
				 }
			 } else{	//update
				 if (bolValidate == true) {
					 actionUrl = commonService.getUrl(commonService.urlMap.DOCUMENT_VALIDATE_AND_UPDATE, [ docType, docId ]);
				 } else {
					 actionUrl = commonService.getUrl(commonService.urlMap.DOCUMENT_UPDATE, [docType, docId ]);			
				 }
			 }
			 self.bolFinishLoading = false;
			 self.ajax.post_V3(actionUrl, dataSet).success(function(result) {
				 if (bolValidate) {
					 self.clearErrorInElement(self.detail);
					if(result == undefined){
						 self.updateDetailData_V3(result);
					 } else{	
						 self.mergeErrorToDetail(self.findJsonPathInItem(result, '$..ipos-error-document:ErrorGroup.ipos-error-document:Error'));
					 }
					 
				 } else {
					 self.updateDetailData_V3(result);
				 }
				 self.bolFinishLoading = true;
			 });
		 };
		 
		 //tphan37: comment out when integrating UI_Framework to iOS HTML5
		 // ListDetailCoreService.prototype.getDocumentSave_V3 = function(bolValidate, docType, productType){
			//  var actionUrl;
			//  var businessStatus;
			//  var transactionType = this.getCaseTransactionType();
			//  if (bolValidate == true) {
			//  	if(docType === 'factfind')
			//  		businessStatus = "COMPLETED";
			// 	 //if(docType == "illustration" || docType == "claim-notification" || docType=="application" || docType == "case-management"){
			// 	 // if(docType == "illustration" || docType=="application" || docType == "case-management" || docType == "ecovernote" || docType == "policy"){
			// 		//  actionUrl = commonService.getUrl(commonService.urlMap.MODULE_VALIDATE_AND_SAVE, [docType, productType ]);
			// 	 // }else if(docType == "factfind"){
			// 		//  actionUrl = commonService.getUrl(commonService.urlMap.DOCUMENT_VALIDATE_AND_SAVE_WITH_STATUS, [docType, "COMPLETED"]);
			// 	 // }else{
			// 		//  actionUrl = commonService.getUrl(commonService.urlMap.DOCUMENT_VALIDATE_AND_SAVE, [docType ]);
			// 	 // }
				 
			// 	 actionUrl = commonService.getUrl(commonService.urlMap.DOCUMENT_VALIDATE_AND_SAVE, [docType, productType, businessStatus, transactionType]);
			//  } else {
			// 	 // //if(docType == "illustration" || docType == "claim-notification" || docType=="application"  || docType == "case-management"){
			// 	 // if(docType == "illustration" || docType=="application"  || docType == "case-management" || docType == "ecovernote" || docType == "policy"){
			// 		//  actionUrl = commonService.getUrl(commonService.urlMap.MODULE_SAVE, [docType, productType ]);	
			// 	 // }else{
			// 		//  actionUrl = commonService.getUrl(commonService.urlMap.DOCUMENT_SAVE, [docType ]);	
			// 	 // }
			// 	 actionUrl = commonService.getUrl(commonService.urlMap.DOCUMENT_SAVE, [docType, productType, transactionType ]);
			//  }
			//  return actionUrl;
		 // };
		 
		 
		 //tphan37: comment out when integrating UI_Framework to iOS HTML5
		 // ListDetailCoreService.prototype.getDocumentUpdate_V3 = function(bolValidate,docType,productType,docId){
			//  var actionUrl = undefined;
			//  var transactionType = this.getCaseTransactionType();
			//  if (transactionType === "ENDORSEMENT") transactionType = "Endorsement";
			//  if (docType == "underwriting2" && productType != "GTL1") {
			// 	 productType = undefined;
			//  }
			//  if (bolValidate == true) {
			// 	 // if(docType == "illustration" || docType == "claim-notification" || docType=="application" || docType == "case-management"
			// 		//  || docType == "policy" || docType == "ecovernote" || docType == "underwriting" || (docType == "underwriting2" && productType == "GTL1")
			// 		//  || (productType == "GTL1" && docType == "manager-review") || (productType == "GTL1" && docType == "group-department"|| docType == "death-claim-registration")){
			// 		//  actionUrl = commonService.getUrl(commonService.urlMap.MODULE_VALIDATE_AND_UPDATE, [docType, docId, productType ]);
			// 	 // }else{
			// 		//  actionUrl = commonService.getUrl(commonService.urlMap.DOCUMENT_VALIDATE_AND_UPDATE, [docType, docId ]);
			// 	 // }	 
			// 	 actionUrl = commonService.getUrl(commonService.urlMap.DOCUMENT_VALIDATE_AND_UPDATE, [docType, docId, productType, transactionType]);
			//  } else {
			// 	 // if(docType == "illustration" || docType == "claim-notification" || docType=="application" || docType == "case-management"
			// 		//  || docType == "policy" || docType == "ecovernote" || docType == "underwriting" || (docType == "underwriting2" && productType == "GTL1")
			// 		//  || (productType == "GTL1" && docType == "manager-review") || (productType == "GTL1" && docType == "group-department")|| docType == "death-claim-registration"){
			// 		//  actionUrl = commonService.getUrl(commonService.urlMap.MODULE_UPDATE, [docType, docId, productType]);	
			// 	 // }
			// 	 // else{
			// 		//  actionUrl = commonService.getUrl(commonService.urlMap.DOCUMENT_UPDATE, [docType, docId ]);
			// 	 // }
			// 	 actionUrl = commonService.getUrl(commonService.urlMap.DOCUMENT_UPDATE, [docType, docId, productType, transactionType ]);
			//  }
			//  return actionUrl;
		 // };

		  /**
		  * Return the right action use for saving
		  * @param  {boolean} bolValidate need validate or not	
		  */
		 ListDetailCoreService.prototype.getActionSave = function(bolValidate){
			 var actionName;
			 if (bolValidate) {				 
				 actionName = "DOCUMENT_VALIDATE_AND_SAVE";
			 } else {
				 actionName = "DOCUMENT_SAVE";
			 }
			 return actionName;
		 };

		 /**
		  * @author tphan37
		  * date: 21-Apr-16
		  * Return the right action use for update
		  * @param  {boolean} bolValidate need validate or not	
		  */
		 ListDetailCoreService.prototype.getActionUpdate = function(bolValidate,docType,productType,docId){
			 var actionName;
			 if (bolValidate) {
				 actionName = "DOCUMENT_VALIDATE_AND_UPDATE";
			 } else {
				 actionName = "DOCUMENT_UPDATE";
			 }
			 return actionName;
		 };
		 
		 ListDetailCoreService.prototype.checkPaymentStatus= function(status){

			 if (status=="PENDING"){
				 //return "card";
			 }
			 else if (status=="PAID") {
				 return "success-card";
			 }
			 else if (status == "FAILED"){
				 return "failure-card";
			 }
		 };
		 
		 ListDetailCoreService.prototype.loadDocumentList = function(resourceURL,query){
				var self = this;
				var deferred = $q.defer();
				

				var url = commonService.getUrl(commonService.urlMap.DOCUMENT_SEARCH_ALL_V3);
				
	

				 self.ajax.getRuntime(resourceURL, url, function(data){
					 deferred.resolve(data);						
				 });
				return  deferred.promise;
			};
		 /**
		  * Re-update the JavaScript object & UI of items
		  */
		 ListDetailCoreService.prototype.refreshItemInList = function(metaDataUid, fnSuccess){
			 var self = this;
			 //update illustration list (meta-data)
			 self.ajax.get(self.name + "/metadata/" + metaDataUid).success(function(metadata){
				 if (commonService.hasValue(self.items)) {
					 var ifound = -1;
					 for ( var i = 0; i < self.items.length; i++) {
						 var item = self.items[i];
						 if (item.uid == metaDataUid){
							 ifound = i;
							 break;
						 }
					 }			
					 if (ifound == -1) {//add new
						 self.items.splice(0,0,metadata);
					 }else{//update
						 // Move updated item to the first index of list, because this list sorts by updated date
						 self.items.splice(ifound,1);
						 self.items.splice(0,0,metadata);
					 }
				 }
				 if (fnSuccess !== undefined){
					 fnSuccess.call(this, metadata);
				 }
			 });	
		 };

		 ListDetailCoreService.prototype.prepareList = function(moduleName, fnSuccess, contextUserUid, lastUpdatedFlag){
			 var self = this;
			 self.cacheService.getItems(moduleName, commonService.CONSTANTS.DOCTYPE.METADATA, function(list){
				 if (fnSuccess !== undefined){
					 fnSuccess.call(self, list);
				 }
			 }, contextUserUid, lastUpdatedFlag);
		 };

		ListDetailCoreService.prototype.clearCache = function(){
			var self = this;
			self.cacheService.removeItems();
		};
	
		 /**
		  * Get prospect list from cache if there's exits such a list. If not, 
		  * retrieve list from server then store in cache, execute callback function if success
		  * @param {Object} fnSuccess function to call if success
		  */
		 ListDetailCoreService.prototype.prepareListHome = function(fnSuccess, contextUserUid){
			 var self = this;
			 self.cacheService.loadItems(commonService.CONSTANTS.MODULE_NAME.HOME, commonService.CONSTANTS.DOCTYPE.METADATA, function(list){
				 if (fnSuccess !== undefined){
					 fnSuccess.call(self, list);
				 }
			 }, contextUserUid);
		 };

		 /**
		  * Return prospect list from cache if any
		  * @returns Prospect list from cache
		  */
		 ListDetailCoreService.prototype.getProspects = function(){
			 var self = this;
			 var rs = self.cacheService.items[commonService.CONSTANTS.DOCTYPE.METADATA].get(commonService.CONSTANTS.MODULE_NAME.PROSPECT);
			 return rs;
		 };


		 /**
		  * Change prospect reference of a document from old personUid to a new personUid 
		  * @param {Number|String} [oldPersonUid="null"] uid of old person
		  * @param {Number|String} newPersonUid uid of new person
		  * @returns {promise}
		  * <dl>
		  * <dt>Resolved with:</dt>
		  * <dd>detail of current document</dd>
		  * <dt>Rejected with:</dt>
		  * <dd>not defined</dd>	
		  * </dl>
		  */
		 ListDetailCoreService.prototype.changeProspect = function(prospectType, oldPersonUid, newPersonUid){
			 var self = this;
			 var deferred = self.$q.defer();

			 if (!commonService.hasValueNotEmpty(newPersonUid)) deferred.reject();

			 if (!commonService.hasValueNotEmpty(oldPersonUid)) oldPersonUid = "null";
			 //var url = self.name + "/refType/" + prospectType + "/update/"+ oldPersonUid + "/" + newPersonUid;
			 var url = commonService.getUrl(commonService.urlMap.PROSPECT_CHANGE, [ self.name,
			                                                                        prospectType, oldPersonUid, newPersonUid ]);
			 var dataSet = self.extractUiDataSet(self.detail);
			 self.ajax.post(url, dataSet).success(function(detailDto){
				 //update detail
				 //self.detail = detailDto;
				 self.mergeElement(detailDto, self.detail);
				 deferred.resolve(detailDto);
			 });
			 return  deferred.promise;
		 };

		 /**
		  * Load list of subordinates items from server and execute callback function if success
		  * @param {Object} fnSuccess function to execute if success
		  */
		 ListDetailCoreService.prototype.listSubordinatesItems = function(fnSuccess){
			 var self = this;
			 //var url = self.name + "/subordinates/list";
			 var url = commonService.getUrl(commonService.urlMap.SUBORDINATES_LIST, [ self.name]);
			 self.ajax.get(url).success(function(data){
				 //		self.items = data;
				 self.subordinatesItems = data;
				 if(commonService.hasValue(fnSuccess)) fnSuccess.call(self);
			 });	
		 };

		 /**
		  * This function is used for ui only. Place it here just for not duplicate only
		  * This function doesn't support "product" module
		  * TODO Need to review to move up concisely
		  * @param subordinateFlg if true, getting items for a subordinate list
		  */
		 ListDetailCoreService.prototype.showItems = function(fnSuccess, subordinateUid){
			 var self = this;
			 /*TODO 
			  * 	This list maybe need to be authorized
			  *	Depend on self.bolViewItemsOfSubUsers, the list can be change
			  */
			 self.cacheService.getItems(self.name, commonService.CONSTANTS.DOCTYPE.METADATA, function(data){
				 self.items = data;
				 if(commonService.hasValue(fnSuccess)) fnSuccess.call(self, data);
			 }, subordinateUid, false);
		 };

		 /**
		  * This function is used to update items which were updated last 5 mins, to cache. If 
		  * need to update all items, use method refreshAllItems instead.
		  * This function doesn't support "product" module
		  * TODO Need to review to move up concisely
		  * @param Flg if true, loading update items for a subordinate list
		  */
		 ListDetailCoreService.prototype.showLastUpdatedItems = function(fnSuccess){
			 var self = this;
			 /*TODO 
			  * 	This list maybe need to be authorized
			  *	Depend on self.bolViewItemsOfSubUsers, the list can be change
			  */
			 self.cacheService.syncLastUpdatedItems(self.name, commonService.CONSTANTS.DOCTYPE.METADATA, function(data){
				 self.items = data;
				 if(commonService.hasValue(fnSuccess)) fnSuccess.call(self, data);
			 });
		 };

		 /**
		  * Refresh the whole metadata list of a module in cache. 
		  * This function doesn't support "product" module
		  * @returns
		  */
		 ListDetailCoreService.prototype.refreshAllItems = function(fnSuccess){
			 var self = this;
			 var deferred = self.$q.defer();
			 self.cacheService.loadItems(self.name, commonService.CONSTANTS.DOCTYPE.METADATA, function(data){
				 self.items = data;
				 deferred.resolve(data);
			 });
			 return  deferred.promise;
		 };

		 //UPDATE DATA //////////////////////////////////////////////////////////////////////////////////////////////////////
		 /**
		  * Update detail for the current moduleService
		  * @param {Object} data detail to update
		  */
		 ListDetailCoreService.prototype.updateDetailData = function(data){
			 var self = this;
			 self.detail = data;
			 self.updateExtraDetail();
		 };
		 
		 /**
		  * Update detail for the current moduleService
		  * @param {Object} data detail to update
		  */
		 ListDetailCoreService.prototype.updateDetailData_V3 = function(data){
			 var self = this;
			 self.findElementInDetail_V3(['Header'])['DocInfo'] = self.findElementInElement_V3(data, ['DocInfo']);
			 self.findElementInDetail_V3(['Header'])['DocAccessControllList'] = self.findElementInElement_V3(data, ['DocAccessControllList']);
			 self.findElementInDetail_V3(['Header'])['DocStatus'] = self.findElementInElement_V3(data, ['DocStatus']);
			 self.originalDetail = angular.copy(self.detail);
			 self.updateExtraDetail();
		 };
		 
		 /**
		  * @author nnguyen75
		  * Check calling gateway runtime result
		  * @param data
		  * @returns {Boolean}
		  */
		 ListDetailCoreService.prototype.isSuccess = function(data) {
			 var self = this;
			 if (commonService.hasValueNotEmpty(self.findElementInElement_V3(data, ['IposDocument'])) || 
					 commonService.hasValueNotEmpty(self.findElementInElement_V3(data,['POLICY']))) {
				 return true;
			 } else {
				 return false;
			 }
		 };
		 
		 /**
		  * @author nnguyen75
		  * 2016.06.30
		  * Loop through all objects in list and remove object which has all empty values in all key/value pairs
		  * @param data
		  * @returns data
		  */
		 ListDetailCoreService.prototype.removeAllEmptyJSONObjectOfList = function(data) {
			 var self = this;
			 for (var i = 0; i < data.length; i++) {
				 var hasAllEmptyKey = true;
				 for (var key in data[i]) {
					 if (commonService.hasValueNotEmpty(data[i][key])) {
						 hasAllEmptyKey = false;
						 break;
					 }
				 };
				 if (hasAllEmptyKey) {
					 data.splice(i, 1);
					 i--;
				 };
			 };
			 
			 return data;
		 };

		 ListDetailCoreService.prototype.useCurrentDetailDataAsOriginal = function(){
			 var self = this;
			 self.originalDetail = angular.copy(self.detail);
		 };

		 /**
		  * This method acts as an abstract method, don't delete it.
		  * This method acts as an abstract method, don't delete it. 
		  * Other services (e.g. IllustrationService) may need to override this method.  
		  */
		 ListDetailCoreService.prototype.updateExtraDetail = function(){
		 };

		 /**
		  * @param 
		  */
		 ListDetailCoreService.prototype.updateSavedDetailData = function(dataSet){
			 var self = this;
			 self.detail.uid = dataSet.uid;
			 self.detail.ownerUid = dataSet.ownerUid;
			 self.detail.updatedUserUid = dataSet.updatedUserUid;
			 self.detail.createdDate = dataSet.createdDate;
			 self.detail.updatedDate = dataSet.updatedDate;

			 self.updateExtraDetail();
		 };

		 /**
		  * Please use getProductGroup_V3(productName) instead of this
		  */
//		 ListDetailCoreService.prototype.getProductGroup = function(productName){
//				var group = undefined;
//				if((productName.indexOf('term-life') > -1)|| (productName.indexOf('GTL') > -1)){
//					group = 'term-life';
//				}
//				if(productName.indexOf('motor') > -1){
//					group = 'motor';
//				}
//				if(productName.indexOf('FIR') > -1){
//					group = 'fire';
//				}
//				if(productName.indexOf('personal-accident') > -1){
//					group = 'personal-accident';
//				}
//				if(productName.indexOf('income-protection') > -1){
//					group = 'income-protection';
//				}
//				if(productName.indexOf('guaranteed-cashback-saver') > -1){
//					group = 'guaranteed-cashback-saver';
//				}
//				if(productName.indexOf('term-life-secure') > -1){
//					group = 'term-life-secure';
//				}
//				return group;
//		 };
		 
		 /**
		  * @author nnguyen75
		  * 2016.04.08
		  * Get docmap definitions and save to local storage for later use
		  */
		 ListDetailCoreService.prototype.getDocmapDefinitions = function(resourceURL) {
			 var self = this;
			 var deferred = self.$q.defer();
			 var runtimeURL = self.commonService.getUrl(self.commonService.urlMap.DOCUMENT_DOCMAP_DEFINITIONS, []);
			 connectService.exeAction({
			    	actionName: "DOCUMENT_DOCMAP_DEFINITIONS",
			    	actionParams: [],
			    	resourceURL: resourceURL
			    }).then(function(data){				    		
			 			localStorage.setItem("docmapDefinitions", JSON.stringify(data));
			 			deferred.resolve(data);
			    });

			/* self.ajax.getRuntime(resourceURL, runtimeURL, function(data) {
				 deferred.resolve(data);
				 localStorage.setItem("docmapDefinitions", JSON.stringify(data));
			 });*/
			 
			 return deferred.promise;
		 };
		 
		 /**
		  * @author nnguyen75
		  * 2016.04.08
		  * Get docmap definitions from local storage and return product group based on product name
		  * @param productName
		  * @return productGroup
		  */
		 ListDetailCoreService.prototype.getProductGroup_V3 = function(productName) {
			 var self = this;
			 var docmapDefinitions = JSON.parse(localStorage.getItem("docmapDefinitions"));
			 if (commonService.hasValueNotEmpty(docmapDefinitions)) {
				 // level 1: get all product line of businesses from docmap definitions
				 var productLineOfBusinesses = self.findElementInElement_V3(docmapDefinitions, ['docmapDefinition']);
				 if (commonService.hasValueNotEmpty(productLineOfBusinesses)) {
					 for (var i = 0; i < productLineOfBusinesses.length; i++) {
						 // level 2: get all product groups from product line of business
						 var productGroups = self.findElementInElement_V3(productLineOfBusinesses[i], ['docmapDefinition']);
						 if (commonService.hasValueNotEmpty(productGroups)) {
							 for (var j = 0; j < productGroups.length; j++) {
								 // for group product only (e.g.: GTL1,...) because it is not divided from product group into individual products
								 if (productGroups[j].doctype === productName) {
									 return productGroups[j].doctype;
								 }
								 // level 3: get all products from product group
								 var products = self.findElementInElement_V3(productGroups[j], ['docmapDefinition']);
								 if (commonService.hasValueNotEmpty(products)) {
									 for (var k = 0; k < products.length; k++) {
										 var product = products[k].doctype;
										 if (product === productName) {
											 var productGroup = productGroups[j].doctype;
											 return productGroup;
										 }
									 }
								 }
							 }
						 }
					 }
				 }
			 }
			 
			 return undefined;
		 };
		 
		 /**
		  * @author nnguyen75
		  * 2016.04.08
		  * Get docmap definitions from local storage and return product line of business (LoB) based on product name
		  * @param productName
		  * @return productLoB
		  */
		 ListDetailCoreService.prototype.getProductLineOfBusiness_V3 = function(productName) {
			 var self = this;
			 var docmapDefinitions = JSON.parse(localStorage.getItem("docmapDefinitions"));
			 if (commonService.hasValueNotEmpty(docmapDefinitions)) {
				 // level 1: get all product line of businesses from docmap definitions
				 var productLineOfBusinesses = self.findElementInElement_V3(docmapDefinitions, ['docmapDefinition']);
				 if (commonService.hasValueNotEmpty(productLineOfBusinesses)) {
					 for (var i = 0; i < productLineOfBusinesses.length; i++) {
						 // level 2: get all product groups from product line of business
						 var productGroups = self.findElementInElement_V3(productLineOfBusinesses[i], ['docmapDefinition']);
						 if (commonService.hasValueNotEmpty(productGroups)) {
							 for (var j = 0; j < productGroups.length; j++) {
								 // for group product only (e.g.: GTL1,...) because it is not divided from product group into individual products
								 if (productGroups[j].doctype === productName) {
									 return productLineOfBusinesses[i].doctype;
								 }
								 // level 3: get all products from product group
								 var products = self.findElementInElement_V3(productGroups[j], ['docmapDefinition']);
								 if (commonService.hasValueNotEmpty(products)) {
									 for (var k = 0; k < products.length; k++) {
										 var product = products[k].doctype;
										 if (product === productName) {
											 var productLoB = productLineOfBusinesses[i].doctype;
											 return productLoB;
										 }
									 }
								 }
							 }
						 }
					 }
				 }
			 }
			 
			 return undefined;
		 };
		 
		 /**
		  * @author nnguyen75
		  * 2016.06.03
		  * Process calling web service to sign document(s)
		  * @param portletId
		  * @param docType
		  * @param docId
		  * @return web service url to sign document(s)
		  */
		 ListDetailCoreService.prototype.signDocument = function(readerService, card, uiService) {
			 var signed = sessionStorage.getItem("signed");
			 if(signed == "Y"){
				 uiService.showNotifyMessage("v3.mynewworkspace.message.document.print.AlreadySigned","success");
				 return;
			 }
			 var self = this;
				 var deferred = $q.defer();
				 var portletId = readerService.portletId;
				 var resourceURL = self.initialMethodPortletURL(portletId, "signDocument");
				 var docType = readerService.docType;
				 var product = self.findElementInDetail_V3(['Product']);
				 var docId = readerService.docId;
				 var fileName = readerService.fileName;
				 var fileDesc = readerService.fileDesc;
				 self.resourceType = self.findElementInElement_V3(readerService, ["ResourceType"]);
				 var esignatureHostResources = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '');
				 var iPosHost = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '')+location.pathname;
				 if (commonService.hasValueNotEmpty(docType)) {
					 if (fileName.startsWith("QT")) {
						 docType = commonService.CONSTANTS.MODULE_NAME.ILLUSTRATION;
					 } else if (fileName.startsWith("UQ")) {
						 docType = commonService.CONSTANTS.MODULE_NAME.UQ_ILLUSTRATION;
					 } else if (fileName.startsWith("AP")) {
						 docType = commonService.CONSTANTS.MODULE_NAME.APPLICATION;
					 }else if (fileName.startsWith("Agent")) {
						 docType = commonService.CONSTANTS.MODULE_NAME.AGENT_DISCLAIMER;
					 } else if (fileName.startsWith("Customer")) {
						 docType = commonService.CONSTANTS.MODULE_NAME.CUSTOMER_DECLARATION;
					 } else if (fileName.startsWith("PDPA")) {
						 docType = commonService.CONSTANTS.MODULE_NAME.PDPA;
						 product = "";
					 }
				 	 resourceURL.setParameter("docType", docType);
				 };
				 if (commonService.hasValueNotEmpty(product)) {
					 resourceURL.setParameter("product", product);
				 }
				 if (commonService.hasValueNotEmpty(docId)) {
					 resourceURL.setParameter("pdfId", docId);
				 }
				 if (commonService.hasValueNotEmpty(fileName)) {
					 resourceURL.setParameter("fileName", fileName);
				 }
				 if (commonService.hasValueNotEmpty(fileDesc)) {
					 resourceURL.setParameter("fileDesc", fileDesc);
				 }
				 resourceURL.setParameter("runOnTablet", JSON.stringify(self.isRunOnTablet()));
				 resourceURL.setParameter("iPosHost", iPosHost);
				 resourceURL.setParameter("esignatureHostResources", esignatureHostResources);
				 var initFile = {name: "", desc: "", data: "", size: "", type: "", validate: ""};
				 getFileReader(readerService.file, initFile).then(function(f) {
					 var fileData =  f.data.split(',')[1];
					 ajax.postRuntime(resourceURL.toString(), "", fileData, function(result) {
						 deferred.resolve(result);
						 result = JSON.parse(result);
						 var url = result;
						 var runOnTablet = self.isRunOnTablet();
						 if(runOnTablet){
							 result = JSON.parse(result);
							 url = result.url;
						 }
						 
						 var docId = self.findElementInDetail_V3(['DocId']);
						 var docType = self.findElementInDetail_V3(['DocType']);
						 var product = self.findElementInDetail_V3(['Product']);
						 var businessType = self.findElementInDetail_V3(['@case-name']);
						 var caseLoading = false;
						 var caseData = JSON.stringify({DocType: docType, DocId: docId, Product: product, CaseName: businessType, ResourceType: self.resourceType, RunOnTablet: runOnTablet, CaseLoading: caseLoading});
						 
						 var params={};url.replace(/[?&]+([^=&]+)=([^&]*)/gi,function(str,key,value){params[key.toLowerCase()] = value;});
						 var workstepID = params["workstepid"];
						 if (commonService.hasValueNotEmpty(workstepID)){
							 var caseId = workstepID;
							 localStorage.setItem(caseId, caseData);
						 }
						 //open xyzmo
						 if(runOnTablet){
							 result = result.invoke;
//							 var now = new Date().valueOf();
//							 setTimeout(function(){
//								 if (new Date().valueOf() - now > 6000) return;
//								 var win = window.open(url, '_blank');//play store URL.
//								 win.focus();
//							 },4000);
						 }
						 window.location = result;
					 });
				 });
				 
				 return deferred.promise;
		 };
		 
		 function getFileReader(file, initFile) {
			 var self = this;
			 var deferred = $q.defer();
			 var reader = new FileReader();
			 reader.onload = (function (file) {
				 return function (e) {
					 var f = angular.copy(initFile);
					 f.data = e.target.result;
					 f.name = file.name;
					 f.desc = file.name;
					 f.size = file.size;
					 f.type = file.type;
					 deferred.resolve(f);
				 };
			 })(file);
			 reader.readAsDataURL(file);
			 return deferred.promise;
		 };
		 
		 ListDetailCoreService.prototype.isRunOnTablet = function() {
			 var isRunOnTablet = (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
					 || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4)));
			 return isRunOnTablet;
		 };
		 
		 ListDetailCoreService.prototype.signDocumentOnMobileApp = function(item, caseID) {
			 var self = this;
			 var deferred = $q.defer();
			 var docId = item.DocId;
			 var fileName = item.FileName;
			 var fileDesc = item.Name;
			 var caseId = caseID;
			 connectService.exeAction({
				 actionName: "SIGN_PDF",
				 actionParams: [docId, caseId, fileName, fileDesc]
		     }).then(function(data){
		    	 /*connectService.exeAction({
	    			 actionName: "SIGN_PDF",
	    			 actionParams: [docId, caseId, fileName, fileDesc]
    		     }).then(function(){
    		    	 $log.debug('sign pdf');
    		     });*/
    		     deferred.resolve(data);

		     });
			 
			 return deferred.promise;
		 };
		 
		 ListDetailCoreService.prototype.resetModel = function(){
			 var self = this;
			 self.detail = angular.copy(self.originalDetail);
		 };
		 ListDetailCoreService.prototype.isModelLoaded = function(){
			 var self = this;
			 return (self.detail !== undefined);
		 };

		 //DETAIL: SAVED AND CHANGED //////////////////////////////////////////////////////////////////////////////////////////
		 /**
		  * @returns {Boolean} return true if the current user can edit the detail
		  */
		 ListDetailCoreService.prototype.checkEditPermission = function(){
			 var self = this;
			 return (self.detail !== undefined 
					 && (!commonService.hasValueNotEmpty(self.detail.ownerUid) || this.appService.getUserUid() == this.detail.ownerUid));
		 };

		 /**
		  * In the future, we also have to check the validation result.
		  */
		 //TODO need to check role (authorization)
		 /**
		  * Check to see can save detail or not
		  */
		 ListDetailCoreService.prototype.isDisableSave = function(){
			 var self = this;
			 var hasEditPermission = self.checkEditPermission();
			 var rs = !hasEditPermission || !(hasEditPermission && self.isModelChanged());
			 return rs;
		 };

		 /**
		  * Check whether this detail/element is editable or not
		  * if param2 is provided: param1 is parent element, param2 is elements name chain
		  * else param1 is elements name chain 
		  * @returns {Boolean}
		  */
		 ListDetailCoreService.prototype.isDisabled = function(param1, param2){
			 var self = this;
			 var editable = 1;
			 if(param2 != undefined){
				 if(param1 != undefined){
					 editable = self.findPropertyInElement(param1, param2,'editable').value;
				 }
			 }else{
				 if(param1 != undefined){
					 editable = self.findPropertyInDetail(param1, 'editable').value;
				 }
			 }
			 if(editable == 0) return true;
			 var hasEditPermission = this.checkEditPermission();
			 return !hasEditPermission;
		 };

		
		 ListDetailCoreService.prototype.isDisabledEvent = function(){
		 var self = this;
		 (angular.equals(self.detail, self.originalDetail)) ? self.disabledMode = true: self.disabledMode = false;	 
		 };

		 ListDetailCoreService.prototype.isModelChanged = function(){
			 var self = this;
			 var rs = (self.detail == undefined || self.originalDetail == undefined) ? 
					 false : !(angular.equals(self.extractUiDataSet(angular.copy(self.detail)), self.extractUiDataSet(angular.copy(self.originalDetail))));
			 return rs;
		 };

		 // FULL NAME ////////////////////////////////////////////////////////////////////////////
		 // TODO we should use the shorter way to do this.
		 ListDetailCoreService.prototype.getProspectFullNameInDetail = function() {

			 /*var self = this;
		var firstName = '';
		var middleName = '';
		var lastName = '';
		firstName = self.findPropertyInDetail(['firstname'],'value').value;
		middleName = self.findPropertyInDetail(['middlename'],'value').value;
		lastName = self.findPropertyInDetail(['lastname'],'value').value;

		var fullname = commonService.buildFullName(null, firstName, middleName, lastName);
		return fullname;*/
			 return this.findPropertyInDetail(['fullname'],'value').value;
		 };

		 ListDetailCoreService.prototype.getMetaFullName = function(element) {
			 return this._findProperty(element, 'fullname').value;
		 };


		 ListDetailCoreService.prototype.getAgentIdOfUser = function(element) {
			 var self = this;
			 var eleFound = self._findElement(element, "User");
			 var agentid = self._findProperty(eleFound, "agentid");
			 if (agentid.value != undefined && agentid.value != "null") {
				 return agentid.value;
			 }
			 return "";
		 };

		 ListDetailCoreService.prototype.getManagerCodeOfUser = function(element) {
			 var self = this;
			 var eleFound = self._findElement(element, "manager");
			 var managerCode = self._findProperty(eleFound, "code");
			 if (managerCode.value != undefined && managerCode.value != "null") {
				 return managerCode.value;
			 }
			 return "";
		 };

		 ListDetailCoreService.prototype.getUsernameOfUser = function(element) {
			 var self = this;
			 var elementsChain = ['User'];
			 var ele = element;
			 for ( var i = 0; i < elementsChain.length; i++) {
				 if(elementsChain[i]){
					 var eleName = elementsChain[i];
					 var eleFound = self._findElement(ele,eleName);
					 var username = self._findProperty(eleFound, "username");
					 return username.value;
				 }
			 }	
			 return "";
		 };

		 ListDetailCoreService.prototype.getAgentIdAndAgentNameOfUser = function(element) {
			 var result = " - ";
			 var self = this;
			 var ele = element;

			 var eleFound = self._findElement(ele, "User");
			 var agentName = self._findProperty(eleFound, "agentName");
			 if (agentName.value != undefined) {
				 result = agentName.value + result;
			 }

			 var agentid = self._findProperty(eleFound, "agentid");
			 if (agentid.value != undefined) {
				 result = result + agentid.value;
			 }

			 return result;
		 };

		 ListDetailCoreService.prototype.getEffectiveDateOfUser = function(element) {
			 var result = "";
			 var self = this;
			 var ele = element;

			 var eleFound = self._findElement(ele, "User");
			 var effectiveDate = self._findProperty(eleFound, "effectiveDate");
			 if (effectiveDate.value != undefined) {
				 result = effectiveDate.value;
			 }
			 return result;
		 };

		 ListDetailCoreService.prototype.getStatusOfUser = function(element) {
			 var self = this;
			 var elementsChain = ['User'];
			 var ele = element;
			 for ( var i = 0; i < elementsChain.length; i++) {
				 var eleName = elementsChain[i];
				 var eleFound = self._findElement(ele,eleName);
				 var status = self._findProperty(eleFound, "status");
				 if (status.value != undefined && status.value != "null") {
					 return status.value;
				 }
			 }	
			 return "";
		 };

		 ListDetailCoreService.prototype.getRolesOfUser = function(element) {
			 var self = this;

			 var roles = [];
			 var rolesElement = self._findElement(element, "roles");
			 var roleElements = rolesElement.elements;
			 if (roleElements === undefined) {
				 return roles;
			 }

			 for (var i=0; i<roleElements.length; i++) {
				 roles.push(self._findProperty(roleElements[i], "value").value);
			 }

			 return roles;
		 };

		 ListDetailCoreService.prototype.userHasRole = function(element, role) {
			 var self = this;
			 var hasRole = false;
			 var roles = self.getRolesOfUser(element);

			 for (var i=0; i<roles.length; i++) {
				 if (roles[i] == role) {
					 return true;
				 }
			 }

			 return hasRole;
		 };

		 ListDetailCoreService.prototype.getRolesOfUserAsString = function(element) {
			 var self = this;

			 var rolesAsString = "";

			 var roles = self.getRolesOfUser(element);

			 for (var i=0; i<roles.length; i++) {
				 if (i==0) {
					 rolesAsString = roles[i];
				 } else {
					 rolesAsString = rolesAsString + ", " + roles[i];
				 }
			 }

			 return rolesAsString;
		 };

		 ListDetailCoreService.prototype.getFullnameOfUser = function(element) {
			 var result = "";
			 var self = this;
			 var ele = element;

			 var eleFound = self._findElement(ele, "User");
			 var agentName = self._findProperty(eleFound, "agentName");
			 if (agentName.value != undefined) {
				 result = agentName.value + result;
			 }

			 return result;
		 };

		 ListDetailCoreService.prototype.getMetaGender = function(element) {
			 return this._findProperty(element, 'gender').value;
		 };

		 ListDetailCoreService.prototype.getMetaBirthDate = function(element) {
			 return this._findProperty(element, 'birthDate').value;
		 };

		 ListDetailCoreService.prototype.getMetaOccupation = function(element) {
			 return this._findProperty(element, 'occupation').value;
		 };

		 ListDetailCoreService.prototype.getMetaIdNo = function(element) {
			 return this._findProperty(element, 'idNumber').value;
		 };
		 /* Application module */
		 ListDetailCoreService.prototype.getMetaProductName = function(element) {
			 return this._findProperty(element, 'biProductName').value;
		 };

		 ListDetailCoreService.prototype.getMetaPOName = function(element) {
			 return this._findProperty(element, 'policyOwner_fullname').value;
		 };

		 ListDetailCoreService.prototype.getMetaPOIdNumber = function(element) {
			 return this._findProperty(element, 'policyOwner_idNumber').value;
		 };

		 ListDetailCoreService.prototype.getMetaLIName = function(element) {
			 return this._findProperty(element, 'lifeAssured_fullname').value;
		 };

		 ListDetailCoreService.prototype.getMetaLIIdNumber = function(element) {
			 return this._findProperty(element, 'lifeAssured_idNumber').value;
		 };
		 /* Payment module */
		 ListDetailCoreService.prototype.getMetaPaymentSatus = function(element) {
			 return this._findProperty(element, 'Payment_Status').value;
		 };
		 ListDetailCoreService.prototype.getMetaiPOSRefNumber = function(element) {
			 return this._findProperty(element, 'iPOS_Reference_Number').value;
		 };
		 ListDetailCoreService.prototype.getMetaPaymentDate = function(element) {
			 return this._findProperty(element, 'Payment_Date').value;
		 };
		 ListDetailCoreService.prototype.getMetaPaymentMethod = function(element) {
			 return this._findProperty(element, 'Payment_Method').value;
		 };
		 ListDetailCoreService.prototype.getMetaName = function(item) {
			 var rs = '';
			 if (commonService.hasValue(item) && commonService.hasValue(item.name)) {
				 rs = item.name;
			 }		
			 return rs;
		 };

		 ListDetailCoreService.prototype.isStarredObject = function(element) {
			 if (element.tags != undefined && element.tags.indexOf('STARRED') >= 0){
				 return true;
			 }
			 return false;
		 };

		 ListDetailCoreService.prototype.isInvalidObject = function(element) {
			 // the object is invalid if its attribute "errormessages" (in iposDocument) is not empty
			 if (commonService.hasValueNotEmpty(element.errorMessages)) {
				 return true;
			 }
			 return false;
		 };

		 //Move from illustration/factfind to here
		 ListDetailCoreService.prototype.getMetaProspectFullName = function(illustrationMetaData){
			 var self = this;
			 //Reflect new change in prospect data structure
			 var rs = self.getMetaFullNameByProperties(illustrationMetaData, '', 'policyOwner_fullname', '', '');
			 return rs;
		 };
		 ListDetailCoreService.prototype.getMetaPolicyOwnerFullName = function(
				 illustrationMetaData) {
			 var self = this;
			 //Reflect new change in prospect data structure
			 var rs = self.getMetaFullNameByProperties(illustrationMetaData, '', 'policyOwner_fullname', '', '');
			 return rs;
		 };
		 ListDetailCoreService.prototype.getMetaProperty = function(element, property) {
			 return this._findProperty(element, property).value;
		 };
		 ListDetailCoreService.prototype.getMetaPolicyOwnerBirthDate = function(element) {
			 return this._findProperty(element, 'policyOwner_birthDate').value;
		 };
		 ListDetailCoreService.prototype.getMetaPolicyOwnerGender = function(element) {
			 return this._findProperty(element, 'policyOwner_gender').value;
		 };
		 ListDetailCoreService.prototype.getMetaFullNameByProperties = function(element,
				 titlePropName, firstNamePropName, midNamePropName, lastNamePropName) {
			 var self = this;
			 var title = '';
			 if (commonService.hasValueNotEmpty(titlePropName)) {
				 var propTitle = self._findProperty(element, titlePropName);
				 if (commonService.hasValueNotEmpty(propTitle))
					 title = propTitle.value;
			 }
			 var firstName = '';
			 if (commonService.hasValueNotEmpty(firstNamePropName)) {
				 var propFirstName = self._findProperty(element, firstNamePropName);
				 if (commonService.hasValueNotEmpty(propFirstName))
					 firstName = propFirstName.value;
			 }
			 var middleName = '';
			 if (commonService.hasValueNotEmpty(midNamePropName)) {
				 var propMiddleName = self._findProperty(element, midNamePropName);
				 if (commonService.hasValueNotEmpty(propMiddleName))
					 middleName = propMiddleName.value;
			 }
			 var lastName = '';
			 if (commonService.hasValueNotEmpty(lastNamePropName)) {
				 var propLastName = self._findProperty(element, lastNamePropName);
				 if (commonService.hasValueNotEmpty(propLastName))
					 lastName = propLastName.value;
			 }

			 var fullname = commonService.buildFullName(title, firstName, middleName, lastName);// import
			 // from
			 // common.js
			 return fullname;
		 };

		 ListDetailCoreService.prototype.getMandatoryText = function() {
			 return {
				 text : "*"
			 };
		 };

		 ListDetailCoreService.prototype.getModelDateFormat = function(item) {
			 /*var self = this;
			 if (item !== undefined) {
				 var dateFormat = item.dateFormat;
				 return commonService.convertToJquiDateFormat(dateFormat.toLowerCase());
			 } else if (self.detail !== undefined) {
				 var dateFormat = self.detail.dateFormat;
				 return commonService.convertToJquiDateFormat(dateFormat.toLowerCase());
			 }
			 return "";*/
			 return "yy-mm-dd";
		 };

		 ListDetailCoreService.prototype.getProductLogicName = function(element){
			 var self = this;
			 var productLogicNameProp = self._findProperty(element, "formName");
			 var rs = productLogicNameProp.value.toLowerCase();
			 return rs;
		 };

		 // READ PHOTO
		 // //////////////////////////////////////////////////////////////////////////////////////////////////////
		 /**
		  * Read photo in an item
		  * @param photoModule
		  *            to load photo of "prospect", "product", "factfind"...
		  * @param item item to read photo from           
		  * @param photoProperty
		  *            the property contain photo Uid
		  * @returns {String} URL of the photo
		  */
		 ListDetailCoreService.prototype.readMetaPhoto = function(photoModule, item,
				 photoProperty) {
			 var self = this;
			 var photoProp = self._findProperty(item, photoProperty);
			 try {
				 photoProp = self._findProperty(item, photoProperty);
			 } catch (error) {
				 var err = new IposError("Error when read photo from metaData", error);
				 err.param("photoModule", photoModule);
				 err.param("item", item);
				 err.param("photoProperty", photoProperty);
				 err.throwError();
			 }
			 var photoUid = undefined;
			 if (photoProp)
				 photoUid = photoProp.value;
			 return self._readPhoto(photoModule, photoUid);
		 };
		 ListDetailCoreService.prototype._readPhoto = function(photoModule, photoUid) {
			 var rs;
			 if (commonService.hasValueNotEmpty(photoUid)) {
				 rs = photoModule + "/resource/file/read/" + photoUid;
			 } else {
				 rs = "images/photo-default/photo-" + photoModule + "-medium.jpg";
			 }
			 return this.ajax.apiUrl + rs;
		 };

		 ListDetailCoreService.prototype.readPhotoInElement = function(parent, photoModule, photoElementsChain){
			 var self = this;
			 var photoProp;
			 try{
				 photoProp = self.findPropertyInElement(parent, photoElementsChain, 'value');
			 }catch(error){
				 throw "ERROR: readPhotoOfSelectedItem('"+photoModule+"','"+photoElementsChain+"')";
			 }
			 var photoUid = undefined;
			 if (photoProp) photoUid = photoProp.value;
			 return self._readPhoto(photoModule, photoUid);
		 };

		 ListDetailCoreService.prototype.readPhotoInDetail = function(photoModule, photoElementsChain, photoPropName){
			 var self = this;
			 if (!commonService.hasValueNotEmpty(photoPropName)) photoPropName = "value";
			 var photoProp;
			 if (commonService.hasValueNotEmpty(photoElementsChain)){
				 photoProp = self.findPropertyInDetail(photoElementsChain, photoPropName);
			 }else{
				 photoProp = self._findProperty(self.detail, photoPropName);
			 }
			 var photoUid = undefined;
			 if (photoProp) photoUid = photoProp.value;
			 return self._readPhoto(photoModule, photoUid);
		 };

		 //OPEN FILE /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		 //ListDetailCoreService.prototype.openResourceFile = function(resourceUid){
		 //	var self = this;
		 //	var url = self.module+"/resource/file/read/"+resourceUid;
		 //	self.openFile(url);
		 //};
		 /**
		  * @param url this is the url to server side
		  */
		 ListDetailCoreService.prototype.openFile = function(url){
			 var self = this;
			 var height = $(window).height();
			 var width = $(window).width();
			 var absUrl = self.ajax.apiUrl + url;
			 commonService.showWindow(absUrl, false, true, false, false, false, false, false, true, true, width, height, 0, 0);
		 };

		 ListDetailCoreService.prototype.isSaved = function(){
			 var self = this;
			 var rs = false;
			 if (self.detail){
				 rs = commonService.hasValueNotEmpty(self.detail.uid);
			 }
			 return rs && self.checkEditPermission();
		 };

		 ListDetailCoreService.prototype.loadIndividualMetadata = function(module, uId, uiNonBlock) {
			 var self = this;
			 var dataUrl = commonService.getUrl(self.commonService.urlMap.INDIVIDUAL_METADATA, [module, uId]);
			 self.bolFinishLoading = false;
			 var deferred = self.$q.defer();

			 self.ajax.get(dataUrl, uiNonBlock).success(function(data) {
				 self.bolFinishLoading = true;
				 deferred.resolve(data);
				 if (self.wsteps){
					 self.updateStepsStatus();
				 }
			 });
			 return  deferred.promise;
		 };

		 ListDetailCoreService.prototype.loadUserMetadata = function(module, userid, uiNonBlock) {
			 var self = this;
			 var dataUrl = commonService.getUrl(self.commonService.urlMap.USER_METADATA, [module, userid]);
			 self.bolFinishLoading = false;
			 var deferred = self.$q.defer();

			 self.ajax.get(dataUrl, uiNonBlock).success(function(data) {
				 self.bolFinishLoading = true;
				 deferred.resolve(data);
			 });
			 return  deferred.promise;
		 };
		 
		 ListDetailCoreService.prototype.loadReviewerMetadata = function(module, userid) {
			var self = this;
			var dataUrl = commonService.getUrl(self.commonService.urlMap.REVIEWER_METADATA_LIST, [module, userid]);
			self.bolFinishLoading = false;
			var deferred = self.$q.defer();

			self.ajax.get(dataUrl).success(function(data) {
				self.bolFinishLoading = true;
				deferred.resolve(data);
			});
			return deferred.promise;
		 };

		 ListDetailCoreService.prototype.updateReviewers = function(module, salecaseUid, reviewers){
			var self = this;
			var deferred = self.$q.defer();
			
			if (!commonService.hasValueNotEmpty(salecaseUid)) deferred.reject();
				
			var url = commonService.getUrl(commonService.urlMap.REVIEWER_LIST_UPDATE, [ module, salecaseUid ]);
			self.ajax.post(url, reviewers).success(function(data){
				self.bolFinishLoading = true;
				deferred.resolve(data);
			});
			return deferred.promise;
		 };

		 ListDetailCoreService.prototype.loadDocument = function (uid){
			 var self = this;	 
			 var deferred = self.$q.defer();
			 var dataUrl = self.commonService.getUrl(self.commonService.urlMap.DOCUMENT_EDIT, [ self.name, uid ]);

			 self.ajax.get(dataUrl).success(function(data) {
				 deferred.resolve(data);
			 });
			 return  deferred.promise;
		 };

		 /**
		  * Preload PDF document to sign in SDWeb
		  * @param docUid UID of IposDocument
		  * @param pdfID ID of PDF file
		  * @param userRole Role of user
		  * @param resultURL Callback URL will be called
		  * @returns Deferred
		  */
		 ListDetailCoreService.prototype.preloadDocument = function(docUid, pdfID, runOnTablet, isSafari, resultURL) {
			 var self = this;
			 var deferred = $q.defer();
			 var url = commonService.getUrl(commonService.urlMap.SIGN_PDF_DOCUMENT, [self.name, docUid, pdfID, runOnTablet.toString(), isSafari.toString()]);
			 self.ajax.post(url, resultURL).success(function(detailDto){
				 deferred.resolve(detailDto);
			 });
			 return deferred.promise;
		 };

		 /**
		  * Get URL to preview PDF document
		  * @param pdfID PDF ID
		  * @returns URL
		  */
		 ListDetailCoreService.prototype.getPreviewDocumentURL = function(salecaseUid, pdfID) {
			 var self = this;
			 return commonService.getUrl(commonService.urlMap.PREVIEW_PDF_DOCUMENT,[self.name, salecaseUid, pdfID]);
		 };

		 /**
		  * Get URL to preview PDF document
		  * @param pdfID PDF ID
		  * @returns URL
		  */
		 ListDetailCoreService.prototype.viewPrintDocumentURLAfterSubmitting = function(salecaseUid, pdfID) {
			 var self = this;
			 var url = commonService.getUrl(commonService.urlMap.DOCUMENT_GENERATE_AFTER_SUBMITTING,[self.name, salecaseUid, pdfID]);

			 var height = $(window).height();
			 var width = $(window).width();
			 commonService.showWindow(url, false, true, false, false, false, false, false, true, true, width, height, 0, 0);
		 };

//		 ListDetailCoreService.prototype.getBasicSumAssured = function(elementName) {
//		 var ele = this.findElementInDetail([elementName]);
//		 return this.findPropertyInElement(ele, ['Sum_Insured'], 'value').value;
//		 };

		 ListDetailCoreService.prototype.getDocumentDateFormat = function(){
			 return commonService.CONSTANTS.DATEFORMAT;
		 };

		 ListDetailCoreService.prototype.loadIndividualMetadataIllustration = function(uId, fnSuccess) {
			 var self = this;
			 var dataUrl = commonService.getUrl(self.commonService.urlMap.INDIVIDUAL_METADATA, ['illustration', uId]);
			 self.bolFinishLoading = false;

			 self.ajax.get(dataUrl).success(function(data) {
				 self.bolFinishLoading = true;
				 if(commonService.hasValue(fnSuccess)) fnSuccess.call(self, data);
			 });
		 };

		 ListDetailCoreService.prototype.addModelWithProspectIds = function(uid, prospectType, personUid, fnSuccess){
			 var self = this;
			 var dataUrl = undefined;
			 if (!commonService.hasValueNotEmpty(uid)) deferred.reject();
			 self.bolFinishLoading = false;

			 if (commonService.hasValueNotEmpty(uid)) dataUrl = commonService.getUrl(commonService.urlMap.ADD_MODEL_WITH_PROSPECTIDS,[ self.name, uid,prospectType,personUid ]);

			 self.ajax.get(dataUrl).success(function(data) {
				 self.updateDetailData(data);
				 self.applyPreDefineData();//TODO This logic only involved on UI 
				 self.useCurrentDetailDataAsOriginal();
				 self.bolFinishLoading = true;
				 if(commonService.hasValue(fnSuccess)) fnSuccess.call(self, data);
			 });

		 };

		 //common function for core modules: loadProspect, loadIllustration, loadClient, loadApplication, loadFactFind
		 /**
		  * Load a prospect/illustration/client/application/factfind via it's uId
		  * @param uId � uId to load 
		  * @returns {promise}
		  * <dl>
		  * <dt>Resolved with:</dt>
		  * <dd>prospect/illustration/client/application/factfind detail</dd>
		  * <dt>Rejected with:</dt>
		  * <dd>not defined</dd>	
		  * </dl>
		  */
		 ListDetailCoreService.prototype.loadDetail = function (uid){
			 var self = this;	 
			 var deferred = self.$q.defer();
			 this.getDetail.call(self, uid, function(data){
				 deferred.resolve(data);
			 });
			 return  deferred.promise;
		 };
		 
		 /**
		  * Load a prospect/illustration/client/application/factfind via it's uId
		  * @param uId � uId to load 
		  * @returns {promise}
		  * <dl>
		  * <dt>Resolved with:</dt>
		  * <dd>prospect/illustration/client/application/factfind detail</dd>
		  * <dt>Rejected with:</dt>
		  * <dd>not defined</dd>	
		  * </dl>
		  */
		 ListDetailCoreService.prototype.loadDetail_V3 = function (uid){
			 var self = this;	 
			 var deferred = self.$q.defer();
			 this.getDetail_V3.call(self, uid, function(data){
				 deferred.resolve(data);
			 });
			 return  deferred.promise;
		 };

		 //common function for core modules: loadProspectList, loadIllustrationList, loadClientList, loadApplicationList, loadSalecaseList
		 /**
		  * Load all prospects/illustrations/clients/applications/salecases from server
		  * @returns {promise}
		  * <dl>
		  * <dt>Resolved with:</dt>
		  * <dd>list of prospects/illustrations/clients/applications/salecases</dd>
		  * <dt>Rejected with:</dt>
		  * <dd>not defined</dd>	
		  * </dl>
		  */
		 ListDetailCoreService.prototype.loadList = function(lastUpdatedFlag, subordinateUid){
			 var self = this;
			 var deferred = self.$q.defer();
			 this.loadItemList.call(self, commonService.CONSTANTS.DOCTYPE.METADATA, lastUpdatedFlag, function(list){
				 //do somthing else when override
				 deferred.resolve(list);
			 }, subordinateUid);
			 return  deferred.promise;
		 };
		 
		 //common function for core modules: initializeIllustration, initializeProspect, initializeApplication, initializeFactFind, initializeHome, initializeSalecase
		 /**
		  * Load a prospect/illustration/client/application/factfind/home/salecase template from server
		  * @param uId - productTypeId (illustration) or empty
		  * @param boValidate
		  * @returns {promise}
		  * <dl>
		  * <dt>Resolved with:</dt>
		  * <dd>prospect/illustration/client/application/factfind/home/salecase document template</dd>
		  * <dt>Rejected with:</dt>
		  * <dd>not defined</dd>	
		  * </dl>
		  */
		 ListDetailCoreService.prototype.initializeObject = function(uId, boValidate){
			 var self = this;	 
			 var deferred = self.$q.defer();
			 this.initNewDetail.call(self, uId, function(data){
				 //do somthing else when override
				 deferred.resolve(data);
			 });
			 return  deferred.promise;
		 };
		 
		//common function for core modules: initializeIllustration, initializeProspect, initializeApplication, initializeFactFind, initializeHome, initializeSalecase
		 /**
		  * Load a prospect/illustration/client/application/factfind/home/salecase template from server
		  * @param uId - productTypeId (illustration) or empty
		  * @param boValidate
		  * @returns {promise}
		  * <dl>
		  * <dt>Resolved with:</dt>
		  * <dd>prospect/illustration/client/application/factfind/home/salecase document template</dd>
		  * <dt>Rejected with:</dt>
		  * <dd>not defined</dd>	
		  * </dl>
		  */
		/* ListDetailCoreService.prototype.initializeObject_V3 = function(uId, boValidate){
			 var self = this;	 
			 var deferred = self.$q.defer();
			 this.initNewDetail_V3.call(self, uId, function(data){
				 //do somthing else when override
				 deferred.resolve(data);
			 });
			 return  deferred.promise;
		 };*/

		 //tphan37: comment out when integrating UI_Framework to iOS HTML5
		 // /**
		 //  * init new v3 datamodel object (iposDocument)
		 //  * @param  {String} resourceURL [description]
		 //  * @param  {String} docType     [description]
		 //  * @param  {String} productName [description]
		 //  * @param  {String} transactionType    transaction type ('NewBusiness', 'ENDORSEMENT')
		 //  * @return {Object}             Angular promise
		 //  */
		 // ListDetailCoreService.prototype.initializeObject_V3 = function(resourceURL, docType, productName, transactionType) {
		 //     var self = this;
		 //     var deferred = $q.defer();
		     
		 //     // For mockup Income Protection Product
		 //     if(productName != undefined && productName == "income-protection") {
		 //    	 var data = null;
		 //    	 if(docType == 'case-management') {
		 //    		 data = {"IposDocument":{"@xmlns":"http://www.csc.com/integral/common","@xmlns:case-management-income-protection":"http://www.csc.com/integral/case-management-income-protection","@xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance","@xsi:schemaLocation":"http://www.csc.com/integral/case-management-income-protection case-management-income-protection-document.xsd ","Header":{"DocInfo":{"DocType":"case-management","Product":"income-protection","DefUid":"e521f237-770b-48d9-9230-8abdfec32169","DocId":"","DocName":"case-management-DefaultName","DocVersion":"","OwnerUid":"","CreatedDate":"","UpdatedDate":"","UpdatedUserUid":"","Tags":"","Star":"","Archived":"","Comments":""},"DocAccessControllList":{"User":{"@userid":"","Permisions":{"Permision":""}}},"DocStatus":{"DocumentStatus":"","BusinessStatus":"NEW"}},"Data":{"case-management-income-protection:CaseManagement":{"@case-name":"NewBusiness","@product":"income-protection","@vpms-suffix":"CaseManagement","case-management-income-protection:NewBusiness":{"@vpms-suffix":"NewBusiness","case-management-income-protection:MsgStatus":{"@vpms-suffix":"MsgStatus","case-management-income-protection:MsgStatusCd":{"@vpms-suffix":"MsgStatusCd","Options":{"Option":""},"Value":""},"case-management-income-protection:MsgErrorCd":{"@vpms-suffix":"MsgErrorCd","Options":{"Option":""},"Value":""},"case-management-income-protection:MsgStatusDesc":{"@vpms-suffix":"MsgStatusDesc"},"case-management-income-protection:PendingResponseAvailDt":{"@vpms-suffix":"PendingResponseAvailDt"},"case-management-income-protection:PendingResponseExpDt":{"@vpms-suffix":"PendingResponseExpDt"},"case-management-income-protection:ExtendedStatuses":{"@counter":"0","@maxOccurs":"","@minOccurs":"0","@vpms-suffix":"ExtendedStatuses","case-management-income-protection:ExtendedStatus":{"@vpms-suffix":"ExtendedStatus","case-management-income-protection:ExtendedStatusCd":{"@vpms-suffix":"ExtendedStatusCd","Options":{"Option":""},"Value":""},"case-management-income-protection:ExtendedStatusDesc":{"@vpms-suffix":"ExtendedStatusDesc"},"case-management-income-protection:MissingElementPath":{"@vpms-suffix":"MissingElementPath"}}}},"case-management-income-protection:SubmitChannel":{"@vpms-suffix":"NBSubmitChannel"},"case-management-income-protection:Doctypes":{"@vpms-suffix":"NBDoctypes","case-management-income-protection:Prospects":{"@counter":"0","@maxOccurs":"1","@minOccurs":"0","@vpms-suffix":"NBProspects","case-management-income-protection:Prospect":{"@refDocType":"prospect","@refUid":"","@vpms-suffix":"NBProspect","case-management-income-protection:ProspectId":{"@vpms-suffix":"NBProspectId"},"case-management-income-protection:ProspectRole":{"@vpms-suffix":"NBProspectRole"}}},"case-management-income-protection:Quotation":{"@refDocType":"illustration;product=income-protection","@refUid":"","@vpms-suffix":"NBQuotation","case-management-income-protection:QuotationId":{"@vpms-suffix":"NBQuotationId"}},"case-management-income-protection:Application":{"@refDocType":"application;product=income-protection","@refUid":"","@vpms-suffix":"NBApplication","case-management-income-protection:ApplicationId":{"@vpms-suffix":"NBApplicationId"}},"case-management-income-protection:Policy":{"@refDocType":"policy;product=income-protection","@refUid":"","@vpms-suffix":"NBPolicy","case-management-income-protection:PolicyId":{"@vpms-suffix":"NBPolicyId"},"case-management-income-protection:PolicyNumber":{"@vpms-suffix":"NBPolicyNumber"},"case-management-income-protection:ClientNumber":{"@vpms-suffix":"NBClientNumber"}},"case-management-income-protection:Payment":{"@refDocType":"payment","@refUid":"","@vpms-suffix":"NBPayment","case-management-income-protection:PaymentNo":{"@vpms-suffix":"NBPaymentNo"},"case-management-income-protection:SumInsured":{"@vpms-suffix":"NBSumInsured"},"case-management-income-protection:POName":{"@vpms-suffix":"NBPOName"},"case-management-income-protection:Premium":{"@vpms-suffix":"NBPremium"},"case-management-income-protection:PaymentMethod":{"@vpms-suffix":"NBPaymentMethod"},"case-management-income-protection:ReceiptNumber":{"@vpms-suffix":"NBReceiptNumber"}},"case-management-income-protection:Review":{"@refDocType":"review","@refUid":"","@vpms-suffix":"NBReview","case-management-income-protection:ReviewId":{"@vpms-suffix":"NBReviewId"}}},"case-management-income-protection:Prints":{"@counter":"0","@maxOccurs":"","@minOccurs":"0","@vpms-suffix":"Prints","case-management-income-protection:Print":{"@refResourceDocType":"","@refResourceUid":"","@vpms-suffix":"Print","case-management-income-protection:PrintID":{"@vpms-suffix":"PrintID"},"case-management-income-protection:PrintDoctype":{"@vpms-suffix":"PrintDoctype"}}},"Attachments":{"@counter":"0","@maxOccurs":"","@minOccurs":"0","@vpms-suffix":"Attachments","Attachment":{"@refResourceDocType":"","@refResourceUid":"","@vpms-suffix":"Attachment","FileUid":{"@default":"","@editable":"0","@mandatory":"0","@refResourceStatus":"","@refResourceVal":"","@validate":"","@visible":"1","@vpms-suffix":"FileUid"},"Name":{"@default":"","@editable":"0","@mandatory":"0","@refResourceStatus":"","@refResourceVal":"","@validate":"","@visible":"1","@vpms-suffix":"Name"},"FileName":{"@default":"","@editable":"0","@mandatory":"0","@refResourceStatus":"","@refResourceVal":"","@validate":"","@visible":"1","@vpms-suffix":"FileName"},"CreateDate":{"@default":"","@editable":"0","@mandatory":"0","@refResourceStatus":"","@refResourceVal":"","@validate":"","@visible":"1","@vpms-suffix":"CreateDate"},"FileSize":{"@default":"","@editable":"0","@mandatory":"0","@refResourceStatus":"","@refResourceVal":"","@validate":"","@visible":"1","@vpms-suffix":"FileSize"}}}}}}}};
		 //    	 } else if(docType == 'illustration') {
		 //    		 data = {"IposDocument":{"@xmlns":"http://www.csc.com/integral/common","@xmlns:illus-pa":"http://www.csc.com/integral/illustration-income-protection","@xmlns:pa":"http://www.csc.com/integral/income-protection","@xmlns:person":"http://www.csc.com/integral/personal","@xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance","@xsi:schemaLocation":"http://www.csc.com/integral/illustration-income-protection illustration-income-protection-document.xsd ","Header":{"DocInfo":{"DocType":"illustration","Product":"income-protection","DefUid":"fd58a142-f4b9-4519-a25f-3bf0cfa63b80","DocId":"","DocName":"illustration-DefaultName","DocVersion":"","OwnerUid":"","CreatedDate":"","UpdatedDate":"","UpdatedUserUid":"","Tags":"","Star":"","Archived":"","Comments":""},"DocAccessControllList":{"User":{"@userid":"","Permisions":{"Permision":""}}},"DocStatus":{"DocumentStatus":"","BusinessStatus":"NEW"}},"Data":{"illus-pa:PersonalAccident":{"@vpms-suffix":"PersonalAccident","illus-pa:DocumentRelation":{"@vpms-suffix":"DocumentRelation","illus-pa:ActionType":{"@editable":"1","@mandatory":"0","@visible":"0","@vpms-suffix":"ActionType"},"illus-pa:CaseID":{"@editable":"1","@mandatory":"0","@visible":"0","@vpms-suffix":"CaseID"},"illus-pa:MasterPolicy":{"@editable":"1","@mandatory":"0","@visible":"0","@vpms-suffix":"MasterPolicy"}},"illus-pa:ProductInformation":{"@vpms-suffix":"ProductInformation","illus-pa:ProductName":{"@default":"income-protection","@vpms-suffix":"ProductName","$":"income-protection"},"illus-pa:ProductCode":{"@default":"","@vpms-suffix":"ProductCode"},"illus-pa:ProductDescription":{"@default":"","@vpms-suffix":"ProductDescription"},"illus-pa:ProductVersion":{"@default":"","@vpms-suffix":"ProductVersion"},"illus-pa:ProductLaunchedDate":{"@default":"","@vpms-suffix":"ProductLaunchedDate"},"illus-pa:ProductExpiredDate":{"@default":"","@vpms-suffix":"ProductExpiredDate"}},"illus-pa:BasicInformation":{"@vpms-suffix":"BasicInformation","illus-pa:InceptionDate":{"@default":"2015-11-26","@editable":"1","@mandatory":"1","@visible":"1","@vpms-suffix":"InceptionDate","$":"2015-11-26"},"illus-pa:ExpiryDate":{"@default":"2016-11-25","@editable":"1","@mandatory":"1","@visible":"1","@vpms-suffix":"ExpiryDate","$":"2016-11-25"},"illus-pa:BillingCurrency":{"@editable":"1","@mandatory":"0","@visible":"1","@vpms-suffix":"BillingCurrency","Options":{"Option":""},"Value":""},"illus-pa:EffectiveDate":{"@editable":"1","@mandatory":"0","@visible":"1","@vpms-suffix":"EffectiveDate"},"illus-pa:SICurrency":{"@editable":"1","@mandatory":"0","@visible":"1","@vpms-suffix":"SICurrency","Options":{"Option":""},"Value":""}},"illus-pa:Coverage":{"@vpms-suffix":"Coverage","pa:Plan":{"@default":"IPAP","@editable":"1","@mandatory":"1","@validate":"","@visible":"1","@vpms-suffix":"Plan","Options":{"Option":""},"Value":"IPAP"},"pa:Country":{"@default":"SG","@editable":"1","@mandatory":"1","@visible":"1","@vpms-suffix":"PACountry","Options":{"Option":""},"Value":"SG"},"pa:NoOfPeople":{"@default":"1","@editable":"1","@mandatory":"0","@visible":"1","@vpms-suffix":"NoOfPeople","$":"1"},"pa:GeographicCoverage":{"@editable":"1","@mandatory":"1","@visible":"1","@vpms-suffix":"GeographicCoverage","Options":{"Option":""},"Value":""},"pa:PolicyDeductible":{"@default":"","@editable":"1","@mandatory":"0","@visible":"1","@vpms-suffix":"PolicyDeductible"},"pa:Benefits":{"@vpms-suffix":"Benefits","pa:LumpSumBenefit":{"@default":"Y","@editable":"0","@mandatory":"1","@visible":"1","@vpms-suffix":"LumpSumBenefit","$":"Y"},"pa:IncomeBenefit":{"@default":"Y","@editable":"0","@mandatory":"1","@visible":"1","@vpms-suffix":"IncomeBenefit","$":"Y"},"pa:TravelInconvenienceBenefit":{"@default":"Y","@editable":"0","@mandatory":"0","@visible":"0","@vpms-suffix":"TravelInconvenienceBenefit","$":"Y"},"pa:MedicalBenefit":{"@default":"Y","@editable":"0","@mandatory":"0","@visible":"0","@vpms-suffix":"MedicalBenefit","$":"Y"},"pa:Evacuation":{"@default":"Y","@editable":"0","@mandatory":"0","@visible":"0","@vpms-suffix":"Evacuation","$":"Y"},"pa:VehicleRental":{"@default":"Y","@editable":"0","@mandatory":"0","@visible":"0","@vpms-suffix":"VehicleRental","$":"Y"}}},"illus-pa:MainInsured":{"@refDocType":"prospect","@refUid":"","@vpms-suffix":"MainInsuredPersonal","person:Photo":{"@vpms-suffix":"MIPhoto"},"person:Title":{"@vpms-suffix":"MITitle","Options":{"Option":""},"Value":""},"person:PersonName":{"@vpms-suffix":"MIPersonName","person:FirstName":{"@vpms-suffix":"MIFirstName"},"person:MiddleName":{"@vpms-suffix":"MIMiddleName"},"person:LastName":{"@vpms-suffix":"MILastName"},"person:AliasName":{"@vpms-suffix":"MIAliasName"},"person:FullName":{"@editable":"1","@mandatory":"0","@visible":"1","@vpms-suffix":"MIFullName"}},"person:BirthDate":{"@editable":"1","@mandatory":"1","@visible":"1","@vpms-suffix":"MIBirthDate"},"person:Gender":{"@vpms-suffix":"MIGender","Options":{"Option":""},"Value":""},"person:MaritalStatus":{"@vpms-suffix":"MIMaritalStatus","Options":{"Option":""},"Value":""},"person:SmokerStatus":{"@vpms-suffix":"MISmokerStatus","Options":{"Option":""},"Value":""},"person:BusinessIndustry":{"@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"MIBusinessIndustry","Options":{"Option":""},"Value":""},"person:Occupation":{"@default":"","@editable":"1","@mandatory":"1","@validate":"","@visible":"1","@vpms-suffix":"MIOccupation","Options":{"Option":""},"Value":""},"person:ReferralType":{"@vpms-suffix":"MIReferralType","Options":{"Option":""},"Value":""},"person:Referrer":{"@vpms-suffix":"MIReferrer"},"person:Race":{"@vpms-suffix":"MIRace","Options":{"Option":""},"Value":""},"person:Nationality":{"@vpms-suffix":"MINationality","Options":{"Option":""},"Value":""},"person:IDs":{"@counter":"1","@maxOccurs":"1","@minOccurs":"1","@vpms-suffix":"MIIDs","person:ID":{"@vpms-suffix":"MIID","person:IDType":{"@default":"","@editable":"0","@mandatory":"0","@visible":"0","@vpms-suffix":"MIIDType","Options":{"Option":""},"Value":""},"person:IDNumber":{"@default":"","@editable":"1","@mandatory":"0","@visible":"1","@vpms-suffix":"MIIDNumber"}}},"person:Staff":{"@vpms-suffix":"MIStaff","Options":{"Option":""},"Value":""},"person:Vip":{"@vpms-suffix":"MIVip","Options":{"Option":""},"Value":""},"person:Education":{"@vpms-suffix":"MIEducation","Options":{"Option":""},"Value":""},"person:EmploymentStatus":{"@vpms-suffix":"MIEmploymentStatus","Options":{"Option":""},"Value":""},"person:CountryOfBirth":{"@vpms-suffix":"MICountryOfBirth","Options":{"Option":""},"Value":""},"person:Age":{"@vpms-suffix":"MIAge"},"person:Addresses":{"@vpms-suffix":"MIAddresses","person:Address":{"@vpms-suffix":"MIAddress","person:AddressType":{"@vpms-suffix":"MIAddressType","Options":{"Option":""},"Value":""},"person:BlkHouseNo":{"@vpms-suffix":"MIBlkHouseNo"},"person:Street":{"@vpms-suffix":"MIStreet"},"person:UnitNo":{"@vpms-suffix":"MIUnitNo"},"person:Building":{"@vpms-suffix":"MIBuilding"},"person:City":{"@vpms-suffix":"MICity"},"person:Country":{"@vpms-suffix":"MICountry","Options":{"Option":""},"Value":""},"person:Postal":{"@vpms-suffix":"Postal"},"person:PreferredAddress":{"@vpms-suffix":"PreferredAddress","Options":{"Option":""},"Value":""}}},"person:Contacts":{"@vpms-suffix":"Contacts","person:Contact":{"@vpms-suffix":"Contact","person:ContactType":{"@vpms-suffix":"ContactType","Options":{"Option":""},"Value":""},"person:ContactInformation":{"@vpms-suffix":"ContactInformation"},"person:PreferredContact":{"@vpms-suffix":"PreferredContact","Options":{"Option":""},"Value":""}}}},"illus-pa:OtherInsuredPersons":{"@counter":"0","@maxOccurs":"5","@minOccurs":"0","@vpms-suffix":"OtherInsuredPersons","illus-pa:OtherInsuredPerson":{"@vpms-suffix":"OtherInsuredPersonal","person:Photo":{"@vpms-suffix":"Photo"},"person:Title":{"@vpms-suffix":"Title","Options":{"Option":""},"Value":""},"person:PersonName":{"@vpms-suffix":"PersonName","person:FirstName":{"@vpms-suffix":"FirstName"},"person:MiddleName":{"@vpms-suffix":"MiddleName"},"person:LastName":{"@vpms-suffix":"LastName"},"person:AliasName":{"@vpms-suffix":"AliasName"},"person:FullName":{"@default":"","@editable":"1","@mandatory":"0","@visible":"1","@vpms-suffix":"FullName"}},"person:BirthDate":{"@default":"","@editable":"1","@mandatory":"0","@validate":"","@visible":"1","@vpms-suffix":"BirthDate"},"person:Gender":{"@vpms-suffix":"Gender","Options":{"Option":""},"Value":""},"person:MaritalStatus":{"@vpms-suffix":"MaritalStatus","Options":{"Option":""},"Value":""},"person:SmokerStatus":{"@vpms-suffix":"SmokerStatus","Options":{"Option":""},"Value":""},"person:BusinessIndustry":{"@vpms-suffix":"BusinessIndustry","Options":{"Option":""},"Value":""},"person:Occupation":{"@vpms-suffix":"Occupation","Options":{"Option":""},"Value":""},"person:ReferralType":{"@vpms-suffix":"ReferralType","Options":{"Option":""},"Value":""},"person:Referrer":{"@vpms-suffix":"Referrer"},"person:Race":{"@vpms-suffix":"Race","Options":{"Option":""},"Value":""},"person:Nationality":{"@vpms-suffix":"Nationality","Options":{"Option":""},"Value":""},"person:IDs":{"@counter":"1","@maxOccurs":"1","@minOccurs":"1","@vpms-suffix":"IDs","person:ID":{"@vpms-suffix":"ID","person:IDType":{"@default":"","@editable":"0","@mandatory":"0","@visible":"0","@vpms-suffix":"IDType","Options":{"Option":""},"Value":""},"person:IDNumber":{"@default":"","@editable":"1","@mandatory":"0","@visible":"1","@vpms-suffix":"IDNumber"}}},"person:Staff":{"@vpms-suffix":"Staff","Options":{"Option":""},"Value":""},"person:Vip":{"@vpms-suffix":"Vip","Options":{"Option":""},"Value":""},"person:Education":{"@vpms-suffix":"Education","Options":{"Option":""},"Value":""},"person:EmploymentStatus":{"@vpms-suffix":"EmploymentStatus","Options":{"Option":""},"Value":""},"person:CountryOfBirth":{"@vpms-suffix":"CountryOfBirth","Options":{"Option":""},"Value":""},"person:Age":{"@vpms-suffix":"Age"},"person:Addresses":{"@vpms-suffix":"Addresses","person:Address":{"@vpms-suffix":"Address","person:AddressType":{"@vpms-suffix":"AddressType","Options":{"Option":""},"Value":""},"person:BlkHouseNo":{"@vpms-suffix":"BlkHouseNo"},"person:Street":{"@vpms-suffix":"Street"},"person:UnitNo":{"@vpms-suffix":"UnitNo"},"person:Building":{"@vpms-suffix":"Building"},"person:City":{"@vpms-suffix":"City"},"person:Country":{"@vpms-suffix":"Country","Options":{"Option":""},"Value":""},"person:Postal":{"@vpms-suffix":"Postal"},"person:PreferredAddress":{"@vpms-suffix":"PreferredAddress","Options":{"Option":""},"Value":""}}},"person:Contacts":{"@vpms-suffix":"Contacts","person:Contact":{"@vpms-suffix":"Contact","person:ContactType":{"@vpms-suffix":"ContactType","Options":{"Option":""},"Value":""},"person:ContactInformation":{"@vpms-suffix":"ContactInformation"},"person:PreferredContact":{"@vpms-suffix":"PreferredContact","Options":{"Option":""},"Value":""}}}}},"illus-pa:PremiumDetails":{"@vpms-suffix":"PremiumDetails","illus-pa:TotalPremium":{"@vpms-suffix":"TotalPremium"},"illus-pa:StampDuty":{"@vpms-suffix":"StampDuty"},"illus-pa:GST":{"@vpms-suffix":"GST"},"illus-pa:TotalPayable":{"@vpms-suffix":"TotalPayable"}}}}}}
		    		 
		 //    	 }
		 //    	 self.detail = data;
		 //         self.originalDetail = angular.copy(self.detail);
		 //         deferred.resolve(data);
		 //         return deferred.promise;
		 //     } 
		 //      else {
			//      // var url = "";
			//      // docType != undefined ? self.name = docType : self.name;
			//      // if (productName === undefined) {
			//      //     url = commonService.getUrl(commonService.urlMap.DOCUMENT_ADD, [self.name]);
			//      // } else {
			//      //     if (transactionType === undefined) {
			//      //         url = commonService.getUrl(commonService.urlMap.MODULE_CREATE, [self.name, productName]);
			//      //     } else {
			//      //         url = commonService.getUrl(commonService.urlMap.MODULE_CREATE_CASE, [self.name, transactionType, productName]);
			//      //     }
			//      // }

			     
			//      self.name = docType !== undefined ? docType : self.name;
			//      var url = commonService.getUrl(commonService.urlMap.DOCUMENT_ADD, [self.name, productName, transactionType]);
			     
			//      self.ajax.getRuntime(resourceURL, url, function(data) {
			//      	self.convertElementsToArrayInElement_V3(data);
			//     	self.detail = data;
			//      	self.originalDetail = angular.copy(self.detail);
			//      	deferred.resolve(data);
			//      });
			//      return deferred.promise;
		 //     }
		 // };

		 /**
		  * init new v3 datamodel object (iposDocument)
		  * @param  {String} resourceURL [description]
		  * @param  {String} docType     [description]
		  * @param  {String} productName [description]
		  * @param  {String} transactionType    transaction type ('NewBusiness', 'ENDORSEMENT')
		  * @return {Object}             Angular promise
		  */
		 ListDetailCoreService.prototype.initializeObject_V3 = function(resourceURL, docType, productName, transactionType) {
		    var self = this;
		    var deferred = $q.defer();
		     
		    self.name = docType !== undefined ? docType : self.name;
		     
		    connectService.exeAction({
		    	actionName: "DOCUMENT_ADD",
		    	actionParams: [self.name, productName, transactionType],
		    	resourceURL: resourceURL
		    })
		    .then(function (data) {			     	
		     	self.convertElementsToArrayInElement_V3(data);
		    	self.detail = data;
		     	self.originalDetail = angular.copy(self.detail);
		     	deferred.resolve(data);
		    });
		    return deferred.promise;
		 };
		 
		 /**
		  * init new v3 datamodel object (iposDocument)
		  * @param  {String} resourceURL [description]
		  * @param  {String} docType     [description]
		  * @param  {String} productName [description]
		  * @param  {String} caseName    [description]
		  * @return {Object}             Angular promise
		  */
		 ListDetailCoreService.prototype.initializeObjectFNA_V3 = function(resourceURL, fnaDocType) {
			 var self = this;
		     var deferred = $q.defer();
		     var url = "";
		     url = commonService.getUrl(commonService.urlMap.DOCUMENT_ADD, [fnaDocType]);
		     self.ajax.getRuntime(resourceURL, url, function(data) {		    
		    	 if(!self.isSuccess(data))
		    		 data = {"IposDocument":{"@xmlns":"http://www.csc.com/integral/common","@xmlns:factfind":"http://www.csc.com/integral/fact-find","@xmlns:person":"http://www.csc.com/integral/personal","@xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance","@xsi:schemaLocation":"http://www.csc.com/integral/fact-find-document fact-find-document.xsd ","Header":{"DocInfo":{"DocType":"fact-find","Product":"","DefUid":"8dd555af-d880-4190-984c-2e07d2406915","DocId":"","DocName":"fact-find-DefaultName","DocVersion":"","OwnerUid":"","ProfileId":"","CreatedDate":"","UpdatedDate":"","UpdatedUserUid":"","Tags":"","Star":"","Archived":"","Comments":""},"DocAccessControllList":{"User":{"@userid":"","Permisions":{"Permision":""}}},"DocStatus":{"DocumentStatus":"","BusinessStatus":"NEW"}},"Data":{"factfind:FullFNA":{"@vpms-suffix":"FullFNA","factfind:Sumary":{"@vpms-suffix":"Sumary","factfind:FinancialsPosition":{"@vpms-suffix":"FinancialsPosition","factfind:TotalAsset":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"TotalAsset"},"factfind:TotalLiabilities":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"TotalLiabilities"},"factfind:Networth":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"Networth"}},"factfind:AnnualCashFlow":{"@vpms-suffix":"AnnualCashFlow","factfind:AnnualIncome":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"AnnualIncome"},"factfind:AnnualExpenses":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"AnnualExpenses"}},"factfind:InvestmentRiskProfile":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"InvestmentRiskProfile"}},"factfind:Client":{"@vpms-suffix":"Client","@refDocType":"","@refUid":"","factfind:Dependants":{"@vpms-suffix":"Dependants","@refDocType":"","factfind:Children":{"@counter":"0","@maxOccurs":"3","@minOccurs":"0","@vpms-suffix":"Children","factfind:Child":{"@refDocType":"","@refUid":"","@vpms-suffix":"Child","factfind:ChildFullName":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"ChildFullName"},"factfind:ChildBirthOfDate":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"ChildBirthDate"},"factfind:ChildGender":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"ChildGender","Options":{"Option":""},"Value":""},"factfind:ChildNumberOfYearToSupport":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"ChildNumberOfYearToSupport","$":"22"}}},"factfind:ElderDependants":{"@counter":"0","@maxOccurs":"3","@minOccurs":"0","@vpms-suffix":"ElderDependants","factfind:ElderDependant":{"@vpms-suffix":"ElderDependant","factfind:DependantFullName":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"DependantFullName"},"factfind:DependantBirthOfDate":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"DependantBirthDate"},"factfind:DependantGender":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"DependantGender","Options":{"Option":""},"Value":""},"factfind:DependantNumberOfYearToSupport":{"@default":"20","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"DependantNumberOfYearToSupport"},"factfind:Relationship":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"Relationship","Options":{"Option":""},"Value":""},"factfind:OtherRelationship":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"OtherRelationship"}}}},"factfind:FinancialGoalsSelection":{"@vpms-suffix":"FinancialGoalsSelection","factfind:FinancialProtection":{"@vpms-suffix":"FinancialProtection","factfind:ProtectionUponDeath":{"@vpms-suffix":"ProtectionUponDeath","factfind:Priority":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"ProtectionPriority","Options":{"Option":""},"Value":""},"factfind:Ranking":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"ProtectionRanking","Options":{"Option":""},"Value":""}},"factfind:CriticalIllness":{"@vpms-suffix":"CriticalIllness","factfind:Priority":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"CriticalIllnessPriority","Options":{"Option":""},"Value":""},"factfind:Ranking":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"CriticalIllnessRanking","Options":{"Option":""},"Value":""}},"factfind:Mortgage":{"@vpms-suffix":"Mortgage","factfind:Priority":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"MortgagePriority","Options":{"Option":""},"Value":""},"factfind:Ranking":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"MortgageRanking","Options":{"Option":""},"Value":""}}},"factfind:WealthAccumulation":{"@vpms-suffix":"WealthAccumulation","factfind:EducationFund":{"@vpms-suffix":"EducationFund","factfind:Priority":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"EducationPriority","Options":{"Option":""},"Value":""},"factfind:Ranking":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"EducationRanking","Options":{"Option":""},"Value":""}},"factfind:RetirementFund":{"@vpms-suffix":"RetirementFund","factfind:Priority":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"RetirementPriority","Options":{"Option":""},"Value":""},"factfind:Ranking":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"RetirementRanking","Options":{"Option":""},"Value":""}},"factfind:MediumLongTermSavings":{"@vpms-suffix":"MediumLongTermSavings","factfind:Priority":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"MediumLongTermSavingsPriority","Options":{"Option":""},"Value":""},"factfind:Ranking":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"MediumLongTermSavingsRanking","Options":{"Option":""},"Value":""}}}},"factfind:FinancialGoalsAnalysis":{"@vpms-suffix":"FinancialGoalsAnalysis","factfind:Assumptions":{"@vpms-suffix":"Assumptions","factfind:ExpectedReturnOnInvestment":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"ExpectedReturnOnInvestment","$":10},"factfind:InflationRate":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"InflationRate","$":12},"factfind:ReplacementIncomePercentage":{"@vpms-suffix":"ReplacementIncomePercentage","factfind:PercentOfCurrentAnnualIncome":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"PercentOfCurrentAnnualIncome","$":13},"factfind:NetRateOfReturn":{"@vpms-suffix":"NetRateOfReturn","$":2}},"factfind:Age":{"@vpms-suffix":"Age","factfind:DependencePeriodForChildren":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"DependencePeriodForChildren","$":14},"factfind:DependencePeriodForEarlyDependants":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"DependencePeriodForEarlyDependants","$":15},"factfind:MaleStartsUniversity":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"MaleStartsUniversity","$":16},"factfind:FemaleStartsUniversity":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"FemaleStartsUniversity","$":17},"factfind:RetirementAge":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"RetirementAge","$":18},"factfind:LifeExpectancyAge":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"LifeExpectedAge","$":19}},"factfind:UniversityEducation":{"@vpms-suffix":"UniversityEducation","factfind:UniversityStudyDuration":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"UniversityStudyDuration"},"factfind:CostPerYear":{"@default":"35000","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"CostPerYear","$":"35000"}}},"factfind:ProtectionUponDeathInfo":{"@vpms-suffix":"ProtectionUponDeathInfo","factfind:CapitalSumRequirement":{"@vpms-suffix":"CapitalSumRequirement","factfind:ReplacementIncomeNeeded":{"@vpms-suffix":"ReplacementIncomeNeeded"},"factfind:NumberOfYearIncomeRequired":{"@vpms-suffix":"NumberOfYearIncomeRequired"},"factfind:ProtectionUponDeathNetRateOfReturn":{"@vpms-suffix":"ProtectionUponDeathNetRateOfReturn"},"factfind:LumpSumRequired":{"@vpms-suffix":"ProtectionUponDeathLumpSumRequired"}},"factfind:TotalCashRequirement":{"@vpms-suffix":"TotalCashRequirement","factfind:MortgageLoan":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"MortgageLoan"},"factfind:OtherOutstandingDebts":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"OtherOutstandingDebts"},"factfind:TotalCashRequired":{"@vpms-suffix":"ProtectionUponDeathTotalCashRequired"},"factfind:TotalRequiredForIncomeProtection":{"@vpms-suffix":"TotalRequiredForIncomeProtection"},"factfind:ProtectionExistingFundsSetAside":{"@vpms-suffix":"ProtectionExistingFundsSetAside"},"factfind:ProtectionTotalShortfallOrSurplus":{"@vpms-suffix":"ProtectionTotalShortfallOrSurplus"}}},"factfind:RetirementFundInfo":{"@vpms-suffix":"RetirementFundInfo","factfind:CurrentAge":{"@vpms-suffix":"CurrentAge"},"factfind:ExpectedRetirementAge":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"ExpectedRetirementAge"},"factfind:CurrentAnnualIncome":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"CurrentAnnualIncome"},"factfind:PercentIncomeCanLiveInRetirement":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"PercentIncomeCanLiveInRetirement"},"factfind:AssumedRateOfSalaryIncrease":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"AssumedRateOfSalaryIncrease"},"factfind:AnnualIncomeRequired":{"@vpms-suffix":"AnnualIncomeRequired"},"factfind:YearToReceiveRetirementIncome":{"@vpms-suffix":"YearToReceiveRetirementIncome"},"factfind:RetirementNetRateOfReturn":{"@vpms-suffix":"RetirementNetRateOfReturn"},"factfind:TotalAmountRequiredAtRetirement":{"@vpms-suffix":"TotalAmountRequiredAtRetirement"},"factfind:ExistingFundsSetAside":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"RetirementFundExistingFundsSetAside"},"factfind:TotalShortfallOrSurplus":{"@vpms-suffix":"RetirementFundTotalShortfallOrSurplus"},"factfind:ReturnOnInvestment":{"@vpms-suffix":"RetirementFundReturnOnInvestment"},"factfind:ExpectedInterestEarnedFromTheExistingFund":{"@vpms-suffix":"RetirementFundExpectedInterestEarnedFromTheExistingFund"},"factfind:PossibleOptions":{"@vpms-suffix":"RetirementFundPossibleOptions","factfind:SingleCapitalSumRequiredForRetirement":{"@vpms-suffix":"RetirementFundSingleCapitalSumRequiredForRetirement"},"factfind:AnnualSumRequiredForRetirement":{"@vpms-suffix":"RetirementFundAnnualSumRequiredForRetirement"}}},"factfind:EducationFundInfos":{"@counter":"0","@maxOccurs":"3","@minOccurs":"0","@vpms-suffix":"EducationFundInfos","factfind:EducationFundInfo":{"@vpms-suffix":"EducationFundInfo","factfind:ChildName":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"FullNameChild"},"factfind:ChildCurrentAge":{"@vpms-suffix":"ChildCurrentAge","$":"0"},"factfind:PlanEducationToStart":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"PlanEducationToStart","$":"19"},"factfind:InflationRate":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"EducationFundInflationRate"},"factfind:TotalEducationFundRequiredToday":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"TotalEducationFundRequiredToday"},"factfind:TotalEducationFundRequiredTodayStartOfEducation":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"TotalEducationFundRequiredTodayStartOfEducation"},"factfind:ExistingFundsSetAside":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"EducationFundExistingFundsSetAside"},"factfind:ExpectedRateOfReturn":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"ExpectedRateOfReturn"},"factfind:ExpectedFutureValueOfFundSetAside":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"ExpectedFutureValueOfFundSetAside"},"factfind:TotalShortfallOrSurplus":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"EducationFundTotalShortfallOrSurplus"},"factfind:ReturnOnInvestment":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"EducationFundReturnOnInvestment"},"factfind:ExpectedInterestEarnedFromTheExistingFund":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"EducationFundExpectedInterestEarnedFromTheExistingFund"},"factfind:PossibleOptions":{"@vpms-suffix":"EducationFundPossibleOptions","factfind:SingleCapitalSumRequiredForRetirement":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"EducationFundSingleCapitalSumRequiredForRetirement"},"factfind:AnnualSumRequiredForRetirement":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"EducationFundAnnualSumRequiredForRetirement"}}}},"factfind:MediumLongTermSavingsInfo":{"@vpms-suffix":"MediumLongTermSavingsInfo","factfind:PurposeOfSaving":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"PurposeOfSaving"},"factfind:AmountRequired":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"AmountRequired"},"factfind:YearOfSavings":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"YearOfSavings"},"factfind:ExistingFundsSetAside":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"MediumLongExistingFundsSetAside"},"factfind:TotalShortfallOrSurplus":{"@vpms-suffix":"MediumLongTotalShortfallOrSurplus"},"factfind:ReturnOnInvestment":{"@vpms-suffix":"MediumLongReturnOnInvestment"},"factfind:ExpectedInterestEarnedFromTheExistingFund":{"@vpms-suffix":"MediumLongExpectedInterestEarnedFromTheExistingFund"},"factfind:PosibleOptions":{"@vpms-suffix":"MediumLongPosibleOptions","factfind:SingleCapitalSumRequiredForRetirement":{"@vpms-suffix":"MediumLongSingleCapitalSumRequiredForRetirement"},"factfind:AnnualSumRequiredForRetirement":{"@vpms-suffix":"MediumLongAnnualSumRequiredForRetirement"}}},"factfind:CriticalIllnessInfo":{"@vpms-suffix":"CriticalIllnessInfo","factfind:CapitalSumRequirement":{"@vpms-suffix":"CapitalSumRequirement","factfind:ReplacementIncomeNeeded":{"@vpms-suffix":"CriticalIllnessReplacementIncomeNeeded"},"factfind:NumberOfYearIncomeRequired":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"CriticalIllnessNumberOfYearIncomeRequired","$":"10"},"factfind:ProtectionUponDeathNetRateOfReturn":{"@vpms-suffix":"CriticalIllnessProtectionUponDeathNetRateOfReturn"},"factfind:LumpSumRequired":{"@vpms-suffix":"CriticalIllnessLumpSumRequired"}},"factfind:CriticalIllnessTotalCashRequirement":{"@vpms-suffix":"CriticalIllnessTotalCashRequirement","factfind:TreatmentCost":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"TreatmentCost"},"factfind:Others":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"Others"},"factfind:TotalCashRequired":{"@vpms-suffix":"CriticalIllnessTotalCashRequired"},"factfind:TotalRequiredForCriticalIllness":{"@vpms-suffix":"TotalRequiredForCriticalIllness"}}},"factfind:MortgageProtection":{"@vpms-suffix":"MortgageProtection","factfind:MortgageCalculator":{"@vpms-suffix":"MortgageCalculator","factfind:MortgageValue":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"MortgageValue"},"factfind:LoanAmount":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"LoanAmount"},"factfind:LoanInterestRate":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"LoanInterestRate"},"factfind:LoanTerm":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"LoanTerm"},"factfind:TotalPaid":{"@vpms-suffix":"TotalPaid"},"factfind:MonthlyPayment":{"@vpms-suffix":"MonthlyPayment"}}}}},"factfind:JointApplicant":{"@vpms-suffix":"JointApplicant","@refDocType":"","@refUid":"","factfind:FinancialGoalsSelection":{"@vpms-suffix":"JFinancialGoalsSelection","factfind:FinancialProtection":{"@vpms-suffix":"JFinancialProtection","factfind:ProtectionUponDeath":{"@vpms-suffix":"JProtectionUponDeath","factfind:Priority":{"@vpms-suffix":"JProtectionPriority","Options":{"Option":""},"Value":""},"factfind:Ranking":{"@vpms-suffix":"JProtectionRanking","Options":{"Option":""},"Value":""}},"factfind:CriticalIllness":{"@vpms-suffix":"JCriticalIllness","factfind:Priority":{"@vpms-suffix":"JCriticalIllnessPriority","Options":{"Option":""},"Value":""},"factfind:Ranking":{"@vpms-suffix":"JCriticalIllnessRanking","Options":{"Option":""},"Value":""}},"factfind:Mortgage":{"@vpms-suffix":"JMortgage","factfind:Priority":{"@vpms-suffix":"JMortgagePriority","Options":{"Option":""},"Value":""},"factfind:Ranking":{"@vpms-suffix":"JMortgageRanking","Options":{"Option":""},"Value":""}}},"factfind:WealthAccumulation":{"@vpms-suffix":"JWealthAccumulation","factfind:EducationFund":{"@vpms-suffix":"JEducationFund","factfind:Priority":{"@vpms-suffix":"JEducationPriority","Options":{"Option":""},"Value":""},"factfind:Ranking":{"@vpms-suffix":"JEducationRanking","Options":{"Option":""},"Value":""}},"factfind:RetirementFund":{"@vpms-suffix":"JRetirementFund","factfind:Priority":{"@vpms-suffix":"JRetirementPriority","Options":{"Option":""},"Value":""},"factfind:Ranking":{"@vpms-suffix":"JRetirementRanking","Options":{"Option":""},"Value":""}},"factfind:MediumLongTermSavings":{"@vpms-suffix":"JMediumLongTermSavings","factfind:Priority":{"@vpms-suffix":"JMediumLongTermSavingsPriority","Options":{"Option":""},"Value":""},"factfind:Ranking":{"@vpms-suffix":"JMediumLongTermSavingsRanking","Options":{"Option":""},"Value":""}}}},"factfind:FinancialGoalsAnalysis":{"@vpms-suffix":"JFinancialGoalsAnalysis","factfind:Assumptions":{"@vpms-suffix":"JAssumptions","factfind:ExpectedReturnOnInvestment":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"JExpectedReturnOnInvestment"},"factfind:InflationRate":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"JInflationRate"},"factfind:ReplacementIncomePercentage":{"@vpms-suffix":"JReplacementIncomePercentage","factfind:PercentOfCurrentAnnualIncome":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"JPercentOfCurrentAnnualIncome"},"factfind:NetRateOfReturn":{"@vpms-suffix":"JNetRateOfReturn"}},"factfind:Age":{"@vpms-suffix":"JAge","factfind:DependencePeriodForChildren":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"JDependencePeriodForChildren"},"factfind:DependencePeriodForEarlyDependants":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"JDependencePeriodForEarlyDependants"},"factfind:MaleStartsUniversity":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"JMaleStartsUniversity"},"factfind:FemaleStartsUniversity":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"JFemaleStartsUniversity"},"factfind:RetirementAge":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"JRetirementAge"},"factfind:LifeExpectancyAge":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"JLifeExpectedAge"}},"factfind:UniversityEducation":{"@vpms-suffix":"JUniversityEducation","factfind:UniversityStudyDuration":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"JUniversityStudyDuration"},"factfind:CostPerYear":{"@default":"35000","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"JCostPerYear","$":"35000"}}},"factfind:ProtectionUponDeathInfo":{"@vpms-suffix":"JProtectionUponDeathInfo","factfind:CapitalSumRequirement":{"@vpms-suffix":"JCapitalSumRequirement","factfind:ReplacementIncomeNeeded":{"@vpms-suffix":"JReplacementIncomeNeeded"},"factfind:NumberOfYearIncomeRequired":{"@vpms-suffix":"JNumberOfYearIncomeRequired"},"factfind:ProtectionUponDeathNetRateOfReturn":{"@vpms-suffix":"JProtectionUponDeathNetRateOfReturn"},"factfind:LumpSumRequired":{"@vpms-suffix":"JProtectionUponDeathLumpSumRequired"}},"factfind:TotalCashRequirement":{"@vpms-suffix":"JTotalCashRequirement","factfind:MortgageLoan":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"JMortgageLoan"},"factfind:OtherOutstandingDebts":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"JOtherOutstandingDebts"},"factfind:TotalCashRequired":{"@vpms-suffix":"JProtectionUponDeathTotalCashRequired"},"factfind:TotalRequiredForIncomeProtection":{"@vpms-suffix":"JTotalRequiredForIncomeProtection"},"factfind:ProtectionExistingFundsSetAside":{"@vpms-suffix":"JProtectionExistingFundsSetAside"},"factfind:ProtectionTotalShortfallOrSurplus":{"@vpms-suffix":"JProtectionTotalShortfallOrSurplus"}}},"factfind:RetirementFundInfo":{"@vpms-suffix":"JRetirementFundInfo","factfind:CurrentAge":{"@vpms-suffix":"JCurrentAge"},"factfind:ExpectedRetirementAge":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"JExpectedRetirementAge"},"factfind:CurrentAnnualIncome":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"JCurrentAnnualIncome"},"factfind:PercentIncomeCanLiveInRetirement":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"JPercentIncomeCanLiveInRetirement"},"factfind:AssumedRateOfSalaryIncrease":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"JAssumedRateOfSalaryIncrease"},"factfind:AnnualIncomeRequired":{"@vpms-suffix":"JAnnualIncomeRequired"},"factfind:YearToReceiveRetirementIncome":{"@vpms-suffix":"JYearToReceiveRetirementIncome"},"factfind:RetirementNetRateOfReturn":{"@vpms-suffix":"JRetirementNetRateOfReturn"},"factfind:TotalAmountRequiredAtRetirement":{"@vpms-suffix":"JTotalAmountRequiredAtRetirement"},"factfind:ExistingFundsSetAside":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"JRetirementFundExistingFundsSetAside"},"factfind:TotalShortfallOrSurplus":{"@vpms-suffix":"JRetirementFundTotalShortfallOrSurplus"},"factfind:ReturnOnInvestment":{"@vpms-suffix":"JRetirementFundReturnOnInvestment"},"factfind:ExpectedInterestEarnedFromTheExistingFund":{"@vpms-suffix":"JRetirementFundExpectedInterestEarnedFromTheExistingFund"},"factfind:PossibleOptions":{"@vpms-suffix":"JRetirementFundPossibleOptions","factfind:SingleCapitalSumRequiredForRetirement":{"@vpms-suffix":"JRetirementFundSingleCapitalSumRequiredForRetirement"},"factfind:AnnualSumRequiredForRetirement":{"@vpms-suffix":"JRetirementFundAnnualSumRequiredForRetirement"}}},"factfind:EducationFundInfos":{"@counter":"0","@maxOccurs":"3","@minOccurs":"0","@vpms-suffix":"JEducationFundInfos","factfind:EducationFundInfo":{"@vpms-suffix":"JEducationFundInfo","factfind:ChildName":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"JFullNameChild"},"factfind:ChildCurrentAge":{"@vpms-suffix":"JChildCurrentAge"},"factfind:PlanEducationToStart":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"JPlanEducationToStart"},"factfind:InflationRate":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"JEducationFundInflationRate"},"factfind:TotalEducationFundRequiredToday":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"JTotalEducationFundRequiredToday"},"factfind:TotalEducationFundRequiredTodayStartOfEducation":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"JTotalEducationFundRequiredTodayStartOfEducation"},"factfind:ExistingFundsSetAside":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"JEducationFundExistingFundsSetAside"},"factfind:ExpectedRateOfReturn":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"JExpectedRateOfReturn"},"factfind:ExpectedFutureValueOfFundSetAside":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"JExpectedFutureValueOfFundSetAside"},"factfind:TotalShortfallOrSurplus":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"JEducationFundTotalShortfallOrSurplus"},"factfind:ReturnOnInvestment":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"JEducationFundReturnOnInvestment"},"factfind:ExpectedInterestEarnedFromTheExistingFund":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"JEducationFundExpectedInterestEarnedFromTheExistingFund"},"factfind:PossibleOptions":{"@vpms-suffix":"JEducationFundPossibleOptions","factfind:SingleCapitalSumRequiredForRetirement":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"JEducationFundSingleCapitalSumRequiredForRetirement"},"factfind:AnnualSumRequiredForRetirement":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"JEducationFundAnnualSumRequiredForRetirement"}}}},"factfind:MediumLongTermSavingsInfo":{"@vpms-suffix":"JMediumLongTermSavingsInfo","factfind:PurposeOfSaving":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"JPurposeOfSaving"},"factfind:AmountRequired":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"JAmountRequired"},"factfind:YearOfSavings":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"JYearOfSavings"},"factfind:ExistingFundsSetAside":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"JMediumLongExistingFundsSetAside"},"factfind:TotalShortfallOrSurplus":{"@vpms-suffix":"JMediumLongTotalShortfallOrSurplus"},"factfind:ReturnOnInvestment":{"@vpms-suffix":"JMediumLongReturnOnInvestment"},"factfind:ExpectedInterestEarnedFromTheExistingFund":{"@vpms-suffix":"JMediumLongExpectedInterestEarnedFromTheExistingFund"},"factfind:PosibleOptions":{"@vpms-suffix":"JMediumLongPosibleOptions","factfind:SingleCapitalSumRequiredForRetirement":{"@vpms-suffix":"JMediumLongSingleCapitalSumRequiredForRetirement"},"factfind:AnnualSumRequiredForRetirement":{"@vpms-suffix":"JMediumLongAnnualSumRequiredForRetirement"}}},"factfind:CriticalIllnessInfo":{"@vpms-suffix":"JCriticalIllnessInfo","factfind:CapitalSumRequirement":{"@vpms-suffix":"JCapitalSumRequirement","factfind:ReplacementIncomeNeeded":{"@vpms-suffix":"JCriticalIllnessReplacementIncomeNeeded"},"factfind:NumberOfYearIncomeRequired":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"JCriticalIllnessNumberOfYearIncomeRequired"},"factfind:ProtectionUponDeathNetRateOfReturn":{"@vpms-suffix":"JCriticalIllnessProtectionUponDeathNetRateOfReturn"},"factfind:LumpSumRequired":{"@vpms-suffix":"JCriticalIllnessLumpSumRequired"}},"factfind:CriticalIllnessTotalCashRequirement":{"@vpms-suffix":"JCriticalIllnessTotalCashRequirement","factfind:TreatmentCost":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"JTreatmentCost"},"factfind:Others":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"JOthers"},"factfind:TotalCashRequired":{"@vpms-suffix":"JCriticalIllnessTotalCashRequired"},"factfind:TotalRequiredForCriticalIllness":{"@vpms-suffix":"JTotalRequiredForCriticalIllness"}}},"factfind:MortgageProtection":{"@vpms-suffix":"JMortgageProtection","factfind:MortgageCalculator":{"@vpms-suffix":"JMortgageCalculator","factfind:MortgageValue":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"JMortgageValue"},"factfind:LoanAmount":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"JLoanAmount"},"factfind:LoanInterestRate":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"JLoanInterestRate"},"factfind:LoanTerm":{"@default":"","@editable":"0","@mandatory":"0","@visible":"1","@vpms-suffix":"JLoanTerm"},"factfind:TotalPaid":{"@vpms-suffix":"JTotalPaid"},"factfind:MonthlyPayment":{"@vpms-suffix":"JMonthlyPayment"}}}}}}}}};
		    	 self.detail = data;
		         self.originalDetail = angular.copy(self.detail);
		         deferred.resolve(data);
		     });
		     return deferred.promise;
		 }

		 
		 //common function for core modules: loadIllustrationSubordinatesList, loadProspectSubordinatesList, loadApplicationSubordinatesList, loadClientSubordinatesList, loadFactFindSubordinatesList, loadHomeSubordinatesList
		 /**
		  * Load prospect/illustration/application/client/factfind/home list of subordinates of current user, store in subordinatesItems variable
		  * of core service
		  * @returns {promise}
		  * <dl>
		  * <dt>Resolved with:</dt>
		  * <dd>list of subordinates items</dd>
		  * <dt>Rejected with:</dt>
		  * <dd>not defined</dd>	
		  * </dl>
		  */
		 ListDetailCoreService.prototype.loadSubordinatesList = function(){
			 var self = this;
			 var deferred = self.$q.defer();
			 this.listSubordinatesItems.call(self, function(data){
				 //do somthing else
				 deferred.resolve(data);
			 });
			 return  deferred.promise;
		 };

		 ListDetailCoreService.prototype.showSubordinatesItems = function(fnSuccess){
			 var self = this;
			 self.loadSubordinatesList()
			 .then(function(list) {
				 self.items = angular.copy(self.subordinatesItems);
				 if(commonService.hasValue(fnSuccess)) fnSuccess.call(self); 
			 });
		 };

		 /**

		  */
		 ListDetailCoreService.prototype.login_mobileApp = function(params, data) {
		    var self = this;
		    var deferred = $q.defer();

		    connectService.exeAction({
		    	actionName: "SYSTEM_CHECK_LOGIN",
                actionParams: params,
                resourceURL: undefined,
                data: data
		    })
		    .then(function (data) {			     	
		     	deferred.resolve(data);
		    });
		    return deferred.promise;
		 };

         /**
          * Update valid time for user account when logout
          * @param userName
          * @param validTime
          * @returns {promise}
          */
		ListDetailCoreService.prototype.updateValidTime_mobileApp = function(userName, validTime) {
            var self = this;
            var deferred = $q.defer();

            connectService.exeAction({
                 actionName: "SYSTEM_UPDATE_VALID_TIME",
                 actionParams: [userName, validTime],
                 resourceURL: undefined
            })
            .then(function (data) {
                deferred.resolve(data);
            });
            return deferred.promise;
        };

		 


		  /**
		  * Set profileId and username after login successfully
		  * @param userName
		  * @param profileId
		  * @returns {promise}
		  */
		 ListDetailCoreService.prototype.setProfile_mobileApp = function(userName, profileId) {
		    var self = this;
		    var deferred = $q.defer();
		    connectService.exeAction({
		    	actionName: "CHOOSE_PROFILE",
		    	actionParams: [userName, profileId],
                resourceURL: undefined
		    })
		    .then(function (data) {		  	
		     	deferred.resolve(data);
		    });
		    return deferred.promise;
		 };
		 /**

		  */
		 ListDetailCoreService.prototype.sync_mobileApp = function(syncDocument) {
		    var self = this;
		    var deferred = $q.defer();

		    connectService.exeAction({
		    	actionName: "SYNC_DOCS",
		    	actionParams: [syncDocument],
                resourceURL: undefined
		    })
		    .then(function (data) {		  	
		     	deferred.resolve(data);
		    });
		    return deferred.promise;
		 };

		 //common function for core modules: updateSalecase, updateProspect, updateApplication, updateFactFind, updateHome
		 /**
		  * update an existing prospect/salecase/application/factfind/home with new input data
		  * @param boValidate
		  * @returns {promise}
		  * <dl>
		  * <dt>Resolved with:</dt>
		  * <dd>prospect/salecase updated detail</dd>
		  * <dt>Rejected with:</dt>
		  * <dd>not defined</dd>	
		  * </dl>
		  */
		 ListDetailCoreService.prototype.update = function(boValidate) {
			 var self = this;	 
			 var deferred = $q.defer();
			 this.saveDetail.call(self, boValidate, function(data) {
				 deferred.resolve(data);
			 }, function(data){
				 deferred.reject(data);
			 });
			 return deferred.promise;
		 };
		 
		 ListDetailCoreService.prototype.update_V3 = function(boValidate) {
			 var self = this;	 
			 var deferred = $q.defer();
			 this.saveDetail_V3.call(self, boValidate, function(data) {
				 deferred.resolve(data);
			 }, function(data){
				 deferred.reject(data);
			 });
			 return deferred.promise;
		 };


		 ListDetailCoreService.prototype.computeDocument = function(){
			 var self = this;
			 var deferred = self.$q.defer();
			 //Note: 'productInputs' is an element of self.detail
			 var dataSet = self.extractUiDataSet(self.detail);
			 var url = self.commonService.getUrl(self.commonService.urlMap.DOCUMENT_COMPUTE, [self.name]);
			 self.ajax.post(url, dataSet).success(function(dtoResult){//data = module detail
				 self.detail = dtoResult;
				 //check if valid
				 var valid = self.checkValid(dtoResult);
				 if (valid.validResult){
					 //do something
					 deferred.resolve(dtoResult);
				 }else{
					 deferred.reject(valid.validMessage);
				 }
			 });
			 return  deferred.promise;
		 };
		 
		 ListDetailCoreService.prototype.computeModule = function(resourceURL){
			 var self = this;
			 var deferred = self.$q.defer();
			 //var productName = self.findElementInDetail_V3(['DocInfo']).Product;
			 var productName = self.findElementInDetail_V3(['Header', 'Product'], {'errorOn': false, 'returnLastFound': false});
			 var transactionType = self.getCaseTransactionType();
			 
			 var dataSet =  self.extractUiDataSet_V3(self.detail);
			 if (self.name == commonService.CONSTANTS.MODULE_NAME.POLICY) 
				 var url = self.commonService.getUrl(self.commonService.urlMap.POLICY_COMPUTE_V3, []);
			 else
				 var url = self.commonService.getUrl(self.commonService.urlMap.DOCUMENT_COMPUTE_V3, [self.name, productName, transactionType]);
			 self.ajax.postRuntime(resourceURL,url, dataSet,function(data){//data = module detail
				 if(self.isSuccess(data)){	//validate success
					 self.updateDetailData_V3(data);
				 } else{	//validate fail
					 self.mergeErrorToDetail(self.findElementInElement_V3(data, ['ipos-response:response-message']));
				 }
				 deferred.resolve(data);
			 });
			 return  deferred.promise;
		 };

		 ListDetailCoreService.prototype.computeModuleWithDetail = function computeModuleWithDetail (resourceURL, detail){
			 var self = this;
			 var deferred = self.$q.defer();
			 //var productName = self.findElementInElement_V3(detail, ['DocInfo']).Product;
			 var productName = self.findElementInDetail_V3(['Header', 'Product'], {'errorOn': false, 'returnLastFound': false});
			 var transactionType = self.getCaseTransactionType();

			 var dataSet = detail;
			 var docType = self.findElementInElement_V3(detail, ['DocType']);
			 var actionName = undefined;
			 if (docType == "policy")
				 actionName = "POLICY_COMPUTE_V3";
			 else
				 actionName = "DOCUMENT_COMPUTE_V3";
			 /*if (docType == "policy") 
				 var url = self.commonService.getUrl(self.commonService.urlMap.POLICY_COMPUTE_V3, []);
			 else
				 var url = self.commonService.getUrl(self.commonService.urlMap.DOCUMENT_COMPUTE_V3, [docType, productName, transactionType]);
			 
			 self.ajax.postRuntime(resourceURL,url, dataSet,function(data){//data = module detail
				 if(self.isSuccess(data)){	//validate success
					 self.updateDetailData_V3(data);
				 } else{	//validate fail
					 self.mergeErrorToElement(self.findElementInElement_V3(data, ['ipos-response:response-message']), detail);
				 }
				 deferred.resolve(data);
			 });*/
			 
			 connectService.exeAction({
		    	actionName: "DOCUMENT_COMPUTE_V3",
		    	actionParams: [docType, productName, transactionType],
		    	data: dataSet,
		    	resourceURL: resourceURL
			 }).then(function(data) {
					 if(self.isSuccess(data)){	//validate success
						 self.updateDetailData_V3(data);
					 } else{	//validate fail
						 self.mergeErrorToElement(self.findElementInElement_V3(data, ['ipos-response:response-message']), detail);
					 }
				 	deferred.resolve(data);	
				}
			 );
			 
			 return  deferred.promise;
		 };
		 
		 ListDetailCoreService.prototype.isElementValid = function isElementValid (element){
		 	var self = this;
		 	var result = true;
		 	if (typeof(element) !== 'string'){
		 		// return immidiately if errorMessage exists
			 	if (commonService.hasValueNotEmpty(element['errorMessage']))
			 		return false;
			 	// check mandatory field when element is leaf node
				if ('Value' in element || '$' in element || '@visible' in element || '@mandatory' in element){
					if (element['@mandatory'] === '1'){
						var data = element.Options ? element.Value : element.$;
		    			if (!commonService.hasValueNotEmpty(data)){
		    				result = false;
		    				return result;
		    			}
					}
				}
				// loop to leaf node
				else{
					if (element['@minOccurs'] > element['@counter']){//element not valid if counter less than minoccurr
						return false;
					}
					if ('@counter' in element && element['@counter'] == 0){
						return result;
					}
					else{
						for(var prop in element){
							if (typeof(element[prop]) === 'object'){
								result = self.isElementValid(element[prop]);
								if (!result){
									break;
								}
							}
						}
					}
				}
			}
    		return result;
		 };

		 ListDetailCoreService.prototype.refresh_V3 = function(resourceURL,productName){
			 var self = this;
			 var deferred = self.$q.defer();
			 var dataSet = self.extractUiDataSet_V3(self.detail, ["Option"]);
			 var transactionType = self.getCaseTransactionType();				 
			 var url = self.commonService.getUrl(self.commonService.urlMap.REFRESH, [self.name, productName, transactionType]);
			 
			/* self.ajax.postRuntime(resourceURL,url, dataSet,function(data){//data = module detail
				if(self.isSuccess(data)){	//validate success
					 //self.updateDetailData_V3(data);
					 self.detail = data;
				 } else{	//validate fail
					 self.mergeErrorToDetail(self.findElementInElement_V3(data, ['ipos-response:response-message']));
				 }
				 deferred.resolve(data);
			 });*/
			 
			 connectService.exeAction({
			    	actionName: "REFRESH",
			    	actionParams: [self.name, productName, transactionType],
			    	data: dataSet,
			    	resourceURL: resourceURL
			    }).then(function(data){
			    	if(self.isSuccess(data)){	//validate success
						 self.detail = data;
					 } else{	//validate fail
						 self.mergeErrorToDetail(self.findElementInElement_V3(data, ['ipos-response:response-message']));
					 }
					 deferred.resolve(data);					
			    });
			 
			 return  deferred.promise;
		 };

		 /**
		  * Compute and validate document
		  * @param docData Document dataset
		  */
		 ListDetailCoreService.prototype.computeAndValidateDocumentData = function(docData) {
			 var self = this;
			 var deferred = self.$q.defer();
			 var dataSet = self.extractUiDataSet(docData);
			 var url = self.commonService.getUrl(self.commonService.urlMap.DOCUMENT_COMPUTE, [self.name]);
			 self.ajax.post(url, dataSet).success(function(dtoResult){
				 //check if valid
				 var valid = self.checkValid(dtoResult);
				 if (valid.validResult){
					 deferred.resolve(dtoResult);
				 }else{
					 deferred.reject(valid.validMessage);
				 }
			 });
			 return  deferred.promise;
		 };

		 ListDetailCoreService.prototype.classForValidStateOfDocument = function(document) {
			 return this.isInvalidObject(document) ? "failure-card" : "success-card";
		 };

		 /**
		  * Get CSS class of Review card by Review Status
		  * @param review Review metadata
		  * @returns CSS class
		  */
		 ListDetailCoreService.prototype.classForValidStateOfReview = function(review) {
			 var self = this;
			 return self.getMetaProperty(review, 'StatusOfReview') === commonService.CONSTANTS.STATUS.PENDING ? "failure-card" : "success-card";
		 };

		 ListDetailCoreService.prototype.classForStarStateOfDocument = function(document) {
			 return this.isStarredObject(document) ? "icon-star" : "icon-star-empty";
		 };

		 ListDetailCoreService.prototype.getGenderText = function(genderValue) {
			 var genderText = "";
			 if(genderValue == "M")
				 genderText = "Male";
			 else if(genderValue == "F")
				 genderText = "Female";
			 return genderText;
		 };

		 ListDetailCoreService.prototype.getModuleLazyChoicelist = function() {
			 var self = this;
			 var deferred = self.$q.defer();
			 var url = commonService.getUrl(commonService.urlMap.MODULE_LAZY_CHOICELIST, [self.name]);
			 self.ajax.get(url).success(function(data){
				 self.lazyChoicelist = data;
				 deferred.resolve();	
			 });
			 return deferred.promise;
		 };
		 
		 ListDetailCoreService.prototype.getModuleLazyChoicelist_V3 = function(resourceURL, productName) {
			 var self = this;
			 var deferred = self.$q.defer();
			 var urlMap = undefined;
			 // if(productName){
				//  urlMap = commonService.urlMap.MODULE_PRODUCT_LAZY_CHOICELIST_V3; //get lazy choice list for module with product
			 // }else{
				//  urlMap = commonService.urlMap.MODULE_LAZY_CHOICELIST_V3; //get lazy choice list for module without product
			 // }
			 
			 urlMap = commonService.urlMap.MODULE_LAZY_CHOICELIST_V3;
			 var transactionType = self.getCaseTransactionType();
			 if (transactionType === "ENDORSEMENT") transactionType = "Endorsement";
			 
			 // var url = commonService.getUrl(urlMap, [self.name, productName, transactionType]);
			 // self.ajax.getRuntime(resourceURL, url, function(data){
			connectService.exeAction({
		    	actionName: "MODULE_LAZY_CHOICELIST_V3",
		    	actionParams: [self.name, productName, transactionType],		    	
		    	resourceURL: resourceURL
		    }).then(
		     	function(data){
					self.lazyChoicelist = data;
					deferred.resolve(data);						
			});
			return  deferred.promise;
		 };

		 /**
		  * This function use to get Lazy List for module which seperate by product (Illustration, Application,...)
		  */
		 ListDetailCoreService.prototype.getLazyChoiceListByModuleAndProduct_V3 = function(resourceURL,productName) {
			 var self = this;
			 var deferred = self.$q.defer();
			 var transactionType = self.getCaseTransactionType();
			 if ((self.name === "case-management") && !transactionType) {
				transactionType = "NewBusiness"
					}
			 else if (transactionType === "ENDORSEMENT") transactionType = "Endorsement";
			 
			 // var url = commonService.getUrl(commonService.urlMap., );
			 // self.ajax.getRuntime(resourceURL, url,

			connectService.exeAction({
		    	actionName: "MODULE_LAZY_CHOICELIST_V3",
		    	actionParams: [self.name, productName, transactionType],		    	
		    	resourceURL: resourceURL
		    }).then(
		     	function(data){
				 	//self.lazyChoicelist = data;
				 	deferred.resolve(data);						
			});
			return  deferred.promise;
		 };
		 
		 ListDetailCoreService.prototype.archiveDocumentByMetadata = function(documentMetadata) {
			 var self = this;
			 var deferred = self.$q.defer();
			 var actionUrl = self.name;
			 actionUrl = commonService.getUrl(commonService.urlMap.DOCUMENT_ARCHIVE, [ self.name, documentMetadata.uid ]);		
			 self.ajax.post(actionUrl).success(function(result) {
				 if (result == 'true'){				
					 commonService.showGlobalMessage(appService.getI18NText('workspace.archive.success'));				
				 } else {
					 commonService.showGlobalMessage(appService.getI18NText('workspace.archive.fail'), "danger");
				 }
				 deferred.resolve(result);			
			 });
			 return deferred.promise;

		 };


		 ListDetailCoreService.prototype.translateLazyListField = function(lazyList,lazyChoiceField, lazyChoicePrefix){
			var fieldNode = this.findElementInElement_V3(lazyList,[lazyChoiceField,'Option']);
			// convert to array if option has 1 item 
			if(fieldNode.length == undefined){
				var array = fieldNode;
				fieldNode = [];
				if(array!=undefined || array!=''){
					fieldNode.push(array);
				}
			}
			for (var int = 0; int < fieldNode.length; int++) {
				fieldNode[int].translate=$translate.instant(lazyChoicePrefix+fieldNode[int].value);
			}
			fieldNode = $filter('orderBy')(fieldNode,'translate');
			this.findElementInElement_V3(lazyList,[lazyChoiceField])['Option']=fieldNode;
		};

		 /**
		  * Archive an existing document
		  */
		 ListDetailCoreService.prototype.archiveDocument = function() {
			 var self = this;
			 var deferred = self.$q.defer();
			 var dataSet = self.extractUiDataSet(self.detail);
			 var actionUrl = self.name;
			 actionUrl = commonService.getUrl(commonService.urlMap.DOCUMENT_ARCHIVE, [ self.name, self.detail.uid ]);		
			 self.ajax.post(actionUrl, dataSet).success(function(result) {
				 if (result == 'true') {
					 if (commonService.hasValue(self.items)) {
						 for ( var i = 0; i < self.items.length; i++) {
							 var item = self.items[i];
							 if (item.uid == self.detail.uid){
								 self.items.splice(i, 1);
							 }
						 }			
					 }
					 self.detail = self.originalDetail;
				 }
				 deferred.resolve(result);
			 });
			 return deferred.promise;
		 };	
		 
		 ListDetailCoreService.prototype.archiveDocument_V3 = function(resourceURL, docId) {
			 var self = this;
			 var deferred = self.$q.defer();
			 var actionUrl = commonService.getUrl(commonService.urlMap.DOCUMENT_ARCHIVE_V3, [ docId ]);		
			 self.ajax.postRuntime(resourceURL, actionUrl, {}, function(data){	
				 deferred.resolve(data);
			 });
			 return deferred.promise;
		 };
		 
		 ListDetailCoreService.prototype.starDocument_V3 = function(resourceURL, docId) {
			 var self = this;
			 var deferred = self.$q.defer();
			 var actionUrl = commonService.getUrl(commonService.urlMap.DOCUMENT_STAR_V3, [ docId ]);		
			 self.ajax.postRuntime(resourceURL, actionUrl, {}, function(data){
				 deferred.resolve(data);
			 });
			 return deferred.promise;
		 };

		 ListDetailCoreService.prototype.unStarDocument_V3 = function(resourceURL, docId) {
			 var self = this;
			 var deferred = self.$q.defer();
			 var actionUrl = commonService.getUrl(commonService.urlMap.DOCUMENT_UNSTAR_V3, [ docId ]);		
			 self.ajax.postRuntime(resourceURL, actionUrl, {}, function(data){	
				 deferred.resolve(data);
			 });
			 return deferred.promise;
		 };
		 
		 ListDetailCoreService.prototype.getMetaObject = function(objectType) {
			 var self = this;
			 for (var i = 0; i < self.METAOBJECTS.length; i++) {
				 if (objectType == self.METAOBJECTS[i].objectType) {
					 return self.METAOBJECTS[i];
				 }
			 }
			 return undefined;
		 };
		 	 
		 ListDetailCoreService.prototype.hasAnyObject = function(objList, objectType) {    //objList is this.salecase or this.factfind, ...
			var metaObject = this.getMetaObject(objectType);
			var flag = false;
			if (metaObject == undefined) {
				return flag;
			}else{
				if (metaObject.isMultiple()) {
					return (objList[objectType].length > 0);
				} else {
					return (objList[objectType] != undefined);
				}
			}
//			return flag;
		};
		
		ListDetailCoreService.prototype.getObject = function(objList, objectType, uid, relationship) { //objList is this.salecase or this.factfind, ...
			var metaObject = this.getMetaObject(objectType);
			
			if (metaObject == undefined) {
				throw new Error("No such salecase object type " + objectType);
			}
			
			if (metaObject.isMultiple()) {
				for (var i = 0; i < objList[objectType].length; i++) {
					if ((objList[objectType][i].uid == uid) &&
							//check the relationship in case of the PROSPECT type
							((objectType != commonService.CONSTANTS.SALECASE.PROSPECT_KEY) || (objList[objectType][i].relationship == relationship))) {
						return objList[objectType][i];
					}
				}
			} else {
				if (objList[objectType] != undefined && objList[objectType].uid == uid) {
					return objList[objectType]; 
				}
			}

			return undefined;
		};
		
		ListDetailCoreService.prototype.getObjectByUid = function(objList, uid) { //objList is this.salecase or this.factfind,...
			var self = this;
			for (var i = 0; i < self.METAOBJECTS.length; i++) {
				var objectType = self.METAOBJECTS[i].objectType;
				if (self.METAOBJECTS[i].isMultiple()) {
					for (var j = 0; j < objList[objectType].length; j++) {
						if (objList[objectType][j] != undefined && objList[objectType][j].uid == uid) {
							return objList[objectType][j];
						}
					}
				} else {
					if (objList[objectType] != undefined && objList[objectType].uid == uid) {
						return objList[objectType];
					}
				}
			}
			throw new Error("Cannot find the object with uid " + uid);
		};
		
		ListDetailCoreService.prototype.getProspectsWithRelationship = function(objList, relationship) {
			var retObjects = new Array();
			if(objList[commonService.CONSTANTS.SALECASE.PROSPECT_KEY] == undefined)
				return undefined;
			
			for (var i = 0; i < objList[commonService.CONSTANTS.SALECASE.PROSPECT_KEY].length; i++) {
				if (objList[commonService.CONSTANTS.SALECASE.PROSPECT_KEY][i].relationship == relationship) {
					retObjects.push(objList[commonService.CONSTANTS.SALECASE.PROSPECT_KEY][i]);		
				}
			}
			return retObjects.length > 0 ? retObjects : undefined;
		};
		
		

		 ListDetailCoreService.prototype.setProperty = function(parent, name, value) {
			 if (parent === undefined) {
				 return false;
			 }
			 var properties = parent.properties;
			 if (properties === undefined) return false;
			 for ( var i = 0; i < properties.length; i++) {
				 var property = properties[i];
				 if (property.name == name){
					 property.value = value;
					 return true;
				 }
			 }
			 return false;
		 };

		 ListDetailCoreService.prototype.getOwnerEmails = function(ownerUid) {
			 var self = this;
			 var deferred = self.$q.defer();
			 var url = commonService.getUrl(commonService.urlMap.OWNER_EMAIL, [ self.name, ownerUid ]);		
			 ajax.get(url).success(function(emailsResult){
				 //convert to string
				 var strEmails = "";
				 for ( var i = 0; i < emailsResult.length; i++) {
					 var email = emailsResult[i];
					 if (email !== null){
						 strEmails += email;
					 }
					 if (i < emailsResult.length - 1){
						 strEmails += ";";
					 }
				 }
				 deferred.resolve(strEmails);
			 }).error(function(errorMessage){
				 deferred.reject("");
			 });
			 return  deferred.promise;
		 };

		 /**
		  * Compute a document and prepare data on user session for generating pdf
		  */
		 ListDetailCoreService.prototype.generateDocument = function(){
			 var self = this;
			 var deferred = self.$q.defer();
			 var dataSet = self.extractUiDataSet(self.detail);
			 var url = commonService.getUrl(self.commonService.urlMap.DOCUMENT_GENERATE, [self.name]);
			 self.ajax.post(url, dataSet).success(function(resultDto){//data = application
				 if(resultDto.status !== 'ISSUED'){
					 //check if valid
					 var valid = self.checkValid(resultDto);
					 if (valid.validResult){
						 self.clearErrorsInElement(self.detail);
						 deferred.resolve(resultDto);
					 }else{
						 self.detail = resultDto;
						 deferred.reject(valid.validMessage);
					 }
				 } 
				 else deferred.resolve(resultDto);
			 });
			 return  deferred.promise;
		 };	
		 
		 /**
		  * Compute a document and prepare data on user session for generating pdf V3
		  */
		 ListDetailCoreService.prototype.generateDocument_V3 = function(portletId) {
			 var self = this;
			 var deferred = $q.defer();

			 /// if is android not call
             if(window.cordova){
               deferred.resolve(self.detail);
               return deferred.promise;
             }

			 if (commonService.hasValueNotEmpty(self.findElementInElement_V3(self.detail,['POLICY']))) { //for policy MNC travel
				 var dataSet = self.detail;
				 var docType = "policy";
				 var product = "travel-express";
			 }
			 else {
				 var dataSet = self.extractUiDataSet_V3(self.detail);
				 var docType = self.findElementInDetail_V3(['DocType']);
				 var product = self.findElementInDetail_V3(['Header', 'Product'], {'errorOn': false,  'returnLastFound': false});
			 }

			 var resourceURL = self.initialMethodPortletURL(portletId, "prepareDataPdf");
			 if (!(window.cordova || window.Liferay.Fake)) {
				 resourceURL.setParameter("docType", docType);
			 }
//			 var url = undefined;
			 
			 // if (!commonService.hasValueNotEmpty(product)) {
				//  url = commonService.getUrl(commonService.urlMap.DOCUMENT_COMPUTE_V3, [self.name]);
			 // } else {
			 // 	 url = commonService.getUrl(commonService.urlMap.MODULE_COMPUTE, [self.name, product]);
			 // }

			 product = product || "";
//			 url = commonService.getUrl(commonService.urlMap.DOCUMENT_COMPUTE_V3, [self.name, product]);

			 resourceURL = resourceURL.toString();
			 /*ajax.postRuntime(resourceURL, url, dataSet, function(result) {
				 if(self.isSuccess(result)){	//validate success
					 self.detail = result;
				 } else{	//validate fail
					 self.mergeErrorToDetail(self.findElementInElement_V3(result, ['ipos-response:response-message']));
				 }
				 deferred.resolve(result);
			 });*/
			 
			 connectService.exeAction({
		    	actionName: "DOCUMENT_COMPUTE_V3",
		    	actionParams: [self.name, product],
		    	data: dataSet,
		    	resourceURL: resourceURL
			 }).then(function(data) {
					if(self.isSuccess(data)){
						 self.detail = data;
				 	} else{
				 		self.mergeErrorToDetail(self.findElementInElement_V3(data, ['ipos-response:response-message']));
				 	}
				 	deferred.resolve(data);	
				}
			 );
		 
			 return deferred.promise;
		 };	
		 
		 /**
		  * get Notification counting
		  */
		 ListDetailCoreService.prototype.getNotificationCounting_V3 = function(portletId) {
			 var self = this;
			 var deferred = $q.defer();
			 var resourceURL = self.initialMethodPortletURL(portletId, "countNotification");
			 //resourceURL.setParameter("docType", docType);
			 var url = undefined;
			 resourceURL = resourceURL.toString();
			 ajax.getRuntime(resourceURL, url, function(result) {
				 deferred.resolve(result);
			 });
			 return deferred.promise;
		 };	
		 
		 /**
		  * remove Notification counting
		  */
		 ListDetailCoreService.prototype.removeNotificationCounting_V3 = function(portletId) {
			 var self = this;
			 var deferred = $q.defer();
			 var resourceURL = self.initialMethodPortletURL(portletId, "removeNotification");
			 //resourceURL.setParameter("docType", docType);
			 var url = undefined;
			 resourceURL = resourceURL.toString();
			 ajax.getRuntime(resourceURL, url, function(result) {
				 deferred.resolve(result);
			 });
			 return deferred.promise;
		 };	

		 ListDetailCoreService.prototype._setProperty = function(parent, name, value) {
			 if (parent === undefined) {
				 return false;
			 }
			 var properties = parent.properties;
			 if (properties === undefined) return false;
			 for ( var i = 0; i < properties.length; i++) {
				 var property = properties[i];
				 if (property.name == name){
					 property.value = value;
					 return true;
				 }
			 }
			 return false;
		 };

		 ListDetailCoreService.prototype.checkValidTextsInDetail = function(eleNames){
			 var self = this;
			 return self.checkValidTextsInElement(self.detail, eleNames);
		 };

		 ListDetailCoreService.prototype.checkValidTextsInElement = function(parentEle, eleNames){
			 var self = this;
			 if(parentEle === undefined || eleNames === undefined || eleNames.length == 0) 
				 return true;

			 var pass = true;
			 for (var i = 0; i < eleNames.length; i++){
				 var eleName = eleNames[i];
				 var phrase = self.findPropertyInElement(parentEle, [eleName], 'value').value;
				 var message = undefined;
				 if (commonService.hasValueNotEmpty(phrase)){
					 message = self.checkValidPhrase(phrase);
				 }
				 if (commonService.hasValueNotEmpty(message)){
					 pass = false;
				 }

				 // Update validate property whether valid or not
				 var propValidate = self.findPropertyInElement(parentEle, [eleName], 'validate');
				 if (propValidate)  {
					 propValidate.value = message;
				 } else {
					 var newProp = new Object();
					 newProp.name = 'validate';
					 newProp.value = message;
					 newProp.text = '';
					 var properties = self.findElementInElement(parentEle, [eleName]).properties;
					 properties.push(newProp);
				 }
			 }
			 return pass;
		 };

		 ListDetailCoreService.prototype.checkValidPhrase = function(phrase){

			 //check first character mustn't space 
			 //=> do not need to check because text fields in detail are already truncated
			 //	var firstCharRegex = /^\s/;
			 //	if (firstCharRegex.exec(fullname)){
			 //		pass = false;
			 //		return appService.getI18NText('workspace.text.hint.firstCharacter');
			 //	}

			 //check valid characters
			 var characterRegex = /^[A-Za-z0-9\'\-\(\)\&\#\%\.\@\/\,\s]*$/;
			 if (!characterRegex.exec(phrase)){
				 return appService.getI18NText('workspace.text.hint.validCharacter');
			 }

			 //check maximum one space
			 var twoSpaceRegex = /\s(\s)+/;
			 if (twoSpaceRegex.exec(phrase)){
				 return appService.getI18NText('workspace.text.hint.spacing');
			 }

			 //check hyphen
			 var hyphenRegex = /(\s)(?=\-)/;
			 if (hyphenRegex.exec(phrase)){
				 return appService.getI18NText('workspace.text.hint.hyphen');
			 }

			 //check apostrophe
			 var apostropheRegex = /(\s)(?=\')/;
			 if (apostropheRegex.exec(phrase)){
				 return appService.getI18NText('workspace.text.hint.apostrophe');
			 }

			 //check comma exists and correct comma usage
			 var commaRegex = /\,/;
			 if (commaRegex.exec(phrase)){
				 var commaRegex1 = /(\s)+\,/;
				 var commaRegex2 = /\,(?!\s)/;
				 if (commaRegex1.exec(phrase) || commaRegex2.exec(phrase)) {
					 return appService.getI18NText('workspace.text.hint.comma');
				 }
			 }

			 //check at least two characters
			 var manyCharRegex = /[A-Za-z0-9\'\-\(\)\&\#\%\.\@\/\,].*?[A-Za-z0-9\'\-\(\)\&\#\%\.\@\/\,]/;
			 if (!manyCharRegex.exec(phrase)){
				 return appService.getI18NText('workspace.text.hint.numCharacter');
			 }

			 return "";
		 };

		 ListDetailCoreService.prototype.buildHintText = function(keys){
			 var messages = [];
			 for (var i = 0; i < keys.length; i++){
				 var key = keys[i];
				 var message = appService.getI18NText(key);
				 messages.push(message);				
			 }
			 return messages;
		 };

		 ListDetailCoreService.prototype.setParentDoc = function(docType, uid) {
			 var self = this;
			 self.detail.parentDocType = docType;
			 self.detail.parentUid = uid;
		 };

		 //return list of prospect from salecase with this kind of relationship
		 ListDetailCoreService.prototype.getProspectsUidsWithRelationshipFromSalecaseDetail = function(salecaseDetail, relationship){
			 var self = this;
			 var result = [];

			 var prospects = this.loadProspectsFromSalecaseDetail(salecaseDetail);
			 for (var i = 0; i < prospects.length; i++) {
				 var relation = self.findPropertyInElement(prospects[i], ['Relationship'],'value').value;

				 if(relation == relationship){
					 result.push( self.findPropertyInElement(prospects[i], ['Uid'],'value').value);
				 }
			 };

			 return result;
		 }

		 ListDetailCoreService.prototype.loadProspectsFromSalecaseDetail = function(salecaseDetail){				
			 return this.findElementInElement(salecaseDetail, ['Prospects']).elements;
		 }

		 ListDetailCoreService.prototype.loadProspectUidsFromSalecaseDetail = function(salecaseDetail){		
			 var salecaseProspectUids = [];
			 var prospects = this.loadProspectsFromSalecaseDetail(salecaseDetail);

			 for (var i = 0; i < prospects.length; i++) {


				 //put PR to the first in list			
				 var uid = this.findPropertyInElement(prospects[i], ['Uid'],'value').value;
				 if (commonService.hasValueNotEmpty(uid)) {

					 var relationship = this.findPropertyInElement(prospects[i], ['Relationship'],'value').value;
					 if(relationship == 'PR'){
						 salecaseProspectUids.unshift(uid);
					 }else{
						 salecaseProspectUids.push(uid);
					 }
				 }
			 };

			 return salecaseProspectUids;
		 }

		 ListDetailCoreService.prototype.loadProspectUidsFromPreDefineProspect = function(prospects){
			 var self = this;
			 var salecaseProspectUids = [];
			 if (commonService.hasValue(prospects)) {
				 for (var i = 0; i < prospects.length; i++) {
					 if (commonService.hasValueNotEmpty(prospects[i].uid)) {

						 //put PR to the first in list	
						 if(prospects[i].relationship == 'PR')
							 salecaseProspectUids.unshift(prospects[i].uid);
						 else
							 salecaseProspectUids.push(prospects[i].uid);
					 }
				 }
			 }
			 return salecaseProspectUids;
		 };

		 /**
		  * 
		  * @param tags is object {input:[],output:[],valid:[]}
		  * @param elementName is array of element name
		  * @returns {String}
		  */
		 //moduleService.validTagInElement(item, {input:['Riders'],output:['Rider_Summary'],valid:['Validate_Rider']})
		 ListDetailCoreService.prototype.validTagAndElement = function(tags, elementNames, excludeElementNames){
			 var self = this;

			 var tagsIn = tags.input;
			 var tagsOut = tags.output;
			 var tagsValid = tags.valid;

			 var	validElement = self.checkValidElementsInDetail(elementNames, excludeElementNames).validResult;//ok

			 var objValidTag = self.checkValidTags(tagsIn, excludeElementNames);//ok
			 var validTag = objValidTag.validResult;

			 var validPropValue = true;
			 var isNoError = true;
			 if (commonService.hasValue(tagsOut)) {
				 validPropValue = self.checkValueElementsInDetailByTags(tagsOut).validResult;//ok
			 }	
			 if(commonService.hasValue(tagsValid)){
				 isNoError = self.getArrayErrorCode(self.findPropertyInDetail(tagsValid,'value').value).length > 0 ? false : true; 
			 }
			 if(validTag && validElement && validPropValue && isNoError)		//success
				 return "success-card";
			 else								//error
				 return "failure-card";
		 };
		 
		 ListDetailCoreService.prototype.refreshTags = function (resourceURL, element){
             function updateNewDetail (element, src, des) {
                 for (var i = 0; i < element.length; i++){
                     var computedObj = self.findElementInElement_V3(des, element[i]);
                     var objInDetail = self.findElementInElement_V3(src, element[i]);
                     $.extend(true, objInDetail, computedObj);
                 }
              }

             var self = this;
             var deferred = $q.defer();
             
             // Get the tag(s) list
             if ($.isArray(element)){
                 var tag = [];
                 var tagName="";
                 for (var i=0; i<element.length; i++){
                	 if(element[i]['@vpms-suffix']){
                		 tag.push(element[i]['@vpms-suffix']);
                	 }else{
                		 var obj = self.findElementInDetail_V3(element[i]);
                         if(commonService.hasValueNotEmpty(obj)){
                             tag.push(obj['@vpms-suffix']);
                            // tagName = tag.toString();
                         }//else
                	 }
                 }
                 tagName = tag.toString();
             }
             else{
                 var tagName = element['@vpms-suffix'];
             }
             
             var obj = angular.copy(self.detail);
             obj = self.extractUiDataSet_V3(obj, ["Option"]);
             self.removeErrorMessageNodeInElement(obj);
             var product = self.findElementInDetail_V3(['Header', 'Product'], {'errorOn': false, 'returnLastFound': false});
             var transactionType = self.getCaseTransactionType();
             var url = commonService.getUrl(self.commonService.urlMap.REFRESH_TAG, [self.name, product, tagName, transactionType]);
             
             /*ajax.postRuntime(resourceURL, url, obj, function (data){
                 if(self.isSuccess(data)) {
                	 self.convertElementsToArrayInElement_V3(data);
                     updateNewDetail(element, self.detail, data);
                 }
                 deferred.resolve(self.detail);
             });*/
             
             connectService.exeAction({
			    	actionName: "REFRESH_TAG",
			    	actionParams: [self.name, product, tagName, transactionType],
			    	data: obj,
			    	resourceURL: resourceURL
			    }).then(function(data){
			    	/* if(self.isSuccess(data)) {
	                	 self.convertElementsToArrayInElement_V3(data);
	                     updateNewDetail(element, self.detail, data);
	                 }*/
	                 if(self.isSuccess(data)){	//validate success
                          //self.detail = data;
                          self.convertElementsToArrayInElement_V3(data);
                          updateNewDetail(element, self.detail, data);
                      } else{	//validate fail
                          self.mergeErrorToDetail(self.findElementInElement_V3 (data, ['ipos-response:response-message']));
                      }
	                 deferred.resolve(self.detail);					
			    });
             
             return deferred.promise;
		 };
		 
		 /**
		  * Compute tags by VPMS function name
		  * @param {String} resourceURL For calling portal
		  * @param {String} functionName VPMS function
		  * @param {Array} removeList List of node need to remove when extract data set
		  */
		 ListDetailCoreService.prototype.computeByFunction = function (resourceURL, functionName, removeList){
			 removeList = removeList || [];
             var self = this;
             var deferred = $q.defer();
             var obj = angular.copy(self.detail);
             obj = self.extractUiDataSet_V3(obj, ["Option"].concat(removeList));
             self.removeErrorMessageNodeInElement(obj);
             var product = self.findElementInDetail_V3(['Header', 'Product'], {'errorOn': false, 'returnLastFound': false});
             connectService.exeAction({
            	 actionName: 'COMPUTE_BY_FUNCTION_NAME',
            	 actionParams: [self.name, product, functionName],
            	 data: obj,
            	 resourceURL: resourceURL
			 }).then(function(data){
				 deferred.resolve(data);
			 });
             return deferred.promise;
		 };
		 
		 ListDetailCoreService.prototype.sendNotificationWithEventCode = function(resourceURL, params) {
			var self = this;
			var deferred = self.$q.defer();
			connectService.exeAction({
			   	actionName: "SEND_NOTIFICATION_WITH_EVENT_CODE",
			   	actionParams: [params.caseId, params.eventCode],
			   	resourceURL: resourceURL
			}).then(function(data){
				deferred.resolve(data);
			});
			return deferred.promise;
		 };
		 
		 ListDetailCoreService.prototype.computeElementAndUpdateLazyList = function (resourceURL, element){
			 var self = this;
			 self.originalDetail = angular.copy(self.detail);
			 var deferred = $q.defer();

			 // Get the tag(s) list
			 if ($.isArray(element)){
				 var tag = [];
				 var tagName="";
				 for (var i=0; i<element.length; i++){
				 	var obj = self.findElementInDetail_V3(element[i]);
					 if(commonService.hasValueNotEmpty(obj)){
						 tag.push(obj['@vpms-suffix']);
						// tagName = tag.toString();
					 }//else
					 
				 }
				 tagName = tag.toString();
			 }
			 else{
				 var tagName = element['@vpms-suffix'];
			 }

			 // Get the object which is passed to runtime
			 // if (element.length > 1){
			 // 	var obj = angular.copy(self.removeErrorMessageNodeInElement(self.detail));
			 // }
			 // else{
			 // 	var obj = self.findElementInDetail_V3(element[0]);
			 // }
			 
			 var obj = angular.copy(self.detail);
			 obj = self.extractUiDataSet_V3(obj, ["Option"]);
			 self.removeErrorMessageNodeInElement(obj);
			 //var product = self.findElementInDetail_V3(['Product']);
			 var product = self.findElementInDetail_V3(['Header', 'Product'], {'errorOn': false, 'returnLastFound': false});
			 var transactionType = self.getCaseTransactionType();
			 // if(commonService.hasValueNotEmpty(product))
			 // 	var url = commonService.getUrl(self.commonService.urlMap.COMPUTE_BY_TAG_NAME_WITH_PRODUCT,[ self.name, tagName, product ]); 
			 // else
			 // 	var url = commonService.getUrl(self.commonService.urlMap.COMPUTE_BY_TAG_NAME_WITHOUT_PRODUCT,[ self.name, tagName]); 
			 var url = commonService.getUrl(self.commonService.urlMap.COMPUTE_BY_TAG_NAME,[ self.name, tagName, product, transactionType]); 
			 
			 /*ajax.postRuntime(resourceURL, url, obj, function (data){
				 if(self.isSuccess(data)){	//validate success
					 self.convertElementsToArrayInElement_V3(data);
					 //self.detail = data;
					 //updateLazyList(self, !$.isArray(element) ? element:self.findElementInDetail_V3(element) );
					 //updateLazyList(self, element, data);
					 if (commonService.hasValueNotEmpty(self.productName) 
							 && commonService.hasValueNotEmpty(self.lazyChoiceList[self.productName])){
						 updateLazyList_OLD (self, data)
					 }
					 
					 updateNewDetail(element, self.detail, data);
					 //updateLazyList_OLD (self, self.detail)
					 //clearDataOptionInDetail(self.detail);
				 }
			 	 deferred.resolve(self.detail);
			 });
			 */
			 connectService.exeAction({
		    	actionName: "COMPUTE_BY_TAG_NAME",
		    	actionParams: [self.name, tagName, product, transactionType],
		    	data: obj,
		    	resourceURL: resourceURL
		     }).then(function(data){
		    	 if(self.isSuccess(data)){	//validate success
					 self.convertElementsToArrayInElement_V3(data);
					 if (commonService.hasValueNotEmpty(self.productName)
							 && commonService.hasValueNotEmpty(self.lazyChoiceList[self.productName])){
						 updateLazyList_OLD (self, data)
					 }
					 updateNewDetail(element, self.detail, data);
				 }
			 	 deferred.resolve(self.detail);
		     });
			 
			 return deferred.promise;

			 function updateNewDetail (element, src, des) {
			 	for (var i = 0; i < element.length; i++){
			 		var computedObj = self.findElementInElement_V3(des, element[i]);
			 		var objInDetail = self.findElementInElement_V3(src, element[i]);
			 		$.extend(true, objInDetail, computedObj);
			 	}
			 }
			 
			 function updateLazyList_OLD (self, updatedEle){
			 	 //var product = self.findElementInElement_V3(self.detail, ['Product']);
			 	 var product = self.findElementInDetail_V3(['Header', 'Product'], {'errorOn': false, 'returnLastFound': false});
				 for (var key in updatedEle){
					 if (typeof(updatedEle[key])=="object"){
						 if (commonService.hasValueNotEmpty(updatedEle[key]['@vpms-suffix'])){
						 	 if(commonService.hasValueNotEmpty(product)){
						 	 	 var dataInLazyList = self.lazyChoiceList[self.productName]['LazyRestriction'][updatedEle[key]['@vpms-suffix']]==undefined ? 
									 undefined: self.lazyChoiceList[self.productName]['LazyRestriction'][updatedEle[key]['@vpms-suffix']].Option;
						 	 	 var originalDataInLazyList = self.lazyChoiceList[self.productName]['LazyRestriction'][updatedEle[key]['@vpms-suffix']];
						 	 }
							 else{
							 	var dataInLazyList = self.lazyChoiceList['LazyRestriction'][updatedEle[key]['@vpms-suffix']]==undefined ? 
									 undefined: self.lazyChoiceList['LazyRestriction'][updatedEle[key]['@vpms-suffix']].Option;
								var originalDataInLazyList = self.lazyChoiceList['LazyRestriction'][updatedEle[key]['@vpms-suffix']];
						 	 }
						 }
						 else{
							 var dataInLazyList = undefined;
						 }

						 //var originalDataInLazyList = self.lazyChoiceList[self.productName]['LazyRestriction'][updatedEle[key]['@vpms-suffix']];
						 var dataInDetail = updatedEle[key].Options;
						 
						 if( commonService.hasValueNotEmpty(originalDataInLazyList) && 
							(commonService.hasValueNotEmpty(dataInLazyList) || dataInLazyList!="")){ //Store the original data of lazy list
							 originalDataInLazyList.originalLazyList = angular.copy(dataInLazyList);
						 }
						 
						 if (dataInDetail!=undefined && dataInDetail.Option!="" ){ //check if return data in data model has "Option"
							 if (commonService.hasValueNotEmpty(originalDataInLazyList)) {
								 if(!angular.equals(dataInDetail.Option, originalDataInLazyList.originalLazyList) && (dataInDetail.Option.group!="" || dataInDetail.Option.value!="") ){
									 // copy option from detail to lazy list
									 /*updatedEle[key]['@editable']==0 && */
									 if(commonService.hasValueNotEmpty(product)){
									 	self.lazyChoiceList[self.productName]['LazyRestriction'][updatedEle[key]['@vpms-suffix']] = angular.copy(dataInDetail);
									 }
									 else{
									 	self.lazyChoiceList['LazyRestriction'][updatedEle[key]['@vpms-suffix']] = angular.copy(dataInDetail);	
									 }
									 /*if ( updatedEle[key]['@editable']==0 && ( (self.convertToArray(dataInDetail.Option)).length==1 )  ) {*/
									if ( (self.convertToArray(dataInDetail.Option)).length==1) {
										 //updatedEle[key].Value = dataInDetail.Option.value;
									 }
								 }
							 } else {
								 if((dataInDetail.Option.group!="" || dataInDetail.Option.value!="") ){
									 // copy option from detail to lazy list
									 /*updatedEle[key]['@editable']==0 && */
									 //self.lazyChoiceList[self.productName]['LazyRestriction'][updatedEle[key]['@vpms-suffix']] = angular.copy(dataInDetail);
									 if(commonService.hasValueNotEmpty(product)){
									 	self.lazyChoiceList[self.productName]['LazyRestriction'][updatedEle[key]['@vpms-suffix']] = angular.copy(dataInDetail);
									 }
									 else{
									 	self.lazyChoiceList['LazyRestriction'][updatedEle[key]['@vpms-suffix']] = angular.copy(dataInDetail);	
									 }
									 /*if ( updatedEle[key]['@editable']==0 && ( (self.convertToArray(dataInDetail.Option)).length==1 )  ) {*/
									 if ( (self.convertToArray(dataInDetail.Option)).length==1) {
										 //updatedEle[key].Value = dataInDetail.Option.value;
									 }
								 }
							 }
							 /*else{
								 originalDataInLazyList = angular.copy(dataInLazyList);
							 }*/
							 //dataInDetail.Option = ""; // clear data in data model
							 
						 }else{
							 updateLazyList_OLD(self, updatedEle[key]);
						 }
					 }
				 }
			 } 
			 
			 function updateLazyList_OLD2 (self, updatedEle){
				 for (var key in updatedEle){
					 if (typeof(updatedEle[key])=="object"){
						 if (commonService.hasValueNotEmpty(updatedEle[key]['@vpms-suffix'])){
						 	 var dataInLazyList = self.findElementInElement_V3(self.lazyChoiceList, [updatedEle[key]['@vpms-suffix']]);
						 	 var originalDataInLazyList = angular.copy(dataInLazyList);
						 }
						 else{
							 var dataInLazyList = undefined;
						 }
 
						 var dataInDetail = updatedEle[key].Options;
						 if (dataInDetail!=undefined && dataInDetail.Option!="" ){ //check if return data in data model has "Option"
							 if((dataInDetail.Option.group!="" || dataInDetail.Option.value!="") ){
							 	self.findElementInElement_V3(self.lazyChoiceList, [updatedEle[key]['@vpms-suffix']]).Option = angular.copy(dataInDetail.Option)
							 }
							 if ( updatedEle[key]['@editable']==0 && ( (self.convertToArray(dataInDetail.Option)).length==1 )  ) {
								 //updatedEle[key].Value = dataInDetail.Option.value;
							 }
							 
							 dataInDetail.Option = ""; // clear data in data model
							 
						 }else{
							 updateLazyList_OLD2(self, updatedEle[key]);
						 }
					 }
				 }
			 }
		
		 };
		 
//		 /**
//	         * compare 2 data with the same json format
//	         * @param {json} src: object to compare with des
//	         * @param {json} des: object to compare with src
//	         * return {boolean} true: if src and des are the same/ false: if src and des are not the same
//	         */
//	        IposDocService.prototype.compareData = function(src, des) {
//	            var prop;
//	            if(!src && des || src && !des){
//	                return false;
//	            }
//	            if(!src && !des){
//	                return true;
//	            }
//
//	            for(prop in src){
//	                if(prop == "$" || prop == "Value"){
//	                    if(src[prop] != des[prop]){
//	                        return false;
//	                    }
//	                }
//	                if (typeof src[prop] == "object"){
//	                    if(!this.compareData(src[prop], des[prop]))
//	                        return false;
//
//	                }
//	            }
//	            return true;
//	        };
	        
	        
		 ListDetailCoreService.prototype.restoreLazyList = function (productName){
			 var self = this;
			 var lazyList = self.lazyChoiceList[productName];
			 if (commonService.hasValueNotEmpty(lazyList)){
				 for (var key in lazyList){
					 if(commonService.hasValueNotEmpty(lazyList[key].originalLazyList)){
						 lazyList[key] = lazyList[key].originalLazyList;
						 lazyList[key].originalLazyList = undefined;
					 }
				 }
			 }
		 }
		 
		 IposDocService.prototype.checkValidElementsInDetail = function(elementNames, excludeElementNames){
			 var self = this;
			 if(self.detail === undefined || elementNames === undefined || elementNames.length == 0) return {validResult: true, validMessage: ""};

			 var ele = self.detail;
			 for ( var i = 0; i < elementNames.length; i++) {
				 var eleName = elementNames[i];
				 var eleFound = self._findElement(ele,eleName);
				 if (commonService.hasValue(eleFound)){
					 var rs;
					 if(excludeElementNames == undefined)
						 rs = self.checkValid(eleFound);
					 else {
						 if(excludeElementNames.indexOf(eleFound.name) == -1) {
							 rs = self.checkValid(eleFound, excludeElementNames);
						 }
					 }
					 if (!rs.validResult) return rs;
				 }
			 }	
			 return {validResult: true, validMessage: ""};
		 };
		 IposDocService.prototype.checkValid = function(element, excludeElementNames){
			 var self = this;
			 //check direct properties
			 if(excludeElementNames != undefined && excludeElementNames.indexOf(element.name) == -1) {
				 //check direct properties
				 var properties = element.properties;
				 for ( var i = 0; i < properties.length; i++) {
					 var property = properties[i];
					 if (property.name == "validate"){
						 if (commonService.hasValueNotEmpty(property.value)){
							 return {validResult: false, validMessage: property.value};
						 }
					 }
				 }	
				 var children = element.elements;
				 for ( var i = 0; i < children.length; i++) {
					 var child = children[i];
					 if(excludeElementNames.indexOf(child.name) == -1){
						 var valid = self.checkValid(child, excludeElementNames);
						 if (!valid.validResult) {
							 return valid;
						 }
					 }
				 }	
			 }
			 else {
				 //check direct properties
				 var properties = element.properties;
				 for ( var i = 0; i < properties.length; i++) {
					 var property = properties[i];
					 if (property.name == "validate"){
						 if (commonService.hasValueNotEmpty(property.value)){
							 return {validResult: false, validMessage: property.value};
						 }
					 }
				 }	
				 var children = element.elements;
				 for ( var i = 0; i < children.length; i++) {
					 var child = children[i];
					 var valid = self.checkValid(child);
					 if (!valid.validResult) {
						 return valid;
					 }
				 }	
			 }
			 return {validResult: true, validMessage: ""};
		 };

		 /**
		  * Validate list of elements have value and not empty
		  * @param elementNames
		  * @returns Array of invalid elements
		  */
		 IposDocService.prototype.validateElement = function(element, excludeElementNames) {
			 var self = this;
			 var resultList = [];
			 if(self.detail === undefined || element === undefined || element.length == 0) return resultList;
			 //the leaf element
			 if(excludeElementNames != undefined) {
				 if(element.properties !== undefined && element.properties.length > 0 && excludeElementNames.indexOf(element.name) == -1){
					 if(self._findProperty(element,'mandatory') !== undefined && self._findProperty(element,'mandatory').value == 1){
						 if(self._findProperty(element,'value') !== undefined && !commonService.hasValueNotEmpty(self._findProperty(element,'value').value)){
							 resultList.push(element);
						 }
					 }

				 }
			 }
			 else {
				 if(element.properties !== undefined && element.properties.length > 0){
					 if(self._findProperty(element,'mandatory') !== undefined && self._findProperty(element,'mandatory').value == 1){
						 if(self._findProperty(element,'value') !== undefined && !commonService.hasValueNotEmpty(self._findProperty(element,'value').value)){
							 resultList.push(element);
						 }
					 }

				 }
			 }
			 //in case it's not the leaf element
			 if(element.elements !== undefined && element.elements.length > 0) {
				 var children = element.elements;
				 for ( var i = 0; i < children.length; i++) {
					 var child = children[i];
					 var result;
					 if(excludeElementNames != undefined && excludeElementNames.indexOf(child.name) == -1)
						 result = self.validateElement(child, excludeElementNames);
					 else
						 result = self.validateElement(child);
					 if (result !== null ) {
						 resultList = resultList.concat(result);
					 }
				 }	
			 }
			 return resultList;
		 };

		 IposDocService.prototype.checkValidTags = function(tagNames, excludeElementNames){
			 var self = this;
			 var result;
			 if(excludeElementNames != undefined)
				 result = self.validateElementsInTags(tagNames, excludeElementNames);
			 else
				 result = self.validateElementsInTags(tagNames);
			 if(result.length == 0){
				 return {validResult: true, validMessage: ""};
			 } else {
				 return {validResult: false, validMessage: result};
			 }
		 };
		 /**
		  * 
		  * @param tagNames is array tag's name such as ["AssuredMain", "policyOwner", "basePlan",...]
		  * @returns {Boolean} if error is return true else return false
		  */
		 IposDocService.prototype.validateElementsInTags = function(tagNames, excludeElementNames) {
			 var self = this;
			 var resultList = [];
			 if(self.detail === undefined || tagNames === undefined || tagNames.length == 0) return resultList;

			 var ele = self.detail;
			 for ( var i = 0; i < tagNames.length; i++) {
				 var tagName = tagNames[i];
				 var eleFound = self.findElementInElementByTags(ele, tagName);
				 if(eleFound === undefined) {
					 resultList.push(eleFound);
				 }
				 else if(excludeElementNames != undefined && excludeElementNames.indexOf(eleFound.name) == -1){
					 var result = self.validateElement(eleFound, excludeElementNames);
					 resultList = resultList.concat(result);
				 }
				 else {
					 var result = self.validateElement(eleFound);
					 resultList = resultList.concat(result);
				 }
			 }
			 return resultList;
		 };
		 IposDocService.prototype.checkValueElementsInDetailByTags = function(tagNames){
			 var self = this;
			 return self.checkValueElementsInElementByTags(self.detail, tagNames);
		 };

		 /*ACTION get validate message*/
		 IposDocService.prototype.getErrorMessage = function(errorData, jsonXpath) {
	            var self = this;
	            var listXpath = this.getListXpathFromErrors(errorData);
	            var listErrorMessage = this.getListErrorMessageFromErrors(errorData);
	            var pos = listXpath.indexOf(jsonXpath);
	            return listErrorMessage[pos];
	        };

	        IposDocService.prototype.getErrorList = function(data) {
	            var items = Object.keys(data);
	            if (items[0] == "ipos-error-document:Errors") {
	                this.errorList = data;
	            }
	            else {
	                this.errorList = undefined;
	            }
	        };

	        IposDocService.prototype.getListXpathFromErrors = function(data) {
	            var self = this;
	            var listXpath = new Array();
	            var errors = new Array();
	            var temp = this.findElementInElementByJsonPath(data, '$..ipos-error-document:Errors.ipos-error-document:ErrorGroup.ipos-error-document:Error');
	            if (temp) {
	                if (temp.length > 1)
	                    errors = temp;
	                else
	                    errors.push(temp);
	            }
	            var i;
	            if (data !== undefined) {
	                for (i in errors) {
	                    if (!isNaN(i)) {
	                        var Xpath = this.convertJSonpath(this.findElementInElementByJsonPath(errors[i], '$..ipos-error-document:Xpath'));
	                        listXpath.push(Xpath);
	                    }
	                }
	            }
	            return listXpath;
	        };
	       
	        IposDocService.prototype.getListErrorMessageFromErrors = function(data) {
	            var self = this;
	            var listErrorMessage = new Array();
	            var errors = new Array();
	            var temp = this.findElementInElementByJsonPath(data, '$..ipos-error-document:Errors.ipos-error-document:ErrorGroup.ipos-error-document:Error');
	            if (temp) {
	                if (temp.length > 1)
	                    errors = temp;
	                else
	                    errors.push(temp);
	            }
	            var i;
	            if (data !== undefined) {
	                for (i in errors) {
	                    if (!isNaN(i)) {
	                        listErrorMessage.push(this.findElementInElementByJsonPath(errors[i], '$..ipos-error-document:ErrorMessage'));
	                    }
	                }
	            }
	            return listErrorMessage;
	        };
	        
	        IposDocService.prototype.findElementInElementByJsonPath = function(element, jsonXpath) {
	            if (element !== undefined) {
	                var document = jsonPath(element, jsonXpath);
	                return document[0];
	            }
	        };
	        
	        IposDocService.prototype.convertJSonpath = function(xpath) {
	            return "$.." + xpath.substr(18, xpath.length - 1).replace(/\//g, '.');

	        };
		 /**
		  * 
		  * @param elementValue
		  * @returns {Array}
		  * Example: (/(!()!ETIQA001;100!/!ETIQA012;75/!/)/) will return array ['ETIQA001;100','ETIQA012;75']
		  */
		 ListDetailCoreService.prototype.getArrayErrorCode = function(elementValue){
			 var ret = new Array();

			 //return empty array if elementValue is empty or null
			 if (!commonService.hasValueNotEmpty(elementValue)) return ret;

			 elementValue = elementValue.replace(/\(|\)|\//g, "");
			 var arrCode = elementValue.split("!");
			 for (var i = 0; i < arrCode.length; i++){
				 if(arrCode[i].trim().length > 0) ret.push(arrCode[i].trim());
			 }
			 return ret;
		 };

		 ListDetailCoreService.prototype.checkOrActionsPermission = function(elementResource, actions){
			 var self = this;
			 for ( var i = 0; i < actions.length; i++) {
				 if(self.checkActionPermission(elementResource,actions[i])){
					 return true;
				 }				
			 }		
			 return false;
		 };

		 ListDetailCoreService.prototype.checkAndActionsPermission = function(elementResource, actions){
			 var self = this;
			 var count = 0;
			 for ( var i = 0; i < actions.length; i++) {
				 if(self.checkActionPermission(elementResource,actions[i])){
					 count ++;
				 }				
			 }		
			 return (actions.length == count);
		 };

		 ListDetailCoreService.prototype.checkActionPermission = function(elementResource, action){
			 var self = this;
			 var pmsDoc = self.appService.getPermissionDoc();
			 var userDoc = self.appService.getUserDoc();
			 var valueAction = self.findPropertyInElement(pmsDoc,['Permission'],action).value;
			 var boolAction = (valueAction=="false"?false:true); //convert to boolean
			 //edit right for all roles and on owner
			 if("edit" == action){
				 if(!commonService.hasValue(elementResource) || !commonService.hasValue(elementResource.ownerUid) || self.isOwner(userDoc, elementResource)){
					 return boolAction;
				 }else return false;		
			 }

			 //view right for all roles and on owner || on subordinates and roles Manager, Underwriter, Super Viewer
			 if("view" == action){
				 //check viewAll right for only roles Underwriter, Superviewer
				 var boolViewAll = self.findPropertyInElement(pmsDoc,['Permission'],"viewAll").value;
				 if((boolViewAll != undefined && boolViewAll == true) && (self.hasRole("ROLE_SUPERVIEWER") || self.hasRole("ROLE_UNDERWRITER"))) {
					 return true;
				 } else {
					 //else if the user has not roles Underwriter, Superviewer
					 if(!commonService.hasValue(elementResource) || !commonService.hasValue(elementResource.ownerUid) || self.isOwner(userDoc, elementResource)) {
						 return boolAction;
					 }
					 if(self.isSubordinate(userDoc, elementResource) && ( self.hasRole("ROLE_MANAGER") || self.hasRole("ROLE_UNDERWRITER") || self.hasRole("ROLE_SUPERVIEWER") )){
						 return boolAction;
					 }
					 return false;
				 }
			 }

			 //review right for roles as Manager(subordinate or assigned cases), ManagerReview(assigned cases)
			 if("review" == action){
				 if(self.isCaseAssigned(userDoc, elementResource) && (self.hasRole("ROLE_MANAGERREVIEW") || self.hasRole("ROLE_MANAGER"))){
					 return boolAction;
				 }
				 return false;			
			 }

			 //resubmit right for Underwriter(on cases fail)
			 if("resubmit" == action){
				 if(self.isCaseFailed(userDoc, elementResource) && self.hasRole("ROLE_UNDERWRITER")){
					 return boolAction;
				 }
				 return false;		

			 }

			 //isrrExtract right for roles: Manager for Auditor 
			 if("isrrExtract" == action){
				 if(self.hasRole("ROLE_MANAGER") || self.hasRole("ROLE_AUDITOR") || self.hasRole("ROLE_MANAGERREVIEW")){
					 return boolAction;
				 }
				 return false;
			 }

			 return false;
		 };

		 ListDetailCoreService.prototype.isSubordinate = function(elementUser, elementResource){
			 var userUid = elementUser.uid;
			 var ownerUid = elementResource.ownerUid;		
			 return (userUid != ownerUid);
		 };

		 ListDetailCoreService.prototype.isOwner = function(elementUser, elementResource){
			 var userUid = elementUser.uid;
			 var ownerUid = elementResource.ownerUid;		
			 return (userUid == ownerUid);
		 };

		 ListDetailCoreService.prototype.isCaseAssigned = function(elementUser, elementResource){
			 var self = this;
			 var userUid = elementUser.uid;
			 var reviewers = self.findElementInElement(elementResource,["Reviewers"]);
			 if(!commonService.hasValue(reviewers)) return false;
			 var elements = reviewers.elements;
			 for (var i = 0; i < elements.length; i++) {
				 var uidReviewer = self.findPropertyInElement(elements[i],["Uid"],"value").value;			
				 if (userUid == uidReviewer) {
					 return true;
				 }
			 };			
			 return false;
		 };

		 ListDetailCoreService.prototype.isCaseFailed = function(elementUser, elementResource){
			 var userUid = elementUser.uid;
			 var ownerUid = elementResource.ownerUid;
			 return false;
		 };

		 ListDetailCoreService.prototype.hasRole = function(role){
			 var self = this;
			 var userDoc = self.appService.getUserDoc();
			 if (userDoc == undefined) {
				 return false;
			 }
			 var elements = self.findElementInElement(userDoc,["roles"]).elements;
			 for (var i = 0; i < elements.length; i++) {
				 var roleValue = self._findProperty(elements[i],"value").value;
				 if (role == roleValue) {
					 return true;
				 }
			 };		
			 return false;
		 };

		 ListDetailCoreService.prototype.formatGender = function(gender){
			 var formatValue = "";

			 if(gender != null && gender.length > 0){
				 formatValue = appService.getI18NText('person.gender.enum.'+gender);
				 if(formatValue == ''){
					 formatValue = gender;
				 }
			 }

			 return formatValue;
		 };

		 ListDetailCoreService.prototype.formatYesNo = function(value){
			 var formatValue = "";

			 if(value != null && value.length > 0){
				 formatValue = appService.getI18NText('product.etiqa.yesno.enum.'+value);
				 if(formatValue == ''){
					 formatValue = value;
				 }
			 }

			 return formatValue;
		 };

		 ListDetailCoreService.prototype.formatMaritalStatus = function(status){
			 var formatValue = "";

			 if(status != null && status.length > 0){
				 formatValue = appService.getI18NText('person.maritalStatus.enum.'+status);
				 if(formatValue == ''){
					 formatValue = status;
				 }
			 }

			 return formatValue;
		 };

		 ListDetailCoreService.prototype.formatSmoker = function(smoker){
			 var formatValue = "";

			 if(smoker != null && smoker.length > 0){
				 formatValue = appService.getI18NText('person.smoker.enum.'+smoker);
				 if(formatValue == ''){
					 formatValue = smoker;
				 }
			 }

			 return formatValue;
		 };

		 ListDetailCoreService.prototype.formatTitle = function(title){
			 var formatValue = "";

			 if(title != null && title.length > 0){
				 formatValue = appService.getI18NText('person.name.title.enum.'+title);
				 if(formatValue == ''){
					 formatValue = title;
				 }
			 }

			 return formatValue;
		 };

		 ListDetailCoreService.prototype.formatRace = function(race){
			 var formatValue = "";

			 if(race != null && race.length > 0){
				 formatValue = appService.getI18NText('person.race.enum.'+race);
				 if(formatValue == ''){
					 formatValue = race;
				 }
			 }

			 return formatValue;
		 };

		 ListDetailCoreService.prototype.formatReferralType = function(referralType){
			 var formatValue = "";

			 if(referralType != null && referralType.length > 0){
				 formatValue = appService.getI18NText('person.referralType.' + referralType);
				 if(formatValue == ''){
					 formatValue = referralType;
				 }
			 }

			 return formatValue;
		 };

		 ListDetailCoreService.prototype.formatOccupation = function(occupation){
			 var formatValue = "";

			 if(occupation != null && occupation.length > 0){
				 formatValue = appService.getI18NText('occupation.'+occupation);
				 if(formatValue == ''){
					 formatValue = occupation;
				 }
			 }

			 return formatValue;
		 };
		 
		 

		 ListDetailCoreService.prototype.formatCountry = function(country){
			 var formatValue = "";

			 if(country != null && country.length > 0){
				 formatValue = appService.getI18NText('country.'+country);
				 if(formatValue == ''){
					 formatValue = country;
				 }
			 }

			 return formatValue;
		 };

		 ListDetailCoreService.prototype.formatIdType = function(idType){
			 var formatValue = "";

			 if(idType != null && idType.length > 0){
				 formatValue = appService.getI18NText('person.idType.enum.'+idType);
				 if(formatValue == ''){
					 formatValue = idType;
				 }
			 }

			 return formatValue;
		 };

		 ListDetailCoreService.prototype.formatIndustryType = function(businessIndustry){
			 var formatValue = "";

			 if(businessIndustry != null && businessIndustry.length > 0){
				 formatValue = appService.getI18NText('industry.'+businessIndustry);
				 if(formatValue == ''){
					 formatValue = businessIndustry;
				 }
			 }

			 return formatValue;		
		 };

		 ListDetailCoreService.prototype.unlinkProspect = function(prospectUid){
			 var self = this;
			 var deferred = self.$q.defer();
			 var url = self.commonService.getUrl(self.commonService.urlMap.CLIENT_PROSPECT_UNLINK, [prospectUid]);
			 self.ajax.get(url).success(function(result){
				 deferred.resolve(result);
			 });
			 return  deferred.promise;
		 };

		 ListDetailCoreService.prototype.linkProspect = function(prospectUid){
			 var self = this;
			 var deferred = self.$q.defer();
			 var url = self.commonService.getUrl(self.commonService.urlMap.CLIENT_PROSPECT_LINK, [prospectUid]);
			 var dataSet = self.extractUiDataSet(self.detail);
			 self.ajax.post(url, dataSet).success(function(result){
				 deferred.resolve(result);
			 });
			 return  deferred.promise;
		 };

		 ListDetailCoreService.prototype.invokeRuntimeService = function( method,resourceURL, runtimeURL, requestData){
			 	var self = this;
				var deferred = self.$q.defer();	
				
				if(method == "GET"){
					 self.ajax.getRuntime(resourceURL, runtimeURL, function(data){
						 deferred.resolve(data);
					 	});
				}else if(method == "POST"){	 
					 self.ajax.postRuntime(resourceURL, runtimeURL, requestData, function(data){
						 deferred.resolve(data);						
					 	});
				}		 
				return  deferred.promise;
		 };
		 
		 ListDetailCoreService.prototype.initialPortletURL = function(portletURL){
			 if (typeof standAloneWebappType != 'undefined' && standAloneWebappType === 'GROUP_PORTAL') {
				 return "invokeRuntime";
			 } else {
				 var resourceURL = $window.iPOSLiferayPortletURL.createResourceURL();
				 
				 if(portletURL != null){
					 resourceURL.setPortletId(portletURL);
					 resourceURL.setResourceId("invokeRuntime");
		             resourceURL = resourceURL.toString();
				 }
				 return resourceURL;
			 }
		 };
		 
		 ListDetailCoreService.prototype.initialMethodPortletURL = function(portletId, methodName){
			 if (typeof standAloneWebappType != 'undefined' && standAloneWebappType === 'GROUP_PORTAL') {
				 return methodName;
			 } else {
				 var resourceURL = $window.iPOSLiferayPortletURL.createResourceURL();
				 
				 if(portletId != null){
					 resourceURL.setPortletId(portletId);
				 }
				 resourceURL.setResourceId(methodName);
				 return resourceURL;
			 }
		 };
		 
		 ListDetailCoreService.prototype.initialResourceURL = function(){
			 var resourceURL = $window.iPOSLiferayPortletURL.createRenderURL();			 			
			 return resourceURL;
		 };
		 
		 //using for application, client
		 ListDetailCoreService.prototype.getContactObjectByType = function(contactElements, type) {
			 var self = this;
			 for(var i = 0; i < contactElements.length; i++) {
				 var item = contactElements[i];
				 var currType = self.findPropertyInElement(item,['type'],'value').value;
				 if (currType == type) {
					 var val = self.findPropertyInElement(item,['value'],'value').value;
					 return { 'type' : type, 
						 'value' : val};
				 }
			 }
			 return { 'type' : type, 
				 'value' : ''};
		 };
		 /**
		  * Compute an illustration
		  * If validate successfully, return resolved promise. Otherwise return rejected promise.
		  * @returns {promise} 
		  * <dl>
		  * <dt>Resolved with:</dt>
		  * <dd>computed document detail</dd>
		  * <dt>Rejected with:</dt>
		  * <dd>validation error message</dd>	
		  * </dl>
		  */
		 ListDetailCoreService.prototype.computeTags = function(tags, srcElement, uiNonBlock){
			 var self = this;
			 var deferred = self.$q.defer();
			 //Note: 'productInputs' is an element of self.detail
			 var dataSet = self.extractUiDataSet(self.detail);
			 var url = self.commonService.getUrl(self.commonService.urlMap.DOCUMENT_COMPUTE_TAGS, [self.name, tags]);
			 self.ajax.post(url, dataSet, uiNonBlock).success(function(dtoResult){//data = illustration
				 if(self.name == self.commonService.CONSTANTS.MODULE_NAME.APPLICATION) {
					 if(tags.indexOf('Referrer') != -1) {
						 self.computeTagsReferrer(dtoResult);
					 }
				 }
				 self._findProperty(self.detail, "validate").value = self._findProperty(dtoResult, "validate").value;
				 if(commonService.hasValue(srcElement))
					 self.mergeElement(dtoResult, srcElement);
				 else{
					 self.mergeElement(dtoResult, self.detail);
				 }
				 //check if valid
				 var valid = self.checkValid(dtoResult);
				 if (valid.validResult){
					 //do something
					 deferred.resolve(dtoResult);
				 }else{
					 deferred.reject(valid.validMessage);
				 }
			 });
			 return  deferred.promise;
		 };

		 /*Action Convert Object to Array and add item*/

		 ListDetailCoreService.prototype.convertToArray = function(data) {
		     if(data != undefined && data.length == undefined){
		         var array = [];
		         array.push(data);
		         return array;
		     }
		     return data;
		 };

		 ListDetailCoreService.prototype.findArrayInElementByJsonXpath = function(elements, jsonXpath) {
		     if(elements){
		         if (elements.length == undefined) {
		             // this.convertObject2Arr(elements);
		             elements = this.convertToArray(elements);

		             // get the object jsonXPath
		             var path = jsonPath(this.detail, jsonXpath, {resultType:"PATH"});

		             // split the XPath to array
		             var array = path[0].split("']['");

		             //get the child jsonXPath
		             var childXPath = array[array.length - 1].replace("']", "");

		             // get the parent jsonXPath
		             var parentXPath = array[array.length - 2];
		             this.findElementInDetailByJsonPath('$..' + parentXPath)[childXPath] = elements;
		             return elements;
		         }
		         else return elements;
		     }
		 };

		 ListDetailCoreService.prototype.findArrayInDetaiByJsonXpath = function(jsonXpath) {
		     var elements = this.findElementInDetailByJsonPath(jsonXpath);
		     return this.findArrayInElementByJsonXpath(elements, jsonXpath);
		 };
		 
		 ListDetailCoreService.prototype.findElementInElementByJsonPath = function(element, jsonXpath) {
	            if (element !== undefined) {
	                var document = jsonPath(element, jsonXpath);
	                return document[0];
	            }
	        }; 
	        
		 ListDetailCoreService.prototype.findElementInDetailByJsonPath = function(jsonXpath) {
	            var self = this;
	            return self.findElementInElementByJsonPath(self.detail, jsonXpath);
	        }; 

		 ListDetailCoreService.prototype.addElement = function(jsonXpath, emptyTemplate) {
		     var elements = this.findElementInDetailByJsonPath(jsonXpath); // list of elements
		     var arrXPath = jsonXpath.split(".");
		     var xPath1 = arrXPath[arrXPath.length-1];
		     var xPath2 = arrXPath[arrXPath.length-2];  
		     elements.push(angular.copy(emptyTemplate));
		     $log.debug(this.detail);
		 };

		 ListDetailCoreService.prototype.removeElement = function(jsonXpath, index) {
		     var elements = this.findElementInDetailByJsonPath(jsonXpath); // list of elements
		     elements.splice(index, 1);
		 };
		 
		 ListDetailCoreService.prototype.reset_V3 = function() {
		     var self = this;
		     self.detail = angular.copy(self.originalDetail);
		 };

		 ListDetailCoreService.prototype.genRandomNumber = function(len){
		 	var text = "";
			var possible = "0123456789";
			
			for( var i = 0; i < len; i++ )
			    text += possible.charAt(Math.floor(Math.random() * possible.length));

			return text;
		 };
		 
		 ListDetailCoreService.prototype.genDefaultName = function(){
			var self = this;			 
			var text = self.genRandomNumber(8);			
			
			if(self.name == "prospect"){
				text = 'PP'+text;
			}else if(self.name == 'organization-contact'){
				 text = 'CC' + text;
			}else if(self.name == "illustration"){
				if (self.productName.indexOf('life')) text = "BI" + text;
				else text = 'QI'+ text;
			}else if(self.name == 'application'){
				text = 'AP'+text;
			}else if(self.name == 'pdpa'){
				text = 'PA'+text;
			}else if(self.name == 'case-management'){
				 text = 'BC'+text;
			}else if(self.name == 'claim-notification'){
				 text = 'CN'+text;
			}else if(self.name == 'claim'){
				 text = 'V'+text;
			}else if(self.name == 'underwriting'){
				 text = 'UW'+text;
			}else if(self.name == 'agent-payment'){
				 /*text = 'TS' + text;*/
				text = 'TS' + self.genRandomNumber(20)+self.genRandomNumber(8);
			}else if(self.name == 'user'){
				 text = 'PF' + text;
			}else if(self.name == 'factfind'){
				 text = 'FNA' + text;
			}
			 return text;
		 };
		 
		 /*This function use to find Group in lazy choice list by Value*/
		 ListDetailCoreService.prototype.findGroupInMapListByValue = function(data,jsonPath, value) {
		        if (data != undefined) {
		        	var items = this.findElementInElement_V3(data, [jsonPath]).Option;
		            //var items = this.findJsonPathInItem(data, jsonPath,value).Option;    
		             if(!$.isArray(items)){
		            	 
		             }
		             for (var i in items) {
		                 if (items[i]['value'] == value) {
		                     return items[i]['group'];
		                 }
		             }
		         }
		         
		         return undefined;
		     };
		     
	     ListDetailCoreService.prototype.getModuleProductList_V3 = function(resourceURL, moduleName) {
	    	 var self = this;
			 var deferred = self.$q.defer();
				connectService.exeAction({
			    	actionName: "MODULE_LISTPRODUCT",
			    	actionParams: [moduleName],
			    	resourceURL: resourceURL
			    }).then(function(data){
			    	deferred.resolve(data);
			    });	
			 return deferred.promise;		        
		 };
		 
		 /**
		  * @author nnguyen75
		  * Get user map info from java
		  */
		 ListDetailCoreService.prototype.getUserMapInfo = function(portletName) {
			 var self = this;
			 var deferred = self.$q.defer();
			 var resourceURL = self.initialMethodPortletURL(portletName, "getUserMapInfo");
			 self.ajax.getRes(resourceURL, function(data){			
				 deferred.resolve(data);	
			 });
			 return deferred.promise;		        
		 };
		 
		 //Start tour User Guide list
		 ListDetailCoreService.prototype.tourGuideFirstLoginForUser = function(selector, portletId) {
			 var self = this;
			 var resourceURL = self.initialMethodPortletURL(portletId,"updateUserGuide");
			 var isHaveUserGuide = false;
			 
			 var getUserGuideListFromLocal = angular.fromJson(window.localStorage.getItem("userguide"));
			 
			 if(getUserGuideListFromLocal == undefined || getUserGuideListFromLocal == null)
				 return isHaveUserGuide;
			 
			 var userGuideList = self.findElementInElement_V3(getUserGuideListFromLocal, [selector]);						
			 if(getUserGuideListFromLocal.isCompleted == false && (commonService.hasValueNotEmpty(userGuideList) && userGuideList.isCompleted == false)){
				 				 
				 userGuideList.isCompleted = true;
				 isHaveUserGuide =  true;
				 getUserGuideListFromLocal.isCompleted = true;
				 for(var i = 0; i < getUserGuideListFromLocal.UserGuideStep.length; i++){
					 if(self.findElementInElement_V3(getUserGuideListFromLocal.UserGuideStep[i], ['isCompleted']) == false){
						 getUserGuideListFromLocal.isCompleted = false;
						 break;
					 }
				 }
				 
				 window.localStorage.setItem("userguide",JSON.stringify(getUserGuideListFromLocal));
				 
				 resourceURL.setParameter("isCompleted", getUserGuideListFromLocal.isCompleted);
				 resourceURL = resourceURL.toString();
				 self.updateUserGuideStep_V3(resourceURL, JSON.stringify(getUserGuideListFromLocal.UserGuideStep)).then(function(data){
					 
					 for(var i = 0; i < userGuideList.details.length; i++){
						 //userGuideList.details[i].title = $translate.instant(userGuideList.details[i].title_translate);
						 userGuideList.details[i].title = "";
						 userGuideList.details[i].content = $translate.instant(userGuideList.details[i].content_translate);
					 }
					 
	    			$log.debug(data);
	    			bootstro.start("", {			            
			            items: userGuideList.details
					 });
	    			
	    		 });				 
				 				 				
			 }			 			 			
			 return isHaveUserGuide;      
		 };		 
		 
		 //Update tour User Guide list
		 ListDetailCoreService.prototype.updateUserGuideStep_V3 = function(resourceURL, dataset) {			 
			 var self = this;
			 var deferred = $q.defer();
			 var actionUrl = undefined; 
			 self.ajax.postRuntime(resourceURL, actionUrl, dataset, function(data){	
				 deferred.resolve(data);	
			 });
			 return  deferred.promise;
		 };	
		 
//		 /**
//         * compare 2 data with the same json format
//         * @param {json} src: object to compare with des
//         * @param {json} des: object to compare with src
//         * return {boolean} true: if src and des are the same/ false: if src and des are not the same
//         */
//        IposDocService.prototype.compareData = function(src, des) {
//            var prop;
//            if(!src && des || src && !des){
//                return false;
//            }
//            if(!src && !des){
//                return true;
//            }
//
//            for(prop in src){
//                if(prop == "$" || prop == "Value"){
//                    if(src[prop] != des[prop]){
//                        return false;
//                    }
//                }
//                if (typeof src[prop] == "object"){
//                    if(!this.compareData(src[prop], des[prop]))
//                        return false;
//
//                }
//            }
//            return true;
//        };
        
   	 /**
		  * clear data base on criteria (applied for v3-switch-new, v3-switch-new-slide)
		  * @param {element} parent element  (card.refDetail)
		  * @param {model} switch model
		  * @param {clearCriteria} condition to clear data
		  * @param {listElement} list element name need tobe cleared
		  * 
		  */
		 ListDetailCoreService.prototype.clearDataFromListEle = function(element, model, clearCriteria, listElement) {
			 var self = this;
			 if(model == clearCriteria){
				 /*for (var pKey in listElement) {
					 var ele = this.findElementInElement_V3(element,[listElement[pKey]]);	
					 this.clearDataInJson(ele);
				}*/
				angular.forEach(listElement, function(item){
                    var ele = self.findElementInElement_V3(element,[item]);
                    self.clearDataInJson(ele);
                });
			 }
		 };	
		 
		 
        
		 //Get tour User Guide list
		 ListDetailCoreService.prototype.getUserGuideStep_V3 = function(portletId, dataset) {
			 var self = this;
			 var deferred = $q.defer();			
			 var resourceURL = self.initialMethodPortletURL(portletId,"findUserGuide");
			 resourceURL = resourceURL.toString();			 
			 self.ajax.postRuntime(resourceURL, undefined, JSON.stringify(dataset),function(data){				
				 deferred.resolve(data);
				 if(data != "")
					 window.localStorage.setItem("userguide",JSON.stringify(data));
			 });
			 return  deferred.promise;			 			 			 
		 };
		 
		 /**
		 * @author dnguyen98
		 * Check network connection for mobile App
		 */
		 ListDetailCoreService.prototype.checkIsOnline = function() {
			 var self = this;
			 var deferred = self.$q.defer();
			connectService.exeAction({
		    	actionName: "SYSTEM_CHECK_NETWORK",
		    	actionParams: [],
		    	resourceURL: undefined
		    }).then(function(data){
					 deferred.resolve(data);	
		    });
			 return deferred.promise;
		};
		 
		ListDetailCoreService.prototype.updateSignedStatus = function(resourceURL, actionParams){
			var self = this;
			var deferred = self.$q.defer();
			var actionName = "UPDATE_SIGNED_STATUS";
			connectService.exeAction({
				actionName: actionName,
				actionParams: actionParams,
				resourceURL: resourceURL,
				data: "{}"
			}).then(function(data){
				deferred.resolve(data);
			});
			 return deferred.promise;
		};
		 
		 return  {IposError: IposError,
			 IposDocService: IposDocService,
			 ListDetailCoreService: ListDetailCoreService,
			 ExtraDetail: ExtraDetail} ;

}]);

function IposObject() {
	this.uid = undefined;
	this.relationship = undefined;
	
	this.setUid = function(uid) {
		this.uid = uid;
	};
	
	this.setRelationship = function(relationship) {
		this.relationship = relationship;
	};
};

function MetaIposObject(module, objectType, parent, requireSigning) {
	this.module = module;
	this.objectType = objectType;
	this.parent = parent;
	this.requireSigning = requireSigning;
	
	this.isMultiple = function() {
		return (parent != undefined);
	};
}



