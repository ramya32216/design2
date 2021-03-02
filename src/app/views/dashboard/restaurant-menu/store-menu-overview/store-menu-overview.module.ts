import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { RestaurantMenuOverviewComponent } from './restaurant-menu-overview/restaurant-menu-overview.component';
import { StoreMenuOverviewDetailedComponent } from './store-menu-overview-detailed/store-menu-overview-detailed.component';
import { SharedModule } from 'src/app/views/shared/shared.module';
import { StoreMenuOverviewCategoryListComponent } from './store-menu-overview-category-list/store-menu-overview-category-list.component';
import { StoreMenuItemsCreateComponent } from '../items/store-menu-items-create/store-menu-items-create.component';
import { SampleComponentComponent } from './sample-component/sample-component.component';
import { StoreMenuCategoriesCreateComponent } from '../store-menu-categories-create/store-menu-categories-create.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CustomFormsModule } from 'src/app/_modules/custom-forms/custom-forms.module';
const routes: Routes = [
  {
    path: '',
    component: RestaurantMenuOverviewComponent,
    children: [
      {
        path: 'item/:id', component: StoreMenuItemsCreateComponent
      },
      {
        path: 'category/:id', component: SampleComponentComponent
      }
    ]
  }
]

const restaurantMenuOverviewRouting = RouterModule.forChild(routes);

@NgModule({
  declarations: [RestaurantMenuOverviewComponent, StoreMenuOverviewDetailedComponent, StoreMenuOverviewCategoryListComponent, SampleComponentComponent],
  imports: [
    CommonModule,
    SharedModule,
    restaurantMenuOverviewRouting,
    FormsModule, ReactiveFormsModule,
    CustomFormsModule 
  ]
})
export class StoreMenuOverviewModule { }
