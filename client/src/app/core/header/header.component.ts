import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';

import { AuthenticationService } from '../auth/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  app_name = 'WREM';
  staticUrl = environment.staticUrl;

  isCollapsed: boolean = true;

  constructor(public auth: AuthenticationService) { }

  ngOnInit() {
  }

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
  }

}
