import { HttpInterceptorFn } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { RefreshTokenService } from '../services/refresh-token.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router); // Using Angular's new inject function

  const refreshtokenservice = inject(RefreshTokenService)
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unknown error occurred!';

     

       // Check if the error is due to token expiration (403 status)
       if (error.status === 403) {
        return refreshtokenservice.refreshToken().pipe(
          switchMap(() => {
            // Attempt to get the new token
            const newAccessToken = localStorage.getItem('authtoken') ?? '';
            if (!newAccessToken) {
              // No new token found; navigate to login
              router.navigate(['/login']);
              return throwError(() => new Error('Token refresh failed, please log in.'));
            }

            // Clone the original request with the new token
            const authReq = req.clone({
              headers: req.headers.set('Authorization', `Bearer ${newAccessToken}`)
            });
            // Retry the original request with the new token
            return next(authReq);
          }),
          catchError(refreshError => {
            // Handle errors that occur during token refresh
            console.error('Token refresh failed:', refreshError);
            router.navigate(['/login']);
            return throwError(() => new Error('Token refresh failed, please log in.'));
          })
        );
      }


      if (req.responseType === 'blob') {
        // Skip JSON parsing for Blob responses
        errorMessage = 'Error loading video file.';
        console.error("Blob response error:", error);
      } else if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = `Client-side error: ${error.error.message}`;
          console.log("error is ", errorMessage)
        } else {
          // Server-side error
          errorMessage = error.error.message || 'Server-side error: Something went wrong on the backend.';
        }

      // Navigate to the error page with the error message as query params
      router.navigate(['/error'], { queryParams: { message: errorMessage } });

      return throwError(() => new Error(errorMessage));
    })
  );
};
