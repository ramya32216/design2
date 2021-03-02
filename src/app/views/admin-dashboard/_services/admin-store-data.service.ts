import { Injectable } from '@angular/core';
import { RestApiService } from 'src/app/services/rest-api.service';
import { URL_ImportStoreShell, URL_StoreShellAllStores ,URL_StorePendingAllStores,URL_StoreApprovedAllStores } from 'src/environments/api/api-store-administration';
import { map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { URL_AdminAllShellStaff, URL_AdminApprovedStores, URL_AdminDeleteStore, URL_AdminPendingStores } from 'src/environments/api-endpoint';
import { Pagination } from 'src/app/_models/Pagination';
import { QueryToString } from 'src/app/_helpers/string-helpers';

@Injectable()
export class AdminStoreDataService {

  constructor(private restApiService: RestApiService) { }

  storeShellAllStores(querystring: string = null): Observable<Array<{ store_id: number, store_name: string, status: string, first_name: string, last_name: string, date: string }>> {
    return this.restApiService.getDataObs(URL_StoreShellAllStores + (querystring ? querystring : '')).pipe(map((resp: any) => resp.data.data))
  }

  storeShellPagination(query: { [key: string]: string; }): Observable<Pagination<{ store_id: number, store_name: string, status: string, first_name: string, last_name: string, date: string }>> {
    return this.restApiService.getDataObs(URL_StoreShellAllStores + QueryToString(query)).pipe(map((resp) => {
      let result = resp.data;
      result.currentPage = result.current_page;
      result.lastPage = result.last_page;
      result.totalCount = result.total;
      return result;
    }));
  }



  storePendingPagination(query: { [key: string]: string; }): Observable<Pagination<{ store_id: number, store_name: string, legal_owner_name: string, type_of_creation: string}>> {
    return this.restApiService.getDataObs(URL_StorePendingAllStores + QueryToString(query)).pipe(map((resp) => {
      let result = resp.data;
      result.currentPage = result.current_page;
      result.lastPage = result.last_page;
      result.totalCount = result.total;
      return result;
    }));
  }


  storeApprovedPagination(query: { [key: string]: string; }): Observable<Pagination<{ id: number, name: string, status: string, legal_owner_name: string }>> {
    return this.restApiService.getDataObs(URL_StoreApprovedAllStores + QueryToString(query)).pipe(map((resp) => {
      let result = resp.data;
      result.currentPage = result.current_page;
      result.lastPage = result.last_page;
      result.totalCount = result.total;
      return result;
    }));
  }





  importCSV(file: File): Observable<boolean> {
    let formData = new FormData();
    formData.append('stores', file);
    return this.restApiService.postData(URL_ImportStoreShell, formData).pipe(map((resp: any) => {
      if (resp && resp.success) return true
      else throwError('Could not complete impoting');
    }))
  }

  allPendingStores(queryString: string = null) {
    return this.restApiService.getDataObs(URL_AdminPendingStores + (queryString ? queryString : '')).pipe(map(
      (resp) => {
        let pendingStores = [];
        resp.data.data.forEach(store => {
          pendingStores.push({ id: store.store_id, name: store.store_name, claimType: store.type_of_creation, applicant: store.legal_owner_name })
        });
        return pendingStores;
      }
    ))
  }
  // allPendingStores(querystring: string = null): Observable<Array<{ id: number, name: string, claimType: string, applicant: string }>> {
  //   return this.restApiService.getDataObs(URL_AdminPendingStores + (querystring ? querystring : '')).pipe(map((resp: any) => resp.data.data))
  // }

   // allApprovedStores(querystring: string = null): Observable<Array<{ id: number, name: string, status: string, applicant: string }>> {
  //   return this.restApiService.getDataObs(URL_AdminApprovedStores + (querystring ? querystring : '')).pipe(map((resp: any) => resp.data.data))
  // }


  allApprovedStores(queryString: string = null) {
    return this.restApiService.getDataObs(URL_AdminApprovedStores + (queryString ? queryString : '')).pipe(map(
      (resp) => {
        let approvedStores = [];
        resp.data.data.forEach(store => {
          approvedStores.push({ id: store.store_id, name: store.store_name, status: store.status, applicant: store.legal_owner_name })
        });
        return approvedStores;
      }
    ))
  }

  allShellStaff(): Observable<Array<{ store_partner_id: number, name: string }>> {
    return this.restApiService.getDataObs(URL_AdminAllShellStaff).pipe(map((resp: any) => resp.data));
  }


  deleteStore(storeId: number) {
    return this.restApiService.patchData(URL_AdminDeleteStore, { store_id: storeId });
  }


}
