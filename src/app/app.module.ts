import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {registerLocaleData} from '@angular/common';
import { ErrorHandler, NgModule, Injectable } from '@angular/core';
import {environment} from '../environments/environment';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {EntryComponent} from './entry/entry.component';
import {LoginComponent} from './business/login/login.component';
import {HomeComponent} from './business/home/home.component';
import {ShareModule} from './share/share.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import zh from '@angular/common/locales/zh';
import {IconsProviderModule} from './icons-provider.module';
import * as Sentry from '@sentry/browser';
import {BasicsComponent} from './business/basics/basics.component';
import { NZ_I18N, zh_CN } from 'ng-zorro-antd/i18n';

registerLocaleData(zh);

@Injectable()
export class SentryErrorHandler implements ErrorHandler {

  constructor() {
    switch (environment.version) {
      case 'd':
        Sentry.init({
          dsn: 'https://7c34fa4e29f34510ba441c74e211be99@guard.uucin.com/330'
        });
        break;
      case 'r':
        Sentry.init({
          dsn: 'https://311aa6580e22427fba294e406b478f64@guard.uucin.com/331'
        });
        break;
    }
  }

  handleError(error: any): void {
    if (environment.version === 'd' || environment.version === 'r') {
      // 部署到服务器上的版本才生成日志
      Sentry.captureException(error.originalError || error);
    }
    throw error;
  }
}

@NgModule({
  declarations: [
    AppComponent,
    EntryComponent,
    LoginComponent,
    HomeComponent,
    BasicsComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    ShareModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    IconsProviderModule
  ],
  providers: [
    {provide: NZ_I18N, useValue: zh_CN},
    {provide: ErrorHandler, useClass: SentryErrorHandler},
  ],
  bootstrap: [EntryComponent]
})
export class AppModule {
}
