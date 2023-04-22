import { Router } from 'express'
import { auth, filesend } from '../config/middleware.js'
import { upload } from '../config/upload.js'
import { create, getmy, follow, unfollow, remove } from '../controllers/chats.js'

export default Router()
    .get('/', auth, getmy)
    .post('/create', auth, upload.single('image'), filesend, create)
    .put('/follow/:id', auth, follow)
    .put('/unfollow/:id', auth, unfollow)
    .delete('/:id', auth, remove)