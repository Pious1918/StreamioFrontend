import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RefreshTokenService {



  

  private _refreshtokenUrl = 'https://streamiobackend.ddns.net/user-service/refresh-token'
  constructor(private _http:HttpClient , private router:Router) { }

  refreshToken(){

    const refreshToken = localStorage.getItem('userRefreshtoken')
    if(!refreshToken){
      this.router.navigate(['/login'])
    }

    return this._http.post<{accessToken:string , refreshToken?:string}>(this._refreshtokenUrl, {refreshToken}).pipe(
      switchMap(response=>{
        localStorage.setItem('authtoken', response.accessToken);
        if(response.refreshToken){
          localStorage.setItem('userRefreshtoken', response.refreshToken)
        }
        return response.accessToken
      }),
      catchError((error:HttpErrorResponse)=>{
        console.error("token refresh failed", error);
        this.router.navigate(['/login']);
        return throwError(()=> new Error('Token refresh failed'))
      })
    )
  }
}
