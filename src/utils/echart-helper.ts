import { isUndefined } from 'util';
import { DateFormatHelper } from './date-format-helper';

/**
 * Created by zack on 27/2/18.
 */
export class EChartHelper {

  /* 按小时显示的X轴数据 */
  public static get PerHourChartX(): Array<string> {
    const chartX = [];
    for (let hour = 0; hour < 24; hour++) {
      if (hour % 3 === 0) {
        chartX.push(hour.toString().length === 1 ? '0' + hour.toString() : hour.toString());
      } else {
        chartX.push('');
      }
    }
    return chartX;
  }

  /* 生成表格日期数据 */
  public static GenerateDateArray(startDate: Date, endDate: Date, dateFormat = 'yyyy-MM-dd'): Array<ChartXYValue> {
    const formatStartDate = DateFormatHelper.DateToTimeStamp(startDate, true);
    const formatEndDate = DateFormatHelper.DateToTimeStamp(endDate, true);
    const array = new Array<ChartXYValue>();
    let subDate = formatEndDate - formatStartDate;
    subDate = subDate < 0 ? 0 : subDate;
    const days: number = subDate / 24 / 3600;
    for (let index = 0; index <= days; index++) {
      const day = new ChartXYValue();
      day.XValue = DateFormatHelper.Format(new Date(startDate.getTime() + 1000 * 24 * 3600 * index), dateFormat);
      day.YValue = 0;
      array.push(day);
    }
    return array;
  }

  /* 生成星期表格日期数据 */
  public static GenerateWeekArray(startDate: Date, endDate: Date): Array<ChartXYValue> {
    // 处理星期范围
    const unitCycle = 604800; // 24 * 3600 * 7;
    // 计算开始日期
    const subStartDays = startDate.getDay() === 0 ? 6 : startDate.getDay() - 1;
    const formatStartTimeStamp = DateFormatHelper.DateToTimeStamp(startDate, true);
    const start = formatStartTimeStamp - subStartDays * 86400;
    // 计算结束日期
    const subEndDays = endDate.getDay() === 0 ? 0 : 7 - endDate.getDay();
    const formatEndTimeStamp = DateFormatHelper.DateToTimeStamp(endDate, false);
    const end = formatEndTimeStamp + subEndDays * 86400;
    const array = new Array<ChartXYValue>();
    for (let curTimeStamp = start; curTimeStamp < end; curTimeStamp = curTimeStamp + unitCycle) {
      const day = new ChartXYValue();
      day.XValue = DateFormatHelper.Format(new Date(curTimeStamp * 1000));
      day.YValue = 0;
      array.push(day);
    }
    return array;
  }

  /* 生成月份表格日期数据 */
  public static GenerateMonthArray(startDate: Date, endDate: Date): Array<ChartXYValue> {
    const startYear = startDate.getFullYear();
    const startMonth = startDate.getMonth() + 1;
    const endYear = endDate.getFullYear();
    const endMonth = endDate.getMonth() + 1;

    const array = new Array<ChartXYValue>();

    if (startYear < endYear) {
      // 先计算初年的月份
      for (let curMonth = startMonth; curMonth <= 12; curMonth++) {
        const day = new ChartXYValue();
        day.XValue = DateFormatHelper.Format(new Date(`${startYear}/${curMonth}/01`));
        day.YValue = 0;
        array.push(day);
      }
      // 计算间隔年份的月
      for (let curYear = startYear + 1; curYear < endYear; curYear++) {
        for (let curMonth = 1; curMonth <= 12; curMonth++) {
          const day = new ChartXYValue();
          day.XValue = DateFormatHelper.Format(new Date(`${curYear}/${curMonth}/01`));
          day.YValue = 0;
          array.push(day);
        }
      }

      // 计算结束年份的月
      for (let curMonth = 1; curMonth <= endMonth; curMonth++) {
        const day = new ChartXYValue();
        day.XValue = DateFormatHelper.Format(new Date(`${endYear}/${curMonth}/01`));
        day.YValue = 0;
        array.push(day);
      }
    } else {
      // 相等计算中间月份
      for (let curMonth = startMonth; curMonth <= endMonth; curMonth++) {
        const day = new ChartXYValue();
        day.XValue = DateFormatHelper.Format(new Date(`${endYear}/${curMonth}/01`));
        day.YValue = 0;
        array.push(day);
      }
    }

    return array;
  }

  /* 生成周期日期数据 */
  public static GenerateCycleArray(startDate: Date, endDate: Date, cycle: ComputingCycle, dateFormat = 'yyyy-MM-dd'): Array<ChartXYValue> {
    switch (cycle) {
      case ComputingCycle.day: {
        return EChartHelper.GenerateDateArray(startDate, endDate, dateFormat);
      }
      case ComputingCycle.week: {
        return EChartHelper.GenerateWeekArray(startDate, endDate);
      }
      case ComputingCycle.month: {
        return EChartHelper.GenerateMonthArray(startDate, endDate);
      }
    }
  }

  /**
   * 生成坐标数据
   * @param chartData 数据
   * @param decimalY 保留小数点数
   * @returns ChartXY
   */
  public static GenerateChartXY(chartData: Array<ChartXYValue>, decimalY?: number): ChartXY {
    const chartXY = new ChartXY();

    chartData.forEach((item) => {
      /* 生成横竖轴数据 */
      chartXY.chartX.push(item.XValue);
      chartXY.chartY.push((decimalY === undefined) ? item.YValue : item.YValue.toFixed(decimalY));
    });
    return chartXY;
  }

  /* 生成日期字符串 content:2017-01-01 */
  public static FormatDateString(content: string, cycle: ComputingCycle): string {
    let res;
    switch (cycle) {
      case ComputingCycle.day: {
        res = content;
      }
        break;
      case ComputingCycle.week: {
        res = this.FormatWeekDate(content);
      }
        break;
      case ComputingCycle.month: {
        res = this.FormatMonthDate(content);
      }
        break;
    }
    return res;
  }

  /* 格式化时间为周形式 */
  private static FormatWeekDate(date: string): string {
    const timeStamp = new Date(date.replace(/-/g, '/')).getTime() / 1000 + 86400 * 6;
    const xValue = date + ' ~ ' + DateFormatHelper.Format(new Date(timeStamp * 1000));
    return xValue;
  }

  /* 格式化时间为月形式 */
  private static FormatMonthDate(date: string): string {
    const temp = new Date(date.replace(/-/g, '/'));
    const year = temp.getFullYear();
    const month = temp.getMonth() + 1;
    const day = new Date(year, month, 0).getDate();
    const xValue = date + ' ~ ' + DateFormatHelper.Format(new Date(`${year}/${month}/${day}`));
    return xValue;
  }

  /* 格式化流量 */
  public static FormatFlow(flow: number, unit: string = '辆'): string {
    if (flow >= 10000) {
      const temp = (flow / 10000).toFixed(2);
      return Number(temp) + '万' + unit;
    }
    return Math.floor(flow) + unit;
  }

  public static FormatTurnover(turnover: number): string {
    return turnover.toFixed(4);
  }
}

export const EChartColors = [
  '#1c76ff', '#e43d34', '#50aac7', '#ffc26c', '#db5082', '#b6d2f2',
  '#615c5b', '#ac6d32', '#fa7c25', '#fb9150', '#fcd779', '#a4d7a7',
  '#65bb69', '#25a69a', '#526efe', '#525da7', '#7b4efe', '#cb5db7',
  '#de7591', '#46567a', '#abb8c1', '#deb4c2', '#597cac', '#53adcb',
  '#d75670', '#ed9b9a', '#b9d0f5', '#a4d7a7', '#ffce40', '#90a4ae',
  '#ae318c', '#43a046', '#8858a1', '#c3195b', '#8d26a9', '#7987cb',
  '#7cb442', '#dce875', '#b2b24b', '#298028', '#de6600', '#fabf00',
  '#757575', '#e84937', '#005cac', '#007d32', '#f08400', '#4d352c',
  '#c86006', '#80531a', '#b2894f', '#785646', '#d74414', '#4dd1e1',
  '#25a69a', '#00a771', '#283692', '#42a6f6'];

/* 图表的横竖轴数据结构 */
export class ChartXY {
  public chartX: Array<any> = [];
  public chartY: Array<any> = [];
}

/* 图表的横竖轴数据项 */
export class ChartXYValue {
  public XValue: any;
  public YValue: any;

  constructor(xValue?: any, yValue?: any) {
    if (xValue) {
      this.XValue = xValue;
    }
    if (yValue || yValue === 0) {
      this.YValue = yValue;
    }
  }
}

// 计算周期
export enum ComputingCycle {
  day = 0,
  week,
  month,
}

export class PieDataItem {
  public name: string; // 名称
  public value: number; // 数量
  public color: string; // 颜色
}

