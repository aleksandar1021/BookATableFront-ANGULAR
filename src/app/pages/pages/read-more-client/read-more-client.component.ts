import { Component, OnInit } from '@angular/core';
import { RestaurantService } from '../../../services/restaurant.service';
import { ActivatedRoute } from '@angular/router';
import { development } from '../../../../environments/development';
@Component({
  selector: 'app-read-more-client',
  templateUrl: './read-more-client.component.html',
  styleUrl: '../../adminPages/admin-layout/admin-layout.component.scss'
})
export class ReadMoreClientComponent implements OnInit{

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
    this.restaurantService.getRestaurantClient(this.id).subscribe(
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
