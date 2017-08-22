var admobid = {};
if( /(android)/i.test(navigator.userAgent) ) { 
	admobid = { // for Android
		banner: 'ca-app-pub-7988186803056775/7729779775',
		interstitial: 'ca-app-pub-7988186803056775/3874295247'
	};
} else if(/(ipod|iphone|ipad)/i.test(navigator.userAgent)) {
	admobid = { // for iOS
		banner: 'ca-app-pub-6869992474017983/4806197152',
		interstitial: 'ca-app-pub-6869992474017983/7563979554'
	};
} else {
	admobid = { // for Windows Phone
		banner: 'ca-app-pub-6869992474017983/8878394753',
		interstitial: 'ca-app-pub-6869992474017983/1355127956'
	};
}

function initApp() {
    if (AdMob) {
        AdMob.createBanner({
            adId : admobid.banner,
            position : AdMob.AD_POSITION.TOP_CENTER,
            autoShow : true
        });
    }
}

document.addEventListener('deviceready', initApp, false);