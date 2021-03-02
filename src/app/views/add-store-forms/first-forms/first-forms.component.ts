import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RestApiService } from 'src/app/services/rest-api.service';
import { URL_StoreClaimSearch } from 'src/environments/api/api-store-administration';
import { map } from 'rxjs/operators';
import { OverlayRef, Overlay, OverlayConfig } from '@angular/cdk/overlay';

@Component({
  selector: 'app-first-forms',
  templateUrl: './first-forms.component.html',
  styleUrls: ['./first-forms.component.scss']
})
export class FirstFormsComponent implements OnInit {

  constructor(
    private router: Router,
    private restApiService: RestApiService,
  ) { }

  ngOnInit(): void {

  }

  apiFunction = (term) => {
    return this.restApiService.getDataObs(URL_StoreClaimSearch(term,'shells')).pipe(
      map((resp: any) => resp.data)
    )
  }

  accessor = (store) =>console.log(store) ;

  handleSelection(item: any) {
    if(item) {
      this.router.navigate(['/store/step1/' + item.store_id], { queryParams: { claim: 'true' } })
    } else {
      this.router.navigate(['/store/step1/create']);
    }    
  }
}
