import { Component, OnInit } from '@angular/core';
import {PieDataItem} from '../../../../../../../utils/echart-helper';
import {timer} from 'rxjs';

@Component({
  selector: 'app-right-four',
  templateUrl: './right-four.component.html',
  styleUrls: ['./right-four.component.less']
})
export class RightFourComponent implements OnInit {

  public chartOptions: any;
  public chartInstance: any;
  private companyDataList: Array<PieDataItem> = [
    {name: 'w1liyan', value: 123, color: '#FA394E'},
    {name: '1ngli', value: 231, color: '#DDFF37'},
    {name: 'wang1yan', value: 456, color: '#5F9BFF'}];

  constructor() { }

  ngOnInit(): void {
    this.generateChart();
  }

  public onChartInit(chartInstance: any) {
    this.chartInstance = chartInstance;
  }

  private generateChart() {
    timer(0).subscribe(() => {
      const tooltipFormatter = (params: any) => {
        return `${params.name}: ${params.value} (${params.percent}%)`;
      };
      const labelFormatter = (params: any) => {
        return `${params.name}${params.percent}%`;
      };

      const colors = this.companyDataList.map(data => data.color);
      this.chartOptions = this.generateOptionsOfPie(
          '企业单车备案情况',
          this.companyDataList, tooltipFormatter, labelFormatter, colors
      );
    });
  }

  // 饼状图数据源
  public generateOptionsOfPie(
      name: any,
      chartData: Array<any>,
      tooltipFormatter: any,
      labelFormatter: any,
      colors: Array<string>,
      sourceSize: 'superlg' | 'lg' | 'sm' = 'sm') {
    const multiple = sourceSize === 'superlg' ? 2 : 1;

    return {
      tooltip: {
        trigger: 'item',
        formatter: tooltipFormatter
      },
      legend: {
        show: false
      },
      series: [
        {
          name,
          type: 'pie',
          radius: [0, '60%'],
          center: ['50%', '50%'],
          data: chartData,
          label: {
            normal: {
              show: true,
              formatter: labelFormatter,
              color: '#fff'
            }
          },
          labelLine: {
            show: true,
            length: multiple * 10,
            length2: multiple * 30,
            color: '#fff',
            lineStyle: {
              color: '#fff'
            }
          },
        }
      ],
      color: colors
    };
  }

}
