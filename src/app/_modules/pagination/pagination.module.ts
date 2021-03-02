import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationDataComponent } from './pagination-data/pagination-data.component';
import { PaginationPageSelectorComponent } from './pagination-page-selector/pagination-page-selector.component';
import { ItemsPerPageComponent } from './items-per-page/items-per-page.component';



@NgModule({
  declarations: [PaginationDataComponent, PaginationPageSelectorComponent, ItemsPerPageComponent],
  imports: [
    CommonModule
  ],
  exports: [PaginationDataComponent, PaginationPageSelectorComponent, ItemsPerPageComponent]
})
export class PaginationModule { }
