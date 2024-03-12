import { Injectable } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http';
import { HttpRequest, HttpErrorResponse } from '@angular/common/http'
import { Observable, throwError } from 'rxjs'
import { HttpHandler } from '@angular/common/http'
import { HttpEvent } from '@angular/common/http'
import { catchError } from 'rxjs/operators'
import { Router } from '@angular/router'

@Injectable({
  providedIn: 'root'
})

export class AppInterceptor implements HttpInterceptor {

  baseURL = 'http://localhost:8000/api'
  constructor(private router: Router) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token = localStorage.getItem('express_token')
    return next.handle(request.clone({
      url: this.baseURL + request.url,
      headers: request.headers.set('Authorization', 'Bearer ' + token)
    })).pipe(catchError((response: HttpErrorResponse): Observable<any> => {
      if (!response.error || (!response.error.message && !response.error.errors)) {
        response = new HttpErrorResponse({
          status: response.status,
          error: {
            message: response.statusText
          }
        })
      }
      if (response.status == 401 && !location.hash) {
        this.router.navigateByUrl('/logout', { state: { redirect: (this.router.url == '/login' || this.router.url == '/logout' || this.router.url == '/' ? '' : this.router.url) }})
      }
      return throwError(response)
    }))
  }
}