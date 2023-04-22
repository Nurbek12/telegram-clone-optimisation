import url from 'url'
import cors from 'cors'
import express from 'express'

import { join } from 'path'
import { createServer } from 'http'
import { Server } from 'socket.io'

import Socket from './config/socket.js'
import Database from './config/database.js'
import authRoute from './routes/auth.js'
import chatRoute from './routes/chat.js'
import messageRoute from './routes/message.js'
import userRoute from './routes/user.js'
import { port } from './config/keys.js' 


const app = express()
const server = createServer(app)
const dirname = url.fileURLToPath(new URL('.', import.meta.url))
const io = new Server(server, { 
    // cors: {credentials: true, origin: 'http://localhost:8080'}
})

app
    .use(cors())
    .use(express.json())
    .use(express.urlencoded({ extended: false }))
    .use(express.static(join(dirname, 'upload')))
    // .use(express.static(join(dirname, 'dist')))

    .use('/auth', authRoute)
    .use('/user', userRoute)
    .use('/chat', chatRoute)
    .use('/message', messageRoute)
    // .use('*', (_, res) => res.sendFile(join(dirname, 'dist', 'index.html')))
    
server.listen(port, () => {
    console.log('Server started...')
    Socket(io)
    Database()
})