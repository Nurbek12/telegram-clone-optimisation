import User from '../models/User.js'
import Chat from '../models/Chat.js'

export const username = async (req, res) => {
    try{
        User.findOne({ username: req.username })
            .select('name usercolor image username email description')
            .exec((_, result) => res.status(200).json({ status: true, result }) )
    }catch(err){
        res.status(500).json({ status: false, message: 'Ошибка' })
    }
}

export const searchUser = async (req, res) => {
    try{
        const users = await User.find({$and: [
            { name: { $regex: req.params.query, $options: 'i' } },
            { _id: { $ne: req.user._id } }
        ]})
        .select('name usercolor image username email description')
        const chats = await Chat.aggregate([
            { $match: { name: { $regex: req.params.query, $options: 'i' } } },
            {
                $lookup: {
                    from: "users",
                    localField: "users",
                    foreignField: "_id",
                    as: "room_users",
                    pipeline: [{
                        $match: { _id: { 
                                $ne: req.user._id 
                            } }
                        },{
                        $project: {
                            name: 1,
                            usercolor: 1, 
                            image: 1, 
                            username: 1, 
                            email: 1,
                            description: 1
                        }
                    },{
                        $addFields: {
                            typing: false,
                        }
                    }]
                },
            },
            {
                $lookup: {
                    from: "messages",
                    localField: "_id",
                    foreignField: "chatid",
                    as: "messages",
                    pipeline: [
                        {
                            $lookup: {
                                from: "users",
                                localField: "sender",
                                foreignField: "_id",
                                as: "sender",
                                pipeline: [{
                                    $project: {
                                        name: 1,
                                        usercolor: 1, 
                                        image: 1, 
                                        username: 1, 
                                        email: 1,
                                        description: 1
                                    }
                                }]
                            }
                        }, 
                        {
                            $lookup: {
                                from: "messages",
                                localField: "reply",
                                foreignField: "_id",
                                as: "reply",
                                pipeline: [
                                    {
                                        $lookup: {
                                            from: "users",
                                            localField: "sender",
                                            foreignField: "_id",
                                            as: "sender",
                                            pipeline: [{
                                                $project: {
                                                    name: 1,
                                                    usercolor: 1, 
                                                }
                                            }]
                                        }
                                    }, {
                                    $project: {
                                        text: 1,
                                        date: 1, 
                                        chatid: 1, 
                                        file: 1, 
                                        filetype: 1,
                                        sender: {$arrayElemAt:["$sender", 0]}
                                    }
                                }]
                            }
                        }, 
                        {
                            $project: {
                                text: 1, sender: {$arrayElemAt:["$sender", 0]}, reply: {$arrayElemAt:["$reply", 0]},  view: 1, 
                                date: 1, chatid: 1, updatedAt: 1, createdAt: 1, file: 1, filetype: 1,
                            }
                        }, 
                        // {
                        //     $limit: 30
                        // },
                        { 
                            $group: {
                                _id: {
                                    day: {$dayOfMonth: "$createdAt"},
                                    month: {$month: "$createdAt"},
                                },
                                date: { $last: "$date" },
                                messages: { $push: "$$ROOT" }
                            }
                        },
                        {
                            $sort: { _id: 1 }
                        }, 
                    ]
                }
            },
            {
                $lookup: {
                    from: "messages",
                    localField: "_id",
                    foreignField: "chatid",
                    as: "lastMessage",
                    pipeline: [{
                        $sort: { _id: -1 }
                    }]
                }
            },
            {
                $project: {
                    room_users: 1,
                    users: 1,
                    messages: 1,
                    name: 1,
                    admin: 1,
                    username: 1,
                    usercolor: 1,
                    description: 1,
                    image: 1,
                    roomType: 1,
                    lastMessage: {$arrayElemAt:["$lastMessage", 0]}
                }
            }
        ])
        res.status(200).json({ status: true, result: [ ...users, ...chats ] })
    }catch(err){
        console.log(err);
        res.status(500).json({ status: false, message: 'Ошибка' })
    }
}

export const profile = async (req, res) => {
    try{
        res.status(200).json({ status: true, result: req.user })
    }catch(err){
        res.status(500).json({ status: false, message: 'Ошибка' })
    }
}

export const update = async (req, res) => {
    try{
        User.findOneAndUpdate(req.user._id, { $set: req.body }, { new: true })
            .select('name usercolor image username email description')
            .then(result => res.status(200).json({ status: true, result }) )
    }catch(err){
        res.status(500).json({ status: false, message: 'Ошибка' })
    }
}

export const uploadimage = async (req, res) => {
    try{
        if(!req.file || !req.body.file) res.json({ status: false, message: 'Пожалуйста, отправте фото!' })
        User.findOneAndUpdate(req.user._id, { $push: { image: { $each: [req.body.file], $position: 0 } } }, { new: true })
            .then(result => res.status(200).json({ status: true, result }) )
    }catch(err){
        res.status(500).json({ status: false, message: 'Ошибка' })
    }
}

export const removeimage = async (req, res) => {
    try{
        User.findOneAndUpdate(req.user._id, { $pull: { image: req.body.image } }, { new: true })
            .then(result => res.status(200).json({ status: true, result }) )
    }catch(err){
        res.status(500).json({ status: false, message: 'Ошибка' })
    }
}

export const addcontact = async (req, res) => {
    try{
        User.findOneAndUpdate(req.user._id, { $push: { contacts: req.params.id } }, { new: true })
            .then(result => res.status(200).json({ status: true }) )
    }catch(err){
        res.status(500).json({ status: false, message: 'Ошибка' })
    }
}

export const removecontact = async (req, res) => {
    try{
        User.findOneAndUpdate(req.user._id, { $pull: { contacts: req.params.id } }, { new: true })
            .then(result => res.status(200).json({ status: true }) )
    }catch(err){
        res.status(500).json({ status: false, message: 'Ошибка' })
    }
}