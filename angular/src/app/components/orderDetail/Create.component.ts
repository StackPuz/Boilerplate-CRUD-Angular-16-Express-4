import { Component } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { OrderDetailService } from './OrderDetail.service'
import { Util } from '../../util.service'

@Component({
  selector: 'orderDetail-create',
  template: `
    <div class="container">
      <div class="row">
        <div class="col">
          <form ngNativeValidate method="post" (submit)="create()">
            <div class="row">
              <div class="form-group col-md-6 col-lg-4">
                <label for="order_detail_order_id">Order Id</label>
                <input id="order_detail_order_id" name="order_id" class="form-control form-control-sm" [(ngModel)]="orderDetail.order_id" type="number" required />
                <span *ngIf="errors.order_id" class="text-danger">{{errors.order_id}}</span>
              </div>
              <div class="form-group col-md-6 col-lg-4">
                <label for="order_detail_no">No</label>
                <input id="order_detail_no" name="no" class="form-control form-control-sm" [(ngModel)]="orderDetail.no" type="number" required />
                <span *ngIf="errors.no" class="text-danger">{{errors.no}}</span>
              </div>
              <div class="form-group col-md-6 col-lg-4">
                <label for="order_detail_product_id">Product</label>
                <select id="order_detail_product_id" name="product_id" class="form-control form-control-sm" [(ngModel)]="orderDetail.product_id" required>
                  <option *ngFor="let product of products" value="{{product.id}}" [selected]="orderDetail.product_id == product.id">{{product.name}}</option>
                </select>
                <span *ngIf="errors.product_id" class="text-danger">{{errors.product_id}}</span>
              </div>
              <div class="form-group col-md-6 col-lg-4">
                <label for="order_detail_qty">Qty</label>
                <input id="order_detail_qty" name="qty" class="form-control form-control-sm" [(ngModel)]="orderDetail.qty" type="number" required />
                <span *ngIf="errors.qty" class="text-danger">{{errors.qty}}</span>
              </div>
              <div class="col-12">
                <a class="btn btn-sm btn-secondary" (click)="util.goBack('/orderDetail', $event)" routerLink="/orderDetail">Cancel</a>
                <button class="btn btn-sm btn-primary">Submit</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>`
})
export class OrderDetailCreate {
  
  orderDetail?: any = {}
  products?: any[]
  errors?: any = {}
  constructor(private router: Router, private route: ActivatedRoute, private OrderDetailService: OrderDetailService, public util: Util) { }
  
  ngOnInit() {
    this.get().add(() => {
      setTimeout(() => { this.util.initView(true) })
    })
  }

  get() {
    return this.OrderDetailService.create().subscribe(data => {
      this.products = data.products
    })
  }

  create() {
    this.OrderDetailService.create(this.orderDetail).subscribe(() => {
      this.util.goBack('/orderDetail')
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