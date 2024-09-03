import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivateUser, User } from '..//interfaces/user.interface';
import { development } from '../../environments/development';
import { Router } from '@angular/router';
import { JsonPipe } from '@angular/common';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  

  addUser(user: User) {
    return this.http.post(development.apiUrl + 'Users', user, {
      responseType: 'json',
    });
  }

  login(user: User) {
    return this.http.post(development.apiUrl + 'Auth', user, {
      responseType: 'json',
    });
  }

  activateUser(user: ActivateUser) {
    return this.http.patch(development.apiUrl + 'Users', user, {
      responseType: 'json',
    });
  }

  logout(): void {
    this.http.delete(development.apiUrl + 'Auth');
    localStorage.removeItem('token');
    this.router.navigateByUrl('login');
  }

  getUseCases(){
    const token : any = this.GetToken();
    if(!token){
      return of([]);
    }
    const tokenString = token
    const payloda = tokenString.split(".")[1]
    const paylodaData = JSON.parse(atob(payloda))
    return JSON.parse(paylodaData.UseCaseIds)
  }

  isLoggedIn(): boolean {
    const token = this.GetToken();
    return token ? true : false;
  }

  getUserFromToken(): any | null {
    const token = localStorage.getItem('token');
  
    if (!token) {
      return null;  
    }
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      const user = JSON.parse(jsonPayload);
      return user;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  GetToken(): string | false {
    const token = localStorage.getItem("token");
    if(token == null){
        return false;
    }
    const parts = token.split('.');
        if (parts.length !== 3) {
      return false;
    }
    const [header, payload, signature] = parts;
    if (!header || !payload || !signature) {
      return false;
    }
    
    return token;
  }

}
