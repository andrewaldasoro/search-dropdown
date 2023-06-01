import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPseudoCheckboxState } from '@angular/material/core';

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
  @ViewChild('selectCheckbox', { static: false, read: ElementRef })
  selectCheckbox?: ElementRef<HTMLElement>;

  searchValue = '';
  _options: Option[] = [];
  _multiple = false;
  _hideSelectAll = false;

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

  @Input()
  get hideSelectAll() {
    return this._hideSelectAll;
  }
  set hideSelectAll(value: boolean) {
    this._hideSelectAll = coerceBooleanProperty(value);
  }

  get selectedOptions() {
    return this._options.filter((option) => option.selected);
  }

  get optionSelectionState(): MatPseudoCheckboxState {
    if (this._options.every((option) => option.selected)) {
      return 'checked';
    } else if (this._options.some((option) => option.selected)) {
      return 'indeterminate';
    } else {
      return 'unchecked';
    }
  }

  constructor() {
    this.options = [
      { value: 'apple', label: 'Apple', selected: false },
      { value: 'mango', label: 'Mango', selected: false },
      { value: 'blueberry', label: 'Blueberry', selected: false },
    ];

    // this.multiple = true;
  }

  remove(option: Option): void {
    option.selected = false;
  }

  _getHostSelectCheckboxElement(): HTMLElement | undefined {
    return this.selectCheckbox?.nativeElement;
  }

  onSelectAll(value: boolean) {
    if (this._options)
      this._options.forEach((option) => {
        option.selected = value;
      });
  }

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
