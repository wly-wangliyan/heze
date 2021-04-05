/**
 * Created by zack on 26/1/18.
 */

import { Observable, BehaviorSubject } from 'rxjs';

/**
 * 屏幕操作
 * Need to declare var ActiveXObject: any in typings.d.ts
 */
export class ScreenHelper {

  public static Instance: ScreenHelper = new ScreenHelper();

  private fullScreenStateChanged: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private constructor() {
    document.addEventListener('fullscreenchange', e => {
      this.fullScreenStateChanged.next(this.isFullScreen);
    });
    document.addEventListener('mozfullscreenchange', e => {
      this.fullScreenStateChanged.next(this.isFullScreen);
    });
    document.addEventListener('webkitfullscreenchange', e => {
      this.fullScreenStateChanged.next(this.isFullScreen);
    });
    document.addEventListener('msfullscreenchange', e => {
      this.fullScreenStateChanged.next(this.isFullScreen);
    });
  }

  public get isFullScreen(): boolean {
    const isFullScreen = document['isFullScreen'] || document['mozIsFullScreen'] || document['webkitIsFullScreen'];
    return isFullScreen;
  }

  /**
   * 进入全屏
   * @param element 在全屏中显示的元素
   */
  public requestFullScreen(element: any) {
    // 判断各种浏览器，找到正确的方法
    const requestMethod = element.requestFullScreen || // W3C
      element.webkitRequestFullScreen ||    // Chrome等
      element.mozRequestFullScreen || // FireFox
      element.msRequestFullScreen; // IE11
    if (requestMethod) {
      requestMethod.call(element);
    } else if (ActiveXObject) {// for Internet Explorer
      const wscript = new ActiveXObject('WScript.Shell');
      if (wscript !== null) {
        wscript.SendKeys('{F11}');
      }
    }
  }

  /**
   * 获取当前是否全屏显示
   * @returns Observable<boolean>
   */
  public get fullScreen(): Observable<boolean> {
    return this.fullScreenStateChanged.asObservable();
  }

  /**
   * 退出全屏 判断浏览器种类
   */
  public exitFullScreen() {
    // 判断各种浏览器，找到正确的方法
    const element: any = document;
    const exitMethod = element.exitFullscreen || // W3C
      element.mozCancelFullScreen ||    // Chrome等
      element.webkitExitFullscreen || // FireFox
      element.msExitFullscreen; // IE11
    if (exitMethod) {
      exitMethod.call(document);
    } else if (ActiveXObject) { // for Internet Explorer
      const wscript = new ActiveXObject('WScript.Shell');
      if (wscript !== null) {
        wscript.SendKeys('{F11}');
      }
    }
  }
}
