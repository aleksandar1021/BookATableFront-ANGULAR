import { Component, OnInit } from '@angular/core';
import { ReservationService } from '../../../services/reservation.service';
import { AuthService } from '../../../services/auth.service';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.scss'
})
export class ReservationsComponent implements OnInit{

  reservations : any = [];
  userId : any;
  apiUrlRestaurants = "http://localhost:5000/restaurantPhotos/";
  isLoaderVisible = false


  constructor(private titleService: Title,private reservationService: ReservationService, private authService: AuthService){
    this.titleService.setTitle('Book a table | Reservations');
  }

  deleteReservation(reservationId: number) {
    this.isLoaderVisible = true
    this.reservationService.deleteReservation(reservationId).subscribe(
      response => {
        this.reservations = this.reservations.filter((r: any) => r.id !== reservationId);
        this.isLoaderVisible = false
      },
      error => {
        console.error('Error deleting reservation:', error);
        this.isLoaderVisible = false
      }
    );
  }

  getReservations(): void {
    this.reservationService.getReservations(this.userId).subscribe(
      (response: any) => {
        this.reservations = response.data;
        console.log(this.reservations)
      },
      (error) => {
        console.error('There was an error');
      }
    );
  }

  ngOnInit(): void {
      this.userId = this.authService.getUserFromToken().Id;
      this.getReservations()
  }
}
