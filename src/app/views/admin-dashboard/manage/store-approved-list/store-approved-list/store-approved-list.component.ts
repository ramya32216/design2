import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { empty } from 'rxjs/internal/observable/empty';
import { catchError, finalize, mergeMap, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { AlertService } from 'src/app/services/alert.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { RestApiService } from 'src/app/services/rest-api.service';
import { SearchQueryGeneratorComponent } from 'src/app/views/shared/components/search-query-generator/search-query-generator.component';
import { ModalService } from 'src/app/views/shared/services/modal.service';
import { UserRole } from 'src/app/_models/user';
import { URL_AdminApprovedStores } from 'src/environments/api-endpoint';
import { AdminStoreDataService } from '../../../_services/admin-store-data.service';
import { Pagination } from 'src/app/_models/Pagination';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-store-approved-list',
  templateUrl: './store-approved-list.component.html',
  styleUrls: ['./store-approved-list.component.scss']
})
export class StoreApprovedListComponent implements OnInit, OnDestroy {
  searchstore:boolean;
  // approvedStores: Array<{ store_id: number, store_name: string, legal_owner_name: string,status: string}>;
  isAdmin: boolean = false;
  searchTerm:string;
  paginationData: Pagination<any>;
  approvedStores: Array<{ store_id: number, store_name: string, legal_owner_name: string, status: string }>;

  unSub$ = new Subject<true>();

  constructor(private adminStoreData: AdminStoreDataService,
    private alertService: AlertService,
    private modalService: ModalService,
    private authService: AuthenticationService,
    private route: ActivatedRoute) { }


  @ViewChild('queryGen', { read: SearchQueryGeneratorComponent }) queryGen: SearchQueryGeneratorComponent

  ngOnInit(): void {
    this.authService.getUserObject().pipe(take(1)).subscribe(user => { if (user.role === UserRole.Admin) this.isAdmin = true });
    this.route.queryParams.subscribe((q)=> this.searchstore = q.name);
    this.route.queryParams.pipe(
      tap(() => this.approvedStores = null),
      switchMap(q => this.adminStoreData.storeApprovedPagination(q))
    ).pipe(takeUntil(this.unSub$)).subscribe(
      (p: any) => this.handleData(p)
    )

    this.route.queryParams.subscribe((q)=> this.searchTerm=q.name);
  }

  handleData(paginationData: Pagination<{ store_id: number, store_name: string, legal_owner_name: string, status: string }>) {
    this.approvedStores = paginationData.data;
    this.paginationData = paginationData;
  }

  deleteStore(index: number) {
    this.modalService.getConfirmation({
      heading: 'Deleting store',
      dialog: 'Are you sure?',
      confirmBtn: 'Delete',
      declineBtn: 'Cancel'
    }).pipe(
      catchError(() => empty()),
      tap(() => { this.alertService.showLoader() }),
      mergeMap(() => this.adminStoreData.deleteStore(this.approvedStores[index].store_id)),
      finalize(() => { this.alertService.hideLoader() })
    ).subscribe(
      () => { this.alertService.showNotification('Store successfully deleted'); this.approvedStores.splice(index, 1); },
      // (errorResp) => { this.alertService.showNotification() }
    )
  }

  ngOnDestroy(): void {
    this.unSub$.next(true);
    this.unSub$.complete();
  }


}
