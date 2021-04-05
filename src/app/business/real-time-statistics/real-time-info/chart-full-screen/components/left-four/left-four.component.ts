import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { DataStatisticsHttpService } from '../../../../../data-statistics/data-statistics-http.service';
import { GlobalService } from '../../../../../../core/global.service';
import { GlobalConst } from '../../../../../../share/global-const';
import { DateFormatHelper } from '../../../../../../../utils/date-format-helper';
import { EChartHelper } from '../../../../../../../utils/echart-helper';

@Component({
  selector: 'app-left-four',
  templateUrl: './left-four.component.html',
  styleUrls: ['./left-four.component.less']
})
export class LeftFourComponent implements OnInit, AfterViewInit, OnDestroy {

  public chartOptions: any;
  public chartInstance: any;

  private searchSubscription: Subscription;
  private dataSubscription: Subscription;

  private totalFlowList: Array<number> = new Array(12).fill(0);
  private insideFlowList: Array<number> = new Array(12).fill(0);
  private outsideFlowList: Array<number> = new Array(12).fill(0);

  constructor(
    private dataStatisticsHttpService: DataStatisticsHttpService,
    private globalService: GlobalService) {
  }

  public ngOnInit() {
    // 如果存在有效区域id时进行查询
    this.dataStatisticsHttpService.flow.requestRegionStatisticsEntryFlowByHourList(
      GlobalConst.RegionID,
      DateFormatHelper.Today,
      DateFormatHelper.Today
    ).subscribe(results => {
      const tempInsideFlowList = new Array(12).fill(0);
      const tempOutsideFlowList = new Array(12).fill(0);
      const tempTotalFlowList = new Array(12).fill(0);
      results.forEach(item => {
        const keyHour = new Date(item.time_point * 1000).getHours();
        tempInsideFlowList[Math.floor(keyHour / 2)] += item.road_inside_entry_flow;
        tempOutsideFlowList[Math.floor(keyHour / 2)] += item.road_outside_entry_flow;
        tempTotalFlowList[Math.floor(keyHour / 2)] += item.total_entry_flow;
      });
      this.insideFlowList = tempInsideFlowList;
      this.outsideFlowList = tempOutsideFlowList;
      this.totalFlowList = tempTotalFlowList;
      this.generateChart();
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
  }

  public ngAfterViewInit() {
    this.generateChart();
  }

  public ngOnDestroy() {
    this.searchSubscription && this.searchSubscription.unsubscribe();
    this.dataSubscription && this.dataSubscription.unsubscribe();
  }

  public onChartInit(chartInstance: any) {
    this.chartInstance = chartInstance;
  }

  private generateChart() {
    timer(0).subscribe(() => {

      // http://echarts.baidu.com/option.html#series-gauge 文档位置
      // 指定图表的配置项和数据
      this.chartOptions = {
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            'type': 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
          confine: true, // 是否将 tooltip 框限制在图表的区域内。
        },
        grid: {
          bottom: 20,
          left: 10,
          containLabel: true,
        },
        legend: {
          icon: 'roundRect',
          right: 0,
          top: 10,
          itemWidth: 6,
          itemHeight: 6,
          textStyle: {
            fontSize: 14,
            color: '#A3CAFF'
          },
        },
        calculable: true,
        xAxis: [
          {
            offset: 5,
            type: 'category',
            axisLine: {
              show: true,
              lineStyle: {
                color: '#1F416C'
              }
            },
            axisTick: {
              show: false,
              alignWithLabel: true,
            },
            axisLabel: {
              color: '#99BFF3',
            },
            data: ['2', '4', '6', '8', '10', '12', '14', '16', '18', '20', '22', '24'],
          }
        ],
        yAxis: [
          {
            name: '流量(辆)',
            nameTextStyle: {
              color: '#99BFF3',
              fontWeight: 400,
              fontSize: 14,
            },
            type: 'value',
            axisLine: {
              show: true,
              lineStyle: {
                color: '#1F416C'
              }
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              color: '#99BFF3',
            },
            splitLine: {
              lineStyle: {
                color: ['#1F416C'],
              }
            },
            splitNumber: 3,
            minInterval: 1,
          }
        ],
        series: [
          {
            barWidth: 4,
            name: '全部',
            type: 'bar',
            barGap: '50%',
            // data: this.totalFlowList,
            data: [2, 4, 6, 6, 4, 2, 2, 4, 4, 28, 6, 4]
          },
          {
            barWidth: 4,
            name: '路内',
            type: 'bar',
            barGap: '50%',
            // data: this.insideFlowList,
            data: [1, 2, 3, 3, 2, 1, 1, 2, 2, 14, 3, 2]
          },
          {
            barWidth: 4,
            name: '路外',
            type: 'bar',
            barGap: '50%',
            // data: this.outsideFlowList,
            data: [1, 2, 3, 3, 2, 1, 1, 2, 2, 14, 3, 2]
          },
        ],
        color: ['#1BDA88', '#FFB543', '#2897FF']
      };
      this.chartInstance && this.chartInstance.setOption(this.chartOptions, true);
    });
  }

}
