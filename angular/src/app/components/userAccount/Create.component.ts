import { Component } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { UserAccountService } from './UserAccount.service'
import { Util } from '../../util.service'

@Component({
  selector: 'userAccount-create',
  template: `
    <div class="container">
      <div class="row">
        <div class="col">
          <form ngNativeValidate method="post" (submit)="create()">
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
              <div class="form-check col-md-6 col-lg-4">
                <input id="user_account_active" name="active" class="form-check-input" type="checkbox" [(ngModel)]="userAccount.active" [checked]="userAccount.active" />
                <label class="form-check-label" for="user_account_active">Active</label>
                <span *ngIf="errors.active" class="text-danger">{{errors.active}}</span>
              </div>
              <div class="col-12">
                <h6>
                </h6><label>Roles</label>
                <div *ngFor="let role of roles" class="form-check">
                  <input id="user_role_role_id{{role.id}}" name="role_id" class="form-check-input" type="checkbox" [value]="role.id" />
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
export class UserAccountCreate {
  
  userAccount?: any = {}
  roles?: any[]
  errors?: any = {}
  constructor(private router: Router, private route: ActivatedRoute, private UserAccountService: UserAccountService, public util: Util) { }
  
  ngOnInit() {
    this.get().add(() => {
      setTimeout(() => { this.util.initView(true) })
    })
  }

  get() {
    return this.UserAccountService.create().subscribe(data => {
      this.roles = data.roles
    })
  }

  create() {
    this.userAccount.role_id = Array.from(document.querySelectorAll('[name="role_id"]:checked')).map((e: any) => e.value)
    this.UserAccountService.create(this.userAccount).subscribe(() => {
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
}