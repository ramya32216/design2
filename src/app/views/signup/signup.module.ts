import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SignupComponent } from './signup.component';
import { ReactiveFormsModule,FormsModule} from '@angular/forms';
import { TelephoneInputModule } from 'src/app/_modules/telephone-input/telephone-input.module'
// import { TopNavBarComponent } from '../top-nav-bar/top-nav-bar.component';

const routes: Routes = [
  {
    path: '',
    component: SignupComponent
  },
]
const routingModule = RouterModule.forChild(routes);

@NgModule({
  declarations: [SignupComponent],
  imports: [
    CommonModule,
    routingModule,
    ReactiveFormsModule,
    FormsModule,
    TelephoneInputModule
  ]
})
export class SignupModule { }
