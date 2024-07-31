sap.ui.define(['sap/fe/test/ListReport'], function(ListReport) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ListReport(
        {
            appId: 'com.ibs.ibsappidealrgareport',
            componentId: 'Rga_HeaderList',
            contextPath: '/Rga_Header'
        },
        CustomPageDefinitions
    );
});