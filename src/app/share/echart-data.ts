export class EChartSeriesDataItem {
  public name: any;
  public value: any;
  public label: any;
  public itemStyle: any;
  public emphasis: any;
  public tooltip: any;

  constructor(value?: any) {
    if (value !== null && value !== undefined) {
      this.value = value;
      this.name = value;
    }
  }
}
