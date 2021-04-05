import { Component, OnInit, OnDestroy } from '@angular/core';
import { DateFormatHelper } from '../../../../../utils/date-format-helper';
import { GlobalService } from '../../../../core/global.service';
import { ComputingCycle, EChartHelper, EChartColors, ChartXYValue } from '../../../../../utils/echart-helper';
import { SearchSelectorService } from '../../../../share/components/search-selector/search-selector.service';
import { DataStatisticsHttpService } from '../../data-statistics-http.service';
import { Subscription, timer } from 'rxjs';
import { SearchSelectorType } from '../../../../share/components/search-selector/search-selector.model';
import { differenceInCalendarDays } from 'date-fns';

@Component({
  selector: 'app-history-flow',
  templateUrl: './history-flow.component.html',
  styleUrls: ['./history-flow.component.css', '../../data-statistics.component.css']
})
export class HistoryFlowComponent implements OnInit, OnDestroy {

  public insideParkingCount = 0;
  public outsideParkingCount = 0;

  private searchSubscription: Subscription;
  private dataSubscription: Subscription;
  private countSubscription: Subscription;

  private currentSelectorType = SearchSelectorType.Region;
  private currentValue = '';

  public currentSort = 2; // 1:路内流量 2:路外流量 3:流量成分构成
  public currentCycle: any = ComputingCycle.day; // 当前周期计算

  public insideFlowItem = new FlowTypeItem('路内流量');
  public outsideFlowItem = new FlowTypeItem('路外流量');
  public totalFlowItem = new FlowTypeItem('总流量');

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

  public tableTotalInsideFlow = 0;
  public tableTotalOutsideFlow = 0;
  public tableTotalInsideParkingCount = 0;
  public tableTotalOutsideParkingCount = 0;

  constructor(private dataStatisticsHttpService: DataStatisticsHttpService, private searchSelectorService: SearchSelectorService, private globalService: GlobalService) {
  }

  public ngOnInit() {
    this.endDate = DateFormatHelper.Today;
    this.startDate = DateFormatHelper.AWeekAgo;
    this.insideFlowItem.daysFlow = EChartHelper.GenerateCycleArray(this.startDate, this.endDate, this.currentCycle);
    this.outsideFlowItem.daysFlow = EChartHelper.GenerateCycleArray(this.startDate, this.endDate, this.currentCycle);
    this.totalFlowItem.daysFlow = EChartHelper.GenerateCycleArray(this.startDate, this.endDate, this.currentCycle);
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

      this.requestFlowData();
    });
  }

  public ngOnDestroy() {
    this.searchSubscription && this.searchSubscription.unsubscribe();
    this.countSubscription && this.countSubscription.unsubscribe();
    this.dataSubscription && this.dataSubscription.unsubscribe();
  }

  public onStatisticsCycleSelectChange(event: any) {
    this.currentCycle = parseInt(event.target.value, null);
  }

  public onPageSelected(event: any) {
    this.currentPage = event.pageNum;
    this.currentPageList = this.dataList.slice((this.currentPage - 1) * this.tablePageSize, this.currentPage * this.tablePageSize);
  }

  public onSelectDateButtonClick() {
    this.requestFlowData();
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
      const tempItem: FlowTypeItem = sort === 1 ? this.insideFlowItem : this.outsideFlowItem;
      const cycle = this.currentCycle;
      // 根据数据生成XY轴上的数据
      const chartXY = EChartHelper.GenerateChartXY(tempItem.daysFlow);
      let xAxisName = '';
      switch (cycle) {
        case ComputingCycle.day:
          xAxisName = '时间/天';
          break;
        case ComputingCycle.month:
          xAxisName = '时间/月';
          break;
        case ComputingCycle.week:
          xAxisName = '时间/周';
          break;
      }

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
            let res = EChartHelper.FormatDateString(params[0].name, cycle);
            const parking_name = sort === 1 ? '路内停车场' : '路外停车场';
            params.forEach(param => {
              const dataTableItem = this.dataList.find(dataItem => dataItem.date.indexOf(param.name) === 0);
              if (dataTableItem) {
                if (sort === 1) {
                  const insideTotalNum = dataTableItem.source ? dataTableItem.source.road_inside_parking_count : 0;
                  res += '<br/>' + parking_name + ' : ' + insideTotalNum + '个';
                } else {
                  const outsideTotalNum = dataTableItem.source ? dataTableItem.source.road_outside_parking_count : 0;
                  res += '<br/>' + parking_name + ' : ' + outsideTotalNum + '个';
                }
                res += '<br/>' + param.seriesName + ' : ' + EChartHelper.FormatFlow(param.value);
              }
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
          name: xAxisName,
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
          minInterval: 1,
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
      this.lineChartInstance && this.lineChartInstance.setOption(this.lineChartOptions, true);
    });
  }

  public generateBarChart() {
    timer(1).subscribe(() => {
      const legend_data = [], series_data = [];
      const cycle = this.currentCycle;
      let xAxisName = '时间/天';
      switch (cycle) {
        case ComputingCycle.day:
          xAxisName = '时间/天';
          break;
        case ComputingCycle.month:
          xAxisName = '时间/月';
          break;
        case ComputingCycle.week:
          xAxisName = '时间/周';
          break;
      }

      const insideFlowChartXY = EChartHelper.GenerateChartXY(this.insideFlowItem.daysFlow);
      const outsideFlowChartXY = EChartHelper.GenerateChartXY(this.outsideFlowItem.daysFlow);
      const totalFlowChartXY = EChartHelper.GenerateChartXY(this.totalFlowItem.daysFlow);

      legend_data.push(this.outsideFlowItem.name);
      legend_data.push(this.insideFlowItem.name);

      series_data.push({
        name: this.outsideFlowItem.name,
        type: 'bar',
        stack: '总量',
        label: {
          normal: {
            show: false
          }
        },
        data: outsideFlowChartXY.chartY,
      });
      series_data.push({
        name: this.insideFlowItem.name,
        type: 'bar',
        stack: '总量',
        label: {
          normal: {
            show: false
          }
        },
        data: insideFlowChartXY.chartY,
      });

      this.barChartOptions = {
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            'type': 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
          confine: true, // 是否将 tooltip 框限制在图表的区域内。
          formatter: (params, ticket, callback) => {
            let res = EChartHelper.FormatDateString(params[0].name, cycle);
            res += '<br/>' + '总流量：' + EChartHelper.FormatFlow(totalFlowChartXY.chartY[params[0].dataIndex]);
            params.forEach(param => {
              res += '<br/>' + param.seriesName + ': ' + EChartHelper.FormatFlow(param.value);
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
          itemWidth: 20,
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
          data: totalFlowChartXY.chartX,
          name: xAxisName,
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
          name: '数量/辆',
          minInterval: 1,
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
      this.barChartInstance && this.barChartInstance.setOption(this.barChartOptions, true);
    });
  }

  /**
   * 请求流量数据
   */
  private requestFlowData() {
    if (this.globalService.checkDateValid(this.startDate, this.endDate)) {
      if (!this.startDate || !this.endDate) {
        this.globalService.promptBox.open('请输入正确的时间！');
        return;
      }
      // 输入的时间格式有效
      const currentCycle = this.currentCycle;
      const startDate = this.startDate;
      const endDate = this.endDate;
      const processBlock = (results) => {
        // 初始化数据
        const insideDaysFlow = EChartHelper.GenerateCycleArray(startDate, endDate, currentCycle);
        const outsideDaysFlow = EChartHelper.GenerateCycleArray(startDate, endDate, currentCycle);
        const totalDaysFlow = EChartHelper.GenerateCycleArray(startDate, endDate, currentCycle);
        let tableInsideFlow = 0;
        let tableOutsideFlow = 0;
        let tableInsideParkingCount = 0;
        let tableOutsideParkingCount = 0;
        const tableList = [];

        // 加工数据
        insideDaysFlow.forEach((XYValue, chartIndex) => {
          for (const index in results) {
            if (results.hasOwnProperty(index)) {
              const keyTime = DateFormatHelper.Format(new Date(results[index].time_point * 1000));
              if (XYValue.XValue === keyTime) {
                // 遍历数据源与图表项,将X轴时间显示相等的项的数据进行赋值
                insideDaysFlow[chartIndex].YValue = results[index].road_inside_entry_flow;
                outsideDaysFlow[chartIndex].YValue = results[index].road_outside_entry_flow;
                totalDaysFlow[chartIndex].YValue = results[index].total_entry_flow;
                tableInsideFlow += results[index].road_inside_entry_flow;
                tableOutsideFlow += results[index].road_outside_entry_flow;
                tableInsideParkingCount += results[index].road_inside_parking_count;
                tableOutsideParkingCount += results[index].road_inside_parking_count;
                tableList.push(new TableItem(results[index], EChartHelper.FormatDateString(keyTime, currentCycle)));
                return;
              }
            }
          }
          tableList.push(new TableItem(null, EChartHelper.FormatDateString(XYValue.XValue, currentCycle)));
        });

        // 数据赋值
        this.insideFlowItem.daysFlow = insideDaysFlow;
        this.outsideFlowItem.daysFlow = outsideDaysFlow;
        this.totalFlowItem.daysFlow = totalDaysFlow;
        this.tableTotalInsideFlow = tableInsideFlow;
        this.tableTotalOutsideFlow = tableOutsideFlow;
        this.tableTotalInsideParkingCount = tableInsideParkingCount;
        this.tableTotalOutsideParkingCount = tableOutsideParkingCount;
        // 初始化列表数据
        this.initTable(tableList);
        // 更新图表
        this.onSelectTypeClick(this.currentSort);
      };
      this.dataSubscription && this.dataSubscription.unsubscribe();
      switch (this.currentSelectorType) {
        case SearchSelectorType.Group:
          switch (this.currentCycle) {
            case ComputingCycle.day:
              this.dataSubscription = this.dataStatisticsHttpService.flow.requestAllGroupStatisticsEntryFlowByDayList(this.currentValue, this.startDate, this.endDate).subscribe(results => {
                processBlock(results);
              }, err => {
                this.globalService.httpErrorProcess(err);
              });
              break;
            case ComputingCycle.week:
              this.dataSubscription = this.dataStatisticsHttpService.flow.requestAllGroupStatisticsEntryFlowByWeekList(this.currentValue, this.startDate, this.endDate).subscribe(results => {
                processBlock(results);
              }, err => {
                this.globalService.httpErrorProcess(err);
              });
              break;
            case ComputingCycle.month:
              this.dataSubscription = this.dataStatisticsHttpService.flow.requestGroupStatisticsEntryFlowByMonthList(this.currentValue, this.startDate, this.endDate).subscribe(response => {
                processBlock(response.results);
              }, err => {
                this.globalService.httpErrorProcess(err);
              });
              break;
          }
          break;
        case SearchSelectorType.Region:
          switch (this.currentCycle) {
            case ComputingCycle.day:
              this.dataSubscription = this.dataStatisticsHttpService.flow.requestAllRegionStatisticsEntryFlowByDayList(this.currentValue, this.startDate, this.endDate).subscribe(results => {
                processBlock(results);
              }, err => {
                this.globalService.httpErrorProcess(err);
              });
              break;
            case ComputingCycle.week:
              this.dataSubscription = this.dataStatisticsHttpService.flow.requestAllRegionStatisticsEntryFlowByWeekList(this.currentValue, this.startDate, this.endDate).subscribe(results => {
                processBlock(results);
              }, err => {
                this.globalService.httpErrorProcess(err);
              });
              break;
            case ComputingCycle.month:
              this.dataSubscription = this.dataStatisticsHttpService.flow.requestRegionStatisticsEntryFlowByMonthList(this.currentValue, this.startDate, this.endDate).subscribe(response => {
                processBlock(response.results);
              }, err => {
                this.globalService.httpErrorProcess(err);
              });
              break;
          }
          break;
      }
    }
  }

  /**
   * 初始化列表
   * @param results 数据
   */
  private initTable(results: Array<TableItem>) {
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

class FlowTypeItem {
  public daysFlow: Array<ChartXYValue> = [];
  public name: string;

  constructor(name: string) {
    this.name = name;
  }
}

export class TableItem {
  public source: any;
  public date: string; // 格式化好的时间

  constructor(source: any, date: string) {
    this.source = source;
    this.date = date;
  }
}
