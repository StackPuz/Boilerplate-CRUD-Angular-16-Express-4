import { Component } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { UserAccountService } from './UserAccount.service'
import { Util } from '../../util.service'

@Component({
  selector: 'userAccount-detail',
  template: `
    <div class="container">
      <div class="row">
        <div class="col">
          <form ngNativeValidate method="post">
            <div class="row">
              <div class="form-group col-md-6 col-lg-4">
                <label for="user_account_id">Id</label>
                <input readonly id="user_account_id" name="id" class="form-control form-control-sm" value="{{userAccount.id}}" type="number" required />
              </div>
              <div class="form-group col-md-6 col-lg-4">
                <label for="user_account_name">Name</label>
                <input readonly id="user_account_name" name="name" class="form-control form-control-sm" value="{{userAccount.name}}" required maxlength="50" />
              </div>
              <div class="form-group col-md-6 col-lg-4">
                <label for="user_account_email">Email</label>
                <input readonly id="user_account_email" name="email" class="form-control form-control-sm" value="{{userAccount.email}}" type="email" required maxlength="50" />
              </div>
              <div class="form-check col-md-6 col-lg-4">
                <input readonly id="user_account_active" name="active" class="form-check-input" type="checkbox" value="userAccount.active" [checked]="userAccount.active" />
                <label class="form-check-label" for="user_account_active">Active</label>
              </div>
              <div class="col-12">
                <h6>Roles</h6>
                <table class="table table-sm table-striped table-hover">
                  <thead>
                    <tr>
                      <th>Role Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let userAccountUserRole of userAccountUserRoles">
                      <td>{{userAccountUserRole.role_name}}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="col-12">
                <a class="btn btn-sm btn-secondary" (click)="util.goBack('/userAccount', $event)" routerLink="/userAccount">Back</a>
                <a class="btn btn-sm btn-primary" [queryParams]="{ ref: util.getRef('/userAccount') }" routerLink="/userAccount/edit/{{userAccount.id}}">Edit</a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>`
})
export class UserAccountDetail {
  
  userAccount?: any = {}
  userAccountUserRoles?: any[]
  constructor(private route: ActivatedRoute, private UserAccountService: UserAccountService, public util: Util) { }
  
  ngOnInit() {
    this.get().add(() => {
      setTimeout(() => { this.util.initView(true) })
    })
  }

  get() {
    return this.UserAccountService.get(this.route.snapshot.params['id']).subscribe(data => {
      this.userAccount = data.userAccount
      this.userAccountUserRoles = data.userAccountUserRoles
    })
  }
}