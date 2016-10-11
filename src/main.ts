import './polyfills.ts';

import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {enableProdMode} from '@angular/core';
import {environment} from './environments/environment';
import {AppModule} from './app/';

// Facebook SDK plugin
(function (d, s, id) {
	var js, fjs = d.getElementsByTagName(s)[0];
	if (d.getElementById(id)) return;
	js = d.createElement(s);
	js.id = id;
	js.src = "https://connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v2.8&appId=194305457670086";
	fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
// Facebook SDK plugin --- END

if (environment.production) {
	enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
