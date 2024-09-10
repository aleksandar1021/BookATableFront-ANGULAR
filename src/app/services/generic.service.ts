import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { development } from '../../environments/development';

@Injectable({
  providedIn: 'root'
})
export class GenericService {

  private baseUrl = development.apiUrl; 

  constructor(private http: HttpClient) {}

 
  deleteEntity<T>(id: number, endpoint: string): Observable<T> {
    const url = `${this.baseUrl}${endpoint}/${id}`;
    return this.http.delete<T>(url);
  }
}
