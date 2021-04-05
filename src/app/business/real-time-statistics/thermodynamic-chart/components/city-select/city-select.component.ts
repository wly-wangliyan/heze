import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { GlobalService } from '../../../../../core/global.service';
import { RegionEntity } from '../../../../../core/region-http.service';

@Component({
  selector: 'app-city-select',
  templateUrl: './city-select.component.html',
  styleUrls: ['./city-select.component.css']
})
export class CitySelectComponent implements OnInit, OnDestroy {

  public currentRegion: RegionEntity;

  public regionList: Array<RegionEntity> = [];

  public isShowList = false;

  @Output() public citySelected = new EventEmitter<RegionEntity>();

  @Output() public initRegionComplete = new EventEmitter<RegionEntity>();

  constructor(private globalService: GlobalService) {
  }

  public ngOnInit() {
    this.globalService.currentTileRegions.subscribe(regions => {
      this.regionList = regions;
      this.currentRegion = regions[0];
      this.initRegionComplete.emit(regions[0]);
    });
  }

  public ngOnDestroy() {
  }

  public onCityListItemClick(region: RegionEntity) {
    this.currentRegion = region;
    this.isShowList = false;
    this.citySelected.emit(region);
  }

  public onCurrentCityBtnClick() {
    if (this.regionList.length === 0) {
      // 当有数据之后才可以点击
      return;
    }
    this.isShowList = true;
  }

  /**
   * 当地图发生变化时需要进行同步操作
   */
  public mapSync() {
    this.isShowList = false;
  }

  public close() {
    this.isShowList = false;
  }
}
