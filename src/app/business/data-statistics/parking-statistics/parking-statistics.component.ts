import { Component, OnInit, ViewChild, OnDestroy, } from '@angular/core';
import { DateFormatHelper } from '../../../../utils/date-format-helper';
import { CheckboxState } from '../../../share/components/beautify-checkbox/beautify-checkbox.component';
import { ParkingFlowParams, ParkingHistoryEntity } from '../data-statistics.model';
import { DataStatisticsHttpService } from '../data-statistics-http.service';
import { SearchAssistant } from '../../../share/search-assistant';
import { GlobalService } from '../../../core/global.service';
import { timer } from 'rxjs';
import { ComputingCycle, EChartColors, EChartHelper } from '../../../../utils/echart-helper';
import { BeautifyRadioItem } from '../../../share/components/beautify-radio/beautify-radio.component';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { ParkingFlowByhourComponent } from './parking-flow-byhour/parking-flow-byhour.component';
import { GlobalConst } from '../../../share/global-const';
import { differenceInCalendarDays } from 'date-fns';
import { ParkingEntity } from '../../parkings/parkings.model';
import { RegionEntity } from 'src/app/core/region-http.service';
import { ExportModalComponent } from './export-modal/export-modal.component';

class RegionItem {
  public name: string;
  public code: string;
  public isChecked = false;

  constructor(source: RegionEntity) {
    this.name = source.name;
    this.code = source.region_id;
  }
}

@Component({
  selector: 'app-parking-statistics',
  templateUrl: './parking-statistics.component.html',
  styleUrls: ['./parking-statistics.component.css'],
  animations: [
    trigger
      ('openCloseLeft', [
        state('open', style({
          transform: 'translateX(0px)'
        })),
        state('close', style({
          width: '24px',
          paddingRight: '60px',
          transform: 'translateX(-45px)',
        })),
        transition('open => close', [
          animate('0.3s ease-in-out')
        ]),
        transition('close => open', [
          animate('0.3s ease-in-out')
        ]),
      ]),
    trigger
      ('openCloseRight', [
        state('open', style({
          width: 'calc(100% - 380px)',
        })),
        state('close', style({
          width: 'calc(100% - 100px)',
          marginLeft: '-10px',
        })),
        transition('open => close', [
          animate('0.3s ease-in-out')
        ]),
        transition('close => open', [
          animate('0.3s ease-in-out')
        ]),
      ]),

  ]
})

export class ParkingStatisticsComponent implements OnInit, OnDestroy {
  public isOpen = true; // 动画
  public parkingFlowParams = new ParkingFlowParams();
  public searchAssistant: SearchAssistant;
  public dataList: Array<ParkingEntity> = []; // 停车场列表
  public areaTypeList = []; // 单选框数据
  public areaType: number;  // 单选框数据
  private reginIds = []; // 复选框数据
  public idSearchData = true;
  public regionList: Array<RegionItem> = []; // 区域列表
  public parkingName: string; // 停车场名字
  public total: number; // 停车总数/泊位数
  public lookHistoryShow = false;
  public currentCycle: any = ComputingCycle.day; // 当前周期计算
  public turnoverCurrentCycle: any = ComputingCycle.day; // 周转率当前周期计算

  public lineChartOptions: any; // 日流量折线图
  public turnoverLineChartOptions: any; // 周转率折线图

  public regionId = GlobalConst.RegionID; // 区域id
  public parkingId: string; // 停车场id
  public dayEChartX: any; // 每日 echarts X坐标
  public dayEChartYOfEnter: any; // 每日 echarts 入场Y坐标
  public dayEChartYOfOut: any; // 每日 echarts 出场Y坐标
  public turnoverEChartX: any; // 周转率 echarts X坐标
  public turnoverEChartY: any; // 周转率 echarts Y坐标
  public lookParkingHistory: Array<ParkingHistoryEntity>; // 查看停车场历史
  private anyParkingData: any; // 点击左侧列表得到的指定停车场所有信息
  public startDate: Date; // 流量时间插件开始时间
  public endDate: Date; // 流量时间插件结束时间
  public turnoverStartDate: Date; // 周转率时间插件开始时间
  public turnoverEndDate: Date; // 周转率时间插件结束时间
  public flowXAxisName = '时间/天'; // 流量横坐标单位
  public turnoverXAxisName = '时间/天'; // 流量横坐标单位

  public datePickerDefaultOptions: any = {
    startDate: new Date('2000/01/01'),
    endDate: DateFormatHelper.Today,
    autoclose: true,
    todayBtn: 'linked',
    todayHighlight: true,
    assumeNearbyYear: true,
    format: 'yyyy/mm/dd',
    language: 'zh-CN',
  };

  @ViewChild('entryFlowByHour', { static: false }) public entryFlowByHourCpt: ParkingFlowByhourComponent;
  @ViewChild('exitFlowByHour', { static: false }) public exitFlowByHourCpt: ParkingFlowByhourComponent;
  @ViewChild('exportModal', { static: false }) public exportModal: ExportModalComponent;
  constructor(private dataStatisticsHttpService: DataStatisticsHttpService,
    private globalService: GlobalService,
  ) {
    this.dataList = [];
    this.parkingFlowParams.region_ids = this.regionId;
    this.searchAssistant = new SearchAssistant(this);
    this.searchAssistant.submitSearch(true);
    this.endDate = DateFormatHelper.Today;
    this.startDate = DateFormatHelper.AWeekAgo;
    this.turnoverEndDate = DateFormatHelper.Today;
    this.turnoverStartDate = DateFormatHelper.AWeekAgo;
    this.generateLineChart();
    this.generateTurnoverLineChart();

  }

  ngOnInit() {
    this.areaTypeList.push(new BeautifyRadioItem('1', '路内'));
    this.areaTypeList.push(new BeautifyRadioItem('2', '路外'));
    this.getRegions();
  }

  public ngOnDestroy() {
    // 当页面销毁时缓存数据,并解除检索适配器对页面的引用
    this.searchAssistant.disconnect();
  }

  private getRegions(): void {
    this.globalService.currentTileRegions.subscribe(regions => {
      regions.forEach(region => {
        if (region.region_id !== GlobalConst.RegionID) {
          this.regionList.push(new RegionItem(region));
        }
      });
    });
  }

  /* SearchAdapter 接口实现 */

  /* 请求检索 */
  public requestSearch(): any {
    return this.dataStatisticsHttpService.requestParkingFlowList(this.parkingFlowParams);
  }

  public continueSearch(url: string): any {
    return this.dataStatisticsHttpService.continueParkingFlowList(url);
  }

  /* 生成并检查参数有效性 */
  public generateAndCheckParamsValid(): boolean {
    return true;
  }

  /* 检索失败处理 */
  public searchErrProcess(err: any) {
    this.globalService.httpErrorProcess(err);
  }

  /* 检索成功处理 */
  public searchCompleteProcess(results: Array<any>, isFuzzySearch: boolean) {
    if (results.length === 0 && !isFuzzySearch) {
      // 精确查询时需要弹出提示
      this.globalService.promptBox.open('暂未查询到数据！');
    }
    // 获取当前页面数据
    this.dataList = results;
    // 把第一条数据展示到右侧
    if (results.length > 0) {
      this.idSearchData = true;
      this.onSelectTableItem(results[0], 1);
    } else {
      this.idSearchData = false;
    }
  }

  // 复选框change
  public onRegionChange(event: any) {
    const region = event[1];
    region.isChecked = event[0] === CheckboxState.checked ? true : false;
    if (region.isChecked) {
      this.reginIds.push(event[1].code);
    } else {
      const reginIdIndex = this.reginIds.findIndex(item => item === event[1].code);
      if (reginIdIndex > -1) {
        this.reginIds.splice(reginIdIndex, 1);
      }
    }
    this.parkingFlowParams.region_ids = this.reginIds.join(',');
  }

  // 单选框选中
  public onSelectAreaType(event: any) {
    this.parkingFlowParams.area_type = event.value;
  }

  // 提交查询
  public onSubmitClick() {
    this.searchAssistant.submitSearch(true);
  }

  // 点击列表每项获取指定停车场详细信息 右侧生成数据
  // item用来区分真正点击还是内部调用 因为真正点击列表会调用创造历史接口 item=2 点击  item=1 其他函数调用
  public onSelectTableItem(data: any, item: number) {
    this.anyParkingData = data;
    this.parkingId = data.parking_id;
    if (item === 2) {
      this.dataStatisticsHttpService.createParkingLookHistory(data.parking_id).subscribe(res => {  // create历史
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
    }
    this.parkingName = data.parking_name;
    this.total = data.total;
    this.getData(data, 'enter', 'flow', this.currentCycle, (res) => {
      if (this.currentCycle === 1) {
        this.processEchartYDate(res, 'enter', 'flow');
      } else {
        this.processEchartYDate(res.results, 'enter', 'flow');
      }
      this.generateLineChart();
    });
    this.getData(data, 'exit', 'flow', this.currentCycle, (res) => {
      this.processEchartYDate(res.results, 'exit', 'flow');
      this.generateLineChart();
    });
    this.getData(data, 'enter', 'turnover', this.turnoverCurrentCycle, (res) => {
      if (this.turnoverCurrentCycle === 1) {
        this.processEchartYDate(res, 'enter', 'turnover');
      } else {
        this.processEchartYDate(res.results, 'enter', 'turnover');
      }
      this.generateTurnoverLineChart();
    });
  }

  // 获取数据 参数： 每条data数据内容  direction入场或出场: enter入 exit出;  type周转率还是流量: flow流量 turnover周转率
  // time: 0日 1周 2月
  private getData(data: any, direction: string, type: string, time: number, callback: any) {
    let startDate: Date;
    let endDate: Date;
    // 判断流量还是周转率
    if (type === 'flow') {
      startDate = this.startDate;
      endDate = this.endDate;
    } else if (type === 'turnover') {
      startDate = this.turnoverStartDate;
      endDate = this.turnoverEndDate;
    }
    // 判断出场还是入场
    if (direction === 'enter') {
      if (time === 0) { // 判 断 日周月
        this.dataStatisticsHttpService.flow.requestParkingStatisticsEntryFlowByDayListWithParkingId(
          GlobalConst.RegionID, startDate, endDate, data.parking_id, 30, 'entry_flow'
        ).subscribe(res => {
          callback && callback(res);
        }, err => {
          this.globalService.httpErrorProcess(err);
        });
      } else if (time === 1) {
        this.dataStatisticsHttpService.flow.requestParkingStatisticsEntryFlowByWeekList(this.parkingId, 'entry_flow', this.regionId, this.startDate, this.endDate).subscribe(res => {
          callback && callback(res);
        }, err => {
          this.globalService.httpErrorProcess(err);
        });
      } else {
        this.dataStatisticsHttpService.flow.requestParkingStatisticsEntryFlowByMonthList(
          this.parkingId, this.regionId, this.startDate, this.endDate
        ).subscribe(res => {
          callback && callback(res);
        }, err => {
          this.globalService.httpErrorProcess(err);
        }
        );
      }
    } else {
      if (time === 0) {
        this.dataStatisticsHttpService.requestParkingOutFlowByDayList(
          GlobalConst.RegionID, startDate, endDate, 30, data.parking_id, 'time_point'
        ).subscribe(res => {
          callback && callback(res);
        }, err => {
          this.globalService.httpErrorProcess(err);
        });
      } else if (time === 1) {
        this.dataStatisticsHttpService.requestParkingOutFlowByWeekList(
          GlobalConst.RegionID, startDate, endDate, 30, data.parking_id, 'time_point'
        ).subscribe(res => {
          callback && callback(res);
        }, err => {
          this.globalService.httpErrorProcess(err);
        });
      } else {
        this.dataStatisticsHttpService.requestParkingOutFlowByMonthList(
          GlobalConst.RegionID, startDate, endDate, 30, data.parking_id, 'time_point'
        ).subscribe(res => {
          callback && callback(res);
        }, err => {
          this.globalService.httpErrorProcess(err);
        });
      }
    }
  }

  // 日流量画图
  public generateLineChart() {
    timer(1).subscribe(() => {
      const cycle = this.currentCycle;
      // 根据数据生成XY轴上的数据
      const xAxisName = this.flowXAxisName;

      this.lineChartOptions = {
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            'type': 'line' // 默认为直线，可选为：'line' | 'shadow'
          },
          confine: true, // 是否将 tooltip 框限制在图表的区域内。
          formatter: (params) => {
            let res = EChartHelper.FormatDateString(params[0].name, cycle);
            params.forEach(param => {
              res += '<br/>' + param.seriesName + ' : ' + EChartHelper.FormatFlow(param.value);
            });
            return res;
          }
        },
        color: EChartColors,
        grid: {
          left: '3%',
          right: '10%',
          top: '15%',
          bottom: '3%',
          containLabel: true,
        },
        legend: {
          data: ['入场', '出场']
        },
        xAxis: {
          type: 'category',
          nameGap: 5,
          data: this.dayEChartX,
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
            padding: [0, 0, 0, 10]
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
        series: [
          {
            name: '入场',
            type: 'line',
            data: this.dayEChartYOfEnter,
          },
          {
            name: '出场',
            type: 'line',
            data: this.dayEChartYOfOut,
          }
        ]
      };
    });
  }

  // 周转率画图
  public generateTurnoverLineChart() {
    timer(1).subscribe(() => {
      const cycle = this.currentCycle;
      // 根据数据生成XY轴上的数据
      const xAxisName = this.turnoverXAxisName;

      this.turnoverLineChartOptions = {
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            'type': 'line' // 默认为直线，可选为：'line' | 'shadow'
          },
          confine: true, // 是否将 tooltip 框限制在图表的区域内。
          formatter: (params: any) => {
            let res = EChartHelper.FormatDateString(params[0].name, cycle);
            params.forEach(param => {
              res += '<br/>' + param.seriesName + ' : ' + EChartHelper.FormatTurnover(param.value);
            });
            return res;
          }
        },
        color: EChartColors,
        grid: {
          left: '3%',
          right: '10%',
          top: '15%',
          bottom: '3%',
          containLabel: true,
        },
        legend: {
          data: ['入场', '出场']
        },
        xAxis: {
          type: 'category',
          nameGap: 5,
          data: this.turnoverEChartX,
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
            padding: [0, 0, 0, 10]
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
        series: [
          {
            name: '周转率',
            type: 'line',
            data: this.turnoverEChartY,
          }
        ]
      };
    });
  }

  // 格式化每日坐标数据 参数：res传入的数据  direction：传入的用来区分出入场 入场enter 出场exit  type: 区分流量还是周转率
  private processEchartYDate(results: any, direction: string, type: string) {
    if (type === 'flow') {
      const daysFlowEnter = EChartHelper.GenerateCycleArray(this.startDate, this.endDate, this.currentCycle);
      const daysFlowExit = EChartHelper.GenerateCycleArray(this.startDate, this.endDate, this.currentCycle);
      daysFlowEnter.forEach((XYValue, chartIndex) => {
        for (const index in results) {
          if (results.hasOwnProperty(index)) {
            const keyTime = DateFormatHelper.Format(new Date(results[index].time_point * 1000));
            if (XYValue.XValue === keyTime) {
              // 遍历数据源与图表项,将X轴时间显示相等的项的数据进行赋值
              if (direction === 'enter') {
                daysFlowEnter[chartIndex].YValue += results[index].entry_flow;
              } else {
                daysFlowExit[chartIndex].YValue += results[index].exit_flow;
              }
            }
          }
        }
      });
      const daysX = [];
      const daysYEnter = [];
      const daysYExit = [];
      if (direction === 'enter') {
        for (const item of daysFlowEnter) {
          daysX.push(item.XValue);
          daysYEnter.push(item.YValue);
        }
        this.dayEChartYOfEnter = daysYEnter;
      } else {
        for (const item of daysFlowExit) {
          daysX.push(item.XValue);
          daysYExit.push(item.YValue);
        }
        this.dayEChartYOfOut = daysYExit;
      }
      this.dayEChartX = daysX;
    } else if (type === 'turnover') {
      const daysTurnover = EChartHelper.GenerateCycleArray(this.turnoverStartDate, this.turnoverEndDate, this.turnoverCurrentCycle);
      daysTurnover.forEach((XYValue, chartIndex) => {
        for (const index in results) {
          if (results.hasOwnProperty(index)) {
            const keyTime = DateFormatHelper.Format(new Date(results[index].time_point * 1000));
            if (XYValue.XValue === keyTime) {
              // 遍历数据源与图表项,将X轴时间显示相等的项的数据进行赋值
              daysTurnover[chartIndex].YValue += results[index].turnover_rate;
            }
          }
        }
      });
      const daysX = [];
      const daysY = [];
      for (const item of daysTurnover) {
        daysX.push(item.XValue);
        daysY.push(item.YValue);
      }
      this.turnoverEChartY = daysY;
      this.turnoverEChartX = daysX;
    }
  }

  // 查看历史
  public onLookHistoryClick() {
    this.dataStatisticsHttpService.requestLookHistoryList().subscribe(res => {
      this.lookParkingHistory = res.results;
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
    this.lookHistoryShow = true;
    window.addEventListener('click', this.globalClick);
  }

  public globalClick = (event: any) => {

    if (event.target.className.indexOf('look-history-content') >= 0 || event.target.className.indexOf('look-history-content-li') >= 0 || event.target.className.indexOf('look-history-a') >= 0) {
      this.lookHistoryShow = true;
    } else {
      this.lookHistoryShow = false;
      window.removeEventListener('click', this.globalClick);
    }
  }

  // 删除历史
  public onDeleteHistoryClick(event: any, item: ParkingHistoryEntity) {
    this.dataStatisticsHttpService.deleteLookHistoryList(item.parking_history_id).subscribe(res => {
      this.lookParkingHistory = this.lookParkingHistory.filter(history => history.parking_history_id !== item.parking_history_id);
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
    event.stopPropagation();
  }

  // 改变时间日流量
  public onDayFlowStartDateChange(event: any) {
    if (event && this.endDate) {
      if ((this.endDate.getTime() - this.startDate.getTime()) / 86400000 > 29) {
        this.globalService.promptBox.open('选取值范围不能超过30天！');
        return;
      } else if ((this.endDate.getTime() - this.startDate.getTime()) < 0) {
        this.globalService.promptBox.open('开始时间不能大于结束时间！');
        return;
      }
      this.startDate = new Date(event);
      this.onSelectTableItem(this.anyParkingData, 1);
    }
  }

  public onDayFlowEndDateChange(event: any) {
    if (event && this.startDate) {
      if ((this.endDate.getTime() - this.startDate.getTime()) / 86400000 > 29) {
        this.globalService.promptBox.open('选取值范围不能超过30天！');
        return;
      } else if ((this.endDate.getTime() - this.startDate.getTime()) < 0) {
        this.globalService.promptBox.open('开始时间不能大于结束时间！');
        return;
      }
      this.endDate = new Date(event);
      this.onSelectTableItem(this.anyParkingData, 1);
    }
  }

  // 改变时间 周转率
  public onDayTurnoverStartDateChange(event: any) {
    if (event && this.turnoverEndDate) {
      if ((this.turnoverEndDate.getTime() - this.turnoverStartDate.getTime()) / 86400000 > 29) {
        this.globalService.promptBox.open('选取值范围不能超过30天！');
        return;
      } else if ((this.turnoverEndDate.getTime() - this.turnoverStartDate.getTime()) < 0) {
        this.globalService.promptBox.open('开始时间不能大于结束时间！');
        return;
      }
      this.turnoverStartDate = new Date(event);
      this.onSelectTableItem(this.anyParkingData, 1);
    }
  }

  public onDayTurnoverEndDateChange(event: any) {
    if (event && this.turnoverStartDate) {
      if ((this.turnoverEndDate.getTime() - this.turnoverStartDate.getTime()) / 86400000 > 30) {
        this.globalService.promptBox.open('选取值范围不能超过30天！');
        return;
      } else if ((this.turnoverEndDate.getTime() - this.turnoverStartDate.getTime()) < 0) {
        this.globalService.promptBox.open('开始时间不能大于结束时间！');
        return;
      }
      this.turnoverEndDate = new Date(event);
      this.onSelectTableItem(this.anyParkingData, 1);
    }
  }

  // 左侧列表显示或隐藏
  public onTranslationChangeClick() {
    this.isOpen = !this.isOpen;
    timer(350).subscribe(() => {
      this.generateLineChart();
      this.generateTurnoverLineChart();
      this.entryFlowByHourCpt.generateEChart();
      this.exitFlowByHourCpt.generateEChart();
    });
  }

  // 点击查看历史每一条数据 右侧显示
  public onLookHistoryDetailClick(event: any) {
    this.onSelectTableItem(event, 1);
  }

  // 日流量统计select  event 0日 1周 2月
  public onFlowSelectChange(event: any) {
    if (!this.startDate || !this.endDate) {
      this.globalService.promptBox.open('请输入正确的时间！');
      return;
    }
    this.currentCycle = parseInt(event.target.value, null);
    if (this.currentCycle === 0) {
      this.flowXAxisName = '时间/天';
    } else if (this.currentCycle === 1) {
      this.flowXAxisName = '时间/周';
    } else {
      this.flowXAxisName = '时间/月';
    }
    this.onSelectTableItem(this.anyParkingData, 1);

  }
  // 周转率统计select
  public onTurnoverSelectChange(event: any) {
    if (!this.turnoverStartDate || !this.turnoverEndDate) {
      this.globalService.promptBox.open('请输入正确的时间！');
      return;
    }
    this.turnoverCurrentCycle = parseInt(event.target.value, null);
    if (this.turnoverCurrentCycle === 0) {
      this.turnoverXAxisName = '时间/天';
    } else if (this.turnoverCurrentCycle === 1) {
      this.turnoverXAxisName = '时间/周';
    } else if (this.turnoverCurrentCycle === 2) {
      this.turnoverXAxisName = '时间/月';
    }
    this.onSelectTableItem(this.anyParkingData, 1);
  }

  public onOpenExportModal() {
    this.exportModal.open();
  }

  // 日流量开始时间禁用
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

  // 日流量结束时间禁用
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

  // 周转率开始时间禁用
  public disabledTurnoverStartDate = (startValue: Date): boolean => {
    if (differenceInCalendarDays(startValue, new Date()) > 0) {
      return true;
    } else if (!startValue || !this.turnoverEndDate) {
      return false;
    } else if (new Date(startValue).setHours(0, 0, 0, 0) > new Date(this.turnoverEndDate).setHours(0, 0, 0, 0)) {
      return true;
    } else {
      return false;
    }
  }

  // 周转率结束时间禁用
  public disabledTurnoverEndDate = (endValue: Date): boolean => {
    if (differenceInCalendarDays(endValue, new Date()) > 0) {
      return true;
    } else if (!endValue || !this.turnoverStartDate) {
      return false;
    } else if (new Date(endValue).setHours(0, 0, 0, 0) < new Date(this.turnoverStartDate).setHours(0, 0, 0, 0)) {
      return true;
    } else {
      return false;
    }
  }

}
