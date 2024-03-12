import { Component } from '@angular/core'
import { Router } from '@angular/router'
import { HttpClient } from '@angular/common/http'
import { User } from '../../user.service'

@Component({
  selector: 'login',
  template: `
    <div class="container">
      <div class="row">
        <div class="col">
          <div class="center-container">
            <div class="row justify-content-center">
              <div class="card card-width">
                <div class="card-header">
                  <h3>Login</h3>
                </div>
                <div class="card-body">
                  <i class="login fa fa-user-circle"></i>
                  <form ngNativeValidate method="post" (submit)="login()">
                    <div class="row">
                      <div class="form-group col-12">
                        <label for="user_account_name">User Name</label>
                        <input id="user_account_name" name="name" class="form-control form-control-sm" [(ngModel)]="user.name" required maxlength="50" />
                      </div>
                      <div class="form-group col-12">
                        <label for="user_account_password">Password</label>
                        <input id="user_account_password" name="password" class="form-control form-control-sm" [(ngModel)]="user.password" type="password" required maxlength="100" />
                      </div>
                      <div class="col-12">
                        <button class="btn btn-sm btn-secondary btn-block">Login</button>
                        <a routerLink="/resetPassword">Forgot Password?</a>
                      </div>
                    </div>
                  </form>
                  <span *ngIf="error" class="text-danger">{{error.message}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`

})
export class Login {

  user: any = {}
  error: any = {}
  constructor(private http: HttpClient, private router: Router, private userService: User) { }

  ngOnInit() {
    if (this.userService.getUser()) {
      this.router.navigateByUrl(history.state.redirect || '/home')
    }
  }

  login() {
    this.http.post('/login', this.user).subscribe((data: any) => {
      this.userService.setUser(data.user)
      localStorage.setItem('express_token', data.token)
    }, e => {
      this.error = e.error
    })
  }
}