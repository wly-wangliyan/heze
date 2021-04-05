import { Component, Input, OnInit } from '@angular/core';
import { DateFormatHelper } from '../../../../../utils/date-format-helper';
import { DataStatisticsHttpService } from '../../data-statistics-http.service';
import { SearchSelectorService } from '../../../../share/components/search-selector/search-selector.service';
import { GlobalService } from '../../../../core/global.service';
import { EChartColors, EChartHelper } from '../../../../../utils/echart-helper';
import { isNullOrUndefined } from 'util';
import { differenceInCalendarDays } from 'date-fns';

@Component({
  selector: 'app-parking-flow-byhour',
  templateUrl: './parking-flow-byhour.component.html',
  styleUrls: ['./parking-flow-byhour.component.css']
})
export class ParkingFlowByhourComponent implements OnInit {

  public chartOptions: any;

  private eChartsXFormat = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]; // x轴横坐标

  private selectDateCount = 0; // 用来判断选择多少个日期

  private series = [];

  public selectDate: Date = DateFormatHelper.Today;

  @Input() regionId: string;

  @Input() directionType: number;  // 1是入场 2是出场

  @Input() set parkingId(parkingId: string) {
    if (isNullOrUndefined(parkingId) || parkingId === '') {
      return;
    }

    this._parkingId = parkingId;
    this.selectDateCount = 0;
    this.series = [];
    this.selectDate = DateFormatHelper.Today;

    this.processDate(DateFormatHelper.Today, DateType.oneDay);
  }

  private _parkingId: string;

  public get currentParkingId() {
    return this._parkingId;
  }

  constructor(private dataStatisticsHttpService: DataStatisticsHttpService, private searchSelectorService: SearchSelectorService, private globalService: GlobalService) {
  }

  public ngOnInit() {
  }

  // 处理日期
  private processDate(endDate: Date, dateType: DateType) {
    const endTime = endDate.getTime() + 86400000; // 某一天的最后一秒的时间戳
    const startTime = endTime - 86400000 * dateType; // 某一天第一秒时间戳

    this.parkingFlowByHour(startTime, endTime, dateType);
  }

  // 处理分时数据 start:开始时间戳, end:结束时间戳, day:请求的天数
  private parkingFlowByHour(startTime: any, endTime: any, day: DateType) {
    const eChartsX = new Array(24).fill(0); // 时间戳 横坐标
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);
    this.requestData(startDate, endDate, res => {
      const series = []; // 临时储存series 用来push
      for (let i = 0; i < day; i++) {
        const arr = new Array(24).fill(0); // 临时储存的y轴数据
        const startX = startTime + 86400000 * i;
        for (let j = 0; j < 24; j++) {
          eChartsX[j] = startX + 3600000 * j;
          for (const item of res) {
            if (eChartsX[j] === item.time_point * 1000) {
              if (this.directionType === 1) {
                arr[j] += item.entry_flow;
              } else {
                arr[j] += item.exit_flow;
              }
            }
          }
        }
        const dateChild = {
          name: this.generateTodayName(startX),
          type: 'line',
          data: arr
        };
        if (day === DateType.oneDay) {
          this.selectDateCount++;
          this.series.push(dateChild);
        } else {
          this.selectDateCount = day;
          series.push(dateChild);
        }
      }
      if (day !== DateType.oneDay) {
        this.series = series;
      }
      this.generateEChart();
    });

  }

  // 获取分时数据  startDate:开始时间 endDate：结束时间, callback: 灰调函数
  public requestData(startDate: Date, endDate: Date, callback: any) {
    if (this.directionType === 1) {
      this.dataStatisticsHttpService.flow.requestParkingStatisticsEntryFlowByHourList(
        this.regionId, startDate, endDate, this.currentParkingId
      ).subscribe(res => {
        callback && callback(res);
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
    } else {
      this.dataStatisticsHttpService.flow.requestParkingStatisticsExitFlowByHourList(
        this.regionId, startDate, endDate, this.currentParkingId
      ).subscribe(res => {
        callback && callback(res);
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
    }
  }

  // 时间改变 加线画图
  public onDateChange(event: any) {
    if (event) {
      if (event.getTime() === DateFormatHelper.Today.getTime()) {
        return;
      }
      if (this.currentParkingId && this.regionId) {
        const selectDate = DateFormatHelper.Format(event, 'M-d');
        if (!this.series.find(item => (item.name === selectDate))) { // 判断是否同一日期多次点击
          if (this.selectDateCount > 6) {
            this.globalService.promptBox.open('最多查看7天数据！');
            return;
          }
          this.selectDate = new Date(event);
          this.processDate(event, DateType.oneDay);
        }
      }
    }
  }

  // 生成日期
  public generateTodayName(timeStamp: number) {
    if (timeStamp === DateFormatHelper.Today.getTime()) {
      return '今日';
    } else {
      return DateFormatHelper.Format(new Date(timeStamp), 'M-d');
    }
  }

  // 显示几日 day：几日
  public onDayEchartClick(day: number) {
    this.processDate(DateFormatHelper.Today, day);
  }

  /* 更新折线图数据 */
  public generateEChart() {
    const legend_data = [];
    this.series.forEach(serie => {
      legend_data.push(serie.name);
    });
    this.chartOptions = {
      tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          'type': 'line' // 默认为直线，可选为：'line' | 'shadow'
        },
        confine: true, // 是否将 tooltip 框限制在图表的区域内。
        cycle: '',
        formatter: (params) => {
          let res = params[0].name + '~' + (Number(params[0].name) + 1) + '时';
          params.forEach(param => {
            res += '<br/>' + param.seriesName + ' : ' + EChartHelper.FormatFlow(param.value);
          });
          return res;
        }
      },
      color: EChartColors,
      legend: {
        padding: [10, 10, 10, 10],
        type: 'scroll',
        itemGap: 10,
        data: legend_data,
        selected: {},
      },
      grid: {
        left: '8%',
        right: '15%',
        top: '22%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        nameGap: 4,
        data: this.eChartsXFormat,
        name: '时间/时',
        nameTextStyle: {
          color: '#999'
        },
        boundaryGap: false,
        axisTick: {
          show: false,
          alignWithLabel: true,
        },
        axisLabel: {
          color: '#999',
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#eaeaea'
          }
        },
      },
      yAxis: {
        type: 'value',
        name: '数量/辆',
        nameTextStyle: {
          color: '#999'
        },
        minInterval: 1,
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
            type: 'dashed'
          }
        },
        splitArea: {
          show: true,
          areaStyle: {
            color: ['#f3f7fd', '#fff']
          },
          opacity: 0.5
        }
      },
      series: this.series
    };
  }

  // 时间的禁用部分
  public disabledTime = (startValue: Date): boolean => {
    if (differenceInCalendarDays(startValue, new Date()) > 0) {
      return true;
    } else {
      return false;
    }
  }
}

enum DateType {
  oneDay = 1,
}
