import { Component, Input } from '@angular/core';
import { NumberToArray } from '../../../../utils/type-conversion';

@Component({
  selector: 'app-chart-counter',
  templateUrl: './chart-counter.component.html',
  styleUrls: ['./chart-counter.component.css']
})
export class ChartCounterComponent {

  @Input() public title: string;

  @Input() public unit: string;

  @Input() public bgColor = '#56c74e';

  @Input() public length: number;

  @Input()
  public set count(count: number) {
    const array = NumberToArray(count).reverse();

    if (array.length > 6) {
      // 当大于100000时显示99999
      this.number1 = '9';
      this.number2 = '9';
      this.number3 = '9';
      this.number4 = '9';
      this.number5 = '9';
      this.number6 = '9';
      // this.number7 = '9';
      // this.number8 = '9';
    } else {
      if (this.length) {
        this.number1 = array[5] ? array[5] : '0';
        this.number2 = array[4] ? array[4] : '0';
        this.number3 = array[3] ? array[3] : '0';
        this.number4 = array[2] ? array[2] : '0';
        this.number5 = array[1] ? array[1] : '0';
        this.number6 = array[0] ? array[0] : '0';
        // this.number7 = array[1] ? array[1] : '0';
        // this.number8 = array[0] ? array[0] : '0';
      } else {
        this.number1 = array[5];
        this.number2 = array[4];
        this.number3 = array[3];
        this.number4 = array[2];
        this.number5 = array[1];
        this.number6 = array[0];
        // this.number7 = array[1];
        // this.number8 = array[0];
      }
    }
  }

  public number1: string;
  public number2: string;
  public number3: string;
  public number4: string;
  public number5: string;
  public number6: string;
  public number7: string;
  public number8: string;
}
