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
        return this.http.get<any>(this.apiUrl);
    }
}