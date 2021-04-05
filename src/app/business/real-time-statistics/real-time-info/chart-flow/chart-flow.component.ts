import { Component, AfterViewInit, OnDestroy, OnInit } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { GlobalService } from '../../../../core/global.service';
import { DateFormatHelper } from '../../../../../utils/date-format-helper';
import { EChartHelper } from '../../../../../utils/echart-helper';
import { GlobalConst } from '../../../../share/global-const';
import { DataStatisticsHttpService } from '../../../data-statistics/data-statistics-http.service';
import { SearchSelectorService } from '../../../../share/components/search-selector/search-selector.service';
import { SearchSelectorType } from '../../../../share/components/search-selector/search-selector.model';

@Component({
  selector: 'app-chart-flow',
  templateUrl: './chart-flow.component.html',
  styleUrls: ['./chart-flow.component.css', '../real-time-info.component.less']
})
export class ChartFlowComponent implements OnInit, AfterViewInit, OnDestroy {
  public chartOptions: any;
  public chartInstance: any;

  private searchSubscription: Subscription;
  private dataSubscription: Subscription;

  private totalFlowList: Array<number> = new Array(12).fill(0);
  private insideFlowList: Array<number> = new Array(12).fill(0);
  private outsideFlowList: Array<number> = new Array(12).fill(0);

  constructor(
    private searchSelectorService: SearchSelectorService,
    private dataStatisticsHttpService: DataStatisticsHttpService,
    private globalService: GlobalService) {
  }

  public ngOnInit() {
    // 使用按行政查区的接口来做数据
    this.searchSubscription = this.searchSelectorService.selectStateChanged.subscribe(state => {
      // 必须是有效值
      let tempValue = '';
      switch (state.currentType) {
        case SearchSelectorType.Park:
          tempValue = state.currentValue;
          break;
        case SearchSelectorType.Region:
        case SearchSelectorType.Group:
          tempValue = GlobalConst.RegionID;
          break;
      }

      // 如果存在有效区域id时进行查询
      this.dataStatisticsHttpService.flow.requestRegionStatisticsEntryFlowByHourList(
        tempValue,
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
        title: {
          subtext: '流量(辆)',
          subtextStyle: {
            color: '#939393',
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            'type': 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
          confine: true, // 是否将 tooltip 框限制在图表的区域内。
          formatter: (params, ticket, callback) => {
            let message = (params[0].axisValue - 2) + '~' + params[0].axisValue + '时';
            for (const param of params) {
              message += '<br/>' + param.seriesName + '流量' + ' : ' + EChartHelper.FormatFlow(param.data);
            }
            setTimeout(() => {
              callback(ticket, message);
            }, 0);
            return message;
          }
        },
        grid: {
          bottom: 20,
          left: 10,
          containLabel: true,
        },
        legend: {
          data: [
            {
              name: '全部',
              icon: 'rect'
            },
            {
              name: '路外',
              icon: 'rect'
            },
            {
              name: '路内',
              icon: 'rect'
            },
          ],
          right: 10,
          top: 10,
          itemWidth: 8,
          itemHeight: 8
        },
        calculable: true,
        xAxis: [
          {
            offset: 5,
            type: 'category',
            axisLine: {
              show: true,
              lineStyle: {
                color: '#eaeaea'
              }
            },
            axisTick: {
              show: false,
              alignWithLabel: true,
            },
            axisLabel: {
              color: '#999',
            },
            data: ['2', '4', '6', '8', '10', '12', '14', '16', '18', '20', '22', '24'],
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLine: {
              show: true,
              lineStyle: {
                color: '#eaeaea'
              }
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              color: '#999',
            },
            splitLine: {
              lineStyle: {
                color: ['#eaeaea'],
                type: 'dotted'
              }
            },
            splitNumber: 3,
            minInterval: 1,
          }
        ],
        series: [
          {
            itemStyle: {
              color: '#45c8dc',
            },
            barWidth: 6,
            name: '全部',
            type: 'bar',
            data: this.totalFlowList,
          },
          {
            itemStyle: {
              color: '#1c76ff',
            },
            barWidth: 6,
            name: '路外',
            type: 'bar',
            data: this.outsideFlowList,
          },

          {
            itemStyle: {
              color: '#46d93f',
            },
            barWidth: 6,
            barGap: 0,
            name: '路内',
            type: 'bar',
            data: this.insideFlowList,
          },
        ]
      };
      this.chartInstance && this.chartInstance.setOption(this.chartOptions, true);
    });
  }
}
