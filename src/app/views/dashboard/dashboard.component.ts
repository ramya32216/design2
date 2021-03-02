import { Component, OnInit, AfterViewInit, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DataService } from 'src/app/services/data.service';
import { RestApiService } from 'src/app/services/rest-api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { Storedetails } from 'src/app/_models/store-menu';
import { Template } from '@angular/compiler/src/render3/r3_ast';
import { SideNavbarService } from 'src/app/services/side-navbar.service';
import { API_GetStores } from 'src/environments/api-endpoint';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  returnUrl: string;
  tab_acive = new Array();
  userRole: number;
  active_status = false;
  dasboard_empty: boolean = false;
  mutiple_stores_array: Array<Storedetails> = [];
  invited_stores_array: Array<Storedetails> = [];
  store_status: boolean = false;
  store_status_approve: boolean = false;
  store_status_setup: boolean = false;
  storeImage: string = 'assets/images/Area.png';
  storeName: string;

  @ViewChild('sideBarLinks', { read: TemplateRef }) sideBarLinks: TemplateRef<any>;

  constructor(
    private restapiService: RestApiService,
    private router: Router,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private sideBarServ: SideNavbarService
  ) { }
  ngOnDestroy(): void {
    this.sideBarServ.RemoveTemplate('Dashboard');
  }
  ngAfterViewInit(): void {
    this.sideBarServ.AddTemplate(this.sideBarLinks, null, 'Dashboard');
  }

  ngOnInit(): void {
    var obj = this;
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '';
    if (localStorage.getItem('Audit_Auth') && localStorage.getItem('loggedUser')) {
      // obj.authenticateService.checkExpiryStatus();
      obj.storeDetail();
      obj.invitedStoreDetail();
    }
  }

  storeDetail() {
    this.mutiple_stores_array = [];
    this.alertService.showLoader();
    this.restapiService.getData(API_GetStores, (response) => {
      if (response && response['success'] && response['data'] && Array.isArray(response['data']) && response['data'].length > 0) {
        let data = response['data'];
        console.log(data);
        data.forEach(storelist => {
          let newstoreDetails = new Storedetails(storelist.store_id
            , storelist.store_name
            , storelist.store_image
            , storelist.status
            , storelist.next_step);
          if (!newstoreDetails.storeImage) {
            newstoreDetails.storeImage = this.storeImage;
          }
          if (newstoreDetails.storeName) {
            newstoreDetails.storeName = newstoreDetails.storeName.substring(0, 45) + (newstoreDetails.storeName.length > 45 ? '...' : '');
          }
          this.mutiple_stores_array.push(newstoreDetails);

          this.alertService.hideLoader();
        });
      } else if (response && response['success'] && response['data'] && Array.isArray(response['data']) && response['data'].length === 0) {
        this.dasboard_empty = true;
      }

      this.alertService.hideLoader();
    });
  }

  invitedStoreDetail() {
    this.invited_stores_array = [];
    this.alertService.showLoader();
    this.restapiService.getData('api/stores/invitedto', (response) => {
      if (response && response['success'] && response['data'] && Array.isArray(response['data']) && response['data'].length > 0) {
        let data = response['data'];
        data.forEach(storelist => {
          let newstoreDetails = new Storedetails(storelist.store_id
            , storelist.store_name
            , storelist.store_image
            , storelist.status
            , storelist.next_step);
          if (!newstoreDetails.storeImage) {
            newstoreDetails.storeImage = this.storeImage;
          }
          if (newstoreDetails.storeName) {
            newstoreDetails.storeName = newstoreDetails.storeName.substring(0, 45) + (newstoreDetails.storeName.length > 45 ? '...' : '');
          }
          this.invited_stores_array.push(newstoreDetails);

          this.alertService.hideLoader();
        });

        // response['data'].forEach(element => {
        //   if(element.store_id) {
        //     this.storename = element.store_name;
        //     console.log(this.storename);
        //   }  
        //   this.alertService.hideLoader();
        // });
      } else if (response && response['success'] && response['data'] && Array.isArray(response['data']) && response['data'].length === 0) {
        this.dasboard_empty = true;
      }

      this.alertService.hideLoader();
    });
  }

  navigate(storeDetail: Storedetails) {
    if (storeDetail.activeStatus == "setup" || storeDetail.activeStatus == 'Set up') {
      // if(storeDetail.activeFlag)  return this.router.navigate(['./stores', storeDetail.id], {relativeTo: this.route});
      if (storeDetail.nextStep == '') return this.router.navigate(['./stores', storeDetail.id, 'menu'], { relativeTo: this.route });
      if (storeDetail.nextStep = 'ownership') return this.router.navigate([`../store/step2/${storeDetail.id}/ownership`])
      if (storeDetail.nextStep = 'bankaccount') return this.router.navigate([`../store/step3/${storeDetail.id}/bankaccount`])
    } else if (storeDetail.activeStatus == "pending") {
      return this.router.navigate(['./stores', storeDetail.id, 'menu'], { relativeTo: this.route });
    } else if (storeDetail.activeStatus == "Trading") {
      return this.router.navigate(['./stores', storeDetail.id, 'menu'], { relativeTo: this.route });
    }
    // else(storeDetail.nextStep) {
    //   return this.router.navigate(['./stores', storeDetail.id], { relativeTo: this.route });
    // }
  }

}
