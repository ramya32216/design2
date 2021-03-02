import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminStoreFilterComponent } from './admin-store-filter/admin-store-filter.component';



@NgModule({
  declarations: [AdminStoreFilterComponent],
  imports: [
    CommonModule
  ],
  exports: [AdminStoreFilterComponent]
})
export class AdminStoreFilterModule { }
