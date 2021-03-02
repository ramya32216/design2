import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageUnderProgressComponent } from './page-under-progress.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: PageUnderProgressComponent
  },
]
const routingModule = RouterModule.forChild(routes);
@NgModule({
  declarations: [PageUnderProgressComponent],
  imports: [
    CommonModule,
    routingModule,
    SharedModule
  ]
})
export class PageUnderProgressModule { }
