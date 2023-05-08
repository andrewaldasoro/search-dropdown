import { Component, Input } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Option } from './search-dropdown-select-2/search-dropdown-select';

@Component({
  selector: 'app-search-dropdown-select',
  templateUrl: 'app-search-dropdown-select.component.html',
})
export class SearchDropdownSelectComponent {
  @Input() options?: Option[];
  @Input() request?: (
    searchValue?: string,
    from?: number,
    to?: number
  ) => Observable<Option[]>;
  @Input() multiple = false; // if can select multiple values

  cancelRequest = new Subject<void>();
  unsubscriber = new Subject<void>();

  requestWithPipe?: (
    searchValue?: string,
    from?: number,
    to?: number
  ) => Observable<Option[]>;

  private from = 0;
  private to = 10;
  private lastValueSearched?: string;

  constructor() {}

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
