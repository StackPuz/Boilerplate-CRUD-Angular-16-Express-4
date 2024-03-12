import { Component } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { UserAccountService } from './UserAccount.service'
import { Util } from '../../util.service'

@Component({
  selector: 'userAccount-edit',
  template: `
    <div class="container">
      <div class="row">
        <div class="col">
          <form ngNativeValidate method="post" (submit)="edit()">
            <div class="row">
              <div class="form-group col-md-6 col-lg-4">
                <label for="user_account_id">Id</label>
                <input readonly id="user_account_id" name="id" class="form-control form-control-sm" [(ngModel)]="userAccount.id" type="number" required />
                <span *ngIf="errors.id" class="text-danger">{{errors.id}}</span>
              </div>
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
              <div class="form-check col-md-6 col-lg-4">
                <input id="user_account_active" name="active" class="form-check-input" type="checkbox" [(ngModel)]="userAccount.active" [checked]="userAccount.active" />
                <label class="form-check-label" for="user_account_active">Active</label>
                <span *ngIf="errors.active" class="text-danger">{{errors.active}}</span>
              </div>
              <div class="col-12">
                <h6>
                </h6><label>Roles</label>
                <div *ngFor="let role of roles" class="form-check">
                  <input id="user_role_role_id{{role.id}}" name="role_id" class="form-check-input" type="checkbox" [value]="role.id" [checked]="userAccountUserRolesChecked('role_id', role.id)" />
                  <label class="form-check-label" for="user_role_role_id{{role.id}}">{{role.name}}</label>
                </div>
              </div>
              <div class="col-12">
                <a class="btn btn-sm btn-secondary" (click)="util.goBack('/userAccount', $event)" routerLink="/userAccount">Cancel</a>
                <button class="btn btn-sm btn-primary">Submit</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>`
})
export class UserAccountEdit {
  
  userAccount?: any = {}
  userAccountUserRoles?: any[]
  roles?: any[]
  errors?: any = {}
  constructor(private router: Router, private route: ActivatedRoute, private UserAccountService: UserAccountService, public util: Util) { }
  
  ngOnInit() {
    this.get().add(() => {
      setTimeout(() => { this.util.initView(true) })
    })
  }

  get() {
    return this.UserAccountService.edit(this.route.snapshot.params['id']).subscribe(data => {
      this.userAccount = data.userAccount
      this.userAccountUserRoles = data.userAccountUserRoles
      this.roles = data.roles
    })
  }

  edit() {
    if (!this.util.validateForm()) {
      return
    }
    this.userAccount.role_id = Array.from(document.querySelectorAll('[name="role_id"]:checked')).map((e: any) => e.value)
    this.UserAccountService.edit(this.route.snapshot.params['id'], this.userAccount).subscribe(() => {
      this.util.goBack('/userAccount')
    }, (e) => {
      if (e.error.errors) {
        this.errors = e.error.errors
      }
      else {
        alert(e.error.message)
      } 
    })
  }

  userAccountUserRolesChecked(key: string, value: any) { //https://github.com/angular/angular/issues/14129
    return this.userAccountUserRoles?.some(e => e[key] == value)
  }
}