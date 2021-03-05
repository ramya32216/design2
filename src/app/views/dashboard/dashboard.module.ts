import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component'
import { Routes, RouterModule } from '@angular/router';
import { StoreMenuResolver } from 'src/app/_guards/store-menu-resolver';
import { DashboardContainerComponent } from './dashboard-container/dashboard-container.component';
import { not } from '@angular/compiler/src/output/output_ast';
import { NotFoundComponent } from '../shared/not-found/not-found.component';
import { SideNavBarModule } from '../side-nav-bar/side-nav-bar.module';
import { TelephoneInputModule } from 'src/app/_modules/telephone-input/telephone-input.module'
import { LandingpageComponent } from './landingpage/landingpage.component';
import { ReactiveFormsModule,FormsModule} from '@angular/forms';
import { LandingpagethreeComponent } from './landingpagethree/landingpagethree.component';
import { LandingpagefourComponent } from './landingpagefour/landingpagefour.component';
const routes: Routes = [
  {
    path: '',
    component: DashboardComponent
  },
  {
    path: 'stores/:id',
    resolve: {store: StoreMenuResolver},
    component: DashboardContainerComponent,
    children: [
      {
        path: 'menu',
        loadChildren: () => import('./restaurant-menu/restaurant-menu.module').then(m => m.RestaurantMenuModule)
      },
      {
        path: 'orders',
        loadChildren: () => import('./store-orders/store-orders.module').then(m => m.StoreOrdersModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('./store-profile/store-profile.module').then(m => m.StoreProfileModule)
      },
      {
        path: 'member',
        loadChildren: () => import('./store-members/store-members.module').then(m => m.StoreMembersModule)
      },
     

    ],
  },
  {
    path: 'not-found',
    component: NotFoundComponent
  }
]
const dashboardRouting = RouterModule.forChild(routes);

@NgModule({
  declarations: [DashboardComponent, DashboardContainerComponent, LandingpageComponent, LandingpagethreeComponent, LandingpagefourComponent],
  imports: [
    CommonModule,
    dashboardRouting,
    SideNavBarModule,
    ReactiveFormsModule,
    FormsModule,
    TelephoneInputModule
  ],
  providers: [StoreMenuResolver]
})
export class DashboardModule { }
