import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { development } from '../../environments/development';


@Injectable({
  providedIn: 'root',
})
export class AddressService {
    private apiUrl = development.apiUrl+ "Addresses"; 

    constructor(private http: HttpClient) {}

    getRestaurantTypes(): Observable<any> {
        return this.http.get<any>(this.apiUrl);
    }
}