import { auth, filesend } from '../config/middleware.js'
import { Router } from "express"
import { upload } from '../config/upload.js'
import { update, profile, addcontact, searchUser, removecontact, removeimage, uploadimage, username } from '../controllers/users.js'

export default Router()
    .get('/u/:username', username)
    .get('/search/:query', auth, searchUser)
    .get('/profile', auth, profile)
    .put('/update', auth, update)

    .put('/avatar/upload', auth, upload.single('image'), filesend, uploadimage)
    .put('/avatar/remove', auth, removeimage)

    .put('/addcontact/:id', auth, addcontact)
    .put('/removecontact/:id', auth, removecontact)