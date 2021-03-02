import { Component, OnInit } from '@angular/core';
import { finalize, map, filter } from 'rxjs/operators';
import { StoreService } from 'src/app/services/store.service';
import { AlertService } from 'src/app/services/alert.service';
import { RestApiService } from 'src/app/services/rest-api.service';
@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit {
 // storeAcccountDetail:any= {};
//accountArray: Array<{first_name:string, last_name:string, mobile_number:number}>
  constructor(
   // private storeService: StoreService,
   // private alertservice: AlertService,
    //private restApiService: RestApiService,
  ) { }

  ngOnInit(): void {
    //this.  getAccountDetails();
  }
  // getAccountDetails() {
  //   this. storeAcccountDetail = {};
  //   this.alertservice.showLoader();
  //   this.restApiService.getDataObs('api/partner/v1/me' ).pipe(
  //     finalize(() => { this.alertservice.hideLoader() })
  //   ).subscribe(
  //     (resp) => {
  //       this.alertservice.hideLoader();
  //       if (resp && resp.success && resp.data) {
  //         this. storeAcccountDetail = resp.data;
  //       }
  //     },
  //   )
  // }

}
