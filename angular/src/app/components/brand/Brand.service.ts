import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})

export class BrandService {

  constructor(private http: HttpClient) { }

  get(id?: any): Observable<any> {
    if (id) {
      return this.http.get(`/brands/${id}`)
    }
    else {
      return this.http.get('/brands' + location.search)
    }
  }

  create(data?: any): Observable<any> {
    if (data) {
      return this.http.post('/brands', data)
    }
    else {
      return this.http.get('/brands/create')
    }
  }

  edit(id: any, data?: any): Observable<any> {
    if (data) {
      return this.http.put(`/brands/${id}`, data)
    }
    else {
      return this.http.get(`/brands/${id}/edit`)
    }
  }

  delete(id: any, data?: any): Observable<any> {
    if (data) {
      return this.http.delete(`/brands/${id}`)
    }
    else {
      return this.http.get(`/brands/${id}/delete`)
    }
  }
}