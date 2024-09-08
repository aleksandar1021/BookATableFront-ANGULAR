import { Component, OnInit } from '@angular/core';
import { RestaurantTypeService } from '../../../services/restaurantType.service'; 
import { CityService } from '../../../services/city.service';
import { AuthService } from '../../../services/auth.service';
import { RestaurantService } from '../../../services/restaurant.service'; 
import { MealCategoryService } from '../../../services/mealCategory.service';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

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
  selectedCategoryIds: number[] = [];

  registerForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.pattern(/^[A-ZŠĐČĆŽ][a-zšđčćžA-ZŠĐČĆŽ]{2,69}(\s[a-zšđčćžA-ZŠĐČĆŽ]{2,69})*$/)
    ]),
    description: new FormControl('', [
      Validators.minLength(3),
      Validators.maxLength(200),
      Validators.pattern(/^[A-ZŠĐČĆŽ][a-zšđčćžA-ZŠĐČĆŽ]{2,69}(\s[a-zšđčćžA-ZŠĐČĆŽ]{2,69})*$/)
    ]),    
    workFromHour: new FormControl('', [Validators.required, Validators.min(0), Validators.max(23)]),
    workFromMinute: new FormControl('', [Validators.required, Validators.min(0), Validators.max(59)]),
    workUntilHour: new FormControl('', [Validators.required, Validators.min(0), Validators.max(23)]),
    workUntilMinute: new FormControl('', [Validators.required, Validators.min(0), Validators.max(59)]),
    timeInterval: new FormControl('', [Validators.required, Validators.min(10), Validators.max(60)]),
    maxNumberOfGuests: new FormControl('', [Validators.required, Validators.min(1)]),
    restaurantType: new FormControl('', [Validators.required]),
    mealCategoryType: new FormArray([]),
    city: new FormControl('', [Validators.required]),
    addressOfPlace: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.pattern(/^[A-ZŠĐČĆŽ][a-zšđčćžA-ZŠĐČĆŽ]{2,69}(\s[a-zšđčćžA-ZŠĐČĆŽ]{2,69})*$/)
    ]),
    place: new FormControl('', [
      Validators.minLength(3),
      Validators.pattern(/^[A-ZŠĐČĆŽ][a-zšđčćžA-ZŠĐČĆŽ]{2,69}(\s[a-zšđčćžA-ZŠĐČĆŽ]{2,69})*$/)
    ]),
    number: new FormControl('', [
      Validators.pattern(/^[\s\S]{1,10}$/)
    ]),
    floor: new FormControl('', [Validators.min(0), Validators.max(100)]),
    addressDescription: new FormControl('', [
      Validators.minLength(3),
      Validators.pattern(/^[A-ZŠĐČĆŽ][a-zšđčćžA-ZŠĐČĆŽ]{2,69}(\s[a-zšđčćžA-ZŠĐČĆŽ]{2,69})*$/)
    ])
  });

  constructor(
    private authService: AuthService, 
    private restaurantTypeService: RestaurantTypeService, 
    private cityService: CityService,
    private mealCategoryService: MealCategoryService,
    private restaurantService: RestaurantService
  ) {}

  ngOnInit(): void {
    this.getRestaurantTypes();
    this.getCities();
    this.getMealCategories();
  }

  get mealCategoryFormArray(): FormArray {
    return this.registerForm.get('mealCategoryType') as FormArray;
  }

  onCheckboxChange(event: Event, categoryId: number): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.selectedCategoryIds.push(categoryId);
    } else {
      const index = this.selectedCategoryIds.indexOf(categoryId);
      if (index !== -1) {
        this.selectedCategoryIds.splice(index, 1);
      }
    }
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
        this.initializeMealCategoryFormArray();
      },
      (error) => {
        console.error('Error fetching meal categories', error);
      }
    );
  }

  initializeMealCategoryFormArray(): void {
    const formArray = this.mealCategoryFormArray;
    this.mealCategories.forEach(() => {
      formArray.push(new FormControl(false)); // Inicijalizujte sa false
    });
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

  createMealCategoriesRestaurants(): any {
    const mealCategoriesRestaurants = this.selectedCategoryIds.map((mealCategoryId: number) => ({
      mealCategoryId,
      restaurantId: 0 
    }));

    return mealCategoriesRestaurants;
  }

  registerRestaurant(): void {
    if (this.registerForm.valid) {
      const formData = this.registerForm.value;

      const requestPayload = {
        name: formData.name,
        workFromHour: formData.workFromHour,
        workUntilHour: formData.workUntilHour,
        workFromMinute: formData.workFromMinute,
        workUntilMinute: formData.workUntilMinute,
        description: formData.description,
        maxNumberOfGuests: formData.maxNumberOfGuests,
        timeInterval: formData.timeInterval,
        restaurantTypeId: formData.restaurantType,
        addressInput: {
          cityId: formData.city,
          place: formData.place,
          address: formData.addressOfPlace,
          number: formData.number,
          floor: formData.floor ? formData.floor : null,
          description: formData.addressDescription,
        },
        mealCategoriesRestaurants: this.createMealCategoriesRestaurants()
      };

      this.restaurantService.applyRestaurant(requestPayload).subscribe(
        (response) => {
          this.message = "You have successfully applied for a restaurant marketing permit, wait until the administrator checks the data and selects the restaurant if everything is in order.";
          this.registerForm.reset();
          this.mealCategoryFormArray.clear(); 
          this.selectedCategoryIds = []; 
        },
        (error) => {
          console.error('Error registering restaurant', error);
        }
      );
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
