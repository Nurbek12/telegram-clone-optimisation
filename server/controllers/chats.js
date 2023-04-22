import Chat from '../models/Chat.js'
import { generateUserColor } from '../config/tools.js'
import { Types } from 'mongoose'
 
export const create = async (req, res) => {
    try{
        const creating = {}
        if(req.body.roomType === 'personal'){
            Object.assign(creating, { users: [ req.user._id, req.body.user ], roomType: 'personal' })
        }else{
            Object.assign(creating, {
                ...req.body,
                users: [req.user._id], 
                admin: req.user._id,
                usercolor: generateUserColor(),
            })
            if(req.file) creating.image = [req.body.file]
        }
        await Chat.create(creating).then(async data => {
            data
                .populate('users', 'name usercolor image username email description')
                .then(result => res.status(200).json({ status: true, result })
            )
        })
    }catch(err){
        console.log(err);
        res.status(500).json({ status: false, message: 'Ошибка' })
    }
}

export const getmy = async (req, res) => {
    try{
        await Chat.aggregate([
            { $match: { users: { $in: [req.user._id] } } },
            {
                $lookup: {
                    from: "tgusers",
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
                    from: "tgmessages",
                    localField: "_id",
                    foreignField: "chatid",
                    as: "messages",
                    pipeline: [
                        {
                            $lookup: {
                                from: "tgusers",
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
                                from: "tgmessages",
                                localField: "reply",
                                foreignField: "_id",
                                as: "reply",
                                pipeline: [
                                    {
                                        $lookup: {
                                            from: "tgusers",
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
                            $sort: { date: 1 }
                        }, 
                    ]
                }
            },
            {
                $lookup: {
                    from: "tgmessages",
                    localField: "_id",
                    foreignField: "chatid",
                    as: "lastMessage",
                    pipeline: [{
                        $sort: { _id: -1 }
                    }]
                }
            },
            {
                $lookup: {
                    from: "tgmessages",
                    localField: "_id",
                    foreignField: "chatid",
                    as: "not_viewed",
                    pipeline: [{
                        $match: {$and: [
                            { sender: { $ne: Types.ObjectId(req.user.id) } },
                            { view: false },
                        ]}
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
                    lastMessage: {$arrayElemAt:["$lastMessage", 0]},
                    not_viewed: { $size: "$not_viewed" },
                }
            }
        ])
        .then(result => {
            res.status(200).json({ status: true, result })
        })
    }catch(err){
        console.log(err)
        res.status(500).json({ status: false, message: 'Ошибка' })
    }
}

export const follow = async (req, res) => {
    try{
        await Chat.findByIdAndUpdate(req.params.id, { $push: { users: req.user._id } }, { new: true })
        .populate('users', 'name usercolor image username email description')
        .then(result => {
            res.status(200).json({ status: true, result })
        })
    }catch(err){
        console.log(err)
        res.status(500).json({ status: false, message: 'Ошибка' })
    }
}

export const unfollow = async (req, res) => {
    try{
        await Chat.findByIdAndUpdate(req.params.id, { $pull: { users: req.user._id } }, { new: true })
        .populate('users', 'name usercolor image username email description')
        .then(result => {
            res.status(200).json({ status: true, result })
        })
    }catch(err){
        console.log(err)
        res.status(500).json({ status: false, message: 'Ошибка' })
    }
}

export const remove = async (req, res) => {
    try{
        Chat.findByIdAndDelete(req.params.id)
            .then(() => res.status(200).json({ status: true }))
    }catch(err){
        res.status(500).json({ status: false, message: 'Ошибка' })
    }
}