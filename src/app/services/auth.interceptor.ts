import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      let token = localStorage.getItem('token'); 
  
      if (token) {
        token = token.replace(/^"|"$/g, '');
        
        const req1 = req.clone({
          headers: req.headers.set('Authorization', `Bearer ${token}`),
        });
  
        return next.handle(req1);
      } else {
        //console.warn('No token found in localStorage');
        return next.handle(req);
      }
    }
  }
