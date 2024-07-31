sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'com/ibs/ibsappidealrgareport/test/integration/FirstJourney',
		'com/ibs/ibsappidealrgareport/test/integration/pages/Rga_HeaderList',
		'com/ibs/ibsappidealrgareport/test/integration/pages/Rga_HeaderObjectPage'
    ],
    function(JourneyRunner, opaJourney, Rga_HeaderList, Rga_HeaderObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('com/ibs/ibsappidealrgareport') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheRga_HeaderList: Rga_HeaderList,
					onTheRga_HeaderObjectPage: Rga_HeaderObjectPage
                }
            },
            opaJourney.run
        );
    }
);