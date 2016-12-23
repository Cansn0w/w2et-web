import { Component, Input } from '@angular/core';
import { FacebookInitialiser } from '../../core/services/fb.initialiser';

declare var FB: any;
/*
 * A commonly used UI component when displaying recipe/restaurant information.
 * Source url is an input property passed in by its parent component
 */
@Component({
  selector: 'facebook-share-btn',
  template: `
    <i class="material-icons" (click)="share($event)" style="font-size:36px;">share</i>
  `
})

export class FacebookShareButton {

  constructor(private fb_init: FacebookInitialiser) { }

  @Input() url: string;

  share($event) {
    $event.stopPropagation();
    let params = {
      method: 'share',
      href: this.url
    };

    FB.ui(params, () => {});
  }
}
