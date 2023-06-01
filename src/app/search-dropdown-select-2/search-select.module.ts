import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import {
  MatCommonModule,
  MatPseudoCheckboxModule,
  MatRippleModule,
} from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserModule } from '@angular/platform-browser';
import { MatSearchSelect } from './search-select';
import { MatSelectModule } from './select.module';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    MatDividerModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatPseudoCheckboxModule,
    MatRippleModule,
    MatSelectModule,
    MatCommonModule,
  ],
  exports: [
    MatFormFieldModule,
    MatSearchSelect,
    MatSelectModule,
    MatCommonModule,
  ],
  declarations: [MatSearchSelect],
})
export class MatSearchSelectModule {}
