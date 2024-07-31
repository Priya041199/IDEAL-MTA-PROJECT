sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/Fragment",
	"sap/m/MessageToast",
	"com/ibs/ibsappidealpurchaseorderstatus/model/formatter",
	"sap/m/MessageBox",
	"sap/ui/export/library",
    "sap/ui/export/Spreadsheet"
],
function (Controller,JSONModel, Filter, FilterOperator, Fragment, MessageToast, formatter,MessageBox,library,Spreadsheet) {
    "use strict";
    var myJSONModel;
	var EdmType = library.EdmType;
    return Controller.extend("com.ibs.ibsappidealpurchaseorderstatus.controller.View1", {
        formatter: formatter,
        onInit: function () {
            this.getView().byId("NavButton").setVisible(false);
			this._showFragment("PurchaseOrderStatus");
			var Date1 = new Date();
			this.getView().byId("d2").setDateValue(Date1);
			var Date2 = new Date();
			Date2.setMonth(Date1.getMonth() - 1);
			this.getView().byId("d1").setDateValue(Date2);
			this.aData = this.getOwnerComponent().getModel("orderStatus");
			this.readData("/F4DivisionSet", "division");
			this.readData("/F4MaterialSet", "material");
			this.readData("/F4OrderSet", "order");
			var d1 = this.getView().byId("d1");
			d1.addDelegate({
				onAfterRendering: function () {
					d1.$().find('INPUT').attr('disabled', true).css('color', '#000');
				}
			}, d1);
			var d2 = this.getView().byId("d2");
			d2.addDelegate({
				onAfterRendering: function () {
					d2.$().find('INPUT').attr('disabled', true).css('color', '#000');
				}
			}, d2);
			var oViewModel = new sap.ui.model.json.JSONModel({
				maxDate: new Date()
			});
			this.getView().setModel(oViewModel, "viewModel");
        },
        readOrderDetails: function () {
			this.getView().setBusy(true);
			var division = this.getView().byId("DivisionDialog").getValue();
			var orderNo = this.getView().byId("OrderNumberDialog").getValue();
			var material = this.getView().byId("MaterialDialog").getValue();
			var status = this.getView().byId("multicombobox").getSelectedKeys();
			var fromDate = this.getView().byId("d1").getValue();
			var toDate = this.getView().byId("d2").getValue();
			fromDate = fromDate.substring(0, 4) + fromDate.substring(5, 7) + fromDate.substring(8, 10);
			toDate = toDate.substring(0, 4) + toDate.substring(5, 7) + toDate.substring(8, 10);
			var fArray = [];
			var sArray = [];
			var array = [];
			if (division) {
				var filter1 = new sap.ui.model.Filter("Vtext", sap.ui.model.FilterOperator.EQ, division);
				fArray.push(filter1);
			}
			if(orderNo){
				var filter = new sap.ui.model.Filter("OrderNo", sap.ui.model.FilterOperator.EQ, orderNo);
				fArray.push(filter);
			}
			if (material) {
				var filter1 = new sap.ui.model.Filter("Material", sap.ui.model.FilterOperator.EQ, material);
				fArray.push(filter1);
			}

			if(status.length>0){
				if(status.length > 1){
					for(var i=0;i<status.length;i++){
						var filter1 = new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, status[i]);
						sArray.push(filter1);
					}
				}else{
					var filter1 = new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, status[0]);
					sArray.push(filter1);
				}
			}

			var filter = new sap.ui.model.Filter("Date", sap.ui.model.FilterOperator.BT, fromDate, toDate);
			fArray.push(filter);
			
			if(status.length>0){
				var aFilters = new Filter({
					filters : sArray,
					and: false
				})

				var aFilters2 = new Filter({
					filters : fArray,
					and: true
				})
				array.push(aFilters);
				array.push(aFilters2);
			}else{
				var aFilters2 = new Filter({
					filters : fArray,
					and: true
				})
				if(aFilters2.aFilters.length > 1){
					for(var i = 0;i<aFilters2.aFilters.length;i++){
						array.push(aFilters2.aFilters[i]);
					}
				}else{
					array.push(aFilters2);
				}
			}
			myJSONModel = new JSONModel();
			var that = this;
			var sEntity = "/OrderDetailSet";
			this.aData.read(sEntity, {
				filters: array,
				success: function (Data) {
					that.getView().setBusy(false);
					that.Data = Data;
					myJSONModel.setData(Data);
					that.getView().setModel(myJSONModel, "orderDetail");
				},
				error: function (Error) {
					that.getView().setBusy(false);
					MessageBox.error("Error while reading data");
				}
			});
		},
		onPress : function(){
			this.getView().byId("exportTable").setType("Emphasized");
                var currentDate = new Date();
                // var fName = newDate + ".xlsx";

                var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "dd/MM/yy" });

                // Format the date
                var formattedDate = dateFormat.format(currentDate);
                var fName = "Purchase Order Status" + " " + formattedDate + ".xlsx";

                var aCols, oRowBinding, oSettings, oSheet, oTable, oSheet;

                if (!this._oTable) {
                    this._oTable = this.byId('idViewPO');
                }

                oTable = this._oTable;
                oRowBinding = oTable.getBinding('items');
                aCols = this.createColumnConfig();

                oSettings = {
                    workbook: {
                        columns: aCols,
                        hierarchyLevel: 'Level'
                    },

                    dataSource: oRowBinding,
                    fileName: fName,
                    worker: false
                };
                //  sap.ui.export.Spreadsheet---Directly libary used here
                oSheet = new sap.ui.export.Spreadsheet(oSettings);
                oSheet.build().
                    finally(function () {
                        oSheet.destroy();
                });
		},
		createColumnConfig: function () {
			// debugger;
			var aCols = [];

			aCols.push({
				property: 'OrderNo'
			});
			
			aCols.push({
				property: 'OrderLine'
			});

			aCols.push({
				property: 'Date',
				type: EdmType.Date
			});

			aCols.push({
				property: 'Vtext'
			});

			aCols.push({
				property: 'MaterialDesc'
			});

			aCols.push({
				property: 'OrderQuantity'
			});

			aCols.push({
				property: 'TotalValue'
			});

			aCols.push({
				property: 'Status'
			});
			
			return aCols;
		},
		readData: function (sEntity, alias) {
			var myJSONModel = new JSONModel();
			var that = this;
			this.aData.read(sEntity, {
				success: function (Data) {
					that.getView().setBusy(false);
					myJSONModel.setData(Data);
					that.getView().setModel(myJSONModel, alias);
				},
				error: function (Error) {
					that.getView().setBusy(false);
					MessageBox.error("Error while reading data");
				}
			});
		},
        _showFragment: function (sFragmentName) {
			var Content = this.getView().byId("page");
			//remove content
			Content.removeAllContent();
			//add fragment
			Content.addContent(this._getFragment(sFragmentName));
		},
		_formFragments: {

		},
		_getFragment: function (sFragmentName) {
			var oFormFragment = this._formFragments[sFragmentName];
			if (oFormFragment) {
				return oFormFragment;
			}
			oFormFragment = sap.ui.xmlfragment(this.getView().getId(), "com.ibs.ibsappidealpurchaseorderstatus.view." + sFragmentName, this);
			return this._formFragments[sFragmentName] = oFormFragment;
		},
		handleValueHelp: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			var id = this.inputId.split("-")[8];
			// this.sFilter = id.split(".")[0];
			// var sFragment = id.split(".")[1];
			// create value help dialog
			if (!this._valueHelpDialog1) {
				this._valueHelpDialog1 = sap.ui.xmlfragment("com.ibs.ibsappidealpurchaseorderstatus.view." + id,this);
				this.getView().addDependent(this._valueHelpDialog1);
			}
			this._valueHelpDialog1.open();
		},
		handleValueHelpSearchDiv: function (evt) {
			var sValue = evt.getParameter("value").toString();
			var oFilter = new Filter("Spart", sap.ui.model.FilterOperator.Contains, sValue);
			var oFilter1 = new Filter("Vtext", sap.ui.model.FilterOperator.Contains, sValue);
			var comFil = new sap.ui.model.Filter([oFilter, oFilter1]);
			evt.getSource().getBinding("items").filter(comFil);
		},
		handleValueHelpSearchMat: function (evt) {
			var sValue = evt.getParameter("value").toString();
			var oFilter = new Filter("matnr", sap.ui.model.FilterOperator.Contains, sValue);
			var oFilter1 = new Filter("maktx", sap.ui.model.FilterOperator.Contains, sValue);
			var comFil = new sap.ui.model.Filter([oFilter, oFilter1]);
			evt.getSource().getBinding("items").filter(comFil);
		},
		handleValueHelpSearchOrd: function (evt) {
			var sValue = evt.getParameter("value").toString();
			var oFilter = new Filter("Order", sap.ui.model.FilterOperator.Contains, sValue);
			evt.getSource().getBinding("items").filter([oFilter]);
		},
		handleValueHelpClose: function (evt) {
			var oSelectedItem = evt.getParameter("selectedItem");
			if (oSelectedItem) {
				var materialInput = this.byId(this.inputId);
				materialInput.setValue(oSelectedItem.getTitle());
			}
			// evt.getSource().getBinding("items").filter([]);
			this._valueHelpDialog1 = null;
		},
		manageProcessFlow: function () {
			this.DataModel = {
				"nodes": [{
					"id": "1",
					"lane": "0",
					"children": [2],
					"title": "",
					"titleAbbreviation": "",
					"state": "Positive",
					"stateText": "",
					"focused": true,
					"highlighted": false
				}, {
					"id": "2",
					"lane": "1",
					"children": [3],
					"state": "Positive",
					"stateText": "",
					"focused": false,
					"highlighted": false
				}, {
					"id": "3",
					"lane": "2",
					"children": [4],
					"state": "Positive",
					"stateText": "",
					"focused": false,
					"highlighted": false
				}, {
					"id": "4",
					"lane": "3",
					"children": [5],
					"title": "Click to check details",
					"state": "Positive",
					"stateText": "",
					"focused": false,
					"highlighted": false
				}, {
					"id": "5",
					"lane": "4",
					"title": "Click to check details",
					"state": "Positive",
					"stateText": "Dispatched",
					"focused": false,
					"highlighted": false
				}],
				"lanes": [{
					"id": "0",
					"icon": "sap-icon://order-status",
					"label": "Created",
					"position": 0
				}, {
					"id": "1",
					"icon": "sap-icon://monitor-payments",
					"label": "Blocked/Released",
					"position": 1
				}, {
					"id": "2",
					"icon": "sap-icon://payment-approval",
					"label": "Stock Allocated",
					"position": 2
				}, {
					"id": "3",
					"icon": "sap-icon://money-bills",
					"label": "Invoiced",
					"position": 3
				}, {
					"id": "4",
					"icon": "sap-icon://payment-approval",
					"label": "Dispatched",
					"position": 4
				}]
			};
			// debugger
			if (this.Status === "Released" || this.Status === "Blocked") {
				this.DataModel.nodes.length = 2;
				this.DataModel.nodes[1].children = [];
				this.DataModel.nodes[0].stateText = this.StatusBoxData.results[0].Created;
				this.DataModel.nodes[0].titleAbbreviation = "Line Item:  " + this.StatusBoxData.results[0].Posnr;
				this.DataModel.nodes[0].title = "Sales Order:  " + this.StatusBoxData.results[0].Vbeln;
				this.DataModel.nodes[1].stateText = this.StatusBoxData.results[0].Blocked;
			} else if (this.Status === "Stock Allocated") {
				this.DataModel.nodes.length = 3;
				this.DataModel.nodes[2].children = [];
				this.DataModel.nodes[0].stateText = this.StatusBoxData.results[0].Created;
				this.DataModel.nodes[0].titleAbbreviation = "Line Item:  " + this.StatusBoxData.results[0].Posnr;
				this.DataModel.nodes[0].title = "Sales Order:  " + this.StatusBoxData.results[0].Vbeln;
				this.DataModel.nodes[1].stateText = this.StatusBoxData.results[0].Blocked;

				this.DataModel.nodes[2].stateText = this.StatusBoxData.results[0].StockAllocated;
			} else if (this.Status === "Completely Invoiced") {
				this.DataModel.nodes.length = 4;
				this.DataModel.nodes[3].children = [];
				this.DataModel.nodes[0].stateText = this.StatusBoxData.results[0].Created;
				this.DataModel.nodes[0].titleAbbreviation = "Line Item:  " + this.StatusBoxData.results[0].Posnr;
				this.DataModel.nodes[0].title = "Sales Order:  " + this.StatusBoxData.results[0].Vbeln;
				this.DataModel.nodes[1].stateText = this.StatusBoxData.results[0].Blocked;

				this.DataModel.nodes[2].stateText = this.StatusBoxData.results[0].StockAllocated;

				this.DataModel.nodes[3].stateText = this.StatusBoxData.results[0].Invoiced;
				// this.DataModel.nodes[3].title = this.StatusBoxData.results[0].InvoiceNo;
			} else if (this.Status === "Dispatched") {
				this.DataModel.nodes.length = 5;
				// this.DataModel.nodes[4].children = [];
				this.DataModel.nodes[0].stateText = this.StatusBoxData.results[0].Created;
				this.DataModel.nodes[0].titleAbbreviation = "Line Item:  " + this.StatusBoxData.results[0].Posnr;
				this.DataModel.nodes[0].title = "Sales Order:  " + this.StatusBoxData.results[0].Vbeln;
				this.DataModel.nodes[1].stateText = this.StatusBoxData.results[0].Blocked;

				this.DataModel.nodes[2].stateText = this.StatusBoxData.results[0].StockAllocated;

				this.DataModel.nodes[3].stateText = this.StatusBoxData.results[0].Invoiced;
				// this.DataModel.nodes[3].title = this.StatusBoxData.results[0].InvoiceNo;

				this.DataModel.nodes[4].stateText = this.StatusBoxData.results[0].Dispatched;
			}
		},
		ShowOrderDetails: function (oEvent) {
			var context = this;
			// var oModelPf2 = new JSONModel(this.DataModel);
			// this.getView().setModel(oModelPf2);
			var OrderNo = oEvent.getSource().getSelectedItem().getBindingContext("orderDetail").getObject().OrderNo;
			var OrderLine = oEvent.getSource().getSelectedItem().getBindingContext("orderDetail").getObject().OrderLine;
			this.Status = oEvent.getSource().getSelectedItem().getBindingContext("orderDetail").getObject().Status;

			var myJSONModel = new JSONModel();
			var that = this;
			var filter1 = new sap.ui.model.Filter("Vbeln", sap.ui.model.FilterOperator.EQ, OrderNo);
			var filter2 = new sap.ui.model.Filter("Posnr", sap.ui.model.FilterOperator.EQ, OrderLine);
			this.aData.read("/StatusBoxSet", {
				filters: [filter1, filter2],
				success: function (Data) {
					// debugger;
					that.StatusBoxData = Data;
					that.manageProcessFlow();
					var oModelPf2 = new JSONModel(that.DataModel);
					that.getView().setModel(oModelPf2);
					oModelPf2 = new JSONModel(Data);
					that.getView().setModel(oModelPf2, "DispatchedModel");

					var oView = that.getView();
					if (!that.byId("dialog")) {
						Fragment.load({
							id: oView.getId(),
							name: "com.ibs.ibsappidealpurchaseorderstatus.view.OrderProcessFlow",
							controller: context
						}).then(function (oDialog) {
							oView.addDependent(oDialog);
							oDialog.open();
						});
					} else {
						that.getView().byId("dialog").open();
					}
				},
				error: function (Error) {
					that.getView().setBusy(false);
					MessageBox.error("Error while reading data");
				}
			});
		},
		onDetailCancel: function () {
			// var myJSONModel = new JSONModel();
			// myJSONModel.setData(this.Data);
			// this.getView().setModel(myJSONModel, "orderDetail");

			this.getView().byId("idViewPO").removeSelections(true);
			this.getView().byId("dialog").close();
		},
		onDetailCancel1: function () {
			this.getView().byId("dialog1").close();
		},
		onNodePress: function (oEvt) {
			var sNode = oEvt.getParameters().getNodeId();
			if (sNode === "1") {
				var oView = this.getView();
				if (!this.byId("dialog1")) {
					Fragment.load({
						id: oView.getId(),
						name: "com.ibs.ibsappidealpurchaseorderstatus.view.NodePopOver",
						controller: this
					}).then(function (oDialog) {
						oView.addDependent(oDialog);
						oDialog.open();
					});
				} else {
					this.getView().byId("dialog1").open();
				}
				this.getView().byId("idSimpleForm1").setVisible(true);
				this.getView().byId("idSimpleForm2").setVisible(false);
				this.getView().byId("idSimpleForm3").setVisible(false);
				this.getView().byId("idSalesOrder").setText(oEvt.getParameters().getTitle());
				this.getView().byId("idLineItem").setText(oEvt.getParameters().getTitleAbbreviation());
				this.getView().byId("idStatus").setText("Status: " + oEvt.getParameters().getStateText());
			} else if (sNode === "4") {
				var oView = this.getView();
				if (!this.byId("dialog1")) {
					Fragment.load({
						id: oView.getId(),
						name: "com.ibs.ibsappidealpurchaseorderstatus.view.NodePopOver",
						controller: this
					}).then(function (oDialog) {
						oView.addDependent(oDialog);
						oDialog.open();
					});
				} else {
					this.getView().byId("dialog1").open();
				}
				this.getView().byId("idSimpleForm2").setVisible(true);
				this.getView().byId("idSimpleForm1").setVisible(false);
				this.getView().byId("idSimpleForm3").setVisible(false);
				this.getView().byId("idSalesOrder1").setText(this.StatusBoxData.results[0].InvoiceNo + "(Date: " + this.StatusBoxData.results[0].InvoiceNo +
					")");
				this.getView().byId("idStatus1").setText("Status: " + oEvt.getParameters().getStateText());
			} else if (sNode === "5") {
				var oView = this.getView();
				if (!this.byId("dialog1")) {
					Fragment.load({
						id: oView.getId(),
						name: "com.ibs.ibsappidealpurchaseorderstatus.view.NodePopOver",
						controller: this
					}).then(function (oDialog) {
						oView.addDependent(oDialog);
						oDialog.open();
					});
				} else {
					this.getView().byId("dialog1").open();
				}
				this.getView().byId("idSimpleForm3").setVisible(true);
				this.getView().byId("idSimpleForm1").setVisible(false);
				this.getView().byId("idSimpleForm2").setVisible(false);
				// this.getView().byId("idSalesOrder").setText(oEvt.getParameters().getTitle());
				// this.getView().byId("idStatus1").setText(oEvt.getParameters().getStateText());
			}
		},
		onNavBack: function () {
			this._showFragment("PurchaseOrderStatus");
			this.getView().byId("NavButton").setVisible(false);
		},
		onSubmit: function () {
			this.readOrderDetails();
			this.getView().byId("selectBox").setVisible(true);
		},
		onClear: function () {
			var Date1 = new Date();
			this.getView().byId("d2").setDateValue(Date1);
			var Date2 = new Date();
			Date2.setMonth(Date1.getMonth() - 1);
			this.getView().byId("d1").setDateValue(Date2);
			this.getView().byId("OrderNumberDialog").setValue("");
			this.getView().byId("DivisionDialog").setValue("");
			this.getView().byId("MaterialDialog").setValue("");
			this.getView().byId("multicombobox").removeSelectedKeys();
			this.getView().byId("multicombobox").removeAllSelectedItems();
			this.getView().byId("selectBox").setVisible(false);
			
			myJSONModel.setData();
			// this.readOrderDetails();
		}   
    });
});
