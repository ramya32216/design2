import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AdminStoreDataService } from '../../../_services/admin-store-data.service';
import { empty, Observable, Subject, Subscription } from 'rxjs';
import { catchError, finalize, mergeMap, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { FileExtentionValidator } from 'src/app/_modules/fileupload/file-validators';
import { AlertService } from 'src/app/services/alert.service';
import { SearchQueryGeneratorComponent } from 'src/app/views/shared/components/search-query-generator/search-query-generator.component';
import { ModalService } from 'src/app/views/shared/services/modal.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserRole } from 'src/app/_models/user';
import { QueryToString } from 'src/app/_helpers/string-helpers';
import { Pagination } from 'src/app/_models/Pagination';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-store-shell',
  templateUrl: './store-pending-list.component.html',
  styleUrls: ['./store-pending-list.component.scss']
})
export class StorePendingListComponent implements OnInit, AfterViewInit {
  isAdmin: boolean = false;
  searchTerm:string;
  pendingStores: Array<{ store_id: number,store_name: string, legal_owner_name: string,type_of_creation: string}>;

  //stores: Array<{ store_id: number, store_name: string, status: string, first_name: string, last_name: string, date: string }>;

   paginationData: Pagination<any>;
   unSub$ = new Subject<true>();
   searchstore:boolean;
  constructor(private adminStoreData: AdminStoreDataService,
    private alertService: AlertService,
    private modalService: ModalService,
    private authService: AuthenticationService,
    private route: ActivatedRoute
  ) { }

  @ViewChild('queryGen', { read: SearchQueryGeneratorComponent }) queryGen: SearchQueryGeneratorComponent
  querySubs: Subscription;

  ngOnInit(): void {
    this.authService.getUserObject().pipe(take(1)).subscribe(user => { if (user.role === UserRole.Admin) this.isAdmin = true });
    //this.adminStoreData.allPendingStores().subscribe(stores => this.pendingStores = stores);
    this.route.queryParams.subscribe((q)=> this.searchstore = q.name);
    this.route.queryParams.pipe(
      tap(() => this.pendingStores = null),
      switchMap(q => this.adminStoreData.storePendingPagination(q))
    ).pipe(takeUntil(this.unSub$)).subscribe(
      (p: any) => this.handleData(p)
    )

    this.route.queryParams.subscribe((q)=> this.searchTerm=q.name);
  }
 // paginationSource = (query: { [any: string]: string }) => { this.pendingStores = null; return this.adminStoreData.storePendingPagination(query); }

  ngAfterViewInit(): void {
   
  }
  
  handleData(paginationData: Pagination<{ store_id: number, store_name: string,  legal_owner_name: string, type_of_creation: string}>) {
    this.pendingStores = paginationData.data; 
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
      mergeMap(() => this.adminStoreData.deleteStore(this.pendingStores[index].store_id)),
      finalize(() => { this.alertService.hideLoader() })
    ).subscribe(
      () => { this.alertService.showNotification('Store successfully deleted'); this.pendingStores.splice(index, 1); },
      // (errorResp) => { this.alertService.showNotification() }
    )
  }
}
