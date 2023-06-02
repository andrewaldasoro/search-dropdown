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
import { SearchSelect } from './search-select';
import { MatCustomSelectModule } from './select.module';

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
    MatCustomSelectModule,
    MatCommonModule,
  ],
  exports: [
    MatFormFieldModule,
    SearchSelect,
    MatCustomSelectModule,
    MatCommonModule,
  ],
  declarations: [SearchSelect],
})
export class MatSearchSelectModule {}
