sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'com/ibs/ibsappidealclaimreport/test/integration/FirstJourney',
		'com/ibs/ibsappidealclaimreport/test/integration/pages/ClaimHeaderList',
		'com/ibs/ibsappidealclaimreport/test/integration/pages/ClaimHeaderObjectPage'
    ],
    function(JourneyRunner, opaJourney, ClaimHeaderList, ClaimHeaderObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('com/ibs/ibsappidealclaimreport') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheClaimHeaderList: ClaimHeaderList,
					onTheClaimHeaderObjectPage: ClaimHeaderObjectPage
                }
            },
            opaJourney.run
        );
    }
);