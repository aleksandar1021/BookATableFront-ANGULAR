import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-activation-user',
  templateUrl: './activation-user.component.html',
  styleUrl: './activation-user.component.scss'
})
export class ActivationUserComponent {
  email : string = '';
  constructor(private route: ActivatedRoute, private titleService: Title, private router: Router, private http: HttpClient, private authService: AuthService){
    this.titleService.setTitle('Book a table | Activation');
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const encodedEmail = params['email'];
      const email = decodeURIComponent(encodedEmail);
      this.email = email;
    });
  }


  message : String ='';
  errorMessage : String ='';



  activationForm = new FormGroup({
    code: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d{4}$/)
    ])})
    

  

  onSubmit() {
    this.message = '';
    this.errorMessage ='';
    if (this.activationForm.valid) {
      this.authService.activateUser({
        email: this.email,
        activationCode : this.Code.value
      }).subscribe({
        next: (response : any) => {
          this.message = `Successfull activated account, you will be redirected to the home page`
          setTimeout(()=>{
            this.router.navigateByUrl('/home');
          }, 3000)
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
        const formControl = this.activationForm.get(err.property.toLowerCase());
        if (formControl) {
          formControl.setErrors({
            serverError: err.error
          });
        }
      });
    }
    else{
      this.errorMessage = error.error.message;
    }

  }
  


  get Code(): FormControl {
    return this.activationForm.get('code') as FormControl;
  }

  private clearErrors() {
    Object.keys(this.activationForm.controls).forEach(key => {
      const control = this.activationForm.get(key);
      if (control) {
        control.setErrors(null); 
      }
    });
  }

}
