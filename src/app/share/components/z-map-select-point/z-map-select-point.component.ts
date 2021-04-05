import {Component, Input, Output, EventEmitter, ViewChild, ElementRef} from '@angular/core';
import {timer} from "rxjs";

declare var AMap: any;

/**
 * 调用方法：openMap打开地图
 * 传入参数：mapObj:MapItem见MapItem
 * 获取地图信息：selectedMarkerInfo
 */
@Component({
  selector: 'app-z-map-select-point',
  templateUrl: './z-map-select-point.component.html',
  styleUrls: ['./z-map-select-point.component.css']
})
export class ZMapSelectPointComponent {

  public map: any;

  public selectedMarker: MarkerItem = new MarkerItem();

  public defaultPoint = [121.341969401042, 30.7419911024306]; // 默认坐标点

  @Input()
  public mapObj: MapItem = new MapItem();

  @Output('selectedMarkerInfo')
  public selectedMarkerInfo = new EventEmitter();

  @ViewChild('mapModal') private mapModal: ElementRef;

  /**
   * 打开地图
   */
  public openMap() {
    this.InitMap();
    timer(0).subscribe(() => {
      $(this.mapModal.nativeElement).modal();
    });
  }

  /**
   * 关闭地图
   */
  public closeMap() {
    $(this.mapModal.nativeElement).modal('hide');
  }

  /**
   * 初始化地图
   * @constructor
   */
  private InitMap() {
    try {
      if (AMap) {
        this.map = new AMap.Map('container', {
          resizeEnable: true,
          dragEnable: true,
          keyboardEnable: true,
          doubleClickZoom: false,
          zoom: 11,
          isHotspot: true,
        });
        // 加载插件
        this.map.plugin(['AMap.Scale', 'AMap.Autocomplete', 'AMap.Geocoder'],
          () => {
            this.map.addControl(new AMap.Scale()); // 比例尺
            $('.amap-scale-line').children().css('border', 'none');
            // 设置地图中心点 ，确认默认点坐标
            if (this.mapObj.point && this.mapObj.point.length > 0) {
              this.map.setCenter(new AMap.LngLat(this.mapObj.point[0], this.mapObj.point[1]));
              this.showMarkerAndInfoWindow(this.mapObj.point);
            } else {
              this.getGeocodesPosition(result => {
                if (this.mapObj.hasDetailedAddress) {
                  const point = [result.location.lng, result.location.lat];
                } else {
                  this.map.setZoomAndCenter(13, new AMap.LngLat(result.location.lng, result.location.lat));
                }
                this.showMarkerAndInfoWindow(result.location);
              });
            }
          });
        AMapUI.loadUI(['control/BasicControl'], (BasicControl) => {
          // 缩放控件
          const zoomCtrl = new BasicControl.Zoom({
            position: {
              bottom: '20px',
              right: '20px',
            },
            theme: 'amap-size',
            showZoomNum: false
          });
          this.map.addControl(zoomCtrl);
        });

        this.map.on('complete', () => {
          $('.amap-logo').attr('href', 'javascript:void(0);');

          // 添加点击事件
          this.map.on('click', e => {
            if (this.mapObj.type !== MapType.view) {
              this.showMarkerAndInfoWindow(e.lnglat);
            }
          });
        });
      }
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * 显示点标记和信息窗口
   * @param location
   */
  private showMarkerAndInfoWindow(location: any) {
    this.selectedMarker.point = location;
    this.addMarker(this.selectedMarker.point);
    this.getPosition(() => {
      this.setInfoWindow();
    });
  }

  /**
   * 添加点标记
   */
  private addMarker(point: Array<number>) {
    this.map.clearMap();
    this.selectedMarker.initMarker(point);
    this.selectedMarker.marker.setMap(this.map);
  }

  /**
   * 逆向获取地理编码
   * @param callback
   */
  private getPosition(callback) {
    const geocoder = new AMap.Geocoder({
      radius: 1000,
      extensions: 'all'
    });
    this.selectedMarker.geocoder = geocoder;
    geocoder.getAddress(this.selectedMarker.point, (status, result) => {
      if (status === 'complete' && result.info === 'OK') {
        this.selectedMarker.regeocode = result.regeocode;
        callback();
      }
    });
  }

  /**
   * 正向获取地理编码
   */
  private getGeocodesPosition(callback: any) {
    const geocoder = new AMap.Geocoder({
      city: this.mapObj.cityCode,
      radius: 1000,
    });
    // 地理编码,返回地理编码结果
    geocoder.getLocation(this.mapObj.address, function (status, result) {
      if (status === 'complete' && result.info === 'OK') {
        callback(result.geocodes[0]);
      }
    });
  }

  /**
   * 添加窗体结构
   */
  private setInfoWindow() {
    const infoWindow = new AMap.InfoWindow({
      isCustom: true,
      offset: new AMap.Pixel(130, 5)
    });
    //  html结构
    const infoWindowStr =
      `<div style="position: relative;padding-left:26px;">
      <div style="
          width: 200px;
          padding: 5px;
          border: 1px solid #ccc;
          background: #fafafa;
          border-radius: 4px;">
          <span style="
          position: absolute;
          left: 0;
          bottom: 5px;
          width: 27px;
          height: 25px;
          "></span>
      <label style="margin:0">${this.selectedMarker.regeocode.formattedAddress}</label>
      </div></div>`;
    infoWindow.setContent(infoWindowStr);
    infoWindow.open(this.map, this.selectedMarker.marker.getPosition());
    this.map.setFitView();
  }

  /**
   * 保存相关坐标信息
   */
  public saveMarker() {
    this.selectedMarkerInfo.emit({selectedMarker: this.selectedMarker});
    this.closeMap();
  }
}

export class MapItem {
  public point?: Array<number>; // 传进来的坐标
  public type: MapType = 0; // 操作地图类型 查看编辑
  public address? = '';
  public hasDetailedAddress? = false; // 是否填写了详细地址
  public cityCode? = ''; // 默认沈阳

  constructor(type?: MapType, point?: Array<number>, address?: string, hasDetailedAddress?: boolean, cityCode?: string) {
    if (type) {
      this.type = type;
    }
    if (point) {
      this.point = point;
    }
    if (address) {
      this.address = address;
    }
    if (hasDetailedAddress) {
      this.hasDetailedAddress = true;
    }
    if (cityCode) {
      this.cityCode = cityCode;
    }
  }

}

export enum MapType {
  view,
  edit
}

/**
 * 点标记所有信息
 */
export class MarkerItem {
  public marker: any; // 点标记
  public geocoder: any; // 地理编码
  public point: any; // 坐标
  public regeocode: any; // 逆向编码信息

  public initMarker(point: Array<number>) {
    this.marker = new AMap.Marker({
      icon: '/assets/images/map/marker.png',
      position: point,
      offset: new AMap.Pixel(-18, -34)
    });
  }
}
