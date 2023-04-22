import { config } from "dotenv"

config()

export const mongo = process.env.MONGOURL
export const emailpass = process.env.EMAILPASSWORD
export const emailuser = process.env.EMAILUSER
export const adminemail = process.env.ADMINEMAIL
export const imgprv = process.env.IMAGEKIT_PPV_KEY
export const imgpub = process.env.IMAGEKIT_PUB_KEY
export const imgurl = process.env.IMAGEKIT_URL_END
export const secret = process.env.SECRET
export const port = process.env.PORT