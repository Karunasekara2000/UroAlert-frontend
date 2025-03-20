import { Injectable } from '@angular/core';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private baseUrl = 'http://localhost:8080/api/v1/auth/';

  constructor(private http: HttpClient) {}

  authenticate(email: string, password: string): Observable<any> {
    const body = {
      email: email,
      password: password
    };
    return this.http.post<any>(this.baseUrl+ 'authenticate', body);
  }

  register(firstName: string, lastName: string, email: string, password: string, role: string): Observable<any> {
    const body = {
      firstName,
      lastName,
      email,
      password,
      role
    };
    return this.http.post<any>(this.baseUrl + 'register', body);
  }
}
