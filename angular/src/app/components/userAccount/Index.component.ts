import { Component } from '@angular/core'
import { Router, NavigationEnd } from '@angular/router'
import { UserAccountService } from './UserAccount.service'
import { Util } from '../../util.service'
import { Subscription } from 'rxjs'

@Component({
  selector: 'userAccount-index',
  template: `
    <div class="container">
      <div class="row">
        <div class="col">
          <div class="col-12"><input id="searchbar_toggle" type="checkbox" />
            <div id="searchbar" class="form-row mb-4">
              <div class="form-group col-lg-2">
                <select id="search_col" (change)="util.searchChange()" class="form-control form-control-sm">
                  <option value="UserAccount.id" data-type="number">User Account Id</option>
                  <option value="UserAccount.name">User Account Name</option>
                  <option value="UserAccount.email">User Account Email</option>
                  <option value="UserAccount.active">User Account Active</option>
                </select>
              </div>
              <div class="form-group col-lg-2">
                <select id="search_oper" class="form-control form-control-sm">
                  <option value="c">Contains</option>
                  <option value="e">Equals</option>
                  <option value="g">&gt;</option>
                  <option value="ge">&gt;&#x3D;</option>
                  <option value="l">&lt;</option>
                  <option value="le">&lt;&#x3D;</option>
                </select>
              </div>
              <div class="form-group col-lg-2">
                <input id="search_word" autocomplete="off" (keyup)="util.search($event)" class="form-control form-control-sm" />
              </div>
              <div class="col">
                <button class="btn btn-primary btn-sm" (click)="util.search()">Search</button>
                <button class="btn btn-secondary btn-sm" (click)="util.clearSearch()">Clear</button>
              </div>
            </div>
            <table class="table table-sm table-striped table-hover">
              <thead>
                <tr>
                  <th class="{{util.getSortClass('UserAccount.id','asc')}}"><a (click)="util.goto($event)" href="{{util.getLink(this.paging,'sort','UserAccount.id','asc')}}">Id</a></th>
                  <th class="{{util.getSortClass('UserAccount.name')}}"><a (click)="util.goto($event)" href="{{util.getLink(this.paging,'sort','UserAccount.name')}}">Name</a></th>
                  <th class="{{util.getSortClass('UserAccount.email') + ' d-none d-md-table-cell'}}"><a (click)="util.goto($event)" href="{{util.getLink(this.paging,'sort','UserAccount.email')}}">Email</a></th>
                  <th class="{{util.getSortClass('UserAccount.active')}}"><a (click)="util.goto($event)" href="{{util.getLink(this.paging,'sort','UserAccount.active')}}">Active</a></th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let userAccount of userAccounts">
                  <td class="text-center">{{userAccount.id}}</td>
                  <td>{{userAccount.name}}</td>
                  <td class="d-none d-md-table-cell">{{userAccount.email}}</td>
                  <td class="text-center">{{(userAccount.active ? '✓' : '✗')}}</td>
                  <td class="text-center">
                    <a class="btn btn-sm btn-secondary" routerLink="/userAccount/{{userAccount.id}}" title="View"><i class="fa fa-eye"></i></a>
                    <a class="btn btn-sm btn-primary" routerLink="/userAccount/edit/{{userAccount.id}}" title="Edit"><i class="fa fa-pencil"></i></a>
                    <a class="btn btn-sm btn-danger" routerLink="/userAccount/delete/{{userAccount.id}}" title="Delete"><i class="fa fa-times"></i></a>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="row mb-1">
              <div class="col-md-3 col-6">
                <label>Show
                  <select id="page_size" (change)="util.goto($event)">
                    <option value="{{util.getLink(this.paging,'size',10)}}" [selected]="this.paging.size == 10">10</option>
                    <option value="{{util.getLink(this.paging,'size',20)}}" [selected]="this.paging.size == 20">20</option>
                    <option value="{{util.getLink(this.paging,'size',30)}}" [selected]="this.paging.size == 30">30</option>
                  </select>
                  entries
                </label>
              </div>
              <div class="col-md-9 col-6">
                <div class="float-right d-none d-md-block">
                  <ul class="pagination flex-wrap">
                    <li class="page-item{{this.paging.current <= 1 ? ' disabled' : ''}}"><a class="page-link" (click)="util.goto($event)" href="{{util.getLink(this.paging,'page',this.paging.current-1)}}">Prev</a></li>
                    <li *ngFor="let page of util.getPages(this.paging.last)" class="page-item{{this.paging.current == page ? ' active' : ''}}"><a class="page-link" (click)="util.goto($event)" href="{{util.getLink(this.paging,'page',page)}}">{{page}}</a></li>
                    <li class="page-item{{this.paging.current >= this.paging.last ? ' disabled' : ''}}"><a class="page-link" (click)="util.goto($event)" href="{{util.getLink(this.paging,'page',this.paging.current+1)}}">Next</a></li>
                  </ul>
                </div>
                <div class="float-right d-block d-md-none">
                  <label> Page
                    <select id="page_index" (change)="util.goto($event)">
                      <option *ngFor="let page of util.getPages(this.paging.last)" value="{{util.getLink(this.paging,'page',page)}}" [selected]="this.paging.current == page">{{page}}</option>
                    </select>
                  </label> of <span>{{this.paging.last}}</span>
                  <div class="btn-group">
                    <a class="btn btn-primary btn-sm{{this.paging.current <= 1 ? ' disabled' : ''}}" (click)="util.goto($event)" href="{{util.getLink(this.paging,'page',this.paging.current-1)}}"><i class="fa fa-chevron-left"></i></a>
                    <a class="btn btn-primary btn-sm{{this.paging.current >= this.paging.last ? ' disabled' : ''}}" (click)="util.goto($event)" href="{{util.getLink(this.paging,'page',this.paging.current+1)}}"><i class="fa fa-chevron-right"></i></a>
                  </div>
                </div>
              </div>
            </div>
            <a class="btn btn-sm btn-primary" routerLink="/userAccount/create">Create</a>
          </div>
        </div>
      </div>
    </div>`
})

export class UserAccountIndex {

  userAccounts?: any[]
  paging = {
    current: 1,
    size: 1,
    last: 1
  }
  routerEvents?: Subscription
  constructor(public router: Router, private UserAccountService: UserAccountService, public util: Util) { }

  ngOnInit() {
    this.util.initView()
    this.get()
    this.routerEvents = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (this.router.getCurrentNavigation()?.previousNavigation) {
          this.get()
        }
      }
    })
  }

  ngOnDestroy() {
    this.routerEvents?.unsubscribe()
  }
  
  get() {
    this.UserAccountService.get().subscribe(data => {
      this.userAccounts = data.userAccounts
      let query = this.util.getQuery()
      this.paging = {
        current: parseInt(query.page) || 1,
        size: parseInt(query.size) || 10,
        last: data.last
      }
    }, e => {
      alert(e.error.message)
    })
  }
}