import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreProfileComponent } from './store-profile.component';
import { Routes, RouterModule } from '@angular/router';
import { StoreProfileDataService } from './_services/store-profile-data.service';
import { StoreBasicDetailsComponent } from './profile/store-basic-details/store-basic-details.component';
import { ProfileComponent } from './profile/profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { BankComponent } from './bank/bank.component';
import { StoreBankDetailsComponent } from './bank/store-bank-details/store-bank-details.component';
import { OwnershipComponent } from './ownership/ownership.component';
import { StoreOwnershipDetailsComponent } from './ownership/store-ownership-details/store-ownership-details.component';
import { OpeningHoursComponent } from './opening-hours/opening-hours.component';
import { TimeAvailabilityModule } from 'src/app/_modules/time-availability/time-availability.module';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { FileUploadComponent } from 'src/app/_modules/fileupload/file-upload/file-upload.component';
import { FileuploadModule } from 'src/app/_modules/fileupload/fileupload.module';
import { OwnerRoleGuard } from 'src/app/_guards/user-role.guard';
import { StoreImageModule } from 'src/app/_modules/store-image/store-image.module';
import { CuisinesSelectorModule } from 'src/app/_modules/cuisines-selector/cuisines-selector.module';

const routes: Routes = [
  {
    path: '',
    component: StoreProfileComponent,
    children: [
      {
        path: 'profile',
        component: ProfileComponent,
      },
      {
        path: 'bank',
        component: BankComponent,
        canActivate: [OwnerRoleGuard],
      },
      {
        path: 'ownership',
        canActivate: [OwnerRoleGuard],
        component: OwnershipComponent,
      },
      {
        path: 'opening-hours',
        component: OpeningHoursComponent
      },
      {
        path: '**',
        redirectTo: 'profile',
        pathMatch: 'full'
      }
    ]
  },
]

const routingModule = RouterModule.forChild(routes);

@NgModule({
  declarations: [StoreProfileComponent, StoreBankDetailsComponent, StoreOwnershipDetailsComponent, StoreBasicDetailsComponent, ProfileComponent, BankComponent, OwnershipComponent, OpeningHoursComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    routingModule,
    TimeAvailabilityModule,
    GooglePlaceModule,
    FileuploadModule,
    StoreImageModule,
    CuisinesSelectorModule
  ],
  providers: [StoreProfileDataService]
})
export class StoreProfileModule { }
