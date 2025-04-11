import { Component, OnInit } from '@angular/core';
import { RestaurantTypeService } from '../../../../services/restaurantType.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GenericService } from '../../../../services/generic.service';
import { CityService } from '../../../../services/city.service';

@Component({
  selector: 'app-update-cities',
  templateUrl: './update-cities.component.html',
  styleUrl: '../../admin-layout/admin-layout.component.scss'
})
export class UpdateCitiesComponent implements OnInit {
  message: string = '';
  errorMessage: string = '';
  city: any;
  id: any;

  createForm: FormGroup;

  constructor(
    private cityService: CityService, 
    private router: Router, 
    private genericService: GenericService, 
    private route: ActivatedRoute
  ) {
    this.createForm = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern(/^[A-ZŠĐČĆŽ][a-zšđčćžA-ZŠĐČĆŽ]{2,69}(\s[a-zšđčćžA-ZŠĐČĆŽ]{2,69})*$/)
      ]), 
      zipCode: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d{5}$/) 
      ])
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = params['id']; 
      this.getCity(); 
    });
  }

  getCity(): void {
    this.cityService.getCity(this.id).subscribe(
      (response: any) => {  
        this.city = response; 
        this.createForm.patchValue({
          name: this.city.name,
          zipCode: this.city.zipCode
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
      this.cityService.update({
        id: this.id,
        name: this.Name.value,
        zipCode: this.ZipCode.value
      }, this.id).subscribe({
        next: (response) => {
          this.message = `Successfully updated`;
          this.router.navigateByUrl(`/admin/cities`);
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
    return this.createForm.get('zipCode') as FormControl;
  }
}
