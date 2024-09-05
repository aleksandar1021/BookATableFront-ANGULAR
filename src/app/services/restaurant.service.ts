import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { development } from '../../environments/development';
import { ApiResponse } from '../interfaces/apiResponse.interface';
import { Reservation } from '../interfaces/reservation.interface';
import { Saved } from '../interfaces/saved.interface';

@Injectable({
  providedIn: 'root',
})
export class RestaurantService {
    private apiUrl = development.apiUrl+ "Restaurants"; 
    private apiUrlReservation = development.apiUrl+ "Reservations"; 
    private apiUrlSaved = development.apiUrl+ "Saved"; 


    constructor(private http: HttpClient) {}

    getRestaurants(): Observable<any> {
        return this.http.get<any>(this.apiUrl);
    }

    searchRestaurantsAll(name: string, mealCategoryId: string, restaurantTypeId: string,): Observable<ApiResponse<any[]>> {
        return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}?name=${name}&mealCategoryId=${mealCategoryId}&restaurantTypeId=${restaurantTypeId}`);
    }

    getSaved(id : number): Observable<any> {
        return this.http.get<any>(this.apiUrlSaved + `?userId=${id}`);
    }

    toggleSaveRestaurant(savedData: Saved) {
        return this.http.post(`${this.apiUrlSaved}`, savedData);
    }


    getTrendyRestaurants(): Observable<any> {
        return this.http.get<any>(this.apiUrl).pipe(
            map((response: any) => {
                const restaurants = response.data;
                if (Array.isArray(restaurants)) {
                    return restaurants
                        .sort((a, b) => b.rate - a.rate)
                        .slice(0, 3); 
                }
                return []; 
            })
        );
    }


    makeReservation(reservation: Reservation): Observable<any> {
        return this.http.post(this.apiUrlReservation, reservation);
    }

    searchRestaurants(query: string): Observable<ApiResponse<any[]>> {
        return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}?name=${query}`);
    }

    getRestaurant(id: string | null): Observable<ApiResponse<any[]>> {
        return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/${id}`);
    }

    getNewestRestaurants(): Observable<any> {
        return this.http.get<any>(this.apiUrl).pipe(
            map((response: any) => {
                const restaurants = response.data;
                if (Array.isArray(restaurants)) {
                    return restaurants
                        .sort((a, b) => {
                            const dateA = new Date(a.createdAt);
                            const dateB = new Date(b.createdAt);
                            return dateB.getTime() - dateA.getTime(); 
                        })
                        .slice(0, 3); 
                }
                return []; 
            })
        );
    }
}