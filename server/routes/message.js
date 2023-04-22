import { Router } from 'express'
import { auth, filesend } from '../config/middleware.js'
import { upload } from '../config/upload.js'
import { create, edit, view, remove } from '../controllers/messages.js'

export default Router()
    .post('/', auth, upload.single('file'), filesend, create)
    .put('/:id', auth, edit)
    .put('/view/:id', auth, view)
    .delete('/:id', auth, remove)