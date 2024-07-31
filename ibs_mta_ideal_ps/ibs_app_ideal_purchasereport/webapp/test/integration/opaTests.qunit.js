sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'com/ibs/ibsappidealpurchasereport/test/integration/FirstJourney',
		'com/ibs/ibsappidealpurchasereport/test/integration/pages/PrHeaderList',
		'com/ibs/ibsappidealpurchasereport/test/integration/pages/PrHeaderObjectPage'
    ],
    function(JourneyRunner, opaJourney, PrHeaderList, PrHeaderObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('com/ibs/ibsappidealpurchasereport') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onThePrHeaderList: PrHeaderList,
					onThePrHeaderObjectPage: PrHeaderObjectPage
                }
            },
            opaJourney.run
        );
    }
);