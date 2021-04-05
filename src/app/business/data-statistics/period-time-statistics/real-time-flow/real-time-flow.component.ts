import { Component, OnInit, OnDestroy } from '@angular/core';
import { IncreasePercentItem, CalculationHelper } from '../../../../../utils/calculation-helper';
import { DateFormatHelper } from '../../../../../utils/date-format-helper';
import { GlobalService } from '../../../../core/global.service';
import { EChartColors, EChartHelper } from '../../../../../utils/echart-helper';
import { GlobalConst } from '../../../../share/global-const';
import { DataStatisticsHttpService } from '../../data-statistics-http.service';
import { SearchSelectorService } from '../../../../share/components/search-selector/search-selector.service';
import { Subscription, timer } from 'rxjs';
import { SearchSelectorType } from '../../../../share/components/search-selector/search-selector.model';
import { EntryFlowBase } from '../../data-statistics.model';
import { differenceInCalendarDays } from 'date-fns';

@Component({
  selector: 'app-real-time-flow',
  templateUrl: './real-time-flow.component.html',
  styleUrls: ['./real-time-flow.component.css']
})
export class RealTimeFlowComponent implements OnInit, OnDestroy {

  public chartOptions: any;
  public chartInstance: any;

  private searchSubscription: Subscription;
  private dataSubscription: Subscription;
  private flowSubscription: Subscription;
  private countSubscription: Subscription;

  private currentSelectorType = SearchSelectorType.Region;
  private currentValue = '';

  public currentSort = 2; // 当前分类 1:路内流量 2:路外流量

  public todayPercentList: Array<IncreasePercentItem>;
  private yesterdayPercentList: Array<string>;
  public headerInsideFlow = {}; // 路内流量
  public headerOutsideFlow = {}; // 路外流量
  public headerParkingCount = {}; // 停车场总数

  public today: string;
  public yesterday: string;
  private percentHour: any; // 百分比当前所显示的时段

  public selectDate: Date; // 当前选中的日期

  private insideFlowObj = {}; // 路内流量对象
  private outsideFlowObj = {}; // 路外流量对象
  private insideParkingCountObj = {}; // 路内停车场数量
  private outsideParkingCountObj = {}; // 路外停车场数量
  private selectedObj = {}; // 存储选中legend对象(与数据对象一致)

  private selectedDataObj: Array<any> = []; // 存储已选中的日期

  public insideParkingCount = 0;
  public outsideParkingCount = 0;

  private dataIndex = 0; // 用于递归获取图标数据源

  constructor(private dataStatisticsHttpService: DataStatisticsHttpService, private searchSelectorService: SearchSelectorService, private globalService: GlobalService) {
  }

  public ngOnInit() {
    this.selectDate = DateFormatHelper.Today;
    const keyDate = DateFormatHelper.Format(this.selectDate);
    this.selectedObj[keyDate] = true;
    this.selectedDataObj.push(keyDate);

    this.searchSubscription = this.searchSelectorService.selectStateChanged.subscribe(state => {
      // 切换区域时初始化数据
      const todayDate = DateFormatHelper.Now;
      const yesterdayDate = DateFormatHelper.Yesterday;
      this.today = DateFormatHelper.Format(todayDate);
      this.yesterday = DateFormatHelper.Format(yesterdayDate);

      this.dataIndex = 0;

      // 重置时段累计数据
      this.percentHour = todayDate.getHours() - 1;
      this.headerInsideFlow[this.today] = 0;
      this.headerInsideFlow[this.yesterday] = 0;
      this.headerOutsideFlow[this.today] = 0;
      this.headerOutsideFlow[this.yesterday] = 0;
      this.headerParkingCount[this.today] = 0;
      this.headerParkingCount[this.yesterday] = 0;
      this.todayPercentList = new Array(3).fill(new IncreasePercentItem());
      this.yesterdayPercentList = new Array(2).fill('');

      this.dataSubscription && this.dataSubscription.unsubscribe();

      // 处理数据的代码块
      const processBlock = (results: any) => {
        // 时段累计百分比显示时需要的数据
        const insideHourFlow = {};
        insideHourFlow[this.today] = 0;
        insideHourFlow[this.yesterday] = 0;
        const outsideHourFlow = {};
        outsideHourFlow[this.today] = 0;
        outsideHourFlow[this.yesterday] = 0;

        results.forEach((entity: EntryFlowBase) => {
          const day = DateFormatHelper.Format(entity.time_point * 1000);
          const hour = new Date(entity.time_point * 1000).getHours();

          this.headerInsideFlow[day] += entity.road_inside_entry_flow;
          this.headerOutsideFlow[day] += entity.road_outside_entry_flow;
          this.headerParkingCount[day] = this.headerParkingCount[day] < entity.total_parking_count ? entity.total_parking_count : this.headerParkingCount[day];

          // 记录当前时段的数值
          if (hour <= this.percentHour) {
            insideHourFlow[day] += entity.road_inside_entry_flow;
            outsideHourFlow[day] += entity.road_outside_entry_flow;
          }
        });

        // 计算百分比数据
        this.todayPercentList[0] = CalculationHelper.IncreasePercent
          (insideHourFlow[this.today], insideHourFlow[this.yesterday]);
        this.todayPercentList[1] = CalculationHelper.IncreasePercent
          (outsideHourFlow[this.today], outsideHourFlow[this.yesterday]);
        this.todayPercentList[2] = CalculationHelper.IncreasePercent
          (insideHourFlow[this.today] + outsideHourFlow[this.today],
            insideHourFlow[this.yesterday] + outsideHourFlow[this.yesterday]);
        this.yesterdayPercentList = CalculationHelper.ProportionPercent(this.headerInsideFlow[this.yesterday], this.headerOutsideFlow[this.yesterday]);
      };

      let region_id = null;
      let parking_group_id = null;
      switch (state.currentType) {
        case SearchSelectorType.Group:
          parking_group_id = state.currentValue;
          this.dataSubscription = this.dataStatisticsHttpService.flow.requestGroupStatisticsEntryFlowByHourList(state.currentValue,
            DateFormatHelper.Yesterday, DateFormatHelper.Today).subscribe(results => {
              processBlock(results);
            }, err => {
              this.globalService.httpErrorProcess(err);
            });
          break;
        case SearchSelectorType.Region:
          region_id = state.currentValue;
          this.dataSubscription = this.dataStatisticsHttpService.flow.requestRegionStatisticsEntryFlowByHourList(state.currentValue,
            DateFormatHelper.Yesterday, DateFormatHelper.Today).subscribe(results => {
              processBlock(results);
            }, err => {
              this.globalService.httpErrorProcess(err);
            });
          break;
      }

      // 获取停车场数
      this.countSubscription && this.countSubscription.unsubscribe();
      this.countSubscription = this.dataStatisticsHttpService.requestParkingCountData(region_id, parking_group_id).subscribe(entity => {
        this.insideParkingCount = entity.inside_num;
        this.outsideParkingCount = entity.outside_num;
      }, err => {
        this.globalService.httpErrorProcess(err);
      });

      this.currentSelectorType = state.currentType;
      this.currentValue = state.currentValue;
      // this.insideFlowObj = {}; // 路内流量对象
      // this.outsideFlowObj = {}; // 路外流量对象
      // this.insideParkingCountObj = {};
      // this.outsideParkingCountObj = {};
      this.selectedObj = {}; // 存储选中对象(与数据对象一致)
      this.requestEChartData();
    });
  }

  public ngOnDestroy() {
    this.searchSubscription && this.searchSubscription.unsubscribe();
    this.dataSubscription && this.dataSubscription.unsubscribe();
    this.flowSubscription && this.flowSubscription.unsubscribe();
    this.countSubscription && this.countSubscription.unsubscribe();
  }

  // 改变时间
  public onDateChange(event: any) {
    if (event) {
      const keyDate = DateFormatHelper.Format(event);
      if (DateFormatHelper.Format(event) > DateFormatHelper.NowDate()) {
        this.globalService.promptBox.open(GlobalConst.DateFormatGreaterMessage);
        return;
      }

      if (this.selectedDataObj.indexOf(keyDate) !== -1) {
        if (this.selectedDataObj.indexOf(keyDate) !== 0) {
          return;
        }
      } else {
        // 最多显示30条
        if (this.selectedDataObj.length > 29) {
          this.globalService.promptBox.open(GlobalConst.DateFormatMaxCompareDateMessage);
          return;
        }
        this.selectedDataObj.push(keyDate);
      }
      this.requestEChartData();
    }
  }

  public onChartInit(chartInstance: any) {
    this.chartInstance = chartInstance;
    this.chartInstance.on('legendselectchanged', (params) => {
      this.selectedObj[params.name] = params.selected[params.name];
    });
  }

  public onSelectTypeClick(sort: number) {
    this.currentSort = sort;
    this.generateEChart(sort);
  }

  // 获取图标数据
  private requestEChartData() {
    const index = this.dataIndex;
    if (index > 1 && !this.selectedDataObj.hasOwnProperty(index)) {
      return;
    }

    const currentDate = DateFormatHelper.StringToTimeStamp(this.selectedDataObj[index]);
    this.flowSubscription && this.flowSubscription.unsubscribe();
    this.flowSubscription = this.dataStatisticsHttpService.flow.requestRegionStatisticsEntryFlowByHourList(this.currentValue, currentDate, currentDate)
      .subscribe(results => {
        processBlock(results, currentDate);
        if (index < this.selectedDataObj.length) {
          if (this.selectedDataObj.length === 1) {
            this.dataIndex = 1;
          } else {
            this.dataIndex++;
          }
          this.requestEChartData();
        }
      }, err => {
        this.globalService.httpErrorProcess(err);
      });

    const processBlock = (results: any, selectDate: Date) => {

      const keyDate = DateFormatHelper.Format(selectDate);
      this.selectedObj[keyDate] = true; // 获取对象即认为选中
      this.insideFlowObj[keyDate] = new Array(24).fill(0);
      this.outsideFlowObj[keyDate] = new Array(24).fill(0);
      this.insideParkingCountObj[keyDate] = new Array(24).fill(0);
      this.outsideParkingCountObj[keyDate] = new Array(24).fill(0);

      results.forEach((entity: EntryFlowBase) => {
        const hour = new Date(entity.time_point * 1000).getHours();
        this.insideFlowObj[keyDate][hour] = entity.road_inside_entry_flow;
        this.outsideFlowObj[keyDate][hour] = entity.road_outside_entry_flow;
        this.insideParkingCountObj[keyDate][hour] = entity.road_inside_parking_count;
        this.outsideParkingCountObj[keyDate][hour] = entity.road_outside_parking_count;
      });

      timer(1).subscribe(() => {
        this.generateEChart(this.currentSort);
      });
    };

    // switch (this.currentSelectorType) {
    //   case SearchSelectorType.Region:
    //     this.flowSubscription = this.dataStatisticsHttpService.flow.requestRegionStatisticsEntryFlowByHourList(this.currentValue, selectDate, selectDate).subscribe(results => {
    //       processBlock(results);
    //     }, err => {
    //       this.globalService.httpErrorProcess(err);
    //     });
    //     break;
    //   case SearchSelectorType.Group:
    //     this.flowSubscription = this.dataStatisticsHttpService.flow.requestGroupStatisticsEntryFlowByHourList(this.currentValue, selectDate, selectDate).subscribe(results => {
    //       processBlock(results);
    //     }, err => {
    //       this.globalService.httpErrorProcess(err);
    //     });
    //     break;
    // }
  }

  /* 更新折线图数据 */
  public generateEChart(sort: number) {
    timer(1).subscribe(() => {
      let tempObj: any, tooltipName: any, parkingCountObj: any;
      const legend_data = [], series_data = [];
      switch (sort) {
        case 1:
          tempObj = this.insideFlowObj;
          parkingCountObj = this.insideParkingCountObj;
          tooltipName = '路内流量';
          break;
        case 2:
          tempObj = this.outsideFlowObj;
          parkingCountObj = this.outsideParkingCountObj;
          tooltipName = '路外流量';
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

      this.chartOptions = {
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
              const parkingNum = parkingCountObj[param.seriesName][params[0].dataIndex] ? parkingCountObj[param.seriesName][params[0].dataIndex] + '个停车场 ' : ' ';
              if (param.seriesName === this.today) {
                res += '<br/>今日 ' + parkingNum + param.value + '辆';
              } else {
                res += '<br/>' + param.seriesName + ' ' + parkingNum + EChartHelper.FormatFlow(param.value);
              }
            });
            return res;
          }
        },
        color: EChartColors,
        legend: {
          data: legend_data,
          padding: [10, 10, 10, 10],
          itemGap: 30,
          type: 'scroll',
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
        series: series_data
      };
      this.chartInstance && this.chartInstance.setOption(this.chartOptions, true);
    });
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
