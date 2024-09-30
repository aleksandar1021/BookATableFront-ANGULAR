import { Component, OnInit } from '@angular/core';
import { RestaurantTypeService } from '../../../services/restaurantType.service'; 
import { CityService } from '../../../services/city.service';
import { AuthService } from '../../../services/auth.service';
import { RestaurantService } from '../../../services/restaurant.service'; 
import { MealCategoryService } from '../../../services/mealCategory.service';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AppendiceService } from '../../../services/appendices.service';
import { ActivatedRoute, Router } from '@angular/router';
import { development } from '../../../../environments/development';

@Component({
  selector: 'app-update-restaurant',
  templateUrl: './update-restaurant.component.html',
  styleUrl: './update-restaurant.component.scss'
})
export class UpdateRestaurantComponent implements OnInit {

  restaurantTypes: any = [];
  cities: any = [];
  mealCategories: any = [];
  appendices: any = [];
  selectedAppendiceIds: number[] = [];
  message: string = '';
  errorMessage: string = '';
  selectedCategoryIds: number[] = [];
  selectedFiles: File[] = [];
  uploadedImagePaths: string[] = []; 
  daysOfWeek: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  selectedDays: number[] = [];
  restaurant: any;
  restaurantId: any
  oldImages : string[] = []
  url = development.restaurantImageUrl
  temp = development.tempImageUrl


  registerForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.pattern(/^[A-ZŠĐČĆŽ][a-zšđčćžA-ZŠĐČĆŽ]{1,69}(\s[a-zšđčćžA-ZŠĐČĆŽ]{1,69})*$/)
    ]),
    description: new FormControl('', [
      Validators.minLength(3),
      Validators.maxLength(200),
      Validators.pattern(/^[A-ZŠĐČĆŽ][a-zšđčćžA-ZŠĐČĆŽ]{1,69}(\s[a-zšđčćžA-ZŠĐČĆŽ]{1,69})*$/)
    ]),    
    workFromHour: new FormControl('', [Validators.required, Validators.min(0), Validators.max(23)]),
    workFromMinute: new FormControl('', [Validators.required, Validators.min(0), Validators.max(59)]),
    workUntilHour: new FormControl('', [Validators.required, Validators.min(0), Validators.max(23)]),
    workUntilMinute: new FormControl('', [Validators.required, Validators.min(0), Validators.max(59)]),
    timeInterval: new FormControl('', [Validators.required, Validators.min(10), Validators.max(60)]),
    maxNumberOfGuests: new FormControl('', [Validators.required, Validators.min(1)]),
    restaurantType: new FormControl('', [Validators.required]),
    mealCategoryType: new FormArray([]),
    appendiceType: new FormArray([]),
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
    ]),
    images: new FormControl || null

  });

  constructor(
    private authService: AuthService, 
    private restaurantTypeService: RestaurantTypeService, 
    private cityService: CityService,
    private mealCategoryService: MealCategoryService,
    private restaurantService: RestaurantService,
    private http: HttpClient,
    private appendiceService: AppendiceService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getRestaurantTypes();
    this.getCities();
    this.getMealCategories();
    this.getAppendices()

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.restaurantId = +id;
        this.getRestaurant(id);
      }
    });
  }

  getRestaurant(id: string): void {
    this.restaurantService.getRestaurantClient(id).subscribe(
      (response: any) => {
        this.restaurant = response;
        console.log(this.restaurant);
        
        this.registerForm.patchValue({
          name: this.restaurant.name,
          description: this.restaurant.description,
          workFromHour: this.restaurant.workFromHour,
          workFromMinute: this.restaurant.workFromMinute,
          workUntilHour: this.restaurant.workUntilHour,
          workUntilMinute: this.restaurant.workUntilMinute,
          timeInterval: this.restaurant.timeInterval,
          maxNumberOfGuests: this.restaurant.maxNumberOfGuests,
          restaurantType: this.restaurant.restaurantTypeId,
          city: this.restaurant.address.city.id,
          addressOfPlace: this.restaurant.address.address,
          place: this.restaurant.address.place,
          number: this.restaurant.address.number,
          floor: this.restaurant.address.floor,
          addressDescription: this.restaurant.address.description,
          images: this.restaurant.images
        });
        
        this.oldImages = this.restaurant.images
        this.selectedCategoryIds = this.restaurant.mealCategories.map((item: any) => item.id);
        this.selectedAppendiceIds = this.restaurant.appendiceRestaurants.map((item: any) => item.id);
        this.selectedDays = [...this.restaurant.regularClosedDaysInt];
        console.log(this.selectedDays)
  
        this.initializeMealCategoryFormArray();
        this.initializeAppendiceFormArray();
      },
      (error) => {
        console.error('Error fetching restaurant', error);
      }
    );
  }

  onDayChange(event: any, index: number): void {
    const isChecked = event.target.checked;
    if (isChecked) {
      this.selectedDays.push(index);
      
    } else {
      const dayIndex = this.selectedDays.indexOf(index);
      if (dayIndex !== -1) {
        this.selectedDays.splice(dayIndex, 1);
      }
    }
    //console.log(this.selectedDays); 
  }

  onFilesSelected(event: any): void {
    const files: FileList = event.target.files;
    this.selectedFiles = Array.from(files);
  
    this.uploadFiles(this.selectedFiles);

    //console.log(this.selectedFiles)
  }

  uploadFiles(files: File[]): void {
    this.uploadedImagePaths = [];

    files.forEach(file => {
      const formData = new FormData();
      formData.append('file', file);

      this.http.post<any>('http://localhost:5000/api/files', formData).subscribe(
        (response) => {
          this.uploadedImagePaths.push(response.file);
          this.registerForm.patchValue({ images: this.uploadedImagePaths });
          this.oldImages = []
        },
        (error) => {
          console.error('Error uploading file: ', error);
        }
      );
    });
  }

  get mealCategoryFormArray(): FormArray {
    return this.registerForm.get('mealCategoryType') as FormArray;
  }

  get appendiceFormArray(): FormArray {
    return this.registerForm.get('appendiceType') as FormArray;
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

  onCheckboxChange2(event: Event, appendiceId: number): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.selectedAppendiceIds.push(appendiceId);
    } else {
      const index = this.selectedAppendiceIds.indexOf(appendiceId);
      if (index !== -1) {
        this.selectedAppendiceIds.splice(index, 1);
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

  getAppendices(): void {
    this.appendiceService.gets().subscribe(
      (response: any) => {
        this.appendices = response.data;
        this.initializeAppendiceFormArray();
      },
      (error) => {
        console.error('Error fetching meal categories', error);
      }
    );
  }

  initializeAppendiceFormArray(): void {
    const formArray = this.appendiceFormArray;
    this.appendices.forEach(() => {
      formArray.push(new FormControl(false)); 
    });
  }

  initializeMealCategoryFormArray(): void {
    this.mealCategoryFormArray.clear();  
  
    this.mealCategories.forEach((category: any) => {
      const isChecked = this.selectedCategoryIds.includes(category.id);
      this.mealCategoryFormArray.push(new FormControl(isChecked));
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

  createAppendiceRestaurants(): any {
    const AppendiceRestaurants = this.selectedAppendiceIds.map((appendiceId: number) => ({
      appendiceId,
      restaurantId: 0 
    }));
    
    console.log(AppendiceRestaurants)

    return AppendiceRestaurants;
  }

  registerRestaurant(): void {
    this.markAllControlsAsTouched();
  
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
        mealCategoriesRestaurants: this.createMealCategoriesRestaurants(),
        images: this.uploadedImagePaths,
        primaryImagePath: this.uploadedImagePaths.length > 0 ? this.uploadedImagePaths[0] : null,
        appendices: this.createAppendiceRestaurants(),
        regularClosedDays: this.selectedDays
      };
  
      this.restaurantService.updateRestaurant(requestPayload, this.restaurantId).subscribe(
        (response) => {
          this.message = "You have successfully applied for a restaurant marketing permit, wait until the administrator checks the data and selects the restaurant if everything is in order.";
          
          this.router.navigateByUrl('/restaurants');

          this.registerForm.reset();
          this.mealCategoryFormArray.clear(); 
          this.appendiceFormArray.clear(); 
          this.selectedCategoryIds = []; 
          this.selectedAppendiceIds = []; 
          
          this.mealCategories.forEach(() => {
            this.mealCategoryFormArray.push(new FormControl(false));
          });
          
          this.appendices.forEach(() => {
            this.appendiceFormArray.push(new FormControl(false));
          });
          
          this.selectedDays = []; 
        },
        (error) => {
          console.error('Error registering restaurant', error);
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }
  

  markAllControlsAsTouched(): void {
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markControlsAsTouched(control);
      } else {
        control?.markAsTouched();
      }
    });
  }
  
  markControlsAsTouched(control: AbstractControl): void {
    if (control instanceof FormGroup) {
      Object.keys(control.controls).forEach(key => {
        this.markControlsAsTouched(control.get(key) as AbstractControl);
      });
    } else if (control instanceof FormArray) {
      control.controls.forEach(ctrl => {
        this.markControlsAsTouched(ctrl);
      });
    } else {
      control.markAsTouched();
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
