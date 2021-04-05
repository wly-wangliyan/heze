import {
  Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges,
  ViewChild
} from '@angular/core';
import {GlobalService} from '../../../core/global.service';
import {RegionEntity, RegionLevel} from '../../../core/region-http.service';
import {GlobalConst} from "../../global-const";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-pro-city-dist-select',
  templateUrl: './pro-city-dist-select.component.html',
  styleUrls: ['./pro-city-dist-select.component.css']
})
export class ProCityDistSelectComponent implements OnInit, OnChanges {

  @Input() public selectContainerWidth = '';

  @Input() public region_id = '';

  public get selectedRegionId(): string {
    return this.region_id;
  }

  @Input() public hasAdd = false;

  @Input() public hasDetail = false;

  @Output() public regionIdChanged = new EventEmitter();

  public provinceList: Array<RegionEntity> = [];

  public provinces: RegionEntity;

  public cities: RegionEntity;

  public districts: RegionEntity;

  public currentRegions = {
    pro_region_id: '',
    city_region_id: '',
    dist_region_id: '',
    pro_name: '所在省',
    city_name: '所在市',
    dist_name: '所在区'
  };

  public currentAddress = '';

  public get selectedAddress(): string {
    return this.currentAddress;
  }

  private _dirty = false;
  public get dirty(): boolean {
    return this._dirty;
  };

  private selectedRegions = {
    pro_region_id: '',
    city_region_id: '',
    dist_region_id: '',
    pro_name: '',
    city_name: '',
    dist_name: ''
  };

  @ViewChild('pro') public pro: ElementRef;

  @ViewChild('city') public city: ElementRef;

  @ViewChild('dist') public dist: ElementRef;

  private cancelSubscription: Subscription;

  constructor(private globalService: GlobalService) {
  }

  public ngOnInit() {
    this.getRegionsData(null);
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes['region_id'] && (changes['region_id'].currentValue !== changes['region_id'].previousValue)) {
      this.getRegionsData(changes['region_id'].currentValue);
    }
  }

  public setRegionId(regionId: string) {
    this.getRegionsData(regionId);
  }

  // 获取省市区数据
  public getRegionsData(regionId: string) {
    if (this.region_id !== regionId) {
      this.region_id = regionId;
    }
    this.cancelSubscription && this.cancelSubscription.unsubscribe();
    this.cancelSubscription = this.globalService.regions.subscribe(data => {
      this.provinceList = data;
      if (this.hasAdd) {
        this.region_id = this.region_id ? this.region_id : GlobalConst.RegionID;
        this.getRegionsByIdData(this.region_id);
      } else {
        this.getRegionsByIdData(this.region_id);
      }
    });
  }

  // 通过省市区code显示当前省市区
  public getRegionsByIdData(region_id: string) {
    this.globalService.getRegionById(region_id).subscribe(data => {
      if ((data.length > 0) && (data.length === 1)) {
        if (data[0].level === RegionLevel.province) {
          this.currentRegions.pro_region_id = data[0].region_id ? data[0].region_id : '';
          this.currentRegions.pro_name = data[0].name ? data[0].name : '所在省';
        }
        if (data[0].region_id !== region_id) {
          if (data[0].cities && data[0].cities.length === 1) {
            this.currentRegions.city_region_id = (data[0].cities[0].level === RegionLevel.city && data[0].cities[0].region_id) ? data[0].cities[0].region_id : '';
            this.currentRegions.city_name = (data[0].cities[0].level === RegionLevel.city && data[0].cities[0].name) ? data[0].cities[0].name : '所在市';
            if (data[0].cities[0].districts && data[0].cities[0].districts.length === 1) {
              this.currentRegions.dist_region_id = (data[0].cities[0].districts[0].level === RegionLevel.district && data[0].cities[0].districts[0].region_id) ? data[0].cities[0].districts[0].region_id : '';
              this.currentRegions.dist_name = (data[0].cities[0].districts[0].level === RegionLevel.district && data[0].cities[0].districts[0].name) ? data[0].cities[0].districts[0].name : '所在区';
            } else {
              this.currentRegions.dist_region_id = '';
              this.currentRegions.dist_name = '所在区';
            }
          }
          if (data[0].districts && data[0].districts.length === 1) {
            this.currentRegions.city_region_id = (data[0].districts[0].level === RegionLevel.city && data[0].districts[0].region_id) ? data[0].districts[0].region_id : '';
            this.currentRegions.city_name = (data[0].districts[0].level === RegionLevel.city && data[0].districts[0].name) ? data[0].districts[0].name : '所在市';
            this.currentRegions.dist_region_id = (data[0].districts[0].level === RegionLevel.district && data[0].districts[0].region_id) ? data[0].districts[0].region_id : '';
            this.currentRegions.dist_name = (data[0].districts[0].level === RegionLevel.district && data[0].districts[0].name) ? data[0].districts[0].name : '所在区';
          }
        } else {
          this.currentRegions.city_region_id = '';
          this.currentRegions.city_name = '所在市';
          this.currentRegions.dist_region_id = '';
          this.currentRegions.dist_name = '所在区';
        }

        // 渲染省市区数据
        this.searchRegions(this.currentRegions.pro_region_id, 'pro');
        if (this.currentRegions.city_region_id) {
          this.searchRegions(this.currentRegions.city_region_id, 'city');
        }
        if (this.currentRegions.dist_region_id) {
          this.searchRegions(this.currentRegions.dist_region_id, 'dist');
        }
        if (!this.currentRegions.city_region_id && this.currentRegions.dist_region_id) {
          this.searchRegions(this.currentRegions.dist_region_id, 'dist');
        }
      }
    });
  }

  // 根据上一级行政区域查找下一行政区域数据
  public searchRegions(region_id: string, regions: string, hasEdit?: string) {
    if (regions) {
      if (regions.includes('pro')) {
        this.pro && $(this.pro.nativeElement).css('color', '#9a9a9a');
        this.city && $(this.city.nativeElement).css('color', '#9a9a9a');
        this.dist && $(this.dist.nativeElement).css('color', '#9a9a9a');
        this.provinces = this.provinceList.find(region => {
          return region.region_id === region_id;
        });
        this.cities = null;
        this.districts = null;
        if (!region_id.substr(0, 2).includes(this.currentRegions.city_region_id.substr(0, 2)) || !region_id.substr(0, 2).includes(this.currentRegions.dist_region_id.substr(0, 2))) {
          this.currentRegions.city_region_id = '';
          this.currentRegions.city_name = '所在市';
          this.currentRegions.dist_region_id = '';
          this.currentRegions.dist_name = '所在区';
        }
        this.currentRegions.pro_name = this.provinces && this.provinces.name ? this.provinces.name : '所在省';
        this.selectedRegions.pro_region_id = region_id ? region_id : '';
        this.selectedRegions.dist_region_id = this.selectedRegions.city_region_id = '';
        this.selectedRegions.pro_name = this.provinces && this.provinces.name ? this.provinces.name : '';
        this.selectedRegions.city_name = this.selectedRegions.dist_name = '';
        setTimeout(() => {
          this.pro && $(this.pro.nativeElement).css('color', '#555');
        }, 0);
      } else if (regions.includes('city')) {
        this.cities = this.provinces.cities.find(region => {
          return region.region_id === region_id;
        });
        this.districts = null;
        if (!region_id.substr(0, 4).includes(this.currentRegions.dist_region_id.substr(0, 4))) {
          this.currentRegions.dist_region_id = '';
          this.currentRegions.dist_name = '所在区';
          this.dist && $(this.dist.nativeElement).css('color', '#9a9a9a');
        }
        this.currentRegions.city_name = this.cities && this.cities.name ? this.cities.name : '所在市';
        this.selectedRegions.city_region_id = region_id ? region_id : '';
        this.selectedRegions.dist_region_id = '';
        this.selectedRegions.city_name = this.cities && this.cities.name ? this.cities.name : '';
        this.selectedRegions.dist_name = '';
        setTimeout(() => {
          this.city && $(this.city.nativeElement).css('color', '#555');
        }, 0);
      } else {
        if (this.cities && this.cities.districts) {
          this.cities.districts.forEach(dist => {
            if (dist.region_id === region_id) {
              this.selectedRegions.dist_name = dist.name;
            }
          });
        } else if (this.provinces.districts) {
          this.provinces.districts.forEach(dist => {
            if (dist.region_id === region_id) {
              this.selectedRegions.dist_name = dist.name;
            }
          });
        }
        this.currentRegions.dist_name = this.selectedRegions.dist_name ? this.selectedRegions.dist_name : '所在区';
        this.selectedRegions.dist_region_id = region_id ? region_id : '';
        this.dist && $(this.dist.nativeElement).css('color', '#555');
      }
    }
    // 省市区名称
    this.currentAddress = this.selectedRegions.pro_name + this.selectedRegions.city_name + this.selectedRegions.dist_name;
    if (hasEdit && hasEdit.includes('edit')) {
      this._dirty = true;
      // 重新选择的省市区code
      this.region_id = this.selectedRegions.dist_region_id ? this.selectedRegions.dist_region_id : this.selectedRegions.city_region_id;
      this.region_id = this.region_id ? this.region_id : this.selectedRegions.pro_region_id;
      this.regionIdChanged.emit(this.region_id);
    }
  }
}
