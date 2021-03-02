import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { StoreBasicDetails } from '../../_model/store-basic-details';
import { RestApiService } from 'src/app/services/rest-api.service';
import { AlertService } from 'src/app/services/alert.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { take } from 'rxjs/operators';
import { UserRole } from 'src/app/_models/user';

@Component({
  selector: 'app-store-basic-details',
  templateUrl: './store-basic-details.component.html',
  styleUrls: ['./store-basic-details.component.scss']
})
export class StoreBasicDetailsComponent implements OnInit {

  storeBasicDetail: StoreBasicDetails;
  @Output() saved = new EventEmitter<StoreBasicDetails>();
  @Output() imageOpened = new EventEmitter<File>();
  cuisines = new Array();
  //normalMode is false while editing the details
  normalMode: boolean = true;
  address: string;
  isStaff: boolean = false;
  constructor(private authService: AuthenticationService) { }

  basicDetails: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
    phoneNumber: new FormControl(''),
    // cuisine_id: new FormControl('', Validators.required),
    // description: new FormControl('', Validators.required),
    cuisines: new FormControl(''),
    googleUrl: new FormControl(''),
    facebookUrl: new FormControl(''),
    storeLogo: new FormControl(''),
    storeImage: new FormControl(''),
    unclaimed: new FormControl('')
  })

  basicDetailCache: any = null;
  imageUrlCache: string = null;

  ngOnInit(): void {
    // this.authService.getUserObject().pipe(take(1)).subscribe(user => { if (user.role === UserRole.Staff) this.isStaff = true; })
    this.isStaff = this.authService.userObjectSubject.value.role == UserRole.Staff;
  }

  // only number will be add
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
    this.basicDetails.markAsDirty();
    //setting address from API to local variable 
    if (address) {
      this.address = address.formatted_address;
    }

    this.basicDetails.controls.address.patchValue(this.address);
  }


  patchData(data: StoreBasicDetails) {
    this.storeBasicDetail = data;
    this.basicDetails.patchValue(data);
    // this.imageUrl = data.imageUrl;
  }

  getDetails(): StoreBasicDetails | false {
    console.log(StoreBasicDetails);
    if (this.basicDetails.invalid) {
      this.basicDetails.markAllAsTouched()
      return null;
    }
    else return this.basicDetails.value;
  }

  toggleEdit() {
    //if going to edit-mode, save a copy of original values
    if (this.normalMode) {
      this.basicDetailCache = this.basicDetails.value;
      this.basicDetailCache.cuisines = [...this.basicDetailCache.cuisines];
    }
    this.normalMode = !this.normalMode;
  }

  cancelEdit() {
    this.normalMode = !this.normalMode;
    this.basicDetails.patchValue(this.basicDetailCache);
  }

  onSubmit() {
    if (this.basicDetails.invalid) {
      this.basicDetails.markAllAsTouched();
    }
    else {
      let currentData: StoreBasicDetails = { ...this.basicDetails.value };
      currentData.openingHours = this.storeBasicDetail.openingHours;
      // currentData.imageUrl = this.imageUrl;
      this.saved.emit(currentData);
    }
  }

  onFileChanged(event: any) {
    if (event.target.files[0]) {
      this.basicDetails.markAsDirty();
      this.imageOpened.emit(event.target.files[0]);
      event.target.value = '';
    }
  }

  displayError(cntlName: string): boolean {
    return this.basicDetails.controls[cntlName].invalid && this.basicDetails.controls[cntlName].touched;
  }

}
