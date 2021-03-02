import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild  } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Store } from 'src/app/_models/store';
import { finalize, map, filter } from 'rxjs/operators';
import { StoreService } from 'src/app/services/store.service';
import { AlertService } from 'src/app/services/alert.service';
import { RestApiService } from 'src/app/services/rest-api.service';


@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {
  routerSubs: Subscription;
  activeStore$: Observable<Store>;
  storeOrderDetail: any = {};
  item_count = Array;
  order_id: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private storeService: StoreService,
    private alertservice: AlertService,
    private restApiService: RestApiService,
    private location: Location,
  
  ) {
    this.routerSubs = this.route.params.subscribe(params => {
      if (params['order-id']) {
        this.order_id = params['order-id'];
        this.getOrderDetails();
      };
    })
  }

  getOrderDetails() {
    this.storeOrderDetail = {};
    this.alertservice.showLoader();
    this.restApiService.getDataObs('api/partner/orders/history/' + this.storeService.activeStore$.value.id + '/' + this.order_id).pipe(
      finalize(() => { this.alertservice.hideLoader() })
    ).subscribe(
      (resp) => {
        this.alertservice.hideLoader();
        if (resp && resp.success && resp.data) {
          this.storeOrderDetail = resp.data;
        }
      },
    )
  }
  ngOnInit(): void {
  }
  navigateRouter(path) {
    this.location.back();
  }

  addPrice(modifiers: Array<any>, itemPrice) {
    return modifiers.reduce((total, m) => {
      let optionsTotal = m.options.reduce((total, a2) => total + a2.option_price, 0);
      return total + optionsTotal;
    }, 0) + itemPrice;
  }

  addTotalPrice(items: Array<any>){
    return items.reduce((total, a2) => total + a2.total_item_price, 0);
  }



}





