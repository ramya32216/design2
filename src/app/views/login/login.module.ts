import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule,FormsModule} from '@angular/forms';
// import { TopNavBarComponent } from '../top-nav-bar/top-nav-bar.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
]
const routingModule = RouterModule.forChild(routes);

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    routingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class LoginModule { }
