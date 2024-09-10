import { Component, OnInit } from '@angular/core';
import { RestaurantTypeService } from '../../../services/restaurantType.service'; 
import { GenericService } from '../../../services/generic.service';
@Component({
  selector: 'app-restaurant-types',
  templateUrl: './restaurant-types.component.html',
  styleUrl: '../admin-layout/admin-layout.component.scss'
})
export class RestaurantTypesComponent implements OnInit{
  restaurantTypes: any[] = []; 

  errorMessage : string = ''


  constructor(private restaurantTypeService:RestaurantTypeService, private genericService: GenericService){

  }

  ngOnInit(): void {
    this.getRestaurantTypes()
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

  delete(id: number) {
    this.genericService.deleteEntity(id, 'RestaurantTypes').subscribe(
      response => {
        this.restaurantTypes = this.restaurantTypes.filter(x => x.id != id);
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
}
