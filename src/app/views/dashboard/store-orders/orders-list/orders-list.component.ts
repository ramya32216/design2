import { Component, OnInit, ViewChild, ElementRef, HostListener, OnDestroy } from '@angular/core';
import {animate, style, transition, trigger} from "@angular/animations";
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { finalize, map, filter } from 'rxjs/operators';
import { StoreService } from 'src/app/services/store.service';
import { Store } from 'src/app/_models/store';
import { AlertService } from 'src/app/services/alert.service';
import { RestApiService } from 'src/app/services/rest-api.service';
import { ModalRef } from 'src/app/views/shared/_model/modal-ref';
import { ModalService } from 'src/app/views/shared/services/modal.service';
import { StoreOrdersComponent } from '../store-orders.component';
import { interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.scss']
})
export class OrdersListComponent implements OnInit, OnDestroy {
  deleteIndexlist: number;
  routerSubs: Subscription;
  pageNumber: number = 1;
  storeOrders = new Array();
  orderType: number;
  status: string = '';
  modalRef: ModalRef;
  orderTimeHeader: string = '';
  showRangeValue: number;
  updateOrderId: number;
  item_count = Array;
  showForward: boolean;
  showForwardDisabled:boolean;
  showBackward: boolean= false;
  latest_updated_at: string;
  unSub$ = new Subject<any>()
  preparedBy = new Array();
  syncSub: Subscription;

  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  constructor(
    private _modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    private storeService: StoreService,
    private alertservice: AlertService,
    private restApiService: RestApiService,
    private modalServ: ModalService,
    private StoreOrdersComponent: StoreOrdersComponent,
  ) {
    this.routerSubs = this.route.params.subscribe(params => {
      if (params['order-type']) {
        this.orderType = params['order-type'];
        if (params['order-type'] == 'ready') {
          this.status = 'READY';
        } else if (params['order-type'] == 'cooking') {
          this.status = 'COOKING';
        } else if (params['order-type'] == 'new-orders') {
          this.status = 'NEW';
        } else if (params['order-type'] == 'hide-cooking') {
          this.status = 'NEW,READY';
        } else if (params['order-type'] == 'all-orders') {
          this.status = '';
        }
      };
      if (params['order-type'] !== 'history') {
        this.getAllOrders();
      }
    });
      setInterval(() => {
        this.loopingStoreHour();
      }, 60000); 

    animations: [
      trigger('grow', [
        transition('void <=> *', []),
        transition('* <=> *', [
          style({height: '{{startWidth}}px', opacity: 0}),
          animate('.5s ease'),
        ], {params: {startWidth: 0}})
      ])
    ]
  }

  @ViewChild('widgetsContent') widgetsContent: ElementRef;
  @HostListener('widgetsContent', ['$event']) private onScroll($event: Event): void {
    if (this.widgetsContent.nativeElement.offsetWidth + this.widgetsContent.nativeElement.scrollLeft >= this.widgetsContent.nativeElement.scrollWidth) {
      this.showForward = false;
    }
  };

  ngOnInit(): void {
   
  }

  public ngOnDestroy(): void {
    this.unSub$.next(true);
    this.unSub$.complete();
  }
  get modalService(): NgbModal {
    return this._modalService;
  }

  scrollRight() {
    this.showBackward = true;
    this.showForwardDisabled = false;
    this.widgetsContent.nativeElement.scrollLeft += 320;
    if (this.widgetsContent.nativeElement.offsetWidth + this.widgetsContent.nativeElement.scrollLeft >= this.widgetsContent.nativeElement.scrollWidth) {
      this.showForward = false;
    }
  }

  scrollLeft() {
    this.widgetsContent.nativeElement.scrollLeft -= 320;
    this.showForward = true;
    if (this.widgetsContent.nativeElement.scrollLeft <= 320) {
      this.showBackward = false;
      this.showForwardDisabled = true;
    }
  }

  onWheel(event: WheelEvent): void {
    if (event.deltaY < 0) {
      this.widgetsContent.nativeElement.scrollLeft -= 320;
    } else if (event.deltaY > 0) {
      this.widgetsContent.nativeElement.scrollLeft += 320;
      if (this.widgetsContent.nativeElement.offsetWidth + this.widgetsContent.nativeElement.scrollLeft >= this.widgetsContent.nativeElement.scrollWidth) {
        this.showForward = false;
      }
    }
  }

  //get all orders with respect to status
  getAllOrders() {
    this.storeOrders = [];
    this.alertservice.showLoader();
    this.restApiService.getDataObs('api/partner/orders/v1?store_id=' + this.storeService.activeStore$.value.id + '&status=' + this.status).pipe(
      finalize(() => { this.alertservice.hideLoader() }),
      takeUntil(this.unSub$)
    ).subscribe(
      (resp) => {
        this.alertservice.hideLoader();
        if (resp && resp.success && resp.data) {
          if (resp.data.orders) {
            this.showForward = true;
            resp.data.orders.forEach(orderlist => {
              this.storeOrders.push(orderlist);
            });
            this.storeOrders = [...new Map(this.storeOrders.map(item =>
              [item.order_id, item])).values()];
          }
          this.loopingStoreHour();
          this.latest_updated_at = resp.data.updated_at;
          this.getSyncedData();
        }
      },
    )
  }
  //Data sync
  getSyncedData() {
    if (this.syncSub) this.syncSub.unsubscribe();
    let data = {
      "store_id": this.storeService.activeStore$.value.id,
      "updated_at": this.latest_updated_at,
      "status": this.status
    }
    this.syncSub = this.restApiService.postData('api/partner/orders/sync', data).subscribe(
      (resp: any) => {
        if (resp && resp.success && resp.data) {
          if (resp.data.is_updated) {
            this.storeOrders = [];
          }
          if (resp.data.orders) {
            this.showForward = true;
            resp.data.orders.forEach(orderlist => {
              this.storeOrders.push(orderlist);
            });
          }
          this.StoreOrdersComponent.getOrdersCount();
          this.loopingStoreHour();
          if (resp.data.updated_at) {
            this.latest_updated_at = resp.data.updated_at;
            this.getSyncedData();
          }
        }
      }
    )
  }
  loopingStoreHour(){
    if(this.storeOrders.length > 0){
      this.storeOrders.forEach(prepareOrder => {
        if( prepareOrder.preparing_order != 1){
          prepareOrder.preparing_order = prepareOrder.preparing_order-1;
        }
      });
    }
  }
  //approve orders
  approveOrder(order_id, order_status, template) {
    this.showRangeValue = 0;
    if (order_status == 'COOKING') {
      this.orderTimeHeader = 'Edit time';
    } else {
      this.orderTimeHeader = 'Approve order';
    }
    this.updateOrderId = order_id;
    this.modalRef = this.modalServ.openTemplateSizesm(template);
  }

  denyOrder(order_id, template) {
    this.modalRef = this.modalServ.openTemplateSizesm(template);
  }

  getOrderTimeRange(event) {
    this.showRangeValue = event.target.value;
  }

  //update orders
  updateOrder(readyBy, status) {
    this.alertservice.showLoader();
    let data = {
      "ready_by": readyBy,
      "status": status,
      "order_id": this.updateOrderId
    }
    this.restApiService.patchData('api/partner/orders?store_id=' + this.storeService.activeStore$.value.id, data).pipe(
      finalize(() => { this.alertservice.hideLoader() })
    ).subscribe(
      (resp) => {
        if (resp) {
          this.modalRef.dismiss();
          this.getSyncedData();
        }
      },
    );
  }
  completeOrder(orderId,readyBy,status){
    this.updateOrderId = orderId;
    this.updateOrder(readyBy, status)
  }
  // Deny Order
  deleteData() {
    let orders = this.storeOrders[this.deleteIndexlist];
    let data: any = {};
    data.order_id = orders.order_id;
    data.status = "DENY";

    this.restApiService.patchData('api/partner/orders?store_id=' + this.storeService.activeStore$.value.id, data).pipe(
      finalize(() => { this.alertservice.hideLoader() })
    ).subscribe(
      (resp) => {
        if (resp) {
          this.storeOrders.splice(this.deleteIndexlist, 1);
        }
      },
    );
  }


  progressbarWidth(preparedByProgress) {
    let progess=  preparedByProgress*1.7;
    if(progess>100){
      return "98%";
    }else{
      return progess+"%";
    }
   
  }
}
