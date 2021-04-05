import {
  Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, Output, EventEmitter, OnDestroy
} from '@angular/core';
import { DataStatisticsHttpService } from '../../../../data-statistics/data-statistics-http.service';
import { SearchAdapter, SearchAssistant } from '../../../../../share/search-assistant';
import { ParkingDynamicsInfoParams, ParkingDynamicsInfoEntity } from '../../../../data-statistics/data-statistics.model';
import { GlobalService } from '../../../../../core/global.service';
import { RegionEntity } from '../../../../../core/region-http.service';
import { Observable, fromEvent } from 'rxjs';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';
import { KeyboardHelper } from '../../../../../../utils/keyboard-helper';
import { debounceTime, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-parking-select',
  templateUrl: './parking-select.component.html',
  styleUrls: ['./parking-select.component.css'],
  animations: [trigger('expandListAnimation', [
    state('expand', style({ height: '*' })),
    state('shrink', style({ height: 0 })),
    state('normal', style({ height: '*' })),
    transition('*=>shrink', animate('300ms ease-in', style({ height: 0 }))),
    transition('*=>expand', animate('300ms ease-out', style({ height: '*' }))),
    transition('*=>normal', animate(0, style({ height: '*' })))
  ]), trigger('expandBtnAnimation', [
    state('expand', style({ opacity: 0 })),
    state('shrink', style({ opacity: 1 })),
    state('normal', style({ opacity: 0 })),
    transition('*=>shrink', animate('200ms 300ms ease-in', style({ opacity: 1 }))),
    transition('*=>expand', animate('100ms ease-out', style({ opacity: 0 }))),
    transition('*=>normal', animate(0, style({ opacity: 0 })))
  ])]
})
export class ParkingSelectComponent implements OnInit, AfterViewInit, OnDestroy, SearchAdapter {

  private searchParams: ParkingDynamicsInfoParams; // 列表搜索
  private associationParams: ParkingDynamicsInfoParams; // 联想搜索

  public keywords = '';

  public dataList: Array<ParkingDynamicsInfoEntity> = [];
  public associationList: Array<ParkingDynamicsInfoEntity> = [];

  private _region: RegionEntity;
  @Input() set region(region: RegionEntity) {
    if (this._region && this._region !== region) {
      // 当切换查询条件时,需要清空数据
      this.keywords = '';
      this.dataList = [];
      this.associationList = [];
      this.showNoDataMessage = false;
    }
    this._region = region;
  }

  @Output() public selectParkingChanged: EventEmitter<ParkingDynamicsInfoEntity> = new EventEmitter<ParkingDynamicsInfoEntity>();

  @Output() public activated: EventEmitter<any> = new EventEmitter<any>();

  public searchAssistant: SearchAssistant;

  public animationState: 'expand' | 'shrink' | 'normal' = 'normal';

  public showNoDataMessage = false; // 未搜索到结果信息是否显示

  @ViewChild('inputControl', { static: false }) public inputControl: ElementRef;

  constructor(private globalService: GlobalService, private dataStatisticsHttpService: DataStatisticsHttpService) {
  }

  public ngOnInit() {
    this.searchAssistant = new SearchAssistant(this, 10);
    this.searchParams = new ParkingDynamicsInfoParams();
    this.searchParams.page_num = 1;
    this.searchParams.page_size = 30;
    this.associationParams = new ParkingDynamicsInfoParams();
    this.associationParams.page_num = 1;
    this.associationParams.page_size = 10;
  }

  public ngOnDestroy() {
    KeyboardHelper.Instance.continue();
  }

  public ngAfterViewInit() {
    // 处理联想搜索
    fromEvent(this.inputControl.nativeElement, 'keyup')
      .pipe(debounceTime(300),
        switchMap((event: any) => {
          if (event.keyCode === 13) {
            // 当输入回车时进行联想搜索
            this.searchAssistant.submitSearch(true);
          }

          if (event.target.value === '' ||
            event.target.value.trim() === '' ||
            event.keyCode === 13) {
            // 当没有输入时清空联想结果或输入回车则可以交给模糊搜索去处理了
            return Observable.create(observer => observer.next({ results: [] }));
          }
          const associationParams = new ParkingDynamicsInfoParams();
          associationParams.page_num = 1;
          associationParams.page_size = 10;
          associationParams.keywords = event.target.value;
          associationParams.region_id = this._region ? this._region.region_id : '';
          return this.dataStatisticsHttpService.requestParkingDynamicInfoList(associationParams);
        })).subscribe((response: any) => {
          this.associationList = response.results;
          if (response.results.length > 0) {
            // 当联想有结果时关闭一下
            this.showNoDataMessage = false;
            this.dataList = [];
          }
        }, err => {
          this.globalService.httpErrorProcess(err);
        });
  }

  /* SearchAdapter 接口实现 */

  /* 请求检索 */
  public requestSearch(): any {
    this.searchParams.keywords = this.keywords;
    this.searchParams.region_id = this._region ? this._region.region_id : '';
    this.associationList = [];
    this.showNoDataMessage = false;
    return this.dataStatisticsHttpService.requestParkingDynamicInfoList(this.searchParams);
  }

  public continueSearch(url: string): any {
    return this.dataStatisticsHttpService.continueParkingDynamicInfoList(url);
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
    this.animationState = 'normal';

    // 没有数据时显示一下提示信息
    this.showNoDataMessage = results.length === 0;
  }

  /**
   * 点击联想项时触发
   * @param entity 数据信息
   */
  public onAssociationItemClick(entity: ParkingDynamicsInfoEntity) {
    // 当选中一个检索项时清空检索列表
    this.keywords = entity.parking && entity.parking.parking_name;
    this.dataList = [];
    this.associationList = [];
    this.selectParkingChanged.emit(entity);
    this.activated.emit();
  }

  /**
   * 点击搜索结果项时触发
   * @param entity 数据信息
   */
  public onSearchItemClick(entity: ParkingDynamicsInfoEntity) {
    this.associationList = [];
    this.selectParkingChanged.emit(entity);
    this.activated.emit();
  }

  /* 点击展开结果按钮 */
  public onExpandBtnClick() {
    this.animationState = 'expand';
    this.activated.emit();
  }

  /* 点击清空数据按钮 */
  public onClearDataBtnClick() {
    this.associationList = [];
    this.dataList = [];
    this.keywords = '';
    this.animationState = 'normal';
    this.showNoDataMessage = false;
    this.selectParkingChanged.emit(null);
    this.activated.emit();
  }

  /**
   * 当地图发生变化时需要进行同步操作
   */
  public mapSync() {
    this.associationList = [];
    this.animationState = 'shrink';
    this.showNoDataMessage = false;
  }

  public onInputBlur() {
    KeyboardHelper.Instance.continue();
    this.activated.emit();
  }

  public onInputFocus() {
    KeyboardHelper.Instance.pause();
    this.activated.emit();
  }
}
