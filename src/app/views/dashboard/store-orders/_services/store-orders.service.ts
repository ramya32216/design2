import { Injectable } from '@angular/core';
import { RestApiService } from 'src/app/services/rest-api.service';
import { map ,finalize} from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { QueryToString } from 'src/app/_helpers/string-helpers';
import { Pagination } from 'src/app/_models/Pagination';
import { StoreService } from 'src/app/services/store.service';

import { HttpClient } from '@angular/common/http';
import { AlertService} from 'src/app/services/alert.service';
@Injectable({
  providedIn: 'root'
})
export class StoreOrdersService {
storeOrders=new Array();
  constructor(private restApiService: RestApiService,
    private storeService:StoreService,
    private alertservice: AlertService,
    private http:HttpClient) { }
  storeOrdersPagination(query: { [key: string]: string; }): Observable<Pagination<{
    order_id: number,customer_name: string, type: string,ordered_at: string, total_price:number
    }>> {
    return this.restApiService.getDataObs('api/partner/orders/history/'+this.storeService.activeStore$.value.id + QueryToString(query)).pipe(map((resp) => {
      let result = resp.data;
      result.currentPage = result.current_page;
      result.lastPage = result.last_page;
      result.totalCount = result.total;
      return result;
    }));
  }

  

}