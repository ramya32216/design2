import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorePendingListComponent} from './store-pending-list/store-pending-list.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { FileuploadModule } from 'src/app/_modules/fileupload/fileupload.module';
import { PaginationModule } from 'src/app/_modules/pagination/pagination.module';
import { ShellStaffFilterComponent } from 'src/app/views/admin-dashboard/manage/store-shell/shell-staff-filter/shell-staff-filter.component';
import { AdminStoreFilterModule } from '../modules/admin-store-filter/admin-store-filter.module';

const routes: Routes = [
  {
    path: '',
    component:  StorePendingListComponent ,
  },
]

@NgModule({
  declarations: [StorePendingListComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    FileuploadModule,
    PaginationModule,
    AdminStoreFilterModule
  ]
})
export class StorePendingListModule { }
