import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivateUser, User } from '..//interfaces/user.interface';
import { development } from '../../environments/development';
import { Router } from '@angular/router';
import { JsonPipe } from '@angular/common';
import { catchError, map, Observable, of, throwError } from 'rxjs';

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

  updateUser(user: User, id: number) {
    return this.http.put(development.apiUrl + `Users/${id}`, user, {
      responseType: 'json',
    });
  }


  getUser(id : number) {
    return this.http.get(development.apiUrl + `Users/${id}`)
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

  // isLoggedIn(): boolean {
  //   const token = this.GetToken();
  //   return token ? true : false;
  // }


  isRestaurantOwner(): Observable<boolean> {
    var useCases = this.getUseCases();
    if (!useCases.length) {
      return of(false);
    }
    const targetUseCases: number[] = [34, 35, 37];
    const hasAllUseCases = targetUseCases.every(target => useCases.includes(target));
    return of(hasAllUseCases);
  }
  
  isAdmin(): Observable<boolean> {
    var useCases = this.getUseCases();
  
    if (!useCases.length) {
      return of(false)
    }
  
    const targetUseCases: number[] = Array.from({ length: 90 }, (_, i) => i + 2); 
  
    return of(targetUseCases.every(target => useCases.includes(target)));
  }

  isLoggedIn(): Observable<boolean> {
    return this.http.get<boolean>('http://localhost:5000/api/Auth').pipe(
      catchError((error) => {
        if (error.status === 401 || error.status === 500) {
          return of(false); 
        }
        const tokenExpiration = this.getUserFromToken()?.exp;
        const currentTimestamp = Math.floor(Date.now() / 1000);

        if (tokenExpiration && tokenExpiration < currentTimestamp) {
          return of(false); 
        }
        return of(false); 
      })
    );
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
