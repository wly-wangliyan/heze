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
  selector: 'app-online-rate',
  templateUrl: './online-rate.component.html',
  styleUrls: ['./online-rate.component.css', '../../data-statistics.component.css']
})
export class OnlineRateComponent implements OnInit, OnDestroy {

  public insideParkingCount = 0;
  public outsideParkingCount = 0;

  private searchSubscription: Subscription;
  private dataSubscription: Subscription;
  private countSubscription: Subscription;

  private currentSelectorType = SearchSelectorType.Region;
  private currentValue = '';

  public currentSort = 2; // 1:路内停车场 2:路外停车场 3:全部停车场

  public insideOnlineRateItem = new OnlineRateItem('路内停车场');
  public outsideOnlineRateItem = new OnlineRateItem('路外停车场');
  public totalOnlineRateItem = new OnlineRateItem('全部停车场');
  public totalInsideRateItem = new OnlineRateItem('路内停车场');
  public totalOutsideRateItem = new OnlineRateItem('路外停车场');

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
    this.insideOnlineRateItem.daysRate = EChartHelper.GenerateDateArray(this.startDate, this.endDate);
    this.outsideOnlineRateItem.daysRate = EChartHelper.GenerateDateArray(this.startDate, this.endDate);
    this.totalInsideRateItem.daysRate = EChartHelper.GenerateDateArray(this.startDate, this.endDate);
    this.totalOutsideRateItem.daysRate = EChartHelper.GenerateDateArray(this.startDate, this.endDate);
    this.totalOnlineRateItem.daysRate = EChartHelper.GenerateDateArray(this.startDate, this.endDate);
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

      this.requestOnlineRateData();
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
    this.requestOnlineRateData();
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
      const tempItem: OnlineRateItem = sort === 1 ? this.insideOnlineRateItem : this.outsideOnlineRateItem;

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
              let parkingNum = 0;
              if (param.seriesName === '路内停车场' && totalNumObj[param.name]) {
                parkingNum = totalNumObj[param.name].road_inside_parking_total_num;
              } else if (param.seriesName === '路外停车场' && totalNumObj[param.name]) {
                parkingNum = totalNumObj[param.name].road_outside_parking_total_num;
              }
              res += '<br/>' + param.seriesName + ' : ' + parkingNum + '个';
              res += '<br/>' + '在线率' + ' : ' + Number((param.value * 100).toFixed(2)) + '%';
            });
            // setTimeout(function () {
            //   // 仅为了模拟异步回调
            //   callback(ticket, res);
            // }, 0);
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
          name: '在线率',
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

      const totalOnlineRateChartXY = EChartHelper.GenerateChartXY(this.totalOnlineRateItem.daysRate);
      const totalInsideRateChartXY = EChartHelper.GenerateChartXY(this.totalInsideRateItem.daysRate);
      const totalOutsideRateChartXY = EChartHelper.GenerateChartXY(this.totalOutsideRateItem.daysRate);

      legend_data.push(this.outsideOnlineRateItem.name);
      legend_data.push(this.insideOnlineRateItem.name);

      series_data.push({
        name: this.outsideOnlineRateItem.name,
        type: 'bar',
        stack: '在线率',
        label: {
          normal: {
            show: false
          }
        },
        data: totalOutsideRateChartXY.chartY,
      });
      series_data.push({
        name: this.insideOnlineRateItem.name,
        type: 'bar',
        stack: '在线率',
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
            res += '<br/>' + '全部停车场：' + Number((totalOnlineRateChartXY.chartY[params[0].dataIndex] * 100).toFixed(2)) + '%';
            params.forEach(param => {
              res += '<br/>' + param.seriesName + ': ' + Number((param.value * 100).toFixed(2)) + '%';
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
          name: '在线率',
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

  private requestOnlineRateData() {
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
        const insideOnlineRates = EChartHelper.GenerateDateArray(startDate, endDate);
        const outsideOnlineRates = EChartHelper.GenerateDateArray(startDate, endDate);
        const totalOnlineRates = EChartHelper.GenerateDateArray(startDate, endDate);
        const totalInsideRates = EChartHelper.GenerateDateArray(startDate, endDate);
        const totalOutsideRates = EChartHelper.GenerateDateArray(startDate, endDate);
        const tableList = [];

        // 加工数据
        insideOnlineRates.forEach((XYValue, chartIndex) => {
          for (const index in results) {
            const keyTime = DateFormatHelper.Format(new Date(results[index].time_point * 1000));
            if (XYValue.XValue === keyTime) {
              // 遍历数据源与图表项,将X轴时间显示相等的项的数据进行赋值
              insideOnlineRates[chartIndex].YValue = results[index].road_inside_online_rate;
              outsideOnlineRates[chartIndex].YValue = results[index].road_outside_online_rate;
              totalOnlineRates[chartIndex].YValue = results[index].total_online_rate;

              // 计算总在线率中路内与路外的分布
              if (results[index].road_inside_parking_online_num +
                results[index].road_outside_parking_online_num > 0) {
                totalInsideRates[chartIndex].YValue = Number(
                  (results[index].road_inside_parking_online_num /
                    (results[index].road_inside_parking_total_num + results[index].road_outside_parking_total_num)).toFixed(4));
                totalOutsideRates[chartIndex].YValue = Number((totalOnlineRates[chartIndex].YValue - totalInsideRates[chartIndex].YValue).toFixed(4));
              }
              tableList.push(new TableItem(results[index], XYValue.XValue));
              return;
            }
          }
          tableList.push(new TableItem(null, XYValue.XValue));
        });

        // 数据赋值
        this.insideOnlineRateItem.daysRate = insideOnlineRates;
        this.outsideOnlineRateItem.daysRate = outsideOnlineRates;
        this.totalOnlineRateItem.daysRate = totalOnlineRates;
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
          this.dataSubscription = this.dataStatisticsHttpService.onlineRate.requestAllGroupStatisticsOnlineRateByDayList(this.currentValue, this.startDate, this.endDate).subscribe(results => {
            processBlock(results);
          }, err => {
            this.globalService.httpErrorProcess(err);
          });
          break;
        case SearchSelectorType.Region:
          this.dataSubscription = this.dataStatisticsHttpService.onlineRate.requestAllRegionStatisticsOnlineRateByDayList(this.currentValue, this.startDate, this.endDate).subscribe(results => {
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

class OnlineRateItem {
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
