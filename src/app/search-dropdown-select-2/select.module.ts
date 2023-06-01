import { OverlayModule } from '@angular/cdk/overlay';
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCommonModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from './option.module';
import {
  MAT_SELECT_SCROLL_STRATEGY_PROVIDER,
  MatSelect,
  MatSelectTrigger,
} from './select';

@NgModule({
  imports: [CommonModule, OverlayModule, MatOptionModule, MatCommonModule],
  exports: [
    CdkScrollableModule,
    MatFormFieldModule,
    MatSelect,
    MatSelectTrigger,
    MatOptionModule,
    MatCommonModule,
  ],
  declarations: [MatSelect, MatSelectTrigger],
  providers: [MAT_SELECT_SCROLL_STRATEGY_PROVIDER],
})
export class MatSelectModule {}
