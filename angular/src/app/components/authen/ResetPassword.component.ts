import { Component } from '@angular/core'
import { HttpClient } from '@angular/common/http'

@Component({
  selector: 'resetpassword',
  template: `
    <div class="container">
      <div class="row">
        <div class="col">
          <div class="center-container">
            <div class="row justify-content-center">
              <div class="card card-width">
                <div class="card-header">
                  <h3>Reset Password</h3>
                </div>
                <div class="card-body">
                  <i class="login fa fa-user-circle"></i>
                  <form ngNativeValidate method="post" (submit)="resetPassword()">
                    <div class="row">
                      <div class="form-group col-12">
                        <label for="user_account_email">Email</label>
                        <input id="user_account_email" name="email" class="form-control form-control-sm" [(ngModel)]="user.email" type="email" required maxlength="50" />
                      </div>
                      <div class="col-12">
                        <button class="btn btn-sm btn-secondary btn-block">Reset Password</button>
                      </div>
                    </div>
                  </form>
                  <span *ngIf="result.success" class="text-success">A reset password link has been sent to your email</span>
                  <span *ngIf="result.error" class="text-danger">Email not found!</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`

})

export class ResetPassword {

  user: any = {}
  result: any = {}
  constructor(private http: HttpClient) { }

  resetPassword() {
    this.http.post('/resetPassword', this.user).subscribe(() => {
      this.result = { success: true }
    }, () => {
      this.result = { error: true }
    })
  }
}