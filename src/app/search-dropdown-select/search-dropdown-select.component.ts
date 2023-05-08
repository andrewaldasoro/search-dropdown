import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
    Component,
    ElementRef,
    EventEmitter,
    forwardRef,
    HostBinding,
    Input,
    OnDestroy,
    OnInit,
    Optional,
    Output,
    Self,
    ViewChild,
} from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import {
    MatFormField,
    MatFormFieldControl,
} from '@angular/material/form-field';
import { catchError, finalize, Observable, of, Subject, takeUntil } from 'rxjs';

interface Option {
  value: string;
  label: string;
  selected?: boolean;
}

@Component({
  selector: 'search-dropdown-select-legacy',
  templateUrl: './search-dropdown-select.component.html',
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: forwardRef(() => SearchDropdownSelectComponent),
    },
  ],
})
export class SearchDropdownSelectComponent
  implements
    MatFormFieldControl<Option | Option[] | undefined>,
    ControlValueAccessor,
    OnInit,
    OnDestroy
{
  static nextId = 0;

  @HostBinding()
  id = `app-search-dropdown-select-${SearchDropdownSelectComponent.nextId++}`;
  @HostBinding('class.floating')
  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  @Input()
  get value() {
    return this.ngControl.control?.value;
  }
  set value(value: Option | Option[] | undefined) {
    this.ngControl.control?.setValue(value);
    this.stateChanges.next();
  }

  @Input()
  get required(): boolean {
    return this._required;
  }
  set required(req: boolean) {
    this._required = coerceBooleanProperty(req);
    this.stateChanges.next();
  }
  private _required = false;

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    this.stateChanges.next();
  }
  private _disabled = false;

  @Input()
  get placeholder(): string {
    return this._placeholder;
  }
  set placeholder(plh: string) {
    this._placeholder = plh;
    this.stateChanges.next();
  }
  private _placeholder = '';

  get empty(): boolean {
    return !this.ngControl?.value;
  }

  get errorState(): boolean {
    return false;
  }

  @Output() selectionChange = new EventEmitter<string | string[]>();

  @Input() options?: { value: string; label?: string }[];
  @Input() request?: (
    searchValue?: string,
    from?: number,
    to?: number
  ) => Observable<{ value: string; label?: string }[]>;
  @Input() multiple = false; // if can select multiple values

  controlType = 'app-search-dropdown-select';
  searchControl = new FormControl();
  stateChanges = new Subject<void>();
  touched = false;
  focused = false;
  isOpen = false;
  describedBy?: string;

  isLoading = false;
  failed = false;

  cancelRequest = new Subject<void>();
  unsubscriber = new Subject<void>();

  requestWithPipe?: (
    searchValue?: string,
    from?: number,
    to?: number
  ) => Observable<{ value: string; label?: string }[]>;

  get dropdownOptions() {
    const searchValue = this.searchControl.value;
    let localDropdownOptions = this.localDropdownOptions;
    if (this.searchControl.value) {
      localDropdownOptions = this.localDropdownOptions.filter((option) =>
        option.label.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    if (
      localDropdownOptions &&
      localDropdownOptions.length > 0 &&
      this.asyncDropdownOptions &&
      this.asyncDropdownOptions.length > 0
    ) {
      return localDropdownOptions.concat(this.asyncDropdownOptions);
    } else {
      if (localDropdownOptions && localDropdownOptions.length > 0)
        return localDropdownOptions;
      if (this.asyncDropdownOptions && this.asyncDropdownOptions.length > 0)
        return this.asyncDropdownOptions;
    }

    return [];
  }

  get selectedDropdownOptions() {
    if (!this.value) return [];

    if (Array.isArray(this.value))
      return this.value.map(
        (v) => this.dropdownOptions.find((option) => option.value === v.value)!
      );

    return [];
  }

  get noData() {
    return this.dropdownOptions.length === 0;
  }

  get hasSelectAll() {
    if (
      this.localDropdownOptions &&
      this.localDropdownOptions.length > 0 &&
      (!this.asyncDropdownOptions || this.asyncDropdownOptions.length === 0)
    )
      return true;

    return false;
  }

  localDropdownOptions: Option[] = [];
  asyncDropdownOptions: Option[] = [];

  private from = 0;
  private to = 10;
  private lastValueSearched?: string;

  get hasLocalAndAsyncOptions() {
    return (
      this.localDropdownOptions &&
      this.localDropdownOptions.length > 0 &&
      (this.isLoading ||
        this.failed ||
        (this.asyncDropdownOptions && this.asyncDropdownOptions.length > 0))
    );
  }

  @ViewChild('optionList', { static: false, read: ElementRef })
  optionList?: ElementRef;

  constructor(
    @Optional() @Self() public ngControl: NgControl,
    @Optional() public parentFormField: MatFormField
  ) {
    if (this.ngControl !== null) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnInit() {
    if (this.options)
      this.localDropdownOptions = this.options.map((option) => ({
        value: option.value,
        label: option.label ?? option.value,
        selected: false,
      }));

    if (this.request) {
      this.requestWithPipe = (searchValue, from, to) => {
        this.cancelRequest.next();
        this.lastValueSearched = searchValue;

        this.isLoading = true;
        this.failed = false;

        this.asyncDropdownOptions = [];

        if (this.request)
          return this.request(searchValue, from, to).pipe(
            catchError((err) => {
              this.failed = true;
              return of([]);
            }),
            finalize(() => {
              this.isLoading = false;
            }),
            takeUntil(this.cancelRequest)
          );

        return of([]);
      };

      this.requestWithPipe(undefined, this.from, this.to).subscribe(
        (options) => {
          console.log('response: ', options);
          if (options)
            this.asyncDropdownOptions = options.map((option) => ({
              value: option.value,
              label: option.label ?? option.value,
            }));
        }
      );
    }
  }

  ngOnDestroy() {
    this.unsubscriber.next();
    this.unsubscriber.complete();
    this.cancelRequest.complete();
    this.stateChanges.complete();
  }

  onFocusIn(_: FocusEvent) {
    if (!this.focused) {
      this.focused = true;
      this.stateChanges.next();
    }
  }

  onFocusOut(_: FocusEvent) {
    this.focused = false;
    this.onTouched();
    this.stateChanges.next();
  }

  _onChange: (_: Option | Option[]) => void = (_value: Option | Option[]) => {
    this.value = _value;
  };

  onTouched: () => void = () => {
    this.touched = true;
  };

  registerOnChange(fn: (_: Option | Option[]) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  writeValue() {
    // this.value.forEach((v) => {
    //   const toSelectValue = this.treeControl.dataNodes.find(
    //     (node) => node.value === v
    //   );
    //   if (toSelectValue) this.selectionToggle(toSelectValue, true);
    // });
  }

  onContainerClick(event: MouseEvent) {
    this.isOpen = true;
  }

  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }

  searchValueChange() {
    if (
      this.requestWithPipe &&
      this.searchControl.value !== this.lastValueSearched
    )
      this.requestWithPipe(
        this.searchControl.value,
        this.from,
        this.to
      ).subscribe((options) => {
        if (options)
          this.asyncDropdownOptions = options.map((option) => ({
            value: option.value,
            label: option.label ?? option.value,
          }));
      });
  }

  onSelectAll(event: MatCheckboxChange) {
    if (this.options)
      this.localDropdownOptions.forEach((option) => {
        option.selected = event.checked;
      });

    this.value = this.dropdownOptions.filter((option) => option.selected);
  }

  getAllSelected() {
    if (!this.value || !Array.isArray(this.value)) return false;

    return this.dropdownOptions.length === this.value.length;
  }

  getSomeSelected() {
    if (!this.value || !Array.isArray(this.value)) return false;

    return (
      this.value.length > 0 && this.dropdownOptions.length !== this.value.length
    );
  }

  onSelectedOptionChange(option: Option) {
    option.selected = !option.selected;
    this.value = this.dropdownOptions.filter((option) => option.selected);
  }

  getTitleLabel(value?: Option | Option[]) {
    if (!value) return '';

    if (Array.isArray(value)) {
      if (value.length === 0) return 'None';

      return value
        .map(
          (v) =>
            this.dropdownOptions.find((option) => option.value === v.value)!
              .label
        )
        .map((v) =>
          v
            .split('.')
            .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
            .join('.')
        )
        .join(', ');
    }

    return this.dropdownOptions.find((option) => option.value === value.value)!
      .label;
  }

  remove(value: string): void {
    if (!this.value || !Array.isArray(this.value)) return;

    const foundValue = this.value.find((v) => v.value === value)!;
    foundValue.selected = false;

    this.value = this.dropdownOptions.filter((option) => option.selected);
  }

  setValue(value: Option) {
    this.value = value;
    this.isOpen = false;
  }

  onOptionListOpened() {
    setTimeout(() => {
      this.registerOptionListScrollEvent();
    }, 300);
  }

  private registerOptionListScrollEvent() {
    const panel = this.optionList!.nativeElement as HTMLDivElement;
    panel.addEventListener('scroll', (event: Event) =>
      this.loadAllOnScroll(event)
    );
  }

  private loadAllOnScroll(event: Event) {
    const reloadScrollTopPosition =
      (event.target as HTMLDivElement).scrollHeight -
      (event.target as HTMLDivElement).clientHeight -
      42;

    console.log(event);
    console.log(
      (event.target as HTMLDivElement).scrollHeight,
      (event.target as HTMLDivElement).clientHeight
    );

    //   if (
    //     (event.target as HTMLDivElement).scrollTop > reloadScrollTopPosition &&
    //     !this.tagsLimitReached
    //   ) {
    //     this.tagManagerService
    //       .getTagsByDeviceType(this.deviceType.value, this.tags.length)
    //       .subscribe({
    //         next: (tags) => {
    //           if (tags.data.length > 0) {
    //             this.tags.push(...tags.data.map((tag) => tag.name));
    //           } else {
    //             this.tagsLimitReached = true;
    //           }
    //         },
    //         complete: () => {
    //           this.loadingTags = false;
    //         },
    //       });
    // }
  }
}
