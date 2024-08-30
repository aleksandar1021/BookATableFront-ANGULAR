import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivateUser, User } from '..//interfaces/user.interface';
import { development } from '../../environments/development';
import { Router } from '@angular/router';
import { Message } from '../interfaces/message.interface';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  
  sendContactPageMessage(message : Message){
    return this.http.post(development.apiUrl + 'Contacts', message, {
        responseType: 'json',
    });
  }

 

}
