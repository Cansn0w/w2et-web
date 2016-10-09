import { Component, Input } from '@angular/core';

@Component({
	selector: 'facebook-share-btn',
	template: `
	<iframe class="e2e-iframe-trusted-src"
			[src]="iframe_url() | safe"
			width="73" height="28" style="border:none;overflow:hidden" scrolling="no"
			frameborder="0" allowTransparency="true"></iframe>`
})

export class FacebookShareButton {
	@Input() url: string;

	iframe_url(): string {
		return 'https://www.facebook.com/plugins/share_button.php?href=' + encodeURIComponent(this.url) + '&layout=button&size=large&mobile_iframe=false&appId=194305457670086&width=73&height=28';
	}
}
