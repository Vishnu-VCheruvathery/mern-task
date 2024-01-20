import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    poster: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    image: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    title: {
        type: String
    },
    description: {
        type: String
    },
    likes: [{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }],
    comments: [{
        commenter: {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        },
        content: {
            type: String
        }
       
    }]
})

export const postModel = mongoose.model('Post', postSchema)