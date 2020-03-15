import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import websocket from './store/WebSocketStore'

import {
    Tabbar, TabbarItem, Icon, Col, Row, Lazyload, Image, PullRefresh,
    List, Cell, Search, Sticky, Skeleton, SwipeCell, Button, Card, Notify, NoticeBar
    , Loading, Tag, ImagePreview, CellGroup, DatetimePicker, Popup, Radio, RadioGroup
    , Picker, Field, Area, Uploader, Toast,Form
}
    from 'vant';

Vue.use(Tabbar).use(TabbarItem).use(Icon).use(Col).use(Row).use(Lazyload)
    .use(Image).use(PullRefresh).use(List).use(Cell).use(Search).use(Sticky)
    .use(Skeleton).use(SwipeCell).use(Button).use(Card).use(Notify).use(NoticeBar)
    .use(Loading).use(Tag).use(ImagePreview).use(CellGroup).use(DatetimePicker)
    .use(Popup).use(Radio).use(RadioGroup).use(Picker).use(Field).use(Area)
    .use(Uploader).use(Toast).use(Form);

Vue.config.productionTip = false;
Vue.prototype.$websocket = websocket;

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
