import { model, Schema } from "mongoose"

export default model('tgmessages', new Schema({
    text: {
        type: String,
        required: true
    },
    view: {
        type: Boolean,
        default: false
    },
    date: {
        type: Number,
        required: true
    },
    chatid: {
        type: Schema.Types.ObjectId,
        ref: 'tgchats'
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'tgusers'
    },
    reply: {
        type: Schema.Types.ObjectId,
        ref: 'tgessages'
    },
    file: String,
    filetype: String,
}, {
    timestamps: true
}))