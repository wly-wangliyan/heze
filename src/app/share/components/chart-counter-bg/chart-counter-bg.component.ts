import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-chart-counter-bg',
  templateUrl: './chart-counter-bg.component.html',
  styleUrls: ['./chart-counter-bg.component.css']
})
export class ChartCounterBgComponent {

  public count: string;

  @Input() public title: string;

  @Input() public length: number;

  @Input() public bgClassName = '';

  @Input()
  public set setCount(count: number) {
    const _count = count.toString();

    if (this.length) {
      const countLenDiff = this.length - _count.length;
      let countStr = '';

      for (let i = 0; i < countLenDiff; i++) {
        countStr += '0';
      }
      this.count = countStr + _count;
      return;
    }
    this.count = _count;
  };
}
