import { FocusableOption, FocusOrigin } from '@angular/cdk/a11y';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { ENTER, hasModifierKey, SPACE } from '@angular/cdk/keycodes';
import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Subject } from 'rxjs';

export class Option {
  id: string = `option-${_uniqueIdCounter++}`;
  value: string;

  get label(): string {
    if (this._label) return this._label;

    return this.value;
  }
  set label(s: string | undefined) {
    this._label = s;
  }
  _label?: string;

  get disabled() {
    return this._disabled;
  }
  set disabled(b: boolean) {
    this._disabled = b;

    this._stateChanges.next();
  }
  _disabled = false;

  get selected() {
    return this._selected;
  }
  set selected(b: boolean) {
    this._selected = b;

    this.onSelectionChange.next();
  }
  _selected = false;

  onSelectionChange = new Subject<void>();
  _stateChanges = new Subject<void>();

  constructor(value: string, label?: string, id?: string) {
    this.value = value;
    this.label = label;

    if (id) this.id = id;
  }

  getLabel(): string {
    // required by ListKeyManagerOption
    return this.label;
  }

  select() {
    this.selected = true;
  }

  deselect() {
    this.selected = false;
  }

  _selectViaInteraction() {
    this.selected = !this.selected;
  }

  setActiveStyles() {
    // ???
  }

  setInactiveStyles() {
    // ???
  }
}

/**
 * Option IDs need to be unique across components, so this counter exists outside of
 * the component definition.
 */
let _uniqueIdCounter = 0;

/** Event object emitted by MatOption when selected or deselected. */
export class MatOptionSelectionChange<T = any> {
  constructor(
    /** Reference to the option that emitted the event. */
    public source: _MatOptionBase<T>,
    /** Whether the change in the option's value was a result of a user action. */
    public isUserInput = false
  ) {}
}

@Directive()
export class _MatOptionBase<T = any>
  implements FocusableOption, AfterViewChecked, OnDestroy
{
  private _option!: Option;
  private _active = false;
  private _multiple = false;
  private _disableRipple = false;
  private _hideSingleSelectionIndicator = false;
  private _mostRecentViewValue = '';

  /** The form value of the option. */
  @Input() value!: T;

  /** The unique ID of the option. */
  @Input() id: string = `mat-option-${_uniqueIdCounter++}`;

  @Input()
  get option(): Option {
    return this._option;
  }
  set option(value: Option) {
    this._option = value;
  }

  /** Whether the option is disabled. */
  @Input()
  get disabled(): boolean {
    return this.option.disabled;
  }
  set disabled(value: BooleanInput) {
    this.option.disabled = coerceBooleanProperty(value);
  }

  /** Whether the wrapping component is in multiple selection mode. */
  @Input()
  get multiple(): boolean {
    return this._multiple;
  }
  set multiple(value: BooleanInput) {
    this._multiple = coerceBooleanProperty(value);
  }

  /** Whether or not the option is currently selected. */
  @Input()
  get selected(): boolean {
    return this.option.selected;
  }
  set selected(value: BooleanInput) {
    this.option.selected = coerceBooleanProperty(value);
  }

  /** Whether ripples for the option are disabled. */
  @Input()
  get disableRipple(): boolean {
    return this._disableRipple;
  }
  set disableRipple(value: BooleanInput) {
    this._disableRipple = coerceBooleanProperty(value);
  }

  /** Whether to display checkmark for single-selection. */
  @Input()
  get hideSingleSelectionIndicator(): boolean {
    return this._hideSingleSelectionIndicator;
  }
  set hideSingleSelectionIndicator(value: BooleanInput) {
    this._hideSingleSelectionIndicator = coerceBooleanProperty(value);
  }

  /** Event emitted when the option is selected or deselected. */
  // tslint:disable-next-line:no-output-on-prefix
  @Output() readonly onSelectionChange = new EventEmitter<
    MatOptionSelectionChange<T>
  >();

  /** Element containing the option's text. */
  @ViewChild('text', { static: true }) _text:
    | ElementRef<HTMLElement>
    | undefined;

  /** Emits when the state of the option changes and any parents have to be notified. */
  readonly _stateChanges = new Subject<void>();

  constructor(
    private _element: ElementRef<HTMLElement>,
    public _changeDetectorRef: ChangeDetectorRef
  ) {}

  /**
   * Whether or not the option is currently active and ready to be selected.
   * An active option displays styles as if it is focused, but the
   * focus is actually retained somewhere else. This comes in handy
   * for components like autocomplete where focus must remain on the input.
   */
  get active(): boolean {
    return this._active;
  }

  /**
   * The displayed value of the option. It is necessary to show the selected option in the
   * select's trigger.
   */
  get viewValue(): string {
    // TODO(kara): Add input property alternative for node envs.
    return (this._text?.nativeElement.textContent || '').trim();
  }

  /** Selects the option. */
  select(): void {
    if (!this.option.selected) {
      this.option.selected = true;
      this._changeDetectorRef.markForCheck();
      this._emitSelectionChangeEvent();
    }
  }

  /** Deselects the option. */
  deselect(): void {
    if (this.option.selected) {
      this.option.selected = false;
      this._changeDetectorRef.markForCheck();
      this._emitSelectionChangeEvent();
    }
  }

  /** Sets focus onto this option. */
  focus(_origin?: FocusOrigin, options?: FocusOptions): void {
    // Note that we aren't using `_origin`, but we need to keep it because some internal consumers
    // use `MatOption` in a `FocusKeyManager` and we need it to match `FocusableOption`.
    const element = this._getHostElement();

    if (typeof element.focus === 'function') {
      element.focus(options);
    }
  }

  /**
   * This method sets display styles on the option to make it appear
   * active. This is used by the ActiveDescendantKeyManager so key
   * events will display the proper options as active on arrow key events.
   */
  setActiveStyles(): void {
    if (!this._active) {
      this._active = true;
      this._changeDetectorRef.markForCheck();
    }
  }

  /**
   * This method removes display styles on the option that made it appear
   * active. This is used by the ActiveDescendantKeyManager so key
   * events will display the proper options as active on arrow key events.
   */
  setInactiveStyles(): void {
    if (this._active) {
      this._active = false;
      this._changeDetectorRef.markForCheck();
    }
  }

  /** Gets the label to be used when determining whether the option should be focused. */
  getLabel(): string {
    return this.viewValue;
  }

  /** Ensures the option is selected when activated from the keyboard. */
  _handleKeydown(event: KeyboardEvent): void {
    if (
      (event.keyCode === ENTER || event.keyCode === SPACE) &&
      !hasModifierKey(event)
    ) {
      this._selectViaInteraction();

      // Prevent the page from scrolling down and form submits.
      event.preventDefault();
    }
  }

  /**
   * `Selects the option while indicating the selection came from the user. Used to
   * determine if the select's view -> model callback should be invoked.`
   */
  _selectViaInteraction(): void {
    if (!this.disabled) {
      this.option.selected = this.multiple ? !this.option.selected : true;
      this._changeDetectorRef.markForCheck();
      this._emitSelectionChangeEvent(true);
    }
  }

  /** Returns the correct tabindex for the option depending on disabled state. */
  // This method is only used by `MatLegacyOption`. Keeping it here to avoid breaking the types.
  // That's because `MatLegacyOption` use `MatOption` type in a few places such as
  // `MatOptionSelectionChange`. It is safe to delete this when `MatLegacyOption` is deleted.
  _getTabIndex(): string {
    return this.disabled ? '-1' : '0';
  }

  /** Gets the host DOM element. */
  _getHostElement(): HTMLElement {
    return this._element.nativeElement;
  }

  ngAfterViewChecked() {
    // Since parent components could be using the option's label to display the selected values
    // (e.g. `mat-select`) and they don't have a way of knowing if the option's label has changed
    // we have to check for changes in the DOM ourselves and dispatch an event. These checks are
    // relatively cheap, however we still limit them only to selected options in order to avoid
    // hitting the DOM too often.
    if (this.option.selected) {
      const viewValue = this.viewValue;

      if (viewValue !== this._mostRecentViewValue) {
        if (this._mostRecentViewValue) {
          this._stateChanges.next();
        }

        this._mostRecentViewValue = viewValue;
      }
    }
  }

  ngOnDestroy() {
    this._stateChanges.complete();
  }

  /** Emits the selection change event. */
  private _emitSelectionChangeEvent(isUserInput = false): void {
    this.onSelectionChange.emit(
      new MatOptionSelectionChange<T>(this, isUserInput)
    );
  }
}

/**
 * Single option inside of a `<mat-select>` element.
 */
@Component({
  selector: 'mat-option-mod',
  exportAs: 'matOption',
  host: {
    role: 'option',
    '[class.mdc-list-item--selected]': 'selected',
    '[class.mat-mdc-option-multiple]': 'multiple',
    '[class.mat-mdc-option-active]': 'active',
    '[class.mdc-list-item--disabled]': 'disabled',
    '[id]': 'id',
    // Set aria-selected to false for non-selected items and true for selected items. Conform to
    // [WAI ARIA Listbox authoring practices guide](
    //  https://www.w3.org/WAI/ARIA/apg/patterns/listbox/), "If any options are selected, each
    // selected option has either aria-selected or aria-checked  set to true. All options that are
    // selectable but not selected have either aria-selected or aria-checked set to false." Align
    // aria-selected implementation of Chips and List components.
    //
    // Set `aria-selected="false"` on not-selected listbox options to fix VoiceOver announcing
    // every option as "selected" (#21491).
    '[attr.aria-selected]': 'selected',
    '[attr.aria-disabled]': 'disabled.toString()',
    '(click)': '_selectViaInteraction()',
    '(keydown)': '_handleKeydown($event)',
    class: 'mat-mdc-option mdc-list-item',
  },
  styleUrls: ['option.scss'],
  templateUrl: 'option.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OptionComponent<T = any> extends _MatOptionBase<T> {
  constructor(
    element: ElementRef<HTMLElement>,
    changeDetectorRef: ChangeDetectorRef
  ) {
    super(element, changeDetectorRef);
  }
}

/**
 * Determines the position to which to scroll a panel in order for an option to be into view.
 * @param optionOffset Offset of the option from the top of the panel.
 * @param optionHeight Height of the options.
 * @param currentScrollPosition Current scroll position of the panel.
 * @param panelHeight Height of the panel.
 * @docs-private
 */
export function _getOptionScrollPosition(
  optionOffset: number,
  optionHeight: number,
  currentScrollPosition: number,
  panelHeight: number
): number {
  if (optionOffset < currentScrollPosition) {
    return optionOffset;
  }

  if (optionOffset + optionHeight > currentScrollPosition + panelHeight) {
    return Math.max(0, optionOffset - panelHeight + optionHeight);
  }

  return currentScrollPosition;
}
