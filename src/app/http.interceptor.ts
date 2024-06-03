import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError,  } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
          catchError((error: HttpErrorResponse) => {
            let errorMessage = 'An unknown error occurred';
            if (error.error instanceof ErrorEvent) {
              errorMessage = `Error: ${error.error.message}`;
            } else {
              errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
            }
    
            alert(errorMessage); // แสดง alert
    
            return throwError(errorMessage);
          })
        );
      }
  }
