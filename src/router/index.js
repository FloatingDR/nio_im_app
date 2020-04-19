import Vue from 'vue'
import VueRouter from 'vue-router'
import Message from "@/views/message/Message";
import PersonalPage from "@/views/personal/PersonalPage";
import Chat from "@/views/chat/Chat";
import Search from "@/views/search/Search";
import Info from "@/views/personal/Info";
import EditInfo from "@/views/personal/EditInfo";
import ChildEditPage from "@/views/personal/ChildEditPage";
import Friends from "@/views/friends/Friends";
import Layout from "@/components/Layout";
import HeaderTemplate from "@/components/HeaderTemplate";
import FooterTemplate from "@/components/FooterTemplate";
import Login from "@/views/login/Login";
import Register from "@/views/register/Register";
import Setting from '@/views/setting/Setting'

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'login',
        component: Login,
    },
    {
        path: '/index',
        name: 'index',
        component: Layout,
        children: [
            {
                path: 'message',
                name: 'Message',
                components: {
                    'header': HeaderTemplate,
                    'main': Message,
                    'footer': FooterTemplate,
                },
                meta: {
                    tag: '消息',
                    showHeaderImg: true,
                    showMore: true,
                    showFooter: true,
                }
            },
            {
                path: 'friends',
                components: {
                    'header': HeaderTemplate,
                    'main': Friends,
                    'footer': FooterTemplate,
                },
                meta: {
                    tag: '联系人',
                    showFooter: true,
                }
            },
            {
                path: 'setting',
                name: 'setting',
                components: {
                    'header': HeaderTemplate,
                    'main': Setting,
                    'footer': FooterTemplate,
                },
                meta:{
                    tag: '设置',
                    showFooter: true,
                }
            },
        ],

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
    },
    {
        path: '/register',
        name: 'Register',
        component: Register,
    },

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
