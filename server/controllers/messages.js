import Message from '../models/Message.js'

export const create = async (req, res) => {
    try{
        await Message.create(req.body)
            .then(messagee => messagee.populate([
                {
                    path: 'sender',
                    model: 'tgusers',
                    select: ['name', 'usercolor', 'image', 'username', 'email', 'description']
                },
                {
                    path: 'reply',
                    model: 'tgmessages',
                    populate: [{
                        path: 'sender',
                        model: 'tgusers',
                        select: ['name', 'usercolor', 'image']
                    }]
                }
            ]).then(result => res.status(200).json({ status: true, result })))
    }catch(err){
        console.log(err);
        res.status(500).json({ status: false, message: 'Ошибка' })
    }
}

export const view = async (req, res) => {
    try{
        await Message.findByIdAndUpdate(req.params.id, { $set: { view: true } }, { timestamps: false })
        res.status(200).json({ status: true })
    }catch(err){
        res.status(500).json({ status: false, message: 'Ошибка' })
    }
}

export const edit = async (req, res) => {
    try{
        await Message.findByIdAndUpdate(req.params.id, { $set: {text: req.body.text} }, { new: true })
        .then(result => res.status(200).json({ status: true, result }))
    }catch(err){
        res.status(500).json({ status: false, message: 'Ошибка' })
    }
}

export const remove = async (req, res) => {
    try{
        await Message.findByIdAndDelete(req.params.id)
        .then(() => res.status(200).json({ status: true }))
    }catch(err){
        res.status(500).json({ status: false, message: 'Ошибка' })
    }
}