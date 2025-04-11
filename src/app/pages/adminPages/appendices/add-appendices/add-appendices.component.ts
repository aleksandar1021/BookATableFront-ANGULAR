import { Component, OnInit } from '@angular/core';
import { RestaurantTypeService } from '../../../../services/restaurantType.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GenericService } from '../../../../services/generic.service';
import { AppendiceService } from '../../../../services/appendices.service';

@Component({
  selector: 'app-add-appendices',
  templateUrl: './add-appendices.component.html',
  styleUrl: '../../admin-layout/admin-layout.component.scss'
})
export class AddAppendicesComponent implements OnInit{

  message:string='';
  errorMessage:string=''


  constructor(private appendiceService:AppendiceService, private router:Router){

  }

  ngOnInit(): void {
    
  }

  createForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.pattern(/^[A-ZŠĐČĆŽ][a-zšđčćžA-ZŠĐČĆŽ]{2,69}(\s[a-zšđčćžA-ZŠĐČĆŽ]{2,69})*$/)
    ])
  }) 

  onSubmit() {
    this.errorMessage =  ''
    this.message = '';
    if (this.createForm.valid) {
      this.appendiceService.create({
        name: this.Name.value,
      }).subscribe({
        next: (response) => {
          this.message = `Successfull added`
          this.router.navigateByUrl(`/admin/appendices`);
        },
        error: (error) => {
          this.handleServerErrors(error);
        }
      });
    }else{
      this.errorMessage = "Fill out the form correctly."
    }
  }

  

  private handleServerErrors(error: any) {
    if (error.status === 422 && Array.isArray(error.error)) {
      this.clearErrors();
  
      error.error.forEach((err: { property: string, error: string }) => {
        const formControl = this.createForm.get(err.property.toLowerCase());
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
    Object.keys(this.createForm.controls).forEach(key => {
      const control = this.createForm.get(key);
      if (control) {
        control.setErrors(null); 
      }
    });
  }

  get Name(): FormControl {
    return this.createForm.get('name') as FormControl;
  }
  
}
