import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent{

  message : String ='';
  errorMessage : String ='';

  constructor(private titleService: Title, private router: Router, private http: HttpClient, private authService: AuthService) {
    this.titleService.setTitle('Book a table | Register');
  }
  

  registerForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/)
    ]),
    rePassword: new FormControl('', [Validators.required]),
    name: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[A-ZŠĐČĆŽ][a-zšđčćžA-ZŠĐČĆŽ]{2,}$/)
    ]),
    lastname: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[A-ZŠĐČĆŽ][a-zšđčćžA-ZŠĐČĆŽ]{2,}$/)
    ])
  }, { validators: passwordMatchValidator() }); 

  

  onSubmit() {
    this.message = '';
    if (this.registerForm.valid) {
      this.authService.addUser({
        firstName: this.Name.value,
        lastName: this.Lastname.value,
        email: this.Email.value,
        password: this.Password.value
      }).subscribe({
        next: (response) => {
          this.message = `Successfull registration, go to Login page`
          const encodedEmail = encodeURIComponent(this.Email.value);
          this.router.navigateByUrl(`/ActivateUser?email=${encodedEmail}`);
        },
        error: (error) => {
          this.handleServerErrors(error);
        }
      });
    }
  }

  private handleServerErrors(error: any) {
    if (error.status === 422 && Array.isArray(error.error)) {
      this.clearErrors();
  
      error.error.forEach((err: { property: string, error: string }) => {
        const formControl = this.registerForm.get(err.property.toLowerCase());
        if (formControl) {
          formControl.setErrors({
            serverError: err.error
          });
        }
      });
    }
    if(error.status !== 422 || error.status !== 201){
      this.errorMessage = error.error.message;
    }
  }
  
  private clearErrors() {
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      if (control) {
        control.setErrors(null); 
      }
    });
  }
 
  get Name(): FormControl {
    return this.registerForm.get('name') as FormControl;
  }
  
  get Lastname(): FormControl {
    return this.registerForm.get('lastname') as FormControl;
  }

  get Email(): FormControl {
    return this.registerForm.get('email') as FormControl;
  }

  get Password(): FormControl {
    return this.registerForm.get('password') as FormControl;
  }


}
export function passwordMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const rePassword = control.get('rePassword');

    if (password && rePassword && password.value !== rePassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  };
}