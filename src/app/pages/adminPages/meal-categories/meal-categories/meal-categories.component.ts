import { Component, OnInit } from '@angular/core';
import { CityService } from '../../../../services/city.service';
import { GenericService } from '../../../../services/generic.service';
import { MealCategoryService } from '../../../../services/mealCategory.service';
import { development } from '../../../../../environments/development';

@Component({
  selector: 'app-meal-categories',
  templateUrl: './meal-categories.component.html',
  styleUrl: '../../admin-layout/admin-layout.component.scss'
})
export class MealCategoriesComponent implements OnInit{
  errorMessage: string=''
  mealCategories: any[] = [];
  url=development.mealCategoryImageUrl

  constructor(private mealCatService: MealCategoryService, private genericService: GenericService){

  }

  ngOnInit(): void {
    this.get()
  }

  get(): void {
    this.mealCatService.getMealCategories().subscribe(
      (response: any) => {  
        this.mealCategories = response.data;
      },
      (error) => {
        console.error('There was an error', error);
      }
    );
  }

  delete(id: number) {
    this.genericService.deleteEntity(id, 'MealCategories').subscribe(
      response => {
        this.mealCategories = this.mealCategories.filter(x => x.id != id);
      },
      error => {
        if(error.status == 409){
          this.errorMessage = "The meal category cannot be deleted because it exists in other tables."
        }else{
          this.errorMessage = 'An error occurred, please try again later.';
        }
      }
    );
  }

}
