import { Component, OnInit } from '@angular/core';
import { RestaurantTypeService } from '../../../../services/restaurantType.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GenericService } from '../../../../services/generic.service';
import { MealCategoryService } from '../../../../services/mealCategory.service';
import { development } from '../../../../../environments/development';
import { HttpClient } from '@angular/common/http';
import { DishService } from '../../../../services/dish.service';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-update-dish',
  templateUrl: './update-dish.component.html',
  styleUrl: '../../../adminPages/admin-layout/admin-layout.component.scss'
})
export class UpdateDishComponent {
  message:string='';
  errorMessage:string=''


  image = ''; 
  newImage = '';  

  id: any;

  url = development.dishImageUrl
  temp = development.tempImageUrl

  createForm: FormGroup;

  dish: any


  constructor(private router:Router, 
              private dishSerice: DishService, 
              private http: HttpClient, 
              private route: ActivatedRoute,
              private titleService: Title
            ){
    this.createForm = new FormGroup({
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
        
      ])
    });

    this.titleService.setTitle('Book a table | Update dish');

  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = params['id']; 
      this.get()
    });
  }

  get(): void {
    this.dishSerice.get(this.id).subscribe(
      (response: any) => {  
        this.dish = response; 
        this.image = response.image
        this.createForm.patchValue({
          name: this.dish.name,
          description: this.dish.description,
          price: this.dish.price,
          image: this.dish.image
        });
      },
      (error) => {
        console.error('There was an error', error);
      }
    );
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



  onSubmit() {
    this.errorMessage =  ''
    this.message = '';
    if (this.createForm.valid) {
      this.dishSerice.update({
        id: 1,
        name: this.Name.value,
        description: this.Description.value,
        price: this.Price.value,
        image: this.newImage ? this.newImage : '' ,
        restaurantId: this.dish.restaurantId
      }, this.id).subscribe({
        next: (response) => {
          this.message = `Successfull updated`
          this.router.navigateByUrl(`/dishes/${this.dish.restaurantId}`);
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
