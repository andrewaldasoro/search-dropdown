import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { MatSearchSelectModule } from './search-dropdown-select-2/search-select.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserAnimationsModule, MatSearchSelectModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
