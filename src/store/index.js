import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        isLoginEd: false,
        userId: -1,
        cache: "",
        // 正在浏览该用户的主页
        viewingId: -99,
        chatting: {
            // 正在与该id聊天
            id: -99,
            // 聊天类型：chat/group
            type: '',
        },

    },
    getters: {
        // 获取用户缓存
        getUserCache(state) {
            state.cache = localStorage.getItem("userCache");
            return JSON.parse(state.cache);
        },
        // 获取用户id
        getMyId(state) {
            state.cache = localStorage.getItem("userCache");
            return Number.parseInt(JSON.parse(state.cache).userId);
        },
        // 获取正在浏览的用户id
        getViewingId(state) {
            if (state.viewingId < 0) {
                let string = sessionStorage.getItem("SET_VIEWING_ID");
                state.viewingId = Number.parseInt(string);
            }
            return state.viewingId;
        },
        // 获取聊天信息
        getChatting(state) {
            let string = sessionStorage.getItem("chatting");
            state.chatting = JSON.parse(string);
            return state.chatting;
        }
    },
    mutations: {
        CACHE(state, user) {
            let string = JSON.stringify(user);
            state.cache = string;
            localStorage.setItem("userCache", string);
            console.log("已缓存...");
        },
        Set_LoginState: (state, loginEd) => {
            state.isLoginEd = loginEd;
        },
        Set_ViewingId(state, userId) {
            state.viewingId = Number.parseInt(userId);
            // userId转为string存入sessionStorage
            sessionStorage.setItem("SET_VIEWING_ID", userId.toString());
        },
        Set_chatting(state, chatting) {
            state.chatting = chatting;
            let string = JSON.stringify(chatting);
            sessionStorage.setItem("chatting", string);
        }
    },
    actions: {
        // 登录的时候设置缓存
        LoginAction({commit}, user) {
            commit('CACHE', user);
            commit('Set_LoginState', true);
        },
        // 退出登录的时候，清理缓存
        LogoutAction({commit}) {
            localStorage.removeItem('userCache');
            commit('Set_LoginState', false)
        },
        // 设置当前浏览用户id
        SET_VIEWING_ID({commit}, userId) {
            commit('Set_ViewingId', userId);
        },
        // 设置聊天信息
        SET_CHATTING({commit}, chatting) {
            commit('Set_chatting', chatting);
        }
    },
    modules: {}
})
