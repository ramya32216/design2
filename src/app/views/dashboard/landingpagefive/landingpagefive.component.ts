
import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule, FormGroup, FormControl, Validators, FormBuilder, ValidatorFn, AbstractControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { RestApiService } from 'src/app/services/rest-api.service';
import { AlertService } from 'src/app/services/alert.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DataService } from 'src/app/services/data.service';
import { API_URL_LINK } from 'src/environments/environment.prod';
import { StringHelperService } from 'src/app/services/string-helper.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StoreMenuTime } from 'src/app/_models/store-menu';
import { AvailabilityToBackend, ReadAvailability, TimeAvailability } from 'src/app/_modules/time-availability/_model/time-availability';
import { ModalService } from '../../shared/services/modal.service';
import { ModalRef } from '../../shared/_model/modal-ref';
import { UserRole } from 'src/app/_models/user';
import { map, take } from 'rxjs/operators';
import {TimeAvailabilityService} from 'src/app/_modules/time-availability/_services/time-availability.service';
import { URL_StoreClaimSearch } from 'src/environments/api/api-store-administration';
import { API_CreateStore, API_UpdateStore, API_GetStoresById } from 'src/environments/api-endpoint';
declare let $: any;
@Component({
  selector: 'app-landingpagefive',
  templateUrl: './landingpagefive.component.html',
  styleUrls: ['./landingpagefive.component.scss'],
  providers:[TimeAvailabilityService]
  
})
export class LandingpagefiveComponent implements OnInit {

  isAdmin: boolean = false;
  add_image: string = "assets/images/ico_add_blue.png";
  edit_image: string = "assets/images/icon_edit.png";
  storeDetailform: FormGroup;
  storeNameSubmit = false;
  // storeAddressSubmit = false;
  typeCuisineSubmit = false;
  descriptionItemSubmit = false;
  facebookBussinessSubmit = false;
  googleBussinessSubmit = false;
  returnUrl: string;
  store_id: number;
  storeAddress: string;
  // cuisine: string;
  // getDescription: string;
  store_add_or_edit_action_type: string;
  add_edit_type: string = 'add';
  // getgoogleBussiness: string;
  // imageUrl: string = null;
  fileUptoLoad: File;
  width: number;
  height: number;
  errors = new Array();
  claimCreation: boolean = false;
  cusineId: number;
  storeOpeningHours: Array<TimeAvailability> = [];
  storeOpeningHoursCache: Array<TimeAvailability>;
  modalRef: ModalRef;
  isStaff: boolean = false;
  cuisineControl: FormControl = new FormControl();
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private restApiservice: RestApiService,
    private alertservice: AlertService,
    private stringHelper: StringHelperService,
    public modalService: ModalService,
    private authService: AuthenticationService
  ) {
    this.store_id = +this.route.snapshot.paramMap.get('store-id');
    // if (!this.store_id) if (+localStorage.getItem('storeCreationId')) this.store_id = +localStorage.getItem('storeCreationId');
    this.add_edit_type = this.route.snapshot.queryParams['type'] || 'add';
    this.claimCreation = this.route.snapshot.queryParams['claim'] == 'true' ? true : false;
  }
  //only number will be add
  keyPress(event: any) {
    const pattern = /[0-9\+\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  options = {
    componentRestrictions: {
      country: ["AU", "IN"]
    }
  }
  public AddressChange(address: any) {
    //setting address from API to local variable 
    //  this.storeAddress=address.formatted_address;
    // console.log('address changed', address);
    if (address) {
      this.storeAddress = address.formatted_address;
    }
  }
  // Cuisines = new Array();
  ngOnInit(): void {
    this.authService.getUserObject().pipe(take(1)).subscribe(user => { if (user.role === UserRole.Staff) this.isStaff = true; })
    this.isAdmin = this.authService.userObjectSubject.value.role == UserRole.Admin;
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '';
    this.getstoreDetails();
    // if (localStorage.getItem('Audit_Auth') && localStorage.getItem('loggedUser')) {
    //   obj.getstoreDetails();
    // }
    this.storeDetailform = new FormGroup({
      storeName: new FormControl('', [Validators.required, removeSpaces]),
      phoneNumber: new FormControl(''),
      //    phoneNumber: new FormControl('', [Validators.required,Validators.pattern("(?!0+$)^((\\+61-?)|0)?[0-9]{10}$")]),
      storeAddress: new FormControl('', Validators.required),
      // descriptionItem: new FormControl('', Validators.required),
      cuisines: new FormControl(),
      google_business_url: new FormControl(''),
      facebook_url: new FormControl(''),
      storeLogo: new FormControl(),
      storeImage: new FormControl()
    })
  }
  get f() { return this.storeDetailform.controls; }
  constructBackendData(): any {
    let data: any = {
      name: this.storeDetailform.value.storeName,
      address: this.storeAddress,
      cuisines: this.storeDetailform.controls.cuisines.value.map(c => { return { id: c.id } }),
      cuisine_name: this.storeDetailform.value.typeCuisine,
      google_business_url: this.storeDetailform.value.google_business_url,
      facebook_url: this.storeDetailform.value.facebook_url,
      phone_number: this.storeDetailform.value.phoneNumber
    };
    // if (this.storeDetailform.value.storeLogo) data.store_logo = this.stringHelper.ExtractFileName(this.storeDetailform.value.storeLogo);
    // if (this.storeDetailform.value.storeImage) data.store_image = this.stringHelper.ExtractFileName(this.storeDetailform.value.storeImage);
    if (this.storeDetailform.value.storeLogo) data.logo = this.storeDetailform.value.storeLogo;
    if (this.storeDetailform.value.storeImage) data.picture = this.storeDetailform.value.storeImage;
    data.opening_hours = AvailabilityToBackend(this.storeOpeningHours);
    return data;
  }
  storeDetails() {
    if (this.storeDetailform.invalid) {
      this.storeDetailform.markAllAsTouched();
      return;
    }
    if (this.storeDetailform.valid) {
      let data = this.constructBackendData();
      if (this.add_edit_type == 'add') {
        if (this.claimCreation) data.claim_store_id = this.store_id;
        this.alertservice.showLoader();
        this.restApiservice.postAPI(API_CreateStore, data, (response) => {
          this.handleSaveResponse(response)
        });
      }
      else if (this.add_edit_type == 'edit') {
        data.store_id = this.store_id;
        this.alertservice.showLoader();
        this.restApiservice.putAPI(API_UpdateStore(this.store_id), data, (response) => {
          this.handleSaveResponse(response)
        });
      }
    }
  }
  storeAndAddAnother() {
    if (this.storeDetailform.invalid) {
      this.storeDetailform.markAllAsTouched();
      return;
    }
    if (this.storeDetailform.valid) {
      let data = this.constructBackendData();
      this.alertservice.showLoader();
      this.restApiservice.postAPI(API_CreateStore, data, (response) => {
        this.alertservice.hideLoader();
        if (response.success) {
          this.alertservice.showNotification('Store Successfully added.');
          this.storeDetailform.reset();
          this.storeAddress = '';
          this.storeOpeningHours = [];
        } else if (response.error) { }
        else this.alertservice.showNotification('There was an error', 'error')
      });
    }
  }
  handleSaveResponse(response: any) {
    if (response && response['data'] && response['success']) {
      this.alertservice.hideLoader();
      return this.router.navigateByUrl('/store/step2/' + response['data']['id'] + '/ownership');
    } else if (response && !response['success'] && response['error']['errors']) {
      for (let key in response['error']['errors']) {
        this.errors[key] = response['error']['errors'][key][0];
        this.alertservice.showNotification(this.errors[key], 'error');
      }
    } else {
      this.alertservice.showNotification('Something went wrong', 'error');
    }
    this.alertservice.hideLoader();
  }
  getstoreDetails() {
    // this.alertservice.showLoader();
    if (this.store_id) {
      this.alertservice.showLoader()
      this.restApiservice.getData(API_GetStoresById(this.store_id), (response) => {
        this.alertservice.hideLoader();
        if (response && response['success'] && response['data']) {
          // this.imageUrl = element.store_logo;
          this.storeAddress = response.data.address;
          // this.getDescription = element.description;
          // this.getgoogleBussiness = element.google_business_url;
          this.storeDetailform.get('storeName').setValue(response.data.name);
          this.storeDetailform.get('phoneNumber').setValue(response.data.phone_number);
          this.storeDetailform.get('storeAddress').setValue(this.storeAddress);
          this.storeDetailform.get('cuisines').setValue(response.data.cuisines.map(c => { return { id: c.id, name: c.name } }));
          // this.storeDetailform.get('descriptionItem').setValue(this.getDescription);
          this.storeDetailform.get('google_business_url').setValue(response.data.google_business_url);
          this.storeDetailform.get('facebook_url').setValue(response.data.facebook_url);
          this.storeDetailform.get('storeLogo').setValue(response.data.logo);
          this.storeDetailform.get('storeImage').setValue(response.data.picture);
          this.alertservice.hideLoader();
          this.storeOpeningHours = ReadAvailability(response.data.opening_hours);
          // console.log('just read availability', this.storeOpeningHours);
        }
      });
    }
  }
  startEdit(editorTemplate: TemplateRef<any>) {
    this.storeOpeningHoursCache = [...this.storeOpeningHours];
    this.modalRef = this.modalService.openTemplate(editorTemplate);
  }
  apiFunction = (term) => {
    return this.restApiservice.getDataObs(URL_StoreClaimSearch(term, 'shells')).pipe(
      map((resp: any) => resp.data.results)
    )
  }
  accessor = (store) => store.name;
  handleSelection(item: any) {
    console.log('this is the handleselection', item);
    if (item) {
      this.store_id = item.id;
      this.getstoreDetails();
    } else {
      console.log('selection item, ', item);
    }
  }
  finalizeOpeningHours() {
    this.storeOpeningHours = [...this.storeOpeningHours];
    this.modalRef.dismiss();
  }
}
export function removeSpaces(control: AbstractControl) {
  if (control && control.value && !control.value.replace(/\s/g, '').length) {
    control.setValue('');
  }
  return null;
  }
