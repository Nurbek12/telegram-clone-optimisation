import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios';
import { io } from 'socket.io-client';

const url = '/';
const socket = io(url);

Vue.use(Vuex)

const token = localStorage.getItem('telegram-clone-token');
const http = axios.create({ baseURL: url })

if(token){
    http.defaults.headers.common['Authorization'] = token;
}

export default new Vuex.Store({
    state: {
        nav_drawer: false,
        theme: JSON.parse(localStorage.getItem('telegram-clone-theme')) || false,
        user: JSON.parse(localStorage.getItem('telegram-clone-user')) || null,
        token: localStorage.getItem('telegram-clone-token') || null,
        
        room: null,
        messages: [],
        rooms: [],
        online_users: [],
        images: [],

        changedMessage: null,
        messageMenu: false,
        mess_menu_x: 0,
        mess_menu_y: 0,
        media: new Audio(),
        media_paused: true,
        media_time: 0,
        chat_bg: localStorage.getItem('telegram-clone-chat-bg') || null,

        modal_create_group: false,
        modal_create_chanel: false,
        modal_setting: false,
        modal_room_info: false,
        modal_overlay: false,
    },
    getters: {
        theme: (state) => state.theme,
        nav_drawer: state => state.nav_drawer,
        room: state => state.room,
        messages: state => state.messages,
        isLoggedIn: state => !!state.token,
        user: state => state.user,
        user_id: state => state.user?._id,
        rooms: state => state.rooms,
        sorted_rooms: state => state.rooms.sort((a, b) => b?.lastMessage?.date - a?.lastMessage?.date),
        changedMessage: state => state.changedMessage,
        messageMenu: state => state.messageMenu,
        mmx: state => state.mess_menu_x,
        mmy: state => state.mess_menu_y,
        media: state => state.media,
        media_paused: state => state.media_paused,
        media_time: state => state.media_time,
        images: state => state.images,

        modal_create_group: state => state.modal_create_group,
        modal_create_chanel: state => state.modal_create_chanel,
        modal_setting: state => state.modal_setting,
        modal_room_info: state => state.modal_room_info,
        modal_overlay: state => state.modal_overlay,
        
        online: state => state.online_users,
        chatbg: state => state.chat_bg,
    },
    actions: {
        login: async (_, form) => {
            await http.post('/auth', form)
        },
        verify: async ({commit}, form) => {
            const { data } = await http.post('/auth/verify', form)
            if(data.status){
                commit('change_user', data.result)
                commit('change_token', data.token)
                http.defaults.headers.common['Authorization'] = data.token
            }
            return data
        },
        upload_avatar: async ({commit}, file) => {
            const fd = new FormData()
            fd.append('image', file)
            const { data } = await http.put("/user/avatar/upload", fd)
            if(data.status){
                console.log(data);
                commit('change_user', data.result)
            }
        },
        remove_avatar: async ({commit}, image) => {
            const { data } = await http.put("/user/avatar/remove/", {image})
            if(data.status){
                commit('change_user', data.result)
            }
        },
        update_profile: async ({commit}, form) => {
            const { data } = await http.put('/user/update', form)
            if(data.status){
                commit('change_user', data.result)
            }
            return data;
        },
        getAllChat: async ({commit}) => {
            const { data } = await http.get('/chat')
            if(data.status){
                commit('set_rooms', data.result)
                // console.log(data.result);
            }
        },
        sendMessage: async (_, form) => {
            const { data } = await http.post(`/message`, form)
            if(data.status){
                socket.emit('send-message', data.result)
            }
            // commit('empty')
        },
        updateMessage: async (_, fdata) => {
            const { data } = await http.put(`/message/${fdata._id}`, { text: fdata.text })
            if(data.status){
                socket.emit('edit-message', fdata)
            }
            // commit('empty')
        },
        deleteMessage: async (_, message) => {
            const { data } = await http.delete(`/message/${message._id}`)
            if(data.status){
                // console.log(data);
                socket.emit('delete-message', message)
                // commit('removeMessage', message)
            }
            // commit('empty')
        },
        viewMessage: async (_, message) => {
            const { data } = await http.put(`/message/view/${message._id}`)
            if(data.status){
                socket.emit('view-message', message)
            }
            // commit('empty')
        },
        searchUsers: async (_, query) => {
            const { data } = await http.get(`/user/search/${query}`)
            // commit('empty')
            if(data.status) return data.result
        },
        leaveChat: async (_, id) => {
            const { data } = await http.delete(`/chat/${id}`)
            if(data.status) socket.emit('delete-chat', id)
        },
        createChat: async ({commit}, fdata) => {
            const { data } = await http.post('/chat/create', fdata);
            if(data.status){
                commit('add_room', data.result)
                socket.emit('join-chat', {...data.result, target: fdata.user})
                commit('change_room_id', data.result._id)
                // return data.result
            }
        },
        createGroup: async ({commit, dispatch}, fdata) => {
            const { data } = await http.post('/chat/create', fdata);
            if(data.status){
                commit('add_room', data.result)
                socket.emit('join-chat', data.result)
                dispatch('sendMessage', {
                    text: 'Группа создан',
                    date: Date.now(),
                    chatid: data.result._id,
                })
            }
        },
        createChanel: async ({commit, dispatch}, fdata) => {
            const { data } = await http.post('/chat/create', fdata);
            if(data.status){
                commit('add_room', data.result)
                socket.emit('join-chat', data.result)
                dispatch('sendMessage', {
                    text: 'Канал создан',
                    date: Date.now(),
                    chatid: data.result._id,
                })
            }
        },
        followGroup: async ({commit, dispatch, getters}, id) => {
            const { data } = await http.put(`/chat/follow/${id}`);
            if(data.status){
                socket.emit('add-user', {...getters.user, typing: false, chatid: data.result._id})
                commit('add_room', {
                    ...data.result,
                    messages: getters.messages,
                })
                commit('change_room_id', data.result._id)
                if(data.result.roomType === 'group') dispatch('sendMessage', {
                    text: `${getters.user.name} тепер в группе`,
                    date: Date.now(),
                    chatid: id,
                })
            }
        },
        fgid: async ({dispatch, getters}, id) => {
            const { data } = await http.put(`/chat/follow/${id}`);
            if(data.status){
                socket.emit('add-user', {...getters.user, typing: false, chatid: data.result._id})
                if(data.result.roomType === 'group') dispatch('sendMessage', {
                    text: `${getters.user.name} тепер в группе`,
                    date: Date.now(),
                    chatid: id,
                })
            }
        },
        leaveGroup: async ({commit, getters, dispatch}, chatid) => {
            commit('delete_room', chatid)
            const { data } = await http.put(`/chat/unfollow/${chatid}`)
            if(data.status) socket.emit('unfollow-group', {chatid, user: getters.user_id})
            if(data.result.roomType === 'group') dispatch('sendMessage', {
                text: `${getters.user.name} покинул(а) группу`,
                date: Date.now(),
                chatid: chatid,
            })
        },
        typingText: (_, data) => {
            socket.emit('typing', data)
            // commit('empty')
        },
        socketConnection: ({commit, getters}) => {
            socket
            .emit('create-connect', getters.user_id)
            .on('add-message', message => {
                commit('addMessage', message)
                if(message.chatid !== getters.room?._id) commit('notification', message)
            })
            .on('remove-message', message => {
                commit('removeMessage', message)
            })
            .on('editing-message', message => {
                commit('editMessage', message)
            })
            .on('add-new-chat', (chat) => {
                commit('add_room', chat)
            })
            .on('user-typed', data => {
                commit('typinguser', data)
            })
            .on('viewing-message', message => {
                commit('viewMessage', message)
            })
            .on('user-add', user => {
                commit('add_user_to_group', user)
            })
            .on('user-delete-chat', chatid => {
                commit('delete_room', chatid)
            })
            .on('user-unfollow-group', data => {
                commit('user_delete_group', data)
            })
            .on('get-online', users => commit('set_online', users))
            .on('add-online', id => commit('add_online', id))
            .on('remove-online', id => commit('remove_online', id))
        }
    },
    mutations: {
        open_nav: (state, b) => state.nav_drawer = b,
        change_theme: (state, cb) => {
            cb(state.theme)
            localStorage.setItem('telegram-clone-theme', !state.theme)
            state.theme = !state.theme;
        },
        logout: state => {
            state.user = null;
            state.token = null;
            localStorage.removeItem('telegram-clone-token')
            localStorage.removeItem('telegram-clone-user')
            window.location.href = '/login'
        },
        empty: () => {},
        change_token: (state, data) => {
            // if(data){
            state.token = data;
            localStorage.setItem('telegram-clone-token', data)
            // }else {
            //     state.token = null;
            //     localStorage.removeItem('telegram-clone-token')
            // }
        },
        change_user: (state, data) => {
            // if(data){
            state.user = data;
            localStorage.setItem('telegram-clone-user', JSON.stringify(data))
            // }else {
            //     state.user = null;
            //     localStorage.removeItem('telegram-clone-user')
            // }
        },

        set_online: (state, users) => state.online_users = users,
        add_online: (state, id) => state.online_users.push(id),
        remove_online: (state, id) => state.online_users = state.online_users.filter(u => u !== id)            ,

        set_rooms: (state, data) => {
            state.rooms = data;
        },
        add_room: (state, data) => {
            state.rooms.push({
                ...data,
                room_users: data.users.filter(u => u._id !== state.user._id).map(u => ({...u, typing: false})),
                users: data.users.map(u => u._id),
                messages: data?.messages || [],
                lastMessage: {},
                not_viewed: 0,
            });
        },
        delete_room(state, id){
            if(state.room?._id === id){
                state.room = null;
                state.messages = [];
            }
            state.rooms = state.rooms.filter(el => el._id !== id)
        },
        change_room: (state, data) => {
            if(data){
                if(data.roomType){
                    const { messages, ...other } = data;
                    state.room = other;
                    state.messages = messages;
                }else{
                    const chat = state.rooms.find(room => room.users.find(user => user === data._id) && room.roomType === 'personal')
                    state.room = chat?chat:data;
                    state.messages = chat?.messages || [];
                }
            }else {
                state.room = null;
                state.messages = [];
            }
        },
        change_room_id: (state, id) => {
            // if(state.room?._id === id) return
            const chat = state.rooms.find(room => room._id === id)
            if(chat){
                const { messages, ...other } = chat;
                state.room = other;
                state.messages = messages;
            }
        },
        user_delete_group: (state, data) => {
            const chat = state.rooms.find(room => room._id === data.chatid)
            if(!chat) return
            chat.room_users = chat.room_users.filter(user=>user._id !== data.user)
            chat.users = chat.users.filter(user=>user !== data.user)
            if(state.room?._id === data.chatid){
                state.room.room_users = chat.room_users;
                state.room.users = chat.users;
            }
        },
        add_user_to_group: (state, user) => {
            const chat = state.rooms.find(room => room._id === user.chatid)
            if(!chat) return
            chat.room_users.push(user)
            chat.users.push(user._id)
        },

        addMessage: (state, message) => {
            const date = new Date(message.date);
            const chat = state.rooms.find(c => c._id === message.chatid);
            const messdate = chat.messages[chat.messages.length-1]?._id
            chat.lastMessage = message;
            // console.log(date.getDate(), messdate?.day, (date.getMonth()+1), messdate?.month);
            if(date.getDate() === messdate?.day && (date.getMonth()+1) === messdate?.month){
                chat.messages[chat.messages.length - 1].messages.push(message)
            }else{
                chat.messages.push({
                    _id: { day: date.getDate(), month: date.getMonth() + 1},
                    date: message.date,
                    messages: [message]
                })
            }
            if(message.chatid === state.room?._id){
                setTimeout(() => {
                    document.getElementById('box').scrollTop = document.getElementById('box')?.scrollHeight;
                }, 150);
            }else{
                chat.not_viewed += 1
            }
        },
        removeMessage: (state, message) => {
            const chat = state.rooms.find(c => c._id === message.chatid);
            if(!chat) return;
            chat.messages[message.d]?.messages.splice(message.i, 1)
            if(chat.messages[message.d]?.messages.length === 0){
                chat.messages.splice(message.d, 1)
                chat.lastMessage = chat.messages[message.d-1]?.messages[chat.messages[message.d-1]?.messages?.length-1] || {};
            }else{
                chat.lastMessage = chat.messages[message.d]?.messages[chat.messages[message.d]?.messages?.length-1] || {};
            }
        },
        editMessage:(state, message) => {
            const chat = state.rooms.find(c => c._id === message.chatid);
            if(!chat) return;
            chat.messages[message.d].messages[message.i].text = message.text
            chat.messages[message.d].messages[message.i].updatedAt = 'new Date()';
            if(chat.lastMessage._id === message._id) chat.lastMessage.text = message.text;
        },
        viewMessage: (state, message) => {
            const chat = state.rooms.find(c => c._id === message.chatid);
            if(!chat) return;
            chat.not_viewed = 0;
            chat.messages[message.d].messages[message.i].view = true
            if(chat.lastMessage._id === message._id) chat.lastMessage.view = true;
        },
        typinguser(state, data){
            if(data.userid === state.user._id) return;
            state.rooms.find(c => c._id === data.chatid)
                .room_users.find(u => u._id === data.userid)
                    .typing = data.typing
        },

        change_message: (state, message) => {
            if(message){
                state.changedMessage = message;
                state.messageMenu = true
            }else{
                state.changedMessage = null;
                state.messageMenu = false
            }
        },
        change_mm_post: (state, data) => {
            state.mess_menu_x = data.x;
            state.mess_menu_y = data.y;
        },

        play: (state, data) => {
            // if(!state.media.src){
            state.media.src = data;
            // }
            // state.media.play()
            // if(state.media_paused){
            //     state.media_paused = false;
            //     state.media.play()
            // }else{
            //     state.media_paused = true;
            //     state.media.pause()
            // }
        },
        // set_time: (state, t) => {
        //     if(state.media.src){
        //         state.media.currentTime = state.media.duration * t / 100;
        //     }
        // },
        // media_running: state => state.media.addEventListener('timeupdate', (e) => {
        //     const {duration, currentTime} = e.srcElement;
        //     state.media_time = (currentTime / duration) * 100;
        // }),
        notification: (_, message) => {
            const notification = new Notification(message.sender?.name || 'Telegram', {
                body: message.text,
                silent: true,
                // icon: data.sender.image[0],
                icon: message?.sender?.image[0] || '/icon.jpg',
            });

            let sound = new Audio(require("@/assets/telegram_desktop.mp3"));
            sound.oncanplaythrough = () => {
                var playedPromise = sound.play();
                if (playedPromise) {
                playedPromise
                    .catch((e) => {
                    console.log(e);
                    if (
                        e.name === "NotAllowedError" ||
                        e.name === "NotSupportedError"
                    ) {
                        console.log(e.name);
                    }
                    })
                    .then();
                }
            }
            // notification.onclick = console.log(this);
            setTimeout(() => {
                notification.close();
            }, 4000);
        },
        set_molads: (state, data) => state[data[0]] = data[1],
        set_images: (state, data) => {
            if(data){
                state.images = [...data]
                state.modal_overlay = true
            }else{
                state.images = []
                state.modal_overlay = false
            }
        },
        set_chat_bg: (state, image) => {
            if(image){
                state.chat_bg = URL.createObjectURL(image);
                localStorage.setItem('telegram-clone-chat-bg', state.chat_bg)
            }else{
                state.chat_bg = null;
                localStorage.removeItem('telegram-clone-chat-bg')               
            }
        }
    },
});