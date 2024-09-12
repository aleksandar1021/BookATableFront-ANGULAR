import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivateUser, User } from '..//interfaces/user.interface';
import { development } from '../../environments/development';
import { Router } from '@angular/router';
import { Message } from '../interfaces/message.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  private mealUrl = development.apiUrl + "MealCategories";

  sendContactPageMessage(message : Message){
    return this.http.post(development.apiUrl + 'Contacts', message, {
        responseType: 'json',
    });
  }

  getMealCategories(): Observable<any> {
    return this.http.get<any>(this.mealUrl);
  }

  
  

}
