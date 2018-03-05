import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { SignUpService } from './sign-up.service';

import { PasswordValidation } from './password-validation';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  formGroup: FormGroup;
  submitted: boolean = false;
  @ViewChild('UsuarioForm') form;

  loading: boolean = false;
  error: boolean = false;

  constructor(
    private fb: FormBuilder,
    private signUpService: SignUpService,
    private router: Router
  ) { }

  ngOnInit() {
    this.formGroup = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: PasswordValidation.MatchPassword // your validation method
    });
  }

  onSubmit({ value, valid, dirty }: { value: any, valid: boolean, dirty: boolean }): void {
    this.submitted = true;
    if(valid){
      delete value.confirmPassword;
      this.loading = true;
      this.signUpService.createUsuario(value)
        .then(user => {
          this.error = false;
          this.router.navigate(['/login']);
        })
        .catch(error => {
          this.error = true;
          this.loading = false;
        });
    }
  }  

}
