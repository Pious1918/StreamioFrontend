import { HttpInterceptorFn } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router); // Using Angular's new inject function

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unknown error occurred!';
      
      // Check if the error is from the backend (server-side error)
      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Client-side error: ${error.error.message}`;
        console.log("error is ",errorMessage)
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
