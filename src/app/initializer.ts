import { environment } from '../environments/environment';

/**
 * Created by zack on 12/5/17.
 */
export const initializer: any = {

  user: null,
  startTimeStamp: null, // 首次的服务器时间戳
  statusCode: null,

  boot: (callback) => {
    initializer.getUserMessage(callback);
  },
  getUserMessage: (callback: any) => {
    const header = {
      xhrFields: {
        withCredentials: true
      }
    };

    $.ajax(`${environment.CIPP_UNIVERSE}/user`, header).done((userData, status, xhr) => {
      initializer.user = userData;
      initializer.startTimeStamp = new Date(xhr.getResponseHeader('date')).getTime() / 1000;
      callback();
    }).fail(err => {
      if (err.status === 403) {
        callback(null);
      } else {
        console.log('暂不考虑其他错误！');
      }
    });
  }
};
