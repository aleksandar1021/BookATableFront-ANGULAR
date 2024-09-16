import { Component, OnInit } from '@angular/core';
import { CityService } from '../../../../services/city.service';
import { GenericService } from '../../../../services/generic.service';
import { MealCategoryService } from '../../../../services/mealCategory.service';
import { development } from '../../../../../environments/development';
import { DishService } from '../../../../services/dish.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dishes',
  templateUrl: './dishes.component.html',
  styleUrl: '../../../adminPages/admin-layout/admin-layout.component.scss'
})
export class DishesComponent implements OnInit{
  errorMessage: string=''
  dishes: any[] = [];

  restaurantId:any

  url=development.dishImageUrl

  isVisible : boolean = false;
  perPage : number = 5;
  totalCount : number = this.perPage;
  searchQuery: string = '';


  constructor(private dishService: DishService, private genericService: GenericService, private route: ActivatedRoute){

  }

  loadMore(){
    this.totalCount += this.perPage;
    this.get(this.restaurantId, this.searchQuery, this.totalCount); 
  }

  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value; 
    this.get(this.restaurantId, this.searchQuery, this.totalCount); 
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.restaurantId = params['id']; 
      this.get(this.restaurantId, this.searchQuery, this.totalCount); 
    });
  }

  get(restaurantId: number, query: string, totalCount: number): void {
    this.dishService.gets(restaurantId, query, totalCount).subscribe(
      (response: any) => {  
        this.dishes = response.data;
        if(response.totalCount > this.perPage){
          this.isVisible = true
        }
        if(response?.totalCount <= this.totalCount){
          this.isVisible = false;
        }
      },
      (error) => {
        console.error('There was an error', error);
      }
    );
  }

  delete(id: number) {
    this.genericService.deleteEntity(id, 'Dishs').subscribe(
      response => {
        this.dishes = this.dishes.filter(x => x.id != id);
      },
      error => {
        if(error.status == 409){
          this.errorMessage = "The dish cannot be deleted because it exists in other tables."
        }else{
          this.errorMessage = 'An error occurred, please try again later.';
        }
      }
    );
  }

}
