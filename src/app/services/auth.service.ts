import { Injectable } from '@angular/core';
import {  CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate{

  constructor(private router:Router) { }

  canActivate(): boolean {
    const token = localStorage.getItem('authtoken');
    if (token) {
      // Optionally, check the expiration of the token
      const isExpired = this.isTokenExpired(token);
      if (isExpired) {
        this.logout(); // If expired, logout
        return false;
      }
      console.log("not expired")
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }

  isTokenExpired(token: string): boolean {
    const decodedToken = this.decodeToken(token);
    if (!decodedToken) {
      return true;
    }
    const expiry = decodedToken.exp * 1000; // convert to milliseconds
    return Date.now() > expiry; // Check if token has expired
  }

  decodeToken(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  }

  logout(): void {
    localStorage.removeItem('authtoken');
    this.router.navigate(['/login']);
  }
}
