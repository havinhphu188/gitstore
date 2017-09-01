//
// Wrapper API for Cordova
//
var iPosAppPlugin = {

    /**
     *  Params Object
     *
     *  @return Constant Values
     */
    IPOS_APP_HAS_ERROR: "1",
    IPOS_APP_NO_ERROR: "0",
    IPOS_APP_SYSTEM_ERROR_CODE: "500",
    IPOS_APP_SYSTEM_ERROR_MESSAGE_ID: "i18n.contact.admin",
    
    /**
     *  Request send from front-end
     *
     *  @return RequestMessge object
     */
    RequestMessage: function ()
    {
        this.action = "";
        this.category = "";
        this.success = null;
        this.fail = null;
        this.context = null;
        this.messages = {};
    },

    /**
     *  Response return from Native App
     *
     *  @return ResponseMessage
     */
    ResponseMessage: function ()
    {
        this.hasError = false;
        this.errorCode = 0;
        this.errorMessage = "";
        this.context = null;
        this.messages = [];
    },

    /**
     Application Constructor
     
     :returns: None
     */
    initialize: function() {
        console.log('iPosAppPlugin.initialize');
    },

    /**
     *  Execute Runtime Process in Native App
     *
     *  @param requestMessage Message from front-end
     *
     *  @return Callback function for Success/Fail
     */
    executeProcess: function(requestMessage)
    {
        // Start Audit by sending Time to Runtime
        // Add more param for Audit
        //
        console.log('Start executing process');
        Cordova.exec(
            function(argsSuccess){iPosAppPlugin.callbackSuccess(argsSuccess, requestMessage.success, requestMessage.context);},
        function(argsFail){iPosAppPlugin.callbackFail(argsFail, requestMessage.fail, requestMessage.context);}, 
        "iPosAppPlugin", "executeProcess", 
        //"LoginPlugin", "loginAction", 
        [requestMessage]);

        console.log('executeProcess='+requestMessage.action);
    },

    /**
     *  callback method for success
     *
     *  @param argsSuccess Data sent from Native
     *  @param success     Callbacl method
     *
     *  @return None
     */
    callbackSuccess: function(argsSuccess, success, context)
    {
        var response = iPosAppPlugin.getResponse(argsSuccess);
        response.context = context;
        if (success != null && success != undefined)
        {
            // Call directly will
            // raise issue cannot debug function raise from Cordova
            //success(response);
            // So that, we use setTimeout to create another virtual thread
            setTimeout( function() {
                       success(response);
            }, 0 );
        }
    },

    /**
     *  Callback method for fail
     *
     *  @param argsFail Data sent from native App
     *  @param fail     Callback function
     *
     *  @return <#return value description#>
     */
    callbackFail: function(argsFail, fail, context)
    {
        var response = iPosAppPlugin.getResponse(argsFail);
        response.context = context;
        if (fail != null && fail != undefined)
        {
            // Call directly will
            // raise issue cannot debug function raise from Cordova
            // fail(response);
            // So that, we use setTimeout to create another virtual thread
            setTimeout( function() {
                       fail(response);
            }, 0 );
        }
    },

    /**
     *  Convert array to ResponseMessage
     *
     *  @param agrs Data from Native App
     *
     *  @return Result
     */
    getResponse: function(agrs)
    {
        if (agrs != null)
            return agrs;

        var response = new iPosAppPlugin.ResponseMessage();
        response.hasError = iPosAppPlugin.IPOS_APP_HAS_ERROR;
        response.errorCode = iPosAppPlugin.IPOS_APP_SYSTEM_ERROR_CODE;
        response.errorMessage = iPosAppPlugin.IPOS_APP_SYSTEM_ERROR_MESSAGE_ID;
        
        return response;
    },

    callbackProcess: function()
    {
        alert('callbackProcess');
    }
};

/**
 *  Initial iPos Plugins
 */
iPosAppPlugin.initialize();