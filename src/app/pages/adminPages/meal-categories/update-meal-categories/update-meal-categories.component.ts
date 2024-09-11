import { Component, OnInit } from '@angular/core';
import { RestaurantTypeService } from '../../../../services/restaurantType.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GenericService } from '../../../../services/generic.service';
import { CityService } from '../../../../services/city.service';
import { development } from '../../../../../environments/development';
import { HttpClient } from '@angular/common/http';
import { MealCategoryService } from '../../../../services/mealCategory.service';
@Component({
  selector: 'app-update-meal-categories',
  templateUrl: './update-meal-categories.component.html',
  styleUrl: '../../admin-layout/admin-layout.component.scss'
})
export class UpdateMealCategoriesComponent implements OnInit {
  message: string = '';
  errorMessage: string = '';
  mealCategory: any;
  id: any;

  image = ''; 
  newImage = '';  

  url = development.mealCategoryImageUrl
  temp = development.tempImageUrl
  
  createForm: FormGroup;

  constructor(
    private cityService: CityService, 
    private router: Router, 
    private genericService: GenericService, 
    private route: ActivatedRoute,
    private http: HttpClient,
    private mealCatService: MealCategoryService
  ) {
    this.createForm = new FormGroup({
      name: new FormControl('', [
        Validators.minLength(3),
        Validators.pattern(/^[A-ZŠĐČĆŽ][a-zšđčćžA-ZŠĐČĆŽ]{2,69}(\s[a-zšđčćžA-ZŠĐČĆŽ]{2,69})*$/)
      ]), 
      image: new FormControl('', [
        
      ])
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = params['id']; 
      this.get(); 
    });
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

  get(): void {
    this.mealCatService.get(this.id).subscribe(
      (response: any) => {  
        this.mealCategory = response; 
        this.image = response.image
        this.createForm.patchValue({
          name: this.mealCategory.name,
          image: this.mealCategory.image
        });
      },
      (error) => {
        console.error('There was an error', error);
      }
    );
  }

  onSubmit() {
    this.errorMessage = '';
    this.message = '';
    if (this.createForm.valid) {
      this.mealCatService.update({
        id: this.id,
        name: this.Name.value,
        image: this.newImage ? this.newImage : '' 
      }, this.id).subscribe({
        next: (response) => {
          this.message = `Successfully updated`;
          this.router.navigateByUrl(`/admin/mealCategories`);
        },
        error: (error) => {
          this.handleServerErrors(error);
        }
      });
    } else {
      this.errorMessage = "Fill out the form correctly.";
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
    if (error.status !== 422 || error.status !== 201) {
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

  get ZipCode(): FormControl {
    return this.createForm.get('image') as FormControl;
  }
}
