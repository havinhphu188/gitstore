var unitTest = new Object();

function testExecuteInitCaseManagement()
{
    var request = new iPosAppPlugin.RequestMessage();
    request.success = successProcess;
    request.fail = failProcess;
    request.action = "doctype.add";
    request.category = "common";
    request.context = this;
    request.messages = {
        "docType":"case-management",
        "computeKind":"initDocument"
    };
    iPosAppPlugin.executeProcess(request);
}

function testExecuteLazyTermlife()
{
    var request = new iPosAppPlugin.RequestMessage();
    request.success = successProcess;
    request.fail = failProcess;
    request.action = "doctype.compute-lazy";
    request.category = "common";
    request.context = this;
    request.messages = {
        "docType":"illustration",
        "productCode":"term-life-protect"
    };
    iPosAppPlugin.executeProcess(request);
}

function testFindResourceByUiD()
{
    var request = new iPosAppPlugin.RequestMessage();
    request.success = successProcess;
    request.fail = failProcess;
    request.action = "docType.resource.getByUid";
    request.category = "ios.platform";
    request.context = this;
    request.messages = {
        "docType":"resource-file",
        "documentId":"56F014F6-24CF-4234-A047-971A1B7EB9D9"
    };
    iPosAppPlugin.executeProcess(request);
}

function testPreviewAttachment()
{
    var request = new iPosAppPlugin.RequestMessage();
    request.success = successProcess;
    request.fail = failProcess;
    request.action = "docType.attachment.preview";
    request.category = "ios.platform";
    request.context = this;
    request.messages = {
        "docType":"resource-file",
        "resourcePreview":true,
        "documentId":"DA32D13B-D48B-4124-AF7A-6D13062666D7"
    };
    iPosAppPlugin.executeProcess(request);
}

function testUpdateAttachment()
{
    var request = new iPosAppPlugin.RequestMessage();
    request.success = successProcess;
    request.fail = failProcess;
    request.action = "docType.attachment.update";
    request.category = "ios.platform";
    request.context = this;
    request.messages = {
        "docType":"resource-file",
        "resourceBinary":"based64Encoded",
        "documentId":"DA32D13B-D48B-4124-AF7A-6D13062666D7"
    };
    iPosAppPlugin.executeProcess(request);
}

function testSaveProspect()
{
    var request = new iPosAppPlugin.RequestMessage();
    request.success = successProcess;
    request.fail = failProcess;
    request.action = "doctype.save";
    request.category = "common";dasdasdasdasdfdsfsdfdsfsdf
    request.context = this;
    request.messages = {
        "docType":"prospect",
        "documentjson":"documentObjectHere"
    };
    iPosAppPlugin.executeProcess(request);
}//retrieve a prospect document (saved) with docId. Put it next request to process finalize coupling


function testFinalizeCoupling()
{
    var request = new iPosAppPlugin.RequestMessage();
    request.success = successProcess;
    request.fail = failProcess;
    request.action = "doctype.finalizeCoupling";
    request.category = "common";
    request.context = this;
    request.messages = {
        "docType":"prospect",
        "documentId":"PdPa-DocId",
        "documentjson":"PdpaDocument which is filled Prospect's DocId"
    };
    iPosAppPlugin.executeProcess(request);
}
//couple reference flow (end)

function testExecuteStarDocument()
{
    var request = new iPosAppPlugin.RequestMessage();
    request.success = successProcess;
    request.fail = failProcess;
    request.action = "doctype.star";
    request.category = "common";
    request.context = this;
    request.messages = {
        "documentId":"B781028-IJ8193742-P09382453"
    };
    iPosAppPlugin.executeProcess(request);
}



function testExecuteUnStarDocument()
{
    var request = new iPosAppPlugin.RequestMessage();
    request.success = successProcess;
    request.fail = failProcess;
    request.action = "doctype.unStar";
    request.category = "common";
    request.context = this;
    request.messages = {
        "documentId":"B781028-IJ8193742-P09382453"
    };
    iPosAppPlugin.executeProcess(request);
}



function testExecuteIllustrationTermLife()
{
    var request = new iPosAppPlugin.RequestMessage();
    request.success = successProcess;
    request.fail = failProcess;
    request.action = "doctype.add";
    request.category = "common";
    request.context = this;
    request.messages = {
        "docType":"illustration",
        "productCode":"term-life-protect",
        "computeKind":"initDocument"
    };
    iPosAppPlugin.executeProcess(request);
}

function testExecuteIllustrationMotor()
{
    var request = new iPosAppPlugin.RequestMessage();
    request.success = successProcess;
    request.fail = failProcess;
    request.action = "doctype.add";
    request.category = "common";
    request.context = this;
    request.messages = {
        "docType":"illustration",
        "productCode":"motor-sompo",
        "computeKind":"initDocument"
    };
    iPosAppPlugin.executeProcess(request);
}

function testEditProcess()

{
    
    var request = new iPosAppPlugin.RequestMessage();
    
    request.success = successProcess;
    
    request.fail = failProcess;
    
    request.action = "doctype.edit";
    
    request.category = "common";
    
    request.context = this;
    
    request.messages = {
        
        "docType":"prospect",
        
        "computeKind":"editDocument",
        
        "documentId":"81EFFB14-4A5B-4620-B015-F5D333AC1F2E"
        
    };
    
    iPosAppPlugin.executeProcess(request);
    
}



function testComputeLazyProcess()

{
    var request = new iPosAppPlugin.RequestMessage();
    request.success = successProcess;
    request.fail = failProcess;
    request.action = "doctype.compute-lazy";
    request.category = "common";
    request.messages = {
        
        "docType":"prospect"
        
    };
    
    iPosAppPlugin.executeProcess(request);
    
}



function testExecuteUserProcess()

{
    
    var request = new iPosAppPlugin.RequestMessage();
    
    request.success = successProcess;
    
    request.fail = failProcess;
    
    request.action = "doctype.add";
    
    request.category = "common";
    
    request.context = this;
    
    request.messages = {
        
        "docType":"user",
        
        "computeKind":"initDocument"
        
    };
    
    iPosAppPlugin.executeProcess(request);
    
}



function testComputeProcess()

{
    
    var request = new iPosAppPlugin.RequestMessage();
    
    request.success = successProcess;
    
    request.fail = failProcess;
    
    request.action = "doctype.compute";
    
    request.category = "common";
    
    request.messages = {
        
        "docType":"illustration",
        
        "computeKind":"computeDocument"
        
    };
    
    iPosAppPlugin.executeProcess(request);
    
}



function testComputeTagProcess()

{
    
    var request = new iPosAppPlugin.RequestMessage();
    
    request.success = successProcess;
    
    request.fail = failProcess;
    
    request.action = "doctype.compute-tag";
    
    request.category = "common";
    
    request.messages = {
        
        "docType":"illustration",
        
        "module":"product",
        
        "tag":"BasePlan"
        
    };
    
    iPosAppPlugin.executeProcess(request);
    
}



/**
 
 *  testShowPDF
 
 *
 
 *  @return
 
 */

function testShowPDFHardPath()

{
    
//    var pdfPath = "/Users/minhly/Library/Developer/CoreSimulator/Devices/37B8D6C3-5FC8-4E6E-B329-4C579D57BF08/data/Applications/F539FA0D-46B5-4963-B964-42C167F4598D/Documents/benefit.pdf";
    var pdfPath = "/Users/minhly/Library/Developer/CoreSimulator/Devices/6426E11F-F470-4B28-BE37-A446EC426747/data/Applications/D33D0A1F-6B27-48DF-B268-EA357139A4E0/Documents/my_image.png";
    
    testShowPDFFromPath(pdfPath);
    
}


/**
 *  testShowImagePicker
 *
 *  @return
 */
function testShowImagePicker()
{
    var request = new iPosAppPlugin.RequestMessage();
    request.success = successImage;
    request.fail = failImage;
    request.action = "docType.attachment";
    request.category = "ios.platform";
    request.messages = {
        "docType":"resource-file",
//        "multiSelection":true
    };
    iPosAppPlugin.executeProcess(request);
}


function testCloneDocument()

{
    
    var request = new iPosAppPlugin.RequestMessage();
    
    request.success = successClone;
    
    request.fail = failClone;
    
    request.action = "doctype.cloneDocument";
    
    request.category = "ios.platform";
    
    request.messages = {
        
        "documentId":"28BC2C4C-6388-407C-BA20-4F61C63BD0FC"
        
    };
    
    iPosAppPlugin.executeProcess(request);
    
}


/**
 *  testESignature
 *
 *  @return
 */
function testESignature()
{
    var request = new iPosAppPlugin.RequestMessage();
    request.success = successProcess;
    request.fail = failProcess;
    request.action = "doctype.eSign";
    request.category = "ios.platform";
    request.messages = {
        "eSignDeact":true,
        "docPathToDisplay": "/Users/phongnguyen/Library/Developer/CoreSimulator/Devices/3E6342B7-D840-415D-ABF3-06926C0075E3/data/Applications/C0266B6E-FBA0-45AE-B39C-EF196C25E40D/Documents/users/test@liferay.com/esign.pdf"
    };
    iPosAppPlugin.executeProcess(request);
}

function testAttachment()

{
    
    var request = new iPosAppPlugin.RequestMessage();
    
    request.success = successProcess;
    
    request.fail = failProcess;
    
    request.action = "doctype.attachment";
    
    request.category = "ios.platform";
    
    request.messages = {
        
        "docType":"prospect"
        
    };
    
    iPosAppPlugin.executeProcess(request);
    
}



function testSwitchCase()

{
    
    var request = new iPosAppPlugin.RequestMessage();
    
    request.success = successSwitchCase;
    
    request.fail = failSwitchCase;
    
    request.action = "doctype.switchcase.test";
    
    request.category = "ios.platform";
    
    request.messages = {
        
        "docType":"prospect",
        
    age: 15
        
    };
    
    iPosAppPlugin.executeProcess(request);
    
}



/**
 
 *  testComputePDFData
 
 *
 
 *  @return
 
 */

function testComputePDFData()

{
    
    var request = new iPosAppPlugin.RequestMessage();
    
    request.success = successComputePDFData;
    
    request.fail = failComputePDFData;
    
    request.action = "pdf.compute.data";
    
    request.category = "ios.platform";
    
    
    
    /*
     
     request.messages = {
     
     "reportDataPath":"settings/templates/reports/products/termlife/cashback/converttosqlite_demo.xml"
     
     };
     
     */
    
    request.messages = {
        
        "reportDataPath":"settings/templates/reports/products/termlife/benefit/benefitReportData.xml"
        
    };
    
    
    
    iPosAppPlugin.executeProcess(request);
    
}



/**
 
 *  successComputePDFData
 
 *
 
 *  @param response
 
 *
 
 *  @return
 
 */

function successComputePDFData(response)

{
    
    alert("Compute PDF data success!");
    
    testGeneratePDF(response.messages["documentXml"]);
    
}



/**
 
 *  failComputePDFData
 
 *
 
 *  @param response
 
 *
 
 *  @return
 
 */

function failComputePDFData(response)

{
    
    alert("Compute PDF data failure!");
    
}

/**
 *  testGeneratePDF
 *
 *  @param documentXml
 *
 *  @return
 */
function testGeneratePDF(documentXml)
{
    var request = new iPosAppPlugin.RequestMessage();
    request.success = successGeneratePDF;
    request.fail = failGeneratePDF;
    request.action = "pdf.generate";
    request.category = "ios.platform";
    request.messages = {
        "documentXmlSources":
        {
            "benefit":documentXml
        },
        "reportTemplateName":"term_life_benefit_report_testing"
    };
    iPosAppPlugin.executeProcess(request);
}


/**
 *  successGeneratePDF
 *
 *  @param response
 *
 *  @return
 */
function successGeneratePDF(response)
{
    // set path for eSign
    unitTest.pdfDocumentPath = response.messages["documentPath"];

    alert("successGeneratePDF=" + response.messages["documentPath"]);
    testShowPDFFromPath(response.messages["documentPath"]);
}

/**
 
 *  testShowPDFFromPath
 
 *
 
 *  @param pdfPath
 
 *
 
 *  @return
 
 */

function testShowPDFFromPath(pdfPath)

{
    
    
    
    var request = new iPosAppPlugin.RequestMessage();
    
    request.success = successShowPDFFromPath;
    
    request.fail = failShowPDFFromPath;
    
    request.action = "show.pdf";
    
    request.category = "ios.platform";
    
    
    
    request.messages = {
        
        "documentPath":pdfPath,
        
        "documents":["doc1","doc2","doc3"]
        
    };
    
    
    
    iPosAppPlugin.executeProcess(request);
    
    
    
}



/**
 
 *  successShowPDFFromPath
 
 *
 
 *  @param response
 
 *
 
 *  @return
 
 */

function successShowPDFFromPath(response)

{
    
    alert("successShowPDFFromPath!");
    
}



/**
 
 *  failShowPDFFromPath
 
 *
 
 *  @param response
 
 *
 
 *  @return
 
 */

function failShowPDFFromPath(response)

{
    
    alert("failShowPDFFromPath!");
    
}



/**
 
 *  failGeneratePDF
 
 *
 
 *  @param response
 
 *
 
 *  @return
 
 */

function failGeneratePDF(response)

{
    
    alert("failGeneratePDF");
    
}

function testLogin()

{
    
    var request = new iPosAppPlugin.RequestMessage();
    
    request.success = successLogin;
    
    request.fail = failLogin;
    
    request.action = "auth.check.login";
    
    request.category = "ios.platform";
    
    request.messages = {
        
        "userName":"u9",
        "password":"123456"
        
    };
    
    iPosAppPlugin.executeProcess(request);
    
}

function successLogin(response) {
    alert("successLogin=" + response.messages["isValid"]);
}

function failLogin(response) {
    alert("failLogin");
}

/**
 
 *  testCheckTicket
 
 *
 
 *  @return
 
 */

function testCheckTicket()

{
    
    var request = new iPosAppPlugin.RequestMessage();
    
    request.success = successCheckTicket;
    
    request.fail = failCheckTicket;
    
    request.action = "auth.check.ticket";
    
    request.category = "ios.platform";
    
    request.messages = {
        
        "ticketNumber":"c1"
        
    };
    
    iPosAppPlugin.executeProcess(request);
    
}

/**
 
 *  successCheckTicket
 
 *
 
 *  @param response
 
 *
 
 *  @return
 
 */

function successCheckTicket(response)

{
    
    alert("successCheckTicket=" + response.messages["isValidTicket"]);
    
}



/**
 
 *  failCheckTicket
 
 *
 
 *  @param response
 
 *
 
 *  @return
 
 */

function failCheckTicket(response)

{
    
    alert("failCheckTicket");
    
}


function getDocsToSync()
{
    var request = new iPosAppPlugin.RequestMessage();
    request.success = successGetDocsToSync;
    request.fail = failGetDocsToSync;
    request.action = "doctype.getAllSyncDocs";
    request.category = "ios.platform";
    request.messages = {
        "ticketNumber":"120693"
    };
    iPosAppPlugin.executeProcess(request);
}

function syncDocuments()
{
    var request = new iPosAppPlugin.RequestMessage();
    request.success = successSyncDocs;
    request.fail = failSyncDocs;
    request.action = "doctype.syncDocuments";
    request.category = "ios.platform";
    request.messages = {
        "ticketNumber":"120693"
    };
    iPosAppPlugin.executeProcess(request);
}

function successGetDocsToSync(response) {
    var syncDocs = response.messages["driveSyncDocumentDatas"];
    
    var request = new iPosAppPlugin.RequestMessage();
    request.success = successSyncDocs;
    request.fail = failSyncDocs;
    request.action = "doctype.syncDocuments";
    request.category = "ios.platform";
    request.messages = {
        "driveSyncDocumentDatas": [syncDocs[0]]
    };
    iPosAppPlugin.executeProcess(request);
}

function failGetDocsToSync(response) {
    alert("fail get docs to sync");
    
}

function successSyncDocs(response) {
    var syncDocs = response.messages["syncDocumentResuls"];
    alert(syncDocs);
    
}

function failSyncDocs(response) {
    alert("fail sync docs");
    
}


function getCheckSyncInprogress()
{
    var request = new iPosAppPlugin.RequestMessage();
    request.success = successGetCheckSyncInprogress;
    request.fail = failGetCheckSyncInprogress;
    request.action = "doctype.checkSyncInprogress";
    request.category = "ios.platform";
    request.messages = {
        
        "ticketNumber":"120693"
        
    };
    iPosAppPlugin.executeProcess(request);
}

function successGetCheckSyncInprogress(response)

{
    
    alert("successGetCheckSyncInprogress=" + response.messages["isSyncCompleted"]);
    
}

function failGetCheckSyncInprogress(response)

{
    
    alert("failGetCheckSyncInprogress");
    
}

function resumeSync()
{
    var request = new iPosAppPlugin.RequestMessage();
    request.success = successresumeSync;
    request.fail = failresumeSync;
    request.action = "doctype.resumeSync";
    request.category = "ios.platform";
    request.messages = {
        
        "ticketNumber":"120693"
        
    };
    iPosAppPlugin.executeProcess(request);
}

function successresumeSync(response)

{
    
    var syncDocs = response.messages["syncDocumentResuls"];
    alert(syncDocs);
    
}

function failresumeSync(response)

{
    
    alert("failresumeSync");
    
}


function successProcess(response)

{
    
    alert("Success!");
    
    console.log(response);

    //display content get from backend
    if(response.messages.resourceFile){
        $('#testFindImgResource').attr('src', 'data:image/jpg;base64,' + response.messages.resourceFile);
    }
    
    var dict = response.messages['documentJson'];
    
    
    
    _responseMessage = response;
    
    var docId = response.messages['documentJson']['IposDocument']['Header']['DocInfo']['DocId']['$'];
    
    
    
    //testing only, remove later
    
    if(docId == null)
        
    {
        
        var request = new iPosAppPlugin.RequestMessage();
        
        request.success = successProcess;
        
        request.fail = failProcess;
        
        request.action = "doctype.save";
        
        request.category = "common";
        
        request.messages = {
            
            "docType":"prospect",
            
            "documentJson":dict,
            
            "computeKind":"validateDocument"
            
        };
        
        iPosAppPlugin.executeProcess(request);
        
    }
    
}



/**
 *  successImage
 *
 *  @param response
 *
 *  @return
 */
function successImage(response)
{
    alert("successImage!");
    console.log(response);
    var resourcePathsArray = response.messages['resourceBinary'];
    var resourcePaths = [resourcePathsArray[0]['FileName'], resourcePathsArray[1]['FileName'], resourcePathsArray[2]['FileName']];
    if(resourcePaths != null)
    {
        var request = new iPosAppPlugin.RequestMessage();
        request.success = successImage;
        request.fail = failImage;
        request.action = "docType.attachment.save";
        request.category = "ios.platform";
        request.messages = {
            "docType":"resource-file",
            "resourcePath":resourcePaths
        };
        iPosAppPlugin.executeProcess(request);
    }
}

function failProcess(response)
{
    alert("fail!");
    console.log(response);
}


// Test Drive

function showResult()

{
    
    console.log(_responseMessage);
    
}



//Test search process

function testSearchProcess()

{
    
    alert("Success!");
    
}


/**
 *  failImage
 *
 *  @param response
 *
 *  @return
 */
function failImage(response)
{
    alert("failImage!");
    console.log(response);
}

function successClone()

{
    
    alert("Success!");
    
}



function failClone(response)

{
    
    alert("fail!");
    
    console.log(response);
    
}



function successSwitchCase(response)

{
    
    alert("Success!");
    
}



function failSwitchCase(response)

{
    
    alert("Fail!");
    
}



/**
 
 *  jsNotification
 
 *
 
 *  @return
 
 */
// function jsNotification(command, params)
// {
// //    alert("command="+ command + " params=" + params);
// }

/**
 *  updateResources
 *
 *  @return
 */
function updateResources() {
    
    var request = new iPosAppPlugin.RequestMessage();
    request.success = successUpdateResources;
    request.fail = failUpdateResources;
    request.action = "update.resources";
    request.category = "ios.platform";
    request.messages = {};
    iPosAppPlugin.executeProcess(request);
}

/**
 *  successUpdateResources
 *
 *  @param response
 *
 *  @return
 */
function successUpdateResources(response)
{
    alert("successUpdateResources=" + response.messages["hasUpdated"]);
}

/**
 *  failUpdateResources
 *
 *  @param response
 *
 *  @return
 */
function failUpdateResources(response)
{
    alert("failUpdateResources");
}

/**
 *  sessionTimeoutNotification
 *
 *  @return
 */
function sessionTimeoutNotification()
{
    alert("sessionTimeoutNotification!");
}

/**
 *  deleteDocument
 *
 *  @return
 */
function deleteDocument() {
    
    var request = new iPosAppPlugin.RequestMessage();
    request.success = successDeleteDocument;
    request.fail = failDeleteDocument;
    request.action = "delete.document";
    request.category = "ios.platform";
    request.messages = {
        "documentId":"D0DF7BC4-A446-4B73-A793-E3E296FBA68C"
    };
    iPosAppPlugin.executeProcess(request);
}

/**
 *  successDeleteDocument
 *
 *  @param response
 *
 *  @return
 */
function successDeleteDocument(response)
{
    alert("successDeleteDocument!");
}

/**
 *  failDeleteDocument
 *
 *  @param response
 *
 *  @return
 */
function failDeleteDocument(response)
{
    alert("failDeleteDocument!");
}


function resetKeychain()
{
    var request = new iPosAppPlugin.RequestMessage();
    request.success = successResetKeychain;
    request.fail = failResetKeychain;
    request.action = "doctype.resetKeychain";
    request.category = "ios.platform";
    request.messages = {
        
        "ticketNumber":"120693"
        
    };
    iPosAppPlugin.executeProcess(request);
}

function successResetKeychain(response)

{
    
    alert("successResetKeychain=" + response.messages["isResetCompleted"]);
    
}

function failResetKeychain(response)

{
    
    alert("failResetKeychain");
    
}

/**
 *  deleteAttachment
 *
 *  @return
 */
function deleteAttachment() {
    
    var request = new iPosAppPlugin.RequestMessage();
    request.success = successDeleteAttachment;
    request.fail = failDeleteAttachment;
    request.action = "delete.attachment";
    request.category = "ios.platform";
    request.messages = {
        "documentId":"91EF5F36-67A8-4D82-A738-86A42E1C4F42",
        "resourceContentId":"86B300A4-973C-4C65-9367-BA8C2ED64A08",
        "resourceId":"0490EBAE-E623-41E8-A9B2-7D05E7C0D881"
    };
    iPosAppPlugin.executeProcess(request);
}

/**
 *  successDeleteAttachment
 *
 *  @param response
 *
 *  @return
 */
function successDeleteAttachment(response)
{
    alert("successDeleteAttachment!");
}

/**
 *  failDeleteAttachment
 *
 *  @param response
 *
 *  @return
 */
function failDeleteAttachment(response)
{
    alert("failDeleteAttachment!");
}

/**
 *  ticketInfo
 *
 *  @return
 */
function ticketInfo() {
    
    var request = new iPosAppPlugin.RequestMessage();
    request.success = successTicketInfo;
    request.fail = failTicketInfo;
    request.action = "ticket.info";
    request.category = "ios.platform";
    request.messages = {
    };
    iPosAppPlugin.executeProcess(request);
}

/**
 *  successTicketInfo
 *
 *  @param response
 *
 *  @return
 */
function successTicketInfo(response)
{
    alert("successTicketInfo!");
}

/**
 *  failTicketInfo
 *
 *  @param response
 *
 *  @return
 */
function failTicketInfo(response)
{
    alert("failTicketInfo!");
}

/**
 *  networkIndicator
 *
 *  @return
 */
function networkIndicator() {
    
    var request = new iPosAppPlugin.RequestMessage();
    request.success = successNetworkIndicator;
    request.fail = failNetworkIndicator;
    request.action = "network.indicator";
    request.category = "ios.platform";
    request.messages = {
        "notification":"1"
    };
    iPosAppPlugin.executeProcess(request);
}

/**
 *  successNetworkIndicator
 *
 *  @param response
 *
 *  @return
 */
function successNetworkIndicator(response)
{
    alert("successNetworkIndicator!");
}

/**
 *  failNetworkIndicator
 *
 *  @param response
 *
 *  @return
 */
function failNetworkIndicator(response)
{
    alert("failNetworkIndicator!");
}
