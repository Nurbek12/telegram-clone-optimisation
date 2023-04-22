import { model, Schema } from "mongoose"

export default model('tgusers', new Schema({
    name: String,
    email: {
        type: String,
        required: true
    },
    registered: {
        type: Boolean,
        default: false
    },
    username: String,
    usercolor: String,
    verifycode: String,
    description: String,
    image: [String],
    contacts: [{
        name: String,
        user: {
            type: Schema.Types.ObjectId,
            ref: 'tgusers'
        }
    }],
}, {
    timestamps: true
}))