import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  apiUrlUser = "http://localhost:5000/userPhotos/";
  apiUrlTemp = "http://localhost:5000/temp/";  
  apiFileUpload = "http://localhost:5000/api/files"; 
  apiUpdateUser = "http://localhost:5000/api/users"; 

  message: String = '';
  errorMessage: String = '';
  user: any;

  firstName: any = '';
  lastName : any = '';
  email : any = '';
  password :any = '';
  rePassword = '';
  image = ''; 
  newImage = '';  

  constructor(private authService: AuthService, private http: HttpClient) { }

  ngOnInit(): void {
    this.getUser();
  }

  getUser(): void {
    this.authService.getUser(this.authService.getUserFromToken().Id).subscribe(
      (response: any) => {
        this.user = response;
        this.firstName = response.firstName;
        this.lastName = response.lastName;
        this.email = response.email;
        this.image = response.image;  
      },
      (error) => {
        console.error('There was an error', error);
      }
    );
  }

  registerForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/)
    ]),
    rePassword: new FormControl('', []),
    firstname: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[A-ZŠĐČĆŽ][a-zšđčćžA-ZŠĐČĆŽ]{2,29}$/)
    ]),
    lastname: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[A-ZŠĐČĆŽ][a-zšđčćžA-ZŠĐČĆŽ]{2,29}$/)
    ])
  }, { validators: passwordMatchValidator() });

  onFileChange(event: any) {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
  
    this.http.post(this.apiFileUpload, formData).subscribe({
      next: (response: any) => {
        this.newImage = response.file; 
        this.image = '';
      },
      error: (error) => {
        console.error('File upload failed', error);
        this.errorMessage = 'Failed to upload image.';
      }
    });
  }

  onSubmit(event: Event) {
    event.preventDefault();
    this.message = '';
  
    if (1) {
      this.updateUser();
    } else {
      this.errorMessage = 'Please fill all required fields correctly.';
    }
  }

  updateUser() {

    this.firstName = this.registerForm.get('firstname')?.value ? this.registerForm.get('firstname')?.value : this.firstName;
    this.lastName = this.registerForm.get('lastname')?.value ? this.registerForm.get('lastname')?.value : this.lastName;
    this.email = this.registerForm.get('email')?.value ? this.registerForm.get('email')?.value : this.email;
    this.password = this.registerForm.get('password')?.value ? this.registerForm.get('password')?.value : this.password;

    const userUpdateData = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
      image: this.newImage ? this.newImage : '' 
    };
  
    this.errorMessage='';
    this.message = '';
    this.authService.updateUser(userUpdateData, this.authService.getUserFromToken().Id).subscribe({
      next: (response) => {
        this.message = `Successfully updated user!`;
      },
      error: (error) => {
        this.handleServerErrors(error);
      }
    });
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
    } else {
      this.errorMessage = error?.error?.message || 'Unknown error occurred';
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
    return this.registerForm.get('firstname') as FormControl;
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
