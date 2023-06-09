/**
 * Returns an exception to be thrown when attempting to change a select's `multiple` option
 * after initialization.
 */
export function getSearchDropdownSelectDynamicMultipleError(): Error {
  return Error('Cannot change `multiple` mode of select after initialization.');
}

/**
 * Returns an exception to be thrown when attempting to assign a non-array value to a select
 * in `multiple` mode. Note that `undefined` and `null` are still valid values to allow for
 * resetting the value.
 */
export function getSearchDropdownSelectNonArrayValueError(): Error {
  return Error('Value must be an array in multiple-selection mode.');
}

/**
 * Returns an exception to be thrown when assigning a non-function value to the comparator
 * used to determine if a value corresponds to an option. Note that whether the function
 * actually takes two values and returns a boolean is not checked.
 */
export function getSearchDropdownSelectNonFunctionValueError(): Error {
  return Error('`compareWith` must be a function.');
}

/**
 * Returns an exception to be thrown when options or request is not set
 */
export function getSearchDropdownSelectNoOptions(): Error {
  return Error('options or request must be set.');
}
