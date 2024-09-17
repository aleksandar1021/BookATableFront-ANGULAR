import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export const restaurantOwnerGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isRestaurantOwner().pipe(
    map((isRestaurant: boolean) => {
      if (isRestaurant) {
        return true;  
      } else {
        router.navigate(['/home']);  
        return false;
      }
    }),
    catchError((error) => {
      console.error('Error in adminGuard:', error);
      router.navigate(['/home']);  
      return of(false);
    })
  );
};
