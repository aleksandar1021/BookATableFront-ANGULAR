import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ContactService } from '../../../services/contact.service';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';


@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  message : String ='';
  errorMessage : String ='';

  constructor(private titleService: Title, private router: Router, private http: HttpClient, private contactService: ContactService) {
    this.titleService.setTitle('Book a table | Login');
  }
  

  contactForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    firstName: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[A-ZŠĐČĆŽ][a-zšđčćžA-ZŠĐČĆŽ]{2,29}$/)
    ]),
    lastName: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[A-ZŠĐČĆŽ][a-zšđčćžA-ZŠĐČĆŽ]{2,29}$/)
    ]),
    subject: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[A-ZŠĐČĆŽ][a-zšđčćžA-ZŠĐČĆŽ0-9\s.,!?-]{2,199}$/)
    ]),
    message: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[A-ZŠĐČĆŽ][a-zšđčćžA-ZŠĐČĆŽ0-9\s.,!?-]{2,199}$/)
    ])
    
  });
  

  onSubmit() {
    this.errorMessage = "";
    if(!this.contactForm.valid){
      this.errorMessage = "Fill in all fields of the form correctly."
    }
    this.message = '';
    if (this.contactForm.valid) {
      this.contactService.sendContactPageMessage({
        email: this.Email.value,
        firstName: this.FirstName.value,
        lastName: this.LastName.value,
        subject: this.Subject.value,
        message: this.Message.value
      }).subscribe({
        next: (response : any) => {
          this.message = `The message has been successfully sent.`
          this.contactForm.reset()
          if(response.status != 201){
            this.errorMessage = response.error.message;
          }
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
        const formControl = this.contactForm.get(err.property.toLowerCase());
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
    Object.keys(this.contactForm.controls).forEach(key => {
      const control = this.contactForm.get(key);
      if (control) {
        control.setErrors(null); 
      }
    });
  }
  

  get FirstName(): FormControl {
    return this.contactForm.get('firstName') as FormControl;
  }
  get LastName(): FormControl {
    return this.contactForm.get('lastName') as FormControl;
  }
  get Email(): FormControl {
    return this.contactForm.get('email') as FormControl;
  }
  get Subject(): FormControl {
    return this.contactForm.get('subject') as FormControl;
  }
  get Message(): FormControl {
    return this.contactForm.get('message') as FormControl;
  }

  


}
