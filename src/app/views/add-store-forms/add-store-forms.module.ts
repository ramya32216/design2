import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AddStoreFormsComponent } from './add-store-forms.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthGuard } from 'src/app/_guards';
import { FifthFormsComponent } from './fifth-forms/fifth-forms.component';
import { SharedModule } from '../shared/shared.module';
import { AddStoreGuard } from './guards/add-store.guard';


const routes: Routes = [
  {
    path: '',
    component: AddStoreFormsComponent ,children:[
      // { path: 'step1',
      // loadChildren: () => import('../add-store-forms/first-forms/first-forms.module').then(m => m.FirstFormsModule)},  
      { path: 'first-form', loadChildren: () => import('../add-store-forms/first-forms/first-forms.module').then(m => m.FirstFormsModule)}, 
      { path: 'step1/:store-id', loadChildren: () => import('../add-store-forms/second-forms/second-forms.module').then(m => m.SecondFormsModule)},
      { path: 'step2/:store-id/ownership', loadChildren: () => import('../add-store-forms/third-forms/third-forms.module').then(m => m.ThirdFormsModule )},
      { path: 'step3/:store-id/bankaccount', loadChildren: () => import('../add-store-forms/fourth-forms/fourth-forms.module').then(m => m.FourthFormsModule )},
      { path: 'step4/:store-id', loadChildren: () => import('../add-store-forms/fifth-forms/fifth-forms.module').then(m => m.FifthFormsModule )},
      {
        path: '**',
        redirectTo: 'first-form',
        pathMatch: 'full'
      }
    ],canActivate: [AddStoreGuard],
    data: {
      permission:[1]
    },
  },
]
const routingModule = RouterModule.forChild(routes);


@NgModule({
  declarations: [AddStoreFormsComponent],
  imports: [
    CommonModule,
    SharedModule,
    routingModule,
    ReactiveFormsModule,
    FormsModule
  ],
})
export class AddStoreFormsModule { }
