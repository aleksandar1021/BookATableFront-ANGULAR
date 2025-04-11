import { Component, OnInit } from '@angular/core';
import { RestaurantService } from '../../../../services/restaurant.service';
import { ActivatedRoute } from '@angular/router';
import { development } from '../../../../../environments/development';
@Component({
  selector: 'app-read-more',
  templateUrl: './read-more.component.html',
  styleUrl: '../../admin-layout/admin-layout.component.scss'
})
export class ReadMoreComponent implements OnInit{

  restaurant:any;
  id:any;
  url = development.restaurantImageUrl
  dishUrl = development.dishImageUrl
  
  constructor(private restaurantService: RestaurantService, private route: ActivatedRoute){

  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.get()
  }


  get(): void {
    this.restaurantService.getRestaurant(this.id).subscribe(
      (response: any) => {  
        this.restaurant = response;
        //console.log(response)
      },
      (error) => {
        console.error('There was an error', error);
      }
    );
  }
}
