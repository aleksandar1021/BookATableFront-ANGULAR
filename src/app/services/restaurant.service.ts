import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { development } from '../../environments/development';
import { ApiResponse } from '../interfaces/apiResponse.interface';

@Injectable({
  providedIn: 'root',
})
export class RestaurantService {
    private apiUrl = development.apiUrl+ "Restaurants"; 

    constructor(private http: HttpClient) {}

    getRestaurants(): Observable<any> {
        return this.http.get<any>(this.apiUrl);
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

    searchRestaurants(query: string): Observable<ApiResponse<any[]>> {
        return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}?name=${query}`);
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