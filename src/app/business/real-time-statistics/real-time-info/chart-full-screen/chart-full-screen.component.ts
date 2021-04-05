import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-chart-full-screen',
  templateUrl: './chart-full-screen.component.html',
  styleUrls: ['./chart-full-screen.component.less']
})
export class ChartFullScreenComponent {

  @ViewChild('fullScreenContainer', { static: false }) public fullScreenContainer: ElementRef;

  public selectFullScreenNumber = 0;

  public onfullScreenSelect(event: any) {
    this.selectFullScreenNumber = event;
  }

}
