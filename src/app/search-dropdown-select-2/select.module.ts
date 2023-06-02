import { OverlayModule } from '@angular/cdk/overlay';
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCommonModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCustomOptionModule } from './option.module';
import {
  MAT_SELECT_SCROLL_STRATEGY_PROVIDER,
  MatCustomSelect,
  MatCustomSelectTrigger,
} from './select';

@NgModule({
  imports: [
    CommonModule,
    OverlayModule,
    MatCustomOptionModule,
    MatCommonModule,
  ],
  exports: [
    CdkScrollableModule,
    MatFormFieldModule,
    MatCustomSelect,
    MatCustomSelectTrigger,
    MatCustomOptionModule,
    MatCommonModule,
  ],
  declarations: [MatCustomSelect, MatCustomSelectTrigger],
  providers: [MAT_SELECT_SCROLL_STRATEGY_PROVIDER],
})
export class MatCustomSelectModule {}
