import { Component } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { BrandService } from './Brand.service'
import { Util } from '../../util.service'

@Component({
  selector: 'brand-detail',
  template: `
    <div class="container">
      <div class="row">
        <div class="col">
          <form ngNativeValidate method="post">
            <div class="row">
              <div class="form-group col-md-6 col-lg-4">
                <label for="brand_id">Id</label>
                <input readonly id="brand_id" name="id" class="form-control form-control-sm" value="{{brand.id}}" type="number" required />
              </div>
              <div class="form-group col-md-6 col-lg-4">
                <label for="brand_name">Name</label>
                <input readonly id="brand_name" name="name" class="form-control form-control-sm" value="{{brand.name}}" required maxlength="50" />
              </div>
              <div class="col-12">
                <h6>Brand's products</h6>
                <table class="table table-sm table-striped table-hover">
                  <thead>
                    <tr>
                      <th>Product Name</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let brandProduct of brandProducts">
                      <td>{{brandProduct.name}}</td>
                      <td class="text-right">{{brandProduct.price}}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="col-12">
                <a class="btn btn-sm btn-secondary" (click)="util.goBack('/brand', $event)" routerLink="/brand">Back</a>
                <a class="btn btn-sm btn-primary" [queryParams]="{ ref: util.getRef('/brand') }" routerLink="/brand/edit/{{brand.id}}">Edit</a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>`
})
export class BrandDetail {
  
  brand?: any = {}
  brandProducts?: any[]
  constructor(private route: ActivatedRoute, private BrandService: BrandService, public util: Util) { }
  
  ngOnInit() {
    this.get().add(() => {
      setTimeout(() => { this.util.initView(true) })
    })
  }

  get() {
    return this.BrandService.get(this.route.snapshot.params['id']).subscribe(data => {
      this.brand = data.brand
      this.brandProducts = data.brandProducts
    })
  }
}