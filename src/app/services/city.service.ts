import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { development } from '../../environments/development';


@Injectable({
  providedIn: 'root',
})
export class CityService {
    private apiUrl = development.apiUrl+ "Cities"; 

    constructor(private http: HttpClient) {}

    getCities(): Observable<any> {
        return this.http.get<any>(this.apiUrl);
    }
}