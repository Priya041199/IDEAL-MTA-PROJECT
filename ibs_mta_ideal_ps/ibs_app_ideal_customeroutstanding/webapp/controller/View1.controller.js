sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
	"sap/m/TablePersoController",
	'./DemoPersoService',
	"com/ibs/ibsappidealcustomeroutstanding/model/formatter",
	"sap/m/MessageToast",
	"sap/ui/export/Spreadsheet",
	'sap/ui/core/util/Export',
	'sap/ui/core/util/ExportTypeCSV',
	'sap/m/MessageBox',
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
],
function (Controller, JSONModel, TablePersoController, DemoPersoService, formatter, MessageToast, Spreadsheet, Export, ExportTypeCSV, MessageBox,Filter,FilterOperator) {
    "use strict";
    var myJSONModel;
    return Controller.extend("com.ibs.ibsappidealcustomeroutstanding.controller.View1", {
        formatter: formatter,
        onInit: function () {
            this.ind = "X";
			// this.data = this.getView().byId("tableid").clone();
			
			//date picker 
			var OpenDate = this.getView().byId("OpenDate");
			OpenDate.addDelegate({
				onAfterRendering: function () {
					OpenDate.$().find('INPUT').attr('disabled', true).css('color', '#000');
				}
			}, OpenDate);
			
			var fdate = this.getView().byId("fdate");
			fdate.addDelegate({
				onAfterRendering: function () {
					fdate.$().find('INPUT').attr('disabled', true).css('color', '#000');
				}
			}, fdate);
        },
        onSubmit: function (evt) {
			debugger;
			if (this.ind === "X") {
				this.ind = "";
				return;
			}
			var status = this.getView().byId("status").getSelectedKey();
			myJSONModel = new JSONModel();
			myJSONModel.setData([]);
			this.getView().setModel(myJSONModel);
			var that = this;
			var Kunnr = "0001100013";
			var oDataModel = this.getOwnerComponent().getModel();
			this.oModel = oDataModel;
			var type = this.getView().byId("type").getSelectedKeys();
			var date = this.getView().byId("OpenDate").getValue();
			var clrDate = this.getView().byId("fdate").getValue();
			this.from = new Date();
			this.to = new Date();
			this.from.setFullYear(date.substring(0, 4), date.substring(5, 7) - 1, date.substring(8, 10));
			this.to.setFullYear(clrDate.substring(0, 4), clrDate.substring(5, 7) - 1, clrDate.substring(8, 10));
			var aFilter = [];
			var sArray =[];
			var fArray =[];
			if (status === "O") {
				if (date === "") {
					MessageBox.warning("Please select 'Open On Key Date'");
				}else if(type.length === 0){
					MessageBox.warning("Please select Item Type");
				}else {
					//var aFilter = [];
					that.getView().setBusy(true);
					if(type.length>0){
						for(var i=0;i<type.length;i++){
							var filter1 = new sap.ui.model.Filter("Type", sap.ui.model.FilterOperator.EQ, type[i]);
							sArray.push(filter1);
						}
					}else{
						var filter1 = new sap.ui.model.Filter("Type", sap.ui.model.FilterOperator.EQ, type[0]);
						sArray.push(filter1);
					}

					var myFilter = new sap.ui.model.Filter("Kunnr", sap.ui.model.FilterOperator.EQ, Kunnr);
					// var myFilter2 = new sap.ui.model.Filter("Type", sap.ui.model.FilterOperator.EQ, type);
					var myFilter3 = new sap.ui.model.Filter("OpenDate", sap.ui.model.FilterOperator.EQ, date);
					var myFilter4 = new sap.ui.model.Filter("ProcessInd", sap.ui.model.FilterOperator.EQ, status);
					fArray.push(myFilter);
					// fArray.push(myFilter2);
					fArray.push(myFilter3);
					fArray.push(myFilter4);

					if(type.length>0){
						var aFilters = new Filter({
							filters : sArray,
							and: false
						})
		
						var aFilters2 = new Filter({
							filters : fArray,
							and: true
						})

						aFilter.push(aFilters);
						aFilter.push(aFilters2);
					}else{
						var aFilters2 = new Filter({
							filters : fArray,
							and: true
						})
						aFilter.push(aFilters2);
					}
				}
			} else if (status === "C") {
				// if (date === "") {
				// 	MessageToast.show("Select Open On Key Date");
				// } 
				/*if (clrDate === "") {
					MessageToast.show("Select Cleared Date");
				} */
				// else
				// if (this.from.getTime() > this.to.getTime()) {
				// 	MessageToast.show("Open on Key  date should be less than Clearing date.");
				// } else
				// {
				if(type.length === 0){
					MessageBox.warning("Please select Item Type");
				}
				else{
					if (clrDate !== "") {
					that.getView().setBusy(true);
					if(type.length>0){
						for(var i=0;i<type.length;i++){
							var filter1 = new sap.ui.model.Filter("Type", sap.ui.model.FilterOperator.EQ, type[i]);
							sArray.push(filter1);
						}
					}else{
						var filter1 = new sap.ui.model.Filter("Type", sap.ui.model.FilterOperator.EQ, type[0]);
						sArray.push(filter1);
					}
					var filtrOb = new sap.ui.model.Filter("Kunnr", sap.ui.model.FilterOperator.EQ, Kunnr);
					// var filtrOb1 = new sap.ui.model.Filter("Type", sap.ui.model.FilterOperator.EQ, type);
					//	var filtrOb2 = new sap.ui.model.Filter("OpenDate", sap.ui.model.FilterOperator.EQ, date);
					var filtrOb3 = new sap.ui.model.Filter("Augdt", sap.ui.model.FilterOperator.EQ, clrDate);
					var filtrOb4 = new sap.ui.model.Filter("ProcessInd", sap.ui.model.FilterOperator.EQ, status);

					fArray.push(filtrOb);
					fArray.push(filtrOb4);
					// aFilter.push(filtrOb1);
					//	aFilter.push(filtrOb2);
					fArray.push(filtrOb3);

					if(type.length>0){
						var aFilters = new Filter({
							filters : sArray,
							and: false
						})
		
						var aFilters2 = new Filter({
							filters : fArray,
							and: true
						})

						aFilter.push(aFilters);
						aFilter.push(aFilters2);
					}else{
						var aFilters2 = new Filter({
							filters : fArray,
							and: true
						})
						aFilter.push(aFilters2);
					}
					
				} else {
					that.getView().setBusy(true);
					if(type.length>0){
						for(var i=0;i<type.length;i++){
							var filter1 = new sap.ui.model.Filter("Type", sap.ui.model.FilterOperator.EQ, type[i]);
							sArray.push(filter1);
						}
					}else{
						var filter1 = new sap.ui.model.Filter("Type", sap.ui.model.FilterOperator.EQ, type[0]);
						sArray.push(filter1);
					}
					var filtrOb = new sap.ui.model.Filter("Kunnr", sap.ui.model.FilterOperator.EQ, Kunnr);
					// var filtrOb1 = new sap.ui.model.Filter("Type", sap.ui.model.FilterOperator.EQ, type);
					var filtrOb4 = new sap.ui.model.Filter("ProcessInd", sap.ui.model.FilterOperator.EQ, status);
					fArray.push(filtrOb);
					fArray.push(filtrOb4);
					// aFilter.push(filtrOb1);

					if(type.length>0){
						var aFilters = new Filter({
							filters : sArray,
							and: false
						})
		
						var aFilters2 = new Filter({
							filters : fArray,
							and: true
						})

						aFilter.push(aFilters);
						aFilter.push(aFilters2);
					}else{
						var aFilters2 = new Filter({
							filters : fArray,
							and: true
						})
						aFilter.push(aFilters2);
					}
				}
				}
			} else if (status === "A") {
				var operation = this.getView().byId("range").oPropagatedProperties.oModels.fi1t3rM0d31.oData.ProcessDate.conditionTypeInfo.data.operation;
				var from = this.getView().byId("range").oPropagatedProperties.oModels.fi1t3rM0d31.oData.ProcessDate.conditionTypeInfo.data.value1;
				var to = this.getView().byId("range").oPropagatedProperties.oModels.fi1t3rM0d31.oData.ProcessDate.conditionTypeInfo.data.value2;

				if (operation.startsWith("F")) {
					if (from === null) {
						MessageToast.show("Select From Date");
					} else {
						that.getView().setBusy(true);
						var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
							pattern: "yyyy-MM-ddTHH:mm:ss"
						});
						
						var fromDateFormatted = dateFormat.format(from);

						var filtrObject = new sap.ui.model.Filter("Kunnr", sap.ui.model.FilterOperator.EQ, Kunnr);
						var filtrObject1 = new sap.ui.model.Filter("Type", sap.ui.model.FilterOperator.EQ, type);
						var filtrObject2 = new sap.ui.model.Filter("ProcessInd", sap.ui.model.FilterOperator.EQ, status);
						var filtrObject3 = new sap.ui.model.Filter("ProcessDate", sap.ui.model.FilterOperator.EQ, fromDateFormatted);
						// var filtrObject4 = new sap.ui.model.Filter("ProcessDate", sap.ui.model.FilterOperator.GE, fromDateFormatted);
						aFilter.push(filtrObject);
						aFilter.push(filtrObject1);
						aFilter.push(filtrObject2);
						aFilter.push(filtrObject3);
					}
				} else
				if (operation.startsWith("D")) {
					if(operation === "DATERANGES"){
						if ((from === null) && (to === null)) {
							MessageBox.warning("Please specify a date range");
						}else if(type.length === 0){
							MessageBox.warning("Please select Item Type");
						}else {
							that.getView().setBusy(true);
							var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
								pattern: "yyyy-MM-ddTHH:mm:ss"
							});
	
							var fromDateFormatted = dateFormat.format(from);
							var dateFormat1 = sap.ui.core.format.DateFormat.getDateInstance({
								pattern: "yyyy-MM-ddTHH:mm:ss"
							});
	
							var toDateFormatted = dateFormat1.format(to);
							if(type.length > 0){
								for(var i=0;i<type.length;i++){
									var filter1 = new sap.ui.model.Filter("Type", sap.ui.model.FilterOperator.EQ, type[i]);
									sArray.push(filter1);
								}
							}else{
								var filter1 = new sap.ui.model.Filter("Type", sap.ui.model.FilterOperator.EQ, type[0]);
								sArray.push(filter1);
							}
	
	
							var filtrObject = new sap.ui.model.Filter("Kunnr", sap.ui.model.FilterOperator.EQ, Kunnr);
							// var filtrObject1 = new sap.ui.model.Filter("Type", sap.ui.model.FilterOperator.EQ, type);
							var filtrObject2 = new sap.ui.model.Filter("ProcessInd", sap.ui.model.FilterOperator.EQ, status);
							if(toDateFormatted === ""){
								var filtrObject3 = new sap.ui.model.Filter("ProcessDate", sap.ui.model.FilterOperator.EQ, fromDateFormatted);
							}else{
								var filtrObject3 = new sap.ui.model.Filter("ProcessDate", sap.ui.model.FilterOperator.BT, fromDateFormatted, toDateFormatted);
							}
							fArray.push(filtrObject);
							// aFilter.push(filtrObject1);
							fArray.push(filtrObject2);
							fArray.push(filtrObject3);
	
							if(type.length>0){
								var aFilters = new Filter({
									filters : sArray,
									and: false
								})
				
								var aFilters2 = new Filter({
									filters : fArray,
									and: true
								})
		
								aFilter.push(aFilters);
								aFilter.push(aFilters2);
							}else{
								var aFilters2 = new Filter({
									filters : fArray,
									and: true
								})
								aFilter.push(aFilters2);
							}
						}
					}else if(operation === "DATETOYEAR"){
						var from = this.getView().byId("range").oPropagatedProperties.oModels.fi1t3rM0d31.oData.ProcessDate.ranges[0].value1;
				var to = this.getView().byId("range").oPropagatedProperties.oModels.fi1t3rM0d31.oData.ProcessDate.ranges[0].value2;

				if ((from === null) && (to === null)) {
					MessageBox.warning("Please specify a date range");
				}else if(type.length === 0){
					MessageBox.warning("Please select Item Type");
				}else {
					that.getView().setBusy(true);
					var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
						pattern: "yyyy-MM-ddTHH:mm:ss"
					});

					var fromDateFormatted = dateFormat.format(from);
					var dateFormat1 = sap.ui.core.format.DateFormat.getDateInstance({
						pattern: "yyyy-MM-ddTHH:mm:ss"
					});

					var toDateFormatted = dateFormat1.format(to);
					if(type.length > 0){
						for(var i=0;i<type.length;i++){
							var filter1 = new sap.ui.model.Filter("Type", sap.ui.model.FilterOperator.EQ, type[i]);
							sArray.push(filter1);
						}
					}else{
						var filter1 = new sap.ui.model.Filter("Type", sap.ui.model.FilterOperator.EQ, type[0]);
						sArray.push(filter1);
					}


					var filtrObject = new sap.ui.model.Filter("Kunnr", sap.ui.model.FilterOperator.EQ, Kunnr);
					// var filtrObject1 = new sap.ui.model.Filter("Type", sap.ui.model.FilterOperator.EQ, type);
					var filtrObject2 = new sap.ui.model.Filter("ProcessInd", sap.ui.model.FilterOperator.EQ, status);
					var filtrObject3 = new sap.ui.model.Filter("ProcessDate", sap.ui.model.FilterOperator.BT, fromDateFormatted, toDateFormatted);
					fArray.push(filtrObject);
					// aFilter.push(filtrObject1);
					fArray.push(filtrObject2);
					fArray.push(filtrObject3);

					if(type.length>0){
						var aFilters = new Filter({
							filters : sArray,
							and: false
						})
		
						var aFilters2 = new Filter({
							filters : fArray,
							and: true
						})

						aFilter.push(aFilters);
						aFilter.push(aFilters2);
					}else{
						var aFilters2 = new Filter({
							filters : fArray,
							and: true
						})
						aFilter.push(aFilters2);
					}
				}
					}
					
				}else if(operation.startsWith("Y")){
					var from = this.getView().byId("range").oPropagatedProperties.oModels.fi1t3rM0d31.oData.ProcessDate.ranges[0].value1;
				var to = this.getView().byId("range").oPropagatedProperties.oModels.fi1t3rM0d31.oData.ProcessDate.ranges[0].value2;

				if ((from === null) && (to === null)) {
					MessageBox.warning("Please specify a date range");
				}else if(type.length === 0){
					MessageBox.warning("Please select Item Type");
				}else {
					that.getView().setBusy(true);
					var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
						pattern: "yyyy-MM-ddTHH:mm:ss"
					});

					var fromDateFormatted = dateFormat.format(from);
					var dateFormat1 = sap.ui.core.format.DateFormat.getDateInstance({
						pattern: "yyyy-MM-ddTHH:mm:ss"
					});

					var toDateFormatted = dateFormat1.format(to);
					if(type.length > 0){
						for(var i=0;i<type.length;i++){
							var filter1 = new sap.ui.model.Filter("Type", sap.ui.model.FilterOperator.EQ, type[i]);
							sArray.push(filter1);
						}
					}else{
						var filter1 = new sap.ui.model.Filter("Type", sap.ui.model.FilterOperator.EQ, type[0]);
						sArray.push(filter1);
					}


					var filtrObject = new sap.ui.model.Filter("Kunnr", sap.ui.model.FilterOperator.EQ, Kunnr);
					// var filtrObject1 = new sap.ui.model.Filter("Type", sap.ui.model.FilterOperator.EQ, type);
					var filtrObject2 = new sap.ui.model.Filter("ProcessInd", sap.ui.model.FilterOperator.EQ, status);
					var filtrObject3 = new sap.ui.model.Filter("ProcessDate", sap.ui.model.FilterOperator.BT, fromDateFormatted, toDateFormatted);
					fArray.push(filtrObject);
					// aFilter.push(filtrObject1);
					fArray.push(filtrObject2);
					fArray.push(filtrObject3);

					if(type.length>0){
						var aFilters = new Filter({
							filters : sArray,
							and: false
						})
		
						var aFilters2 = new Filter({
							filters : fArray,
							and: true
						})

						aFilter.push(aFilters);
						aFilter.push(aFilters2);
					}else{
						var aFilters2 = new Filter({
							filters : fArray,
							and: true
						})
						aFilter.push(aFilters2);
					}
				}
				}
				// } else {
				// that.getView().setBusy(true);
				// var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				// 	pattern: "yyyy-MM-ddTHH:mm:ss"
				// });
				// var fromDateFormatted = dateFormat.format(from);
				// var dateFormat1 = sap.ui.core.format.DateFormat.getDateInstance({
				// 	pattern: "yyyy-MM-ddTHH:mm:ss"
				// });
				// var toDateFormatted = dateFormat1.format(to);
				// var filtrObject = new sap.ui.model.Filter("Kunnr", sap.ui.model.FilterOperator.EQ, Kunnr);
				// var filtrObject1 = new sap.ui.model.Filter("Type", sap.ui.model.FilterOperator.EQ, type);
				// var filtrObject2 = new sap.ui.model.Filter("ProcessInd", sap.ui.model.FilterOperator.EQ, status);
				// var filtrObject3 = new sap.ui.model.Filter("ProcessDate", sap.ui.model.FilterOperator.BT, fromDateFormatted, toDateFormatted);
				// // var filtrObject4 = new sap.ui.model.Filter("ProcessDate", sap.ui.model.FilterOperator.GE, fromDateFormatted);
				// aFilter.push(filtrObject);
				// aFilter.push(filtrObject1);
				// aFilter.push(filtrObject2);
				// aFilter.push(filtrObject3);
				// aFilter.push(filtrObject4);

			}

			var table = this.getView().byId("tableid");
			// table.setModel(myJSONModel);
			// var itemPath = "/CustOutstandingSet";
			// table.bindRows({
			// 	path: itemPath,
			// 	filters : aFilter,
			// 	template: that.data
			// });
			// return new Promise(function (resolve, reject) {
			oDataModel.read("/CustOutstandingSet", {
				filters: aFilter,
				success: function (Data, response) {
					// resolve(Data);
					// console.log(Data);
					myJSONModel = new JSONModel();
					that.getView().setBusy(false);
					myJSONModel.setData(Data);
					that.getView().setModel(myJSONModel, "mock");
					that.getView().byId("tableid").setVisibleRowCount(Data.results.length);
					// table.getModel("mock").refresh(true);
					table.setModel(myJSONModel);
					var itemPath = "/results";
					table.bindRows({
						path: itemPath
							//	filters : aFilter,
							//	template: that.data
					});
					// table.sort(table.getColumns()[0]);
					// var RefoModel = table.getModel();
					// RefoModel.refresh(true);
					// var a = that.getView().getModel("mock");
					// console.log(a);
				},
				error: function (Error) {
					// reject(Error);
					that.getView().setBusy(false);
					sap.m.MessageBox.error("Error while reading data");
				}
			});
			// }
		},
		onClear : function(){
			debugger;
			var status = this.getView().byId("status").getSelectedKey();
			if (status === "O") {
				this.getView().byId("OpenDate").setValue("");
			}else if(status === "C"){
				if(this.getView().byId("fdate").getValue() != ""){
					this.getView().byId("fdate").setValue("");
				}
			}
			else if(status === "A"){
				if(this.getView().byId("range").getValue() != ""){
					this.getView().byId("range").setValue("");
				}
			}
			myJSONModel.setData();
		},
		/*	_createTable: function () {
				debugger
				var aColumns = [];
				//tbl.getColumns();
				var items = this.byId("tableid").getColumns();
				for (var i = 0; i < items.length; i++) {
					if (items[i].getVisible() === true) {
						var property = items[i].mAggregations.template.mBindingInfos.text;
						if (property === undefined) {
							property = items[i].mAggregations.template.mBindingInfos.src;
						}
						var obj = {
							label: items[i].mAggregations.label.getText(),
							property: property.parts[0].path
						}
						aColumns.push(obj);
					}
				}

				return aColumns;
			},*/

		onExportData: function (evt) {
			var oSettings, oSheet;
			var tbl = this.getView().byId("tableid");
			var aData = tbl.getBinding("rows").getModel().oData.results;
			//	aColumns = this._createTable();
			var aColumns = [];
			//tbl.getColumns();
			var items = this.byId("tableid").getColumns();
			for (var i = 0; i < items.length; i++) {
				if (items[i].getVisible() === true) {
					// var date = items[i].oPropagatedProperties.oModels.mock.oData.results[i];
					var info = items[i].mAggregations.template.mBindingInfos;
					var property = info.text;
					if (property === undefined) {
						property = info.src;
					}
					var obj = {
						label: items[i].mAggregations.label.getText(),
						property: property.parts[0].path,
						textAlign: 'center'
					}
					var objDate = items[i].mAggregations.label.getText();
					if (objDate === "Document Date" || objDate === "Posting Date" || objDate === "Net Due Date" || objDate === "Date" || objDate ===
						"Baseline Date") {
						obj.type = 'date';
						// obj.format = 'dd.MM.yyyy';
						// obj.width = 10;
					}
					if (objDate === "Clearing Status ") {
						obj.type = 'enumeration';
						obj.valueMap = {
							false: 'Not Cleared',
							true: 'Cleared'
						}
					}
					if (objDate === "Due Net (Symbol)") {
						obj.type = 'enumeration';
						obj.valueMap = {
							false: 'Over due',
							true: 'No due'
						}
					}

					aColumns.push(obj);

				}
			}
			oSettings = {
				workbook: {
					columns: aColumns,
					hierarchyLevel: 'Level'
				},
				dataSource: aData,
				worker: false // We need to disable worker because we are using a MockServer as OData Service
			};
			oSheet = new Spreadsheet(oSettings);
			oSheet.build().finally(function () {
				oSheet.destroy();
			});

			// var oExport = new Export({

			// 	// Type that will be used to generate the content. Own ExportType's can be created to support other formats
			// 	exportType : new ExportTypeCSV({
			// 		separatorChar : ";"
			// 	}),

			// 	// Pass in the model created above
			// 	models : this.getView().getModel(),

			// 	// binding information for the rows aggregation
			// 	rows : {
			// 		path : "/results"
			// 	},

			// 	// column definitions with column name and binding info for the content

			// 	columns : [{
			// 		name : "Document Date",
			// 		template : {
			// 			content : "{Bldat}"
			// 		}
			// 	}, {
			// 		name : "Document No.",
			// 		template : {
			// 			content : "{Belnr}"
			// 		}
			// 	}, {
			// 		name : "Document Type",
			// 		template : {
			// 			content : "{Blart}"
			// 		}
			// 	}, {
			// 		name : "Assignment",
			// 		template : {
			// 			content : "{Zuonr}"
			// 		}
			// 	}, {
			// 		name : "Special G/L",
			// 		template : {
			// 			content : "{Umskz}"
			// 		}
			// 	}, {
			// 		name : "Clearing Status",
			// 		template : {
			// 			content : "{Xaugp}"
			// 		}
			// 	},
			// 	{
			// 		name : "Due Net(Symbol)",
			// 		template : {
			// 			content : "{Xduen}"
			// 		}
			// 	},
			// 	{
			// 		name : "Amount",
			// 		template : {
			// 			content : "{Dmshb}"
			// 		}
			// 	},
			// 	{
			// 		name : "Clearing Entry",
			// 		template : {
			// 			content : "{Augbl}"
			// 		}
			// 	}
			// 	]
			// });

			// // download exported file
			// oExport.saveFile().catch(function(oError) {
			// 	MessageToast.show("Error when downloading data. Browser might not be supported!\n\n" + oError);
			// }).then(function() {
			// 	oExport.destroy();
			// });
		},
		// onChange: function () {
		// 	var that = this;
		// 	that._oValueHelpDialog.close();
		// 	// this.getView().byId("dialog").destroy();
		// 	var from = sap.ui.getCore().byId("fromdate").getValue();
		// 	var to = sap.ui.getCore().byId("dateToId").getValue();
		// 	that.byId("dateRangeId").setValue(from + " , " + to);
		// 	// that.getView().byId("fromdate").destroy();
		// 	// that.getView().byId("dateToId").destroy();
		// 	// that._oValueHelpDialog.destroy();
		// },
		// OpenFragment: function () {
		// 	this._oValueHelpDialog = sap.ui.xmlfragment("com.cm.customerportal.CustomerOutstanding.view.Range", this);
		// 	// this.getView().addDependent(this._oValueHelpDialog);
		// 	this._oValueHelpDialog.open();
		// 	this.getView().byId("fromdate").destroy();
		// 	this.getView().byId("dateToId").destroy();
		// 	// var that = this;
		// 	// that.getView().byId("dialog").destroy();
		// },
		onChangeOfStatus: function () {
			var status = this.getView().byId("status");
			var myJSONModel = new JSONModel();
			myJSONModel.setData([]);
			this.getView().setModel(myJSONModel, "mock");
			var table = this.getView().byId("tableid");
			table.setModel(myJSONModel);
			table.bindRows("/results");
			if (status.getSelectedKey() === "O") {
				this.getView().byId("type").setSelectedKeys("R");
				this.getView().byId("Openlabel").setVisible(true);
				this.getView().byId("OpenDate").setVisible(true);
				this.getView().byId("flabel").setVisible(false);
				this.getView().byId("fdate").setVisible(false);
				this.getView().byId("range").setVisible(false);
				this.getView().byId("OpenDate").setValue("");
				this.getView().byId("fdate").setValue("");
			} else if (status.getSelectedKey() === "C") {
				this.getView().byId("type").setSelectedKeys("R");
				this.getView().byId("OpenDate").setValue("");
				this.getView().byId("Openlabel").setVisible(false);
				this.getView().byId("OpenDate").setVisible(false);
				this.getView().byId("flabel").setVisible(true);
				this.getView().byId("fdate").setVisible(true);
				this.getView().byId("range").setVisible(false);
			} else if (status.getSelectedKey() === "A") {
				this.getView().byId("fdate").setValue("");
				this.getView().byId("OpenDate").setValue("");
				this.getView().byId("type").setSelectedKeys("R");
				this.getView().byId("range").setVisible(true);
				this.getView().byId("flabel").setVisible(false);
				this.getView().byId("fdate").setVisible(false);
				this.getView().byId("Openlabel").setVisible(false);
				this.getView().byId("OpenDate").setVisible(false);
			}
		}
    });
});
