import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreOrdersComponent } from './store-orders.component';
import { Routes, RouterModule } from '@angular/router';
import { OrdersListComponent } from './orders-list/orders-list.component';
import { OrdersContainerComponent } from './orders-container/orders-container.component';
import { OrdersHistoryComponent } from './orders-history/orders-history.component';

import { SharedModule } from 'src/app/views/shared/shared.module';
import { FileuploadModule } from 'src/app/_modules/fileupload/fileupload.module';
import { PaginationModule } from 'src/app/_modules/pagination/pagination.module';
import { OrderDetailsComponent } from './order-details/order-details.component';
const routes: Routes = [
  {
    path: '',
    component: StoreOrdersComponent,
  },
  {
    path: ':order-type',
    component: StoreOrdersComponent,
    // children: [
    //   {
    //     path: 'order-id',
    //     component: OrderDetailsComponent ,
    //   }]
  },
  {
    path:':order-type/:order-id',
    component: OrderDetailsComponent 

  },

  {
    path: '**',
    redirectTo: 'orders',
    pathMatch: 'full'
  },
  
    
  ]

  

const routingModule = RouterModule.forChild(routes);

@NgModule({
  declarations: [StoreOrdersComponent, OrdersListComponent, OrdersContainerComponent, OrdersHistoryComponent, OrderDetailsComponent],
  imports: [
    CommonModule,
    routingModule,
    SharedModule,
    
    FileuploadModule,
    PaginationModule
  ]
})
export class StoreOrdersModule { }
