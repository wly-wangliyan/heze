/**
 * Created by zack on 7/2/18.
 */
/*
 * 每次添加新图片时需要执行此js文件,并且要按照顺序在后面追加图片,不可插入(替换图片在原位置即可)
 * js所在路径> node sprites-generator.js
 * 寻址方式:生成的是一长条图片集合,第一张的坐标点为0,0。向右依次坐标图标大小的负数(例如图片为40*40，
 * 则第二张图片的位置为-40,0 第三张-80,0 以此类推)
 * 图片命名:图片最后一位标识索引值(例如main_0.png标识索引为0的图片,arrow_up_push_25.jpg标识索引为25的
 * 图片),这样可以通过图片名称快速定位位置
 * 参考资料: https://github.com/aheckmann/gm
 * 文档: http://aheckmann.github.io/gm/docs.html
 * */
var gm = require('gm').subClass({imageMagick: true});

/**** 生成16*16的雪碧图 ****/

var path16X16 = './16*16/';
gm(path16X16 + 'search_close.png').background('#00000000')
  .append(path16X16 + 'search_close_push.png',
    true)
  .adjoin().write('16*16.png', function (err) {
  console.log(err);
});

/**** 生成18*18的雪碧图 ****/

var path18X18 = './18*18/';
gm(path18X18 + 'main_menu_close.png').background('#00000000')
  .append(path18X18 + 'main_menu_open.png',
    path18X18 + 'main_menu_right_arrow.png',
    path18X18 + 'arrow_down_gray_3.png',
    path18X18 + 'arrow_up_gray_4.png',
    path18X18 + 'arrow_up_red_5.png',
    path18X18 + 'arrow_down_green_6.png',
    path18X18 + 'arrow_default_7.png',
    true)
  .adjoin().write('18*18.png', function (err) {
  console.log(err);
});

/**** 生成20*20的雪碧图 ****/

var path20X20 = './20*20/';
gm(path20X20 + 'search_0.png').background('#00000000')
  .append(path20X20 + 'drop_down_1.png',
    path20X20 + 'search_close_push_2.png',
    path20X20 + 'search_close_3.png',
    true)
  .adjoin().write('20*20.png', function (err) {
  console.log(err);
});

/**** 生成22*22的雪碧图 ****/

var path22X22 = './22*22/';
gm(path22X22 + 'main_header_exit.png').background('#00000000')
  .append(path22X22 + 'main_header_pwd.png',
    path22X22 + 'main_menu_icon1.png',
    path22X22 + 'main_menu_icon1_push.png',
    path22X22 + 'main_menu_icon2.png',
    path22X22 + 'main_menu_icon2_push.png',
    path22X22 + 'main_menu_icon3.png',
    path22X22 + 'main_menu_icon3_push.png',
    path22X22 + 'main_menu_icon4.png',
    path22X22 + 'main_menu_icon4_push.png',
    path22X22 + 'main_menu_icon5.png',
    path22X22 + 'main_menu_icon5_push.png',
    path22X22 + 'main_menu_icon6.png',
    path22X22 + 'main_menu_icon6_push.png',
    path22X22 + 'main_menu_icon7.png',
    path22X22 + 'main_menu_icon7_push.png',
    path22X22 + 'table_car.png',
    path22X22 + 'table_car_push.png',
    path22X22 + 'table_carid.png',
    path22X22 + 'table_carid_push.png',
    path22X22 + 'table_connect.png',
    path22X22 + 'table_connect_push.png',
    path22X22 + 'table_delete.png',
    path22X22 + 'table_delete_push.png',
    path22X22 + 'table_edit.png',
    path22X22 + 'table_edit_push.png',
    path22X22 + 'table_employee.png',
    path22X22 + 'table_employee_push.png',
    path22X22 + 'table_map.png',
    path22X22 + 'table_map_push.png',
    path22X22 + 'table_refund.png',
    path22X22 + 'table_refund_push.png',
    path22X22 + 'table_set.png',
    path22X22 + 'table_set_push.png',
    path22X22 + 'table_shop.png',
    path22X22 + 'table_shop_push.png',
    path22X22 + 'table_view.png',
    path22X22 + 'table_view_push.png',
    path22X22 + 'table_reset.png',
    path22X22 + 'table_reset_push.png',
    path22X22 + 'main_menu_icon8_40.png',
    path22X22 + 'main_menu_icon8_push_41.png',
    path22X22 + 'table_examine_42.png',
    path22X22 + 'table_examine_push_43.png',
    true)
  .adjoin().write('22*22.png', function (err) {
  console.log(err);
});

/**** 生成25*25的雪碧图 ****/

var path25X25 = './25*25/';
gm(path25X25 + 'login_pwd_focus.png').background('#00000000')
  .append(path25X25 + 'login_pwd_normal.png',
    path25X25 + 'login_user_focus.png',
    path25X25 + 'login_user_normal.png',
    true)
  .adjoin().write('25*25.png', function (err) {
  console.log(err);
});

/**** 生成40*40的雪碧图 ****/

var path40X40 = './40*40/';
gm(path40X40 + 'stat_add_flow.png').background('#00000000')
  .append(path40X40 + 'stat_total_flow.png',
    path40X40 + 'stat_inside_flow.png',
    path40X40 + 'stat_outside_flow.png',
    path40X40 + 'stat_parking.png',
    path40X40 + 'stat_group_5.png',
    path40X40 + 'stat_region_6.png',
    true)
  .adjoin().write('40*40.png', function (err) {
  console.log(err);
});

/**** 生成60*60的雪碧图 ****/

var path60X60 = './60*60/';
gm(path60X60 + 'map_state_0.png').background('#00000000')
  .append(path60X60 + 'map_state_1.png',
    path60X60 + 'map_heat_2.png',
    path60X60 + 'map_heat_3.png',
    path60X60 + 'map_parking_4.png',
    path60X60 + 'map_parking_5.png',
    true)
  .adjoin().write('60*60.png', function (err) {
  console.log(err);
});
