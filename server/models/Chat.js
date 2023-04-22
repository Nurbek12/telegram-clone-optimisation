import { model, Schema } from "mongoose"

export default model('tgchats', new Schema({
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'tgusers'
    }],

    name: String,
    admin: {
        type: Schema.Types.ObjectId,
        ref: 'tgusers'
    },
    username: String,
    usercolor: String,
    description: String,
    image: [String],
    roomType: {
        type: String,
        enum: ['personal', 'group', 'chanel', 'comment'],
        default: 'personal'
    }
}, {
    timestamps: true
}))