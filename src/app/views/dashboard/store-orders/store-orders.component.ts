import { AfterViewInit, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { StoreService } from 'src/app/services/store.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SideNavbarService } from 'src/app/services/side-navbar.service';
import { Observable,Subscription } from 'rxjs';
import { Store } from 'src/app/_models/store';
import { RestApiService } from 'src/app/services/rest-api.service';
import { AlertService } from 'src/app/services/alert.service';
import { finalize, takeUntil} from 'rxjs/operators';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-store-orders',
  templateUrl: './store-orders.component.html',
  styleUrls: ['./store-orders.component.scss']
})
export class StoreOrdersComponent implements OnInit, OnDestroy {
  @ViewChild('sideBarLinks', { read: TemplateRef }) sideBarLinks: TemplateRef<any>;

  sideBarTempShown : boolean = false;
  activeStore$ : Observable<Store>;
  routerSubs : Subscription;
  orderType : string;
  newOrderCount : number = 0;
  cookingOrderCount : number = 0;
  readyOrderCount : number = 0;
  statusName : string = "All Orders";
  unSub$ = new Subject<any>()
  constructor(
    private router : Router,
    private route : ActivatedRoute,
    private storeService : StoreService,
    private sideBarServ : SideNavbarService,
    private restApiService: RestApiService,
    private alertservice: AlertService
  ) {
    this.activeStore$ = this.storeService.store$;
    this.routerSubs = this.route.params.subscribe(params => {
      //creating a new category
      if (params['order-type']) {
        this.orderType = params['order-type'];
        if(this.orderType == 'new-orders'){
          this.statusName = "New Orders";
        }else if(this.orderType == 'cooking'){
          this.statusName = "Cooking";
        }else if(this.orderType == 'ready'){
          this.statusName = "Ready";
        }else if(this.orderType == 'history'){
          this.statusName = "History";
        }else{
          this.statusName = "All Orders";
        }
        setTimeout(() => {
          this.sideBarServ.AddTemplate(this.sideBarLinks, null, 'store-orders');
        }, 0);
        this.getOrdersCount();
      };
    });
  }


  ngOnInit(): void {
    
  }
  public ngOnDestroy(): void {
    this.unSub$.next(true);
    this.unSub$.complete();
  }
  toggleSideBarMenu() {
    if (this.sideBarTempShown) {
      this.sideBarTempShown = false;
      this.router.navigate(['../all-orders'], { relativeTo: this.route });
    //   this.sideBarServ.RemoveTemplate('store-orders');
    } else {
      this.sideBarTempShown = true;
      this.router.navigate(['../hide-cooking'], { relativeTo: this.route });
     }
    this.sideBarServ.AddTemplate(this.sideBarLinks, null, 'store-orders');
  }

  navigateRouter(path){
    if(path == 'back'){
      this.router.navigate(['/dashboard/partner/stores/'+this.storeService.activeStore$.value.id+'/menu/overview'], { relativeTo: this.route }).then(() => {
        window.location.reload();
      });;
    }else{
      this.router.navigate(['../'+path], { relativeTo: this.route });
    }
  }

  getOrdersCount(){
    this.alertservice.showLoader();
    this.restApiService.getDataObs('/api/partner/orders/count/'+this.storeService.activeStore$.value.id).pipe(
      finalize(() => { this.alertservice.hideLoader() }), takeUntil(this.unSub$)
    ).subscribe(
      (resp) => {
        this.alertservice.hideLoader();
        if (resp  && resp.success && resp.data) {
          this.newOrderCount = 0;
          this.cookingOrderCount = 0;
          this.readyOrderCount = 0;
          resp.data.forEach(ordersCount => {
            if(ordersCount.status == "COOKING"){
              this.cookingOrderCount = ordersCount.status == "COOKING" ? ordersCount.count : 0;
            }else if(ordersCount.status == "NEW"){
              this.newOrderCount = ordersCount.status == "NEW" ? ordersCount.count : 0;
            }else if(ordersCount.status == "READY"){
              this.readyOrderCount = ordersCount.status == "READY" ? ordersCount.count: 0;
            }
          });
        }
      },
    )
  }
  removeSideBarTemplate() {
  }

}
