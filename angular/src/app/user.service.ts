import { Injectable } from '@angular/core'
  
@Injectable({
  providedIn: 'root'
})
  
export class User {
  
  user: any = null

  getUser() {
    return this.user
  }

  setUser(user: any) {
    this.user = user
  }
}