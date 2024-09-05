import { AfterViewInit, Component, OnInit } from '@angular/core';
import { RestaurantService } from '../../../services/restaurant.service';
import { MealCategoryService } from '../../../services/mealCategory.service';
import { RestaurantTypeService } from '../../../services/restaurantType.service'; 
import { AuthService } from '../../../services/auth.service';
import { Saved } from '../../../interfaces/saved.interface';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent implements OnInit {
  apiUrlRestaurants : string = "http://localhost:5000/restaurantPhotos/"
  restaurants : any;
  mealCategories: any[] = []; 
  restaurantTypes: any[] = []; 

  selectedMealCategory: string = ''; 
  selectedRestaurantType: string = '';
  searchName: string = ''; 

  isLogged: boolean = false;

  constructor(private restaurantService: RestaurantService, 
              private mealCategoryService: MealCategoryService, 
              private restaurantTypeService: RestaurantTypeService,
              private authService: AuthService,
              private route: ActivatedRoute
            ){

  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.selectedMealCategory = params['mealCategoryId'] ? params['mealCategoryId'] : '';
    });
    this.searchRestaurants();
    //this.getRestaurants()
    this.getMealCategories()
    this.getRestaurantTypes()
    this.isLogged = this.authService.isLoggedIn()
    
  }

  toggleSave(restaurant: any) {
    const userId = this.authService.getUserFromToken().Id;
    const isSaved = !restaurant.isSaved;
  
    const savedData: Saved = {
      userId: userId,
      restaurantId: restaurant.id
    };
  
    this.restaurantService.toggleSaveRestaurant(savedData).subscribe(
      response => {
        restaurant.isSaved = isSaved;
      },
      error => {
        console.error('Error saving restaurant:', error);
      }
    );
  }

  searchRestaurants(): void {
    this.restaurantService.searchRestaurantsAll(this.searchName, this.selectedMealCategory, this.selectedRestaurantType)
      .subscribe(
        (response: any) => {
          this.restaurants = response.data;
          console.log('Rezultat pretrage:', this.restaurants);
        },
        (error) => {
          console.error('Greška prilikom pretrage:', error);
        }
      );
  }

  getMealCategories(): void {
    this.mealCategoryService.getMealCategories().subscribe(
      (response: any) => {  
        this.mealCategories = response.data;
        //console.log(this.mealCategories)
      },
      (error) => {
        console.error('There was an error', error);
      }
    );
  }

  getRestaurantTypes(): void {
    this.restaurantTypeService.getRestaurantTypes().subscribe(
      (response: any) => {  
        this.restaurantTypes = response.data;
        console.log(this.restaurantTypes)
      },
      (error) => {
        console.error('There was an error', error);
      }
    );
  }

  getRestaurants(): void {
    this.restaurantService.getRestaurants().subscribe(
      (response: any) => {  
        this.restaurants = response.data;  
        console.log(this.restaurants)
      },
      (error) => {
        console.error('There was an error', error);
      }
    );
  }

}
