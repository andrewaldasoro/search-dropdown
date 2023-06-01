import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  MatCommonModule,
  MatPseudoCheckboxModule,
  MatRippleModule,
} from '@angular/material/core';
import { MatOptgroup } from './optgroup';
import { MatOption } from './option';
import { MatSelectAllOption } from './select-all';

@NgModule({
  imports: [
    MatRippleModule,
    CommonModule,
    MatCommonModule,
    MatPseudoCheckboxModule,
  ],
  exports: [MatOption, MatOptgroup, MatSelectAllOption],
  declarations: [MatOption, MatOptgroup, MatSelectAllOption],
})
export class MatOptionModule {}

export * from './optgroup';
export * from './option';
export * from './option-parent';
