import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  MatCommonModule,
  MatPseudoCheckboxModule,
  MatRippleModule,
} from '@angular/material/core';
import { MatOptgroup } from './optgroup';
import { MatOption } from './option';

@NgModule({
  imports: [
    MatRippleModule,
    CommonModule,
    MatCommonModule,
    MatPseudoCheckboxModule,
  ],
  exports: [MatOption, MatOptgroup],
  declarations: [MatOption, MatOptgroup],
})
export class MatOptionModule {}

export * from './optgroup';
export * from './option';
export * from './option-parent';
