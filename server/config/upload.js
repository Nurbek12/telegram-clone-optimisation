import fs from 'fs'
import url from 'url'
import ImageKit from 'imagekit'
import multer from 'multer'
import { join, extname } from 'path'
import { imgprv, imgpub, imgurl } from './keys.js'
import { v4 as uuid } from 'uuid'

const dirname = url.fileURLToPath(new URL('.', import.meta.url))

const storage = multer.diskStorage({
    destination: (_, __, cb) => cb(null, join(dirname, '../', 'upload')),
    filename: (_, file, cb) => cb(null, "file-"+uuid()+extname(file.originalname))
})

export const upload = multer({ storage: storage })

export const imagekit = new ImageKit({
    publicKey: imgpub,
    privateKey: imgprv,
    urlEndpoint: imgurl
})

export const fileurl = (req, file) => `${url.format({ protocol: req.protocol, host: req.get('host') })}/${file.filename}`

export const UploadImage = (file, cb) => fs.readFile(join(dirname, '../', 'upload', file.filename), (_, data) => {
    imagekit.upload({ file: data, fileName : file.filename }, async (_, resp) => cb(resp))
})