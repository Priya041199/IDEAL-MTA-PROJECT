sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'com/ibs/ibsappidealapprovalhierarchy/test/integration/FirstJourney',
		'com/ibs/ibsappidealapprovalhierarchy/test/integration/pages/MasterEntityAndTypeList',
		'com/ibs/ibsappidealapprovalhierarchy/test/integration/pages/MasterEntityAndTypeObjectPage'
    ],
    function(JourneyRunner, opaJourney, MasterEntityAndTypeList, MasterEntityAndTypeObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('com/ibs/ibsappidealapprovalhierarchy') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheMasterEntityAndTypeList: MasterEntityAndTypeList,
					onTheMasterEntityAndTypeObjectPage: MasterEntityAndTypeObjectPage
                }
            },
            opaJourney.run
        );
    }
);