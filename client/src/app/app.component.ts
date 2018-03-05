import { Component, ViewContainerRef } from '@angular/core';

import { AuthHttp } from 'angular2-jwt';
import { AuthenticationService } from './core/auth/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private viewContainerRef: ViewContainerRef;

  public constructor(viewContainerRef:ViewContainerRef, private authHttp: AuthHttp, private auth: AuthenticationService) {
    // You need this small hack in order to catch application root view container ref
    this.viewContainerRef = viewContainerRef;

    // When the app starts up, there might be a valid
    // token in local storage. If there is, we should
    // schedule an initial token refresh for when the
    // token expires
    this.auth.startupTokenRefresh();
  }
}
