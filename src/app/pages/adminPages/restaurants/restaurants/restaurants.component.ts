import { Component, OnInit } from '@angular/core';
import { RestaurantTypeService } from '../../../../services/restaurantType.service'; 
import { GenericService } from '../../../../services/generic.service';
import { RestaurantService } from '../../../../services/restaurant.service';
import { development } from '../../../../../environments/development';
@Component({
  selector: 'app-restaurants',
  templateUrl: './restaurants.component.html',
  styleUrl: '../../admin-layout/admin-layout.component.scss'
})
export class RestaurantsComponent implements OnInit{
  restaurants: any[] = []; 
  url = development.restaurantImageUrl;
  
  errorMessage : string = ''


  constructor(private restaurantService:RestaurantService, private genericService: GenericService){

  }

  ngOnInit(): void {
    this.getRestaurantTypes()
  }

  getRestaurantTypes(): void {
    this.restaurantService.getRestaurantsAdmin().subscribe(
      (response: any) => {  
        this.restaurants = response.data;
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
