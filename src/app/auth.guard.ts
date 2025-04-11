import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './services/auth.service'; 
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, 
              private router: Router
            ) {}

  canActivate(): Observable<boolean> {
    return this.authService.isLoggedIn().pipe(
      map((isLoggedIn: boolean) => {
        if (isLoggedIn) {
          return true;
        } else {
          this.router.navigate(['/login']);
          return false;
        }
       })
    );
  }

  isAdmin() : boolean{
    if(this.authService.isAdmin()){
      return true
    }else{
      this.router.navigate(['/home']); 
      return false
    }
  }

  isRestaurantOwner() : boolean{
    if(this.authService.isRestaurantOwner()){
      return true
    }else{
      this.router.navigate(['/home']); 
      return false
    }
  }
}