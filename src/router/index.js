import Vue from 'vue'
import VueRouter from 'vue-router'
import Message from "@/views/message/Message";
import PersonalPage from "@/views/personal/PersonalPage";
import Chat from "@/views/chat/Chat";
import Search from "@/views/search/Search";
import Info from "@/views/personal/Info";
import EditInfo from "@/views/personal/EditInfo";
import ChildEditPage from "@/views/personal/ChildEditPage";
import Test from "@/Test";

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'login',
        component: Test,
    },
    {
        path: '/message',
        name: 'Message',
        component: Message,
        meta: {
            showHeaderImg: true,
            showMore: true,
            showFooter: true,
        }
    },
    {
        path: '/personalPage',
        name: 'personalPage',
        component: PersonalPage,
        meta: {
            showFooter: false,
        }
    },
    {
        path: '/chat',
        name: 'chat',
        component: Chat,
        meta: {
            goBack: true,
            showListInfo: true,
        }
    },
    {
        path: '/search',
        name: 'search',
        component: Search,
    },
    {
        path: '/info',
        name: 'info',
        component: Info,
        meta: {
            goBack: true,
        }
    },
    {
        path: '/editInfo',
        name: 'editInfo',
        component: EditInfo,
        meta: {
            goBack: true,
        }
    },
    {
        path: '/childEditPage',
        name: 'childEditPage',
        component: ChildEditPage,
        meta: {
            goBack: true,
        }
    }

];

VueRouter.prototype.goBack = function () {
    this.isBack = true;
    window.history.go(-1)
};

const router = new VueRouter({
    // mode: 'history',
    base: process.env.BASE_URL,
    routes
});

export default router
