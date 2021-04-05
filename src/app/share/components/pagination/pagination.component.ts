/**
 * Created by zhoulihan on 16-9-12.
 */

import { Output, EventEmitter, ElementRef } from '@angular/core';
import { Component } from '@angular/core';
import { Input } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css'],
})
export class PaginationComponent {
  @Input() public currentPage: number;
  @Input() public pageCount: number; // 分页数据

  @Input() public size: 'lg' | 'sm' = 'lg'; // 分页组件的大小

  public element: ElementRef;

  constructor(private el: ElementRef) {
    this.element = el;
  }

  @Output('pageSelected') public pageSelected = new EventEmitter();

  public selectedPageNum(currentPage) {
    if (currentPage < 1) {
      return;
    }
    if (currentPage > this.pageCount) {
      return;
    }
    this.pageSelected.emit({ pageNum: currentPage });
  }
}
