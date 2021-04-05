/**
 * Created by zack on 13/2/18.
 */

/* 统一管理控制 */
export class LocalStorageProvider {

  public static Instance: LocalStorageProvider = new LocalStorageProvider();

  /* 键值都放在这里 */
  public static readonly HistoryLoginName = 'history-login-name';

  /* 有效键值列表,所有键值都要在其中 */
  private validList: Array<string> = ['history-login-name'];

  private main: any;

  private constructor() {
    if (!localStorage) {
      // throw new Error('Current browser does not support Local Storage');
    }
    this.main = localStorage;
  }

  public set(key: string, value: string): void {
    if (this.validList.indexOf(key) < 0) {
      console.warn('The key is not existed. see Class LocalStorageProvider. by zwl');
    }

    this.main[key] = value;
  }

  public get(key: string): string {
    if (this.validList.indexOf(key) < 0) {
      console.warn('The key is not existed. see Class LocalStorageProvider. by zwl');
    }
    return this.main[key];
  }

  public setObject(key: string, value: any): void {
    if (this.validList.indexOf(key) < 0) {
      console.warn('The key is not existed. see Class LocalStorageProvider. by zwl');
    }
    this.main[key] = JSON.stringify(value);
  }

  public getObject(key: string): any {
    if (this.validList.indexOf(key) < 0) {
      console.warn('The key is not existed. see Class LocalStorageProvider. by zwl');
    }
    if (this.main[key] !== null && this.main[key] !== undefined) {
      return JSON.parse(this.main[key] || '{}');
    }
    return null;
  }

  public remove(key: string): any {
    if (this.validList.indexOf(key) < 0) {
      console.warn('The key is not existed. see Class LocalStorageProvider. by zwl');
    }
    this.main.removeItem(key);
  }

  public clear() {
    this.validList.forEach(key => {
      this.main.remove(key);
    });
  }
}
