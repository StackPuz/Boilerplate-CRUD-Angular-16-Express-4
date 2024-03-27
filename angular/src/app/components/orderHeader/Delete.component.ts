import { Component } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { OrderHeaderService } from './OrderHeader.service'
import { Util } from '../../util.service'

@Component({
  selector: 'orderHeader-delete',
  template: `
    <div class="container">
      <div class="row">
        <div class="col">
          <form ngNativeValidate method="post" (submit)="this.delete()">
            <div class="row">
              <div class="form-group col-md-6 col-lg-4">
                <label for="order_header_id">Id</label>
                <input readonly id="order_header_id" name="id" class="form-control form-control-sm" value="{{orderHeader.id}}" type="number" required />
              </div>
              <div class="form-group col-md-6 col-lg-4">
                <label for="customer_name">Customer</label>
                <input readonly id="customer_name" name="customer_name" class="form-control form-control-sm" value="{{orderHeader.customer_name}}" maxlength="50" />
              </div>
              <div class="form-group col-md-6 col-lg-4">
                <label for="order_header_order_date">Order Date</label>
                <input readonly id="order_header_order_date" name="order_date" class="form-control form-control-sm" value="{{orderHeader.order_date}}" data-type="date" autocomplete="off" required />
              </div>
              <div class="col-12">
                <table class="table table-sm table-striped table-hover">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Product</th>
                      <th>Qty</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let orderHeaderOrderDetail of orderHeaderOrderDetails">
                      <td class="text-center">{{orderHeaderOrderDetail.no}}</td>
                      <td>{{orderHeaderOrderDetail.product_name}}</td>
                      <td class="text-right">{{orderHeaderOrderDetail.qty}}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="col-12">
                <a class="btn btn-sm btn-secondary" (click)="util.goBack('/orderHeader', $event)" routerLink="/orderHeader">Cancel</a>
                <button class="btn btn-sm btn-danger">Delete</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>`
})
export class OrderHeaderDelete {
  
  orderHeader?: any = {}
  orderHeaderOrderDetails?: any[]
  constructor(private router: Router, private route: ActivatedRoute, private OrderHeaderService: OrderHeaderService, public util: Util) { }
  
  ngOnInit() {
    this.get().add(() => {
      setTimeout(() => { this.util.initView(true) })
    })
  }

  get() {
    return this.OrderHeaderService.delete(this.route.snapshot.params['id']).subscribe(data => {
      this.orderHeader = data.orderHeader
      this.orderHeaderOrderDetails = data.orderHeaderOrderDetails
    })
  }

  delete() {
    this.OrderHeaderService.delete(this.route.snapshot.params['id'], this.orderHeader).subscribe(() => {
      this.util.goBack('/orderHeader')
    }, (e) => {
      alert(e.error.message)
    })
  }
}