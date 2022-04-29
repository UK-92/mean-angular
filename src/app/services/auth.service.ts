import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthData } from './auth-data';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  private token: any;
  private authStateListener = new Subject<boolean>();
  isAuthenticated: boolean = false;
  tokenTimer: any;
  userId: string | any;

  constructor(private httpClient: HttpClient, private router: Router) { }




  getToken() {
    return this.token;
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }

  getAuthStatuListener() {
    return this.authStateListener.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password
    };
    return this.httpClient.post<{}>("http://localhost:3000/api/auth/signup", authData)
      .subscribe(response => {
        this.router.navigateByUrl("/login");
      }, error => {
          this.authStateListener.next(false);
      });
  }

  login(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password
    };
    this.httpClient.post<{ token: string, expiresIn: number , userId: string}>("http://localhost:3000/api/auth/login", authData)
      .subscribe(response => {
        this.token = response.token;
        if (this.token) {
          const expiresIn = response.expiresIn
          this.setAuthTimer(expiresIn);
          this.isAuthenticated = true;
          this.authStateListener.next(true);
          this.userId = response.userId;
          this.saveAuthData(this.token, new Date(new Date().getTime() + expiresIn * 1000), response.userId);
          this.router.navigateByUrl("/");
        }
      }, error => {
        this.authStateListener.next(false);
    });
  }

  getUserId() {
    return this.userId;
  }

  autoAuthUser() {
    const authData = this.getAuthData();
    if (authData) {
      const expiresIn = authData.expirationDate.getTime() - new Date().getTime();
      if (expiresIn > 0) {
        this.token = authData.token;
        this.userId = authData.userId;
        this.isAuthenticated = true;
        this.authStateListener.next(true);
        this.setAuthTimer(expiresIn/1000);
      }
    }
  }

  logOut() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStateListener.next(false);
    this.router.navigateByUrl("/");
    this.userId = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('expirationDate', expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('expirationDate');
  }


  private getAuthData() {
    const token = localStorage.getItem('token');
    const expiration = localStorage.getItem('expirationDate');
    const userId = localStorage.getItem('userId');
    if (token && expiration && userId) {
      return { token: token, expirationDate: new Date(expiration), userId: userId };
    } else {
      return;
    }
  }

  private setAuthTimer(expiresIn: number) {
    this.tokenTimer = setTimeout(() => {
      this.logOut();
    }, expiresIn * 1000);
  }
}



