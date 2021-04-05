import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subject, Subscription} from "rxjs";
import {GlobalService} from "../../../../core/global.service";
import {debounceTime} from "rxjs/operators";
import {MonitorEntity, MonitorInfoService} from "./monitor-info.service";
import {ActivatedRoute} from "@angular/router";
import {HttpErrorEntity} from "../../../../core/http.service";
import {ParkingsDataService} from "../../parkings-data.service";
import {ParkingsHttpService} from "../../parkings-http.service";

const PageSize = 15;

@Component({
  selector: 'app-monitor-info',
  templateUrl: './monitor-info.component.html',
  styleUrls: ['../../parkings.component.css', '../parkings-edit.component.css', './monitor-info.component.less'],
  providers: [MonitorInfoService, ParkingsDataService]
})
export class MonitorInfoComponent implements OnInit, OnDestroy {
  public dataList: Array<MonitorEntity> = [];
  public pageIndex = 1; // 当前页码
  @ViewChild('cameraModal') public cameraModal: ElementRef;
  public searchText$ = new Subject<any>();
  public selectedMonitor: MonitorEntity = new MonitorEntity();
  public parkingName = '';
  public isLoading = false;
  private linkUrl: string; // 分页URL
  private continueRequestSubscription: Subscription; // linkUrl分页取数
  private parking_id: string;

  // 获取当前记录总页数
  private get pageCount(): number {
    if (this.dataList.length % PageSize === 0) {
      return this.dataList.length / PageSize;
    }
    return this.dataList.length / PageSize + 1;
  }

  constructor(private globalService: GlobalService,
              private route: ActivatedRoute,
              private parkingsHttpService: ParkingsHttpService,
              private monitorInfoService: MonitorInfoService) {
    this.route.parent.params.subscribe(params => {
      this.parking_id = params['parking_id'];
    });
  }

  public ngOnInit() {
    this.requestParkingByIdData();
    this.generateMonitorList();
  }

  public ngOnDestroy() {
    this.searchText$ && this.searchText$.unsubscribe();
    this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
  }

  /**
   * 保存配置
   */
  public onCameraFormSubmit() {
    this.monitorInfoService.requestAddOrUpdateMonitor(this.selectedMonitor, this.parking_id, this.selectedMonitor.camera_config_id).subscribe(() => {
      const message = this.selectedMonitor.camera_config_id ? '编辑成功' : '添加成功';
      this.globalService.promptBox.open(message, () => {
        $(this.cameraModal.nativeElement).modal('hide');
        this.searchText$.next();
      });
    }, err => {
      if (!this.globalService.httpErrorProcess(err)) {
        if (err.status === 422) {
          const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);

          for (const content of error.errors) {
            if (content.resource === 'camera_config' && content.code === 'already_exists') {
              this.globalService.promptBox.open('该监控已存在，请重新输入');
              return;
            } else {
              this.globalService.promptBox.open('参数错误或无效，请重试！');
            }
          }
        }
      }
    })
  }

  /**
   * 创建或者编辑
   * @param dataItem
   */
  public onAddItemClick(dataItem?: MonitorEntity) {
    if (dataItem) {
      this.selectedMonitor = dataItem.clone();
    } else {
      this.selectedMonitor = new MonitorEntity();
    }
    $(this.cameraModal.nativeElement).modal('show');
  }

  // 删除
  public onDeleteItemClick(dataItem: MonitorEntity) {
    this.globalService.confirmationBox.open('确认删除该监控，此操作不可恢复！', () => {
      this.globalService.confirmationBox.close();
      this.monitorInfoService.requestDeleteMonitorData(this.parking_id, dataItem.camera_config_id).subscribe(() => {
        this.searchText$.next();
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
    }, '删除');
  }

  // 分页
  public onNZPageIndexChange(pageIndex: number): void {
    this.pageIndex = pageIndex;
    if (pageIndex + 1 >= this.pageCount && this.linkUrl) {
      // 当存在linkUrl并且快到最后一页了请求数据
      this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
      this.continueRequestSubscription = this.monitorInfoService.continueMonitorList(this.linkUrl).subscribe(res => {
        this.dataList = this.dataList.concat(res.results);
        this.linkUrl = res.linkUrl;
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
    }
  }

  // 初始化列表
  private generateMonitorList(): void {
    this.isLoading = true;
    // 定义查询延迟时间
    this.searchText$.pipe(debounceTime(500)).subscribe(() => {
      this.requestMonitorListData();
    });
    this.searchText$.next();
  }

  /**获取某个停车场下的监控摄像头配置 */
  private requestMonitorListData() {
    this.monitorInfoService.requestMonitorList(this.parking_id).subscribe(res => {
      this.pageIndex = 1; // 重置页码为第一页
      this.dataList = res.results;
      this.linkUrl = res.linkUrl;
      this.isLoading = false;
    }, err => {
      this.isLoading = false;
      this.pageIndex = 1;
      this.globalService.httpErrorProcess(err);
    });
  }

  // 查找指定停车场信息
  private requestParkingByIdData() {
    this.parkingsHttpService.requestParkingsByIdData(this.parking_id).subscribe(data => {
      this.parkingName = data.parking_name;
    }, err => {
      if (!this.globalService.httpErrorProcess(err)) {
        if (err.status === 404) {
          this.globalService.promptBox.open('请求地址错误！');
          return;
        }
      }
    });
  }
}
