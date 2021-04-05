/**
 * Created by zack on 11/2/18.
 */
import { Observable, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
export enum SpecialKeyCode {
  Enter = 13,
  UpArrow = 38,
  DownArrow = 40,
  LeftArrow = 37,
  RightArrow = 39,
  Escape = 27,
  SpaceBar = 32,
  Ctrl = 17,
  Alt = 18,
  Tab = 9,
  Shift = 16,
  CapsLock = 20,
  WindowsKey = 91,
  WindowsOptionKey = 93,
  Backspace = 8,
  Home = 36,
  End = 35,
  Insert = 45,
  Delete = 46,
  PageUp = 33,
  PageDown = 34,
  NumLock = 144,
  PrintScreen = 44,
  ScrollLock = 145,
  PauseBreak = 19,
  F1 = 112,
  F2 = 113,
  F3 = 114,
  F4 = 115,
  F5 = 116,
  F6 = 117,
  F7 = 118,
  F8 = 119,
  F9 = 120,
  F10 = 121,
  F11 = 122,
  F12 = 123,
}

export class KeyboardHelper {

  public static Instance: KeyboardHelper = new KeyboardHelper();

  private keyboardSubject: Subject<any> = new Subject<any>();

  private isRunning = false; // 标识单件是否开始监听键盘输入了

  private isPause = false;

  private constructor() {
  }

  /**
   * 监听键盘事件
   */
  public listen(): Observable<any> {
    if (!this.isRunning) {
      // 当首次有人使用该单件时开启监听
      this.isRunning = true;
      document.addEventListener('keydown', event => {
        !this.isPause && this.keyboardSubject.next(event);
      });
    }

    // 当有人监听后再开始键盘接收
    return this.keyboardSubject.pipe(debounceTime(100));
  }

  /**
   * 暂定监听
   */
  public pause() {
    this.isPause = true;
  }

  /**
   * 继续监听
   */
  public continue() {
    this.isPause = false;
  }

}
