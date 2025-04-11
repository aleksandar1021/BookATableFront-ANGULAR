import { Component, OnInit } from '@angular/core';
import { RestaurantTypeService } from '../../../services/restaurantType.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GenericService } from '../../../services/generic.service';

@Component({
  selector: 'app-update-restaurant-type',
  templateUrl: './update-restaurant-type.component.html',
  styleUrl: '../admin-layout/admin-layout.component.scss'
})
export class UpdateRestaurantTypeComponent implements OnInit {
  message: string = '';
  errorMessage: string = '';
  restaurantType: any;
  id: any;

  createForm: FormGroup;

  constructor(
    private rts: RestaurantTypeService, 
    private router: Router, 
    private genericService: GenericService, 
    private route: ActivatedRoute
  ) {
    this.createForm = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern(/^[A-ZŠĐČĆŽ][a-zšđčćžA-ZŠĐČĆŽ]{2,69}(\s[a-zšđčćžA-ZŠĐČĆŽ]{2,69})*$/)
      ])
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = params['id']; 
      this.getRestaurantType(); 
    });
  }

  getRestaurantType(): void {
    this.rts.getRestaurantType(this.id).subscribe(
      (response: any) => {  
        this.restaurantType = response; 
        console.log(this.restaurantType);
        this.createForm.patchValue({
          name: this.restaurantType.name
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
      this.rts.updateRestaurantType({
        id: this.id,
        name: this.Name.value
      }, this.id).subscribe({
        next: (response) => {
          this.message = `Successfully updated`;
          this.router.navigateByUrl(`/admin/restaurantTypes`);
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
}
