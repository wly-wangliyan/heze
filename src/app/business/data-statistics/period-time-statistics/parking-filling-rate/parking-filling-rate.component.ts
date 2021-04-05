import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { GlobalService } from '../../../../core/global.service';
import { DateFormatHelper } from '../../../../../utils/date-format-helper';
import { EChartHelper, EChartColors } from '../../../../../utils/echart-helper';
import { GlobalConst } from '../../../../share/global-const';
import { DataStatisticsHttpService } from '../../data-statistics-http.service';
import { SearchSelectorService } from '../../../../share/components/search-selector/search-selector.service';
import { SearchSelectorType } from '../../../../share/components/search-selector/search-selector.model';
import { ParkingDynamicUtilizationRateEntity, FillingRateBase } from '../../data-statistics.model';
import { differenceInCalendarDays } from 'date-fns';

@Component({
  selector: 'app-parking-filling-rate',
  templateUrl: './parking-filling-rate.component.html',
  styleUrls: ['./parking-filling-rate.component.css']
})
export class ParkingFillingRateComponent implements OnInit, OnDestroy {

  private searchSubscription: Subscription;
  private dataSubscription: Subscription;
  private rateSubscription: Subscription;
  private countSubscription: Subscription;

  private currentSelectorType = SearchSelectorType.Region;
  private currentValue = '';

  public insideChartOptions: any;
  public outsideChartOptions: any;
  public insideChartInstance: any;
  public outsideChartInstance: any;
  public trendChartOptions: any;
  public trendChartInstance: any;

  public currentSort = 2; // 当前分类 1:路内填充率 2:路外填充率
  public selectedCount = 0; // 计数已经选择的天数

  public today: string;
  public customDateValue: any;
  public selectDate: any;
  public insideFillingRateObj = {}; // 路内填充率对象
  public outsideFillingRateObj = {}; // 路外填充率对象
  public selectedObj = {}; // 存储选中对象(与数据对象一致)

  public insideTotalNumObj = {}; // 路内车位数对象
  public outsideTotalNumObj = {}; // 路外车位数对象

  public insideParkingCount = 0;
  public outsideParkingCount = 0;
  public parkingRateEntity: ParkingDynamicUtilizationRateEntity;

  constructor(private dataStatisticsHttpService: DataStatisticsHttpService, private searchSelectorService: SearchSelectorService, private globalService: GlobalService) {
  }

  public ngOnInit() {
    const todayDate = DateFormatHelper.Now;
    this.today = DateFormatHelper.Format(todayDate);
    this.selectDate = DateFormatHelper.Today;
    this.customDateValue = DateFormatHelper.FormatWithSolidus(this.selectDate);
    const keyDate = DateFormatHelper.Format(this.selectDate);
    this.selectedObj[keyDate] = true;
    this.insideFillingRateObj[keyDate] = new Array(24).fill(0);
    this.outsideFillingRateObj[keyDate] = new Array(24).fill(0);
    this.insideTotalNumObj[keyDate] = new Array(24).fill(0);
    this.outsideTotalNumObj[keyDate] = new Array(24).fill(0);
    this.generateInsideChart(0);
    this.generateOutsideChart(0);
    this.generateLineChart(this.currentSort);

    this.searchSubscription = this.searchSelectorService.selectStateChanged.subscribe(state => {
      let region_id = null;
      let parking_group_id = null;
      switch (state.currentType) {
        case SearchSelectorType.Group:
          parking_group_id = state.currentValue;
          break;
        case SearchSelectorType.Region:
          region_id = state.currentValue;
          break;
      }

      // 获取停车场数
      this.countSubscription && this.countSubscription.unsubscribe();
      this.countSubscription = this.dataStatisticsHttpService.requestParkingCountData(region_id, parking_group_id).subscribe(entity => {
        this.insideParkingCount = entity.inside_num;
        this.outsideParkingCount = entity.outside_num;
      }, err => {
        this.insideParkingCount = 0;
        this.outsideParkingCount = 0;
        this.globalService.httpErrorProcess(err);
      });

      this.dataSubscription && this.dataSubscription.unsubscribe();
      this.dataSubscription = this.dataStatisticsHttpService.requestParkingDynamicUtilizationRate(region_id, parking_group_id).subscribe(entity => {
        this.parkingRateEntity = entity;
        this.generateInsideChart(this.generateInsideFillingRate(entity));
        this.generateOutsideChart(this.generateOutsideFillingRate(entity));
      }, err => {
        this.globalService.httpErrorProcess(err);
      });

      this.currentSelectorType = state.currentType;
      this.currentValue = state.currentValue;
      this.insideFillingRateObj = {}; // 路内流量对象
      this.outsideFillingRateObj = {}; // 路外流量对象
      this.insideTotalNumObj = {}; // 路内车位对象
      this.outsideTotalNumObj = {}; // 路外车位对象
      this.selectedObj = {}; // 存储选中对象(与数据对象一致)
      this.selectedCount = 0;
      this.onDateChange(this.selectDate);
    });
  }

  public ngOnDestroy() {
    this.searchSubscription && this.searchSubscription.unsubscribe();
    this.dataSubscription && this.dataSubscription.unsubscribe();
    this.rateSubscription && this.rateSubscription.unsubscribe();
    this.countSubscription && this.countSubscription.unsubscribe();
  }

  public onSelectTypeClick(sort: number) {
    this.currentSort = sort;
    this.generateLineChart(sort);
  }

  public onDateChange(event: any) {
    if (event) {
      if (DateFormatHelper.Format(event) > DateFormatHelper.NowDate()) {
        this.globalService.promptBox.open(GlobalConst.DateFormatGreaterMessage);
        this.selectDate = new Date(this.customDateValue);
        return;
      }
      if (this.selectedCount > 29) {
        this.globalService.promptBox.open(GlobalConst.DateFormatMaxCompareDateMessage);
        return;
      }
      this.selectedCount++;
      this.selectDate = event;
      this.customDateValue = DateFormatHelper.FormatWithSolidus(this.selectDate);
      this.requestEChartData(this.selectDate);
    }
  }

  public requestEChartData(selectDate: Date) {
    this.rateSubscription && this.rateSubscription.unsubscribe();

    const processBlock = (results) => {
      const keyDate = DateFormatHelper.Format(selectDate);
      this.selectedObj[keyDate] = true; // 获取对象即认为选中
      this.insideFillingRateObj[keyDate] = new Array(24).fill(0);
      this.outsideFillingRateObj[keyDate] = new Array(24).fill(0);
      this.insideTotalNumObj[keyDate] = new Array(24).fill(0);
      this.outsideTotalNumObj[keyDate] = new Array(24).fill(0);

      results.forEach((entity: FillingRateBase) => {
        const hour = new Date(entity.time_point * 1000).getHours();
        this.insideFillingRateObj[keyDate][hour] = entity.road_inside_filling_rate;
        this.outsideFillingRateObj[keyDate][hour] = entity.road_outside_filling_rate;
        this.insideTotalNumObj[keyDate][hour] = entity.road_inside_total_num;
        this.outsideTotalNumObj[keyDate][hour] = entity.road_outside_total_num;
      });

      timer(1).subscribe(() => {
        this.generateLineChart(this.currentSort);
      });
    };
    switch (this.currentSelectorType) {
      case SearchSelectorType.Region:
        this.rateSubscription = this.dataStatisticsHttpService.fillingRate.requestRegionStatisticsFillingRateByHourList(this.currentValue, selectDate, selectDate).subscribe(results => {
          processBlock(results);
        }, err => {
          this.globalService.httpErrorProcess(err);
        });
        break;
      case SearchSelectorType.Group:
        this.rateSubscription = this.dataStatisticsHttpService.fillingRate.requestGroupStatisticsFillingRateByHourList(this.currentValue, selectDate, selectDate).subscribe(results => {
          processBlock(results);
        }, err => {
          this.globalService.httpErrorProcess(err);
        });
        break;
    }
  }

  public onInsideChartInit(event: any) {
    this.insideChartInstance = event;
  }

  public onOutsideChartInit(event: any) {
    this.outsideChartInstance = event;
  }

  public onTrendChartInit(event: any) {
    this.trendChartInstance = event;
  }

  private generateInsideChart(value: number) {
    timer(0).subscribe(() => {

      // http://echarts.baidu.com/option.html#series-gauge 文档位置
      // 指定图表的配置项和数据
      this.insideChartOptions = this.generateRateChartOption(value);
      this.insideChartInstance && this.insideChartInstance.setOption(this.insideChartOptions, true);
    });
  }

  private generateOutsideChart(value: number) {
    timer(0).subscribe(() => {

      // http://echarts.baidu.com/option.html#series-gauge 文档位置
      // 指定图表的配置项和数据
      this.outsideChartOptions = this.generateRateChartOption(value);
      this.outsideChartInstance && this.outsideChartInstance.setOption(this.outsideChartOptions, true);
    });
  }

  private generateRateChartOption(value: number): any {
    return {
      series: [
        {
          name: '填充率',
          type: 'gauge',
          splitNumber: 10, // 分割段数，默认为5
          axisLine: {            // 坐标轴线
            show: true,        // 默认显示，属性show控制显示与否
            lineStyle: {       // 属性lineStyle控制线条样式
              color: [[0.2, '#f45c63'], [0.8, '#e87724'], [1, '#56c74e']],
              width: 13
            }
          },
          axisTick: {            // 坐标轴小标记
            show: false,        // 属性show控制显示与否，默认不显示
            splitNumber: 5,    // 每份split细分多少段
            length: 8,         // 属性length控制线长
            lineStyle: {       // 属性lineStyle控制线条样式
              color: '#eee',
              width: 1,
              type: 'solid'
            }
          },
          splitLine: {           // 分隔线
            show: true,        // 默认显示，属性show控制显示与否
            length: 15,         // 属性length控制线长
            lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
              color: '#ffffff',
              width: 2,
              type: 'solid'
            }
          },
          pointer: {
            length: '80%',
            width: 6,
          },
          detail: {
            show: true,
            width: 80,
            height: 12,
            offsetCenter: [0, '55%'],       // x, y，单位px
            formatter: [
              '{value|{value}%}',
              '{name|填充率}'
            ].join('\n'),
            rich: {
              value: {
                color: '#333',
                fontSize: 16,
                lineHeight: 28
              },
              name: {
                color: '#666',
                fontSize: 13
              },
            },
          },
          data: [{ value: value }]
        }
      ]
    };
  }

  private generateLineChart(sort: number) {
    timer(1).subscribe(() => {
      let tempObj, tooltipName, tempNumObj, totalNum;
      const legend_data = [], series_data = [];
      switch (sort) {
        case 1:
          tempObj = this.insideFillingRateObj;
          tempNumObj = this.insideTotalNumObj;
          totalNum = this.parkingRateEntity.inside_total_num;
          tooltipName = '路内填充率';
          break;
        case 2:
          tempObj = this.outsideFillingRateObj;
          tempNumObj = this.outsideTotalNumObj;
          totalNum = this.parkingRateEntity ? this.parkingRateEntity.outside_total_num : null;
          tooltipName = '路外填充率';
          break;
      }

      for (const key in tempObj) {
        if (tempObj.hasOwnProperty(key)) {
          legend_data.push(key);
          series_data.push({
            name: key,
            type: 'line',
            data: tempObj[key],
          });
        }
      }

      this.trendChartOptions = {
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            'type': 'line' // 默认为直线，可选为：'line' | 'shadow'
          },
          confine: true, // 是否将 tooltip 框限制在图表的区域内。
          formatter: (params, ticket, callback) => {
            const duration = params[0].dataIndex + '~' + (params[0].dataIndex + 1);
            let res = tooltipName + ' ' + duration + '时';
            params.forEach(param => {
              if (param.seriesName === this.today) {
                res += '<br/>今日 ' + totalNum + '个车位 ' + Number((param.value * 100).toFixed(2)) + '%';
              } else {
                res += '<br/>' + param.seriesName + ' ' + totalNum + '个车位 ' + Number((param.value * 100).toFixed(2)) + '%';
              }
            });
            return res;
          }
        },
        color: EChartColors,
        legend: {
          data: legend_data,
          padding: [10, 0, 0, 0],
          itemGap: 30,
          selected: this.selectedObj,
          formatter: (name) => {
            if (name === this.today) {
              return '今日';
            }
            return name;
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          top: '15%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          nameGap: 5,
          data: EChartHelper.PerHourChartX,
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
          name: '填充率',
          nameTextStyle: {
            color: '#999'
          },
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
        series: series_data
      };
    });
  }

  /* 计算百分比 */
  private generateInsideFillingRate(entity: ParkingDynamicUtilizationRateEntity): any {
    if (entity) {
      if (entity.inside_used_num === 0) {
        return 0;
      } else if (entity.inside_total_num === 0) {
        return 100;
      } else {
        return Number((entity.inside_used_num > entity.inside_total_num ? 100 : (entity.inside_used_num * 100 / entity.inside_total_num).toFixed(2)));
      }
    }
    return 0;
  }

  /* 计算百分比 */
  private generateOutsideFillingRate(entity: ParkingDynamicUtilizationRateEntity): any {
    if (entity) {
      if (entity.outside_used_num === 0) {
        return 0;
      } else if (entity.outside_total_num === 0) {
        return 100;
      } else {
        return Number((entity.outside_used_num > entity.outside_total_num ? 100 : (entity.outside_used_num * 100 / entity.outside_total_num).toFixed(2)));
      }
    }
    return 0;
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
