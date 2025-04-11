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

    updateRestaurant(data: any, id:any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/${id}`, data);
    }
    
    getRestaurantById(id: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${id}`);
    }

    delete(id: number): Observable<any> {
        const url = `${this.apiUrl}/${id}/Admin`;
        return this.http.delete(url);
    }

    deleteUser(id: number): Observable<any> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.delete(url);
    }

    applyRestaurant(restaurant: any): Observable<any> {
        return this.http.post(this.apiUrl, restaurant);
    }

    activateRestaurant(id: number ,restaurant: any): Observable<any> {
        return this.http.patch(this.apiUrl+`/${id}`, restaurant);
    }


    getRestaurants(): Observable<any> {
        return this.http.get<any>(this.apiUrl);
    }

    getRestaurantsUser(perPage:number, keyword:string, userId: number): Observable<any> {
        return this.http.get<any>(this.apiUrl+ `/User?perPage=${perPage}&keyword=${keyword}&userId=${userId}`);
    }

    getRestaurantsAdmin(perPage:number, keyword:string): Observable<any> {
        return this.http.get<any>(this.apiUrl+ `/Admin?perPage=${perPage}&keyword=${keyword}`);
    }

    searchRestaurantsAll(name: string, mealCategoryId: string, restaurantTypeId: string, sorts: string, totalCount: number): Observable<ApiResponse<any[]>> {
        return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}?name=${name}&mealCategoryId=${mealCategoryId}&restaurantTypeId=${restaurantTypeId}&${sorts}&perPage=${totalCount}`);
    }

    getSaved(id : number): Observable<any> {
        return this.http.get<any>(this.apiUrlSaved + `?userId=${id}&perPage=999`);
    }

    toggleSaveRestaurant(savedData: Saved) {
        return this.http.post(`${this.apiUrlSaved}`, savedData);
    }


    getTrendyRestaurants2(): Observable<any> {
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

    getTrendyRestaurants(): Observable<ApiResponse<any[]>> {
        return this.http.get<ApiResponse<any[]>>(this.apiUrl + `/Top?perPage=3`)
        
    }
    


    makeReservation(reservation: Reservation): Observable<any> {
        return this.http.post(this.apiUrlReservation, reservation);
    }

    searchRestaurants(query: string): Observable<ApiResponse<any[]>> {
        return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}?name=${query}`);
    }

    getRestaurant(id: string | null): Observable<ApiResponse<any[]>> {
        return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/${id}/Admin`);
    }

    getRestaurantClient(id: string | null): Observable<ApiResponse<any[]>> {
        return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/${id}`);
    }

    getNewestRestaurants(): Observable<ApiResponse<any[]>> {
        return this.http.get<ApiResponse<any[]>>(this.apiUrl + `?sorts[0].sortProperty=created&sorts[0].direction=Desc&perPage=3`)
        
    }
}