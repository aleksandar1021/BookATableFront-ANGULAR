import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivateUser, User } from '..//interfaces/user.interface';
import { development } from '../../environments/development';
import { Router } from '@angular/router';

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

  isLoggedIn(): boolean {
    const token = this.GetToken();
    return token ? true : false;
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
