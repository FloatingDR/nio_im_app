import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import websocket from './store/WebSocketStore'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/icon/iconfont.css';

import {
    Tabbar, TabbarItem, Icon, Col, Row, Lazyload, Image, PullRefresh,
    List, Cell, Search, Sticky, Skeleton, SwipeCell, Button, Card, Notify, NoticeBar
    , Loading, Tag, ImagePreview, CellGroup, DatetimePicker, Popup, Radio, RadioGroup
    , Picker, Field, Area, Uploader, Toast, Form, IndexBar, IndexAnchor, Collapse,
    CollapseItem
}
    from 'vant';

Vue.use(Tabbar).use(TabbarItem).use(Icon).use(Col).use(Row).use(Lazyload)
    .use(Image).use(PullRefresh).use(List).use(Cell).use(Search).use(Sticky)
    .use(Skeleton).use(SwipeCell).use(Button).use(Card).use(Notify).use(NoticeBar)
    .use(Loading).use(Tag).use(ImagePreview).use(CellGroup).use(DatetimePicker)
    .use(Popup).use(Radio).use(RadioGroup).use(Picker).use(Field).use(Area)
    .use(Uploader).use(Toast).use(Form).use(IndexBar).use(IndexAnchor).use(Collapse)
    .use(CollapseItem);

Vue.config.productionTip = false;
Vue.prototype.$websocket = websocket;
Vue.use(ElementUI);

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');

/**
 *对Date的扩展，将 Date 转化为指定格式的String
 *月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
 *年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 *例子：
 *(new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
 *(new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
 */
Date.prototype.format = function (fmt) {
    let o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};
