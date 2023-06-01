import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

interface Option {
  value: any;
  label: string;
  selected: boolean;
}
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
})
export class AppComponent {
  searchValue = '';
  _options: Option[] = [];
  _multiple = false;

  @Input()
  get options() {
    return this._options.filter((option) =>
      option.label.toLowerCase().includes(this.searchValue.toLowerCase())
    );
  }
  set options(value: Option[]) {
    this._options = value;
  }

  @Input()
  get multiple() {
    return this._multiple;
  }
  set multiple(value: boolean) {
    this._multiple = coerceBooleanProperty(value);
  }

  get selectedOptions() {
    return this._options.filter((option) => option.selected);
  }

  constructor() {
    this.options = [
      { value: 'apple', label: 'Apple', selected: false },
      { value: 'mango', label: 'Mango', selected: false },
      { value: 'blueberry', label: 'Blueberry', selected: false },
    ];

    this.multiple = true;
  }

  remove(option: Option): void {
    option.selected = false;
  }

  // onSelectAll(event: MatCheckboxChange) {
  //   if (this.options)
  //     this.options.forEach((option) => {
  //       option.selected = true;
  //     });
  // }

  // getAllSelected() {
  //   if (!this.value || !Array.isArray(this.value)) return false;

  //   console.log(this._options.length, this.value.length);

  //   return this._options.length === this.value.length;
  // }

  // getSomeSelected() {
  //   if (!this.value || !Array.isArray(this.value)) return false;

  //   return this.value.length > 0 && this._options.length !== this.value.length;
  // }

  // request = (searchValue?: string, from = 0, size = 10) => {
  //   const arr = [
  //     { value: 'peach', label: 'Peach' },
  //     { value: 'avocado', label: 'Avocado' },
  //     { value: 'grapes', label: 'Grapes' },
  //   ];
  //   if (!searchValue) return of(arr).pipe(delay(5000));

  //   return of(
  //     arr.filter((v) =>
  //       v.label.toLowerCase().includes(searchValue.toLowerCase())
  //     )
  //   ).pipe(delay(5000));
  // };

  control = new FormControl();
}
