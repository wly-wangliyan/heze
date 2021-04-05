import { Component, OnInit, ViewChild, Renderer2, ElementRef, OnDestroy } from '@angular/core';
import { LoginHttpService, LoginParams } from './login-http.service';
import { AuthService } from '../../core/auth.service';
import { ValidateHelper } from '../../../utils/validate-helper';
import { LocalStorageProvider } from '../../share/localstorage-provider';
import { GlobalService } from '../../core/global.service';
import { HttpErrorEntity } from '../../core/http.service';
import { isUndefined } from 'util';
import { timer } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit, OnDestroy {
  public loginParams = new LoginParams(); // 登录参数
  public userError = ''; // 用户名错误提示
  public passwordError = ''; // 密码错误提示
  private isUserIconFocus = false; // 标记是否焦点在用户名
  private isPwdIconFocus = false; // 标记是否焦点在密码
  @ViewChild('userIcon', { static: false }) public userIcon: ElementRef; // 用户图标
  @ViewChild('pwdIcon', { static: false }) public pwdIcon: ElementRef; // 密码图标
  @ViewChild('userInput', { static: false }) public userInput: ElementRef; // 用户输入框
  @ViewChild('pwdInput', { static: false }) public pwdInput: ElementRef; // 密码输入框

  constructor(private loginHttpService: LoginHttpService,
    public globalService: GlobalService,
    private authService: AuthService,
    private renderer2: Renderer2) {
    this.loginParams.username = LocalStorageProvider.Instance.get(LocalStorageProvider.HistoryLoginName);
  }

  public ngOnInit() {
    $('body').css('overflow', 'auto');
  }

  public ngOnDestroy() {
    document.body.scrollTop = 0; // 滚动条回到顶部后再overflow，否则首页位置错位
    $('body').css('overflow', 'hidden');
  }

  /**** 控件显示效果 ****/

  public onUserMouseEnter() {
    this.renderer2.addClass(this.userIcon.nativeElement, 'user-icon-focus');
    this.renderer2.addClass(this.userInput.nativeElement, 'input-focus');
  }

  public onUserMouseLeave() {
    if (this.isUserIconFocus) {
      return;
    }
    this.renderer2.removeClass(this.userIcon.nativeElement, 'user-icon-focus');
    this.renderer2.removeClass(this.userInput.nativeElement, 'input-focus');
  }

  public onUserFocus() {
    this.initErrMsg();
    this.isUserIconFocus = true;
    this.renderer2.addClass(this.userIcon.nativeElement, 'user-icon-focus');
    this.renderer2.addClass(this.userInput.nativeElement, 'input-focus');
  }

  public onUserBlur() {
    this.isUserIconFocus = false;
    this.renderer2.removeClass(this.userIcon.nativeElement, 'user-icon-focus');
    this.renderer2.removeClass(this.userInput.nativeElement, 'input-focus');
  }

  public onPwdMouseEnter() {
    this.renderer2.addClass(this.pwdIcon.nativeElement, 'pwd-icon-focus');
    this.renderer2.addClass(this.pwdInput.nativeElement, 'input-focus');
  }

  public onPwdMouseLeave() {
    if (this.isPwdIconFocus) {
      return;
    }
    this.renderer2.removeClass(this.pwdIcon.nativeElement, 'pwd-icon-focus');
    this.renderer2.removeClass(this.pwdInput.nativeElement, 'input-focus');
  }

  public onPwdFocus() {
    this.initErrMsg();
    this.isPwdIconFocus = true;
    this.renderer2.addClass(this.pwdIcon.nativeElement, 'pwd-icon-focus');
    this.renderer2.addClass(this.pwdInput.nativeElement, 'input-focus');
  }

  public onPwdBlur() {
    this.isPwdIconFocus = false;
    this.renderer2.removeClass(this.pwdIcon.nativeElement, 'pwd-icon-focus');
    this.renderer2.removeClass(this.pwdInput.nativeElement, 'input-focus');
  }

  // login
  public onLogin() {
    this.initErrMsg();
    if (!this.loginParams.username || !this.loginParams.username.trim()) {
      this.userError = '用户名错误，请重新输入!';
      return;
    }

    if (!ValidateHelper.Account(this.loginParams.username)) {
      this.userError = '用户名错误，请重新输入!';
      return;
    }

    if (!this.loginParams.password || !this.loginParams.password.trim()) {
      this.passwordError = '密码错误，请重新输入!';
      return;
    }

    if (!ValidateHelper.Length(this.loginParams.password, 8, 20)) {
      this.passwordError = '密码错误，请重新输入!';
      return;
    }

    this.loginHttpService.requestLogin(this.loginParams).subscribe(data => {
      // 判断角色是否为平台用户
      if (isUndefined(data.role) || data.role === 1) {
        // 登录成功记住用户名
        LocalStorageProvider.Instance.set(LocalStorageProvider.HistoryLoginName, this.loginParams.username);
        this.authService.authorizeByLogin();
        timer(1000).subscribe(() => {
          if (!this.authService.isLoggedIn) {
            this.passwordError = '登录失败，请重试!';
          }
        });
      } else {
        this.passwordError = '该账号无权限，请联系管理员开通权限后再登录！';
      }
    }, err => {
      if (!this.globalService.httpErrorProcess(err)) {
        if (err.status === 401) {
          this.passwordError = '密码错误，请重新输入!';
        } else if (err.status === 422) {
          const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);

          for (const content of error.errors) {
            if (content.field === 'username' && content.code === 'invalid') {
              this.userError = '用户名错误，请重新输入！';
            } else if (content.field === 'password' && content.code === 'invalid') {
              this.passwordError = '密码错误，请重新输入!';
            } else {
              this.passwordError = '账号或密码错误，请重新输入!';
            }
          }
        } else {
          this.passwordError = '账号或密码错误，请重新输入!';
        }
      }
    });
  }

  /**初始化错误信息 */
  private initErrMsg() {
    this.userError = '';
    this.passwordError = '';
  }
}
