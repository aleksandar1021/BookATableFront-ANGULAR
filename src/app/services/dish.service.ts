import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { development } from '../../environments/development';
import { Reservation } from '../interfaces/reservation.interface';


@Injectable({
  providedIn: 'root',
})
export class DishService {
    private apiUrl = development.apiUrl+ "Dishs"; 

    constructor(private http: HttpClient) {}

    gets(restaurantId: number, query:string, totalCount:number): Observable<any> {
      return this.http.get(this.apiUrl + `?restaurantId=${restaurantId}&perPage=${totalCount}&name=${query}`);
    }

    create(obj: any): Observable<any> {
        return this.http.post(this.apiUrl, obj);
    }

    update(obj: any, id: number): Observable<any> {
        return this.http.put(this.apiUrl + `/${id}`, obj);
    }


    get(id:number): Observable<any> {
        return this.http.get<any>(this.apiUrl + `/${id}`);
      }

    deleteReservation(reservationId: number): Observable<any> {
      const url = `${this.apiUrl}/${reservationId}`;
      return this.http.delete(url);
    }

   
}