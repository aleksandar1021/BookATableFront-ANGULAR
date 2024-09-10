import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { development } from '../../environments/development';
import { Named, UpdateNamed } from '../interfaces/namedEntity.interface';


@Injectable({
  providedIn: 'root',
})
export class AppendiceService {
    private apiUrl = development.apiUrl+ "Appendices"; 

    constructor(private http: HttpClient) {}
    

    update(nameObj: UpdateNamed, id: number): Observable<any> {
      return this.http.put(this.apiUrl + `/${id}`, nameObj);
    }

    create(name: Named): Observable<any> {
      return this.http.post(this.apiUrl, name);
    }

    get(id:number): Observable<any> {
      return this.http.get<any>(this.apiUrl + `/${id}`);
    }

    gets(): Observable<any> {
        return this.http.get<any>(this.apiUrl);
    }
}