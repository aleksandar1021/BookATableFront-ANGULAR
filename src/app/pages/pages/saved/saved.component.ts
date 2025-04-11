import { Component, OnInit } from '@angular/core';
import { RestaurantService } from '../../../services/restaurant.service'
import { AuthService } from '../../../services/auth.service'
import { development } from '../../../../environments/development';
import { Saved } from '../../../interfaces/saved.interface';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-saved',
  templateUrl: './saved.component.html',
  styleUrl: './saved.component.scss'
})
export class SavedComponent implements OnInit{
  saveds : any;
  apiUrlRestaurants : string = "http://localhost:5000/restaurantPhotos/"


  constructor(private restaurantService: RestaurantService, 
              private authService: AuthService,
              private titleService: Title
            ){
    this.titleService.setTitle('Book a table | Saved');
  }

  ngOnInit(): void {
      this.getSaved()
  }

  toggleSave(saved: any) {
    const userId = this.authService.getUserFromToken().Id;
  
    const savedData: Saved = {
      userId: userId,
      restaurantId: saved.restaurantId
    };
  
    this.restaurantService.toggleSaveRestaurant(savedData).subscribe(
      response => {
        this.saveds = this.saveds.filter((r: any) => r.id !== saved.id);

      },
      error => {
        console.error('Error saving restaurant:', error);
      }
    );
  }

  getSaved(): void {
    this.restaurantService.getSaved(this.authService.getUserFromToken().Id).subscribe(
      (response: any) => {
        this.saveds = response.data;
        //console.log(this.saveds)
      },
      (error) => {
        console.error('There was an error');
      }
    );
  }
}
