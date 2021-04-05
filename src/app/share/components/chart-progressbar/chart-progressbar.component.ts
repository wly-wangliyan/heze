import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-chart-progressbar',
  templateUrl: './chart-progressbar.component.html',
  styleUrls: ['./chart-progressbar.component.css']
})
export class ChartProgressbarComponent {

  @Input() public title: string;
  @Input() public count: number;
  @Input() public color: string;
  @Input() public total: number;

  public get percent(): string {
    let count = this.count;
    let total = this.total;
    if (count === null || count === undefined) {
      count = 0;
    }
    if (total === null || total === undefined) {
      total = 0;
    }

    if (count === 0 && total === 0) {
      return '0';
    }

    if (count <= total) {
      return (this.count * 100 / this.total).toFixed(2);
    } else {
      return '100';
    }
  }
}
