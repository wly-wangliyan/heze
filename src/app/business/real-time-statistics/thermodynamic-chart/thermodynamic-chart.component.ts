import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { GlobalService } from '../../../core/global.service';
import { GlobalConst } from '../../../share/global-const';
import { RegionEntity } from '../../../core/region-http.service';
import { CitySelectComponent } from './components/city-select/city-select.component';
import { ParkingSelectComponent } from './components/parking-select/parking-select.component';
import {
  ParkingDynamicsInfoEntity,
  ParkingDynamicsInfoHeatMapDataEntity
} from '../../data-statistics/data-statistics.model';
import { DataStatisticsHttpService } from '../../data-statistics/data-statistics-http.service';
import { isNullOrUndefined } from 'util';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-thermodynamic-chart',
  templateUrl: './thermodynamic-chart.component.html',
  styleUrls: ['./thermodynamic-chart.component.css']
})
export class ThermodynamicChartComponent implements OnInit, OnDestroy {

  public currentRegion: RegionEntity; // 当前区域id

  private currentParking: ParkingDynamicsInfoEntity;
  private selectMarkderIndex: number;
  private selectMarker: any; // 选中的中断停车场/新增停车场
  private selectTitleInfoWindow: any; // 用于在地图上弹出一个详细信息展示窗体，地图上只允许同时展示1个信息窗体
  private selectSearchContentInfoWindow: any; // 检索出来的停车场
  private selectMapContentInfoWindow: any; // 地图图层的停车场

  private map: any;
  private heatMap: any;
  private trafficLayer: any; // 实时路况图层

  private mapCompleteEventListener: any;
  private mapMoveStartEventListener: any;
  private mapClickEventListener: any;
  private mapZoomEventListener: any;
  private idSubscription: Subscription;

  public isShowRoadState = false; // 默认不显示路况
  public isShowHeatMap = true; // 默认显示热力图
  public isShowParking = false; // 默认不显示停车场

  public heatMapDataList: Array<ParkingDynamicsInfoHeatMapDataEntity> = [];
  public parkingList: Array<ParkingDynamicsInfoEntity> = [];
  public markerList: Array<any> = [];

  private heatMapRadius = 50; // 热力图中单个点的半径，默认：30，单位：pixel
  private heatMapMax = 200; // 热力图显示的权值

  private zIndex = 102; // 标记停车场隐藏前的气泡大小

  @ViewChild(CitySelectComponent, { static: false }) public citySelectComponent: CitySelectComponent;
  @ViewChild(ParkingSelectComponent, { static: false }) public parkingSelectComponent: ParkingSelectComponent;

  constructor(private globalService: GlobalService, private dataStatisticsHttpService: DataStatisticsHttpService) {
  }

  public ngOnInit() {
    if (!this.isSupportCanvas()) {
      this.globalService.promptBox.open('热力图仅对支持canvas的浏览器适用,您所使用的浏览器不能使用热力图功能,请换个浏览器试试~');
      return;
    }
    this.initMap();
    this.initMapUI();
    this.initMapEvents();
  }

  public ngOnDestroy() {
    this.mapCompleteEventListener && AMap && AMap.event.removeListener(this.mapCompleteEventListener);
    this.mapMoveStartEventListener && AMap && AMap.event.removeListener(this.mapMoveStartEventListener);
    this.mapClickEventListener && AMap && AMap.event.removeListener(this.mapClickEventListener);
    this.mapZoomEventListener && AMap && AMap.event.removeListener(this.mapZoomEventListener);
  }

  /**
   * 初始化地图及组件
   */
  private initMap() {
    // 初始化地图
    this.map = new AMap.Map('map-container', {
      resizeEnable: true,
      center: GlobalConst.RegionCenter,
      zoom: 12,
      zooms: [12, 18], // 式样:比例尺不能高于2公里
    });

    // 初始化地图插件
    this.map.plugin(['AMap.Heatmap', 'AMap.Scale'], () => {

      // document.getElementsByClassName('amap-logo')[0].setAttribute('href', 'javascript:void(0)');

      // 详细的参数,可以查看heatmap.js的文档 http://www.patrick-wied.at/static/heatmapjs/docs.html
      // 参数说明如下:
      /* visible 热力图是否显示,默认为true
       * opacity 热力图的透明度,分别对应heatmap.js的minOpacity和maxOpacity
       * radius 势力图的每个点的半径大小
       * gradient  {JSON} 热力图的渐变区间 . gradient如下所示
       *	{
       .2:'rgb(0, 255, 255)',
       .5:'rgb(0, 110, 255)',
       .8:'rgb(100, 0, 255)'
       }
       其中 key 表示插值的位置, 0-1
       value 为颜色值
       */
      // 初始化heatmap对象
      this.heatMap = new AMap.Heatmap(this.map, {
        radius: this.heatMapRadius, // 给定半径
        opacity: [0, 0.8]
        /*,gradient:{
         0.5: 'blue',
         0.65: 'rgb(117,211,248)',
         0.7: 'rgb(0, 255, 0)',
         0.9: '#ffea00',
         1.0: 'red'
         }*/
      });
      // 设置数据集：该数据为北京部分“公园”数据
      // this.heatMap.setDataSet({
      //   data: heatmapData,
      //   max: 100
      // });
      this.map.addControl(new AMap.Scale());
    });
  }

  /**
   * 初始化基础UI
   */
  private initMapUI() {

    // 实时路况图层
    this.trafficLayer = new AMap.TileLayer.Traffic({
      zIndex: 10
    });
    this.trafficLayer.setMap(this.map);
    if (this.isShowRoadState) {
      this.trafficLayer.show();
    } else {
      this.trafficLayer.hide();
    }

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
  }

  /**
   * 初始化地图事件
   */
  private initMapEvents() {
    // 地图图块加载完成后触发事件
    this.mapCompleteEventListener = AMap.event.addListener(this.map, 'complete', () => {
      // 地图加载完成后设置地图的边界范围,设置边界时选中居中有点问题
      // const southWest = new AMap.LngLat(GlobalConst.RegionBoundSouthWest[0], GlobalConst.RegionBoundSouthWest[1]);
      // const northEast = new AMap.LngLat(GlobalConst.RegionBoundNorthEast[0], GlobalConst.RegionBoundNorthEast[1]);
      // this.map.setLimitBounds(new AMap.Bounds(southWest, northEast));
    });

    // 地图平移时触发事件
    this.mapMoveStartEventListener = AMap.event.addListener(this.map, 'movestart', () => {
      // this.mapStatusChanged();
    });
    this.mapClickEventListener = AMap.event.addListener(this.map, 'click', () => {
      // this.map.clearInfoWindow();
      this.selectMapContentInfoWindow && this.selectMapContentInfoWindow.close();
      this.selectSearchContentInfoWindow && this.selectSearchContentInfoWindow.close();
      this.refreshMarkerStatus();
      if (this.selectMarker) {
        this.refreshMarkerActive(this.selectMarker, false);
      }
      this.mapStatusChanged();
    });
    this.mapZoomEventListener = AMap.event.addListener(this.map, 'zoomstart', () => {
      // this.mapStatusChanged();
    });
  }

  /* 地图状态变更时进行同步 */
  private mapStatusChanged() {
    this.citySelectComponent && this.citySelectComponent.mapSync();
    this.parkingSelectComponent && this.parkingSelectComponent.mapSync();
  }

  /* 判断浏览区是否支持canvas */
  private isSupportCanvas(): boolean {
    const elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
  }

  /* 城市信息初始化完成 */
  public onInitRegionComplete(region: RegionEntity) {
    this.currentRegion = region;
    this.requestAllData(region.region_id);
  }

  /* 切换选择城市 */
  public onCitySelected(region: RegionEntity) {
    this.currentRegion = region;
    // 清空数据,如果已经存在先从地图中移除
    this.selectMarker && this.map && this.map.remove(this.selectMarker);
    this.selectMarker = null;
    this.currentParking = null;
    const lonlat = region.center.split(',');

    // 清除地图上的信息窗体
    this.map && this.map.clearInfoWindow();
    this.map && this.map.setZoom(12);
    this.map && this.map.setCenter(new AMap.LngLat(lonlat[0], lonlat[1]));
    this.requestAllData(region.region_id);
  }

  /* 搜索结果中切换选中的停车场 */
  public onSelectParkingChanged(parkingInfo: ParkingDynamicsInfoEntity) {
    if (isNullOrUndefined(parkingInfo)) {
      // 为空说明清空数据了
      // 如果已经存在检索信息窗体先从地图中移除
      this.selectSearchContentInfoWindow && this.selectSearchContentInfoWindow.close();
      this.selectSearchContentInfoWindow = null;
      let selectMarkerInfo = null;
      if (this.selectMarker) {
        selectMarkerInfo = this.selectMarker.getExtData();
        if (this.selectMapContentInfoWindow) {
          if (Number(selectMarkerInfo.parking.lat) === this.selectMapContentInfoWindow.getPosition().lat
            && Number(selectMarkerInfo.parking.lon) === this.selectMapContentInfoWindow.getPosition().lng) {
            this.selectMapContentInfoWindow.close();
            this.refreshMarkerStatus();
          }
        }
        this.selectMarker && this.map && this.map.remove(this.selectMarker);
        this.selectMarker = null;
        this.currentParking = null;
      }
      return;
    }

    this.currentParking = parkingInfo;
    const position = new AMap.LngLat(Number(parkingInfo.parking.lon), Number(parkingInfo.parking.lat));

    // 地图图层查找匹配marker
    let matchedMarker = null;
    let isRemove = true; // 标记selectMarker是否可以移除
    this.markerList.forEach(markerItem => {
      if (markerItem.getExtData().parking.parking_id === parkingInfo.parking.parking_id) {
        matchedMarker = markerItem;
      }

      if (this.selectMarker && markerItem.getExtData().parking.parking_id === this.selectMarker.getExtData().parking.parking_id) {
        isRemove = false;
      }
    });
    // 缩小所有地图图层marker
    this.refreshMarkerStatus();

    if (isRemove || !this.isShowParking) {
      this.selectMarker && this.map && this.map.remove(this.selectMarker);
    }

    // 如果显示了停车场，检查是否匹配到对应marker,如果匹配到 ，直接放大marker,如果没有匹配到(中断停车场)，重新生成一个marker
    if (this.isShowParking && matchedMarker) {
      // 缩小放大的气泡
      if (this.selectMarker) {
        this.refreshMarkerActive(this.selectMarker, false);
      }
      matchedMarker.setContent(this.generateMarkerContent(matchedMarker.getExtData(), true));
      matchedMarker.setOffset(new AMap.Pixel(-20, -54));
      matchedMarker.setzIndex(102);
      this.map && this.map.setCenter(position);
      this.selectMarker = matchedMarker;
    } else {
      // 生成高亮气泡
      const marker = this.generateMarker(parkingInfo, true);
      // 关联气泡的点击事件
      this.onMarkerClickHandle(marker, true);

      this.map && this.map.add(marker);
      this.selectMarker = marker;
    }

    this.map && this.map.setCenter(position);
    this.selectMapContentInfoWindow && this.selectMapContentInfoWindow.close();
    this.selectSearchContentInfoWindow = this.generateContentInfoWindow(parkingInfo);
    this.map && this.selectSearchContentInfoWindow.open(this.map, position);
  }

  // 选中搜索结果后，关闭区域选择框
  public onSelectParkingActivated() {
    // 当触发了parking操作时需要同步一下
    this.citySelectComponent && this.citySelectComponent.close();
  }

  /**** 图层显示 ****/

  /* 显示/隐藏路况 */
  public onTrafficLayerBtnClick() {
    this.isShowRoadState = !this.isShowRoadState;
    if (this.isShowRoadState) {
      this.trafficLayer && this.trafficLayer.show();
    } else {
      this.trafficLayer && this.trafficLayer.hide();
    }
    this.citySelectComponent && this.citySelectComponent.close();
  }

  /* 显示/隐藏停车场 */
  public onParkingLayerBtnClick() {
    this.isShowParking = !this.isShowParking;
    let matchMarker = null; // 地图图层与检索图层一致的气泡
    if (this.selectMarker) {
      this.markerList.forEach(markerItem => {
        if (markerItem.getExtData().parking.parking_id === this.selectMarker.getExtData().parking.parking_id) {
          matchMarker = markerItem;
        }
      });
    }
    // 隐藏->显示
    if (this.isShowParking) {

      // 把列表中对应的marker也放大
      if (this.selectMarker) {

        // 有这个marker就直接放大
        if (matchMarker && this.zIndex === 102) {
          const info = matchMarker.getExtData();
          const position = new AMap.LngLat(Number(info.parking.lon), Number(info.parking.lat));
          this.refreshMarkerActive(matchMarker, true);
          this.selectSearchContentInfoWindow && this.selectSearchContentInfoWindow.close();
          this.selectSearchContentInfoWindow = null;
          this.selectMapContentInfoWindow = this.generateContentInfoWindow(matchMarker.getExtData());
          this.selectMapContentInfoWindow.open(this.map, position);
          this.map && this.map.setCenter(position);
        }
      }
      this.map && this.map.add(this.markerList);
    } else {
      // 显示->隐藏

      if (matchMarker) {
        this.zIndex = this.selectMarker.getzIndex();
        this.map && this.map.remove(this.selectMarker);
        this.selectSearchContentInfoWindow && this.selectSearchContentInfoWindow.close();
      }

      this.refreshMarkerStatus();
      this.map && this.map.remove(this.markerList);

      // 关闭图层时关闭信息窗体
      this.selectMapContentInfoWindow && this.selectMapContentInfoWindow.close();
    }
    this.citySelectComponent && this.citySelectComponent.close();
  }

  /* 显示/隐藏热力图 */
  public onHeadMapLayerBtnClick() {
    this.isShowHeatMap = !this.isShowHeatMap;
    if (this.isShowHeatMap) {
      this.heatMap && this.heatMap.show();
    } else {
      this.heatMap && this.heatMap.hide();
    }
    this.citySelectComponent && this.citySelectComponent.close();
  }

  /**** 地图数据处理 ****/

  /* 请求所有数据 */
  private requestAllData(region_id: string) {
    this.dataStatisticsHttpService.requestAllParkingDynamicInfoList(region_id).subscribe(results => {
      const parkingList = [], heatMapDataList = [];
      results[0].forEach((parkItem: ParkingDynamicsInfoEntity, index: number) => {
        // #54699 地图里不显示已中断停车场泡泡
        if (parkItem.status > 0 && parkItem.run_status !== 2) {
          parkingList.push(parkItem);
          heatMapDataList.push(results[1][index]);
        }
      });
      this.parkingList = parkingList;
      this.heatMapDataList = heatMapDataList;

      this.updateParkingData();
      this.updateHeatMapData();
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
  }

  /* 更新停车场相关数据 */
  private updateParkingData() {
    // 更新停车场数据,并同步一次显示状态
    const tempMarkerList = [];
    this.parkingList.forEach(item => {
      const marker = this.generateMarker(item, false);
      // 关联气泡的点击事件,移入移出事件
      this.onMarkerClickHandle(marker, false);
      tempMarkerList.push(marker);
    });
    if (this.isShowParking) {
      this.map && this.map.remove(this.markerList);
      this.map && this.map.add(tempMarkerList);
    } else {
      this.map && this.map.remove(this.markerList);
    }
    this.markerList = tempMarkerList;
  }

  /* 更新热力图相关数据 */
  private updateHeatMapData() {
    // 更新热力图数据,并同步一次显示状态
    this.heatMap && this.heatMap.setDataSet({
      data: this.heatMapDataList,
      max: this.heatMapMax,
    });
    if (this.isShowHeatMap) {
      this.heatMap && this.heatMap.show();
    } else {
      this.heatMap && this.heatMap.hide();
    }
  }

  /* 更新点标记状态（变小） */
  private refreshMarkerStatus() {
    if (this.markerList) {
      this.markerList.forEach(markerItem => {
        this.refreshMarkerActive(markerItem, false);
      });
    }
  }

  /**
   * 点标记的点击事件
   * @param marker
   * @param {boolean} isSelectMarker 是否是检索出来的停车场
   */
  private onMarkerClickHandle(marker: any, isSelectMarker: boolean = false) {
    marker.on('click', (event: any) => {

      // 高亮点击的marker
      this.refreshMarkerStatus();
      this.refreshMarkerActive(marker, true);

      const info = event.target.getExtData();
      const position = new AMap.LngLat(Number(info.parking.lon), Number(info.parking.lat));
      this.map.clearInfoWindow();
      this.map.setCenter(position);
      if (!isSelectMarker) {
        // 如果点击的是原地图图层气泡，有搜索选中的marker在放大状态，缩小他
        if (this.selectMarker && this.selectMarker !== marker) {
          this.refreshMarkerActive(this.selectMarker, false);
          this.selectSearchContentInfoWindow && this.selectSearchContentInfoWindow.close();
        }
        this.selectMapContentInfoWindow = this.generateContentInfoWindow(info);
        this.selectMapContentInfoWindow.open(this.map, position);
      } else {
        this.selectSearchContentInfoWindow = this.generateContentInfoWindow(info);
        this.selectSearchContentInfoWindow.open(this.map, position);
      }
    });
  }

  /**
   * 放大/缩小泡泡
   * @param {boolean} isActive true 放大 false:缩小
   */
  private refreshMarkerActive(marker: any, isActive: boolean) {
    if (isActive) {
      marker.setContent(this.generateMarkerContent(marker.getExtData(), true));
      marker.setOffset(new AMap.Pixel(-20, -54));
      marker.setzIndex(102);
    } else {
      marker.setContent(this.generateMarkerContent(marker.getExtData()));
      marker.setOffset(new AMap.Pixel(-13, -35));
      marker.setzIndex(101);
    }
  }

  /**
   * 生成点标记
   * @param {ParkingDynamicsInfoEntity} parkingInfo
   * @param {boolean} isActive true 放大 false 缩小
   */
  private generateMarker(parkingInfo: ParkingDynamicsInfoEntity, isActive: boolean = false) {
    const marker = new AMap.Marker({
      position: new AMap.LngLat(Number(parkingInfo.parking.lon), Number(parkingInfo.parking.lat)),
      extData: parkingInfo,
      title: parkingInfo.parking.parking_name,
      offset: new AMap.Pixel(-13, -35),
      content: this.generateMarkerContent(parkingInfo, isActive),
      zIndex: 101,
    });
    if (!isActive) {
      marker.setOffset(new AMap.Pixel(-13, -35));
      marker.setzIndex(101);
      return marker;
    } else {
      marker.setOffset(new AMap.Pixel(-20, -54));
      marker.setzIndex(102);
      return marker;
    }
  }

  /**
   * 生成点标记content
   * @param {ParkingDynamicsInfoEntity} parkingInfo
   * @param {boolean} isActive
   * @returns {string}
   */
  private generateMarkerContent(parkingInfo: ParkingDynamicsInfoEntity, isActive: boolean = false) {
    let count: any = parkingInfo.total_tmp_num - parkingInfo.tmp_num;
    if (count > 999) {
      count = '999';
    } else if (count < 1) {
      count = '满';
    }
    const markderClassObj = {
      0: 'ther-amap-icon-unknown',
      1: 'ther-amap-icon-free',
      2: 'ther-amap-icon-loose',
      3: 'ther-amap-icon-nervous'
    };
    const markerActiveClassObj = {
      0: 'ther-amap-icon-unknown-active',
      1: 'ther-amap-icon-free-active',
      2: 'ther-amap-icon-loose-active',
      3: 'ther-amap-icon-nervous-active'
    };
    const count_content = parkingInfo.status > 0 ? `<i>${count}</i>` : '';
    const marker_top = parkingInfo.parking.charging_pile ? '<b></b>' : '';
    if (!isActive) {
      const content = `<div class="ther-amap-icon ${markderClassObj[parkingInfo.status]}">${marker_top + count_content}</div>`;
      return content;
    } else {
      const content = `<div class="ther-amap-icon ther-amap-icon-active ${markerActiveClassObj[parkingInfo.status]}">${marker_top + count_content}</div>`;
      return content;
    }
  }

  /**
   * 生成信息窗体
   * @param parkingInfo 数据详情
   * @returns {AMap.InfoWindow}
   */
  private generateContentInfoWindow(parkingInfo: ParkingDynamicsInfoEntity): any {

    this.idSubscription && this.idSubscription.unsubscribe();

    const info = document.createElement('div');
    info.className = 'amap-content-window ' + this.formatDataClass(parkingInfo.status);

    const row2 = document.createElement('div');
    row2.className = 'amap-content-window-row';
    const row2Column1 = document.createElement('div');
    row2Column1.innerHTML = '名称：';
    const row2Column2 = document.createElement('div');
    row2Column2.innerHTML = parkingInfo.parking.parking_name;
    row2.appendChild(row2Column1);
    row2.appendChild(row2Column2);
    info.appendChild(row2);

    const row3 = document.createElement('div');
    row3.className = 'amap-content-window-row';
    const row3Column1 = document.createElement('div');
    row3Column1.innerHTML = '地址：';
    const row3Column2 = document.createElement('div');
    row3Column2.innerHTML = parkingInfo.parking.address;
    row3.appendChild(row3Column1);
    row3.appendChild(row3Column2);
    info.appendChild(row3);

    const row4Container = document.createElement('div');
    row4Container.className = 'amap-content-window-row-container';

    const row4 = document.createElement('div');
    row4.className = 'amap-content-window-row';
    const row4Column1 = document.createElement('div');
    row4Column1.innerHTML = '临时车位';
    const row4Column2 = document.createElement('div');
    const row4Column1Span1 = document.createElement('span');
    row4Column1Span1.innerHTML = parkingInfo.status === 0 ? '--/' : parkingInfo.tmp_num.toString();
    if (parkingInfo.status > 0) {
      row4Column1Span1.style.color = this.formatDataColor(parkingInfo.status);
    }
    const row4Column1Span2 = document.createElement('span');
    row4Column1Span2.innerHTML = parkingInfo.status === 0 ? '--' : '/' + parkingInfo.total_tmp_num;
    row4Column2.appendChild(row4Column1Span1);
    row4Column2.appendChild(row4Column1Span2);
    row4.appendChild(row4Column2);
    row4.appendChild(row4Column1);

    const row5 = document.createElement('div');
    row5.className = 'amap-content-window-row';
    const row5Column1 = document.createElement('div');
    row5Column1.innerHTML = '今日流量';
    const row5Column2 = document.createElement('div');
    row5Column2.innerHTML = parkingInfo.status === 0 ? '--' : parkingInfo.flow.toString();
    row5.appendChild(row5Column2);
    row5.appendChild(row5Column1);
    row4Container.appendChild(row4);
    row4Container.appendChild(row5);
    info.appendChild(row4Container);
    // info.appendChild(row5);

    // 定义底部内容
    const bottom = document.createElement('div');
    bottom.className = 'amap-content-window-arrow';
    info.appendChild(bottom);

    const infoWindow = new AMap.InfoWindow({
      isCustom: true,  // 使用自定义窗体
      content: info,
      offset: new AMap.Pixel(155, -30)
    });

    // 更新显示信息，不考虑失败情况
    this.idSubscription = this.dataStatisticsHttpService.requestParkingDynamicInfoById(parkingInfo.parking.parking_id).subscribe(entity => {
      info.className = 'amap-content-window ' + this.formatDataClass(entity.status);
      row2Column2.innerHTML = entity.parking.parking_name;
      row3Column2.innerHTML = entity.parking.address;
      row4Column1Span1.innerHTML = entity.status === 0 ? '--/' : entity.tmp_num.toString();
      if (entity.status > 0) {
        row4Column1Span1.style.color = this.formatDataColor(entity.status);
      }
      row4Column1Span2.innerHTML = entity.status === 0 ? '--' : '/' + entity.total_tmp_num;
      row5Column2.innerHTML = entity.status === 0 ? '--' : entity.flow.toString();
    });
    return infoWindow;
  }

  /**** 数据处理 ****/

  /**
   * 车位状态
   * @param status 状态码
   * @returns {any}
   */
  private formatDataStatus(status: number): string {
    switch (status) {
      case 0:
        return '中断';
      case 1:
        return '车位空闲';
      case 2:
        return '车位宽松';
      case 3:
        return '车位紧张';
    }
  }

  /**
   * 车位状态对应的颜色
   * @param status
   */
  private formatDataColor(status: number): string {
    switch (status) {
      case 0:
        return '#a786ce';
      case 1:
        return '#56c74e';
      case 2:
        return '#e87724';
      case 3:
        return '#f45c63';
    }
  }

  /**
   * 车位状态对应的class
   * @param status
   */
  private formatDataClass(status: number): string {
    switch (status) {
      case 0:
        return 'amap-content-window-unknown';
      case 1:
        return 'amap-content-window-free';
      case 2:
        return 'amap-content-window-loose';
      case 3:
        return 'amap-content-window-nervous';
    }
  }
}
