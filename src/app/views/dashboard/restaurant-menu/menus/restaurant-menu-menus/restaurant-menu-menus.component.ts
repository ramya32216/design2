import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap, Router, NavigationEnd, RouterEvent } from '@angular/router';
import { StoreService } from 'src/app/services/store.service';
import { RestApiService } from 'src/app/services/rest-api.service';
import { StoreMenu, StoreMenuTime } from 'src/app/_models/store-menu';
import { filter } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { AlertService } from 'src/app/services/alert.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Pipe, PipeTransform } from '@angular/core';
import { ReadAvailability } from 'src/app/_modules/time-availability/_model/time-availability';

@Component({
  selector: 'app-restaurant-menu-menus',
  templateUrl: './restaurant-menu-menus.component.html',
  styleUrls: ['./restaurant-menu-menus.component.scss']
})
export class RestaurantMenuMenusComponent implements OnInit, OnDestroy {
  menus: Array<StoreMenu> = [];

  modifierIndexToBeDeleted: number;
  deletemenuIndex: number;
  constructor(
    public route: ActivatedRoute
    , private router: Router
    , private storeService: StoreService
    , private restApiService: RestApiService
    , private alertService: AlertService
    , private _modalService: NgbModal

  ) { }


  ngOnInit(): void {
    this.fetchMenus();
  }

  get modalService(): NgbModal {
    return this._modalService;
  }

  ngOnDestroy(): void {
  }

  fetchMenus() {
    this.menus = [];

    if (!this.storeService.activeStore) { return this.router.navigate(['../notfound'], { relativeTo: this.route }); }
    this.alertService.showLoader();
    this.restApiService.getData(`store/menus/availability/get/${this.storeService.activeStore}/all`
      , (response) => {
        this.alertService.hideLoader();
        if (response['data'] && response['data'].length > 0) {
          let data = response['data'];
          data.forEach(menu => {
            let newMenu = new StoreMenu(menu.menu_id, menu.menu_name, menu.is_custom_availability, ReadAvailability(menu.availability));
            this.menus.push(newMenu);
          });
        }
        this.alertService.hideLoader();
      }
      , (error) => {
        this.alertService.hideLoader();
      });
  }

  deleteMenu() {
    let menu: StoreMenu = this.menus[this.deletemenuIndex];
    let data: any = {}
    data.menu_name = menu.name;
    data.menu_id = menu.id;
    data.is_custom_availability = 0;
    data.active_flag = 0;

    this.restApiService.postAPI(`store/menus/add/${this.storeService.activeStore}`, data, (resp) => {
      console.log(data);
      if (resp.success) {
        this.alertService.showNotification('Menu deleted', 'success');
        this.menus.splice(this.deletemenuIndex, 1);
      } else this.alertService.showNotification(`There was an error deleting the menu. Please try again.`);
    })
  }

}
