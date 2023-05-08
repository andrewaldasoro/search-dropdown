import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { delay, of } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
})
export class AppComponent {
  multiple = true;

  options = [
    { value: 'apple', label: 'Apple' },
    { value: 'mango', label: 'Mango' },
    { value: 'blueberry', label: 'Blueberry' },
  ];

  request = (searchValue?: string, from = 0, size = 10) => {
    const arr = [
      { value: 'peach', label: 'Peach' },
      { value: 'avocado', label: 'Avocado' },
      { value: 'grapes', label: 'Grapes' },
    ];
    if (!searchValue) return of(arr).pipe(delay(5000));

    return of(
      arr.filter((v) =>
        v.label.toLowerCase().includes(searchValue.toLowerCase())
      )
    ).pipe(delay(5000));
  };

  control = new FormControl();
}
