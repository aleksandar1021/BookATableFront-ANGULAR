import { Component, OnDestroy, OnInit } from '@angular/core';
import { RestaurantTypeService } from '../../../services/restaurantType.service'; 
import { GenericService } from '../../../services/generic.service';
import { RestaurantService } from '../../../services/restaurant.service';
import { development } from '../../../../environments/development';
import { SearchService } from '../../../services/shared.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-restaurants',
  templateUrl: './restaurants.component.html',
  styleUrl: '../../adminPages/admin-layout/admin-layout.component.scss'
})
export class RestaurantsClientComponent implements OnInit{
  restaurants: any[] = []; 
  url = development.restaurantImageUrl;
  
  errorMessage : string = ''
  isVisible : boolean = false;
  perPage : number = 5;
  totalCount : number = this.perPage;

  


  constructor(private restaurantService:RestaurantService, 
             private genericService: GenericService,
             private authService: AuthService,
             private titleService: Title
            ){
              this.titleService.setTitle('Book a table | Restaurants');

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
    this.restaurantService.getRestaurantsUser(this.totalCount, this.searchQuery, this.authService.getUserFromToken().Id).subscribe(
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


  delete(id: number) {
    this.restaurantService.deleteUser(id).subscribe(
      response => {
        this.restaurants = this.restaurants.filter(x => x.id != id);
      },
      error => {
        if(error.status == 409){
          alert("The restaurant cannot be deleted because it exists in other tables.")
        }else{
           alert('An error occurred, please try again later.');
        }
      }
    );
  }
}
