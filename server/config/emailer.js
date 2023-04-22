import { createTransport } from 'nodemailer'
import { emailpass, emailuser } from './keys.js'

export const sendEmail = (email, txt, sub) => createTransport({
    service: 'gmail',
    auth: { user: emailuser, pass: emailpass }
}).sendMail({
    from: emailuser,
    to: email,
    subject: sub || 'Код для подключить наш мессенжер',
    text: txt
}, (err) => {
    if (err) return 'Ошибка не отправить'
    else return 'Успешная отправка'
})