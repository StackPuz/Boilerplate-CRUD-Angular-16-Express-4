import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})

export class OrderHeaderService {

  constructor(private http: HttpClient) { }

  get(id?: any): Observable<any> {
    if (id) {
      return this.http.get(`/orderHeaders/${id}`)
    }
    else {
      return this.http.get('/orderHeaders' + location.search)
    }
  }

  create(data?: any): Observable<any> {
    if (data) {
      return this.http.post('/orderHeaders', data)
    }
    else {
      return this.http.get('/orderHeaders/create')
    }
  }

  edit(id: any, data?: any): Observable<any> {
    if (data) {
      return this.http.put(`/orderHeaders/${id}`, data)
    }
    else {
      return this.http.get(`/orderHeaders/${id}/edit`)
    }
  }

  delete(id: any, data?: any): Observable<any> {
    if (data) {
      return this.http.delete(`/orderHeaders/${id}`)
    }
    else {
      return this.http.get(`/orderHeaders/${id}/delete`)
    }
  }
}