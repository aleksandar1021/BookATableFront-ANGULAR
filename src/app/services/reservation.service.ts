import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { development } from '../../environments/development';
import { Reservation } from '../interfaces/reservation.interface';


@Injectable({
  providedIn: 'root',
})
export class ReservationService {
    private apiUrl = development.apiUrl+ "Reservations"; 

    constructor(private http: HttpClient) {}

    makeReservation(reservation: Reservation): Observable<any> {
        return this.http.post(this.apiUrl, reservation);
    }
}