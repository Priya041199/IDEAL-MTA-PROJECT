sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'com/ibs/ibsappidealpaymentreport/test/integration/FirstJourney',
		'com/ibs/ibsappidealpaymentreport/test/integration/pages/PaymentsHeaderList',
		'com/ibs/ibsappidealpaymentreport/test/integration/pages/PaymentsHeaderObjectPage'
    ],
    function(JourneyRunner, opaJourney, PaymentsHeaderList, PaymentsHeaderObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('com/ibs/ibsappidealpaymentreport') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onThePaymentsHeaderList: PaymentsHeaderList,
					onThePaymentsHeaderObjectPage: PaymentsHeaderObjectPage
                }
            },
            opaJourney.run
        );
    }
);