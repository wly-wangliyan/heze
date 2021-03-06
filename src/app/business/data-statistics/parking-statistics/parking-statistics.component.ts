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
  public isOpen = true; // ??????
  public parkingFlowParams = new ParkingFlowParams();
  public searchAssistant: SearchAssistant;
  public dataList: Array<ParkingEntity> = []; // ???????????????
  public areaTypeList = []; // ???????????????
  public areaType: number;  // ???????????????
  private reginIds = []; // ???????????????
  public idSearchData = true;
  public regionList: Array<RegionItem> = []; // ????????????
  public parkingName: string; // ???????????????
  public total: number; // ????????????/?????????
  public lookHistoryShow = false;
  public currentCycle: any = ComputingCycle.day; // ??????????????????
  public turnoverCurrentCycle: any = ComputingCycle.day; // ???????????????????????????

  public lineChartOptions: any; // ??????????????????
  public turnoverLineChartOptions: any; // ??????????????????

  public regionId = GlobalConst.RegionID; // ??????id
  public parkingId: string; // ?????????id
  public dayEChartX: any; // ?????? echarts X??????
  public dayEChartYOfEnter: any; // ?????? echarts ??????Y??????
  public dayEChartYOfOut: any; // ?????? echarts ??????Y??????
  public turnoverEChartX: any; // ????????? echarts X??????
  public turnoverEChartY: any; // ????????? echarts Y??????
  public lookParkingHistory: Array<ParkingHistoryEntity>; // ?????????????????????
  private anyParkingData: any; // ??????????????????????????????????????????????????????
  public startDate: Date; // ??????????????????????????????
  public endDate: Date; // ??????????????????????????????
  public turnoverStartDate: Date; // ?????????????????????????????????
  public turnoverEndDate: Date; // ?????????????????????????????????
  public flowXAxisName = '??????/???'; // ?????????????????????
  public turnoverXAxisName = '??????/???'; // ?????????????????????

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
    this.areaTypeList.push(new BeautifyRadioItem('1', '??????'));
    this.areaTypeList.push(new BeautifyRadioItem('2', '??????'));
    this.getRegions();
  }

  public ngOnDestroy() {
    // ??????????????????????????????,??????????????????????????????????????????
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

  /* SearchAdapter ???????????? */

  /* ???????????? */
  public requestSearch(): any {
    return this.dataStatisticsHttpService.requestParkingFlowList(this.parkingFlowParams);
  }

  public continueSearch(url: string): any {
    return this.dataStatisticsHttpService.continueParkingFlowList(url);
  }

  /* ?????????????????????????????? */
  public generateAndCheckParamsValid(): boolean {
    return true;
  }

  /* ?????????????????? */
  public searchErrProcess(err: any) {
    this.globalService.httpErrorProcess(err);
  }

  /* ?????????????????? */
  public searchCompleteProcess(results: Array<any>, isFuzzySearch: boolean) {
    if (results.length === 0 && !isFuzzySearch) {
      // ?????????????????????????????????
      this.globalService.promptBox.open('????????????????????????');
    }
    // ????????????????????????
    this.dataList = results;
    // ?????????????????????????????????
    if (results.length > 0) {
      this.idSearchData = true;
      this.onSelectTableItem(results[0], 1);
    } else {
      this.idSearchData = false;
    }
  }

  // ?????????change
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

  // ???????????????
  public onSelectAreaType(event: any) {
    this.parkingFlowParams.area_type = event.value;
  }

  // ????????????
  public onSubmitClick() {
    this.searchAssistant.submitSearch(true);
  }

  // ??????????????????????????????????????????????????? ??????????????????
  // item?????????????????????????????????????????? ??????????????????????????????????????????????????? item=2 ??????  item=1 ??????????????????
  public onSelectTableItem(data: any, item: number) {
    this.anyParkingData = data;
    this.parkingId = data.parking_id;
    if (item === 2) {
      this.dataStatisticsHttpService.createParkingLookHistory(data.parking_id).subscribe(res => {  // create??????
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

  // ???????????? ????????? ??????data????????????  direction???????????????: enter??? exit???;  type?????????????????????: flow?????? turnover?????????
  // time: 0??? 1??? 2???
  private getData(data: any, direction: string, type: string, time: number, callback: any) {
    let startDate: Date;
    let endDate: Date;
    // ???????????????????????????
    if (type === 'flow') {
      startDate = this.startDate;
      endDate = this.endDate;
    } else if (type === 'turnover') {
      startDate = this.turnoverStartDate;
      endDate = this.turnoverEndDate;
    }
    // ????????????????????????
    if (direction === 'enter') {
      if (time === 0) { // ??? ??? ?????????
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

  // ???????????????
  public generateLineChart() {
    timer(1).subscribe(() => {
      const cycle = this.currentCycle;
      // ??????????????????XY???????????????
      const xAxisName = this.flowXAxisName;

      this.lineChartOptions = {
        tooltip: {
          trigger: 'axis',
          axisPointer: { // ??????????????????????????????????????????
            'type': 'line' // ??????????????????????????????'line' | 'shadow'
          },
          confine: true, // ????????? tooltip ?????????????????????????????????
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
          data: ['??????', '??????']
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
          name: '??????/???',
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
            name: '??????',
            type: 'line',
            data: this.dayEChartYOfEnter,
          },
          {
            name: '??????',
            type: 'line',
            data: this.dayEChartYOfOut,
          }
        ]
      };
    });
  }

  // ???????????????
  public generateTurnoverLineChart() {
    timer(1).subscribe(() => {
      const cycle = this.currentCycle;
      // ??????????????????XY???????????????
      const xAxisName = this.turnoverXAxisName;

      this.turnoverLineChartOptions = {
        tooltip: {
          trigger: 'axis',
          axisPointer: { // ??????????????????????????????????????????
            'type': 'line' // ??????????????????????????????'line' | 'shadow'
          },
          confine: true, // ????????? tooltip ?????????????????????????????????
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
          data: ['??????', '??????']
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
          name: '?????????',
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
            name: '?????????',
            type: 'line',
            data: this.turnoverEChartY,
          }
        ]
      };
    });
  }

  // ??????????????????????????? ?????????res???????????????  direction????????????????????????????????? ??????enter ??????exit  type: ???????????????????????????
  private processEchartYDate(results: any, direction: string, type: string) {
    if (type === 'flow') {
      const daysFlowEnter = EChartHelper.GenerateCycleArray(this.startDate, this.endDate, this.currentCycle);
      const daysFlowExit = EChartHelper.GenerateCycleArray(this.startDate, this.endDate, this.currentCycle);
      daysFlowEnter.forEach((XYValue, chartIndex) => {
        for (const index in results) {
          if (results.hasOwnProperty(index)) {
            const keyTime = DateFormatHelper.Format(new Date(results[index].time_point * 1000));
            if (XYValue.XValue === keyTime) {
              // ???????????????????????????,???X????????????????????????????????????????????????
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
              // ???????????????????????????,???X????????????????????????????????????????????????
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

  // ????????????
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

  // ????????????
  public onDeleteHistoryClick(event: any, item: ParkingHistoryEntity) {
    this.dataStatisticsHttpService.deleteLookHistoryList(item.parking_history_id).subscribe(res => {
      this.lookParkingHistory = this.lookParkingHistory.filter(history => history.parking_history_id !== item.parking_history_id);
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
    event.stopPropagation();
  }

  // ?????????????????????
  public onDayFlowStartDateChange(event: any) {
    if (event && this.endDate) {
      if ((this.endDate.getTime() - this.startDate.getTime()) / 86400000 > 29) {
        this.globalService.promptBox.open('???????????????????????????30??????');
        return;
      } else if ((this.endDate.getTime() - this.startDate.getTime()) < 0) {
        this.globalService.promptBox.open('???????????????????????????????????????');
        return;
      }
      this.startDate = new Date(event);
      this.onSelectTableItem(this.anyParkingData, 1);
    }
  }

  public onDayFlowEndDateChange(event: any) {
    if (event && this.startDate) {
      if ((this.endDate.getTime() - this.startDate.getTime()) / 86400000 > 29) {
        this.globalService.promptBox.open('???????????????????????????30??????');
        return;
      } else if ((this.endDate.getTime() - this.startDate.getTime()) < 0) {
        this.globalService.promptBox.open('???????????????????????????????????????');
        return;
      }
      this.endDate = new Date(event);
      this.onSelectTableItem(this.anyParkingData, 1);
    }
  }

  // ???????????? ?????????
  public onDayTurnoverStartDateChange(event: any) {
    if (event && this.turnoverEndDate) {
      if ((this.turnoverEndDate.getTime() - this.turnoverStartDate.getTime()) / 86400000 > 29) {
        this.globalService.promptBox.open('???????????????????????????30??????');
        return;
      } else if ((this.turnoverEndDate.getTime() - this.turnoverStartDate.getTime()) < 0) {
        this.globalService.promptBox.open('???????????????????????????????????????');
        return;
      }
      this.turnoverStartDate = new Date(event);
      this.onSelectTableItem(this.anyParkingData, 1);
    }
  }

  public onDayTurnoverEndDateChange(event: any) {
    if (event && this.turnoverStartDate) {
      if ((this.turnoverEndDate.getTime() - this.turnoverStartDate.getTime()) / 86400000 > 30) {
        this.globalService.promptBox.open('???????????????????????????30??????');
        return;
      } else if ((this.turnoverEndDate.getTime() - this.turnoverStartDate.getTime()) < 0) {
        this.globalService.promptBox.open('???????????????????????????????????????');
        return;
      }
      this.turnoverEndDate = new Date(event);
      this.onSelectTableItem(this.anyParkingData, 1);
    }
  }

  // ???????????????????????????
  public onTranslationChangeClick() {
    this.isOpen = !this.isOpen;
    timer(350).subscribe(() => {
      this.generateLineChart();
      this.generateTurnoverLineChart();
      this.entryFlowByHourCpt.generateEChart();
      this.exitFlowByHourCpt.generateEChart();
    });
  }

  // ????????????????????????????????? ????????????
  public onLookHistoryDetailClick(event: any) {
    this.onSelectTableItem(event, 1);
  }

  // ???????????????select  event 0??? 1??? 2???
  public onFlowSelectChange(event: any) {
    if (!this.startDate || !this.endDate) {
      this.globalService.promptBox.open('???????????????????????????');
      return;
    }
    this.currentCycle = parseInt(event.target.value, null);
    if (this.currentCycle === 0) {
      this.flowXAxisName = '??????/???';
    } else if (this.currentCycle === 1) {
      this.flowXAxisName = '??????/???';
    } else {
      this.flowXAxisName = '??????/???';
    }
    this.onSelectTableItem(this.anyParkingData, 1);

  }
  // ???????????????select
  public onTurnoverSelectChange(event: any) {
    if (!this.turnoverStartDate || !this.turnoverEndDate) {
      this.globalService.promptBox.open('???????????????????????????');
      return;
    }
    this.turnoverCurrentCycle = parseInt(event.target.value, null);
    if (this.turnoverCurrentCycle === 0) {
      this.turnoverXAxisName = '??????/???';
    } else if (this.turnoverCurrentCycle === 1) {
      this.turnoverXAxisName = '??????/???';
    } else if (this.turnoverCurrentCycle === 2) {
      this.turnoverXAxisName = '??????/???';
    }
    this.onSelectTableItem(this.anyParkingData, 1);
  }

  public onOpenExportModal() {
    this.exportModal.open();
  }

  // ???????????????????????????
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

  // ???????????????????????????
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

  // ???????????????????????????
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

  // ???????????????????????????
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
