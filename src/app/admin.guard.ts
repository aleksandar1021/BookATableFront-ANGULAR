import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export const adminGuard: CanActivateChildFn = (childRoute, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAdmin().pipe(
    map((isAdmin: boolean) => {
      if (isAdmin) {
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
