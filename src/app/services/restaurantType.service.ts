import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { development } from '../../environments/development';
import { Named, UpdateNamed } from '../interfaces/namedEntity.interface';


@Injectable({
  providedIn: 'root',
})
export class RestaurantTypeService {
    private apiUrl = development.apiUrl+ "RestaurantTypes"; 

    constructor(private http: HttpClient) {}
    

    updateRestaurantType(nameObj: UpdateNamed, id: number): Observable<any> {
      return this.http.put(this.apiUrl + `/${id}`, nameObj);
    }

    createRestaurantType(name: Named): Observable<any> {
      return this.http.post(this.apiUrl, name);
    }

    getRestaurantType(id:number): Observable<any> {
      return this.http.get<any>(this.apiUrl + `/${id}`);
    }

    getRestaurantTypes(): Observable<any> {
        return this.http.get<any>(this.apiUrl);
    }
}