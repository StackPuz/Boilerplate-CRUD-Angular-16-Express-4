import { Component } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { HttpClient } from '@angular/common/http'
import { Util } from '../util.service'

@Component({
  selector: 'profile',
  template: `
    <div class="container">
      <div class="row">
        <div class="col">
          <form ngNativeValidate method="post" (submit)="edit()">
            <div class="row">
              <div class="form-group col-md-6 col-lg-4">
                <label for="user_account_name">Name</label>
                <input id="user_account_name" name="name" class="form-control form-control-sm" [(ngModel)]="userAccount.name" required maxlength="50" />
                <span *ngIf="errors.name" class="text-danger">{{errors.name}}</span>
              </div>
              <div class="form-group col-md-6 col-lg-4">
                <label for="user_account_email">Email</label>
                <input id="user_account_email" name="email" class="form-control form-control-sm" [(ngModel)]="userAccount.email" type="email" required maxlength="50" />
                <span *ngIf="errors.email" class="text-danger">{{errors.email}}</span>
              </div>
              <div class="form-group col-md-6 col-lg-4">
                <label for="user_account_password">Password</label>
                <input id="user_account_password" name="password" class="form-control form-control-sm" [(ngModel)]="userAccount.password" type="password" placeholder="New password" maxlength="100" />
                <span *ngIf="errors.password" class="text-danger">{{errors.password}}</span>
              </div>
              <div class="form-group col-md-6 col-lg-4">
                <label for="user_account_password2">Confirm password</label>
                <input data-match="user_account_password" id="user_account_password2" name="password2" class="form-control form-control-sm" type="password" placeholder="New password" maxlength="100" />
                <span *ngIf="errors.password" class="text-danger">{{errors.password}}</span>
              </div>
              <div class="col-12">
                <button class="btn btn-sm btn-primary">Submit</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>`
})
export class Profile {
  
  userAccount?: any = {}
  errors?: any = {}
  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, public util: Util) { }
  
  ngOnInit() {
    this.get().add(() => {
      setTimeout(() => { this.util.initView(true) })
    })
  }

  get() {
    return this.http.get('/profile').subscribe((data: any) => {
      this.userAccount = data.userAccount
    })
  }

  edit() {
    if (!this.util.validateForm()) {
      return
    }
    this.http.post('/updateProfile', this.userAccount).subscribe(() => {
      this.router.navigateByUrl('/home')
    }, (e) => {
      if (e.error.errors) {
        this.errors = e.error.errors
      }
      else {
        alert(e.error.message)
      } 
    })
  }
}