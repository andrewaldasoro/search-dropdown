import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPseudoCheckboxState } from '@angular/material/core';

export interface Option {
  value: any;
  label: string;
  selected: boolean;
}

@Component({
  selector: 'search-select',
  templateUrl: 'search-select.html',
  host: {
    class: 'mat-mdc-search-select',
  },
})
export class SearchSelect {
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

  @Input() control: FormControl = new FormControl();

  @Input()
  get hideSelectAll() {
    return this._hideSelectAll;
  }
  set hideSelectAll(value: boolean) {
    this._hideSelectAll = coerceBooleanProperty(value);
  }

  get noData(): boolean {
    return this.options.length === 0;
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
}
