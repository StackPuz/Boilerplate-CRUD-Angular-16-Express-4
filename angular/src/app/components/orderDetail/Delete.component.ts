import { Component } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { OrderDetailService } from './OrderDetail.service'
import { Util } from '../../util.service'

@Component({
  selector: 'orderDetail-delete',
  template: `
    <div class="container">
      <div class="row">
        <div class="col">
          <form ngNativeValidate method="post" (submit)="this.delete()">
            <div class="row">
              <div class="form-group col-md-6 col-lg-4">
                <label for="order_detail_order_id">Order Id</label>
                <input readonly id="order_detail_order_id" name="order_id" class="form-control form-control-sm" value="{{orderDetail.order_id}}" type="number" required />
              </div>
              <div class="form-group col-md-6 col-lg-4">
                <label for="order_detail_no">No</label>
                <input readonly id="order_detail_no" name="no" class="form-control form-control-sm" value="{{orderDetail.no}}" type="number" required />
              </div>
              <div class="form-group col-md-6 col-lg-4">
                <label for="product_name">Product</label>
                <input readonly id="product_name" name="product_name" class="form-control form-control-sm" value="{{orderDetail.product_name}}" maxlength="50" />
              </div>
              <div class="form-group col-md-6 col-lg-4">
                <label for="order_detail_qty">Qty</label>
                <input readonly id="order_detail_qty" name="qty" class="form-control form-control-sm" value="{{orderDetail.qty}}" type="number" required />
              </div>
              <div class="col-12">
                <a class="btn btn-sm btn-secondary" (click)="util.goBack('/orderDetail', $event)" routerLink="/orderDetail">Cancel</a>
                <button class="btn btn-sm btn-danger">Delete</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>`
})
export class OrderDetailDelete {
  
  orderDetail?: any = {}
  constructor(private router: Router, private route: ActivatedRoute, private OrderDetailService: OrderDetailService, public util: Util) { }
  
  ngOnInit() {
    this.get().add(() => {
      setTimeout(() => { this.util.initView(true) })
    })
  }

  get() {
    return this.OrderDetailService.delete(this.route.snapshot.params['orderId'], this.route.snapshot.params['no']).subscribe(data => {
      this.orderDetail = data.orderDetail
    })
  }

  delete() {
    this.OrderDetailService.delete(this.route.snapshot.params['orderId'], this.route.snapshot.params['no'], this.orderDetail).subscribe(() => {
      this.util.goBack('/orderDetail')
    }, (e) => {
      alert(e.error.message)
    })
  }
}