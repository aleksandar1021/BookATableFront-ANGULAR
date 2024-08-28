import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  message : String ='';
  errorMessage : String ='';

  constructor(private titleService: Title, private router: Router, private http: HttpClient, private authService: AuthService) {
    this.titleService.setTitle('Book a table | Login');
  }
  

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/)
    ])})
    

  

  onSubmit() {
    this.message = '';
    if (this.loginForm.valid) {
      this.authService.login({
        email: this.Email.value,
        password: this.Password.value
      }).subscribe({
        next: (response : any) => {
          this.message = `Successfull login`
          this.router.navigateByUrl('/home');

          localStorage.setItem("token", JSON.stringify(response.token));
        },
        error: (error) => {
          this.handleServerErrors(error);
        }
      });
    }
  }

  private handleServerErrors(error: any) {
    if(error.status == 403){
      this.errorMessage = "Your account is not active, please activate";
    }
    else if(error.status == 401){
      this.errorMessage = "Wrong credentials";
    }else {
      this.errorMessage = "An error has occured, please try again"
    }
  }
  


  get Email(): FormControl {
    return this.loginForm.get('email') as FormControl;
  }

  get Password(): FormControl {
    return this.loginForm.get('password') as FormControl;
  }


}

