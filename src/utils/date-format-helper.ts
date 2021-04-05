/**
 * Created by zack on 5/5/17.
 */
export class DateFormatHelper {

  public static NowBlock: any; // 用来同步当前服务器时间的闭包函数

  private static DefaultDateFormat = 'yyyy-MM-dd';

  private constructor() {
  }

  /**
   * 格式化时间 今日  默认显示: yyyy-MM-dd
   * @param dateFormat 可传格式
   * @returns string
   */
  public static NowDate(dateFormat: string = this.DefaultDateFormat): string {
    if (this.NowBlock) {
      return this.Format(this.NowBlock(), dateFormat);
    } else {
      return this.Format(new Date(), dateFormat);
    }
  }

  /**
   * 当前时刻
   * @returns Date 当前时间
   */
  public static get Now(): Date {
    if (this.NowBlock) {
      return this.NowBlock();
    } else {
      return new Date();
    }
  }

  /**
   * 当前时刻的时间戳
   * @returns number
   */
  public static get NowTimestamp(): number {
    if (this.NowBlock) {
      return this.NowBlock().getTime() / 1000;
    } else {
      return new Date().getTime() / 1000;
    }
  }

  /**
   * 天荒地老
   * @returns Date
   */
  public static get Forever(): Date {
    return new Date('9999/12/31');
  }

  /**
   * 直到尽头的时间戳
   * @returns number
   */
  public static get ForeverTimestamp(): number {
    return this.Forever.getTime() / 1000;
  }

  /**
   * 是否天荒地老 支持类型为时间戳，字符串，Date类型
   * @param date 测试日期
   * @returns boolean
   */
  public static IsForever(date: any): boolean {
    if (date instanceof Date) {
      return date.getFullYear() > 9000;
    } else if (!isNaN(date)) {
      return new Date(date * 1000).getFullYear() > 9000;
    } else {
      return new Date(date).getFullYear() > 9000;
    }
  }

  /**
   * 今天
   * @returns Date
   */
  public static get Today(): Date {
    return this.Ago(0);
  }

  /**
   * 昨天
   * @returns Date
   */
  public static get Yesterday(): Date {
    return this.Ago(1);
  }

  /**
   * 明天
   * @returns Date
   */
  public static get Tomorrow(): Date {
    return this.Ago(-1);
  }

  /**
   * 一周以前
   * @returns Date
   */
  public static get AWeekAgo(): Date {
    return this.Ago(6);
  }

  /**
   * 一个月以前
   * @returns Date
   */
  public static get AMonthAgo(): Date {
    const now = this.NowBlock ? this.NowBlock() : new Date();
    const year = now.getFullYear();
    const date = now.getDate();
    const month = now.getMonth();
    return new Date(year, month - 1, date);
  }

  /**
   * 多少天以前
   * @param days 天数
   * @returns Date
   */
  public static Ago(days: number): Date {
    const tempDate = this.NowBlock ? new Date(this.NowBlock().getTime() - 86400000 * days) : new Date(new Date().getTime() - 86400000 * days);
    return new Date(this.Format(tempDate, 'yyyy/MM/dd'));
  }

  /**
   * 上个月底
   * @returns Date
   */
  public static LateLastMonth(): Date {
    const now = this.NowBlock ? this.NowBlock() : new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    return new Date(year, month, 0);
  }

  /**
   * 格式化时间 指定日期  默认显示: yyyy/MM/dd
   * @param date 目标时间
   * @param dateFormat 目标格式
   * @returns string
   */
  public static FormatWithSolidus(date: any, dateFormat: string = 'yyyy/MM/dd'): string {
    return this.Format(date, dateFormat);
  }

  /**
   * 日期转换为时间戳 (日期会被转为当日0点0分)
   * @param date 日期
   * @param zeroDate 是否转为0点或24点
   */
  public static DateToTimeStamp(date: any, zeroDate: boolean): number {
    if (zeroDate) {
      return new Date(this.Format(date, 'yyyy/MM/dd') + ' 00:00:00').getTime() / 1000;
    } else {
      return new Date(this.Format(date, 'yyyy/MM/dd')).getTime() / 1000 + 86400;
    }
  }

  /**
   * 时间戳转日期字符串 默认为yyyy/MM/dd
   * @param timeStamp 时间戳
   * @param dateFormat 格式化
   * @returns string
   */
  public static TimeStampToString(timeStamp: number, dateFormat: string = 'yyyy/MM/dd'): string {
    return this.Format(new Date(timeStamp * 1000), dateFormat);
  }

  /**
   * 日期字符串转时间戳
   * @param dateStr 日期字符串
   * @returns Date
   */
  public static StringToTimeStamp(dateStr: string): Date {
    const formatDate = Date.parse(dateStr);
    if (!isNaN(formatDate)) {
      return new Date(Date.parse(dateStr.replace(/-/g, '/')));
    } else {
      return new Date();
    }
  }

  /**
   * 通用时间格式化方法
   * @param date 日期
   * @param formatTemplate 模板
   * @returns string
   */
  public static Format(date: any, formatTemplate: string = this.DefaultDateFormat): string {
    /*
     * eg:formatTemplate='yyyy-MM-dd hh:mm:ss';
     */
    const o = {
      'M+': new Date(date).getMonth() + 1, // month
      'd+': new Date(date).getDate(), // day
      'h+': new Date(date).getHours(), // hour
      'm+': new Date(date).getMinutes(), // minute
      's+': new Date(date).getSeconds(), // second
      'q+': Math.floor((new Date(date).getMonth() + 3) / 3), // quarter
      // tslint:disable-next-line:object-literal-key-quotes
      'S': new Date(date).getMilliseconds()
      // millisecond
    };

    if (/(y+)/.test(formatTemplate)) {
      formatTemplate = formatTemplate.replace(RegExp.$1, (new Date(date).getFullYear() + '').substr(4 - RegExp.$1.length));
    }

    for (const k in o) {
      if (new RegExp('(' + k + ')').test(formatTemplate)) {
        formatTemplate = formatTemplate.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
      }
    }
    return formatTemplate;
  }

  /**
   * 通过时长(月数)生成时间戳 例:1月1日-1月31日
   * @param startDate 开始时间
   * @param durationMonth 间隔月数
   */
  public static GenerateTimeStampByDurationMonth(startDate: Date, durationMonth: number, rollback: boolean = true): number {

    const endDate = new Date(this.AddMonth(startDate, durationMonth));
    const startDateDay = startDate.getDate();
    const endDateDay = endDate.getDate();
    if (startDateDay === endDateDay && rollback) {
      // 如果日期相同需要回退一天
      return endDate.getTime() / 1000 - 86400;
    } else {
      // 针对一月二月特殊处理
      return endDate.getTime() / 1000;
    }
  }

  /**
   * 通过减少月数生成时间戳
   * @param startDate 开始时间
   * @param durationMonth 减少月数
   */
  public static GenerateTimeStampByReduceMonth(startDate: Date, reduceMonth: number): number {
    const endDate = new Date(this.MinusMonth(startDate, reduceMonth));
    const endTime = endDate.getTime() / 1000;
    return endTime;
  }

  /**
   * 处理时间戳(起始时间00:00,结束时间24:00)
   * @param startDate 开始日期
   * @param endDate 结束日期
   * @returns string
   */
  public static GenerateSection(startDate: Date, endDate: Date): string {
    const tempStart = new Date(this.Format(startDate, 'yyyy/MM/dd')).getTime() / 1000;
    const tempEnd = new Date(this.Format(endDate, 'yyyy/MM/dd')).getTime() / 1000 + 86400;
    return tempStart + ',' + tempEnd;
  }

  /**
   * 处理时间戳(起始日期00:00,结束日期23:59:59)
   * @param startDate 开始日期yyyy/MM/dd
   * @param endDate 结束日期yyyy/MM/dd
   * @returns string
   */
  public static GenerateSection2(startDate: Date, endDate: Date): string {
    const tempStart = new Date(startDate).setHours(0, 0, 0, 0) / 1000;
    const tempEnd = new Date(endDate).setHours(23, 59, 59, 0) / 1000;
    return `${tempStart},${tempEnd}`;
  }

  /**
   * 拼接两个时间
   * @param Date date 日期
   * @param Date time 时间
   * @param Boolean ignoreSecond 是否忽略秒值
   * @returns Date
   */
  public static ContactDateAndTime(date: Date, time: Date, ignoreSecond: boolean): Date {
    if (ignoreSecond) {
      return new Date(date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        time.getHours(),
        time.getMinutes(),
        0);
    }
    return new Date(date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      time.getHours(),
      time.getMinutes(),
      time.getSeconds());
  }

  /**
   * 比较两个时间大小
   * @param Date date1 日期1
   * @param Date time1 时间1
   * @param Date date2 日期2
   * @param Date time2 时间2
   * @param Boolean ignoreSecond 是否忽略秒值
   * @returns number
   */
  public static CompareDateAndTime(date1: Date, time1: Date, date2: Date, time2: Date, ignoreSecond: boolean): number {
    const dateTime1 = this.ContactDateAndTime(date1, time1, ignoreSecond).getTime() / 1000;
    const dateTime2 = this.ContactDateAndTime(date2, time2, ignoreSecond).getTime() / 1000;
    if (dateTime1 > dateTime2) {
      return 1;
    } else if (dateTime1 === dateTime2) {
      return 0;
    } else {
      return -1;
    }
  }

  /* 添加月 */
  public static AddMonth(d, m) {
    let date: any = this.Format(d, 'yyyy-MM-dd');
    const ds = date.split('-'), _d = ds[2] - 0;
    const nextM = new Date(ds[0], ds[1] - 1 + m + 1, 0);
    const max = nextM.getDate();
    date = new Date(ds[0], ds[1] - 1 + m, _d > max ? max : _d);
    return date.toLocaleDateString().match(/\d+/g).join('/');
  }

  /* 减少月 */
  private static MinusMonth(d, m) {
    let date: any = this.Format(d, 'yyyy-MM-dd');
    const ds = date.split('-'), _d = ds[2] - 0;
    const nextM = new Date(ds[0], ds[1] - 1 - m + 1, 0);
    const max = nextM.getDate();
    date = new Date(ds[0], ds[1] - 1 - m, _d > max ? max : _d);
    return date.toLocaleDateString().match(/\d+/g).join('/');
  }

  private static ProcessMonth(date: Date, month: number): Date {
    const daysInMonthList = [
      [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
      [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    ];

    let totalMonth = date.getFullYear() * 12 + date.getMonth();
    totalMonth += month;
    const rYear = Math.floor(totalMonth / 12);
    const rMonth = totalMonth % 12 + 1;
    let rDay = date.getDate();

    const daysInMonth = daysInMonthList[0]; // todo:这个地方判断闰年还是平年
    if (rDay > daysInMonth[rMonth]) {
      rDay = daysInMonth[rMonth];
    }
    return new Date(rYear, rMonth - 1, rDay);
  }

  /**
   * 多少月以前或以后
   * @param num 月数 <0以前  >0 以后
   * @returns Date
   */
  public static MonthDate(num: number): Date {
    const now = this.NowBlock ? this.NowBlock() : new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    return new Date(year, month + num);
  }

  /**
   * 获取某时间的月初 00:00:00
   * @returns Date
   */
  public static GetFirstDayOfMonth(date: Date): Date {
    return new Date(new Date(date.setDate(1)).setHours(0, 0, 0, 0));
  }

  /**
   * 获取某时间的月底 23:59:59
   * @returns Date
   */
  public static GetLastDayOfMonth(date: Date): Date {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(new Date(year, month + 1, 0).setHours(23, 59, 59, 0));
  }
}
