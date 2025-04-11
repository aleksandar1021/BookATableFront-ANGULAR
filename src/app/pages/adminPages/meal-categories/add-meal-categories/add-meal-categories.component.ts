import { Component, OnInit } from '@angular/core';
import { RestaurantTypeService } from '../../../../services/restaurantType.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GenericService } from '../../../../services/generic.service';
import { MealCategoryService } from '../../../../services/mealCategory.service';
import { development } from '../../../../../environments/development';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-add-meal-categories',
  templateUrl: './add-meal-categories.component.html',
  styleUrl: '../../admin-layout/admin-layout.component.scss'
})
export class AddMealCategoriesComponent {
  message:string='';
  errorMessage:string=''


  image = ''; 
  newImage = '';  

  constructor(private router:Router, private mealCatService: MealCategoryService, private http: HttpClient){

  }

  ngOnInit(): void {
    
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
  
    this.http.post(development.apiFileUpload, formData).subscribe({
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

  createForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.pattern(/^[A-ZŠĐČĆŽ][a-zšđčćžA-ZŠĐČĆŽ]{2,69}(\s[a-zšđčćžA-ZŠĐČĆŽ]{2,69})*$/)
    ]),
    image: new FormControl('', [
      Validators.required
    ])
  }) 

  onSubmit() {
    this.errorMessage =  ''
    this.message = '';
    if (this.createForm.valid) {
      this.mealCatService.create({
        name: this.Name.value,
        image: this.newImage
      }).subscribe({
        next: (response) => {
          this.message = `Successfull added`
          this.router.navigateByUrl(`/admin/mealCategories`);
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
  
  get Image(): FormControl {
    return this.createForm.get('image') as FormControl;
  }
}
