import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LandingpageComponent} from './views/dashboard/landingpage/landingpage.component';
import { ForgotPasswordComponent } from './views/forgot-password/forgot-password.component';
import { SignupEmailRedirectComponent } from './views/signup-email-redirect/signup-email-redirect.component';
import { MemberStoreInvitationComponent } from './views/member-store-invitation/member-store-invitation.component';
import { LandingpagetwoComponent } from './views/dashboard/landingpagetwo/landingpagetwo.component';
import { LandingpagethreeComponent } from './views/dashboard/landingpagethree/landingpagethree.component';
// import { PasswordResetComponent } from './views/password-reset/password-reset.component';
import{LandingpagefourComponent} from './views/dashboard/landingpagefour/landingpagefour.component';
const routes: Routes = [
  { path: 'login', loadChildren: () => import('./views/login/login.module').then(m => m.LoginModule)},
  { path: 'signup', loadChildren:() => import('./views/signup/signup.module').then(m => m.SignupModule)},
  { path: 'page-under-progress', loadChildren: () => import('./views/page-under-progress/page-under-progress.module').then(m => m.PageUnderProgressModule)},
  { path: 'confirm-singup', loadChildren:() => import('./views/confirmation-signup/confirmation-signup.module').then(m => m.ConfirmationSignupModule)},
  { path: 'resend-email', loadChildren:() => import('./views/resend-email/resend-email.module').then(m => m.ResendEmailModule) },
  { path: 'forgot-password', component: ForgotPasswordComponent},
  { path: 'page1', component: LandingpageComponent},
  {path:'page2', component: LandingpagetwoComponent},
  {path:'page3', component: LandingpagethreeComponent},
  {path:'page4', component:LandingpagefourComponent},
  {
    path: 'account',
    loadChildren: () => import('src/app/views/dashboard/accounts/account.module').then(m => m.AccountsModule)
  },
  { path: 'email-verify', component: SignupEmailRedirectComponent},
  { path: 'store', loadChildren: () => import('./views/add-store-forms/add-store-forms.module').then(m => m.AddStoreFormsModule)},
  { path: 'dashboard', loadChildren: () => import('./views/containers/containers.module').then(m => m.ContainersModule)},
  { path: 'store-invitation', component: MemberStoreInvitationComponent},
  { path: 'reset-password', loadChildren:() => import('./views/password-reset/password-reset.module').then(m => m.PasswordResetModule)},
  {
    path: '**',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  // imports: [RouterModule.forRoot(routes,{useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
