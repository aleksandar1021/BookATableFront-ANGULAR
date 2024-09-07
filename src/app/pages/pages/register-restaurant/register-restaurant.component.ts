import { Component, OnInit } from '@angular/core';
import { RestaurantTypeService } from '../../../services/restaurantType.service'; 
import { CityService } from '../../../services/city.service';
import { AuthService } from '../../../services/auth.service';
import { MealCategoryService } from '../../../services/mealCategory.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register-restaurant',
  templateUrl: './register-restaurant.component.html',
  styleUrls: ['./register-restaurant.component.scss']
})
export class RegisterRestaurantComponent implements OnInit {
  
  restaurantTypes: any = [];
  cities: any = [];
  mealCategories: any = [];
  message: string = '';
  errorMessage: string = '';

  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    workFromHour: new FormControl('', [Validators.required, Validators.min(0), Validators.max(23)]),
    workFromMinute: new FormControl('', [Validators.required, Validators.min(0), Validators.max(59)]),
    workUntilHour: new FormControl('', [Validators.required, Validators.min(0), Validators.max(23)]),
    workUntilMinute: new FormControl('', [Validators.required, Validators.min(0), Validators.max(59)]),
    timeInterval: new FormControl('', [Validators.required, Validators.min(10), Validators.max(60)]),
    maxNumberOfGuests: new FormControl('', [Validators.required, Validators.min(1)]),
    restaurantType: new FormControl('', [Validators.required]),
    mealCategoryType: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    addressOfPlace: new FormControl('', [Validators.required]),
    place: new FormControl('', [Validators.required]),
    number: new FormControl('', [Validators.required]),
    floor: new FormControl(''),
    descriptionAddress: new FormControl('')
  });

  constructor(
    private authService: AuthService, 
    private restaurantTypeService: RestaurantTypeService, 
    private cityService: CityService,
    private mealCategoryService: MealCategoryService
  ) {}

  ngOnInit(): void {
    this.getRestaurantTypes();
    this.getCities();
    this.getMealCategories();
  }

  getRestaurantTypes(): void {
    this.restaurantTypeService.getRestaurantTypes().subscribe(
      (response: any) => {
        this.restaurantTypes = response.data;
      },
      (error) => {
        console.error('Error fetching restaurant types', error);
      }
    );
  }

  getMealCategories(): void {
    this.mealCategoryService.getMealCategories().subscribe(
      (response: any) => {
        this.mealCategories = response.data;
      },
      (error) => {
        console.error('Error fetching meal categories', error);
      }
    );
  }

  getCities(): void {
    this.cityService.getCities().subscribe(
      (response: any) => {
        this.cities = response.data;
      },
      (error) => {
        console.error('Error fetching cities', error);
      }
    );
  }

  registerRestaurant(): void {
    if (this.registerForm.valid) {
      // Submit form logic here
      console.log('Form data:', this.registerForm.value);
    } else {
      console.log('Form is invalid');
    }
  }

  handleServerErrors(error: any) {
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
      this.errorMessage = error.error?.message || 'An error occurred';
    }
  }

  clearErrors() {
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      if (control) {
        control.setErrors(null);
      }
    });
  }
}
