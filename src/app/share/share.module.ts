import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {NgxEchartsModule} from 'ngx-echarts';

// 组件
import {PromptBoxComponent} from './components/prompts/prompt-box/prompt-box.component';
import {Http403PageComponent} from './components/prompts/http-403-page/http-403-page.component';
import {Http500PageComponent} from './components/prompts/http-500-page/http-500-page.component';
import {ExpandedMenuComponent} from './components/expanded-menu/expanded-menu.component';
import {ConfirmationBoxComponent} from './components/prompts/confirmation-box/confirmation-box.component';
import {CrumbComponent} from './components/crumb/crumb.component';
import {ChartCounterComponent} from './components/chart-counter/chart-counter.component';
import {ChartProgressbarComponent} from './components/chart-progressbar/chart-progressbar.component';
import {Http502PageComponent} from './components/prompts/http-502-page/http-502-page.component';
import {NoDataPageComponent} from './components/prompts/no-data-page/no-data-page.component';
import {BeautifyCheckboxComponent} from './components/beautify-checkbox/beautify-checkbox.component';
import {SearchSelectorComponent} from './components/search-selector/search-selector.component';
import {PaginationComponent} from './components/pagination/pagination.component';
import {ChartCounterBgComponent} from './components/chart-counter-bg/chart-counter-bg.component';

// 指令
import {IgnoreSpaceDirective} from './directives/ignore-space.directive';
import {ZDebounceClickDirective} from './directives/z-debounce-click.directive';

// 管道
import {ZMaxLengthPipe} from './pipes/z-max-length.pipe';
import {UserTypePipe} from './pipes/user-type.pipe';
import {ZDurationPipe, ZDuration1Pipe} from './pipes/z-duration.pipe';
import {ParkingStatePipe} from './pipes/parking-state.pipe';
import {CompanyStatePipe} from './pipes/company-state.pipe';
import {
  OpenTypePipe,
  ParkingAreaTypePipe,
  ParkingFormatAddressPipe,
  ParkingGroupTypePipe,
  ParkingOperateTypePipe,
  ParkingTypePipe,
  ParkingUpdateTypePipe,
  PayTypePipe
} from './pipes/parking-type.pipe';
import {ZPlaceholderPipe} from './pipes/z-placeholder.pipe';
import {UploadContentTypePipe} from './pipes/upload-content-type.pipe';
import {ZeroFillPipe} from './pipes/zero-fill.pipe';
import {ZTenThousandUnitPipe} from './pipes/z-ten-thousand-unit.pipe';
import {ZNumberPipe} from './pipes/z-number.pipe';
import {BeautifyRadioComponent} from './components/beautify-radio/beautify-radio.component';
import {ZMapSelectPointComponent} from "./components/z-map-select-point/z-map-select-point.component";
import {ProCityDistSelectComponent} from "./components/pro-city-dist-select/pro-city-dist-select.component";
import { ZPhotoSelectComponent } from './components/z-photo-select/z-photo-select.component';

@NgModule({
  declarations: [
    PromptBoxComponent,
    Http403PageComponent,
    Http500PageComponent,
    ExpandedMenuComponent,
    ConfirmationBoxComponent,
    CrumbComponent,
    ChartCounterComponent,
    ChartProgressbarComponent,
    Http502PageComponent,
    NoDataPageComponent,
    BeautifyCheckboxComponent,
    SearchSelectorComponent,
    PaginationComponent,
    ChartCounterBgComponent,
    BeautifyRadioComponent,
    ZMapSelectPointComponent,
    ProCityDistSelectComponent,
    ZPhotoSelectComponent,

    // 管道
    ZMaxLengthPipe,
    UserTypePipe,
    ZDurationPipe,
    ZDuration1Pipe,
    ParkingStatePipe,
    CompanyStatePipe,
    ParkingAreaTypePipe,
    ParkingTypePipe,
    ParkingGroupTypePipe,
    ParkingOperateTypePipe,
    ParkingFormatAddressPipe,
    OpenTypePipe,
    PayTypePipe,
    ParkingUpdateTypePipe,
    ZPlaceholderPipe,
    UploadContentTypePipe,
    ZeroFillPipe,
    ZTenThousandUnitPipe,
    ZNumberPipe,

    // 指令
    IgnoreSpaceDirective,
    ZDebounceClickDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgxEchartsModule
  ],
  exports: [
    NgxEchartsModule,
    PromptBoxComponent,
    Http403PageComponent,
    Http500PageComponent,
    ExpandedMenuComponent,
    ConfirmationBoxComponent,
    CrumbComponent,
    ChartCounterComponent,
    ChartProgressbarComponent,
    Http502PageComponent,
    NoDataPageComponent,
    BeautifyCheckboxComponent,
    SearchSelectorComponent,
    PaginationComponent,
    ChartCounterBgComponent,
    BeautifyRadioComponent,
    ZMapSelectPointComponent,
    ProCityDistSelectComponent,
    ZPhotoSelectComponent,

    // 管道
    ZMaxLengthPipe,
    UserTypePipe,
    ZDurationPipe,
    ZDuration1Pipe,
    ParkingStatePipe,
    CompanyStatePipe,
    ParkingAreaTypePipe,
    ParkingTypePipe,
    ParkingGroupTypePipe,
    ParkingOperateTypePipe,
    ParkingFormatAddressPipe,
    OpenTypePipe,
    PayTypePipe,
    ParkingUpdateTypePipe,
    ZPlaceholderPipe,
    UploadContentTypePipe,
    ZeroFillPipe,
    ZTenThousandUnitPipe,
    ZNumberPipe,

    // 指令
    IgnoreSpaceDirective,
    ZDebounceClickDirective
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class ShareModule {
}
