import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  MatCommonModule,
  MatPseudoCheckboxModule,
  MatRippleModule,
} from '@angular/material/core';
import { MatOptgroup } from './optgroup';
import { MatCustomOption } from './option';
import { MatCustomSelectAllOption } from './select-all';

@NgModule({
  imports: [
    MatRippleModule,
    CommonModule,
    MatCommonModule,
    MatPseudoCheckboxModule,
  ],
  exports: [MatCustomOption, MatOptgroup, MatCustomSelectAllOption],
  declarations: [MatCustomOption, MatOptgroup, MatCustomSelectAllOption],
})
export class MatCustomOptionModule {}

export * from './optgroup';
export * from './option';
export * from './option-parent';
