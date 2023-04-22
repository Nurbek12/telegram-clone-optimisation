import { Router } from "express"
import { login, verify } from '../controllers/auths.js'

export default Router()
    .post('/', login)
    .post('/verify', verify)