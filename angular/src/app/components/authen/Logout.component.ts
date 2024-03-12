import { Component } from '@angular/core'
import { Router } from '@angular/router'
import { HttpClient } from '@angular/common/http'
import { User } from '../../user.service'

@Component({
  selector: 'logout',
  template: '<span>Logout...</span>'

})
export class Logout {

  constructor(private http: HttpClient, private router: Router, private user: User) { }

  ngOnInit() {
    if (localStorage.getItem('express_token')) {
      this.logout()
    }
    else {
      this.login()
    }
  }
  logout() {
    this.http.get('/logout').toPromise().finally(() => {
      localStorage.removeItem('express_token')
      this.login()
    })
  }
  login() {
    this.user.setUser(null)
    this.router.navigateByUrl('/login', { state: history.state })
  }
}