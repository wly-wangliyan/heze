import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { GlobalService } from '../../../../core/global.service';
import { GlobalConst } from '../../../../share/global-const';
import { DataStatisticsHttpService } from '../../../data-statistics/data-statistics-http.service';
import { SearchSelectorService } from '../../../../share/components/search-selector/search-selector.service';
import { isNullOrUndefined } from 'util';

const userTypeObj = {
  tmp: '临时',
  white: '白名单',
  timely: '包时',
  count: '包次',
  visitor: '访客',
  reservation: '预约',
  space_sharing: '共享',
  other: '其他',
};

@Component({
  selector: 'app-chart-user-type-ratio',
  templateUrl: './chart-user-type-ratio.component.html',
  styleUrls: ['./chart-user-type-ratio.component.css', '../real-time-info.component.less']
})
export class ChartUserTypeRatioComponent implements OnInit, OnDestroy {

  public chartOptions: any;
  public chartInstance: any;

  public userTypeDataList: Array<UserTypeDataItem>;
  private percentObj: any; // 自己计算的百分比对象

  private dataSubscription: Subscription;
  private searchSubscription: Subscription;
  private legendList: Array<LengenItem> = []; // 图例列表

  constructor(
    private dataStatisticsHttpService: DataStatisticsHttpService,
    private searchSelectorService: SearchSelectorService,
    private globalService: GlobalService) {
  }

  public ngOnInit() {
    this.searchSubscription = this.searchSelectorService.selectStateChanged.subscribe(state => {
      this.requestAllData(state.currentValue);
    });
  }

  public ngOnDestroy() {
    this.searchSubscription && this.searchSubscription.unsubscribe();
    this.dataSubscription && this.dataSubscription.unsubscribe();
  }

  public onChartInit(chartInstance: any) {
    this.chartInstance = chartInstance;
  }

  private requestAllData(regionID: string) {
    this.dataSubscription && this.dataSubscription.unsubscribe();
    this.dataSubscription = this.dataStatisticsHttpService.requestRegionStatisticsUserTypeList(regionID).subscribe(
      result => {
        const userTypeDataList = [];
        for (const item in result) {
          if (result.hasOwnProperty(item)) {
            if (userTypeObj[item]) {
              userTypeDataList.push(new UserTypeDataItem(userTypeObj[item], item, result[item]));
            }
          }
        }
        userTypeDataList.reverse();
        this.percentObj = this.caculatePercent(userTypeDataList);
        this.userTypeDataList = userTypeDataList;
        this.sort();
        this.userTypeDataList.reverse();
        this.generateChart();
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
  }

  private generateChart() {
    this.legendList = [];
    this.userTypeDataList.forEach(userType => {
      this.legendList.push(new LengenItem(userType.name));
    });
    timer(0).subscribe(() => {
      this.chartOptions = {
        tooltip: {
          trigger: 'item',
          formatter: (params: any) => {
            return params.name + '用户 : ' + params.value + ' (' + this.percentObj[params.data.name] + '%)';
          }
        },
        legend: {
          data: this.legendList,
          orient: 'vertical',
          right: 70,
          top: 35,
          padding: [0, 10, 0, 0],
          itemWidth: 8,
          itemHeight: 8,
          formatter: (name: string) => {
            return this.percentObj[name] + '% ' + name;
          }
        },
        series: [
          {
            name: '用户类型比例',
            type: 'pie',
            radius: ['35%', '60%'],
            center: ['30%', '45%'],
            data: this.userTypeDataList,
            label: {
              normal: {
                show: false,
                formatter: (params: any) => {
                  return params.name + this.percentObj[params.data.english_name] + '%';
                }
              }
            },
            labelLine: {
              show: false,
              length: 5,
              length2: 30
            }
          }
        ],
        color: ['#ff54fa', '#b951ff', '#7845ff', '#5348ff', '#4773ff', '#46a5ff', '#51cfff', '#6df3ff']
      };
    });
  }

  private caculatePercent(userTypeDataList: Array<UserTypeDataItem>) {
    let totalUserTypeValue = 0;  // 数量总值
    let maxUserTypeItem = null; // 最大值项
    let totalPercent = 0; // 除最大项外的累计百分比
    const percentObj = {};
    // 计算总值 和找出最大值
    userTypeDataList.forEach(userTypeItem => {
      totalUserTypeValue += userTypeItem.value;
      if (maxUserTypeItem === null || maxUserTypeItem === undefined) {
        maxUserTypeItem = userTypeItem;
      } else {
        if (userTypeItem.value > maxUserTypeItem.value) {
          maxUserTypeItem = userTypeItem;
        }
      }
    });
    // 最大值为0时全部为0
    if (maxUserTypeItem.value === 0) {
      userTypeDataList.forEach(userItem => {
        percentObj[userItem.name] = 0;
      });
    } else {
      userTypeDataList.forEach(userItem => {
        if (userItem.english_name !== maxUserTypeItem.english_name) {
          // 计算除最大型以外的百分比
          const _percent = userItem.value / totalUserTypeValue * 100;
          let percent = 0;
          if (userItem.value > 0) {
            percent = _percent < 0.001 ? 0.001 : Math.round(_percent * 1000) / 1000;
          }
          totalPercent += percent;
          percentObj[userItem.name] = percent;
        }
      });
      percentObj[maxUserTypeItem.name] = Math.round((100 - totalPercent) * 1000) / 1000;
    }

    for (const obj in percentObj) {
      if (percentObj.hasOwnProperty(obj)) {
        percentObj[obj] = percentObj[obj].toFixed(3);
      }
    }
    return percentObj;
  }

  // 排序
  private sort() {
    for (let j = 0; j < this.userTypeDataList.length - 1; j++) {
      // 两两比较，如果前一个比后一个大，则交换位置。
      for (let i = 0; i < this.userTypeDataList.length - 1 - j; i++) {
        if (this.userTypeDataList[i].value > this.userTypeDataList[i + 1].value) {
          const temp = this.userTypeDataList[i];
          this.userTypeDataList[i] = this.userTypeDataList[i + 1];
          this.userTypeDataList[i + 1] = temp;
        }
      }
    }
  }

}

export class UserTypeDataItem {
  public name: string;
  public english_name: string;
  public value: number;

  constructor(name: string, english_name: string, value: number) {
    this.name = name;
    this.english_name = english_name;
    this.value = value;
  }
}

export class LengenItem {
  public name: string;
  public icon = 'rect';

  constructor(name: string) {
    this.name = name;
  }
}
