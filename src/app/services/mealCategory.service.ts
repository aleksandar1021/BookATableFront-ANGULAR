import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { development } from '../../environments/development';


@Injectable({
  providedIn: 'root',
})
export class MealCategoryService {
    private apiUrl = development.apiUrl+ "MealCategories"; 

    constructor(private http: HttpClient) {}

    getMealCategories(): Observable<any> {
        return this.http.get<any>(this.apiUrl+`?perPage=999`);
    }

    create(cityObj: any): Observable<any> {
      return this.http.post(this.apiUrl, cityObj);
    }

    update(nameObj: any, id: number): Observable<any> {
      return this.http.put(this.apiUrl + `/${id}`, nameObj);
    }

    get(id:number): Observable<any> {
      return this.http.get<any>(this.apiUrl + `/${id}`);
    }
}