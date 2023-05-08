import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '../material.module';

import { SearchDropdownSelectComponent } from './app-search-dropdown-select.component';
import { AppComponent } from './app.component';
import { SearchDropdownSelectModule } from './search-dropdown-select-2/module';
import { SearchDropdownSelectComponent as ClonedSearchDropdownSelectComponent } from './search-dropdown-select/search-dropdown-select.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchDropdownSelectComponent,
    ClonedSearchDropdownSelectComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    SearchDropdownSelectModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
