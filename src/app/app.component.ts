import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Option } from './search-dropdown-select-2/search-select';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
})
export class AppComponent {
  options: Option[] = [
    { value: 'apple', label: 'Apple', selected: false },
    { value: 'mango', label: 'Mango', selected: false },
    { value: 'blueberry', label: 'Blueberry', selected: false },
  ];
  multiple = true;
  control = new FormControl();

  constructor() {
    this.control.valueChanges.subscribe((value) => {
      console.log(value);
    });
  }
}
