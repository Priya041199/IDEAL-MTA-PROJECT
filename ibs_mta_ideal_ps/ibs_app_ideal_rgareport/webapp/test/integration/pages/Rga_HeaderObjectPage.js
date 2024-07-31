sap.ui.define(['sap/fe/test/ObjectPage'], function(ObjectPage) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ObjectPage(
        {
            appId: 'com.ibs.ibsappidealrgareport',
            componentId: 'Rga_HeaderObjectPage',
            contextPath: '/Rga_Header'
        },
        CustomPageDefinitions
    );
});