import { Component, OnInit } from '@angular/core';
import { RestaurantTypeService } from '../../../../services/restaurantType.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GenericService } from '../../../../services/generic.service';
import { MealCategoryService } from '../../../../services/mealCategory.service';
import { development } from '../../../../../environments/development';
import { HttpClient } from '@angular/common/http';
import { DishService } from '../../../../services/dish.service';
@Component({
  selector: 'app-add-dish',
  templateUrl: './add-dish.component.html',
  styleUrl: '../../../adminPages/admin-layout/admin-layout.component.scss'
})
export class AddDishComponent {
  message:string='';
  errorMessage:string=''


  image = ''; 
  newImage = '';  

  restaurantId: any;


  constructor(private router:Router, private dishSerice: DishService, private http: HttpClient, private route: ActivatedRoute){

  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.restaurantId = params['id']; 
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

  createForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.pattern(/^[A-ZŠĐČĆŽ][a-zšđčćžA-ZŠĐČĆŽ]{2,69}(\s[a-zšđčćžA-ZŠĐČĆŽ]{2,69})*$/)
    ]),
    description: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.pattern(/^[A-ZŠĐČĆŽ][a-zšđčćžA-ZŠĐČĆŽ]{1,100}(\s[a-zšđčćžA-ZŠĐČĆŽ]{1,100})*$/)
    ]),
    price: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d{1,7}([,.]\d{1,2})?$/)
    ]),
    image: new FormControl('', [
      Validators.required
    ])
  }) 

  onSubmit() {
    this.errorMessage =  ''
    this.message = '';
    if (this.createForm.valid) {
      this.dishSerice.create({
        name: this.Name.value,
        description: this.Description.value,
        price: this.Price.value,
        image: this.newImage,
        restaurantId: this.restaurantId
      }).subscribe({
        next: (response) => {
          this.message = `Successfull added`
          this.router.navigateByUrl(`/dishes/${this.restaurantId}`);
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

  get Description(): FormControl {
    return this.createForm.get('description') as FormControl;
  }

  get Price(): FormControl {
    return this.createForm.get('price') as FormControl;
  }
  
  get Image(): FormControl {
    return this.createForm.get('image') as FormControl;
  }
}
