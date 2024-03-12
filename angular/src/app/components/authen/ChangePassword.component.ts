import { Component } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { HttpClient } from '@angular/common/http'
import { Util } from '../../util.service'

@Component({
  selector: 'changepassword',
  template: `
    <div class="container">
      <div class="row">
        <div class="col">
          <div class="center-container">
            <div class="row justify-content-center">
              <div class="card card-width">
                <div class="card-header">
                  <h3>Change Password</h3>
                </div>
                <div class="card-body">
                  <i class="login fa fa-user-circle"></i>
                  <form ngNativeValidate method="post" (submit)="changePassword()">
                    <div class="row">
                      <div class="form-group col-12">
                        <label for="user_account_password">Password</label>
                        <input id="user_account_password" name="password" class="form-control form-control-sm" [(ngModel)]="user.password" type="password" required maxlength="100" />
                      </div>
                      <div class="form-group col-12">
                        <label for="user_account_password2">Confirm password</label>
                        <input data-match="user_account_password" id="user_account_password2" name="password2" class="form-control form-control-sm" type="password" required maxlength="100" />
                      </div>
                      <div class="col-12">
                        <button class="btn btn-sm btn-secondary btn-block">Change Password</button>
                      </div>
                    </div>
                  </form>
                  <span *ngIf="result.success" class="text-success">Change password done</span>
                  <span *ngIf="result.error" class="text-danger">Token not found!</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`

})

export class ChangePassword {

  user: any = {}
  result: any = {}
  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, public util: Util) { }

  ngOnInit() {
    return this.http.get('/changePassword/' + this.route.snapshot.params['token']).toPromise().catch(data => {
      alert('Token not found!')
      this.router.navigateByUrl('/login')
    })
  }

  changePassword() {
    if (!this.util.validateForm()) {
      return
    }
    return this.http.post('/changePassword/' + this.route.snapshot.params['token'], this.user).subscribe(data => {
      this.result = { success: true }
    }, () => {
      this.result = { error: true }
    })
  }
}