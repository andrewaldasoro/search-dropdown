import { OverlayModule } from '@angular/cdk/overlay';
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import {
  MatCommonModule,
  MatOptionModule,
  MatPseudoCheckboxModule,
  MatRippleModule,
} from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { OptionComponent } from './option';
import {
  SEARCH_DROPDOWN_SELECT_SCROLL_STRATEGY_PROVIDER,
  SearchDropdownSelect,
  SearchDropdownSelectTrigger,
} from './search-dropdown-select';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    OverlayModule,
    MatOptionModule,
    MatChipsModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatDividerModule,
    MatCommonModule,
    MatPseudoCheckboxModule,
    MatRippleModule,
  ],
  exports: [
    CdkScrollableModule,
    MatFormFieldModule,
    SearchDropdownSelect,
    SearchDropdownSelectTrigger,
    OptionComponent,
    MatOptionModule,
    MatCommonModule,
  ],
  declarations: [
    SearchDropdownSelect,
    SearchDropdownSelectTrigger,
    OptionComponent,
  ],
  providers: [SEARCH_DROPDOWN_SELECT_SCROLL_STRATEGY_PROVIDER],
})
export class SearchDropdownSelectModule {}
