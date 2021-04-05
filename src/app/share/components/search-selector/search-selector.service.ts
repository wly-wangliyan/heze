import { Injectable, EventEmitter } from '@angular/core';
import { SelectorComponentState } from './search-selector.model';
import { BehaviorSubject } from 'rxjs';

/* 提供SearchSelectorComponent所使用的数据,默认是未注入到任何组件中。
 * 使用者需要将该服务注入到父组件中 */
@Injectable({
  providedIn: 'root'
})
export class SearchSelectorService {
  public selectStateChanged: BehaviorSubject<SelectorComponentState> = new BehaviorSubject<SelectorComponentState>(null);
}
