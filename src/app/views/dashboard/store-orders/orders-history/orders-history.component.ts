import { Component, OnInit, ViewChild } from '@angular/core';
import { StoreOrdersService } from '../_services/store-orders.service';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/services/alert.service';
import { SearchQueryGeneratorComponent } from 'src/app/views/shared/components/search-query-generator/search-query-generator.component';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Pagination } from 'src/app/_models/Pagination';
import { HttpClient } from '@angular/common/http';
import { StoreService } from 'src/app/services/store.service';
import { RestApiService } from 'src/app/services/rest-api.service';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-orders-history',
  templateUrl: './orders-history.component.html',
  styleUrls: ['./orders-history.component.scss'],
})
export class OrdersHistoryComponent implements OnInit {
  routerSubs: Subscription;
  pageNumber: number = 1;
  //storeOrders = new Array();
  orderType: String;
  status: string = '';
  loader: any;
  isDone = true;
  store: any;
  order_id: any;
  orderHistory: Array<{ order_id: number, customer_name: string, type: string, ordered_at: string, total_price: number }>;
  paginationData: Pagination<any>;
  constructor(private storeOrdersService: StoreOrdersService,
    private authService: AuthenticationService,
    private storeService: StoreService,
    private alertservice: AlertService,
    private restApiService: RestApiService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient) {
    this.routerSubs = this.route.params.subscribe(params => {
      if (params['order-type']) {
        this.orderType = params['order-type'];
        if (params['order-type'] == 'history') {
          this.status = 'HISTORY';
        }
        if (params['order-id']) {
          this.order_id = params['order-id'];
        }
      };
    });
  }
  @ViewChild('queryGen', { read: SearchQueryGeneratorComponent }) queryGen: SearchQueryGeneratorComponent
  querySubs: Subscription;

  ngOnInit() {
  }

  paginationSource = (query: { [any: string]: string }) => {this.orderHistory = null; return this.storeOrdersService.storeOrdersPagination(query); }
  
  handleData(paginationData: Pagination<{order_id: number, customer_name: string, type: string, ordered_at: string, total_price: number}>) {
    this.orderHistory = paginationData.orders;
    this.paginationData = paginationData;
  }
}