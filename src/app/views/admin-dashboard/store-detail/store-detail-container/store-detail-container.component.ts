import { AfterViewInit, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { SideNavbarService } from 'src/app/services/side-navbar.service';
import { StoreService } from 'src/app/services/store.service';
import {Router, ActivatedRoute} from '@angular/router';
import { Location } from '@angular/common';
@Component({
  selector: 'app-store-detail-container',
  templateUrl: './store-detail-container.component.html',
  styleUrls: ['./store-detail-container.component.scss']
})
export class StoreDetailContainerComponent implements AfterViewInit, OnDestroy {
  
  @ViewChild('sideBarLinks', { read: TemplateRef }) sideLinks: TemplateRef<any>;
  
  constructor(private sideBarServ: SideNavbarService,
    private storeServ: StoreService,
    private Router: Router,
    private ActivatedRoute: ActivatedRoute,
    private location: Location) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    console.log(this.storeServ.activeStore$.value);
    this.sideBarServ.AddTemplate(this.sideLinks, this.storeServ.activeStore$.value, 'AdminStoreDetail')
  }

  
  ngOnDestroy(): void {
    this.sideBarServ.RemoveTemplate('AdminStoreDetail');
  }


  // navigateRouter(path) {
  //   this.location.back();
  // }


}
