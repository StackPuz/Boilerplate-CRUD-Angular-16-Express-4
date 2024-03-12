import { Component } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { BrandService } from './Brand.service'
import { Util } from '../../util.service'

@Component({
  selector: 'brand-edit',
  template: `
    <div class="container">
      <div class="row">
        <div class="col">
          <form ngNativeValidate method="post" (submit)="edit()">
            <div class="row">
              <input type="hidden" id="brand_id" name="id" [(ngModel)]="brand.id" />
              <div class="form-group col-md-6 col-lg-4">
                <label for="brand_name">Name</label>
                <input id="brand_name" name="name" class="form-control form-control-sm" [(ngModel)]="brand.name" required maxlength="50" />
                <span *ngIf="errors.name" class="text-danger">{{errors.name}}</span>
              </div>
              <div class="col-12">
                <a class="btn btn-sm btn-secondary" (click)="util.goBack('/brand', $event)" routerLink="/brand">Cancel</a>
                <button class="btn btn-sm btn-primary">Submit</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>`
})
export class BrandEdit {
  
  brand?: any = {}
  errors?: any = {}
  constructor(private router: Router, private route: ActivatedRoute, private BrandService: BrandService, public util: Util) { }
  
  ngOnInit() {
    this.get().add(() => {
      setTimeout(() => { this.util.initView(true) })
    })
  }

  get() {
    return this.BrandService.edit(this.route.snapshot.params['id']).subscribe(data => {
      this.brand = data.brand
    })
  }

  edit() {
    this.BrandService.edit(this.route.snapshot.params['id'], this.brand).subscribe(() => {
      this.util.goBack('/brand')
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