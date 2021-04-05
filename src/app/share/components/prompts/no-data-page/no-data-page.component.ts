import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-no-data-page',
  templateUrl: './no-data-page.component.html',
  styleUrls: ['./no-data-page.component.css']
})
export class NoDataPageComponent {
  @Input() public message = '暂无数据';
}
