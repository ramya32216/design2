import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { StorePendingListComponent } from 'src/app/views/admin-dashboard/manage/store-pending-list/store-pending-list/store-pending-list.component';
import { StoreApprovedListComponent } from 'src/app/views/admin-dashboard/manage/store-approved-list/store-approved-list/store-approved-list.component';
import { StoreApprovedDetailsComponent } from './store-approved-details/store-approved-details.component';
import { SharedModule } from '../../shared/shared.module';
import { AdminStoreDataService } from '../_services/admin-store-data.service';
import { FileuploadModule } from 'src/app/_modules/fileupload/fileupload.module';
import { StoreMenuResolver } from 'src/app/_guards/store-menu-resolver';

const routes: Routes = [
  {
    path: 'manage',
    component: AdminDashboardComponent,
    children: [
      {
        path: 'pending',
        loadChildren:() =>import('./store-pending-list/store-pending-list.module').then(m=>m.StorePendingListModule)
      
      },
      {
        path: 'approved',
        loadChildren:() =>import('./store-approved-list/store-approved-list.module').then(m=>m.StoreApprovedListModule)
      },
      {
        path: 'shells',
        loadChildren: () => import('./store-shell/store-shell.module').then(m => m.StoreShellModule)
      },
      {
        path: '**',
        redirectTo: 'pending',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'stores',
    loadChildren: () => import('../store-detail/store-detail.module').then(m => m.StoreDetailModule)
  },
  {
    path: '**',
    redirectTo: 'manage',
    pathMatch: 'full'
  }
]
const adminDashboardRouting = RouterModule.forChild(routes);

@NgModule({
  declarations: [
    AdminDashboardComponent,
    // StorePendingListComponent,
    // StoreApprovedListComponent,
    StoreApprovedDetailsComponent],
  imports: [
    CommonModule,
    SharedModule,
    adminDashboardRouting,
    FileuploadModule
  ],
  providers: [AdminStoreDataService, StoreMenuResolver]
})
export class AdminDashboardModule { }
