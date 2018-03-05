import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthenticationService } from '../auth/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  model: any = {};
  loading: boolean = false;
  error: string = '';
  activado: boolean = false;

  constructor(
      private router: Router,
      private route: ActivatedRoute,
      private authenticationService: AuthenticationService) { }

  ngOnInit() {
      this.route.queryParams.subscribe(params => {
          this.activado = params['activated'] === 'true' ? true : false;
      })
      // reset login status
      this.authenticationService.logout();
  }

  login() {
      this.loading = true;
      this.authenticationService.login(this.model.email, this.model.password)
          .then(result => {
              this.activado = false;
              if (result === true) {
                  // login successful
                  this.router.navigate(['/']);
              } else {
                  // login failed
                  this.error = 'Combinación incorrecta de email/password';
                  this.loading = false;
              }
          });
    }

}
