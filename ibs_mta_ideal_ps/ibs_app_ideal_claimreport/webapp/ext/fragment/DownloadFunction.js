sap.ui.define([
    "sap/m/MessageToast",
    "com/ibs/ibsappidealclaimreport/model/down"
], function(MessageToast,down) {
    'use strict';

    return {
        onPress: function(oEvent) {
            // debugger;
            // MessageToast.show("Custom handler invoked.");
            // var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
            // var appPath = appId.replaceAll(".", "/");
            // var appModulePath = jQuery.sap.getModulePath(appPath);
            var url = oEvent.getSource().mAggregations.tooltip;
            var appModulePath = ".";
            var path = url;
            
			$.ajax({
				url: path,
				type: 'GET',
				contentType: 'application/json',
				success: function (data, responce) {
					// that.fileType(iDocId, data);
                    var fileData = oEvent.getSource().getBindingContext().getObject();
					// context.downloadFileContent('text/plain', 1,'CLAIM REQUEST PAYLOAD.txt', 'text/plain', data);
					    download("data:application/octet-stream;base64," + data, fileData.FILE_NAME, fileData.FILE_MIMETYPE);
        var HttpRequest = new XMLHttpRequest();
        // x.open("GET", "http://danml.com/wave2.gif", true);
        HttpRequest.responseType = 'blob';
        HttpRequest.onload = function (e) {
            download(HttpRequest.response, fileName, mimeType);
        }
        HttpRequest.send();
				},
				error: function (error) {
					BusyIndicator.hide();
					var oXMLMsg, oXML;
          // that.errorLogCreation(e.responseText, e.statusCode, null, that._sUserID);
					if (that.isValidJsonString(error.responseText)) {
						oXML = JSON.parse(error.responseText);
						oXMLMsg = oXML.error["message"];
					} else {
						oXMLMsg = error.responseText;
					}
					MessageBox.error(oXMLMsg);
				}
			});
        }
    };
});
