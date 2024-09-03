import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RestaurantService } from '../../../services/restaurant.service';
import { ReservationService } from '../../../services/reservation.service';
import { Reservation } from '../../../interfaces/reservation.interface';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-single',
  templateUrl: './single.component.html',
  styleUrls: ['./single.component.scss']
})
export class SingleComponent implements OnInit {
  minDate: string = '';
  maxDate: string = '';
  restaurant: any;
  id: string | null = null;
  timeSlots: string[] = [];
  numbersOfGuests: number[] = [];
  reservationForm: FormGroup;
  message: string = '';
  errorMessage: string = '';
  userId: number = 0;
  user: any;

  constructor(
    private restaurantService: RestaurantService,
    private reservationService: ReservationService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.reservationForm = this.fb.group({
      date: ['', Validators.required],
      numberOfGuests: [null, Validators.required],
      time: [null, Validators.required],
      note: [''],
      userId: [null],
      restaurantId: [null]
    });
  }

  ngOnInit(): void {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];

    const futureDate = new Date();
    futureDate.setDate(today.getDate() + 20);
    this.maxDate = futureDate.toISOString().split('T')[0];

    this.id = this.route.snapshot.queryParamMap.get('id');

    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
      this.getRestaurant();
    });

    this.user = this.authService.getUserFromToken();
    this.userId = this.user.Id;

    // Postavljanje vrednosti u formu nakon što se korisnik učita
    this.reservationForm.patchValue({
      userId: this.userId,
      restaurantId: this.id
    });
  }

  onSubmit(): void {
    //console.log(this.id);

    this.message = '';
    if (this.reservationForm.valid) {
      const reservation: Reservation = this.reservationForm.value;

      this.reservationService.makeReservation(reservation).subscribe({
        next: (response: any) => {
          this.message = 'Reservation successful, you will receive an email when the reservation is approved.';
        },
        error: (error) => {
          this.handleServerErrors(error);
        }
      });
    } else {
      this.message = 'Please fill out all required fields.';
    }
  }

  private handleServerErrors(error: any) {
    if (error.status === 422 && Array.isArray(error.error)) {
      this.clearErrors();

      error.error.forEach((err: { property: string, error: string }) => {
        const formControl = this.reservationForm.get(err.property.toLowerCase());
        if (formControl) {
          formControl.setErrors({
            serverError: err.error
          });
        }
      });
    } else {
      this.errorMessage = error.error.message;
    }
  }

  private clearErrors() {
    Object.keys(this.reservationForm.controls).forEach(key => {
      const control = this.reservationForm.get(key);
      if (control) {
        control.setErrors(null);
      }
    });
  }

  generateTimeSlots(workFromHour: number, workFromMinute: number, workUntilHour: number, workUntilMinute: number, timeInterval: number): string[] {
    const slots: string[] = [];
    let startTime = workFromHour * 60 + workFromMinute;
    let endTime = workUntilHour * 60 + workUntilMinute;
    const lastValidTime = endTime - 60;

    while (startTime <= lastValidTime) {
      const hours = Math.floor(startTime / 60);
      const minutes = startTime % 60;
      const formattedTime = `${this.padZero(hours)}:${this.padZero(minutes)}`;
      slots.push(formattedTime);
      startTime += timeInterval;
    }
    return slots;
  }

  padZero(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }

  getRestaurant(): void {
    this.restaurantService.getRestaurant(this.id).subscribe(
      (response: any) => {
        this.restaurant = response;

        const workFromHour = this.restaurant.workFromHour;
        const workFromMinute = this.restaurant.workFromMinute;
        const workUntilHour = this.restaurant.workUntilHour;
        const workUntilMinute = this.restaurant.workUntilMinute;
        let timeInterval = this.restaurant.timeInterval;

        if (timeInterval < 10) {
          timeInterval = 10;
        }

        for (let i = 1; i <= this.restaurant.maxNumberOfGuests; i++) {
          this.numbersOfGuests.push(i);
        }

        this.timeSlots = this.generateTimeSlots(workFromHour, workFromMinute, workUntilHour, workUntilMinute, timeInterval);
      },
      (error) => {
        console.error('There was an error', error);
      }
    );
  }
}
