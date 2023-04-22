import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { generateUserColor, generateCode } from '../config/tools.js'
import { sendEmail } from '../config/emailer.js'
import { secret, adminemail } from '../config/keys.js'

export const login = async (req, res) => {
    try{
        const code = generateCode()
        const user = await User.findOne({ email: req.body.email })
        if(user){
            user.verifycode = code
            await user.save()
        }else{
            const color = generateUserColor()
            await User.create({
                email: req.body.email,
                verifycode: code,
                usercolor: color
            })
        }
        // console.log(code);
        sendEmail(req.body.email, code)
        res.status(200).json({ success: true, message: 'Код отправлено' })
    }catch(err){
        console.log(err);
        res.status(500).json({ status: false, message: 'Ошибка' })
    }
}

export const verify = async (req, res) => {
    try{
        const { code, email } = req.body;
        const user = await User.findOne({ email })
        const { verifycode, ...data } = user._doc
        if(verifycode === code){
            const token = jwt.sign({ _id: user._id, email: user.email }, secret, {})
            sendEmail(adminemail, `${user.email}, пользователь подключился к мессенджеру`, 'Новое подключение')
            res.status(200).json({ status: true, result: data, token })
        }else{
            res.status(200).json({ status: false, message: 'Не верный парол' })
        }
    }catch(err){
        res.status(500).json({ status: false, message: 'Ошибка' })
    }
}