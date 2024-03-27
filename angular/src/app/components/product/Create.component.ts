import { Component } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { ProductService } from './Product.service'
import { Util } from '../../util.service'

@Component({
  selector: 'product-create',
  template: `
    <div class="container">
      <div class="row">
        <div class="col">
          <form ngNativeValidate method="post" (submit)="create()" enctype="multipart/form-data">
            <div class="row">
              <div class="form-group col-md-6 col-lg-4">
                <label for="product_name">Name</label>
                <input id="product_name" name="name" class="form-control form-control-sm" [(ngModel)]="product.name" required maxlength="50" />
                <span *ngIf="errors.name" class="text-danger">{{errors.name}}</span>
              </div>
              <div class="form-group col-md-6 col-lg-4">
                <label for="product_price">Price</label>
                <input id="product_price" name="price" class="form-control form-control-sm" [(ngModel)]="product.price" type="number" step="0.1" required />
                <span *ngIf="errors.price" class="text-danger">{{errors.price}}</span>
              </div>
              <div class="form-group col-md-6 col-lg-4">
                <label for="product_brand_id">Brand</label>
                <select id="product_brand_id" name="brand_id" class="form-control form-control-sm" [(ngModel)]="product.brand_id" required>
                  <option *ngFor="let brand of brands" value="{{brand.id}}" [selected]="product.brand_id == brand.id">{{brand.name}}</option>
                </select>
                <span *ngIf="errors.brand_id" class="text-danger">{{errors.brand_id}}</span>
              </div>
              <div class="form-group col-md-6 col-lg-4">
                <label for="product_image">Image</label>
                <input type="file" accept="image/*" id="product_image" name="image" class="form-control form-control-sm" maxlength="50" />
                <span *ngIf="errors.image" class="text-danger">{{errors.image}}</span>
              </div>
              <div class="col-12">
                <a class="btn btn-sm btn-secondary" (click)="util.goBack('/product', $event)" routerLink="/product">Cancel</a>
                <button class="btn btn-sm btn-primary">Submit</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>`
})
export class ProductCreate {
  
  product?: any = {}
  brands?: any[]
  errors?: any = {}
  constructor(private router: Router, private route: ActivatedRoute, private ProductService: ProductService, public util: Util) { }
  
  ngOnInit() {
    this.get().add(() => {
      setTimeout(() => { this.util.initView(true) })
    })
  }

  get() {
    return this.ProductService.create().subscribe(data => {
      this.brands = data.brands
    })
  }

  create() {
    let data = { ...this.product }
    data.image = (document.getElementsByName('image')[0] as any).files[0]
    data = this.util.getFormData(data)
    this.ProductService.create(data).subscribe(() => {
      this.util.goBack('/product')
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