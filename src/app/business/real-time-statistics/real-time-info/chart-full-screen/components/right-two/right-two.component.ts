import { Component, OnInit } from '@angular/core';
import {timer} from 'rxjs';
import echarts from 'echarts';

@Component({
  selector: 'app-right-two',
  templateUrl: './right-two.component.html',
  styleUrls: ['./right-two.component.less']
})
export class RightTwoComponent implements OnInit {

  public chartOptions: any;
  public chartInstance: any;

  constructor() { }

  ngOnInit(): void {
    this.generateChart();
  }

  private generateChart() {
    timer(0).subscribe(() => {
      this.chartOptions = {
        legend: {
          icon: 'roundRect',
          right: 0,
          top: 10,
          textStyle: {
            fontSize: 14,
            color: '#A3CAFF'
          },
          itemWidth: 6,
          itemHeight: 6
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            'type': 'line' // 默认为直线，可选为：'line' | 'shadow'
          },
          confine: true, // 是否将 tooltip 框限制在图表的区域内。
        },
        calculable: true,
        grid: {
          bottom: 5,
          left: 10,
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            axisLabel: {
              color: '#99BFF3',
              fontWeight: 400,
              fontSize: 14,
              rotate: -40,
              interval: 3,
              // showMaxLabel: true,
              // showMinLabel: true
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#1F416C'
              }
            },
            axisTick: {
              show: false
            },
            boundaryGap: false,
            data: ['03-01', '03-02', '03-03', '03-04', '03-05', '03-06', '03-07', '03-08', '03-09', '03-10', '03-11', '03-12', '03-13', '03-14', '03-15', '03-16', '03-17', '03-18', '03-19', '03-20', '03-21', '03-22', '03-23', '03-24', '03-25', '03-26', '03-27', '03-28']
          }
        ],
        yAxis: [
          {
            name: '金额',
            nameTextStyle: {
              color: '#99BFF3',
              fontWeight: 400,
              fontSize: 14,
            },
            type: 'value',
            axisLabel: {
              color: '#99BFF3',
              fontWeight: 400,
              fontSize: 14,
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#1F416C'
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              lineStyle: {
                color: ['#1F416C'],
              }
            },
            minInterval: 1,
          }
        ],
        series: [
          {
            name: '平台',
            type: 'line',
            data: [1, 2, 10, 4, 5, 6, 7, 15, 2, 10, 4, 5, 6, 7, 1, 2, 10, 4, 5, 6, 7, 15, 2, 10, 4, 5, 6, 7,],
            symbol: 'circle',
            itemStyle: {
              color: '#2897FF'
            },
            lineStyle: {
              width: 1,
              color: '#2897FF'
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    {offset: 1, color: 'rgba(40, 151, 255, 0)'},
                    {offset: 0, color: 'rgba(40, 151, 255, .5)'}
                  ]
              )
            }
          },
          {
            name: '系统',
            type: 'line',
            data: [11, 2, 6, 41, 25, 16, 3, 15, 2, 10, 4, 5, 6, 7, 3, 2, 10, 4, 5, 6, 7, 12, 2, 10, 4, 5, 6, 7],
            symbol: 'circle',
            itemStyle: {
              color: '#FFB543'
            },
            lineStyle: {
              width: 1,
              color: '#FFB543'
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    {offset: 1, color: 'rgba(255, 181, 67, 0)'},
                    {offset: 0, color: 'rgba(255, 181, 67, .5)'}
                  ]
              )
            }
          },
        ],
      };
      this.chartInstance && this.chartInstance.setOption(this.chartOptions, true);
    });
  }

  public onChartInit(chartInstance: any) {
    this.chartInstance = chartInstance;
  }

}
