import { Component, OnDestroy, OnInit } from '@angular/core';
import { RestaurantTypeService } from '../../../../services/restaurantType.service'; 
import { GenericService } from '../../../../services/generic.service';
import { RestaurantService } from '../../../../services/restaurant.service';
import { development } from '../../../../../environments/development';
import { SearchService } from '../../../../services/shared.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-restaurants',
  templateUrl: './restaurants.component.html',
  styleUrl: '../../admin-layout/admin-layout.component.scss'
})
export class RestaurantsComponent implements OnInit{
  restaurants: any[] = []; 
  url = development.restaurantImageUrl;
  
  errorMessage : string = ''
  isVisible : boolean = false;
  perPage : number = 5;
  totalCount : number = this.perPage;

  


  constructor(private restaurantService:RestaurantService, 
             private genericService: GenericService,
             private searchService: SearchService
            ){

  }

  searchQuery: string = '';

  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value; 
    this.get()
  }

  ngOnInit(): void {
    this.get()
  }

 

  loadMore(){
    this.totalCount += this.perPage;
    this.get();
  }

  get(): void {
    this.restaurantService.getRestaurantsAdmin(this.totalCount, this.searchQuery).subscribe(
      (response: any) => {  
        this.restaurants = response.data;
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

  

  activate(restaurant: any) {
    this.restaurantService.activateRestaurant(restaurant.id,{
      userId: restaurant.user.id,
      restaurantId: restaurant.id
    }).subscribe(
      response => {
        restaurant.isActivated=true
      },
      error => {
        if(error.status == 409){
          this.errorMessage = "The category cannot be deleted because it exists in other tables."
        }else{
          this.errorMessage = 'An error occurred, please try again later.';
        }
      }
    );
  }

  delete(id: number) {
    this.restaurantService.delete(id).subscribe(
      response => {
        this.restaurants = this.restaurants.filter(x => x.id != id);
      },
      error => {
        if(error.status == 409){
          alert("The category cannot be deleted because it exists in other tables.")
        }else{
           alert('An error occurred, please try again later.');
        }
      }
    );
  }
}
