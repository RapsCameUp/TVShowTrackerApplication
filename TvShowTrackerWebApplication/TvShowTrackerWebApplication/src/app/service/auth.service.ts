import { Injectable } from '@angular/core';
import { baseUrl } from '../baseurl';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  serverUrl = baseUrl.baseUrl;

  constructor(private http: HttpClient) { }

  register(user: any): Observable<any> {
    return this.http.post(`${this.serverUrl}/user`, user);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.serverUrl}/user/login`, credentials)
      .pipe(tap((response: any) => {
        localStorage.setItem('token', response.token);
        sessionStorage.setItem('Username', credentials.username);
      }));
  }

  logout() {
    localStorage.removeItem('token');
    sessionStorage.removeItem('Username');
  }

  get token() {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
