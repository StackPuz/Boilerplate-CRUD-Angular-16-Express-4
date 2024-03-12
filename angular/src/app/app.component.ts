import { Component } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Location } from '@angular/common'
import { Router, RouterOutlet, NavigationEnd } from '@angular/router'
import { Subscription } from 'rxjs'
import { User } from './user.service'
import { Util } from './util.service'

@Component({
  selector: 'app-root',
  template: `
    <div *ngIf="isReady">
      <div *ngIf="user.getUser(); else guest">
        <div class="wrapper">
          <input id="sidebar_toggle" type="checkbox" />
          <nav id="sidebar">
            <a routerLink="/" class="bg-light border-bottom">
              <h4>StackPuz</h4>
            </a>
            <ul class="list-unstyled">
              <li>
                <a routerLink="/home" class="{{url.pathname.endsWith('/home') ? 'active bg-primary' : ''}}">Home</a>
              </li>
              <li *ngFor="let menu of user.getUser().menu || []"><a routerLink="/{{menu.path}}" class="{{url.pathname.substr(1).split('/')[0] == menu.path ? 'active bg-primary' : ''}}">{{menu.title}}</a></li>
            </ul>
          </nav>
          <div id="body">
            <nav class="navbar bg-light border-bottom">
              <label for="sidebar_toggle" class=" btn btn-primary btn-sm"><i class="fa fa-bars"></i></label>
              <ul class="navbar-nav ml-auto">
                <li *ngIf="isSearch">
                  <a class="nav-link text-secondary" href="#"><label for="searchbar_toggle" class="d-lg-none"><i class="fa fa-search"></i></label></a>
                </li>
                <li class="dropdown">
                  <a class="nav-link text-secondary dropdown-toggle" data-toggle="dropdown" href="#"><i class="fa fa-user"></i> <span class="d-none d-lg-inline"> {{user.getUser().name}}</span></a>
                  <div class="dropdown-menu dropdown-menu-right">
                    <a routerLink="/profile" class="dropdown-item"><i class="fa fa-user"></i> Profile</a>
                    <a routerLink="/logout" class="dropdown-item"><i class="fa fa-sign-out"></i> Logout</a>
                  </div>
                </li>
              </ul>
            </nav>
            <div class="content">
              <router-outlet (activate)="onActivate(outlet)" #outlet="outlet"></router-outlet>
            </div>
          </div>
        </div>
      </div>
      <ng-template #guest>
        <router-outlet></router-outlet>
      </ng-template>
    </div>`
})

export class AppComponent {

  isReady = false
  isSearch = true
  url: any
  routerEvents?: Subscription
  constructor(private router: Router, private http: HttpClient, public location: Location, public user: User, public util: Util) { }

  ngOnInit() {
    this.url = location
    this.util.setHistory()
    this.routerEvents = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (this.router.getCurrentNavigation()?.previousNavigation) {
          this.util.setHistory()
        }
      }
    })
    this.http.get('/user').subscribe(data => {
      this.user.setUser(data)
      this.isReady = true
    }, error => {
      this.isReady = true
    })
  }
  ngOnDestroy() {
    this.routerEvents?.unsubscribe()
  }
  onActivate(outlet: RouterOutlet) {
    this.isSearch = outlet.activatedRoute.component!.name.endsWith('Index')
  }
}