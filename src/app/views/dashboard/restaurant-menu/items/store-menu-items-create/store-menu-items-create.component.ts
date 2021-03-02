import { Component, OnInit, OnDestroy, Input, ViewChild, TemplateRef, ElementRef, } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, FormArray, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { RestApiService } from 'src/app/services/rest-api.service';
import { StoreService } from 'src/app/services/store.service';
import { AlertService } from 'src/app/services/alert.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, forkJoin } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { tap, map, finalize, switchMap, mergeMap } from 'rxjs/operators';
import { StringHelperService } from 'src/app/services/string-helper.service';
import { ModalService } from 'src/app/views/shared/services/modal.service';
import { ModalRef } from 'src/app/views/shared/_model/modal-ref';
import { StoreMenuModifierDataService } from '../../_services/store-menu-modifier-data.service';
import { StoreMenuModifier } from 'src/app/_models/store-menu-modifier';
import { StoreMenu } from 'src/app/_models/store-menu';
import { PriceValidator } from 'src/app/_helpers/validators';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-store-menu-items-create',
  templateUrl: './store-menu-items-create.component.html',
  styleUrls: ['./store-menu-items-create.component.scss']
})
export class StoreMenuItemsCreateComponent implements OnInit, OnDestroy {
  itemId: number = null;
  formDataLoaded: boolean = false;
  // uploadedImagePath:string;
  imageUrl: string = null;
  routerSubs: Subscription;
  errors: string;
  saveBtnLoading: boolean = false;
  fileUptoLoad: File;
  modalRef: ModalRef;
  createModalRef: ModalRef;

  modiferEditId: number = null;

  categoryIdMap: Array<{ name: string, id: number }>;
  modifierIdMap: Array<{ name: string, id: number }>;
  modifiers: Array<StoreMenuModifier>;
  formSubmitted: boolean = false;

  @ViewChild('createModifier', { read: TemplateRef }) creator: TemplateRef<any>;
  // _options: FormArray = new FormArray(new Array<FormGroup>());

  createItemForm: FormGroup = new FormGroup({
    itemName: new FormControl(null, [Validators.required, removeSpaces]),
    itemDescription: new FormControl(''),
    itemKeyword: new FormControl(''),
    itemBasePrice: new FormControl('', [Validators.required,Validators.min(1),Validators.pattern(/^\d*(?:[.,]\d{1,2})?$/)]),
    itemStock: new FormControl('1'),
    sellitem: new FormControl('1'),
    categories: new FormArray([]),
    modifiers: new FormControl([])
    // menus: new FormArray([], [this.minChecksValidator()])
  })

  constructor(
    private _modalService: NgbModal,
    private restApiService: RestApiService,
    private storeService: StoreService,
    private alertService: AlertService,
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService,
    private stringHelper: StringHelperService,
    public modalServ: ModalService,
    private modifierData: StoreMenuModifierDataService,
    private customModal: ModalService,
    // private currFormat: CurrencyPipe
  ) {
    this.routerSubs = this.route.params.subscribe(params => {
      //creating a new category
      this.modifierData.allModifiers().subscribe(mods => this.modifiers = mods);
      if (params['id'] === undefined) {
        this.fetchData()
        return;
      };

      //update existing category
      this.itemId = +params['id'];
      // if category is not a number
      if (!this.itemId) {
        this.router.navigate(['./not-found'], { relativeTo: this.route });
      }
      this.fetchData();
    })
  }

  // setFormat(index: number) {
  //   setTimeout(() => {
  //     let priceControl: AbstractControl = (<FormGroup>(this._options.at(index))).controls.price;
  //     if (priceControl.valid) {
  //       priceControl.setValue(this.currFormat.transform(parseFloat(priceControl.value.replace(',', '')), '', ''));
  //     }
  //   }, 0);
  // }

  // validate(c: FormControl) {
  //   return this._options.valid ? null : { invalid: true }
  // }

  ngOnDestroy(): void {
    this.routerSubs.unsubscribe();
  }

  ngOnInit(): void {
  }

  navigateBack() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  pagebackPopup(back) {
    this.modalService.open(back, { centered: true, size: 'sm' });
  }

  get modalService(): NgbModal {
    return this._modalService;
  }

  showTemplate(modifierAdd) {
    this.modalRef = this.modalServ.openTemplate(modifierAdd);
  }

  minChecksValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      let sum = 0;
      (<FormArray>control).controls.forEach(ctrl => {
        if (ctrl.value) sum += 1;
      });
      return sum ? null : { 'MinimumSelection': "Please select atleast one menu" };
    };
  }

  onModSelect(mods: Array<StoreMenuModifier>) {
    this.modalRef.dismiss();
    this.createItemForm.controls.modifiers.setValue(mods)
    console.log(this.createItemForm);
  }

  removeSelectedMod(modifier: StoreMenuModifier) {
    this.customModal.getConfirmation({
      heading: `Deleting modifier ${modifier.name}`,
      dialog: 'Are you sure',
      confirmBtn: 'Delete',
      declineBtn: 'Cancel'
    }).subscribe(() => {
      this.removeModifer(modifier.id);
    })
  }

  removeModifer(modifierId) {
    let value = this.createItemForm.controls.modifiers.value as Array<StoreMenuModifier>
    let index = value.findIndex((mod) => mod.id == modifierId);
    value.splice(index, 1);
  }

  initializeModifierEditor(modifier: StoreMenuModifier) {
    console.log('recieved edit model', modifier);

    this.showTemplate(this.creator);
  }

  fetchData() {
    let categories$ = this.restApiService.getDataObs('store/items/category/' + this.storeService.activeStore).pipe(tap(
      categories => {
        if (categories.success && categories.data) {
          this.categoryIdMap = [];
          categories.data.forEach(category => {
            this.categoryIdMap.push({ id: category.category_id, name: category.category_name });
            (<FormArray>this.createItemForm.controls.categories).push(new FormControl(false));
          });
        }
      }
    ));

    // let menus$ = this.restApiService.getDataObs('store/items/modifier/' + this.storeService.activeStore).pipe(tap(
    //   menus => {
    //     if (menus.success && menus.data) {
    //       this.modifierIdMap = [];
    //       menus.data.forEach(modifier => {
    //         this.modifierIdMap.push({ id: modifier.modifier_id, name: modifier.modifier_name });
    //         (<FormArray>this.createItemForm.controls.modifier).push(new FormControl(false));
    //       });
    //     }
    //   }
    // ));

    let modifiers$ = this.modifierData.allModifiers().pipe(tap(
      modifiers => {
        this.modifiers = modifiers;
      }
    ))

    let inputObservables = [modifiers$, categories$];

    if (this.itemId) {
      let item$ = this.restApiService.getDataObs(`store/items/get/${this.storeService.activeStore}/${this.itemId}`).pipe(
        finalize(() => this.formDataLoaded = true)
      );
      inputObservables.push(item$);
    }

    forkJoin(inputObservables).pipe(
      map(value => value[2])
    ).subscribe((value) => { if (value) this.updateForm(value) }, (error) => { console.log('errored out', error) });
  }

  updateForm = (data) => {
    // console.log('update form', data);
    if (data.success && data.data.length > 0) {
      let menuItem = data.data[0];
      this.createItemForm.controls.itemName.setValue(menuItem.item_name);
      this.createItemForm.controls.itemDescription.setValue(menuItem.item_description);
      this.createItemForm.controls.itemKeyword.setValue(menuItem.item_keyword);
      this.createItemForm.controls.itemBasePrice.setValue(menuItem.item_base_price);
      // this.createItemForm.controls.itemStock.setValue(menuItem.item_in_stock.toString());
      // this.createItemForm.controls.sellitem.setValue(menuItem.item_individual.toString());
      this.imageUrl = menuItem.item_image;

      menuItem.category_details.forEach(activeCategory => {
        let index: number = this.categoryIdMap.findIndex(category => activeCategory.category_id == category.id);
        if (index != -1) (<FormArray>this.createItemForm.controls.categories).controls[index].setValue(true);
      });

      menuItem.modifiers_details.forEach(activeModifier => {
        let index: number = this.modifiers.findIndex((mod) => activeModifier.modifier_id == mod.id);
        if (index !== -1) this.createItemForm.controls.modifiers.value.push(this.modifiers[index]);
      });
    }
  }

  saveData() {
    //check if entered data is valid
    if (this.createItemForm.invalid) {
      this.createItemForm.markAllAsTouched();
      return;
    }

    //construct data before sending to backend backend
    var data: any = {};
    data.item_name = this.createItemForm.value.itemName ? this.createItemForm.value.itemName.charAt(0).toUpperCase() + this.createItemForm.value.itemName.substr(1).toLowerCase() : '';
    data.item_description = this.createItemForm.value.itemDescription;
    data.item_keyword = this.createItemForm.value.itemKeyword;
    data.item_base_price = this.createItemForm.value.itemBasePrice;
    data.item_in_stock = this.createItemForm.value.itemStock;
    data.item_individual = this.createItemForm.value.sellitem;
    data.item_image = this.imageUrl;
    if (this.itemId) data.item_id = this.itemId;
    let checkCategoryValues: Array<boolean> = this.createItemForm.controls.categories.value;
    let selectedCategory: Array<{ "category_id": number }> = [];
    for (let i = 0; i < checkCategoryValues.length; i++) {
      //if any checkbox is true
      if (checkCategoryValues[i]) {
        //pull id from menu-to-id map
        selectedCategory.push({ "category_id": this.categoryIdMap[i].id })
      }
    }
    data.item_category = selectedCategory;
    //selected modifier list 
    // let checkModifierValues: Array<boolean> = this.createItemForm.controls.modifiers.value;
    // let selectedModifier: Array<{ "modifier_id": number }> = [];
    // for (let i = 0; i < checkModifierValues.length; i++) {
    //   //if any checkbox is true
    //   if (checkModifierValues[i]) {
    //     //pull id from menu-to-id map
    //     selectedModifier.push({ "modifier_id": this.modifierIdMap[i].id })
    //   }
    // }
    data.item_modifier = [];
    let selectedMods = this.createItemForm.controls.modifiers.value as Array<StoreMenuModifier>;
    selectedMods.forEach(mod => {
      let backEndMod = { modifier_id: mod.id };
      data.item_modifier.push(backEndMod);
    });
    if (this.imageUrl) data.item_image = this.stringHelper.ExtractFileName(this.imageUrl);
    this.saveBtnLoading = true;
    this.restApiService.postAPI(`store/items/add/${this.storeService.activeStore}`
      , data
      , (resp) => {
        if (resp.success) {
          this.saveBtnLoading = false;
          this.formSubmitted = true;
          this.alertService.showNotification(`Item ${this.itemId ? "updated" : "created"}`, 'success');
          setTimeout(() => {
            this.router.navigate(['../'], { relativeTo: this.route });
          }, 0);
        }
    //    else this.alertService.showNotification("There was a problem, please try again.");
      }
    )
  }

  deleteData() {
    this.customModal.getConfirmation({
      heading: `Delete item "${this.createItemForm.value.itemName}"`,
      dialog: 'Do you sure?',
      confirmBtn: 'Delete',
      declineBtn: 'Cancel'
    }).pipe(
      switchMap(() => {
        let data: any = {};
        data.item_id = this.itemId;
        data.item_name = this.createItemForm.value.itemName;
        data.active_flag = 0;
        data.item_id = this.itemId;
        return this.restApiService.postData(`store/items/add/${this.storeService.activeStore}`, data);
      })
    ).subscribe(() => {
      this.alertService.showNotification('Item deleted.');
      this.navigateBack();
    })

    // let data: any = {};
    // data.item_id = this.itemId;
    // data.item_name = this.createItemForm.value.itemName;
    // data.active_flag = 1;
    // data.item_id = this.itemId;
    // this.restApiService.postAPI(`store/items/add/${this.storeService.activeStore}`
    //   , data
    //   , (resp) => {
    //     if (resp.success) {
    //       this.alertService.showNotification('Item successfully deleted.');
    //       this.navigateBack();
    //     }
    //   }
    //   , (err) => {
    //     this.alertService.showNotification('There was an error while deleting the category, please try again.');
    //   })
  }

  categoryForm() {
    return (<FormArray>this.createItemForm.controls.categories).controls;
  }

  modifierForm() {
    return (<FormArray>this.createItemForm.controls.modifier).controls;
  }

  onFileChanged(event) {
    this.fileUptoLoad = event.target.files[0];
    if (this.fileUptoLoad) {
      if (!this.dataService.validateFileSize(this.fileUptoLoad.size)) {
        this.alertService.showNotification('File to be uploaded should be less than 5MB', 'error')
        return false;
      }
      if (!this.dataService.validateFileExtension(this.fileUptoLoad.name)) {
        this.alertService.showNotification('Selected file format is not supported', 'error')
        return false;
      }
      let reader = new FileReader();
      reader.readAsDataURL(this.fileUptoLoad);

      reader.onload = (e: any) => {
        var img = new Image();
        img.src = e.target.result;
        img.onload = () => {
          if (img.width < 500 || img.height < 500) {
            this.alertService.showNotification('Minimum size 500*500 pixel', 'error')
            return false;
          }
          let form_data = new FormData();
          form_data.append('item_image', this.fileUptoLoad);
          this.alertService.showLoader();
          this.restApiService.pushSaveFileToStorageWithFormdata(form_data, 'store/items/upload/image', (response) => {
            if (response && response['success'] && response['data']) {
              this.imageUrl = response['data'];
              this.alertService.hideLoader();
            }
          });
        }
      }
    } else {
      this.alertService.showNotification('No file selected', 'error');
    }
  }

  modifierRefresh() {
    this.modifierData.allModifiers().subscribe(mods => {
      this.modifiers = mods;
      this.modifiers.forEach(mod => {
        let index = this.createItemForm.controls.modifiers.value.findIndex(selectedMods => selectedMods.id == mod.id);
        if (index > -1) this.createItemForm.controls.modifiers.value[index] = mod;
      })
    })
  }

  handleModiferEditorExit(modifierId: number) {
    if (modifierId) {
      this.createItemForm.controls.modifiers.value.push(new StoreMenuModifier(modifierId, null));
      this.createItemForm.controls.modifiers.setValue([...this.createItemForm.controls.modifiers.value]); 
    }
    this.createModalRef.dismiss(); this.modifierRefresh();
  }

  duplicateItem() {
    this.customModal.getConfirmation({ heading: 'Item duplication', dialog: "Are you sure?", confirmBtn: 'Continue', declineBtn: 'Cancel' }).pipe(
      tap(() => this.alertService.showLoader()),
      switchMap(() => {
        return this.restApiService.getDataObs(`store/items/get/${this.storeService.activeStore}/${this.itemId}`).pipe(
          switchMap((resp) => {
            let data = resp.data[0];
            let category = data.category_details;
            let modifier = data.modifiers_details;
            delete data.item_id;
            delete data.modifiers_details;
            delete data.category_details;

            data.item_category = category;
            data.item_modifier = modifier;
            return this.restApiService.postData(`store/items/add/${this.storeService.activeStore$.value.id}`, data);
          })
        )
      })
    ).subscribe(() => { this.alertService.showNotification('A duplicate of this has been created'); this.alertService.hideLoader() });
  }

  shouldPreventNavigation() {
    if (!this.createItemForm.dirty) return false;
    else {
      if (this.formSubmitted) return false;
      else return true;
    }
  }

}


export function removeSpaces(control: AbstractControl) {
  if (control && control.value && !control.value.replace(/\s/g, '').length) {
    control.setValue('');
  }
  return null;
}