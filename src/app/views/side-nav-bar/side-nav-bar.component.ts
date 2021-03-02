import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { SideNavbarService } from 'src/app/services/side-navbar.service';
import { SidebarTemplate } from 'src/app/_models/sidebar-template';
import { MediaMatcher } from '@angular/cdk/layout';
import { Observable, Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-side-nav-bar',
  templateUrl: './side-nav-bar.component.html',
  styleUrls: ['./side-nav-bar.component.scss']
})
export class SideNavBarComponent implements OnDestroy, OnInit {

  dashboard_status: boolean = false;
  menu_status: boolean = false;
  currentTemplate: SidebarTemplate;

  tempSubs: Subscription;

  constructor(
    private authenticateService: AuthenticationService,
    private sideNavBarService: SideNavbarService,
    private cdr: ChangeDetectorRef
  ) {

  }
  ngOnInit(): void {
    this.tempSubs = this.sideNavBarService.currentTemplate$.subscribe(
      (t) => {
        this.currentTemplate = t;
        this.cdr.detectChanges();
      }
    );
  }

  toggleVisibility() {

  }

  ngOnDestroy(): void {
    this.tempSubs.unsubscribe();
  }
  /*
   * Logout function 
   */
  logout() {
    this.authenticateService.logout();
  }
}
