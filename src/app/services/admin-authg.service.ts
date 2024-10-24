import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthgService implements CanActivate{

  constructor(private _router:Router) { }

  canActivate():boolean {
    const token = localStorage.getItem('admintoken')
    if(token){
      return true
    }else{
      this._router.navigate(['/adminlogin'])
      return false
    }
  }
}
