import {Component, ViewChild, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {GlobalService} from '../../../../core/global.service';
import {
  MapItem, MapType,
  ZMapSelectPointComponent
} from '../../../../share/components/z-map-select-point/z-map-select-point.component';
import {ParkingsDataService} from '../../parkings-data.service';
import {ParkingsHttpService} from '../../parkings-http.service';
import {ParkingEntity} from '../../parkings.model';

@Component({
  selector: 'app-basic-info',
  templateUrl: './basic-info.component.html',
  styleUrls: ['../../parkings.component.css', '../parkings-edit.component.css'],
  providers: [ParkingsDataService]
})

export class EditBasicInfoComponent implements OnInit {

  public parkingsInfo: ParkingEntity = new ParkingEntity();

  public mapObj: MapItem = {
    point: [],
    type: MapType.view,
    address: '',
    hasDetailedAddress: false,
    cityCode: ''
  };

  public select_region_id: string;

  public parkingsType: Array<string> = ['1', '2', '3', '6', '8', '9', '10'];

  public parking_id: string;

  public isDisableEdit = true; // 是否禁用修改

  @ViewChild(ZMapSelectPointComponent) public zMapSelectPointComponent: ZMapSelectPointComponent;

  constructor(private route: ActivatedRoute,
              private parkingsHttpService: ParkingsHttpService,
              private globalService: GlobalService) {
    this.route.parent.params.subscribe(params => {
      this.parking_id = params['parking_id'];
    });
  }

  public ngOnInit() {
    this.requestParkingByIdData();
  }

  // 查找指定停车场信息
  public requestParkingByIdData() {
    this.isDisableEdit = true;
    this.select_region_id = '';
    $('input[type=checkbox]').prop('checked', false);
    this.parkingsHttpService.requestParkingsByIdData(this.parking_id).subscribe(data => {
      this.parkingsInfo = data;
      this.select_region_id = this.parkingsInfo.region_id;
    }, err => {
      if (!this.globalService.httpErrorProcess(err)) {
        if (err.status === 404) {
          this.globalService.promptBox.open('请求地址错误！');
          return;
        }
      }
    });
  }

  // 打开地图组件
  public openMapModal() {
    this.parkingsInfo.address = this.parkingsInfo.address ? this.parkingsInfo.address : '';
    if (this.parkingsInfo.address) {
      this.mapObj.hasDetailedAddress = true;
    }
    if (this.parkingsInfo.lon && this.parkingsInfo.lat) {
      this.mapObj.point.push(Number(this.parkingsInfo.lon));
      this.mapObj.point.push(Number(this.parkingsInfo.lat));
    }
    this.mapObj.address = this.parkingsInfo.province + this.parkingsInfo.city + this.parkingsInfo.district + this.parkingsInfo.address;
    this.mapObj.cityCode = this.parkingsInfo.region_id;
    this.zMapSelectPointComponent.openMap();
  }

  /* 生成状态信息 */
  public generateStatus(item: ParkingEntity): string {
    switch (Number(item.status)) {
      case 1:
        return '运营中';
      case 2:
        return '未运营';
      case 3:
        return '待运营';
    }
    return '未知';
  }
}
