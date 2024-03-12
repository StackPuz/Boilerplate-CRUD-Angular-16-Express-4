import { Component } from '@angular/core'
import { Router, NavigationEnd } from '@angular/router'
import { BrandService } from './Brand.service'
import { Util } from '../../util.service'
import { Subscription } from 'rxjs'

@Component({
  selector: 'brand-index',
  template: `
    <div class="container">
      <div class="row">
        <div class="col">
          <div class="col-12"><input id="searchbar_toggle" type="checkbox" />
            <div id="searchbar" class="form-row mb-4">
              <div class="form-group col-lg-2">
                <select id="search_col" (change)="util.searchChange()" class="form-control form-control-sm">
                  <option value="Brand.id" data-type="number">Brand Id</option>
                  <option value="Brand.name">Brand Name</option>
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
                  <th class="{{util.getSortClass('Brand.id','asc')}}"><a (click)="util.goto($event)" href="{{util.getLink(this.paging,'sort','Brand.id','asc')}}">Id</a></th>
                  <th class="{{util.getSortClass('Brand.name')}}"><a (click)="util.goto($event)" href="{{util.getLink(this.paging,'sort','Brand.name')}}">Name</a></th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let brand of brands">
                  <td class="text-center">{{brand.id}}</td>
                  <td>{{brand.name}}</td>
                  <td class="text-center">
                    <a class="btn btn-sm btn-secondary" routerLink="/brand/{{brand.id}}" title="View"><i class="fa fa-eye"></i></a>
                    <a class="btn btn-sm btn-primary" routerLink="/brand/edit/{{brand.id}}" title="Edit"><i class="fa fa-pencil"></i></a>
                    <a class="btn btn-sm btn-danger" routerLink="/brand/delete/{{brand.id}}" title="Delete"><i class="fa fa-times"></i></a>
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
            <a class="btn btn-sm btn-primary" routerLink="/brand/create">Create</a>
          </div>
        </div>
      </div>
    </div>`
})

export class BrandIndex {

  brands?: any[]
  paging = {
    current: 1,
    size: 1,
    last: 1
  }
  routerEvents?: Subscription
  constructor(public router: Router, private BrandService: BrandService, public util: Util) { }

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
    this.BrandService.get().subscribe(data => {
      this.brands = data.brands
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