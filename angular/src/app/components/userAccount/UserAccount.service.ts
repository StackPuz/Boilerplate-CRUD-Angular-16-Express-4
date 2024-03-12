import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})

export class UserAccountService {

  constructor(private http: HttpClient) { }

  get(id?: any): Observable<any> {
    if (id) {
      return this.http.get(`/userAccounts/${id}`)
    }
    else {
      return this.http.get('/userAccounts' + location.search)
    }
  }

  create(data?: any): Observable<any> {
    if (data) {
      return this.http.post('/userAccounts', data)
    }
    else {
      return this.http.get('/userAccounts/create')
    }
  }

  edit(id: any, data?: any): Observable<any> {
    if (data) {
      return this.http.put(`/userAccounts/${id}`, data)
    }
    else {
      return this.http.get(`/userAccounts/${id}/edit`)
    }
  }

  delete(id: any, data?: any): Observable<any> {
    if (data) {
      return this.http.delete(`/userAccounts/${id}`)
    }
    else {
      return this.http.get(`/userAccounts/${id}/delete`)
    }
  }
}