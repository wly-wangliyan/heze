import { Component, OnInit, OnDestroy } from '@angular/core';
import { DateFormatHelper } from '../../../../../utils/date-format-helper';
import { GlobalService } from '../../../../core/global.service';
import { EChartHelper, ChartXYValue, EChartColors } from '../../../../../utils/echart-helper';
import { Subscription, timer } from 'rxjs';
import { SearchSelectorType } from '../../../../share/components/search-selector/search-selector.model';
import { DataStatisticsHttpService } from '../../data-statistics-http.service';
import { SearchSelectorService } from '../../../../share/components/search-selector/search-selector.service';
import { differenceInCalendarDays } from 'date-fns';

@Component({
  selector: 'app-turnover-rate',
  templateUrl: './turnover-rate.component.html',
  styleUrls: ['./turnover-rate.component.css', '../../data-statistics.component.css']
})
export class TurnoverRateComponent implements OnInit, OnDestroy {

  public insideParkingCount = 0;
  public outsideParkingCount = 0;

  private searchSubscription: Subscription;
  private dataSubscription: Subscription;
  private countSubscription: Subscription;

  private currentSelectorType = SearchSelectorType.Region;
  private currentValue = '';

  public currentSort = 2; // 1:路内停车场 2:路外停车场 3:全部停车场

  public insideTurnoverRateItem = new TurnoverRateItem('路内停车场');
  public outsideTurnoverRateItem = new TurnoverRateItem('路外停车场');
  public totalTurnoverRateItem = new TurnoverRateItem('全部停车场');
  public totalInsideRateItem = new TurnoverRateItem('路内停车场');
  public totalOutsideRateItem = new TurnoverRateItem('路外停车场');

  public startDate: Date;
  public endDate: Date;

  public lineChartOptions: any;
  public lineChartInstance: any;
  public barChartOptions: any;
  public barChartInstance: any;

  public dataList: Array<any> = []; // 列表中所有的数据
  public currentPage = 1; // 当前列表的分页
  public currentPageList = []; // 当前分页的数据
  public pageCount = 0; // 当前分页数
  public tablePageSize = 15; // 显示的分页数据数

  constructor(private dataStatisticsHttpService: DataStatisticsHttpService, private searchSelectorService: SearchSelectorService, private globalService: GlobalService) {
  }

  public ngOnInit() {
    this.endDate = DateFormatHelper.Today;
    this.startDate = DateFormatHelper.AWeekAgo;
    this.insideTurnoverRateItem.daysRate = EChartHelper.GenerateDateArray(this.startDate, this.endDate);
    this.outsideTurnoverRateItem.daysRate = EChartHelper.GenerateDateArray(this.startDate, this.endDate);
    this.totalTurnoverRateItem.daysRate = EChartHelper.GenerateDateArray(this.startDate, this.endDate);
    this.totalOutsideRateItem.daysRate = EChartHelper.GenerateDateArray(this.startDate, this.endDate);
    this.totalInsideRateItem.daysRate = EChartHelper.GenerateDateArray(this.startDate, this.endDate);
    this.generateLineChart(this.currentSort);
    this.searchSubscription = this.searchSelectorService.selectStateChanged.subscribe(state => {
      this.currentSelectorType = state.currentType;
      this.currentValue = state.currentValue;

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

      this.requestTurnoverRateData();
    });
  }

  public ngOnDestroy() {
    this.searchSubscription && this.searchSubscription.unsubscribe();
    this.countSubscription && this.countSubscription.unsubscribe();
    this.dataSubscription && this.dataSubscription.unsubscribe();
  }

  public onPageSelected(event: any) {
    this.currentPage = event.pageNum;
    this.currentPageList = this.dataList.slice((this.currentPage - 1) * this.tablePageSize, this.currentPage * this.tablePageSize);
  }

  public onSelectDateButtonClick() {
    this.requestTurnoverRateData();
  }

  public onExportButtonClick() {
    console.log('导出');
  }

  public onSelectTypeClick(sort: number) {
    this.currentSort = sort;
    if (sort === 3) {
      this.generateBarChart();
    } else {
      this.generateLineChart(sort);
    }
  }

  public onLineChartInit(event: any) {
    this.lineChartInstance = event;
  }

  public onBarChartInit(event: any) {
    this.barChartInstance = event;
  }

  public generateLineChart(sort: number) {
    timer(1).subscribe(() => {
      const series_data = [];
      const tempItem: TurnoverRateItem = sort === 1 ? this.insideTurnoverRateItem : this.outsideTurnoverRateItem;
      const totalNumObj = {};
      this.dataList.forEach(dataItem => {
        if (!totalNumObj[dataItem.date]) {
          totalNumObj[dataItem.date] = dataItem.source;
        }
      });

      // 根据数据生成XY轴上的数据
      const chartXY = EChartHelper.GenerateChartXY(tempItem.daysRate);

      series_data.push({
        name: tempItem.name,
        type: 'line',
        data: chartXY.chartY,
      });

      this.lineChartOptions = {
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            'type': 'line' // 默认为直线，可选为：'line' | 'shadow'
          },
          confine: true, // 是否将 tooltip 框限制在图表的区域内。
          formatter: (params, ticket, callback) => {
            let res = params[0].name;
            params.forEach(param => {
              if (param.seriesName === '路内停车场') {
                const insideTotalNum = totalNumObj[param.name] ? totalNumObj[param.name].road_inside_total_num : 0;
                res += '<br/>' + '路内临时车位总数' + ' : ' + insideTotalNum;
              } else if (param.seriesName === '路外停车场') {
                const outsideTotalNum = totalNumObj[param.name] ? totalNumObj[param.name].road_outside_total_num : 0;
                res += '<br/>' + '路外临时车位总数' + ' : ' + outsideTotalNum;
              }
              res += '<br/>' + param.seriesName + ' : ' + param.value;
            });
            return res;
          }
        },
        color: EChartColors,
        grid: {
          left: '3%',
          right: '4%',
          top: '8%',
          bottom: '5%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          nameGap: 5,
          data: chartXY.chartX,
          name: '时间/天',
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
          name: '周转率',
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

  public generateBarChart() {
    timer(1).subscribe(() => {
      const legend_data = [], series_data = [];

      // 根据数据生成XY轴上的数据

      const totalOnlineRateChartXY = EChartHelper.GenerateChartXY(this.totalTurnoverRateItem.daysRate);
      const totalInsideRateChartXY = EChartHelper.GenerateChartXY(this.totalInsideRateItem.daysRate);
      const totalOutsideRateChartXY = EChartHelper.GenerateChartXY(this.totalOutsideRateItem.daysRate);

      legend_data.push(this.outsideTurnoverRateItem.name);
      legend_data.push(this.insideTurnoverRateItem.name);
      series_data.push({
        name: this.outsideTurnoverRateItem.name,
        type: 'bar',
        stack: '周转率',
        label: {
          normal: {
            show: false
          }
        },
        data: totalOutsideRateChartXY.chartY,
      });
      series_data.push({
        name: this.insideTurnoverRateItem.name,
        type: 'bar',
        stack: '周转率',
        label: {
          normal: {
            show: false
          }
        },
        data: totalInsideRateChartXY.chartY,
      });


      this.barChartOptions = {
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            'type': 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
          confine: true, // 是否将 tooltip 框限制在图表的区域内。
          formatter: (params, ticket, callback) => {
            let res = params[0].name;
            res += '<br/>' + '全部停车场：' + totalOnlineRateChartXY.chartY[params[0].dataIndex];
            params.forEach(param => {
              res += '<br/>' + param.seriesName + ': ' + param.value;
            });
            // setTimeout(function () {
            //   // 仅为了模拟异步回调
            //   callback(ticket, res);
            // }, 0);
            return res;
          }
        },
        legend: {
          data: legend_data,
          itemWidth: 20
        },
        color: EChartColors,
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
          data: totalOnlineRateChartXY.chartX,
          name: '时间/天',
          boundaryGap: true,
          nameTextStyle: {
            color: '#999'
          },
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
          name: '周转率',
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

  private requestTurnoverRateData() {
    if (this.globalService.checkDateValid(this.startDate, this.endDate)) {
      // 输入的时间格式有效
      if (!this.startDate || !this.endDate) {
        this.globalService.promptBox.open('请输入正确的时间！');
        return;
      }
      const startDate = this.startDate;
      const endDate = this.endDate;
      const processBlock = (results) => {
        // 初始化数据
        const insideTurnoverRates = EChartHelper.GenerateDateArray(startDate, endDate);
        const outsideTurnoverRates = EChartHelper.GenerateDateArray(startDate, endDate);
        const totalTurnoverRates = EChartHelper.GenerateDateArray(startDate, endDate);
        const totalInsideRates = EChartHelper.GenerateDateArray(startDate, endDate);
        const totalOutsideRates = EChartHelper.GenerateDateArray(startDate, endDate);
        const tableList = [];

        // 加工数据
        insideTurnoverRates.forEach((XYValue, chartIndex) => {
          for (const index in results) {
            if (results.hasOwnProperty(index)) {
              const keyTime = DateFormatHelper.Format(new Date(results[index].time_point * 1000));
              if (XYValue.XValue === keyTime) {
                // 遍历数据源与图表项,将X轴时间显示相等的项的数据进行赋值
                insideTurnoverRates[chartIndex].YValue = results[index].road_inside_turnover_rate;
                outsideTurnoverRates[chartIndex].YValue = results[index].road_outside_turnover_rate;
                totalTurnoverRates[chartIndex].YValue = results[index].total_turnover_rate;
                // 计算总周转率中路内与路外的分布
                if (results[index].road_inside_entry_flow +
                  results[index].road_outside_entry_flow > 0) {
                  totalInsideRates[chartIndex].YValue = Number(
                    (results[index].road_inside_entry_flow /
                      (results[index].road_inside_total_num + results[index].road_outside_total_num)).toFixed(4));
                  totalOutsideRates[chartIndex].YValue = Number((totalTurnoverRates[chartIndex].YValue - totalInsideRates[chartIndex].YValue).toFixed(4));
                }
                tableList.push(new TableItem(results[index], XYValue.XValue));
                return;
              }
            }
          }
          tableList.push(new TableItem(null, XYValue.XValue));
        });

        // 数据赋值
        this.insideTurnoverRateItem.daysRate = insideTurnoverRates;
        this.outsideTurnoverRateItem.daysRate = outsideTurnoverRates;
        this.totalTurnoverRateItem.daysRate = totalTurnoverRates;
        this.totalInsideRateItem.daysRate = totalInsideRates;
        this.totalOutsideRateItem.daysRate = totalOutsideRates;
        // 初始化列表数据
        this.initTable(tableList);
        // 更新图表
        this.onSelectTypeClick(this.currentSort);
      };
      this.dataSubscription && this.dataSubscription.unsubscribe();
      switch (this.currentSelectorType) {
        case SearchSelectorType.Group:
          this.dataSubscription = this.dataStatisticsHttpService.turnoverRate.requestAllGroupStatisticsTurnoverRateByDayList(this.currentValue, this.startDate, this.endDate).subscribe(results => {
            processBlock(results);
          }, err => {
            this.globalService.httpErrorProcess(err);
          });
          break;
        case SearchSelectorType.Region:
          this.dataSubscription = this.dataStatisticsHttpService.turnoverRate.requestAllRegionStatisticsTurnoverRateByDayList(this.currentValue, this.startDate, this.endDate).subscribe(results => {
            processBlock(results);
          }, err => {
            this.globalService.httpErrorProcess(err);
          });
          break;
      }
    }
  }

  /**
   * 初始化列表
   * @param results 数据
   */
  private initTable(results: Array<any>) {
    this.dataList = results;
    this.currentPage = 1;
    this.currentPageList = this.dataList.slice(0, this.tablePageSize);

    const intPage = Math.floor(this.dataList.length / this.tablePageSize);
    this.pageCount = this.dataList.length % this.tablePageSize === 0 ? intPage : intPage + 1;
  }

  // 开始时间禁用
  public disabledStartDate = (startValue: Date): boolean => {
    if (differenceInCalendarDays(startValue, new Date()) > 0) {
      return true;
    } else if (!startValue || !this.endDate) {
      return false;
    } else if (new Date(startValue).setHours(0, 0, 0, 0) > new Date(this.endDate).setHours(0, 0, 0, 0)) {
      return true;
    } else {
      return false;
    }
  }

  // 结束时间禁用
  public disabledEndDate = (endValue: Date): boolean => {
    if (differenceInCalendarDays(endValue, new Date()) > 0) {
      return true;
    } else if (!endValue || !this.startDate) {
      return false;
    } else if (new Date(endValue).setHours(0, 0, 0, 0) < new Date(this.startDate).setHours(0, 0, 0, 0)) {
      return true;
    } else {
      return false;
    }
  }
}

class TurnoverRateItem {
  public daysRate: Array<ChartXYValue> = [];
  public name: string;

  constructor(name: string) {
    this.name = name;
  }
}

class TableItem {
  public source: any;
  public date: string; // 格式化好的时间

  constructor(source: any, date: string) {
    this.source = source;
    this.date = date;
  }
}
