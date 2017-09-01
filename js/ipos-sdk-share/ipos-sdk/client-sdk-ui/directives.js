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

/* Directives */
//var urlContext = angular.contextPathTheme;
var directiveUIModule = angular.module('directiveUIModule',['ng','ui.bootstrap','translateUIModule'])
/**
 * Ipos AutoNumeric directive
 */
.directive('posAutonumeric', ['appService', 'commonService', '$locale', 
    function(appService, commonService, $locale) {
  return {
        require: '?ngModel',
        priority: 10,
        link: function(scope, element, attrs, model) {
        	 if(window.cordova){
                 attrs[ 'max' ] = attrs[ 'max' ] || 999999999999999.99;
                 attrs[ 'min' ] = attrs[ 'min' ] || 0;
                 attrs[ 'decimal' ] = attrs[ 'decimal' ] || 2;
                 attrs[ 'placeholder' ] = attrs[ 'placeholder' ] || "";
                 attrs['aDec'] =  attrs['aDec'] || $locale.NUMBER_FORMATS.DECIMAL_SEP;
                 attrs['aSep'] =  attrs['aSep'] || $locale.NUMBER_FORMATS.GROUP_SEP;

                var userBeingInput = false;
                var isMoveCurror = true;

                 $( element ).bind( 'blur', function(){
                     userBeingInput = false;
                     $( element ).val( out( model.$modelValue ) );
                 });
                 $( element ).bind( 'focus', function(){
                     userBeingInput = true;
                     var value = model.$viewValue;
                     var check = false;
                     if(typeof value == "string" && value == "0")
                        check = true;
                     if(typeof value == "number" && value == 0)
                         check = true;
                     if(check){
                        model.$setViewValue("");
                        model.$render();
                     }
                });
                 // $parsers
                 var into = function into(input) {
                         // capture current cursor index
                        var cursorIndex = element.caret().begin;
                        if(typeof input == 'string'){
                             cursorIndex -= input.length;
                        }else{
                              cursorIndex -= (input + "").length;
                        }
                        var transInput = input;
                        if(typeof input != 'number')
                            transInput = input.replace( /[^0-9\.]/gi, '' );
                        if(transInput != input){
                            model.$setViewValue(transInput);
                            model.$render();
                        }
                        cursorIndex += transInput.length;
                        // move cursor come back to postoion before go to this function
                        if(isMoveCurror)
                            element.selectRange(cursorIndex,cursorIndex);
                        return transInput;
                  };
                 // $formatters
                 var out = function out( input ){
                    var org = input+"";
                     if( model.$valid && input !== undefined && input > '' ){
                          if(typeof input == "number")
                            input = input+"";
                          if( input != '' ) {
                             input = input.replace( /,/gi,'' );
                             input = parseFloat( input );
                             var power = Math.pow( 10, attrs[ 'decimal' ] );
                             input = Math.round( input * power ) / power;
                             if( input > attrs[ 'max' ] )
                                   input = attrs[ 'max' ];
                             if( input < attrs[ 'min' ] )
                                   input = attrs[ 'min' ];
                            }
                            input += "";
                           // valid!
                           if(org != input){
                                model.$setValidity( 'valid', true );
                                model.$setViewValue(input);
                            }
                           return addCommas(input);
                     }else
                         return '';
                 };

                 var outModelToView = function out( input ){
                     var org = input+"";
                      if( model.$valid && input !== undefined && input > '' ){
                           if(typeof input == "number")
                             input = input+"";
                           if( input != '' ) {
                              input = input.replace( /,/gi,'' );
                              input = parseFloat( input );
                              var power = Math.pow( 10, attrs[ 'decimal' ] );
                              input = Math.round( input * power ) / power;
                              if( input > attrs[ 'max' ] )
                                    input = attrs[ 'max' ];
                              if( input < attrs[ 'min' ] )
                                    input = attrs[ 'min' ];
                             }
                             input += "";
                            // valid!
                            if(org != input){
                                model.$setValidity( 'valid', true );
                                isMoveCurror = false;
                                model.$setViewValue(input);
                                 model.$render();
                                isMoveCurror = true;
                             }
                            return addCommas(input);
                      }else
                          return '';
                  };

                  model.$parsers.push(into);
                  model.$formatters.push(outModelToView);

                 // add Commas to group number, fit decimal.
                 var addCommas = function addCommas(nStr){
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

 				//add Commas to group number, ignore fit decimal.
 				var addCommasWithoutCareDecimal = function addCommasWithoutCareDecimal(nStr){
                     nStr += '';
                     nStr = nStr.replace( /[^0-9\.]/gi, '' );
                     var x = nStr.split( attrs['aDec']);
                     var x1 = x[0];
                     x1  = parseFloat( x1  );
                     if(typeof x1 == 'number' && !isNaN(x1))
                         x1 = x1 + "";
                     else
                         x1 = '';
                     var x2 = x.length > 1 ?  attrs['aDec'] + x[1] : "";
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

                 // select range of text in input text. in this case, we use this function to move cursor.
                 $.fn.selectRange = function(start, end) {
                     return this.each(function() {
                         var self = this;
                         if (self.setSelectionRange) {
                             self.setSelectionRange(start, end);
                         } else if (self.createTextRange) {
                             var range = self.createTextRange();
                             range.collapse(true);
                             range.moveEnd('character', end);
                             range.moveStart('character', start);
                             range.select();
                         }
                     });
                 };

             }else{
		        var opts = angular.extend({}, {
		            aSep: $locale.NUMBER_FORMATS.GROUP_SEP, 
		            aDec: $locale.NUMBER_FORMATS.DECIMAL_SEP, 
		            mDec: attrs.decimal == undefined ? 2 : attrs.decimal, 
		            aPad: true,
		            nBracket: "(,)",
		            vMin: attrs.min == undefined ? "0":attrs.min,
		            vMax: attrs.max == undefined ? "999999999999999.99":attrs.max}, 
		            scope.$eval(attrs.posAutonumeric));
		          if (model != null) {
		            element.bind("keyup blur", function(){
		              var value = model.$viewValue;
		              if(value !== undefined){
		                var testValue = element.val();
		                var newValue = '';
		//                if(testValue !== '') newValue = element.autoNumericGet();
		                if(testValue !== '') newValue = element.autoNumeric('get');
		                if(value !== newValue){
		                  return scope.$apply(function() {
		                    if(opts.percent)
		                      newValue = newValue/100;
		                      return model.$setViewValue(newValue);
		                  });  
		                }  
		              }
		              return false;
		            });
		
		            model.$render = function() {
		              var value = model.$viewValue;
		              if(!commonService.hasValueNotEmpty(value)) return element.autoNumeric('set', "");
		                if(opts.percent)
		                  value = value * 100;
		                if(angular.isString(value))
		                  value = value.replace(/,/gi,'');
		//              return element.autoNumericSet(value);
		              return element.autoNumeric('set', value);
		            };
		          }
		          return element.autoNumeric(opts);
		        }
        	}
      };
}])
.directive('numbersOnly', ['appService', 'commonService', function(appService, commonService) {
   return {
     require: 'ngModel',
     priority: 10,
     link: function(scope, element, attrs, modelCtrl) {
/*       var maxLength="";
       var opts = angular.extend({
            'maxLength': maxLength,
        },
        scope.$eval(attrs.numbersOnly) 
      );
*/       modelCtrl.$parsers.push(function (inputValue) {
           // this next if is necessary for when using ng-required on your input. 
           // In such cases, when a letter is typed first, this parser will be called
           // again, and the 2nd time, the value will be undefined
           if (inputValue == undefined) return '';
           var transformedInput = inputValue.replace(/[^0-9]/g, '');
//           transformedInput = transformedInput.substring(0,opts.maxLength);
           if (transformedInput!=inputValue) {
              modelCtrl.$setViewValue(transformedInput);
              modelCtrl.$render();
           }         

           return transformedInput;         
       });
     }
   };
}])
.directive('vehicleNumber', [ function() {
   return {
     require: 'ngModel',
     priority: 10,
     scope: {
    	 vrPattern : "@",
    	 modelUpdate: "=",
    	 attrModelUpdate : "@"
     },
     link: function(scope, element, attrs, modelCtrl) {
    	 var modelUpdate = scope.modelUpdate;
    	 var attrModelUpdate = scope.attrModelUpdate;
    	 var pattern = scope.vrPattern;
    	 var lenPattern = pattern.length;
       modelCtrl.$parsers.push(function (inputValue) {
           if (inputValue == undefined) return '';
           
           var orgvalue = inputValue;
           var lenInput = inputValue.length;
           
           inputValue = inputValue.toUpperCase();
           var transformedInput = "";
           
           if(lenInput>0){
        	   if(inputValue.charAt(0) == pattern.charAt(0)){
		           var len = lenInput > lenPattern ? lenPattern : lenInput;  
		           
		           var isMatchPattern = true;
		           for(var i = 0; i < len; i++){
		        	   if(pattern.charAt(i) != inputValue.charAt(i)){
		        		   isMatchPattern = false;
		        		   break;
		        	   }
		           }
		           if(isMatchPattern){
		        	   transformedInput = inputValue.substring(0, len);
		        	   /*if(inputValue == pattern){
		        		   modelUpdate[attrModelUpdate] = pattern;
		        	   }*/
		           }else{
		        	   transformedInput = inputValue.replace(/[^X]/g, '');
		        	   /*if(modelUpdate[attrModelUpdate] == pattern)
		        		   modelUpdate[attrModelUpdate] = "";*/
		           }
        	   }else{
        		   transformedInput = inputValue.replace(/[^0-9]/g, '');
        		  /* if(modelUpdate[attrModelUpdate] == pattern)
	        		   modelUpdate[attrModelUpdate] = "";*/
        	   }
           }/*else{
        	   if(modelUpdate[attrModelUpdate] == pattern)
        		   modelUpdate[attrModelUpdate] = "";
           }*/
          
           if (attrModelUpdate != undefined && modelUpdate != undefined ){
        	   if(inputValue == pattern)
            	   modelUpdate[attrModelUpdate] = pattern;
        	   else if(modelUpdate[attrModelUpdate] == pattern )
        		   modelUpdate[attrModelUpdate] = "";
           }
           
           modelCtrl.$setViewValue(transformedInput);
           modelCtrl.$render();
           return transformedInput;         
       });
     }
   };
}])
.directive('phoneNumbersOnly', ['appService', 'commonService', function(appService, commonService) {
   return {
     require: 'ngModel',
     priority: 10,
     link: function(scope, element, attrs, modelCtrl) {
/*       var maxLength="";
       var opts = angular.extend({
            'maxLength': maxLength,
        },
        scope.$eval(attrs.numbersOnly) 
      );
*/       modelCtrl.$parsers.push(function (inputValue) {
           // this next if is necessary for when using ng-required on your input. 
           // In such cases, when a letter is typed first, this parser will be called
           // again, and the 2nd time, the value will be undefined
           if (inputValue == undefined) return '';
           var n = inputValue.indexOf(" ")
           var s1 = inputValue.slice(0,n+1);
           var s2 = inputValue.slice(n+1,inputValue.length);
           var transformedInput = s1 + s2.replace(/[^0-9]/g, '');
//           transformedInput = transformedInput.substring(0,opts.maxLength);
           if (transformedInput!=inputValue) {
              modelCtrl.$setViewValue(transformedInput);
              modelCtrl.$render();
           }
           return transformedInput;         
       });
     }
   };
}])
/*
 * hle56
 * use for Direct Sale
 */
.directive('phoneNumbersOnlyDs', ['appService', 'commonService', function(appService, commonService) {
	var prefix = '';
   return {
     require: 'ngModel',
     priority: 10,
     link: function(scope, element, attrs, modelCtrl) {
       modelCtrl.$parsers.push(function (inputValue) {
           if (inputValue == undefined) return '';
           var transformedInput = '';
           var n = inputValue.indexOf(" ");
           if(inputValue.startsWith("+") && n!=-1){
		           var s1 = inputValue.slice(1,n+1);
		           var s2 = inputValue.slice(n+1,inputValue.length);
		           transformedInput = "+" + s1.replace(/[^0-9]/g, '') + " " + s2.replace(/[^0-9]/g, '');
		           prefix = "+" + s1.replace(/[^0-9]/g, '') + " ";
		           if(s2.replace(/[^0-9]/g, '').length == 0){
		        	   if(!commonService.hasValueNotEmpty(scope.uiElement.refDetail.errorMessage))
		        		   scope.uiElement.refDetail.errorMessage = 'null';
		               scope.uiElement.refDetail.$ = '';
		           } else
		        	   delete scope.uiElement.refDetail.errorMessage;
           }else if(inputValue.startsWith("+")){
        	   transformedInput = "+" + inputValue.replace(/[^0-9]/g, '') + " ";
        	   if(commonService.hasValueNotEmpty(transformedInput)){
        		   delete scope.uiElement.refDetail.errorMessage;
        	   }
           }else {
        		 transformedInput = inputValue.replace(/[^0-9]/g, '');
        		 if(commonService.hasValueNotEmpty(transformedInput)){
          		   delete scope.uiElement.refDetail.errorMessage;
          	   	 }
           }
           
           if(transformedInput.length == 0){
        	   transformedInput = prefix;
           }
           if (transformedInput!=inputValue) {
              modelCtrl.$render(transformedInput);
           }

           return transformedInput;         
       });
     }
   };
}])
/*
 * hle56
 * use for Direct Sale
 */
.directive('posPhoneNumberDs', ['commonService', function(commonService){
	return {
		require: '?ngModel',
		priority: 10,
		link: function(scope, element, attrs, model){
			if (model != null){
				//listen for changing in address type dropdown through observing a spy attribute
				attrs.$observe('src', function(item){
				     item = scope.$eval(item);//convert json string --> object
				     var value = scope.moduleService.findPropertyInElement(item, ['type'], 'value').value;
				     if (value == "EMAIL"){
				    	 element.prev().addClass("hide");
				     } else if (element.prev().hasClass("hide")){
				    	 element.prev().removeClass("hide");
				     }
				   });
				
				//view -> model
				element.bind("keyup blur", function() {
					var number = element.val();
					if(number !== undefined){
						var n = number.indexOf(" ")
						if (n !== -1){
							var s1 = number.slice(0,n+1);
							var s2 = number.slice(n+1,number.length);
				           	number = s1 + s2.replace(/[^0-9]/g, '');
						} else {
							number = number.replace(/[^0-9]/g, '') + "";
							element.val(number);
						}
						
						if(model.$viewValue !== undefined && !scope.$$phase){
							return scope.$apply(function(){
								model.$setViewValue(number);
								//model.$render(); //bug: IMKI-286: The key left and right does not work on Contact No under Contact Tile 
							});
						};
					}
					return false;
				});
				
				 // click off to close
	            $("ui-view").click(function(e) {
	            	var uiELe = $("ui-view").find('.country-list');	            	
	            	if(uiELe.length > 0){
	            		for(var i = 0; i < uiELe.length; i++){
	            			var htmlele = uiELe[i]; 
	            			if((htmlele instanceof HTMLElement) && htmlele.classList.contains("country-list")){
	            				if(!htmlele.classList.contains("hide")){
	            					htmlele.classList.add("hide");
	            				}	            					
	            			}
	            		}
	            	}	            	
	            });
				
				//model -> view
				model.$render = function(value){
					if(value == undefined)
						value = model.$viewValue;
					if(commonService.hasValueNotEmpty(value))
						element.val(value);
						element.keyup();
				};
			}


			var preferredCountries = scope.$eval(attrs.preferredCountries);
			var selectCountry = attrs.selectCountry;
			if(!preferredCountries){
				preferredCountries =  [ "SG", "MY" ];
			}
			if(!selectCountry){//default if there are no selectCountry
				selectCountry =  "SG";
			}
			//set phone prfix
			if(selectCountry == "ID"){//indonesia
				element.val("+62 ");
			}
			
			if(selectCountry == "SG"){ //Singapore
				element.val("+65 ");
			}
			
			var options = {
					preferredCountries: preferredCountries,
			        americaMode: false,
			        selectCountry: selectCountry
			};
			/*element.autoNumeric({vMin: '0', vMax: '999999999999'});*/
			element.intlTelInput(options);
			setTimeout(function(){ 
				var downArrow = $('.intl-number-input .down-arrow');
				if(downArrow && downArrow.length > 0){
					for(var i =0; i < downArrow.length; i++){
						if(downArrow[i].parentElement.parentElement.parentElement.nextElementSibling.disabled == true){
							downArrow[i].innerHTML = '<i class="fa fa-caret-down fa-3x isDisable"></i>';
						}else{
							downArrow[i].innerHTML = '<i class="fa fa-caret-down fa-3x"></i>';
						}
					}
				}
			 });
		}
	};
}])
.directive('cnumbersOnly', ['appService', 'commonService', function(appService, commonService) {
   return {
     require: 'ngModel',
     priority: 10,
     link: function(scope, element, attrs, modelCtrl) {
       var cmaxLength="";
       var opts = angular.extend({
            'cmaxLength': cmaxLength,
        },
        scope.$eval(attrs.cnumbersOnly) 
      );
       modelCtrl.$parsers.push(function (inputValue) {
           // this next if is necessary for when using ng-required on your input. 
           // In such cases, when a letter is typed first, this parser will be called
           // again, and the 2nd time, the value will be undefined
           if (inputValue == undefined) return '';
           var transformedInput = inputValue.replace(/[^0-9]/g, '');
           transformedInput = transformedInput.substring(0,opts.cmaxLength);
           
           if (transformedInput!=inputValue) {
              modelCtrl.$setViewValue(transformedInput);
              modelCtrl.$render();
           }         

           return transformedInput;         
       });
     }
   };
}])
.directive('rangeNumbersOnly', ['appService', 'commonService', function(appService, commonService) {
   return {
     require: 'ngModel',
     priority: 10,
     link: function(scope, element, attrs, modelCtrl) {
       var cmaxLength="";
       var max="";
       var min="";
       var opts = angular.extend({
            'cmaxLength': cmaxLength,
            'min': min,
            'max': max,
        },
        scope.$eval(attrs.rangeNumbersOnly) 
      );
       modelCtrl.$parsers.push(function (inputValue) {
           // this next if is necessary for when using ng-required on your input. 
           // In such cases, when a letter is typed first, this parser will be called
           // again, and the 2nd time, the value will be undefined
           if (inputValue == undefined) return '';
           
           var re = new RegExp("[^" + opts.min + "-" + opts.max + "]","g");
           var transformedInput = inputValue.replace(re, '');
           
//         var transformedInput = inputValue.replace(/[^1-6]/g, '');
           transformedInput = transformedInput.substring(0,opts.cmaxLength);
           
           if (transformedInput!=inputValue) {
              modelCtrl.$setViewValue(transformedInput);
              modelCtrl.$render();
           }         

           return transformedInput;         
       });
     }
   };
}])

/**
 * Ipos jQuery UI resizable directive
 * to do resize left side bar *only*
 */
.directive('posResizable', function() {
  return {
        link: function(scope, element, attrs) {
        
          return element.resizable({
        handles: "e",
        minWidth: 20,
        resize: function(event, ui){
           var w = Math.floor(( 100 * parseFloat($(this).css("width")) / parseFloat($(this).parent().css("width")) )) + "%";
           $(this).css("width" , w);
           $(this).css("height", "auto");
           $(this).siblings(".right").css("left" , w);
        }
      });
        }
      };
})

/**
 * Ipos set variable directive
 * to set value to variable
 */
.directive('posSetvar', function() {
  return {
        link: function(scope, element, attrs) {
          return scope.$eval(attrs.posSetvar);
        }
  };
})

/**
 * to check module authorization
 */
.directive('posAuthorizedmodule', ['commonService', function(commonService) {
  return {
        link: function(scope, element, attrs) {
          var moduleName = attrs.posAuthorizedmodule;
          if(commonService.hasValueNotEmpty(moduleName)){
            var hasModule = scope.workspaceService.hasModule(attrs.posAuthorizedmodule);
            if(!hasModule) element.remove();  
          }
          return true;
        }
      };
}])

.directive('autoPercent', ['$filter', function($filter) {
  return {
      require: '?ngModel',
      link: function(scope, ele, attr, model){
        model.$parsers.unshift(
                function(viewValue){
                    return $filter('number')(viewValue/100);
                }
            );
        model.$formatters.unshift(
                function(modelValue){
                    return $filter('number')(modelValue*100);
                }
            );
          }
      };
}])

.directive('posPhonenumber', ['commonService', function(commonService){
	return {
		require: '?ngModel',
		priority: 10,
		link: function(scope, element, attrs, model){
			if (model != null){
				//listen for changing in address type dropdown through observing a spy attribute
				attrs.$observe('src', function(item){
				     item = scope.$eval(item);//convert json string --> object
				     var value = scope.moduleService.findPropertyInElement(item, ['type'], 'value').value;
				     if (value == "EMAIL"){
				    	 element.prev().addClass("hide");
				     } else if (element.prev().hasClass("hide")){
				    	 element.prev().removeClass("hide");
				     }
				   });
				
				//view -> model
				element.bind("keyup blur", function() {
					var number = element.val();
					if(number !== undefined){
						var n = number.indexOf(" ")
						if (n !== -1){
							var s1 = number.slice(0,n+1);
							var s2 = number.slice(n+1,number.length);
				           	number = s1 + s2.replace(/[^0-9]/g, '');
						} else {
							number = number.replace(/[^0-9]/g, '') + "";							
						}
						
						//set new model after format -> view
						element.val(number);
						
						if(model.$viewValue !== undefined && !scope.$$phase){
							return scope.$apply(function(){
								model.$setViewValue(number);
								//model.$render(); //bug: IMKI-286: The key left and right does not work on Contact No under Contact Tile 
							});
						};
					}
					return false;
				});
				
				 // click off to close
	            $("ui-view").click(function(e) {
	            	var uiELe = $("ui-view").find('.country-list');	            	
	            	if(uiELe.length > 0){
	            		for(var i = 0; i < uiELe.length; i++){
	            			var htmlele = uiELe[i]; 
	            			if((htmlele instanceof HTMLElement) && htmlele.classList.contains("country-list")){
	            				if(!htmlele.classList.contains("hide")){
	            					htmlele.classList.add("hide");
	            				}	            					
	            			}
	            		}
	            	}	            	
	            });
				
				//model -> view
				model.$render = function(){
					var value = model.$viewValue;
					if(commonService.hasValueNotEmpty(value))
						element.val(value);
						element.keyup();
				};
				
			}


			var preferredCountries = scope.$eval(attrs.preferredCountries);
			var selectCountry = attrs.selectCountry;
			if(!preferredCountries){
				preferredCountries =  [ "SG", "MY" ];
			}
			if(!selectCountry){//default if there are no selectCountry
				selectCountry =  "SG";
			}
			//set phone prfix
			if(selectCountry == "ID"){//indonesia
				element.val("+62 ");
			}
			
			if(selectCountry == "SG"){ //Singapore
				element.val("+65 ");
			}
			
			var options = {
					preferredCountries: preferredCountries,
			        americaMode: false,
			        selectCountry: selectCountry
			};
			/*element.autoNumeric({vMin: '0', vMax: '999999999999'});*/
			element.intlTelInput(options);
			
			//dnguyen98: override this class to hide the flag and the layout is same with other component
			setTimeout(function(){ 
				var downArrow = $('.intl-number-input .down-arrow');
				if(downArrow && downArrow.length > 0){
					for(var i =0; i < downArrow.length; i++){
						if(downArrow[i].parentElement.parentElement.parentElement.nextElementSibling.disabled == true){
							downArrow[i].innerHTML = '<i class="fa fa-caret-down fa-3x isDisable"></i>';
						}else{
							downArrow[i].innerHTML = '<i class="fa fa-caret-down fa-3x"></i>';
						}
					}
				}
			 });

		}
	};
}])
.directive('msDatepicker', ['commonService', '$compile', function(commonService, $compile) {
    return {
        require: '?ngModel',
        link: function(scope, element, attrs, model) {
          /*angular.element.fn.mobiscroll=$.fn.mobiscroll; */
          
            scope.getMaxDate = function() {
            if(commonService.hasValueNotEmpty(attrs.maxdate)) {
              return new Date(attrs.maxdate);
            } else {
              return new Date();
            }
          }
            
            scope.getMinDate = function() {
            if(commonService.hasValueNotEmpty(attrs.mindate)) {
              return new Date(attrs.mindate);
            } else {
              var minD = new Date();
              minD.setFullYear(maxDate.getFullYear()-300);
              return minD;
            }
          }
          
          var opts, getModelDateFormat;
          var maxDate = scope.getMaxDate();
          var minDate = scope.getMinDate();
          var dateFormatToModel = "yy-mm-dd";
          
          function appendInput(){
            var att = attrs.ngModel;
            
            var disabled = '';
            var ngChanged = '';
            var ngBlur = '';
            
            var maxD = 'maxDate="' + moment(scope.getMaxDate()).format("YYYY-MM-DD") + '"';
            var minD = 'minDate="' + moment(scope.getMinDate()).format("YYYY-MM-DD") + '"';
            
            if(commonService.hasValueNotEmpty(attrs.ngDisabled)) {
              disabled = 'ng-disabled="' + attrs.ngDisabled + '"'; 
            }
            if(commonService.hasValueNotEmpty(attrs.moreAction)) {
              ngChanged = ' ng-change="' + attrs.moreAction + '" ';
            }
            if(commonService.hasValueNotEmpty(attrs.moreActionBlur)) {
              ngBlur = ' ng-blur="' + attrs.moreActionBlur + '" ';
            }
            
            var modelText = 'ng-model=' + '"' + att + '"';
            var input
            if(window.cordova){
            	input='<input maxlength="11" class="form-control" format-input-date type="text" ';
            }else{
            	input='<input maxlength="10" class="form-control" format-input-date type="text" ';
            }
            input =input + modelText + ' ' + maxD + ' ' + minD +  ' ' + disabled +  ngChanged + ngBlur + ' ></input>';
            var compile=$compile(input)(scope);
            if(!window.cordova){
            	compile.mask('99/99/9999',{placeholder:"dd/mm/yyyy"});
            }
             angular.element(element).before(compile);
          };
            
          getModelDateFormat = function(){
            var format = opts.dateFormat;
            if(!commonService.hasValueNotEmpty(opts.dateFormat) && scope.moduleService !== undefined){
                format = scope.moduleService.getModelDateFormat();
            }
            return format;
          };
          opts = angular.extend(
            {
              'maxDate': maxDate,
              'minDate': minDate,
              'defaultValue': maxDate,
              'dateFormat':'dd/mm/yyyy', // For view mode
              'mode': 'scroller',
              'theme': 'android-holo light',
              'onSelect': function (valueText, inst) {
                if(attrs.moreAction) {
                  if(attrs.moreAction) {
                    scope.$apply(
                        scope.$eval(attrs.moreAction)
                    );
                  }
                }

                //prevent the 'click' event occur inside DOM from bubbling to outside.
                //There's a bug when using this directive in Liferay
                //After bubbling CLICK event to Liferay JS's handler in maximized Porlet mode
                //A Porlet's using this directive will disappeared!
                //This directive HTML is outside porlet's HTML
                event.stopPropagation();
              },
              'onCancel': function(valueText, inst) {
                //see the comment in 'onSelect' attribute
                 event.stopPropagation();
              },
              //'headerText': false,
              button3Text: 'Clear',
              button3: function(){
                var inst = element.mobiscroll('getInst');
                scope.$apply(function(){
                  element.val("");
                  model.$setViewValue("");
                });
                inst.cancel();

                //see the comment in 'onSelect' attribute
                event.stopPropagation();
              },
            },
            scope.$eval(attrs.msDatepicker)
          );

          model.$formatters.unshift(function(valueFromModel) {
              //  check for new detail or existing one
              if(!commonService.hasValueNotEmpty(valueFromModel)){
                  element.mobiscroll("setDate", angular.element.mobiscroll.parseDate(dateFormatToModel, new Date()));
                  return "";
              }
              //  parse date from server's format
              var date = angular.element.mobiscroll.parseDate(dateFormatToModel, valueFromModel);
              //  notify mobiscroll widget about it
              element.mobiscroll("setDate", date);
              //  show date on input field in ui format (default: dd/mm/yyyy)
              var dateStr = angular.element.mobiscroll.formatDate(dateFormatToModel, date);
              return dateStr;
          });

          model.$parsers.push(function(valueFromInput) {
            //  parse date from ui format (default: dd/mm/yyyy) then re-format as string for model value
            //  check if clear button was clicked
            if(!commonService.hasValueNotEmpty(valueFromInput)){
                element.mobiscroll("setDate", angular.element.mobiscroll.parseDate(dateFormatToModel, new Date()));
                return "";
            }
            //  parse date from ui format
            var date = angular.element.mobiscroll.parseDate("dd/mm/yy", valueFromInput);
            //  notify mobiscroll widget about it
            element.mobiscroll("setDate", date);
            var dateStr = angular.element.mobiscroll.formatDate(dateFormatToModel, date);
            return dateStr;
          });

          element.on('$destroy', function() {
              element.mobiscroll('destroy');
          });

          // Create the mobi-scroll datepicker widget
          element.mobiscroll().date(opts);
          
          // fix css issue
          element.css('cursor', 'auto');
          element.css('background', 'white');
          appendInput();
        }
    };
}])
.directive('msDatepickerOnlyPast', ['commonService', '$compile', 'commonUIService', function(commonService, $compile, commonUIService) {
    return {
        require: '?ngModel',
        link: function(scope, element, attrs, model) {
          /*angular.element.fn.mobiscroll=$.fn.mobiscroll; */
            var opts, getModelDateFormat;
            var maxDate = new Date();
            var minDate = new Date();
            var dateFormatToModel = "yy-mm-dd";
            function appendInput(){
              var att = attrs.ngModel;
              
              var disabled = '';
              
              if(commonService.hasValueNotEmpty(attrs.ngDisabled)) {
                disabled = 'ng-disabled="' + attrs.ngDisabled + '"'; 
              }
              
              var modelText = 'ng-model=' + '"' + att + '"';
              var input='<input maxlength="10" class="form-control" format-input-date type="text" ' + modelText + ' ' + disabled +'" ></input>';
              var compile=$compile(input)(scope);
              compile.mask('99/99/9999',{placeholder:"dd/mm/yyyy"});
              angular.element(element).before(compile);
            };
            
            minDate.setFullYear(maxDate.getFullYear() - 100);
            getModelDateFormat = function(){
                var format = opts.dateFormat;
                if(!commonService.hasValueNotEmpty(opts.dateFormat) && scope.moduleService !== undefined){
                    format = scope.moduleService.getModelDateFormat();
                }
                return format;
            };
            opts = angular.extend({
            'maxDate': maxDate,
            'minDate': minDate,
            'defaultValue': maxDate,
            'dateFormat':'dd/mm/yyyy', // For view mode
            'mode': 'scroller',
            'theme': 'android-holo light',
            //'headerText': false,
            'onSelect': function(valueText, inst) {
              //see the comment in 'button3' attribute
               event.stopPropagation();
            },
            'onCancel': function(valueText, inst) {
              //see the comment in 'onSelect' attribute
               event.stopPropagation();
            },
            button3Text: 'Clear',
            button3: function(){
              var inst = element.mobiscroll('getInst');
              scope.$apply(function(){
                element.val("");
                model.$setViewValue("");
              });
              inst.cancel();


              //prevent the 'click' event occur inside DOM from bubbling to outside.
              //There's a bug when using this directive in Liferay
              //After bubbling CLICK event to Liferay JS's handler in maximized Porlet mode
              //A Porlet's using this directive will disappeared!
              //This directive HTML is outside porlet's HTML
              event.stopPropagation();
            },
          },
          scope.$eval(attrs.msDatepicker)
            );
            model.$formatters.unshift(function(valueFromModel) {
                //  check for new detail or existing one
                if(!commonService.hasValueNotEmpty(valueFromModel)){
                    element.mobiscroll("setDate", angular.element.mobiscroll.parseDate(dateFormatToModel, new Date()));
                    return "";
                }
               
   
                var maxDate = new Date();
                var valueFromModelCheck = new Date(valueFromModel);
                // check value of input with current date
              if(valueFromModelCheck > maxDate){
                //  if true show message error
                commonUIService.showNotifyMessage("v3.style.message.CannotSelectDateGreaterThanCurrentDate", "fail");
                // restart to current date
                var currentdate = angular.element.mobiscroll.parseDate(dateFormatToModel, new Date());
                model.$modelValue=currentdate;
                model.$$rawModelValue=currentdate;
                model.$setViewValue(currentdate);
                element.val(currentdate);
              
              } else {
                  //  parse date from server's format
                  var date = angular.element.mobiscroll.parseDate(dateFormatToModel, valueFromModel);
                  //  notify mobiscroll widget about it
                  element.mobiscroll("setDate", date);
                  //  show date on input field in ui format (default: dd/mm/yyyy)
                  var dateStr = angular.element.mobiscroll.formatDate(dateFormatToModel, date);
                  return dateStr;
              }
            });
            model.$parsers.push(function(valueFromInput) {
                //  parse date from ui format (default: dd/mm/yyyy) then re-format as string for model value
                //  check if clear button was clicked
                if(!commonService.hasValueNotEmpty(valueFromInput)){
                    element.mobiscroll("setDate", angular.element.mobiscroll.parseDate(dateFormatToModel, new Date()));
                    return "";
                }
                //  parse date from ui format
                var date = angular.element.mobiscroll.parseDate("dd/mm/yy", valueFromInput);
                //  notify mobiscroll widget about it
                element.mobiscroll("setDate", date);
                var dateStr = angular.element.mobiscroll.formatDate(dateFormatToModel, date);
                return dateStr;
            });
            element.on('$destroy', function() {
                element.mobiscroll('destroy');
            });
            // Create the mobi-scroll datepicker widget
            element.mobiscroll().date(opts);
            // fix css issue
            element.css('cursor', 'auto');
            element.css('background', 'white');
            appendInput();
        }
    };
}])
.directive('formatInputDate', ['$filter', 'commonService', 'commonUIService', function ($filter, commonService, commonUIService) {
    return {
      require: '?ngModel',
      restrict:'EA',
        link: function (scope, element, attrs, ngModel) {
			if(window.cordova){
	        //****** start
	            var patternDate = "dd/mm/yyyy".split("");//pattern date format
	            var valuePattern = patternDate.slice(0);// value of view
	            var seperate = "/";
	            var first = true;
	            var formatView ="DD/MM/YYYY", formatDoc = "YYYY-MM-DD";
	            // old code
	            var maxDate = attrs.maxdate;
	            var minDate = attrs.mindate;
	            var isMessage = attrs.isMessage;
	            var currentDate = moment().format("YYYY-MM-DD");
	
	            $.fn.selectRange2 = function(start, end) {
	                return this.each(function() {
	                    var self = this;
	                    if (self.setSelectionRange) {
	                         setTimeout(function(){
                                self.setSelectionRange(start, end);
                             }, 10);
	                    } else if (self.createTextRange) {
	                        var range = self.createTextRange();
	                        range.collapse(true);
	                        range.moveEnd('character', end);
	                        range.moveStart('character', start);
	                        range.select();
	                    }
	                });
	            };
	        //****** end
	      ngModel.$parsers.push(function(value) {
	        //****** start
	          if(!commonService.hasValueNotEmpty(value)) {
	              first = false;
	              ngModel.$setViewValue(patternDate.join(""));
	              ngModel.$render();
	              first = true;
	              valuePattern = patternDate.slice(0);
	              element.selectRange2(0,0);
	              return undefined;
	          }
	          if(!first){
	              return convertDate(valuePattern.join(""),formatView,formatDoc);
	          }
	          var cursorIndex = element.caret().begin;

	          if(value.length > patternDate.length){ //add character
	              //check invalid input
	              if(cursorIndex > patternDate.length || // max length
	                value.indexOf(" ") != -1|| // input character space
	                /[^0-9]/gi.test(value.charAt(cursorIndex-1))){ // input non number
	                  first = false;
	                  ngModel.$setViewValue(valuePattern.join(""));
	                  ngModel.$render();
	                  first = true;
	                  element.selectRange2(cursorIndex-1,cursorIndex-1);
	                  return convertDate(valuePattern.join(""),formatView,formatDoc);
	              }
	              var n = cursorIndex-1;
	              for(;n < patternDate.length; n++){
	                  if(patternDate[n] == seperate){
	                      continue;
	                  }else{
	                      break;
	                  }
	              }
	              valuePattern[n] = value.charAt(cursorIndex-1);
	              first = false;
	              ngModel.$setViewValue(valuePattern.join(""));
	              ngModel.$render();
	              first = true;
	              element.selectRange2(n+1,n+1);
	          }else{
	              if(patternDate[cursorIndex] == seperate)
	                  cursorIndex--;
	              valuePattern[cursorIndex] = patternDate[cursorIndex];
	              first = false;
	              ngModel.$setViewValue(valuePattern.join(""));
	              ngModel.$render();
	              first = true;
	              element.selectRange2(cursorIndex,cursorIndex);
	          }
	          return convertDate(valuePattern.join(""),formatView,formatDoc);
	          //****** end
	      });
	      ngModel.$formatters.push(function(value) {
	          if(value && checkDateValue(value,formatDoc)){
	              value = convertDate(value,formatDoc,formatView);
	              for(var i = 0;i < valuePattern.length; i++){
	                  valuePattern[i] = value.charAt(i);
	              }
	              return value;
	          }else{
	              valuePattern = patternDate.slice(0);
	              return patternDate.join("");
	          }
	      });
	      var convertDate = function convertDate(value, formatFrom, formatTo){
	          if(value== undefined || value.indexOf("d") > -1 || value.indexOf("m") > -1 || value.indexOf("y") > -1){
	              return "";
	            }
	           var val = moment(value, formatFrom).format(formatTo);
	           return val;
	      }
	      var checkDateValue = function checkDateValue(value, formatFrom){
	    	  if(value== undefined || value.indexOf("d") > -1 || value.indexOf("m") > -1 || value.indexOf("y") > -1){
	                return false;
	          }
	          var val = moment(value, formatFrom).format("YYYY-MM-DD");
	          return commonUIService.isValidDate(val, "YYYY-MM-DD", minDate, maxDate) ;
	      }
	      element.on("keyup", function(e){
	          if(e.keyCode == 229 &&
	            (element.val().charAt(0) == " " || element.val().charAt(element.val().length-1) == " " )){

	              var cursorIndex = element.caret().begin;
	              first = false;
	              ngModel.$setViewValue(valuePattern.join(""));
	              ngModel.$render();
	              first = true;
	              element.selectRange2(cursorIndex-1,cursorIndex-1);
	          }
	      });
	      element.on("focus", function(e){
	           setTimeout(function(){
                 element.selectRange2(0,0);
               }, 50);
	      });
	      element.on("blur", function(e){
	         var valid =  checkDateValue(element.val(), formatView);
	         if(!valid){
	            if(isMessage == undefined || isMessage === "undefined"){
	                commonUIService.showNotifyMessage("v3.style.message.InvalidDate", "fail");
	            }
	            if(isMessage === "gss"){
	                commonUIService.showNotifyMessage("v3.user.error.message.MSG004", "fail");
	            }
	            first = false;
	            valuePattern=patternDate.slice(0);
	            ngModel.$setViewValue("");
	            ngModel.$render();
	            first = true;
	            ngModel.$modelValue = undefined;
	         }
	      });
	      }else{
	          //format text going to user (model to view)
	          ngModel.$formatters.push(function(value) {
	            if(value) {
	              return angular.element.mobiscroll.formatDate('dd/mm/yyyy', angular.element.mobiscroll.parseDate('yy-mm-dd', value));
	            }
	            return value;
	          });
	
	          //format text from the user (view to model)
	          ngModel.$parsers.push(function(value) {
	            /*if(!(value instanceof Date)) {
	              var arrayDate = value.split("/");
	              var isValidDate = new Date(arrayDate[2] + "/" + arrayDate[1] + "/" + arrayDate[0]);
	              if(isValidDate.toString() == "NaN" || isValidDate.toString() == "Invalid Date") {
	                commonUIService.showNotifyMessage("Invalid Date", "fail");
	                // reset to current date
	                var currentdateModel = angular.element.mobiscroll.formatDate('yy-mm-dd', angular.element.mobiscroll.parseDate('dd/mm/yy', new Date()));
	                var currentdateView = angular.element.mobiscroll.formatDate('dd/mm/yy', angular.element.mobiscroll.parseDate('dd/mm/yy', new Date()));
	                ngModel.$modelValue=currentdateModel;
	                ngModel.$$rawModelValue=currentdateModel;
	                ngModel.$setViewValue(currentdateView);
	                ngModel.$render();
	                return currentdateModel;
	              }
	            }*/
	            if(!commonService.hasValueNotEmpty(value)) {
	              element.val("");
	              ngModel.$setViewValue("");
	              return "";
	            }
	
	            //return when user not conplete typing (issue on android tablet: always show invalid date)
	            if(value.indexOf("d") > -1 || value.indexOf("m") > -1 || value.indexOf("y") > -1){
	                return;
	            }
	
	            var maxDate = attrs.maxdate;
	            var minDate = attrs.mindate;
	            var isMessage = attrs.isMessage;
	            var currentDate = moment().format("YYYY-MM-DD");
	            var val = moment(value, "DD/MM/YYYY").format("YYYY-MM-DD");
	            if(!commonUIService.isValidDate(val, "YYYY-MM-DD", minDate, maxDate)) {
	                if(isMessage == undefined || isMessage === "undefined"){
	                    commonUIService.showNotifyMessage("v3.style.message.InvalidDate", "fail");
	                }
	                if(isMessage === "gss"){
	                    commonUIService.showNotifyMessage("v3.user.error.message.MSG004", "fail");
	                }
	              // reset to current date
	              var currentdateModel = angular.element.mobiscroll.formatDate('yy-mm-dd', angular.element.mobiscroll.parseDate('dd/mm/yy', new Date()));
	              var currentdateView = angular.element.mobiscroll.formatDate('dd/mm/yy', angular.element.mobiscroll.parseDate('dd/mm/yy', new Date()));
	              ngModel.$modelValue=currentdateModel;
	              ngModel.$$rawModelValue=currentdateModel;
	              ngModel.$setViewValue(currentdateView);
	              ngModel.$render();
	              return currentdateModel;
	            } else {
	                return angular.element.mobiscroll.formatDate('yy-mm-dd', angular.element.mobiscroll.parseDate('dd/mm/yy', value));
	            }
	          });
	        }
        }
    };
}])
.directive('formatdatepicker', ['dateFilter', function(dateFilter) {
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, ngModel) {
        ngModel.$parsers.push(function(viewValue) {
          return dateFilter(viewValue, 'yyyy-MM-dd');
        });
      }
    }
}])
.directive('formatdatepicker1', ['dateFilter', function(dateFilter) {
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, ngModel) {
      ngModel.$parsers.push(function(viewValue) {
        return dateFilter(viewValue, 'dd/MM/yyyy');
      });
    }
  }
}])
.directive("switchRadio", ['$compile', function ($compile) {
  return {
    require: '?ngModel',
    restrict: 'EA',
    replace: true,
    link: function(scope, element, attrs){
      var radioStyle = attrs.class;
      var disable = "false";
      var propName, ngModel, hideSelecteValuedWhen;
      if(attrs.name !== undefined){
        propName = attrs.name.trim();
      }
      
      if(attrs.isdisabled !== undefined){
        disable = attrs.isdisabled;
      }
      if(attrs.ngModel !== undefined){
        ngModel = attrs.ngModel;
      } else if (propName !== undefined) {
        ngModel = "moduleService.findPropertyInDetail(['" + propName + "'],'value').value";
      }
      if(attrs.hideSelecteValuedWhen !== undefined){
        hideSelecteValuedWhen = attrs.hideSelecteValuedWhen;
      } else {
        hideSelecteValuedWhen = '!moduleService.commonService.hasValueNotEmpty(' + ngModel + ')';
      }
      var enumArr = angular.fromJson(attrs.enum);
      var ngClickArr = angular.isDefined(attrs.ngClick)?' ng-change ="' + attrs.ngClick + '"':"";
      // set higher priority for a callback method supplied by ng-change
      // it's more proper to use ng-change instead of ng-click, i.e. <switch-radio ng-change="someThingNeedToBeDoneAfterModelHasChanged(args)"></switch-radio> 
      if (angular.isDefined(attrs.ngChange)) {
        ngClickArr = 'ng-change ="' + attrs.ngChange + '"';
      }
      var content = '<div class="switch switch-' + enumArr.length + ' ' + radioStyle + '" ng-class="' + disable + '? \'disable\' : \'\' ">';
      for (var i = 0; i < enumArr.length; i++){
        content = content + '<input ng-disabled="' + disable + '" ' + ngClickArr +' id="'+ propName + '-' + enumArr[i].text +'" type="radio" name="'+ propName +'" value="'+ 
        enumArr[i].value +'" ng-model="' + ngModel + '" />' +
        '<label class="switch-radio-center" for="' + propName + '-' + enumArr[i].text + '" onclick="">'+ enumArr[i].text +'</label>';
      }
      content = content + '<span class="slide-button btn btn-info disabled" ng-hide="' + hideSelecteValuedWhen + 
      '"></span></div>';
      
      var contentEle = angular.element(content);
      $compile(contentEle)(scope);
      contentEle.insertAfter(element);
    }
  };
  // usage
  // <switch-radio class="alert-success" name="gender/maritualStatus, etc." enum="{{moduleService.findEnumsInDetail(['maritalStatus'])}}"></switch-radio>
}])
.directive("emailSwitchRadio", ['$compile', function ($compile) {
  return {
    require: '?ngModel',
    restrict: 'E',
    replace: true,
    link: function(scope, element, attrs){
      var radioStyle = attrs.class;
      var propName = attrs.name;
      var enumArr = angular.fromJson(attrs.enum);
      var ngClickArr = angular.isDefined(attrs.ngClick)?' ng-change ="' + attrs.ngClick + '"':"";
      // set higher priority for a callback method supplied by ng-change
      // it's more proper to use ng-change instead of ng-click, i.e. <switch-radio ng-change="someThingNeedToBeDoneAfterModelHasChanged(args)"></switch-radio> 
      if (angular.isDefined(attrs.ngChange)) {
        ngClickArr = 'ng-change ="' + attrs.ngChange + '"';
      }
      var content = '<div class="switch switch-' + enumArr.length + ' ' + radioStyle + ' ">';
      for (var i = 0; i < enumArr.length; i++){
        content = content + '<input ' + ngClickArr +' id="'+ propName + '-' + enumArr[i].text +'" type="radio" name="'+ propName +'" value="'+ 
        enumArr[i].value +'" ng-model="' + propName + '" />' +
        '<label for="' + propName + '-' + enumArr[i].text + '" onclick="">'+ enumArr[i].text +'</label>';
      }
      content = content + '<span class="slide-button btn btn-info disabled" ng-show="moduleService.commonService.hasValueNotEmpty(' + propName + ')"' + 
      '></span></div>';
      
      var contentEle = angular.element(content);
      $compile(contentEle)(scope);
      contentEle.insertAfter(element);
    }
  };
}])
.directive("switchRadio2", ['$compile', function ($compile) {
  return {
    require: '?ngModel',
    restrict: 'E',
    replace: true,
    link: function(scope, element, attrs){
      var radioStyle = attrs.class;
      var propName = attrs.name;
      var parent = attrs.parent;
      var disable= "";
      if(attrs.isdisable !== undefined){
        disable = attrs.isdisable;
      }
      if (parent == undefined)
        parent = 'moduleService.detail';
      var enumArr = angular.fromJson(attrs.enum);
      var value = attrs.value;
      var ngClickArr = angular.isDefined(attrs.ngClick)?' ng-change ="' + attrs.ngClick + '"':"";
      // set higher priority for a callback method supplied by ng-change
      // it's more proper to use ng-change instead of ng-click, i.e. <switch-radio ng-change="someThingNeedToBeDoneAfterModelHasChanged(args)"></switch-radio> 
      if (angular.isDefined(attrs.ngChange)) {
        ngClickArr = 'ng-change ="' + attrs.ngChange + '"';
      }
      var content = '<div class="switch switch-' + enumArr.length + ' ' + radioStyle + ' ">';
      for (var i = 0; i < enumArr.length; i++){
        content = content + '<input ' + disable + ngClickArr +' id="'+ propName + '-' + enumArr[i].text +'" type="radio" name="'+ propName +'" value="'+ 
        enumArr[i].value +'" ng-model="' + value + '" />' +
        '<label for="' + propName + '-' + enumArr[i].text + '" onclick="">'+ enumArr[i].text +'</label>';
      }
      content = content + '<span class="slide-button btn btn-info disabled" ng-show="' +
        'moduleService.commonService.hasValueNotEmpty(moduleService.findPropertyInElement(' + parent + ',[\'' + propName + '\'],\'value\').value)"' + 
      '></span></div>';
      
      var contentEle = angular.element(content);
      $compile(contentEle)(scope);
      contentEle.insertAfter(element);
    }
  };
}])
.directive("riderComponentSwitchRadio", ['$compile', 'illustrationCoreService', function ($compile, illustrationCoreService) {
  return {
    restrict: 'E',
    templateUrl: 'views/template/rider_component_switch.html',
    link: function(scope, element, attrs){
      scope.componentCode = scope.moduleService.findPropertyInElement(scope.item, ['Component_Code'],'value').value;
      scope.componentY = scope.componentCode + "-Y";
      scope.componentN = scope.componentCode + "-N";
    }
  };
  // put this directive inside ng-repeat"item in riderComponentList"
  // <rider-component-switch-radio></rider-component-switch-radio>
}])
.directive("riderComponentSwitchRadio2", ['$compile', 'illustrationCoreService', function ($compile, illustrationCoreService) {
  return {
    restrict: 'E',
    templateUrl: 'views/template/rider_component_switch2.html',
    link: function(scope, element, attrs){
      scope.componentCode = scope.moduleService.findPropertyInElement(scope.item, ['Component_Code'],'value').value;
      scope.componentY = scope.componentCode + "-Y";
      scope.componentN = scope.componentCode + "-N";
    }
  };
  // put this directive inside ng-repeat"item in riderComponentList"
  // <rider-component-switch-radio></rider-component-switch-radio>
}])
.directive('illustrationCard', ['$state', function ($state) {
    return {
      restrict:'EA',
      templateUrl: 'views/template/card/illustration.html',
      transclude:true,
      replace:true,
      scope: {
        illustration: '=item',
        moduleService: '=service',
        controller: '=',
        isLeftSideBar: '@isleftsidebar'
      },
      link: function(scope, iElement, iAttrs, controller) {
        scope.showIllustrationDetail = function (illustrationUid){
          $state.go('illustration.detail', {illustrationUid: illustrationUid});
        };
        scope.addIllustration = function(){
          $state.go('illustration.product');
        };
      }
    };
}])
.directive('illustrationLoadingCard', ['$state',  function ($state) {
  return {
    restrict:'EA',
    templateUrl: 'views/template/card/illustration_loading.html',
    transclude:true,
    replace:true,
    scope: {
    },
    link: function(scope, iElement, iAttrs, controller) {
    }
  };
}]) 
.directive('prospectCard', ['$state',  function ($state) {
    return {
      restrict:'EA',
      templateUrl: 'views/template/card/prospect.html',
      transclude:true,
      replace:true,
      scope: {
        prospect: '=item',
        moduleService: '=service',
        controller: '=',
        isLeftSideBar: '@isleftsidebar'
      },
      link: function(scope, iElement, iAttrs, controller) {
        scope.showProspectDetail = function (prospectUid){
          $state.go('prospect.detail', {uid: prospectUid});
        };
        scope.addProspect = function(){
          $state.go('prospect.new');
        };
      }
    };
}])
.directive('prospectLoadingCard', ['$state',  function ($state) {
  return {
    restrict:'EA',
    templateUrl: 'views/template/card/prospect_loading.html',
    transclude:true,
    replace:true,
    scope: {
    },
    link: function(scope, iElement, iAttrs, controller) {
    }
  };
}]) 
.directive('subordinateCard', ['$state', function ($state) {
    return {
      restrict:'EA',
      templateUrl: 'views/template/card/subordinate.html',
      transclude:true,
      replace:true,
      scope: {
        subordinate: '=item',
        moduleService: '=service',
        controller: '=',
        isLeftSideBar: '@isleftsidebar'
      },
      link: function(scope, iElement, iAttrs, controller) {
        scope.listItemsOfSubordinate = function (subordinateUid, subordinateFullname){
          scope.moduleService.appService.subordinateUid = subordinateUid;
          scope.moduleService.appService.subordinateFullname = subordinateFullname;
          $state.go('home');
        };
      }
    };
}])
.directive('salecaseCard', ['$state', function ($state) {
    return {
      restrict:'EA',
      templateUrl: 'views/template/card/salecase.html',
      transclude:true,
      replace:true,
      scope: {
        salecase: '=item',
        moduleService: '=service',
        controller: '=',
        isLeftSideBar: '@isleftsidebar'
      },
      link: function(scope, iElement, iAttrs, controller) {
        scope.showSalecaseDetail = function (salecaseUid){
          $state.transitionTo('sale.detail', {uid: salecaseUid});
        };
        scope.addSalecase = function(){
          $state.go('sale.new');
        };
      }
    };
}])
.directive('applicationCard', ['$state', function ($state) {
    return {
      restrict:'EA',
      templateUrl: 'views/template/card/application.html',
      transclude:true,
      replace:true,
      scope: {
        application: '=item',
        moduleService: '=service',
        controller: '=',
        isLeftSideBar: '@isleftsidebar'
      },
      link: function(scope, iElement, iAttrs, controller) {
        scope.showApplicationDetail = function (applicationUid){
          $state.transitionTo('application.detail', {uid: applicationUid});
        };
        scope.addApplication = function(){
          $state.go('application.new');
        };
      }
    };
}])
.directive('applicationLoadingCard', ['$state', function ($state) {
  return {
    restrict:'EA',
    templateUrl: 'views/template/card/application_loading.html',
    transclude:true,
    replace:true,
    scope: {
    },
    link: function(scope, iElement, iAttrs, controller) {
    }
  };
}]) 
.directive('factfindCard', ['$state', function ($state) {
    return {
      restrict:'EA',
      templateUrl: 'views/template/card/factfind.html',
      transclude:true,
      replace:true,
      scope: {
        clickFn: "&",
        factfind: '=item',
        moduleService: '=service',
        controller: '=',
        isLeftSideBar: '@isleftsidebar',
        showDateType: '@'
      },
      link: function(scope, iElement, iAttrs, controller) {
        if(!iAttrs.clickFn){
          scope.useDefaultClick = true;
        }
        scope.showFactfindDetail = function (factfindUid){
          $state.go('need_analysis.detail', {factfindUid: factfindUid});
        };
        scope.addFactfind = function(){
          $state.go('need_analysis.new');
        };
      }
    };
}])
.directive('factfindLoadingCard', ['$state', function ($state) {
  return {
    restrict:'EA',
    templateUrl: 'views/template/card/factfind_loading.html',
    transclude:true,
    replace:true,
    scope: {
    },
    link: function(scope, iElement, iAttrs, controller) {
    }
  };
}]) 
.directive('prospectSummaryCard', function () {
    return {
      restrict:'EA',
      templateUrl: 'views/template/card/prospect_summary.html',
      transclude:true,
      replace:true,
      scope: {
        fullName: '=fullname',
        gender: '=',
        age: '=',
        updatedDate: '=updateddate'
      },
      link: function(scope, iElement, iAttrs, controller) {
      }
    };
})
.directive('paymentCard', ['$state',  function ($state) {
  return {
      restrict:'EA',
      templateUrl: 'views/template/card/payment.html',
      transclude:true,
      replace:true, // must add full data of all type payment, otherwise will happen error
      scope: {
        payment: '=item',
        moduleService: '=service',
        controller: '=',
        isLeftSideBar: '@isleftsidebar'
      },
      link: function(scope, iElement, iAttrs, controller) {
        scope.showPaymentDetail = function (paymentUid){
          $state.go('payment.detail', {uid: paymentUid});
        };
      }
    };
}])
.directive('paymentLoadingCard', ['$state', function ($state) {
  return {
    restrict:'EA',
    templateUrl: 'views/template/card/payment_loading.html',
    transclude:true,
    replace:true, // must add full data of all type payment, otherwise will happen error
    scope: {
    },
    link: function(scope, iElement, iAttrs, controller) {
    }
  };
}]) 
.directive('illustrationMetadataCard', ['$state', function ($state) {
    return {
      restrict:'EA',
      templateUrl: 'views/template/card/illustration_metadata.html',
      transclude:true,
      replace:true,
      scope: {
        illustration: '=item',
        moduleService: '=service',
        controller: '='
      },
      link: function(scope, iElement, iAttrs, controller) {
      }
    };
}]) 
.directive('v3WhenDone', ['$timeout', '$parse', function($timeout, $parse) {
    return {
        link: function(scope, element, attrs) {
            if (scope.$last) {
                //wait for the render to finish before mark the selected value
                $timeout(
                    function() {
                        //call function after finish render
                        if (attrs.hasOwnProperty('v3WhenDone')) {
                            $parse(attrs.v3WhenDone)(scope);
                        }
                    }, 100);
            }
        }
    }
}]) 
.directive('v3Card', ['$parse', function ($parse) {
    return {
      restrict:'E',
      templateUrl: contextPathRoot + '/view/myNewWorkspace/template/v3_metacard.html',
      scope: true,
//      {
//        moduleService:'=service',
//      controller:'=', 
//      isNew: "&",
//        aClick: "&",
//        content: "@",
//        aClass: "@",
//        cardType: "=",
//        metaData: "=",
//        contentClass: "@"
//      },
      link: function(scope, iElement, iAttrs) {
        iElement.children().addClass(iAttrs.aClass);
        if (iAttrs.hasOwnProperty('cardType')) {
          var watcher = scope.$watch(iAttrs.cardType, function(_new, _old){

                if(!_new){
                  return;
                }
                
                scope.fileName = _new.replace(/-/g, '_');
                scope.url = contextPathRoot + '/view/myNewWorkspace/partial/'+ scope.fileName +'/v3_'+ scope.fileName + 'card.html';
              });

            }
      }
    };
}])
.directive('managerreviewCard', ['$state', function ($state) {
    return {
      restrict:'EA',
      templateUrl: 'views/template/card/managerreview.html',
      transclude:true,
      replace:true,
      scope: {
        review: '=item',
        moduleService: '=service',
        controller: '=',
        isLeftSideBar: '=isleftsidebar',
        isHomePage: '=ishomepage'
      },
      link: function(scope, iElement, iAttrs, controller) {
        scope.showReviewDetail = function (review){
          $state.transitionTo('sale.detail', {uid: review.parentUid});
        };
      }
      
    };
}])
.directive('managerreviewLoadingCard', ['$state', function ($state) {
  return {
    restrict:'EA',
    templateUrl: 'views/template/card/managerreview_loading.html',
    transclude:true,
    replace:true,
    scope: {
    },
    link: function(scope, iElement, iAttrs, controller) {
    }
  };
}]) 
.directive('clientCard', ['$state', function ($state) {
    return {
      restrict:'EA',
      templateUrl: 'views/template/card/client.html',
      transclude:true,
      replace:true,
      scope: {
        client: '=item',
        moduleService: '=service',
        controller: '=',
        isLeftSideBar: '@isleftsidebar'
      },
      link: function(scope, iElement, iAttrs, controller) {
        scope.goToDetail = function(client) {
//          scope.moduleService.selectClient(client);
          $state.go('client.detail', {uid: client.uid});
        };
      }
    };
}]) 
.directive('globalMessage', ['$timeout', '$sce', function ($timeout, $sce) {
    return {
      restrict:'E',
      templateUrl: 'views/template/message/message.html',
      scope: {
        type: '=',   // by reference
        content: '=',
        isDisplay: '=isdisplay'
      },
      link: function (scope, element, attrs) {
        var timeoutId;
        scope.closeAlert = function() {   //event click close alert
          element.hide();
          $timeout.cancel(timeoutId);
          scope.isDisplay = false;
        };
        
        scope.$watch('isDisplay', function() {      //when isDisplay's value is changed
            if(scope.isDisplay == true) {
                element.show();
                timeoutId = $timeout(function() {
                     scope.isDisplay = false;
                 }, 10000);
            }
            else {
              element.hide();
            }
        });
        
        scope.renderHtml = function(html_code)
        {
            return $sce.trustAsHtml(html_code);
        };
      }
    };
}])
.directive('autosizeInput', ['$timeout', function($timeout) {   
    return {
      restrict:'A',
      link: function (scope, element, attrs){
        $timeout(function(){   //set timeout to get DOM 
          $timeout(function(){                      
            element.autosizeInput();
          }, 0);
        }, 0);
      }  
    };
}])
.directive('hint', ['appService', function (appService) {
    return {
      restrict:'EA',
      templateUrl: 'views/template/hint/hint.html',
      transclude:true,
      replace:true,
      scope: {
        content: "=",
        multiple:"@multiline",
        hClass: "@hclass"
      },
      link: function(scope, iElement, iAttrs, controller) {
      }
    };
}])
.directive('scrolled', function() {
    return{
      link: function(scope, elm, attr) {
          var raw = elm[0];
          elm.on('scroll', function() {           
              if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
                 scope.$apply(attr.scrolled);
              }           
          });
      }
    };
})
.directive('scrolledx', function() {
    return{
      link: function(scope, elm, attr) {
          var raw = elm[0];
          elm.on('scroll', function() {
               scope.$apply(attr.scrolledx);
          });
      }
    };
})
.directive('dropdownStayOpen', function() {   
    return {
      restrict:'A',
      link: function (scope, element, attrs){
        element.on("click", "[data-stopPropagation]", function(e) {
          e.stopPropagation();
        });
      }  
    };
})
.directive('numberpad', ['appService', function (appService) {
    return {
      require: '?ngModel',
    restrict:'EA',
    templateUrl: 'views/template/numberpad/numberpad.html',
    transclude:true,
    replace:true,
    link: function(scope, iElement, iAttrs, model) {
      var opts = angular.extend({
              'interval': 1000
            },
            scope.$eval(iAttrs.numberpad)
          );
      var interval = opts.interval;
        var currentValue = 0, newValue = 0;
        scope.addDigit = function(digitToAdd){
          if (model.$viewValue === ''){
            model.$setViewValue(digitToAdd);
            return;
          };
          if (typeof model.$viewValue === 'number')
            currentValue = model.$viewValue;
          if (typeof model.$viewValue === 'string')
            currentValue = parseInt(model.$viewValue);
        if (currentValue == 0){
          newValue = digitToAdd;
        } else {
          newValue = currentValue * 10 + digitToAdd;
        }
        model.$setViewValue(newValue);
        };
        scope.clear = function(){
          model.$setViewValue(0);
        };
        scope.backSpace = function(){
          var modelValue = 0;
          if (model.$viewValue === ''){
            model.$setViewValue(0);
            return;
          };
          if (typeof model.$viewValue === 'number'){
            modelValue = model.$viewValue;
          }
          if (typeof model.$viewValue === 'string'){
            modelValue = parseInt(model.$viewValue);
          }
          newValue = Math.floor(modelValue/10);
          model.$setViewValue(newValue);
        };
        scope.increaseInterval = function(){
          if (model.$viewValue === '' || isNaN(model.$viewValue)){
            model.$setViewValue(interval);
            return;
          };
          if (typeof model.$viewValue === 'number'){
            model.$setViewValue(model.$viewValue + interval);
          }
          if (typeof model.$viewValue === 'string'){
            model.$setViewValue(parseInt(model.$viewValue) + interval);
          }
        };
        scope.decreaseInterval = function(){
          if (model.$viewValue === ''|| isNaN(model.$viewValue)){
            model.$setViewValue(-interval);
            return;
          };
          if (typeof model.$viewValue === 'number'){
            model.$setViewValue(model.$viewValue - interval);
          }
          if (typeof model.$viewValue === 'string'){
            model.$setViewValue(parseInt(model.$viewValue) - interval);
          }
        };
      }
    };
}])
.directive('ngRightClick', ['$parse', function($parse) {
    return function(scope, element, attrs) {
        var fn = $parse(attrs.ngRightClick);
        element.bind('contextmenu', function(event) {
            scope.$apply(function() {
                event.preventDefault();
                fn(scope, {$event:event});
            });
        });
    };
}])

.directive('dynamic', ['$compile', function($compile) {
  return {
    restrict : 'A',
    replace : true,
    link : function(scope, ele, attrs) {
      scope.$watch(attrs.dynamic, function(html) {
        ele.html(html);
        $compile(ele.contents())(scope);
      });
    }
  };
}])

.directive('prospectDetail', ['$state', '$compile', function ($state, $compile) {
  return {
    restrict:'EA',
    scope: {
      moduleService: '=service',
      parentElement: '@'
    },
    link: function(scope, iElement, iAttrs, controller) {
      scope.groupElementByRowNo = function(parent){
        var result = [];
        var elementToSearch = scope.moduleService.findElementInElement(parent, ['person']);
        for ( var i = 0; i < elementToSearch.elements.length; i++) {
          var prop = scope.moduleService.findPropertyInElement(elementToSearch.elements[i], [], "rowNo");
          if(scope.moduleService.commonService.hasValue(prop)){
            if (result[eval(prop.value)] == undefined)
              result[eval(prop.value)] = [];
            result[eval(prop.value)].push(elementToSearch.elements[i]);
          }
        }
        return result;
      };
      
      if (scope.moduleService.uiModelData != undefined){
        var eleLev1s = scope.moduleService.uiModelData.elements;
        var genHTML = "";
        var outterColSize = scope.moduleService.findPropertyInElement(scope.moduleService.uiModelData, ['person'], "outterColSize").value;
      var outterColOffset = scope.moduleService.findPropertyInElement(scope.moduleService.uiModelData, ['person'], "outterColOffset").value;
        var result = scope.groupElementByRowNo(scope.moduleService.uiModelData);
        
        angular.forEach(result, function(innerArray, index1){
          genHTML += "<div class=\"row\">";
        if (scope.moduleService.commonService.hasValueNotEmpty(outterColSize) &&
            scope.moduleService.commonService.hasValueNotEmpty(outterColOffset)){
          genHTML += "<div class=\"col-md-" + outterColSize + " col-md-offset-" + outterColOffset + "\">";
        }
          angular.forEach(innerArray, function(element, index2){
            var controlType = scope.moduleService.findPropertyInElement(element, [], "type");
            if(!scope.moduleService.commonService.hasValueNotEmpty(controlType)){
              controlType.value = "text";
            }
            var repeatVar;
            var columnSize =  scope.moduleService.findPropertyInElement(element, [], "columnSize").value;
          genHTML += "<div class=\"col-md-" + columnSize + "\">";
            genHTML += "<label for=\"title\" class=\"control-label\" ";
            genHTML += "ng-bind=\"moduleService.findPropertyInDetail(['" + element.name + "'],'caption').value\" ></label>";
            
            switch(controlType.value) {
                    case "dropdown":
                      genHTML += "<select class=\"form-control\" name=\"";
                      genHTML += element.name + "\"";
                      genHTML += " ng-model=\"moduleService.findPropertyInDetail([\'" + element.name + "\'],\'value\').value\" ";
                      /*genHTML += "<option value=\"\"></option>";
                      genHTML += "<option ng-repeat=\"i in moduleService.";
                      if (repeatVar != undefined) {
                        genHTML += "findEnumsInElement(" + repeatVar + ",";
                      } else {
                        genHTML += "findEnumsInDetail(";
                      }
                      genHTML += "['" + element.name + "'])\" value=\"{{i.value}}\">{{i.text}}</option>";*/
                      genHTML += " ng-options=\"i.value as i.text for i in moduleService.findEnumsInDetail([\'"+ element.name + "\'])\" >"; 
                      genHTML += "</select>";
                      /*genHTML += buildSources(sources, self.element.name);*/
                    break;
                    case "text":
                      genHTML += "<input class=\"form-control\" type=\"text\" name=\"";
                      /*genHTML += buildUpdatedProperties(updatedProperties, self.element.name);*/
                      genHTML += element.name + "\"";
                      genHTML += " ng-model=\"moduleService.findPropertyInDetail([\'" + element.name + "\'],\'value\').value\" />";
                    
                      /*genHTML += buildSources(sources, self.element.name);*/
                      
                    break;
                    case "date":
                      genHTML += "<input class=\"form-control\" ms-datepicker type=\"text\" name=\"";
                      /*genHTML += buildUpdatedProperties(updatedProperties, self.element.name);*/
                      genHTML += element.name + index1 + index2;
                      genHTML += "\" ng-model=\"moduleService.findPropertyInDetail([\'" + element.name + "\'],\'value\').value\" />";
  
                      /*genHTML += buildSources(sources, self.element.name);*/
                    break;
                  
                    case "radio":
                      genHTML += "<div switch-radio class=\"alert-success\" ";
                      /*genHTML += buildUpdatedProperties(updatedProperties, self.element.name);*/
                      genHTML += "name=\"" +element.name + "\" enum=\"{{moduleService.";
                      if (repeatVar != undefined) {
                        genHTML += "findEnumsInElement(" + repeatVar + ",";
                      } else {
                        genHTML += "findEnumsInDetail(";
                      }
                      genHTML += "['" + element.name + "']) }}\"";
                      /*<switch-radio class="alert-success" name="gender" enum="{{moduleService.findEnumsInDetail(['gender'])}}" isDisabled="moduleService.isDisabled(['gender'])"></switch-radio>*/
                      /*genHTML += buildSources(sources, self.element.name);*/
                      genHTML += "></div>";
                    break;
            }
          genHTML += "</div>";
          });
          if (scope.moduleService.commonService.hasValueNotEmpty(outterColSize) &&
            scope.moduleService.commonService.hasValueNotEmpty(outterColOffset)){
            genHTML += "</div>";
        }
          genHTML += "</div>";
          /*genHTML += "<label for="fullName" class="control-label" ng-bind="moduleService.findPropertyInDetail(['fullname'],'caption').value"></label>";*/
        });
      /*<label for="fullName" class="control-label" ng-bind="moduleService.findPropertyInDetail(['fullname'],'caption').value"></label>
      <span ng-show="moduleService.findPropertyInDetail(['fullname'],'mandatory').value == 1" ng-bind="moduleService.getMandatoryText().text"></span>
      <div>
        <div class="col-md-11 no-left-padding no-right-padding">
          <input type="text" ng-disabled="moduleService.isDisabled(['fullname'])" 
              ng-model="moduleService.findPropertyInDetail(['fullname'], 'value').value"
              class="form-control" id="fullName" placeholder="{{moduleService.findPropertyInDetail(['fullname'],'caption').value}}" maxlength="120"/>
        </div>
        <div class="col-md-1 no-left-padding no-right-padding">
          <hint hclass="pull-right center" multiLine="true" content="fullNameHints"></hint>
        </div>
      </div>
      <span class="text-danger" ng-bind="moduleService.findPropertyInDetail(['fullname'],'validate').value"/>*/
        
        var contentEle = angular.element(genHTML);
        $compile(contentEle)(scope);
        contentEle.insertAfter(iElement);
      }
      
    
    }
  };
}])
/*.directive('limitedRowsTextarea', function(appService, commonService, $compile) {
  return {
    require : '?ngModel',
    priority : 10,
    link : function(scope, element, attrs, ngModel) {
      var lineHeightId = "";
      var maxRows = "";
      var maxChars = "";
      var opts = angular.extend({
        'lineHeightId' : lineHeightId,
        'maxRows' : maxRows,
        'maxChars' : maxChars,
      }, scope.$eval(attrs.limitedRowsTextarea));
      
      lineHeightId = opts.lineHeightId;
      maxRows = opts.maxRows;
      maxChars = opts.maxChars;

      scope.checkLimits = function(txtArea) {
        var lh = $('#' + lineHeightId).height();
        var fs = parseInt(txtArea.css('font-size').replace('px', ''));
        var dh = Math.round((lh / fs) * 100) / 100;
        if (!txtArea.css('line-height') || !txtArea.css('height')) {
          txtArea.css('line-height', lh + 'px');
          if (txtArea.attr('rows') == maxRows)
            txtArea.css('height', Math.ceil((fs * txtArea.attr('rows') * dh) + ((fs * 200) / 300)));
          else
            txtArea.css('height', Math.ceil((fs * txtArea.attr('rows') * dh) + ((fs * 100) / 300)));
        }
        var maxLines = maxRows;
        var maxHeight = Math.ceil((fs * maxLines * dh) + ((fs * 200) / 300)); // with some font and / or font-size this value has to be adjusted!
        if (maxChars != 0 && maxChars > maxLines * txtArea.attr('cols'))
          maxChars = maxLines * txtArea.attr('cols'); // or any other suitable value

        
        //issue: txtArea[0].scrollHeight not updated correspondence with ngModel.$viewValue
        if (ngModel.$viewValue.length > maxChars || txtArea[0].scrollHeight > maxHeight) {
          while (txtArea[0].scrollHeight > maxHeight) {
            //txtArea.value = txtArea.value.substr(0,txtArea.value.length-3);
            ngModel.$setViewValue(ngModel.$viewValue.substr(0, ngModel.$viewValue.length - 1));
             $compile(txtArea.contents())(scope);
          }
          while (ngModel.$viewValue.length > maxChars && txtArea[0].scrollHeight <= maxHeight) {
            ngModel.$setViewValue(ngModel.$viewValue.substr(0, ngModel.$viewValue.length - 1));
             $compile(txtArea.contents())(scope);
          }
        }
      };

      if (ngModel != null) {
        element.bind("keyup forcus", function() {
          scope.checkLimits(element);
        });
        
        element.bind("contextmenu", function() {
          return false;
        });

        ngModel.$render = function() {
          scope.checkLimits(element);
        };
      }
    }
  };
});*/
.directive('inputPopup', ['$modal', function($modal){
    function link(scope, element, attrs){
        function open(size) {
        $modal.open({
          templateUrl: angular.contextPathTheme+'/views/template/inputpopup/iputpopup.html',
          controller: function ($scope, $modalInstance, items) {
                      $scope.items = items;
                      $scope.selected = {
                        item: scope.myModel
                      };
                      $scope.ok = function () {
                        $modalInstance.close($scope.selected.item);
                        scope.myModel=$scope.selected.item;
                      };
                      $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                      };
                    },
          size: size,
          resolve: {
            items: function () {
              return scope.myItems;
            }
          }
        });
      };
      element.bind('click', function() {
          open();
        });
    };
    return {
      restrict:'A',
      require: '?ngModel',
      replace: true,
      transclude : true,
      scope: {
          myModel: '=ngModel',
          myItems: '=items',
      },
      link:link
    };
}])
.directive('tooltips', ['$window', '$compile', function manageDirective($window, $compile) {

    var TOOLTIP_SMALL_MARGIN = 8 //px
      , TOOLTIP_MEDIUM_MARGIN = 9 //px
      , TOOLTIP_LARGE_MARGIN = 10 //px
      , CSS_PREFIX = '_720kb-tooltip-';
    return {
      'restrict': 'A',
      'scope': {},
      'link': function linkingFunction($scope, element, attr) {

        var initialized = false
          , thisElement = angular.element(element[0])
          , body = angular.element($window.document.getElementsByTagName('body')[0])
          , theTooltip
          , theTooltipHeight
          , theTooltipWidth
          , theTooltipMargin //used both for margin top left right bottom
          , height
          , width
          , offsetTop
          , offsetLeft
          , title = attr.tooltipTitle || attr.title || ''
          , content = attr.tooltipContent || ''
          , showTriggers = attr.tooltipShowTrigger || 'mouseover'
          , hideTriggers = attr.tooltipHideTrigger || 'mouseleave'
          , originSide = attr.tooltipSide || 'top'
          , side = originSide
          , size = attr.tooltipSize || 'medium'
          , tryPosition = typeof attr.tooltipTry !== 'undefined' && attr.tooltipTry !== null ? $scope.$eval(attr.tooltipTry) : true
          , className = attr.tooltipClass || ''
          , speed = (attr.tooltipSpeed || 'medium').toLowerCase()
          , lazyMode = typeof attr.tooltipLazy !== 'undefined' && attr.tooltipLazy !== null ? $scope.$eval(attr.tooltipLazy) : true
          , htmlTemplate =
              '<div class="_720kb-tooltip ' + CSS_PREFIX + size + '">' +
              '<div class="' + CSS_PREFIX + 'title"> ' + title + '</div>' +
              content + ' <span class="' + CSS_PREFIX + 'caret"></span>' +
              '</div>';

        //parse the animation speed of tooltips
        $scope.parseSpeed = function parseSpeed () {

          switch (speed) {
            case 'fast':
              speed = 100;
              break;
            case 'medium':
              speed = 450;
              break;
            case 'slow':
              speed = 800;
              break;
            default:
              speed = Number(speed);
          }
        };
        //create the tooltip
        theTooltip = $compile(htmlTemplate)($scope);

        theTooltip.addClass(className);

        body.append(theTooltip);

        $scope.isTooltipEmpty = function checkEmptyTooltip () {

          if (!title && !content) {

            return true;
          }
        };

        $scope.initTooltip = function initTooltip (tooltipSide) {

          if (!$scope.isTooltipEmpty()) {

            height = thisElement[0].offsetHeight;
            width = thisElement[0].offsetWidth;
            offsetTop = $scope.getRootOffsetTop(thisElement[0], 0);
            offsetLeft = $scope.getRootOffsetLeft(thisElement[0], 0);
            //get tooltip dimension
            theTooltipHeight = theTooltip[0].offsetHeight;
            theTooltipWidth = theTooltip[0].offsetWidth;

            $scope.parseSpeed();
            $scope.tooltipPositioning(tooltipSide);
          }
        };

        $scope.getRootOffsetTop = function getRootOffsetTop (elem, val){

          if (elem.offsetParent === null){

            return val + elem.offsetTop;
          }

          return $scope.getRootOffsetTop(elem.offsetParent, val + elem.offsetTop);
        };

        $scope.getRootOffsetLeft = function getRootOffsetLeft (elem, val){

          if (elem.offsetParent === null){

            return val + elem.offsetLeft;
          }

          return $scope.getRootOffsetLeft(elem.offsetParent, val + elem.offsetLeft);
        };

        thisElement.bind(showTriggers, function onMouseEnterAndMouseOver() {

          if (!lazyMode || !initialized) {

            initialized = true;
            $scope.initTooltip(side);
          }
          if (tryPosition) {

            $scope.tooltipTryPosition();
          }
          $scope.showTooltip();
        });

        thisElement.bind(hideTriggers, function onMouseLeaveAndMouseOut() {

          $scope.hideTooltip();
        });

        $scope.showTooltip = function showTooltip () {

          theTooltip.addClass(CSS_PREFIX + 'open');
          theTooltip.css('transition', 'opacity ' + speed + 'ms linear');
        };

        $scope.hideTooltip = function hideTooltip () {

          theTooltip.removeClass(CSS_PREFIX + 'open');
          theTooltip.css('transition', '');
        };

        $scope.removePosition = function removeTooltipPosition () {

          theTooltip
          .removeClass(CSS_PREFIX + 'left')
          .removeClass(CSS_PREFIX + 'right')
          .removeClass(CSS_PREFIX + 'top')
          .removeClass(CSS_PREFIX + 'bottom ');
        };

        $scope.tooltipPositioning = function tooltipPositioning (tooltipSide) {

          $scope.removePosition();

          var topValue
            , leftValue;

          if (size === 'small') {

            theTooltipMargin = TOOLTIP_SMALL_MARGIN;

          } else if (size === 'medium') {

            theTooltipMargin = TOOLTIP_MEDIUM_MARGIN;

          } else if (size === 'large') {

            theTooltipMargin = TOOLTIP_LARGE_MARGIN;
          }

          if (tooltipSide === 'left') {

            topValue = offsetTop + height / 2 - theTooltipHeight / 2;
            leftValue = offsetLeft - (theTooltipWidth + theTooltipMargin);

            theTooltip.css('top', topValue + 'px');
            theTooltip.css('left', leftValue + 'px');
            theTooltip.addClass(CSS_PREFIX + 'left');
          }

          if (tooltipSide === 'right') {

            topValue = offsetTop + height / 2 - theTooltipHeight / 2;
            leftValue = offsetLeft + width + theTooltipMargin;

            theTooltip.css('top', topValue + 'px');
            theTooltip.css('left', leftValue + 'px');
            theTooltip.addClass(CSS_PREFIX + 'right');
          }

          if (tooltipSide === 'top') {

            topValue = offsetTop - theTooltipMargin - theTooltipHeight;
            leftValue = offsetLeft + width / 2 - theTooltipWidth / 2;

            theTooltip.css('top', topValue + 'px');
            theTooltip.css('left', leftValue + 'px');
            theTooltip.addClass(CSS_PREFIX + 'top');
          }

          if (tooltipSide === 'bottom') {

            topValue = offsetTop + height + theTooltipMargin;
            leftValue = offsetLeft + width / 2 - theTooltipWidth / 2;
            theTooltip.css('top', topValue + 'px');
            theTooltip.css('left', leftValue + 'px');
            theTooltip.addClass(CSS_PREFIX + 'bottom');
          }
        };

        $scope.tooltipTryPosition = function tooltipTryPosition () {


            var theTooltipH = theTooltip[0].offsetHeight
              , theTooltipW = theTooltip[0].offsetWidth
              , topOffset = theTooltip[0].offsetTop
              , leftOffset = theTooltip[0].offsetLeft
              , winWidth = $window.outerWidth
              , winHeight = $window.outerHeight
              , rightOffset = winWidth - (theTooltipW + leftOffset)
              , bottomOffset = winHeight - (theTooltipH + topOffset)
              //element OFFSETS (not tooltip offsets)
              , elmHeight = thisElement[0].offsetHeight
              , elmWidth = thisElement[0].offsetWidth
              , elmOffsetLeft = thisElement[0].offsetLeft
              , elmOffsetTop = thisElement[0].offsetTop
              , elmOffsetRight = winWidth - (elmOffsetLeft + elmWidth)
              , elmOffsetBottom = winHeight - (elmHeight + elmOffsetTop)
              , offsets = {
                'left': leftOffset,
                'top': topOffset,
                'bottom': bottomOffset,
                'right': rightOffset
              }
              , posix = {
                'left': elmOffsetLeft,
                'right': elmOffsetRight,
                'top': elmOffsetTop,
                'bottom': elmOffsetBottom
              }
              , bestPosition = Object.keys(posix).reduce(function (best, key) {

                  return posix[best] > posix[key] ? best : key;
              })
              , worstOffset = Object.keys(offsets).reduce(function (worst, key) {

                  return offsets[worst] < offsets[key] ? worst : key;
              });

              if (offsets[worstOffset] < 5) {

                side = bestPosition;

                $scope.initTooltip(bestPosition);
              }
        };

        //make sure that the tooltip is hidden when the directive is destroyed
        $scope.$on('$destroy', $scope.hideTooltip);

        angular.element($window).bind('resize', function onResize() {

          $scope.hideTooltip();
          $scope.initTooltip(originSide);
        });
      }
    };
}])
.directive('payment', ['$state', function ($state) {
    return {
      restrict:'E',
      templateUrl:  angular.contextPathTheme+'/views/template/paymentDetail.html',
      transclude:true,
      replace:true,
      scope: {
        moduleServicePayment:'=service',
        controller:'='
      },
      link: function(scope, iElement, iAttrs, controller) {
        
      }
    };
}])
.directive('messbox', function() {
  return {
      restrict: 'E',
      replace: true,
      scope:{
        iclass:"@",
        message:"@"
      },
      transclude: true,
      template:'<div class="ipos_messsage {{iclass}}">' + 
        '<div ng-click="closeBox()" style="float:right"><i class="fa fa-times"></i></div>'+
        '<div> {{message}} '+
       '</div></div>',
      link: function($scope, elem, attrs,scope) {
        var thisElement = angular.element(elem[0]);
        $scope.closeBox=function(){
          thisElement.addClass('hide');
        };
     }
    };
})

/*nle32: This Directive for reorder cards when add new card*/
.directive('cardReorder', [ "$timeout", "commonService", "$compile" , function($timeout, commonService, $compile){
    return {
      
        scope: {
          currentLevel: "=",
          viewObjectLenght: "=",
          viewObject: "="
        },
        link: function(scope, element, attributes){
         scope.$watch("viewObjectLenght", function(newValue, oldValue) {
          if(!angular.equals(newValue, oldValue) && scope.viewObjectLenght){
                  $timeout( scope.reOrderCard, 0);
          }          
        });
         scope.reOrderCard = function(){
          var detailContainer = $("#level-" + scope.currentLevel + "-content");
          detailContainer.removeClass("animated zoomIn");
          if(detailContainer[0]){
         
          var parentElement = detailContainer[0].parentElement;
          var currOffsetTop =  detailContainer[0].children[0].offsetTop;
          var siblingEles = parentElement.children;
          detailContainer.insertAfter("#level-" + (scope.currentLevel -1) + "-card-" + (scope.viewObjectLenght - 1) );
          var appendEle = undefined;//where the new layout will be append
            currOffsetTop = currOffsetTop - siblingEles[0].firstChild.offsetHeight;
          var siblingLen = siblingEles.length;
  
           var i = 0;
          for (; i < siblingLen; i++) {
            if(!commonService.hasValueNotEmpty(siblingEles[i].children)) continue;
            if (siblingEles[i].children[0].offsetTop > currOffsetTop) {
              break;
            }
            appendEle = siblingEles[i];
          };
  
        angular.element(appendEle).after(detailContainer);
          }
       }
        }
    };
}])

.directive('v3SwitchNewSlide', ['$parse', '$timeout', '$translate', '$filter', function($parse, $timeout, $translate, $filter) {
  return {
        restrict: 'E',
        scope: {
            switchModel: '=',
            switchDisabled: '=',
            switchOptions: '=',
            alwayWatch: '@',
            prefix:'@',
            moreAction: '&'//the function(from controller) you want to call in directive
        },
        templateUrl: angular.contextPathTheme+'/views/template/v3_switch_more.html',
        link: function(scope, element, attrs) {
            // html template
            // <v3-switch switch-disabled="::!moduleService.isEditMode" switch-model="variables.Gender.Value" switch-default-value="" switch-options="{{::moduleService.listGenders}}">
            // <v3-switch>
        	scope.LiferayFake = Liferay.Fake;
          
           var stopWatchingOption = scope.$watch(
                     "switchOptions",
                     function handleFooChange( newValue, oldValue ) {
                    	 if(newValue != undefined &&  newValue[0] != undefined){
                    		 scope.renderSwitch();
                    		 stopWatchingOption();
                    	 }
                      
                     }
            );
           
           scope.$on("changeLanguage", function handleChangeLanguageEvent(event) {
          	 	scope.renderSwitch();
           })
           
          scope.renderSwitch = function(){
        	  scope.firstTimeRender = true;
	          //translate list
	          translateItems();
	          function translateItems(){
		        //check if list is array or not
		        if(!angular.isArray(scope.switchOptions)){
		          var item=scope.switchOptions;
		          scope.switchOptions=[];
		          scope.switchOptions.push(item);
		        }
		        //add file translate to list
		        if(scope.switchOptions[0]){
		          for (var int = 0; int < scope.switchOptions.length; int++) {
		            scope.switchOptions[int].translate=$translate.instant(scope.prefix+'.'+scope.switchOptions[int].value.toString());
		          }
		        }
		      }
          
            // var switchSize = attrs.switchSize;
            // scope.switchItems = scope.switchOptions;
	        if (!scope.switchName) {
	            scope.switchName = (0|Math.random()*9e6).toString(36);
	        }
            scope.$watch('switchModel', function() { 
              
                  if(scope.switchOptions != undefined){   // dnguyen98: check value of switchModel for init highlightSelected
                scope.switchItemsLength = scope.switchOptions.length;
                scope.highlightSelected();
              }
              //call function
              if(scope.moreAction && !scope.firstTimeRender){
                scope.moreAction({});
              }
              //clear selected value
              //remove all selected class in switch
                if( scope.switchModel === "" && scope.selectedClass){
                scope.clearSelect();
                scope.switchModelButton = "";
              }
                
            }); 
            
            //clear selected value and remove all selected class
            scope.clearSelect = function clearSelect (){
              scope.prevSelectedItem.removeClass(scope.selectedClass);
              scope.prevSelectedItem.removeClass(scope.switchBorder);
              scope.prevSelectedItem.removeClass(scope.lastItem);
              scope.prevSelectedItem.addClass(scope.itemsSeparator);
               
              $( "#v3-switch-slider-" + scope.switchName ).width(0);
            }
            
           

            //class for selected and unselected 
            scope.selectedClass = undefined;
            scope.switchBorder = undefined;
            scope.separator = undefined;
            scope.alwaysWatch = scope.$eval(scope.alwayWatch);
            scope.sliderWidth = undefined;

            scope.toggleClass = function toggleClass () {
                //defind class for disabled/ enabled
                if(scope.switchDisabled == true){
                    scope.selectedClass = 'v3-switch-item-selected-disabled';
                    scope.switchBorder = 'v3-switch-new-disabled';
                    scope.itemsSeparator = 'v3-switch-item-sep-disabled';
                    scope.lastItem = 'v3-switch-last-disabled';
                }
                else{
                    scope.selectedClass = 'v3-switch-item-selected-new';
                    scope.switchBorder = 'v3-switch-new';
                    scope.itemsSeparator = 'v3-switch-slider-item-sep';
                    scope.lastItem = 'v3-switch-last';
                }
            }

            //watch switchDisabled to update when toggle enabled/disabled 
            var stopWatching = scope.$watch('switchDisabled', function() {  
              $( "#v3-switch-slider-" + scope.switchName ).width("0");
                //remove all class 
                if(scope.prevSelectedItem){
                    scope.prevSelectedItem.removeClass(scope.selectedClass);
                }
                if(scope.switchContainer){
                    scope.switchContainer.removeClass(scope.switchBorder);
                }
                var i = 0;
                for(i; i < scope.switchItemsLength; i++){
                    scope.prevSelectedItem = element.find('#switch-' + scope.switchName + '-' + i);
                    scope.prevSelectedItem.removeClass(scope.itemsSeparator);

                    if(i == scope.switchItemsLength-1){
                        scope.prevSelectedItem.removeClass(scope.lastItem);
                    }
                }
                //toggle class 
                scope.toggleClass();

                scope.highlightSelected();
                if(scope.alwaysWatch == false)
                    stopWatching();
            });

          //find the length of longest item to define the width for all items
            scope.findLongestItem = function findLongestItem () {
                scope.lgth = 0;
                for (var j = scope.switchItemsLength - 1; j >= 0; j--) {
                    if(scope.switchOptions[j].translate.length > scope.lgth){
                         scope.lgth = scope.switchOptions[j].translate.length;
                    }    
                }
                
                if(scope.LiferayFake == undefined && scope.lgth > 15){
                	scope.lgth = 15;
                }
            }
            
            scope.highlightSelected = function highlightSelected () {
                //add border
                scope.switchContainer = element.find('#switch-' + scope.switchName);
                scope.switchContainer.addClass(scope.switchBorder);
                
                //find the longest length
                if(!scope.lgth || scope.LiferayFake === true){
                    scope.findLongestItem();
                }

                //add item separators
                var i = 0;
                for(i; i < scope.switchItemsLength; i++){
                    scope.Item = element.find('#switch-' + scope.switchName + '-' + i);

                    // var obj= document.createElement('select');
                    // scope.Item.style.width= '100px' ;
                    scope.Item.css('width', scope.lgth*10 + 'px');
                    if(scope.switchOptions[i].value == scope.switchModel){
                      if(scope.prevSelectedItem){
                            scope.prevSelectedItem.removeClass(scope.selectedClass);
                        }
                        scope.prevSelectedItem = scope.Item;
                        //add selected class for selected item
                        scope.prevSelectedItem.addClass(scope.selectedClass);
                    }
                    //add item separators
                    if(i < scope.switchItemsLength-1){
                        scope.Item.addClass(scope.itemsSeparator);
                    }
                    else{
                        //last item dont have separator
                        scope.Item.addClass(scope.lastItem);
                    }
                    //change switch item base on longest item
                    //changeCSS('.v3-switch-item-new', 'width', scope.lgth*10 + 'px !important');
                }
            }

            //highlight selected item when render finished
            $timeout(scope.highlightSelected, 0);
           
            
          }
            scope.chooseSwitch = function toggleSwitch(index, selectedValue) {
            	scope.firstTimeRender = false;
            	if((scope.switchDisabled == false && scope.switchModel != selectedValue) || (scope.LiferayFake === true && (scope.switchDisabled == false && scope.switchModel != selectedValue))){

                  //set width for slider
                  if(!scope.sliderWidth || scope.LiferayFake === true){
                	  scope.sliderWidth = element.find('#switch-' + scope.switchName + '-' + index).width();
                	  $( "#v3-switch-slider-" + scope.switchName ).width( scope.sliderWidth);
                  }
                    	 
                   //move slider to selected option
                   $( "#v3-switch-slider-" + scope.switchName ).animate({ left: element.find('#switch-' + scope.switchName + '-' + index)[0].offsetLeft });
                    
                    if(scope.prevSelectedItem){
                        scope.prevSelectedItem.removeClass(scope.selectedClass);
                    }
                    //set selected item
                    scope.prevSelectedItem = element.find('#switch-' + scope.switchName + '-' + index);
                    scope.prevSelectedItem.addClass(scope.selectedClass);
                    //bind value to model
                    scope.switchModel = selectedValue;
                    /*if(scope.moreAction){
                    	scope.moreAction({});
                    }*/
                }
            }
        }
    };
}])
.directive('v3SwitchNew', ['$parse', '$timeout', '$translate', '$filter', '$window', '$document', 
    function($parse, $timeout, $translate, $filter, $window, $document) {
  return {
        restrict: 'E',
        scope: {
            switchModel: '=',
            switchDisabled: '=',
            switchOptions: '=',
            alwayWatch: '@',
            prefix:'@',
            switchPosition: "@switchPosition",
            moreAction: '&'//the function(from controller) you want to call in directive
        },
        templateUrl: angular.contextPathTheme+'/views/template/v3_switch_button.html',
        link: function(scope, element, attrs) {
            // HTML EXAMPLE TEMPLATE
      //<v3-switch-button more-action="testing()" switch-position="left" prefix="v3.application.motor.race"
      //  switch-model="abc"
      //  switch-default-value="" switch-disabled="viewMode || moduleProspectPersonalService.findElementInDetail_V3(['Gender'])['@editable'] == '0'"
      //  switch-options="race">
      //</v3-switch-button>
          
          //ATTRIBUTES
      //moreAction: call function fron controller
      //switchPosition: defind switch slide from the left or right 
      //alwayWatch: alway watch the disable vaiable to change toggle class for switch
      //prefix: to translate 
      //switchOptions: array of item to display
      //switchModel: = ng-model
      //switchDisabled: = ng-disabled
          
          
       /*   if(!scope.switchDisabled)
            scope.switchDisabled = false;
          */
          
          /*scope.switchOptions = scope.$eval(scope.switchOptions);*/
        	
        	scope.LiferayFake = Liferay.Fake;
          
         var stopWatchingOption = scope.$watch(
                 "switchOptions",
                 function handleFooChange( newValue, oldValue ) {
                  if(newValue[0] != undefined){
                    scope.renderSwitch();
                      stopWatchingOption();
                  }
                  
                 }
        );
        
         scope.$on("changeLanguage", function handleChangeLanguageEvent(event) {
        	 scope.renderSwitch();
         })
         
        scope.renderSwitch = function(){
          //translate list
          translateItems();
          function translateItems(){
	          //check if list is array or not
	          if(!angular.isArray(scope.switchOptions)){
	            var item=scope.switchOptions;
	            scope.switchOptions=[];
	            scope.switchOptions.push(item);
	          }
	          //add file translate to list
	          if(scope.switchOptions[0]){
	            for (var int = 0; int < scope.switchOptions.length; int++) {
	              scope.switchOptions[int].translate=$translate.instant(scope.prefix+'.'+scope.switchOptions[int].value);
	            }
	          }
	          
	          /*this.findElementInElement_V3(lazyList,[lazyChoiceField])['Option']=fieldNode;*/
            }
          
          if (!scope.switchName) {
        	  scope.switchName = (0|Math.random()*9e6).toString(36);
          }
          
            scope.$watch('switchModel', function() { 
              
              if(scope.switchOptions != undefined){   // dnguyen98: check value of switchModel for init highlightSelected
                scope.switchItemsLength = scope.switchOptions.length;
             
                scope.highlightSelected();
              }
              //call function
              if(scope.moreAction){
                scope.moreAction({});
              }
              
              if( scope.switchModel === "" && scope.selectedClass){
                scope.clearSelect();
              }
              
            }); 
            
            scope.clearSelect = function clearSelect (){
              scope.prevSelectedItem.removeClass(scope.selectedClass);
              scope.prevSelectedItem.removeClass(scope.switchBorder);
              scope.prevSelectedItem.removeClass(scope.lastItem);
              scope.prevSelectedItem.addClass(scope.itemsSeparator);
              $( "#v3-switch-slider-" + scope.switchName ).width(0);
            }

            
            scope.showSwitch = false;
            //class for selected and unselected 
            scope.selectedClass = undefined;
            scope.switchBorder = undefined;
            scope.separator = undefined;
            scope.prevSelected = undefined;
            scope.showMasked = false;
            scope.buttonCaretIconClass = undefined;
            scope.alwaysWatch = scope.$eval(scope.alwayWatch);
            

            scope.toggleClass = function toggleClass () {
                //defind class for disabled/ enabled
                if(scope.switchDisabled == true){
                    scope.selectedClass = 'v3-switch-item-selected-disabled';
                    scope.switchBorder = 'v3-switch-new-disabled';
                    scope.itemsSeparator = 'v3-switch-item-sep-disabled';
                    scope.lastItem = 'v3-switch-last-disabled';
                    scope.buttonCaretIconClass = 'v3-switch-button-disable';
                    angular.element(element).find('input').css({"cursor":"not-allowed"});
                    angular.element(element).find('i').css({"color": "#999", "cursor":"not-allowed"});
                }
                else{
                    scope.selectedClass = 'v3-switch-item-selected-new';
                    scope.switchBorder = 'v3-switch-new';
                    scope.itemsSeparator = 'v3-switch-item-sep';
                    scope.lastItem = 'v3-switch-last';
                    scope.buttonCaretIconClass = "";
                }
            }

            //watch switchDisabled to update when toggle enabled/disabled 
            var stopWatching = scope.$watch('switchDisabled', function() {  

                //remove all class 
                if(scope.prevSelectedItem){
                    scope.prevSelectedItem.removeClass(scope.selectedClass);
                }
                if(scope.switchContainer){
                    scope.switchContainer.removeClass(scope.switchBorder);
                }
                var i = 0;
                for(i; i < scope.switchItemsLength; i++){
                    scope.prevSelectedItem = element.find('#switch-' + scope.switchName + '-' + i);
                    scope.prevSelectedItem.removeClass(scope.itemsSeparator);

                    if(i == scope.switchItemsLength-1){
                        scope.prevSelectedItem.removeClass(scope.lastItem);
                    }
                }
                //toggle class 
                scope.toggleClass();
                scope.highlightSelected();
                if(scope.alwaysWatch == false)
                    stopWatching();
            });

            //find the length of longest item to define the width for all items
            scope.findLongestItem = function findLongestItem () {
                scope.lgth = 0;
                for (var j = scope.switchItemsLength - 1; j >= 0; j--) {
                    if(scope.switchOptions[j].translate.length > scope.lgth){
                      if(scope.switchOptions[j].translate.length > 15){
                        scope.lgth = 15;
                      }else{
                         scope.lgth = scope.switchOptions[j].translate.length + 3;
                      }
                       
                    }    
                };
            }

            scope.highlightSelected = function highlightSelected () {
              scope.switchButton = element.find("#switch-button-" + scope.switchName);
              scope.switchButtonIcon = element.find("#switch-button-icon-" + scope.switchName);
              scope.switchButtonInput = element.find("#switch-button-input-" + scope.switchName);
              //find the side to expand switch (left/right)
              if(scope.switchOptions.length > 3 ){
                 var switchPosLeft = scope.switchButton.offset().left;
                   var switchPosRight =$window.innerWidth -  scope.switchButton.offset().left;
                   if(switchPosLeft >  switchPosRight){
                     scope.switchPosition = "right";
                   }else{
                     scope.switchPosition = "left";
                   }
              }
              else{
                scope.switchPosition = "left";
              }
              
             
             
              //add class for switch container
     
               scope.switchButtonConatiner = element.find("#switch-button-containner-" + scope.switchName);
               scope.switchButtonIcon.addClass(scope.buttonCaretIconClass);
               scope.switchButtonInput.addClass(scope.buttonCaretIconClass);
               
            /*   var offsets = $("#hello").offset();
               var top = offsets.top;
               var left = offsets.left;*/
              
               
               scope.switchButtonConatiner.addClass('v3-switch-container-' + scope.switchPosition);

              
               //add border
                scope.switchContainer = element.find('#switch-' + scope.switchName);
                scope.switchContainer.addClass(scope.switchBorder);
                    
                scope.switchButtonConatiner = element.find("#switch-button-containner-" + scope.switchName);
                  /*scope.ele = element.find("#switch-" + scope.switchName);*/
                  
                  
                  scope.switchButtonConatiner.addClass('v3-switch-container-' + scope.switchPosition);
                  scope.switchButton.addClass('v3-switch-button-' + scope.switchPosition);
                  scope.switchContainer.addClass('v3-switch-animation-' + scope.switchPosition);
              
              
                
                //find the longest length
                if(!scope.lgth || scope.LiferayFake === true){
                    scope.findLongestItem();
                }

                //add item separators
                var i = 0;
                for(i; i < scope.switchItemsLength; i++){
                    scope.Item = element.find('#switch-' + scope.switchName + '-' + i);

                    // var obj= document.createElement('select');
                    // scope.Item.style.width= '100px' ;
                    scope.Item.css('width', scope.lgth*10 + 'px');
                    if(scope.switchOptions[i].value == scope.switchModel){
                      if(scope.prevSelectedItem){
                            scope.prevSelectedItem.removeClass(scope.selectedClass);
                        }
                        scope.prevSelectedItem = scope.Item;
                        //add selected class for selected item
                      //need test
                        scope.prevSelectedItem.addClass(scope.selectedClass);
                      
                        //set Value for input switch
                        scope.switchModelButton = scope.switchOptions[i].translate;
                        scope.prevSelected = scope.switchModel;
                    }
                    //add item separators
                    if(i < scope.switchItemsLength-1){
                        scope.Item.addClass(scope.itemsSeparator);
                    }
                    else{
                        //last item dont have separator
                        scope.Item.addClass(scope.lastItem);
                    }
                    //change switch item base on longest item
                    //changeCSS('.v3-switch-item-new', 'width', scope.lgth*10 + 'px !important');
                }
            }

            //highlight selected item when render finished
            $timeout(scope.highlightSelected, 0);
        }
            //change switch value
            scope.chooseSwitch = function chooseSwitch(index, selectedValue) {
               if(scope.switchDisabled == false){
                 scope.showMasked = false;
                 //hide switch bar
                 //scope.prevSelectedItem = scope.switchModel; 
                 
                 scope.switchContainer.removeClass('v3-switch-animation-' + scope.switchPosition + '-active');

                 scope.switchButton.addClass('v3-switch-button-ontop');
                    if(scope.prevSelectedItem){
                        scope.prevSelectedItem.removeClass(scope.selectedClass);
                    }
                    //set selected item
                    scope.prevSelectedItem = element.find('#switch-' + scope.switchName + '-' + index);
                    scope.prevSelectedItem.addClass(scope.selectedClass);
                    
                    //bind value to model
                    scope.switchModel = selectedValue;
                    
                    //scope.$apply();
                    
                    scope.switchModelButton = $translate.instant(scope.prefix+'.'+selectedValue);//set value for switch input field
                    
                   
                    //scope.$apply();
                    //scope.moreAction({});
 
                    
                    // fix temporarily by Nghia Le
              /*      if(scope.moreAction){//check if the action is available
                      if(scope.prevSelected != selectedValue){//if model is changed teh call function
                        scope.moreAction({});
                      }
                      scope.prevSelected = selectedValue; 
                      scope.moreAction({});
                    }*/
                   
                }
            }
            //show switch bar
            scope.open = function () {
              if(scope.switchDisabled == false){
                scope.showMasked = true;
                scope.switchButton.removeClass('v3-switch-button-ontop');
                scope.switchContainer.toggleClass('v3-switch-animation-' + scope.switchPosition + '-active');
                }
            }
            scope.close = function () {
              if(scope.switchDisabled == false){
                scope.showMasked = false;
                scope.switchButton.addClass('v3-switch-button-ontop');
                scope.switchContainer.removeClass('v3-switch-animation-' + scope.switchPosition + '-active');
                }
            }
        }
    };
}])
.directive('pls', ['$document', '$timeout', function ($document, $timeout) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                items: '=',
                id: '@',
                hoverTimeout: '@',
                openMode: '@',
                gridColumns: '@',
                showFlag: '@',
                selectedLang: '@'
            },
            controller: ['$scope', function ($scope) {
                var selectedLang = $scope.selectedLang;
                var columns = Math.round($scope.items.length / parseInt($scope.gridColumns));
                var hoverTimeout = $scope.hoverTimeout;
                if (!hoverTimeout) {
                    hoverTimeout = 200;
                }

                var hoverTimeoutPromise = null;
                var documentClickHandler = function () {
                    closePopup();
                    $scope.$apply();
                };
                var documentKeyHandler = function (evt) {
                    if (evt.keyCode === 27) {
                        closePopup();
                        $scope.$apply();
                    }
                };

                var prepareModel = function () {
                    $scope.model = {
                        opened: false,
                        selectedLang: null,
                        showFlag: ($scope.showFlag === 'true'),
                        columns: []
                    };

                    var column = [];
                    var i = 1;
                    angular.forEach($scope.items, function (item) {
                        item.selected = false;
                        if (!$scope.model.selectedLang && item.id === selectedLang) {
                            item.selected = true;
                            $scope.model.selectedLang = item;
                        }
                        column.push(item);
                        if (i % columns === 0) {
                            $scope.model.columns.push(column);
                            column = [];
                        }
                        i++;
                    });
                    if (column.length > 0) {
                        $scope.model.columns.push(column);
                        column = null;
                    }
                    if (!$scope.model.selectedLang) {
                        $scope.model.selectedLang = $scope.items[0];
                        $scope.items[0].selected = true;
                    }
                };

                var openPopup = function () {
                    if (!$scope.model.opened) {
                        $scope.$emit('pls.popupOpening', {id: $scope.id});
                        $scope.model.opened = true;
                        $document.on('click', documentClickHandler);
                        $document.on('keydown', documentKeyHandler);
                        $scope.$emit('pls.popupOpened', {id: $scope.id});
                    }
                    return false;
                };

                var closePopup = function () {
                    if ($scope.model.opened) {
                        $scope.$emit('pls.popupClosing', {id: $scope.id});
                        $document.off('click', documentClickHandler);
                        $document.off('keydown', documentKeyHandler);
                        $scope.model.opened = false;
                        $scope.$emit('pls.popupClosed', {id: $scope.id});
                    }
                    return false;
                };

                $scope.onMouseEnterOrLeave = function (mouseEnter) {
                    if (mouseEnter) {
                        if (hoverTimeoutPromise) {
                            $timeout.cancel(hoverTimeoutPromise);
                            hoverTimeoutPromise = null;
                        }
                        openPopup();
                    } else {
                        if (!hoverTimeoutPromise) {
                            hoverTimeoutPromise = $timeout(function () {
                                closePopup();
                            }, hoverTimeout);
                        }
                    }
                    return false;
                };

                $scope.onClick = function (evt) {
                    evt.stopPropagation();
                    if (!$scope.model.opened) {
                        openPopup();
                    } else {
                        closePopup();
                    }
                    return false;
                };

                $scope.onLanguageChanged = function (evt, selectedLang) {
                    evt.stopPropagation();
                    closePopup();
                    angular.forEach($scope.items, function (item) {
                        item.selected = false;
                    });
                    selectedLang.selected = true;
                    $scope.model.selectedLang = selectedLang;
                    $scope.$emit('pls.onLanguageChanged', {
                        id: $scope.id,
                        lang: angular.copy(selectedLang)
                    });
                    return false;
                };

                prepareModel();
            }],
            template: function (context, $scope) {
                var template = '<div class="polyglot-language-switcher ng-polyglot-language-switcher">';
                if ($scope.openMode === 'hover') {
                    template += '<a class="pls-selected-locale" href="#" data-ng-mouseenter="onMouseEnterOrLeave(true)" data-ng-mouseleave="onMouseEnterOrLeave(false)"><img data-ng-if="model.showFlag" data-ng-src="{{model.selectedLang.flagImg}}" alt="{{model.selectedLang.flagTitle}}"> {{model.selectedLang.name}}</a>' +
                    '<div class="pls-language-container-scrollable" data-ng-show="model.opened" data-ng-mouseenter="onMouseEnterOrLeave(true)" data-ng-mouseleave="onMouseEnterOrLeave(false)">';
                } else if ($scope.openMode === 'click') {
                    template += '<div layout="row" class="pls-selected-locale" href="#" data-ng-click="onClick($event)">'
                      +'<div class="flag-dropdown f15" layout="column" layout-align="center center" flex="15" style="margin-right:10px;">'
            + '<div class="selected-flag">'
            +   '<div style="width: 16px !important" class="{{model.selectedLang.flagImg}}">'
            +     '<span ng-click="setValue(item.value)" class="ipos_flag"></span>'
            +   '</div>'
            + '</div>'
            +'</div>'
                      +'<div>{{model.selectedLang.name}}</div>' 
                      +'</div>'+
                    '<div class="pls-language-container-scrollable" data-ng-show="model.opened">';
                }
                template += '<div class="pls-language-container" >'
                      + '<div data-ng-repeat="column in model.columns">'
                      +     '<div data-ng-repeat="item in column" data-ng-click="onLanguageChanged($event, item)" layout="column" class="select_hover" layout-align="center center">'
                      +       '<div layout="row" data-ng-class="item.selected? \'pls-selected-locale\':\'\'">'
                            +         '<div layout-margin class="flag-dropdown f15" layout="column" layout-align="center center" flex="15">'
                            +             '<div class="selected-flag">'
                            +                 '<div style="width: 16px !important" class="{{item.flagImg}}">'
                            +                     '<span ng-click="setValue(item.value)" class="ipos_flag"></span>'
                            +                 '</div>'
                            +             '</div>'
                            +         '</div>'
                            +         '<div flex="85"><a>{{item.name}}</a><div>' 
                            +       '</div>'
                            +     '</div>'
                            + '</div>'
                            +'</div>' 
                            +'</div>';
                return template;
            }
        };
}])

.directive("contenteditable", function() {
  return {
    require: "ngModel",
    link: function(scope, element, attrs, ngModel) {

      function read() {
        ngModel.$setViewValue(element.html());
      }

      ngModel.$render = function() {
        element.html(ngModel.$viewValue || "");
      };

      element.bind(function() {
        scope.$apply(read);
      });
    }
  };
})

.directive("ngNewdropdown", ['$compile', '$http','$translate','$filter' , '$parse','$timeout','commonService', '$log', function($compile, $http,$translate,$filter, $parse, $timeout, commonService, $log){
  var templateLoader, templateText;
  return{
    restrict: "E",
/*    scope: true,*/
    scope: {
        model:"=",
        /*value:"=value",*/
      /*  level: '=level',(displayValue | trimtext:false:15:'...')*/
        filename: '=filename',
        disable:'=disable',
          listItems:"=?list",
          type:"@type",
          prefix:"@prefix",
          key:"@key",
          sort:"@sort",
          moreAction: '&'//the function(from controller) you want to call in directive
        },
    /*template:"<div  style='border: 2px solid #d9d7d5;line-height: 40px;padding-left: 20px;font-size:18px;' class='md-select-Style md-select md-select-label'>" +
        "{{!isRegular?(prefix+'.'+model.Value|translate| trimtext:false:25:'..'):model[key]}}"+     
        "<span class='md-select-icon' aria-hidden='true'></span></div>",*/
      templateUrl:angular.contextPathTheme+'/views/template/commonDropdown.html',  
    link: function(scope, element, attrs){
      scope.LiferayFake = Liferay.Fake;
      scope.items = scope.listItems==undefined ? []:scope.listItems;
      scope.type=attrs.type;
      scope.prefix=attrs.prefix;
      scope.isRegular=scope.type=='regular';
      scope.moduleService=scope.$parent.moduleService;
      scope.showAppend = false;
      scope.isOpen = false;
      /*scope.$parent.moduleService=scope.moduleService;*/
      if (scope.type=='full-flag' || scope.type=='nonFlag' || scope.type=='table') {

        scope.value=scope.model ? scope.model.Value : undefined;
        translateAndOrderItems();
        
      }
      else{
        /*if (scope.model.FullName) {
          
        }
        scope.value=scope.model.FullName;*/
      }  
      
      scope.$on("changeLanguage", function handleChangeLanguageEvent(event) {
    	  translateAndOrderItems();
      })
      
    //prevent double click whithin 1s, this bug appear in samsung tablet, when user click 1 device detect as double clicks
      scope.isContinue = true;
      function doFreeze (){
    	  if(scope.isContinue == true){
    		  scope.isContinue = false;
    		  $timeout(function() {
            	  scope.isContinue = true; 
              }, 1000);
    	  }
      }
      
      element.bind('click',function($event){
		 if(scope.isContinue == true){
			 doFreeze();
			 scope.items = scope.listItems;
 	        translateAndOrderItems(); 
 	        if (scope.disable!==true) {
 	          templateLoader.then(function (){
 	            scope.showDropdown($event);
 	          });
 	        }
		 }
    	
      });
      
      scope.$watch('disable', function() {  
                scope.setCSS();
            });
			
			scope.setCSS = function (){
				if (scope.disable){
					angular.element(element).children().css({"background-color": "#eeeeee","cursor":"not-allowed"});
					angular.element(element).children().find('i').css({"color": "#999"});
				}
				else{
					angular.element(element).children().css({"background-color": "white","cursor":"pointer"});
					angular.element(element).children().find('i').css({"color": "#4CAF50"});
				}
			}
			scope.setCSS();
			
			scope.setValue = function (item){
				if (scope.type=='regular' ||scope.type=='irregular') {
					scope.model=item;
				}
				else{
					scope.displayValue = $translate.instant(attrs.prefix+'.'+item);
					scope.model.Value=item;
					scope.value=item;
				}
				
				$('#append-items').remove();
				scope.showAppend = false;
				scope.isOpen = false;
				//call function from controller
				if(scope.moreAction){
                  	 scope.moreAction({});
                }
      };
    
      templateLoader = $http.get(contextPathRoot+'/view/myNewWorkspace/template/newLongDropdown.html')
          .success(function(html) {
            templateText = html;
          }).error(function(){
            $log.error("File not found!");
          });
      //translate list before displaying in the view
      function translateAndOrderItems(){
        //check if list is array or not
        if(!angular.isArray(scope.items)){
          var item=scope.items;
          scope.items=[];
          scope.items.push(item);
        }
        //add file translate to list
        for (var int = 0; int < scope.items.length; int++) {
        	if (attrs.prefix  && scope.items[int].value){
        		  if (scope.items[int].value != "N.A.") {
        	            scope.items[int].translate=$translate.instant(attrs.prefix+'.'+scope.items[int].value);
    	          } else {
    	            scope.items[int].translate = "Not Available";
    	          }
        	}
        }
        //sort items in list
        if(scope.sort != "false"){
          scope.items = $filter('orderBy')(scope.items,'translate');
        }
        
        /*this.findElementInElement_V3(lazyList,[lazyChoiceField])['Option']=fieldNode;*/
      }
      scope.showDropdown = function($event){
        
        scope.showAppend = true;
        scope.isOpen = true;
        
        //get current level of clicked DOM
        var levels=['level-1','level-2','level-3','level-4','level-5'];
        var currentLevel= 'level-2';
        var currentBackgroundColor = getComputedStyle($event.currentTarget).getPropertyValue("background-color");
        var curentLevelIndex=levels.indexOf(currentLevel);
        var childLevel=levels[curentLevelIndex+1];
        var isChildOpened=false;
        isChildOpened=document.getElementsByClassName(childLevel).length>0 ? true:false;
        var arrowPositionX = $event.currentTarget.offsetLeft+($event.currentTarget.offsetWidth/2.4);
        var arrowPositionY = $event.currentTarget.offsetTop + $event.currentTarget.offsetHeight + 11;

        if (!isChildOpened) {
        	 var itemTarget = $event.currentTarget;
             var tempTarget = $event.currentTarget;
             var targetId = angular.element($event.currentTarget).scope().$id;
             while (angular.element(tempTarget.parentElement).scope().$id == targetId) {
          	   tempTarget = tempTarget.parentElement;
          	   if (angular.element(tempTarget).hasClass("v3-column-content")) {
          		   itemTarget = tempTarget;
          	   }
             }
             var currentOffsetTop = itemTarget.offsetTop;
             var globalOffsetTop = $(itemTarget).offset().top;
               var temp=[];
               var check=true;
               var objectOfSameLevel=document.getElementsByClassName("v3-column-content");
               var objectLength=objectOfSameLevel.length;
               for (var i = 0; i < objectLength; i++) {
                 if (objectOfSameLevel[i].offsetTop == currentOffsetTop) {
              	   if ($(objectOfSameLevel[i]).offset().top == globalOffsetTop)
              	   temp.push(objectOfSameLevel[i]);
                  }         
               }
               scope.child=childLevel;
               scope.child2=childLevel;
             if (scope.items.length<20) {
            	 scope.isLong=false;
             }
             else{
            	 scope.isLong=true;
             }
             var styleForTypeTable = "";
             if(scope.type=="table" && $event.currentTarget.parentElement.parentElement.tagName=="TR"){
            	 var maxWidth = $event.currentTarget.parentElement.parentElement.offsetWidth;
            	 styleForTypeTable = "z-index: 100;position: absolute;max-width: " + maxWidth + "px;"
             }
             var appendObject="<div style='" + styleForTypeTable + "margin-bottom:20px;padding-left:0px;padding-right:0px' id='append-items' class='col-xs-12 col-sm-12 col-md-12 col-lg-12 level-2-wrapper animated fadeIn'>" +
                        "<div style='padding-bottom:10px' class='box-detail wrapper-detail md-whiteframe-z3 " + scope.child +
                        "'> <div id='common-dropdown' class='container-fluid' style='overflow-y: auto; overflow-x: hidden; max-height: 300px;padding-left:0px'>"+templateText+"</div></div>" +                          
                        "</div>";
           
             var compile=$compile(appendObject)(scope); 
             if(scope.type=="table" && $event.currentTarget.parentElement.parentElement.tagName=="TR"){            	 
            	 angular.element($event.currentTarget.parentElement.parentElement).after(compile);
             }else{
            	 angular.element(temp[temp.length-1]).after(compile);
             }
//             $('#new-dropdown-search-box').focus();
           /*  $('#'+scope.ngModel).css('background-color','#66C796');
             $('#'+scope.ngModel).css('color','#FFFFFF');
             $('#arrow').css('left',arrowPositionX+'px');
             $('#arrow').css('top',arrowPositionY+'px');
             $('#arrow').css('box-shadow',currentBackgroundColor + ' 1px -1px 3px -1px');*/
            
         
             setTimeout(function(){
              var value=undefined;
            if (scope.type=='regular') {
              if (scope.model!==undefined) {
                value=scope.model[scope.key];
              }           
            }
            else if (scope.type=='irregular') {
              if (scope.model!==undefined) {
                value=scope.moduleService.findElementInElement_V3(scope.model,[scope.key]).$;
              }           
            }
            else{
              value=$translate.instant(scope.prefix+'.'+scope.model.Value);
            }
            
            $log.debug(value);
            $('.flag-box > span').each(function(){
              if(value==$(this).text()){
                $(this).parent().parent().css({'background-color':'#43A047','color':'white'});
              }
            });
            
            $('.nonFlag > div> span').each(function(){
              if(value==$(this).text()){
                $(this).parent().parent().css({'background-color':'#43A047','color':'white'});
              }
            });
           }, 3000);
             
        }
        else{
          scope.isContinue = true; 
          $('#append-items').remove();
        }
      //append child div to the next row of clicked DOM
            
      };
      
      // Dropdown dow will close if click outside  
      window.onclick = function(event) {
        // if click to search box => not close
		  if(!event.target.attributes.id){
			  return;
		  }
		  
        if(event.target.attributes.id.textContent == "new-dropdown-search-box"){
          return;
        } else {
          // if click outside 
            var scope = angular.element(document.getElementById('append-items')).scope();
          if(scope != undefined && scope.showAppend == true && scope.isOpen == true){
            scope.showAppend = false;
            return;
          } else  if(scope != undefined){
            $('#append-items').remove();
            scope.isOpen = false;
            return;
          }
        }
           
        };
        
    }
  };
}])
//base on ng-repeat, support render only
//var ngRepeatDirective =
.directive("lightRepeat", ['$compile', '$log', '$parse', function($compile, $log, $parse) {
    return {
        restrict: "A",
        // scope: true,
        // multiElement: true,
        transclude: 'element',
        compile: function compileCardsRow($element, $attr) {
            // content = angular.copy($element.children());
            // var content = $element.children();
            // var parent = $element;
            var content = $element;
            var parent = $element.parent();
            var expression = $attr.lightRepeat;
            var match = expression.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);
  
            var objName = match[1];
            var collections = match[2];


            //http://liamkaufman.com/blog/2013/05/13/understanding-angularjs-directives-part1-ng-repeat-and-compile/
            return function cardsRowLink($scope, $element, $attr, ctrl, $transclude) {

              var watcher = $scope.$watch(collections, function(_new, _old){

                if(!_new){
                  return;
                }

                  for (var i = 0; i < _new.length; i++) {
                      // create a new scope for every element in the collection.
                      // var childScope = $scope.$new();

                      $transclude(function(clonedElement, scope) {
                        // pass the current element of the collection into that scope
                        scope[objName] = _new[i];
                            parent.append(clonedElement);
                        });

       //                $compile(content)(childScope, function(clonedElement, scope) {
            //    parent.append(clonedElement); // add to DOM
            // });
                  };

                //remove watcher
                watcher();
              });

                $log.debug('Called cardsRowLink()');
            }
        }
    };
}])
.directive("card", ['$log', '$compile', 'commonService', 'uiRenderPrototypeService', 'uiFrameworkService', '$timeout',
  function($log, $compile, commonService, uiRenderPrototypeService, uiFrameworkService, $timeout) {   

    /**
     * set card's visible to 'true' or 'false'
     * @param {Object}  jqEle       jquery element
     * @param {boolean}  isVisible  true or false
     */
    function setHtmlEleVisible(jqEle, isVisible) {
      isVisible ? jqEle.css("display", "initial") : jqEle.css("display", "none");
    }

    return {
        restrict: 'E',
        scope: false,
        templateUrl: contextPathRoot + '/view/myNewWorkspace/template/card.html',
        link: function(scope, element, attr) {

          var currCard, visibleWatcherFn;
          scope.setCardVisible = setHtmlEleVisible;

          function setupCard (scope, element, attr) {       

            currCard = scope.card;
            currCard.html = element;
            currCard.scope = scope;

            currCard.level = attr.level;

            currCard.cardStatus = "start";
            currCard.refreshCard = false;
            
            scope.cardElement  = element.find(".v3-live-card-info");

            //update css of selecting & leaf node
            scope.setSelectCss();
            scope.setCssLeafCard();


            var visible = scope.card.isVisible;
            //if isVisible is function, continuously watching it
            if (angular.isString(visible)){
              //if visibleWatcherFn is exist, clear the old watching
              if(visibleWatcherFn)
                visibleWatcherFn();

              visibleWatcherFn = scope.$watch(visible, function(_new) {
                setHtmlEleVisible(element, _new);
              });
            }
            else{
              setHtmlEleVisible(element, visible);
            }
          }
          
          //setup initalized values again
          element.on('$destroy', function() {
            //IVPORTAL-5168: START
            var currCard = scope.card;
            if(currCard){
               currCard.isSelected = false;
               currCard.html = undefined;
               currCard.scope = undefined;
            }
            //IVPORTAL-5168: END
          });
          
        //prevent double click whithin 1s, this bug appear in samsung tablet, when user click 1 device detect as double clicks
          scope.isContinue = true;
          function doFreeze (){
        	  if(scope.isContinue == true){
        		  scope.isContinue = false;
        		  $timeout(function() {
                	  scope.isContinue = true; 
                  }, 1000);
        	  }
          }
            
          element.bind('click', 
            function(event) {
        	  
        	  //fix double clicks on tablet samsung android
        	  if (scope.isContinue == false){
        		  return;
        	  }
        	  
        	  doFreeze();
              $log.debug("Click on card [level: " + currCard.level + ", index: " + scope.$index + "]");

              //User Guide: there are userguide list on Card and @click Button on it, it will return (Since it will do not call other function)
              if (event.target.nodeName == "BUTTON"){
                return;
              }

              if (!currCard.isCardOpenable())
                return;

              if(currCard.onOpen && !currCard.isSelected){
                  var isContinue = scope.$eval(currCard.onOpen);

                  switch(true){
                    case isContinue === undefined:
                       scope.isContinueOpenCard(event);
                      break;
                      //stop if return false
                      case isContinue === false:
                        return;

                      //promise case: need to wait before the onOpen functions finish
                      case isContinue.$$state !== undefined:
                          isContinue.then(function () {
                             scope.isContinueOpenCard(event);
                          });
                          break;
                      default:
                         scope.isContinueOpenCard(event);
                  }
              }
              //if doesn't have 'onOpen' attribute, continue
              else{

                  if(currCard.cardType === uiRenderPrototypeService.CONSTANTS.cardType.ACTION 
                    && currCard.onClick){
                      scope.$eval(currCard.onClick);

                      //this card has staticHtml need to render!
                      if(currCard.staticHtml)
                        scope.isContinueOpenCard(event);
                  }
                  else{
                    scope.isContinueOpenCard(event);
                  }
              }
          });           
          
          scope.isContinueOpenCard = function isContinueOpenCard (event) {     
            //set selected or not
            currCard.isSelected = !currCard.isSelected;
            scope.setSelectCss();
            
            //notify other siblings 
            var siblingCards = currCard.parent ? currCard.parent.children : [];
            for (var i = 0; i < siblingCards.length; i++) {
              if(siblingCards[i] !== currCard){                 
                siblingCards[i].isSelected = false;
                siblingCards[i].scope.setSelectCss();
                
                //close all summary preview cgange card type
                //only show card preview on touch on touch device 
                if(commonService.options.cardTouchMode){
                  if(commonService.options.cardPreview){
                     if(currCard.cardStatus == "start"){
                    siblingCards[i].cardStatus = "detail";
                    siblingCards[i].scope.openSummary();
                    siblingCards[i].cardStatus = "start";
                  }
                  if(currCard.cardStatus == "detail"){
                    siblingCards[i].cardStatus = "detail";
                    siblingCards[i].scope.openSummary();
                    siblingCards[i].cardStatus = "start";
                  }
                    if(currCard.cardStatus == "summary"){
                    siblingCards[i].cardStatus = "smallDetail";
                  }
                  
                  if(currCard.cardStatus == "smallDetail"){
      
                    if(siblingCards[i].cardStatus  != "detail"){
                      siblingCards[i].cardStatus = "detail";
                      siblingCards[i].scope.openSummary();
                      siblingCards[i].cardStatus = "smallDetail";
                    }
                  }
                  if(currCard.cardStatus == "smallSummary"){
                    siblingCards[i].cardStatus = "smallDetail";
                    
                  }
                  }else{
                    siblingCards[i].cardStatus = "detail";
                    currCard.cardStatus = "detail";
                  }
                }
              }   
            };
            if(commonService.options.cardTouchMode){
              if(commonService.options.cardPreview){
                if(currCard.cardStatus == "smallSummary" ){
                  currCard.cardStatus = "summary";
                  currCard.prevSmallSummary = "detail";
                }else{
                  currCard.prevSmallSummary = undefined ;
                }
                scope.openSummary ();
              }
            }
            
            //execute the declare function
            scope.$eval(attr.whenClick, {clickEvent: event});
            // if(isContinue == false){
            //  currCard.isSelected = !currCard.isSelected;
            //  scope.setSelectCss();
            // }
            if(currCard.prevSmallSummary && commonService.options.cardTouchMode)
              currCard.cardStatus = currCard.prevSmallSummary;
        }
      
  
          /**
           * return false when can't set the css (element children can't be found, not render yet)
           */
          scope.setSelectCss = function setSelectCss () {
            if(element.children().length < 1) 
              return false;//check element has value

            if(currCard.isSelected) {
              var mainCard = element.children().children();
              if(currCard.cardType != 'action') {
                var currBackgroundColor = mainCard.css("border-color");
                if(currBackgroundColor != "" && currBackgroundColor != "rgb(85, 85, 85)") {
                  var border = "border: 2px solid " + currBackgroundColor + " !important;"
                  var backgroundColor = "background-color: " + currBackgroundColor + " !important;";
                  var color = "color: white";
                  mainCard.attr('style', border + backgroundColor + color);
                }
              }
              
              // Set style class card info
              var cardInfo = mainCard.find(".v3-live-card-info");
              var colorInfo = mainCard.css("background-color");
              if(colorInfo !="" && colorInfo != "rgba(0, 0, 0, 0)" && colorInfo != "white") {
                var borderInfo = "solid 2px " + colorInfo;
                cardInfo.css("color", colorInfo);
                cardInfo.css("border", borderInfo);
              }
            }
            else {
              element.children().children().attr('style', '');
            }      
            return true;                  
          };

          /**
           * return false when can't set the css (element children can't be found, not render yet)
           */
          scope.setCssLeafCard = function setCssLeafCard () {
            if(element.children().length < 1)
              return false;
            
            var mainCard = element.children().children();

            if(scope.isLeafCard()) {
              // Remove small class
              if($(window).width() > 500){
                  scope.maxTrimTextTitle = "22";  
              } else {
                scope.maxTrimTextTitle = "20";
              }
              mainCard.removeClass( "v3-small-live-card-item" ).addClass("v3-live-card-item");
//              currCard.cardStatus = "summary";
            
            }
            else {
              // Set small card
              if($(window).width() > 500){
                scope.maxTrimTextTitle = "40";
              }
              mainCard.removeClass( "v3-live-card-item" ).addClass("v3-small-live-card-item");
              //currCard.cardStatus = "detail";
            }

            return true;
          };

          //change style of summary card base on card's status
          scope.openSummary = function openSummary () {
            if(!commonService.options.cardTouchMode){
              return;
            }
            switch(currCard.cardStatus){
              case "detail":
                element.find(".v3-live-card-info").removeClass("v3-live-card-item-hover").removeClass("v3-small-live-card-item-hover");
                //currCard.cardStatus = "detail";
                break;
              case "start"://open card review
                element.find(".v3-live-card-info").addClass("v3-live-card-item-hover");
                currCard.cardStatus = "summary";
                break;
              case "summary"://
                element.find(".v3-live-card-info").removeClass("v3-live-card-item-hover");
                element.find(".v3-live-card-info").removeClass("v3-small-live-card-item-hover");
                currCard.cardStatus = "detail";
                break;
      
              case "smallDetail":
                element.find(".v3-live-card-info").addClass("v3-small-live-card-item-hover");
                element.find(".v3-small-live-card-item").css("overflow", "visible");
                currCard.cardStatus = "smallSummary";
                break;

            }

          };
          

          scope.isLeafCard = function isLeafCard () {   
            if(uiFrameworkService.isOpenedDetail)
              return false;
            
            if(!scope.viewProp)
              return true;

            return currCard.level == scope.viewProp.viewObject.length - 1;
          }
          
          scope.refreshCard = function refreshCard(){
            var newEl = $compile(template)(scope);
            element.replaceWith(newEl);
          }
          
                    
          setupCard(scope, element, attr);  
          
          
          //when import a document, or remove a card in list
          //currCard content will be changed
          scope.$watch(
        function () {
            return scope.card;
          },
          function(_new, _old){
                //re-setup the currCard
                setupCard(scope, element, attr);
          }
          );

        scope.$watch(
          function () {
              return scope.isLeafCard();
            },
            function(_new, _old){
        
              if(_new === undefined){
                return;
              }
              
              scope.setCssLeafCard();
            }
          );
            //watch refresh-on to refresh card
            /*scope.$watch(
                function () {
                  return currCard.refreshCard;
                },
                function(_new, _old){

                    if(_new === false){
                      return;
                    }
                    
                    scope.refreshCard();
                  }
                );*/

          // addInstanceOfCardDirective(scope);    
           
        }
        
    };
}])
.directive("stepCard", ['$log', '$compile', 'commonService', 'uiRenderPrototypeService', 'uiFrameworkService',
  function($log, $compile, commonService, uiRenderPrototypeService, uiFrameworkService) {   

    /**
     * set card's visible to 'true' or 'false'
     * @param {Object}  jqEle       jquery element
     * @param {boolean}  isVisible  true or false
     */
    function setHtmlEleVisible(jqEle, isVisible) {
      isVisible ? jqEle.css("display", "initial") : jqEle.css("display", "none");
    }

    return {
    	
        restrict: 'E',
        scope: false,
        templateUrl: contextPathRoot + '/view/myNewWorkspace/template/step-card.html',
        link: function(scope, element, attr) {

          var currCard, visibleWatcherFn;
          scope.setCardVisible = setHtmlEleVisible;

          function setupCard (scope, element, attr) {       

            currCard = scope.card;
            currCard.html = element;
            currCard.scope = scope;
            currCard.level = attr.level;

            currCard.cardStatus = "start";
            currCard.refreshCard = false;
            
            scope.cardElement  = element.find(".v3-live-card-info");

            //update css of selecting & leaf node
            scope.setSelectCss();
            scope.setCssLeafCard();


            var visible = scope.card.isVisible;
            //if isVisible is function, continuously watching it
            if (angular.isString(visible)){
              //if visibleWatcherFn is exist, clear the old watching
              if(visibleWatcherFn)
                visibleWatcherFn();

              visibleWatcherFn = scope.$watch(visible, function(_new) {
                setHtmlEleVisible(element, _new);
              });
            }
            else{
              setHtmlEleVisible(element, visible);
            }
          }
          
          //setup initalized values again
          element.on('$destroy', function() {
            //IVPORTAL-5168: START
            var currCard = scope.card;
            if(currCard){
               currCard.isSelected = false;
               currCard.html = undefined;
               currCard.scope = undefined;
            }
            //IVPORTAL-5168: END
          });
          
          element.bind('click', 
            function(event) {
        	  if (!uiFrameworkService.clickOnNav) {
            	  return;
              }
              uiFrameworkService.clickOnNav = false;
              
              $log.debug("Click on card [level: " + currCard.level + ", index: " + scope.$index + "]");

              //User Guide: there are userguide list on Card and @click Button on it, it will return (Since it will do not call other function)
              if (event.target.nodeName == "BUTTON"){
                return;
              }

              if (!currCard.isCardOpenable())
                return;

              if(currCard.onOpen && !currCard.isSelected){
                  var isContinue = scope.$eval(currCard.onOpen);

                  switch(true){
                    case isContinue === undefined:
                       scope.isContinueOpenCard(event);
                      break;
                      //stop if return false
                      case isContinue === false:
                    	uiFrameworkService.moveToPreviousStep();
                        return;

                      //promise case: need to wait before the onOpen functions finish
                      case isContinue.$$state !== undefined:
                          isContinue.then(function () {
                             scope.isContinueOpenCard(event);
                          });
                          break;
                      default:
                         scope.isContinueOpenCard(event);
                  }
              }
              //if doesn't have 'onOpen' attribute, continue
              else{

                  if(currCard.cardType === uiRenderPrototypeService.CONSTANTS.cardType.ACTION 
                    && currCard.onClick){
                      scope.$eval(currCard.onClick);

                      //this card has staticHtml need to render!
                      if(currCard.staticHtml)
                        scope.isContinueOpenCard(event);
                  }
                  else{
                    scope.isContinueOpenCard(event);
                  }
              }
          });           
          
          scope.isContinueOpenCard = function isContinueOpenCard (event) {     
            //set selected or not
            currCard.isSelected = !currCard.isSelected;
            scope.setSelectCss();
            
            //notify other siblings 
            var siblingCards = currCard.parent ? currCard.parent.children : [];
            for (var i = 0; i < siblingCards.length; i++) {
              if(siblingCards[i] !== currCard){                 
                siblingCards[i].isSelected = false;
                siblingCards[i].scope.setSelectCss();
                
                //close all summary preview cgange card type
                //only show card preview on touch on touch device 
                if(commonService.options.cardTouchMode){
                  if(commonService.options.cardPreview){
                     if(currCard.cardStatus == "start"){
                    siblingCards[i].cardStatus = "detail";
                    //siblingCards[i].scope.openSummary();
                    siblingCards[i].cardStatus = "start";
                  }
                  if(currCard.cardStatus == "detail"){
                    siblingCards[i].cardStatus = "detail";
                    //siblingCards[i].scope.openSummary();
                    siblingCards[i].cardStatus = "start";
                  }
                    if(currCard.cardStatus == "summary"){
                    siblingCards[i].cardStatus = "smallDetail";
                  }
                  
                  if(currCard.cardStatus == "smallDetail"){
      
                    if(siblingCards[i].cardStatus  != "detail"){
                      siblingCards[i].cardStatus = "detail";
                      //siblingCards[i].scope.openSummary();
                      siblingCards[i].cardStatus = "smallDetail";
                    }
                  }
                  if(currCard.cardStatus == "smallSummary"){
                    siblingCards[i].cardStatus = "smallDetail";
                    
                  }
                  }else{
                    siblingCards[i].cardStatus = "detail";
                    currCard.cardStatus = "detail";
                  }
                }
              }   
            };
            if(commonService.options.cardTouchMode){
              if(commonService.options.cardPreview){
                if(currCard.cardStatus == "smallSummary" ){
                  currCard.cardStatus = "summary";
                  currCard.prevSmallSummary = "detail";
                }else{
                  currCard.prevSmallSummary = undefined ;
                }
               // scope.openSummary ();
              }
            }
            
            //execute the declare function
            scope.$eval(attr.whenClick, {clickEvent: event});
            // if(isContinue == false){
            //  currCard.isSelected = !currCard.isSelected;
            //  scope.setSelectCss();
            // }
            if(currCard.prevSmallSummary && commonService.options.cardTouchMode)
              currCard.cardStatus = currCard.prevSmallSummary;
        }
      
  
          /**
           * return false when can't set the css (element children can't be found, not render yet)
           */
          scope.setSelectCss = function setSelectCss () {
            if(element.children().length < 1) 
              return false;//check element has value

            if(currCard.isSelected) {
              var mainCard = element.children().children();
              if(currCard.cardType != 'action') {
                  mainCard.addClass('active');
              }
              
              // Set style class card info
              var cardInfo = mainCard.find(".v3-live-card-info");
              var colorInfo = mainCard.css("background-color");
              if(colorInfo !="" && colorInfo != "rgba(0, 0, 0, 0)" && colorInfo != "white") {
                var borderInfo = "solid 2px " + colorInfo;
                cardInfo.css("color", colorInfo);
                cardInfo.css("border", borderInfo);
              }
            }
            else {
              element.children().children().attr('style', '');
              element.children().children().removeClass('active');
            }      
            return true;                  
          };

          /**
           * return false when can't set the css (element children can't be found, not render yet)
           */
          scope.setCssLeafCard = function setCssLeafCard () {
            if(element.children().length < 1)
              return false;
            
            var mainCard = element.children().children();

            if(scope.isLeafCard()) {
              // Remove small class
              if($(window).width() > 500){
                  scope.maxTrimTextTitle = "22";  
              } else {
                scope.maxTrimTextTitle = "20";
              }
            }
            else {
              // Set small card
              if($(window).width() > 500){
                scope.maxTrimTextTitle = "40";
              }
            }

            return true;
          };

          //change style of summary card base on card's status
          scope.openSummary = function openSummary () {
            if(!commonService.options.cardTouchMode){
              return;
            }
            switch(currCard.cardStatus){
              case "detail":
                break;
              case "start"://open card review
                currCard.cardStatus = "summary";
                break;
              case "summary"://
                currCard.cardStatus = "detail";
                break;
              case "smallDetail":
                currCard.cardStatus = "smallSummary";
                break;

            }

          };
          

          scope.isLeafCard = function isLeafCard () {   
            if(uiFrameworkService.isOpenedDetail)
              return false;
            
            if(!scope.viewProp)
              return true;

            return currCard.level == scope.viewProp.viewObject.length - 1;
          }
          
          scope.refreshCard = function refreshCard(){
            var newEl = $compile(template)(scope);
            element.replaceWith(newEl);
          }
          
                    
          setupCard(scope, element, attr);  
          
          
          //when import a document, or remove a card in list
          //currCard content will be changed
          scope.$watch(
        function () {
            return scope.card;
          },
          function(_new, _old){
                //re-setup the currCard
                setupCard(scope, element, attr);
          }
          );

        scope.$watch(
          function () {
              return scope.isLeafCard();
            },
            function(_new, _old){
        
              if(_new === undefined){
                return;
              }
              
              scope.setCssLeafCard();
            }
          );   
        }
        
    };
}])
.directive("sectionCard", ['$log', '$compile', 'commonService', 'uiRenderPrototypeService', 'uiFrameworkService',
  function($log, $compile, commonService, uiRenderPrototypeService, uiFrameworkService) {   

    /**
     * set card's visible to 'true' or 'false'
     * @param {Object}  jqEle       jquery element
     * @param {boolean}  isVisible  true or false
     */
    function setHtmlEleVisible(jqEle, isVisible) {
      isVisible ? jqEle.css("display", "initial") : jqEle.css("display", "none");
    }

    return {
        restrict: 'E',
        scope: false,
        templateUrl: contextPathRoot + '/view/myNewWorkspace/template/section-card.html',
        link: function(scope, element, attr) {

          var currCard, visibleWatcherFn;
          scope.setCardVisible = setHtmlEleVisible;

          function setupCard (scope, element, attr) {       

            currCard = scope.card;
            currCard.html = element;
            currCard.scope = scope;

            currCard.level = attr.level;

            currCard.cardStatus = "start";
            currCard.refreshCard = false;
            
            scope.cardElement  = element.find(".v3-live-card-info");

            //update css of selecting & leaf node
            scope.setSelectCss();
            scope.setCssLeafCard();


            var visible = scope.card.isVisible;
            //if isVisible is function, continuously watching it
            if (angular.isString(visible)){
              //if visibleWatcherFn is exist, clear the old watching
              if(visibleWatcherFn)
                visibleWatcherFn();

              visibleWatcherFn = scope.$watch(visible, function(_new) {
                setHtmlEleVisible(element, _new);
              });
            }
            else{
              setHtmlEleVisible(element, visible);
            }
          }
          
          //setup initalized values again
          element.on('$destroy', function() {
            //IVPORTAL-5168: START
            var currCard = scope.card;
            if(currCard){
               currCard.isSelected = false;
               currCard.html = undefined;
               currCard.scope = undefined;
            }
            //IVPORTAL-5168: END
          });
          
          element.bind('click', 
            function(event) {
                            
              $log.debug("Click on card [level: " + currCard.level + ", index: " + scope.$index + "]");

              //User Guide: there are userguide list on Card and @click Button on it, it will return (Since it will do not call other function)
              if (event.target.nodeName == "BUTTON"){
                return;
              }

              if (!currCard.isCardOpenable())
                return;

              if(currCard.onOpen && !currCard.isSelected){
                  var isContinue = scope.$eval(currCard.onOpen);

                  switch(true){
                    case isContinue === undefined:
                       scope.isContinueOpenCard(event);
                      break;
                      //stop if return false
                      case isContinue === false:
                        return;

                      //promise case: need to wait before the onOpen functions finish
                      case isContinue.$$state !== undefined:
                          isContinue.then(function () {
                             scope.isContinueOpenCard(event);
                          });
                          break;
                      default:
                         scope.isContinueOpenCard(event);
                  }
              }
              //if doesn't have 'onOpen' attribute, continue
              else{

                  if(currCard.cardType === uiRenderPrototypeService.CONSTANTS.cardType.ACTION 
                    && currCard.onClick){
                      scope.$eval(currCard.onClick);

                      //this card has staticHtml need to render!
                      if(currCard.staticHtml)
                        scope.isContinueOpenCard(event);
                  }
                  else{
                    scope.isContinueOpenCard(event);
                  }
              }
          });           
          
          scope.isContinueOpenCard = function isContinueOpenCard (event) {     
            //set selected or not
            currCard.isSelected = !currCard.isSelected;
            scope.setSelectCss();
            
            //notify other siblings 
            var siblingCards = currCard.parent ? currCard.parent.children : [];
            for (var i = 0; i < siblingCards.length; i++) {
              if(siblingCards[i] !== currCard){                 
 //               siblingCards[i].isSelected = false;
//                siblingCards[i].scope.setSelectCss();
                
                //close all summary preview cgange card type
                //only show card preview on touch on touch device 
                if(commonService.options.cardTouchMode){
                  if(commonService.options.cardPreview){
                     if(currCard.cardStatus == "start"){
                    siblingCards[i].cardStatus = "detail";
                    siblingCards[i].scope.openSummary();
                    siblingCards[i].cardStatus = "start";
                  }
                  if(currCard.cardStatus == "detail"){
                    siblingCards[i].cardStatus = "detail";
                    siblingCards[i].scope.openSummary();
                    siblingCards[i].cardStatus = "start";
                  }
                    if(currCard.cardStatus == "summary"){
                    siblingCards[i].cardStatus = "smallDetail";
                  }
                  
                  if(currCard.cardStatus == "smallDetail"){
      
                    if(siblingCards[i].cardStatus  != "detail"){
                      siblingCards[i].cardStatus = "detail";
                      siblingCards[i].scope.openSummary();
                      siblingCards[i].cardStatus = "smallDetail";
                    }
                  }
                  if(currCard.cardStatus == "smallSummary"){
                    siblingCards[i].cardStatus = "smallDetail";
                    
                  }
                  }else{
                    siblingCards[i].cardStatus = "detail";
                    currCard.cardStatus = "detail";
                  }
                }
              }   
            };
            if(commonService.options.cardTouchMode){
              if(commonService.options.cardPreview){
                if(currCard.cardStatus == "smallSummary" ){
                  currCard.cardStatus = "summary";
                  currCard.prevSmallSummary = "detail";
                }else{
                  currCard.prevSmallSummary = undefined ;
                }
                scope.openSummary ();
              }
            }
            
            //execute the declare function
            scope.$eval(attr.whenClick, {clickEvent: event});
            // if(isContinue == false){
            //  currCard.isSelected = !currCard.isSelected;
            //  scope.setSelectCss();
            // }
            if(currCard.prevSmallSummary && commonService.options.cardTouchMode)
              currCard.cardStatus = currCard.prevSmallSummary;
        }
      
  
          /**
           * return false when can't set the css (element children can't be found, not render yet)
           */
          scope.setSelectCss = function setSelectCss () {
              if(element.children().length < 1) 
                return false;//check element has value
              
              var outerBox = element.children().children();
              var mainCard = outerBox.children();
              if(currCard.isSelected) {
            	  mainCard.addClass('active');
//                  var currBackgroundColor = mainCard.css("border-color");
//                  if(currBackgroundColor != "" && currBackgroundColor != "rgb(85, 85, 85)") {
//                    var border = "border: 2px solid " + currBackgroundColor + " !important;"
//                    var backgroundColor = "background-color: " + currBackgroundColor + " !important;";
//                    var color = "color: white";
//                    //outerBox.attr('style', border);
//                    mainCard.attr('style', border + backgroundColor + color);
//                  }
              }
              else {
            	  mainCard.removeClass('active');
              	//outerBox.attr('style', '');
              	//mainCard.attr('style', '');
              }      
              return true;                  
            };

          /**
           * return false when can't set the css (element children can't be found, not render yet)
           */
          scope.setCssLeafCard = function setCssLeafCard () {
          };

          //change style of summary card base on card's status
          scope.openSummary = function openSummary () {
            if(!commonService.options.cardTouchMode){
              return;
            }
            switch(currCard.cardStatus){
              case "detail":
                break;
              case "start":
                currCard.cardStatus = "summary";
                break;
              case "summary":
                currCard.cardStatus = "detail";
                break;
              case "smallDetail":
                currCard.cardStatus = "smallSummary";
                break;

            }
          };
          

          scope.isLeafCard = function isLeafCard () {   
            if(uiFrameworkService.isOpenedDetail)
              return false;
            
            if(!scope.viewProp)
              return true;

            return currCard.level == scope.viewProp.viewObject.length - 1;
          }
          
          scope.refreshCard = function refreshCard(){
            var newEl = $compile(template)(scope);
            element.replaceWith(newEl);
          }
          
          setupCard(scope, element, attr);  
          
          //when import a document, or remove a card in list
          //currCard content will be changed
          scope.$watch(
        function () {
            return scope.card;
          },
          function(_new, _old){
                //re-setup the currCard
                setupCard(scope, element, attr);
          }
          );

        scope.$watch(
          function () {
              return scope.isLeafCard();
            },
            function(_new, _old){
        
              if(_new === undefined){
                return;
              }
              
              scope.setCssLeafCard();
            }
          );
        }
    };
}])
//http://stackoverflow.com/questions/10629238/angularjs-customizing-the-template-within-a-directive
//http://stackoverflow.com/questions/23065165/angularjs-directive-dynamic-templates
.directive("uiElement", ['$log', '$compile', '$interval', '$timeout', '$translate', 'uiRenderPrototypeService', 
  function($log, $compile, $interval, $timeout, $translate, uiRenderPrototypeService) {

    function insertAt(html, type, str) {
      var index = html.indexOf(type) + type.length;
        return html.substr(0, index) + str + html.substr(index);
    }

    //will change the content of error messages, mandatory, disable status
    var resetHtmlDisplayContent = function resetHtmlDisplayContent(uiElement) {

      if((uiRenderPrototypeService.getUiElementRefDocType(uiElement) === uiRenderPrototypeService.commonService.CONSTANTS.MODULE_NAME.PROSPECT ||
      uiRenderPrototypeService.getUiElementRefDocType(uiElement) === uiRenderPrototypeService.commonService.CONSTANTS.MODULE_NAME.CORPORATE ||
      uiRenderPrototypeService.getUiElementRefDocType(uiElement) === uiRenderPrototypeService.commonService.CONSTANTS.MODULE_NAME.USER ||
      uiRenderPrototypeService.getUiElementRefDocType(uiElement) === uiRenderPrototypeService.commonService.CONSTANTS.MODULE_NAME.APPLICATION)
        && uiElement.type === uiRenderPrototypeService.CONSTANTS.type.INPUT){

        //reset error message content
        var errMsg = $translate.instant(uiElement.refDetail.errorMessage);
        uiElement.html.find('.errorMessage').text(errMsg);

        //reset mandatory
        var mandatory = uiElement.refDetail['@mandatory'] === '1' ? '*' : '';
        uiElement.html.find('#mandatory').text(mandatory);

        //reset disable or not
        var disable = uiElement.refDetail['@editable'] === '1' ? false : true;
        uiElement.html.find('input').prop('disabled', disable);
      }
    };
    
    var prepareTemplate = function prepareTemplate (uiElement) {
      var htmlContent = uiElement.originalHtmlContent;

      if((uiRenderPrototypeService.getUiElementRefDocType(uiElement) === uiRenderPrototypeService.commonService.CONSTANTS.MODULE_NAME.PROSPECT ||
      uiRenderPrototypeService.getUiElementRefDocType(uiElement) === uiRenderPrototypeService.commonService.CONSTANTS.MODULE_NAME.CORPORATE ||
      uiRenderPrototypeService.getUiElementRefDocType(uiElement) === uiRenderPrototypeService.commonService.CONSTANTS.MODULE_NAME.USER ||
      uiRenderPrototypeService.getUiElementRefDocType(uiElement) === uiRenderPrototypeService.commonService.CONSTANTS.MODULE_NAME.APPLICATION)
        && uiElement.type === uiRenderPrototypeService.CONSTANTS.type.INPUT){
        var wrapContent = {
          start: '<div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 v3-column-content"> <div class="col-xs-offset-1 col-xs-10 v3-column-content"><div class="form-group form-group-lg has-success">',
          end: '</div></div></div>'
        };

        var labelContent = $translate.instant(uiElement.labelKey);
        var mandatory = uiElement.refDetail['@mandatory'] === '1' ? '*' : '';
        // var labelHtml = '<label>' + labelContent + '<span id="mandatory" class="errorMessage">' + mandatory + '</span></label>';
        var labelHtml = '<label>' + labelContent + '<span id="mandatory">' + mandatory + '</span></label>';

        var placeHolderTxt = uiElement.refDetail['@editable'] === '1' ? $translate.instant(uiElement.placeholder) : '';
        var bindValue = "uiElement.refDetail." + (uiElement.refDetail.Options ? "Value" : "$");
//        var disable = uiElement.refDetail['@editable'] === '1' ? '' : 'disabled';
        var maxlength = uiElement.maxlength ? 'maxlength="' + uiElement.maxlength + '"' : '';
//        var errMsg = $translate.instant(uiElement.refDetail.errorMessage);

        var inputHtml = '<input type="text" class="form-control" placeholder="' + placeHolderTxt 
        + '" ng-model="' + bindValue + '"' + 'ng-disabled="uiElement.isDisable() || moduleService.freeze == true" ' + maxlength + '/>'
        + '<span class="errorMessage" ng-bind="uiElement.refDetail.errorMessage | translate"></span>';

        htmlContent = wrapContent.start + labelHtml + inputHtml + wrapContent.end;
      }
      if(uiElement.type === "hyperlink"){
        var wrapContent = {
          start: '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12"> <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12"><div class="form-group form-group-lg has-success">',
          end: '</div></div></div>'
        };

        var labelContent = $translate.instant(uiElement.labelKey);
        var onClick = uiElement.onClick;
        var disableCondition = uiElement.disableCondition;
        var labelHtml = '<a href="" ng-click="' + onClick + '"> <u><i>' + labelContent + '</a>';
        //var labelHtml = '<a href="">' + labelContent + '</a>';

        htmlContent = wrapContent.start + labelHtml + wrapContent.end;
      }
      
      //Check & set disable element field
      if(uiElement.refDetail && htmlContent && uiElement.type){
        if(uiElement.refDetail['@editable'] !== '1'){
          if(uiElement.type == "v3-switch-new" || uiElement.type == "v3-switch-new-slide"){
            htmlContent = insertAt(htmlContent, uiElement.type, ' switch-disabled="true" ');
          }
          else if(uiElement.type == "ng-newDropDown"){
            htmlContent = insertAt(htmlContent, uiElement.type, ' disable="true" ');
          }
          /*else{
            htmlContent = insertAt(htmlContent, uiElement.type, ' ng-disabled="true" ');
          }*/
        }
        else{
          // NOTE: will appear error if "switch-disable" isn't added to htmlContent  
          if(uiElement.type == "v3-switch-new" || uiElement.type == "v3-switch-new-slide"){
            htmlContent = insertAt(htmlContent, uiElement.type, ' switch-disabled="false" ');
          }
        }
      }
      
      
      return htmlContent;
    };


    //add css red border
    var setRedIfErr = function setRedIfErr (uiElement, element) {  
        // return;

        //if error message existed (after computing), set border of input field to red
        if(uiRenderPrototypeService.isErrorMsgsExist(uiElement.refDetail)){ 
           var inputField = undefined;   
      
            //if doesn't have "type" declared, set default type
            if(!uiElement.type)
              uiElement.type = uiRenderPrototypeService.CONSTANTS.type.INPUT;
            
            // if(uiElement.originalHtmlContent.indexOf("ng-newDropDown") !== -1)
             //  return;
      
            //try to find the element declare by 'type' by using $interval
            //There some directive can't be render in the first time, so need to wait for finding them again
            // var timeoutId = $interval(function() {
            $timeout(function() {
              inputField = element.find(uiElement.type);
      
              if(inputField.length > 0){
                if(uiElement.type == "ng-newDropDown"){
                  inputField.find("div").css("border", "2px solid #F00");
                }
                else if(uiElement.type == "v3-switch-new"){
                  inputField.find("input").css('border-color','#F00');
                }
                else{
                  inputField.css('border-color','#F00'); 
                }
      
                //stop if having result
                // $interval.cancel(timeoutId);
              }
            // }, 50);
            }, 1000);
        }
    };

    function unbindEvents(scope, element) {
      if(scope.stopWatching)
        scope.stopWatching();

      if(scope.bindFn)
        element.unbind("click change", scope.bindFn);
    };

    function bindEvents(refDetail, scope, element) {
        if(refDetail){
          //first we unbind the old ones
          unbindEvents(scope, element);

          //if uiElement is input field
          if(refDetail.hasOwnProperty('@mandatory')){
            var watchingFn = refDetail.Options ? function(){ return refDetail.Value} : function(){ return refDetail.$};

            //watching the detail for showing the red line on input
            scope.stopWatching = scope.$watch(
              watchingFn,
              function (_new, _old) {    
                if(_new === _old)        
                  return;
                /*
                 * hle56
                 * use for Direct Sale's UIElement 
                 */
                if (typeof standAloneWebappType != 'undefined' && standAloneWebappType =='WEB_DIRECT') {
	                if(scope.uiElement.originalHtmlContent.indexOf('pos-phone-number-ds') != -1){ //hle56: Use for Contact Number Phone
	                	 var inputValue = scope.uiElement.refDetail.$;
	                	 var n = inputValue.indexOf(" ");
	                     if(n!=-1){
	          	           var suffix = inputValue.slice(n+1,inputValue.length);
	          	           if(suffix.replace(/[^0-9]/g, '').length == 0){
	          	               scope.uiElement.refDetail.$ = '';
	          	           } else
	          	        	   delete scope.uiElement.refDetail.errorMessage;
	                     }
	                }
                }
                updateView(scope.uiElement);
              }
            );
          }
          //if uiELement is a BIG object
          else{

            
            scope.bindFn = function($event) {
            	//This area code to close popup Nation Flag selection when clicking outside it
            	//if(scope.uiElement.parent.uiEle[1].html.find('.country-list').hasClass)
              updateView(scope.uiElement);
            };

            element.bind("click change", scope.bindFn);
          }
        }
      };


    function updateView(uiElement){
      $log.debug("Update view for UiElement: " + uiElement.name);

      //TODO: need a better way for uiElement to detect change in value itself,
      //not notify by angular event
      uiElement.updateValue(uiElement.getValue());
      

        //uiRenderPrototypeService.removeEmptyField(uiElement.parent);
        uiRenderPrototypeService.updateNumberOfEmptyFields(uiElement.parent);
         
         //temporary disable, waiting for the complete of jsonMock
        // setRedIfErr(uiElement, element);
    };

    var linkFn = function linkFn(scope, element, attr) {
      scope.resetHtmlDisplayContent = resetHtmlDisplayContent;

      var template = prepareTemplate(scope.uiElement);

      //if template is undefined, don't need to render these content
      if(!template)
        return;

      var newEle = $compile(template)(scope);


      element.replaceWith(newEle);
      
      scope.uiElement.scope = scope;
      scope.uiElement.html = newEle;


        //setup initalized values again
      newEle.on('$destroy', function() {
       scope.uiElement.html = undefined;
       scope.uiElement.scope = undefined;
      });


      scope.uiElement.onEvent(uiRenderPrototypeService.CONSTANTS.EVENT.DETAIL_CHANGED, function(event) {
        bindEvents(event.data, scope, newEle);
      });
      
      bindEvents(scope.uiElement.refDetail, scope, newEle);
      scope.uiElement.getIsDisableFn(scope);
      //continuosly watching whether this uiElement is visible on screen or not
      scope.$watch(
        // function(){
        //   return scope.uiElement.isVisibleOnScreen();
        // }, 
        scope.uiElement.getIsVisibleOnScreenFn()
        , 
        function (_new, _old) {
          _new ? newEle.css("display", "") : newEle.css("display", "none");
        }
      );
    }

    return {
        restrict: 'E',
        transclude: 'element',
        scope: false,
        link: linkFn
    };
}])
.directive("cardIcon", ['$log', function($log) {
    return{
      restrict: 'A',
      scope: false,
      link: function(scope, ele, attr) {
        var iconData = scope.$eval(attr.cardIcon);
        if(iconData.content.indexOf("(") != -1){//suport function to return string icon
        	var content = scope.$eval(iconData.content);
        }else{
        	var content = iconData.content;
        }
        

        var cssClass = iconData.cssClass;
        switch(iconData.contentType){
          case 'text'://case test: like type 1, type 2, ...
            ele.html(content);
            break;
          case 'function'://case content is a result from a dynamic function
            scope.$watch(content, function (_new, _old) {
              ele.html(_new);
            });
            break;
          case 'cssClass':
            cssClass = cssClass + ' ' + content;
            break;
          default:
            $log.error("Icon Content is misconfiguration! (see the data below for more detail)");
            $log.error(iconData);
        }

        //handle css
        ele.addClass(cssClass);

        //handle isVisible att
        //If it's not string --> it's a function need to watch
        if(angular.isString(iconData.isVisible)){          
          scope.$watch(iconData.isVisible, function (_new, _old) {
            _new ? ele.css("display", "") : ele.css("display", "none");
          });
        }

        //handle onClick attribute
        if(iconData.onClick){
          ele.bind('click', function (event) {
            //don't allow the click event affect the main card
            event.stopPropagation();
            
            scope.$eval(iconData.onClick);

            //if parent card has scope (not the root card)
            if (scope.card.parent.scope)
              scope.card.parent.scope.$digest();
            //get the main-ctrl in charge, and digest its children
            else
              scope.getCtrlInCharge().$digest();
          });
        }
      }
    };
}])
.directive('loading', ['$compile', function($compile) {
    return{
      priority: 1,
      //terminal:true,
      restrict: 'A',
      link: function(scope, elm, attr) {
        var clickAction = attr.loadingAction;
        elm.bind('click',function($event){
          //find class by regex
          var totalClass=$("[class*='ipos-partial-loading-selected-']");
          var className='ipos-partial-loading-selected-'+(totalClass.length+1);
          if(elm.attr("class").indexOf("ipos-partial-loading-selected") < 0) {
            angular.element(elm).addClass(className);
          }
          scope.$eval(clickAction);
      });
      }
    };
}])
.directive('format', ['$filter', function($filter) {
    return {
        require: '?ngModel',
        link: function(scope, elem, attrs, ctrl) {
            if (!ctrl) return;

            //model -> view 
            ctrl.$formatters.unshift(function(a) {
              return $filter(attrs.format)(ctrl.$modelValue)
            });
            
            //view -> model
            ctrl.$parsers.unshift(function(viewValue) {
             if(typeof viewValue == "number")
                viewValue = viewValue+"";
              var plainNumber = viewValue.replace(/[^\d|\-+|\.+]/g, '');
              elem.val( $filter('number')(plainNumber) );
              return plainNumber;
            });
        }
    };
}])
.directive('formatRanking', ['$filter', function($filter) {
    return {
        require: '?ngModel',
        link: function(scope, elem, attrs, ctrl) {
            if (!ctrl) return;

            //model -> view 
            ctrl.$formatters.unshift(function(a) {
              if(a != "")
                return $filter(attrs.formatRanking)(ctrl.$modelValue)
            });
            
            //view -> model
            ctrl.$parsers.unshift(function(viewValue) {
              var plainNumber = viewValue.replace(/[^\d|\-+|\.+]/g, '');
              if(viewValue==""){
                elem.val(plainNumber);
              }else{
                elem.val( $filter(attrs.formatRanking)(plainNumber) );
              }
              return plainNumber;
            });
        }
    };
}])
.directive('clickWhenKeydown',  function() {
  return {
      link: function(scope, element, attrs) {
        element.bind("keyup", function(){
          element.click()
        });
    }
  }
})
.directive('positiveNumber',  function() {
  return {
      require: '?ngModel',
      link: function(scope, element, attrs, ngModelCtrl) {
        if(!ngModelCtrl) {
          return; 
        }
        
        ngModelCtrl.$parsers.push(function(val) {
          var clean = val.replace( /[^0-9]+/g, '');
          if (val !== clean) {
            ngModelCtrl.$setViewValue(clean);
            ngModelCtrl.$render();
          }
          return clean;
        });
        
        element.bind('keypress', function(event) {
          if(event.keyCode === 32) {
            event.preventDefault();
          }
        });
      }
    };
})
.directive('refreshOn', ['$compile', '$parse', function($compile, $parse) {
    return {
        restrict: 'A',
        scope: true,
        compile: function(element) {
            var template = angular.element('<a></a>').append(element.clone()).html();
            return function link(scope, element, attrs) {
                var stopWatching = scope.$parent.$watch(attrs.refreshOn, function(_new, _old) {
                    var useBoolean = attrs.hasOwnProperty('useBoolean');
                    if ((useBoolean && (!_new || _new === false)) || (!useBoolean && (!_new || _new === _old))) {
                        return;
                    }
                    // reset refreshOn to false if we're using a boolean
                    if (useBoolean) {
                        $parse(attrs.refreshOn).assign(scope.$parent, false);
                    }

                    // recompile
                    var newEl = $compile(template)(scope.$parent);
                    element.replaceWith(newEl);

                    // Destroy old scope, reassign new scope.
                    stopWatching();
                    scope.$destroy();

                    //call function after finish render
                    if (attrs.hasOwnProperty('afterRefresh')) {
                        $parse(attrs.afterRefresh)(scope);
                    }

                });
            }
        }
    };
}])
//tphan37: execute functions in controllers when enter
.directive('v3OnEnter', function() {
  return function(scope, element, attrs) {
    element.bind("keydown", 
      function(event) {
        if(event.keyCode == 13 ||event.which == 13){
          scope.$eval(attrs.v3OnEnter, {$event: event});
          return false;
        }
        return true;
      }
    )
  }
})
//dnguyen98: auto focus element Input with expression
.directive('v3AutoFocus', ['$timeout', function($timeout) { 
  return function(scope, element, attrs) {
    scope.$watch(attrs.v3AutoFocus, 
      function () { 
        $timeout(function() {
             element[0].focus();
        });
      },true);
  };    
}])

/**
 * Android app
 * dnguyen98: This directive for list view      
 */
.directive('documentListView', ['$parse', '$timeout', '$translate', '$filter', '$compile', '$state', 'uiRenderPrototypeService',
                        function($parse, $timeout, $translate, $filter, $compile, $state, uiRenderPrototypeService) {
    return {
      restrict:'E',
      transclude:true,
      replace:false,
      scope: {
        datalist: '=',
        isloadlist: '=',
        doctype:'@',
        reloadlist:'&',
        title:'@',
        action:'@?',
        datalistsync: '=?',
        moreaction: '&?'
      },
      link: function(scope, element, attrs) {
          scope.isShowButtonSync = attrs.isShowButtonSync == "true"? true: false;
    	  scope.currentPage = 1;
    	  scope.pageSizes = [5, 10, 20, 25, 30];
    	  scope.pageSize = {"size": "5"};
    	  if(scope.action){
    		  scope.templateHtml = 'my-view/list-view/partial/'+ scope.doctype +'-' + scope.action +'-list-view.html';    		  
    	  }else{
    		  scope.templateHtml = 'my-view/list-view/partial/'+ scope.doctype +'-list-view.html';
    	  }
    	  scope.isShowSearchForm = false;
    	  scope.isListView = true;
    	  
    	  scope.checkShowSearchForm = function($event) {    		  
    		  scope.isShowSearchForm = true;
    		  $event.stopPropagation();
    	  };
    	  
    	  scope.checkHideSearchForm = function($event) {
    		  if (!$(event.target).closest("#searchBox").length) {
    			  scope.isShowSearchForm = false;
    			  scope.searchText = '';
    		  }
    	  };

    	  //Add new document by doctype
    	  scope.addNew = function(doctype) {
    		  	//localStorage.clear();
    		  	uiRenderPrototypeService.removeLocalStorageVariables();//clear all old values
	        	switch (doctype) {
	        	case 'case-management':
	        		$state.go('root.list.detail', {docType: 'case-management', ctrlName: "BusinessCatalogDetailCtrl"});
	        		break;
	        	case 'prospect':
	        		localStorage.setItem('pageParams', JSON.stringify({"action": "createContact"}));
	        		$state.go('root.list.detail', {docType: '', ctrlName: "CreateContactCtrl"});
	        		break;	
	        	case 'fna':	
	        		localStorage.setItem('pageParams', JSON.stringify({"DocType":"factfind","BusinessStatus":"NEW"}));
	        		$state.go('root.list.detail', {docType: 'factfind', ctrlName: "MyNewWorkspaceCtrl"});
	        		break;
	        	
	        	}
    	  };
    	  
    	  //Open detail document by doctype, docID
    	  scope.goToDocumentDetails = function(item) {
    		  //localStorage.clear();
    		  uiRenderPrototypeService.removeLocalStorageVariables();//clear all old values
    		  localStorage.setItem('pageParams', JSON.stringify(item));
    		  $state.go('root.list.detail', {docType: item.DocType, ctrlName: "MyNewWorkspaceCtrl", hasMetadata: true});
    	  };
    	  
    	  /**********Start function for check box***************/
    	  //Click to choose a item or remove a item
    	  scope.toggleSelection = function(item) {
    		  var idx = scope.datalistsync.indexOf(item);
    	        if (idx > -1){
    	        	scope.datalistsync.splice(idx, 1);
    	        }else {
    	        	scope.datalistsync.push(item);
    	        }
    	  };
    	  
    	  //Check existing item
    	  scope.exists = function (item) {
    	        return scope.datalistsync.indexOf(item) > -1;
    	  };
    	  
    	  //Check selected all item
    	  scope.isChecked = function() {
    		  if(scope.datalist){
    			  return scope.datalistsync.length === scope.datalist.length;    			  
    		  }else{
    			  return false;
    		  }
		  };
    	  
    	  //Click to choose all items or remove all items
    	  scope.selectAll = function() {
    		  if (scope.datalistsync.length === scope.datalist.length) {
			      scope.datalistsync = [];
			  } else if (scope.datalistsync.length === 0 || scope.datalistsync.length > 0) {
			      scope.datalistsync = scope.datalist.slice(0);
			  }
    	  };
    	  /**********End function for check box***************/
      },
      templateUrl : 'my-view/list-view/main-list-view.html',
    };
}])
;
/*;
;*/
