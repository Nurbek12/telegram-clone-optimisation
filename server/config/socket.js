import Chat from '../models/Chat.js'
import AU from './socketUsers.js'
const au = new AU()

export default io => io.on('connection', (socket) => {
    socket
        .on('create-connect', id => {
            io.emit('add-online', id)
            au.add(socket, id)
            socket.emit('get-online', au.online())
            Chat.find({ users: { $in: [id] } }).select('_id')
                .then(rooms => rooms.map(el => socket.join(el.id)))
        })
        .on('join-chat', async ({ target, ...chat }) => {
            if (target && au.find(target)) {
                au.find(target).socket.join(chat._id)
                au.find(target).socket.emit('add-new-chat', chat)
            }
            socket.join(chat._id)
        })
        .on('delete-chat', chatid => {
            io.to(chatid).emit('user-delete-chat', chatid)
            socket.leave(chatid)
        })
        .on('add-user', user => {
            io.to(user.chatid).emit('user-add', user)
            socket.join(user.chatid)
        })
        .on('unfollow-group', data => {
            socket.leave(data.chatid)
            io.to(data.chatid).emit('user-unfollow-group', data)
        })
        .on('send-message', (message) => {
            io.to(message.chatid).emit('add-message', message)
        })
        .on('delete-message', (message) => {
            io.to(message.chatid).emit('remove-message', message)
        })
        .on('edit-message', (message) => {
            io.to(message.chatid).emit('editing-message', message)
        })
        .on('view-message', message => {
            io.to(message.chatid).emit('viewing-message', message)
        })
        .on('typing', data => {
            io.to(data.chatid).emit('user-typed', data)
        })
        .on('disconnect', () => {
            io.emit('remove-online', au.findWithSocket(socket.id)?.id)
            au.remove(socket.id)
        })
})