import { Component, ViewChild, ElementRef, AfterViewInit, Renderer2 } from '@angular/core';
import { PromptBoxComponent } from './share/components/prompts/prompt-box/prompt-box.component';
import { ConfirmationBoxComponent } from './share/components/prompts/confirmation-box/confirmation-box.component';
import { Http403PageComponent } from './share/components/prompts/http-403-page/http-403-page.component';
import { Http500PageComponent } from './share/components/prompts/http-500-page/http-500-page.component';
import { GlobalService } from './core/global.service';
import { AuthService } from './core/auth.service';
import { RouteMonitorService } from './core/route-monitor.service';
import { DateFormatHelper } from '../utils/date-format-helper';
import { ChangePasswordParams, LoginHttpService } from './business/login/login-http.service';
import { ValidateHelper } from '../utils/validate-helper';
import { HttpErrorEntity } from './core/http.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements AfterViewInit {

  public passwordPassword: ChangePasswordParams = new ChangePasswordParams();

  public repeat_password: string;

  @ViewChild(PromptBoxComponent, { static: true }) public globalPromptBox: PromptBoxComponent;
  @ViewChild(ConfirmationBoxComponent, { static: true }) public globalConfirmationBox: ConfirmationBoxComponent;
  @ViewChild(Http403PageComponent, { static: true }) public global403Page: Http403PageComponent;
  @ViewChild(Http500PageComponent, { static: true }) public global500Page: Http500PageComponent;
  @ViewChild('routerDiv', { static: true }) public routerDiv: ElementRef;

  constructor(
    private globalService: GlobalService,
    public authService: AuthService,
    private renderer2: Renderer2,
    private routeService: RouteMonitorService,
    private loginHttpService: LoginHttpService,
  ) {
    DateFormatHelper.NowBlock = () => {
      return new Date(globalService.timeStamp * 1000);
    };
  }

  public ngAfterViewInit() {
    this.globalService.promptBox = this.globalPromptBox;
    this.globalService.confirmationBox = this.globalConfirmationBox;
    this.globalService.http403Page = this.global403Page;
    this.globalService.http500Page = this.global500Page;
    GlobalService.Instance = this.globalService;

    this.routeService.routePathChanged.subscribe(() => {
      // 到路由变更时重置显示状态
      this.global403Page.http403Flag = false;
      this.global500Page.http500Flag = false;
    });
  }

  /* 监听错误代码403/500*/
  public displayStateChanged(): void {
    if (this.global403Page.http403Flag || this.global500Page.http500Flag) {
      this.renderer2.setStyle(this.routerDiv.nativeElement, 'display', 'none');
    } else {
      this.renderer2.setStyle(this.routerDiv.nativeElement, 'display', 'block');
    }
  }

  /** 重置修改密码参数*/
  public onModifyPwdDivClick() {
    this.passwordPassword = new ChangePasswordParams();
    this.repeat_password = '';
  }

  public onModifyPwdFormSubmit() {
    if (!ValidateHelper.Length(this.passwordPassword.old_password, 8, 20)) {
      this.globalService.promptBox.open('原始密码输入错误!');
      return;
    } else if (!ValidateHelper.Length(this.passwordPassword.new_password, 8, 20)) {
      this.globalService.promptBox.open('新密码输入错误!');
      return;
    } else if (this.passwordPassword.new_password !== this.repeat_password) {
      this.globalService.promptBox.open('两次密码不一致，请重新输入！');
      return;
    } else if (this.passwordPassword.old_password === this.passwordPassword.new_password) {
      this.globalService.promptBox.open('新旧密码不可相同！');
    } else {
      this.loginHttpService.requestModifyPassword(this.passwordPassword.old_password, this.passwordPassword.new_password).subscribe(() => {
        this.globalService.promptBox.open('密码修改成功,请重新登录！', () => {
          $('#modifyPasswordModal').modal('hide');
          this.authService.kickOut();
        });
      }, err => {
        if (!this.globalService.httpErrorProcess(err)) {
          if (err.status === 422) {
            const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);

            for (const content of error.errors) {
              if (content.field === 'old_password' && content.code === 'invalid') {
                this.globalService.promptBox.open('原始密码输入错误！');
                return;
              } else if (content.field === 'password' && content.code === 'invalid') {
                this.globalService.promptBox.open('新旧密码不可相同！');
              } else if (content.field === 'new_password' && content.code === 'invalid') {
                this.globalService.promptBox.open('新密码输入错误！');
              } else {
                this.globalService.promptBox.open('参数错误或无效,请重试！');
              }
            }
          }
        }
      });
    }
  }

  /* 退出系统 */
  public onLogoutDivClick() {
    this.globalService.confirmationBox.open('是否退出系统？', () => {
      this.authService.logout();
    });
  }
}
