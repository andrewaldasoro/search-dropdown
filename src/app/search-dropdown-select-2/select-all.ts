import { FocusableOption, FocusOrigin } from '@angular/cdk/a11y';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { ENTER, hasModifierKey, SPACE } from '@angular/cdk/keycodes';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Directive,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  Optional,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { MatPseudoCheckboxState } from '@angular/material/core';
import { Subject } from 'rxjs';
import {
  MAT_OPTION_PARENT_COMPONENT,
  MatOptionParentComponent,
} from './option-parent';

/**
 * Option IDs need to be unique across components, so this counter exists outside of
 * the component definition.
 */
let _uniqueIdCounter = 0;

@Directive()
export class _matSelectAllOptionBase<T = any>
  implements FocusableOption, OnDestroy
{
  private _selected = false;
  private _active = false;
  private _disabled = false;

  /** Whether or not the option is currently selected. */
  @Input()
  get selected(): boolean {
    return this._selected;
  }
  set selected(value: boolean) {
    if (coerceBooleanProperty(value)) {
      this.select();
    } else {
      this.deselect();
    }
  }

  /** The unique ID of the option. */
  @Input() id: string = `select-all-${_uniqueIdCounter++}`;

  /** Whether the option is disabled. */
  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: BooleanInput) {
    this._disabled = coerceBooleanProperty(value);
  }

  /** Whether ripples for the option are disabled. */
  get disableRipple(): boolean {
    return !!(this._parent && this._parent.disableRipple);
  }

  @Output() readonly selectedChange = new EventEmitter<boolean>();

  /** Emits when the state of the option changes and any parents have to be notified. */
  readonly _stateChanges = new Subject<void>();

  constructor(
    private _element: ElementRef<HTMLElement>,
    public _changeDetectorRef: ChangeDetectorRef,
    private _parent: MatOptionParentComponent
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

  /** Selects the option. */
  select(): void {
    if (!this._selected) {
      this._selected = true;
      this._changeDetectorRef.markForCheck();
      this._emitSelectionChangeEvent();
    }
  }

  /** Deselects the option. */
  deselect(): void {
    if (this._selected) {
      this._selected = false;
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
      this._selected = !this._selected;
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

  ngOnDestroy() {
    this._stateChanges.complete();
  }

  /** Emits the selection change event. */
  private _emitSelectionChangeEvent(isUserInput = false): void {
    this.selectedChange.emit(this._selected);
  }
}

/**
 * Single option inside of a `<mat-select>` element.
 */
@Component({
  selector: 'mat-select-all',
  exportAs: 'selectAll',
  host: {
    role: 'select-all',
    '[class.mdc-list-item--selected]': 'selected',
    '[class.mat-mdc-option-multiple]': 'true',
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
  templateUrl: 'select-all.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatSelectAllOption<T = any> extends _matSelectAllOptionBase<T> {
  @Input() state: MatPseudoCheckboxState = 'unchecked';

  constructor(
    element: ElementRef<HTMLElement>,
    changeDetectorRef: ChangeDetectorRef,
    @Optional()
    @Inject(MAT_OPTION_PARENT_COMPONENT)
    parent: MatOptionParentComponent
  ) {
    super(element, changeDetectorRef, parent);
  }
}
