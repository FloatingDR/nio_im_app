import Vue from 'vue';
import Vuex from 'vuex';
import CACHE from "@/api/cache";
import {WS_URL} from "@/api/urls";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        websocket: null,
        wsConnected: false,
        eventList: [],
        chatList: [],
    },
    getters: {
        onEvent(state) {
            return function (method) {
                let index = state.eventList.map((T) => {
                    return T.method
                }).indexOf(method);
                if (state.eventList.length > 0 && index >= 0) {
                    // 将该event拷贝为一个对象返回
                    let result = Object.assign({}, state.eventList[index]);
                    // 删除
                    state.eventList.splice(index, 1);
                    return result.data;
                }
                return null;
            }
        },
    },
    mutations: {
        // websocket 初始化
        WS_INIT(state) {
            INIT(state);
        },

        WS_SEND_CHAT(state, {receiverId, data}) {
            if (!window.WebSocket) {
                return;
            }
            let chat = {
                header: {
                    msgType: "CHAT",
                    priority: 0
                },
                data: data,
                sendTime: new Date(),
                sendId: CACHE.getMyId(),
                receiverId: receiverId,
                signed: false
            };

            console.log(chat);
            if (state.websocket.readyState === WebSocket.OPEN) {
                state.websocket.send(JSON.stringify(chat));
            } else {
                alert("WebSocket 连接没有建立成功！");
            }
        }

    },
    actions: {
        WS_INIT({commit}, url) {
            commit('WS_INIT', url);
        },
        WS_SEND_CHAT({commit}, {receiverId, data}) {
            commit('WS_SEND_CHAT', {receiverId, data})
        }
    }
})

// 初始化ws连接
function INIT(state) {
    let url = WS_URL;
    if (!window.WebSocket) {
        window.WebSocket = window.MozWebSocket;
    }
    if (window.WebSocket) {
        if (!state.websocket) {
            state.websocket = new WebSocket(url);
        }
        state.websocket.onopen = function () {
            console.log("打开 WebSocket 服务正常，浏览器支持 WebSocket!");
            state.wsConnected = true;
            // 发送心跳包
            sendPing(this);
            // 发送登录信息
            sendLogin(this);
        };
        state.websocket.onmessage = function (event) {
            let data = JSON.parse(event.data);
            if (data.header.msgType === "PANG") {
                // ping 返回 25S定时
                let sc = this;
                setInterval(function () {
                    console.log("客户端发送心跳！");
                    sendPing(sc);
                }, 25000);
            } else {
                state.eventList.push({
                    method: 'RECEIVED_DATA',
                    data: data
                });
            }
        };
        state.websocket.onerror = function (err) {
            state.websocket.close();
            console.log(err);
        };
        // 断线重连
        state.websocket.onclose = function () {
            console.log("WebSocket关闭");
            state.websocket = null;
            state.wsConnected = false;
            if (!state.wsConnected) {
                setTimeout(function () {
                    if (!state.wsConnected) {
                        console.log('尝试重连...');
                        INIT(state);
                    }
                }, 5000);
            }
        };
    } else {
        console.log("抱歉，您的浏览器不支持 WebSocket 协议！");
    }
}

// 发送消息
function send(socket, message) {
    if (!window.WebSocket) {
        return;
    }
    if (socket.readyState === WebSocket.OPEN) {
        socket.send(message);
    } else {
        console.log("WebSocket 连接没有建立成功！");
    }
}

// 发送心跳信号
function sendPing(socket) {
    let ping = {
        header: {
            id: -1,
            msgType: "PING",
            priority: 0
        },
        data: "PING",
        sendTime: new Date(),
        sendId: CACHE.getMyId(),
        crcCode: 0xEF6ED,
    };
    send(socket, JSON.stringify(ping));
}

// 发送登录信号
function sendLogin(socket) {
    let login = {
        header: {
            id: -1,
            msgType: "LOGIN",
            priority: 0
        },
        data: "LOGIN",
        sendId: CACHE.getMyId()
    };
    send(socket, JSON.stringify(login));
}
