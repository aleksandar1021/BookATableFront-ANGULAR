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
export class SearchComponent implements OnInit, AfterViewInit{
  apiUrlRestaurants : string = "http://localhost:5000/restaurantPhotos/"
  restaurants : any;
  mealCategories: any[] = []; 
  restaurantTypes: any[] = []; 

  selectedMealCategory: string = ''; 
  selectedRestaurantType: string = '';
  searchName: string = ''; 

  sortOptions: { value: string, label: string }[] = [];
  selectedSortOption: string = '';

  isLogged: boolean = false;

  perPage : number = 6;
  totalCount : number = this.perPage;
  isVisible : boolean = false;


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

      const sortProperty = params['sorts[0].sortProperty'] ? params['sorts[0].sortProperty'] : '';
      const sortDirection = params['sorts[0].direction'] ? params['sorts[0].direction'] : '';

      if (sortProperty && sortDirection) {
        this.selectedSortOption = this.buildSortOption(sortProperty, sortDirection);
      }
    });

    this.searchRestaurants();
    this.getMealCategories();
    this.getRestaurantTypes();
    this.authService.isLoggedIn().subscribe(isLogged => {
      this.isLogged = isLogged; 
    });
    this.getSortOptions();

    
  }

  ngAfterViewInit(): void {
    
  }
  buildSortOption(sortProperty: string, sortDirection: string): string {
    return `${sortProperty}${sortDirection.charAt(0).toUpperCase() + sortDirection.slice(1).toLowerCase()}`; 
  }

  loadMore(){
    this.totalCount += this.perPage;
    this.searchRestaurants();
  }

  getSortOptions() {
    this.sortOptions = [
      { value: 'nameAsc', label: 'Name asc' },
      { value: 'nameDesc', label: 'Name desc' },
      { value: 'createdAsc', label: 'Create date asc' },
      { value: 'createdDesc', label: 'Create date desc' },
    ];
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
    const queryParams = this.buildQueryString();
    this.restaurantService.searchRestaurantsAll(this.searchName, this.selectedMealCategory, this.selectedRestaurantType, queryParams, this.totalCount)
      .subscribe(
        (response: any) => {
          this.restaurants = response.data;
          //console.log(response.totalCount)
          if(response.totalCount > this.perPage){
            this.isVisible = true
          }
          if(response?.totalCount <= this.totalCount){
            this.isVisible = false;
          }
        },
        (error) => {
          console.error('Greška prilikom pretrage:', error);
        }
      );
  }

  buildQueryString(): string {
    const queryParams: string[] = [];
    
    if (this.selectedSortOption) {
      const [sortProperty, sortDirection] = this.parseSortOption(this.selectedSortOption);
      queryParams.push(`sorts[0].sortProperty=${encodeURIComponent(sortProperty)}`);
      queryParams.push(`sorts[0].direction=${encodeURIComponent(sortDirection)}`);
    }
    return queryParams.join('&');
  }

  parseSortOption(sortOption: string): [string, string] {
    const [property, direction] = sortOption.split(/(?=[A-Z])/); 
    return [property, direction === 'Desc' ? 'Desc' : 'Asc'];
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
