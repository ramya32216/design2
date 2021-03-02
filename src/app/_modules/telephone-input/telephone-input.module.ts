import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TelephoneInputComponent } from './telephone-input/telephone-input.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [TelephoneInputComponent],
  imports: [
    CommonModule,
    NgxIntlTelInputModule,
    FormsModule,
    ReactiveFormsModule
   
  ],
  exports: [TelephoneInputComponent]
})
export class TelephoneInputModule { }
