/**
 * Created by zack on 27/2/18.
 */
export class GlobalConst {
  public static readonly DateFormatGreaterMessage = '时间不能大于当前日期！';
  public static readonly DateFormatMaxCompareDateMessage = '最多支持30天同时比较！';
  public static readonly DateFormatStartGreaterMessage = '开始日期不能大于当前日期,请重新选择！';
  public static readonly DateFormatEndGreaterMessage = '结束日期不能大于当前日期,请重新选择！';
  public static readonly DateFormatStartGreaterThanEndMessage = '开始日期不能大于结束日期,请重新选择！';
  public static readonly PageSize = 45;
  public static readonly RegionID = '371700'; // 当前版本的城市信息
  public static readonly RegionCenter = [115.531195, 35.162258]; // 当前版本的城市中心点经纬度 [123.685680, 41.487020]
  // public static readonly RegionBoundSouthWest = [122.422106, 41.199858]; // 当前版本边界的西南点经纬度
  // public static readonly RegionBoundNorthEast = [123.814163, 43.042711]; // 当前版本边界的东北点经纬度
}
