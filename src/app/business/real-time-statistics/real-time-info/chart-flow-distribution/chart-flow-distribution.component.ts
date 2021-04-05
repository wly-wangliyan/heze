import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, forkJoin, timer } from 'rxjs';
import { DateFormatHelper } from '../../../../../utils/date-format-helper';
import { GlobalService } from '../../../../core/global.service';
import { GlobalConst } from '../../../../share/global-const';
import { EChartHelper } from '../../../../../utils/echart-helper';
import { DataStatisticsHttpService } from '../../../data-statistics/data-statistics-http.service';
import { SearchSelectorService } from '../../../../share/components/search-selector/search-selector.service';

@Component({
  selector: 'app-chart-flow-distribution',
  templateUrl: './chart-flow-distribution.component.html',
  styleUrls: ['./chart-flow-distribution.component.css']
})
export class ChartFlowDistributionComponent implements OnInit, OnDestroy {

  public chartOptions: any;
  public chartInstance: any;

  private entryFlowList: Array<number> = new Array(12).fill(0);
  private exitFlowList: Array<number> = new Array(12).fill(0);

  private dataSubscription: Subscription;
  private searchSubscription: Subscription;

  constructor(
    private searchSelectorService: SearchSelectorService,
    private dataStatisticsHttpService: DataStatisticsHttpService,
    private globalService: GlobalService) {
  }

  public ngOnInit() {
    this.searchSubscription = this.searchSelectorService.selectStateChanged.subscribe(state => {
      this.requestAllData(state.currentValue);
    });
  }

  private requestAllData(regionID: string) {
    const httpList = [];
    httpList.push(this.dataStatisticsHttpService.flow.requestRegionStatisticsExitFlowByHourList(regionID, DateFormatHelper.Today, DateFormatHelper.Today));
    httpList.push(this.dataStatisticsHttpService.flow.requestRegionStatisticsEntryFlowByHourList(
      regionID, DateFormatHelper.Today, DateFormatHelper.Today));
    this.dataSubscription && this.dataSubscription.unsubscribe();

    this.dataSubscription = forkJoin(httpList).subscribe((results: Array<any>) => {
      this.entryFlowList = new Array(12).fill(0);
      this.exitFlowList = new Array(12).fill(0);
      const exitFlowByHourList = results[0];
      const entryFlowByHourList = results[1];
      exitFlowByHourList.forEach(item => {
        const keyHour = new Date(item.time_point * 1000).getHours();
        this.exitFlowList[Math.floor(keyHour / 2)] += item.total_exit_flow;
      });
      entryFlowByHourList.forEach(item => {
        const keyHour = new Date(item.time_point * 1000).getHours();
        this.entryFlowList[Math.floor(keyHour / 2)] += item.total_entry_flow;
      });
      this.generateChart();
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
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
            'type': 'line' // 默认为直线，可选为：'line' | 'shadow'
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
        legend: {
          data: [
            {
              name: '出场',
              icon: 'rect',
            },
            {
              name: '入场',
              icon: 'rect',
            }
          ],
          right: 10,
          top: 10,
          itemWidth: 8,
          itemHeight: 8
        },
        calculable: true,
        grid: {
          bottom: 20,
          left: 10,
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            axisLabel: {
              color: '#999',
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#eaeaea'
              }
            },
            axisTick: {
              show: false
            },
            boundaryGap: false,
            data: ['2', '4', '6', '8', '10', '12', '14', '16', '18', '20', '22', '24']
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              color: '#999',
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#eaeaea'
              }
            },
            axisTick: {
              show: false
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
            name: '出场',
            type: 'line',
            data: this.exitFlowList
          },
          {
            name: '入场',
            type: 'line',
            data: this.entryFlowList
          }
        ],
        color: ['#1c76ff', '#46d93f']
      };
      this.chartInstance && this.chartInstance.setOption(this.chartOptions, true);
    });
  }

}
