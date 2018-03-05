import { NgModule, Optional, SkipSelf, ModuleWithProviders } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Http, RequestOptions } from '@angular/http';
import { CommonModule } from '@angular/common';

// Auth
import { AuthGuard } from './auth/auth-guard.service';
import { AuthenticationService } from './auth/authentication.service';

// Angular2 JWT
import { AuthHttp } from 'angular2-jwt';
import { authHttpServiceFactory } from './auth/auth-http-service.factory';

// Routing
import { AppRoutingModule } from '../app-routing.module';

// Ngx Bootstrap
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

// Components
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { HeaderComponent } from './header/header.component';

// Services
import { SignUpService } from './sign-up/sign-up.service';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,

    BsDropdownModule,
    TooltipModule,
    
    AppRoutingModule
  ],
  declarations: [
    LoginComponent,
    HeaderComponent,
    SignUpComponent
  ],
  exports: [
    LoginComponent,
    HeaderComponent,
    SignUpComponent
  ],
  providers: []
})
export class CoreModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: [
        AuthGuard,
        AuthenticationService,
        SignUpService,
        {
          provide: AuthHttp,
          useFactory: authHttpServiceFactory,
          deps: [Http, RequestOptions]
        }
      ]
    };
  }

  constructor (@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}
